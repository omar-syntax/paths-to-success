import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/useProjects';
import { formFieldsOptions } from '@/data/demoData';

export default function StudentProjectRegistration() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { getProject, registerForProject } = useProjects();

    const project = id ? getProject(id) : undefined;

    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold">المشروع غير موجود</h2>
                <Button onClick={() => navigate('/student')}>العودة للرئيسية</Button>
            </div>
        );
    }

    const handleInputChange = (fieldId: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const loadFile = (event: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
        const file = event.target.files?.[0];
        if (file) {
            handleInputChange(fieldId, file.name); // Storing filename for demo purposes
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            registerForProject(project.id, formData);

            setTimeout(() => {
                setIsSubmitting(false);
                toast({
                    title: "تم التسجيل بنجاح",
                    description: "تم استلام طلب تسجيلك بنجاح",
                });
                navigate('/student/my-projects');
            }, 1500);
        } catch (error) {
            console.error("Registration failed:", error);
            setIsSubmitting(false);
            toast({
                title: "فشل التسجيل",
                description: "حدث خطأ أثناء محاولة التسجيل. يرجى المحاولة مرة أخرى.",
                variant: "destructive"
            });
        }
    };

        const renderField = (fieldId: string) => {
            const fieldDef = formFieldsOptions.find(f => f.id === fieldId);
            if (!fieldDef) return null;

            return (
                <div key={fieldId} className="space-y-2">
                    <Label htmlFor={fieldId}>{fieldDef.label}</Label>

                    {fieldDef.type === 'textarea' ? (
                        <Textarea
                            id={fieldId}
                            required
                            placeholder={`أدخل ${fieldDef.label}`}
                            onChange={(e) => handleInputChange(fieldId, e.target.value)}
                        />
                    ) : fieldDef.type === 'file' ? (
                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                id={fieldId}
                                className="hidden"
                                onChange={(e) => loadFile(e, fieldId)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById(fieldId)?.click()}
                                className="w-full h-24 border-dashed flex flex-col gap-2"
                            >
                                <Upload className="w-6 h-6 text-muted-foreground" />
                                <span>
                                    {formData[fieldId] ? formData[fieldId] : `رفع ${fieldDef.label}`}
                                </span>
                            </Button>
                        </div>
                    ) : (
                        <Input
                            id={fieldId}
                            type={fieldDef.type}
                            required
                            placeholder={`أدخل ${fieldDef.label}`}
                            onChange={(e) => handleInputChange(fieldId, e.target.value)}
                        />
                    )}
                </div>
            );
        };

        return (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
                <Button
                    variant="ghost"
                    className="gap-2"
                    onClick={() => navigate(`/student/project/${project.id}`)}
                >
                    <ArrowRight className="w-4 h-4" />
                    العودة لتفاصيل المشروع
                </Button>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">نموذج التسجيل</h1>
                    <p className="text-muted-foreground">
                        التسجيل في: <span className="font-semibold text-foreground">{project.title}</span>
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>بيانات التسجيل</CardTitle>
                        <CardDescription>يرجى ملء جميع الحقول المطلوبة بدقة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-6">
                                {project.formFields && project.formFields.length > 0 ? (
                                    project.formFields.map(fieldId => renderField(fieldId))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        لا توجد حقول تسجيل مطلوبة لهذا المشروع.
                                    </div>
                                )}
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد التسجيل'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }
