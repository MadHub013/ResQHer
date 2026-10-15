import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import Header from "@/app/AppComponents/User/Header";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const callEmergencyServices = () => {
  Alert.alert("Call emergency services", "Open the phone app to call 112?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Call 112",
      onPress: () =>
        void Linking.openURL("tel:112").catch(() =>
          Alert.alert("Unable to open phone", "Please dial 112 directly.")
        ),
    },
  ]);
};

interface EmergencyButtonProps {
  number: string;
  title: string;
  description: string;
}

const EmergencyButton = ({
  number,
  title,
  description,
}: EmergencyButtonProps) => (
  <TouchableOpacity
    className="bg-[#DC143C] p-5 rounded-xl mb-4 shadow-lg elevation-5"
    onPress={() => {
      Alert.alert("Emergency Call", `Are you sure you want to call ${title}?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () =>
            void Linking.openURL(`tel:${number}`).catch(() =>
              Alert.alert("Unable to open phone", "Please dial the number directly.")
            ),
        },
      ]);
    }}
  >
    <Text className="text-white text-xl font-bold mb-1">{title}</Text>
    <Text className="text-white/90 text-sm">{description}</Text>
  </TouchableOpacity>
);

export default function PoliceConnect() {
  const initialRegion = {
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF1F3]">
      <ScrollView className="flex-1 px-4 pt-2">
        {/* Emergency Contacts Section */}
        <View className="mb-2">
          <View className="mb-4">
            <Header />
          </View>
          <EmergencyButton
            number="112"
            title="Emergency services (112)"
            description="Opens your phone app; no request is sent from ResQHer."
          />
          <EmergencyButton
            number="1091"
            title="Women's helpline (1091)"
            description="Opens your phone app; no request is sent from ResQHer."
          />
        </View>

        {/* Police Station Locator */}
        <View className="mb-4">
          <Text className="text-xl font-bold mb-2 text-[#333]">
            Map Preview
          </Text>
          <Text className="text-amber-900 bg-amber-100 rounded-lg p-3 mb-2">
            Map is centered on Delhi by default. This app has no verified police
            station directory or live dispatch connection.
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              provider="google"
              style={styles.map}
              initialRegion={initialRegion}
              showsUserLocation={true}
              showsMyLocationButton={true}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            className="bg-white px-4 py-5 rounded-xl flex-1 mr-2 shadow-lg elevation-3"
            onPress={callEmergencyServices}
          >
            <Text className="text-[#DC143C] text-center font-bold text-base">
              Call 112
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report Incident Button */}
        <TouchableOpacity
          className="bg-[#DC143C] p-5 rounded-xl mb-6 shadow-lg elevation-5"
          onPress={() => router.push("/pages/report")}
        >
          <Text className="text-white text-center text-lg font-bold">
            Report an Incident
          </Text>
        </TouchableOpacity>

        {/* AI Chatbot Button */}
        <TouchableOpacity
          className="absolute bottom-5 right-5 w-16 h-16 m-1 rounded-full bg-[#DC143C] justify-center items-center shadow-lg"
          onPress={() => {
            router.push("/pages/aiChat");
          }}
        >
          <Ionicons name="chatbubbles-outline" size={28} color="#FFF" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    width: Dimensions.get("window").width - 32,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
