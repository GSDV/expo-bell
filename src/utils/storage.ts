import * as SecureStore from 'expo-secure-store';



const EXPO_PUSH_NOTIFICATION_TOKEN_KEY = 'expo-bell/expo-push-notification-key';



export const getExpoPushToken = async () => {
    const pushToken = await SecureStore.getItemAsync(EXPO_PUSH_NOTIFICATION_TOKEN_KEY);
    return pushToken;
};

export const storeExpoPushToken = async (val: string) => {
    await SecureStore.setItemAsync(EXPO_PUSH_NOTIFICATION_TOKEN_KEY, val);
};