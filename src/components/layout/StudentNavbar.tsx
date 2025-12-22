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
import { notifications } from '@/data/demoData';
import logo from '@/assets/logo.webp';

export function StudentNavbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/student', label: 'الصفحة الرئيسية', icon: Home },
    { path: '/student/my-projects', label: 'مشاريعي', icon: FolderOpen },
    { path: '/student/notifications', label: 'الإشعارات', icon: Bell, badge: unreadCount },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/student" className="flex items-center gap-2">
            <img src={logo} alt="شعار المنصة" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge ? (
                  <Badge variant="destructive" className="mr-1 px-1.5 py-0.5 text-xs">
                    {item.badge}
                  </Badge>
                ) : null}
              </Link>
            ))}
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:bg-accent'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <Badge variant="destructive" className="mr-auto">
                      {item.badge}
                    </Badge>
                  ) : null}
                </Link>
              ))}
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
