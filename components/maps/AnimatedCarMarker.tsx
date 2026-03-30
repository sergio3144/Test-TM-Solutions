import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const AnimatedCarMarker = () => {
  return (
    <View style={styles.container}>
      <View style={styles.pulseRing} />
      <View style={styles.carCircle}>
        <Ionicons name="car-sport" size={18} color="#fff" />
      </View>
    </View>
  );
};

export default AnimatedCarMarker;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  pulseRing: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(59, 130, 246, 0.25)",
  },
  carCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
