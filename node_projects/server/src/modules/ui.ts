import config from "config";
import { io, socketEvents, data } from "server";
import internalEvents from "internalEvents";

const uiSendFrequency = 5; //Hz
const uiEmitter = io.to("ui");

internalEvents.on("INTEROP_DATA", interopData => {
  uiEmitter.emit("INTEROP_DATA", interopData);
});

internalEvents.on("INTEROP_UPLOAD_SUCCESS", () =>
  uiEmitter.emit("INTEROP_UPLOAD_SUCCESS")
);

internalEvents.on("INTEROP_UPLOAD_FAIL", () =>
  uiEmitter.emit("INTEROP_UPLOAD_FAIL")
);

socketEvents.on("UGV_MESSAGE", msg => {
  if (config.verbose) console.log(msg);
  uiEmitter.emit("UGV_MESSAGE", msg);
});

const uiSendInterval = 1000 / uiSendFrequency;
setInterval(() => {
  // periodically send telemetry to UI
  if (data.telemetry.sensors) {
    if (config.verbose) console.log(JSON.stringify(data.telemetry, null, 2));
    uiEmitter.emit("TELEMETRY", data.telemetry);
  }
}, uiSendInterval);
