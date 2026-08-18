import React from "react";
import { Sparkles, Clock, AlertCircle, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function AITherapist() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in duration-500 text-center space-y-8">
      <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/25">
        <Sparkles className="w-12 h-12 animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          {t("aiTherapistBadge")}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white">
          {t("therapistComingSoonTitle")}
        </h1>
      </div>

      <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto border-2 border-indigo-100 dark:border-indigo-900/40 shadow-xl space-y-6">
        <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          {t("therapistComingSoonDesc")}
        </p>

        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-start gap-3 text-left">
          <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-teal-900 dark:text-teal-200">
            <strong>{t("therapistNextVersion")}</strong>
            <br />
            In the meantime, you can use our <strong>Support Chat</strong> for reflective conversation, log your mood, track habits, or connect with crisis resources via <strong>Find Help</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
