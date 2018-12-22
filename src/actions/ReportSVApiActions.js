//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const LOGIN_REQUEST							= Symbol('LOGIN_REQUEST');
export const LOGIN_SUCCESS							= Symbol('LOGIN_SUCCESS');
export const LOGIN_ERROR							= Symbol('LOGIN_ERROR');
export const LOGOUT_REQUEST							= Symbol('LOGOUT_REQUEST');
export const LOGOUT_SUCCESS							= Symbol('LOGOUT_SUCCESS');
export const LOGOUT_ERROR							= Symbol('LOGOUT_ERROR');
export const SEARCH_KOKYAKU_ISSUE_REQUEST			= Symbol('SEARCH_KOKYAKU_ISSUE_REQUEST');
export const SEARCH_KOKYAKU_ISSUE_SUCCESS			= Symbol('SEARCH_KOKYAKU_ISSUE_SUCCESS');
export const SEARCH_KOKYAKU_ISSUE_ERROR				= Symbol('SEARCH_KOKYAKU_ISSUE_ERROR');
export const KABU_NEW_ORDER_CHECK_REQUEST			= Symbol('KABU_NEW_ORDER_CHECK_REQUEST');
export const KABU_NEW_ORDER_CHECK_SUCCESS			= Symbol('KABU_NEW_ORDER_CHECK_SUCCESS');
export const KABU_NEW_ORDER_CHECK_ERROR				= Symbol('KABU_NEW_ORDER_CHECK_ERROR');
export const KABU_NEW_ORDER_REQUEST					= Symbol('KABU_NEW_ORDER_REQUEST');
export const KABU_NEW_ORDER_SUCCESS					= Symbol('KABU_NEW_ORDER_SUCCESS');
export const KABU_NEW_ORDER_ERROR					= Symbol('KABU_NEW_ORDER_ERROR');
export const KABU_ORDER_LIST_REQUEST			 	= Symbol('KABU_ORDER_LIST_REQUEST');
export const KABU_ORDER_LIST_SUCCESS				= Symbol('KABU_ORDER_LIST_SUCCESS');
export const KABU_ORDER_LIST_ERROR					= Symbol('KABU_ORDER_LIST_ERROR');
export const KANOUGAKU_SUII_REQUEST			 		= Symbol('KANOUGAKU_SUII_REQUEST');
export const KANOUGAKU_SUII_SUCCESS					= Symbol('KANOUGAKU_SUII_SUCCESS');
export const KANOUGAKU_SUII_ERROR					= Symbol('KANOUGAKU_SUII_ERROR');

export const WEB_SOCKET_OPENING						= Symbol('WEB_SOCKET_OPENING');
export const WEB_SOCKET_OPENED						= Symbol('WEB_SOCKET_OPENED');
export const WEB_SOCKET_CLOSING						= Symbol('WEB_SOCKET_CLOSING');
export const WEB_SOCKET_CLOSED						= Symbol('WEB_SOCKET_CLOSED');
//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function loginRequest(loginId, password) {
	return {
		type: LOGIN_REQUEST,
		loginId: loginId,
		password: password,
	}
}

export function loginSuccess(response) {
	return {
		type: LOGIN_SUCCESS,
		response: response,
	}
}

export function loginError(errorCode, message) {
	return {
		type: LOGIN_ERROR,
		errorCode: errorCode,
		message: message,
	}
}

export function logoutRequest(apiKey, setting) {
	return {
		type: LOGOUT_REQUEST,
		apiKey: apiKey,
		setting: setting,
	}
}

export function logoutSuccess(response) {
	return {
		type: LOGOUT_SUCCESS,
		response: response,
	}
}

export function logoutError(errorCode, message) {
	return {
		type: LOGOUT_ERROR,
		errorCode: errorCode,
		message: message,
	}
}

export function searchKokyakuIssueRequest(apiKey, kokyakuRegistN, issueCode, marketCode) {
	return {
		type: SEARCH_KOKYAKU_ISSUE_REQUEST,
		apiKey: apiKey,
		kokyakuRegistN: kokyakuRegistN,
		issueCode: issueCode,
		marketCode: marketCode,
	}
}

export function searchKokyakuIssueSuccess(response) {
	return {
		type: SEARCH_KOKYAKU_ISSUE_SUCCESS,
		response: response,
	}
}

export function searchKokyakuIssueError(errorCode, message, response) {
	return {
		type: SEARCH_KOKYAKU_ISSUE_ERROR,
		errorCode: errorCode,
		message: message,
		response: response
	}
}

export function kabuNewOrderCheckRequest(apiKey, order) {
	return {
		type: KABU_NEW_ORDER_CHECK_REQUEST,
		apiKey: apiKey,
		order: order,
	}
}

export function kabuNewOrderCheckSuccess(response) {
	return {
		type: KABU_NEW_ORDER_CHECK_SUCCESS,
		response: response,
	}
}

export function kabuNewOrderCheckError(errorCode, message) {
	return {
		type: KABU_NEW_ORDER_CHECK_ERROR,
		errorCode: errorCode,
		message: message,
	}
}

export function kabuNewOrderRequest(apiKey, order) {
	return {
		type: KABU_NEW_ORDER_REQUEST,
		apiKey: apiKey,
		order: order,
	}
}
export function kabuNewOrderSuccess(response) {
	return {
		type: KABU_NEW_ORDER_SUCCESS,
		response: response,
	}
}

export function kabuNewOrderError(errorCode, message) {
	return {
		type: KABU_NEW_ORDER_ERROR,
		errorCode: errorCode,
		message: message,
	}
}

export function getKabuOrderListRequest(apiKey) {
	return {
		type: KABU_ORDER_LIST_REQUEST,
		apiKey: apiKey,
	}
}
export function getKabuOrderListSuccess(response) {
	return {
		type: KABU_ORDER_LIST_SUCCESS,
		response: response,
	}
}

export function getKabuOrderListError(errorCode, message) {
	return {
		type: KABU_ORDER_LIST_ERROR,
		errorCode: errorCode,
		message: message,
	}
}

export function getKanougakuSuiiRequest(apiKey, kokyakuRegistN) {
	return {
		type: KANOUGAKU_SUII_REQUEST,
		apiKey: apiKey,
		kokyakuRegistN: kokyakuRegistN,
	}
}
export function getKanougakuSuiiSuccess(response) {
	return {
		type: KANOUGAKU_SUII_SUCCESS,
		response: response,
	}
}

export function getKanougakuSuiiError(errorCode, message) {
	return {
		type: KANOUGAKU_SUII_ERROR,
		errorCode: errorCode,
		message: message,
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

export function webSocketClosed() {
	return {
		type: WEB_SOCKET_CLOSED,
	}
}
