import { useRef, useState } from "react";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { StyleSheet, View } from "react-native";
import { SoftShadows } from "@react-three/drei";

function SpinningBox(props: MeshProps) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<MeshProps>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh && mesh.current) {
      mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshLambertMaterial
        metalness={0.1}
        reflectivity={0}
        attach="material"
        color={hovered ? "hotpink" : "skyblue"}
      />
    </mesh>
  );
}

const GameCanvas = () => {
  return (
    <View style={styles.container}>
      <Canvas shadows>
        <SoftShadows size={25} samples={10} />
        <color attach="background" args={["#f0f0f0"]} />
        <ambientLight intensity={0.05} />
        <directionalLight
          castShadow
          position={[0, 10, 2]}
          intensity={1}
          shadow-mapSize={1024}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-10, 10, -10, 10, 0.1, 50]}
          />
        </directionalLight>

        {/* <pointLight color="darkblue" position={[10, 10, 10]} /> */}
        <SpinningBox position={[-1.2, 0, 0]} castShadow />
        <SpinningBox position={[1.2, 0, 0]} castShadow />

        <mesh
          position-y={-2}
          position-x={-1}
          castShadow
          receiveShadow
          rotation-y={0.33}
        >
          <torusKnotGeometry args={[0.5, 0.2, 100, 16]} />
          <meshLambertMaterial attach="material" color="gold" />
        </mesh>
        <mesh
          rotation={[(-1 * Math.PI) / 2, 0, 0]}
          position={[0, -3, 0]}
          receiveShadow
        >
          <planeGeometry attach="geometry" args={[10, 10]} />
          <meshStandardMaterial attach="material" color="grey" />
        </mesh>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
});

export default GameCanvas;
