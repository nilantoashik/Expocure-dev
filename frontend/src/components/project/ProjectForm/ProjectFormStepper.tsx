import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { StepBasicInfo } from './StepBasicInfo';
import { StepTechStack } from './StepTechStack';
import { StepCaseStudy } from './StepCaseStudy';
import { StepImages } from './StepImages';
import { StepReview } from './StepReview';
import type { Skill } from '@/types/project';

export interface ProjectFormData {
  title: string;
  description: string;
  goals: string;
  developmentProcess: string;
  challenges: string;
  outcomes: string;
  projectUrl: string;
  repoUrl: string;
  thumbnailUrl: string;
  techStack: Skill[];
  imageUrls: { url: string; caption: string }[];
}

interface ProjectFormStepperProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData, publish: boolean) => Promise<void>;
  isEdit?: boolean;
}

const STEPS = ['Basic Info', 'Tech Stack', 'Case Study', 'Images', 'Review'];

export function ProjectFormStepper({ initialData, onSubmit, isEdit }: ProjectFormStepperProps) {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    goals: initialData?.goals || '',
    developmentProcess: initialData?.developmentProcess || '',
    challenges: initialData?.challenges || '',
    outcomes: initialData?.outcomes || '',
    projectUrl: initialData?.projectUrl || '',
    repoUrl: initialData?.repoUrl || '',
    thumbnailUrl: initialData?.thumbnailUrl || '',
    techStack: initialData?.techStack || [],
    imageUrls: initialData?.imageUrls || [],
  });

  const updateData = (updates: Partial<ProjectFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (publish: boolean) => {
    setIsLoading(true);
    try {
      await onSubmit(formData, publish);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span className={`ml-2 text-sm hidden sm:inline ${i <= step ? 'text-brand-blue font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="w-8 sm:w-16 h-0.5 mx-2 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {step === 0 && <StepBasicInfo data={formData} onChange={updateData} />}
        {step === 1 && <StepTechStack data={formData} onChange={updateData} />}
        {step === 2 && <StepCaseStudy data={formData} onChange={updateData} />}
        {step === 3 && <StepImages data={formData} onChange={updateData} />}
        {step === 4 && <StepReview data={formData} />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          Back
        </Button>
        <div className="flex gap-3">
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={step === 0 && !formData.title}>
              Next
            </Button>
          ) : (
            <>
              <Button variant="outline" isLoading={isLoading} onClick={() => handleSubmit(false)}>
                {isEdit ? 'Save Changes' : 'Save Draft'}
              </Button>
              <Button variant="secondary" isLoading={isLoading} onClick={() => handleSubmit(true)}>
                Publish
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
