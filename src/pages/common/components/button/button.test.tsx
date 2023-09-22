import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './button'

describe('Button component', () => {
  test('renders with text', () => {
    render(<Button text="Click me" />);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick prop when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText(/click me/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

