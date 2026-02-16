import { ProjectCard } from '@/components/project/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Project } from '@/types/project';

interface ProjectGridProps {
  projects: Project[];
  showActions?: boolean;
  onPublish?: (id: string) => void;
  onUnpublish?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectGrid({ projects, showActions, onPublish, onUnpublish, onDelete }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Projects will appear here once they are created."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          showActions={showActions}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
