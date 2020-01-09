import React, { useState } from "react";
import { Marker, InfoWindow } from "react-google-maps";

interface Props {
  marker: {
    position: {
      lat: number;
      lng: number;
    };
    markerI: number;
    data: string;
  };
}

const CustomMarker = (props: Props) => {
  const [isOpen, setOpen] = useState(false);

  const open = () => setOpen(true);

  const close = () => setOpen(false);

  // console.log("creating marker");
  const pos = {
    lat: props.marker.position.lat,
    lng: props.marker.position.lng
  };
  // console.log(pos);
  return (
    <div>
      <Marker key={props.marker.markerI} position={pos} onClick={() => open()}>
        {isOpen && (
          <InfoWindow onCloseClick={() => close()}>
            <p>{props.marker.data}</p>
          </InfoWindow>
        )}
      </Marker>
    </div>
  );
};

export default CustomMarker;
