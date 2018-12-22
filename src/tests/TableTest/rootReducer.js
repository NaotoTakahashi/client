/* combine reducers */
import { combineReducers } from 'redux';
import main, {NAME as MODULE_NAME_MAIN} from './MainReducer';
import {LOGOUT_SUCCESS} from "../actions/LoginActions";
import login, {NAME as MODULE_NAME_LOGIN} from './LoginReducer';
import frame, {NAME as MODULE_NAME_FRAME} from './FrameReducer';
import contextMenu, {NAME as MODULE_NAME_CONTEXT_MENU} from './ContextMenuReducer'
import report, {NAME as MODULE_NAME_REPORT} from './ReportReducer';
import mios, {NAME as MODULE_NAME_MIOS} from './MIOSReducer';
import kanzyou, {NAME as MODULE_NAME_KANZYOU} from './KanzyouReducer';
import board, {NAME as MODULE_NAME_BOARD} from './BoardReducer';
import fullBoard, {NAME as MODULE_NAME_FULL_BOARD} from './FullBoardReducer';
import order, {NAME as MODULE_NAME_ORDER} from './OrderReducer';
import chart, {NAME as MODULE_NAME_CHART} from './ChartReducer';
import test, {NAME as MODULE_NAME_TEST} from "../tests/TestReducer";

/* cross Logout action to FrameReducer start */

const crossLogoutReducer = (state, action) => {
	switch(action.type) {
		case LOGOUT_SUCCESS:
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
					[MODULE_NAME_FULL_BOARD] : board(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_ORDER] : order(undefined, {type: "@@redux/INIT"}),
					[MODULE_NAME_CHART] : chart(undefined, {type: "@@redux/INIT"}),
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
	[MODULE_NAME_TEST] : test,
});

const rootReducer = (state, action) => {
	const intermediateState = combinedReducer(state, action);
	const finalState = crossLogoutReducer(intermediateState, action);	// add cross reducer
	return finalState;
}

export default rootReducer;