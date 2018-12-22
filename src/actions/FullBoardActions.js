//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const ADD_BOARD					= Symbol('ADD_BOARD');
export const RESET_BOARD				= Symbol("RESET_BOARD");
export const CHANGE_ISSUE_MARKET		= Symbol('CHANGE_ISSUE_MARKET');
export const CLEAR_CENTER_PRICE			= Symbol('CLEAR_CENTER_PRICE');
//export const UPDATE_ISSUE_MARKET		= Symbol('UPDATE_ISSUE_MARKET');
export const SET_MESSAGE				= Symbol('SET_MESSAGE');
export const UPDATE_BOARD				= Symbol('UPDATE_BOARD');
export const UPDATE_OHLC				= Symbol('UPDATE_OHLC');
export const RESET_UPDATETIME			= Symbol('RESET_UPDATETIME');
export const CHANGE_DISPLAY				= Symbol('CHANGE_DISPLAY');
export const CLICK_BUY_SELL				= Symbol('CLICK_BUY_SELL');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function addBoard() {
	return {
		type: ADD_BOARD,
	}
}

export function resetBoard() {
	return {
		type: RESET_BOARD,
	}
}

export function changeIssueMarket(issueCode, marketCode, priceType, priceDec, price) {
	return {
		type: CHANGE_ISSUE_MARKET,
		issueCode: issueCode,
		marketCode: marketCode,
		priceType: priceType,
		priceDec: priceDec,
		price: price,
	}
}
export function clearCenterPrice() {
	return {
		type: CLEAR_CENTER_PRICE,
	}
}
/*export function updateIssueMarket(marketCode, issueCode, issueName, losh, stopFlag, shortFlag) {
	return {
		type: UPDATE_ISSUE_MARKET,
		marketCode: marketCode,
		issueCode: issueCode,
		issueName: issueName,
		losh: losh,
		stopFlag: stopFlag,
		shortFlag: shortFlag,
	}
}*/

export function setMessage(message) {
	return {
		type: SET_MESSAGE,
		message: message,
	}
}

export function updateBoard(msg) {
	return {
		type: UPDATE_BOARD,
		msg: msg,
	}
}
export function updateOHLC(obj) {
	return {
		type: UPDATE_OHLC,
		obj: obj,
	}
}

export function resetUpdateTime(dispType) {
	return {
		type: RESET_UPDATETIME,
		dispType: dispType,
	}
}

export function changeDisplay(dispType) {
	return {
		type: CHANGE_DISPLAY,
		dispType: dispType,
		depthFlag: 0,
	}
}

export function clickBuySell(issueCode, marketCode, baibaiKubun, priceKubun, price, condition) {
	// baibaiKubun : "1":売, "3":買
	// priceKubun : "1":成行, "2":指値
	// price : (priceKubun="2"の場合のみ指定)
	// condition : "0":指定なし, "2":寄付, "4": 引け, "6":不成 (変更がある場合のみ指定)
	return {
		type: CLICK_BUY_SELL,
		issueCode: issueCode,
		marketCode: marketCode,
		baibaiKubun: baibaiKubun,
		priceKubun: priceKubun,
		price: price,
		condition: condition,
	}
}