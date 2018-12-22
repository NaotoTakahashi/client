import React from 'react';
import PropTypes from 'prop-types';
import './Asset.css';
import {addComma, formatMMDD_JP, formatMMDDHHMM_JP} from "../Utility";

//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
const errorClass = (errorCode, errorProps) => {
	return (errorCode === errorProps? " error" : "");
}
export class KokyakuInfo extends React.Component {
	constructor() {
		super();
		this.kokyakuRegistNRef = null;
		this.focusInput = false;
	}
	render() {
		let kokyakuNameKanzi = "";
		if(this.props.kokyakuNameKanzi && this.props.kokyakuNameKanzi !== "" && this.props.errorCode === "") {
			kokyakuNameKanzi = this.props.kokyakuNameKanzi + " 様";
		}
		let updateTime = "";
		if(this.props.updateTime && this.props.updateTime !== "0" && this.props.errorCode === "") {
			updateTime = formatMMDDHHMM_JP(this.props.updateTime) + " 現在";
		}
		return(
			<div className="kokyakuInfo">
				<div className="kokyakuRegistN">
					顧客コード
					<input
						type="text"
						maxLength="7"
						className={errorClass("95", this.props.errorCode)}
						key={this.props.kokyakuRegistN}
						defaultValue={this.props.kokyakuRegistN}
						onKeyPress={this.onKeyPress}
						onBlur={this.onBlur}
						ref={(input) => this.kokyakuRegistNRef = input}
					/>
				</div>
				<div className="kokyakuNameKanzi">
					<div>{kokyakuNameKanzi}</div>
				</div>
				<div className="update">
					<div>{updateTime}</div>
				</div>
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

//	onBlur = (e) => {
//		const inputForm = e.target;
//		if(this.props.onChange) {
//			this.props.onChange(e.target.value);
//		}
//	}

	getInputedVal = () => {
		return {
			kokyakuRegistN: this.kokyakuRegistNRef.value
		};
	}

	static convertMarkToMaketTypes(val) {
		if(MarkToMaketTypes[val])
			return MarkToMaketTypes[val];
		else
			return "";
	}
}

KokyakuInfo.propTypes = {
	kokyakuRegistN: PropTypes.string,
	kokyakuNameKanzi: PropTypes.string,
	updateTime: PropTypes.string,
	nearaiKubun: PropTypes.string,
	onChange: PropTypes.func,
};

export class KanougakuSuii extends React.Component {
	constructor() {
		super();
	}
	render() {
		let sinyouKouzaKubun = this.props.kokyakuInfo.sinyouKouzaKubun;
		let data;
		if (this.props.kanougakuSuii && ( this.props.errorCode === "0" || this.props.errorCode === "") ) {
			data = this.props.kanougakuSuii;
		} else {
			let rec = {
				day: "0",
				azukarikin: "0",
				zyutoukin: "0",
				hibakarikousokukin: "0",
				sonotakousokukin: "0",
				fusokugaku: "0",
				kanougakuGenbutuKai: "0",
				kanougakuTousinKai: "0",
				kanougakuSyukkin: "0",
			}
			let list = [];
			list.push(rec);
			list.push(rec);
			list.push(rec);
			list.push(rec);
			list.push(rec);
			list.push(rec);
			data = list;
			sinyouKouzaKubun = "0";
		}
/*		const azukari = [];
		const zyutou = [];
		const syukkin = [];
		for (let i = 0; i < data.length; i++) {
			azukari.push(
				<td class="row2">{addComma(data[i].azukarikin)}</td>
			);
			if (i === 1) {
				zyutou.push(
					<td class="row1">-</td>
				);
				syukkin.push(
					<td class="row1">-</td>
				);
			} else {
				zyutou.push(
					<td class="row1">{addComma(data[i].zyutoukin)}</td>
				);
				syukkin.push(
					<td class="row1">{addComma(data[i].kanougakuSyukkin)}</td>
				);
			}
		}*/
		const sinyouData = [];
		const sinyouKanougaku = [];
		if (sinyouKouzaKubun === "1"){
			sinyouData.push(
				<tr>
					<th colspan="2" class="row2_span2">現金保証金</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].genkinHosyoukin)}>{addComma(data[0].genkinHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].genkinHosyoukin)}>{addComma(data[1].genkinHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].genkinHosyoukin)}>{addComma(data[2].genkinHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].genkinHosyoukin)}>{addComma(data[3].genkinHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[4].genkinHosyoukin)}>{addComma(data[4].genkinHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[5].genkinHosyoukin)}>{addComma(data[5].genkinHosyoukin)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row1_span2">代用証券評価額</th>
					<td class={"row1" + KanougakuSuii.checkMinus(data[0].daiyouHyoukagaku)}>{addComma(data[0].daiyouHyoukagaku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[1].daiyouHyoukagaku)}>{addComma(data[1].daiyouHyoukagaku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[2].daiyouHyoukagaku)}>{addComma(data[2].daiyouHyoukagaku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[3].daiyouHyoukagaku)}>{addComma(data[3].daiyouHyoukagaku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[4].daiyouHyoukagaku)}>{addComma(data[4].daiyouHyoukagaku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[5].daiyouHyoukagaku)}>{addComma(data[5].daiyouHyoukagaku)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row2_span2">差入保証金</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].sasiireHosyoukin)}>{addComma(data[0].sasiireHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].sasiireHosyoukin)}>{addComma(data[1].sasiireHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].sasiireHosyoukin)}>{addComma(data[2].sasiireHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].sasiireHosyoukin)}>{addComma(data[3].sasiireHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[4].sasiireHosyoukin)}>{addComma(data[4].sasiireHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[5].sasiireHosyoukin)}>{addComma(data[5].sasiireHosyoukin)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th rowspan="5" className="row1_head">信用建株</th>
					<th class="row1">評価損</th>
					<td class={"row1" + KanougakuSuii.checkMinus(data[0].hyoukason)}>{addComma(data[0].hyoukason)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[1].hyoukason)}>{addComma(data[1].hyoukason)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[2].hyoukason)}>{addComma(data[2].hyoukason)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[3].hyoukason)}>{addComma(data[3].hyoukason)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[4].hyoukason)}>{addComma(data[4].hyoukason)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[5].hyoukason)}>{addComma(data[5].hyoukason)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th class="row2">評価益</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].hyoukaeki)}>{addComma(data[0].hyoukaeki)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].hyoukaeki)}>{addComma(data[1].hyoukaeki)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].hyoukaeki)}>{addComma(data[2].hyoukaeki)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].hyoukaeki)}>{addComma(data[3].hyoukaeki)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[4].hyoukaeki)}>{addComma(data[4].hyoukaeki)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[5].hyoukaeki)}>{addComma(data[5].hyoukaeki)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th class="row1">諸経費</th>
					<td class={"row1" + KanougakuSuii.checkMinus(data[0].syokeihi)}>{addComma(data[0].syokeihi)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[1].syokeihi)}>{addComma(data[1].syokeihi)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[2].syokeihi)}>{addComma(data[2].syokeihi)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[3].syokeihi)}>{addComma(data[3].syokeihi)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[4].syokeihi)}>{addComma(data[4].syokeihi)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[5].syokeihi)}>{addComma(data[5].syokeihi)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th class="row2">未受渡決済損</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].kessaison)}>{addComma(data[0].kessaison)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].kessaison)}>{addComma(data[1].kessaison)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].kessaison)}>{addComma(data[2].kessaison)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].kessaison)}>{addComma(data[3].kessaison)}</td>
					<td class="row2">-</td>
					<td class="row2">-</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th class="row1">未受渡決済益</th>
					<td class={"row1" + KanougakuSuii.checkMinus(data[0].kessaieki)}>{addComma(data[0].kessaieki)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[1].kessaieki)}>{addComma(data[1].kessaieki)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[2].kessaieki)}>{addComma(data[2].kessaieki)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[3].kessaieki)}>{addComma(data[3].kessaieki)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[4].kessaieki)}>{addComma(data[4].kessaieki)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[5].kessaieki)}>{addComma(data[5].kessaieki)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row2_span2">受入保証金</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].ukeirehosyoukin)}>{addComma(data[0].ukeirehosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].ukeirehosyoukin)}>{addComma(data[1].ukeirehosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].ukeirehosyoukin)}>{addComma(data[2].ukeirehosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].ukeirehosyoukin)}>{addComma(data[3].ukeirehosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[4].ukeirehosyoukin)}>{addComma(data[4].ukeirehosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[5].ukeirehosyoukin)}>{addComma(data[5].ukeirehosyoukin)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row1_span2">未決済建株代金</th>
					<td class={"row1" + KanougakuSuii.checkMinus(data[0].miketuTatekabuDaikin)}>{addComma(data[0].miketuTatekabuDaikin)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[1].miketuTatekabuDaikin)}>{addComma(data[1].miketuTatekabuDaikin)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[2].miketuTatekabuDaikin)}>{addComma(data[2].miketuTatekabuDaikin)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[3].miketuTatekabuDaikin)}>{addComma(data[3].miketuTatekabuDaikin)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[4].miketuTatekabuDaikin)}>{addComma(data[4].miketuTatekabuDaikin)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[5].miketuTatekabuDaikin)}>{addComma(data[5].miketuTatekabuDaikin)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row2_span2">現引/現渡建株代金</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].genTakekabuDaikin)}>{addComma(data[0].genTakekabuDaikin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].genTakekabuDaikin)}>{addComma(data[1].genTakekabuDaikin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].genTakekabuDaikin)}>{addComma(data[2].genTakekabuDaikin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].genTakekabuDaikin)}>{addComma(data[3].genTakekabuDaikin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[4].genTakekabuDaikin)}>{addComma(data[4].genTakekabuDaikin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[5].genTakekabuDaikin)}>{addComma(data[5].genTakekabuDaikin)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row1_span2">必要保証金</th>
					<td class={"row1" + KanougakuSuii.checkMinus(data[0].hituyouHosyoukin)}>{addComma(data[0].hituyouHosyoukin)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[1].hituyouHosyoukin)}>{addComma(data[1].hituyouHosyoukin)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[2].hituyouHosyoukin)}>{addComma(data[2].hituyouHosyoukin)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[3].hituyouHosyoukin)}>{addComma(data[3].hituyouHosyoukin)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[4].hituyouHosyoukin)}>{addComma(data[4].hituyouHosyoukin)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[5].hituyouHosyoukin)}>{addComma(data[5].hituyouHosyoukin)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row2_span2">うち現金必要保証金</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].hituyouHosyoukinGen)}>{addComma(data[0].hituyouHosyoukinGen)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].hituyouHosyoukinGen)}>{addComma(data[1].hituyouHosyoukinGen)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].hituyouHosyoukinGen)}>{addComma(data[2].hituyouHosyoukinGen)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].hituyouHosyoukinGen)}>{addComma(data[3].hituyouHosyoukinGen)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[4].hituyouHosyoukinGen)}>{addComma(data[4].hituyouHosyoukinGen)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[5].hituyouHosyoukinGen)}>{addComma(data[5].hituyouHosyoukinGen)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row1_span2">保証金余力</th>
					<td class={"row1" + KanougakuSuii.checkMinus(data[0].hosyoukinYoryoku)}>{addComma(data[0].hosyoukinYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[1].hosyoukinYoryoku)}>{addComma(data[1].hosyoukinYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[2].hosyoukinYoryoku)}>{addComma(data[2].hosyoukinYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[3].hosyoukinYoryoku)}>{addComma(data[3].hosyoukinYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[4].hosyoukinYoryoku)}>{addComma(data[4].hosyoukinYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[5].hosyoukinYoryoku)}>{addComma(data[5].hosyoukinYoryoku)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row2_span2">保証金余力（現金）</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].hosyoukinYoryokuGen)}>{addComma(data[0].hosyoukinYoryokuGen)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].hosyoukinYoryokuGen)}>{addComma(data[1].hosyoukinYoryokuGen)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].hosyoukinYoryokuGen)}>{addComma(data[2].hosyoukinYoryokuGen)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].hosyoukinYoryokuGen)}>{addComma(data[3].hosyoukinYoryokuGen)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[4].hosyoukinYoryokuGen)}>{addComma(data[4].hosyoukinYoryokuGen)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[5].hosyoukinYoryokuGen)}>{addComma(data[5].hosyoukinYoryokuGen)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row1_span2">委託保証金率</th>
					<td class="row1">{KanougakuSuii.checkRate(data[0].hosyoukinRitu)}</td>
					<td class="row1">{KanougakuSuii.checkRate(data[1].hosyoukinRitu)}</td>
					<td class="row1">{KanougakuSuii.checkRate(data[2].hosyoukinRitu)}</td>
					<td class="row1">{KanougakuSuii.checkRate(data[3].hosyoukinRitu)}</td>
					<td class="row1">{KanougakuSuii.checkRate(data[4].hosyoukinRitu)}</td>
					<td class="row1">{KanougakuSuii.checkRate(data[5].hosyoukinRitu)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row2_span2">保証金引出拘束金</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].hosyoukinHikidasiKousokukin)}>{addComma(data[0].hosyoukinHikidasiKousokukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].hosyoukinHikidasiKousokukin)}>{addComma(data[1].hosyoukinHikidasiKousokukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].hosyoukinHikidasiKousokukin)}>{addComma(data[2].hosyoukinHikidasiKousokukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].hosyoukinHikidasiKousokukin)}>{addComma(data[3].hosyoukinHikidasiKousokukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[4].hosyoukinHikidasiKousokukin)}>{addComma(data[4].hosyoukinHikidasiKousokukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[5].hosyoukinHikidasiKousokukin)}>{addComma(data[5].hosyoukinHikidasiKousokukin)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row1_span2">保証金引出余力</th>
					<td class={"row1" + KanougakuSuii.checkMinus(data[0].hosyoukinHikidasiYoryoku)}>{addComma(data[0].hosyoukinHikidasiYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[1].hosyoukinHikidasiYoryoku)}>{addComma(data[1].hosyoukinHikidasiYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[2].hosyoukinHikidasiYoryoku)}>{addComma(data[2].hosyoukinHikidasiYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[3].hosyoukinHikidasiYoryoku)}>{addComma(data[3].hosyoukinHikidasiYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[4].hosyoukinHikidasiYoryoku)}>{addComma(data[4].hosyoukinHikidasiYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[5].hosyoukinHikidasiYoryoku)}>{addComma(data[5].hosyoukinHikidasiYoryoku)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row2_span2">追証必要保証金</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].oisyouHituyouHosyoukin)}>{addComma(data[0].oisyouHituyouHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].oisyouHituyouHosyoukin)}>{addComma(data[1].oisyouHituyouHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].oisyouHituyouHosyoukin)}>{addComma(data[2].oisyouHituyouHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].oisyouHituyouHosyoukin)}>{addComma(data[3].oisyouHituyouHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[4].oisyouHituyouHosyoukin)}>{addComma(data[4].oisyouHituyouHosyoukin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[5].oisyouHituyouHosyoukin)}>{addComma(data[5].oisyouHituyouHosyoukin)}</td>
				</tr>
			);
			sinyouData.push(
				<tr>
					<th colspan="2" class="row1_span2">追証余力</th>
					<td class={"row1" + KanougakuSuii.checkMinus(data[0].oisyouYoryoku)}>{addComma(data[0].oisyouYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[1].oisyouYoryoku)}>{addComma(data[1].oisyouYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[2].oisyouYoryoku)}>{addComma(data[2].oisyouYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[3].oisyouYoryoku)}>{addComma(data[3].oisyouYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[4].oisyouYoryoku)}>{addComma(data[4].oisyouYoryoku)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[5].oisyouYoryoku)}>{addComma(data[5].oisyouYoryoku)}</td>
				</tr>
			);
			sinyouKanougaku.push(
				<tr>
					<th class="row2">信用新規建て</th>
					<td class={"row2" + KanougakuSuii.checkMinus(data[0].kanougakuSinyouSin)}>{addComma(data[0].kanougakuSinyouSin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[1].kanougakuSinyouSin)}>{addComma(data[1].kanougakuSinyouSin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[2].kanougakuSinyouSin)}>{addComma(data[2].kanougakuSinyouSin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[3].kanougakuSinyouSin)}>{addComma(data[3].kanougakuSinyouSin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[4].kanougakuSinyouSin)}>{addComma(data[4].kanougakuSinyouSin)}</td>
					<td class={"row2" + KanougakuSuii.checkMinus(data[5].kanougakuSinyouSin)}>{addComma(data[5].kanougakuSinyouSin)}</td>
				</tr>
			);
			sinyouKanougaku.push(
				<tr>
					<th class="row1">信用現引</th>
					<td class="row1">-</td>
					<td class="row1">-</td>
					<td class="row1">-</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[3].kanougakuSinyouGen)}>{addComma(data[3].kanougakuSinyouGen)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[4].kanougakuSinyouGen)}>{addComma(data[4].kanougakuSinyouGen)}</td>
					<td class={"row1" + KanougakuSuii.checkMinus(data[5].kanougakuSinyouGen)}>{addComma(data[5].kanougakuSinyouGen)}</td>
				</tr>
			);
		}
		return(
			<div className="kanougakuSuii">
				<table class="asset_table">
					<tr class="title">
						<th class="title" colspan="2">可能額推移</th>
						<th class="title"><div>　{formatMMDD_JP(data[0].day)}　</div><div>（当日）</div></th>
						<th class="title"><div>　{formatMMDD_JP(data[1].day)}　</div><div>（2営業日）</div></th>
						<th class="title"><div>　{formatMMDD_JP(data[2].day)}　</div><div>（3営業日）</div></th>
						<th class="title"><div>　{formatMMDD_JP(data[3].day)}　</div><div>（4営業日）</div></th>
						<th class="title"><div>　{formatMMDD_JP(data[4].day)}　</div><div>（5営業日）</div></th>
						<th class="title"><div>　{formatMMDD_JP(data[5].day)}　</div><div>（6営業日）</div></th>
					</tr>
					<tr>
						<th colspan="2" class="row2_span2">預り金</th>
						<td class={"row2" + KanougakuSuii.checkMinus(data[0].azukarikin)}>{addComma(data[0].azukarikin)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[1].azukarikin)}>{addComma(data[1].azukarikin)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[2].azukarikin)}>{addComma(data[2].azukarikin)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[3].azukarikin)}>{addComma(data[3].azukarikin)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[4].azukarikin)}>{addComma(data[4].azukarikin)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[5].azukarikin)}>{addComma(data[5].azukarikin)}</td>
					</tr>
					<tr>
						<th colspan="2" class="row1_span2">発注済み注文充当額</th>
						<td class="row1">-</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[1].zyutoukin)}>{addComma(data[1].zyutoukin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[2].zyutoukin)}>{addComma(data[2].zyutoukin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[3].zyutoukin)}>{addComma(data[3].zyutoukin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[4].zyutoukin)}>{addComma(data[4].zyutoukin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[5].zyutoukin)}>{addComma(data[5].zyutoukin)}</td>
					</tr>
					<tr>
						<th colspan="2" class="row2_span2">日計り拘束金</th>
						<td class={"row2" + KanougakuSuii.checkMinus(data[0].hibakarikousokukin)}>{addComma(data[0].hibakarikousokukin)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[1].hibakarikousokukin)}>{addComma(data[1].hibakarikousokukin)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[2].hibakarikousokukin)}>{addComma(data[2].hibakarikousokukin)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[3].hibakarikousokukin)}>{addComma(data[3].hibakarikousokukin)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[4].hibakarikousokukin)}>{addComma(data[4].hibakarikousokukin)}</td>
						<td class="row2">-</td>
					</tr>
					<tr>
						<th colspan="2" class="row1_span2">その他拘束金</th>
						<td class={"row1" + KanougakuSuii.checkMinus(data[0].sonotakousokukin)}>{addComma(data[0].sonotakousokukin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[1].sonotakousokukin)}>{addComma(data[1].sonotakousokukin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[2].sonotakousokukin)}>{addComma(data[2].sonotakousokukin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[3].sonotakousokukin)}>{addComma(data[3].sonotakousokukin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[4].sonotakousokukin)}>{addComma(data[4].sonotakousokukin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[5].sonotakousokukin)}>{addComma(data[5].sonotakousokukin)}</td>
					</tr>
					{sinyouData}
					<tr>
						<th colspan="2" class="row2_span2">立替金</th>
						<td class="row2 red_text">{addComma(data[0].fusokugaku)}</td>
						<td class="row2 red_text">{addComma(data[1].fusokugaku)}</td>
						<td class="row2 red_text">{addComma(data[2].fusokugaku)}</td>
						<td class="row2 red_text">{addComma(data[3].fusokugaku)}</td>
						<td class="row2 red_text">{addComma(data[4].fusokugaku)}</td>
						<td class="row2 red_text">{addComma(data[5].fusokugaku)}</td>
					</tr>
					<tr>
						<th rowspan={KanougakuSuii.checkSpan(sinyouKouzaKubun)} className="row1_head">可能額</th>
						<th class="row1">現物株式買付</th>
						<td class="row1">-</td>
						<td class="row1">-</td>
						<td class="row1">-</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[3].kanougakuGenbutuKai)}>{addComma(data[3].kanougakuGenbutuKai)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[4].kanougakuGenbutuKai)}>{addComma(data[4].kanougakuGenbutuKai)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[5].kanougakuGenbutuKai)}>{addComma(data[5].kanougakuGenbutuKai)}</td>
					</tr>
					{sinyouKanougaku}
					<tr>
						<th class="row2">投信買付</th>
						<td class="row2">-</td>
						<td class="row2">-</td>
						<td class="row2">-</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[3].kanougakuTousinKai)}>{addComma(data[3].kanougakuTousinKai)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[4].kanougakuTousinKai)}>{addComma(data[4].kanougakuTousinKai)}</td>
						<td class={"row2" + KanougakuSuii.checkMinus(data[5].kanougakuTousinKai)}>{addComma(data[5].kanougakuTousinKai)}</td>
					</tr>
					<tr>
						<th class="row1">出金</th>
						<td class="row1">-</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[1].kanougakuSyukkin)}>{addComma(data[1].kanougakuSyukkin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[2].kanougakuSyukkin)}>{addComma(data[2].kanougakuSyukkin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[3].kanougakuSyukkin)}>{addComma(data[3].kanougakuSyukkin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[4].kanougakuSyukkin)}>{addComma(data[4].kanougakuSyukkin)}</td>
						<td class={"row1" + KanougakuSuii.checkMinus(data[5].kanougakuSyukkin)}>{addComma(data[5].kanougakuSyukkin)}</td>
					</tr>
				</table>
			</div>
		)
	}

	static convertMarkToMaketTypes(val) {
		if(MarkToMaketTypes[val])
			return MarkToMaketTypes[val];
		else
			return "";
	}

	static checkMinus(val) {
		if(Number(val) < 0)
			return " red_text";
		return "";
	}

	static checkRate(val) {
		if(Number(val) <= 0) {
			return "-";
		}
		let rate = addComma(val) + "%";
		return rate;
	}

	static checkSpan(val) {
		if(val === "0")
			return "3";
		return "5";
	}
}

KanougakuSuii.propTypes = {
	day: PropTypes.string,
	azukarikin: PropTypes.string,
};

const MarkToMaketTypes = {
	"0": "値洗い停止",
	"1": "値洗い中",
	"2": "値洗い終了"
}

class Asset extends React.Component {
	constructor(props) {
		super(props);
		this.kokyakuInfoRef = null;
	}
	render() {
		return(
			<div className={"asset"}>
				<KokyakuInfo
					{...this.props.kokyakuInfo}
					onChange={this.onGetKanougakuSuii}
					errorCode={this.props.errorCode}
					ref={(component) => this.kokyakuInfoRef = component}
				/>
				<KanougakuSuii
					{...this.props}
				/>
				{/*
				<div className="message">{kanougakuSuii.createMessage(this.props.errorCode, this.props.message)}</div>
				<OrderFooter
//					phase={this.props.phase}
//					onClickInput={this.onClickInput}
//					onClickConfirm={this.onClickConfirm}
//					onClickComplete={this.onClickComplete}
//					onClickOrderList={this.onClickOrderList}
//					disabled={!orderEnabled}
				/>
				*/}
			</div>
		)
	}

	onGetKanougakuSuii = (kokyakuRegistN) => {
		//const {issueCode, marketCode} = this.props.issue;
		if(this.props.onGetKanougakuSuii) {
			this.props.onGetKanougakuSuii(kokyakuRegistN);
		}
	}

}

Asset.propTypes = {
}

export default Asset;