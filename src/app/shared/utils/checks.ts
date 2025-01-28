export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== undefined && value !== null;
}

export function hasValue(s: string | undefined | null): s is string {
  return typeof s === "string" && s.length > 0;
}

export function assertDefined<T>(
  value: T | null | undefined,
  message: string = "Expected value is not defined",
): asserts value is T {
  if (isDefined(value)) {
    return;
  }
  throw new Error(message);
}

export function assertTrue(
  condition: boolean,
  errorMessage: string = "Assertion failed",
): asserts condition {
  if (condition === false) {
    throw new Error(errorMessage);
  }
}

export function ensure<T>(
  val: T | undefined | null,
  message = "Expected value was null or undefined",
): T {
  if (val === undefined || val === null) {
    throw new TypeError(message);
  }
  return val;
}
