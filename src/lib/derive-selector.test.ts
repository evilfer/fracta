import {derivePropSelector, deriveStateSelector} from "./derive-selector";
import {StateSelectHook} from "./types";


describe('combine selectors', () => {
  describe('deriveStateSelector', () => {
    test('should combine select hook with selector', () => {
      const useStateSelect = jest.fn(<S>(selector: (state: string) => S) => selector('test-string')) as StateSelectHook<string>
      const selector = jest.fn((state: string) => state.length)

      const useLengthSelect = deriveStateSelector(useStateSelect, selector)

      const result = useLengthSelect()
      expect(result).toBe(11)

      expect(selector).toHaveBeenCalledTimes(1)
      expect(selector).toHaveBeenCalledWith('test-string')

      expect(useStateSelect).toHaveBeenCalledTimes(1)
    })

    test('should combine select hook with selector, using an additional selector', () => {
      const useStateSelect = jest.fn(<S>(selector: (state: string) => S) => selector('test-string')) as StateSelectHook<string>
      const selector = jest.fn((state: string) => state.length)

      const useLengthSelect = deriveStateSelector(useStateSelect, selector)

      const signSelector = jest.fn((state: number) => Math.sign(state))

      const result = useLengthSelect(signSelector)
      expect(result).toBe(1)

      expect(selector).toHaveBeenCalledTimes(1)
      expect(selector).toHaveBeenCalledWith('test-string')

      expect(useStateSelect).toHaveBeenCalledTimes(1)
      expect(signSelector).toHaveBeenCalledTimes(1)

      expect(signSelector).toHaveBeenCalledWith(11)
    })
  })

  describe('derivePropSelector', () => {
    test('should generate selector based on property', () => {
      const useStateSelect = jest.fn(<S>(selector: (state: {
        count: number,
        name: string
      }) => S) => selector({count: 10, name: 'fracta'})) as StateSelectHook<{ count: number, name: string }>

      const useNameSelect = derivePropSelector(useStateSelect, 'name')

      const result = useNameSelect()
      expect(useStateSelect).toHaveBeenCalledTimes(1)
      expect(result).toBe('fracta')
    })
  })
})
