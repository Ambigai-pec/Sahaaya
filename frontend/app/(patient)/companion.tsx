import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { getChatResponse, getWelcomeMessage, ChatResponse } from '../../services/chatbot';
import { api } from '../../services/api';
import AppShell from '../../components/AppShell';
import ChatBubble from '../../components/ChatBubble';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  suggestions?: string[];
  showEmergency?: boolean;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { label: '🌿 4-7-8 Breathing', text: 'breathing exercise' },
  { label: '💙 I feel stressed', text: 'I feel stressed today' },
  { label: '💊 Missed dose help', text: 'I forgot to take my medication' },
  { label: '🌙 Sleep wind-down', text: 'I am having trouble sleeping' },
  { label: '🌱 Wellness tip', text: 'Give me a daily wellness tip' },
];

export default function Companion() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load initial greeting
    const welcome = getWelcomeMessage();
    setMessages([
      {
        id: '0',
        role: 'bot',
        text: welcome.text,
        suggestions: welcome.suggestions,
        showEmergency: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setSessionHistory((prev) => [...prev, text]);

    try {
      // First attempt backend API call with local fallback
      const apiRes = await api.chat.sendMessage(text.trim());
      let responseText = '';
      let suggestions: string[] = [];
      let showEmergency = false;

      if (apiRes.success && apiRes.data?.text) {
        responseText = apiRes.data.text;
        suggestions = apiRes.data.suggestions || [];
        showEmergency = apiRes.data.show_emergency || false;
      } else {
        // Fallback to local rule-based companion
        const fallback = getChatResponse(text, sessionHistory);
        responseText = fallback.text;
        suggestions = fallback.suggestions;
        showEmergency = fallback.showEmergency;
      }

      await new Promise((r) => setTimeout(r, 600));

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: responseText,
        suggestions,
        showEmergency,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallback = getChatResponse(text, sessionHistory);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: fallback.text,
        suggestions: fallback.suggestions,
        showEmergency: fallback.showEmergency,
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }
  };

  const getTimeStr = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AppShell title="Sahaaya Companion" subtitle="Supportive Conversation & Relaxation">
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Quick Prompts Bar */}
        <View style={styles.quickPromptsBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsContent}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.promptChip}
                onPress={() => sendMessage(prompt.text)}
                activeOpacity={0.7}
              >
                <Text style={styles.promptChipText}>{prompt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Stream */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              text={msg.text}
              isUser={msg.role === 'user'}
              time={getTimeStr(msg.timestamp)}
              suggestions={msg.suggestions}
              onSelectSuggestion={(sug) => sendMessage(sug)}
              showEmergency={msg.showEmergency}
              onEmergencyPress={() => router.push('/(patient)/emergency')}
            />
          ))}

          {isTyping && (
            <View style={styles.typingIndicatorBox}>
              <View style={styles.typingAvatar}>
                <Ionicons name="chatbubble-ellipses" size={12} color="#FFFFFF" />
              </View>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.typingText}>Sahaaya Companion is thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Message Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Type your thoughts, questions, or feelings..."
            placeholderTextColor={Colors.textMuted}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  quickPromptsBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
  },
  promptsContent: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  promptChip: {
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  promptChipText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.primaryDark,
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.lg,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  typingIndicatorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  typingAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    fontSize: 14,
    color: Colors.text,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.borderStrong,
  },
});
