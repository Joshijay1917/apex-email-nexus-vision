import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Ensure expo-linear-gradient is installed

export default function Home() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

            {/* Quick Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statVal}>12</Text>
                    <Text style={styles.statLabel}>Syncs Today</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statVal}>2</Text>
                    <Text style={styles.statLabel}>WhatsApp Alerts</Text>
                </View>
            </View>

            {/* Recent Activity Label */}
            <Text style={styles.sectionTitle}>Recent Insights</Text>

            {/* Example Activity Item */}
            <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                    <Ionicons name="mail" size={20} color="#9ca3af" />
                </View>
                <View style={styles.activityText}>
                    <Text style={styles.activityTitle}>Invoice Detected</Text>
                    <Text style={styles.activitySub}>Amazon.in - ₹1,299</Text>
                </View>
                <Text style={styles.activityTime}>2m ago</Text>
            </View>

            <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                    <Ionicons name="logo-whatsapp" size={20} color="#10b981" />
                </View>
                <View style={styles.activityText}>
                    <Text style={styles.activityTitle}>WhatsApp Summary Sent</Text>
                    <Text style={styles.activitySub}>Daily digest forwarded to you.</Text>
                </View>
                <Text style={styles.activityTime}>1h ago</Text>
            </View>
        </ScrollView>
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
        marginBottom: 24,
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
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#111827',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1f2937',
    },
    statVal: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        color: '#6b7280',
        fontSize: 12,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111827',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1f2937',
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1f2937',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityText: {
        flex: 1,
    },
    activityTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    activitySub: {
        color: '#9ca3af',
        fontSize: 12,
    },
    activityTime: {
        color: '#4b5563',
        fontSize: 10,
    },
});