def classify_sentiment(text: str) -> dict:
    text_lower = text.lower()
    
    DISTRESS_KEYWORDS = ['suicidal', 'end my life', "can't go on", 'hopeless', 'worthless', 'want to die']
    NEGATIVE_KEYWORDS = ['stressed', 'anxious', 'lonely', 'sad', 'depressed', 'overwhelmed', 'tired', 'exhausted', 'worried', 'afraid', 'scared', 'upset', 'angry', 'frustrated', 'bad', 'terrible', 'awful', 'horrible', 'difficult', 'hard']
    POSITIVE_KEYWORDS = ['happy', 'good', 'great', 'wonderful', 'better', 'fine', 'joy', 'peaceful', 'calm', 'grateful', 'thankful', 'excited', 'hopeful', 'positive', 'excellent']

    found_distress = [kw for kw in DISTRESS_KEYWORDS if kw in text_lower]
    if found_distress:
        return {'sentiment': 'distress', 'score': -1.0, 'keywords': found_distress}
        
    found_negative = [kw for kw in NEGATIVE_KEYWORDS if kw in text_lower]
    found_positive = [kw for kw in POSITIVE_KEYWORDS if kw in text_lower]
    
    if len(found_negative) > len(found_positive):
        return {'sentiment': 'negative', 'score': -0.5, 'keywords': found_negative}
    elif len(found_positive) > len(found_negative):
        return {'sentiment': 'positive', 'score': 0.5, 'keywords': found_positive}
    elif len(found_negative) > 0 and len(found_negative) == len(found_positive):
        return {'sentiment': 'neutral', 'score': 0.0, 'keywords': found_negative + found_positive}
        
    return {'sentiment': 'neutral', 'score': 0.0, 'keywords': []}
