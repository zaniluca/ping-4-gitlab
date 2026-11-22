import * as SecureStore from "expo-secure-store";

export const useSecureStore = () => {
  return {
    getValueForKey: async (key: string) => {
      console.log("Retriving value for key: " + key);
      return await SecureStore.getItemAsync(key);
    },
    setValueForKey: async (key: string, value: string) => {
      console.log("Updating secure store value for key: " + key);
      return await SecureStore.setItemAsync(key, value);
    },
    deleteValueForKey: async (key: string) => {
      console.log("Deleting value for key: " + key);
      return await SecureStore.deleteItemAsync(key);
    },
  };
};
