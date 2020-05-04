import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GobalStyle from './styles/global';
import Signin from './pages/Signin';

const App: React.FC = () => (
  <>
    <Signin />
    <GobalStyle />
  </>
);

export default App;
