import { useLocationStore } from "@/core/useLocationStore";
import { formatDistance } from "@/core/utils/distance";
import { BlurView } from "expo-blur";
import React from "react";
import { Text, View } from "react-native";

const TrackingOverlay = () => {
  const { isTracking, totalDistance } = useLocationStore();

  if (!isTracking) return null;


  return (
    <View className="absolute top-12 left-4 right-4 z-50">
      <BlurView intensity={80} tint="light" className="rounded-3xl overflow-hidden border border-white/20 shadow-xl">
        <View className="p-4 flex-row justify-between items-center bg-white/40">
          <View className="flex-1 items-center">
            <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Recorridos</Text>
            <Text className="text-xl font-black text-blue-600">
              {formatDistance(totalDistance)}
            </Text>
          </View>
          

          <View className="h-10 w-[1px] bg-gray-300 mx-3" />

          <View className="flex-[0.8] items-center">
            <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Estado</Text>
            <View className="flex-row items-center">
              <View className="h-2 w-2 rounded-full bg-green-500 mr-2" />
              <Text className="text-sm font-bold text-gray-700">Viajando</Text>
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

export default TrackingOverlay;
