import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

interface AppState {
  temp_email: string; // Change this to the type of your single value
}

interface AppContextProps {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

type AppAction = { type: 'SET_EMAIL'; payload: string }; // Change this to match the type of your single value

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return {
        ...state,
        temp_email: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AppState = {
    temp_email: '', // Initial value
};

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { AppProvider, useAppContext };