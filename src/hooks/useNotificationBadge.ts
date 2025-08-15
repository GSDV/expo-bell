import { useCallback, useEffect, useState } from 'react';

import * as Notifications from 'expo-notifications'



export const useNotificationBadge = () => {
    const [badgeCount, setBadgeCountState] = useState(0);
    const [loading, setLoading] = useState(false);


    const refreshBadgeCount = useCallback(async () => {
        setLoading(true);
        try {
            const count = await Notifications.getBadgeCountAsync();
            setBadgeCountState(count);
        } finally {
            setLoading(false);
        }
    }, []);

    const setBadgeCount = useCallback(async (count: number) => {
        setLoading(true);
        try {
            await Notifications.setBadgeCountAsync(count);
            setBadgeCountState(count);
        } finally {
            setLoading(false);
        }
    }, []);

    const incrementBadgeCount = useCallback(async () => {
        setLoading(true);
        try {
            const currentCount = await Notifications.getBadgeCountAsync();
            const newCount = currentCount + 1;
            await Notifications.setBadgeCountAsync(newCount);
            setBadgeCountState(newCount);
        } finally {
            setLoading(false);
        }
    }, []);

    const decrementBadgeCount = useCallback(async () => {
        setLoading(true);
        try {
            const currentCount = await Notifications.getBadgeCountAsync();
            const newCount = Math.max(0, currentCount - 1);
            await Notifications.setBadgeCountAsync(newCount);
            setBadgeCountState(newCount);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearBadgeCount = useCallback(async () => {
        await setBadgeCount(0);
    }, [setBadgeCount]);


    // Get initial badge count on mount.
    useEffect(() => {
        refreshBadgeCount();
    }, [refreshBadgeCount]);


    return {
        badgeCount,
        loading,
        setBadgeCount,
        incrementBadgeCount,
        decrementBadgeCount,
        clearBadgeCount,
        refreshBadgeCount,
    };
};