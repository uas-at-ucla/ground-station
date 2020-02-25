import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Container
} from "reactstrap";
import { connect } from "react-redux";

import { AppState } from "redux/store";
import "./MissionPlannerContainer.css";
import MissionPlanner from "./MissionPlanner";
import CommandList from "./CommandList";
import { ExtractPropsType } from "utils/reduxUtils";
import * as missionActions from "redux/actions/missionActions";
import { useEventCallback } from "utils/customHooks";

const mapStateToProps = (state: AppState) => {
  return {
    droneProgram: state.mission.droneProgram,
    // missionStatus: state.mission.missionStatus,
    missionUploaded: state.mission.missionUploaded,
    dropReady: state.telemetry.droneTelemetry ? true : null, //state.telemetry.droneTelemetry.output.deploy
    lastDroppyCommand: state.mission.lastDroppyCommand,
    ugvStatus: state.telemetry.ugvStatus
  };
};

const mapDispatchToProps = missionActions;

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const MissionPlannerContainer = (props: Props) => {
  const [isExpanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("plan");

  const toggleTab = (tab: "plan" | "drone") => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const expand = () => setExpanded(true);

  const close = () => setExpanded(false);

  const centerMapOnDroneCommand = useEventCallback((id: string | number) => {
    const index = Number(id);
    if (props.droneProgram) {
      const cmd = props.droneProgram.commandsList[index];
      const cmdType = Object.keys(cmd)[0] as keyof typeof cmd;
      if (cmdType === "translateCommand") {
        const location = cmd[cmdType]?.goal;
        props.centerMapOnCommand(location);
      }
    }
  });

  return (
    <div className="MissionPlannerContainer">
      <div className="missionPlannerHeader">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === "plan" ? "active" : undefined}
              onClick={() => toggleTab("plan")}
            >
              Plan
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "drone" ? "active" : undefined}
              onClick={() => toggleTab("drone")}
            >
              {props.missionUploaded ? "Uploaded" : "Compiled"} Mission
            </NavLink>
          </NavItem>
        </Nav>
        <i onClick={expand} className="fa fa-expand fa-lg"></i>
      </div>

      <TabContent activeTab={activeTab}>
        <div>
          Drop Status: {props.lastDroppyCommand} (
          {props.dropReady ? "Ready" : "Not ready"})
        </div>
        <div>
          UGV is Still?{" "}
          {props.ugvStatus
            ? props.ugvStatus.isStill != null
              ? props.ugvStatus.isStill
                ? "YES"
                : "NO"
              : "UNKNOWN"
            : "UNKNOWN"}
        </div>
        {/* <span>Mission Status: {props.missionStatus}</span> */}
        <TabPane tabId="plan">
          <div className="SmallMissionPlanner">
            <MissionPlanner className="SmallMissionPlanner" />
          </div>
        </TabPane>
        <TabPane tabId="drone">
          <div className="SmallMissionPlanner">
            <Container fluid>
              <CommandList
                droneCommands={
                  props.droneProgram ? props.droneProgram.commandsList : []
                }
                className="SmallMissionPlanner"
                centerMapOnCommand={centerMapOnDroneCommand}
              />
            </Container>
          </div>
        </TabPane>
      </TabContent>

      <Modal isOpen={isExpanded} toggle={close} className="MissionPlannerModal">
        <ModalHeader toggle={close}>Mission Planner</ModalHeader>
        <ModalBody>
          <div className="BigMissionPlanner">
            <MissionPlanner className="BigMissionPlanner" />
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default connectComponent(MissionPlannerContainer);
