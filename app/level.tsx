import { View } from "@/components/Themed";
import { Canvas } from "@react-three/fiber";
import { StyleSheet } from "react-native";
import Grid from "../components/game/lib/grid";
import { useEffect, useRef, useState } from "react";
import { Center } from "@react-three/drei";

// TODO support various types, clicking etc.
const Stone = (props) => {
  const color = {};
  return (
    <mesh position={props.position}>
      <boxGeometry attach="geometry" args={[0.5, 0.5]} />
      <meshLambertMaterial color="gold" reflectivity={0.5} />
    </mesh>
  );
};

const StoneGrid = ({ width, height }) => {
  const gridInstance = useRef(null);
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    gridInstance.current = new Grid(width, height);
    setGrid(gridInstance.current._grid);

    // cleanup
    return () => {
      delete gridInstance.current;
    };
  }, [width, height]);

  if (!grid) return null;
  const spacing = 0.1;

  const gridComponent = grid.map((item) => {
    const [x, y] = item.pos;
    return (
      <Stone
        key={item.id}
        type={item.type}
        position={[x + x * spacing, y + y * spacing, 0]}
      />
    );
  });

  return <Center>{gridComponent}</Center>;
};

const Level = () => {
  return (
    <View style={styles.container}>
      <Canvas>
        <pointLight position-z={2} position-y={2} />
        <color attach="background" args={["#ffb6c1"]} />
        <StoneGrid width={4} height={4} />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
export default Level;
