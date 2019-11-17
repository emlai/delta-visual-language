import * as React from "react";
import {useState} from "react";
import {BlockData, BlockType} from "./interpreter";
import {AutocompleteField} from "./AutocompleteField";
import {lens, Lens} from "./lens";

type Props = {
  data: Lens<BlockData>
};

export function Block(props: Props) {
  const value = lens(useState(""));
  const completions: Array<BlockType> = ["prompt", "print"];

  function BlockContent() {
    switch (props.data.get().type) {
      case "empty":
        return <AutocompleteField
          value={value}
          completions={completions}
          select={type => props.data.set({type})}
        />;
      default:
        return <code>{props.data.get().type}</code>;
    }
  }

  return <div className="Block">
    <BlockContent/>
  </div>;
}
