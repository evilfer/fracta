import {initInstanceInternalState} from "./internal-state";

describe('initInstanceInternalState', () => {

  test('should provide select', () => {
    const {select} = initInstanceInternalState({value: 10})
    const result = select(state => state.value)
    expect(result).toEqual(10)
  })

  test('should provide select with undefined selector', () => {
    const {select} = initInstanceInternalState({value: 10})
    const result = select(undefined)
    expect(result).toEqual({value: 10})
  })

  test('should initialise with function', () => {
    const {select} = initInstanceInternalState(() => ({value: 20}))
    const result = select(state => state.value)
    expect(result).toEqual(20)
  })

  test('should dispatch and notify with function updater', () => {
    const listener = jest.fn()

    const {subscribe, select, dispatch} = initInstanceInternalState({value: 10})

    subscribe(listener)
    expect(select(state => state.value)).toEqual(10)
    dispatch(prev => ({...prev, value: prev.value + 1}))

    expect(listener).toHaveBeenCalledTimes(1)
    expect(select(state => state.value)).toEqual(11)
  })

  test('should dispatch and notify with value updater', () => {
    const listener = jest.fn()

    const {subscribe, select, dispatch} = initInstanceInternalState({value: 10})

    subscribe(listener)
    expect(select(state => state.value)).toEqual(10)
    dispatch({value: 15})

    expect(listener).toHaveBeenCalledTimes(1)
    expect(select(state => state.value)).toEqual(15)
  })

  test('should unsubscribe', () => {
    const listener = jest.fn()

    const {subscribe, select, dispatch} = initInstanceInternalState({value: 10})

    const unsubscribe = subscribe(listener)
    unsubscribe()
    dispatch(prev => ({...prev, value: prev.value + 1}))

    expect(listener).not.toHaveBeenCalled()
    expect(select(state => state.value)).toEqual(11)
  })
})
