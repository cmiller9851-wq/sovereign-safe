import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { generateMnemonic } from 'bip39';

export default function App() {
  const [hasWallet, setHasWallet] = useState(false);
  const [mnemonic, setMnemonic] = useState('');

  useEffect(() => {
    checkWallet();
  }, []);

  async function checkWallet() {
    const stored = await SecureStore.getItemAsync('mnemonic');
    setHasWallet(!!stored);
  }

  async function authenticate() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return Alert.alert('Biometrics not supported');
    const result = await LocalAuthentication.authenticateAsync();
    return result.success;
  }

  async function createWallet() {
    if (!(await authenticate())) return Alert.alert('Auth failed');
    const newMnemonic = generateMnemonic(256); // 24 words
    await SecureStore.setItemAsync('mnemonic', newMnemonic);
    setMnemonic(newMnemonic);
    setHasWallet(true);
    Alert.alert('Sovereign Wallet Created', 'Backup your phrase securely!');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOVEREIGN SAFE</Text>
      {hasWallet ? (
        <Text>Wallet Active — Dominion Secured</Text>
      ) : (
        <>
          <Text>No wallet detected.</Text>
          <Button title="Create Sovereign Wallet" onPress={createWallet} />
        </>
      )}
      {mnemonic ? <Text style={styles.mnemonic}>{mnemonic}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  title: { fontSize: 32, color: '#00ff00', marginBottom: 20 },
  mnemonic: { marginTop: 20, color: '#ff00ff', textAlign: 'center' }
});