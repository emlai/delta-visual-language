import {replace} from "./utils";

export type Lens<T> = {
  get: () => T
  set: (value: T) => void
}

export function lens<T>(value: T, setter: (value: T) => void): Lens<T> {
  return {
    get: () => value,
    set: setter
  };
}

export function view<T, K extends keyof T>(key: K, lens: Lens<T>): Lens<T[K]> {
  return {
    get: () => lens.get()[key],
    set: (value: T[K]) => lens.set({...lens.get(), [key]: value})
  };
}

export function map<T, U>(array: Lens<T[]>, callback: (element: Lens<T>, index: number) => U): U[] {
  return array.get().map((value, index) => {
    const setter = (newValue: T) => array.set(replace(array.get(), index, newValue));
    return callback(lens(value, setter), index);
  });
}

export function push<T, U extends T[]>(array: Lens<T[]>, element: U[number]) {
  array.set([...array.get(), element])
}
