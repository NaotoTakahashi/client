import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';
import PropTypes from 'prop-types';
import './MyMenu.css';

//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
var NavItem = ReactBootstrap.NavItem;

//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
class MyMenu extends React.Component {
	render() {
		return (
			<NavItem eventKey="3" disabled>
				マイメニュー
			</NavItem>
		);
	}
	static getDefaultSetting() {
		return "";
	}
	static createDefaultData(contentKey) {
		return "";
	}
}

export default MyMenu;