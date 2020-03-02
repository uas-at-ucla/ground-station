import React, { useMemo } from "react";
import { Marker, Circle, Polygon } from "@react-google-maps/api";
import { Button } from "reactstrap";
import { connect } from "react-redux";

import camera from "./icons/camera.png";
import person from "./icons/person.png";
import target from "./icons/air_drop.png";
import wheel from "./icons/wheel.png";
import waypoint from "./icons/waypoint.png";
import home from "./icons/home.png";
import { selector, AppState } from "redux/store";
import * as missionActions from "redux/actions/missionActions";
import MapElementWithInfo from "components/utils/MapElementWithInfo";
import { ExtractPropsType } from "utils/reduxUtils";
import {
  Position,
  StationaryObstacle,
  Mission
} from "protobuf/interop/interop_api_pb";

const FEET_PER_METER = 3.28084;

interface OwnProps {
  isOpen: { [key: string]: boolean };
  toggleOpen: (id: string) => void;
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const derivedData = selector(state);
  return {
    interopData: state.mission.interopData,
    mainFlyZone: derivedData.mission.mainFlyZone,
    defaultAltitude: state.mission.defaultAltitude,
    homeAltitude:
      state.telemetry.droneTelemetry && state.telemetry.droneTelemetry.sensors
        ? state.telemetry.droneTelemetry.sensors.homeAltitude
        : null
  };
};

const mapDispatchToProps = missionActions;

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const openCloseLogic = (id: string, props: Props) => ({
  isOpen: props.isOpen[id],
  id: id,
  toggleOpen: props.toggleOpen
});
type OpenCloseLogic = ReturnType<typeof openCloseLogic>;

const InteropItems = (props: Props) =>
  props.interopData && props.mainFlyZone ? (
    <span>
      <LostCommsPos
        mission={props.interopData.mission}
        {...openCloseLogic("lostCommsPos", props)}
      />
      <UgvDrivePos
        mission={props.interopData.mission}
        {...openCloseLogic("ugvDrivePos", props)}
      />
      <AirDropPos
        mission={props.interopData.mission}
        addCommand={props.addCommand}
        defaultAltitude={props.defaultAltitude}
        {...openCloseLogic("airDropPos", props)}
      />
      <EmergentObjectPos
        mission={props.interopData.mission}
        addCommand={props.addCommand}
        defaultAltitude={props.defaultAltitude}
        {...openCloseLogic("emergentObjectPos", props)}
      />
      <OffAxisPos
        mission={props.interopData.mission}
        addCommand={props.addCommand}
        defaultAltitude={props.defaultAltitude}
        {...openCloseLogic("offAxisPos", props)}
      />
      <AirDropBoundary
        mission={props.interopData.mission}
        {...openCloseLogic("airDropBoundary", props)}
      />
      <SearchArea
        mission={props.interopData.mission}
        addCommand={props.addCommand}
        defaultAltitude={props.defaultAltitude}
        {...openCloseLogic("searchArea", props)}
      />
      <BoundaryPolygon
        mainFlyZone={props.mainFlyZone}
        {...openCloseLogic("boundaryPolygon", props)}
      />
      <FlyZones mission={props.interopData.mission} />
      {(props.interopData.mission.stationaryObstaclesList as Required<
        StationaryObstacle.AsObject
      >[]).map((obstacle, index) => (
        <Obstacle
          obstacle={obstacle}
          key={index}
          {...openCloseLogic(`obstacle-${index}`, props)}
        />
      ))}
      {(props.interopData.mission.waypointsList as Required<
        Position.AsObject
      >[]).map((pos, index) => {
        return (
          <Waypoint
            pos={pos}
            index={index}
            key={index}
            homeAltitude={props.homeAltitude}
            addCommand={props.addCommand}
            {...openCloseLogic(`waypoint-${index}`, props)}
          />
        );
      })}
    </span>
  ) : null;
export default connectComponent(InteropItems);

const LostCommsPosImpure = (
  props: { mission: Required<Mission.AsObject> } & OpenCloseLogic
) => {
  const lostCommsIcon = useMemo(
    () => ({
      url: home,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const interopPosition = props.mission.lostCommsPos as Required<
    Position.AsObject
  >;
  const mapPos = {
    lat: interopPosition.latitude,
    lng: interopPosition.longitude
  };
  return (
    <MapElementWithInfo
      Element={Marker}
      position={mapPos}
      icon={lostCommsIcon}
      isOpen={props.isOpen}
      id={props.id}
      toggleOpen={props.toggleOpen}
    >
      <div>Home (lost comms position)</div>
      <div>
        {mapPos.lat}, {mapPos.lng}
      </div>
    </MapElementWithInfo>
  );
};
const LostCommsPos = React.memo(LostCommsPosImpure);

const UgvDrivePosImpure = (
  props: { mission: Required<Mission.AsObject> } & OpenCloseLogic
) => {
  const ugvDestIcon = useMemo(
    () => ({
      url: wheel,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const interopPosition = props.mission.ugvDrivePos as Required<
    Position.AsObject
  >;
  const mapPos = {
    lat: interopPosition.latitude,
    lng: interopPosition.longitude
  };
  return (
    <MapElementWithInfo
      Element={Marker}
      position={mapPos}
      icon={ugvDestIcon}
      isOpen={props.isOpen}
      id={props.id}
      toggleOpen={props.toggleOpen}
    >
      <div>UGV Destination</div>
      <div>
        {mapPos.lat}, {mapPos.lng}
      </div>
    </MapElementWithInfo>
  );
};
const UgvDrivePos = React.memo(UgvDrivePosImpure);

const AirDropPosImpure = (
  props: {
    mission: Required<Mission.AsObject>;
    addCommand: typeof missionActions["addCommand"];
    defaultAltitude: number;
  } & OpenCloseLogic
) => {
  const airDropIcon = useMemo(
    () => ({
      url: target,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const interopPosition = props.mission.airDropPos as Required<
    Position.AsObject
  >;
  const mapPos = {
    lat: interopPosition.latitude,
    lng: interopPosition.longitude
  };
  return (
    <MapElementWithInfo
      Element={Marker}
      position={mapPos}
      icon={airDropIcon}
      isOpen={props.isOpen}
      id={props.id}
      toggleOpen={props.toggleOpen}
    >
      <div>Air Drop Position</div>
      <Button
        size="sm"
        onClick={() =>
          props.addCommand({
            ugvDropCommand: {
              goal: {
                latitude: mapPos.lat,
                longitude: mapPos.lng,
                altitude: props.defaultAltitude
              }
            }
          })
        }
      >
        Add to Mission
      </Button>
    </MapElementWithInfo>
  );
};
const AirDropPos = React.memo(AirDropPosImpure);

const EmergentObjectPosImpure = (
  props: {
    mission: Required<Mission.AsObject>;
    addCommand: typeof missionActions["addCommand"];
    defaultAltitude: number;
  } & OpenCloseLogic
) => {
  const emergentObjectIcon = useMemo(
    () => ({
      url: person,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const interopPosition = props.mission.emergentLastKnownPos as Required<
    Position.AsObject
  >;
  const mapPos = {
    lat: interopPosition.latitude,
    lng: interopPosition.longitude
  };
  return (
    <MapElementWithInfo
      Element={Marker}
      position={mapPos}
      icon={emergentObjectIcon}
      isOpen={props.isOpen}
      id={props.id}
      toggleOpen={props.toggleOpen}
    >
      <div>Emergent Object</div>
      <Button
        size="sm"
        onClick={() =>
          props.addCommand({
            // TODO if we ever decide to attempt emergent object, replace with specific command
            waypointCommand: {
              goal: {
                latitude: mapPos.lat,
                longitude: mapPos.lng,
                altitude: props.defaultAltitude
              }
            }
          })
        }
      >
        Add to Mission
      </Button>
    </MapElementWithInfo>
  );
};
const EmergentObjectPos = React.memo(EmergentObjectPosImpure);

const OffAxisPosImpure = (
  props: {
    mission: Required<Mission.AsObject>;
    addCommand: typeof missionActions["addCommand"];
    defaultAltitude: number;
  } & OpenCloseLogic
) => {
  const offAxisIcon = useMemo(
    () => ({
      url: camera,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const interopPosition = props.mission.offAxisOdlcPos as Required<
    Position.AsObject
  >;
  const mapPos = {
    lat: interopPosition.latitude,
    lng: interopPosition.longitude
  };
  return (
    <MapElementWithInfo
      Element={Marker}
      position={mapPos}
      icon={offAxisIcon}
      isOpen={props.isOpen}
      id={props.id}
      toggleOpen={props.toggleOpen}
    >
      <div>Off-Axis Object</div>
      <Button
        size="sm"
        onClick={() =>
          props.addCommand({
            offAxisCommand: {
              goal: {
                latitude: mapPos.lat,
                longitude: mapPos.lng,
                altitude: props.defaultAltitude
              },
              subjectLocation: {
                latitude: mapPos.lat,
                longitude: mapPos.lng
              }
            }
          })
        }
      >
        Add to Mission
      </Button>
    </MapElementWithInfo>
  );
};
const OffAxisPos = React.memo(OffAxisPosImpure);

const boundaryPolygonStyle = {
  strokeColor: "#FF0000",
  fillColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  zIndex: -1,
  clickable: false
};

const BoundaryPolygonImpure = (
  props: {
    mainFlyZone: NonNullable<Props["mainFlyZone"]>;
  } & OpenCloseLogic
) => {
  const boxCenter = props.mainFlyZone.boundaryPointsList[0] as Required<
    Position.AsObject
  >;
  const boxCoordinates = [
    { lat: boxCenter.latitude + 0.1, lng: boxCenter.longitude + 0.1 },
    { lat: boxCenter.latitude + 0.1, lng: boxCenter.longitude - 0.1 },
    { lat: boxCenter.latitude - 0.1, lng: boxCenter.longitude - 0.1 },
    { lat: boxCenter.latitude - 0.1, lng: boxCenter.longitude + 0.1 }
  ];
  const boundaryCoordinates = (props.mainFlyZone.boundaryPointsList as Required<
    Position.AsObject
  >[]).map(coord => {
    return { lat: coord.latitude, lng: coord.longitude };
  });
  if (!props.mainFlyZone.isClockwise) {
    boundaryCoordinates.reverse();
  }
  return (
    <Polygon
      paths={[boxCoordinates, boundaryCoordinates]}
      options={boundaryPolygonStyle}
    />
  );
};
const BoundaryPolygon = React.memo(BoundaryPolygonImpure);

const flyZonePolygonStyle = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillOpacity: 0,
  clickable: false,
  zIndex: -1
};

const FlyZonesImpure = (props: { mission: Required<Mission.AsObject> }) => {
  const flyZonePolygons = props.mission.flyZonesList.map(flyZone => {
    return (flyZone.boundaryPointsList as Required<Position.AsObject>[]).map(
      coord => {
        return { lat: coord.latitude, lng: coord.longitude };
      }
    );
  });
  return (
    <span>
      {flyZonePolygons.map((path, index) => (
        <Polygon key={index} path={path} options={flyZonePolygonStyle} />
      ))}
    </span>
  );
};
const FlyZones = React.memo(FlyZonesImpure);

const airDropBoundaryStyle = {
  strokeColor: "#FFFFFF",
  fillColor: "#FFFFFF",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  zIndex: -1
};

const AirDropBoundaryImpure = (
  props: {
    mission: Required<Mission.AsObject>;
  } & OpenCloseLogic
) => {
  let centerLat = 0;
  let centerLng = 0;
  const numVertices = props.mission.airDropBoundaryPointsList.length;
  const interopVertices = props.mission.airDropBoundaryPointsList as Required<
    Position.AsObject
  >[];
  const vertices = interopVertices.map(coord => {
    centerLat += coord.latitude;
    centerLng += coord.longitude;
    return { lat: coord.latitude, lng: coord.longitude };
  });
  centerLat /= numVertices;
  centerLng /= numVertices;
  return (
    <MapElementWithInfo
      Element={Polygon}
      path={vertices}
      infoPosition={{ lat: centerLat, lng: centerLng }}
      options={airDropBoundaryStyle}
      isOpen={props.isOpen}
      id={props.id}
      toggleOpen={props.toggleOpen}
    >
      <div>Air Drop Boundary</div>
    </MapElementWithInfo>
  );
};
const AirDropBoundary = React.memo(AirDropBoundaryImpure);

const searchGridPolygonStyle = {
  zIndex: -1,
  strokeColor: "#0000FF",
  fillColor: "#0000FF",
  strokeOpacity: 0.8,
  strokeWeight: 2
};

const SearchAreaImpure = (
  props: {
    mission: Required<Mission.AsObject>;
    addCommand: typeof missionActions["addCommand"];
    defaultAltitude: number;
  } & OpenCloseLogic
) => {
  let searchCenterLat = 0;
  let searchCenterLng = 0;
  const numVertices = props.mission.searchGridPointsList.length;
  const interopSearchGridPoints = props.mission
    .searchGridPointsList as Required<Position.AsObject>[];
  const searchGridPoints = interopSearchGridPoints.map(coord => {
    searchCenterLat += coord.latitude;
    searchCenterLng += coord.longitude;
    return { lat: coord.latitude, lng: coord.longitude };
  });
  searchCenterLat /= numVertices;
  searchCenterLng /= numVertices;
  return (
    <MapElementWithInfo
      Element={Polygon}
      path={searchGridPoints}
      infoPosition={{ lat: searchCenterLat, lng: searchCenterLng }}
      options={searchGridPolygonStyle}
      isOpen={props.isOpen}
      id={props.id}
      toggleOpen={props.toggleOpen}
    >
      <div>Search Area</div>
      <Button
        size="sm"
        onClick={() =>
          props.addCommand({
            surveyCommand: {
              surveyPolygonList: interopSearchGridPoints,
              altitude: props.defaultAltitude
            }
          })
        }
      >
        Add to Mission
      </Button>
    </MapElementWithInfo>
  );
};
const SearchArea = React.memo(SearchAreaImpure);

const obstacleStyle = {
  strokeColor: "#FFFF00",
  fillColor: "#FFFF00",
  strokeOpacity: 0.8,
  strokeWeight: 2
};

const ObstacleImpure = (
  props: {
    obstacle: Required<StationaryObstacle.AsObject>;
  } & OpenCloseLogic
) => (
  <MapElementWithInfo
    Element={Circle}
    options={obstacleStyle}
    radius={props.obstacle.radius / FEET_PER_METER}
    center={{ lat: props.obstacle.latitude, lng: props.obstacle.longitude }}
    infoPosition={{
      lat: props.obstacle.latitude,
      lng: props.obstacle.longitude
    }}
    isOpen={props.isOpen}
    id={props.id}
    toggleOpen={props.toggleOpen}
  >
    Obstacle{" "}
    {"(" + props.obstacle.latitude + ", " + props.obstacle.longitude + ")"}
    <br />
    {"Height: " + props.obstacle.height + " ft AMSL"}
    <br />
    {"Radius: " + props.obstacle.radius + " ft"}
  </MapElementWithInfo>
);
const Obstacle = React.memo(ObstacleImpure);

const WaypointImpure = (
  props: {
    pos: Required<Position.AsObject>;
    index: number;
    homeAltitude: number | null;
    addCommand: typeof missionActions["addCommand"];
  } & OpenCloseLogic
) => {
  const waypointIcon = useMemo(
    () => ({
      url: waypoint,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  return (
    <MapElementWithInfo
      Element={Marker}
      position={{ lat: props.pos.latitude, lng: props.pos.longitude }}
      icon={waypointIcon}
      isOpen={props.isOpen}
      id={props.id}
      toggleOpen={props.toggleOpen}
    >
      <div>
        Waypoint {props.index + 1}
        <br />
        {props.pos.altitude} ft AMSL{" "}
        {props.homeAltitude != null
          ? "(" +
            (props.pos.altitude - props.homeAltitude * FEET_PER_METER) +
            ") ft rel"
          : null}
      </div>
      <Button
        size="sm"
        onClick={() => {
          props.addCommand({
            waypointCommand: {
              goal: {
                latitude: props.pos.latitude,
                longitude: props.pos.longitude,
                altitude:
                  props.homeAltitude != null
                    ? props.pos.altitude - props.homeAltitude * FEET_PER_METER
                    : props.pos.altitude
              }
            }
          });
        }}
      >
        Add to Mission
      </Button>
    </MapElementWithInfo>
  );
};
const Waypoint = React.memo(WaypointImpure);
