import * as Reselect from "reselect";

// A version of createStructuredSelector that can infer the selector output type
// The selector input type cannot be inferred because of this: https://github.com/microsoft/TypeScript/issues/29479
// This is a pattern called function currying, which is a workaround until TypeScript allows "Partial Type Argument Inference": https://github.com/microsoft/TypeScript/issues/26242
export function createStructuredSelector<S>() {
  return function<T>(
    selectors: { [K in keyof T]: Reselect.Selector<S, T[K]> }
  ) {
    return Reselect.createStructuredSelector<S, T>(selectors);
  };
}
