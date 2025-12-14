import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    ScrollView, 
    ActivityIndicator, 
    FlatList,
    RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// --- Dependencies (Assumed Imports) ---
// Assuming WalletBridge from Step 3 is available globally or via a context/hook
import { WalletBridge } from '../services/unified_abstraction_layer'; 

// Mock Transaction History Data
const MOCK_HISTORY = [
    { id: '1', type: 'Received', amount: '+2.0 ETH', date: 'Dec 12, 2025', status: 'Confirmed' },
    { id: '2', type: 'Sent', amount: '-0.5 ETH', date: 'Dec 10, 2025', status: 'Confirmed' },
    { id: '3', type: 'Sent', amount: '-0.01 ETH', date: 'Dec 09, 2025', status: 'Pending' },
    { id: '4', type: 'Received', amount: '+0.15 ETH', date: 'Dec 05, 2025', status: 'Confirmed' },
];

export default function AssetDetailScreen({ route, navigation }) {
    // Get chainInfo from the HomeScreen navigation parameters
    const { chainInfo } = route.params;

    const [currentBalance, setCurrentBalance] = useState('Loading...');
    const [fiatValue, setFiatValue] = useState('$0.00');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAssetData();
    }, [chainInfo.symbol]);
    
    /**
     * @function fetchAssetData
     * @description Fetches the latest balance and transaction history for the selected coin.
     */
    const fetchAssetData = async () => {
        setIsLoading(true);
        try {
            // Use the bridge to get standardized balance data
            WalletBridge.setNetwork(chainInfo.symbol);
            const { balance } = await WalletBridge.getBalance(chainInfo.address);
            
            // Mock conversion and history fetch
            const mockFiatValue = parseFloat(balance) * (chainInfo.symbol === 'BTC' ? 40000 : 2500); 

            setCurrentBalance(balance.toFixed(4));
            setFiatValue(`$${mockFiatValue.toFixed(2)}`);
            // In a real app, this would be an API call to fetch actual history
            setHistory(MOCK_HISTORY.map(tx => ({...tx, amount: tx.amount.replace('ETH', chainInfo.symbol)})));
            
        } catch (e) {
            console.error(`Error fetching data for ${chainInfo.symbol}:`, e.message);
            setCurrentBalance('Error');
            setFiatValue('N/A');
        } finally {
            setIsLoading(false);
        }
    };

    const renderTransactionItem = ({ item }) => (
        <View style={styles.transactionItem}>
            <Ionicons 
                name={item.type === 'Sent' ? 'arrow-up-circle' : 'arrow-down-circle'} 
                size={30} 
                color={item.type === 'Sent' ? '#D32F2F' : '#00C853'} 
            />
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionType}>{item.type} {chainInfo.name}</Text>
                <Text style={styles.transactionDate}>{item.date} • {item.status}</Text>
            </View>
            <Text style={styles.transactionAmount}>{item.amount}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchAssetData} tintColor="#1A237E" />
                }
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={28} color="#1A237E" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{chainInfo.name}</Text>
                    <View style={{ width: 28 }} /> 
                </View>

                <View style={styles.balanceSection}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#1A237E" style={{ marginVertical: 20 }} />
                    ) : (
                        <>
                            <Text style={styles.assetBalance}>{currentBalance} {chainInfo.symbol}</Text>
                            <Text style={styles.assetFiatValue}>{fiatValue}</Text>
                        </>
                    )}
                    <Text style={styles.assetAddress}>Address: {chainInfo.address.substring(0, 12)}...</Text>
                </View>

                {/* Send and Receive Buttons for Ease of Use */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#00C853' }]}
                        onPress={() => navigation.navigate('Send', { asset: chainInfo })}
                    >
                        <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#1A237E' }]}
                        onPress={() => navigation.navigate('Receive', { asset: chainInfo })}
                    >
                        <Ionicons name="arrow-down" size={24} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Receive</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.historySection}>
                    <Text style={styles.historyTitle}>Transaction History</Text>
                    <FlatList
                        data={history}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTransactionItem}
                        scrollEnabled={false} // Prevent double scrolling with outer ScrollView
                        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
                    />
                </View>

            </ScrollView>
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
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A237E',
    },
    balanceSection: {
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 10,
    },
    assetBalance: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1A237E',
    },
    assetFiatValue: {
        fontSize: 18,
        fontWeight: '500',
        color: '#6A7398',
        marginTop: 5,
    },
    assetAddress: {
        fontSize: 12,
        color: '#9E9E9E',
        marginTop: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        minWidth: 140,
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
    historySection: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A237E',
        marginBottom: 15,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    transactionDetails: {
        flex: 1,
        marginLeft: 15,
    },
    transactionType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A237E',
    },
    transactionDate: {
        fontSize: 12,
        color: '#6A7398',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A237E',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        color: '#6A7398',
    }
});
