import * as React from "react";
import {IoMdAdd} from "react-icons/io";
import {BlockData, FunctionData} from "./interpreter";
import {replace} from "./utils";
import {Block} from "./Block";
import {EditableLabel} from "./EditableLabel";
import {lens, view} from "./lens";

type Props = {
  fn: FunctionData
  setFn: (newFn: FunctionData) => void
}

export function Function(props: Props) {
  const {fn, setFn} = props;
  const addBlock = () => setFn({...fn, body: fn.body.concat({type: "empty"})});

  return <div className="Function">
    <code className="FunctionName">
      <EditableLabel value={view("name", lens(fn, setFn))}/>
    </code>
    {fn.body.map((block, index) => {
      const setBlock = (newBlock: BlockData) => {
        setFn({...fn, body: replace(fn.body, index, newBlock)});
      };
      return <Block data={block} setData={setBlock} key={index}/>;
    })}
    <a href="#" className="Block AddBlockButton" onClick={addBlock}>
      <IoMdAdd/>
    </a>
  </div>;
}
