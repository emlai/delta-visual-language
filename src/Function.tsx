import * as React from "react";
import {IoMdAdd} from "react-icons/io";
import {Decl, Func, isVarDecl} from "./interpreter";
import {Block} from "./Block";
import {EditableLabel} from "./EditableLabel";
import {Lens, map, push, remove, view} from "./lens";
import {nextId} from "./utils";
import {useContextMenu} from "./context-menu";
import {Menu} from "./Menu";

type Props = {
  func: Lens<Func>;
  deleteFunc: () => void;
  decls: Decl[];
};

export function Function(props: Props) {
  const {func} = props;
  const addParam = () => push(view("params", func), {id: nextId(), name: ""});
  const addBlock = () => push(view("body", func), {type: "empty"});
  const decls = props.decls.concat(func.current.body.filter(isVarDecl)).concat(func.current.params);

  const ContextMenuTrigger = useContextMenu(
    <Menu items={[{value: "deleteFunc", label: "Delete function"}]} select={props.deleteFunc} />
  );

  return (
    <div className="Function">
      <ContextMenuTrigger className="FunctionHeader">
        <code className="FunctionName">
          <EditableLabel value={view("name", func)} />
        </code>
        {map(view("params", func), (param, index) => (
          <code key={index}>
            <EditableLabel value={view("name", param)} />
          </code>
        ))}
        {func.current.name !== "main" && (
          <a href="#" className="AddParamButton" onClick={addParam}>
            <IoMdAdd />
          </a>
        )}
      </ContextMenuTrigger>
      {map(view("body", func), (block, index, blocks) => (
        <Block data={block} decls={decls} deleteBlock={() => remove(blocks, index)} key={index} />
      ))}
      <a href="#" className="Block AddBlockButton" onClick={addBlock}>
        <IoMdAdd />
      </a>
    </div>
  );
}
