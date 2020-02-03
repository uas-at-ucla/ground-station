import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { AppAction } from "redux/actions/actionTypes";
import * as externalActions from "redux/actions/externalActions";

class Communicator {
  store: MiddlewareAPI;
  socket: WebSocket;

  constructor(store: MiddlewareAPI) {
    console.log("Initializing communicator");
    this.store = store;
    this.socket = this.initSocket();
  }

  initSocket(): WebSocket {
    this.socket = new WebSocket(
      "ws://" + this.store.getState().settings.gndServerIp + "/ui"
    );

    this.socket.onopen = () => {
      this.store.dispatch(externalActions.serverConnected());
    };

    this.socket.onclose = event => {
      console.log("Calling onclose", event);
      this.store.dispatch(externalActions.serverDisconnected());
    };

    this.socket.onmessage = event => {
      console.log("Received message from server: ", event.data);
    };

    // Need to convert the following event triggers from socket.io to websocket syntax

    // for (const message of externalActions.basicServerAction.basicMessages) {
    //   this.socket.on(message, (data: any) => {
    //     this.store.dispatch(externalActions.basicServerAction(message, data));
    //   });
    // }

    // this.socket.on("MISSION_COMPILE_ERROR", () => {
    //   alert("FAILED to compile mission!");
    // });

    // this.socket.on("INTEROP_UPLOAD_FAIL", () => {
    //   alert("FAILED to upload telemetry to interop!");
    // });

    // this.socket.on("INTEROP_UPLOAD_SUCCESS", () => {
    //   alert("Now able to upload telemetry to interop. :)");
    // });

    return this.socket;
  }

  reduxMiddleware(next: Dispatch) {
    return (action: AppAction) => {
      if (action.type === "TRANSMIT") {
        // Mimic socket.io socket.emit() by sending event type and associated data
        console.log(this.socket.readyState);
        this.socket.send(
          JSON.stringify({
            type: action.payload.msg,
            data: action.payload.data // may be null, but server will handle this
          })
        );
        console.log("Transmitting", action.payload);
      } else if (action.type === "CONNECT_TO_GND_SERVER") {
        this.socket.close();
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
