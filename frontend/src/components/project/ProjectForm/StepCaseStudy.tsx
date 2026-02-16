import { Textarea } from '@/components/ui/Textarea';
import type { ProjectFormData } from './ProjectFormStepper';

interface StepCaseStudyProps {
  data: ProjectFormData;
  onChange: (updates: Partial<ProjectFormData>) => void;
}

export function StepCaseStudy({ data, onChange }: StepCaseStudyProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Case Study Details</h2>
      <Textarea
        label="Project Goals"
        placeholder="What did this project aim to achieve?"
        value={data.goals}
        onChange={(e) => onChange({ goals: e.target.value })}
      />
      <Textarea
        label="Development Process"
        placeholder="How was this project built? Describe your workflow..."
        value={data.developmentProcess}
        onChange={(e) => onChange({ developmentProcess: e.target.value })}
      />
      <Textarea
        label="Challenges"
        placeholder="What obstacles did you face and how did you overcome them?"
        value={data.challenges}
        onChange={(e) => onChange({ challenges: e.target.value })}
      />
      <Textarea
        label="Outcomes"
        placeholder="What were the results and impact of this project?"
        value={data.outcomes}
        onChange={(e) => onChange({ outcomes: e.target.value })}
      />
    </div>
  );
}
