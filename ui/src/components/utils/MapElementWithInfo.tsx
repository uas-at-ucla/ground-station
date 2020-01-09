import React, { ComponentClass, FunctionComponent } from "react";
import { InfoWindow } from "react-google-maps";

interface Props {
  isOpen: { [key: string]: boolean };
  toggleOpen: (id: string) => void;
  name: string;
  infoPosition?: any;
  Element: ComponentClass<any> | FunctionComponent<any>;
  [key: string]: any; //other props for the map element
}

const MapElementWithInfo = (props: Props) => {
  const toggleOpen = () => {
    props.toggleOpen(props.name);
  };

  const info = props.isOpen[props.name] ? (
    <InfoWindow onCloseClick={toggleOpen} position={props.infoPosition}>
      <div className="map-infobox">{props.children}</div>
    </InfoWindow>
  ) : null;

  return (
    <span>
      <props.Element {...props} onClick={toggleOpen}>
        {!props.infoPosition ? info : null}
      </props.Element>
      {props.infoPosition ? info : null}
    </span>
  );
};

export default MapElementWithInfo;
