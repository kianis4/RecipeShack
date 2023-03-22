import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RatingModal from '../RatingModal';

describe('RatingModal', () => {
const renderModal = () => {
render(<RatingModal callback={() => {}} />);
fireEvent.click(screen.getByText('Ratings'));
};

test('Modal opens when button is clicked', () => {
render(<RatingModal callback={() => {}} />);
fireEvent.click(screen.getByText('Ratings'));
expect(screen.getByText('Select Rating')).toBeInTheDocument();
});

test('Modal closes when close button is clicked', () => {
renderModal();
fireEvent.click(screen.getByLabelText('Close'));
expect(screen.queryByText('Select Rating')).not.toBeInTheDocument();
});

test('Select a rating', () => {
renderModal();
fireEvent.click(screen.getByText('1 Star'));
expect(screen.getByText('1 Star')).toHaveStyle('background-color: teal');
});

test('Apply filter and check button background color', () => {
renderModal();
fireEvent.click(screen.getByText('1 Star'));
fireEvent.click(screen.getByText('Apply'));
expect(screen.getByText('Ratings')).toHaveStyle('background-color: teal');
});
});