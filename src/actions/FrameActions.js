//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const SET_INITIAL_POSITION	= Symbol('SET_INITIAL_POSITION');
export const CREATE_FRAME			= Symbol('CREATE_FRAME');
export const CREATE_IFRAME			= Symbol('CREATE_IFRAME');
export const CLOSE					= Symbol('CLOSE');
export const CLOSE_ALL				= Symbol('CLOSE_ALL');
export const SHOW					= Symbol('SHOW');
export const MOVE					= Symbol('MOVE');
export const START_MOVE				= Symbol('START_MOVE');
export const END_MOVE				= Symbol('END_MOVE');
export const RESIZE					= Symbol('RESIZE');
export const START_RESIZE			= Symbol('START_RESIZE');
export const END_RESIZE				= Symbol('END_RESIZE');
export const CHANGE_CURSOR			= Symbol('CHANGE_CURSOR');
export const MAXIMIZE				= Symbol('MAXIMIZE');
export const RESTORE				= Symbol('RESTORE');
export const SET_TITLE				= Symbol('SET_TITLE');
export const SET_URL				= Symbol('SET_URL');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function setInitialPosition(x, y) {
	return {
		type: SET_INITIAL_POSITION,
		x: x,
		y: y,
	}
}

export function createFrame(id, title, container, width, height, resizable=true) {
	return {
		type: CREATE_FRAME,
		id: id,
		title: title,
		container: container,
		resizable: resizable,
		width: width,
		height: height,
	}
}

export function createIframe(id, title, url, width, height, resizable=true) {
	return {
		type: CREATE_IFRAME,
		id: id,
		title: title,
		url: url,
		resizable: resizable,
		width: width,
		height: height,
	}
}

export function close(id) {
	return {
		type: CLOSE,
		id: id,
	}
}

export function closeAll() {
	return {
		type: CLOSE_ALL,
	}
}

export function show(id) {
	return {
		type: SHOW,
		id: id,
	}
}

export function move(id, x, y) {
	return {
		type: MOVE,
		id: id,
		x: x,
		y: y,
	}
}

export function startMove(id) {
	return {
		type: START_MOVE,
		id: id,
	}
}

export function endMove(id) {
	return {
		type: END_MOVE,
		id: id,
	}
}

export function resize(id, x, y, width, height) {
	return {
		type: RESIZE,
		id: id,
		x: x,
		y: y,
		width: width,
		height: height,
	}
}

export function startResize(id) {
	return {
		type: START_RESIZE,
		id: id,
	}
}

export function endResize(id) {
	return {
		type: END_RESIZE,
		id: id,
	}
}

export function changeCursor(id, cursor) {
	return {
		type: CHANGE_CURSOR,
		id: id,
		cursor: cursor,
	}
}

export function maximize(id) {
	return {
		type: MAXIMIZE,
		id: id,
	}
}

export function restore(id) {
	return {
		type: RESTORE,
		id: id,
	}
}

export function setTitle(id, title) {
	return {
		type: SET_TITLE,
		id: id,
		title: title,
	}
}

export function setURL(id, url) {
	return {
		type: SET_URL,
		id: id,
		url: url,
	}
}
