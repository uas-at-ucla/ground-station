import { TelemetryState } from "redux/reducers/telemetryReducer";
import { InteropData } from "messages";

export const togglePlayback = () => ({ type: "TOGGLE_PLAYBACK" as const });

export const playback = (telemetry: TelemetryState["droneTelemetry"]) => ({
  type: "PLAYBACK" as const,
  payload: telemetry
});

export const loadInteropData = (data: InteropData) => ({
  type: "INTEROP_DATA" as const,
  payload: [data] as [typeof data]
});

export const toggleRecording = () => ({ type: "TOGGLE_RECORD" as const });
