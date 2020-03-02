import React from "react";
import { Marker, Circle } from "@react-google-maps/api";
import { connect } from "react-redux";

import google from "components/utils/GoogleMap/google";
import rover from "./icons/rover.png";
import { AppState } from "redux/store";
import { ExtractPropsType } from "utils/reduxUtils";

const ephCircleOptions = { clickable: false };

const mapStateToProps = (state: AppState) => {
  return {
    telemetry: state.telemetry.droneTelemetry,
    ugvStatus: state.telemetry.ugvStatus
  };
};

const connectComponent = connect(mapStateToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const VehicleMarkers = (props: Props) => {
  return (
    <span>
      {props.telemetry && props.telemetry.sensors ? (
        <span>
          <Circle
            center={{
              lat: props.telemetry.sensors.latitude,
              lng: props.telemetry.sensors.longitude
            }}
            radius={props.telemetry.sensors.gpsEph}
            options={ephCircleOptions}
          />
          <Marker
            position={{
              lat: props.telemetry.sensors.latitude,
              lng: props.telemetry.sensors.longitude
            }}
            icon={{
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              strokeColor: "#FFFFFF",
              strokeOpacity: 0.8,
              strokeWeight: 3,
              fillColor: "#0000FF",
              fillOpacity: 0.5,
              scale: 7,
              rotation: props.telemetry.sensors.heading,
              anchor: new google.maps.Point(0, 2.5)
            }}
          ></Marker>
        </span>
      ) : null}

      {props.ugvStatus && props.ugvStatus.location ? (
        <Marker
          position={{
            lat: props.ugvStatus.location.latitude,
            lng: props.ugvStatus.location.longitude
          }}
          icon={{
            url: rover,
            scaledSize: new google.maps.Size(25, 25),
            anchor: new google.maps.Point(12.5, 12.5)
          }}
        />
      ) : null}
    </span>
  );
};

export default connectComponent(VehicleMarkers);
