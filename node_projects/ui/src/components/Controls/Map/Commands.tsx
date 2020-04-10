import React, { useMemo } from "react";
import { Marker, Polyline } from "@react-google-maps/api";
import { Button } from "reactstrap";
import { connect } from "react-redux";

import * as missionActions from "redux/actions/missionActions";
import { selector, AppState } from "redux/store";
import google from "components/utils/GoogleMap/google";
import { ExtractPropsType } from "utils/reduxUtils";
import { GroundCommand } from "protobuf/drone/timeline_grammar_pb";
import MapElementWithInfo from "components/utils/MapElementWithInfo";
import { Position3D } from "protobuf/drone/mission_commands_pb";
import { useEventCallback } from "utils/customHooks";

interface OwnProps {
  isOpen: { [key: string]: boolean };
  toggleOpen: (id: string) => void;
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const derivedData = selector(state);
  return {
    locationCommands: derivedData.mission.locationCommands,
    groundProgramPath: derivedData.mission.groundProgramPath,
    commandAnimate: state.mission.commandAnimate,
    defaultAltitude: state.mission.defaultAltitude
  };
};

const mapDispatchToProps = missionActions;

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const Commands = (props: Props) => {
  const commandsPolylineStyle = useMemo(
    () => ({
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
    }),
    []
  );

  return (
    <span>
      {props.locationCommands.order.map((cmdId, index) => (
        <Command
          key={cmdId}
          cmdId={cmdId}
          cmdType={props.locationCommands.commands[cmdId].cmdType}
          location={props.locationCommands.commands[cmdId].location}
          index={index}
          animate={props.commandAnimate[cmdId]}
          changeCommandField={props.changeCommandField}
          deleteCommand={props.deleteCommand}
          isOpen={props.isOpen[cmdId]}
          toggleOpen={props.toggleOpen}
        />
      ))}
      <Polyline
        path={props.groundProgramPath}
        options={commandsPolylineStyle}
      />
    </span>
  );
};
export default connectComponent(Commands);

const commandLabels: Record<
  keyof GroundCommand.AsObject,
  google.maps.MarkerLabel | undefined
> = {
  surveyCommand: undefined,
  waitCommand: undefined,
  flyThroughCommand: undefined,
  offAxisCommand: undefined,
  landAtLocationCommand: {
    fontFamily: "Fontawesome",
    text: "\uf063",
    fontSize: "15px"
  },
  ugvDropCommand: {
    fontFamily: "Fontawesome",
    text: "\uf187",
    fontSize: "15px"
  },
  waypointCommand: {
    fontFamily: "Fontawesome",
    text: "\uf192",
    fontSize: "15px"
  }
};

const CommandImpure = (props: {
  cmdId: string;
  cmdType: keyof GroundCommand.AsObject;
  location: Position3D.AsObject;
  index: number;
  animate: boolean;
  changeCommandField: typeof missionActions["changeCommandField"];
  deleteCommand: typeof missionActions["deleteCommand"];
  isOpen: boolean;
  toggleOpen: (id: string) => void;
}) => {
  const commandDragged = useEventCallback((event: google.maps.MouseEvent) => {
    props.changeCommandField(
      props.cmdId + "." + props.cmdType + ".goal.latitude",
      event.latLng.lat()
    );
    props.changeCommandField(
      props.cmdId + "." + props.cmdType + ".goal.longitude",
      event.latLng.lng()
    );
  });

  return (
    <MapElementWithInfo
      Element={Marker}
      isOpen={props.isOpen}
      id={props.cmdId}
      toggleOpen={props.toggleOpen}
      draggable={props.cmdType !== "surveyCommand"}
      onDragEnd={props.cmdType !== "surveyCommand" ? commandDragged : undefined}
      label={commandLabels[props.cmdType]}
      position={{ lat: props.location.latitude, lng: props.location.longitude }}
      key={props.cmdId}
      animation={props.animate ? google.maps.Animation.BOUNCE : undefined}
    >
      <div className="map-infobox">
        <div>{props.index + 1 + ": " + props.cmdType}</div>
        <div>{"Altitude: " + props.location.altitude + " ft rel"}</div>

        <Button onClick={() => props.deleteCommand(props.cmdId)} color="danger">
          <i className="fa fa-trash" style={{ pointerEvents: "none" }}></i>
        </Button>
      </div>
    </MapElementWithInfo>
  );
};
const Command = React.memo(CommandImpure);
