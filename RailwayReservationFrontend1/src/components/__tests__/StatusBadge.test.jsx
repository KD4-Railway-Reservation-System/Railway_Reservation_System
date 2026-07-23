import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from '../StatusBadge';

describe('StatusBadge Component', () => {
  it('renders CONFIRMED status correctly', () => {
    render(<StatusBadge status="CONFIRMED" />);
    const element = screen.getByText('CONFIRMED');
    expect(element).toBeInTheDocument();
  });

  it('renders CANCELLED status correctly', () => {
    render(<StatusBadge status="CANCELLED" />);
    const element = screen.getByText('CANCELLED');
    expect(element).toBeInTheDocument();
  });

  it('renders PENDING status correctly', () => {
    render(<StatusBadge status="PENDING" />);
    const element = screen.getByText('PENDING');
    expect(element).toBeInTheDocument();
  });

  it('renders UNKNOWN fallback status when status is null or undefined', () => {
    render(<StatusBadge status={null} />);
    const element = screen.getByText('UNKNOWN');
    expect(element).toBeInTheDocument();
  });
});
