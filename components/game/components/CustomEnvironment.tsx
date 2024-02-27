import { Environment } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { DoubleSide } from "three";

/**
 * We're building a cube-mapped environment declaratively.
 * Anything you put in here will be filmed (once) by a cubemap-camera
 * and applied to the scenes environment, and optionally background.
 * This helps a lot with interesting refelecions on shiny objects
 */
const CustomEnvironment = ({ color = "#ffb6c1" }) => (
  <Environment background resolution={64}>
    <Striplight position={[5, 2, 10]} scale={[1, 3, 10]} />
    <Striplight position={[0, 10, 10]} scale={[3, 1, 10]} />
    <Striplight position={[-5, 0, 1]} scale={[1, 3, 10]} />
    <Striplight position={[5, 0, 1]} scale={[1, 3, 10]} />
    <Striplight position={[-5, 0, 10]} scale={[1, 3, 10]} />
    <ambientLight intensity={0.4} />

    <mesh scale={50}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial side={DoubleSide} color={color} />
    </mesh>
  </Environment>
);

function Striplight(props: MeshProps) {
  return (
    <mesh {...props}>
      <boxGeometry />
      <meshBasicMaterial color="white" />
    </mesh>
  );
}

export default CustomEnvironment;
