import React from "react";
import { Button } from "reactstrap";
import { Row, Col, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { SortableElement } from "react-sortable-hoc";

import { MissionState } from "redux/reducers/missionReducer";
import {
  GroundCommand,
  DroneCommand
} from "protobuf/drone/timeline_grammar_pb";
import { Position3D, Position2D } from "protobuf/drone/mission_commands_pb";
import { RepeatedFieldNamesAndValues } from "redux/actions/missionActions";

const GROUND_CMD_TYPES: Record<keyof GroundCommand.AsObject, string> = {
  flyThroughCommand: "flyThrough",
  landAtLocationCommand: "landAtLocation",
  offAxisCommand: "offAxis",
  surveyCommand: "survey",
  ugvDropCommand: "ugvDrop",
  waitCommand: "wait",
  waypointCommand: "waypoint"
};

interface CommandChangersType {
  deleteCommand: (id: string) => void;
  changeCommandType: (
    id: string,
    command: GroundCommand.AsObject,
    newType: keyof GroundCommand.AsObject
  ) => void;
  changeNumberField: (
    dotProp: string,
    input: string,
    isAltitude: boolean
  ) => void;
  addRepeatedField: (
    dotProp: string,
    fieldName: RepeatedFieldNamesAndValues["name"]
  ) => void;
  popRepeatedField: (dotProp: string) => void;
}

interface CommandListProps {
  className: string;
  groundCommands?: MissionState["commands"];
  commandOrder?: MissionState["commandOrder"];
  droneCommands?: DroneCommand.AsObject[];
  centerMapOnCommand: (id: string | number) => void;
  commandChangers?: CommandChangersType;
}

interface CommandRowProps {
  className: string;
  command: GroundCommand.AsObject | DroneCommand.AsObject;
  cmdId: string | number;
  index: number;
  myIndex: number;
  mutable: boolean;
  lengthUnits: string;
  centerMapOnCommand: (id: string | number) => void;
  commandChangers?: CommandChangersType;
}

const SortableCommand = SortableElement((props: CommandRowProps) => (
  <CommandRow {...props} />
));

const CommandList = (props: CommandListProps) => (
  <span className="CommandList">
    {props.groundCommands && props.commandOrder
      ? props.commandOrder.map(
          (cmdId, index) =>
            props.groundCommands && (
              <SortableCommand
                key={cmdId}
                className={props.className}
                centerMapOnCommand={props.centerMapOnCommand}
                commandChangers={props.commandChangers}
                command={props.groundCommands[cmdId]}
                cmdId={cmdId}
                index={index}
                myIndex={index}
                mutable={true}
                lengthUnits={"ft"}
              ></SortableCommand>
            )
        )
      : props.droneCommands
      ? props.droneCommands.map((cmd, index) => (
          <CommandRow
            key={index}
            className={props.className}
            centerMapOnCommand={props.centerMapOnCommand}
            commandChangers={props.commandChangers}
            command={cmd}
            cmdId={index}
            index={index}
            myIndex={index}
            mutable={false}
            lengthUnits={"m"}
          ></CommandRow>
        ))
      : null}
  </span>
);
export default CommandList;

const NumberField = (props: {
  dotProp: string;
  name: string;
  value: number;
  units?: string;
  isAltitude: boolean;
  commandRowProps: CommandRowProps;
}) => {
  return (
    <Row>
      <Col xs="auto">
        <InputGroup className="number input">
          <InputGroupAddon addonType="prepend">{props.name}</InputGroupAddon>
          <Input
            style={{
              width: Math.min(12, props.value.toString().length + 3) + "ch"
            }}
            value={props.value}
            type="number"
            readOnly={!props.commandRowProps.mutable}
            onChange={e =>
              props.commandRowProps.commandChangers &&
              props.commandRowProps.commandChangers.changeNumberField(
                props.dotProp,
                e.target.value,
                props.isAltitude
              )
            }
          ></Input>
          {props.units ? (
            <InputGroupAddon addonType="append">{props.units}</InputGroupAddon>
          ) : null}
        </InputGroup>
        <span className="value">
          {Math.round(props.value * 1e4) / 1e4} {props.units}
        </span>
      </Col>
    </Row>
  );
};

type ConvertValueToList<
  T extends RepeatedFieldNamesAndValues
> = T extends RepeatedFieldNamesAndValues
  ? {
      name: T["name"];
      values: T["value"][];
    }
  : never;

type RepeatedFieldNamesAndValueLists = ConvertValueToList<
  RepeatedFieldNamesAndValues
>;

const RepeatedField = (
  props: {
    dotProp: string;
    commandRowProps: CommandRowProps;
  } & RepeatedFieldNamesAndValueLists
) => {
  return (
    <span>
      {props.values.map((value, index: number) => (
        <Field
          key={index}
          dotProp={props.dotProp + "." + index}
          displayName={`${props.name} ${index + 1}`}
          commandRowProps={props.commandRowProps}
          name={props.name}
          value={value}
        />
      ))}
      <Button
        className="input"
        onClick={() =>
          props.commandRowProps.commandChangers &&
          props.commandRowProps.commandChangers.addRepeatedField(
            props.dotProp,
            props.name
          )
        }
      >
        +
      </Button>
      <Button
        className="input"
        onClick={() =>
          props.commandRowProps.commandChangers &&
          props.commandRowProps.commandChangers.popRepeatedField(props.dotProp)
        }
      >
        -
      </Button>
    </span>
  );
};

type DumbNameAndValue<
  Obj,
  Key extends keyof Obj = keyof Obj
> = Key extends keyof Obj
  ? {
      name: Key;
      value: Obj[Key];
    }
  : never;

type NameAndValue<Obj extends object> = Obj extends object
  ? DumbNameAndValue<Obj>
  : never;

type AllFieldNamesAndValues =
  | NameAndValue<
      | GroundCommand.AsObject
      | DroneCommand.AsObject
      | Required<GroundCommand.AsObject>[keyof GroundCommand.AsObject]
      | Required<DroneCommand.AsObject>[keyof DroneCommand.AsObject]
      | Position3D.AsObject
      | Position2D.AsObject
    >
  | RepeatedFieldNamesAndValues;

const Field = (
  props: {
    dotProp: string;
    hideName?: boolean;
    displayName?: string;
    commandRowProps: CommandRowProps;
  } & AllFieldNamesAndValues
) => {
  const displayName = props.displayName ? props.displayName : props.name;
  switch (props.name) {
    // 'value' is a number
    case "latitude":
    case "longitude":
    case "altitude":
    case "time": {
      let units: string | undefined = undefined;
      let isAltitude = false;
      switch (props.name) {
        case "altitude":
          units = props.commandRowProps.lengthUnits;
          isAltitude = true;
          break;
        case "time":
          units = "s";
          break;
        case "latitude":
        case "longitude":
          break;
      }
      return (
        <NumberField
          dotProp={props.dotProp}
          name={displayName}
          value={props.value}
          units={units}
          isAltitude={isAltitude}
          commandRowProps={props.commandRowProps}
        />
      );
    }

    // 'value' is a boolean
    case "comeToStop":
      return (
        <span style={{ color: props.value ? undefined : "dimgray" }}>
          {displayName}
        </span>
      ); // does not support modification because there are no bools in a GroundProgram (yet));

    // 'value' is an Array (repeated protobuf field):
    case "surveyPolygonList": {
      // Compile errors here means there are specific cases that need to be added above and/or more types that should be added to AllKeysAndValues.
      let fieldNameAndValues: RepeatedFieldNamesAndValueLists;
      switch (props.name) {
        case "surveyPolygonList":
          fieldNameAndValues = {
            name: "surveyPolygon" as const,
            values: props.value
          };
      }

      return (
        <RepeatedField
          dotProp={props.dotProp}
          commandRowProps={props.commandRowProps}
          {...fieldNameAndValues}
        ></RepeatedField>
      );
    }

    // 'value' is an object (protobuf message):
    default: {
      // Compile errors in the default case means there are specific cases that need to be added above and/or more types that should be added to AllKeysAndValues.
      if (props.value === undefined) {
        throw new Error("value should be defined in Field");
      }
      const value = props.value;
      const nextKeysAndValues: NameAndValue<typeof value>[] = Object.entries(
        value
      ).map(
        ([nextKey, nextValue]) =>
          ({
            name: nextKey,
            value: nextValue
          } as NameAndValue<typeof value>)
      );

      return (
        <Row>
          {!props.hideName ? (
            <Col xs="auto" className="name">
              {displayName}
            </Col>
          ) : null}
          {nextKeysAndValues.map(nextKeyAndValue => (
            <Col
              xs="auto"
              className="field-container"
              key={nextKeyAndValue.name}
            >
              <Field
                dotProp={props.dotProp + "." + nextKeyAndValue.name}
                commandRowProps={props.commandRowProps}
                {...nextKeyAndValue}
              />
            </Col>
          ))}
        </Row>
      );
    }
  }
};

// React.memo, AKA a "Pure Component", improves performance b/c it only re-renders when props change
const CommandRowImpure = (props: CommandRowProps) => {
  const centerMapOnCommand = () => {
    props.centerMapOnCommand(props.cmdId);
  };

  const [cmdType, cmdObject] = Object.entries(props.command)[0];
  const cmdTypeAndObject = {
    name: cmdType,
    value: cmdObject
  } as NameAndValue<GroundCommand.AsObject | DroneCommand.AsObject>;
  const cmdTypeShort = cmdType.slice(0, -7); // remove "Command" from end of string

  const index = props.myIndex;
  return (
    <Row
      className={`MissionPlanner ${props.className}`}
      onClick={centerMapOnCommand}
    >
      <Col xs="auto" className="command-column input command-header">
        <Button
          className="delete-btn"
          color="danger"
          size="sm"
          onClick={() =>
            props.commandChangers &&
            props.commandChangers.deleteCommand(props.cmdId.toString())
          }
        >
          <i className="fa fa-minus"></i>
        </Button>
      </Col>
      <Col xs="auto" className="command-column command-index command-header">
        {index + 1}
      </Col>
      <Col xs="auto" className="command-column command-type command-header">
        <span className="value">{cmdTypeShort}</span>
        <Input
          type="select"
          className="input"
          value={cmdType}
          readOnly={!props.mutable}
          onChange={e =>
            props.commandChangers &&
            props.commandChangers.changeCommandType(
              props.cmdId.toString(),
              props.command as GroundCommand.AsObject,
              e.target.value as keyof GroundCommand.AsObject
            )
          }
        >
          {Object.entries(GROUND_CMD_TYPES).map(
            ([commandType, commandTypeShort]) => (
              <option value={commandType} key={commandType}>
                {commandTypeShort}
              </option>
            )
          )}
        </Input>
      </Col>
      <Col xs="auto" className="command-column">
        <Field
          hideName={true}
          dotProp={props.cmdId + "." + cmdType}
          commandRowProps={props}
          {...cmdTypeAndObject}
        />
      </Col>
    </Row>
  );
};
const CommandRow = React.memo(CommandRowImpure);
