import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'admin';
  phone?: string;
  school?: string;
  grade?: string;
  bio?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  school?: string;
  grade?: string;
  bio?: string;
  avatar?: string;
}

const demoUsers: Record<string, { password: string; user: User }> = {
  'student@demo.com': {
    password: '123456',
    user: {
      id: 'student-1',
      email: 'student@demo.com',
      fullName: 'أحمد محمد',
      role: 'student',
      phone: '01012345678',
      school: 'مدرسة وي للتكنولوجيا التطبيقية',
      grade: 'الصف الثاني',
      bio: 'طالب شغوف بالتكنولوجيا والبرمجة',
    },
  },
  'admin@demo.com': {
    password: '123456',
    user: {
      id: 'admin-1',
      email: 'admin@demo.com',
      fullName: 'محمد أحمد',
      role: 'admin',
      phone: '01098765432',
      bio: 'مدير المنصة',
    },
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const demoUser = demoUsers[email.toLowerCase()];
    
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user);
      localStorage.setItem('user', JSON.stringify(demoUser.user));
      return { success: true };
    }

    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const registeredUser = registeredUsers[email.toLowerCase()];
    
    if (registeredUser && registeredUser.password === password) {
      setUser(registeredUser.user);
      localStorage.setItem('user', JSON.stringify(registeredUser.user));
      return { success: true };
    }

    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    const email = data.email.toLowerCase();
    
    if (demoUsers[email]) {
      return { success: false, error: 'هذا البريد الإلكتروني مستخدم بالفعل' };
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    if (registeredUsers[email]) {
      return { success: false, error: 'هذا البريد الإلكتروني مسجل بالفعل' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName: data.fullName,
      role: 'student',
      phone: data.phone,
      school: data.school,
      grade: data.grade,
      bio: data.bio,
      avatar: data.avatar,
    };

    registeredUsers[email] = {
      password: data.password,
      user: newUser,
    };

    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      
      // Update in registered users if exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (registeredUsers[prev.email]) {
        registeredUsers[prev.email].user = updated;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
      
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
