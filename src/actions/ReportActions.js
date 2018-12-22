//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const DISPLAY_NOTICE_LIST	= Symbol('DISPLAY_NOTICE_LIST');
export const CLOSE_NOTICE_LIST		= Symbol('CLOSE_NOTICE_LIST');
export const CHANGE_FILTER			= Symbol('CHANGE_FILTER');
//export const BREAK_SOCKET			= Symbol('BREAK_SOCKET');
export const UPDATE_NOTICE			= Symbol('UPDATE_NOTICE');
export const REPORT_UPDATE_REQUEST	= Symbol('REPORT_UPDATE_REQUEST');
export const REPORT_UPDATE_SUCCESS	= Symbol('REPORT_UPDATE_SUCCESS');
export const REPORT_UPDATE_ERROR	= Symbol('REPORT_UPDATE_ERROR');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function displayNoticeList() {
	return {
		type: DISPLAY_NOTICE_LIST,
	}
}
export function closeNoticeList() {
	return {
		type: CLOSE_NOTICE_LIST,
	}
}

export function changeFilter(e) {
	return {
		type: CHANGE_FILTER,
		val: e.target.value,
	}
}
/*
export function breakSocket() {
	return {
		type: BREAK_SOCKET,
	}
}
*/

export function updateNotice(obj) {
	return {
		type: UPDATE_NOTICE,
		obj: obj,
	}
}

export function reportUpdateRequest(form) {
	return {
		type: REPORT_UPDATE_REQUEST,
		form: form,
	}
}

export function reportUpdateSuccess(response) {
	return {
		type: REPORT_UPDATE_SUCCESS,
		response: response,
	}
}

export function reportUpdateError(errorCode, message) {
	return {
		type: REPORT_UPDATE_ERROR,
		errorCode: errorCode,
		message: message,
	}
}