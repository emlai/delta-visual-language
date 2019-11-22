import * as React from "react";
import {BlockData, Decl, Expr, isFunc, VarDecl} from "./interpreter";
import {AutocompleteField} from "./AutocompleteField";
import {Lens, view} from "./lens";
import {nextId} from "./utils";
import {Expression} from "./Expression";
import {Menu} from "./Menu";
import {useContextMenu} from "./context-menu";

type Props = {
  data: Lens<BlockData>;
  deleteBlock: () => void;
  decls: Decl[];
};

export function Block(props: Props) {
  const select = (name: string) => {
    const decl = props.decls.find(decl => decl.name === name);

    if (decl && isFunc(decl)) {
      props.data.set({type: "call", funcId: decl.id, args: decl.params.map(() => ({type: "empty"}))});
    } else {
      props.data.set({type: "var-decl", id: nextId(), name: name, value: {type: "empty"}});
    }
  };

  function BlockContent() {
    const block = props.data.current;

    switch (block.type) {
      case "empty":
        return <AutocompleteField completions={props.decls.filter(isFunc).map(func => func.name)} select={select} />;

      case "call":
        return <Expression expr={props.data as Lens<Expr>} decls={props.decls} />;

      case "var-decl":
        return (
          <div className="VarDecl">
            <code>{block.name}</code>
            <div className="Arrow">{"←"}</div>
            <Expression expr={view("value", props.data as Lens<VarDecl>)} decls={props.decls} />
          </div>
        );
    }
  }

  const ContextMenuTrigger = useContextMenu(
    <Menu items={[{value: "deleteBlock", label: "Delete block"}]} select={props.deleteBlock} />
  );

  return (
    <ContextMenuTrigger className="Block">
      <BlockContent />
    </ContextMenuTrigger>
  );
}
