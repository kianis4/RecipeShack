import React from 'react';
import { render, screen } from '@testing-library/react';
import FavoritesSearch from '../FavoritesSearch';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

const mockFavorites = [
  {
    ID: 1,
    Name: 'Test Recipe 1',
    ImageURL: 'http://example.com/test1.jpg',
  },
  {
    ID: 2,
    Name: 'Test Recipe 2',
    ImageURL: 'http://example.com/test2.jpg',
  },
];

describe('FavoritesSearch', () => {
  it('renders FavoritesSearch and fetches favorites', async () => {
    axios.get.mockResolvedValue({ data: { data: mockFavorites } });

    await act(async () => {
      render(<FavoritesSearch />);
    });

    expect(screen.getByText('Search Favorites')).toBeInTheDocument();
    expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
    expect(screen.getByText('Test Recipe 2')).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/getfavorites/');
  });
});