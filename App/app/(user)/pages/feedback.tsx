import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Header from "@/app/AppComponents/User/Header";
import { readLocalValue, writeLocalValue } from "@/utils/localStore";

interface FeedbackItem {
  id: number;
  text: string;
  rating: number;
  category: string;
  status: string;
  date: string;
  isAnonymous?: boolean;
  image?: string | null;
}

const FEEDBACK_KEY = "resqher.feedback";

const FeedbackPage = () => {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("general");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    readLocalValue<FeedbackItem[]>(FEEDBACK_KEY, [])
      .then((items) => {
        if (isMounted) setFeedbackHistory(items);
      })
      .catch((error: unknown) => {
        Alert.alert(
          "Could not load feedback history",
          error instanceof Error ? error.message : "Please restart the app."
        );
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    { label: "General Feedback", value: "general" },
    { label: "Bug Report", value: "bug" },
    { label: "Feature Request", value: "feature" },
    { label: "Safety Concern", value: "safety" },
    { label: "Other", value: "other" },
  ];

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to attach a screenshot.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (feedback.length < 10) {
      Alert.alert("Error", "Feedback must be at least 10 characters long");
      return;
    }

    const categoryLabel =
      categories.find((item) => item.value === category)?.label ?? category;
    const newFeedback: FeedbackItem = {
      id: Date.now(),
      text: feedback,
      rating,
      category: categoryLabel,
      status: "Received",
      date: new Date().toISOString().split("T")[0],
      isAnonymous,
      image,
    };

    setIsSubmitting(true);
    try {
      const updatedFeedback = [newFeedback, ...feedbackHistory];
      await writeLocalValue(FEEDBACK_KEY, updatedFeedback);
      setFeedbackHistory(updatedFeedback);
      setFeedback("");
      setRating(0);
      setCategory("general");
      setImage(null);
      Alert.alert(
        "Feedback saved on this device",
        "It has not been sent to the project team because no feedback service is configured."
      );
    } catch (error) {
      Alert.alert(
        "Could not save feedback",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-[#FFF1F3]">
        <View className="px-4 pt-2">
          <Header />
        </View>

        {/* Feedback Form */}
        <View className="p-4">
          <Text className="text-gray-600 mb-3">
            Feedback is stored locally on this device and is not sent to the team.
          </Text>
          <View className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <Text className="text-lg font-semibold mb-2">Your Feedback</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-3 min-h-[100] mb-4 text-base"
              multiline
              placeholder="Share your thoughts (min 10 characters)"
              value={feedback}
              onChangeText={setFeedback}
              maxLength={500}
            />

            {/* Rating */}
            <View className="flex-row mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  className="mr-2"
                >
                  <Ionicons
                    name={rating >= star ? "star" : "star-outline"}
                    size={32}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Category Dropdown */}
            <View className="mb-4">
              <TouchableOpacity
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                className="border border-gray-200 rounded-xl p-4 flex-row justify-between items-center"
              >
                <Text>
                  {categories.find((c) => c.value === category)?.label}
                </Text>
                <Ionicons
                  name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>

              {isDropdownOpen && (
                <View className="absolute top-[100%] left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 z-10">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.value}
                      onPress={() => {
                        setCategory(cat.value);
                        setIsDropdownOpen(false);
                      }}
                      className="p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <Text>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Anonymous Toggle */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base">Submit Anonymously</Text>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: "#767577", true: "#DC143C" }}
              />
            </View>

            {/* Image Upload */}
            <TouchableOpacity
              onPress={handleImagePick}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 mb-4 items-center"
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="w-full h-40 rounded-lg"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="image-outline" size={32} color="#666" />
                  <Text className="text-gray-500 mt-2">
                    Tap to attach screenshot
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#DC143C] rounded-xl py-3 items-center"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Save Feedback
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Feedback History */}
          <View className="bg-white rounded-2xl p-4 shadow-md">
            <Text className="text-lg font-semibold mb-4">Your Submissions</Text>
            {feedbackHistory.map((item) => (
              <View
                key={item.id}
                className="border-b-hairline border-gray-400 py-3"
              >
                <Text className="text-base">{item.text}</Text>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-gray-500">{item.category}</Text>
                  <Text
                    className={`${
                      item.status === "Received"
                        ? "text-blue-500"
                        : item.status === "In Progress"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {item.status}
                  </Text>
                </View>
                <Text className="text-gray-400 text-sm">{item.date}</Text>
              </View>
            ))}
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
  );
};

export default FeedbackPage;
