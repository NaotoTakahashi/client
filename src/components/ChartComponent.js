import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import {Navbar, Nav, NavItem, DropdownButton} from 'react-bootstrap';
import {TechMainName, TechSubName, DispOptionName, TechToolName, ChartShapeName, ChartPeriodName, IndexName} from '../reducers/ChartReducer';
import {issueMarketContainer as IssueSearch} from '../containers/MIOSContainer';
import PropTypes from 'prop-types';
import './Chart.css';

//-----------------------------------------------------------------------------
//	BootStrap
//-----------------------------------------------------------------------------
//var NavItem = ReactBootstrap.NavItem;
let NavDropdown = ReactBootstrap.NavDropdown;
let MenuItem = ReactBootstrap.MenuItem;

//-----------------------------------------------------------------------------
//	Component
//-----------------------------------------------------------------------------
export class ChartPeriodDropDown extends React.Component {
	render() {
		return (
			<div className="chart_index_select">
			<select
				className="combo"
				id="chartPeriod"
				value={this.props.chartPeriod}
				onChange={this.onChange}
			>
				{Object.keys(ChartPeriodName).map((key) => {
					return (<option key={key} value={key}>{ChartPeriodName[key]}</option>);
				})}
			</select>
			</div>
		);
	}
	onChange = (e) => {
		this.props.setChartPeriod(e.target.value);
	}
}

ChartPeriodDropDown.propTypes = {
	chartPeriod: PropTypes.string.isRequired,
	setTickType: PropTypes.func.isRequired,
};

export class DispOptionDropDown extends React.Component {
	render() {
		let dispOption = this.props.dispOption;
		return (
			<DropdownButton id="dispOption_menu" title="表示オプション"  bsSize="xsmall" bsStyle="custom" onSelect={(key) => {this.props.tglDispOption(key)}} >
				{Object.keys(DispOptionName).map((key) => {
					return (
						<MenuItem key={"dispOption_"+key} eventKey={key} className="checkbox-parent">
							<input type="checkbox" checked={dispOption[key]} readOnly className="checkbox-input" />
							<label className="checkbox-parts">{DispOptionName[key]}</label>
						</MenuItem>
					)
				})}
			</DropdownButton>
		);
	}
}

DispOptionDropDown.propTypes = {
	dispOption: PropTypes.object.isRequired,
	tglDispOption: PropTypes.func.isRequired,
};

export class TechToolDropDown extends React.Component {
	componentDidMount() {
	}
	render() {
		const techTool = this.props.techTool;
		return (
			<DropdownButton id="techTool_menu" title="テクニカルツール" bsSize="xsmall" bsStyle="custom" onSelect={(key) => {this.props.setTechTool(key)}} >
				{Object.keys(TechToolName).map((key) => {
					return (
						<MenuItem key={"tech_tool_"+key} eventKey={key} className="checkbox-parent">
							<input type="checkbox" checked={key === techTool} readOnly className="checkbox-input" />
							<label className="checkbox-parts">{TechToolName[key]}</label>
						</MenuItem>
					)
				})}
			</DropdownButton>
		);
	}
}

TechToolDropDown.propTypes = {
	techTool: PropTypes.object.isRequired,
	setTechTool: PropTypes.func.isRequired,
};

export class TechnicalDropDown extends React.Component {
	render() {
		const techMain = this.props.technical.techMain;
		const techSub = this.props.technical.techSub;
		const chartShape = this.props.technical.chartShape;
		return (
			<DropdownButton title="テクニカル選択" id="technical_dropdown" bsSize="xsmall" bsStyle="custom">
				<NavDropdown id="techMain_mainmenu" title="メイン指標" className="dropdown-submenu" onSelect={(key) => {this.props.toggleTechMain(key)}} >
					{Object.keys(TechMainName).map((key) => {
						return (
							<MenuItem key={"tech_main_"+key} eventKey={key} className="checkbox-parent">
								<input type="checkbox" checked={techMain[key]} readOnly className="checkbox-input" />
								<label className="checkbox-parts">{TechMainName[key]}</label>
							</MenuItem>
						)
					})}
				</NavDropdown>
				<NavDropdown id="techSub_submenu" title="サブ指標" className="dropdown-submenu" onSelect={(key) => {this.props.toggleTechSub(key)}} >
					{Object.keys(TechSubName).map((key) => {
						return (
							<MenuItem key={"tech_sub_"+key} eventKey={key} className="checkbox-parent">
								<input type="checkbox" checked={techSub[key]} readOnly className="checkbox-input" />
								<label className="checkbox-parts">{TechSubName[key]}</label>
							</MenuItem>
						)
					})}
				</NavDropdown>
				<NavDropdown id="chartShape_submenu" title="チャート形状" className="dropdown-submenu" onSelect={(key) => {this.props.setChartShape(key)}}>
					{Object.keys(ChartShapeName).map((key) => {
						return (
							<MenuItem key={"technical_chartshape_"+key} eventKey={key} className="checkbox-parent">
								<input type="checkbox" checked={key === chartShape} readOnly className="checkbox-input" />
								<label className="checkbox-parts">{ChartShapeName[key]}</label>
							</MenuItem>
						)
					})}
				</NavDropdown>
			</DropdownButton>
		);
	}
}

TechnicalDropDown.propTypes = {
	technical: PropTypes.object.isRequired,
	toggleTechMain: PropTypes.func.isRequired,
	toggleTechSub: PropTypes.func.isRequired,
	setChartShape: PropTypes.func.isRequired,
};

export class IndexSelect extends React.Component {
	render() {
		let indexList;
		if(this.props.indexSet) {
			indexList = this.props.indexSet;
		} else {
			indexList = IndexName;
		}
		return (
			<div class="chart_index_select">
			<select
				idxName={"combo index_select " + (this.props.idxname || '')}
				className={"chart_input"}
				value={this.props.value}
				ref={(input) => this.mInput = input}
				defaultValue=''
				onChange={this.onChange}
			>
				{Object.keys(indexList).map((key) => {
					return (<option key={key} value={key}>{IndexName[key]}</option>);
				})}
			</select>
			</div>
		);
	}
	onChange = (e) => {
		if(this.props.onChange) {
			this.props.setChartSubIndex(e.target.value);
		}
	}
}

IndexSelect.propTypes = {
	indexCode: PropTypes.string,
	idxName: PropTypes.string,
	onChangeIndex: PropTypes.func,
};

class ChartCanvas extends React.Component {
	constructor(props) {
	  super(props);
	  this.updateCanvas = this.updateCanvas.bind(this);
	}
	componentDidMount() {
	  this.updateCanvas();
	}
  
	componentWillReceiveProps(nextProps) {
	  //if (this.props !== nextProps) {
		this.updateCanvas();
	  //}
	}
  
	componentDidUpdate() {
	  this.updateCanvas();
	}
  
	updateCanvas() {
		const { fg_canvas } = this;
		fg_canvas.style.position = 'absolute';
		fg_canvas.style.left = "0px";
		fg_canvas.style.top = "0px";
		fg_canvas.style.visibility = 'visible';
		const fg_context = fg_canvas.getContext('2d');
		const { bg_canvas } = this;
		bg_canvas.style.position = 'absolute';
		bg_canvas.style.left = "0px";
		bg_canvas.style.top = "0px";
		bg_canvas.style.visibility = 'hidden';
		const bg_context = bg_canvas.getContext('2d');
		this.props.updateCanvas(fg_canvas, fg_context, bg_canvas, bg_context);
	}
  
	render() {
		let vheight = this.props.height;
		let vwidth = this.props.width;
		let rheight = this.props.height + 'px';
		let rwidth = this.props.width + 'px';
		return <div class="canvas-wrapper">
		<canvas ref={(e) => { this.bg_canvas = e; }} id = 'root' width={vwidth} height={vheight} style={{width: rwidth, height: rheight}}></canvas>
		<canvas ref={(e) => { this.fg_canvas = e; }} id = 'root' width={vwidth} height={vheight} style={{width: rwidth, height: rheight}}></canvas>
		</div>;
	}
}

class Chart extends React.Component {
	constructor(props) {
		super(props);
	  	this.chartlib = this.props.chartlib;
	  	this.curWidth = 0;
	  	this.curHeight = 0;
	  	this.curtIssueCode = "";
	  	this.drawCount = 0; 
		this.chartUpdating = false;
	}
	componentDidMount() {
		document.onmousemove = (e) => {
			this.props.onMouseMove(e);
		}
		document.onmousedown = (e) => {
			this.props.onMouseDown(e);
		}
		document.onmouseup = (e) => {
			this.props.onMouseUp(e);
		}
		document.onkeyup = (e) => {
			if (e != null) {
				this.props.onKeyUp(e);
			} 
		}
	}
	resize(){
		
	}
	onChange = (issueCode, marketCode) => {
		this.props.onChange(0, issueCode, marketCode);
	}
	render() {
		let trueHeight = this.props.canvasHeight - 22;
		const canvasProps = {
			width: this.props.canvasWidth,
			height: trueHeight,
			updateCanvas: (fg_canvas, fg_context, bg_canvas, bg_context) => {
				if (this.chartlib !== undefined) {
					let resize = (this.curWidth != this.props.canvasWidth || this.curHeight != trueHeight) ? true : false;
					if (resize || this.drawCount < 2) {
						this.chartlib.setCanvas(fg_canvas, fg_context, bg_canvas, bg_context);
						this.chartlib.onPaint();
						if (resize) {
							this.drawCount = 0;
						} else {
							this.drawCount++;
						}
						this.curWidth = this.props.canvasWidth;
						this.curHeight = trueHeight;
						this.chartlib.onPaint();
					}
					else {
						this.chartlib.onPaint();
					}
				}
			},
		};
		return (
		<div className="chart">
			<table className="chart_table" width="100%">
				<tbody>
					<tr>
						<th width="130" className="row1" id="market-order">
							<td className={"chart_input"} colSpan="3">
								<IssueSearch
									issueCode = {this.props.issueCode}
									marketCode = {this.props.marketCode}
									className = "chart_input"
									onChange = {this.onChange}
									issueRef = {(input) => this.mIssueInput = input}
									marketRef = {(select) => this.mMarketSelect = select}
								/>
							</td>
						</th>
						<th width="80">
							<ChartPeriodDropDown {...this.props} />
						</th>
						<th width="100">
							<TechnicalDropDown {...this.props} />
						</th>
						<th width="100">
							<DispOptionDropDown {...this.props} />
						</th>
						<th width="120">
							<TechToolDropDown {...this.props} />
						</th>

						<th>
						</th>
					</tr>
				</tbody>
			</table>
		 	<ChartCanvas {...canvasProps} />
		</div>
	  );
	}
}

Chart.propTypes = {
	chartlib: PropTypes.object.isRequired,
	canvasSize: PropTypes.object.isRequired,
	canvasWidth: PropTypes.number.isRequired,
	canvasHeight: PropTypes.number.isRequired,
	dispOption: PropTypes.object.isRequired,
	tglDispOption: PropTypes.func.isRequired,
	techTool: PropTypes.object.isRequired,
	setTechTool: PropTypes.func.isRequired,
	technical: PropTypes.object.isRequired,
	toggleTrend: PropTypes.func.isRequired,
	toggleOscillator: PropTypes.func.isRequired,
	setChartShape: PropTypes.func.isRequired,
	chartPeriod: PropTypes.string.isRequired,
	setTickType: PropTypes.func.isRequired,
	onChangeIssue: PropTypes.func.isRequired,
	indexCode: PropTypes.string,
	idxname: PropTypes.string,
	onChangeIndex: PropTypes.func,
	onMouseMove: PropTypes.func,
	onMouseDown: PropTypes.func,
	onMouseUp: PropTypes.func,
	onKeyUp: PropTypes.func,
	issueCode: PropTypes.string.isRequired,
	marketCode: PropTypes.string.isRequired,
};

export default Chart;
