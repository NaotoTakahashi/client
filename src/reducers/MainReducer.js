import {Record} from 'immutable';
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
import * as RCApiActions from "../actions/RCApiActions";

export const NAME = 'MAIN';
//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
export const getMainState = (state) => state[NAME];
//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const mainState = Record({
	RAPSVStatus: "0",			// "0":logouted, "1":logined, "2":logining, "3":logouting
	ReportSockStatus: "0",		// "0":logouted, "1":logined, "2":logining, "3":logouting
	WSSVStatus:"0",				// "0":logouted, "1":logined, "2":logining, "3":logouting
});

const initialState = mainState();

const mainReducer = (state = initialState, action) => {
	switch (action.type) {
		case ReportSVApiActions.LOGIN_REQUEST:
			return state.set("RAPSVStatus", "2");
		case ReportSVApiActions.LOGIN_SUCCESS:
			return state.set("RAPSVStatus", "1");
		case ReportSVApiActions.LOGIN_ERROR:
			return state.set("RAPSVStatus", "0");
		case ReportSVApiActions.LOGOUT_REQUEST:
			return state.set("RAPSVStatus", "3");
		case ReportSVApiActions.LOGOUT_SUCCESS:
			return state.set("RAPSVStatus", "0");
		case ReportSVApiActions.LOGOUT_ERROR:
			return state.set("RAPSVStatus", "1");
		case ReportSVApiActions.WEB_SOCKET_OPENING:
			return state.set("ReportSockStatus", "2");
		case ReportSVApiActions.WEB_SOCKET_OPENED:
			return state.set("ReportSockStatus", "1");
		case ReportSVApiActions.WEB_SOCKET_CLOSING:
			return state.set("ReportSockStatus", "3");
		case ReportSVApiActions.WEB_SOCKET_CLOSED:
			return state.set("ReportSockStatus", "0");
		case RCApiActions.WEB_SOCKET_OPENING:
			return state.set("WSSVStatus", "2");
		case RCApiActions.WEB_SOCKET_OPENED:
			return state.set("WSSVStatus", "1");
		case RCApiActions.WEB_SOCKET_CLOSING:
			return state.set("WSSVStatus", "3");
		case RCApiActions.WEB_SOCKET_CLOSED:
			return state.set("WSSVStatus", "0");
		default:
			return state;
	}
}

export default mainReducer