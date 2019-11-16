// @ts-ignore
import * as prompt from "electron-prompt";
import {BlockData} from "./Block";

export async function interpret(program: Array<BlockData>) {
  return program.reduce<any>(async (prev, curr) => {
    switch (curr.type) {
      case "prompt":
        return prompt(await prev);
      case "print":
        return alert(await prev);
    }
  }, undefined);
}
