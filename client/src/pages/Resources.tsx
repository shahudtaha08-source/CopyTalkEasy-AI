import { useState } from "react";
import {
  Book, Heart, BrainCircuit, Coffee, Moon, Zap, Shield, Flame,
  Star, Clock, ChevronRight, Bookmark, BookmarkCheck
} from "lucide-react";

const ARTICLES = [
  {
    id: 1,
    category: "Stress Management",
    title: "10 Breathing Techniques for Instant Calm",
    summary: "When stress strikes, your breath is your fastest tool. These science-backed techniques activate the parasympathetic nervous system and reduce cortisol within minutes.",
    readTime: "5 min",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/20",
    border: "border-orange-200 dark:border-orange-900/50",
  },
  {
    id: 2,
    category: "Anxiety",
    title: "Understanding Your Anxiety Triggers",
    summary: "Anxiety often feels random, but it rarely is. Learn to identify the situations, thoughts, and patterns that bring on anxious feelings — and how to respond differently.",
    readTime: "8 min",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    border: "border-yellow-200 dark:border-yellow-900/50",
  },
  {
    id: 3,
    category: "Sleep Hygiene",
    title: "The Science of Sleep and Mental Health",
    summary: "Poor sleep doesn't just make you tired. It affects memory, emotional regulation, and your ability to cope with stress. Discover what good sleep hygiene really looks like.",
    readTime: "6 min",
    icon: Moon,
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    border: "border-indigo-200 dark:border-indigo-900/50",
  },
  {
    id: 4,
    category: "Relationships",
    title: "Setting Healthy Boundaries Without Guilt",
    summary: "Saying no is not selfish — it's sustainable. This article explores how to set boundaries clearly, compassionately, and with confidence in any relationship.",
    readTime: "7 min",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/20",
    border: "border-rose-200 dark:border-rose-900/50",
  },
  {
    id: 5,
    category: "Burnout",
    title: "Recovering from Academic Burnout",
    summary: "If studying feels impossible and everything drags, you may be experiencing burnout. Here is how to identify it early and take structured steps toward recovery.",
    readTime: "10 min",
    icon: Coffee,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-900/50",
  },
  {
    id: 6,
    category: "Depression",
    title: "When Sadness Becomes More Than a Feeling",
    summary: "It is normal to feel sad sometimes. But when sadness persists, steals your joy, and affects daily life, it deserves proper attention. Learn the signs and next steps.",
    readTime: "9 min",
    icon: BrainCircuit,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-900/50",
  },
  {
    id: 7,
    category: "Motivation",
    title: "How to Build Discipline When Motivation Fails",
    summary: "Motivation is fleeting. Discipline is a system. Discover practical strategies to maintain momentum in your studies, work, and personal goals even on your worst days.",
    readTime: "6 min",
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-900/50",
  },
  {
    id: 8,
    category: "Self-care",
    title: "Self-Care Is Not Selfish — Here Is Why",
    summary: "Rest, play, and personal care are not luxuries — they are necessities. Understand the evidence behind self-care and how small daily acts compound into resilience.",
    readTime: "5 min",
    icon: Star,
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-950/20",
    border: "border-pink-200 dark:border-pink-900/50",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(ARTICLES.map(a => a.category)))];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  const toggleFav = (id: number) =>
    setFavorites(fs => fs.includes(id) ? fs.filter(f => f !== id) : [...fs, id]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Book className="w-8 h-8 text-indigo-500" /> Wellness Resources
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Curated articles on mental wellbeing. Educational content only — not a substitute for professional support.
        </p>
      </header>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm font-medium px-4 py-2 rounded-full transition ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(article => {
          const Icon = article.icon;
          const isFav = favorites.includes(article.id);
          const isExpanded = expandedId === article.id;

          return (
            <div
              key={article.id}
              className={`glass-card rounded-2xl overflow-hidden border ${article.border} hover:shadow-md transition-shadow group`}
            >
              <div className={`${article.bg} px-5 pt-5 pb-4`}>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${article.color}`} />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${article.color}`}>
                      {article.category}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFav(article.id)}
                    aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                      isFav ? "text-yellow-500" : "text-slate-400 hover:text-yellow-500"
                    }`}
                  >
                    {isFav ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mt-3 leading-snug">
                  {article.title}
                </h3>
              </div>

              <div className="p-5">
                <p className={`text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                  {article.summary}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime} read
                  </div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : article.id)}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition ${article.color} hover:underline`}
                  >
                    {isExpanded ? "Close" : "Read More"}
                    <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-sm text-amber-700 dark:text-amber-300 text-center">
        These articles are for educational purposes only. TalkEasy does not diagnose mental illness or replace licensed professionals.
      </div>
    </div>
  );
}
