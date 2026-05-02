import React, {useMemo, useState} from 'react';
import {Pressable, Share, StyleSheet, Text, View} from 'react-native';
import {Button, Card, Chip, EmptyState, Header, IconButton, Page} from '../components/ui';
import {articles} from '../data/content';
import {colors} from '../theme';
import type {AppData, Article, TabKey} from '../types';

type Props = {
  data: AppData;
  updateData: (updater: (data: AppData) => AppData) => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

export function ArticlesScreen({
  data,
  updateData,
  activeTab,
  onTabChange,
}: Props): React.JSX.Element {
  const [mode, setMode] = useState<'all' | 'saved'>('all');
  const [tag, setTag] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = articles.find(article => article.id === selectedId);
  const tags = useMemo(
    () => ['All', ...Array.from(new Set(articles.map(article => article.tag)))],
    [],
  );

  const savedSet = useMemo(() => new Set(data.savedArticleIds), [data.savedArticleIds]);
  const filtered = articles.filter(article => {
    if (mode === 'saved' && !savedSet.has(article.id)) {
      return false;
    }
    if (tag !== 'All' && article.tag !== tag) {
      return false;
    }
    return true;
  });

  const toggleSaved = (id: string) => {
    updateData(current => {
      const exists = current.savedArticleIds.includes(id);
      return {
        ...current,
        savedArticleIds: exists
          ? current.savedArticleIds.filter(item => item !== id)
          : [id, ...current.savedArticleIds],
      };
    });
  };

  if (selected) {
    return (
      <ArticleDetail
        article={selected}
        isSaved={savedSet.has(selected.id)}
        onBack={() => setSelectedId(null)}
        onShare={() => Share.share({title: selected.title, message: selected.intro})}
        onToggleSaved={() => toggleSaved(selected.id)}
      />
    );
  }

  return (
    <Page activeTab={activeTab} onTabChange={onTabChange}>
      <Header eyebrow="Library" title="Garden Articles" />
      <View style={styles.switcher}>
        <Button
          label={`All (${articles.length})`}
          onPress={() => setMode('all')}
          style={styles.switchButton}
          variant={mode === 'all' ? 'primary' : 'ghost'}
        />
        <Button
          label={`Saved (${data.savedArticleIds.length})`}
          onPress={() => setMode('saved')}
          style={styles.switchButton}
          variant={mode === 'saved' ? 'primary' : 'ghost'}
        />
      </View>

      {mode === 'all' ? (
        <View style={styles.filterWrap}>
          {tags.map(item => (
            <Chip active={item === tag} key={item} label={item} onPress={() => setTag(item)} />
          ))}
        </View>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          text="Save articles to read them later."
          title={mode === 'saved' ? 'No saved articles' : 'No articles found'}
        />
      ) : (
        <View style={styles.list}>
          {filtered.map(article => (
            <ArticleCard
              article={article}
              isSaved={savedSet.has(article.id)}
              key={article.id}
              onOpen={() => setSelectedId(article.id)}
              onToggleSaved={() => toggleSaved(article.id)}
            />
          ))}
        </View>
      )}
    </Page>
  );
}

function ArticleCard({
  article,
  isSaved,
  onOpen,
  onToggleSaved,
}: {
  article: Article;
  isSaved: boolean;
  onOpen: () => void;
  onToggleSaved: () => void;
}): React.JSX.Element {
  return (
    <Card style={styles.articleCard}>
      <View style={styles.articleTop}>
        <Chip label={article.tag} />
        <Pressable onPress={onToggleSaved} style={styles.bookmarkHit}>
          <Text style={[styles.bookmark, isSaved && styles.bookmarkSaved]}>
            🔖
          </Text>
        </Pressable>
      </View>
      <Text numberOfLines={2} style={styles.cardTitle}>
        {article.title}
      </Text>
      <Text numberOfLines={3} style={styles.cardIntro}>
        {article.intro}
      </Text>
      <Button
        icon="›"
        label="Read more"
        onPress={onOpen}
        style={styles.readButton}
        variant="soft"
      />
    </Card>
  );
}

function ArticleDetail({
  article,
  isSaved,
  onBack,
  onShare,
  onToggleSaved,
}: {
  article: Article;
  isSaved: boolean;
  onBack: () => void;
  onShare: () => void;
  onToggleSaved: () => void;
}): React.JSX.Element {
  return (
    <Page>
      <View style={styles.detailTop}>
        <IconButton icon="‹" onPress={onBack} />
        <View style={styles.detailChipWrap}>
          <Chip label={article.tag} />
        </View>
        <View style={styles.detailActions}>
          <IconButton icon="↗" onPress={onShare} />
          <IconButton active={isSaved} icon="🔖" onPress={onToggleSaved} />
        </View>
      </View>
      <Text style={styles.detailTitle}>{article.title}</Text>
      <View style={styles.tags}>
        {article.tags.map(item => (
          <Chip key={item} label={`#${item}`} />
        ))}
      </View>
      <Card style={styles.detailCard}>
        <Text style={styles.lead}>{article.intro}</Text>
        {article.body.map((paragraph, index) => (
          <Text key={`${article.id}-${index}`} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  switcher: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  switchButton: {
    minWidth: 104,
  },
  filterWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 18,
  },
  list: {
    gap: 12,
  },
  articleCard: {
    padding: 17,
  },
  articleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookmarkHit: {
    width: 40,
    height: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bookmark: {
    color: colors.muted,
    fontSize: 22,
    opacity: 0.38,
  },
  bookmarkSaved: {
    color: colors.green,
    opacity: 1,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
  },
  cardIntro: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  readButton: {
    alignSelf: 'flex-start',
    marginTop: 14,
    minHeight: 40,
    paddingHorizontal: 16,
  },
  detailTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 14,
    marginBottom: 30,
  },
  detailChipWrap: {
    flex: 1,
    alignItems: 'flex-start',
  },
  detailActions: {
    flexDirection: 'row',
    gap: 10,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '900',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    marginBottom: 18,
  },
  detailCard: {
    padding: 20,
  },
  lead: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 20,
  },
  paragraph: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 18,
  },
});
