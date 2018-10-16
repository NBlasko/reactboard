import React from 'react';
import ReactDOM from 'react-dom';


import ReactBoard from './components/ReactBoard';

import registerServiceWorker from './registerServiceWorker';

import store from './store';
import { Provider } from 'react-redux';




ReactDOM.render(
    <Provider store={store}>
        <ReactBoard />
    </Provider>, document.getElementById('root'));
registerServiceWorker();
