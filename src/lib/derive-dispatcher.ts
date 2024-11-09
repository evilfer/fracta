import {Dispatch, SetStateAction} from "react";
import {PropRecordContainer, StateSetterHook} from "./types";


export function derivePartialStateDispatch<T, S>(dispatcher: Dispatch<SetStateAction<T>>, selector: (value: T) => S, join: (full: T, updated: S) => T): Dispatch<SetStateAction<S>> {
  return (updater: SetStateAction<S>) => {
    dispatcher(prev => {
      const partial = selector(prev)
      const updated = typeof updater === 'function' ? (updater as (value: S) => S)(partial) : updater
      return join(prev, updated)
    })
  }
}

export function derivePropStateDispatch<Prop extends string, T extends PropRecordContainer<Prop, T>>(dispatcher: Dispatch<SetStateAction<T>>, key: Prop) {
  return derivePartialStateDispatch(dispatcher, v => v[key], (full, partial) => ({...full, [key]: partial}))
}

export function derivePartialStateUpdate<T, S>(useDispatch: StateSetterHook<T>, selector: (value: T) => S, join: (full: T, updated: S) => T): StateSetterHook<S> {
  return () => derivePartialStateDispatch(useDispatch(), selector, join)
}


export function derivePropStateUpdate<Prop extends string, T extends PropRecordContainer<Prop, T>>(useDispatch: StateSetterHook<T>, key: Prop) {
  return () => derivePropStateDispatch<Prop, T>(useDispatch(), key)
}
