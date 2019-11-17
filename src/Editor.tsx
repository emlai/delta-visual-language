import * as React from "react";
import {IoMdPlay} from "react-icons/io";
import {useKey} from "react-use";
import {TitleBar} from "electron-react-titlebar";
import {FunctionData, interpret} from "./interpreter";
import {Position, replace} from "./utils";
import {Menu} from "./Menu";
import {Function} from "./Function";

export function Editor() {
  const [editorMenuPosition, setEditorMenuPosition] = React.useState<Position | null>(null);
  const [fns, setFns] = React.useState<FunctionData[]>([{name: "main", body: [{type: "empty"}]}]);
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
    setFns(fns.concat({name: "", body: [{type: "empty"}]}));
  }

  return <div className="Editor">
    <TitleBar>
      <link rel="stylesheet" type="text/css" href={require.resolve("electron-react-titlebar/assets/style.css")}/>
      <div className="RunButton" onClick={() => interpret(fns.find(fn => fn.name === "main")!)}>
        <IoMdPlay/>
      </div>
    </TitleBar>
    <div className="editableArea" onContextMenu={openEditorMenu} onClick={closeEditorMenu}>
      {fns.map((fn, index) =>
        <Function
          fn={fn}
          setFn={newFn => setFns(replace(fns, index, newFn))}
          key={index}
        />
      )}
    </div>
    {editorMenuPosition ?
      <Menu
        items={[{value: "addFunction", label: "Add function"}]}
        select={addFunction}
        position={editorMenuPosition}
      /> : null}
  </div>;
}
