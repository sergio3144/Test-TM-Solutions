import React from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocationStore, Route } from "@/core/useLocationStore";
import { formatDistance } from "@/core/utils/distance";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const RouteHistoryModal = ({ isVisible, onClose }: Props) => {
  const { routesHistory, clearHistory } = useLocationStore();

  const renderItem = ({ item }: { item: Route }) => (
    <View className="bg-gray-50 p-4 rounded-2xl mb-3 border border-gray-100 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="bg-blue-100 p-3 rounded-full mr-4">
          <Ionicons name="map-outline" size={24} color="#2563eb" />
        </View>
        <View>
          <Text className="text-gray-800 font-bold text-lg">
            {formatDistance(item.distance)}
          </Text>
          <Text className="text-gray-500 text-xs">
            {new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
      
      <View className="bg-white px-3 py-1 rounded-full border border-gray-200">
        <Text className="text-gray-500 text-xs font-bold">{item.points.length} pts</Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-100">
          <Text className="text-2xl font-black text-gray-900">Historial</Text>
          <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6 pt-4">
          {routesHistory.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Ionicons name="trail-sign-outline" size={80} color="#e5e7eb" />
              <Text className="text-gray-400 mt-4 text-lg font-medium text-center px-10">
                Aún no tienes rutas guardadas. ¡Empieza a trackear una ruta!
              </Text>
            </View>
          ) : (
            <FlatList
              data={routesHistory}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </View>

        {routesHistory.length > 0 && (
          <View className="px-6 py-4 border-t border-gray-100">
            <TouchableOpacity 
              onPress={clearHistory}
              className="bg-red-50 py-4 rounded-2xl items-center"
            >
              <Text className="text-red-500 font-bold">Borrar Todo el Historial</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default RouteHistoryModal;
