import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export const DeleteAccountModal = ({
  visible,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 m-4 w-[90%] max-w-[400px]">
          <View className="items-center mb-4">
            <Ionicons name="warning" size={48} color="#DC143C" />
          </View>

          <Text className="text-xl font-bold text-center mb-2">
            Clear local data?
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            This clears profile, emergency contacts, reports, feedback, and
            community posts saved on this device. It does not delete a server
            account.
          </Text>

          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 bg-gray-200 p-4 rounded-lg"
              onPress={onClose}
            >
              <Text className="text-center font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-[#DC143C] p-4 rounded-lg"
              onPress={handleConfirm}
            >
              <Text className="text-white text-center font-semibold">
                Clear data
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
