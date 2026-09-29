import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function CaregiverLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Overview' }} />
      <Tabs.Screen name="patient-detail" options={{ title: 'Patients' }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
