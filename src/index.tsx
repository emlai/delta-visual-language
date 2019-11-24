import * as React from "react";
import * as ReactDOM from "react-dom";
import {IconContext} from "react-icons/lib";
import {Editor} from "./Editor";

ReactDOM.render(
  <IconContext.Provider value={{size: "20px"}}>
    <Editor />
  </IconContext.Provider>,
  document.getElementById("root")
);
