import {Map, Record} from 'immutable';
import * as OrderActions from "../actions/OrderActions";
import * as FullBoardActions from "../actions/FullBoardActions";
import * as ReportSVApiActions from "../actions/ReportSVApiActions";
export const NAME = 'ORDER';

//-----------------------------------------------------------------------------
//	State
//-----------------------------------------------------------------------------

const kokyakuState = Record({
	kokyakuRegistN: "",
	kokyakuNameKanzi: "",
	salesDeptName: "本店営業部",
	salesPersonName: "",
	kaiKanougaku: 0,
	tateKanougaku: 0,
	nisaKanougaku: 0,
	sinyouKouzaKubun: "0",
	hikazeiKouzaKubun: "0",
})
// 取引所規制
const exchangeRegulationState = Map({})
// 日証金規制
const jsfRegulationState = Map({})
// 当社規制
const companyRegulationState = Map({})
// その他規制
const otherRegulationState = Map({})

const regulationState = Record({
	exchange: exchangeRegulationState,
	jsf: jsfRegulationState,
	company: companyRegulationState,
	other: otherRegulationState,
})

const issueState = Record({
	issueCode: "",
	marketCode: "",
	issueName: "",
	yobineTaniNumber: 0,
	unitLot: 0,						// 単位株
	loanType: "",					// 貸借区分 "1":貸借, "2":制度信用, "3":一般信用
	maxPrice: 0,					// 上限値
	minPrice: 0,					// 下限値
	"DPP": "",						// 日通し現値・価格
	"DPP:T": "",					// 日通し現値・価格：時刻
	"DYWP": "",						// 日通し前日比・騰落幅(価格)
	"DYRP": "",						// 日通し前日比・騰落率(価格)
	"CLOD": "",						// 決算期日
	"DPG": "0000",					// 日通し現値前値比較 "0057":+, "0058":-
	"LISS": "",						// 所属部区分
	//"DSPH": "",						// 当日基準値・上限値
	//"DSPL": "",						// 当日基準値・下限値
	regulation: regulationState(),
})

const positionState = Record({
	positionNum: null,
	orderNum: null,
	averagePrice: null,
})

const positionListState = Record({
	equityTokutei: positionState(),
	equityIppan: positionState(),
	equityNISA: positionState(),
	marginBuy: positionState(),
	marginSell: positionState(),
})

const orderState = Record({
	orderNumber: null,				// 注文番号
	teiseiTorikesiFlg: "1",			// "1":新規, "2":訂正, "3":取消, "4":新規(即時), "5":訂正(即時), "6":取消(即時)
	genkinSinyouKubun: "0",			// 取引種別 "0":現物, "2":制度信用, "4":制度返済, "6":一般信用, "8":一般返済
	baibaiKubun: "",				// 売買区分 "1":売, "3":買, "5":現渡, "7";現引
	gyakusasiOrderType: "0",		// 注文方法 "0":通常, "1":逆指値, "2":通常+逆指値, "3": 時間指定
	orderSuryou: 0,					// 注文数量
	orderPriceKubun: "1",			// 注文値段区分 "1":成行, "2":指値
	orderPrice: 0,					// 注文値段
	checkLot: 1,					// 数量チェック
	condition: "0",					// 執行条件 "0":指定なし, "2":寄付, "4": 引け, "6":不成
	orderExpireDay: 0,				// 注文期限: 0:当日中, 0以外:期限日
	zyoutoekiKazeiC: "1",			// 口座種別: "1":特定, "3":一般, "5":NISA, "7":非課税, "9":法人
	gyakusasiZyouken: 0,			// 逆指値条件値段
	gyakusasiPriceKubun: "1",		// 逆指値注文値段区分 1:成行, 2:指値
	gyakusasiOrderPrice: 0,			// 逆指値注文値段
	azukari: "1",					// 預り 1:保護, 9:代用
	syouti: false,					// 承知
	orderUkewatasiKingaku: 0,		// 注文受渡金額（出力）
	orderTesuryou: 0,				// 注文手数料（出力）
	orderSyouhizei: 0,				// 注文消費税（出力）
	orderDate: 0,					// 注文日時（出力）
})

const initialStateRec = Record({
	phase: 1,				// 1:入力画面, 2:確認画面, 3:完了画面
	kokyaku: kokyakuState(),
	issue: issueState(),
	positionList: positionListState(),
	order: orderState(),
	errorCode: "",
	message: "",
	orderEnabled: false,
});

const initialState = initialStateRec();

//-----------------------------------------------------------------------------
//	Selector
//-----------------------------------------------------------------------------
export const getState = (state) => state[NAME];
export const getKokyakuState = (state) => state[NAME].get("kokyaku");
export const getIssueState = (state) => state[NAME].get("issue");
export const getOrderState = (state) => state[NAME].get("order");
export const getUnitLot = (state) => state[NAME].getIn(["issue", "unitLot"]);
export const getStateForSetting = (state) => {
	const myState = getState(state);
	return Map({
		kokyaku: Map({
			kokyakuRegistN: myState.getIn(["kokyaku", "kokyakuRegistN"])
		}),
		issue: Map({
			issueCode: myState.getIn(["issue", "issueCode"]),
			marketCode: myState.getIn(["issue", "marketCode"]),
		}),
	})
}
//-----------------------------------------------------------------------------
//	Reducer
//-----------------------------------------------------------------------------
const orderReducer = (state = initialState, action) => {
	switch (action.type) {
		case OrderActions.CHANGE_KOKYAKU:
			return state.withMutations( s => {
				s.setIn(["kokyaku", "kokyakuRegistN"], action.kokyakuRegistN)
				 .set("order", orderState())
				 .set("orderEnabled", false);
				resetError(s);
			});
		case OrderActions.CHANGE_ISSUE_MARKET:
			return state.withMutations( s => {
				s.setIn(["issue", "issueCode"], action.issueCode)
				 .setIn(["issue", "marketCode"], action.marketCode)
				 .set("order", orderState())
				 .set("orderEnabled", false);
				resetError(s);
			});
		/*
		case OrderActions.SEARCH_KOKYAKU_ISSUE:
			return state.withMutations( s => {
				s.setIn(["kokyaku", "kokyakuRegistN"], action.kokyakuRegistN)
				 .setIn(["issue", "issueCode"], action.issueCode)
				 .setIn(["issue", "marketCode"], action.marketCode)
				 .set("order", orderState())
				 .set("orderEnabled", false);
				resetError(s);
			});
		case OrderActions.CLICK_CLEAR_KOKYAKU:
			return state.withMutations( s => {
				s.set("kokyaku", kokyakuState())
				.set("positionList", positionListState());
			});
		case OrderActions.CLICK_CLEAR_ISSUE:
			return state.withMutations( s => {
				s.set("issue", issueState())
				.set("positionList", positionListState());
			});
		*/
		case OrderActions.CHANGE_TORIHIKI:
			return state.withMutations( s => {
				s.setIn(["order", "genkinSinyouKubun"], action.genkinSinyouKubun)
				.setIn(["order", "baibaiKubun"], action.baibaiKubun);
			});
		case OrderActions.CHANGE_GYAKUSASI_ORDER_TYPE:
			return state.setIn(["order", "gyakusasiOrderType"], action.value);
		case OrderActions.CHANGE_CHECK_LOT:
			return state.setIn(["order", "checkLot"], action.value);
		case OrderActions.CHANGE_ORDER_SURYOU:
			return state.setIn(["order", "orderSuryou"], action.value);
		case OrderActions.CHANGE_ORDER_PRICE_KUBUN:
			return state.withMutations( s => {
				s.setIn(["order", "orderPriceKubun"], action.value)
				.setIn(["order", "orderPrice"], 0);
			});
		case OrderActions.CHANGE_ORDER_PRICE:
			return state.setIn(["order", "orderPrice"], action.value);
		case OrderActions.CHANGE_GYAKUSASI_ZYOUKEN:
			return state.setIn(["order", "gyakusasiZyouken"], action.value);
		case OrderActions.CHANGE_GYAKUSASI_ORDER_PRICE_KUBUN:
			return state.withMutations( s => {
				s.setIn(["order", "gyakusasiPriceKubun"], action.value)
				.setIn(["order", "gyakusasiOrderPrice"], 0);
			});
		case OrderActions.CHANGE_GYAKUSASI_ORDER_PRICE:
			return state.setIn(["order", "gyakusasiOrderPrice"], action.value);
		case OrderActions.CHANGE_CONDITION:
			return state.setIn(["order", "condition"], action.value);
		case OrderActions.CHANGE_ORDER_EXPIRE_DAY:
			return state.setIn(["order", "orderExpireDay"], action.value);
		case OrderActions.CHANGE_ZYOUTOEKI_KAZEI_C:
			return state.setIn(["order", "zyoutoekiKazeiC"], action.value);
		case OrderActions.CHANGE_AZUKARI:
			return state.setIn(["order", "azukari"], action.value);
		case OrderActions.CHANGE_SYOUTI:
			return state.setIn(["order", "syouti"], action.value);
		case OrderActions.TO_INPUT:
			return state.withMutations( s => {
				s.set("phase", 1)
				if(action.resetFlg) {
					s.set("order", new orderState());
				}
			});
		case OrderActions.TO_CONFIRM:
			return state.withMutations( s => {
				setOrderState(s, action.order);
				resetError(s);
			});
		case OrderActions.CHECK_NEW_ORDER_ERROR:
		case OrderActions.CHECK_SEARCH_KOKYAKU_ISSUE_ERROR:
			return state.withMutations( s => {
				s.set("errorCode", action.code)
				 .set("message", action.message);
			});
		case ReportSVApiActions.SEARCH_KOKYAKU_ISSUE_SUCCESS:
			return state.withMutations( s => {
				s.set("kokyaku", kokyakuState())
				 .set("issue", issueState())
				 .set("positionList", positionListState());
				if(action.response.kokyaku) {
					setKokyaku(s, action.response.kokyaku);
				}
				if(action.response.issue) {
					setIssue(s, action.response.issue);
				}
				if(action.response.position) {
					setPosition(s, action.response.position);
				}
				if(action.response.kokyaku && action.response.issue && action.response.position) {
					s.set("orderEnabled", true);
				}
			});
		case ReportSVApiActions.SEARCH_KOKYAKU_ISSUE_ERROR:
			return state.withMutations( s => {
				s.set("kokyaku", kokyakuState())
				 .setIn(["kokyaku", "kokyakuRegistN"], state.getIn(["kokyaku", "kokyakuRegistN"]))
				 .set("issue", issueState())
				 .setIn(["issue", "issueCode"], state.getIn(["issue", "issueCode"]))
				 .setIn(["issue", "marketCode"], state.getIn(["issue", "marketCode"]))
				 .set("positionList", positionListState())
				 .set("orderEnabled", false);
				if(action.response) {
					if(action.response.kokyaku) {
						setKokyaku(s, action.response.kokyaku);
					}
					if(action.response.issue) {
						setIssue(s, action.response.issue);
					}
					if(action.response.position) {
						setPosition(s, action.response.position);
					}
				}
				setApiError(s, action.errorCode);
			});
		case ReportSVApiActions.KABU_NEW_ORDER_CHECK_SUCCESS:
			return state.withMutations( s => {
				s.set("phase", 2)
				.setIn(["order", "orderUkewatasiKingaku"], action.response.orderUkewatasiKingaku)
				.setIn(["order", "orderTesuryou"], action.response.orderTesuryou)
				.setIn(["order", "orderSyouhizei"], action.response.orderSyouhizei);
			});
		case ReportSVApiActions.KABU_NEW_ORDER_CHECK_ERROR:
			return state.withMutations( s => {
				s.set("phase", 1)
				.set("errorCode", action.errorCode)
				.set("message", action.message);
			});
		case ReportSVApiActions.KABU_NEW_ORDER_SUCCESS:
			return state.withMutations( s => {
				s.set("phase", 3)
				 .setIn(["order", "orderUkewatasiKingaku"], action.response.orderUkewatasiKingaku)
				 .setIn(["order", "orderTesuryou"], action.response.orderTesuryou)
				 .setIn(["order", "orderSyouhizei"], action.response.orderSyouhizei)
				 .setIn(["order", "orderNumber"], action.response.orderNumber)
				 .setIn(["order", "orderDate"], action.response.orderDate);
			});
		case ReportSVApiActions.KABU_NEW_ORDER_ERROR:
			return state.withMutations( s => {
				s.set("phase", 1)
				.set("message", action.message);
			});
		/*
		case RCApiActions.REGIST_FEED_SUCCESS:
			if(action.msg.handle !== "NEW_ORDER") return state;
			msg = action.msg;
			return state.withMutations( s => {
				changeIssue(s, msg.issueCode, msg.name, msg.marketCode, msg.yobineTaniNumber, msg.unitLot, msg.loanType);
				setFeedDataList(s, msg.feedDataList);
			});
		case RCApiActions.UNREGIST_FEED_ERROR:
			if(action.msg.handle !== "NEW_ORDER") return state;
			if(action.msg.status === "A13") {
				return state.withMutations( s => {
					setMessage(s, "銘柄がありません");
				});
			} else {
				return state.withMutations( s => {
					setMessage(s, "APIエラー");
				});
			}
		case RCApiActions.UPDATE_FEED:
			if(action.msg.handle !== "NEW_ORDER") return state;
			msg = action.msg;
			return state.withMutations( s => {
				setFeedDataList(s, msg.feedDataList);
			});
		*/
		case FullBoardActions.CLICK_BUY_SELL:
			if(state.get("phase") !== 1) return state;
			return state.withMutations( s => {
				s.setIn(["order", "baibaiKubun"], action.baibaiKubun);
				s.setIn(["order", "orderPriceKubun"], action.priceKubun);
				if(action.priceKubun === "1") {
					s.setIn(["order", "orderPrice"], 0);
				} else if(action.priceKubun === "2") {
					s.setIn(["order", "orderPrice"], action.price);
				}
				if(action.condition) {
					s.setIn(["order", "condition"], action.condition);
				} else {
					s.setIn(["order", "condition"], "0");
				}
			});
		case ReportSVApiActions.LOGIN_SUCCESS:
			if(action.response.Setting) {
				return settingOrder(state, action.response.Setting[NAME]);
			} else {
				return state;
			}
		default:
			return state;
	}
}

const setOrderState = (state, order) => {
	return state.setIn(["order", "genkinSinyouKubun"], order.genkinSinyouKubun)
		 .setIn(["order", "baibaiKubun"], order.baibaiKubun)
		 .setIn(["order", "gyakusasiOrderType"], order.gyakusasiOrderType)
		 .setIn(["order", "orderSuryou"], order.orderSuryou)
		 .setIn(["order", "orderPriceKubun"], order.orderPriceKubun)
		 .setIn(["order", "orderPrice"], order.orderPrice)
		 .setIn(["order", "checkLot"], order.checkLot)
		 .setIn(["order", "condition"], order.condition)
		 .setIn(["order", "orderExpireDay"], order.orderExpireDay)
		 .setIn(["order", "zyoutoekiKazeiC"], order.zyoutoekiKazeiC)
		 .setIn(["order", "gyakusasiZyouken"], order.gyakusasiZyouken)
		 .setIn(["order", "gyakusasiPriceKubun"], order.gyakusasiPriceKubun)
		 .setIn(["order", "gyakusasiOrderPrice"], order.gyakusasiOrderPrice)
		 .setIn(["order", "azukari"], order.azukari);
}

const changeKokyaku = (state, kokyakuRegistN) => {
	return state.setIn(["kokyaku", "kokyakuRegistN"], kokyakuRegistN);
}

const setKokyaku = (state, kokyaku) => {
	return state.setIn(["kokyaku", "kokyakuRegistN"], kokyaku.kokyakuRegistN)
		 .setIn(["kokyaku", "kokyakuNameKanzi"], kokyaku.kokyakuNameKanzi)
		 .setIn(["kokyaku", "salesPersonName"], kokyaku.salesPersonName)
		 .setIn(["kokyaku", "kaiKanougaku"], kokyaku.kaiKanougaku)
		 .setIn(["kokyaku", "tateKanougaku"], kokyaku.tateKanougaku)
		 .setIn(["kokyaku", "nisaKanougaku"], kokyaku.nisaKanougaku)
		 .setIn(["kokyaku", "sinyouKouzaKubun"], kokyaku.sinyouKouzaKubun)
		 .setIn(["kokyaku", "hikazeiKouzaKubun"], kokyaku.hikazeiKouzaKubun)
}

const changeIssue = (state, issueCode, marketCode) => {
	return state.setIn(["issue", "issueCode"], issueCode)
		 .setIn(["issue", "marketCode"], marketCode);
}

const setIssue = (state, issue) => {
	const {issueCode, issueName, marketCode, yobineTaniNumber, unitLot, loanType, maxPrice, minPrice, regulation, feed} = issue;
	if(state.getIn(["issue", 'issueCode']) === issueCode && state.getIn(["issue", "marketCode"]) === marketCode) {
		return state;
	}
	const newIssueState = new issueState().withMutations(s => {
		s.set("issueCode", issueCode)
		.set("marketCode", marketCode);
		if(issueName)			s.set("issueName", issueName);
		if(yobineTaniNumber)	s.set("yobineTaniNumber", yobineTaniNumber);
		if(unitLot)				s.set("unitLot", unitLot);
		if(loanType)			s.set("loanType", loanType);
		if(maxPrice)			s.set("maxPrice", maxPrice);
		if(minPrice)			s.set("minPrice", minPrice);
		if(regulation) {
			if(regulation.company) {
				Object.keys(regulation.company).forEach(key => {
					s.setIn(["regulation", "company", key], regulation.company[key]);
				})
			}
		}
		if(feed)				setFeedData(s, feed);
	});
	return state.set("issue", newIssueState);
}

const setPosition = (state, position) => {
	return state.withMutations(s => {
		Object.keys(position).forEach(type => {
			Object.keys(position[type]).forEach(itemName => {
				s.setIn(["positionList", type, itemName], position[type][itemName]);
			});
		});
	})
}

const setFeedDataList = (state, feedDataList) => {
	for(const fd of feedDataList) {
		setFeedData(state, fd);
	}
}
const setFeedData = (state, feed) => {
	return state.withMutations(s => {
		state.setIn(["DPP"], feed["DPP"]);
		state.setIn(["DPP:T"], feed["DPP:T"]);
		state.setIn(["DYWP"], feed["DYWP"]);
		state.setIn(["DYRP"], feed["DYRP"]);
		state.setIn(["CLOD"], feed["CLOD"]);
		state.setIn(["DPG"], feed["DPG"]);
		state.setIn(["LISS"], feed["LISS"]);
	})
}
/*
const setFeedData = (state, rcFeedData) => {
	switch(rcFeedData.name) {
		case "DPP": state.setIn(["issue", "DPP"], rcFeedData.data); break;
		case "DPP:T": state.setIn(["issue", "DPP:T"], rcFeedData.data); break;
		case "DYWP": state.setIn(["issue", "DYWP"], rcFeedData.data); break;
		case "DYRP": state.setIn(["issue", "DYRP"], rcFeedData.data); break;
		case "CLOD": state.setIn(["issue", "CLOD"], rcFeedData.data); break;
		case "DPG": state.setIn(["issue", "DPG"], rcFeedData.data); break;
		case "LISS": state.setIn(["issue", "LISS"], rcFeedData.data); break;
		case "DSPH": state.setIn(["issue", "DSPH"], rcFeedData.data); break;
		case "DSPL": state.setIn(["issue", "DSPL"], rcFeedData.data); break;
		default: break;
	}
}
*/
const setMessage = (state, message) => {
	return state.set("message", message);
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

const ApiError = {
	"12095": "顧客コードが間違っています",
	"12101": "銘柄コードが間違っています",
	"12102": "市場が間違っています",
	"12901": "セッションタイムアウト",
	"12999": "セッションタイムアウト",
}

const setApiError = (state, errorCode) => {
	return setError(state, errorCode, ApiError[errorCode]);
}

const settingOrder = (state, setting) => {
	return state.withMutations(s=>{
		s.set("kokyaku", kokyakuState(setting.kokyaku))
		 .set("issue", issueState(setting.issue))
	});
}

export default orderReducer;