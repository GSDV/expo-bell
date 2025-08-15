import { useCallback, useEffect, useState } from 'react';

import * as Notifications from 'expo-notifications';



export const useNotificationPermissions = () => {
    const [permission, setPermission] = useState<Notifications.PermissionResponse | null>(null);
    const [loading, setLoading] = useState(false);


    const checkPermissions = useCallback(async () => {
        setLoading(true);
        try {
            const perms = await Notifications.getPermissionsAsync();
            setPermission(perms);
            return perms;
        } finally {
            setLoading(false);
        }
    }, []);

    const requestPermissions = useCallback(async () => {
        setLoading(true);
        try {
            const perms = await Notifications.requestPermissionsAsync();
            setPermission(perms);
            return perms;
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        checkPermissions();
    }, [checkPermissions]);


    return {
        permission,
        loading,
        requestPermissions,
        checkPermissions,
    };
};