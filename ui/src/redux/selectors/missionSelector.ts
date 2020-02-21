import { createSelector } from "reselect";
import { createObjectSelector } from "reselect-map";

import { AppState } from "../store";
import { DroneCommand } from "protobuf/drone/timeline_grammar_pb";
import { Position3D } from "protobuf/drone/mission_commands_pb";
import { FlyZone, Position } from "protobuf/interop/interop_api_pb";

//TODO Start relying less on reducers and put this logic in components.

export const lostCommsMapCoord = createSelector(
  [(state: AppState) => state.mission.interopData],
  interopData => {
    if (!interopData) {
      return null;
    }
    const lostCommsPos = interopData.mission.lostCommsPos as Required<
      Position.AsObject
    >;
    return {
      lat: lostCommsPos.latitude,
      lng: lostCommsPos.longitude
    };
  }
);

// createObjectSelector is more efficient because it only recalculates for commands that have changed
export const commandMarkers = createObjectSelector(
  [(state: AppState) => state.mission.commands],
  cmd => {
    let location: Position3D.AsObject | undefined = undefined;
    let label: google.maps.MarkerLabel | null = null;

    const cmdType = Object.keys(cmd)[0] as keyof typeof cmd;

    if (cmdType !== "waitCommand" && cmdType !== "surveyCommand") {
      location = cmd[cmdType]?.goal;
    }

    switch (cmdType) {
      case "surveyCommand":
      case "waitCommand":
      case "flyThroughCommand":
      case "offAxisCommand":
        break;
      case "landAtLocationCommand":
        label = {
          fontFamily: "Fontawesome",
          text: "\uf063",
          fontSize: "15px"
        };
        break;
      case "ugvDropCommand":
        label = {
          fontFamily: "Fontawesome",
          text: "\uf187",
          fontSize: "15px"
        };
        break;
      case "waypointCommand":
        label = {
          fontFamily: "Fontawesome",
          text: "\uf192",
          fontSize: "15px"
        };
    }

    if (location) {
      return {
        altitude: location.altitude,
        position: {
          lat: location.latitude,
          lng: location.longitude
        },
        label: label
      };
    }
    return null; // if cmd does not have a location (e.g. a SleepCommand)
  }
);

export const commandPoints = createSelector(
  [
    (state: AppState) => state.mission.commands,
    (state: AppState) => state.mission.commandOrder,
    commandMarkers
  ],
  (commands, commandOrder, commandMarkers) => {
    return commandOrder.map((cmdId, index) => {
      const marker = (commandMarkers as any)[cmdId]; // TODO (problems with createObjectSelector, we probably want to ditch that and move this code into the actual Map component)
      if (!marker) {
        return null;
      }
      const cmdType = Object.keys(commands[cmdId])[0];
      return {
        id: cmdId,
        name: cmdType,
        marker: marker,
        infobox: {
          position: marker.position,
          title: index + 1 + ": " + cmdType,
          content: "Altitude: " + marker.altitude + " ft rel"
        }
      };
    });
  }
);

export const droneProgramPath = createSelector(
  [(state: AppState) => state.mission.droneProgram],
  droneProgram => {
    if (!droneProgram) {
      return [];
    }
    const path = [];
    for (const cmd of droneProgram.commandsList) {
      const cmdType = Object.keys(cmd)[0] as keyof DroneCommand.AsObject;
      if (cmdType === "translateCommand") {
        const location = cmd[cmdType]?.goal;
        if (location) {
          path.push({
            lat: location.latitude,
            lng: location.longitude
          });
        }
      }
    }
    return path;
  }
);

export const mainFlyZone = createSelector(
  [(state: AppState) => state.mission.interopData],
  interopData => {
    let mainFlyZone: FlyZone.AsObject & { isClockwise: boolean } = {
      boundaryPointsList: [],
      isClockwise: false
    };
    if (!interopData) {
      return mainFlyZone;
    }
    let maxArea = -1;
    for (const flyZone of interopData.mission.flyZonesList) {
      const area = polygonArea(
        flyZone.boundaryPointsList as Required<Position.AsObject>[]
      );
      if (area > maxArea) {
        maxArea = area;
        mainFlyZone = { ...flyZone, isClockwise: false };
      }
    }
    mainFlyZone.isClockwise = polygonIsClockwise(
      mainFlyZone.boundaryPointsList as Required<Position.AsObject>[]
    );
    return mainFlyZone;
  }
);

function shoelace(vertices: { latitude: number; longitude: number }[]) {
  // The shoelace formula determines the area of a polygon
  let area = 0;

  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    area += vertices[i].longitude * vertices[j].latitude;
    area -= vertices[j].longitude * vertices[i].latitude;
  }

  return area;
}

function polygonArea(vertices: { latitude: number; longitude: number }[]) {
  return Math.abs(shoelace(vertices));
}

function polygonIsClockwise(
  vertices: { latitude: number; longitude: number }[]
) {
  // Determine whether vertices are clockwise/counterclockwise using the
  // sign of the output from the shoelace formula.
  return shoelace(vertices) < 0;
}
