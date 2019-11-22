import * as React from "react";
import {IoMdAdd} from "react-icons/io";
import {Decl, Func, isVarDecl} from "./interpreter";
import {Block} from "./Block";
import {EditableLabel} from "./EditableLabel";
import {Lens, map, push, view} from "./lens";
import {nextId} from "./utils";

type Props = {
  func: Lens<Func>;
  funcs: Func[];
};

export function Function(props: Props) {
  const {func, funcs} = props;
  const addParam = () => push(view("params", func), {id: nextId(), name: ""});
  const addBlock = () => push(view("body", func), {type: "empty"});
  const vars: Decl[] = [...func.current.body.filter(isVarDecl), ...func.current.params];

  return (
    <div className="Function">
      <div className="FunctionHeader">
        <code className="FunctionName">
          <EditableLabel value={view("name", func)} />
        </code>
        {map(view("params", func), (param, index) => (
          <code>
            <EditableLabel value={view("name", param)} key={index} />
          </code>
        ))}
        {func.current.name !== "main" && (
          <a href="#" className="AddParamButton" onClick={addParam}>
            <IoMdAdd />
          </a>
        )}
      </div>
      {map(view("body", func), (block, index) => (
        <Block data={block} funcs={funcs} vars={vars} key={index} />
      ))}
      <a href="#" className="Block AddBlockButton" onClick={addBlock}>
        <IoMdAdd />
      </a>
    </div>
  );
}
