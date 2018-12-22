import { ChartObj } from './chartObj';
import * as CD from './chartDef';

export default class ChartBaseData {
	constructor() {
        this.mBaseDataList = [];
        this.mPrevEndIndex = 0; // 事前取得データ位置
        this.mLastIndex = 0;    // 最終読込みエントリ（TICK）
        this.mExcange = "";     // 取引所区分
        this.mMarket = "";      // 市場区分
        this.mSymbol = "";      // 対象銘柄
        this.mDataType = 0;     // 1:分 2:日
    }
    getEntry () {
        return this.mBaseDataList.length;
    }
    clear () {
        this.mBaseDataList = [];
    }
    add (obj) {
        this.mBaseDataList.push(obj);
        return this.mBaseDataList.length - 1;
    }
    setSymbol (val) {
        this.mSymbol = val;
        return true;
    }
    //==============================================================================
    // TICK OBJECT → BASE LIST
    //==============================================================================
    addTickForMin (tickObj) {
        let last_ix = this.getEntry() - 1;
        if (0 < last_ix) {
            let obj = this.mBaseDataList[last_ix];
            //時刻
            let sTime = tickObj.mTime.substring(0, 2) + ":" + tickObj.mTime.substring(3, 5);
            if (sTime === obj.mTime) {
                // *** 更新 ***
                if (obj.mVolume === 0 && 0 < tickObj.mVolume) {
                    obj.setOpeningPrice(tickObj.mLastPrice);
                    obj.setVolume(tickObj.mVolume);
                } else {
                    obj.setPrice(tickObj.mLastPrice);
                    obj.addVolume(tickObj.mVolume);
                }
                obj.mDataStatus = CD.REAL;
            } else {
                //*** 新規 ***
                let newobj = new ChartBaseObj();
                newobj.setTime(sTime);
                newobj.setOpeningPrice(tickObj.mLastPrice);
                newobj.setVolume(tickObj.mVolume);
                newobj.mDataStatus = CD.REAL;
                this.add(newobj);
            }
        }
        return true;
    }
    //==============================================================================
    // TICK LIST → BASE DATA LIST
    //==============================================================================
    setTickToCandleForMin (tickData, volunit) {
        if (!tickData) return false;
        let entry = tickData.mTickVec.size();
        let obj = new ChartObj();
        let breakCnt = 0;
        for (let i = 0; i < entry; i++) {
            let tickObj = tickData.mTickVec[i];
            breakCnt++;
            //*** ブレイク開始処理 ***
            if (breakCnt === 1) {
                let sTime = tickObj.mTime.substring(0, 2) + ":" + tickObj.mTime.substring(3, 5);
                let obj = new ChartBaseObj();
                obj.setTime(sTime);
                obj.setOpeningPrice(tickObj.mLastPrice);
                obj.setVolume("0", volunit);
            }
            //*** ブレイク判定 ***
            let breakon = false;
            if (i + 1 < entry) {
                if (tickObj.mTime === tickData.mTickVec[i + 1].mTime) {
                    breakon = true;
                }
            } else {
                breakon = true; //最終エントリ
            }
            obj.setPrice(tickObj.mLastPrice);
            obj.addVolume(tickObj.mVolume);

            //*** ブレイク処理 ***
            if (breakon || i + 1 === entry) {
                let candle_ix = this.add(obj);
                breakCnt = 0;
                if (obj.mDataStatus !== CD.REAL) {
                    this.mPrevEndIndex = candle_ix;
                }
            }
        }
        this.mLastIndex = entry - 1;
        return true;
    }
}

class ChartBaseObj {
    constructor() {
        this.mDataStatus = 0;     // 0:仕掛中 1:確定
        this.mDate = "";    // 日付（日足：YYYY/MM/DD 月：YYYY/MM 以外は未格納）
        this.mTime = "";    // 時刻（HH:MM）
        this.mOpenPrice = 0.0;   // 始値
        this.mHighPrice = 0.0;   // 高値
        this.mLowPrice = 0.0;   // 安値
        this.mClosePrice = 0.0;   // 現在値
        this.mNK225Price = 0.0;   // 日経225終値
        this.mVolume = 0;   // 増加数量(前回の出力からの増加数量を設定) 
    }
    setStatus(val) {
        this.mDataStatus = val;
    }
    setDate(inDate) {
        this.mDate = inDate;
        return true;
    }
    setMonth(inMonth) {
        if (inMonth.length !== 7) {
            return false;
        }
        this.mDate = inMonth;
        return true;
    }
    setTime(inTime) {
        this.mTime = inTime;
        return true;
    }
    setOpeningPrice(sprice) {
        let price = Number(sprice);
        this.mOpenPrice = price;
        this.mHighPrice = price;
        this.mLowPrice = price;
        this.mClosePrice = price;
        return true;
    }
    setPrice(sprice) {
        let price = Number(sprice);
        if (this.mHighPrice < price) {
            this.mHighPrice = price;
        } else if (price < this.mLowPrice) {
            this.mLowPrice = price;
        }
        this.mClosePrice = price;
        return true;
    }
    setVolume(svol, volunit) {
        if (typeof volunit === 'undefined') volunit = 1;
        this.mVolume = Number(svol) / volunit;
        return true;
    }
    addVolume(svol, volunit) {
        if (typeof volunit === 'undefined') volunit = 1;
        this.mVolume += (Number(svol) / volunit);
        return true;
    }
    setNK225Price(sprice) {
        this.mNK225Price = Number(sprice);
        return true;
    }
}

