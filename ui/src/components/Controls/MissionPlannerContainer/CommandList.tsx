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
  // addRepeatedField: (dotProp: string, type: string) => void;
  // popRepeatedField: (dotProp: string) => void;
}

interface CommandListProps {
  className: string;
  groundCommands?: MissionState["commands"];
  commandOrder?: MissionState["commandOrder"];
  droneCommands?: DroneCommand.AsObject[];
  centerMapOnCommand: (id: string) => void;
  commandChangers?: CommandChangersType;
}

interface CommandRowProps {
  className: string;
  key: string;
  command: GroundCommand.AsObject | DroneCommand.AsObject;
  cmdId: string;
  index: number;
  myIndex: number;
  mutable: boolean;
  lengthUnits: string;
  centerMapOnCommand: (id: string) => void;
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
                className={props.className}
                key={cmdId}
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
            className={props.className}
            key={index.toString()}
            centerMapOnCommand={props.centerMapOnCommand}
            commandChangers={props.commandChangers}
            command={cmd}
            cmdId={index.toString()}
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
  name: string;
  dotProp: string;
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

type RepeatedFieldNamesAndValues = {
  name: "surveyPolygon";
  value: Position2D.AsObject;
};

// const RepeatedField = ({
//   name,
//   dotProp,
//   type,
//   object
// }: {
//   name: string;
//   dotProp: string;
//   type: string;
//   object: any[];
// }) => {
//   return (
//     <span>
//       {object.map(
//         (element, index: number) =>
//           null /*(
//         <Field
//           name={`${name} ${index + 1}`}
//           key={index}
//           dotProp={dotProp + "." + index}
//           type={type}
//           object={element}
//         />
//       )*/
//       )}
//       <Button
//         className="input"
//         onClick={
//           () => props.commandChangers
//           // TODO && props.commandChangers.addRepeatedField(dotProp, type)
//         }
//       >
//         +
//       </Button>
//       <Button
//         className="input"
//         onClick={
//           () => props.commandChangers
//           // TODO && props.commandChangers.popRepeatedField(dotProp)
//         }
//       >
//         -
//       </Button>
//     </span>
//   );
// };

// type Distribute<U> = U extends any ? { key: U } : never;

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
    showName: boolean;
    dotProp: string;
    commandRowProps: CommandRowProps;
  } & AllFieldNamesAndValues
) => {
  switch (props.name) {
    // 'value' is a number
    case "latitude":
    case "longitude":
    case "altitude":
    case "time": {
      let units: string | undefined = undefined;
      let isAltitude = false;
      if (props.name === "altitude") {
        units = props.commandRowProps.lengthUnits;
        isAltitude = true;
      } else if (props.name === "time") {
        units = "s";
      }
      return (
        <NumberField
          name={props.name}
          dotProp={props.dotProp}
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
          {props.name}
        </span>
      ); // does not support modification because there are no bools in a GroundProgram (yet));

    // 'value' is an Array (repeated protobuf field):
    case "surveyPolygonList":
      // Compile errors here means there are specific cases that need to be added above and/or more types that should be added to AllKeysAndValues.
      return null;

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
          {props.showName ? (
            <Col xs="auto" className="name">
              {props.name}
            </Col>
          ) : null}
          {nextKeysAndValues.map(nextKeyAndValue => (
            <Col
              xs="auto"
              className="field-container"
              key={nextKeyAndValue.name}
            >
              {/* {field.rule === "repeated" ? (
                  <RepeatedField {...fieldProps} />
                ) : field.rule === "required" ? ( */}
              <Field
                showName={true}
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
            props.commandChangers.deleteCommand(props.cmdId)
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
              props.cmdId,
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
          showName={false}
          dotProp={props.cmdId + "." + cmdType}
          commandRowProps={props}
          {...cmdTypeAndObject}
        />
      </Col>
    </Row>
  );
};
const CommandRow = React.memo(CommandRowImpure);
