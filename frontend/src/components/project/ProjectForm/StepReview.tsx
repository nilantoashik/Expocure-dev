import { Badge } from '@/components/ui/Badge';
import type { ProjectFormData } from './ProjectFormStepper';

interface StepReviewProps {
  data: ProjectFormData;
}

export function StepReview({ data }: StepReviewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Review Your Project</h2>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
        <p className="text-gray-900 font-semibold text-xl">{data.title || '(No title)'}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
        <p className="text-gray-700">{data.description || '(No description)'}</p>
      </div>

      {data.techStack.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {data.techStack.map((skill) => (
              <Badge key={skill.id} variant="blue">{skill.name}</Badge>
            ))}
          </div>
        </div>
      )}

      {data.goals && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Goals</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{data.goals}</p>
        </div>
      )}

      {data.developmentProcess && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Development Process</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{data.developmentProcess}</p>
        </div>
      )}

      {data.challenges && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Challenges</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{data.challenges}</p>
        </div>
      )}

      {data.outcomes && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Outcomes</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{data.outcomes}</p>
        </div>
      )}

      {data.imageUrls.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Images ({data.imageUrls.length})</h3>
          <div className="grid grid-cols-3 gap-2">
            {data.imageUrls.map((img, i) => (
              <img key={i} src={img.url} alt="" className="w-full h-24 object-cover rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {(data.projectUrl || data.repoUrl) && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Links</h3>
          {data.projectUrl && <p className="text-brand-blue text-sm">{data.projectUrl}</p>}
          {data.repoUrl && <p className="text-brand-blue text-sm">{data.repoUrl}</p>}
        </div>
      )}
    </div>
  );
}
