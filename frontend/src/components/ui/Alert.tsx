import type { ReactNode } from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  children: ReactNode;
  onClose?: () => void;
}

export function Alert({ type, children, onClose }: AlertProps) {
  const styles: Record<string, string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[type]} flex items-center justify-between`}>
      <span className="text-sm">{children}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-current opacity-50 hover:opacity-100 cursor-pointer">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
