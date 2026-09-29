import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing } from '../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'small' | 'default' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function PrimaryButton({
  title,
  onPress,
  type = 'primary',
  variant,
  size = 'default',
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: Props) {
  const activeType = variant || type;
  const getStyles = () => {
    switch (activeType) {
      case 'secondary':
        return {
          btn: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
          text: { color: '#FFFFFF' },
          iconColor: '#FFFFFF',
        };
      case 'outline':
        return {
          btn: { backgroundColor: 'transparent', borderColor: Colors.borderStrong, borderWidth: 1 },
          text: { color: Colors.textSecondary },
          iconColor: Colors.textSecondary,
        };
      case 'danger':
        return {
          btn: { backgroundColor: Colors.error, borderColor: Colors.error },
          text: { color: '#FFFFFF' },
          iconColor: '#FFFFFF',
        };
      case 'success':
        return {
          btn: { backgroundColor: Colors.success, borderColor: Colors.success },
          text: { color: '#FFFFFF' },
          iconColor: '#FFFFFF',
        };
      case 'ghost':
        return {
          btn: { backgroundColor: 'transparent', borderColor: 'transparent' },
          text: { color: Colors.primary },
          iconColor: Colors.primary,
        };
      default:
        return {
          btn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
          text: { color: '#FFFFFF' },
          iconColor: '#FFFFFF',
        };
    }
  };

  const styleConfig = getStyles();

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'large':
        return { paddingVertical: 14, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 10, paddingHorizontal: 16 };
    }
  };

  const paddingConfig = getPadding();

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        styleConfig.btn,
        paddingConfig,
        disabled && styles.btnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={styleConfig.text.color} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 14 : size === 'large' ? 18 : 16}
              color={styleConfig.iconColor}
              style={{ marginRight: 6 }}
            />
          )}
          <Text
            style={[
              Typography.button,
              size === 'small' && Typography.buttonSmall,
              styleConfig.text,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
