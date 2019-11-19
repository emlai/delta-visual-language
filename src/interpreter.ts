// @ts-ignore
import * as prompt from "electron-prompt";

export type Param = {
  name: string;
};

export type Func = {
  id: number;
  name: string;
  params: Param[];
  body: BlockData[];
};

export type Empty = {type: "empty"};
export type Call = {type: "call"; funcId: number; args: Expr[]};
export type Var = {type: "var"; varId: number};
export type VarDecl = {type: "var-decl"; id: number; name: string; value: Expr};

export type Expr = Empty | Var | Call;
export type BlockData = Empty | Call | VarDecl;

export async function interpret(blocks: BlockData[], funcs: Func[], vars: any = {}): Promise<unknown> {
  return blocks.reduce<unknown>(async (prev, curr) => {
    await prev;

    switch (curr.type) {
      case "call":
        return evaluate(curr, funcs, vars);
      case "var-decl":
        return (vars[curr.id] = await evaluate(curr.value, funcs, vars));
    }
  }, undefined);
}

async function evaluate(expr: Expr, funcs: Func[], vars: any): Promise<unknown> {
  switch (expr.type) {
    case "call":
      const func = funcs.find(f => f.id === expr.funcId);
      if (!func) throw Error(`Function ID "${expr.funcId}" not found`);

      const args = [];
      for (const arg of expr.args) {
        args.push(await evaluate(arg, funcs, vars));
      }

      switch (func.name) {
        case "prompt":
          return prompt();
        case "print":
          return alert(args);
        default:
          return interpret(func.body, funcs, vars);
      }
    case "var":
      return vars[expr.varId];
  }
}
