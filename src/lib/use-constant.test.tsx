import React from "react";
import {render} from "@testing-library/react";
import '@testing-library/jest-dom';
import {useConstant} from "./use-constant";

describe('useConstant', () => {

  const MockComponent = jest.fn(<T extends number | null | string, >({init}: { init: () => T }) => {
    const c = useConstant(init)

    return <div data-testid="const-container">{c}</div>
  })

  afterEach(() => {

    jest.clearAllMocks()
  })

  test('should render value', () => {
    const {getByTestId} = render(<MockComponent init={() => 1}/>)
    expect(getByTestId('const-container')).toHaveTextContent('1')
  })

  test('should call init function only once', () => {
    const init = jest.fn(() => 1)
    const {getByTestId, rerender} = render(<MockComponent init={init}/>)

    expect (MockComponent).toHaveBeenCalledTimes(1)
    expect (init).toHaveBeenCalledTimes(1)

    rerender(<MockComponent init={init}/>)
    expect (MockComponent).toHaveBeenCalledTimes(2)
    expect (init).toHaveBeenCalledTimes(1)

    expect(getByTestId('const-container')).toHaveTextContent('1')
  })

  test('should ignore changes to init function', () => {
    const {getByTestId, rerender} = render(<MockComponent init={() => 'c1'}/>)
    expect(getByTestId('const-container')).toHaveTextContent('c1')

    const secondInit = jest.fn(() => 'c2')
    rerender(<MockComponent init={secondInit}/>)
    expect(secondInit).not.toHaveBeenCalled()
    expect(getByTestId('const-container')).toHaveTextContent('c1')
  })
})
