import { View } from "@/components/Themed";
import { Canvas } from "@react-three/fiber";
import { StyleSheet } from "react-native";
import { useState } from "react";
import Score from "@/components/game/components/Score";
import CustomEnvironment from "@/components/game/components/CustomEnvironment";
import { StoneGrid } from "../components/game/components/StoneGrid";

const Level = () => {
  // Move to context or similar if it works as expected
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  return (
    <View style={styles.container}>
      <Score value={score} multiplier={multiplier} />
      <Canvas>
        <StoneGrid
          width={5}
          height={8}
          updateScore={setScore}
          updateMultiplier={setMultiplier}
        />
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
  },
});
export default Level;
