import { InferableComponentEnhancerWithProps } from "react-redux";

export type ExtractPropsType<T> = T extends InferableComponentEnhancerWithProps<
  infer TInjectedProps,
  infer TNeedsProps
>
  ? TInjectedProps & TNeedsProps
  : never;
