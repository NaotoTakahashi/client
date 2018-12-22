import ChartBaseData from './chartBaseData';
import {ChartObj} from './chartObj';
import * as CD from './chartDef';

export default class ChartData {
	constructor() {
        this.mChartList = [];
        this.mChartEntryMap = {};
        this.mpBaseMin = new ChartBaseData();
        this.mpBaseData = new ChartBaseData();
        this.mLastIndex = -1;
        this.mSecType = CD.SECTYPE_STK;         // 証券種別
        this.mSymbol = "";         // 対象銘柄
        this.mChartName = "";      // 銘柄名称（チャートタイトル）
        this.mBizDate = 0;         // 当日日付
        this.mDateFrom = 0;        // 日付（日足：YYYYMMDD）
        this.mDateTo = 0;          // 日付（日足：YYYYMMDD）
        this.mDataType = 0;        // 1:年 2:月 3:週 4:日 5:分 6:TICK
        this.mChartMin = 0;        // 分の場合のみ
        this.mDecimalScale = 0;    // 小数点桁数
        this.mValiｄDegits = 0;	  // 小数点有効桁数
        this.mVolDecimalScale = 0; // 売買高小数点桁数（指数系）
        this.mVolUnit = 0;         // 売買高取扱単位
        //this.mLastClose = new Array(5); // 前日終値(直近5日分)
        this.mLastClose = 0;    //前日終値
        this.mMaxPrice = 0.0;
        this.mMinPrice = 0.0;
        this.mMaxVolume = 0;
        this.mDegitsUnit = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];
    }
    init () {
        this.mDataType = 0;
        this.mChartMin = 0;
        this.mDecimalScale = 0;
        this.mSymbol = "";
        this.mChartName = "";
        this.mMaxPrice = 0.0;
        this.mMinPrice = 0.0;
        this.mMaxVolume = 0;
        this.mChartList = [];
    }
    getChartType () {
        return CD.CHART_TYPE_CANDLE;
    }
    getDataType () {
        return this.mDataType;
    }
    getSecType () {
        return this.mSecType;
    }
    getEntrySize () {
        return this.mChartList.length;
    }
    getMaxMinPrice () {
        return [this.mMaxPrice, this.mMinPrice];
    }
    //getMinPrice () {
    //    return this.mMinPrice;
    //}
    getLastClose () {
        return this.mLastClose;
    }
    setVolUnit (val) {
        this.mVolUnit = val;
    }
    getVolUnit () {
        return this.mVolUnit;
    }
    clear () {
        for (var i = this.mChartList.length; i--; ) {
            this.mChartList[i].mIndexValue = [];
        }
        this.mChartList = [];
        this.init();
    }
    add (obj) {
        this.mChartList.push(obj);
        return this.mChartList.length - 1;
    }
    getDecDegitsUnit() {
         return this.mDegitsUnit[this.mDecimalScale];
    }
    updatePrice (price) {
        if (this.mMaxPrice === 0.0) {
            this.mMaxPrice = price;
            this.mMinPrice = price;
        } else {
            if (this.mMaxPrice < price) {
                this.mMaxPrice = price;
            } else if (price < this.mMinPrice) {
                this.mMinPrice = price;
            }
        }
        return;
    }
    updateVolume (vol) {
        if (vol <= 0) return;
        if (this.mMaxVolume === 0) {
            this.mMaxVolume = vol;
        } else {
            if (this.mMaxVolume < vol) {
                this.mMaxVolume = vol;
            }
        }
        return;
    }
    setSymbol (val) {
        this.mSymbol = val;
        return true;
    }
    setChartName (val) {
        this.mChartName = val;
        return true;
    }
    getDayOfWeek (y, m, d) {
        if (m === 1 || m === 2) {
            y--;
            m += 12;
        }
        return ((y + y / 4 - y / 100 + y / 400 + (13 * m + 8) / 5 + d) % 7);
    }
    //==============================================================================
    // REAL MODE による空エントリクリア
    //==============================================================================
    clearChartObject() {
        //mChartEntryMap.clear();
        return true;
    }
    //==============================================================================
    // REAL MODE による空エントリ作成
    //==============================================================================
    makeChartObject (min, price) {
        var iEndTime = 1130; // 終了時刻（前後場）
        var iTime = 0;    // 終了条件判定
        var iHour = 9;    // 開始(HH)
        var iMinute = 0;    // 開始(MM)
        var aKey = "09:00";
        for (var i = 0; i < 2; i++) {
            while (iTime <= iEndTime) {
                //***作成 ***
                let chartObj = new ChartObj();
                chartObj.setTime(aKey);
                chartObj.mDataStatus = CD.INIT;
                chartObj.setOpeningPrice(price);
                chartObj.mVolume = 0;
                let ix = this.add(chartObj);

                //*** 更新 ***
                for (var k = 0; k < min; k++) {
                    this.mChartEntryMap[aKey] = ix;
                    //*** 次回のKEY ***
                    iMinute += 1;
                    if (60 <= iMinute) {
                        iHour += 1;
                        iMinute = iMinute - 60;
                    }
                    if ((24 <= iHour) && (iHour <= 30)) {
                        iHour -= 24;
                    }
                    var hour = ('00' + iHour.toString()).slice(-2);
                    var minute = ('00' + iMinute.toString()).slice(-2);
                    aKey = hour + ":" + minute;
                    iTime = iHour * 100 + iMinute;
                    if (iEndTime < iTime) {
                        break;
                    }
                }
            }
            iHour = 12;
            iMinute = 30;
            iEndTime = 1630;
            iTime = 0;
            aKey = "12:30";
        }
        return true;
    }
    //==============================================================================
    // CANDLE LIST(差分) ⇒ CHART DATA [MIN]
    //==============================================================================
    updateCandleMinData (refresh) {
        //小数点桁数
        var multiple = 1;
        if ((0 <= this.mDecimalScale) && (this.mDecimalScale <= 4)) {
            for (var i = 0; i < this.mDecimalScale; i++) {
                multiple *= 10;
            }
        } else {
            return false;
        }
        var start_ix;
        for (var key in this.mChartEntryMap) {
            //先頭要素の取出し(方法が分らないため暫定)
            start_ix = this.mChartEntryMap[key];
            break;
        }

        var entry = this.mpBaseMin.mBaseDataList.getEntry();
        //確定足ではないため最終エントリは再度描画する必要がある。
        //２ントリ以上発生した場合は、１エントリ情報は確定となり
        //mLastIndexMinが更新されるので自動的に対象外となる。
        //但しFIXEDをチェックしているのは前日データを対象外とするため。
        for (let i = this.mLastIndexMin; i < entry; i++) {
            var obj = this.mpBaseMin.mBaseDataList[i];
            if (obj.mDataStatus === CD.FIXED) {
                continue;
            }
            if ((obj.mDataStatus === CD.PROCESSED) && (!refresh)) {
                continue;
            }
            if (obj.mTime in this.mChartEntryMap) {
                continue;
            }
            var ix = this.mChartEntryMap[obj.mTime];
            if (this.mChartList[ix].mVolume === 0) {
                this.mChartList[ix].setOpeningPrice(obj.mClosePrice * multiple);
            } else {
                this.mChartList[ix].setPrice(obj.mClosePrice * multiple);
            }

            this.mChartList[ix].addVolume(obj.mVolume); //出来高セット

            this.mChartList[ix].mDataStatus = CD.FIXED;

            this.updatePrice(this.mChartList[ix].mClosePrice);
            this.updateVolume(this.mChartList[ix].mVolume);

            var valid_ix = 0;
            if (this.mChartList[ix - 1].mVolume === 0) {
                for (let j = ix - 1; start_ix <= j; j--) {
                    this.mChartList[j].mDataStatus = CD.FIXED; //先に有効にする
                    valid_ix = j;
                    if (0 < this.mChartList[j].mVolume) {
                        break;
                    }
                }
                if (start_ix < valid_ix) {
                    var price = this.mChartList[valid_ix].mClosePrice;
                    for (var j = valid_ix + 1; j < ix; j++) {
                        this.mChartList[j].setOpeningPrice(price);
                    }
                }
            }
            obj.mDataStatus = CD.PROCESSED;

        }
        this.mLastIndexMin = entry - 1;
        return true;

    }
    //==============================================================================
    // BASE LIST ⇒ CHART DATA [DAILY]
    //==============================================================================
    setChartDataOfDay (mode){
	    var pt = this.mpBaseData;
	    var entry = pt.mBaseDataList.getEntry();
	    if(entry <= 0) return false;
	    var breakCnt = 0; //BREAK COUNT
	    var prvWeek = 0;  //週足KEY比較
	    var prvCandlekey = "";	//月足KEY比較
	    var curCandlekey = "";	//月足KEY比較
	    //小数点桁数
	    var multiple = 1;
	    if((0 <= this.mDecimalScale) && (this.mDecimalScale <= 4)){
		    for(var i= 0; i<this.mDecimalScale; i++){
			    multiple *= 10;
		    }
	    }else{
		    return false;
	    }

	    let obj = new ChartObj();
	    for(let i= 0; i<entry; i++){
		    breakCnt++;
		    //*** ブレイク開始処理 ***
		    if(breakCnt === 1){
			    if(mode === CD.CHART_DATA_MONTH){
				    var sDate = pt.mBaseDataList[i].mDate;
				    curCandlekey = sDate.substr(0, 7);
				    obj.setMonth(curCandlekey.c_str());
				    prvCandlekey = curCandlekey;
			    }else{
				    obj.setDate(pt.mBaseDataList[i].mDate);
			    }
			    if((i === 0) || (mode === CD.CHART_DATA_DAY)){
				    obj.mVolume = 0;
				    obj.setOpeningPrice(pt.mBaseDataList[i].mOpenPrice * multiple);
				    //obj.setNK225Price(pt.mBaseDataList[i].mNK225Price);
			    }
		    }
		    //*** ブレイク判定 ***
		    let breakon = false;
		    if(mode === CD.CHART_DATA_DAY){
			    breakon = true;
		    }else if(mode === CD.CHART_DATA_WEEK){
			    if(i+1 < entry){
				    let sDate = pt.mBaseDataList[i+1].mDate;
                    let y = Number(sDate.substring(0, 4));
                    let m = Number(sDate.substring(5, 7));
                    let d = Number(sDate.substring(8, 10));
				    let week = this.getDayOfWeek(y, m, d);
				    if((week === 0) || (week === 6)){
					    // let a = 1; //有りえない
				    }
				    if(week <= prvWeek){
					    breakon = true;
				    }
				    prvWeek = week;
			    }else{
				    // 最終レコードは何もしなくても出力
			    }
		    }else if(mode === CD.CHART_DATA_MONTH){
			    let sDate = pt.mBaseDataList[i].mDate;
			    curCandlekey = sDate.substr(0, 7);
			    if(prvCandlekey !== curCandlekey){
				    breakon = true;
			    }
		    }
		    //*** データ更新 ***
		    if((mode === CD.CHART_DATA_DAY) || (!breakon)){
			    obj.setStatus(pt.mBaseDataList[i].mDataStatus);
			    obj.setPrice(pt.mBaseDataList[i].mHighPrice * multiple);	   //高値セット
			    obj.setPrice(pt.mBaseDataList[i].mLowPrice  * multiple);	   //安値セット
			    obj.setPrice(pt.mBaseDataList[i].mClosePrice * multiple);	   //終値セット
			    obj.addVolume(pt.mBaseDataList[i].mVolume);				   //出来高セット
			    obj.setNK225Price(pt.mBaseDataList[i].mNK225Price);		   //日経２２５終値
		    }

		    //*** ブレイク処理 ***
		    if((breakon) || (i+1 === entry)){
			    this.add(obj);
			    //今回のレコードを更新する（既に翌月のレコード）
			    if(mode !== CD.CHART_DATA_DAY){
				    obj.mVolume = 0;
				    obj.setOpeningPrice(pt.mBaseDataList[i].mOpenPrice * multiple);
				    obj.setPrice(pt.mBaseDataList[i].mHighPrice * multiple);	   //高値セット
				    obj.setPrice(pt.mBaseDataList[i].mLowPrice  * multiple);	   //安値セット
				    obj.setPrice(pt.mBaseDataList[i].mClosePrice * multiple);	   //終値セット
				    obj.addVolume(pt.mBaseDataList[i].mVolume);				   //出来高セット
				    obj.setNK225Price(pt.mBaseDataList[i].mNK225Price);		   //日経２２５終値
			    }
			    breakCnt = 0;
		    }
		
		    this.updatePrice(obj.mHighPrice);			    //リスト内値段最大値
		    this.updatePrice(obj.mLowPrice);			        //リスト内値段最小値
		    this.updateVolume(obj.mVolume);			        //リスト内出来高最大値
	    }
	    this.mLastIndex = entry-1;
	    return true;
    }
    //==============================================================================
    // BASE LIST ⇒ CHART DATA [MINUTES]
    //==============================================================================
    setChartDataOfMin (min){

	    var pt = this.mpBaseMin;
	    var entry = pt.mBaseDataList.size();
	    if(entry <= 0) return false;
	    var breakCnt = 0; //BREAK COUNT

	    //小数点桁数
	    var multiple = 1;
	    if((0 <= this.mDecimalScale) && (this.mDecimalScale <= 4)){
		    for(let i= 0; i<this.mDecimalScale; i++){
			    multiple *= 10;
		    }
	    }else{
		    return false;
	    }

	    var obj = new ChartObj();
	    var i = 0;
	    for(i= 0; i<entry; i++){
		    breakCnt++;
		    if(pt.mBaseDataList[i].mDataStatus !== CD.FIXED){
			    break;
		    }
		    //*** ブレイク開始処理 ***
		    if(breakCnt === 1){
			    obj.setTime(pt.mBaseDataList[i].mTime);
			    obj.mVolume = 0;
			    if(pt.mBaseDataList[i].mVolume === 0){
				    obj.mClosePrice  = pt.mBaseDataList[i].mClosePrice * multiple;
			    }else{
				    obj.setOpeningPrice(pt.mBaseDataList[i].mOpenPrice * multiple); //始値セット
			    }
		    }

		    //*** データ更新 ***
		    if(pt.mBaseDataList[i].mVolume !== 0){
			    if(obj.mOpenPrice === 0){ //始値未セットの場合
				    obj.setOpeningPrice(pt.mBaseDataList[i].mOpenPrice * multiple);
			    }
			    obj.setPrice(pt.mBaseDataList[i].mHighPrice * multiple);	   //高値セット
			    obj.setPrice(pt.mBaseDataList[i].mLowPrice  * multiple);	   //安値セット
			    obj.setPrice(pt.mBaseDataList[i].mClosePrice * multiple);	   //終値セット
			    obj.addVolume(pt.mBaseDataList[i].mVolume);	//出来高セット

			    this.updatePrice(obj.mHighPrice);			    //リスト内値段最大値
			    this.updatePrice(obj.mLowPrice);			        //リスト内値段最小値
			    this.updateVolume(obj.mVolume);			        //リスト内出来高最大小値
		    }

		    //*** ブレイク判定 ***
		    var breakon = false;
		    if((breakCnt === min) || (i+1 === entry)){
			    breakon = true;
		    }else if((i+1 < entry) && (pt.mBaseDataList[i+1].mDataStatus !== CD.FIXED)){
			    breakon = true;
		    }else{
			    //時刻乖離CHECK ※場間の足は考慮なし
			    var hh1 = Number(obj.mTime.substrint(0, 2));
			    if((0 <= hh1) && (hh1 <= 6)){ //夜間の立会をMAX6時前提
				    hh1 += 24;
			    }
				var mm1 = Number(obj.mTime.substrint(3, 5));
				var hh2 = Number(pt.mBaseDataList[i + 1].mTime.substring(0, 2));
			    if((0 <= hh2) && (hh2 <= 6)){ //夜間の立会をMAX6時前提
				    hh2 += 24;
			    }
			    var mm2 = Number(pt.mBaseDataList[i + 1].mTime.substring(3, 5));
			
			    //DEBUG
			    //if((hh1 === 11) && (mm1 === 30)){
			    //	printf("DETECTED %02d:%02d → %02d:%02d ", hh1, mm1, hh2, mm2);
			    //}

			    var t1 = hh1*3600 + mm1*60;
			    var t2 = hh2*3600 + mm2*60;
			    var gap = (t2-t1)/60;
			    if((min-1 < gap) || (gap < 0)){ //9時からの立会開始は乖離幅がマイナスとなる
				    breakon = true;
			    }
		    }
		    if(breakon){
			    if(obj.mVolume === 0){
				    //ダミー足のみの場合
				    obj.mOpenPrice = obj.mClosePrice;
				    obj.mHighPrice = obj.mClosePrice;
				    obj.mLowPrice  = obj.mClosePrice;
			    }
			    this.add(obj);
			    breakCnt = 0;
		    }
	    }
		this.mLastIndexMin = i-1;
	    return true;
    }
}

