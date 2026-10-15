import { View, Text } from "react-native";
import React from "react";

export default function NearbyUnits() {
  return (
    <View className="bg-white rounded-lg p-4 mb-4">
      <Text className="text-lg font-bold mb-4">Nearby Units</Text>
      <Text className="text-gray-600">
        Unit locations and availability require a connected dispatch service.
      </Text>
    </View>
  );
}
