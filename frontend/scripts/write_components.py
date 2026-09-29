import os

files = {
    "components/MedicationCard.tsx": """import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface Props {
  name: string;
  dosage: string;
  time: string;
  status: 'taken' | 'missed' | 'delayed' | 'pending';
  onMark?: (status: 'taken' | 'missed' | 'delayed') => void;
}

export default function MedicationCard({ name, dosage, time, status, onMark }: Props) {
  return (
    <View style={[styles.card, { borderLeftColor: Colors[status] || Colors.pending }]}>
      <View style={styles.header}>
        <Text style={Typography.heading3}>{name} {dosage}</Text>
        <Text style={Typography.bodySmall}>{time}</Text>
      </View>
      
      {onMark && status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.takenBtn]} onPress={() => onMark('taken')}>
            <Ionicons name="checkmark" size={20} color="white" />
            <Text style={styles.btnText}>Taken</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.delayedBtn]} onPress={() => onMark('delayed')}>
            <Ionicons name="time" size={20} color="white" />
            <Text style={styles.btnText}>Delayed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.missedBtn]} onPress={() => onMark('missed')}>
            <Ionicons name="close" size={20} color="white" />
            <Text style={styles.btnText}>Missed</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  btn: { flexDirection: 'row', alignItems: 'center', padding: Spacing.sm, borderRadius: BorderRadius.sm, flex: 1, justifyContent: 'center', marginHorizontal: 4 },
  takenBtn: { backgroundColor: Colors.taken },
  delayedBtn: { backgroundColor: Colors.delayed },
  missedBtn: { backgroundColor: Colors.missed },
  btnText: { color: 'white', marginLeft: 4, fontWeight: '600' },
});
""",

    "components/MoodButton.tsx": """import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface Props {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function MoodButton({ emoji, label, selected, onPress }: Props) {
  return (
    <TouchableOpacity 
      style={[styles.btn, selected && styles.selected]} 
      onPress={onPress}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    margin: Spacing.xs,
  },
  selected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  emoji: { fontSize: 32, marginBottom: Spacing.xs },
  label: { color: Colors.textSecondary, fontWeight: '500' },
  selectedLabel: { color: 'white' },
});
""",

    "components/RiskBadge.tsx": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

export default function RiskBadge({ level }: { level: 'low' | 'moderate' | 'high' }) {
  const color = Colors[level] || Colors.primary;
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{level.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  text: { fontSize: 12, fontWeight: '700' }
});
""",

    "components/ProgressRing.tsx": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../constants/theme';

export default function ProgressRing({ percentage, size = 100 }: { percentage: number, size?: number }) {
  const color = percentage > 80 ? Colors.success : percentage > 60 ? Colors.warning : Colors.error;
  
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size/2, borderColor: color }]}>
      <Text style={Typography.heading2}>{percentage}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
""",

    "components/AdherenceBar.tsx": """import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

export default function AdherenceBar({ percentage }: { percentage: number }) {
  const color = percentage >= 80 ? Colors.success : percentage >= 60 ? Colors.warning : Colors.error;
  return (
    <View style={styles.bg}>
      <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  );
}
const styles = StyleSheet.create({
  bg: { height: 8, backgroundColor: Colors.border, borderRadius: BorderRadius.full, overflow: 'hidden' },
  fill: { height: '100%' },
});
""",

    "components/ChatBubble.tsx": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../constants/theme';

export default function ChatBubble({ text, isUser }: { text: string, isUser: boolean }) {
  return (
    <View style={[styles.bubble, isUser ? styles.user : styles.bot]}>
      <Text style={[Typography.body, { color: isUser ? 'white' : Colors.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: '80%', padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm },
  user: { backgroundColor: Colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bot: { backgroundColor: Colors.surface, alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.border },
});
""",

    "components/NotificationItem.tsx": """import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

export default function NotificationItem({ notif, onPress }: { notif: any, onPress: () => void }) {
  const color = Colors[notif.severity] || Colors.primary;
  return (
    <TouchableOpacity style={[styles.container, !notif.isRead && styles.unread]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name="notifications" size={24} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={Typography.heading3}>{notif.title}</Text>
        <Text style={Typography.bodySmall}>{notif.body}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  unread: { backgroundColor: Colors.surfaceElevated },
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  content: { flex: 1 },
});
""",

    "components/AlertCard.tsx": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

export default function AlertCard({ title, description, severity }: { title: string, description: string, severity: 'info'|'warning'|'critical' }) {
  const color = Colors[severity] || Colors.primary;
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Ionicons name="warning" size={24} color={color} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={[Typography.heading3, { color }]}>{title}</Text>
        <Text style={Typography.bodySmall}>{description}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, borderLeftWidth: 4, marginBottom: Spacing.md, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  icon: { marginRight: Spacing.md },
  textContainer: { flex: 1 },
});
""",

    "components/StockCard.tsx": """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import AdherenceBar from './AdherenceBar';

export default function StockCard({ stock }: { stock: any }) {
  const progress = Math.min(100, (stock.remainingTablets / (stock.refillThreshold * 3)) * 100);
  return (
    <View style={styles.card}>
      <Text style={Typography.heading3}>{stock.medicationName}</Text>
      <Text style={Typography.bodySmall}>{stock.remainingTablets} tablets left ({stock.daysRemaining} days)</Text>
      <View style={styles.bar}>
        <AdherenceBar percentage={progress} />
      </View>
      {stock.needsRefill && <Text style={{ color: Colors.warning, fontWeight: 'bold' }}>Refill needed soon!</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.md, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  bar: { marginVertical: Spacing.sm },
});
""",

    "components/SectionHeader.tsx": """import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography, Colors, Spacing } from '../constants/theme';

export default function SectionHeader({ title, actionText, onAction }: { title: string, actionText?: string, onAction?: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={Typography.heading2}>{title}</Text>
      {actionText && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ color: Colors.primary, fontWeight: '600' }}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: Spacing.md },
});
""",

    "components/PrimaryButton.tsx": """import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../constants/theme';

export default function PrimaryButton({ title, onPress, type = 'primary' }: { title: string, onPress: () => void, type?: 'primary'|'secondary'|'danger' }) {
  let bgColor = Colors.primary;
  if (type === 'danger') bgColor = Colors.error;
  if (type === 'secondary') bgColor = Colors.secondary;

  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: bgColor }]} onPress={onPress}>
      <Text style={[Typography.button, { color: 'white' }]}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn: { padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', marginVertical: Spacing.sm },
});
"""
}

base_dir = r"C:\\Users\\User\\.gemini\\antigravity\\scratch\\sahaaya\\frontend"
for path, content in files.items():
    full_path = os.path.join(base_dir, path.replace('/', '\\'))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Components written")
