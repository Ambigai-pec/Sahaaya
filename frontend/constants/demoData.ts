export const DEMO_MEDICATIONS = [
  {
    id: 'med-1',
    patientId: 'patient-1',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'daily',
    times: ['08:00'],
    tabletsPerDose: 1,
    foodInstruction: 'after',
    startDate: '2024-09-01',
    isActive: true,
  },
  {
    id: 'med-2',
    patientId: 'patient-1',
    name: 'Amlodipine',
    dosage: '5 mg',
    frequency: 'daily',
    times: ['21:00'],
    tabletsPerDose: 1,
    foodInstruction: 'after',
    startDate: '2024-09-01',
    isActive: true,
  },
];

export const DEMO_STOCKS = [
  { medicationId: 'med-1', medicationName: 'Metformin', remainingTablets: 5, dailyConsumption: 1, refillThreshold: 7, daysRemaining: 5, needsRefill: true },
  { medicationId: 'med-2', medicationName: 'Amlodipine', remainingTablets: 18, dailyConsumption: 1, refillThreshold: 7, daysRemaining: 18, needsRefill: false },
];

export const DEMO_DOSES = []; // Add full doses later if needed

export const DEMO_MOOD_ENTRIES = [
  { id: '1', patientId: 'patient-1', moodScore: 6, moodLabel: 'Great', date: 'Mon', sentiment: 'positive', timestamp: '2024-09-22T10:00:00Z' },
  { id: '2', patientId: 'patient-1', moodScore: 5, moodLabel: 'Good', date: 'Tue', sentiment: 'positive', timestamp: '2024-09-23T10:00:00Z' },
  { id: '3', patientId: 'patient-1', moodScore: 3, moodLabel: 'Okay', date: 'Wed', sentiment: 'neutral', timestamp: '2024-09-24T10:00:00Z' },
  { id: '4', patientId: 'patient-1', moodScore: 2, moodLabel: 'Low', date: 'Thu', sentiment: 'negative', journalText: 'Feeling a bit tired today', timestamp: '2024-09-25T10:00:00Z' },
  { id: '5', patientId: 'patient-1', moodScore: 2, moodLabel: 'Low', date: 'Fri', sentiment: 'negative', journalText: 'Stressed and lonely, hard to concentrate', timestamp: '2024-09-26T10:00:00Z' },
  { id: '6', patientId: 'patient-1', moodScore: 4, moodLabel: 'Good', date: 'Sat', sentiment: 'positive', timestamp: '2024-09-27T10:00:00Z' },
];

export const DEMO_RISK = {
  id: 'risk-1',
  patientId: 'patient-1',
  supportPriority: 'moderate',
  medicationRisk: 2,
  moodRisk: 2,
  stockRisk: 2,
  totalScore: 6,
  factors: [
    '3 missed doses this week',
    'Mood has been low on 2 consecutive days (Thu-Fri)',
    'Metformin stock low — 5 days remaining',
  ],
  assessedAt: new Date().toISOString(),
};

export const DEMO_NOTIFICATIONS = [
  { id: 'notif-1', title: 'Missed Medication', body: 'You missed Metformin this morning. Please consult your prescription.', type: 'missed_dose', severity: 'warning', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-2', title: 'Refill Reminder', body: 'Metformin may run out in 5 days. Please arrange a refill.', type: 'refill', severity: 'warning', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-3', title: 'Caregiver Notified', body: 'Meena has been notified about your missed medications.', type: 'caregiver_alert', severity: 'info', isRead: true, createdAt: new Date().toISOString() },
  { id: 'notif-4', title: 'Wellness Check', body: 'How are you feeling today? Take a moment for your mood check-in.', type: 'wellness', severity: 'info', isRead: true, createdAt: new Date().toISOString() },
];
