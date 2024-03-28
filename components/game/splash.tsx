import { Suspense, useState } from "react";
import { Canvas, MeshProps } from "@react-three/fiber";
import { StyleSheet, View } from "react-native";
import { Center, Text3D } from "@react-three/drei";
import InterBoldFontData from "../../assets/fonts/interBold.json";
import CustomEnvironment from "./components/CustomEnvironment";
import { useSpring, a, animated } from "@react-spring/three";

const AnimatedCenter = animated(Center);

function SpinningStone(props: MeshProps) {
  const [active, setActive] = useState(false);
  const { scale } = useSpring({ scale: active ? 1.5 : 1 });

  return (
    <a.mesh {...props} onClick={() => setActive(!active)} scale={scale}>
      <icosahedronGeometry attach="geometry" args={[0.75, 0]} />
      <meshPhysicalMaterial roughness={0.2} metalness={0.5} color={"#ffd0b6"} />
    </a.mesh>
  );
}

function Logo() {
  const startRotation = [-0.25, -0.5, 0];
  const props = useSpring({
    from: { rotation: startRotation },
    to: [{ rotation: [-0.25, 0.5, 0] }, { rotation: startRotation }],
    loop: true,
    // https://react-spring.dev/docs/advanced/config#presets
    config: {
      mass: 200,
      tension: 100,
      friction: 200,
      clamp: true,
      velocity: 0,
    },
  });

  return (
    <AnimatedCenter {...props}>
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
    </AnimatedCenter>
  );
}

const Splashscreen = () => {
  const startRotation = [0, 0.63, 0];
  const props = useSpring({
    from: { rotation: startRotation },
    to: [{ rotation: [0, -1, 0] }, { rotation: startRotation }],
    loop: true,
    // https://react-spring.dev/docs/advanced/config#presets
    config: {
      mass: 1000,
      tension: 100,
      friction: 500,
      clamp: true,
      velocity: 0,
    },
  });

  return (
    <View style={styles.container}>
      <Canvas shadows>
        <ambientLight intensity={0.2} />

        <Suspense fallback={null}>
          <SpinningStone position={[-1.2, 2, -1]} castShadow />
          <SpinningStone position={[1.2, -2, 0]} castShadow />

          <Logo />

          <a.mesh
            position-y={0.2}
            position-x={0.5}
            scale={8}
            receiveShadow
            {...props}
          >
            <torusKnotGeometry args={[0.8, 0.1, 100, 16]} />
            <meshPhysicalMaterial
              attach="material"
              color="gold"
              metalness={0.1}
              roughness={0.1}
              reflectivity={0.1}
            />
          </a.mesh>
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
