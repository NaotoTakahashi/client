//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const DISP_DATA = Symbol('DISP_DATA');
export const SORT_LIST = Symbol('SORT_LIST');
export const SET_FILTER = Symbol('SET_FILTER');
export const SHOW_DETAIL = Symbol('SHOW_DETAIL');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function sortList(sorted, key, asc) {
	return {
		type: SORT_LIST,
		sorted: sorted,
		key: key,
		asc: asc,
	}
}
export function setFilter(key, data) {
	return {
		type: SET_FILTER,
		key: key,
		data: data,
	}
}
export function showDetail(key) {
	return {
		type: SHOW_DETAIL,
		key: key,
		//onDisp: onDisp,
	}
}

// export function dispData() {
// 	return {
// 		type: DISP_DATA,
// 	}
// }
