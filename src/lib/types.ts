import {Dispatch, FunctionComponent, PropsWithChildren, SetStateAction} from "react";

export type StateSelectHook<T> = <S>(selector: (state: T) => S) => S

export type StateSetterHook<T> = () => Dispatch<SetStateAction<T>>

export type StateProvider<T> = FunctionComponent<PropsWithChildren<{ init?: Exclude<T, undefined> | (() => T) }>>

type RecordPropOutput<Prop extends string, T> = T extends Record<Prop, infer S> ? S : never
export type PropRecordContainer<Prop extends string, T> = Record<Prop, RecordPropOutput<Prop, T>>
