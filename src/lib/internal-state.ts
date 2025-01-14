import {SetStateAction} from "react";
import {AppStateContextValue} from "./create-app-state";
import {Tx} from "./types";


interface AppStateContextInternalState<T> {
  value: T
  subscribers: (() => void)[]
}

export function initInstanceInternalState<T>(initialValue: T | (() => T)): AppStateContextValue<T> {
  const internalState: AppStateContextInternalState<T> = {
    value: typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue,
    subscribers: []
  }

  const subscribe = (listener: () => void) => {
    internalState.subscribers.push(listener)
    return () => {
      const index = internalState.subscribers.indexOf(listener)
      if (index >= 0) {
        internalState.subscribers.splice(index, 1)
      }
    }
  }

  const dispatch = (updater: SetStateAction<T>) => {
    const newValue = typeof updater === 'function'
      ? (updater as (prev: T) => T)(internalState.value)
      : updater

    if (newValue !== internalState.value) {
      internalState.value = newValue
      internalState.subscribers.forEach(s => s())
    }
  }

  const select = <S = T>(selector?: Tx<T, S>): S => {
    const result = selector ? selector(internalState.value) : internalState.value
    return result as S
  }

  return {dispatch, select, subscribe}
}
