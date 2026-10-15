import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

export default function Header() {
  const pathname = usePathname();
  const isUserPage = pathname === "/user";

  return (
    <View className="border-b-hairline flex flex-row justify-between items-center mb-1 pb-2">
      {isUserPage ? (
        <Text className="text-3xl font-bold text-[#DC143C]">ResQHer</Text>
      ) : (
        <TouchableOpacity
          onPress={() => {
            router.replace("/user");
          }}
        >
          <Text className="text-3xl font-bold text-[#DC143C]">ResQHer</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        className="flex items-center justify-center w-12 h-12"
        onPress={() => {
          router.push("/pages/userProfile");
        }}
      >
        <Ionicons name="person-circle-outline" size={42} color="#DC143C" />
      </TouchableOpacity>
    </View>
  );
}
