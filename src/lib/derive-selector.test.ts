import {
  deriveIdentityStateSelector,
  derivePropSelector,
  deriveStateSelector,
  transformSelector
} from "./derive-selector";
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
      expect(useStateSelect).toHaveBeenCalledWith(selector)
    })
  })

  describe('deriveIdentityStateSelector', () => {
    test('should provide identity selector', () => {
      const useStateSelect = jest.fn(<S>(selector: (state: string) => S) => selector('test-string')) as StateSelectHook<string>

      const useIdentitySelect = deriveIdentityStateSelector(useStateSelect)

      const result = useIdentitySelect()
      expect(useStateSelect).toHaveBeenCalledTimes(1)
      expect(result).toBe('test-string')
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

  describe('transformSelector', () => {
    test('should combine selector and transformation', () => {
      const useSelector = () => "bla"
      const tx = (value: string) => value.length

      const useTxSelector = transformSelector(useSelector, tx)

      const result = useTxSelector()
      expect(result).toEqual(3)
    })
  })
})
