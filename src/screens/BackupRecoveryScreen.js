import React from 'react';
import { View, Text, Button } from 'react-native';
import SecureStorage from '../utils/SecureStorage';

const BackupRecoveryScreen = () => {
  const backupWallet = async () => {
    const mnemonic = await SecureStorage.getItem('mnemonic');
    // Provide instructions or a way to securely store the mnemonic
    console.log(`Backup your mnemonic: ${mnemonic}`);
  };

  return (
    <View>
      <Text>Please back up your wallet securely!</Text>
      <Button title="Backup Wallet" onPress={backupWallet} />
    </View>
  );
};

export default BackupRecoveryScreen;
