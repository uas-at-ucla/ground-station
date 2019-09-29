import React, { Component, MouseEvent, ChangeEvent } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { SortableContainer } from "react-sortable-hoc";

import * as missionActions from "redux/actions/missionActions";
import { selector, AppState } from "redux/store";
import CommandList from "./CommandList";

const FEET_PER_METER = 3.28084;

interface OwnProps {
  programType: string;
  className: string;
}

const mapStateToProps = (state: AppState) => {
  const derivedData = selector(state);
  return {
    mission: state.mission,
    protoInfo: derivedData.mission.protoInfo,
    interopData: state.mission.interopData,
    mainFlyZone: derivedData.mission.mainFlyZone,
    homeAltitude: state.telemetry.droneTelemetry
      ? state.telemetry.droneTelemetry.sensors.home_altitude
      : null
  };
};

const mapDispatchToProps = missionActions;

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  (typeof mapDispatchToProps);

class MissionPlanner extends Component<Props> {
  render() {
    return (
      <div className="MissionPlanner">
        <this.Commands onSortEnd={this.reorderCommand} distance={2} />
      </div>
    );
  }

  autoGenerate = () => {
    //console.log(this.props.interopData.mission);
    const defaultAlt = this.props.mission.defaultAltitude;
    const defaultDrpHeight = defaultAlt;
    // const defaultHeight = defaultAlt;

    for (let i = 0; i < this.props.interopData.mission.waypoints.length; i++) {
      const lat = this.props.interopData.mission.waypoints[i].latitude;
      const long = this.props.interopData.mission.waypoints[i].longitude;
      let alt = this.props.interopData.mission.waypoints[i].altitude; // ft above MSL
      alt = alt - this.props.homeAltitude * FEET_PER_METER; // convert to relative alt
      const defaultWaypointCommand = {
        goal: {
          latitude: lat,
          longitude: long,
          altitude: alt
        }
      };
      this.props.addWaypointCommand(
        defaultWaypointCommand,
        this.props.protoInfo
      );
    }

    // If Survey command is supported
    // var search_grid = []
    // for (i = 0; i < this.props.interopData.mission.searchGridPoints.length; i++){
    //   var lat = this.props.interopData.mission.searchGridPoints[i].latitude
    //   var long = this.props.interopData.mission.searchGridPoints[i].longitude
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
    // this.props.addCommand("survey_command", search_command, this.props.protoInfo)

    const lat = this.props.interopData.mission.airDropPos.latitude;
    const long = this.props.interopData.mission.airDropPos.longitude;
    const airDropCommand = {
      goal: {
        latitude: lat,
        longitude: long,
        altitude: defaultDrpHeight
      }
    };
    this.props.addCommand(
      "ugv_drop_command",
      airDropCommand,
      this.props.protoInfo
    );

    // If OffAxis command is supported
    // var lat = this.props.interopData.mission.offAxisOdlcPos.latitude
    // var long = this.props.interopData.mission.offAxisOdlcPos.longitude
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
    // this.props.addCommand("off_axis_command", off_axis_command, this.props.protoInfo)
  };

  Commands = SortableContainer(() => {
    return (
      <Container fluid>
        {this.props.mission.interopData ? (
          <div>
            {"Mission Altitude Range: " +
              this.props.mainFlyZone.altitudeMin +
              " - " +
              this.props.mainFlyZone.altitudeMax +
              " ft AMSL " +
              (this.props.homeAltitude != null
                ? "(" +
                  (this.props.mainFlyZone.altitudeMin -
                    this.props.homeAltitude * FEET_PER_METER) +
                  " - " +
                  (this.props.mainFlyZone.altitudeMax -
                    this.props.homeAltitude * FEET_PER_METER) +
                  "ft rel)"
                : "")}
          </div>
        ) : null}
        <CommandList
          commands={this.props.mission.commands}
          programType={this.props.programType}
          className={this.props.className}
          protoInfo={this.props.protoInfo}
          centerMapOnCommand={this.centerMapOnCommand}
          commandChangers={this.commandChangers}
          mutable={true}
        />
        <Button onClick={this.addCommand} className="command-btn">
          Add Command
        </Button>
        {this.props.homeAltitude &&
        this.props.interopData &&
        this.props.mission.commands.length === 0 ? (
          <Button onClick={this.autoGenerate}>Auto-Generate</Button>
        ) : null}
      </Container>
    );
  });

  addCommand = () => {
    const defaultWaypointCommand = {
      goal: {
        latitude: 38.147483,
        longitude: -76.427778,
        altitude: 100
      }
    };
    this.props.addWaypointCommand(defaultWaypointCommand, this.props.protoInfo);
  };

  reorderCommand = (indices: { oldIndex: number; newIndex: number }) => {
    this.props.reorderCommand(indices.oldIndex, indices.newIndex);
  };

  centerMapOnCommand = (index: number) => {
    if (this.props.className === "SmallMissionPlanner") {
      const command = this.props.mission.commands[index];
      this.props.centerMapOnCommand(command, this.props.protoInfo);
      setTimeout(() => this.props.commandStopAnimation(command), 1000);
    }
  };

  commandChangers = {
    deleteCommand: (event: MouseEvent<HTMLElement>) => {
      const index = Number(event.currentTarget.dataset.index);
      this.props.deleteCommand(index);
    },

    changeCommandType: (event: ChangeEvent<HTMLInputElement>) => {
      const index = Number(event.target.dataset.index);
      const newType = event.target.value;
      const oldCommand = this.props.mission.commands[index];
      this.props.changeCommandType(
        index,
        oldCommand,
        newType,
        this.props.protoInfo
      );
    },

    changeNumberField: (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value);
      if (!isNaN(newValue)) {
        const dotProp = event.target.dataset.dotProp as string;
        this.props.changeCommandField(dotProp, newValue);
      }
    },

    addRepeatedField: (event: MouseEvent<HTMLElement>) => {
      const dotProp = event.currentTarget.dataset.dotProp as string;
      const type = event.currentTarget.dataset.type as string;
      this.props.addRepeatedField(dotProp, type, this.props.protoInfo);
    },

    popRepeatedField: (event: MouseEvent<HTMLElement>) => {
      const dotProp = event.currentTarget.dataset.dotProp as string;
      this.props.popRepeatedField(dotProp);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MissionPlanner);
