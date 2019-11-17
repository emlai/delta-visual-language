import {BlockData, FunctionData} from "./interpreter";
import {replace} from "./utils";
import {Block} from "./Block";
import * as React from "react";

type Props = {
  fn: FunctionData
  setFn: (newFn: FunctionData) => void
}

export function Function(props: Props) {
  const {fn, setFn} = props;
  return <div className="Function">
    <code className="FunctionName">{fn.name}</code>
    {fn.body.map((block, index) => {
      const setBlock = (newBlock: BlockData) => {
        const body = fn.body.concat({type: "empty"});
        setFn({...fn, body: replace(body, index, newBlock)});
      };
      return <Block data={block} setData={setBlock} key={index}/>;
    })}
  </div>;
}
