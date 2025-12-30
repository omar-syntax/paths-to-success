import React, { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Upload, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { formFieldsOptions } from '@/data/demoData';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 1, title: 'تفاصيل المشروع', description: 'المعلومات الأساسية' },
  { id: 2, title: 'حقول التسجيل', description: 'تحديد الحقول المطلوبة' },
  { id: 3, title: 'المعاينة والنشر', description: 'مراجعة ونشر المشروع' },
];

const categoryLabels: Record<string, string> = {
  basic: 'معلومات أساسية',
  education: 'معلومات تعليمية',
  additional: 'معلومات إضافية',
  links: 'روابط وحسابات',
  files: 'ملفات مرفقة',
  custom: 'أسئلة مخصصة',
};

import { useNotifications } from '@/hooks/useNotifications';

export default function AddProjectPage() {
  const { addProject, getProject, updateProject } = useProjects();
  const { addNotification } = useNotifications();
  const { id } = useParams();
  const isEditMode = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    requirements: '',
    startDate: '',
    endDate: '',
    image: undefined as string | undefined,
  });
  const [selectedFields, setSelectedFields] = useState<string[]>(['fullName', 'email']);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditMode && id) {
      const project = getProject(id);
      if (project) {
        setProjectData({
          title: project.title,
          description: project.description,
          requirements: project.requirements || '',
          startDate: project.startDate,
          endDate: project.endDate,
          image: project.image,
        });
        setImagePreview(project.image);
        if (project.formFields) {
          setSelectedFields(project.formFields);
        }
      }
    }
  }, [id, isEditMode, getProject]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setProjectData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(f => f !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handlePublish = () => {
    if (isEditMode && id) {
      updateProject(id, {
        ...projectData,
        formFields: selectedFields,
      });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث المشروع بنجاح',
      });
    } else {
      addProject({
        ...projectData,
        formFields: selectedFields,
      });

      // Add global notification for students
      addNotification(
        'مشروع جديد متاح',
        `تم إضافة مشروع جديد: ${projectData.title}. سارع بالتسجيل الآن!`,
        'success'
      );

      toast({
        title: 'تم نشر المشروع',
        description: 'تم نشر المشروع بنجاح',
      });
    }
    navigate('/admin/projects');
  };

  const fieldsByCategory = formFieldsOptions.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof formFieldsOptions>);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {isEditMode ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isEditMode ? 'تعديل بيانات المشروع وحقول التسجيل' : 'أنشئ مشروعاً جديداً وحدد حقول التسجيل'}
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep > step.id
                  ? 'bg-success text-success-foreground'
                  : currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                  }`}
              >
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <div className="text-center mt-2">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-muted rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: currentStep > step.id ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Project Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل المشروع</CardTitle>
            <CardDescription>أدخل المعلومات الأساسية للمشروع</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان المشروع *</Label>
              <Input
                id="title"
                name="title"
                value={projectData.title}
                onChange={handleProjectChange}
                placeholder="أدخل عنوان المشروع"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف المشروع *</Label>
              <Textarea
                id="description"
                name="description"
                value={projectData.description}
                onChange={handleProjectChange}
                placeholder="وصف تفصيلي للمشروع..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">المتطلبات</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={projectData.requirements}
                onChange={handleProjectChange}
                placeholder="متطلبات الاشتراك في المشروع..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البداية *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={projectData.startDate}
                  onChange={handleProjectChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ النهاية *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={projectData.endDate}
                  onChange={handleProjectChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>صورة المشروع</Label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-40 h-28 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted">
                  {imagePreview ? (
                    <img src={imagePreview} alt="معاينة" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF حتى 5MB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Form Fields */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fields Selection */}
          <Card>
            <CardHeader>
              <CardTitle>حقول فورم التسجيل</CardTitle>
              <CardDescription>اختر الحقول التي تريد إضافتها للفورم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(fieldsByCategory).map(([category, fields]) => (
                <div key={category}>
                  <h4 className="font-semibold text-foreground mb-3">{categoryLabels[category]}</h4>
                  <div className="space-y-2">
                    {fields.map((field) => (
                      <label
                        key={field.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={() => toggleField(field.id)}
                        />
                        <span className="text-sm">{field.label}</span>
                      </label>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Form Preview */}
          <Card className="lg:sticky lg:top-24 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                معاينة الفورم
              </CardTitle>
              <CardDescription>كيف سيظهر الفورم للمستخدم</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFields.length > 0 ? (
                <div className="space-y-4">
                  {selectedFields.map((fieldId) => {
                    const field = formFieldsOptions.find(f => f.id === fieldId);
                    if (!field) return null;
                    return (
                      <div key={field.id} className="space-y-1">
                        <Label className="text-sm">{field.label}</Label>
                        {field.type === 'textarea' ? (
                          <Textarea placeholder={`أدخل ${field.label}`} disabled className="bg-muted/50" />
                        ) : field.type === 'file' ? (
                          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-muted-foreground text-sm">
                            اضغط لرفع ملف
                          </div>
                        ) : (
                          <Input placeholder={`أدخل ${field.label}`} disabled className="bg-muted/50" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  اختر الحقول من القائمة لمعاينتها
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Preview & Publish */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>معاينة نهائية</CardTitle>
            <CardDescription>راجع بيانات المشروع قبل {isEditMode ? 'التحديث' : 'النشر'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">معلومات المشروع</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">العنوان:</span> {projectData.title || 'غير محدد'}</p>
                  <p><span className="text-muted-foreground">الوصف:</span> {projectData.description || 'غير محدد'}</p>
                  <p><span className="text-muted-foreground">المتطلبات:</span> {projectData.requirements || 'غير محدد'}</p>
                  <p><span className="text-muted-foreground">تاريخ البداية:</span> {projectData.startDate || 'غير محدد'}</p>
                  <p><span className="text-muted-foreground">تاريخ النهاية:</span> {projectData.endDate || 'غير محدد'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">صورة المشروع</h4>
                {imagePreview ? (
                  <img src={imagePreview} alt="صورة المشروع" className="w-full h-40 object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    لم يتم رفع صورة
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">حقول التسجيل المحددة ({selectedFields.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedFields.map((fieldId) => {
                  const field = formFieldsOptions.find(f => f.id === fieldId);
                  return (
                    <span
                      key={fieldId}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {field?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          السابق
        </Button>

        {currentStep < 3 ? (
          <Button onClick={() => setCurrentStep(prev => prev + 1)}>
            التالي
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        ) : (
          <Button onClick={handlePublish}>
            <Check className="w-4 h-4 ml-2" />
            {isEditMode ? 'تحديث المشروع' : 'نشر المشروع الآن'}
          </Button>
        )}
      </div>
    </div>
  );
}
