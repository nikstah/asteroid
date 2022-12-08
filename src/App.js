import './App.css';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Asteroids from './components/Asteroids';

const queryClient = new QueryClient()

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <header>
              <h2 className='myTitle'>Asteroids &#128640;</h2>          
              <p className='intro'>
              Search near Earth asteroids by date. Data provided by <a href="https://api.nasa.gov/" className='intro' target="_blank" rel="noreferrer">NASA Asteroids - NeoWs API</a>
              </p>
          </header>
          <div className="content">
            <Asteroids />
          </div>
          <div>
            <p>This App is made by <a href="https://www.linkedin.com/in/niklaspenttinen/">Niklas Penttinen</a></p>
          </div>
        </div>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}
