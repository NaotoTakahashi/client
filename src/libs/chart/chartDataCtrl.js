import ChartData from './chartData';
import ChartTickData from './chartTickData';
import {ChartObj} from './chartObj';
import * as CD from './chartDef';

class ChartDataCtrl {
	constructor() {
        this.m_chartData = new ChartData();
        this.m_tickData = new ChartTickData();
        this.m_multiple = 1;
    }
    getData() {
        return this.m_chartData;
    }
    clearData() {
        this.m_chartData.clear();
    }
    getDataLength(dataObj) {
        // 旧データフォーマット用
        // let len = 0;
        // if (typeof dataObj.OHLC.DATA === "undefined") {
        //     len = 0;
        // } else {
        //     len = dataObj.OHLC.DATA.length;
        // }
        // return len;

        return dataObj.histList.length;
    }
    setDataType(dataObj) {
        // 旧データフォーマット用
        // if (dataObj.OHLC.TYPE === "1D") {
        //     this.m_chartData.mDataType = CD.CHART_DATA_DAY;
        // } else if (dataObj.OHLC.TYPE === "1W") {
        //     this.m_chartData.mDataType = CD.CHART_DATA_WEEK;
        // } else if (dataObj.OHLC.TYPE === "1M") {
        //     this.m_chartData.mDataType = CD.CHART_DATA_MONTH;
        // } else if (dataObj.OHLC.TYPE === "1m") {
        //     this.m_chartData.mDataType = CD.CHART_DATA_MIN;
        //     this.m_chartData.mChartMin = 1;
        // } else if (dataObj.OHLC.TYPE === "3m") {
        //     this.m_chartData.mDataType = CD.CHART_DATA_MIN;
        //     this.m_chartData.mChartMin = 3;
        // } else if (dataObj.OHLC.TYPE === "5m") {
        //     this.m_chartData.mDataType = CD.CHART_DATA_MIN;
        //     this.m_chartData.mChartMin = 5;
        // } else if (dataObj.OHLC.TYPE === "10m") {
        //     this.m_chartData.mDataType = CD.CHART_DATA_MIN;
        //     this.m_chartData.mChartMin = 10;
        // } 

        switch(dataObj.periodType) {
            case 0:
                this.m_chartData.mDataType = CD.CHART_DATA_MONTH;
                break;
            case 1:
                this.m_chartData.mDataType = CD.CHART_DATA_WEEK;
                break;
            case 2:
                this.m_chartData.mDataType = CD.CHART_DATA_DAY;
                break;
            case 3:
                this.m_chartData.mDataType = CD.CHART_DATA_MIN;
                this.m_chartData.mChartMin = dataObj.minValue;
                break;
            case 4:
                this.m_chartData.mDataType = CD.CHART_DATA_TICK;
                break;
            default:
                break;
        }


    }
    setBizDate(dataObj){
        // 旧データフォーマット用
        // if (typeof dataObj.OHLC.BIZDATE === "undefined") {
        //     //ERROR
        // } else {
        //     this.m_chartData.mBizDate = dataObj.OHLC.BIZDATE; //当日営業日(暫定)
        // }
        this.m_chartData.mBizDate = "2013/05/30";
    }
    setLastClose(dataObj, multiple){
        // 旧データフォーマット用
        //  if (typeof dataObj.OHLC.LAST_CLOSE === "undefined") {
        //     //ERROR
        //     this.m_chartData.mLastClose = 0;
        // } else {
        //     this.m_chartData.mLastClose = Number(dataObj.OHLC.LAST_CLOSE * multiple);
        // }

        this.m_chartData.mLastClose = dataObj.lastClose * multiple;
    }

    setDecPoint(dataObj) {
        // 旧データフォーマット用
        let validDegits = 0;
        if (typeof dataObj.OHLC.DECIMAL_POINT === "undefined") {
            validDegits = 0;
        } else {
            validDegits = Number(dataObj.OHLC.DECIMAL_POINT);
        }
        this.m_chartData.mValiｄDegits = validDegits;

        // オブジェクト倍数指定
        if(validDegits < 2){
            this.m_chartData.mDecimalScale = 2;
        }else{
            this.m_chartData.mDecimalScale = validDegits + 1;
        }
    }
    setDecPointForQuote(quote) {
        if(quote.length <= 3){
            return 0;
        }

        // 小数点有効桁数指定
        const quote_1 = quote.substr(0, 1);
        const quote_2 = quote.substr(1, 1);
        let dec = 0;
        if(quote_1 === 'E'){
            dec = 1;
        }else if(quote_1 === 'R'){
            dec = 0;
        }else if(quote_1 === 'G'){
            if(quote_2 === '6'){
                dec = 2;	// 長国先物
            }else{
                dec = 0;	// 以外
            }
        }else if(quote.length === 7){
            if (quote.substr(3, 4) === ".555") {
                if(quote_1 === '6'){
                    dec = 2;	// 長国先物
                }
            }
        } else {
            if(quote === "SCCO/USE"){	// NASDAQ
                dec = 1;
            }else if(quote === "CGLD/LDC"){	// ロンドン金
                dec = 1;
            }else if(quote === "XEUR/8"){	    // ユーロ／米ドル
                dec = 4;
            }else if(quote === "XGBP/8"){	    // ポンド／米ドル
                dec = 4;
            }else{
                dec = 2;
            }
        }
        
        this.m_chartData.mValiｄDegits = dec;

        // オブジェクト倍数指定
        if(dec < 2){
            this.m_chartData.mDecimalScale = 2;
        }else{
            this.m_chartData.mDecimalScale = dec;
        }
    }
    setData(dataObj) {

        //初期化
        this.m_chartData.clear();

        const len = this.getDataLength(dataObj);
        this.setDataType(dataObj);
        this.setBizDate(dataObj);

        //this.setDecPoint(dataObj); //旧データフォーマット用
        this.setDecPointForQuote(dataObj.key);

        // let multiple = 1;
        // if ((0 <= decScale) && (decScale <= 4)) {
        //     for (var i = 0; i < decScale; i++) {
        //         multiple *= 10;
        //     }
        // } else {
        //     return false;
        // }

        let multiple = this.m_chartData.getDecDegitsUnit();

        // TICK
        if (0 < dataObj.tickList.length) {
            this.setTick(dataObj);
            return;
        }

        if (this.m_chartData.mDataType === CD.CHART_DATA_MIN) {
            // 分足の場合前日終値取得
            this.setLastClose(dataObj, multiple);
        }

        // for (var i = 0; i < len; i++) {
        //     let chartObj = new ChartObj();
        //     if (this.m_chartData.mDataType === CD.CHART_DATA_DAY) {
        //         chartObj.setDate(dataObj.OHLC.DATA[i].T);
        //     } else if (this.m_chartData.mDataType === CD.CHART_DATA_WEEK) {
        //         chartObj.setDate(dataObj.OHLC.DATA[i].T);
        //     } else if (this.m_chartData.mDataType === CD.CHART_DATA_MONTH) {
        //         chartObj.setDate(dataObj.OHLC.DATA[i].T);
        //     } else {
        //         chartObj.setDate(dataObj.OHLC.DATA[i].T.substring(0, 10));
        //         chartObj.setTime(dataObj.OHLC.DATA[i].T.substring(11, 16));
        //     }
        //     chartObj.setOpeningPrice(Number(dataObj.OHLC.DATA[i].O) * multiple);
        //     chartObj.setPrice(Number(dataObj.OHLC.DATA[i].H) * multiple);
        //     chartObj.setPrice(Number(dataObj.OHLC.DATA[i].L) * multiple);
        //     chartObj.setPrice(Number(dataObj.OHLC.DATA[i].C) * multiple);
        //     chartObj.setVolume(Number(dataObj.OHLC.DATA[i].V));
        //     //if (dataObj.OHLC.DATA[i].T === this.m_chartData.mBizDate) {
        //     //    http: //localhost:5300/Index.htm
        //     //    chartObj.setStatus(REAL); //当日データ
        //     //} else {
        //     chartObj.setStatus(CD.FIXED);
        //     //}
        //     this.m_chartData.updatePrice(Number(dataObj.OHLC.DATA[i].H) * multiple);
        //     this.m_chartData.updatePrice(Number(dataObj.OHLC.DATA[i].L) * multiple);
        //     this.m_chartData.updateVolume(dataObj.OHLC.DATA[i].V);
        //     this.m_chartData.add(chartObj);
        // }


        let i = 0;
        for (i = 0; i < len; i++) {
            const chartEntry = dataObj.histList[i];
            let chartObj = new ChartObj();
            if (this.m_chartData.mDataType === CD.CHART_DATA_DAY) {
                //chartObj.setDate('' + chartEntry.date);
                chartObj.setDate2(chartEntry.date);
            } else if (this.m_chartData.mDataType === CD.CHART_DATA_WEEK) {
                //chartObj.setDate('' + chartEntry.date);
                chartObj.setDate2(chartEntry.date);
                chartObj.setBalance(chartEntry.saleBalance, chartEntry.buyBalance);
            } else if (this.m_chartData.mDataType === CD.CHART_DATA_MONTH) {
                //chartObj.setDate('' + chartEntry.date);
                chartObj.setDate2(chartEntry.date);
            } else {
                chartObj.setDate2(chartEntry.date);
                chartObj.setTime2(chartEntry.time);
                //chartObj.setDate(dataObj.OHLC.DATA[i].T.substring(0, 10));
                //chartObj.setTime(dataObj.OHLC.DATA[i].T.substring(11, 16));
            }
            let openPrice = Number(chartEntry.open) * multiple;
            let highPrice = Number(chartEntry.high) * multiple;
            let lowPrice = Number(chartEntry.low) * multiple;
            const closePrice = Number(chartEntry.close) * multiple;
            const volume = Number(chartEntry.volume);
            if(volume < 0 && 0 < closePrice){
                // 無効エントリ対応
                openPrice = highPrice = lowPrice = closePrice;
            }
            chartObj.setOpeningPrice(openPrice);
            chartObj.setPrice(highPrice);
            chartObj.setPrice(lowPrice);
            chartObj.setPrice(closePrice);
            chartObj.setVWAP(Number(chartEntry.vwap) * 10000);
            chartObj.setVolume(volume);
            chartObj.mRatioPrice = Number(chartEntry.ratioPrice) * multiple;

            //     //if (dataObj.OHLC.DATA[i].T === this.m_chartData.mBizDate) {
            //     //    http: //localhost:5300/Index.htm
            //     //    chartObj.setStatus(REAL); //当日データ
            //     //} else {
            chartObj.setStatus(CD.FIXED);
            //     //}
            this.m_chartData.updatePrice(highPrice);
            this.m_chartData.updatePrice(lowPrice);
            this.m_chartData.updateVolume(volume);
            this.m_chartData.add(chartObj);
        }

        this.m_multiple = multiple;
        this.m_chartData.mLastIndex = i - 1;
    }
    setTick(dataObj) {
        let multiple = this.m_chartData.getDecDegitsUnit();
        const len = dataObj.tickList.length;
        let i = 0;
        for (i = 0; i < len; i++) {
            const chartEntry = dataObj.tickList[i];
            const thisPrice = Number(chartEntry.price) * multiple;
            const volume = Number(chartEntry.volume);
            if (this.m_chartData.mDataType !== CD.CHART_DATA_MIN) {
                // 時間だけを反映するためのDUMMY電文のはTICKの場合除外
                if (thisPrice === 0 && volume === 0) {
                    continue;
                }
            }
            let chartObj = new ChartObj();
            chartObj.setDate2(chartEntry.date);
            chartObj.setTime2(chartEntry.time);
            chartObj.setOpeningPrice(thisPrice);
            chartObj.setVWAP(Number(chartEntry.vwap) * 10000);
            chartObj.setVolume(volume);
            chartObj.setBalance(-1, -1);
            this.m_chartData.updatePrice(thisPrice);
            this.m_chartData.updateVolume(volume);
            this.m_chartData.add(chartObj);
        }
        this.m_multiple = multiple;
        this.m_chartData.mLastIndex = i - 1;
    }
    setUpdateData (tickObj) {
        if (this.m_chartData.mDataType === CD.CHART_DATA_DAY) {
            this.setUpdateDaily(tickObj);
        } else if (this.m_chartData.mDataType === CD.CHART_DATA_WEEK) {
            this.setUpdateDaily(tickObj);
        } else if (this.m_chartData.mDataType === CD.CHART_DATA_MONTH) {
            this.setUpdateDaily(tickObj);
        } else if (this.m_chartData.mDataType === CD.CHART_DATA_MIN) {
            this.setUpdateMin(tickObj);
        } else if (this.m_chartData.mDataType === CD.CHART_DATA_TICK) {
            this.setTick(tickObj);
        }
    }
    getNextStickTime (time, min) {
        let cur_hour = Number(time.substring(0, 2));
        let cur_min = Number(time.substring(2, 4));
        let next_min = cur_min + min;
        let next_hour = 0;
        if (60 <= next_min) {
            next_min = next_min - 60;
            next_hour = cur_hour + 1;
        } else {
            next_hour = cur_hour;
        }
        //25時→0時に変換
        //if (25 <= next_hour) {
        //    next_hour = next_hour - 25;
        //}
        //25時のまま返す
        return Number(('00' + next_hour).slice(-2) + ('00' + next_min).slice(-2));
    }
    isTradeTime (time) {
        //暫定(本来はここで証券種別判定が必要)
        if ((time < 900) || ((1131 <= time) && (time <= 1229)) || (1500 < time)) {
            return false;
        }
        return true;
    }
    getTradeStartTime() {
        //暫定(本来はここで証券種別判定が必要)
        let start_time = "09:00";
        return start_time;
    }
    getDateFormat(dateStr) {
        // YYYYMMDD → YYYY/MM/DD
        let wkDate = 0;
        if(8 <= dateStr.length){
            const sy = dateStr.substring(0, 4);
            const sm = dateStr.substring(4, 6);
            const sd = dateStr.substring(6, 8);
            wkDate = sy + '/' + sm + '/' + sd;
        }
        return wkDate;
    }
    makeTimeString(tvalue) {
        // 前ゼロ付加
        return ("0000" + tvalue).slice(-4);
    }
    getMinTimeWhithoutSec(tickTime) {
        const len = tickTime.length;
        if (len <= 2) {
            return "0000"
        } else {
            return tickTime.substring(0, len -  2);
        }
    }
    setUpdateTick(tickObj) {
        let list = this.m_chartData.mTickList;
        let lastix = this.m_chartData.mLastIndex;
    }
    setUpdateMin (tickObj) {
        let len = tickObj.tickList.length;
        let list = this.m_chartData.mChartList;
        let lastix = this.m_chartData.mLastIndex;
        //既存のエントリが1件も存在しない場合は、当該TICK受信を契機に
        //初回の足だけ先に作成する必要がある。この場合の値段の格納は前日終値となる。
        //先物の終値確定前の５分間は空足の作成が必要
        let lastChartObj = list[lastix];
        let first_flag = false;
        if (0 < len) {
            if (lastix < 0) {
                first_flag = true;
            }else{
                // TICK日付が既存エントリから更新された場合は初回扱い
                // YYYYMMDD → YYYY/MM/DD
                let wkDate = this.getDateFormat(tickObj.tickList[0].date);
                if (lastChartObj.mDate !== wkDate) {
                    first_flag = true;
                }
            }
        }
        if (first_flag) {
            let newChartObj = new ChartObj();
            newChartObj.setTime2(this.getTradeStartTime());
            //前日終値で初期化
            newChartObj.setOpeningPrice(this.m_chartData.mLastClose);
            newChartObj.setStatus(CD.INIT);
            this.m_chartData.add(newChartObj);
            lastix = 0;
            this.m_chartData.updatePrice(this.m_chartData.mLastClose);
        }
        let chartObj = null;
        //指定足取得
        let min = this.m_chartData.mChartMin;

        for (var i = 0; i < len; i++) {
            // TICKメッセージのみ時刻が秒まで入る(歩み対応のため)ため秒を切り捨て
            tickObj.tickList[i].time = this.getMinTimeWhithoutSec(tickObj.tickList[i].time);
            //最終エントリ足時刻取得
            let prevTime = list[lastix].mIntTime;
            let status = list[lastix].mDataStatus;
            //チェック用次回足時刻取得
            let nextTime = Number(this.getNextStickTime(this.makeTimeString(prevTime), min));
            //TICK格納足判
            let tick_min = Number(tickObj.tickList[i].time);
            if (prevTime <= tick_min && tick_min < nextTime) {
                chartObj = list[lastix];
                chartObj.setDate2(tickObj.tickList[i].date);
                if (status === CD.INIT) {
                    //9:00 の DUMMY足の場合のみ
                    chartObj.setOpeningPrice(Number(tickObj.tickList[i].price) * this.m_multiple);
                } else {
                    chartObj.setPrice(Number(tickObj.tickList[i].price) * this.m_multiple);
                }
                chartObj.addVolume(Number(tickObj.tickList[i].volume));
                chartObj.setStatus(CD.REAL);
                this.m_chartData.updatePrice(Number(tickObj.tickList[i].price) * this.m_multiple);
                this.m_chartData.updateVolume(chartObj.mVolume);
            } else if (nextTime <= tick_min) {
                list[lastix].setStatus(CD.FIXED); //最終エントリステータス更新
                prevTime = nextTime;
                nextTime = Number(this.getNextStickTime(this.makeTimeString(prevTime), min));
                while (nextTime <= tick_min) {
                    //飛んだ分のエントリ作成
                    let chartPrv = list[lastix];
                    let canMakeObj = this.isTradeTime(prevTime);
                    if (canMakeObj) {
                        chartObj = new ChartObj();
                        let prex_str = this.makeTimeString(prevTime);
                        chartObj.setTime2(prex_str);
                        chartObj.setDate2(tickObj.tickList[i].date);
                        chartObj.mOpenPrice = chartPrv.mClosePrice;
                        chartObj.mHighPrice = chartPrv.mClosePrice;
                        chartObj.mLowPrice = chartPrv.mClosePrice;
                        chartObj.mClosePrice = chartPrv.mClosePrice;
                        chartObj.mVolume = 0;
                        chartObj.setStatus(CD.FIXED);
                        this.m_chartData.add(chartObj);
                        lastix++;
                    }
                    prevTime = nextTime;
                    nextTime = Number(this.getNextStickTime(this.makeTimeString(prevTime), min));
                }
                //新規レコード追加処理
                chartObj = new ChartObj();
                let prex_str = this.makeTimeString(prevTime);
                chartObj.setTime2(prex_str);
                chartObj.setDate2(tickObj.tickList[i].date);
                chartObj.setOpeningPrice(Number(tickObj.tickList[i].price) * this.m_multiple);
                chartObj.addVolume(Number(tickObj.tickList[i].volume));
                chartObj.setStatus(CD.REAL);
                this.m_chartData.add(chartObj);
                lastix++;
                this.m_chartData.updatePrice(Number(tickObj.tickList[i].price) * this.m_multiple);
                this.m_chartData.updateVolume(chartObj.mVolume);
                if (list[0].mDataStatus === CD.INIT) {
                    list[0].mDataStatus = CD.FIXED;
                }
            } else {
                //時刻戻り矛盾
                //var error = "";
            }
        }
    }
    setUpdateDaily (tickObj) {
        let len = tickObj.tickList.length;
        let chartObj = null;
        let list = this.m_chartData.mChartList;
        for (let i = 0; i < len; i++) {
            //各足種別毎による既存エントリ存在確認
            let isExistEntry = false;
            let lastix = this.m_chartData.mLastIndex;
            if (0 < list.length) {
                if (this.m_chartData.mDataType === CD.CHART_DATA_DAY) {
                    //if (list[lastix].mDate === this.m_chartData.mBizDate) {
                    //    isExistEntry = true;
                    //}
                    // ↓使用用途不明
                    //if (tickObj.TICK.LAST_TICK === "-1") {
                    //    return
                    //}
                    // YYYYMMDD → YYYY/MM/DD
                    let wkDate = this.getDateFormat(tickObj.tickList[i].date);
                    //const wkDate = list[lastix].mDate.split("/").join("");    //YYYY/MM/DD→YYYYMMDD
                    if (list[lastix].mDate === wkDate) {
                        isExistEntry = true;
                    }
                } else if (this.m_chartData.mDataType === CD.CHART_DATA_WEEK) {
                    // ↓使用用途不明
                    // if (tickObj.TICK.LAST_TICK === "-1") {
                    //     return
                    // }
                    // 現在の最終エントリ曜日取得
                    let curDate = new Date(list[lastix].mDate);
                    let curWeek = curDate.getDay();
                    // YYYYMMDD → YYYY/MM/DD
                    let wkDate = this.getDateFormat(tickObj.tickList[i].date);
                    let tickDate = new Date(wkDate);
                    let tickWeek = tickDate.getDay();
                    if (curWeek <= tickWeek) {
                        //週を跨いで追い越した場合の考慮無し
                        isExistEntry = true;
                    }
                    /*
                    var curDate = new Date(list[lastix].mDate);
                    var curWeek = curDate.getDay();
                    var bizDate = new Date(this.m_chartData.mBizDate);
                    var bizWeek = bizDate.getDay();
                    if (curDate.getMonth() + "/" + curDate.getDate() === bizDate.getMonth() + "/" + bizDate.getDate()) {
                    isExistEntry = true;
                    } else if (curWeek < bizWeek) {
                    //週を跨いで追い越した場合の考慮無し
                    isExistEntry = true;
                    }
                    */
                } else if (this.m_chartData.mDataType === CD.CHART_DATA_MONTH) {
                    // YYYYMMDD → YYYY/MM/DD
                    let wkDate = this.getDateFormat(tickObj.tickList[i].date);
                    if (list[lastix].mDate.substring(0, 7) === wkDate.substring(0, 7)) {
                        isExistEntry = true;
                    }
                }
            }

            if (isExistEntry) {
                chartObj = list[lastix];
                chartObj.setPrice(Number(tickObj.tickList[i].price) * this.m_multiple);
                chartObj.addVolume(Number(tickObj.tickList[i].volume));
            } else {
                chartObj = new ChartObj();
                chartObj.setDate2(tickObj.tickList[i].date);
                chartObj.setOpeningPrice(Number(tickObj.tickList[i].price) * this.m_multiple);
                chartObj.setVolume(Number(tickObj.tickList[i].volume));
                this.m_chartData.add(chartObj);
            }
            chartObj.setStatus(CD.REAL);
            this.m_chartData.updatePrice(Number(tickObj.tickList[i].price) * this.m_multiple);
            this.m_chartData.updatePrice(Number(tickObj.tickList[i].price) * this.m_multiple);
            this.m_chartData.updateVolume(tickObj.tickList[i].volume);
        }
    }
    updateLastIndex () {
        this.m_chartData.mLastIndex = this.m_chartData.mChartList.length - 1;
    }
}

export default ChartDataCtrl;
