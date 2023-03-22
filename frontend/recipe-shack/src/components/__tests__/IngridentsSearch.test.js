import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import IngredientsSearch from '../IngredientsSearch';
import { myIngredients } from '../ingredients';

describe('IngredientsSearch', () => {
  it('renders IngredientsSearch and selects an ingredient', () => {
    const callback = jest.fn();
    render(<IngredientsSearch callback={callback} />);

    const input = screen.getByPlaceholderText('Type an ingredient');
    fireEvent.change(input, { target: { value: 'Test Ingredient' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('Add ingredients')).toBeInTheDocument();
    expect(screen.getByText('Test Ingredient')).toBeInTheDocument();
    expect(callback).toHaveBeenCalledWith(['Test Ingredient']);
  });
});

/** 
This test checks if the IngredientsSearch component renders correctly and simulates the selection of an ingredient.
Make sure to adjust the test based on the expected behavior of the component.
Note that this test assumes that myIngredients includes an item with the
label 'Test Ingredient'. If your myIngredients array doesn't include such an item,
you should add it to the test file or adjust the test to use an existing ingredient from myIngredients.
*/