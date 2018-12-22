import {Map, Record} from 'immutable';
import * as FrameActions from "../actions/FrameActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
import register from "../containers/ContainerRegister";

export const NAME = 'FRAME';
//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------
const posRec = Record({
	x:0,
	y:0
})

const initialState = Map({
	iniPos: posRec(),
	frameList: Map({})
})

const frameRectState = Record({
	x: 0,
	y: 0,
	width: 0,
	height: 0,
});

const frameState = Record({
	id: "",
	title: "",
	url: "",
	container: null,
	resizable: true,
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	zIndex: 0,
	cursor: "default",
	active: true,
	moveFlg: false,
	resizeFlg: false,
	maximizeFlg: false,
	hidden: false,
	originalRect: frameRectState(),
})

const initialFrameState = frameState();
//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
export const getFrameListState = (state) => state[NAME];

export const getFrameState = (state, id) => state[NAME].getIn(["frameList", id]);

export const getFrameListStateForSetting = (state) => {
	return getFrameListState(state).withMutations(s => {
		for (const fState of s.get("frameList").values()) {
			const id = fState.get("id");
			const container = fState.get("container");
			const containerId = register.getContainerId(container);
			if(containerId) {
				s.setIn(["frameList", id, "container"], containerId);
			}
		}
	});
}

//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const frameReducer = (state = initialState, action) => {
	switch (action.type) {
		case FrameActions.SET_INITIAL_POSITION:
			return state.set("iniPos", posRec({x:action.x, y:action.y}));
		case FrameActions.CREATE_FRAME:
			return state.withMutations(s => {
				if(!s.hasIn(['frameList', action.id])) {
					let newFrame = initialFrameState
					.set('id', action.id)
					.set('title', action.title)
					.set('container', action.container)
					.set('resizable', action.resizable)
					.set('x', s.getIn(["iniPos", "x"]))
					.set('y', s.getIn(["iniPos", "y"]))
					.set('width', action.width)
					.set('height', action.height)
					.set('zIndex', 10);
					s.setIn(['frameList', action.id], newFrame);
					reducer_show(s, action, true);
				} else {
					reducer_show(s, action, false);
				}
			});
			
			 
		case FrameActions.CREATE_IFRAME:
			return state.withMutations(s => {
				if(!s.hasIn(['frameList', action.id])) {
					let newFrame = initialFrameState
					.set('id', action.id)
					.set('title', action.title)
					.set('url', action.url)
					.set('resizable', action.resizable)
					.set('x', s.getIn(["iniPos", "x"]))
					.set('y', s.getIn(["iniPos", "y"]))
					.set('width', action.width)
					.set('height', action.height)
					.set('zIndex', 10);
					s.setIn(['frameList', action.id], newFrame);
					reducer_show(s, action, true);
				} else {
					reducer_show(s, action, false);
				}
			});
		case FrameActions.CLOSE:
			//return state.withMutations(s => {
			//	s.removeIn(['frameList', action.id]);
			//});
			return reducer_hidden(state, action);
		case FrameActions.CLOSE_ALL:
			//return state.withMutations(s => {
			//	s.set('frameList', Map({}));
			//});
			return reducer_hidden_all(state, action);
		case FrameActions.SHOW:
			return reducer_show(state, action);
		case FrameActions.MOVE:
			return reducer_move(state, action);
		case FrameActions.START_MOVE:
			return state.withMutations(s => {
				s.setIn(['frameList', action.id, 'moveFlg'], true);
			});
		case FrameActions.END_MOVE:
			return state.withMutations(s => {
				s.setIn(['frameList', action.id, 'moveFlg'], false);
			});
		case FrameActions.RESIZE:
			return reducer_resize(state, action);
		case FrameActions.START_RESIZE:
			return state.withMutations(s => {
				s.setIn(['frameList', action.id, 'resizeFlg'], true);
			});
		case FrameActions.END_RESIZE:
			return state.withMutations(s => {
				s.setIn(['frameList', action.id, 'resizeFlg'], false);
			});
		case FrameActions.CHANGE_CURSOR:
			return state.withMutations(s => {
				s.setIn(['frameList', action.id, 'cursor'], action.cursor);
			});
		case FrameActions.MAXIMIZE:
			let originalRect = frameRectState(
				{
					x: state.getIn(['frameList', action.id, 'x']),
					y: state.getIn(['frameList', action.id, 'y']),
					width: state.getIn(['frameList', action.id, 'width']),
					height: state.getIn(['frameList', action.id, 'height']),
				}
			);
			return state.withMutations(s => {
				s.setIn(['frameList', action.id, 'maximizeFlg'], true)
				 .setIn(['frameList', action.id, 'x'], 0)
				 .setIn(['frameList', action.id, 'y'], 0)
				 .setIn(['frameList', action.id, 'width'], window.innerWidth)
				 .setIn(['frameList', action.id, 'height'], window.innerHeight)
				 .setIn(['frameList', action.id, 'originalRect'], originalRect);
			});
		case FrameActions.RESTORE:
			let restoreRect = state.getIn(['frameList', action.id, 'originalRect']);
			return state.withMutations(s => {
				s.setIn(['frameList', action.id, 'maximizeFlg'], false)
				 .setIn(['frameList', action.id, 'x'], restoreRect.x)
				 .setIn(['frameList', action.id, 'y'], restoreRect.y)
				 .setIn(['frameList', action.id, 'width'], restoreRect.width)
				 .setIn(['frameList', action.id, 'height'], restoreRect.height);
			});
		case FrameActions.SET_TITLE:
			return state.withMutations(s => {
				s.setIn(['frameList', action.id, 'title'], action.title);
			});
		case FrameActions.SET_URL:
			return state.withMutations(s => {
				s.setIn(['frameList', action.id, 'url'], action.url);
			});
		case ReportSVApiActions.LOGIN_SUCCESS:
			if(action.response.Setting) {
				return settingFrameManager(state, action.response.Setting[NAME]);
				return state;
			} else {
				return state;
			}
		default:
			return state;
	}
}

const reducer_show = (state, action, newFrame=false) => {
	return state.withMutations(s => {
		const frameList = s.get('frameList');
		const frameCount = frameList.size;
		const borderIdx = newFrame? frameCount : s.getIn(['frameList', action.id, 'zIndex']);
		frameList.keySeq().forEach(id => {
			if(id === action.id) {
				s.setIn(['frameList', id, 'active'], true)
				 .setIn(['frameList', id, 'zIndex'], frameCount)
				 .setIn(['frameList', id, 'hidden'], false)
			} else if(s.getIn(['frameList', id, 'zIndex']) >= borderIdx) {
				const currentIdx = s.getIn(['frameList', id, 'zIndex']);
				s.setIn(['frameList', id, 'active'], false)
				.setIn(['frameList', id, 'zIndex'], currentIdx-1)
			} else {
				s.setIn(['frameList', id, 'active'], false)
			}
		})
	});
}

const reducer_hidden = (state, action) => {
	return state.withMutations(s => {
		if(s.hasIn(['frameList', action.id])) {
			s.setIn(["frameList", action.id, "hidden"], true);
		}
	});
}

const reducer_hidden_all = (state, action) => {
	return state.withMutations(s => {
		const frameList = s.get('frameList');
		frameList.keySeq().forEach(id => {
			reducer_hidden(s, {...action, "id": id});
		})
	});
}

const reducer_move = (state, action) => {
	let fstate = state.getIn(['frameList', action.id]);
	//let moved = restrictInWindow(fstate, action.x, action.y, action.width, action.height);
	let moved = {x:action.x, y:action.y};
	return state.withMutations(s => {
		s.setIn(['frameList', action.id, 'x'], moved.x)
		 .setIn(['frameList', action.id, 'y'], moved.y);
	});
}

const reducer_resize = (state, action) => {
	let fstate = state.getIn(['frameList', action.id]);
	//let resized = restrictInWindow(fstate, action.x, action.y, action.width, action.height);
	let resized = {x:action.x, y:action.y, width:action.width, height:action.height};
	return state.withMutations(s => {
		s.setIn(['frameList', action.id, 'x'], resized.x)
		 .setIn(['frameList', action.id, 'y'], resized.y)
		 .setIn(['frameList', action.id, 'width'], resized.width)
		 .setIn(['frameList', action.id, 'height'], resized.height);
	});
}

// Frameの移動・拡大範囲をブラウザwindow内に制限する
const restrictInWindow = (fstate, inX, inY, inWidth, inHeight) => {
	let x, y, width, height;
	({x, y, width, height} = {x:inX, y:inY, width:inWidth, height:inHeight});
	if(inX !== undefined) {
		if(x+fstate.width >= window.innerWidth) {
			x = window.innerWidth - fstate.width;
		}
		if(x < 0) {
			x = 0;
			width = fstate.width;
		}
	}
	if(inY !== undefined) {
		if(y+fstate.height >= window.innerHeight) {
			y = window.innerHeight - fstate.height;
		}
		if(y < 0) {
			y = 0;
			height = fstate.height;
		}
	}
	if(inWidth !== undefined) {
		if(x+width >= window.innerWidth) {
			width = window.innerWidth - x;
		}
	}
	if(inHeight !== undefined) {
		if(y+height >= window.innerHeight) {
			height = window.innerHeight - y;
		}
	}
	return {x:x, y:y, width:width, height:height};
}

const settingFrameManager = (state, frameSetting) => {
	return state.withMutations(s => {
		settingIniPos(s, frameSetting);
		settingFrameList(s, frameSetting);
	});
}

const settingIniPos = (state, frameSetting) => {
	return state.withMutations(s => {
		s.set("iniPos", posRec(frameSetting.iniPos));
	});
}

const settingFrameList = (state, frameSetting) => {
	return state.withMutations(s=> {
		for(const id of Object.keys(frameSetting.frameList)) {
			let fState = frameState(frameSetting.frameList[id]);
			const containerId = frameSetting.frameList[id].container;
			if(containerId) {
				fState = fState.set("container", register.getContainer(containerId));
			}
			s.setIn(["frameList", id], fState);
		}
	});
}

export default frameReducer;