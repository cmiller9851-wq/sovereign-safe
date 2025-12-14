import AsyncStorage from '@react-native-async-storage/async-storage';

const SecureStorage = {
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error saving data", error);
    }
  },

  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error retrieving data", error);
    }
    return null;
  },
};

export default SecureStorage;
