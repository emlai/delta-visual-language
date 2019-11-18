import * as React from "react";
import {Call, Expr, Func, VarDecl} from "./interpreter";
import {AutocompleteField} from "./AutocompleteField";
import {Lens, map, view} from "./lens";

type Props = {
  expr: Lens<Expr>;
  funcs: Func[];
  vars: VarDecl[];
};

export function Expression(props: Props) {
  const {funcs, vars} = props;
  const expr = props.expr.current;

  switch (expr.type) {
    case "empty":
      const completions = funcs.map(f => f.name).concat(vars.map(v => v.name));

      const select = (name: string) => {
        const func = funcs.find(f => f.name === name);
        if (func) {
          props.expr.set({type: "call", funcId: func.id, args: func.params.map(() => ({type: "empty"}))});
          return;
        }
        const variable = vars.find(v => v.name === name);
        if (variable) {
          props.expr.set({type: "var", varId: variable.id});
        }
      };

      return <AutocompleteField completions={completions} select={select} />;
    case "var":
      return <code>{vars.find(v => v.id === expr.varId)!.name}</code>;
    case "call":
      const func = funcs.find(f => f.id === expr.funcId);
      if (!func) throw Error(`Function ID "${expr.funcId}" not found`);

      return (
        <div className="Call">
          <code>{func.name}</code>
          {map(view("args", props.expr as Lens<Call>), (arg, index) => (
            <Expression expr={arg} funcs={funcs} vars={vars} key={index} />
          ))}
        </div>
      );
  }
}
