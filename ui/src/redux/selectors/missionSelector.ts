import { createSelector } from "reselect";

import { AppState } from "../store";
import { Position3D } from "protobuf/drone/mission_commands_pb";
import { FlyZone, Position } from "protobuf/interop/interop_api_pb";
import { GroundCommand } from "protobuf/drone/timeline_grammar_pb";

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

export const locationCommands = createSelector(
  [
    (state: AppState) => state.mission.commands,
    (state: AppState) => state.mission.commandOrder
  ],
  (commands, commandOrder) => {
    const locationCommands: {
      [id: string]: {
        cmdType: keyof GroundCommand.AsObject;
        location: Position3D.AsObject;
      };
    } = {};
    const locationCommandOrder: string[] = [];
    for (const cmdId of commandOrder) {
      const cmd = commands[cmdId];
      const cmdType = Object.keys(cmd)[0] as keyof typeof cmd;
      if (cmdType !== "waitCommand") {
        let location: Position3D.AsObject;
        if (cmdType === "surveyCommand") {
          const cmdObj = cmd[cmdType];
          if (!cmdObj) {
            throw new Error("Unreachable");
          }
          let lat = 0;
          let lng = 0;
          for (const vertex of cmdObj.surveyPolygonList) {
            lat += vertex.latitude;
            lng += vertex.longitude;
          }
          lat /= cmdObj.surveyPolygonList.length;
          lng /= cmdObj.surveyPolygonList.length;
          location = {
            latitude: lat,
            longitude: lng,
            altitude: cmdObj.altitude
          };
        } else {
          const cmdObj = cmd[cmdType];
          if (!cmdObj) {
            throw new Error("Unreachable");
          }
          location = cmdObj.goal;
        }
        if (location) {
          locationCommands[cmdId] = {
            cmdType: cmdType,
            location: location
          };
          locationCommandOrder.push(cmdId);
        }
      }
    }
    return {
      commands: locationCommands,
      order: locationCommandOrder
    };
  }
);

export const groundProgramPath = createSelector(
  [locationCommands],
  locationCommands =>
    locationCommands.order.map(cmdId => ({
      lat: locationCommands.commands[cmdId].location.latitude,
      lng: locationCommands.commands[cmdId].location.longitude
    }))
);

export const droneProgramPath = createSelector(
  [(state: AppState) => state.mission.droneProgram],
  droneProgram => {
    if (!droneProgram) {
      return [];
    }
    const path = [];
    for (const cmd of droneProgram.commandsList) {
      const cmdType = Object.keys(cmd)[0] as keyof typeof cmd;
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
    let mainFlyZone: Required<FlyZone.AsObject> & { isClockwise: boolean } = {
      boundaryPointsList: [],
      altitudeMin: 0,
      altitudeMax: 0,
      isClockwise: false
    };
    let maxArea = -1;
    for (const flyZone of interopData.mission.flyZonesList as Required<
      FlyZone.AsObject
    >[]) {
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
