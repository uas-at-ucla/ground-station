import { TelemetryState } from "redux/reducers/telemetryReducer";
import { MissionState } from "redux/reducers/missionReducer";

export const togglePlayback = () => ({ type: "TOGGLE_PLAYBACK" as const });

export const playback = (telemetry: TelemetryState["droneTelemetry"]) => ({
  type: "PLAYBACK" as const,
  payload: telemetry
});

export const loadInteropData = (data: MissionState["interopData"]) => ({
  type: "INTEROP_DATA" as const,
  payload: data
});

export const toggleRecording = () => ({ type: "TOGGLE_RECORD" as const });
