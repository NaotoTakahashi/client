import React from 'react';
import { connect } from 'react-redux';
import {NAME as MODULE_NAME} from '../reducers/KanzyouReducer';
import {createIframe} from '../actions/FrameActions';
import {closeNoticeList} from '../actions/ReportActions';
import PropTypes from 'prop-types';
import Kanzyou from '../components/KanzyouComponent';

//-----------------------------------------------------------------------------
//	Container
//-----------------------------------------------------------------------------
class KanzyouContainer extends React.Component {
	render() {
		return(
			<Kanzyou
				{...this.props}
			/>
		)
	}
}

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		kanzyou: state[MODULE_NAME],
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		onShowReportIframe(id, title, url, width, height) {
			dispatch(createIframe(id, title, url, width, height));
		},
		onCloseNoticeList() {
			dispatch(closeNoticeList());
		},
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(KanzyouContainer);