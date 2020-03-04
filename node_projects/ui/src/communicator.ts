import socketIOClient from "socket.io-client";
import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { AppAction } from "redux/actions/actionTypes";
import * as externalActions from "redux/actions/externalActions";
import {
  ServerEventsForRoom,
  ClientEvents,
  ObjectEntry,
  EventObject,
  SocketIOClientEventEmitter
} from "messages";

const rooms = ["ui"] as const;
export type ServerEvents = ServerEventsForRoom<typeof rooms[number]>;

type Socket = SocketIOClientEventEmitter<ServerEvents, ClientEvents>;

const defaultDispatch = () => {
  /*Dummy function to use as an equality check*/
};

class Communicator {
  store: MiddlewareAPI;
  socket: Socket;

  constructor(store: MiddlewareAPI) {
    console.log("Initializing communicator");
    this.store = store;
    this.socket = this.initSocket();
  }

  initSocket(): Socket {
    this.socket = socketIOClient(
      "http://" + this.store.getState().settings.gndServerIp,
      { transports: ["websocket"] }
    ) as Socket;

    this.socket.on("connect", () => {
      this.socket.emit("JOIN", [...rooms]);
      this.store.dispatch(externalActions.serverConnected());
    });

    this.socket.on("disconnect", () => {
      this.store.dispatch(externalActions.serverDisconnected());
    });

    for (const handlerEntry of Object.entries(
      this.messageHandlers
    ) as ObjectEntry<ServerEvents>[]) {
      const message = handlerEntry[0];
      let handler = handlerEntry[1];
      if (handler === defaultDispatch) {
        handler = (...args: Parameters<typeof handler>) => {
          this.store.dispatch(
            externalActions.basicServerAction({
              type: message,
              payload: args
            } as EventObject<ServerEvents>)
          );
        };
      }
      this.socket.on(message, handler);
    }

    return this.socket;
  }

  messageHandlers: ServerEvents = {
    MISSION_COMPILE_ERROR: () => alert("FAILED to compile mission!"),
    INTEROP_UPLOAD_FAIL: () => alert("FAILED to upload telemetry to interop!"),
    INTEROP_UPLOAD_SUCCESS: () =>
      alert("Now able to upload telemetry to interop. :)"),
    INTEROP_DATA: defaultDispatch,
    DROPPY_COMMAND_RECEIVED: defaultDispatch,
    COMPILED_DRONE_PROGRAM: defaultDispatch,
    UPLOADED_DRONE_PROGRAM: defaultDispatch,
    TELEMETRY: defaultDispatch,
    UGV_MESSAGE: defaultDispatch
  };

  reduxMiddleware(next: Dispatch) {
    return (action: AppAction) => {
      if (action.type === "TRANSMIT") {
        this.socket.emit<any, SocketIOClient.Socket>(
          action.payload.type,
          ...action.payload.payload
        );
        console.log("Transmitting", action.payload);
      } else if (action.type === "CONNECT_TO_GND_SERVER") {
        this.socket.disconnect();
        this.initSocket();
      }
      next(action);
    };
  }
}

export default ((store: MiddlewareAPI) => {
  const communicator = new Communicator(store);
  return (next: Dispatch) => communicator.reduxMiddleware(next);
}) as Middleware;
