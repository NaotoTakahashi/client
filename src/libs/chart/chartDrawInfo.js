import * as CD from './chartDef';

class ChartDrawInfo {
	constructor() {
        this.m_areaTop          = 0; //描画領域（上）
        this.m_areaBottom       = 0; //描画領域（下）
        this.m_areaRight        = 0; //描画領域（右=幅）
        this.m_areaWidth        = 0; //チャート描画幅(DRAW開始時に毎回SET)
        this.m_areaHeight       = 0; //チャート描画縦(DRAW開始時に毎回SET)
        this.m_areaMarginBase   = 0; //チャート描画絶対マージン位置（上）
        this.m_areaMarginTop    = 0; //チャート描画マージン（上）
        this.m_areaMarginBottom = 0; //チャート描画マージン（下）
        this.m_areaMarginLeft   = 0; //チャート描画マージン（左）
		this.m_areaMarginRight  = 0; //チャート描画マージン（右）
		this.m_chartInnerMargin = 0; //チャート描画エリアマージン（上/下）
        this.m_scaleValueLeft   = 0; //チャートX軸表示最大値
        this.m_scaleValueRight  = 0; //チャートX軸表示最小値
        this.m_scaleValueTop    = 0; //チャートY軸表示最大値
        this.m_scaleValueBottom = 0; //チャートY軸表示最小値
        this.m_scaleValueDecimal= 0; //チャートX軸表示値小数点倍数
		this.m_validDegits		= 0; //チャートX軸表示値小数点桁数
        this.m_scaleRangeUnit   = 0; //チャートY軸1レンジ表示単位
        this.m_scaleRangeNum    = 0; //チャートY軸1レンジ値幅
        this.m_scaleXRangeUnit  = 0; //チャートX軸1レンジ表示単位
        this.m_scaleXRangeNum   = 0; //チャートX軸1レンジ値幅
        
        this.m_rangeHeight      = [];	//Y軸スケールレンジ高さ(LOG表示)	
    
        //初期値設定
        this.m_areaMarginRight  = CD.CHART_AREA_MARGIN_RIGHT;
        this.m_areaMarginLeft   = CD.CHART_AREA_MARGIN_LEFT;
        this.m_areaMarginTop    = 5;
        this.m_areaMarginBottom = 0;
    
        this.m_candleWidth      = 5;
        this.m_candleMargin     = 3;
        this.m_areaStartPosY    = 5;
        this.m_mousePosX = 0;
        this.m_mousePosY = 0;
    
        this.m_fixedLeftWidth = 0;
        this.m_fixedAreaWidth = 0;
        this.m_fixedAreaSide = true;
    }
    //==============================================================================
    //	描画領域全体
    //==============================================================================
	//描画領域（上）
	setAreaTop(top) { this.m_areaTop = top;}
	getAreaTop() { return this.m_areaTop; }
	//描画領域（下）
	setAreaBottom(btm) { this.m_areaBottom = btm;}
	getAreaBottom() { return this.m_areaBottom; }
	//描画領域（右）
	setAreaWidth(x) { this.m_areaRight = x; }
	getAreaWidth() { return this.m_areaRight; }
	//描画領域（高）
	setAreaHeight(sz) { this.m_areaBottom = this.m_areaTop + sz; }
	getAreaHeight() { return (this.m_areaBottom - this.m_areaTop); }
    //==============================================================================
    //	チャート描画領域
    //==============================================================================
	//チャート描画エリア幅
	//setChartAreaWidth (x){ this.m_areaWidth = x; },
	setChartAreaWidth() { this.m_areaWidth = this.m_areaRight - this.m_fixedLeftWidth - this.m_areaMarginLeft - this.m_areaMarginRight;}
	getChartAreaWidth() { return this.m_areaWidth; }
	//チャート描画エリア開始位置(X)
	getChartAreaBgnPosX() { return this.m_fixedLeftWidth + this.m_areaMarginLeft; }
	//チャート描画エリア終了位置(X)
	//getChartAreaEndPosX (){ return this.m_fixedLeftWidth + this.m_areaMarginLeft + this.m_areaWidth - this.m_areaMarginRight;},
	getChartAreaEndPosX() { return this.m_fixedLeftWidth + this.m_areaMarginLeft + this.m_areaWidth;}
	//チャート描画エリア縦(調整前)
	getChartAreaHeightNotAdjust() { return (this.m_areaBottom - this.m_areaTop) - this.m_areaMarginBottom - this.m_areaMarginTop; }
	//チャート描画エリア縦
	setChartAreaHeight(y) { this.m_areaHeight = y; }
	getChartAreaHeight() { return this.m_areaHeight; }
	//チャート描画エリアマージン（上/下）
	setChartAreaInnerMargin(y){ this.m_chartInnerMargin = y; }
	getChartAreaInnerMargin(){ return this.m_chartInnerMargin; }
	//チャート描画エリアマージン（上）
	setChartAreaMarginTop(y) { this.m_areaMarginTop = y; }
	getChartAreaMarginTop() { return this.m_areaMarginTop; }
	//チャート描画エリアマージン（下）
	setChartAreaMarginBtm(y) { this.m_areaMarginBottom = y; }
	getChartAreaMarginBtm() { return this.m_areaMarginBottom; }
	//チャート描画エリアマージン（左）
	setChartAreaMarginLeft(x) { this.m_areaMarginLeft = x; }
	getChartAreaMarginLeft() { return this.m_areaMarginLeft; }
	//チャート描画エリアマージン（右）
	setChartAreaMarginRight(x) { this.m_areaMarginRight = x; }
	getChartAreaMarginRight() { return this.m_areaMarginRight; }
	//チャートX軸表示最大値
	setScaleValueLeft(i) { this.m_scaleValueLeft = i; }
	getScaleValueLeft() { return this.m_scaleValueLeft; }
	//チャートX軸表示最小値
	setScaleValueRight(i) { this.m_scaleValueRight = i; }
	getScaleValueRight() { return this.m_scaleValueRight; }
	//チャートY軸表示最大値
	setScaleValueTop(i) { this.m_scaleValueTop = i; }
	getScaleValueTop() { return this.m_scaleValueTop; }
	//チャートY軸表示最小値
	setScaleValueBtm(i) { this.m_scaleValueBottom = i; }
	getScaleValueBtm() { return this.m_scaleValueBottom; }
	//チャートX軸表示値小数点桁数
	setScaleValueDec(i) { this.m_scaleValueDecimal = i; }
	getScaleValueDec() { return this.m_scaleValueDecimal; }
	//チャートX軸表示値小数点桁数
	setValidDegits(i) { this.m_validDegits = i; }
	getValidDegits() { return this.m_validDegits; }
	//固定描画エリア幅（左固定時）
	//setFixedLeftWidth (x){ this.m_fixedLeftWidth = x; }, //考慮対象外にしたい場合の直接セット
	//getFixedLeftWidth (){ return this.m_fixedLeftWidth; },
	//チャートY軸表目盛単位
	setScaleRangeUnit(i) { this.m_scaleRangeUnit = i; }
	getScaleRangeUnit() { return this.m_scaleRangeUnit; }
	//チャートY軸表示レンジ個数
	setScaleRangeNum(i) { this.m_scaleRangeNum = i; }
	getScaleRangeNum() { return this.m_scaleRangeNum; }
	//チャートY軸１レンジ高さ
	getScaleRangeHeight() { return (this.m_areaHeight / this.m_scaleRangeNum) >> 0; }
	//チャートX軸表目盛単位
	setScaleXRangeUnit(i) { this.m_scaleXRangeUnit = i; }
	getScaleXRangeUnit() { return this.m_scaleXRangeUnit; }
	//チャートX軸表示レンジ個数
	setScaleXRangeNum(i) { this.m_scaleXRangeNum = i; }
	getScaleXRangeNum() { return this.m_scaleXRangeNum; }
	//チャートX軸１レンジ幅
	getScaleRangeWidth() { return this.m_areaWidth / this.m_scaleXRangeNum; }
	//X軸値変換(値 → X軸表示位置)
	cnvValueToPosX(value) {
		return this.m_fixedLeftWidth + this.m_areaMarginLeft + (this.m_areaWidth*value)/this.m_scaleValueRight;
	}
	//Y軸値変換(値 → Y軸表示位置)
	cnvValueToPosY(value) {
		return this.m_areaTop + this.m_areaMarginTop + (this.m_areaHeight*(this.m_scaleValueTop-value))/(this.m_scaleValueTop-this.m_scaleValueBottom);
	}
	//X軸値変換(X軸表示位置 → 値)
	cnvPosXToValue(xpos) {
		return (this.m_scaleValueRight*(xpos-this.m_fixedLeftWidth-this.m_areaMarginLeft))/this.m_areaWidth;
	}
	//エリア開始位置(X)
	getAreaBgnPosX() {
		return 0;
	}
	//チャート固定描画エリア有無によるマージンセット
	setFixedAreaDraw(stat) {
		//固定情報非表示時
		this.m_fixedLeftWidth = 0;
		this.m_fixedAreaWidth = 0;
		this.m_areaMarginRight = CD.CHART_AREA_MARGIN_RIGHT;
		this.m_areaMarginLeft = CD.CHART_AREA_MARGIN_LEFT;
	}
	//チャート固定描画エリア表示側切替え
	setFixedAreaSide(stat) { this.m_fixedAreaSide = stat; }
	//チャート描画エリア開始位置(Y)
	setChartAreaBgnPosY() {
	    //m_areaStartPosY = this.m_areaTop + this.getAreaHeight() - this.m_areaHeight - this.m_areaMarginBottom;
	    this.m_areaStartPosY = this.m_areaTop + (this.getAreaHeight() - this.m_areaHeight - this.m_areaMarginBottom);
	}
	getChartAreaBgnPosY() { return this.m_areaStartPosY; }
	//チャート描画エリア終了位置(Y)
	getChartAreaEndPosY() { return this.m_areaStartPosY + this.m_areaHeight; }
	//チャート描画エリア開始位置(Y)(予備マージンを含めた開始位置)
	getChartAreaBgnPosYWithMgn() { return this.m_areaStartPosY - this.m_chartInnerMargin; }
	//チャート描画エリア開始位置(Y)(予備マージンを含めた終了位置)
	getChartAreaEndPosYWithMgn() { return this.m_areaStartPosY + this.m_areaHeight + this.m_chartInnerMargin; }


	//チャート右固定描画エリア開始位置(X)
//	getFixedAreaBgnPosX(){
//		if(m_fixedAreaSide){
//			//右側固定表示時
//			return m_areaMarginLeft + m_areaWidth + 1;
//		}else{
//			//左側固定表示時
//			return 0;
//		}
//	}
	//チャート右固定描画エリア終了位置(X)
	getFixedAreaEndPosX() {
		return this.getFixedAreaBgnPosX() + this.m_fixedAreaWidth;
    }
    //値段スケールエリアもOKにする場合
    isInnerExChartAreaX(x) {
        if ((this.m_fixedLeftWidth + this.m_areaMarginLeft <= x) && (x <= this.m_areaRight)) {
            return true;
        }
        return false;
    }
	//チャート描画エリア内判定
	isInnerChartAreaX(x) {
	    if ((this.m_fixedLeftWidth + this.m_areaMarginLeft <= x) && (x <= this.getChartAreaEndPosX())) {
			return true;
		}
		return false;
	}
	isInnerChartAreaY(y) {
	    if ((this.m_areaStartPosY <= y) && (y <= this.getChartAreaEndPosY())) {
			return true;
		}
		return false;
	}
	isInnerChartArea(x, y) {
	    if (this.isInnerChartAreaX(x) && this.isInnerChartAreaY(y)) {
			return true;
		}
		return false;
	}
	isInnerChartAreaWithMgn(x, y) {
	    if (this.isInnerChartAreaX(x) && (this.getChartAreaBgnPosYWithMgn() <= y) && (y <= this.getChartAreaEndPosYWithMgn())){
			return true;
		}
		return false;
	}

	//1エントリ幅
	setCandleWidth(w) { this.m_candleWidth = w; }
	getCandleWidth() { return this.m_candleWidth; }
	//エントリ間余白幅
	setCandleMarginWidth(w) { this.m_candleMargin = w; }
	getCandleMarginWidth() { return this.m_candleMargin; }
	//1エントリ幅 + 1エントリ余白幅
	getEntryWidth() { return this.m_candleWidth + this.m_candleMargin; }

	//チャート描画エリア逆算最大サイズ（引数：ヒストリカルエントリ数）
	getMaxChartAreaWidth(sz) { return sz * this.getEntryWidth() + this.m_candleMargin; }
	//チャートY軸表示値幅
	getScaleValueGap() { return this.m_scaleValueTop - this.m_scaleValueBottom; }
	//チャートY軸表示高さ更新(MAIN_CHARTのみ)
	setScaleRangeHeightForLog(i, val) { this.m_rangeHeight[i] = val; }
	addScaleRangeHeightForLog(i, val) { this.m_rangeHeight[i] += val; }
	getScaleRangeHeightForLog(i) { return this.m_rangeHeight[i]; }
	//マウスポインタ位置
	setMousePos(x, y) { this.m_mousePosX = x; this.m_mousePosY = y; }
	//マウスポインタ位置(X)
	getMousePosX() { return this.m_mousePosX; }
	setMousePosX(x) { this.m_mousePosX = x; }
	//マウスポインタ位置(Y)
	getMousePosY() { return this.m_mousePosY; }
	setMousePosY(y) { this.m_mousePosY = y; }

	//X軸エントリ変換(エントリ番号 → X軸表示位置)(DRAW TOOL 表示用)
	cnvEntryToPosX(bgn, entry) {
		//dummyWidthは呼出元で加算
		if(bgn <= entry){
			let x = ((entry - bgn) * (this.m_candleWidth + this.m_candleMargin));
			return this.m_fixedLeftWidth + this.m_areaMarginLeft + x;
		}
		return -1;
	}
	//Y軸値変換(値段 → Y軸表示位置)
	cnvValueToPosYForPrice(price) {
		let val = this.m_areaStartPosY + (this.m_areaHeight*(this.m_scaleValueTop-price))/(this.m_scaleValueTop-this.m_scaleValueBottom);
		return val;
	}
	//Y軸値変換(値段 → Y軸表示位置(対数))
	cnvValueToPosYForPriceForLog(price) {
		let entry_ix = 0;
		let chkprice = this.m_scaleValueTop - this.m_scaleRangeUnit;
		for(let i=0; i<this.m_scaleRangeNum; i++){
			if(chkprice < price){
				entry_ix = i;
				break;
			}
			chkprice -= this.m_scaleRangeUnit;
		}
		let height = 0;
		for(let i=0; i<entry_ix; i++){
			height += this.m_rangeHeight[i];
		}
		let top_price = chkprice + this.m_scaleRangeUnit;
		let btm_price = chkprice;
		let entry_ypos = (this.m_rangeHeight[entry_ix]*(top_price-price))/(top_price-btm_price);
		let target_yos = this.m_areaStartPosY + height + entry_ypos;
		return target_yos;
	}
	//Y軸値変換(出来高 → Y軸表示位置)
	cnvValueToPosYForVol(val) {
		let height = this.getChartAreaHeight();
		return (this.getChartAreaBgnPosY() + height - (((height * val) / (this.getScaleValueGap())))) >> 0;
	}
	//Y軸値変換(MACD → Y軸表示位置)
	cnvValueToPosYForMacd(val) {
		let startY = this.getChartAreaBgnPosY();
		let height = this.getChartAreaHeight();
		let heightHalf = this.getChartAreaHeight() / 2;
		if(0 < val){
		    return (this.getChartAreaEndPosY() - (((height * val) / (this.getScaleValueGap())))) - heightHalf;
		} else if (val < 0) {
		    let tmp = height - (((height * Math.abs(val)) / (this.getScaleValueGap()))) - heightHalf;
			return startY + heightHalf + (heightHalf - tmp);
		}else{
			return startY + heightHalf;
		}

	}
	//Y軸値変換(OSCILLATOR → Y軸表示位置)
	cnvValueToPosYForOsc(val) {
		let height = this.getChartAreaHeight();
		if(this.getScaleValueTop() <= val){
		    return this.getChartAreaBgnPosY() + 1;
		} else if (val <= this.getScaleValueBtm()) {
		    return this.getChartAreaBgnPosY() + height - 1;
		}else{
		    let top = this.getScaleValueTop();
		    let btm = this.getScaleValueBtm();
			let range = 0; //相対レンジ
			//let base  = 0; //相対位置
			let off_value = 0;
			if((btm < 0) && (0 <= top)){
				range = top + Math.abs(btm);
				off_value = val + Math.abs(btm);
			}else if((btm < 0) && (top < 0)){
                range = Math.abs(btm) - Math.abs(top);
                off_value = Math.abs(btm - Math.abs(val)); 
			}else{
				range = top - btm;
				off_value = val - btm; 
			}
			let wk = this.getChartAreaBgnPosY() + ((height*(range - off_value)) /range);
			return wk;
		}
	}
	//Y軸値変換(Y軸表示位置 → 値段)
	cnvPosYToValue(y) {
		return this.m_scaleValueTop - (((this.m_scaleValueTop-this.m_scaleValueBottom) * (y-this.m_areaStartPosY)) / this.m_areaHeight);
	}
	//Y軸値変換(Y軸表示位置 → 値段)(対数)
	cnvPosYToValueForLog(y) {
		let entry_ix = 0;
		let chkYpos = this.m_areaStartPosY;
		let total_price = this.m_scaleValueTop;
		for (let i = 0; i < this.m_scaleRangeNum; i++) {
		    chkYpos += this.m_rangeHeight[i]; 
			if(y < chkYpos){
				//該当エントリ検出
				entry_ix = i;
				break;
			}
            total_price -= this.m_scaleRangeUnit;
		}
        let total_height = chkYpos - this.m_rangeHeight[entry_ix];
		let top_price = total_price;
		let btm_price = total_price - this.m_scaleRangeUnit; 
		let target_val = top_price - (((top_price-btm_price) * (y-total_height)) / this.m_rangeHeight[entry_ix]);
		return target_val;
	}
	cnvPosYToValueForSub(y) {
		// NORMAL一択
		let val = this.m_scaleValueTop - ((this.m_scaleValueTop - this.m_scaleValueBottom) * (y - this.m_areaStartPosY)) / this.m_areaHeight;
		return val;
	}
	//X軸値変換(X軸表示位置 → エントリ番号)
	cnvPosXToEntryIndex(start, x) {
		return ((x - (this.m_fixedLeftWidth + this.m_areaMarginLeft)) / (this.m_candleWidth + this.m_candleMargin) + start) >> 0;
	}
	//X軸値変換(X軸スクロール位置 → 描画開始エントリ番号)
	cnvPosXToBgnEntryIndex(nPos) {
		if(nPos <= 0) return 0;
		return (nPos / (this.m_candleWidth + this.m_candleMargin) + 1) >> 0;
	}
	//X軸値変換(エントリ番号 → X軸スクロール位置)
	cnvEntryIndexToPosN(i) {
		if(i < 0) return 0;
		return i * this.getEntryWidth() + this.m_candleMargin;
	}
	//X軸値変換(出来高 → X軸表示位置)
	cnvValueToPosXForVol(val) {
		let width = this.getChartAreaWidth();
		//let x = (width * val / this.m_scaleValueRight) >> 0;
		let x = (width * val / (this.m_scaleValueRight - this.m_scaleValueLeft)) >> 0;
		return this.m_fixedLeftWidth + this.m_areaMarginLeft + x;
	}
	//チャート描画可能エントリ数取得
	getCanDrawCount() {
		let entryWidth = this.getEntryWidth();
		let retCnt = this.m_areaWidth / entryWidth;
		let sup = this.m_areaWidth % entryWidth;
		if (this.m_candleWidth <= sup) {
			retCnt++;
		}
		///描画可能件数調整(最終エントリはMarginを含めないで描画判定するため)
		//double surplus = fmod( (double)m_areaWidth, (double)getEntryWidth() );
		//if(m_candleWidth <= surplus){
		//	retCnt++;

        if (0 < this.m_areaWidth && retCnt === 0) {
			//畳み込んで1エントリのみの場合は不足しても描画
			retCnt = 1;
		}
		return retCnt >> 0;
	}
}

export default ChartDrawInfo;
