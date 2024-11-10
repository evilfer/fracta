import {
  derivePartialStateAction,
  derivePartialStateDispatch,
  derivePartialStateUpdate,
  derivePropStateAction,
  derivePropStateDispatch,
  derivePropStateUpdate,
  deriveStateAction
} from "./derive-dispatcher";

describe('combine dispatchers', () => {
  interface MockState {
    other: string
    value: number
  }

  const mockState = {
    value: {
      other: '-',
      value: 0
    }
  }

  const originalDispatcher = jest.fn((updater: MockState | ((prev: MockState) => MockState)) => {
    mockState.value = typeof updater === 'function' ? updater(mockState.value) : updater
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockState.value = {
      other: '-',
      value: 0
    }
  })


  describe('derivePartialStateDispatch', () => {
    test('should generate partial setter', () => {
      const dispatcher = derivePartialStateDispatch(originalDispatcher, state => state.value, (prev, value) => ({
        ...prev,
        value
      }))

      dispatcher(3)
      expect(mockState.value).toEqual({other: '-', value: 3})

      dispatcher(prev => prev + 1)
      expect(mockState.value).toEqual({other: '-', value: 4})
    })
  })

  describe('derivePartialStateUpdate', () => {
    test('should generate partial setter', () => {
      const useOriginalDispatcher = () => originalDispatcher

      const useValueDispatcher = derivePartialStateUpdate(useOriginalDispatcher, state => state.value, (prev, value) => ({
        ...prev,
        value
      }))

      useValueDispatcher()(3)
      expect(mockState.value).toEqual({other: '-', value: 3})

      useValueDispatcher()(prev => prev + 1)
      expect(mockState.value).toEqual({other: '-', value: 4})
    })
  })

  describe('derivePropStateDispatch', () => {
    test('should generate partial setter', () => {
      const dispatcher = derivePropStateDispatch(originalDispatcher, 'value')

      dispatcher(13)
      expect(mockState.value).toEqual({other: '-', value: 13})

      dispatcher(prev => prev + 2)
      expect(mockState.value).toEqual({other: '-', value: 15})
    })
  })

  describe('derivePropStateUpdate', () => {
    test('should generate partial setter', () => {
      const useOriginalDispatcher = () => originalDispatcher

      const useDispatcher = derivePropStateUpdate(useOriginalDispatcher, 'value')

      useDispatcher()(13)
      expect(mockState.value).toEqual({other: '-', value: 13})

      useDispatcher()(prev => prev + 2)
      expect(mockState.value).toEqual({other: '-', value: 15})
    })

    test('should generate partial setter with specific join function', () => {
      const useOriginalDispatcher = () => originalDispatcher

      const useDispatcher = derivePropStateUpdate(
        useOriginalDispatcher,
        'value',
        (prev, value) => ({
          other: `${prev.other} => ${value}`,
          value
        })
      )

      useDispatcher()(13)
      expect(mockState.value).toEqual({other: '- => 13', value: 13})

      useDispatcher()(prev => prev + 2)
      expect(mockState.value).toEqual({other: '- => 13 => 15', value: 15})
    })
  })

  describe('deriveStateAction', () => {
    test('should generate action function', () => {
      const useOriginalDispatcher = () => originalDispatcher

      const useAction = deriveStateAction(useOriginalDispatcher, () => (prev => ({...prev, value: prev.value + 1})))

      const action = useAction()
      action()

      expect(originalDispatcher).toHaveBeenCalledTimes(1)
      expect(mockState.value).toEqual({other: '-', value: 1})
    })

    test('should generate action function with parameters', () => {
      const useOriginalDispatcher = () => originalDispatcher

      const useAction = deriveStateAction(useOriginalDispatcher, (inc: number) => (prev => ({
        ...prev,
        value: prev.value + inc
      })))

      const action = useAction()

      action(1)
      action(3)

      expect(originalDispatcher).toHaveBeenCalledTimes(2)
      expect(mockState.value).toEqual({other: '-', value: 4})
    })
  })

  describe('derivePartialStateAction', () => {
    test('should generate action function', () => {
      const useOriginalDispatcher = () => originalDispatcher

      const useAction = derivePartialStateAction(
        useOriginalDispatcher,
        state => state.value,
        (prev, value) => ({...prev, value}),
        () => (prev => prev + 1)
      )

      const action = useAction()
      action()

      expect(originalDispatcher).toHaveBeenCalledTimes(1)
      expect(mockState.value).toEqual({other: '-', value: 1})
    })

    test('should generate action function with parameters', () => {
      const useOriginalDispatcher = () => originalDispatcher

      const useAction = derivePartialStateAction(
        useOriginalDispatcher,
        state => state.value,
        (prev, value) => ({...prev, value}),
        (inc: number) => (prev => prev + inc)
      )

      const action = useAction()

      action(1)
      action(3)

      expect(originalDispatcher).toHaveBeenCalledTimes(2)
      expect(mockState.value).toEqual({other: '-', value: 4})
    })
  })

  describe('derivePropStateAction', () => {
    test('should generate action function', () => {
      const useOriginalDispatcher = () => originalDispatcher

      const useAction = derivePropStateAction(
        useOriginalDispatcher,
        'value',
        () => (prev => prev + 1)
      )

      const action = useAction()
      action()

      expect(originalDispatcher).toHaveBeenCalledTimes(1)
      expect(mockState.value).toEqual({other: '-', value: 1})
    })

    test('should generate action function with parameters', () => {
      const useOriginalDispatcher = () => originalDispatcher

      const useAction = derivePropStateAction(
        useOriginalDispatcher,
        'value',
        (inc: number) => (prev => prev + inc)
      )

      const action = useAction()

      action(1)
      action(3)

      expect(originalDispatcher).toHaveBeenCalledTimes(2)
      expect(mockState.value).toEqual({other: '-', value: 4})
    })
  })
})
