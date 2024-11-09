import {derivePartialStateDispatch, derivePropStateDispatch, derivePartialStateUpdate, derivePropStateUpdate} from "./derive-dispatcher";

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
  })
})
