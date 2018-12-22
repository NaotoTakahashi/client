
//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const LOGIN = Symbol('LOGIN_REQUEST');
export const LOADING = Symbol('LOADING');
export const LOGOUT = Symbol('LOGOUT_REQUEST');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export const login = (loginId, password) => {
	return {
		type: LOGIN,
		loginId: loginId,
		password: password,
	}
}

export function loading(){
	return {
		type: LOADING,
	}
}

export function logout(apiKey){
	return {
		type: LOGOUT,
		apiKey: apiKey,
	}
}
