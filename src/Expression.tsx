import * as React from "react";
import {useState} from "react";
import {Call, Decl, Expr} from "./interpreter";
import {Lens} from "./lens";
import {ExprField} from "./ExprField";

type Props = {
  expr: Lens<Expr>;
  decls: Decl[];
};

export function Expression(props: Props) {
  const {decls} = props;
  const expr = props.expr.current;

  switch (expr.type) {
    case "empty":
      return <ExprField {...props} />;

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
          {(props.expr as Lens<Call>).view("args").map((arg, index) => (
            <ExprSlot key={index} expr={arg} decls={decls} />
          ))}
        </div>
      );
  }
}

function ExprSlot(props: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <ExprField {...props} cancel={() => setEditing(false)} />;
  }

  return (
    <div className="ExprSlot" onClick={() => setEditing(true)}>
      <Expression expr={props.expr} decls={props.decls} />
    </div>
  );
}
