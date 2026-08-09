import { useState, useMemo } from "react";
import { useJournals, useCreateJournal, useUpdateJournal, useDeleteJournal } from "@/hooks/use-journals";
import { BookOpen, Plus, Tag, Search, Calendar as CalendarIcon, Pencil, Trash2, X, Check } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const TYPES = ["All", "reflection", "gratitude", "daily", "free"];
const TYPE_COLORS: Record<string, string> = {
  reflection: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  gratitude:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  daily:      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  free:       "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

const EMPTY_FORM = { title: "", content: "", tags: "", type: "reflection" };

export default function Journal() {
  const { toast } = useToast();
  const { data: journals = [], isLoading } = useJournals();
  const createMutation  = useCreateJournal();
  const updateMutation  = useUpdateJournal();
  const deleteMutation  = useDeleteJournal();

  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState<number | null>(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [search,     setSearch]     = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterTag,  setFilterTag]  = useState("");

  const charLimit = 2000;

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(j: any) {
    setEditId(j.id);
    setForm({ title: j.title || "", content: j.content, tags: j.tags || "", type: j.type || "reflection" });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  function handleSave() {
    if (!form.content.trim()) return toast({ title: "Content is required.", variant: "destructive" });

    if (editId !== null) {
      updateMutation.mutate({ id: editId, ...form }, {
        onSuccess: () => { toast({ title: "Entry updated." }); closeForm(); },
        onError: () => toast({ title: "Failed to update.", variant: "destructive" }),
      });
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/history/emotional"] });
          toast({ title: "Entry saved." });
          closeForm();
        },
        onError: () => toast({ title: "Failed to save.", variant: "destructive" }),
      });
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this entry?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast({ title: "Entry deleted." }),
      onError: () => toast({ title: "Failed to delete.", variant: "destructive" }),
    });
  }

  // All unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    journals.forEach((j: any) => j.tags?.split(",").forEach((t: string) => set.add(t.trim())));
    return Array.from(set).filter(Boolean);
  }, [journals]);

  // Filtered list
  const filtered = useMemo(() => {
    return journals.filter((j: any) => {
      if (filterType !== "All" && j.type !== filterType) return false;
      if (filterTag && !j.tags?.toLowerCase().includes(filterTag.toLowerCase())) return false;
      if (search) {
        const q = search.toLowerCase();
        return j.title?.toLowerCase().includes(q) || j.content?.toLowerCase().includes(q) || j.tags?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [journals, search, filterType, filterTag]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-teal-600" /> Journal
          </h1>
          <p className="text-muted-foreground mt-1 text-base">A private space to reflect, express gratitude, and write freely.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-teal-700 transition flex items-center gap-2 shadow-lg shadow-teal-600/20 text-sm"
        >
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </header>

      {/* Entry Form */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 border border-teal-200 dark:border-teal-900 bg-teal-50/30 dark:bg-teal-950/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">{editId ? "Edit Entry" : "New Journal Entry"}</h2>
            <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 transition"><X className="w-5 h-5" /></button>
          </div>

          <input
            type="text"
            placeholder="Title (optional)"
            className="w-full bg-transparent text-xl font-bold border-none outline-none mb-4 text-slate-900 dark:text-white placeholder:text-slate-400"
            value={form.title}
            onChange={set("title")}
          />

          <div className="relative mb-4">
            <textarea
              placeholder="Write your thoughts here…"
              className="w-full min-h-[160px] bg-white/60 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500 resize-none text-slate-800 dark:text-slate-200 text-sm"
              value={form.content}
              onChange={set("content")}
              maxLength={charLimit}
            />
            <span className={`absolute bottom-3 right-3 text-xs ${form.content.length > charLimit * 0.9 ? "text-orange-500" : "text-slate-400"}`}>
              {form.content.length} / {charLimit}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={form.type}
              onChange={set("type")}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="reflection">🪞 Reflection</option>
              <option value="gratitude">🙏 Gratitude</option>
              <option value="daily">📅 Daily Journal</option>
              <option value="free">✍️ Free Writing</option>
            </select>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
              <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Tags, comma separated"
                className="bg-transparent outline-none text-sm flex-1 min-w-0"
                value={form.tags}
                onChange={set("tags")}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="bg-teal-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2 text-sm ml-auto"
            >
              {isPending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              {editId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-sm flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search journals…"
            className="bg-transparent outline-none flex-1 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>}
        </div>

        <div className="flex gap-2 flex-wrap">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize transition ${
                filterType === t
                  ? "bg-teal-600 text-white"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {allTags.length > 0 && (
          <select
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 outline-none"
          >
            <option value="">All Tags</option>
            {allTags.map(t => <option key={t} value={t}>#{t}</option>)}
          </select>
        )}
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading journal entries…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
              {journals.length === 0 ? "No entries yet" : "No entries match your filters"}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {journals.length === 0 ? "Start writing your first journal entry." : "Try adjusting the search or filters."}
            </p>
            {journals.length === 0 && (
              <button onClick={openCreate} className="bg-teal-600 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-teal-700">
                Write Entry
              </button>
            )}
          </div>
        ) : (
          filtered.map((journal: any) => (
            <div key={journal.id} className="glass-card p-5 rounded-2xl hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl" />
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md capitalize ${TYPE_COLORS[journal.type] || "bg-slate-100 text-slate-600"}`}>
                      {journal.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {format(new Date(journal.createdAt), "MMM d, yyyy · h:mm a")}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                    {journal.title || <span className="text-slate-400 font-normal capitalize">{journal.type} Entry</span>}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap line-clamp-4">{journal.content}</p>
                  {journal.tags && (
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {journal.tags.split(",").filter(Boolean).map((tag: string, i: number) => (
                        <span key={i} className="text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-md">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(journal)}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition"
                    aria-label="Edit entry"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(journal.id)}
                    disabled={deleteMutation.isPending}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
