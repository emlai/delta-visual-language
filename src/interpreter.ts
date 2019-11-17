// @ts-ignore
import * as prompt from "electron-prompt";

export type FunctionData = {
  name: string
  body: BlockData[]
}

export type BlockData =
  | {type: "empty"}
  | {type: "call", fn: FunctionData}

export async function interpret(fn: FunctionData, arg?: unknown): Promise<unknown> {
  return fn.body.reduce<unknown>(async (prev, curr) => {
    switch (curr.type) {
      case "call":
        switch (curr.fn.name) {
          case "prompt":
            return prompt(await prev);
          case "print":
            return alert(await prev);
          default:
            return interpret(curr.fn, await prev);
        }
    }
  }, arg);
}
