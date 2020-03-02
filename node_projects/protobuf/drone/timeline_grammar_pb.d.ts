// package: drone
// file: drone/timeline_grammar.proto

import * as jspb from "google-protobuf";
import * as drone_mission_commands_pb from "../drone/mission_commands_pb";

export class GroundProgram extends jspb.Message {
  clearCommandsList(): void;
  getCommandsList(): Array<GroundCommand>;
  setCommandsList(value: Array<GroundCommand>): void;
  addCommands(value?: GroundCommand, index?: number): GroundCommand;

  clearStaticObstaclesList(): void;
  getStaticObstaclesList(): Array<drone_mission_commands_pb.StaticObstacle>;
  setStaticObstaclesList(value: Array<drone_mission_commands_pb.StaticObstacle>): void;
  addStaticObstacles(value?: drone_mission_commands_pb.StaticObstacle, index?: number): drone_mission_commands_pb.StaticObstacle;

  clearFieldBoundaryList(): void;
  getFieldBoundaryList(): Array<drone_mission_commands_pb.Position2D>;
  setFieldBoundaryList(value: Array<drone_mission_commands_pb.Position2D>): void;
  addFieldBoundary(value?: drone_mission_commands_pb.Position2D, index?: number): drone_mission_commands_pb.Position2D;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroundProgram.AsObject;
  static toObject(includeInstance: boolean, msg: GroundProgram): GroundProgram.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GroundProgram, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroundProgram;
  static deserializeBinaryFromReader(message: GroundProgram, reader: jspb.BinaryReader): GroundProgram;
}

export namespace GroundProgram {
  export type AsObject = {
    commandsList: Array<GroundCommand.AsObject>,
    staticObstaclesList: Array<drone_mission_commands_pb.StaticObstacle.AsObject>,
    fieldBoundaryList: Array<drone_mission_commands_pb.Position2D.AsObject>,
  }
}

export class GroundCommand extends jspb.Message {
  hasWaypointCommand(): boolean;
  clearWaypointCommand(): void;
  getWaypointCommand(): drone_mission_commands_pb.WaypointCommand | undefined;
  setWaypointCommand(value?: drone_mission_commands_pb.WaypointCommand): void;

  hasFlyThroughCommand(): boolean;
  clearFlyThroughCommand(): void;
  getFlyThroughCommand(): drone_mission_commands_pb.FlyThroughCommand | undefined;
  setFlyThroughCommand(value?: drone_mission_commands_pb.FlyThroughCommand): void;

  hasUgvDropCommand(): boolean;
  clearUgvDropCommand(): void;
  getUgvDropCommand(): UgvDropCommand | undefined;
  setUgvDropCommand(value?: UgvDropCommand): void;

  hasSurveyCommand(): boolean;
  clearSurveyCommand(): void;
  getSurveyCommand(): drone_mission_commands_pb.SurveyCommand | undefined;
  setSurveyCommand(value?: drone_mission_commands_pb.SurveyCommand): void;

  hasOffAxisCommand(): boolean;
  clearOffAxisCommand(): void;
  getOffAxisCommand(): drone_mission_commands_pb.OffAxisCommand | undefined;
  setOffAxisCommand(value?: drone_mission_commands_pb.OffAxisCommand): void;

  hasWaitCommand(): boolean;
  clearWaitCommand(): void;
  getWaitCommand(): WaitCommand | undefined;
  setWaitCommand(value?: WaitCommand): void;

  hasLandAtLocationCommand(): boolean;
  clearLandAtLocationCommand(): void;
  getLandAtLocationCommand(): LandAtLocationCommand | undefined;
  setLandAtLocationCommand(value?: LandAtLocationCommand): void;

  getCommandCase(): GroundCommand.CommandCase;
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
    waypointCommand?: drone_mission_commands_pb.WaypointCommand.AsObject,
    flyThroughCommand?: drone_mission_commands_pb.FlyThroughCommand.AsObject,
    ugvDropCommand?: UgvDropCommand.AsObject,
    surveyCommand?: drone_mission_commands_pb.SurveyCommand.AsObject,
    offAxisCommand?: drone_mission_commands_pb.OffAxisCommand.AsObject,
    waitCommand?: WaitCommand.AsObject,
    landAtLocationCommand?: LandAtLocationCommand.AsObject,
  }

  export enum CommandCase {
    COMMAND_NOT_SET = 0,
    WAYPOINT_COMMAND = 1,
    FLY_THROUGH_COMMAND = 2,
    UGV_DROP_COMMAND = 3,
    SURVEY_COMMAND = 4,
    OFF_AXIS_COMMAND = 5,
    WAIT_COMMAND = 6,
    LAND_AT_LOCATION_COMMAND = 7,
  }
}

export class UgvDropCommand extends jspb.Message {
  hasGoal(): boolean;
  clearGoal(): void;
  getGoal(): drone_mission_commands_pb.Position3D;
  setGoal(value?: drone_mission_commands_pb.Position3D): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UgvDropCommand.AsObject;
  static toObject(includeInstance: boolean, msg: UgvDropCommand): UgvDropCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UgvDropCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UgvDropCommand;
  static deserializeBinaryFromReader(message: UgvDropCommand, reader: jspb.BinaryReader): UgvDropCommand;
}

export namespace UgvDropCommand {
  export type AsObject = {
    goal: drone_mission_commands_pb.Position3D.AsObject,
  }
}

export class WaitCommand extends jspb.Message {
  hasTime(): boolean;
  clearTime(): void;
  getTime(): number | undefined;
  setTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WaitCommand.AsObject;
  static toObject(includeInstance: boolean, msg: WaitCommand): WaitCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WaitCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WaitCommand;
  static deserializeBinaryFromReader(message: WaitCommand, reader: jspb.BinaryReader): WaitCommand;
}

export namespace WaitCommand {
  export type AsObject = {
    time: number,
  }
}

export class LandAtLocationCommand extends jspb.Message {
  hasGoal(): boolean;
  clearGoal(): void;
  getGoal(): drone_mission_commands_pb.Position3D;
  setGoal(value?: drone_mission_commands_pb.Position3D): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LandAtLocationCommand.AsObject;
  static toObject(includeInstance: boolean, msg: LandAtLocationCommand): LandAtLocationCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LandAtLocationCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LandAtLocationCommand;
  static deserializeBinaryFromReader(message: LandAtLocationCommand, reader: jspb.BinaryReader): LandAtLocationCommand;
}

export namespace LandAtLocationCommand {
  export type AsObject = {
    goal: drone_mission_commands_pb.Position3D.AsObject,
  }
}

export class DroneProgram extends jspb.Message {
  clearCommandsList(): void;
  getCommandsList(): Array<DroneCommand>;
  setCommandsList(value: Array<DroneCommand>): void;
  addCommands(value?: DroneCommand, index?: number): DroneCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DroneProgram.AsObject;
  static toObject(includeInstance: boolean, msg: DroneProgram): DroneProgram.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DroneProgram, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DroneProgram;
  static deserializeBinaryFromReader(message: DroneProgram, reader: jspb.BinaryReader): DroneProgram;
}

export namespace DroneProgram {
  export type AsObject = {
    commandsList: Array<DroneCommand.AsObject>,
  }
}

export class DroneCommand extends jspb.Message {
  hasNothingCommand(): boolean;
  clearNothingCommand(): void;
  getNothingCommand(): drone_mission_commands_pb.NothingCommand | undefined;
  setNothingCommand(value?: drone_mission_commands_pb.NothingCommand): void;

  hasSleepCommand(): boolean;
  clearSleepCommand(): void;
  getSleepCommand(): drone_mission_commands_pb.SleepCommand | undefined;
  setSleepCommand(value?: drone_mission_commands_pb.SleepCommand): void;

  hasTriggerBombDropCommand(): boolean;
  clearTriggerBombDropCommand(): void;
  getTriggerBombDropCommand(): TriggerBombDropCommand | undefined;
  setTriggerBombDropCommand(value?: TriggerBombDropCommand): void;

  hasTriggerAlarmCommand(): boolean;
  clearTriggerAlarmCommand(): void;
  getTriggerAlarmCommand(): TriggerAlarmCommand | undefined;
  setTriggerAlarmCommand(value?: TriggerAlarmCommand): void;

  hasTranslateCommand(): boolean;
  clearTranslateCommand(): void;
  getTranslateCommand(): TranslateCommand | undefined;
  setTranslateCommand(value?: TranslateCommand): void;

  hasLandCommand(): boolean;
  clearLandCommand(): void;
  getLandCommand(): LandCommand | undefined;
  setLandCommand(value?: LandCommand): void;

  getCommandCase(): DroneCommand.CommandCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DroneCommand.AsObject;
  static toObject(includeInstance: boolean, msg: DroneCommand): DroneCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DroneCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DroneCommand;
  static deserializeBinaryFromReader(message: DroneCommand, reader: jspb.BinaryReader): DroneCommand;
}

export namespace DroneCommand {
  export type AsObject = {
    nothingCommand?: drone_mission_commands_pb.NothingCommand.AsObject,
    sleepCommand?: drone_mission_commands_pb.SleepCommand.AsObject,
    triggerBombDropCommand?: TriggerBombDropCommand.AsObject,
    triggerAlarmCommand?: TriggerAlarmCommand.AsObject,
    translateCommand?: TranslateCommand.AsObject,
    landCommand?: LandCommand.AsObject,
  }

  export enum CommandCase {
    COMMAND_NOT_SET = 0,
    NOTHING_COMMAND = 1,
    SLEEP_COMMAND = 2,
    TRIGGER_BOMB_DROP_COMMAND = 3,
    TRIGGER_ALARM_COMMAND = 4,
    TRANSLATE_COMMAND = 5,
    LAND_COMMAND = 6,
  }
}

export class TranslateCommand extends jspb.Message {
  hasGoal(): boolean;
  clearGoal(): void;
  getGoal(): drone_mission_commands_pb.Position3D;
  setGoal(value?: drone_mission_commands_pb.Position3D): void;

  hasComeToStop(): boolean;
  clearComeToStop(): void;
  getComeToStop(): boolean | undefined;
  setComeToStop(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TranslateCommand.AsObject;
  static toObject(includeInstance: boolean, msg: TranslateCommand): TranslateCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TranslateCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TranslateCommand;
  static deserializeBinaryFromReader(message: TranslateCommand, reader: jspb.BinaryReader): TranslateCommand;
}

export namespace TranslateCommand {
  export type AsObject = {
    goal: drone_mission_commands_pb.Position3D.AsObject,
    comeToStop: boolean,
  }
}

export class TriggerBombDropCommand extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TriggerBombDropCommand.AsObject;
  static toObject(includeInstance: boolean, msg: TriggerBombDropCommand): TriggerBombDropCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TriggerBombDropCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TriggerBombDropCommand;
  static deserializeBinaryFromReader(message: TriggerBombDropCommand, reader: jspb.BinaryReader): TriggerBombDropCommand;
}

export namespace TriggerBombDropCommand {
  export type AsObject = {
  }
}

export class TriggerAlarmCommand extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TriggerAlarmCommand.AsObject;
  static toObject(includeInstance: boolean, msg: TriggerAlarmCommand): TriggerAlarmCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TriggerAlarmCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TriggerAlarmCommand;
  static deserializeBinaryFromReader(message: TriggerAlarmCommand, reader: jspb.BinaryReader): TriggerAlarmCommand;
}

export namespace TriggerAlarmCommand {
  export type AsObject = {
  }
}

export class LandCommand extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LandCommand.AsObject;
  static toObject(includeInstance: boolean, msg: LandCommand): LandCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LandCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LandCommand;
  static deserializeBinaryFromReader(message: LandCommand, reader: jspb.BinaryReader): LandCommand;
}

export namespace LandCommand {
  export type AsObject = {
  }
}

