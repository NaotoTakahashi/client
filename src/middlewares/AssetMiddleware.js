import * as ReportSVApiActions from "../actions/ReportSVApiActions";
import * as AssetActions from "../actions/AssetActions";
import {getApiKey} from "../reducers/LoginReducer";
import {NAME} from "../reducers/AssetReducer";
import {isNumber} from "../Utility";

export default store => next => action => {
	const state = store.getState();
	const errObj = {code: "", message: ""};
	const kokyakuRegistN = state[NAME].get("kokyakuRegistN");

	if(action.type === AssetActions.GET_KANOUGAKU_SUII) {
		if(action.kokyakuRegistN === kokyakuRegistN)
			return;
		if(checkKokyaku(action.kokyakuRegistN, errObj)) {
			store.dispatch(ReportSVApiActions.getKanougakuSuiiRequest(getApiKey(state), action.kokyakuRegistN));
		} else {
			next(action);
			store.dispatch(AssetActions.checkGetKanougakuSuiiError(errObj.code, errObj.message));
			return;
		}
	}
	next(action);
}

const checkKokyaku = (kokyakuRegistN, errObj) => {
	if(kokyakuRegistN === "") {
		errObj.code = "011";
		errObj.message = errorMessage["011"];
		return false;
	}
	if(!isNumber(kokyakuRegistN)) {
		errObj.code = "012";
		errObj.message = errorMessage["012"];
		return false;
	}
	return true;
}

const errorMessage = {
	// 顧客コード
	"011": "顧客コードが未指定です",
	"012": "顧客コードが数値以外の値です",
	"013": "顧客コードの入力桁数が不正です",
	"014": "顧客コードが変更されています",
}