import { ActivityIndicator, Button, Modal, StyleSheet, Text, View } from "react-native";

export default function LLMModal({ isVisible, onClose, isReady, downloadProgress, error }: { isVisible: boolean, onClose: () => void, isReady: boolean, downloadProgress: number, error: Error | null }) {

    const progressPercent = Math.round(downloadProgress * 100);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose} // Good practice for Android back button
        >
            {/* This View creates the darkened, centered backdrop */}
            <View style={styles.modalOverlay}>
                <View style={styles.card}>
                    {isReady ? (
                        <>
                            <Text style={styles.statusText}>✅ Model Ready</Text>
                            <Button title="Let's Start!" onPress={onClose} color="#10b981" />
                        </>
                    ) : (
                        <>
                            <Text style={styles.statusText}>Downloading Model Assets...</Text>
                            <View style={styles.progressContainer}>
                                <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
                            </View>
                            <Text style={styles.percentText}>{progressPercent}%</Text>
                            <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 20 }} />
                        </>
                    )}
                    {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    // This is the key change: ensure the overlay fills the modal's screen space
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)' // Darker overlay for better focus
    },
    card: {
        width: '85%', // Prevent the card from touching screen edges
        backgroundColor: '#1e293b',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    statusText: { color: '#9ca3af', marginBottom: 15, fontSize: 16 },
    progressContainer: {
        width: '100%',
        height: 10,
        backgroundColor: '#334155',
        borderRadius: 5,
        overflow: 'hidden'
    },
    progressBar: { height: '100%', backgroundColor: '#38bdf8' },
    percentText: { color: '#38bdf8', marginTop: 10, fontWeight: 'bold' },
    errorText: { color: '#ef4444', marginTop: 10, textAlign: 'center' }
});