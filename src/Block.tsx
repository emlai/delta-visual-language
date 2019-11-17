import * as React from "react";
import {useState} from "react";
import {BlockData, FunctionData} from "./interpreter";
import {AutocompleteField} from "./AutocompleteField";
import {lens, Lens} from "./lens";

type Props = {
  data: Lens<BlockData>
  fns: FunctionData[]
};

export function Block(props: Props) {
  const value = lens(useState(""));
  const completions = props.fns.map(fn => fn.name);
  const block = props.data.get();

  const select = (name: string) => {
    const fn = props.fns.find(fn => fn.name === name);
    if (!fn) throw Error(`Function name "${name}" not found`);
    props.data.set({type: "call", fnId: fn.id});
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
        const fn = props.fns.find(f => f.id === block.fnId);
        if (!fn) throw Error(`Function ID "${block.fnId}" not found`);
        return <code>{fn.name}</code>;
    }
  }

  return <div className="Block">
    <BlockContent/>
  </div>;
}
