import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

const Earth = () => {
    const gltf = useLoader(GLTFLoader, "./astra.gltf")
    return (
        <primitive object={gltf.scene} scale={10.0} position={[-40,0,-10]} />
    )
  }

export default Earth