import * as React from "react";
import {IoMdPlay} from "react-icons/io";
import {useLocalStorage} from "react-use";
import * as is from "electron-is";
import {TitleBar as WindowsTitleBar} from "electron-react-titlebar";
import {interpret} from "./interpreter";
import {createBuiltinFunc, createFunc, nextId} from "./utils";
import {Menu} from "./Menu";
import {Function} from "./Function";
import {Lens} from "./lens";
import {useContextMenu} from "./context-menu";
import {RenderView} from "./RenderView";

const main = createBuiltinFunc("main", []);
const prompt = createBuiltinFunc("prompt", []);
const print = createBuiltinFunc("print", [{id: nextId(), name: ""}]);

export function Editor() {
  const funcs = Lens(useLocalStorage("delta-project", [main]));
  const builtinFuncs = [prompt, print];
  const decls = funcs.current.concat(builtinFuncs);

  function addFunction() {
    funcs.push(createFunc("", []));
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
    <Menu items={[{value: "addFunction", label: <span>Add function</span>}]} select={addFunction} />
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

      <div className="Content">
        <ContextMenuTrigger className="EditableArea">
          {funcs.map((func, index) => (
            <Function func={func} decls={decls} deleteFunc={() => funcs.remove(index)} key={index} />
          ))}
        </ContextMenuTrigger>
        <RenderView />
      </div>
    </div>
  );
}
