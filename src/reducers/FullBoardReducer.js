import {Record} from 'immutable';
import * as FullBoardActions from "../actions/FullBoardActions";
import * as RCApiActions from "../actions/RCApiActions";
export const NAME = 'FULL_BOARD';

//-----------------------------------------------------------------------------
//	Data
//-----------------------------------------------------------------------------
export const DisplayType = {
	"Normal": {stat :"0", name: "通常"},
	"Closing": {stat :"1", name: "引け"},
	"OHLC": {stat :"2", name: "四本"},
	"Margin": {stat :"3", name: "証金"},
	"Fiscal": {stat :"4", name: "財指"},
	"Index": {stat :"5", name: "指標"},
}
//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------
const BrinkDataBase = (className = '') => {
	const BrinkDataBase = Record({
		value: '',
		className: className,
		updateTime: 0,
	});
	return new BrinkDataBase({className:className});
}

const bidAskRecord = Record({
	"bid": BrinkDataBase(),
	"ask": BrinkDataBase(),
});
const priceDataRecord = Record({
	"data": '',
	"decimalPoint": '',
	"type": '',
});
const FullBoardRecord = Record({
/*	"bidAsk": '',					// 売買区分 (0:Bid,1:Ask)
	"center": '',					// FPAF,FPBF 板中心価格符号
	"closeCount": BrinkDataBase(),	// FSAQ,FSBQ 引け注文件数
	"closeLot": BrinkDataBase(),	// FSAV,FSBV 引け注文数量
	"count": BrinkDataBase(),		// FCAQ,FCBQ 件数
	"cross": BrinkDataBase(),		// FFAF,FFBF 気配対等符号
	"lot": BrinkDataBase(),			// FCAV,FCBV 注文数量
//	"price": priceDataRecord(),
	"price": BrinkDataBase(),		// 値段
	"priceDecimalPoint": '',		// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
	"priceType": '',				// "0":値段無し, "1":値段有り, "2":成行
	"status": BrinkDataBase(),
	"type": '',						// 更新タイプ (0:Update,1:Delete)*/
	"closeCount": bidAskRecord(),	// FSAQ,FSBQ 引け注文件数
	"closeLot": bidAskRecord(),		// FSAV,FSBV 引け注文数量
	"count": bidAskRecord(),		// FCAQ,FCBQ 注文件数
	"cross": bidAskRecord(),		// FFAF,FFBF 気配対等符号
	"lot": bidAskRecord(),			// FCAV,FCBV 注文数量
	"price": priceDataRecord(),
	"totalLot": bidAskRecord(),		// 注文数量累計
	"status": bidAskRecord(),
});
class FullBoardData extends FullBoardRecord {
	static BLINK_TIME = 2000;
	/* update method */
	updateAll(obj) {
		let result = this;
		const now = new Date().getTime();
		for(let name of result.toSeq().keySeq()) {
			for(let key of result[name].toSeq().keySeq()) {
				if(typeof result[name][key] === "object") {
					result = result.updateBrinkData(name, key, obj[name][key], now);
				} else if(typeof result[name][key] !== 'undefined') {
					result = result.setIn([name, key], obj[name][key]);
				}
			}
		}
		return result;
	}
	updateBrinkData(name, key, val, now) {
		if(now === null) now = 0;
		let prevVal = this.getIn([name, key, 'value']);
		let newVal = val;
		if(prevVal !== newVal) {
			return this.setValue(name, key, newVal)
						.setUpdateTime(name, key, now)
						.setUpdateClass(name, key);
		}
		return this;
	}
	setValue(name, key, val) {
		return this.setIn([name, key, 'value'], val);
	}
	setUpdateTime(name, key, updateTime) {
		return this.setIn([name, key, 'updateTime'], updateTime);
	}
	setUpdateClass(name, key) {
		return this.setIn([name, key, 'className'], 'update');
	}
	/* reset updateTime method */
	resetUpdateTimeAll() {
		let result = this;
		const now = new Date().getTime();
		for(let name of this.toSeq().keySeq()) {
			for(let key of result[name].toSeq().keySeq()) {
				if(typeof result[name][key] === "object") {
					result = result.resetUpdateTime(name, key, now)
					if(result.getIn([name, key, 'updateTime']) === 0) {
						result = result.resetClassName(name, key);
					}		
				}
			}
		}
		return result;
	}
	resetUpdateTime(name, key,  now) {
		if(now - this.getIn([name, key, 'updateTime']) > FullBoardData.BLINK_TIME) {
			return this.setIn([name, key, 'updateTime'], 0);
		}
		return this;
	}
	resetClassName(name, key) {
		return this.setIn([name, key, 'className'], '');
	}
}
/*const FullBoardDataList = List({
	let result = this;
	//static RECORD_COUNT = 23;
	for(let i = 0; i < 23 ; i++) {
		result[i] = new FullBoardData();
	}
	return result;
});*/
const boardRecord = Record({
	"0": new FullBoardData(),
	"1": new FullBoardData(),
	"2": new FullBoardData(),
	"3": new FullBoardData(),
	"4": new FullBoardData(),
	"5": new FullBoardData(),
	"6": new FullBoardData(),
	"7": new FullBoardData(),
	"8": new FullBoardData(),
	"9": new FullBoardData(),
	"10": new FullBoardData(),
	"11": new FullBoardData(),
	"12": new FullBoardData(),
	"13": new FullBoardData(),
	"14": new FullBoardData(),
	"15": new FullBoardData(),
	"16": new FullBoardData(),
	"17": new FullBoardData(),
	"18": new FullBoardData(),
	"19": new FullBoardData(),
	"20": new FullBoardData(),
	"21": new FullBoardData(),
	"22": new FullBoardData(),
});
class BoardDataList extends boardRecord {
	/*static RECORD_COUNT = 23;
	constructor() {
		//let result = this;
		let result = List([]);
		for(let i = 0; i < BoardDataList.RECORD_COUNT ; i++) {
			result[i] = new FullBoardData();
			this.data = this.data.set(i, new FullBoardData());
			boardRecord;// = boardRecord.set(i, new FullBoardData());
		}
	}*/
	onUpdate(obj) {
		let result = this;
		Object.keys(obj).map((key, index) => {
			//let data = result[key];
			if(typeof result[key] === 'undefined') {
				result[key] = new FullBoardData();
			}
			//result[key] = result[key].updateAll(obj[index]);
			//result = result.set(key, result[key].updateAll(obj[index]));
			result = result.set(key, result.get(key).updateAll(obj[index]));
		})
		return result;
	}
	resetUpdateTimeAll() {
		let result = this;
		Object.keys(this).map((key, index) => {
			let data = result[index];
		//	if(key === obj.ReportId && data.NoticeNumber >= obj.NoticeNumber)
			result[key] = result[key].resetUpdateTime(result[index], key);
			//result = result.update(key, data.resetUpdateTime(data, key));
		})
		return result;
	}
}
/*const FullBoardDataList = () => {
	let result = Map({});
	//static RECORD_COUNT = 23;
	for(let i = 0; i < 23 ; i++) {
		result = result.set(i, new FullBoardData());
	}
	return result;
}
class BoardDataList {
	static RECORD_COUNT = 23;
	constructor(boardDataList) {
		for(var i = 0; i < BoardDataList.RECORD_COUNT ; i++) {
			boardDataList = boardDataList.set(i, new FullBoardData());
		}
	}
}
const updateBoardDataList = (inData) => (BoardDataList) => {
	let result = BoardDataList;
	Object.keys(inData).map((key, index) => {
		if(!BoardDataList.has(index)) {
			result = result.set(index, new FullBoardData());
		}
		BoardDataList[index].updateAll(inData[index], key);
	})
	return result;
}
const updateBoardListTime = () => {
	let result = this;
	Object.keys(this.BoardDataList).map((key, index) => {
		let data = this.BoardDataList[key];
	//	if(key === obj.ReportId && data.NoticeNumber >= obj.NoticeNumber)
		data.resetUpdateTimeAll(result[index], key);
	})
	return result;
}*/
const OhlcDataRecord = Record({
	'MRGNS': BrinkDataBase(),	// 信用区分
	'LOANS': BrinkDataBase(),	// 貸借区分
	'KARA': BrinkDataBase(),	// 空売価格規制区分

	'RSTS': BrinkDataBase(),	// 監理／整理区分
	'SAMS': BrinkDataBase(),	// 特設注意市場区分
	'SPVS': BrinkDataBase(),	// 監理銘柄区分
	'LOSH': BrinkDataBase(),	// 単位株数（売買単位
	'DSPH': BrinkDataBase(),	// 当日基準値・上限値
	'DSPL': BrinkDataBase(),	// 当日基準値・下限値
	
	'DPG': BrinkDataBase(),		// 日通し現値前値比較（基準比
	'DPP': BrinkDataBase(),		// 日通し現値・価格
	'DPP:T': BrinkDataBase(),	// 日通し現値・価格：時刻
	'DPS': BrinkDataBase(),		// 日通し現値・ステータス
	'REGS': BrinkDataBase(),	// 規制フラグ
	'ZSS': BrinkDataBase(),		// 
	'DYWP': BrinkDataBase(),	// 日通し前日比・騰落幅(価格)
	'DYRP': BrinkDataBase(),	// 日通し前日比・騰落率(価格)
	'XV' : BrinkDataBase(),		// 日通し約定にかかる売買高（約定数量
	'XV:T' : BrinkDataBase(),	// 約定にかかる時刻（出来高に変化があった時刻
	'PRP': BrinkDataBase(),		// 前日終値（前日値
	'DYRP': BrinkDataBase(),	// 日通し前日比・騰落率(価格)（前日比

	'DSP': BrinkDataBase(),		// 当日基準値段（基準値
	//'DSPF': BrinkDataBase(),	// 当日基準値段識別（基準値タイプ
	'DOP': BrinkDataBase(),		// 始値
	//'DOP:T': BrinkDataBase(),	// 始値：時刻
	'DHP': BrinkDataBase(),		// 高値
	//'DHP:T': BrinkDataBase(),	// 高値：時刻
	'DLP': BrinkDataBase(),		// 安値
	//'DLP:T': BrinkDataBase(),	// 安値：時刻
	'NOPV': BrinkDataBase(),	// 約定値出来高通番（約定回数
	'DV': BrinkDataBase(),		// 日通し売買高
	'DJ': BrinkDataBase(),		// 日通し売買代金
	'VWAP': BrinkDataBase(),	// 日通し売買高加重平均（VWAP

	'QAP': BrinkDataBase(),		// 売気配値(価格)
	'AV': BrinkDataBase(),		// 売気配数量
	'QAP:T': BrinkDataBase(),	// 売気配(価格)：時刻
	'QBP': BrinkDataBase(),		// 買気配値(価格)
	'BV': BrinkDataBase(),		// 買気配数量
	'QBP:T': BrinkDataBase(),	// 買気配(価格)：時刻
	'NUPT': BrinkDataBase(),	// Up Tick
	'NDWT': BrinkDataBase(),	// Down Tick

	'L1P': BrinkDataBase(),		// 歩み1
	'L1P:T': BrinkDataBase(),	// 歩み1時間
	'L2P': BrinkDataBase(),		// 歩み2
	'L2P:T': BrinkDataBase(),	// 歩み2時間
	'L3P': BrinkDataBase(),		// 歩み3
	'L3P:T': BrinkDataBase(),	// 歩み3時間
	'L4P': BrinkDataBase(),		// 歩み4
	'L4P:T': BrinkDataBase(),	// 歩み4時間

	'1PP': BrinkDataBase(),		// 前場終値・価格
	'1PP:T': BrinkDataBase(),	// 前場終値・価格：時刻(分)
	'1YWP': BrinkDataBase(),	// 前場前日比・騰落幅(価格)
	'1YRP': BrinkDataBase(),	// 前場前日比・騰落率(価格)
	'1OP': BrinkDataBase(),		// 前場始値・価格
	'1OP:T': BrinkDataBase(),	// 前場始値・価格：時刻(分)
	'1HP': BrinkDataBase(),		// 前場高値・価格
	'1HP:T': BrinkDataBase(),	// 前場高値・価格：時刻(分)
	'1LP': BrinkDataBase(),		// 前場安値・価格
	'1LP:T': BrinkDataBase(),	// 前場安値・価格：時刻(分)
	'1V': BrinkDataBase(),		// 前場売買高
	'1V:T': BrinkDataBase(),	// 
	'1J': BrinkDataBase(),		// （売買代金
	'1VWP': BrinkDataBase(),	// 前場売買高加重平均

	'2PP': BrinkDataBase(),		// 後場終値・価格
	'2PP:T': BrinkDataBase(),	// 後場終値・価格：時刻(分)
	'2YWP': BrinkDataBase(),	// 後場前日比・騰落幅(価格)
	'2YRP': BrinkDataBase(),	// 後場前日比・騰落率(価格)
	'2OP': BrinkDataBase(),		// 後場始値・価格
	'2OP:T': BrinkDataBase(),	// 後場始値・価格：時刻(分)
	'2HP': BrinkDataBase(),		// 後場高値・価格
	'2HP:T': BrinkDataBase(),	// 後場高値・価格：時刻(分)
	'2LP': BrinkDataBase(),		// 後場安値・価格
	'2LP:T': BrinkDataBase(),	// 後場安値・価格：時刻(分)
	'2V': BrinkDataBase(),		// 後場売買高
	'2V:T': BrinkDataBase(),	// 
	'2J': BrinkDataBase(),		// （売買代金
	'2VWP': BrinkDataBase(),	// 後場売買高加重平均
});
class OhlcData extends OhlcDataRecord {
	update(obj) {
		let result = this;
		for(let key of this.toSeq().keySeq()) {
			result = result.setIn(key, obj[key]);
		}
		return result;
	}
	static BLINK_TIME = 2000;
	updateAll(obj) {
		let result = this;
		const now = new Date().getTime();
		for(let key of this.toSeq().keySeq()) {
			if(obj[key] !== undefined) {
				result = result.updateValue(key, obj[key], now);
			}
		}
		return result;
	}
	updateValue(name, val, now) {
		if(now === null) now = 0;
		let prevVal = this.getIn([name, 'value']);
		let newVal = val;
		if(prevVal !== newVal) {
			return this.setValue(name, newVal)
					   .setUpdateTime(name, now)
					   .setClassName(name, prevVal, newVal);
		}
		return this;
	}
	setValue(name, val) {
		/*if(name === "NOPV" && val === "")
			val = "0";*/
		return this.setIn([name, 'value'], val);
	}
	setUpdateTime(name, updateTime) {
		return this.setIn([name, 'updateTime'], updateTime);
	}
	setClassName(name, prevVal, newVal) {
		switch(name) {
			case 'DPP':
				return this.setUpDownClassName(name, prevVal, newVal);
			case 'DYRP':	// 前日比
				return this.setPlusMinusClassName(name, newVal);
			default:
				return this.setUpdateClass(name, prevVal, newVal);
		}
	}
	setPlusMinusClassName(name, newVal) {
		if(0.0 < newVal) {
			return this.setIn([name, 'className'], 'plus');
		} else if(0.0 > newVal) {
			return this.setIn([name, 'className'], 'minus');
		} else {
			return this.setIn([name, 'className'], '');
		}
	}
	setUpDownClassName(name, prevVal, newVal) {
		if(prevVal < newVal) {
			return this.setIn([name, 'className'], 'up');
		} else if(prevVal > newVal) {
			return this.setIn([name, 'className'], 'down');
		} else {
			return this;
		}
	}
	setUpdateClass(name, prevVal, newVal) {
		if(prevVal !== newVal) {
			return this.setIn([name, 'className'], 'update');
		} else {
			return this;
		}
	}
	/* reset updateTime method */
	resetUpdateTimeAll() {
		let result = this;
		const now = new Date().getTime();
		for(let key of this.toSeq().keySeq()) {
			result = result.resetUpdateTime(key, now)
			if(result.getIn([key, 'updateTime']) === 0) {
				result = result.resetClassName(key);
			}
		}
		return result;
	}
	resetUpdateTime(name, now) {
		if(now - this.getIn([name, 'updateTime']) > OhlcData.BLINK_TIME) {
			return this.setIn([name, 'updateTime'], 0);
		}
		return this;
	}
	resetClassName(name) {
		return this.setIn([name, 'className'], '');
	}
}

const FullBoard = Record({
	displayType: DisplayType["Normal"].stat,
	//id: null,
	issueCode: '',
	marketCode: "00",
	issueName: '',
	loanType: '',		// 貸借区分
	unitLot: '',
	centerPrice: new priceDataRecord(),
	clearCenterPriceFlag: false,
	stopFlag: '',		// 規制フラグ
	shortFlag: '',		// 空売規制符号
	boardDataList: new BoardDataList(),
	ohlcData: new OhlcData(),
	nowPrice: new priceDataRecord(),
	basePrice: new priceDataRecord(),
	feedFlag: 0,
	depthFlag: 0,
	message: "",
});
/*const createFullBoard  => {
	return FullBoard();
}*/
//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const initialState = FullBoard();

const fullBoardReducer = (state = initialState, action) => {
	switch (action.type) {
		case FullBoardActions.RESET_BOARD:
			return state = FullBoard();	
			//return resetBoardReducer(state, action);
		case FullBoardActions.CHANGE_DISPLAY:
			return state.withMutations( s => {
				s.set('displayType', action.dispType)
				.set('depthFlag', action.depthFlag)
			});
			//return changeDisplayReducer(state, action);
		case FullBoardActions.SET_MESSAGE:
			//return state.set('message', action.message);
			return setMessage(state,  action.message);
		case FullBoardActions.CHANGE_ISSUE_MARKET:
			return changeIssueMarketReducer(state, action);
		case FullBoardActions.CLEAR_CENTER_PRICE:
			return clearCenterPriceReducer(state, action);
		/*case FullBoardActions.UPDATE_ISSUE_MARKET:
			return updateIssueMarketReducer(state, action);*/
		case FullBoardActions.RESET_UPDATETIME:
			return resetUpdateTimeReducer(state, action);
		/*case FullBoardActions.UPDATE_OHLC:
			return updateOhlcReducer(state, action);*/
		case RCApiActions.REGIST_FEED_SUCCESS:
			return registFeedSuccessReducer(state, action);		// 銘柄登録成功
		case RCApiActions.UPDATE_FEED:
			return updateFeedReducer(state, action);
		case RCApiActions.REGIST_BOARD_SUCCESS:
			return registBoardSuccessReducer(state, action);	// 銘柄登録成功
		case RCApiActions.UPDATE_BOARD:
			return updateBoardReducer(state, action);
		/*case RCApiActions.REGIST_BOARD_ERROR:
			return registBoardErrorReducer(state, action);*/
		case FullBoardActions.UPDATE_BOARD:
			return updateBoardReducer(state, action);
		case RCApiActions.WEB_SOCKET_CLOSED:
			//return webSocketCloseReducer(state, action);
			return setMessage(state, "MIOS:WebSocket回線が切断しました");
		default:
			return state;
	}
}
const setMessage = (state, message) => {
	return state.withMutations( s => {
		s.set("message", message);
	});
}

/*const resetBoardReducer = (state = initialState, action) => {
	return state.withMutations( s => {
		//s.setIn([action.id, "boardData"], new BoardData());
		s.set("boardDataList", new BoardDataList());
	});
	return state = FullBoard();
}*/
/*const changeDisplayReducer = (state = initialState, action) => {
	return state.withMutations( s => {
		s.set('displayType', action.dispType)
		 .set('depthFlag', action.depthFlag)
	});
}*/
const changeIssueMarketReducer = (state, action) => {
	let statePrice = state.getIn(['centerPrice', 'data']);
	if(statePrice === '')
		statePrice = 0;
	if(state.get('issueCode') === action.issueCode && state.get('marketCode') === action.marketCode && statePrice === action.price){
		return state;
	} else if(state.get('issueCode') !== action.issueCode || state.get('marketCode') !== action.marketCode) {
		return state.withMutations( s => {
			s.set('issueCode', action.issueCode)
			 .set('marketCode', action.marketCode)
			 .set('centerPrice', new priceDataRecord())
			 .set('clearCenterPriceFlag', true)
	   });
	}
	return state.withMutations( s => {
		s.setIn(['centerPrice','data'], action.price)
		 .setIn(['centerPrice','decimalPoint'], action.priceDec)
		 .setIn(['centerPrice','type'], action.priceType)
   });
}
const clearCenterPriceReducer = (state, action) => {
	return state.withMutations( s => {
		s.set('clearCenterPriceFlag', false)
   });
}
/*const updateIssueMarketReducer = (state, action) => {
	return state.withMutations( s => {
		let boardData = new FullBoardData().setIn(['LOSH', 'value'], action.losh);
		s.set('issueCode', action.issueCode)
		 .set('marketCode', action.marketCode)
		 .set('issueName', action.issueName)
		 .set('loanType', boardData);
	});
}*/
const resetUpdateTimeReducer = (state = initialState, action) => {
	if(action.dispType === DisplayType["OHLC"].stat) {
		return state.update('ohlcData', (data) => data.resetUpdateTimeAll());
	}
	let result = state.get('boardDataList');
	//Object.keys(result.toJS).map((key, index) => {
	//result.keySeq().map(key => {
	for(let key of result.toSeq().keySeq()) {
		//if(key === obj.ReportId && data.NoticeNumber >= obj.NoticeNumber)
		//result[key] = result[key].resetUpdateTimeAll(result[index], key);
		result = result.set(key, result.get(key).resetUpdateTimeAll(result.get(key), key));
	}
	//})
	return state.set('boardDataList', result);
}
const registFeedSuccessReducer = (state = initialState, action) => {
	if(action.msg.handle !== NAME)	return state;
	const msg = action.msg;
	let obj = {};
	for(const feedData of msg.feedDataList) {
		obj[feedData.name] = feedData.data;
	}
	//updateOhlcReducer(state, action = {obj:obj});
	
	//return state.update('ohlcData', (data) => data.updateAll(obj));
	// DepthとFeedを同時に取得するようにしたため、銘柄情報系の更新が重複している
	return state.withMutations( s => {
		s.update('ohlcData', (data) => data.updateAll(obj))
		 .set('marketCode', msg.marketCode)
		 .set('issueCode', msg.issueCode)
		 .set('issueName', msg.name)
		 .set('loanType', msg.loanType)
		 .set('unitLot', msg.unitLot)
		 .set('stopFlag', msg.stopFlag)
		 .set('feedFlag', 1)
		// .set('shortFlag', msg.shortFlag)
  	});
}
const updateFeedReducer = (state = initialState, action) => {
	if(action.msg.handle !== NAME)	return state;
	const msg = action.msg;
	let obj = {};
	obj.Id = msg.handle;
	for(const feedData of msg.feedDataList) {
		obj[feedData.name] = feedData.data;
	}
	//updateOhlcReducer(state, action = {obj:obj});
	return state.update('ohlcData', (data) => data.updateAll(obj));
}

const registBoardSuccessReducer = (state = initialState, action) => {	// フル板銘柄登録成功
	const msg = action.msg;
	// マスタ更新
	//FullBoardActions.updateIssueMarket(msg.handle, msg.issueCode, msg.marketCode, msg.name, msg.unitLot);
	// データ更新
	if (msg.status === "A00"){
		state = updateBoardReducer(state, action = {msg:msg});
	} else if (msg.status !== "A01"){
		if(action.msg.status === "A92" || action.msg.status === "A93") {
			state = setMessage(state, "銘柄がありません");
		} else if(action.msg.status === "A91") {
			state = setMessage(state, "APIエラー（上位リンクダウン）");
		} else {
			state = setMessage(state, "APIエラー");
		}
		return state.withMutations( s => {
			//s.set("issueCode", '');
			//s.set("marketCode", '00');
			s.set("issueName", '')
			 .set("loanType", '')
			 .set("unitLot", '')
			 .set("stopFlag", '')
			 .set("shortFlag", '')
			 .set("centerPrice", new priceDataRecord())
			 .set("boardDataList", new BoardDataList())
			 .set("ohlcData", new OhlcData())
			 .set("feedFlag", 0)
			 .set("depthFlag", 0);
			});
	}
	return state.withMutations( s => {
		//let boardData = new FullBoardData().setIn(['LOSH', 'value'], action.losh);
		s.set('issueCode', msg.issueCode)
		 .set('marketCode', msg.marketCode)
		 .set('issueName', msg.issueName)
		 .set('loanType', msg.loanType)
		 .set('unitLot', msg.unitLot)
		 .setIn(['basePrice','data'], msg.basePrice.data)
		 .setIn(['basePrice','decimalPoint'], msg.basePrice.decimalPoint)
		 .setIn(['basePrice','type'], msg.basePrice.type)
		 .set('depthFlag', 1)
		// .set('stopFlag', msg.stopFlag)
		// .set('shortFlag', msg.shortFlag)
	});
}
/*const registBoardErrorReducer = (state = initialState, action) => {
	if(action.msg.handle !== NAME)	return state;
	// フル板銘柄登録失敗
	if(action.msg.status === "A13") {
		setMessage(action.msg.handle, "銘柄がありません");
	} else {
		setMessage(action.msg.handle, "APIエラー");
	}
	return state.withMutations( s => {
		//s.setIn([action.id, "boardData"], new BoardData());
		s.set("boardDataList", new BoardDataList());
	});
}*/
const updateBoardReducer = (state, action) => {
	const msg = action.msg;
	let obj = {};
	Object.keys(msg.boardDataList).map((key, index) => {
		obj[key] = msg.boardDataList[key];
	})
	return state.withMutations( s => {
		//s.update('boardDataList', /*updateBoardDataList(obj)*/(data) => data.onUpdate(obj))
		s.set('boardDataList', s.get('boardDataList').onUpdate(obj))
		 .set('stopFlag', msg.stopFlag)
		 .set('shortFlag', msg.shortFlag)
		 .setIn(['nowPrice','data'], msg.nowPrice.data)
		 .setIn(['nowPrice','decimalPoint'], msg.nowPrice.decimalPoint)
		 .setIn(['nowPrice','type'], msg.nowPrice.type)
  });
}

export default fullBoardReducer;