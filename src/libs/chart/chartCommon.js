import ChartDrawInfo from './chartDrawInfo';
import ChartButton from './chartButton';
import ChartColorPicker from './chartColorPicker';
import * as CD from './chartDef';

const OUTLINE_COLOR      = 'rgb(30,54,80)';

export default class ChartCommon {
	constructor(chartCanvas) {
        this.m_cc = chartCanvas;
        this.m_info = null; //外から受け取る
        this.m_infoBk = null;
        this.m_drawInf = new ChartDrawInfo();
        this.m_drawParam = null;
        this.m_chartID = 0;
        this.m_chartTitle = "";
        this.m_changeSizeFlag = false; //リアルデータ更新判定フラグ
        this.m_backLineEntry = new Array(CD.BK_LINE_MAX);	//バックライン(縦)エントリ退避
        this.m_backLineXpos = new Array(CD.BK_LINE_MAX);	//バックライン(縦)表示位置
        this.m_bkLineEntryIndex = 0;		//バックライン(縦)最終エントリ
        this.m_decPoint = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];
        this.m_indexPanel = null; //指標パネル

        this.m_btnSetting = new ChartButton();
        this.m_btnSetting.init("");
        this.m_btnSetting.setImage(chartCanvas.m_settingImgSrc);
        this.m_btnClose = new ChartButton();
        this.m_btnClose.init("X");
        this.m_btnUp = new ChartButton();
        this.m_btnDn = new ChartButton();
        this.m_btnUp.init("▲");
        this.m_btnDn.init("▼");

        this.m_colorPicker = new ChartColorPicker(chartCanvas);
        this.m_isDrawColorPicker = false;
    }
    setBaseInfo (info) {
        this.m_info = info;
    }
    setIndexPanel(panel) {
        this.m_indexPanel = panel;
    }
    withDec(val, dec)
    {
        if(dec === 0) {
            return val;
        }
        return val / this.m_decPoint[dec];
    }
    withDecStr(val, dec, degits)
    {
        if(dec === 0) {
            return '' + val;
        }
        let num = val / this.m_decPoint[dec];
        return num.toFixed(degits);
    }
    roundDownDecStr (val, dec) {
        if (dec === 0) {
            return val.toString() >> 0;
        }
        var ret = (val / this.m_decPoint[dec]).toFixed(Number(dec));
        return ret;
    }
    indexToStr (val, dec) {
        if (val === undefined) {
            return;
        }
        if (dec === 0) {
            //指標は小数点２桁
            return val.toFixed(Number(2));
        } else {
            return (val / this.m_decPoint[dec]).toFixed(2);
        }
    }
    settLeftRighAreaMargin(){
        // スケール用マージンセット
        if(this.m_info.isScaleLeft()){
            this.m_drawInf.setChartAreaMarginLeft(CD.CHART_AREA_MARGIN_LEFT);
        } else {
            this.m_drawInf.setChartAreaMarginLeft(10);
        }
        if (this.m_info.isScaleRight()) {
            this.m_drawInf.setChartAreaMarginRight(CD.CHART_AREA_MARGIN_RIGHT);
        } else {
            this.m_drawInf.setChartAreaMarginRight(10);
        }
    }
    getMaxMinValue (price, val) {
        if (val <= 0.0) return;
        if (price.maxPrice < val) {
            price.maxPrice = val;
        } else if (val < price.minPrice) {
            price.minPrice = val;
        }
    }
    getDataTypeStr(dataType) {
        switch (dataType) {
            case CD.CHART_DATA_DAY:
                return '(日足)';
            case CD.CHART_DATA_WEEK:
                return '(週足)';
            case CD.CHART_DATA_MONTH:
                return '(月足)';
            case CD.CHART_DATA_MIN:
                return '(分足)';
            default:
                return '(？？)';
        }
    }
    // カラーピッカー関連
    setColorPickerEnbled(boolVal) {
        this.m_isDrawColorPicker = boolVal;
    }
    isDrawColorPicker() {
        return this.m_isDrawColorPicker;
    }
    // 1エントリ描画サイズ情報退避(BaseInfo→DrawInfo)
    copyEntryDrawWidth () {
        this.m_drawInf.setCandleWidth(this.m_info.getCandleWidth());
        this.m_drawInf.setCandleMarginWidth(this.m_info.getCandleMarginWidth());
    }
    // 1エントリ描画サイズ情報取得(指定エントリ)
	getEntryDrawWidthForAllDisp(sz) {
		let width = (this.m_drawInf.getChartAreaWidth() / sz) >> 0;
		if(width < 1){
			width = 1;
		}
		return width;
    }
    // 可変エントリサイズ取得
	getVariableEntryWidth(i, max) {
        if (max <= i) i = max - 1;
		let nextpos, entry_width, candle_width;
		let bgnix = this.m_info.getBeginIndex();
		let xpos = this.m_drawInf.cnvValueToPosX(i - bgnix);
		nextpos = this.m_drawInf.cnvValueToPosX((i + 1) - bgnix);
		entry_width = nextpos - xpos;
		if(entry_width <= 0){
			entry_width = 1;
		}
		candle_width = this.getVariableCandleWidth(entry_width);
		return [xpos, entry_width, candle_width];
    }
	// 可変キャンドルサイズ取得
	getVariableCandleWidth(entry_width) {
		if(entry_width <= 1){
			return entry_width;
		}else if(50 < entry_width){
			return entry_width - 5;
		}else if(30 < entry_width){
			return entry_width - 4;
		}else if(10 < entry_width){
			return entry_width - 3;
		}else if(5 < entry_width){
			return entry_width - 2;
		}
		return entry_width-1;
	}
    //==============================================================================
    //	POS→エントリ取得
    //==============================================================================
    getPosToEntry (xpos) {
        //if(this.m_info.IsAllDisp()){
		//	return m_drawInf.CnvPosXToValue(xpos);
		//}
        if(this.m_info.isVariableMode() && (0 <= this.m_info.getVariableBgnIndex())){
			return (this.m_drawInf.cnvPosXToValue(xpos) + this.m_info.getBeginIndex()) >> 0;
		}
		return this.m_drawInf.cnvPosXToEntryIndex(this.m_info.getBeginIndex(), xpos) >> 0;
    }
    //==============================================================================
    //	POS→エントリ取得([ChartDrawInfo]外から受け取り)(LOUPE,DRAW_TOOL)
    //==============================================================================
    getPosToEntryForExt (drawInf, x) {
		let dummy = this.m_info.getDummyEntryWidth();
		let xpos = x - dummy;
		//if(m_info->IsAllDisp()){
		//	return pDrawInf->CnvPosXToValue(xpos);
		//}
		if (this.m_info.isVariableMode() && 0 <= this.m_info.getVariableBgnIndex()) {
			return (drawInf.cnvPosXToValue(xpos) + this.m_info.getBeginIndex()) >> 0;
		}
		let start = this.m_info.getBeginIndex();
		return drawInf.cnvPosXToEntryIndex(start, xpos) >> 0;
    }
    //==============================================================================
    //	エントリ取得→POS取得
    //==============================================================================
    getEntryToPos(ix) {
		//(注意)TOOLからの利用不可
		let val = 0;
		// if(m_info->IsAllDisp()){
		// 	val = m_drawInf.CnvValueToPosX(ix);
		if (this.m_info.isVariableMode() && (0 <= this.m_info.getVariableBgnIndex())){
		 	//DRAW TOOLで使用しなくなったため、可変モードでは呼ばれなくなった
            let dummy = this.m_info.getDummyEntryWidth();
			let disp_num = this.m_info.getLastIndex() - this.m_info.getBeginIndex();
			let entry_width  = 0;
			let candle_width = 0;
			let retVal = this.getVariableEntryWidth(ix, disp_num, entry_width, candle_width);	
			val = dummy + retVal[0] +  (candle_width === 0)? 0 : (candle_width / 2);
		}else{
			let bgnix = this.m_info.getBeginIndex();
			val = this.m_drawInf.cnvEntryToPosX(bgnix, ix);
		}
		return val;
    }
    //==============================================================================
    //	POS → エントリ取得(ツール用)
    //==============================================================================
    getPosToEntryForMinus(x) {
        let xbgn = this.m_drawInf.getChartAreaBgnPosX();
        let xend = this.m_drawInf.getChartAreaEndPosX();
        //let ybgn = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        //let yend = this.m_drawInf.getChartAreaEndPosYWithMgn();
        let info = this.m_info;
        let bgn_entry = info.getBeginIndex();
        let last_entry = info.getLastIndex();
        if(0 < x) {
            return this.getPosToEntryForExt(this.m_drawInf, x);
        }
        let true_length = Math.abs(x) + xbgn;
        let entry = 0;
        if(true_length < xend - xbgn){
            let wk_entry = this.getPosToEntryForExt(this.m_drawInf, true_length);
            entry = bgn_entry - (wk_entry - bgn_entry);
        }else{
            let cnt = 0;
            let wk_len = xend - xbgn;
            while(wk_len <= true_length){
                true_length -= wk_len;
                cnt++;
                if(true_length < wk_len){
                    break;
                }
            }
            let wk_entry = this.getPosToEntryForExt(this.m_drawInf, true_length);
            entry = bgn_entry - ((wk_entry - bgn_entry) + ((last_entry - bgn_entry) * cnt));
        }
        if(entry < 0){
            entry = 0;
        }
        return entry;
    }
    //==============================================================================
    //	値段表示幅取得(指数を含まない)
    //==============================================================================
    getPriceRange(sta, cnt, dispPrice) {
        let price = { maxPrice: 0.0, minPrice: 999999999.0 };
        let pHist = this.m_info.getCurrentHist();
        let dspcnt = sta + cnt;
        //let fwdcnt = 0;
        let maxEntry = pHist.getEntrySize();
        if (maxEntry < dspcnt) {
            if (sta === dspcnt) {
                //最低1エントリは回す
                sta = dspcnt - 1;
            }
            //fwdcnt = dspcnt - maxEntry;
            dspcnt = maxEntry;
        }

        for (let i = sta; i < dspcnt; i++) {
            let pt = pHist.mChartList[i];

            // 海外指数等終値しかない場合があるためその場合は終値で調整
            let val = pt.mHighPrice <= 0 ? pt.mClosePrice : pt.mHighPrice;
            if (price.maxPrice < val) {
                price.maxPrice = val;
            }
            // 海外指数等終値しかない場合があるためその場合は終値で調整
            val = pt.mLowPrice <= 0 ? pt.mClosePrice : pt.mLowPrice;
            if (val < price.minPrice) {
                price.minPrice = val;
            }
        }

        dispPrice.m_dispMaxPrice = price.maxPrice;
        dispPrice.m_dispMinPrice = price.minPrice;
    }
    //==============================================================================
    //	スケール表示間隔調整
    //==============================================================================
    getScaleTerm () {
        let type = this.m_info.m_curdata.mDataType;
        let candle_width = this.m_drawInf.getCandleWidth();
        if (candle_width === 3) {
            if (type === CD.CHART_DATA_MONTH || type === CD.CHART_DATA_DAY) {
                return 0;
            } else if (type === CD.CHART_DATA_WEEK) {
                return 3;
            } else {
                return 1;
            }
        } else if (candle_width === 2) {
            if (type === CD.CHART_DATA_MONTH || type === CD.CHART_DATA_DAY) {
                return 1;
            } else if (type === CD.CHART_DATA_WEEK) {
                return 4;
            } else {
                return 1;
            }
        } else if (candle_width === 1) {
            if (type === CD.CHART_DATA_MONTH || type === CD.CHART_DATA_DAY) {
                return 2;
            } else if (type === CD.CHART_DATA_WEEK) {
                return 11;
            } else {
                return 2;
            }
        } else {
            if (type === CD.CHART_DATA_WEEK) {
                return 1;
            }
        }
        return 0;
    }
    //==============================================================================
    //	バックライン表示判定
    //==============================================================================
    isDrawBackLineForTick(pt, prev, xpos) {
        let stat = false;
        let bgn_margin = this.m_drawInf.getChartAreaBgnPosX() + this.m_drawInf.getCandleMarginWidth();
        let data_type = this.m_info.m_curdata.getDataType();
        if (pt.mIntTime !== prev.mIntTime && bgn_margin < xpos) {
            stat = true;
        }
        return stat;
    }
    isDrawBackLine(pt, curdate, curweek, xpos) {
        let stat = false;
        let bgn_margin = this.m_drawInf.getChartAreaBgnPosX() + this.m_drawInf.getCandleMarginWidth();
        let data_type = this.m_info.m_curdata.getDataType();

        if (data_type == CD.CHART_DATA_MIN) {
            if (this.m_info.m_curdata.mChartMin === 1) {
                //HH:MM
                if (pt.mTime.charAt(4) === '0' && bgn_margin < xpos) {
                    stat = true;
                }
            } else {
                if (pt.mTime.substring(3, 5) == "00" && bgn_margin < xpos) {
                    stat = true;
                }
            }
        } else if(data_type == CD.CHART_DATA_DAY) {
            /*
            if(pt->mDayOfWeek <= curweek){
                stat = true;
            }
            */
            if (pt.mDate.substring(5, 7) != curdate[0] && bgn_margin < xpos) {
                stat = true;
            }
            curdate[0] = pt.mDate.substring(5, 7); //引数参照渡し
        }else if(data_type == CD.CHART_DATA_WEEK){
            if (pt.mDate.substring(5, 7) != curdate[0] && bgn_margin < xpos) {
                stat = true;
            }
            curdate[0] = pt.mDate.substring(5, 7); //引数参照渡し
        }else if(data_type == CD.CHART_DATA_MONTH){
            if (pt.mDate.substring(0, 4) != curdate && bgn_margin < xpos) {
                stat = true;
            }
            curdate[0] = pt.mDate.substring(0, 4); //引数参照渡し
        }
        return stat;
    }
    setScaleRangeValue(maxVal, minVal, permitMinus, mode, dec) {
        let surplus   = 0; //余り
    
        let maxPrice = (maxVal / this.m_decPoint[dec]) >> 0;
        let minPrice = (minVal / this.m_decPoint[dec]) >> 0;
    
        let range = maxPrice - minPrice;
        if(!permitMinus && minPrice < 0){
            minPrice = 0;
        }
    
        let unit = 0;
        let base = 1;
        let val = 0;
    
        let top_scale_value = 0;
        let btm_scale_value = 0;
        if(range <= 5){
            if(maxPrice <= 10000){		//呼び値考慮
                val = 1;
            }else{
                val = 5;
            }
        }else if(range <= 10){
            if(maxPrice < 10000){		//呼び値考慮
                val = 2;
            }else if(maxPrice < 50000){	//呼び値考慮
                val = 5;
            }else{
                val = 10;
            }
        }else if(range <= 30){
            if(maxPrice < 50000){		//呼び値考慮
                val = 5;
            }else{
                val = 10;
            }
        }else{
            while(unit <= range){
    
                //ベースを更新(10倍)
                base = (base << 3) + (base << 1);
    
                //10倍で判定
                val = base; // BASE
                unit = (val << 2) + (val << 1);	//unit = val * 6倍;
                if(range < unit){
                    break;
                }
    
                //20倍で判定
                val = base << 1; // BASE x 2
                unit = (val << 2) + (val << 1);	//unit = val * 6倍;
                if(range < unit) {
                    break;
                }
    
                //50倍で判定
                val = (base << 2) + base; // BASE x 5
                unit = (val << 2) + (val << 1);	//unit = val * 6倍;
                if(range < unit) { 
                    break;
                }
    
            }
        }
    
        //スケール値段単位確定
        let scaleRangeUnit = val;
    
        //高値を単位値段で調整
        surplus = maxPrice % scaleRangeUnit;
        //surplus = (maxPrice + scaleRangeUnit) % scaleRangeUnit;
        if(surplus !== 0){
            top_scale_value = (((maxPrice + scaleRangeUnit) / scaleRangeUnit) >> 0) * scaleRangeUnit;
        }else{
            top_scale_value = maxPrice;
        }
    
        //安値を単位値段で調整
        let wk_scale = top_scale_value; 
        while(minPrice < wk_scale) wk_scale -= scaleRangeUnit;
        btm_scale_value = wk_scale;
        if((!permitMinus) && (btm_scale_value < 0)){
            btm_scale_value = 0;
        }
    
        if(top_scale_value === btm_scale_value){
            top_scale_value += 1;
            btm_scale_value -= 1;
            if(!permitMinus && btm_scale_value < 0){
                btm_scale_value = 0;
            }
        }

        //スケール本数
        let wk_scale_range_num = (top_scale_value - btm_scale_value) / scaleRangeUnit;
        let scale_range_num = wk_scale_range_num >> 0;
    
        //確定値更新
        if(btm_scale_value < 0){
            let sup = top_scale_value % scaleRangeUnit;
            let wk_range_num = (top_scale_value / scaleRangeUnit) >> 0;
            if(sup !== 0){
                top_scale_value = wk_range_num * scaleRangeUnit + scaleRangeUnit;
                wk_range_num++;
            }
            let wk_minus_range_num = (Math.abs(btm_scale_value) / scaleRangeUnit) >> 0;
            let wk_minus_value = wk_minus_range_num * scaleRangeUnit;
            if(wk_minus_value < Math.abs(btm_scale_value)){
                btm_scale_value = - (wk_minus_value + scaleRangeUnit);
            }
            scale_range_num = ((top_scale_value - btm_scale_value) / scaleRangeUnit) >> 0;
        }
        if(scale_range_num <= 0){
            // 出来高が無い時に入る
            scale_range_num = 1;
        }
        if (mode === CD.CHART_VERTICAL) {
            this.m_drawInf.setScaleRangeUnit(scaleRangeUnit * this.m_decPoint[dec]);
            this.m_drawInf.setScaleValueTop(top_scale_value * this.m_decPoint[dec]);
            this.m_drawInf.setScaleValueBtm(btm_scale_value * this.m_decPoint[dec]);
            this.m_drawInf.setScaleRangeNum(scale_range_num);
        }else{
            this.m_drawInf.setScaleXRangeUnit(scaleRangeUnit * this.m_decPoint[dec]);
            this.m_drawInf.setScaleXRangeNum(scale_range_num);
            this.m_drawInf.setScaleValueLeft(btm_scale_value * this.m_decPoint[dec]);
            this.m_drawInf.setScaleValueRight(top_scale_value * this.m_decPoint[dec]);
        }
        return;
    }

    getScaleValue (value, result) {
        //出来高用
        //result[0]:上段スケール値　result[1]:1目盛単位
        var top_value = value >> 0;
        if (top_value <= 5) {
            result[0] = 5;
            result[1] = 1;
            return;
        }
        if (top_value <= 10) {
            result[0] = 10;
            result[1] = 2;
            return;
        }
        var str_value = top_value.toString();
        var num = Number(str_value.charAt(0));
        if ((num === 6) || (num === 8)) {
            num += 2;
        } else {
            num++;
        }
        var zero_str = "";
        var top_value_len = str_value.length;
        for (var i = 0; i < top_value_len - 1; i++) zero_str += "0";
        var sNum = num.toString();
        if (num < 10) {
            result[0] = Number(sNum.charAt(0) + zero_str);
        } else {
            result[0] = Number(sNum.substring(0, 2) + zero_str);
        }
        //目盛単位
        var rangeUnit = 0;
        if (num === 2) {
            rangeUnit = "5" + zero_str.substring(0, zero_str.length - 1);
        } else if ((3 <= num) && (num <= 5)) {
            rangeUnit = "1" + zero_str;
        } else if ((num === 6) || (num === 8) || (num === 10)) {
            rangeUnit = "2" + zero_str;
        } else {
            rangeUnit = num.toString() + zero_str;    //ERROR
        }
        result[1] = Number(rangeUnit);
        return;
    }
    //==============================================================================
    //	[描画] 最大値取得
    //==============================================================================
    getMaxMinIndexValue (idx, ivcnt, sta, dcnt, value) {
        // idx = パラメータ開始エントリ（IV_XXXを指定）
        // ivcnt = IVの本数が複数ある場合は[ivcnt]にカウント数を設定（例：モメンタムは２本）
        // sta = 描画開始エントリ
        // dcnt = 描画エントリ数
        // max = 最大値格納先
        // min = 最小値格納先
        // 最小値が「0」の場合は本関数を呼出した後にminをゼロクリアする。
        var maxVal = 0.0;
        var minVal = 0.0;
        var dspcnt = sta + dcnt;
        var pHist = this.m_info.getCurrentHist();
        var listSize = this.m_info.getCurHistSize();
        if (listSize < dspcnt) {
            dspcnt = listSize;
        }
        minVal = 0.0;
        for (var i = sta; i < dspcnt; i++) {
            var pt = pHist.mChartList[i];
            for (var j = 0; j < ivcnt; j++) {
                var val = pt.mIndexValue[idx + j];
                if (val === CD.INDEX_NO_VALUE) continue;
                if (maxVal < val) {
                    maxVal = val;
                }
                if (val < minVal) {
                    minVal = val;
                }
            }
        }
        value.max = (maxVal >> 0) + 1;
        value.min = (minVal >> 0) - 1;
        return;
    }
    // 新
    getMaxMinIndexValue2 (data, idx, ivcnt, sta, dcnt, value) {
        // data = データ格納配列
        // idx = パラメータ開始エントリ（IV_XXXを指定）
        // ivcnt = IVの本数が複数ある場合は[ivcnt]にカウント数を設定（例：モメンタムは２本）
        // sta = 描画開始エントリ
        // dcnt = 描画エントリ数
        // max = 最大値格納先
        // min = 最小値格納先
        // 最小値が「0」の場合は本関数を呼出した後にminをゼロクリアする。
        let maxVal = 0.0;
        let minVal = 0.0;
        let dspcnt = sta + dcnt;
        let listSize = data[idx].length;
        if (listSize < dspcnt) {
            dspcnt = listSize;
        }
        if(0 < value.min){
            minVal = value.min; 
        }
        for (let i = sta; i < dspcnt; i++) {
            for (let j = 0; j < ivcnt; j++) {
                let val = data[idx + j][i];
                if (val === CD.INDEX_NO_VALUE) continue;
                if (maxVal < val) {
                    maxVal = val;
                }
                if (val < minVal) {
                    minVal = val;
                }
            }
        }
        value.max = (maxVal >> 0) + 1;
        value.min = (minVal >> 0) - 1;
        return;
    }
    //==============================================================================
    //	1エントリ描画サイズ最適値(全体表示指示時)
    //==============================================================================
    setEntryDrawWidth (value) {
        if (value >= 10) {
            this.m_info.setCandleWidth(8);
            this.m_info.setCandleMarginWidth(2);
        } else if (value >= 8) {
            this.m_info.setCandleWidth(value - 2);
            this.m_info.setCandleMarginWidth(2);
        } else if (value === 7) {
            this.m_info.setCandleWidth(5);
            this.m_info.setCandleMarginWidth(2);
        } else if (value === 6) {
            this.m_info.setCandleWidth(4);
            this.m_info.setCandleMarginWidth(2);
        } else if (value === 5) {
            this.m_info.setCandleWidth(4);
            this.m_info.setCandleMarginWidth(1);
        } else if (value === 4) {
            this.m_info.setCandleWidth(3);
            this.m_info.setCandleMarginWidth(1);
        } else if (value === 3) {
            this.m_info.setCandleWidth(3);
            this.m_info.setCandleMarginWidth(0);
        } else if (value === 2) {
            this.m_info.setCandleWidth(2);
            this.m_info.setCandleMarginWidth(0);
        } else if (value === 1) {
            this.m_info.setCandleWidth(1);
            this.m_info.setCandleMarginWidth(0);
        }
        return;
    }
    //==============================================================================
    //	1エントリ描画ELIPSEサイズ値
    //==============================================================================
    getEntryElipseWidth (value) {
        if (value >= 10) {
            return 8;
        } else if (value >= 8) {
            return 5;
        } else if (value === 7) {
            return 3;
        } else if (value === 6) {
            return 3;
        } else if (value === 5) {
            return 3;
        } else if (value === 4) {
            return 2;
        } else if (value === 3) {
            return 2;
        } else if (value === 2) {
            return 0;
        } else if (value === 1) {
            return 0;
        }
        return 0;
    }
    //==============================================================================
    //	縦軸スケール高さ設定(対数モード)
    //==============================================================================
    setDrawRangeHeight() {
        //1レンジ当りの高さを比率に従って算出
        let scaleNum = this.m_drawInf.getScaleRangeNum();
        //let scaleUnit = this.m_drawInf.getScaleRangeUnit();
        //let scaleValTop = this.m_drawInf.getScaleValueTop();
        //let tmpScaleVal = 0;
        //let totalRate = 0;
        //let heightRate = new Array();

        //*** ノーマルモードの場合 ***
        let height = this.m_drawInf.getScaleRangeHeight();
        for (let i = 0; i < scaleNum; i++) {
            this.m_drawInf.setScaleRangeHeightForLog(i, height);
        }
        return;

    }
    //==============================================================================
    //	チャート外枠描画
    //==============================================================================
    drawOutBack() {
        let areaTop = this.m_drawInf.getAreaTop();
        let areaLeft = 0;
        let areaRight = this.m_drawInf.getAreaWidth();
        let areaBtm = this.m_drawInf.getAreaBottom();
        let chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        //let chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        //let chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        let chartBgnMgnPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let chartEndMgnPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
        let backColor = OUTLINE_COLOR;

        //LEFT
        this.m_cc.drawFill(backColor, areaLeft, areaTop, chartBgnPosX, areaBtm);

        //RIGHT
        this.m_cc.drawFill(backColor, chartEndPosX, areaTop, areaRight, areaBtm);

        //TOP
        this.m_cc.drawFill(backColor, areaLeft, areaTop, areaRight, chartBgnMgnPosY);

        //BOTTOM
        this.m_cc.drawFill(backColor, areaLeft, chartEndMgnPosY, areaRight, areaBtm + 5);
    }
    drawOutOfChartArea(isShowHeader) {
        const chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        const chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        const chartBgnMgnPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        const chartEndMgnPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
        const isScaleLeft = this.m_info.isScaleLeft();
        const isScaleRight = this.m_info.isScaleRight();
        const decPoint = this.m_drawInf.getScaleValueDec();
        let degits = this.m_drawInf.getValidDegits();

        // 外枠描画
        this.drawOutBack();

        let string_posx_L = chartBgnPosX-15;	//左表示
        let string_posx_R = chartEndPosX+11;	//右表示
        let scaleNum = this.m_drawInf.getScaleRangeNum();
        let scaleUnit = this.m_drawInf.getScaleRangeUnit();
        let ypos = chartBgnPosY;

        let dispPrice = 0;
        //let disp_mode = this.m_drawInf.getDispMode();
        let disp_mode = CD.CHART_DMODE_NML;
        if(disp_mode == CD.CHART_DMODE_REV){
            //反転モード初期値
            dispPrice = this._drawInf.getScaleValueBtm();
        }else{
            //標準・対数モード初期値
            dispPrice = this.m_drawInf.getScaleValueTop();
        }

        let prev_sty_ypos = 0;	//表示可否縦幅判定用
        //CDP::SetFont(qpt, CDPC::FONT_SCALE);
        let max = scaleNum+1;

        let scaleColor = this.m_drawParam.getColor(this.m_drawParam.m_color.SCALE.c);
        let scaleUnitColor = this.m_drawParam.getColor(this.m_drawParam.m_color.SCALE_UNIT.c);

        // 最上段マージン部
        this.m_cc.drawLine(scaleColor, chartBgnPosX-0.7, chartBgnMgnPosY, chartEndPosX, chartBgnMgnPosY);
        // 最下段マージン部
        this.m_cc.drawLine(scaleColor, chartBgnPosX-0.7, chartEndMgnPosY, chartEndPosX, chartEndMgnPosY);

        // 小数部目盛表示要否
        if(0 < scaleUnit){
            if(0 == (scaleUnit % this.m_decPoint[decPoint])){
                degits = 0;
            }
        }
        // 新規上場等で表示値段が存在しない場合は値段文字列描画なし
        let isStrDraw = true;
        if(dispPrice <= 1){
            isStrDraw = false;
        }else if(0 < decPoint){
            if(1 == dispPrice / this.m_decPoint[decPoint]){
                isStrDraw = false;
            }
        }
        // 最低文字列間隔
        let latestYpos = (isShowHeader)? 20 : 10;
        // 目盛描画
        for (let i = 0; i < max; i++) {
            // 左目盛線
            if (isScaleLeft) {
                this.m_cc.drawLine(scaleUnitColor, chartBgnPosX - 8, ypos, chartBgnPosX, ypos);
            }
            // 右目盛線
            if (isScaleRight) {
                this.m_cc.drawLine(scaleUnitColor, chartEndPosX, ypos, chartEndPosX + 8, ypos);
            }
            let str_ypos = ypos - 8;
            if (prev_sty_ypos + latestYpos < str_ypos) {
                // 値段文字列
                if(isStrDraw){
                    let strVal = this.withDecStr(dispPrice, decPoint, degits);
                    // 左目盛表示値段
                    if (isScaleLeft) {
                        this.m_cc.drawStringR(strVal, string_posx_L, str_ypos, scaleUnitColor);
                    }
                    // 右目盛表示値段
                    if (isScaleRight) {
                        this.m_cc.drawStringL(strVal, string_posx_R, str_ypos, scaleUnitColor);
                    }
                    prev_sty_ypos = str_ypos;
                }
            }
            // 最終エントリ(最下段)の場合は縦軸描画
            if(i+1 === max){
                // 左縦軸線
                this.m_cc.drawLine(scaleColor, chartBgnPosX-1, chartBgnMgnPosY-0.5, chartBgnPosX-1, chartEndMgnPosY + 0.5);
                // 右縦軸線
                this.m_cc.drawLine(scaleColor, chartEndPosX-1, chartBgnMgnPosY-0.5, chartEndPosX-1, chartEndMgnPosY + 0.5);
                // 最下部線
                //if(fixRightDisp){
                    //CDP::DrawLine(qpt, m_drawParam->m_hPen[P_SCALE], chartBgnPosX-10, ypos, chartBgnPosX-1, ypos);
                //    this.m_cc.drawLine(scaleColor, chartBgnPosX-10, ypos, chartBgnPosX-1, ypos);
                //}
                this.m_cc.drawLine(scaleColor, chartEndPosX+1, ypos, chartEndPosX+10, ypos);
            }
            // 描画位置更新
            ypos += this.m_drawInf.getScaleRangeHeightForLog(i);
            // 表示値段更新
            if(disp_mode == CD.CHART_DMODE_REV){
                // 反転モード加算
                dispPrice += scaleUnit;
            }else{
                // 標準・対数モード減算
                dispPrice -= scaleUnit;
            }
        }

        let hist = this.m_info.getCurrentHist();
        const szHist = hist.mChartList.length;
        if(0 < szHist){
            let pt = hist.mChartList[szHist - 1];
            //if (pt.mDataStatus !== CD.FIXED) {
                // 現在値表示
                const lastPrice = pt.mClosePrice >> 0;
                const ypos = (this.m_drawInf.cnvValueToPosYForPrice(lastPrice) >> 0) - 7;
                const validPrice = lastPrice / this.m_decPoint[hist.mDecimalScale];
                const s_price = validPrice.toFixed(hist.mValiｄDegits);
                if(ypos - 6 < this.m_drawInf.getChartAreaEndPosY()){
                    if (isScaleRight) {
                        const width = 55;
                        const xpos = this.m_drawInf.getChartAreaEndPosX();
                        this.m_cc.drawFillRoundRect("red", "red", xpos + 2, ypos, width, 15, 4);
                        this.m_cc.drawStringC(s_price, xpos + (width >> 1) + 2, ypos, "white");
                    }
                    if (isScaleLeft) {
                        const width = 52;
                        const xpos = 0;
                        this.m_cc.drawFillRoundRect("red", "red", xpos + 2, ypos, width, 15, 4);
                        this.m_cc.drawStringC(s_price, xpos + (width >> 1) + 2, ypos, "white");
                    }
                }
            //}
        }

        return degits;
    }
    //==============================================================================
    //	[描画] 横軸スケールライン
    //==============================================================================
    drawRangeOfRate() {
        let decPoint = this.m_drawInf.getScaleValueDec();
        let degits = this.m_drawInf.getValidDegits();
        let chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        let chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let chartBgnPosMgnY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let chartEndPosMgnY = this.m_drawInf.getChartAreaEndPosYWithMgn();
        //let string_posx_L = chartBgnPosX - 20; //左表示
        let string_posx_R = chartEndPosX + 15; //右表示
        let scaleNum = this.m_drawInf.getScaleRangeNum();
        let scaleUnit = this.m_drawInf.getScaleRangeUnit();
        let s_price;
        let ypos = chartBgnPosY;

        //標準・対数モード初期値
        let dispPrice = this.m_drawInf.getScaleValueTop();

        let prev_sty_ypos = 0; //表示可否縦幅判定用
        let max = scaleNum + 1;

        this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, chartBgnPosMgnY, chartEndPosX + 1, chartBgnPosMgnY);
        for (let i = 0; i < max; i++) {
            this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX, ypos);
            //左目盛線
            //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX-10, ypos, chartBgnPosX-1, ypos);
            //右目盛線
            this.m_cc.drawLine(this.m_cc.m_colScale, chartEndPosX + 1, ypos, chartEndPosX + 10, ypos);
            var str_ypos = ypos - 8;
            if ((prev_sty_ypos + 13 < str_ypos) || (prev_sty_ypos === 0)) {
                s_price = this.withDecStr(dispPrice, decPoint, degits);
                //左目盛表示値段
                  //this.m_cc.drawStringR( hdc, s_price, string_posx_L, str_ypos, m_color_scale );
                //右目盛表示値段
                this.m_cc.drawStringL(s_price, string_posx_R, str_ypos);
                prev_sty_ypos = str_ypos;
            }
            //最終エントリ(最下段)の場合は縦軸描画
            if (i + 1 === max) {
                //左縦軸線
                //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX-1, chartBgnPosY, chartBgnPosX-1, ypos);
                //右縦軸線
                this.m_cc.drawLine(this.m_cc.m_colScale, chartEndPosX + 1, chartBgnPosMgnY, chartEndPosX + 1, chartEndPosMgnY);
                //最下部線
                this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX + 10, ypos);
                //最下部線(マージン部分)
                this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, chartEndPosMgnY, chartEndPosX + 1, chartEndPosMgnY);
            }
            //描画位置更新
            ypos += this.m_drawInf.getScaleRangeHeightForLog(i);
            //表示値段更新
            //標準・対数モード減算
            dispPrice -= scaleUnit;
        }
        return;
    }
    //==============================================================================
    //	[描画] バックスケールライン(縦軸)
    //==============================================================================
    // drawBackScaleLine (xPos, pt, prev_xpos, disp_str) {
    //     //this.m_cc.drawLine(this.m_cc.m_colScale, xPos, this.m_drawInf.getChartAreaBgnPosY(), xPos, this.m_drawInf.getChartAreaEndPosY());
    //     let bgn_ypos = this.m_drawInf.getChartAreaBgnPosYWithMgn();
    //     let end_ypos = this.m_drawInf.getChartAreaEndPosYWithMgn();
    //     this.m_cc.drawDottedLine(this.m_cc.m_colScale, xPos, bgn_ypos, xPos, end_ypos);
    //     end_ypos += 2;
    //     let dataType = this.m_info.m_curdata.mDataType;
    //     if (prev_xpos === 0 || prev_xpos + 50 < xPos) {
    //         if (dataType === CD.CHART_DATA_MIN) {
    //             // 時間表示指示判定
    //             if(disp_str){
    //                 this.m_cc.drawStringL(pt.mTime, xPos - 14, end_ypos);
    //             }
    //         } else if (dataType === CD.CHART_DATA_DAY) {
    //             let strVal = pt.mDate.substring(2, 7);
    //             this.m_cc.drawStringL(strVal, xPos - 14, end_ypos);
    //         } else if (dataType === CD.CHART_DATA_WEEK) {
    //             let strVal = pt.mDate.substring(2, 7);
    //             this.m_cc.drawStringL(strVal, xPos - 14, end_ypos);
    //         } else if (dataType === CD.CHART_DATA_MONTH) {
    //             let strVal = pt.mDate.substring(0, 4);
    //             this.m_cc.drawStringL(strVal, xPos - 14, end_ypos);
    //         }
    //         prev_xpos = xPos;
    //     }
    // }
    //==============================================================================
    //	[描画] バックスケールライン(縦軸)
    //==============================================================================
    drawBackScaleLine(xPos, pt, prev_xpos, isDateChange) {
        const bgn_ypos = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        const end_ypos = this.m_drawInf.getChartAreaEndPosYWithMgn();
        const scaleColor = this.m_drawParam.getColor(this.m_drawParam.m_color.SCALE.c);
        if (!isDateChange) {
            //this.m_cc.drawDottedLine(this.m_drawParam.m_clrColor[CD.CLR_SCALE_DOT], xPos-1, bgn_ypos, xPos-1, end_ypos);
            this.m_cc.drawThinLine(scaleColor, xPos-1, bgn_ypos, xPos-1, end_ypos);
        }else{
            // 日付変更時色変更
            //this.m_cc.drawDottedLine(this.m_drawParam.m_clrColor[CD.CLR_SCALE_DATE], xPos-1, bgn_ypos, xPos-1, end_ypos);
            this.m_cc.drawThinLine(scaleColor, xPos-1, bgn_ypos, xPos-1, end_ypos);
        }
        let ret = false;	//文字列の描画可否判定結果
        if (prev_xpos === 0 || prev_xpos + 50 < xPos) {
            ret = true;
            prev_xpos = xPos;
        }
        return [ret, prev_xpos];
    }
    //==============================================================================
    //	[描画] バックライン(シングル)
    //==============================================================================
    drawBackLine(xPos, prev_xpos) {
        let bgn_ypos = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let end_ypos = this.m_drawInf.getChartAreaEndPosYWithMgn();
        this.m_cc.drawLine("rgb(70, 70, 70)", xPos-1, bgn_ypos, xPos-1, end_ypos);
        let ret = false;	//文字列の描画可否判定結果
        if (prev_xpos === 0 || prev_xpos + 50 < xPos) {
            ret = true;
            prev_xpos = xPos;
        }
        return [ret, prev_xpos];
    }
    //==============================================================================
    //	[描画] バックライン(サブ縦軸)
    //==============================================================================
    // drawBackLine (xpos) {
    //      let ypos1 = this.m_drawInf.getChartAreaBgnPosY() + 1;
    //      let ypos2 = this.m_drawInf.getChartAreaEndPosY();
    //      //this.m_cc.drawLine(this.m_cc.m_colScale, xpos, ypos1, xpos, ypos2);
    //      this.m_cc.drawDottedLine(this.m_cc.m_colScale, xpos, ypos1, xpos, ypos2);
    // }
    //==============================================================================
    //	描画位置変更指示判定
    //==============================================================================
    isAreaChange(mposx, mposy) {
        if (this.m_btnUp.isInnerBtn(mposx, mposy)) {
            return 1;
        }
        if (this.m_btnDn.isInnerBtn(mposx, mposy)) {
            return 2;
        }  
        return 0;
    }
    //==============================================================================
    //	[描画] 設定ボタン表示
    //==============================================================================
    drawSettingButton(btnBgnPosX, btnBgnPosY, w, h, areaIndex) {
        let mouse_pos_x = this.m_info.getMousePosX();
        let mouse_pos_y = this.m_info.getMousePosY();
        let btnWidth = w;
        let btnHeight = h;
        let center = btnWidth >> 1;

        // 設定ボタン
        const btn_rc = { left: btnBgnPosX, top: btnBgnPosY, right: btnBgnPosX + btnWidth, bottom: btnBgnPosY + btnHeight }
        let img_left = ((btnBgnPosX + (btnWidth >> 1)) - (btnHeight >> 1)) >> 0;
        let img_right = img_left + btnHeight;
        const img_rc = { left: img_left + 2, top: btnBgnPosY + 2, right: img_right - 2, bottom: btnBgnPosY + (btnHeight - 2) }
        this.m_btnSetting.setPos(btn_rc);
        this.m_btnSetting.setImagePos(img_rc);
        this.m_btnSetting.draw(this.m_cc);
    }
    //==============================================================================
    //	[描画] 上下入替ボタン表示
    //==============================================================================
    drawSwapButton(btnBgnPosX, btnBgnPosY, w, h, areaIndex) {
        let mouse_pos_x = this.m_info.getMousePosX();
        let mouse_pos_y = this.m_info.getMousePosY();
        let btnWidth = w;
        let btnHeight = h;
        let btnUp_rc = { left: btnBgnPosX, top: btnBgnPosY, right: btnBgnPosX + btnWidth, bottom: btnBgnPosY + btnHeight }
        btnBgnPosX = btnUp_rc.right + 1;
        let btnDn_rc = { left: btnBgnPosX, top: btnBgnPosY, right: btnBgnPosX + btnWidth, bottom: btnBgnPosY + btnHeight }
        if (btnUp_rc.left - 10 < mouse_pos_x && mouse_pos_x < btnDn_rc.right + 10) {
            if(btnUp_rc.top - 10 < mouse_pos_y && mouse_pos_y < btnUp_rc.bottom + 10){
                let areaNum = this.m_info.getAreaNum();
                if (areaNum <= 1) return;
                if (0 === areaIndex) {
                    // 下のみ
                    this.m_btnDn.setPos(btnDn_rc);
                    this.m_btnDn.draw(this.m_cc);
                    this.m_btnUp.clearPos();
                }else if (areaNum === areaIndex + 1) {
                    // 上のみ
                    this.m_btnUp.setPos(btnDn_rc);
                    this.m_btnUp.draw(this.m_cc);
                    this.m_btnDn.clearPos();
                } else { 
                    this.m_btnUp.setPos(btnUp_rc);
                    this.m_btnUp.draw(this.m_cc);
                    this.m_btnDn.setPos(btnDn_rc);
                    this.m_btnDn.draw(this.m_cc);
                }
                return;
            }
        }
        this.m_btnUp.clearPos();
        this.m_btnDn.clearPos();
    }
    //==============================================================================
    //	[描画] パラメータ設定画面表示
    //==============================================================================
    drawParamSetting(rc, tittle, paarmNum, slider, pramName, colorLabel, btnModColor) {

        this.m_cc.drawStringL(tittle, rc.left + 10, rc.top + 10, "rgb(190,190,190)");

        // パラメータ変更画面描画
        let x1 = rc.left + 30;
        let x2 = x1 + 300;
        let y1 = rc.top + 50;
        let slider_rc = {left: x1, top: y1, right: x2, bottom: 0}
        let color_rc = {left: x1, top: y1, right: x2, bottom: 0}

        for (let i = 0; i < paarmNum; ++i){
            // スライダータイトル描画
            this.m_cc.drawStringL(pramName[i], x1, y1, "rgb(255,255,255)");
            // パラメータスライダー描画
            if(slider[i] !== null){
                y1 += 15;
                slider_rc.top = y1;
                slider_rc.bottom = y1 + 30;
                slider[i].draw(slider_rc, this.m_cc);
                y1 += 20;
            }
            // パラメータカラー
            if(colorLabel[i] !== null){
                y1 += 15;
                color_rc.top = y1;
                color_rc.bottom = y1 + 20;
                colorLabel[i].draw(color_rc);
                // カラー変更ボタン
                let btnWidth = 42;
                let btnHeight = color_rc.bottom - color_rc.top;
                let btnLeft = x2 + 12;
                let btn_rc = { left: btnLeft, top: y1, right: btnLeft + btnWidth, bottom: y1 + btnHeight }
                btnModColor[i].setPos(btn_rc);
                btnModColor[i].draw(this.m_cc);
                y1 += 20;
            }
            // 次回
            y1 += 15;
        }
    }
    //==============================================================================
    //	カラーピッカー設定画面
    //==============================================================================
    drawColorSetting(rc, tittle) {

        this.m_cc.drawStringL(tittle, rc.left + 10, rc.top + 10, "rgb(190,190,190)");

        // カラーピッカー画面描画
        if(this.m_isDrawColorPicker){
            rc.top += 40;
            this.m_colorPicker.draw(rc);
            return;
        }
    }
    //==============================================================================
    //	[描画] エントリ無初期表示
    //==============================================================================
    drawEmptyForSub () {
        var chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        var chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        var chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        var chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        //var string_posx_L = chartBgnPosX - 20; //左表示
        //var string_posx_R = chartEndPosX + 15; //右表示
        var scaleNum = (chartEndPosY - chartBgnPosY) / 3 >> 0;
        var scaleSide = (chartEndPosX - chartBgnPosX) / 4 >> 0;
        //var s_price;
        var ypos = chartBgnPosY;
        var xpos = chartEndPosX;

        //最上部線
        this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX + 10, ypos);
        ypos += scaleNum;
        this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX + 10, ypos);
        ypos += scaleNum;
        this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX + 10, ypos);
        ypos += scaleNum;
        this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX + 10, ypos);
        //右縦軸線
        this.m_cc.drawLine(this.m_cc.m_colScale, chartEndPosX + 1, chartBgnPosY, chartEndPosX + 1, ypos);
        xpos -= scaleSide;
        this.m_cc.drawLine(this.m_cc.m_colScale, xpos, chartBgnPosY, xpos, ypos);
        xpos -= scaleSide;
        this.m_cc.drawLine(this.m_cc.m_colScale, xpos, chartBgnPosY, xpos, ypos);
        xpos -= scaleSide;
        this.m_cc.drawLine(this.m_cc.m_colScale, xpos, chartBgnPosY, xpos, ypos);
        xpos -= scaleSide;
        this.m_cc.drawLine(this.m_cc.m_colScale, xpos, chartBgnPosY, xpos, ypos);
    }
    //==============================================================================
    //	日時文字列取得
    //==============================================================================
    getDateStr(s_date, type) {
        let sdate;
        if (10 <= s_date.length) {
            if (type === CD.CHART_DATA_MIN) {
                sdate = s_date;
            }else if (type === CD.CHART_DATA_MONTH) {
                sdate = s_date.substring(0, 7);
            } else {
                sdate = s_date.substring(0, 10);
            }
        } else {
            sdate = s_date;
        }
        return sdate;
    }
    //==============================================================================
    //	カレントマウス位置取得
    //==============================================================================
    getMousePos() {
        let mouse_pos_x = this.m_info.getMousePosX();
        let mouse_pos_y = this.m_info.getMousePosY();
        const chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        const chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosY();

        //カレントマウス位置調整
        if (mouse_pos_x < chartBgnPosX) {
            mouse_pos_x = chartBgnPosX;
        } else if(chartEndPosX < mouse_pos_x) {
            mouse_pos_x = chartEndPosX;
        }
        if (mouse_pos_y < chartBgnPosY) {
            mouse_pos_y = chartBgnPosY;
        } else if(chartEndPosY < mouse_pos_y) {
            mouse_pos_y = chartEndPosY;
        }

        return [mouse_pos_x, mouse_pos_y]
    }

    getGraphColor(colorVal, len) {
        let color = [];
        for (let i = 0; i < len; i++) {
            color.push(this.m_drawParam.getColor(colorVal[i]));
        }
        return color;
    }
}

