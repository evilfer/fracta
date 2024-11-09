import React, {useState} from "react";
import {fireEvent, render} from "@testing-library/react";
import '@testing-library/jest-dom';
import {useTrackingRef} from "./use-tracking-ref";

describe('useTrackingRef', () => {
  const MockComponent = jest.fn(<T extends string | null | number, >({value}: { value: T }) => {
    const tr = useTrackingRef(value)

    return <div data-testid="track-container">{tr.current}</div>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should track value', () => {
    const Wrapper = () => {
      const [value, setValue] = useState(1)

      return (
        <div>
          <button onClick={() => setValue(2)} data-testid={'update-button'}>inc</button>
          <MockComponent value={value}/>
        </div>
      )
    }
    const {getByTestId} = render(<Wrapper/>)
    expect(getByTestId('track-container')).toHaveTextContent('1')
    fireEvent.click(getByTestId('update-button'))
    expect(getByTestId('track-container')).toHaveTextContent('2')
  })
})
