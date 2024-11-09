import {useRef} from "react";


export function useConstant<T>(initialise: () => T): T {
  const ref = useRef<T | null>(null)

  if (ref.current === null) {
    ref.current = initialise()
  }

  return ref.current
}
