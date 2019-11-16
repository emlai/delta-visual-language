import * as React from "react";
import {IoMdPlay} from "react-icons/io";
import {useKey} from "react-use";
import {TitleBar} from "electron-react-titlebar";
import {Block} from "./Block";
import {BlockData, Function, interpret} from "./interpreter";
import {Position, replace} from "./utils";
import {Menu} from "./Menu";

export function Editor() {
  const [editorMenuPosition, setEditorMenuPosition] = React.useState<Position | null>(null);
  const [fns, setFns] = React.useState<Function[]>([{name: "main", body: [{type: "empty"}]}]);
  useKey("Escape", () => setEditorMenuPosition(null));

  function openEditorMenu(event: React.MouseEvent) {
    if (!editorMenuPosition && event.target === event.currentTarget) {
      setEditorMenuPosition({x: event.clientX, y: event.clientY});
    } else {
      setEditorMenuPosition(null);
    }
  }

  function addFunction() {
    setEditorMenuPosition(null);
    setFns(fns.concat({name: "", body: [{type: "empty"}]}));
  }

  return <div className="Editor">
    <TitleBar>
      <link rel="stylesheet" type="text/css" href={require.resolve("electron-react-titlebar/assets/style.css")}/>
      <div className="RunButton" onClick={() => interpret(fns.find(fn => fn.name === "main")!)}>
        <IoMdPlay/>
      </div>
    </TitleBar>
    <div className="editableArea" onClick={openEditorMenu}>
      {fns.map((fn, index) => {
        const setFn = (newFn: Function) => {
          setFns(replace(fns, index, newFn));
        };
        return <div className="Function" key={index}>
          {fn.body.map((block, index) => {
            const setBlock = (newBlock: BlockData) => {
              const body = fn.body.concat({type: "empty"});
              setFn({...fn, body: replace(body, index, newBlock)});
            };
            return <Block data={block} setData={setBlock} key={index}/>;
          })}
        </div>;
      })}
    </div>
    {editorMenuPosition ?
      <Menu
        items={["Add function"]}
        select={addFunction}
        position={editorMenuPosition}
      /> : null}
  </div>;
}
