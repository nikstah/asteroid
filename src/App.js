import './App.css';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { LocalizationProvider } from "@mui/x-date-pickers";
//import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Asteroids from './components/Asteroids';

const queryClient = new QueryClient()

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <header>
              <span className='myTitle'>Asteroids &#128640;</span>          
              <span className='intro'>
              Data provided by <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer">NASA Asteroids - NeoWs API</a>
              </span>
          </header>
          <div className="content">
            <Asteroids />
          </div>
        </div>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}
