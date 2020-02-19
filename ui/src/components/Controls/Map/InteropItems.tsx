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
import { Position, StationaryObstacle } from "protobuf/interop/interop_api_pb";

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
    props.addCommand({
      waypointCommand: {
        goal: {
          latitude: lat,
          longitude: lng,
          altitude: alt ? alt : props.defaultAltitude
        }
      }
    });
  };

  if (props.interopData) {
    const boxCenter = props.mainFlyZone.boundaryPointsList[0] as Required<
      Position.AsObject
    >;
    const boxCoordinates = [
      { lat: boxCenter.latitude + 0.1, lng: boxCenter.longitude + 0.1 },
      { lat: boxCenter.latitude + 0.1, lng: boxCenter.longitude - 0.1 },
      { lat: boxCenter.latitude - 0.1, lng: boxCenter.longitude - 0.1 },
      { lat: boxCenter.latitude - 0.1, lng: boxCenter.longitude + 0.1 }
    ];
    const boundaryCoordinates = (props.mainFlyZone
      .boundaryPointsList as Required<Position.AsObject>[]).map(coord => {
      return { lat: coord.latitude, lng: coord.longitude };
    });
    if (!props.mainFlyZone.isClockwise) {
      boundaryCoordinates.reverse();
    }

    const flyZonePolygons = props.interopData.mission.flyZonesList.map(
      flyZone => {
        return (flyZone.boundaryPointsList as Required<
          Position.AsObject
        >[]).map(coord => {
          return { lat: coord.latitude, lng: coord.longitude };
        });
      }
    );

    // let searchCenterLat = 0;
    // let searchCenterLng = 0;
    // const searchNum = props.interopData.mission.searchGridPoints.length;
    const searchGridPoints = (props.interopData.mission
      .searchGridPointsList as Required<Position.AsObject>[]).map(coord => {
      // searchCenterLat += coord.latitude;
      // searchCenterLng += coord.longitude;
      return { lat: coord.latitude, lng: coord.longitude };
    });
    // searchCenterLng = searchCenterLng / searchNum;
    // searchCenterLat = searchCenterLat / searchNum;

    const interopAirDropPos = props.interopData.mission.airDropPos as Required<
      Position.AsObject
    >;
    const airDropPos = {
      lat: interopAirDropPos.latitude,
      lng: interopAirDropPos.longitude
    };

    const interopEmergentPos = props.interopData.mission
      .emergentLastKnownPos as Required<Position.AsObject>;
    const emergentPos = {
      lat: interopEmergentPos.latitude,
      lng: interopEmergentPos.longitude
    };

    const interopOffAxisPos = props.interopData.mission
      .offAxisOdlcPos as Required<Position.AsObject>;
    const offAxisPos = {
      lat: interopOffAxisPos.latitude,
      lng: interopOffAxisPos.longitude
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

        {flyZonePolygons.map((path, index) => (
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

        {(props.interopData.mission.stationaryObstaclesList as Required<
          StationaryObstacle.AsObject
        >[]).map((obstacle, index) => (
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
            Obstacle {"(" + obstacle.latitude + ", " + obstacle.longitude + ")"}
            <br />
            {"Height: " + obstacle.height + " ft AMSL"}
            <br />
            {"Radius: " + obstacle.radius + " ft"}
          </MapElementWithInfo>
        ))}

        {(props.interopData.mission.waypointsList as Required<
          Position.AsObject
        >[]).map((coord, index) => {
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
