import * as React from "react";
import {Block, BlockData} from "./Block";
import {useState} from "./hooks";

export function Editor() {
  const blocks = useState<Array<BlockData>>([{type: "empty"}]);
  const setBlock = (index: number, data: BlockData) => {
    blocks.set(Object.assign([], blocks.get().concat({type: "empty"}), {[index]: data}));
  };

  return <div className="Editor">
    {blocks.get().map((block, index) =>
      <Block data={block} setData={data => setBlock(index, data)} key={index}/>
    )}
  </div>;
}
