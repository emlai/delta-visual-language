import * as React from "react";
import {useState} from "react";
import {Decl, Expr, isFunc} from "./interpreter";
import {Lens} from "./lens";
import {Menu} from "./Menu";
import {isNumber} from "./utils";

type Props = {
  expr: Lens<Expr>;
  decls: Decl[];
  select?: (name: string) => void;
};

export function ExprSlot(props: Props) {
  function getInitialFieldValue(expr: Expr) {
    switch (expr.type) {
      case "empty":
        return "";
      case "number":
        return `${expr.value}`;
      case "var":
        return props.decls.find(decl => decl.id === expr.varId)!.name;
      case "call":
        return props.decls.find(decl => decl.id === expr.funcId)!.name;
      case "compare":
        return "";
    }
  }

  const initialValue = getInitialFieldValue(props.expr.current);
  const value = Lens(useState(initialValue));

  const select =
    props.select ??
    ((value: string) => {
      if (isNumber(value)) {
        props.expr.set({type: "number", value: parseFloat(value)});
        return;
      }

      const decl = props.decls.find(decl => decl.name === value);
      if (!decl) throw Error(`Variable name "${value}" not found`);

      if (isFunc(decl)) {
        props.expr.set({type: "call", funcId: decl.id, args: decl.params.map(() => ({type: "empty"}))});
      } else {
        props.expr.set({type: "var", varId: decl.id});
      }
    });

  const completions = value.current
    ? props.decls
        .map(decl => decl.name)
        .concat("if")
        .filter(name => name.includes(value.current))
        .map(name => ({value: name, label: name}))
    : [];

  function onKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        select(value.current);
        break;
      case "Tab":
        if (completions.length === 0) {
          select(value.current);
        }
        break;
      case "Escape":
        select(initialValue);
        break;
      case "=":
        event.preventDefault();
        props.expr.set({type: "compare", left: {type: "empty"}, right: {type: "empty"}});
        break;
    }
  }

  return (
    <div className="ExprSlot">
      <input
        value={value.current}
        onChange={event => value.set(event.target.value.trimLeft())}
        onKeyDown={onKeyDown}
        autoFocus={true}
      />
      <div className="MenuOverlay">
        <Menu items={completions} select={select} />
      </div>
    </div>
  );
}
