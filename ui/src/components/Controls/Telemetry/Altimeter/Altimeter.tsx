import React from "react";
import { connect } from "react-redux";

import { selector, AppState } from "redux/store";
import "./Altimeter.css";
import { ExtractPropsType } from "utils/reduxUtils";

const FEET_PER_METER = 3.28084;
const MAX_ALT = 300; //feet

const mapStateToProps = (state: AppState) => {
  return {
    telemetry: state.telemetry.droneTelemetry,
    interopData: state.mission.interopData,
    mainFlyZone: selector(state).mission.mainFlyZone
  };
};

const connectComponent = connect(mapStateToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const Altimeter = (props: Props) => {
  let relAltitude = 0;
  if (props.telemetry) {
    relAltitude = props.telemetry.sensors.relativeAltitude * FEET_PER_METER;
  }
  const percentage = (relAltitude / MAX_ALT) * 100;

  let min = 0;
  let max = Infinity;
  if (props.telemetry && props.interopData) {
    const homeAlt = props.telemetry.sensors.homeAltitude * FEET_PER_METER;
    min = props.mainFlyZone.altitudeMin - homeAlt;
    max = props.mainFlyZone.altitudeMax - homeAlt;
  }
  if (max > MAX_ALT) max = MAX_ALT;

  return (
    <div className="Altimeter">
      <div className="progress-bars">
        <div className="progress-bar">
          <div
            className={`filler ${
              relAltitude < min
                ? "too-low"
                : relAltitude > max
                ? "too-high"
                : "default"
            }`}
            style={{ height: `${percentage > 0 ? percentage : 0}%` }}
          >
            {relAltitude.toFixed(0)} ft rel
          </div>
        </div>
        <div className="progress-bar">
          <div
            className="filler-min"
            style={{ height: `${(min / MAX_ALT) * 100}%` }}
          ></div>
        </div>
        <div className="progress-bar">
          <div
            className="filler-max"
            style={{ height: `${(max / MAX_ALT) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default connectComponent(Altimeter);
