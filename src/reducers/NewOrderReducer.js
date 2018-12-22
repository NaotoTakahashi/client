import {Map} from 'immutable';

export const NAME = 'NEW_ORDER';


//-----------------------------------------------------------------------------
//	Action
//-----------------------------------------------------------------------------
export const CHANGE_ISSUE_CODE	= Symbol('CHANGE_ISSUE_CODE');
export const SET_MARKET			= Symbol('SET_MARKET');
export const SET_BAIBAIKUBUN	= Symbol('SET_BAIBAIKUBUN');
export const SET_CONDITION		= Symbol('SET_CONDITION');
export const SET_PRICE_KUBUN	= Symbol('SET_PRICE_KUBUN');
export const SET_PRICE			= Symbol('SET_PRICE');
export const SET_QUANTITY		= Symbol('SET_QUANTITY');
export const SET_EXPIRE_DAY		= Symbol('SET_EXPIRE_DAY');
export const SUBMIT_ORDER		= Symbol('SUBMIT_ORDER');

//-----------------------------------------------------------------------------
//	Action Creator
//-----------------------------------------------------------------------------
export function submitNewOrder(issueCode, lot, price) {
	return {
		type: SUBMIT_ORDER,
		issueCode: issueCode,
		lot: lot,
		price: price,
	}
}

export function setMarket(marketCode) {
	return {
		type: SET_MARKET,
		marketCode: marketCode,
	}
}

export function setBaibaiKubun(baiabiKubun) {
	return {
		type: SET_BAIBAIKUBUN,
		baiabiKubun: baiabiKubun,
	}
}

export function setCondition(condition) {
	return {
		type: SET_CONDITION,
		condition: condition,
	}
}

export function setPrice(price) {
	return {
		type: SET_PRICE,
		price: price,
	}
}

export function setQuantity(quantity) {
	return {
		type: SET_QUANTITY,
		quantity: quantity,
	}
}

export function setExpireDay(expireDay) {
	return {
		type: SET_EXPIRE_DAY,
		expireDay: expireDay,
	}
}

export function submitOrder() {
	return {
		type: SUBMIT_ORDER,
	}
}
//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const OrderState = Map({
	orderNumber: "",
	issueCode: "",
	market: "01",			// 東証:01, 名証:, 福証:, 札証:
	baiabiKubun: "3",		// sell:1, buy:3
	sikkouZyouken: "0",		// なし:0, 2:寄付, 4:引け, 6:不成
	orderPriceKubun: "1",	// 成行:1, 指値:2
	orderPrice: 0,
	orderSuryou: 0,
	orderExpireDay: 0,
})

const initialState = Map({
	order: Map({
		issueCode: "",
		status: ""
	}),
	orderList: Map({}),
	socket: '',
})

const miosReducer = (state = initialState, action) => {
	switch (action.type) {
		case SUBMIT_ORDER:
			return state.withMutations( s => {
				let orderNumber = s.get('orderList').count() + 1;
				let order = OrderState.set('orderNumber', orderNumber)
					.set('issueCode', action.issueCode)
					.set('lot', action.lot)
					.set('price', action.price);
				s.setIn(['orderList', orderNumber], order);
			});
		default:
			return state;
	}
}

export default miosReducer;