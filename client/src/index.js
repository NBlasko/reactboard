import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactBoard from './components/ReactBoard';
import 'bootswatch/dist/cerulean/bootstrap.min.css'
//import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import { Provider } from 'react-redux';



//ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
    <Provider store={store}>
        <ReactBoard />
    </Provider>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
