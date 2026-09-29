import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import AppShell from '../../components/AppShell';
import PrimaryButton from '../../components/PrimaryButton';

const CONDITIONS = [
  'Type 2 Diabetes',
  'Hypertension',
  'Heart Disease',
  'Asthma',
  'Thyroid',
  'Arthritis',
  'COPD',
  'Kidney Disease',
];

export default function Onboarding() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || 'Radha');
  const [age, setAge] = useState('65');
  const [gender, setGender] = useState('Female');
  const [phone, setPhone] = useState('+91 99999 99998');
  const [emergencyContact, setEmergencyContact] = useState('+91 99999 99997');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['Type 2 Diabetes', 'Hypertension']);
  const [caregiverName, setCaregiverName] = useState('Meena');
  const [caregiverRelation, setCaregiverRelation] = useState('Daughter');
  const [caregiverPhone, setCaregiverPhone] = useState('+91 98765 43210');

  const toggleCondition = (c: string) => {
    setSelectedConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      Alert.alert(
        '✅ Profile Setup Complete',
        'Radha\'s clinical baseline has been updated. Next, review or add prescribed medications.',
        [{ text: 'Add Medications', onPress: () => router.replace('/(patient)/add-medication') }]
      );
    }
  };

  return (
    <AppShell title="Patient Setup" subtitle="Personalize Clinical Profile & Baseline">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Progress Tracker */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            {[
              { num: 1, label: 'Personal' },
              { num: 2, label: 'Conditions' },
              { num: 3, label: 'Caregiver' },
            ].map((s) => (
              <View key={s.num} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    s.num === step && styles.stepCircleActive,
                    s.num < step && styles.stepCircleDone,
                  ]}
                >
                  {s.num < step ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepNum,
                        (s.num === step || s.num < step) && styles.stepNumActive,
                      ]}
                    >
                      {s.num}
                    </Text>
                  )}
                </View>
                <Text style={[styles.stepLabel, s.num === step && styles.stepLabelActive]}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <View style={styles.formCard}>
            <Text style={styles.cardHeader}>Personal Information</Text>
            <Text style={styles.cardSub}>Elderly patient profile & contact details</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>FULL NAME *</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Patient Name" />
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, { flex: 1, marginRight: Spacing.sm }]}>
                <Text style={styles.label}>AGE *</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="65"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>GENDER</Text>
                <View style={styles.genderRow}>
                  {['Female', 'Male'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderChip, gender === g && styles.genderChipActive]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CONTACT TELEPHONE</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PRIMARY EMERGENCY CONTACT</Text>
              <TextInput
                style={styles.input}
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        )}

        {/* Step 2: Health Conditions */}
        {step === 2 && (
          <View style={styles.formCard}>
            <Text style={styles.cardHeader}>Chronic Health Conditions</Text>
            <Text style={styles.cardSub}>Select all conditions Radha currently manages</Text>

            <View style={styles.conditionsGrid}>
              {CONDITIONS.map((c) => {
                const isSelected = selectedConditions.includes(c);
                return (
                  <TouchableOpacity
                    key={c}
                    style={[styles.conditionSelectChip, isSelected && styles.conditionSelectChipActive]}
                    onPress={() => toggleCondition(c)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                      size={16}
                      color={isSelected ? Colors.primary : Colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.conditionSelectText,
                        isSelected && styles.conditionSelectTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Caregiver Details */}
        {step === 3 && (
          <View style={styles.formCard}>
            <Text style={styles.cardHeader}>Designated Family Caregiver</Text>
            <Text style={styles.cardSub}>Who should receive missed dose and high-priority escalation alerts?</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CAREGIVER FULL NAME *</Text>
              <TextInput style={styles.input} value={caregiverName} onChangeText={setCaregiverName} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>RELATIONSHIP TO PATIENT</Text>
              <TextInput style={styles.input} value={caregiverRelation} onChangeText={setCaregiverRelation} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CAREGIVER TELEPHONE *</Text>
              <TextInput
                style={styles.input}
                value={caregiverPhone}
                onChangeText={setCaregiverPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        )}

        {/* Navigation buttons */}
        <View style={styles.btnRow}>
          {step > 1 && (
            <PrimaryButton
              title="Previous"
              type="outline"
              onPress={() => setStep(step - 1)}
              style={{ flex: 1, marginRight: Spacing.sm }}
            />
          )}
          <PrimaryButton
            title={step === 3 ? 'Complete Setup' : 'Continue'}
            icon={step === 3 ? 'checkmark' : 'arrow-forward'}
            onPress={handleNext}
            style={{ flex: 1 }}
          />
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
  progressCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepCircleDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepNum: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  stepNumActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
  stepLabelActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
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
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genderChipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primaryMuted,
  },
  genderText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  genderTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionSelectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conditionSelectChipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primaryMuted,
  },
  conditionSelectText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  conditionSelectTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
});
