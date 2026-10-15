import { View, Text } from "react-native";
import React from "react";

export default function PublicFeedback() {
  return (
    <View className="bg-white rounded-lg p-4 mb-4">
      <Text className="text-lg font-bold mb-4">Public Feedback</Text>
      <Text className="text-gray-600">
        Feedback is stored on the user's device and is not shared with this
        dashboard. A backend is required for shared reports.
      </Text>
    </View>
  );
}
