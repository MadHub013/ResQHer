import { View, Text } from "react-native";
import React from "react";

export default function LiveAlerts() {
  return (
    <View className="bg-white rounded-lg p-4 mb-4">
      <Text className="text-lg font-bold mb-4">Live Alerts</Text>
      <Text className="text-gray-600">
        No live alerts are available. This app is not connected to a dispatch
        service.
      </Text>
    </View>
  );
}
