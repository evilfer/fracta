import {PropRecordContainer, StateSelectHook} from "./types";


export function deriveStateSelector<T, S>(useSelect: StateSelectHook<T>, selector: (state: T) => S): () => S {
  return () => useSelect(selector)
}

export function deriveIdentityStateSelector<T>(useSelect: StateSelectHook<T>): () => T {
  return deriveStateSelector(useSelect, v => v)
}

export function derivePropSelector<Prop extends string, T extends PropRecordContainer<Prop, T>>(useSelect: StateSelectHook<T>, key: Prop) {
  return deriveStateSelector(useSelect, v => v[key])
}

export function transformSelector<T, S>(selector: () => T, tx: (value: T) => S): () => S {
  return () => tx(selector())
}
