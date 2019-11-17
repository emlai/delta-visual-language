import {FunctionData} from "./interpreter";

export type Position = {
  x: number
  y: number
};

export function replace<T>(array: T[], index: number, element: T): T[] {
  return Object.assign([], array, {[index]: element});
}

let id = 0;

export function createFunc(name: string): FunctionData {
  id++;
  return {id, name, body: []};
}
