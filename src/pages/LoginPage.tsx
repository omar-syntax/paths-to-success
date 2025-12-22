import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.webp';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في المنصة',
      });
      
      // Redirect based on user role
      if (email.toLowerCase() === 'admin@demo.com') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } else {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: result.error,
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/30 p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <img src={logo} alt="شعار المنصة" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">منصة إدارة المسابقات</h1>
          <p className="text-muted-foreground mt-2">سجل دخولك للمتابعة</p>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              أدخل بيانات حسابك للوصول إلى المنصة
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-10"
                    required
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 pl-10"
                    required
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-accent/50 rounded-lg p-3 text-sm">
                <p className="font-medium text-foreground mb-2">بيانات الدخول التجريبية:</p>
                <div className="space-y-1 text-muted-foreground">
                  <p>الطالب: <span dir="ltr" className="text-foreground">student@demo.com</span> / 123456</p>
                  <p>الأدمن: <span dir="ltr" className="text-foreground">admin@demo.com</span> / 123456</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    تسجيل الدخول
                  </span>
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                ليس لديك حساب؟{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  سجل الآن
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
