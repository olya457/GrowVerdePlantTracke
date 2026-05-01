import AsyncStorage from '@react-native-async-storage/async-storage';
import type {AppData} from '../types';

const key = 'grow-verde-state-v1';

export const initialAppData: AppData = {
  onboardingComplete: false,
  hasCreatedPlant: false,
  plants: [],
  savedArticleIds: [],
  points: 20,
  gardenSlots: [],
};

export async function loadAppData(): Promise<AppData> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return initialAppData;
  }
  try {
    return {...initialAppData, ...JSON.parse(raw)};
  } catch {
    return initialAppData;
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}
