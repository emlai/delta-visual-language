import * as React from "react";
import {BlockData, Decl, Expr, isFunc, VarDecl} from "./interpreter";
import {AutocompleteField} from "./AutocompleteField";
import {Lens, view} from "./lens";
import {nextId, Position} from "./utils";
import {Expression} from "./Expression";
import {useKey} from "react-use";
import {Menu} from "./Menu";

type Props = {
  data: Lens<BlockData>;
  deleteBlock: () => void;
  decls: Decl[];
};

export function Block(props: Props) {
  const [blockMenuPosition, setBlockMenuPosition] = React.useState<Position | null>(null);
  useKey("Escape", closeBlockMenu);

  function openBlockMenu(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      setBlockMenuPosition({x: event.clientX, y: event.clientY});
    }
  }

  function closeBlockMenu() {
    setBlockMenuPosition(null);
  }

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

  return (
    <div className="Block" onContextMenu={openBlockMenu}>
      <BlockContent />

      {blockMenuPosition && (
        <Menu
          items={[{value: "deleteBlock", label: "Delete block"}]}
          select={props.deleteBlock}
          position={blockMenuPosition}
        />
      )}
    </div>
  );
}
