import React from 'react';
//import * as ReactBootstrap from 'react-bootstrap';
import {connect} from 'react-redux';
import {changeKokyaku} from '../actions/AssetActions';
//import {tglDispOption, toggleTechMain, toggleTechSub, setChartShape, setTechTool, setChartPeriod} from '../actions/ChartActions'
//import {getChartState, getChartLib, getChartData, getChartTechnical, getChartDispOption, getChartTechTool, getChartPeriod} from '../reducers/ChartReducer';
import {createFrame} from '../actions/FrameActions';	// import action
import * as AssetActions from '../actions/AssetActions';
import Asset from '../components/AssetComponent';
import {NAME as MODULE_NAME} from '../reducers/AssetReducer';
import {getState} from "../reducers/AssetReducer";
import {getKanougakuSuii} from '../api/ReportSVApi';

//-----------------------------------------------------------------------------
//	AssetContainer
//-----------------------------------------------------------------------------
class AssetContainer extends React.Component {
	render() {
		return (
			<Asset
				{...this.props.Asset.toJS()}
				{...this.props.dispatch}
			/>
		)
	}
}

function mapStateToProps(state, ownProps) {
	return {
		Asset: getState(state)
	}
}

function mapDispatchToProps(dispatch, ownProps) {
	return {
		dispatch: {
			onGetKanougakuSuii(kokyakuRegistN) {
				dispatch(AssetActions.getKanougakuSuii(kokyakuRegistN));
			},
//			onShowAssetIframe(id, title, url, kokyakuRegistN, x, y, width, height) {
//				url = url + "?kokyakuRegistN=" + kokyakuRegistN;
//				dispatch(createIframe(id, title, url, x, y, width, height));
//			},
		},
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AssetContainer);
