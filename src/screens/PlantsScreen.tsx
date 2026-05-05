import React, {useMemo, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {images, type ImageKey} from '../assets/images';
import {Button, Card, Chip, EmptyState, Header, IconButton, Page} from '../components/ui';
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

type AddPlantFieldKey = 'name' | 'species' | 'date' | 'description';

type CareActionFieldKey = 'date' | 'note';

type TextSelection = {
  start: number;
  end: number;
};

type KeyboardMode = 'letters' | 'numbers';

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

const letterRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const numberRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['.', '/', '-', ',', ':', ';', '(', ')'],
  ['@', '#', '&', "'", '"', '+', '!'],
];

function plantSource(plant: Plant): ImageSourcePropType {
  return plant.photoUri ? {uri: plant.photoUri} : images[plant.imageKey];
}

async function requestGalleryPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const permission =
    Number(Platform.Version) >= 33
      ? 'android.permission.READ_MEDIA_IMAGES'
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const result = await PermissionsAndroid.request(permission, {
    title: 'Photo library access',
    message: 'Grow Verde needs access to your gallery to add plant photos.',
    buttonPositive: 'Allow',
    buttonNegative: 'Cancel',
  });

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

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

  const showStandardPlants = () => {
    updateData(current => ({
      ...current,
      hasCreatedPlant: false,
      plants: [],
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
        <View style={styles.emptyPlants}>
          <EmptyState
            text="Add a plant to start saving planting dates, notes, and care actions."
            title="Your garden is empty"
          />
          <Button
            icon="↺"
            label="Show Standard Plants"
            onPress={showStandardPlants}
            style={styles.standardPlantsButton}
            variant="soft"
          />
        </View>
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
      <Image source={plantSource(plant)} style={styles.plantThumb} />
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
        source={plantSource(plant)}
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
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [activeField, setActiveField] = useState<AddPlantFieldKey>('name');
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>('letters');
  const [capsEnabled, setCapsEnabled] = useState(true);
  const [selections, setSelections] = useState<Record<AddPlantFieldKey, TextSelection>>({
    name: {start: 0, end: 0},
    species: {start: 0, end: 0},
    date: {start: date.length, end: date.length},
    description: {start: 0, end: 0},
  });
  const imageKey = useMemo(() => plantImageKeys[count % plantImageKeys.length], [count]);

  const canSave = name.trim().length > 1;
  const fieldOrder: AddPlantFieldKey[] = ['name', 'species', 'date', 'description'];
  const fieldValues: Record<AddPlantFieldKey, string> = {
    name,
    species,
    date,
    description,
  };
  const fieldSetters: Record<AddPlantFieldKey, (value: string) => void> = {
    name: setName,
    species: setSpecies,
    date: setDate,
    description: setDescription,
  };

  const activateField = (field: AddPlantFieldKey) => {
    const value = fieldValues[field];

    setActiveField(field);
    setKeyboardMode(field === 'date' ? 'numbers' : 'letters');
    setCapsEnabled(value.length === 0);
    setSelections(current => {
      const selection = current[field];
      if (selection.start !== 0 || selection.end !== 0 || value.length === 0) {
        return current;
      }
      return {...current, [field]: {start: value.length, end: value.length}};
    });
  };

  const updateFieldSelection = (field: AddPlantFieldKey, selection: TextSelection) => {
    setSelections(current => ({...current, [field]: selection}));
  };

  const updateActiveField = (nextValue: string, cursor: number) => {
    const selection = {start: cursor, end: cursor};

    fieldSetters[activeField](nextValue);
    setSelections(current => ({...current, [activeField]: selection}));
  };

  const insertKeyboardText = (text: string) => {
    const value = fieldValues[activeField];
    const selection = selections[activeField];
    const start = Math.min(selection.start, value.length);
    const end = Math.min(selection.end, value.length);
    const insertAt = Math.min(start, end);
    const removeUntil = Math.max(start, end);
    const nextValue = `${value.slice(0, insertAt)}${text}${value.slice(removeUntil)}`;

    updateActiveField(nextValue, insertAt + text.length);
  };

  const removeKeyboardText = () => {
    const value = fieldValues[activeField];
    const selection = selections[activeField];
    const start = Math.min(selection.start, value.length);
    const end = Math.min(selection.end, value.length);

    if (start !== end) {
      const insertAt = Math.min(start, end);
      const removeUntil = Math.max(start, end);
      updateActiveField(`${value.slice(0, insertAt)}${value.slice(removeUntil)}`, insertAt);
      return;
    }

    if (start === 0) {
      return;
    }

    updateActiveField(`${value.slice(0, start - 1)}${value.slice(start)}`, start - 1);
  };

  const clearActiveField = () => {
    updateActiveField('', 0);
    setCapsEnabled(true);
  };

  const moveToNextField = () => {
    const index = fieldOrder.indexOf(activeField);
    activateField(fieldOrder[(index + 1) % fieldOrder.length]);
  };

  const pickPhoto = async () => {
    const allowed = await requestGalleryPermission();

    if (!allowed) {
      Alert.alert('Gallery access needed', 'Allow photo access to choose a plant image.');
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });

    if (result.didCancel) {
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setPhotoUri(uri);
    } else if (result.errorMessage) {
      Alert.alert('Photo picker error', result.errorMessage);
    }
  };

  return (
    <Page activeTab={activeTab} onTabChange={onTabChange}>
      <View style={styles.addHeader}>
        <IconButton icon="‹" onPress={onBack} />
        <Text style={styles.addTitle}>Add New Plant</Text>
      </View>

      <Text style={styles.sectionLabel}>Choose Photo</Text>
      <Pressable onPress={pickPhoto} style={styles.photoBox}>
        <Image source={photoUri ? {uri: photoUri} : images[imageKey]} style={styles.photoPreview} />
        <View style={styles.photoOverlay}>
          <Text style={styles.photoIcon}>📷</Text>
          <Text style={styles.photoText}>
            {photoUri ? 'Tap to change photo' : 'Tap to add photo'}
          </Text>
        </View>
      </Pressable>

      <CustomKeyboardField
        active={activeField === 'name'}
        id="name"
        label="Plant Name *"
        onActivate={activateField}
        onChangeText={setName}
        onSelectionChange={updateFieldSelection}
        placeholder="e.g. Cherry Tomato"
        selection={selections.name}
        value={name}
      />
      <CustomKeyboardField
        active={activeField === 'species'}
        id="species"
        label="Species"
        onActivate={activateField}
        onChangeText={setSpecies}
        onSelectionChange={updateFieldSelection}
        placeholder="e.g. Solanum lycopersicum"
        selection={selections.species}
        value={species}
      />
      <CustomKeyboardField
        active={activeField === 'date'}
        id="date"
        label="Date Planted"
        onActivate={activateField}
        onChangeText={setDate}
        onSelectionChange={updateFieldSelection}
        placeholder="30.04.2026"
        selection={selections.date}
        value={date}
      />
      <CustomKeyboardField
        active={activeField === 'description'}
        id="description"
        label="Description"
        multiline
        onActivate={activateField}
        onChangeText={setDescription}
        onSelectionChange={updateFieldSelection}
        placeholder="Describe your plant, where it is growing, any special notes"
        selection={selections.description}
        value={description}
      />
      <CompactCustomKeyboard
        canLineBreak={activeField === 'description'}
        capsEnabled={capsEnabled}
        mode={keyboardMode}
        onBackspace={removeKeyboardText}
        onClear={clearActiveField}
        onEnter={() => insertKeyboardText('\n')}
        onInput={text => {
          if (keyboardMode === 'letters' && text.length === 1 && /[a-z]/.test(text)) {
            insertKeyboardText(capsEnabled ? text.toUpperCase() : text);
            if (capsEnabled) {
              setCapsEnabled(false);
            }
            return;
          }
          insertKeyboardText(text);
        }}
        onModeChange={setKeyboardMode}
        onNext={moveToNextField}
        onSpace={() => insertKeyboardText(' ')}
        onToggleCaps={() => setCapsEnabled(current => !current)}
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
            photoUri,
            actions: [],
          })
        }
      />
    </Page>
  );
}

function CustomKeyboardField<FieldKey extends string>({
  id,
  label,
  value,
  placeholder,
  multiline,
  active,
  selection,
  onActivate,
  onChangeText,
  onSelectionChange,
}: {
  id: FieldKey;
  label: string;
  value: string;
  placeholder?: string;
  multiline?: boolean;
  active: boolean;
  selection: TextSelection;
  onActivate: (field: FieldKey) => void;
  onChangeText: (text: string) => void;
  onSelectionChange: (field: FieldKey, selection: TextSelection) => void;
}): React.JSX.Element {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.customFieldLabel, active && styles.customFieldLabelActive]}>
        {label}
      </Text>
      <TextInput
        contextMenuHidden
        multiline={multiline}
        onChangeText={onChangeText}
        onFocus={() => onActivate(id)}
        onPressIn={() => onActivate(id)}
        onSelectionChange={event => onSelectionChange(id, event.nativeEvent.selection)}
        placeholder={placeholder}
        placeholderTextColor={colors.dim}
        selection={active ? selection : undefined}
        showSoftInputOnFocus={false}
        style={[
          styles.customInput,
          multiline && styles.customTextArea,
          active && styles.customInputActive,
        ]}
        value={value}
      />
    </View>
  );
}

function CompactCustomKeyboard({
  mode,
  capsEnabled,
  canLineBreak,
  compact,
  onInput,
  onBackspace,
  onSpace,
  onEnter,
  onNext,
  onClear,
  onModeChange,
  onToggleCaps,
}: {
  mode: KeyboardMode;
  capsEnabled: boolean;
  canLineBreak: boolean;
  compact?: boolean;
  onInput: (text: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onEnter: () => void;
  onNext: () => void;
  onClear: () => void;
  onModeChange: (mode: KeyboardMode) => void;
  onToggleCaps: () => void;
}): React.JSX.Element {
  const rows = mode === 'letters' ? letterRows : numberRows;

  return (
    <View style={[styles.keyboard, compact && styles.keyboardCompact]}>
      <View style={[styles.keyboardModeRow, compact && styles.keyboardModeRowCompact]}>
        <KeyboardKey
          active={mode === 'letters'}
          compact={compact}
          label="ABC"
          onPress={() => onModeChange('letters')}
          style={styles.modeKey}
        />
        <KeyboardKey
          active={mode === 'numbers'}
          compact={compact}
          label="123"
          onPress={() => onModeChange('numbers')}
          style={styles.modeKey}
        />
        <KeyboardKey compact={compact} label="Clear" onPress={onClear} style={styles.clearKey} />
      </View>

      {rows.map((row, rowIndex) => (
        <View
          key={`${mode}-${rowIndex}`}
          style={[
            styles.keyboardRow,
            compact && styles.keyboardRowCompact,
            rowIndex === 1 && styles.keyboardRowInset,
            compact && rowIndex === 1 && styles.keyboardRowInsetCompact,
          ]}>
          {row.map(key => (
            <KeyboardKey
              compact={compact}
              key={key}
              label={mode === 'letters' && capsEnabled ? key.toUpperCase() : key}
              onPress={() => onInput(key)}
            />
          ))}
        </View>
      ))}

      <View style={[styles.keyboardActionRow, compact && styles.keyboardActionRowCompact]}>
        <KeyboardKey
          active={capsEnabled}
          compact={compact}
          label="⇧"
          onPress={onToggleCaps}
          style={styles.utilityKey}
        />
        <KeyboardKey compact={compact} label="Space" onPress={onSpace} style={styles.spaceKey} />
        <KeyboardKey
          compact={compact}
          label={canLineBreak ? '↵' : 'Next'}
          onPress={canLineBreak ? onEnter : onNext}
          style={styles.utilityKey}
        />
        <KeyboardKey compact={compact} label="⌫" onPress={onBackspace} style={styles.utilityKey} />
      </View>
    </View>
  );
}

function KeyboardKey({
  label,
  onPress,
  active,
  compact,
  style,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  compact?: boolean;
  style?: ViewStyle;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.keyboardKey,
        compact && styles.keyboardKeyCompact,
        active && styles.keyboardKeyActive,
        pressed && styles.pressed,
        style,
      ]}>
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[
          styles.keyboardKeyText,
          compact && styles.keyboardKeyTextCompact,
          active && styles.keyboardKeyTextActive,
        ]}>
        {label}
      </Text>
    </Pressable>
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
  const [activeField, setActiveField] = useState<CareActionFieldKey>('date');
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>('numbers');
  const [capsEnabled, setCapsEnabled] = useState(false);
  const [selections, setSelections] = useState<Record<CareActionFieldKey, TextSelection>>({
    date: {start: date.length, end: date.length},
    note: {start: 0, end: 0},
  });
  const fieldOrder: CareActionFieldKey[] = ['date', 'note'];
  const fieldValues: Record<CareActionFieldKey, string> = {
    date,
    note,
  };
  const fieldSetters: Record<CareActionFieldKey, (value: string) => void> = {
    date: setDate,
    note: setNote,
  };

  const activateField = (field: CareActionFieldKey) => {
    const value = fieldValues[field];

    setActiveField(field);
    setKeyboardMode(field === 'date' ? 'numbers' : 'letters');
    setCapsEnabled(field !== 'date' && value.length === 0);
    setSelections(current => {
      const selection = current[field];
      if (selection.start !== 0 || selection.end !== 0 || value.length === 0) {
        return current;
      }
      return {...current, [field]: {start: value.length, end: value.length}};
    });
  };

  const updateFieldSelection = (field: CareActionFieldKey, selection: TextSelection) => {
    setSelections(current => ({...current, [field]: selection}));
  };

  const updateActiveField = (nextValue: string, cursor: number) => {
    const selection = {start: cursor, end: cursor};

    fieldSetters[activeField](nextValue);
    setSelections(current => ({...current, [activeField]: selection}));
  };

  const insertKeyboardText = (text: string) => {
    const value = fieldValues[activeField];
    const selection = selections[activeField];
    const start = Math.min(selection.start, value.length);
    const end = Math.min(selection.end, value.length);
    const insertAt = Math.min(start, end);
    const removeUntil = Math.max(start, end);
    const nextValue = `${value.slice(0, insertAt)}${text}${value.slice(removeUntil)}`;

    updateActiveField(nextValue, insertAt + text.length);
  };

  const removeKeyboardText = () => {
    const value = fieldValues[activeField];
    const selection = selections[activeField];
    const start = Math.min(selection.start, value.length);
    const end = Math.min(selection.end, value.length);

    if (start !== end) {
      const insertAt = Math.min(start, end);
      const removeUntil = Math.max(start, end);
      updateActiveField(`${value.slice(0, insertAt)}${value.slice(removeUntil)}`, insertAt);
      return;
    }

    if (start === 0) {
      return;
    }

    updateActiveField(`${value.slice(0, start - 1)}${value.slice(start)}`, start - 1);
  };

  const clearActiveField = () => {
    updateActiveField('', 0);
    setCapsEnabled(activeField === 'note');
  };

  const moveToNextField = () => {
    const index = fieldOrder.indexOf(activeField);
    activateField(fieldOrder[(index + 1) % fieldOrder.length]);
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <Pressable onPress={onClose} style={styles.modalBackdrop} />
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Log Care Action</Text>
          <IconButton icon="×" onPress={onClose} />
        </View>
        <ScrollView
          contentContainerStyle={styles.sheetBody}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.sheetScroll}>
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
          <CustomKeyboardField
            active={activeField === 'date'}
            id="date"
            label="Date"
            onActivate={activateField}
            onChangeText={setDate}
            onSelectionChange={updateFieldSelection}
            placeholder="30.04.2026"
            selection={selections.date}
            value={date}
          />
          <CustomKeyboardField
            active={activeField === 'note'}
            id="note"
            label="Notes"
            multiline
            onActivate={activateField}
            onChangeText={setNote}
            onSelectionChange={updateFieldSelection}
            placeholder="Add notes (optional)"
            selection={selections.note}
            value={note}
          />
          <CompactCustomKeyboard
            compact
            canLineBreak={activeField === 'note'}
            capsEnabled={capsEnabled}
            mode={keyboardMode}
            onBackspace={removeKeyboardText}
            onClear={clearActiveField}
            onEnter={() => insertKeyboardText('\n')}
            onInput={text => {
              if (keyboardMode === 'letters' && text.length === 1 && /[a-z]/.test(text)) {
                insertKeyboardText(capsEnabled ? text.toUpperCase() : text);
                if (capsEnabled) {
                  setCapsEnabled(false);
                }
                return;
              }
              insertKeyboardText(text);
            }}
            onModeChange={setKeyboardMode}
            onNext={moveToNextField}
            onSpace={() => insertKeyboardText(' ')}
            onToggleCaps={() => setCapsEnabled(current => !current)}
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
        </ScrollView>
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
  pressed: {
    opacity: 0.78,
  },
  list: {
    gap: 14,
  },
  emptyPlants: {
    alignItems: 'center',
  },
  standardPlantsButton: {
    alignSelf: 'center',
    marginTop: -56,
    minWidth: 230,
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
  fieldWrap: {
    marginBottom: 14,
  },
  customFieldLabel: {
    color: colors.muted,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '900',
    marginBottom: 7,
  },
  customFieldLabelActive: {
    color: colors.green,
  },
  customInput: {
    minHeight: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '700',
  },
  customInputActive: {
    borderColor: colors.green,
    backgroundColor: colors.panelStrong,
  },
  customTextArea: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  keyboard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#09170c',
    padding: 8,
    gap: 7,
    marginBottom: 16,
  },
  keyboardCompact: {
    borderRadius: 13,
    padding: 6,
    gap: 5,
    marginBottom: 14,
  },
  keyboardModeRow: {
    flexDirection: 'row',
    gap: 7,
  },
  keyboardModeRowCompact: {
    gap: 5,
  },
  keyboardRow: {
    flexDirection: 'row',
    gap: 5,
  },
  keyboardRowCompact: {
    gap: 4,
  },
  keyboardRowInset: {
    paddingHorizontal: 12,
  },
  keyboardRowInsetCompact: {
    paddingHorizontal: 8,
  },
  keyboardActionRow: {
    flexDirection: 'row',
    gap: 7,
  },
  keyboardActionRowCompact: {
    gap: 5,
  },
  keyboardKey: {
    flex: 1,
    minWidth: 0,
    minHeight: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    paddingHorizontal: 4,
  },
  keyboardKeyCompact: {
    minHeight: 27,
    borderRadius: 8,
    paddingHorizontal: 3,
  },
  keyboardKeyActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  keyboardKeyText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '900',
  },
  keyboardKeyTextCompact: {
    fontSize: 12,
    lineHeight: 14,
  },
  keyboardKeyTextActive: {
    color: colors.black,
  },
  modeKey: {
    flex: 0.8,
  },
  clearKey: {
    flex: 1.1,
  },
  utilityKey: {
    flex: 0.75,
  },
  spaceKey: {
    flex: 2,
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
    maxHeight: '92%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: colors.panel,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
  },
  sheetBody: {
    paddingBottom: 2,
  },
  sheetScroll: {
    flexShrink: 1,
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
