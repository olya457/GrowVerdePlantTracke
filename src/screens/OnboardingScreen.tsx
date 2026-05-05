import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {images} from '../assets/images';
import {onboardingSlides} from '../data/content';
import {colors, platformTopInset, radius} from '../theme';
import {Button} from '../components/ui';

type Props = {
  onDone: () => void;
};

export function OnboardingScreen({onDone}: Props): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const {height} = useWindowDimensions();
  const slide = onboardingSlides[index];
  const compact = height < 720;

  const next = () => {
    if (index === onboardingSlides.length - 1) {
      onDone();
      return;
    }
    setIndex(value => value + 1);
  };

  return (
    <View style={[styles.root, {paddingTop: platformTopInset}]}>
      <Pressable onPress={onDone} style={styles.skip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={[styles.imageWrap, compact && styles.imageWrapCompact]}>
          <Image source={images[slide.imageKey]} style={styles.image} />
          <View style={styles.tag}>
            <Text style={styles.tagText}>{slide.tag}</Text>
          </View>
        </View>

        <Text
          adjustsFontSizeToFit
          numberOfLines={2}
          style={[styles.title, compact && styles.titleCompact]}>
          {slide.title}
        </Text>
        <Text style={[styles.text, compact && styles.textCompact]}>
          {slide.text}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {onboardingSlides.map((item, dotIndex) => (
            <View
              key={item.title}
              style={[styles.dot, dotIndex === index && styles.dotActive]}
            />
          ))}
        </View>
        <Button
          icon="›"
          label={index === onboardingSlides.length - 1 ? 'Start' : 'Next'}
          onPress={next}
          style={styles.next}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
  },
  skip: {
    alignSelf: 'flex-end',
    minHeight: 40,
    justifyContent: 'center',
  },
  skipText: {
    color: colors.green,
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.panel,
    marginBottom: 28,
  },
  imageWrapCompact: {
    maxHeight: 310,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tag: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 32,
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  tagText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '900',
  },
  titleCompact: {
    fontSize: 27,
    lineHeight: 32,
  },
  text: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14,
  },
  textCompact: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  footer: {
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.panelSoft,
  },
  dotActive: {
    width: 25,
    backgroundColor: colors.green,
  },
  next: {
    minWidth: 110,
  },
});
