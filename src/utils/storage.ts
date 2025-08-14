import * as SecureStore from 'expo-secure-store';



const LAST_TOKEN_RETRIEVAL_TIMESTAMP_KEY = 'expo-bell/last-token-retrieval-key';
const EXPO_PUSH_NOTIFICATION_TOKEN_KEY = 'expo-bell/expo-push-notification-token-key';



export const getTokenRetrievalTimestamp = async () => {
    const pushToken = await SecureStore.getItemAsync(LAST_TOKEN_RETRIEVAL_TIMESTAMP_KEY);
    return pushToken;
};

export const storeTokenRetrievalTimestamp = async (val: string) => {
    await SecureStore.setItemAsync(LAST_TOKEN_RETRIEVAL_TIMESTAMP_KEY, val);
};



export const getExpoPushToken = async () => {
    const pushToken = await SecureStore.getItemAsync(EXPO_PUSH_NOTIFICATION_TOKEN_KEY);
    return pushToken;
};

export const storeExpoPushToken = async (val: string) => {
    await SecureStore.setItemAsync(EXPO_PUSH_NOTIFICATION_TOKEN_KEY, val);
};