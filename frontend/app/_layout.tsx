import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useMedicationStore } from '../store/medicationStore';
import { useMoodStore } from '../store/moodStore';
import { useRiskStore } from '../store/riskStore';
import { useNotificationStore } from '../store/notificationStore';

export default function RootLayout() {
  const { loadDemoData: loadMed } = useMedicationStore();
  const { loadDemoData: loadMood } = useMoodStore();
  const { loadDemoData: loadRisk } = useRiskStore();
  const { loadDemoData: loadNotif } = useNotificationStore();

  useEffect(() => {
    // Always load demo data on startup for prototype demo purposes
    loadMed();
    loadMood();
    loadRisk();
    loadNotif();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
