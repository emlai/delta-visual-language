import * as React from "react";
import {useState} from "react";
import {BlockData, FunctionData} from "./interpreter";
import {AutocompleteField} from "./AutocompleteField";
import {lens, Lens} from "./lens";

type Props = {
  data: Lens<BlockData>
  funcs: FunctionData[]
};

export function Block(props: Props) {
  const value = lens(useState(""));
  const completions = props.funcs.map(func => func.name);
  const block = props.data.current;

  const select = (name: string) => {
    const func = props.funcs.find(func => func.name === name);
    if (!func) throw Error(`Function name "${name}" not found`);
    props.data.set({type: "call", funcId: func.id});
  };

  function BlockContent() {
    switch (block.type) {
      case "empty":
        return <AutocompleteField
          value={value}
          completions={completions}
          select={select}
        />;
      default:
        const func = props.funcs.find(f => f.id === block.funcId);
        if (!func) throw Error(`Function ID "${block.funcId}" not found`);
        return <code>{func.name}</code>;
    }
  }

  return <div className="Block">
    <BlockContent/>
  </div>;
}
