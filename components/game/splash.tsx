import { Suspense, useRef, useState } from "react";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { StyleSheet, View } from "react-native";
import { Center, Text3D } from "@react-three/drei";
import InterBoldFontData from "../../assets/fonts/interBold.json";
import Colors from "@/constants/Colors";

const SplashBGColor = Colors["light"].splashBackground;

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
        reflectivity={0.1}
        attach="material"
        color={hovered ? "hotpink" : "#ffd0b6"}
      />
    </mesh>
  );
}

function Logo() {
  const mesh = useRef<MeshProps>();

  useFrame((state, delta) => {
    if (mesh && mesh.current) {
      // console.log({ delta, state });
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
        <meshLambertMaterial color="#ffb6e6" reflectivity={0.1} />
      </Text3D>
    </Center>
  );
}

const Splashscreen = () => {
  return (
    <View style={styles.container}>
      <Canvas shadows>
        <color attach="background" args={["#ffb6c1"]} />
        <ambientLight intensity={0.2} />
        <directionalLight
          castShadow
          position={[0, 10, 4]}
          intensity={1}
          shadow-mapSize={1024}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-10, 10, -10, 10, 0.1, 50]}
          />
        </directionalLight>

        <Suspense fallback={null}>
          <SpinningBox position={[-1.2, 2, -1]} castShadow />
          <SpinningBox position={[1.2, -2, 0]} castShadow />

          <Logo />

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
        </Suspense>
        <mesh
          rotation={[(-1 * Math.PI) / 2, 0, 0]}
          position={[0, -3, 0]}
          receiveShadow
        >
          <planeGeometry attach="geometry" args={[10, 10]} />
          <meshStandardMaterial attach="material" color={SplashBGColor} />
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

export default Splashscreen;
