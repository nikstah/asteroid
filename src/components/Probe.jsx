import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

const Probe = () => {
    const mesh = useRef()
    useFrame((state, delta) => (mesh.current.position.x += 0.01))
    useFrame((state, delta) => (mesh.current.rotation.x += 0.002))
    return (
      <mesh ref={mesh} position={[-30,3,5]} rotation={[0,0,0]}>
        <boxGeometry args={[0.7, 0.5, 0.5]} />
        <meshStandardMaterial color={'#223e4b'}/>
      </mesh>
    )
  }

export default Probe