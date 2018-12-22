import { connect } from 'react-redux';
import * as FullBoardActions from '../actions/FullBoardActions';
import {NAME as MODULE_NAME_FULLBOARD} from '../reducers/FullBoardReducer';
import FullBoard from '../components/FullBoardComponent';

import {showContextMenu, hideContextMenu} from '../actions/ContextMenuActions';
import {createFrame} from '../actions/FrameActions';
import Order from './OrderContainer';
import register from "./ContainerRegister";

//-----------------------------------------------------------------------------
//	Components(Container)
//-----------------------------------------------------------------------------
/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		board: state[MODULE_NAME_FULLBOARD],
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		onResetUpdateTime(dispType) {
			dispatch(FullBoardActions.resetUpdateTime(dispType));
		},
		onChangeIssueMarket(issueCode, marketCode, priceType=0, priceDec=0, price=0) {
			dispatch(FullBoardActions.changeIssueMarket(issueCode, marketCode, priceType, priceDec, price));
		},
		toClearCenterPrice() {
			dispatch(FullBoardActions.clearCenterPrice());
		},
		onChangeDisplay(dispType) {
			dispatch(FullBoardActions.changeDisplay(dispType));
		},
		onResetBoard() {
			dispatch(FullBoardActions.resetBoard());
		},
		onSetMessage(message) {
			dispatch(FullBoardActions.setMessage(message));
		},
		onClickBuySell(issueCode, marketCode, baibaiKubun, priceKubun, price, condition) {
			dispatch(FullBoardActions.clickBuySell(issueCode, marketCode, baibaiKubun, priceKubun, price, condition));
		},
		onShowOrderFrame(id, title, width, height, resizable) {
			dispatch(createFrame(id, title, Order, width, height, resizable));
		},
	};
}

const connectedContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FullBoard);

register.regist("FullBoard", connectedContainer);

export default connectedContainer;