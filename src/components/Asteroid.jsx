import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

function Asteroid({orbit, ...props}) {
  // Ref gives direct access to the mesh
  const mesh = useRef()
  const startTime = performance.now() // useRef(performance.now())
  const radius = 30
  const angularVelocity = Math.random()
  const distance_x = props.position[0] - 40
  const distance_y = props.position[2] - 10
  // Subscribe this component to the render-loop & rotate
  useFrame((state, delta) => {
    // if orbiting is enabled => orbit
    if (orbit) {
      const nowTime = performance.now()
      const elapsed = (nowTime - startTime) / 1000 // startTime.current
      const angle = angularVelocity * elapsed
      const x = radius * Math.cos(angle) + distance_x
      const y = radius * Math.sin(angle) + distance_y
      mesh.current.position.set(x, 0, y)
    }
    // rotate
    mesh.current.rotation.x += (delta*props.rotate[0])
    mesh.current.rotation.y += (delta*props.rotate[1])
    mesh.current.rotation.z += (delta*props.rotate[2])
  })

  return (
    <mesh
      {... props}
      ref={mesh}
      >
        <dodecahedronGeometry args={props.size} />
        <meshStandardMaterial color={'#444444'} />
    </mesh>
  )
}
  
export default Asteroid