import { useState } from "react";

import { useQuery } from "@tanstack/react-query"

import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button } from "@mui/material";

import dayjs from "dayjs";

//Three.js imports
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber"
import { useLoader } from "@react-three/fiber"
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "./astra.gltf")
  return (
    <>
      <primitive object={gltf.scene} scale={10.0} position={[-40,0,-10]} />
    </>
  )
}

//Asteroid Three Dee formatter
function ThreeAsteroid(props) {
  // Ref gives direct access to the mesh
  const mesh = useRef()
  // State
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop & rotate
  useFrame((state, delta) => (mesh.current.rotation.x += props.rotate[0]))
  useFrame((state, delta) => (mesh.current.rotation.y += props.rotate[1]))
  useFrame((state, delta) => (mesh.current.rotation.z += props.rotate[2]))
  // Return View
  return (
    <mesh
      {... props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
        {/* <boxGeometry args={props.size} /> */}
        <capsuleGeometry args={props.size} />
        <meshStandardMaterial color={hovered ? '#666666' : '#444444'} />
    </mesh>
  )
}

// Asteroid list item formatter
const Asteroid = ({asteroid}) => {
    return <span> {asteroid.name}, {asteroid.diameter_max} x {asteroid.diameter_min} meters, {asteroid.distance} km from earth</span>
  }

// Fetches asteroids from data and creates a sorted Array by distance from Earth
const arrangeAsteroids = (data, theDate) => {
  const asteroids = []
  data.near_earth_objects[theDate].forEach(element => {
      const asteroid = {}
      asteroid.id = element.id
      asteroid.name = element.name
      asteroid.diameter_min = element.estimated_diameter.meters.estimated_diameter_min.toFixed(0)
      asteroid.diameter_max = element.estimated_diameter.meters.estimated_diameter_max.toFixed(0)
      asteroid.distance = element.close_approach_data[0].miss_distance.kilometers.split('.')[0]
      asteroid.rotate = []
      asteroid.rotate[0] = Math.floor(Math.random()*10)/1000
      asteroid.rotate[1] = Math.floor(Math.random()*10)/1000
      asteroid.rotate[2] = Math.floor(Math.random()*10)/1000
      asteroids.push(asteroid)
  })
  return asteroids.sort( (asteroid1, asteroid2) => {
      return asteroid1.distance - asteroid2.distance
    })
}

export default function Asteroids() {
    
  const [nasaKey, setNasaKey] = useState("DEMO_KEY"); 
  const [observeDate, setObserveDate] = useState(dayjs("2022-11-14"));

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
        </form>
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
      <p>0 &#129704; found on given date.</p>
    </div>
  )

  const asteroids = arrangeAsteroids(data, theDate);

  return (
    <div>
      <InputForm />
      <h2>{data.element_count} &#129704; observed on {theDate}</h2>
      <div>{asteroids.map(asteroid => (<span key={asteroid.id} style={{display: "block"}}> &#129704; <Asteroid asteroid={asteroid} /> </span> ) )}</div>
      <div style={{height: 500}}>
        <Canvas camera={{ fov: 40, near: 0.1, far: 1000, position: [0, 0, 30] }}>
          <Model />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {asteroids.map((asteroid, index) => (<ThreeAsteroid key={asteroid.id} size={[(asteroid.diameter_min/100), (asteroid.diameter_max/100), 5, 6]} position={[(index*4)-(asteroids.length*4/2), 0, 0]} rotate={asteroid.rotate} />))}
        </Canvas>
      </div>
    </div>
  )

}
