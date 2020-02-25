import React, {
  ComponentClass,
  FunctionComponent,
  ReactNode,
  useCallback,
  useRef
} from "react";
import { InfoWindow } from "@react-google-maps/api";

type Props<T> = {
  isOpen: boolean;
  id: string;
  toggleOpen: (id: string) => void;
  infoPosition?: google.maps.LatLngLiteral;
  Element: ComponentClass<T> | FunctionComponent<T>;
  children: ReactNode;
} & T;

function MapElementWithInfo<T>(props: Props<T>) {
  const toggleOpenId = props.toggleOpen;
  const toggleOpen = useCallback(() => toggleOpenId(props.id), [
    props.id,
    toggleOpenId
  ]);

  const mapElement = useRef<google.maps.MVCObject>();
  const mapElementLoad = (element: google.maps.MVCObject) => {
    mapElement.current = element;
  };

  const info = props.isOpen ? (
    <InfoWindow
      onCloseClick={toggleOpen}
      position={props.infoPosition}
      anchor={mapElement.current}
    >
      <div className="map-infobox">{props.children}</div>
    </InfoWindow>
  ) : null;

  return (
    <span>
      <props.Element {...props} onClick={toggleOpen} onLoad={mapElementLoad}>
        {!props.infoPosition ? info : null}
      </props.Element>
      {props.infoPosition ? info : null}
    </span>
  );
}

export default MapElementWithInfo;
