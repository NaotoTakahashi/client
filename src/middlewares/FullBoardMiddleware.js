
import * as FullBoardActions from "../actions/FullBoardActions";
import {NAME, DisplayType} from "../reducers/FullBoardReducer";
import {RcApi} from "./MainMiddleware";

export default store => next => action => {
	const state = store.getState()[NAME];
	if(action.type === FullBoardActions.CHANGE_ISSUE_MARKET) {
		if(state.get('issueCode') === action.issueCode && state.get('marketCode') === action.marketCode) {
			let statePrice = state.getIn(['centerPrice', 'data']);
			if(statePrice === '') statePrice = 0;
			if(statePrice !== action.price)
				RcApi.registBoard(NAME, 0, action.issueCode, action.marketCode, action.priceType, action.priceDec, action.price);
		} else {
			RcApi.registFeed(NAME, 0, 3, action.issueCode, action.marketCode);
			if(state.get('displayType') !== DisplayType["OHLC"])
				RcApi.registBoard(NAME, 0, action.issueCode, action.marketCode);
		}
	}
	if(action.type === FullBoardActions.RESET_BOARD) {
		if(state.get('depthFlag'))	RcApi.unregistBoard(NAME);
		if(state.get('feedFlag'))	RcApi.unregistFeed(NAME, 0);
	}
	if(action.type === FullBoardActions.CHANGE_DISPLAY) {
		action.depthFlag = state.get('depthFlag');
		if(action.dispType === DisplayType["OHLC"] && state.get('issueCode') && action.depthFlag) {
			RcApi.unregistBoard(NAME);
			action.depthFlag = 0;
			//RcApi.registFeed(NAME, 0, 3, state.get('issueCode'), state.get('marketCode'));
		} else if(state.get('displayType') === DisplayType["OHLC"] && state.get('issueCode') && state.get('marketCode')){
			//RcApi.unregistFeed(NAME, 0);
			RcApi.registBoard(NAME, 0, state.get('issueCode'), state.get('marketCode'), state.getIn(['centerPrice', 'type']), state.getIn(['centerPrice', 'decimalPoint']), state.getIn(['centerPrice', 'data']));
			action.depthFlag = 1;
		}
	}
	next(action);
}