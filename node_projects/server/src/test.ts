// Run this file with `node test.js testName` or `npm test testName`
import loadInteropClient from "utils/interop_client";
import { Odlc } from "../../protobuf/interop/interop_api_pb";

const tests = {
  interop: () => {
    loadInteropClient(
      "134.209.2.203:8000",
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
            const testOdlc: Odlc.AsObject = {
              mission: 1,
              type: 1, // TODO convert enum "STANDARD"
              latitude: 38.1478,
              longitude: -76.4275,
              orientation: 1, // "N", TODO convert enum "STANDARD"
              shape: 1, //"RECTANGLE" TODO onvert enum
              shapeColor: 1, //"RED", TODO onvert enum
              alphanumeric: "C",
              alphanumericColor: 1, //"WHITE", TODO onvert enum
              autonomous: false
            };

            interopClient
              .postObjectDetails(testOdlc)
              .then(odlc => {
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
                      .then(message => {
                        console.log(message);
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
