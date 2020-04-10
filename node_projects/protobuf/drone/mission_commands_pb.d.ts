// package: drone
// file: drone/mission_commands.proto

import * as jspb from "google-protobuf";

export class Position2D extends jspb.Message {
  hasLatitude(): boolean;
  clearLatitude(): void;
  getLatitude(): number | undefined;
  setLatitude(value: number): void;

  hasLongitude(): boolean;
  clearLongitude(): void;
  getLongitude(): number | undefined;
  setLongitude(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Position2D.AsObject;
  static toObject(includeInstance: boolean, msg: Position2D): Position2D.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Position2D, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Position2D;
  static deserializeBinaryFromReader(message: Position2D, reader: jspb.BinaryReader): Position2D;
}

export namespace Position2D {
  export type AsObject = {
    latitude: number,
    longitude: number,
  }
}

export class Position3D extends jspb.Message {
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
  toObject(includeInstance?: boolean): Position3D.AsObject;
  static toObject(includeInstance: boolean, msg: Position3D): Position3D.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Position3D, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Position3D;
  static deserializeBinaryFromReader(message: Position3D, reader: jspb.BinaryReader): Position3D;
}

export namespace Position3D {
  export type AsObject = {
    latitude: number,
    longitude: number,
    altitude: number,
  }
}

export class WaypointCommand extends jspb.Message {
  hasGoal(): boolean;
  clearGoal(): void;
  getGoal(): Position3D;
  setGoal(value?: Position3D): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WaypointCommand.AsObject;
  static toObject(includeInstance: boolean, msg: WaypointCommand): WaypointCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WaypointCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WaypointCommand;
  static deserializeBinaryFromReader(message: WaypointCommand, reader: jspb.BinaryReader): WaypointCommand;
}

export namespace WaypointCommand {
  export type AsObject = {
    goal: Position3D.AsObject,
  }
}

export class FlyThroughCommand extends jspb.Message {
  hasGoal(): boolean;
  clearGoal(): void;
  getGoal(): Position3D;
  setGoal(value?: Position3D): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FlyThroughCommand.AsObject;
  static toObject(includeInstance: boolean, msg: FlyThroughCommand): FlyThroughCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FlyThroughCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FlyThroughCommand;
  static deserializeBinaryFromReader(message: FlyThroughCommand, reader: jspb.BinaryReader): FlyThroughCommand;
}

export namespace FlyThroughCommand {
  export type AsObject = {
    goal: Position3D.AsObject,
  }
}

export class BombDropCommand extends jspb.Message {
  hasDropZone(): boolean;
  clearDropZone(): void;
  getDropZone(): Position2D;
  setDropZone(value?: Position2D): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BombDropCommand.AsObject;
  static toObject(includeInstance: boolean, msg: BombDropCommand): BombDropCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BombDropCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BombDropCommand;
  static deserializeBinaryFromReader(message: BombDropCommand, reader: jspb.BinaryReader): BombDropCommand;
}

export namespace BombDropCommand {
  export type AsObject = {
    dropZone: Position2D.AsObject,
  }
}

export class SurveyCommand extends jspb.Message {
  clearSurveyPolygonList(): void;
  getSurveyPolygonList(): Array<Position2D>;
  setSurveyPolygonList(value: Array<Position2D>): void;
  addSurveyPolygon(value?: Position2D, index?: number): Position2D;

  hasAltitude(): boolean;
  clearAltitude(): void;
  getAltitude(): number | undefined;
  setAltitude(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SurveyCommand.AsObject;
  static toObject(includeInstance: boolean, msg: SurveyCommand): SurveyCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SurveyCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SurveyCommand;
  static deserializeBinaryFromReader(message: SurveyCommand, reader: jspb.BinaryReader): SurveyCommand;
}

export namespace SurveyCommand {
  export type AsObject = {
    surveyPolygonList: Array<Position2D.AsObject>,
    altitude: number,
  }
}

export class OffAxisCommand extends jspb.Message {
  hasGoal(): boolean;
  clearGoal(): void;
  getGoal(): Position3D;
  setGoal(value?: Position3D): void;

  hasSubjectLocation(): boolean;
  clearSubjectLocation(): void;
  getSubjectLocation(): Position2D;
  setSubjectLocation(value?: Position2D): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OffAxisCommand.AsObject;
  static toObject(includeInstance: boolean, msg: OffAxisCommand): OffAxisCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OffAxisCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OffAxisCommand;
  static deserializeBinaryFromReader(message: OffAxisCommand, reader: jspb.BinaryReader): OffAxisCommand;
}

export namespace OffAxisCommand {
  export type AsObject = {
    goal: Position3D.AsObject,
    subjectLocation: Position2D.AsObject,
  }
}

export class NothingCommand extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NothingCommand.AsObject;
  static toObject(includeInstance: boolean, msg: NothingCommand): NothingCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NothingCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NothingCommand;
  static deserializeBinaryFromReader(message: NothingCommand, reader: jspb.BinaryReader): NothingCommand;
}

export namespace NothingCommand {
  export type AsObject = {
  }
}

export class SleepCommand extends jspb.Message {
  hasTime(): boolean;
  clearTime(): void;
  getTime(): number | undefined;
  setTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SleepCommand.AsObject;
  static toObject(includeInstance: boolean, msg: SleepCommand): SleepCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SleepCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SleepCommand;
  static deserializeBinaryFromReader(message: SleepCommand, reader: jspb.BinaryReader): SleepCommand;
}

export namespace SleepCommand {
  export type AsObject = {
    time: number,
  }
}

export class GotoCommand extends jspb.Message {
  hasGoal(): boolean;
  clearGoal(): void;
  getGoal(): Position3D;
  setGoal(value?: Position3D): void;

  hasComeToStop(): boolean;
  clearComeToStop(): void;
  getComeToStop(): boolean | undefined;
  setComeToStop(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GotoCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GotoCommand): GotoCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GotoCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GotoCommand;
  static deserializeBinaryFromReader(message: GotoCommand, reader: jspb.BinaryReader): GotoCommand;
}

export namespace GotoCommand {
  export type AsObject = {
    goal: Position3D.AsObject,
    comeToStop: boolean,
  }
}

export class GotoRawCommand extends jspb.Message {
  hasGoal(): boolean;
  clearGoal(): void;
  getGoal(): Position3D;
  setGoal(value?: Position3D): void;

  hasComeToStop(): boolean;
  clearComeToStop(): void;
  getComeToStop(): boolean | undefined;
  setComeToStop(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GotoRawCommand.AsObject;
  static toObject(includeInstance: boolean, msg: GotoRawCommand): GotoRawCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GotoRawCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GotoRawCommand;
  static deserializeBinaryFromReader(message: GotoRawCommand, reader: jspb.BinaryReader): GotoRawCommand;
}

export namespace GotoRawCommand {
  export type AsObject = {
    goal: Position3D.AsObject,
    comeToStop: boolean,
  }
}

export class Command extends jspb.Message {
  hasSubMission(): boolean;
  clearSubMission(): void;
  getSubMission(): Mission | undefined;
  setSubMission(value?: Mission): void;

  hasWaypointcommand(): boolean;
  clearWaypointcommand(): void;
  getWaypointcommand(): WaypointCommand | undefined;
  setWaypointcommand(value?: WaypointCommand): void;

  hasBombdropcommand(): boolean;
  clearBombdropcommand(): void;
  getBombdropcommand(): BombDropCommand | undefined;
  setBombdropcommand(value?: BombDropCommand): void;

  hasSurveycommand(): boolean;
  clearSurveycommand(): void;
  getSurveycommand(): SurveyCommand | undefined;
  setSurveycommand(value?: SurveyCommand): void;

  hasOffaxiscommand(): boolean;
  clearOffaxiscommand(): void;
  getOffaxiscommand(): OffAxisCommand | undefined;
  setOffaxiscommand(value?: OffAxisCommand): void;

  hasNothingcommand(): boolean;
  clearNothingcommand(): void;
  getNothingcommand(): NothingCommand | undefined;
  setNothingcommand(value?: NothingCommand): void;

  hasSleepcommand(): boolean;
  clearSleepcommand(): void;
  getSleepcommand(): SleepCommand | undefined;
  setSleepcommand(value?: SleepCommand): void;

  hasGotocommand(): boolean;
  clearGotocommand(): void;
  getGotocommand(): GotoCommand | undefined;
  setGotocommand(value?: GotoCommand): void;

  hasGotorawcommand(): boolean;
  clearGotorawcommand(): void;
  getGotorawcommand(): GotoRawCommand | undefined;
  setGotorawcommand(value?: GotoRawCommand): void;

  getCommandCase(): Command.CommandCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Command.AsObject;
  static toObject(includeInstance: boolean, msg: Command): Command.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Command, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Command;
  static deserializeBinaryFromReader(message: Command, reader: jspb.BinaryReader): Command;
}

export namespace Command {
  export type AsObject = {
    subMission?: Mission.AsObject,
    waypointcommand?: WaypointCommand.AsObject,
    bombdropcommand?: BombDropCommand.AsObject,
    surveycommand?: SurveyCommand.AsObject,
    offaxiscommand?: OffAxisCommand.AsObject,
    nothingcommand?: NothingCommand.AsObject,
    sleepcommand?: SleepCommand.AsObject,
    gotocommand?: GotoCommand.AsObject,
    gotorawcommand?: GotoRawCommand.AsObject,
  }

  export enum CommandCase {
    COMMAND_NOT_SET = 0,
    WAYPOINTCOMMAND = 2,
    BOMBDROPCOMMAND = 3,
    SURVEYCOMMAND = 4,
    OFFAXISCOMMAND = 5,
    NOTHINGCOMMAND = 6,
    SLEEPCOMMAND = 7,
    GOTOCOMMAND = 8,
    GOTORAWCOMMAND = 9,
  }
}

export class Mission extends jspb.Message {
  clearCommandsList(): void;
  getCommandsList(): Array<Command>;
  setCommandsList(value: Array<Command>): void;
  addCommands(value?: Command, index?: number): Command;

  hasCurrentCommand(): boolean;
  clearCurrentCommand(): void;
  getCurrentCommand(): number | undefined;
  setCurrentCommand(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Mission.AsObject;
  static toObject(includeInstance: boolean, msg: Mission): Mission.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Mission, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Mission;
  static deserializeBinaryFromReader(message: Mission, reader: jspb.BinaryReader): Mission;
}

export namespace Mission {
  export type AsObject = {
    commandsList: Array<Command.AsObject>,
    currentCommand?: number,
  }
}

export class StaticObstacle extends jspb.Message {
  hasLocation(): boolean;
  clearLocation(): void;
  getLocation(): Position2D;
  setLocation(value?: Position2D): void;

  hasCylinderRadius(): boolean;
  clearCylinderRadius(): void;
  getCylinderRadius(): number | undefined;
  setCylinderRadius(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StaticObstacle.AsObject;
  static toObject(includeInstance: boolean, msg: StaticObstacle): StaticObstacle.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StaticObstacle, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StaticObstacle;
  static deserializeBinaryFromReader(message: StaticObstacle, reader: jspb.BinaryReader): StaticObstacle;
}

export namespace StaticObstacle {
  export type AsObject = {
    location: Position2D.AsObject,
    cylinderRadius: number,
  }
}

export class MovingObstacle extends jspb.Message {
  hasPoint(): boolean;
  clearPoint(): void;
  getPoint(): Position3D;
  setPoint(value?: Position3D): void;

  hasSphereRadius(): boolean;
  clearSphereRadius(): void;
  getSphereRadius(): number | undefined;
  setSphereRadius(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MovingObstacle.AsObject;
  static toObject(includeInstance: boolean, msg: MovingObstacle): MovingObstacle.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MovingObstacle, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MovingObstacle;
  static deserializeBinaryFromReader(message: MovingObstacle, reader: jspb.BinaryReader): MovingObstacle;
}

export namespace MovingObstacle {
  export type AsObject = {
    point: Position3D.AsObject,
    sphereRadius: number,
  }
}

export class Obstacles extends jspb.Message {
  clearStaticObstaclesList(): void;
  getStaticObstaclesList(): Array<StaticObstacle>;
  setStaticObstaclesList(value: Array<StaticObstacle>): void;
  addStaticObstacles(value?: StaticObstacle, index?: number): StaticObstacle;

  clearMovingObstaclesList(): void;
  getMovingObstaclesList(): Array<MovingObstacle>;
  setMovingObstaclesList(value: Array<MovingObstacle>): void;
  addMovingObstacles(value?: MovingObstacle, index?: number): MovingObstacle;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Obstacles.AsObject;
  static toObject(includeInstance: boolean, msg: Obstacles): Obstacles.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Obstacles, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Obstacles;
  static deserializeBinaryFromReader(message: Obstacles, reader: jspb.BinaryReader): Obstacles;
}

export namespace Obstacles {
  export type AsObject = {
    staticObstaclesList: Array<StaticObstacle.AsObject>,
    movingObstaclesList: Array<MovingObstacle.AsObject>,
  }
}

export class GroundData extends jspb.Message {
  hasMission(): boolean;
  clearMission(): void;
  getMission(): Mission | undefined;
  setMission(value?: Mission): void;

  hasObstacles(): boolean;
  clearObstacles(): void;
  getObstacles(): Obstacles | undefined;
  setObstacles(value?: Obstacles): void;

  getDataCase(): GroundData.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroundData.AsObject;
  static toObject(includeInstance: boolean, msg: GroundData): GroundData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GroundData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroundData;
  static deserializeBinaryFromReader(message: GroundData, reader: jspb.BinaryReader): GroundData;
}

export namespace GroundData {
  export type AsObject = {
    mission?: Mission.AsObject,
    obstacles?: Obstacles.AsObject,
  }

  export enum DataCase {
    DATA_NOT_SET = 0,
    MISSION = 1,
    OBSTACLES = 2,
  }
}

