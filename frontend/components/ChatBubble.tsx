import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../constants/theme';

interface Props {
  text: string;
  isUser: boolean;
  time?: string;
  suggestions?: string[];
  onSelectSuggestion?: (sug: string) => void;
  showEmergency?: boolean;
  onEmergencyPress?: () => void;
}

export default function ChatBubble({
  text,
  isUser,
  time,
  suggestions,
  onSelectSuggestion,
  showEmergency,
  onEmergencyPress,
}: Props) {
  // Format markdown bold (**bold**) and italics (_italic_)
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      const isItalic = line.startsWith('_') && line.endsWith('_');
      const cleanLine = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/_(.+)_/g, '$1');

      return (
        <Text
          key={idx}
          style={[
            styles.text,
            isUser ? styles.userText : styles.botText,
            isItalic && styles.italicDisclaimer,
            line.includes('**') && styles.boldText,
          ]}
        >
          {cleanLine}
          {idx < lines.length - 1 ? '\n' : ''}
        </Text>
      );
    });
  };

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
      {/* Sender Header for Bot */}
      {!isUser && (
        <View style={styles.botHeader}>
          <View style={styles.botAvatar}>
            <Ionicons name="chatbubble-ellipses" size={12} color="#FFFFFF" />
          </View>
          <Text style={styles.botName}>Sahaaya Companion</Text>
          {time && <Text style={styles.timeText}>· {time}</Text>}
        </View>
      )}

      {/* Bubble Container */}
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <View>{renderFormattedText(text)}</View>

        {time && isUser && <Text style={styles.userTimeText}>{time}</Text>}
      </View>

      {/* Emergency Alert Prompt if triggered */}
      {showEmergency && onEmergencyPress && (
        <TouchableOpacity
          style={styles.emergencyPrompt}
          onPress={onEmergencyPress}
          activeOpacity={0.8}
        >
          <Ionicons name="shield-outline" size={16} color={Colors.error} />
          <Text style={styles.emergencyPromptText}>Open Immediate Support & Safety Options</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.error} />
        </TouchableOpacity>
      )}

      {/* Interactive Suggestion Pills */}
      {!isUser && suggestions && suggestions.length > 0 && onSelectSuggestion && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((sug, sIdx) => (
            <TouchableOpacity
              key={sIdx}
              style={styles.suggestionPill}
              onPress={() => onSelectSuggestion(sug)}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionText}>{sug}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
    maxWidth: '85%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  botWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    paddingLeft: 2,
  },
  botAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botName: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 11,
  },
  timeText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textMuted,
  },
  bubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: BorderRadius.xs,
  },
  botBubble: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: BorderRadius.xs,
  },
  text: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 21,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: Colors.text,
  },
  userTimeText: {
    ...Typography.caption,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
    marginTop: 4,
  },
  boldText: {
    fontWeight: '700',
  },
  italicDisclaimer: {
    fontStyle: 'italic',
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
    marginTop: 6,
  },
  emergencyPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.errorMuted,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  emergencyPromptText: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '700',
    fontSize: 12,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.xs + 2,
  },
  suggestionPill: {
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  suggestionText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '600',
    fontSize: 12,
  },
});
