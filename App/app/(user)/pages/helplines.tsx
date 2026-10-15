import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/app/AppComponents/User/Header";

type Helpline = {
  name: string;
  number: string;
  desc: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  whatsapp?: boolean;
};

type HelplineCategory = {
  category: string;
  items: Helpline[];
};

// Helpline data structure
const helplineData: HelplineCategory[] = [
  {
    category: "Emergency",
    items: [
      {
        name: "Women's Emergency",
        number: "1091",
        desc: "National women's helpline for immediate assistance",
        icon: "woman",
      },
      {
        name: "Police",
        number: "100",
        desc: "Emergency police response",
        icon: "shield-checkmark",
      },
      {
        name: "Ambulance",
        number: "102",
        desc: "Medical emergency services",
        icon: "medical",
      },
    ],
  },
  {
    category: "Mental Health",
    items: [
      {
        name: "Mental Health Helpline",
        number: "1800-599-0019",
        desc: "Counseling and support",
        icon: "heart",
      },
      {
        name: "Crisis Support",
        number: "9152987821",
        desc: "24/7 crisis intervention",
        whatsapp: true,
        icon: "help-buoy",
      },
    ],
  },
];

export default function Helplines() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSOSModal, setShowSOSModal] = useState(false);

  const handleCall = (number: string) => {
    void Linking.openURL(`tel:${number}`).catch(() =>
      Alert.alert("Unable to open phone", "Please dial the number directly.")
    );
  };

  const handleWhatsApp = (number: string) => {
    void Linking.openURL(`https://wa.me/${number}`).catch(() =>
      Alert.alert("Unable to open WhatsApp", "Please try calling the helpline.")
    );
  };

  const HelplineCard = ({ item }: { item: Helpline }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-md">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <Ionicons
            name={item.icon}
            size={24}
            color="#2E7D32"
            className="mr-2"
          />
          <Text className="text-lg font-semibold text-[#333] ml-2">
            {item.name}
          </Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => handleCall(item.number)}
            className="bg-[#1976D2] rounded-full p-2 mr-2"
          >
            <Ionicons name="call" size={20} color="white" />
          </TouchableOpacity>
          {item.whatsapp && (
            <TouchableOpacity
              onPress={() => handleWhatsApp(item.number)}
              className="bg-[#25D366] rounded-full p-2"
            >
              <Ionicons name="logo-whatsapp" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text className="text-[#666] mt-1">{item.desc}</Text>
      <Text className="text-[#1976D2] font-medium mt-1">{item.number}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FFF1F3] p-5">
      <Header />
      <View className="bg-white rounded-xl mb-4 shadow-sm mt-4">
        <TextInput
          className="p-3"
          placeholder="Search helplines..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {["All", ...helplineData.map((cat) => cat.category)].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`mr-2 mb-6 h-10 px-4 py-2 rounded-full ${
              selectedCategory === category ? "bg-[#DC143C]" : "bg-white"
            }`}
          >
            <Text
              className={`${
                selectedCategory === category ? "text-white" : "text-[#333]"
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {helplineData
          .filter(
            (cat) =>
              selectedCategory === "All" || cat.category === selectedCategory
          )
          .map((category) => (
            <View key={category.category} className="mb-4">
              <Text className="text-lg font-semibold mb-2 text-[#333]">
                {category.category}
              </Text>
              {category.items
                .filter(
                  (item) =>
                    item.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.number.includes(searchQuery)
                )
                .map((item, index) => (
                  <HelplineCard key={index} item={item} />
                ))}
            </View>
          ))}
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 right-5 w-16 h-16 m-1 rounded-full bg-[#DC143C] justify-center items-center shadow-lg" // Changed to blue
        onPress={() => {
          router.push("/pages/aiChat");
        }}
      >
        <Ionicons name="chatbubbles-outline" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
