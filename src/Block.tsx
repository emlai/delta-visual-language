import * as React from "react";
import {BlockData, FunctionData, VarDecl} from "./interpreter";
import {AutocompleteField} from "./AutocompleteField";
import {Lens, view} from "./lens";
import {nextId} from "./utils";

type Props = {
  data: Lens<BlockData>;
  funcs: FunctionData[];
};

export function Block(props: Props) {
  const completions = props.funcs.map(func => func.name);

  const select = (name: string) => {
    const func = props.funcs.find(func => func.name === name);

    if (func) {
      props.data.set({type: "call", funcId: func.id});
    } else {
      props.data.set({type: "var", id: nextId(), varName: name, value: {type: "empty"}});
    }
  };

  function BlockContent() {
    const block = props.data.current;
    switch (block.type) {
      case "empty":
        return <AutocompleteField completions={completions} select={select} />;
      case "call":
        const func = props.funcs.find(f => f.id === block.funcId);
        if (!func) throw Error(`Function ID "${block.funcId}" not found`);
        return <code>{func.name}</code>;
      case "var":
        const {varName, value} = block;

        const selectValue = (name: string) => {
          const valueLens = view("value", props.data as Lens<VarDecl>);
          const func = props.funcs.find(func => func.name === name);
          if (func) {
            valueLens.set({type: "call", funcId: func.id});
          } else {
            throw Error(`"${name}" is not a function`);
          }
        };

        return (
          <div className="VarDecl">
            <code>{varName}</code>
            <div className="Arrow">{"←"}</div>
            {value.type === "call" ? (
              <code>{props.funcs.find(func => func.id === value.funcId)?.name}</code>
            ) : (
              <AutocompleteField completions={completions} select={selectValue} />
            )}
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
