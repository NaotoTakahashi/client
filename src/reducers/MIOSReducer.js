import {Map, Record} from 'immutable';

export const NAME = 'MIOS';

//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------
export const MarketName = {
	"00": "東証",
	"02": "名証",
	"05": "福証",
	"07": "札証",
}
/*
const issueSearchState = Record({
	issueCode: "",
	response: null,
});
*/
const initialState = Map({
	order: Map({
		issueCode: "",
		status: ""
	}),
	orderList: Map({}),
	issueSearchList: Map({}),
});

//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
export const getMIOSState = (state) => state[NAME];

export const getIssueSearchState = (state, id) => state[NAME].getIn(["issueSearchList", id]);
//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const miosReducer = (state = initialState, action) => {
	switch (action.type) {
		default:
			return state;
	}
}

export default miosReducer;
