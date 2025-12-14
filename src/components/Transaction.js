import React from 'react';
import { View, Button } from 'react-native';

const Transaction = ({ address, amount }) => {
  const sendCrypto = async () => {
    console.log(`Sending ${amount} to ${address}`);
    // Logic to send cryptocurrency goes here
  };

  return (
    <View>
      <Button title="Send Crypto" onPress={sendCrypto} />
    </View>
  );
};

export default Transaction;
