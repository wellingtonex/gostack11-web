import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';

import GobalStyle from './styles/global';
import AppProvider from './hooks';

const App: React.FC = () => (
  <BrowserRouter>
    <AppProvider>
      <Routes />
    </AppProvider>
    <GobalStyle />
  </BrowserRouter>
);

export default App;
