import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export interface CommunityPost {
  id: string;
  username: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  location?: string;
  likedByMe?: boolean;
}

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (post: CommunityPost) => void;
}

export default function CreatePostModal({
  visible,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string | undefined>();

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to attach an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) setImage(result.assets[0].uri);
  };

  const handleAddLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow location access to attach a location.");
      return;
    }
    try {
      const position = await Location.getCurrentPositionAsync({});
      const addresses = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      const address = addresses[0];
      setLocation(
        address
          ? [address.city, address.region].filter(Boolean).join(", ")
          : `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
      );
    } catch {
      Alert.alert("Location unavailable", "Could not read your current location.");
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert("Write a post", "Add some text before posting.");
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      username: "You",
      //   timestamp: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      content,
      imageUrl: image ?? undefined,
      likes: 0,
      comments: 0,
      location,
      likedByMe: false,
    };

    onSubmit(newPost);
    setContent("");
    setImage(null);
    setLocation(undefined);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold">Create Post</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} />
            </TouchableOpacity>
          </View>

          <TextInput
            multiline
            placeholder="Share your safety tip or experience..."
            className="bg-gray-100 p-4 rounded-2xl mb-4"
            value={content}
            onChangeText={setContent}
            maxLength={1000}
          />

          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={handlePickImage}
              className="flex-row items-center bg-gray-100 px-4 py-2 rounded-2xl mr-2"
            >
              <MaterialIcons name="image" size={24} color="gray" />
              <Text className="ml-2">{image ? "Change Image" : "Add Image"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddLocation}
              className="flex-row items-center bg-gray-100 px-4 py-2 rounded-2xl"
            >
              <MaterialIcons name="location-on" size={24} color="gray" />
              <Text className="ml-2">{location ?? "Add Location"}</Text>
            </TouchableOpacity>
          </View>
          {image && (
            <Image source={{ uri: image }} className="w-20 h-20 rounded-lg mb-3" />
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#DC143C] p-4 rounded-2xl items-center"
          >
            <Text className="text-white font-semibold">Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
