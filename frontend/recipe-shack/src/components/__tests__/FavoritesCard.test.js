import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FavoritesCard from '../FavoritesCard';
import axios from 'axios';

jest.mock('axios');

describe('FavoritesCard', () => {
const onDelete = jest.fn();
const defaultProps = {
id: 1,
title: 'Test Recipe',
imageSrc: 'test_image.jpg',
onDelete: onDelete,
};

test('Renders card with correct title', () => {
render(<FavoritesCard {...defaultProps} />);
expect(screen.getByText('Test Recipe')).toBeInTheDocument();
});

test('Renders card with correct image', () => {
render(<FavoritesCard {...defaultProps} />);
const image = screen.getByAltText('Test Recipe');
expect(image).toHaveAttribute('src', 'test_image.jpg');
});

test('Clicking the delete button calls onDelete with id', async () => {
axios.post.mockResolvedValue({ status: 200 });

render(<FavoritesCard {...defaultProps} />);
fireEvent.click(screen.getByLabelText('Favorite'));
await expect(axios.post).toHaveBeenCalled();
expect(onDelete).toHaveBeenCalledWith(1);
});

test('Renders a link to the correct Food.com URL', () => {
render(<FavoritesCard {...defaultProps} />);
const link = screen.getByRole('link');
expect(link).toHaveAttribute('href', 'https://www.food.com/recipe/test-recipe-1');
});
});