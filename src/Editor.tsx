import * as React from "react";
import {createRef, useState} from "react";
import {MdPlayArrow as PlayIcon, MdPause as PauseIcon} from "react-icons/md";
import {useLocalStorage} from "react-use";
import * as is from "electron-is";
import {TitleBar as WindowsTitleBar} from "electron-react-titlebar";
import {Func} from "./interpreter";
import {createFunc, createNativeFunc, nextId} from "./utils";
import {Menu} from "./Menu";
import {Function} from "./Function";
import {Lens} from "./lens";
import {useContextMenu} from "./context-menu";
import {RenderView, RenderViewRef} from "./RenderView";

const nativeFuncs = [
  createNativeFunc("prompt", []),
  createNativeFunc("print", [{id: nextId(), name: ""}]),
  createNativeFunc("move", [
    {id: nextId(), name: "x"},
    {id: nextId(), name: "y"}
  ]),
  createNativeFunc("rotate", [{id: nextId(), name: "radians"}])
];

export function Editor() {
  const [running, setRunning] = useState(false);
  const funcs = Lens(useLocalStorage<Func[]>("delta-project", []));
  const decls = funcs.current.concat(nativeFuncs);
  const renderView = createRef<RenderViewRef>();

  function addFunction() {
    funcs.push(createFunc("", []));
  }

  function RunButton() {
    const onClick = () => {
      if (running) {
        renderView.current!.stop();
      } else {
        renderView.current!.start();
      }
      setRunning(!running);
    };

    return (
      <div className="RunButton" onClick={onClick}>
        {running ? <PauseIcon /> : <PlayIcon />}
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
        <RenderView funcs={decls} ref={renderView} />
      </div>
    </div>
  );
}
