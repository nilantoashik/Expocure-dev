import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Alert } from '@/components/ui/Alert';
import type { User } from '@/types/user';

interface ProfileEditFormProps {
  user: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

export function ProfileEditForm({ user, onSave, onCancel }: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [workEmailCode, setWorkEmailCode] = useState('');
  const [workEmailSent, setWorkEmailSent] = useState(false);
  const [workEmailMsg, setWorkEmailMsg] = useState('');
  const [form, setForm] = useState({
    fullName: user.fullName,
    bio: user.bio || '',
    location: user.location || '',
    websiteUrl: user.websiteUrl || '',
    githubUrl: user.githubUrl || '',
    linkedinUrl: user.linkedinUrl || '',
    twitterUrl: user.twitterUrl || '',
    companyName: user.companyName || '',
    companyUrl: user.companyUrl || '',
    industry: user.industry || '',
    workEmail: user.workEmail || '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const updated = await api.patch<User>('/users/me', form);
      onSave(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const result = await api.upload<{ avatarUrl: string }>('/users/me/avatar', formData);
      onSave({ ...user, avatarUrl: result.avatarUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    }
  };

  const handleSendWorkEmailCode = async () => {
    try {
      // Save the work email first
      await api.patch('/users/me', { workEmail: form.workEmail });
      await api.post('/users/me/send-work-email-code');
      setWorkEmailSent(true);
      setWorkEmailMsg('Verification code sent. Check your server console.');
    } catch (err) {
      setWorkEmailMsg(err instanceof Error ? err.message : 'Failed to send code');
    }
  };

  const handleVerifyWorkEmail = async () => {
    try {
      await api.post('/users/me/verify-work-email', { code: workEmailCode });
      setWorkEmailMsg('Work email verified!');
      setWorkEmailSent(false);
      onSave({ ...user, workEmail: form.workEmail, isWorkEmailVerified: true });
    } catch (err) {
      setWorkEmailMsg(err instanceof Error ? err.message : 'Invalid code');
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm text-gray-500" />
      </div>

      <Input label="Full Name" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} />
      <Textarea label="Bio" value={form.bio} onChange={(e) => updateField('bio', e.target.value)} placeholder="Tell us about yourself..." />
      <Input label="Location" value={form.location} onChange={(e) => updateField('location', e.target.value)} placeholder="City, Country" />
      <Input label="Website URL" value={form.websiteUrl} onChange={(e) => updateField('websiteUrl', e.target.value)} placeholder="https://..." />
      <Input label="GitHub URL" value={form.githubUrl} onChange={(e) => updateField('githubUrl', e.target.value)} placeholder="https://github.com/..." />
      <Input label="LinkedIn URL" value={form.linkedinUrl} onChange={(e) => updateField('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." />
      <Input label="Twitter URL" value={form.twitterUrl} onChange={(e) => updateField('twitterUrl', e.target.value)} placeholder="https://twitter.com/..." />

      {user.role === 'recruiter' && (
        <>
          <hr className="my-2" />
          <p className="text-sm font-medium text-gray-700">Company Information</p>
          <Input label="Company Name" value={form.companyName} onChange={(e) => updateField('companyName', e.target.value)} placeholder="Acme Inc." />
          <Input label="Company URL" value={form.companyUrl} onChange={(e) => updateField('companyUrl', e.target.value)} placeholder="https://company.com" />
          <Input label="Industry" value={form.industry} onChange={(e) => updateField('industry', e.target.value)} placeholder="Technology, Finance, etc." />
        </>
      )}

      <hr className="my-2" />
      <p className="text-sm font-medium text-gray-700">
        Work / Education Email
        {user.isWorkEmailVerified && <span className="ml-2 text-xs text-green-600">(Verified)</span>}
      </p>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            label=""
            value={form.workEmail}
            onChange={(e) => updateField('workEmail', e.target.value)}
            placeholder="work@company.com"
          />
        </div>
        {!user.isWorkEmailVerified && form.workEmail && (
          <Button type="button" size="sm" variant="secondary" onClick={handleSendWorkEmailCode} className="mt-1">
            Send Code
          </Button>
        )}
      </div>
      {workEmailSent && (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label="Verification Code"
              value={workEmailCode}
              onChange={(e) => setWorkEmailCode(e.target.value)}
              placeholder="6-digit code"
              maxLength={6}
            />
          </div>
          <Button type="button" size="sm" onClick={handleVerifyWorkEmail}>
            Verify
          </Button>
        </div>
      )}
      {workEmailMsg && <p className="text-sm text-gray-600">{workEmailMsg}</p>}

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>Save Changes</Button>
      </div>
    </form>
  );
}
