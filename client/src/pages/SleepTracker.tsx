import { useEffect, useMemo, useState } from "react";
import { Moon, Save } from "lucide-react";

type SleepEntry = {
  date: string;
  sleptAt: string;
  wokeAt: string;
  hours: number;
};

const STORAGE_KEY = "copytalkeasy-sleep-entry";

function calculateHours(sleptAt: string, wokeAt: string) {
  if (!sleptAt || !wokeAt) return 0;
  const [sh, sm] = sleptAt.split(":").map(Number);
  const [wh, wm] = wokeAt.split(":").map(Number);
  let start = sh * 60 + sm;
  let end = wh * 60 + wm;
  if (end <= start) end += 24 * 60;
  return Math.round(((end - start) / 60) * 10) / 10;
}

export default function SleepTracker() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [sleptAt, setSleptAt] = useState("");
  const [wokeAt, setWokeAt] = useState("");
  const [saved, setSaved] = useState(false);

  const hours = useMemo(() => calculateHours(sleptAt, wokeAt), [sleptAt, wokeAt]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const entry: SleepEntry = JSON.parse(raw);
      if (entry.date === today) {
        setSleptAt(entry.sleptAt);
        setWokeAt(entry.wokeAt);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [today]);

  const saveSleep = () => {
    if (!sleptAt || !wokeAt || hours <= 0) return;
    const entry: SleepEntry = { date, sleptAt, wokeAt, hours };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Moon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Sleep Tracker</h1>
          <p className="text-muted-foreground">Track when you actually sleep and wake up — no hardcoded 8-hour assumption.</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Sleep date</label>
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">What time did you go to sleep?</label>
            <input value={sleptAt} onChange={(e) => setSleptAt(e.target.value)} type="time" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">What time did you wake up?</label>
            <input value={wokeAt} onChange={(e) => setWokeAt(e.target.value)} type="time" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Calculated sleep duration</p>
          <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">{hours ? `${hours} hours` : "Add your times"}</p>
        </div>

        <button onClick={saveSleep} disabled={!sleptAt || !wokeAt || hours <= 0} className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-3 font-semibold disabled:opacity-50">
          <Save className="w-5 h-5" /> {saved ? "Saved" : "Save today's sleep"}
        </button>
        <p className="text-xs text-muted-foreground text-center">Sleep duration is calculated from your real bedtime and wake time. Database sync can be added later.</p>
      </div>
    </div>
  );
}
