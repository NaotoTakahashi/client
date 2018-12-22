/* combine reducers */
import { combineReducers } from 'redux';
import main, {NAME as MODULE_NAME_MAIN} from './MainReducer';
import {LOGOUT_COMPLETED} from "../actions/MainActions";
import login, {NAME as MODULE_NAME_LOGIN} from './LoginReducer';
import frame, {NAME as MODULE_NAME_FRAME, getFrameListStateForSetting} from './FrameReducer';
import contextMenu, {NAME as MODULE_NAME_CONTEXT_MENU} from './ContextMenuReducer'
import report, {NAME as MODULE_NAME_REPORT} from './ReportReducer';
import mios, {NAME as MODULE_NAME_MIOS} from './MIOSReducer';
import kanzyou, {NAME as MODULE_NAME_KANZYOU} from './KanzyouReducer';
import board, {NAME as MODULE_NAME_BOARD, getStateForSetting as getBoardStateForSetting} from './BoardReducer';
import fullBoard, {NAME as MODULE_NAME_FULL_BOARD} from './FullBoardReducer';
import order, {NAME as MODULE_NAME_ORDER, getStateForSetting as getOrderStateForSetting} from './OrderReducer';
import chart, {NAME as MODULE_NAME_CHART, getStateForSetting as getChartStateForSetting} from './ChartReducer';
import orderList, {NAME as MODULE_NAME_ORDER_LIST} from './OrderListReducer';
import asset, {NAME as MODULE_NAME_ASSET} from './AssetReducer';

/* cross Logout action to FrameReducer start */


export const getJSONState = (state) => {
	return JSON.stringify({
		[MODULE_NAME_MAIN] : state[MODULE_NAME_MAIN].toJS(),
		[MODULE_NAME_LOGIN] : state[MODULE_NAME_LOGIN].toJS(),
		[MODULE_NAME_FRAME] : getFrameListStateForSetting(state).toJS(),
		//[MODULE_NAME_CONTEXT_MENU] : state[MODULE_NAME_CONTEXT_MENU].toJS(),
		//[MODULE_NAME_REPORT] : state[MODULE_NAME_REPORT].toJS(),
		//[MODULE_NAME_MIOS] : state[MODULE_NAME_MIOS].toJS(),
		//[MODULE_NAME_KANZYOU] : state[MODULE_NAME_KANZYOU].toJS(),
		[MODULE_NAME_BOARD] : getBoardStateForSetting(state).toJS(),
		//[MODULE_NAME_FULL_BOARD] : state[MODULE_NAME_FULL_BOARD].toJS(),
		[MODULE_NAME_ORDER] : getOrderStateForSetting(state).toJS(),
		[MODULE_NAME_CHART] : getChartStateForSetting(state).toJS(),
		//[MODULE_NAME_ORDER_LIST] : state[MODULE_NAME_ORDER_LIST].toJS(),
		[MODULE_NAME_ASSET] : state[MODULE_NAME_ASSET].toJS(),
	})
}

const crossLogoutReducer = (state, action) => {
	switch(action.type) {
		case LOGOUT_COMPLETED:
			if(state[MODULE_NAME_LOGIN].get('status') !== "0") {	// Logouted (status != logined)
				return {
					[MODULE_NAME_MAIN] : main(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_LOGIN] : login(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_FRAME] : frame(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_CONTEXT_MENU] : contextMenu(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_REPORT] : report(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_MIOS] : mios(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_KANZYOU] : kanzyou(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_BOARD] : board(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_FULL_BOARD] : fullBoard(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_ORDER] : order(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_CHART] : chart(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_ORDER_LIST] : orderList(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_ASSET] : asset(undefined, {type: "@@redux/INIT"}),
				}
			}
			return state;
		default: return state;
	}
}
/* combine Logout action to FrameReducer end */

const combinedReducer = combineReducers({
	[MODULE_NAME_MAIN] : main,
	[MODULE_NAME_LOGIN] : login,
	[MODULE_NAME_FRAME] : frame,
	[MODULE_NAME_CONTEXT_MENU] : contextMenu,
	[MODULE_NAME_REPORT] : report,
	[MODULE_NAME_MIOS] : mios,
	[MODULE_NAME_KANZYOU] : kanzyou,
	[MODULE_NAME_BOARD] : board,
	[MODULE_NAME_FULL_BOARD] : fullBoard,
	[MODULE_NAME_ORDER] : order,
	[MODULE_NAME_CHART] : chart,
	[MODULE_NAME_ORDER_LIST] : orderList,
	[MODULE_NAME_ASSET] : asset,
});

const rootReducer = (state, action) => {
	const intermediateState = combinedReducer(state, action);
	const finalState = crossLogoutReducer(intermediateState, action);	// add cross reducer
	return finalState;
}

export default rootReducer;