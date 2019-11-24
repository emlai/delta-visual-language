import * as React from "react";
import {MdAdd as AddIcon} from "react-icons/md";
import {Decl, Func, isVarDecl} from "./interpreter";
import {Blocks} from "./Block";
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
  const addParam = () => func.params.push({id: nextId(), name: ""});
  const decls = props.decls.concat(func.current.body.filter(isVarDecl)).concat(func.current.params);

  const ContextMenuTrigger = useContextMenu(
    <Menu items={[{value: "deleteFunc", label: <span>Delete function</span>}]} select={props.deleteFunc} />
  );

  return (
    <div className="FunctionWrapper">
      <div className="Function">
        <ContextMenuTrigger className="FunctionHeader">
          <EditableLabel value={func.name} />
          {func.params.map((param, index) => (
            <EditableLabel value={param.name} key={index} />
          ))}
          <a href="#" className="AddParamButton" onClick={addParam}>
            <AddIcon />
          </a>
        </ContextMenuTrigger>
        <Blocks blocks={func.body} decls={decls} />
      </div>
    </div>
  );
}
