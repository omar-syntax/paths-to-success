import React, { useState, useCallback } from 'react';
import { Mail, Phone, School, Calendar, FileText, Download, Eye, CheckCircle, Clock, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import GradingSection from './GradingSection';
import CommentsSection from './CommentsSection';
import DownloadFormatModal from './DownloadFormatModal';
import { StatusBadge, allStatuses, getStatusLabel } from './StatusBadge';
import { ActivityLog } from './ActivityLog';
import { AdminNotesSection } from './AdminNotesSection';
import { Registrant, UploadedFile } from '@/data/demoData';
import { Grade, Comment, SubmissionStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrant: Registrant | null;
  onDownloadFile: (registrant: Registrant, fileId?: string) => void;
  isAdmin?: boolean;
  currentUserName?: string;
  onUpdateGrade?: (registrantId: string, grade: Grade) => void;
  onAddComment?: (registrantId: string, comment: Comment) => void;
  onUpdateStatus?: (registrantId: string, status: SubmissionStatus) => void;
  onUpdateAdminNotes?: (registrantId: string, notes: string) => void;
  isSavingGrade?: boolean;
}

export function StudentDetailsModal({ 
  isOpen, 
  onClose, 
  registrant,
  onDownloadFile,
  isAdmin = true,
  currentUserName = 'Admin',
  onUpdateGrade,
  onAddComment,
  onUpdateStatus,
  onUpdateAdminNotes,
  isSavingGrade = false,
}: StudentDetailsModalProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [localGrade, setLocalGrade] = useState<Grade | undefined>(registrant?.grade);
  const [localComments, setLocalComments] = useState<Comment[]>(registrant?.comments || []);
  const [localStatus, setLocalStatus] = useState<SubmissionStatus>(registrant?.submissionStatus || 'pending_review');
  const [localNotes, setLocalNotes] = useState<string>(registrant?.adminNotes || '');

  // Reset local state when registrant changes
  React.useEffect(() => {
    setLocalGrade(registrant?.grade);
    setLocalComments(registrant?.comments || []);
    setLocalStatus(registrant?.submissionStatus || 'pending_review');
    setLocalNotes(registrant?.adminNotes || '');
  }, [registrant]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePreviewFile = (file: UploadedFile) => {
    toast({
      title: 'File Preview',
      description: `Opening file: ${file.name}`,
    });
    window.open(file.url, '_blank');
  };

  const handleDownloadClick = (file: UploadedFile) => {
    setSelectedFile(file);
    setIsDownloadModalOpen(true);
  };

  const handleSaveGrade = useCallback((grade: Grade) => {
    setLocalGrade(grade);
    if (registrant) {
      onUpdateGrade?.(registrant.id, grade);
    }
  }, [registrant, onUpdateGrade]);

  const handleStatusChange = (newStatus: SubmissionStatus) => {
    setLocalStatus(newStatus);
    if (registrant && onUpdateStatus) {
      onUpdateStatus(registrant.id, newStatus);
    }
  };

  const handleSaveNotes = (notes: string) => {
    setLocalNotes(notes);
    if (registrant && onUpdateAdminNotes) {
      onUpdateAdminNotes(registrant.id, notes);
    }
  };

  // Early return AFTER all hooks
  if (!registrant) return null;

  const handleAddComment = (content: string) => {
    if (!isAdmin) return; // Students cannot add comments
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: 'admin-1',
      userName: currentUserName,
      userRole: 'admin',
      content,
      createdAt: new Date().toISOString(),
    };
    setLocalComments(prev => [...prev, newComment]);
    onAddComment?.(registrant.id, newComment);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold flex items-center justify-between">
              <span>Student Details</span>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-100px)]">
            <div className="p-6 space-y-6">
              {/* Student Info Header */}
              <div className="flex items-start gap-4">
                <AvatarPlaceholder name={registrant.name} size="lg" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{registrant.name}</h3>
                  <p className="text-sm text-muted-foreground">{registrant.nameEn.replace(/_/g, ' ')}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <StatusBadge status={localStatus} />
                    {isAdmin && (
                      <Select value={localStatus} onValueChange={(val) => handleStatusChange(val as SubmissionStatus)}>
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {allStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {getStatusLabel(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact & Education Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Contact Information
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{registrant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{registrant.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <School className="w-4 h-4 text-primary" />
                    Educational Institution
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm">{registrant.school}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Project Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Project Information
                </h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-medium text-foreground">{registrant.projectTitle}</p>
                  <p className="text-sm text-muted-foreground mt-1">{registrant.projectTitleEn.replace(/_/g, ' ')}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Registration Date: {formatDate(registrant.registrationDate)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tabs for Files, Grading, Comments, Activity, Admin Notes */}
              <Tabs defaultValue="files" className="w-full">
                <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-3'}`}>
                  <TabsTrigger value="files">Files ({registrant.uploadedFiles.length})</TabsTrigger>
                  <TabsTrigger value="grading">Grade</TabsTrigger>
                  <TabsTrigger value="comments">Comments ({localComments.length})</TabsTrigger>
                  {isAdmin && <TabsTrigger value="activity">Activity Log</TabsTrigger>}
                  {isAdmin && <TabsTrigger value="notes">Admin Notes</TabsTrigger>}
                </TabsList>

                <TabsContent value="files" className="mt-4">
                  {/* Uploaded Files */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Uploaded Files</h4>
                      {registrant.uploadedFiles.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onDownloadFile(registrant)}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download All
                        </Button>
                      )}
                    </div>

                    {registrant.uploadedFiles.length > 0 ? (
                      <div className="space-y-2">
                        {registrant.uploadedFiles.map((file) => (
                          <div 
                            key={file.id} 
                            className="flex items-center justify-between bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {file.size} • {formatDate(file.uploadDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Preview"
                                onClick={() => handlePreviewFile(file)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Download PDF Report"
                                onClick={() => handleDownloadClick(file)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-muted/30 rounded-lg">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No files uploaded yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="grading" className="mt-4">
                  <GradingSection
                    grade={localGrade}
                    onSaveGrade={handleSaveGrade}
                    isAdmin={isAdmin}
                    isSaving={isSavingGrade}
                  />
                </TabsContent>

                <TabsContent value="comments" className="mt-4">
                  <CommentsSection
                    comments={localComments}
                    onAddComment={isAdmin ? handleAddComment : undefined}
                    currentUserRole={isAdmin ? 'admin' : 'student'}
                    currentUserName={currentUserName}
                  />
                </TabsContent>

                {isAdmin && (
                  <TabsContent value="activity" className="mt-4">
                    <ActivityLog activities={registrant.activityLog || []} />
                  </TabsContent>
                )}

                {isAdmin && (
                  <TabsContent value="notes" className="mt-4">
                    <AdminNotesSection
                      notes={localNotes}
                      onSaveNotes={handleSaveNotes}
                    />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Download Format Modal */}
      {selectedFile && (
        <DownloadFormatModal
          isOpen={isDownloadModalOpen}
          onClose={() => {
            setIsDownloadModalOpen(false);
            setSelectedFile(null);
          }}
          file={selectedFile}
          studentName={registrant.nameEn}
          studentEmail={registrant.email}
          projectName={registrant.projectTitleEn}
          submissionId={registrant.id}
          submissionDate={registrant.registrationDate}
          status={localStatus}
          grade={localGrade}
        />
      )}
    </>
  );
}
