export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  role: 'developer' | 'recruiter';
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  websiteUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  companyName: string | null;
  companyUrl: string | null;
  industry: string | null;
  workEmail: string | null;
  isWorkEmailVerified: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
