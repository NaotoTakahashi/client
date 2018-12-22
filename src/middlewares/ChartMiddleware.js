
import * as ChartActions from '../actions/ChartActions';
import * as RCApiActions from '../actions/RCApiActions';
import {RcApi} from "./MainMiddleware";
import {NAME} from "../reducers/ChartReducer";
import {setPeriodToLib} from "../reducers/ChartReducer";
import {getFrameState} from '../reducers/FrameReducer';
import {HEADER_HEIGHT as FRAME_BAR_HEIGHT} from '../components/FrameComponent'

function isMouseEvent(e, frameState) {
	if(!frameState) return false;
	let isAcive = frameState.active;
	if (!isAcive && isAcive !== undefined) return false;
	const startX = frameState.x;
	const startY = frameState.y;
	const endX = startX + frameState.width;
	const endY = startY + frameState.height + FRAME_BAR_HEIGHT;
	if (startX <= e.clientX && startY <= e.clientY) {
		if (e.clientX < endX + 50 && e.clientY < endY + 50) {
			return true;
		}
	}
	return false;
}

function isKeyEvent(e, frameState) {
	if(!frameState) return false;
	let isAcive = frameState.active;
	if (!isAcive && isAcive !== undefined) {
		return false;
	}
	return true;
}

function registChart(chartState) {
	const chartlib = chartState.CHART.lib.getLib();
	const [periodType, minValue] = chartlib.getPeriod();
	const adjust = (chartlib.getAdjustPrice()) ? 1 : 0;
	const subCode = "101";
	const issue = chartlib.getIssue();
	let curHandle = chartlib.getHandle();
	if(!chartlib.isInitialHandle()){
		RcApi.unregistTick(curHandle);
	}
	chartlib.setHandle(++curHandle);
	RcApi.registTick(curHandle, issue[0], issue[1], periodType, minValue, adjust, subCode);
}

export default store => next => action => {
	if(action.type === ChartActions.CHART_MOUSE_MOVE) {
		const state = store.getState();
		const chartlib = state.CHART.lib.getLib();
		const frameState = getFrameState(state, NAME);
		if (isMouseEvent(action.event, frameState)) {
			const startX = frameState.x;
			const startY = frameState.y + FRAME_BAR_HEIGHT + 20;
			chartlib.onMouseMove(action.event, startX, startY);
		}
		return;
	}
	if(action.type === ChartActions.CHART_MOUSE_DOWN) {
		const state = store.getState();
		const chartlib = state.CHART.lib.getLib();
		const frameState = getFrameState(state, NAME);
		if (isMouseEvent(action.event, frameState)) {
			const startX = frameState.x;
			const startY = frameState.y + FRAME_BAR_HEIGHT + 20;
			chartlib.onMouseDown(action.event, startX, startY);
		}
		return;
	}
	if(action.type === ChartActions.CHART_MOUSE_UP) {
		const state = store.getState();
		const chartlib = state.CHART.lib.getLib();
		const frameState = getFrameState(state, NAME);
		if (isMouseEvent(action.event, frameState)) {
			const startX = frameState.x;
			const startY = frameState.y + FRAME_BAR_HEIGHT + 20;
			chartlib.onMouseUp(action.event, startX, startY);
		}
		return;
	}
	if(action.type === ChartActions.CHART_KEY_UP) {
		const state = store.getState();
		const chartlib = state.CHART.lib.getLib();
		const frameState = getFrameState(state, NAME);
		if (isKeyEvent(action.event, frameState)) {
			chartlib.onKeyUp(action.event);
		}
		return;
	}
	if(action.type === ChartActions.SET_CHART_PERIOD) {
		const chartState = store.getState();
		const chartlib = chartState.CHART.lib.getLib();
		setPeriodToLib(chartlib, action.chartPeriod);
		registChart(chartState);
	}
	if(action.type === ChartActions.CHANGE_ISSUE_MARKET) {
		const chartState = store.getState();
		const chartlib = chartState.CHART.lib.getLib();
		chartlib.changeIssue(action.issueCode, action.issueName, action.marketCode);
		registChart(chartState);
	}
	if(action.type === RCApiActions.WEB_SOCKET_OPENED) {
		const chartState = store.getState();
		const chartlib = chartState.CHART.lib.getLib();
		const issue = chartlib.getIssue();
		if(issue[0]){
			registChart(chartState);
		}
	}
	next(action);
}
