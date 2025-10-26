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
  const [eventName, setEventNameState] = useState<string>(DEFAULT_EVENT_NAME);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedName = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedName) {
        setEventNameState(storedName);
      }
    } catch (error) {
      console.error('Could not access local storage for event name', error);
    }
    setIsInitialized(true);
  }, []);

  const setEventName = (name: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, name);
      setEventNameState(name);
    } catch (error) {
      console.error('Could not save event name to local storage', error);
    }
  };

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

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
