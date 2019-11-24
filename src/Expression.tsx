import * as React from "react";
import {Call, Compare, Decl, Expr, isFunc} from "./interpreter";
import {Lens} from "./lens";
import {ExprSlot} from "./ExprSlot";

type Props = {
  expr: Lens<Expr>;
  decls: Decl[];
};

export function Expression(props: Props) {
  const {decls} = props;
  const expr = props.expr.current;

  switch (expr.type) {
    case "empty":
      console.assert(false);
      return null;

    case "number":
      return <>{expr.value}</>;

    case "var":
      const variable = decls.find(decl => decl.id === expr.varId);
      if (!variable) throw Error(`Variable ID "${expr.varId}" not found`);

      return <>{variable.name}</>;

    case "call":
      const func = decls.find(decl => decl.id === expr.funcId);
      if (!func) throw Error(`Function ID "${expr.funcId}" not found`);
      const params = isFunc(func) ? func.params : [];

      return (
        <div className="Call">
          <div>{func.name}</div>
          {(props.expr as Lens<Call>).args.map((arg, index) =>
            params[index].name ? (
              <label key={index}>
                <div className="LabelText">{params[index].name + ":"}</div>
                <ExprSlot expr={arg} decls={decls} />
              </label>
            ) : (
              <ExprSlot expr={arg} decls={decls} key={index} />
            )
          )}
        </div>
      );

    case "compare":
      return (
        <div className="Compare">
          <ExprSlot expr={(props.expr as Lens<Compare>).left} decls={decls} />
          {"="}
          <ExprSlot expr={(props.expr as Lens<Compare>).right} decls={decls} />
        </div>
      );
  }
}
