import React, {useMemo, useState} from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {images, type ImageKey} from '../assets/images';
import {Button, Card, Chip, EmptyState, Field, Header, IconButton, Page} from '../components/ui';
import {actionTypes, defaultPlants} from '../data/content';
import {colors, platformTopInset, radius} from '../theme';
import type {ActionType, AppData, CareAction, Plant, TabKey} from '../types';
import {daysSince, formatDmy, readableDate, uid} from '../utils/date';

type Props = {
  data: AppData;
  updateData: (updater: (data: AppData) => AppData) => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

const plantImageKeys: ImageKey[] = [
  'onboardingCare',
  'onboardingTrack',
  'onboardingLearn',
  'pestBroadMites',
];

const actionIcons: Record<ActionType, string> = {
  Watered: '💧',
  Fertilized: '⚡',
  Pruned: '✂️',
  Repotted: '🌱',
  Harvested: '🧺',
  Observed: '📅',
};

export function PlantsScreen({
  data,
  updateData,
  activeTab,
  onTabChange,
}: Props): React.JSX.Element {
  const [mode, setMode] = useState<'list' | 'detail' | 'add'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionPlant, setActionPlant] = useState<Plant | null>(null);
  const shownPlants = data.hasCreatedPlant ? data.plants : defaultPlants;
  const selected = shownPlants.find(plant => plant.id === selectedId) ?? shownPlants[0];

  const upsertPlant = (plant: Plant, nextSelectedId?: string) => {
    updateData(current => {
      const exists = current.plants.some(item => item.id === plant.id);
      return {
        ...current,
        hasCreatedPlant: true,
        plants: exists
          ? current.plants.map(item => (item.id === plant.id ? plant : item))
          : [plant, ...current.plants],
      };
    });
    if (nextSelectedId) {
      setSelectedId(nextSelectedId);
    }
  };

  const addAction = (plant: Plant, action: CareAction) => {
    if (data.plants.some(item => item.id === plant.id)) {
      upsertPlant({...plant, actions: [action, ...plant.actions]});
      return;
    }

    const newId = uid('plant');
    upsertPlant(
      {
        ...plant,
        id: newId,
        actions: [action, ...plant.actions],
      },
      newId,
    );
  };

  const removeAction = (plantId: string, actionId: string) => {
    updateData(current => ({
      ...current,
      plants: current.plants.map(plant =>
        plant.id === plantId
          ? {...plant, actions: plant.actions.filter(action => action.id !== actionId)}
          : plant,
      ),
    }));
  };

  const removePlant = (plantId: string) => {
    updateData(current => ({
      ...current,
      plants: current.plants.filter(plant => plant.id !== plantId),
    }));
    setSelectedId(null);
    setMode('list');
  };

  if (mode === 'add') {
    return (
      <AddPlantScreen
        activeTab={activeTab}
        count={data.plants.length}
        onBack={() => setMode('list')}
        onCreate={plant => {
          upsertPlant(plant, plant.id);
          setMode('detail');
        }}
        onTabChange={onTabChange}
      />
    );
  }

  if (mode === 'detail' && selected) {
    return (
      <>
        <PlantDetailScreen
          activeTab={activeTab}
          canDelete={data.plants.some(plant => plant.id === selected.id)}
          onAddAction={() => setActionPlant(selected)}
          onBack={() => setMode('list')}
          onDelete={() => removePlant(selected.id)}
          onRemoveAction={removeAction}
          onTabChange={onTabChange}
          plant={selected}
        />
        <CareActionModal
          onClose={() => setActionPlant(null)}
          onSave={action => {
            if (actionPlant) {
              addAction(actionPlant, action);
            }
            setActionPlant(null);
          }}
          visible={Boolean(actionPlant)}
        />
      </>
    );
  }

  return (
    <Page activeTab={activeTab} onTabChange={onTabChange}>
      <Header
        eyebrow="My Garden"
        right={<IconButton icon="＋" onPress={() => setMode('add')} />}
        title="My Plants"
      />

      {!data.hasCreatedPlant ? (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Default plants are shown only as examples</Text>
          <Text style={styles.noticeText}>
            After you add your first plant, they will disappear, and only your own
            plants will remain.
          </Text>
        </View>
      ) : null}

      {shownPlants.length === 0 ? (
        <EmptyState
          text="Add a plant to start saving planting dates, notes, and care actions."
          title="Your garden is empty"
        />
      ) : (
        <View style={styles.list}>
          {shownPlants.map(plant => (
            <PlantRow
              key={plant.id}
              onPress={() => {
                setSelectedId(plant.id);
                setMode('detail');
              }}
              plant={plant}
            />
          ))}
        </View>
      )}
    </Page>
  );
}

function PlantRow({
  plant,
  onPress,
}: {
  plant: Plant;
  onPress: () => void;
}): React.JSX.Element {
  const count = plant.daysGrowing ?? daysSince(plant.plantedAt);

  return (
    <Card onPress={onPress} style={styles.plantRow}>
      <Image source={images[plant.imageKey]} style={styles.plantThumb} />
      <View style={styles.plantInfo}>
        <Text numberOfLines={1} style={styles.plantName}>
          {plant.name}
        </Text>
        <Text numberOfLines={1} style={styles.species}>
          {plant.species}
        </Text>
        <View style={styles.rowMeta}>
          <Text style={styles.dayPill}>↗ {count} days</Text>
          <Text style={styles.actionCount}>{plant.actions.length} actions</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Card>
  );
}

function PlantDetailScreen({
  plant,
  canDelete,
  onBack,
  onDelete,
  onAddAction,
  onRemoveAction,
  activeTab,
  onTabChange,
}: {
  plant: Plant;
  canDelete: boolean;
  onBack: () => void;
  onDelete: () => void;
  onAddAction: () => void;
  onRemoveAction: (plantId: string, actionId: string) => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}): React.JSX.Element {
  const count = plant.daysGrowing ?? daysSince(plant.plantedAt);
  const {width} = useWindowDimensions();
  const horizontalPadding = width < 360 ? 16 : 20;

  return (
    <Page
      activeTab={activeTab}
      contentStyle={styles.detailContent}
      onTabChange={onTabChange}>
      <ImageBackground
        source={images[plant.imageKey]}
        style={[styles.hero, {marginHorizontal: -horizontalPadding}]}
        imageStyle={styles.heroImage}>
        <View style={styles.heroShade} />
        <View style={styles.heroTop}>
          <IconButton icon="‹" onPress={onBack} />
          {canDelete ? <IconButton danger icon="🗑" onPress={onDelete} /> : null}
        </View>
        <View style={styles.heroTitle}>
          <Text adjustsFontSizeToFit numberOfLines={2} style={styles.detailTitle}>
            {plant.name}
          </Text>
          <Text style={styles.detailSpecies}>{plant.species}</Text>
        </View>
      </ImageBackground>

      <View style={styles.stats}>
        <Stat icon="🌱" label="Days Growing" value={`${count}`} />
        <Stat icon="📅" label="Planted" value={readableDate(plant.plantedAt)} />
        <Stat icon="📝" label="Actions" value={`${plant.actions.length}`} />
      </View>

      <Text style={styles.sectionLabel}>Description</Text>
      <Card style={styles.descriptionCard}>
        <Text style={styles.bodyText}>{plant.description}</Text>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Care Log</Text>
        <Button icon="＋" label="Add" onPress={onAddAction} style={styles.smallButton} />
      </View>

      <View style={styles.actionList}>
        {plant.actions.length === 0 ? (
          <Card style={styles.emptyLog}>
            <Text style={styles.bodyText}>No actions saved yet.</Text>
          </Card>
        ) : (
          plant.actions.map(action => (
            <Card key={action.id} style={styles.actionCard}>
              <View style={styles.actionTop}>
                <View style={styles.actionIcon}>
                  <Text>{actionIcons[action.type]}</Text>
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>{action.type}</Text>
                  <Text style={styles.actionNote}>{action.note || 'No notes.'}</Text>
                </View>
                <Text style={styles.actionDate}>{readableDate(action.date)}</Text>
              </View>
              {canDelete ? (
                <Button
                  icon="×"
                  label="Remove"
                  onPress={() => onRemoveAction(plant.id, action.id)}
                  style={styles.removeAction}
                  textStyle={styles.removeActionText}
                  variant="danger"
                />
              ) : null}
            </Card>
          ))
        )}
      </View>
    </Page>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text adjustsFontSizeToFit numberOfLines={2} style={styles.statValue}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function AddPlantScreen({
  count,
  onCreate,
  onBack,
  activeTab,
  onTabChange,
}: {
  count: number;
  onCreate: (plant: Plant) => void;
  onBack: () => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}): React.JSX.Element {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [date, setDate] = useState(formatDmy(new Date()));
  const [description, setDescription] = useState('');
  const imageKey = useMemo(() => plantImageKeys[count % plantImageKeys.length], [count]);

  const canSave = name.trim().length > 1;

  return (
    <Page activeTab={activeTab} onTabChange={onTabChange}>
      <View style={styles.addHeader}>
        <IconButton icon="‹" onPress={onBack} />
        <Text style={styles.addTitle}>Add New Plant</Text>
      </View>

      <Text style={styles.sectionLabel}>Choose Photo</Text>
      <View style={styles.photoBox}>
        <Image source={images[imageKey]} style={styles.photoPreview} />
        <View style={styles.photoOverlay}>
          <Text style={styles.photoIcon}>📷</Text>
          <Text style={styles.photoText}>Tap to add photo</Text>
        </View>
      </View>

      <Field label="Plant Name *" onChangeText={setName} placeholder="e.g. Cherry Tomato" value={name} />
      <Field label="Species" onChangeText={setSpecies} placeholder="e.g. Solanum lycopersicum" value={species} />
      <Field label="Date Planted" onChangeText={setDate} placeholder="30.04.2026" value={date} />
      <Field
        label="Description"
        multiline
        onChangeText={setDescription}
        placeholder="Describe your plant, where it is growing, any special notes"
        value={description}
      />
      <Button
        disabled={!canSave}
        label="Add Plant"
        onPress={() =>
          onCreate({
            id: uid('plant'),
            name: name.trim(),
            species: species.trim() || 'Unknown species',
            plantedAt: date.trim() || formatDmy(new Date()),
            description:
              description.trim() ||
              'A new plant in your garden. Add notes over time to track growth, care actions, and changes.',
            imageKey,
            actions: [],
          })
        }
      />
    </Page>
  );
}

function CareActionModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (action: CareAction) => void;
}): React.JSX.Element {
  const [type, setType] = useState<ActionType>('Watered');
  const [date, setDate] = useState(formatDmy(new Date()));
  const [note, setNote] = useState('');

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <Pressable onPress={onClose} style={styles.modalBackdrop} />
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Log Care Action</Text>
          <IconButton icon="×" onPress={onClose} />
        </View>
        <View style={styles.actionChips}>
          {actionTypes.map(item => (
            <Chip
              active={item === type}
              key={item}
              label={item}
              onPress={() => setType(item)}
              tone={item === 'Watered' ? 'blue' : item === 'Fertilized' ? 'yellow' : 'green'}
            />
          ))}
        </View>
        <Field label="Date" onChangeText={setDate} placeholder="30.04.2026" value={date} />
        <Field
          label="Notes"
          multiline
          onChangeText={setNote}
          placeholder="Add notes (optional)"
          value={note}
        />
        <Button
          label="Log Action"
          onPress={() =>
            onSave({
              id: uid('action'),
              type,
              date: date.trim() || formatDmy(new Date()),
              note: note.trim(),
            })
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: '#f2dc72',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  noticeTitle: {
    color: '#233416',
    fontWeight: '900',
    fontSize: 13,
    textAlign: 'center',
  },
  noticeText: {
    color: '#233416',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '700',
  },
  list: {
    gap: 14,
  },
  plantRow: {
    minHeight: 104,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  plantThumb: {
    width: 72,
    height: 72,
    borderRadius: 13,
  },
  plantInfo: {
    flex: 1,
    minWidth: 0,
  },
  plantName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  species: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  dayPill: {
    color: colors.green,
    backgroundColor: colors.panelSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '800',
  },
  actionCount: {
    color: colors.dim,
    fontSize: 12,
    fontWeight: '700',
  },
  chevron: {
    color: colors.green,
    fontSize: 25,
  },
  detailContent: {
    paddingTop: 0,
  },
  hero: {
    height: 246 + platformTopInset,
    marginHorizontal: -20,
    paddingTop: platformTopInset + 18,
    justifyContent: 'space-between',
  },
  heroImage: {
    opacity: 0.62,
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 8, 7, 0.55)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  heroTitle: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '900',
  },
  detailSpecies: {
    color: colors.green,
    fontSize: 14,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: -18,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    minHeight: 104,
    padding: 12,
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 10,
  },
  statValue: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
  },
  sectionLabel: {
    color: colors.green,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '900',
    marginBottom: 10,
  },
  descriptionCard: {
    padding: 18,
    marginBottom: 24,
  },
  bodyText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 23,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  smallButton: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 13,
  },
  actionList: {
    gap: 12,
  },
  actionCard: {
    padding: 14,
  },
  actionTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  actionIcon: {
    width: 35,
    height: 35,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panelSoft,
  },
  actionText: {
    flex: 1,
    minWidth: 0,
  },
  actionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  actionNote: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  actionDate: {
    color: colors.dim,
    fontSize: 11,
    fontWeight: '800',
  },
  removeAction: {
    alignSelf: 'flex-start',
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  removeActionText: {
    fontSize: 12,
  },
  emptyLog: {
    padding: 16,
  },
  addHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 22,
  },
  addTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  photoBox: {
    height: 96,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line,
    backgroundColor: colors.panel,
    marginBottom: 18,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    opacity: 0.25,
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  photoText: {
    color: colors.dim,
    fontSize: 13,
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.66)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: colors.panel,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  actionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
});
