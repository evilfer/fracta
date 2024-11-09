import {Dispatch, FunctionComponent, PropsWithChildren, SetStateAction} from "react";

export type Tx<T, S> = (state: T) => S

export type StateSelectHook<T> = <S = T>(selector?: Tx<T, S>) => S

export type StateSetterHook<T> = () => Dispatch<SetStateAction<T>>

export type StateProvider<T> = FunctionComponent<PropsWithChildren<{ init?: Exclude<T, undefined> | (() => T) }>>

type RecordPropOutput<Prop extends string, T> = T extends Record<Prop, infer S> ? S : never
export type PropRecordContainer<Prop extends string, T> = Record<Prop, RecordPropOutput<Prop, T>>

