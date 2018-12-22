import React from 'react';
import {connect} from 'react-redux';
import Table from "../components/TableComponent";
import OrderList from "../components/OrderListComponent";
import * as OrderListActions from '../actions/OrderListActions';
import {getSortedDataList} from "../reducers/OrderListReducer";
import register from "./ContainerRegister";

//-----------------------------------------------------------------------------
//	OrderListContainer
//-----------------------------------------------------------------------------
class OrderListContainer extends React.Component{
	render() {
		return (
			<OrderList
				filters={this.props.filters.toJS()}
				cols={this.props.cols.toJS()}
				sortCondition={this.props.sortCondition.toJS()}
				onSort={this.props.dispatch.onSort}
				onFilter={this.props.dispatch.onFilter}
				//dataList={this.props.dataList.toJS()}
				dataList={this.props.dataList.toJS()}
				openDetailList={this.props.openDetailList.toJS()}
				execList={this.props.execList.toJS()}
				onShowDetail={this.props.dispatch.onShowDetail}
			/>
		);
	}
}

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		filters: state.OrderList.getFilters(),
		cols: state.OrderList.getCols(),
		sortCondition: state.OrderList.getSortCondition(),
		//dataList: getSortedDataList(state),
		dataList: getSortedDataList(state),
		openDetailList: state.OrderList.getOpenDetailMap(),
		execList: state.OrderList.getExecList(),
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		dispatch: {
			onSort(sorted, key, asc) {
				dispatch(OrderListActions.sortList(sorted, key, asc))
			},
			onFilter(key, data) {
				dispatch(OrderListActions.setFilter(key, data))
			},
			onShowDetail(key) {
				dispatch(OrderListActions.showDetail(key))
			},
		}
	};
}

const connectedContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OrderListContainer);

register.regist("OrderList", connectedContainer);

export default connectedContainer;