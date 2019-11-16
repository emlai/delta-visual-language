import * as React from "react";
import {IoMdPlay} from "react-icons/io";
import {TitleBar} from "electron-react-titlebar";
import {Block, BlockData} from "./Block";
import {useState} from "./hooks";

export function Editor() {
  const blocks = useState<Array<BlockData>>([{type: "empty"}]);
  const setBlock = (index: number, data: BlockData) => {
    blocks.set(Object.assign([], blocks.get().concat({type: "empty"}), {[index]: data}));
  };

  return <div className="Editor">
    <TitleBar menu={[]}>
      <link rel="stylesheet" type="text/css" href={require.resolve("electron-react-titlebar/assets/style.css")}/>
      <RunButton/>
    </TitleBar>
    <div className="editableArea">
      {blocks.get().map((block, index) =>
        <Block data={block} setData={data => setBlock(index, data)} key={index}/>
      )}
    </div>
  </div>;
}

function RunButton() {
  return <div className="RunButton">
    <IoMdPlay/>
  </div>;
}
