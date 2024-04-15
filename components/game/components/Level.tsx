import { useState } from "react";
import { StyleSheet } from "react-native";
import { Canvas } from "@react-three/fiber";
import { View } from "@/components/Themed";
import Score from "./Score";
import { StoneGrid } from "./StoneGrid";
import CustomEnvironment from "./CustomEnvironment";

export interface LevelConfig {
  width: number;
  height: number;
  showScore?: boolean;
}

const defaultConfig: LevelConfig = {
  width: 3,
  height: 3,
  showScore: true,
};

/**
 * The level base, configurable trough props, should render all the
 * "common elements" of a level.
 */
const Level = ({ config = defaultConfig }: { config: LevelConfig }) => {
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(0);

  // Fix diamonds not fitting on screen by moving camera back.
  // Ideally this can be fixed automatically
  const cameraZHack = config.width > 5 ? -7 : undefined;
  return (
    <View style={styles.container}>
      {config.showScore ? (
        <Score value={score} multiplier={multiplier} />
      ) : null}
      <Canvas>
        <StoneGrid
          width={config.width}
          height={config.height}
          cameraZ={cameraZHack}
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
