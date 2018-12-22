import React from 'react';
import { connect } from 'react-redux';
import Table from "../components/TableComponent";
import {getCols, getSortCondition, getSortedDataList, sort} from "./TestReducer";

//-----------------------------------------------------------------------------
//	TestContainer
//-----------------------------------------------------------------------------
class TestContainer extends React.Component{
	render() {
		return (
			<Table
				cols={this.props.cols.toJS()}
				sortCondition={this.props.sortCondition.toJS()}
				onSort={this.props.dispatch.onSort}
				dataList={this.props.dataList.toJS()}
			/>
		);
	}
}

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		cols: getCols(state),
		sortCondition: getSortCondition(state),
		dataList: getSortedDataList(state),
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		dispatch: {
			onSort(sorted, key, asc) {
				dispatch(sort(sorted, key,asc))
			},
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TestContainer);