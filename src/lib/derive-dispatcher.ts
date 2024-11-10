import {Dispatch, SetStateAction} from "react";
import {PropRecordContainer, StateSetterHook} from "./types";


export function derivePartialStateDispatch<T, S>(
  dispatcher: Dispatch<SetStateAction<T>>,
  selector: (value: T) => S,
  join: (full: T, updated: S) => T
): Dispatch<SetStateAction<S>> {
  return (updater: SetStateAction<S>) => {
    dispatcher(prev => {
      const partial = selector(prev)
      const updated = typeof updater === 'function' ? (updater as (value: S) => S)(partial) : updater
      return join(prev, updated)
    })
  }
}

export function derivePropStateDispatch<Prop extends string, T extends PropRecordContainer<Prop, T>>(
  dispatcher: Dispatch<SetStateAction<T>>,
  key: Prop,
  join?: (full: T, updated: T[Prop]) => T
) {
  return derivePartialStateDispatch(
    dispatcher, v => v[key],
    join || ((full, partial) => ({...full, [key]: partial})))
}

export function derivePartialStateUpdate<T, S>(useDispatch: StateSetterHook<T>, selector: (value: T) => S, join: (full: T, updated: S) => T): StateSetterHook<S> {
  return () => derivePartialStateDispatch(useDispatch(), selector, join)
}


export function derivePropStateUpdate<Prop extends string, T extends PropRecordContainer<Prop, T>>(
  useDispatch: StateSetterHook<T>,
  key: Prop,
  join?: (full: T, updated: T[Prop]) => T
) {
  return () => derivePropStateDispatch<Prop, T>(useDispatch(), key, join)
}

export function deriveStateAction<T, F extends (...args: Parameters<F>) => SetStateAction<T>>(useDispatch: StateSetterHook<T>, action: F): () => (...args: Parameters<F>) => void {
  return () => (...args) => useDispatch()(action(...args))
}

export function derivePartialStateAction<T, S, F extends (...args: Parameters<F>) => SetStateAction<S>>(
  useDispatch: StateSetterHook<T>,
  selector: (value: T) => S,
  join: (full: T, updated: S) => T,
  action: F
): () => (...args: Parameters<F>) => void {
  return () => (...args) => {
    const dispatch = derivePartialStateDispatch(useDispatch(), selector, join)
    dispatch(action(...args))
  }
}

export function derivePropStateAction<Prop extends string, T extends PropRecordContainer<Prop, T>, F extends (...args: Parameters<F>) => SetStateAction<T[Prop]>>(
  useDispatch: StateSetterHook<T>,
  prop: Prop,
  action: F
): () => (...args: Parameters<F>) => void {
  return () => (...args) => {
    const dispatch = derivePropStateDispatch(useDispatch(), prop);
    dispatch(action(...args))
  }
}
