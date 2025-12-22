import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, CheckCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notifications as initialNotifications } from '@/data/demoData';

const typeConfig = {
  info: { icon: Info, className: 'text-info bg-info/10' },
  success: { icon: CheckCircle, className: 'text-success bg-success/10' },
  warning: { icon: AlertTriangle, className: 'text-warning bg-warning/10' },
  error: { icon: AlertTriangle, className: 'text-destructive bg-destructive/10' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-7 h-7" />
            الإشعارات
          </h1>
          <p className="text-muted-foreground mt-1">
            لديك {unreadCount} إشعار غير مقروء
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 ml-2" />
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification, index) => {
          const config = typeConfig[notification.type];
          const Icon = config.icon;

          return (
            <Card
              key={notification.id}
              className={`transition-all duration-300 animate-slide-up ${
                !notification.read ? 'border-r-4 border-r-primary bg-primary/5' : ''
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4 flex items-start gap-4 cursor-pointer hover:bg-accent/50 transition-colors">
                <div className={`p-2 rounded-full ${config.className}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDate(notification.date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-lg">لا توجد إشعارات</p>
        </div>
      )}
    </div>
  );
}
