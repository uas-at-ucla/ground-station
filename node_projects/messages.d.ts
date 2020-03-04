import { Mission, Odlc } from "./protobuf/interop/interop_api_pb";
import StrictEventEmitter from "strict-event-emitter-types";
import {
  GroundProgram,
  DroneProgram
} from "./protobuf/drone/timeline_grammar_pb";
import { Sensors, Output } from "./protobuf/drone/messages_pb";
import { UGV_Message } from "./protobuf/ugv/ugv_messages_pb";

export interface InteropData {
  mission: Required<Mission.AsObject>;
  ip: string;
}

type OdlcReplacedEnums = {
  type?: keyof Odlc.TypeMap;
  orientation?: keyof Odlc.OrientationMap;
  shape?: keyof Odlc.ShapeMap;
  shapeColor?: keyof Odlc.ColorMap;
  alphanumericColor?: keyof Odlc.ColorMap;
};
export type InteropOdlc = Omit<Odlc.AsObject, keyof OdlcReplacedEnums> &
  OdlcReplacedEnums;

export type DroneState = "TAKEOFF" | "LAND" | "FAILSAFE" | "THROTTLE_CUT";

export type DroppyState =
  | "START_DROP"
  | "CUT_LINE"
  | "MOTOR_UP"
  | "MOTOR_DOWN"
  | "MOTOR_STOP"
  | "CANCEL_DROP"
  | "RESET_LATCH"
  | "STOP_CUT";

export interface InteropCredentials {
  ip: string;
  username: string;
  password: string;
  missionId: number;
}

export type DroneTelemetry = {
  sensors?: Sensors.AsObject;
  output?: Output.AsObject;
};

export type ClientEvents = {
  JOIN: (rooms: Room[]) => void;
  CHANGE_DRONE_STATE: (droneState: DroneState) => void;
  CHANGE_DROPPY_STATE: (droppyState: DroppyState) => void;
  UPLOAD_MISSION: () => void;
  RUN_MISSION: () => void;
  PAUSE_MISSION: () => void;
  END_MISSION: () => void;
  DRIVE_UGV: () => void;
  DISABLE_UGV: () => void;
  COMPILE_GROUND_PROGRAM: (groundProgram: GroundProgram.AsObject) => void;
  CONNECT_TO_INTEROP: (cred: InteropCredentials) => void;
  CONFIGURE_TRACKY_POS: (pos: { lat: number; lng: number }) => void;
  SET_UGV_TARGET: (pos: { lat: number; lng: number }) => void;
  UGV_MESSAGE: (msg: UGV_Message.AsObject) => void;
  UPLOAD_IMAGE: (data: any) => void; //TODO
};

export interface ServerEvents {
  ui: {
    INTEROP_DATA: (interopData: InteropData | undefined) => void;
    MISSION_COMPILE_ERROR: () => void;
    INTEROP_UPLOAD_FAIL: () => void;
    INTEROP_UPLOAD_SUCCESS: () => void;
    COMPILED_DRONE_PROGRAM: (droneProgram: DroneProgram.AsObject) => void;
    UPLOADED_DRONE_PROGRAM: (droneProgram: DroneProgram.AsObject) => void;
    DROPPY_COMMAND_RECEIVED: (command: string) => void;
    TELEMETRY: (telemetry: DroneTelemetry) => void;
    UGV_MESSAGE: (msg: UGV_Message.AsObject) => void;
  };
}

type Room = keyof ServerEvents;

type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never;

export type ServerEventsForRoom<T extends Room> = UnionToIntersection<
  ServerEvents[T]
>;

export type SmartStrictEventEmitter<
  EmitterType,
  IncomingEvents,
  OutgoingEvents
> = Omit<
  EmitterType,
  keyof StrictEventEmitter<EmitterType, IncomingEvents, OutgoingEvents>
> &
  StrictEventEmitter<EmitterType, IncomingEvents, OutgoingEvents>;

type SocketIOServerEventEmitter<
  IncomingEvents,
  OutgoingEvents
> = SmartStrictEventEmitter<SocketIO.Server, never, OutgoingEvents> & {
  on(
    event: "connect",
    listener: (
      socket: SmartStrictEventEmitter<
        SocketIO.Socket,
        ClientEvents,
        OutgoingEvents
      > & { on(event: "disconnect", listener: () => void): void }
    ) => void
  ): void;
};

type SocketIOClientEventEmitter<
  IncomingEvents,
  OutgoingEvents
> = SmartStrictEventEmitter<
  SocketIOClient.Socket,
  IncomingEvents,
  OutgoingEvents
> & {
  on(event: "connect", listener: () => void): void;
  on(event: "disconnect", listener: () => void): void;
};

type ObjectEntry<T, K extends keyof T = keyof T> = K extends keyof T
  ? [K, T[K]]
  : never;

type EventObject<
  T extends { [key: string]: (...args: any) => void },
  K extends keyof T = keyof T
> = K extends keyof T
  ? {
      type: K;
      payload: Parameters<T[K]>;
    }
  : never;
