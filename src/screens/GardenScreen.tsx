import React, {useMemo, useState} from 'react';
import {Image, Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {images} from '../assets/images';
import {Button, Header, Page} from '../components/ui';
import {gardenAreas, virtualPlants} from '../data/content';
import {colors} from '../theme';
import type {AppData, GardenSlot, TabKey, VirtualPlant} from '../types';

type Props = {
  data: AppData;
  updateData: (updater: (data: AppData) => AppData) => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

type SlotTarget = {
  areaId: string;
  slotIndex: number;
};

export function GardenScreen({
  data,
  updateData,
  activeTab,
  onTabChange,
}: Props): React.JSX.Element {
  const [shopTarget, setShopTarget] = useState<SlotTarget | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<GardenSlot | null>(null);
  const slotMap = useMemo(() => {
    const map = new Map<string, GardenSlot>();
    data.gardenSlots.forEach(slot => map.set(slot.id, slot));
    return map;
  }, [data.gardenSlots]);

  const buyPlant = (plant: VirtualPlant) => {
    if (!shopTarget || data.points < plant.price) {
      return;
    }
    const id = `${shopTarget.areaId}-${shopTarget.slotIndex}`;
    updateData(current => ({
      ...current,
      points: current.points - plant.price,
      gardenSlots: [
        ...current.gardenSlots.filter(slot => slot.id !== id),
        {
          id,
          areaId: shopTarget.areaId,
          slotIndex: shopTarget.slotIndex,
          plantId: plant.id,
          water: 60,
          food: 60,
        },
      ],
    }));
    setShopTarget(null);
  };

  const updateSlot = (slot: GardenSlot) => {
    updateData(current => ({
      ...current,
      gardenSlots: current.gardenSlots.map(item => (item.id === slot.id ? slot : item)),
    }));
    setSelectedSlot(slot);
  };

  const removeSlot = (slotId: string) => {
    updateData(current => ({
      ...current,
      gardenSlots: current.gardenSlots.filter(slot => slot.id !== slotId),
    }));
    setSelectedSlot(null);
  };

  return (
    <>
      <Page activeTab={activeTab} onTabChange={onTabChange}>
        <Header
          eyebrow="Your Space"
          right={
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsStar}>⭐</Text>
              <Text style={styles.pointsValue}>{data.points}</Text>
              <Text style={styles.pointsLabel}>pts</Text>
            </View>
          }
          title="Virtual Garden"
        />
        <Text style={styles.subtitle}>
          Tap empty pots to plant. Water and feed your plants to keep them healthy.
        </Text>

        <View style={styles.areas}>
          {gardenAreas.map(area => {
            const count = data.gardenSlots.filter(slot => slot.areaId === area.id).length;
            return (
              <View key={area.id} style={styles.area}>
                <View style={styles.areaHeader}>
                  <Text style={styles.areaName}>{area.icon} {area.label}</Text>
                  <View style={styles.areaLine} />
                  <Text style={styles.areaCount}>{count}/3 planted</Text>
                </View>
                <View style={styles.slots}>
                  {[0, 1, 2].map(slotIndex => {
                    const slot = slotMap.get(`${area.id}-${slotIndex}`);
                    return (
                      <GardenSlotCard
                        key={`${area.id}-${slotIndex}`}
                        onEmpty={() => setShopTarget({areaId: area.id, slotIndex})}
                        onPlant={() => slot && setSelectedSlot(slot)}
                        slot={slot}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

      </Page>

      <ShopModal
        balance={data.points}
        onBuy={buyPlant}
        onClose={() => setShopTarget(null)}
        visible={Boolean(shopTarget)}
      />
      <PlantControlsModal
        onClose={() => setSelectedSlot(null)}
        onFertilize={slot => updateSlot({...slot, food: Math.min(100, slot.food + 20)})}
        onRemove={removeSlot}
        onWater={slot => updateSlot({...slot, water: Math.min(100, slot.water + 20)})}
        slot={selectedSlot}
      />
    </>
  );
}

function GardenSlotCard({
  slot,
  onEmpty,
  onPlant,
}: {
  slot?: GardenSlot;
  onEmpty: () => void;
  onPlant: () => void;
}): React.JSX.Element {
  const plant = slot ? virtualPlants.find(item => item.id === slot.plantId) : undefined;

  if (!slot || !plant) {
    return (
      <Pressable onPress={onEmpty} style={styles.emptySlot}>
        <View style={styles.plusCircle}>
          <Text style={styles.plus}>＋</Text>
        </View>
        <Text style={styles.emptySlotText}>Plant here</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPlant} style={styles.plantedSlot}>
      <Image resizeMode="contain" source={images[plant.imageKey]} style={styles.virtualPlant} />
      <StatusBarLine icon="💧" value={slot.water} />
      <StatusBarLine icon="⚡" value={slot.food} />
    </Pressable>
  );
}

function StatusBarLine({icon, value}: {icon: string; value: number}): React.JSX.Element {
  return (
    <View style={styles.statusLine}>
      <Text style={styles.statusIcon}>{icon}</Text>
      <View style={styles.statusTrack}>
        <View style={[styles.statusFill, {width: `${value}%` as `${number}%`}]} />
      </View>
      <Text style={styles.statusValue}>{value}%</Text>
    </View>
  );
}

function ShopModal({
  visible,
  balance,
  onClose,
  onBuy,
}: {
  visible: boolean;
  balance: number;
  onClose: () => void;
  onBuy: (plant: VirtualPlant) => void;
}): React.JSX.Element {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <Pressable onPress={onClose} style={styles.modalBackdrop} />
      <View style={styles.shopSheet}>
        <View style={styles.shopHeader}>
          <View>
            <Text style={styles.shopTitle}>🛍 Plant Shop</Text>
            <Text style={styles.shopBalance}>⭐ Balance: {balance} pts</Text>
          </View>
          <Pressable onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>
        <ScrollView
          bounces
          contentContainerStyle={styles.shopGrid}
          nestedScrollEnabled
          scrollEnabled
          style={styles.shopScroll}
          showsVerticalScrollIndicator={false}>
          {virtualPlants.map(plant => {
            const canBuy = balance >= plant.price;
            return (
              <Pressable
                disabled={!canBuy}
                key={plant.id}
                onPress={() => onBuy(plant)}
                style={[styles.shopItem, !canBuy && styles.shopItemDisabled]}>
                <Image resizeMode="contain" source={images[plant.imageKey]} style={styles.shopImage} />
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>{plant.price} pts</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

function PlantControlsModal({
  slot,
  onClose,
  onWater,
  onFertilize,
  onRemove,
}: {
  slot: GardenSlot | null;
  onClose: () => void;
  onWater: (slot: GardenSlot) => void;
  onFertilize: (slot: GardenSlot) => void;
  onRemove: (slotId: string) => void;
}): React.JSX.Element {
  const plant = slot ? virtualPlants.find(item => item.id === slot.plantId) : undefined;

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={Boolean(slot)}>
      <View style={styles.modalBackdrop} />
      {slot && plant ? (
        <View style={styles.controlCard}>
          <Pressable onPress={onClose} style={styles.controlClose}>
            <Text style={styles.controlCloseText}>×</Text>
          </Pressable>
          <Image resizeMode="contain" source={images[plant.imageKey]} style={styles.controlImage} />
          <Text style={styles.controlTitle}>{plant.name}</Text>
          <StatusBarLine icon="💧" value={slot.water} />
          <StatusBarLine icon="⚡" value={slot.food} />
          <View style={styles.controlButtons}>
            <Button icon="💧" label="Water" onPress={() => onWater(slot)} style={styles.controlButton} />
            <Button icon="⚡" label="Feed" onPress={() => onFertilize(slot)} style={styles.controlButton} />
          </View>
          <Button
            icon="↻"
            label="Replace"
            onPress={() => onRemove(slot.id)}
            style={styles.replaceButton}
            variant="danger"
          />
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  pointsBadge: {
    minWidth: 112,
    height: 46,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    backgroundColor: colors.panelSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 12,
  },
  pointsStar: {
    fontSize: 17,
  },
  pointsValue: {
    color: colors.yellow,
    fontSize: 18,
    fontWeight: '900',
  },
  pointsLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: -8,
    marginBottom: 18,
  },
  areas: {
    gap: 24,
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  areaName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  areaLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lineSoft,
  },
  areaCount: {
    color: colors.dim,
    fontSize: 12,
    fontWeight: '800',
  },
  area: {},
  slots: {
    flexDirection: 'row',
    gap: 12,
  },
  emptySlot: {
    flex: 1,
    aspectRatio: 0.82,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.lineSoft,
    backgroundColor: 'rgba(17, 42, 19, 0.58)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panelSoft,
    marginBottom: 10,
  },
  plus: {
    color: colors.green,
    fontSize: 23,
    fontWeight: '900',
  },
  emptySlotText: {
    color: colors.dim,
    fontSize: 12,
  },
  plantedSlot: {
    flex: 1,
    aspectRatio: 0.82,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    backgroundColor: colors.panel,
    padding: 9,
  },
  virtualPlant: {
    width: '100%',
    height: 72,
  },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  statusIcon: {
    fontSize: 12,
    width: 16,
  },
  statusTrack: {
    flex: 1,
    height: 6,
    borderRadius: 5,
    backgroundColor: colors.panelSoft,
    overflow: 'hidden',
  },
  statusFill: {
    height: '100%',
    backgroundColor: colors.yellow,
  },
  statusValue: {
    color: colors.green,
    fontSize: 9,
    fontWeight: '900',
    width: 24,
    textAlign: 'right',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  shopSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '76%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 32,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  shopTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  shopBalance: {
    color: colors.yellow,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 8,
  },
  closeText: {
    color: colors.muted,
    fontSize: 34,
    lineHeight: 36,
  },
  shopScroll: {
    flex: 1,
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 90,
  },
  shopItem: {
    width: '47%',
    aspectRatio: 1.08,
    borderRadius: 15,
    backgroundColor: colors.panelSoft,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    padding: 10,
  },
  shopItemDisabled: {
    opacity: 0.42,
  },
  shopImage: {
    width: '100%',
    height: '82%',
  },
  priceBadge: {
    position: 'absolute',
    left: 12,
    bottom: 10,
    borderRadius: 13,
    backgroundColor: colors.green,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  priceText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
  },
  controlCard: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '22%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    padding: 20,
  },
  controlClose: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 2,
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    backgroundColor: colors.panelSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlCloseText: {
    color: colors.text,
    fontSize: 25,
    lineHeight: 28,
    fontWeight: '800',
  },
  controlImage: {
    height: 130,
    alignSelf: 'center',
    marginBottom: 10,
  },
  controlTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  controlButton: {
    flex: 1,
  },
  replaceButton: {
    marginTop: 10,
  },
});
