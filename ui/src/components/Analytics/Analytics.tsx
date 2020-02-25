import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { Button, ButtonGroup, Col, Container, Row } from "reactstrap";

import UasLogo from "components/utils/UasLogo/UasLogo";
import { AppState } from "redux/store";
import * as analyticsActions from "redux/actions/analyticsActions";
import downloadToBrowser from "utils/downloadToBrowser";
import { ExtractPropsType } from "utils/reduxUtils";
import { TelemetryState } from "redux/reducers/telemetryReducer";
import "./Analytics.css";

const mapStateToProps = (state: AppState) => {
  return {
    telemetry: state.telemetry.droneTelemetry,
    ugvStatus: state.telemetry.ugvStatus,
    interopData: state.mission.originalInteropData,
    recording: state.telemetry.recording,
    telemetryData: state.telemetry.telemetryData
  };
};

let loadedTelemetry: TelemetryState["droneTelemetry"][];
// var telemetryData = [];
// var recording = false;
// var usingLoaded = false;
// var isPaused = false;

const mapDispatchToProps = analyticsActions;

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const Analytics = (props: Props) => {
  const [isPaused, setPaused] = useState(false);
  const [usingLoaded, setUsingLoaded] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const saveInteropMission = () => {
    // console.log(this.props.interopData)
    downloadToBrowser(
      "interop.json",
      JSON.stringify(props.interopData, null, 2)
    );
  };

  const loadInteropMission = () => {
    // this.props.loadInteropData({ type: 'INTEROP_DATA', payload: data });

    const reader = new FileReader();
    reader.onload = () => {
      const data = JSON.parse(reader.result as string);
      console.log(data);
      props.loadInteropData(data);
    };
    if (
      fileInput.current &&
      fileInput.current.files &&
      fileInput.current.files.length > 0
    ) {
      reader.readAsText(fileInput.current.files[0]);
    }
  };

  const downloadTelemetry = () => {
    downloadToBrowser(
      "telemetry.json",
      JSON.stringify(props.telemetryData, null, 2)
    );
  };

  const toggleRecord = () => {
    if (props.recording) {
      downloadTelemetry();
      let i;
      const l = props.telemetryData.length;
      for (i = 0; i < l; i++) {
        props.telemetryData.pop();
      }
    }
    props.toggleRecording();
  };

  // const handleSubmit = (event: any) => {
  //   event.preventDefault();
  //   if (fileInput.current && fileInput.current.files)
  //     alert(`Selected file - ${fileInput.current.files[0].name}`);
  // };

  const runLoaded = () => {
    if (!usingLoaded) {
      props.togglePlayback();
      const reader: FileReader = new FileReader();
      reader.onload = e => {
        loadedTelemetry = JSON.parse(reader.result as string);
        setUsingLoaded(true);
        // console.log(loadedTelemetry)
        let i = 0;
        const intervalID = setInterval(() => {
          if (isPaused) {
            //
          } else {
            props.playback(loadedTelemetry[i]);
            i = i + 1;
            if (i > loadedTelemetry.length) {
              setUsingLoaded(false);
              clearInterval(intervalID);
              props.togglePlayback();
            }
          }
        }, 250);
      };
      // if (reader.readyState == FileReader.EMPTY){
      //  reader.abort()
      // }else{
      // console.log(reader.readyState)
      if (
        fileInput.current &&
        fileInput.current.files &&
        fileInput.current.files.length > 0
      ) {
        reader.readAsText(fileInput.current.files[0]);
      }

      // }
    } else {
      setPaused(!isPaused);
    }
  };

  // const stringifyTelemetry = (string: string) => {
  //   if (!usingLoaded) {
  //     return JSON.stringify(props.telemetry);
  //   } else {
  //     return JSON.stringify(loadedTelemetry);
  //   }
  // };

  return (
    <Container className="Analytics">
      <Row>
        <Col className="logo">
          <UasLogo />
        </Col>
      </Row>

      <Row>
        <div id="telemetry">
          Telemetry: {JSON.stringify(props.telemetry, null, 2)}
        </div>
      </Row>

      <br />
      <br />

      <Row>
        <Col>
          <Button
            size="lg"
            color={props.recording ? "danger" : "secondary"}
            onClick={toggleRecord}
          >
            {props.recording ? "Save" : "Record"}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          Telemetry States Recorded: <b>{props.telemetryData.length}</b>
        </Col>
      </Row>

      <br />
      {/* <button onClick={handleSubmit}>
            Load Telemetry File / Unload File
          </button> */}
      <Row>
        <Col>
          <Button
            color={!usingLoaded ? "secondary" : isPaused ? "success" : "info"}
            onClick={runLoaded}
          >
            {!usingLoaded
              ? "Run Loaded Telemetry"
              : isPaused
              ? "Resume"
              : "Pause"}
          </Button>
        </Col>
      </Row>

      <br />

      <Row>
        <Col>
          <ButtonGroup>
            <Button color="secondary" onClick={saveInteropMission}>
              Save Current Interop Mission
            </Button>

            <Button color="primary" onClick={loadInteropMission}>
              Load Interop Mission
            </Button>
          </ButtonGroup>
        </Col>
      </Row>

      <br />
      <Row>
        <Col>
          <h2>File Browser</h2>
          <input type="file" ref={fileInput} />
        </Col>
      </Row>

      <br />
      <Row>
        <div id="ugv-status">
          UGV Status: {JSON.stringify(props.ugvStatus, null, 2)}
        </div>
      </Row>
    </Container>
  );
};

export default connectComponent(Analytics);
