import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function IconButton({ icon, size, color, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        { height: size + 8 * 2, width: size + 8 * 2 },
        styles.button,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={size}
        color={color}
      />
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
