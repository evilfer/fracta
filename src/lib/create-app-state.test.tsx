import React, {useState} from "react";
import {createFractaStore, initDefaultContextValue} from "./create-app-state";
import {derivePropStateUpdate} from "./derive-dispatcher";
import {deriveStateSelector} from "./derive-selector";
import {fireEvent, render} from "@testing-library/react";
import '@testing-library/jest-dom';


describe('create app state', () => {
  describe('initDefaultContextValue', () => {
    test('callbacks should throw errors for default context value', () => {
      const value = initDefaultContextValue()
      expect(() => value.dispatch(1)).toThrow()
      expect(() => value.select(() => null)).toThrow()
      expect(() => value.subscribe(() => {
        return
      })).toThrow()
    })
  })

  describe('createFractaStore', () => {
    test('should consume value', () => {
      const [Provider, useSelect] = createFractaStore({value: 10})
      const useSelectValue = deriveStateSelector(useSelect, state => state.value)

      const Consumer = jest.fn(() => {
        const value = useSelectValue(undefined)
        return <div data-testid={'consumer-root'}>{value}</div>
      })

      const {getByTestId} = render(
        <Provider>
          <Consumer/>
        </Provider>
      )

      expect(getByTestId('consumer-root')).toHaveTextContent('10')
    })

    test('should consume updated value', () => {
      const [Provider, useSelect, useUpdate] = createFractaStore({value: 10})

      const useSelectValue = deriveStateSelector(useSelect, state => state.value)
      const useUpdateValue = derivePropStateUpdate(useUpdate, 'value')

      const Consumer = jest.fn(() => {
        const value = useSelectValue()
        return <div data-testid={'consumer-root'}>{value}</div>
      })

      const Updater = jest.fn(() => {
        const updateValue = useUpdateValue()
        return <button data-testid={'updater-button'} onClick={() => updateValue(20)}>update</button>
      })

      const {getByTestId} = render(
        <Provider>
          <Consumer/>
          <Updater/>
        </Provider>
      )

      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(Updater).toHaveBeenCalledTimes(1)
      expect(getByTestId('consumer-root')).toHaveTextContent('10')

      fireEvent.click(getByTestId('updater-button'))

      expect(Consumer).toHaveBeenCalledTimes(2)
      expect(Updater).toHaveBeenCalledTimes(1)
      expect(getByTestId('consumer-root')).toHaveTextContent('20')
    })

    test('should allow reusing context with custom values', () => {
      const [Provider, useSelect] = createFractaStore({value: 10})

      const useSelectValue = deriveStateSelector(useSelect, state => state.value)

      const Consumer = jest.fn(({id}: { id: string }) => {
        const value = useSelectValue()
        return <div data-testid={`consumer-root-${id}`}>{value}</div>
      })

      const {getByTestId} = render(
        <>
          <Provider>
            <Consumer id={'a'}/>
          </Provider>
          <Provider init={{value: 15}}>
            <Consumer id={'b'}/>
          </Provider>
        </>
      )

      expect(getByTestId('consumer-root-a')).toHaveTextContent('10')
      expect(getByTestId('consumer-root-b')).toHaveTextContent('15')
    })

    test('should update context instances independently', () => {
      const [Provider, useSelect, useUpdate] = createFractaStore({value: 10})

      const useSelectValue = deriveStateSelector(useSelect, state => state.value)
      const useUpdateValue = derivePropStateUpdate(useUpdate, 'value')

      const Consumer = jest.fn(({id}: { id: string }) => {
        const value = useSelectValue()
        return <div data-testid={`consumer-root-${id}`}>{value}</div>
      })

      const Updater = jest.fn(() => {
        const updateValue = useUpdateValue()
        return <button data-testid={'updater-button'} onClick={() => updateValue(20)}>update</button>
      })


      const {getByTestId} = render(
        <>
          <Provider>
            <Consumer id={'a'}/>
          </Provider>
          <Provider init={{value: 15}}>
            <Consumer id={'b'}/>
            <Updater/>
          </Provider>
        </>
      )

      expect(Consumer).toHaveBeenCalledTimes(2)
      expect(getByTestId('consumer-root-a')).toHaveTextContent('10')
      expect(getByTestId('consumer-root-b')).toHaveTextContent('15')

      Consumer.mockClear()

      fireEvent.click(getByTestId('updater-button'))
      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(Consumer).toHaveBeenCalledWith({id: 'b'}, {})
      expect(getByTestId('consumer-root-a')).toHaveTextContent('10')
      expect(getByTestId('consumer-root-b')).toHaveTextContent('20')
    })

    test('should unsubscribe on unmount', () => {
      const [Provider, useSelect, useUpdate] = createFractaStore({value: 10})

      const useSelectValue = deriveStateSelector(useSelect, state => state.value)
      const useUpdateValue = derivePropStateUpdate(useUpdate, 'value')

      const Consumer = jest.fn(() => {
        const value = useSelectValue()
        return <div data-testid={'consumer-root'}>{value}</div>
      })

      const Updater = jest.fn(() => {
        const [showConsumer, setShowConsumer] = useState(true)
        const updateValue = useUpdateValue()
        return (
          <>
            <button data-testid={'updater-button-hide'} onClick={() => setShowConsumer(false)}>update</button>
            <button data-testid={'updater-button-update'} onClick={() => updateValue(20)}>update</button>
            {showConsumer && <Consumer/>}
          </>
        )
      })


      const {getByTestId, queryByTestId} = render(
        <Provider>
          <Updater/>
        </Provider>)

      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(queryByTestId('consumer-root')).toBeInTheDocument()
      fireEvent.click(getByTestId('updater-button-hide'))
      expect(queryByTestId('consumer-root')).not.toBeInTheDocument()
      fireEvent.click(getByTestId('updater-button-update'))
      expect(Consumer).toHaveBeenCalledTimes(1)
    })


    test('should allow changing selectors', () => {
      const [Provider, useSelect] = createFractaStore({value: 10})

      const useSelectValue = (inc: number) => useSelect(state => state.value + inc)

      const Consumer = jest.fn(() => {
        const [inc, setInc] = useState(1)
        const value = useSelectValue(inc)
        return (
          <div>
            <div data-testid={'consumer-value'}>{value}</div>
            <button onClick={() => setInc(2)} data-testid={'update-inc'}>inc</button>
          </div>
        )
      })

      const {getByTestId, queryByTestId} = render(
        <Provider>
          <Consumer/>
        </Provider>
      )

      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(getByTestId('consumer-value')).toHaveTextContent('11')

      fireEvent.click(getByTestId('update-inc'))

      expect(queryByTestId('consumer-root')).not.toBeInTheDocument()
      expect(Consumer).toHaveBeenCalledTimes(2)
      expect(getByTestId('consumer-value')).toHaveTextContent('12')
    })

    test('should combine state updates and external updates in one single render cycle', () => {
      const [Provider, useSelect, useUpdate] = createFractaStore({value: 10})

      const selector = jest.fn((inc: number, state: { value: number }) => state.value + inc)
      const useSelectValue = (inc: number) => useSelect(state => selector(inc, state))

      const Wrapper = jest.fn(() => {
        const [inc, setInc] = useState(1)
        const update = useUpdate()

        return (
          <div>
            <button data-testid={'updater-button-a'} onClick={() => {
              setInc(2)
              update({value: 20})
            }}>update a
            </button>
            <button data-testid={'updater-button-b'} onClick={() => {
              update({value: 30})
              setInc(3)
            }}>update b
            </button>
            <Consumer inc={inc}/>
          </div>
        )
      })

      const Consumer = jest.fn(({inc}: { inc: number }) => {
        const value = useSelectValue(inc)
        return (
          <div data-testid={'consumer-value'}>{inc} {value}</div>
        )
      })

      const {getByTestId} = render(
        <Provider>
          <Wrapper/>
        </Provider>
      )

      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(Consumer).toHaveBeenCalledWith({inc: 1}, {})
      expect(Wrapper).toHaveBeenCalledTimes(1)
      expect(selector).toHaveBeenCalledTimes(1)
      expect(selector).toHaveBeenCalledWith(1, {value: 10})
      expect(getByTestId('consumer-value')).toHaveTextContent('1 11')

      jest.clearAllMocks()

      fireEvent.click(getByTestId('updater-button-a'))
      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(Consumer).toHaveBeenCalledWith({inc: 2}, {})
      expect(Wrapper).toHaveBeenCalledTimes(1)
      expect(selector).toHaveBeenCalledTimes(2)
      expect(selector.mock.calls).toEqual([
        [1, {"value": 20}],
        [2, {"value": 20}]
      ])
      expect(getByTestId('consumer-value')).toHaveTextContent('2 22')

      jest.clearAllMocks()

      fireEvent.click(getByTestId('updater-button-b'))
      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(Consumer).toHaveBeenCalledWith({inc: 3}, {})
      expect(Wrapper).toHaveBeenCalledTimes(1)
      expect(selector).toHaveBeenCalledTimes(2)
      expect(selector.mock.calls).toEqual([
        [2, {"value": 30}],
        [3, {"value": 30}]
      ])
      expect(getByTestId('consumer-value')).toHaveTextContent('3 33')
    })

    test('should combine multiple state updates in one render cycle', () => {
      const [Provider, useSelect, useUpdate] = createFractaStore({count: 10, name: 'a'})

      const useSelectCount = deriveStateSelector(useSelect, state => state.count)
      const useSelectName = deriveStateSelector(useSelect, state => state.name)

      const Wrapper = jest.fn(() => {
        const update = useUpdate()

        return (
          <div>
            <button data-testid={'updater-button'} onClick={() => {
              update(prev => ({...prev, name: 'b'}))
              update(prev => ({...prev, count: 11}))
            }}>update
            </button>
            <Consumer/>
          </div>
        )
      })

      const Consumer = jest.fn(() => {
        const count = useSelectCount()
        const name = useSelectName()
        return (
          <div data-testid={'consumer-value'}>{count} {name}</div>
        )
      })

      const {getByTestId} = render(
        <Provider>
          <Wrapper/>
        </Provider>
      )

      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(Wrapper).toHaveBeenCalledTimes(1)
      expect(getByTestId('consumer-value')).toHaveTextContent('10 a')

      jest.clearAllMocks()

      fireEvent.click(getByTestId('updater-button'))
      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(Wrapper).not.toHaveBeenCalled()
      expect(getByTestId('consumer-value')).toHaveTextContent('11 b')

      jest.clearAllMocks()

      fireEvent.click(getByTestId('updater-button'))
      expect(Consumer).not.toHaveBeenCalled()
      expect(Wrapper).not.toHaveBeenCalled()
      expect(getByTestId('consumer-value')).toHaveTextContent('11 b')
    })

    test('should ignore unselected changes to state', () => {
      const [Provider, useSelect, useUpdate] = createFractaStore({count: 10, name: 'a'})

      const selector = jest.fn(((state: { count: number, name: string }) => state.name))
      const useSelectName = deriveStateSelector(useSelect, selector)

      const Wrapper = jest.fn(() => {
        const update = useUpdate()

        return (
          <div>
            <button data-testid={'updater-button'} onClick={() => {
              update(prev => ({...prev, count: 11}))
            }}>update
            </button>
            <Consumer/>
          </div>
        )
      })

      const Consumer = jest.fn(() => {
        const name = useSelectName()
        return (
          <div data-testid={'consumer-value'}>{name}</div>
        )
      })

      const {getByTestId} = render(
        <Provider>
          <Wrapper/>
        </Provider>
      )

      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(Wrapper).toHaveBeenCalledTimes(1)
      expect(selector).toHaveBeenCalledTimes(1)
      expect(selector).toHaveBeenCalledWith({count: 10, name: 'a'})
      expect(getByTestId('consumer-value')).toHaveTextContent('a')

      jest.clearAllMocks()

      fireEvent.click(getByTestId('updater-button'))
      expect(selector).toHaveBeenCalledTimes(1)
      expect(selector).toHaveBeenCalledWith({count: 11, name: 'a'})
      expect(Consumer).not.toHaveBeenCalled()
      expect(Wrapper).not.toHaveBeenCalled()
      expect(getByTestId('consumer-value')).toHaveTextContent('a')
    })

    test('should ignore unselected changes to state for nested selectors', () => {
      const [Provider, useSelect, useUpdate] = createFractaStore({count: 10, name: 'a'})
      const useSelectName = deriveStateSelector(useSelect, state => state.name)
      const useSelectNameLength = deriveStateSelector(useSelectName, state => state.length)

      const Wrapper = jest.fn(() => {
        const update = useUpdate()

        return (
          <div>
            <button data-testid={'updater-button-b'} onClick={() => {
              update(prev => ({...prev, name: 'b'}))
            }}>update
            </button>
            <button data-testid={'updater-button-ab'} onClick={() => {
              update(prev => ({...prev, name: 'ab'}))
            }}>update
            </button>
            <Consumer/>
          </div>
        )
      })

      const Consumer = jest.fn(() => {
        const name = useSelectNameLength()
        return (
          <div data-testid={'consumer-value'}>{name}</div>
        )
      })

      const {getByTestId} = render(
        <Provider>
          <Wrapper/>
        </Provider>
      )

      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(Wrapper).toHaveBeenCalledTimes(1)
      expect(getByTestId('consumer-value')).toHaveTextContent('1')

      jest.clearAllMocks()

      fireEvent.click(getByTestId('updater-button-b'))
      expect(Consumer).not.toHaveBeenCalled()
      expect(Wrapper).not.toHaveBeenCalled()
      expect(getByTestId('consumer-value')).toHaveTextContent('1')

      jest.clearAllMocks()

      fireEvent.click(getByTestId('updater-button-ab'))
      expect(Consumer).toHaveBeenCalledTimes(1)
      expect(Wrapper).not.toHaveBeenCalled()
      expect(getByTestId('consumer-value')).toHaveTextContent('2')
    })
  })
})
