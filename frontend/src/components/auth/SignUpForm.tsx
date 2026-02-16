import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export function SignUpForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'developer' | 'recruiter'>('developer');
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) errors.fullName = 'Full name is required';
    if (!form.username.trim()) errors.username = 'Username is required';
    else if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(form.username))
      errors.username = 'Lowercase letters, numbers, and hyphens only';
    if (!form.email.trim()) errors.email = 'Email is required';
    if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (role === 'recruiter' && !form.companyName.trim()) errors.companyName = 'Company name is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setIsLoading(true);
    try {
      await signup({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        role,
        ...(role === 'recruiter' && form.companyName ? { companyName: form.companyName } : {}),
      });
      navigate('/verify-email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setRole('developer')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            role === 'developer'
              ? 'bg-brand-blue text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Developer
        </button>
        <button
          type="button"
          onClick={() => setRole('recruiter')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            role === 'recruiter'
              ? 'bg-brand-blue text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Recruiter
        </button>
      </div>

      <Input
        label="Full Name"
        placeholder="John Doe"
        value={form.fullName}
        onChange={(e) => updateField('fullName', e.target.value)}
        error={fieldErrors.fullName}
      />
      <Input
        label="Username"
        placeholder="johndoe"
        value={form.username}
        onChange={(e) => updateField('username', e.target.value.toLowerCase())}
        error={fieldErrors.username}
      />
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        value={form.email}
        onChange={(e) => updateField('email', e.target.value)}
        error={fieldErrors.email}
      />
      {role === 'recruiter' && (
        <Input
          label="Company Name"
          placeholder="Acme Inc."
          value={form.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          error={fieldErrors.companyName}
        />
      )}
      <Input
        label="Password"
        type="password"
        placeholder="Min 8 characters"
        value={form.password}
        onChange={(e) => updateField('password', e.target.value)}
        error={fieldErrors.password}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={form.confirmPassword}
        onChange={(e) => updateField('confirmPassword', e.target.value)}
        error={fieldErrors.confirmPassword}
      />
      <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
        Create Account
      </Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/signin" className="text-brand-blue font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
