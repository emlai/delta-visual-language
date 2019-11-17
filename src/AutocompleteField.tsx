import * as React from "react";
import {useState} from "react";
import {Menu} from "./Menu";
import {lens} from "./lens";

type Props<T> = {
  completions?: Array<T>;
  select: (value: string) => void;
};

export function AutocompleteField<T extends string>(props: Props<T>) {
  const value = lens(useState(""));

  const completions =
    value.current && props.completions
      ? props.completions.filter(c => c.includes(value.current)).map(c => ({value: c, label: <code>{c}</code>}))
      : [];

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      props.select(value.current);
    }
  }

  return (
    <div className="TextField">
      <code>
        <input
          value={value.current}
          onChange={event => value.set(event.target.value.trimLeft())}
          onKeyDown={onKeyDown}
          autoFocus={true}
        />
      </code>
      <Menu items={completions} select={props.select} />
    </div>
  );
}
