# fracta

Lightweight, decentralised, performance react app state store.

## Installation

```
# NPM
npm install fracta

# Yarn
yarn add fracta
```

## Usage

- `store.ts`

```typescript jsx
// store.ts
import {createFractaStore, deriveStateSelector, derivePropStateUpdate} from "fracta"

const [CounterProvider, useSelect, useUpdate] = createFractaStore({count: 0})

export {CounterProvider}
export const useSelectCount = deriveStateSelector(useSelect, state => state.count)
export const useIncrementCount = derivePropStateUpdate(useUpdate, 'count') 
```

- `App.tsx`

```typescript jsx
// App.tsx
import {CounterProvider} from "./store"
import {Consumer} from "./Consumer"

export function App() {
  return (
    <Provider>
      <Consumer/>
    </Provider>
  )
}
```

- `Consumer.tsx`

```typescript jsx
// Consumer.tsx
import {useSelectCount, useIncrementCount} from "./store"

export function Consumer() {
  const count = useSelectCount()
  const incrementCount = useIncrementCount()

  return (
    <button onClick={() => incrementCount()}>
      increment ({count})
    </button>
  )
}
```

## Goals

### Decentralised store

`createFractaStore` can be used multiple times within an application, to create multiple independent stores.

Store `Providers` can be used at the root of an application, making the state available to all child
components.

At the same time, it is also possible to have separate stores that apply only to a section of the application.
`Providers` can be unmounted from the application, for instance when the user navigates away from a section of 
the application. Please note that unmounting a `Provider` removes its state from memory, so mounting it again
would result in a new store with independent content.

### Reusable stores

Stores generated with `createFractaStore` are not singletons, but can be used multiple times independently.

For example, the counter store in the example above could be reused to have two independent counters:

```typescript jsx
// App.tsx
import {CounterProvider} from "./store"
import {Consumer} from "./Consumer"

export function App() {
  return (
    <div>
      <Provider>
        <Consumer/>
      </Provider>
      <Provider>
        <Consumer/>
      </Provider>
    </div>
  )
}
```

### Performant

`fracta` reduces the number of component renders by checking that the actual values used from the store state
have changed. For this reason, using a selector is always required:

```typescript jsx
function MyCountComponent () {
    const count = useSelect(state => state.count)
    // ...
```

Or, using a helper function:

```typescript jsx
const useSelectCount = deriveStateSelector(useSelect, state => state.count)

function MyCountComponent () {
  const count = useSelectCount()
  // ...
```

Or, using a different helper function, for trivial cases:

```typescript jsx
const useSelectCount = derivePropSelector(useSelect, 'count')

function MyCountComponent () {
  const count = useSelectCount()
  // ...
```

Updates to the store state that modify `count` will trigger a re-render of `MyCountComponent`. 
On the other hand, updates that do not modify `count`, will not trigger any update.

Dispatching a state update on `useUpdate` does not trigger a re-render of `Provider` or its children. 
Only components that use a selector returning new values would be re-rendered.
