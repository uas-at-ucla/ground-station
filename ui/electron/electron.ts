import { app, BrowserWindow, Menu, MenuItem, protocol } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";

process.chdir(path.resolve(__dirname, ".."));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;

function createWindow() {
  // Install helpful Chrome Extensions for debugging
  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = require("electron-devtools-installer");

    const RESELECT_DEVTOOLS = "cjmaipngmabglflfeepmdiffcijhjlbb"; // Chrome store ID

    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, RESELECT_DEVTOOLS].forEach(
      extension => {
        installExtension(extension)
          .then((name: string) => console.log(`Added Extension: ${name}`))
          .catch((err: string) => console.log("An error occurred: ", err));
      }
    );
  }

  // Handle the file:// protocol for files in build/static
  if (!isDev) {
    protocol.interceptFileProtocol(
      "file",
      (request, callback) => {
        const url = request.url.substr(7); // Remove "file://"
        if (url.startsWith("/static")) {
          callback(path.normalize(`${process.cwd()}/build/${url}`));
        } else {
          callback(url);
        }
      },
      error => {
        if (error) console.error("Failed to register file protocol", error);
      }
    );
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      nodeIntegration: true // expose Node.js require() as window.require() in web app
    }
  });

  // and load the url of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3001"
      : `file://${path.join(process.cwd(), "build/index.html")}`
  );

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Allow viewing devtools, copying, pasting, etc. in packaged app:
  if (!isDev) {
    const template = [
      new MenuItem({
        label: "Application",
        submenu: menuRoles.map(role => {
          return { role: role };
        })
      })
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  app.quit();
});

// All available menu roles
const menuRoles = [
  "toggleDevTools",
  "undo",
  "redo",
  "cut",
  "copy",
  "paste",
  "pasteAndMatchStyle",
  "delete",
  "selectAll",
  "reload",
  "forceReload",
  "resetZoom",
  "zoomIn",
  "zoomOut",
  "togglefullscreen",
  "window",
  "minimize",
  "close",
  "help",
  "about",
  "services",
  "hide",
  "hideOthers",
  "unhide",
  "quit",
  "startSpeaking",
  "stopSpeaking",
  "close",
  "minimize",
  "zoom",
  "front",
  "appMenu",
  "fileMenu",
  "editMenu",
  "viewMenu",
  "recentDocuments",
  "toggleTabBar",
  "selectNextTab",
  "selectPreviousTab",
  "mergeAllWindows",
  "clearRecentDocuments",
  "moveTabToNewWindow",
  "windowMenu"
] as const;
