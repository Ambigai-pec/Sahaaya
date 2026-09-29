export interface RiskResult {
  supportPriority: 'low' | 'moderate' | 'high';
  medicationRisk: number;
  moodRisk: number;
  stockRisk: number;
  totalScore: number;
  factors: string[];
}

export function calculateRisk(params: {
  missedDosesWeek: number;
  delayedDosesWeek: number;
  adherencePct: number;
  moodScoresWeek: number[];
  minDaysRemainingStock: number;
  negativeMoodStreak: number;
}): RiskResult {
  let medRisk = 0;
  const factors: string[] = [];
  
  if (params.missedDosesWeek >= 5) { medRisk = 4; factors.push('5 or more missed doses this week'); }
  else if (params.missedDosesWeek >= 3) { medRisk = 2; factors.push(`${params.missedDosesWeek} missed doses this week`); }
  else if (params.missedDosesWeek >= 2) { medRisk = 1; factors.push(`${params.missedDosesWeek} missed doses this week`); }
  
  if (params.adherencePct < 70) { medRisk = Math.min(4, medRisk + 1); factors.push(`Medication adherence at ${params.adherencePct}%`); }
  if (params.delayedDosesWeek > 3) { medRisk = Math.min(4, medRisk + 1); factors.push(`${params.delayedDosesWeek} delayed doses this week`); }
  
  const avgMood = params.moodScoresWeek.length > 0 
    ? params.moodScoresWeek.reduce((a,b) => a+b, 0) / params.moodScoresWeek.length 
    : 4;
  let moodRisk = 0;
  
  if (avgMood < 2) { moodRisk = 3; factors.push('Average mood score is very low'); }
  else if (avgMood < 3) { moodRisk = 2; factors.push('Mood has been consistently low this week'); }
  else if (avgMood < 4) { moodRisk = 1; factors.push('Mood below average this week'); }
  
  if (params.negativeMoodStreak >= 2) { moodRisk = Math.min(4, moodRisk + 1); factors.push(`${params.negativeMoodStreak} consecutive low mood days`); }
  
  let stockRisk = 0;
  if (params.minDaysRemainingStock <= 2) { stockRisk = 3; factors.push('Medicine stock critically low (2 days or less)'); }
  else if (params.minDaysRemainingStock <= 4) { stockRisk = 2; factors.push(`Medicine running low (${Math.floor(params.minDaysRemainingStock)} days remaining)`); }
  else if (params.minDaysRemainingStock <= 7) { stockRisk = 1; factors.push(`Medicine stock getting low (${Math.floor(params.minDaysRemainingStock)} days remaining)`); }
  
  const totalScore = medRisk + moodRisk + stockRisk;
  let supportPriority: 'low' | 'moderate' | 'high';
  if (totalScore >= 7) supportPriority = 'high';
  else if (totalScore >= 4) supportPriority = 'moderate';
  else supportPriority = 'low';
  
  return { supportPriority, medicationRisk: medRisk, moodRisk, stockRisk, totalScore, factors };
}
