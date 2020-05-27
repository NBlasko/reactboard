import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './style/theme/';
import Layout from './components/layout/Layout';
import CssBaseline from '@material-ui/core/CssBaseline';
import store from './store/store.js';

function App() {
  return (
    <Provider store={store}>
       <CssBaseline />
      <ThemeProvider theme={theme}>
        <Layout />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
