//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const SHOW_CONTEXT_MENU		= Symbol('SHOW_CONTEXT_MENU');
export const HIDE_CONTEXT_MENU		= Symbol('HIDE_CONTEXT_MENU');
export const SET_CONTEXT_MENU_SIZE	= Symbol('SET_CONTEXT_MENU_SIZE');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function showContextMenu(container, x, y) {
	return {
		type: SHOW_CONTEXT_MENU,
		container: container,
		x: x,
		y: y,
	}
}

export function hideContextMenu(event) {
	return {
		type: HIDE_CONTEXT_MENU,
		event: event,
	}
}

export function setContextMenuSize(width, height) {
	return {
		type: SET_CONTEXT_MENU_SIZE,
		width: width,
		height: height,
	}
}
