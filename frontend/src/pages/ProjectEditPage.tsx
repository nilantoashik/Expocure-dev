import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { ProjectFormStepper, type ProjectFormData } from '@/components/project/ProjectForm/ProjectFormStepper';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import type { Project } from '@/types/project';

export default function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const data = await api.get<Project>(`/projects/${id}`);
        setProject(data);
      } catch {
        setFetchError('Project not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (data: ProjectFormData, publish: boolean) => {
    if (!id) return;
    setError('');
    try {
      await api.patch<Project>(`/projects/${id}`, {
        title: data.title,
        description: data.description,
        goals: data.goals || undefined,
        developmentProcess: data.developmentProcess || undefined,
        challenges: data.challenges || undefined,
        outcomes: data.outcomes || undefined,
        projectUrl: data.projectUrl || undefined,
        repoUrl: data.repoUrl || undefined,
        thumbnailUrl: data.thumbnailUrl || undefined,
        techStackIds: data.techStack.map((skill) => skill.id),
      });

      if (publish && project?.status === 'draft') {
        await api.patch(`/projects/${id}/publish`);
      }

      // Upload new images if any
      for (const image of data.imageUrls) {
        if (image.url.startsWith('blob:') || image.url.startsWith('data:')) {
          const response = await fetch(image.url);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append('image', blob, 'image.jpg');
          await api.upload(`/projects/${id}/images`, formData);
        }
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (fetchError || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
        <p className="text-gray-500">The project you are trying to edit does not exist or you do not have access.</p>
      </div>
    );
  }

  const initialData: Partial<ProjectFormData> = {
    title: project.title,
    description: project.description,
    goals: project.goals || '',
    developmentProcess: project.developmentProcess || '',
    challenges: project.challenges || '',
    outcomes: project.outcomes || '',
    projectUrl: project.projectUrl || '',
    repoUrl: project.repoUrl || '',
    thumbnailUrl: project.thumbnailUrl || '',
    techStack: project.techStack || [],
    imageUrls: project.images
      ? project.images.map((img) => ({ url: img.imageUrl, caption: img.caption || '' }))
      : [],
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Project</h1>
      {error && (
        <div className="mb-6">
          <Alert type="error" onClose={() => setError('')}>{error}</Alert>
        </div>
      )}
      <ProjectFormStepper initialData={initialData} onSubmit={handleSubmit} isEdit />
    </div>
  );
}
