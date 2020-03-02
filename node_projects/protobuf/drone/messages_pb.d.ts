// package: drone
// file: drone/messages.proto

import * as jspb from "google-protobuf";

export class Sensors extends jspb.Message {
  hasTime(): boolean;
  clearTime(): void;
  getTime(): number | undefined;
  setTime(value: number): void;

  hasGpsFix(): boolean;
  clearGpsFix(): void;
  getGpsFix(): boolean | undefined;
  setGpsFix(value: boolean): void;

  hasLatitude(): boolean;
  clearLatitude(): void;
  getLatitude(): number | undefined;
  setLatitude(value: number): void;

  hasLongitude(): boolean;
  clearLongitude(): void;
  getLongitude(): number | undefined;
  setLongitude(value: number): void;

  hasAltitude(): boolean;
  clearAltitude(): void;
  getAltitude(): number | undefined;
  setAltitude(value: number): void;

  hasRelativeAltitude(): boolean;
  clearRelativeAltitude(): void;
  getRelativeAltitude(): number | undefined;
  setRelativeAltitude(value: number): void;

  hasHeading(): boolean;
  clearHeading(): void;
  getHeading(): number | undefined;
  setHeading(value: number): void;

  hasVelocityX(): boolean;
  clearVelocityX(): void;
  getVelocityX(): number | undefined;
  setVelocityX(value: number): void;

  hasVelocityY(): boolean;
  clearVelocityY(): void;
  getVelocityY(): number | undefined;
  setVelocityY(value: number): void;

  hasVelocityZ(): boolean;
  clearVelocityZ(): void;
  getVelocityZ(): number | undefined;
  setVelocityZ(value: number): void;

  hasGpsGroundSpeed(): boolean;
  clearGpsGroundSpeed(): void;
  getGpsGroundSpeed(): number | undefined;
  setGpsGroundSpeed(value: number): void;

  hasGpsSatelliteCount(): boolean;
  clearGpsSatelliteCount(): void;
  getGpsSatelliteCount(): number | undefined;
  setGpsSatelliteCount(value: number): void;

  hasGpsEph(): boolean;
  clearGpsEph(): void;
  getGpsEph(): number | undefined;
  setGpsEph(value: number): void;

  hasGpsEpv(): boolean;
  clearGpsEpv(): void;
  getGpsEpv(): number | undefined;
  setGpsEpv(value: number): void;

  hasAccelerometerX(): boolean;
  clearAccelerometerX(): void;
  getAccelerometerX(): number | undefined;
  setAccelerometerX(value: number): void;

  hasAccelerometerY(): boolean;
  clearAccelerometerY(): void;
  getAccelerometerY(): number | undefined;
  setAccelerometerY(value: number): void;

  hasAccelerometerZ(): boolean;
  clearAccelerometerZ(): void;
  getAccelerometerZ(): number | undefined;
  setAccelerometerZ(value: number): void;

  hasGyroX(): boolean;
  clearGyroX(): void;
  getGyroX(): number | undefined;
  setGyroX(value: number): void;

  hasGyroY(): boolean;
  clearGyroY(): void;
  getGyroY(): number | undefined;
  setGyroY(value: number): void;

  hasGyroZ(): boolean;
  clearGyroZ(): void;
  getGyroZ(): number | undefined;
  setGyroZ(value: number): void;

  hasRoll(): boolean;
  clearRoll(): void;
  getRoll(): number | undefined;
  setRoll(value: number): void;

  hasPitch(): boolean;
  clearPitch(): void;
  getPitch(): number | undefined;
  setPitch(value: number): void;

  hasYaw(): boolean;
  clearYaw(): void;
  getYaw(): number | undefined;
  setYaw(value: number): void;

  hasBatteryVoltage(): boolean;
  clearBatteryVoltage(): void;
  getBatteryVoltage(): number | undefined;
  setBatteryVoltage(value: number): void;

  hasBatteryCurrent(): boolean;
  clearBatteryCurrent(): void;
  getBatteryCurrent(): number | undefined;
  setBatteryCurrent(value: number): void;

  hasArmed(): boolean;
  clearArmed(): void;
  getArmed(): boolean | undefined;
  setArmed(value: boolean): void;

  hasAutopilotState(): boolean;
  clearAutopilotState(): void;
  getAutopilotState(): string | undefined;
  setAutopilotState(value: string): void;

  hasHomeAltitude(): boolean;
  clearHomeAltitude(): void;
  getHomeAltitude(): number | undefined;
  setHomeAltitude(value: number): void;

  hasRunUasMission(): boolean;
  clearRunUasMission(): void;
  getRunUasMission(): boolean | undefined;
  setRunUasMission(value: boolean): void;

  hasDoneDropping(): boolean;
  clearDoneDropping(): void;
  getDoneDropping(): boolean | undefined;
  setDoneDropping(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Sensors.AsObject;
  static toObject(includeInstance: boolean, msg: Sensors): Sensors.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Sensors, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Sensors;
  static deserializeBinaryFromReader(message: Sensors, reader: jspb.BinaryReader): Sensors;
}

export namespace Sensors {
  export type AsObject = {
    time: number,
    gpsFix: boolean,
    latitude: number,
    longitude: number,
    altitude: number,
    relativeAltitude: number,
    heading: number,
    velocityX: number,
    velocityY: number,
    velocityZ: number,
    gpsGroundSpeed: number,
    gpsSatelliteCount: number,
    gpsEph: number,
    gpsEpv: number,
    accelerometerX: number,
    accelerometerY: number,
    accelerometerZ: number,
    gyroX: number,
    gyroY: number,
    gyroZ: number,
    roll: number,
    pitch: number,
    yaw: number,
    batteryVoltage: number,
    batteryCurrent: number,
    armed: boolean,
    autopilotState: string,
    homeAltitude: number,
    runUasMission: boolean,
    doneDropping: boolean,
  }
}

export class Goal extends jspb.Message {
  hasRunMission(): boolean;
  clearRunMission(): void;
  getRunMission(): boolean | undefined;
  setRunMission(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Goal.AsObject;
  static toObject(includeInstance: boolean, msg: Goal): Goal.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Goal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Goal;
  static deserializeBinaryFromReader(message: Goal, reader: jspb.BinaryReader): Goal;
}

export namespace Goal {
  export type AsObject = {
    runMission: boolean,
  }
}

export class Output extends jspb.Message {
  hasState(): boolean;
  clearState(): void;
  getState(): number | undefined;
  setState(value: number): void;

  hasMissionState(): boolean;
  clearMissionState(): void;
  getMissionState(): number | undefined;
  setMissionState(value: number): void;

  hasFlightTime(): boolean;
  clearFlightTime(): void;
  getFlightTime(): number | undefined;
  setFlightTime(value: number): void;

  hasCurrentCommandIndex(): boolean;
  clearCurrentCommandIndex(): void;
  getCurrentCommandIndex(): number | undefined;
  setCurrentCommandIndex(value: number): void;

  hasSendSetpoint(): boolean;
  clearSendSetpoint(): void;
  getSendSetpoint(): boolean | undefined;
  setSendSetpoint(value: boolean): void;

  hasSetpointLatitude(): boolean;
  clearSetpointLatitude(): void;
  getSetpointLatitude(): number | undefined;
  setSetpointLatitude(value: number): void;

  hasSetpointLongitude(): boolean;
  clearSetpointLongitude(): void;
  getSetpointLongitude(): number | undefined;
  setSetpointLongitude(value: number): void;

  hasSetpointAltitude(): boolean;
  clearSetpointAltitude(): void;
  getSetpointAltitude(): number | undefined;
  setSetpointAltitude(value: number): void;

  hasSetpointYaw(): boolean;
  clearSetpointYaw(): void;
  getSetpointYaw(): number | undefined;
  setSetpointYaw(value: number): void;

  hasGimbalAngle(): boolean;
  clearGimbalAngle(): void;
  getGimbalAngle(): number | undefined;
  setGimbalAngle(value: number): void;

  hasBombDrop(): boolean;
  clearBombDrop(): void;
  getBombDrop(): boolean | undefined;
  setBombDrop(value: boolean): void;

  hasAlarm(): boolean;
  clearAlarm(): void;
  getAlarm(): boolean | undefined;
  setAlarm(value: boolean): void;

  hasDslr(): boolean;
  clearDslr(): void;
  getDslr(): boolean | undefined;
  setDslr(value: boolean): void;

  hasTriggerTakeoff(): boolean;
  clearTriggerTakeoff(): void;
  getTriggerTakeoff(): boolean | undefined;
  setTriggerTakeoff(value: boolean): void;

  hasTriggerHold(): boolean;
  clearTriggerHold(): void;
  getTriggerHold(): boolean | undefined;
  setTriggerHold(value: boolean): void;

  hasTriggerOffboard(): boolean;
  clearTriggerOffboard(): void;
  getTriggerOffboard(): boolean | undefined;
  setTriggerOffboard(value: boolean): void;

  hasTriggerRtl(): boolean;
  clearTriggerRtl(): void;
  getTriggerRtl(): boolean | undefined;
  setTriggerRtl(value: boolean): void;

  hasTriggerLand(): boolean;
  clearTriggerLand(): void;
  getTriggerLand(): boolean | undefined;
  setTriggerLand(value: boolean): void;

  hasTriggerArm(): boolean;
  clearTriggerArm(): void;
  getTriggerArm(): boolean | undefined;
  setTriggerArm(value: boolean): void;

  hasTriggerDisarm(): boolean;
  clearTriggerDisarm(): void;
  getTriggerDisarm(): boolean | undefined;
  setTriggerDisarm(value: boolean): void;

  hasDeploy(): boolean;
  clearDeploy(): void;
  getDeploy(): boolean | undefined;
  setDeploy(value: boolean): void;

  hasMissionCommandedLand(): boolean;
  clearMissionCommandedLand(): void;
  getMissionCommandedLand(): boolean | undefined;
  setMissionCommandedLand(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Output.AsObject;
  static toObject(includeInstance: boolean, msg: Output): Output.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Output, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Output;
  static deserializeBinaryFromReader(message: Output, reader: jspb.BinaryReader): Output;
}

export namespace Output {
  export type AsObject = {
    state: number,
    missionState: number,
    flightTime: number,
    currentCommandIndex: number,
    sendSetpoint: boolean,
    setpointLatitude: number,
    setpointLongitude: number,
    setpointAltitude: number,
    setpointYaw: number,
    gimbalAngle: number,
    bombDrop: boolean,
    alarm: boolean,
    dslr: boolean,
    triggerTakeoff: boolean,
    triggerHold: boolean,
    triggerOffboard: boolean,
    triggerRtl: boolean,
    triggerLand: boolean,
    triggerArm: boolean,
    triggerDisarm: boolean,
    deploy: boolean,
    missionCommandedLand: boolean,
  }
}

export class UgvSensors extends jspb.Message {
  hasTime(): boolean;
  clearTime(): void;
  getTime(): number | undefined;
  setTime(value: number): void;

  hasLatitude(): boolean;
  clearLatitude(): void;
  getLatitude(): number | undefined;
  setLatitude(value: number): void;

  hasLongitude(): boolean;
  clearLongitude(): void;
  getLongitude(): number | undefined;
  setLongitude(value: number): void;

  hasAltitude(): boolean;
  clearAltitude(): void;
  getAltitude(): number | undefined;
  setAltitude(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UgvSensors.AsObject;
  static toObject(includeInstance: boolean, msg: UgvSensors): UgvSensors.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UgvSensors, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UgvSensors;
  static deserializeBinaryFromReader(message: UgvSensors, reader: jspb.BinaryReader): UgvSensors;
}

export namespace UgvSensors {
  export type AsObject = {
    time: number,
    latitude: number,
    longitude: number,
    altitude: number,
  }
}

export class UasMessage extends jspb.Message {
  hasTime(): boolean;
  clearTime(): void;
  getTime(): number | undefined;
  setTime(value: number): void;

  hasSensors(): boolean;
  clearSensors(): void;
  getSensors(): Sensors | undefined;
  setSensors(value?: Sensors): void;

  hasGoal(): boolean;
  clearGoal(): void;
  getGoal(): Goal | undefined;
  setGoal(value?: Goal): void;

  hasOutput(): boolean;
  clearOutput(): void;
  getOutput(): Output | undefined;
  setOutput(value?: Output): void;

  getPayloadCase(): UasMessage.PayloadCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UasMessage.AsObject;
  static toObject(includeInstance: boolean, msg: UasMessage): UasMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UasMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UasMessage;
  static deserializeBinaryFromReader(message: UasMessage, reader: jspb.BinaryReader): UasMessage;
}

export namespace UasMessage {
  export type AsObject = {
    time?: number,
    sensors?: Sensors.AsObject,
    goal?: Goal.AsObject,
    output?: Output.AsObject,
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    SENSORS = 2,
    GOAL = 3,
    OUTPUT = 4,
  }
}

export class AlarmSequence extends jspb.Message {
  clearOnOffCyclesList(): void;
  getOnOffCyclesList(): Array<number>;
  setOnOffCyclesList(value: Array<number>): void;
  addOnOffCycles(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AlarmSequence.AsObject;
  static toObject(includeInstance: boolean, msg: AlarmSequence): AlarmSequence.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AlarmSequence, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AlarmSequence;
  static deserializeBinaryFromReader(message: AlarmSequence, reader: jspb.BinaryReader): AlarmSequence;
}

export namespace AlarmSequence {
  export type AsObject = {
    onOffCyclesList: Array<number>,
  }
}

