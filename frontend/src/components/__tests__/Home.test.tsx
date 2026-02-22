import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

describe('Home Component', () => {
  it('should render without crashing', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  });

  it('should render the main heading', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('ReleaseCheck')).toBeInTheDocument();
    expect(screen.getByText('Your all-in-one release checklist tool')).toBeInTheDocument();
  });

  it('should render the New Release button', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const button = screen.getByRole('link', { name: /New Release/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/releases/new');
  });
});
