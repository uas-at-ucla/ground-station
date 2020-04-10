import { createSelector } from "reselect";

import { AppState } from "../store";
import { Position3D, Position2D } from "protobuf/drone/mission_commands_pb";
import {
  FlyZone,
  Position,
  StationaryObstacle
} from "protobuf/interop/interop_api_pb";
import { GroundCommand } from "protobuf/drone/timeline_grammar_pb";

export const locationCommands = createSelector(
  [
    (state: AppState) => state.mission.commands,
    (state: AppState) => state.mission.commandOrder
  ],
  (commands, commandOrder) => {
    const locationCommands: {
      [id: string]: {
        cmdType: keyof GroundCommand.AsObject;
        location: Position3D.AsObject;
      };
    } = {};
    const locationCommandOrder: string[] = [];
    for (const cmdId of commandOrder) {
      const cmd = commands[cmdId];
      const cmdType = Object.keys(cmd)[0] as keyof typeof cmd;
      if (cmdType !== "waitCommand") {
        let location: Position3D.AsObject;
        if (cmdType === "surveyCommand") {
          const cmdObj = cmd[cmdType];
          if (!cmdObj) {
            throw new Error("Unreachable");
          }
          let lat = 0;
          let lng = 0;
          for (const vertex of cmdObj.surveyPolygonList) {
            lat += vertex.latitude;
            lng += vertex.longitude;
          }
          lat /= cmdObj.surveyPolygonList.length;
          lng /= cmdObj.surveyPolygonList.length;
          location = {
            latitude: lat,
            longitude: lng,
            altitude: cmdObj.altitude
          };
        } else {
          const cmdObj = cmd[cmdType];
          if (!cmdObj) {
            throw new Error("Unreachable");
          }
          location = cmdObj.goal;
        }
        if (location) {
          locationCommands[cmdId] = {
            cmdType: cmdType,
            location: location
          };
          locationCommandOrder.push(cmdId);
        }
      }
    }
    return {
      commands: locationCommands,
      order: locationCommandOrder
    };
  }
);

export const groundProgramPath = createSelector(
  [locationCommands],
  locationCommands =>
    locationCommands.order.map(cmdId => ({
      lat: locationCommands.commands[cmdId].location.latitude,
      lng: locationCommands.commands[cmdId].location.longitude
    }))
);

export const droneProgramPath = createSelector(
  [(state: AppState) => state.mission.droneProgram],
  droneProgram => {
    if (!droneProgram) {
      return [];
    }
    const path = [];
    for (const cmd of droneProgram.commandsList) {
      const cmdType = Object.keys(cmd)[0] as keyof typeof cmd;
      if (cmdType === "translateCommand") {
        const location = cmd[cmdType]?.goal;
        if (location) {
          path.push({
            lat: location.latitude,
            lng: location.longitude
          });
        }
      }
    }
    return path;
  }
);

function positionToGoogleMapLatLng(
  position: Position2D.AsObject
): google.maps.LatLngLiteral {
  return { lat: position.latitude, lng: position.longitude };
}

function polygonCenter(points: Position2D.AsObject[]) {
  const center = { lat: 0, lng: 0 };
  for (const coord of points) {
    center.lat += coord.latitude;
    center.lng += coord.longitude;
  }
  center.lat /= points.length;
  center.lng /= points.length;
  return center;
}

const FEET_PER_METER = 3.28084;

export const googleMapInteropMission = createSelector(
  [(state: AppState) => state.mission.interopData],
  interopData => {
    if (!interopData) {
      return null;
    }
    const airDropBoundaryPointsList = interopData.mission
      .airDropBoundaryPointsList as Position2D.AsObject[];
    const airDropPos = interopData.mission.airDropPos as Position2D.AsObject;
    const emergentLastKnownPos = interopData.mission
      .emergentLastKnownPos as Position2D.AsObject;
    const flyZonesList = interopData.mission.flyZonesList as (Omit<
      Required<FlyZone.AsObject>,
      "boundaryPointsList"
    > & { boundaryPointsList: Position2D.AsObject[] })[];
    const lostCommsPos = interopData.mission
      .lostCommsPos as Position2D.AsObject;
    const offAxisOdlcPos = interopData.mission
      .offAxisOdlcPos as Position2D.AsObject;
    const searchGridPointsList = interopData.mission
      .searchGridPointsList as Position2D.AsObject[];
    const stationaryObstaclesList = interopData.mission
      .stationaryObstaclesList as Required<StationaryObstacle.AsObject>[];
    const ugvDrivePos = interopData.mission.ugvDrivePos as Position2D.AsObject;
    const waypointsList = interopData.mission
      .waypointsList as Position3D.AsObject[];

    return {
      airDropBoundaryPointsList: airDropBoundaryPointsList.map(
        positionToGoogleMapLatLng
      ),
      airDropBoundaryCenter: polygonCenter(airDropBoundaryPointsList),
      airDropPos: positionToGoogleMapLatLng(airDropPos),
      emergentLastKnownPos: positionToGoogleMapLatLng(emergentLastKnownPos),
      flyZonesList: flyZonesList.map(flyZone => ({
        ...flyZone,
        boundaryPointsList: flyZone.boundaryPointsList.map(
          positionToGoogleMapLatLng
        ),
        center: polygonCenter(flyZone.boundaryPointsList)
      })),
      lostCommsPos: positionToGoogleMapLatLng(lostCommsPos),
      offAxisOdlcPos: positionToGoogleMapLatLng(offAxisOdlcPos),
      searchGridPointsList: searchGridPointsList.map(positionToGoogleMapLatLng),
      searchGridCenter: polygonCenter(searchGridPointsList),
      stationaryObstaclesList: stationaryObstaclesList.map(obstacle => ({
        height: obstacle.height,
        radiusFeet: obstacle.radius,
        radiusMeters: obstacle.radius / FEET_PER_METER,
        position: positionToGoogleMapLatLng(obstacle)
      })),
      ugvDrivePos: positionToGoogleMapLatLng(ugvDrivePos),
      waypointsList: waypointsList.map(point => ({
        altitude: point.altitude,
        position: positionToGoogleMapLatLng(point)
      }))
    };
  }
);

export const mainFlyZone = createSelector(
  [googleMapInteropMission],
  interopMission => {
    if (!interopMission) {
      return null;
    }
    let mainFlyZone: typeof interopMission.flyZonesList[number] & {
      surroundingBox: google.maps.LatLngLiteral[];
    } = {
      boundaryPointsList: [],
      altitudeMin: 0,
      altitudeMax: 0,
      center: { lat: 0, lng: 0 },
      surroundingBox: []
    };
    let maxArea = -1;
    for (const flyZone of interopMission.flyZonesList) {
      const area = polygonArea(flyZone.boundaryPointsList);
      if (area > maxArea) {
        maxArea = area;
        mainFlyZone = { ...flyZone, surroundingBox: [] };
      }
    }
    mainFlyZone.surroundingBox = [
      { lat: mainFlyZone.center.lat + 0.1, lng: mainFlyZone.center.lng + 0.1 },
      { lat: mainFlyZone.center.lat + 0.1, lng: mainFlyZone.center.lng - 0.1 },
      { lat: mainFlyZone.center.lat - 0.1, lng: mainFlyZone.center.lng - 0.1 },
      { lat: mainFlyZone.center.lat - 0.1, lng: mainFlyZone.center.lng + 0.1 }
    ];
    if (!polygonIsClockwise(mainFlyZone.boundaryPointsList)) {
      mainFlyZone.surroundingBox.reverse();
    }
    return mainFlyZone;
  }
);

function surroundingBox(pos: google.maps.LatLngLiteral) {
  return;
}

function shoelace(vertices: { lat: number; lng: number }[]) {
  // The shoelace formula determines the area of a polygon
  let area = 0;

  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    area += vertices[i].lng * vertices[j].lat;
    area -= vertices[j].lng * vertices[i].lat;
  }

  return area;
}

function polygonArea(vertices: { lat: number; lng: number }[]) {
  return Math.abs(shoelace(vertices));
}

function polygonIsClockwise(vertices: { lat: number; lng: number }[]) {
  // Determine whether vertices are clockwise/counterclockwise using the
  // sign of the output from the shoelace formula.
  return shoelace(vertices) < 0;
}
