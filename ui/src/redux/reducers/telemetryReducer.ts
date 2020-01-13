import { AppAction } from "../actions/actionTypes";

const initialState = {
  droneTelemetry: undefined as any,
  playback: false,
  recording: false,
  telemetryData: new Array<any>(),
  pingDelay: undefined as number | undefined,
  mapCenter: { lat: 38.147483, lng: -76.427778 },
  ugvStatus: undefined as any,
  setpoints: {
    gimbal: undefined as number | undefined,
    deployment: undefined as number | undefined,
    latch: undefined as boolean | undefined,
    hotwire: undefined as boolean | undefined
  }
};
export type TelemetryState = typeof initialState;

export default function reducer(
  state = initialState,
  action: AppAction
): TelemetryState {
  switch (action.type) {
    case "RESET_REDUX_STATE": {
      return initialState;
    }
    case "PING": {
      return { ...state, pingDelay: action.payload };
    }
    case "TELEMETRY": {
      if (!state.playback) {
        const newState = { ...state, droneTelemetry: action.payload };
        // if recording add to list
        if (state.recording) {
          newState.telemetryData.push(action.payload);
        }
        return newState;
      } else {
        return state;
      }
    }
    case "TOGGLE_PLAYBACK": {
      return { ...state, playback: !state.playback };
    }
    case "TOGGLE_RECORD": {
      return { ...state, recording: !state.recording };
    }
    case "PLAYBACK": {
      return { ...state, droneTelemetry: action.payload };
    }
    case "GIMBAL_SETPOINT": {
      return {
        ...state,
        setpoints: { ...state.setpoints, gimbal: action.payload }
      };
    }
    case "DEPLOYMENT_MOTOR_SETPOINT": {
      return {
        ...state,
        setpoints: { ...state.setpoints, deployment: action.payload }
      };
    }
    case "LATCH_SETPOINT": {
      return {
        ...state,
        setpoints: { ...state.setpoints, latch: action.payload }
      };
    }
    case "HOTWIRE_SETPOINT": {
      return {
        ...state,
        setpoints: { ...state.setpoints, hotwire: action.payload }
      };
    }
    case "CENTER_ON_DRONE": {
      if (state.droneTelemetry) {
        return {
          ...state,
          mapCenter: {
            lat: state.droneTelemetry.sensors.latitude,
            lng: state.droneTelemetry.sensors.longitude
          }
        };
      } else {
        return state;
      }
    }
    case "CENTER_ON_COMMAND": {
      return { ...state, mapCenter: action.payload.pos };
    }
    case "INTEROP_DATA": {
      if (!action.payload) {
        return state;
      }
      return {
        ...state,
        mapCenter: {
          lat: action.payload.mission.airDropPos.latitude,
          lng: action.payload.mission.airDropPos.longitude
        }
      };
    }
    case "UGV_MESSAGE": {
      if (action.payload.status === undefined) {
        return state;
      }
      return { ...state, ugvStatus: action.payload.status };
    }
    default: {
      return state;
    }
  }
}
