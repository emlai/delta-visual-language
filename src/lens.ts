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
