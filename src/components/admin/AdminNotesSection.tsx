import React, { useState, useEffect } from 'react';
import { Lock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AdminNotesSectionProps {
  notes: string;
  onSaveNotes: (notes: string) => void;
  isSaving?: boolean;
}

export function AdminNotesSection({ notes, onSaveNotes, isSaving = false }: AdminNotesSectionProps) {
  const [localNotes, setLocalNotes] = useState(notes);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLocalNotes(notes);
    setHasChanges(false);
  }, [notes]);

  const handleChange = (value: string) => {
    setLocalNotes(value);
    setHasChanges(value !== notes);
  };

  const handleSave = () => {
    onSaveNotes(localNotes);
    setHasChanges(false);
    toast({
      title: 'تم الحفظ',
      description: 'تم حفظ ملاحظات الأدمن بنجاح.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-orange-500" />
          <h4 className="font-semibold text-foreground">ملاحظات الأدمن الخاصة</h4>
        </div>
        <span className="text-xs text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
          للأدمن فقط - غير مرئية للطلاب
        </span>
      </div>
      
      <Textarea
        value={localNotes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="أضف ملاحظات خاصة حول هذا الطالب. هذه الملاحظات مرئية للمسؤولين فقط..."
        className="min-h-[150px] resize-none"
      />
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          استخدم هذه المساحة للملاحظات الداخلية أو إجراءات المتابعة أو أي معلومات خاصة بالأدمن.
        </p>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || isSaving}
          size="sm"
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'جاري الحفظ...' : 'حفظ الملاحظات'}
        </Button>
      </div>
    </div>
  );
}
