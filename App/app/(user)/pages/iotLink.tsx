import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/app/AppComponents/User/Header";
import { router } from "expo-router";

export default function IotLink() {
  const isConnected = false;
  const isDarkMode = false;

  return (
    <>
      <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-[#FFF1F3]"}`}>
        <ScrollView>
          {/* Header Section */}
          <View className="px-4 pt-4">
            <Header />

            {/* Connection Status Card */}
            <View
              className={`p-4 rounded-xl mb-4 mt-4 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`font-semibold text-lg ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  {isConnected ? "Device Connected ✅" : "No Device Linked ❌"}
                </Text>
              </View>
              <Text
                className={`text-md mt-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No bracelet linked
              </Text>
              <Text
                className={`text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Bluetooth pairing and device alerts are not implemented.
              </Text>

            </View>

            {/* Emergency Settings Card */}
            <View
              className={`p-4 rounded-xl mb-4 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <Text
                className={`font-semibold mb-4 text-lg ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Device safety settings unavailable
              </Text>
              <Text className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Alert modes and automatic calling cannot be configured until a
                supported bracelet and BLE service are connected.
              </Text>
            </View>
          </View>

          {/* Battery Status Card */}
          <View
            className={`p-4 rounded-xl mb-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <Text
              className={`font-semibold mb-2 text-lg ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Device Status
            </Text>

            <View className="flex-row items-center mb-2">
              <Ionicons name="bluetooth-outline" size={20} color="#666" />
              <Text
                className={`ml-2 ${isDarkMode ? "text-white" : "text-black"}`}
              >
                Battery status unavailable
              </Text>
            </View>

            <Text
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No device sync available
            </Text>
            <Text
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Firmware status unavailable
            </Text>

            <Text className="text-gray-600">
              Battery, firmware, and find-device actions require a real device
              connection.
            </Text>
          </View>

          {/* Future Features Card */}
          <View
            className={`p-4 rounded-xl mb-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <Text
              className={`font-semibold mb-2 text-lg ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Coming Soon
            </Text>

            <Text
              className={`text-sm mb-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              • Multi-device support for family safety
            </Text>
            <Text
              className={`text-sm mb-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              • Geofencing alerts
            </Text>
            <Text
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              • Voice activation features
            </Text>
          </View>

          {/* Security Notice */}
          <View
            className={`p-4 rounded-xl mb-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              <Text
                className={`ml-2 ${isDarkMode ? "text-white" : "text-black"}`}
              >
                Device connection is unavailable; security status cannot be verified.
              </Text>
            </View>
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
    </>
  );
}
