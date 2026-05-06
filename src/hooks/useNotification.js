"use client";

import { useNotificationContext } from "@/context/NotificationContext";

export default function useNotification() {
    const { showNotification } = useNotificationContext();
    return showNotification;
}