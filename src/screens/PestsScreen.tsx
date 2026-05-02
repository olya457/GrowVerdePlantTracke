import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {images} from '../assets/images';
import {Card, Chip, Header, IconButton, Page} from '../components/ui';
import {pests} from '../data/content';
import {colors, platformTopInset, radius} from '../theme';
import type {Pest, Risk, TabKey} from '../types';

type Props = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

export function PestsScreen({activeTab, onTabChange}: Props): React.JSX.Element {
  const [selected, setSelected] = useState<Pest | null>(null);
  const {width} = useWindowDimensions();
  const cardWidth = Math.floor((width - 56) / 2);

  if (selected) {
    return (
      <PestDetail
        onBack={() => setSelected(null)}
        onShare={() =>
          Share.share({
            title: selected.name,
            message: `${selected.name}: ${selected.description}`,
          })
        }
        pest={selected}
      />
    );
  }

  return (
    <Page activeTab={activeTab} onTabChange={onTabChange}>
      <Header eyebrow="Watch Out" title="Garden Pests" />
      <Text style={styles.subtitle}>Identify and protect your plants</Text>
      <View style={styles.grid}>
        {pests.map(pest => (
          <Card
            key={pest.id}
            onPress={() => setSelected(pest)}
            style={[styles.pestCard, {width: cardWidth}]}>
            <View style={[styles.pestImageWrap, {height: cardWidth * 0.78}]}>
              <Image source={images[pest.imageKey]} style={styles.pestImage} />
              <View style={[styles.riskBadge, {backgroundColor: riskColor(pest.risk)}]}>
                <Text numberOfLines={1} style={styles.riskText}>
                  {pest.risk.replace(' Risk', '')}
                </Text>
              </View>
            </View>
            <View style={styles.pestText}>
              <Text numberOfLines={2} style={styles.pestName}>
                {pest.name}
              </Text>
              <Text numberOfLines={1} style={styles.scientific}>
                {pest.scientific}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </Page>
  );
}

function PestDetail({
  pest,
  onBack,
  onShare,
}: {
  pest: Pest;
  onBack: () => void;
  onShare: () => void;
}): React.JSX.Element {
  const {width} = useWindowDimensions();
  const horizontalPadding = width < 360 ? 16 : 20;

  return (
    <Page contentStyle={styles.detailContent}>
      <ImageBackground
        imageStyle={styles.heroImage}
        source={images[pest.imageKey]}
        style={[styles.hero, {marginHorizontal: -horizontalPadding}]}>
        <View style={styles.heroShade} />
        <View style={styles.heroControls}>
          <Chip label={`⚠ ${pest.risk}`} tone={riskTone(pest.risk)} />
          <View style={styles.heroActions}>
            <IconButton icon="↗" onPress={onShare} />
            <IconButton icon="×" onPress={onBack} />
          </View>
        </View>
        <View style={styles.heroTitleWrap}>
          <Text style={styles.heroTitle}>{pest.name}</Text>
          <Text style={styles.heroSub}>{pest.scientific}</Text>
        </View>
      </ImageBackground>

      <Text style={styles.description}>{pest.description}</Text>
      <InfoSection icon="⚠" title="Symptoms" tone="red" items={pest.symptoms} />
      <InfoSection icon="🛡" title="Prevention" tone="blue" items={pest.prevention} />
      <InfoSection
        icon="⚡"
        title="Care Steps"
        tone="green"
        items={[
          'Isolate affected plants from healthy plants',
          'Remove badly damaged leaves when needed',
          'Clean leaves gently and monitor new growth',
          'Choose a plant-safe treatment that matches the pest',
        ]}
      />
    </Page>
  );
}

function InfoSection({
  icon,
  title,
  items,
  tone,
}: {
  icon: string;
  title: string;
  items: string[];
  tone: 'green' | 'red' | 'blue';
}): React.JSX.Element {
  return (
    <View style={styles.infoSection}>
      <View style={styles.infoTitleRow}>
        <View style={[styles.infoIcon, tone === 'red' && styles.infoRed, tone === 'blue' && styles.infoBlue]}>
          <Text>{icon}</Text>
        </View>
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Card style={styles.infoCard}>
        {items.map(item => (
          <View key={item} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

function riskColor(risk: Risk): string {
  if (risk === 'High Risk') {
    return colors.red;
  }
  if (risk === 'Low Risk') {
    return colors.green;
  }
  return '#c7a640';
}

function riskTone(risk: Risk): 'green' | 'yellow' | 'red' {
  if (risk === 'High Risk') {
    return 'red';
  }
  if (risk === 'Low Risk') {
    return 'green';
  }
  return 'yellow';
}

const styles = StyleSheet.create({
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: -12,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  pestCard: {
    overflow: 'hidden',
  },
  pestImageWrap: {
    height: 132,
    backgroundColor: colors.panelStrong,
  },
  pestImage: {
    width: '100%',
    height: '100%',
  },
  riskBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    borderRadius: 14,
    minWidth: 62,
    paddingHorizontal: 10,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  pestText: {
    padding: 13,
    minHeight: 76,
  },
  pestName: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  scientific: {
    color: colors.dim,
    fontSize: 12,
    marginTop: 4,
  },
  detailContent: {
    paddingTop: 0,
  },
  hero: {
    height: 318 + platformTopInset,
    marginHorizontal: -20,
    paddingTop: platformTopInset + 24,
    justifyContent: 'space-between',
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
  },
  heroImage: {
    opacity: 0.86,
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 8, 7, 0.4)',
  },
  heroControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
  },
  heroTitleWrap: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  heroSub: {
    color: colors.green,
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 25,
    marginTop: 22,
    marginBottom: 22,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(85, 182, 43, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRed: {
    backgroundColor: 'rgba(213, 72, 72, 0.18)',
  },
  infoBlue: {
    backgroundColor: 'rgba(47, 143, 211, 0.18)',
  },
  infoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  infoCard: {
    padding: 16,
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    color: colors.green,
    fontSize: 17,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});
