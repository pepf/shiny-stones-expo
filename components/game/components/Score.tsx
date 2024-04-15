import { Text, View } from "@/components/Themed";
import { animated, useSpring } from "@react-spring/three";
import { Platform, StyleSheet } from "react-native";

const AnimatedScore = animated(Text);

interface ScoreProps {
  value: number;
  multiplier: number;
}
const Score = ({ value, multiplier }: ScoreProps) => {
  const props = useSpring({ to: { score: value }, config: { duration: 200 } });
  return (
    <View style={styles.container}>
      <AnimatedScore style={styles.text}>
        {props.score.to((v) => `Score: ${Math.floor(v)}`)}
      </AnimatedScore>
      <Text
        style={[
          styles.text,
          styles.textCircle,
          multiplier > 1 ? styles.visible : null,
        ]}
      >
        {multiplier.toString()}x
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
    paddingTop: Platform.OS !== "web" ? 48 : 0, // use `useHeaderHeight`
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    letterSpacing: 0.5,
    color: "white",
    marginRight: 14,
  },
  textCircle: {
    opacity: 0, // invisible
    position: "relative",
    padding: 8,
    fontSize: 21,
    borderRadius: 25,
    backgroundColor: "#ffb6c1",
  },
  visible: {
    opacity: 1,
  },
});

export default Score;
