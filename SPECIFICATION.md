<USER_REQUEST>
Build a complete, functional mobile-first prototype called **“Sahaaya”**, an AI-driven health companion for medication adherence and mental well-being.

This is a **college hackathon/IEEE project prototype**, so the application must look like a polished real-world healthcare product, not a generic AI-generated dashboard.

## PROJECT TITLE

**Sahaaya: An AI-Driven Mobile Health Companion for Medication Adherence and Mental Well-Being**

## CORE PROBLEM

Existing medication reminder systems mainly provide basic notifications and do not provide intelligent, personalized support combining medication adherence, mental health monitoring, behavioral analysis, caregiver intervention, and emergency support.

## MAIN OBJECTIVE

Build a unified mobile application that:

1. Helps users take medications on time.
2. Tracks whether medications were taken, missed, or delayed.
3. Detects repeated missed-dose patterns.
4. Monitors daily mood and emotional well-being.
5. Provides supportive AI chatbot interaction.
6. Tracks medicine stock and predicts when refilling is needed.
7. Escalates alerts based on user behavior and risk.
8. Notifies caregivers when repeated or high-risk patterns occur.
9. Provides emergency/helpline support when serious emotional distress is detected.
10. Displays an understandable health dashboard.

---

# 1. TECHNOLOGY

Use a simple, reliable architecture suitable for a student prototype.

### Frontend

Use:

* React Native with Expo
* TypeScript
* React Navigation
* Clean mobile-first responsive UI

### Backend

Use:

* Python FastAPI

### Database

For the prototype, use:

* SQLite or local persistence

Structure the code so MongoDB/Firebase can be added later.

### AI

Do NOT depend on expensive APIs for the core functionality.

Implement:

* Rule-based medication adherence risk scoring
* Basic sentiment/mood classification
* Behavioral pattern analysis
* Adaptive alert escalation

If an external LLM API is used for the chatbot, create a fallback rule-based chatbot so the application still works without an API key.

---

# 2. DESIGN REQUIREMENTS

The UI should feel like a **modern healthcare application**.

Do NOT make it look like:

* a generic admin dashboard
* a cryptocurrency dashboard
* a basic CRUD project
* an AI-generated template

Use:

* clean white/light background
* subtle healthcare-oriented visual design
* rounded cards
* readable typography
* simple icons
* accessible buttons
* clear status indicators
* minimal animations
* professional spacing

The app must be comfortable for:

* elderly users
* chronic patients
* caregivers

Use large buttons and readable text.

The application name **SAHAAYA** should appear in the splash/login experience.

---

# 3. USER ROLES

Implement three roles:

### A. Patient

Can:

* manage medications
* receive reminders
* mark medicine Taken / Missed / Delayed
* track mood
* use AI companion
* view health dashboard
* view medicine stock
* access emergency support

### B. Caregiver

Can:

* view assigned patient
* see medication adherence
* see missed doses
* see risk status
* receive escalation alerts
* view mood trends
* see medicine stock status

### C. Admin/Demo

Can:

* view registered users
* view system activity
* monitor alerts
* view overall statistics

For the first prototype, authentication can use demo accounts instead of implementing a production authentication system.

---

# 4. REQUIRED APP PAGES

Create the following screens.

## Screen 1 — Splash Screen

Display:

SAHAAYA

“Your intelligent health companion”

Subtitle:

“Medication • Mind • Safety”

Then automatically navigate to login.

---

## Screen 2 — Login / Role Selection

Options:

* Patient
* Caregiver
* Admin

Provide demo login.

Example patient:

Name: Radha
Age: 65

Example caregiver:

Name: Meena
Relationship: Daughter

---

# PATIENT FLOW

## Screen 3 — Patient Onboarding

Collect:

* Name
* Age
* Gender
* Phone
* Emergency contact
* Existing health conditions
* Caregiver details

Then allow medication registration.

---

## Screen 4 — Medication Registration

Fields:

* Medicine name
* Dosage
* Number of tablets per dose
* Frequency
* Time
* Before/After food
* Starting date
* Number of tablets available
* Refill threshold

Example:

Metformin
500 mg
1 tablet
8:00 AM
After food
Stock: 20 tablets
Refill threshold: 5

Allow multiple medications.

---

# SCREEN 5 — PATIENT HOME DASHBOARD

Create a highly polished dashboard.

Show:

### Greeting

“Good Morning, Radha 👋”

### Today's medication

Example:

Metformin — 8:00 AM
Amlodipine — 9:00 PM

Status:

✓ Taken
⏰ Upcoming
⚠ Missed

### Adherence

“87% this week”

### Mental well-being

“Today's mood: 😊 Good”

### Medicine stock

“Metformin: 5 tablets left”

### Risk status

“Current support level: Low”

### Quick actions

* Medications
* Mood Check
* AI Companion
* Emergency

---

# SCREEN 6 — MEDICATIONS

Show all medicines as cards.

Each card should show:

Medicine name
Dosage
Timing
Food instruction
Today's status
Remaining stock

Buttons:

✓ Taken
✕ Missed
⏰ Delayed

When the user presses Taken:

* update dose history
* decrease stock
* update adherence
* reset relevant missed-dose counter

When Missed:

* record missed dose
* increase missed-dose counter
* trigger escalation logic

---

# SCREEN 7 — MEDICATION REMINDER

Create a reminder modal/screen.

Example:

💊 Medication Reminder

“It's time to take Metformin 500 mg.”

Buttons:

✓ Taken
⏰ Remind Me Later
✕ I Missed It

If the user does not respond, simulate reminder escalation.

---

# SCREEN 8 — MISSED DOSE ESCALATION

Implement this logic:

### Level 1

One missed dose:

“Looks like you missed your medication.
Please take it according to your prescription.”

### Level 2

Repeated missed doses:

“You have missed multiple scheduled doses recently.”

Provide:

* Take medication
* Contact caregiver
* Open AI Companion

### Level 3

Frequent/repeated missed doses:

“Your medication adherence pattern requires attention.”

Trigger caregiver alert.

Show:

“Caregiver notification sent.”

Do NOT claim this replaces medical professionals.

---

# SCREEN 9 — MEDICINE STOCK

Create stock management.

Display:

Medicine
Remaining tablets
Daily consumption
Estimated days remaining
Refill status

Example:

Metformin
5 tablets
1/day
5 days remaining
⚠ Refill soon

Automatically calculate:

days_remaining =
remaining_stock / average_daily_consumption

When stock reaches threshold:

“Your medication may run out soon.”

---

# SCREEN 10 — MOOD CHECK-IN

Create a simple daily mood interface.

Question:

“How are you feeling today?”

Options:

😊 Great
🙂 Good
😐 Okay
😔 Low
😟 Stressed
😭 Very Distressed

Optional journal:

“How was your day?”

Save:

* mood
* timestamp
* journal entry

Display previous mood history.

---

# SCREEN 11 — MENTAL WELL-BEING DASHBOARD

Display:

* weekly mood trend
* number of low-mood days
* stress pattern
* journal sentiment
* recent changes

Use simple charts.

Example:

Mon 😊
Tue 🙂
Wed 😐
Thu 😔
Fri 😔
Sat 🙂
Sun 😊

Do not diagnose medical conditions.

Use wording such as:

“Your recent entries suggest increased stress.”

NOT:

“You have depression.”

---

# SCREEN 12 — AI COMPANION

Create a conversational interface.

Name:

“Sahaaya Companion”

The chatbot should provide supportive responses for:

* stress
* loneliness
* medication motivation
* relaxation
* breathing exercises
* general wellness

Example:

User:
“I feel stressed today.”

Bot:
“I'm sorry you're having a difficult day. Would you like to try a short breathing exercise?”

Buttons:

“Breathing Exercise”
“Tell Me More”
“Contact Someone”

The chatbot must clearly state:

“I provide general wellness support and am not a replacement for a doctor or mental health professional.”

---

# SCREEN 13 — EMERGENCY SUPPORT

Create a clearly accessible emergency button.

Show:

“Need immediate help?”

Options:

* Call Emergency Services
* Contact Caregiver
* Mental Health Helpline
* Return to Companion

For prototype purposes, use clearly labelled demo helpline numbers and make it easy to replace them with verified local numbers before deployment.

If high-risk emotional language is detected, show a supportive safety screen rather than attempting diagnosis.

Example:

“You don't have to handle this alone.”

“Please consider contacting someone you trust or a professional support service.”

---

# SCREEN 14 — HEALTH DASHBOARD

Create detailed analytics.

Show:

### Medication

* Today's adherence
* Weekly adherence
* Monthly adherence
* Missed doses
* Delayed doses

### Mental well-being

* Mood trend
* Stress indicators
* Check-in frequency

### Medicine

* Current stock
* Medicines needing refill

### Risk

* Current support level
* Recent behavioral changes

Use simple charts and visual cards.

---

# CAREGIVER FLOW

## SCREEN 15 — CAREGIVER DASHBOARD

Show:

“Patients Requiring Attention”

Example:

Radha
Medication adherence: 68%
Mood: Low
Missed doses: 3
Medicine stock: 4 days
Risk: Moderate

Provide:

“View Patient”

---

# SCREEN 16 — PATIENT DETAIL

Show:

* Patient profile
* Conditions
* Medication schedule
* Adherence percentage
* Missed doses
* Mood trend
* Medicine stock
* Current support level

Use clear warning indicators.

---

# SCREEN 17 — CAREGIVER ALERTS

Create an alert center.

Examples:

⚠ Repeated missed medication
“Radha missed Metformin 2 times this week.”

⚠ Low medicine stock
“Metformin may run out in 4 days.”

⚠ Increased stress pattern
“Recent mood entries indicate increased stress.”

Each alert should show:

* severity
* timestamp
* patient
* reason
* recommended next action

---

# 5. AI / INTELLIGENCE ENGINE

Implement a transparent risk scoring system.

Inputs:

* missed doses
* delayed doses
* adherence percentage
* mood score
* negative sentiment
* repeated low mood
* medicine stock
* recent behavior

Example scoring:

Medication risk:
0–2 missed doses → low contribution
3–4 → moderate contribution
5+ → high contribution

Mood risk:
positive/neutral → low
repeated negative mood → moderate
strong distress indicators → high

Stock risk:

> 7 days → normal
> 4–7 days → warning
> ≤3 days → refill alert

Combine these into:

LOW
MODERATE
HIGH

Do NOT present this as a medical diagnosis.

Call it:

“Support Priority”

---

# 6. ADAPTIVE INTERVENTION ENGINE

Implement:

IF support priority = LOW:
normal reminders
wellness suggestions

IF support priority = MODERATE:
stronger reminders
AI companion suggestion
caregiver monitoring

IF support priority = HIGH:
supportive intervention
caregiver alert
emergency/support options where appropriate

Display WHY the system generated the alert.

Example:

“Moderate support priority because:
• 3 missed doses this week
• mood has been low for 2 consecutive days”

This explainability is important for the demo.

---

# 7. NOTIFICATION SIMULATION

Since this is a prototype, create an in-app notification center.

Show:

* medication reminder
* missed-dose alert
* refill reminder
* caregiver alert
* wellness reminder

If actual mobile push notifications are feasible, implement them; otherwise clearly simulate them within the application.

---

# 8. DEMO DATA

Preload realistic demo data so the application looks functional immediately.

Patient:

Radha
65
Female

Conditions:

Type 2 Diabetes
Hypertension

Medications:

Metformin 500 mg
Amlodipine 5 mg

Create historical medication data containing:

* taken doses
* missed doses
* delayed doses

Create 7 days of mood data.

Create several journal entries with different sentiment levels.

Create medicine stock values.

This allows the dashboard and AI risk engine to immediately show meaningful results.

---

# 9. DEMO SCENARIO

The application MUST support this demonstration:

1. Login as Radha.
2. Show today's medication.
3. Trigger a medication reminder.
4. Mark one dose as missed.
5. Show escalation.
6. Add another missed dose.
7. Show increased support priority.
8. Open mood check-in.
9. Enter:
   “I have been feeling stressed and lonely recently.”
10. Run sentiment analysis.
11. Show updated support priority.
12. Open AI Companion.
13. Ask for help with stress.
14. Show supportive response.
15. Open caregiver dashboard.
16. Show that Radha now requires attention.
17. Show the caregiver alert.
18. Open medicine stock.
19. Show refill prediction.
20. Return to health dashboard and show updated analytics.

The entire demo should work without requiring external services.

---

# 10. DATA MODELS

Create appropriate models for:

User
PatientProfile
Medication
MedicationDose
MoodEntry
JournalEntry
RiskAssessment
Caregiver
Notification
MedicineStock

Use proper relationships between these entities.

---

# 11. IMPORTANT SAFETY REQUIREMENTS

This is a healthcare prototype.

Do NOT:

* diagnose depression
* diagnose diseases
* recommend changing medication dosage
* recommend stopping medication
* claim medical accuracy
* claim the AI replaces doctors

Use language such as:

“support”
“monitor”
“identify patterns”
“wellness assistance”
“support priority”

rather than:

“diagnose”
“treat”
“medically confirm”

---

# 12. NOVELTY TO HIGHLIGHT

The prototype should visibly demonstrate these novel aspects:

### 1. Integrated physical + mental health

Medication adherence and mental well-being are monitored in one system.

### 2. Adaptive intervention

The system changes its response based on the user's behavior instead of sending identical reminders.

### 3. Behavioral risk assessment

Missed doses, mood patterns, sentiment, and stock status are combined to determine a support priority.

### 4. Caregiver escalation

Repeated adherence problems can automatically move from patient-level reminders to caregiver-level alerts.

### 5. Medicine stock prediction

The system estimates remaining medication days and generates refill alerts.

### 6. Explainable AI

Whenever a risk level changes, show the factors responsible.

---

# 13. UI QUALITY

Make the prototype look polished enough for:

* hackathon judging
* project demonstration
* IEEE project presentation
* college evaluation

Include:

* loading states
* empty states
* success messages
* confirmation dialogs
* error handling
* responsive layouts
* accessible font sizes
* consistent navigation
* bottom navigation for the patient app

Patient bottom navigation:

Home | Medications | Wellness | Companion | Profile

Caregiver navigation:

Overview | Patients | Alerts | Profile

---

# 14. DEVELOPMENT REQUIREMENTS

Before coding:

1. Create the complete project structure.
2. Explain the architecture briefly.
3. Create all required screens.
4. Implement navigation.
5. Implement database/local persistence.
6. Implement medication logic.
7. Implement adherence calculations.
8. Implement mood tracking.
9. Implement sentiment/risk logic.
10. Implement chatbot fallback.
11. Implement caregiver alerts.
12. Implement stock prediction.
13. Add demo data.
14. Test every user flow.
15. Fix runtime errors.
16. Ensure the application can be started with simple commands.

Do not leave placeholder pages such as:

“Coming Soon”
“TODO”
“Implement later”

All major features listed above should be functional in the prototype.

If a feature cannot be implemented fully, implement a realistic local simulation rather than leaving an empty screen.

## FINAL EXPECTATION

Build **Sahaaya as a complete working prototype**, not merely a UI mockup.

Prioritize:

1. Functional medication workflow
2. Adaptive escalation
3. Mental well-being monitoring
4. AI/support companion
5. Caregiver dashboard and alerts
6. Medicine stock prediction
7. Explainable risk assessment
8. Professional mobile UI

At the end, provide:

* project structure
* setup commands
* demo login credentials
* list of implemented features
* explanation of how the AI/risk engine works
* known limitations
* instructions for running the application locally.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-09-28T22:23:35+05:30.
</ADDITIONAL_METADATA>