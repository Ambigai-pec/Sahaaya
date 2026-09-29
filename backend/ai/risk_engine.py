def calculate_risk(missed_doses_week: int, delayed_doses_week: int, 
                   adherence_pct: float, mood_scores_week: list[int],
                   days_remaining_stock: float, negative_mood_streak: int) -> dict:
    factors = []
    medication_risk = 0
    if missed_doses_week == 2:
        medication_risk = 1
        factors.append(f"Missed {missed_doses_week} doses this week.")
    elif 3 <= missed_doses_week <= 4:
        medication_risk = 2
        factors.append(f"Missed {missed_doses_week} doses this week.")
    elif missed_doses_week >= 5:
        medication_risk = 4
        factors.append(f"High number of missed doses ({missed_doses_week}) this week.")

    if adherence_pct < 70.0:
        medication_risk = min(4, medication_risk + 1)
        factors.append(f"Adherence is low at {adherence_pct:.1f}%.")
        
    if delayed_doses_week > 3:
        medication_risk = min(4, medication_risk + 1)
        factors.append(f"Delayed {delayed_doses_week} doses this week.")

    mood_risk = 0
    if mood_scores_week:
        avg_mood = sum(mood_scores_week) / len(mood_scores_week)
        if 3.0 <= avg_mood < 4.0:
            mood_risk = 1
            factors.append(f"Average mood is somewhat low ({avg_mood:.1f}).")
        elif 2.0 <= avg_mood < 3.0:
            mood_risk = 2
            factors.append(f"Average mood is low ({avg_mood:.1f}).")
        elif avg_mood < 2.0:
            mood_risk = 3
            factors.append(f"Average mood is very low ({avg_mood:.1f}).")
            
    if negative_mood_streak >= 2:
        mood_risk = min(4, mood_risk + 1)
        factors.append(f"Consecutive low mood entries ({negative_mood_streak} days).")
        
    stock_risk = 0
    if days_remaining_stock <= 2:
        stock_risk = 3
        factors.append(f"Medicine stock is critically low ({days_remaining_stock:.1f} days remaining).")
    elif 2 < days_remaining_stock <= 4:
        stock_risk = 2
        factors.append(f"Medicine stock is very low ({days_remaining_stock:.1f} days remaining).")
    elif 4 < days_remaining_stock <= 7:
        stock_risk = 1
        factors.append(f"Medicine stock is low ({days_remaining_stock:.1f} days remaining).")
        
    total_score = medication_risk + mood_risk + stock_risk
    
    if total_score >= 7:
        support_priority = "high"
    elif total_score >= 4:
        support_priority = "moderate"
    else:
        support_priority = "low"
        
    if not factors:
        factors.append("No significant risk factors identified.")

    return {
        "support_priority": support_priority,
        "medication_risk": medication_risk,
        "mood_risk": mood_risk,
        "stock_risk": stock_risk,
        "total_score": total_score,
        "factors": factors
    }
