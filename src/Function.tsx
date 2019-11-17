import * as React from "react";
import {IoMdAdd} from "react-icons/io";
import {FunctionData} from "./interpreter";
import {Block} from "./Block";
import {EditableLabel} from "./EditableLabel";
import {Lens, map, push, view} from "./lens";

type Props = {
  func: Lens<FunctionData>
  funcs: FunctionData[]
}

export function Function(props: Props) {
  const {func, funcs} = props;
  const addBlock = () => push(view("body", func), {type: "empty"});

  return <div className="Function">
    <code className="FunctionName">
      <EditableLabel value={view("name", func)}/>
    </code>
    {map(view("body", func), (block, index) => {
      return <Block data={block} funcs={funcs} key={index}/>;
    })}
    <a href="#" className="Block AddBlockButton" onClick={addBlock}>
      <IoMdAdd/>
    </a>
  </div>;
}
