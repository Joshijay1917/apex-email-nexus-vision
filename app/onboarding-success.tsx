import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { setAuthToken } from '../api/apiClient';
import { gmailApi, EmailItem } from '../api/gmailApi';

// Use shared type from API file
interface item extends EmailItem { }

export default function OnboardingSuccess() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useLocalSearchParams();
    const router = useRouter();

    const fetchPreview = async () => {
        setLoading(true);
        try {
            const result = await gmailApi.syncEmails();
            if (result.status === 'success') {
                setEmails(result.data);
            }
        } catch (error) {
            console.error('Failed to sync:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            // 1. Lock the token into the global client for ALL future API requests
            setAuthToken(token as string);

            // 2. Execute synced preview
            fetchPreview();
        }
    }, [token]);

    const renderEmailItem = ({ item }: { item: item }) => (
        <View style={styles.emailCard}>
            <View style={styles.iconCircle}>
                <Ionicons name="mail-unread-outline" size={20} color="#10b981" />
            </View>
            <View style={styles.emailContent}>
                <Text style={styles.emailSnippet} numberOfLines={2}>
                    {item.snippet || "No preview available"}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.successBadge}>
                    <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                </View>
                <Text style={styles.title}>Nexus Bridge Active</Text>
                <Text style={styles.subtitle}>Your encrypted email vault is ready.</Text>
            </View>

            {/* Preview Section */}
            <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>LATEST SYNC PREVIEW</Text>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#10b981" />
                        <Text style={styles.loaderText}>Syncing securely...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={emails}
                        renderItem={renderEmailItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.emailContent}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No recent emails found.</Text>
                        }
                    />
                )}
            </View>

            {/* Action Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(tabs)/home')}
            >
                <Text style={styles.buttonText}>Continue to WhatsApp Setup</Text>
                <Ionicons name="arrow-forward" size={18} color="#030712" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#030712',
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    successBadge: {
        marginBottom: 16,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center'
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#111827',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#1f2937',
        marginBottom: 30,
    },
    previewTitle: {
        color: '#4b5563',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    emailCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#1f2937',
        padding: 14,
        borderRadius: 16,
        marginBottom: 12,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    emailContent: {
        flex: 1,
    },
    emailSnippet: {
        color: '#d1d5db',
        fontSize: 14,
        lineHeight: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        color: '#9ca3af',
        marginTop: 12,
    },
    button: {
        backgroundColor: '#10b981',
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        gap: 8,
    },
    buttonText: {
        color: '#030712',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#4b5563',
        textAlign: 'center',
        marginTop: 40,
    }
});