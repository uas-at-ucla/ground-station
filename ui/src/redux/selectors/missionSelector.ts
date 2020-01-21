import { createSelector } from "reselect";
import { createObjectSelector } from "reselect-map";

import { AppState } from "../store";
import {
  GroundCommand,
  DroneCommand
} from "protobuf/drone/timeline_grammar_pb";
import { Position3D } from "protobuf/drone/mission_commands_pb";
import { FlyZone, Position } from "protobuf/interop/interop_api_pb";

function getCommandName(cmd: GroundCommand.AsObject) {
  Object.keys(cmd).filter(key => key !== "id");
}

// createObjectSelector is more efficient because it only recalculates for commands that have changed
export const commandMarkers = createObjectSelector(
  [(state: AppState) => state.mission.commands],
  cmd => {
    //TODO this might be hard
    let location: Position3D.AsObject | null = null;
    let label: google.maps.MarkerLabel | null = null;

    if (cmd.flyThroughCommand) {
      location = cmd.flyThroughCommand.goal;
    } else if (cmd.landAtLocationCommand) {
      location = cmd.landAtLocationCommand.goal;
      label = {
        fontFamily: "Fontawesome",
        text: "\uf063",
        fontSize: "15px"
      };
    } else if (cmd.offAxisCommand) {
      location = cmd.offAxisCommand.goal;
    } else if (cmd.ugvDropCommand) {
      location = cmd.ugvDropCommand.goal;
      label = {
        fontFamily: "Fontawesome",
        text: "\uf187",
        fontSize: "15px"
      };
    } else if (cmd.waypointCommand) {
      location = cmd.waypointCommand.goal;
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
      return {
        id: cmdId,
        name: "TODO", //TODO
        marker: marker,
        infobox: {
          position: marker.position,
          title: index + 1 + ": " + "", // TODO protoInfo.commandAbbr[cmd.name]
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
    if (!interopData) {
      return null;
    }
    let maxArea = -1;
    let mainFlyZone: FlyZone.AsObject & { isClockwise: boolean } = {
      boundaryPointsList: [],
      isClockwise: false
    };
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
