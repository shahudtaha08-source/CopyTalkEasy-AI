import React from "react";

const FeatureCard = ({ title, children, status }: { title: string; children: React.ReactNode; status?: boolean }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <div className="flex items-start justify-between gap-3 mb-2">
      <h3 className="text-xl font-semibold">{title}</h3>
      {status && <span className="text-xs font-bold tracking-wide px-3 py-1 rounded-full bg-amber-100 text-amber-800 whitespace-nowrap">IN DEVELOPMENT</span>}
    </div>
    <p>{children}</p>
  </div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <section className="text-center py-20 px-6 bg-gradient-to-r from-blue-600 to-violet-700 text-white">
        <div className="flex justify-center mb-5">
          <img src="/copytalkeasy-mark.svg" alt="CopyTalkEasy" className="w-16 h-16 rounded-2xl shadow-xl" />
        </div>
        <h1 className="text-5xl font-bold mb-4">CopyTalkEasy</h1>
        <p className="text-xl max-w-2xl mx-auto">
          A wellbeing and personal growth platform by Taha Shahud, designed to make reflection,
          habits, emotional awareness and supportive technology easier to access.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a href="/api/login" className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold shadow">Go to Dashboard</a>
          <a href="/api/login" className="border border-white px-6 py-3 rounded-xl">Login</a>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">CopyTalkEasy Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard title="Support Chat" status>
            A dedicated support-focused chat experience. AI-powered support is currently being developed for a future Ollama-based release.
          </FeatureCard>
          <FeatureCard title="Mood Tracking">
            Track your emotional state daily and understand how your mood evolves over time.
          </FeatureCard>
          <FeatureCard title="Habit Tracker">
            Build positive habits while monitoring your consistency and progress.
          </FeatureCard>
          <FeatureCard title="Emotional History">
            Review past moods and reflections to notice patterns over time.
          </FeatureCard>
          <FeatureCard title="Statistics Dashboard">
            Visualize your progress with clear charts and personal insights.
          </FeatureCard>
          <FeatureCard title="Multilingual Support" status>
            Expanded language support is currently IN DEVELOPMENT.
          </FeatureCard>
        </div>
      </section>

      <section className="py-20 bg-white text-center px-6">
        <h2 className="text-3xl font-bold mb-6">Meet the Founder</h2>
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Taha Shahud</h3>
          <p className="text-gray-600 mb-4">
            Taha Shahud is the founder and builder behind CopyTalkEasy. He creates practical technology projects with a focus on useful experiences, thoughtful design and solving real problems.
          </p>
          <p className="text-gray-600 mb-8">
            CopyTalkEasy is one part of that journey — a product built around personal reflection, wellbeing tools and supportive technology rather than a portfolio of every project.
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://taha-personal.netlify.app" target="_blank" rel="noreferrer" className="bg-blue-700 text-white px-5 py-2 rounded-lg">Portfolio</a>
            <a href="https://github.com/shahudtaha08-source" target="_blank" rel="noreferrer" className="bg-gray-800 text-white px-5 py-2 rounded-lg">GitHub</a>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 bg-gray-100 text-gray-500">
        © {new Date().getFullYear()} CopyTalkEasy · Created by Taha Shahud
      </footer>
    </div>
  );
}
