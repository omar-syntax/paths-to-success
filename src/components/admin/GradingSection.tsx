import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Save, Edit2, Loader2 } from 'lucide-react';
import { Grade } from '@/types';

interface GradingSectionProps {
  grade?: Grade;
  onSaveGrade: (grade: Grade) => void;
  isAdmin: boolean;
  isSaving?: boolean;
}

const GradingSection = ({ grade, onSaveGrade, isAdmin, isSaving = false }: GradingSectionProps) => {
  const [isEditing, setIsEditing] = useState(!grade);
  const [score, setScore] = useState(grade?.score || 0);
  const [maxScore, setMaxScore] = useState(grade?.maxScore || 100);
  const [stars, setStars] = useState(grade?.stars || 0);
  const [feedback, setFeedback] = useState(grade?.feedback || '');

  // Update local state when grade prop changes
  useEffect(() => {
    if (grade) {
      setScore(grade.score);
      setMaxScore(grade.maxScore);
      setStars(grade.stars || 0);
      setFeedback(grade.feedback || '');
      setIsEditing(false);
    }
  }, [grade]);

  const handleSave = () => {
    const newGrade: Grade = {
      score,
      maxScore,
      stars,
      feedback,
      gradedBy: 'الأدمن',
      gradedAt: new Date().toISOString(),
    };
    onSaveGrade(newGrade);
    setIsEditing(false);
  };

  const StarRating = ({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            className={`h-6 w-6 ${
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );

  if (!isAdmin && !grade) {
    return (
      <div className="p-4 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">لم يتم التقييم بعد</p>
      </div>
    );
  }

  if (!isAdmin && grade) {
    return (
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">التقييم</h4>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-primary">
              {grade.score}/{grade.maxScore}
            </span>
            {grade.stars && <StarRating value={grade.stars} readonly />}
          </div>
        </div>
        {grade.feedback && (
          <div>
            <Label className="text-sm text-muted-foreground">تعليق المقيّم:</Label>
            <p className="mt-1 p-3 bg-background rounded-md">{grade.feedback}</p>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          تم التقييم بواسطة: {grade.gradedBy} • {new Date(grade.gradedAt).toLocaleDateString('ar-EG')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">التقييم</h4>
        {grade && !isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 ml-1" />
            تعديل
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>الدرجة</Label>
              <Input
                type="number"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                min={0}
                max={maxScore}
              />
            </div>
            <div>
              <Label>من</Label>
              <Input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>

          <div>
            <Label>تقييم بالنجوم (اختياري)</Label>
            <StarRating value={stars} onChange={setStars} />
          </div>

          <div>
            <Label>التعليق والملاحظات</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="اكتب تعليقك على المشروع هنا..."
              rows={4}
            />
          </div>

          <Button onClick={handleSave} className="w-full" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 ml-2" />
            )}
            {isSaving ? 'جاري الحفظ...' : 'حفظ التقييم'}
          </Button>
        </div>
      ) : (
        grade && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">
                {grade.score}/{grade.maxScore}
              </span>
              {grade.stars && <StarRating value={grade.stars} readonly />}
            </div>
            {grade.feedback && (
              <p className="p-3 bg-muted rounded-md">{grade.feedback}</p>
            )}
            <p className="text-xs text-muted-foreground">
              تم التقييم بواسطة: {grade.gradedBy} • {new Date(grade.gradedAt).toLocaleDateString('ar-EG')}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default GradingSection;
