import produce from "immer";
import arrayMove from "array-move";

import { AppAction } from "../actions/actionTypes";
import {
  GroundCommand,
  DroneProgram
} from "protobuf/drone/timeline_grammar_pb";
import { InteropData } from "messages";

const initialState = {
  commands: {} as { [id: string]: GroundCommand.AsObject },
  commandOrder: new Array<string>(),
  defaultAltitude: 100,
  commandAnimate: {} as { [s: string]: boolean },
  droneProgram: undefined as DroneProgram.AsObject | undefined,
  missionCompiled: false,
  missionUploaded: false,
  lastDroppyCommand: undefined as string | undefined,
  interopData: undefined as InteropData | undefined
};
export type MissionState = typeof initialState;

export default produce((state: MissionState, action: AppAction) => {
  switch (action.type) {
    case "RESET_REDUX_STATE": {
      Object.assign(state, initialState);
      return;
    }
    case "INTEROP_DATA": {
      state.interopData = action.payload[0];
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
    case "CHANGE_COMMAND_TYPE": {
      state.commands[action.payload.id] = action.payload.newCommand;
      state.missionCompiled = false;
      return;
    }
    case "CHANGE_COMMAND_FIELD": {
      const dotProp = action.payload.dotProp.split(".");
      const field = dotProp.pop() as string;
      dotProp.reduce((o: any, i: string | number) => o[i], state.commands)[
        field
      ] = action.payload.newValue;
      state.missionCompiled = false;
      if (action.payload.isAltitude) {
        state.defaultAltitude = action.payload.newValue;
      }
      return;
    }
    case "ADD_REPEATED_FIELD": {
      const dotProp = action.payload.dotProp.split(".");
      dotProp
        .reduce((o: any, i: string | number) => o[i], state.commands)
        .push(action.payload.newElement);
      state.missionCompiled = false;
      return;
    }
    case "POP_REPEATED_FIELD": {
      const dotProp = action.payload.dotProp.split(".");
      dotProp
        .reduce((o: any, i: string | number) => o[i], state.commands)
        .pop();
      state.missionCompiled = false;
      return;
    }
    case "CENTER_ON_COMMAND": {
      if (action.payload.id) {
        state.commandAnimate[action.payload.id] = true;
      }
      return;
    }
    case "COMMAND_STOP_ANIMATION": {
      state.commandAnimate[action.payload.id] = false;
      return;
    }
    case "COMPILED_DRONE_PROGRAM":
    case "UPLOADED_DRONE_PROGRAM": {
      const droneProgram = action.payload[0];
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
      state.lastDroppyCommand = action.payload[0];
      return;
    }
    default: {
      return;
    }
  }
}, initialState) as (a: any, b: any) => MissionState;
