import * as uuid from "uuid/v4";
import {Func, Param} from "./interpreter";

export function isNumber(value: string) {
  return !isNaN(parseFloat(value))
}

export function nextId() {
  return uuid();
}

export function createFunc(name: string, params: Param[]): Func {
  return {id: nextId(), name, params, body: []};
}

export function createNativeFunc(name: string, params: Param[]): Func {
  return {id: name, name, params, body: [], native: true};
}
