import * as React from "react";
import * as ReactDOM from "react-dom";
import {remote} from "electron";
// @ts-ignore
import * as Titlebar from "electron-titlebar-windows";
import {Editor} from "./Editor";

ReactDOM.render(
  <Editor/>,
  document.getElementById("root")
);

const titlebar = new Titlebar({
  draggable: true
});

titlebar.appendTo(document.getElementById("titlebar"));

titlebar.on("minimize", () => remote.getCurrentWindow().minimize());
titlebar.on("maximize", () => remote.getCurrentWindow().unmaximize());
titlebar.on("fullscreen", () => remote.getCurrentWindow().maximize());
titlebar.on("close", () => remote.getCurrentWindow().close());
