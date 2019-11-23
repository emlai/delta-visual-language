import * as React from "react";
import {IoMdAdd} from "react-icons/io";
import {Decl, Func, isVarDecl} from "./interpreter";
import {Block} from "./Block";
import {EditableLabel} from "./EditableLabel";
import {Lens} from "./lens";
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
  const addParam = () => func.view("params").push({id: nextId(), name: ""});
  const addBlock = () => func.view("body").push({type: "empty"});
  const decls = props.decls.concat(func.current.body.filter(isVarDecl)).concat(func.current.params);

  const ContextMenuTrigger = useContextMenu(
    <Menu items={[{value: "deleteFunc", label: "Delete function"}]} select={props.deleteFunc} />
  );

  return (
    <div className="Function">
      <ContextMenuTrigger className="FunctionHeader">
        <code className="FunctionName">
          <EditableLabel value={func.view("name")} />
        </code>
        {func.view("params").map((param, index) => (
          <code key={index}>
            <EditableLabel value={param.view("name")} />
          </code>
        ))}
        {func.current.name !== "main" && (
          <a href="#" className="AddParamButton" onClick={addParam}>
            <IoMdAdd />
          </a>
        )}
      </ContextMenuTrigger>
      {func.view("body").map((block, index, blocks) => (
        <Block data={block} decls={decls} deleteBlock={() => blocks.remove(index)} key={index} />
      ))}
      <a href="#" className="Block AddBlockButton" onClick={addBlock}>
        <IoMdAdd />
      </a>
    </div>
  );
}
