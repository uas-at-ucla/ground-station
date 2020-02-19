import React, { MouseEvent, useState } from "react";
import { Marker, InfoWindow, Polyline } from "react-google-maps";
import { Button } from "reactstrap";
import { connect } from "react-redux";

import * as missionActions from "redux/actions/missionActions";
import { selector, AppState } from "redux/store";
import google from "components/utils/GoogleMap/google";
import GoogleMap from "components/utils/GoogleMap/GoogleMap";
import InteropItems from "./InteropItems";
import VehicleMarkers from "./VehicleMarkers";
import { ExtractPropsType } from "utils/reduxUtils";

const mapStateToProps = (state: AppState) => {
  const derivedData = selector(state);
  return {
    commandAnimate: state.mission.commandAnimate,
    defaultAltitude: state.mission.defaultAltitude,
    mapCenter: state.telemetry.mapCenter,
    commandPoints: derivedData.mission.commandPoints,
    droneProgramPath: derivedData.mission.droneProgramPath
  };
};

const mapDispatchToProps = missionActions;

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const Map = (props: Props) => {
  const [isOpen, setOpen] = useState<{ [key: string]: boolean }>({});

  const toggleOpen = (id: string) => {
    setOpen({ ...isOpen, [id]: !isOpen[id] });
  };

  const onMapClick = () => {
    setOpen({});
  };

  const deleteCommand = (id: string) => {
    props.deleteCommand(id);
  };

  const commandDragged = (event: google.maps.MouseEvent, dotProp: string) => {
    props.changeCommandField(dotProp + ".latitude", event.latLng.lat());
    props.changeCommandField(dotProp + ".longitude", event.latLng.lng());
  };

  const mapDblClick = (event: google.maps.MouseEvent) => {
    addFlyThroughCommand(event.latLng.lat(), event.latLng.lng());
  };

  const addFlyThroughCommand = (lat: number, lng: number) => {
    props.addCommand({
      flyThroughCommand: {
        goal: {
          latitude: lat,
          longitude: lng,
          altitude: props.defaultAltitude
        }
      }
    });
  };

  const commandPointPolyCoords = props.commandPoints
    .filter(p => p)
    .map(commandPoint => {
      return commandPoint ? commandPoint.marker.position : null;
    });

  return (
    <div className="Map">
      <GoogleMap
        defaultZoom={16}
        defaultMapTypeId="customTiles"
        defaultOptions={{
          disableDefaultUI: true,
          disableDoubleClickZoom: true,
          scaleControl: true
        }}
        center={props.mapCenter}
        onClick={onMapClick}
        onDblClick={mapDblClick}
      >
        <VehicleMarkers />
        <InteropItems isOpen={isOpen} toggleOpen={toggleOpen} />

        {props.commandPoints.map(commandPoint =>
          commandPoint ? (
            <Marker
              draggable={true}
              onDragEnd={event =>
                commandDragged(
                  event,
                  commandPoint.id + "." + commandPoint.name + ".goal"
                )
              }
              {...commandPoint.marker}
              key={commandPoint.id}
              onClick={() => toggleOpen(commandPoint.id)}
              animation={
                props.commandAnimate[commandPoint.id]
                  ? google.maps.Animation.BOUNCE
                  : null
              }
            >
              {isOpen[commandPoint.id] && (
                <InfoWindow
                  {...commandPoint.infobox}
                  onCloseClick={() => toggleOpen(commandPoint.id)}
                >
                  <div className="map-infobox">
                    <div>{commandPoint.infobox.title}</div>
                    <div>{commandPoint.infobox.content}</div>

                    <Button
                      onClick={() => deleteCommand(commandPoint.id)}
                      color="danger"
                    >
                      <i
                        className="fa fa-trash"
                        style={{ pointerEvents: "none" }}
                      ></i>
                    </Button>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ) : null
        )}
        <Polyline
          path={commandPointPolyCoords}
          options={{
            icons: [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  strokeColor: "#000000"
                },
                offset: "100%",
                repeat: "200px"
              }
            ]
          }}
        />

        <Polyline
          path={props.droneProgramPath}
          options={{
            strokeColor: "#3355EE",
            icons: [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  strokeColor: "#3355EE"
                },
                offset: "100%",
                repeat: "200px"
              }
            ]
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default connectComponent(Map);
