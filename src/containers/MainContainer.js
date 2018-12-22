import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { connect } from 'react-redux';
//import Immutable from 'immutable';
//import {Map} from 'immutable';
//import './Main.css';
import {NAME as MODULE_NAME_MAIN} from '../reducers/MainReducer';
import {NAME as MODULE_NAME_LOGIN} from '../reducers/LoginReducer';
import Header, {Contents} from '../components/MainComponent';
import ModalLogin from '../containers/LoginContainer';
import FrameManager from './FrameContainer';
import ContextMenu from './ContextMenuContainer';
//import {FrameManagerState} from './Frame';
import {closeNoticeList} from '../actions/ReportActions';
import {logout} from '../actions/LoginActions';

//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
let Grid = ReactBootstrap.Grid;

//-----------------------------------------------------------------------------
//	Component(Container)
//-----------------------------------------------------------------------------
class MainContainer extends React.Component {
	render() {
		/* let loginStatus = this.props.login.status;
		if(loginStatus !== "0" && loginStatus !== "2" ) {
			this.modal = (<ModalLogin />);
		} else if(loginStatus === "2"){
			this.modal =  (<ModalLoading/>);
		} */
		return (
			<div>
				{/* this.modal */}
				<ModalLogin />
				<Grid fluid className="main">
					{/* Header */}
					<Header
						{...this.props}
						login={this.props.login.toJS()}
					/>
					{/* Content */}
					<Contents
						login={this.props.login.toJS()}
					/>
				</Grid>
				<FrameManager />
				<ContextMenu />
			</div>
		)
	}
	componentDidMount() {
		//window.addEventListener('load', this.onLoad.bind(this));
	//	window.addEventListener('beforeunload', this.save.bind(this));
		//this.interval = setInterval(this.onTimer.bind(this), 300);
	}
	
	onTimer() {
		//if(!global.bReady) return;
		//var now = new Date().getTime();
		/*for(var key in this.state.data) {
			// !!Edit when Component is changed
			if(this.content[key].contentClass === Notice) {
				this.state.data[key].resetUpdateTime(now);
			}
		}*/
		//this.setState(this.state);
	}

	/*static getCookie( name ) {
		var result = null;
		var cookieName = name + '=';
		var allcookies = document.cookie;
		var position = allcookies.indexOf( cookieName );
		if( position !== -1 )
		{
			var startIndex = position + cookieName.length;
			var endIndex = allcookies.indexOf( ';', startIndex );
			if( endIndex === -1 )
			{
				endIndex = allcookies.length;
			}
			result = decodeURIComponent(
				allcookies.substring( startIndex, endIndex ) );
		}
		return result;
	}*/
}

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		main: state[MODULE_NAME_MAIN],
		login: state[MODULE_NAME_LOGIN],
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		onCloseNoticeList() {
			dispatch(closeNoticeList());
		},
		onLogout(apiKey) {
			dispatch(logout(apiKey));
			/*
			const response = logoutRequest(apiKey);
			if(response.Status !== "0") {
				dispatch(logoutError(response.Status, "LOGOUT ERROR!"));
			} else {
				dispatch(logoutSuccess());
			}
			*/
		},
	};
}

const mainContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MainContainer);

export default mainContainer;