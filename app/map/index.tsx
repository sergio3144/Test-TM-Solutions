
import PrincipalMap from "@/components/maps/PrincipalMap";
import { useLocationStore } from "@/core/useLocationStore";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const MapScreen = () => {
  const { laskKnowLocation, getLocation } = useLocationStore();

  useEffect(() => {
    if (laskKnowLocation === null) {
      getLocation();
    }
  }, []);

  if (laskKnowLocation === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <PrincipalMap
        initialLocation={ laskKnowLocation }
      />

    </View>
  );
};

export default MapScreen;