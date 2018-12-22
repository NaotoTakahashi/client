import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import {submitOrder} from '../reducers/MIOSReducer';	// import action
//import {Order, OrderList} from '../components/MIOSComponent';
import * as OrderActions from '../actions/OrderActions';
import * as FullBoardActions from '../actions/FullBoardActions';
import * as AssetActions from '../actions/AssetActions';
import * as FrameActions from '../actions/FrameActions';
import {getState} from "../reducers/OrderReducer";
import Order, {InputUpDown} from '../components/OrderComponent';
import {RcApi} from "../middlewares/MainMiddleware";
import FullBoard from "../containers/FullBoardContainer";
import OrderList from "../containers/OrderListContainer";
import Asset from "../containers/AssetContainer";
import register from "./ContainerRegister";

// InputQuantityContainer, InputPriceContainer
//   ＋ボタン押下時、－ボタン押下時、テキストフォーカスが外れた時にdispatchを発行する
const MAX_DECIMAL = 4;
export class InputQuantityContainer extends React.Component {
	static propsTypes = {
		className: PropTypes.string,
		value: PropTypes.any.isRequired,
		disabled: PropTypes.bool,
		interval: PropTypes.number,
		dispatch: PropTypes.func,
		inputRef: PropTypes.func,
	}
	constructor() {
		super();
		this.inputRef = null;
	}
	render() {
		return(
			<InputUpDown
				className={this.props.className}
				value={this.props.value}
				disabled={this.props.disabled}
				onFocus={this.onFocus}
				onBlur={this.onBlur}
				onPlusClick={this.onPlusClick}
				onMinusClick={this.onMinusClick}
				inputRef={(input) => this.inputRef = input}
			/>
		)
	}

	setRef = (input) => {
		this.inputRef = input;
		if(this.props.inputRef) {
			this.props.inputRef(input);
		}
	}
	
	onPlusClick = (e) => {
		const num = (this.inputRef.value === "")? 0 : parseFloat(this.inputRef.value);
		const nextVal = this.calc(num, this.props.interval, true);
		this.inputRef.value = nextVal;
		if(this.props.dispatch) {
			this.props.dispatch(nextVal);
		}
	}
	onMinusClick = (e) => {
		const num = (this.inputRef.value === "")? 0 : parseFloat(this.inputRef.value);
		const nextVal = this.calc(num, this.props.interval, false);
		this.inputRef.value = nextVal;
		if(this.props.dispatch) {
			this.props.dispatch(nextVal);
		}
	}
	onBlur = (e) => {
		if(isNaN(this.inputRef.value)) {
			this.inputRef.value = this.props.value > 0 ? String(this.props.value) : "";
			return;
		}
		const num = (this.inputRef.value === "")? 0 : parseFloat(this.inputRef.value);
		if(this.props.dispatch) {
			this.props.dispatch(num);
		}
	}
	calc = (val, interval, plus) => {
		if(!interval) return val;
		const adjustVal = Math.pow(10, MAX_DECIMAL);
		const calcValue = val * adjustVal;
		const calcInterval = interval * adjustVal;
		let value = interval;
		if(plus) {
			value = calcValue + calcInterval;
		} else {
			value = calcValue - calcInterval;
			if(value <= 0) {
				return interval;
			}
		}
		return Math.round(value) / adjustVal;
	}
}

export class InputPriceContainer extends InputQuantityContainer {
	static propsTypes = {
		...InputQuantityContainer.propsTypes,
		yobineTaniNumber: PropTypes.string,
		defaultPrice: PropTypes.number,
	}

	onPlusClick = (e) => {
		let nextNum;
		if(this.inputRef.value === "" && this.props.defaultPrice) {
			nextNum = this.props.defaultPrice;
		} else {
			const num = (this.inputRef.value === "")? 0 : parseFloat(this.inputRef.value);
			const priceDec = RcApi.getUpTick(this.props.yobineTaniNumber, num, 1);
			nextNum = priceDec.price;
		}
		this.inputRef.value = nextNum;
		if(this.props.dispatch) {
			this.props.dispatch(nextNum);
		}
	}
	onMinusClick = (e) => {
		let nextNum;
		if(this.inputRef.value === "" && this.props.defaultPrice) {
			nextNum = this.props.defaultPrice;
		} else {
			const num = (this.inputRef.value === "")? 0 : parseFloat(this.inputRef.value);
			const priceDec = RcApi.getDownTick(this.props.yobineTaniNumber, num, 1);
			nextNum = priceDec.price;
		}
		this.inputRef.value = nextNum;
		if(this.props.dispatch) {
			this.props.dispatch(nextNum);
		}
	}
}

class OrderContainer extends React.Component{
	static containerId = "Order";
	render() {
		return(
			<Order
				{...this.props.order.toJS()}
				{...this.props.dispatch}
			/>
		)
	}
}

/* Connect to Redux */
function mapStateToProps(state, ownProps) {
	return {
		order: getState(state),
	}
}
function mapDispatchToProps(dispatch, ownProps) {
	return {
		dispatch: {
			onChangeKokyaku(kokyakuRegistN) {
				dispatch(OrderActions.changeKokyaku(kokyakuRegistN));
			},
			onChangeIssueMarket(issueCode, marketCode) {
				dispatch(OrderActions.changeIssueMarket(issueCode, marketCode));
			},
			/*
			onSearchKokyakuIssue(kokyakuRegistN, issueCode, marketCode) {
				dispatch(OrderActions.searchKokyakuIssue("NEW_ORDER", kokyakuRegistN, issueCode, marketCode));
			},
			*/
			onClickKokyakuList(kokyakuRegistN) {

			},
			onClickFullBoard(issueCode, marketCode) {
				dispatch(FullBoardActions.changeIssueMarket(issueCode, marketCode, 0, 0, 0));
				dispatch(FrameActions.createFrame("FULL_BOARD", "フル板", FullBoard, 550, 680, false));
			},
			onClickClearKokyaku() {
				dispatch(OrderActions.clickClearKokyaku());
			},
			onClickKanougakuSuii(kokyakuRegistN) {
				dispatch(AssetActions.getKanougakuSuii(kokyakuRegistN));
				dispatch(FrameActions.createFrame("KANOUGAKU_SUII", "可能額推移", Asset, 819, 790, true));
			},
			onClickOrderList(kokyakuRegistN) {
				dispatch(FrameActions.createFrame("ORDER_LIST", "注文一覧", OrderList, 1644, 700, true));
				//dispatch(setFilter("registNumer", kokyakuRegistN));
			},
			onClickClearIssue() {
				dispatch(OrderActions.clickClearIssue());
			},
			inputOrderDispatch: {
				onChangeTorihiki(genkinSinyouKubun, baibaikubun) {
					dispatch(OrderActions.changeTorihiki(genkinSinyouKubun, baibaikubun));
				},
				onChangeOrderMethod(orderMethod) {
					dispatch(OrderActions.changeGyakusasiOrderType(orderMethod));
				},
				onChangeCheckLot(checkLot) {
					dispatch(OrderActions.changeCheckLot(checkLot));
				},
				onChangeOrderSuryou(orderSuryou) {
					dispatch(OrderActions.changeOrderSuryou(orderSuryou));
				},
				onChangeOrderPriceKubun(orderPriceKubun) {
					dispatch(OrderActions.changeOrderPriceKubun(orderPriceKubun));
				},
				onChangeOrderPrice(orderPrice) {
					dispatch(OrderActions.changeOrderPrice(orderPrice));
				},
				onChangeGyakusasiZyouken(gyakusasiZyoukenPrice) {
					dispatch(OrderActions.changeGyakusasiZyouken(gyakusasiZyoukenPrice));
				},
				onChangeGyakusasiOrderPriceKubun(gyakusasiOrderPriceKubun) {
					dispatch(OrderActions.changeGyakusasiOrderPriceKubun(gyakusasiOrderPriceKubun));
				},
				onChangeGyakusasiOrderPrice(gyakusasiOrderPrice) {
					dispatch(OrderActions.changeGyakusasiOrderPrice(gyakusasiOrderPrice));
				},
				onChangeCondition(condition) {
					dispatch(OrderActions.changeCondition(condition));
				},
				onChangeOrderExpireDay(orderExpireDay) {
					dispatch(OrderActions.changeOrderExpireDay(orderExpireDay));
				},
				onChangeAccount(account) {
					dispatch(OrderActions.changeZyoutoekiKazeiC(account));
				},
				onChangeAzukari(azukari) {
					dispatch(OrderActions.changeAzukari(azukari));
				},
				onChangeSyouti(syouti) {
					dispatch(OrderActions.changeSyouti(syouti));
				},
			},
			onToInput(resetFlg) {
				dispatch(OrderActions.toInput(resetFlg));
			},
			onToConfirm(order) {
				dispatch(OrderActions.toConfirm(order));
			},
			onToComplete(order) {
				dispatch(OrderActions.toComplete(order));
			},
			/*
			setOrderPrice(price) {
				dispatch(NewOrderFunc.setPrice(price));
			},
			setOrderQuantity(quantity) {
				dispatch(NewOrderFunc.setQuantity(quantity));
			},
			*/
		}
	};
}

const connectedContainer =  connect(
	mapStateToProps,
	mapDispatchToProps
)(OrderContainer);

register.regist(OrderContainer.containerId, connectedContainer);

export default connectedContainer;


