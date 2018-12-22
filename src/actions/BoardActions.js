
//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const ADD_BOARD					= Symbol('ADD_BOARD');
export const RESET_BOARD				= Symbol("RESET_BOARD");
export const CHANGE_ISSUE				= Symbol('CHANGE_ISSUE');
export const CHANGE_ISSUE_MARKET		= Symbol('CHANGE_ISSUE_MARKET');
export const UNDO_CHANGE_ISSUE_MARKET	= Symbol('UNDO_CHANGE_ISSUE_MARKET');
export const SET_MESSAGE				= Symbol('SET_MESSAGE');
//export const SET_VALUE			= 'SET_VALUE';
//export const UPDATE_VALUE		= 'UPDATE_VALUE';
//export const SET_CLASSNAME		= 'SET_CLASSNAME';
export const UPDATE_BOARD				= Symbol('UPDATE_BOARD');
export const RESET_UPDATETIME			= Symbol('RESET_UPDATETIME');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function addBoard(boardId) {
	return {
		type: ADD_BOARD,
		id: boardId,
	}
}

export function resetBoard(boardId) {
	return {
		type: RESET_BOARD,
		id: boardId,
	}
}

export function changeIssue(boardId, issueCode, issueName, losh) {
	return {
		type: CHANGE_ISSUE,
		id: boardId,
		issueCode: issueCode,
		issueName: issueName,
		losh: losh,
	}
}

export function changeIssueMarket(boardId, issueCode, marketCode, issueName, losh) {
	return {
		type: CHANGE_ISSUE_MARKET,
		id: boardId,
		issueCode: issueCode,
		marketCode: marketCode,
		issueName: issueName,
		losh: losh,
	}
}

export function undoChangeIssueMarket(boardId) {
	return {
		type: UNDO_CHANGE_ISSUE_MARKET,
		id: boardId,
	}
}

export function setMessage(boardId, message) {
	return {
		type: SET_MESSAGE,
		id: boardId,
		message: message,
	}
}
/*
export function setValue(boardId, itemName, value) {
	return {
		module: NAME,
		type: SET_VALUE,
		id: boardId,
		item: itemName,
		value: value,
	}
}

export function updateValue(boardId, itemName, value, now) {
	return {
		module: NAME,
		type: UPDATE_VALUE,
		id: boardId,
		name: itemName,
		value: value,
		now: now,
	}
}

export function setClassName(boardId, itemName, className) {
	return {
		module: NAME,
		type: SET_CLASSNAME,
		id: boardId,
		name: itemName,
		className: className,
	}
}
*/

// obj = {
//	Id: ,
//	[name]: value,
//}
export function updateBoard(obj) {
	return {
		type: UPDATE_BOARD,
		obj: obj,
	}
}

export function resetUpdateTime(boardId) {
	return {
		type: RESET_UPDATETIME,
		id: boardId,
	}
}