// package: ugv
// file: ugv/ugv_config.proto

import * as jspb from "google-protobuf";

export class PidParams extends jspb.Message {
  getKp(): number;
  setKp(value: number): void;

  getKi(): number;
  setKi(value: number): void;

  getKd(): number;
  setKd(value: number): void;

  getMaxOutput(): number;
  setMaxOutput(value: number): void;

  getMaxIError(): number;
  setMaxIError(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PidParams.AsObject;
  static toObject(includeInstance: boolean, msg: PidParams): PidParams.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PidParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PidParams;
  static deserializeBinaryFromReader(message: PidParams, reader: jspb.BinaryReader): PidParams;
}

export namespace PidParams {
  export type AsObject = {
    kp: number,
    ki: number,
    kd: number,
    maxOutput: number,
    maxIError: number,
  }
}

export class Config extends jspb.Message {
  getMinTargetDist(): number;
  setMinTargetDist(value: number): void;

  getDrivePower(): number;
  setDrivePower(value: number): void;

  hasAnglePid(): boolean;
  clearAnglePid(): void;
  getAnglePid(): PidParams | undefined;
  setAnglePid(value?: PidParams): void;

  getMinFlipPitch(): number;
  setMinFlipPitch(value: number): void;

  getMagDeclination(): number;
  setMagDeclination(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Config.AsObject;
  static toObject(includeInstance: boolean, msg: Config): Config.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Config, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Config;
  static deserializeBinaryFromReader(message: Config, reader: jspb.BinaryReader): Config;
}

export namespace Config {
  export type AsObject = {
    minTargetDist: number,
    drivePower: number,
    anglePid?: PidParams.AsObject,
    minFlipPitch: number,
    magDeclination: number,
  }
}

