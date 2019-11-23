class _Lens<T> {
  readonly current!: T;
  readonly set!: (value: T) => void;

  constructor([current, set]: [T, (value: T) => void]) {
    if (!(this instanceof Lens)) {
      return new Lens([current, set]);
    }

    this.current = current;
    this.set = set;
  }

  view<T, K extends keyof T>(this: Lens<T>, key: K): Lens<T[K]> {
    return Lens([this.current[key], (value: T[K]) => this.set({...this.current, [key]: value})]);
  }

  map<T, U>(this: Lens<T[]>, callback: (element: Lens<T>, index: number, array: Lens<T[]>) => U): U[] {
    return this.current.map((value, index) => {
      const setter = (newValue: T) => this.replace(index, newValue);
      return callback(Lens([value, setter]), index, this);
    });
  }

  push<T>(this: Lens<T[]>, element: T) {
    this.set([...this.current, element]);
  }

  remove<T>(this: Lens<T[]>, index: number) {
    this.set([...this.current.slice(0, index), ...this.current.slice(index + 1)]);
  }

  replace<T>(this: Lens<T[]>, index: number, element: T) {
    this.set([...this.current.slice(0, index), element, ...this.current.slice(index + 1)]);
  }
}

// https://stackoverflow.com/a/48362715/3425536
export type Lens<T> = _Lens<T>;
export const Lens = _Lens as typeof _Lens & (<T>([current, set]: [T, (value: T) => void]) => Lens<T>);
