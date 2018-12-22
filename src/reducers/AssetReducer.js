import {Map, List, Record} from 'immutable';
//import * as RCApiActions from "../actions/RCApiActions";
import * as AssetActions from "../actions/AssetActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
export const NAME = 'ASSET';

//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------

const kanougakuSuii = Record({
})

const kokyakuInfo = Record({
	kokyakuRegistN: "",
	kokyakuNameKanzi: "",
	updateTime: "0",
	nearaiKubun: "0",
	sinyouKouzaKubun: "0",
})

const baseRecord = Map({
	kokyakuInfo: kokyakuInfo(),
	errorCode: "",
	message: "",
});

//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
export const getState = (state) => state[NAME];
export const getKanougakuSuiiState = (state) => state[NAME].get("kanougakuSuii");

//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
//const changeKokyaku = (state, kokyakuRegistN) => {
//	return state.setIn(["kokyaku", "kokyakuRegistN"], kokyakuRegistN);
//}
/*
export class DataListRecord extends baseRecord {
	getKanougakuSuiiList() {
		return this.get("kanougakuSuiiList");
	}
	showData(action) {
		const msgListEntry = action.response.kanougakuSuii;
		return this.withMutations(s => {
			s.set('kokyakuNameKanzi', action.response.kokyakuNameKanzi)
			.set('updateTime', action.response.UpdateTime)
			.set('day0', msgListEntry[0].day)
			.set('azukarikin0', msgListEntry[0].azukarikin);
//			.set('dataList', list)
		});
		const day = msgListEntry[0].day;
	}
}
*/
const assetReducer = (state = baseRecord, action) => {
	switch (action.type) {
		case AssetActions.GET_KANOUGAKU_SUII:
			return state.withMutations( s => {
				s.setIn(["kokyakuRegistN"], action.kokyakuRegistN);
				resetError(s);
			});
		case AssetActions.CHECK_GET_KANOUGAKU_SUII_ERROR:
			return state.withMutations( s => {
				s.set("errorCode", action.code)
				 .set("message", action.message);
			});
		case ReportSVApiActions.KANOUGAKU_SUII_SUCCESS:
			const kanougakuSuiiList = action.response.kanougakuSuii;
			return state.withMutations( s => {
				s.set("kokyakuInfo", kokyakuInfo());
				if(action.response.kokyakuInfo) {
					setKokyakuInfo(s, action.response.kokyakuInfo);
					if(action.response.kanougakuSuii) {
						setKanougakuSuii(s, action.response.kanougakuSuii);
					}
				}
			});
		case ReportSVApiActions.KANOUGAKU_SUII_ERROR:
			return state.withMutations( s => {
				s.set("errorCode", action.code);
				setApiError(s, action.code);

			});
		default:
			return state;
	}
}

const setError = (state, errorCode, message) => {
	return state.withMutations(s => {
		s.set("errorCode", errorCode)
		 .set("message", message);
	})
}

const resetError = (state) => {
	return state.withMutations(s => {
		s.set("errorCode", "")
		 .set("message", "");
	})
}

const setKokyakuInfo = (state, kokyakuInfo) => {
	const {kokyakuRegistN, kokyakuNameKanzi, updateTime, nearaiKubun} = kokyakuInfo;
	const data = kokyakuInfo[0];
	return state.setIn(["kokyakuInfo", "kokyakuRegistN"], data.kokyakuRegistN)
		 .setIn(["kokyakuInfo", "kokyakuNameKanzi"], data.kokyakuNameKanzi)
		 .setIn(["kokyakuInfo", "updateTime"], data.updateTime)
		 .setIn(["kokyakuInfo", "nearaiKubun"], data.nearaiKubun)
		 .setIn(["kokyakuInfo", "sinyouKouzaKubun"], data.sinyouKouzaKubun)
}

const setKanougakuSuii = (state, kanougakuSuii) => {
//	const {day0, azukarikin0, genkinHosyoukin0, hibakarikousokukin0, kanougakuGenkabuKaituke0} = kanougakuSuii;
	let dataList = [];
	for (let i = 0; i < kanougakuSuii.length; i++) {
		dataList.push(kanougakuSuii[i]);
	}
	return state.set(["kanougakuSuii"], dataList)
}

const ApiError = {
	"12095": "顧客コードが間違っています",
	"12901": "セッションタイムアウト",
	"12999": "セッションタイムアウト",
}

const setApiError = (state, errorCode) => {
	return setError(state, errorCode, ApiError[errorCode]);
}

export default assetReducer;