import {app, BrowserWindow} from "electron";
import installExtension, {REACT_DEVELOPER_TOOLS} from "electron-devtools-installer";

require("electron-reload")([__dirname, __dirname + "/../src/*.css"]);

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile("../index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

installExtension(REACT_DEVELOPER_TOOLS);
