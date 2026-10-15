import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/app/AppComponents/User/Header";

export default function NGOsConnect() {
  const router = useRouter();

  const handleSendLocation = () => {
    Alert.alert(
      "Location sharing unavailable",
      "ResQHer is not connected to an NGO directory or location-sharing service. In immediate danger, call 112."
    );
  };

  return (
    <View className="flex-1 bg-[#FFF1F3]">
      <ScrollView>
        <View className="px-4 pt-4">
          <Header />
        </View>
        {/* Header */}
        <View className="p-5 bg-[#DC143C]">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white mb-2">
            Connect with NGOs
          </Text>
          <Text className="text-white mb-2">
            A verified partner directory is not connected to this app.
          </Text>
        </View>

        {/* Emergency Quick Actions */}
        <View className="p-5">
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              className="bg-[#8B0000] p-4 rounded-xl flex-1 mr-2"
              onPress={() => router.push("/pages/helplines")}
            >
              <Text className="text-white text-center font-bold">
                Emergency helplines
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#DC143C] p-4 rounded-xl flex-1 ml-2"
              onPress={handleSendLocation}
            >
              <Text className="text-white text-center font-bold">
                Location sharing unavailable
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white p-4 rounded-xl mb-3">
            <Text className="text-lg font-bold text-[#333]">
              No verified organizations available
            </Text>
            <Text className="text-[#666] mt-2">
              Do not rely on unverified contact listings. Open the in-app
              helplines for phone numbers, or call 112 in an emergency.
            </Text>
            <TouchableOpacity
              className="bg-[#DC143C] p-3 rounded-lg mt-4"
              onPress={() => router.push("/pages/helplines")}
            >
              <Text className="text-white text-center font-bold">
                View emergency helplines
              </Text>
            </TouchableOpacity>
          </View>

          {/* Know Your Rights Section */}
          <Text className="text-xl font-bold text-[#333] mt-4 mb-3">
            Know Your Rights
          </Text>
          {["Legal Protection", "Social Services", "Emergency Help Guide"].map(
            (topic, index) => (
              <View
                key={index}
                className="bg-white p-4 rounded-xl mb-3 shadow-sm"
              >
                <Text className="text-lg font-semibold text-[#333]">
                  {topic}
                </Text>
                <Text className="text-[#666] mb-2">
                  Learn about your rights and available resources
                </Text>
              </View>
            )
          )}
        </View>

      </ScrollView>

      {/* AI Chatbot Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-5 w-16 h-16 rounded-full bg-[#DC143C] justify-center items-center shadow-lg z-50"
        onPress={() => {
          router.push("/pages/aiChat");
        }}
      >
        <Ionicons name="chatbubbles-outline" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
