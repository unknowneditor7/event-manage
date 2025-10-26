'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface EventNameContextType {
  eventName: string;
  setEventName: (name: string) => void;
}

const EventNameContext = createContext<EventNameContextType | undefined>(undefined);

const DEFAULT_EVENT_NAME = 'FestPay';
const LOCAL_STORAGE_KEY = 'eventName';

export function EventNameProvider({ children }: { children: ReactNode }) {
  const [eventName, setEventNameState] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_EVENT_NAME;
    }
    try {
      const storedName = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedName ? storedName : DEFAULT_EVENT_NAME;
    } catch (error) {
      console.error('Could not access local storage for event name', error);
      return DEFAULT_EVENT_NAME;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, eventName);
    } catch (error) {
      console.error('Could not save event name to local storage', error);
    }
  }, [eventName]);

  const setEventName = (name: string) => {
    setEventNameState(name);
  };

  return (
    <EventNameContext.Provider value={{ eventName, setEventName }}>
      {children}
    </EventNameContext.Provider>
  );
}

export function useEventNameContext() {
  const context = useContext(EventNameContext);
  if (context === undefined) {
    throw new Error('useEventNameContext must be used within an EventNameProvider');
  }
  return context;
}
