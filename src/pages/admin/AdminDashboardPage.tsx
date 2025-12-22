import React from 'react';
import { FolderOpen, Users, CheckCircle, FileUp, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { statisticsData } from '@/data/demoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statCards = [
  { label: 'إجمالي المشاريع', value: statisticsData.totalProjects, icon: FolderOpen, color: 'text-primary' },
  { label: 'إجمالي المسجلين', value: statisticsData.totalRegistrations, icon: Users, color: 'text-info' },
  { label: 'المشاريع المفتوحة', value: statisticsData.openProjects, icon: CheckCircle, color: 'text-success' },
  { label: 'الملفات المرفوعة', value: statisticsData.uploadedFiles, icon: FileUp, color: 'text-warning' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-1">نظرة عامة على إحصائيات المنصة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card
            key={stat.label}
            className="card-hover animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-accent ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Chart */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            التسجيلات خلال الأسبوع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statisticsData.weeklyRegistrations} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  dataKey="day" 
                  type="category" 
                  stroke="hsl(var(--muted-foreground))"
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                  name="التسجيلات"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="/admin/projects/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <FolderOpen className="w-5 h-5 text-primary" />
              <span className="font-medium">إضافة مشروع جديد</span>
            </a>
            <a 
              href="/admin/registrants"
              className="flex items-center gap-3 p-4 rounded-lg bg-info/10 hover:bg-info/20 transition-colors"
            >
              <Users className="w-5 h-5 text-info" />
              <span className="font-medium">عرض المسجلين</span>
            </a>
            <a 
              href="/admin/statistics"
              className="flex items-center gap-3 p-4 rounded-lg bg-success/10 hover:bg-success/20 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="font-medium">الإحصائيات التفصيلية</span>
            </a>
            <a 
              href="/admin/projects"
              className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 hover:bg-warning/20 transition-colors"
            >
              <CheckCircle className="w-5 h-5 text-warning" />
              <span className="font-medium">إدارة المشاريع</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
