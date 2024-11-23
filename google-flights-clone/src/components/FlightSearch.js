import React, { useState } from 'react';
import { useFlightContext } from '../contexts/FlightContext';
import { searchFlights } from '../api';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';

const FlightSearch = () => {
  const { searchParams, setSearchParams, flights, setFlights, loading, setLoading, error, setError } = useFlightContext();
  const [searching, setSearching] = useState(false);

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearching(true);
    setError(null);

    try {
      console.log('Searching for flights with the following parameters:', searchParams);

      const origin = searchParams.origin || 'JFK';  
      const destination = searchParams.destination || 'LAX';  

     
      const airportData = await fetchAirportData(origin, destination);

      const configData = await fetchConfigData();

     
      const params = {
        originSkyId: airportData.originSkyId, 
        destinationSkyId: airportData.destinationSkyId, 
        originEntityId: airportData.originEntityId, 
        destinationEntityId: airportData.destinationEntityId, 
        date: searchParams.departureDate, 
        returnDate: searchParams.returnDate || '', 
        cabinClass: searchParams.cabinClass || 'economy', 
        adults: searchParams.adults || 1, 
        childrens: searchParams.childrens || 0, 
        infants: searchParams.infants || 0, 
        sortBy: 'best', 
        currency: configData.currency || 'USD', 
        market: configData.market || 'en-US', 
        countryCode: configData.countryCode || 'US', 
      };

      const data = await searchFlights(params);

      if (Array.isArray(data.data)) {
        setFlights(data.data); 
        console.log(data.data); 
      } else {
        setError('No flights found or incorrect data format.');
      }
    } catch (error) {
      setError('Error fetching flights: ' + error.message);
    }

    setLoading(false);
    setSearching(false);
  };

  
const fetchAirportData = async (origin, destination) => {
  try {
  
    if (!origin || !destination) {
      throw new Error('Origin or Destination cannot be empty.');
    }


    console.log(`Fetching data for origin: ${origin} and destination: ${destination}`);

    const url = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${origin}&locale=en-US`;

    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
        'X-RapidAPI-Key': '18becb2f2bmsh2a6d16062fbbda0p1df5f6jsna68e5294a9fa',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch airport data. Status code: ${response.status}`);
    }

   
    const data = await response.json();

    
    console.log("API Response:", data);

    
    if (!data.airports || data.airports.length === 0) {
      throw new Error('No airports found in the API response. Check the query parameter or API response.');
    }

    const originData = data.airports.find(item => item.name.toLowerCase() === origin.toLowerCase());
    const destinationData = data.airports.find(item => item.name.toLowerCase() === destination.toLowerCase());

    if (!originData || !destinationData) {
      throw new Error('Origin or Destination not found in the API response.');
    }

 
    return {
      originSkyId: originData.skyId,
      destinationSkyId: destinationData.skyId,
      originEntityId: originData.entityId,
      destinationEntityId: destinationData.entityId,
    };

  } catch (error) {
   
    console.error('Error fetching airport data:', error);
    throw new Error('Error fetching airport data: ' + error.message);
  }
};

 
  const fetchConfigData = async () => {
    try {
     
      const response = await fetch('https://sky-scrapper.p.rapidapi.com/api/v1/getConfig', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
          'X-RapidAPI-Key': '18becb2f2bmsh2a6d16062fbbda0p1df5f6jsna68e5294a9fa', 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch configuration data');
      }

      const data = await response.json();

      
      return {
        currency: data.currency,        
        market: data.market,          
        countryCode: data.countryCode, 
      };
    } catch (error) {
      console.error('Error fetching configuration data:', error);
      throw new Error('Error fetching configuration data.');
    }
  };

  return (
    <Container>
      <Row className="my-4">
        <Col md={6}>
          <Form>
            <Form.Group controlId="origin">
              <Form.Label>Origin</Form.Label>
              <Form.Control type="text" name="origin" value={searchParams.origin} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="destination">
              <Form.Label>Destination</Form.Label>
              <Form.Control type="text" name="destination" value={searchParams.destination} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="departureDate">
              <Form.Label>Departure Date</Form.Label>
              <Form.Control type="date" name="departureDate" value={searchParams.departureDate} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="returnDate">
              <Form.Label>Return Date</Form.Label>
              <Form.Control type="date" name="returnDate" value={searchParams.returnDate} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="cabinClass">
              <Form.Label>Cabin Class</Form.Label>
              <Form.Control as="select" name="cabinClass" value={searchParams.cabinClass} onChange={handleChange}>
                <option value="economy">Economy</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="adults">
              <Form.Label>Adults</Form.Label>
              <Form.Control type="number" name="adults" value={searchParams.adults} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="childrens">
              <Form.Label>Children (2-12 years)</Form.Label>
              <Form.Control 
                type="number" 
                name="childrens" 
                value={searchParams.childrens || 0} 
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group controlId="infants">
              <Form.Label>Infants (Under 2 years)</Form.Label>
              <Form.Control 
                type="number" 
                name="infants" 
                value={searchParams.infants || 0} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Button variant="primary" onClick={handleSearch} disabled={searching}>
              {searching ? 'Searching...' : 'Search Flights'}
            </Button>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Airline</th>
                <th>Price</th>
                <th>Departure</th>
                <th>Arrival</th>
              </tr>
            </thead>
            <tbody>
              {searching ? (
                <tr><td colSpan="4">Loading...</td></tr>
              ) : (
                Array.isArray(flights) && flights.length > 0 ? (
                  flights.map((flight, index) => (
                    <tr key={index}>
                      <td>{flight.airline}</td>
                      <td>{flight.price} USD</td>
                      <td>{new Date(flight.departureTime).toLocaleString()}</td>
                      <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">No flights found</td></tr>
                )
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default FlightSearch;
