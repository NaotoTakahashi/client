import React from 'react';
import PropTypes from 'prop-types';
import {addComma} from '../Utility';
import './Board.css';
import {issueMarketContainer as IssueSearch} from '../containers/MIOSContainer';

import { Record } from 'immutable';
//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
class Board extends React.Component {
	constructor(props) {
		super(props)
		this.TIMER_INTERVAL = 500;
		this.onDrop = this._onDrop.bind(this);
		//this.tdRef = {}
	}
	render() {
		let id = this.props.board.id;
		let data = this.props.board.boardData;
		return(
			<div className="board" onContextMenu={this.onContextMenu}>
				<table className='board_table' name={id} onDrop={this.onDrop} >
					<tbody>
					<tr className="row1">
						<td className={"board_input"} colSpan="3">
							<IssueSearch
								issueCode = {this.props.board.issueCode}
								marketCode = {this.props.board.marketCode}
								className = "board_input"
								onChange = {this.onChange}
								issueRef = {(input) => this.mIssueInput = input}
								marketRef = {(select) => this.mMarketSelect = select}
							/>
						</td>
						<td className="board_name" colSpan="4">{this.props.board.issueName}</td>
					</tr>
					<tr>
						<td className={"message"} colSpan="5">
							{this.props.board.message}
						</td>
						<td className="ohlc_label">単位株</td>
						<td className="ohlc_value" name="LOSH">{addComma(data.LOSH.value)}</td>
					</tr>
					<tr className="row1" name="fluctuation-value">
						<td className={"last_price "+data.DPP.className} colSpan="2" rowSpan="2" name="DPP">{addComma(data.DPP.value)}</td>
						<td className={"last_time "+data["DPP:T"].className} rowSpan="2" name="DPP:T">{Board.addBracket(data["DPP:T"].value)}</td>
						<td className="bid flag" rowSpan="2">&nbsp;</td>
						<td className="session" rowSpan="2">{Board.convertZSS(data.ZSS.value)}</td>
						<td className="ohlc_label">騰落幅</td>
						<td className={"ohlc_value change_price "+data.DYWP.className} name="DYWP">{Board.addSign(data.DYWP.value)}</td>
					</tr>
					<tr className="row1" name="fluctuation-ratio">
						<td className="ohlc_label">騰落率</td>
						<td className={"ohlc_value change_price "+data.DYRP.className} name="DYRP">{Board.addSign(data.DYRP.value)}</td>
					</tr>
					<tr className="row0" name="market-order">
						<td className={"ask lot "+data.AAV.className} name="AAV">{addComma(data.AAV.value)}</td>
						<td className="ask flag">&nbsp;</td>
						<td className="ask price">成行</td>
						<td className="bid flag">&nbsp;</td>
						<td className={"bid lot "+data.ABV.className} name="ABV" onDoubleClick={this.onDoubleClickBoard}>{addComma(data.ABV.value)}</td>
						<td className="ohlc_label">始値</td>
						<td className={"ohlc_value "+data.DOP.className} name="DOP">{addComma(data.DOP.value)}</td>
					</tr>
					<tr className="row1" name="over">
						<td className={"ask lot "+data.QOV.className} name="QOV">{addComma(data.QOV.value)}</td>
						<td className="ask flag">&nbsp;</td>
						<td className="ask price">OVER</td>
						<td className="bid flag">&nbsp;</td>
						<td className="bid lot" onDoubleClick={this.onDoubleClickBoard}>&nbsp;</td>
						<td className="ohlc_label">&nbsp;</td>
						<td className={"ohlc_value "+data["DOP:T"].className} name="DOP:T">{Board.addBracket(data["DOP:T"].value)}</td>
					</tr>
					<tr className="row0" name="ask-price-8">
						<td className={"ask lot "+data.GAV8.className} name="GAV8">{addComma(data.GAV8.value)}</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"ask price "+data.GAP8.className} name="GAP8">{addComma(data.GAP8.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className="bid lot" onDoubleClick={this.onDoubleClickBoard}>&nbsp;</td>
						<td className="ohlc_label">高値</td>
						<td className={"ohlc_value "+data.DHP.className} name="DHP">{addComma(data.DHP.value)}</td>
					</tr>
					<tr className="row1" name="ask-price-7">
						<td className={"ask lot "+data.GAV7.className} name="GAV7">{addComma(data.GAV7.value)}</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"ask price "+data.GAP7.className} name="GAP7">{addComma(data.GAP7.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className="bid lot" onDoubleClick={this.onDoubleClickBoard}>&nbsp;</td>
						<td className="ohlc_label">&nbsp;</td>
						<td className={"ohlc_value "+data["DHP:T"].className} name="DHP:T">{Board.addBracket(data["DHP:T"].value)}</td>
					</tr>
					<tr className="row0" name="ask-price-6">
						<td className={"ask lot "+data.GAV6.className} name="GAV6">{addComma(data.GAV6.value)}</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"ask price "+data.GAP6.className} name="GAP6">{addComma(data.GAP6.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className="bid lot" onDoubleClick={this.onDoubleClickBoard}>&nbsp;</td>
						<td className="ohlc_label">安値</td>
						<td className={"ohlc_value "+data.DLP.className} name="DLP">{addComma(data.DLP.value)}</td>
					</tr>
					<tr className="row1" name="ask-price-5">
						<td className={"ask lot "+data.GAV5.className} name="GAV5">{addComma(data.GAV5.value)}</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"ask price "+data.GAP5.className} name="GAP5">{addComma(data.GAP5.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className="bid lot" onDoubleClick={this.onDoubleClickBoard}>&nbsp;</td>
						<td className="ohlc_label">&nbsp;</td>
						<td className={"ohlc_value "+data["DLP:T"].className} name="DLP:T">{Board.addBracket(data["DLP:T"].value)}</td>
					</tr>
					<tr className="row0" name="ask-price-4">
						<td className={"ask lot "+data.GAV4.className} name="GAV4">{addComma(data.GAV4.value)}</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"ask price "+data.GAP4.className} name="GAP4">{addComma(data.GAP4.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className="bid lot" onDoubleClick={this.onDoubleClickBoard}>&nbsp;</td>
						<td className="ohlc_label">出来高</td>
						<td className="ohlc_value">&nbsp;</td>
					</tr>
					<tr className="row1" name="ask-price-3">
						<td className={"ask lot "+data.GAV3.className} name="GAV3">{addComma(data.GAV3.value)}</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"ask price "+data.GAP3.className} name="GAP3">{addComma(data.GAP3.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className="bid lot" onDoubleClick={this.onDoubleClickBoard}>&nbsp;</td>
						<td className="ohlc_value" name="DV" colSpan="2">{addComma(data.DV.value)}</td>
					</tr>
					<tr className="row0" name="ask-price-2">
						<td className={"ask lot "+data.GAV2.className} name="GAV2">{addComma(data.GAV2.value)}</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"ask price "+data.GAP2.className} name="GAP2">{addComma(data.GAP2.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className="bid lot" onDoubleClick={this.onDoubleClickBoard}>&nbsp;</td>
						<td className="ohlc_label">VWAP</td>
						<td className="ohlc_value">&nbsp;</td>
					</tr>
					<tr className="row1" name="ask-price-1">
						<td className={"ask lot "+data.GAV1.className} name="GAV1">{addComma(data.GAV1.value)}</td>
						<td className={"ask flag "+data.GAS.className} name="GAS">{Board.convertGABS(data.GAS.value)}</td>
						<td className={"ask price "+data.GAP1.className} name="GAP1">{addComma(data.GAP1.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className="bid lot" onDoubleClick={this.onDoubleClickBoard}>&nbsp;</td>
						<td className="ohlc_value" name="VWAP" colSpan="2">{addComma(data.VWAP.value)}</td>
					</tr>
					<tr className="row0" name="bid-price-1">
						<td className="ask lot">&nbsp;</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"bid price "+data.GBP1.className} name="GBP1">{addComma(data.GBP1.value)}</td>
						<td className={"bid flag "+data.GBS.className} name="GBS">{Board.convertGABS(data.GBS.value)}</td>
						<td className={"bid lot "+data.GBV1.className} name="GBV1" onDoubleClick={this.onDoubleClickBoard}>{addComma(data.GBV1.value)}</td>
						<td className="ohlc_label">前日終</td>
						<td className={"ohlc_value "+data.PRP.className} name="PRP">{addComma(data.PRP.value)}</td>
					</tr>
					<tr className="row1" name="bid-price-2">
						<td className="ask lot">&nbsp;</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"bid price "+data.GBP2.className} name="GBP2">{addComma(data.GBP2.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className={"bid lot "+data.GBV2.className} name="GBV2" onDoubleClick={this.onDoubleClickBoard}>{addComma(data.GBV2.value)}</td>
						<td className="ohlc_label">上限値</td>
						<td className={"ohlc_value "+data.DSPH.className} name="DSPH">{addComma(data.DSPH.value)}</td>
					</tr>
					<tr className="row0" name="bid-price-3">
						<td className="ask lot">&nbsp;</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"bid price "+data.GBP3.className} name="GBP3">{addComma(data.GBP3.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className={"bid lot "+data.GBV3.className} name="GBV3" onDoubleClick={this.onDoubleClickBoard}>{addComma(data.GBV3.value)}</td>
						<td className="ohlc_label">下限値</td>
						<td className={"ohlc_value "+data.DSPL.className} name="DSPL">{addComma(data.DSPL.value)}</td>
					</tr>
					<tr className="row1" name="bid-price-4">
						<td className="ask lot">&nbsp;</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"bid price "+data.GBP4.className} name="GBP4">{addComma(data.GBP4.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className={"bid lot "+data.GBV4.className} name="GBV4" onDoubleClick={this.onDoubleClickBoard}>{addComma(data.GBV4.value)}</td>
						<td className="ohlc_label">歩み1</td>
						<td className={"ohlc_value "+data.L1P.className} name="L1P">{addComma(data.L1P.value)}</td>
					</tr>
					<tr className="row0" name="bid-price-5">
						<td className="ask lot">&nbsp;</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"bid price "+data.GBP5.className} name="GBP5">{addComma(data.GBP5.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className={"bid lot "+data.GBV5.className} name="GBV5" onDoubleClick={this.onDoubleClickBoard}>{addComma(data.GBV5.value)}</td>
						<td className="ohlc_label">&nbsp;</td>
						<td className={"ohlc_value "+data["L1P:T"].className} name="L1P:T">{Board.addBracket(data["L1P:T"].value)}</td>
					</tr>
					<tr className="row1" name="bid-price-6">
						<td className="ask lot">&nbsp;</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"bid price "+data.GBP6.className} name="GBP6">{addComma(data.GBP6.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className={"bid lot "+data.GBV6.className} name="GBV6" onDoubleClick={this.onDoubleClickBoard}>{addComma(data.GBV6.value)}</td>
						<td className="ohlc_label">歩み2</td>
						<td className={"ohlc_value "+data.L2P.className} name="L2P">{addComma(data.L2P.value)}</td>
					</tr>
					<tr className="row0" name="bid-price-7">
						<td className="ask lot">&nbsp;</td>
						<td className="ask flag">&nbsp;</td>
						<td className={"bid price "+data.GBP7.className} name="GBP7">{addComma(data.GBP7.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className={"bid lot "+data.GBV7.className} name="GBV7" onDoubleClick={this.onDoubleClickBoard}>{addComma(data.GBV7.value)}</td>
						<td className="ohlc_label">&nbsp;</td>
						<td className={"ohlc_value "+data["L2P:T"].className} name="L2P:T">{Board.addBracket(data["L2P:T"].value)}</td>
					</tr>
					<tr className="row1" name="bid-price-8">
						<td className="ask lot">&nbsp;</td>
						<td className="ask_flag">&nbsp;</td>
						<td className={"bid price "+data.GBP8.className} name="GBP8">{addComma(data.GBP8.value)}</td>
						<td className="bid flag">&nbsp;</td>
						<td className={"bid lot "+data.GBV8.className} name="GBV8" onDoubleClick={this.onDoubleClickBoard}>{addComma(data.GBV8.value)}</td>
						<td className="ohlc_label">歩み3</td>
						<td className={"ohlc_value "+data.L3P.className} name="L3P">{addComma(data.L3P.value)}</td>
					</tr>
					<tr className="row0" name="under">
						<td className="ask lot">&nbsp;</td>
						<td className="ask flag">&nbsp;</td>
						<td className="bid price">UNDER</td>
						<td className="bid flag">&nbsp;</td>
						<td className={"bid lot "+data.QUV.className} name="QOV">{addComma(data.QUV.value)}</td>
						<td className="ohlc_label">&nbsp;</td>
						<td className={"ohlc_value "+data["L3P:T"].className} name="L3P:T">{Board.addBracket(data["L3P:T"].value)}</td>
					</tr>
					</tbody>
				</table>
			</div>
		)
	}

	componentDidMount() {
		let id = this.props.board.id;
		this.mTimerId = setInterval(() => {this.resetUpdateTime(id)}, this.TIMER_INTERVAL);
		if(this.props.frame) {
			this.props.frame.handlers.registOnActivateMouseUp(this.onFrameActive);
		}
		this.focusInput();
	}

	componentWillUnmount() {
		clearInterval(this.mTimerId);
	}

	onFrameActive = () => {
		//this.focusInput();
	}

	focusInput = () => {
		this.mIssueInput.focus();
		this.mIssueInput.select();
	}
/*
	componentWillUpdate(nextProps) {
		if(this.props.board.boardData.DPP.value != nextProps.board.boardData.DPP.value) {
			this.tdRef.DPP.classList.remove('brink');
			this.tdRef.DPP.classList.add('brink');
		}
	}
*/
	resetUpdateTime = (id) => {
		this.props.onResetUpdateTime(id);
	}
	
	_onDrop(event) {
		var id = event.dataTransfer.getData("text");
		var row = document.getElementById(id);
		var issueCode = row.cells[0].innerText;
		if(!this.checkIssue(issueCode, "00"))
			return;
		this.register(issueCode, "00");
		event.preventDefault();
	}
	
	onDoubleClickBoard = (event) => {
		//console.log(event);
	}

	onContextMenu = (event) => {
		//this.props.onShowContextMenu(Chart, event.clientX, event.clientY);
		event.preventDefault();
	}

	onChange = (issueCode, marketCode) => {
		this.props.onChange(this.props.board.id, issueCode, marketCode);
	}

	static addBracket(val) {
		if(val === null || val === undefined || val === "") {
			return val;
		}
		return "(" + val + ")";
	}

	static addSign(val) {
		if(isNaN(Number(val)) || Number(val) <= 0) {
			return val;
		}
		return "+" + val;
	}
	
	static convertZSS(val) {
		if(val === "0001") {
			return "前場";
		} else if(val === "0002") {
			return "後場";
		}
		return "";
	}
	static convertGABS(val) {
		if(val === "0102") {
			return "特";
		} else if(val === "0103") {
			return "注";
		} else if(val === "0107" || val === "0116" || val === "0117") {
			return "寄";
		} else {
			return "\u00a0";
		}
	}

	static getSign(className) {
		if(className.match(/_plus$/))
			return "+";
		if(className.match(/_minus$/))
			return "-";
		return "";
	}

	static getDefaultSetting() {
		var setting = {
			x: 15,
			y: 15,
			width: 395,
			height: 575,
			zindex: 0,
			issueCode: '',
			sizyouC: ''
		};
		return setting;
	}
}

Board.propTypes = {
	//frame: PropTypes.instanceOf(Frame).isRequired,
	id: PropTypes.string.isRequired,
	board: PropTypes.instanceOf(Record).isRequired,
	onChangeIssue: PropTypes.func.isRequired,
	onResetUpdateTime: PropTypes.func.isRequired,
	onShowContextMenu: PropTypes.func.isRequired,
};

export default Board;