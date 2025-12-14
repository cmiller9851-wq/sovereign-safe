/**
 * PolicyEngine.js (Conceptual Server-Side Endpoint - Node.js/Express)
 * * Purpose: Acts as the Policy Engine (Share 2) for the 2-of-3 MPC scheme. 
 * It enforces security rules before providing the co-signing fragment.
 * * WARNING: This is a conceptual structure. A real MPC server would use 
 * cryptographic libraries (like Rust/Wasm) for signing and be heavily hardened.
 */

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

// --- Configuration ---
// The Policy Engine's key share (Share 2) - Must be highly secured in production
const MPC_POLICY_SHARE = 'b9c8a7d6e5f4g3h2i1j0k9l8m7n6o5p4q3r2s1t0u9v8w7x6y5z4a3b2c1d0e9f8';
// Daily spending limit policy enforced by the server
const DAILY_SPENDING_LIMIT_USD = 5000; 

// Mock database to track daily spending per user
const MOCK_DB = {
    // Initial mock data: User has already spent $3500 today
    '0xUserAddress': {
        spentTodayUSD: 3500, 
        lastTransactionTime: Date.now() 
    }
};

/**
 * @function applySecurityPolicies
 * @description Checks a series of security and policy rules before releasing Share 2.
 * @param {object} transactionDetails - Transaction data from the client (address, amount, estimated USD value).
 * @returns {boolean} True if all policies pass, false otherwise.
 */
function applySecurityPolicies(transactionDetails) {
    const { fromAddress, estimatedUSD } = transactionDetails;

    // 1. Transaction Sanity Check
    if (!fromAddress || !estimatedUSD || estimatedUSD <= 0) {
        return false;
    }

    // 2. Daily Limit Policy Enforcement
    const user = MOCK_DB[fromAddress] || { spentTodayUSD: 0 };
    const potentialNewTotal = user.spentTodayUSD + estimatedUSD;

    if (potentialNewTotal > DAILY_SPENDING_LIMIT_USD) {
        // Policy rejected: Exceeds daily limit
        return false;
    }

    // 3. Velocity/Rate Limiting (Conceptual)
    // Prevents rapid, high-value transactions
    if (estimatedUSD > 1000 && (Date.now() - user.lastTransactionTime) < 60000) {
        return false;
    }

    // All checks pass
    return true;
}

/**
 * API Endpoint: POST /api/v1/policy/request-cosign
 * Mobile Wallet sends the pre-hashed transaction data here to get the server's co-signature fragment.
 */
router.post('/request-cosign', bodyParser.json(), (req, res) => {
    const { fromAddress, txHash, estimatedUSD, coinSymbol } = req.body;

    // Ensure all required fields are present
    if (!fromAddress || !txHash || !estimatedUSD) {
        return res.status(400).json({ error: "Missing required transaction fields." });
    }

    const transactionDetails = {
        fromAddress,
        estimatedUSD,
        coinSymbol
    };

    if (applySecurityPolicies(transactionDetails)) {
        // Policy Passed: Update mock database
        MOCK_DB[fromAddress] = {
            spentTodayUSD: (MOCK_DB[fromAddress]?.spentTodayUSD || 0) + estimatedUSD,
            lastTransactionTime: Date.now()
        };

        // IMPORTANT: In production, the server would use its MPC_POLICY_SHARE to 
        // calculate the *share* of the signature for the given txHash, 
        // which is what we return as the server_signing_fragment. 
        return res.status(200).json({
            status: "approved",
            server_signing_fragment: MPC_POLICY_SHARE, // Share 2
            message: "Co-sign approved and policy limits checked."
        });

    } else {
        // Policy Failed
        return res.status(403).json({
            status: "rejected",
            message: "Transaction rejected by policy engine. Check daily limits or velocity."
        });
    }
});

// For actual deployment, you would start the Express server:
/*
const app = express();
app.use('/api/v1/policy', router);
app.listen(3000, () => console.log('Policy Engine running on port 3000'));
*/
module.exports = router;
