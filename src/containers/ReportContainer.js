import React from 'react';
import { connect } from 'react-redux';
import {NAME as MODULE_NAME_REPORT} from '../reducers/ReportReducer';
import {NAME as MODULE_NAME_LOGIN} from '../reducers/LoginReducer';
import {displayNoticeList, changeFilter, reportUpdateRequest} from '../actions/ReportActions';
import {NoticeButton, NoticeList} from '../components/ReportComponent';
//-----------------------------------------------------------------------------
//	ReportContainer(NoticeButton)
//-----------------------------------------------------------------------------
class ReportContainer extends React.Component {
	render() {
		return (
			<NoticeButton 
				{...this.props.report.toJS()}
				{...this.props.dispatch}
				login={this.props.login.toJS()}
			/>
		)
	}
}
/* Connect to Redux */
function reportMapStateToProps(state, ownProps) {
	return {
		report: state[MODULE_NAME_REPORT],
		login: state[MODULE_NAME_LOGIN]
	};
}
function reportMapDispatchToProps(dispatch, ownProps) {
	return {
		dispatch: {
			onDisplayNoticeList() {
				dispatch(displayNoticeList());
			},
		}
	};
}
const reportContainer = connect(
	reportMapStateToProps,
	reportMapDispatchToProps
)(ReportContainer);

//-----------------------------------------------------------------------------
//	NoticeListContainer
//-----------------------------------------------------------------------------
class NoticeListContainer extends React.Component {
	render() {
		return(
			<NoticeList
				{...this.props}
				{...this.props.report.toJS()}
				login={this.props.login}
			/>
		)
	}
}
/* Connect to Redux */
function noticeListMapStateToProps(state, ownProps) {
	return {
		report: state[MODULE_NAME_REPORT],
	};
}
function noticeListMapDispatchToProps(dispatch, ownProps) {
	return {
		onChangeFilter(e) {
			dispatch(changeFilter(e));
		},
		onReportUpdateRequest(form) {
			dispatch(reportUpdateRequest(form));
		},
	};
}
const noticeListContainer = connect(
	noticeListMapStateToProps,
	noticeListMapDispatchToProps
)(NoticeListContainer);

export {reportContainer, noticeListContainer}