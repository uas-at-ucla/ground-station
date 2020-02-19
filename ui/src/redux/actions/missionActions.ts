import shortid from "shortid";

import { MissionState } from "redux/reducers/missionReducer";
import { GroundCommand } from "protobuf/drone/timeline_grammar_pb";
import { Position2D, Position3D } from "protobuf/drone/mission_commands_pb";

export type RepeatedFieldNamesAndValues = {
  name: "surveyPolygon";
  value: Position2D.AsObject;
};

const makeDummyPosition2D: () => Position2D.AsObject = () => ({
  latitude: 0,
  longitude: 0
});

const makeDummyPosition3D: () => Position3D.AsObject = () => ({
  latitude: 0,
  longitude: 0,
  altitude: 0
});

const makeDefaultCommand: () => Required<GroundCommand.AsObject> = () => ({
  flyThroughCommand: {
    goal: makeDummyPosition3D()
  },
  landAtLocationCommand: {
    goal: makeDummyPosition3D()
  },
  offAxisCommand: {
    goal: makeDummyPosition3D(),
    subjectLocation: makeDummyPosition2D()
  },
  surveyCommand: {
    altitude: 0,
    surveyPolygonList: []
  },
  ugvDropCommand: {
    goal: makeDummyPosition3D()
  },
  waitCommand: {
    time: 0
  },
  waypointCommand: {
    goal: makeDummyPosition3D()
  }
});

export const centerMapOnCommand = (
  commands: MissionState["commands"],
  cmdId: string
) => {
  const cmd = commands[cmdId];
  const cmdType = Object.keys(cmd)[0] as keyof GroundCommand.AsObject;
  if (cmdType !== "waitCommand" && cmdType !== "surveyCommand") {
    const location = cmd[cmdType]?.goal;
    if (location) {
      return {
        type: "CENTER_ON_COMMAND" as const,
        payload: {
          id: cmdId,
          pos: {
            lat: location.latitude,
            lng: location.longitude
          }
        }
      };
    }
  }
  return { type: "NONE" as const };
};

export const commandStopAnimation = (cmdId: string) => ({
  type: "COMMAND_STOP_ANIMATION" as const,
  payload: { id: cmdId }
});

export const addCommand = (command: GroundCommand.AsObject) => ({
  type: "ADD_COMMAND" as const,
  payload: {
    id: shortid.generate(), // ID is generated here rather than in reducer because the reducer is suposed to be a "pure" function.
    command: command
  }
});

export const deleteCommand = (id: string) => ({
  type: "DELETE_COMMAND" as const,
  payload: id
});

export const reorderCommand = (oldIndex: number, newIndex: number) => ({
  type: "REORDER_COMMAND" as const,
  payload: {
    oldIndex: oldIndex,
    newIndex: newIndex
  }
});

export const changeCommandType = (
  id: string,
  command: GroundCommand.AsObject,
  newType: keyof GroundCommand.AsObject
) => {
  const oldType = Object.keys(command)[0] as keyof GroundCommand.AsObject;
  const newCommand: GroundCommand.AsObject = {
    [newType]: makeDefaultCommand()[newType]
  };
  if (
    oldType !== "waitCommand" &&
    oldType !== "surveyCommand" &&
    newType !== "waitCommand" &&
    newType !== "surveyCommand"
  ) {
    const oldCmdObj = command[oldType];
    const newCmdObj = newCommand[newType];
    if (!oldCmdObj || !newCmdObj) {
      throw new Error("Impossible!");
    }
    newCmdObj.goal = oldCmdObj.goal;
  }
  return {
    type: "CHANGE_COMMAND_TYPE" as const,
    payload: {
      id: id,
      newCommand: newCommand
    }
  };
};

export const changeCommandField = (
  dotProp: string,
  newValue: number,
  isAltitude?: boolean
) => ({
  type: "CHANGE_COMMAND_FIELD" as const,
  payload: {
    dotProp: dotProp,
    newValue: newValue,
    isAltitude: isAltitude
  }
});

export const addRepeatedField = (
  dotProp: string,
  fieldName: RepeatedFieldNamesAndValues["name"]
) => {
  let fieldNameAndValue: RepeatedFieldNamesAndValues;
  switch (fieldName) {
    case "surveyPolygon":
      fieldNameAndValue = {
        name: fieldName,
        value: makeDummyPosition2D()
      };
  }
  return {
    type: "ADD_REPEATED_FIELD" as const,
    payload: {
      dotProp: dotProp,
      newElement: fieldNameAndValue.value
    }
  };
};

export const popRepeatedField = (dotProp: string) => ({
  type: "POP_REPEATED_FIELD" as const,
  payload: {
    dotProp: dotProp
  }
});
