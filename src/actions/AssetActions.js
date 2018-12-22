//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const GET_KANOUGAKU_SUII						= Symbol('GET_KANOUGAKU_SUII');
export const CHECK_GET_KANOUGAKU_SUII_ERROR			= Symbol('CHECK_GET_KANOUGAKU_SUII_ERROR');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function getKanougakuSuii(kokyakuRegistN) {
	return {
		type: GET_KANOUGAKU_SUII,
		kokyakuRegistN: kokyakuRegistN,
	}
}

export function checkGetKanougakuSuiiError(code, message) {
	return {
		type: CHECK_GET_KANOUGAKU_SUII_ERROR,
		code: code,
		message: message,
	}
}
