import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LLMModal from '@/components/home/model-loading-modal';
import gmailApi, { EmailItem } from '@/api/gmailApi';
import { QWEN2_5_0_5B_QUANTIZED, useLLM } from 'react-native-executorch';

interface item extends EmailItem { }

export default function Home() {
    const { isReady, downloadProgress, sendMessage, error } = useLLM({ model: QWEN2_5_0_5B_QUANTIZED });
    const [emails, setEmails] = useState<item[]>([]);
    const [isModalAvailable, setIsModalAvailable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiResponses, setAiResponses] = useState<Record<string, string>>({});

    const fetchPreview = async () => {
        // 1. Ensure model is ready for secure background execution
        if (!isReady) return;

        setLoading(true);

        try {
            const result = await gmailApi.syncEmails();

            if (result.status === 'success') {
                const fetchedEmails = result.data;

                // 2. Immediately render emails to the UI for optimal UX
                setEmails(fetchedEmails);
                setLoading(false);

                // 3. Generate AI summaries sequentially in background to prevent OOM & UI lockup
                const responses: Record<string, string> = {};

                for (const email of fetchedEmails) {
                    try {
                        const prompt = `
Summarize this email in 1 short sentence.

Email:
${email.snippet?.slice(0, 500)}
                        `;

                        const ai = await sendMessage(prompt);
                        responses[email.id] = ai || "No AI summary available";
                    } catch (err) {
                        responses[email.id] = "AI generation failed";
                    }

                    // Update state after each generation to "pop-in" summaries incrementally
                    setAiResponses({ ...responses });
                }
            }
        } catch (error) {
            console.error('Failed to sync:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isReady) {
            fetchPreview();
        }
    }, [isReady]);

    useEffect(() => {
        setIsModalAvailable(!isReady);
    }, [isReady]);

    const renderHeader = () => (
        <>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Hello, Jay</Text>
                    <Text style={styles.status}>Agent is monitoring 4 services</Text>
                </View>
                <TouchableOpacity style={styles.profileBtn}>
                    <Ionicons name="person-circle-outline" size={32} color="#10b981" />
                </TouchableOpacity>
            </View>

            {/* Agent Status Card */}
            <LinearGradient
                colors={['#065f46', '#030712']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statusCard}
            >
                <View style={styles.cardRow}>
                    <View>
                        <Text style={styles.cardTitle}>Nexus AI Agent</Text>
                        <View style={styles.activeBadge}>
                            <View style={styles.pulse} />
                            <Text style={styles.activeText}>ACTIVE</Text>
                        </View>
                    </View>
                    <Ionicons name="flash" size={32} color="#10b981" />
                </View>
                <Text style={styles.cardDesc}>
                    Watching your Gmail for priority invoices and critical alerts.
                </Text>
            </LinearGradient>

            <Text style={styles.previewTitle}>LATEST SYNC PREVIEW</Text>
        </>
    );

    const renderEmailItem = ({ item }: { item: item }) => (
        <View style={styles.emailCard}>
            <View style={styles.iconCircle}>
                <Ionicons name="mail-unread-outline" size={20} color="#10b981" />
            </View>
            <View style={styles.emailContent}>
                <Text style={styles.emailSnippet} numberOfLines={2}>
                    {item.snippet || "No preview available"}
                </Text>
                <View style={styles.aiResponseContainer}>
                    <Text style={styles.aiResponseTitle}>AI Insight</Text>
                    <Text style={styles.aiResponse}>
                        {aiResponses[item.id] || (isReady ? "Generating AI response..." : "Waiting for model...")}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderEmptyComponent = () => {
        if (loading) {
            return (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#10b981" />
                    <Text style={styles.loaderText}>Syncing securely...</Text>
                </View>
            );
        }
        return <Text style={styles.emptyText}>No recent emails found.</Text>;
    };

    return (
        <View style={styles.container}>
            {/* Lifted prop state provides singleton loading visualizer */}
            <LLMModal
                isVisible={isModalAvailable}
                onClose={() => setIsModalAvailable(false)}
                isReady={isReady}
                downloadProgress={downloadProgress}
                error={error}
            />

            <FlatList
                data={emails}
                renderItem={renderEmailItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={styles.content}

                // Production-grade performance settings
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#030712',
    },
    content: {
        padding: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    status: {
        color: '#9ca3af',
        fontSize: 14,
    },
    profileBtn: {
        padding: 4,
    },
    statusCard: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#064e3b',
        marginBottom: 32,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    pulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
        marginRight: 6,
    },
    activeText: {
        color: '#10b981',
        fontSize: 10,
        fontWeight: '800',
    },
    cardDesc: {
        color: '#d1d5db',
        fontSize: 14,
        lineHeight: 20,
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
        backgroundColor: '#111827',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1f2937',
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
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        color: '#9ca3af',
        marginTop: 12,
    },
    emptyText: {
        color: '#4b5563',
        textAlign: 'center',
        marginTop: 40,
    },
    aiResponseContainer: {
        marginTop: 10,
        backgroundColor: '#065f46',
        padding: 12,
        borderRadius: 12,
    },
    aiResponseTitle: {
        color: '#a7f3d0',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 4,
    },
    aiResponse: {
        color: '#ecfdf5',
        fontSize: 13,
        lineHeight: 18,
    }
});