import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import {
    getTokenRetrievalTimestamp,
    storeTokenRetrievalTimestamp,
    getExpoPushToken,
    storeExpoPushToken
} from './utils/storage';





export interface NotificationConfig {
    tokenRefreshInterval: number;
    handleNotification?: (notification: Notifications.NotificationResponse) => void | Promise<void>;
    handleNewToken?: (token: string) => void | Promise<void>;
};

const DEFAULT_CONFIG: NotificationConfig = {
    tokenRefreshInterval: 7 * 24 * 60 * 60 * 1000, // 7 days in ms.
    handleNotification: undefined,
    handleNewToken: undefined
};



export interface NotificationContextType {
    permission: Notifications.PermissionResponse | null;
    loading: boolean;
    updateConfig: (newConfig: Partial<NotificationConfig>) => void;
    registerForNotifications: () => Promise<string | null>;
    getBadgeCount: (count: number) => Promise<void>;
    setBadgeCount: (count: number) => Promise<void>;
    incrementBadgeCount: () => Promise<void>;
    decrementBadgeCount: () => Promise<void>;
    clearBadgeCount: () => Promise<void>;
};



const NotificationContext = createContext<NotificationContextType | undefined>(undefined);



interface NotificationProviderProps { 
    children: ReactNode;
    config?: Partial<NotificationConfig>;
};

export const NotificationProvider = ({ children, config: initialConfig = {} }: NotificationProviderProps) => {
    const [config, setConfig] = useState<NotificationConfig>({
        ...DEFAULT_CONFIG,
        ...initialConfig
    });
    const [permission, setPermission] = useState<Notifications.PermissionResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const notificationListener = useRef<Notifications.EventSubscription>(undefined);



    const registerForNotifications = useCallback(async () => {
        if (!Device.isDevice) {
            console.warn('Push notifications only work on real devices, not emulators.');
            return null;
        }

        setLoading(true);
        // No matter what, save the current time.
        await storeTokenRetrievalTimestamp(Date.now().toString());
        const devicePermissions = await Notifications.getPermissionsAsync();
        setPermission(devicePermissions);

        if (!devicePermissions.granted) {
            const userPermissions = await Notifications.requestPermissionsAsync();
            setPermission(userPermissions);
            if (!userPermissions.granted) {
                setLoading(false);
                return null;
            }
        }

        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            setLoading(false);
            return null;
        }

        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });
        storeExpoPushToken(expoPushToken);

        setLoading(false);
        return expoPushToken;
    }, [config]);


    const updateConfig = useCallback((newConfig: Partial<NotificationConfig>) => {
        setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
    }, []);


    const checkForNewToken = useCallback(async () => {
        const lastTimestamp = await getTokenRetrievalTimestamp();
        const lastToken = await getExpoPushToken();
        const lastTimeChecked = new Date(parseInt(lastTimestamp ?? '0'));
        const now = new Date();
        const timeDifference = now.getTime() - lastTimeChecked.getTime();
        if (timeDifference > (config.tokenRefreshInterval ?? 0)) {
            const newToken = await registerForNotifications();
            if (!newToken || (lastToken === newToken)) return;
            config.handleNewToken?.(newToken);
        }
    }, [config, registerForNotifications]);


    const getBadgeCount = useCallback(async (count: number) => {
        await Notifications.setBadgeCountAsync(count);
    }, []);

    const setBadgeCount = useCallback(async (count: number) => {
        await Notifications.setBadgeCountAsync(count);
    }, []);

    const incrementBadgeCount = useCallback(async () => {
        const oldCount = await Notifications.getBadgeCountAsync();
        await Notifications.setBadgeCountAsync(oldCount + 1);
    }, []);

    const decrementBadgeCount = useCallback(async () => {
        const oldCount = await Notifications.getBadgeCountAsync();
        const newCount = (oldCount==0) ? 0 : oldCount - 1;
        await Notifications.setBadgeCountAsync(newCount);
    }, []);

    const clearBadgeCount = useCallback(async () => {
        await Notifications.setBadgeCountAsync(0);
    }, []);



    // Subscribe to notifications.
    useEffect(() => {
        notificationListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
            await config.handleNotification?.(response);
        });

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
        };
    }, [config]);


    // Check for new expo push token.
    useEffect(() => {
        checkForNewToken();
    }, []);



    const contextValue = useMemo((): NotificationContextType => ({
        permission,
        loading,
        registerForNotifications,
        updateConfig,
        getBadgeCount,
        setBadgeCount,
        incrementBadgeCount,
        decrementBadgeCount,
        clearBadgeCount
    }), [
        permission,
        loading,
        registerForNotifications,
        updateConfig,
        getBadgeCount,
        setBadgeCount,
        incrementBadgeCount,
        decrementBadgeCount,
        clearBadgeCount
    ]);



    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
}





export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) throw new Error('useNotification must be used within a NotificationProvider');
    return context;
};