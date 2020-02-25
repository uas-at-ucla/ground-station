import { useRef, useEffect, useCallback } from "react";

// Based on https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
// and https://blog.logrocket.com/solutions-to-frustrations-with-react-hooks/
// Used to make a callback that is an un-changing reference to the given callback, so it doesn't cause unnecessary re-renders for pure components.
export function useEventCallback<T extends any[]>(fn: (...args: T) => void) {
  const ref = useRef(fn);

  useEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: T) => ref.current(...args), []);
}
