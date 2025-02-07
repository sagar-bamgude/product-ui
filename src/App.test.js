import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App.js';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getAllByText('Login');
  expect(linkElement[0]).toBeInTheDocument();
});
