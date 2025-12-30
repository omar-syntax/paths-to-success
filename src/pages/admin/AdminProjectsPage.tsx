import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Lock, Unlock, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/useProjects';

const statusConfig = {
  open: { label: 'مفتوح', className: 'bg-success text-success-foreground' },
  'closing-soon': { label: 'يغلق قريباً', className: 'bg-warning text-warning-foreground' },
  closed: { label: 'مغلق', className: 'bg-muted text-muted-foreground' },
};

export default function AdminProjectsPage() {
  const { projects, updateProject, deleteProject } = useProjects();
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateProject(id, { status: currentStatus === 'closed' ? 'open' : 'closed' });
    toast({
      title: 'تم التحديث',
      description: 'تم تغيير حالة المشروع',
    });
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    toast({
      title: 'تم الحذف',
      description: 'تم حذف المشروع بنجاح',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">إدارة المشاريع</h1>
          <p className="text-muted-foreground mt-1">عرض وإدارة جميع المشاريع</p>
        </div>
        <Button onClick={() => navigate('/admin/projects/new')}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة مشروع جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المشاريع ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المشروع</TableHead>
                  <TableHead className="text-right">تاريخ البداية</TableHead>
                  <TableHead className="text-right">تاريخ النهاية</TableHead>
                  <TableHead className="text-right">المسجلين</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const status = statusConfig[project.status];
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(project.startDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(project.endDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <Users className="w-3.5 h-3.5" />
                          {project.registeredCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.className}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="عرض"
                            onClick={() => navigate(`/admin/projects/edit/${project.id}`)} // Reusing edit page for view for now as distinct view page not planned yet in this cycle
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="تعديل"
                            onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={project.status === 'closed' ? 'فتح' : 'إغلاق'}
                            onClick={() => toggleStatus(project.id, project.status)}
                          >
                            {project.status === 'closed' ? (
                              <Unlock className="w-4 h-4" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive" title="حذف">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                  سيتم حذف المشروع "{project.title}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(project.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
