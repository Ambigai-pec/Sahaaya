export interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative' | 'distress';
  score: number;
  detectedKeywords: string[];
}

const DISTRESS_KEYWORDS = ['suicidal', 'end my life', "can't go on", 'hopeless', 'worthless', 'want to die', 'no reason to live'];
const NEGATIVE_KEYWORDS = ['stressed', 'anxious', 'lonely', 'sad', 'depressed', 'overwhelmed', 'tired', 'exhausted', 'worried', 'afraid', 'scared', 'upset', 'angry', 'frustrated', 'terrible', 'awful', 'horrible', 'difficult', 'struggling', 'feeling bad'];
const POSITIVE_KEYWORDS = ['happy', 'good', 'great', 'wonderful', 'better', 'fine', 'joy', 'peaceful', 'calm', 'grateful', 'thankful', 'excited', 'hopeful', 'excellent', 'amazing'];

export function classifySentiment(text: string): SentimentResult {
  const lowerText = text.toLowerCase();
  const detectedKeywords: string[] = [];
  
  for (const word of DISTRESS_KEYWORDS) {
    if (lowerText.includes(word)) detectedKeywords.push(word);
  }
  if (detectedKeywords.length > 0) return { sentiment: 'distress', score: -1, detectedKeywords };
  
  for (const word of NEGATIVE_KEYWORDS) {
    if (lowerText.includes(word)) detectedKeywords.push(word);
  }
  if (detectedKeywords.length > 0) return { sentiment: 'negative', score: -0.5, detectedKeywords };
  
  for (const word of POSITIVE_KEYWORDS) {
    if (lowerText.includes(word)) detectedKeywords.push(word);
  }
  if (detectedKeywords.length > 0) return { sentiment: 'positive', score: 0.8, detectedKeywords };
  
  return { sentiment: 'neutral', score: 0, detectedKeywords };
}
