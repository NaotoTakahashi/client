import { call, put, fork, takeEvery, take } from 'redux-saga/effects';
import {getCookie} from '../Utility';
import API from '../api/ReportSVApi';
import {REPORT_UPDATE_REQUEST, reportUpdateSuccess, reportUpdateError} from '../actions/ReportActions';
import * as OrderActions from "../actions/OrderActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";

//-----------------------------------------------------------------------------
//	Login
//-----------------------------------------------------------------------------
function* loginRequest(action) {
	const {response, error} = yield call(API.loginAsync, action.loginId, action.password);
	if (response && !error) {
		if(response.Status === "0") {
			let apiKey = getCookie('ApiKey');
			if(!apiKey || apiKey !== response.ApiKey) {
				document.cookie = 'ApiKey=' + response.ApiKey;
			}
			yield put(ReportSVApiActions.loginSuccess(response));
		} else {
			// login error
			yield put(ReportSVApiActions.loginError(response.Status, "LOGIN ERROR"));
		}
	} else {
		// communication error
		yield put(ReportSVApiActions.loginError("999", error.message));
	}
}

function* handleLoginRequest() {
	/*
	while(true) {
		const action = yield take(LOGIN_REQUEST);
		yield fork(loginRequest, action);
	}
	*/
	yield takeEvery(ReportSVApiActions.LOGIN_REQUEST, loginRequest);
}

//-----------------------------------------------------------------------------
//	Logout
//-----------------------------------------------------------------------------
function* logoutRequest(action) {
	const {response, error} = yield call(API.logoutAsync, action.apiKey, action.setting);
	console.log(response);
	if (response && !error) {
		if(response.Status === "0") {
			yield put(ReportSVApiActions.logoutSuccess(response));
		} else {
			// login error
			yield put(ReportSVApiActions.logoutError(response.Status, "LOGIN ERROR"));
		}
	} else {
		// communication error
		yield put(ReportSVApiActions.logoutError("999", error.message));
	}
}

function* handleLogoutRequest() {
	/*
	while(true) {
		const action = yield take(LOGOUT_REQUEST);
		yield fork(logoutRequest, action);
	}
	*/
	yield takeEvery(ReportSVApiActions.LOGOUT_REQUEST, logoutRequest);
}

//-----------------------------------------------------------------------------
//	Report Request
//-----------------------------------------------------------------------------
function* reportUpdateRequest(action) {
	const {response, error} = yield call(API.sendFormAsync, action.form);
	console.log(response);
	if (response && !error) {
		if(response.Status === "0") {
			yield put(reportUpdateSuccess(response));
		} else {
			// login error
			yield put(reportUpdateError(response.Status, "REPORT_UPDATE ERROR"));
		}
	} else {
		// communication error
		yield put(reportUpdateError("999", error.message));
	}
}

function* handleReportUpdateRequest() {
	yield takeEvery(REPORT_UPDATE_REQUEST, reportUpdateRequest);
}

//-----------------------------------------------------------------------------
//	SearchKokyakuIssue Request
//-----------------------------------------------------------------------------
function* searchKokyakuIssueRequest(action) {
	const {response, error} = yield call(API.searchKokyakuIssueAsync, action.apiKey, action.kokyakuRegistN, action.issueCode, action.marketCode);
	console.log(response);
	if (response && !error) {
		if(response.Status === "0") {
			yield put(ReportSVApiActions.searchKokyakuIssueSuccess(response));
		} else {
			// neworder error
			yield put(ReportSVApiActions.searchKokyakuIssueError(response.Status, response.errorMessage, response));
		}
	} else {
		// communication error
		yield put(ReportSVApiActions.searchKokyakuIssueError("999", error.message));
	}
}

function* handleSearchKokyakuIssueRequest() {
	yield takeEvery(ReportSVApiActions.SEARCH_KOKYAKU_ISSUE_REQUEST, searchKokyakuIssueRequest);
}

//-----------------------------------------------------------------------------
//	NewOrder Request
//-----------------------------------------------------------------------------
function* newOrderRequest(action) {
	const {response, error} = yield call(API.kabuNewOrderAsync, action.apiKey, action.order);
	console.log(response);
	if (response && !error) {
		if(response.Status === "0") {
			yield put(ReportSVApiActions.kabuNewOrderSuccess(response));
		} else {
			// neworder error
			yield put(ReportSVApiActions.kabuNewOrderError(response.Status, response.errorMessage));
		}
	} else {
		// communication error
		yield put(ReportSVApiActions.kabuNewOrderError("999", error.message));
	}
}

function* handleKabuNewOrderRequest() {
	yield takeEvery(ReportSVApiActions.KABU_NEW_ORDER_REQUEST, newOrderRequest);
}

//-----------------------------------------------------------------------------
//	NewOrderCheck Request
//-----------------------------------------------------------------------------
function* newOrderCheckRequest(action) {
	const {response, error} = yield call(API.kabuNewOrderAsync, action.apiKey, action.order, true);
	console.log(response);
	if (response && !error) {
		if(response.Status === "0") {
			yield put(ReportSVApiActions.kabuNewOrderCheckSuccess(response));
		} else {
			// neworder error
			yield put(ReportSVApiActions.kabuNewOrderCheckError(response.Status, response.errorMessage));
		}
	} else {
		// communication error
		yield put(ReportSVApiActions.kabuNewOrderCheckError("999", error.errorMessage));
	}
}

function* handleKabuNewOrderCheckRequest() {
	yield takeEvery(ReportSVApiActions.KABU_NEW_ORDER_CHECK_REQUEST, newOrderCheckRequest);
}

//-----------------------------------------------------------------------------
//	GetKabuOrderList Request
//-----------------------------------------------------------------------------
function* getKabuOrderListRequest(action) {
	const {response, error} = yield call(API.getKabuOrderListAsync, action.apiKey);
	console.log(response);
	if (response && !error) {
		if(response.Status === "0") {
			yield put(ReportSVApiActions.getKabuOrderListSuccess(response));
		} else {
			// neworder error
			yield put(ReportSVApiActions.getKabuOrderListError(response.Status, response.errorMessage));
		}
	} else {
		// communication error
		yield put(ReportSVApiActions.getKabuOrderListError("999", error.message));
	}
}

function* handleGetKabuOrderListRequest() {
	yield takeEvery(ReportSVApiActions.KABU_ORDER_LIST_REQUEST, getKabuOrderListRequest);
}

//-----------------------------------------------------------------------------
//	GetKanougakuSuii Request
//-----------------------------------------------------------------------------
function* getKanougakuSuiiRequest(action) {
	const {response, error} = yield call(API.getKanougakuSuiiAsync, action.apiKey, action.kokyakuRegistN);
	console.log(response);
	if (response && !error) {
		if(response.Status === "0") {
			yield put(ReportSVApiActions.getKanougakuSuiiSuccess(response));
		} else {
			// neworder error
			yield put(ReportSVApiActions.getKanougakuSuiiError(response.Status, response.errorMessage));
		}
	} else {
		// communication error
		yield put(ReportSVApiActions.getKanougakuSuiiError("999", error.message));
	}
}

function* handleGetKanougakuSuiiRequest() {
	yield takeEvery(ReportSVApiActions.KANOUGAKU_SUII_REQUEST, getKanougakuSuiiRequest);
}

//-----------------------------------------------------------------------------
//	rootSaga
//-----------------------------------------------------------------------------
export default function* rootSaga() {
	yield fork(handleLoginRequest);
	yield fork(handleLogoutRequest);
	yield fork(handleReportUpdateRequest);
	yield fork(handleSearchKokyakuIssueRequest);
	yield fork(handleKabuNewOrderRequest);
	yield fork(handleKabuNewOrderCheckRequest);
	yield fork(handleGetKabuOrderListRequest);
	yield fork(handleGetKanougakuSuiiRequest);
}