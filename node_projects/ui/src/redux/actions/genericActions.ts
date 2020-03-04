import { EventObject, ClientEvents } from "messages";

export function transmit<T extends keyof ClientEvents>(
  msg: T,
  ...args: Parameters<ClientEvents[T]>
) {
  return {
    type: "TRANSMIT" as const,
    payload: {
      type: msg,
      payload: args
    } as EventObject<ClientEvents>
  };
}

export const resetReduxState = () => ({
  type: "RESET_REDUX_STATE" as const
});

export const centerOnDrone = () => ({
  type: "CENTER_ON_DRONE" as const
});
