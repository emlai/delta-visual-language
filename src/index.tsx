import * as React from "react";
import * as ReactDOM from "react-dom";
import {remote} from "electron";
// @ts-ignore
import * as Titlebar from "electron-titlebar-windows";

ReactDOM.render(
  <div></div>,
  document.getElementById("root")
);

const titlebar = new Titlebar({
  draggable: true
});

titlebar.appendTo(document.body);

titlebar.on("minimize", () => remote.getCurrentWindow().minimize());
titlebar.on("maximize", () => remote.getCurrentWindow().unmaximize());
titlebar.on("fullscreen", () => remote.getCurrentWindow().maximize());
titlebar.on("close", () => remote.getCurrentWindow().close());
