import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
//import Immutable from 'immutable';
import PropTypes from 'prop-types';
import './Login.css';

//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;

//-----------------------------------------------------------------------------
//	Component(Presentational)
//-----------------------------------------------------------------------------
class LoginDialog extends React.Component {
	onClickLogin() {
		//this.props.onLoading();
		this.props.onLogin(this.input_loginId.value, this.input_pass.value);
	}
	render() {
		return(
			<Modal key="login_modal" show={(this.props.login.status !== "0")} className="login_modal">
				<Modal.Header>
					<div className="circle"><span className="fa fa-lock" aria-hidden="true"></span></div>
					<div>システム ログイン</div>
				</Modal.Header>

				<Modal.Body>
				<div key="login_loginId_text" id="login_loginId_text">ユーザID</div>
					<input type="text" id="login_loginId_input" ref={(input) => this.input_loginId = input}/>
					<div key="login_pass_text" id="login_pass_text">暗証番号</div>
					<input type="password" id="login_pass_input" ref={(input) => this.input_pass = input}/>
					<div key="login_errmessage_text" id="login_errmessage_text">{this.props.login.message}</div>
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={() => {this.onClickLogin()}}>Login</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}
class LoadingDialog extends React.Component {
	render() {
		return(
			<Modal show={true} className="loading_modal" animation={false} >
				<div className="fa fa-spinner fa-spin loading_icon"></div>
				<div className="loading_text">Loading..</div>
			</Modal>
		);
	}
}
class ModalLogin extends React.Component {
	render() {
		let loginStatus = this.props.login.status;
		return(
			<div>
				{ (() => { if(loginStatus !== "0" && loginStatus !== "2" ){
					return (
						<LoginDialog
							login = {this.props.login}
							//onLoading = {this.props.onLoading}
							onLogin = {this.props.onLogin}
						/>
					);
				}else if(loginStatus === "2"){
					return (
						<LoadingDialog login = {this.props.login}/>
					);
				}})()}
			</div>
		);
		
	}
}
ModalLogin.propTypes = {
	login: PropTypes.object.isRequired,
	onLogin: PropTypes.func.isRequired,
	//onLoading: PropTypes.func.isRequired,
};

export default ModalLogin;
// export {ModalLoading}