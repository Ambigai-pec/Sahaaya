import { Colors } from '../constants/theme';

export function useRiskColor(priority: string) {
  switch (priority) {
    case 'high': return Colors.high;
    case 'moderate': return Colors.moderate;
    case 'low': return Colors.low;
    default: return Colors.primary;
  }
}
