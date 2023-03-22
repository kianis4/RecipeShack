import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import LoginPage from '../LoginPage';
import axios from 'axios';

jest.mock('axios');

describe('LoginPage', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { status: false } });
    axios.post.mockResolvedValue({ data: { status: false, error_message: '' } });
  });

  it('renders LoginPage with input fields, buttons and links', () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show/i })).toBeInTheDocument();
    expect(screen.getByText(/new to us\?/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('triggers axios.post on login button click', async () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it('displays login error when data contains an error message', async () => {
    axios.post.mockResolvedValue({
      data: {
        status: false,
        error_message: 'Invalid username or password.',
      },
    });

    render(<LoginPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/login error/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  it('navigates to the signup page when clicking the sign up link', () => {
    const { getByText, container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" render={() => <div>Sign Up Page</div>} />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/sign up/i));
    expect(container.innerHTML).toMatch('Sign Up Page');
  });
});

/** This test checks if the LoginPage component renders correctly with input fields, buttons, and links.
 *  It also tests if the axios.post function is called when the login button is clicked,
 *  if the login error is displayed when the data contains an error message, and if it navigates to the signup page when clicking the sign up link.

Note that these tests use axios mock to simulate API responses. Adjust the mocked values according to your actual API response structure if needed.
 Also, the test uses MemoryRouter from react-router-dom to wrap the component and simulate navigation between routes. */
