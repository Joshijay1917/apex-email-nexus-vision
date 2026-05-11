import React, { useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import userApi from "@/api/userApi";

export default function Index() {
  // Use Expo's hook to listen for the deep link return
  const url = Linking.useURL();

  useEffect(() => {
    if (url) {
      const { hostname, path, queryParams } = Linking.parse(url);

      // Check if the deep link matches our backend redirect logic
      if (path === "onboarding-success" && queryParams?.token) {
        Alert.alert("Success!", `Authenticated with token: ${queryParams.token}`);
        // Here you would save the token and navigate to the WhatsApp screen
      }
    }
  }, [url]);

  const handleLogin = async () => {
    try {
      // Directs the user to your NestJS login route
      await userApi.loginUser();
    } catch (error) {
      Alert.alert("Error", "Could not open the login page.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Email<Text style={{ color: "#10b981" }}>Nexus</Text></Text>
        <Text style={styles.subtitle}>Privacy-First Email Assistant</Text>

        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Connect Gmail Account</Text>
        </TouchableOpacity>

        {url && (
          <Text style={styles.debugText}>
            Last Link: {url}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#111827",
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1f2937",
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#030712",
    fontWeight: "bold",
    fontSize: 16,
  },
  debugText: {
    marginTop: 20,
    fontSize: 10,
    color: "#4b5563",
    textAlign: "center",
  }
});