export type Position = {
  x: number
  y: number
};

export function replace<T>(array: T[], index: number, element: T): T[] {
  return Object.assign([], array, {[index]: element});
}
