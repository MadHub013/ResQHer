import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  darkMode?: boolean;
  onSearchChange?: (query: string) => void;
}

const SearchBar = ({ darkMode = false, onSearchChange }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const updateSearch = (query: string) => {
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  return (
    <View className="bg-white rounded-full px-4 py-2 shadow-lg">
      <View className="flex-row items-center">
        <Ionicons name="search-outline" size={20} color="#000" />
        <TextInput
          className="flex-1 ml-2 text-black"
          placeholder="Search amenities..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={updateSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => updateSearch("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={darkMode ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default SearchBar;
