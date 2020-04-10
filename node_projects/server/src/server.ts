import socketIOServer from "socket.io";
import { EventEmitter } from "events";
import { StrictEventEmitter } from "strict-event-emitter-types";
import {
  SmartStrictEventEmitter,
  SocketIOServerEventEmitter,
  ClientEvents,
  ServerEvents,
  Room,
  DroneTelemetry,
  InteropData
} from "messages";

const serverPort = 8081;

export const data = {
  telemetry: {} as DroneTelemetry,
  interopData: undefined as InteropData | undefined
};

console.log("server running");

// Setup SocketIO server
type Server = Omit<SocketIOServerEventEmitter<ClientEvents, never>, "to"> & {
  to<R extends Room>(
    room: R
  ): SmartStrictEventEmitter<SocketIO.Namespace, never, ServerEvents[R]>;
};

export const io: Server = socketIOServer(serverPort) as Server;
export const socketEvents: StrictEventEmitter<
  EventEmitter,
  ClientEvents,
  never
> = new EventEmitter();

io.on("connect", socket => {
  console.log(`client ${socket.id} connected`);

  for (const message of messages) {
    socket.on(message, (...args) => {
      console.log(
        `received ${message} message from client ${socket.id}${
          args.length ? ` with data: ${args.join(",")}` : ""
        }`
      );
      socketEvents.emit(message, ...args);
    });
  }

  socket.on("JOIN", rooms => {
    for (const room of rooms) {
      socket.join(room);
      // Latched data:
      switch (room) {
        case "ui":
          socket.emit("INTEROP_DATA", data.interopData);
          break;
        default:
          break;
      }
    }
    console.log(`client ${socket.id} joined ${rooms.join(", ")}`);
  });
});

const messagesObj: Record<keyof ClientEvents, null> = {
  JOIN: null,
  CHANGE_DRONE_STATE: null,
  CHANGE_DROPPY_STATE: null,
  UPLOAD_MISSION: null,
  RUN_MISSION: null,
  PAUSE_MISSION: null,
  END_MISSION: null,
  DRIVE_UGV: null,
  DISABLE_UGV: null,
  COMPILE_GROUND_PROGRAM: null,
  CONNECT_TO_INTEROP: null,
  CONFIGURE_TRACKY_POS: null,
  SET_UGV_TARGET: null,
  UGV_MESSAGE: null,
  UPLOAD_IMAGE: null
};
const messages = Object.keys(messagesObj) as (keyof typeof messagesObj)[];

// Run all modules
require("modules/interop");
require("modules/ui");
