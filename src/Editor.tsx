import * as React from "react";
import {IoMdPlay} from "react-icons/io";
import {useKey} from "react-use";
import * as is from "electron-is";
import {TitleBar as WindowsTitleBar} from "electron-react-titlebar";
import {FunctionData, interpret} from "./interpreter";
import {Position, replace} from "./utils";
import {Menu} from "./Menu";
import {Function} from "./Function";
import {lens} from "./lens";

export function Editor() {
  const [editorMenuPosition, setEditorMenuPosition] = React.useState<Position | null>(null);
  const [fns, setFns] = React.useState<FunctionData[]>([{name: "main", body: []}]);
  useKey("Escape", closeEditorMenu);

  function openEditorMenu(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      setEditorMenuPosition({x: event.clientX, y: event.clientY});
    }
  }

  function closeEditorMenu() {
    setEditorMenuPosition(null);
  }

  function addFunction() {
    closeEditorMenu();
    setFns(fns.concat({name: "", body: []}));
  }

  function RunButton() {
    return <div className="RunButton" onClick={() => interpret(fns.find(fn => fn.name === "main")!)}>
      <IoMdPlay/>
    </div>;
  }

  return <div className="Editor">
    {is.windows() ?
      <WindowsTitleBar>
        <link rel="stylesheet" type="text/css" href={require.resolve("electron-react-titlebar/assets/style.css")}/>
        <RunButton/>
      </WindowsTitleBar>
      :
      <div className="electron-app-title-bar non-windows">
        <RunButton/>
      </div>
    }
    <div className="editableArea" onContextMenu={openEditorMenu} onClick={closeEditorMenu}>
      {fns.map((fn, index) =>
        <Function fn={lens(fn, newFn => setFns(replace(fns, index, newFn)))} key={index}/>
      )}
    </div>
    {editorMenuPosition ?
      <Menu
        items={[{value: "addFunction", label: "Add function"}]}
        select={addFunction}
        position={editorMenuPosition}
      /> : null
    }
  </div>;
}
