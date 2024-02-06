import { Button, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { useNavigation } from "expo-router";

export default function TabLevels() {
  const router = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Levels</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* Temporary way to go to level view */}
      <Button title="Start!" onPress={() => router.navigate("level")} />
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
