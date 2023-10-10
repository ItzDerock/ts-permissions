export type StandardEnum<T = unknown> = {
  [id: string]: T | string;
  [nu: number]: string;
};

export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

/**
 * node:assert is not web-friendly
 * @param condition if false, throws an error
 * @param message
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message);
  }
}
