import {encodeForm} from '../Utility';
import {APSVUrl} from '../Conf';
import fetchWrapper from './fetchWrapper';
let ReportSVApi = {};

//-----------------------------------------------------------------------------
//	Request Function
//-----------------------------------------------------------------------------
export const login = (loginId, password) => {
	const request = { MsgType: "LOGIN", userId: loginId, password: password };
	let xhr = new XMLHttpRequest();
	//xhr.withCredentials = true;
	xhr.open("POST", APSVUrl + "/report/Login", false);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(encodeForm(request));
	return JSON.parse(xhr.responseText);
}
ReportSVApi.login = login;

export function loginAsync(loginId, password) {
	const url = APSVUrl + "/report/Login";
	const request = { MsgType: "LOGIN", userId: loginId, password: password };
	const headers = new Headers();
	headers.append("Content-Type", "application/x-www-form-urlencoded");
	const options = {
		method: "POST",
		headers: headers,
		body: encodeForm(request),
	}
	return fetchWrapper(url, options)
	.then(body => ({ response: body }))
	.catch(error => ({ error: error }));
}
ReportSVApi.loginAsync = loginAsync;

export const logout = (apiKey, setting) => {
	const url = APSVUrl + "/report/Logout";
	const formData = new FormData();
	formData.append("MsgType", "LOGOUT");
	formData.append("ApiKey", apiKey);
	const blob = new Blob([setting], {type:"application/json"});
	formData.append("Setting", blob);
	//const request = { MsgType: "LOGOUT", ApiKey: apiKey };
	let xhr = new XMLHttpRequest();
	//xhr.withCredentials = true;
	xhr.open("POST", url, false);
	//xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	//xhr.send(encodeForm(request));
	xhr.send(formData);
	return JSON.parse(xhr.responseText);
}
ReportSVApi.logout = logout;

export const logoutAsync = (apiKey, setting) => {
	const url = APSVUrl + "/report/Logout";
	const formData = new FormData();
	formData.append("MsgType", "LOGOUT");
	formData.append("ApiKey", apiKey);
	const blob = new Blob([setting], {type:"application/json"});
	formData.append("Setting", blob);
	const options = {
		method: "POST",
		body: formData,
	}
	/*
	const request = { MsgType: "LOGOUT", ApiKey: apiKey };
	const headers = new Headers();
	headers.append("Content-Type", "application/x-www-form-urlencoded");
	const options = {
		method: "POST",
		headers: headers,
		body: encodeForm(request),
	}
	*/
	return fetchWrapper(url, options)
	.then(body => ({ response: body }))
	.catch(error => ({ error: error }));
}
ReportSVApi.logoutAsync = logoutAsync;

export const saveSetting = (apiKey, setting) => {
	const request = { MsgType: "SAVE_SETTING", ApiKey: apiKey, setting: setting };
	let xhr = new XMLHttpRequest();
	//xhr.withCredentials = true;
	xhr.open("POST", APSVUrl + "/report/SaveSetting", false);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(encodeForm(request));
	return JSON.parse(xhr.responseText);
}
ReportSVApi.saveSetting = saveSetting;

export const saveSettingAsync = (apiKey, setting) => {
	const url = APSVUrl + "/report/SaveSetting";
	const request = { MsgType: "SAVE_SETTING", ApiKey: apiKey, setting: setting };
	const headers = new Headers();
	headers.append("Content-Type", "application/x-www-form-urlencoded");
	const options = {
		method: "POST",
		headers: headers,
		body: encodeForm(request),
	}
	return fetchWrapper(url, options)
	.then(body => ({ response: body }))
	.catch(error => ({ error: error }));
}
ReportSVApi.saveSettingAsync = saveSettingAsync;

export const sendForm = (form) => {
	let formData = new FormData(form);
	let xhr = new XMLHttpRequest();
	xhr.open(form.method, form.action, false);
	xhr.send(formData);
	let contentType = xhr.getResponseHeader("Content-Type");
	if( contentType.match(/json/) ) {
		let response = JSON.parse(xhr.responseText);
		if(response.Status !== "0") {
			return false;
		} else {
			return true;
		}
	}
}
ReportSVApi.sendForm = sendForm;

export const sendFormAsync = (form) => {
	const url = form.action;
	const options = {
		method: form.method,
		body: new FormData(form),
	}
	return fetchWrapper(url, options)
	.then(body => ({ response: body }))
	.catch(error => ({ error: error }));
}
ReportSVApi.sendFormAsync = sendFormAsync;

//-----------------------------------------------------------------------------
//	Search Kokyaku Issue
//-----------------------------------------------------------------------------
export const searchKokyakuIssue = (apiKey, kokyakuRegistN, issueCode, marketCode) => {
	const request = {
		MsgType: "SEARCH_KOKYAKU_ISSUE",
		ApiKey: apiKey,
		kokyakuRegistN: kokyakuRegistN,
		issueCode: issueCode,
		sizyouC: marketCode,
	};
	let xhr = new XMLHttpRequest();
	//xhr.withCredentials = true;
	xhr.open("POST", APSVUrl + "/report/kokyakuIssue/get", false);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(encodeForm(request));
	return JSON.parse(xhr.responseText);
}
ReportSVApi.searchKokyakuIssue = searchKokyakuIssue;

export const searchKokyakuIssueAsync = (apiKey, kokyakuRegistN, issueCode, marketCode) => {
	const url = APSVUrl + "/report/kokyakuIssue/get";
	const request = {
		MsgType: "SEARCH_KOKYAKU_ISSUE",
		ApiKey: apiKey,
		kokyakuRegistN: kokyakuRegistN,
		issueCode: issueCode,
		sizyouC: marketCode,
	};
	const headers = new Headers();
	headers.append("Content-Type", "application/x-www-form-urlencoded");
	const options = {
		method: "POST",
		headers: headers,
		body: encodeForm(request),
	}
	return fetchWrapper(url, options)
	.then(body => ({ response: body }))
	.catch(error => ({ error: error }));
}
ReportSVApi.searchKokyakuIssueAsync = searchKokyakuIssueAsync;

//-----------------------------------------------------------------------------
//	New Order
//-----------------------------------------------------------------------------
export const kabuNewOrder = (apiKey, order, checkOnly=false) => {
	const request = {
		MsgType: "KABU_NEW_ORDER",
		ApiKey: apiKey,
		kokyakuRegistN: order.kokyakuRegistN,
		issueCode: order.issueCode,
		sizyouC: order.marketCode,
		teiseiTorikesiFlg: order.teiseiTorikesiFlg,
		genkinSinyouKubun: order.genkinSinyouKubun,
		baibaiKubun: order.baibaiKubun,
		gyakusasiOrderType: order.gyakusasiOrderType,
		orderSuryou: order.orderSuryou,
		orderPriceKubun: order.orderPriceKubun,
		orderPrice: order.orderPrice,
		checkLot: order.checkLot,
		condition: order.condition,
		orderExpireDay: order.orderExpireDay,
		zyoutoekiKazeiC: order.zyoutoekiKazeiC,
		gyakusasiZyouken: order.gyakusasiZyouken,
		gyakusasiOrderPriceKubun: order.gyakusasiOrderPriceKubun,
		gyakusasiOrderPrice: order.gyakusasiOrderPrice,
		syouti: (order.syouti? "2" : "1"),
		checkOnly: (checkOnly? "1" : "0"),
		timeStamp: Date.now(),
	};
	let xhr = new XMLHttpRequest();
	//xhr.withCredentials = true;
	xhr.open("POST", APSVUrl + "/report/kabuNewOrder", false);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(encodeForm(request));
	return JSON.parse(xhr.responseText);
}
ReportSVApi.kabuNewOrder = kabuNewOrder;

export const kabuNewOrderAsync = (apiKey, order, checkOnly=false) => {
	const url = APSVUrl + "/report/kabuNewOrder";
	const request = {
		MsgType: "KABU_NEW_ORDER",
		ApiKey: apiKey,
		kokyakuRegistN: order.kokyakuRegistN,
		issueCode: order.issueCode,
		sizyouC: order.marketCode,
		teiseiTorikesiFlg: order.teiseiTorikesiFlg,
		genkinSinyouKubun: order.genkinSinyouKubun,
		baibaiKubun: order.baibaiKubun,
		gyakusasiOrderType: order.gyakusasiOrderType,
		orderSuryou: order.orderSuryou,
		orderPriceKubun: order.orderPriceKubun,
		orderPrice: order.orderPrice,
		checkLot: order.checkLot,
		condition: order.condition,
		orderExpireDay: order.orderExpireDay,
		zyoutoekiKazeiC: order.zyoutoekiKazeiC,
		gyakusasiZyouken: order.gyakusasiZyouken,
		gyakusasiPriceKubun: order.gyakusasiPriceKubun,
		gyakusasiOrderPrice: order.gyakusasiOrderPrice,
		syouti: (order.syouti? "2" : "1"),
		checkOnly: (checkOnly? "1" : "0"),
		timeStamp: Date.now(),
	};
	const headers = new Headers();
	headers.append("Content-Type", "application/x-www-form-urlencoded");
	const options = {
		method: "POST",
		headers: headers,
		body: encodeForm(request),
	}
	return fetchWrapper(url, options)
	.then(body => ({ response: body }))
	.catch(error => ({ error: error }));
}
ReportSVApi.kabuNewOrderAsync = kabuNewOrderAsync;

export const getKabuOrderList = (apiKey) => {
	const request = {
		MsgType: "KABU_ORDER_LIST",
		ApiKey: apiKey,
	};
	let xhr = new XMLHttpRequest();
	//xhr.withCredentials = true;
	xhr.open("POST", APSVUrl + "/report/kabuOrderList/get", false);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(encodeForm(request));
	return JSON.parse(xhr.responseText);
}
ReportSVApi.getKabuOrderList = getKabuOrderList;

export const getKabuOrderListAsync = (apiKey) => {
	const url = APSVUrl + "/report/kabuOrderList/get";
	const request = {
		MsgType: "KABU_ORDER_LIST",
		ApiKey: apiKey,
	};
	const headers = new Headers();
	headers.append("Content-Type", "application/x-www-form-urlencoded");
	const options = {
		method: "POST",
		headers: headers,
		body: encodeForm(request),
	}
	return fetchWrapper(url, options)
	.then(body => ({ response: body }))
	.catch(error => ({ error: error }));
}
ReportSVApi.getKabuOrderListAsync = getKabuOrderListAsync;

export const getKanougakuSuii = (apiKey, kokyakuRegistN) => {
	const request = {
		MsgType: "KANOUGAKU_SUII",
		ApiKey: apiKey,
		kokyakuRegistN: kokyakuRegistN,
	};
	let xhr = new XMLHttpRequest();
	//xhr.withCredentials = true;
	xhr.open("POST", APSVUrl + "/report/kanougakuSuii/get", false);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(encodeForm(request));
	return JSON.parse(xhr.responseText);
}
ReportSVApi.getKanougakuSuii = getKanougakuSuii;

export const getKanougakuSuiiAsync = (apiKey, kokyakuRegistN) => {
	const url = APSVUrl + "/report/kanougakuSuii/get";
	const request = {
		MsgType: "KANOUGAKU_SUII",
		ApiKey: apiKey,
		kokyakuRegistN: kokyakuRegistN,
	};
	const headers = new Headers();
	headers.append("Content-Type", "application/x-www-form-urlencoded");
	const options = {
		method: "POST",
		headers: headers,
		body: encodeForm(request),
	}
	return fetchWrapper(url, options)
	.then(body => ({ response: body }))
	.catch(error => ({ error: error }));
}
ReportSVApi.getKanougakuSuiiAsync = getKanougakuSuiiAsync;

export default ReportSVApi;