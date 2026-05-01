import {Platform} from 'react-native';

export const colors = {
  bg: '#030807',
  panel: '#0b1c0e',
  panelStrong: '#102813',
  panelSoft: '#143317',
  line: '#1f4a22',
  lineSoft: '#173b1a',
  text: '#edf7df',
  muted: '#8aad76',
  dim: '#57784c',
  green: '#55b62b',
  greenDark: '#2f7f1c',
  yellow: '#e8c64a',
  red: '#d54848',
  blue: '#2f8fd3',
  black: '#000000',
};

export const platformTopInset = Platform.OS === 'android' ? 30 : 48;
export const platformBottomGap = Platform.OS === 'android' ? 30 : 20;
export const navHeight = 64;
export const navContentBottom = navHeight + platformBottomGap + 26;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
};
