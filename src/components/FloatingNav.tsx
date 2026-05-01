import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, navHeight, platformBottomGap, radius} from '../theme';
import type {TabKey} from '../types';

type Props = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

const tabs: Array<{key: TabKey; icon: string; label: string}> = [
  {key: 'plants', icon: '🌿', label: 'Plants'},
  {key: 'articles', icon: '📖', label: 'Articles'},
  {key: 'pests', icon: '🐞', label: 'Pests'},
  {key: 'quiz', icon: '🏆', label: 'Quiz'},
  {key: 'garden', icon: '🌱', label: 'Garden'},
];

export function FloatingNav({activeTab, onTabChange}: Props): React.JSX.Element {
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.nav}>
        {tabs.map(tab => {
          const active = tab.key === activeTab;
          return (
            <Pressable
              accessibilityLabel={tab.label}
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              style={[styles.item, active && styles.itemActive]}>
              <Text style={[styles.icon, active && styles.iconActive]}>
                {tab.icon}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: platformBottomGap,
    alignItems: 'center',
  },
  nav: {
    height: navHeight,
    width: '88%',
    maxWidth: 390,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(9, 31, 13, 0.94)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  item: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(33, 72, 36, 0.45)',
  },
  itemActive: {
    backgroundColor: colors.green,
  },
  icon: {
    fontSize: 21,
    opacity: 0.68,
  },
  iconActive: {
    opacity: 1,
  },
});
