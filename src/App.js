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
            <h1>Asteroids &#128640;</h1>
            <p>Data provided by <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer">NASA Asteroids - NeoWs API</a></p>
            <br/>
          </header>
          <div>
            <Asteroids />
          </div>
        </div>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}
