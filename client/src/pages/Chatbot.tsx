import { MessageCircle } from "lucide-react";

export default function Chatbot() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl glass-card rounded-3xl p-10 md:p-14 text-center shadow-xl">
        <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-teal-600 dark:text-teal-400" />
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
          Support Chat — Coming Soon
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
          This feature is currently under development. We are working on making
          TalkEasy safe, reliable, and meaningful before its official release.
        </p>

        <div className="mt-6 inline-flex items-center rounded-full border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 px-5 py-2.5 text-sm font-semibold text-teal-700 dark:text-teal-300">
          Support Chat will be available in the next TalkEasy version.
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          No AI service is active in this release.
        </p>
      </div>
    </div>
  );
}
