import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "../AppComponents/User/Header";
import * as Location from "expo-location";

const communityLinks = [
  { title: "Police", icon: "shield-outline", route: "/pages/police" },
  { title: "Lawyers", icon: "briefcase-outline", route: "/pages/lawyers" },
  { title: "Doctors", icon: "medkit-outline", route: "/pages/doctors" },
  { title: "NGOs", icon: "people-outline", route: "/pages/ngos" },
  { title: "People", icon: "person-outline", route: "/pages/people" },
] as const;

const UserDashboard = () => {
  const router = useRouter();
  const [locationString, setLocationString] = useState("None");
  const [isCommunityModalVisible, setIsCommunityModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      // Get readable address
      try {
        let addresses = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        if (addresses && addresses.length > 0) {
          const address = addresses[0];
          setLocationString(
            `${address.street}, ${address.city}, ${address.region}`
          );
        }
      } catch (error) {
        setLocationString("None");
      }
    })();
  }, []);

  const handleSOSPress = () => {
    router.push("/pages/report");
  };

  const handleSOSLongPress = () => {
    Alert.alert(
      "Call emergency services?",
      "This opens your phone app to call India's emergency number 112. It does not automatically share your location.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call 112",
          style: "destructive",
          onPress: () => {
            void Linking.openURL("tel:112").catch(() =>
              Alert.alert("Unable to open phone", "Please call 112 directly.")
            );
          },
        },
      ]
    );
  };

  const CommunityModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isCommunityModalVisible}
      onRequestClose={() => setIsCommunityModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-xl w-4/5">
          <Text className="text-xl font-bold mb-4 text-[#DC143C]">
            Connect with
          </Text>
          {communityLinks.map((item) => (
            <TouchableOpacity
              key={item.title}
              className="flex-row items-center p-3 mb-2 bg-[#FFF1F3] rounded-lg"
              onPress={() => {
                setIsCommunityModalVisible(false);
                router.push(item.route);
              }}
            >
              <Ionicons name={item.icon} size={24} color="#DC143C" />
              <Text className="ml-3 text-lg text-[#333]">{item.title}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            className="mt-4 p-2 bg-[#DC143C] rounded-lg"
            onPress={() => setIsCommunityModalVisible(false)}
          >
            <Text className="text-white text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 p-5 bg-[#FFF1F3]">
      <Header />
      {/* Location Container */}
      <View className="flex-row items-center mb-6 mt-2">
        <Ionicons name="location-outline" size={20} color="black" />
        <Text className="text-md text-black ml-1 font-medium">
          Current Location: {locationString}
        </Text>
      </View>

      {/* SOS Button */}
      <TouchableOpacity
        className="w-40 h-40 rounded-full bg-[#FF3B30] justify-center items-center self-center mb-3 mt-4 shadow-lg"
        onPress={handleSOSPress}
        onLongPress={handleSOSLongPress}
        delayLongPress={800}
      >
        <Text className="text-white text-3xl font-bold">SOS</Text>
      </TouchableOpacity>
      <Text className="text-[#DC143C] mb-12 text-center font-semibold">
        Tap to report an incident • Hold to open a call to 112
      </Text>

      {/* Feature Cards */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View className="flex-1 mx-1">
          <TouchableOpacity
            className="bg-white p-6 py-8 rounded-xl mb-3 items-center shadow-md shadow-[#DC143C]"
            onPress={() => {
              router.push("/pages/safeTravel");
            }}
          >
            <Ionicons name="map-outline" size={24} color="#DC143C" />
            <Text className="mt-2 text-[#333] font-medium text-center">
              Safe Travel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white p-6 py-8 rounded-xl mb-3 items-center shadow-md shadow-[#DC143C]"
            onPress={() => {
              router.push("/pages/helplines");
            }}
          >
            <Ionicons name="call-outline" size={24} color="#DC143C" />
            <Text className="mt-2 text-[#333] font-medium text-center">
              Helplines
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white shadow-md p-6 py-8 rounded-xl mb-3 items-center shadow-[#DC143C]"
            onPress={() => {
              router.push("/pages/iotLink");
            }}
          >
            <Ionicons name="bluetooth-outline" size={24} color="#DC143C" />
            <Text className="mt-2 text-[#333] font-medium text-center">
              IOT Linking
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 mx-1">
          <TouchableOpacity
            className="bg-white p-6 py-8 rounded-xl mb-3 items-center shadow-md shadow-[#DC143C]"
            onPress={() => setIsCommunityModalVisible(true)}
          >
            <Ionicons name="people-outline" size={24} color="#DC143C" />
            <Text className="mt-2 text-[#333] font-medium text-center">
              Community
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white p-6 py-8 rounded-xl mb-3 items-center shadow-md shadow-[#DC143C]"
            onPress={() => {
              router.push("/pages/amenityMap");
            }}
          >
            <Ionicons name="medical-outline" size={24} color="#DC143C" />
            <Text className="mt-2 text-[#333] font-medium text-center">
              Amenity Map
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white p-6 py-8 rounded-xl mb-3 items-center shadow-md shadow-[#DC143C]"
            onPress={() => router.push("/pages/feedback")}
          >
            <Ionicons name="chatbox-outline" size={24} color="#DC143C" />
            <Text
              className="mt-2 text-[#333] font-medium text-center"
              onPress={() => {
                router.push("/pages/feedback");
              }}
            >
              Feedback
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* AI Chatbot Button */}
      <TouchableOpacity
        className="absolute bottom-5 right-5 w-16 h-16 m-1 rounded-full bg-[#DC143C] justify-center items-center shadow-lg"
        onPress={() => {
          router.push("/pages/aiChat");
        }}
      >
        <Ionicons name="chatbubbles-outline" size={28} color="#FFF" />
      </TouchableOpacity>

      <CommunityModal />
    </View>
  );
};

export default UserDashboard;
