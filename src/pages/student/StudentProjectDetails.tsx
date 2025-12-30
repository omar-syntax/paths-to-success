import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  Share2,
  Download,
  AlertCircle
} from 'lucide-react';
import { demoProjects } from '@/data/demoData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useProjects } from '@/hooks/useProjects';

export default function StudentProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getProject } = useProjects();
  const [isRegistering, setIsRegistering] = useState(false);

  const project = id ? getProject(id) : undefined;

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">المشروع غير موجود</h2>
        <Button onClick={() => navigate('/student')}>العودة للرئيسية</Button>
      </div>
    );
  }

  const handleRegister = () => {
    setIsRegistering(true);
    // Simulate API call
    setTimeout(() => {
      setIsRegistering(false);
      toast({
        title: "تم التسجيل بنجاح",
        description: `تم تسجيل طلبك للانضمام إلى ${project.title}`,
        variant: "default",
      });
      navigate('/student/my-projects');
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط المشروع إلى الحافظة بنجاح",
    });
  };

  const handleGuide = () => {
    toast({
      title: "جاري التحميل",
      description: "بدأ تحميل دليل المشروع...",
    });
    // Mock download
    setTimeout(() => {
      toast({
        title: "تم التحميل",
        description: "تم تحميل دليل المشروع بنجاح",
      });
    }, 1000);
  };


  const statusConfig = {
    open: { label: 'مفتوح للتسجيل', className: 'bg-green-500/10 text-green-600 border-green-200' },
    'closing-soon': { label: 'يغلق قريباً', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
    closed: { label: 'مغلق', className: 'bg-gray-500/10 text-gray-600 border-gray-200' },
  };

  const status = statusConfig[project.status];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="gap-2"
        onClick={() => navigate('/student')}
      >
        <ArrowRight className="w-4 h-4" />
        العودة للمشاريع
      </Button>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-card border shadow-sm">
        <div className="h-64 md:h-80 relative">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

          <div className="absolute bottom-0 right-0 p-6 md:p-8 w-full">
            <Badge className={`mb-4 px-3 py-1 ${status.className} border`}>
              {status.label}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              عن المشروع
            </h2>
            <Card>
              <CardContent className="p-6 text-muted-foreground leading-relaxed">
                <p>
                  هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الليترات التى يولدها التطبيق.
                </p>
                <div className="mt-4 grid gap-4">
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>فرصة مميزة لتطوير المهارات العملية</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>شهادات معتمدة للمشاركين والفائزين</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>جوائز نقدية وعينية قيمة</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Requirements Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              المتطلبات والشروط
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border mb-4">
                  <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                  <div className="space-y-1">
                    <h4 className="font-semibold">متطلبات أساسية</h4>
                    <p className="text-sm text-muted-foreground">{project.requirements}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {['أن يكون الطالب مقيداً بإحدى الجامعات المصرية', 'الالتزام بمواعيد التسليم المحددة', 'العمل ضمن فريق من 2-4 طلاب (للمشاريع الجماعية)'].map((req, i) => (
                    <li key={i} className="flex gap-2 items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">

          {/* Action Card */}
          <Card className="sticky top-24 border-primary/20 shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-muted-foreground">حالة التسجيل</span>
                  <span className={`font-medium ${status.className.replace('bg-', 'text-').split(' ')[1]}`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>تاريخ البدء</span>
                    </div>
                    <span>{project.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>تاريخ الانتهاء</span>
                    </div>
                    <span>{project.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>المسجلين</span>
                    </div>
                    <span>{project.registeredCount} طالب</span>
                  </div>
                </div>
              </div>

              <Separator />

              <Button
                className="w-full text-lg py-6 shadow-md hover:shadow-lg transition-all"
                size="lg"
                onClick={() => navigate(`/student/project/${id}/register`)}
                disabled={project.status === 'closed'}
              >
                سجل الآن
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full gap-2" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                  مشاركة
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={handleGuide}>
                  <Download className="w-4 h-4" />
                  الدليل
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
