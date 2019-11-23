import * as React from "react";
import {useState} from "react";
import {Decl, Expr, isFunc} from "./interpreter";
import {Lens} from "./lens";
import {Menu} from "./Menu";

type Props = {
  expr: Lens<Expr>;
  decls: Decl[];
  select?: (name: string) => void;
  cancel?: () => void;
};

export function ExprEditField(props: Props) {
  function getName(expr: Expr) {
    switch (expr.type) {
      case "empty":
        return "";
      case "var":
        return props.decls.find(decl => decl.id === expr.varId)!.name;
      case "call":
        return props.decls.find(decl => decl.id === expr.funcId)!.name;
      case "compare":
        return "";
    }
  }

  const value = Lens(useState(getName(props.expr.current)));

  const select =
    props.select ??
    ((name: string) => {
      const decl = props.decls.find(decl => decl.name === name);
      if (!decl) throw Error(`Variable name "${name}" not found`);

      if (isFunc(decl)) {
        props.expr.set({type: "call", funcId: decl.id, args: decl.params.map(() => ({type: "empty"}))});
      } else {
        props.expr.set({type: "var", varId: decl.id});
      }
    });

  const completions =
    value.current && props.decls
      ? props.decls
          .filter(decl => decl.name.includes(value.current))
          .map(decl => ({value: decl.name, label: decl.name}))
      : [];

  function onKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        select(value.current);
        break;
      case "Escape":
        props.cancel?.();
        break;
      case "=":
        event.preventDefault();
        props.expr.set({type: "compare", left: {type: "empty"}, right: {type: "empty"}});
        break;
    }
  }

  return (
    <div className="ExprEditField">
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
