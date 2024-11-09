import {
  createFractaStore,
  deriveIdentityStateSelector,
  derivePropSelector,
  deriveStateSelector,
  derivePartialStateUpdate,
  derivePropStateUpdate
} from "./index";

describe('index exports', () => {
  test('should be provided', () => {
    expect(createFractaStore).toEqual(expect.any(Function))
    expect(derivePartialStateUpdate).toEqual(expect.any(Function))
    expect(derivePropStateUpdate).toEqual(expect.any(Function))
    expect(deriveStateSelector).toEqual(expect.any(Function))
    expect(derivePropSelector).toEqual(expect.any(Function))
    expect(deriveIdentityStateSelector).toEqual(expect.any(Function))
  })
})
