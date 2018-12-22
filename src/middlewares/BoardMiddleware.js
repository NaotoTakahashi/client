
import * as BoardActions from '../actions/BoardActions';
import * as RCApiActions from '../actions/RCApiActions';
import {getState} from "../reducers/BoardReducer";
import {getMainState} from "../reducers/MainReducer";
import {RcApi} from "../middlewares/MainMiddleware";

export default store => next => action => {
	const state = store.getState();
	const myState = getState(state);
	const webSockEnabled = (getMainState(state).get("WSSVStatus") === "1")
	if(action.type === BoardActions.CHANGE_ISSUE_MARKET) {
		if(webSockEnabled) RcApi.registFeed(action.id, 0, 3, action.issueCode, action.marketCode);
	}
	next(action);
	if(action.type === RCApiActions.WEB_SOCKET_OPENED) {
		for(const boardState of myState.values()) {
			RcApi.registFeed(boardState.id, 0, 3, boardState.issueCode, boardState.marketCode);
		}
	}
}