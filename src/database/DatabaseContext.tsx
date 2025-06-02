import React, { createContext, useContext, useState, useEffect } from 'react';
import { setupDatabase } from './db';

interface DatabaseContextType {
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isLoading: true,
  isReady: false,
  error: null
});

export const useDatabaseContext = () => useContext(DatabaseContext);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DatabaseContextType>({
    isLoading: true,
    isReady: false,
    error: null
  });

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await setupDatabase();
        setState({ isLoading: false, isReady: true, error: null });
      } catch (error) {
        console.error('Database initialization failed:', error);
        setState({ isLoading: false, isReady: false, error: error as Error });
      }
    };

    initDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={state}>
      {children}
    </DatabaseContext.Provider>
  );
};