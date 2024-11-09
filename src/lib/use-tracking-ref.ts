import {MutableRefObject, useRef} from "react";


export function useTrackingRef<T>(value: T): MutableRefObject<T> {
  const ref = useRef<T>(value)
  ref.current = value
  return ref
}
