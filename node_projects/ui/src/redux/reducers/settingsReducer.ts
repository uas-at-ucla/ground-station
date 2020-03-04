import produce from "immer";

import { AppAction } from "../actions/actionTypes";

const isWebServer = window.location.protocol.startsWith("http");
const defaultIP = "localhost";
export const defaultSocketHost = isWebServer
  ? window.location.hostname
  : defaultIP;
export const defaultSocketPort = 8081;

export const defaultInteropIP = "167.71.120.140:8000";

const initialState = {
  gndServerIp: defaultSocketHost + ":" + defaultSocketPort,
  connectedGndServerIp: defaultSocketHost + ":" + defaultSocketPort,
  gndServerConnected: false,
  interopIp: defaultInteropIP,
  interopUsername: "testuser",
  interopPassword: "testpass",
  interopMissionId: 1,
  antennaPos: { lat: 0, lng: 0 },
  mapCapture: "off" as "off" | "topLeftCorner" | "bottomRightCorner",
  mapCaptureMaxZoom: 20,
  mapCaptureTopLeft: undefined as google.maps.LatLngLiteral | undefined,
  mapCaptureBottomRight: undefined as google.maps.LatLngLiteral | undefined,
  mapDownloadingInProgess: false
};
export type SettingsState = typeof initialState;

export default produce((state: SettingsState, action: AppAction) => {
  switch (action.type) {
    case "RESET_REDUX_STATE": {
      Object.assign(state, initialState);
      return;
    }
    case "UPDATE_SETTINGS": {
      Object.assign(state, action.payload);
      return;
    }
    case "CONNECT_TO_GND_SERVER": {
      state.connectedGndServerIp = state.gndServerIp;
      return;
    }
    case "GND_SERVER_CONNECTED": {
      state.gndServerConnected = true;
      return;
    }
    case "GND_SERVER_DISCONNECTED": {
      state.gndServerConnected = false;
      return;
    }
    default: {
      return;
    }
  }
}, initialState) as (a: any, b: any) => SettingsState;
