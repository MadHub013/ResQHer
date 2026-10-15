import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Header from "../../AppComponents/User/Header";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";

// Mock data for lawyers
const LAWYERS = [
  {
    id: 1,
    name: "Adv. Sarah Johnson",
    specialization: "Women's Rights, Domestic Violence",
    experience: 12,
    languages: ["English", "Hindi"],
    isAvailable: true,
    rating: 4.8,
    location: "Connaught Place, Delhi",
  },
  {
    id: 2,
    name: "Adv. Priya Mehta",
    specialization: "Cybercrime, Workplace Harassment",
    experience: 8,
    languages: ["English", "Hindi", "Gujarati"],
    isAvailable: true,
    rating: 4.9,
    location: "Lajpat Nagar, Delhi",
  },
  {
    id: 3,
    name: "Adv. Rachel D'Souza",
    specialization: "Family Law, Property Rights",
    experience: 15,
    languages: ["English", "Marathi"],
    isAvailable: false,
    rating: 4.7,
    location: "Hauz Khas, Delhi",
  },
  {
    id: 4,
    name: "Adv. Fatima Khan",
    specialization: "Criminal Law, Sexual Harassment",
    experience: 10,
    languages: ["English", "Hindi", "Urdu"],
    isAvailable: true,
    rating: 4.9,
    location: "Saket, Delhi",
  },
  {
    id: 5,
    name: "Adv. Maya Sharma",
    specialization: "Digital Rights, Privacy Law",
    experience: 6,
    languages: ["English", "Hindi", "Bengali"],
    isAvailable: true,
    rating: 4.6,
    location: "Dwarka, Delhi",
  },
];

const LEGAL_RESOURCES = [
  {
    id: 1,
    title: "Workplace Harassment Laws",
    description:
      "Understanding your rights and protections against workplace harassment.",
    icon: "briefcase-outline",
  },
  {
    id: 2,
    title: "Domestic Violence Protection",
    description:
      "Legal remedies and protection orders for domestic violence survivors.",
    icon: "home-outline",
  },
  {
    id: 3,
    title: "Cybercrime Reporting",
    description:
      "Step-by-step guide to report online harassment and cybercrime.",
    icon: "globe-outline",
  },
  {
    id: 4,
    title: "Property Rights Guide",
    description: "Women's rights in property inheritance and ownership.",
    icon: "business-outline",
  },
];

export default function LawyersConnect() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<
    (typeof LAWYERS)[number] | null
  >(null);

  const handleEmergencyCall = (number: string) => {
    Alert.alert("Emergency Call", "Are you sure you want to place this call?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () =>
          void Linking.openURL(`tel:${number}`).catch(() =>
            Alert.alert("Unable to open phone", "Please dial the number directly.")
          ),
      },
    ]);
  };

  const handleConsultation = (lawyer: (typeof LAWYERS)[number]) => {
    setSelectedLawyer(lawyer);
    setShowConsultModal(true);
  };
  const filteredLawyers = LAWYERS.filter((lawyer) =>
    `${lawyer.name} ${lawyer.specialization} ${lawyer.location}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );

  return (
    <View className="flex-1 bg-[#FFF1F3]">
      <ScrollView className="flex-1">
        <View className="px-4 pt-4">
          <Header />
        </View>
        {/* Quick Connect Section */}
        <View className="p-4">
          <Text className="text-2xl font-bold text-[#DC143C] mb-4">
            Quick Connect to Legal Help
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              className="bg-[#DC143C] p-4 rounded-xl w-[48%] mb-3 shadow-md"
              onPress={() => handleEmergencyCall("112")}
            >
              <Text className="text-white text-center font-medium">
                Emergency Helpline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#DC143C] p-4 rounded-xl w-[48%] mb-3 shadow-md"
              onPress={() => handleEmergencyCall("1091")}
            >
              <Text className="text-white text-center font-medium">
                Women's Helpline
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search and Filter Lawyers */}
        <View className="px-4">
          <Text className="text-amber-900 bg-amber-100 rounded-lg p-3 mb-3">
            Example listings only. Lawyers are not verified and consultations
            or emergency dispatch are not connected.
          </Text>
          <TextInput
            className="bg-white p-3 rounded-xl mb-4 shadow-sm"
            placeholder="Search lawyers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Lawyers List */}
          {filteredLawyers.map((lawyer) => (
            <View
              key={lawyer.id}
              className="bg-white p-4 rounded-xl mb-4 shadow-md"
            >
              <Text className="text-lg font-bold text-[#333]">
                {lawyer.name}
              </Text>
              <Text className="text-gray-600">{lawyer.specialization}</Text>
              <Text className="text-gray-600">
                {lawyer.experience} years experience
              </Text>
              <Text className="text-gray-600">📍 {lawyer.location}</Text>
              <View className="flex-row justify-between items-center mt-3">
                {lawyer.isAvailable ? (
                  <View className="bg-green-100 px-2 py-1 rounded">
                    <Text className="text-green-800">Available Now</Text>
                  </View>
                ) : (
                  <View className="bg-red-100 px-2 py-1 rounded">
                    <Text className="text-red-800">Unavailable</Text>
                  </View>
                )}
                <TouchableOpacity
                  className="bg-[#DC143C] px-4 py-2 rounded-lg"
                  onPress={() => handleConsultation(lawyer)}
                >
                  <Text className="text-white font-medium">
                    Request Consultation
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Know Your Rights Section */}
        <View className="px-4 pt-2">
          <Text className="text-2xl font-bold text-[#DC143C] mb-4">
            Know Your Rights
          </Text>
          {LEGAL_RESOURCES.map((resource) => (
            <View
              key={resource.id}
              className="bg-white p-4 rounded-xl mb-4 shadow-md"
            >
              <Text className="text-lg font-bold text-[#333]">
                {resource.title}
              </Text>
              <Text className="text-gray-600">{resource.description}</Text>
            </View>
          ))}
        </View>

        {/* Emergency Assistance Button */}
        <TouchableOpacity
          className="bg-[#DC143C] p-4 m-4 rounded-xl shadow-lg"
          onPress={() => handleEmergencyCall("112")}
        >
          <Text className="text-white text-center text-lg font-bold">
            Call Emergency Services (112)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Consultation Modal */}
      <Modal
        visible={showConsultModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConsultModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-[90%]">
            <Text className="text-xl font-bold mb-4 text-[#DC143C]">
              Consultation unavailable
            </Text>
            <Text className="text-gray-700 mb-4">
              {selectedLawyer?.name} is an example listing. This app is not
              connected to a legal consultation service; contact a verified
              legal provider directly.
            </Text>
            <TouchableOpacity
              className="bg-[#DC143C] p-4 rounded-xl"
              onPress={() => {
                setShowConsultModal(false);
              }}
            >
              <Text className="text-white text-center font-medium">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* AI Chatbot Button */}
      <TouchableOpacity
        className="absolute bottom-5 right-5 w-16 h-16 m-1 rounded-full bg-[#DC143C] justify-center items-center shadow-lg"
        onPress={() => {
          router.push("/pages/aiChat");
        }}
      >
        <Ionicons name="chatbubbles-outline" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
