import { createSelector } from "reselect";
import { createObjectSelector } from "reselect-map";
import { AppState } from "../store";

export const protoInfo = createSelector(
  [(state: AppState) => state.mission.timelineGrammar],
  timelineGrammar => {
    // Create objects that make it easy to get info about the proto definition
    if (!timelineGrammar) {
      return null;
    }
    const groundCommandNames =
      timelineGrammar.GroundCommand.oneofs.command.oneof;
    const commandAbbr: { [s: string]: string } = {};
    for (const commandName of groundCommandNames) {
      const commandType =
        timelineGrammar.GroundCommand.fields[commandName].type;
      commandAbbr[commandName] = commandType.replace("Command", "");
    }
    const droneCommandNames = timelineGrammar.DroneCommand.oneofs.command.oneof;
    for (const commandName of droneCommandNames) {
      const commandType = timelineGrammar.DroneCommand.fields[commandName].type;
      commandAbbr[commandName] = commandType.replace("Command", "");
    }
    return {
      timelineGrammar: timelineGrammar,
      commandNames: groundCommandNames,
      commandAbbr: commandAbbr,
      fieldUnits: {
        DroneProgram: {
          altitude: "m"
        },
        GroundProgram: {
          altitude: "ft"
        }
      },
      locationFields: ["goal", "ground_target", "photographer_location"]
    };
  }
);

export const commandsById = createSelector(
  [(state: AppState) => state.mission.commands],
  commands =>
    commands.reduce((map, cmd) => {
      map[cmd.id] = cmd;
      return map;
    }, {})
);

// createObjectSelector is more efficient because it only recalculates for commands that have changed
export const commandMarkers = createObjectSelector(
  [commandsById, protoInfo],
  (cmd: any, protoInfo) => {
    if (!protoInfo) {
      return null;
    }
    for (const locationField of protoInfo.locationFields) {
      if (cmd[cmd.name][locationField]) {
        let label = null;
        if (cmd.type === "WaypointCommand") {
          label = {
            fontFamily: "Fontawesome",
            text: "\uf192",
            fontSize: "15px"
          };
        } else if (cmd.type === "UgvDropCommand") {
          label = {
            fontFamily: "Fontawesome",
            text: "\uf187",
            fontSize: "15px"
          };
        } else if (cmd.type === "LandAtLocationCommand") {
          label = {
            fontFamily: "Fontawesome",
            text: "\uf063",
            fontSize: "15px"
          };
        }
        const location = cmd[cmd.name][locationField];
        return {
          altitude: location.altitude,
          position: {
            lat: location.latitude,
            lng: location.longitude
          },
          label: label
        };
      }
    }
    return null; // if cmd does not have a location (e.g. a SleepCommand)
  }
);

export const commandPoints = createSelector(
  [(state: AppState) => state.mission.commands, commandMarkers, protoInfo],
  (commands, commandMarkers: any, protoInfo) => {
    return commands.map((cmd, index) => {
      const marker = commandMarkers[cmd.id];
      if (!marker || !protoInfo) {
        return null;
      }
      return {
        id: cmd.id,
        name: cmd.name,
        marker: marker,
        infobox: {
          position: marker.position,
          title: index + 1 + ": " + protoInfo.commandAbbr[cmd.name],
          content: "Altitude: " + marker.altitude + " ft rel"
        }
      };
    });
  }
);

export const droneProgramPath = createSelector(
  [(state: AppState) => state.mission.droneProgram, protoInfo],
  (droneProgram, protoInfo) => {
    if (!droneProgram || !protoInfo) {
      return [];
    }
    const path = [];
    for (const cmd of droneProgram.commands) {
      for (const locationField of protoInfo.locationFields) {
        if (cmd[cmd.name][locationField]) {
          const location = cmd[cmd.name][locationField];
          path.push({
            lat: location.latitude,
            lng: location.longitude
          });
          break;
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
    let mainFlyZone = null;
    for (const flyZone of interopData.mission.flyZones) {
      const area = polygonArea(flyZone.boundaryPoints);
      if (area > maxArea) {
        maxArea = area;
        mainFlyZone = { ...flyZone };
      }
    }
    mainFlyZone.isClockwise = polygonIsClockwise(mainFlyZone.boundaryPoints);
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
