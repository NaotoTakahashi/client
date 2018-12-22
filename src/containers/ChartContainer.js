import React from 'react';
//import * as ReactBootstrap from 'react-bootstrap';
import {connect} from 'react-redux';
import {changeIssue, changeIssueMarket, resetUpdateTime, setMessage} from '../actions/ChartActions';
import {tglDispOption, toggleTechMain, toggleTechSub, setChartShape, setTechTool, setChartPeriod} from '../actions/ChartActions'
import {onMouseMove, onMouseDown, onMouseUp, onKeyUp} from '../actions/ChartActions'
import {getChartState, getChartLib, getChartData, getChartTechnical, getChartDispOption, getChartTechTool, getChartPeriod, getIssueCode, getMarketCode} from '../reducers/ChartReducer';
import Chart, {TechnicalDropDown, DispOptionDropDown, TechToolDropDown, TickTypeDropDown} from '../components/ChartComponent';
import register from "./ContainerRegister";


//-----------------------------------------------------------------------------
//	ChartContainer
//-----------------------------------------------------------------------------
class ChartContainer extends React.Component {
	constructor(props) {
		super(props);
		this.canvasSize = {
			width: this.props.width,
			height: this.props.height,
		}
		this.chartUpdating = false;
	}
	render() {
		return (
			<Chart
				{...this.props}
				chartlib={this.props.chartLib}
				canvasSize={this.canvasSize}
				canvasHeight={this.props.height}
				canvasWidth={this.props.width}
				{...this.props.dispatch}
			/>
		)
	}
}

function mapStateToProps(state, ownProps) {
	return {
		chartLib: getChartLib(state),
		technical: getChartTechnical(state),
		dispOption: getChartDispOption(state),
		techTool: getChartTechTool(state),
		chartPeriod: getChartPeriod(state),
		issueCode: getIssueCode(state),
		marketCode: getMarketCode(state),
	};
}

function mapDispatchToProps(dispatch, ownProps) {
	return {
		dispatch: {
			toggleTechMain: (techMain) => {dispatch(toggleTechMain(techMain))},
			toggleTechSub: (techSub) => {dispatch(toggleTechSub(techSub))},
			tglDispOption: (dispOption) => {dispatch(tglDispOption(dispOption))},
			setTechTool: (techTool) => {dispatch(setTechTool(techTool))},
			setChartShape: (chartShape) => {dispatch(setChartShape(chartShape))},
			setChartPeriod: (chartPeriod) => {dispatch(setChartPeriod(chartPeriod))},
			onChangeIssue(id, issueCode, issueName, losh) {
				dispatch(changeIssue(id, issueCode, issueName, losh));
			},
			onChange(id, issueCode, marketCode) {
				dispatch(changeIssueMarket(id, issueCode, marketCode));
				//dispatch(sendChartRegist(id, response.IssueCode, response.SizyouC));
			},
			onMouseMove: (e) => {dispatch(onMouseMove(e))},
			onMouseDown: (e) => {dispatch(onMouseDown(e))},
			onMouseUp: (e) => {dispatch(onMouseUp(e))},
			onKeyUp: (e) => {dispatch(onKeyUp(e))},
		}
	};
}

const chartContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChartContainer);
register.regist("Chart", chartContainer);

//-----------------------------------------------------------------------------
//	TechnicalDropDownContainer
//-----------------------------------------------------------------------------
class TechnicalDropDownContainer extends React.Component {
	render() {
		return (
			<TechnicalDropDown
				technical = {this.props.technical}
				{...this.props.dispatch}
			/>
		)
	}
}

/* Connect to Redux */
function TDDC_mapStateToProps(state, ownProps) {
	return {
		technical: getChartTechnical(state),
	};
}
function TDDC_mapDispatchToProps(dispatch, ownProps) {
	return {
		dispatch: {
			toggleTechMain: (techMain) => {dispatch(toggleTechMain(techMain))},
			toggleTechSub: (techSub) => {dispatch(toggleTechSub(techSub))},
			setChartShape: (chartShape) => {dispatch(setChartShape(chartShape))},
		}
	};
}

const technicalDropDownContainer = connect(
	TDDC_mapStateToProps,
	TDDC_mapDispatchToProps
)(TechnicalDropDownContainer);

//-----------------------------------------------------------------------------
//	DispOptionDropDownContainer
//-----------------------------------------------------------------------------
class DispOptionDropDownContainer extends React.Component {
	render() {
		return (
			<DispOptionDropDown
				dispOption = {this.props.dispOption}
				{...this.props.dispatch}
			/>
		)
	}
}

/* Connect to Redux */
function DODC_mapStateToProps(state, ownProps) {
	return {
		dispOption: getChartDispOption(state),
	};
}
function DODC_mapDispatchToProps(dispatch, ownProps) {
	return {
		dispatch: {
			tglDispOption: (dispOption) => {dispatch(tglDispOption(dispOption))},
		}
	};
}

const dispOptionDropDownContainer = connect(
	DODC_mapStateToProps,
	DODC_mapDispatchToProps
)(DispOptionDropDownContainer);

export default chartContainer;
export {technicalDropDownContainer}
export {dispOptionDropDownContainer}