export function identity(x: any): any {
  return x;
}

export function doIf(
  condition: boolean,
  right: Function,
  left: Function,
): Function {
  if (condition) {
    return right;
  } else {
    return left;
  }
}

export function doOnlyIf(condition: boolean, right: Function): Function {
  if (condition) {
    return right;
  } else {
    return identity;
  }
}
