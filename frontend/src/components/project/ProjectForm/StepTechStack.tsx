import { SkillSelector } from '@/components/profile/SkillSelector';
import type { ProjectFormData } from './ProjectFormStepper';

interface StepTechStackProps {
  data: ProjectFormData;
  onChange: (updates: Partial<ProjectFormData>) => void;
}

export function StepTechStack({ data, onChange }: StepTechStackProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Tech Stack</h2>
      <p className="text-sm text-gray-500">Select the technologies used in this project.</p>
      <SkillSelector
        selected={data.techStack}
        onChange={(skills) => onChange({ techStack: skills })}
      />
    </div>
  );
}
