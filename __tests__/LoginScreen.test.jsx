import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen'; // No need for .js if using proper extensions

describe('LoginScreen UI', () => {
  it('renders the Google Sign-In title and button', () => {
    const { getByText } = render(<LoginScreen navigation={{}} />);
    
    // Make sure text content is correct
    expect(getByText('Google Sign-In')).toBeTruthy();
    expect(getByText('Sign in with Google')).toBeTruthy();
  });

  it('simulates button press', () => {
    const { getByText } = render(<LoginScreen navigation={{}} />);
    const button = getByText('Sign in with Google');

    // Trigger the press
    fireEvent.press(button);

    // Add your actual assertion logic here, maybe checking if a mock function was called
    expect(true).toBe(true); // Placeholder
  });
});

