import os

files = {
    "app/_layout.tsx": """import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMedicationStore } from '../store/medicationStore';
import { useMoodStore } from '../store/moodStore';
import { useRiskStore } from '../store/riskStore';
import { useNotificationStore } from '../store/notificationStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const { loadDemoData: loadMed } = useMedicationStore();
  const { loadDemoData: loadMood } = useMoodStore();
  const { loadDemoData: loadRisk } = useRiskStore();
  const { loadDemoData: loadNotif } = useNotificationStore();

  useEffect(() => {
    const init = async () => {
      const initialized = await AsyncStorage.getItem('sahaaya_initialized');
      if (!initialized) {
        loadMed(); loadMood(); loadRisk(); loadNotif();
        await AsyncStorage.setItem('sahaaya_initialized', 'true');
      }
    };
    init();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
""",

    "app/index.tsx": """import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2500);
  }, []);

  return (
    <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.container}>
      <Text style={styles.title}>SAHAAYA</Text>
      <Text style={styles.subtitle}>Your intelligent health companion</Text>
      <Text style={styles.subtext}>Medication • Mind • Safety</Text>
      <Text style={styles.version}>v1.0.0</Text>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 48, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 18, color: 'white', opacity: 0.9, marginBottom: 5 },
  subtext: { fontSize: 14, color: 'white', opacity: 0.7 },
  version: { position: 'absolute', bottom: 40, color: 'white', opacity: 0.5 },
});
""",

    "app/(auth)/_layout.tsx": """import { Stack } from 'expo-router';
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
""",

    "app/(auth)/login.tsx": """import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const handleLogin = async (role: string, name: string, path: any) => {
    await login(name, role);
    router.replace(path);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.xl }}>
      <Text style={[Typography.heading1, { textAlign: 'center', marginBottom: Spacing.xl, marginTop: Spacing.xxl }]}>SAHAAYA</Text>
      
      <View style={styles.card}>
        <Text style={Typography.heading2}>Patient</Text>
        <Text style={Typography.body}>Radha, 65 — Managing Diabetes & Hypertension</Text>
        <PrimaryButton title={isLoading ? 'Loading...' : 'Demo Login as Radha'} onPress={() => handleLogin('patient', 'Radha', '/(patient)/home')} />
      </View>

      <View style={styles.card}>
        <Text style={Typography.heading2}>Caregiver</Text>
        <Text style={Typography.body}>Meena — Daughter & Primary Caregiver</Text>
        <PrimaryButton title="Demo Login as Meena" type="secondary" onPress={() => handleLogin('caregiver', 'Meena', '/(caregiver)/home')} />
      </View>

      <View style={styles.card}>
        <Text style={Typography.heading2}>Admin</Text>
        <Text style={Typography.body}>System Overview</Text>
        <PrimaryButton title="Demo Login as Admin" type="secondary" onPress={() => handleLogin('admin', 'Admin', '/(admin)/home')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 }
});
""",

    "app/(patient)/_layout.tsx": """import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

export default function PatientLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary, headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color}/> }} />
      <Tabs.Screen name="medications" options={{ title: 'Medications', tabBarIcon: ({color}) => <Ionicons name="medical" size={24} color={color}/> }} />
      <Tabs.Screen name="wellbeing" options={{ title: 'Wellness', tabBarIcon: ({color}) => <Ionicons name="heart" size={24} color={color}/> }} />
      <Tabs.Screen name="companion" options={{ title: 'Companion', tabBarIcon: ({color}) => <Ionicons name="chatbubbles" size={24} color={color}/> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color}/> }} />
      <Tabs.Screen name="add-medication" options={{ href: null }} />
      <Tabs.Screen name="reminder" options={{ href: null }} />
      <Tabs.Screen name="escalation" options={{ href: null }} />
      <Tabs.Screen name="stock" options={{ href: null }} />
      <Tabs.Screen name="mood" options={{ href: null }} />
      <Tabs.Screen name="emergency" options={{ href: null }} />
      <Tabs.Screen name="dashboard" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
    </Tabs>
  );
}
""",

    "app/(patient)/home.tsx": """import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useGreeting } from '../../hooks/useGreeting';
import { useAuthStore } from '../../store/authStore';
import { useMedicationStore } from '../../store/medicationStore';
import { useRiskStore } from '../../store/riskStore';
import MedicationCard from '../../components/MedicationCard';
import SectionHeader from '../../components/SectionHeader';
import RiskBadge from '../../components/RiskBadge';
import ProgressRing from '../../components/ProgressRing';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const greeting = useGreeting(user?.name || 'User');
  const { todayDoses, markDose, weeklyAdherence } = useMedicationStore();
  const { currentAssessment } = useRiskStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.xl }}>
      <View style={styles.header}>
        <Text style={Typography.heading1}>{greeting}</Text>
        <TouchableOpacity onPress={() => router.push('/(patient)/notifications')}>
          <Ionicons name="notifications-outline" size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={Typography.heading2}>Support Priority</Text>
            <Text style={Typography.bodySmall}>Based on recent activity</Text>
          </View>
          <RiskBadge level={currentAssessment?.supportPriority || 'low'} />
        </View>
      </View>

      <SectionHeader title="Today's Medications" actionText="View All" onAction={() => router.push('/(patient)/medications')} />
      {todayDoses.map(dose => (
        <MedicationCard 
          key={dose.id}
          name={dose.medicationName}
          dosage="dose"
          time={dose.scheduledTime}
          status={dose.status}
          onMark={(status) => markDose(dose.id, status)}
        />
      ))}

      <View style={styles.row}>
        <View style={[styles.card, { flex: 1, marginRight: Spacing.sm, alignItems: 'center' }]}>
          <Text style={Typography.heading3}>Adherence</Text>
          <ProgressRing percentage={weeklyAdherence} size={80} />
          <Text style={Typography.bodySmall}>This week</Text>
        </View>
        <View style={[styles.card, { flex: 1, marginLeft: Spacing.sm, justifyContent: 'center' }]}>
          <Text style={Typography.heading3}>Mood</Text>
          <Text style={Typography.bodySmall}>Not checked in yet</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(patient)/mood')}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Check In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SectionHeader title="Quick Actions" />
      <View style={styles.quickGrid}>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(patient)/stock')}>
          <Ionicons name="medical" size={32} color={Colors.primary} />
          <Text style={styles.quickText}>Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(patient)/dashboard')}>
          <Ionicons name="stats-chart" size={32} color={Colors.primary} />
          <Text style={styles.quickText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(patient)/companion')}>
          <Ionicons name="chatbubbles" size={32} color={Colors.primary} />
          <Text style={styles.quickText}>Companion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(patient)/emergency')}>
          <Ionicons name="shield" size={32} color={Colors.error} />
          <Text style={styles.quickText}>Emergency</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  card: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.md, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  row: { flexDirection: 'row' },
  btn: { backgroundColor: Colors.primary, padding: Spacing.sm, borderRadius: BorderRadius.sm, alignItems: 'center', marginTop: Spacing.sm },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickBtn: { width: '48%', backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.md, alignItems: 'center', marginBottom: Spacing.md, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  quickText: { marginTop: Spacing.sm, fontWeight: '600', color: Colors.text }
});
""",
    
    "app/(patient)/medications.tsx": """import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useMedicationStore } from '../../store/medicationStore';
import MedicationCard from '../../components/MedicationCard';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function Medications() {
  const { todayDoses, markDose } = useMedicationStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.xl }}>
      <Text style={Typography.heading1}>My Medications</Text>
      <View style={{ marginTop: Spacing.lg }}>
        {todayDoses.map(dose => (
          <MedicationCard 
            key={dose.id}
            name={dose.medicationName}
            dosage="dose"
            time={dose.scheduledTime}
            status={dose.status}
            onMark={(status) => markDose(dose.id, status)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: Colors.background } });
""",

    "app/(patient)/stock.tsx": """import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useMedicationStore } from '../../store/medicationStore';
import StockCard from '../../components/StockCard';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function Stock() {
  const { stocks } = useMedicationStore();
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.xl }}>
      <Text style={Typography.heading1}>Medicine Stock</Text>
      {stocks.map(stock => <StockCard key={stock.medicationId} stock={stock} />)}
    </ScrollView>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: Colors.background } });
""",

    "app/(patient)/mood.tsx": """import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useMoodStore } from '../../store/moodStore';
import MoodButton from '../../components/MoodButton';
import PrimaryButton from '../../components/PrimaryButton';
import { classifySentiment } from '../../services/sentimentEngine';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function Mood() {
  const router = useRouter();
  const { addEntry } = useMoodStore();
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [journal, setJournal] = useState('');

  const moods = [
    { score: 6, label: 'Great', emoji: '😊' },
    { score: 5, label: 'Good', emoji: '🙂' },
    { score: 4, label: 'Okay', emoji: '😐' },
    { score: 3, label: 'Stressed', emoji: '😟' },
    { score: 2, label: 'Low', emoji: '😔' },
    { score: 1, label: 'Distressed', emoji: '😭' },
  ];

  const handleSave = () => {
    if (!selectedScore) return;
    const m = moods.find(x => x.score === selectedScore);
    const sentiment = classifySentiment(journal).sentiment;
    
    addEntry({
      patientId: 'patient-1',
      moodScore: selectedScore,
      moodLabel: m?.label || 'Okay',
      journalText: journal,
      sentiment,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    });

    if (sentiment === 'distress' || selectedScore === 1) {
      router.replace('/(patient)/emergency');
    } else {
      router.back();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.xl }}>
      <Text style={Typography.heading1}>How are you feeling?</Text>
      <View style={styles.grid}>
        {moods.map(m => (
          <View key={m.score} style={{ width: '33%' }}>
            <MoodButton emoji={m.emoji} label={m.label} selected={selectedScore === m.score} onPress={() => setSelectedScore(m.score)} />
          </View>
        ))}
      </View>
      <Text style={[Typography.heading3, { marginTop: Spacing.lg }]}>Journal (Optional)</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="How was your day?"
        value={journal}
        onChangeText={setJournal}
      />
      <PrimaryButton title="Save Check-in" onPress={handleSave} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.md },
  input: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, marginVertical: Spacing.md, height: 100, textAlignVertical: 'top' }
});
""",

    "app/(patient)/wellbeing.tsx": """import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useMoodStore } from '../../store/moodStore';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function Wellbeing() {
  const { weekEntries } = useMoodStore();
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.xl }}>
      <Text style={Typography.heading1}>Mental Well-being</Text>
      <View style={styles.card}>
        <Text style={Typography.heading3}>Recent Mood</Text>
        {weekEntries.map((entry, i) => (
          <View key={i} style={styles.row}>
            <Text style={Typography.body}>{entry.date}: {entry.moodLabel}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, marginTop: Spacing.md },
  row: { paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border }
});
""",

    "app/(patient)/companion.tsx": """import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getChatResponse } from '../../services/chatbot';
import ChatBubble from '../../components/ChatBubble';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function Companion() {
  const router = useRouter();
  const [messages, setMessages] = useState([{ text: "Hi, I'm Sahaaya Companion. How can I help you today?", isUser: false }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsgs = [...messages, { text: input, isUser: true }];
    setMessages(newMsgs);
    setInput('');
    
    setTimeout(() => {
      const response = getChatResponse(input, []);
      setMessages([...newMsgs, { text: response.text, isUser: false }]);
      if (response.showEmergency) {
        setTimeout(() => router.push('/(patient)/emergency'), 1000);
      }
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={Typography.heading2}>Sahaaya Companion 🧡</Text>
      </View>
      <ScrollView style={styles.chatArea} contentContainerStyle={{ padding: Spacing.md }}>
        {messages.map((msg, i) => <ChatBubble key={i} text={msg.text} isUser={msg.isUser} />)}
      </ScrollView>
      <View style={styles.inputArea}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Type a message..." onSubmitEditing={handleSend} />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.md, paddingTop: Spacing.xl, backgroundColor: Colors.surface, borderBottomWidth: 1, borderColor: Colors.border },
  chatArea: { flex: 1 },
  inputArea: { flexDirection: 'row', padding: Spacing.md, backgroundColor: Colors.surface, borderTopWidth: 1, borderColor: Colors.border },
  input: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border },
  sendBtn: { backgroundColor: Colors.primary, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: Spacing.sm }
});
""",

    "app/(patient)/emergency.tsx": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function Emergency() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={[Typography.heading1, { color: Colors.error, marginBottom: Spacing.md }]}>Need Support?</Text>
      <Text style={[Typography.body, { marginBottom: Spacing.xl }]}>You don’t have to handle this alone. Please reach out to one of the following:</Text>
      
      <PrimaryButton type="danger" title="📡 Call Emergency (112)" onPress={() => {}} />
      <PrimaryButton type="secondary" title="👩 Contact Caregiver (Meena)" onPress={() => {}} />
      <PrimaryButton type="primary" title="🗨 Mental Health Helpline" onPress={() => {}} />
      <PrimaryButton type="primary" title="Return to Dashboard" onPress={() => router.back()} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceElevated, padding: Spacing.lg, paddingTop: Spacing.xxl }
});
""",

    "app/(patient)/dashboard.tsx": """import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useMedicationStore } from '../../store/medicationStore';
import { useRiskStore } from '../../store/riskStore';
import ProgressRing from '../../components/ProgressRing';

export default function Dashboard() {
  const { weeklyAdherence } = useMedicationStore();
  const { currentAssessment } = useRiskStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.xl }}>
      <Text style={Typography.heading1}>Health Dashboard</Text>
      <View style={styles.card}>
        <Text style={Typography.heading3}>Medication Adherence</Text>
        <View style={{ alignItems: 'center', marginTop: Spacing.md }}>
          <ProgressRing percentage={weeklyAdherence} size={120} />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={Typography.heading3}>Risk Assessment</Text>
        <Text style={Typography.body}>Priority: {currentAssessment?.supportPriority}</Text>
        {currentAssessment?.factors.map((f, i) => <Text key={i} style={Typography.bodySmall}>• {f}</Text>)}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, marginTop: Spacing.md }
});
""",

    "app/(patient)/notifications.tsx": """import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useNotificationStore } from '../../store/notificationStore';
import NotificationItem from '../../components/NotificationItem';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function Notifications() {
  const { notifications, markRead } = useNotificationStore();
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: Spacing.xl }}>
      <Text style={[Typography.heading1, { paddingHorizontal: Spacing.md, marginBottom: Spacing.md }]}>Notifications</Text>
      {notifications.map(n => <NotificationItem key={n.id} notif={n} onPress={() => markRead(n.id)} />)}
    </ScrollView>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: Colors.background } });
""",

    "app/(patient)/profile.tsx": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={Typography.heading1}>Profile</Text>
      <View style={styles.card}>
        <Text style={Typography.heading3}>{user?.name}</Text>
        <Text style={Typography.body}>Patient</Text>
      </View>
      <PrimaryButton title="Logout" type="danger" onPress={handleLogout} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md, paddingTop: Spacing.xl },
  card: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg }
});
""",

    "app/(patient)/add-medication.tsx": """import React from 'react';
import { View, Text } from 'react-native';
export default function AddMedication() { return <View><Text>Add Medication</Text></View>; }
""",
    "app/(patient)/reminder.tsx": """import React from 'react';
import { View, Text } from 'react-native';
export default function Reminder() { return <View><Text>Reminder</Text></View>; }
""",
    "app/(patient)/escalation.tsx": """import React from 'react';
import { View, Text } from 'react-native';
export default function Escalation() { return <View><Text>Escalation</Text></View>; }
""",
    "app/(patient)/onboarding.tsx": """import React from 'react';
import { View, Text } from 'react-native';
export default function Onboarding() { return <View><Text>Onboarding</Text></View>; }
""",

    "app/(caregiver)/_layout.tsx": """import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

export default function CaregiverLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary, headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: 'Overview', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color}/> }} />
      <Tabs.Screen name="patient-detail" options={{ title: 'Patients', tabBarIcon: ({color}) => <Ionicons name="people" size={24} color={color}/> }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: ({color}) => <Ionicons name="warning" size={24} color={color}/> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color}/> }} />
    </Tabs>
  );
}
""",

    "app/(caregiver)/home.tsx": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function CaregiverHome() {
  return (
    <View style={styles.container}>
      <Text style={Typography.heading1}>Hello, Meena 👋</Text>
      <Text style={Typography.body}>Caregiving for Radha</Text>
      
      <View style={styles.card}>
        <Text style={Typography.heading3}>Radha</Text>
        <Text style={Typography.body}>Adherence: 71%</Text>
        <Text style={Typography.body}>Support Priority: Moderate</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md, paddingTop: Spacing.xl },
  card: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.lg, marginTop: Spacing.lg }
});
""",

    "app/(caregiver)/patient-detail.tsx": """import React from 'react';
import { View, Text } from 'react-native';
export default function PatientDetail() { return <View><Text>Patient Detail</Text></View>; }
""",

    "app/(caregiver)/alerts.tsx": """import React from 'react';
import { View, Text } from 'react-native';
export default function Alerts() { return <View><Text>Alerts</Text></View>; }
""",

    "app/(caregiver)/profile.tsx": """import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
export default function CaregiverProfile() {
  const { logout } = useAuthStore();
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile</Text>
      <Button title="Logout" onPress={() => { logout(); router.replace('/(auth)/login'); }} />
    </View>
  );
}
""",

    "app/(admin)/_layout.tsx": """import { Stack } from 'expo-router';
export default function AdminLayout() { return <Stack screenOptions={{ headerShown: false }} />; }
""",

    "app/(admin)/home.tsx": """import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
export default function AdminHome() {
  const { logout } = useAuthStore();
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Admin Dashboard</Text>
      <Button title="Logout" onPress={() => { logout(); router.replace('/(auth)/login'); }} />
    </View>
  );
}
"""
}

base_dir = r"C:\\Users\\User\\.gemini\\antigravity\\scratch\\sahaaya\\frontend"
for path, content in files.items():
    full_path = os.path.join(base_dir, path.replace('/', '\\'))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("App files written")
