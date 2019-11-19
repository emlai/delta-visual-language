import {Func, Param} from "./interpreter";

export type Position = {
  x: number;
  y: number;
};

export function replace<T>(array: T[], index: number, element: T): T[] {
  return Object.assign([], array, {[index]: element});
}

let id = 0;

export function nextId() {
  return id++;
}

export function createFunc(name: string, params: Param[]): Func {
  return {id: nextId(), name, params, body: []};
}
