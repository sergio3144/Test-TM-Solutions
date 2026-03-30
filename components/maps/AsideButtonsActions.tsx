import { useLocationStore } from "@/core/useLocationStore";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
  const { isTracking, isLoadingRoute, startTracking, stopTracking } = useLocationStore();

  const handleStartTracking = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await startTracking();
    setIsFollowingUser(true);
  };

  const handleStopTracking = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    handleMoveToCurrent()
    stopTracking();
    setIsFollowingUser(false);
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
      <View className="rounded-full overflow-hidden shadow-lg mb-4">
        <BlurView intensity={70} tint="light" className="bg-white/40">
          <TouchableOpacity
            onPress={handleShowHistory}
            className="p-4 rounded-full"
          >
            <Ionicons name="list-outline" size={28} color="#4b5563" />
          </TouchableOpacity>
        </BlurView>
      </View>

      <TouchableOpacity
        onPress={isTracking ? handleStopTracking : handleStartTracking}
        disabled={isLoadingRoute}
        className={`w-20 h-20 rounded-full shadow-2xl items-center justify-center border-4 border-white mb-4 ${
          isLoadingRoute
            ? "bg-gray-400 opacity-50"
            : isTracking
            ? "bg-red-500 scale-110"
            : "bg-green-500"
        }`}
        style={{
          elevation: 10,
          shadowColor: isTracking ? "#ef4444" : "#22c55e",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
        }}
      >
        <Text className={`text-white ${isLoadingRoute ? 'text-[8px]' : 'text-[10px]'} font-black uppercase mt-1`}>
          {isLoadingRoute ? "Cargando" : isTracking ? "Detener" : "Iniciar"}
        </Text>
      </TouchableOpacity>


      <View className="rounded-3xl overflow-hidden shadow-lg border border-white/20">
        <BlurView
          intensity={80}
          tint="light"
          className="bg-white/40 p-2 space-y-2"
        >
          <TouchableOpacity
            onPress={toggleFollowing}
            className={`p-4 rounded-2xl ${isFollowingUser ? "bg-blue-500/20" : "bg-transparent"}`}
          >
            <Ionicons
              name={isFollowingUser ? "walk" : "accessibility"}
              size={28}
              color={isFollowingUser ? "#2563eb" : "#4b5563"}
            />
          </TouchableOpacity>

          <View className="h-[1px] w-8 bg-gray-200 self-center mx-2" />


          <TouchableOpacity
            onPress={handleMoveToCurrent}
            className="p-4 rounded-2xl"
          >
            <Ionicons name="compass-outline" size={28} color="#4b5563" />
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
};

export default AsideButtonsActions;
