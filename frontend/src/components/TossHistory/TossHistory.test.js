/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import TossHistory from './TossHistory';
import * as api from '../../api';
import * as messages from '../../messages';
import { useSelector } from 'react-redux';
import { act } from 'react-dom/test-utils';

// Mocking useSelector
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Mocking api.getTosses function
jest.mock('../../api', () => ({
  getTosses: jest.fn(),
}));

// Mocking messages.error function
jest.mock('../../messages', () => ({
  error: jest.fn(),
}));

describe('TossHistory', () => {
  beforeEach(() => {
    useSelector.mockClear();
    api.getTosses.mockClear();
    messages.error.mockClear();
  });

  it('should fetch and render toss history table', async () => {
    const mockTossHistoryData = [
      { _id: '1', wager: 50, toss: 'head', win: true },
      { _id: '2', wager: 100, toss: 'tail', win: false },
    ];

    // Mock useSelector to return mock data
    useSelector.mockReturnValue(mockTossHistoryData);

    // Mock api.getTosses to resolve with mock data
    api.getTosses.mockResolvedValue({ data: mockTossHistoryData });

    await act(async() => {
      render(<TossHistory />)
    });

    // Ensure table title text is present
    expect(screen.getByRole('heading', { name: /toss history/i })).toBeTruthy();

    const rowOne = screen.getByRole('row', {name: /50 head/i});
    expect(within(rowOne).getByRole('cell', {name: /50/i})).toBeTruthy();
    expect(within(rowOne).getByRole('cell', {name: /head/i})).toBeTruthy();
    expect(within(rowOne).getByTestId('CheckIcon')).toBeTruthy();

    // Ensure api.getTosses is called with correct parameters
    expect(api.getTosses).toHaveBeenCalledWith({ limit: 10 });

    // Ensure messages.error is not called
    expect(messages.error).not.toHaveBeenCalled();
  });

  it('should handle error fetching toss history', async () => {
    // Mock useSelector to return empty data
    useSelector.mockReturnValue(null);

    // Mock api.getTosses to reject with an error
    api.getTosses.mockRejectedValue({ response: { data: { message: 'Fetch error' } } });

    await act(async() => {
      render(<TossHistory />)
    });

    // Ensure table title text is present
    expect(screen.getByRole('heading', { name: /toss history/i })).toBeTruthy();

    // Ensure messages.error is called with correct message
    expect(messages.error).toHaveBeenCalledWith('Fetch error');

    // Ensure api.getTosses is called with correct parameters
    expect(api.getTosses).toHaveBeenCalledWith({ limit: 10 });
  });
});
