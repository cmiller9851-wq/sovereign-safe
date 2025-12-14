import AsyncStorage from '@react-native-async-storage/async-storage';
// We simulate a robust native module for secure storage and biometrics 
// (which would be 'react-native-keychain' or similar in a real project).
const SecureStorage = {
    // Stores data securely (simulated using AsyncStorage prefixed)
    set: async (key, value) => {
        await AsyncStorage.setItem(`SECURE_${key}`, value);
        return true;
    },
    // Retrieves data securely
    get: async (key) => {
        const value = await AsyncStorage.getItem(`SECURE_${key}`);
        if (!value) throw new Error("Key share not found in secure storage.");
        return value;
    },
    // Triggers the OS-level biometric prompt (Face ID, Fingerprint)
    authenticate: async (reason = "Confirm action for Sovereign Safe") => {
        // In reality, this shows the native OS biometric prompt.
        await new Promise(resolve => setTimeout(resolve, 500)); 
        // We assume success for the demo code flow.
        return true; 
    }
};

/**
 * BiometricsService.js
 * * Purpose: Centralized service for handling biometric authentication and 
 * secure storage of the highly sensitive MPC Key Share (Share 1) on the device.
 */
export const BiometricsService = {

    /**
     * The unique key used to store the MPC Share 1 (the device share).
     */
    MPC_SHARE_KEY: 'mpc_share_1_private',

    /**
     * @function storeMpcKeyShare
     * @description Saves the initial device key share after wallet setup (Step 2).
     * @param {string} keyShare - The unique device key share (Share 1).
     */
    storeMpcKeyShare: async (keyShare) => {
        try {
            await SecureStorage.set(BiometricsService.MPC_SHARE_KEY, keyShare);
            return { success: true };
        } catch (error) {
            console.error("Failed to store MPC key share:", error);
            throw new Error("Local secure storage failed.");
        }
    },

    /**
     * @function authenticateAndRetrieveShare
     * @description Prompts the user for biometrics and, upon success, retrieves the key share.
     * This key share is the first piece (Share 1) required for MPC co-signing.
     * @returns {string} The raw MPC Key Share (Share 1).
     */
    authenticateAndRetrieveShare: async () => {
        // 1. Authenticate the user (Face ID/Fingerprint)
        const authenticated = await SecureStorage.authenticate(
            "Authenticate to authorize transaction signing."
        );

        if (!authenticated) {
            throw new Error("Biometric authentication failed or cancelled.");
        }

        // 2. Retrieve the securely stored key share
        const keyShare = await SecureStorage.get(BiometricsService.MPC_SHARE_KEY);
        
        // This is the key fragment passed to the WalletBridge (Step 3)
        return keyShare;
    },

    /**
     * @function isBiometricsAvailable
     * @description Checks if the device supports biometric authentication.
     */
    isBiometricsAvailable: async () => {
        // In a real app, this checks native device APIs
        return true; 
    }
};

// --- (Example Setup) ---

// Simulated initial key storage after wallet setup
const MOCK_GENERATED_SHARE = "a3c4b5d6f7e890a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z67890ab";
BiometricsService.storeMpcKeyShare(MOCK_GENERATED_SHARE);
