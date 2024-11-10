## 0.0.6 (November 10, 2024)

- Refactored action helpers, so they behave like regular react hooks.

## 0.0.5 (November 10, 2024)

- Updated helper `derivePropStateUpdate`, adding optional parameter for complex state updates, where updates to the
  selected property have an effect on other properties.

## 0.0.4 (November 9, 2024)

- Fixed issue with published package contents.

## 0.0.3 (November 9, 2024)

- Refactored select hooks. `useSelect` and derived selectors how accept optionally an
  an additional selector as argument. However, they can be used without arguments.
- Added helper functions to generate update hooks: `deriveStateAction`, `derivePartialStateAction`,
  `derivePropStateAction`.

## 0.0.2 (November 9, 2024)

- Added helper function `transformSelector`

## 0.0.1 (November 9, 2024)

- Initial public release
