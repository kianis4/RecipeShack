import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CookTimeModal from '../CookTimeModal';

describe('CookTimeModal', () => {
const renderModal = () => {
render(<CookTimeModal callback={() => {}} />);
fireEvent.click(screen.getByText('Cook Time'));
};

test('Modal opens when button is clicked', () => {
render(<CookTimeModal callback={() => {}} />);
fireEvent.click(screen.getByText('Cook Time'));
expect(screen.getByText('Cook Time')).toBeInTheDocument();
});

test('Modal closes when close button is clicked', () => {
renderModal();
fireEvent.click(screen.getByLabelText('Close'));
expect(screen.queryByText('Cook Time')).not.toBeInTheDocument();
});

test('Select a cook time range', () => {
renderModal();
fireEvent.click(screen.getByText('0 - 15 M'));
expect(screen.getByText('0 - 15 M')).toHaveStyle('background-color: teal');
});

test('Apply filter and check button background color', () => {
renderModal();
fireEvent.click(screen.getByText('0 - 15 M'));
fireEvent.click(screen.getByText('Apply'));
expect(screen.getByText('Cook Time')).toHaveStyle('background-color: teal');
});
});