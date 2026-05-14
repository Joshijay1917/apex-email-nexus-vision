import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { OtpInput } from "react-native-otp-entry"; // npx expo install react-native-otp-entry
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import userApi from '@/api/userApi';

export default function VerifyOtp() {
    const [isVerifying, setIsVerifying] = useState(false);
    const [timer, setTimer] = useState(30);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { phoneNumber } = useLocalSearchParams();

    // Resend Timer Logic
    useEffect(() => {
        let interval = setInterval(() => {
            setTimer(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleVerify = async (code: string) => {
        setError(null); // Clear previous errors
        setIsVerifying(true);

        try {
            const response = await userApi.verifyOtp(code);

            if (response.success) {
                // Success! Proceed and STOP function execution here
                router.push('/(tabs)/home');
                return;
            }

            // If success is false:
            setError(response.message || "Invalid Code");
            Alert.alert("Invalid Code", response.message || "The OTP is incorrect.");

        } catch (err) {
            // Handle network/server errors
            setError("Connection Failed");
            Alert.alert("Error", "Failed to connect to the server.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = () => {
        if (timer === 0) {
            setTimer(30);
            userApi.resendOtp();
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#9ca3af" />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Verification</Text>
                    <Text style={styles.subtitle}>
                        Enter the 6-digit code sent to your WhatsApp number
                        <Text style={styles.phoneHighlight}> {phoneNumber}</Text>
                    </Text>
                </View>

                <OtpInput
                    numberOfDigits={6}
                    focusColor="#10b981"
                    focusStickBlinkingDuration={500}
                    onFilled={(text) => handleVerify(text)}
                    theme={{
                        containerStyle: styles.otpContainer,
                        pinCodeContainerStyle: error ? styles.pinCodeContainerError : styles.pinCodeContainer,
                        pinCodeTextStyle: styles.pinCodeText,
                    }}
                />

                {isVerifying && (
                    <View style={styles.loader}>
                        <ActivityIndicator color="#10b981" />
                        <Text style={styles.loaderText}>Verifying secure link...</Text>
                    </View>
                )}

                <View style={styles.footer}>
                    <Text style={styles.resendText}>Didn&apos;t receive the code?</Text>
                    <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                        <Text style={[styles.resendButton, timer > 0 && styles.disabledText]}>
                            {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#030712' },
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
    backButton: { position: 'absolute', top: 60, left: 20 },
    header: { marginBottom: 40, alignItems: 'center' },
    title: { color: 'white', fontSize: 32, fontWeight: 'bold' },
    subtitle: { color: '#9ca3af', textAlign: 'center', marginTop: 12, lineHeight: 22 },
    phoneHighlight: { color: '#10b981', fontWeight: 'bold' },
    otpContainer: { marginVertical: 20 },
    pinCodeContainer: {
        backgroundColor: '#111827',
        borderWidth: 1,
        borderColor: '#1f2937',
        borderRadius: 12,
        width: 50,
        height: 60,
    },
    pinCodeContainerError: {
        backgroundColor: '#b10020ff',
        borderWidth: 1,
        borderColor: '#b10020ff',
        borderRadius: 12,
        width: 50,
        height: 60,
    },
    pinCodeText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    loader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    loaderText: { color: '#10b981', marginLeft: 10, fontSize: 14 },
    footer: { marginTop: 40, alignItems: 'center' },
    resendText: { color: '#4b5563', fontSize: 14 },
    resendButton: { color: '#10b981', fontWeight: 'bold', marginTop: 8 },
    disabledText: { color: '#334155' }
});