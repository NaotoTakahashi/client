import * as OrderActions from "../actions/OrderActions";
import * as FullBoardActions from "../actions/FullBoardActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
import {getApiKey} from "../reducers/LoginReducer";
import {NAME, getState, getKokyakuState, getIssueState, getOrderState, getUnitLot} from "../reducers/OrderReducer";
import {isNumber} from "../Utility";

const createRequestOrder = (state) => {
	let request = getOrderState(state).toJS();
	const kokyakuState = getKokyakuState(state);
	request.kokyakuRegistN = kokyakuState.get("kokyakuRegistN");
	const issueState = getIssueState(state);
	request.issueCode = issueState.get("issueCode");
	request.marketCode = issueState.get("marketCode");
	return request;
}

export default store => next => action => {
	const state = store.getState();
	const errObj = {code: "", message: ""};
	const kokyakuRegistN = getKokyakuState(state).get("kokyakuRegistN");
	const issueCode = getIssueState(state).get("issueCode");
	const marketCode = getIssueState(state).get("marketCode");
	if(action.type === OrderActions.CHANGE_KOKYAKU) {
		if(action.kokyakuRegistN === kokyakuRegistN)
			return;
		if(checkKokyaku(action.kokyakuRegistN, errObj) && checkSearchKokyakuIssue(action.kokyakuRegistN, issueCode, marketCode, errObj)) {
			store.dispatch(ReportSVApiActions.searchKokyakuIssueRequest(getApiKey(state), action.kokyakuRegistN, issueCode, marketCode));
		} else {
			next(action);
			store.dispatch(OrderActions.checkSearchKokyakuIssueError(errObj.code, errObj.message));
			return;
		}
	}
	if(action.type == OrderActions.CHANGE_ISSUE_MARKET) {
		if(action.issueCode === issueCode && action.marketCode == marketCode)
			return;
		if(checkIssue(action.issueCode, errObj) && checkSearchKokyakuIssue(kokyakuRegistN, action.issueCode, action.marketCode, errObj)) {
			store.dispatch(ReportSVApiActions.searchKokyakuIssueRequest(getApiKey(state), kokyakuRegistN, action.issueCode, action.marketCode));
		} else {
			next(action);
			store.dispatch(OrderActions.checkSearchKokyakuIssueError(errObj.code, errObj.message));
			return;
		}
	}
	/*
	if(action.type === OrderActions.SEARCH_KOKYAKU_ISSUE) {
		if(action.kokyakuRegistN === kokyakuRegistN && action.issueCode === issueCode && action.marketCode == marketCode)
			return;
		if(checkSearchKokyakuIssue(state, action.kokyakuRegistN, action.issueCode, action.marketCode, errObj)) {
			store.dispatch(ReportSVApiActions.searchKokyakuIssueRequest(getApiKey(state), action.kokyakuRegistN, action.issueCode, action.marketCode));
		} else {
			next(action);
			store.dispatch(OrderActions.checkSearchKokyakuIssueError(errObj.code, errObj.message));
			return;
		}
	}
	*/
	if(action.type === OrderActions.TO_CONFIRM) {
		if(checkKabuNewOrder(state, action.order, errObj)) {
			store.dispatch(ReportSVApiActions.kabuNewOrderCheckRequest(getApiKey(state), action.order));
		} else {
			next(action);
			store.dispatch(OrderActions.checkNewOrderError(errObj.code, errObj.message));
			return;
		}
	}
	if(action.type === OrderActions.TO_COMPLETE) {
		store.dispatch(ReportSVApiActions.kabuNewOrderRequest(getApiKey(state), createRequestOrder(state)));
	}
	// 顧客銘柄情報(可能額・ポジション)更新
	if(action.type === OrderActions.TO_INPUT || action.type === ReportSVApiActions.KABU_NEW_ORDER_CHECK_SUCCESS || action.type === ReportSVApiActions.KABU_NEW_ORDER_SUCCESS) {
		store.dispatch(ReportSVApiActions.searchKokyakuIssueRequest(getApiKey(state), kokyakuRegistN, issueCode, marketCode));
	}
	if(action.type === FullBoardActions.CLICK_BUY_SELL) {
		if(getState(state).get("phase") === 1 && (issueCode !== action.issueCode || marketCode !== action.marketCode)) {
			store.dispatch(OrderActions.changeIssueMarket(action.issueCode, action.marketCode));
			//store.dispatch(OrderActions.searchKokyakuIssue(null, kokyakuRegistN, action.issueCode, action.marketCode));
		}
	}
	next(action);
	if(action.type === ReportSVApiActions.LOGIN_SUCCESS) {
		const orderSetting = (action.response.Setting? action.response.Setting[NAME] : null);
		if(orderSetting) {
			const param = {
				ApiKey: action.response.ApiKey,
				kokyakuRegistN: orderSetting.kokyaku.kokyakuRegistN,
				issueCode: orderSetting.issue.issueCode,
				marketCode: orderSetting.issue.marketCode,
			}
			store.dispatch(ReportSVApiActions.searchKokyakuIssueRequest(param.ApiKey, param.kokyakuRegistN, param.issueCode, param.marketCode));
		}
	}
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

const checkIssue = (issueCode, errObj) => {
	if(issueCode === "") {
		errObj.code = "021";
		errObj.message = errorMessage["021"];
		return false;
	}
	return true;
}

const checkSearchKokyakuIssue = (kokyakuRegistN, issueCode, marketCode, errObj) => {
	
	
	return true;
}

const checkKabuNewOrder = (state, order, errObj) => {
	const unitLot = getUnitLot(state);
	const kokyakuRegistN = getKokyakuState(state).get("kokyakuRegistN");
	const issueCode = getIssueState(state).get("issueCode");
	if(order.kokyakuRegistN !== kokyakuRegistN) {
		errObj.code = "014";
		errObj.message = errorMessage["014"];
		return false;
	}
	if(order.issueCode !== issueCode) {
		errObj.code = "025";
		errObj.message = errorMessage["025"];
		return false;
	}
	if(unitLot === 0) {
		errObj.code = "001";
		errObj.message = "単位株取得エラー";
		//return false;
	} else if(order.orderSuryou % (order.checkLot * unitLot)){
		errObj.code = "002";
		errObj.message = "株数チェックエラー";
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
	// 銘柄コード
	"021": "銘柄コードが未指定です",
	"022": "銘柄コードが数値以外の値です",
	"023": "銘柄コード・市場コードの指定が不正です",
	"024": "市場コードの指定が不正です",
	"025": "銘柄コードが変更されています",
	// 市場コード
	// 取引
	"031": "取引が選択されていません",
	// 注文株数
	"041": "注文株数が未指定です",
	"042": "注文数量が数値以外の値です",
	"043": "注文数量が0以下の値です",
	"044": "注文数量が10億以上の値です",
	"045": "注文数量が最低単位を満たしていません",
	"046": "注文数量が売買単位の整数倍ではありません",
	// 注文単価区分
	"051": "注文単価区分が未指定です",
	// 注文単価
	"061": "注文単価が入力されていません",
	"062": "注文単価が数値以外の値です",
	"063": "注文単価が0以下の値です",
	"064": "注文単価の入力桁数が不正です",
	"065": "注文単価が該当銘柄の制限値幅の範囲外です",
	// 執行条件
	"071": "執行条件「不成」指定は、注文単価に成行は指定できません",
	"072": "執行条件「不成」指定は、注文単価が必須入力です",
	// 口座
	"081": "NISA口座の取引は、現物取引のみとなります",
	// 期間
	"091": "注文期間に当日中を指定時は執行条件は無条件以外指定できません",
	// 預り
	"101": "信用口座保有顧客以外、代用預り指定はできません",
	"102": "NISA口座指定時は、代用預り指定はできません",
	// トリガー単価
	"111": "トリガー単価が入力されていません",
	"112": "トリガー単価が数値以外の値です",
	"113": "トリガー単価が0以下の値です",
	"114": "トリガー単価の入力桁数が不正です",
	// 逆指値注文単価
	"121": "逆指注文単価が入力されていません",
	"122": "逆指注文単価が数値以外の値です",
	"123": "逆指注文単価が0以下の値です",
	"124": "逆指注文単価の入力桁数が不正です",
	"125": "逆指注文単価が該当銘柄の制限値幅の範囲外です",
	"126": "通常単価と(通常+指値)訂正単価が同一です",
	// 時間発注
	"131": "時間(分)が入力されていません",
	"132": "時間(時)が入力されていません",
	"133": "時間(分)が数値以外の値です",
	"134": "時間(時)が数値以外の値です",
	"135": "取引時間外の時分が指定されています",
	// 警告メッセージ
	"141": "警告メッセージが確認チェックされていません",
}