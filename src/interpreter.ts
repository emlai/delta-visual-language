// @ts-ignore
import * as prompt from "electron-prompt";

export type FunctionData = {
  id: number
  name: string
  body: BlockData[]
}

export type BlockData =
  | {type: "empty"}
  | {type: "call", funcId: number}

export async function interpret(funcs: FunctionData[], func: FunctionData, arg?: unknown): Promise<unknown> {
  return func.body.reduce<unknown>(async (prev, curr) => {
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
            return interpret(funcs, func, await prev);
        }
    }
  }, arg);
}
