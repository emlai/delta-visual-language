// @ts-ignore
import * as prompt from "electron-prompt";

export type FunctionData = {
  id: number
  name: string
  body: BlockData[]
}

export type BlockData =
  | {type: "empty"}
  | {type: "call", fnId: number}

export async function interpret(fns: FunctionData[], fn: FunctionData, arg?: unknown): Promise<unknown> {
  return fn.body.reduce<unknown>(async (prev, curr) => {
    switch (curr.type) {
      case "call":
        const fn = fns.find(f => f.id === curr.fnId);
        if (!fn) throw Error(`Function ID "${curr.fnId}" not found`);

        switch (fn.name) {
          case "prompt":
            return prompt(await prev);
          case "print":
            return alert(await prev);
          default:
            return interpret(fns, fn, await prev);
        }
    }
  }, arg);
}
