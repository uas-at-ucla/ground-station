const offlineMaps = true;

if (offlineMaps) {
  require("google_maps_js_api");
}

const googleMapsApiURL =
  "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,visualization&key=AIzaSyBI-Gz_lh3-rKXFwlpElD7pInA60U-iK0c";

const google = {} as GoogleMapsLoader.google;

export function loadGoogleMapsApi(callback: () => void) {
  if (window.google) {
    google.maps = window.google.maps;
    callback();
  } else {
    const script = document.createElement("script");
    script.src = googleMapsApiURL;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        google.maps = window.google.maps;
        if (callback) callback();
      } else {
        throw Error("Google Maps API didn't load correctly");
      }
    };
  }
}

export default google;
