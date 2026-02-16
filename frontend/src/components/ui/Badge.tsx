interface BadgeProps {
  children: string;
  variant?: 'default' | 'blue' | 'green';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const styles: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700',
    blue: 'bg-brand-blue-light text-brand-blue',
    green: 'bg-brand-green-light text-brand-green',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
