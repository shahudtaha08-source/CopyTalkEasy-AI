import { useEmotionalHistory } from "@/hooks/use-history";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import {
  SmilePlus, Bot, BookOpen, CalendarDays, Loader2, Smile,
  Frown, Meh, AlertCircle, Heart, Angry, TrendingUp
} from "lucide-react";

const MOOD_CONFIG: Record<string, { icon: typeof Smile; color: string; bg: string; label: string }> = {
  happy:   { icon: Smile,        color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30", label: "Happy" },
  sad:     { icon: Frown,        color: "text-blue-600",    bg: "bg-blue-100 dark:bg-blue-900/30",    label: "Sad" },
  stressed:{ icon: AlertCircle,  color: "text-orange-600",  bg: "bg-orange-100 dark:bg-orange-900/30",label: "Stressed" },
  anxious: { icon: AlertCircle,  color: "text-yellow-600",  bg: "bg-yellow-100 dark:bg-yellow-900/30",label: "Anxious" },
  angry:   { icon: Angry,        color: "text-red-600",     bg: "bg-red-100 dark:bg-red-900/30",      label: "Angry" },
  neutral: { icon: Meh,          color: "text-slate-500",   bg: "bg-slate-100 dark:bg-slate-800",     label: "Neutral" },
  lonely:  { icon: Heart,        color: "text-purple-600",  bg: "bg-purple-100 dark:bg-purple-900/30",label: "Lonely" },
  default: { icon: Smile,        color: "text-teal-600",    bg: "bg-teal-100 dark:bg-teal-900/30",    label: "Mood" },
};

function getMoodConfig(value: string) {
  return MOOD_CONFIG[value?.toLowerCase()] || MOOD_CONFIG.default;
}

function formatDate(dateStr: string) {
  try {
    const d = parseISO(dateStr.includes("T") ? dateStr : dateStr + "T00:00:00");
    if (isToday(d)) return "Today";
    if (isYesterday(d)) return "Yesterday";
    return format(d, "MMMM d, yyyy");
  } catch { return dateStr; }
}

function formatTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return format(d, "h:mm a");
  } catch { return ""; }
}

function TimelineNode({ type }: { type: string }) {
  if (type === "mood")    return <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-background shadow-sm" />;
  if (type === "journal") return <div className="w-4 h-4 rounded-full bg-teal-500 border-4 border-background shadow-sm" />;
  if (type === "emotion") return <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-background shadow-sm" />;
  return <div className="w-4 h-4 rounded-full bg-slate-400 border-4 border-background shadow-sm" />;
}

function TimelineCard({ item }: { item: any }) {
  if (item.type === "mood") {
    const cfg = getMoodConfig(item.value);
    const Icon = cfg.icon;
    return (
      <div className="glass-card p-5 rounded-2xl hover-lift border-l-4 border-emerald-400">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
            <Icon className={`w-5 h-5 ${cfg.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Mood Check-in</span>
              <span className="text-xs text-slate-400">{formatTime(item.date)}</span>
            </div>
            <p className={`text-xl font-display font-bold capitalize mt-1 ${cfg.color}`}>{item.value}</p>
            {item.notes && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 italic">"{item.notes}"</p>}
          </div>
        </div>
      </div>
    );
  }

  if (item.type === "journal") {
    return (
      <div className="glass-card p-5 rounded-2xl hover-lift border-l-4 border-teal-400">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-100 dark:bg-teal-900/30">
            <BookOpen className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Journal Entry</span>
              <span className="text-xs text-slate-400">{formatTime(item.date)}</span>
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">{item.value}</p>
            {item.notes && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3">{item.notes}</p>
            )}
            {item.tags && (
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {item.tags.split(",").filter(Boolean).map((tag: string, i: number) => (
                  <span key={i} className="text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-md">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (item.type === "emotion") {
    const cfg = getMoodConfig(item.value);
    const Icon = cfg.icon;
    return (
      <div className="glass-card p-5 rounded-2xl hover-lift border-l-4 border-blue-400">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-100 dark:bg-blue-900/30">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Support Chat — Detected Emotion</span>
              <span className="text-xs text-slate-400">{formatTime(item.date)}</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.color}`}>
              <Icon className="w-4 h-4" /> {cfg.label}
            </div>
            {item.notes && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{item.notes}</p>}
            {item.suggestion && (
              <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-0.5 uppercase tracking-wide">Wellness Tip</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{item.suggestion}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function EmotionalHistory() {
  const { data: history = [], isLoading } = useEmotionalHistory();

  const grouped = history.reduce((acc: Record<string, any[]>, item: any) => {
    const d = item.date.split("T")[0];
    if (!acc[d]) acc[d] = [];
    acc[d].push(item);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort().reverse();

  const legendItems = [
    { color: "bg-emerald-500", label: "Mood Check-in" },
    { color: "bg-teal-500",    label: "Journal Entry" },
    { color: "bg-blue-500",    label: "Support Chat Emotion" },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-teal-600" />
          Emotional Timeline
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A chronological record of your moods, journal entries, and wellness conversations.
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          {legendItems.map(l => (
            <div key={l.label} className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <div className={`w-3 h-3 rounded-full ${l.color}`} />
              {l.label}
            </div>
          ))}
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
          <p className="text-muted-foreground">Loading your timeline…</p>
        </div>
      ) : dates.length === 0 ? (
        <div className="glass-card p-16 text-center rounded-3xl">
          <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Your timeline is empty</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Start by logging a mood, writing a journal entry, or having a support chat. Your history will appear here.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-teal-300 via-slate-200 to-slate-100 dark:from-teal-700 dark:via-slate-700 dark:to-slate-800" />

          <div className="space-y-10 pl-10">
            {dates.map(date => (
              <div key={date} className="relative">
                {/* Date node */}
                <div className="absolute -left-[41px] top-1 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-teal-500 border-4 border-background shadow-md" />
                </div>

                {/* Date label */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                    <SmilePlus className="w-4 h-4 text-teal-500" />
                    {formatDate(date)}
                  </span>
                </div>

                <div className="space-y-3">
                  {grouped[date].map((item: any) => (
                    <div key={`${item.type}-${item.id}`} className="relative pl-2">
                      <div className="absolute -left-[29px] top-[22px]">
                        <TimelineNode type={item.type} />
                      </div>
                      <TimelineCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-sm text-amber-700 dark:text-amber-300 text-center">
        TalkEasy supports emotional wellbeing. It does not diagnose mental illnesses and does not replace licensed psychologists, psychiatrists or emergency services.
      </div>
    </div>
  );
}
