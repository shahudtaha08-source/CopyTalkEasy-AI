# TalkEasy AI - Psychology Department Handover

**Developed by:** Taha Shahud and Praneet Gholap  
**Institution:** School of Engineering and Technology

## Project explanation
TalkEasy AI is a mental-wellness support web application. It provides a simple interface for mood tracking, supportive habit tracking, emotional-history review, and AI-assisted supportive conversation. The goal is to reduce the friction a person may feel when trying to express distress and to encourage appropriate human or crisis support when danger is indicated.

## What the AI does
- Provides supportive, non-judgmental conversational responses.
- Detects a primary emotional tone for application-level tracking.
- Offers small practical self-care suggestions when appropriate.
- Uses the user's age group and preferred language as response context.
- Prioritizes emergency, crisis-line, and trusted-person escalation when a user indicates suicidal intent, a plan, immediate danger, or inability to remain safe.

## What the AI does not do
- It is not a psychologist, therapist, doctor, or emergency service.
- It does not diagnose mental-health conditions.
- It does not prescribe medication.
- It does not replace professional assessment or treatment.
- It should not present ordinary self-help as sufficient for imminent self-harm danger.

## Main modules
- Department demo access and user profile
- AI mental-wellness support chat
- Mood tracking
- Habit tracking
- Emotional history
- Statistics and pattern review
- Settings and language preference

## Technical overview
Frontend: React, Vite, TypeScript.  
Backend: Express and TypeScript.  
Database: PostgreSQL with Drizzle ORM.  
AI: OpenAI-compatible server API configuration.

## Environment requirements
`DATABASE_URL` is required for PostgreSQL. `OPENAI_API_KEY` is required only when AI chat is used. `OPENAI_MODEL` and `OPENAI_BASE_URL` are optional. Credentials must remain server-side and must not be committed to GitHub.

## Handover boundary
The current authentication flow is configured as a department demonstration mode for portability. Before any public production deployment, replace demo access with secure multi-user authentication, perform a privacy/security review, obtain psychology-domain review of crisis language and escalation flows, and define jurisdiction-specific crisis resources.

## Faculty questions and short answers
**Is TalkEasy a therapist?** No. It is a mental-wellness support companion and tracking interface.

**Can it diagnose depression or anxiety?** No. Emotion labels are application-level signals, not clinical diagnoses.

**What happens if suicide risk is expressed?** The AI instruction prioritizes immediate safety and connection to emergency/crisis support and a trusted person. The system must not treat routine self-help as sufficient for imminent danger.

**Why use AI?** To provide an accessible conversational interface, adapt language/context, and support reflection. Human professional support remains essential for clinical care and crisis response.

**Is it ready for public clinical use?** No. The present build is a department handover/demo build. Production use requires secure authentication, privacy review, clinical review, testing, and localized crisis escalation.

**What is the future scope?** Psychology-reviewed crisis protocols, secure multi-user identity, consent and data-retention controls, clinician-approved content, localized crisis resources, accessibility testing, and formal safety evaluation.
