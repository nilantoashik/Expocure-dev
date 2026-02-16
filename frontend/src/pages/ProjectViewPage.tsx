import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { ProjectCaseStudy } from '@/components/project/ProjectCaseStudy';
import { Spinner } from '@/components/ui/Spinner';
import type { Project } from '@/types/project';

interface PublicProject extends Project {
  user?: {
    fullName: string;
    username: string;
    avatarUrl: string | null;
  };
}

export default function ProjectViewPage() {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username || !slug) return;

    const fetchProject = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await api.get<PublicProject>(`/projects/public/${username}/${slug}`);
        setProject(data);
      } catch {
        setError('Project not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [username, slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
        <p className="text-gray-500">The project you are looking for does not exist or may have been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link
        to={`/${username}`}
        className="inline-flex items-center gap-1 text-sm text-brand-blue hover:underline mb-6"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to {username}'s profile
      </Link>

      <ProjectCaseStudy project={project} />
    </div>
  );
}
