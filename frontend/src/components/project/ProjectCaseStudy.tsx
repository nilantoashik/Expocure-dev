import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import type { Project } from '@/types/project';

interface ProjectAuthor {
  fullName: string;
  username: string;
  avatarUrl: string | null;
}

interface ProjectCaseStudyProps {
  project: Project & { user?: ProjectAuthor };
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const caseStudySections = [
    { title: 'Goals', content: project.goals },
    { title: 'Development Process', content: project.developmentProcess },
    { title: 'Challenges', content: project.challenges },
    { title: 'Outcomes', content: project.outcomes },
  ];

  return (
    <article className="space-y-8">
      {/* Thumbnail */}
      <div className="w-full max-h-80 overflow-hidden rounded-xl bg-gray-100">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full max-h-80 object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-48">
            <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>

      {/* Author info */}
      {project.user && (
        <div className="flex items-center gap-3">
          <Avatar src={project.user.avatarUrl} name={project.user.fullName} size="sm" />
          <div>
            <p className="text-sm font-medium text-gray-900">{project.user.fullName}</p>
            <p className="text-xs text-gray-500">@{project.user.username}</p>
          </div>
        </div>
      )}

      {/* Tech stack */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((skill) => (
            <Badge key={skill.id} variant="blue">
              {skill.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Description */}
      <div>
        <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
      </div>

      {/* Case study sections */}
      {caseStudySections.map(
        (section) =>
          section.content && (
            <section key={section.title}>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
            </section>
          ),
      )}

      {/* Image gallery */}
      {project.images && project.images.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.images.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.imageUrl)}
                className="overflow-hidden rounded-lg bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <img
                  src={image.imageUrl}
                  alt={image.caption || project.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform"
                />
                {image.caption && (
                  <p className="text-xs text-gray-500 p-2">{image.caption}</p>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      {(project.projectUrl || project.repoUrl) && (
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Links</h3>
          <div className="flex flex-wrap gap-4">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-blue hover:underline"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Live Project
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-blue hover:underline"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Source Code
              </a>
            )}
          </div>
        </section>
      )}

      {/* Published date */}
      {project.publishedAt && (
        <p className="text-sm text-gray-400">
          Published on {new Date(project.publishedAt).toLocaleDateString()}
        </p>
      )}

      {/* Full-size image modal */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        {selectedImage && (
          <img
            src={selectedImage}
            alt={project.title}
            className="w-full rounded-lg"
          />
        )}
      </Modal>
    </article>
  );
}
