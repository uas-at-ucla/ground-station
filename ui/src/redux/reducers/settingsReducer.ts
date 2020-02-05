import produce from "immer";

import { AppAction } from "../actions/actionTypes";

const isWebServer = window.location.protocol.startsWith("http"); // may need to change now that we use websockets instead of socket.io
const defaultIP = "localhost";
const socketHost = isWebServer ? window.location.hostname : defaultIP;
const socketPort = 8081;

const initialState = {
  gndServerIp: socketHost + ":" + socketPort,
  connectedGndServerIp: socketHost + ":" + socketPort,
  gndServerConnected: false,
  interopIp: "167.71.120.140:8000", // used to be "134.209.2.203:8000"
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
  }
}, initialState) as (a: any, b: any) => SettingsState;
