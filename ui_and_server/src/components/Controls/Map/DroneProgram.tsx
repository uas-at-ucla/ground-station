import React from "react";
import { Polyline } from "@react-google-maps/api";
import { connect } from "react-redux";

import { selector, AppState } from "redux/store";
import google from "components/utils/GoogleMap/google";
import { ExtractPropsType } from "utils/reduxUtils";

const mapStateToProps = (state: AppState) => {
  return {
    droneProgramPath: selector(state).mission.droneProgramPath
  };
};

const connectComponent = connect(mapStateToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const DroneProgram = (props: Props) => (
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
);

export default connectComponent(DroneProgram);
