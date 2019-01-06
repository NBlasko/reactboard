import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactBoard from './components/ReactBoard';
import 'bootswatch/dist/cerulean/bootstrap.min.css'
import registerServiceWorker from './registerServiceWorker';

import store from './store';
import { Provider } from 'react-redux';




ReactDOM.render(
    <Provider store={store}>
        <ReactBoard />
    </Provider>, document.getElementById('root'));
registerServiceWorker();
