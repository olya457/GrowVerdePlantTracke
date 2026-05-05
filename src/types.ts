import type {ImageKey} from './assets/images';

export type TabKey = 'plants' | 'articles' | 'pests' | 'quiz' | 'garden';

export type ActionType =
  | 'Watered'
  | 'Fertilized'
  | 'Pruned'
  | 'Repotted'
  | 'Harvested'
  | 'Observed';

export type CareAction = {
  id: string;
  type: ActionType;
  note: string;
  date: string;
};

export type Plant = {
  id: string;
  name: string;
  species: string;
  plantedAt: string;
  daysGrowing?: number;
  description: string;
  imageKey: ImageKey;
  photoUri?: string;
  actions: CareAction[];
};

export type Article = {
  id: string;
  title: string;
  tag: string;
  tags: string[];
  intro: string;
  body: string[];
};

export type Risk = 'Low Risk' | 'Medium Risk' | 'High Risk';

export type Pest = {
  id: string;
  name: string;
  scientific: string;
  risk: Risk;
  imageKey: ImageKey;
  description: string;
  symptoms: string[];
  prevention: string[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
  didYouKnow: string;
};

export type VirtualPlant = {
  id: string;
  name: string;
  price: number;
  imageKey: ImageKey;
};

export type GardenSlot = {
  id: string;
  areaId: string;
  slotIndex: number;
  plantId: string;
  water: number;
  food: number;
};

export type AppData = {
  onboardingComplete: boolean;
  hasCreatedPlant: boolean;
  plants: Plant[];
  savedArticleIds: string[];
  points: number;
  gardenSlots: GardenSlot[];
};
