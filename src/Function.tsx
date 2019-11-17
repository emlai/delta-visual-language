import * as React from "react";
import {IoMdAdd} from "react-icons/io";
import {FunctionData} from "./interpreter";
import {Block} from "./Block";
import {EditableLabel} from "./EditableLabel";
import {Lens, map, push, view} from "./lens";

type Props = {
  fn: Lens<FunctionData>
}

export function Function(props: Props) {
  const {fn} = props;
  const addBlock = () => push(view("body", fn), {type: "empty"});

  return <div className="Function">
    <code className="FunctionName">
      <EditableLabel value={view("name", fn)}/>
    </code>
    {map(view("body", fn), (block, index) => {
      return <Block data={block} key={index}/>;
    })}
    <a href="#" className="Block AddBlockButton" onClick={addBlock}>
      <IoMdAdd/>
    </a>
  </div>;
}
