import * as React from "react";
import {IoMdPlay} from "react-icons/io";
import {useKey} from "react-use";
import {TitleBar} from "electron-react-titlebar";
import {Block, BlockData} from "./Block";
import {useState} from "./hooks";
import {interpret} from "./interpreter";
import {Position} from "./utils";
import {Menu} from "./Menu";

export function Editor() {
  const [editorMenuPosition, setEditorMenuPosition] = React.useState<Position | null>(null);
  useKey("Escape", () => setEditorMenuPosition(null));
  const blocks = useState<Array<BlockData>>([{type: "empty"}]);
  const setBlock = (index: number, data: BlockData) => {
    blocks.set(Object.assign([], blocks.get().concat({type: "empty"}), {[index]: data}));
  };

  function openEditorMenu(event: React.MouseEvent) {
    if (!editorMenuPosition && event.target === event.currentTarget) {
      setEditorMenuPosition({x: event.clientX, y: event.clientY});
    } else {
      setEditorMenuPosition(null);
    }
  }

  return <div className="Editor">
    <TitleBar menu={[]}>
      <link rel="stylesheet" type="text/css" href={require.resolve("electron-react-titlebar/assets/style.css")}/>
      <div className="RunButton" onClick={() => interpret(blocks.get())}>
        <IoMdPlay/>
      </div>
    </TitleBar>
    <div className="editableArea" onClick={openEditorMenu}>
      {blocks.get().map((block, index) =>
        <Block data={block} setData={data => setBlock(index, data)} key={index}/>
      )}
    </div>
    {editorMenuPosition ?
      <Menu
        items={["Add function"]}
        select={(x) => console.log(x)}
        position={editorMenuPosition}
      /> : null}
  </div>;
}
