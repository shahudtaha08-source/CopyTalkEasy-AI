import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";

type Message = { id?: number; role: "user" | "assistant"; content: string };

export default function Chatbot() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await fetch("/api/conversations").then(r => r.json());
        let conversation = Array.isArray(list) ? list[0] : null;
        if (!conversation) {
          const created = await fetch("/api/conversations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Support Chat" }) }).then(r => r.json());
          conversation = created;
        }
        setConversationId(conversation.id);
        const history = await fetch(`/api/conversations/${conversation.id}/messages`).then(r => r.json());
        if (Array.isArray(history)) setMessages(history.map((m: any) => ({ id: m.id, role: m.role, content: m.content })));
      } catch { setError("Could not start Support Chat."); }
    })();
  }, []);

  const send = async () => {
    if (!input.trim() || !conversationId || loading) return;
    const content = input.trim();
    setInput("");
    setError("");
    setMessages(prev => [...prev, { role: "user", content }]);
    setLoading(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Support Chat is unavailable");
      setMessages(prev => [...prev, { id: data.assistant.id, role: "assistant", content: data.assistant.content }]);
    } catch (err: any) {
      setError(err.message || "Support Chat is unavailable. Check Ollama.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"><MessageCircle className="w-6 h-6 text-blue-600" /></div>
        <div><h1 className="text-3xl font-display font-bold">Support Chat</h1><p className="text-sm text-muted-foreground">Powered locally by Ollama · CopyTalkEasy by Taha Shahud</p></div>
      </div>
      <div className="flex-1 overflow-y-auto rounded-3xl glass-card p-5 space-y-4">
        {messages.length === 0 && <div className="text-center text-muted-foreground py-16">Start a conversation. This is Support Chat, not a therapist or diagnostic service.</div>}
        {messages.map((message, index) => <div key={message.id || index} className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === "user" ? "ml-auto bg-blue-600 text-white" : "bg-muted text-foreground"}`}>{message.content}</div>)}
        {loading && <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted text-muted-foreground">Thinking…</div>}
      </div>
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      <div className="mt-4 flex gap-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Type what you want support with…" className="flex-1 rounded-xl border border-border bg-background px-4 py-3" />
        <button onClick={send} disabled={loading || !input.trim() || !conversationId} className="rounded-xl bg-blue-600 text-white px-5 disabled:opacity-50"><Send className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
