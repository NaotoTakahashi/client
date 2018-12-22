import React from 'react';
import { connect } from 'react-redux';
import {changeIssue, changeIssueMarket, resetUpdateTime} from '../actions/BoardActions';	// import action
import {getBoard} from '../reducers/BoardReducer';
import Board from '../components/BoardComponent';
import register from "./ContainerRegister";

import {showContextMenu, hideContextMenu} from '../actions/ContextMenuActions';

//-----------------------------------------------------------------------------
//	Components(Container)
//-----------------------------------------------------------------------------
class BoardContainer extends React.Component{
	static containerId = "Board";
	render() {
		return(
			<Board
				{...this.props}
			/>
		)
	}
}

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		board: getBoard(state, ownProps.id),
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		onChangeIssue(id, issueCode, issueName, losh) {
			dispatch(changeIssue(id, issueCode, issueName, losh));
		},
		onResetUpdateTime(id) {
			dispatch(resetUpdateTime(id));
		},
		onShowContextMenu(container, x, y) {
			dispatch(showContextMenu(container, x, y));
		},
		onHideContextMenu() {
			dispatch(hideContextMenu());
		},
		onChange(id, issueCode, marketCode) {
			dispatch(changeIssueMarket(id, issueCode, marketCode));
		}
	};
}
const connectedContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BoardContainer);

register.regist(BoardContainer.containerId, connectedContainer);

export default connectedContainer;