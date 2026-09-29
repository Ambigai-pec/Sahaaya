export interface StockPrediction {
  daysRemaining: number;
  dailyConsumption: number;
  needsRefill: boolean;
  refillUrgency: 'ok' | 'soon' | 'urgent';
}

export function predictStock(remainingTablets: number, tabletsPerDose: number, frequency: string): StockPrediction {
  let dailyConsumption = tabletsPerDose;
  if (frequency === 'twice') dailyConsumption *= 2;
  else if (frequency === 'thrice') dailyConsumption *= 3;
  
  const daysRemaining = remainingTablets / dailyConsumption;
  const needsRefill = daysRemaining <= 7;
  
  let refillUrgency: 'ok' | 'soon' | 'urgent' = 'ok';
  if (daysRemaining <= 2) refillUrgency = 'urgent';
  else if (daysRemaining <= 7) refillUrgency = 'soon';
  
  return { daysRemaining, dailyConsumption, needsRefill, refillUrgency };
}
