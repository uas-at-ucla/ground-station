import React from "react";
import { connect } from "react-redux";

import "./Telemetry.css";
import AttitudeIndicator from "./AttitudeIndicator/AttitudeIndicator";
import Altimeter from "./Altimeter/Altimeter";
import Readout from "./Readout";
import { AppState } from "redux/store";
import { ExtractPropsType } from "utils/reduxUtils";

const FEET_PER_METER = 3.28084;
const KNOTS_PER_METER_SECOND = 1.94384;

const mapStateToProps = (state: AppState) => {
  return {
    telemetry: state.telemetry
  };
};

const connectComponent = connect(mapStateToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const blankTelmet = {
  pingDelay: NaN,
  autopilotState: "",
  roll: 0,
  pitch: 0,
  yaw: Math.PI / 2,
  speed: 0,
  gpsFix: false,
  lat: 0,
  long: 0,
  heading: 0,
  alt: 0,
  satCount: 0,
  gpsHdop: 0,
  gpsVdop: 0
};

const Telemetry = (props: Props) => {
  let telmet = blankTelmet;
  const rawTelmet = props.telemetry.droneTelemetry;
  const pingDelay = props.telemetry.pingDelay;
  if (rawTelmet && rawTelmet.sensors) {
    telmet = {
      pingDelay: pingDelay !== undefined ? pingDelay : NaN,
      autopilotState: rawTelmet["sensors"]["armed"]
        ? rawTelmet["sensors"]["autopilotState"]
        : "Disarmed",
      roll: rawTelmet["sensors"]["roll"],
      pitch: rawTelmet["sensors"]["pitch"],
      yaw: rawTelmet["sensors"]["yaw"],
      speed: rawTelmet["sensors"]["gpsGroundSpeed"] * KNOTS_PER_METER_SECOND,
      gpsFix: rawTelmet["sensors"]["gpsFix"],
      lat: rawTelmet["sensors"]["latitude"],
      long: rawTelmet["sensors"]["longitude"],
      heading: rawTelmet["sensors"]["heading"],
      alt: rawTelmet["sensors"]["altitude"] * FEET_PER_METER,
      satCount: rawTelmet["sensors"]["gpsSatelliteCount"],
      gpsHdop: 0,
      gpsVdop: 0
    };
  }

  // console.log(telmet);
  // console.log(readoutData());

  return (
    <span className="Telemetry">
      <Readout
        data={[
          {
            key: "Ping",
            values: !isNaN(telmet.pingDelay)
              ? [telmet.pingDelay, " ms"]
              : ["Not Connected"]
          },
          {
            key: "State",
            values: [telmet.autopilotState]
          },
          {
            key: "Ground Speed",
            values: [telmet.speed.toFixed(3), " knots"]
          },
          {
            key: "Altitude MSL",
            values: [telmet.alt.toFixed(3), " feet"]
          },
          {
            key: "GPS Fix",
            values: [telmet.gpsFix ? "Yes" : "NO GPS FIX"]
          },
          {
            key: "Satellite Count",
            values: [telmet.satCount]
          }
        ]}
      />
      <AttitudeIndicator data={telmet} />
      <Altimeter />
    </span>
  );
};

export default connectComponent(Telemetry);
