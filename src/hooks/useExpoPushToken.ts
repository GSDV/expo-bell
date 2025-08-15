import { useCallback, useState } from 'react';

import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device';
import Constants from 'expo-constants';



export const useExpoPushToken = () => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const registerForPushTokens = useCallback(async () => {
        if (!Device.isDevice) {
            console.warn('Push notifications only work on real devices, not emulators.');
            return null;
        }

        setLoading(true);

        try {
            const { granted } = await Notifications.getPermissionsAsync();
            if (!granted) {
                const { granted: requestGranted } = await Notifications.requestPermissionsAsync();
                if (!requestGranted) throw new Error('Notification permissions not granted.');
            }
    
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) throw new Error('No Expo project ID found in app config.');

            const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });
            setToken(expoPushToken);
            return expoPushToken;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to get push token for unknown reason.';
            console.error('Error getting push token:', errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);


    return { token, loading, registerForPushTokens };
};