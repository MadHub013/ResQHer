import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/app/AppComponents/User/Header";
import { GuardianCard } from "../../../components/UserProfile/GuardianCard";
import { EditProfileModal } from "../../../components/UserProfile/EditProfileModal";
import { AddGuardianModal } from "../../../components/UserProfile/AddGuardianModal";
import { DeleteAccountModal } from "../../../components/UserProfile/DeleteAccountModal";
import { readLocalValue, writeLocalValue } from "@/utils/localStore";
import type { Guardian } from "../../../components/UserProfile/AddGuardianModal";

const PROFILE_KEY = "resqher.profile";
const GUARDIANS_KEY = "resqher.guardians";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  profilePic: string | null;
}

export default function UserProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddGuardian, setShowAddGuardian] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [userData, setUserData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    profilePic: null,
  });

  const [guardians, setGuardians] = useState<Guardian[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    Promise.all([
      readLocalValue(PROFILE_KEY, userData),
      readLocalValue<Guardian[]>(GUARDIANS_KEY, []),
    ])
      .then(([profile, savedGuardians]) => {
        if (!isMounted) return;
        setUserData(profile);
        setGuardians(savedGuardians);
      })
      .catch((error: unknown) => {
        Alert.alert(
          "Could not load profile",
          error instanceof Error ? error.message : "Please restart the app."
        );
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const saveGuardians = async (updatedGuardians: Guardian[]): Promise<boolean> => {
    try {
      await writeLocalValue(GUARDIANS_KEY, updatedGuardians);
      setGuardians(updatedGuardians);
      return true;
    } catch (error) {
      Alert.alert(
        "Could not save emergency contacts",
        error instanceof Error ? error.message : "Please try again."
      );
      return false;
    }
  };

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to choose a profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const updatedProfile = { ...userData, profilePic: result.assets[0].uri };
      try {
        await writeLocalValue(PROFILE_KEY, updatedProfile);
        setUserData(updatedProfile);
      } catch (error) {
        Alert.alert(
          "Could not save photo",
          error instanceof Error ? error.message : "Please try again."
        );
      }
    }
  };

  const handleDeleteGuardian = (id: string) => {
    // Prevent deleting if it's the last guardian
    const guardian = guardians.find((g) => g.id === id);
    if (guardian?.isPrimary && guardians.length > 1) {
      Alert.alert("Primary contact", "Choose another primary contact first.");
    } else {
      void saveGuardians(guardians.filter((g) => g.id !== id));
    }
  };

  const handleSetPrimary = (id: string) => {
    void saveGuardians(
      guardians.map((g) => ({
        ...g,
        isPrimary: g.id === id,
      }))
    );
  };

  return (
    <View className="flex-1 bg-[#FFF1F3]">
      <View className="px-4 py-4 pb-2">
        <Header />
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Profile Section */}
        <View className="items-center mt-4">
          <View className="relative">
            <Image
              source={
                userData.profilePic
                  ? { uri: userData.profilePic }
                  : require("../../../assets/default-profile.png")
              }
              className="w-24 h-24 rounded-full bg-white"
              defaultSource={require("../../../assets/default-profile.png")}
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-[#DC143C] p-2 rounded-full"
              onPress={pickProfilePhoto}
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-bold mt-2">{userData.name}</Text>
          {userData.name.length === 0 && (
            <Text className="text-gray-500 mt-1">Add your profile details to get started.</Text>
          )}
          <TouchableOpacity
            className="mt-2 px-4 py-2 bg-[#DC143C] rounded-full"
            onPress={() => setIsEditMode(true)}
          >
            <Text className="text-white">Edit Profile</Text>
          </TouchableOpacity>

          <View className="w-full mt-4 bg-white rounded-lg p-4">
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text className="ml-2 text-gray-600">{userData.email}</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text className="ml-2 text-gray-600">{userData.phone}</Text>
            </View>
          </View>
        </View>

        <View className="mt-6 bg-amber-100 rounded-xl p-4">
          <Text className="font-semibold text-amber-900">Safety integrations unavailable</Text>
          <Text className="text-amber-900 mt-1">
            Live location sharing, automatic SMS, shake detection, and account
            security require services or native features that are not configured
            in this project.
          </Text>
        </View>

        {/* Guardians Section */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">Emergency Contacts</Text>
            <TouchableOpacity
              className="bg-[#DC143C] px-4 py-2 rounded-full"
              onPress={() => setShowAddGuardian(true)}
            >
              <Text className="text-white">Add Guardian</Text>
            </TouchableOpacity>
          </View>

          {/* Guardian List */}
          <View className="space-y-4">
            {guardians.length === 0 && (
              <Text className="text-gray-600 mb-3">
                Add a trusted contact before using contact-based safety features.
              </Text>
            )}
            {guardians.map((guardian) => (
              <GuardianCard
                key={guardian.id}
                guardian={guardian}
                onDelete={handleDeleteGuardian}
                onEdit={(id) => {
                  const guardian = guardians.find((g) => g.id === id);
                  if (guardian) {
                    setSelectedGuardian(guardian);
                    setShowAddGuardian(true);
                  }
                }}
                onSetPrimary={handleSetPrimary}
              />
            ))}
          </View>
        </View>

        {/* Danger Zone */}
        <View className="mt-8 mb-6">
          <Text className="text-lg font-bold text-red-600 mb-4">
            Danger Zone
          </Text>
          <TouchableOpacity
            className="bg-red-100 p-4 rounded-lg"
            onPress={() => setShowDeleteAccount(true)}
          >
              <Text className="text-red-600">Clear Local Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={isEditMode}
        onClose={() => setIsEditMode(false)}
        userData={userData}
        onSave={async (data) => {
          try {
            await writeLocalValue(PROFILE_KEY, data);
            setUserData(data);
            setIsEditMode(false);
          } catch (error) {
            Alert.alert(
              "Could not save profile",
              error instanceof Error ? error.message : "Please try again."
            );
          }
        }}
      />

      <AddGuardianModal
        visible={showAddGuardian}
        initialGuardian={selectedGuardian}
        onClose={() => {
          setShowAddGuardian(false);
          setSelectedGuardian(null);
        }}
        onSave={(guardian) => {
          const updatedGuardians = selectedGuardian
            ? guardians.map((item) =>
                item.id === selectedGuardian.id
                  ? { ...guardian, id: selectedGuardian.id }
                  : item
              )
            : [
                ...guardians,
                {
                  ...guardian,
                  id: Date.now().toString(),
                  isPrimary: guardians.length === 0 || guardian.isPrimary,
                },
              ];
          void saveGuardians(updatedGuardians).then((saved) => {
            if (saved) {
              setShowAddGuardian(false);
              setSelectedGuardian(null);
            }
          });
        }}
      />

      <DeleteAccountModal
        visible={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        onConfirm={async () => {
          try {
            await Promise.all([
              writeLocalValue(PROFILE_KEY, {
                name: "",
                email: "",
                phone: "",
                profilePic: null,
              }),
              writeLocalValue(GUARDIANS_KEY, []),
              writeLocalValue("resqher.reports", []),
              writeLocalValue("resqher.feedback", []),
              writeLocalValue("resqher.community.posts", []),
            ]);
            setUserData({ name: "", email: "", phone: "", profilePic: null });
            setGuardians([]);
            setShowDeleteAccount(false);
            Alert.alert(
              "Local data cleared",
              "This app has no server account configured; only data stored on this device was cleared."
            );
          } catch (error) {
            Alert.alert(
              "Could not clear local data",
              error instanceof Error ? error.message : "Please try again."
            );
          }
        }}
      />
    </View>
  );
}
