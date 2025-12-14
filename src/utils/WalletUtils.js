/**
 * WalletUtils.js
 * * Purpose: Provides utility functions for interacting with the core WalletBridge (Unified Abstraction Layer).
 * This module simplifies network switching and access to the core multi-chain functions.
 */

import { WalletBridge } from '../services/unified_abstraction_layer';

/**
 * @function useWalletBridge
 * @description Exports the core WalletBridge instance for use in components/services.
 * @returns {object} The WalletBridge instance with setNetwork, getBalance, and sendTransaction methods.
 */
export const useWalletBridge = () => WalletBridge;

/**
 * @function switchNetwork
 * @description Sets the active network on the WalletBridge.
 * @param {string} coinSymbol - The symbol of the chain to activate (e.g., 'ETH', 'BTC').
 * @throws {Error} If the coin symbol is not supported by the bridge.
 */
export const switchNetwork = (coinSymbol) => {
    try {
        WalletBridge.setNetwork(coinSymbol);
        console.log(`[WalletUtils] Network successfully set to: ${coinSymbol}`);
    } catch (error) {
        console.error(`[WalletUtils] Failed to set network ${coinSymbol}: ${error.message}`);
        throw error;
    }
};

/**
 * @function getSupportedNetworks
 * @description Returns a list of all networks currently supported by the abstraction layer.
 * NOTE: This requires exposing the CHAIN_REGISTRY from unified_abstraction_layer.js 
 * or maintaining a separate list here. Assuming an exposed list for simplicity.
 * @returns {Array<string>} List of supported coin symbols.
 */
export const getSupportedNetworks = () => {
    // In a real app, this would be dynamically read from the WalletBridge's internal registry.
    return ['ETH', 'BTC', 'SOL', 'BNB'];
};
