import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { SortableContainer } from "react-sortable-hoc";

import * as missionActions from "redux/actions/missionActions";
import { selector, AppState } from "redux/store";
import CommandList from "./CommandList";
import { ExtractPropsType } from "utils/reduxUtils";
import { Position } from "protobuf/interop/interop_api_pb";
import { useEventCallback } from "utils/customHooks";

const FEET_PER_METER = 3.28084;

interface OwnProps {
  className: string;
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  const derivedData = selector(state);
  return {
    defaultAltitude: state.mission.defaultAltitude,
    commands: state.mission.commands,
    commandOrder: state.mission.commandOrder,
    locationCommands: derivedData.mission.locationCommands,
    interopData: state.mission.interopData,
    mainFlyZone: derivedData.mission.mainFlyZone,
    homeAltitude:
      state.telemetry.droneTelemetry && state.telemetry.droneTelemetry.sensors
        ? state.telemetry.droneTelemetry.sensors.homeAltitude
        : null
  };
};

const mapDispatchToProps = missionActions;

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const MissionPlanner = (props: Props) => {
  const reorderCommand = (indices: { oldIndex: number; newIndex: number }) => {
    props.reorderCommand(indices.oldIndex, indices.newIndex);
  };

  return (
    <div className="MissionPlanner">
      <Commands {...props} onSortEnd={reorderCommand} distance={2} />
    </div>
  );
};
export default connectComponent(MissionPlanner);

const Commands = SortableContainer((props: Props) => {
  const centerMapOnCommand = useEventCallback((id: string | number) => {
    const cmdId = id.toString();
    if (props.className === "SmallMissionPlanner") {
      props.centerMapOnCommand(
        props.locationCommands.commands[cmdId].location,
        cmdId
      );
      setTimeout(() => props.commandStopAnimation(cmdId), 1000);
    }
  });

  const addCommand = () => {
    props.addCommand({
      waypointCommand: {
        goal: {
          latitude: 38.147483,
          longitude: -76.427778,
          altitude: 100
        }
      }
    });
  };

  const commandChangers = useMemo(() => {
    return {
      deleteCommand: props.deleteCommand,
      changeCommandType: props.changeCommandType,
      changeNumberField: props.changeNumberField,
      addRepeatedField: props.addRepeatedField,
      popRepeatedField: props.popRepeatedField
    };
  }, [
    props.addRepeatedField,
    props.changeCommandType,
    props.changeNumberField,
    props.deleteCommand,
    props.popRepeatedField
  ]);

  const autoGenerate = () => {
    //console.log(props.interopData.mission);
    if (!(props.interopData && props.homeAltitude !== null)) {
      throw new Error("You weren't supposed to be able to click this button!");
    }

    const targetAltitude = props.defaultAltitude;

    for (const waypoint of props.interopData.mission.waypointsList as Required<
      Position.AsObject
    >[]) {
      const altitude = waypoint.altitude - props.homeAltitude * FEET_PER_METER; // convert to relative alt
      props.addCommand({
        waypointCommand: {
          goal: {
            latitude: waypoint.latitude,
            longitude: waypoint.longitude,
            altitude: altitude
          }
        }
      });
    }

    props.addCommand({
      surveyCommand: {
        altitude: targetAltitude,
        surveyPolygonList: props.interopData.mission
          .searchGridPointsList as Required<Position.AsObject>[]
      }
    });

    const airDropPos = props.interopData.mission.airDropPos as Required<
      Position.AsObject
    >;
    props.addCommand({
      ugvDropCommand: {
        goal: {
          latitude: airDropPos.latitude,
          longitude: airDropPos.longitude,
          altitude: targetAltitude
        }
      }
    });

    const offAxisPos = props.interopData.mission.offAxisOdlcPos as Required<
      Position.AsObject
    >;
    props.addCommand({
      offAxisCommand: {
        goal: {
          latitude: offAxisPos.latitude,
          longitude: offAxisPos.longitude,
          altitude: targetAltitude
        },
        subjectLocation: offAxisPos
      }
    });
  };

  return (
    <Container fluid>
      {props.mainFlyZone ? (
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
        groundCommands={props.commands}
        commandOrder={props.commandOrder}
        className={props.className}
        centerMapOnCommand={centerMapOnCommand}
        commandChangers={commandChangers}
      />
      <Button onClick={addCommand} className="command-btn">
        Add Command
      </Button>
      {props.homeAltitude !== null &&
      props.interopData &&
      props.commandOrder.length === 0 ? (
        <Button onClick={autoGenerate} color="primary">
          Auto-Generate
        </Button>
      ) : null}
    </Container>
  );
});
