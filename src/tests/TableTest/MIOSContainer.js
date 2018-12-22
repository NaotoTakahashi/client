import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import {checkIssue} from '../api/DAPSVApi';
import {getMIOSState} from '../reducers/MIOSReducer';
import {createFrame} from '../actions/FrameActions';	// import action
import MIOS from '../components/MIOSComponent';
import {IssueCodeInput, MarketSelect} from '../components/MIOSComponent';
import Order from './OrderContainer';
import Board from './BoardContainer';
import FullBoard from './FullBoardContainer';
import Chart from './ChartContainer';
import Test from "../tests/TestContainer";

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
	render() {
		return (
			<ul className = {"issue_search " + (this.props.className || "")} >
				<li>
					<IssueCodeInput
						issueCode = {this.props.issueCode}
						//className = {this.props.className}
						onChange = {this.onChangeIssue}
						inputRef = {this.getIssueRef}
					/>
				</li>
				<li>
					<MarketSelect
						marketCode = {this.props.marketCode}
						//className = {this.props.className}
						onChange = {this.onChangeMarket}
						selectRef = {this.getMarketRef}
					/>
				</li>
			</ul>
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
		let marketCode = "00";
		if(this.marketRef.value) {
			marketCode = this.marketRef.value;
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

IssueMarketContainer.propTypes = {
	issueCode: PropTypes.string,
	marketCode: PropTypes.string,
	className: PropTypes.string,
	onChange: PropTypes.func,
	issueRef: PropTypes.func,
	marketRef: PropTypes.func,
};

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
		onShowOrderFrame(id, title, x, y, width, height, resizable) {
			dispatch(createFrame(id, title, Order, x, y, width, height, resizable));
		},
		onShowBoardFrame(id, title, x, y, width, height, resizable) {
			dispatch(createFrame(id, title, Board, x, y, width, height, resizable));
		},
		onShowFullBoardFrame(id, title, x, y, width, height, resizable) {
			dispatch(createFrame(id, title, FullBoard, x, y, width, height, resizable));
		},
		onShowChartFrame(id, title, x, y, width, height, resizable) {
			dispatch(createFrame(id, title, Chart, x, y, width, height, resizable));
		},
		onShowTestTableFrame(id, title, x, y, width, height, resizable) {
			dispatch(createFrame(id, title, Test, x, y, width, height, resizable));
		},
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MIOSContainer);


