import { transmit } from "./genericActions";
import { GroundProgram } from "protobuf/drone/timeline_grammar_pb";
import { DroneState, DroppyState } from "messages";

const changeDroneState = (droneState: DroneState) =>
  transmit("CHANGE_DRONE_STATE", droneState);

const changeDroppyState = (droppyState: DroppyState) =>
  transmit("CHANGE_DROPPY_STATE", droppyState);

export const droneTakeoff = () => changeDroneState("TAKEOFF");
export const droneLand = () => changeDroneState("LAND");
export const droneFailsafe = () => changeDroneState("FAILSAFE");
export const droneThrottleCut = () => changeDroneState("THROTTLE_CUT");

export const droppyStart = () => changeDroppyState("START_DROP");
export const droppyCut = () => changeDroppyState("CUT_LINE");
export const droppyUp = () => changeDroppyState("MOTOR_UP");
export const droppyDown = () => changeDroppyState("MOTOR_DOWN");
export const droppyStop = () => changeDroppyState("MOTOR_STOP");
export const droppyCancel = () => changeDroppyState("CANCEL_DROP");
export const droppyResetLatch = () => changeDroppyState("RESET_LATCH");
export const droppyStopCut = () => changeDroppyState("STOP_CUT");

export const compileMission = (groundProgram: GroundProgram.AsObject) =>
  transmit("COMPILE_GROUND_PROGRAM", groundProgram);
export const uploadMission = () => transmit("UPLOAD_MISSION");
export const runMission = () => transmit("RUN_MISSION");
export const pauseMission = () => transmit("PAUSE_MISSION");
export const endMission = () => transmit("END_MISSION");

export const driveUgv = () => transmit("DRIVE_UGV");
export const disableUgv = () => transmit("DISABLE_UGV");
