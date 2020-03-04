import config from "config";
import { socketEvents, data } from "server";
import internalEvents from "internalEvents";
import loadInteropClient, { InteropClient } from "utils/interop_client";

let interopClient: InteropClient | null = null;
if (config.testing) {
  // try our test server
  connectToInterop("167.71.120.140:8000", "testuser", "testpass", 1).catch(
    error => {
      console.log(error);
      //   if (inDockerContainer) {
      //     connectToInterop("192.168.3.30:80", "testuser", "testpass", 2);
      //   } else {
      // connectToInterop("localhost:8000", "testuser", "testpass", 2);
      //   }
    }
  );
}

socketEvents.on("CONNECT_TO_INTEROP", cred => {
  console.log("CONNECT TO INTEROP");
  connectToInterop(cred.ip, cred.username, cred.password, cred.missionId);
});

function connectToInterop(
  ip: string,
  username: string,
  password: string,
  missionId: number
) {
  interopClient = null;
  return loadInteropClient(
    ip,
    username,
    password,
    () => internalEvents.emit("INTEROP_UPLOAD_SUCCESS"),
    () => internalEvents.emit("INTEROP_UPLOAD_FAIL")
  )
    .then(theInteropClient => {
      interopClient = theInteropClient;
      interopClient
        .getMission(missionId)
        .then(mission => {
          data.interopData = {
            ip: ip,
            mission: mission
          };
          console.log("Interop data retrieved");
          internalEvents.emit("INTEROP_DATA", data.interopData);
        })
        .catch(error => {
          console.log(
            "Interop mission retrieval failed. Check the mission ID."
          );
          data.interopData = undefined;
          internalEvents.emit("INTEROP_DATA", data.interopData);
          if (config.verbose) console.log(error);
        });
    })
    .catch(error => {
      console.log("Interop login failed");
      data.interopData = undefined;
      internalEvents.emit("INTEROP_DATA", data.interopData);
      if (config.verbose) console.log(error);
    });
}
