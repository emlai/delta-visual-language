// @ts-ignore
import * as prompt from "electron-prompt";

export type FunctionData = {
  id: number
  name: string
  body: BlockData[]
}

export type Empty = {type: "empty"}
export type Call = {type: "call", funcId: number}
export type VarDecl = {type: "var", id: number, varName: string, value: Expr};

export type Expr = Empty | Call
export type BlockData = Empty | Call | VarDecl

export async function interpret(funcs: FunctionData[], blocks: BlockData[], arg?: unknown, vars: any = {}): Promise<unknown> {
  return blocks.reduce<unknown>(async (prev, curr) => {
    switch (curr.type) {
      case "call":
        const func = funcs.find(f => f.id === curr.funcId);
        if (!func) throw Error(`Function ID "${curr.funcId}" not found`);

        switch (func.name) {
          case "prompt":
            return prompt(await prev);
          case "print":
            return alert(await prev);
          default:
            return interpret(funcs, func.body, await prev, vars);
        }
      case "var":
        await prev;
        return vars[curr.id] = await interpret(funcs, [curr.value], undefined, vars);
    }
  }, arg);
}
