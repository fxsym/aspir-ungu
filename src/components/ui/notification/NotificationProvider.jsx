"use client";

import { useState, useCallback } from "react";
import { NotificationContext } from "@/context/NotificationContext";
import NotificationModal from "./NotificationModal";

export default function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((status, custom = {}) => {
        setNotification({
            status,
            ...custom,
        });
    }, []);

    const hideNotification = () => setNotification(null);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <NotificationModal 
                notification={notification} 
                hide={hideNotification} 
            />
        </NotificationContext.Provider>
    );
}