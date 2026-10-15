import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import NearbyUnits from "../../components/police/NearbyUnits";
import LiveAlerts from "../../components/police/LiveAlerts";
import PublicFeedback from "../../components/police/PublicFeedback";
import EmergencyContacts from "../../components/police/EmergencyContacts";

export default function Police() {
  const webViewRef = useRef<WebView>(null);
  const mapHTML = require("../../assets/maps/patrolmappolice.html");

  const sendMessageToWebView = (message: string) => {
    webViewRef.current?.injectJavaScript(`
      ${message};
      true;
    `);
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView>
        {/* Header */}
        <View className="px-4 py-3 bg-white shadow-sm">
          <Text className="text-2xl font-bold text-orange-900">
            ResQHer - Police Support
          </Text>
          <Text className="text-orange-600 text-sm">
            Map demonstration · dispatch and live alerts are not connected
          </Text>
        </View>

        {/* Map Section */}
        <View className="h-80 relative my-3 mx-3 rounded-xl overflow-hidden shadow-md">
          <WebView
            ref={webViewRef}
            source={mapHTML}
            style={{ width: "100%", height: "100%" }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />

          {/* Map Controls Container */}
          <View className="absolute top-4 right-4 space-y-2">
            {/* Map Type Toggle */}
            <TouchableOpacity
              onPress={() =>
                sendMessageToWebView("toggleMapLayer()")
              }
              className="bg-white/90 rounded-lg p-3 shadow-lg flex-row items-center"
            >
              <MaterialIcons name="layers" size={24} color="#f97316" />
            </TouchableOpacity>

            {/* Zoom Controls */}
            <View className="bg-white/90 rounded-lg shadow-lg">
              <TouchableOpacity
                onPress={() => sendMessageToWebView("zoomIn()")}
                className="p-3 border-b border-orange-100"
              >
                <Ionicons name="add" size={24} color="#f97316" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendMessageToWebView("zoomOut()")}
                className="p-3"
              >
                <Ionicons name="remove" size={24} color="#f97316" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-[#DC143C] mx-4 p-4 rounded-xl"
              onPress={() => router.push("/pages/report")}
            >
              <Text className="text-white text-center font-bold">
                Open Incident Report Form
              </Text>
            </TouchableOpacity>

            {/* Recenter Button */}
            <TouchableOpacity
              onPress={() => sendMessageToWebView("recenterMap()")}
              className="bg-white/90 rounded-lg p-3 shadow-lg"
            >
              <MaterialIcons name="my-location" size={24} color="#f97316" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard Sections */}
        <View className="px-4 py-2 space-y-4">
          <View className="bg-white p-4 rounded-xl shadow-md border border-orange-100">
            <Text className="text-lg font-semibold text-orange-900 mb-2">
              Nearby Units
            </Text>
            <NearbyUnits />
          </View>

          <View className="bg-white p-4 rounded-xl shadow-md border border-orange-100">
            <Text className="text-lg font-semibold text-orange-900 mb-2">
              Live Alerts
            </Text>
            <LiveAlerts />
          </View>

          <View className="bg-white p-4 rounded-xl shadow-md border border-orange-100">
            <Text className="text-lg font-semibold text-orange-900 mb-2">
              Public Feedback
            </Text>
            <PublicFeedback />
          </View>

          <View className="bg-white p-4 rounded-xl shadow-md border border-orange-100 mb-4">
            <Text className="text-lg font-semibold text-orange-900 mb-2">
              Emergency Contacts
            </Text>
            <EmergencyContacts />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
