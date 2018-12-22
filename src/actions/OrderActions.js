//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const CHANGE_KOKYAKU						= Symbol('CHANGE_KOKYAKU');
export const CHANGE_ISSUE_MARKET					= Symbol('CHANGE_ISSUE_MARKET');
//export const SEARCH_KOKYAKU_ISSUE					= Symbol('SEARCH_KOKYAKU_ISSUE');
export const CLICK_CLEAR_KOKYAKU					= Symbol('CLICK_CLEAR_KOKYAKU');
export const CLICK_KANOUGAKU_SUII					= Symbol('CLICK_KANOUGAKU_SUII');
export const CLICK_CLEAR_ISSUE						= Symbol('CLICK_CLEAR_ISSUE');
export const CHANGE_TORIHIKI						= Symbol('CHANGE_TORIHIKI');
export const CHANGE_GYAKUSASI_ORDER_TYPE			= Symbol('CHANGE_GYAKUSASI_ORDER_TYPE');
export const CHANGE_CHECK_LOT						= Symbol('CHANGE_CHECK_LOT');
export const CHANGE_ORDER_SURYOU					= Symbol('CHANGE_ORDER_SURYOU');
export const CHANGE_ORDER_PRICE_KUBUN				= Symbol('CHANGE_ORDER_PRICE_KUBUN');
export const CHANGE_ORDER_PRICE						= Symbol('CHANGE_ORDER_PRICE');
export const CHANGE_GYAKUSASI_ZYOUKEN				= Symbol('CHANGE_GYAKUSASI_ZYOUKEN');
export const CHANGE_GYAKUSASI_ORDER_PRICE_KUBUN		= Symbol('CHANGE_GYAKUSASI_ORDER_PRICE_KUBUN');
export const CHANGE_GYAKUSASI_ORDER_PRICE			= Symbol('CHANGE_GYAKUSASI_ORDER_PRICE');
export const CHANGE_CONDITION						= Symbol('CHANGE_CONDITION');
export const CHANGE_ORDER_EXPIRE_DAY				= Symbol('CHANGE_ORDER_EXPIRE_DAY');
export const CHANGE_ZYOUTOEKI_KAZEI_C				= Symbol('CHANGE_ZYOUTOEKI_KAZEI_C');
export const CHANGE_AZUKARI							= Symbol('CHANGE_AZUKARI');
export const CHANGE_SYOUTI							= Symbol('CHANGE_SYOUTI');
export const CLICK_HENSAI_SITEI						= Symbol('CLICK_HENSAI_SITEI');
export const TO_CONFIRM								= Symbol('TO_CONFIRM');
export const TO_INPUT								= Symbol('TO_INPUT');
export const TO_COMPLETE							= Symbol('TO_COMPLETE');
export const CLICK_ORDER_LIST						= Symbol('CLICK_ORDER_LIST');
export const CHECK_SEARCH_KOKYAKU_ISSUE_ERROR		= Symbol('CHECK_SEARCH_KOKYAKU_ISSUE_ERROR');
export const CHECK_NEW_ORDER_ERROR					= Symbol('CHECK_NEW_ORDER_ERROR');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function changeKokyaku(kokyakuRegistN) {
	return {
		type: CHANGE_KOKYAKU,
		kokyakuRegistN: kokyakuRegistN,
	}
}

export function changeIssueMarket(issueCode, marketCode) {
	return {
		type: CHANGE_ISSUE_MARKET,
		issueCode: issueCode,
		marketCode: marketCode,
	}
}
/*
export function searchKokyakuIssue(id, kokyakuRegistN, issueCode, marketCode) {
	return {
		type: SEARCH_KOKYAKU_ISSUE,
		id: id,
		kokyakuRegistN: kokyakuRegistN,
		issueCode: issueCode,
		marketCode: marketCode,
	}
}
*/
export function clickKanougakuSuii(kokyakuRegistN) {
	return {
		type: CLICK_KANOUGAKU_SUII,
		kokyakuRegistN: kokyakuRegistN,
	}
}
export function clickClearKokyaku() {
	return {
		type: CLICK_CLEAR_KOKYAKU,
	}
}

export function clickClearIssue() {
	return {
		type: CLICK_CLEAR_ISSUE,
	}
}
export function changeTorihiki(genkinSinyouKubun, baibaiKubun) {
	return {
		type: CHANGE_TORIHIKI,
		genkinSinyouKubun: genkinSinyouKubun,
		baibaiKubun: baibaiKubun,
	}
}
export function changeGyakusasiOrderType(value) {
	return {
		type: CHANGE_GYAKUSASI_ORDER_TYPE,
		value: value,
	}
}
export function changeOrderSuryou(value) {
	return {
		type: CHANGE_ORDER_SURYOU,
		value: value,
	}
}
export function changeCheckLot(value) {
	return {
		type: CHANGE_CHECK_LOT,
		value: value,
	}
}
export function changeOrderPriceKubun(value) {
	return {
		type: CHANGE_ORDER_PRICE_KUBUN,
		value: value,
	}
}
export function changeOrderPrice(value) {
	return {
		type: CHANGE_ORDER_PRICE,
		value: value,
	}
}
export function changeGyakusasiZyouken(value) {
	return {
		type: CHANGE_GYAKUSASI_ZYOUKEN,
		value: value,
	}
}
export function changeGyakusasiOrderPriceKubun(value) {
	return {
		type: CHANGE_GYAKUSASI_ORDER_PRICE_KUBUN,
		value: value,
	}
}
export function changeGyakusasiOrderPrice(value) {
	return {
		type: CHANGE_GYAKUSASI_ORDER_PRICE,
		value: value,
	}
}
export function changeCondition(value) {
	return {
		type: CHANGE_CONDITION,
		value: value,
	}
}
export function changeOrderExpireDay(value) {
	return {
		type: CHANGE_ORDER_EXPIRE_DAY,
		value: value,
	}
}
export function changeZyoutoekiKazeiC(value) {
	return {
		type: CHANGE_ZYOUTOEKI_KAZEI_C,
		value: value,
	}
}
export function changeAzukari(value) {
	return {
		type: CHANGE_AZUKARI,
		value: value,
	}
}
export function changeSyouti(value) {
	return {
		type: CHANGE_SYOUTI,
		value: value,
	}
}
export function clickHensaiSitei() {
	return {
		type: CLICK_HENSAI_SITEI,
	}
}
export function toInput(resetFlg=false) {
	return {
		type: TO_INPUT,
		resetFlg: resetFlg,
	}
}

export function toConfirm(order) {
	return {
		type: TO_CONFIRM,
		order: order,
	}
}

export function toComplete() {
	return {
		type: TO_COMPLETE,
	}
}

export function clickOrderList(kokyakuRegistN) {
	return {
		type: CLICK_ORDER_LIST,
		kokyakuRegistN: kokyakuRegistN,
	}
}

export function checkSearchKokyakuIssueError(code, message) {
	return {
		type: CHECK_SEARCH_KOKYAKU_ISSUE_ERROR,
		code: code,
		message: message,
	}
}

export function checkNewOrderError(code, message) {
	return {
		type: CHECK_NEW_ORDER_ERROR,
		code: code,
		message: message,
	}
}