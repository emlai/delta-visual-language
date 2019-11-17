// @ts-ignore
import * as prompt from "electron-prompt";

export type FunctionData = {
  name: string
  body: BlockData[]
}

export type BlockType = "prompt" | "print" | "empty";

export type BlockData = {
  type: BlockType
};

export async function interpret(fn: FunctionData) {
  return fn.body.reduce<any>(async (prev, curr) => {
    switch (curr.type) {
      case "prompt":
        return prompt(await prev);
      case "print":
        return alert(await prev);
    }
  }, undefined);
}
