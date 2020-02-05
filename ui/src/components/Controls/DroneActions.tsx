import React, {
  MouseEvent,
  ChangeEvent,
  useState,
  useEffect,
  useRef
} from "react";
import { connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Row,
  Col,
  Input
} from "reactstrap";

import * as droneActions from "redux/actions/droneActions";
import { AppState } from "redux/store";
import { ExtractPropsType } from "utils/reduxUtils";

const disableBtns = false; // set to true to disable buttons when they shouldn't be triggered based on drone state
const setpointMsgs = {
  gimbal: "GIMBAL_SETPOINT",
  deployment: "DEPLOYMENT_MOTOR_SETPOINT",
  latch: "LATCH_SETPOINT",
  hotwire: "HOTWIRE_SETPOINT"
};

const mapStateToProps = (state: AppState) => {
  return {
    missionCommands: state.mission.commands,
    missionCompiled: state.mission.missionCompiled,
    missionUploaded: state.mission.missionUploaded,
    dropReady: state.telemetry.droneTelemetry ? true : null, //state.telemetry.droneTelemetry.output.deploy
    lastDroppyCommand: state.mission.lastDroppyCommand,
    runningMission: state.telemetry.droneTelemetry
      ? 1 + 1 === 5 //state.telemetry.droneTelemetry.output.state
      : null, // 5 is MISSION in flight loop state machine
    setpoints: state.telemetry.setpoints
  };
};

const mapDispatchToProps = droneActions;

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const DroneActions = (props: Props) => {
  const [doShowModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const action = useRef(() => {
    /**/
  });
  const [showSetpointModal, setShowSetpointModal] = useState(false);
  const [setpointInputs, setSetpointInputs] = useState({
    gimbal: 0.0,
    deployment: 0.0,
    latch: false,
    hotwire: false
  });

  const doShowModalRef = useRef(doShowModal);
  doShowModalRef.current = doShowModal;
  useEffect(() => {
    document.addEventListener("keypress", e => {
      if (e.key === "Enter" && doShowModalRef.current) {
        action.current();
        setShowModal(false);
      }
    });
  }, []);

  const toggle = () => {
    setShowModal(!doShowModal);
  };

  const toggleWithName = (message: string, newAction: () => void) => {
    setMessage(message);
    action.current = newAction;
    toggle();
  };

  const doAction = () => {
    action.current();
    toggle();
  };

  const toggleSetpoints = () => {
    setShowSetpointModal(!showSetpointModal);
  };

  const booleanSetpointChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setSetpointInputs({
      ...setpointInputs,
      [e.target.name]: e.target.checked
    });
  };

  const floatSetpointChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      setSetpointInputs({
        ...setpointInputs,
        [e.target.name]: newValue
      });
    }
  };

  const sendSetpoint = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as keyof typeof setpointMsgs;
    props.sendSetpoint(setpointMsgs[name], setpointInputs[name]);
  };

  const compileMission = () => {
    // props.compileMission(props.missionCommands); // TODO
  };

  return (
    <span className="DroneActions">
      <div className="buttonArray">
        {props.missionCompiled ? (
          <button
            id="runMissionButton"
            onClick={() =>
              toggleWithName("Upload Mission", props.uploadMission)
            } /*disabled={disableBtns && props.missionUploaded}*/
          >
            Upload Mission
          </button>
        ) : (
          <button
            id="runMissionButton"
            onClick={() => toggleWithName("Compile Mission", compileMission)}
            disabled={disableBtns && props.runningMission}
          >
            Compile Mission
          </button>
        )}
        {/* {props.missionStatus === 'RUN_MISSION' ? 
            <button id="takeoffButton" onClick={()=>toggleWithName("Pause Mission", props.pauseMission)}>Pause Mission</button>
          : props.missionUploaded || props.missionStatus === 'PAUSE_MISSION' ?
            <button id="runMissionButton" onClick={()=>toggleWithName("Run Mission", props.runMission)}>Run Mission</button> 
          :
            <button id="runMissionButton" disabled>Run Mission</button>
          } */}
        {/* <button id="failsafeButton" onClick={()=>toggleWithName("End Mission", props.endMission)}>End Mission</button> */}
        <button
          id="landButton"
          disabled={disableBtns && !props.dropReady}
          onClick={() => toggleWithName("Start UGV Drop", props.droppyStart)}
        >
          Start Drop
        </button>
        <button
          id="takeoffButton"
          disabled={disableBtns && props.lastDroppyCommand != null}
          onClick={() => toggleWithName("Cut Wire & Drive", props.droppyCut)}
        >
          {"Cut Wire & Drive"}
        </button>

        {/* <button id="takeoffButton" onClick={()=>toggleWithName("Takeoff", props.droneTakeoff)}>Takeoff</button> */}
        {/* <button id="landButton" onClick={()=>toggleWithName("Land", props.droneLand)}>Land</button> */}
        {/* <button id="failsafeButton" onClick={()=>toggleWithName("Failsafe Landing", props.droneFailsafe)}>Failsafe Landing</button> */}
        {/* <button id="throttleCutButton" onClick={()=>toggleWithName("Throttle Cut", props.droneThrottleCut)}>Throttle Cut</button> */}
        <button
          id="failsafeButton"
          onClick={() => toggleWithName("Drive UGV", props.driveUgv)}
        >
          Drive UGV
        </button>
        <button
          id="throttleCutButton"
          onClick={() => toggleWithName("Disable UGV", props.disableUgv)}
        >
          Disable UGV
        </button>
        <button id="landButton" onClick={toggleSetpoints}>
          Setpoints
        </button>
        <Modal isOpen={doShowModal} toggle={toggle} className="DroneActions">
          <ModalHeader toggle={toggle}>WARNING</ModalHeader>
          <ModalBody>Are you sure you want to {message}?</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={doAction}>
              {message}
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={showSetpointModal}
          toggle={toggleSetpoints}
          className="DroneActions"
        >
          <ModalHeader toggle={toggleSetpoints}>Setpoint Override</ModalHeader>
          <ModalBody>
            <Container>
              <Row>
                <Col xs="6">
                  Gimbal: <b>{props.setpoints.gimbal}</b>
                </Col>
                <Col>
                  <Input
                    name="gimbal"
                    type="number"
                    value={setpointInputs.gimbal}
                    onChange={floatSetpointChanged}
                  />
                </Col>
                <Col>
                  <Button name="gimbal" color="primary" onClick={sendSetpoint}>
                    Send!
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col xs="6">
                  Deployment Motor: <b>{props.setpoints.deployment}</b>
                </Col>
                <Col>
                  <Input
                    name="deployment"
                    type="number"
                    value={setpointInputs.deployment}
                    onChange={floatSetpointChanged}
                  />
                </Col>
                <Col>
                  <Button
                    name="deployment"
                    color="primary"
                    onClick={sendSetpoint}
                  >
                    Send!
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col xs="6">
                  Deployment Latch:{" "}
                  <b>
                    {props.setpoints.latch != null
                      ? props.setpoints.latch
                        ? "True"
                        : "False"
                      : null}
                  </b>
                </Col>
                <Col>
                  <Input
                    name="latch"
                    type="checkbox"
                    checked={setpointInputs.latch}
                    onChange={booleanSetpointChanged}
                  />
                </Col>
                <Col>
                  <Button name="latch" color="primary" onClick={sendSetpoint}>
                    Send!
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col xs="6">
                  Hotwire:{" "}
                  <b>
                    {props.setpoints.hotwire != null
                      ? props.setpoints.hotwire
                        ? "True"
                        : "False"
                      : null}
                  </b>
                </Col>
                <Col>
                  <Input
                    name="hotwire"
                    type="checkbox"
                    checked={setpointInputs.hotwire}
                    onChange={booleanSetpointChanged}
                  />
                </Col>
                <Col>
                  <Button name="hotwire" color="primary" onClick={sendSetpoint}>
                    Send!
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <div>Deployment Commands:</div>
                  <div>
                    <Button
                      color="warning"
                      disabled={disableBtns && props.lastDroppyCommand != null}
                      onClick={props.droppyUp}
                    >
                      Up
                    </Button>
                    <Button
                      color="success"
                      disabled={disableBtns && props.lastDroppyCommand != null}
                      onClick={props.droppyDown}
                    >
                      Down
                    </Button>
                    <Button
                      color="danger"
                      disabled={disableBtns && props.lastDroppyCommand != null}
                      onClick={props.droppyStop}
                    >
                      Stop
                    </Button>
                  </div>
                  <br />
                  <div>
                    <Button
                      color="warning"
                      disabled={disableBtns && props.lastDroppyCommand != null}
                      onClick={props.droppyStopCut}
                    >
                      Stop Cutting
                    </Button>
                    <Button
                      color="primary"
                      disabled={disableBtns && props.lastDroppyCommand != null}
                      onClick={props.droppyResetLatch}
                    >
                      Reset Latch
                    </Button>
                    <Button
                      color="danger"
                      disabled={disableBtns && props.lastDroppyCommand != null}
                      onClick={props.droppyCancel}
                    >
                      Cancel Drop
                    </Button>
                  </div>
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleSetpoints}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </span>
  );
};

export default connectComponent(DroneActions);
