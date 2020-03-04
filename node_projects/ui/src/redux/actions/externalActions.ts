import { EventObject } from "messages";
import { ServerEvents } from "communicator";

// These "external" actions are never triggered by the user, they will typically come from communicator.ts

export const serverConnected = () => ({
  type: "GND_SERVER_CONNECTED" as const
});

export const serverDisconnected = () => ({
  type: "GND_SERVER_DISCONNECTED" as const
});

export const basicServerAction = (action: EventObject<ServerEvents>) => {
  return action;
};
