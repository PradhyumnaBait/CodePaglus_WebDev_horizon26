'use client';

// ============================================================
// OpsPulse — Socket.io Provider
// Connects to WebSocket server, dispatches events to stores
// ============================================================
import { useEffect, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { WS_URL, WS_EVENTS, DEFAULT_STORE_ID } from '@/lib/config/constants';
import { useDashboardStore } from '@/store/dashboardStore';
import { useAlertsStore } from '@/store/alertsStore';
import { useSocketStore } from '@/store/socketStore';
import type { StressScore, Alert, EventFeedItem, WarRoomIncident } from '@/types';

let socket: Socket | null = null;

interface SocketProviderProps {
  children: ReactNode;
  storeId?: string;
}

export function SocketProvider({ children, storeId = DEFAULT_STORE_ID }: SocketProviderProps) {
  const { setStatus } = useSocketStore();
  const { setStressScore, pushStressHistory, activateWarRoom } = useDashboardStore();
  const { addAlert, updateAlert } = useAlertsStore();
  const { pushEvent } = useSocketStore();

  useEffect(() => {
    // Lazy connect — only once
    if (!socket) {
      socket = io(WS_URL, {
        transports:         ['websocket', 'polling'],
        reconnectionDelay:  1_000,
        reconnectionAttempts: 5,
        timeout:            10_000,
      });
    }

    // ---- Connection Events ----
    socket.on(WS_EVENTS.CONNECT, () => {
      setStatus('connected');
      // Join store room
      socket?.emit('join_store', storeId);
    });

    socket.on(WS_EVENTS.DISCONNECT, () => setStatus('disconnected'));
    socket.on(WS_EVENTS.CONNECT_ERROR, () => setStatus('error'));

    // ---- Score Update ----
    socket.on(WS_EVENTS.SCORE_UPDATE, (payload: StressScore) => {
      setStressScore(payload);
      pushStressHistory({
        timestamp: payload.timestamp,
        value:     payload.stress_score,
      });
    });

    // ---- Alert Events ----
    socket.on(WS_EVENTS.ALERT_CREATED, (alert: Alert) => {
      addAlert(alert);
    });

    socket.on(WS_EVENTS.ALERT_UPDATED, (payload: { id: string; update: Partial<Alert> }) => {
      updateAlert(payload.id, payload.update);
    });

    // ---- War Room ----
    socket.on(WS_EVENTS.WAR_ROOM_ACTIVATED, (incident: WarRoomIncident) => {
      activateWarRoom(incident);
    });

    // ---- Event Feed ----
    socket.on(WS_EVENTS.EVENT_FEED, (event: EventFeedItem) => {
      pushEvent(event);
    });

    return () => {
      // Only unbind listeners, don't disconnect (keep connection alive)
      socket?.off(WS_EVENTS.CONNECT);
      socket?.off(WS_EVENTS.DISCONNECT);
      socket?.off(WS_EVENTS.CONNECT_ERROR);
      socket?.off(WS_EVENTS.SCORE_UPDATE);
      socket?.off(WS_EVENTS.ALERT_CREATED);
      socket?.off(WS_EVENTS.ALERT_UPDATED);
      socket?.off(WS_EVENTS.WAR_ROOM_ACTIVATED);
      socket?.off(WS_EVENTS.EVENT_FEED);
    };
  }, [storeId, setStatus, setStressScore, pushStressHistory, activateWarRoom, addAlert, updateAlert, pushEvent]);

  return <>{children}</>;
}
