import {Map} from 'immutable';

export const NAME = 'MYMENU';


//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const ACTION_NAME		= Symbol('ACTION_NAME');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function actionName(arg) {
	return {
		type: ACTION_NAME,
		arg: arg,
	}
}

//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const initialState = Map({
	
})

const myMenuReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_NAME:
			return state.withMutations( s => {
				s.set('arg', action.arg)
			});
		default:
			return state;
	}
}

export default myMenuReducer;