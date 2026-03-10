// ============================================================
// OpsPulse — Socket Zustand Store
// ============================================================
import { create } from 'zustand';
import type { SocketSlice, EventFeedItem, ConnectionStatus } from '@/types';
import { DEFAULT_STORE_ID } from '@/lib/config/constants';

const MAX_FEED_ITEMS = 50;

export const useSocketStore = create<SocketSlice>()((set, get) => ({
  status:   'disconnected',
  storeId:  DEFAULT_STORE_ID,
  eventFeed: [],

  // Derived accessor — components use `events` for readability
  get events() { return get().eventFeed; },

  setStatus: (status: ConnectionStatus) =>
    set({ status }),

  setStoreId: (id: string) =>
    set({ storeId: id }),

  pushEvent: (event: EventFeedItem) =>
    set((state) => ({
      eventFeed: [event, ...state.eventFeed.slice(0, MAX_FEED_ITEMS - 1)],
    })),

  clearFeed: () =>
    set({ eventFeed: [] }),
}));
