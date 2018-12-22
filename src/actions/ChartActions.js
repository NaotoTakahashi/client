//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const SEND_CHART_REGIST   = Symbol('SEND_CHART_REGIST');
export const UPDATE_CHART		 = Symbol('UPDATE_CHART');
export const CHANGE_ISSUE		 = Symbol('CHANGE_ISSUE');
export const CHANGE_ISSUE_MARKET = Symbol('CHANGE_ISSUE_MARKET');
export const SET_MESSAGE		 = Symbol('SET_MESSAGE');
export const DISP_OPTION		 = Symbol('DISP_OPTION');
export const TECH_MAIN		 	 = Symbol('TECH_MAIN');
export const TECH_SUB	 		 = Symbol('TECH_SUB');
export const SET_CHART_SHAPE	 = Symbol('SET_CHART_SHAPE');
export const SET_CHART_PERIOD	 = Symbol('SET_CHART_PERIOD');
export const SET_TECH_TOOL		 = Symbol('SET_TECH_TOOL');
export const SET_CHART_SUB_INDEX = Symbol('SET_CHART_SUB_INDEX');
export const CHART_MOUSE_MOVE 	 = Symbol('CHART_MOUSE_MOVE');
export const CHART_MOUSE_DOWN 	 = Symbol('CHART_MOUSE_DOWN');
export const CHART_MOUSE_UP 	 = Symbol('CHART_MOUSE_UP');
export const CHART_KEY_UP 	 	 = Symbol('CHART_KEY_UP');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function changeIssue(id, issueCode, issueName) {
	return {
		type: CHANGE_ISSUE,
		id: id,
		issueCode: issueCode,
		issueName: issueName,
	}
}

export function changeIssueMarket(id, issueCode, marketCode, issueName) {
	return {
		type: CHANGE_ISSUE_MARKET,
		id: id,
		issueCode: issueCode,
		marketCode: marketCode,
		issueName: issueName,
	}
}

export function sendChartRegist(chartId, issueCode, marketCode) {
	return {
		type: SEND_CHART_REGIST,
		id: chartId,
		issueCode: issueCode,
		marketCode: marketCode,
	}
}

export function setMessage(chartId, message) {
	return {
		type: SET_MESSAGE,
		id: chartId,
		message: message,
	}
}

export function updateChart(obj) {
	return {
		type: UPDATE_CHART,
		obj: obj,
	}
}

export function tglDispOption(dispOption) {
	return {
		type: DISP_OPTION,
		dispOption: dispOption,
	}
}

export function setTechTool(techTool) {
	return {
		type: SET_TECH_TOOL,
		techTool: techTool,
	}
}


export function toggleTechMain(techMain) {
	return {
		type: TECH_MAIN,
		techMain: techMain,
	}
}

export function toggleTechSub(techSub) {
	return {
		type: TECH_SUB,
		techSub: techSub,
	}
}

export function setChartShape(chartShape) {
	return {
		type: SET_CHART_SHAPE,
		chartShape: chartShape,
	}
}

export function setChartPeriod(chartPeriod) {
	return {
		type: SET_CHART_PERIOD,
		chartPeriod: chartPeriod,
	}
}

export function setChartSubIndex(chartSubIndex) {
	return {
		type: SET_CHART_SUB_INDEX,
		chartSubIndex: chartSubIndex,
	}
}

export function onMouseMove(e) {
	return {
		type: CHART_MOUSE_MOVE,
		event: e,
	}
}

export function onMouseDown(e) {
	return {
		type: CHART_MOUSE_DOWN,
		event: e,
	}
}

export function onMouseUp(e) {
	return {
		type: CHART_MOUSE_UP,
		event: e,
	}
}

export function onKeyUp(e) {
	return {
		type: CHART_KEY_UP,
		event: e,
	}
}
