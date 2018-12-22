import Immutable, {Map} from 'immutable';
import * as KanzyouActions from "../actions/KanzyouActions";
export const NAME = 'KANZYOU';
//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const initialState = Map({
	
})

const kanzyouReducer = (state = initialState, action) => {
	switch (action.type) {
		case KanzyouActions.ACTION_NAME:
			return state.withMutations( s => {
				s.set('arg', action.arg)
			});
		default:
			return state;
	}
	return state;
}

export default kanzyouReducer;

//-----------------------------------------------------------------------------
//	Data
//-----------------------------------------------------------------------------
export const ReportMenu = {
	"交通費": {url: "/report/user/Page1", id: "koutuhi", title: "交通費起票", width: 870, height: 480},
	"出金伝票（テスト用）": {url: "/report/user/Page2", id: "shiharai", title: "出金伝票起票", width: 550, height: 470} 
}