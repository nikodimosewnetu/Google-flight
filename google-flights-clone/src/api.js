import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const api = axios.create({
  baseURL: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/',
  headers: {
    'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
    'x-rapidapi-key': '3cebef86damsh1624b7569b6a5dcp1dbe3fjsna90a61381311', 
   " x-rapidapi-ua": "RapidAPI-Playground",

  }

});

export const searchFlights = async (params) => {

  try {
    console.log('Params in try flights:', params)

    const response = await api.get('searchFlights', {params} );

    
    console.log('Request URL:', response.config.url); 
    console.log('Full Response:', response);

    return response.data;
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
};
