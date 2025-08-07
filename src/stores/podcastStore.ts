/**
 * Basic Podcast Store
 */

import { create } from 'zustand';

export interface Podcast {
  id: string;
  title: string;
  host: string;
  category: string;
  description: string;
  episodes: Episode[];
  coverUrl?: string;
  rating: number;
  isSubscribed: boolean;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  duration: number;
  publishDate: Date;
  url: string;
  isPlayed: boolean;
  playPosition: number;
}

interface PodcastState {
  podcasts: Podcast[];
  currentEpisode: Episode | null;
  subscriptions: string[];
  
  // Actions
  setPodcasts: (podcasts: Podcast[]) => void;
  setCurrentEpisode: (episode: Episode) => void;
  subscribe: (podcastId: string) => void;
  unsubscribe: (podcastId: string) => void;
  markAsPlayed: (episodeId: string) => void;
}

export const usePodcastStore = create<PodcastState>((set, get) => ({
  podcasts: [],
  currentEpisode: null,
  subscriptions: [],
  
  setPodcasts: (podcasts) => {
    set({ podcasts });
  },
  
  setCurrentEpisode: (episode) => {
    set({ currentEpisode: episode });
  },
  
  subscribe: (podcastId) => {
    set((state) => ({
      subscriptions: [...state.subscriptions, podcastId],
      podcasts: state.podcasts.map((podcast) =>
        podcast.id === podcastId 
          ? { ...podcast, isSubscribed: true }
          : podcast
      ),
    }));
  },
  
  unsubscribe: (podcastId) => {
    set((state) => ({
      subscriptions: state.subscriptions.filter(id => id !== podcastId),
      podcasts: state.podcasts.map((podcast) =>
        podcast.id === podcastId 
          ? { ...podcast, isSubscribed: false }
          : podcast
      ),
    }));
  },
  
  markAsPlayed: (episodeId) => {
    set((state) => ({
      podcasts: state.podcasts.map((podcast) => ({
        ...podcast,
        episodes: podcast.episodes.map((episode) =>
          episode.id === episodeId 
            ? { ...episode, isPlayed: true }
            : episode
        ),
      })),
    }));
  },
}));