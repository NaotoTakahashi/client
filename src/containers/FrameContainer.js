import React from 'react';
import { connect } from 'react-redux';
import Frame from '../components/FrameComponent'
import {close, show, move, startMove, endMove, resize, startResize, endResize, changeCursor, maximize, restore} from '../actions/FrameActions';	// import action
import {getFrameListState} from '../reducers/FrameReducer';
// cs対応
import {createIframe} from '../actions/FrameActions';	// import action

//-----------------------------------------------------------------------------
//	FrameManager
//-----------------------------------------------------------------------------
class FrameManager extends React.Component{
	constructor(props) {
		super(props)
		this.move = this.move.bind(this);
		this.frameRefs = {};
	}
	render() {
		let frameList = this.props.frame.get('frameList');
		return (
			<div id="frameManager" ref="frameManager">
			{frameList.keySeq().map(id => {
				let frameState = frameList.get(id);
				if(!frameState.hidden) {
					return (
						<Frame
							key={"frame_"+id}
							frameState={frameState}
							{...this.props.dispatch}
							onMouseMove={this.move}
							ref={this.setFrameRef(id)}
						/>
					)
				} else {
					return null;
				}
			})}
			</div>
		);
	}

	setFrameRef = (id) => (frame) => {
		this.frameRefs[id] = frame;
	}

	componentDidMount() {
		document.addEventListener('mousemove', this.move);
		// cs対応
		this.refs.frameManager.onCreateIframe = this.props.dispatch.onCreateIframe;
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.move);
	}

	move(e) {
		for(const id of Object.keys(this.frameRefs)) {
			if(!this.frameRefs[id]) continue;
			this.frameRefs[id]._onMouseMove(e);
		}
	}
}

FrameManager.propTypes = {
	//frameManagerState: FrameManagerStatePropTypes.isRequired,
	//onChangeState: PropTypes.func.isRequired
};

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		frame: getFrameListState(state),
	};
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		dispatch: {
			onClose(id) {
				dispatch(close(id));
			},
			onShow(id) {
				dispatch(show(id));
			},
			onMove(id, x, y) {
				dispatch(move(id, x, y));
			},
			onStartMove(id) {
				dispatch(startMove(id));
			},
			onEndMove(id) {
				dispatch(endMove(id));
			},
			onResize(id, x, y, width, height) {
				dispatch(resize(id, x, y, width, height));
			},
			onStartResize(id) {
				dispatch(startResize(id));
			},
			onEndResize(id) {
				dispatch(endResize(id));
			},
			onChangeCursor(id, cursor) {
				dispatch(changeCursor(id, cursor));
			},
			onMaximize(id) {
				dispatch(maximize(id));
			},
			onRestore(id) {
				dispatch(restore(id));
			},
			// cs対応
			onCreateIframe(id, title, url, width, height, resizable) {
				dispatch(createIframe(id, title, url, width, height, resizable));
			}
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FrameManager);
