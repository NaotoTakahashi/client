import React from 'react';
import PropTypes from 'prop-types';
import {IssueMarketContainer} from '../containers/MIOSContainer';
import {InputQuantityContainer, InputPriceContainer} from "../containers/OrderContainer";
import Table from "./TableComponent";
import './Order.css';
import {addComma, delComma, formatMMDDHHMM_JP} from "../Utility";

//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
const errorClass = (errorCode, errorProps) => {
	return (errorCode === errorProps? " error" : "");
}
export class KokyakuInfo extends React.Component {
	static propTypes = {
		kokyakuRegistN: PropTypes.string,
		kokyakuNameKanzi: PropTypes.string,
		salesDeptName: PropTypes.string,
		salesPersonName: PropTypes.string,
		onChange: PropTypes.func,
		unEditable: PropTypes.bool,
	};
	constructor() {
		super();
		this.kokyakuRegistNRef = null;
		this.focusInput = false;
	}
	render() {
		let kokyakuNameKanzi = "";
		if(this.props.kokyakuNameKanzi && this.props.kokyakuNameKanzi !== "") {
			kokyakuNameKanzi = this.props.kokyakuNameKanzi + "  様";
		}
		let kokyakuCode = null;
		if(this.props.unEditable) {
			kokyakuCode = (<span>{"：" + this.props.kokyakuRegistN}</span>);
		} else {
			kokyakuCode = (
				<input
					type="text"
					maxLength="12"
					className={errorClass("95", this.props.errorCode)}
					key={this.props.kokyakuRegistN}
					defaultValue={this.props.kokyakuRegistN}
					onKeyPress={this.onKeyPress}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					ref={(input) => this.kokyakuRegistNRef = input}
					disabled={this.props.disabled}
				/>
			);
		}
		return(
			<div className="kokyakuInfo">
				<div className="kokyaku">
					<div className="kokyakuRegistN">
						<div>顧客コード</div>
						{kokyakuCode}
						<input type="button" className="kokyaku_list" value="顧客一覧" onClick={null} />
					</div>
					<div className="kokyakuNameKanzi">
						<div>{kokyakuNameKanzi}</div>
					</div>
				</div>
				<div className="yoryoku">
					<div className="button_area">
						<input type="button" className="kanougaku_suii" onClick={this.onClickKanougakuSuii} value="可能額推移" disabled={this.props.kokyakuRegistN === ""} />
					</div>
					<div className="kanougaku kaiKanougaku">
						<div className="title">買付可能額</div>
						<div className="value">{addComma(String(this.props.kaiKanougaku))} 円</div>
					</div>
					<div className="kanougaku nisaKanougaku">
						<div className="title">NISA可能額</div>
						<div className="value">{addComma(String(this.props.nisaKanougaku))} 円</div>
					</div>
					{/*
					<div className="kanougaku dummyKanougaku">
						<div className="title"></div>
						<div className="value"></div>
					</div>
					*/}
					<div className="kanougaku tateKanougaku">
						<div className="title">新規建て可能額</div>
						<div className="value">{addComma(String(this.props.tateKanougaku))} 円</div>
					</div>
					<div className="sales salesPersonName">
						<div className="title">担当</div>
						<div className="value">{this.props.salesPersonName}</div>
					</div>
				</div>
				{/*
				<div className="sales">
					<div className="salesDeptName">
						<span>{this.props.salesDeptName}</span>
					</div>
					
				</div>
				*/}
			</div>
		)
	}

	componentDidUpdate() {
		if(this.props.errorCode !== "") {
			switch(this.props.errorCode) {
				case "95":
					this.kokyakuRegistNRef.focus();
					break;
				default: break;
			}
		} else if(this.focusInput) {
			this.kokyakuRegistNRef.focus();
		}
		this.focusInput = false;
	}

	onKeyPress = (e) => {
		if(e.key !== "Enter")
			return;
		const inputForm = e.target;
		const inKokyakuRegistN = inputForm.value;
		//if(this.props.kokyakuRegistN !== inKokyakuRegistN) {
			if(this.props.onChange) {
				this.props.onChange(inKokyakuRegistN);
			}
		//}
		inputForm.select();
	}

	onFocus = (e) => {
		this.kokyakuRegistNRef.select();
	}

	onBlur = (e) => {
		const inputForm = e.target;
		if(this.props.onChange) {
			this.props.onChange(e.target.value);
		}
	}

	onClickClear = (e) => {
		this.focusInput = true;
		if(this.props.onClickClear) {
			this.props.onClickClear();
		}
	}

	onClickKanougakuSuii = (e) => {
		if(this.props.kokyakuRegistN === "")
			return;
		if(this.props.onClickKanougakuSuii) {
			this.props.onClickKanougakuSuii(this.props.kokyakuRegistN);
		}
	}

	getInputedVal = () => {
		return {
			kokyakuRegistN: this.kokyakuRegistNRef? this.kokyakuRegistNRef.value : null
		};
	}
}

const loanTypes = {
	"1": "貸借",
	"2": "制度"
}

export const marketList = [
	{ code: "", name: ""},
	{ code: "00", name: "東証"},
	{ code: "02", name: "名証"},
	{ code: "05", name: "福証"},
	{ code: "07", name: "札証"},
	{ code: "11", name: "JNX"},
];

export const markets = {}

for(const market of marketList) {
	markets[market.code] = market.name;
}


const CompanyRegulation = {
	"teisiKubun": {
		"1": "取引禁止",
		"2": "成行禁止",
	},
	"baibaiTeisi": {
		"9": "売買停止中",
	},
	"genbutuKaituke": {
		"1": "現物買付取引禁止",
		"2": "現物買付成行禁止",
		"3": "端株買付成行禁止",
	},
	"genbutuUrituke": {
		"1": "現物売付取引禁止",
		"2": "現物売付成行禁止",
		"3": "端株売付成行禁止",
	},
	"seidoSinyouSinkiKaitate": {
		"1": "制度信用買建取引禁止",
		"2": "制度信用買建成行禁止",
	},
	"seidoSinyouSinkiUritate": {
		"1": "制度信用売建取引禁止",
		"2": "制度信用売建成行禁止",
	},
	"seidoSinyouKaiHensai": {
		"1": "制度信用買返済取引禁止",
		"2": "制度信用買返済成行禁止",
	},
	"seidoSinyouUriHensai": {
		"1": "制度信用売返済取引禁止",
		"2": "制度信用売返済成行禁止",
	},
	"seidoSinyouGenbiki": {
		"1": "制度信用現引取引禁止",
		"2": "制度信用現引成行禁止",
	},
	"seidoSinyouGenwatasi": {
		"1": "制度信用現渡取引禁止",
		"2": "制度信用現渡成行禁止",
	},
	"ippanSinyouSinkiKaitate": {
		"1": "一般信用買建取引禁止",
		"2": "一般信用買建成行禁止",
	},
	"ippanSinyouSinkiUritate": {
		"1": "一般信用売建取引禁止",
		"2": "一般信用売建成行禁止",
	},
	"ippanSinyouKaiHensai": {
		"1": "一般信用買返済取引禁止",
		"2": "一般信用買返済成行禁止",
	},
	"ippanSinyouUriHensai": {
		"1": "一般信用売返済取引禁止",
		"2": "一般信用売返済成行禁止",
	},
	"ippanSinyouGenbiki": {
		"1": "一般信用現引取引禁止",
		"2": "一般信用現引成行禁止",
	},
	"ippanSinyouGenwatasi": {
		"1": "一般信用現渡取引禁止",
		"2": "一般信用現渡成行禁止",
	},
	"zizenCyouseiC": {
		"1": "事前調整あり",
	},
	"sokuzituNyukinC": {
		"1": "即日入金規制あり",
	},
	"sinyouSyutyuKubun": {
		"1": "信用一極集中あり",
		"2": "信用一極集中日々公表銘柄",
	},
}

const convertCompanyRegulation = (type, value) => {
	if(!CompanyRegulation[type])
		return "";
	if(!CompanyRegulation[type][value])
		return "";
	else
		return CompanyRegulation[type][value];
}

const positionCols = [
	{
		key: "torihiki",
		name: "取引",
	},
	{
		key: "positionNum",
		name: "保有数量",
	},
	{
		key: "orderNum",
		name: "注文中数量",
	},
	{
		key: "averagePrice",
		name: "平均単価",
	},
]

class PositionRowData {
	constructor() {
		this.torihiki = null;
		this.positionNum = null;
		this.orderNum = null;
		this.averagePrice = null;
	}
}

const marginPositionCols = positionCols.concat();
marginPositionCols.forEach(
	(orgObj, idx) => {
		const newObj = Object.assign({},orgObj);
		marginPositionCols[idx] = newObj;
	}
);
marginPositionCols[1].name = "建玉数量";

class PositionTables extends React.Component {
	render() {
		const equityPositionList = PositionTables.createEquityPositionList(this.props.positionList);
		const marginPositionList = PositionTables.createMarginPositionList(this.props.positionList);
		return(
			<div className="position_tables">
				<Table
					cols={positionCols}
					dataList={equityPositionList}
					className="equity"
				/>
				<Table
					cols={marginPositionCols}
					dataList={marginPositionList}
					className="margin"
				/>
			</div>
		)
	}

	static setPositionValue = (positionRow, propsPosition) => {
		positionRow.positionNum = propsPosition.positionNum? addComma(String(propsPosition.positionNum)) :  propsPosition.positionNum;
		positionRow.orderNum = propsPosition.orderNum? addComma(String(propsPosition.orderNum)) : propsPosition.orderNum;
		positionRow.averagePrice = propsPosition.averagePrice? addComma(String(propsPosition.averagePrice)) : propsPosition.averagePrice;
	}

	static createEquityPositionList = (propsPositionList) => {
		const list = [];
		if(!propsPositionList) return list;
		
		let positionRow = new PositionRowData();
		positionRow.torihiki = "現物・特定";
		PositionTables.setPositionValue(positionRow, propsPositionList.equityTokutei);
		list.push(positionRow);

		positionRow = new PositionRowData();
		positionRow.torihiki = "現物・一般";
		PositionTables.setPositionValue(positionRow, propsPositionList.equityIppan);
		list.push(positionRow);

		positionRow = new PositionRowData();
		positionRow.torihiki = "現物・NISA";
		PositionTables.setPositionValue(positionRow, propsPositionList.equityNISA);
		list.push(positionRow);
		
		return list;
	}

	static createMarginPositionList = (propsPositionList) => {
		const list = [];
		if(!propsPositionList) return list;
		
		let positionRow = new PositionRowData();
		positionRow.torihiki = "信用買建";
		PositionTables.setPositionValue(positionRow, propsPositionList.marginBuy);
		positionRow.class = "margin_buy";
		list.push(positionRow);

		positionRow = new PositionRowData();
		positionRow.torihiki = "信用売建";
		PositionTables.setPositionValue(positionRow, propsPositionList.marginSell);
		positionRow.class = "margin_sell";
		list.push(positionRow);

		positionRow = new PositionRowData();
		list.push(positionRow);
		
		return list;
	}
}

class IssueInfo extends React.Component {
	static propTypes = {
		issueCode: PropTypes.string,
		issueName: PropTypes.string,
		marketCode: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		unEditable: PropTypes.bool,
	};
	constructor() {
		super();
		this.issueCodeRef = null;
		this.marketCodeRef = null;
		this.focusInput = false;
	}
	render() {
		return(
			<div className="issueInfo">
				<div className="row1">
					{this.props.unEditable? (<div className="input_area"></div>):(
					<div className="input_area">
						<div>銘柄コード</div>
						<IssueMarketContainer
							issueCode={this.props.issueCode}
							marketCode={this.props.marketCode}
							issueClassName={errorClass("101", this.props.errorCode)}
							marketClassName={errorClass("102", this.props.errorCode)}
							onChange={this.props.onChange}
							issueRef={(input) => this.issueCodeRef = input}
							marketRef={(select) => this.marketCodeRef = select}
							marketSet={marketList}
							disabled={this.props.disabled}
						/>
						<input type="button" className="full_board" value="フル板" onClick={this.onClickFullBoard} />
					</div>
					)}
					<div className="kisei_icons">
						<div className={"kisei_type" + (Object.keys(this.props.regulation.exchange).length? " active" : "")}>
							取引所規制
							<ul className="kisei_list">
								{Object.keys(this.props.regulation.exchange).map(key =>{
									return (<li key={"exchange_" + key}>{convertCompanyRegulation(key, this.props.regulation.exchange[key])}</li>)
								})}
							</ul>
						</div>
						<div className={"kisei_type" + (Object.keys(this.props.regulation.jsf).length? " active" : "")}>
							日証金規制
							<ul className="kisei_list">
								{Object.keys(this.props.regulation.jsf).map(key =>{
									return (<li key={"jsf_" + key}>{convertCompanyRegulation(key, this.props.regulation.jsf[key])}</li>)
								})}
							</ul>
						</div>
						<div className={"kisei_type" + (Object.keys(this.props.regulation.company).length? " active" : "")}>
							当社規制
							<ul className="kisei_list">
								{Object.keys(this.props.regulation.company).map(key =>{
									return (<li key={"company_" + key}>{convertCompanyRegulation(key, this.props.regulation.company[key])}</li>)
								})}
							</ul>
						</div>
						<div className={"kisei_type" + (Object.keys(this.props.regulation.other).length? " active" : "")}>
							その他規制
							<ul className="kisei_list">
								{Object.keys(this.props.regulation.other).map(key =>{
									return (<li key={"other_" + key}>{convertCompanyRegulation(key, this.props.regulation.other[key])}</li>)
								})}
							</ul>
						</div>
					</div>
				</div>
				<div className="row2">
					<div className="issue">
						<span className="issue_code">{this.props.issueCode}</span>
						<span className="issue_name">{this.props.issueName}</span>
					</div>
					<div className="feed_price">
						<div className="row2-1">
							<div className="current_price">{addComma(this.props.DPP)}</div>
							<div className={"up_down"+IssueInfo.DPGClass(this.props["DPG"])}>{IssueInfo.convertDPG(this.props["DPG"])}</div>
							<div className="update_time">{this.props["DPP:T"]}</div>
						</div>
						<div className="row2-2">
							<div className={"updown_price"+IssueInfo.signClass(this.props.DYWP)}>{addComma(IssueInfo.addSign(this.props.DYWP))}</div>
							<div className={"updown_ratio"+IssueInfo.signClass(this.props.DYRP)}>
								{IssueInfo.addBracket(
									IssueInfo.addSign(this.props.DYRP) + (IssueInfo.signClass(this.props.DYRP) !== ""? "%": "")
								)}
							</div>
						</div>
					</div>
					<div className="feed_market">
						<div className="row2-1">
							<div className="market">{IssueInfo.convertMarket(this.props.marketCode)+this.props.LISS}</div>
							<div className="loanType">{IssueInfo.convertLoanType(this.props.loanType)}</div>
						</div>
						<div className="row2-2">
							<div className="kessanbi_name">決算日</div>
							<div className="kessanbi">{this.props.CLOD}</div>
						</div>
					</div>
				</div>
				<div className={"row3" + (this.props.phase !== 1? " hide" : "")}>
					<PositionTables positionList={this.props.positionList}/>
				</div>
			</div>
		)
	}

	componentDidUpdate() {
		if(this.props.errorCode !== "") {
			switch(this.props.errorCode) {
				case "101":
					this.issueCodeRef.focus();
					break;
				case "102":
					this.marketCodeRef.focus();
					break;
				default: break;
			}
		} else if(this.focusInput) {
			this.issueCodeRef.focus();
		}
		this.focusInput = false;
	}

	onClickFullBoard = (e) => {
		this.focusInput = true;
		if(this.props.onClickFullBoard) {
			this.props.onClickFullBoard(this.props.issueCode, this.props.marketCode);
		}
	}

	getInputedVal = () => {
		return {
			issueCode: this.issueCodeRef.value,
			marketCode: this.marketCodeRef.value,
		}
	}

	static addBracket(val) {
		if(val === null || val === undefined || val === "") {
			return val;
		}
		return "(" + val + ")";
	}

	static addSign(val) {
		if(isNaN(Number(val)) || Number(val) <= 0) {
			return val;
		}
		return "+" + val;
	}

	static signClass(val) {
		if(isNaN(Number(val)) || Number(val) === 0) {
			return "";
		} else if(Number(val) < 0) {
			return " down";
		} else if(Number(val) > 0) {
			return " up";
		}
		return "";
	}

	static convertDPG(val) {
		if(val === "0057") {
			return "▲";
		} else if(val === "0058") {
			return "▼";
		}
		return "";
	}

	static DPGClass(val) {
		if(val === "0057") {
			return " up";
		} else if(val === "0058") {
			return " down";
		}
		return "";
	}

	static convertLoanType(val) {
		if(loanTypes[val])
			return loanTypes[val];
		else
			return "";
	}

	static convertMarket(val) {
		if(markets[val])
			return markets[val];
		else
			return "";
	}
}

const torihikiList = [
	{"": ""},
	{"1": "現物買付"},
	{"2": "現物売付"},
	{"3": "制度信用買"},
	{"4": "制度信用売"},
	{"5": "一般信用買"},
	{"6": "一般信用売"},
	{"7": "制度信用買返済"},
	{"8": "制度信用売返済"},
	{"9": "一般信用買返済"},
	{"10": "一般信用売返済"},
	{"11": "現引"},
	{"12": "現渡"},
]

const orderMethodSet = {
	"0": "通常",
	"1": "逆指値",
	"2": "通常+逆指値",
	"3": "時間指定",
}

const checkLotSet = {
	1: "未指定",
	10: "10倍",
	100: "100倍",
	1000: "1000倍",
}

const conditionSet = {
	"0": "無条件",
	"2": "寄付",
	"4": "引け",
	"6": "不成",
}

const expireDaySet = {
	0: "当日中",
}

const accountSet = {
	1: "特定",
	3: "一般",
	5: "NISA",
	7: "非課税",
	9: "法人",
}

const azukariSet = {
	1: "保護",
	9: "代用",
}

const convertBuySell = (buySell) => {
	if(buySell === "1") {
		return "売";
	} else if(buySell === "3") {
		return "買"
	} else {
		return undefined;
	}
}

const torihikiToCode = (torihiki) => {
	switch(torihiki) {
		case "": // 未指定
			return {
				genkinSinyouKubun: "0",
				baibaiKubun: "",
			};
		case "1": // 現物買付
			return {
				genkinSinyouKubun: "0",
				baibaiKubun: "3",
			};
		case "2": // 現物売付
			return {
				genkinSinyouKubun: "0",
				baibaiKubun: "1",
			};
		case "3": // 制度信用買
			return {
				genkinSinyouKubun: "2",
				baibaiKubun: "3",
			}
		case "4": // 制度信用売
			return {
				genkinSinyouKubun: "2",
				baibaiKubun: "1",
			}
		case "5": // 一般信用買
			return {
				genkinSinyouKubun: "6",
				baibaiKubun: "3",
			}
		case "6": // 一般信用売
			return {
				genkinSinyouKubun: "6",
				baibaiKubun: "1",
			}
		case "7": // 制度信用買返済
			return {
				genkinSinyouKubun: "4",
				baibaiKubun: "3",
			}
		case "8": // 制度信用売返済
			return {
				genkinSinyouKubun: "4",
				baibaiKubun: "1",
			}
		case "9": // 一般信用買返済
			return {
				genkinSinyouKubun: "8",
				baibaiKubun: "3",
			}
		case "10": // 一般信用売返済
			return {
				genkinSinyouKubun: "8",
				baibaiKubun: "1",
			}
		case "11": // 現引
			return {
				genkinSinyouKubun: "2",
				baibaiKubun: "5",
			}
		case "12": // 現渡
			return {
				genkinSinyouKubun: "4",
				baibaiKubun: "7",
			}
		default: return undefined;
	}
}

const codeToTorihiki = (genkinSinyouKubun, baibaiKubun) => {
	if(baibaiKubun === "")
		return "";							//未指定
	switch(genkinSinyouKubun) {
		case "0": switch(baibaiKubun) {
					case "1": return "2";	// 現物売付
					case "3": return "1";	// 現物買付
					default: return undefined;
				}
		case "2": switch(baibaiKubun) {
					case "1": return "4";	// 新規売建/制度信用6ヶ月
					case "3": return "3";	// 新規買建/制度信用6ヶ月
					case "5": return "11";	// 現引
					default: return undefined;
				}
		case "4": switch(baibaiKubun) {
					case "1": return "8";	// 売返済/制度信用6ヶ月
					case "3": return "7";	// 買返済/制度信用6ヶ月
					case "7": return "12";	// 現渡
					default: return undefined;
				}
		case "6": switch(baibaiKubun) {
					case "1": return "6";	// 新規売建/一般信用無期
					case "3": return "5";	// 新規買建/一般信用無期
					default: return undefined;
				}
		case "8": switch(baibaiKubun) {
					case "1": return "10";	// 売返済/一般信用無期
					case "3": return "9";	// 買返済/一般信用無期
					default: return undefined;
				}
		default : return "";
	}
}

const codeToStrTorihiki = (genkinSinyouKubun, baibaiKubun) => {
	if(baibaiKubun === "")
		return "";
	switch(genkinSinyouKubun) {
		case "0": switch(baibaiKubun) {
					case "1": return "現物売付";
					case "3": return "現物買付";
					default: return undefined;
				}
		case "2": switch(baibaiKubun) {
					case "1": return "新規売建/制度信用6ヶ月";
					case "3": return "新規買建/制度信用6ヶ月";
					default: return undefined;
				}
		case "4": switch(baibaiKubun) {
					case "1": return "売返済/制度信用6ヶ月";
					case "3": return "買返済/制度信用6ヶ月";
					default: return undefined;
				}
		case "6": switch(baibaiKubun) {
					case "1": return "新規売建/一般信用無期";
					case "3": return "新規買建/一般信用無期";
					default: return undefined;
				}
		case "8": switch(baibaiKubun) {
					case "1": return "売返済/一般信用無期";
					case "3": return "買返済/一般信用無期";
					default: return undefined;
				}
		default : return "";
	}
}

const convertPhase = (phase) => {
	switch(phase) {
		case 1: return "入力";
		case 2: return "確認";
		case 3: return "完了";
		default: return undefined;
	}
}

const hourDataSet = () => {
	let ret = [];
	ret.push({"": "---"});
	for(let i=0; i < 24;i++) {
		ret.push({[i]:i});
	}
	return ret;
}

const minDataSet = () => {
	let ret = [];
	ret.push({"": "---"});
	for(let i=0; i < 60;i++) {
		ret.push({[i]:i});
	}
	return ret;
}

class Select extends React.Component {
	static propTypes = {
		dataSet: PropTypes.oneOfType([
			PropTypes.array
			, PropTypes.object
		]),
		className: PropTypes.string,
		value: PropTypes.any,
		onChange: PropTypes.func,
		selectRef: PropTypes.func,
		disabled: PropTypes.bool,
	}
	constructor(props){
		super(props);
		this.selectRef = null;
	}

	render() {
		const options = [];
		if(!Array.isArray(this.props.dataSet)) {
			// Object
			Object.keys(this.props.dataSet).forEach((key) => {
				options.push(<option key={key} value={key}>{this.props.dataSet[key]}</option>);
			});
		} else {
			// Array
			this.props.dataSet.forEach((elem) => {
				Object.keys(elem).forEach((key) => {
					options.push(<option key={key} value={key}>{elem[key]}</option>);
				});
			});
		}
		return (
			<select
				key={this.props.value}
				className={"combo " + (this.props.className || '')}
				defaultValue={this.props.value}
				ref={this.targetRef}
				onChange={this.onChange}
				disabled={this.props.disabled}
			>
				{options}
			</select>
		);
	}

	targetRef = (select) => {
		this.selectRef = select;
		if(this.props.selectRef)
			this.props.selectRef(select);
	}

	onChange = (e) => {
		if(this.props.onChange) {
			this.props.onChange(e.target.value);
		}
	}

	getVal = () => {
		return this.selectRef.value;
	}
}

export class InputUpDown extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.any.isRequired,
		disabled: PropTypes.bool,
		// callback function
		onPlusClick: PropTypes.func,
		onMinusClick: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		onChange: PropTypes.func,
	};

	constructor(props){
		super(props);
		this.inputRef = null;
	}
	
	render() {
		let val = "";
		if(this.props.value > 0) {
			val = String(this.props.value);
		}
		return(
			<div className="input_up_down">
				<input
					key={val}
					type="text"
					size="8"
					maxLength="9"
					className={this.props.className || ""}
					defaultValue={addComma(val)}
					ref={this.targetRef}
					disabled={this.props.disabled}
					onChange={this.props.onChange}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
				/>
				<input type="button" className="plus_button" tabIndex="-1" onClick={this.onPlusClick} disabled={this.props.disabled} />
				<input type="button" className="minus_button" tabIndex="-1" onClick={this.onMinusClick} disabled={this.props.disabled} />
			</div>
		)
	}

	onPlusClick = (e) => {
		this.inputRef.value = delComma(this.inputRef.value);
		if(this.props.onPlusClick) {
			this.props.onPlusClick(e);
		}
		this.inputRef.value = addComma(this.inputRef.value);
	}

	onMinusClick = (e) => {
		this.inputRef.value = delComma(this.inputRef.value);
		if(this.props.onMinusClick) {
			this.props.onMinusClick(e);
		}
		this.inputRef.value = addComma(this.inputRef.value);
	}

	onFocus = (e) => {
		this.inputRef.value = delComma(this.inputRef.value);
		this.inputRef.select();
		if(this.props.onFocus) {
			this.props.onFocus(e);
		}
	}

	onBlur = (e) => {
		if(this.props.onBlur) {
			this.props.onBlur(e);
		}
		this.inputRef.value = addComma(this.inputRef.value);
	}

	targetRef = (input) => {
		this.inputRef = input;
		if(this.props.inputRef)
			this.props.inputRef(input);
	}

	getVal = () => {
		return this.inputRef.value;
	}
}

class NewOrderTitle extends React.Component {
	static propTypes = {
		phase: PropTypes.number.isRequired,
		genkinSinyouKubun: PropTypes.any.isRequired,
		baibaiKubun: PropTypes.any.isRequired,
		hensaiSitei: PropTypes.bool,
	}
	render() {
		let buySell = undefined;
		switch(this.props.baibaiKubun) {
			case 1: buySell = "sell";break;
			case 3: buySell = "buy";break;
			case 5: buySell = "genwatasi";break;
			case 7: buySell = "genbiki";break;
			default: buySell =  "";
		}
		let title = "注文";
		if(this.props.hensaiSitei) {
			title = "返済建玉指定";
		} else if(this.props.baibaiKubun === "5") {
			title = "現引指定";
		} else if(this.props.baibaiKubun === "7") {
			title = "現渡指定";
		}
		let subTitle = null;
		if(this.props.hensaiSitei) {
			subTitle = "制度信用買返済、制度信用売返済および一般信用売返済";
		} else {
			subTitle = codeToStrTorihiki(this.props.genkinSinyouKubun, this.props.baibaiKubun);
		}
		return(
			<div className={"title"+ (buySell ? " "+buySell : "")}>
				<span>{title + convertPhase(this.props.phase)}{subTitle? "（" + subTitle + "）" : ""}</span>
			</div>
		) 
	}
}

class NewOrderInputLeft extends React.Component {
	constructor() {
		super()
		this.torihikiRef = null;
		this.orderMethodRef = null;
		this.orderSuryouRef = null;
		this.checkLotRef = null;
		this.orderPriceKubunRef = null;
		this.orderPriceRef = null;
		this.conditionRef = null;
		this.expireDayRef = null;
		this.accountRef = null;
		this.azukariRef = null;
		this.syoutiRef = null;
	}
	render() {
		const disabledNormal = (this.props.order.gyakusasiOrderType === "1" || this.props.order.gyakusasiOrderType === "3");
		let hensaiHidden = true;
		if(this.props.order.baibaiKubun === "5" || this.props.order.baibaiKubun === "7") {
			hensaiHidden = false;
		} else if(this.props.order.genkinSinyouKubun === "4" || this.props.order.genkinSinyouKubun === "8") {
			hensaiHidden = false;
		}
		let kokyakuTorihikiList = [];
		if(this.props.kokyaku.sinyouKouzaKubun === "1") {
			kokyakuTorihikiList = torihikiList;
		} else {
			kokyakuTorihikiList.push(torihikiList[0]);		// 未指定
			kokyakuTorihikiList.push(torihikiList[1]);		// 現物買
			kokyakuTorihikiList.push(torihikiList[2]);		// 現物売
		}
		const priceRange = (this.props.issue.maxPrice !== 0 && this.props.issue.minPrice !== 0)? (addComma(String(this.props.issue.minPrice))+"円～"+addComma(String(this.props.issue.maxPrice))+"円") : "";
		return(
			<div className="order_input" name="new_order_input_left" >
					<div className="row">
						<div className="header">取引</div>
						<div className="data">
							<Select
								dataSet={kokyakuTorihikiList}
								className="torihiki_select"
								value={codeToTorihiki(this.props.order.genkinSinyouKubun, this.props.order.baibaiKubun)}
								onChange={this.props.onChangeTorihiki}
								selectRef = {(select) => this.torihikiRef = select}
							/>
							<input type="button" className={"hensai_button " + (hensaiHidden ? " hidden" : "")} value="返済指定" />
						</div>
					</div>
					<div className="row">
						<div className="header">注文条件</div>
						<div className="data">
							<Select
								dataSet={orderMethodSet}
								className="order_method_select"
								value={this.props.order.gyakusasiOrderType}
								onChange={this.props.onChangeOrderMethod}
								selectRef = {(select) => this.orderMethodRef = select}
							/>
						</div>
					</div>
					<div className="row">
						<div className="header">注文株数</div>
						<div className="data">
							<InputQuantityContainer
								className="orderSuryou"
								value={this.props.order.orderSuryou}
								interval={this.props.issue.unitLot? this.props.issue.unitLot : 1}
								dispatch={this.props.onChangeOrderSuryou}
								inputRef={(input) => this.orderSuryouRef = input}
							/>
						</div>
					</div>
					<div className="row">
						<div className="header">株数チェック</div>
						<div className="data">
							<Select
								dataSet={checkLotSet}
								className="lot_check_select"
								value={this.props.order.checkLot}
								onChange={this.props.onChangeCheckLot}
								selectRef={(select) => this.checkLotRef = select}
							/>
							<span className="unit_lot">{this.props.issue.unitLot? addComma(String(this.props.issue.unitLot))+"株単位" : ""}</span>
						</div>
					</div>
					<div className={"row" + (disabledNormal ? " disabled" : "")}>
						<div className="header">注文単価</div>
						<div className="data">
							<input
								key={this.props.order.orderPriceKubun}
								type="radio" name="OrderPriceKubun"
								value="2"
								defaultChecked={this.props.order.orderPriceKubun !== "1"}
								disabled={disabledNormal}
								onChange={this.onChangeOrderPriceKubun}
								ref={(input) => this.orderPriceKubunRef = input}
							/>
							<span>指値</span>
							<InputPriceContainer
								className="orderPrice"
								value={this.props.order.orderPrice}
								disabled={disabledNormal||(this.props.order.orderPriceKubun!=="2")}
								yobineTaniNumber={this.props.issue.yobineTaniNumber}
								defaultPrice={this.props.issue.DPP}
								dispatch={this.props.onChangeOrderPrice}
								inputRef={(input) => this.orderPriceRef = input}
							/>
						</div>
					</div>
					<div className={"row" + (disabledNormal ? " disabled" : "")}>
						<div className="header"></div>
						<div className="data">
							<input
								key={this.props.order.orderPriceKubun}
								type="radio" name="OrderPriceKubun"
								value="1"
								defaultChecked={this.props.order.orderPriceKubun === "1"}
								disabled={disabledNormal} onChange={this.onChangeOrderPriceKubun}
							/>
							<span>成行</span>
						</div>
					</div>
					<div className={"row" + (disabledNormal ? " disabled" : "")}>
						<div className="header">値幅</div>
						<div className="data">{priceRange}</div>
					</div>
					<div className={"row half" + (disabledNormal ? " disabled" : "")}>
						<div className="header">執行条件</div>
						<div className="data">
							<Select
								dataSet={conditionSet}
								className="condition_select"
								value={this.props.order.condition}
								onChange={this.props.onChangeCondition}
							/>
						</div>
						<div className="header">期間</div>
						<div className="data">
							<Select
								dataSet={expireDaySet}
								className="expire_day_select"
								value={this.props.order.orderExpireDay}
								onChange={this.props.onChangeOrderExpireDay}
							/>
						</div>
					</div>
					<div className="row half">
						<div className="header">口座</div>
						<div className="data">
							<Select
								dataSet={accountSet}
								className="account_select"
								value={this.props.order.zyoutoekiKazeiC}
								onChange={this.props.onChangeAccount}
							/>
						</div>
						<div className="header">預り</div>
						<div className="data">
							<Select
								dataSet={azukariSet}
								className="azukari_select"
								value={this.props.order.azukari}
								onChange={this.props.onChangeAzukari}
							/>
						</div>
					</div>
					<div className="row half">
						<div className="header">承知</div>
						<div className="data">
							<input
								type="checkbox"
								name="syouti"
								key={this.props.order.syouti}
								defaultChecked={this.props.order.syouti}
								onChange={this.onChangeSyouti}
							/>
						</div>
					</div>
			</div>
		)
	}

	onChangeOrderPriceKubun = (e) => {
		if(this.props.onChangeOrderPriceKubun) {
			this.props.onChangeOrderPriceKubun(e.target.value);
		}
	}

	onChangeSyouti = (e) => {
		if(this.props.onChangeSyouti) {
			this.props.onChangeSyouti(e.target.checked);
		}
	}

	getInputedVal = () => {
		const ret = {};
		ret.genkinSinyouKubun = this.props.order.genkinSinyouKubun;
		ret.baibaiKubun = this.props.order.baibaiKubun;
		ret.gyakusasiOrderType = this.props.order.gyakusasiOrderType;
		ret.orderSuryou = this.props.order.orderSuryou;
		ret.checkLot = this.props.order.checkLot;
		ret.orderPriceKubun = this.props.order.orderPriceKubun;
		ret.orderPrice = this.props.order.orderPrice;
		ret.condition = this.props.order.condition;
		ret.orderExpireDay = this.props.order.orderExpireDay;
		ret.zyoutoekiKazeiC = this.props.order.zyoutoekiKazeiC;
		ret.azukari = this.props.order.azukari;
		ret.syouti = this.props.order.syouti;
		return ret;
	}
}

class NewOrderInputRight extends React.Component {
	render() {
		const enabled = (this.props.order.gyakusasiOrderType === "1" || this.props.order.gyakusasiOrderType === "2");
		return(
			<div className={"order_input" + (enabled ? "" : " disabled")} >
				<div className="row"><span>逆指値/通常+逆指値</span></div>
				<div className="row">
					<div className="header">トリガー単価</div>
					<div className="data">
						<InputPriceContainer
							className="gyakusasiZyouken"
							value={this.props.order.gyakusasiZyouken}
							disabled={!enabled}
							yobineTaniNumber={this.props.issue.yobineTaniNumber}
							defaultPrice={this.props.issue.DPP}
							dispatch={this.props.onChangeGyakusasiZyouken}
						/>
					</div>
				</div>
				<div className="row">
					<span>{this.props.order.baibaiKubun === "3" ? "以上" : "以下" }になったら{convertBuySell(this.props.order.baibaiKubun)}注文を</span>
				</div>
				<div className="row">
					<div className="header"></div>
					<div className="data">
						<input
							key={this.props.order.gyakusasiPriceKubun}
							type="radio"
							name="gyakusasiPriceKubun"
							value="2"
							defaultChecked={this.props.order.gyakusasiPriceKubun !== "1"}
							disabled={!enabled}
							onChange={this.onChangeGyakusasiOrderPriceKubun}
						/>
						<span>指値</span>
						<InputPriceContainer
							className="gyakusasiOrderPrice"
							value={this.props.order.gyakusasiOrderPrice}
							disabled={(!enabled || this.props.order.gyakusasiPriceKubun!=="2")}
							yobineTaniNumber={this.props.issue.yobineTaniNumber}
							defaultPrice={this.props.issue.DPP}
							dispatch={this.props.onChangeGyakusasiOrderPrice}
						/>
					</div>
				</div>
				<div className="row">
					<div className="header"></div>
					<div className="data">
						<input
							key={this.props.order.gyakusasiPriceKubun}
							type="radio"
							name="gyakusasiPriceKubun"
							value="1"
							defaultChecked={this.props.order.gyakusasiPriceKubun === "1"}
							disabled={!enabled}
							onChange={this.onChangeGyakusasiOrderPriceKubun}
						/>
						成行
					</div>
				</div>
				<div className="row">
					<span>で発注する</span>
				</div>
				<div className="row">
					<div className="header">時間発注</div>
					<div className="data">
						<Select dataSet={hourDataSet()} className="hour" value="" disabled={!enabled} /> 時 <Select dataSet={minDataSet()} className="min" value="" disabled={!enabled} /> 分
					</div>
				</div>
			</div>
		)
	}

	onChangeGyakusasiOrderPriceKubun = (e) => {
		if(this.props.onChangeGyakusasiOrderPriceKubun) {
			this.props.onChangeGyakusasiOrderPriceKubun(e.target.value)
		}
	}

	getInputedVal = () => {
		const ret = {};
		ret.gyakusasiZyouken = this.props.order.gyakusasiZyouken;
		ret.gyakusasiOrderPrice = this.props.order.gyakusasiOrderPrice;
		ret.gyakusasiPriceKubun = this.props.order.gyakusasiPriceKubun;
		return ret;
	}
}

class NewOrderContents extends React.Component {
	render() {
		const ROW_COUNT = 16;
		const rowList = [];
		let rowNum = 0;
		let className = "";
		//let header = "";
		let data = "";
		// 取引
		data = codeToStrTorihiki(this.props.order.genkinSinyouKubun, this.props.order.baibaiKubun);
		let torihikiClass = "";
		if(this.props.order.baibaiKubun === "1") {
			torihikiClass = " uri";
		} if(this.props.order.baibaiKubun === "3") {
			torihikiClass = " kai";
		} else if(this.props.order.baibaiKubun === "5" || this.props.order.baibaiKubun === "7" ) {
			torihikiClass = " genbikiwatasi"
		}
		className = "torihiki" + torihikiClass;
		rowList.push(NewOrderContents.createRow(rowNum, className, "取引", data));
		rowNum++;
		// 注文条件
		data = orderMethodSet[this.props.order.gyakusasiOrderType];
		rowList.push(NewOrderContents.createRow(rowNum, "", "注文条件", data));
		rowNum++;
		// 株数
		data = addComma(String(this.props.order.orderSuryou)) + " 株";
		rowList.push(NewOrderContents.createRow(rowNum, "", "株数", data));
		rowNum++;
		// 注文単価
		data = (this.props.order.orderPriceKubun === "1"? "成行" : addComma(String(this.props.order.orderPrice)) + " 円");
		rowList.push(NewOrderContents.createRow(rowNum, "", "注文単価", data));
		rowNum++;
		// 逆指値条件
		if(this.props.order.gyakusasiOrderType === "1" || this.props.order.gyakusasiOrderType === "2") {
			data=addComma(String(this.props.order.gyakusasiZyouken)) + " 円" + (this.props.order.baibaiKubun === "3" ? "以上" : "以下");
			rowList.push(NewOrderContents.createRow(rowNum, "", "逆指値条件", data));
			rowNum++;
			data="になったら、" + (convertBuySell(this.props.order.baibaiKubun)) + "注文を";
			rowList.push(NewOrderContents.createRow(rowNum, "", "", data));
			rowNum++;
			data=(this.props.order.gyakusasiPriceKubun === "1"? "成行" : addComma(String(this.props.order.gyakusasiOrderPrice)) + " 円") + "で発注する";
			rowList.push(NewOrderContents.createRow(rowNum, "", "", data));
			rowNum++;
		}
		// 執行条件
		data = conditionSet[this.props.order.condition];
		rowList.push(NewOrderContents.createRow(rowNum, "", "執行条件", data));
		rowNum++;
		// 期間
		data = expireDaySet[this.props.order.orderExpireDay];
		rowList.push(NewOrderContents.createRow(rowNum, "", "期間", data));
		rowNum++;
		// 口座
		data = accountSet[this.props.order.zyoutoekiKazeiC];
		rowList.push(NewOrderContents.createRow(rowNum, "", "口座", data));
		rowNum++;
		// 預り
		data = azukariSet[this.props.order.azukari];
		rowList.push(NewOrderContents.createRow(rowNum, "", "預り", data));
		rowNum++;
		// 概算約定代金
		data = addComma(String(this.props.order.orderUkewatasiKingaku-this.props.order.orderTesuryou-this.props.order.orderSyouhizei)) + " 円";
		rowList.push(NewOrderContents.createRow(rowNum, "", "概算約定代金", data));
		rowNum++;
		// 概算手数料・消費税
		data = addComma(String(this.props.order.orderTesuryou+this.props.order.orderSyouhizei)) + " 円";
		rowList.push(NewOrderContents.createRow(rowNum, "", "概算手数料・消費税", data));
		rowNum++;
		// 概算受渡代金
		data = addComma(String(this.props.order.orderUkewatasiKingaku)) + " 円";
		rowList.push(NewOrderContents.createRow(rowNum, "", "概算受渡代金", data));
		rowNum++;
		// 注文番号
		if(this.props.phase === 3) {
			data = this.props.order.orderNumber;
			rowList.push(NewOrderContents.createRow(rowNum, "", "注文番号", data));
			rowNum++;
		}
		// 空白行
		rowList.push(NewOrderContents.createRow(rowNum, "", "", ""));
		rowNum++;
		// 承知
		if(this.props.order.syouti) {
			rowList.push(NewOrderContents.createRow(rowNum, " syouti", "承知済", ""));
			rowNum++;
		}
		// 残り行
		for(; rowNum < ROW_COUNT; rowNum++) {
			rowList.push(NewOrderContents.createRow(rowNum, "", "", ""));
		}
		return(
			<div className="order_contents">
				{rowList}
			</div>
		)
	}

	static createRow = (rowNum, className, header, data) => {
		return (
			<div key={rowNum} className={"row"+ (rowNum % 2) + (className !== ""? " " + className : "")}>
				<div className="header">{header}</div>
				<div className="data">{data}</div>
			</div>
		)
	}
}

class NewOrderAlertMessage extends React.Component {
	render() {
		if(this.props.phase === 2) {
			return(
				<div className="alert_message">
				</div>
			);
		}
		if(this.props.phase === 3) {
			return(
				<div className="alert_message">
					<div>
						■ ご注文は{formatMMDDHHMM_JP(String(this.props.order.orderDate))}に受付ました
					</div>
					<div>
						■ ご注文は注文一覧でご確認下さい
					</div>
				</div>
			);
		}
		return null;
	}
}

class OrderFooter extends React.Component {
	render() {
		const buttons = [];
		if(this.props.phase === 1) {
			buttons.push(<input type="button" key="confirm" className="confirm" value="注文確認へ" onClick={this.onClickConfirm} disabled={this.props.disabled} />);
		}
		if(this.props.phase === 2) {
			buttons.push(<input type="button" key="input" className="input" value="注文入力へ戻る" onClick={this.onClickInput(false)} />);
			buttons.push(<input type="button" key="complete" className="complete" value="注文発注" onClick={this.onClickComplete} />);
		}
		if(this.props.phase === 3) {
			buttons.push(<input type="button" key="input" className="input" value="注文入力へ戻る" onClick={this.onClickInput(true)} />);
			buttons.push(<input type="button" key="orderList" className="" value="注文一覧" onClick={this.onClickOrderList} />);
		}
		return(
			<div className="footer">
				{buttons}
			</div>
		)
	}
	
	onClickInput = (resetFlg) => () => {
		if(this.props.onClickInput) {
			this.props.onClickInput(resetFlg);
		}
	}
	onClickConfirm = () => {
		if(this.props.onClickConfirm) {
			this.props.onClickConfirm();
		}
	}
	onClickComplete = () => {
		if(this.props.onClickComplete) {
			this.props.onClickComplete();
		}
	}
	onClickOrderList = () => {
		if(this.props.onClickOrderList) {
			this.props.onClickOrderList();
		}
	}
}

class NewOrder extends React.Component {
	static propTypes = {
	
	}
	constructor(props) {
		super(props);
		this.newOrderInputLeftRef = null;
		this.newOrderInputRightRef = null;
	}
	render() {
		const orderProps = this.props.order;
		let left, right = null;
		if(this.props.phase === 1) {
			left = (
				<NewOrderInputLeft
					order={orderProps}
					kokyaku={this.props.kokyaku}
					issue={this.props.issue}
					{...this.props.inputOrderDispatch}
					onChangeTorihiki={this.onChangeTorihiki}
					ref={(component) => {this.newOrderInputLeftRef = component}}
				/>
			);
			right = (
				<NewOrderInputRight
					order={orderProps}
					issue={this.props.issue}
					{...this.props.inputOrderDispatch}
					ref={(component) => {this.newOrderInputRightRef = component}}
				/>
			);
		} else {
			left = (
				<NewOrderContents
					phase={this.props.phase}
					order={orderProps}
				/>
			);
			right = (
				<NewOrderAlertMessage
					phase={this.props.phase}
					order={orderProps}
				/>
			);
		}
		return(
			<div className="orderInfo">
				<NewOrderTitle 
					phase={this.props.phase}
					genkinSinyouKubun={orderProps.genkinSinyouKubun}
					baibaiKubun={orderProps.baibaiKubun}
				/>
				<div className="body">
					<div className="left">
						{left}
					</div>
					<div className="right">
						{right}
					</div>
				</div>
			</div>
		)
	}

	onChangeTorihiki = (val) => {
		const {genkinSinyouKubun, baibaiKubun} = torihikiToCode(val);
		if(this.props.inputOrderDispatch.onChangeTorihiki) {
			this.props.inputOrderDispatch.onChangeTorihiki(genkinSinyouKubun, baibaiKubun);
		}
	}

	onChangeCondition = (val) => {
		
	}

	onChangeExpireDay = (val) => {
		
	}

	onChangeAccount = (val) => {
		
	}

	getInputedVal = () => {
		const order = {
			...this.newOrderInputLeftRef.getInputedVal(),
			...this.newOrderInputRightRef.getInputedVal(),
		};
		return order;
	}
}

class Order extends React.Component {
	constructor(props) {
		super(props);
		this.newOrderRef = null;
		this.kokyakuInfoRef = null;
		this.issueInfoRef = null;
	}
	render() {
		let titleType = "";
		if(this.props.order.baibaiKubun === "1") {
			titleType = " uri";
		} else if(this.props.order.baibaiKubun === "3") {
			titleType = " kai";
		} else if(this.props.order.baibaiKubun === "5" || this.props.order.baibaiKubun === "7") {
			titleType = " genbikiwatasi";
		}
		const orderEnabled = (this.props.orderEnabled);
		let phase = "";
		if(this.props.phase === 1) phase = " phase1";
		if(this.props.phase === 2) phase = " phase2";
		if(this.props.phase === 3) phase = " phase3";
		return(
			<div className={"order" + titleType + phase}>
				<KokyakuInfo
					{...this.props.kokyaku}
					onChange={this.onChangeKokyaku}
					onClickClear={this.props.onClickClearKokyaku}
					onClickKanougakuSuii={this.props.onClickKanougakuSuii}
					errorCode={this.props.errorCode}
					ref={(component) => this.kokyakuInfoRef = component}
					unEditable={this.props.phase !== 1}
				/>
				<IssueInfo
					phase={this.props.phase}
					{...this.props.issue}
					positionList = {this.props.positionList}
					onChange={this.onChangeIssue}
					onClickFullBoard={this.props.onClickFullBoard}
					errorCode={this.props.errorCode}
					ref={(component) => this.issueInfoRef = component}
					unEditable={this.props.phase !== 1}
				/>
				<NewOrder
					phase={this.props.phase}
					kokyaku={this.props.kokyaku}
					issue={this.props.issue}
					order={this.props.order}
					inputOrderDispatch={this.props.inputOrderDispatch}
					errorCode={this.props.errorCode}
					ref={(component) => this.newOrderRef = component}
				/>
				<div className="message">{Order.createMessage(this.props.errorCode, this.props.message)}</div>
				<OrderFooter
					phase={this.props.phase}
					onClickInput={this.onClickInput}
					onClickConfirm={this.onClickConfirm}
					onClickComplete={this.onClickComplete}
					onClickOrderList={this.onClickOrderList}
					disabled={!orderEnabled}
				/>
			</div>
		)
	}

	componentDidUpdate() {
		if(this.props.errorCode !== "") {
			this.errorFocus();
		}
	}

	errorFocus() {
		switch(this.props.errorCode) {
			case "12095":		// 顧客コード不正
				this.kokyakuInfoRef.kokyakuRegistNRef.focus();
				this.kokyakuInfoRef.kokyakuRegistNRef.classList.add("error");
				break;
			case "12101":		// 銘柄不正
				this.issueInfoRef.issueCodeRef.focus();
				this.issueInfoRef.issueCodeRef.classList.add("error");
				break;
			case "12102":		// 銘柄市場不正
				this.issueInfoRef.marketCodeRef.focus();
				this.issueInfoRef.marketCodeRef.classList.add("error");
				break;
			case "11011":	// 注文値段区分不正
				this.newOrderRef.newOrderInputLeftRef.orderPriceKubunRef.focus();
				this.newOrderRef.newOrderInputLeftRef.orderPriceKubunRef.classList.add("error");
			case "11012":	// 注文値段不正
			case "11013":	// 注文数量不正
			case "11014":	// 現金信用区分不正
			case "11016":	// 注文期日不正
			case "11017":	// 逆指値注文種別不正
			case "11018":	// 逆指値条件不正
			case "11019":	// 逆指値値段区分不正
			case "11020":	// 逆指値値段不正
			case "11032":	// 不成注文に成行指定 >> 注文値段区分
			case "11033":	// 期限付注文執行条件エラー >> 執行条件
			case "11034":	// 逆指値注文執行条件エラー
			case "11035":	// 通常＋逆指値注文執行条件エラー
			case "11105":	// 銘柄マスタ.売買停止エラー >> 銘柄コード
			case "11106":	// 銘柄マスタ.場伝票出力有無エラー >> 銘柄コード
			case "11107":	// 銘柄マスタ.非課税口座エラー
			case "11108":	// 銘柄市場マスタレコードなし
			case "11109":	// 銘柄市場マスタ.前日終値なし(成行禁止) >> 注文値段区分
			case "11112":	// 銘柄マスタ.売買単位エラー
			case "11113":	// 銘柄市場マスタ.値幅エラー
			case "11114":	// 銘柄市場マスタ.制度信用エラー >> 取引
			case "11115":	// 銘柄市場マスタ.信用売建エラー >> 取引
			case "11116":	// 一般信用売建エラー >> 取引
			case "11118":	// 呼値エラー >> 注文単価
			case "11121":	// 逆指値段値幅エラー
			case "11123":	// 逆指値段呼値エラー
			break;
			default: break;
		}
	}

	static createMessage = (errorCode, message) => {
		if(errorCode) {
			return "[" + errorCode + "] " + message;
		}
		return "";
	}

	onChangeKokyaku = (kokyakuRegistN) => {
		//const {issueCode, marketCode} = this.issueInfoRef.getInputedVal();
		//const {issueCode, marketCode} = this.props.issue;
		if(this.props.onChangeKokyaku) {
			this.props.onChangeKokyaku(kokyakuRegistN);
		}
		this.issueInfoRef.focusInput = true;
	}

	onChangeIssue = (issueCode, marketCode) => {
		//const {kokyakuRegistN} = this.kokyakuInfoRef.getInputedVal();
		//const {kokyakuRegistN} = this.props.kokyaku;
		if(this.props.onChangeIssueMarket) {
			this.props.onChangeIssueMarket(issueCode, marketCode);
		}
	}

	onClickInput = (resetFlg) => {
		this.props.onToInput(resetFlg);
	}

	onClickConfirm = () => {
		const inputedKokyakuVals = this.kokyakuInfoRef.getInputedVal();
		const inputedIssueVals = this.issueInfoRef.getInputedVal();
		const inputedOrderVals = this.newOrderRef.getInputedVal();
		const order = {
			/* 確定した値で注文
			kokyakuRegistN: this.props.kokyaku.kokyakuRegistN,
			issueCode: this.props.issue.issueCode,
			marketCode: this.props.issue.marketCode,
			*/
			/* 入力値で注文 */
			...inputedKokyakuVals,
			...inputedIssueVals,
			teiseiTorikesiFlg: "1",
			...inputedOrderVals
		}
		this.props.onToConfirm(order);
	}

	onClickComplete = () => {
		this.props.onToComplete();
	}

	onClickOrderList = () => {
		let kokyakuRegistN = this.props.kokyaku.kokyakuRegistN;
		if(this.kokyakuInfoRef.getInputedVal().kokyakuRegistN) {
			kokyakuRegistN = this.kokyakuInfoRef.getInputedVal().kokyakuRegistN;
		}
		this.props.onClickOrderList(kokyakuRegistN);
	}
}

export default Order;