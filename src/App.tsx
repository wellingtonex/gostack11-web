import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GobalStyle from './styles/global';
import Signin from './pages/SignIn';
import ToasCotainer from './components/ToastContainer';

import { AuthProvider } from './hooks/AuthContext';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <Signin />
    </AuthProvider>

    <ToasCotainer />
    <GobalStyle />
  </>
);

export default App;
