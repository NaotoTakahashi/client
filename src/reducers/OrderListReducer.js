import {Record, List, Map} from 'immutable';
import {createSelector} from "reselect";
import * as OrderListActions from "../actions/OrderListActions";
import * as RCApiActions from "../actions/RCApiActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
export const NAME = 'OrderList';

//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
const getCols = (state) => {
	return state.OrderList.getCols();
}
/*const getDataList = (state) => {
 	return state.OrderList.getDataList();
}*/
const getDataMap = (state) => {
	return state.OrderList.getDataMap();
}
const getSortCondition = (state) => {
	return state.OrderList.getSortCondition();
}
const sortDataList = (sortCondition, dataMap) => {
	const {sorted, key, asc} = sortCondition.toJS();
	const dataList = dataMap.toList();
	return sorted ? dataList.sort((a, b) => {
		if(a[key] < b[key]) {return asc ? -1 : 1;}
		if(a[key] > b[key]) {return asc ? 1 : -1;}
		if(a[key] === b[key]) {return 0;}
	}) : dataList;
}
export const getSortedDataList = createSelector(
	getSortCondition,
	//getDataList,
	getDataMap,
 	sortDataList
);

//-----------------------------------------------------------------------------
//	Data
//-----------------------------------------------------------------------------
export const SloType = {
	"0": "通常",
	"1": "逆指値",
	"2": "通常+逆指値",
}
export const OdrCond = {
	"0": "",	// 指定なし
	"2": "寄付",
	"4": "引け",
	"6": "不成",
}
export const OdrSideMgnType = {
	"3,0": "現物買付",
	"1,0": "現物売付",
	"3,2": "買新規",	// 制度信用
	"3,6": "買新規",	// 一般信用
	"1,2": "売新規",	// 制度信用
	"3,4": "買返済",	// 制度信用
	"1,4": "売返済",	// 制度信用
	"1,8": "売返済",	// 一般信用
	"5,0": "現渡",
	"7,0": "現受",
}
export const Bensai = {
	"00": "",
	"26": "制度信用６ヶ月",
	"29": "制度信用無期",
	"36": "制度信用６ヶ月",
	"39": "一般信用無期",
}
export const MarketCode = {
	"00": "東証",
	"01": "OSE",
	"02": "名証",
	"05": "福証",
	"07": "札証",
	"08": "端株",
	"09": "場外",
}
export const CapitalgainsTax = {
	"1": "特定",
	"3": "一般",
	"5": "NISA",
	"7": "非課税",
	"9": "法人",
}
export const DispStat = {
	"0": "受付未済",
	"1": "受付済み",
	"2": "受付エラー",
	"3": "訂正中",
	"4": "訂正完了",
	"5": "訂正失敗",
	"6": "取消中",
	"7": "取消完了",
	"8": "取消失敗",
	"9": "一部約定",
	"10": "全部約定",
	"11": "一部失効",
	"12": "全部失効",
	"13": "発注待ち",
	"14": "無効",
	"15": "トリガー発注",
	"16": "トリガー訂正完了",
	"17": "トリガー訂正失敗",
	"18": "",
	"19": "繰越失効",
}
export const filterSelect = {
	"sloType":{
		0: {title: "", key: "", values: [""], valueExists: true, },
		1: {title: "通常", key: "sloType", values: [/*"0"*/"通常"], valueExists: true, },
		2: {title: "逆指値", key: "sloType", values: [/*"1"*/"逆指値"], valueExists: true, },
		3: {title: "通常+逆指値", key: "sloType", values: [/*"2"*/"通常+逆指値"], valueExists: true, },
	},
	"dispStat":{
		0: {title: "", key: "", values: [""], valueExists: true, },
		1: {title: "未約定+一部約定", key: "execStat", values: ["0","1"], valueExists: true, },
		2: {title: "未約定", key: "execStat", values: ["0"], valueExists: true, },
		3: {title: "全部約定", key: "execStat", values: ["2"], valueExists: true, },
		//4: {title: "訂正取消", key: "modStat", values: ["", "0"], valueExists: false, },	// 訂正取消された注文
		4: {title: "訂正取消", key: "curQty", values: [], valueExists: true, },		// 訂正取消できる注文
		//5: {title: "失効", key: "odrStat", values: ["3", "4", "5"], valueExists: true, },
	},
	"replyCheck":{
		0: {title: "", key: "", values: [""], valueExists: true, },
		1: {title: "チェックあり", key: "replyCheck", values: ["1"], valueExists: true, },
		2: {title: "チェックなし", key: "replyCheck", values: ["0"], valueExists: true, },
	},
}
/*export const SloTypeList = List([
	{title: "", key: "", values: [""], valueExists: true, },
	{title: "通常", key: "sloType", values: ["0"], valueExists: true, },
	{title: "逆指値", key: "sloType", values: ["1"], valueExists: true, },
	{title: "通常+逆指値", key: "sloType", values: ["2"], valueExists: true, },
])
export const OdrStatList = List([
	{title: "", key: "", values: [""], valueExists: true, },
	{title: "発注待ち", key: "odrStat", values: ["1"], valueExists: true, },
	{title: "未約定", key: "execStat", values: ["0"], valueExists: true, },
	{title: "一部約定", key: "execStat", values: ["1"], valueExists: true, },
	{title: "全部約定", key: "execStat", values: ["2"], valueExists: true, },
	{title: "訂正取消", key: "modStat", values: ["", "0"], valueExists: false, },
	{title: "失効", key: "odrStat", values: ["3", "4", "5"], valueExists: true, },
])
export const ReplyCheckList = List([
	{title: "", key: "", values: [""], valueExists: true, },
	{title: "チェックあり", key: "replyCheck", values: ["1"], valueExists: true, },
	{title: "チェックなし", key: "replyCheck", values: ["0"], valueExists: true, },
])*/
export const iniCols = [
	{ key: "torihiki", name: "取引", sortable: false, },
	{ key: "execCount", name: "明細", sortable: false, },
	{ key: "sloType", name: "発注条件", sortable: false, },
	{ key: "odrCond", name: "執行条件", sortable: true, },
	[{ key: "odrSide", name: "取引", sortable: true, },
	{ key: "bensai", name: "弁済", sortable: true, }],
	[{ key: "odrNumber", name: "注文番号", sortable: true, },
	{ key: "oyaKey", name: "代表番号", sortable: true, }],
	[{ key: "registNumer", name: "顧客コード", sortable: false, },
	{ key: "kokyakuName", name: "顧客名", sortable: false, }],
	[{ key: "marketCode",name: "市場",sortable: true,},
	{ key: "capitalgainsTax", name: "口座", sortable: true, }],
	[{ key: "issueCode",name: "コード",sortable: true,},
	{ key: "issueName",name: "銘柄名",sortable: true,}],
	[{ key: "odrQty", name: "元注文株数", sortable: false, },
	{ key: "notOdrQty", name: "未発注株数", sortable: false, }],
	[{ key: "odrQty2", name: "注文済株数", sortable: false, },
	{ key: "curQty"/*"notExecQty"*/, name: "未約定株数", sortable: false, }],
	{ key: "curOdrPrice", name: "注文単価", sortable: false, },
	{ key: "execQty", name: "約定株数", sortable: false, },
	{ key: "execPrice", name: "約定単価", sortable: false, },
	{ key: "odrProceeds", name: "概算代金", sortable: false, },
	{ key: "dispStat", name: "状態", sortable: false, },
	{ key: "odrExpDay", name: "期限", sortable: false, },
	[{ key: "odrDate", name: "発注日時", sortable: true, },
	{ key: "execDate", name: "約定時間", sortable: true, }],
	[{ key: "replyCheck", name: "返信チェック", sortable: false, },
	{ key: "replyDate", name: "時間", sortable: false, }],
	//{ key: "salesCode", name: "扱者", sortable: false, },
]
export const iniExecCols = [
	{ key: "curOdrPrice", execKey: "", unit: "明細", },
	{ key: "execQty", execKey: "detailQty", unit: "株"},
	{ key: "execPrice", execKey: "detailPrice", unit: "円"},
	{ key: "odrDate", execKey: "detailDate", },
]
//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------
const iniSortCondition = {
	sorted: true,
	key: "odrNumber",
	asc: false,
}
const iniFilters = {
/*	0:{ key: "registNumer", name: "顧客コード", type: "text", max: "12", data: "", },
	1:{ key: "issueCode",name: "銘柄コード", type: "text", max: "5", data: "", },
	2:{ key: "sloType", name: "発注条件", type: "select", data: "", },
	3:{ key: "odrStatList", name: "発注状態", type: "select", data: "", },
	4:{ key: "replyCheckList", name: "返信状況", type: "select", data: "", },*/
	"registNumer": Map({ name: "顧客コード", type: "input", max: "12", data: "", }),
	"issueCode": Map({ name: "銘柄コード", type: "input", max: "5", data: "", }),
	"sloType": Map({ name: "発注条件", type: "select", data: "0", }),
	"dispStat": Map({ name: "発注状態", type: "select", data: "0", }),
	"replyCheck": Map({ name: "返信状況", type: "select", data: "0", }),
}

const BaseRecord = Record({
	filters: Map(iniFilters),
	cols: List(iniCols),
	sortCondition: Map(iniSortCondition),
	//dataList: List(),
	execList: List(),
	dataMap: Map(),
	openDetailMap: Map(),
	preOrderList: List(),
	preExecList: List(),
	isReady: false,
})

export class OrderListRecord extends BaseRecord {
	getFilters() {
		return this.get("filters");
	}
	getCols() {
		return this.get("cols");
	}
	/*getDataList() {
		return this.get("dataList");
	}*/
	getExecList() {
		return this.get("execList");
	}
	getSortCondition() {
		return this.get("sortCondition");
	}
	getDataMap() {
		return this.get("dataMap");
	}
	getOpenDetailMap() {
		return this.get("openDetailMap");
	}
	getSortedDataList() {
		return createSelector(
			this.getSortCondition,
			//this.getDataList,
			this.getDataMap,
			this.sortDataList
		);
	}
	initData(action) {
		const msgOrderEntry = action.response.orderList;
		const msgExecEntry = action.response.execList;
		if(msgOrderEntry === undefined){
			return this;
		}
		//let dataList = this.get('dataList');
		let execList = this.get('execList');
		let dataMap = this.get('dataMap');
		let openDetailMap = this.get('openDetailMap');
		for (let i = 0; i < msgOrderEntry.length; i++) {
			this.updateMsg(msgOrderEntry[i]);
			const entryKey = msgOrderEntry[i].bizDate + '_' + msgOrderEntry[i].odrNumber;
			//dataList = dataList.push(msgOrderEntry[i]);
			dataMap = dataMap.set(entryKey, msgOrderEntry[i]);
			openDetailMap = openDetailMap.set(entryKey, false);
		}
		for (let i = 0; i < msgExecEntry.length; i++) {
			execList = execList.push(msgExecEntry[i]);
		}
		const preOrderList = this.get('preOrderList');
		for (let i = 0; i < preOrderList.size; i++) {
			const msg = preOrderList.get(i);
			this.updateMsg(msg);
			const entryKey = msg.bizDate + '_' + msg.odrNumber;
			if (!dataMap.has(entryKey)) {
				//dataList = dataList.push(msg);
				dataMap = dataMap.set(entryKey, msg);
			}else{
				const entry = dataMap.get(entryKey);
				if(entry.updateNumber < msg.updateNumber){
					Object.assign(entry, msg);
					dataMap = dataMap.set(entryKey, entry);
				}
			}
		}
		const preExecList = this.get('preExecList');
		for (let i = 0; i < preExecList.size; i++) {
			const msg = preExecList.get(i);
			execList = execList.push(msg);
		}
		preOrderList.clear();
		preExecList.clear();
		return this.withMutations(s => 
			s.set('isReady', true)
			.set('preOrderList', preOrderList)
			.set('preExecList', preExecList)
			//.set('dataList', dataList)
			.set('execList', execList)
			.setIn(['dataMap'], dataMap)
			.setIn(['openDetailMap'], openDetailMap)
		);
	}
	updateSummary(action) {
		const now = new Date().getTime();
		if(!this.get('isReady')){
			this.get('preOrderList').push(action.msg);
			return;
		}
		//let dataList = this.get('dataList');
		let dataMap = this.get('dataMap');
		let openDetailMap = this.get('openDetailMap');
		const msg = action.msg;
		this.updateMsg(msg);
		const entryKey = msg.bizDate + '_' + msg.odrNumber;
		if (!dataMap.has(entryKey)) {
			//dataList = dataList.push(msg);
			dataMap = dataMap.set(entryKey, msg);
			openDetailMap = openDetailMap.set(entryKey, false);
		}else{
			const entry = dataMap.get(entryKey);
			if(entry.updateNumber < msg.updateNumber){
				Object.assign(entry, msg);
				dataMap = dataMap.set(entryKey, entry).set('updateTime', now);
			}
		}
		return this.withMutations(s => 
			s//.set('dataList', dataList)
			 .setIn(['dataMap'], dataMap)
			 .setIn(['openDetailMap'], openDetailMap)
		);
	}
	updateYakuzyou(action) {
		if(!this.get('isReady')){
			this.get('preExecList').push(action.msg);
			return;
		}
		let execList = this.get('execList');
		execList = execList.push(action.msg);
		return this.withMutations(s => 
			s.set('execList', execList)
		);
	}
	updateSort(action) {
		return this.withMutations(s=>{
			s.setIn(["sortCondition", "sorted"], action.sorted)
			.setIn(["sortCondition", "key"], action.key)
			.setIn(["sortCondition", "asc"], action.asc)
		});
	}
	updateFilter(action) {
		let filter = this.get("filters");
		let entry = filter.get(action.key);
		//entry.data = action.data;
		entry = entry.set("data", action.data);
		filter = filter.set(action.key, entry);
		return this.withMutations(s=>{
			s.set("filters", filter)
		});
	}
	showDetail(action) {
		let openDetailMap = this.get("openDetailMap");
		let entry = openDetailMap.get(action.key);
		openDetailMap = openDetailMap.set(action.key, !entry);
		return this.withMutations(s=>{
			s.setIn(['openDetailMap'], openDetailMap)
		});
	}
	updateList(dataList, execList, dataMap, msg) {
		this.updateMsg(msg);
		const entryKey = [msg.bizDate, msg.odrNumber];
		const now = new Date().getTime();
		if (!dataMap.has(entryKey)) {
			//dataList = dataList.push(msg);
			execList = execList.push(msg);
			dataMap = dataMap.set(entryKey, msg);
		}else{
			if(dataMap[entryKey].updateNumber < msg.updateNumber){
				dataMap = dataMap.set(entryKey, msg);
			}
		}
	}
	updateMsg(msg) {
		msg.odrSide = OdrSideMgnType[msg.odrSide + ","+ msg.mgnType]; //(msg.odrSide === "1")? "売" : (msg.odrSide === "3")? "買" : msg.odrSide;
		msg.bensai = Bensai[msg.bensai];
		msg.sloType = SloType[msg.sloType];
		msg.odrCond = OdrCond[msg.odrCond];
		msg.dispStat = DispStat[msg.dispStat];
	}
}

//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const orderListReducer = (state = new OrderListRecord(), action) => {
	switch (action.type) {
		case OrderListActions.SORT_LIST:
			return state.updateSort(action)
		case OrderListActions.SET_FILTER:
			return state.updateFilter(action)
		case OrderListActions.SHOW_DETAIL:
			return state.showDetail(action)
		case RCApiActions.KABU_SUMMARY:
			return state.updateSummary(action);
		case RCApiActions.KABU_YAKUZYOU_SIKKOU:
			return state.updateYakuzyou(action);
		case ReportSVApiActions.KABU_ORDER_LIST_SUCCESS:
			return state.initData(action);
		case ReportSVApiActions.KABU_ORDER_LIST_ERROR:
			return state;
		default:
			return state;
	}
}

export default orderListReducer;