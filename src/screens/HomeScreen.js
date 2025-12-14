import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import SecureStorage from '../utils/SecureStorage';

const HomeScreen = () => {
  const [balance, setBalance] = useState(0);
  
  useEffect(() => {
    const fetchMnemonic = async () => {
      const mnemonic = await SecureStorage.getItem('mnemonic');
      // Use mnemonic to fetch balance from blockchain
    };
    
    fetchMnemonic();
  }, []);

  return (
    <View>
      <Text>Your Balance: {balance}</Text>
    </View>
  );
};

export default HomeScreen;
