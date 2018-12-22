import React from 'react';
import { connect } from 'react-redux';
import ContextMenu from '../components/ContextMenuComponent'
import {setContextMenuSize,hideContextMenu} from '../actions/ContextMenuActions';
import {getcontextMenuState} from '../reducers/ContextMenuReducer';

//-----------------------------------------------------------------------------
//	ContextMenu Container
//-----------------------------------------------------------------------------
class ContextMenuContainer extends React.Component{
	render() {
		return (
			<ContextMenu 
				{...this.props.state.toJS()}
				{...this.props.dispatch}
			/>
		);
	}
}

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		state: getcontextMenuState(state),
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		dispatch: {
			onHideContextMenu(event) {
				dispatch(hideContextMenu(event));
			},
			onSetContextMenuSize(width, height) {
				dispatch(setContextMenuSize(width, height));
			}
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContextMenuContainer);
