/**
 * Basic Player Store
 */

import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  artwork?: string;
  category: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  queue: Track[];
  currentIndex: number;
  
  // Actions
  setTrack: (track: Track) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (position: number) => void;
  next: () => void;
  previous: () => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: {
    id: '1',
    title: 'Forest Rain Meditation',
    artist: 'Nature Sounds',
    duration: 1200,
    url: '',
    category: 'Meditation',
  },
  isPlaying: false,
  position: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  
  setTrack: (track: Track) => {
    set({ currentTrack: track, position: 0 });
  },
  
  play: () => {
    set({ isPlaying: true });
  },
  
  pause: () => {
    set({ isPlaying: false });
  },
  
  stop: () => {
    set({ isPlaying: false, position: 0 });
  },
  
  seekTo: (position: number) => {
    set({ position });
  },
  
  next: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextTrack = queue[nextIndex];
      set({ 
        currentTrack: nextTrack, 
        currentIndex: nextIndex,
        position: 0 
      });
    }
  },
  
  previous: () => {
    const { queue, currentIndex } = get();
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevTrack = queue[prevIndex];
      set({ 
        currentTrack: prevTrack, 
        currentIndex: prevIndex,
        position: 0 
      });
    }
  },
  
  setQueue: (tracks: Track[]) => {
    set({ queue: tracks, currentIndex: 0 });
    if (tracks.length > 0) {
      set({ currentTrack: tracks[0] });
    }
  },
  
  addToQueue: (track: Track) => {
    const { queue } = get();
    set({ queue: [...queue, track] });
  },
}));