import React, { useEffect, useState } from "react";
import { Alert, Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export interface Guardian {
  id?: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface AddGuardianModalProps {
  visible: boolean;
  initialGuardian?: Guardian | null;
  onClose: () => void;
  onSave: (guardian: Guardian) => void;
}

const emptyGuardian: Guardian = {
  name: "",
  relation: "Parent",
  phone: "",
  email: "",
  isPrimary: false,
};

export const AddGuardianModal = ({
  visible,
  initialGuardian,
  onClose,
  onSave,
}: AddGuardianModalProps) => {
  const [guardian, setGuardian] = useState<Guardian>(emptyGuardian);

  useEffect(() => {
    if (visible) setGuardian(initialGuardian ?? emptyGuardian);
  }, [visible, initialGuardian]);

  const relations = ["Parent", "Sibling", "Friend", "Spouse", "Other"];

  const handleSave = () => {
    if (!guardian.name.trim() || !guardian.phone.trim()) {
      Alert.alert("Missing details", "Enter the guardian's name and phone number.");
      return;
    }
    onSave({ ...guardian, name: guardian.name.trim(), phone: guardian.phone.trim() });
    setGuardian(emptyGuardian);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold">Add Guardian</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-600 mb-1">Name</Text>
              <TextInput
                className="bg-gray-100 p-3 rounded-lg"
                value={guardian.name}
                onChangeText={(text) =>
                  setGuardian({ ...guardian, name: text })
                }
                placeholder="Guardian's Name"
              />
            </View>

            <View>
              <Text className="text-gray-600 mb-1">Relation</Text>
              <View className="bg-gray-100 rounded-lg">
                <Picker
                  selectedValue={guardian.relation}
                  onValueChange={(value: string) =>
                    setGuardian({ ...guardian, relation: value })
                  }
                >
                  {relations.map((relation) => (
                    <Picker.Item
                      key={relation}
                      label={relation}
                      value={relation}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Text className="text-gray-600 mb-1">Phone</Text>
              <TextInput
                className="bg-gray-100 p-3 rounded-lg"
                value={guardian.phone}
                keyboardType="phone-pad"
                onChangeText={(text) =>
                  setGuardian({ ...guardian, phone: text })
                }
                placeholder="Guardian's Phone"
              />
            </View>

            <View>
              <Text className="text-gray-600 mb-1">Email (Optional)</Text>
              <TextInput
                className="bg-gray-100 p-3 rounded-lg"
                value={guardian.email}
                keyboardType="email-address"
                onChangeText={(text) =>
                  setGuardian({ ...guardian, email: text })
                }
                placeholder="Guardian's Email"
              />
            </View>
          </View>

          <TouchableOpacity
            className="bg-[#DC143C] p-4 rounded-lg mt-6"
            onPress={handleSave}
          >
            <Text className="text-white text-center font-semibold">
              {initialGuardian ? "Save Changes" : "Add Guardian"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
