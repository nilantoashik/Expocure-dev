import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ProjectCard } from '@/components/project/ProjectCard';
import { VerificationBanner } from '@/components/auth/VerificationBanner';

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, isLoading, refetch } = useProjects();
  const [savedDevelopers, setSavedDevelopers] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'recruiter') {
      setSavedLoading(true);
      api.get<any[]>('/saved-developers')
        .then(setSavedDevelopers)
        .catch(() => {})
        .finally(() => setSavedLoading(false));
    }
  }, [user?.role]);

  const handlePublish = async (id: string) => {
    if (!user?.isEmailVerified) {
      alert('Verify your email to publish projects');
      return;
    }
    await api.patch(`/projects/${id}/publish`);
    refetch();
  };

  const handleUnpublish = async (id: string) => {
    await api.patch(`/projects/${id}/unpublish`);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    await api.delete(`/projects/${id}`);
    refetch();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const recentProjects = projects.slice(0, 6);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <VerificationBanner />

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-gray-500 mt-1">
            {user?.role === 'recruiter'
              ? `${user.companyName ? user.companyName + ' - ' : ''}Recruiter Dashboard`
              : "Here's an overview of your portfolio."}
          </p>
        </div>

        {user?.role === 'developer' ? (
          <>
            <QuickActions />
            <StatsCards projects={projects} />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
                <Link to="/projects/new">
                  <Button size="sm">New Project</Button>
                </Link>
              </div>

              {recentProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      showActions
                      onPublish={handlePublish}
                      onUnpublish={handleUnpublish}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No projects yet"
                  description="Create your first project to start building your portfolio."
                  action={
                    <Link to="/projects/new">
                      <Button>Create Project</Button>
                    </Link>
                  }
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/developers"
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-brand-blue hover:shadow-sm transition-all"
              >
                <div className="text-brand-blue mb-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Browse Developers</h3>
                <p className="text-sm text-gray-500 mt-1">Discover talented developers and designers</p>
              </Link>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-brand-green mb-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Saved Developers</h3>
                <p className="text-sm text-gray-500 mt-1">{savedDevelopers.length} developer{savedDevelopers.length !== 1 ? 's' : ''} bookmarked</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Developers</h2>
              {savedLoading ? (
                <div className="flex justify-center py-8"><Spinner /></div>
              ) : savedDevelopers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedDevelopers.map((item: any) => (
                    <Link
                      key={item.id}
                      to={`/${item.developer.username}`}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-blue hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">
                          {item.developer.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.developer.fullName}</p>
                          <p className="text-sm text-gray-500">@{item.developer.username}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No saved developers"
                  description="Browse developers and save the ones you're interested in."
                  action={
                    <Link to="/developers">
                      <Button>Browse Developers</Button>
                    </Link>
                  }
                />
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
