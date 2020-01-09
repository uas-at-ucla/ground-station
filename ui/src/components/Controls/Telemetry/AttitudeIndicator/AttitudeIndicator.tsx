import React, { useRef } from "react";
import "./AttitudeIndicator.css";
import NavballImg from "./navball.png";
import PositionRef from "./navball_pos_ref.svg";
import * as THREE from "three";

/*
More navball skins:
https://forum.kerbalspaceprogram.com/index.php?/topic/164158-13-navballtexturechanger-v16-8717/&do=findComment&comment=3142105
*/

const sphereRadius = 1;
const cameraDistance = 8;
const fov = ((Math.asin(sphereRadius / cameraDistance) * 180) / Math.PI) * 2;

const MARGIN = 5; // from CSS
const WIDTH = 200 - MARGIN * 2;
const HEIGHT = WIDTH;

interface Props {
  data: {
    roll: number;
    pitch: number;
    yaw: number;
  };
}

const Navball = (props: Props) => {
  const scene = useRef(new THREE.Scene()).current;

  const camera = useRef(
    new THREE.PerspectiveCamera(
      fov,
      1,
      cameraDistance - sphereRadius,
      cameraDistance + sphereRadius
    )
  ).current;

  const renderer = useRef(
    new THREE.WebGLRenderer({ antialias: true, alpha: true })
  ).current;

  const ballContainer = useRef(new THREE.Object3D()).current;

  const navballDidMount = (navball: HTMLElement | null) => {
    scene.add(camera);
    camera.position.set(cameraDistance, 0, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    renderer.setSize(WIDTH, HEIGHT);
    navball && navball.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(light);

    const sphereGeom = new THREE.SphereGeometry(sphereRadius, 48, 32);
    const texture = new THREE.TextureLoader().load(NavballImg);
    texture.offset.x = 1 / 4; // 0 radians yaw is East
    texture.wrapS = THREE.RepeatWrapping;
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const ball = new THREE.Mesh(sphereGeom, material);
    ball.position.set(0, 0, 0);
    ball.rotation.x = Math.PI / 2;
    ballContainer.add(ball);
    ballContainer.position.copy(ball.position);
    scene.add(ballContainer);

    updateRotation();
    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(animate); // Doesn't work on the first animation frame, but always ready by the third animation frame.
        });
      });
    }, 0);
  };

  const updateRotation = () => {
    ballContainer.rotation.x = props.data["roll"];
    ballContainer.rotation.y = props.data["pitch"];
    ballContainer.rotation.z = props.data["yaw"];
  };

  const animate = () => {
    renderer.render(scene, camera);
    // console.log("rendering");
  };

  updateRotation();
  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 0);

  return (
    <div className="AttitudeIndicator">
      <div className="navball-background"></div>
      <div className="navball" ref={navballDidMount}></div>
      <div className="position-ref-container">
        <img className="position-ref" src={PositionRef} alt="" />
      </div>
    </div>
  );
};

export default Navball;
