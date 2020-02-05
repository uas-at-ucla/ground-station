import produce from "immer";

import { AppAction } from "../actions/actionTypes";
import { Sensors, Output } from "protobuf/drone/messages_pb";
import { Mission } from "protobuf/interop/interop_api_pb";
import { UGV_Message } from "protobuf/ugv/ugv_messages_pb";

const initialState = {
  droneTelemetry: undefined as
    | { sensors: Sensors.AsObject; output: Output.AsObject }
    | undefined,
  playback: false,
  recording: false,
  telemetryData: new Array<{
    sensors: Sensors.AsObject;
    output: Output.AsObject;
  }>(),
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
    case "PING": {
      state.pingDelay = action.payload;
      return;
    }
    case "TELEMETRY": {
      if (!state.playback) {
        state.droneTelemetry = action.payload;
        // if recording add to list
        if (state.recording) {
          state.telemetryData.push(action.payload);
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
    case "GIMBAL_SETPOINT": {
      state.setpoints.gimbal = action.payload;
      return;
    }
    case "DEPLOYMENT_MOTOR_SETPOINT": {
      state.setpoints.deployment = action.payload;
      return;
    }
    case "LATCH_SETPOINT": {
      state.setpoints.latch = action.payload;
      return;
    }
    case "HOTWIRE_SETPOINT": {
      state.setpoints.hotwire = action.payload;
      return;
    }
    case "CENTER_ON_DRONE": {
      if (state.droneTelemetry) {
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
      if (action.payload) {
        const mission = action.payload.mission as Mission.AsObject;
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
      const ugvMessage = action.payload as UGV_Message.AsObject;
      if (ugvMessage.status !== undefined) {
        state.ugvStatus = ugvMessage.status;
      }
      return;
    }
  }
}, initialState) as (a: any, b: any) => TelemetryState;
