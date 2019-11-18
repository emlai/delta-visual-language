import * as React from "react";
import {BlockData, Expr, FunctionData, VarDecl} from "./interpreter";
import {AutocompleteField} from "./AutocompleteField";
import {Lens, view} from "./lens";
import {nextId} from "./utils";
import {Expression} from "./Expression";

type Props = {
  data: Lens<BlockData>;
  funcs: FunctionData[];
  vars: VarDecl[];
};

export function Block(props: Props) {
  const select = (name: string) => {
    const func = props.funcs.find(func => func.name === name);

    if (func) {
      props.data.set({type: "call", funcId: func.id, args: func.params.map(() => ({type: "empty"}))});
    } else {
      props.data.set({type: "var-decl", id: nextId(), name: name, value: {type: "empty"}});
    }
  };

  function BlockContent() {
    const block = props.data.current;

    switch (block.type) {
      case "empty":
        return <AutocompleteField completions={props.funcs.map(func => func.name)} select={select} />;

      case "call":
        return <Expression expr={props.data as Lens<Expr>} funcs={props.funcs} vars={props.vars} />;

      case "var-decl":
        return (
          <div className="VarDecl">
            <code>{block.name}</code>
            <div className="Arrow">{"←"}</div>
            <Expression expr={view("value", props.data as Lens<VarDecl>)} funcs={props.funcs} vars={props.vars} />
          </div>
        );
    }
  }

  return (
    <div className="Block">
      <BlockContent />
    </div>
  );
}
