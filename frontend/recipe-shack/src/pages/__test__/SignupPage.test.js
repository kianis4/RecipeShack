import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import SignupPage from '../SignupPage';
import axios from 'axios';

jest.mock('axios');

describe('SignupPage', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { status: false } });
    axios.post.mockResolvedValue({ data: { status: false, error_message: '' } });
  });

  it('renders SignupPage with input fields, buttons and links', () => {
    render(<SignupPage />, { wrapper: MemoryRouter });

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('triggers axios.post on signup button click', async () => {
    render(<SignupPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testpassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'testpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it('displays signup error when data contains an error message', async () => {
    axios.post.mockResolvedValue({
      data: {
        status: false,
        error_message: 'Username already exists.',
      },
    });

    render(<SignupPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testpassword' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'testpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(screen.getByText(/signup error/i)).toBeInTheDocument();
      expect(screen.getByText(/username already exists/i)).toBeInTheDocument();
    });
  });

  it('navigates to the login page when clicking the login link', () => {
    const { getByText, container } = render(
      <MemoryRouter initialEntries={['/signup']}>
        <Route path="/signup" component={SignupPage} />
        <Route path="/" render={() => <div>Login Page</div>} />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/login/i));
    expect(container.innerHTML).toMatch('Login Page');
  });
});

/** This test checks if the SignupPage component renders correctly with input fields, buttons, and links.
 *  It also tests if the axios.post function is called when the signup button is clicked,
 *  if the signup error is displayed when the data contains an error message,
 *  and if it navigates to the login page when clicking the login link.

Note that these tests use axios mock to simulate API responses.
 Adjust the mocked values according to your actual API response structure if needed.
  Also, the test uses ` */
