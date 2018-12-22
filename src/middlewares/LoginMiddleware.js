
import * as LoginActions from "../actions/LoginActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
import {getApiKey} from "../reducers/LoginReducer";
import {getJSONState} from "../reducers/rootReducer";
//import {saveSetting} from "../api/ReportSVApi";

export default store => next => action => {
	if(action.type === LoginActions.LOGIN) {
		store.dispatch(ReportSVApiActions.loginRequest(action.loginId, action.password));
	}
	if(action.type === LoginActions.LOGOUT) {
		const state = store.getState();
		const apiKey = getApiKey(state);
		const setting = getJSONState(state);
		//saveSetting(apiKey, JSONState);
		store.dispatch(ReportSVApiActions.logoutRequest(apiKey, setting));
	}
	next(action);
}