import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- Import all key screens developed in previous steps ---
import WalletSetupScreen from './src/screens/WalletSetupScreen'; // Existing or mock setup screen
import BackupRecoveryScreen from './src/screens/BackupRecoveryScreen'; // Existing or mock backup screen
import HomeScreen from './src/screens/HomeScreen'; // Step 5
import AssetDetailScreen from './src/screens/AssetDetailScreen'; // Step 6
import SendScreen from './src/screens/SendScreen'; // Step 9
import TransactionConfirmation from './src/screens/TransactionConfirmation'; // Step 7
import TransactionStatusScreen from './src/screens/TransactionStatusScreen'; // Step 8

const Stack = createStackNavigator();

/**
 * App.jsx
 * * Purpose: Defines the main routing and navigation structure for the Sovereign Safe wallet.
 * It establishes the flow from setup to the core transaction process.
 */
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="WalletSetup" // Start here for new users
        screenOptions={{
          headerShown: false, // Use custom headers within screens for better control
          cardStyle: { backgroundColor: '#F7F9FC' } // Consistent background color
        }}
      >
        {/* --- Setup Flow --- */}
        <Stack.Screen name="WalletSetup" component={WalletSetupScreen} />
        <Stack.Screen name="BackupRecovery" component={BackupRecoveryScreen} />
        
        {/* --- Main Wallet Flow --- */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />
        
        {/* --- Transaction Flow (The core MPC pipeline) --- */}
        <Stack.Screen name="Send" component={SendScreen} />
        <Stack.Screen 
          name="TransactionConfirmation" 
          component={TransactionConfirmation} 
          options={{ gestureEnabled: false }} // Prevent back swipe during confirmation
        />
        <Stack.Screen 
          name="TransactionStatus" 
          component={TransactionStatusScreen} 
          options={{ gestureEnabled: false }} // Prevent users from dismissing the final status
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
