import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    ActivityIndicator,
    Alert,
    Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// --- Dependencies (Assumed Imports) ---
// WalletBridge from Step 3: Handles the network/MPC logic
import { WalletBridge } from '../services/unified_abstraction_layer';
// BiometricsService from Step 4: Handles local security authentication
import { BiometricsService } from '../services/BiometricsService'; 

const MOCK_TX_DATA = {
    coinSymbol: 'ETH',
    amount: '0.05',
    fiatAmount: '$150.00',
    recipientAddress: '0x1A2b3C4d5E6f7G8h9I0j...',
    networkFee: '0.0001 ETH ($0.35)',
    totalCost: '0.0501 ETH ($150.35)',
    deviceKeyShare: 'MOCK_DEVICE_SHARE_FROM_SEND_SCREEN', // Securely passed from SendScreen
};

export default function TransactionConfirmation({ route, navigation }) {
    // Transaction data should be passed from the SendScreen
    const txData = route?.params?.txDetails || MOCK_TX_DATA; 
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * @function handleConfirmTransaction
     * @description Final step: Calls the BiometricsService to authenticate, then 
     * calls WalletBridge to combine shares (MPC) and broadcast the transaction.
     */
    const handleConfirmTransaction = async () => {
        setError(null);
        setIsLoading(true);

        try {
            // 1. Re-authenticate biometrically if needed, or simply proceed if the key was retrieved in SendScreen.
            // Since the key share is passed from SendScreen, we assume biometric authentication was successful there (Step 9).
            
            // 2. Set the Network and send the transaction using the Unified Bridge (Step 3)
            WalletBridge.setNetwork(txData.coinSymbol);
            
            // This call triggers the full MPC process (Device Share + Server Policy Check/Share)
            const result = await WalletBridge.sendTransaction(
                txData, 
                txData.deviceKeyShare
            );

            // 3. Success: Navigate to the Transaction Status Screen (Step 10)
            navigation.replace('TransactionStatus', { 
                txId: result.txId, 
                status: 'pending',
                network: txData.coinSymbol
            });

        } catch (e) {
            console.error("Transaction Error:", e);
            setError(`Transaction failed: ${e.message}.`);
            Alert.alert("Error", `Transaction failed: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Helper function for clear display of address
    const formatAddress = (address) => {
        if (!address) return 'N/A';
        return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Confirm Transaction</Text>
            
            <View style={styles.card}>
                <Text style={styles.amountText}>{txData.amount} {txData.coinSymbol}</Text>
                <Text style={styles.fiatText}>{txData.fiatAmount}</Text>
                
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>To Address:</Text>
                    <Text style={styles.detailValue}>{formatAddress(txData.recipientAddress)}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Network Fee:</Text>
                    <Text style={styles.detailValue}>{txData.networkFee}</Text>
                </View>

                <View style={[styles.detailRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>{txData.totalCost}</Text>
                </View>
                
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
            
            <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={handleConfirmTransaction}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <View style={styles.buttonContent}>
                        <Ionicons 
                            name={Platform.OS === 'ios' ? "finger-print-sharp" : "finger-print"} 
                            size={24} 
                            color="#FFFFFF" 
                        />
                        <Text style={styles.buttonText}>Final Authorization & Sign</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
                disabled={isLoading}
            >
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A237E',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6,
        marginBottom: 30,
    },
    amountText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#1A237E',
        textAlign: 'center',
    },
    fiatText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#6A7398',
        textAlign: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    detailLabel: {
        fontSize: 16,
        color: '#6A7398',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1A237E',
    },
    totalRow: {
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#DDD',
        paddingTop: 15,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A237E',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A237E',
    },
    confirmButton: {
        backgroundColor: '#00C853', // Bright green for confirmation
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 10,
    },
    cancelButton: {
        alignItems: 'center',
        padding: 10,
    },
    cancelText: {
        fontSize: 16,
        color: '#6A7398',
    },
    errorText: {
        color: '#D32F2F',
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '500',
    }
});
