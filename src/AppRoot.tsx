import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {colors} from './theme';
import type {AppData, TabKey} from './types';
import {initialAppData, loadAppData, saveAppData} from './storage/appStorage';
import {LoaderScreen} from './screens/LoaderScreen';
import {OnboardingScreen} from './screens/OnboardingScreen';
import {PlantsScreen} from './screens/PlantsScreen';
import {ArticlesScreen} from './screens/ArticlesScreen';
import {PestsScreen} from './screens/PestsScreen';
import {QuizScreen} from './screens/QuizScreen';
import {GardenScreen} from './screens/GardenScreen';

export function AppRoot(): React.JSX.Element {
  const [data, setData] = useState<AppData>(initialAppData);
  const [ready, setReady] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [phase, setPhase] = useState<'loading' | 'onboarding' | 'main'>('loading');
  const [activeTab, setActiveTab] = useState<TabKey>('plants');

  useEffect(() => {
    let alive = true;
    loadAppData().then(stored => {
      if (alive) {
        setData(stored);
        setReady(true);
      }
    });
    const timer = setTimeout(() => setTimerDone(true), 5000);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (phase === 'loading' && ready && timerDone) {
      setPhase(data.onboardingComplete ? 'main' : 'onboarding');
    }
  }, [data.onboardingComplete, phase, ready, timerDone]);

  useEffect(() => {
    if (ready) {
      saveAppData(data);
    }
  }, [data, ready]);

  const updateData = useCallback((updater: (current: AppData) => AppData) => {
    setData(current => updater(current));
  }, []);

  const completeOnboarding = () => {
    updateData(current => ({...current, onboardingComplete: true}));
    setPhase('main');
  };

  const renderMain = () => {
    if (activeTab === 'articles') {
      return (
        <ArticlesScreen
          activeTab={activeTab}
          data={data}
          onTabChange={setActiveTab}
          updateData={updateData}
        />
      );
    }
    if (activeTab === 'pests') {
      return <PestsScreen activeTab={activeTab} onTabChange={setActiveTab} />;
    }
    if (activeTab === 'quiz') {
      return (
        <QuizScreen
          activeTab={activeTab}
          data={data}
          onTabChange={setActiveTab}
          updateData={updateData}
        />
      );
    }
    if (activeTab === 'garden') {
      return (
        <GardenScreen
          activeTab={activeTab}
          data={data}
          onTabChange={setActiveTab}
          updateData={updateData}
        />
      );
    }
    return (
      <PlantsScreen
        activeTab={activeTab}
        data={data}
        onTabChange={setActiveTab}
        updateData={updateData}
      />
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={colors.bg} barStyle="light-content" />
      {phase === 'loading' ? <LoaderScreen /> : null}
      {phase === 'onboarding' ? <OnboardingScreen onDone={completeOnboarding} /> : null}
      {phase === 'main' ? renderMain() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
