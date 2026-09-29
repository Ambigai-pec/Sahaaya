import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useMedicationStore } from '../../store/medicationStore';
import AppShell from '../../components/AppShell';
import StockCard from '../../components/StockCard';
import SectionHeader from '../../components/SectionHeader';
import PrimaryButton from '../../components/PrimaryButton';

export default function Stock() {
  const { stocks, medications, updateStock } = useMedicationStore();
  const [selectedMed, setSelectedMed] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('30');
  const [modalVisible, setModalVisible] = useState(false);

  const getMedDosage = (medicationId: string) => {
    const med = medications.find((m) => m.id === medicationId);
    return med?.dosage || '';
  };

  const handleOpenRefill = (medicationId: string) => {
    setSelectedMed(medicationId);
    setModalVisible(true);
  };

  const handleConfirmRefill = () => {
    if (!selectedMed || !addAmount) return;
    const amount = parseInt(addAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid', 'Please enter a valid number of tablets.');
      return;
    }
    updateStock(selectedMed, amount);
    const stock = stocks.find((s) => s.medicationId === selectedMed);
    setModalVisible(false);
    setSelectedMed(null);
    setAddAmount('30');
    Alert.alert('✅ Inventory Updated', `${stock?.medicationName} received +${amount} tablets.`);
  };

  const needingRefillCount = stocks.filter((s) => s.needsRefill || s.daysRemaining <= 5).length;
  const minStock = stocks.length > 0 ? Math.min(...stocks.map((s) => s.daysRemaining)) : 0;

  return (
    <AppShell title="Medicine Stock" subtitle="Predictive Refill & Inventory Management">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Summary Card */}
        <View style={styles.kpiCard}>
          <View style={styles.kpiHeader}>
            <View>
              <Text style={styles.kpiTitle}>Stock Telemetry</Text>
              <Text style={styles.kpiSub}>Automated consumption and depletion forecasting</Text>
            </View>
            <View style={[styles.statusTag, needingRefillCount > 0 ? styles.statusTagWarn : styles.statusTagGood]}>
              <Ionicons
                name={needingRefillCount > 0 ? 'warning' : 'checkmark-circle'}
                size={12}
                color={needingRefillCount > 0 ? Colors.warning : Colors.success}
              />
              <Text style={[styles.statusTagText, { color: needingRefillCount > 0 ? Colors.warning : Colors.success }]}>
                {needingRefillCount > 0 ? `${needingRefillCount} REFILL NEEDED` : 'ALL ADEQUATE'}
              </Text>
            </View>
          </View>

          <View style={styles.kpiGrid}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiVal}>{stocks.length}</Text>
              <Text style={styles.kpiLbl}>Active Medicines</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.kpiBox}>
              <Text style={[styles.kpiVal, needingRefillCount > 0 && { color: Colors.warning }]}>
                {needingRefillCount}
              </Text>
              <Text style={styles.kpiLbl}>Refills Due Soon</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.kpiBox}>
              <Text style={[styles.kpiVal, minStock <= 5 && { color: Colors.warning }]}>
                {Math.floor(minStock)} d
              </Text>
              <Text style={styles.kpiLbl}>Minimum Days Left</Text>
            </View>
          </View>
        </View>

        {/* Predictive Formula Explanation */}
        <View style={styles.formulaCard}>
          <Ionicons name="calculator-outline" size={16} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.formulaTitle}>Predictive Refill Formula</Text>
            <Text style={styles.formulaText}>
              Days Remaining = Remaining Tablets ÷ Average Daily Prescribed Consumption. Alerts trigger at or below threshold.
            </Text>
          </View>
        </View>

        {/* Stock List */}
        <SectionHeader
          title="Medication Inventory"
          subtitle="Real-time tablet counts and consumption rates"
          icon="cube-outline"
        />

        {stocks.map((stock) => (
          <StockCard
            key={stock.medicationId}
            medicationName={stock.medicationName}
            dosage={getMedDosage(stock.medicationId)}
            remainingTablets={stock.remainingTablets}
            dailyConsumption={stock.dailyConsumption}
            daysRemaining={stock.daysRemaining}
            needsRefill={stock.needsRefill}
            refillThreshold={stock.refillThreshold}
            onRefill={() => handleOpenRefill(stock.medicationId)}
          />
        ))}

        {/* Refill Modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Ionicons name="add-circle" size={24} color={Colors.primary} />
                <Text style={styles.modalTitle}>Refill Medicine Inventory</Text>
              </View>

              <Text style={styles.modalSub}>
                Enter the number of tablets received from the pharmacy to update the clinical tracking system.
              </Text>

              <Text style={styles.modalLabel}>TABLETS RECEIVED</Text>
              <TextInput
                style={styles.modalInput}
                value={addAmount}
                onChangeText={setAddAmount}
                keyboardType="numeric"
                placeholder="e.g. 30"
                placeholderTextColor={Colors.textMuted}
              />

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={handleConfirmRefill}
                >
                  <Text style={styles.modalConfirmText}>Confirm Refill</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  kpiCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: Spacing.sm,
  },
  kpiTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.text,
  },
  kpiSub: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statusTagWarn: {
    backgroundColor: Colors.warningMuted,
  },
  statusTagGood: {
    backgroundColor: Colors.successMuted,
  },
  statusTagText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  kpiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  kpiBox: {
    flex: 1,
    alignItems: 'center',
  },
  kpiVal: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.text,
  },
  kpiLbl: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderLight,
  },
  formulaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.primarySurface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
    marginBottom: Spacing.md,
  },
  formulaTitle: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 12,
  },
  formulaText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    maxWidth: 420,
    width: '100%',
    ...Shadows.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  modalTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.text,
  },
  modalSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  modalLabel: {
    ...Typography.label,
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
  },
  modalCancelText: {
    ...Typography.buttonSmall,
    color: Colors.textSecondary,
  },
  modalConfirmBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.md,
  },
  modalConfirmText: {
    ...Typography.buttonSmall,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
