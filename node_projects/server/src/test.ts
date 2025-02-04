// Run this file with `node test.js testName` or `npm test testName`
import config from "config";
import loadInteropClient from "utils/interop_client";
import { InteropOdlc } from "messages";

const tests = {
  interop: () => {
    loadInteropClient(
      config.interopTestIp,
      "testuser",
      "testpass",
      () => {
        /**/
      },
      () => {
        /**/
      }
    )
      .then(interopClient => {
        interopClient
          .getMission(2)
          .then(missions => {
            console.log(JSON.stringify(missions, null, 2));
            console.log();

            // Object Detection, Classification, and Localization
            const testOdlc: InteropOdlc = {
              mission: 1,
              type: "STANDARD",
              latitude: 38.1478,
              longitude: -76.4275,
              orientation: "N",
              shape: "RECTANGLE",
              shapeColor: "RED",
              alphanumeric: "C",
              alphanumericColor: "WHITE",
              autonomous: false
            };

            interopClient
              .postObjectDetails(testOdlc)
              .then(odlc => {
                if (!odlc.id) {
                  throw new Error("Response Odlc contained no ID");
                }

                console.log("Submitted ODLC with id " + odlc.id);
                console.log();

                interopClient
                  .postObjectImage("./odlc.jpg", odlc.id)
                  .then(msg => {
                    console.log(msg);

                    interopClient
                      .postTelemetry({
                        latitude: 38.149,
                        longitude: -76.432,
                        altitude: 100,
                        heading: 90
                      })
                      .then(() => {
                        console.log("Uploaded telemetry");
                        console.log("Test complete");
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  })
                  .catch(error => {
                    console.log(error);
                  });
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const testName = process.argv[2];
if (testName in tests) {
  tests[testName as keyof typeof tests]();
} else {
  console.log("Availble tests: " + Object.keys(tests));
}
