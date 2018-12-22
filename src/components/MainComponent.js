import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import PropTypes from 'prop-types';
import './Main.css';
import Kanzyou from '../containers/KanzyouContainer';
import MIOS from '../containers/MIOSContainer';
import MyMenu from '../containers/MyMenuContainer';
import {reportContainer as Report} from '../containers/ReportContainer';
import {noticeListContainer as NoticeList} from '../containers/ReportContainer';

//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
let Row = ReactBootstrap.Row;
var Nav = ReactBootstrap.Nav;
var Button = ReactBootstrap.Button;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Tooltip = ReactBootstrap.Tooltip;

//-----------------------------------------------------------------------------
//	Component(Presentational)
//-----------------------------------------------------------------------------
class NavHeader extends React.Component {
	render() {
		return (
			<Nav bsStyle="tabs" activeKey="3">
				<Kanzyou/>
				<MIOS />
				<MyMenu />
			</Nav>
		);
	}
}
class HeaderInfo extends React.Component {
	render() {
		return (
			<span className="_label">
				部署名：{this.props.login.deptName}
				<span className="space-1"></span>
				社員名：{this.props.login.employeeName}
			</span>
		);
	}
}
class LogoutButton extends React.Component {
	onClickLogout() {
		this.props.onCloseNoticeList();
		this.props.onLogout(this.props.apiKey);
	}
	render() {
		return (
			<OverlayTrigger placement="bottom" overlay={<Tooltip id="logoutTooltip">Logout</Tooltip>}>
				<Button onClick={() => {this.onClickLogout()}} className="logout">
					<span className="logout-button fa fa-sign-out-alt"></span>
				</Button>
			</OverlayTrigger>
		);
	}
}
export default class Header extends React.Component {
	render() {
		return (
			<Row className="header">
				<NavHeader 
					login={this.props.login}
					miosState = {this.props.miosState}
				/>
				<hr className="header-border" />
				<div className="right-block">
					<HeaderInfo
						login={this.props.login}
					/>
					<LogoutButton
						onCloseNoticeList={this.props.onCloseNoticeList}
						onLogout={this.props.onLogout}
						apiKey={this.props.login.apiKey}
					/>
					<Report
						login={this.props.login}
						//setting={this.props.setting}
					/>
				</div>
			</Row>
		);
	}
}
Header.propTypes = {
	onCloseNoticeList: PropTypes.func.isRequired,
	onLogout: PropTypes.func.isRequired,
	login: PropTypes.object.isRequired,
};
export class Contents extends React.Component {
	render() {
		return (
			<Row className="content">
				<NoticeList
					login={this.props.login}
				/>
			</Row>
		);
	}
}
Contents.propTypes = {
	login: PropTypes.object.isRequired,
};