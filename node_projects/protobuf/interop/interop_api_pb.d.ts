// package: auvsi_suas.proto
// file: interop/interop_api.proto

import * as jspb from "google-protobuf";

export class Credentials extends jspb.Message {
  hasUsername(): boolean;
  clearUsername(): void;
  getUsername(): string | undefined;
  setUsername(value: string): void;

  hasPassword(): boolean;
  clearPassword(): void;
  getPassword(): string | undefined;
  setPassword(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Credentials.AsObject;
  static toObject(includeInstance: boolean, msg: Credentials): Credentials.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Credentials, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Credentials;
  static deserializeBinaryFromReader(message: Credentials, reader: jspb.BinaryReader): Credentials;
}

export namespace Credentials {
  export type AsObject = {
    username?: string,
    password?: string,
  }
}

export class TeamId extends jspb.Message {
  hasId(): boolean;
  clearId(): void;
  getId(): number | undefined;
  setId(value: number): void;

  hasUsername(): boolean;
  clearUsername(): void;
  getUsername(): string | undefined;
  setUsername(value: string): void;

  hasName(): boolean;
  clearName(): void;
  getName(): string | undefined;
  setName(value: string): void;

  hasUniversity(): boolean;
  clearUniversity(): void;
  getUniversity(): string | undefined;
  setUniversity(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TeamId.AsObject;
  static toObject(includeInstance: boolean, msg: TeamId): TeamId.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TeamId, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TeamId;
  static deserializeBinaryFromReader(message: TeamId, reader: jspb.BinaryReader): TeamId;
}

export namespace TeamId {
  export type AsObject = {
    id?: number,
    username?: string,
    name?: string,
    university?: string,
  }
}

export class TeamStatus extends jspb.Message {
  hasTeam(): boolean;
  clearTeam(): void;
  getTeam(): TeamId | undefined;
  setTeam(value?: TeamId): void;

  hasInAir(): boolean;
  clearInAir(): void;
  getInAir(): boolean | undefined;
  setInAir(value: boolean): void;

  hasTelemetry(): boolean;
  clearTelemetry(): void;
  getTelemetry(): Telemetry | undefined;
  setTelemetry(value?: Telemetry): void;

  hasTelemetryId(): boolean;
  clearTelemetryId(): void;
  getTelemetryId(): number | undefined;
  setTelemetryId(value: number): void;

  hasTelemetryAgeSec(): boolean;
  clearTelemetryAgeSec(): void;
  getTelemetryAgeSec(): number | undefined;
  setTelemetryAgeSec(value: number): void;

  hasTelemetryTimestamp(): boolean;
  clearTelemetryTimestamp(): void;
  getTelemetryTimestamp(): string | undefined;
  setTelemetryTimestamp(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TeamStatus.AsObject;
  static toObject(includeInstance: boolean, msg: TeamStatus): TeamStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TeamStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TeamStatus;
  static deserializeBinaryFromReader(message: TeamStatus, reader: jspb.BinaryReader): TeamStatus;
}

export namespace TeamStatus {
  export type AsObject = {
    team?: TeamId.AsObject,
    inAir?: boolean,
    telemetry?: Telemetry.AsObject,
    telemetryId?: number,
    telemetryAgeSec?: number,
    telemetryTimestamp?: string,
  }
}

export class Mission extends jspb.Message {
  hasId(): boolean;
  clearId(): void;
  getId(): number | undefined;
  setId(value: number): void;

  hasLostCommsPos(): boolean;
  clearLostCommsPos(): void;
  getLostCommsPos(): Position | undefined;
  setLostCommsPos(value?: Position): void;

  clearFlyZonesList(): void;
  getFlyZonesList(): Array<FlyZone>;
  setFlyZonesList(value: Array<FlyZone>): void;
  addFlyZones(value?: FlyZone, index?: number): FlyZone;

  clearWaypointsList(): void;
  getWaypointsList(): Array<Position>;
  setWaypointsList(value: Array<Position>): void;
  addWaypoints(value?: Position, index?: number): Position;

  clearSearchGridPointsList(): void;
  getSearchGridPointsList(): Array<Position>;
  setSearchGridPointsList(value: Array<Position>): void;
  addSearchGridPoints(value?: Position, index?: number): Position;

  hasOffAxisOdlcPos(): boolean;
  clearOffAxisOdlcPos(): void;
  getOffAxisOdlcPos(): Position | undefined;
  setOffAxisOdlcPos(value?: Position): void;

  hasEmergentLastKnownPos(): boolean;
  clearEmergentLastKnownPos(): void;
  getEmergentLastKnownPos(): Position | undefined;
  setEmergentLastKnownPos(value?: Position): void;

  clearAirDropBoundaryPointsList(): void;
  getAirDropBoundaryPointsList(): Array<Position>;
  setAirDropBoundaryPointsList(value: Array<Position>): void;
  addAirDropBoundaryPoints(value?: Position, index?: number): Position;

  hasAirDropPos(): boolean;
  clearAirDropPos(): void;
  getAirDropPos(): Position | undefined;
  setAirDropPos(value?: Position): void;

  hasUgvDrivePos(): boolean;
  clearUgvDrivePos(): void;
  getUgvDrivePos(): Position | undefined;
  setUgvDrivePos(value?: Position): void;

  clearStationaryObstaclesList(): void;
  getStationaryObstaclesList(): Array<StationaryObstacle>;
  setStationaryObstaclesList(value: Array<StationaryObstacle>): void;
  addStationaryObstacles(value?: StationaryObstacle, index?: number): StationaryObstacle;

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
    id?: number,
    lostCommsPos?: Position.AsObject,
    flyZonesList: Array<FlyZone.AsObject>,
    waypointsList: Array<Position.AsObject>,
    searchGridPointsList: Array<Position.AsObject>,
    offAxisOdlcPos?: Position.AsObject,
    emergentLastKnownPos?: Position.AsObject,
    airDropBoundaryPointsList: Array<Position.AsObject>,
    airDropPos?: Position.AsObject,
    ugvDrivePos?: Position.AsObject,
    stationaryObstaclesList: Array<StationaryObstacle.AsObject>,
  }
}

export class FlyZone extends jspb.Message {
  hasAltitudeMin(): boolean;
  clearAltitudeMin(): void;
  getAltitudeMin(): number | undefined;
  setAltitudeMin(value: number): void;

  hasAltitudeMax(): boolean;
  clearAltitudeMax(): void;
  getAltitudeMax(): number | undefined;
  setAltitudeMax(value: number): void;

  clearBoundaryPointsList(): void;
  getBoundaryPointsList(): Array<Position>;
  setBoundaryPointsList(value: Array<Position>): void;
  addBoundaryPoints(value?: Position, index?: number): Position;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FlyZone.AsObject;
  static toObject(includeInstance: boolean, msg: FlyZone): FlyZone.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FlyZone, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FlyZone;
  static deserializeBinaryFromReader(message: FlyZone, reader: jspb.BinaryReader): FlyZone;
}

export namespace FlyZone {
  export type AsObject = {
    altitudeMin?: number,
    altitudeMax?: number,
    boundaryPointsList: Array<Position.AsObject>,
  }
}

export class Position extends jspb.Message {
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
  toObject(includeInstance?: boolean): Position.AsObject;
  static toObject(includeInstance: boolean, msg: Position): Position.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Position, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Position;
  static deserializeBinaryFromReader(message: Position, reader: jspb.BinaryReader): Position;
}

export namespace Position {
  export type AsObject = {
    latitude?: number,
    longitude?: number,
    altitude?: number,
  }
}

export class Telemetry extends jspb.Message {
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

  hasHeading(): boolean;
  clearHeading(): void;
  getHeading(): number | undefined;
  setHeading(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Telemetry.AsObject;
  static toObject(includeInstance: boolean, msg: Telemetry): Telemetry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Telemetry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Telemetry;
  static deserializeBinaryFromReader(message: Telemetry, reader: jspb.BinaryReader): Telemetry;
}

export namespace Telemetry {
  export type AsObject = {
    latitude?: number,
    longitude?: number,
    altitude?: number,
    heading?: number,
  }
}

export class StationaryObstacle extends jspb.Message {
  hasLatitude(): boolean;
  clearLatitude(): void;
  getLatitude(): number | undefined;
  setLatitude(value: number): void;

  hasLongitude(): boolean;
  clearLongitude(): void;
  getLongitude(): number | undefined;
  setLongitude(value: number): void;

  hasRadius(): boolean;
  clearRadius(): void;
  getRadius(): number | undefined;
  setRadius(value: number): void;

  hasHeight(): boolean;
  clearHeight(): void;
  getHeight(): number | undefined;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StationaryObstacle.AsObject;
  static toObject(includeInstance: boolean, msg: StationaryObstacle): StationaryObstacle.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StationaryObstacle, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StationaryObstacle;
  static deserializeBinaryFromReader(message: StationaryObstacle, reader: jspb.BinaryReader): StationaryObstacle;
}

export namespace StationaryObstacle {
  export type AsObject = {
    latitude?: number,
    longitude?: number,
    radius?: number,
    height?: number,
  }
}

export class Odlc extends jspb.Message {
  hasId(): boolean;
  clearId(): void;
  getId(): number | undefined;
  setId(value: number): void;

  hasMission(): boolean;
  clearMission(): void;
  getMission(): number | undefined;
  setMission(value: number): void;

  hasType(): boolean;
  clearType(): void;
  getType(): Odlc.TypeMap[keyof Odlc.TypeMap] | undefined;
  setType(value: Odlc.TypeMap[keyof Odlc.TypeMap]): void;

  hasLatitude(): boolean;
  clearLatitude(): void;
  getLatitude(): number | undefined;
  setLatitude(value: number): void;

  hasLongitude(): boolean;
  clearLongitude(): void;
  getLongitude(): number | undefined;
  setLongitude(value: number): void;

  hasOrientation(): boolean;
  clearOrientation(): void;
  getOrientation(): Odlc.OrientationMap[keyof Odlc.OrientationMap] | undefined;
  setOrientation(value: Odlc.OrientationMap[keyof Odlc.OrientationMap]): void;

  hasShape(): boolean;
  clearShape(): void;
  getShape(): Odlc.ShapeMap[keyof Odlc.ShapeMap] | undefined;
  setShape(value: Odlc.ShapeMap[keyof Odlc.ShapeMap]): void;

  hasAlphanumeric(): boolean;
  clearAlphanumeric(): void;
  getAlphanumeric(): string | undefined;
  setAlphanumeric(value: string): void;

  hasShapeColor(): boolean;
  clearShapeColor(): void;
  getShapeColor(): Odlc.ColorMap[keyof Odlc.ColorMap] | undefined;
  setShapeColor(value: Odlc.ColorMap[keyof Odlc.ColorMap]): void;

  hasAlphanumericColor(): boolean;
  clearAlphanumericColor(): void;
  getAlphanumericColor(): Odlc.ColorMap[keyof Odlc.ColorMap] | undefined;
  setAlphanumericColor(value: Odlc.ColorMap[keyof Odlc.ColorMap]): void;

  hasDescription(): boolean;
  clearDescription(): void;
  getDescription(): string | undefined;
  setDescription(value: string): void;

  hasAutonomous(): boolean;
  clearAutonomous(): void;
  getAutonomous(): boolean | undefined;
  setAutonomous(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Odlc.AsObject;
  static toObject(includeInstance: boolean, msg: Odlc): Odlc.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Odlc, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Odlc;
  static deserializeBinaryFromReader(message: Odlc, reader: jspb.BinaryReader): Odlc;
}

export namespace Odlc {
  export type AsObject = {
    id?: number,
    mission?: number,
    type?: Odlc.TypeMap[keyof Odlc.TypeMap],
    latitude?: number,
    longitude?: number,
    orientation?: Odlc.OrientationMap[keyof Odlc.OrientationMap],
    shape?: Odlc.ShapeMap[keyof Odlc.ShapeMap],
    alphanumeric?: string,
    shapeColor?: Odlc.ColorMap[keyof Odlc.ColorMap],
    alphanumericColor?: Odlc.ColorMap[keyof Odlc.ColorMap],
    description?: string,
    autonomous?: boolean,
  }

  export interface TypeMap {
    STANDARD: 1;
    EMERGENT: 4;
  }

  export const Type: TypeMap;

  export interface OrientationMap {
    N: 1;
    NE: 2;
    E: 3;
    SE: 4;
    S: 5;
    SW: 6;
    W: 7;
    NW: 8;
  }

  export const Orientation: OrientationMap;

  export interface ShapeMap {
    CIRCLE: 1;
    SEMICIRCLE: 2;
    QUARTER_CIRCLE: 3;
    TRIANGLE: 4;
    SQUARE: 5;
    RECTANGLE: 6;
    TRAPEZOID: 7;
    PENTAGON: 8;
    HEXAGON: 9;
    HEPTAGON: 10;
    OCTAGON: 11;
    STAR: 12;
    CROSS: 13;
  }

  export const Shape: ShapeMap;

  export interface ColorMap {
    WHITE: 1;
    BLACK: 2;
    GRAY: 3;
    RED: 4;
    BLUE: 5;
    GREEN: 6;
    YELLOW: 7;
    PURPLE: 8;
    BROWN: 9;
    ORANGE: 10;
  }

  export const Color: ColorMap;
}

