import React from 'react';
import {
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {images} from '../assets/images';
import {colors, navContentBottom, platformTopInset, radius} from '../theme';
import type {TabKey} from '../types';
import {FloatingNav} from './FloatingNav';

type PageProps = {
  children: React.ReactNode;
  activeTab?: TabKey;
  onTabChange?: (tab: TabKey) => void;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Page({
  children,
  activeTab,
  onTabChange,
  scroll = true,
  contentStyle,
}: PageProps): React.JSX.Element {
  const content = [
    styles.pageContent,
    {paddingBottom: activeTab ? navContentBottom : 30},
    contentStyle,
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={content}>{children}</View>
      )}
      {activeTab && onTabChange ? (
        <FloatingNav activeTab={activeTab} onTabChange={onTabChange} />
      ) : null}
    </KeyboardAvoidingView>
  );
}

type HeaderProps = {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
};

export function Header({eyebrow, title, right}: HeaderProps): React.JSX.Element {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text adjustsFontSizeToFit numberOfLines={2} style={styles.title}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  variant?: 'primary' | 'ghost' | 'danger' | 'soft';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled,
  style,
  textStyle,
}: ButtonProps): React.JSX.Element {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        variant === 'ghost' && styles.buttonGhost,
        variant === 'danger' && styles.buttonDanger,
        variant === 'soft' && styles.buttonSoft,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      {icon ? <Text style={styles.buttonIcon}>{icon}</Text> : null}
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[
          styles.buttonText,
          variant === 'ghost' && styles.buttonGhostText,
          variant === 'danger' && styles.buttonDangerText,
          disabled && styles.buttonDisabledText,
          textStyle,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

type IconButtonProps = {
  icon: string;
  onPress: () => void;
  label?: string;
  active?: boolean;
  danger?: boolean;
};

export function IconButton({
  icon,
  onPress,
  active,
  danger,
}: IconButtonProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.iconButton,
        active && styles.iconButtonActive,
        danger && styles.iconButtonDanger,
        pressed && styles.pressed,
      ]}>
      <Text style={styles.iconButtonText}>{icon}</Text>
    </Pressable>
  );
}

type ChipProps = {
  label: string;
  active?: boolean;
  tone?: 'green' | 'yellow' | 'red' | 'blue';
  onPress?: () => void;
};

export function Chip({
  label,
  active,
  tone = 'green',
  onPress,
}: ChipProps): React.JSX.Element {
  const tint =
    tone === 'yellow'
      ? colors.yellow
      : tone === 'red'
        ? colors.red
        : tone === 'blue'
          ? colors.blue
          : colors.green;

  const chip = (
    <View
      style={[
        styles.chip,
        {borderColor: tint},
        active && {backgroundColor: tint},
      ]}>
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{chip}</Pressable>;
  }
  return chip;
}

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export function Card({children, style, onPress}: CardProps): React.JSX.Element {
  const content = (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({pressed}) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }
  return content;
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
}): React.JSX.Element {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.dim}
        style={[styles.input, multiline && styles.textArea]}
        value={value}
      />
    </View>
  );
}

export function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}): React.JSX.Element {
  return (
    <View style={styles.emptyState}>
      <Image resizeMode="contain" source={images.brandLeaf} style={styles.emptyImage} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

export function asset(key: keyof typeof images): ImageSourcePropType {
  return images[key];
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  pageContent: {
    minHeight: '100%',
    paddingTop: platformTopInset,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: colors.green,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '800',
  },
  button: {
    minHeight: 48,
    borderRadius: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    backgroundColor: colors.green,
  },
  buttonGhost: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
  },
  buttonDanger: {
    backgroundColor: 'rgba(213, 72, 72, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(213, 72, 72, 0.35)',
  },
  buttonSoft: {
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.lineSoft,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 15,
    maxWidth: 220,
  },
  buttonGhostText: {
    color: colors.green,
  },
  buttonDangerText: {
    color: colors.red,
  },
  buttonDisabledText: {
    color: colors.dim,
  },
  buttonIcon: {
    color: colors.text,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.78,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panelStrong,
    borderWidth: 1,
    borderColor: colors.lineSoft,
  },
  iconButtonActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  iconButtonDanger: {
    backgroundColor: 'rgba(213, 72, 72, 0.18)',
    borderColor: 'rgba(213, 72, 72, 0.4)',
  },
  iconButtonText: {
    color: colors.text,
    fontSize: 18,
  },
  chip: {
    minHeight: 32,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.panel,
  },
  chipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 130,
  },
  chipTextActive: {
    color: colors.text,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.lineSoft,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: colors.green,
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    backgroundColor: colors.panel,
    color: colors.text,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  textArea: {
    minHeight: 96,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 90,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 160,
    height: 130,
    marginBottom: 22,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
});
