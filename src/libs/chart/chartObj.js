//-------------------------------------------------------------------
// チャート作成用データ定義
//--------------------------------------------------------------------
export class ChartObj {
	constructor() {
        this.mDataStatus = 1;           // 0:無効 1:有効（デフォルト）
        this.mDate       = "";          // 日付（日足：YYYY/MM/DD 月：YYYY/MM 以外は未格納）
        this.mTime       = "";          // 時刻(HH:MM)
        this.mIntTime    = 0;			// 時刻(HHMM)
        this.mSecTime    = "";          // 時刻(HH:MM:SS)
        this.mDayOfWeek  = -1;          // 曜日（0:日 1:月 2:火 3:水 4:木 5:金 6:土）
        this.mOpenPrice  = 0.0;			// 始値
        this.mHighPrice  = 0.0;			// 高値
        this.mLowPrice   = 0.0;			// 安値
        this.mClosePrice = 0.0;			// 終値
        //this.mNK225Price = 0.0;		// 日経225終値
        this.mVolume    = 0; 		    // 増加数量(前回の出力からの増加数量を設定) 
        this.mValue     = 0;            // 売買代金
        this.mVWAP      = 0;            // VWAP(TICK受信時のみ算出)
        this.mSellBalance = -1;         // 売信用残
        this.mBuyBalance = -1;          // 買信用残
        this.mIndexValue = new Array();
    }
    setStatus (stat) {
        this.mDataStatus = stat;
    }
    setNumberDate (indate) { 
        let y = (indate / 10000) >> 0;
        let m = ((indate / 100) >> 0) - (y * 100);
        let d = indate - (y * 10000) - (m * 100);
        let dateStr = '' + indate;
        this.mDate = dateStr.substr(0, 4) + '/' + dateStr.substr(4, 2) + '/' + dateStr.substr(6, 2);
        if (m == 1 || m == 2) {
            y--;
            m += 12;
        }
        this.mDayOfWeek = ((y + y / 4 - y / 100 + y / 400 + (13 * m + 8) / 5 + d) % 7);
        return true;
    }
    setDate (indate) {
        // YYYY/MM/DD の場合(旧フォーマット)
        this.mDate = indate;
        if (this.mDate.length === 10) {
            let y = Number(this.mDate.substring(0, 4));
            let m = Number(this.mDate.substring(5, 7));
            let d = Number(this.mDate.substring(8, 10));
            if (m == 1 || m == 2) {
                y--;
                m += 12;
            }
            this.mDayOfWeek = ((y + y / 4 - y / 100 + y / 400 + (13 * m + 8) / 5 + d) % 7);
        }
        return true;
    }
    setDate2 (indate) {
        // YYYYMMDD の場合 → 
        this.mDate = indate;
        if (this.mDate.length === 8) {
            const sy = this.mDate.substring(0, 4);
            const sm = this.mDate.substring(4, 6);
            const sd = this.mDate.substring(6, 8);
            this.mDate = sy + '/' + sm + '/' + sd;
            let y = Number(sy);
            let m = Number(sm);
            let d = Number(sd);
            if (m == 1 || m == 2) {
                y--;
                m += 12;
            }
            this.mDayOfWeek = ((y + y / 4 - y / 100 + y / 400 + (13 * m + 8) / 5 + d) % 7);
        }
        return true;
    }
    setMonth (inMonth) {
        if (inMonth.length != 7) {
            return false;
        }
        this.mDate = inMonth;
        return true;
    }
    setTime (inTime) {
        // HH:MM の場合(旧フォーマット)
        if (inTime.length != 5) {
            return false;
        }
        this.mTime = inTime;
        this.mIntTime = Number(this.mTime.substring(0, 2) + this.mTime.substring(3, 5));
        return true;
    }
    setTime2 (inTime) {
        // HHMMSS の場合(6桁固定)
        if(inTime.length == 4){
            inTime += "00";
        }
        this.mTime = inTime.substring(0, 2) + ':' + inTime.substring(2, 4);
        this.mIntTime = Number(inTime.substring(0, 4));
        this.mSecTime = this.mTime + ':' + inTime.substring(4, 6);
        return true;
    }
    setNumberTime (inTime) {
        const timeStr = '' + inTime;
        if(timeStr.length === 4){
            this.mTime = timeStr.substring(0, 2) + ':' + timeStr.substring(2, 4);
        } else if(timeStr.length === 3){
            this.mTime = '0' + timeStr.substring(0, 1) + ':' + timeStr.substring(1, 3);
        } else if(timeStr.length === 2){
            this.mTime = '00:' + timeStr;
        } else if(timeStr.length === 1){
            this.mTime = '00:0' + timeStr;
        }else{
            return false;
        }
        this.mIntTime = inTime;
        return true;
    }
    setOpeningPrice (price) {
        this.mOpenPrice = price;
        this.mHighPrice = price;
        this.mLowPrice = price;
        this.mClosePrice = price;
        return true;
    }
    setPrice (price) {
        if (this.mHighPrice < price) {
            this.mHighPrice = price;
        }
        if (price < this.mLowPrice || this.mLowPrice == 0) {
            this.mLowPrice = price;
        }
        this.mClosePrice = price;
        return true;
    }
    setVWAP (vwap) {
        this.mVWAP = vwap;
        return true;
    }
    setLastPrice (sprice) { //FOR TICK
        this.setOpeningPrice(sprice);
        return true;
    }
    setVolume (vol) {
        this.mVolume = vol;
        return true;
    }
    setBalance(sell, buy){
        if(sell === '' || sell === undefined){
            this.mSellBalance = -1;  
        }else{
            this.mSellBalance = Number(sell);
        }
        if(buy === '' || buy === undefined){
            this.mBuyBalance = -1;
        }else{
            this.mBuyBalance = Number(buy);
        }
        return true; 
    }
    addVolume (vol) {
        this.mVolume += vol;
        return true;
    }
    addValue (value) {
        this.mValue += Number(value);
        return true;
    }
    setNK225Price (sprice) {
        this.mNK225Price = Number(sprice);
        return true;
    }
    getPriceBarString () {
        return this.mDate + " O:" + this.mOpenPrice + " H:" + this.mHighPrice + " L:" + this.mLowPrice + " C:" + this.mClosePrice;
    }
}
const PVOL_MAX_ENTRY = 250;
export class ChartPVOL {
	constructor() {
        this.m_value = (new Array(PVOL_MAX_ENTRY)).fill(0);   // 値リスト
        this.m_entry = 0;			    // 格納済みエントリ数
        this.m_maxValue = 0;			// 最大値
    }
}

