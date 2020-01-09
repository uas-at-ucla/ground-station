import React from "react";
import "./Vision.css";
import Map from "./Map/Map";
import Tagging from "./Tagging/Tagging";
// import Pipeline from "./Pipeline/Pipeline";
// import { AppState } from "redux/store";
// import ImageCrop from './ImageCrop/ImageCrop';

const electronRequire = window.require; // could be window.require('electron').remote.require
const fs = electronRequire ? electronRequire("fs") : null;
console.log(
  "Test filesystem API",
  electronRequire ? fs.readdirSync("./") : "Electron not available"
); // list all files in directory

// const mapStateToProps = (state: AppState) => {
//   return { vision: state.vision };
// };

const Vision = () => {
  return (
    <div className="Vision">
      <div className="map-overlay">
        <Tagging />
      </div>
      {/* <div className="image-crop">
          <ImageCrop />
        </div> */}
      <Map />
    </div>
  );
};

export default Vision;
