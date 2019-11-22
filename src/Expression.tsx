import * as React from "react";
import {Call, Decl, Expr, isFunc} from "./interpreter";
import {AutocompleteField} from "./AutocompleteField";
import {Lens, map, view} from "./lens";

type Props = {
  expr: Lens<Expr>;
  decls: Decl[];
};

export function Expression(props: Props) {
  const {decls} = props;
  const expr = props.expr.current;

  switch (expr.type) {
    case "empty":
      const select = (name: string) => {
        const decl = decls.find(decl => decl.name === name);
        if (!decl) throw Error(`Variable name "${name}" not found`);

        if (isFunc(decl)) {
          props.expr.set({type: "call", funcId: decl.id, args: decl.params.map(() => ({type: "empty"}))});
        } else {
          props.expr.set({type: "var", varId: decl.id});
        }
      };

      return <AutocompleteField completions={decls.map(decl => decl.name)} select={select} />;

    case "var":
      const variable = decls.find(decl => decl.id === expr.varId);
      if (!variable) throw Error(`Variable ID "${expr.varId}" not found`);

      return <code>{variable.name}</code>;

    case "call":
      const func = decls.find(decl => decl.id === expr.funcId);
      if (!func) throw Error(`Function ID "${expr.funcId}" not found`);

      return (
        <div className="Call">
          <code>{func.name}</code>
          {map(view("args", props.expr as Lens<Call>), (arg, index) => (
            <Expression expr={arg} decls={decls} key={index} />
          ))}
        </div>
      );
  }
}
