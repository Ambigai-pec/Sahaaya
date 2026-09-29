"""
Sahaaya Rule-Based Supportive Companion AI Engine
Provides supportive, non-diagnostic empathetic conversations, breathing exercises,
and safety escalation without requiring paid external APIs.
"""

DISCLAIMER = "\n\n(I provide general wellness support and am not a replacement for a doctor or mental health professional.)"

BREATHING_EXERCISE = """Let's do a 4-7-8 breathing exercise together 🌬️

• Step 1: Close your eyes and sit comfortably.
• Step 2: Breathe in quietly through your nose for 4 seconds.
• Step 3: Hold your breath for 7 seconds.
• Step 4: Exhale completely through your mouth for 8 seconds.

Repeat this cycle 3 times. This activates your body's natural relaxation response."""

RESPONSES = {
    "emergency": {
        "text": f"I hear you, and I am very concerned about what you've shared. 💙\n\nPlease reach out for professional help immediately. You don't have to carry this alone. Help is available right now at any time.",
        "suggestions": ["Emergency Support", "Call Caregiver"],
        "show_emergency": True
    },
    "greeting": {
        "text": f"Hello! I'm Sahaaya Companion — here to listen and support you. 🌿\n\nI can help you with:\n• Managing stress and anxiety\n• Breathing and relaxation exercises\n• Medication motivation\n• General wellness tips\n• A kind word when you need one\n\nWhat's on your mind today?{DISCLAIMER}",
        "suggestions": ["I feel stressed", "Help with medication", "Wellness tips", "I'm feeling lonely"],
        "show_emergency": False
    },
    "gratitude": {
        "text": f"You're very welcome! Remember, taking care of yourself is not selfish — it's necessary. 💙\n\nYou're doing a great job by being here and reaching out for support. I'm always here when you need me.{DISCLAIMER}",
        "suggestions": ["Thank you", "Check my medications", "Return home"],
        "show_emergency": False
    },
    "better": {
        "text": f"That's wonderful to hear! 😊 I'm glad you're feeling better.\n\nRemember, you can come back here anytime you need support. Taking a moment for yourself is always a good idea.\n\nIs there anything else I can assist with?{DISCLAIMER}",
        "suggestions": ["Check my medications", "Tell me a wellness tip", "No, thank you"],
        "show_emergency": False
    },
    "stress": {
        "text": f"I'm sorry you're feeling stressed. Stress can feel overwhelming, but you're not alone. 💙\n\nWould you like to try a short breathing exercise? It can help calm your nervous system in just a few minutes.{DISCLAIMER}",
        "suggestions": ["Try breathing exercise", "Tell me more", "Log mood"],
        "show_emergency": False
    },
    "anxiety": {
        "text": f"Anxiety can be really challenging. It's okay to feel this way — many people do. 🌿\n\nA few things that can help: slow breathing, grounding yourself in the present moment, or talking to someone you trust.\n\nWould you like to try a breathing exercise together?{DISCLAIMER}",
        "suggestions": ["Yes, breathing exercise", "Talk it through", "Contact caregiver"],
        "show_emergency": False
    },
    "breathing": {
        "text": f"{BREATHING_EXERCISE}{DISCLAIMER}",
        "suggestions": ["I feel better", "Still stressed", "Try again"],
        "show_emergency": False
    },
    "loneliness": {
        "text": f"It takes courage to share that you're feeling lonely. I'm glad you're here. 💙\n\nLoneliness can feel very heavy, especially when managing health challenges. You don't have to carry this alone.\n\nWould you like to talk about what's on your mind, or would you like to message your caregiver?{DISCLAIMER}",
        "suggestions": ["Let's talk", "Message caregiver", "Suggest an activity"],
        "show_emergency": False
    },
    "sadness": {
        "text": f"I'm sorry you're feeling down. It's okay to have days like this. 💙\n\nSometimes just acknowledging how we feel is the first step. You don't have to put on a brave face.\n\nWould you like to talk about what's making you feel low? Or would a calming activity help?{DISCLAIMER}",
        "suggestions": ["Let's talk", "Breathing exercise", "Contact caregiver"],
        "show_emergency": False
    },
    "medication": {
        "text": f"Taking medications consistently is so important for managing your health. 💊\n\nMissing doses can happen — life gets busy. What made it difficult today?\n\nI can help you think through strategies to stay on track.{DISCLAIMER}",
        "suggestions": ["I forgot", "Out of stock", "Check schedule"],
        "show_emergency": False
    },
    "forgot": {
        "text": f"It's easy to forget, especially with a busy routine. Here are a few helpful tips:\n\n• Set an alarm at the same time each day\n• Keep medications visible — next to breakfast or toothbrush\n• Use reminders in Sahaaya — we'll alert you at your scheduled time\n\nYour health is important, and small habits make a big difference!{DISCLAIMER}",
        "suggestions": ["Thanks for the tips", "Set a reminder", "Back to main"],
        "show_emergency": False
    },
    "sleep": {
        "text": f"Good sleep is essential for your overall health and medication effectiveness. 🌙\n\nSome gentle tips for restful sleep:\n• Avoid screens 30 mins before bed\n• Keep a consistent sleep schedule\n• Try the 4-7-8 breathing exercise to wind down\n• Keep your room quiet, dark, and cool\n\nWould you like to try the breathing exercise now?{DISCLAIMER}",
        "suggestions": ["Try breathing exercise", "Thank you", "Contact doctor"],
        "show_emergency": False
    },
    "wellness": {
        "text": f"It's great that you're taking proactive care of your wellness! 🌱\n\nHere is a simple wellness tip for today:\n• Stay hydrated: Drinking enough water helps your body process medications effectively and keeps energy levels up.\n\nWhat would you like to explore?{DISCLAIMER}",
        "suggestions": ["Stress management", "Sleep tips", "Medication tips", "Just chat"],
        "show_emergency": False
    }
}

def detect_intent(message: str) -> str:
    lower = message.lower()
    distress_keywords = ['suicid', 'kill', 'end my life', "can't go on", 'hopeless', 'worthless', 'want to die', 'hurt myself', 'end it']
    if any(k in lower for k in distress_keywords):
        return "emergency"
    if any(k in lower for k in ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening']):
        return "greeting"
    if any(k in lower for k in ['thanks', 'thank you', 'thx', 'tysm', 'grateful']):
        return "gratitude"
    if any(k in lower for k in ['feel better', 'better now', 'improved', 'helped']):
        return "better"
    if any(k in lower for k in ['stress', 'stressed', 'overwhelm', 'anxious', 'anxiety', 'panic', 'tense', 'worried']):
        return "stress"
    if any(k in lower for k in ['breath', 'breathe', 'breathing', '4-7-8', 'relax', 'calm']):
        return "breathing"
    if any(k in lower for k in ['lonely', 'alone', 'isolated', 'no one', 'nobody']):
        return "loneliness"
    if any(k in lower for k in ['sad', 'unhappy', 'depressed', 'low', 'down', 'miserable', 'cry']):
        return "sadness"
    if any(k in lower for k in ['medication', 'pill', 'dose', 'missed', 'medicine', 'tablet']):
        return "medication"
    if any(k in lower for k in ['forgot', 'forget', 'remember']):
        return "forgot"
    if any(k in lower for k in ['sleep', 'insomnia', 'tired', 'awake', 'rest']):
        return "sleep"
    return "wellness"

def get_response(message: str, context: dict = None) -> dict:
    if context is None:
        context = {}
    intent = detect_intent(message)
    res = RESPONSES.get(intent, RESPONSES["wellness"])
    return {
        "text": res["text"],
        "suggestions": res["suggestions"],
        "show_emergency": res["show_emergency"],
        "intent": intent
    }
