import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import GameCanvas from "@/components/game/canvas";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <GameCanvas />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
