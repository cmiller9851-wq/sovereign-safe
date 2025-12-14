import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    ActivityIndicator, 
    Linking,
    Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Mock Explorer URLs for universal network support
const EXPLORER_URLS = {
    ETH: 'https://etherscan.io/tx/',
    BTC: 'https://mempool.space/tx/',
    SOL: 'https://solscan.io/tx/',
    BNB: 'https://bscscan.com/tx/',
};

export default function TransactionStatusScreen({ route, navigation }) {
    // Get transaction details from the Confirmation screen
    const { txId, status, network } = route.params;

    const [currentStatus, setCurrentStatus] = useState(status || 'pending');
    const [statusMessage, setStatusMessage] = useState('Transaction submitted to the network. Waiting for confirmation...');
    
    // Simulate real-time status updates
    useEffect(() => {
        if (currentStatus === 'pending') {
            const timer = setTimeout(() => {
                // In a real app, this would be an API poll to check the txId status
                const success = Math.random() > 0.1; // 90% chance of success for demo
                
                if (success) {
                    setCurrentStatus('confirmed');
                    setStatusMessage('Transaction successfully confirmed by the blockchain!');
                } else {
                    setCurrentStatus('failed');
                    setStatusMessage('Transaction failed to confirm. Check network status and try again.');
                }
            }, 5000); // 5 seconds wait

            return () => clearTimeout(timer);
        }
    }, [currentStatus]);

    /**
     * @function getStatusIcon
     * @description Returns the appropriate icon and color based on transaction status.
     */
    const getStatusIcon = () => {
        switch (currentStatus) {
            case 'confirmed':
                return { name: 'checkmark-circle', color: '#00C853' }; // Green
            case 'failed':
                return { name: 'close-circle', color: '#D32F2F' }; // Red
            case 'pending':
            default:
                return { name: 'time', color: '#FFA000' }; // Orange/Amber
        }
    };
    
    /**
     * @function viewOnExplorer
     * @description Opens the transaction hash in the relevant block explorer (universal support).
     */
    const viewOnExplorer = () => {
        const baseUrl = EXPLORER_URLS[network.toUpperCase()] || EXPLORER_URLS['ETH'];
        const url = `${baseUrl}${txId}`;
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const { name: iconName, color: iconColor } = getStatusIcon();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                
                <Ionicons name={iconName} size={120} color={iconColor} style={styles.statusIcon} />
                
                {currentStatus === 'pending' && <ActivityIndicator size="small" color="#FFA000" style={{ marginBottom: 20 }} />}

                <Text style={styles.statusText}>{currentStatus.toUpperCase()}</Text>
                <Text style={styles.messageText}>{statusMessage}</Text>
                
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailLabel}>Network:</Text>
                    <Text style={styles.detailValue}>{network}</Text>

                    <Text style={styles.detailLabel}>Transaction ID:</Text>
                    <Text style={styles.txIdText}>{txId.substring(0, 10)}...{txId.substring(txId.length - 10)}</Text>
                </View>

                {currentStatus !== 'pending' && (
                    <TouchableOpacity style={styles.explorerButton} onPress={viewOnExplorer}>
                        <Ionicons name="eye-outline" size={20} color="#1A237E" />
                        <Text style={styles.explorerButtonText}>View on Explorer</Text>
                    </TouchableOpacity>
                )}

            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.doneButton} onPress={() => navigation.popToTop()}>
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    statusIcon: {
        marginBottom: 30,
    },
    statusText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A237E',
        marginBottom: 10,
    },
    messageText: {
        fontSize: 16,
        color: '#6A7398',
        textAlign: 'center',
        marginBottom: 40,
        maxWidth: 300,
    },
    detailsContainer: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#EEE',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        color: '#6A7398',
        marginTop: 5,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A237E',
        marginBottom: 10,
    },
    txIdText: {
        fontSize: 12,
        color: '#1A237E',
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    explorerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#E3F2FD', // Light blue background
    },
    explorerButtonText: {
        fontSize: 16,
        color: '#1A237E',
        fontWeight: '600',
        marginLeft: 8,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    doneButton: {
        backgroundColor: '#1A237E',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
