import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import PropTypes from 'prop-types';
import './Report.css';
import {getCookie} from '../Utility';
import {filterList} from '../reducers/ReportReducer';
import {APSVUrl} from '../Conf';

//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
var Button = ReactBootstrap.Button;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Tooltip = ReactBootstrap.Tooltip;

//-----------------------------------------------------------------------------
//	Component(Presentational)
//-----------------------------------------------------------------------------
class ReportRow extends React.Component {
	render() {
		let data = this.props.data;
		let index = this.props.index;
		let expireDay = ReportRow.decisiontExpireDay(data.ExpireDay.value);
		let status = ReportRow.decisiontStatus(data.Status.value);
		let operation = this.decisiontOperation(data.NoticeFlag.value, data.Operation);
		let rowspan = "1";
		if (data.Message.value !== "") rowspan = "2";
		return(
			<tbody>
				<tr className={"row" + index % 2}>
					<td className={data.NoticeNumber.className} rowSpan={rowspan}>{data.NoticeNumber.value}</td>
					<td className={data.NoticeDate.className} rowSpan={rowspan}>{ReportRow.formatDate(data.NoticeDate.value)}</td>
					<td className={data.FormName.className} rowSpan={rowspan}>{data.FormName.value}</td>
					<td className={data.ReportId.className} rowSpan={rowspan}>{data.ReportId.value}</td>
					<td className={data.CreateDeptName.className} rowSpan={rowspan}>{data.CreateDeptName.value}</td>
					<td className={data.CreateEmployeeName.className} rowSpan={rowspan}>{data.CreateEmployeeName.value}</td>
					<td className={data.CreateDate.className} rowSpan={rowspan}>{ReportRow.formatDate(data.CreateDate.value)}</td>
					<td className={data.UpdateDeptName.className}>{data.UpdateDeptName.value}</td>
					<td className={data.UpdateEmployeeName.className}>{data.UpdateEmployeeName.value}</td>
					<td className={data.UpdateDate.className}>{ReportRow.formatDate(data.UpdateDate.value)}</td>
					<td className={data.ExpireDay.className + " " + expireDay.style}>{expireDay.view}</td>
					<td className={data.Status.className}>{status.view}</td>
					<td><Button onClick={() => this.requestReport("/reportPdf/get", 2, data)}>表示</Button></td>
					<td><Button onClick={() => this.requestReport(operation.url, operation.popType, data)} className={operation.style}>{operation.button}</Button></td>
				</tr>
				{ (() => {if (rowspan === "2"){
					return (
						<tr key={this.props.dataKey} className={"row" + index % 2}>
							<td colSpan="7" className="message"><i className="fa fa-comment"></i> {data.Message.value}</td>
						</tr>
					);
				}})()}
			</tbody>
		)
	}
	requestReport(url, popType, noticeData) {
		let form = document.createElement("form");
		document.body.appendChild(form);
		form.style = "display: none";
		let data = {'ReportId':noticeData.ReportId.value
			, 'FormId':noticeData.FormId.value
			, 'ApiKey':getCookie('ApiKey')
			, 'NoticeNumber':noticeData.NoticeNumber.value };
		for (var paramName in data) {
			let input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			input.setAttribute('name', paramName);
			input.setAttribute('value', data[paramName]);
			form.appendChild(input);
		}
		form.setAttribute("action", APSVUrl + "/report" + url);
		form.setAttribute("method", "post");
		if (popType === 2) {
			window.open("", "request", "width=970, height=760, scrollbars=yes, resizable=yes");
			form.target = "request";
			form.submit();
			return true;
		} else {
			return this.props.onReportUpdateRequest(form);
			/*
			let formData = new FormData(form);
			let xhr = new XMLHttpRequest();
			xhr.open(form.method, form.action, false);
			xhr.send(formData);
			let contentType = xhr.getResponseHeader("Content-Type");
			if (contentType.match(/json/)) {
				let response = JSON.parse(xhr.responseText);
				if (popType === 1) {
					this.props.onOpenApprovePage(response);
				} else {
					if (response.Status !== "0") {
						return false;
					} else {
						return true;
					}
				}
			}
			*/
		}
	}
	handleSetFilter(key, noticeData) {
		this.props.handleSetFilter(key, noticeData);
	}
	decisiontOperation(flag, obj) { //Operationの持ち方変更に合わせる
		let ope = 100;
		obj.forEach(data => {
			if (Number(data.Operation) < ope) {
				ope = data.Operation;
			}
		})
		let bStyle = "disable";
		if (flag === "1" || flag === "2") {
			if (ope === 4) {
				// 承認
				bStyle = "accent";
			} else if (ope === 6) {
				// 確認(画面なし)
				bStyle = "";
			} else {
				// 承認以外
				bStyle = "normal";
			}
		}
		if (ope === "1") {
			return {url: "/user/approve", button: "確認", popType: 1, style: bStyle};
		} else if (ope === "2") {
			return {url: "/user/approve", button: "訂正", popType: 1, style: bStyle};
		} else if (ope === "3") {
			return {url: "/user/approve", button: "取消", popType: 1, style: bStyle};
		} else if (ope === "4") {
			return {url: "/user/approve", button: "承認", popType: 1, style: bStyle};
		} else if (ope === "5") {
			return {url: "/user/approve", button: "却下", popType: 1, style: bStyle};
		} else if (ope === "6") {
			return {url: "/confirm", button: "確認", popType: 0, style: bStyle};
		} else {
			return {url: "", button: "---", popType: 0, style: "disable"};
		}
	}
	static decisiontExpireDay(val) {
		if (val === 0) {
			return {view: "なし", style: ""};
		} else {
			return {view: ReportRow.formatDate(val), style: ""};
		}
//		if(val=girigiri) {
//			return { view: "終了", style: "accent"};
//		}
	}
	static decisiontStatus(val) {
		if (val === "0") {
			return {view: "削除済み"};
		} else if (val === "1") {
			return {view: "承認待ち"};
		} else if (val === "2") {
			return {view: "承認済み"};
		} else if (val === "7") {
			return {view: "却下"};
		} else if (val === "8") {
			return {view: "取消"};
		} else if (val === "9") {
			return {view: "終了"};
		} else {
			return {view: ""};
		}
	}
	static formatDate(val) {
		if (val === 0)	return ("");
		let date = val.slice(0, 4) + "/" + val.slice(4, 6) +  "/" + val.slice(6, 8);
		if (val.length > 8){
			date += " " + val.slice(8, 10) + ":" + val.slice(10, 12) + ":" + val.slice(12, 14);
		}
		return (date);
	}
}

class NoticeFilter extends React.Component {
	render() {
		let filterOptions = Object.keys(filterList).map((key, index) => {
			return <option value={key} key={key} className={"filter-"+filterList[key].key}>{filterList[key].disply}</option>;
		})
		/*if (this.props.socket === "0"){
			let errorDisp = document.getElementsByClassName("socket-error");
			for(let i=0; i < errorDisp.length; i++){
				errorDisp[i].style.display = "inline-block";
			}
		}*/
		return(
			<div className="notice-table-header">
				<span className="fa fa-search search-icon" aria-hidden="true"></span>
				{/* <select type="text" className={"filter-key"} value={this.props.noticeState.filter.key} onChange={(e) => this.handleChangeFilter(e, "key")}>
					<option value="NoticeFlag">通知種別</option>
				</select>  */}
				<select type="text" className="filter-status" value={this.props.filter} onChange={(e) => this.props.onChangeFilter(e)}>
					{filterOptions}
				</select>
				<div className={"socket-error "+this.props.socket}><i className="fa fa-comment"></i> Web Socket 回線が切断しました</div>
			</div>
		)
	}
}

class NoticeList extends React.Component {
	render() {
		let dispClass = "";
		let noticeDataList = this.props.noticeList;
		if (this.props.displayNoticeList === true) {
			dispClass = "onDisplay";
		}
		if (Object.keys(noticeDataList).length !== 0 && filterList[this.props.filter].key !== "") {
			noticeDataList = this.setFilter(this.props.filter, noticeDataList);
		}
		return(
			<div className={"notice-list "+ dispClass}>
				<NoticeFilter
					{...this.props}
				/>
				<table className='notice-table' id={this.props.id} >
					<thead>
						<tr>
							<td>通知番号</td>
							<td>通知日時</td>
							<td>フォーム名</td>
							<td>レポートID</td>
							<td>起票部署</td>
							<td>起票者名</td>
							<td>起票日時</td>
							<td>更新部署</td>
							<td>更新者名</td>
							<td>更新日時</td>
							<td>有効期限</td>
							<td>ステータス</td>
							<td>PDF</td>
							<td>業務</td>
						</tr>
					</thead>
					{Object.keys(noticeDataList).map((key, index) => {
						let data = noticeDataList[key];
						return (
							<ReportRow
								data={data}
								dataKey={key}
								index={index}
								//onOpenApprovePage={this.props.onOpenApprovePage}
								onReportUpdateRequest={this.props.onReportUpdateRequest}
								key={key}
							/>
						)
					})}
				</table>
			</div>
		)
	}
	setFilter(filter, noticeDataList) {
		// var filterNoticeDataList = noticeDataList.filter((item) => (
		// ));
		let filterNoticeDataList = {};
		let filerKey = filterList[filter].key;
		let filerValues = filterList[filter].values;
		let filerValueExists = filterList[filter].valueExists;
		Object.keys(noticeDataList).map((key) => {
			for (let elementName in noticeDataList[key]) {
				if (elementName === filerKey) {
					let hasValue = false;
					filerValues.forEach((val) => {
						if (noticeDataList[key][elementName].value === val) hasValue = true;
					});
					if (filerValueExists === hasValue) {
						filterNoticeDataList[key] = noticeDataList[key];
					}
				}
			}
		})
		return filterNoticeDataList;
	}
}
NoticeList.propTypes = {
	//data: PropTypes.instanceOf(NoticeDataList).isRequired
	displayNoticeList: PropTypes.bool.isRequired,
	sort: PropTypes.object.isRequired,
	filter: PropTypes.number.isRequired,
	noticeList: PropTypes.object.isRequired,
	socket: PropTypes.string.isRequired,
	onChangeFilter: PropTypes.func.isRequired,
	//onOpenApprovePage: PropTypes.func.isRequired,
	onReportUpdateRequest: PropTypes.func.isRequired,
};

export default class NoticeButton extends React.Component {
	render() {
		//let noticeState = this.props.noticeState;
		let badge = [0, 0, 0];	// 表示レポート件数、却下件数、重要件数のバッジ表示カウント
		let buttonAct = "";
		let noticeList = this.props.noticeList;
		if (this.props.displayNoticeList === true) buttonAct = "active";
		if (Object.keys(noticeList).length !== 0 && this.props.login.status === "0"){
			Object.keys(noticeList).map((key) => {
				if (noticeList[key].NoticeFlag.value === "1"){
					badge[0]++;
				} else if (noticeList[key].NoticeFlag.value === "2"){
					badge[1]++;
				}
				if (noticeList[key].Priority.value === "1"){
					badge[2]++;
				}
			})
		}
		for (let i = 0; i < badge.length; i++) {
			if (badge[i] === 0) badge[i] = "";
		}
		return (
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="reportListTooltip">Report List</Tooltip>}>
				<Button onClick={this.props.onDisplayNoticeList} className={buttonAct}>
					<span id="innerButton" className={buttonAct}><span></span><span></span><span></span></span>
					<span className="badge">{badge[0]}</span>
					<span className="badge reject">{badge[1]}</span>
					<span className="badge priority">{badge[2]}</span>
					<span className={"socket-error fa fa-minus-circle " + this.props.socket}></span>
				</Button>
			</OverlayTrigger>
		)
	}
	componentDidUpdate(prevProps, prevState) {
		let prevStatus = prevProps.login.status;
		let newStatus = this.props.login.status;
		if(prevStatus !== "0" && newStatus === "0") {
			//this.setSocket();
		}
	}
}
NoticeButton.propTypes = {
	//data: PropTypes.instanceOf(NoticeDataList).isRequired,
	//noticeState: NoticeStatePropTypes.isRequired,
	displayNoticeList: PropTypes.bool.isRequired,
	sort: PropTypes.object.isRequired,
	noticeList: PropTypes.object.isRequired,
	socket: PropTypes.string.isRequired,
	onDisplayNoticeList: PropTypes.func.isRequired,
	login: PropTypes.object.isRequired,
};

export {NoticeButton, NoticeList};