import React, { useState, useCallback, useMemo } from 'react';
import { Download, Eye, Mail, Calendar, FileText, Search, Star, Clock, Filter, X } from 'lucide-react';
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
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';
import { StudentDetailsModal } from '@/components/admin/StudentDetailsModal';
import DownloadFormatModal from '@/components/admin/DownloadFormatModal';
import { StatusBadge, allStatuses, getStatusLabel } from '@/components/admin/StatusBadge';
import { adminDemoProjects, registrants as initialRegistrants, Registrant, UploadedFile } from '@/data/demoData';
import { Grade, Comment, SubmissionStatus, ActivityLogEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function RegistrantsPage() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistrant, setSelectedRegistrant] = useState<Registrant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedFileForDownload, setSelectedFileForDownload] = useState<{
    file: UploadedFile;
    registrant: Registrant;
  } | null>(null);
  const [registrantsData, setRegistrantsData] = useState<Registrant[]>(initialRegistrants);
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Advanced filtering
  const filteredRegistrants = useMemo(() => {
    return registrantsData.filter(r => {
      // Search filter (name, email, project)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        r.name.toLowerCase().includes(searchLower) || 
        r.nameEn.toLowerCase().includes(searchLower) ||
        r.email.toLowerCase().includes(searchLower) ||
        r.projectTitle.toLowerCase().includes(searchLower) ||
        r.projectTitleEn.toLowerCase().includes(searchLower);
      
      // Project filter
      const matchesProject = !selectedProject || selectedProject === 'all' || r.projectId === selectedProject;
      
      // Status filter
      const matchesStatus = !selectedStatus || selectedStatus === 'all' || r.submissionStatus === selectedStatus;
      
      // Rating filter
      let matchesRating = true;
      if (selectedRating && selectedRating !== 'all') {
        if (selectedRating === 'not_graded') {
          matchesRating = !r.grade;
        } else if (selectedRating === 'graded') {
          matchesRating = !!r.grade;
        } else {
          const stars = parseInt(selectedRating);
          matchesRating = r.grade?.stars === stars;
        }
      }
      
      // Date range filter
      let matchesDate = true;
      if (dateFrom) {
        matchesDate = matchesDate && new Date(r.registrationDate) >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && new Date(r.registrationDate) <= new Date(dateTo);
      }
      
      return matchesSearch && matchesProject && matchesStatus && matchesRating && matchesDate;
    });
  }, [registrantsData, searchTerm, selectedProject, selectedStatus, selectedRating, dateFrom, dateTo]);

  const hasActiveFilters = selectedProject || selectedStatus || selectedRating || dateFrom || dateTo;

  const clearAllFilters = () => {
    setSelectedProject('');
    setSelectedStatus('');
    setSelectedRating('');
    setDateFrom('');
    setDateTo('');
    setSearchTerm('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLastActivity = (dateStr?: string) => {
    if (!dateStr) return 'No activity';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateStr);
  };

  const handleViewDetails = (registrant: Registrant) => {
    if (user?.role !== 'admin') {
      toast({
        title: 'Unauthorized',
        description: 'You do not have permission to access this feature',
        variant: 'destructive',
      });
      return;
    }
    setSelectedRegistrant(registrant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRegistrant(null);
  };

  const handleDownloadClick = (registrant: Registrant, fileId?: string) => {
    if (user?.role !== 'admin') {
      toast({
        title: 'Unauthorized',
        description: 'You do not have permission to access this feature',
        variant: 'destructive',
      });
      return;
    }

    if (registrant.uploadedFiles.length === 0) {
      toast({
        title: 'No Files',
        description: 'This student has not uploaded any files yet',
        variant: 'destructive',
      });
      return;
    }

    if (fileId) {
      const file = registrant.uploadedFiles.find(f => f.id === fileId);
      if (file) {
        setSelectedFileForDownload({ file, registrant });
        setIsDownloadModalOpen(true);
      }
    } else {
      const firstFile = registrant.uploadedFiles[0];
      setSelectedFileForDownload({ file: firstFile, registrant });
      setIsDownloadModalOpen(true);
    }
  };

  const handleUpdateGrade = useCallback(async (registrantId: string, grade: Grade) => {
    setIsSavingGrade(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newActivity: ActivityLogEntry = {
        id: `log-${Date.now()}`,
        action: 'rating_added',
        description: `Grade: ${grade.score}/${grade.maxScore}${grade.stars ? ` (${grade.stars} stars)` : ''}`,
        performedBy: user?.fullName || 'Admin',
        performedAt: new Date().toISOString(),
      };
      
      setRegistrantsData(prev => 
        prev.map(r => r.id === registrantId ? { 
          ...r, 
          grade,
          lastActivity: new Date().toISOString(),
          activityLog: [...(r.activityLog || []), newActivity]
        } : r)
      );
      
      if (selectedRegistrant?.id === registrantId) {
        setSelectedRegistrant(prev => prev ? { 
          ...prev, 
          grade,
          lastActivity: new Date().toISOString(),
          activityLog: [...(prev.activityLog || []), newActivity]
        } : null);
      }

      toast({
        title: 'Grade Saved',
        description: 'The grade has been saved successfully',
      });
    } catch (error) {
      console.error('Error saving grade:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the grade',
        variant: 'destructive',
      });
    } finally {
      setIsSavingGrade(false);
    }
  }, [selectedRegistrant?.id, toast, user?.fullName]);

  const handleAddComment = (registrantId: string, comment: Comment) => {
    const newActivity: ActivityLogEntry = {
      id: `log-${Date.now()}`,
      action: 'comment_added',
      description: `Comment added: "${comment.content.substring(0, 50)}${comment.content.length > 50 ? '...' : ''}"`,
      performedBy: user?.fullName || 'Admin',
      performedAt: new Date().toISOString(),
    };

    setRegistrantsData(prev => 
      prev.map(r => r.id === registrantId 
        ? { 
            ...r, 
            comments: [...(r.comments || []), comment],
            lastActivity: new Date().toISOString(),
            activityLog: [...(r.activityLog || []), newActivity]
          } 
        : r
      )
    );
    if (selectedRegistrant?.id === registrantId) {
      setSelectedRegistrant(prev => 
        prev ? { 
          ...prev, 
          comments: [...(prev.comments || []), comment],
          lastActivity: new Date().toISOString(),
          activityLog: [...(prev.activityLog || []), newActivity]
        } : null
      );
    }
  };

  const handleUpdateStatus = useCallback((registrantId: string, newStatus: SubmissionStatus) => {
    const newActivity: ActivityLogEntry = {
      id: `log-${Date.now()}`,
      action: 'status_changed',
      description: `Status changed to ${getStatusLabel(newStatus)}`,
      performedBy: user?.fullName || 'Admin',
      performedAt: new Date().toISOString(),
    };

    setRegistrantsData(prev => 
      prev.map(r => r.id === registrantId 
        ? { 
            ...r, 
            submissionStatus: newStatus,
            lastActivity: new Date().toISOString(),
            activityLog: [...(r.activityLog || []), newActivity]
          } 
        : r
      )
    );
    
    if (selectedRegistrant?.id === registrantId) {
      setSelectedRegistrant(prev => 
        prev ? { 
          ...prev, 
          submissionStatus: newStatus,
          lastActivity: new Date().toISOString(),
          activityLog: [...(prev.activityLog || []), newActivity]
        } : null
      );
    }

    toast({
      title: 'Status Updated',
      description: `Submission status changed to ${getStatusLabel(newStatus)}`,
    });
  }, [selectedRegistrant?.id, toast, user?.fullName]);

  const handleUpdateAdminNotes = useCallback((registrantId: string, notes: string) => {
    setRegistrantsData(prev => 
      prev.map(r => r.id === registrantId ? { ...r, adminNotes: notes } : r)
    );
    
    if (selectedRegistrant?.id === registrantId) {
      setSelectedRegistrant(prev => prev ? { ...prev, adminNotes: notes } : null);
    }
  }, [selectedRegistrant?.id]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Registered Students</h1>
        <p className="text-muted-foreground mt-1">View and manage student submissions</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-xl"
        />
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs gap-1">
                <X className="w-3 h-3" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Project Filter */}
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {adminDemoProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {allStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Rating Filter */}
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger>
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="not_graded">Not Graded</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            {/* Date From */}
            <div>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From Date"
                className="w-full"
              />
            </div>

            {/* Date To */}
            <div>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To Date"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrants Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Student List ({filteredRegistrants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No students found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrants.map((registrant) => (
                    <TableRow key={registrant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <AvatarPlaceholder name={registrant.name} size="sm" />
                          <div>
                            <span className="font-medium block">{registrant.name}</span>
                            <span className="text-xs text-muted-foreground">{registrant.nameEn.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{registrant.email}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-foreground">
                          {registrant.projectTitle}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(registrant.registrationDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={registrant.submissionStatus} size="sm" />
                      </TableCell>
                      <TableCell>
                        {registrant.grade ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-primary">
                              {registrant.grade.score}/{registrant.grade.maxScore}
                            </span>
                            {registrant.grade.stars && (
                              <div className="flex">
                                {Array.from({ length: registrant.grade.stars }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not graded</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <FileText className="w-3.5 h-3.5" />
                          {registrant.uploadedFiles.length} / {registrant.filesCount || registrant.uploadedFiles.length}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {formatLastActivity(registrant.lastActivity)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                            onClick={() => handleViewDetails(registrant)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Download Files"
                            onClick={() => handleDownloadClick(registrant)}
                            disabled={registrant.filesCount === 0 && registrant.uploadedFiles.length === 0}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      <StudentDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        registrant={selectedRegistrant}
        onDownloadFile={handleDownloadClick}
        isAdmin={true}
        currentUserName={user?.fullName || 'Admin'}
        onUpdateGrade={handleUpdateGrade}
        onAddComment={handleAddComment}
        onUpdateStatus={handleUpdateStatus}
        onUpdateAdminNotes={handleUpdateAdminNotes}
        isSavingGrade={isSavingGrade}
      />

      {/* Download Format Modal */}
      {selectedFileForDownload && (
        <DownloadFormatModal
          isOpen={isDownloadModalOpen}
          onClose={() => {
            setIsDownloadModalOpen(false);
            setSelectedFileForDownload(null);
          }}
          file={selectedFileForDownload.file}
          studentName={selectedFileForDownload.registrant.nameEn}
          studentEmail={selectedFileForDownload.registrant.email}
          projectName={selectedFileForDownload.registrant.projectTitleEn}
          submissionId={selectedFileForDownload.registrant.id}
          submissionDate={selectedFileForDownload.registrant.registrationDate}
          status={selectedFileForDownload.registrant.submissionStatus}
          grade={selectedFileForDownload.registrant.grade}
        />
      )}
    </div>
  );
}
