import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Sign Up form heading', () => {
  render(<App />);
  // Specifically targeting the heading "Sign Up"
  const headingElement = screen.getByRole('heading', { name: /Sign Up/i });
  expect(headingElement).toBeInTheDocument();
});

test('renders the Sign Up button', () => {
  render(<App />);
  // Specifically targeting the button "Sign Up"
  const buttonElement = screen.getByRole('button', { name: /Sign Up/i });
  expect(buttonElement).toBeInTheDocument();
});
