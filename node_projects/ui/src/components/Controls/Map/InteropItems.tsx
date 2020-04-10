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

const FEET_PER_METER = 3.28084;

interface OwnProps {
  isOpen: { [key: string]: boolean };
  toggleOpen: (id: string) => void;
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const derivedData = selector(state);
  return {
    interopMission: derivedData.mission.googleMapInteropMission,
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

const InteropItems = (props: Props) => {
  const openCloseLogic = (id: string) => ({
    isOpen: props.isOpen[id],
    id: id,
    toggleOpen: props.toggleOpen
  });

  const lostCommsIcon = useMemo(
    () => ({
      url: home,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const ugvDestIcon = useMemo(
    () => ({
      url: wheel,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const airDropIcon = useMemo(
    () => ({
      url: target,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const emergentObjectIcon = useMemo(
    () => ({
      url: person,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const offAxisIcon = useMemo(
    () => ({
      url: camera,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const waypointIcon = useMemo(
    () => ({
      url: waypoint,
      scaledSize: new google.maps.Size(25, 25),
      anchor: new google.maps.Point(12.5, 12.5)
    }),
    []
  );

  const mission = props.interopMission;
  return mission && props.mainFlyZone ? (
    <span>
      {/* lostCommsPos */}
      <MapElementWithInfo
        Element={Marker}
        position={mission.lostCommsPos}
        icon={lostCommsIcon}
        {...openCloseLogic("lostCommsPos")}
      >
        <div>Home (lost comms position)</div>
        <div>
          {mission.lostCommsPos.lat}, {mission.lostCommsPos.lng}
        </div>
      </MapElementWithInfo>

      {/* ugvDrivePos */}
      <MapElementWithInfo
        Element={Marker}
        position={mission.ugvDrivePos}
        icon={ugvDestIcon}
        {...openCloseLogic("ugvDrivePos")}
      >
        <div>UGV Destination</div>
        <div>
          {mission.ugvDrivePos.lat}, {mission.ugvDrivePos.lng}
        </div>
      </MapElementWithInfo>

      {/* airDropPos */}
      <MapElementWithInfo
        Element={Marker}
        position={mission.airDropPos}
        icon={airDropIcon}
        {...openCloseLogic("airDropPos")}
      >
        <div>Air Drop Position</div>
        <Button
          size="sm"
          onClick={() =>
            props.addCommand({
              ugvDropCommand: {
                goal: {
                  latitude: mission.airDropPos.lat,
                  longitude: mission.airDropPos.lng,
                  altitude: props.defaultAltitude
                }
              }
            })
          }
        >
          Add to Mission
        </Button>
      </MapElementWithInfo>

      {/* emergentObjectPos */}
      <MapElementWithInfo
        Element={Marker}
        position={mission.emergentLastKnownPos}
        icon={emergentObjectIcon}
        {...openCloseLogic("emergentObjectPos")}
      >
        <div>Emergent Object</div>
        <Button
          size="sm"
          onClick={() =>
            props.addCommand({
              // TODO if we ever decide to attempt emergent object, replace with specific command
              waypointCommand: {
                goal: {
                  latitude: mission.emergentLastKnownPos.lat,
                  longitude: mission.emergentLastKnownPos.lng,
                  altitude: props.defaultAltitude
                }
              }
            })
          }
        >
          Add to Mission
        </Button>
      </MapElementWithInfo>

      {/* offAxisPos */}
      <MapElementWithInfo
        Element={Marker}
        position={mission.offAxisOdlcPos}
        icon={offAxisIcon}
        {...openCloseLogic("offAxisPos")}
      >
        <div>Off-Axis Object</div>
        <Button
          size="sm"
          onClick={() =>
            props.addCommand({
              offAxisCommand: {
                goal: {
                  latitude: mission.offAxisOdlcPos.lat,
                  longitude: mission.offAxisOdlcPos.lng,
                  altitude: props.defaultAltitude
                },
                subjectLocation: {
                  latitude: mission.offAxisOdlcPos.lat,
                  longitude: mission.offAxisOdlcPos.lng
                }
              }
            })
          }
        >
          Add to Mission
        </Button>
      </MapElementWithInfo>

      {/* airDropBoundary */}
      <MapElementWithInfo
        Element={Polygon}
        path={mission.airDropBoundaryPointsList}
        infoPosition={mission.airDropBoundaryCenter}
        options={airDropBoundaryStyle}
        {...openCloseLogic("airDropBoundary")}
      >
        <div>Air Drop Boundary</div>
      </MapElementWithInfo>

      {/* searchArea */}
      <MapElementWithInfo
        Element={Polygon}
        path={mission.searchGridPointsList}
        infoPosition={mission.searchGridCenter}
        options={searchGridPolygonStyle}
        {...openCloseLogic("searchArea")}
      >
        <div>Search Area</div>
        <Button
          size="sm"
          onClick={() =>
            props.addCommand({
              surveyCommand: {
                surveyPolygonList: mission.searchGridPointsList.map(point => ({
                  latitude: point.lat,
                  longitude: point.lng
                })),
                altitude: props.defaultAltitude
              }
            })
          }
        >
          Add to Mission
        </Button>
      </MapElementWithInfo>

      {/* mainFlyZone */}
      <Polygon
        paths={[
          props.mainFlyZone.surroundingBox,
          props.mainFlyZone.boundaryPointsList
        ]}
        options={boundaryPolygonStyle}
      />

      {/* flyZones */}
      {mission.flyZonesList.map((flyZone, index) => (
        <Polygon
          key={index}
          path={flyZone.boundaryPointsList}
          options={flyZonePolygonStyle}
        />
      ))}

      {/* stationaryObstacles */}
      {mission.stationaryObstaclesList.map((obstacle, index) => (
        <MapElementWithInfo
          key={index}
          Element={Circle}
          options={obstacleStyle}
          radius={obstacle.radiusMeters}
          center={obstacle.position}
          infoPosition={obstacle.position}
          {...openCloseLogic(`obstacle-${index}`)}
        >
          Obstacle{" "}
          {"(" + obstacle.position.lat + ", " + obstacle.position.lng + ")"}
          <br />
          {"Height: " + obstacle.height + " ft AMSL"}
          <br />
          {"Radius: " + obstacle.radiusFeet + " ft"}
        </MapElementWithInfo>
      ))}

      {/* waypoints */}
      {mission.waypointsList.map((waypoint, index) => {
        return (
          <MapElementWithInfo
            key={index}
            Element={Marker}
            position={waypoint.position}
            icon={waypointIcon}
            {...openCloseLogic(`waypoint-${index}`)}
          >
            <div>
              Waypoint {index + 1}
              <br />
              {waypoint.altitude} ft AMSL{" "}
              {props.homeAltitude != null
                ? "(" +
                  (waypoint.altitude - props.homeAltitude * FEET_PER_METER) +
                  ") ft rel"
                : null}
            </div>
            <Button
              size="sm"
              onClick={() => {
                props.addCommand({
                  waypointCommand: {
                    goal: {
                      latitude: waypoint.position.lat,
                      longitude: waypoint.position.lng,
                      altitude:
                        props.homeAltitude != null
                          ? waypoint.altitude -
                            props.homeAltitude * FEET_PER_METER
                          : waypoint.altitude
                    }
                  }
                });
              }}
            >
              Add to Mission
            </Button>
          </MapElementWithInfo>
        );
      })}
    </span>
  ) : null;
};
export default connectComponent(InteropItems);

const boundaryPolygonStyle = {
  strokeColor: "#FF0000",
  fillColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  zIndex: -1,
  clickable: false
};

const flyZonePolygonStyle = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillOpacity: 0,
  clickable: false,
  zIndex: -1
};

const airDropBoundaryStyle = {
  strokeColor: "#FFFFFF",
  fillColor: "#FFFFFF",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  zIndex: -1
};

const searchGridPolygonStyle = {
  zIndex: -1,
  strokeColor: "#0000FF",
  fillColor: "#0000FF",
  strokeOpacity: 0.8,
  strokeWeight: 2
};

const obstacleStyle = {
  strokeColor: "#FFFF00",
  fillColor: "#FFFF00",
  strokeOpacity: 0.8,
  strokeWeight: 2
};
