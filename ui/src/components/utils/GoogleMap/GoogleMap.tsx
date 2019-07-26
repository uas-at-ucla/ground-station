import React, { Component } from "react";
import { withGoogleMap, GoogleMap } from "react-google-maps";

import "./GoogleMap.css";
import downloadToBrowser from "utils/downloadToBrowser";
import google, { getLocalImageUrl } from "./google";

// TODO: Google updates this from time to time. Use Chrome Dev Tools to find the number used for image urls in the satellite map here: https://developers.google.com/maps/documentation/javascript/maptypes
const imageUrlV = "849";

function getCustomTilesMapType() {
  return new google.maps.ImageMapType({
    getTileUrl: (coord, zoom) => {
      let url = "";
      try {
        url = getLocalImageUrl(coord, zoom);
        if (!url || url === "") {
          throw new Error();
        }
      } catch (e) {
        url = `https://khms0.googleapis.com/kh?v=${imageUrlV}&hl=en-US&x=${coord.x}&y=${coord.y}&z=${zoom}`;
      }

      // UNCOMMENT TO TEST:
      // tileLoaded(coord, zoom);

      return url;
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 20
  });
}

class GoogleMapWrapperComponent extends Component<GoogleMap["props"]> {
  private setMapType = (mapComponent: GoogleMap) => {
    if (mapComponent) {
      // google = window.google;
      let customTilesMapType = getCustomTilesMapType();
      let map =
        mapComponent.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED; // lol don't worry
      map.mapTypes.set("customTiles", customTilesMapType);
      // map.setMapTypeId('customTiles');

      // pan smoothly when map center changes
      this.componentDidUpdate = prevProps => {
        if (prevProps.center !== this.props.center && this.props.center) {
          mapComponent.panTo(this.props.center);
        }
      };

      // UNCOMMENT TO TEST:
      // downloadTileListOnClick(map);
    }
  };

  private GoogleMapComponent = withGoogleMap(props => (
    <GoogleMap {...props} ref={this.setMapType} />
  ));

  public render() {
    return (
      <this.GoogleMapComponent
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        {...this.props}
      />
    );
  }
}

export default GoogleMapWrapperComponent;

// For testing only:
// Explanation: To use, uncomment the two "UNCOMMENT TO TEST" comments above.
// When the the map is clicked, the position and URL of all google map tiles that were downloaded since the app started will be saved to tileUrls.json.
// You would use this by panning around an area at ALL zoom levels you want, then clicking the map to save the URLs for the tiles in that area.
// For example, you could record all the tiles for a certain airfield. Then use ground-station/tools/googleMapsDownloader.py to actually download the images.
// Finally, you would update https://github.com/uas-at-ucla/google_maps_js_api with the new images.
var tileBounds: {
  [key: number]: { left: number; right: number; top: number; bottom: number };
} = {};
function tileLoaded(coord: { x: number; y: number }, zoom: number) {
  if (!tileBounds[zoom]) {
    tileBounds[zoom] = {
      left: Infinity,
      right: -Infinity,
      top: Infinity,
      bottom: -Infinity
    };
  }
  if (coord.x < tileBounds[zoom].left) {
    tileBounds[zoom].left = coord.x;
  }
  if (coord.x > tileBounds[zoom].right) {
    tileBounds[zoom].right = coord.x;
  }
  if (coord.y < tileBounds[zoom].top) {
    tileBounds[zoom].top = coord.y;
  }
  if (coord.y > tileBounds[zoom].bottom) {
    tileBounds[zoom].bottom = coord.y;
  }
}
function downloadTileListOnClick(map: any) {
  map.addListener("click", () => {
    let tileUrls: {
      [key: number]: {
        x: number;
        y: number;
        url: string;
      }[];
    } = {};
    for (let zoom in tileBounds) {
      tileUrls[zoom] = [];
      for (let x = tileBounds[zoom].left; x <= tileBounds[zoom].right; x++) {
        for (let y = tileBounds[zoom].top; y <= tileBounds[zoom].bottom; y++) {
          tileUrls[zoom].push({
            x: x,
            y: y,
            url: `https://khms0.googleapis.com/kh?v=${imageUrlV}&hl=en-US&x=${x}&y=${y}&z=${zoom}`
          });
        }
      }
    }
    downloadToBrowser("tileUrls.json", JSON.stringify(tileUrls));
  });
}
