import * as CTP from './chartTechParameter';
import * as CD from './chartDef';
import * as IDX from './chartDef';
import {ChartTech, ChartTechEMA} from './chartTechIndex';

const TI_DEC_DIGIT = 10000;

//--------------------------------------------------------------------
// MACD
//--------------------------------------------------------------------
export const TI_MAC_EMA_1 = 0;
export const TI_MAC_EMA_2 = 1;
export const TI_MAC_MACD = 2;
export const TI_MAC_MACDS = 3;
export const TI_MAC_OSCI = 4;
export const TI_MAC_MAX = 5;
export class ChartTechMACD extends ChartTech {
	constructor() {
        super(TI_MAC_MAX);
        this.m_EMA = new ChartTechEMA();
        this.m_prm_num = CTP.PRM_MAC_MAX;
        this.m_prm_EMA = new Array(2);  // 指数平滑移動平均本数
        this.m_prm_MACD = 0;            // MACDシグナル移動平均本数
        this.m_maxMACD = 0;
        this.m_data = new Array(TI_MAC_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter(n1, n2, n3) {
        this.m_prm_EMA[0] = n1;  // 指数平滑移動平均本数
        this.m_prm_EMA[1] = n2;  // 指数平滑移動平均本数
        this.m_prm_MACD = n3;               // MACDシグナル移動平均本数
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

	    //開始インデックス算出
	    //パラメータ最大長本数取得
        let maxPrmLen = this.m_prm_EMA[0];
        if (maxPrmLen < this.m_prm_EMA[1]) {
            maxPrmLen = this.m_prm_EMA[1];
	    }
        if (maxPrmLen < this.m_prm_MACD) {
            maxPrmLen = this.m_prm_MACD;
        }
        
        // 更新インデックス有効範囲
        if (this.m_data[0].length <= target_ix) {
            target_ix = this.m_data.length - 1;
        }

	    //開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
	    if(bgnix < 0){
		    bgnix = 0;
        }
        
	    if(0 < entry){
		    //EMA算出
	        this.m_EMA.setParameter(this.m_prm_EMA[0], this.m_prm_EMA[1]);
	        this.m_EMA.updateIndexValueToObj(list, bgnix);
        }
        
	    for (let i = bgnix; i < entry; i++) {
		    let macdValue = 0.0;
		    let macdsValue= 0.0;
		    let osciValue = 0.0;

		    //MACD算出
		    let eam1Value = this.m_EMA.m_data[0][i]; //短期本数
            let eam2Value = this.m_EMA.m_data[1][i]; //長期本数
            this.m_data[TI_MAC_EMA_1][i] = eam1Value; //短期本数
		    this.m_data[TI_MAC_EMA_2][i] = eam2Value; //長期本数

		    let prm = this.m_prm_EMA[0];
		    if ((0 < prm && prm-1 <= i) && 0 < eam1Value && 0 < eam2Value) {
			    macdValue = eam1Value - eam2Value; //短期-長期
			    let val = Math.abs(macdValue) + 1;
			    if(this.m_maxMACD < val){
				    this.m_maxMACD = val;
			    }
		    }

		    //MACDシグナル算出
            let prmMACD = this.m_prm_MACD; //シグナル本数
		    if ((0 < prmMACD && prmMACD-1 <= i) && 0 < eam1Value && 0 < eam2Value) {
			    //単純平均方式
			    //macdsValue = this.getMACDSignalForSimple(i, macdValue);
			    //指数平均方式
			    macdsValue = this.getMACDSignalForExponential(i, macdValue);
		    }

		    //OSCI算出
		    osciValue = macdValue - macdsValue;

		    //MACD最大値算出
		    let val = Math.abs(macdValue - macdsValue)+1;
		    if(this.m_maxMACD < val){
		        this.m_maxMACD = val;
		    }
		    val = Math.abs(macdsValue)+1;
		    if (this.m_maxMACD < val) {
		        this.m_maxMACD = val;
		    }

            this.m_data[TI_MAC_MACD][i]  = super.setRange(macdValue);
            this.m_data[TI_MAC_OSCI][i] = super.setRange(osciValue);
            this.m_data[TI_MAC_MACDS][i] =  super.setRange(macdsValue);
	    }

	    return;
    }
    //==============================================================================
    // MACD SIGNAL 単純平均方式
    //==============================================================================
    getMACDSignalForSimple(i, macdValue) {
	    const prm = this.m_prm_MACD;
	    let total = macdValue;
	    for (let j = i-1; i - prm<j; j--) {
            total += this.m_data[TI_MAC_MACD][j];
        }
	    return total / prm;
    }
    //==============================================================================
    // MACD SIGNAL 指数平均方式
    //==============================================================================
    getMACDSignalForExponential(i, macdValue) {
	    const prm = this.m_prm_MACD;
	    //***** MAIN *************************
	    let j= i;
		let pev_macds = this.m_data[TI_MAC_MACDS][j-1];
		let emaValue = 0.0;
		if (prm-1 <= j) {
			if(pev_macds === 0.0){
				emaValue = this.getMACDSignalForSimple(j, macdValue);
			}else{
			    emaValue = macdValue * 2 / (prm+1) + pev_macds * (prm+1-2)/(prm+1);
				//emaValue = macds / DEC_DIGIT;
			}
		}else{
			emaValue = 0;
		}
	    return emaValue;
    }
}
//--------------------------------------------------------------------
// STC
//--------------------------------------------------------------------
export const TI_STCK = 0;
export const TI_STCD = 1;
export const TI_STCSD = 2;
export const TI_STC_MAX = 3;
export class ChartTechSTC extends ChartTech {
	constructor() {
        super(TI_STC_MAX);
        this.m_prm_num = CTP.PRM_STC_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_STC_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
        this.m_prm_STCK = 0;
        this.m_prm_STCD = 0;
        this.m_prm_STCSD = 0;
    }
    setParameter (n1, n2, n3) {
        this.m_prm_STCK = n1;
        this.m_prm_STCD = n2;
        this.m_prm_STCSD = n3;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

	    let n1 = this.m_prm_STCK;
	    let n2 = this.m_prm_STCD;
	    let n3 = this.m_prm_STCSD;

	    let high_price = new Array(entry);
	    let low_price = new Array(entry);
	    let value1 = new Array(entry); // 直近終値-過去X本の最安値
	    let value2 = new Array(entry); // 過去X本の最高値-過去X本の最安値
	    let value3 = new Array(entry); // value2（%D）単純移動平均

	    // パラメータ最大長本数取得
        let maxPrm = n1+ n2+ n3;
        
	    // 開始インデックス算出
	    let bgnix = target_ix - (maxPrm - 1);
	    if(bgnix < 0){
		    bgnix = 0;
	    }

	    for (let i = bgnix; i < entry; i++) {
		    let pt = list[i];
		    let stc_k  = CD.INDEX_NO_VALUE;
		    let stc_d  = CD.INDEX_NO_VALUE;
		    let stc_sd = CD.INDEX_NO_VALUE;
		    //***** %K *******
		    high_price[i] = pt.mHighPrice;
		    low_price[i]  = pt.mLowPrice;
		    if((0 < n1) && (n1-1 <= i)){
			    let high = 0.0;
			    let low = 0.0;
			    for (let j = i; i - n1 < j; j-- ){
        		    if( high < high_price[j] ){
        			    high = high_price[j];
        		    }
        		    if(( low_price[j] < low ) || (low === 0)){
        			    low = low_price[j];
        		    }
			    }
			    value1[i] = pt.mClosePrice - low;
			    value2[i] = high - low;
			    stc_k = value1[i] * 100.0 / value2[i];
		    }
		    //***** %D *******
		    if((0 < n2) && (n1+n2-1 <= i)){
			    let val1 = 0.0;
			    let val2 = 0.0;
			    for(let j=i; i-n2<j; j-- ){
        		    val1 += value1[j];
				    val2 += value2[j];
			    }
			    stc_d = value3[i] = val1 * 100.0 / val2 ;
		    }
		    //value3[i] = stc_d;
		    //***** %SD *******
            if (0 < n3 && n1 + n2 + n3 - 1 <= i) {
                //if((0 < n3) && (n2+n3-1 <= i)){
                let total = 0;
                for (let j = i; i - n3 < j; j--) total += value3[j];
                stc_sd = total / n3;
            }
            if (target_ix <= i) {
                this.m_data[TI_STCK][i] = stc_k;
                this.m_data[TI_STCD][i] = stc_d;
                this.m_data[TI_STCSD][i] = stc_sd;
            }
	    }
	    high_price = [];
	    low_price = [];
	    value1 = [];
	    value2 = [];
	    value3 = [];
	    return;
    }
}

//--------------------------------------------------------------------
// SlowSTC
//--------------------------------------------------------------------
export const TI_SSTCD = 0;
export const TI_SSTCSD = 1;
export const TI_SSTC_MAX = 2;
export class ChartTechSSTC extends ChartTech {
	constructor() {
        super(TI_SSTC_MAX);
        this.m_prm_num = CTP.PRM_STC_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_STC_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
        this.m_prm_STCK = 0;
        this.m_prm_STCD = 0;
        this.m_prm_STCSD = 0;
    }
    setParameter (n1, n2, n3) {
        this.m_prm_STCK = n1;
        this.m_prm_STCD = n2;
        this.m_prm_STCSD = n3;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

	    let n1 = this.m_prm_STCK;
	    let n2 = this.m_prm_STCD;
	    let n3 = this.m_prm_STCSD;

	    let high_price = new Array(entry);
	    let low_price = new Array(entry);
	    let value1 = new Array(entry); // 直近終値-過去X本の最安値
	    let value2 = new Array(entry); // 過去X本の最高値-過去X本の最安値
	    let value3 = new Array(entry); // value2（%D）単純移動平均

	    // パラメータ最大長本数取得
        let maxPrm = n1+ n2+ n3;
        
	    // 開始インデックス算出
	    let bgnix = target_ix - (maxPrm - 1);
	    if(bgnix < 0){
		    bgnix = 0;
	    }

	    for (let i = bgnix; i < entry; i++) {
		    let pt = list[i];
		    let stc_d  = CD.INDEX_NO_VALUE;
		    let stc_sd = CD.INDEX_NO_VALUE;
		    //***** %K *******
		    high_price[i] = pt.mHighPrice;
		    low_price[i]  = pt.mLowPrice;
		    if((0 < n1) && (n1-1 <= i)){
			    let high = 0.0;
			    let low = 0.0;
                for (let j = i; i - n1 < j; j--) {
                    if (high < high_price[j]) {
                        high = high_price[j];
                    }
                    if (low_price[j] < low || low === 0) {
                        low = low_price[j];
                    }
                }
			    value1[i] = pt.mClosePrice - low;
			    value2[i] = high - low;
		    }
		    //***** %D *******
		    if((0 < n2) && (n1+n2-1 <= i)){
			    let val1 = 0.0;
			    let val2 = 0.0;
			    for(let j=i; i-n2<j; j-- ){
        		    val1 += value1[j];
				    val2 += value2[j];
			    }
			    stc_d = value3[i] = val1 * 100.0 / val2 ;
		    }
		    //value3[i] = stc_d;
		    //***** %SD *******
            if (0 < n3 && n1 + n2 + n3 - 1 <= i) {
                let total = 0;
                for (let j = i; i - n3 < j; j--) total += value3[j];
                stc_sd = total / n3;
            }
            if (target_ix <= i) {
                this.m_data[TI_SSTCD][i] = stc_d;
                this.m_data[TI_SSTCSD][i] = stc_sd;
            }
	    }
	    high_price = [];
	    low_price = [];
	    value1 = [];
	    value2 = [];
	    value3 = [];
	    return;
    }
}


export const TI_MOM_1 = 0;
export const TI_MOM_2 = 1;
export const TI_MOM_MA1 = 2;
export const TI_MOM_MA2 = 3;
export const TI_MOM_MAX = 4;
//--------------------------------------------------------------------
// [MOM] モメンタム
//--------------------------------------------------------------------
export class ChartTechMOM extends ChartTech {
	constructor() {
        super(TI_MOM_MAX);
        this.m_prm_num = CTP.PRM_MOM_MAX;
        this.m_prm_MOM = new Array(2);
        this.m_prm_MA = new Array(2);
        this.m_prm_MOM.fill(0);
        this.m_prm_MA.fill(0);
        this.m_data = new Array(TI_MOM_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1, n2, n3, n4) {
        this.m_prm_MOM[TI_MOM_1] = n1;
        this.m_prm_MOM[TI_MOM_2] = n2;
        this.m_prm_MA[0] = n3;
        this.m_prm_MA[1] = n4;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < 2; i++ ){
            if (maxPrmLen < this.m_prm_MOM[i]) {
                maxPrmLen = this.m_prm_MOM[i];
            }
            if (maxPrmLen < this.m_prm_MA[i]) {
                maxPrmLen = this.m_prm_MA[i];
            }
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - maxPrmLen;
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_MOM_MAX);
        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            let last_price = pt.mClosePrice;
            let value = 0.0;
            for (let j= 0; j < 2; j++ ) {
                wk_value[j] = CD.INDEX_NO_VALUE;
                wk_value[TI_MOM_MA1 + j] = CD.INDEX_NO_VALUE;
                if(this.m_prm_MOM[j] <= 0) continue;
                let prev = i - this.m_prm_MOM[j];
    
                // モメンタム算出
                if(0 <= prev){
                    if(0 < list[prev].mClosePrice){
                        wk_value[j] = last_price - list[prev].mClosePrice;
                    }else{
                        continue;
                    }
                }
                // 移動平均算出
                if(this.m_prm_MA[j] <= 0) continue;
                if(this.m_prm_MA[j] + this.m_prm_MOM[j] - 1 <= i){
                    let total = 0.0;
                    // 当日分を除いた合計(更新前のため)
                    for(let k = i - 1; i - this.m_prm_MA[j] < k; k-- ){
                        if(this.m_data[j][k] != CD.INDEX_NO_VALUE){
                            total += this.m_data[j][k];
                        }else{
                            total = CD.INDEX_NO_VALUE;
                            break;
                        }
                    }
                    // プラス当日分
                    if(total != CD.INDEX_NO_VALUE){
                        total += wk_value[j];
                        wk_value[TI_MOM_MA1 + j] = total / this.m_prm_MA[j];
                    }
                }
            }
            if(target_ix <= i){
                // 指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data);
            }
        }
        return true;
    }
}

export const TI_RSI_1 = 0;
export const TI_RSI_2 = 1;
export const TI_RSI_MAX = 2;
//--------------------------------------------------------------------
// RSI(A) J.W.ワイルダー方式(指数平滑パターン)
// [1日目]
//  RSI＝N日間の値上り幅平均÷（N日間の値上り幅平均＋N日間の値下り幅平均）×100
// [2日目以降]
// （A＝1日目のN日間の値上り幅平均　B＝1日目のN日間の値下り幅平均）
// 楽天(RSI1) 採用方式
//--------------------------------------------------------------------
export class ChartTechRSIA extends ChartTech {
	constructor() {
        super(TI_RSI_MAX);
        this.m_prm_num = CTP.PRM_RSIA_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_RSI_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter (n1, n2) {
        this.m_prm[0] = n1;
        this.m_prm[1] = n2;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (this.m_data[0].length <= target_ix) {
            target_ix = this.m_data[0].length - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
	    let wk_value = new Array(TI_RSI_MAX);
	    let value1 = new Array(entry); // 指定期間の上昇幅
	    let value2 = new Array(entry); // 指定期間の下落幅

        // UPDATEの場合は必要となる値を事前算出
        let wLastPrice = 0;
        let wPrevPrice = 0;

        if (bgnix !== 0) {
            let ready_ix = bgnix - maxPrmLen;
            if (ready_ix < 0) {
                ready_ix = 0;
            }
            for (let i = ready_ix; i < bgnix; ++i) {
                let pt = list[i];
                if(wPrevPrice === 0){
                    if(0 < pt.mClosePrice){
                        if(0 < i){
                            if(0 < list[i-1].mClosePrice){
                                wPrevPrice = list[i-1].mClosePrice * TI_DEC_DIGIT;
                            }else{
                                // 前日は値段無し(初回エントリ扱い)
                                wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
                                value1[i] = 0;
                                value2[i] = 0;
                                continue;
                            }
                        }else{
                            // 初回エントリ
                            wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
                            value1[i] = 0;
                            value2[i] = 0;
                            continue;
                        }
                    }else{
                        // 値段無し
                        value1[i] = 0;
                        value2[i] = 0;
                        continue;
                    }
                }
                wLastPrice = pt.mClosePrice * TI_DEC_DIGIT;
                let gap = (wLastPrice - wPrevPrice) >> 0;
                if(0 < gap){           //上昇
                    value1[i] = gap;
                    value2[i] = 0;
                }else if(gap < 0){     //下落
                    value1[i] = 0;
                    value2[i] = Math.abs(gap);
                }else{
                    value1[i] = 0;
                    value2[i] = 0;
                }
                wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
            }
        }
        //UPDATE処理
        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            wk_value.fill(CD.INDEX_NO_VALUE);

            if (wPrevPrice === 0) {
                if (0 < pt.mClosePrice) {
                    if (0 < i) {
                        if (0 < list[i - 1].mClosePrice) {
                            wPrevPrice = list[i - 1].mClosePrice * TI_DEC_DIGIT;
                        } else {
                            // 前日は値段無し(初回エントリ扱い)
                            wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
                            value1[i] = 0;
                            value2[i] = 0;
                            super.set(i, wk_value, this.m_data);
                            continue;
                        }
                    } else {
                        // 初回エントリ
                        wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
                        value1[i] = 0;
                        value2[i] = 0;
                        super.set(i, wk_value, this.m_data);
                        continue;
                    }
                } else {
                    // 値段無し
                    value1[i] = 0;
                    value2[i] = 0;
                    super.set(i, wk_value, this.m_data);
                    continue;
                }
            }
            wLastPrice = pt.mClosePrice * TI_DEC_DIGIT;
            let gap = (wLastPrice - wPrevPrice) >> 0;
            if(0 < gap){			//上昇
                value1[i] = gap;
                value2[i] = 0;
            }else if(gap < 0){		//下落
                value1[i] = 0;
                value2[i] = Math.abs(gap);
            }else{
                value1[i] = 0;
                value2[i] = 0;
            }
    
            for (let j = 0; j < this.m_prm_num; ++j) {
                wk_value[j] = CD.INDEX_NO_VALUE;
                let prm = this.m_prm[j];
                let total_up = 0;
                let total_down = 0;
                if (0 < prm && prm-1 === i) {
                    //初回のみRSI-Bで算出
                    for (let k = i; i - prm < k; --k) {
                        total_up   += value1[k];
                        total_down += value2[k];
                    }
                    if(0 < total_up){
                        wk_value[j] = total_up / (total_up + total_down) * 100.0;
                    }
                }else if (0 < prm && prm-1 < i) {
                    //2日目以降
                    //前日からN日間の値上がり・値下がり幅合計
                    for (let k = i - 1; i - prm-1 < k; --k) {
                        total_up   += value1[k];
                        total_down += value2[k];
                    }
                    if (0.0 < total_up) {
                        total_up     /= prm; //平均値(A)
                    }
                    if (0.0 < total_down) {
                        total_down   /= prm; //平均値(A)
                    }
                    //（Ａ×13＋当日の値上がり幅）÷14
                    total_up   = (total_up*(prm-1) + value1[i]) /prm;
                    //（Ａ×13＋当日の値下がり幅）÷14
                    total_down = (total_down*(prm-1) + value2[i]) /prm;
    
                    if(0 < total_up){
                        wk_value[j] = total_up / (total_up + total_down) * 100.0;
                    }else{
                        wk_value[j] = 0.0;
                    }
                }
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data);
            }
            wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
        }
        value1 = [];
        value2 = [];
        return true;
    }
}
//--------------------------------------------------------------------
// RSI(B) カトラー方式（単純平均パターン）
// RSI＝N日間の値上り幅平均÷（N日間の値上り幅平均＋N日間の値下り幅平均）×100
// QUICK/SBI 採用方式
//--------------------------------------------------------------------
export class ChartTechRSIB extends ChartTech {
	constructor() {
        super(TI_RSI_MAX);
        this.m_prm_num = CTP.PRM_RSIB_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_RSI_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter (n1, n2) {
        this.m_prm[0] = n1;
        this.m_prm[1] = n2;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (this.m_data[0].length <= target_ix) {
            target_ix = this.m_data[0].length - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;
    
	    // 算出結果一時格納用
	    let wk_value = new Array(TI_RSI_MAX);
	    let value1 = new Array(entry); // 指定期間の上昇幅
	    let value2 = new Array(entry); // 指定期間の下落幅
    
        //UPDATEの場合は必要となる値を事前算出
        let wLastPrice = 0;
        let wPrevPrice = 0;

        if (bgnix !== 0) {
            let ready_ix = bgnix - maxPrmLen;
            if (ready_ix < 0) {
                ready_ix = 0;
            }
            for (let i = ready_ix; i < bgnix; ++i) {
                let pt = list[i];
                if(wPrevPrice === 0){
                    if(0 < pt.mClosePrice){
                        if(0 < i){
                            if(0 < list[i-1].mClosePrice){
                                wPrevPrice = list[i-1].mClosePrice * TI_DEC_DIGIT;
                            }else{
                                // 前日は値段無し(初回エントリ扱い)
                                wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
                                value1[i] = 0;
                                value2[i] = 0;
                                continue;
                            }
                        }else{
                            // 初回エントリ
                            wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
                            value1[i] = 0;
                            value2[i] = 0;
                            continue;
                        }
                    }else{
                        // 値段無し
                        value1[i] = 0;
                        value2[i] = 0;
                        continue;
                    }
                }
    
                // 当日終値
                wLastPrice = pt.mClosePrice * TI_DEC_DIGIT;
                let gap = (wLastPrice - wPrevPrice) >> 0;
                if(0 < gap){           //上昇
                    value1[i] = gap;
                    value2[i] = 0;
                }else if(gap < 0){     //下落
                    value1[i] = 0;
                    value2[i] = Math.abs(gap);
                }else{
                    value1[i] = 0;
                    value2[i] = 0;
                }
                wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
            }
        }
    
        //UPDATE処理
        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            wk_value.fill(CD.INDEX_NO_VALUE);

            if(wPrevPrice === 0){
                if (0 < pt.mClosePrice) {
                    if (0 < i) {
                        if (0 < list[i - 1].mClosePrice) {
                            wPrevPrice = list[i - 1].mClosePrice * TI_DEC_DIGIT;
                        } else {
                            // 前日は値段無し(初回エントリ扱い)
                            wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
                            value1[i] = 0;
                            value2[i] = 0;
                            super.set(i, wk_value, this.m_data);
                            continue;
                        }
                    } else {
                        // 初回エントリ
                        wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
                        value1[i] = 0;
                        value2[i] = 0;
                        super.set(i, wk_value, this.m_data);
                        continue;
                    }
                } else {
                    // 値段無し
                    value1[i] = 0;
                    value2[i] = 0;
                    super.set(i, wk_value, this.m_data);
                    continue;
                }
            }
            
            // 当日終値
            wLastPrice = pt.mClosePrice * TI_DEC_DIGIT;
            let gap = (wLastPrice - wPrevPrice) >> 0;
            if(0 < gap){			//上昇
                value1[i] = gap;
                value2[i] = 0;
            }else if(gap < 0){		//下落
                value1[i] = 0;
                value2[i] = Math.abs(gap);
            }else{
                value1[i] = 0;
                value2[i] = 0;
            }
    
            for (let j = 0; j < this.m_prm_num; ++j) {
                wk_value[j] = CD.INDEX_NO_VALUE;
                let prm = this.m_prm[j];
                if (0 < prm && prm - 1 <= i) {
                    let total_up = 0;
                    let total_down = 0;
                    for (let k = i; i - prm < k; --k) {
                        total_up   += value1[k];
                        total_down += value2[k];
                    }
                    if(0 < total_up + total_down){
                        wk_value[j] = total_up / (total_up + total_down) * 100.0;
                    }else{
                        wk_value[j] = 0.0;
                    }
                }
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data);
            }
            // 次回用前日終値
            wPrevPrice = pt.mClosePrice * TI_DEC_DIGIT;
        }
        value1 = [];
        value2 = [];
        return true;
    }
}

export const TI_RCI_1 = 0;
export const TI_RCI_2 = 1;
export const TI_RCI_MAX = 2;
//--------------------------------------------------------------------
// [RCI]  RANK CORRELATION INDEX
//--------------------------------------------------------------------
export class ChartTechRCI extends ChartTech {
	constructor() {
        super(TI_RCI_MAX);
        this.m_prm_num = CTP.PRM_RCI_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_RCI_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter (n1, n2) {
        this.m_prm[0] = n1;
        this.m_prm[1] = n2;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (this.m_data[0].length <= target_ix) {
            target_ix = this.m_data[0].length - 1;
        }

        //パラメータの外側によるループ
        for (let prm_ix = 0; prm_ix < this.m_prm_num; ++prm_ix) {
            let prm = this.m_prm[prm_ix];
            let srcPriceArry = new Array(prm);
            let dstPriceArry = new Array(prm);
            let rnkIndexArry = new Array(prm);
            let price = new Array(entry);

            // 開始インデックス算出
            let bgnix = target_ix - (maxPrmLen - 1);
            if (bgnix < 0) bgnix = 0;

            // MAIN LOOP
            for (let i = bgnix; i < entry; ++i) {
                //RANK係数初期化
                let tmp = 100;
                for (let j = 0; j < prm; ++j) {
                    rnkIndexArry[j] = tmp;
                    tmp += 100;
                }
                let val = CD.INDEX_NO_VALUE;
                let pt = list[i];
                price[i] = pt.mClosePrice;
                let foundNoPrice = false;

                if (1 < prm && prm - 1 <= i) {
                    let m = 0;
                    for(let k = i; i - prm < k; --k ){
                        if (0 < price[k]) {
                            srcPriceArry[m] = price[k];
                            dstPriceArry[m] = price[k];
                            m++;
                        } else {
                            foundNoPrice = true;
                            break;
                        }
                    }

                    if (!foundNoPrice) {
                        //this.sortDesc(prm, dstPriceArry);
                        dstPriceArry.sort(function(a,b){
                            if( a > b ) return -1;
                            if( a < b ) return 1;
                            return 0;
                        });
                        for (let n = 0; n < prm;) { //インクリは中で行う
                            let price_val = dstPriceArry[n];
                            let sameCnt = 0;
                            let rnk = rnkIndexArry[n];
                            for (let o = 1; o < prm - n; o++) {
                                if (price_val === dstPriceArry[n+o]) {	// 同じ値段がないかをCHECK
                                    sameCnt++;
                                    rnk += rnkIndexArry[n+o];
                                }
                            }
                            if (sameCnt !== 0) {	// 同じ値段が含まれていた場合は係数を平均化する
                                sameCnt++;		// 最初の比較元が含まれていないためカウントアップ
                                let ave = (rnk / sameCnt) >> 0;
                                for (let p = 0; p < sameCnt; ++p) {
                                    rnkIndexArry[n+p] = ave;
                                }
                                n = n + sameCnt;
                            }else{
                                rnk += 100;
                                n++;
                            }
                        }

                        // ここまでで同列順位による係数が確定
                        let rci_d = 0;
                        for (let q = 0; q < prm; ++q) {
                            // 後は同じ値段をサーチして、その係数を取得して算出式にはめる
                            for (let r = 0; r < prm; ++r) {
                                if (srcPriceArry[q] === dstPriceArry[r]) {
                                    let rankValue = (rnkIndexArry[r] / 100.0) >> 0;
                                    rci_d += (((q+1) - rankValue) * ((q+1) - rankValue));
                                    break;
                                }
                            }
                        }
                        let rci_1 = 6 * rci_d;
                        let rci_2 = prm * ( (prm * prm) - 1);
                        if(rci_2 === 0.0){
                            val = 0.0;
                        }else{
                            val = ( 1 - (rci_1 / rci_2) ) * 100.0;
                        }
                    }
                }
                if (target_ix <= i) {
                    // 指定開始インデックス以降のみ更新
                    this.m_data[prm_ix][i] = val;
                }
            }
            srcPriceArry = null;
            dstPriceArry = null;
            rnkIndexArry = null;
            price = null;
        }
        return true;
    }
}

export const TI_WR = 0;
export const TI_WR_MAX = 1;
//--------------------------------------------------------------------
// [WR] WILLIAMS %R
//--------------------------------------------------------------------
export class ChartTechWR extends ChartTech {
	constructor() {
        super(TI_WR_MAX);
        this.m_prm_num = CTP.PRM_WR_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_WR_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1) {
        this.m_prm[0] = n1;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - maxPrmLen;
        if (bgnix < 0) bgnix = 0;

	    //算出結果一時格納用
        let wk_value = new Array(TI_WR_MAX);
        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            let value = 0.0;
            for (let j= 0; j < this.m_prm_num; j++ ) {
                wk_value[j] = CD.INDEX_NO_VALUE;
                if (0 < this.m_prm[j] && this.m_prm[j] - 1 <= i) {
                    if (0 < pt.mClosePrice) {
                        let [high, low] = super.getHLPrice(list, i, this.m_prm[j]);
                        if (high - low == 0.0) {
                            value = 0.0;
                        } else {
                            value = (high - pt.mClosePrice) * 100.0 / (high - low);
                        }
                        wk_value[j] = (0 - value);
                    }
                }
            }
            if(target_ix <= i){
                // 指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data);
            }
        }
        return true;
    }
}

export const TI_PL = 0;
export const TI_PL_MAX = 1;
//--------------------------------------------------------------------
// [PL] PSYCHOLOGICAL LINE
//--------------------------------------------------------------------
export class ChartTechPL extends ChartTech {
	constructor() {
        super(TI_PL_MAX);
        this.m_prm_num = CTP.PRM_PL_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_PL_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1) {
        this.m_prm[TI_PL] = n1;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - maxPrmLen;
        if (bgnix < 0) bgnix = 0;

	    //算出結果一時格納用
        let wk_value = new Array(TI_PL_MAX);

        for (let i = bgnix; i < entry; ++i) {
            wk_value[TI_PL] = CD.INDEX_NO_VALUE;
            if (0 < this.m_prm[TI_PL] && this.m_prm[TI_PL] <= i) { //初回前日参照ありのため-1不要
                let total = 0;
                for (let j = i - (this.m_prm[TI_PL] - 1); j <= i; ++j ) {
                    //上昇日カウント
                    let pt1 = list[j];
                    let pt2 = list[j-1];
                    if (0 < pt2.mClosePrice) {
                        //前々日終値 ＜ 前日終値
                        if (pt2.mClosePrice < pt1.mClosePrice) {
                            total++;
                        }
                    }else{
                        // 値段無しを検出
                        total = -1;
                        break;
                    }
                }
                if(0 <= total){
                    wk_value[TI_PL] = total * 100;
                    wk_value[TI_PL] /= this.m_prm[TI_PL];
                }
            }
            if (target_ix <= i) {
                // 指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data);
            }
        }
        return true;
    }
}
export const TI_DMA_1 = 0;
export const TI_DMA_2 = 1;
export const TI_DMA_3 = 2;
export const TI_DMA_MAX = 3;
//--------------------------------------------------------------------
// [DMA] DIFFERENCE FROM MOVING AVERAGE
//--------------------------------------------------------------------
export class ChartTechDMA extends ChartTech {
	constructor() {
        super(TI_DMA_MAX);
        this.m_prm_num = CTP.PRM_DMA_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_DMA_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter (n1, n2, n3) {
        this.m_prm[0] = n1;
        this.m_prm[1] = n2;
        this.m_prm[2] = n3;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (this.m_data[0].length <= target_ix) {
            target_ix = this.m_data[0].length - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_DMA_MAX);
        // SMA合計用
        let total = new Array(TI_DMA_MAX);

        for (let i = bgnix; i < entry; ++i) {
            for(let prm_i = 0; prm_i < this.m_prm_num; ++prm_i ){

                let prm = this.m_prm[prm_i];
                if(prm <= 0){
                    wk_value[prm_i] = CD.INDEX_NO_VALUE;
                    continue;
                }
    
                // 初回の場合は事前エントリ取得
                if(i === bgnix){
                    total[prm_i] = 0;
                    let bgn = bgnix - (prm - 1);
                    if(bgn < 0) bgn = 0;
                    for(let j = bgn; j < bgnix; ++j){
                        total[prm_i] += list[j].mClosePrice;
                    }
                }
                
                if (prm - 1 <= i) {
                    total[prm_i] += list[i].mClosePrice;
                    if (0 < list[i - (prm - 1)].mClosePrice) {
                        let sma = total[prm_i] / prm;
                        // 乖離率算出
                        if (sma <= 0.0) {
                            wk_value[prm_i] = CD.INDEX_NO_VALUE;
                        } else {
                            // 乖離率＝（(当日の終値-移動平均値)÷移動平均値）×　100
                            wk_value[prm_i] = ((list[i].mClosePrice - sma) * TI_DEC_DIGIT / sma);
                        }
                    } else {
                        wk_value[prm_i] = CD.INDEX_NO_VALUE;
                    }
                    total[prm_i] -= list[i - (prm - 1)].mClosePrice;
                } else {
                    // 加算のみ
                    wk_value[prm_i] = CD.INDEX_NO_VALUE;
                    total[prm_i] += list[i].mClosePrice;
                }
            }
            if(target_ix <= i){
                //指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data, TI_DMA_MAX);
            }
        }
        return true;
    }
}

export const TI_UO = 0;
export const TI_UO_MAX = 1;
//--------------------------------------------------------------------
// [UO] ULTIMATE OSCILLATOR
//--------------------------------------------------------------------
export class ChartTechUO extends ChartTech {
	constructor() {
        super(TI_UO_MAX);
        this.m_prm_num = CTP.PRM_UO_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_UO_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1, n2, n3) {
        this.m_prm[0] = n1;
        this.m_prm[1] = n2;
        this.m_prm[2] = n3;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_UO_MAX);
        let prm = this.m_prm[0];

        let n = [ this.m_prm[0], this.m_prm[1], this.m_prm[2] ];
        let cof = [ 4, 2, 1 ];	//係数
        let trVal  = new Array(entry);	// TRUE RANGE
        let bpVal  = new Array(entry);	// BUYING PRESSURE

        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            if(wk_value[TI_UO] === CD.INDEX_NO_VALUE && pt.mClosePrice <= 0) {
                super.set(i, wk_value, this.m_data, TI_UO_MAX);
                trVal[i] = 0;
                bpVal[i] = 0;
                continue;
            }
    
            wk_value[TI_UO] = 0.0;
    
            //BUYING PRESSURE
            bpVal[i] = pt.mClosePrice - this.getTrueLow(list, i);
            //TRUE RANGE
            trVal[i] = super.getTrueRange(list, i);
            //3PARAMETERS LOOP
            let rsltOU = 0.0;
            for (let ts = 0; ts < 3; ts++) {
                //GET RAW OU
                let total_tr = 0.0;
                let total_bp = 0.0;
                if(0 < n[ts] && n[ts]-1 <= i) {
                    for (let j = i; i - n[ts] < j; j-- ) {
                        total_tr += trVal[j];
                        total_bp += bpVal[j];
                    }
                }else{
                    rsltOU = CD.INDEX_NO_VALUE;
                    break;
                }
                if(total_tr == 0.0){
                    rsltOU += 0.0;
                }else{
                    rsltOU += (cof[ts] * (total_bp / total_tr));
                }
            }
            if(rsltOU != CD.INDEX_NO_VALUE && rsltOU != 0.0) {
                wk_value[TI_UO] = rsltOU * 100.0 / (cof[0] + cof[1] + cof[2]);
            }else{
                wk_value[TI_UO] = rsltOU;
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_UO_MAX);
            }
        }
        return true;
    }
    getTrueLow(list, i) {
        let pt = list[i];
        if (i == 0) return pt.mLowPrice;
        let prev = list[i-1];
        if( prev.mClosePrice < pt.mLowPrice ){
            //前日終値
            return prev.mClosePrice;
        }
        //当日安値
        return pt.mLowPrice;
    }
}

export const TI_ATR = 0;
export const TI_ATR_MAX = 1;
//--------------------------------------------------------------------
// [ATR] AVERAGE TRUE RANGE
//--------------------------------------------------------------------
export class ChartTechATR extends ChartTech {
	constructor() {
        super(TI_ATR_MAX);
        this.m_prm_num = CTP.PRM_ATR_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_ATR_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1) {
        this.m_prm[0] = n1;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen + 1);
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_WR_MAX);
        let prm = this.m_prm[0];
        // TR(N日指数移動平均算出用)
        let tr_value = new Array(entry);

        if (bgnix != 0) {
            //UPDATEの場合は事前に値段取得
            let ready_ix = bgnix - maxPrmLen;
            if (ready_ix < 0) {
                ready_ix = 0;
            }
            for (let i = ready_ix; i < bgnix; ++i) {
                tr_value[i] = super.getTrueRange(list, i);
            }
        }

        for (let i = bgnix; i < entry; ++i) {
            let atr_value = CD.INDEX_NO_VALUE;
            tr_value[i] = super.getTrueRange(list, i);
            if(prm <= i){ //前日参照あり
                for( let j=i; i-prm<j; --j ) {
                    if(0 < list[i - prm].mClosePrice){
                        //コメントアウトを外せば指数算出となる
                        //if(tr_value[j] == 0.0){
                            //初回ATR単純移動平均
                            let ttl_tr = 0.0;
                            for(let k = i; i - prm < k; --k ){
                                ttl_tr += tr_value[k];
                            }
                            atr_value = ttl_tr / prm;
                        //}else{
                            //初回ATR指数平均
                        //	atr_value = tr_value[j] * 2 / (prm+1) + tr_value[j-1] * (prm+1-2)/(prm+1);
                        //}
                    }else{
                        break;
                    }
                }
            }
            wk_value[TI_ATR] = atr_value;

            if(target_ix <= i){
                // 指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data);
            }
        }
        return true;
    }
}

export const TI_ROC_1 = 0;
export const TI_ROC_2 = 1;
export const TI_ROC_MAX = 2;
//--------------------------------------------------------------------
// [ROC]  RATE OF CHANGE
// ROC(n)=（本日の終値－n日前の終値）／n日前の終値×100　・・・・(1)
// ROC(n)=本日の終値／n日前の終値×100　・・・・(2)
//--------------------------------------------------------------------
export class ChartTechROC extends ChartTech {
	constructor() {
        super(TI_ROC_MAX);
        this.m_prm_num = CTP.PRM_ROC_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_ROC_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter (n1, n2) {
        this.m_prm[TI_ROC_1] = n1;
        this.m_prm[TI_ROC_2] = n2;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (this.m_data[0].length <= target_ix) {
            target_ix = this.m_data[0].length - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - maxPrmLen;
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_ROC_MAX);

        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            for(let j = 0; j < this.m_prm_num; ++j ){
                let rocValue = CD.INDEX_NO_VALUE;
                let prm = this.m_prm[j];
                if(0 < prm){
                    if(0 <= i - prm){
                        //当日終値/N日前の終値×100
                        //rocValue = pt->mClosePrice / list[i-prm]->mClosePrice * 100.0;
                        //(当日終値 － n日前の終値)／ n日前の終値×100
                        let cur  = (pt.mClosePrice * TI_DEC_DIGIT) >> 0;
                        let prev = (list[i-prm].mClosePrice * TI_DEC_DIGIT) >> 0;
                        if(0 < prev){
                            // n日前の終値が存在する場合のみ
                            rocValue = (cur - prev) / prev * 100.0;
                        }
                    }
                }
                wk_value[j] = rocValue;
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data);
            }
        }
        return true;
    }
}

export const TI_SWR_A = 0;
export const TI_SWR_B = 1;
export const TI_SWR_MAX = 2;
//--------------------------------------------------------------------
// [SWR] STRENGTH AND WEAKNESS RATIO
// （注意）パラメータ1本で出力データは2
//--------------------------------------------------------------------
export class ChartTechSWR extends ChartTech {
	constructor() {
        super(TI_SWR_MAX);
        this.m_prm = 0;
        this.m_data = new Array(TI_SWR_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter (n1) {
        this.m_prm = n1;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = this.m_prm;

        // 更新インデックス有効範囲
        if (this.m_data[0].length <= target_ix) {
            target_ix = this.m_data[0].length - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - maxPrmLen;
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_SWR_MAX);

        for (let i = bgnix; i < entry; ++i) {
            wk_value[TI_SWR_A] = CD.INDEX_NO_VALUE;
            wk_value[TI_SWR_B] = CD.INDEX_NO_VALUE;
            if(this.m_prm <= i){
                let strgtotal_A = 0.0;
                let weaktotal_A = 0.0;
                let strgtotal_B = 0.0;
                let weaktotal_B = 0.0;
                for (let j = i - this.m_prm + 1; j < i + 1; ++j) {
                    let prv1 = list[j];
                    let prv2 = list[j-1];
                    if (0 < prv2.mClosePrice && 0 < prv1.mClosePrice) {
                        //Aレシオ算出
                        strgtotal_A += (prv1.mHighPrice - prv1.mOpenPrice);
                        weaktotal_A += (prv1.mOpenPrice - prv1.mLowPrice);
                        //Bレシオ算出
                        strgtotal_B += (prv1.mHighPrice - prv2.mClosePrice);
                        weaktotal_B += (prv2.mClosePrice - prv1.mLowPrice);
                    } else {
                        strgtotal_A = CD.INDEX_NO_VALUE;
                        break;
                    }
                }
                if(strgtotal_A != CD.INDEX_NO_VALUE) {
                    if(weaktotal_A == 0.0){
                        wk_value[TI_SWR_A] = 0.0;
                    }else{
                        wk_value[TI_SWR_A] = strgtotal_A / weaktotal_A * 100.0;
                    }
                    if(weaktotal_B == 0.0){
                        wk_value[TI_SWR_B] = 0.0;
                    }else{
                        wk_value[TI_SWR_B] = strgtotal_B / weaktotal_B * 100.0;
                    }
                }
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_SWR_MAX);
            }
        }
    }
}

export const TI_ARN_UP = 0;
export const TI_ARN_DN = 1;
export const TI_ARN_OSC = 2;
export const TI_ARN_MAX = 3;
//--------------------------------------------------------------------
// [ARN] AROON INDICATOR
// （注意）パラメータ1本で出力データは3
//--------------------------------------------------------------------
export class ChartTechARN extends ChartTech {
	constructor() {
        super(TI_ARN_MAX);
        this.m_prm = 0;
        this.m_data = new Array(TI_ARN_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter (n1) {
        this.m_prm = n1;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let prm = this.m_prm;
        let maxPrmLen = this.m_prm;

        // 更新インデックス有効範囲
        if (this.m_data[0].length <= target_ix) {
            target_ix = this.m_data[0].length - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - maxPrmLen;
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_ARN_MAX);

        for (let i = bgnix; i < entry; ++i) {
            wk_value[TI_ARN_UP] = CD.INDEX_NO_VALUE;
            wk_value[TI_ARN_DN] = CD.INDEX_NO_VALUE;
            wk_value[TI_ARN_OSC]= CD.INDEX_NO_VALUE;
            let high_ix = 0;
            let low_ix  = 0;
            let high = 0.0;
            let low  = 0.0;
            if (prm <= i) { //当日を除いたパラメータ期間必要
                if(0 < list[i - prm].mClosePrice){
                    let [high, high_ix, low, low_ix] = super.getHLPriceWithIX(list, i, prm + 1);
                    wk_value[TI_ARN_UP] = (prm - (i - high_ix)) * 100.0 / prm;
                    wk_value[TI_ARN_DN] = (prm - (i - low_ix)) * 100.0 / prm;
                    wk_value[TI_ARN_OSC] = wk_value[TI_ARN_UP] - wk_value[TI_ARN_DN];
                }
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_ARN_MAX);
            }
        }
    }
}
export const TI_CCI = 0;
export const TI_CCI_MAX = 1;
//--------------------------------------------------------------------
// [CCI] COMMODITY CHANNEL INDEX
//--------------------------------------------------------------------
export class ChartTechCCI extends ChartTech {
	constructor() {
        super(TI_CCI_MAX);
        this.m_prm_num = CTP.PRM_CCI_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_CCI_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1) {
        this.m_prm[0] = n1;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen + 1);
        if (bgnix < 0) bgnix = 0;

        let hlo		= new Array(entry); //HLO(N日単純移動平均算出用)
        let hlo_ha	= new Array(entry); //N日平均偏差(N日単純移動平均算出用)

        if (bgnix != 0) {
            //UPDATEの場合は事前に値段取得
            let ready_ix = bgnix - maxPrmLen;
            if (ready_ix < 0) {
                ready_ix = 0;
            }
            for (let i = ready_ix; i < bgnix; ++i) {
                let pt = list[i];
                hlo[i] = (pt.mHighPrice + pt.mLowPrice + pt.mClosePrice) / 3;
            }
        }

	    //算出結果一時格納用
        let wk_value = new Array(TI_CCI_MAX);

        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            wk_value[TI_CCI] = CD.INDEX_NO_VALUE;
            hlo[i] = (pt.mHighPrice + pt.mLowPrice + pt.mClosePrice) / 3;
            if(this.m_prm[0] - 1 <= i){
                let ttl_hlo = 0.0;
                for(let j = i; i - this.m_prm[0] < j; --j ){
                    if(0 < list[j].mClosePrice){
                        ttl_hlo += hlo[j];
                    }else{
                        ttl_hlo = CD.INDEX_NO_VALUE;
                        break;
                    }
                }
                if(ttl_hlo !== CD.INDEX_NO_VALUE){
                    let hlo_sma = ttl_hlo / this.m_prm[0];	//HLO単純移動平均
                    //-------------------------------------------------------------
                    // SBI(一般)方式
                    //-------------------------------------------------------------
                    //N日平均偏差 = (HLO - HLOのN日単純移動平均)の絶対値のN日単純移動平均
                    hlo_ha[i] = Math.abs(hlo[i] - hlo_sma);
                    let ttl_ha = 0.0;
                    for(let j = i; i - this.m_prm[0] < j; --j ){
                        if(hlo_ha[j] != CD.INDEX_NO_VALUE){
                            ttl_ha += hlo_ha[j];
                        }else{
                            ttl_ha = CD.INDEX_NO_VALUE;
                            break;
                        }
                    }
                    if(ttl_ha != CD.INDEX_NO_VALUE){
                        let ha_sma = ttl_ha / this.m_prm[0];		//平均偏差
                        //CCI = (HLO - HLOのN日単純移動平均) ÷ N日平均偏差 ÷ 0.015
                        if(ha_sma == 0.0){
                            wk_value[TI_CCI] = 0.0;
                        }else{
                            wk_value[TI_CCI] = (hlo[i] - hlo_sma) / ha_sma / 0.015;
                        }
                    }
                    //-------------------------------------------------------------
                    // DREAM VISOR方式
                    //-------------------------------------------------------------
                    // let ttl_ha = 0.0;
                    // for(let j = i; i - this.m_prm[0] < j; --j ){
                    //     if(hlo_ha[j] != CD.INDEX_NO_VALUE){
                    //         ttl_ha += (Math.abs(hlo[j] - hlo_sma));
                    //     }else{
                    //         ttl_ha = CD.INDEX_NO_VALUE;
                    //         break;
                    //     }
                    // }
                    // if(ttl_ha !== CD.INDEX_NO_VALUE){
                    //     let ha_sma = ttl_ha / this.m_prm[0];
                    //     wk_value[TI_CCI] = (hlo[i] - hlo_sma) / (ha_sma * 0.015);
                    // }
                    //-------------------------------------------------------------
                }else{
                    hlo_ha[i] = CD.INDEX_NO_VALUE;
                }
            }
            if (target_ix <= i) {
                super.set(i, wk_value, this.m_data, TI_CCI_MAX);
            }
        }
        return true;
    }
}
export const TI_SNR  = 0;
export const TI_SNR_EMA = 1;
export const TI_SNR_MAX = 2;
//--------------------------------------------------------------------
// [SNR] SONAR
//--------------------------------------------------------------------
export class ChartTechSNR extends ChartTech {
	constructor() {
        super(TI_SNR_MAX);
        this.m_prm_num = CTP.PRM_SNR_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_SNR_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1, n2) {
        this.m_prm[CTP.PRM_SNR_EMA] = n1;
        this.m_prm[CTP.PRM_SNR_CMP] = n2;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = this.m_prm[CTP.PRM_SNR_EMA];

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;

        let prm = this.m_prm[CTP.PRM_SNR_EMA] ;
        let prm_cmp = this.m_prm[CTP.PRM_SNR_CMP];

	    //算出結果一時格納用
        let wk_value = new Array(TI_SNR_MAX);

        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            let emaValue = 0.0;
            if (0 < prm_cmp && 0 < prm && prm <= i) {
                if(0 < list[(i - (prm - 1))].mClosePrice) {
                    if(this.m_data[TI_SNR_EMA][i-1] == CD.INDEX_NO_VALUE) {
                        wk_value[TI_SNR_EMA] = super.getSMA(prm, list, i);
                    }else{
                        let prev = this.m_data[TI_SNR_EMA][i-1];
                        wk_value[TI_SNR_EMA] = pt.mClosePrice * 2 / (prm+1) + prev * (prm+1-2)/(prm+1);
                    }
                    let comp_ix = i - prm_cmp;
                    if(0 <= comp_ix){
                        let nEMA = this.m_data[TI_SNR_EMA][comp_ix];
                        if(nEMA != CD.INDEX_NO_VALUE){
                            // SBI方式
                            //wk_value[TI_SNR] = wk_value[TI_SNR_EMA] - nEMA;
                            // 立花リッチ(パーセンテージで表現)
                            wk_value[TI_SNR] = ((wk_value[TI_SNR_EMA] - nEMA) * 10000) / nEMA;
                        }else{
                            wk_value[TI_SNR] = CD.INDEX_NO_VALUE;
                        }
                    }else{
                        wk_value[TI_SNR] = CD.INDEX_NO_VALUE;
                    }
                }else{
                    wk_value[TI_SNR] = wk_value[TI_SNR_EMA] = CD.INDEX_NO_VALUE;
                }
            }else{
                wk_value[TI_SNR] = wk_value[TI_SNR_EMA] = CD.INDEX_NO_VALUE;
            }
            if (target_ix <= i) {
                super.set(i, wk_value, this.m_data, TI_SNR_MAX);
            }
        }
        return true;
    }
}

export const TI_DPO = 0;
export const TI_DPO_SMA = 1;
export const TI_DPO_MAX = 2;
//--------------------------------------------------------------------
// [DPO] DETRENDED PRICE OSCILLATOR
//--------------------------------------------------------------------
export class ChartTechDPO extends ChartTech {
	constructor() {
        super(TI_DPO_MAX);
        this.m_prm_num = CTP.PRM_DPO_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_DPO_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1) {
        this.m_prm[0] = n1;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }
        
        // 比較対象遡及本数
        let prm = this.m_prm[0];
        let cmpNum = ((prm / 2) >> 0) + 1;	// 比較対象遡及本数

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;

	    //算出結果一時格納用
        let wk_value = new Array(TI_DPO_MAX);
         let	total = 0.0;

        for (let i = bgnix; i < entry; ++i) {
            if(prm <= 0){
                wk_value[TI_DPO] = wk_value[TI_DPO_SMA] = CD.INDEX_NO_VALUE;
                super.set(i, wk_value, this.m_data, TI_DPO_MAX);
                continue;
            }
    
            // 初回の場合は事前エントリ取得
            if(i == bgnix){
                let bgn = bgnix - (prm - 1);
                if (bgn < 0) bgn = 0;
                for (let j = bgn; j < bgnix; j++) {
                    total += list[j].mClosePrice;
                }
            }

            if (prm - 1 <= i) {
                total += list[i].mClosePrice;
                if (0 < list[i - (prm - 1)].mClosePrice) {
                    wk_value[TI_DPO_SMA] = total / prm;
                    let cmpix = i - cmpNum;
                    if (0 <= cmpix) {
                        let cmpval = this.m_data[TI_DPO_SMA][cmpix];
                        if (cmpval != CD.INDEX_NO_VALUE) {
                            wk_value[TI_DPO] = list[i].mClosePrice - cmpval;
                        } else {
                            wk_value[TI_DPO] = CD.INDEX_NO_VALUE;
                        }
                    } else {
                        wk_value[TI_DPO] = CD.INDEX_NO_VALUE;
                    }
                } else {
                    // 上場日に初値が付かない場合は'終値 = 0'エントリが存在するため算出対象外の考慮
                    wk_value[TI_DPO] = wk_value[TI_DPO_SMA] = CD.INDEX_NO_VALUE;
                }
                total -= list[i - (prm - 1)].mClosePrice;
            } else {
                // 加算のみ
                wk_value[TI_DPO] = wk_value[TI_DPO_SMA] = CD.INDEX_NO_VALUE;
                total += list[i].mClosePrice;
            }

            if (target_ix <= i) {
                //指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data, TI_DPO_MAX);
            }
        }
        return true;
    }
}

export const TI_SD = 0;
export const TI_SD_MAX = 1;
//--------------------------------------------------------------------
// [SD] STANDARD DEVIATION
//--------------------------------------------------------------------
export class ChartTechSD extends ChartTech {
	constructor() {
        super(TI_SD_MAX);
        this.m_prm_num = CTP.PRM_SD_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_SD_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1) {
        this.m_prm[0] = n1;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_SD_MAX);
        let sma = new Array(TI_SD_MAX);
        let total = new Array(TI_SD_MAX);

        for (let i = bgnix; i < entry; ++i) {
            for (let prm_i = 0; prm_i < TI_SD_MAX; prm_i++) {

                let prm = this.m_prm[prm_i];
                if(prm <= 0){
                    wk_value[TI_SD]  = CD.INDEX_NO_VALUE;
                    continue;
                }
    
                // 初回の場合は事前エントリ取得
                if(i == bgnix){
                    total[prm_i] = 0;
                    let bgn = bgnix - (prm - 1);
                    if(bgn < 0) bgn = 0;
                    for (let j = bgn; j < bgnix; j++) {
                        total[prm_i] += list[j].mClosePrice;
                    }
                }
                
                if(prm - 1 <= i){
                    total[prm_i] += list[i].mClosePrice;
                    if (0 < list[i - (prm - 1)].mClosePrice) {
                        // 単純移動平均
                        sma[prm_i] = total[prm_i] / prm;
                        let wk_ttl = 0.0;
                        for(let j = i; i - prm < j; --j ){
                            wk_ttl += Math.pow(list[j].mClosePrice - sma[prm_i], 2.0);
                        }
                        // 標準偏差算出(標本標準偏差を採用(SBI同様))
                        if(target_ix <= i){
                            wk_value[TI_SD] = Math.sqrt(wk_ttl / prm);	//標準偏差
                        }
                    }else{
                        // 上場日に初値が付かない場合
                        wk_value[TI_SD]  = CD.INDEX_NO_VALUE;
                    }
                    total[prm_i] -= list[i - (prm - 1)].mClosePrice;
                }else{
                    // 加算のみ
                    wk_value[TI_SD] = CD.INDEX_NO_VALUE;
                    total[prm_i] += list[i].mClosePrice;
                }
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_SD_MAX);
            }
        }
        return true;
    }
}

export const TI_SDV = 0;
export const TI_SDV_MAX = 1;
//--------------------------------------------------------------------
// [SDV] STANDARD DEVIATION VOLATILITY
//--------------------------------------------------------------------
export class ChartTechSDV extends ChartTech {
	constructor() {
        super(TI_SDV_MAX);
        this.m_prm_num = CTP.PRM_SDV_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_SDV_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1) {
        this.m_prm[0] = n1;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_SDV_MAX);
        let sma = new Array(TI_SDV_MAX);
        let total = new Array(TI_SDV_MAX);

        for (let i = bgnix; i < entry; ++i) {
            for (let prm_i = 0; prm_i < TI_SDV_MAX; prm_i++) {

                let prm = this.m_prm[prm_i];
                if(prm <= 0){
                    wk_value[TI_SD]  = CD.INDEX_NO_VALUE;
                    continue;
                }
    
                // 初回の場合は事前エントリ取得
                if(i === bgnix){
                    total[prm_i] = 0;
                    let bgn = bgnix - (prm - 1);
                    if(bgn < 0) bgn = 0;
                    for (let j = bgn; j < bgnix; j++) {
                        total[prm_i] += list[j].mClosePrice;
                    }
                }
                
                if(prm - 1 <= i){
                    total[prm_i] += list[i].mClosePrice;
                    if (0 < list[i - (prm - 1)].mClosePrice) {
                        // 単純移動平均
                        sma[prm_i] = total[prm_i] / prm;
                        let wk_ttl = 0.0;
                        for(let j = i; i - prm < j; --j ){
                            wk_ttl += Math.pow(list[j].mClosePrice - sma[prm_i], 2.0);
                        }
                        // 標準偏差算出
                        //let deviation = Math.sqrt(wk_ttl / prm);
                        let deviation = Math.sqrt(wk_ttl / (prm - 1));
                        if(target_ix <= i){
                            wk_value[TI_SDV] = deviation * 100.0 / sma[prm_i];
                        }
                    }else{
                        // 上場日に初値が付かない場合
                        wk_value[TI_SD]  = CD.INDEX_NO_VALUE;
                    }
                    total[prm_i] -= list[i - (prm - 1)].mClosePrice;
                }else{
                    // 加算のみ
                    wk_value[TI_SDV] = CD.INDEX_NO_VALUE;
                    total[prm_i] += list[i].mClosePrice;
                }
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_SDV_MAX);
            }
        }
        return true;
    }
}

export const TI_HV = 0;
export const TI_HV_MAX = 1;
export const TI_DATA_YEAR = -1
export const TI_DATA_MONTH = 0
export const TI_DATA_WEEK = 1
export const TI_DATA_DAY = 2
export const TI_DATA_MIN = 3

//--------------------------------------------------------------------
// [HV] HISTRICAL VOLATILITY
//--------------------------------------------------------------------
export class ChartTechHV extends ChartTech {
	constructor() {
        super(TI_HV_MAX);
        this.m_prm_num = CTP.PRM_HV_MAX;
        this.m_prm_assumption = 0;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_HV_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1, n2) {
        this.m_prm[0] = n1;

        switch(n2) {
            case TI_DATA_DAY:
                this.m_prm_assumption = 250.0; //年間の営業日数(250が慣例)
                break;
            case TI_DATA_WEEK:
                this.m_prm_assumption = 52.0;
                break;
            case TI_DATA_MONTH:
                this.m_prm_assumption = 12.0;
                break;
            case TI_DATA_MIN:
                this.m_prm_assumption = 1.0;
                break;
            case TI_DATA_YEAR:   //未調査
            default:
                this.m_prm_assumption = 0;
                break;
        }

    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - maxPrmLen;
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_HV_MAX);
        let log_value = new Array(entry);
        let prm = this.m_prm[0];

        if(bgnix === 0){
            wk_value[TI_HV] = CD.INDEX_NO_VALUE;
            super.set(0, wk_value, this.m_data, TI_HV_MAX);
            bgnix = 1;
        }
        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            wk_value[TI_HV] = CD.INDEX_NO_VALUE;
            log_value[i] = CD.INDEX_NO_VALUE;
            let prev_price = list[i-1].mClosePrice;
            if (0 < prev_price) {
                log_value[i] = Math.log(pt.mClosePrice / prev_price) * 100;
                if (prm - 1 < i) {
                    let sum = 0.0;
                    let sumsq = 0.0;
                    let sta_ix = i - prm + 1;
                    let end_ix = i + 1;
                    for (let j = sta_ix; j < end_ix; j++) {
                        if(log_value[j] === CD.INDEX_NO_VALUE){
                            // 値段無し検出
                            sum = CD.INDEX_NO_VALUE;
                            break;
                        }
                        sum += log_value[j];
                        sumsq += Math.pow(log_value[j], 2);
                    }
                    if(sum !== CD.INDEX_NO_VALUE){
                        let squ = sumsq - (Math.pow(sum, 2) / prm);
                        wk_value[TI_HV] = Math.sqrt(squ / (prm - 1)) * Math.sqrt(this.m_prm_assumption);
                    }
                }
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_HV_MAX);
            }
        }
        return true;
    }
}

export const TI_VRA_1 = 0;
export const TI_VRA_2 = 1;
export const TI_VRA_MAX = 2;
//--------------------------------------------------------------------
// [VRA] VOLUME RATIO TypeA
// VOR =(上昇日の出来高の合計+前日比変わらずの出来高合計×1/2)／出来高の合計×100
// 楽天の出来高と野村で異なる
//--------------------------------------------------------------------
export class ChartTechVRA extends ChartTech {
	constructor() {
        super(TI_VRA_MAX);
        this.m_prm_num = CTP.PRM_VRA_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_VRA_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter (n1, n2) {
        this.m_prm[0] = n1;
        this.m_prm[1] = n2;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 更新インデックス有効範囲
        if (this.m_data[0].length <= target_ix) {
            target_ix = this.m_data[0].length - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix;
        if(bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
	    let wk_value = new Array(TI_VRA_MAX);

        for (let i = bgnix; i < entry; ++i) {
            for (let j = 0; j < this.m_prm_num; ++j ) {
                let vrValue = CD.INDEX_NO_VALUE;
                let prm = this.m_prm[j];
                if (0 < prm && prm <= i) {
                    if(0 < list[i - 1].mClosePrice){
                        let all   = 0.0;
                        let up    = 0.0;
                        let flat  = 0.0;
                        for (let k = i; i - prm < k; --k) {
                            let prev1 = list[k];
                            let prev2 = list[k-1];
                            all += prev1.mVolume;
                            if (prev2.mClosePrice < prev1.mClosePrice) {
                                up += prev1.mVolume;
                            } else if (prev2.mClosePrice == prev1.mClosePrice) {
                                flat += prev1.mVolume;
                            }
                        }
                        if(all === 0.0){
                            vrValue = 0.0;
                        }else{
                            vrValue = (up + (flat / 2)) * 100 / all;
                        }
                    }
                }
                wk_value[j] = vrValue;
            }
            if (target_ix <= i) {
                super.set(i, wk_value, this.m_data, TI_VRA_MAX);
            }
        }
        return true;
    }
}

export const TI_VRB_1 = 0;
export const TI_VRB_2 = 1;
export const TI_VRB_MAX = 2;
//--------------------------------------------------------------------
// [VRB] VOLUME RATIO TypeB
// VOR =(上昇日の出来高の合計+前日比変わらずの出来高の合計×1/2)
//               ／(下落日の出来高の合計+前日比変わらずの出来高の合計×1/2)×100
// DREAMで検証
//--------------------------------------------------------------------
export class ChartTechVRB extends ChartTech {
	constructor() {
        super(TI_VRB_MAX);
        this.m_prm_num = CTP.PRM_VRB_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_VRB_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter (n1, n2) {
        this.m_prm[0] = n1;
        this.m_prm[1] = n2;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 更新インデックス有効範囲
        if (this.m_data[0].length <= target_ix) {
            target_ix = this.m_data[0].length - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix;
        if(bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
	    let wk_value = new Array(TI_VRA_MAX);

        for (let i = bgnix; i < entry; ++i) {
            for (let j = 0; j < this.m_prm_num; ++j ) {
                let vrValue = CD.INDEX_NO_VALUE;
                let prm = this.m_prm[j];
                if (0 < prm && prm <= i) {
                    if (0 < list[i - 1].mClosePrice) {
                        let all   = 0.0;
                        let up    = 0.0;
                        let down  = 0.0;
                        let flat  = 0.0;
                        for (let k = i; i - prm < k; --k) {
                            let prev1 = list[k];
                            let prev2 = list[k-1];
                            all += prev1.mVolume;
                            if (prev2.mClosePrice < prev1.mClosePrice) {
                                up += prev1.mVolume;
                            } else if (prev1.mClosePrice < prev2.mClosePrice) {
                                down += prev1.mVolume;
                            } else {
                                flat += prev1.mVolume;
                            }
                        }
                        if(down + (flat/2) === 0){
                            vrValue = 0.0;
                        }else{
                            vrValue = (up + (flat/2)) * 100 / (down + (flat/2));
                        }
                    }
                }
                wk_value[j] = vrValue;
            }
            if (target_ix <= i) {
                super.set(i, wk_value, this.m_data, TI_VRA_MAX);
            }
        }
        return true;
    }
}

export const TI_DMI_PDI = 0;	// DMI(+DI)
export const TI_DMI_MDI = 1;	// DMI(-DI)
export const TI_DMI_ADX = 2;	// DMI(ADX)
export const TI_DMI_ADXR = 3;	// DMI(ADXR)
export const TI_DMI_SUB = 4;	// DMI(PDI-MDI)
export const TI_DMI_MAX = 5;
//--------------------------------------------------------------------
// [DMI]  DIRECTIONAL MOVEMENT INDEX
//--------------------------------------------------------------------
export class ChartTechDMI extends ChartTech {
    constructor() {
        super(TI_DMI_MAX);
        this.m_prm_num = CTP.PRM_DMI_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_DMI_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1, n2, n3) {
        this.m_prm[CTP.PRM_DMI] = super.chkNumParam(n1);
        this.m_prm[CTP.PRM_ADX] = super.chkNumParam(n2);
        this.m_prm[CTP.PRM_ADXR] = super.chkNumParam(n3);
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 遡及本数取得
        let maxPrmLen = this.m_prm[CTP.PRM_DMI] + this.m_prm[CTP.PRM_ADX] + this.m_prm[CTP.PRM_ADXR];

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_DMI_MAX);
        let pdmVal = new Array(entry);	// 当日の高値-前日の高値
        let mdmVal = new Array(entry);	// 前日の安値-当日の安値
        let trVal  = new Array(entry);  // TRUE RANGE
        let dxVal  = new Array(entry);  // DIRECTIONAL INDEX

        if (bgnix != 0) {
            //UPDATEの場合は必要となる値を事前算出
            let ready_ix = bgnix - maxPrmLen;
            if (ready_ix < 0) {
                ready_ix = 0;
            }
            for (let i = ready_ix; i < bgnix; ++i) {
                //PDM 取得
                let pdm = this.getPDM(list, i) >> 0;
                //MDM 取得
                let mdm = this.getMDM(list, i) >> 0;
                //PDM & MDM 有効値取得
                let valuePdmMdm = this.setPDMAndMDM(pdm, mdm);
                pdm = valuePdmMdm[0];
                mdm = valuePdmMdm[1];
                //PDM & MDM 期間算出用退避
                pdmVal[i] = pdm;
                mdmVal[i] = mdm;
                //TRUE RANGE 取得
                trVal[i] = super.getTrueRange(list, i) >> 0;
            }
        }

        for (let i = bgnix; i < entry; ++i) {
            wk_value[TI_DMI_PDI]  = CD.INDEX_NO_VALUE;
            wk_value[TI_DMI_MDI]  = CD.INDEX_NO_VALUE;
            wk_value[TI_DMI_ADX]  = 0.0;
            wk_value[TI_DMI_ADXR] = 0.0;
            wk_value[TI_DMI_SUB]  = CD.INDEX_NO_VALUE;
            if(i === 0){
                pdmVal[i] = 0;
                mdmVal[i] = 0;
                trVal[i]  = 0;
                dxVal[i] = CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_PDI] = CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_MDI] = CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_ADX] = CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_ADXR]= CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_SUB] = CD.INDEX_NO_VALUE;
                super.set(i, wk_value, this.m_data, TI_DMI_MAX);
                continue;
            }
            if(list[i - 1].mClosePrice <= 0){
                pdmVal[i] = 0;
                mdmVal[i] = 0;
                trVal[i]  = 0;
                dxVal[i] = CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_PDI] = CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_MDI] = CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_ADX] = CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_ADXR]= CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_SUB] = CD.INDEX_NO_VALUE;
                super.set(i, wk_value, this.m_data, TI_DMI_MAX);
                continue;
            }
            //PDM 取得
            let pdm = this.getPDM(list, i) >> 0;
            //MDM 取得
            let mdm = this.getMDM(list, i) >> 0;
            //PDM & MDM 有効値取得
            let valuePdmMdm = this.setPDMAndMDM(pdm, mdm);
            pdm = valuePdmMdm[0];
            mdm = valuePdmMdm[1];
            //PDM & MDM 期間算出用退避
            pdmVal[i] = pdm;
            mdmVal[i] = mdm;
            //TRUE RANGE 取得
            trVal[i] = super.getTrueRange(list, i) >> 0;
    
            //**** PDI && MDI && DX 算出 ***************
            if(this.m_prm[CTP.PRM_DMI] - 1 <= i){
                wk_value[TI_DMI_PDI] = 0.0;
                wk_value[TI_DMI_MDI] = 0.0;
                let pdi = this.getTotal(this.m_prm[CTP.PRM_DMI], pdmVal, i);
                let mdi = this.getTotal(this.m_prm[CTP.PRM_DMI], mdmVal, i);
                let ttr = this.getTotal(this.m_prm[CTP.PRM_DMI], trVal, i);
                if(pdi !== 0.0 && ttr !== 0.0){
                    wk_value[TI_DMI_PDI] = pdi / ttr * 100.0;
                }
                if(mdi !== 0.0 && ttr !== 0.0){
                    wk_value[TI_DMI_MDI] = mdi / ttr * 100.0;
                }
                if(wk_value[TI_DMI_PDI] + wk_value[TI_DMI_MDI] === 0.0){
                    dxVal[i] = 0.0;
                }else{
                    dxVal[i] = (Math.abs(wk_value[TI_DMI_PDI] - wk_value[TI_DMI_MDI])) / (wk_value[TI_DMI_PDI] + wk_value[TI_DMI_MDI]) * 100.0;
                }
            }else{
                wk_value[TI_DMI_PDI] = CD.INDEX_NO_VALUE;
                wk_value[TI_DMI_MDI] = CD.INDEX_NO_VALUE;
                dxVal[i] = CD.INDEX_NO_VALUE;
            }
            //**** ADX 算出 ***************
            wk_value[TI_DMI_ADX] = CD.INDEX_NO_VALUE;
            if (0 < this.m_prm[CTP.PRM_ADX] && this.m_prm[CTP.PRM_DMI] + this.m_prm[CTP.PRM_ADX] - 1 <= i) {
                let total_dx = 0.0;
                for (let j = i; i - this.m_prm[CTP.PRM_ADX] < j; --j) {
                    if (dxVal[i] !== CD.INDEX_NO_VALUE) {
                        total_dx += dxVal[j];
                    } else {
                        total_dx = CD.INDEX_NO_VALUE;
                        break;
                    }
                }
                if (total_dx !== CD.INDEX_NO_VALUE) {
                    wk_value[TI_DMI_ADX] = total_dx / this.m_prm[CTP.PRM_ADX];
                }
            }
            //**** ADXR 算出 ***************
            wk_value[TI_DMI_ADXR] = CD.INDEX_NO_VALUE;
            if (0 < this.m_prm[CTP.PRM_ADXR] && this.m_prm[CTP.PRM_ADX] + this.m_prm[CTP.PRM_ADXR] - 1 <= i) {
                if (wk_value[TI_DMI_ADX] !== CD.INDEX_NO_VALUE) {
                    wk_value[TI_DMI_ADXR] = this.getADXRForNormal(this.m_prm[CTP.PRM_ADXR], list, i, wk_value[TI_DMI_ADX]);
                    //wk_value[TI_DMI_ADXR] = this.getADXRForExponential(this.m_prm[CTP.PRM_ADXR], list, i, wk_value[TI_DMI_ADX]);
                    //wk_value[TI_DMI_ADXR] = this.getADXRForSimple(this.m_prm[CTP.PRM_ADXR], list, i, wk_value[TI_DMI_ADX]);
                }
            }
            if (target_ix <= i) {
                wk_value[TI_DMI_SUB] = 0.0;
                if (wk_value[TI_DMI_PDI] !== CD.INDEX_NO_VALUE && wk_value[TI_DMI_MDI] !== CD.INDEX_NO_VALUE) {
                    wk_value[TI_DMI_SUB] = wk_value[TI_DMI_PDI] - wk_value[TI_DMI_MDI];
                }
                super.set(i, wk_value, this.m_data, TI_DMI_MAX);
            }
        }
        return true;
    }
    getPDM(list, i) {
        if (i == 0) return 0.0;
        let pt   = list[i];
        let prev = list[i-1];
        //当日高値-前日高値
        let pdm = pt.mHighPrice - prev.mHighPrice;
        if(pdm < 0){
            return 0.0;
        }
        return pdm;
    }
    getMDM(list, i) {
        if (i == 0) return 0.0;
        let pt   = list[i];
        let prev = list[i-1];
        //前日安値-当日安値
        let mdm = prev.mLowPrice - pt.mLowPrice;
        if(mdm < 0){
            return 0.0;
        }
        return mdm;
    }
    setPDMAndMDM(pdm, mdm) {
        let r_pdm = pdm, r_mdm = mdm;
        if(r_pdm === r_mdm){
            r_pdm = 0;
            r_mdm = 0;
        }else{
            if(r_pdm < r_mdm) r_pdm = 0;
            if(r_mdm < r_pdm) r_mdm = 0;
        }
        return [r_pdm, r_mdm]
    }
    getTotal(prm, index_array, ix) {
        let pdi = 0.0;
        for(let i = ix; ix - prm < i; --i ){
            pdi += index_array[i];
        }
        return pdi;
    }
    //==============================================================================
    // ADXR N日前参照方式(QUICK採用)
    //==============================================================================
    getADXRForNormal(prm, list, ix, value) {
        let prev = ix - prm;
        if(prev < 0){
            return CD.INDEX_NO_VALUE;
        }
        let prev_value = this.m_data[TI_DMI_ADX][prev];
        if(prev_value === CD.INDEX_NO_VALUE){
            return CD.INDEX_NO_VALUE;
        }
        let adxr = (prev_value + value) / 2;
        return adxr;
    }
    //==============================================================================
    // ADXR 単純平均方式
    //==============================================================================
    getADXRForSimple(prm, list, ix, value) {
        if (prm === 1) {
            return value;
        }
        let prev = ix - (prm - 1);
        if (prev < 0) {
            return CD.INDEX_NO_VALUE;
        }
        let prev_value = this.m_data[TI_DMI_ADX][prev];
        if (prev_value === CD.INDEX_NO_VALUE) {
            return CD.INDEX_NO_VALUE;
        }
        let total = prev_value;
        total += value;
        for (let i = prev + 1; i < ix; i++) {
            total += this.m_data[TI_DMI_ADX][i];
        }
        let smaValue = total / prm;
        return smaValue;
    }
    //==============================================================================
    // ADXR 指数平均方式
    //==============================================================================
    getADXRForExponential(prm, list, i, value)
    {
        if (i === 0) return 0.0;
        let prev_value = this.m_data[TI_DMI_ADXR][i-1];
        let emaValue = 0.0;
        if(prm-1 <= i){
            if(prev_value === 0.0){
                emaValue = this.getADXRForSimple(prm, list, i, value);
            }else{
                emaValue = value * 2 / (prm + 1) + prev_value * (prm + 1 - 2) / (prm + 1);
            }
        }else{
            emaValue = 0;
        }
        return emaValue;
    }
}

export const TI_OBV = 0;
export const TI_OBV_MAX = 1;
//--------------------------------------------------------------------
// [OBV] ON BALANCE VOLUME
//--------------------------------------------------------------------
export class ChartTechOBV extends ChartTech {
	constructor() {
        super(TI_OBV_MAX);
        this.m_data = new Array(TI_OBV_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 開始インデックス算出
        let bgnix = target_ix;
        if(bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
	    let wk_value = new Array(TI_OBV_MAX);
        wk_value[TI_OBV] = 0;
        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            if(pt.mOpenPrice < pt.mClosePrice){
                wk_value[TI_OBV] += pt.mVolume;
            }else if(pt.mClosePrice < pt.mOpenPrice){
                wk_value[TI_OBV] -= pt.mVolume;
            }else{
                //変化なし
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_OBV_MAX);
            }
        }
        return true;
    }
}
export const TI_RTA = 0;
export const TI_RTA_MAX = 1;
//--------------------------------------------------------------------
// [RTA] RATOCATOR(基準日変動)
//--------------------------------------------------------------------
export class ChartTechRTA extends ChartTech {
	constructor() {
        super(TI_RTA_MAX);
        this.m_prm_num = CTP.PRM_RTA_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_RTA_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setParameter(n1, n2, n3) {
        this.m_prm[CTP.PRM_RTA] = super.chkNumParam(n1);
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix;
        if(bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
	    let wk_value = new Array(TI_RTA_MAX);
        wk_value[TI_RTA] = 0;

        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            wk_value[TI_RTA] = CD.INDEX_NO_VALUE;
            if(this.m_prm <= i){
                let prv = list[i - this.m_prm];
                if (0 < pt.mRatioPrice && 0 < prv.mRatioPrice){
                    // A＝株価（当日）÷ 日経平均株価（当日）
                    let valueA = 0;
                    if(0.0 < pt.mRatioPrice){
                        valueA = pt.mClosePrice / pt.mRatioPrice;
                    }
                    // B＝株価（N日）÷ 日経平均株価（N日）
                    let valueB = 0;
                    if(0.0 < pt.mRatioPrice){
                        valueB = prv.mClosePrice / prv.mRatioPrice;
                    }
                    // レシオケータ（%）＝ A / B × 100
                    if(valueB === 0){
                        wk_value[TI_RTA] = 0;
                    }else{
                        wk_value[TI_RTA] = valueA * 100.0 / valueB;
                    }
                }
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_RTA_MAX);
            }
        }
        return true;
    }
}
export const TI_MGN_1 = 0;
export const TI_MGN_2 = 1;
export const TI_MGN_MAX = 2;
//--------------------------------------------------------------------
// [MGN] SINYOUZAN
//--------------------------------------------------------------------
export class ChartTechMGN extends ChartTech {
	constructor() {
        super(TI_MGN_MAX);
        this.m_data = new Array(TI_MGN_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix;
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_MGN_MAX);

        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            wk_value[0] = pt.mSellBalance;
            wk_value[1] = pt.mBuyBalance;
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_MGN_MAX);
            }
        }
        return true;
    }
}
