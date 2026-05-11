import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { parsePhoneNumberFromString, isSupportedCountry, CountryCode as LibPhoneNumberCode } from 'libphonenumber-js';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import userApi from '@/api/userApi';

export default function PhoneSetup() {
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('IN');
    const [countryFlag, setCountryFlag] = useState('🇮🇳');
    const [callingCode, setCallingCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendOtp = async () => {
        // Validate with libphonenumber-js
        if (!isSupportedCountry(countryCode)) {
            Alert.alert("Error", "Region not supported.");
            return;
        }

        const phoneObj = parsePhoneNumberFromString(phoneNumber, countryCode as LibPhoneNumberCode);

        if (!phoneObj || !phoneObj.isValid()) {
            Alert.alert("Invalid Number", `Please enter a valid number for ${countryCode}`);
            return;
        }

        const fullE164Number = phoneObj.number; // e.g., +919106052826

        setLoading(true);
        try {
            // Trigger your NestJS OTP service here
            await userApi.updatePhone(fullE164Number);

            router.push({
                pathname: '/verify-otp',
                params: { phoneNumber: fullE164Number }
            });
        } catch (e) {
            Alert.alert("Error", "Could not send OTP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>WhatsApp Link</Text>
            <Text style={styles.subtitle}>Enter your number to link your AI agent.</Text>

            <View style={styles.inputWrapper}>
                {/* Country Selector Trigger */}
                <TouchableOpacity
                    onPress={() => setShow(true)}
                    style={styles.countrySelector}
                >
                    <Text style={styles.flagText}>{countryFlag}</Text>
                    <Text style={styles.callingCodeText}>{callingCode}</Text>
                    <Ionicons name="chevron-down" size={14} color="#9ca3af" />
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="91060 52826"
                    placeholderTextColor="#4b5563"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "PROCESSING..." : "VERIFY VIA WHATSAPP"}</Text>
            </TouchableOpacity>

            {/* The Actual Picker Modal */}
            <CountryPicker
                show={show}
                lang={'en'}
                pickerButtonOnPress={(item) => {
                    setCountryCode(item.code);
                    setCallingCode(item.dial_code);
                    setCountryFlag(item.flag);
                    setShow(false);
                }}
                style={{
                    modal: { height: 500, backgroundColor: '#111827' },
                    backdrop: { backgroundColor: 'rgba(0,0,0,0.7)' },
                    textInput: { backgroundColor: '#1f2937', color: '#fff' },
                    countryButtonStyles: { backgroundColor: '#111827', borderBottomColor: '#1f2937' },
                    countryName: { color: '#fff' },
                    dialCode: { color: '#9ca3af' }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#030712', padding: 24, justifyContent: 'center' },
    title: { color: 'white', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
    subtitle: { color: '#9ca3af', textAlign: 'center', marginTop: 8, marginBottom: 40 },
    inputWrapper: {
        flexDirection: 'row',
        backgroundColor: '#111827',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#1f2937',
        height: 64,
        alignItems: 'center',
        paddingHorizontal: 16
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#1f2937',
        paddingRight: 12,
        marginRight: 12,
        gap: 6
    },
    flagText: { fontSize: 20 },
    callingCodeText: { color: 'white', fontSize: 16, fontWeight: '600' },
    input: { flex: 1, color: 'white', fontSize: 18, fontWeight: '500' },
    button: {
        backgroundColor: '#10b981',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#10b981',
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    buttonText: { color: '#030712', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }
});