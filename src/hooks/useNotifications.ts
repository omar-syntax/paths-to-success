import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { notifications as demoNotifications } from '@/data/demoData';

const STORAGE_KEY = 'platform-notifications';

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        // Merge demo data if storage is empty for first time experience
        if (!saved) return demoNotifications;
        return JSON.parse(saved);
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (title: string, message: string, type: Notification['type'] = 'info') => {
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            title,
            message,
            date: new Date().toISOString(),
            read: false,
            type,
        };
        setNotifications(prev => [newNotification, ...prev]);
        return newNotification;
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification
    };
}
