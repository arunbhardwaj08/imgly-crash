import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import IMGLYEditor, {
  EditorPreset,
  EditorSettingsModel,
  SourceType,
} from "@imgly/editor-react-native";

export default function App() {
  const pickVideoAndOpenEditor = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need media library permissions to select videos!"
        );
        return;
      }

      // Launch image picker to select video
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      // Get the selected video URI
      const videoUri = result.assets[0].uri;

      // Configure IMGLY Editor settings
      const settings = new EditorSettingsModel({
        license: null, // TODO: Add your license key here (null for evaluation mode with watermark)
        userId: "user_123", // Optional: Add unique user ID
      });

      // Open IMGLY Video Editor with the selected video
      const editorResult = await IMGLYEditor.openEditor(
        settings,
        {
          source: videoUri,
          type: SourceType.VIDEO,
        },
        EditorPreset.VIDEO
      );

      console.log("Editor result:", editorResult);

      if (editorResult) {
        Alert.alert("Success", "Video edited successfully!");
      }
    } catch (error) {
      console.error("Error opening video editor:", error);
      Alert.alert("Error", `Failed to open video editor: ${error.message}`);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>IMGLY Video Editor</Text>
        <Text style={styles.subtitle}>Select a video to edit</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={pickVideoAndOpenEditor}
        >
          <Text style={styles.buttonText}>Select Video from Device</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Note: Add your IMGLY license key in the code
        </Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    fontSize: 12,
    color: "#999999",
    marginTop: 30,
    textAlign: "center",
  },
});
