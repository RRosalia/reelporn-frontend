'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Video {
  id: number;
  title: string;
  [key: string]: any;
}

interface MiniPlayerContextType {
  isOpen: boolean;
  queue: Video[];
  currentIndex: number;
  openMiniPlayer: (video: Video) => void;
  addToQueue: (video: Video) => void;
  closeMiniPlayer: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
}

const MiniPlayerContext = createContext<MiniPlayerContextType | undefined>(undefined);

interface MiniPlayerProviderProps {
  children: ReactNode;
}

export function MiniPlayerProvider({ children }: MiniPlayerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openMiniPlayer = (video: Video) => {
    setQueue([video]);
    setCurrentIndex(0);
    setIsOpen(true);
  };

  const addToQueue = (video: Video) => {
    setQueue(prevQueue => [...prevQueue, video]);
  };

  const closeMiniPlayer = () => {
    setIsOpen(false);
    setQueue([]);
    setCurrentIndex(0);
  };

  const goToNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  return (
    <MiniPlayerContext.Provider
      value={{
        isOpen,
        queue,
        currentIndex,
        openMiniPlayer,
        addToQueue,
        closeMiniPlayer,
        goToNext,
        goToPrevious
      }}
    >
      {children}
    </MiniPlayerContext.Provider>
  );
}

export function useMiniPlayer(): MiniPlayerContextType {
  const context = useContext(MiniPlayerContext);
  if (!context) {
    throw new Error('useMiniPlayer must be used within a MiniPlayerProvider');
  }
  return context;
}
