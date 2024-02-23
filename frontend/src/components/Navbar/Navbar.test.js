import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import reducers from '../../reducers';
import { thunk } from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { when } from 'jest-when';

const store = createStore(reducers, compose(applyMiddleware(thunk)));
const mockLocalStorage = () => {
  const getItemMock = jest.fn();

  beforeEach(() => {
    Storage.prototype.getItem = getItemMock;
  });

  afterEach(() => {
    getItemMock.mockRestore();
  });

  return { getItemMock };
};
const { getItemMock } = mockLocalStorage();
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ0ZXN0X2lkIiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdHVzZXJAeW9wbWFpbC5jb20iLCJpYXQiOjE3MDg2NTY1NTAsImV4cCI6MTcwODY2MDE1MH0.T7R-LiEPPyJgiia3EvwTwwx-izp6QmI6d0Kd9oIXZao"

describe('Navbar not authenticated', () => {
  it('Renders Navbar with Login button', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>,
    );
  
    expect(screen.getByRole('link', { name: /cointoss/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /login/i })).toBeTruthy();
  });
})

describe('Navbar authenticated', () => {
  beforeEach(() => {
    when(getItemMock).calledWith('token').mockReturnValue('{"token":100}');
    when(getItemMock).calledWith('profile').mockReturnValue(`{"token": "${testToken}"}`);
  })

  it('Renders Navbar with username and token value', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>,
    );
  
    expect(screen.getByRole('heading', { name: /Test User/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /100 tokens/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /logout/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /set password/i })).toBeTruthy();
  });
})