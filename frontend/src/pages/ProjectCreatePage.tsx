import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { ProjectFormStepper, type ProjectFormData } from '@/components/project/ProjectForm/ProjectFormStepper';
import { Alert } from '@/components/ui/Alert';
import type { Project } from '@/types/project';

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (data: ProjectFormData, publish: boolean) => {
    setError('');
    try {
      const project = await api.post<Project>('/projects', {
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

      if (publish) {
        await api.patch(`/projects/${project.id}/publish`);
      }

      // Upload images if any
      for (const image of data.imageUrls) {
        if (image.url.startsWith('blob:') || image.url.startsWith('data:')) {
          const response = await fetch(image.url);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append('image', blob, 'image.jpg');
          await api.upload(`/projects/${project.id}/images`, formData);
        }
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h1>
      {error && (
        <div className="mb-6">
          <Alert type="error" onClose={() => setError('')}>{error}</Alert>
        </div>
      )}
      <ProjectFormStepper onSubmit={handleSubmit} isEdit={false} />
    </div>
  );
}
