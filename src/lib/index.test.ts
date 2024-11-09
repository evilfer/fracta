import {
  createFractaStore,
  deriveIdentityStateSelector,
  derivePartialStateAction,
  derivePartialStateUpdate,
  derivePropSelector,
  derivePropStateAction,
  derivePropStateUpdate,
  deriveStateAction,
  deriveStateSelector,
  transformSelector
} from "./index";

describe('index exports', () => {
  test('should be provided', () => {
    expect(createFractaStore).toEqual(expect.any(Function))
    expect(derivePartialStateUpdate).toEqual(expect.any(Function))
    expect(derivePropStateUpdate).toEqual(expect.any(Function))
    expect(deriveStateSelector).toEqual(expect.any(Function))
    expect(derivePropSelector).toEqual(expect.any(Function))
    expect(deriveIdentityStateSelector).toEqual(expect.any(Function))
    expect(derivePartialStateAction).toEqual(expect.any(Function))
    expect(derivePropStateAction).toEqual(expect.any(Function))
    expect(deriveStateAction).toEqual(expect.any(Function))
    expect(transformSelector).toEqual(expect.any(Function))
  })
})
