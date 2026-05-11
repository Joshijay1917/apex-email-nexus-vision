import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#10b981', // Emerald 500
                tabBarInactiveTintColor: '#4b5563', // Zinc 600
                tabBarStyle: {
                    backgroundColor: '#030712', // Zinc 950
                    borderTopColor: '#1f2937', // Zinc 800
                    height: 65,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="vault"
                options={{
                    title: 'Vault',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "shield-checkmark" : "shield-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="agent"
                options={{
                    title: 'Agent',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "hardware-chip" : "hardware-chip-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "settings" : "settings-outline"} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}