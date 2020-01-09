import React from "react";
import { connect } from "react-redux";

import "./Controls.css";
import Map from "./Map/Map";
import Telemetry from "./Telemetry/Telemetry";
import DroneActions from "./DroneActions";
import MissionPlannerContainer from "./MissionPlannerContainer/MissionPlannerContainer";
import UasLogo from "components/utils/UasLogo/UasLogo";
import * as genericActions from "redux/actions/genericActions";
import { ExtractPropsType } from "utils/reduxUtils";

const mapDispatchToProps = genericActions;

const connectComponent = connect(
  null,
  mapDispatchToProps
);
type Props = ExtractPropsType<typeof connectComponent>;

const Controls = (props: Props) => {
  return (
    <div className="Controls">
      <div className="map-overlay">
        <div>
          <span className="left-side">
            <span className="top-left">
              <div onClick={props.centerOnDrone} className="logo">
                <UasLogo />
              </div>
              <MissionPlannerContainer />
            </span>
            <span className="bottom-left">
              <DroneActions />
            </span>
          </span>
          <span className="right-side">
            <Telemetry />
          </span>
        </div>
      </div>
      <Map />
    </div>
  );
};

export default connectComponent(Controls);
