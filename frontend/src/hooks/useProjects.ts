import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Project } from '@/types/project';

export function useProjects(status?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = status ? `/projects?status=${status}` : '/projects';
      const data = await api.get<Project[]>(url);
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, refetch: fetchProjects };
}
