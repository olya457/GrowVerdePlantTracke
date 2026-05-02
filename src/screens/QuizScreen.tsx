import React, {useEffect, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {images} from '../assets/images';
import {Button, Card, Header, IconButton, Page} from '../components/ui';
import {quizQuestions} from '../data/content';
import {colors} from '../theme';
import type {AppData, QuizQuestion, TabKey} from '../types';

type Props = {
  data: AppData;
  updateData: (updater: (data: AppData) => AppData) => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

type AnswerRecord = {
  question: QuizQuestion;
  selectedIndex: number;
  correct: boolean;
};

export function QuizScreen({
  data,
  updateData,
  activeTab,
  onTabChange,
}: Props): React.JSX.Element {
  const [phase, setPhase] = useState<'home' | 'active' | 'paused' | 'result'>('home');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);

  const score = answers.filter(answer => answer.correct).length * 15;
  const current = questions[index];
  const correctCount = answers.filter(answer => answer.correct).length;
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 360;

  useEffect(() => {
    if (phase !== 'active' || selected !== null) {
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(value => {
        if (value <= 1) {
          clearInterval(timer);
          if (current) {
            setSelected(-1);
            setAnswers(previous => [
              ...previous,
              {question: current, selectedIndex: -1, correct: false},
            ]);
          }
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, selected, current]);

  const start = () => {
    setQuestions(quizQuestions.slice(0, 10));
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setTimeLeft(20);
    setPhase('active');
  };

  const choose = (answerIndex: number) => {
    if (!current || selected !== null) {
      return;
    }
    const correct = answerIndex === current.correctIndex;
    setSelected(answerIndex);
    setAnswers(previous => [
      ...previous,
      {question: current, selectedIndex: answerIndex, correct},
    ]);
  };

  const finish = () => {
    const points = answers.filter(answer => answer.correct).length * 15;
    updateData(currentData => ({...currentData, points: currentData.points + points}));
    setPhase('result');
  };

  const next = () => {
    if (index >= questions.length - 1) {
      finish();
      return;
    }
    setIndex(value => value + 1);
    setSelected(null);
    setTimeLeft(20);
  };

  if (phase === 'active' && current) {
    return (
      <ActiveQuiz
        answers={answers}
        current={current}
        index={index}
        onBack={() => {
          setQuestions([]);
          setIndex(0);
          setSelected(null);
          setAnswers([]);
          setTimeLeft(20);
          setPhase('home');
        }}
        onChoose={choose}
        onNext={next}
        onPause={() => setPhase('paused')}
        questions={questions}
        score={score}
        selected={selected}
        timeLeft={timeLeft}
      />
    );
  }

  if (phase === 'paused') {
    return (
      <PausedQuiz
        correctCount={correctCount}
        index={index}
        onQuit={() => setPhase('home')}
        onResume={() => setPhase('active')}
        total={questions.length}
      />
    );
  }

  if (phase === 'result') {
    return (
      <ResultQuiz
        answers={answers}
        onDone={() => setPhase('home')}
        onRetry={start}
      />
    );
  }

  return (
    <Page activeTab={activeTab} onTabChange={onTabChange}>
      <Header eyebrow="Test Yourself" title="Garden Quiz" />
      <View style={styles.homeHero}>
        <Image
          resizeMode="contain"
          source={images.brandLeaf}
          style={[styles.leaf, compact && styles.leafCompact]}
        />
        <Text style={styles.homeTitle}>Gardening Knowledge</Text>
        <View style={styles.homeStats}>
          <QuizStat icon="?" label="Questions" value="10" />
          <QuizStat icon="⭐" label="Per Answer" value="15pts" />
          <QuizStat icon="⏱" label="Time Limit" value="20s" />
        </View>
      </View>
      <Card style={styles.totalCard}>
        <Text style={styles.totalIcon}>🏆</Text>
        <View>
          <Text style={styles.totalLabel}>Your total points</Text>
          <Text style={styles.totalPoints}>{data.points} pts</Text>
        </View>
      </Card>
      <Button icon="↗" label="Start Quiz" onPress={start} style={styles.startButton} />
    </Page>
  );
}

function ActiveQuiz({
  current,
  questions,
  index,
  score,
  selected,
  timeLeft,
  answers,
  onChoose,
  onNext,
  onBack,
  onPause,
}: {
  current: QuizQuestion;
  questions: QuizQuestion[];
  index: number;
  score: number;
  selected: number | null;
  timeLeft: number;
  answers: AnswerRecord[];
  onChoose: (answerIndex: number) => void;
  onNext: () => void;
  onBack: () => void;
  onPause: () => void;
}): React.JSX.Element {
  const progress = `${((index + 1) / questions.length) * 100}%` as `${number}%`;
  const answerMap = useMemo(
    () => new Map(answers.map(answer => [answer.question.id, answer.correct])),
    [answers],
  );

  return (
    <Page>
      <View style={styles.quizHeader}>
        <IconButton icon="‹" onPress={onBack} />
        <View style={styles.quizHeaderText}>
          <Text style={styles.quizMeta}>Question {index + 1} of {questions.length}</Text>
          <Text style={styles.scoreText}>Score: {score} pts</Text>
        </View>
        <IconButton icon="Ⅱ" onPress={onPause} />
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: progress}]} />
      </View>
      <View style={styles.miniDots}>
        {questions.map(question => {
          const status = answerMap.get(question.id);
          return (
            <View
              key={question.id}
              style={[
                styles.miniDot,
                status === true && styles.miniDotCorrect,
                status === false && styles.miniDotWrong,
              ]}
            />
          );
        })}
        <Text style={styles.timer}>⏱ {timeLeft}s</Text>
      </View>

      <Card style={styles.questionCard}>
        <Text style={styles.questionKicker}>Question {index + 1}</Text>
        <Text style={styles.question}>{current.question}</Text>
      </Card>

      <View style={styles.options}>
        {current.answers.map((answer, answerIndex) => {
          const isCorrect = current.correctIndex === answerIndex;
          const isSelected = selected === answerIndex;
          const showCorrect = selected !== null && isCorrect;
          const showWrong = selected !== null && isSelected && !isCorrect;
          return (
            <Pressable
              disabled={selected !== null}
              key={answer}
              onPress={() => onChoose(answerIndex)}
              style={[
                styles.option,
                showCorrect && styles.optionCorrect,
                showWrong && styles.optionWrong,
              ]}>
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterText}>
                  {String.fromCharCode(65 + answerIndex)}
                </Text>
              </View>
              <Text style={styles.optionText}>{answer}</Text>
              {showCorrect ? <Text style={styles.star}>☆</Text> : null}
            </Pressable>
          );
        })}
      </View>

      {selected !== null ? (
        <>
          <Card style={styles.didYouKnow}>
            <Text style={styles.didTitle}>💡 Did You Know</Text>
            <Text style={styles.didText}>{current.didYouKnow}</Text>
          </Card>
          <Button
            label={index === questions.length - 1 ? 'See Result' : 'Next Question'}
            onPress={onNext}
            style={styles.nextQuestion}
          />
        </>
      ) : null}
    </Page>
  );
}

function PausedQuiz({
  index,
  total,
  correctCount,
  onResume,
  onQuit,
}: {
  index: number;
  total: number;
  correctCount: number;
  onResume: () => void;
  onQuit: () => void;
}): React.JSX.Element {
  return (
    <Page contentStyle={styles.pausePage} scroll={false}>
      <View style={styles.pauseIcon}>
        <Text style={styles.pauseIconText}>Ⅱ</Text>
      </View>
      <Text style={styles.pauseTitle}>Quiz Paused</Text>
      <Text style={styles.pauseSub}>Question {index + 1} of {total}</Text>
      <Text style={styles.pausePill}>{correctCount} correct so far</Text>
      <Button icon="▷" label="Resume Quiz" onPress={onResume} style={styles.pauseButton} />
      <Button
        icon="×"
        label="Quit Quiz"
        onPress={onQuit}
        style={styles.pauseButton}
        variant="danger"
      />
    </Page>
  );
}

function ResultQuiz({
  answers,
  onRetry,
  onDone,
}: {
  answers: AnswerRecord[];
  onRetry: () => void;
  onDone: () => void;
}): React.JSX.Element {
  const correct = answers.filter(answer => answer.correct).length;
  const percent = answers.length ? Math.round((correct / answers.length) * 100) : 0;
  const earned = correct * 15;

  return (
    <Page>
      <View style={styles.resultTop}>
        <Image resizeMode="contain" source={images.brandLeaf} style={styles.resultLeaf} />
        <Text style={styles.resultTitle}>
          {percent >= 70 ? 'Growing Strong!' : percent >= 40 ? 'Growing Nicely!' : 'Keep Growing!'}
        </Text>
        <Text style={styles.resultSub}>
          You answered {correct} out of {answers.length} correctly
        </Text>
      </View>
      <View style={styles.resultStats}>
        <QuizStat label="Score" value={`${percent}%`} />
        <QuizStat label="Correct" value={`${correct}/${answers.length}`} />
        <QuizStat label="Earned" value={`+${earned}pts`} />
      </View>
      <Card style={styles.accuracyCard}>
        <View style={styles.accuracyRow}>
          <Text style={styles.accuracyLabel}>Accuracy</Text>
          <Text style={styles.accuracyValue}>{percent}%</Text>
        </View>
        <View style={styles.accuracyTrack}>
          <View style={[styles.accuracyFill, {width: `${percent}%` as `${number}%`}]} />
        </View>
      </Card>
      <Text style={styles.reviewTitle}>Review Answers</Text>
      <View style={styles.reviewList}>
        {answers.map(answer => (
          <Card key={answer.question.id} style={styles.reviewCard}>
            <Text style={answer.correct ? styles.reviewGood : styles.reviewBad}>
              {answer.correct ? '✓' : '×'}
            </Text>
            <View style={styles.reviewTextWrap}>
              <Text style={styles.reviewQuestion}>{answer.question.question}</Text>
              <Text style={styles.reviewCorrect}>
                Correct: {answer.question.answers[answer.question.correctIndex]}
              </Text>
            </View>
          </Card>
        ))}
      </View>
      <View style={styles.resultButtons}>
        <Button icon="↻" label="Retry" onPress={onRetry} style={styles.resultButton} variant="soft" />
        <Button icon="🏆" label="Done" onPress={onDone} style={styles.resultButton} />
      </View>
    </Page>
  );
}

function QuizStat({
  icon,
  label,
  value,
}: {
  icon?: string;
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <Card style={styles.quizStat}>
      {icon ? <Text style={styles.quizStatIcon}>{icon}</Text> : null}
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.quizStatValue}>
        {value}
      </Text>
      <Text style={styles.quizStatLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  homeHero: {
    alignItems: 'center',
    paddingTop: 4,
  },
  leaf: {
    width: 220,
    height: 180,
    marginTop: 8,
  },
  leafCompact: {
    width: 172,
    height: 138,
    marginTop: 0,
  },
  homeTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
  },
  homeStats: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  quizStat: {
    flex: 1,
    minHeight: 78,
    padding: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizStatIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  quizStatValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  quizStatLabel: {
    color: colors.dim,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  totalCard: {
    padding: 18,
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  totalIcon: {
    fontSize: 27,
  },
  totalLabel: {
    color: colors.dim,
    fontSize: 12,
    fontWeight: '700',
  },
  totalPoints: {
    color: colors.yellow,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  startButton: {
    marginTop: 22,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  quizHeaderText: {
    flex: 1,
  },
  quizMeta: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '900',
  },
  scoreText: {
    color: colors.yellow,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 3,
  },
  progressTrack: {
    height: 9,
    borderRadius: 9,
    backgroundColor: colors.panelSoft,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 9,
    backgroundColor: colors.green,
  },
  miniDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 20,
  },
  miniDot: {
    flex: 1,
    height: 5,
    borderRadius: 5,
    backgroundColor: colors.panelSoft,
  },
  miniDotCorrect: {
    backgroundColor: colors.green,
  },
  miniDotWrong: {
    backgroundColor: colors.red,
  },
  timer: {
    color: colors.text,
    backgroundColor: colors.panelSoft,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '900',
  },
  questionCard: {
    padding: 18,
    marginBottom: 16,
  },
  questionKicker: {
    color: colors.green,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '900',
    marginBottom: 8,
  },
  question: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
  },
  options: {
    gap: 11,
  },
  option: {
    minHeight: 58,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    backgroundColor: colors.panel,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionCorrect: {
    borderColor: colors.green,
    backgroundColor: 'rgba(85, 182, 43, 0.22)',
  },
  optionWrong: {
    borderColor: colors.red,
    backgroundColor: 'rgba(213, 72, 72, 0.22)',
  },
  optionLetter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.panelSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '900',
  },
  optionText: {
    flex: 1,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  star: {
    color: colors.green,
    fontSize: 20,
  },
  didYouKnow: {
    padding: 16,
    marginTop: 16,
    backgroundColor: colors.panelSoft,
  },
  didTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  didText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  nextQuestion: {
    marginTop: 14,
  },
  pausePage: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 34,
  },
  pauseIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panelSoft,
    marginBottom: 28,
  },
  pauseIconText: {
    color: colors.green,
    fontSize: 28,
    fontWeight: '900',
  },
  pauseTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '900',
  },
  pauseSub: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 12,
  },
  pausePill: {
    color: colors.yellow,
    backgroundColor: colors.panelSoft,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 16,
    marginTop: 14,
    marginBottom: 28,
    fontWeight: '900',
  },
  pauseButton: {
    alignSelf: 'stretch',
    marginBottom: 12,
  },
  resultTop: {
    alignItems: 'center',
  },
  resultLeaf: {
    width: 120,
    height: 88,
    marginBottom: 10,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  resultSub: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
  },
  resultStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  accuracyCard: {
    padding: 16,
    marginTop: 16,
  },
  accuracyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  accuracyLabel: {
    color: colors.muted,
    fontWeight: '700',
  },
  accuracyValue: {
    color: colors.yellow,
    fontWeight: '900',
  },
  accuracyTrack: {
    height: 11,
    borderRadius: 10,
    backgroundColor: colors.panelSoft,
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    backgroundColor: colors.yellow,
  },
  reviewTitle: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 10,
  },
  reviewList: {
    gap: 10,
  },
  reviewCard: {
    padding: 14,
    flexDirection: 'row',
    gap: 12,
  },
  reviewGood: {
    color: colors.green,
    fontSize: 18,
    fontWeight: '900',
  },
  reviewBad: {
    color: colors.red,
    fontSize: 18,
    fontWeight: '900',
  },
  reviewTextWrap: {
    flex: 1,
  },
  reviewQuestion: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  reviewCorrect: {
    color: colors.green,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    fontWeight: '800',
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  resultButton: {
    flex: 1,
  },
});
