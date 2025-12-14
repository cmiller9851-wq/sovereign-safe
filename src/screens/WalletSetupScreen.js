import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { generateMnemonic } from '../utils/Cryptography';
import SecureStorage from '../utils/SecureStorage';

const WalletSetupScreen = () => {
  const [mnemonic, setMnemonic] = useState('');

  const createNewWallet = async () => {
    const mnemonicPhrase = generateMnemonic();
    setMnemonic(mnemonicPhrase);

    // Save the mnemonic securely
    await SecureStorage.setItem('mnemonic', mnemonicPhrase);
    // Proceed to wallet home screen or show success message
  };

  return (
    <View>
      <Text>Click the button to create a new wallet:</Text>
      <Button title="Create Wallet" onPress={createNewWallet} />
      {mnemonic && <Text>Your mnemonic: {mnemonic}</Text>}
    </View>
  );
};

export default WalletSetupScreen;
