import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { ProjectFormData } from './ProjectFormStepper';

interface StepBasicInfoProps {
  data: ProjectFormData;
  onChange: (updates: Partial<ProjectFormData>) => void;
}

export function StepBasicInfo({ data, onChange }: StepBasicInfoProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
      <Input
        label="Project Title *"
        placeholder="My Awesome Project"
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
      />
      <Textarea
        label="Short Description *"
        placeholder="A brief summary of your project..."
        value={data.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
      <Input
        label="Live Project URL"
        placeholder="https://myproject.com"
        value={data.projectUrl}
        onChange={(e) => onChange({ projectUrl: e.target.value })}
      />
      <Input
        label="Repository URL"
        placeholder="https://github.com/user/repo"
        value={data.repoUrl}
        onChange={(e) => onChange({ repoUrl: e.target.value })}
      />
    </div>
  );
}
