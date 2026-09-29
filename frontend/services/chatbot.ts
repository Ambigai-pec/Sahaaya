export interface ChatResponse {
  text: string;
  suggestions: string[];
  showEmergency: boolean;
  intent: string;
}

const DISCLAIMER = "\n\n_I provide general wellness support and am not a replacement for a doctor or mental health professional._";

const BREATHING_EXERCISE = `Let's do a 4-7-8 breathing exercise together 🌬️

**Step 1:** Close your eyes and sit comfortably.
**Step 2:** Breathe in quietly through your nose for **4 seconds**.
**Step 3:** Hold your breath for **7 seconds**.
**Step 4:** Exhale completely through your mouth, making a whoosh sound, for **8 seconds**.

Repeat this cycle **3 times**. This activates your body's natural relaxation response.`;

const RESPONSES: Record<string, { text: string; suggestions: string[]; showEmergency?: boolean }> = {
  stress: {
    text: `I'm sorry you're feeling stressed. Stress can feel overwhelming, but you're not alone. 💙\n\nWould you like to try a short breathing exercise? It can help calm your nervous system in just a few minutes.${DISCLAIMER}`,
    suggestions: ['Try breathing exercise', 'Tell me more', 'Something else'],
  },
  anxiety: {
    text: `Anxiety can be really challenging. It's okay to feel this way — many people do. 🌿\n\nA few things that can help: slow breathing, grounding yourself in the present moment, or talking to someone you trust.\n\nWould you like to try a breathing exercise together?${DISCLAIMER}`,
    suggestions: ['Yes, breathing exercise', 'Talk it through', 'Contact someone'],
  },
  loneliness: {
    text: `It takes courage to share that you're feeling lonely. I'm glad you're here. 💙\n\nLoneliness can feel very heavy, especially when managing health challenges. You don't have to carry this alone.\n\nWould you like to talk about what's on your mind, or would a gentle activity suggestion help?${DISCLAIMER}`,
    suggestions: ["Let's talk", 'Suggest an activity', 'Call caregiver'],
  },
  breathing: {
    text: BREATHING_EXERCISE,
    suggestions: ['I feel better', 'Still stressed', 'Try again'],
  },
  better: {
    text: `That's wonderful to hear! 😊 I'm glad the exercise helped.\n\nRemember, you can come back here anytime you need support. Taking a moment for yourself is always a good idea.\n\nIs there anything else I can help with?${DISCLAIMER}`,
    suggestions: ['No, thank you', 'Check my medications', 'Tell me a wellness tip'],
  },
  medication: {
    text: `Taking medications consistently is so important for managing your health. 💊\n\nMissing doses can happen — life gets busy. What made it difficult today?\n\nI can help you think through strategies to stay on track.${DISCLAIMER}`,
    suggestions: ['I forgot', 'I feel fine without it', 'Out of stock', 'Side effects'],
  },
  forgot: {
    text: `It's easy to forget, especially with a busy routine. Here are a few tips:\n\n🕐 **Set an alarm** at the same time each day\n📍 **Keep medications visible** — next to your breakfast or toothbrush\n📱 **Use reminders** in Sahaaya — I'll alert you at your scheduled time\n\nYour health is important, and small habits make a big difference!${DISCLAIMER}`,
    suggestions: ['Thanks for the tips', 'Set a reminder', 'Back to main'],
  },
  sleep: {
    text: `Good sleep is so important for your overall health and medication effectiveness. 🌙\n\nSome gentle tips for better sleep:\n• Avoid screens 30 mins before bed\n• Keep a consistent sleep schedule\n• Try the 4-7-8 breathing exercise to wind down\n• Keep your room cool and dark\n\nWould you like to try the breathing exercise now?${DISCLAIMER}`,
    suggestions: ['Try breathing exercise', 'Thank you', 'Contact doctor'],
  },
  wellness: {
    text: `It's great that you're thinking about your wellness! 🌱\n\nHere's a simple wellness tip for today:\n\n**Stay hydrated!** Drinking enough water helps your body process medications effectively and keeps energy levels up. Aim for 6-8 glasses a day.\n\nIs there a specific area of wellness you'd like to focus on?${DISCLAIMER}`,
    suggestions: ['Stress management', 'Sleep tips', 'Medication tips', 'General advice'],
  },
  emergency: {
    text: `I hear you, and I'm very concerned about what you've shared. 💙\n\nPlease reach out for professional help immediately. You don't have to go through this alone.\n\nTalking to someone who can truly support you is the most important thing right now.`,
    suggestions: ['Emergency Support', 'Call caregiver'],
    showEmergency: true,
  },
  greeting: {
    text: `Hello! I'm Sahaaya Companion — here to listen and support you. 🌿\n\nI can help you with:\n• Managing stress and anxiety\n• Breathing and relaxation exercises\n• Medication motivation\n• General wellness tips\n• A kind word when you need one\n\nWhat's on your mind today?${DISCLAIMER}`,
    suggestions: ['I feel stressed', 'Help with medication', 'Wellness tips', "I'm feeling lonely"],
  },
  gratitude: {
    text: `You're welcome! Remember, taking care of yourself is not selfish — it's necessary. 💙\n\nYou're doing a great job by being here and reaching out for support. I'm always here when you need me.\n\nTake care of yourself, Radha!${DISCLAIMER}`,
    suggestions: ['Thank you', 'One more thing', 'Return home'],
  },
  sadness: {
    text: `I'm sorry you're feeling down. It's okay to have days like this. 💙\n\nSometimes just acknowledging how we feel is the first step. You don't have to put on a brave face.\n\nWould you like to talk about what's making you feel low? Or would a calming activity help?${DISCLAIMER}`,
    suggestions: ["Let's talk", 'Breathing exercise', 'Contact caregiver'],
  },
};

function detectIntent(message: string): string {
  const lower = message.toLowerCase();
  const distressKeywords = ['suicidal', 'end my life', "can't go on", 'hopeless', 'worthless', 'want to die', 'no reason', 'hurt myself'];
  if (distressKeywords.some(k => lower.includes(k))) return 'emergency';
  if (/\b(hello|hi|hey|good morning|namaste)\b/.test(lower)) return 'greeting';
  if (/\b(thanks|thank you|thx|tysm|wonderful|helped)\b/.test(lower)) return 'gratitude';
  if (/\b(better|feel better|improved)\b/.test(lower)) return 'better';
  if (/\b(stress|stressed|overwhelm|anxious|anxiety|panic|tense)\b/.test(lower)) return 'stress';
  if (/\b(breath|breathe|breathing|4-7-8|relax|calm)\b/.test(lower)) return 'breathing';
  if (/\b(lonely|alone|isolated|no one|nobody)\b/.test(lower)) return 'loneliness';
  if (/\b(sad|unhappy|depressed|low|down|miserable|cry)\b/.test(lower)) return 'sadness';
  if (/\b(medication|pill|dose|missed|medicine|tablet)\b/.test(lower)) return 'medication';
  if (/\b(forgot|forget|remember)\b/.test(lower)) return 'forgot';
  if (/\b(sleep|insomnia|tired|awake|rest)\b/.test(lower)) return 'sleep';
  if (/\b(wellness|healthy|tips|advice|help|support)\b/.test(lower)) return 'wellness';
  return 'wellness';
}

export function getChatResponse(message: string, sessionHistory: string[]): ChatResponse {
  const intent = detectIntent(message);
  const response = RESPONSES[intent] || RESPONSES.wellness;
  return {
    text: response.text,
    suggestions: response.suggestions,
    showEmergency: response.showEmergency || false,
    intent,
  };
}

export function getWelcomeMessage(): ChatResponse {
  return {
    text: RESPONSES.greeting.text,
    suggestions: RESPONSES.greeting.suggestions,
    showEmergency: false,
    intent: 'greeting',
  };
}
