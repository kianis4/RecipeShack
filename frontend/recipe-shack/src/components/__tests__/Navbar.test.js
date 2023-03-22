import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Navbar';
import axios from 'axios';

jest.mock('axios');

describe('Navbar', () => {
  it('renders Navbar with username and buttons', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: 'JohnDoe',
      },
    });

    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(await screen.findByText('Hi JohnDoe')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('triggers axios.post on Logout button click', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: 'JohnDoe',
      },
    });
    axios.post.mockResolvedValue({});

    render(
      <Router>
        <Navbar />
      </Router>
    );

    const logoutButton = await screen.findByText('Logout');
    fireEvent.click(logoutButton);

    expect(axios.post).toHaveBeenCalled();
  });
});

/** This test checks if the Navbar component renders correctly with the username and buttons.
 * It also tests if the axios.post function is called when the Logout button is clicked.
 * Make sure to adjust the test based on the expected behavior of the component.
Note that these tests use axios mock to simulate API responses. Adjust the mocked values according to
the actual API response structure if needed.*/
