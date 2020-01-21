import React from "react";
import { Marker, Circle, Polygon } from "react-google-maps";
import { Button } from "reactstrap";
import { connect } from "react-redux";

import { selector, AppState } from "redux/store";
import * as missionActions from "redux/actions/missionActions";
import MapElementWithInfo from "components/utils/MapElementWithInfo";

import camera from "./icons/camera.png";
import person from "./icons/Person-Icon.png";
import bomb from "./icons/bomb_drop.png";
import wheel from "./icons/wheel.png";
import blueMarker from "./icons/blue_marker.png";
import { ExtractPropsType } from "utils/reduxUtils";

const FEET_PER_METER = 3.28084;

interface OwnProps {
  isOpen: { [key: string]: boolean };
  toggleOpen: (id: string) => void;
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const derivedData = selector(state);
  return {
    interopData: state.mission.interopData,
    ugvDestination: state.mission.ugvDestination,
    mainFlyZone: derivedData.mission.mainFlyZone,
    defaultAltitude: state.mission.defaultAltitude,
    homeAltitude: state.telemetry.droneTelemetry
      ? state.telemetry.droneTelemetry.sensors.homeAltitude
      : null
  };
};

const mapDispatchToProps = missionActions;

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const InteropItems = (props: Props) => {
  const addWaypointCommand = (lat: number, lng: number, alt?: number) => {
    const defaultWaypointCommand = {
      goal: {
        latitude: lat,
        longitude: lng,
        altitude: alt ? alt : props.defaultAltitude
      }
    };
    // props.addWaypointCommand(defaultWaypointCommand, props.protoInfo); // TODO
  };

  if (props.interopData) {
    const boxCenter = props.mainFlyZone.boundaryPoints[0];
    const boxCoordinates = [
      { lat: boxCenter.latitude + 0.1, lng: boxCenter.longitude + 0.1 },
      { lat: boxCenter.latitude + 0.1, lng: boxCenter.longitude - 0.1 },
      { lat: boxCenter.latitude - 0.1, lng: boxCenter.longitude - 0.1 },
      { lat: boxCenter.latitude - 0.1, lng: boxCenter.longitude + 0.1 }
    ];
    const boundaryCoordinates = props.mainFlyZone.boundaryPoints.map(
      (coord: any) => {
        return { lat: coord.latitude, lng: coord.longitude };
      }
    );
    if (!props.mainFlyZone.isClockwise) {
      boundaryCoordinates.reverse();
    }

    const flyZonePolygons = props.interopData.mission.flyZonesList.map(
      (flyZone: any) => {
        return flyZone.boundaryPoints.map((coord: any) => {
          return { lat: coord.latitude, lng: coord.longitude };
        });
      }
    );

    // let searchCenterLat = 0;
    // let searchCenterLng = 0;
    // const searchNum = props.interopData.mission.searchGridPoints.length;
    const searchGridPoints = props.interopData.mission.searchGridPointsList.map(
      (coord: any) => {
        // searchCenterLat += coord.latitude;
        // searchCenterLng += coord.longitude;
        return { lat: coord.latitude, lng: coord.longitude };
      }
    );
    // searchCenterLng = searchCenterLng / searchNum;
    // searchCenterLat = searchCenterLat / searchNum;

    if (
      !(
        props.interopData.mission.airDropPos &&
        props.interopData.mission.airDropPos.latitude &&
        props.interopData.mission.airDropPos.longitude &&
        props.interopData.mission.emergentLastKnownPos &&
        props.interopData.mission.emergentLastKnownPos.latitude &&
        props.interopData.mission.emergentLastKnownPos.longitude &&
        props.interopData.mission.offAxisOdlcPos &&
        props.interopData.mission.offAxisOdlcPos.latitude &&
        props.interopData.mission.offAxisOdlcPos.longitude
      )
    ) {
      throw new Error("Expected interop API protobuf fields to exist");
    }

    const airDropPos = {
      lat: props.interopData.mission.airDropPos.latitude,
      lng: props.interopData.mission.airDropPos.longitude
    };

    const emergentPos = {
      lat: props.interopData.mission.emergentLastKnownPos.latitude,
      lng: props.interopData.mission.emergentLastKnownPos.longitude
    };

    const offAxisPos = {
      lat: props.interopData.mission.offAxisOdlcPos.latitude,
      lng: props.interopData.mission.offAxisOdlcPos.longitude
    };

    return (
      <span>
        <MapElementWithInfo
          Element={Marker}
          name="ugvDest"
          isOpen={props.isOpen}
          toggleOpen={props.toggleOpen}
          position={props.ugvDestination}
          defaultIcon={{
            url: wheel,
            scaledSize: { width: 25, height: 25 },
            anchor: { x: 12.5, y: 12.5 }
          }}
        >
          <div>UGV Destionation</div>
          <div>
            {props.ugvDestination.lat}, {props.ugvDestination.lng}
          </div>
        </MapElementWithInfo>

        <MapElementWithInfo
          Element={Marker}
          name="airDropPosition"
          isOpen={props.isOpen}
          toggleOpen={props.toggleOpen}
          position={airDropPos}
          defaultIcon={{
            url: bomb,
            scaledSize: { width: 25, height: 25 },
            anchor: { x: 12.5, y: 12.5 }
          }}
        >
          <div>Air Drop Position</div>
          <Button
            size="sm"
            onClick={() => addWaypointCommand(airDropPos.lat, airDropPos.lng)}
          >
            Add to Mission
          </Button>
        </MapElementWithInfo>

        <MapElementWithInfo
          Element={Marker}
          name="emergent_last_known_pos"
          isOpen={props.isOpen}
          toggleOpen={props.toggleOpen}
          position={emergentPos}
          defaultIcon={{
            url: person,
            scaledSize: { width: 20, height: 20 },
            anchor: { x: 10, y: 10 }
          }}
        >
          <div>Emergent Object</div>
          <Button
            size="sm"
            onClick={() => addWaypointCommand(emergentPos.lat, emergentPos.lng)}
          >
            Add to Mission
          </Button>
        </MapElementWithInfo>

        <MapElementWithInfo
          Element={Marker}
          name="off_axis_odlc_pos"
          isOpen={props.isOpen}
          toggleOpen={props.toggleOpen}
          position={offAxisPos}
          defaultIcon={{
            url: camera,
            scaledSize: { width: 20, height: 20 },
            anchor: { x: 10, y: 10 }
          }}
        >
          <div>Off Axis Position</div>
          <Button
            size="sm"
            onClick={() => addWaypointCommand(offAxisPos.lat, offAxisPos.lng)}
          >
            Add to Mission
          </Button>
        </MapElementWithInfo>

        <Polygon
          paths={[boxCoordinates, boundaryCoordinates]}
          defaultOptions={{
            strokeColor: "#FF0000",
            fillColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillOpacity: 0.5,
            zIndex: -1
          }}
        />

        {flyZonePolygons.map((path: any, index: number) => (
          <Polygon
            key={index}
            path={path}
            defaultOptions={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 1.5,
              fillOpacity: 0,
              clickable: false,
              zIndex: -1
            }}
          />
        ))}

        <Polygon
          path={searchGridPoints}
          defaultOptions={{ clickable: false, zIndex: -1 }}
        />
        {/* Use this version if SurveyCommand is supported: */}
        {/* <MapElementWithInfo
            Element={Polygon} name="search" isOpen={props.isOpen} toggleOpen={props.toggleOpen}
            path={searchGridPoints}
            infoPosition={{lat: searchCenterLat, lng: searchCenterLng}} defaultZIndex={-1}
          >
            <div>Search Area</div>
            <Button size="sm" onClick={() => addWaypointCommand(searchCenterLat, searchCenterLng)}>
              Add to Mission
            </Button>
          </MapElementWithInfo> */}

        {props.interopData.mission.stationaryObstaclesList.map(
          (obstacle: any, index: number) => (
            <MapElementWithInfo
              key={index}
              Element={Circle}
              name={`obstacle-${index}`}
              isOpen={props.isOpen}
              toggleOpen={props.toggleOpen}
              defaultOptions={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.5
              }}
              radius={obstacle.radius / FEET_PER_METER}
              center={{ lat: obstacle.latitude, lng: obstacle.longitude }}
              infoPosition={{
                lat: obstacle.latitude,
                lng: obstacle.longitude
              }}
            >
              Obstacle{" "}
              {"(" + obstacle.latitude + ", " + obstacle.longitude + ")"}
              <br />
              {"Height: " + obstacle.height + " ft AMSL"}
              <br />
              {"Radius: " + obstacle.radius + " ft"}
            </MapElementWithInfo>
          )
        )}

        {props.interopData.mission.waypointsList.map((coord, index) => {
          if (
            !(coord.latitude && coord.longitude && coord.altitude !== undefined)
          ) {
            throw new Error("Expected interop API protobuf fields to exist");
          }
          return (
            <MapElementWithInfo
              key={index}
              Element={Marker}
              name={`waypoint-${index}`}
              isOpen={props.isOpen}
              toggleOpen={props.toggleOpen}
              position={{ lat: coord.latitude, lng: coord.longitude }}
              icon={{
                url: blueMarker,
                scaledSize: { width: 25, height: 25 },
                anchor: { x: 12.5, y: 12.5 }
              }}
            >
              <div>
                Waypoint {index + 1}
                <br />
                {coord.altitude} ft AMSL{" "}
                {props.homeAltitude != null
                  ? "(" +
                    (coord.altitude - props.homeAltitude * FEET_PER_METER) +
                    ") ft rel"
                  : null}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (!(coord.latitude && coord.longitude && coord.altitude)) {
                    throw new Error(
                      "Expected interop API protobuf fields to exist"
                    );
                  }
                  addWaypointCommand(
                    coord.latitude,
                    coord.longitude,
                    props.homeAltitude != null
                      ? coord.altitude - props.homeAltitude * FEET_PER_METER
                      : coord.altitude
                  );
                }}
              >
                Add to Mission
              </Button>
            </MapElementWithInfo>
          );
        })}
      </span>
    );
  } else {
    return <span></span>;
  }
};

export default connectComponent(InteropItems);
