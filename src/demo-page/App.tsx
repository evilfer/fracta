import React from "react";
import {createFractaStore, derivePropSelector, derivePropStateAction, derivePropStateUpdate} from "../lib";


const [Provider, useSelect, useDispatch] = createFractaStore({count: 1, name: 'world', count2: 10})

const useUpdateCount = derivePropStateUpdate(useDispatch, 'count')
const useCount = derivePropSelector(useSelect, 'count')
const useIncCount = derivePropStateAction(useDispatch, 'count', () => prev => prev + 1)

export function App() {
  return (
    <div>
      <Provider>
        <Child1/>
        <Child2/>
        <Provider>
          <Child1/>
          <Child2/>
        </Provider>
      </Provider>
      <Provider>
        <Child1/>
        <Child2/>
        <Child3/>
      </Provider>
    </div>
  )
}

function Child1() {
  const value = useSelect(v => v.count)

  return <div>{value}</div>
}

function Child2() {
  const value = useSelect(v => v.name)
  const dispatch = useUpdateCount()

  return <div>
    {value}
    <button onClick={() => dispatch(prev => prev + 1)}>clickme</button>
  </div>
}


function Child3() {
  const value1 = useCount()
  const value2 = useSelect(v => v.count2)
  const dispatch = useDispatch()
  const incCount = useIncCount()

  return <div>
    {value1} {value2}
    <button onClick={() => dispatch(prev => ({
      ...prev,
      count: prev.count + 1,
      count2: prev.count2 + 1
    }))}>clickme
    </button>
    <button onClick={incCount}>inc count action</button>
  </div>
}
