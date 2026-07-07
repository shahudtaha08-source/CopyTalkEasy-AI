import React from "react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="text-center py-20 px-6 bg-gradient-to-r from-teal-600 to-sky-700 text-white">
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl font-bold">TE</div>
        <h1 className="text-5xl font-bold mb-4">TalkEasy AI</h1>
        <p className="text-xl max-w-2xl mx-auto">A safer space to talk. Mental-wellness support, emotional reflection and healthier daily habits in one calm experience.</p>
        <div className="mt-8 flex justify-center gap-4"><a href="/api/login" className="bg-white text-sky-700 px-6 py-3 rounded-xl font-semibold shadow">Enter TalkEasy</a></div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Support designed around the person</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[['AI Support Chat','Supportive conversation that adapts to age group, language preference and emotional context without claiming to replace a psychologist.'],['Mood Tracking','Record emotional state and review how mood changes over time.'],['Habit Support','Build positive routines such as journaling, movement and reflection.'],['Emotional History','Review previous mood and emotion signals in one place.'],['Wellness Statistics','See simple patterns and progress across the wellness journey.'],['Adaptive Experience','The same simple TalkEasy interface gently adapts tone and visual comfort for Teen, Young Adult, Mid Age and Older users.']].map(([title, text]) => <div key={title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><h3 className="text-xl font-semibold mb-2">{title}</h3><p className="text-slate-600">{text}</p></div>)}
        </div>
      </section>

      <section className="py-20 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center"><p className="text-sm font-semibold tracking-[0.2em] text-teal-700 uppercase mb-3">Project Team</p><h2 className="text-3xl font-bold mb-10">Meet the Developers</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="rounded-3xl border border-teal-100 bg-teal-50/60 p-8"><div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold mb-5">TS</div><h3 className="text-2xl font-bold">Taha Shahud</h3><p className="text-teal-700 font-semibold mt-1">Creator & Lead Developer</p><p className="text-slate-600 mt-4">Student developer focused on building practical AI experiences around human wellbeing and accessible support.</p></div>
            <div className="rounded-3xl border border-sky-100 bg-sky-50/60 p-8"><div className="w-12 h-12 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold mb-5">PG</div><h3 className="text-2xl font-bold">Praneet Gholap</h3><p className="text-sky-700 font-semibold mt-1">Co-Developer</p><p className="text-slate-600 mt-4">Student developer contributing to the development and project delivery of the TalkEasy mental-wellness platform.</p></div>
          </div><p className="mt-8 text-slate-500">School of Engineering and Technology</p>
        </div>
      </section>
      <footer className="text-center py-6 bg-slate-100 text-slate-500">© {new Date().getFullYear()} TalkEasy AI · Developed by Taha Shahud & Praneet Gholap</footer>
    </div>
  );
}
