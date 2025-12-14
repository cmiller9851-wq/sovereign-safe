/**
 * PolicyEngineApiClient.js
 * * Purpose: Handles all network communication with the Policy Engine server (Step 10). 
 * This client is responsible for sending the transaction data and receiving the 
 * Policy Engine's MPC key share (Share 2) after policy checks pass.
 */

// Configuration: Replace with your deployed server address
const POLICY_ENGINE_BASE_URL = 'http://localhost:3000/api/v1/policy'; 

/**
 * @function requestCoSign
 * @description Calls the server to get approval and the required MPC signing fragment (Share 2).
 * @param {string} fromAddress - The sender's address for policy tracking.
 * @param {string} txHash - The transaction hash (the data to be cryptographically signed).
 * @param {number} estimatedUSD - The transaction's estimated fiat value for policy checks.
 * @param {string} coinSymbol - The network symbol (e.g., 'ETH')
 * @returns {object} Contains the status ('approved' or 'rejected') and the server_signing_fragment (Share 2).
 */
export async function requestCoSign({ fromAddress, txHash, estimatedUSD, coinSymbol }) {
    
    // 1. Prepare the payload for the server
    const payload = {
        fromAddress,
        txHash,
        estimatedUSD,
        coinSymbol,
    };

    try {
        // 2. Send the request to the Policy Engine endpoint
        const response = await fetch(`${POLICY_ENGINE_BASE_URL}/request-cosign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Authorization headers (e.g., JWT) would be added here in a real app
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        // 3. Handle HTTP errors (e.g., 403 Forbidden from the Policy Engine)
        if (!response.ok) {
            // Treat non-200 responses as a policy rejection
            throw new Error(data.message || `Server error: ${response.status}`);
        }

        // 4. Check the policy status from the server response
        if (data.status === 'approved') {
            return {
                status: 'approved',
                // This is the crucial MPC Share 2 used by the WalletBridge (Step 3)
                server_signing_fragment: data.server_signing_fragment, 
                message: data.message,
            };
        } else {
            // The policy failed (e.g., spending limit exceeded)
            return {
                status: 'rejected',
                message: data.message || 'Transaction rejected by server policy.',
            };
        }
    } catch (error) {
        console.error("Policy Engine API Call Failed:", error);
        // Fallback for network issues or unexpected errors
        throw new Error(`Co-sign request failed: ${error.message}`);
    }
}

// NOTE: This client must be integrated into the WalletBridge (Step 3) 
// to replace the PolicyEngineSimulator.
