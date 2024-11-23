import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FlightProvider } from './contexts/FlightContext';
import FlightSearch from './components/FlightSearch';

function App() {
  return (
    <Router>
      <FlightProvider>
        <Routes>
          <Route path="/" element={<FlightSearch />} />
        </Routes>
      </FlightProvider>
      
    </Router>
  );
}

export default App;
