import {Map, Record} from 'immutable';
import * as ChartActions from "../actions/ChartActions";
import * as RCApiActions from "../actions/RCApiActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
import ChartLib from '../libs/chart/chartLib';

export const NAME = 'CHART';
const CHART_SETTING_IMG_SRC = "/report-images/chart/setting.png";
const CHART_DUSTBOX_IMG_SRC = "/report-images/chart/dustbox.png";

export class ChartLibWrap {
    constructor() {
		this.chartlib = new ChartLib();
		this.chartlib.setScrollbar(true);
		this.chartlib.setCrossLine(true);
		this.chartlib.setPeriodDaily();
		this.chartlib.setAdjustPrice(true);
		this.chartlib.setSettingImg(CHART_SETTING_IMG_SRC);
		this.chartlib.setDustboxImg(CHART_DUSTBOX_IMG_SRC);
	}
	getLib = () => { return this.chartlib; }
}
//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------
export const ChartShape = {
	CANDLE: "CANDLE",
	LINE: "LINE",
	POLLYLINE: "POLLYLINE",
	BAR: "BAR",
	BARFULL: "BARFULL",
	TBRK: "TBRK",
	TKAGI: "TKAGI",
	CWC: "CWC",
	BRK: "BRK",
	KAGI: "KAGI",
	PF: "PF",
}

export const ChartShapeName = {
	CANDLE: "ロウソク線",
	LINE: "ライン",
	POLLYLINE: "ライン(塗)",
	BAR: "バー(３本値)",
	BARFULL: "バー(4本値)",
	TBRK: "時系列新値足",
	TKAGI: "時系列カギ足",
	CWC: "逆ウォッチ曲線",
	BRK: "新値足",
	KAGI: "カギ足",
	PF: "ポイント＆フィギュア",
}

export const ChartPeriod = {
	MIN_1: "MIN_1",
	MIN_5: "MIN_5",
	MIN_10: "MIN_10",
	MIN_15: "MIN_15",
	MIN_30: "MIN_30",
	MIN_60: "MIN_60",
	DAY: "DAY",
	WEEK: "WEEK",
	MONTH: "MONTH",
	TICK: "TICK"
}

export const DispOptionName = {
	SCROLLBAR: "スクロールバー",
	INDEX_PANEL: "インデックス表示",
	CROSS_LINE: "クロスライン",
	REV_POINT: "転換点",
	PRICE_VOL: "価格帯別出来高",
	SCALE_RIGHT: "目盛表示(右)",
	SCALE_LEFT: "目盛表示(左)",
	ADJUST_PRICE: "株価修正あり",
	TICK_LIST: "ティックリスト",
}

export const TechToolName = {
	TREND_LINE: "トレンドライン",
	RETRACE: "リトレース(３本)",
	RETRACE5: "リトレース(５本)",
	COUNTER: "カウンター",
	PENTAGON: "ペンタゴン",
	FIBOFAN: "フィボナッチ ファン",
	FIBOARC: "フィボナッチ アーク",
	FIBOCIRCLE: "フィボナッチ サークル",
	FIBOTIME: "フィボナッチ タイムゾーン",
	FIBOCHANNEL: "フィボナッチ チャネル",
	GANFAN: "ギャンファン",
	GANANGLE: "ギャンアングル",
	GANBOX: "ギャンボックス",
	PITCH_FORK: "ピッチフォーク",
	PITCH_FORK_EX: "ピッチフォーク(+)",
	NO_SELECT: "選択なし",
}

export const TechTool = {
	TREND_LINE: "TREND_LINE",
	RETRACE: "RETRACE",
	RETRACE5: "RETRACE5",
	COUNTER: "COUNTER",
	PENTAGON: "PENTAGON",
	FIBOFAN: "FIBOFAN",
	FIBOARC: "FIBOARC",
	FIBOTIME: "FIBOTIME",
	FIBOCHANNEL: "FIBOCHANNEL",
	GANFAN: "GANFAN",
	GANANGLE: "GANANGLE",
	GANBOX: "GANBOX",
	PITCH_FORK: "PITCH_FORK",
	PITCH_FORK_EX: "PITCH_FORK_EX",
	NO_SELECT: "NO_SELECT",
}

export const TechMainName = {
	SMA: "単純移動平均",
	EMA: "指数平滑移動平均",
	WMA: "加重移動平均",
	SMMA: "多重(単純)移動平均",
	EMMA: "多重(指数)移動平均",
	HMA: "高安単純移動平均",
	BB: "ボリンジャーバンド",
	ICHI: "一目均衡表",
	ENV: "エンベロープ",
	PAR: "パラボリック",
	VS: "ボラティリティシステム",
	HLB: "HLバンド",
	PVT: "ピボット",
	LRT: "回帰トレンド",
	ICHI_T: "一目均衡表(時間論)",
	FNZ: "フィボナッチ(戻り・ザラ場)",
	FNC: "フィボナッチ(戻り・終値)",
	FNR: "フィボナッチ(基調転換)",
	VWAP: "VWAP(分足のみ)",
	hikaku_chart: "比較チャート",
}

export const TechSubName = {
	VOL: "出来高",
	PL: "ｻｲｺﾛｼﾞｶﾙﾗｲﾝ",
	MOM: "ﾓﾒﾝﾀﾑ",
	RSIA: "RSI(W)",
	RSIB: "RSI(C)",
	RCI: "RCI",
	STC: "ｽﾄｷｬｽﾃｨｸｽ",
	SSTC: "ｽﾛｰｽﾄｷｬｽﾃｨｸｽ",
	WR: "%R",
	DMA: "移動平均乖離率",
	DMI: "DMI",
	MACD: "MACD",
	HV: "ﾋｽﾄﾘｶﾙ ﾎﾞﾗﾃｨﾘﾃｨ",
	SDV: "標準偏差 ﾎﾞﾗﾃｨﾘﾃｨ",
	VRA: "ﾎﾞﾘｭｰﾑﾚｼｵ(A)",
	VRB: "ﾎﾞﾘｭｰﾑﾚｼｵ(B)",
	OBV: "ｵﾝﾊﾞﾗﾝｽﾎﾞﾘｭｰﾑ",
	UO: "ｱﾙﾃｨﾒｯﾄ ｵｼﾚｰﾀ",
	ATR: "ATR",
	ROC: "ROC",
	SWR: "強弱ﾚｼｵ",
	SD: "標準偏差",
	ARN: "ｱﾙｰﾝ ｲﾝｼﾞｹｰﾀ",
	ARO: "ｱﾙｰﾝ ｵｼﾚｰﾀ",
	CCI: "CCI",
	SNR: "ｿﾅｰ",
	DPO: "DPO",
	RTA: "ﾚｼｵｹｰﾀ",
	MGN: "信用残",
}

export const ChartPeriodName = {
	MIN_1: "1分足",
	MIN_5: "5分足",
	MIN_10: "10分足",
	MIN_15: "15分足",
	MIN_30: "30分足",
	MIN_60: "1時間",
	DAY: "日足",
	WEEK: "週足",
	MONTH: "月足",
	TICK: "ティック"
}

export const IndexName = {
	IDX_101: "日経平均",
	IDX_105: "JPX400",	
	IDX_151: "TOPIX",
	IDX_152: "2部指数",
	IDX_154: "マザーズ",
	IDX_155: "REIT指数",
	IDX_156: "指数大型",
	IDX_157: "指数中型",
	IDX_158: "指数小型",
	IDX_190: "JQ指数",
}

const dispOptionState = Record({
	SCROLLBAR: true,
	INDEX_PANEL: false,
	CROSS_LINE: true,
	REV_POINT: false,
	PRICE_VOL: false,
	SCALE_RIGHT: true,
	SCALE_LEFT: true,
	ADJUST_PRICE: true,
	TICK_LIST: false,
});

const techMainState = Record({
	SMA: false,
	EMA: false,
	WMA: false,
	SMMA: false,
	EMMA: false,
	HMA: false,
	BB: false,
	ICHI: false,
	ENV: false,
	PAR: false,
	VS: false,
	HLB: false,
	PVT: false,
	LRT: false,
	ICHI_T: false,
	FNZ: false,
	FNC: false,
	FNR: false,
	VWAP: false,
	hikaku_chart: false,
});

const techSubState = Record({
	VOL: false,
	PL: false,
	MOM: false,
	RSIA: false,
	RSIB: false,
	RCI: false,
	STC: false,
	SSTC: false,
	WR: false,
	DMA: false,
	DMI: false,
	MACD: false,
	HV: false,
	SDV: false,
	VRA: false,
	VRB: false,
	OBV: false,
	UO: false,
	ATR: false,
	ROC: false,
	SWR: false,
	SD: false,
	ARN: false,
	ARO: false,
	CCI: false,
	SNR: false,
	DPO: false,
	RTA: false,
	MGN: false,
});

const technicalState = Record({
	techMain: techMainState(),
	techSub: techSubState(),
	chartShape: ChartShape.CANDLE,
});

const chartConfigState = Record({
	technical: technicalState(),
	dispOption: dispOptionState(),
	techTool: TechTool.NO_SELECT,
	chartPeriod: ChartPeriod.DAY,
	subCode: "101",
})

const chartState = Record({
	config: chartConfigState(),
	lib: new ChartLibWrap(),
	data: null,
	issueCode: '',
	marketCode: '',
	issueName: '',
});

const initialState = chartState();
//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
export const getChartState = (state) => state[NAME];
export const getChartData = (state) => state[NAME].get('data');
export const getChartLib = (state) => state[NAME].get('lib').getLib();
export const getChartConfig = (state)=> state[NAME].get('config');
export const getChartTechnical = (state)=> state[NAME].getIn(['config', 'technical']);
export const getChartPeriod = (state)=> state[NAME].getIn(['config', 'chartPeriod']);
export const getChartDispOption = (state)=> state[NAME].getIn(['config', 'dispOption']);
export const getChartTechTool = (state)=> state[NAME].getIn(['config', 'techTool']);
export const getChartSubCode = (state)=> state[NAME].getIn(['config', 'subCode']);
export const getIssueCode = (state) => state[NAME].getIn(['issueCode']);
export const getMarketCode = (state) => state[NAME].getIn(['marketCode']);
export const getStateForSetting = (state) => { return saveSetting(state); }

//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const chartReducer = (state = initialState, action) => {
	switch (action.type) {
		case ChartActions.SEND_CHART_REGIST:
			return state;
		case ChartActions.UPDATE_CHART:
			return state;
		case ChartActions.CHANGE_ISSUE_MARKET:
			return changeIssueMarketReducer(state, action);
		case ChartActions.TECH_MAIN:
			return updateTechMain(state, action);
		case ChartActions.TECH_SUB:
			return updateTechSub(state, action);
		case ChartActions.DISP_OPTION:
			return updateDispOption(state, action);
		case ChartActions.SET_TECH_TOOL:
			return updateTechTool(state, action);
		case ChartActions.SET_CHART_SHAPE:
			return updateChartStyle(state, action);
		case ChartActions.SET_CHART_PERIOD:
			return updateChartPeriod(state, action);
		case ChartActions.SET_CHART_SUB_INDEX:
			return updateChartSubIndex(state, action);
		case ChartActions.CHANGE_ISSUE_MARKET:
			return refresh(state, action);
		case RCApiActions.REGIST_TICK_SUCCESS:
			return registSuccess(state, action);
		case RCApiActions.REGIST_TICK_ERROR:
			return registError(state, action);
		case RCApiActions.UPDATE_TICK:
			return updateTick(state, action);
		case ReportSVApiActions.LOGIN_SUCCESS:
			return loadSetting(state, action);
		default:
			return state;
	}
}

const refresh = (state, action) => {
	const chartlib = state.getIn(['lib']).getLib();
	chartlib.onPaint();
	return state;
}

const registSuccess = (state, action) => {
	const msg = action.msg;
	const chartlib = state.getIn(['lib']).getLib();
	chartlib.changeIssue(msg.issueCode, msg.name, msg.marketCode);
	chartlib.setOHLC(msg);
	action.issueCode = msg.issueCode;
	action.marketCode = msg.marketCode;
	action.issueName = msg.name;
	return changeIssueMarketReducer(state, action);
}

const registError = (state, action) => {
	const msg = action.msg;
	const chartlib = state.getIn(['lib']).getLib();
	chartlib.setIssueError(msg.issueCode);
	chartlib.onPaint();
	return state;
}

const updateTick = (state, action) => {
	const msg = action.msg;
	const chartlib = state.getIn(['lib']).getLib();
	chartlib.setTick(msg);
	chartlib.onPaint();
	return state;
}

const changeIssueMarketReducer = (state, action) => {
	if(state.getIn(['issueCode']) === action.issueCode
		&& state.getIn(['marketCode']) === action.marketCode) {
		return state;
	}
	return state.withMutations( s => {
		s.setIn(['issueCode'], action.issueCode)
		 .setIn(['marketCode'], action.marketCode)
		 .setIn(['issueName'], action.issueName)
	});
}

const updateChartStyle = (state, action) => {
	const chartlib = state.getIn(['lib']).getLib();
	const path = ['config', 'technical', 'chartShape'];
	setChartStyleToLib(chartlib, action.chartShape);
	return state.withMutations( s => {
		s.setIn(path, action.chartShape);
	});
}

const updateChartPeriod = (state, action) => {
	const chartlib = state.getIn(['lib']).getLib();
	const path = ['config', 'chartPeriod'];
	return state.withMutations( s => {
		s.setIn(path, action.chartPeriod);
	});
}

const updateDispOption = (state, action) => {
	const chartlib = state.getIn(['lib']).getLib();
	const path = ['config', 'dispOption', action.dispOption]
	const selectStat = !state.getIn(path);
	setDispOptionToLib(chartlib, action.dispOption, selectStat);
	return state.withMutations( s => {
		s.setIn(path, selectStat);
	});
}

const updateTechMain = (state, action) => {
	const chartlib = state.getIn(['lib']).getLib();
	const path = ['config', 'technical', 'techMain', action.techMain]
	const selectStat = !state.getIn(path);
	setTechMainToLib(chartlib, action.techMain, selectStat);
	return state.withMutations( s => {
		s.setIn(path, !(s.getIn(path)));
	});
}

const updateTechSub = (state, action) => {
	const chartlib = state.getIn(['lib']).getLib();
	const path = ['config', 'technical', 'techSub', action.techSub]
	const selectStat = !state.getIn(path);
	const ret = setTechSubToLib(chartlib, action.techSub, selectStat);
	if(ret){
		return state.withMutations( s => {
			s.setIn(path, !(s.getIn(path)));
		});
	}else{
		return state;
	}
}

const updateTechTool = (state, action) => {
	const chartlib = state.getIn(['lib']).getLib();
	const path = ['config', 'techTool'];
	setDispTechToolToLib(chartlib, action.techTool);
	return state.withMutations( s => {
		s.setIn(path, action.techTool);
	});
}

const updateChartSubIndex = (state, action) => {
	const chartlib = state.getIn(['lib']).getLib();
	const path = ['config', 'chartPeriod'];
	return state.withMutations( s => {
		s.setIn(path, action.chartPeriod);
	});
}

const saveSetting = (state) => {
	const chartConfig = getChartConfig(state);
	const periodState = getChartPeriod(state);
	const tecState = getChartTechnical(state);
	const dispOptionState = getChartDispOption(state);
	const techToolState = getChartTechTool(state);
	const issueCode = getIssueCode(state);
	const marketCode = getMarketCode(state);
	const chartLib = getChartLib(state);
	let chartSettingObj = {};
	chartLib.getChartSetting(chartSettingObj);
	return Map({
		charSettiing: Map({
			issueCode: issueCode,
			marketCode: marketCode,
			period: periodState,
			technical: tecState,
			dispOption: dispOptionState,
			techTool: techToolState,
			libSetting: chartSettingObj,
		}),
	})
}

const loadSetting = (state, action) => {
	if (!action.response.Setting) {
		return state;
	}
	const setting = action.response.Setting[NAME];
	if (!setting) {
		return state;
	}
	const chartlib = state.getIn(['lib']).getLib();
	const issueCode = setting.charSettiing.issueCode;
	const marketCode = setting.charSettiing.marketCode;
	const period = setting.charSettiing.period;
	const style = setting.charSettiing.technical.chartShape;
	const technical = setting.charSettiing.technical;
	const dispOption = setting.charSettiing.dispOption;
	const techTool = setting.charSettiing.techTool;
	const libSetting = setting.charSettiing.libSetting;

	// 銘柄コード、市場コード設定
	chartlib.changeIssue(issueCode, '', marketCode);
	// 期間設定
	setPeriodToLib(chartlib, period);
	// チャートスタイル
	setChartStyleToLib(chartlib, style);
	// テクニカルメイン設定
	const techMain = technical.techMain;
	for(const key of Object.keys(techMain)) {
		setTechMainToLib(chartlib, key, techMain[key]);
	}
	// テクニカルサブ設定
	const techSub = technical.techSub;
	for(const key of Object.keys(techSub)) {
		setTechSubToLib(chartlib, key, techSub[key]);
	}
	// 表示オプション
	for(const key of Object.keys(dispOption)) {
		setDispOptionToLib(chartlib, key, dispOption[key]);
	}
	// テクニカルツール
	setDispTechToolToLib(chartlib, techTool);
	// チャート内部設定
	if (libSetting) {
		chartlib.setChartSetting(libSetting);
	}

	return state.withMutations(s=>{
		s.setIn(['issueCode'], issueCode)
		 .setIn(['marketCode'], marketCode)
		 .setIn(['issueName'], "")
		 .setIn(['config', 'chartPeriod'], period)
		 .setIn(['config', 'technical', 'chartShape'], style)		 
		 .setIn(['config', 'technical', 'techMain'], techMainState(techMain))
		 .setIn(['config', 'technical', 'techSub'], techSubState(techSub))
		 .setIn(['config', 'dispOption'], dispOptionState(dispOption))
		 .setIn(['config', 'techTool'], techTool)
	});
}

export const setPeriodToLib = (chartlib, periodValue) => {
	switch(periodValue) {
		case 'MIN_1':
			chartlib.setPeriodMin(1);
			break;		
		case 'MIN_5':
			chartlib.setPeriodMin(5);
			break;
		case 'MIN_10':
			chartlib.setPeriodMin(10);
			break;
		case 'MIN_15':
			chartlib.setPeriodMin(15);
			break;
		case 'MIN_30':
			chartlib.setPeriodMin(30);
			break;
		case 'MIN_60':
			chartlib.setPeriodMin(60);
			break;
		case 'DAY':
			chartlib.setPeriodDaily();
			break;
		case 'WEEK':
			chartlib.setPeriodWeekly();
			break;
		case 'MONTH':
			chartlib.setPeriodMonthly();
			break;
		case 'TICK':
			chartlib.setPeriodTick();
			break;
	}
}

const setChartStyleToLib = (chartlib, style) => {
	switch(style) {
		case 'CANDLE':
			chartlib.setStyleCandle();
			break;		
		case 'LINE':
			chartlib.setStyleLine();
			break;
		case 'POLLYLINE':
			chartlib.setStylePollyLine();
			break;
		case 'BAR':
			chartlib.setStyleBar();
			break;
		case 'BARFULL':
			chartlib.setStyleBarFull();
			break;
		case 'TBRK':
			chartlib.setStyleTBRK();
			break;
		case 'TKAGI':
			chartlib.setStyleTKAGI();
			break;
		case 'BRK':
			chartlib.setStyleBRK();
			break;
		case 'KAGI':
			chartlib.setStyleKAGI();
			break;
		case 'PF':
			chartlib.setStylePF();
			break;
		case 'CWC':
			chartlib.setStyleCWC();
			break;
	}
}

const setTechMainToLib = (chartlib, techMain, selectStat) => {
	switch(techMain) {
		case 'SMA':
			chartlib.setSMA(selectStat);
			break;		
		case 'EMA':
			chartlib.setEMA(selectStat);
			break;
		case 'WMA':
			chartlib.setWMA(selectStat);
			break;
		case 'SMMA':
			chartlib.setSMMA(selectStat);
			break;
		case 'EMMA':
			chartlib.setEMMA(selectStat);
			break;
		case 'HMA':
			chartlib.setHMA(selectStat);
			break;
		case 'BB':
			chartlib.setBB(selectStat);
			break;
		case 'ICHI':
			chartlib.setICHIMOKU(selectStat);
			break;
		case 'ENV':
			chartlib.setENV(selectStat);
			break;
		case 'PAR':
			chartlib.setPAR(selectStat);
			break;
		case 'VS':
			chartlib.setVS(selectStat);
			break;
		case 'HLB':
			chartlib.setHLB(selectStat);
			break;
		case 'PVT':
			chartlib.setPVT(selectStat);
			break;
		case 'LRT':
			chartlib.setLRT(selectStat);
			break;
		case 'ICHI_T':
			chartlib.setIchimokuTIme(selectStat);
			break;
		case 'FNZ':
			chartlib.setFiboZaraba(selectStat);
			break;
		case 'FNC':
			chartlib.setFiboClose(selectStat);
			break;
		case 'FNR':
			chartlib.setFiboRev(selectStat);
			break;
		case 'VWAP':
			chartlib.setVWAP(selectStat);
			break;
	}
}

const setTechSubToLib = (chartlib, techSub, selectStat) => {
	switch(techSub) {
		case 'VOL':
			return chartlib.setVolume(selectStat);
		case 'PL':
			return chartlib.setPL(selectStat);
		case 'MOM':
			return chartlib.setMOM(selectStat);
		case 'RSIA':
			return chartlib.setRSIw(selectStat);
		case 'RSIB':
			return chartlib.setRSIc(selectStat);
		case 'RCI':
			return chartlib.setRCI(selectStat);
		case 'STC':
			return chartlib.setSTC(selectStat);
		case 'SSTC':
			return chartlib.setSSTC(selectStat);
		case 'WR':
			return chartlib.setWR(selectStat);
		case 'DMA':
			return chartlib.setDMA(selectStat);
		case 'DMI':
			return chartlib.setDMI(selectStat);
		case 'MACD':
			return chartlib.setMACD(selectStat);
		case 'VRA':
			return chartlib.setVRA(selectStat);
		case 'VRB':
			return chartlib.setVRB(selectStat);
		case 'OBV':
			return chartlib.setOBV(selectStat);
		case 'UO':
			return chartlib.setUO(selectStat);
		case 'ATR':
			return chartlib.setATR(selectStat);
		case 'ROC':
			return chartlib.setROC(selectStat);
		case 'SWR':
			return chartlib.setSWR(selectStat);
		case 'ARN':
			return chartlib.setARN(selectStat);
		case 'ARO':
			return chartlib.setARO(selectStat);
		case 'CCI':
			return chartlib.setCCI(selectStat);
		case 'SNR':
			return chartlib.setSNR(selectStat);
		case 'DPO':
			return chartlib.setDPO(selectStat);
		case 'SD':
			return chartlib.setSD(selectStat);
		case 'SDV':
			return chartlib.setSDV(selectStat);
		case 'HV':
			return chartlib.setHV(selectStat);
		case 'RTA':
			return chartlib.setRTA(selectStat);
		case 'MGN':
			return chartlib.setMGN(selectStat);	
	}
}

const setDispOptionToLib = (chartlib, dispOptKey, selectStat) => {
	switch(dispOptKey) {
		case 'CROSS_LINE':
			chartlib.setCrossLine(selectStat);
			break;		
		case 'REV_POINT':
			chartlib.setRevPoint(selectStat);
			break;
		case 'PRICE_VOL':
			chartlib.setPriceVol(selectStat);
			break;
		case 'SCROLLBAR':
			chartlib.setScrollbar(selectStat);
			break;
		case 'INDEX_PANEL':
			chartlib.setIndexPanel(selectStat);
			break;
		case 'SCALE_RIGHT':
			chartlib.setScaleRight(selectStat);
			break;
		case 'SCALE_LEFT':
			chartlib.setScaleLeft(selectStat);
			break;
		case 'ADJUST_PRICE':
			chartlib.setAdjustPrice(selectStat);
			break;
		case 'TICK_LIST':
			chartlib.setTickList(selectStat);
			break;
	}
}

const setDispTechToolToLib = (chartlib, techTool) => {
	switch(techTool) {
		case 'NO_SELECT':
			chartlib.setTechToolOff();
			break;		
		case 'TREND_LINE':
			chartlib.setTrendLine();
			break;		
		case 'RETRACE':
			chartlib.setRetracement();
			break;
		case 'RETRACE5':
			chartlib.setRetracement5();
			break;
		case 'COUNTER':
			chartlib.setDayCounter();
			break;
		case 'PENTAGON':
			chartlib.setPentagon();
			break;
		case 'FIBOFAN':
			chartlib.setFiboFan();
			break;
		case 'FIBOARC':
			chartlib.setFiboArc();
			break;
		case 'FIBOCIRCLE':
			chartlib.setFiboCircle();
			break;
		case 'FIBOCHANNEL':
			chartlib.setFiboChannel();
			break;
		case 'FIBOTIME':
			chartlib.setFiboTime();
			break;
		case 'GANFAN':
			chartlib.setGanFan();
			break;
		case 'GANANGLE':
			chartlib.setGanAngle();
			break;
		case 'GANBOX':
			chartlib.setGanBox();
			break;
		case 'PITCH_FORK':
			chartlib.setPitchFork(false);
			break;
		case 'PITCH_FORK_EX':
			chartlib.setPitchFork(true);
			break;
	}
}

export default chartReducer;