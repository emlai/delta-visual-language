import * as React from "react";
import {useState} from "react";
import {IoMdPlay} from "react-icons/io";
import {useKey} from "react-use";
import * as is from "electron-is";
import {TitleBar as WindowsTitleBar} from "electron-react-titlebar";
import {interpret} from "./interpreter";
import {createFunc, Position} from "./utils";
import {Menu} from "./Menu";
import {Function} from "./Function";
import {lens, map, push} from "./lens";

const main = createFunc("main", []);
const prompt = createFunc("prompt", []);
const print = createFunc("print", [{name: ""}]);

export function Editor() {
  const [editorMenuPosition, setEditorMenuPosition] = React.useState<Position | null>(null);
  const funcs = lens(useState([main]));
  const builtinFuncs = [prompt, print];
  const allFuncs = funcs.current.concat(builtinFuncs);
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
    push(funcs, createFunc("", []));
  }

  function RunButton() {
    const run = () => {
      const main = funcs.current.find(func => func.name === "main")!;
      return interpret(main.body, allFuncs);
    };

    return (
      <div className="RunButton" onClick={run}>
        <IoMdPlay />
      </div>
    );
  }

  return (
    <div className="Editor">
      {is.windows() ? (
        <WindowsTitleBar>
          <link rel="stylesheet" type="text/css" href={require.resolve("electron-react-titlebar/assets/style.css")} />
          <RunButton />
        </WindowsTitleBar>
      ) : (
        <div className="electron-app-title-bar non-windows">
          <RunButton />
        </div>
      )}

      <div className="editableArea" onContextMenu={openEditorMenu} onClick={closeEditorMenu}>
        {map(funcs, (func, index) => (
          <Function func={func} funcs={allFuncs} key={index} />
        ))}
      </div>

      {editorMenuPosition && (
        <Menu
          items={[{value: "addFunction", label: "Add function"}]}
          select={addFunction}
          position={editorMenuPosition}
        />
      )}
    </div>
  );
}
