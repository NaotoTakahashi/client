import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import PropTypes from 'prop-types';
import Record from 'immutable';
import {addComma} from '../Utility';
import './FullBoard.css';
import {IssueMarketContainer} from '../containers/MIOSContainer';
import {MarketName} from '../reducers/MIOSReducer';
import {DisplayType} from '../reducers/FullBoardReducer';
//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
class TrParts1Td extends React.Component {
	render() {
		let ohlcData = this.props.ohlcData;
		let code = this.props.code;
		let value = ohlcData[code].value;
		if(code === "NOPV" && (value === "" && ohlcData["DPP"].value !== "")) {
			value = "0";
		}
		return (
			<tr>
				<th>{this.props.label}</th>
				<td className={ohlcData[code].className}>{FullBoard.addComma(value)}</td>
			</tr>
		);
	}
}
class TrParts2Td extends React.Component {
	render() {
		let ohlcData = this.props.ohlcData;
		let code = this.props.code;
		let value;
		let tdPluse;
		let colSpan = "1";
		let time;
		let cnt = code.indexOf(",");
		if(cnt > 0 && cnt !== code.length) {
			let codePluse = code.slice(0, cnt);
			code = code.slice(cnt+1);
			if(typeof this.props.addSign !== 'undefined' && typeof ohlcData[codePluse].value !== 'undefined') {
				value = OHLC.addSign(ohlcData[codePluse].value);
			} else {
				value = ohlcData[codePluse].value;
			}
			tdPluse = <td className={ohlcData[codePluse].className}>{FullBoard.addComma(value)}</td>;
		} else {
			colSpan = "2";
		}
		if(typeof this.props.addTime !== 'undefined' && typeof ohlcData[code+":T"].value !== 'undefined') {
			time = OHLC.addBracket(ohlcData[code+":T"].value);
		}
		if(typeof this.props.addSign !== 'undefined' && typeof ohlcData[code].value !== 'undefined') {
			value = OHLC.addSign(ohlcData[code].value);
		} else {
			value = ohlcData[code].value;
		}
		return (
			<tr>
				<th>{this.props.label}</th>
				{tdPluse}
				<td className={ohlcData[code].className} colSpan={colSpan}>{FullBoard.addComma(value)}&nbsp;{time}</td>
			</tr>
		);
	}
}
class FieldBox extends React.Component {
	render() {
		let ohlcData = this.props.ohlcData;
		let type = this.props.type;
		return (
			<div className={"OHLC_box_harf"}>
				<table className='OHLC_table'>
					<tbody>
						<TrParts2Td ohlcData={ohlcData} label={"終値"} code={type+"PP"}  addTime={true}/>
						<TrParts2Td ohlcData={ohlcData} label={"基準値比"} code={type+"YWP,"+type+"YRP"} addSign={true}/>
						<TrParts2Td ohlcData={ohlcData} label={"始値"} code={type+"OP"} addTime={true}/>
						<TrParts2Td ohlcData={ohlcData} label={"高値"} code={type+"HP"} addTime={true}/>
						<TrParts2Td ohlcData={ohlcData} label={"安値"} code={type+"LP"} addTime={true}/>
						<TrParts2Td ohlcData={ohlcData} label={"売買高"} code={type+"V"} addTime={true}/>
						<TrParts2Td ohlcData={ohlcData} label={"売買代金"} code={type+"J"}/>
						<TrParts2Td ohlcData={ohlcData} label={"VWAP"} code={type+"VWP"}/>
					</tbody>
				</table>
			</div>
		);
	}
}
class AyumiRow extends React.Component {
	render() {
		let type = this.props.type;
		return (
			<TrParts2Td ohlcData={this.props.ohlcData} label={"歩み"+type} code={"L"+type+"P"}  addTime={true}/>
		);
	}
}
class OHLC extends React.Component {
	render() {
		let ohlcData = this.props.board.ohlcData;
		let DPG = OHLC.convertDPG(ohlcData.DPG.value);
		let signDYRP = OHLC.decisionDYRP(ohlcData.DYRP.value);
		return (
			<div className={"OHLC_div"}>
				<div className={"OHLC_box_top"}>
					<table className='OHLC_table'>
						<tbody>
						<tr>
							<th colSpan="3">整理管理区分＆特設注意市場</th>
							<td className={"text_red"} colSpan="2">
								<span className={ohlcData.RSTS.className}>{OHLC.convertRSTS(ohlcData.RSTS.value, ohlcData.SPVS.value)}</span>
								<span className={ohlcData.SAMS.className}>{OHLC.convertSAMS(ohlcData.SAMS.value)}</span>
							</td>
							<th>売買単位</th>
							<td className={"unit_lot"} name="LOSH">{FullBoard.addComma(this.props.board.unitLot)}</td>
						</tr>
						<tr>
							<th>上限値</th>
							<td className={ohlcData.DSPH.className}>{FullBoard.addComma(ohlcData.DSPH.value)}</td>
							<th>下限値</th>
							<td className={ohlcData.DSPL.className}>{FullBoard.addComma(ohlcData.DSPL.value)}</td>
							<td colSpan="2"></td>
						</tr>
						</tbody>
					</table>
				</div>
				<div className={"OHLC_box_harf"}>
					<table className='OHLC_table'>
						<tbody>
						<tr>
							<th className="text_120" colSpan="2">現在値</th>
							<td className={"text_red text_120 " + ohlcData.DPS.className}>{OHLC.convertDPS(ohlcData.DPS.value, ohlcData.DPG.value, ohlcData.REGS.value, ohlcData.ZSS.value)}</td>
						</tr>
						<tr>
							<td className={"DPG " + DPG.className} colSpan="2">{DPG.sign}</td>
							<td className={"current_price " + ohlcData.DPP.className}>{FullBoard.addComma(ohlcData.DPP.value)}{OHLC.addBracket(ohlcData["DPP:T"].value)}</td>
						</tr>
						<tr>
							<th colSpan="2">基準比</th>
							<td className={ohlcData.DYRP.className}>{OHLC.addSign(ohlcData.DYWP.value)}{OHLC.addBracket(ohlcData.DYRP.value, "%")}</td>
						</tr>
						<tr>
							<th colSpan="2">約定数量</th>
							<td className={ohlcData.XV.className}>{FullBoard.addComma(ohlcData.XV.value)}{OHLC.addBracket(ohlcData["XV:T"].value)}</td>
						</tr>
						<tr>
							<th colSpan="2">前日値</th>
							<td className={ohlcData.PRP.className}>{FullBoard.addComma(ohlcData.PRP.value)}</td>
						</tr>
						<tr>
							<th>前日比</th>
							<td className={"text_right " + signDYRP.className}>{signDYRP.sign}</td>
							<td className={ohlcData.DYRP.className}><span className={signDYRP.className}>{OHLC.addSign(ohlcData.DYRP.value)}</span></td>
						</tr>
						</tbody>
					</table>
				</div>
				<div className={"OHLC_box_harf"}>
					<table className='OHLC_table'>
						<tbody>
							<TrParts1Td ohlcData={ohlcData} label={"基準値"} code={"DSP"}/>
							<TrParts1Td ohlcData={ohlcData} label={"始値"} code={"DOP"}/>
							<TrParts1Td ohlcData={ohlcData} label={"高値"} code={"DHP"}/>
								<TrParts1Td ohlcData={ohlcData} label={"安値"} code={"DLP"}/>
							<TrParts1Td ohlcData={ohlcData} label={"約定回数"} code={"NOPV"}/>
							<TrParts1Td ohlcData={ohlcData} label={"売買高"} code={"DV"}/>
							<TrParts1Td ohlcData={ohlcData} label={"売買代金"} code={"DJ"}/>
							<TrParts1Td ohlcData={ohlcData} label={"VWAP"} code={"VWAP"}/>
						</tbody>
					</table>
				</div>
				<div className={"OHLC_box_harf"}>
					<table className='OHLC_table'>
						<tbody>
						<tr>
							<th>売気配</th>
							<td className={ohlcData.QAP.className}>{FullBoard.addComma(ohlcData.QAP.value)}</td>
							<td className={ohlcData.AV.className}>{FullBoard.addComma(ohlcData.AV.value)}</td>
							<td className={ohlcData["QAP:T"].className}>{OHLC.addBracket(ohlcData["QAP:T"].value)}</td>
						</tr>
						<tr>
							<th>買気配</th>
							<td className={ohlcData.QBP.className}>{FullBoard.addComma(ohlcData.QBP.value)}</td>
							<td className={ohlcData.BV.className}>{FullBoard.addComma(ohlcData.BV.value)}</td>
							<td className={ohlcData["QBP:T"].className}>{OHLC.addBracket(ohlcData["QBP:T"].value)}</td>
						</tr>
						<tr>
							<th colSpan="2">Up Tick</th>
							<td className={ohlcData.NUPT.className} colSpan="2"><span className="up">{ohlcData.NUPT.value}</span></td>
						</tr>
						<tr>
							<th colSpan="2">Down Tick</th>
							<td className={ohlcData.NDWT.className} colSpan="2"><span className="down">{ohlcData.NDWT.value}</span></td>
						</tr>
						</tbody>
					</table>
				</div>
				<div className={"OHLC_box_harf"}>
					<table className='OHLC_table'>
						<tbody>
							<AyumiRow ohlcData={ohlcData} type={"1"} />
							<AyumiRow ohlcData={ohlcData} type={"2"} />
							<AyumiRow ohlcData={ohlcData} type={"3"} />
							<AyumiRow ohlcData={ohlcData} type={"4"} />
						</tbody>
					</table>
				</div>
				<div className={"OHLC_box_harf title"}>
					<span>前場</span>
				</div>
				<div className={"OHLC_box_harf title"}>
					<span>後場</span>
				</div>
				<FieldBox ohlcData={ohlcData} type={"1"} />
				<FieldBox ohlcData={ohlcData} type={"2"} />
			</div>
		);
	}
	componentDidMount() {
		this.mTimerId = setInterval(() => {this.resetUpdateTime()}, this.TIMER_INTERVAL);
	}
	resetUpdateTime = () => {
		this.props.onResetUpdateTime(this.props.board.displayType);
	}
	static addParts(val, parts) {
		if(val !== null && typeof val !== 'undefined' && val !== "") 
			return parts;
		return;
	}/*
	static viewInitial(val, initial) {
		if(val === null || typeof val === 'undefined' || val === "") 
			return initial;
		return;
	}*/
	static addBracket(val, unit="") {
		if(val !== null && typeof val !== 'undefined' && val !== "")
			return "(" + val + unit + ")";
		return val;
	}
	static addSign(val) {
		if(isNaN(Number(val)) || Number(val) <= 0)
			return val;
		return "+" + val;
	}
	static getSign(className) {
		if(className.match(/_plus$/))
			return "+";
		if(className.match(/_minus$/))
			return "-";
		return;
	}
	static convertMarketCode(issueCode, marketCode) {
		if(issueCode){
			let result =".";
			if(marketCode === "00") {
				return result + "1";
			} else if(marketCode === "02") {
				return result + "3";
			} else if(marketCode === "05") {
				return result + "";
			} else if(marketCode === "07") {
				return result + "";
			}
		}
		return;
	}
	static convertRSTS(valRSTS, varSPVS) {
		if(valRSTS === "整理") {
			return "整";
		} else if(valRSTS === "監理") {
			if(varSPVS === "0351") {
				return "審";
			} else if(varSPVS === "0352") {
				return "確";
			} else if(varSPVS === "0353") {
				return "監";
			}
		}
		return;
	}
	static convertSAMS(val) {
		if(val === "0354")
			return "特";
		return;
	}
	static convertDPS(valDPS, valDPG, varREGS, valZSS) {
		if(valDPS === null || typeof valDPS === 'undefined' || valDPS === "") {
			return;
		} else if(valDPG === "0061") {
			return "終値引";
		} else if(Number(valDPG) >= 60 && 69 >= Number(valDPG)) {
			return "ザラバ引";
		} else if(valDPS === "0012") {
			return "板寄";
		} else if(valDPS === "0014") { // 売買停止
			if(varREGS === "0000") {	// 規制フラグ（受付可不可
				return "売（可）";
			} else if(varREGS === "0090") {
				return "売（不可）";
			} else {
				return "売";
			}
		} else if(valDPS === "0013") {
			return "中断";
		} else if(valZSS === "0001" || valZSS === "0002") {
			if(valDPS === "0011") {
				return "立会中";
			} else if(valDPS === "0000"){
				return "受付中";
			}
		}
		return;
	}
	static convertDPG(val) {
		if(val === "0057") {
			return { sign: "↑", className: "up" };
		} else if(val === "0058") {
			return { sign: "↓", className: "down" };
		}
		return { sign: "", className: "" };
	}
	static decisionDYRP(val) {
		if(val !== "") {
			if(isNaN(Number(val)) || Number(val) <= 0)
				return { sign: "▼", className: "minus" };
			return { sign: "▲", className: "plus" };
		}
		return { sign: "", className: "" };
	}
}
/*class BoardRow extends React.Component {
	render() {
		let index = this.props.index;
		let base = {className:"", value:""};
		let ask = {flag: base,col1: base, col2: base, col3: base};
		let bid = {flag: base,col1: base, col2: base, col3: base};
		let price = base;
		if(typeof this.props.askList[index] !== 'undefined'){
			ask = this.props.askList[index];
			bid = this.props.bidList[index];
			price = this.props.priceList[index];
		}
		return (
			<tr className={"row"+(index+1)%2} name={"price-" + index} key={index}>
				<td className={"bid "+ bid.col3.className} name="order-count-bid">{FullBoard.addComma(bid.col3.value)}</td>
				<td className={"bid "+ bid.col2.className} name="order-lot-bid">{FullBoard.addComma(bid.col2.value)}</td>
				<td className={"bid lot "+ bid.col1.className} name="order-totalLot-bid">{FullBoard.addComma(bid.col1.value)}</td>
				<td className={"bid flag "+ bid.flag.className} name="order-flag-bid">{bid.flag.value}</td>
				<td className={price.className} name="order-price" onDoubleClick={this.onDoubleClickBoard}>{FullBoard.addComma(price.value)}</td>
				<td className={"ask flag "+ ask.flag.className} name="order-flag-ask">{ask.flag.value}</td>
				<td className={"ask lot "+ ask.col1.className} name="order-totalLot-ask">{FullBoard.addComma(ask.col1.value)}</td>
				<td className={"ask "+ ask.col2.className} name="order-lot-ask">{FullBoard.addComma(ask.col2.value)}</td>
				<td className={"ask "+ ask.col3.className} name="order-count-ask">{FullBoard.addComma(ask.col3.value)}</td>
			</tr>
		);
	}
	onDoubleClickBoard = (event) => {
		let price = this.props.priceList[this.props.index].value;
		this.props.onChangeCenterPrice(price);
	}
}*/
class BoardTable extends React.Component {
	render() {
		//const ROW_COUNT = 23;
		let board = this.props.board;
		let dataList = board.boardDataList;
		let displayType = board.displayType;
		let centerPrice = board.centerPrice.data;
		if(centerPrice == 0)
			centerPrice = board.basePrice.data;

		let askList = {};
		let bidList = {};
		let priceList = {};
		let base = {className:"", value:""};
		let rowCount = 3;
		let items = [];
		for(let key of dataList.toSeq().keySeq()) {
		//Object.keys(dataList.toSeq().keySeq()).map((index, key) => {
		//dataList.keySeq().map(key => {
			let data = dataList.get(key);
			if(data.price.type === 2){
				askList[0] = {flag: base, col1:data.closeLot.ask, col2:base, col3:base};
				bidList[0] = {flag: base, col1:data.closeLot.bid, col2:base, col3:base};
				priceList[0] = {className:"", value:"引成"};
				askList[1] = {flag: base, col1:data.lot.ask, col2:base, col3:base};
				bidList[1] = {flag: base, col1:data.lot.bid, col2:base, col3:base};
				priceList[1] = {className:"", value:"成行"};
				if(displayType === DisplayType["Normal"].stat){
					askList[0].col2 = data.closeCount.ask;
					bidList[0].col2 = data.closeCount.bid;
					askList[1].col2 = data.count.ask;
					bidList[1].col2 = data.count.bid;
				}
			} else if(data.price.type === "0"){
				if(rowCount === 3){
					askList[2] = BoardTable.decisionBidAsk("ask", displayType, data, base);
					bidList[2] = BoardTable.decisionBidAsk("bid", displayType, data, base);
					priceList[2] = {className:"", value:"OVER"};
				} else {
					askList[rowCount/*22*/] = BoardTable.decisionBidAsk("ask", displayType, data, base);
					bidList[rowCount/*22*/] = BoardTable.decisionBidAsk("bid", displayType, data, base);
					priceList[rowCount/*22*/] = {className:"", value:"UNDER"};
				}
			} else if(data.price.type === 1){
				askList[rowCount] = BoardTable.decisionBidAsk("ask", displayType, data, base);
				bidList[rowCount] = BoardTable.decisionBidAsk("bid", displayType, data, base);
				priceList[rowCount] = BoardTable.convertPrice(data.price, board.ohlcData, rowCount);
				rowCount++;
			}

			let ask = {flag: base,col1: base, col2: base, col3: base};
			let bid = {flag: base,col1: base, col2: base, col3: base};
			let price = base;
			if(typeof askList[key] !== 'undefined'){
				ask = askList[key];
				bid = bidList[key];
				price = priceList[key];
			}
			items.push(
				<tr className={"row"+(Number(key)+1)%2} name={"price-" + key} key={key}>
					<td className={"bid count "+ bid.col3.className} onDoubleClick={() => this.onDoubleClickBoard("1", price.value)}>{FullBoard.addComma(bid.col3.value)}</td>
					<td className={"bid count "+ bid.col2.className} onDoubleClick={() => this.onDoubleClickBoard("1", price.value)}>{FullBoard.addComma(bid.col2.value)}</td>
					<td className={"bid lot "+ bid.col1.className} onDoubleClick={() => this.onDoubleClickBoard("1", price.value)}>{FullBoard.addComma(bid.col1.value)}</td>
					<td className={"bid flag "+ bid.flag.className} >{bid.flag.value}</td>
					<td className={price.className} name="order-price" onDoubleClick={() => this.onDoubleClickPrice(price.value)}>{FullBoard.addComma(price.value)}</td>
					<td className={"ask flag "+ ask.flag.className}>{ask.flag.value}</td>
					<td className={"ask lot "+ ask.col1.className} onDoubleClick={() => this.onDoubleClickBoard("3", price.value)}>{FullBoard.addComma(ask.col1.value)}</td>
					<td className={"ask count "+ ask.col2.className} onDoubleClick={() => this.onDoubleClickBoard("3", price.value)}>{FullBoard.addComma(ask.col2.value)}</td>
					<td className={"ask count "+ ask.col3.className} onDoubleClick={() => this.onDoubleClickBoard("3", price.value)}>{FullBoard.addComma(ask.col3.value)}</td>
				</tr>
			);
		}//)
		return (
			<tbody>
				{items}
				{/*Object.keys(dataList).map((key, index) => {
				//dataList.keySeq().map(key => {
					//let data = dataList[key];
					return (
						<BoardRow
							index={key}
							askList={askList}
							bidList={bidList}
							priceList = {priceList}
							onChangeCenterPrice={this.props.onChangeCenterPrice}
							key={key}
						/>
					)
				})*/}
			</tbody>
		);
	}
	onDoubleClickPrice = (price) => {
		let chkPattern = /^[-+]?[0-9]+(\.[0-9]+)?$/;
		if(price === "OVER"){
			price = this.props.board.boardDataList[2].price.data + '';
		} else if(price === "UNDER"){
			price = this.props.board.boardDataList[20].price.data + '';
		}
  		if(price.match(chkPattern)){
			if(+price === this.props.board.centerPrice.data)
				price = "0";
			this.props.onChangeCenterPrice(price);
		}
	}
	onDoubleClickBoard = (baibaiKubun, price) => {
		let board = this.props.board;
		let chkPattern = /^[-+]?[0-9]+(\.[0-9]+)?$/;
		// 注文への連動
		if(price.match(chkPattern) || price.match(/成/)){
			this.props.onShowOrderFrame("ORDER", "注文", 850, (70+3+177+340+20+40+26), false)
			 if (price === "引成"){
				this.props.onClickBuySell(board.issueCode, board.marketCode, baibaiKubun, "1", "", "4")
			} else if (price === "成行"){
				this.props.onClickBuySell(board.issueCode, board.marketCode, baibaiKubun, "1", "", "")
			} else {
				this.props.onClickBuySell(board.issueCode, board.marketCode, baibaiKubun, "2", price, "")
			}
		}
	}
	static decisionBidAsk(bidAsk, dispType, data, base) {
		let col1 = data.lot[bidAsk];
		let col2 = base;
		let col3 = base;
		if (dispType === DisplayType["Closing"].stat) {
			col2 = data.closeLot[bidAsk];
			col3 = data.closeCount[bidAsk];
			col2 = col2.set("className", "closeLot " + col2.className);
		} else {
			col2 = data.count[bidAsk];
			col3 = data.totalLot[bidAsk];
			col3 = col3.set("className", "totalLot " + col3.className);
		}
		let flag = BoardTable.convertFlag(bidAsk, data, base);
		return {flag: flag,col1: col1, col2: col2, col3: col3};
	}
	static convertFlag(bidAsk, data, base) {
		let flag = base;
		if (data.status[bidAsk].value == "101") {	// 一般気配
			//flag = data.closeLot[bidAsk];
			flag = {className: data.status[bidAsk].className, value:""};
		} else if (data.status[bidAsk].value == "102") {	// 特別気配
			//flag = data.closeLot[bidAsk];
			if(bidAsk === "ASK"){
				flag = {className: data.status[bidAsk].className, value:"カ"};
			} else{
				flag = {className: data.status[bidAsk].className, value:"ウ"};
			}
		} else if (data.status[bidAsk].value == "118") {	// 連続約定気配
			//flag = data.closeLot[bidAsk];
			if(bidAsk === "ASK"){
				flag = {className: data.status[bidAsk].className, value:"Ｋ"};
			} else{
				flag = {className: data.status[bidAsk].className, value:"Ｕ"};
			}
		}
		if (data.cross[bidAsk].value == "91") {	// 更新値幅内
			//flag = data.closeLot[bidAsk];
			flag = {className: flag.className+data.cross[bidAsk].className, value:flag.value+"＃"};
		} else if (data.cross[bidAsk].value == "92") {	// 更新値幅外
			//flag = data.closeLot[bidAsk];
			flag = {className: flag.className+data.cross[bidAsk].className, value:flag.value+"＊"};
		}
		return flag;
	}
	static convertPrice(priceData, ohlcData, rowCount) {
		let price = priceData.data.toFixed(priceData.decimalPoint);
		let className = "price"/*priceData.data.className,*/;
		let highPrice = ohlcData.DHP.value;
		let lowPrice = ohlcData.DLP.value;
		let nowPrice = ohlcData.DPP.value;
		if(price === highPrice)
			className = className + " high";
		if(price === lowPrice)
			className = className + " low";
		if(price === nowPrice)
			className = className + " now";
		if(rowCount == 12)
			className = className + " center";
		return { className:className, value:price };
		/*if(priceData.type === 2) {
			return {className:"", value:"成行", type:priceData.type};
		} else if(priceData.type === 1) {
			const adjustVal = Math.pow(10, priceData.decimalPoint);
			//const price = priceData.data / adjustVal;
			const price = parseFloat(priceData.data).toFixed(priceData.decimalPoint);
			return {className:priceData.data.className, value:price, type:priceData.type};
		} else if(priceData.type === "0") {
			// OVER UNDER?
			if (priceData.type === "0") {
				return {className:"", value:"", type:priceData.type};
			} else {
				return {className:"", value:"", type:priceData.type};
			}
		}*/
	}
}
class Closing extends React.Component {
	render() {
		return (
			<tr className="row0" name="market-order">
				<td className="title blue">引件数</td>
				<td className="title blue">引数量</td>
				<td className="title blue">売数量</td>
				<td className="title flag">&nbsp;</td>
				<td className="price">値段</td>
				<td className="title flag">&nbsp;</td>
				<td className="title red">買数量</td>
				<td className="title red">引数量</td>
				<td className="title red">引件数</td>
			</tr>
		);
	}
}
class Normal extends React.Component {
	render() {
		return (
			<tr className="row0" name="market-order">
				<td className="title blue">売累計</td>
				<td className="title blue">売件数</td>
				<td className="title blue">売数量</td>
				<td className="title flag">&nbsp;</td>
				<td className="price">値段</td>
				<td className="title flag">&nbsp;</td>
				<td className="title red">買数量</td>
				<td className="title red">買件数</td>
				<td className="title red">買累計</td>
			</tr>
		);
	}
}
class ChangeDispButton extends React.Component {
	render() {
		let currentDispType = this.props.displayType;
		let buttonItems = [];
		//for (const dispType of DisplayType){
		Object.keys(DisplayType).map((key) => {
			let dispType = DisplayType[key];
			let className = null;
			let onClick = () => this.props.onChangeDisplay(dispType.stat);
			if (currentDispType === dispType.stat){
				className = "disabled";
				onClick = null; 
			}
			buttonItems.push(
				<Button onClick={onClick} key={dispType.stat} className={className}>{dispType.name}</Button>
			);
		})
	return (
			<div className={"info_box_right"}>
				{buttonItems}
			</div>
		);
	}
}	
class OHLCBoardHeader extends React.Component {
	render() {
		return (
			<tbody>
				<tr>
					<td className="issue_code">
						{this.props.board.issueCode}{/*OHLC.addParts(this.props.board.issueCode, ".")*/}
						{OHLC.convertMarketCode(this.props.board.issueCode, this.props.board.marketCode)}
					</td>
					<td className="sizyou">{OHLC.addParts(this.props.board.issueCode, MarketName[this.props.board.marketCode])}</td>
					<td className="issue_name">{this.props.board.issueName}</td>
					<td className="loan_type">{FullBoard.convertLoanType(this.props.board.loanType)}
						{/*<span className="loan_type">{FullBoard.convertLoanType(this.props.board.loanType)}</span>
						<span className={ohlcData.MRGNS.className}>{ohlcData.MRGNS.value}</span>*/}
					</td>
					<td className="short_flag">{FullBoard.convertShortFlag(this.props.board.shortFlag)}{/*ohlcData.KARA.value*/}</td>
				</tr>
			</tbody>
		);
	}
}
class BoardHeader extends React.Component {
	constructor(props) {
		super(props)
		this.TIMER_INTERVAL = 500;
		this.issueCodeRef = null;
		this.marketCodeRef = null;
		this.centerPriceRef = null;
	}
	render() {
		let board = this.props.board;
		//let centerPrice = BoardHeader.convertPrice(board.centerPrice);
		if(board.clearCenterPriceFlag) {
			this.centerPriceRef.value = '';
			this.props.toClearCenterPrice();
		}
		return (
			<div className={"fullboard_header"}>
				<div className={"info_box_left"} onDrop={this.props.onDrop}>
					<span className="title">銘柄CD&nbsp;</span>
					<IssueMarketContainer
						issueCode = {board.issueCode}
						marketCode = {board.marketCode}
						className = "board_input"
						onChange = {this.onChange}
						issueRef={(input) => this.issueCodeRef = input}
						marketRef={(select) => this.marketCodeRef = select}
					/>
					{/*<span className="fa fa-search search-icon" aria-hidden="true"></span>*/}
					<span className="issue_name">{board.issueName}</span>
				</div>
				<div className={"info_box_right"}>
					<span className="loan_type">{FullBoard.convertLoanType(board.loanType)}</span>
					<span className="unit_lot">{FullBoard.addComma(board.unitLot)}</span>
					<span className="short_flag">{FullBoard.convertShortFlag(this.props.board.shortFlag)}</span>
				</div>

				<div className={"info_box_left clear_box center_price_box"}>
					<span className="title">中心値段&nbsp;</span>
					<input
						className={"center_price_input"}
						type="text"
						size="10"
						//defaultValue={centerPrice}
						defaultValue=''
						ref={(input) => this.centerPriceRef = input}
						onKeyPress={this.onKeyPress}
					/>
					<Button onClick={() => this.onConnectChangeCenterPrice()}>表示</Button>
					<Button onClick={() => this.onConnectChangeCenterPrice("0")}>クリア</Button>
					<span className="market_info">{BoardHeader.convertStopFlag(board.stopFlag)}{BoardHeader.convertShortFlag(board.shortFlag)}</span>
				</div>
				<ChangeDispButton 
					displayType={this.props.board.displayType}
					onChangeDisplay={this.props.onChangeDisplay}
				/>
			</div>
		);
	}
	componentDidMount() {
		this.mTimerId = setInterval(() => {this.resetUpdateTime()}, this.TIMER_INTERVAL);
		let centerPrice = this.props.board.centerPrice.data;
		if(centerPrice == 0) centerPrice = '';
		this.centerPriceRef.value = centerPrice;
		this.focusInput();
	}
	/*componentDidUpdate() {
		let centerPrice = this.props.board.centerPrice.data;
		if(centerPrice == 0){
			this.centerPriceRef.defaultValue = '';
		}else{
			this.centerPriceRef.defaultValue = centerPrice;
		}
	}*/
	resetUpdateTime = () => {
		this.props.onResetUpdateTime(this.props.board.displayType);
	}
	componentWillUnmount() {
		clearInterval(this.mTimerId);
	}
	onFrameActive = () => {
		this.focusInput();
	}
	focusInput = () => {
		this.issueCodeRef.focus();
		this.issueCodeRef.select();
	}
	onChange = (issueCode, marketCode) => {
		if (this.props.onChangeIssue)
			this.props.onChangeIssue(issueCode, marketCode);
	}
	onConnectChangeCenterPrice = (newPrice = this.centerPriceRef.value) => {
		if (this.props.onChangeCenterPrice)
			this.props.onChangeCenterPrice(newPrice);
	}
	onKeyPress = (e) => {
		if(e.key !== "Enter")
			return;
		//let input = e.target;
		//let prevPrice = input.defaultValue;
		this.onConnectChangeCenterPrice();
	}
	static convertStopFlag(val) {
		if(val === "1")
			return "売買停止";
		return;
	}
	static convertShortFlag(val) {
		if(val === "1")
			return "空売規制";
		return;
	}
	static convertPrice(priceData) {
		if(priceData.type === 1) {
			const adjustVal = Math.pow(10, priceData.decimalPoint);
			const price = priceData.data / adjustVal;
			return price;
		}
		return "";
	}
}
class ModalMessage extends React.Component {
	render() {
		let className = null;
		if(this.props.message !== "") {
			className = " on_disp";
		}
		return (
			<div className={"message_overlay" + className} onClick={() => this.handleClose()}>
				<div className="message_content">
					{this.props.message}
				</div>
			</div>
			/*<Modal className="modal_message" show={this.props.message !== ""} container={this.props.parent} onHide={() => this.handleClose()} animation={false}>
				<Modal.Body>
					<div className="message">{this.props.message}</div>
				</Modal.Body>
			</Modal>*/
		);
	}
	handleClose() {
		this.props.onSetMessage("");
	}
}

class FullBoard extends React.Component {
	render() {
		let displayType = this.props.board.displayType;
		let className = '';
		let contents = null;
		if(displayType === DisplayType["OHLC"].stat) {
			className = 'OHLC';
			contents = <OHLC
							board={this.props.board}
							onChangeDisplay={this.props.onChangeDisplay}
							onResetUpdateTime={this.props.onResetUpdateTime}
						/>;
		} else {
			className = 'fullboard';
			let tableHeader = '';
			if(displayType === DisplayType["Closing"].stat){
				tableHeader = <Closing board={this.props.board} />
			} else {
				tableHeader = <Normal board={this.props.board} />
			}
			contents = <table className='fullboard_table' name={'fullBoard'}>
						<thead>{tableHeader}</thead>
						<BoardTable 
							board={this.props.board}
							onChangeCenterPrice={this.onChangeCenterPrice}
							onShowOrderFrame={this.props.onShowOrderFrame}
							onClickBuySell={this.props.onClickBuySell}
						/>
					</table>;
		}
		return (
			<div className={className+" modal_container"}>
				<ModalMessage 
					message={this.props.board.message}
					onSetMessage={this.props.onSetMessage}
					parent = {this}
				/>
				<BoardHeader 
					board={this.props.board}
					onChangeIssue={this.onChangeIssue}
					onChangeCenterPrice={this.onChangeCenterPrice}
					toClearCenterPrice={this.props.toClearCenterPrice}
					onChangeDisplay={this.props.onChangeDisplay}
					onResetUpdateTime={this.props.onResetUpdateTime}
					onDrop={this.onDrop}
					ref='mBoardHeader'
				/>
				{contents}
			</div>
		);
	}
	componentDidMount() {
		if(this.props.frame) {
			this.props.frame.handlers.registOnActivateMouseUp(this.onFrameActive);
		}
	}
	componentWillUnmount() {
		if(this.props.board.issueCode) {
			this.props.onResetBoard();
		}
	}
	onDrop = (e) => {
		let issueCode = e.dataTransfer.getData("text");
		this.onChangeIssue(issueCode);
	}
	onChangeIssue = (issueCode, marketCode = this.props.board.marketCode) => {
		if (issueCode !== this.props.board.issueCode || marketCode !== this.props.board.marketCode){
			const chkPattern = /^[0-9]{0,4}?$/;
			if(issueCode.match(chkPattern)) {
				this.refs.mBoardHeader.centerPriceRef.value = "";
				this.props.onChangeIssueMarket(issueCode, marketCode);
			} else {
				this.props.onSetMessage("銘柄コードが正しくありません");
			}
		}
	}
	onChangeCenterPrice = (newPrice)  => {
		let prevPrice = this.props.board.centerPrice.data;
		let chkPattern = /^[-+]?[0-9]+(\.[0-9]+)?$/;
		let issueCode = this.props.board.issueCode;
		let marketCode = this.props.board.marketCode;
		if(issueCode && newPrice != prevPrice && newPrice.match(chkPattern)) {
			let price = parseFloat(newPrice);
			let priceDec = 0;
			let priceType = 1;
			//let priceDec = this.props.board.centerPrice.decimalPoint;
			let decCount = newPrice.indexOf(".");
			if(decCount > 0) {
				priceDec = newPrice.slice(decCount+1).length;
				//price = parseInt(centerPrice) * Math.pow(10, priceDec);
			}
			if(newPrice === "0") {
				priceType = 0;
				this.refs.mBoardHeader.centerPriceRef.value = "";
			} else {
				this.refs.mBoardHeader.centerPriceRef.value = price;
			}
			this.props.onChangeIssueMarket(issueCode, marketCode, priceType, priceDec, price);
		}
	}
	static addComma(val) {
		if(val === 0)
			return "";
		if(val === null || typeof val === undefined || val === "" || val === 0)
			return val;
		return addComma(String(val));
	}
	static getSign(className) {
		if(className.match(/_plus$/))
			return "+";
		if(className.match(/_minus$/))
			return "-";
		return "";
	}
	static convertLoanType(val) {
		if(val === "1") {
			return "貸借";
		} else if(val === "2") {
			return "制度信用";
		}
		return;
	}
	static convertShortFlag(val) {
		if(val === "1") 
			return "空売";
		return "";
	}
}

FullBoard.propTypes = {
	//frame: PropTypes.instanceOf(Frame).isRequired,
	board: PropTypes.instanceOf(Record).isRequired,
	onSetMessage: PropTypes.func.isRequired,
	onResetUpdateTime: PropTypes.func.isRequired,
	onChangeIssueMarket: PropTypes.func.isRequired,
	onChangeDisplay: PropTypes.func.isRequired,
};

export default FullBoard;