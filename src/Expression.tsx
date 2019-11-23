import * as React from "react";
import {useState} from "react";
import {Call, Compare, Decl, Expr} from "./interpreter";
import {Lens} from "./lens";
import {ExprEditField} from "./ExprEditField";

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
          {(props.expr as Lens<Call>).args.map((arg, index) => (
            <ExprSlot key={index} expr={arg} decls={decls} />
          ))}
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

export function ExprSlot(props: Props) {
  const [editing, setEditing] = useState(false);

  if (editing || props.expr.type.current === "empty") {
    return <ExprEditField {...props} cancel={() => setEditing(false)} />;
  }

  const onClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setEditing(true);
    }
  };

  return (
    <div className="ExprSlot" onClick={onClick}>
      <Expression expr={props.expr} decls={props.decls} />
    </div>
  );
}
