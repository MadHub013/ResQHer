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
import { Ionicons } from "@expo/vector-icons";
import Header from "../../AppComponents/User/Header";

// Mock data for doctors
const DOCTORS = [
  {
    id: 1,
    name: "Dr. Priya Shah",
    specialization: "Gynecologist",
    experience: 15,
    languages: ["English", "Hindi"],
    isAvailable: true,
    rating: 4.8,
    location: "Kailash Colony, Delhi",
    consultationFee: "₹800",
  },
  {
    id: 2,
    name: "Dr. Sarah Khan",
    specialization: "Mental Health",
    experience: 10,
    languages: ["English", "Hindi", "Urdu"],
    isAvailable: true,
    rating: 4.9,
    location: "Green Park, Delhi",
    consultationFee: "₹1000",
  },
  {
    id: 3,
    name: "Dr. Anjali Desai",
    specialization: "General Physician",
    experience: 12,
    languages: ["English", "Gujarati"],
    isAvailable: false,
    rating: 4.7,
    location: "Rohini, Delhi",
    consultationFee: "₹500",
  },
  {
    id: 4,
    name: "Dr. Mary Thomas",
    specialization: "Pediatrician",
    experience: 8,
    languages: ["English", "Malayalam"],
    isAvailable: true,
    rating: 4.6,
    location: "Vasant Kunj, Delhi",
    consultationFee: "₹700",
  },
];

const HEALTH_RESOURCES: {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  {
    id: 1,
    title: "Women's Health Guide",
    description: "Essential health tips and regular checkup guidelines.",
    icon: "woman-outline",
  },
  {
    id: 2,
    title: "Mental Wellness",
    description: "Understanding mental health and seeking help.",
    icon: "happy-outline",
  },
  {
    id: 3,
    title: "Pregnancy Care",
    description: "Complete guide for maternal health and childcare.",
    icon: "heart-outline",
  },
];

export default function DoctorsConnect() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof DOCTORS)[number] | null
  >(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

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

  const handleBooking = (doctor: (typeof DOCTORS)[number]) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const filteredDoctors = DOCTORS.filter((doctor) =>
    `${doctor.name} ${doctor.specialization} ${doctor.location}`
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
            Quick Medical Help
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              className="bg-[#DC143C] p-4 rounded-xl w-[48%] mb-3 shadow-md"
              onPress={() => handleEmergencyCall("102")}
            >
              <Text className="text-white text-center font-medium">
                Ambulance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 p-4 rounded-xl w-[48%] mb-3"
              disabled
            >
              <Text className="text-gray-700 text-center font-medium">
                Location sharing unavailable
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Doctors */}
        <View className="px-4">
          <Text className="text-amber-900 bg-amber-100 rounded-lg p-3 mb-3">
            Example listings only. Providers are not verified and booking or
            emergency dispatch is not connected.
          </Text>
          <TextInput
            className="bg-white p-3 rounded-xl mb-4 shadow-sm"
            placeholder="Search doctors by name or specialization..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Doctors List */}
          {filteredDoctors.map((doctor) => (
            <View
              key={doctor.id}
              className="bg-white p-4 rounded-xl mb-4 shadow-md"
            >
              <View className="mb-2">
                <Text className="text-lg font-bold text-[#333]">
                  {doctor.name}
                </Text>
                <Text className="text-gray-600">{doctor.specialization}</Text>
                <Text className="text-gray-600">
                  {doctor.experience} years experience
                </Text>
                <Text className="text-gray-600">📍 {doctor.location}</Text>
                <Text className="text-[#DC143C] font-medium mt-1">
                  Fee: {doctor.consultationFee}
                </Text>
              </View>

              <View className="flex-row justify-between items-center mt-3">
                {doctor.isAvailable ? (
                  <View className="bg-green-100 px-3 py-1 rounded-lg">
                    <Text className="text-green-800">Available Now</Text>
                  </View>
                ) : (
                  <View className="bg-red-100 px-3 py-1 rounded-lg">
                    <Text className="text-red-800">Unavailable</Text>
                  </View>
                )}
                <TouchableOpacity
                  className="bg-[#DC143C] px-4 py-2 rounded-lg"
                  onPress={() => handleBooking(doctor)}
                >
                  <Text className="text-white font-medium">
                    Book Consultation
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Health Resources */}
        <View className="px-4 pt-2 pb-4">
          <Text className="text-2xl font-bold text-[#DC143C] mb-4">
            Health Resources
          </Text>
          {HEALTH_RESOURCES.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              className="bg-white p-4 rounded-xl mb-4 shadow-md"
            >
              <View className="flex-row items-center">
                <View className="bg-[#FFF1F3] p-2 rounded-lg">
                  <Ionicons name={resource.icon} size={24} color="#DC143C" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-lg font-bold text-[#333]">
                    {resource.title}
                  </Text>
                  <Text className="text-gray-600">{resource.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Button */}
        <TouchableOpacity
          className="bg-[#DC143C] p-4 mx-4 mb-6 rounded-xl shadow-lg"
          onPress={() => handleEmergencyCall("112")}
        >
          <Text className="text-white text-center text-lg font-bold">
            Call Emergency Services (112)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-[90%]">
            <Text className="text-xl font-bold mb-4 text-[#DC143C]">
              Booking unavailable
            </Text>
            <Text className="text-gray-700 mb-4">
              {selectedDoctor?.name} is an example listing. This app is not
              connected to a booking service; contact a verified provider
              directly.
            </Text>
            <TouchableOpacity
              className="bg-[#DC143C] p-4 rounded-xl"
              onPress={() => {
                setShowBookingModal(false);
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
