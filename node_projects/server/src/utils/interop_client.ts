// See test.js for usage example

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import fs from "fs";
import config from "config";
import { AxiosInstance } from "axios";
import { DroneTelemetry, InteropOdlc } from "messages";
import { Telemetry, Mission } from "protobuf/interop/interop_api_pb";

const FEET_PER_METER = 3.28084;
const interopSendFrequency = 2; //Hz
const sendInterval = 1000 / interopSendFrequency;

export class InteropClient {
  axiosInstance: AxiosInstance;
  interopTelemetry: (Telemetry.AsObject & { sent?: boolean }) | null;
  telemetryCanUpload: boolean;
  intervalHandle: NodeJS.Timer | null;
  uploadSuccessCallback: () => void;
  uploadFailureCallback: () => void;

  constructor(
    axiosConfig: AxiosRequestConfig,
    loginResponse: AxiosResponse,
    uploadSuccessCallback: () => void,
    uploadFailureCallback: () => void
  ) {
    const sessionCookie = loginResponse.headers["set-cookie"][0];
    axiosConfig.headers = { Cookie: sessionCookie };
    this.axiosInstance = axios.create(axiosConfig);
    this.uploadSuccessCallback = uploadSuccessCallback;
    this.uploadFailureCallback = uploadFailureCallback;
    this.interopTelemetry = null;
    this.telemetryCanUpload = true;
    this.intervalHandle = null;
  }

  setUploadInterval() {
    return setInterval(() => {
      if (this.interopTelemetry) {
        if (!this.interopTelemetry.sent) {
          this.postTelemetry({ ...this.interopTelemetry })
            .then(() => {
              if (config.verbose) console.log("uploaded telemetry");
              if (!this.telemetryCanUpload) {
                this.telemetryCanUpload = true;
                console.log("Now able to upload telemetry :)");
                this.uploadSuccessCallback();
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
                this.uploadFailureCallback();
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
      .then(res => this.convertInteropMissionToProtobufJson(res.data))
      .catch(err => {
        throw err;
      });
  }

  postTelemetry(telemetry: Telemetry.AsObject) {
    return this.axiosInstance
      .post<never>("/telemetry", telemetry)
      .then(res => {
        /**/
      })
      .catch(err => {
        throw err;
      });
  }

  postObjectDetails(odlc: InteropOdlc) {
    return this.axiosInstance
      .post<InteropOdlc>("/odlcs", odlc)
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
      .post<string>("/odlcs/" + odlcId + "/image", image, config)
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  }

  newTelemetry(telemetry: DroneTelemetry) {
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

  convertInteropMissionToProtobufJson(
    interopJson: any
  ): Required<Mission.AsObject> {
    const convertedInteropData = Array.isArray(interopJson)
      ? [...interopJson]
      : { ...interopJson };
    for (const key in interopJson) {
      if (typeof interopJson[key] === "object") {
        convertedInteropData[key] = this.convertInteropMissionToProtobufJson(
          interopJson[key]
        );
      }
      if (Array.isArray(interopJson[key])) {
        convertedInteropData[`${key}List`] = convertedInteropData[key];
        delete convertedInteropData[key];
      }
    }
    return convertedInteropData;
  }
}

export default (
  ip: string,
  username: string,
  password: string,
  uploadSuccessCallback: () => void,
  uploadFailureCallback: () => void
) => {
  const axiosConfig = {
    baseURL: "http://" + ip + "/api/",
    timeout: 5000
  };

  return axios
    .post<string>(
      "/login",
      {
        username: username,
        password: password
      },
      axiosConfig
    )
    .then(response => {
      console.log("Logged in to interop");
      return new InteropClient(
        axiosConfig,
        response,
        uploadSuccessCallback,
        uploadFailureCallback
      );
    })
    .catch(error => {
      console.log("Failed to login to interop!");
      if (config.verbose) console.log(error);
      throw error;
    });
};
