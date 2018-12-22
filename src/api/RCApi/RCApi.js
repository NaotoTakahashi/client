import {CO_FeedDataBase, CO_FeedRecord, CO_SVHandles} from "../Common/CO_Feed";
import * as CO_Board from "../Common/CO_Board";
import * as CO_Feed from "../Common/CO_Feed";
import * as RCMsg from "./RCMsg";

function createWebSocket(url, request, onMessage, onError, onClose) {
    let webSocket = new WebSocket(url);
    webSocket.onopen = function() {
        console.log("onopen");
        webSocket.send(JSON.stringify(request));
        console.log(request);
    }
    webSocket.onmessage = function(event) {
		var obj = JSON.parse(event.data);
		console.log("onMessage:");
		console.log(obj);
        if(onMessage) {
            onMessage(obj);
        }
    }
    webSocket.onerror = function (error) {
        console.log('WebSocket Error ' + error);
        if(onError) {
            onError(error);
        }
    }
    webSocket.onclose = function(event) {
        console.log("onclose");
        if(onClose) {
            onClose(event);
        }
    }
    return webSocket;
}

export const feedCodeToKey = (source, market, issueCode) => {
	if((source === undefined || source === null) || (market === undefined || market === null) || !issueCode) return undefined;
	return source + "," + market + "," + issueCode;
}

export const feedKeyToCode = (key) => {
	if(!key) return undefined;
	const code = key.split(",");
	if(code.length !==3 ) return undefined;
	return {
		source: Number(code[0]),
		marketCode: code[1],
		issueCode: code[2],
	};
}

export const boardCodeToKey = (secType, market, issueCode) => {
	if(!String(secType) || (market === undefined || market === null) || !issueCode) return undefined;
	return secType + "," + market + "," + issueCode;
}

export const boardKeyToCode = (key) => {
	if(!key) return undefined;
	const code = key.split(",");
	if(code.length !== 3) return undefined;
	return {
		secType: code[0],
		marketCode: code[1],
		issueCode: code[2],
	};
}

export default class RCApi {
	constructor(conf) {
		this.conf = conf;
		this.websock = null;
		this.linkup = false;
		this.ready = false;
		if(this.conf.SEND_TIME_OUT) {
			this.timeOut = this.conf.SEND_TIME_OUT;
		} else {
			this.timeOut = 120;
		}
		if(this.conf.KEEPALIVE_TIME_OUT) {
			this.keepAliveTimeOut = this.conf.KEEPALIVE_TIME_OUT;
		} else {
			this.keepAliveTimeOut = 120;
		}
		this.callback = null;
		/*
		if(this.conf.AP_SERVER_NAME_2 && this.conf.AP_SERVER_PORT_2) {
			this.secondaly = true;
		} else {
			this.secondaly = false;
		}
		*/
		this.feedCache = new CO_FeedDataBase();
		this.boardCache = new CO_Board.CO_Board();
		/*
		this.mstCache = new RCMstCache();
		this.stockOrderCache = new RCStockOrderCache();
		this.derivOrderCache = new RCHaseiOrderCache();
		this.hokanCache = new RCHokanCache();
		this.sinyoCache = new RCHSinyouPositionCache();
		this.futureCache = new RCHHaseiPositionCache();
		this.optionCache = new RCHHaseiPositionCash();
		this.newsCache = new RCNewsCash();
		*/
		this.lastRecvTime = 0;
		this.lastKeepAliveTime = 0;
		this.lastAliveTime = 0;
		this.recvInterval = 0;
	}
	// control methods
	open(sid) {
		let loginMsg = new RCMsg.RCLoginRequestMsg(sid);
		this.websock = createWebSocket(this.conf.WSSVURL, loginMsg, this.onReceive, this.onError, this.onClose);
		return true;
	}
	close() {
		this.websock.close();
	}
	// callback methods
	registCallback(callback){
		this.callback = callback;
	}
	unregistCallback(){
		this.callback = null;
	}

	// request methods
	requestLogin(){}
	requestKabuPreOrder(){}
	requestKabuNewOrder(){}
	requestKabuCorrectOrder(){}
	requestKabuCancelOrder(){}
	requestHaseiPreOrder(){}
	requestHaseiNewOrder(){}
	requestHaseiCorrectOrder(){}
	requestHaseiCancelOrder(){}
	requestSaveBoard(){}
	requestSaveTorihikiZyouken(){}
	requestSaveMeigaraZyouken(){}
	requestResendPosition(){}

	// regist methods
	registFeed(handle, row, src, issueCode, marketCode) {
		if(!this.checkIssueCode(issueCode) || !this.checkMarketCode(marketCode)) return false;
		const key = feedCodeToKey(src, marketCode, issueCode);
		if(!key) return false;
		let svHandles = new CO_SVHandles();
		if(!this.feedCache.regist(src, key, handle, row, svHandles)) {
			return false;
		}
		if(svHandles.unRegistHandle) {
			// 登録解除要求電文送信
			let unregistMsg = new RCMsg.RCFeedUnregistRequestMsg(svHandles.unRegistHandle);
			this.websock.send(JSON.stringify(unregistMsg));
		}
		if(svHandles.registHandle) {
			// 登録要求電文送信
			let registMsg = new RCMsg.RCFeedRegistRequestMsg(svHandles.registHandle, src, marketCode, issueCode);
			this.websock.send(JSON.stringify(registMsg));
		} else {
			// 既にデータが存在するのでデータを取得して下位へ配信
			let feedRec = new CO_FeedRecord();
			if(this.feedCache.getRec(src, key, feedRec)) {
				let ackMsg = new RCMsg.RCFeedRegistAckMsg();
				ackMsg.handle = handle;
				ackMsg.row = row;
				ackMsg.setFeedRec(feedRec);
				this.onEvent(ackMsg);
			}
		}
		return true;
	}
	unregistFeed(handle, row) {
		let svHandles = new CO_SVHandles();
		if(!this.feedCache.unregistClHandle(handle, row, svHandles)) {
			return false;
		}
		if(svHandles.unRegistHandle) {
			// 登録解除要求電文送信
			let unregistMsg = new RCMsg.RCFeedUnregistRequestMsg(svHandles.unRegistHandle);
			this.websock.send(JSON.stringify(unregistMsg));
		}
		return true;
	}

	fillPrimaryMarket_feed(feedRegistAckMsg) {
		const msg = feedRegistAckMsg;
		this.feedCache.fillPrimaryMarket(msg.handle, msg.marketCode);
	}
	
	// 板登録要求
	// priceType, priceDec, price は中心値指定時に使用する
	registBoard(handle, secType, issueCode, marketCode, priceType=0, priceDec=0, price=0) {
		if(!this.checkIssueCode(issueCode) || !this.checkMarketCode(marketCode)) return false;
		let svHandles = new CO_Board.CO_BoardSVHandles();
		const key = boardCodeToKey(secType, marketCode, issueCode);
		if(!key) return false;
		const boardReal = new CO_Board.CO_BoardReal();
		const errObj = new CO_Board.CO_BoardErrorObj();
		if(!this.boardCache.regist(handle, secType, key, priceType, priceDec, price, svHandles, boardReal, errObj)) {
			// 登録失敗
			return false;
		}

		if(svHandles.unRegistHandle) {
			// 登録解除要求電文送信
			const unregistMsg = new RCMsg.RCDepthUnregistRequestMsg(svHandles.unRegistSecType, svHandles.unRegistHandle);
			this.websock.send(JSON.stringify(unregistMsg));
		}
		if(svHandles.registHandle) {
			// 登録要求電文送信
			const registMsg = new RCMsg.RCDepthRegistRequestMsg(secType, svHandles.registHandle, marketCode, issueCode);
			this.websock.send(JSON.stringify(registMsg));
		}
		// 既にデータが存在するのでデータを取得して下位へ配信
		if(errObj.errCode !== CO_Board.BOARD_ERRCODE.NO_DATA) {
			const boardRealMsg = new RCMsg.RCBoardRealMsg();
			boardRealMsg.fromCO(boardReal);
			boardRealMsg.handle = handle;
			this.onEvent(boardRealMsg);
		}
		
		return true;
	}
	unregistBoard(handle) {
		let svHandles = new CO_Board.CO_BoardSVHandles();
		const errObj = new CO_Board.CO_BoardErrorObj();
		if(!this.boardCache.unregist(handle, svHandles, errObj)) {
			// 登録解除失敗
			return false;
		}
		if(svHandles.unRegistHandle) {
			// 登録解除要求電文送信
			const msg = new RCMsg.RCDepthUnregistRequestMsg(svHandles.unRegistSecType, svHandles.unRegistHandle);
			this.websock.send(JSON.stringify(msg));
		}
		return true;
	}
	fillPrimaryMarket_depth(depthRegistAckMsg) {
		const msg = depthRegistAckMsg;
		this.boardCache.fillPrimaryMarket(msg.handle, msg.marketCode);
	}

	registTick(handle, issueCode, marketCode, periodType, minValue, adjust, subCode) {
		if(!this.checkIssueCode(issueCode) || !this.checkMarketCode(marketCode)) return false;
		let msg = new RCMsg.RCTickRegistRequestMsg(handle, 0, marketCode, issueCode, periodType, minValue, adjust, subCode);
		this.websock.send(JSON.stringify(msg));
		return true;
	}
	unregistTick(handle) {
		let msg = new RCMsg.RCTickUnregistRequestMsg(handle);
		this.websock.send(JSON.stringify(msg));
		return true;
	}

	// requestGetTickに変更？
	getTick(handle, issueCode, marketCode, type, adjust) {
		return true;
	}

	// read cache methods
	getInfoCode(market, code, quote) {}
	getFeedRec(source, marketCode, issueCode) {}

	// access mst methods
	getIssueMstkabu(issueCode){}
	getIssueSizyouMstKabu(issueCode, market){}
	getIssueSizyouKiseiKabu(issueCode, market){}
	getIssueSizyouMstSak(issueCode){}
	getIssueSizyouMstOp(issueCode){}

	// onReceive
	onReceiveLoginAck = (msg) => {
		// 呼値テーブルを作成
		for(const offeredNums of msg.offeredPrice) {
			for(const offeredPrice of offeredNums.offeredPriceList) {
				const rcOfferedPrice = new RCMsg.RCOfferedPriceData(offeredPrice);
				const newOfferedData = new CO_Board.CO_OfferedPriceData();
				rcOfferedPrice.intoCO(offeredNums.offeredNumber, newOfferedData);
				this.boardCache.addOffered(newOfferedData);
			}
		}
		this.onEvent(msg);
	}
	
	onReceiveFeedRegistAck = (msg) => {
		if(msg.status === "A00") {
			// 正常応答
			this.fillPrimaryMarket_feed(msg);
			let rec = new CO_FeedRecord();
			const key = feedCodeToKey(msg.source, msg.marketCode, msg.issueCode);
			if(!this.feedCache.getRec(msg.source, key, rec)) {
				rec.clear(msg.source, key, msg.handle, msg.status);
			}
			// 下位配信メッセージのベースを作成
			let baseMsg = new RCMsg.RCFeedRegistAckMsg();
			baseMsg.source = msg.source;
			baseMsg.marketCode = msg.marketCode;
			baseMsg.issueCode = msg.issueCode;
			baseMsg.status = msg.status;
			baseMsg.name = msg.name;
			baseMsg.unitLot = msg.unitLot;
			baseMsg.loanType = msg.loanType;
			baseMsg.yobineTaniNumber = msg.yobineTaniNumber;
			// マスタデータをレコードオブジェクトに設定
			rec.setMasterInfo(msg.name, msg.unitLot, msg.loanType, msg.yobineTaniNumber);
			// 初期データをレコードオブジェクトに設定
			for(let d of msg.feedDataList) {
				if(this.feedCache.setValue(rec, d.name, d.serial, d.status, d.data)) {
					let n = new RCMsg.RCFeedData(d);
					baseMsg.feedDataList.push(n);
				}
			}
			// キャッシュデータにレコードオブジェクトをセット
			let sockList = [];
			if(this.feedCache.update(rec, sockList)) {
				// 下位に配信
				for(let sockHandle of sockList) {
					let newMsg = new RCMsg.RCFeedRegistAckMsg(baseMsg);
					newMsg.handle = sockHandle.sock;
					newMsg.row = sockHandle.handle;
					this.onEvent(newMsg);
				}
			} else {
				// 上位への登録を解除
				let request = new RCMsg.RCFeedUnregistRequestMsg();
				request.handle = msg.handle;
				this.websock.send(JSON.stringify(request));
			}
		} else if(msg.status !== "A01") {
			// エラー
			let sockList = [];
			if(this.feedCache.remove(msg.handle, sockList)) {
				for(let sockHandle of sockList) {
					let newMsg = new RCMsg.RCFeedUnregistAckMsg();
					newMsg.handle = sockHandle.sock;
					newMsg.row = sockHandle.handle;
					newMsg.status = msg.status;
					this.onEvent(newMsg);
				}
			}
		}
	}
	onReceiveFeedReal = (msg) => {
		let rec = new CO_Feed.CO_FeedRecord();
		const key = feedCodeToKey(msg.source, msg.marketCode, msg.issueCode);
		if(!this.feedCache.getRec(msg.source, key, rec)) {
			rec.clear(msg.source, key, msg.handle, msg.status);
		}
		// 下位配信メッセージのベースを作成
		let baseMsg = new RCMsg.RCFeedRealMsg();
		baseMsg.source = msg.source;
		baseMsg.marketCode = msg.marketCode;
		baseMsg.issueCode = msg.issueCode;
		for(let d of msg.feedDataList) {
			if(this.feedCache.setValue(rec, d.name, d.serial, d.status, d.data)) {
				let n = new RCMsg.RCFeedData(d);
				baseMsg.feedDataList.push(n);
			}
		}
		// キャッシュデータを更新
		let sockList = [];
		if(this.feedCache.update(rec, sockList)) {
			// 下位に配信
			for(let sockHandle of sockList) {
				let newMsg = new RCMsg.RCFeedRealMsg(baseMsg);
				newMsg.handle = sockHandle.sock;
				newMsg.row = sockHandle.handle;
				this.onEvent(newMsg);
			}
		} else {
			// 上位への登録を解除
			let request = new RCMsg.RCFeedUnregistRequestMsg();
			request.handle = msg.handle;
			this.websock.send(JSON.stringify(request));
		}
	}
	onReceiveFeedDisable = (msg) => {
		// キャッシュデータを更新
		let accessCodeList = [];
		this.feedCache.disable(accessCodeList);
		// 下位に配信
		for(let accessCode of accessCodeList) {
			for(let [sock, clHandleMap] of accessCode.sockMap) {
				for(let handle of clHandleMap.keys()) {
					let newMsg = new RCMsg.RCFeedUnregistAckMsg();
					newMsg.handle = sock;
					newMsg.row = handle;
					newMsg.status = "A99";
					this.onEvent(newMsg);
				}
			}
		}
	}
	onReceiveDepthRegistAck = (msg) => {
		this.fillPrimaryMarket_depth(msg);
		const key = boardCodeToKey(msg.secType, msg.marketCode, msg.issueCode);
		let boardReal = new CO_Board.CO_BoardReal();
		boardReal.code = key;
		if(msg.status === "A00" || msg.status === "A01") {
			// マスタ情報を初期化する
			const master = new CO_Board.CO_MasterData();
			master.code = key;
			master.name = msg.name;
			master.offeredNumber = msg.offeredNumber;
			master.basePriceType = msg.basePrice.type;
			master.basePriceDec = msg.basePrice.decimalPoint;
			master.basePrice = msg.basePrice.data;
			this.boardCache.initMaster(key, master);
			// データをセットする
			if(msg.status === "A01" || msg.updateNumber) {
				let depth = new CO_Board.CO_BoardDepth();
				const registAckMsgObj = new RCMsg.RCDepthRegistAckMsg(msg);
				registAckMsgObj.intoBoardDepth(depth);
				if(this.boardCache.addBoardDepth(depth)) {
					boardReal.result = CO_Board.ST_RESULT.ST_NORMAL;
					boardReal.reason = CO_Board.RESULT_REASON.RESULT_NONE;
					const boardRealList = [];
					if(this.boardCache.makeEvent(boardReal, boardRealList)) {
						// 下位に配信
						for(const coBR of boardRealList) {
							const newMsg = new RCMsg.RCBoardRealMsg();
							newMsg.fromCO(coBR);
							newMsg.status = msg.status;
							newMsg.issueName = msg.name;				// 初回のみマスタ情報を付加
							newMsg.yobineNumber = msg.yobineTaniNumber;	// 初回のみマスタ情報を付加
							newMsg.basePrice = msg.basePrice;			// 初回のみマスタ情報を付加
							newMsg.unitLot = msg.unitLot;				// 初回のみマスタ情報を付加
							newMsg.loanType = msg.loanType;				// 初回のみマスタ情報を付加
							this.onEvent(newMsg);
						}
					}
				}
			}
		} else if(msg.status !== "A10") {
			// エラー処理
			boardReal.result = CO_Board.ST_RESULT.ST_ERROR;
			boardReal.reason = CO_Board.RESULT_REASON.RESULT_NOT_FOUND;
			const boardRealList = [];
			this.boardCache.makeEvent(boardReal, boardRealList);
			// 下位に配信
			let newMsg = new RCMsg.RCBoardRealMsg();
			newMsg.status = msg.status;
			this.onEvent(newMsg);
		}
	}
	onReceiveDepthUnregistAck = (msg) => {
		
	}
	onReceiveDepthReal = (msg) => {
		const data = new CO_Board.CO_BoardDepth();
		const realMsgObj = new RCMsg.RCDepthRealMsg(msg);
		realMsgObj.intoBoardDepth(data);
		// 板情報を更新
		if(this.boardCache.addBoardDepth(data)) {
			// Ackが未処理(マスタ情報が未確定)の場合は下位配信しない
			if(!this.boardCache.isInit(data.code)) return true;
			
			const boardReal = new CO_Board.CO_BoardReal();
			const key = boardCodeToKey(msg.secType, msg.marketCode, msg.issueCode);
			boardReal.code = key;
			boardReal.result = CO_Board.ST_RESULT.ST_NORMAL;
			boardReal.reason = CO_Board.RESULT_REASON.RESULT_NONE;
			const boardRealList = [];
			if(this.boardCache.makeEvent(boardReal, boardRealList)) {
				// 下位に配信
				for(const coBR of boardRealList) {
					const newMsg = new RCMsg.RCBoardRealMsg();
					newMsg.fromCO(coBR);
					this.onEvent(newMsg);
				}
			}
		}
	}
	onReceiveDepthDisable = (msg) => {
	}
	onReceiveTickRegistAck = (msg) => {
		this.onEvent(msg);
	}
	onReceiveTickReal = (msg) => {
		this.onEvent(msg);
	}
	onReceiveKabuNotice = (msg) => {
		const noticeList = msg.noticeList;
		for(let i = 0; i < noticeList.length; i++){
			noticeList[i].msgType = noticeList[i].noticeType;
			noticeList[i].salesCode = msg.salesCode;
			noticeList[i].kokyakuName = msg.kokyakuName;
			this.onEvent(noticeList[i]);
		}
	}
	onReceive = (msg) => {
		if(!msg.msgType) return;
		if(msg.msgType === RCMsg.RCLoginAckMsg.msgType()) {
			this.onReceiveLoginAck(msg);
		}
		if(msg.msgType === RCMsg.RCFeedRegistAckMsg.msgType()) {
			this.onReceiveFeedRegistAck(msg);
		}
		if(msg.msgType === RCMsg.RCFeedRealMsg.msgType()) {
			this.onReceiveFeedReal(msg);
		}
		if(msg.msgType === RCMsg.RCFeedDisableMsg.msgType()) {
			this.onReceiveFeedDisable(msg);
		}
		if(msg.msgType === RCMsg.RCDepthRegistAckMsg.msgType()) {
			this.onReceiveDepthRegistAck(msg);
		}
		if(msg.msgType === RCMsg.RCDepthUnregistAckMsg.msgType()) {
			this.onReceiveDepthUnregistAck(msg);
		}
		if(msg.msgType === RCMsg.RCDepthRealMsg.msgType()) {
			this.onReceiveDepthReal(msg);
		}
		if(msg.msgType === RCMsg.RCDepthDisableMsg.msgType()) {
			this.onReceiveDepthDisable(msg);
		}
		if(msg.msgType === RCMsg.RCTickRegistAckMsg.msgType()) {
			this.onReceiveTickRegistAck(msg);
		}
		if(msg.msgType === RCMsg.RCTickRealMsg.msgType()) {
			this.onReceiveTickReal(msg);
		}
		if(msg.msgType === RCMsg.RCKabuNoticeMsg.msgType()) {
			this.onReceiveKabuNotice(msg);
		}
	}
	// onEvent
	onEvent = (msg) => {
		if(!this.callback) return;
		if(!msg.msgType) return;

		// control
		if(msg.msgType === RCMsg.RCLoginAckMsg.msgType()) {
			this.callback.onReceiveOpenAck(msg);
		}
		//if(msg.msgType === RCMsg.RCLoginAck.msgType()) {
		//	this.callback.onReceiveLoginAck(msg);
		//}
		if(msg.msgType === RCMsg.RCReadyMsg.msgType()) {
			this.callback.onReceiveReady(msg);
		}
		if(msg.msgType === RCMsg.RCCommunicationLevelMsg.msgType()) {
			this.callback.onReceiveCommunicationLevel(msg);
		}
		// feed
		if(msg.msgType === RCMsg.RCFeedRegistAckMsg.msgType()) {
			this.callback.onReceiveFeedRegistAck(msg);
		}
		if(msg.msgType === RCMsg.RCFeedUnregistAckMsg.msgType()) {
			this.callback.onReceiveFeedUnregistAck(msg);
		}
		if(msg.msgType === RCMsg.RCFeedRealMsg.msgType()) {
			this.callback.onReceiveFeedReal(msg);
		}
		// board
		if(msg.msgType === RCMsg.RCBoardRealMsg.msgType()) {
			this.callback.onReceiveBoardReal(msg);
		}
		// tick
		if(msg.msgType === RCMsg.RCTickRegistAckMsg.msgType()) {
			this.callback.onReceiveTickRegistAck(msg);
		}
		if(msg.msgType === RCMsg.RCTickUnregistAckMsg.msgType()) {
			this.callback.onReceiveTickUnregistAck(msg);
		}
		if(msg.msgType === RCMsg.RCTickRealMsg.msgType()) {
			this.callback.onReceiveTickReal(msg);
		}
		if(msg.msgType === RCMsg.RCTickDisableMsg.msgType()) {
			this.callback.onReceiveTickDisable(msg);
		}
		if(msg.msgType === RCMsg.RCTickGetAckMsg.msgType()) {
			this.callback.onReceiveTickGetAck(msg);
		}
		// news
		if(msg.msgType === RCMsg.RCNewsHeadLineMsg.msgType()) {
			this.callback.onReceiveNewsHeadLine(msg);
		}
		//
		if(msg.msgType === RCMsg.RCKabuSummaryMsg.msgType()) {
			this.callback.onReceiveKabuSummary(msg);
		}
		if(msg.msgType === RCMsg.RCKabuYakuzyouSikkouMsg.msgType()) {
			this.callback.onReceiveKabuYakuzyouSikkou(msg);
		}
		// order

		// configration
	}
	onError = (err) => {
		if(this.callback) {
			this.callback.onError(err);
		}
	}
	onClose = (e) => {
		if(this.callback) {
			this.callback.onClose(e);
		}
	}

	// 値段をtick価上げる return {price, dec}
	getUpTick(yobineTaniNumber, price, tick) {
		return this.boardCache.offered.upTick(yobineTaniNumber, price, tick);
	}
	// 値段をtick価下げる return {price, dec}
	getDownTick(yobineTaniNumber, price, tick) {
		return this.boardCache.offered.downTick(yobineTaniNumber, price, tick);
	}

	// check
	checkIssueCode(issueCode) {
		if(!issueCode) return false;
		return true;
	}
	checkMarketCode(marketCode) {
		if(marketCode === null || marketCode === undefined) return false;
		return true;
	}
}