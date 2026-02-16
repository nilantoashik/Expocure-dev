import { Link } from 'react-router-dom';

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Link
        to="/projects/new"
        className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
      >
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <svg className="h-5 w-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="font-medium text-gray-900">New Project</span>
      </Link>
      <Link
        to="/profile"
        className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
      >
        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
          <svg className="h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="font-medium text-gray-900">Edit Profile</span>
      </Link>
    </div>
  );
}
