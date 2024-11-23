import React, { createContext, useState, useContext } from 'react';

const FlightContext = createContext();

export const useFlightContext = () => {
  return useContext(FlightContext);
};

export const FlightProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    origin: 'LOND',
    destination: 'NYCA',
    departureDate: '',
    returnDate: '',
    adults: 1,
    cabinClass: 'economy',
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <FlightContext.Provider value={{ searchParams, setSearchParams, flights, setFlights, loading, setLoading, error, setError }}>
      {children}
    </FlightContext.Provider>
  );
};
