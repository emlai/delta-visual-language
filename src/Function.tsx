import * as React from "react";
import {IoMdAdd} from "react-icons/io";
import {Func, VarDecl} from "./interpreter";
import {Block} from "./Block";
import {EditableLabel} from "./EditableLabel";
import {Lens, map, push, view} from "./lens";

type Props = {
  func: Lens<Func>;
  funcs: Func[];
};

export function Function(props: Props) {
  const {func, funcs} = props;
  const addBlock = () => push(view("body", func), {type: "empty"});
  const vars = func.current.body.filter(block => block.type === "var-decl") as VarDecl[];

  return (
    <div className="Function">
      <code className="FunctionName">
        <EditableLabel value={view("name", func)} />
      </code>
      {map(view("body", func), (block, index) => (
        <Block data={block} funcs={funcs} vars={vars} key={index} />
      ))}
      <a href="#" className="Block AddBlockButton" onClick={addBlock}>
        <IoMdAdd />
      </a>
    </div>
  );
}
