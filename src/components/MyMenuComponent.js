import React from 'react';
//import ReactDOM from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';
//import PropTypes from 'prop-types';
import './MyMenu.css';

//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
//var NavItem = ReactBootstrap.NavItem;
var NavDropdown = ReactBootstrap.NavDropdown;
var MenuItem = ReactBootstrap.MenuItem;

//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
class MyMenu extends React.Component {
	render() {
		return (
			<NavDropdown eventKey="3" title="マイメニュー" id="mymenu_dropdown" disabled>
				<MenuItem>test</MenuItem>
			</NavDropdown>
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