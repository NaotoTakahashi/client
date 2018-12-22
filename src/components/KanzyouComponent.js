import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';
import {ReportMenu} from '../reducers/KanzyouReducer';
import PropTypes from 'prop-types';
import './Kanzyou.css';

//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
var NavDropdown = ReactBootstrap.NavDropdown;
var MenuItem = ReactBootstrap.MenuItem;
var Button = ReactBootstrap.Button;

//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
class Kanzyou extends React.Component {
	sendCreateIframe(key) {
		this.props.onShowReportIframe(key.id, key.title, key.url, key.width, key.height);
	}
	render() {
		var reportMenuItems = Object.keys(ReportMenu).map((key) => {
			return <MenuItem key={key} eventKey={ReportMenu[key]}>{key}</MenuItem>;
		})
		return (
			<NavDropdown title="勘定システム" id="kanzyou_dropdown">
				<NavDropdown id="keihi_submenu" title="経費請求" className="dropdown-submenu" onSelect={(key) => {this.sendCreateIframe(key)}} >
					{reportMenuItems}
				</NavDropdown>
				<MenuItem divider />
			</NavDropdown>
		);
	}
}

export default Kanzyou;