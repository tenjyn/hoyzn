import React from 'react';
import { AppContextProvider } from '@/AppContext';
import AppCore from '@/AppCore';

const App = () => {
  return (
    <AppContextProvider>
      <AppCore />
    </AppContextProvider>
  );
};

export default App;
