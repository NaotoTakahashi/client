import {Map, List} from 'immutable';
import * as ReportActions from "../actions/ReportActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
export const NAME = 'REPORT';

//-----------------------------------------------------------------------------
//	Data
//-----------------------------------------------------------------------------
export const filterList = {
	0: {
		disply: "--- 全件表示（絞り込みなし）---",
		key: "",
		values: [""],
		valueExists: true,
	},
	1: {
		disply: "通知受信中：承認・確認待ち",
		key: "NoticeFlag",
		values: ["1"],
		valueExists: true,
	},
	2: {
		disply: "通知受信中：却下",
		key: "NoticeFlag",
		values: ["2"],
		valueExists: true,
	},
	3: {
		disply: "通知受信中：全件",
		key: "NoticeFlag",
		values: ["0"],
		valueExists: false,
	},
	4: {
		disply: "ステータス：進行中（承認待ち・承認済み・却下）",
		key: "Status",
		values: ["0", "8", "9"],
		valueExists: false,
	},
	5: {
		disply: "ステータス：却下",
		key: "Status",
		values: ["7"],
		valueExists: true,
	},
	6: {
		disply: "ステータス：終了",
		key: "Status",
		values: ["8", "9"],
		valueExists: true,
	},
	7: {
		disply: "優先度：高",
		key: "Priority",
		values: ["1"],
		valueExists: true,
	},
}
//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------
export class OperationData {
	constructor() {
		this.EntryNo = "";
		this.FormId = "";
		this.Operation = "";
		this.RuleNo = "";
		this.SignFlag = "";
		this.Url = "";
		this.UrlTarget = "";
	}
	setValue(name, val) {
		this[name] = val;
	}
	onUpdate(obj) {
		Object.keys(obj).map((key) => {
			if(this[key] !== undefined)	this.setValue(key, obj[key]);
		})
		return this;
	}
}
/*class OperationDataList {
	constructor() {
		this.OperationDataList = {};
	}
}*/

class DataObject {
	constructor() {
		this.value = "";
		this.className = "";
	}
}
export class NoticeData {
	constructor() {
		this.CreateCompanyCode = new DataObject();
		this.CreateCompanyName = new DataObject();
		this.CreateDate = new DataObject();
		this.CreateDeptCode = new DataObject();
		this.CreateDeptName = new DataObject();
		this.CreateEmployeeId = new DataObject();
		this.CreateEmployeeName = new DataObject();
		this.DeleteDate = new DataObject();
		this.DeleteFlag = new DataObject();
		this.EntryNo = new DataObject();
		this.ExpireDay = new DataObject();
		this.FormId = new DataObject();
		this.FormName = new DataObject();
		this.Message = new DataObject();
		this.NoticeDate = new DataObject();
		this.NoticeFlag = new DataObject();
		this.NoticeNumber = new DataObject();
		this.NoticeType = new DataObject();
		this.ReportId = new DataObject();
		this.RuleNo = new DataObject();
		this.Status = new DataObject();
		this.Priority = new DataObject();
		this.UketukeNumber = new DataObject();
		this.UpdateCompanyCode = new DataObject();
		this.UpdateCompanyName = new DataObject();
		this.UpdateDate = new DataObject();
		this.UpdateDeptCode = new DataObject();
		this.UpdateDeptName = new DataObject();
		this.UpdateEmployeeId = new DataObject();
		this.UpdateEmployeeName = new DataObject();
		this.UpdateNumber = new DataObject();
		this.Operation = List([]);

		this.CreateCompanyCode.className = "create_company_code";
		this.CreateCompanyName.className = "create_company_name";
		this.CreateDate.className = "create_date";
		this.CreateDeptCode.className = "create_dept_code";
		this.CreateDeptName.className = "create_dept_name";
		this.CreateEmployeeId.className = "create_employee_id";
		this.CreateEmployeeName.className = "create_employee_name";
		this.DeleteDate.className = "delete_date";
		this.DeleteFlag.className = "delete_flag";
		this.EntryNo.className = "entry_no";
		this.ExpireDay.className = "expire_day";
		this.FormId.className = "form_id";
		this.FormName.className = "form_name";
		this.Message.className = "message";
		this.NoticeDate.className = "notice_date";
		this.NoticeFlag.className = "notice_flag";
		this.NoticeNumber.className = "notice_number";
		this.NoticeType.className = "notice_type";
		this.ReportId.className = "report_id";
		this.RuleNo.className = "rule_no";
		this.Status.className = "status";
		this.Priority.className = "priority";
		this.UketukeNumber.className = "uketuke_number";
		this.UpdateCompanyCode.className = "update_company_code";
		this.UpdateCompanyName.className = "update_company_code";
		this.UpdateDate.className = "update_date";
		this.UpdateDeptCode.className = "update_company_code";
		this.UpdateDeptName.className = "update_company_code";
		this.UpdateEmployeeId.className = "update_employee_code";
		this.UpdateEmployeeName.className = "update_company_code";
		this.UpdateNumber.className = "update_number";
	}
	setValue(name, val) {
		this[name].value = val;
	}
	setOperation = (operation) => {
		let ret =  List([]);
		Object.keys(operation).map((key, index) => {
			ret = ret.set(index, new OperationData());
			ret = ret.set(index, ret.get(index).onUpdate(operation[key]));
		})
		return ret;
	}
	onUpdate = (obj) => {
		Object.keys(obj).map((key) => {
			if(this[key] !== undefined){
				if(key !== "Operation"){
					this.setValue(key, obj[key]);
				} else {
					this.Operation = this.setOperation(obj.Operation);
				}
			}
		})
		return this;
	}
}
const noticeDataList = Map({});

const updateNoticeList = (inData) => (dataList) => {
	let ret = dataList;
	if(!dataList.has(inData.ReportId)) {
		ret = ret.set(inData.ReportId, new NoticeData());
		//newNoticeData.NoticeDataList[data.ReportId] = new NoticeData();
	}
	let oldData = ret.get(inData.ReportId);
	if(inData.NoticeNumber >= oldData.NoticeNumber.value) {
		let newData = new NoticeData();
		ret = ret.set(inData.ReportId, newData.onUpdate(inData));
	}
	return ret;
}
/*
export class NoticeDataList {
	constructor(contentKey) {
		//this.contentKey= contentKey;
		this.NoticeDataList = {};
	}
	onUpdate(obj) {
		Object.keys(this.NoticeDataList).map((key, index) => {
			let data = this.NoticeDataList[obj.ReportId];
			if(key === obj.ReportId && data.NoticeNumber >= obj.NoticeNumber)
				data.onUpdate(obj);
		})
	}
}
*/
//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const initialState = Map({
	displayNoticeList: false,
	sort: Map({
		key: "",
		status: "",
	}),
	filter: 3,
	noticeList: noticeDataList,
	socket: 'socket-open',
})

const reportReducer = (state = initialState, action) => {
	switch (action.type) {
		case ReportActions.DISPLAY_NOTICE_LIST:
			return state.withMutations(s => {
				if(s.get('displayNoticeList')) {
					s.set('displayNoticeList', false);
				} else {
					s.set('displayNoticeList', true);
				}
			});
		case ReportActions.CLOSE_NOTICE_LIST:
			return state.withMutations(s => 
				s.set('displayNoticeList', false)
			);
		case ReportActions.CHANGE_FILTER:
			return state.withMutations(s =>
				s.set('filter', +action.val)
			);
		case ReportSVApiActions.WEB_SOCKET_CLOSED:
			return state.withMutations(s =>
				s.set('socket', "socket-close")
			);
		case ReportActions.UPDATE_NOTICE:
			if(action.obj.MsgType === "RPT_NOTICE") {
				//let newNoticeData = this.props.data;
				/*
				let newNoticeData = state.get('noticeList');
				Object.keys(action.obj.NOTICE).map((key, index) => {
					let data = action.obj.NOTICE[key];
					//let noticeData = new NoticeData();
					if(!state.hasIn(['noticeList', data.ReportId])) {
						newNoticeData.NoticeDataList[data.ReportId] = new NoticeData();
					} else {
						//noticeData = state.getIn([NAME, 'noticeList', data.ReportId]);
					} 
					//noticeData.onUpdate(data);
					newNoticeData.onUpdate(data);
				})
				*/
				let nextState = state.withMutations(s => {
					//s.set('noticeList', newNoticeData);
					Object.keys(action.obj.NOTICE).map((key, index) => {
						let data = action.obj.NOTICE[key];
						//let noticeData = new NoticeData();
						let notieList = s.get('noticeList');
						s.update('noticeList', updateNoticeList(data));
						/*
						if(!s.hasIn(['noticeList', data.ReportId])) {
							s.setIn(['noticeList', data.ReportId], new NoticeData());
							//newNoticeData.NoticeDataList[data.ReportId] = new NoticeData();
						}
						let oldData = s.getIn(['noticeList', data.ReportId]);
						if(data.NoticeNumber >= oldData.NoticeNumber.value) {
							s.updateIn(['noticeList', data.ReportId], updateNoticeData(data))
						}
						*/
						//newNoticeData.onUpdate(data);
					})
				});
				return nextState;
			}
			break;
		default:
			return state;
	}
}

export default reportReducer;