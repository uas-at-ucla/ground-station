import shortid from "shortid";

import { MissionState } from "redux/reducers/missionReducer";
import { GroundCommand } from "protobuf/drone/timeline_grammar_pb";
import { Position2D, Position3D } from "protobuf/drone/mission_commands_pb";

const makeDummyPosition2D: () => Position2D.AsObject = () => ({
  latitude: 0,
  longitude: 0
});

const makeDummyPosition3D: () => Position3D.AsObject = () => ({
  latitude: 0,
  longitude: 0,
  altitude: 0
});

const makeDefaultCommand: () => Required<GroundCommand.AsObject> = () => ({
  flyThroughCommand: {
    goal: makeDummyPosition3D()
  },
  landAtLocationCommand: {
    goal: makeDummyPosition3D()
  },
  offAxisCommand: {
    goal: makeDummyPosition3D(),
    subjectLocation: makeDummyPosition2D()
  },
  surveyCommand: {
    altitude: 0,
    surveyPolygonList: []
  },
  ugvDropCommand: {
    goal: makeDummyPosition3D()
  },
  waitCommand: {
    time: 0
  },
  waypointCommand: {
    goal: makeDummyPosition3D()
  }
});

export const centerMapOnCommand = (
  commands: MissionState["commands"],
  cmdId: string
) => {
  const cmd = commands[cmdId];
  const cmdType = Object.keys(cmd)[0] as keyof GroundCommand.AsObject;
  if (cmdType !== "waitCommand" && cmdType !== "surveyCommand") {
    const location = cmd[cmdType]?.goal;
    if (location) {
      return {
        type: "CENTER_ON_COMMAND" as const,
        payload: {
          id: cmdId,
          pos: {
            lat: location.latitude,
            lng: location.longitude
          }
        }
      };
    }
  }
  return { type: "NONE" as const };
};

export const commandStopAnimation = (cmdId: string) => ({
  type: "COMMAND_STOP_ANIMATION" as const,
  payload: { id: cmdId }
});

export const addCommand = (command: GroundCommand.AsObject) => ({
  type: "ADD_COMMAND" as const,
  payload: {
    id: shortid.generate(), // ID is generated here rather than in reducer because the reducer is suposed to be a "pure" function.
    command: command
  }
});

// export const addWaypointCommand = (options: any, protoInfo: any) =>
//   addCommand("waypoint_command", options, protoInfo);
// export const addFlyThroughCommand = (options: any, protoInfo: any) =>
//   addCommand("fly_through_command", options, protoInfo);

export const deleteCommand = (id: string) => ({
  type: "DELETE_COMMAND" as const,
  payload: id
});

export const reorderCommand = (oldIndex: number, newIndex: number) => ({
  type: "REORDER_COMMAND" as const,
  payload: {
    oldIndex: oldIndex,
    newIndex: newIndex
  }
});

export const changeCommandType = (
  id: string,
  command: GroundCommand.AsObject,
  newType: keyof GroundCommand.AsObject
) => {
  const oldType = Object.keys(command)[0] as keyof GroundCommand.AsObject;
  const newCommand: GroundCommand.AsObject = {
    [newType]: makeDefaultCommand()[newType]
  };
  if (
    oldType !== "waitCommand" &&
    oldType !== "surveyCommand" &&
    newType !== "waitCommand" &&
    newType !== "surveyCommand"
  ) {
    const oldCmdObj = command[oldType];
    const newCmdObj = newCommand[newType];
    if (!oldCmdObj || !newCmdObj) {
      throw new Error("Impossible!");
    }
    newCmdObj.goal = oldCmdObj.goal;
  }
  return {
    type: "CHANGE_COMMAND_TYPE" as const,
    payload: {
      id: id,
      newCommand: newCommand
    }
  };
};

export const changeCommandField = (
  dotProp: string,
  newValue: number,
  isAltitude?: boolean
) => ({
  type: "CHANGE_COMMAND_FIELD" as const,
  payload: {
    dotProp: dotProp,
    newValue: newValue,
    isAltitude: isAltitude
  }
});

// export const addRepeatedField = (
//   dotProp: string,
//   type: string,
//   protoInfo: any
// ) => ({
//   type: "ADD_REPEATED_FIELD" as const,
//   payload: {
//     dotProp: dotProp,
//     newObject: createMissionObject(type, null, protoInfo)
//   }
// });

// export const popRepeatedField = (dotProp: string) => ({
//   type: "POP_REPEATED_FIELD" as const,
//   payload: {
//     dotProp: dotProp
//   }
// });

// function createCommand(name: string, options: any, protoInfo: any) {
//   const command: any = {};
//   const type = protoInfo.timelineGrammar.GroundCommand.fields[name].type;
//   command[name] = createMissionObject(type, options, protoInfo);
//   command.type = type; // not part of protobuf, but helpful info
//   command.name = name; // not part of protobuf, but helpful info
//   command.id = shortid.generate(); // not part of protobuf, but helpful info
//   return command;
// }

// function createMissionObject(type: string, options: any, protoInfo: any) {
//   // Custom function to recursively create object based on protobuf definition
//   let missionObject: any;
//   if (protoInfo.timelineGrammar[type]) {
//     // object is a protobuf defined object
//     missionObject = {};
//     for (const fieldName in protoInfo.timelineGrammar[type].fields) {
//       const field = protoInfo.timelineGrammar[type].fields[fieldName];
//       if (field.rule === "repeated") {
//         // repeated objects are stored in arrays
//         missionObject[fieldName] = [];
//         if (options && options[fieldName]) {
//           for (const fieldElement of options[fieldName]) {
//             missionObject[fieldName].push(
//               createMissionObject(field.type, fieldElement, protoInfo)
//             );
//           }
//         } else {
//           missionObject[fieldName].push(
//             createMissionObject(field.type, null, protoInfo)
//           );
//         }
//       } else {
//         missionObject[fieldName] = createMissionObject(
//           field.type,
//           options ? options[fieldName] : null,
//           protoInfo
//         );
//       }
//     }
//   } else {
//     // object is a primitive, i.e. a number or a string
//     if (options != null) {
//       missionObject = options;
//     } else {
//       // assume that the field is a number (all of them are currently)
//       missionObject = 0;
//     }
//   }

//   return missionObject;
// }

// function setLocationFields(options: any, protoInfo: any) {
//   // Set all location fields so location is preserved when changing command types
//   let location = null;
//   for (const locationField of protoInfo.locationFields) {
//     if (options[locationField]) {
//       location = options[locationField];
//       break;
//     }
//   }
//   if (location) {
//     for (const locationField of protoInfo.locationFields) {
//       options[locationField] = location;
//     }
//   }
//   return options;
// }
