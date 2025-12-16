import { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { Box, Button, TextField, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from "dayjs";

//Three.js imports
import { Canvas } from "@react-three/fiber";

import Asteroid from "./Asteroid";
import Earth from "./Earth";
import Probe from "./Probe";

// Asteroid list item formatter
const AsteroidItem = ({asteroid}) => {
    return <span>{asteroid.name}, dia {asteroid.diameter_min} - {asteroid.diameter_max} meters, {asteroid.distance} km from earth</span>
  }

// Fetches asteroids from data and creates a sorted Array by distance from Earth
const arrangeAsteroids = (data, theDate) => {
  console.log("Sorting asteroids...")
  const asteroids = []
  data.near_earth_objects[theDate].forEach(element => {
      const asteroid = {}
      asteroid.id = element.id
      asteroid.name = element.name
      asteroid.diameter_min = element.estimated_diameter.meters.estimated_diameter_min.toFixed(0)
      asteroid.diameter_max = element.estimated_diameter.meters.estimated_diameter_max.toFixed(0)
      asteroid.diameter = asteroid.diameter_min/100
      asteroid.distance = element.close_approach_data[0].miss_distance.kilometers.split('.')[0]
      asteroid.rotate = []
      asteroid.rotate[0] = Math.floor(Math.random()*10)/asteroid.diameter/10
      asteroid.rotate[1] = Math.floor(Math.random()*10)/asteroid.diameter/10
      asteroid.rotate[2] = Math.floor(Math.random()*10)/asteroid.diameter/10
      asteroids.push(asteroid)
  })
  return asteroids.sort( (asteroid1, asteroid2) => {
      return asteroid1.distance - asteroid2.distance
    })
}

export default function Asteroids() {
    
  const [nasaKey, setNasaKey] = useState(
    window.localStorage.getItem("asteroids-nasa-key") || "DEMO_KEY"
  ); 
  // const [observeDate, setObserveDate] = useState(dayjs("2023-03-18"));
  const [observeDate, setObserveDate] = useState(new Date());
  const [orbit, setOrbit] = useState(true)

  const handleSubmit = (event) => {
    event.preventDefault();
    setNasaKey(event.target["keyField"].value)
  };

  const InputForm = () => {
    return(
      <Box
        onSubmit={handleSubmit}
        component="form"
        noValidate
        autoComplete="off"
      >
        <div style={{height: "50px"}}>
          <DatePicker
            id="datePicker"
            label="Select Date to Observe"
            inputFormat="YYYY-MM-DD"
            value={observeDate}
            onChange={(newDate) => {
              setObserveDate(newDate);
            }}
            renderInput={(params) => 
              <TextField 
                size="small" 
                // style={{margin: "16px -4px 0px 0px"}}
                style={{width: 200, margin: "0px 8px 0px 0px"}}
                {...params}
              />
            }
          />
          <Button
            variant="outlined" 
            // style={{margin: "15px", padding: "7.5px", color: "#223e4b", width:130}}
            style={{color: "#223e4b", width:100, height: 40}}
            onClick={(event) => setOrbit(!orbit)} 
          >{orbit ? "Freeze" : "Restart"}</Button>
        </div>
        <div>
          <TextField
            id="keyField"
            label="Enter Valid NASA Key"
            size="small"
            style={{width: 200, margin: "0px 8px 0px 0px"}} 
            defaultValue={nasaKey}
            type="text"
          />
          <Button 
            variant="outlined" 
            style={{color: "#223e4b", width:100, height: 40}} 
            type="submit"
          >Save</Button>
        </div>
      </Box>
    )
  }

  const theDate = dayjs(observeDate).format("YYYY-MM-DD")

  useEffect(() => {
    window.localStorage.setItem("asteroids-nasa-key", nasaKey)
  },[nasaKey])

  const {isLoading, error, data, fetchStatus } = useQuery({
      queryKey: [dayjs(observeDate).format("YYYY-MM-DD")],
      queryFn: () =>
      fetch("https://api.nasa.gov/neo/rest/v1/feed?start_date=" + theDate + "&end_date="  + theDate + "&api_key=" + nasaKey)
          .then( response => response.json() )
  })

  console.log("fetch status: " + fetchStatus);

  if (isLoading) return (
    <div>
      <InputForm />
      <p>Loading asteroid data...</p>
    </div>
  )

  if (error) return (
    <div>
      <InputForm />
      <p>An error has occurred. {error.message}</p>
    </div>
  )

  if (data.error) return (
    <div>
      <InputForm />
      <p>An error has occurred. {data.error.message}</p>
    </div>
  )

  if (data.element_count === 0) return (
    <div>
      <InputForm />
      <p>0 asteroids found on given date.</p>
    </div>
  )

  const asteroids = arrangeAsteroids(data, theDate);

  return (
    <div>
      <InputForm />
      <div>
        <Accordion 
          disableGutters 
          sx={{
            backgroundColor: "transparent", 
            boxShadow: "none", 
            width: 450,
            color: "#223e4b"
          }}
        >
          <AccordionSummary
            expandIcon="[+]"
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{ 
              margin: "0px",
              padding: "0px 0px 0px 0px",
              backgroundColor: "transparent"
            }}
          >
            <h2>
              {data.element_count} asteroids observed on {theDate}
            </h2>
          </AccordionSummary>
          <AccordionDetails 
            sx={{ 
              margin: "0px 0px",
              padding: "0px 0px 0px 0px",
              backgroundColor: "transparent",
            }
          }>
            {asteroids.map( (asteroid) => 
              <span key={asteroid.id} style={{display: "block", cursor: "pointer", fontSize: "1em"}}>
                &#129704; <AsteroidItem asteroid={asteroid} /> 
              </span> )
            }
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="canvas">
        <Canvas camera={{ fov: 40, near: 0.1, far: 1000, position: [0, 0, 30] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Earth />
          <Probe />
          {asteroids.map((asteroid, index) => (
            <Asteroid
              key={asteroid.id}
              size={[(asteroid.diameter), 0]}
              position={[(index*4)-(asteroids.length*4/2), 0, 0]}
              rotate={asteroid.rotate}
              orbit={orbit}
            />))}
        </Canvas>
      </div>
    </div>
  )

}
