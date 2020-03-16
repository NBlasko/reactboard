import React from 'react';
import { Provider } from 'react-redux';
import ReactBoard from './components/ReactBoard';
import store from './store/store.js';

function App() {
  return (
    <Provider store={store}>
        <ReactBoard />
    </Provider>
  );
}

export default App;
