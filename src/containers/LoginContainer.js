import React from 'react';
import { connect } from 'react-redux';
//import Immutable from 'immutable';
import ModalLogin from '../components/LoginComponent';
import {getLoginState} from '../reducers/LoginReducer';
import {getMainState} from '../reducers/MainReducer';
import {login} from '../actions/LoginActions';	// import action

//-----------------------------------------------------------------------------
//	Component(Container)
//-----------------------------------------------------------------------------
class ModalLoginContainer extends React.Component {
	render() {
		return(
			<ModalLogin
				{...this.props}
				login = {this.props.login.toJS()}
			/>
		)
	}
}

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	const mainState = getMainState(state);
	let loginState = getLoginState(state);
	if(loginState.get["status"] !== "-1") {
		if(mainState.RAPSVStatus === "1" && mainState.ReportSockStatus === "1" && mainState.WSSVStatus === "1") {
			// loginned
			loginState = loginState.set("status", "0");
		} else if(mainState.RAPSVStatus === "0" && mainState.ReportSockStatus === "0" && mainState.WSSVStatus === "0") {
			// unitil
			loginState = loginState.set("status", "1");
		} else {
			// in inquiry
			loginState = loginState.set("status", "2");
		}
	}
	return {
		login: loginState,
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		//onLoading() {
		//	dispatch(loading());
		//},
		onLogin(loginId, password) {
			dispatch(login(loginId, password));
			/*
			dispatch(loading());
			const response = loginRequest(loginId, password);
			if(response.Status !== "0") {
				dispatch(loginError(response.Status, "LOGIN ERROR!"));
			} else {
				const apiKey = getCookie('ApiKey');
				if(!apiKey || apiKey !== response.ApiKey) {
					document.cookie = 'ApiKey=' + response.ApiKey;
				}
				dispatch(loginSuccess(response));
			}
			*/
			//dispatch(login(loginId, password));
		},
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ModalLoginContainer);
