import {Record} from 'immutable';
import * as ContextMenuActions from "../actions/ContextMenuActions";
export const NAME = 'CONTEXT_MENU';
//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------
const contextMenuState = Record({
	container: null,
	top: 0,
	left: 0,
	width: 0,
	height: 0,
})

const initialState = contextMenuState();

//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
export const getcontextMenuState = (state) => state[NAME];

//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const contextMenuReducer = (state = initialState, action) => {
	switch (action.type) {
		case ContextMenuActions.SHOW_CONTEXT_MENU:
			if(action.container === null || action.container === undefined)
				return state;
			return state.withMutations(s => {
				s.set('container', action.container)
				.set('top', action.x)
				.set('left', action.y)
			});
		case ContextMenuActions.HIDE_CONTEXT_MENU:
			if(action.event.clientX < state.x 
				|| action.event.clientX > state.x + state.width
				|| action.event.clientY < state.y
				|| action.event.clientY > state.y + state.height
			) {
				return state.withMutations(s => {
					s.set('container', null)
					.set('top', 0)
					.set('left', 0)
				});
			}
			return state;
		case ContextMenuActions.SET_CONTEXT_MENU_SIZE:
			return state.withMutations(s => {
				s.set('width', action.width)
				.set('height', action.height)
			});
		default:
			return state;
	}
}

export default contextMenuReducer;