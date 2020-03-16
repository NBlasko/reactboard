import React from 'react';
import { Provider } from 'react-redux';
//import ReactBoard from './components/ReactBoard';
import Layout from './components/layout/Layout';
import store from './store/store.js';

function App() {
  return (
    <Provider store={store}>
        <Layout />
    </Provider>
  );
}

export default App;
