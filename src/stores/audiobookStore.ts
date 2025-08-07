/**
 * Basic Audiobook Store
 */

import { create } from 'zustand';

export interface Audiobook {
  id: string;
  title: string;
  author: string;
  narrator: string;
  duration: number;
  category: string;
  description: string;
  coverUrl?: string;
  rating: number;
  chapters: Chapter[];
  isDownloaded: boolean;
  downloadProgress?: number;
}

export interface Chapter {
  id: string;
  title: string;
  duration: number;
  url: string;
  position: number;
}

interface AudiobookState {
  audiobooks: Audiobook[];
  currentAudiobook: Audiobook | null;
  isLoading: boolean;
  
  // Actions
  setAudiobooks: (audiobooks: Audiobook[]) => void;
  setCurrentAudiobook: (audiobook: Audiobook) => void;
  downloadAudiobook: (id: string) => Promise<void>;
}

export const useAudiobookStore = create<AudiobookState>((set, get) => ({
  audiobooks: [],
  currentAudiobook: null,
  isLoading: false,
  
  setAudiobooks: (audiobooks) => {
    set({ audiobooks });
  },
  
  setCurrentAudiobook: (audiobook) => {
    set({ currentAudiobook: audiobook });
  },
  
  downloadAudiobook: async (id) => {
    set({ isLoading: true });
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));
      set((state) => ({
        audiobooks: state.audiobooks.map((book) =>
          book.id === id ? { ...book, isDownloaded: true } : book
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));