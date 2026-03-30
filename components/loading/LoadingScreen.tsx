import { ActivityIndicator, View } from "react-native";

const LoadingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator />
    </View>
  );
};

export default LoadingScreen;
