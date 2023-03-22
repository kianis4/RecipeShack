import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CaloriesModal from '../CaloriesModal';

describe('CaloriesModal', () => {
const renderModal = () => {
render(<CaloriesModal callback={() => {}} />);
fireEvent.click(screen.getByText('Calories'));
};

test('Modal opens when button is clicked', () => {
render(<CaloriesModal callback={() => {}} />);
fireEvent.click(screen.getByText('Calories'));
expect(screen.getByText('Number of Calories')).toBeInTheDocument();
});

test('Modal closes when close button is clicked', () => {
renderModal();
fireEvent.click(screen.getByLabelText('Close'));
expect(screen.queryByText('Number of Calories')).not.toBeInTheDocument();
});

test('Select a calorie range', () => {
renderModal();
fireEvent.click(screen.getByText('0-250'));
expect(screen.getByText('0-250')).toHaveStyle('background-color: teal');
});

test('Apply filter and check button background color', () => {
renderModal();
fireEvent.click(screen.getByText('0-250'));
fireEvent.click(screen.getByText('Apply'));
expect(screen.getByText('Calories')).toHaveStyle('background-color: teal');
});
});