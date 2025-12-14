import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    SafeAreaView, 
    ActivityIndicator, 
    RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// --- Dependencies (Assumed Imports) ---
// Assuming WalletBridge from Step 3 is available globally or via a context/hook
import { WalletBridge } from '../services/unified_abstraction_layer'; 

// Mock Data for the multi-chain key management
const MOCK_ACCOUNT_INFO = {
    masterAddress: '0xSovereignSafeMasterKey...',
    chains: [
        { symbol: 'ETH', name: 'Ethereum', address: '0xEthWalletAddress...', color: '#627EEA' },
        { symbol: 'BTC', name: 'Bitcoin', address: '1BitcoinWalletAddress...', color: '#F7931A' },
        { symbol: 'SOL', name: 'Solana', address: 'SolanaWalletAddress...', color: '#00FFAA' },
        { symbol: 'BNB', name: 'Binance Coin', address: '0xBNBWalletAddress...', color: '#F3BA2F' },
    ]
};

export default function HomeScreen({ navigation }) {
    const [totalBalance, setTotalBalance] = useState('$0.00');
    const [assets, setAssets] = useState(MOCK_ACCOUNT_INFO.chains.map(c => ({...c, balance: 'Loading...', fiatBalance: '$0.00'})));
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * @function fetchAllBalances
     * @description Iterates through all tracked chains and fetches the balance 
     * using the Unified Abstraction Layer (WalletBridge).
     */
    const fetchAllBalances = useCallback(async () => {
        setIsRefreshing(true);
        setIsLoading(true);
        let currentTotal = 0;
        
        const updatedAssets = await Promise.all(
            MOCK_ACCOUNT_INFO.chains.map(async (chain) => {
                try {
                    // 1. Switch the bridge to the correct network handler (Step 3)
                    WalletBridge.setNetwork(chain.symbol);
                    
                    // 2. Fetch balance via the standardized interface
                    const { balance } = await WalletBridge.getBalance(chain.address);
                    
                    // Mock conversion for display purposes
                    const mockFiatValue = parseFloat(balance) * (chain.symbol === 'BTC' ? 40000 : 2500); 
                    currentTotal += mockFiatValue;

                    return {
                        ...chain,
                        balance: balance.toFixed(4),
                        fiatBalance: `$${mockFiatValue.toFixed(2)}`,
                    };
                } catch (e) {
                    console.error(`Error fetching ${chain.symbol}:`, e.message);
                    return {
                        ...chain,
                        balance: 'Error',
                        fiatBalance: '$0.00',
                    };
                }
            })
        );

        setAssets(updatedAssets);
        setTotalBalance(`$${currentTotal.toFixed(2)}`);
        setIsRefreshing(false);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchAllBalances();
    }, [fetchAllBalances]);
    
    // --- Render Item for the FlatList ---
    const renderAssetItem = ({ item }) => (
        <TouchableOpacity style={styles.assetItem} onPress={() => {
            // Navigate to a detail screen, passing the chain info
            navigation.navigate('AssetDetail', { chainInfo: item });
        }}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Text style={[styles.iconText, { color: item.color }]}>{item.symbol.substring(0,1)}</Text>
            </View>
            <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{item.name}</Text>
                <Text style={styles.assetSymbol}>{item.symbol}</Text>
            </View>
            <View style={styles.balanceInfo}>
                <Text style={styles.cryptoBalance}>{item.balance} {item.symbol}</Text>
                <Text style={styles.fiatBalance}>{item.fiatBalance}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Sovereign Safe</Text>
                <TouchableOpacity onPress={fetchAllBalances}>
                    <Ionicons name="settings-outline" size={24} color="#6A7398" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Total Portfolio Value</Text>
                {isLoading && !isRefreshing ? (
                    <ActivityIndicator color="#FFFFFF" size="large" style={{ marginTop: 10 }}/>
                ) : (
                    <Text style={styles.totalBalanceText}>{totalBalance}</Text>
                )}
            </View>

            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Your Assets ({assets.length})</Text>
            </View>

            <FlatList
                data={assets}
                keyExtractor={(item) => item.symbol}
                renderItem={renderAssetItem}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={fetchAllBalances}
                        tintColor="#1A237E"
                    />
                }
            />
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
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A237E',
    },
    balanceCard: {
        backgroundColor: '#1A237E', // Deep blue for high contrast
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 25,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 8,
    },
    balanceLabel: {
        fontSize: 16,
        color: '#B3E5FC',
        fontWeight: '500',
    },
    totalBalanceText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 5,
    },
    listHeader: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A237E',
    },
    assetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    assetInfo: {
        flex: 1,
        marginLeft: 15,
    },
    assetName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A237E',
    },
    assetSymbol: {
        fontSize: 12,
        color: '#6A7398',
    },
    balanceInfo: {
        alignItems: 'flex-end',
    },
    cryptoBalance: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A237E',
    },
    fiatBalance: {
        fontSize: 12,
        color: '#6A7398',
    }
});
