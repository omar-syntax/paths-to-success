import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  FolderOpen,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/logo.webp';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export function StudentNavbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/student', label: 'الصفحة الرئيسية', icon: Home },
    { path: '/student/my-projects', label: 'مشاريعي', icon: FolderOpen },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/student" className="flex items-center gap-2">
            <img src={logo} alt="شعار المنصة" className="h-12 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center gap-2 px-4 py-2 rounded-lg">
                  <Bell className="w-4 h-4" />
                  <span>الإشعارات</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2 border-b">
                  <span className="font-semibold">الإشعارات</span>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="xs" onClick={markAllAsRead} className="text-xs h-auto py-1">
                      تحديد الكل كمقروء
                    </Button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b last:border-0 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/30' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{notification.title}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.date), { addSuffix: true, locale: ar })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      لا توجد إشعارات حالياً
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden md:flex"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="صورة البروفايل" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <AvatarPlaceholder name={user?.fullName || 'م'} size="sm" />
                  )}
                  <span className="hidden md:inline text-sm font-medium">{user?.fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/student/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>الملف الشخصي</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:bg-accent'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/student/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-accent"
              >
                <Bell className="w-5 h-5" />
                <span>الإشعارات</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="mr-auto">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-accent transition-all"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>{theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
