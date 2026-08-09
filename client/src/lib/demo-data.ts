import { format, subDays } from "date-fns";

const DEMO_USER_KEY = "talkeasy_demo_user";
const DEMO_MOODS_KEY = "talkeasy_demo_moods";
const DEMO_HABITS_KEY = "talkeasy_demo_habits";
const DEMO_JOURNALS_KEY = "talkeasy_demo_journals";
const DEMO_CHAT_KEY = "talkeasy_demo_chat";

export function isDemoMode(): boolean {
  return localStorage.getItem("talkeasy_demo_mode") === "true";
}

export function enableDemoMode() {
  localStorage.setItem("talkeasy_demo_mode", "true");
  initializeDemoData();
}

export function disableDemoMode() {
  localStorage.removeItem("talkeasy_demo_mode");
  localStorage.removeItem(DEMO_USER_KEY);
  localStorage.removeItem(DEMO_MOODS_KEY);
  localStorage.removeItem(DEMO_HABITS_KEY);
  localStorage.removeItem(DEMO_JOURNALS_KEY);
  localStorage.removeItem(DEMO_CHAT_KEY);
}

export function getDemoUser() {
  const defaultUser = {
    id: "demo-user-123",
    email: "demo.student@university.edu",
    firstName: "Demo",
    lastName: "User",
    profileImageUrl: null,
    ageGroup: "Young Adult",
    preferredLanguage: "English",
    emergencyContact: "+1 555-0199",
    city: "Boston",
    locality: "University District",
    budget: "Low",
    occupationType: "Student",
    theme: "light",
  };
  const val = localStorage.getItem(DEMO_USER_KEY);
  if (!val) {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  }
  return JSON.parse(val);
}

export function updateDemoUser(updates: any) {
  const user = { ...getDemoUser(), ...updates };
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
  return user;
}

export function initializeDemoData(force = false) {
  if (!force && localStorage.getItem(DEMO_MOODS_KEY)) return;

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const d1 = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const d2 = format(subDays(new Date(), 2), "yyyy-MM-dd");
  const d3 = format(subDays(new Date(), 3), "yyyy-MM-dd");
  const d4 = format(subDays(new Date(), 4), "yyyy-MM-dd");
  const d5 = format(subDays(new Date(), 5), "yyyy-MM-dd");

  const initialMoods = [
    { id: 1, mood: "stressed", notes: "Feeling anxious about the upcoming psychology final exam.", date: todayStr, createdAt: new Date().toISOString() },
    { id: 2, mood: "sad", notes: "Couldn't sleep well last night, feeling fatigued and sluggish.", date: d1, createdAt: subDays(new Date(), 1).toISOString() },
    { id: 3, mood: "anxious", notes: "Heart was racing during the review session. Too much information at once.", date: d2, createdAt: subDays(new Date(), 2).toISOString() },
    { id: 4, mood: "happy", notes: "Had a great study group session with friends. Very supportive.", date: d3, createdAt: subDays(new Date(), 3).toISOString() },
    { id: 5, mood: "stressed", notes: "Assignment deadline is approaching rapidly.", date: d4, createdAt: subDays(new Date(), 4).toISOString() },
    { id: 6, mood: "neutral", notes: "Just a regular day, nothing special.", date: d5, createdAt: subDays(new Date(), 5).toISOString() },
  ];
  localStorage.setItem(DEMO_MOODS_KEY, JSON.stringify(initialMoods));

  const initialJournals = [
    {
      id: 1,
      title: "Exam Preparation",
      content: "Starting to feel overwhelmed by the final exam tomorrow. Trying to structure my notes, but it's hard to focus. I need to make sure I get at least 7 hours of sleep tonight.",
      type: "reflection",
      tags: "exams, academic, stress",
      date: todayStr,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Study Group Support",
      content: "So thankful for the psychology study group. They helped clarify some difficult topics and made me feel much less alone in this pressure. Gratitude for good classmates.",
      type: "gratitude",
      tags: "support, friends, gratitude",
      date: d3,
      createdAt: subDays(new Date(), 3).toISOString(),
    },
    {
      id: 3,
      title: "Late Night Overthinking",
      content: "My mind was racing till 3 AM. I kept questioning if I'm doing enough or if I'm going to fail. Writing this down to release the tension. Tomorrow is a fresh start.",
      type: "free",
      tags: "sleep, overthinking, anxiety",
      date: d1,
      createdAt: subDays(new Date(), 1).toISOString(),
    },
  ];
  localStorage.setItem(DEMO_JOURNALS_KEY, JSON.stringify(initialJournals));

  // Habit templates for each day
  const initialHabits = [
    // Today
    { id: 1, type: "Sleep 7+ Hours", completed: false, notes: "Overslept slightly in afternoon, but had a bad night.", date: todayStr },
    { id: 2, type: "Stay Hydrated (2L)", completed: true, notes: "Bottles filled.", date: todayStr },
    { id: 3, type: "Physical Exercise", completed: false, notes: "No time due to exam prep.", date: todayStr },
    { id: 4, type: "Mindful Meditation", completed: true, notes: "Did 10 minutes.", date: todayStr },
    { id: 5, type: "Journal Entry", completed: true, notes: "Wrote reflections.", date: todayStr },

    // Yesterday (d1 - sad day)
    { id: 6, type: "Sleep 7+ Hours", completed: false, notes: "Only slept 4 hours.", date: d1 },
    { id: 7, type: "Stay Hydrated (2L)", completed: false, notes: "Forgot to drink water.", date: d1 },
    { id: 8, type: "Physical Exercise", completed: false, notes: "Too tired.", date: d1 },
    { id: 9, type: "Mindful Meditation", completed: false, notes: "", date: d1 },
    { id: 10, type: "Journal Entry", completed: true, notes: "Wrote down the anxiety.", date: d1 },

    // d2
    { id: 11, type: "Sleep 7+ Hours", completed: true, notes: "Slept 7.5 hours.", date: d2 },
    { id: 12, type: "Stay Hydrated (2L)", completed: true, notes: "", date: d2 },
    { id: 13, type: "Physical Exercise", completed: true, notes: "30 min walk.", date: d2 },
    { id: 14, type: "Mindful Meditation", completed: false, notes: "", date: d2 },
    { id: 15, type: "Journal Entry", completed: false, notes: "", date: d2 },
  ];
  localStorage.setItem(DEMO_HABITS_KEY, JSON.stringify(initialHabits));

  const initialChats = [
    {
      id: 1,
      title: "Coping with Exam Stress",
      createdAt: new Date().toISOString(),
      messages: [
        { id: 1, role: "user", content: "I have my finals tomorrow and my heart is beating so fast. I feel like I'm going to fail everything." },
        { id: 2, role: "assistant", content: "It's completely understandable to feel overwhelmed before a major exam. Your mind and body are reacting to the pressure. Let's take a slow breath together. Remember, this exam is a measure of a specific academic moment, not your entire worth. What is one small, manageable topic you feel comfortable reviewing right now, or would it help to step away for a glass of water?", detectedEmotion: "anxious", aiSuggestion: "Try a 4-7-8 breathing exercise." }
      ]
    }
  ];
  localStorage.setItem(DEMO_CHAT_KEY, JSON.stringify(initialChats));
}

// Getters & Setters
export function getDemoMoods() {
  return JSON.parse(localStorage.getItem(DEMO_MOODS_KEY) || "[]");
}

export function createDemoMood(mood: any) {
  const list = getDemoMoods();
  const newMood = {
    id: list.length + 1,
    mood: mood.mood,
    notes: mood.notes || "",
    date: mood.date || format(new Date(), "yyyy-MM-dd"),
    createdAt: new Date().toISOString()
  };
  list.unshift(newMood);
  localStorage.setItem(DEMO_MOODS_KEY, JSON.stringify(list));
  return newMood;
}

export function getDemoJournals() {
  return JSON.parse(localStorage.getItem(DEMO_JOURNALS_KEY) || "[]");
}

export function createDemoJournal(journal: any) {
  const list = getDemoJournals();
  const newJ = {
    id: list.length + 1,
    title: journal.title || "",
    content: journal.content,
    type: journal.type || "reflection",
    tags: journal.tags || "",
    date: journal.date || format(new Date(), "yyyy-MM-dd"),
    createdAt: new Date().toISOString()
  };
  list.unshift(newJ);
  localStorage.setItem(DEMO_JOURNALS_KEY, JSON.stringify(list));
  return newJ;
}

export function updateDemoJournal(id: number, updates: any) {
  const list = getDemoJournals();
  const idx = list.findIndex((j: any) => j.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(DEMO_JOURNALS_KEY, JSON.stringify(list));
    return list[idx];
  }
  return null;
}

export function deleteDemoJournal(id: number) {
  let list = getDemoJournals();
  list = list.filter((j: any) => j.id !== id);
  localStorage.setItem(DEMO_JOURNALS_KEY, JSON.stringify(list));
}

export function getDemoHabits(date?: string) {
  const list = JSON.parse(localStorage.getItem(DEMO_HABITS_KEY) || "[]");
  if (date) {
    return list.filter((h: any) => h.date === date);
  }
  return list;
}

export function createDemoHabit(habit: any) {
  const list = getDemoHabits();
  const newH = {
    id: list.length + 1,
    type: habit.type,
    completed: habit.completed || false,
    notes: habit.notes || "",
    date: habit.date || format(new Date(), "yyyy-MM-dd")
  };
  list.push(newH);
  localStorage.setItem(DEMO_HABITS_KEY, JSON.stringify(list));
  return newH;
}

export function updateDemoHabit(id: number, updates: any) {
  const list = JSON.parse(localStorage.getItem(DEMO_HABITS_KEY) || "[]");
  const idx = list.findIndex((h: any) => h.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(DEMO_HABITS_KEY, JSON.stringify(list));
    return list[idx];
  }
  return null;
}

export function getDemoConversations() {
  const chats = JSON.parse(localStorage.getItem(DEMO_CHAT_KEY) || "[]");
  return chats.map((c: any) => ({ id: c.id, title: c.title, createdAt: c.createdAt }));
}

export function getDemoConversationHistory(id: number) {
  const chats = JSON.parse(localStorage.getItem(DEMO_CHAT_KEY) || "[]");
  const chat = chats.find((c: any) => c.id === id);
  return chat ? chat.messages : [];
}

export function createDemoConversation(title: string) {
  const chats = JSON.parse(localStorage.getItem(DEMO_CHAT_KEY) || "[]");
  const newChat = {
    id: chats.length + 1,
    title,
    createdAt: new Date().toISOString(),
    messages: []
  };
  chats.unshift(newChat);
  localStorage.setItem(DEMO_CHAT_KEY, JSON.stringify(chats));
  return newChat;
}

export function addDemoMessage(convoId: number, role: "user" | "assistant", content: string, emotion?: string, suggestion?: string) {
  const chats = JSON.parse(localStorage.getItem(DEMO_CHAT_KEY) || "[]");
  const chatIdx = chats.findIndex((c: any) => c.id === convoId);
  if (chatIdx !== -1) {
    const messages = chats[chatIdx].messages;
    const newMsg = {
      id: messages.length + 1,
      role,
      content,
      detectedEmotion: emotion || null,
      aiSuggestion: suggestion || null,
      createdAt: new Date().toISOString()
    };
    messages.push(newMsg);
    localStorage.setItem(DEMO_CHAT_KEY, JSON.stringify(chats));
    return newMsg;
  }
  return null;
}

export function getDemoEmotionalHistory() {
  const moods = getDemoMoods();
  const journals = getDemoJournals();
  const chats = JSON.parse(localStorage.getItem(DEMO_CHAT_KEY) || "[]");
  
  const history: any[] = [];
  moods.forEach((m: any) => {
    history.push({ id: m.id, date: m.createdAt, type: "mood", value: m.mood, notes: m.notes });
  });
  
  journals.forEach((j: any) => {
    history.push({ id: j.id, date: j.createdAt, type: "journal", value: j.title || `Journal Entry`, notes: j.content, tags: j.tags });
  });

  chats.forEach((c: any) => {
    c.messages.forEach((m: any) => {
      if (m.role === "assistant" && m.detectedEmotion) {
        history.push({
          id: m.id,
          date: m.createdAt,
          type: "emotion",
          value: m.detectedEmotion,
          suggestion: m.aiSuggestion,
          notes: `Conversation topic: "${c.title}"`
        });
      }
    });
  });

  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
