import { MessageCircle, Wrench } from "lucide-react";

export default function Chatbot() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl glass-card rounded-3xl p-10 md:p-14 text-center shadow-xl">
        <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold tracking-wide text-amber-800">
          <Wrench className="w-4 h-4" /> IN DEVELOPMENT
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Support Chat</h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
          Support Chat is currently IN DEVELOPMENT. The planned experience will use a self-hosted Ollama model rather than an OpenAI API dependency.
        </p>
        <p className="mt-8 text-xs text-muted-foreground">CopyTalkEasy · Created by Taha Shahud</p>
      </div>
    </div>
  );
}
