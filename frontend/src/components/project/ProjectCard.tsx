import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  onPublish?: (id: string) => void;
  onUnpublish?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, showActions, onPublish, onUnpublish, onDelete }: ProjectCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {project.thumbnailUrl ? (
          <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
          <Badge variant={project.status === 'published' ? 'green' : 'default'}>
            {project.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{project.description}</p>
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.techStack.slice(0, 4).map((skill) => (
              <Badge key={skill.id} variant="blue">{skill.name}</Badge>
            ))}
            {project.techStack.length > 4 && (
              <Badge>+{project.techStack.length - 4}</Badge>
            )}
          </div>
        )}
        {showActions && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Link to={`/projects/${project.id}/edit`} className="text-xs text-brand-blue hover:underline">
              Edit
            </Link>
            {project.status === 'draft' && onPublish && (
              <button onClick={() => onPublish(project.id)} className="text-xs text-brand-green hover:underline cursor-pointer">
                Publish
              </button>
            )}
            {project.status === 'published' && onUnpublish && (
              <button onClick={() => onUnpublish(project.id)} className="text-xs text-yellow-600 hover:underline cursor-pointer">
                Unpublish
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(project.id)} className="text-xs text-red-600 hover:underline cursor-pointer ml-auto">
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
