import React, { useState, useCallback } from "react";
import { connect } from "react-redux";

import * as missionActions from "redux/actions/missionActions";
import { AppState } from "redux/store";
import GoogleMap from "components/utils/GoogleMap/GoogleMap";
import InteropItems from "./InteropItems";
import VehicleMarkers from "./VehicleMarkers";
import Commands from "./Commands";
import DroneProgram from "./DroneProgram";
import { ExtractPropsType } from "utils/reduxUtils";
import { useEventCallback } from "utils/customHooks";

const mapOptions = {
  disableDefaultUI: true,
  disableDoubleClickZoom: true,
  scaleControl: true
};

const mapStateToProps = (state: AppState) => {
  return {
    defaultAltitude: state.mission.defaultAltitude,
    mapCenter: state.telemetry.mapCenter
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

  const onMapClick = useCallback(() => {
    setOpen({});
  }, []);

  const mapDblClick = useEventCallback((event: google.maps.MouseEvent) => {
    props.addCommand({
      flyThroughCommand: {
        goal: {
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
          altitude: props.defaultAltitude
        }
      }
    });
  });

  return (
    <div className="Map">
      <GoogleMap
        zoom={16}
        mapTypeId="customTiles"
        options={mapOptions}
        center={props.mapCenter}
        onClick={onMapClick}
        onDblClick={mapDblClick}
      >
        <VehicleMarkers />
        <InteropItems isOpen={isOpen} toggleOpen={toggleOpen} />
        <Commands isOpen={isOpen} toggleOpen={toggleOpen} />
        <DroneProgram />
      </GoogleMap>
    </div>
  );
};

export default connectComponent(Map);
