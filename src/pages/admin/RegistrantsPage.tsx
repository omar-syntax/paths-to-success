import React, { useState } from 'react';
import { Download, Eye, Mail, Calendar, FileText, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';
import { adminDemoProjects, registrants } from '@/data/demoData';
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<string, { className: string }> = {
  'مسجل': { className: 'bg-info text-info-foreground' },
  'جاري العمل': { className: 'bg-warning text-warning-foreground' },
  'تم التسليم': { className: 'bg-success text-success-foreground' },
};

export default function RegistrantsPage() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredRegistrants = registrants.filter(r =>
    r.name.includes(searchTerm) || r.email.includes(searchTerm)
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAction = (action: string) => {
    toast({
      title: 'قريباً',
      description: `${action} قيد التطوير`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">المسجلين</h1>
        <p className="text-muted-foreground mt-1">عرض المسجلين في المشاريع</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="اختر مشروع" />
          </SelectTrigger>
          <SelectContent>
            {adminDemoProjects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو البريد الإلكتروني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Registrants Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            قائمة المسجلين ({filteredRegistrants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الملفات</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrants.map((registrant) => (
                  <TableRow key={registrant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <AvatarPlaceholder name={registrant.name} size="sm" />
                        <span className="font-medium">{registrant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        <span dir="ltr">{registrant.email}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(registrant.registrationDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[registrant.status]?.className}>
                        {registrant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <FileText className="w-3.5 h-3.5" />
                        {registrant.filesCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="عرض التفاصيل"
                          onClick={() => handleAction('عرض التفاصيل')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="تحميل الملفات"
                          onClick={() => handleAction('تحميل الملفات')}
                          disabled={registrant.filesCount === 0}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
