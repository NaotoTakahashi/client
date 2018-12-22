import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import PropTypes from 'prop-types';
//import CreateWebSocket from '../WebSocket';
import {CreateWebSocketWSSV} from '../api/WebSocket';
import {WSSVUrl, WebSid} from '../Conf';
import './MIOS.css';
import {MarketName, checkIssue} from '../reducers/MIOSReducer';

//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
var NavDropdown = ReactBootstrap.NavDropdown;
var MenuItem = ReactBootstrap.MenuItem;
var Button = ReactBootstrap.Button;

//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
export class Order extends React.Component {
	constructor(props) {
		super(props);
		this.submitOrder = this.submitOrder.bind(this);
	}
	render() {
		return(
			<div>
				{this.props.orderNumber}
				銘柄：<input defaultValue="" type="text" ref={(input) => this.issueCodeInput = input} /><br/>
				数量：<input defaultValue="" type="text" ref={(input) => this.lotInput = input} /><br/>
				価格：<input defaultValue="" type="text" ref={(input) => this.priceInput = input} />
				<Button onClick={this.submitOrder}>注文</Button>
			</div>
		)
	}
	submitOrder() {
		let issueCode = this.issueCodeInput.value;
		let lot = this.lotInput.value;
		let price = this.priceInput.value;
		this.props.onSubmitOrder(issueCode, lot, price);
	}
}
export class OrderList extends React.Component {
	
	render() {
		let orderList = this.props.mios.get('orderList');
		return(
			<table>
				<thead>
					<tr>
						<td>注文番号</td>
						<td>銘柄</td>
						<td>数量</td>
						<td>価格</td>
					</tr>
				</thead>
				<tbody>
					{orderList.keySeq().map(id => {
						let orderState = orderList.get(id).toJS();
						return (
							<tr key={"order_"+orderState.orderNumber}>
								<td>{orderState.orderNumber}</td>
								<td>{orderState.issueCode}</td>
								<td>{orderState.lot}</td>
								<td>{orderState.price}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		)
	}
}

// -- 銘柄検索 -----------------------------------------------------------
export class IssueCodeInput extends React.Component {
	render() {
		return (
			<input
				className={"issue_input " + (this.props.className || '')}
				type="text"
				size="5"
				ref={this.props.inputRef}
				defaultValue={this.props.issueCode}
				onKeyPress={this.onKeyPress}
				onFocus={this.onFocus}
			/>
		);
	}

	onKeyPress = (e) => {
		if(e.key !== "Enter")
			return;
		var inputForm = e.target;
		var inIssueCode = inputForm.value;
		if(this.props.issueCode !== inIssueCode) {
			if(this.props.onChange) {
				this.props.onChange(inIssueCode);
			}
		}
		inputForm.select();
	}

	onFocus = (e) => {
		e.target.select();
	}
}

IssueCodeInput.propTypes = {
	issueCode: PropTypes.string,
	className: PropTypes.string,
	onChange: PropTypes.func,
	inputRef: PropTypes.func,
};

export class MarketSelect extends React.Component {
	render() {
		let marketList;
		if(this.props.marketSet) {
			marketList = this.props.marketSet;
		} else {
			marketList = MarketName;
		}
		return (
			<select
				className={"combo market_select " + (this.props.className || '')}
				defaultValue={this.props.marketCode}
				ref={this.props.selectRef}
				defaultValue=''
				onChange={this.onChange}
			>
				{Object.keys(marketList).map((key) => {
					return (<option key={key} value={key}>{MarketName[key]}</option>);
				})}
			</select>
		);
	}

	onChange = (e) => {
		if(this.props.onChange) {
			this.props.onChange(e.target.value);
		}
	}
}

MarketSelect.propTypes = {
	marketCode: PropTypes.string,
	className: PropTypes.string,
	onChange: PropTypes.func,
	selectRef: PropTypes.func,
};

class MIOS extends React.Component {
	render() {
		return (
			<NavDropdown eventKey="2" title="MIOS" id="MIOS-dropdown">
				<MenuItem onClick={() => this.props.onShowOrderFrame("ORDER", "注文", 20, 50, 700, (60+3+90+360+20+40+26), false)}>注文</MenuItem>
				<NavDropdown title="板" className="dropdown-submenu" id="MIOS-Board-dropdown" >
					<MenuItem onClick={() => this.props.onShowBoardFrame("BOARD1", "板１", 20, 50, 395, 601, false)}>板1</MenuItem>
					<MenuItem onClick={() => this.props.onShowBoardFrame("BOARD2", "板２", 20, 50, 395, 601, false)}>板2</MenuItem>
					<MenuItem onClick={() => this.props.onShowBoardFrame("BOARD3", "板３", 20, 50, 395, 601, false)}>板3</MenuItem>
				</NavDropdown>
				<MenuItem onClick={() => this.props.onShowFullBoardFrame("FULL_BOARD", "フル板", 40, 60, 550, 680, false)}>フル板</MenuItem>
				<MenuItem onClick={() => this.props.onShowChartFrame("CHART", "チャート", 20, 50, 1000, 700)}>チャート</MenuItem>
				<MenuItem onClick={() => this.props.onShowTestTableFrame("TABLE", "表テスト", 20, 50, 550, 680)}>表テスト</MenuItem>
			</NavDropdown>
		);
	}
	static getDefaultSetting() {
		var setting = {
			socket: ''
		};
		return setting;
	}
	static createDefaultData(contentKey) {
		return "";
	}
}

MIOS.propTypes = {
	onShowOrderFrame: PropTypes.func.isRequired,
	onShowBoardFrame: PropTypes.func.isRequired,
	onShowFullBoardFrame: PropTypes.func.isRequired,
	onShowChartFrame: PropTypes.func.isRequired,
};

export default MIOS;
//export {MiosState}