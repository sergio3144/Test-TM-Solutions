import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocationStore } from "@/core/useLocationStore";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";

interface Props {
  isFollowingUser: boolean;
  handleShowPopyline: () => void;
  setIsFollowingUser: (value: boolean) => void;
  moveToCurrentLocation: () => void;
  onOpenHistory: () => void;
}

const AsideButtonsActions = ({
  isFollowingUser,
  handleShowPopyline,
  setIsFollowingUser,
  moveToCurrentLocation,
  onOpenHistory,
}: Props) => {
  const { isTracking, startTracking, stopTracking } = useLocationStore();

  const handleStartTracking = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    startTracking();
  };

  const handleStopTracking = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    stopTracking();
  };

  const toggleFollowing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFollowingUser(!isFollowingUser);
  };

  const handleMoveToCurrent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    moveToCurrentLocation();
  };

  const handleShowHistory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenHistory();
  };

  return (
    <View className="absolute bottom-10 right-6 z-50 items-center space-y-4">
      {/* History Button */}
      <View className="rounded-full overflow-hidden shadow-lg mb-4">
        <BlurView intensity={70} tint="light" className="bg-white/40">
          <TouchableOpacity onPress={handleShowHistory} className="p-4 rounded-full">
            <Ionicons name="list-outline" size={28} color="#4b5563" />
          </TouchableOpacity>
        </BlurView>
      </View>

      {/* Tracking Button */}
      <TouchableOpacity
        onPress={isTracking ? handleStopTracking : handleStartTracking}
        className={`w-20 h-20 rounded-full shadow-2xl items-center justify-center border-4 border-white mb-4 ${
          isTracking ? "bg-red-500 scale-110" : "bg-green-500"
        }`}
        style={{
          elevation: 10,
          shadowColor: isTracking ? "#ef4444" : "#22c55e",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
        }}
      >
        <Ionicons
          name={isTracking ? "stop" : "play"}
          size={36}
          color="white"
        />
        <Text className="text-white font-black text-[10px] uppercase mt-1">
          {isTracking ? "Detener" : "Iniciar"}
        </Text>
      </TouchableOpacity>

      {/* Map Controls Group */}
      <View className="rounded-3xl overflow-hidden shadow-lg border border-white/20">
        <BlurView intensity={80} tint="light" className="bg-white/40 p-2 space-y-2">
          {/* Following Button */}
          <TouchableOpacity 
            onPress={toggleFollowing} 
            className={`p-4 rounded-2xl ${isFollowingUser ? 'bg-blue-500/20' : 'bg-transparent'}`}
          >
            <Ionicons
              name={isFollowingUser ? "walk" : "accessibility"}
              size={28}
              color={isFollowingUser ? "#2563eb" : "#4b5563"}
            />
          </TouchableOpacity>

          <View className="h-[1px] w-8 bg-gray-200 self-center mx-2" />

          {/* Current Location Button */}
          <TouchableOpacity onPress={handleMoveToCurrent} className="p-4 rounded-2xl">
            <Ionicons name="compass-outline" size={28} color="#4b5563" />
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
};

export default AsideButtonsActions;
