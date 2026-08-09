import { enableDemoMode, isDemoMode, disableDemoMode } from "@/lib/demo-data";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import {
  Smile, BookOpen, Activity, MessageCircle, TrendingUp, HeartPulse,
  FlaskConical, CheckCircle, ArrowRight, Leaf
} from "lucide-react";

const FEATURES = [
  { icon: MessageCircle, title: "Support Chat",       desc: "Reflective, supportive conversations — without claiming to be a therapist." },
  { icon: Smile,         title: "Mood Tracking",      desc: "Log your emotional state and watch how it changes over time." },
  { icon: BookOpen,      title: "Personal Journal",   desc: "Daily, gratitude, reflection, and free-writing entries with tags and search." },
  { icon: Activity,      title: "Habit Builder",      desc: "Build positive routines: sleep, hydration, exercise, and reflection." },
  { icon: TrendingUp,    title: "Emotional Timeline", desc: "A unified chronological view of moods, journals, and support sessions." },
  { icon: HeartPulse,    title: "Find Help",          desc: "Locate psychologists, crisis helplines, and university counseling services." },
];

export default function Landing() {
  const [, navigate] = useLocation();

  function handleDemoMode() {
    enableDemoMode();
    queryClient.clear();
    navigate("/dashboard");
  }

  function handleExitDemo() {
    disableDemoMode();
    queryClient.clear();
    window.location.reload();
  }

  const inDemo = isDemoMode();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">

      {/* Demo banner */}
      {inDemo && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-3">
          <FlaskConical className="w-4 h-4" />
          You are in Demo Mode — data is stored locally and does not require a login.
          <button onClick={handleExitDemo} className="underline font-bold">Exit Demo</button>
        </div>
      )}

      {/* Hero */}
      <section className="text-center py-24 px-6 bg-gradient-to-br from-teal-600 via-teal-700 to-sky-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shadow-xl">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 leading-tight">TalkEasy</h1>
          <p className="text-xl md:text-2xl text-teal-100 max-w-2xl mx-auto mb-2">
            A professional Mental Wellness Platform.
          </p>
          <p className="text-teal-200 max-w-xl mx-auto mb-10 text-base">
            Track moods, journal reflections, build habits, discover emotional patterns, and find human support — all in one calm experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/api/login"
              className="bg-white text-teal-700 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
            >
              Sign In <ArrowRight className="w-5 h-5" />
            </a>
            <button
              onClick={handleDemoMode}
              className="bg-white/15 border border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/25 transition inline-flex items-center gap-2"
            >
              <FlaskConical className="w-5 h-5" /> Try Demo Mode
            </button>
          </div>
          <p className="text-teal-300 text-xs mt-4">Demo Mode uses no account and stores data locally only.</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <p className="text-sm font-bold tracking-widest text-teal-600 uppercase text-center mb-3">Platform Features</p>
        <h2 className="text-3xl font-display font-bold text-center mb-12 text-slate-900 dark:text-white">
          Support designed around the person
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group">
              <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mb-4 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 transition">
                <Icon className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200 dark:border-amber-900/40 py-10 px-6 text-center">
        <p className="max-w-2xl mx-auto text-sm text-amber-700 dark:text-amber-300">
          <strong>Disclaimer:</strong> TalkEasy supports emotional wellbeing and self-reflection. It does not diagnose mental illnesses and does not replace licensed psychologists, psychiatrists, or emergency services. If you are in immediate distress, please contact emergency services or a crisis helpline.
        </p>
      </section>

      {/* Team */}
      <section className="py-16 bg-white dark:bg-slate-900 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-bold tracking-widest text-teal-600 uppercase text-center mb-3">Project Team</p>
          <h2 className="text-2xl font-display font-bold text-center mb-10 text-slate-900 dark:text-white">Meet the Developers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { initials: "TS", name: "Taha Shahud",   role: "Creator & Lead Developer", color: "from-teal-500 to-teal-700", bio: "Student developer building practical digital tools that support human wellbeing and accessible mental health support." },
              { initials: "PG", name: "Praneet Gholap", role: "Co-Developer",             color: "from-sky-500 to-sky-700",  bio: "Student developer contributing to the design, development, and delivery of the TalkEasy mental wellness platform." },
            ].map(dev => (
              <div key={dev.name} className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-7">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dev.color} text-white flex items-center justify-center font-bold text-lg mb-5`}>
                  {dev.initials}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{dev.name}</h3>
                <p className="text-teal-600 font-semibold text-sm mt-1">{dev.role}</p>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">{dev.bio}</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500" /> School of Engineering and Technology
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-6 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
        © {new Date().getFullYear()} TalkEasy · Developed by Taha Shahud & Praneet Gholap · School of Engineering and Technology
      </footer>
    </div>
  );
}
