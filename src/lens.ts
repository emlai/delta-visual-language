import {replace} from "./utils";

export type Lens<T> = {
  current: T;
  set: (value: T) => void;
};

export function lens<T>([current, set]: [T, (value: T) => void]): Lens<T> {
  return {current, set};
}

export function view<T, K extends keyof T>(key: K, lens: Lens<T>): Lens<T[K]> {
  return {
    current: lens.current[key],
    set: (value: T[K]) => lens.set({...lens.current, [key]: value})
  };
}

export function map<T, U>(array: Lens<T[]>, callback: (element: Lens<T>, index: number, array: Lens<T[]>) => U): U[] {
  return array.current.map((value, index) => {
    const setter = (newValue: T) => array.set(replace(array.current, index, newValue));
    return callback(lens([value, setter]), index, array);
  });
}

export function push<T, U extends T[]>(array: Lens<T[]>, element: U[number]) {
  array.set([...array.current, element]);
}

export function remove<T>(array: Lens<T[]>, index: number) {
  array.set([...array.current.slice(0, index), ...array.current.slice(index + 1)]);
}
