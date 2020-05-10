import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GobalStyle from './styles/global';
import Signin from './pages/SignIn';
import AppProvider from './hooks';

const App: React.FC = () => (
  <>
    <AppProvider>
      <Signin />
    </AppProvider>
    <GobalStyle />
  </>
);

export default App;
