import * as React from "react";
import * as ReactDOM from "react-dom";
import {IconContext} from "react-icons/lib";
import {Editor} from "./Editor";

ReactDOM.render(
  <IconContext.Provider value={{size: "1.5em"}}>
    <Editor/>
  </IconContext.Provider>,
  document.getElementById("root")
);
