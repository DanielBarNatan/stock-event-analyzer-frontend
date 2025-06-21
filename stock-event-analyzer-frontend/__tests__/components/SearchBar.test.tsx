/// <reference types="jest" />

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../../components/SearchBar';

// Mock the API call
jest.mock('../../utils/api', () => ({
  getApiBaseUrl: jest.fn(() => 'http://localhost:4000')
}));

// Mock fetch
const mockFetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ event: 'Test Event', date: '2023-01-01', analysis: 'Test Analysis' }),
  })
) as jest.Mock;

global.fetch = mockFetch;

describe('SearchBar Component', () => {
  const mockOnSearchResults = jest.fn();
  const mockOnLoading = jest.fn();
  const mockSetSearchValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search bar correctly', () => {
    render(
      <SearchBar 
        onSearchResults={mockOnSearchResults} 
        onLoading={mockOnLoading}
        searchValue=""
        setSearchValue={mockSetSearchValue}
      />
    );
    
    expect(screen.getByPlaceholderText(/search events or stocks/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('updates input value when user types', () => {
    render(
      <SearchBar 
        onSearchResults={mockOnSearchResults} 
        onLoading={mockOnLoading}
        searchValue=""
        setSearchValue={mockSetSearchValue}
      />
    );
    
    const input = screen.getByPlaceholderText(/search events or stocks/i);
    fireEvent.change(input, { target: { value: 'COVID-19' } });
    
    expect(mockSetSearchValue).toHaveBeenCalledWith('COVID-19');
  });

  it('submits the form and calls API', async () => {
    render(
      <SearchBar 
        onSearchResults={mockOnSearchResults} 
        onLoading={mockOnLoading}
        searchValue="COVID-19"
        setSearchValue={mockSetSearchValue}
      />
    );
    
    const formElement = document.querySelector('form');
    fireEvent.submit(formElement!);
    
    expect(mockOnLoading).toHaveBeenCalledWith(true);
    
    // Wait for the API call to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(mockFetch).toHaveBeenCalled();
    expect(mockOnSearchResults).toHaveBeenCalled();
    expect(mockOnLoading).toHaveBeenCalledWith(false);
  });
}); 