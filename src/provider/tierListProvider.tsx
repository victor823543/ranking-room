import React, { createContext, useContext, useState } from "react";
import { Object as ObjectType } from "../types/Room";

type TierListContextValue<T> = {
  draggedItem: T | null;
  pointerPosition: { x: number; y: number };
  draggedItemTier: number | null;
  setDraggedItemTier: (tier: number | null) => void;
  setDraggedItem: (item: T | null) => void;
  setPointerPosition: (position: { x: number; y: number }) => void;
  rankedItems: Record<number, T[]>; // Key is the tier points value
  notRankedItems: T[];
  setItems: (items: T[], userId: string) => void;
  handleDrop: () => void;
  moveItem: (id: string, from: number, to: number) => void;
  getObjectRanking: () => Array<{ object: string; tier: number }>;
  reload: (items: ObjectType[]) => void;
};

const TierListContext = createContext<
  TierListContextValue<ObjectType> | undefined
>(undefined);

export const TierListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [draggedItem, setDraggedItem] = useState<ObjectType | null>(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [rankedItems, setRankedItems] = useState<Record<number, ObjectType[]>>(
    [],
  );
  const [notRankedItems, setNotRankedItems] = useState<ObjectType[]>([]);
  const [draggedItemTier, setDraggedItemTier] = useState<number | null>(null);

  const setItems = (items: ObjectType[], userId: string) => {
    let ranked: Record<number, ObjectType[]> = {};
    items.forEach((item) => {
      const userRanking = item.ranking.find((r) => r.user === userId);
      if (userRanking && userRanking.tier) {
        if (userRanking.tier in ranked) {
          ranked[userRanking.tier].push(item);
        } else {
          ranked[userRanking.tier] = [item];
        }
      }
    });
    const notRanked = items.filter(
      (o) => !o.ranking.some((r) => r.user === userId),
    );
    setRankedItems(ranked);
    setNotRankedItems(notRanked);
  };

  const reload = (items: ObjectType[]) => {
    setRankedItems([]);
    setNotRankedItems(items);
  };

  const getObjectRanking = (): Array<{ object: string; tier: number }> => {
    let objectRanking: Array<{ object: string; tier: number }> = [];
    console.log("RankedItems:", rankedItems);

    Object.entries(rankedItems).forEach(([tier, objects]) => {
      objects.forEach((object) => {
        objectRanking.push({
          object: object._id,
          tier: parseInt(tier),
        });
      });
    });
    console.log("ObjectRanking: ", objectRanking);
    return objectRanking;
  };

  const moveItem = (id: string, from: number, to: number) => {
    if (from === to) return;
    const itemToMove = rankedItems[from].find((o) => o._id === id);
    if (itemToMove) {
      setRankedItems((prev) => {
        const newObj = { ...prev };
        if (to in newObj) {
          newObj[to].push(itemToMove);
        } else {
          newObj[to] = [itemToMove];
        }

        newObj[from] = newObj[from].filter((o) => o._id !== id);
        return newObj;
      });
    }
  };

  const handleDrop = () => {
    if (draggedItem && draggedItemTier !== null) {
      setRankedItems((prev) => {
        const newRankedItems = { ...prev };
        if (draggedItemTier in prev) {
          newRankedItems[draggedItemTier] = [
            ...prev[draggedItemTier],
            draggedItem,
          ];
        } else {
          newRankedItems[draggedItemTier] = [draggedItem];
        }
        return newRankedItems;
      });

      setNotRankedItems(
        notRankedItems.filter((o) => o._id !== draggedItem._id),
      );

      setDraggedItemTier(null);
      setDraggedItem(null);
      setPointerPosition({ x: 0, y: 0 });
    } else if (draggedItem && draggedItemTier === null) {
      setDraggedItem(null);
      setPointerPosition({ x: 0, y: 0 });
    }
  };

  return (
    <TierListContext.Provider
      value={{
        draggedItem,
        pointerPosition,
        draggedItemTier,
        setDraggedItem,
        setPointerPosition,
        setDraggedItemTier,
        rankedItems,
        notRankedItems,
        setItems,
        handleDrop,
        moveItem,
        getObjectRanking,
        reload,
      }}
    >
      {children}
    </TierListContext.Provider>
  );
};

export const useTierListContext = () => {
  const context = useContext(TierListContext);
  if (!context) {
    throw new Error("useDragContext must be used within a DragProvider");
  }
  return context;
};
