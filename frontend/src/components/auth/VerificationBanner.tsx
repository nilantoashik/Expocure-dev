import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function VerificationBanner() {
  const { user } = useAuth();

  if (!user || user.isEmailVerified) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span className="text-sm text-amber-800">
          Your email is not verified. Verify now to unlock all features.
        </span>
      </div>
      <Link
        to="/verify-email"
        className="text-sm font-medium text-amber-700 hover:text-amber-900 whitespace-nowrap ml-4"
      >
        Verify now &rarr;
      </Link>
    </div>
  );
}
