import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GobalStyle from './styles/global';
import Signin from './pages/SignIn';

import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <Signin />
    </AuthProvider>
    <GobalStyle />
  </>
);

export default App;
