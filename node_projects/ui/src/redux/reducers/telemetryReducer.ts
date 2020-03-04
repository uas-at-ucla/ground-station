import produce from "immer";

import { AppAction } from "../actions/actionTypes";
import { Mission } from "protobuf/interop/interop_api_pb";
import { UGV_Message } from "protobuf/ugv/ugv_messages_pb";
import { DroneTelemetry } from "messages";

const initialState = {
  droneTelemetry: undefined as DroneTelemetry | undefined,
  playback: false,
  recording: false,
  telemetryData: new Array<DroneTelemetry>(),
  pingDelay: undefined as number | undefined,
  mapCenter: { lat: 38.147483, lng: -76.427778 },
  ugvStatus: undefined as UGV_Message.AsObject["status"],
  setpoints: {
    gimbal: undefined as number | undefined,
    deployment: undefined as number | undefined,
    latch: undefined as boolean | undefined,
    hotwire: undefined as boolean | undefined
  }
};
export type TelemetryState = typeof initialState;

export default produce((state: TelemetryState, action: AppAction) => {
  switch (action.type) {
    case "RESET_REDUX_STATE": {
      Object.assign(state, initialState);
      return;
    }
    // case "PING": {
    //   state.pingDelay = action.payload; //TODO
    //   return;
    // }
    case "TELEMETRY": {
      if (!state.playback) {
        state.droneTelemetry = action.payload[0];
        // if recording add to list
        if (state.recording) {
          state.telemetryData.push(action.payload[0]);
        }
      }
      return;
    }
    case "TOGGLE_PLAYBACK": {
      state.playback = !state.playback;
      return;
    }
    case "TOGGLE_RECORD": {
      state.recording = !state.recording;
      return;
    }
    case "PLAYBACK": {
      state.droneTelemetry = action.payload;
      return;
    }
    case "CENTER_ON_DRONE": {
      if (state.droneTelemetry && state.droneTelemetry.sensors) {
        state.mapCenter = {
          lat: state.droneTelemetry.sensors.latitude,
          lng: state.droneTelemetry.sensors.latitude
        };
      }
      return;
    }
    case "CENTER_ON_COMMAND": {
      state.mapCenter = action.payload.pos;
      return;
    }
    case "INTEROP_DATA": {
      if (action.payload[0]) {
        const mission = action.payload[0].mission;
        if (
          mission.airDropPos &&
          mission.airDropPos.latitude &&
          mission.airDropPos.longitude
        ) {
          state.mapCenter = {
            lat: mission.airDropPos.latitude,
            lng: mission.airDropPos.longitude
          };
        }
      }
      return;
    }
    case "UGV_MESSAGE": {
      const ugvMessage = action.payload[0];
      if (ugvMessage.status !== undefined) {
        state.ugvStatus = ugvMessage.status;
      }
      return;
    }
    default: {
      return;
    }
  }
}, initialState) as (a: any, b: any) => TelemetryState;
