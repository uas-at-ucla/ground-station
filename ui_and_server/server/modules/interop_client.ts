// See test.js for usage example

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import fs from "fs";
import config from "../config";
import { Namespace } from "socket.io";
import { AxiosInstance } from "axios";

const FEET_PER_METER = 3.28084;
const interopSendFrequency = 2; //Hz
const sendInterval = 1000 / interopSendFrequency;

export class InteropClient {
  axiosInstance: AxiosInstance;
  ui_io: Namespace;
  interopTelemetry: any;
  telemetryCanUpload: boolean;
  intervalHandle: NodeJS.Timer | null;

  constructor(
    axiosConfig: AxiosRequestConfig,
    loginResponse: AxiosResponse,
    ui_io: Namespace
  ) {
    const sessionCookie = loginResponse.headers["set-cookie"][0];
    axiosConfig.headers = { Cookie: sessionCookie };
    this.axiosInstance = axios.create(axiosConfig);
    this.ui_io = ui_io;
    this.interopTelemetry = null;
    this.telemetryCanUpload = true;
    this.intervalHandle = null;
  }

  setUploadInterval() {
    return setInterval(() => {
      if (this.interopTelemetry) {
        if (!this.interopTelemetry.sent) {
          this.postTelemetry({ ...this.interopTelemetry })
            .then(msg => {
              if (config.verbose) console.log(msg);
              if (!this.telemetryCanUpload) {
                this.telemetryCanUpload = true;
                console.log("Now able to upload telemetry :)");
                this.ui_io.emit("INTEROP_UPLOAD_SUCCESS");
              }
            })
            .catch(error => {
              if (config.verbose) console.log(error);
              if (this.telemetryCanUpload) {
                this.telemetryCanUpload = false;
                console.log("Failing to upload telemetry!");
                if (error.response) {
                  console.log("    Response status " + error.response.status);
                } else if (error.request) {
                  console.log("    No response received");
                } else {
                  console.log("    Could not make request");
                }
                this.ui_io.emit("INTEROP_UPLOAD_FAIL");
              }
            });
          this.interopTelemetry.sent = true;
        } else {
          console.log("No new telemetry to send to interop.");
          if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = null;
          }
          this.interopTelemetry = null;
        }
      }
    }, sendInterval);
  }

  getMission(id: number) {
    return this.axiosInstance
      .get("/missions/" + id)
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  }

  postTelemetry(telemetry: any) {
    return this.axiosInstance
      .post("/telemetry", telemetry)
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  }

  postObjectDetails(odlc: any) {
    return this.axiosInstance
      .post("/odlcs", odlc)
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  }

  postObjectImage(imagePath: string, odlcId: number) {
    const image = fs.readFileSync(imagePath);
    const config = {
      headers: { "Content-Type": "image/jpeg" }
    };
    return this.axiosInstance
      .post("/odlcs/" + odlcId + "/image", image, config)
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  }

  newTelemetry(telemetry: any) {
    if (telemetry.sensors) {
      this.interopTelemetry = {
        latitude: telemetry.sensors.latitude,
        longitude: telemetry.sensors.longitude,
        altitude: telemetry.sensors.altitude * FEET_PER_METER,
        heading: telemetry.sensors.heading
      };
      if (!this.intervalHandle) {
        console.log("Got new telemetry");
        this.intervalHandle = this.setUploadInterval();
      }
    }
  }
}

export default (
  ip: string,
  username: string,
  password: string,
  ui_io: Namespace
) => {
  const axiosConfig = {
    baseURL: "http://" + ip + "/api/",
    timeout: 5000
  };

  return axios
    .post(
      "/login",
      {
        username: username,
        password: password
      },
      axiosConfig
    )
    .then(response => {
      console.log("Logged in to interop");
      return new InteropClient(axiosConfig, response, ui_io);
    })
    .catch(error => {
      console.log("Failed to login to interop!");
      if (config.verbose) console.log(error);
      throw error;
    });
};
