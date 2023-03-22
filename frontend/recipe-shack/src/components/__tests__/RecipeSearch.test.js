import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import RecipeSearch from '../RecipeSearch';
import axios from 'axios';

jest.mock('axios');

describe('RecipeSearch', () => {
  const defaultProps = {
    ingredients: [],
  };

  beforeEach(() => {
    axios.post.mockResolvedValue({ data: { data: [] } });
    axios.get.mockResolvedValue({ data: { data: [] } });
  });

  it('renders RecipeSearch with input field, search button, and filter modals', () => {
    render(<RecipeSearch {...defaultProps} />);

    expect(screen.getByPlaceholderText('Enter dish name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /apply/i })).toHaveLength(3);
  });

  it('triggers axios.post on search button click', async () => {
    render(<RecipeSearch {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText('Enter dish name'), {
      target: { value: 'Pizza' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it('displays recipe cards when data is returned', async () => {
    axios.post.mockResolvedValue({
      data: {
        data: [
          {
            Name: 'Test Recipe',
            ImageURL: 'https://via.placeholder.com/200',
            ID: '123',
          },
        ],
      },
    });

    render(<RecipeSearch {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText('Enter dish name'), {
      target: { value: 'Pizza' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });
  });
});


/** This test checks if the RecipeSearch component renders correctly with the input field, search button, and filter modals.
 *  It also tests if the axios.post function is called when the search button is clicked and if the recipe cards are displayed when the data is returned.
Note that these tests use axios mock to simulate API responses. Adjust the mocked values according to your actual API response structure if needed. */
