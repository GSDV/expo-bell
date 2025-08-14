# Expo Bell 🔔

**The easiest way to handle notifications in React Native Expo apps.**

Bell provides a simple, powerful React context for handling notification permissions, push tokens, badge counts, and notification responses with zero configuration. Managing Expo notifications can be complex and error-prone. Bell handles token refresh, permissions, and badge management for you - with type safety!

## 📦 Installation

```bash
npm install expo-bell expo-notifications expo-device expo-constants
```

## 🚀 Quick Start

### 1. Wrap your app with NotificationProvider

```tsx
import { NotificationProvider } from 'expo-bell';

export default function App() {
  return (
    <NotificationProvider>
      <YourApp />
    </NotificationProvider>
  );
}
```

### 2. Use notifications in any component

```tsx
import { useNotification } from 'expo-bell';

function MyComponent() {
  const { permission, registerForNotifications } = useNotification();

  if (!permission?.granted) {
    return <Button onPress={registerForNotifications} title="Enable Notifications" />;
  }

  return <Text>Notifications are enabled! 🎉</Text>;
}
```

## 🎯 Usage Examples

### Register for push notifications

```tsx
import { useNotification } from 'expo-bell';

function NotificationSetup() {
  const { registerForNotifications, loading } = useNotification();

  const handleRegister = async () => {
    const token = await registerForNotifications();
    if (token) {
      console.log('Push token:', token);
      // Send token to your backend
    }
  };

  return (
    <Button 
      onPress={handleRegister} 
      title={loading ? "Registering..." : "Enable Notifications"} 
      disabled={loading}
    />
  );
}
```

### Manage badge counts

```tsx
import { useNotification } from 'expo-bell';

function BadgeManager() {
  const { setBadgeCount, incrementBadgeCount, clearBadgeCount } = useNotification();

  return (
    <View>
      <Button onPress={() => setBadgeCount(5)} title="Set Badge to 5" />
      <Button onPress={incrementBadgeCount} title="Add Badge" />
      <Button onPress={clearBadgeCount} title="Clear Badge" />
    </View>
  );
}
```

### Custom configuration with handlers

```tsx
import { NotificationProvider } from 'expo-bell';

function App() {
  return (
    <NotificationProvider
      config={{
        tokenRefreshInterval: 24 * 60 * 60 * 1000, // 24 hours
        automaticBadgeCountIncrement: false,
        handleNotification: async (response) => {
          console.log('Notification received:', response);
          // Handle notification tap
        },
        handleNewToken: async (token) => {
          console.log('New token:', token);
          // Send to your backend
        }
      }}
    >
      <YourApp />
    </NotificationProvider>
  );
}
```

## 🛠 API Reference

### NotificationProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config.tokenRefreshInterval` | `number` | `604800000` | Token refresh interval in ms (7 days) |
| `config.automaticBadgeCountIncrement` | `boolean` | `true` | Auto-increment badge on notification |
| `config.handleNotification` | `function` | `undefined` | Custom notification response handler |
| `config.handleNewToken` | `function` | `undefined` | Custom new token handler |

### useNotification Hook

```tsx
const {
  permission,              // PermissionResponse object
  loading,                 // Registration loading state
  updateConfig,            // Function to update config
  registerForNotifications,// Function to register for notifications
  setBadgeCount,          // Function to set badge count
  incrementBadgeCount,    // Function to increment badge
  decrementBadgeCount,    // Function to decrement badge
  clearBadgeCount,        // Function to clear badge
} = useNotification();
```

### Badge Management Functions

```tsx
// Set specific badge count
await setBadgeCount(10);

// Increment current badge count
await incrementBadgeCount();

// Decrement current badge count (won't go below 0)
await decrementBadgeCount();

// Clear all badges
await clearBadgeCount();
```

## 🔧 Configuration Options

```tsx
interface NotificationConfig {
  tokenRefreshInterval: number;                    // Token refresh interval in ms
  automaticBadgeCountIncrement: boolean;          // Auto-increment on notification
  handleNotification?: (response: NotificationResponse) => void | Promise<void>;
  handleNewToken?: (token: string) => void | Promise<void>;
}
```

## 🎯 Features

- ✅ **Zero Configuration** - Works out of the box with sensible defaults
- ✅ **Automatic Token Refresh** - Handles token expiration and refresh
- ✅ **Badge Management** - Simple badge count utilities
- ✅ **Permission Handling** - Streamlined permission flow
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Custom Handlers** - Hook into notification events
- ✅ **Device Detection** - Automatically handles emulator vs device

## 📝 License

MIT © [Gabriele Scotto di Vettimo](https://github.com/GSDV)

## 🤝 Contributing

Issues and pull requests are welcome! Check out the [GitHub repository](https://github.com/GSDV/expo-bell).