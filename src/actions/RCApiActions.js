//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
//export const REGIST_FEED_REQUEST		= Symbol('REGIST_FEED_REQUEST');
export const REGIST_FEED_SUCCESS		= Symbol('REGIST_FEED_SUCCESS');
export const REGIST_FEED_ERROR			= Symbol('REGIST_FEED_ERROR');
//export const UNREGIST_FEED_REQUEST		= Symbol('UNREGIST_FEED_REQUEST');
export const UNREGIST_FEED_SUCCESS		= Symbol('UNREGIST_FEED_SUCCESS');
export const UNREGIST_FEED_ERROR		= Symbol('UNREGIST_FEED_ERROR');
export const UPDATE_FEED				= Symbol('UPDATE_FEED');
//export const REGIST_BOARD_REQUEST		= Symbol('REGIST_BOARD_REQUEST');
export const REGIST_BOARD_SUCCESS		= Symbol('REGIST_BOARD_SUCCESS');
export const REGIST_BOARD_ERROR			= Symbol('REGIST_BOARD_ERROR');
//export const UNREGIST_BOARD_REQUEST		= Symbol('UNREGIST_BOARD_REQUEST');
export const UNREGIST_BOARD_SUCCESS		= Symbol('UNREGIST_BOARD_SUCCESS');
export const UNREGIST_BOARD_ERROR		= Symbol('UNREGIST_BOARD_ERROR');
export const UPDATE_BOARD				= Symbol('UPDATE_BOARD');
//export const REGIST_TICK_REQUEST		= Symbol('REGIST_TICK_REQUEST');
export const REGIST_TICK_SUCCESS		= Symbol('REGIST_TICK_SUCCESS');
export const REGIST_TICK_ERROR			= Symbol('REGIST_TICK_ERROR');
//export const UNREGIST_TICK_REQUEST		= Symbol('UNREGIST_TICK_REQUEST');
export const UNREGIST_TICK_SUCCESS		= Symbol('UNREGIST_TICK_SUCCESS');
export const UNREGIST_TICK_ERROR		= Symbol('UNREGIST_TICK_ERROR');
export const UPDATE_TICK				= Symbol('UPDATE_TICK');

export const KABU_SUMMARY				= Symbol('KABU_SUMMARY');
export const KABU_YAKUZYOU_SIKKOU		= Symbol('KABU_YAKUZYOU_SIKKOU');

export const WEB_SOCKET_OPENING			= Symbol('WEB_SOCKET_OPENING');
export const WEB_SOCKET_OPENED			= Symbol('WEB_SOCKET_OPENED');
export const WEB_SOCKET_CLOSING			= Symbol('WEB_SOCKET_CLOSING');
export const WEB_SOCKET_CLOSED			= Symbol('WEB_SOCKET_CLOSED');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
const createSuccessErrorAction = (successType, errorType, msg) => {
	let type;
	if(msg.status === "A00") {
		type = successType;
	} else {
		type = errorType;
	}
	return {
		type: type,
		msg: msg,
	};
}
// src --- 3:QUICK
/*
export function registFeedRequest(handle, row, src, marketCode, issueCode) {
	return {
		type: REGIST_FEED_REQUEST,
		handle: handle,
		row: row,
		src: src,
		marketCode: marketCode,
		issueCode: issueCode,
	}
}
*/
export function registFeedAck(msg) {
	return createSuccessErrorAction(REGIST_FEED_SUCCESS, REGIST_FEED_ERROR, msg);
}
/*
export function unregistFeedRequest(handle, row) {
	return {
		type: UNREGIST_FEED_REQUEST,
		handle: handle,
		row: row,
	}
}
*/
export function unregistFeedAck(msg) {
	return createSuccessErrorAction(UNREGIST_FEED_SUCCESS, UNREGIST_FEED_ERROR, msg);
}

export function updateFeed(msg) {
	return {
		type: UPDATE_FEED,
		msg,
	}
}
/*
export function registBoardRequest(handle, secType, marketCode, issueCode, priceType, priceDec, price) {
	return {
		type: REGIST_BOARD_REQUEST,
		handle: handle,
		secType: secType,
		marketCode: marketCode,
		issueCode: issueCode,
		priceType: priceType,
		priceDec: priceDec,
		price: price,
	}
}
*/
export function registBoardAck(msg) {
	return createSuccessErrorAction(REGIST_BOARD_SUCCESS, REGIST_BOARD_ERROR, msg);
}
/*
export function unregistBoardRequest(handle) {
	return {
		type: UNREGIST_BOARD_REQUEST,
		handle: handle,
	}
}
*/
export function unregistBoardAck(msg) {
	return createSuccessErrorAction(UNREGIST_BOARD_SUCCESS, UNREGIST_BOARD_ERROR, msg);
}
export function updateBoard(msg) {
	if(typeof msg.status !== "undefined") {
		return {
			type: REGIST_BOARD_SUCCESS,
			msg,
		}
	} else {
		return {
			type: UPDATE_BOARD,
			msg,
		}
	}
}
/*
export function registTickRequest(handle, marketCode, issueCode, type, adjust) {
	return {
		type: REGIST_TICK_REQUEST,
		handle: handle,
		marketCode: marketCode,
		issueCode: issueCode,
		type: type,
		adjust: adjust,
	}
}
*/
export function registTickAck(msg) {
	return createSuccessErrorAction(REGIST_TICK_SUCCESS, REGIST_TICK_ERROR, msg);
}
/*
export function unregistTickRequest(handle) {
	return {
		type: UNREGIST_TICK_REQUEST,
		handle: handle,
	}
}
*/
export function unregistTickAck(msg) {
	return createSuccessErrorAction(UNREGIST_TICK_SUCCESS, UNREGIST_TICK_ERROR, msg);
}

export function updateTick(msg) {
	return {
		type: UPDATE_TICK,
		msg,
	}
}

export function kabuSummary(msg) {
	return {
		type: KABU_SUMMARY,
		msg,
	}
}

export function kabuYakuzyouSikkou(msg) {
	return {
		type: KABU_YAKUZYOU_SIKKOU,
		msg,
	}
}

export function webSocketOpening() {
	return {
		type: WEB_SOCKET_OPENING,
	}
}

export function webSocketOpened() {
	return {
		type: WEB_SOCKET_OPENED,
	}
}

export function webSocketClosing() {
	return {
		type: WEB_SOCKET_CLOSING,
	}
}

export function webSocketClosed(event) {
	return {
		type: WEB_SOCKET_CLOSED,
		event,
	}
}
