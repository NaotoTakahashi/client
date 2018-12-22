import {Map, Record} from 'immutable';
import * as BoardActions from "../actions/BoardActions";
import * as RCApiActions from "../actions/RCApiActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
export const NAME = 'BOARD';

//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------
const BrinkDataBase = (className = '') => {
	const BrinkDataBase = Record({
		value: '',
		//flag: 0,
		className: className,
		updateTime: 0,
	});
	return new BrinkDataBase({className:className});
}

const BoardRecord = Record({
	//NAME: BrinkDataBase(),
	"LOSH": BrinkDataBase(),
	"DPP": BrinkDataBase(),
	"DPP:T": BrinkDataBase(),
	"ZSS": BrinkDataBase(),
	"DYWP": BrinkDataBase(),
	"DYRP": BrinkDataBase(),
	"AAV": BrinkDataBase(),
	"ABV": BrinkDataBase(),
	"DOP": BrinkDataBase(),
	"QOV": BrinkDataBase(),
	"DOP:T": BrinkDataBase(),
	"DHP": BrinkDataBase(),
	"DHP:T": BrinkDataBase(),
	"DLP": BrinkDataBase(),
	"DLP:T": BrinkDataBase(),
	"DV": BrinkDataBase(),
	"VWAP": BrinkDataBase(),
	"GBS": BrinkDataBase(),
	"PRP": BrinkDataBase(),
	"DSPH": BrinkDataBase(),
	"DSPL": BrinkDataBase(),
	"QUV": BrinkDataBase(),
	"L1P": BrinkDataBase(),
	"L1P:T": BrinkDataBase(),
	"L2P": BrinkDataBase(),
	"L2P:T": BrinkDataBase(),
	"L3P": BrinkDataBase(),
	"L3P:T": BrinkDataBase(),
	"GAS": BrinkDataBase(),
	"GAV1": BrinkDataBase(),
	"GAP1": BrinkDataBase(),
	"GAV2": BrinkDataBase(),
	"GAP2": BrinkDataBase(),
	"GAV3": BrinkDataBase(),
	"GAP3": BrinkDataBase(),
	"GAV4": BrinkDataBase(),
	"GAP4": BrinkDataBase(),
	"GAV5": BrinkDataBase(),
	"GAP5": BrinkDataBase(),
	"GAV6": BrinkDataBase(),
	"GAP6": BrinkDataBase(),
	"GAV7": BrinkDataBase(),
	"GAP7": BrinkDataBase(),
	"GAV8": BrinkDataBase(),
	"GAP8": BrinkDataBase(),
	"GBV1": BrinkDataBase(),
	"GBP1": BrinkDataBase(),
	"GBV2": BrinkDataBase(),
	"GBP2": BrinkDataBase(),
	"GBV3": BrinkDataBase(),
	"GBP3": BrinkDataBase(),
	"GBV4": BrinkDataBase(),
	"GBP4": BrinkDataBase(),
	"GBV5": BrinkDataBase(),
	"GBP5": BrinkDataBase(),
	"GBV6": BrinkDataBase(),
	"GBP6": BrinkDataBase(),
	"GBV7": BrinkDataBase(),
	"GBP7": BrinkDataBase(),
	"GBV8": BrinkDataBase(),
	"GBP8": BrinkDataBase(),
});

export class BoardData extends BoardRecord {
	static BLINK_TIME = 2000;
	/* update method */
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
		return this.setIn([name, 'value'], val);
	}
	setUpdateTime(name, updateTime) {
		return this.setIn([name, 'updateTime'], updateTime);
	}
	setClassName(name, prevVal, newVal) {
		switch(name) {
			case 'DPP':
				return this.setUpDownClassName(name, prevVal, newVal);
			case 'DYWP':
			case 'DYRP':
				return this.setPlusMinusClassName(name, newVal);
			case 'AAV':
			case 'ABV':
			case 'QOV':
			case 'GAV1':
			case 'GAP1':
			case 'GAV2':
			case 'GAP2':
			case 'GAV3':
			case 'GAP3':
			case 'GAV4':
			case 'GAP4':
			case 'GAV5':
			case 'GAP5':
			case 'GAV6':
			case 'GAP6':
			case 'GAV7':
			case 'GAP7':
			case 'GAV8':
			case 'GAP8':
			case 'GBV1':
			case 'GBP1':
			case 'GBV2':
			case 'GBP2':
			case 'GBV3':
			case 'GBP3':
			case 'GBV4':
			case 'GBP4':
			case 'GBV5':
			case 'GBP5':
			case 'GBV6':
			case 'GBP6':
			case 'GBV7':
			case 'GBP7':
			case 'GBV8':
			case 'GBP8':
			case 'QUV':
				return this.setUpdateClass(name, prevVal, newVal);
			default: return this;
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
		//if(updateTime === 0) {
		//	return this.setIn([name, 'className'], 'last_price');
		//}
		if(prevVal < newVal) {
			return this.setIn([name, 'className'], 'up');
		} else if(prevVal > newVal) {
			return this.setIn([name, 'className'], 'down');
		} else {
			return this;
		}
	}
	setUpdateClass(name, prevVal, newVal) {
		//if(updateTime === 0) {
		//	return this.setIn([name, 'className'], '');
		//}
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
			if(key !== 'DYWP' && key !== 'DYRP') {
				if(result.getIn([key, 'updateTime']) === 0) {
					result = result.resetClassName(key);
				}
			}
		}
		return result;
	}
	resetUpdateTime(name, now) {
		if(now - this.getIn([name, 'updateTime']) > BoardData.BLINK_TIME) {
			return this.setIn([name, 'updateTime'], 0);
		}
		return this;
	}
	resetClassName(name) {
		return this.setIn([name, 'className'], '');
	}
}

const Board = Record({
	id: null,
	issueCode: '',
	marketCode: "00",
	issueName: '',
	boardData: new BoardData(),
	message: "",
});

const createBoard = id => {
	return Board({id: id});
}

//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
export const getState = (state) => state[NAME];
export const getBoard = (state, id) => state[NAME].get(id);
export const getStateForSetting = (state) => {
	const myState = getState(state);
	return Map({}).withMutations(s => {
		for(const id of myState.keys()) {
			const bState = Map({
				id: id,
				issueCode: myState.getIn([id, "issueCode"]),
				marketCode: myState.getIn([id, "marketCode"]),
			});
			s.set(id, bState);
		}
	});
}

//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const initialState = Map({
});

const boardReducer = (state = initialState, action) => {
	switch (action.type) {
		case BoardActions.ADD_BOARD:
			return addBoard(state, action.id);
		case BoardActions.RESET_BOARD:
			return resetBoard(state, action.id);
		case BoardActions.CHANGE_ISSUE_MARKET:
			//if(state.getIn([action.id, "issueCode"]) === action.issueCode && state.getIn([action.id, "marketCode"]) === action.marketCode)
			//	return state;
			return state.withMutations( s => {
				//resetBoard(s, action.id);
				setMessage(s, action.id, "");
				changeIssueMarket(s, action.id, action.issueCode, action.marketCode);
				//changeIssueMarket(s, action.id, action.issueCode, action.marketCode, action.issueName, action.losh);
			});
		case BoardActions.SET_MESSAGE:
			return state.setIn([action.id, 'message'], action.message);
		case BoardActions.UPDATE_BOARD:
			return updateBoardData(state, action.obj);
		case BoardActions.RESET_UPDATETIME:
			return state.updateIn([action.id, 'boardData'], (data) => data.resetUpdateTimeAll());
		case RCApiActions.REGIST_FEED_SUCCESS:
			if(!state.has(action.msg.handle)) return state;
			return state.withMutations( s => {
				changeIssueMarket(s, action.msg.handle, action.msg.issueCode, action.msg.marketCode, action.msg.name, action.msg.unitLot);
				setIssueInfo(s, action.msg.handle, action.msg.name, action.msg.unitLot);
				let obj = {
					Id: action.msg.handle,
					marketCode: action.msg.marketCode,
					issueCode: action.msg.issueCode,
					issueName: action.msg.name,
					message: action.msg.status,
				}
				for(const feedData of action.msg.feedDataList) {
					obj[feedData.name] = feedData.data;
				}
				updateBoardData(s, obj);
			});
		case RCApiActions.UPDATE_FEED:
			if(!state.has(action.msg.handle)) return state;
			return state.withMutations( s => {
				let obj = {};
				obj.Id = action.msg.handle;
				for(const feedData of action.msg.feedDataList) {
					obj[feedData.name] = feedData.data;
				}
				updateBoardData(s, obj);
			});
		case RCApiActions.UNREGIST_FEED_ERROR:
			if(!state.has(action.msg.handle)) return state;
			return state.withMutations( s => {
				resetIssueInfo(s, action.msg.handle);
				resetBoardData(s, action.msg.handle);
				if(action.msg.status === "A13") {
					setMessage(s, action.msg.handle, "銘柄がありません");
				} else {
					setMessage(s, action.msg.handle, "APIエラー");
				}
			});
		case ReportSVApiActions.LOGIN_SUCCESS:
			if(action.response.Setting) {
				return settingBoardMap(state, action.response.Setting[NAME]);
			} else {
				return state;
			}
		default:
			return state;
	}
}

const addBoard = (state = initialState, id) => {
	return state.withMutations( s => {
		s.set(id, createBoard(id));
	});
}

const resetBoard = (state = initialState, id) => {
	return state.withMutations( s => {
		s.set(id, createBoard(id));
	});
}

const changeIssueMarket = (state, id, issueCode, marketCode) => {
	if(state.getIn([id, 'issueCode']) === issueCode
		&& state.getIn([id, 'marketCode']) === marketCode) {
		return state;
	}
	return state.withMutations( s => {
		//let boardData = new BoardData().setIn(['LOSH', 'value'], losh);
		s.setIn([id, 'issueCode'], issueCode)
		 .setIn([id, 'marketCode'], marketCode)
		 //.setIn([id, 'boardData'], boardData);
	});
}

const setIssueInfo = (state, id, issueName, losh) => {
	return state.withMutations( s => {
		s.setIn([id, 'issueName'], issueName)
		 .setIn([id, 'boardData', "LOSH", "value"], losh);
	});
}

const resetIssueInfo = (state, id) => {
	return state.withMutations( s => {
		s.setIn([id, 'issueName'], "")
		 .setIn([id, 'boardData', "LOSH", "value"], "");
	});
}

const updateBoardData = (state, obj) => {
	if(obj.Id === undefined) {
		return state;
	} else if(state.has(obj.Id)) {
		return state.updateIn([obj.Id, 'boardData'], (data) => data.updateAll(obj));
	}
	return state;
}

const resetBoardData = (state, id) => {
	return state.withMutations( s => {
		s.setIn([id, "boardData"], new BoardData());
	});
}

const setMessage = (state, id, message) => {
	return state.withMutations( s => {
		s.setIn([id, "message"], message);
	});
}

const settingBoardMap = (state, setting) => {
	return state.withMutations(s =>{
		for(const id of Object.keys(setting)) {
			const bState = Board({id:id, issueCode:setting[id].issueCode, marketCode:setting[id].marketCode});
			s.set(id, bState);
		}
	});
}

export default boardReducer;