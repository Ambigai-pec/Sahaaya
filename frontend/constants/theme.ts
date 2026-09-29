/**
 * Sahaaya Healthcare Design System
 * 
 * Brand Personality:
 * CALM, TRUSTWORTHY, WARM, HUMAN, PREMIUM, ACCESSIBLE, HEALTHCARE-FOCUSED
 * 
 * Designed specifically for chronic care patients, elderly accessibility, and caregivers.
 */

export const Colors = {
  // Primary brand palette (Deep Medical Teal - calm, trustworthy, professional)
  primary: '#0D7276',
  primaryDark: '#0A5558',
  primaryLight: '#14989E',
  primaryMuted: '#E6F3F4',
  primarySurface: '#F0F8F8',

  // Secondary brand palette (Clinical Sky / Serene Blue)
  secondary: '#1E6F9F',
  secondaryDark: '#144B6B',
  secondaryLight: '#3B93C7',
  secondaryMuted: '#EBF4FA',

  // Warm accent palette (Human warmth & supportive alerts)
  accent: '#D97706',
  accentLight: '#FDE68A',
  accentMuted: '#FEF3C7',

  // Neutral background & surface palette (Soft, pristine, warm off-white)
  background: '#F8FAFC',
  backgroundSubtle: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F8FAFC',
  
  // Borders & Dividers (subtle, crisp, non-distracting)
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  borderLight: '#F1F5F9',

  // Text & Typography hierarchy (Deep Slate for maximum contrast and elderly legibility)
  text: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',

  // Status & Clinical semantics
  success: '#059669',
  successMuted: '#ECFDF5',
  successSurface: '#ECFDF5',
  successBorder: '#A7F3D0',
  clinicalBlue: '#1E6F9F',
  borderTeal: '#C8E6E7',

  warning: '#D97706',
  warningMuted: '#FFFBEB',
  warningBorder: '#FDE68A',

  error: '#DC2626',
  errorMuted: '#FEF2F2',
  errorBorder: '#FECACA',

  critical: '#B91C1C',
  criticalMuted: '#FFF1F2',

  info: '#2563EB',
  infoMuted: '#EFF6FF',
  infoBorder: '#BFDBFE',

  // Support Priority System
  priorityLow: '#059669',
  priorityLowBg: '#ECFDF5',
  priorityLowBorder: '#A7F3D0',

  priorityModerate: '#D97706',
  priorityModerateBg: '#FFFBEB',
  priorityModerateBorder: '#FDE68A',

  priorityHigh: '#DC2626',
  priorityHighBg: '#FEF2F2',
  priorityHighBorder: '#FECACA',

  // Medication status tokens
  taken: '#059669',
  takenBg: '#ECFDF5',
  takenBorder: '#A7F3D0',

  missed: '#DC2626',
  missedBg: '#FEF2F2',
  missedBorder: '#FECACA',

  delayed: '#D97706',
  delayedBg: '#FFFBEB',
  delayedBorder: '#FDE68A',

  pending: '#64748B',
  pendingBg: '#F1F5F9',
  pendingBorder: '#E2E8F0',

  // Component specific
  low: '#059669',
  moderate: '#D97706',
  high: '#DC2626',
};

export const Typography = {
  heading1: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  heading3: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: Colors.text,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.6,
  },
  button: {
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  buttonSmall: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textMuted,
    lineHeight: 15,
  },
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};

export const Shadows = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
};
