import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';

const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-brand-blue"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-brand-blue"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-brand-blue"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);

const features = [
  {
    icon: <DocumentIcon />,
    title: 'Case Study Builder',
    description:
      'Multi-step form with rich details: goals, process, challenges, and outcomes.',
  },
  {
    icon: <CodeIcon />,
    title: 'Tech Stack Showcase',
    description:
      'Highlight the technologies you\'ve mastered with searchable skill tags.',
  },
  {
    icon: <GlobeIcon />,
    title: 'Public Portfolio',
    description:
      'Share your work with a clean, professional public profile.',
  },
];

const steps = [
  {
    number: 1,
    title: 'Create Your Profile',
    description:
      'Sign up and build your developer profile with your skills and experience.',
  },
  {
    number: 2,
    title: 'Add Your Projects',
    description:
      'Use our guided form to create detailed case studies for each project.',
  },
  {
    number: 3,
    title: 'Share & Get Noticed',
    description:
      'Publish your portfolio and share it with potential employers or clients.',
  },
];

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue to-[#005a8c] text-white min-h-[calc(100vh-64px)] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm mb-6">
              For Developers &amp; Designers
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Showcase Your Work as Compelling Case Studies
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mt-6">
              Expocure helps creators present their projects with depth —
              turning simple portfolios into powerful stories that attract
              opportunities.
            </p>
            <div className="flex gap-4 mt-8">
              <Link to="/signup">
                <button className="bg-brand-green hover:bg-brand-green/90 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                  Get Started Free
                </button>
              </Link>
              <a href="#features">
                <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                  Learn More
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center">
            Everything You Need to Stand Out
          </h2>
          <p className="text-gray-500 text-center mt-3">
            Build professional case studies that go beyond simple portfolio
            listings
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                <p className="text-gray-500 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
                <p className="text-gray-500 mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Showcase Your Best Work?
            </h2>
            <p className="text-white/80 mt-4 text-lg">
              Join Expocure today and turn your projects into stories that get
              you hired.
            </p>
            <Link
              to="/signup"
              className="bg-brand-green hover:bg-brand-green/90 text-white px-8 py-3 rounded-lg font-semibold text-lg mt-8 inline-block transition-colors"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
