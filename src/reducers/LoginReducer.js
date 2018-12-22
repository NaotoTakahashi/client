import {Map} from 'immutable';
import * as LoginActions from "../actions/LoginActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";

export const NAME = 'LOGIN';
//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
export const getLoginState = (state) => {
	return state[NAME];
}
export const getApiKey = (state) => {
	return state[NAME].get("apiKey");
}
export const getEmployeeId = (state) => {
	return state[NAME].get("employeeId");
}

//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const initialState = Map({
		statePath: [],
		status: "1",	// -1: failed, 0:success, 1:until, 2:in inquiry
		errorCode: "",
		message: "",
		apiKey: "",
		companyCode: "",
		companyName: "",
		officeCode: "",
		officeName: "",
		deptCode: "",
		deptName: "",
		employeeId: "",
		employeeName: "",
		salesCode: "",
		titleCode: "",
		titleName: "",
	})

export const loginReducer = (state = initialState, action) => {
	switch (action.type) {
		case LoginActions.LOADING:
			return state.withMutations(s =>
				s.set('status', "2")
			);
		case ReportSVApiActions.LOGIN_SUCCESS:
			const response = action.response;
			return state.withMutations(s =>
				s.set('status', response.Status)
				//.set('message', response.MsgType)
				.set('apiKey', response.ApiKey)
				.set('companyCode', response.CompanyCode)
				.set('companyName', response.CompanyName)
				.set('officeCode', response.OfficeCode)
				.set('officeName', response.OfficeName)
				.set('deptCode', response.DeptCode)
				.set('deptName', response.DeptName)
				.set('employeeId', response.EmployeeId)
				.set('employeeName', response.EmployeeName)
				.set('titleCode', response.TitleCode)
				.set('titleName', response.TitleName)
			);
		case ReportSVApiActions.LOGIN_ERROR:
			return state.withMutations(s =>
				s.set('status', "-1")
				 .set('errorCode', action.errorCode)
				 .set('message', action.message)
			);
		case ReportSVApiActions.LOGOUT_SUCCESS:
			return state.withMutations(s =>
				s.set('status', "1")
				.set('message', "")
				.set('apiKey', "")
				.set('companyCode', "")
				.set('companyName', "")
				.set('officeCode', "")
				.set('officeName', "")
				.set('deptCode', "")
				.set('deptName', "")
				.set('employeeId', "")
				.set('employeeName', "")
				.set('titleCode', "")
				.set('titleName', "")
			);
		case ReportSVApiActions.LOGOUT_ERROR:
			return state.withMutations(s =>
				s.set('status', "-1")
				.set('message', "LOGOUT ERROR")
			);
		default:
			return state;
	}
}

export default loginReducer;