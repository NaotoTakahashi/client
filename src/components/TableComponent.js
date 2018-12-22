import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
export class TableHeader extends React.Component {
	render() {
		const colList = [];
		for(const col of this.props.cols) {
			let classStr = "table_header_item " + col.key;
			let clickEvent = null;
			if(col.sortable) {
				classStr += " sortable";
				if(col.order) {
					classStr += (" " + col.order);
				}
				clickEvent = this.onClick(col.key);
			}
			colList.push(<div key={col.key} className={classStr} onClick={clickEvent}>{col.name}</div>)
		}
		return (
			<div className="table_header">
				{colList}
			</div>
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
					sorted = false;
					asc = false;
					key = null;
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
		for(const data of this.props.dataList) {
			const alternate = i % 2 + 1;
			rowList.push(<this.props.rowClass key={i} data={data} cols={this.props.cols} alternate={alternate} />);
			i++;
		}
		return (
			<div className="table_body">
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
	}
	render() {
		const itemList = [];
		for(const col of this.props.cols) {
			itemList.push(this.createItem(col.key, this.props.data));
		}
		return(
			<div className={"table_row table_row" + this.props.alternate}>{itemList}</div>
		)
	}

	static createItem = (key, data) => {
		let className = "table_row_item";
		className += " " + key;
		if(data.class) {
			className += " " + data.class;
		}
		return(
			<div key={key} className={className}>{data[key]}</div>
		)
	}
}

Row.propTypes = {
	cols: PropTypes.arrayOf(Object).isRequired,
	data: PropTypes.object.isRequired,
}

class Table extends React.Component {
	constructor() {
		super();
		this.headerClass = TableHeader;
		this.bodyClass = TableBody;
		this.rowClass = Row;
	}
	render() {
		return (
			<div className={"table" + (this.props.className? " " + this.props.className : "")}>
				<this.headerClass
					cols={this.props.cols}
					sortCondition={this.props.sortCondition}
					onSort={this.props.onSort}
				/>
				<this.bodyClass rowClass={this.rowClass} cols={this.props.cols} dataList={this.props.dataList} />
			</div>
		);
	}
}

Table.propTypes = {
	cols: PropTypes.arrayOf(Object).isRequired,
	sortCondition: PropTypes.object,
	dataList: PropTypes.arrayOf(Object).isRequired,
	onSort: PropTypes.func,
}

export default Table;