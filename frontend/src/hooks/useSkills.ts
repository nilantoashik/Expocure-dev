import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Skill } from '@/types/project';

export function useSkills(search?: string) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = search ? `/skills?search=${encodeURIComponent(search)}` : '/skills';
    api.get<Skill[]>(url)
      .then(setSkills)
      .catch(() => setSkills([]))
      .finally(() => setIsLoading(false));
  }, [search]);

  return { skills, isLoading };
}
