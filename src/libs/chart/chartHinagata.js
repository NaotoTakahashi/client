'use strict';
import ChartCanvas from './chartCanvas';

class ChartXXXXX {
	constructor() {
    }
    init () {
    }
}

export default ChartXXXXX;


class ChartTechSxxxx extends ChartTech {
	constructor() {
        super(CTP.PRM_SMA_MAX);
        this.m_size = CTP.PRM_SMA_MAX;
        this.m_prm = new Array(this.m_size);
        this.m_prm.fill(0);
        this.m_data = new Array(this.m_size);
        for (let i = 0; i < this.m_data.length; i++) {
             this.m_data[i] = [];
        }
    }
    setParameter (n1, n2, n3 = 0) {
        this.m_prm[0] = n1;
        this.m_prm[1] = n2;
        this.m_prm[2] = n3;
        if(n3 == 0) {
            this.m_size = 2;
        }
    }
    setIndexValueToObj (list, ix = 0) {
        this.updateIndexValueToObj(list, ix);
    }
    updateIndexValueToObj (list, target_ix) {
        
        if (bgnix != 0) {
            var startEntryIdx = bgnix - maxPrm;
            for (var i = startEntryIdx; i < bgnix; i++) {
                var pt = list[i];
                if (i == startEntryIdx) {
                    if (i == 0) {
                        wPrevPrice = pt.mClosePrice;
                        value1[i] = 0;
                        value2[i] = 0;
                        continue;
                    } else {
                        var prev = list[i-1];
                        wPrevPrice = prev.mClosePrice;
                    }
                }
                wLastPrice = pt.mClosePrice;
                var gap = wLastPrice - wPrevPrice;
                if (0 < gap) {           //上昇
                    value1[i] = gap;
                    value2[i] = 0;
                } else if (gap < 0) {    //下落
                    value1[i] = 0;
                    value2[i] = Math.abs(gap);
                } else {
                    value1[i] = 0;
                    value2[i] = 0;
                }
                wPrevPrice = pt.mClosePrice;
            }
        }
        //UPDATE処理
        for (var i = bgnix; i < entry; i++) {
            var pt = list[i];
            if (i == 0) {
                wPrevPrice = pt.mClosePrice;
                value1[i] = 0;
                value2[i] = 0;
                for (var j = 0; j < this.m_size; j++) {
                    pt.mIndexValue[IDX.IV_RSI_B1 + j] = CD.INDEX_NO_VALUE;
                }
                continue;
            }
            wLastPrice = pt.mClosePrice;
            var gap = wLastPrice - wPrevPrice;
            if (0 < gap) {           //上昇
                value1[i] = gap;
                value2[i] = 0;
            } else if (gap < 0) {    //下落
                value1[i] = 0;
                value2[i] = Math.abs(gap);
            } else {
                value1[i] = 0;
                value2[i] = 0;
            }

            for (var j = 0; j < this.m_size; j++) {
                var rsiValue = CD.INDEX_NO_VALUE;
                var prm = this.m_pPrm[j];
                if ((0 < prm) && (prm - 1 <= i)) {
                    var total_up = 0;
                    var total_down = 0;
                    for (var k = i; i - prm < k; k--) {
                        total_up += value1[k];
                        total_down += value2[k];
                    }
                    if (0 < total_up) {
                        rsiValue = total_up / (total_up + total_down) * 100.0;
                    } else {
                        rsiValue = 0.0;
                    }
                }
                if (target_ix <= i) {
                    pt.mIndexValue[IDX.IV_RSI_B1 + j] = rsiValue;
                }
            }
            wPrevPrice = pt.mClosePrice;
        }
        value1 = [];
        value2 = [];
        return;
        
    }
}

