import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RecipeCard from '../RecipeCard';
import axios from 'axios';

jest.mock('axios');

describe('RecipeCard', () => {
  const defaultProps = {
    id: '123',
    title: 'Delicious Recipe',
    imageSrc: 'https://via.placeholder.com/200',
    favorites: [],
  };

  it('renders RecipeCard with title, image, and favorite button', () => {
    render(<RecipeCard {...defaultProps} />);

    expect(screen.getByText('Delicious Recipe')).toBeInTheDocument();
    expect(screen.getByAltText('Delicious Recipe')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('triggers axios.post on favorite button click', () => {
    axios.post.mockResolvedValue({});

    render(<RecipeCard {...defaultProps} />);

    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);

    expect(axios.post).toHaveBeenCalled();
  });

  it('toggles favorite button state on click', () => {
    axios.post.mockResolvedValue({});

    render(<RecipeCard {...defaultProps} />);

    const favoriteButton = screen.getByRole('button');
    const initialBackgroundColor = favoriteButton.style.background;

    fireEvent.click(favoriteButton);
    const changedBackgroundColor = favoriteButton.style.background;

    expect(initialBackgroundColor).not.toEqual(changedBackgroundColor);
  });
});

/**This test checks if the RecipeCard component renders correctly with the title, image, and favorite button.
 *  It also tests if the axios.post function is called when the favorite button is clicked and if the favorite button's background color toggles on click.
 *  Make sure to adjust the test based on the expected behavior of the component.
 * 
Note that these tests use axios mock to simulate API responses. Adjust the mocked values according to your actual API response structure if needed. */