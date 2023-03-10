import { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { Box, Button, TextField } from "@mui/material";
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
  const [observeDate, setObserveDate] = useState(dayjs("2023-03-02"));

  const handleSubmit = (event) => {
    event.preventDefault();
    setNasaKey(event.target["keyField"].value)
  };

  const InputForm = () => {
    return(
      <Box
        onSubmit={handleSubmit}
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="keyField"
            label="Enter Valid NASA Key"
            size="small"
            style={{width: 400, margin: "0px 8px 0px 0px"}} 
            defaultValue={nasaKey}
            type="text"
          />
          <Button 
            variant="outlined" 
            size="small" 
            style={{padding: "7.5px", color: "#223e4b"}} 
            type="submit"
          >Save</Button>
        </div>
        <div>
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
                style={{margin: "16px 0px"}}
                {...params}
              />
            }
          />
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
      <h2>{data.element_count} asteroids observed on {theDate}</h2>
      {/* <div>{asteroids.map(asteroid => (<span key={asteroid.id} style={{display: "block", cursor: "pointer"}} > &#129704; <Asteroid asteroid={asteroid} /> </span> ) )}</div> */}
      <div>{asteroids.map(asteroid => (<span key={asteroid.id} style={{display: "block", cursor: "pointer"}}> &#129704; <AsteroidItem asteroid={asteroid} /> </span> ) )}</div>
      <div className="myCanvas">
        <Canvas camera={{ fov: 40, near: 0.1, far: 1000, position: [0, 0, 30] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Earth />
          <Probe />
          {asteroids.map((asteroid, index) => (<Asteroid key={asteroid.id} size={[(asteroid.diameter), 0]} position={[(index*4)-(asteroids.length*4/2), 0, 0]} rotate={asteroid.rotate} />))}
        </Canvas>
      </div>
    </div>
  )

}
