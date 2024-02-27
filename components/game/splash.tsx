import { Suspense, useRef } from "react";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { StyleSheet, View } from "react-native";
import { Center, Text3D } from "@react-three/drei";
import InterBoldFontData from "../../assets/fonts/interBold.json";
import CustomEnvironment from "./components/CustomEnvironment";

function SpinningStone(props: MeshProps) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<MeshProps>();

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh && mesh.current) {
      mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh {...props} ref={mesh}>
      <icosahedronGeometry attach="geometry" args={[0.75, 0]} />
      <meshPhysicalMaterial roughness={0.2} metalness={0.5} color={"#ffd0b6"} />
    </mesh>
  );
}

function Logo() {
  const mesh = useRef<MeshProps>();

  useFrame((state) => {
    if (mesh && mesh.current) {
      mesh.current.rotation.y = 0.25 * Math.sin(state.clock.getElapsedTime());
    }
  });

  return (
    <Center ref={mesh} rotation={[-0.25, -0.33, 0]}>
      <Text3D
        receiveShadow
        curveSegments={8}
        bevelEnabled
        bevelSize={0.04}
        bevelThickness={0.1}
        height={0.5}
        lineHeight={0.5}
        letterSpacing={-0.06}
        size={0.75}
        font={InterBoldFontData}
      >
        {`shiny\nstones`}
        <meshPhysicalMaterial
          roughness={0.2}
          color="#efa7d6"
          reflectivity={0.8}
          metalness={1}
        />
      </Text3D>
    </Center>
  );
}

const Splashscreen = () => {
  return (
    <View style={styles.container}>
      <Canvas shadows>
        <ambientLight intensity={0.2} />

        <Suspense fallback={null}>
          <SpinningStone position={[-1.2, 2, -1]} castShadow />
          <SpinningStone position={[1.2, -2, 0]} castShadow />

          <Logo />

          <mesh
            position-y={0}
            position-x={0.5}
            scale={8}
            receiveShadow
            rotation-y={0.63}
          >
            <torusKnotGeometry args={[0.8, 0.1, 100, 16]} />
            <meshPhysicalMaterial
              attach="material"
              color="gold"
              metalness={0.1}
              roughness={0.1}
              reflectivity={0.1}
            />
          </mesh>
        </Suspense>

        <CustomEnvironment />
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

export default Splashscreen;
