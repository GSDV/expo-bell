# Expo Bell 🔔

**The easiest way to handle notifications in React Native Expo apps.**

Bell provides simple, powerful React hooks for handling notification permissions, push tokens, badge counts, and notification responses with zero configuration. Managing Expo notifications can be complex and error-prone. Bell handles token refresh, permissions, and badge management for you - with type safety!

[![npm version](https://badge.fury.io/js/expo-bell.svg)](https://www.npmjs.com/package/expo-bell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## 📦 Installation

```bash
npm install expo-bell
```

**Peer Dependencies** (install these if not already in your project):
```bash
expo install expo-notifications expo-device expo-constants
```



## ⚙️ Setup

Before using Bell, ensure your Expo app is configured for push notifications:

### Configure app.json/app.config.js
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```



## 🚀 Quick Start


### 1. Request and Check Permissions
```tsx
import { useNotificationPermissions } from 'expo-bell';

function PermissionsExample() {
    const { permission, loading, requestPermissions, checkPermissions } = useNotificationPermissions();

    const handleRequestPermissions = async () => {
        try {
            const result = await requestPermissions();
            if (!result.granted) {
                Alert.alert('Permission Denied', 'Notifications are required for the best experience.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to request notification permissions');
        }
    };

    return (
        <View>
            <Button
                onPress={handleRequestPermissions}
                title={loading ? "Requesting..." : "Request Notifications"}
                disabled={loading}
            />
            <Button
                onPress={checkPermissions}
                title="Check Permissions"
            />
            {!permission?.granted ?
                <Text>Notifications are not enabled.</Text>
            :
                <Text>Notifications are enabled! 🎉</Text>
            }
        </View>
    );
}
```


### 2. Getting Expo Push Token
```tsx
import { useExpoPushToken } from 'expo-bell';

function PushTokenExample() {
    const { token, loading, registerForPushTokens } = useExpoPushToken();

    const handleRegister = async () => {
        try {
            const pushToken = await registerForPushTokens();
            if (pushToken) {
                // Send token to your backend server.
                console.log('Expo Push Token:', pushToken);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to register for push notifications');
        }
    };

    return (
        <View>
            <Button
                onPress={handleRegister}
                title="Register for notifications and get token"
                disabled={loading}
            />
            {token && <Text>Expo Push Token: {token}</Text> }
        </View>
    );
}
```


### 3. Receive Push Notifications
```tsx
import { NotificationResponse, NotificationContent } from 'expo-notifications'
import { useNotificationResponse } from 'expo-bell';

function NotificationHandlerExample() {
    const [lastNotification, setLastNotification] = useState<NotificationContent | null>(null);

    const handleNotification = useCallback((response: NotificationResponse) => {
        const { notification } = response;
        setLastNotification(notification.request.content);

        // Handle notification tap.
        console.log('Notification tapped:', notification.request.content);
    }, []);
    
    useNotificationResponse(handleNotification);

    return (
        <View>
            {lastNotification ? (
                <View>
                    <Text>📧 Last Notification:</Text>
                    <Text>Title: {lastNotification.title}</Text>
                    <Text>Body: {lastNotification.body}</Text>
                    {lastNotification.data && (
                        <Text>Data: {JSON.stringify(lastNotification.data)}</Text>
                    )}
                </View>
            ) : (
                <Text>No notification has come yet.</Text>
            )}
        </View>
    );
}
```


### 4. Change Badge Count
> **Note:** `useNotificationBadge` automatically fetches the current badge count when the component mounts.
```tsx
import { useNotificationBadge } from 'expo-bell';

function BadgeExample() {
    const { badgeCount,
        loading,
        incrementBadgeCount,
        decrementBadgeCount,
        setBadgeCount,
        clearBadgeCount
    } = useNotificationBadge();

    return (
        <View>
            <Text>Current Badge Count: {badgeCount}</Text>
            <Button 
                onPress={incrementBadgeCount} 
                title="Increment Badge" 
                disabled={loading}
            />
            <Button 
                onPress={decrementBadgeCount} 
                title="Decrement Badge" 
                disabled={loading}
            />
            <Button 
                onPress={() => setBadgeCount(10)} 
                title="Set Badge to 10" 
                disabled={loading}
            />
            <Button 
                onPress={clearBadgeCount} 
                title="Clear Badge" 
                disabled={loading}
            />
        </View>
    );
}
```



## 🎯 Features

- ✅ **Minimal Configuration** - Works with standard Expo setup
- ✅ **Badge Management** - Simple badge count utilities with automatic refresh
- ✅ **Permission Handling** - Streamlined permission flow with error handling
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Custom Handlers** - Hook into notification events and responses
- ✅ **Device Detection** - Automatically handles emulator vs device
- ✅ **Loading States** - Built-in loading indicators for all async operations
- ✅ **Error Handling** - Comprehensive error handling with detailed logging


## 📚 API Reference

### `useNotificationPermissions()`
Manages notification permission state and requests.

**Returns:**
- `permission: PermissionResponse | null` - Current permission status
- `loading: boolean` - Loading state during permission operations
- `requestPermissions: () => Promise<PermissionResponse>` - Request notification permissions
- `checkPermissions: () => Promise<PermissionResponse>` - Check current permissions

### `useExpoPushToken()`
Handles Expo push token registration and management.

**Returns:**
- `token: string | null` - The Expo push token
- `loading: boolean` - Loading state during token operations
- `registerForPushTokens: () => Promise<string | null>` - Register and get push token

### `useNotificationBadge()`
Manages app badge count with automatic state synchronization.

**Returns:**
- `badgeCount: number` - Current badge count
- `loading: boolean` - Loading state during badge operations
- `setBadgeCount: (count: number) => Promise<void>` - Set badge to specific number
- `incrementBadgeCount: () => Promise<void>` - Increment badge by 1
- `decrementBadgeCount: () => Promise<void>` - Decrement badge by 1 (minimum 0)
- `clearBadgeCount: () => Promise<void>` - Set badge to 0
- `refreshBadgeCount: () => Promise<void>` - Refresh badge count from system

### `useNotificationResponse(handler)`
Listens for notification responses (when user taps notifications).

**Parameters:**
- `handler: (response: NotificationResponse) => void | Promise<void>` - Callback function

## 📝 License

MIT © [Gabriele Scotto di Vettimo](https://github.com/GSDV)

## 🤝 Contributing

Issues and pull requests are welcome! Check out the [GitHub repository](https://github.com/GSDV/expo-bell).