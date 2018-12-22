import React from 'react';
import PropTypes from 'prop-types';
import {Record} from 'immutable';
//import {Map} from 'immutable';
import './Frame.css';

//-----------------------------------------------------------------------------
//	Frame
//-----------------------------------------------------------------------------
class Title extends React.Component {
	//constructor(props) {
	//	super(props)
	//}
	render() {
		return (
			<span className="title"
				style={ { height: this.props.height+'px'} }
			>
			{this.props.innerText}
			</span>
		);
	}
}

Title.propTypes = {
	innerText: PropTypes.string.isRequired,
	height: PropTypes.number.isRequired
};

class CloseButton extends React.Component {
	//constructor(props) {
	//	super(props)
	//}
	render() {
		return (
			<div className="closeButton" onClick={this.handleClick.bind(this)} >
			{this.props.innerText}
			</div>
		);
	}

	handleClick(e) {
		this.props.onClose(this.props.id);
		e.stopPropagation();
		e.preventDefault();
	}
}

CloseButton.propTypes = {
	id: PropTypes.string.isRequired,
	innerText: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
};

class Header extends React.Component {
	//constructor(props) {
	//	super(props)
	//}
	render() {
		let maximizeButtonClass;
		if(this.props.maximizeFlg) {
			maximizeButtonClass = "fa fa-window-restore";
		} else {
			maximizeButtonClass = "fa fa-window-maximize";
		}
		let maximizeButton = null;
		if(this.props.resizable) {
			maximizeButton = (<div className={"maximizeButton "+maximizeButtonClass} onClick={this.maximizeToggle} ></div>);
		}
		return (
			<div className="header"
				style={ {
						height: this.props.height+'px'
						, background: this.props.backgroundColor
						} }
			>
				<Title innerText={this.props.title} height={this.props.height} />
				<div className="buttons">
					{maximizeButton}
					<CloseButton {...this.props} innerText={"\u2716"} />
				</div>
			</div>
		);
	}

	maximizeToggle = () => {
		if(this.props.maximizeFlg) {
			this.props.onRestore(this.props.id);
		} else {
			this.props.onMaximize(this.props.id);
		}
	}
}

Header.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	resizable: PropTypes.bool.isRequired,
	maximizeFlg: PropTypes.bool.isRequired,
	height: PropTypes.number.isRequired,
	backgroundColor: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	onMaximize: PropTypes.func.isRequired,
	onRestore: PropTypes.func.isRequired,
};

class ContentArea extends React.Component {
	constructor(props) {
		super(props);
		this.frame = {
			state: this.props.frameState,
			handlers: this.props.handlers,
		}
		this.content = null;
	}
	render() {
		if(this.props.frameState.container === null) {
			this.content = <iframe
				key={"iframe_"+this.props.frameState.id}
				title={"iframe_"+this.props.frameState.id}
				src={this.props.frameState.url}
				width={this.props.frameState.width}
				height={this.props.height}
				ref={this.props.iframeRef}
			/>;
		} else {
			//content = this.props.frameState.content(this.props.frameState.contentState);
			this.content = <this.props.frameState.container
					//ref={this.props.contentRef}
					frame={this.frame}
					width={this.props.frameState.width}
					height={this.props.height}
					id={this.props.frameState.id}
				/>;
		}
		return (
			<div
				key={"content_"+this.props.frameState.id}
				className={"frame_content"}
				style={ {
					width:this.props.frameState.width+'px'
					, height:this.props.height+'px'
				} }
			>
				{this.content}
			</div>
		);
	}
}

ContentArea.propTypes = {
	frameState: PropTypes.instanceOf(Record).isRequired,
	handlers: PropTypes.objectOf(PropTypes.func).isRequired,
	height: PropTypes.number.isRequired,
	iframeRef: PropTypes.func,
	//contentRef: PropTypes.func,
};

export const HEADER_HEIGHT = 26;

export default class Frame extends React.Component {
	constructor(props) {
		super(props);
		this.RESIZE_AREA = 5;
		this.TITLEBAR_DEFAULT = "-webkit-gradient(linear, left top, left bottom, from(#aaaaaa), color-stop(0.5, #999999), color-stop(0.5, #666666), to(#333333))";
		this.TITLEBAR_FOCUSED = "-webkit-gradient(linear, left top, left bottom, from(#BFD9E5), color-stop(0.5, #63B0CF), color-stop(0.5, #0080B3), to(#09C))";
		//this.TITLEBAR_DEFAULT = "linear-gradient(white, gray)";
		//this.TITLEBAR_FOCUSED = "linear-gradient(white, blue)";
		//	self.TITLEBAR_DEFAULT = "linear-gradient(to bottom, #333333, #999999 50%, #aaaaaa 50%, #eeeeee)";
		//	self.TITLEBAR_FOCUSED = "linear-gradient(to bottom, #BFD9E5, #63B0CF 50%, #0080B3 50%, #09C)";
		this.mStartW = 0;
		this.mStartH = 0;
		this.mStartX = 0;
		this.mStartY = 0;
		this.mIframe = null;
		this.onActive = null;
		this.onActivateMouseUp = null;
		this.onInactive = null;
		//this.mContent = null;
		this.activating = false;
		this.handlers = {
			registOnActive: this.registOnActive,
			registOnActivateMouseUp: this.registOnActivateMouseUp,
			registOnInactive: this.registOnInactive,
			unregistOnActive: this.unregistOnActive,
			unregistOnActivateMouseUp: this.unregistOnActivateMouseUp,
			unregistOnInactive: this.unregistOnInactive,
		}
	}

	componentDidMount() {
		// インアクティブフレーム下の子要素へのイベント伝播をキャンセル
		this.frameDiv.addEventListener("mousemove", this._onMouseMoveCapture, true);
		// iframe上でのイベントをキャッチ
		if(this.mIframe) {
			this.mIframe.onload = () => {
				this.mIframe.contentWindow.document.onmousemove = (e) => {
					let frameLeft = this.props.frameState.x;
					let frameTop = this.props.frameState.y + HEADER_HEIGHT;
					let eventFromIframe = document.createEvent('MouseEvents');
					eventFromIframe.initMouseEvent('mousemove', true, false, window, e.detail, e.screenX, e.screenY, (e.x + frameLeft), (e.y + frameTop),
							e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
					this.props.onMouseMove(eventFromIframe);
				}
				this.mIframe.contentWindow.document.onmousedown = (e) => {
					let frameLeft = this.props.frameState.x;
					let frameTop = this.props.frameState.y + HEADER_HEIGHT;
					let eventFromIframe = document.createEvent('MouseEvents');
					eventFromIframe.initMouseEvent('mousedown', true, false, window, e.detail, e.screenX, e.screenY, (e.x + frameLeft), (e.y + frameTop),
							e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
					this._onMouseDown(eventFromIframe);
				}
				this.mIframe.contentWindow.document.onmouseup = (e) => {
					let frameLeft = this.props.frameState.x;
					let frameTop = this.props.frameState.y + HEADER_HEIGHT;
					let eventFromIframe = document.createEvent('MouseEvents');
					eventFromIframe.initMouseEvent('mouseup', true, false, window, e.detail, e.screenX, e.screenY, (e.x + frameLeft), (e.y + frameTop),
							e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
					this._onMouseUp(eventFromIframe);
				}
				this.mIframe.contentWindow.document.onclose = (e) => {
					this.props.onClose(this.props.frameState.id);
				}
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if(!prevProps.frameState.active && this.props.frameState.active) {
			if(this.onActive) {
				this.onActive(this.props.frameState);
			}
		}
		if(prevProps.frameState.active && !this.props.frameState.active) {
			if(this.onInactive) {
				this.onInactive(this.props.frameState);
			}
		}
	}

	componentWillUnmount() {
		//document.removeEventListener('mousemove', this._onMouseMove);
	}

	render() {
		let titlebar_background = this.TITLEBAR_DEFAULT;
		if(this.props.frameState.active) {
			titlebar_background = this.TITLEBAR_FOCUSED;
		}
		return (
			<div className={"frame"} id={this.props.frameState.id}
				style={ {
						left:this.props.frameState.x
						, top:this.props.frameState.y
						//transform: "translate(" + this.props.frameState.x + "px" + "," + this.props.frameState.y + "px)"
						, width:this.props.frameState.width+'px'
						, height:this.props.frameState.height+'px'
						, zIndex: this.props.frameState.zIndex
						, cursor: this.props.frameState.cursor
						, overflow: "hidden"
						} }
				onMouseDown = {this._onMouseDown}
				ref = {(div) => {this.frameDiv = div}}
			>
				<Header
					id={this.props.frameState.id}
					title={this.props.frameState.title}
					resizable={this.props.frameState.resizable}
					maximizeFlg={this.props.frameState.maximizeFlg}
					height={HEADER_HEIGHT}
					backgroundColor={titlebar_background}
					onClose={this.props.onClose}
					onMaximize={this.props.onMaximize}
					onRestore={this.props.onRestore}
				/>
				<ContentArea
					{...this.props}
					handlers={this.handlers}
					height={this.props.frameState.height-HEADER_HEIGHT}
					iframeRef={(iframe) => this.mIframe = iframe}
					//contentRef={(content) => this.mContent = content}
				/>
			</div>
		);
	}

	registOnActive = (func) => {
		this.onActive = func;
	}

	registOnActivateMouseUp = (func) => {
		this.onActivateMouseUp = func
	}

	registOnInactive = (func) => {
		this.onInactive = func;
	}

	unregistOnActive = () => {
		this.onActive = null;
	}

	unregistOnInactive = () => {
		this.onInactive = null;
	}

	unregistOnActivateMouseUp = () => {
		this.onActivateMouseUp = null
	}

	_onMouseDown = (e) => {
		let state = this.props.frameState;
		document.addEventListener('mouseup', this._onMouseUp);
		this.props.onShow(this.props.frameState.id);
		if(!this.props.frameState.active) {
			this.activating = true;
		}
		// closeボタンを回避
		if(e.pageX > state.x + state.width - 20 && e.pageX < state.x + state.width - this.RESIZE_AREA && e.pageY < state.y + 1) {
			e.stopPropagation();
			e.preventDefault();
			return;
		}
		// maximizeの場合resize, move禁止
		if(state.maximizeFlg) {
			return;
		}
		// resize開始
		if((state.x + state.width - this.RESIZE_AREA < e.pageX
			|| state.x + this.RESIZE_AREA > e.pageX
			|| state.y + state.height - this.RESIZE_AREA < e.pageY
			|| state.y + this.RESIZE_AREA > e.pageY)
			&& state.resizable) {
			this.mStartW = this.props.frameState.width;
			this.mStartH = this.props.frameState.height;
			this.mStartX = this.props.frameState.x;
			this.mStartY = this.props.frameState.y;
			this.mStartPage = {
				x: e.pageX,
				y: e.pageY
			};
			this.props.onStartResize(this.props.frameState.id);
			e.stopPropagation();
			e.preventDefault();
			return;
		}
		// move開始
		if(e.pageY < this.props.frameState.y + HEADER_HEIGHT) {
			this.mStartX = e.pageX - this.props.frameState.x;
			this.mStartY = e.pageY - this.props.frameState.y;
			this.props.onStartMove(this.props.frameState.id);
		}
		//e.stopPropagation();
		//e.preventDefault();
	}

	_onMouseMoveCapture = (e) => {
		this.props.onMouseMove(e);
		if(!this.props.frameState.active) {
			//e.stopPropagation();
			return;
		}
	}

	_onMouseMove = (e) => {
		let state = this.props.frameState;
		if(!this.props.frameState.active) {
			return;
		}
		// move
		if(state.moveFlg) {
			let x = e.pageX - this.mStartX;
			let y = e.pageY - this.mStartY;
			if(x < 0) x = 0;
			if(y < 0) y = 0;
			this.props.onMove(state.id, x, y);
			return;
		}
		// resize
		if(state.resizeFlg) {
			let x = state.x;
			let y = state.y;
			let width = state.width;
			let height = state.height;
			let moveY = e.pageY - this.mStartPage.y;
			let moveX = e.pageX - this.mStartPage.x;
			if(state.cursor === "s-resize") {
				height = this.mStartH + moveY;
			}
			if(state.cursor === "n-resize") {
				y = this.mStartY + moveY;
				height = this.mStartH - moveY;
			}
			if(state.cursor === "e-resize") {
				width = this.mStartW + moveX;
			}
			if(state.cursor === "w-resize") {
				x = this.mStartX + moveX;
				width = this.mStartW - moveX;
			}
			if(state.cursor === "sw-resize") {
				height = this.mStartH + moveY;
				x = this.mStartX + moveX;
				width = this.mStartW - moveX;
			}
			if(state.cursor === "se-resize") {
				height = this.mStartH + moveY;
				width = this.mStartW + moveX;
			}
			if(state.cursor === "nw-resize") {
				y = this.mStartY + moveY;
				height = this.mStartH - moveY;
				x = this.mStartX + moveX;
				width = this.mStartW - moveX;
			}
			if(state.cursor === "ne-resize") {
				y = this.mStartY + moveY;
				height = this.mStartH - moveY;
				width = this.mStartW + moveX;
			}
			this.props.onResize(state.id, x, y, width, height);
			return;
		}
		// show resize cursor
		if(state.resizable && !state.maximizeFlg) {
			let onFrame = (e.pageX >= state.x && e.pageX <= state.x + state.width 
				&& e.pageY >= state.y && e.pageY <= state.y + state.height);
			if(onFrame) {
				let south = false
				let north = false
				let west = false
				let east = false;
				if(state.x + state.width - this.RESIZE_AREA < e.pageX)
					east = true;
				else if(state.x + this.RESIZE_AREA > e.pageX)
					west = true;
				if(state.y + state.height - this.RESIZE_AREA < e.pageY)
					south = true;
				else if(state.y + this.RESIZE_AREA > e.pageY)
					north = true;
				let cursor = "default";
				if(south) cursor = "s-resize";
				if(north) cursor = "n-resize";
				if(west) cursor = "w-resize";
				if(east) cursor = "e-resize";
				if(south && west) cursor = "sw-resize";
				if(south && east) cursor = "se-resize";
				if(north && west) cursor = "nw-resize";
				if(north && east) cursor = "ne-resize";
				this.props.onChangeCursor(state.id, cursor);
			}
		}
		//e.stopPropagation();
		//e.preventDefault();
	}
	_onMouseUp = (e) => {
		document.removeEventListener('mouseup', this._onMouseUp, false);
		this.props.onEndMove(this.props.frameState.id);
		this.props.onEndResize(this.props.frameState.id);
		if(this.activating) {
			if(this.onActivateMouseUp) {
				this.onActivateMouseUp(this.props.frameState);
			}
			this.activating = false;
		}
		//e.stopPropagation();
		//e.preventDefault();
	}
}

Frame.propTypes = {
	frameState: PropTypes.instanceOf(Record).isRequired,
	onShow: PropTypes.func.isRequired,
	onStartMove: PropTypes.func.isRequired,
	onStartResize: PropTypes.func.isRequired,
	onMove: PropTypes.func.isRequired,
	onResize: PropTypes.func.isRequired,
	onEndMove: PropTypes.func.isRequired,
	onEndResize: PropTypes.func.isRequired,
	onChangeCursor: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	onMaximize: PropTypes.func.isRequired,
	onRestore: PropTypes.func.isRequired,
};

//export default Frame;
//export default FrameManager;
//export {FrameManagerState};