import React from 'react';
import PropTypes from 'prop-types';

//-----------------------------------------------------------------------------
//	ContextMenu
//-----------------------------------------------------------------------------
export default class ContextMenu extends React.Component {
	render() {
		if(this.props.container === null) return null;
		return (
			<div className="contextMenu" ref="contextMenu"
				style={ {
						position: "absolute"
						, top:this.props.top
						, left:this.props.left
						, zIndex: 100
						} }
			>
				<this.props.container ref="container" />
			</div>
		);
	}
	
	componentDidUpdate(prevProps, prevState) {
		if(prevProps.container === null && this.props.container !== null) {
			document.addEventListener("click", this.props.onHideContextMenu);
			document.addEventListener("contextmenu", this.props.onHideContextMenu);
		}
		if(prevProps.container !== null && this.props.container === null) {
			document.removeEventListener("click", this.props.onHideContextMenu);
			document.removeEventListener("contextmenu", this.props.onHideContextMenu);
		}
		if(this.refs.container !== undefined && this.refs.container !== null) {
			let contextMenu = this.refs.contextMenu;
			if(this.props.width !== contextMenu.clientWidth || this.props.height !== contextMenu.clientHeight) {
				this.props.onSetContextMenuSize(contextMenu.clientWidth, contextMenu.clientHeight);
			}
		}
	}
}

ContextMenu.propTypes = {
	container: PropTypes.func,
	left: PropTypes.number.isRequired,
	top: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};
