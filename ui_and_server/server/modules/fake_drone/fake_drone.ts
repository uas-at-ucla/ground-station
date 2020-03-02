import config from "../../config";
import socketIOClient from "socket.io-client";

const port = 8081;

const socket = socketIOClient("http://localhost:" + port + "/fake-drone", {
  transports: ["websocket"]
});

const telemetry = require("./sample_telemetry.json.js.js");

const sleepTime = 1000 / 50; // 50 Hz
let i = 0;
setInterval(() => {
  socket.emit("TELEMETRY", telemetry[i]);
  i = (i + 1) % telemetry.length;
}, sleepTime);
