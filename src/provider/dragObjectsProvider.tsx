import React, { createContext, useContext, useState } from "react";
import { Object } from "../types/Room";

type DragObjectsContextValue<T> = {
  draggedItem: T | null;
  pointerPosition: { x: number; y: number };
  draggedItemRank: number | null;
  setDraggedItemRank: (rank: number | null) => void;
  setDraggedItem: (item: T | null) => void;
  setPointerPosition: (position: { x: number; y: number }) => void;
  rankedItems: T[];
  notRankedItems: T[];
  setItems: (items: T[], userId: string) => void;
  handleDrop: () => void;
  rearangeRanked: (from: number, to: number) => void;
  getObjectRanking: () => Array<{ object: string; rank: number }>;
  reload: () => void;
};

const DragObjectsContext = createContext<
  DragObjectsContextValue<Object> | undefined
>(undefined);

export const DragObjectsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [draggedItem, setDraggedItem] = useState<Object | null>(null);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [rankedItems, setRankedItems] = useState<Object[]>([]);
  const [notRankedItems, setNotRankedItems] = useState<Object[]>([]);
  const [draggedItemRank, setDraggedItemRank] = useState<number | null>(null);

  const setItems = (items: Object[], userId: string) => {
    const ranked = items.filter((o) =>
      o.ranking.some((r) => r.user === userId),
    );
    const notRanked = items.filter(
      (o) => !o.ranking.some((r) => r.user === userId),
    );
    setRankedItems(ranked);
    setNotRankedItems(notRanked);
  };

  const reload = () => {
    setRankedItems([]);
    setNotRankedItems([...rankedItems, ...notRankedItems]);
  };

  const getObjectRanking = (): Array<{ object: string; rank: number }> => {
    const objectRanking = rankedItems.map((o, i) => ({
      object: o._id,
      rank: i + 1,
    }));
    return objectRanking;
  };

  const rearangeRanked = (from: number, to: number) => {
    const newItems = rankedItems.slice();
    const [removed] = newItems.splice(from, 1);
    newItems.splice(to, 0, removed);
    setRankedItems(newItems);
  };

  const handleDrop = () => {
    if (draggedItem && draggedItemRank !== null) {
      const newRankedItems = rankedItems.slice();
      newRankedItems.splice(draggedItemRank, 0, draggedItem);
      setRankedItems(newRankedItems);
      setNotRankedItems(
        notRankedItems.filter((o) => o._id !== draggedItem._id),
      );
      setDraggedItemRank(null);
      setDraggedItem(null);
      setPointerPosition({ x: 0, y: 0 });
    } else if (draggedItem && draggedItemRank === null) {
      setDraggedItem(null);
      setPointerPosition({ x: 0, y: 0 });
    }
  };

  return (
    <DragObjectsContext.Provider
      value={{
        draggedItem,
        pointerPosition,
        draggedItemRank,
        setDraggedItem,
        setPointerPosition,
        setDraggedItemRank,
        rankedItems,
        notRankedItems,
        setItems,
        handleDrop,
        rearangeRanked,
        getObjectRanking,
        reload,
      }}
    >
      {children}
    </DragObjectsContext.Provider>
  );
};

export const useDragObjectsContext = () => {
  const context = useContext(DragObjectsContext);
  if (!context) {
    throw new Error("useDragContext must be used within a DragProvider");
  }
  return context;
};
