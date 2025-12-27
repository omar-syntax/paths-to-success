import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare } from 'lucide-react';
import { Comment } from '@/types';
import { toast } from '@/hooks/use-toast';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment?: (content: string) => void;
  currentUserRole: 'admin' | 'student';
  currentUserName: string;
}

const CommentsSection = ({ comments, onAddComment, currentUserRole, currentUserName }: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState('');

  // Only admins can add comments
  const canAddComment = currentUserRole === 'admin';

  const handleSubmit = () => {
    if (!canAddComment || !onAddComment) return;
    
    if (!newComment.trim()) {
      toast({
        title: 'تنبيه',
        description: 'يرجى كتابة تعليق قبل الإرسال',
        variant: 'destructive',
      });
      return;
    }
    onAddComment(newComment);
    setNewComment('');
    toast({
      title: 'تم الإرسال',
      description: 'تم إضافة تعليقك بنجاح',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h4 className="font-semibold">التعليقات ({comments.length})</h4>
      </div>

      {/* Comments List - READ ONLY for students */}
      <div className="max-h-64 overflow-y-auto space-y-3 p-2">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">لا توجد تعليقات حتى الآن</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`flex gap-3 p-3 rounded-lg ${
                comment.userRole === 'admin' ? 'bg-primary/5 border border-primary/20' : 'bg-muted'
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className={comment.userRole === 'admin' ? 'bg-primary text-primary-foreground' : ''}>
                  {getInitials(comment.userName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.userName}</span>
                  <Badge variant={comment.userRole === 'admin' ? 'default' : 'secondary'} className="text-xs">
                    {comment.userRole === 'admin' ? 'أدمن' : 'طالب'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment - ONLY visible for admins */}
      {canAddComment && (
        <div className="flex gap-2 pt-2 border-t">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(currentUserName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="اكتب تعليقك هنا..."
              rows={2}
              className="resize-none"
            />
            <Button onClick={handleSubmit} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Read-only notice for students */}
      {!canAddComment && (
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground text-center py-2">
            التعليقات للقراءة فقط
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
