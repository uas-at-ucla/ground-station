import React, { MouseEvent, ChangeEvent, FormEvent, useState } from "react";
import Select from "react-select";
import "./Tagging.css";
import ReactCrop, { Location, Area } from "react-easy-crop";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import pathImport from "path";
import fsImport from "fs";
import { ExtractPropsType } from "utils/reduxUtils";
const path: typeof pathImport = window.require("path");
const fs: typeof fsImport = window.require("fs");
const imageClipper = require("image-clipper"); // Use require when no TypeScript support

const ListItem = (props: {
  value: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}) => <li onClick={props.onClick}>{props.value}</li>;

const List = (props: {
  items: string[];
  onItemClick: (event: MouseEvent<HTMLElement>) => void;
}) =>
  props.items != null ? (
    <ul>
      {props.items.map((item: string, i) => (
        <ListItem key={i} value={item} onClick={props.onItemClick} />
      ))}
    </ul>
  ) : null;

const appPath = window.require("electron").remote.app.getAppPath();
const imagePath = path
  .join(appPath, "electron/files/testImages")
  .replace("app.asar", "app.asar.unpacked");
const images: string[] = fs.readdirSync(imagePath);

const initialAnnValues = {
  shape: "",
  shapeCol: "",
  letter: "",
  letterCol: "",
  orient: ""
};

const connectComponent = connect();
type Props = ExtractPropsType<typeof connectComponent>;

const Tagging = (props: Props) => {
  const [state, setState] = useState({
    formValues: initialAnnValues,
    annValues: initialAnnValues,
    selectedImage: "" /*testImage*/,
    // croppedImage: null,
    crop: {
      x: 130,
      y: 50,
      width: 0,
      height: 0
    },
    zoom: 1,
    aspect: 1 / 1,
    displayCropper: false,
    croppedAreaPixels: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, //result from image crop
    imageList: images,
    imagePath: "",
    croppedImagePath: "",
    imageName: ""
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const name = event.target.name as keyof typeof initialAnnValues;
    const value = event.target.value;
    const formValues = state.formValues;
    formValues[name] = value;
    // console.log("click value: ", value);
    setState({
      ...state,
      formValues //, curValues
    });
  };

  const handleSelectChange = (
    name: keyof typeof initialAnnValues,
    selectedOption: typeof shapeOptions[number]
  ) => {
    const value = selectedOption && selectedOption.value;
    const formValues = state.formValues;
    formValues[name] = value;
    console.log(name + ` selected:`, value);
    setState({
      ...state,
      formValues //, curValues
    });
  };

  const handleRestore = () => {
    setState({
      ...state,
      // croppedImage: null,
      crop: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      zoom: 1
    });
  };

  const handleCropComplete = () => {
    const crop: Area = state.croppedAreaPixels;
    console.log("cropping...");
    // let croppedImg = getCroppedImg(refImageCrop, crop);
    // console.log("width", croppedImg.width);
    imageClipper(state.selectedImage, function(this: any) {
      this.crop(crop.x, crop.y, crop.width, crop.height).toDataURL(
        (dataURL: string) => {
          const base64Data = dataURL.split(";base64,").pop();
          const extension = path
            .extname(state.imagePath)
            .split(".")
            .pop();
          const croppedImagePath =
            state.imagePath
              .split(".")
              .slice(0, -1)
              .join(".") +
            "_cropped." +
            extension;
          fs.writeFile(
            croppedImagePath,
            base64Data,
            { encoding: "base64" },
            err => {
              if (err) {
                console.log(err);
              } else {
                console.log("Saved cropped image", croppedImagePath);
                setState({ ...state, croppedImagePath: croppedImagePath });
              }
            }
          );
        }
      );
    });
    // setState({...state, displayImage: croppedImg, croppedImage: croppedImg })
  };

  // const onImageLoaded = (image) => {
  //   setState({...state,
  //     crop: makeAspectCrop({
  //       x: 0,
  //       y: 0,
  //       // aspect: 10 / 4,
  //       // width: 50,
  //     }, image.naturalWidth / image.naturalHeight),
  //     image,
  //   });
  // }

  const handleOpen = () => {
    // console.log("image cropper opened");
    const displayCropper = !state.displayCropper;
    // let displayImage = state.selectedImage;
    setState({ ...state, displayCropper: displayCropper });
    // setState({...state, displayImage: displayImage });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formValues = state.formValues;
    const annValues = state.annValues;

    let key: keyof typeof formValues;
    for (key in formValues) {
      if (formValues[key] !== "") {
        annValues[key] = formValues[key];
        formValues[key] = "";
      }
    }

    setState({ ...state, annValues, formValues });
  };

  const handleInteropSubmit = () => {
    props.dispatch({
      type: "TRANSMIT",
      payload: {
        msg: "UPLOAD_IMAGE",
        data: {
          ...state.annValues,
          imageFile: state.croppedImagePath
        } // TODO get selected latitude & longitude
      }
    });
  };

  const onCropChange = (crop: Location) => {
    setState({ ...state, crop: { ...state.crop, ...crop } });
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setState({ ...state, croppedAreaPixels: croppedAreaPixels });
    console.log("croppedAreaPixels", croppedAreaPixels);
    // setState({...state, crop: croppedArea});
  };

  const onZoomChange = (zoom: number) => {
    setState({ ...state, zoom });
  };

  const handleListClick = (e: MouseEvent<HTMLElement>) => {
    const imageName = e.currentTarget.innerHTML;
    const imageP = path.join(imagePath, imageName);
    fs.readFile(imageP, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const extensionName = path
        .extname(imageP)
        .split(".")
        .pop();
      const base64Image = data.toString("base64");
      const imgSrcString = `data:image/${extensionName};base64,${base64Image}`;
      setState({
        ...state,
        selectedImage: imgSrcString,
        croppedImagePath: "",
        // displayImage: imgSrcString,
        imagePath: imageP,
        imageName: imageName,
        annValues: { ...state.annValues }
      });
    });
  };

  return (
    <div className="Annotations">
      <h1>Annotations</h1>
      <form id="Annotate" onSubmit={handleSubmit}>
        <div className="Shape">
          <label className="dualField">
            {" "}
            <span className="fieldVal">Shape: </span>{" "}
            <span className="curVal">{state.annValues["shape"]}</span>
            <br />
            <Select
              name="shape"
              isSearchable={true}
              placeholder="Shape"
              onChange={(option: any) => handleSelectChange("shape", option)}
              options={shapeOptions}
              styles={selectStyles}
            />
          </label>
          <label className="dualField">
            {" "}
            <span className="fieldVal">Color: </span>{" "}
            <span className="curVal">{state.annValues["shapeCol"]}</span>
            <br />
            <Select
              name="shapeCol"
              isSearchable={true}
              placeholder="Shape Color"
              onChange={(option: any) => handleSelectChange("shapeCol", option)}
              options={colorOptions}
              styles={selectStyles}
            />
          </label>
        </div>

        <div className="Letter">
          <label className="dualField">
            {" "}
            <span className="fieldVal">Letter: </span>{" "}
            <span className="curVal">{state.annValues["letter"]}</span>
            <br />
            <input
              type="text"
              name="letter"
              placeholder="Letter"
              value={state.formValues["letter"]}
              onChange={handleChange}
            />
          </label>
          <label className="dualField">
            {" "}
            <span className="fieldVal">Color: </span>{" "}
            <span className="curVal">{state.annValues["letterCol"]}</span>
            <br />
            <Select
              name="letterCol"
              isSearchable={true}
              placeholder="Letter Color"
              onChange={(option: any) =>
                handleSelectChange("letterCol", option)
              }
              options={colorOptions}
              styles={selectStyles}
            />
          </label>
        </div>

        <div className="Orient">
          <label className="singField">
            {" "}
            <span className="fieldVal">Orientation (N, NE, etc.): </span>{" "}
            <span className="curVal">{state.annValues["orient"]}</span>
            <br />
            <input
              type="text"
              name="orient"
              placeholder="Orientation"
              value={state.formValues["orient"]}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="saveButton">
          <input
            // options={colorOptions}
            // styles={selectStyles}
            // me="btn btn-primary"
            type="submit"
            value="Save"
          />
          {state.displayCropper && state.selectedImage !== "" ? (
            <div>
              <Button color="primary" onClick={handleRestore}>
                Restore
              </Button>
              <Button
                color="primary"
                keyboardFocused={true}
                onClick={handleCropComplete}
              >
                Crop
              </Button>
              <Button
                color="success"
                keyboardFocused={true}
                onClick={handleInteropSubmit}
                disabled={state.croppedImagePath === ""}
              >
                {state.croppedImagePath !== ""
                  ? "Submit to Interop"
                  : "Waiting for Crop"}
              </Button>
            </div>
          ) : null}
        </div>
      </form>

      <div className="imageList">
        <div className="scroller">
          <div>Selected: {state.imageName}</div>
          <List items={state.imageList} onItemClick={handleListClick} />
        </div>
      </div>

      <div className="imageButton">
        <Button color="primary" onClick={handleOpen}>
          {state.selectedImage !== ""
            ? "Toggle image cropper"
            : "Select an image first"}
        </Button>
        {state.displayCropper && state.selectedImage !== "" ? (
          <div className="imageCrop">
            <ReactCrop
              image={state.selectedImage}
              crop={state.crop}
              zoom={state.zoom}
              aspect={state.aspect}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
              maxZoom={1000}
              zoomSpeed={2}
            />
          </div>
        ) : null}
        <img
          src={state.selectedImage}
          style={{ display: "none" }}
          // ref={img => {
          //   refImageCrop = img;
          // }}
          alt=""
        />
        {/* <img src={state.croppedImage} alt="" /> */}
      </div>
    </div>
  );
};

const shapeOptions = [
  { label: "Circle", value: "CIRCLE" },
  { label: "SemiCircle", value: "SEMICIRCLE" },
  { label: "QuarterCircle", value: "QUARTER_CIRCLE" },
  { label: "Triangle", value: "TRIANGLE" },
  { label: "Square", value: "SQUARE" },
  { label: "Rectangle", value: "RECTANGLE" },
  { label: "Trapezoid", value: "TRAPEZOID" },
  { label: "Pentagon", value: "PENTAGON" },
  { label: "Hexagon", value: "HEXAGON" },
  { label: "Heptagon", value: "HEPTAGON" },
  { label: "Octagon", value: "OCTAGON" },
  { label: "Star", value: "STAR" },
  { label: "Cross", value: "CROSS" }
];

const colorOptions = [
  { label: "white", value: "WHITE" },
  { label: "black", value: "BLACK" },
  { label: "gray", value: "GRAY" },
  { label: "red", value: "RED" },
  { label: "blue", value: "BLUE" },
  { label: "green", value: "GREEN" },
  { label: "yellow", value: "YELLOW" },
  { label: "purple", value: "PURPLE" },
  { label: "brown", value: "BROWN" },
  { label: "orange", value: "ORANGE" }
];

const selectStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: "white",
    height: 20
  }),
  option: (
    styles: any,
    {
      data,
      isDisabled,
      isFocused,
      isSelected
    }: {
      data: any;
      isDisabled: boolean;
      isFocused: boolean;
      isSelected: boolean;
    }
  ) => {
    // const color = chroma(data.color);
    return {
      ...styles,
      //color of options' background: gray
      backgroundColor: isDisabled ? "red" : "#7e7e7e",
      color: "#FFF",
      cursor: isDisabled ? "not-allowed" : "default"
    };
  },
  //menu list height
  menuList: (styles: any) => ({ ...styles, height: 200 })
};

export default connectComponent(Tagging);
