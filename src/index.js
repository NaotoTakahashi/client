import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import './index.css';
import reducers from './reducers/rootReducer';
import Main from './containers/MainContainer';
import rootSaga from './sagas/sagas';
import mainMiddleware from './middlewares/MainMiddleware';
import loginMiddleware from './middlewares/LoginMiddleware';
import orderMiddleware from './middlewares/OrderMiddleware';
import orderListMiddleware from './middlewares/OrderListMiddleware';
import fullBoardMiddleware from './middlewares/FullBoardMiddleware';
import chartMiddleware from './middlewares/ChartMiddleware';
import boardMiddleware from './middlewares/BoardMiddleware';
import assetMiddleware from './middlewares/AssetMiddleware';
import {setInitialPosition} from "./actions/FrameActions";
//import registerServiceWorker from './registerServiceWorker';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [
	sagaMiddleware,
	mainMiddleware,
	loginMiddleware,
	orderMiddleware,
	orderListMiddleware,
	fullBoardMiddleware,
	chartMiddleware,
	boardMiddleware,
	assetMiddleware,
];
//const store = createStore(reducers, applyMiddleware(sagaMiddleware, mainMiddleware, loginMiddleware, orderMiddleware, orderListMiddleware, fullBoardMiddleware, chartMiddleware, assetMiddleware));
const store = createStore(reducers, applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);
store.dispatch(setInitialPosition(20, 50));
global.App = ReactDOM.render(
	<Provider store={store}>
		<Main />
	</Provider>
	, document.getElementById('root'));
//registerServiceWorker();