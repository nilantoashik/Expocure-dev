import { Avatar } from '@/components/ui/Avatar';
import type { User } from '@/types/user';

interface ProfileHeaderProps {
  user: User;
  isOwn?: boolean;
  onEdit?: () => void;
  actionButton?: React.ReactNode;
}

export function ProfileHeader({ user, isOwn, onEdit, actionButton }: ProfileHeaderProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <Avatar src={user.avatarUrl} name={user.fullName} size="xl" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'recruiter'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'recruiter' ? 'Recruiter' : 'Developer'}
                </span>
                {user.isEmailVerified && (
                  <span className="inline-flex items-center text-brand-blue" title="Verified email">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                {user.isWorkEmailVerified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Work Email Verified
                  </span>
                )}
              </div>
              <p className="text-gray-500">@{user.username}</p>
              {user.role === 'recruiter' && user.companyName && (
                <p className="text-sm text-gray-600 mt-1">
                  {user.companyName}
                  {user.industry && <span className="text-gray-400"> &middot; {user.industry}</span>}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {actionButton}
              {isOwn && onEdit && (
                <button onClick={onEdit} className="text-sm text-brand-blue hover:underline cursor-pointer">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          {user.bio && <p className="mt-3 text-gray-700">{user.bio}</p>}
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
            {user.location && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {user.location}
              </span>
            )}
            {user.websiteUrl && (
              <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                Website
              </a>
            )}
            {user.githubUrl && (
              <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                GitHub
              </a>
            )}
            {user.linkedinUrl && (
              <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
