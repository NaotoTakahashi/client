
import * as OrderListActions from "../actions/OrderListActions";
import {NAME} from "../reducers/OrderListReducer";
import {RcApi} from "./MainMiddleware";

export default store => next => action => {
	const state = store.getState()[NAME];
	/*if(action.type === OrderListActions.GET_ORDER_LIST) {
		RcApi.callback.onReceiveOpenAck("");
	}*/
	next(action);
}