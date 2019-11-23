import * as uuid from "uuid/v4";
import {Func, Param} from "./interpreter";

export function nextId() {
  return uuid();
}

export function createFunc(name: string, params: Param[]): Func {
  return {id: nextId(), name, params, body: []};
}

export function createBuiltinFunc(name: string, params: Param[]): Func {
  return {id: name, name, params, body: []};
}
