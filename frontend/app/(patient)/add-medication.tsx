import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useMedicationStore } from '../../store/medicationStore';
import AppShell from '../../components/AppShell';
import PrimaryButton from '../../components/PrimaryButton';

const FREQUENCIES = [
  { label: 'Once Daily', value: 'daily', times: 1 },
  { label: 'Twice Daily', value: 'twice', times: 2 },
  { label: 'Three Times', value: 'thrice', times: 3 },
];

const FOOD_OPTIONS = [
  { label: 'After Food', value: 'after', icon: 'checkmark-circle-outline' as const },
  { label: 'Before Food', value: 'before', icon: 'restaurant-outline' as const },
  { label: 'With Food', value: 'with', icon: 'nutrition-outline' as const },
];

export default function AddMedication() {
  const router = useRouter();
  const { addMedication } = useMedicationStore();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [tabletsPerDose, setTabletsPerDose] = useState('1');
  const [frequency, setFrequency] = useState('daily');
  const [times, setTimes] = useState(['08:00']);
  const [foodInstruction, setFoodInstruction] = useState('after');
  const [remainingTablets, setRemainingTablets] = useState('30');
  const [refillThreshold, setRefillThreshold] = useState('7');
  const [isSaving, setIsSaving] = useState(false);

  const handleFrequencyChange = (freq: string, count: number) => {
    setFrequency(freq);
    const defaultTimes = ['08:00', '14:00', '21:00'].slice(0, count);
    setTimes(defaultTimes);
  };

  const handleTimeChange = (index: number, value: string) => {
    const updated = [...times];
    updated[index] = value;
    setTimes(updated);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter the medication name.');
      return;
    }
    if (!dosage.trim()) {
      Alert.alert('Required', 'Please enter the dosage (e.g. 500mg).');
      return;
    }

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    addMedication({
      patientId: 'patient-1',
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      times,
      tabletsPerDose: parseInt(tabletsPerDose, 10) || 1,
      foodInstruction,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
    });

    setIsSaving(false);
    Alert.alert(
      '✅ Medication Registered',
      `${name} has been added to Radha's medication plan with initial inventory.`,
      [{ text: 'View Medications', onPress: () => router.replace('/(patient)/medications') }]
    );
  };

  return (
    <AppShell title="Register Medication" subtitle="Add prescribed prescription to active care plan">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Link */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={16} color={Colors.primary} />
          <Text style={styles.backText}>Back to Medications</Text>
        </TouchableOpacity>

        <View style={styles.formCard}>
          <Text style={styles.cardHeader}>Medication Details</Text>
          <Text style={styles.cardSub}>Enter exact clinical prescription parameters</Text>

          {/* Drug Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>MEDICINE NAME *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Metformin, Amlodipine"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* Dosage & Tablets */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: Spacing.sm }]}>
              <Text style={styles.label}>DOSAGE STRENGTH *</Text>
              <TextInput
                style={styles.input}
                value={dosage}
                onChangeText={setDosage}
                placeholder="e.g. 500mg, 5mg"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={[styles.fieldGroup, { width: 120 }]}>
              <Text style={styles.label}>TABLETS / DOSE</Text>
              <TextInput
                style={styles.input}
                value={tabletsPerDose}
                onChangeText={setTabletsPerDose}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          {/* Frequency selector */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>FREQUENCY</Text>
            <View style={styles.pillRow}>
              {FREQUENCIES.map((f) => (
                <TouchableOpacity
                  key={f.value}
                  style={[styles.pillBtn, frequency === f.value && styles.pillBtnActive]}
                  onPress={() => handleFrequencyChange(f.value, f.times)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, frequency === f.value && styles.pillTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Scheduled Times */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>SCHEDULED DOSE TIMES</Text>
            <View style={styles.timeInputsRow}>
              {times.map((t, idx) => (
                <View key={idx} style={styles.timeInputBox}>
                  <Text style={styles.timeLabel}>Dose {idx + 1}</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={t}
                    onChangeText={(val) => handleTimeChange(idx, val)}
                    placeholder="HH:MM"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Food Instruction */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>FOOD INSTRUCTION</Text>
            <View style={styles.pillRow}>
              {FOOD_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.pillBtn, foodInstruction === opt.value && styles.pillBtnActive]}
                  onPress={() => setFoodInstruction(opt.value)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={opt.icon}
                    size={14}
                    color={foodInstruction === opt.value ? Colors.primary : Colors.textMuted}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.pillText,
                      foodInstruction === opt.value && styles.pillTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stock inventory */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: Spacing.sm }]}>
              <Text style={styles.label}>AVAILABLE TABLETS</Text>
              <TextInput
                style={styles.input}
                value={remainingTablets}
                onChangeText={setRemainingTablets}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>REFILL THRESHOLD (DAYS)</Text>
              <TextInput
                style={styles.input}
                value={refillThreshold}
                onChangeText={setRefillThreshold}
                keyboardType="numeric"
                placeholder="7"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.btnRow}>
            <PrimaryButton
              title="Save Medication"
              icon="checkmark"
              onPress={handleSave}
              loading={isSaving}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  backText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 12,
  },
  formCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardHeader: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.text,
  },
  cardSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: Spacing.md,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    ...Typography.label,
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillBtnActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primaryMuted,
  },
  pillText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  pillTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  timeInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInputBox: {
    flex: 1,
  },
  timeLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 3,
  },
  timeInput: {
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  btnRow: {
    marginTop: Spacing.md,
  },
});
