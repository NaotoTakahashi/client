import {ChartPVOL} from './chartObj';
import * as CTP from './chartTechParameter';
import * as CD from './chartDef';
import * as IDX from './chartDef';

const TI_DEC_DIGIT = 10000;

export class ChartTech {
	constructor() {
        this.m_maxPrice = 0;
        this.m_minValue = 0;
    }
    clearPos() {
        this.m_curYpos.fill(0);
    }
    setPriceRange(price) {
        if(price === 0.0) return;
        if(this.m_maxPrice < price){
            this.m_maxPrice = price;
        }
        if(price < this.m_minValue){
            this.m_minValue = price;
        }
    }
    setRange(value) {
        this.setPriceRange(value);
        return value;
    }
    set(ix, valueArry, dataArry, size = 0) { // dataArry = 1次
        let targetLength = size;
        if(targetLength === 0) {
            targetLength = valueArry.length;
        }
        if (ix < dataArry[0].length) {
            // 既存エントリ更新
            for (let i = 0; i < targetLength; i++) {
                dataArry[i][ix] = valueArry[i];
                this.setPriceRange(valueArry[i]);
            }
            return ix;
        } else {
            // 新規追加
            for (let i = 0; i < targetLength; i++) {
                dataArry[i].push(valueArry[i]);
                this.setPriceRange(valueArry[i]);
            }
            return dataArry[0].length;
        }
    }
    getSMA (list, ix, prm, decDegit = 1) {
        let retVal = 0.0;
        let entry = list.length;
        if (ix < 0 || entry <= ix) return retVal;
        if (0 < prm && prm - 1 <= ix) {
            let total = 0;
            for (let i = ix; ix - prm < i; i--) {
                total += list[i].mClosePrice * decDegit;
            }
            retVal = total / prm;
            retVal = retVal / decDegit;
        }
        return retVal;
    }
    chkNumParam(val) {
        if (typeof val === 'number' && 0 < val) {
            return val;
        }
        return 0;
    }
    //==============================================================================
    // [共通]  高安取得(終値ベース)
    //==============================================================================
    getHLClose(list, ix, prm) {
        //指定インデックスを含めた高安を取得する
        let high = 0.0, low = 0.0;
        let pt = list[ix];
        low = pt.mClosePrice;
        let sta = ix - (prm - 1);
        for (let i = sta; i <= ix; ++i) {
            pt = list[i];
            if (high < pt.mClosePrice) {
                high = pt.mClosePrice;
            }
            if (pt.mClosePrice < low) {
                low = pt.mClosePrice;
            }
        }

        return [high, low];
    }
    //==============================================================================
    // [共通]  高安取得(4本値ベース)
    //==============================================================================
    getHLPrice(list, ix, prm) {
        //指定インデックスを含めた高安を取得する
        let high = 0.0, low = 0.0;
        let pt = list[ix];
        low = pt.mLowPrice;
        let sta = ix - (prm - 1);
        for (let i = sta; i <= ix; ++i) {
            pt = list[i];
            if (high < pt.mHighPrice) {
                high = pt.mHighPrice;
            }
            if (pt.mLowPrice < low) {
                low = pt.mLowPrice;
            }
        }

        return [high, low];
    }
    //==============================================================================
    // [共通]  高安取得(高安を付けたインデックスも取得)
    //==============================================================================
    getHLPriceWithIX(list, ix, prm) {
        //指定インデックスを含めた高安を取得する
        let high = 0.0, low = 0.0;
        let high_ix = 0.0, low_ix = 0.0;
        let pt = list[ix];
        low = pt.mLowPrice;
        let sta = ix - (prm-1);
        for (let i = sta; i <= ix; ++i) {
            pt = list[i];
            if(high <= pt.mHighPrice){
                high = pt.mHighPrice;
                high_ix = i;
            }
            if(pt.mLowPrice <= low){
                low = pt.mLowPrice;
                low_ix = i;
            }
        }

        return [high, high_ix, low, low_ix];
    }
    //==============================================================================
    // [共通]  TRUE RANGE 取得
    //==============================================================================
    getTrueRange(list, i) {
        if(i == 0) return 0.0;
        let pt = list[i];
        let prev = list[i-1];
        // 当日高値-当日安値
        let tr1 = Math.abs(pt.mHighPrice - pt.mLowPrice);
        // 当日高値-前日終値
        let tr2 = Math.abs(pt.mHighPrice - prev.mClosePrice);
        // 前日終値-当日安値
        let tr3 = Math.abs(prev.mClosePrice - pt.mLowPrice);

        if(tr2 <= tr1 && tr3 <= tr1){
            return tr1;
        }else if(tr1 <= tr2 && tr3 <= tr2){
            return tr2;
        }
        return tr3;
    }
}
//--------------------------------------------------------------------
// SMA (SMA1 = [0] SMA2 = [1] SMA3 = [2])
//--------------------------------------------------------------------
export const TI_SMA_MAX  = 3;
export class ChartTechSMA extends ChartTech {
	constructor() {
        super();
        this.m_size = CTP.PRM_SMA_MAX;
        this.m_prm = new Array(this.m_size);
        this.m_prm.fill(0);
        this.m_data = new Array(this.m_size);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter(n1, n2, n3) {
        this.m_prm[0] = super.chkNumParam(n1);
        this.m_prm[1] = super.chkNumParam(n2);
        this.m_prm[2] = super.chkNumParam(n3);
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        let wk_value	= new Array(this.m_size);
        wk_value.fill(0);
        let total		= new Array(this.m_size);
        total.fill(0);

        // パラメータ最大長本数取得
        let maxPrm = 0;
        for (let i = 0; i < this.m_size; i++) {
            if (maxPrm < this.m_prm[i]) {
                maxPrm = this.m_prm[i];
            }
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrm - 1);
        if (bgnix < 0) {
            bgnix = 0;
        }
        for (let i = bgnix; i < entry; i++) {
            for (let prm_i = 0; prm_i < this.m_size; prm_i++) {
                let prm = this.m_prm[prm_i];
                if(prm <= 0){
                    this.wk_value[prm_i] = CD.INDEX_NO_VALUE;
                    super.set(i, wk_value, this.m_data);
                    continue;
                }
    
                // 初回の場合は事前エントリ取得
                if (i === bgnix) {
                    total[prm_i] = 0;
                    let bgn = bgnix - (prm - 1);
                    if(bgn < 0) bgn = 0;
                    for(let j = bgn; j < bgnix; j++){
                        total[prm_i] += list[j].mClosePrice;
                    }
                }

                if (prm - 1 <= i) {
                    total[prm_i] += list[i].mClosePrice;
                    if (0 < list[i - (prm - 1)].mClosePrice){
                        wk_value[prm_i] = total[prm_i] / prm;
                    }else{
                        // 上場日に初値が付かない場合は'終値 = 0'エントリが存在するため算出対象外の考慮
                        wk_value[prm_i] = IDX.INDEX_NO_VALUE;
                    }
                    total[prm_i] -= list[i - (prm - 1)].mClosePrice;
                }else{
                    // 加算のみ
                    wk_value[prm_i] = IDX.INDEX_NO_VALUE;
                    total[prm_i] += list[i].mClosePrice;
                }
            }
            if (target_ix <= i) {
                // 指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data);
            }
        }
        wk_value = [];
        total = [];
        return;
    }
}
//--------------------------------------------------------------------
// SMMA (SMA1 = [開始期間] SMA2 = [間隔] SMA3 = [全本数])
//--------------------------------------------------------------------
export const TI_SMMA_MAX  = 10;
export class ChartTechSMMA extends ChartTechSMA {
	constructor() {
        super();
    }
    setParameter(n1, n2, n3) {
        const bgnN = super.chkNumParam(n1);      // 開始期間
        const gap = super.chkNumParam(n2);       // 間隔
        const tonalNum = super.chkNumParam(n3);  // 全本数
        this.m_prm = new Array(tonalNum);
        for(let i = 0; i < tonalNum; i++){
            this.m_prm[i] = bgnN + (i * gap);
        }
        this.m_size = tonalNum;
        this.m_data = new Array(tonalNum);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
}
//--------------------------------------------------------------------
// SMAV
//--------------------------------------------------------------------
export class ChartTechSMAV extends ChartTech {
	constructor() {
        super();
        this.m_size = CTP.PRM_SMA_MAX;
        this.m_prm = new Array(this.m_size);
        this.m_prm.fill(0);
        this.m_data = new Array(this.m_size);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (n1, n2, n3 = 0) {
        this.m_prm[0] = super.chkNumParam(n1);
        this.m_prm[1] = super.chkNumParam(n2);
        this.m_prm[2] = super.chkNumParam(n3);
        if(this.m_prm[2] === 0) {
            this.m_size = 2;
        }
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;
        if (this.m_size === 0) return;

        let wk_value	= new Array(this.m_size);
        wk_value.fill(0);
        let total		= new Array(this.m_size);
        total.fill(0);

        // パラメータ最大長本数取得
        let maxPrm = 0;
        for (let i = 0; i < this.m_size; i++) {
            if (maxPrm < this.m_prm[i]) {
                maxPrm = this.m_prm[i];
            }
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrm - 1);
        if (bgnix < 0) {
            bgnix = 0;
        }
        for (let i = bgnix; i < entry; i++) {
            for (let prm_i = 0; prm_i < this.m_size; prm_i++) {
                let prm = this.m_prm[prm_i];
                if(prm <= 0){
                    wk_value[prm_i] = CD.INDEX_NO_VALUE;
                    super.set(i, wk_value, this.m_data);
                    continue;
                }
    
                // 初回の場合は事前エントリ取得
                if (i === bgnix) {
                    total[prm_i] = 0;
                    let bgn = bgnix - (prm - 1);
                    if(bgn < 0) bgn = 0;
                    for(let j = bgn; j < bgnix; j++){
                        total[prm_i] += list[j].mVolume;
                    }
                }

                if (prm - 1 <= i) {
                    total[prm_i] += list[i].mVolume;
                    if (0 < list[i - (prm - 1)].mVolume){
                        wk_value[prm_i] = total[prm_i] / prm;
                    }else{
                        // 上場日に初値が付かない場合は'終値 = 0'エントリが存在するため算出対象外の考慮
                        wk_value[prm_i] = IDX.INDEX_NO_VALUE;
                    }
                    total[prm_i] -= list[i - (prm - 1)].mVolume;
                }else{
                    // 加算のみ
                    wk_value[prm_i] = IDX.INDEX_NO_VALUE;
                    total[prm_i] += list[i].mVolume;
                }
            }
            if (target_ix <= i) {
                // 指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data);
            }
        }
        wk_value = [];
        total = [];
        return;
    }
}

//==============================================================================
// [EMA]  EXPONENTIAL MOVING AVERAGE
//==============================================================================
export const TI_EMA_MAX  = 3;
export class ChartTechEMA extends ChartTech {
	constructor() {
        super();
        this.m_size = CTP.PRM_EMA_MAX;
        this.m_prm = new Array(this.m_size);
        this.m_prm.fill(0);
        this.m_data = new Array(this.m_size);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (n1, n2, n3 = 0) {
        this.m_prm[0] = super.chkNumParam(n1);
        this.m_prm[1] = super.chkNumParam(n2);
        this.m_prm[2] = super.chkNumParam(n3);
        if(this.m_prm[2] === 0) {
            this.m_size = 2;
        }
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return;

        let wk_value = new Array(this.m_size);
        wk_value.fill(0);

        // パラメータ最大長本数取得
        var maxPrm = 0;
        for (var j = 0; j < this.m_size; j++) {
            if (maxPrm < this.m_prm[j]) {
                maxPrm = this.m_prm[j];
            }
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }


        //開始インデックス算出
        let bgnix = target_ix - (maxPrm - 1);
        if (bgnix < 0) bgnix = 0;

        for (let i = bgnix; i < entry; i++) {
            ///let pt = list[i];
            for (let j = 0; j < this.m_size; ++j ) { //PARAMETER LOOP
                let emaValue = 0.0;
                let prm = this.m_prm[j];
                if (0 < prm && prm <= i) {
                    if (0 < list[(i - (prm - 1))].mClosePrice) {
                        if(this.m_data[j][i-1] === IDX.INDEX_NO_VALUE){
                            wk_value[j] = super.getSMA(list, i, prm);
                        }else{
                            let prev = this.m_data[j][i-1];
                            wk_value[j] = list[i].mClosePrice * 2 / (prm+1) + prev * (prm+1-2)/(prm+1);
                        }
                    }else{
                        wk_value[j] = IDX.INDEX_NO_VALUE;
                    }
                }else{
                    wk_value[j] = IDX.INDEX_NO_VALUE;
                }
            }
            if(target_ix <= i){
                // 指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data);
            }
        }
        wk_value = [];
        return;
    }
}
//==============================================================================
// [WMA] WAIGHTED MOVING AVERAGE
//==============================================================================
export const TI_WMA_MAX  = 3;
export class ChartTechWMA extends ChartTech
{
	constructor() {
        super();
        this.m_size = CTP.PRM_WMA_MAX;
        this.m_prm = new Array(this.m_size);
        this.m_prm.fill(0);
        this.m_data = new Array(this.m_size);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (n1, n2, n3 = 0) {
        this.m_prm[0] = super.chkNumParam(n1);
        this.m_prm[1] = super.chkNumParam(n2);
        this.m_prm[2] = super.chkNumParam(n3);
        if(this.m_prm[2] === 0) {
            this.m_size = 2;
        }
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if((entry === 0) || (entry <= target_ix)) return false;

        let wk_value	= new Array(this.m_size);
        wk_value.fill(0);
        let price		= new Array(this.m_size);
        price.fill(0);

        // パラメータ最大長本数取得
        let maxPrm = 0;
        for (let i = 0; i < this.m_size; i++) {
            if (maxPrm < this.m_prm[i]) {
                maxPrm = this.m_prm[i];
            }
        }

        //更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }


        // 開始インデックス算出
        let bgnix = target_ix - (maxPrm - 1);
        if (bgnix < 0) {
            bgnix = 0;
        }
        for (let i = bgnix; i < entry; i++) {

            price[i] = list[i].mClosePrice;

            for(let j = 0; j < this.m_size; j++ ){
                let wmaValue = 0.0;
                let prm = this.m_prm[j];
                if(prm <= 0){
                    wk_value[j] = IDX.INDEX_NO_VALUE;
                    continue;
                }
                if(prm-1 <= i){
                    if(0 < list[i - (prm - 1)].mClosePrice){
                        let total = 0.0;
                        let wkprm = prm;
                        let wkprmttl = 0;
                        for(let k = i; i - prm < k; k-- ){
                            wkprmttl += wkprm;
                            total +=  (price[k] * wkprm);
                            wkprm--;
                        }
                        if(wkprmttl === 0){
                            wmaValue = 0;
                        }else{
                            wmaValue = (total / wkprmttl) >> 0;
                        }
                    }else{
                        wmaValue = IDX.INDEX_NO_VALUE;
                    }
                }else{
                    wmaValue = IDX.INDEX_NO_VALUE;
                }
                wk_value[j] = wmaValue;
            }
            if(target_ix <= i){
                // 指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data);
            }
        }
        price = [];
        wk_value = [];
        return;
    }
}
//--------------------------------------------------------------------
// EMMA (SMA1 = [開始期間] SMA2 = [間隔] SMA3 = [全本数])
//--------------------------------------------------------------------
export const TI_EMMA_MAX  = 10;
export class ChartTechEMMA extends ChartTechEMA {
	constructor() {
        super();
    }
    setParameter(n1, n2, n3) {
        const bgnN = super.chkNumParam(n1);      // 開始期間
        const gap = super.chkNumParam(n2);       // 間隔
        const tonalNum = super.chkNumParam(n3);  // 全本数
        this.m_prm = new Array(tonalNum);
        for(let i = 0; i < tonalNum; i++){
            this.m_prm[i] = bgnN + (i * gap);
        }
        this.m_size = tonalNum;
        this.m_data = new Array(tonalNum);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
}
//--------------------------------------------------------------------
// ICHIMOKU
//--------------------------------------------------------------------
export const TI_ICHI_BASE = 0; //一目均衡表[基準線]
export const TI_ICHI_DIVE = 1; //一目均衡表[転換線]
export const TI_ICHI_BACK = 2; //一目均衡表[遅行スパン]
export const TI_ICHI_FWD1 = 3; //一目均衡表[先行スパン1]
export const TI_ICHI_FWD2 = 4; //一目均衡表[先行スパン1]
export const TI_ICHI_MAX  = 5;
export class ChartTechICHI extends ChartTech {
	constructor() {
        super();
        this.m_size = CTP.PRM_ICHI_MAX;
        this.m_prm_ICHIR = 0;   // 一目均衡表（転換線本数）
        this.m_prm_ICHIB = 0;   // 一目均衡表（基準線本数）
        this.m_prm_ICHIS = 0;   // 一目均衡表（スパン本数）
        this.m_entry = 0;
        this.m_fwd_bgn_entry = 0;
        this.m_data = new Array(TI_ICHI_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (n1, n2, n3) {
        this.m_prm_ICHIR = super.chkNumParam(n1);
        this.m_prm_ICHIB = super.chkNumParam(n2);
        this.m_prm_ICHIS = super.chkNumParam(n3);
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, IDX.getBgnIndexICHI(), ix);
    }
    getParameterBase() { return this.m_prm_ICHIB; }
    setEntry(ix, value, dataArry) {
        if (ix < dataArry.length) {
            dataArry[ix] = value;
            this.setPriceRange(value);
            return ix;
        }else{
            for(let i = dataArry.length; i < ix; i++){
                dataArry.push(0);
            }
            dataArry.push(value);
            this.setPriceRange(value);
            return dataArry.length;
        }
    }
    updateIndexValueToObj(list, index, target_ix) {
        let entry = list.length;

        let n1 = this.m_prm_ICHIR;
        let n2 = this.m_prm_ICHIB;
        let n3 = this.m_prm_ICHIS;

        //パラメータ最大長本数取得
        let maxPrmLen = n1;
        if (maxPrmLen < n2) {
            maxPrmLen = n2;
        }
        if (maxPrmLen < n3) {
            maxPrmLen = n3;
        }

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        var bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) {
            bgnix = 0;
        }

        // 算出結果一時格納用
        let wk_value = new Array(TI_ICHI_MAX);
        let high_price = new Array(entry);
        let low_price = new Array(entry);
        if (bgnix !== 0) {
            //UPDATEの場合は事前に値段取得
            let ready_ix = bgnix - maxPrmLen;
            if (ready_ix < 0) {
                ready_ix = 0;
            }
            for (let i = ready_ix; i < bgnix; ++i) {
                high_price[i] = list[i].m_HighPrice;
                low_price[i] = list[i].m_LowPrice;
            }
        }

        for (let i = bgnix; i < entry; ++i) {
            wk_value[TI_ICHI_BASE] = 0.0;
            wk_value[TI_ICHI_DIVE] = 0.0;
            wk_value[TI_ICHI_FWD1] = 0.0;
            wk_value[TI_ICHI_FWD2] = 0.0;
            high_price[i] = list[i].mHighPrice;
            low_price[i] = list[i].mLowPrice;
            //***** 転換線 *******
            if (0 < n1 && n1 - 1 <= i) {
                let high = 0.0;
                let low = 0.0;
                for (let j = i; i - n1 < j; --j) {
                    if (high < high_price[j]) {
                        high = high_price[j];
                    }
                    if (low_price[j] < low || low === 0) {
                        low = low_price[j];
                    }
                }
                wk_value[TI_ICHI_DIVE] = (high + low) / 2;
            }
            //***** 基準線 *******
            if (0 < n2 && n2 - 1 <= i) {
                let high = 0.0;
                let low = 0.0;
                for (let j = i; i - n2 < j; --j) {
                    if (high < high_price[j]) {
                        high = high_price[j];
                    }
                    if (low_price[j] < low || low === 0) {
                        low = low_price[j];
                    }
                }
                wk_value[TI_ICHI_BASE] = (high + low) / 2;
            }
            //***** 先行スパン1 *******
            if (0 < wk_value[TI_ICHI_DIVE] && 0 < wk_value[TI_ICHI_BASE]) {
                wk_value[TI_ICHI_FWD1] = (wk_value[TI_ICHI_DIVE] + wk_value[TI_ICHI_BASE]) / 2;
            }
            //***** 先行スパン2 *******
            if (0 < n3 && n3 - 1 <= i) {
                let high = 0.0;
                let low = 0.0;
                for (let j = i; i - n3 < j; --j) {
                    if (high < high_price[j]) {
                        high = high_price[j];
                    }
                    if (low_price[j] < low || low === 0) {
                        low = low_price[j];
                    }
                }
                wk_value[TI_ICHI_FWD2] = (high + low) / 2;
            }
            //***** 遅行スパン *******
            wk_value[TI_ICHI_BACK] = list[i].mClosePrice;

            if (target_ix <= i) {
                //基準線/転換線更新
                super.set(i, wk_value, this.m_data, 2);
                //先行スパン更新
                let fut_ix = i + n2 - 1;
                this.setEntry(fut_ix, wk_value[TI_ICHI_FWD1], this.m_data[TI_ICHI_FWD1]);
                this.setEntry(fut_ix, wk_value[TI_ICHI_FWD2], this.m_data[TI_ICHI_FWD2]);
                //遅行スパン更新
                let back_ix = i - (n2 - 1);
                if (0 <= back_ix) {
                    this.setEntry(back_ix, wk_value[TI_ICHI_BACK], this.m_data[TI_ICHI_BACK]);
                }
                //*** 初期化 ***
                if (i < n2 + n2 - 1) {
                    this.setEntry(i, 0.0, this.m_data[TI_ICHI_FWD1]);
                }
                if (i < n2 + n3 - 1) {
                    this.setEntry(i, 0.0, this.m_data[TI_ICHI_FWD2]);
                }
                this.setEntry(i, 0.0, this.m_data[TI_ICHI_BACK]);
            }
        }

        //エントリ数設定
        let listSize = this.m_data.length;
        if (listSize < (n2 - 1)) {
            this.m_entry = listSize;
        } else {
            this.m_entry = listSize + (n2 - 1);
        }
        //先行足開始位置
        this.m_fwd_bgn_entry = listSize;
        high_price = [];
        low_price = [];
        return;
    }
}
//--------------------------------------------------------------------
// BB
//--------------------------------------------------------------------
export const TI_BB_TOP3 = 0;
export const TI_BB_TOP2 = 1;
export const TI_BB_TOP1 = 2;
export const TI_BB_TP   = 3;
export const TI_BB_BTM1 = 4;
export const TI_BB_BTM2 = 5;
export const TI_BB_BTM3 = 6;
export const TI_BB_MAX = 7;
export class ChartTechBB extends ChartTech {
	constructor() {
        super();
        this.m_size = CTP.PRM_BB_MAX;
        this.m_prm_ma = 0;
        this.m_prm1 = 0;
        this.m_prm2 = 0;
        this.m_prm3 = 0;
        this.m_EMA = new ChartTechEMA();
        this.m_data = new Array(TI_BB_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (ma, n1, n2, n3 = 0) {
        //n1～n3 は10倍で受取り
        if (ma < 1) return false;
        if (n1 <= 0 || 100 < n1) return false;
        if (n2 <= 0 || 100 < n2) return false;
        if (n3 < 0 || 100 < n3) return false; // 省略可能
        this.m_prm_ma = ma;
        this.m_prm1 = n1 * 0.1;
        this.m_prm2 = n2 * 0.1;
        this.m_prm3 = n3 * 0.1;
        return true;
    }
    setIndexValueToObj (list, ix = 0) {
        let entry = list.length;
        if(entry === 0) return false;
    
        //TP算出式をどちらにするかで選択
        //return UpdateIndexValueOfSMA(list, ix);
        return this.updateIndexValueToObj(list, ix);
    }
    //==============================================================================
    // [BB] BOLLINGER BAND (UPDATE)　TP=高安終平均方式(ロイター)
    //	LAST UPDATE:2014/12/19
    //==============================================================================
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0 || entry <= target_ix) return false;
    
        // SMA合計値格納用
        let sma_total = 0.0;
        // 算出結果一時格納用
        let wk_value = new Array(TI_BB_MAX);
        let value = new Array(entry);
        value.fill(0);
    
        // パラメータ
	    let prm = this.m_prm_ma;

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (prm - 1);
        if (bgnix < 0) bgnix = 0;
    
        for (let i = bgnix; i < entry; i++) {
            if(prm <= 0){
                wk_value[TI_BB_TP]   = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_TOP3] = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_TOP2] = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_TOP1] = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_BTM1] = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_BTM2] = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_BTM3] = IDX.INDEX_NO_VALUE;
            }else{
    
                let sma = 0.0;
                if(0 < list[i].mClosePrice){
                    value[i] = (list[i].mHighPrice + list[i].mLowPrice  + list[i].mClosePrice) / 3;
                }else{
                    value[i] = IDX.INDEX_NO_VALUE;
                }
                let total = 0.0;
    
                // 初回の場合は事前エントリ取得
                if(i === bgnix){
                    let bgn = bgnix - (prm - 1);
                    if (bgn < 0) bgn = 0;
                    for(let j = bgn; j < bgnix; j++){
                        sma_total += (list[j].mHighPrice 
                                    + list[j].mLowPrice 
                                    + list[j].mClosePrice) / 3;
                    }
                }
    
                if(prm - 1 <= i){
                    sma_total += value[i];
                    sma = sma_total / prm;
                    for (let k = i; i - prm < k; --k ) {
                        if(value[k] !== IDX.INDEX_NO_VALUE){
                            // 各終値 - 25日移動平均 の 25日間の合計
                            total += Math.pow(value[k] - sma, 2.0);
                        }else{
                            // 値段無し検出
                            total = IDX.INDEX_NO_VALUE;
                            break;
                        }
                    }
                    //標準偏差算出(いずれか採用)
                    if(total !== IDX.INDEX_NO_VALUE){
                        let deviation = Math.sqrt(total / (prm - 1));
                        //double deviation = sqrt(total / prm);
    
                        if(target_ix <= i){
                            wk_value[TI_BB_TP] = sma;						//（MA）
                            if(0.0 < this.m_prm3){
                                wk_value[TI_BB_TOP3] = sma + this.m_prm3 * deviation;	//（+3σ）
                                wk_value[TI_BB_BTM3] = sma - this.m_prm3 * deviation;	//（-3σ）
                            }else{
                                wk_value[TI_BB_TOP3] = 0.0;
                                wk_value[TI_BB_BTM3] = 0.0;
                            }
                            if(0.0 < this.m_prm2){
                                wk_value[TI_BB_TOP2] = sma + this.m_prm2 * deviation;	//（+2σ）
                                wk_value[TI_BB_BTM2] = sma - this.m_prm2 * deviation;	//（-2σ）
                            }else{
                                wk_value[TI_BB_TOP2] = 0.0;
                                wk_value[TI_BB_BTM2] = 0.0;
                            }
                            if(0.0 < this.m_prm1){
                                wk_value[TI_BB_TOP1] = sma + this.m_prm1 * deviation;	//（+1σ）
                                wk_value[TI_BB_BTM1] = sma - this.m_prm1 * deviation;	//（-1σ）
                            }else{
                                wk_value[TI_BB_TOP1] = 0.0;
                                wk_value[TI_BB_BTM1] = 0.0;
                            }
                        }
                    }else{
                        wk_value[TI_BB_TP]   = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_TOP3] = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_TOP2] = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_TOP1] = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_BTM1] = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_BTM2] = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_BTM3] = IDX.INDEX_NO_VALUE;
                    }
                    sma_total -= (list[i - (prm - 1)].mHighPrice 
                                + list[i - (prm - 1)].mLowPrice 
                                + list[i - (prm - 1)].mClosePrice) / 3;
                }else{
                    wk_value[TI_BB_TP]   = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_TOP3] = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_TOP2] = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_TOP1] = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_BTM1] = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_BTM2] = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_BTM3] = IDX.INDEX_NO_VALUE;
    
                    sma_total += (list[i].mHighPrice 
                                    + list[i].mLowPrice 
                                    + list[i].mClosePrice) / 3;
                }
            }
            if(target_ix <= i){
                //指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data);
            }
        }
        value = [];
        return true;
    }
    //==============================================================================
    // [BB] BOLLINGER BAND (UPDATE)　TP=SMA方式
    //	LAST UPDATE:2014/12/19
    //==============================================================================
    updateIndexValueOfSMA (list, target_ix) {
        let entry = list.length;
        if (entry === 0 || entry <= target_ix) return false;

        // SMA合計値格納用
        let sma_total = 0.0;
        // 算出結果一時格納用
        let wk_value = new Array(TI_BB_MAX);
        let value = new Array(entry);
        value.fill(0);

        // パラメータ
	    let prm = this.m_prm_ma;

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }


        // 開始インデックス算出
        let bgnix = target_ix - (prm - 1);
        if (bgnix < 0) bgnix = 0;

        for (let i = bgnix; i < entry; i++) {

            if(prm <= 0){
                wk_value[TI_BB_TP]   = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_TOP3] = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_TOP2] = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_TOP1] = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_BTM1] = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_BTM2] = IDX.INDEX_NO_VALUE;
                wk_value[TI_BB_BTM3] = IDX.INDEX_NO_VALUE;
            }else{
                let sma = 0.0;
                if(0 < list[i].mClosePrice){
                    value[i] = list[i].mClosePrice;
                }else{
                    value[i] = IDX.INDEX_NO_VALUE;
                }
                let total = 0.0;

                // 初回の場合は事前エントリ取得
                if (i === bgnix) {
                    let bgn = bgnix - (prm - 1);
                    if (bgn < 0) bgn = 0;
                    for(let j = bgn; j < bgnix; j++){
                        sma_total += list[j].mClosePrice;
                    }
                }

                if(prm - 1 <= i){
                    sma_total += value[i];
                    sma = sma_total / prm;
                    for (let k = i; i - prm < k; --k ) {
                        if(value[k] !== IDX.INDEX_NO_VALUE){
                            // 各終値 - 25日移動平均 の 25日間の合計
                            total += Math.pow(value[k] - sma, 2.0);
                        }else{
                            // 値段無し検出
                            total = IDX.INDEX_NO_VALUE;
                            break;
                        }
                    }
                    // 標準偏差算出
                    if(total !== IDX.INDEX_NO_VALUE){
                        let deviation = Math.sqrt(total / prm);
                        //double deviation = sqrt(total / (prm - 1));
    
                        if (target_ix <= i) {
                            wk_value[TI_BB_TP] = sma;						//（MA）
                            if(0.0 < this.m_prm3){
                                wk_value[TI_BB_TOP3] = sma + this.m_prm3 * deviation;	//（+3σ）
                            }else{
                                wk_value[TI_BB_TOP3] = 0.0;
                            }
                            wk_value[TI_BB_TOP2] = sma + this.m_prm2 * deviation;	//（+2σ）
                            wk_value[TI_BB_TOP1] = sma + this.m_prm1 * deviation;	//（+1σ）
                            wk_value[TI_BB_BTM1] = sma - this.m_prm1 * deviation;	//（-1σ）
                            wk_value[TI_BB_BTM2] = sma - this.m_prm2 * deviation;	//（-2σ）
                            if(0.0 < this.m_prm3){
                                wk_value[TI_BB_BTM3] = sma - this.m_prm3 * deviation;	//（-3σ）
                            }else{
                                wk_value[TI_BB_BTM3] = 0.0;
                            }
                        }
                    }else{
                        wk_value[TI_BB_TP]   = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_TOP3] = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_TOP2] = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_TOP1] = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_BTM1] = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_BTM2] = IDX.INDEX_NO_VALUE;
                        wk_value[TI_BB_BTM3] = IDX.INDEX_NO_VALUE;
                    }
                    sma_total -= list[i - (prm - 1)].mClosePrice;
                }else{
                    wk_value[TI_BB_TP]   = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_TOP3] = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_TOP2] = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_TOP1] = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_BTM1] = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_BTM2] = IDX.INDEX_NO_VALUE;
                    wk_value[TI_BB_BTM3] = IDX.INDEX_NO_VALUE;
                    sma_total += list[i].mClosePrice;
                }
            }

            if(target_ix <= i){
                // 指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data);
            }
	    }
	    value = [];
    }

}

//--------------------------------------------------------------------
// [PVOL] VOLUME PER PRICE
//--------------------------------------------------------------------
export class ChartTechPVOL {
	constructor() {
        this.m_prm		   = 0;
        this.m_range_unit  = 0;
        this.m_range_num   = 0;
        this.m_range_lower = 0;
        this.m_data = new ChartPVOL();
    }
    setParameter (p1, p2, p3, p4) {
        this.m_prm		   = p1; // 値段分割本数
        this.m_range_unit  = p2; // 1レンジ値段幅
        this.m_range_num   = p3; // 表示本数
        this.m_range_lower = p4; // 値段幅(下限)
    }
    setIndexValueToObj (list, bgnix, endix) {
        let entry = list.length;
        if (entry === 0) return;
	    var value = new Array(entry);
        if(endix <= bgnix) return 0;

        //※低い値段から格納(0=最安値)

        //１レンジ表示単位
        let rangu_unit = this.m_range_unit;

        //最大値初期化
        this.m_data.m_maxValue = 0;

        //１価格帯レンジ
        let per_unit = 0;
        let prm = 0;
        if(rangu_unit < this.m_prm){
            //表示がパラメータ本数に満たない場合(8本に対しレンジが5円以下等)
            prm = rangu_unit;
            per_unit = 1;
        }else{
            prm = this.m_prm;
            per_unit = Math.floor(rangu_unit / prm);
        }
    	//表示本数取得
        let range_num = this.m_range_num;
        //目盛開始値取得
        let btm_value = this.m_range_lower;
        //エントリ数
        let entry_num = range_num * prm;
        if(this.m_data.m_value.length < entry_num){
            return 0;
        }
        this.m_data.m_entry = entry_num;
        //初期化
        for (let i = 0; i < entry_num; i++) { 
            this.m_data.m_value[i] = 0;
        }
        
        let target_index = 0;
        let end = endix + 1;
        let sz_list = list.length;
        if(sz_list <= end){
            end = sz_list - 1;
        }
        let b_found = false;
        for(let i = bgnix; i < end; ++i){
            target_index = 0;
            b_found = false;
            let pt = list[i];
            let target_price = Math.floor(pt.mClosePrice);
            for (let j = 0; j < range_num; j++) {
                let base_price = btm_value + (rangu_unit * j);
                //今回の比較値段より小さい場合(割切れない部分に該当値段が存在する場合)
                if(target_price < base_price){
                    if(0 < target_index){
                        this.m_data.m_value[target_index-1] += pt.mVolume;
                    }
                    break;
                }
                for (let k = 1; k <= prm; k++) {
                    let chk_price = base_price + (per_unit * k);
                    if(target_price <= chk_price){
                        this.m_data.m_value[target_index] += pt.mVolume;
                        b_found = true;
                        break;
                    }
                    target_index++;
                }
                if(b_found){
                    break;
                }
            }
            
        }
        for (let i = 0; i < entry_num; i++) {
            if (this.m_data.m_maxValue < this.m_data.m_value[i]) {
                this.m_data.m_maxValue = this.m_data.m_value[i];
            }
        }
        return prm;
    
    }
}
//--------------------------------------------------------------------
// [REV] REVERSAL POINT (転換点判定)
//--------------------------------------------------------------------
export class ChartTechREV {
	constructor() {
        this.m_prm = 0;
        this.m_data = [];
    }
    setParameter(p1)
    {
        this.m_prm = p1;	// 転換判定本数
        return true;
    }
    setIndexValue(list)
    {
        let entry = list.length;
        if(entry === 0) return false;
    
        return this.updateIndexValue(list, 0);
    }
    //==============================================================================
    // [REV] REVERSAL POINT (UPDATE)
    //==============================================================================
    updateIndexValue(list, target_ix)
    {
        let entry = list.length;
        if(entry === 0 || entry <= target_ix) return false;
        if(this.m_prm <= 0) return false;

        //遡及本数取得
        let prm = this.m_prm;
        let maxPrmLen = prm;

        //更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        //開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;

        let statReverse = 0;
        let priceHL = new Array(2);
        let priceHL_ix = new Array(2);
        for(let i=bgnix; i<entry; ++i){
            this.setEntry(i, 0);
            if (prm <= i && i+prm < entry) {
                //直近過去N本 & 未来N本分のHL取得（0:HIGH/1:LOW）
                this.getHLPrice(list, i-prm, i+prm, priceHL, priceHL_ix);
                if(priceHL_ix[0] === i){
                    if(statReverse !== 1){
                        statReverse = 1;	//天
                        //TIHistObj* rpt = list->at(priceHL_ix[0]);
                        //rpt->mReversePoint = 1;
                        this.setEntry(priceHL_ix[0], statReverse);
                    }
                }else if(priceHL_ix[1] === i){
                    if(statReverse !== 2){
                        statReverse = 2;	//底
                        this.setEntry(priceHL_ix[1], statReverse);
                        //TIHistObj* rpt = list->at(priceHL_ix[1]);
                        //rpt->mReversePoint = 2;
                    }
                }
            }
        }
        return true;
    }
    setEntry(ix, value)
    {
        if (ix < this.m_data.length) {
            this.m_data[ix]= value;
            return ix;
        }
        else {
            this.m_data.push(value);
            return this.m_data.length - 1;
        }
    }
    getHLPrice(list, sta, end, price, index)
    {
        let endVal = end + 1;
        let list_size = list.length;
        if(list_size < endVal){
            endVal = list_size;
        }
        let high = 0.0;
        let low  = 0.0;
        let high_ix = -1;
        let low_ix = -1;
        let pt = list[sta];
        low = pt.mLowPrice;
        low_ix = sta;
        for (let i = sta; i < endVal; ++i){
            pt = list[i];
            //同値は直近を採用
            if(high <= pt.mHighPrice){
                high = pt.mHighPrice;
                high_ix = i;
            }
            if(pt.mLowPrice <= low){
                low = pt.mLowPrice;
                low_ix = i;
            }
        }
        price[0] = high;
        index[0] = high_ix;
        price[1] = low;
        index[1] = low_ix;
    }
}
//--------------------------------------------------------------------
// [ENV] MOVING AVERAGE ENVELOPES
//--------------------------------------------------------------------
export const TI_ENV_TOP3 = 0;
export const TI_ENV_TOP2 = 1;
export const TI_ENV_TOP1 = 2;
export const TI_ENV_SMA = 3;
export const TI_ENV_BTM1 = 4;
export const TI_ENV_BTM2 = 5;
export const TI_ENV_BTM3 = 6;
export const TI_ENV_MAX = 7;
export class ChartTechENV extends ChartTech {
	constructor() {
        super();
        this.m_prm_num = CTP.PRM_ENV_MAX + 3;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_ENV_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (sma, n1, n2, n3) {
        //n1～n3 は10倍で受取り
        if (sma < 1) return false;
        if (n1 <= 0 || 100 < n1) return false;
        if (n2 <= 0 || 100 < n2) return false;
        if (n3 <= 0 || 100 < n3) return false;
        this.m_prm[TI_ENV_SMA] = sma;
        this.m_prm[TI_ENV_TOP1] = n1 * 0.1;
        this.m_prm[TI_ENV_TOP2] = n2 * 0.1;
        this.m_prm[TI_ENV_TOP3] = n3 * 0.1;
        this.m_prm[TI_ENV_BTM1] = n1 * 0.1;
        this.m_prm[TI_ENV_BTM2] = n2 * 0.1;
        this.m_prm[TI_ENV_BTM3] = n3 * 0.1;
        return true;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

        // 遡及本数取得
        let sma_prm = this.m_prm[TI_ENV_SMA];
        let maxPrmLen = sma_prm;

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if (bgnix < 0) bgnix = 0;

	    // 算出結果一時格納用
        let wk_value = new Array(TI_ENV_MAX);
        // SMA合計値格納用
        let total = 0.0;

        for (let i = bgnix; i < entry; i++) {
            if(sma_prm <= 0){
                wk_value[TI_ENV_TOP3] = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_TOP2] = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_TOP1] = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_SMA]  = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_BTM1] = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_BTM2] = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_BTM3] = CD.INDEX_NO_VALUE;
                continue;
            }
    
            // 初回の場合は事前エントリ取得
            if(i === bgnix){
                total = 0.0;
                let bgn = bgnix - (sma_prm - 1);
                if(bgn < 0) bgn = 0;
                for(let j = bgn; j < bgnix; j++){
                    total += list[j].mClosePrice;
                }
            }
    
            if(sma_prm - 1 <= i){
                total += list[i].mClosePrice;
                if(0 < list[i - (sma_prm - 1)].mClosePrice){
                    wk_value[TI_ENV_SMA] = total / sma_prm;
                    wk_value[TI_ENV_TOP3] = (wk_value[TI_ENV_SMA] + (wk_value[TI_ENV_SMA] * this.m_prm[TI_ENV_TOP3]) /100);
                    wk_value[TI_ENV_TOP2] = (wk_value[TI_ENV_SMA] + (wk_value[TI_ENV_SMA] * this.m_prm[TI_ENV_TOP2]) /100);
                    wk_value[TI_ENV_TOP1] = (wk_value[TI_ENV_SMA] + (wk_value[TI_ENV_SMA] * this.m_prm[TI_ENV_TOP1]) /100);
                    wk_value[TI_ENV_BTM1] = (wk_value[TI_ENV_SMA] - (wk_value[TI_ENV_SMA] * this.m_prm[TI_ENV_BTM1]) /100);
                    wk_value[TI_ENV_BTM2] = (wk_value[TI_ENV_SMA] - (wk_value[TI_ENV_SMA] * this.m_prm[TI_ENV_BTM2]) /100);
                    wk_value[TI_ENV_BTM3] = (wk_value[TI_ENV_SMA] - (wk_value[TI_ENV_SMA] * this.m_prm[TI_ENV_BTM3]) /100);
                }else{
                    // 上場日に初値が付かない場合は'終値 = 0'エントリが存在するため算出対象外の考慮
                    wk_value[TI_ENV_TOP3] = CD.INDEX_NO_VALUE;
                    wk_value[TI_ENV_TOP2] = CD.INDEX_NO_VALUE;
                    wk_value[TI_ENV_TOP1] = CD.INDEX_NO_VALUE;
                    wk_value[TI_ENV_SMA]  = CD.INDEX_NO_VALUE;
                    wk_value[TI_ENV_BTM1] = CD.INDEX_NO_VALUE;
                    wk_value[TI_ENV_BTM2] = CD.INDEX_NO_VALUE;
                    wk_value[TI_ENV_BTM3] = CD.INDEX_NO_VALUE;
                }
                total -= list[i - (sma_prm - 1)].mClosePrice;
            }else{
                // 加算のみ
                wk_value[TI_ENV_TOP3] = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_TOP2] = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_TOP1] = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_SMA]  = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_BTM1] = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_BTM2] = CD.INDEX_NO_VALUE;
                wk_value[TI_ENV_BTM3] = CD.INDEX_NO_VALUE;
                total += list[i].mClosePrice;
            }
            if (target_ix <= i) {
                // 指定開始インデックス以降のみ更新
                super.set(i, wk_value, this.m_data, TI_ENV_MAX);
            }
        }
        wk_value = [];
        total = [];
        return;
    }
}
//--------------------------------------------------------------------
//  [VS] VOLATILITY SYSTEM
//--------------------------------------------------------------------
export const TI_VS_H = 0;
export const TI_VS_L = 1;
export const TI_VS_MAX = 2;
export class ChartTechVS extends ChartTech {
	constructor() {
        super();
        this.m_prm_num = CTP.PRM_VS_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_VS_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (n1, n2) {
        //p2 は10倍で受取り
        if (n2 <= 0 || 200 < n2) return false;
        this.m_prm[CTP.PRM_VS] = super.chkNumParam(n1);
        this.m_prm[CTP.PRM_VS_COF] = n2 * 0.1;
        return true;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

        // パラメータ最大長本数取得
        let prm = this.m_prm[CTP.PRM_VS];
        let maxPrmLen = prm;

        // 開始インデックス算出
        let bgnix = target_ix - (maxPrmLen + 1);
        if (bgnix < 0) {
            bgnix = 0;
        }

	    // 算出結果一時格納用
        let wk_value = new Array(TI_VS_MAX);
        // TR(N日指数移動平均算出用)
        let trVal = new Array(entry);
        let high_price = 0, low_price = 0;

        if (bgnix != 0) {
            //UPDATEの場合は事前に値段取得
            let ready_ix = bgnix - maxPrmLen;
            if (ready_ix < 0) {
                ready_ix = 0;
            }
            for (let i = ready_ix; i < bgnix; i++) {
                trVal[i] = super.getTrueRange(list, i);
            }
        }

        for (let i = bgnix; i < entry; i++) {
            let atr_value = CD.INDEX_NO_VALUE;
            trVal[i] = super.getTrueRange(list, i);
            if (prm <= i) { //前日参照あり
                for (let j = i; i - prm < j; j-- ) {
                    if (0 < list[i - prm].mClosePrice) {
                    //コメントアウトを外せば指数算出となる
                    //if(trVal[j] === 0.0){
                        //初回ATR単純移動平均
                        let ttl_tr = 0.0;
                        for (let k = i; i - prm < k; --k) {
                            ttl_tr += trVal[k];
                        }
                        atr_value = ttl_tr / prm;
                    //}else{
                        //初回ATR指数平均
                    //	atr_value = trVal[j] * 2 / (prm+1) + trVal[j-1] * (prm+1-2)/(prm+1);
                    //}
                    }else{
                        break;
                    }
                }
            }
            if (atr_value != CD.INDEX_NO_VALUE) {
                let [high_price, low_price] = super.getHLClose(list, i, prm);	//終値ベース
                let wkatr_value = atr_value * this.m_prm[CTP.PRM_VS_COF];
                wk_value[TI_VS_H] = low_price + wkatr_value;
                wk_value[TI_VS_L] = high_price - wkatr_value;
            } else {
                wk_value[TI_VS_H] = atr_value;
                wk_value[TI_VS_L] = atr_value;
            }
            if (target_ix <= i) {
                super.set(i, wk_value, this.m_data, TI_VS_MAX);
            }
        }
        return true;
    }
}
//--------------------------------------------------------------------
//  [PAR] PARABOLIC (STOP AND REVERSE)
//--------------------------------------------------------------------
export const TI_PAR = 0;
export const TI_PAR_FLG = 1;
export const TI_PAR_MAX = 2;
const PAR_INIT_COUNT = 9;//初期LONG/SHORT判定用(9本固定)
const PAR_SHORT = 1;
const PAR_LONG = 2;
export class ChartTechPAR extends ChartTech {
	constructor() {
        super();
        this.m_prm_num = CTP.PRM_PAR_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_PAR_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
        // パラメータ変数退避用
        this.m_back_mode;
        this.m_back_af;
        this.m_back_ep;
        this.m_back_sar;
    }
    setParameter (n1, n2, n3) {
        //p1～p3 は1000倍で受取り
        if (n1 < 1 || 100 < n1) return false;
        if (n2 < 1 || 100 < n2) return false;
        if (n3 < 100 || 1000 < n3) return false;

        this.m_prm[CTP.PRM_PAR_AF_INIT] = n1 / 1000;
        this.m_prm[CTP.PRM_PAR_AF_INC] = n2 / 1000;
        this.m_prm[CTP.PRM_PAR_AF_MAX] = n3 / 1000;

        return true;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;


         // 算出結果一時格納用
        let wk_value = new Array(TI_PAR_MAX);
        wk_value[TI_PAR] = 0;
        wk_value[TI_PAR_FLG] = 0;

        if (entry < PAR_INIT_COUNT) {
            for (let i = 0; i < entry; i++){
                super.set(i, wk_value, this.m_data, TI_PAR_MAX);
            }
            return true;
        }

        // パラメータ最大長本数取得
        let prm = this.m_prm[CTP.PRM_VS];
        let maxPrmLen = prm;

        // 開始インデックス算出
        let bgnix = target_ix - PAR_INIT_COUNT; //最低本数
        if(bgnix < 0){
            bgnix = PAR_INIT_COUNT;
        }

        let af = this.m_prm[CTP.PRM_PAR_AF_INIT];
        let ep = 0.0;	//期間中高安
        let sar = 0.0;
        let prev_sar = 0.0;
        let mode = 0;
    
        if(bgnix === PAR_INIT_COUNT){
            // 初期本数初期化のみ
            for(let i = 0; i < PAR_INIT_COUNT; i++){
                super.set(i, wk_value, this.m_data, TI_PAR_MAX);
            }
            //LONG/SHORT判定 及び初期SAR取得
            let is_short = false;
            [prev_sar, is_short] = this.isShort(list, PAR_INIT_COUNT - 1);
            if (is_short){
                //SHORT
                ep = prev_sar;
                mode = PAR_SHORT;
            }else{
                //LONG
                ep = prev_sar;
                mode = PAR_LONG;
            }
        }else{
            //算出変数復元
            af = this.m_back_af;
            ep = this.m_back_ep;
            prev_sar = this.m_back_sar;
            mode = this.m_back_mode;
        }

        for (let i = bgnix; i < entry; i++) {
            let pt = list[i];
            //転換処理判定
            if (this.isHLTouch(pt, mode, prev_sar)) {
                //転換処理
                //AFクリア
                af = this.m_prm[CTP.PRM_PAR_AF_INIT];
                //高安を始点とする
                prev_sar = ep;
                //転換モード入替え
                if(mode === PAR_LONG){
                    //LONG => SHORT
                    mode = PAR_SHORT;
                    ep = pt.mLowPrice;
                }else{
                    //SHORT => LONG
                    mode = PAR_LONG;
                    ep = pt.mHighPrice;
                }
                sar = prev_sar + af * (ep - prev_sar);
            }else{
                [af, ep, sar] = this.getSAR(pt, mode, af, ep, prev_sar);
            }
            if(target_ix <= i){
                //前回分を当日更新
                wk_value[TI_PAR] = prev_sar;
                wk_value[TI_PAR_FLG] = mode;
                super.set(i, wk_value, this.m_data, TI_PAR_MAX);
            }
            prev_sar = sar;
        }
        // 次回更新用算出変数退避
        this.m_back_mode = mode;
        this.m_back_af = af;
        this.m_back_ep = ep;
        this.m_back_sar= prev_sar;
        return true;
    }
    isHLTouch(pt, mode, sar) {
        if (mode === PAR_LONG && pt.mLowPrice < sar) {
            return true;
        }
        if (mode === PAR_SHORT && sar < pt.mHighPrice) {
            return true;
        }
        return false;
    }
    isShort(list, i) {
        let sar = 0;
        let sma = super.getSMA(list, i, PAR_INIT_COUNT);
        // 過去固定エントリ数分の中から取得
        let [high, low] = super.getHLPrice(list, i, PAR_INIT_COUNT);
        let high_gap = high - sma;
        let low_gap = sma - low;
        if(Math.abs(high_gap) < Math.abs(low_gap)){
            sar = high;
            return [sar, true];
        }
        sar = low;
        return [sar, false];
    }
    getSAR(pt, mode, p_af, p_ep, prev_sar) {
        let af = p_af;
        let ep = p_ep;
        if(mode === PAR_LONG){
            if(ep < pt.mHighPrice){
                ep = pt.mHighPrice;
                af += this.m_prm[CTP.PRM_PAR_AF_INC];
                if(this.m_prm[CTP.PRM_PAR_AF_MAX] < af){
                    af = this.m_prm[CTP.PRM_PAR_AF_MAX];
                }
            }
        }else{
            if(pt.mLowPrice < ep){
                ep = pt.mLowPrice;
                af += this.m_prm[CTP.PRM_PAR_AF_INC];
                if(this.m_prm[CTP.PRM_PAR_AF_MAX] < af){
                    af = this.m_prm[CTP.PRM_PAR_AF_MAX];
                }
            }
        }
        let sar = prev_sar + af * (ep - prev_sar);
        return [af, ep, sar];
    }
}
//--------------------------------------------------------------------
//  [HLB] HL BAND
//--------------------------------------------------------------------
export const TI_HLB_H = 0;
export const TI_HLB_L = 1;
export const TI_HLB_M = 2;
export const TI_HLB_MAX = 3;
export class ChartTechHLB extends ChartTech {
	constructor() {
        super();
        this.m_prm_num = CTP.PRM_HLB_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_HLB_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (n1) {
        this.m_prm[CTP.PRM_HLB] = super.chkNumParam(n1);
        return true;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

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
       if (bgnix < 0) {
           bgnix = 0;
       }

	    //算出結果一時格納用
        let wk_value = new Array(TI_HLB_MAX);

        for (let i = bgnix; i < entry; i++) {
            wk_value[TI_HLB_H] = 0.0;
            wk_value[TI_HLB_L] = 0.0;
            wk_value[TI_HLB_M] = 0.0;
            if (0 < this.m_prm[0] && this.m_prm[0] <= i) {
                //前日からの高安を遡及
                let [h, l] = super.getHLPrice(list, i-1, this.m_prm);
                wk_value[TI_HLB_H] = h;
                wk_value[TI_HLB_L] = l;
                wk_value[TI_HLB_M] = (wk_value[TI_HLB_H] + wk_value[TI_HLB_L]) / 2;
            }
            if (target_ix <= i) {
                super.set(i, wk_value, this.m_data, TI_HLB_MAX);
            }
        }
        return true;
    }
}
//--------------------------------------------------------------------
//  [PVT] PIVOT
//--------------------------------------------------------------------
export const TI_PVT_PVOT = 0;
export const TI_PVT_RST1 = 1;
export const TI_PVT_RST2 = 2;
export const TI_PVT_SPT1 = 3;
export const TI_PVT_SPT2 = 4;
export const TI_PVT_MAX = 5;
export class ChartTechPVT extends ChartTech {
	constructor() {
        super();
        this.m_data = new Array(TI_PVT_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

        // 開始インデックス算出
        let bgnix = target_ix;
        if (bgnix < 0) {
            bgnix = 0;
        }

	    // 算出結果一時格納用
        let wk_value = new Array(TI_PVT_MAX);

        for (let i = bgnix; i < entry; i++) {
            wk_value[TI_PVT_PVOT] = CD.INDEX_NO_VALUE;
            wk_value[TI_PVT_RST1] = CD.INDEX_NO_VALUE;
            wk_value[TI_PVT_RST2] = CD.INDEX_NO_VALUE;
            wk_value[TI_PVT_SPT1] = CD.INDEX_NO_VALUE;
            wk_value[TI_PVT_SPT2] = CD.INDEX_NO_VALUE;
            if (0 < i) {
                let prev = list[i-1];
                if(0 < prev.mClosePrice){
                    //ピボット＝（前日高値＋前日安値＋前日終値）÷３
                    wk_value[TI_PVT_PVOT] = (prev.mHighPrice + prev.mLowPrice + prev.mClosePrice) / 3;
                    //レジスタンス1＝ピボット×2-前日安値
                    wk_value[TI_PVT_RST1] = wk_value[TI_PVT_PVOT] * 2 - prev.mLowPrice;
                    //サポートライン1＝ピボット×2-前日高値
                    wk_value[TI_PVT_SPT1] = wk_value[TI_PVT_PVOT] * 2 - prev.mHighPrice;
                    //レジスタンス2＝（ピボット-サポート1）+レジスタンス1 
                    wk_value[TI_PVT_RST2] = (wk_value[TI_PVT_PVOT] - wk_value[TI_PVT_SPT1]) + wk_value[TI_PVT_RST1];
                    //サポートライン2＝ピボット-（レジスタンス1-サポート1）
                    wk_value[TI_PVT_SPT2] = wk_value[TI_PVT_PVOT] - (wk_value[TI_PVT_RST1] - wk_value[TI_PVT_SPT1]);
                }
            }
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_PVT_MAX);
            }
        }
        return true;
    }
}
//--------------------------------------------------------------------
//  [LRT]  LINEAR REGRESSION TREND
//--------------------------------------------------------------------
export const TI_LRT_TOP2 = 0;	// 回帰トレンド[+2σ]
export const TI_LRT_TOP1 = 1;	// 回帰トレンド[+1σ] 
export const TI_LRT_FIT = 2;	// 回帰トレンド[FIT]
export const TI_LRT_BTM1 = 3;	// 回帰トレンド[-1σ] 
export const TI_LRT_BTM2 = 4;	// 回帰トレンド[-2σ]
export const TI_LRT_MAX = 5;
export class ChartTechLRT extends ChartTech {
	constructor() {
        super();
        this.m_prm_num = CTP.PRM_LRT_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_LRT_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
        this.m_bgn_entry = 0;
    }
    setParameter (n1) {
        this.m_prm[CTP.PRM_LRT] = super.chkNumParam(n1);
        return true;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    getBeginIndex() {
        return this.m_bgn_entry;
    }
    updateIndexValueToObj (list, target_ix) {

        //他の指標と処理方式が異なるので雛形には使わない
        //常に直近のパラメータ本数分しかエントリは作成しない
        //一目の先行の様に予測エントリを追加予定

        let entry = list.length;
        if (entry === 0) return false;

        let prm = this.m_prm[CTP.PRM_LRT];

        let wk_value = new Array(TI_LRT_MAX);
        if (entry < prm) {
            for(let i = 0; i < prm; i++){
                wk_value[TI_LRT_TOP2] = 0.0;
                wk_value[TI_LRT_TOP1] = 0.0;
                wk_value[TI_LRT_FIT]  = 0.0;
                wk_value[TI_LRT_BTM1] = 0.0;
                wk_value[TI_LRT_BTM2] = 0.0; 
                super.set(i, wk_value, this.m_data, TI_LRT_MAX);
            }
            return true;
        }
    
        let price = new Array(prm);
        let ave_entry = 0.0; //平均本数
        let ttl_entry = 0.0; //合計本数
        for(let i = 0; i < prm; i++){
            ttl_entry += (i + 1);
        }
        ave_entry = ttl_entry / prm;
    
        let ave_value = 0.0; //平均値段
        let ttl_value = 0.0; //合計値段
        //開始インデックス算出
        let bgnix = entry - prm;
        if(bgnix < 0) bgnix = 0;
    
        this.m_bgn_entry = bgnix;
        let j = 0;
        for (let i = bgnix; i < entry; i++) {
            let pt = list[i];
            price[j++] = pt.mClosePrice;
            ttl_value += pt.mClosePrice;
        }
        ave_value = ttl_value / prm;
    
        let x = 0.0;
        let y = 0.0;
        for (let i = 0; i < prm; i++) {
            x += ((i - ave_entry) * (price[i] - ave_value));
            y += Math.pow(i - ave_entry, 2);
        }
        let slope = x / y;
        let intercept = ave_value - (slope * ave_entry);
        let sd = Math.sqrt(ttl_value / prm);	    //標準偏差
        //let se = sd / Math.sqrt((double)m_pPrm);	//標準誤差
        for(let i = 0; i < prm; ++i){
            let value = intercept +  slope * i;
            //標準偏差を採用
            wk_value[TI_LRT_TOP2] = value + 2.0 * sd;	//（+2μ）
            wk_value[TI_LRT_TOP1] = value + 1.0 * sd;	//（+1μ）
            wk_value[TI_LRT_FIT]  = value;
            wk_value[TI_LRT_BTM1] = value - 1.0 * sd;	//（-1μ）
            wk_value[TI_LRT_BTM2] = value - 2.0 * sd;	//（-2μ）
            super.set(i, wk_value, this.m_data, TI_LRT_MAX);
        }
    }
}
//--------------------------------------------------------------------
//  [HMA] HIGH AND LOW MOVING AVERAGE
//--------------------------------------------------------------------
export const TI_HMA_H = 0;
export const TI_HMA_L = 1;
export const TI_HMA_MAX = 2;
export class ChartTechHMA extends ChartTech {
	constructor() {
        super();
        this.m_prm_num = CTP.PRM_HMA_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_HMA_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (n1) {
        this.m_prm[CTP.PRM_HMA] = super.chkNumParam(n1);
        return true;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

        // 遡及本数取得
        let maxPrmLen = 0;
        for (let i= 0; i < this.m_prm_num; i++ ){
            if (maxPrmLen < this.m_prm[i]) {
                maxPrmLen = this.m_prm[i];
            }
        }
        let prm = this.m_prm[CTP.PRM_HMA];

        // 更新インデックス有効範囲
        if (entry <= target_ix) {
            target_ix = entry - 1;
        }

       // 開始インデックス算出
       let bgnix = target_ix - (maxPrmLen - 1);
       if (bgnix < 0) {
           bgnix = 0;
       }

	    // 算出結果一時格納用
        let wk_value = new Array(TI_HMA_MAX);
        let total_high	= 0.0;
        let total_low	= 0.0;

        for (let i = bgnix; i < entry; i++) {

            if(prm <= 0){
                wk_value[TI_HMA_H] = CD.INDEX_NO_VALUE;
                wk_value[TI_HMA_L] = CD.INDEX_NO_VALUE;
                super.set(i, wk_value, this.m_data, TI_HMA_MAX);
                continue;
            }
    
            // 初回の場合は事前エントリ取得
            if (i === bgnix) {
                total_high = 0;
                let bgn = bgnix - (prm - 1);
                if (bgn < 0) bgn = 0;
                for (let j = bgn; j < bgnix; j++) {
                    total_high	+= list[j].mHighPrice;
                    total_low	+= list[j].mLowPrice;
                }
            }

            if(prm - 1 <= i){
                total_high += list[i].mHighPrice;
                total_low += list[i].mLowPrice;
                if(0 < list[i - (prm - 1)].mClosePrice){
                    wk_value[TI_HMA_H] = total_high / prm;
                    wk_value[TI_HMA_L] = total_low / prm;
                }else{
                    // 上場日に初値が付かない場合は'終値 = 0'エントリが存在するため算出対象外の考慮
                    wk_value[TI_HMA_H] = CD.INDEX_NO_VALUE;
                    wk_value[TI_HMA_L] = CD.INDEX_NO_VALUE;
                }
                total_high -= list[i - (prm - 1)].mHighPrice;
                total_low -= list[i - (prm - 1)].mLowPrice;
            }else{
                // 加算のみ
                wk_value[TI_HMA_H] = CD.INDEX_NO_VALUE;
                wk_value[TI_HMA_L] = CD.INDEX_NO_VALUE;
                total_high += list[i].mHighPrice;
                total_low += list[i].mLowPrice;
            }
    
            if(target_ix <= i){
                super.set(i, wk_value, this.m_data, TI_HMA_MAX);
            }
        }
        return true;
    }
}
//--------------------------------------------------------------------
// [CWC] CONTRARY WATCH
//--------------------------------------------------------------------
export const TI_CWC_SMA = 0;
export const TI_CWC_SMAV = 1;
export const TI_CWC_MAX = 2;
export class ChartTechCWC extends ChartTech {
    constructor() {
        super();
        this.m_prm_num = CTP.PRM_CWC_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_data = new Array(TI_CWC_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
        this.m_entry = 0;
        this.m_data[TI_CWC_SMA].max = 0;
        this.m_data[TI_CWC_SMA].min = 0;
        this.m_data[TI_CWC_SMAV].max = 0;
        this.m_data[TI_CWC_SMAV].min = 0;    
    }
    setParameter(n1) {
        this.m_prm[CTP.PRM_CWC] = super.chkNumParam(n1);
        return true;
    }
    getSize() {
        return this.m_data[TI_CWC_SMA].length;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

        //遡及本数取得
        let prm = this.m_prm[0];
        let maxPrmLen = prm;

        // 算出結果一時格納用
        let price = new Array(entry);
        let volume = new Array(entry);

        //開始インデックス算出
        let bgnix = target_ix - (maxPrmLen - 1);
        if(bgnix < 0){
            bgnix = 0;
            this.m_entry = 0;
            this.clearRange(TI_CWC_SMA);
            this.clearRange(TI_CWC_SMAV);
        }
        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            price[i] = pt.mClosePrice;
            volume[i] = pt.mVolume;
            let wk_smaValue = 0.0;
            let wk_smavValue = 0.0;
            if (0 < prm && prm - 1 <= i) {
                let ttl_price = 0.0;
                let ttl_volume = 0;
                for (let k = i; i - prm < k; --k) {
                    ttl_price += price[k];
                    ttl_volume += volume[k];
                }
                wk_smaValue = ttl_price / prm;
                wk_smavValue = ttl_volume / prm;
            }

            if(target_ix <= i){
                this.setValue(i, wk_smaValue, TI_CWC_SMA);
                this.setValue(i, wk_smavValue, TI_CWC_SMAV);
            }
            this.m_entry++;
        }
        return true;
    }
    setValue(ix, value, ti_idx) {
        this.m_data[ti_idx][ix] = value;
        if(this.m_data[ti_idx].max < value){
            this.m_data[ti_idx].max = value;
        }
        if(value < this.m_data[ti_idx].min || 0 === this.m_data[ti_idx].min){
            this.m_data[ti_idx].min = value;
        }   
    }
    clearRange(ti_idx) {
        this.m_data[ti_idx].max = this.m_data[ti_idx].min = 0;
    }
    getSMARange() {
        return [this.m_data[TI_CWC_SMA].max, this.m_data[TI_CWC_SMA].min];
    }
    getSMAVRange() {
        return [this.m_data[TI_CWC_SMAV].max, this.m_data[TI_CWC_SMAV].min];
    }
}
//--------------------------------------------------------------------
// [BRK] RECORD PRICE CHART
//--------------------------------------------------------------------
export const TI_BRK_BGN = 0;
export const TI_BRK_END = 1;
export const TI_BRK_BGN_DATE = 2;
export const TI_BRK_END_DATE = 3;
export const TI_BRK_MAX = 4;
export class ChartTechBRK extends ChartTech {
	constructor() {
        super();
        this.m_prm_num = CTP.PRM_BRK_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_workChkPrice = 0;	// 転換判定用値段
        this.m_workDirection = 0;	// 方向(1:上昇方向 2:下降方向)
        this.m_workOpen_ix = 0;		// 開始エントリ
        this.m_backChkPrice = 0;	// 退避情報(確定済)転換判定用値段
        this.m_backDirection = 0;	// 退避情報(確定済)方向(1:上昇方向 2:下降方向)
        this.m_backOpen_ix = 0;		// 退避情報(確定済)開始エントリ
        this.m_lastEntry = 0;		// 処理済エントリ
        this.m_data = new Array(TI_BRK_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
        this.m_tbrk = new ChartTechTBRK();
    }
    setParameter (n1) {
        this.m_prm[CTP.PRM_BRK] = super.chkNumParam(n1);
        this.m_tbrk.setParameter(n1);
        return true;
    }
    getSize() {
        return this.m_data[TI_BRK_BGN].length;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

        const prm = this.m_prm[CTP.PRM_BRK];

        //開始エントリ終値を基準として採用
        let pt = list[0];
        let prv_high = new Array(prm);
        let prv_low = new Array(prm);
        this.m_tbrk.clearPrvPrice(prv_high, prv_low);
        let chk_price = pt.mClosePrice;
        this.m_tbrk.addPrvPrice(prv_high, prv_low, chk_price, chk_price);
        let direction = 0;	//1:上昇方向 2:下降方向
        let opn_ix = 0;

        //開始インデックス
        let bgnix = target_ix;
        if (bgnix == 0) {
            //pt->mBreakBgnPrice = chk_price; →　バグっぽい
            //SetObjectValue(0, chk_price, initValue);
            this.m_entry = 0;
            this.m_lastEntry = 0;
            //m_data.ClearPriceRange();
            bgnix++;
        } else if (bgnix < this.m_lastEntry) {
            // 処理済エントリより下降した場合はエラーリターン
            return false;
        } else if (bgnix === this.m_lastEntry) {
            // 更新前変数復元
            chk_price = this.m_backChkPrice;	//転換判定用値段
            direction = this.m_backDirection;	//1:上昇方向 2:下降方向
            opn_ix = this.m_backOpen_ix;	//開始エントリ
        } else { //(m_LastEntry < bgnix)
            // 前回変数復元
            chk_price = this.m_workChkPrice;	//転換判定用値段
            direction = this.m_workDirection;	//1:上昇方向 2:下降方向
            opn_ix = this.m_workOpen_ix;	//開始エントリ
            this.m_backChkPrice = this.m_workChkPrice;
            this.m_backChkPrice = this.m_workDirection;
            this.m_backOpen_ix = this.m_workOpen_ix;
        }

        // ２エントリ目から開始
        for (let i = bgnix; i < entry; ++i) {
            pt = list[i];
            // 初期の方向判定
            if (direction == 0) {
                if (chk_price < pt.mClosePrice) {
                    direction = 1;	//上昇方向
                } else if (pt.mClosePrice < chk_price) {
                    direction = 2;	//下降方向
                } else {
                    continue;
                }
            }

            if (chk_price < pt.mClosePrice) {
                if (direction === 1) {
                    //順方向新値
                    let open_pt = list[opn_ix];
                    this.setObjectValue(chk_price, pt.mClosePrice, open_pt.mDate + ' ' + open_pt.mTime, pt.mDate + ' ' + pt.mTime);
                    this.m_tbrk.addPrvPrice(prv_high, prv_low, chk_price, pt.mClosePrice);
                    chk_price = pt.mClosePrice;
                    opn_ix = i;
                } else {
                    if (this.m_tbrk.checkReverseUp(prv_high, pt.mClosePrice)) {
                        //逆方向(陽転)確定
                        //始値は直近エントリの高値を採用
                        let open_pt = list[opn_ix];
                        this.setObjectValue(prv_high[prm - 1], pt.mClosePrice, open_pt.mDate + ' ' + open_pt.mTime, pt.mDate + ' ' + pt.mTime);
                        this.m_tbrk.addPrvPrice(prv_high, prv_low, prv_high[prm - 1], pt.mClosePrice);
                        chk_price = pt.mClosePrice;
                        direction = 1;
                        opn_ix = i;
                    }
                }
            } else if (pt.mClosePrice < chk_price) {
                if (direction === 2) {
                    //順方向新値
                    let open_pt = list[opn_ix];
                    this.setObjectValue(chk_price, pt.mClosePrice, open_pt.mDate + ' ' + open_pt.mTime, pt.mDate + ' ' + pt.mTime);
                    this.m_tbrk.addPrvPrice(prv_high, prv_low, chk_price, pt.mClosePrice);
                    chk_price = pt.mClosePrice;
                    opn_ix = i;
                } else {
                    if (this.m_tbrk.checkReverseDown(prv_low, pt.mClosePrice)) {
                        //逆方向(陰転)確定
                        //始値は直近エントリの安値を採用
                        let open_pt = list[opn_ix];
                        this.setObjectValue(prv_low[prm - 1], pt.mClosePrice, open_pt.mDate + ' ' + open_pt.mTime, pt.mDate + ' ' + pt.mTime);
                        this.m_tbrk.addPrvPrice(prv_high, prv_low, prv_low[prm - 1], pt.mClosePrice);
                        chk_price = pt.mClosePrice;
                        direction = 2;
                        opn_ix = i;
                    }
                }
            }
        }
        this.m_lastEntry = entry - 1;
        this.m_workChkPrice = chk_price;
        this.m_workDirection = direction;
        this.m_workOpen_ix = opn_ix;
        return true;
    }
    setObjectValue(bgn, end, bgnDate, endDate) {
        this.m_data[TI_BRK_BGN].push(bgn);
        this.m_data[TI_BRK_END].push(end);
        this.m_data[TI_BRK_BGN_DATE].push(bgnDate);
        this.m_data[TI_BRK_END_DATE].push(endDate);
    }
    getPriceRange(bgnIndex, dispEntryCnt) {
        let maxValue = 0, minValue = 0;
        let endCount = bgnIndex + dispEntryCnt;
        if(this.m_data[0].length < endCount){
            endCount = this.m_data[0].length;
        }
        for (let i = 0; i < 2; ++i) {
            for (let j = bgnIndex; j < endCount; ++j) {
                if (this.m_data[i][j] <= 0) continue;
                if (maxValue < this.m_data[i][j]) {
                    maxValue = this.m_data[i][j];
                }
                if (this.m_data[i][j] < minValue || 0 === minValue) {
                    minValue = this.m_data[i][j];
                }
            }
        }
        return [maxValue, minValue];
    }
}
//--------------------------------------------------------------------
// [TBRK] RECORD PRICE CHART BY TIME
//--------------------------------------------------------------------
export const TI_TBRK_BGN = 0;
export const TI_TBRK_END = 1;
export const TI_TBRK_MAX = 2;
export class ChartTechTBRK extends ChartTech {
	constructor() {
        super();
        this.m_prm_num = CTP.PRM_TBRK_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        this.m_workChkPrice = 0;	// 転換判定用値段
        this.m_workDirection = 0;	// 1:上昇方向 2:下降方向
        this.m_backChkPrice = 0;	// 退避情報(確定済)転換判定用値段
        this.m_backDirection = 0;	// 退避情報(確定済)1:上昇方向 2:下降方向
        this.m_lastEntry = 0;		// 処理済エントリ
        this.m_data = new Array(TI_TBRK_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (n1) {
        this.m_prm[CTP.PRM_TBRK] = super.chkNumParam(n1);
        return true;
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

        const prm = this.m_prm[CTP.PRM_TBRK];
        let prv_high = new Array(TI_TBRK_MAX);
        let prv_low = new Array(TI_TBRK_MAX);
        let chk_price = 0.0;

        // ★★更新の場合の変数の退避が全く行われてない

        let direction = 0;	//1:上昇方向 2:下降方向
        let initValue = 0.0;
        //開始インデックス
        let bgnix = target_ix;
        if (bgnix == 0) {
            //pt->mBreakBgnPrice = chk_price; →　バグっぽい
            this.setObjectValue(0, chk_price, initValue);
            this.m_lastEntry = 0;
            // エントリ開始位置検索
            for (let i = 0; i < entry; ++i) {
                if (0 < list[i].mClosePrice) {
                    // 有効エントリ開始位置検出
                    bgnix = i + 1;
                    // 開始エントリ終値を基準として採用
                    chk_price = list[i].mClosePrice;
                    break;
                }
            }
            if (bgnix == 0) {
                return true;
            }
            this.clearPrvPrice(prv_high, prv_low);
            this.addPrvPrice(prv_high, prv_low, chk_price, chk_price);
        } else if (bgnix < this.m_lastEntry) {
            //処理済エントリより下降した場合はエラーリターン
            return false;
        } else if (bgnix == this.m_lastEntry) {
            //更新前変数復元
            chk_price = this.m_backChkPrice;	// 転換判定用値段
            direction = this.m_backDirection;	// 1:上昇方向 2:下降方向
        } else { //(m_LastEntry < bgnix)
            //前回変数復元
            chk_price = this.m_workChkPrice;	// 転換判定用値段
            direction = this.m_workDirection;	// 1:上昇方向 2:下降方向
            this.m_backChkPrice = this.m_workChkPrice;
            this.m_backChkPrice = this.m_workDirection;
        }

        // ２エントリ目から開始
        for (let i = bgnix; i < entry; ++i) {
            let pt = list[i];
            // 初期の方向判定
            if (direction == 0) {
                if (chk_price < pt.mClosePrice) {
                    direction = 1;	//上昇方向
                } else if (pt.mClosePrice < chk_price) {
                    direction = 2;	//下降方向
                } else {
                    this.setObjectValue(i, initValue, initValue);
                    continue;
                }
            }
            if (chk_price < pt.mClosePrice) {
                if (direction == 1) {
                    //順方向新値
                    this.setObjectValue(i, chk_price, pt.mClosePrice);
                    this.addPrvPrice(prv_high, prv_low, chk_price, pt.mClosePrice);
                    chk_price = pt.mClosePrice;
                } else {
                    if (this.checkReverseUp(prv_high, pt.mClosePrice)) {
                        //逆方向(陽転)確定
                        //始値は直近エントリの高値を採用
                        this.setObjectValue(i, prv_high[prm - 1], pt.mClosePrice);
                        this.addPrvPrice(prv_high, prv_low, prv_high[prm - 1], pt.mClosePrice);
                        chk_price = pt.mClosePrice;
                        direction = 1;
                    } else {
                        this.setObjectValue(i, initValue, initValue);
                    }
                }
            } else if (pt.mClosePrice < chk_price) {
                if (direction == 2) {
                    //順方向新値
                    this.setObjectValue(i, chk_price, pt.mClosePrice);
                    this.addPrvPrice(prv_high, prv_low, chk_price, pt.mClosePrice);
                    chk_price = pt.mClosePrice;
                } else {
                    if (this.checkReverseDown(prv_low, pt.mClosePrice)) {
                        //逆方向(陰転)確定
                        //始値は直近エントリの安値を採用
                        this.setObjectValue(i, prv_low[prm - 1], pt.mClosePrice);
                        this.addPrvPrice(prv_high, prv_low, prv_low[prm - 1], pt.mClosePrice);
                        chk_price = pt.mClosePrice;
                        direction = 2;
                    } else {
                        this.setObjectValue(i, initValue, initValue);
                    }
                }
            } else {
                this.setObjectValue(i, initValue, initValue);
            }
        }
        this.m_lastEntry = entry - 1;
        this.m_workChkPrice = chk_price;
        this.m_workDirection = direction;

        return true;
    }
    addPrvPrice(prv_high, prv_low, addval_1, addval_2) {
        let upper = 0.0;
        let lower = 0.0;
        let max = this.m_prm[CTP.PRM_TBRK] - 1;
        if (addval_1 < addval_2) {
            upper = addval_2;
            lower = addval_1;
        } else {
            upper = addval_1;
            lower = addval_2;
        }
        for (let i = 0; i < max; i++) {
            prv_high[i] = prv_high[i + 1];
        }
        prv_high[max] = upper;

        for (let i = 0; i < max; i++) {
            prv_low[i] = prv_low[i + 1];
        }
        prv_low[max] = lower;
    }
    clearPrvPrice(prv_high, prv_low) {
        prv_high.fill(0.0);
        prv_low.fill(0.0);
    }
    checkReverseUp(prv_high, price) {
        let high = 0.0;
        for (let i = 0; i < this.m_prm[CTP.PRM_TBRK]; i++) {
            if (high < prv_high[i]) {
                high = prv_high[i];
            }
        }
        if (high < price) {
            return true;
        }
        return false;
    }
    checkReverseDown(prv_low, price) {
        let low = 9999999999.0;
        for (let i = 0; i < this.m_prm[CTP.PRM_TBRK]; i++) {
            if (prv_low[i] < low && 0.0 < prv_low[i]) {
                low = prv_low[i];
            }
        }
        if (price < low) {
            return true;
        }
        return false;
    }
    setObjectValue(ix, bgn, end) {
        let wk_value = new Array(TI_TBRK_MAX);
        wk_value[TI_TBRK_BGN] = bgn;
        wk_value[TI_TBRK_END] = end;
        super.set(ix, wk_value, this.m_data, TI_TBRK_MAX);
    }
}
//--------------------------------------------------------------------
// [KAGI] KAGI CHART BY TIME
//--------------------------------------------------------------------
export const TI_KAGI_OPEN = 0;
export const TI_KAGI_CLOSE = 1;
export const TI_KAGI_OPEN_DATE = 2;
export const TI_KAGI_CLOSE_DATE = 3;
export const TI_KAGI_MAX = 4;
const KAGI_RATE_MULTI = 100;
export class ChartTechKAGI extends ChartTech {
    constructor() {
        super();
        this.m_prm_num = CTP.PRM_KAGI_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        // 退避情報(確定前)
        this.m_workOpnPrice;		// 転換開始値段
        this.m_workChkPrice = 0;	// 転換判定用値段
        this.m_workDirection = 0;	// 1:上昇方向 2:下降方向
        this.m_workOpenDate = 0;	// 転換開始日時
        // 退避情報(確定済)
        this.m_backOpnPrice = 0;	// 転換開始値段
        this.m_backChkPrice = 0;	// 転換判定用値段
        this.m_backDirection = 0;   // 1:上昇方向 2:下降方向
        this.m_backOpenDate = 0;	// 転換開始日時
        this.m_lastEntry = 0;		// 処理済エントリ
        this.m_data = new Array(TI_KAGI_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
        this.m_data[TI_KAGI_OPEN].max = 0;
        this.m_data[TI_KAGI_OPEN].min = 0;
    }
    setParameter(n1) {
        if(0 < n1){
            this.m_prm[CTP.PRM_KAGI] = n1 / KAGI_RATE_MULTI;
        }
        return true;
    }
    getSize() {
        return this.m_data[TI_KAGI_OPEN].length;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

        //開始エントリ終値を基準として採用
        let opnPrice = 0.0;
        let chk_price = 0.0;
        let opnDateTime = '';
        let direction = 0;	//1:上昇方向 2:下降方向

        //開始インデックス
        let bgnix = target_ix;
        if(bgnix === 0){
            this.m_lastEntry = 0;
            this.m_data[TI_KAGI_OPEN].max = 0;
            this.m_data[TI_KAGI_OPEN].min = 0;
            // エントリ開始位置検索
            for(let i = 0; i < entry; ++i){
                if(0 < list[i].mClosePrice){
                    // 有効エントリ開始位置検出
                    bgnix = i + 1;
                    chk_price = list[i].mClosePrice;
                    break;
                }
            }
            if(bgnix == 0){
                return true;
            }
        }else if(bgnix < this.m_lastEntry){
            // 処理済エントリより下降した場合はエラーリターン
            return false;
        }else if(bgnix === this.m_lastEntry){
            // 更新前変数復元
            opnPrice	= this.m_backOpnPrice;	//転換開始値段
            chk_price	= this.m_backChkPrice;	//転換判定用値段
            direction	= this.m_backDirection;	//1:上昇方向 2:下降方向
            opnDateTime = this.m_backOpenDate;	//転換開始日時
        }else{ // (this.m_lastEntry < bgnix)
            // 前回変数復元
            opnPrice	= this.m_workOpnPrice;	//転換開始値段
            chk_price	= this.m_workChkPrice;	//転換判定用値段
            direction	= this.m_workDirection;	//1:上昇方向 2:下降方向
            opnDateTime = this.m_workOpenDate;	//転換開始日時
            this.m_backOpnPrice	= this.m_workOpnPrice;
            this.m_backChkPrice	= this.m_workChkPrice;
            this.m_backDirection= this.m_workDirection;
            this.m_backOpenDate = this.m_WorkOpenDate;
        }

        // 検出位置から開始
        for(let i = bgnix; i < entry; ++i){
            let pt = list[i];
            // エントリ初期化
            //his.setValue(0, -1, 0.0);
            //初期の方向判定
            if(direction == 0){
                if(chk_price < pt.mClosePrice){
                    direction = 1;	//上昇方向
                }else if(pt.mClosePrice < chk_price){
                    direction = 2;	//下降方向
                }else{
                    continue;
                }
            }
            let chk_uptrend = chk_price * (KAGI_RATE_MULTI + this.m_prm[CTP.PRM_KAGI]) / KAGI_RATE_MULTI;
            let chk_downtrend = chk_price * (KAGI_RATE_MULTI - this.m_prm[CTP.PRM_KAGI]) / KAGI_RATE_MULTI;

            if(direction === 1){
                if(chk_price < pt.mClosePrice){
                    // 同方向高値更新
                    chk_price = pt.mClosePrice;
                }
            }else if(direction === 2){
                if(pt.mClosePrice < chk_price){
                    // 同方向安値更新
                    chk_price = pt.mClosePrice;
                }
            }
            
            let update = false;
            if(chk_uptrend <= pt.mClosePrice){
                if(direction === 2){
                    // 反転処理
                    const curDateTime = pt.mDate + ' ' + pt.mTime;
                    if(target_ix <= i){
                        this.setValue(opnPrice, chk_price, opnDateTime, curDateTime);	//データ更新
                        update = true;
                    }
                    opnPrice = chk_price;
                    chk_price = pt.mClosePrice;
                    opnDateTime = curDateTime;
                    direction = 1;
                }
            }else if(pt.mClosePrice <= chk_downtrend){
                if(direction === 1){
                    // 反転処理
                    const curDateTime = pt.mDate + ' ' + pt.mTime;
                    if(target_ix <= i){
                        this.setValue(opnPrice, chk_price, opnDateTime, curDateTime);	//データ更新
                        update = true;
                    }
                    opnPrice = chk_price;
                    chk_price = pt.mClosePrice;
                    opnDateTime = curDateTime;
                    direction = 2;
                }
            }
            // 最終エントリ判定
            if (i + 1 === entry) {
                if(!update){
                    // 現在の状態で仮更新
                    //if(0 < i){
                        //m_data.Set(i, open_ix, i, chk_price, opnDateTime, pt->m_Date);
                    //}
                }
            }
        }
        //次回更新用変数退避
        this.m_lastEntry = entry - 1;
        this.m_workOpnPrice = opnPrice;		// 転換開始値段
        this.m_workChkPrice = chk_price;	// 転換判定用値段
        this.m_workDirection= direction;	// 1:上昇方向 2:下降方向
        return true;
    }
    setValue(open, close, openDate, closeDate) {
        this.m_data[TI_KAGI_OPEN].push(open);
        this.m_data[TI_KAGI_CLOSE].push(close);
        this.m_data[TI_KAGI_OPEN_DATE].push(openDate);
        this.m_data[TI_KAGI_CLOSE_DATE].push(closeDate);

        let value = open;
        if(this.m_data[TI_KAGI_OPEN].max < value){
            this.m_data[TI_KAGI_OPEN].max = value;
        }
        if(value < this.m_data[TI_KAGI_OPEN].min || 0 === this.m_data[TI_KAGI_OPEN].min){
            this.m_data[TI_KAGI_OPEN].min = value;
        } 
        value = close;
        if(this.m_data[TI_KAGI_OPEN].max < value){
            this.m_data[TI_KAGI_OPEN].max = value;
        }
        if(value < this.m_data[TI_KAGI_OPEN].min || 0 === this.m_data[TI_KAGI_OPEN].min){
            this.m_data[TI_KAGI_OPEN].min = value;
        } 

    }
    getPriceRange(bgnIndex, dispEntryCnt) {
        let maxValue = 0, minValue = 0;
        let endCount = bgnIndex + dispEntryCnt;
        if(this.m_data[0].length < endCount){
            endCount = this.m_data[0].length;
        }
        for (let i = 0; i < 2; ++i) {
            for (let j = bgnIndex; j < endCount; ++j) {
                if (this.m_data[i][j] <= 0) continue;
                if (maxValue < this.m_data[i][j]) {
                    maxValue = this.m_data[i][j];
                }
                if (this.m_data[i][j] < minValue || 0 === minValue) {
                    minValue = this.m_data[i][j];
                }
            }
        }
        return [maxValue, minValue];
    }
}
//--------------------------------------------------------------------
// [TKAGI] KAGI CHART BY TIME
//--------------------------------------------------------------------
export const TI_TKAGI_BGN = 0;
export const TI_TKAGI_END = 1;
export const TI_TKAGI_HL = 2;
export const TI_TKAGI_MAX = 3;
export class ChartTechTKAGI extends ChartTech {
    constructor() {
        super();
        this.m_prm_num = CTP.PRM_TKAGI_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        // 退避情報(確定前)
        this.m_workOpnPrice;		// 転換開始値段
        this.m_workChkPrice = 0;	// 転換判定用値段
        this.m_workOpen_ix = 0;		// カギ開始エントリ
        this.m_workDirection = 0;	// 1:上昇方向 2:下降方向
        // 退避情報(確定済)
        this.m_backOpnPrice = 0;	// 転換開始値段
        this.m_backChkPrice = 0;	// 転換判定用値段
        this.m_backOpen_ix = 0;	    // カギ開始エントリ
        this.m_backDirection = 0;   // 1:上昇方向 2:下降方向
        this.m_lastEntry = 0;		// 処理済エントリ
        this.m_data = new Array(TI_TKAGI_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
        this.m_data[TI_TKAGI_HL].max = 0;
        this.m_data[TI_TKAGI_HL].min = 0;
    }
    setParameter(n1) {
        if(0 < n1){
            this.m_prm[CTP.PRM_TKAGI] = n1 / KAGI_RATE_MULTI;
        }
        return true;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

        //開始エントリ終値を基準として採用
        let opnPrice = 0.0;
        let chk_price = 0.0;
        let open_ix = 0;	//カギ開始エントリ
        let direction = 0;	//1:上昇方向 2:下降方向

        //開始インデックス
        let bgnix = target_ix;
        if(bgnix === 0){
            this.m_lastEntry = 0;
            this.m_data[TI_TKAGI_HL].max = 0;
            this.m_data[TI_TKAGI_HL].min = 0;
            // エントリ開始位置検索
            for(let i = 0; i < entry; ++i){
                if(0 < list[i].mClosePrice){
                    // 有効エントリ開始位置検出
                    open_ix = i;
                    bgnix = i + 1;
                    chk_price = list[i].mClosePrice;
                    break;
                }
            }
            if(bgnix == 0){
                return true;
            }
        }else if(bgnix < this.m_lastEntry){
            // 処理済エントリより下降した場合はエラーリターン
            return false;
        }else if(bgnix === this.m_lastEntry){
            // 更新前変数復元
            opnPrice	= this.m_backOpnPrice;	//転換開始値段
            chk_price	= this.m_backChkPrice;	//転換判定用値段
            open_ix		= this.m_backOpen_ix;	//カギ開始エントリ
            direction	= this.m_backDirection;	//1:上昇方向 2:下降方向
        }else{ // (this.m_lastEntry < bgnix)
            // 前回変数復元
            opnPrice	= this.m_workOpnPrice;	//転換開始値段
            chk_price	= this.m_workChkPrice;	//転換判定用値段
            open_ix		= this.m_workOpen_ix;	//1:上昇方向 2:下降方向
            direction	= this.m_workDirection;	//1:上昇方向 2:下降方向
            this.m_backOpnPrice	= this.m_workOpnPrice;
            this.m_backChkPrice	= this.m_workChkPrice;
            this.m_backOpen_ix	= this.m_workOpen_ix;
            this.m_backDirection= this.m_workDirection;
        }

        // ２エントリ目から開始
        for(let i = bgnix; i < entry; ++i){
            let pt = list[i];
            // エントリ初期化
            this.setValue(i, 0, -1, 0.0);
            //初期の方向判定
            if(direction == 0){
                if(chk_price < pt.mClosePrice){
                    direction = 1;	//上昇方向
                }else if(pt.mClosePrice < chk_price){
                    direction = 2;	//下降方向
                }else{
                    continue;
                }
            }
            let chk_uptrend = chk_price * (KAGI_RATE_MULTI + this.m_prm[CTP.PRM_TKAGI]) / KAGI_RATE_MULTI;
            let chk_downtrend = chk_price * (KAGI_RATE_MULTI - this.m_prm[CTP.PRM_TKAGI]) / KAGI_RATE_MULTI;

            if(direction == 1){
                if(chk_price < pt.mClosePrice){
                    // 同方向高値更新
                    chk_price = pt.mClosePrice;
                }
            }else if(direction == 2){
                if(pt.mClosePrice < chk_price){
                    // 同方向安値更新
                    chk_price = pt.mClosePrice;
                }
            }
            
            let update = false;
            if(chk_uptrend <= pt.mClosePrice){
                if(direction == 2){
                    // 反転処理
                    if(target_ix <= i){
                        this.setValue(i, open_ix, i, chk_price);	//データ更新
                        update = true;
                    }
                    for(let j = open_ix, size = this.m_data[TI_TKAGI_HL].length; j < size; j++){ 
                        this.m_data[TI_TKAGI_HL][j] = chk_price;
                    }
                    opnPrice = chk_price = pt.mClosePrice;
                    open_ix = i;
                    direction = 1;
                }
            }else if(pt.mClosePrice <= chk_downtrend){
                if(direction == 1){
                    //反転処理
                    if(target_ix <= i){
                        this.setValue(i, open_ix, i, chk_price);	//データ更新
                        update = true;
                    }
                    for(let j = open_ix, size = this.m_data[0].length; j < size; j++){ 
                        this.m_data[TI_TKAGI_HL][j] = chk_price;
                    }
                    opnPrice = chk_price = pt.mClosePrice;
                    open_ix = i;
                    direction = 2;
                }
            }
            // 最終エントリ判定
            if (i + 1 === entry) {
                if(!update){
                    // 現在の状態で仮更新
                    //if(0 < i){
                        //m_data.Set(i, open_ix, i, chk_price);
                    //}
                }
            }
        }
        //次回更新用変数退避
        this.m_lastEntry = entry - 1;
        this.m_workOpnPrice = opnPrice;		// 転換開始値段
        this.m_workChkPrice = chk_price;	// 転換判定用値段
        this.m_workOpen_ix  = open_ix;		// カギ開始エントリ
        this.m_workDirection= direction;	// 1:上昇方向 2:下降方向
        return true;
    }
    setValue(ix, open_ix, rev_ix, value) {
        this.m_data[TI_TKAGI_BGN][ix] = open_ix;
        this.m_data[TI_TKAGI_END][ix] = rev_ix;
        this.m_data[TI_TKAGI_HL][ix] = value;       
        if(this.m_data[TI_TKAGI_HL].max < value){
            this.m_data[TI_TKAGI_HL].max = value;
        }
        if(value < this.m_data[TI_TKAGI_HL].min || 0 === this.m_data[TI_TKAGI_HL].min){
            this.m_data[TI_TKAGI_HL].min = value;
        }   
    }
}
//--------------------------------------------------------------------
// [PF] POINT & FIGURE
//--------------------------------------------------------------------
export const TI_PF_OPEN = 0;
export const TI_PF_CLOSE = 1;
export const TI_PF_OPEN_DATE = 2;
export const TI_PF_CLOSE_DATE = 3;
export const TI_PF_MAX = 4;
export class ChartTechPF extends ChartTech {
    constructor() {
        super();
        this.m_prm_num = CTP.PRM_PF_MAX;
        this.m_prm = new Array(this.m_prm_num);
        this.m_prm.fill(0);
        // 退避情報(確定前)
        this.m_workOpnPrice;		// 転換開始値段
        this.m_workChkPrice = 0;	// 転換判定用値段
        this.m_workDirection = 0;	// 1:上昇方向 2:下降方向
        this.m_workOpenDate = 0;	// 転換開始日時
        // 退避情報(確定済)
        this.m_backOpnPrice = 0;	// 転換開始値段
        this.m_backChkPrice = 0;	// 転換判定用値段
        this.m_backDirection = 0;   // 1:上昇方向 2:下降方向
        this.m_backOpenDate = 0;	// 転換開始日時
        this.m_lastEntry = 0;		// 処理済エントリ
        this.m_data = new Array(TI_PF_MAX);
        for (let i = 0; i < this.m_data.length; i++) {
            this.m_data[i] = [];
        }
        this.m_data[TI_PF_OPEN].max = 0;
        this.m_data[TI_PF_OPEN].min = 0;
    }
    setParameter(n1, n2) {
        this.m_prm[CTP.PRM_PF_NUM] = n1; // 転換枠数
        this.m_prm[CTP.PRM_PF_RNG] = n2; // 1枠値幅([0]の場合はデフォルト価格テーブル)
        return true;
    }
    getSize() {
        return this.m_data[TI_PF_OPEN].length;
    }
    setIndexValueToObj(list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj(list, target_ix) {
        let entry = list.length;
        if (entry === 0) return false;

        //開始エントリ終値を基準として採用
        let opnPrice = 0.0;
        let chk_price = 0.0;
        let opnDateTime = '';
        let direction = 0;	//1:上昇方向 2:下降方向

        //開始インデックス
        let bgnix = target_ix;
        if(bgnix === 0){
            this.m_lastEntry = 0;
            this.m_data[TI_PF_OPEN].max = 0;
            this.m_data[TI_PF_OPEN].min = 0;
            bgnix++;
        }else if(bgnix < this.m_lastEntry){
            // 処理済エントリより下降した場合はエラーリターン
            return false;
        }else if(bgnix === this.m_lastEntry){
            // 更新前変数復元
            opnPrice	= this.m_backOpnPrice;	// 転換開始値段
            chk_price	= this.m_backChkPrice;	// 転換判定用値段
            direction	= this.m_backDirection;	// 1:上昇方向 2:下降方向
            opnDateTime = this.m_backOpenDate;	// 転換開始日時
        }else{ // (this.m_lastEntry < bgnix)
            // 前回変数復元
            opnPrice	= this.m_workOpnPrice;	// 転換開始値段
            chk_price	= this.m_workChkPrice;	// 転換判定用値段
            direction	= this.m_workDirection;	// 1:上昇方向 2:下降方向
            opnDateTime = this.m_workOpenDate;	// 転換開始日時
            this.m_backOpnPrice	= this.m_workOpnPrice;
            this.m_backChkPrice	= this.m_workChkPrice;
            this.m_backOpen_ix	= this.m_workOpen_ix;
            this.m_backDirection= this.m_workDirection;
        }
        //２エントリ目から開始
        for(let i = bgnix; i < entry; ++i){
            let pt = list[i];
            //エントリ初期化
            let unit_range = this.getUnitRange(pt.mClosePrice);
            //初期の方向判定
            if(direction == 0){
                if(chk_price < pt.mClosePrice){
                    direction = 1;	//上昇方向
                }else if(pt.mClosePrice < chk_price){
                    direction = 2;	//下降方向
                }else{
                    continue;
                }
            }

            if(unit_range <= 0){
                continue;
            }
            let chk_uptrend   = chk_price + (this.m_prm[CTP.PRM_PF_NUM] * unit_range);
            let chk_downtrend = chk_price - (this.m_prm[CTP.PRM_PF_NUM] * unit_range);
            if(direction == 1){
                if(chk_price < pt.mClosePrice){
                    //同方向高値更新
                    chk_price = ((pt.mClosePrice / unit_range) * unit_range) >> 0;
                }else if(pt.mClosePrice <= chk_downtrend){
                    //反転処理
                    let clsPrice = chk_price;
                    if(target_ix <= i && opnPrice != 0.0){
                        //データ更新
                        this.setValue(opnPrice, clsPrice, opnDateTime, pt.mDate + ' ' + pt.mTime);
                    }
                    opnPrice  = clsPrice - unit_range;
                    let sup = (pt.mClosePrice % unit_range) >> 0;
                    if(sup == 0){
                        chk_price = ((pt.mClosePrice / unit_range) * unit_range) >> 0;
                    }else{
                        chk_price = ((pt.mClosePrice / unit_range) * unit_range + unit_range) >> 0;
                    }
                    opnDateTime = pt.mDate + ' ' + pt.mTime;
                    direction = 2;
                }
            }else if(direction == 2){
                if(pt.mClosePrice < chk_price){
                    //同方向安値更新
                    let sup = (pt.mClosePrice % unit_range) >> 0;
                    if (sup == 0) {
                        chk_price = ((pt.mClosePrice / unit_range) * unit_range) >> 0;
                    } else {
                        chk_price = ((pt.mClosePrice / unit_range) * unit_range + unit_range) >> 0;
                    }
                }else if(chk_uptrend <= pt.mClosePrice){
                    //反転処理
                    let clsPrice = chk_price;
                    if (target_ix <= i && opnPrice != 0.0) {
                        //データ更新
                        this.setValue(opnPrice, clsPrice, opnDateTime, pt.mDate + ' ' + pt.mTime);
                    }
                    opnPrice  = clsPrice + unit_range;
                    chk_price = ((pt.mClosePrice / unit_range) * unit_range) >> 0;
                    opnDateTime = pt.mDate + ' ' + pt.mTime;
                    direction = 1;
                }
            }
        }
        //次回更新用変数退避
        this.m_lastEntry = entry - 1;
        this.m_workOpnPrice = opnPrice;		//転換開始値段
        this.m_workChkPrice = chk_price;		//転換判定用値段
        this.m_WorkDirection = direction;		//1:上昇方向 2:下降方向
        this.m_WorkOpenDate = opnDateTime;	//転換開始日時
        return true;
    }
    setValue(open, close, openDate, closeDate) {
        this.m_data[TI_PF_OPEN].push(open);
        this.m_data[TI_PF_CLOSE].push(close);
        this.m_data[TI_PF_OPEN_DATE].push(openDate);
        this.m_data[TI_PF_CLOSE_DATE].push(closeDate);

        let value = open;
        if(this.m_data[TI_PF_OPEN].max < value){
            this.m_data[TI_PF_OPEN].max = value;
        }
        if(value < this.m_data[TI_PF_OPEN].min || 0 === this.m_data[TI_PF_OPEN].min){
            this.m_data[TI_PF_OPEN].min = value;
        } 
        value = close;
        if(this.m_data[TI_PF_OPEN].max < value){
            this.m_data[TI_PF_OPEN].max = value;
        }
        if(value < this.m_data[TI_PF_OPEN].min || 0 === this.m_data[TI_PF_OPEN].min){
            this.m_data[TI_PF_OPEN].min = value;
        } 

    }
    getPriceRange(bgnIndex, dispEntryCnt) {
        let maxValue = 0, minValue = 0;
        let endCount = bgnIndex + dispEntryCnt;
        if(this.m_data[0].length < endCount){
            endCount = this.m_data[0].length;
        }
        for (let i = 0; i < 2; ++i) {
            for (let j = bgnIndex; j < endCount; ++j) {
                if (this.m_data[i][j] <= 0) continue;
                if (maxValue < this.m_data[i][j]) {
                    maxValue = this.m_data[i][j];
                }
                if (this.m_data[i][j] < minValue || 0 === minValue) {
                    minValue = this.m_data[i][j];
                }
            }
        }
        return [maxValue, minValue];
    }
    getUnitRange(price) {
        if(this.m_prm[CTP.PRM_PF_RNG] != 0){
            // 株価チェックか％にする
            return this.m_prm[CTP.PRM_PF_RNG];
        }
        if(price < 500){
            return 20;
        }else if(price < 1000){
            return 20;
        }else if(price <= 3000){
            return 20;
        }else if(price <= 5000){
            return 20;
            //return 50;
        }else if(price <= 10000){
            return 100;
        }else if(price <= 30000){
            return 200;
        }else if(price <= 50000){
            return 500;
        }else if(price <= 100000){
            return 1000;
        }else if(price <= 300000){
            return 2000;
        }else if(price <= 500000){
            return 5000;
        }else if(price <= 1000000){
            return 10000;
        }else if(price <= 3000000){
            return 20000;
        }else if(price <= 5000000){
            return 50000;
        }else if(price <= 10000000){
            return 100000;
        }else if(price <= 30000000){
            return 200000;
        }else if(price <= 50000000){
            return 500000;
        }else if(price <= 100000000){
            return 1000000;
        }else if(price <= 300000000){
            return 2000000;
        }else if(price <= 500000000){
            return 5000000;
        }
        return 10000000;
    }
    /*
    int TICalcPF::GetUnitRange(const double& price)
    {
        if(m_prm_range != 0){
            //株価チェックか％にする
            return m_prm_range;
        }
        if(price < 500){
            return 1;
        }else if(price < 1000){
            return 2;
        }else if(price <= 3000){
            return 2;
        }else if(price <= 5000){
            return 5;
        }else if(price <= 10000){
            return 10;
        }else if(price <= 30000){
            return 20;
        }else if(price <= 50000){
            return 50;
        }else if(price <= 100000){
            return 100;
        }else if(price <= 300000){
            return 200;
        }else if(price <= 500000){
            return 500;
        }else if(price <= 1000000){
            return 1000;
        }else if(price <= 3000000){
            return 2000;
        }else if(price <= 5000000){
            return 5000;
        }else if(price <= 10000000){
            return 10000;
        }else if(price <= 30000000){
            return 20000;
        }else if(price <= 50000000){
            return 50000;
        }else if(price <= 100000000){
            return 100000;
        }else if(price <= 300000000){
            return 200000;
        }else if(price <= 500000000){
            return 500000;
        }
        return 1000000;
    }
    */
    /*
    ポイントアンドフィグア前日終値ベース
    ～1000以下 1 
    1,001～3,000 2 
    3,001～5,000 5 
    5,001～10,000 10 
    10,001～30,000 20 
    30,001～50,000 50 
    50,001～100,000 100 
    100,001～300,000 200 
    300,001～500,000 500 
    500,001～1,000,000 1,000 
    1,000,001～3,000,000 2,000 
    3,000,001～5,000,000 5,000 
    5,000,001～10,000,000 10,000 
    10,000,001～30,000,000 20,000 
    30,000,001～50,000,000 50,000 
    50,000,001～ 1000,000 
    
    */
    /*
    【m = 0.2%の例】
    http://trade.okasan-online.rich-direct.jp/chart_help/frame.html
    500円未満 … 1円
    500円以上1000円未満 … 2円
    1000円以上5000円未満 … 10円
    5000円以上1万円未満 … 20円
    
     転換ポイントnは3が一般的ですが短期の場合枠数を2、1とすることもあります。
    1ポイントの価格幅または比率が小さいほど短期売買向け、大きいほど長期売買向けとなります。
    */
}