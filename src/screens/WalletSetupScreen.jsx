import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    ActivityIndicator, 
    ScrollView, 
    Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// --- Dependencies (Assumed Imports) ---
// Key Generation (Step 1)
import { generateWallet, deriveAccount } from '../core/hd_key_generator'; 
// Key Sharding (Step 2)
import { generateShares } from '../security/mpc_sharder'; 
// Local Security (Step 4)
import { BiometricsService } from '../services/BiometricsService';

export default function WalletSetupScreen({ navigation }) {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [mnemonic, setMnemonic] = useState(null);

    /**
     * @function startSetup
     * @description Initiates the secure wallet creation process.
     */
    const startSetup = () => {
        setStep(2);
    };

    /**
     * @function createWalletAndSecureKeys
     * @description Core function combining key generation, sharding, and storage.
     * This is the moment the "most secure" architecture is realized.
     */
    const createWalletAndSecureKeys = async () => {
        setIsLoading(true);
        try {
            // 1. Generate Master Key (Step 1)
            const { mnemonic, masterNode } = generateWallet();
            setMnemonic(mnemonic); // Store mnemonic temporarily for backup step

            // 2. Derive the private key for the primary chain (e.g., Ethereum)
            const primaryAccount = deriveAccount(masterNode, 'Ethereum');
            const primaryPrivateKey = primaryAccount.privateKeySnippet; 

            // 3. Perform MPC Sharding (Step 2)
            // Splitting the primary private key (the secret) into 3 shares (T=2)
            const allShares = generateShares(primaryPrivateKey, 2, 3);
            const userDeviceShare = allShares[0]; 
            const policyEngineShare = allShares[1]; // Sent to server
            const cloudBackupShare = allShares[2]; // Used for recovery flow

            // 4. Secure Local Storage (Share 1) (Step 4)
            await BiometricsService.storeMpcKeyShare(userDeviceShare);

            // 5. Simulate sending Policy Share 2 to the server
            console.log(`[Setup] Sending Policy Share (Share 2) to server: ${policyEngineShare}`);
            
            // 6. Advance to the next UI step (Backup/Recovery)
            setStep(3);

        } catch (error) {
            console.error("Wallet Setup Error:", error);
            Alert.alert("Setup Failed", "Could not create or secure your wallet keys. Try restarting.");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * @function navigateToHome
     * @description Final step after successful setup/backup.
     */
    const navigateToHome = () => {
        // In a real app, the mnemonic would be passed to the BackupRecoveryScreen (existing file).
        // For this flow, we navigate directly to Home.
        navigation.replace('Home');
    };

    // --- UI Renderers for each step ---

    const renderStep1 = () => (
        <View style={styles.stepContent}>
            <Ionicons name="shield-checkmark-outline" size={60} color="#1A237E" style={{ marginBottom: 20 }} />
            <Text style={styles.largeTitle}>Create Your Sovereign Safe</Text>
            <Text style={styles.descriptionText}>
                The most secure wallet uses MPC technology. Your private key is split into 3 shares (Device, Policy Engine, Cloud) and requires only 2 shares to sign.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={startSetup}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContent}>
            <Ionicons name="finger-print-outline" size={60} color="#00C853" style={{ marginBottom: 20 }} />
            <Text style={styles.largeTitle}>Authorize Secure Storage</Text>
            <Text style={styles.descriptionText}>
                We will now generate your master key, split it into 3 parts, and secure one part (Share 1) in your iPhone's Secure Enclave, protected by Face ID or Touch ID.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={createWalletAndSecureKeys} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.buttonText}>Generate & Secure Keys</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContent}>
            <Ionicons name="key-outline" size={60} color="#FFA000" style={{ marginBottom: 20 }} />
            <Text style={styles.largeTitle}>Backup Required</Text>
            <Text style={styles.descriptionText}>
                Your wallet is now active. To complete the security setup, you must save your Recovery Phrase (Share 3), which is needed to restore your wallet on a new device.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('BackupRecovery', { mnemonic })} disabled={isLoading}>
                 <Text style={styles.buttonText}>Secure Recovery Phrase</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryButton, { marginTop: 15 }]} onPress={navigateToHome}>
                 <Text style={styles.secondaryText}>I will backup later</Text>
            </TouchableOpacity>
        </View>
    );

    const renderCurrentStep = () => {
        switch (step) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            default: return renderStep1();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {renderCurrentStep()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    stepContent: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6,
    },
    largeTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1A237E',
        textAlign: 'center',
        marginBottom: 15,
    },
    descriptionText: {
        fontSize: 16,
        color: '#6A7398',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    primaryButton: {
        backgroundColor: '#1A237E',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryButton: {
        paddingVertical: 10,
    },
    secondaryText: {
        color: '#1A237E',
        fontSize: 16,
        fontWeight: '500',
    }
});
