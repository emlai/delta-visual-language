import * as React from "react";
import {IoMdPlay} from "react-icons/io";
import {useLocalStorage} from "react-use";
import * as is from "electron-is";
import {TitleBar as WindowsTitleBar} from "electron-react-titlebar";
import {interpret} from "./interpreter";
import {createBuiltinFunc, createFunc, nextId} from "./utils";
import {Menu} from "./Menu";
import {Function} from "./Function";
import {lens, map, push, remove} from "./lens";
import {useContextMenu} from "./context-menu";

const main = createBuiltinFunc("main", []);
const prompt = createBuiltinFunc("prompt", []);
const print = createBuiltinFunc("print", [{id: nextId(), name: ""}]);

export function Editor() {
  const funcs = lens(useLocalStorage("delta-project", [main]));
  const builtinFuncs = [prompt, print];
  const decls = funcs.current.concat(builtinFuncs);

  function addFunction() {
    push(funcs, createFunc("", []));
  }

  function RunButton() {
    const run = () => {
      const main = funcs.current.find(func => func.name === "main")!;
      return interpret(main.body, decls);
    };

    return (
      <div className="RunButton" onClick={run}>
        <IoMdPlay />
      </div>
    );
  }

  const ContextMenuTrigger = useContextMenu(
    <Menu items={[{value: "addFunction", label: "Add function"}]} select={addFunction} />
  );

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

      <ContextMenuTrigger className="editableArea">
        {map(funcs, (func, index) => (
          <Function func={func} decls={decls} deleteFunc={() => remove(funcs, index)} key={index} />
        ))}
      </ContextMenuTrigger>
    </div>
  );
}
