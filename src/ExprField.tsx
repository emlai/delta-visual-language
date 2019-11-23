import * as React from "react";
import {useState} from "react";
import {Decl, Expr, isFunc} from "./interpreter";
import {Lens} from "./lens";
import {Menu} from "./Menu";

type Props = {
  expr: Lens<Expr>;
  decls: Decl[];
  cancel?: () => void;
};

export function ExprField(props: Props) {
  function getName(expr: Expr) {
    switch (expr.type) {
      case "empty":
        return "";
      case "var":
        return props.decls.find(decl => decl.id === expr.varId)!.name;
      case "call":
        return props.decls.find(decl => decl.id === expr.funcId)!.name;
    }
  }

  const value = Lens(useState(getName(props.expr.current)));

  const select = (name: string) => {
    const decl = props.decls.find(decl => decl.name === name);
    if (!decl) throw Error(`Variable name "${name}" not found`);

    if (isFunc(decl)) {
      props.expr.set({type: "call", funcId: decl.id, args: decl.params.map(() => ({type: "empty"}))});
    } else {
      props.expr.set({type: "var", varId: decl.id});
    }
  };

  const completions =
    value.current && props.decls
      ? props.decls
          .filter(decl => decl.name.includes(value.current))
          .map(decl => ({value: decl.name, label: <code>{decl.name}</code>}))
      : [];

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      select(value.current);
    } else if (event.key === "Escape") {
      props.cancel?.();
    }
  }

  return (
    <div>
      <code>
        <input
          value={value.current}
          onChange={event => value.set(event.target.value.trimLeft())}
          onKeyDown={onKeyDown}
          autoFocus={true}
        />
      </code>
      <div className="MenuOverlay">
        <Menu items={completions} select={select} />
      </div>
    </div>
  );
}
