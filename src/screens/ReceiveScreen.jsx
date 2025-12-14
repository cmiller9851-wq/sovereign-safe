import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    Share, 
    Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// --- Dependencies (Assumed Imports) ---
// Using a mock component for QR code generation
const QRCode = ({ value, size }) => (
    <View style={{ width: size, height: size, backgroundColor: '#000', padding: 10, borderRadius: 8 }}>
        {/* Placeholder for QR Code SVG/Image component */}
        <Text style={{ color: '#fff', fontSize: 10, textAlign: 'center' }}>
            [QR Code for: {value.substring(0, 15)}...]
        </Text>
    </View>
);

export default function ReceiveScreen({ route, navigation }) {
    // Asset info passed from AssetDetailScreen
    const asset = route?.params?.asset || { 
        symbol: 'ETH', 
        name: 'Ethereum', 
        address: '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T', // Mock address
        color: '#627EEA' 
    }; 

    const [copied, setCopied] = useState(false);

    /**
     * @function copyAddress
     * @description Copies the public address to the user's clipboard.
     */
    const copyAddress = async () => {
        // In a real app, this uses a clipboard module (e.g., Clipboard from expo)
        // await Clipboard.setString(asset.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        Alert.alert("Copied!", `Public address for ${asset.symbol} copied to clipboard.`);
    };

    /**
     * @function shareAddress
     * @description Shares the public address using the device's native share sheet.
     */
    const shareAddress = async () => {
        try {
            await Share.share({
                message: `My Sovereign Safe ${asset.name} Address:\n${asset.address}`,
                title: `Share My ${asset.symbol} Address`,
            });
        } catch (error) {
            console.error('Error sharing address:', error.message);
        }
    };
    
    // Helper function for clear display of address
    const formatAddress = (address) => {
        if (!address) return 'N/A';
        return `${address.substring(0, 12)}...${address.substring(address.length - 10)}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close-outline" size={32} color="#1A237E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Receive {asset.name}</Text>
                <View style={{ width: 32 }} /> 
            </View>

            <View style={styles.content}>
                <Text style={styles.instructionText}>
                    Scan this QR code or share your public address to receive {asset.name}.
                </Text>

                <View style={styles.qrContainer}>
                    <QRCode value={asset.address} size={250} />
                </View>

                <View style={[styles.addressBox, { borderColor: asset.color + '60' }]}>
                    <Text style={styles.addressLabel}>{asset.name} Public Address</Text>
                    <Text style={styles.fullAddress}>{asset.address}</Text>
                    <Text style={styles.truncatedAddress}>{formatAddress(asset.address)}</Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={styles.actionButton} 
                        onPress={copyAddress}
                    >
                        <Ionicons name={copied ? "checkmark-circle" : "copy-outline"} size={24} color="#1A237E" />
                        <Text style={styles.buttonText}>{copied ? "Copied!" : "Copy Address"}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.actionButton} 
                        onPress={shareAddress}
                    >
                        <Ionicons name="share-social-outline" size={24} color="#1A237E" />
                        <Text style={styles.buttonText}>Share</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        alignItems: 'center',
        padding: 20,
    },
    instructionText: {
        fontSize: 16,
        color: '#6A7398',
        textAlign: 'center',
        marginBottom: 30,
        maxWidth: 300,
    },
    qrContainer: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6,
        marginBottom: 30,
    },
    addressBox: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    addressLabel: {
        fontSize: 14,
        color: '#6A7398',
        marginBottom: 5,
    },
    fullAddress: {
        fontSize: 8,
        color: '#C0C0C0',
        marginBottom: 5,
        textAlign: 'center',
    },
    truncatedAddress: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A237E',
        textAlign: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD', // Light blue background
        padding: 15,
        borderRadius: 30,
        minWidth: 150,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#1A237E',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    }
});
