// package: ugv
// file: ugv/ugv_messages.proto

import * as jspb from "google-protobuf";
import * as ugv_ugv_config_pb from "../ugv/ugv_config_pb";

export class TargetLocation extends jspb.Message {
  getLatitude(): number;
  setLatitude(value: number): void;

  getLongitude(): number;
  setLongitude(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TargetLocation.AsObject;
  static toObject(includeInstance: boolean, msg: TargetLocation): TargetLocation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TargetLocation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TargetLocation;
  static deserializeBinaryFromReader(message: TargetLocation, reader: jspb.BinaryReader): TargetLocation;
}

export namespace TargetLocation {
  export type AsObject = {
    latitude: number,
    longitude: number,
  }
}

export class Location extends jspb.Message {
  getFixQuality(): number;
  setFixQuality(value: number): void;

  getLatitude(): number;
  setLatitude(value: number): void;

  getLongitude(): number;
  setLongitude(value: number): void;

  getAltitude(): number;
  setAltitude(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Location.AsObject;
  static toObject(includeInstance: boolean, msg: Location): Location.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Location, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Location;
  static deserializeBinaryFromReader(message: Location, reader: jspb.BinaryReader): Location;
}

export namespace Location {
  export type AsObject = {
    fixQuality: number,
    latitude: number,
    longitude: number,
    altitude: number,
  }
}

export class UGV_Status extends jspb.Message {
  getState(): UGV_StateMap[keyof UGV_StateMap];
  setState(value: UGV_StateMap[keyof UGV_StateMap]): void;

  hasLocation(): boolean;
  clearLocation(): void;
  getLocation(): Location | undefined;
  setLocation(value?: Location): void;

  getYawAngle(): number;
  setYawAngle(value: number): void;

  getPitchAngle(): number;
  setPitchAngle(value: number): void;

  getRollAngle(): number;
  setRollAngle(value: number): void;

  getIsStill(): boolean;
  setIsStill(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UGV_Status.AsObject;
  static toObject(includeInstance: boolean, msg: UGV_Status): UGV_Status.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UGV_Status, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UGV_Status;
  static deserializeBinaryFromReader(message: UGV_Status, reader: jspb.BinaryReader): UGV_Status;
}

export namespace UGV_Status {
  export type AsObject = {
    state: UGV_StateMap[keyof UGV_StateMap],
    location?: Location.AsObject,
    yawAngle: number,
    pitchAngle: number,
    rollAngle: number,
    isStill: boolean,
  }
}

export class UGV_Message extends jspb.Message {
  hasStatus(): boolean;
  clearStatus(): void;
  getStatus(): UGV_Status | undefined;
  setStatus(value?: UGV_Status): void;

  hasCommandAck(): boolean;
  clearCommandAck(): void;
  getCommandAck(): number;
  setCommandAck(value: number): void;

  getUgvMessageCase(): UGV_Message.UgvMessageCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UGV_Message.AsObject;
  static toObject(includeInstance: boolean, msg: UGV_Message): UGV_Message.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UGV_Message, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UGV_Message;
  static deserializeBinaryFromReader(message: UGV_Message, reader: jspb.BinaryReader): UGV_Message;
}

export namespace UGV_Message {
  export type AsObject = {
    status?: UGV_Status.AsObject,
    commandAck: number,
  }

  export enum UgvMessageCase {
    UGV_MESSAGE_NOT_SET = 0,
    STATUS = 1,
    COMMAND_ACK = 2,
  }
}

export class DriveHeadingData extends jspb.Message {
  getHeading(): number;
  setHeading(value: number): void;

  getPower(): number;
  setPower(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DriveHeadingData.AsObject;
  static toObject(includeInstance: boolean, msg: DriveHeadingData): DriveHeadingData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DriveHeadingData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DriveHeadingData;
  static deserializeBinaryFromReader(message: DriveHeadingData, reader: jspb.BinaryReader): DriveHeadingData;
}

export namespace DriveHeadingData {
  export type AsObject = {
    heading: number,
    power: number,
  }
}

export class GroundCommand extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getType(): GroundCommandTypeMap[keyof GroundCommandTypeMap];
  setType(value: GroundCommandTypeMap[keyof GroundCommandTypeMap]): void;

  hasDriveHeading(): boolean;
  clearDriveHeading(): void;
  getDriveHeading(): DriveHeadingData | undefined;
  setDriveHeading(value?: DriveHeadingData): void;

  hasTargetLocation(): boolean;
  clearTargetLocation(): void;
  getTargetLocation(): TargetLocation | undefined;
  setTargetLocation(value?: TargetLocation): void;

  hasConfig(): boolean;
  clearConfig(): void;
  getConfig(): ugv_ugv_config_pb.Config | undefined;
  setConfig(value?: ugv_ugv_config_pb.Config): void;

  getDataCase(): GroundCommand.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroundCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GroundCommand): GroundCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GroundCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroundCommand;
  static deserializeBinaryFromReader(message: GroundCommand, reader: jspb.BinaryReader): GroundCommand;
}

export namespace GroundCommand {
  export type AsObject = {
    id: number,
    type: GroundCommandTypeMap[keyof GroundCommandTypeMap],
    driveHeading?: DriveHeadingData.AsObject,
    targetLocation?: TargetLocation.AsObject,
    config?: ugv_ugv_config_pb.Config.AsObject,
  }

  export enum DataCase {
    DATA_NOT_SET = 0,
    DRIVE_HEADING = 3,
    TARGET_LOCATION = 4,
    CONFIG = 5,
  }
}

export class GroundMessage extends jspb.Message {
  hasCommand(): boolean;
  clearCommand(): void;
  getCommand(): GroundCommand | undefined;
  setCommand(value?: GroundCommand): void;

  getGroundMessageCase(): GroundMessage.GroundMessageCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroundMessage.AsObject;
  static toObject(includeInstance: boolean, msg: GroundMessage): GroundMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GroundMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroundMessage;
  static deserializeBinaryFromReader(message: GroundMessage, reader: jspb.BinaryReader): GroundMessage;
}

export namespace GroundMessage {
  export type AsObject = {
    command?: GroundCommand.AsObject,
  }

  export enum GroundMessageCase {
    GROUND_MESSAGE_NOT_SET = 0,
    COMMAND = 1,
  }
}

export interface UGV_StateMap {
  STATE_IDLE: 0;
  STATE_AQUIRING: 1;
  STATE_DRIVING: 2;
  STATE_FINISHED: 3;
  STATE_TEST: 4;
  STATE_FLIPPING: 5;
  STATE_TURNING: 6;
  STATE_DRIVE_HEADING: 7;
}

export const UGV_State: UGV_StateMap;

export interface GroundCommandTypeMap {
  CMD_DISABLE: 0;
  CMD_DRIVE_TO_TARGET: 1;
  CMD_TEST: 2;
  CMD_DRIVE_HEADING: 3;
  CMD_SET_TARGET: 4;
  CMD_SET_CONFIG: 5;
  CMD_GET_STATUS: 6;
  CMD_PING: 7;
}

export const GroundCommandType: GroundCommandTypeMap;

