import React, { useEffect, useRef, useMemo } from "react";
import { withGoogleMap, GoogleMap } from "react-google-maps";
import axios from "axios";

import "./GoogleMap.css";
import google from "./google";
import { userDataPath, fs, path } from "utils/electronUtils";

// TODO: Google updates this from time to time. Use Chrome Dev Tools "Network" tab to find the number used for image urls in the satellite map here: https://developers.google.com/maps/documentation/javascript/maptypes
const imageUrlV = "862";

const mapImagesFolder = path.join(userDataPath, "mapImages");
const TILE_SIZE = 256;

function getLocalImagePath(x: number, y: number, zoom: number) {
  return `${mapImagesFolder}/${zoom}/mag-${zoom}_x-${x}_y-${y}.jpg`;
}

function getGoogleImageUrl(x: number, y: number, zoom: number) {
  return `https://khms0.googleapis.com/kh?v=${imageUrlV}&hl=en-US&x=${x}&y=${y}&z=${zoom}`;
}

function getCustomTilesMapType() {
  return new google.maps.ImageMapType({
    getTileUrl: (coord, zoom) => {
      const imagePath = getLocalImagePath(coord.x, coord.y, zoom);
      if (fs.existsSync(imagePath)) {
        return "file://" + imagePath;
      }
      return getGoogleImageUrl(coord.x, coord.y, zoom);
    },
    tileSize: new google.maps.Size(TILE_SIZE, TILE_SIZE),
    maxZoom: 20
  });
}

const GoogleMapWrapperComponent = (props: GoogleMap["props"]) => {
  const mapComponent = useRef<GoogleMap | null>(null);

  // pan smoothly when map center changes
  useEffect(() => {
    if (mapComponent.current) {
      if (props.center) {
        mapComponent.current.panTo(props.center);
      }
    }
  }, [props.center]);

  const setMapType = (component: GoogleMap) => {
    if (component) {
      mapComponent.current = component;
      // google = window.google;
      const customTilesMapType = getCustomTilesMapType();
      const map =
        component.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED; // lol don't worry
      map.mapTypes.set("customTiles", customTilesMapType);
      // map.setMapTypeId('customTiles');
    }
  };

  const GoogleMapComponent = useMemo(
    () => withGoogleMap(props => <GoogleMap {...props} ref={setMapType} />),
    []
  );

  return (
    <GoogleMapComponent
      containerElement={<div style={{ height: `100%` }} />}
      mapElement={<div style={{ height: `100%` }} />}
      {...props}
    />
  );
};

export default GoogleMapWrapperComponent;

// Functions for downloading map images:

const MIN_ZOOM = 0;

// Code for calculating tile coordinates from https://developers-dot-devsite-v2-prod.appspot.com/maps/documentation/javascript/examples/map-coordinates
function project(latLng: google.maps.LatLngLiteral) {
  let siny = Math.sin((latLng.lat * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}

function getTileCoords(latLng: google.maps.LatLngLiteral, zoom: number) {
  const scale = 1 << zoom;
  const worldCoordinate = project(latLng);
  return {
    x: Math.floor((worldCoordinate.x * scale) / TILE_SIZE),
    y: Math.floor((worldCoordinate.y * scale) / TILE_SIZE)
  };
}

export function downloadMapImages(
  topLeft: google.maps.LatLngLiteral,
  bottomRight: google.maps.LatLngLiteral,
  maxZoom: number,
  callback: () => void
) {
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath);
  }
  if (!fs.existsSync(mapImagesFolder)) {
    fs.mkdirSync(mapImagesFolder);
  }

  const zoomFolder = path.join(mapImagesFolder, MIN_ZOOM.toString());
  if (!fs.existsSync(zoomFolder)) {
    fs.mkdirSync(zoomFolder);
  }
  const topLeftCoords = getTileCoords(topLeft, MIN_ZOOM);
  const bottomRightCoords = getTileCoords(bottomRight, MIN_ZOOM);
  saveImages(
    topLeft,
    bottomRight,
    maxZoom,
    topLeftCoords.x,
    topLeftCoords.y,
    MIN_ZOOM,
    topLeftCoords.y,
    bottomRightCoords.x,
    bottomRightCoords.y,
    callback
  );
}

function saveImages(
  topLeft: google.maps.LatLngLiteral,
  bottomRight: google.maps.LatLngLiteral,
  maxZoom: number,
  x: number,
  y: number,
  zoom: number,
  top: number,
  right: number,
  bottom: number,
  callback: () => void
) {
  console.log(getLocalImagePath(x, y, zoom));
  const file = fs.createWriteStream(getLocalImagePath(x, y, zoom));

  axios({
    url: getGoogleImageUrl(x, y, zoom),
    responseType: "arraybuffer"
  }).then(response => {
    file.end(new Buffer(response.data));
    let error = false;
    file.on("error", () => {
      error = true;
      throw new Error("Error saving image");
    });
    file.on("close", () => {
      if (error) {
        return;
      }
      y++;
      if (y > bottom) {
        y = top;
        x++;
        if (x > right) {
          zoom++;
          if (zoom > maxZoom) {
            // store.dispatch(updateSettings({ mapDownloadingInProgess: false }));
            // alert("Done saving map images");
            callback();
            return;
          }
          const zoomFolder = path.join(mapImagesFolder, zoom.toString());
          if (!fs.existsSync(zoomFolder)) {
            fs.mkdirSync(zoomFolder);
          }
          const topLeftCoords = getTileCoords(topLeft, zoom);
          const bottomRightCoords = getTileCoords(bottomRight, zoom);
          x = topLeftCoords.x;
          y = topLeftCoords.y;
          top = topLeftCoords.y;
          right = bottomRightCoords.x;
          bottom = bottomRightCoords.y;
        }
      }
      saveImages(
        topLeft,
        bottomRight,
        maxZoom,
        x,
        y,
        zoom,
        top,
        right,
        bottom,
        callback
      );
    });
  });
}
