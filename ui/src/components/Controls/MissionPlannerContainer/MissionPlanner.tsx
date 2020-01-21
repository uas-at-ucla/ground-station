import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { SortableContainer } from "react-sortable-hoc";

import * as missionActions from "redux/actions/missionActions";
import { selector, AppState } from "redux/store";
import CommandList from "./CommandList";
import { ExtractPropsType } from "utils/reduxUtils";

const FEET_PER_METER = 3.28084;

interface OwnProps {
  programType: string;
  className: string;
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const derivedData = selector(state);
  return {
    mission: state.mission,
    interopData: state.mission.interopData,
    mainFlyZone: derivedData.mission.mainFlyZone,
    homeAltitude: state.telemetry.droneTelemetry
      ? state.telemetry.droneTelemetry.sensors.homeAltitude
      : null
  };
};

const mapDispatchToProps = missionActions;

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const MissionPlanner = (props: Props) => {
  const autoGenerate = () => {
    //console.log(props.interopData.mission);
    const defaultAlt = props.mission.defaultAltitude;
    const defaultDrpHeight = defaultAlt;
    // const defaultHeight = defaultAlt;

    if (!(props.interopData && props.homeAltitude !== null)) {
      throw new Error("You weren't supposed to be able to click this button!");
    }
    for (let i = 0; i < props.interopData.mission.waypointsList.length; i++) {
      const waypoint = props.interopData.mission.waypointsList[i];
      if (
        !(
          waypoint.latitude &&
          waypoint.longitude &&
          waypoint.altitude !== undefined
        )
      ) {
        throw new Error("Expected interop API protobuf fields to exist");
      }
      const lat = waypoint.latitude;
      const long = waypoint.longitude;
      let alt = waypoint.altitude; // ft above MSL
      alt = alt - props.homeAltitude * FEET_PER_METER; // convert to relative alt
      const defaultWaypointCommand = {
        goal: {
          latitude: lat,
          longitude: long,
          altitude: alt
        }
      };
      // props.addWaypointCommand(defaultWaypointCommand, props.protoInfo); // TODO
    }

    // If Survey command is supported
    // var search_grid = []
    // for (i = 0; i < props.interopData.mission.searchGridPoints.length; i++){
    //   var lat = props.interopData.mission.searchGridPoints[i].latitude
    //   var long = props.interopData.mission.searchGridPoints[i].longitude
    //   let search_point = {
    //     latitude: lat,
    //     longitude: long
    //   }
    //   search_grid.push(search_point)
    // }
    // let search_command = {
    //   altitude: default_alt,
    //   survey_polygon: search_grid
    // }
    // props.addCommand("survey_command", search_command, props.protoInfo)

    if (
      !(
        props.interopData.mission.airDropPos &&
        props.interopData.mission.airDropPos.latitude &&
        props.interopData.mission.airDropPos.longitude
      )
    ) {
      throw new Error("Expected interop API protobuf fields to exist");
    }

    const lat = props.interopData.mission.airDropPos.latitude;
    const long = props.interopData.mission.airDropPos.longitude;
    const airDropCommand = {
      goal: {
        latitude: lat,
        longitude: long,
        altitude: defaultDrpHeight
      }
    };
    // props.addCommand("ugv_drop_command", airDropCommand, props.protoInfo); // TODO

    // If OffAxis command is supported
    // var lat = props.interopData.mission.offAxisOdlcPos.latitude
    // var long = props.interopData.mission.offAxisOdlcPos.longitude
    // let off_axis_command = {
    //   photographer_location: {
    //     latitude: lat,
    //     longitude: long,
    //     altitude: defaultHeight
    //   },
    //   subject_location: {
    //     latitude: lat,
    //     longitude: long,
    //   }
    // }
    // props.addCommand("off_axis_command", off_axis_command, props.protoInfo)
  };

  const Commands = SortableContainer(() => {
    return (
      <Container fluid>
        {props.mission.interopData &&
        props.mainFlyZone &&
        props.mainFlyZone.altitudeMin &&
        props.mainFlyZone.altitudeMax ? (
          <div>
            {"Mission Altitude Range: " +
              props.mainFlyZone.altitudeMin +
              " - " +
              props.mainFlyZone.altitudeMax +
              " ft AMSL " +
              (props.homeAltitude != null
                ? "(" +
                  (props.mainFlyZone.altitudeMin -
                    props.homeAltitude * FEET_PER_METER) +
                  " - " +
                  (props.mainFlyZone.altitudeMax -
                    props.homeAltitude * FEET_PER_METER) +
                  "ft rel)"
                : "")}
          </div>
        ) : null}
        <CommandList
          commands={props.mission.commands}
          commandOrder={props.mission.commandOrder}
          programType={props.programType}
          className={props.className}
          centerMapOnCommand={centerMapOnCommand}
          commandChangers={commandChangers}
          mutable={true}
        />
        <Button onClick={addCommand} className="command-btn">
          Add Command
        </Button>
        {props.homeAltitude &&
        props.interopData &&
        props.mission.commands.length === 0 ? (
          <Button onClick={autoGenerate}>Auto-Generate</Button>
        ) : null}
      </Container>
    );
  });

  const addCommand = () => {
    const defaultWaypointCommand = {
      goal: {
        latitude: 38.147483,
        longitude: -76.427778,
        altitude: 100
      }
    };
    // props.addWaypointCommand(defaultWaypointCommand, props.protoInfo); // TODO
  };

  const reorderCommand = (indices: { oldIndex: number; newIndex: number }) => {
    props.reorderCommand(indices.oldIndex, indices.newIndex);
  };

  const centerMapOnCommand = (id: string) => {
    if (props.className === "SmallMissionPlanner") {
      props.centerMapOnCommand(props.mission.commands, id);
      setTimeout(() => props.commandStopAnimation(id), 1000);
    }
  };

  const {
    deleteCommand
    // changeCommandType,
    // changeCommandField,
    // addRepeatedField,
    // popRepeatedField
  } = props;
  const commandChangers = useMemo(() => {
    return {
      deleteCommand: (id: string) => {
        deleteCommand(id);
      }

      // changeCommandType: (index: number, oldCommand: any, newType: string) => {
      //   changeCommandType(index, oldCommand, newType, props.protoInfo);
      // },

      // changeNumberField: (dotProp: string, input: string) => {
      //   const newValue = Number(input);
      //   if (!isNaN(newValue)) {
      //     changeCommandField(dotProp, newValue);
      //   }
      // },

      // addRepeatedField: (dotProp: string, type: string) => {
      //   addRepeatedField(dotProp, type, props.protoInfo);
      // },

      // popRepeatedField: (dotProp: string) => {
      //   popRepeatedField(dotProp);
      // }
    };
  }, [deleteCommand]);

  return (
    <div className="MissionPlanner">
      <Commands onSortEnd={reorderCommand} distance={2} />
    </div>
  );
};

export default connectComponent(MissionPlanner);
