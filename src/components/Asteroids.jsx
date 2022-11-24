import { useState } from "react";

import { useQuery } from "@tanstack/react-query"

import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button } from "@mui/material";

import dayjs from "dayjs";

const Asteroid = ({asteroid}) => {
    const diameter1 = asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0)
    const diameter2 = asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(0)
    const diameters = diameter1 + " x " + diameter2 + " meters"
    const distance = asteroid.close_approach_data[0].miss_distance.kilometers.split('.')[0] + " km"
    if (asteroid.close_approach_data[1]) console.log("second value")
    return <span> {asteroid.name}, {diameters}, {distance} </span>
  }
  
const sortAsteroids = (data, theDate) => {
  const asteroids = []
  data.near_earth_objects[theDate].forEach(element => {
      asteroids.push(element)
  })
  return asteroids.sort( (asteroid1, asteroid2) => {
      return asteroid1.close_approach_data[0].miss_distance.kilometers - asteroid2.close_approach_data[0].miss_distance.kilometers
    })
}
  
export default function Asteroids() {
    
  const [nasaKey, setNasaKey] = useState("DEMO_KEY"); 
  const [observeDate, setObserveDate] = useState(dayjs("2022-11-12"));

  const handleSubmit = (event) => {
    event.preventDefault();
    setNasaKey(event.target["keyField"].value)
  };

  const InputForm = () => {
    return(
      <span>
        <form onSubmit={handleSubmit}>
          <TextField
            id="keyField"
            label="Enter Valid NASA Key"
            type="text"
            size="small"
            style = {{width: 400}} 
            defaultValue={nasaKey}
          />
          <Button type="submit">Save</Button>
        </form><br/><br/>
        <DatePicker
          id="datePicker"
          label="Select Date to Observe"
          inputFormat="YYYY-MM-DD"
          value={observeDate}
          onChange={(newDate) => {
            setObserveDate(newDate);
          }}
          renderInput={(params) => 
            <TextField size="small" {...params}/>
          }
        />
      </span>
    )
  }

  const theDate = dayjs(observeDate).format("YYYY-MM-DD")

  const {isLoading, error, data } = useQuery({
      queryKey: [dayjs(observeDate).format("YYYY-MM-DD")],
      queryFn: () =>
      fetch("https://api.nasa.gov/neo/rest/v1/feed?start_date=" + theDate + "&end_date="  + theDate + "&api_key=" + nasaKey)
          .then( response => response.json() )
  })

  if (isLoading) return "Loading asteroid data..."

  console.log(nasaKey)

  if (error) return (
    <div>
      <InputForm />
      <p>An error has occurred: " + {error.message}</p>
    </div>
  )

  if (data.error) return (
    <div>
      <InputForm />
      <p>An error has occurred: " + {data.error.message}</p>
    </div>
  )

  console.log(data)

  if (data.element_count === 0) return (
    <div>
      <InputForm />
      <p>0 &#129704; found on given date.</p>
    </div>
  )

  const sortedAsteroids = sortAsteroids(data, theDate);

  return (
    <div>
      <InputForm />
      <h2>{data.element_count} &#129704; observed on {theDate}</h2>
      <div>{sortedAsteroids.map( asteroid => ( <span key={asteroid.id} style={{display: "block"}}> &#129704;  <Asteroid asteroid={asteroid} /> </span> ) )}</div>
    </div>
)

}
