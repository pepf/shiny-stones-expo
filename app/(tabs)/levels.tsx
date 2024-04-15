import { StyleSheet, Pressable, PressableProps } from "react-native";

import { Text, View } from "@/components/Themed";
import { useNavigation } from "expo-router";
import Colors from "@/constants/Colors";

export default function TabLevels() {
  const router = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Levels</Text>
      <View style={styles.separator} />
      <View style={styles.levels}>
        <Button onPress={() => router.navigate("level")}>No limit</Button>
        <Button onPress={() => router.navigate("level2")}>Limited Moves</Button>
      </View>
    </View>
  );
}

const Button = (props: PressableProps) => {
  return (
    <Pressable
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
      {...props}
    >
      <View style={styles.button}>
        <Text>{props.children}</Text>
      </View>
    </Pressable>
  );
};

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
  levels: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  button: {
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.text,
    backgroundColor: "white",
  },
});
