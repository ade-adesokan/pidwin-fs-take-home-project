import { fireEvent, render, screen } from '@testing-library/react';
import CoinToss from './CoinToss';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import reducers from '../../reducers';
import { thunk } from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { tossCoin } from '../../actions/tossCoin';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../actions/tossCoin', () => ({
  tossCoin: jest.fn(),
}));


describe('CoinToss', () => {
  beforeEach(() => {
    useDispatch.mockClear();
    useSelector.mockClear();
    tossCoin.mockClear();
  });

  it('Should render the CoinToss component', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CoinToss />
        </BrowserRouter>
      </Provider>,
    );
  
    expect(screen.getByRole('spinbutton', {name: /wager/i })).toBeTruthy();
    expect(screen.getByRole('radiogroup')).toBeTruthy();
    expect(screen.getByRole('radio', {name: /head/i}).checked).toEqual(true);
    expect(screen.getByRole('radio', {name: /tail/i}).checked).toEqual(false);
    expect(screen.getByRole('button', {name: /toss coin/i})).toBeTruthy();
  });

  it('Should submit coin toss action with a wager amount', () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <CoinToss />
        </BrowserRouter>
      </Provider>,
    );
  
    const wagerInput = screen.getByRole('spinbutton', {name: /wager/i });
    const tossCoinBtn = screen.getByRole('button', { name: /toss coin/i });

    fireEvent.change(wagerInput, { target: { value: '20' } })
    expect(screen.getByRole('spinbutton', {name: /wager/i }).value).toBe("20");
    fireEvent.click(tossCoinBtn);
    expect(tossCoin).toHaveBeenCalledWith({ wager: '20', toss: 'head' });
    expect(mockDispatch).toHaveBeenCalledTimes(1)
  });
})
