import React from 'react';
import { connect } from 'react-redux';
import {NAME as MODULE_NAME} from '../reducers/MyMenuReducer';
import {actionName} from '../reducers/MyMenuReducer';
import MyMenu from '../components/MyMenuComponent';

//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
class MyMenuContainer extends React.Component {
	render() {
		return (
			<MyMenu 
				{...this.props}
			/>
		);
	}
}

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		report: state[MODULE_NAME],
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		onActionName(arg) {
			dispatch(actionName(arg));
		},
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MyMenuContainer);