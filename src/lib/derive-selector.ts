import {PropRecordContainer, StateSelectHook, Tx} from "./types";


export function deriveStateSelector<T, S>(useSelect: StateSelectHook<T>, selector: (state: T) => S): StateSelectHook<S> {
  return <S2, K2 extends undefined | Tx<S, S2>>(selector2?: K2): K2 extends Tx<S, infer S2> ? S2 : S => {
    return useSelect(state => selector2 ? selector2(selector(state)) : selector(state)) as K2 extends Tx<S, infer S2> ? S2 : S
  }
}

export function derivePropSelector<Prop extends string, T extends PropRecordContainer<Prop, T>>(useSelect: StateSelectHook<T>, key: Prop) {
  return deriveStateSelector(useSelect, v => v[key])
}
