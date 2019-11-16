export type Lens<T> = {
  get: () => T
  set: (value: T) => void
}
