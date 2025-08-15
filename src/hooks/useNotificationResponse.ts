import { useEffect, useRef } from 'react';

import * as Notifications from 'expo-notifications'



export const useNotificationResponse = (handler: (response: Notifications.NotificationResponse) => void | Promise<void>) => {
    const handlerRef = useRef(handler);
    const listenerRef = useRef<Notifications.EventSubscription>(undefined);


    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);


    useEffect(() => {
        listenerRef.current = Notifications.addNotificationResponseReceivedListener((response) => {
            handlerRef.current(response);
        });

        // Cleanup
        return () => {
            if (listenerRef.current) listenerRef.current.remove();
        };
    }, []);
};