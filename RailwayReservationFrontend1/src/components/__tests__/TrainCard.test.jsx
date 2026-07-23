import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import TrainCard from '../TrainCard';

describe('TrainCard Component', () => {
  const sampleTrain = {
    id: 10,
    trainNumber: '12951',
    trainName: 'Rajdhani Express',
    source: 'Mumbai Central',
    sourceCode: 'MMCT',
    destination: 'New Delhi',
    destinationCode: 'NDLS',
    totalSeats: 300,
    availableSeats: 150,
    fare: 2150,
    departureTime: '05:00 PM',
    arrivalTime: '08:30 AM',
  };

  it('renders train details, stations, and fare', () => {
    render(
      <MemoryRouter>
        <TrainCard train={sampleTrain} />
      </MemoryRouter>
    );

    expect(screen.getByText('Rajdhani Express')).toBeInTheDocument();
    expect(screen.getByText('#12951')).toBeInTheDocument();
    expect(screen.getByText('Mumbai Central (MMCT)')).toBeInTheDocument();
    expect(screen.getByText('New Delhi (NDLS)')).toBeInTheDocument();
    expect(screen.getByText('150 Seats Available')).toBeInTheDocument();
    expect(screen.getByText('₹2150')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Book Ticket/i })).not.toBeDisabled();
  });

  it('renders Sold Out when seats are 0 and disables button', () => {
    const soldOutTrain = { ...sampleTrain, availableSeats: 0, totalSeats: 0 };
    render(
      <MemoryRouter>
        <TrainCard train={soldOutTrain} />
      </MemoryRouter>
    );

    expect(screen.getByText('Sold Out')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Book Ticket/i })).toBeDisabled();
  });
});
