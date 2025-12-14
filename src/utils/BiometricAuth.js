import ReactNativeBiometrics from 'react-native-biometrics';

const BiometricAuth = {
  isBiometricSupported: async () => {
    const { available } = await ReactNativeBiometrics.isSensorAvailable();
    return available === 'Biometric Sensor Available';
  },

  authenticate: async () => {
    const result = await ReactNativeBiometrics.simplePrompt({
      promptMessage: 'Confirm fingerprint or face ID',
    });
    return result;
  },
};

export default BiometricAuth;
