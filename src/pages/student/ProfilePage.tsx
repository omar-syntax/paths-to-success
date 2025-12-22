import React, { useState } from 'react';
import { Save, Phone, School, BookOpen, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    school: user?.school || '',
    grade: user?.grade || '',
    bio: user?.bio || '',
    avatar: user?.avatar,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    toast({
      title: 'تم الحفظ',
      description: 'تم حفظ التعديلات بنجاح',
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">الملف الشخصي</h1>
        <p className="text-muted-foreground mt-1">عرض وتعديل بياناتك الشخصية</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>بيانات الحساب</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex justify-center pb-4 border-b border-border">
              <ImageUpload
                value={formData.avatar}
                onChange={(value) => setFormData(prev => ({ ...prev, avatar: value }))}
                name={formData.fullName || 'مستخدم'}
                size="xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="pr-10 bg-muted"
                    dir="ltr"
                  />
                </div>
                <p className="text-xs text-muted-foreground">البريد الإلكتروني غير قابل للتعديل</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم التليفون</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pr-10"
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">المدرسة/الجامعة</Label>
                <div className="relative">
                  <School className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="pr-10"
                    placeholder="اسم المدرسة أو الجامعة"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="grade">الصف الدراسي/السنة</Label>
                <div className="relative">
                  <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="pr-10"
                    placeholder="مثال: الصف الثاني الثانوي"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">نبذة عني</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="اكتب نبذة قصيرة عن نفسك..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Save className="w-4 h-4 ml-2" />
              حفظ التعديلات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
