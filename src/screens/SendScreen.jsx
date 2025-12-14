import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    SafeAreaView, 
    KeyboardAvoidingView, 
    Platform,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// --- Dependencies (Assumed Imports) ---
// BiometricsService from Step 4: Used to retrieve the key share (Share 1)
import { BiometricsService } from '../services/BiometricsService';

export default function SendScreen({ route, navigation }) {
    // Asset info passed from AssetDetailScreen (e.g., ETH, BTC)
    const asset = route?.params?.asset || { symbol: 'ETH', name: 'Ethereum', address: '0xMockAddress', balance: '1.5' }; 

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feeEstimate, setFeeEstimate] = useState('0.0001'); // Mock fee

    useEffect(() => {
        // In a real app, this effect would call WalletBridge to fetch real-time gas/fee estimates
        // based on the asset and current network congestion.
        console.log(`[FeeEstimator] Fetching current fee for ${asset.symbol}...`);
    }, [asset.symbol]);

    /**
     * @function handleContinue
     * @description Validates input and prepares the transaction object for confirmation.
     * Crucially, it retrieves the MPC key share (Share 1) securely via biometrics.
     */
    const handleContinue = async () => {
        if (!recipient || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert("Input Error", "Please enter a valid recipient address and amount.");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Trigger Biometric Auth and retrieve the secure key share from the device (Share 1)
            const deviceKeyShare = await BiometricsService.authenticateAndRetrieveShare();

            // 2. Prepare the full transaction object for the Confirmation screen (Step 7)
            const amountFloat = parseFloat(amount);
            const feeFloat = parseFloat(feeEstimate);
            const totalCost = amountFloat + feeFloat;
            
            // Mock fiat conversion for display purposes
            const mockFiatRate = asset.symbol === 'BTC' ? 40000 : 2500;
            
            const txDetails = {
                coinSymbol: asset.symbol,
                amount: amountFloat.toFixed(4),
                fiatAmount: `$${(amountFloat * mockFiatRate).toFixed(2)}`, 
                recipientAddress: recipient.trim(),
                networkFee: `${feeEstimate} ${asset.symbol} ($${(feeFloat * mockFiatRate).toFixed(2)})`,
                totalCost: `${totalCost.toFixed(4)} ${asset.symbol}`,
                deviceKeyShare: deviceKeyShare, // PASS the secure key fragment to the next screen
            };

            // 3. Navigate to the Confirmation screen
            navigation.navigate('TransactionConfirmation', { txDetails });

        } catch (e) {
            console.error("Authentication/Key Retrieval Error:", e);
            Alert.alert("Security Error", "Biometric authentication failed or secure key retrieval was cancelled.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="close-outline" size={32} color="#1A237E" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Send {asset.name}</Text>
                    <View style={{ width: 32 }} /> 
                </View>

                <View style={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Recipient Address</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={`Enter ${asset.symbol} address`}
                            value={recipient}
                            onChangeText={setRecipient}
                            autoCorrect={false}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity style={styles.pasteButton}>
                            <Ionicons name="clipboard-outline" size={18} color="#00C853" />
                            <Text style={styles.pasteText}>Paste</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Amount ({asset.symbol})</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder={`Max: ${asset.balance} ${asset.symbol}`}
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.maxButton} onPress={() => setAmount(asset.balance)}>
                            <Text style={styles.maxText}>MAX</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.feeContainer}>
                        <Text style={styles.feeLabel}>Network Fee Estimate (Gas)</Text>
                        <Text style={styles.feeValue}>{feeEstimate} {asset.symbol}</Text>
                    </View>

                </View>

                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.continueButton} 
                        onPress={handleContinue}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>Continue</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A237E',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 25,
        position: 'relative',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6A7398',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: '#1A237E',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    pasteButton: {
        position: 'absolute',
        right: 15,
        top: 45,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    pasteText: {
        color: '#00C853',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    maxButton: {
        position: 'absolute',
        right: 15,
        top: 45,
        paddingVertical: 4,
        paddingHorizontal: 10,
        backgroundColor: '#E0F2F1', // Light green background
        borderRadius: 8,
    },
    maxText: {
        color: '#00C853',
        fontSize: 14,
        fontWeight: '700',
    },
    feeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    feeLabel: {
        fontSize: 16,
        color: '#6A7398',
    },
    feeValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A237E',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    continueButton: {
        backgroundColor: '#1A237E', // Deep blue
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
