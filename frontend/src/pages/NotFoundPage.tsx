import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-xl text-gray-500">Page not found</p>
      <p className="mt-2 text-gray-400">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="mt-8">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
