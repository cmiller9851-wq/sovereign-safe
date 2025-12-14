import React, { useState } from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import { sendCrypto } from '../utils/BlockchainAPI';

const Transaction = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSendCrypto = async () => {
    const response = await sendCrypto(address, amount);
    if (response.success) {
      Alert.alert('Success', `Sent ${amount} to ${address}`);
    } else {
      Alert.alert('Error', response.message);
    }
  };

  return (
    <View>
      <TextInput 
        placeholder="Recipient Address" 
        value={address} 
        onChangeText={setAddress} 
      />
      <TextInput 
        placeholder="Amount" 
        value={amount} 
        onChangeText={setAmount} 
        keyboardType="numeric" 
      />
      <Button title="Send Crypto" onPress={handleSendCrypto} />
    </View>
  );
};

export default Transaction;
