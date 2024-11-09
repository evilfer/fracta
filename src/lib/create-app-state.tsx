import React, {createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {initInstanceInternalState} from "./internal-state";
import {StateProvider, StateSelectHook, StateSetterHook, Tx} from "./types";
import {useConstant} from "./use-constant";
import {useTrackingRef} from "./use-tracking-ref";


export interface AppStateContextValue<T> {
  dispatch: Dispatch<SetStateAction<T>>
  select: StateSelectHook<T>
  subscribe: (listener: () => void) => (() => void)
}


export function initDefaultContextValue<T>(): AppStateContextValue<T> {
  return {
    select: () => {
      throw new Error(`Context provider not available`)
    },
    dispatch: () => {
      throw new Error(`Context provider not available`)
    },
    subscribe: () => {
      throw new Error(`Context provider not available`)
    }
  }
}


export function createFractaStore<T>(initialValue: T | (() => T)): [StateProvider<T>, StateSelectHook<T>, StateSetterHook<T>] {
  const defaultValue = initDefaultContextValue<T>()
  const Context = createContext(defaultValue)

  const Provider: StateProvider<T> = ({children, init}) => {
    const value = useConstant(() => initInstanceInternalState(init !== undefined ? init : initialValue))

    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    )
  }


  const useSelect: StateSelectHook<T> = <S = T>(selector?: Tx<T, S>): S => {
    const {select, subscribe} = useContext(Context)
    const valueForRender = select(selector)

    const selectorRef = useTrackingRef(selector)

    const [, setValue] = useState(valueForRender)
    const currentValueRef = useRef(valueForRender)

    useEffect(() => subscribe(() => {
      const newValue = select(selectorRef.current)
      if (newValue !== currentValueRef.current) {
        currentValueRef.current = newValue
        setValue(newValue)
      }
    }), [])

    return valueForRender
  }

  const useDispatch: StateSetterHook<T> = () => {
    return useContext(Context).dispatch
  }

  return [Provider, useSelect, useDispatch]
}
