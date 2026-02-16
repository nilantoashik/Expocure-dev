import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useSkills } from '@/hooks/useSkills';
import type { Skill } from '@/types/project';

interface SkillSelectorProps {
  selected: Skill[];
  onChange: (skills: Skill[]) => void;
}

export function SkillSelector({ selected, onChange }: SkillSelectorProps) {
  const [search, setSearch] = useState('');
  const { skills } = useSkills(search || undefined);

  const toggle = (skill: Skill) => {
    const isSelected = selected.some((s) => s.id === skill.id);
    if (isSelected) {
      onChange(selected.filter((s) => s.id !== skill.id));
    } else {
      onChange([...selected, skill]);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search skills..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((skill) => (
            <button key={skill.id} onClick={() => toggle(skill)} className="cursor-pointer">
              <Badge variant="blue">{skill.name} x</Badge>
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
        {skills
          .filter((s) => !selected.some((sel) => sel.id === s.id))
          .map((skill) => (
            <button key={skill.id} onClick={() => toggle(skill)} className="cursor-pointer">
              <Badge>{skill.name}</Badge>
            </button>
          ))}
      </div>
    </div>
  );
}
