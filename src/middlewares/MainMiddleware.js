
import {ReportWSSVUrl} from '../Conf';
import {getCookie} from '../Utility';
import CreateWebSocket from '../api/WebSocket';
import * as BoardActions from '../actions/BoardActions';
import {updateNotice, breakSocket} from '../actions/ReportActions';
import RCApiConf from "../RCApiConf";
import * as RCApiActions from "../actions/RCApiActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
import * as MainActions from "../actions/MainActions";
import {getMainState} from "../reducers/MainReducer";

import RCApi from "../api/RCApi/RCApi";
import RCCallback from "../api/RCApi/RCCallback";

class MyRCCallback extends RCCallback {
	constructor(store) {
		super();
		this.store = store;
	}
	onReceiveOpenAck(msg) {
		this.store.dispatch(ReportSVApiActions.getKabuOrderListRequest(getCookie('ApiKey')));
		this.store.dispatch(RCApiActions.webSocketOpened());
	}
	onReceiveFeedRegistAck(msg) {
		this.store.dispatch(RCApiActions.registFeedAck(msg));
	}
	onReceiveFeedUnregistAck(msg) {
		this.store.dispatch(RCApiActions.unregistFeedAck(msg));
	}
	onReceiveFeedReal(msg) {
		this.store.dispatch(RCApiActions.updateFeed(msg));
	}/*
	onReceiveBoardRegistAck(msg) {
		this.store.dispatch(RCApiActions.registBoardAck(msg));
	}
	onReceiveBoardUnregistAck(msg) {
		this.store.dispatch(RCApiActions.unregistBoardAck(msg));
	}*/
	onReceiveBoardReal(msg) {
		this.store.dispatch(RCApiActions.updateBoard(msg));
	}
	onReceiveTickRegistAck(msg) {
		this.store.dispatch(RCApiActions.registTickAck(msg));
	}
	onReceiveTickReal(msg) {
		this.store.dispatch(RCApiActions.updateTick(msg));
	}
	onReceiveKabuSummary(msg) {
		this.store.dispatch(RCApiActions.kabuSummary(msg));
	}
	onReceiveKabuYakuzyouSikkou(msg) {
		this.store.dispatch(RCApiActions.kabuYakuzyouSikkou(msg));
	}
	onClose(event) {
		this.store.dispatch(RCApiActions.webSocketClosed(event));
	}
}
let ReportWebSock = null;
export const RcApi = new RCApi(RCApiConf);

function start(store) {
	// Report Websocket接続
	let request = { MsgType: "LOGIN", ApiKey: getCookie('ApiKey'), NoticeNumber: "0" };
	ReportWebSock = CreateWebSocket(ReportWSSVUrl, request, handleReportOnReady(store), handleReportOnMessage(store), handleReportOnError, handleReportOnClose(store));
	store.dispatch(ReportSVApiActions.webSocketOpening());

	// MIOS WebSocket接続
	let callback = new MyRCCallback(store);
	RcApi.callback = callback;
	RcApi.open();
	store.dispatch(RCApiActions.webSocketOpening());

	// ユーザー設定読み込み
	// dispatch

	// 注文情報読み込み

	// 板1～3を作成
	for(let i=1;i <= 3;i++) {
		const id = "BOARD" + i;
		store.dispatch(BoardActions.addBoard(id));
	}
}

function stop() {
	if(ReportWebSock) {
		ReportWebSock.close();
	}
	if(RcApi && RcApi.websock) {
		RcApi.websock.close();
	}
}

const handleReportOnMessage = store => obj => {
	store.dispatch(updateNotice(obj));
}

const handleReportOnError = error => {
	console.log("ReportWebSock Error");
	console.log(error);
}

const handleReportOnClose = store => event => {
	console.log("ReportWebSock Close");
	store.dispatch(ReportSVApiActions.webSocketClosed());
	console.log(event);
}

const handleReportOnReady = store => event => {
	console.log("ReportWebSock Loginned");
	store.dispatch(ReportSVApiActions.webSocketOpened());
	console.log(event);
}

export default store => next => action => {
	// -- intercept process---------------------------------------------
	
	//------------------------------------------------------------------
	next(action);
	// -- after process-------------------------------------------------
	if(action.type === ReportSVApiActions.LOGIN_SUCCESS) {
		start(store);
	}
	if(action.type === ReportSVApiActions.LOGOUT_SUCCESS) {
		stop(store);
		store.dispatch(ReportSVApiActions.webSocketClosing());
		store.dispatch(RCApiActions.webSocketClosing());
	}
	completeLogout(store, action);
}

// ログアウトの完全終了判定
const completeLogout = (store, action) => {
	const mainState = getMainState(store.getState());
	if(action.type === ReportSVApiActions.LOGOUT_SUCCESS) {
		if(mainState.ReportSockStatus === "0" && mainState.WSSVStatus === "0") {
			store.dispatch(MainActions.logoutCompleted());
		}
	}
	if(action.type === ReportSVApiActions.WEB_SOCKET_CLOSED) {
		if(mainState.RAPSVStatus === "0" && mainState.WSSVStatus === "0") {
			store.dispatch(MainActions.logoutCompleted());
		}
	}
	if(action.type === RCApiActions.WEB_SOCKET_CLOSED) {
		if(mainState.RAPSVStatus === "0" && mainState.ReportSockStatus === "0") {
			store.dispatch(MainActions.logoutCompleted());
		}
	}
}

