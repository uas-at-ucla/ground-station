import produce from "immer";
import arrayMove from "array-move";

import { AppAction } from "../actions/actionTypes";
import {
  GroundCommand,
  DroneProgram
} from "protobuf/drone/timeline_grammar_pb";
import { Mission } from "protobuf/interop/interop_api_pb";

const initialState = {
  commands: {} as { [id: string]: GroundCommand.AsObject },
  commandOrder: new Array<string>(),
  defaultAltitude: 100,
  commandAnimate: {} as { [s: string]: boolean },
  droneProgram: undefined as DroneProgram.AsObject | undefined,
  missionCompiled: false,
  missionUploaded: false,
  lastDroppyCommand: undefined as string | undefined,
  interopData: undefined as
    | { mission: Required<Mission.AsObject>; ip: string }
    | undefined,
  ugvDestination: { lat: 38.14617, lng: -76.42642 } // Official competition location
};
export type MissionState = typeof initialState;

export default produce((state: MissionState, action: AppAction) => {
  switch (action.type) {
    case "RESET_REDUX_STATE": {
      Object.assign(state, initialState);
      return;
    }
    case "INTEROP_DATA": {
      convertInteropToProtobufJson(action.payload);
      state.interopData = action.payload;
      return;
    }
    case "ADD_COMMAND": {
      state.commands[action.payload.id] = action.payload.command;
      state.commandOrder.push(action.payload.id);
      state.missionCompiled = false;
      return;
    }
    case "DELETE_COMMAND": {
      delete state.commands[action.payload];
      state.commandOrder.splice(state.commandOrder.indexOf(action.payload), 1);
      state.missionCompiled = false;
      return;
    }
    case "REORDER_COMMAND": {
      state.commandOrder = arrayMove(
        state.commandOrder,
        action.payload.oldIndex,
        action.payload.newIndex
      );
      state.missionCompiled = false;
      return;
    }
    // case "CHANGE_COMMAND_TYPE": {
    //   state.commands[action.payload.index] = action.payload.newCommand;
    //   state.missionCompiled = false;
    //   return;
    // }
    case "CHANGE_COMMAND_FIELD": {
      const dotProp = action.payload.dotProp.split(".");
      const field = dotProp.pop() as string;
      dotProp.reduce((o: any, i) => o[i], state.commands)[field] =
        action.payload.newValue;
      state.missionCompiled = false;
      if (action.payload.isAltitude) {
        state.defaultAltitude = action.payload.newValue;
      }
      return;
    }
    // case "ADD_REPEATED_FIELD": {
    //   const dotProp = action.payload.dotProp.split(".");
    //   dotProp
    //     .reduce((o: any, i) => o[i], state.commands)
    //     .push(action.payload.newObject);
    //   state.missionCompiled = false;
    //   return;
    // }
    // case "POP_REPEATED_FIELD": {
    //   const dotProp = action.payload.dotProp.split(".");
    //   dotProp.reduce((o: any, i) => o[i], state.commands).pop();
    //   state.missionCompiled = false;
    //   return;
    // }
    case "CENTER_ON_COMMAND": {
      state.commandAnimate[action.payload.id] = true;
      return;
    }
    case "COMMAND_STOP_ANIMATION": {
      state.commandAnimate[action.payload.id] = false;
      return;
    }
    case "COMPILED_DRONE_PROGRAM":
    case "UPLOADED_DRONE_PROGRAM": {
      const droneProgram = action.payload as DroneProgram.AsObject;
      if (!droneProgram.commandsList) {
        droneProgram.commandsList = [];
      }
      state.droneProgram = droneProgram;
      if (action.type === "UPLOADED_DRONE_PROGRAM") {
        state.missionUploaded = true;
      } else {
        state.missionCompiled = true;
        state.missionUploaded = false;
      }
      return;
    }
    case "DROPPY_COMMAND_RECEIVED": {
      state.lastDroppyCommand = action.payload;
      return;
    }
    default: {
      return;
    }
  }
}, initialState) as (a: any, b: any) => MissionState;

function convertInteropToProtobufJson(interopJson: any) {
  for (const key in interopJson) {
    if (typeof interopJson[key] === "object") {
      convertInteropToProtobufJson(interopJson[key]);
    }
    if (Array.isArray(interopJson[key])) {
      interopJson[`${key}List`] = interopJson[key];
      delete interopJson[key];
    }
  }
}
