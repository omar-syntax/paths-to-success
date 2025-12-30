import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (file: File, metadata: FileMetadata) => void;
    isSubmitting?: boolean;
}

export interface FileMetadata {
    description: string;
    type: string;
}

export function FileSubmissionModal({ isOpen, onClose, onSubmit, isSubmitting = false }: FileSubmissionModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [type, setType] = useState('other');
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast({
                title: "خطأ",
                description: "يرجى اختيار ملف",
                variant: "destructive"
            });
            return;
        }
        if (!description.trim()) {
            toast({
                title: "خطأ",
                description: "يرجى كتابة وصف للملف",
                variant: "destructive"
            });
            return;
        }

        onSubmit(file, { description, type });
    };

    const handleClose = () => {
        setFile(null);
        setDescription('');
        setType('other');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>رفع ملف جديد</DialogTitle>
                    <DialogDescription>
                        قم برفع ملفات المشروع مع إضافة وصف وتحديد نوع الملف.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="file-upload">الملف</Label>
                        <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors ${file ? 'border-primary bg-primary/5' : 'border-border'}`}>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <Label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
                                {file ? (
                                    <>
                                        <FileIcon className="w-8 h-8 text-primary mb-2" />
                                        <span className="text-sm font-medium text-foreground">{file.name}</span>
                                        <span className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                        <span className="text-sm font-medium">اضغط لاختيار ملف</span>
                                        <span className="text-xs text-muted-foreground mt-1">PDF, ZIP, DOCX, Images</span>
                                    </>
                                )}
                            </Label>
                            {file && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setFile(null);
                                    }}
                                    className="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded-full"
                                >
                                    <X className="w-4 h-4 text-destructive" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">نوع الملف</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="اختر نوع الملف" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="report">تقرير / Report</SelectItem>
                                <SelectItem value="presentation">عرض تقديمي / Presentation</SelectItem>
                                <SelectItem value="code">كود برمجي / Source Code</SelectItem>
                                <SelectItem value="design">تصميم / Design</SelectItem>
                                <SelectItem value="other">أخرى / Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">وصف الملف *</Label>
                        <Textarea
                            id="description"
                            placeholder="اكتب وصفاً مختصراً لمحتوى هذا الملف..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={handleClose}>إلغاء</Button>
                        <Button type="submit" disabled={isSubmitting || !file}>
                            {isSubmitting ? 'جاري الرفع...' : 'رفع الملف'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
    )
}
