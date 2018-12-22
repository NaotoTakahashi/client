import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import PropTypes from 'prop-types';
import './OrderList.css';
import {addComma} from '../Utility';
import * as OrderListReducer from '../reducers/OrderListReducer';

//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
var Button = ReactBootstrap.Button;
//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
export class TableHeader extends React.Component {
	render() {
		const colList = [];
		for(const col of this.props.cols) {
			if (typeof col.length !== 'undefined'){
				let key = null;
				let classStr = "orderlist_table_header_item";
				let clickEvent = null;
				let nestList = [];
				for(const colNest of col) {
					key = key + " " + colNest.key;
					classStr = classStr + " " + colNest.key;
					let nestClassStr = null;
					if(colNest.sortable) {
						nestClassStr += " sortable";
						if(colNest.order) {
							nestClassStr += (" " + colNest.order);
						}
						clickEvent = this.onClick(colNest.key);
					}
					nestList.push(<div key={colNest.key} className={nestClassStr} onClick={clickEvent}>{colNest.name}</div>);
				}
				colList.push(<div key={key} className={classStr}>{nestList}</div>);
				//colList.push(this.createItem(col.key, this.props.data));
			} else {
				let classStr = "orderlist_table_header_item single " + col.key;
				let clickEvent = null;
				if(col.sortable) {
					classStr += " sortable";
					if(col.order) {
						classStr += (" " + col.order);
					}
					clickEvent = this.onClick(col.key);
				}
				colList.push(<div key={col.key} className={classStr} onClick={clickEvent}>{col.name}</div>);
				//colList.push(this.createItem(col.key, this.props.data));
			}
		}
		return (
			<div className="orderlist_table_header">
				{colList}
				<div key={"scroll_space"} className={"orderlist_table_header_item scroll_space"}></div>
			</div>
		)
	}
	static createItem = (key, col) => {
		let classStr = "orderlist_table_header_item " + col.key;
		let clickEvent = null;
		if(col.sortable) {
			classStr += " sortable";
			if(col.order) {
				classStr += (" " + col.order);
			}
			clickEvent = this.onClick(col.key);
		}
		return(
			<div key={col.key} className={classStr} onClick={clickEvent}>{col.name}</div>
		)
	}

	onClick = (inkey) => () => {
		if(this.props.onSort) {
			let sorted = false;
			let asc = false;
			let key = inkey;
			if(this.props.sortCondition.key !== key) {
				// キーの変更がある場合、昇順ソート
				sorted = true;
				asc = true;
			} else {
				// キーの変更がない場合
				if(this.props.sortCondition.asc) {
					// 昇順の場合、降順ソートに変更
					sorted = true;
					asc = false;
				} else {
					// 降順の場合、ソートリセット
					/*sorted = false;		// ソートリセットを停止
					asc = false;
					key = null;*/
					sorted = true;
					asc = true;
				}
			}
			this.props.onSort(sorted, key, asc);
		}
	}
}

TableHeader.propTypes = {
	cols: PropTypes.arrayOf(Object).isRequired,
	sortCondition: PropTypes.object,
	onSort: PropTypes.func,
}

export class TableBody extends React.Component {
	render() {
		const rowList = [];
		let i = 0;
		for(let data of this.props.dataList) {
			let filter = true;
			Object.keys(this.props.filters).map((key, index) => {
				let filterData = this.props.filters[key].data;
				if (filterData !==  ""){
					if (this.props.filters[key].type ===  "select" && filterData !==  "0"){
						let optionData = OrderListReducer.filterSelect[key]
						filterData = optionData[filterData];
						/*let flag = false;
						for (let i=0; i < filterData.values.length; i++){
							if (data[key] === filterData.values[i])
								flag = true;
						}
						if (filterData.valueExists !== flag)
							filter = false;*/

						let hasValue = false;
						if (filterData.values.length) {
							filterData.values.forEach((val) => {
								if (data[filterData.key] === val) hasValue = true;
							});
							if (filterData.valueExists !== hasValue) {
								filter = false;
							}
						} else {
							if (data[filterData.key] === "" || data[filterData.key] === "0")	filter = false;
						}
					} else if (this.props.filters[key].type === "input"){
						if (data[key] !== filterData)
							filter = false;
					}
				}
			})
			if (filter && data.issueCode){
				const alternate = i % 2 + 1;
				let execList = [];
				for(const exec of this.props.execList) {
					if(data["bizDate"] === exec["bizDate"] && data["odrNumber"] === exec["odrNumber"]){
						execList.push(exec);
					}
				}
				let entryKey = data["bizDate"] + '_' + data["odrNumber"];
				let detailflag = this.props.openDetailList[entryKey];
				rowList.push(
					<this.props.rowClass
						key={i} data={data}
						execList={execList}
						cols={this.props.cols}
						alternate={alternate}
						showExec={detailflag}
						onShowDetail={this.props.onShowDetail}
					/>
				);
				i++;
				if (execList.length > 1){
					for(const exec of execList) {
						rowList.push(
							<this.props.execRowClass
								key={i+"-"+exec.noticeNumber}
								exec={exec}
								cols={this.props.cols}
								alternate={alternate}
								showExec={detailflag}
							/>
						);
					}
				}
			}
		}
		return (
			<div className="orderlist_table_body">
				{rowList}
			</div>
		)
	}
}
TableBody.propTypes = {
	cols: PropTypes.arrayOf(Object).isRequired,
	dataList: PropTypes.arrayOf(Object).isRequired,
}

export class Row extends React.Component {
	constructor() {
		super();
		this.createItem = Row.createItem;
		this.onClick = this.onClick.bind(this);
	}
	render() {
		const itemList = [];
		const data = this.props.data;
		const execList = this.props.execList;
		let className = "";
		for(const col of this.props.cols) {
			if (typeof col.length !== 'undefined'){
				let nestList = [];
				let className = "orderlist_table_row_item";
				for(const colNest of col) {
					className += " " + colNest.key;
					nestList.push(this.createItem(colNest.key, data, execList, this.props.showExec, this.onClick, 1));
				}
				itemList.push(<div key={col[0].key} className={className}>{nestList}</div>);
				//colList.push(this.createItem(col.key, this.props.data));
			} else {
				itemList.push(this.createItem(col.key, data, execList, this.props.showExec, this.onClick));
			}
		}
		if(execList.length > 1) {className += " haveExec";}
		return(
			<div className={"orderlist_table_row" + this.props.alternate + className}>{itemList}</div>
		)
	}

	static createItem = (key, data, execList, showExec, onClick, nestFlag=0) => {
		let className = key;
		if (!nestFlag)
			className += " orderlist_table_row_item";
		let dataValue = data[key];
		if(data.class) {
			className += " " + data.class;
		}
		if (typeof dataValue !== "undefined"){
			if (key ==="execCount"){
				if (dataValue === "0" || dataValue === "1"){
					dataValue = "";
				} else {
					let fa = "fa fa-plus";
					if (showExec)
						fa = "fa fa-minus";
					dataValue = <div className={fa} onClick={onClick(data)}></div>;
				}
			} else if (key ==="odrSide" || key ==="bensai"){
				if(data["odrSide"].match(/買/))	className += " buy";
				else if(data["odrSide"].match(/売/))	className += " sell";
			} else if (key ==="oyaKey" && dataValue === "0"){
				dataValue = "";
			} /*else if (key ==="capitalgainsTax"){
				dataValue = OrderListReducer.CapitalgainsTax[dataValue];
			} */else if (key ==="marketCode"){
				dataValue = OrderListReducer.MarketCode[dataValue];
			} else if (key ==="capitalgainsTax"){
				dataValue = OrderListReducer.CapitalgainsTax[dataValue];
			} /*else if (key ==="execQty" && execList.length > 0){
				dataValue = OrderList.addComma(execList[0].detailQty, "株");
			} */else if (key ==="odrQty" || key === "notOdrQty" || key === "curQty"|| key === "execQty"|| key === "notExecQty"){
				dataValue = OrderList.addComma(dataValue, "株");
			} else if (key ==="curOdrPrice"){
				if (data["curOdrPriceType"] === "1"){
					dataValue = "成行";
				} else {
					dataValue = OrderList.addComma(dataValue, "円");
					if (data["curOdrPriceType"] === "3")	dataValue += "親注文より高い";
					else if (data["curOdrPriceType"] === "4")	dataValue += "親注文より低い";
				}
			} else if (key ==="execPrice" && execList.length > 0){
				dataValue = +dataValue / +data["execQty"];	// 約定金額/約定株数=平均約定金額
				let decCount = execList[0].detailPrice.indexOf(".");
				if(decCount > 0) {
					let priceDec = execList[0].detailPrice.slice(decCount+1).length;
					dataValue = parseFloat(dataValue).toFixed(priceDec);
				}
				dataValue = OrderList.addComma(dataValue, "円");
			} else if (key ==="execPrice" || key ==="odrProceeds"){
				dataValue = OrderList.addComma(dataValue, "円");
			} else if ((key === "odrDate" || key === "replyDate") && dataValue.length >= 12){
				dataValue = Row.formatDate(dataValue.substring(0, 12));
			} else if (key ==="odrExpDay"){
				if (dataValue === "0"){
					dataValue = "当日中";
				} else if (dataValue.length >= 8){
					dataValue = Row.formatDate(dataValue.substring(0, 8));
				}
			}
		} else {
			if (key ==="torihiki"){
				if (+data["curQty"] > 0){
				dataValue = [<div key="teisei" className="gaiburenkei" onClick={Row.gaiburenkei()}>訂正</div>,'\n',<div key="torikeshi" className="gaiburenkei" onClick={Row.gaiburenkei()}>取消</div>];
				//dataValue = <div className="gaiburenkei" onClick={Row.gaiburenkei()}>訂正</div>;
				//dataValue += <div className="gaiburenkei" onClick={Row.gaiburenkei()}>取消</div>;
			} /*else if (+data["curQty"] > 0){
					dataValue = "取消";
				}*/
			} else if (key === "odrQty2"){
				dataValue = OrderList.addComma(data["odrQty"], "株");
			} else if (key === "execDate" && execList.length > 0){
				dataValue = Row.formatDate(execList[0].detailDate.substring(0, 12));
			} else if (key === "notExecQty" && +data["odrQty"] > 0){
				dataValue = OrderList.addComma(+data["odrQty"] - +data["execQty"], "株");	// 現注文株数-約定株数=未約定株数
			}
		}
		return(
			<div key={key} className={className}>{dataValue}&nbsp;</div>
		)
	}
	static formatDate = (date) => {
		if (date.length === 12)
			return date.replace(/^(-?\d+)(\d{2})(\d{2})(\d{2})(\d{2})/, "$1/$2/$3 $4:$5");
		if (date.length === 8)
			return date.replace(/^(-?\d+)(\d{2})(\d{2})/, "$1/$2/$3");
	}
	static gaiburenkei = () => {
	}
	onClick = (data) => () => {
		if(this.props.onShowDetail && +data["execCount"] > 0) {
			let key = data["bizDate"] + '_' + data["odrNumber"];
			this.props.onShowDetail(key);
		}
	}
}

Row.propTypes = {
	cols: PropTypes.arrayOf(Object).isRequired,
	data: PropTypes.object.isRequired,
}
export class ExecRow extends React.Component {
	constructor() {
		super();
		this.createExecItem = ExecRow.createExecItem;
	}
	render() {
		const itemList = [];
		const exec = this.props.exec;
		let className = "detail orderlist_table_row"+ this.props.alternate;
		if (this.props.showExec)	className += " on_disp";
		for(const col of this.props.cols) {
			if (typeof col.length !== 'undefined'){
				itemList.push(this.createExecItem(col[0].key, exec));
			} else if (typeof col.key !== 'undefined') {
				itemList.push(this.createExecItem(col.key, exec));
			}
		}
		return(
			<div className={className}>{itemList}</div>
		)
	}

	static createExecItem = (key, exec) => {
		let execValue = "";
		let className = "orderlist_table_row_item " + key;
		if (key === 'curOdrPrice'){
			execValue = "明細";
		} else if (key === 'execQty'){
			execValue = OrderList.addComma(exec["detailQty"], "株");
			className += " detailQty";
		} else if (key === 'execPrice'){
			execValue = OrderList.addComma(exec["detailPrice"], "円");
			className += " detailPrice";
		} else if (key === 'odrDate'){
			execValue = Row.formatDate(exec["detailDate"].substring(0, 12));
			className += " detailDate";
		}
		return(
			<div key={key} className={className}>{execValue}</div>
		)
	}
}

class OrderListTable extends React.Component {
	constructor() {
		super();
		this.headerClass = TableHeader;
		this.bodyClass = TableBody;
		this.rowClass = Row;
		this.execRowClass = ExecRow;
	}
	render() {
		return (
			<div className={"orderlist_table" + (this.props.className? " " + this.props.className : "")}>
				<this.headerClass
					cols={this.props.cols}
					sortCondition={this.props.sortCondition}
					onSort={this.props.onSort}
				/>
				<this.bodyClass
					rowClass={this.rowClass}
					execRowClass={this.execRowClass}
					cols={this.props.cols}
					dataList={this.props.dataList}
					openDetailList={this.props.openDetailList}
					execList={this.props.execList}
					filters={this.props.filters}
					onShowDetail={this.props.onShowDetail}
				/>
			</div>
		);
	}
}

export class OrderListHeader extends React.Component {
	constructor(props){
		super(props);
		this.filterRef = [];
		this.filterInput = [];
	}
	render() {
		const filterList = [];
		Object.keys(this.props.filters).map((key, index) => {
			let filter = this.props.filters[key];
			this.filterRef[index] = {key: key , data: filter.data}
			let classStr = "orderlist_header_item " + key;
			if (filter.type === "input"){
				filterList.push(
					<div key={key} className={classStr}>
						{filter.name}
						<input name={key} defaultValue={filter.data} type="text" maxLength={filter.max} ref={/*this.filterInputRef*/
							(input) => { if(input !== null) this.filterInput[input.name] = input }
						} onKeyPress={this.onKeyPress}/>
					</div>
				)
			} else if(filter.type === "select"){
				let optionList = OrderListReducer.filterSelect[key];
				let filterOptions = Object.keys(optionList).map((opKey) => {
					return <option value={opKey} key={opKey} className={opKey +"Filter-"+ key}>{optionList[opKey].title}</option>;
				})
				filterList.push(
					<div key={key} className={classStr}>
						{filter.name}
						<select	name={key} className={key} defaultValue={filter.data} /*onChange={this.filterSelectRef}*/
							ref={(select) => { if(select !== null) this.filterInput[select.name] = select}
						}>
							{filterOptions}
						</select>
					</div>
				)
			}
		})
		return (
			<div className="orderlist_header">
				<span className="header_title">絞り込み検索</span>
				{filterList}
				<Button onClick={() => this.onClickFilter()}>実行</Button>
				<Button onClick={() => this.onClickFilterClear()}>クリア</Button>
			</div>
		)
	}
	/*filterInputRef = (input) => {
		for(let i = 0; i < this.filterRef.length; i++) {
			if(this.filterRef[i].key === input.name){
				this.filterRef[i].data = input.value;
			}
		}
	}
	filterSelectRef = (e) => {
		for(let i = 0; i < this.filterRef.length; i++) {
			if(this.filterRef[i].key === e.target.name){
				this.filterRef[i].data = e.target.value;
			}
		}
	}*/
	onKeyPress = (e) => {
		if(e.key !== "Enter")
			return;
		this.onClickFilter();
	}
	onClickFilter() {
		if(this.props.onFilter) {
			/*for(const filter of this.filterRef) {
				if(this.props.filters[filter.key].data !== filter.data)
					this.props.onFilter(filter.key, filter.data);
			}*/
			Object.keys(this.filterInput).map((key, index) => {
				let inFilter = this.filterInput[key];
				//if(this.props.filters[key].data !== inFilter.name)
					this.props.onFilter(inFilter.name, inFilter.value);
			})
		}
	}
	onClickFilterClear() {
		Object.keys(this.filterInput).map((key, index) => {
			this.filterInput[key].value = "";
		})
		this.onClickFilter();
	}
}
export class OrderListInfo extends React.Component {
	render() {
		return (
			<div className="orderlist_info_header">
				{this.props.dataList.length}件中&nbsp;{this.props.dataList.length}件表示
			</div>
		)
	}
}

class OrderList extends React.Component {
	constructor() {
		super();
		this.headerClass = OrderListHeader;
		this.infoClass = OrderListInfo;
		this.bodyClass = OrderListTable;
	}
	render() {
		return (
			<div className="orderList">
				<this.headerClass
					filters={this.props.filters}
					onFilter={this.props.onFilter}
				/>
				<this.infoClass
					dataList={this.props.dataList}
				/>
				<this.bodyClass
					cols={this.props.cols}
					sortCondition={this.props.sortCondition}
					onSort={this.props.onSort}
					filters={this.props.filters}
					//dataList={this.props.dataList}
					dataList={this.props.dataList}
					openDetailList={this.props.openDetailList}
					execList={this.props.execList}
					onShowDetail={this.props.onShowDetail}
				/>
			</div>
		);
	}
	static addComma(val, unit="") {
		if(val === null || typeof val === undefined || val === "" || val === 0 || val === "0")
			return "";
		return addComma(String(val)) + unit;
	}
}

OrderList.propTypes = {
	cols: PropTypes.arrayOf(Object).isRequired,
	sortCondition: PropTypes.object,
	filters: PropTypes.object,
	dataList: PropTypes.arrayOf(Object).isRequired,
	onSort: PropTypes.func,
	onFilter: PropTypes.func,
}

export default OrderList;