import React, { ChangeEvent, MouseEvent, useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Marker } from "@react-google-maps/api";

import "./Settings.css";
import GoogleMap, {
  downloadMapImages,
  mapImagesFolder
} from "components/utils/GoogleMap/GoogleMap";
import UasLogo from "components/utils/UasLogo/UasLogo";
import * as settingsActions from "redux/actions/settingsActions";
import * as genericActions from "redux/actions/genericActions";
import * as externalActions from "redux/actions/externalActions";
import { AppState, selector } from "redux/store";
import { ExtractPropsType } from "utils/reduxUtils";
import { useEventCallback } from "utils/customHooks";
import {
  defaultSocketHost,
  defaultSocketPort,
  defaultInteropIP
} from "redux/reducers/settingsReducer";

const defaultGroundStationIP = defaultSocketHost + ":" + defaultSocketPort;
const competitionGroundStationIP = "192.168.1.10:" + defaultSocketPort;

const defaultMapCenter = {
  lat: 34.0689,
  lng: -118.4452
};

const mapOptions = {
  disableDefaultUI: true,
  disableDoubleClickZoom: true,
  scaleControl: true
};

const mapStateToProps = (state: AppState) => {
  return {
    settings: state.settings,
    interopData: state.mission.interopData,
    lostCommsMapCoord: selector(state).mission.googleMapInteropMission
      ?.lostCommsPos
  };
};

const mapDispatchToProps = {
  ...settingsActions,
  ...genericActions,
  ...externalActions
};

const connectComponent = connect(mapStateToProps, mapDispatchToProps);
type Props = ExtractPropsType<typeof connectComponent>;

const Settings = (props: Props) => {
  const [gndServerDropdown, setGndServerDropdown] = useState(false);
  const [interopDropdown, setInteropDropdown] = useState(false);
  // const [compLocDropdown, setCompLocDropdown] = useState(false);

  const toggleGndServerDropdown = () =>
    setGndServerDropdown(!gndServerDropdown);
  const toggleInteropDropdown = () => setInteropDropdown(!interopDropdown);
  // const toggleCompLocDropdown = () => setCompLocDropdown(!compLocDropdown);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.updateSettings({
      [event.target.name]: event.target.value
    });
  };

  const handleSelect = (event: MouseEvent<HTMLElement>) => {
    const name = event.currentTarget.id;
    props.updateSettings({
      [name]: (event.target as HTMLElement).innerText
    });
  };

  const connectToInterop = () => {
    props.connectToInterop(
      props.settings.interopIp,
      props.settings.interopUsername,
      props.settings.interopPassword,
      props.settings.interopMissionId
    );
  };

  const connectToGndServer = () => {
    props.connectToGndServer();
  };

  const configureTrackyPos = () => {
    props.configureTrackyPos(props.settings.antennaPos);
  };

  const configureUgvDest = () => {
    props.configureUgvDest(props.settings.antennaPos); // temporary, but convenient to use the same map
  };

  const handleClickedMap = useEventCallback((event: google.maps.MouseEvent) => {
    const pos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    if (props.settings.mapCapture === "off") {
      props.updateSettings({ antennaPos: pos });
    } else if (props.settings.mapCapture === "topLeftCorner") {
      props.updateSettings({ mapCaptureTopLeft: pos });
    } else if (props.settings.mapCapture === "bottomRightCorner") {
      props.updateSettings({ mapCaptureBottomRight: pos });
    }
  });

  const endMapCapture = () => {
    if (
      props.settings.mapCaptureTopLeft &&
      props.settings.mapCaptureBottomRight
    ) {
      props.updateSettings({
        mapCapture: "off",
        mapDownloadingInProgess: true
      });
      downloadMapImages(
        props.settings.mapCaptureTopLeft,
        props.settings.mapCaptureBottomRight,
        props.settings.mapCaptureMaxZoom,
        () => {
          props.updateSettings({
            mapDownloadingInProgess: false,
            mapCaptureTopLeft: undefined,
            mapCaptureBottomRight: undefined
          });
          alert("Done saving map images");
        }
      );
    }
  };

  const connectedGroundServer = props.settings.gndServerConnected
    ? props.settings.connectedGndServerIp
    : "NONE";
  const connectedInteropServer = props.interopData
    ? props.interopData.ip
    : "NONE";
  return (
    <Container className="Settings">
      <Row>
        <Col className="logo">
          <UasLogo />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputGroup>
            <InputGroupButtonDropdown
              addonType="prepend"
              isOpen={gndServerDropdown}
              toggle={toggleGndServerDropdown}
            >
              <DropdownToggle caret>Ground Server IP</DropdownToggle>
              <DropdownMenu id="gndServerIp" onClick={handleSelect}>
                <DropdownItem>{defaultGroundStationIP}</DropdownItem>
                <DropdownItem>{competitionGroundStationIP}</DropdownItem>
              </DropdownMenu>
            </InputGroupButtonDropdown>
            <Input
              value={props.settings.gndServerIp}
              name="gndServerIp"
              type="text"
              placeholder="0"
              onChange={handleChange}
            />
          </InputGroup>
        </Col>
        <Col>
          <Button
            color="primary"
            className="connect-btn"
            onClick={connectToGndServer}
          >
            Connect To Ground Server
          </Button>
        </Col>
        <Col className="connect-status">
          <span>
            Connected to <b>{connectedGroundServer}</b>
          </span>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              Interop Username
            </InputGroupAddon>
            <Input
              value={props.settings.interopUsername}
              name="interopUsername"
              type="text"
              placeholder="Enter username..."
              onChange={handleChange}
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              Interop Password
            </InputGroupAddon>
            <Input
              value={props.settings.interopPassword}
              name="interopPassword"
              type="password"
              placeholder="Enter password..."
              onChange={handleChange}
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroupAddon addonType="prepend">Mission ID</InputGroupAddon>
            <Input
              value={props.settings.interopMissionId}
              name="interopMissionId"
              type="text"
              placeholder="Provided by the judges"
              onChange={handleChange}
            />
          </InputGroup>
        </Col>
      </Row>
      {/* <br /> */}
      <Row>
        <Col>
          <InputGroup>
            <InputGroupButtonDropdown
              addonType="prepend"
              isOpen={interopDropdown}
              toggle={toggleInteropDropdown}
            >
              <DropdownToggle caret>Interop IP</DropdownToggle>
              <DropdownMenu id="interopIp" onClick={handleSelect}>
                <DropdownItem>{defaultInteropIP}</DropdownItem>
              </DropdownMenu>
            </InputGroupButtonDropdown>
            <Input
              value={props.settings.interopIp}
              name="interopIp"
              type="text"
              placeholder={props.settings.interopIp}
              onChange={handleChange}
            />
          </InputGroup>
        </Col>
        <br />
        <Col>
          <Button
            color="success"
            className="connect-btn"
            onClick={connectToInterop}
          >
            Connect To Interop
          </Button>
        </Col>
        <Col className="connect-status">
          <span>
            Connected to <b>{connectedInteropServer}</b>
          </span>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Button color="danger" onClick={props.resetReduxState}>
            [DANGER] Reset Redux State
          </Button>
        </Col>
        <Col>
          {!props.settings.mapDownloadingInProgess ? (
            props.settings.mapCapture === "off" ? (
              <InputGroup>
                <InputGroupAddon addonType="prepend">Max Zoom</InputGroupAddon>
                <Input
                  value={props.settings.mapCaptureMaxZoom}
                  type="number"
                  onChange={e =>
                    props.updateSettings({
                      mapCaptureMaxZoom: Number(e.target.value)
                    })
                  }
                />
                <InputGroupAddon addonType="append">
                  <Button
                    title={mapImagesFolder}
                    color="success"
                    onClick={() =>
                      props.updateSettings({ mapCapture: "topLeftCorner" })
                    }
                  >
                    Capture Map Images
                  </Button>
                </InputGroupAddon>{" "}
              </InputGroup>
            ) : props.settings.mapCapture === "topLeftCorner" ? (
              <Button
                color="primary"
                onClick={() =>
                  props.updateSettings({ mapCapture: "bottomRightCorner" })
                }
                disabled={!props.settings.mapCaptureTopLeft}
              >
                Select Top Left (Click When Done)
              </Button>
            ) : (
              <span>
                <Button
                  color="danger"
                  onClick={endMapCapture}
                  disabled={!props.settings.mapCaptureBottomRight}
                >
                  Select Bottom Right (Click When Done)
                </Button>
                <Button
                  color="secondary"
                  onClick={() =>
                    props.updateSettings({
                      mapCapture: "off",
                      mapCaptureTopLeft: undefined,
                      mapCaptureBottomRight: undefined
                    })
                  }
                >
                  Cancel
                </Button>
              </span>
            )
          ) : (
            <Button color="danger" disabled>
              Downloading in Progess
            </Button>
          )}
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <h2>File Browser</h2>
          <Input type="file" />
          <br />
        </Col>
        <br />
        <Col>
          <h2>Antenna Tracker Location:</h2>
          <p>
            {props.settings.antennaPos.lat}° , {props.settings.antennaPos.lng}°
          </p>
          <Button color="success" onClick={configureTrackyPos}>
            Send Position!
          </Button>
          <Button color="danger" onClick={configureUgvDest}>
            <b>UGV</b> Target!
          </Button>
          <div style={{ height: "350px", width: "500px" }}>
            <GoogleMap
              zoom={17}
              center={props.lostCommsMapCoord || defaultMapCenter}
              mapTypeId="customTiles"
              options={mapOptions}
              onDblClick={handleClickedMap}
            >
              <Marker position={props.settings.antennaPos} />
              {props.settings.mapCaptureTopLeft && (
                <Marker position={props.settings.mapCaptureTopLeft} />
              )}
              {props.settings.mapCaptureBottomRight && (
                <Marker position={props.settings.mapCaptureBottomRight} />
              )}
            </GoogleMap>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default connectComponent(Settings);
