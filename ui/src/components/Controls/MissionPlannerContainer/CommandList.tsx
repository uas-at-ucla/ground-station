import React from "react";
import { Button } from "reactstrap";
import { Row, Col, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { SortableElement } from "react-sortable-hoc";

interface CommandChangersType {
  deleteCommand: (index: number) => void;
  changeCommandType: (index: number, oldCommand: any, newType: string) => void;
  changeNumberField: (dotProp: string, input: string) => void;
  addRepeatedField: (dotProp: string, type: string) => void;
  popRepeatedField: (dotProp: string) => void;
}

interface CommandListProps {
  className: string;
  commands: any[];
  programType: string;
  mutable: boolean;
  protoInfo: any;
  centerMapOnCommand: (i: number) => void;
  commandChangers?: CommandChangersType;
}

interface CommandRowProps {
  className: string;
  key: string;
  command: any;
  programType: string;
  index: number;
  myIndex: number;
  mutable: boolean;
  protoInfo: any;
  centerMapOnCommand: (i: number) => void;
  commandChangers?: CommandChangersType;
}

const SortableCommand = SortableElement((props: CommandRowProps) => (
  <CommandRow {...props} />
));

const CommandList = (props: CommandListProps) => {
  let CommandRowElement = CommandRow;
  if (props.mutable) {
    CommandRowElement = (SortableCommand as unknown) as typeof CommandRow;
  }
  return (
    <span className="CommandList">
      {props.commands.map((command, index: number) => (
        <CommandRowElement
          className={props.className}
          key={command.id}
          centerMapOnCommand={props.centerMapOnCommand}
          commandChangers={props.commandChangers}
          command={command}
          programType={props.programType}
          index={index}
          myIndex={index}
          mutable={props.mutable}
          protoInfo={props.protoInfo}
        ></CommandRowElement>
      ))}
    </span>
  );
};

export default CommandList;

// PureComponent improves performance b/c it only re-renders when props change
const CommandRowImpure = (props: CommandRowProps) => {
  const centerMapOnCommand = () => {
    console.log(props);
    props.centerMapOnCommand(props.myIndex);
  };

  // Helper components
  const NumberField = ({
    name,
    dotProp,
    value,
    units
  }: {
    name: string;
    dotProp: string;
    value: number;
    units?: string;
  }) => {
    return (
      <Row>
        <Col xs="auto">
          <InputGroup className="number input">
            <InputGroupAddon addonType="prepend">{name}</InputGroupAddon>
            <Input
              style={{
                width: Math.min(12, value.toString().length + 3) + "ch"
              }}
              value={value}
              type="number"
              readOnly={!props.mutable}
              onChange={e =>
                props.commandChangers &&
                props.commandChangers.changeNumberField(dotProp, e.target.value)
              }
            ></Input>
            {units ? (
              <InputGroupAddon addonType="append">{units}</InputGroupAddon>
            ) : null}
          </InputGroup>
          <span className="value">
            {Math.round(value * 1e4) / 1e4} {units}
          </span>
        </Col>
      </Row>
    );
  };

  const RepeatedField = ({
    name,
    dotProp,
    type,
    object
  }: {
    name: string;
    dotProp: string;
    type: string;
    object: any[];
  }) => {
    return (
      <span>
        {object.map((element, index: number) => (
          <Field
            name={`${name} ${index + 1}`}
            key={index}
            dotProp={dotProp + "." + index}
            type={type}
            object={element}
          />
        ))}
        <Button
          className="input"
          onClick={() =>
            props.commandChangers &&
            props.commandChangers.addRepeatedField(dotProp, type)
          }
        >
          +
        </Button>
        <Button
          className="input"
          onClick={() =>
            props.commandChangers &&
            props.commandChangers.popRepeatedField(dotProp)
          }
        >
          -
        </Button>
      </span>
    );
  };

  const Field = ({
    name,
    dotProp,
    type,
    object
  }: {
    name: string;
    dotProp: string;
    type: string;
    object: any;
  }) => {
    // Recursively create HTML based on protobuf definition
    const timelineGrammar = props.protoInfo.timelineGrammar;
    if (timelineGrammar[type]) {
      // object is a protobuf defined object
      return (
        <Row>
          {name !== "" ? (
            <Col xs="auto" className="name">
              {name}:
            </Col>
          ) : null}
          {Object.keys(timelineGrammar[type].fields).map(fieldName => {
            const field = timelineGrammar[type].fields[fieldName];
            const fieldDotProp = dotProp + "." + fieldName;
            const fieldProps = {
              name: fieldName,
              dotProp: fieldDotProp,
              type: field.type,
              object: object[fieldName]
            };
            return (
              <Col xs="auto" className="field-container" key={fieldName}>
                {field.rule === "repeated" ? (
                  <RepeatedField {...fieldProps} />
                ) : field.rule === "required" ? (
                  <Field {...fieldProps} />
                ) : (
                  (() => {
                    throw new Error(
                      "No support for timeline_grammar rule '" +
                        field.rule +
                        "' yet!"
                    );
                  })()
                )}
              </Col>
            );
          })}
        </Row>
      );
    } else if (type === "double") {
      return (
        <NumberField
          name={name}
          dotProp={dotProp}
          value={object}
          units={props.protoInfo.fieldUnits[props.programType][name]}
        />
      );
    } else if (type === "bool") {
      return (
        <span style={{ color: object ? undefined : "dimgray" }}>{name}</span>
      ); // does not support modification because there are no bools in a GroundProgram
    } else {
      throw new Error(
        "No support for timeline_grammar type '" + type + "' yet!"
      );
    }
  };

  const command = props.command;
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
            props.commandChangers && props.commandChangers.deleteCommand(index)
          }
        >
          <i className="fa fa-minus"></i>
        </Button>
      </Col>
      <Col xs="auto" className="command-column command-index command-header">
        {index + 1}
      </Col>
      <Col xs="auto" className="command-column command-type command-header">
        <span className="value">
          {props.protoInfo.commandAbbr[command.name]}
        </span>
        <Input
          type="select"
          className="input"
          value={command.name}
          readOnly={!props.mutable}
          onChange={e =>
            props.commandChangers &&
            props.commandChangers.changeCommandType(
              index,
              command,
              e.target.value
            )
          }
        >
          {props.protoInfo.commandNames.map((commandName: string) => (
            <option value={commandName} key={commandName}>
              {props.protoInfo.commandAbbr[commandName]}
            </option>
          ))}
        </Input>
      </Col>
      <Col xs="auto" className="command-column">
        <Field
          name=""
          dotProp={index + "." + command.name}
          type={command.type}
          object={command[command.name]}
        />
      </Col>
    </Row>
  );
};
const CommandRow = React.memo(CommandRowImpure);
