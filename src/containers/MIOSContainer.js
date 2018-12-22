import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import {checkIssue} from '../api/DAPSVApi';
import {getMIOSState} from '../reducers/MIOSReducer';
import {createFrame} from '../actions/FrameActions';	// import action
import {createIframe} from '../actions/FrameActions';
import MIOS from '../components/MIOSComponent';
import {IssueCodeInput, MarketSelect} from '../components/MIOSComponent';
import Order from './OrderContainer';
import Board from './BoardContainer';
import FullBoard from './FullBoardContainer';
import Chart from './ChartContainer';
import OrderList from "./OrderListContainer";
import Asset from './AssetContainer';

//-----------------------------------------------------------------------------
//	IssueInputContainer
//-----------------------------------------------------------------------------
export class IssueInputContainer extends React.Component {
	render() {
		return (
			<IssueCodeInput
				issueCode = {this.props.issueCode}
				marketCode = {this.props.marketCode}
				className = {this.props.className}
				onChange = {this.onChange}
				inputRef = {this.props.issueRef}
			/>
		)
	}
	
	onChange = (issueCode) => {
		let marketCode = "00"
		if(this.props.marketCode) {
			marketCode = this.props.marketCode;
		}
		//let response = checkIssue(issueCode, marketCode);
		//if(response.Status === "-1") {
		//	return;
		//}
		this.props.onChange(issueCode, marketCode);
	}

	static MapStateToProps(state, ownProps) {

	}
	
	static MapDispatchToProps(dispatch, ownProps) {
	
	}
}

IssueInputContainer.propTypes = {
	issueCode: PropTypes.string,
	marketCode: PropTypes.string,
	className: PropTypes.string,
	onChange: PropTypes.func,
	inputRef: PropTypes.func,
};

export const issueInputContainer = connect(
	IssueInputContainer.mapStateToProps,
	IssueInputContainer.mapDispatchToProps
)(IssueInputContainer);

//-----------------------------------------------------------------------------
//	IssueMarketContainer
//-----------------------------------------------------------------------------
export class IssueMarketContainer extends React.Component {
	static propTypes = {
		issueCode: PropTypes.string,
		marketCode: PropTypes.string,
		className: PropTypes.string,
		issueClassName: PropTypes.string,
		marketClassName: PropTypes.string,
		onChange: PropTypes.func,
		issueRef: PropTypes.func,
		marketRef: PropTypes.func,
		marketSet: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.array
		]),
		disabled: PropTypes.bool,
		issueDisabled: PropTypes.bool,
		marketDisabled: PropTypes.bool,
	}
	render() {
		const issueDisabled = (this.props.disabled || this.props.issueDisabled);
		const marketDisabled = (this.props.disabled || this.props.marketDisabled);
		return (
			<div className = {"issue_search " + (this.props.className || "")} >
				<IssueCodeInput
					issueCode = {this.props.issueCode}
					className = {this.props.issueClassName}
					onChange = {this.onChangeIssue}
					inputRef = {this.getIssueRef}
					disabled={issueDisabled}
				/>
				<MarketSelect
					marketSet = {this.props.marketSet}
					marketCode = {this.props.marketCode}
					className = {this.props.marketClassName}
					onChange = {this.onChangeMarket}
					selectRef = {this.getMarketRef}
					disabled={marketDisabled}
				/>
			</div>
		)
	}

	getIssueRef = (input) => {
		this.issueRef = input;
		if(this.props.issueRef) {
			this.props.issueRef(input);
		}
	}
	getMarketRef = (select) => {
		this.marketRef = select;
		if(this.props.marketRef) {
			this.props.marketRef(select);
		}
	}
	onChangeIssue = (issueCode) => {
		let marketCode = "";
		if(this.marketRef.value) {
			marketCode = this.marketRef.value;
		}
		const chkPattern = /^[0-9]{0,4}(\.[0-9]{1,2})?$/;
		if(issueCode.match(chkPattern)){
			let cnt = issueCode.indexOf(".");
			if(cnt > 0 && cnt !== issueCode.length) {
				const market = issueCode.slice(cnt+1);
				//this.inputRef.value = issueCode;
				switch(market) {
					case "1": marketCode = "00";issueCode = issueCode.slice(0,cnt);this.issueRef.value = issueCode;break;
					case "3": marketCode = "02";issueCode = issueCode.slice(0,cnt);this.issueRef.value = issueCode;break;
					case "6": marketCode = "05";issueCode = issueCode.slice(0,cnt);this.issueRef.value = issueCode;break;
					case "8": marketCode = "07";issueCode = issueCode.slice(0,cnt);this.issueRef.value = issueCode;break;
					case "9": marketCode = "11";issueCode = issueCode.slice(0,cnt);this.issueRef.value = issueCode;break;
					default: break;
				}
			}
		}
		this.props.onChange(issueCode, marketCode);
	}

	onChangeMarket = (marketCode) => {
		let issueCode = "";
		if(this.issueRef.value) {
			issueCode = this.issueRef.value;
		}
		this.props.onChange(issueCode, marketCode);
	}

	static MapStateToProps(state, ownProps) {

	}
	
	static MapDispatchToProps(dispatch, ownProps) {
	
	}
}

export const issueMarketContainer = connect(
	IssueMarketContainer.mapStateToProps,
	IssueMarketContainer.mapDispatchToProps
)(IssueMarketContainer);

//-----------------------------------------------------------------------------
//	MIOSContainer
//-----------------------------------------------------------------------------
class MIOSContainer extends React.Component {
	render() {
		return(
			<MIOS 
				{...this.props}
			/>
		)
	}
}

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		report: getMIOSState(state),
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		onShowOrderFrame(id, title, width, height, resizable) {
			dispatch(createFrame(id, title, Order, width, height, resizable));
		},
		onShowBoardFrame(id, title, width, height, resizable) {
			dispatch(createFrame(id, title, Board, width, height, resizable));
		},
		onShowFullBoardFrame(id, title, width, height, resizable) {
			dispatch(createFrame(id, title, FullBoard, width, height, resizable));
		},
		onShowChartFrame(id, title, width, height, resizable) {
			dispatch(createFrame(id, title, Chart, width, height, resizable));
		},
		onShowOrderListFrame(id, title, width, height, resizable) {
			dispatch(createFrame(id, title, OrderList, width, height, resizable));
		},
		onShowKanougakuSuiiframe(id, title, width, height, resizable) {
			dispatch(createFrame(id, title, Asset, width, height, resizable));
		},
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MIOSContainer);


