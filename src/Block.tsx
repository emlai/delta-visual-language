import * as React from "react";
import {BlockData, Decl, Expr, isFunc, VarDecl} from "./interpreter";
import {Lens} from "./lens";
import {Expression, ExprSlot} from "./Expression";
import {Menu} from "./Menu";
import {useContextMenu} from "./context-menu";
import {ExprEditField} from "./ExprEditField";
import {nextId} from "./utils";

type Props = {
  data: Lens<BlockData>;
  deleteBlock: () => void;
  decls: Decl[];
};

export function Block(props: Props) {
  function BlockContent() {
    const block = props.data.current;

    switch (block.type) {
      case "empty":
        const select = (name: string) => {
          const decl = props.decls.find(decl => decl.name === name);

          if (decl && isFunc(decl)) {
            props.data.set({type: "call", funcId: decl.id, args: decl.params.map(() => ({type: "empty"}))});
          } else {
            props.data.set({type: "var-decl", id: nextId(), name: name, value: {type: "empty"}});
          }
        };

        return <ExprEditField expr={props.data as Lens<Expr>} decls={props.decls} select={select} />;

      case "call":
        return <Expression expr={props.data as Lens<Expr>} decls={props.decls} />;

      case "var-decl":
        return (
          <div className="VarDecl">
            <div>{block.name}</div>
            <span>{"←"}</span>
            <ExprSlot expr={(props.data as Lens<VarDecl>).value} decls={props.decls} />
          </div>
        );
    }
  }

  const ContextMenuTrigger = useContextMenu(
    <Menu items={[{value: "deleteBlock", label: <span>Delete block</span>}]} select={props.deleteBlock} />
  );

  return (
    <ContextMenuTrigger className="Block">
      <BlockContent />
    </ContextMenuTrigger>
  );
}
