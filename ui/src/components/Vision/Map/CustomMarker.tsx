import React, { Component } from "react";
import { Marker, InfoWindow } from "react-google-maps";
import Map from "./Map";

interface Props {
  marker: Map["state"]["markers"][number];
}

class CustomMarker extends Component<Props> {
  state = {
    isOpen: false
  };

  open() {
    this.setState({
      isOpen: true
    });
  }

  close() {
    this.setState({
      isOpen: false
    });
  }

  render() {
    console.log("creating marker");
    const pos = {
      lat: this.props.marker.position.lat,
      lng: this.props.marker.position.lng
    };
    console.log(pos);
    return (
      <div>
        <Marker
          key={this.props.marker.markerI}
          position={pos}
          onClick={() => this.open()}
        >
          {this.state.isOpen && (
            <InfoWindow onCloseClick={() => this.close()}>
              <p>{this.props.marker.data}</p>
            </InfoWindow>
          )}
        </Marker>
      </div>
    );
  }
}

export default CustomMarker;
