import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  TextInput,
  Linking,
  Platform,
  ActivityIndicator,
  Share,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/app/AppComponents/User/Header";
import { router } from "expo-router";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";

export default function SafeTravel() {
  const [isTracking, setIsTracking] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [showRoutes, setShowRoutes] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAP_SOURCES = {
    static: require("../../../assets/maps/staticmap.html"),
    route: require("../../../assets/maps/RouteWomen.html"),
  } as const;

  const loadLocalHtml = async (mapType: keyof typeof MAP_SOURCES = "static") => {
    try {
      setIsLoading(true);
      const asset = Asset.fromModule(MAP_SOURCES[mapType]);
      await asset.downloadAsync();
      if (!asset.localUri) {
        throw new Error("The map asset could not be loaded.");
      }
      const htmlString = await FileSystem.readAsStringAsync(asset.localUri);
      setHtmlContent(htmlString);
    } catch (error) {
      console.error("Error loading HTML:", error);
      Alert.alert("Error", "Failed to load map content");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        setElapsedTime(0);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerActive]);

  useEffect(() => {
    loadLocalHtml();
  }, []);

  const searchRoutes = async () => {
    const origin = startLocation.trim();
    const destination = endLocation.trim();
    if (!origin || !destination) {
      Alert.alert("Locations required", "Enter both a start and destination.");
      return;
    }
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
    try {
      await Linking.openURL(directionsUrl);
      setShowRoutes(true);
      await loadLocalHtml("route");
    } catch {
      Alert.alert("Could not open directions", "Please check your internet connection and try again.");
    }
  };

  const toggleTracking = () => {
    if (!isTracking) {
      Alert.alert(
        "Journey Started",
        "The elapsed-time counter will run on this device only. This app is not sharing your live location or notifying guardians.",
        [
          {
            text: "OK",
            onPress: () => {
              setTimerActive(true);
              setIsTracking(true);
              loadLocalHtml("route"); // Load route map when journey starts
            },
          },
        ]
      );
    } else {
      setTimerActive(false);
      setIsTracking(false);
      loadLocalHtml("static"); // Load static map when journey ends
    }
  };

  const triggerSOS = () => {
    Alert.alert(
      "Call emergency services?",
      "This opens your phone app to call 112. The app does not automatically send your location.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call 112",
          style: "destructive",
          onPress: () =>
            void Linking.openURL("tel:112").catch(() =>
              Alert.alert("Unable to open phone", "Please call 112 directly.")
            ),
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getWebViewSource = () => {
    if (!htmlContent) return { html: "<div></div>" }; // Provide fallback content
    return {
      html: htmlContent,
      baseUrl: Platform.OS === "android" ? "file:///android_asset/" : "",
    };
  };

  return (
    <View style={styles.container}>
      <View className="px-4 pt-2 mb-2">
        <Header />
      </View>

      {!showRoutes && (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="location-outline" size={24} color="#DC143C" />
            <TextInput
              style={styles.input}
              placeholder="Enter start location"
              value={startLocation}
              onChangeText={setStartLocation}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="navigate-outline" size={24} color="#DC143C" />
            <TextInput
              style={styles.input}
              placeholder="Enter destination"
              value={endLocation}
              onChangeText={setEndLocation}
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={searchRoutes}>
            <Text style={styles.searchButtonText}>Open Walking Directions</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View style={[styles.map, styles.centerContent]}>
          <ActivityIndicator size="large" color="#DC143C" />
        </View>
      ) : (
        <WebView
          source={getWebViewSource()}
          style={styles.map}
          originWhitelist={["*"]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
          }}
        />
      )}

      <TouchableOpacity
        className="absolute top-20 right-5 w-16 h-16 rounded-full bg-[#FF3B30] justify-center items-center shadow-lg"
        onPress={triggerSOS}
      >
        <Ionicons name="warning" size={28} color="#FFF" />
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      {isTracking && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        </View>
      )}

      {showRoutes && (
        <View style={styles.bottomSheet}>
          <Text style={styles.sectionTitle}>Walking directions</Text>
          <Text style={styles.routeDetails}>
            Directions open in Google Maps. This app does not calculate or
            verify route safety, share live location, or notify contacts.
          </Text>
          <View className="flex-row mt-4">
            <TouchableOpacity
              style={[
                styles.trackingButton,
                isTracking && styles.trackingActive,
              ]}
              onPress={toggleTracking}
            >
              <Text style={styles.trackingButtonText}>
                {isTracking ? "Stop Journey Timer" : "Start Journey Timer"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.trackingButton, { marginLeft: 8 }]}
              onPress={() =>
                void Share.share({
                  message: `My planned journey: ${startLocation} to ${endLocation}`,
                })
              }
            >
              <Text style={styles.trackingButtonText}>Share Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF1F3",
  },
  map: {
    height: Dimensions.get("window").height * 0.5,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    margin: 16,
    shadowColor: "#DC143C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#DC143C",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sosText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  routesContainer: {
    flex: 1,
  },
  safetyControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  controlItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  trackingButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
  trackingActive: {
    backgroundColor: "#FF3B30",
  },
  trackingButtonText: {
    color: "white",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  routeCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedRoute: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  safetyLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  routeDetails: {
    fontSize: 14,
    color: "#666",
  },
  instructionsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  instruction: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 15,
  },
  verifyButton: {
    backgroundColor: "#DC143C",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  verifyButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  recordingIndicator: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  recordingText: {
    color: "white",
    fontWeight: "bold",
  },
  timerContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});
