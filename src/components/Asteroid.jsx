import { useState } from "react"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

function Asteroid(props) {
    // Ref gives direct access to the mesh
    const mesh = useRef()
    // State
    const [highlight, setHighlight] = useState()
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop & rotate
    useFrame((state, delta) => (mesh.current.rotation.x += (delta*props.rotate[0])))
    useFrame((state, delta) => (mesh.current.rotation.y += (delta*props.rotate[1])))
    useFrame((state, delta) => (mesh.current.rotation.z += (delta*props.rotate[2])))
    return (
      <mesh
        {... props}
        ref={mesh}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHighlight(true)}
        onPointerOut={(event) => setHighlight(false)}
        >
          {/* <capsuleGeometry args={props.size} /> */}
          <dodecahedronGeometry args={props.size} />
          <meshStandardMaterial color={highlight ? '#666666' : '#444444'} />
      </mesh>
    )
  }
  
export default Asteroid