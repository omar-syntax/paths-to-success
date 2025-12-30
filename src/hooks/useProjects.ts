import { useState, useEffect } from 'react';
import { Project, Registration } from '@/types';
import { demoProjects } from '@/data/demoData';
import { useToast } from './use-toast';

const PROJECTS_STORAGE_KEY = 'platform-projects';
const REGISTRATIONS_STORAGE_KEY = 'platform-registrations';

export interface ExtendedRegistration extends Registration {
    data?: Record<string, any>;
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>(() => {
        const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : demoProjects;
    });

    const [registrations, setRegistrations] = useState<ExtendedRegistration[]>(() => {
        const saved = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    const { toast } = useToast();

    useEffect(() => {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    }, [projects]);

    useEffect(() => {
        localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
    }, [registrations]);

    const addProject = (project: Omit<Project, 'id' | 'registeredCount' | 'status'>) => {
        const newProject: Project = {
            ...project,
            id: `proj-${Date.now()}`,
            status: 'open',
            registeredCount: 0,
        };
        setProjects(prev => [...prev, newProject]);
        return newProject;
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        setProjects(prev =>
            prev.map(p => p.id === id ? { ...p, ...updates } : p)
        );
    };

    const deleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const getProject = (id: string) => {
        return projects.find(p => p.id === id);
    };

    const registerForProject = (projectId: string, formData: Record<string, any>) => {
        const project = getProject(projectId);
        if (!project) throw new Error('Project not found');

        const newRegistration: ExtendedRegistration = {
            id: `reg-${Date.now()}`,
            projectId,
            projectTitle: project.title,
            registrationDate: new Date().toISOString(),
            status: 'registered',
            filesCount: 0,
            data: formData
        };

        setRegistrations(prev => [...prev, newRegistration]);

        // Update project registered count
        updateProject(projectId, {
            registeredCount: (project.registeredCount || 0) + 1
        });

        return newRegistration;
    };

    const addFileToRegistration = (registrationId: string, fileData: { name: string; size: string; type: string; url: string }) => {
        setRegistrations(prev =>
            prev.map(reg => {
                if (reg.id === registrationId) {
                    const newFile = {
                        id: `file-${Date.now()}`,
                        name: fileData.name,
                        size: fileData.size,
                        type: fileData.type,
                        url: fileData.url,
                        uploadDate: new Date().toISOString()
                    };
                    const updatedFiles = [...(reg.uploadedFiles || []), newFile];
                    return {
                        ...reg,
                        uploadedFiles: updatedFiles,
                        filesCount: updatedFiles.length,
                        status: 'in-progress' as const
                    };
                }
                return reg;
            })
        );
    };

    return {
        projects,
        registrations,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        registerForProject,
        addFileToRegistration
    };
}
