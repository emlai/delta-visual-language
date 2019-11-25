// @ts-ignore
import * as prompt from "electron-prompt";

export interface Decl {
  id: string;
  name: string;
}

export interface Param extends Decl {}

export interface Func extends Decl {
  params: Param[];
  body: BlockData[];
  native?: true;
}

export type Empty = {type: "empty"};
export type Number = {type: "number"; value: number};
export type Call = {type: "call"; funcId: string; args: Expr[]};
export type Var = {type: "var"; varId: string};
export type VarDecl = {type: "var-decl"; id: string; name: string; value: Expr};
export type If = {type: "if"; condition: Expr; then: BlockData[]; else: BlockData[]};
export type Compare = {type: "compare"; left: Expr; right: Expr};

export type Expr = Empty | Number | Var | Call | Compare;
export type BlockData = Empty | Call | VarDecl | If;

export function isVarDecl(block: BlockData): block is VarDecl {
  return block.type === "var-decl";
}

export function isFunc(decl: Decl): decl is Func {
  return "body" in decl;
}

export async function interpret(
  blocks: BlockData[],
  funcs: Func[],
  nativeFuncs: Record<string, Function>,
  vars: Record<string, unknown>
): Promise<unknown> {
  return blocks.reduce<unknown>(async (prev, curr) => {
    await prev;

    switch (curr.type) {
      case "call":
        return evaluate(curr, funcs, nativeFuncs, vars);
      case "var-decl":
        return (vars[curr.id] = await evaluate(curr.value, funcs, nativeFuncs, vars));
      case "if":
        const condition = await evaluate(curr.condition, funcs, nativeFuncs, vars);
        return interpret(condition ? curr.then : curr.else, funcs, nativeFuncs, vars);
    }
  }, undefined);
}

async function evaluate(
  expr: Expr,
  funcs: Func[],
  nativeFuncs: Record<string, Function>,
  vars: Record<string, unknown>
): Promise<unknown> {
  switch (expr.type) {
    case "empty":
      return;
    case "number":
      return expr.value;
    case "var":
      return vars[expr.varId];
    case "call":
      const func = funcs.find(f => f.id === expr.funcId);
      if (!func) throw Error(`Function ID "${expr.funcId}" not found`);

      const args: any[] = [];
      for (const arg of expr.args) {
        args.push(await evaluate(arg, funcs, nativeFuncs, vars));
      }

      if (func.native) {
        const allNativeFuncs: Record<string, Function> = {
          prompt,
          print: alert,
          ...nativeFuncs
        };
        return allNativeFuncs[func.name](...args);
      } else {
        const params = Object.fromEntries(func.params.map((param, index) => [param.id, args[index]]));
        return interpret(func.body, funcs, nativeFuncs, {...vars, ...params});
      }
    case "compare":
      const left = await evaluate(expr.left, funcs, nativeFuncs, vars);
      const right = await evaluate(expr.right, funcs, nativeFuncs, vars);
      return left === right;
  }
}
