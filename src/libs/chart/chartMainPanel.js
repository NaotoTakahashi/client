import ChartCommon from './chartCommon';
import ChartHeaderTree from './chartHeaderTree';
import ChartSlider from './chartSlider';
import ChartColorPicker from './chartColorPicker';
import {ChartColorParamLabel} from './chartColorPicker';
import ChartButton from './chartButton';
import ChartTechToolCtrl from './chartTechToolCtrl';
import {ChartTechSMA, ChartTechEMA, ChartTechWMA, ChartTechSMMA, ChartTechEMMA, ChartTechBB} from './chartTechIndex';
import {ChartTechICHI, ChartTechENV, ChartTechPAR, ChartTechVS, ChartTechHLB, ChartTechPVT} from './chartTechIndex';
import {ChartTechLRT, ChartTechHMA, ChartTechTBRK, ChartTechTKAGI} from './chartTechIndex';
import {ChartTechPVOL, ChartTechREV} from './chartTechIndex';
import * as TS from './chartTechIndex';
import * as CD from './chartDef';
import * as IDX from './chartDef';

const FIBO_ZARABA = 1;     // フィボナッチ(ザラバ)
const FIBO_OWARINE = 2;    // フィボナッチ(終値)
const MIN_PARAM_VALUE = 1;
const MAX_PARAM_VALUE = 100;

export default class ChartMainPanel {
	constructor(chartCanvas, info, techParam, drawParam) {
        this.m_cc = chartCanvas;
        this.m_type = 0;
        this.m_common = new ChartCommon(chartCanvas);
        this.m_drawInf = this.m_common.m_drawInf;
        this.m_info = this.m_common.m_info = info;
        this.m_info.setChartStyle(CD.STYLE_CANDLE);
        this.m_techParam = this.m_common.m_techParam = techParam;
        this.m_drawParam = this.m_common.m_drawParam = drawParam;
        this.m_indexCtrl = new Array(CD.DRAW_GR_MAX);
        this.m_indexCtrl.fill(null);
        this.m_REV = new ChartTechREV();
        this.m_dispStartIndex = 0;               // 表示開始エントリ（表示エリア変更判定用）
        this.m_dispEntryCount = 0;               // 表示エントリ件数（表示エリア変更判定用）
        this.m_dispInfo = {};                    // 表示情報
        this.m_dispInfo.dispMaxPrice = 0.0;      // 表示最大値段
        this.m_dispInfo.dispMinPrice = 0.0;      // 表示最小値段
        this.m_dispInfo.dispHighPrice = 0.0;     // 表示最高値
        this.m_dispInfo.dispLowPrice = 0.0;      // 表示最安値
        this.m_dispInfo.dispHighEntry = 0;	     // 表示最高値エントリ
        this.m_dispInfo.dispLowEntry = 0;	     // 表示最安値エントリ
        this.m_dispInfo.dispCloseHighPrice = 0.0;// 表示最高値(終値ベース)
        this.m_dispInfo.dispCloseLowPrice = 0.0; // 表示最安値(終値ベース)
        this.m_dispInfo.dispCloseHighEntry = 0;  // 表示最高値エントリ(終値ベース)
        this.m_dispInfo.dispCloseLowEntry = 0;	 // 表示最安値エントリ(終値ベース)
        this.m_chartType = CD.CHART_MAIN_CANDLE; // チャート識別(0:ローソク 2:バー ～ 5:TICK BY TICK)
        this.m_lastPriceVolume = 0;              // 指標パネル用カレント値段別売買高退避
        this.m_mosPushStat = 0;                  // マウス左ボタン押下状態判定			
        this.m_mosPushPrvX = 0;                  // マウス左ボタン押下直近状態退避(X)(スライド用)
        this.m_changeChart = false;              // チャート切替指示フラグ
        this.m_changeSizeFlag = false;           // エントリ数更新判定用
        this.m_dispLastIndex = 0;                // 表示中最終エントリインデックス
        this.m_dispFixedArea = false;            // 右側固定エリア表示ステータス退避(TRUE:非表示 FALSE:表示)
        this.m_drawAreaSizeX = 0;                // 描画領域(リサイズ判定用)
        this.m_entryWidth = 0;                   // エントリサイズ(サイズ変更判定用)
        this.m_totalMaxEntry = 0;                // 最大エントリ数
        this.m_techLastIndex = 0;                // リスト更新判定用
        this.m_techTool = new ChartTechToolCtrl();
        this.m_techTool.init(this.m_common);
        this.m_headerTree = new ChartHeaderTree(chartCanvas);
        this.m_headerTree.headerType = [];
        this.m_headerTree.headerDetail = [];
        this.m_issueCode;
        this.m_issueName = "";
        this.m_marketCode;
        this.m_marketName;
        this.m_periodCode;
        this.m_periodName;
        this.m_isAuotUpdate = true;
    }
    getTechToolCtrl() {
         return this.m_techTool;
    }
    //==============================================================================
    //  データセット
    //==============================================================================
    initData() {
        let pHist = this.m_info.getCurrentHist();
        let dataSize = 0;
        if (pHist.mDataType === CD.CHART_MAIN_TICK) {
            this.m_chartType = CD.CHART_MAIN_TICK;
        } else {
            this.resetIndexData();
            this.m_chartType = CD.CHART_MAIN_CANDLE;
        }
        this.m_dispEntryCount = 0;

        // 描画区間リセット(最右部へ移動)
        if (this.m_info.isVariableMode()) {
            dataSize = this.m_info.getCurHistSize();
            const varDrawNum = this.m_info.getVariableEntryNum();
            if(varDrawNum <= dataSize){
                this.m_info.setVariableBgnIndex(dataSize - varDrawNum);
                this.m_info.setVariableEndIndex(dataSize - 1);
            }else{
                this.m_info.setVariableBgnIndex(0);
                this.m_info.setVariableEndIndex(dataSize - 1);
            }
        }else{
            dataSize = this.m_info.getCurHistSize();
            const fixDrawNum = this.m_info.m_lastIndex - this.m_info.m_beginIndex;
            if(0 < fixDrawNum){
                if(fixDrawNum <= dataSize){
                    this.m_info.setBeginIndex(dataSize - fixDrawNum);
                    this.m_info.setLastIndex(dataSize - 1);
                }else{
                    this.m_info.setBeginIndex(0);
                    this.m_info.setLastIndex(dataSize - 1);
                }
            }else{
                this.m_info.setBeginIndex(-1);
                this.m_info.setLastIndex(-1);
            }
        }    
        return;
    }
    updateData() {
        if (this.m_chartType === CD.CHART_MAIN_CANDLE) {
            let ix = this.m_info.getCurrentHist().mLastIndex;
            this.updateIndexData(ix);
        }
        this.m_changeSizeFlag = true;
        return;
    }
    setIssue(issuCode, issueName, marketCode) {
        this.m_issueCode = issuCode;
        this.m_issueName = (issueName === undefined)? this.m_issueName = "" : issueName;
        this.m_marketCode = marketCode;
        if (marketCode === undefined) this.m_issueName = "";
        switch(marketCode) {
            case "00":
                this.m_marketName = '東証';
                break;
            case "02":
                this.m_marketName = '名証';
                break;
            case "05":
                this.m_marketName = '福証';
                break;
            case "07":
                this.m_marketName = '福証';
                break;
            default:
                this.m_marketName = marketCode;
                break;
        }
        this.setTreeHeaderStr();
    }
    setPeriod(periodCode, minValue = 0) {
        switch(periodCode) {
            case CD.CHART_DATA_DAY:
                this.m_periodName = '日足';
                break;
            case CD.CHART_DATA_WEEK:
                this.m_periodName = '週足';
                break;
            case CD.CHART_DATA_MONTH:
                this.m_periodName = '月足';
                break;
            case CD.CHART_DATA_MIN:
                this.m_periodName = minValue + '分足';
                break;
            case CD.CHART_DATA_TICK:
                this.m_periodName = 'ティック';
                break;
            default:
                this.m_periodName = periodCode;
                break;
        }
        this.setTreeHeaderStr();
    }
    clearTechTool() {
        this.m_techTool.clearAllObject();
    }
    setTreeHeaderStr() {
        this.m_headerTree.setTopString('［' + this.m_marketName +'］' + ' ' + this.m_issueName + '（' + this.m_issueCode + '）' + this.m_periodName);
    }
    setTechIndex(type, boolval) {
        if (this.m_chartType === CD.CHART_MAIN_TICK) {
            return;
        }
        switch(type) {
            case CD.SMA:
                this.m_indexCtrl[type] = (boolval)? new ChartSMACtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.EMA:
                this.m_indexCtrl[type] = (boolval)? new ChartEMACtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.WMA:
                this.m_indexCtrl[type] = (boolval)? new ChartWMACtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.SMMA:
                this.m_indexCtrl[type] = (boolval)? new ChartSMMACtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.EMMA:
                this.m_indexCtrl[type] = (boolval)? new ChartEMMACtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.BB:
                this.m_indexCtrl[type] = (boolval)? new ChartBBCtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.ICHI:
                this.m_indexCtrl[type] = (boolval) ? new ChartICHICtrl(this.m_common, this.m_headerTree) : null;
                if (this.m_indexCtrl[type] === null) {
                    this.m_info.setFwdEntryNum(0);
                }
                break;
            case CD.ENV:
                this.m_indexCtrl[type] = (boolval)? new ChartENVCtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.VS:
                this.m_indexCtrl[type] = (boolval)? new ChartVSCtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.HLB:
                this.m_indexCtrl[type] = (boolval)? new ChartHLBCtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.PVT:
                this.m_indexCtrl[type] = (boolval)? new ChartPVTCtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.PAR:
                this.m_indexCtrl[type] = (boolval)? new ChartPARCtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.HMA:
                this.m_indexCtrl[type] = (boolval)? new ChartHMACtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.LRT:
                this.m_indexCtrl[type] = (boolval)? new ChartLRTCtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.TBRK:
                this.m_indexCtrl[type] = (boolval)? new ChartTBRKCtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.TKAGI:
                this.m_indexCtrl[type] = (boolval)? new ChartTKAGICtrl(this.m_common, this.m_headerTree) : null;
                break;
            case CD.VWAP:
                this.m_indexCtrl[type] = (boolval)? new ChartVWAPCtrl(this.m_common, this.m_headerTree) : null;
                break;
            default:
                this.m_indexCtrl[type] = null;
                break;
        }

        this.m_changeChart = true;
    }
    //====================================================================
    //  指標データ算出
    //====================================================================
    resetIndexData(id = CD.CHART_INDEX_ALL) {

        this.m_headerTree.headerType.length = 0;
        this.m_headerTree.headerDetail.length = 0;

        // 有効インデックスリセット
        for (let i = 0; i < this.m_indexCtrl.length; i++) {
            if(this.m_indexCtrl[i] !== null) {
                this.m_indexCtrl[i].resetIndexData();
            }
        }

        let pHist = this.m_info.getCurrentHist();
        let dataType = pHist.getDataType();
        //if (CD.CHART_INDEX_ALL) {
            // 転換点検出
            this.m_REV.setParameter(10);
            this.m_REV.setIndexValue(pHist.mChartList);
        //}
    }
    updateIndexData(ix) {
        // 有効インデックス更新
        for (let i = 0; i < this.m_indexCtrl.length; i++) {
            if(this.m_indexCtrl[i] !== null) {
                this.m_indexCtrl[i].updateIndexData(ix);
            }
        }
    }
    resetHeader() {
        this.m_headerTree.headerDetail.length = 0;
        this.m_headerTree.headerType.length = 0;
        for (let i = 0; i < this.m_indexCtrl.length; i++) {
            if(this.m_indexCtrl[i] !== null) {
                this.m_indexCtrl[i].updateHeader();
            }
        }
        const detail = this.m_headerTree.headerDetail;
        const hdType = this.m_headerTree.headerType;
    }
    //==============================================================================
    //	押下したインデックスコントロール取得
    //==============================================================================
    getSettingIndexCtrl() {
        const ix = this.m_headerTree.getPushIndex();
        if (ix < 0) return null;
        let type = this.m_headerTree.headerType[ix];
        return this.m_indexCtrl[type];
    }
    //==============================================================================
    //	押下したインデックスコントロールのクローズ
    //==============================================================================
    closeIndexCtrl() {
        const ix = this.m_headerTree.getPushIndex();
        if (ix < 0) return null;
        let type = this.m_headerTree.headerType[ix];
        this.m_indexCtrl[type] = null;
    }
    //==============================================================================
    //	パラメータ更新
    //==============================================================================
    updateIndexParam() {
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            indexCtrl.updateIndexParam();
        }
    }
    // 更新はせず表示上のみ初期値リセット
    resetDefaultParam() {
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            indexCtrl.resetSlider();
            indexCtrl.resetIndexColor();
        }   
    }
    resetIndexParam() {
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            indexCtrl.resetIndexParam();
        }
    }
    updateColorParam() {
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            indexCtrl.updateColorParam();
        }
    }
    setColorPickerCurrnt() {
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            indexCtrl.setColorPickerCurrnt();
        }
    }
    resetIndexColor() {
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            indexCtrl.resetIndexColor();
        }
    }
    //==============================================================================
    //	[描画] パラメータ設定
    //==============================================================================
    drawParamSetting(rc) {
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            indexCtrl.drawParamSetting(rc);
        }
    }
    //==============================================================================
    //	[描画] カラーピッカー設定
    //==============================================================================
    drawColorSetting(rc) {
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            indexCtrl.drawColorSetting(rc);
        }
    }
    //==============================================================================
    //	[描画] バックスケール文字列
    //==============================================================================
    drawBackScaleString(ix_arry, xpos_arry) {
        const hist = this.m_info.getCurrentHist();
        const data_type = hist.getDataType();

        // TICK以外
        const end_ypos = this.m_drawInf.getChartAreaEndPosYWithMgn();
        for (let i = 0; i < CD.BK_LINE_MAX; i++) {
            if(ix_arry[i] < 0){
                break;
            }

            let pt = hist.mChartList[ix_arry[i]];

            if(i + 1 < CD.BK_LINE_MAX){
                if(ix_arry[i] + 1 === ix_arry[i+1]){
                    // 次が日中開始時の場合はSKIP
                    continue;
                }
            }

            let xpos = xpos_arry[i];
            if(data_type === CD.CHART_DATA_MIN){
                this.m_cc.drawStringL(pt.mTime, xpos - 14, end_ypos);
            }else if(data_type == CD.CHART_DATA_TICK){
                this.m_cc.drawStringL(pt.mSecTime, xpos - 17, end_ypos);
            }else if (data_type === CD.CHART_DATA_DAY) {
                const valStr = pt.mDate.substring(2, 7);
                this.m_cc.drawStringL(valStr, xpos - 14, end_ypos);
            }else if(data_type === CD.CHART_DATA_WEEK){
                const valStr = pt.mDate.substring(2, 7);
                this.m_cc.drawStringL(valStr, xpos - 14, end_ypos);
            }else if(data_type === CD.CHART_DATA_MONTH){
                const valStr = pt.mDate.substring(0, 4);
                this.m_cc.drawStringL(valStr, xpos - 14, end_ypos);
            }		
        }
    }
    //==============================================================================
    //	[描画]メイン(枠外領域クリア)
    //==============================================================================
    drawAfter(isShowHeader, areaIndex) {
        
        // 枠外領域クリア&スケール描画(横)
        let degits = this.m_common.drawOutOfChartArea(isShowHeader); //戻り値(小数点桁数)

        // スケール描画(縦)
        //int multiType = m_info->GetMultiChartType();
        //if(multiType != CHART_TICK){
        //    // TICK以外
           this.drawBackScaleString(this.m_common.m_backLineEntry, this.m_common.m_backLineXpos);
        //}else{
        //    // TICK
        //    DrawBackScaleStringForTick(qpt, m_backLineEntry, m_backLineXpos );
        //}

        // // カレントマウス位置取得
        const x = 0, y = 1;
        const mouse_pos = this.m_common.getMousePos();
        
        // 十字線描画
        const dummy_entry_width = this.m_info.getDummyEntryWidth();
        //let curIndex = DrawClossLine(qpt, mouse_pos_x, mouse_pos_y, dummy_entry_width, m_totalMaxEntry, degits);
        let curIndex = this.drawClossLine(mouse_pos[x], mouse_pos[y], dummy_entry_width, this.m_totalMaxEntry, degits);

        // 現在値表示(更新時)
       //let hist = this.m_info.getCurrentHist();
        if(0 < this.m_lastXpos){
        //  if(multiType != CHART_TICK){
                //this.drawCurrentPrice(qpt, pHist->GetLastEntry(), m_lastXpos);
        //  }
        }

        // チャートタイトル表示
        const hdr_x1 = this.m_drawInf.getChartAreaBgnPosX() + 5;
        const hdr_y1 = this.m_drawInf.getChartAreaBgnPosYWithMgn() + 1;
        const header_rc = { left: hdr_x1, top: hdr_y1, right: hdr_x1 + 10, bottom: hdr_y1 + 10 };
        this.m_headerTree.draw(header_rc, this.m_headerTree.headerDetail);

        // 入替ボタン表示
        let endPosX = this.m_drawInf.getAreaWidth();
        let btnWidth = 40;
        let btnHeight = 15;
        let btnBgnPosX = endPosX - btnWidth - btnWidth;
        let btnBgnPosY = this.m_drawInf.getAreaTop() + ((areaIndex === 0)? 2 : 5);
        this.m_common.drawSwapButton(btnBgnPosX, btnBgnPosY, btnWidth, btnHeight, areaIndex);
    }
    //==============================================================================
    //	[描画]メイン
    //==============================================================================
    draw(rc) {
        const area_width = rc.right - rc.left;
        const area_height = rc.bottom - rc.top;
        const szHistList = this.m_info.getCurHistSize();
        // 表示モード取得(機能してない)
        const disp_mode = this.m_info.getDispMode();

        // 初期塗り潰し
        this.m_cc.drawBackground(rc.left, rc.top, area_width, area_height);

        // Y軸領域終了点余白幅
        const chart_margin = 20;	// 上下余白サイズ
        this.m_drawInf.setChartAreaInnerMargin(chart_margin);
        this.m_drawInf.setChartAreaMarginBtm(30 + 6);    // 30 = スプリッタのサイズ考慮
        this.m_drawInf.setChartAreaMarginTop(8 + chart_margin);

        // オリジナルにない(イベントで制御しているため)
        this.m_drawInf.setAreaTop(rc.top);
        this.m_drawInf.setAreaHeight(area_height);

        // スケール用マージン調整
        this.m_common.settLeftRighAreaMargin();

        let pHist = this.m_info.getCurrentHist();

        // 描画値段オブジェクト倍数セット
        this.m_drawInf.setScaleValueDec(pHist.mDecimalScale);
        // 描画値段小数点有効桁数セット
        this.m_drawInf.setValidDegits(pHist.mValiｄDegits);
        // 一目均衡表パラメータ取得
        let fwdEntryNum = 0;
        if (this.m_indexCtrl[CD.ICHI] !== null) {
            fwdEntryNum = this.m_indexCtrl[CD.ICHI].getFwdEntryNum();
            this.m_info.setFwdEntryNum(fwdEntryNum);
        }

        // 全体表示モード
	    let all_disp_mode = false;
        // 可変表示モード
        let var_disp_mode = this.m_info.isVariableMode();
        // 可変モード描画値
        let var_bgn_ix = this.m_info.getVariableBgnIndex();
        let var_end_ix = this.m_info.getVariableEndIndex();
        if(var_bgn_ix < 0 || var_end_ix < 0){
            var_disp_mode = false;
        }
	    // 通常表示モード
	    let nml_mode = false;
        if(!all_disp_mode && !var_disp_mode) nml_mode = true;

        // エントリ描画サイズ取得
        this.m_common.copyEntryDrawWidth();

        let var_size = 0;
        if (var_disp_mode) {
            //横軸スケール値設定
            var_size = var_end_ix - var_bgn_ix + 1;
            this.m_drawInf.setScaleValueLeft(1);
            this.m_drawInf.setScaleValueRight(var_size);
        }

        // リサイズ判定(リサイズ/固定エリア/エントリサイズ変更)
        let resize = false;
        const entrySize = this.m_drawInf.getEntryWidth();
        if (this.m_drawAreaSizeX != area_width || this.m_entryWidth != entrySize) {
            resize = true;
            this.m_drawAreaSizeX = area_width;
            this.m_entryWidth = entrySize;
        }
        // 描画エリアサイズ退避(幅)
        this.m_drawInf.setAreaWidth(area_width);
        // エリア内横幅調整
        this.m_drawInf.setChartAreaWidth();
        this.m_info.setChartAreaWidth(this.m_drawInf.getChartAreaWidth());
        // エントリ描画サイズ設定
        if (all_disp_mode) {
            //this.m_common.setEntryDrawWidth(this.m_common,GetEntryDrawWidthForAllDisp(szHistList + fwdEntryNum));
        } else if (var_disp_mode) {
            this.m_common.setEntryDrawWidth(this.m_common.getEntryDrawWidthForAllDisp(var_size));
        }

        // 描画可能件数
        let dispEntryCnt = 0;
        if (all_disp_mode) {
        } else if(var_disp_mode) {
            dispEntryCnt = var_size;
            this.m_dispEntryCount = dispEntryCnt;
            this.m_dispStartIndex = 0;
        } else {
            dispEntryCnt = this.m_drawInf.getCanDrawCount() >> 0;
            if (this.m_dispEntryCount != dispEntryCnt) {
                resize = true;
                this.m_dispEntryCount = dispEntryCnt;
            }
        }

        // エントリが存在しない場合は初期表示
        if (szHistList === 0) {
            this.m_drawInf.setChartAreaHeight(area_height - this.m_drawInf.getChartAreaMarginBtm());
            this.drawEmpty(this.m_info.getCurrentHist().mLastClose);
            this.m_dispEntryCount = 0;
            resize = false;
            return;
        }

        // 最終エントリ更新
        if (this.m_techLastIndex !== pHist.mLastIndex) {
            if (this.m_dispLastIndex < pHist.mLastIndex) {
                this.m_changeChart = true;
            }
            this.m_techLastIndex = pHist.mLastIndex;
        }

        // 描画開始インデックス取得
        let bgnIndex = 0;
        let dummy_entry_width = 0;
        let mos_posx = this.m_info.getMousePosX();
        let mos_posy = this.m_info.getMousePosY();
        const isAutoDisp = this.m_info.getDispAutoUpdate();
        if(var_disp_mode){
            bgnIndex = var_bgn_ix;
            if (var_bgn_ix < 0) { var_bgn_ix = 0; }
            if (this.m_mosPushPrvX !== mos_posx && 
                this.m_mosPushStat && 
                0 < this.m_mosPushPrvX &&
                this.m_drawInf.isInnerChartAreaX(mos_posx) &&
                rc.top < mos_posy &&
                mos_posy < rc.bottom - this.m_drawInf.m_areaMarginBottom &&
                !this.m_info.isTechToolOn())
            {
                // マウス押下状態／直近マウス位置セット済／描画件数以上にエントリあり／ツール類全て無効状態
                let chartAreaWidth = this.m_drawInf.getChartAreaWidth();
                if(mos_posx < this.m_mosPushPrvX){
                    // 左スライド(TO←FROM)
                    // 移動距離→エントリ数
                    let entryWidth = chartAreaWidth / dispEntryCnt;
                    let move_range = 0;
                    if (0.0 < entryWidth) {
                        move_range = ((this.m_mosPushPrvX - mos_posx) / entryWidth) >> 0;
                    }
                    if (move_range <= 0) move_range = 1;
                    
                    // エントリ算出
                    let wk_endIndex = var_end_ix + move_range;
                    // 最大要素チェック
                    let max_idx = szHistList + fwdEntryNum;
                    if (max_idx <= wk_endIndex) {
                        wk_endIndex = max_idx - 1;
                    }
                    let wk_bgnIndex = wk_endIndex - (dispEntryCnt - 1);

                    // 開始位置更新
                    bgnIndex = wk_bgnIndex;
                    this.m_info.setVariableBgnIndex(wk_bgnIndex);
                    this.m_info.setVariableEndIndex(wk_endIndex);
                    var_bgn_ix = wk_bgnIndex;
                    var_end_ix = wk_endIndex;
                    
                    // 左スライド = 自動更新
                    this.m_info.setDispAutoUpdate(true);
                }else if(this.m_mosPushPrvX < mos_posx){
                    // 右スライド
                    // 移動距離→エントリ数
                    let entryWidth = chartAreaWidth / dispEntryCnt;
                    let move_range = 0;
                    if (0.0 < entryWidth) {
                        move_range = ((mos_posx - this.m_mosPushPrvX) / entryWidth) >> 0;
                    }
                    if (move_range <= 0) move_range = 1;
                    // エントリ算出(FROM→TO)
                    let wk_bgnIndex = var_bgn_ix - move_range;
                    // 最小要素チェック
                    if(wk_bgnIndex < 0) {
                        wk_bgnIndex = 0;
                    }
                    let wk_endIndex = wk_bgnIndex + (dispEntryCnt - 1);
                    // 開始位置更新
                    bgnIndex = wk_bgnIndex;
                    this.m_info.setVariableBgnIndex(wk_bgnIndex);
                    this.m_info.setVariableEndIndex(wk_endIndex);
                    var_bgn_ix = wk_bgnIndex;
                    var_end_ix = wk_endIndex;

                    // 右スライド = 自動更新
                    this.m_info.setDispAutoUpdate(false);
                }
                //直近押下位置退避(X)
                this.m_mosPushPrvX = mos_posx;
            }else if (this.m_changeChart && dispEntryCnt < szHistList + fwdEntryNum) {
                // 自動更新有無判定
                if(isAutoDisp){
                    bgnIndex = szHistList - dispEntryCnt + 1;
                    if (bgnIndex < 0) {
                        bgnIndex = 0;
                    }
                    //開始位置更新
                    var_bgn_ix = bgnIndex;
                    var_end_ix = bgnIndex + (dispEntryCnt - 1);
                    this.m_info.setVariableBgnIndex(var_bgn_ix);
                    this.m_info.setVariableEndIndex(var_end_ix);
                }
            }
    
        } else if (this.m_changeChart && dispEntryCnt < szHistList + fwdEntryNum) {
            //メインチャート切替イベント
            //初期化後の初回開始時と同様処理
            //基本的に一目でも最終エントリを表示するが、エントリが0未満になる場合は調整
            if(isAutoDisp){
                bgnIndex = szHistList - dispEntryCnt;
            }else{
                bgnIndex = this.m_dispLastIndex - dispEntryCnt + 1;
            }
            if (bgnIndex < 0) {
                bgnIndex = 0;
            }
        } else if (szHistList + fwdEntryNum <= dispEntryCnt) {
            //描画エントリ数 < 描画可能件数
            dummy_entry_width = entrySize * Math.abs(dispEntryCnt - (szHistList + fwdEntryNum));
            bgnIndex = 0;
        } else if ((this.m_mosPushPrvX != mos_posx) && (this.m_mosPushStat) && (0 < this.m_mosPushPrvX) &&
		    (this.m_drawInf.isInnerChartAreaX(mos_posx)) &&
            (rc.top < mos_posy) && (mos_posy < rc.bottom - this.m_drawInf.m_areaMarginBottom) &&
            !this.m_info.isTechToolOn()
        ) {
            //マウス押下状態／直近マウス位置セット済／描画件数以上にエントリあり／ツール類全て無効状態
            //ノーマル状態でマウスプッシュ中
            if (mos_posx < this.m_mosPushPrvX) {
                //左スライド
                //移動距離→エントリ数
                let move_range = ((this.m_mosPushPrvX - mos_posx) / entrySize) >> 0;
                if (move_range <= 0) move_range = 1;
                //if (2 < move_range) move_range = 2;
                //エントリ算出
                let wk_bgnIndex = this.m_info.getBeginIndex() + move_range;
                //最大要素チェック
                let max_bgnidx = szHistList + fwdEntryNum - dispEntryCnt;
                if (max_bgnidx < wk_bgnIndex) wk_bgnIndex = max_bgnidx;
                //開始位置更新
                bgnIndex = wk_bgnIndex;
                if (bgnIndex === max_bgnidx) {
                    this.m_mosPushStat = false;
                    this.m_mosPushPrvX = 0;
                }
                // 左スライド = 自動更新
                this.m_info.setDispAutoUpdate(true);
            } else if (this.m_mosPushPrvX < mos_posx) {
                //右スライド
                //移動距離→エントリ数
                let move_range = ((mos_posx - this.m_mosPushPrvX) / entrySize) >> 0;
                if (move_range <= 0) move_range = 1;
                //if (2 < move_range) move_range = 2;
                //エントリ算出
                let wk_bgnIndex = this.m_info.getBeginIndex() - move_range;
                //最小要素チェック
                if (wk_bgnIndex < 0) wk_bgnIndex = 0;
                //開始位置更新
                bgnIndex = wk_bgnIndex;
                if (bgnIndex === 0) {
                    this.m_mosPushStat = false;
                    this.m_mosPushPrvX = 0;
                }
                // 右スライド = 自動更新
                this.m_info.setDispAutoUpdate(false);
            } else {
                bgnIndex = this.m_info.getBeginIndex();
            }
            //直近押下位置退避(X)
            if (this.m_mosPushStat) {
                this.m_mosPushPrvX = mos_posx;
            }
        } else if (-1 === this.m_info.getBeginIndex()) {
            //初期化後の初回開始時
            bgnIndex = szHistList + fwdEntryNum - dispEntryCnt;
        } else if (resize && this.m_dispLastIndex != 0) {
            //現在表示中の最終エントリから逆算して開始位置を算出
            bgnIndex = this.m_dispLastIndex - dispEntryCnt + 1;
        } else if (szHistList <= this.m_dispLastIndex && this.m_indexCtrl[CD.ICHI] === null) {
            bgnIndex = szHistList - dispEntryCnt;
        } else {
            //スクロール開始位置を反映
            bgnIndex = this.m_info.getBeginIndex();
            // 自動更新有無判定
            if(isAutoDisp){
                if ((szHistList + fwdEntryNum) - bgnIndex < dispEntryCnt) {
                    //スクロール位置からのエントリが可能件数より少ない場合は初期表示
                    //シングルメインと異なり基本的に増減はないので実質入らない
                    bgnIndex = szHistList - dispEntryCnt;
                }
            }
        }
        if (bgnIndex < 0) bgnIndex = 0;
        bgnIndex = bgnIndex >> 0;
        // 描画開始インデックス更新
        this.m_info.setBeginIndex(bgnIndex);
        // 描画送り幅更新
        this.m_info.setDummyEntryWidth(dummy_entry_width);
        // 描画インデックス変更判定
        if ((szHistList + fwdEntryNum) <= dispEntryCnt && 0 < this.m_dispEntryCount && pHist.mMaxPrice != 0) {
            //常に全エントリの最大値/最小値を採用
            this.m_dispInfo.dispMaxPrice = pHist.mMaxPrice;
            this.m_dispInfo.dispMinPrice = pHist.mMinPrice;
        } else {
            //サイズ変更有の場合は最大/最小値段取得
            if (bgnIndex != this.m_dispStartIndex || resize || this.m_changeChart || this.m_changeSizeFlag) {
                this.m_changeChart = false;
                this.m_changeSizeFlag = false;
                this.m_dispStartIndex = bgnIndex;
                this.m_dispEntryCount = dispEntryCnt;
                
                //if(multiType == CHART_TBYT){
                //    GetTByTRange(scaleGetBgnix, scaleGetCount, m_dispMaxPrice, m_dispMinPrice, m_drawGraphSw);
                //}else if(multiType == CHART_TICK){
                //    GetTickRange(scaleGetBgnix, scaleGetCount, m_dispMaxPrice, m_dispMinPrice, m_drawGraphSw);
                //}else{
                    this.getPriceRange(bgnIndex, dispEntryCnt);
                //}

                // 横軸スケール値設定
                let sup = this.m_dispInfo.dispMaxPrice % this.m_common.m_decPoint[pHist.mDecimalScale];
                if(0 < sup){
                    //小数有
                    this.m_dispInfo.dispMaxPrice = this.m_dispInfo.dispMaxPrice + this.m_common.m_decPoint[pHist.mDecimalScale];
                }
                // var max_a = (this.m_dispInfo.dispMaxPrice >> 0) * 100;
                // var max_b = this.m_dispInfo.dispMaxPrice * 100;
                // if (max_a < max_b) {
                //     //小数有
                //     this.m_dispInfo.dispMaxPrice = this.m_dispInfo.dispMaxPrice + 1;
                // }
                	//最大最小値が0の場合は前日終値をセット
                if(this.m_dispInfo.dispMaxPrice === 0){
                    this.m_dispInfo.dispMaxPrice = this.m_dispInfo.dispMaxPrice = pHist.getLastClose();
                }
                //最大値 == 最小値の場合
                if(this.m_dispInfo.dispMaxPrice === this.m_dispInfo.dispMinPrice){
                    let wk = Math.floor(this.m_dispInfo.dispMaxPrice / this.m_common.m_decPoint[pHist.mDecimalScale]);
                    // 同一値段の場合は上下10％で調整
                    wk = wk * 0.01;
                    if(wk === 0){
                        wk = 1 * this.m_common.m_decPoint[pHist.mDecimalScale];
                    }
                    this.m_dispInfo.dispMaxPrice += wk; 
                    this.m_dispInfo.dispMinPrice -= wk;
                    if(this.m_dispInfo.dispMinPrice < 0) this.m_dispInfo.dispMinPrice = 0;
                }
            }
        }

        // 描画ループ終了判定値セット
        let max_entry = szHistList;
        if (!all_disp_mode && var_disp_mode) {
            max_entry = var_end_ix + 2; // 領域外まで描画させる
            if(szHistList <= max_entry){
                fwdEntryNum = max_entry - szHistList;
                max_entry = szHistList;
            }else{
                //fwdEntryNum = 0;
            }
        }
        // 合計最大エントリセット(一目の先行エントリを加算)
        const total_max = max_entry + fwdEntryNum;

        // 縦軸スケール値（調整前取得）
        var height = this.m_drawInf.getChartAreaHeightNotAdjust();
        //SetScaleRange(m_dispInfo.m_dispMaxPrice, m_dispInfo.m_dispMinPrice, false, CHART_VERTICAL, decDegits);
        this.m_common.setScaleRangeValue(
            this.m_dispInfo.dispMaxPrice >> 0,
            this.m_dispInfo.dispMinPrice >> 0,
            false,
            CD.CHART_VERTICAL,
            pHist.mDecimalScale
        );
        // エリア内縦幅調整(余りを切捨て調整)
        const scaleHeight = this.m_drawInf.getScaleRangeNum();
        height = Math.floor(height / scaleHeight) * scaleHeight;
        // エリア高さ調整確定値セット
        this.m_drawInf.setChartAreaHeight(height);
        // 縦軸描画開始位置取得
        this.m_drawInf.setChartAreaBgnPosY();
        // チャートY軸表示モード設定
        //var disp_mode = this.m_info.getDispMode();
        //this.m_drawInf.setDispMode(disp_mode);
        // スケール情報設定
        this.m_common.setDrawRangeHeight();

        // チャート形状
        const chart_style = this.m_info.getChartStyle();
        // ライン足前処理(描画)
        if(chart_style === CD.STYLE_POLLY_LINE){
            this.drawPolyGraphLine(bgnIndex, dispEntryCnt, dummy_entry_width, var_disp_mode);
        }	
        // ボリンジャーバンド前処理
        //if (this.m_drawGraphSw[CD.BB]) {
        //  drawPolyGraphBB(hdc, bgnIndex, dispEntryCnt, dummy_entry_width);
        //}

        //スケールライン描画
        //暫定戻り値(最下部ライン)
        this.m_common.drawRangeOfRate();
        //========================================================================
        // ライングラフ用Y軸情報用
        let ypos_line = 0;
    	// カギ足開始位置退避用
        // (初回時のみ開始線上に合わせる(左縦線塗潰しのため-1))
        if(this.m_indexCtrl[CD.TKAGI] !== null){
            this.m_indexCtrl[CD.TKAGI].m_kagiOpnXpos = this.m_drawInf.getChartAreaBgnPosX() - 1;
        }
        // 新値足開始位置退避用
        let	brkOpnXpos = this.m_drawInf.getChartAreaBgnPosX();
        let brkOpnYpos1 = 0;	//新値足開始値段
        let brkOpnYpos2 = 0;	//新値足終了値段
        // 指標グラフ用Y軸情報用
        let curDate = [];
        let curWeek = -1;
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();

        // チャート描画開始位置
        let xpos = this.m_drawInf.getChartAreaBgnPosX() + dummy_entry_width;
        //***************************************************************
        // ローソク足描画
        //***************************************************************
        // 表示エントリサイズ取得処理
        let entry_width = this.m_drawInf.getEntryWidth();
        let candle_width = this.m_drawInf.getCandleWidth();
        let ix = 0;
        //let chart_type = this.m_info.m_pCurdata.mChartType;
        let prev_scale_xpos = 0;
        let prev_back_xpos = 0;
        let least_margin = 30;
        let sec_type = pHist.getSecType();

        // バックライン(縦)最終エントリ初期化
        this.m_common.m_bkLineEntryIndex = 0;
        // バックライン(縦)エントリ初期化
        this.m_common.m_backLineEntry[0] = -1;
        let prevIndexForTick = bgnIndex;
        for (ix = bgnIndex; ix < max_entry; ix++) {
            let pt = pHist.mChartList[ix];

			// 分/日/週/月の場合
			//curWeek = pt->mDayOfWeek; //現在判定には未使用
            let needBackLine = false;
            if (this.m_chartType === CD.CHART_MAIN_TICK) {
                needBackLine = this.m_common.isDrawBackLineForTick(pt, pHist.mChartList[prevIndexForTick], xpos);
                prevIndexForTick = ix;
            }else{
                needBackLine = this.m_common.isDrawBackLine(pt, curDate, curWeek, xpos);
            }

			if(needBackLine){
				let isDrawJudge = false;
				let isDateChange = false;
				// 日付変更エントリ検出(変更時は必ず背景線描画)
				if (0 < this.m_common.m_bkLineEntryIndex && this.m_common.m_backLineEntry[this.m_common.m_bkLineEntryIndex - 1] + 1 == ix) {
					if (pHist.getDataType() === CD.CHART_DATA_MIN) {
						isDrawJudge = true;
						if (0 < ix && pHist.mChartList[ix-1].m_Date != pt.mDate) {
							isDateChange = true;
						}
					}
				}
				// 描画間隔調整判定
				if (0 === prev_back_xpos || prev_back_xpos + least_margin < xpos) {
					isDrawJudge = true;
				}
				// 描画可能判定
				if (isDrawJudge) {
					let back_xpos = xpos;
					if (!nml_mode && 0 <= this.m_info.getVariableBgnIndex()) {
                        let [ret_xpos, wentry_width, wcandle_width] = this.m_common.getVariableEntryWidth(ix, total_max);
                        back_xpos = ret_xpos;
                        back_xpos += (wentry_width / 2) >> 0; // wentry_width / 2
					} else {
						let entry_pos = this.m_drawInf.getCandleWidth() >> 1;
                        back_xpos = dummy_entry_width + (this.m_common.getEntryToPos(ix) >> 0) + entry_pos;
                    }
                    //this.m_common.drawBackScaleLine(xpos + xLinePoint, pt, prev_scale_xpos, true);
                    let retVal = this.m_common.drawBackScaleLine(back_xpos + 1, pt, prev_scale_xpos, isDateChange);
                    prev_scale_xpos = retVal[1];
					if (retVal[0]) {
						// 描画情報退避(スケール文字列用)
						if (this.m_common.m_bkLineEntryIndex < CD.BK_LINE_LAST) { //最大本数以内
							this.m_common.m_backLineXpos[this.m_common.m_bkLineEntryIndex] = back_xpos;
							this.m_common.m_backLineEntry[this.m_common.m_bkLineEntryIndex++] = ix;
							this.m_common.m_backLineEntry[this.m_common.m_bkLineEntryIndex] = -1;
						}
					}
					prev_back_xpos = back_xpos;
				}
			}

            //描画処理(初回のTICKが来るまでは)
            //if (pt.mDataStatus == CD.INIT) {
            //当日足初期化状態(非表示とする)
            //    xpos += entry_width;
            //} else if (this.m_chartType == CD.CHART_CANDLE) {

			// 表示エントリサイズ取得処理(可変)
			if (var_disp_mode) {
                let ret_xpos;
                [ret_xpos, entry_width, candle_width] = this.m_common.getVariableEntryWidth(ix, total_max);
            }

            // チャート形状
            if (this.m_chartType === CD.CHART_MAIN_TICK) {
                xpos += this.m_drawInf.getEntryWidth();
            }else{
                // 通常(TICK以外)
                switch (chart_style) {
                    case CD.STYLE_CANDLE:   // ローソク足
                        xpos = this.drawStick(pt, xpos, entry_width, candle_width, sec_type);
                        break;
                    case CD.STYLE_POLLY_LINE:
                    case CD.STYLE_LINE:     // ライン足
                        xpos += this.m_drawInf.getEntryWidth();
                        break;
                    case CD.STYLE_BAR:      // バー：３本値（始値省略）
                        xpos = this.drawBar(pt, xpos, entry_width, candle_width, chart_style, sec_type);
                        break;
                    case CD.STYLE_BAR_FULL: // バー：４本値
                        xpos = this.drawBar(pt, xpos, entry_width, candle_width, chart_style, sec_type);
                        break;
                    case CD.STYLE_BREAK:    // 時系列新値足(+ローソク足)
                        let bkXPOS = xpos;
                        xpos = this.drawStick(pt, xpos, entry_width, candle_width, sec_type);
                        if (this.m_indexCtrl[CD.TBRK] !== null) {
                            [bkXPOS, brkOpnXpos, brkOpnYpos1, brkOpnYpos2] = this.m_indexCtrl[CD.TBRK].drawRecordChart(ix, bkXPOS, entry_width, candle_width, brkOpnXpos, brkOpnYpos1, brkOpnYpos2);
                        }
                        break;
                    case CD.STYLE_KAGI:     // 時系列カギ足(+ローソク足)
                        xpos = this.drawStick(pt, xpos, entry_width, candle_width, sec_type);
                        break;
                    default:
                        xpos += entry_width;
                        break;
                }
            }

			if(!nml_mode){
				// 全体表示 OR 可変表示モード
				xpos = this.m_drawInf.cnvValueToPosX((ix+1) - bgnIndex);
			}

            //if(chart_style !== CD.STYLE_BREAK){
                if(this.m_info.isRevPoint()){
                    // 転換点表示
                    this.drawReversePoint(this.m_cc, ix, pHist.mDataType, xpos);
                }
            //}

            //エントリ終了判定
            if (nml_mode) {
                // 通常表示モード
                // 次回の足が描画出来なければ抜ける
                if (chartEndPosX < xpos + candle_width) {
                    break;
                }
            }

        }
        this.m_dispLastIndex = ix;
        //***************************************************************
        // 一目均衡表雲描画
        //***************************************************************
        if (this.m_indexCtrl[CD.ICHI] !== null) {
            this.drawPolyGraphICHI(bgnIndex, dispEntryCnt, dummy_entry_width);
        }
        //***************************************************************
        // グラフ描画
        //***************************************************************
        // キャンドル部分中心マージン(可変の場合初回キャンドルサイズ取得)
        if(var_disp_mode){
            let ret_xpos;
            [ret_xpos, entry_width, candle_width] = this.m_common.getVariableEntryWidth(bgnIndex, total_max);
        }
        const mgn = (candle_width / 2) >> 0;
        // 開始インデックス初期化
        ix = 0;
        // リセット
        let prv_xpos = 0;
        let cur_xpos = this.m_drawInf.getChartAreaBgnPosX() + dummy_entry_width + mgn;
        let elipse_width = 0;
        if(var_disp_mode){
            let ret_xpos, wk_entry_width, wk_candle_width;
            [ret_xpos, wk_entry_width, wk_candle_width] = this.m_common.getVariableEntryWidth(ix, total_max);
            elipse_width = this.m_common.getEntryElipseWidth(wk_entry_width);
        }else{
            elipse_width = this.m_common.getEntryElipseWidth(this.m_drawInf.getEntryWidth());
        }

        for (ix = bgnIndex; ix < max_entry; ix++) {
            const pt = pHist.mChartList[ix];
            if (this.m_chartType !== CD.CHART_MAIN_TICK) {
                if (chart_style === CD.STYLE_LINE || chart_style === CD.STYLE_POLLY_LINE) {
                    //ライン足
                    ypos_line = this.drawGraph("white", pt.mClosePrice >> 0, prv_xpos, ypos_line, cur_xpos, 2.0) >> 0;
                    // 不連続マーク描画
                    //DrawAdjustMark(qpt, pt, prv_xpos );
                }
                let indexId = CD.SMA;
                if(this.m_indexCtrl[CD.SMA] !== null) {
                    // 単純移動平均線
                    this.m_indexCtrl[CD.SMA].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.EMA;
                if(this.m_indexCtrl[indexId] !== null) {
                    // 指数平滑移動平均線
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.WMA;
                if(this.m_indexCtrl[indexId] !== null) {
                    // 加重移動平均線
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.SMMA;
                if(this.m_indexCtrl[indexId] !== null) {
                    // 多重(単純)移動平均線
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.EMMA;
                if(this.m_indexCtrl[indexId] !== null) {
                    // 多重(指数)移動平均線
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.BB;
                if(this.m_indexCtrl[indexId] !== null) {
                    // ボリンジャーバンド
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.ICHI;
                if(this.m_indexCtrl[indexId] !== null) {
                    // 一目均衡表
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.ENV;
                if(this.m_indexCtrl[indexId] !== null) {
                    // エンベロープ
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.VS;
                if(this.m_indexCtrl[indexId] !== null) {
                    // ボラティリティシステム
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.HLB;
                if(this.m_indexCtrl[indexId] !== null) {
                    // HLバンド
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.PVT;
                if(this.m_indexCtrl[indexId] !== null) {
                    // ピボット
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.PAR;
                if(this.m_indexCtrl[indexId] !== null) {
                    // パラボリック
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos, candle_width);
                }
                indexId = CD.HMA;
                if(this.m_indexCtrl[indexId] !== null) {
                    // 高安移動平均
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.LRT;
                if(this.m_indexCtrl[indexId] !== null) {
                    // 回帰トレンド
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.TKAGI;
                if(this.m_indexCtrl[indexId] !== null) {
                    // 時系列カギ足
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
                indexId = CD.VWAP;
                if(this.m_indexCtrl[indexId] !== null) {
                    // VWAP
                    this.m_indexCtrl[indexId].drawGraph(ix, cur_xpos, prv_xpos);
                }
            } else {
                // TICK
                const paramColor = this.m_drawParam.m_color.TICK.c;
                const lineColor = this.m_drawParam.getColor(paramColor[2]);
                const elipseColor = this.m_drawParam.getColor(paramColor[1]);
                const fillColor = this.m_drawParam.getColor(paramColor[0]);
                ypos_line = this.drawGraph(lineColor, pt.mClosePrice, prv_xpos, ypos_line, cur_xpos) >> 0;
                let tick_elipse_width = this.m_common.getEntryElipseWidth(this.m_drawInf.getEntryWidth());
                if (0 < tick_elipse_width) {
                    let half_width = tick_elipse_width / 2 >> 0;
                    if (half_width <= 2) {
                        half_width = 2;
                        tick_elipse_width = 4;
                    }
                    const x1 = cur_xpos;
                    const y1 = this.m_drawInf.cnvValueToPosYForPrice(pt.mClosePrice) - half_width;
                    this.m_cc.drawEllipseFill(elipseColor, fillColor, x1, y1, tick_elipse_width);
                }
            }

            prv_xpos = cur_xpos;

            if(all_disp_mode){
                cur_xpos = this.m_drawInf.cnvValueToPosX(ix+1);
            }else if(var_disp_mode){
                if(ix + 1 != total_max){
                    let ret_xpos;
                    [ret_xpos, entry_width, candle_width] = this.m_common.getVariableEntryWidth(ix+1, total_max);
                    let mgn = (candle_width / 2) >> 0;
                    cur_xpos = ret_xpos + mgn;
                }
            }else{
                cur_xpos += entry_width;
            }

            //次回の足が描画出来なければ抜ける
            if (nml_mode) {
                if (chartEndPosX < cur_xpos) {
                    break;
                }
            }

        }
        //**************************************************************************
        // 時系列カギ足後処理
        //**************************************************************************
        if(this.m_indexCtrl[CD.TKAGI] !== null) {
            this.m_indexCtrl[CD.TKAGI].drawAfterGraph(ix);
        }
        //**************************************************************************
        // 一目均衡表後処理
        //**************************************************************************
        // 画面描画対象の開始エントリが先行雲のみの場合の調整
        if (this.m_indexCtrl[CD.ICHI] !== null) {
            const techData = this.m_indexCtrl[CD.ICHI].m_techData.m_data;
            const cur_ypos = this.m_indexCtrl[CD.ICHI].m_curYpos;
            const ichi_color = this.m_indexCtrl[CD.ICHI].m_paramColor;
            if (szHistList <= ix && ix < techData[TS.TI_ICHI_FWD1].length) {
                for (let i = szHistList; i < techData[TS.TI_ICHI_FWD1].length; i++) {
                    cur_ypos[TS.TI_ICHI_FWD1] = this.drawGraph(ichi_color[IDX.IV_ICHI_FWD1], techData[TS.TI_ICHI_FWD1][i], prv_xpos, cur_ypos[TS.TI_ICHI_FWD1], cur_xpos);
                    cur_ypos[TS.TI_ICHI_FWD2] = this.drawGraph(ichi_color[IDX.IV_ICHI_FWD2], techData[TS.TI_ICHI_FWD2][i], prv_xpos, cur_ypos[TS.TI_ICHI_FWD2], cur_xpos);
                    prv_xpos = cur_xpos;
                    cur_xpos += entry_width;
                    // 次回の足が描画出来なければ抜ける
                    if (nml_mode) {
                        if (chartEndPosX < cur_xpos) {
                            break;
                        }
                    }
                }
            }
        }
        //**************************************************************************
        // 描画開始インデックス更新
        //**************************************************************************
        if (this.m_indexCtrl[CD.ICHI] !== null) {
            //if(all_disp_mode){
            //    ix = szHistList + fwdEntryNum - 1;
            //}else{
                ix = ix + fwdEntryNum;
                if(bgnIndex + dispEntryCnt <= ix){
                    ix = bgnIndex + dispEntryCnt -1;
                }else if(szHistList + fwdEntryNum <= ix){
                    ix = szHistList + fwdEntryNum - 1;
                }
            //}
            this.m_info.setLastIndex(ix);
            this.m_dispLastIndex = ix;
        } else {
            if (szHistList <= ix) {
                ix = szHistList - 1;
            }
            this.m_info.setLastIndex(ix);
        }

	    // 合計最大エントリ退避
	    this.m_totalMaxEntry = total_max;

        //**************************************************************************
        // カレントマウス位置調整
        //**************************************************************************
        let mouse_pos_x = this.m_info.getMousePosX();
        let mouse_pos_y = this.m_info.getMousePosY();
        const chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosY();

        if (mouse_pos_x < chartBgnPosX) {
            mouse_pos_x = chartBgnPosX;
        } else if (chartEndPosX < mouse_pos_x) {
            mouse_pos_x = chartEndPosX;
        }
        if (mouse_pos_y < chartBgnPosY) {
            mouse_pos_y = chartBgnPosY;
        } else if (chartEndPosY < mouse_pos_y) {
            mouse_pos_y = chartEndPosY;
        }
        //**************************************************************************
        // 表示オプション
        //**************************************************************************
        if (this.m_info.isPriceVol() && disp_mode === CD.CHART_DMODE_NML) {
            // 価格帯別売買高
            this.drawVolumePerPrice(this.m_cc, bgnIndex, mouse_pos_y);
        }
        if(this.m_info.isFiboZrb()){
            // フィボナッチ(ザラバ)
            this.drawFibonacchi(this.m_cc, FIBO_ZARABA);
        }
        if(this.m_info.isFiboCls()){
            // フィボナッチ(終値)
            this.drawFibonacchi(this.m_cc, FIBO_OWARINE);
        }
        if(this.m_info.isFiboRev()){
            // フィボナッチ(基調転換)
            this.drawFibonacchiRev(this.m_cc, dummy_entry_width, total_max);
        }
        if(this.m_info.isIchiTime()){
            // 一目均衡表(時間論・基本数値)
            this.drawIchimokuTime(this.m_cc, dummy_entry_width, total_max);
        }
    }
    //==============================================================================
    //	[描画] クロスライン
    //==============================================================================
    drawClossLine(mouse_pos_x, mouse_pos_y, dummy_entry_width, max_entry) {
        let curIndex = -1;
        let decPoint = this.m_drawInf.getScaleValueDec();
        let degits = this.m_drawInf.getValidDegits();
        let chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        let chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        let chartBgnMgnPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let chartEndMgnPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
        let pHist = this.m_info.getCurrentHist();
        let szHistList = this.m_info.getCurHistSize();
        const curStrColor = this.m_drawParam.m_clrColor[IDX.CLR_CROSS_STR];	//クロスライン文字列
        if (this.m_drawInf.isInnerChartArea(mouse_pos_x, mouse_pos_y)) {

            //カレントインデックス取得
            curIndex = this.m_common.getPosToEntry(mouse_pos_x - dummy_entry_width) >> 0;
            if(this.m_dispLastIndex < curIndex){
                curIndex = this.m_dispLastIndex;
            }

            //モード別エントリ取得処理
            let xpos = 0;
            for(let i = 0; i < 2; i++){
                //カレントがチャートエリアの最右部を超えた場合のため２回
                //if(m_info->IsAllDisp()){
                //    xpos = mouse_pos_x;
                if (this.m_info.isVariableMode() && 0 <= this.m_info.getVariableBgnIndex()) {
                    let [ret_xpos, entry_width, candle_width] = this.m_common.getVariableEntryWidth(curIndex, max_entry);
                    xpos = ret_xpos + (candle_width / 2) >> 0;
                } else {
                    let entry_pos = this.m_drawInf.getCandleWidth() / 2;
                    xpos = dummy_entry_width + this.m_common.getEntryToPos(curIndex) + entry_pos;
                    //空領域が存在する場合は最初のエントリで描画を止める
                    if ((0 < dummy_entry_width && xpos <= dummy_entry_width) || curIndex < 0) {
                        curIndex = 0;
                        xpos = dummy_entry_width + this.m_common.getEntryToPos(curIndex) + entry_pos;
                    }
                }
                if(chartEndPosX < xpos){
                    //チャートエリアの最右部を超えた場合-1
                    curIndex -= 1;
                    if (curIndex < 0) {
                        return curIndex;
                    }
                }else{
                    break;
                }
            }

            xpos = xpos >> 0;
            if (this.m_info.isCrossLine()) {
                //十字線(横)
                this.m_cc.drawLine(this.m_cc.m_colCross, chartBgnPosX, mouse_pos_y, chartEndPosX, mouse_pos_y);
                //十字線(縦)
                this.m_cc.drawLine(this.m_cc.m_colCross, xpos, chartBgnMgnPosY, xpos, chartEndMgnPosY);
                this.m_info.setCrossPosX(xpos);
            }
            //カレントインデックス更新
            this.m_info.setCurIndex(curIndex);

            // スケール枠表示値段取得
            let price;
            let scale_price = this.m_drawInf.cnvPosYToValue(mouse_pos_y);
            price = this.m_common.withDecStr(scale_price, decPoint, degits);
            if (this.m_info.isCrossLine()) {
                // スケール枠(値段)(左)描画
                if (this.m_info.isScaleLeft()) {
                    this.m_cc.drawGradFill(1, mouse_pos_y - 5, chartBgnPosX - 1, mouse_pos_y + 9);
                    this.m_cc.drawStringR(price, chartBgnPosX - 10, mouse_pos_y - 6, curStrColor);
                }
                // スケール枠(値段)(右)描画
                if (this.m_info.isScaleRight()) {
                    this.m_cc.drawGradFill(chartEndPosX + 1, mouse_pos_y - 5, chartEndPosX + 60, mouse_pos_y + 9);
                    this.m_cc.drawStringL(price, chartEndPosX + 10, mouse_pos_y - 6, curStrColor);
                }
            }

            let indexPanel = this.m_common.m_indexPanel;
            indexPanel.m_date = "";

            // スケール枠(日時)
            let left_edge = chartBgnPosX + 40; //日時スケール枠左限界位置
            let right_edge = chartEndPosX - 40; //日時スケール枠右限界位置
            let rg_y1 = chartEndMgnPosY + 1;
            let rg_y2 = chartEndMgnPosY + 14;
            let rg_x1 = 0;
            let rg_x2 = 0;

            if (left_edge <= xpos && xpos <= right_edge) {
                //描画エリアが充足している場合
                rg_x1 = xpos - 30;
                rg_x2 = xpos + 30;
            } else if (xpos <= left_edge) {
                //描画エリアが不足している場合(左)
                rg_x1 = chartBgnPosX;
                rg_x2 = chartBgnPosX + 60;
            } else {
                //描画エリアが不足している場合(右)
                rg_x1 = chartEndPosX - 60;
                rg_x2 = chartEndPosX;
            }
            if (this.m_info.isCrossLine()) {
                this.m_cc.drawGradFill(rg_x1 - 2, rg_y1 + 3, rg_x2 + 2, rg_y2 + 3);
            }
            let str_xpos = rg_x1 + (((rg_x2 - rg_x1) / 2) >> 0);
            //日時文字列表示(エントリ外判定)
            if (szHistList <= curIndex && this.m_indexCtrl[CD.ICHI] !== null) {
                // 一目表示中の先行足
                if (pHist.mDataType === CD.CHART_DATA_MIN) {
                    indexPanel.m_date = "N+" + (curIndex - szHistList + 1).toString();
                    if (this.m_info.isCrossLine()) {
                        this.m_cc.drawStringC(indexPanel.m_date, str_xpos, rg_y1 + 1, curStrColor);
                    }
                } else {
                    indexPanel.m_date = "T+" + (curIndex - szHistList + 1).toString();
                    if (this.m_info.isCrossLine()) {
                        this.m_cc.drawStringC(indexPanel.m_date, str_xpos, rg_y1 + 1, curStrColor);
                    }
                }
            } else {
                if (szHistList <= curIndex){
                    curIndex = szHistList - 1;
                }
                let pt = pHist.mChartList[curIndex];
                if (pHist.mDataType === CD.CHART_DATA_MIN) {
                    if (this.m_info.isCrossLine()) {
                        if (pt.mDataStatus != CD.INIT) {
                            this.m_cc.drawStringC(pt.mTime, str_xpos, rg_y1 + 1, curStrColor);
                        }
                    }
                    if (pt.mDataStatus === CD.INIT) {
                        //当日足初期化状態(非表示とする)
                        indexPanel.m_date = "";
                    } else {
                        indexPanel.m_date = pt.mDate + " " + pt.mTime;
                    }
                } else if (pHist.mDataType === CD.CHART_MAIN_TICK) {
                    if (this.m_info.isCrossLine()) {
                        if (pt.mDataStatus != CD.INIT) {
                            this.m_cc.drawStringC(pt.mSecTime, str_xpos, rg_y1 + 1, curStrColor);
                        }
                    }
                    if (pt.mDataStatus === CD.INIT) {
                        //当日足初期化状態(非表示とする)
                        indexPanel.m_date = "";
                    } else {
                        indexPanel.m_date = pt.mDate + " " + pt.mSecTime;
                    }
                } else {
                    let sdate = this.m_common.getDateStr(pt.mDate, pHist.mDataType);
                    if (this.m_info.isCrossLine()) {
                        this.m_cc.drawStringC(sdate, str_xpos, rg_y1 + 1, curStrColor);
                    }
                    indexPanel.m_date = sdate;
                }

            }
        }
        this.setValueToIndexPanel(curIndex);
        return curIndex;
    }
    //==============================================================================
    //	[描画] 一目均衡表雲描画
    //==============================================================================
    drawPolyGraphICHI(bgnIndex, dispEntryCnt, dummy_width) {
        const szHistList = this.m_info.getCurHistSize();
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        const prmVal = this.m_techParam.getParam_ICHI(dataType);
        if ((szHistList < prmVal[0]) ||
		    (szHistList < prmVal[1]) ||
            (szHistList < prmVal[2])) {
            return;
        }
        const indexCtrl = this.m_indexCtrl[CD.ICHI];
        const techData = indexCtrl.m_techData.m_data;
        const cur_ypos = indexCtrl.m_curYpos;
        const ichi_color = indexCtrl.m_paramColor;

        let var_disp_mode = this.m_info.isVariableMode();
        let entry_width = this.m_drawInf.getEntryWidth();
        let candle_width = this.m_drawInf.getCandleWidth();
        let max_entry = 0;

        // 上限値(先行雲パラメータを加算したMAX)取得
        let true_entry = szHistList + indexCtrl.getFwdEntryNum();
        // 可変モード描画値
        let var_bgn_ix = this.m_info.getVariableBgnIndex();
        let var_end_ix = this.m_info.getVariableEndIndex();
        if (var_disp_mode && 0 <= var_bgn_ix) {
            // 最大描画エントリセット
            max_entry = var_end_ix + 2;
            if (true_entry < max_entry) {
                max_entry = true_entry;
            }
            // 初回キャンドルサイズ取得
            let ret_xpos;
            [ret_xpos, entry_width, candle_width] = this.m_common.getVariableEntryWidth(bgnIndex, max_entry);
        }else{
            max_entry = bgnIndex + dispEntryCnt;
            if (true_entry < max_entry) {
                max_entry = true_entry;
            }
            var_disp_mode = false;
        }

        let mgn = candle_width / 2;
        let xpos = this.m_drawInf.getChartAreaBgnPosX() + dummy_width + mgn;

        let polSize = (max_entry - bgnIndex) * 2;
        if(polSize <= 0){
            return;
        }

        let polArray1 = new Array(polSize + 2);
        let polArray2 = new Array(polSize + 2);
        for (let i = 0; i < polSize; i++) {
            polArray1[i] = { x: 0, y: 0 };
            polArray2[i] = { x: 0, y: 0 };
        }
        let prv_xpos_fwd = 0;
        let prv_ypos_fwd1 = 0;
        let prv_ypos_fwd2 = 0;
        let pol_ix = 0;

        for (let ix = bgnIndex; ix < max_entry; ix++) {

            if (techData[TS.TI_ICHI_FWD1].length < ix) {
                break;
            }
            if (techData[TS.TI_ICHI_FWD2].length < ix) {
                break;
            }

            //先行スパン[1]
            let xpos_fwd = xpos;
            let fwd_price_1 = techData[TS.TI_ICHI_FWD1][ix];
            let ypos_fwd1 = this.m_drawInf.cnvValueToPosYForPrice(fwd_price_1 >> 0);
            polArray1[pol_ix].x = xpos_fwd;
            polArray1[pol_ix].y = ypos_fwd1;
            //先行スパン[2]
            let fwd_price_2 = techData[TS.TI_ICHI_FWD2][ix];
            let ypos_fwd2 = this.m_drawInf.cnvValueToPosYForPrice(fwd_price_2 >> 0);
            polArray2[pol_ix].x = xpos_fwd;
            polArray2[pol_ix].y = ypos_fwd2;

            if ((fwd_price_1 == 0.0) || (fwd_price_2 == 0.0)) {
                pol_ix = 0;
            } else if (prv_ypos_fwd1 < prv_ypos_fwd2 && ypos_fwd2 <= ypos_fwd1) {
                //陽転
                //直行点取得
                let intersect = { x: 0, y: 0 };
                if (ypos_fwd2 != ypos_fwd1) {
                    this.lineIntersect(prv_xpos_fwd, prv_ypos_fwd1, xpos_fwd, ypos_fwd1,
					             prv_xpos_fwd, prv_ypos_fwd2, xpos_fwd, ypos_fwd2, intersect);
                    if (intersect.x <= this.m_drawInf.getChartAreaBgnPosX() || intersect.y <= this.m_drawInf.getChartAreaBgnPosY()) {
                        intersect.x = xpos_fwd;
                        intersect.y = ypos_fwd1;
                    }
                } else {
                    intersect.x = xpos_fwd;
                    intersect.y = ypos_fwd1;
                }
                let sz = pol_ix * 2 + 1;
                let j = pol_ix - 1;
                polArray1[pol_ix].x = intersect.x;
                polArray1[pol_ix].y = intersect.y;
                for (var i = pol_ix + 1; i < sz; i++) {
                    polArray1[i].x = polArray2[j].x;
                    polArray1[i].y = polArray2[j].y;
                    j--;
                }
                //グラフ描画
                this.m_cc.drawPolygon(indexCtrl.m_colCloudW, polArray1, sz);
                //直行点位置情報セット(次回開始地点)
                polArray1[0].x = intersect.x;
                polArray1[0].y = intersect.y;
                polArray2[0].x = intersect.x;
                polArray2[0].y = intersect.y;
                //今回位置情報セット
                polArray1[1].x = xpos_fwd;
                polArray1[1].y = ypos_fwd1;
                polArray2[1].x = xpos_fwd;
                polArray2[1].y = ypos_fwd2;
                pol_ix = 2;
            } else if (prv_ypos_fwd2 < prv_ypos_fwd1 && ypos_fwd1 <= ypos_fwd2) {
                //陰転
                //直行点取得
                let intersect = { x: 0, y: 0 };
                if (ypos_fwd2 != ypos_fwd1) {
                    this.lineIntersect(prv_xpos_fwd, prv_ypos_fwd1, xpos_fwd, ypos_fwd1,
					                prv_xpos_fwd, prv_ypos_fwd2, xpos_fwd, ypos_fwd2, intersect);
                    if ((intersect.x <= this.m_drawInf.getChartAreaBgnPosX()) || (intersect.y <= this.m_drawInf.getChartAreaBgnPosY())) {
                        intersect.x = xpos_fwd;
                        intersect.y = ypos_fwd1;
                    }
                } else {
                    intersect.x = xpos_fwd;
                    intersect.y = ypos_fwd1;
                }
                let sz = pol_ix * 2 + 1;
                let j = pol_ix - 1;
                polArray1[pol_ix].x = intersect.x;
                polArray1[pol_ix].y = intersect.y;
                for (let i = pol_ix + 1; i < sz; i++) {
                    polArray1[i].x = polArray2[j].x;
                    polArray1[i].y = polArray2[j].y;
                    j--;
                }
                //グラフ描画
                this.m_cc.drawPolygon(indexCtrl.m_colCloudB, polArray1, sz);
                //直行点位置情報セット(次回開始地点)
                polArray1[0].x = intersect.x;
                polArray1[0].y = intersect.y;
                polArray2[0].x = intersect.x;
                polArray2[0].y = intersect.y;
                //今回位置情報セット
                polArray1[1].x = xpos_fwd;
                polArray1[1].y = ypos_fwd1;
                polArray2[1].x = xpos_fwd;
                polArray2[1].y = ypos_fwd2;
                pol_ix = 2;
            } else if (ix + 1 == max_entry) {
                //最終エントリ
                let sz = (pol_ix + 1) * 2;
                let j = pol_ix;
                for (let i = pol_ix + 1; i < sz; i++) {
                    polArray1[i].x = polArray2[j].x;
                    polArray1[i].y = polArray2[j].y;
                    j--;
                }
                //陽・陰判定
                if (fwd_price_2 < fwd_price_1) {
                    this.m_cc.drawPolygon(indexCtrl.m_colCloudW, polArray1, sz);
                } else {
                    this.m_cc.drawPolygon(indexCtrl.m_colCloudB, polArray1, sz);
                }
            } else {
                pol_ix++;
            }
            //位置情報退避
            prv_xpos_fwd = xpos_fwd;
            prv_ypos_fwd1 = ypos_fwd1;
            prv_ypos_fwd2 = ypos_fwd2;

            //横軸位置更新
            if (var_disp_mode) {
                if(ix + 1 != max_entry){
                    let ret_xpos;
                    [ret_xpos, entry_width, candle_width] = this.m_common.getVariableEntryWidth(ix+1, max_entry);
                    let mgn = candle_width >> 1;
                    xpos = ret_xpos + mgn;
                }
            }else{
                xpos += entry_width;
            }
        }
        polArray1 = [];
        polArray2 = [];
    }
    //==============================================================================
    //	グラフ交点算出(一目均衡表)
    //==============================================================================
    lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4, value) {
        var m1 = 0.0;
        var m2 = 0.0;
        if (x1 != x2) {
            m1 = (y2 - y1) / (x2 - x1);
        }
        if (x3 != x4) {
            m2 = (y4 - y3) / (x4 - x3);
        }
        if (m1 == m2) {
            value.x = 0;
            value.y = 0;
            return;
        }
        var x = (m1 * x1 - m2 * x3 + y3 - y1) / (m1 - m2);
        var y = m1 * (x - x1) + y1;
        value.x = x >> 0;
        value.y = y >> 0;
    }
    //==============================================================================
    //	インデックスパネル編集
    //==============================================================================
    setValueToIndexPanel(ix) {
        var pHist = this.m_info.getCurrentHist();
        var szHistList = this.m_info.getCurHistSize();
        var pt = null;
        if ((0 <= ix) && (ix < szHistList)) {
            pt = pHist.mChartList[ix];
        }
        var dec = this.m_drawInf.getScaleValueDec();
        let indexPanel = this.m_common.m_indexPanel;
        if(pHist.mDataType === CD.CHART_MAIN_TICK) {
            indexPanel.m_indexName.push("値段");
            indexPanel.m_indexColor.push("white");
            if (pt) {
                indexPanel.m_indexValue.push(this.m_common.roundDownDecStr(pt.mOpenPrice, dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }else{
            indexPanel.m_indexName.push("始値");
            indexPanel.m_indexColor.push("white");
            indexPanel.m_indexName.push("高値");
            indexPanel.m_indexColor.push("white");
            indexPanel.m_indexName.push("安値");
            indexPanel.m_indexColor.push("white");
            indexPanel.m_indexName.push("終値");
            indexPanel.m_indexColor.push("white");
            if (pt && 0 <= pt.mVolume) {
                indexPanel.m_indexValue.push(this.m_common.roundDownDecStr(pt.mOpenPrice, dec));
                indexPanel.m_indexValue.push(this.m_common.roundDownDecStr(pt.mHighPrice, dec));
                indexPanel.m_indexValue.push(this.m_common.roundDownDecStr(pt.mLowPrice, dec));
                indexPanel.m_indexValue.push(this.m_common.roundDownDecStr(pt.mClosePrice, dec));
            } else {
                indexPanel.m_indexValue.push("-");
                indexPanel.m_indexValue.push("-");
                indexPanel.m_indexValue.push("-");
                indexPanel.m_indexValue.push("-");
            }
        }
        // 有効インデックスのパネル書込み
        for (let i = 0; i < this.m_indexCtrl.length; i++) {
            if(this.m_indexCtrl[i] !== null) {
                this.m_indexCtrl[i].setValueToIndexPanel(ix);
            }
        }
    }
    //==============================================================================
    //	[描画] 転換点表示
    //==============================================================================
    drawReversePoint(canvas, ix, type, xpos)　{
        //転換点表示
        let decPoint = this.m_drawInf.getScaleValueDec();
        let degits = this.m_drawInf.getValidDegits();
        let x1 = xpos-5;
        let y1 = 0;
        let color = this.m_drawParam.m_clrColor[IDX.CLR_REV_POINT];
        let pHist = this.m_info.getCurrentHist();
        let rev_point = this.m_REV.m_data[ix];
        //表示モード取得
        let disp_mode = this.m_info.getDispMode();
        
        let tobj = pHist.mChartList[ix];
        let dateTime;
        if(type === CD.CHART_DATA_MIN){
            dateTime = tobj.mTime;
        }else{
            if(10 <= tobj.mDate.length){
                dateTime = tobj.mDate.substr(0, 10);
            }else{
                dateTime = tobj.mDate;
            }
        }

        //CDP::SetFont(qpt, CDPC::FONT_9_TXT);

        if(rev_point === 1){			//天
            let valStr = this.m_common.withDecStr(tobj.mHighPrice, decPoint, degits);
            let ypos = this.m_drawInf.cnvValueToPosYForPrice(tobj.mHighPrice);
            if(disp_mode !== CD.CHART_DMODE_REV){
                y1 = this.getRevPointPos(ypos, true); //上部表示
                canvas.drawStringC(dateTime, x1, y1 - 15, color);
                canvas.drawStringC(valStr, x1, y1, color);
            }else{
                y1 = this.getRevPointPos(ypos, false); //反転時下部表示
                canvas.drawStringC(dateTime, x1, y1 + 15, color);
                canvas.drawStringC(valStr, x1, y1, color);
            }
        }else if(rev_point === 2){	//底
            let valStr = this.m_common.withDecStr(tobj.mLowPrice, decPoint, degits);
            let ypos = this.m_drawInf.cnvValueToPosYForPrice(tobj.mLowPrice);
            if(disp_mode !== CD.CHART_DMODE_REV){
                y1 = this.getRevPointPos(ypos, false); //下部表示
                canvas.drawStringC(dateTime, xpos, y1 + 15, color);
                canvas.drawStringC(valStr, xpos, y1, color);
            }else{
                y1 = this.getRevPointPos(ypos, true);  //反転時上部表示
                canvas.drawStringC(dateTime, x1, y1 - 15, color);
                canvas.drawStringC(valStr, x1, y1, color);
            }
        }
    }
    getRevPointPos(ypos, above) {
        let y = 0;
        if(above){
            if(this.m_drawInf.getChartAreaBgnPosYWithMgn() < ypos - 50){
               y = ypos - 20;
            }else{
                y = this.m_drawInf.getChartAreaBgnPosYWithMgn() + 15;
            }
        }else{
            if(ypos + 50 < this.m_drawInf.getChartAreaEndPosYWithMgn()){
                y = ypos + 15;
            }else{
                y = this.m_drawInf.getChartAreaEndPosYWithMgn() - 28;
            }
        }
        return y;
    }
    //==============================================================================
    //	[描画] 価格帯別売買高
    //==============================================================================
    drawVolumePerPrice(canvas, bgnIndex, mouse_ypos) {
        //価格帯別売買高算出
        const PVOL_ENTRY_NUM = 8;
        let pvol = new ChartTechPVOL();
        pvol.setParameter(PVOL_ENTRY_NUM,
                            this.m_drawInf.getScaleRangeUnit(), 
                            this.m_drawInf.getScaleRangeNum(),
                            this.m_drawInf.getScaleValueBtm());
        let pHist = this.m_info.getCurrentHist();
        let pvol_prm = pvol.setIndexValueToObj(pHist.mChartList, bgnIndex, this.m_dispLastIndex);
        if(pvol_prm <= 0){
            return;
        }
        //価格帯別売買高1本当り高さ
        let scale_height = this.m_drawInf.getScaleRangeHeight();
        let pvol_height = Math.floor(this.m_drawInf.getScaleRangeHeight() / pvol_prm);
        let pvol_height_surplus = this.m_drawInf.getScaleRangeHeight() % pvol_prm;
        let pvol_height_margin = 0;
        //3ピクセル以上の場合のみマージンセット
        if(3 < pvol_height){
            pvol_height = pvol_height - 1;
            pvol_height_margin = 1;
        }else if(pvol_height == 0){
            pvol_height = 1;
            pvol_height_margin = 0;
        }
        //価格帯別売買高描画開始位置
        let chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        let chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        let range_ypos = chartBgnPosY;
        let ypos = chartBgnPosY;
        let scaleNum = this.m_drawInf.getScaleRangeNum();
        let pvol_entry = pvol_prm * scaleNum;
        
        //後で削除
        let wk_entry = pvol.m_data.m_entry;
        if(wk_entry != pvol_entry){
            //DEBUG
            return;
        }
    
        let ix = pvol_entry-1;
        this.m_lastPriceVolume = 0;
        for (let i = 0; i < scaleNum; i++) {
            ypos = range_ypos + pvol_height_margin;
            let surplus = pvol_height_surplus;
            for (let j = 0; j < pvol_prm; j++) {
                let surplus_margin = 0;
                if(0 <= surplus) { 
                    //高さは余りがなくなるまで配分
                    surplus_margin = 1;
                    surplus--;
                }
                if (ix < pvol_entry) {
                    if (0 < pvol.m_data.m_value[ix]) {
                        let xpos = Math.floor((pvol.m_data.m_value[ix] * 100) / pvol.m_data.m_maxValue);
                        let w = xpos;
                        let h = pvol_height + surplus_margin;
                        canvas.drawBlend("rgba(100, 158, 180)", 0.5, chartBgnPosX, ypos, w, h);
                    }
                }
    
                let tmp_pos = ypos + pvol_height + pvol_height_margin + surplus_margin;
                if (ypos < mouse_ypos && mouse_ypos < tmp_pos) {
                    //カレント出来高値退避(指標パネル用)
                    if (ix < pvol.m_data.m_value.length) {
                        this.m_lastPriceVolume = pvol.m_data.m_value[ix];
                    }
                }
                ypos = tmp_pos;
                surplus--;
                if(--ix < 0){
                    return;
                }
            }
            range_ypos = range_ypos + scale_height;
        }
    }
    //==============================================================================
    //	[描画] 一目均衡表(時間論・基本数値)
    //==============================================================================
    drawIchimokuTime(canvas, dummy_entry_width, max_entry)　{
        //let x1 = this.m_drawInf.getChartAreaBgnPosX();
        let y1 = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        //let x2 = this.m_drawInf.getChartAreaEndPosX();
        let y2 = this.m_drawInf.getChartAreaEndPosYWithMgn();
        let bgn_entry = 0;
        let str_pos_margin = 14;
        let line_margin = 12;
        let color = this.m_drawParam.getColor(this.m_drawParam.m_color.ICHI_T.c);
        let strColor = this.m_drawParam.getColor(this.m_drawParam.m_color.ICHI_T.c);
        let valstr = ["(高値)", "(安値)"];
        let valstr_i = 0;
        if(this.m_dispInfo.dispHighEntry < this.m_dispInfo.dispLowEntry){
            bgn_entry = this.m_dispInfo.dispHighEntry;
            valstr_i = 0;
        }else{ //if(m_dispLowEntry < m_dispHighEntry){
            bgn_entry = this.m_dispInfo.dispLowEntry;
            valstr_i = 1;
        }

        let xpos = this.getEntryToJustPos(bgn_entry, dummy_entry_width, max_entry);
        canvas.drawStringC(valstr[valstr_i], xpos, y2 - str_pos_margin, "orange");
        canvas.drawLine(color, xpos, y1, xpos, y2 - line_margin);

        const target_entry = [9, 17, 26, 33, 42, 52, 65, 76, 129, 172, 226, 676];
        for(let i = 0; i < target_entry.length; i++){
             if (bgn_entry + target_entry[i] <= this.m_dispLastIndex) {
                xpos = this.getEntryToJustPos(bgn_entry + target_entry[i], dummy_entry_width, max_entry);
                let strVal = '+' + target_entry[i];
                canvas.drawStringC(strVal, xpos, y2 - str_pos_margin, strColor);
                canvas.drawLine(color, xpos, y1, xpos, y2 - line_margin);
            }else{
                break;
            }
        }
    }
    //==============================================================================
    //	[描画] フィボナッチ(基調転換)
    //==============================================================================
    drawFibonacchiRev(canvas, dummy_entry_width, max_entry)　{
        //let x1 = this.m_drawInf.getChartAreaBgnPosX();
        let y1 = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        //let x2 = this.m_drawInf.getChartAreaEndPosX();
        let y2 = this.m_drawInf.getChartAreaEndPosYWithMgn();
        let bgn_entry = 0;
        let str_pos_margin = 14;
        let line_margin = 12;
        let color = this.m_drawParam.getColor(this.m_drawParam.m_color.FINA_R.c);
        let strColor = this.m_drawParam.getColor(this.m_drawParam.m_color.FINA_R.c);
        let valstr = ["(高値)", "(安値)"];
        let valstr_i = 0;
        if(this.m_dispInfo.dispHighEntry < this.m_dispInfo.dispLowEntry){
            bgn_entry = this.m_dispInfo.dispHighEntry;
            valstr_i = 0;
        }else{ //if(m_dispLowEntry < m_dispHighEntry){
            bgn_entry = this.m_dispInfo.dispLowEntry;
            valstr_i = 1;
        }

        let xpos = this.getEntryToJustPos(bgn_entry, dummy_entry_width, max_entry);
        canvas.drawStringC(valstr[valstr_i], xpos, y2 - str_pos_margin, color);
        canvas.drawLine(color, xpos, y1, xpos, y2 - line_margin);

        let fiboprv = 5;
        let fibocur = 8;
        let fiboval = fiboprv + fibocur;
        let valid_ix = bgn_entry + fiboval;
        while (valid_ix <= this.m_dispLastIndex) {
            xpos = this.getEntryToJustPos(valid_ix, dummy_entry_width, max_entry);
            let strVal =  "+" + fiboval;
            canvas.drawStringC(strVal, xpos, y2 - str_pos_margin, strColor);
            canvas.drawLine(color, xpos, y1, xpos, y2 - line_margin);
            fiboprv = fibocur;
            fibocur = fiboval;
            fiboval = fiboprv + fibocur;
            valid_ix = bgn_entry + fiboval;
        }
    }
    //==============================================================================
    //	[描画] エントリ→ポジション位置取得(フィボ基調転換 && 一目時間論)
    //==============================================================================
    getEntryToJustPos(entry, dummy_entry_width, max_entry)　{
        let xpos = 0;
        // if(m_info.isAllDisp()){
        //     xpos = this.getEntryToPos(entry);
        if (this.m_info.isVariableMode() && 0 <= this.m_info.getVariableBgnIndex()) {
             let [ret_xpos, entry_width, candle_width] = this.m_common.getVariableEntryWidth(entry, max_entry);
             xpos = ret_xpos;
             xpos += (candle_width >> 1);
        }else{
            let entry_pos = this.m_drawInf.getCandleWidth() >> 1;
            xpos = dummy_entry_width + this.m_common.getEntryToPos(entry) + entry_pos;
        }
        return xpos;
    }
    //==============================================================================
    //	[描画] フィボナッチ(戻り)
    //==============================================================================
    drawFibonacchi(canvas, type)　{
        let x1 = this.m_drawInf.getChartAreaBgnPosX();
        //let y1 = this.m_drawInf.getChartAreaBgnPosY();
        let x2 = this.m_drawInf.getChartAreaEndPosX();
        //let y2 = this.m_drawInf.getChartAreaEndPosY();
        let pHist = this.m_info.getCurrentHist();
        let dec = pHist.mDecimalScale;
        let gap = this.m_dispInfo.dispHighPrice - this.m_dispInfo.dispLowPrice;
        let valstr = [ "戻", "押", "－" ];
        let valstr_i = 0;
        let scaleColor = this.m_drawParam.getColor(this.m_drawParam.m_color.SCALE_UNIT.c);
        let color;
        let highPrice = 0;
        let lowPrice = 0;
        let highEntry = 0;
        let lowEntry = 0;
        if(type == FIBO_ZARABA){
            color = this.m_drawParam.getColor(this.m_drawParam.m_color.FINA_Z.c);
            highPrice = this.m_dispInfo.dispHighPrice;
            highEntry = this.m_dispInfo.dispHighEntry;
            lowPrice = this.m_dispInfo.dispLowPrice;
            lowEntry = this.m_dispInfo.dispLowEntry;
        }else{
            color = this.m_drawParam.getColor(this.m_drawParam.m_color.FINA_C.c);
            highPrice = this.m_dispInfo.dispCloseHighPrice;
            highEntry = this.m_dispInfo.dispCloseHighEntry;
            lowPrice = this.m_dispInfo.dispCloseLowPrice;
            lowEntry = this.m_dispInfo.dispCloseLowEntry;
        }
        if(this.highEntry < lowEntry){
            valstr_i = 0;
        }else if(lowEntry < highEntry){
            valstr_i = 1;
        }else{
            valstr_i = 2;
        }
        let adjustY = 13;

        let y = this.m_drawInf.cnvValueToPosYForPrice(highPrice);
        let strVal = this.m_common.withDec(highPrice, dec);
        strVal += "[高値]";
        canvas.drawStringR(strVal, x2, y-adjustY, scaleColor);
        canvas.drawLine(color, x1, y, x2, y);

        let wk_value = (gap * 0.618 + 0.5) + lowPrice;
        y = this.m_drawInf.cnvValueToPosYForPrice(wk_value);
        strVal = this.m_common.withDec(wk_value, dec).toFixed(2);
        strVal += "[38.2%]";
        strVal += valstr[valstr_i];
        canvas.drawStringR(strVal, x2, y-adjustY, scaleColor);
        canvas.drawLine(color, x1, y, x2, y);

        wk_value = (gap * 0.667 + 0.5) + lowPrice;
        y = this.m_drawInf.cnvValueToPosYForPrice(wk_value);
        strVal = this.m_common.withDec(wk_value, dec).toFixed(2);
        strVal += "[2/3]";
        strVal += valstr[valstr_i];
        canvas.drawStringR(strVal, x2, y-adjustY, scaleColor);
        canvas.drawLine(color, x1, y, x2, y);

        wk_value = (gap * 0.5 + 0.5) + lowPrice;
        y = this.m_drawInf.cnvValueToPosYForPrice(wk_value);
        strVal = this.m_common.withDec(wk_value, dec).toFixed(2);
        strVal += "[1/2]";
        strVal += valstr[valstr_i];
        canvas.drawStringR(strVal, x2, y-adjustY, scaleColor);
        canvas.drawLine(color, x1, y, x2, y);

        wk_value = (gap * 0.382 + 0.5) + lowPrice;
        y = this.m_drawInf.cnvValueToPosYForPrice(wk_value);
        strVal = this.m_common.withDec(wk_value, dec).toFixed(2);
        strVal += "[61.8%]";
        strVal += valstr[valstr_i];
        canvas.drawStringR(strVal, x2, y-adjustY, scaleColor);
        canvas.drawLine(color, x1, y, x2, y);

        wk_value = (gap * 0.333 + 0.5) + lowPrice;
        y = this.m_drawInf.cnvValueToPosYForPrice(wk_value);
        strVal = this.m_common.withDec(wk_value, dec).toFixed(2);
        strVal += "[2/3]";
        strVal += valstr[valstr_i];
        canvas.drawStringR(strVal, x2, y-adjustY, scaleColor);
        canvas.drawLine(color, x1, y, x2, y);

        y = this.m_drawInf.cnvValueToPosYForPrice(lowPrice);
        strVal = this.m_common.withDec(lowPrice, dec).toFixed(2);
        strVal += "[安値]";
        canvas.drawStringR(strVal, x2, y-adjustY, scaleColor);
        canvas.drawLine(color, x1, y, x2, y);
    }
    //==============================================================================
    //	[描画] 各種ライン表示
    //==============================================================================
    // 最後に廃止
    drawGraph(color, value, prev_xpos, prev_ypos, xpos, size = 1) {
        if (value == 0) return 0;
        if (value == CD.INDEX_NO_VALUE) return 0;
        var ypos = this.m_drawInf.cnvValueToPosYForPrice(Math.floor(value));
        if (0 < prev_ypos) {
            //色暫定
            this.m_cc.drawBoldLine(color, size, prev_xpos, prev_ypos, xpos, ypos);
        }
        return ypos;
    }
    //==============================================================================
    //	[描画] ローソク足
    //==============================================================================
    drawStick(chartObj, xpos, entry_width, candle_width, sec_type) {
        let openPrice = chartObj.mOpenPrice >> 0;
        let highPrice = chartObj.mHighPrice >> 0;
        let lowPrice = chartObj.mLowPrice >> 0;
        let lastPrice = chartObj.mClosePrice >> 0;

        let yOpen = this.m_drawInf.cnvValueToPosYForPrice(openPrice) >> 0;
        let yHigh = this.m_drawInf.cnvValueToPosYForPrice(highPrice) >> 0;
        let yLow = this.m_drawInf.cnvValueToPosYForPrice(lowPrice) >> 0;
        let yClose = this.m_drawInf.cnvValueToPosYForPrice(lastPrice) >> 0;

        // ローソク中心位置(candle_width / 2)
        let xLinePoint = (candle_width / 2) >> 0;

        // 描画条件(有効エントリ)判定
        if(!chartObj.mDataStatus){
            xpos += entry_width;
            return xpos;
        }
        // 描画条件(指数以外&&出来高有)判定
        if (sec_type != CD.SECTYPE_IND && chartObj.mVolume <= 0) {
            xpos += entry_width;
            return xpos;
        }
        // 描画条件(無効エントリ)判定(指数)
        if(chartObj.mVolume < 0){
            xpos += entry_width;
            return xpos;
        }

        let edgeDraw = this.m_info.getCandleEdgeDraw();
        let stroke_color = this.m_cc.m_colStick;
        if (edgeDraw && chartObj.mDataStatus != CD.FIXED) {
            stroke_color = "yellow"
        }
        if (yOpen < yClose) {        //陰線
            this.m_cc.drawBlackStick(xpos, candle_width, yOpen, yHigh, yLow, yClose, stroke_color, edgeDraw);
        } else if (yClose < yOpen) { //陽線
            this.m_cc.drawWhiteStick(xpos, candle_width, yOpen, yHigh, yLow, yClose, stroke_color, edgeDraw);
        } else {                    //十字線
            this.m_cc.drawLine(stroke_color, xpos, yOpen, xpos + candle_width, yOpen);
            if (highPrice != openPrice) {
                this.m_cc.drawLine(stroke_color, xpos + xLinePoint, yHigh, xpos + xLinePoint, yOpen);
            }
            if (lowPrice != openPrice) {
                this.m_cc.drawLine(stroke_color, xpos + xLinePoint, yOpen, xpos + xLinePoint, yLow);
            }
        }

        xpos += this.m_drawInf.getEntryWidth();

        return xpos;       //今回のX軸
    }
    //==============================================================================
    //	[描画] バーチャート
    //==============================================================================
    drawBar(chartObj, xpos, entry_width, candle_width, draw_type, sec_type) {

        // 描画条件(有効エントリ)判定
        if(!chartObj.mDataStatus){
            xpos += entry_width;
            return xpos;
        }
        // 描画条件(指数以外&&出来高有)判定
        if (sec_type != CD.SECTYPE_IND && chartObj.mVolume <= 0) {
            xpos += entry_width;
            return xpos;
        }
        // 描画条件(無効エントリ)判定(指数)
        if(chartObj.mVolume < 0){
            xpos += entry_width;
            return xpos;
        }

        let openPrice = chartObj.mOpenPrice >> 0;
        let highPrice = chartObj.mHighPrice >> 0;
        let lowPrice = chartObj.mLowPrice >> 0;
        let lastPrice = chartObj.mClosePrice >> 0;

        let yOpen = this.m_drawInf.cnvValueToPosYForPrice(openPrice) >> 0;
        let yHigh = this.m_drawInf.cnvValueToPosYForPrice(highPrice) >> 0;
        let yLow = this.m_drawInf.cnvValueToPosYForPrice(lowPrice) >> 0;
        let yClose = this.m_drawInf.cnvValueToPosYForPrice(lastPrice) >> 0;

        // ローソク中心位置(candle_width / 2)
        let xLinePoint = (candle_width / 2) >> 0;
        let xEndPos = xpos + candle_width;
        
		// 不連続マーク描画
		// DrawAdjustMark(qpt, pt, xpos+xLinePoint-8 );

        // バー描画
        const sellColor = this.m_drawParam.m_clrColor[IDX.CLR_SELL];
        const buyColor = this.m_drawParam.m_clrColor[IDX.CLR_BUY];
        const flatColor = "yellow";

        let edgeDraw = this.m_info.getCandleEdgeDraw();
        let stroke_color = this.m_cc.m_colStick;
        if (edgeDraw && chartObj.mDataStatus != CD.FIXED) {
            stroke_color = "yellow";
        }

        if (chartObj.mOpenPrice < chartObj.mClosePrice) {         // 陽線
            this.m_cc.drawLine(buyColor, xpos + xLinePoint, yHigh, xpos + xLinePoint, yLow);
            if (draw_type == CD.STYLE_BAR_FULL) {
                this.m_cc.drawLine(buyColor, xpos, yOpen, xpos + xLinePoint, yOpen);
            }
            this.m_cc.drawLine(buyColor, xpos + xLinePoint, yClose, xEndPos, yClose);
        } else if (chartObj.mClosePrice < chartObj.mOpenPrice) {   // 陰線
            this.m_cc.drawLine(sellColor, xpos + xLinePoint, yHigh, xpos + xLinePoint, yLow);
            if (draw_type == CD.STYLE_BAR_FULL) {
                this.m_cc.drawLine(sellColor, xpos, yOpen, xpos + xLinePoint, yOpen);
            }
            this.m_cc.drawLine(sellColor, xpos + xLinePoint, yClose, xEndPos, yClose);
        } else {  // フラット
            this.m_cc.drawLine(flatColor, xpos + xLinePoint, yHigh, xpos + xLinePoint, yLow);
            if (draw_type == CD.STYLE_BAR_FULL) {
                this.m_cc.drawLine(flatColor, xpos, yOpen, xpos + xLinePoint, yOpen);
            }
            this.m_cc.drawLine(flatColor, xpos + xLinePoint, yClose, xEndPos, yClose);
        }

        xpos += this.m_drawInf.getEntryWidth();

        return xpos;       //今回のX軸
    }
    //==============================================================================
    //	[描画] ライン足塗り潰し描画
    //==============================================================================
    drawPolyGraphLine(bgnIndex, dispEntryCnt, dummy_width, var_disp_mode) {
        //TRACE("%s(%d)::%s\n",__FILE__, __LINE__, "DrawPolyGraphLine[STA]");
        let szHistList = this.m_info.getCurHistSize();
        let pHist = this.m_info.getCurrentHist();
        //let var_disp_mode = this.m_info.isVariableMode();
        let entry_width = this.m_drawInf.getEntryWidth();
        let candle_width = this.m_drawInf.getCandleWidth();
        let max_entry = szHistList;

        let chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        let chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let chartEndPosY = this.m_drawInf.getChartAreaEndPosY();

        //右側固定エリア表示中フラグ
        //bool fixed_area = false;
        //if((!m_pInfo->IsHideFixArea()) && (m_info.isFixAreaSideRight())){
        //    fixed_area = true;
        //}
        // 可変モード描画値
        let var_bgn_ix = this.m_info.getVariableBgnIndex();
        let var_end_ix = this.m_info.getVariableEndIndex();
        if(var_disp_mode && 0 <= var_bgn_ix){
            // 最大描画エントリセット
            max_entry = var_end_ix + 1;
            // 初回キャンドルサイズ取得
            let ret_xpos;
            [ret_xpos, entry_width, candle_width] = this.m_common.getVariableEntryWidth(bgnIndex, max_entry);
        }else{
            max_entry = bgnIndex + dispEntryCnt;
            //if(fixed_area){
            //    // 右側固定エリア表示中のみ1エントリ足しこみ(FIXエリアに刺す)
            //    max_entry++;
            //}
            var_disp_mode = false;
        }
        if(szHistList < max_entry){
            max_entry = szHistList;
        }

        let mgn = candle_width/2;
        let xpos = this.m_drawInf.getChartAreaBgnPosX() + dummy_width + mgn;
        
        // 更新用開始エントリ
        let start_entry = bgnIndex;

        let under_ypos = 0;
        // グラデーションを実現するため逆反転
        //if(dispmode == CHART_DMODE_REV){
        //    under_ypos = this.m_drawInf.GetChartAreaEndPosY();
        //}else{
            //under_ypos = this.m_drawInf.getChartAreaBgnPosY();
            under_ypos = this.m_drawInf.getChartAreaEndPosY();
        //}
        // 描画開始位置取得処理
        if (var_disp_mode) {
            //do nothing
        }else{
            // 通常モードは描画開始エントリを更新(開始位置(xpos)は更新済)
            bgnIndex = start_entry;
        }

        // ライン足開始位置退避
        let bgn_xpos = xpos;

        // ライン足描画処理
        let polSize = (max_entry - bgnIndex) * 2;
        if(polSize < 2){
            return; //畳んだ場合
        }
        let polArray = new Array(polSize);
        for (let i = 0; i < polSize; i++) {
            polArray[i] = { x: 0, y: 0 };
        }
        let ix, wk_pos_ix;
        for (ix = bgnIndex; ix < max_entry; ix++) {
            let pt = pHist.mChartList[ix];
            let ypos = 0;
            let pol_ix = ix - bgnIndex;
            wk_pos_ix = pol_ix;
            ypos = this.m_drawInf.cnvValueToPosYForPrice(pt.mClosePrice);
            polArray[pol_ix].x = xpos;
            polArray[pol_ix].y = ypos;
            polArray[polSize - pol_ix - 1].x = xpos;
            polArray[polSize - pol_ix - 1].y = under_ypos;

            //if(all_disp_mode){
            //    xpos = this.m_drawInf.CnvValueToPosX(ix+1);
            //}else 
            if(var_disp_mode){
                if(ix+1 != max_entry){
                    let xp;
                    [xp, entry_width, candle_width] = this.m_common.getVariableEntryWidth(ix + 1, max_entry);
                    let mgn = candle_width >> 1;
                    xpos = xp + mgn;
                }
            }else{
                //if(!fixed_area && chartEndPosX < xpos + entry_width){
                if(chartEndPosX < xpos + entry_width){
                    break;
                }else if(ix + 1 === szHistList){
                    //固定表示有無に関わらずリスト最終エントリのxpos足しこみ回避
                    break;
                }else if(ix + 1 === max_entry){
                    //リスト最終以外の最終エントリ検出時
                    polArray[pol_ix].x = chartEndPosX;
                    polArray[polSize - pol_ix - 1].x = chartEndPosX;
                }
                xpos += entry_width;
            }
        }
        let margin = this.m_drawInf.getChartAreaMarginBtm();
        //QRect chart_area_rc(bgn_xpos, chartBgnPosY, xpos - bgn_xpos, chartEndPosY - chartBgnPosY + margin);
        //CDP::DrawGradient(qpt, chart_area_rc, QColor(62, 92, 149), QColor(0, 0, 0));
        
        //let gradColor = ["rgb(30,30,30)", "rgb(50,50,50)", "rgb(70,70,70)"];
        //this.m_cc.drawGradient(gradColor, bgn_xpos - 2, chartBgnPosY, xpos, chartEndPosY + 2);

        //this.m_cc.drawFillRect("blue", "yellow", bgn_xpos, chartBgnPosY, xpos - bgn_xpos, chartEndPosY - chartBgnPosY + margin)
        //CDP::DrawPolygon(qpt, m_pDrawParam->m_hPen[P_THEME], m_pDrawParam->m_hbr[B_CLOSE_FILL], polArray);
        this.m_cc.drawPolygon("rgb(30,30,30)", polArray, (wk_pos_ix + 1) * 2);
    }
    //==============================================================================
    //	値段表示幅取得(指数を含む)
    //==============================================================================
    getPriceRange(sta, cnt) {
        let price = { maxPrice: 0.0, minPrice: 999999999.0,
            highPrice: 0.0, lowPrice: 999999999.0, highEntry: 0, lowEntry: 0,
            clsHighPrice: 0.0, clasLowPrice: 999999999.0, clsHighEntry: 0, clsLowEntry: 0 };
        let pHist = this.m_info.getCurrentHist();
        let dspcnt = sta + cnt;
        let fwdcnt = 0;
        let maxEntry = pHist.getEntrySize();
        if (maxEntry < dspcnt) {
            if (sta == dspcnt) {
                //最低1エントリは回す
                sta = dspcnt - 1;
            }
            fwdcnt = dspcnt - maxEntry;
            dspcnt = maxEntry;
        }

        for (let i = sta; i < dspcnt; i++) {
            let pt = pHist.mChartList[i];

            // 終値による高安判定(フィボナッチ終値用)
            let val = pt.mClosePrice;
            if(price.clsHighPrice < val){
                price.clsHighPrice = val;
                price.clsHighEntry = i;
            }
            if(val < price.clasLowPrice){
                price.clasLowPrice = val;
                price.clsLowEntry= i;
            }

            // 海外指数等終値しかない場合があるためその場合は終値で調整
            val = pt.mHighPrice <= 0 ? pt.mClosePrice : pt.mHighPrice;
            if (price.highPrice < val) {
                price.highPrice = val;
                price.highEntry = i;
            }
            // 海外指数等終値しかない場合があるためその場合は終値で調整
            val = pt.mLowPrice <= 0 ? pt.mClosePrice : pt.mLowPrice;
            if (val < price.lowPrice) {
                price.lowPrice = val;
                price.lowEntry = i;
            }

            // 有効インデックスチェック
            for (let j = 0; j < this.m_indexCtrl.length; j++) {
                if (this.m_indexCtrl[j] !== null) {
                    this.m_indexCtrl[j].getMaxMinValue(i, price);
                }
            }
        }

        // 一目均衡表先行足のみ
        if(this.m_indexCtrl[CD.ICHI] !== null && 0 < fwdcnt){
            this.m_indexCtrl[CD.ICHI].getMaxMinValue(dspcnt, fwdcnt, price);
        }

        this.m_dispInfo.dispMaxPrice = price.maxPrice < price.highPrice ? price.highPrice : price.maxPrice;
        this.m_dispInfo.dispMinPrice = price.lowPrice < price.minPrice ? price.lowPrice : price.minPrice;
        this.m_dispInfo.dispHighPrice = price.highPrice;
        this.m_dispInfo.dispLowPrice  = price.lowPrice;
        this.m_dispInfo.dispHighEntry = price.highEntry;
        this.m_dispInfo.dispLowEntry  = price.lowEntry; 
        this.m_dispInfo.dispCloseHighPrice = price.clsHighPrice;
        this.m_dispInfo.dispCloseLowPrice  = price.clasLowPrice;
        this.m_dispInfo.dispCloseHighEntry = price.clsHighEntry;
        this.m_dispInfo.dispCloseLowEntry  = price.clsLowEntry;  
    }
    //==============================================================================
    //	[描画] エントリ無初期表示
    //==============================================================================
    drawEmpty(price) {
        //var decPovar = this.m_drawInf.getScaleValueDec();
        var chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        var chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        var chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        var chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        //var string_posx_L = chartBgnPosX - 20; //左表示
        //var string_posx_R = chartEndPosX + 15; //右表示
        //var scaleNum = (chartEndPosY - chartBgnPosY) / 4 >> 0;
        //var scaleSide = (chartEndPosX - chartBgnPosX) / 4 >> 0;
        //var s_price;
        var ypos = chartBgnPosY;
        var xpos = chartEndPosX;

        //最上部線
        //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX + 10, ypos);
        //ypos += scaleNum;
        //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX + 10, ypos);
        //ypos += scaleNum;
        //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX + 10, ypos);
        //ypos += scaleNum;
        //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX + 10, ypos);
        //ypos += scaleNum;
        //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, ypos, chartEndPosX + 10, ypos);
        //右縦軸線
        //this.m_cc.drawLine(this.m_cc.m_colScale, chartEndPosX + 1, chartBgnPosY, chartEndPosX + 1, ypos);
        //xpos -= scaleSide;
        //this.m_cc.drawLine(this.m_cc.m_colScale, xpos, chartBgnPosY, xpos, ypos);
        //xpos -= scaleSide;
        //this.m_cc.drawLine(this.m_cc.m_colScale, xpos, chartBgnPosY, xpos, ypos);
        //xpos -= scaleSide;
        //this.m_cc.drawLine(this.m_cc.m_colScale, xpos, chartBgnPosY, xpos, ypos);
        //xpos -= scaleSide;
        //this.m_cc.drawLine(this.m_cc.m_colScale, xpos, chartBgnPosY, xpos, ypos);
    }
    //==============================================================================
    //	設定ボタン押下イベント
    //==============================================================================
    checkSettingMouseUpPerformed(x, y) {
        return this.m_headerTree.checkSettingMouseUpPerformed(x, y);
    }
    checkCloseMouseUpPerformed(x, y) {
        return this.m_headerTree.checkCloseMouseUpPerformed(x, y);
    }
    uiEvtMouseMovePerformedForSetting(x, y) {
        // パラメータ設定表示時
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            return indexCtrl.uiEvtMouseMovePerformed(x, y);
        }
        return false;
    }
    uiEvtMouseLeftPerformedForSetting(x, y) {
        // パラメータ設定表示時
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            if(indexCtrl.uiEvtMouseLeftPerformed(x, y)){
                return true;
            }
        }
        return false;
    }
    uiEvtMouseUpPerformedForSetting(x, y) {
        // パラメータ設定
        const indexCtrl = this.getSettingIndexCtrl();
        if (indexCtrl !== null) {
            if(indexCtrl.uiEvtMouseUpPerformed(x, y)){
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {

        // メインチャート上
        if (this.m_drawInf.isInnerExChartAreaX(x)) {
            if (this.m_drawInf.isInnerChartAreaX(x)) {
                this.m_info.setMousePosX(x);
            } else {
                this.m_info.setMousePosX(this.m_drawInf.getChartAreaEndPosX());
            }
            this.m_info.setMousePosY(y);
            this.m_drawInf.setMousePos(x, y);
        } else {
            this.m_mosPushStat = false;
        }
        //m_info.m_pObserver.postMsgToAllArea(ID_ALGO_CD.CHART_UPDATE, 0);
        return true;

        //}
        //return false;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {

        if (this.m_headerTree.uiEvtMouseLeftPerformed(x, y)) {
            return true;
        }

        this.m_mosPushStat = true;
        this.m_mosPushPrvX = x;
        return false;
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        this.m_mosPushStat = false;
        this.m_mosPushPrvX = 0;
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOVE OUT]
    //==============================================================================
    uiEvtMouseOutPerformed() {
        if (this.m_headerTree.uiEvtMouseOutPerformed()) {
            return true;
        }
        this.m_mosPushStat = false;
        this.m_mosPushPrvX = 0;
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOVE IN]
    //==============================================================================
    uiEvtMouseInPerformed() {
        if (this.m_headerTree.uiEvtMouseInPerformed()) {
            return true;
        }
        this.m_mosPushStat = false;
        this.m_mosPushPrvX = 0;
        return false;
    }
}
export class ChartMainIndexCtrl {
    constructor(type, common, pramNum, headerTree) {
        this.m_type = type; 
        this.m_common = common;
        this.m_cc = common.m_cc;
        this.m_drawInf = common.m_drawInf;
        this.m_info = common.m_info;
        this.m_techData = null;
        this.m_techParam = common.m_techParam;
        this.m_drawParam = common.m_drawParam;
        //this.m_drawGraphSw = false;   // 不要を前提に確認中
        this.m_headerTree = headerTree;
        this.m_indexName = '';
        this.m_indexNameAndType = '';
        this.m_paramName = [];
        this.m_slider = [];
        this.m_colorLabel = [];
        this.m_btnModColor = [];
        if(0 < pramNum){
            this.m_paramName = new Array(pramNum);
            this.m_slider = new Array(pramNum);
            this.m_colorLabel = new Array(pramNum);
            this.m_btnModColor = new Array(pramNum);
        }
        for(let i = 0; i < pramNum; ++i){
            this.m_paramName[i] = 'NOSET';
            this.m_slider[i] = new ChartSlider();
            this.m_colorLabel[i] = new ChartColorParamLabel(common.m_cc);
            this.m_btnModColor[i] = new ChartButton();
            this.m_btnModColor[i].init("選択");
        }
        this.m_selectColorPickerIndex = 0;
    }
    getIndexType() { return this.m_type; }
    getDataType() {
        const hist = this.m_info.getCurrentHist();
        return hist.getDataType();
    }
    setColorPickerCurrnt() {
        if (this.m_colorLabel[this.m_selectColorPickerIndex] !== null) {
            let [r, g, b] = this.m_colorLabel[this.m_selectColorPickerIndex].getRGBArray();
            this.m_common.m_colorPicker.setCurrentColor(r, g, b);
        }
        return true;
    }
    resetIndexParam() {
        for(let i = 0; i < this.m_slider.length; ++i){
            if (this.m_slider[i] !== null) {
                this.m_slider[i].reset();
            }
        }
    }
    updateIndexData(ix) {
        let hist = this.m_info.getCurrentHist();
        this.m_techData.updateIndexValueToObj(hist.mChartList, ix);
    }
    updateColorParam() {
        if (this.m_colorLabel[this.m_selectColorPickerIndex] !== null) {
            let rgb = this.m_common.m_colorPicker.getSelectRGBValue();
            this.m_colorLabel[this.m_selectColorPickerIndex].setRGB(rgb);
        }
    }
    //==============================================================================
    //	ヘッダ文字列更新
    //==============================================================================
    setHeader(type, headerStr) {
        const detail = this.m_headerTree.headerDetail;
        const hdType = this.m_headerTree.headerType;
        for (let i = 0; i < detail.length; i++) {
            if (hdType[i] === type) {
                detail[i] = headerStr;
                return;
            }
        }
        hdType.push(type);
        detail.push(headerStr);
    }
    //==============================================================================
    //	[描画] パラメータ設定
    //==============================================================================
    drawParamSetting(rc) {
        this.m_common.drawParamSetting(rc,
            this.m_indexNameAndType,
            this.m_slider.length,
            this.m_slider,
            this.m_paramName,
            this.m_colorLabel,
            this.m_btnModColor
        );
    }
    //==============================================================================
    //	[描画] カラーピッカー設定
    //==============================================================================
    drawColorSetting(rc) {

        this.m_cc.drawStringL(this.m_paramName[this.m_selectColorPickerIndex], rc.left + 10, rc.top + 10, "rgb(190,190,190)");

        // カラーピッカー画面描画
        if(this.m_common.m_isDrawColorPicker){
            rc.top += 40;
            this.m_common.m_colorPicker.draw(rc);
            return;
        }
    }
    //==============================================================================
    //	[描画] 各種ライン表示
    //==============================================================================
    drawGraphLine(color, value, prev_xpos, prev_ypos, xpos, size = 1) {
        if (value === 0) return 0;
        if (value === CD.INDEX_NO_VALUE) return 0;
        let ypos = this.m_drawInf.cnvValueToPosYForPrice(Math.floor(value));
        if (0 < prev_ypos && 0 < prev_xpos) {
            //色暫定
            this.m_cc.drawBoldLine(color, size, prev_xpos, prev_ypos, xpos, ypos);
        }
        return ypos;
    }
    //==============================================================================
    //	UI EVENT [MOUSE LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if(this.m_common.m_isDrawColorPicker){
            return this.m_common.m_colorPicker.uiEvtMouseLeftPerformed(x, y);
        }
        for (let i = 0; i < this.m_slider.length; ++i) {
            if(this.m_slider[i] !== null){
                if (this.m_slider[i].uiEvtMouseLeftPerformed(x, y)) {
                    return true;
                }
            }
            if(this.m_colorLabel[i] !== null){
                if (this.m_btnModColor[i].uiEvtMouseLeftPerformed(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE ON PUSHED]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        if(this.m_common.m_isDrawColorPicker){
            return this.m_common.m_colorPicker.uiEvtMouseMovePerformed(x, y);
        }
        for (let i = 0; i < this.m_slider.length; ++i){
            if(this.m_slider[i] !== null){
                if(this.m_slider[i].uiEvtMouseMovePerformed(x, y)){
                    return true;
                }
            }
            if(this.m_colorLabel[i] !== null){
                if(this.m_btnModColor[i].uiEvtMouseMovePerformed(x, y)){
                    return true;
                }
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE BUTTON UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        if(this.m_common.m_isDrawColorPicker){
            return this.m_common.m_colorPicker.uiEvtMouseUpPerformed(x, y);
        }
        for (let i = 0; i < this.m_slider.length; ++i){
            if(this.m_slider[i] !== null){
                if(this.m_slider[i].uiEvtMouseUpPerformed(x, y)){
                    return true;
                }
            }
            if(this.m_colorLabel[i] !== null){
                if(this.m_btnModColor[i].uiEvtMouseUpPerformed(x, y)){
                    this.m_selectColorPickerIndex = i;
                    this.m_common.setColorPickerEnbled(true);
                    let [r, g, b] = this.m_colorLabel[i].getRGBArray();
                    this.m_common.m_colorPicker.setCurrentColor(r, g, b);
                    return true;
                }
            }
        }
        return false;
    }
}

//==================================================================================
// 単純移動平均
//==================================================================================
class ChartSMACtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_SMA, common, 3, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.SMA.c;
        this.m_curYpos = new Array(TS.TI_SMA_MAX);
        this.m_indexName = "単純移動平均";
        this.m_paramName[0] = '期間-１';
        this.m_paramName[1] = '期間-２';
        this.m_paramName[2] = '期間-３';
        this.resetIndexColor();
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_SMA(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "期間1=" + prmVal[0]
            + "  期間2=" + prmVal[1]
            + "  期間3=" + prmVal[2]
            + " )";
        super.setHeader(CD.SMA, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = super.getDataType();
        const prmVal = this.m_techParam.getParam_SMA(dataType);
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        this.m_techData = new ChartTechSMA();
        this.m_techData.setParameter(prmVal[0], prmVal[1], prmVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[1]);
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[2]);
        this.updateHeader();
    }
    resetIndexColor(isDefault = false) {
        let paramValue = (isDefault)? this.m_drawParam.m_defaultColor.SMA.c : this.m_drawParam.m_color.SMA.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2].init(paramValue[2]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_SMA(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorSMA(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_SMA(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[1][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[2][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push("SMA " + (j + 1).toString());
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix]) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// 指数平滑移動平均
//==================================================================================
class ChartEMACtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_EMA, common, 3, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.EMA.c;
        this.m_curYpos = new Array(TS.TI_EMA_MAX);
        this.m_indexName = "指数平滑移動平均";
        this.m_paramName[0] = '期間-１';
        this.m_paramName[1] = '期間-２';
        this.m_paramName[2] = '期間-３';
        this.resetIndexColor(false);
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_EMA(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "期間1=" + prmVal[0]
            + "  期間2=" + prmVal[1]
            + "  期間3=" + prmVal[2]
            + " )";
        super.setHeader(CD.EMA, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_EMA(dataType);
        this.m_techData = new ChartTechEMA();
        this.m_techData.setParameter(prmVal[0], prmVal[1], prmVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[1]);
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[2]);
        this.updateHeader();
    }
    resetIndexColor(isDefault = false) {
        let paramValue = (isDefault)? this.m_drawParam.m_defaultColor.EMA.c : this.m_drawParam.m_color.EMA.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2].init(paramValue[2]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_EMA(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorEMA(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_EMA(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[1][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[2][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push("EMA " + (j + 1).toString());
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix]) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// 加重移動平均
//==================================================================================
class ChartWMACtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_WMA, common, 3, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.WMA.c;
        this.m_curYpos = new Array(TS.TI_WMA_MAX);
        this.m_indexName = "加重移動平均";
        this.m_paramName[0] = '期間-１';
        this.m_paramName[1] = '期間-２';
        this.m_paramName[2] = '期間-３';
        this.resetIndexColor(false);
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_WMA(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "期間1=" + prmVal[0]
            + "  期間2=" + prmVal[1]
            + "  期間3=" + prmVal[2]
            + " )";
        super.setHeader(CD.WMA, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_WMA(dataType);
        this.m_techData = new ChartTechWMA();
        this.m_techData.setParameter(prmVal[0], prmVal[1], prmVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[1]);
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[2]);
        this.updateHeader();
    }
    resetIndexColor(isDefault = false) {
        let paramValue = (isDefault)? this.m_drawParam.m_defaultColor.WMA.c : this.m_drawParam.m_color.WMA.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2].init(paramValue[2]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_WMA(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorWMA(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_WMA(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[1][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[2][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push("WMA " + (j + 1).toString());
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix]) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// 多重移動平均(SMA)
//==================================================================================
class ChartSMMACtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_SMMA, common, 4, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.SMMA.c;
        this.m_curYpos = new Array(TS.TI_SMMA_MAX);
        this.m_indexName = "多重(単純)移動平均";
        this.m_paramName[0] = '開始期間';
        this.m_paramName[1] = '間隔';
        this.m_paramName[2] = '本数';
        this.m_paramName[3] = '表示色';
        this.resetIndexColor();
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_SMMA(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "開始期間=" + prmVal[0]
            + "  間隔=" + prmVal[1]
            + "  本数=" + prmVal[2]
            + " )";
        super.setHeader(CD.SMMA, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = super.getDataType();
        const prmVal = this.m_techParam.getParam_SMMA(dataType);
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        this.m_techData = new ChartTechSMMA();
        this.m_techData.setParameter(prmVal[0], prmVal[1], prmVal[2]);
        this.m_curYpos = new Array(prmVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, 20, 1, prmVal[1]);
        this.m_slider[2].init(MIN_PARAM_VALUE, 10, 1, prmVal[2]);
        this.m_slider[3] = null;
        this.updateHeader();
    }
    resetIndexColor(isDefault = false) {
        let paramValue = (isDefault)? this.m_drawParam.m_defaultColor.SMMA.c : this.m_drawParam.m_color.SMMA.c;
        this.m_colorLabel[0] = null;
        this.m_colorLabel[1] = null;
        this.m_colorLabel[2] = null;
        this.m_colorLabel[3].init(paramValue[0]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_SMMA(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
        this.m_slider[3] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorSMMA(this.m_colorLabel[3].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_SMMA(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[this.m_techData.m_data.length - 1][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        const color = this.m_drawParam.getColor(this.m_paramColor[0]);
        for (let i = 0; i < this.m_techData.m_data.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(color, this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_techData.m_data.length;
        const indexColor = this.m_drawParam.getColor(this.m_paramColor[0]);
        const indexPanel = this.m_common.m_indexPanel;

        indexPanel.m_indexName.push("SMMA 1");
        indexPanel.m_indexColor.push(indexColor);
        if (this.m_techData.m_data[0][ix]) {
            indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[0][ix], dec));
        } else {
            indexPanel.m_indexValue.push("-");
        }

        const j = len - 1;
        indexPanel.m_indexName.push("SMMA " + len);
        indexPanel.m_indexColor.push(indexColor);
        if (this.m_techData.m_data[j][ix]) {
            indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
        } else {
            indexPanel.m_indexValue.push("-");
        }

        // 全ては多すぎるたやめる
        // for (let j = 0; j < len; j++) {
        //     indexPanel.m_indexName.push("SMMA " + (j + 1).toString());
        //     indexPanel.m_indexColor.push(indexColor);
        //     if (this.m_techData.m_data[j][ix]) {
        //         indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
        //     } else {
        //         indexPanel.m_indexValue.push("-");
        //     }
        // }
    }
}
//==================================================================================
// 多重移動平均(EMA)
//==================================================================================
class ChartEMMACtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_EMMA, common, 4, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.EMMA.c;
        this.m_curYpos = new Array(TS.TI_EMMA_MAX);
        this.m_indexName = "多重(指数)移動平均";
        this.m_paramName[0] = '開始期間';
        this.m_paramName[1] = '間隔';
        this.m_paramName[2] = '本数';
        this.m_paramName[3] = '表示色';
        this.resetIndexColor();
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_EMMA(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "開始期間=" + prmVal[0]
            + "  間隔=" + prmVal[1]
            + "  本数=" + prmVal[2]
            + " )";
        super.setHeader(CD.EMMA, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = super.getDataType();
        const prmVal = this.m_techParam.getParam_EMMA(dataType);
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        this.m_techData = new ChartTechEMMA();
        this.m_techData.setParameter(prmVal[0], prmVal[1], prmVal[2]);
        this.m_curYpos = new Array(prmVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, 20, 1, prmVal[1]);
        this.m_slider[2].init(MIN_PARAM_VALUE, 10, 1, prmVal[2]);
        this.m_slider[3] = null;
        this.updateHeader();
    }
    resetIndexColor(isDefault = false) {
        let paramValue = (isDefault)? this.m_drawParam.m_defaultColor.EMMA.c : this.m_drawParam.m_color.EMMA.c;
        this.m_colorLabel[0] = null;
        this.m_colorLabel[1] = null;
        this.m_colorLabel[2] = null;
        this.m_colorLabel[3].init(paramValue[0]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_EMMA(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
        this.m_slider[3] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorEMMA(this.m_colorLabel[3].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_EMMA(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[this.m_techData.m_data.length - 1][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        const color = this.m_drawParam.getColor(this.m_paramColor[0]);
        for (let i = 0; i < this.m_techData.m_data.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(color, this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_techData.m_data.length;
        const indexColor = this.m_drawParam.getColor(this.m_paramColor[0]);
        const indexPanel = this.m_common.m_indexPanel;

        indexPanel.m_indexName.push("EMMA 1");
        indexPanel.m_indexColor.push(indexColor);
        if (this.m_techData.m_data[0][ix] && this.m_techData.m_data[0][ix] != CD.INDEX_NO_VALUE) {
            indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[0][ix], dec));
        } else {
            indexPanel.m_indexValue.push("-");
        }

        const j = len - 1;
        indexPanel.m_indexName.push("EMMA " + len);
        indexPanel.m_indexColor.push(indexColor);
        if (this.m_techData.m_data[j][ix]) {
            indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
        } else {
            indexPanel.m_indexValue.push("-");
        }
    }
}
//==================================================================================
// ボリンジャーバンド
//==================================================================================
class ChartBBCtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_BB, common, 4, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.BB.c;
        this.m_curYpos = new Array(TS.TI_BB_MAX);
        this.m_indexName = "ボリンジャーバンド";
        this.m_paramName[0] = '期間';
        this.m_paramName[1] = '1σ';
        this.m_paramName[2] = '2σ';
        this.m_paramName[3] = '3σ';
        this.resetIndexColor(false);
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_BB(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "期間=" + prmVal[0]
            + "  1σ=" + prmVal[1]
            + "  2σ=" + prmVal[2]
            + "  3σ=" + prmVal[3]
            + " )";
        super.setHeader(CD.BB, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_BB(dataType);
        this.m_techData = new ChartTechBB();
        this.m_techData.setParameter(prmVal[0], prmVal[1], prmVal[2], prmVal[3]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[3]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[2]);
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[1]);
        this.m_slider[3].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.updateHeader();
    }
    resetIndexColor(isDefault = false) {
        let paramValue = (isDefault)? this.m_drawParam.m_defaultColor.BB.c : this.m_drawParam.m_color.BB.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2].init(paramValue[2]);
        this.m_colorLabel[3].init(paramValue[3]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_BB(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
        this.m_slider[3].setCurValue(defaultParamValue[3]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorBB(this.m_colorLabel[3].getRGB(), this.m_colorLabel[2].getRGB(), this.m_colorLabel[1].getRGB(), this.m_colorLabel[0].getRGB(),
                                    this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB(), this.m_colorLabel[3].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue(), this.m_slider[3].getCurValue()];
        this.m_techParam.setParam_BB(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[6][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["BB +3σ", "BB +2σ", "BB +1σ", "BB MA", "BB -1σ", "BB -2σ", "BB -3σ"];
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push(txt[j]);
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix] && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// 一目均衡表
//==================================================================================
class ChartICHICtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_ICHI, common, 6, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.ICHI.c;
        this.m_curYpos = new Array(TS.TI_ICHI_MAX);
        this.m_indexName = "一目均衡表";
        this.m_paramName[0] = '転換';
        this.m_paramName[1] = '基準';
        this.m_paramName[2] = 'スパン';
        this.m_paramName[3] = '先行１';
        this.m_paramName[4] = '先行２';
        this.m_paramName[5] = '遅行';
        this.m_colCloudW = 'rgb(180, 90, 90)';
	    this.m_colCloudB = 'rgb(0, 50, 90)';
        this.resetIndexColor(false);
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_ICHI(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "転換=" + prmVal[0]
            + "  基準=" + prmVal[1]
            + "  スパン=" + prmVal[2]
            + " )";
        super.setHeader(CD.ICHI, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_ICHI(dataType);
        this.m_techData = new ChartTechICHI();
        this.m_techData.setParameter(prmVal[0], prmVal[1], prmVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[1]);
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[2]);
        this.m_slider[3] = null;
        this.m_slider[4] = null;
        this.m_slider[5] = null;
        this.updateHeader();
    }
    resetIndexColor(isDefault = false) {
        let paramValue = (isDefault)? this.m_drawParam.m_defaultColor.ICHI.c : this.m_drawParam.m_color.ICHI.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2] = null;
        this.m_colorLabel[3].init(paramValue[2]);
        this.m_colorLabel[4].init(paramValue[3]);
        this.m_colorLabel[5].init(paramValue[4]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_ICHI(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
        this.m_slider[3] = null;
        this.m_slider[4] = null;
        this.m_slider[5] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorICHI(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB(), this.m_colorLabel[3].getRGB(),
                                        this.m_colorLabel[4].getRGB(), this.m_colorLabel[5].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_ICHI(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[1][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[2][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[3][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[4][i]);
    }
    getFwdMaxMinValue(dspcnt, fwdcnt, price) {
        for(let i = dspcnt; i < dspcnt + fwdcnt; i++){
            this.m_common.getMaxMinValue(price, this.m_techData.m_data[TS.TI_ICHI_FWD1][i]);
            this.m_common.getMaxMinValue(price, this.m_techData.m_data[TS.TI_ICHI_FWD2][i]);
        }
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    getFwdEntryNum() {
        return this.m_techData.getParameterBase() - 1;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["一目(基準)", "一目(転換)", "一目(先行1)", "一目(先行2)", "一目(遅行)"];
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push(txt[j]);
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix] && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// エンベロープ
//==================================================================================
class ChartENVCtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_ENV, common, 4, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.ENV.c;
        this.m_curYpos = new Array(TS.TI_ENV_MAX);
        this.m_indexName = "エンベロープ";
        this.m_paramName[0] = '期間';
        this.m_paramName[1] = '1%';
        this.m_paramName[2] = '2%';
        this.m_paramName[3] = '3%';
        this.resetIndexColor(false);
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_ENV(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "期間=" + prmVal[0]
            + "  %1=" + (prmVal[1] * 0.1)
            + "  %2=" + (prmVal[2] * 0.1)
            + "  %3=" + (prmVal[3] * 0.1)
            + " )";
        super.setHeader(CD.ENV, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_ENV(dataType);
        this.m_techData = new ChartTechENV();
        this.m_techData.setParameter(prmVal[0], prmVal[1], prmVal[2], prmVal[3]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[1]);
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[2]);
        this.m_slider[3].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[3]);
        this.updateHeader();
    }
    resetIndexColor(isDefault = false) {
        let paramValue = (isDefault)? this.m_drawParam.m_defaultColor.ENV.c : this.m_drawParam.m_color.ENV.c;
        this.m_colorLabel[0].init(paramValue[3]);
        this.m_colorLabel[1].init(paramValue[2]);
        this.m_colorLabel[2].init(paramValue[1]);
        this.m_colorLabel[3].init(paramValue[0]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_ENV(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
        this.m_slider[3].setCurValue(defaultParamValue[3]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorENV(this.m_colorLabel[3].getRGB(), this.m_colorLabel[2].getRGB(), this.m_colorLabel[1].getRGB(), this.m_colorLabel[0].getRGB(),
                                    this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB(), this.m_colorLabel[3].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue(), this.m_slider[3].getCurValue()];
        this.m_techParam.setParam_ENV(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[6][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["ENV +%3", "ENV +%2", "ENV +%1", "ENV MA", "ENV -%1", "ENV -%2", "ENV -%3"];
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push(txt[j]);
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix] && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// ボラティリティシステム
//==================================================================================
class ChartVSCtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_VS, common, 4, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.VS.c;
        this.m_curYpos = new Array(TS.TI_VS_MAX);
        this.m_indexName = "ボラティリティシステム";
        this.m_paramName[0] = '期間';
        this.m_paramName[1] = '係数';
        this.m_paramName[2] = '上方バンド';
        this.m_paramName[3] = '下方バンド';
        this.resetIndexColor();
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_VS(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "期間=" + prmVal[0]
            + "  係数=" + prmVal[1]
            + " )";
        super.setHeader(CD.VS, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_VS(dataType);
        this.m_techData = new ChartTechVS();
        this.m_techData.setParameter(prmVal[0], prmVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[1]);
        this.m_slider[2] = null;
        this.m_slider[3] = null;
        this.updateHeader();
    }
    resetIndexColor() {
        let paramValue = this.m_drawParam.m_color.VS.c;
        this.m_colorLabel[0] = null; 
        this.m_colorLabel[1] = null; 
        this.m_colorLabel[2].init(paramValue[0]);
        this.m_colorLabel[3].init(paramValue[1]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_VS(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2] = null;
        this.m_slider[3] = null;   
    }
    updateIndexParam() {
        this.m_drawParam.setColorVS(this.m_colorLabel[2].getRGB(), this.m_colorLabel[3].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_VS(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[1][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["上方バンド", "下方バンド"];
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push(txt[j]);
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix]  && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// HLバンド
//==================================================================================
class ChartHLBCtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_HLB, common, 4, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.HLB.c;
        this.m_curYpos = new Array(TS.TI_HLB_MAX);
        this.m_indexName = "HLバンド";
        this.m_paramName[0] = '期間';
        this.m_paramName[1] = '高値';
        this.m_paramName[2] = '安値';
        this.m_paramName[3] = '中値';
        this.resetIndexColor();
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_HLB(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "期間=" + prmVal[0]
            + " )";
        super.setHeader(CD.HLB, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_HLB(dataType);
        this.m_techData = new ChartTechHLB();
        this.m_techData.setParameter(prmVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
        this.m_slider[3] = null;
        this.updateHeader();
    }
    resetIndexColor() {
        let paramValue = this.m_drawParam.m_color.HLB.c;
        this.m_colorLabel[0] = null; 
        this.m_colorLabel[1].init(paramValue[0]);
        this.m_colorLabel[2].init(paramValue[1]);
        this.m_colorLabel[3].init(paramValue[2]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_HLB(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
        this.m_slider[3] = null;   
    }
    updateIndexParam() {
        this.m_drawParam.setColorHLB(this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB(), this.m_colorLabel[3].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_HLB(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[2][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["Hﾊﾞﾝﾄﾞ", "Lﾊﾞﾝﾄﾞ", "中"]; // 中値平均は未表示
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push(txt[j]);
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix]  && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
//　ピボット
//==================================================================================
class ChartPVTCtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_PVT, common, 5, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.PVT.c;
        this.m_curYpos = new Array(TS.TI_PVT_MAX);
        this.m_indexName = "ピボット";
        this.m_paramName[0] = 'ピボット';
        this.m_paramName[1] = 'サポートライン １';
        this.m_paramName[2] = 'レジスタンスライン １';
        this.m_paramName[3] = 'サポートライン ２';
        this.m_paramName[4] = 'レジスタンスライン ２';
        this.resetIndexColor();
    }
    updateHeader() {
        const headerStr = this.m_indexName;
        super.setHeader(CD.PVT, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        this.m_techData = new ChartTechPVT();
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0] = null;
        this.m_slider[1] = null;
        this.m_slider[2] = null;
        this.m_slider[3] = null;
        this.m_slider[4] = null;
        this.updateHeader();
    }
    resetIndexColor() {
        let paramValue = this.m_drawParam.m_color.PVT.c;
        this.m_colorLabel[0].init(paramValue[0]); 
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2].init(paramValue[2]);
        this.m_colorLabel[3].init(paramValue[3]);
        this.m_colorLabel[4].init(paramValue[4]);
    }
    resetSlider() {
        // テクニカルパラメータ無し 
    }
    updateIndexParam() {
        this.m_drawParam.setColorPVT(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB(), this.m_colorLabel[3].getRGB(), this.m_colorLabel[4].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        // テクニカルパラメータ無し
        // this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[3][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[4][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["PVT", "ﾚｼﾞｽﾄ1", "ﾚｼﾞｽﾄ2", "ｻﾎﾟｰﾄ1", "ｻﾎﾟｰﾄ2"];
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push(txt[j]);
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix]  && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// パラボリック
//==================================================================================
class ChartPARCtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_PAR, common, 7, m_headerTree);
        this.m_paramMulti = 1000;
        this.m_paramDec = 3;
        this.m_paramColor = this.m_drawParam.m_color.PAR.c;
        this.m_curYpos = new Array(TS.TI_PAR_MAX);
        this.m_indexName = "パラボリック";
        this.m_paramName[0] = 'AF(加速因数)';
        this.m_paramName[1] = 'STEP';
        this.m_paramName[2] = 'MAX';
        this.m_paramName[3] = '上方(外枠)';
        this.m_paramName[4] = '上方';
        this.m_paramName[5] = '下方(外枠)';
        this.m_paramName[6] = '下方';
        this.resetIndexColor();
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_PAR(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "AF=" + prmVal[0] /  this.m_paramMulti
            + "  STEP=" + prmVal[1] /  this.m_paramMulti
            + "  MAX=" + prmVal[2] /  this.m_paramMulti
            + " )";
        super.setHeader(CD.PAR, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_PAR(dataType);
        this.m_techData = new ChartTechPAR();
        this.m_techData.setParameter(prmVal[0], prmVal[1], prmVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0], this.m_paramDec);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[1], this.m_paramDec);
        this.m_slider[2].init(MIN_PARAM_VALUE, 1000, 1, prmVal[2], this.m_paramDec);
        this.m_slider[3] = null;
        this.m_slider[4] = null;
        this.m_slider[5] = null;
        this.m_slider[6] = null;
        this.updateHeader();
    }
    resetIndexColor() {
        let paramValue = this.m_paramColor;
        this.m_colorLabel[0] = null; 
        this.m_colorLabel[1] = null; 
        this.m_colorLabel[2] = null; 
        this.m_colorLabel[3].init(paramValue[0]);
        this.m_colorLabel[4].init(paramValue[1]);
        this.m_colorLabel[5].init(paramValue[2]);
        this.m_colorLabel[6].init(paramValue[3]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_PAR(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
        this.m_slider[3] = null;
        this.m_slider[4] = null;
        this.m_slider[5] = null;
        this.m_slider[6] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorPAR(this.m_colorLabel[3].getRGB(), this.m_colorLabel[4].getRGB(), this.m_colorLabel[5].getRGB(), this.m_colorLabel[6].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_PAR(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos, candle_width) {
        let par_value = this.m_techData.m_data[0][ix];
        let stop_reverse = this.m_techData.m_data[1][ix];
        if (stop_reverse != 0) {
            let par_yPos  = this.m_drawInf.cnvValueToPosYForPrice(par_value);
            let x1 = cur_xpos;
            let y1 = par_yPos;
            const idxcolor = this.m_drawParam.m_color.PAR.c;
            if(stop_reverse === 1){
                this.m_cc.drawEllipseFill(this.m_drawParam.getColor(this.m_paramColor[0]), this.m_drawParam.getColor(this.m_paramColor[1]), x1, y1, candle_width);
            }else{
                this.m_cc.drawEllipseFill(this.m_drawParam.getColor(this.m_paramColor[2]), this.m_drawParam.getColor(this.m_paramColor[3]), x1, y1, candle_width);
            }
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["SAR"];
        const j = 0;
        indexPanel.m_indexName.push(txt[j]);
        indexPanel.m_indexColor.push(indexColor[j]);
        if (this.m_techData.m_data[j][ix] && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
            indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
        } else {
            indexPanel.m_indexValue.push("-");
        }

    }
}
//==================================================================================
// 高安移動平均
//==================================================================================
class ChartHMACtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_HMA, common, 3, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.HMA.c;
        this.m_curYpos = new Array(TS.TI_HMA_MAX);
        this.m_indexName = "高安移動平均";
        this.m_paramName[0] = '期間';
        this.m_paramName[1] = '高値';
        this.m_paramName[2] = '安値';
        this.resetIndexColor();
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_HMA(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "期間=" + prmVal[0]
            + " )";
        super.setHeader(CD.HMA, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_HMA(dataType);
        this.m_techData = new ChartTechHMA();
        this.m_techData.setParameter(prmVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
        this.updateHeader();
    }
    resetIndexColor() {
        let paramValue = this.m_drawParam.m_color.HMA.c;
        this.m_colorLabel[0] = null; 
        this.m_colorLabel[1].init(paramValue[0]);
        this.m_colorLabel[2].init(paramValue[1]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_HMA(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorHMA(this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_HMA(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[1][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["SMA-H", "SMA-L"];
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push(txt[j]);
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix]  && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// 回帰トレンド
//==================================================================================
class ChartLRTCtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_LRT, common, 6, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.LRT.c;
        this.m_curYpos = new Array(TS.TI_LRT_MAX);
        this.m_indexName = "回帰トレンド";
        this.m_paramName[0] = '期間';
        this.m_paramName[1] = '+2μ';
        this.m_paramName[2] = '+1μ';
        this.m_paramName[3] = 'FIT';
        this.m_paramName[4] = '-1μ';
        this.m_paramName[5] = '-2μ';
        this.resetIndexColor();
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_LRT(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "期間=" + prmVal[0]
            + " )";
        super.setHeader(CD.LRT, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_LRT(dataType);
        this.m_techData = new ChartTechLRT();
        this.m_techData.setParameter(prmVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
        this.m_slider[3] = null;
        this.m_slider[4] = null;
        this.m_slider[5] = null;
        this.updateHeader();
    }
    resetIndexColor() {
        let paramValue = this.m_drawParam.m_color.LRT.c;
        this.m_colorLabel[0] = null; 
        this.m_colorLabel[1].init(paramValue[0]);
        this.m_colorLabel[2].init(paramValue[1]);
        this.m_colorLabel[3].init(paramValue[2]);
        this.m_colorLabel[4].init(paramValue[3]);
        this.m_colorLabel[5].init(paramValue[4]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_LRT(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
        this.m_slider[3] = null;
        this.m_slider[4] = null;
        this.m_slider[5] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorLRT(this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB(),
                        this.m_colorLabel[3].getRGB(), this.m_colorLabel[4].getRGB(), this.m_colorLabel[5].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_LRT(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[0][i]);
        this.m_common.getMaxMinValue(price, this.m_techData.m_data[4][i]);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        const beginEntry = this.m_techData.getBeginIndex();
        const lrt_ix = ix - beginEntry;
        if(beginEntry === ix){
            for (let i = 0; i < this.m_paramColor.length; i++) {
                this.m_curYpos[i] = this.m_drawInf.cnvValueToPosYForPrice(Math.floor(this.m_techData.m_data[i][lrt_ix]));
            }
            return;
        }
        if (beginEntry < ix) {
            for (let i = 0; i < this.m_paramColor.length; i++) {
                this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), this.m_techData.m_data[i][lrt_ix], prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
            }
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["LRT[+2μ]", "LRT[+1μ]", "LRT[FIT]", "LRT[-1μ]", "LRT[-2μ]"];
        const beginEntry = this.m_techData.getBeginIndex();
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push(txt[j]);
            indexPanel.m_indexColor.push(indexColor[j]);
            const lrt_ix = ix - beginEntry;
            if (this.m_techData.m_data[j][lrt_ix]  && this.m_techData.m_data[j][lrt_ix] != CD.INDEX_NO_VALUE) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][lrt_ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// 時系列新値足
//==================================================================================
class ChartTBRKCtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_TBRK, common, 3, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.TBRK.c;
        this.m_curYpos = new Array(TS.TI_TBRK_MAX);
        this.m_indexName = "時系列新値足";
        this.m_paramName[0] = '本数';
        this.m_paramName[1] = '陽線';
        this.m_paramName[2] = '陰線';
        this.resetIndexColor();
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_TBRK(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "期間=" + prmVal[0]
            + " )";
        super.setHeader(CD.TBRK, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_TBRK(dataType);
        this.m_techData = new ChartTechTBRK();
        this.m_techData.setParameter(prmVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
        this.updateHeader();
    }
    resetIndexColor() {
        this.m_colorLabel[0] = null; 
        this.m_colorLabel[1].init(this.m_paramColor[0]);
        this.m_colorLabel[2].init(this.m_paramColor[1]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_TBRK(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorTBRK(this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_TBRK(dataType, updateParamValue);
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["開始", "終了"];
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push(txt[j]);
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix]  && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
    //==============================================================================
    //	[描画] 時系列新値足
    //==============================================================================
    drawRecordChart(ix, xpos, entry_width, candle_width, brk_OpnXpos, brk_OpnYpos1, brk_OpnYpos2) {
        const buyColor = this.m_drawParam.getColor(this.m_paramColor[0]);
        const sellColor = this.m_drawParam.getColor(this.m_paramColor[1]);
        const frameColor = "rgb(255, 255, 255)";
        const alpha = 0.5;
        let brkOpnXpos = brk_OpnXpos;
        let brkOpnYpos1 = brk_OpnYpos1;
        let brkOpnYpos2 = brk_OpnYpos2;
        const disp_mode = this.m_info.getDispMode();
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let xEndPos = xpos + entry_width;
    
        let bgnPrice = this.m_techData.m_data[TS.TI_TBRK_BGN][ix];
        let endPrice = this.m_techData.m_data[TS.TI_TBRK_END][ix];

        //初回時のみ開始線上に合わせる(左縦線塗潰しのため)
        if(ix === this.m_info.getBeginIndex()){
            //DUMMYが無い事を判定
            if(brkOpnXpos === this.m_drawInf.getChartAreaBgnPosX()){
                if(0 < ix){
                    //前エントリがブレイクか判定
                    if(0.0 === this.m_techData.m_data[TS.TI_TBRK_END][ix-1]){
                        brkOpnXpos -= 1;
                    }
                }
            }
        }
        if(0.0 < endPrice){
            if(brkOpnYpos1 == 0){
                brkOpnYpos1 = this.m_drawInf.cnvValueToPosYForPrice(bgnPrice);
                brkOpnYpos2 = this.m_drawInf.cnvValueToPosYForPrice(endPrice);
                //初回ブレイクのため直前エントリのブレイク時値
                for(let i = ix - 1; -1 < i; i--){
                    let bgnPrice = this.m_techData.m_data[TS.TI_TBRK_BGN][i];
                    let endPrice = this.m_techData.m_data[TS.TI_TBRK_END][i];
                    if(0.0 < endPrice){
                        brkOpnYpos1 = this.m_drawInf.cnvValueToPosYForPrice(bgnPrice);
                        brkOpnYpos2 = this.m_drawInf.cnvValueToPosYForPrice(endPrice);
                        break;
                    }
                }
            }
            let ypos1 = this.m_drawInf.cnvValueToPosYForPrice(bgnPrice);
            let ypos2 = this.m_drawInf.cnvValueToPosYForPrice(endPrice);
            let save_ypos = 0;
            //if(disp_mode !== CHART_DMODE_REV){
                //通常表示
                let yHeight;
                let fillColor;
                if(bgnPrice < endPrice){
                    //新値陽線(小さい値 == 値段が高い)
                    save_ypos = (brkOpnYpos2 < brkOpnYpos1)? brkOpnYpos2 : brkOpnYpos1;
                    yHeight = (save_ypos === ypos2)? ((ypos2-1) - save_ypos) : (ypos2 - save_ypos);
                    fillColor = buyColor;
                }else{
                    //新値陰線(きい値 == 値段が安い)
                    save_ypos = (brkOpnYpos2 < brkOpnYpos1)? brkOpnYpos1 : brkOpnYpos2;
                    yHeight = (save_ypos === ypos2)? ((ypos2-1) - save_ypos) : (ypos2 - save_ypos);
                    fillColor = sellColor;
                }
                //this.m_cc.drawRect(fillColor, brkOpnXpos, save_ypos, (xEndPos - brkOpnXpos), ((ypos2) - save_ypos));
                this.m_cc.drawBlendRect(fillColor, frameColor, alpha, brkOpnXpos, save_ypos, (xEndPos - brkOpnXpos), yHeight);
            // }else{
            //     //反転表示
            //     if(bgnPrice < endPrice){
            //         //新値陽線
            //         if(brkOpnYpos1 < brkOpnYpos2){ //小さい値 == 値段が高い
            //             save_ypos = brkOpnYpos2;
            //         }else{
            //             save_ypos = brkOpnYpos1;
            //         }
            //         if(save_ypos === ypos2){
            //             this.m_cc.drawRect(buyColor, brkOpnXpos, save_ypos, (xEndPos - brkOpnXpos), ((ypos2-1) - save_ypos))
            //         }else{
            //             this.m_cc.drawRect(buyColor, brkOpnXpos, save_ypos, (xEndPos - brkOpnXpos), ((ypos2) - save_ypos))
            //         }
            //     }else{
            //         //新値陰線
            //         if(brkOpnYpos1 < brkOpnYpos2){ //大きい値 == 値段が安い
            //             save_ypos = brkOpnYpos1;
            //         }else{
            //             save_ypos = brkOpnYpos2;
            //         }
            //         if(save_ypos === ypos2){
            //             this.m_cc.drawRect(sellColor, brkOpnXpos, save_ypos, (xEndPos - brkOpnXpos), ((ypos2-1) - save_ypos))
            //         }else{
            //             this.m_cc.drawRect(sellColor, brkOpnXpos, save_ypos, (xEndPos - brkOpnXpos), ((ypos2) - save_ypos))
            //         }
            //     }
            // }
            brkOpnXpos = xEndPos;
            brkOpnYpos1 = save_ypos;
            brkOpnYpos2 = ypos2;
        }	
    
        xpos += entry_width;
    
        //次回最終エントリの場合は途中まで描画する必要あり
        if (chartEndPosX < xpos + entry_width) {
            if (endPrice <= 0.0) { //今回のエントリでブレイクしていない
                let szHistList = this.m_info.getCurHistSize();
                if (ix + 1 < szHistList) {
                    let hist = this.m_info.getCurrentHist();
                    for (let i = ix + 1; i < szHistList; i++) {
                        let bgnPrice = this.m_techData.m_data[TS.TI_TBRK_BGN][i];
                        let endPrice = this.m_techData.m_data[TS.TI_TBRK_END][i];
                        if (0.0 < endPrice) {
                            if (brkOpnYpos1 == 0) {
                                brkOpnYpos1 = this.m_drawInf.cnvValueToPosYForPrice(bgnPrice);
                                brkOpnYpos2 = this.m_drawInf.cnvValueToPosYForPrice(endPrice);
                            }
                            let ypos1 = this.m_drawInf.cnvValueToPosYForPrice(bgnPrice);
                            let ypos2 = this.m_drawInf.cnvValueToPosYForPrice(endPrice);
                            let save_ypos = 0;
                            //if (disp_mode != CHART_DMODE_REV) {
                                //通常表示
                                if (bgnPrice < endPrice) {
                                    let yHeight;
                                    let fillColor;
                                    if(bgnPrice < endPrice){
                                        //新値陽線(小さい値 == 値段が高い)
                                        save_ypos = (brkOpnYpos2 < brkOpnYpos1)? brkOpnYpos2 : brkOpnYpos1;
                                        yHeight = (save_ypos === ypos2)? ((ypos2-1) - save_ypos) : (ypos2 - save_ypos);
                                        fillColor = buyColor;
                                    }else{
                                        //新値陰線(きい値 == 値段が安い)
                                        save_ypos = (brkOpnYpos2 < brkOpnYpos1)? brkOpnYpos1 : brkOpnYpos2;
                                        yHeight = (save_ypos === ypos2)? ((ypos2-1) - save_ypos) : (ypos2 - save_ypos);
                                        fillColor = sellColor;
                                    }
                                    //this.m_cc.drawRect(fillColor, brkOpnXpos, save_ypos, ((chartEndPosX + 2) - brkOpnXpos), ((ypos2) - save_ypos));
                                    this.m_cc.drawBlendRect(fillColor, frameColor, alpha, brkOpnXpos, save_ypos, ((chartEndPosX + 2) - brkOpnXpos), yHeight);
                                }

                                let yHeight;
                                let fillColor;
                                if(bgnPrice < endPrice){
                                    //新値陽線(小さい値 == 値段が高い)
                                    save_ypos = (brkOpnYpos2 < brkOpnYpos1)? brkOpnYpos2 : brkOpnYpos1;
                                    yHeight = (save_ypos === ypos2)? ((ypos2-1) - save_ypos) : (ypos2 - save_ypos);
                                    fillColor = buyColor;
                                }else{
                                    //新値陰線(きい値 == 値段が安い)
                                    save_ypos = (brkOpnYpos2 < brkOpnYpos1)? brkOpnYpos1 : brkOpnYpos2;
                                    yHeight = (save_ypos === ypos2)? ((ypos2-1) - save_ypos) : (ypos2 - save_ypos);
                                    fillColor = sellColor;
                                }
                                //this.m_cc.drawRect(fillColor, brkOpnXpos, save_ypos, ((chartEndPosX + 2) - brkOpnXpos), ((ypos2) - save_ypos));
                                this.m_cc.drawBlendRect(fillColor, frameColor, alpha, brkOpnXpos, save_ypos, ((chartEndPosX + 2) - brkOpnXpos), yHeight);

                            // } else {
                            //     //反転表示
                            //     if (bgnPrice < endPrice) {
                            //         //新値陽線
                            //         if (brkOpnYpos1 < brkOpnYpos2) { //小さい値 == 値段が高い
                            //             save_ypos = brkOpnYpos2;
                            //         } else {
                            //             save_ypos = brkOpnYpos1;
                            //         }
                            //         if(save_ypos === ypos2){
                            //             this.m_cc.drawRect(sellColor, brkOpnXpos, save_ypos, ((chartEndPosX + 2) - brkOpnXpos), ((ypos2-1) - save_ypos))
                            //         }else{
                            //             this.m_cc.drawRect(sellColor, brkOpnXpos, save_ypos, ((chartEndPosX + 2) - brkOpnXpos), ((ypos2) - save_ypos))
                            //         }
                            //     } else {
                            //         //新値陰線
                            //         if (brkOpnYpos1 < brkOpnYpos2) { //大きい値 == 値段が安い
                            //             save_ypos = brkOpnYpos1;
                            //         } else {
                            //             save_ypos = brkOpnYpos2;
                            //         }
                            //         if(save_ypos === ypos2){
                            //             this.m_cc.drawRect(sellColor, brkOpnXpos, save_ypos, ((chartEndPosX + 2) - brkOpnXpos), ((ypos2-1) - save_ypos))
                            //         }else{
                            //             this.m_cc.drawRect(sellColor, brkOpnXpos, save_ypos, ((chartEndPosX + 2) - brkOpnXpos), ((ypos2) - save_ypos))
                            //         }
                            //     }
                            // }
                            break;
                        }
                    }
                }
            }
        }
        
        return [xpos, brkOpnXpos >> 0, brkOpnYpos1, brkOpnYpos2];
    }
}
//==================================================================================
// 時系列カギ足
//==================================================================================
class ChartTKAGICtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_TKAGI, common, 2, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.TKAGI.c;
        this.m_indexColor;
        this.m_paramMulti = 100;
        this.m_paramDec = 2;
        this.m_curYpos = new Array(TS.TI_TKAGI_MAX);
        this.m_kagiOpnXpos = 0;
        this.m_indexName = "時系列カギ足";
        this.m_paramName[0] = '転換率';
        this.m_paramName[1] = '線';
        //this.m_paramName[2] = '陰線';
        this.resetIndexColor();
    }
    updateHeader() {
        const prmVal = this.m_techParam.getParam_TKAGI(super.getDataType());
        const headerStr = this.m_indexName + " ( "
            + "転換率=" + prmVal[0] / this.m_paramMulti
            + " )";
        super.setHeader(CD.TKAGI, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.getDataType();
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        const prmVal = this.m_techParam.getParam_TKAGI(dataType);
        this.m_techData = new ChartTechTKAGI();
        this.m_techData.setParameter(prmVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, 1000, 1, prmVal[0], this.m_paramDec);
        this.m_slider[1] = null;
        //this.m_slider[2] = null;
        this.updateHeader();
    }
    resetIndexColor() {
        this.m_colorLabel[0] = null; 
        this.m_colorLabel[1].init(this.m_paramColor[0]);
        //this.m_colorLabel[2].init(paramValue[1]);
        this.m_indexColor = this.m_drawParam.getColor(this.m_paramColor[0]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_TKAGI(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1] = null;
        //this.m_slider[2] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorTKAGI(this.m_colorLabel[1].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_TKAGI(dataType, updateParamValue);
        this.resetIndexData();
        this.m_indexColor = this.m_drawParam.getColor(this.m_paramColor[0]);
    }
    getMaxMinValue(i, price) {
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        let open_ix = this.m_techData.m_data[TS.TI_TKAGI_BGN][ix];
        let reverse_ix = this.m_techData.m_data[TS.TI_TKAGI_END][ix];
        let hlPrice = this.m_techData.m_data[TS.TI_TKAGI_HL][ix];
        if (0 <= reverse_ix) {
            let opn_hlprice = this.m_techData.m_data[TS.TI_TKAGI_HL][open_ix];
            let ypos1 = this.m_drawInf.cnvValueToPosYForPrice(opn_hlprice) >> 0;
            let ypos2 = this.m_drawInf.cnvValueToPosYForPrice(hlPrice) >> 0;
            this.m_cc.drawBoldLine(this.m_indexColor, 1.5, this.m_kagiOpnXpos, ypos1, this.m_kagiOpnXpos, ypos2);
            this.m_cc.drawBoldLine(this.m_indexColor, 1.5, this.m_kagiOpnXpos, ypos2, cur_xpos, ypos2);
            this.m_kagiOpnXpos = cur_xpos;
        }
    }
    drawAfterGraph(ix) {
        const szHistList = this.m_info.getCurHistSize();
        // 次回BREAKエントリ検索し最後の線を描画
        for (let wix = ix + 1; wix < szHistList; wix++) {
            let nxt_open_ix = this.m_techData.m_data[TS.TI_TKAGI_BGN][wix];
            let nxt_reverse_ix = this.m_techData.m_data[TS.TI_TKAGI_END][wix];
            let nxt_hlPrice = this.m_techData.m_data[TS.TI_TKAGI_HL][wix];
            if (0 <= nxt_reverse_ix) {
                let opn_hlprice = this.m_techData.m_data[TS.TI_TKAGI_HL][nxt_open_ix];
                let ypos1 = this.m_drawInf.cnvValueToPosYForPrice(opn_hlprice);
                let ypos2 = this.m_drawInf.cnvValueToPosYForPrice(nxt_hlPrice);
                let xpos2 = this.m_drawInf.getChartAreaEndPosX() + 2;
                this.m_cc.drawBoldLine(this.m_indexColor, 1.5, this.m_kagiOpnXpos, ypos1, this.m_kagiOpnXpos, ypos2);
                this.m_cc.drawBoldLine(this.m_indexColor, 1.5, this.m_kagiOpnXpos, ypos2, xpos2, ypos2);
                break;
            }
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["転換率"];
        for (let j = 0; j < len; j++) {
            indexPanel.m_indexName.push(txt[j]);
            indexPanel.m_indexColor.push(indexColor[j]);
            if (this.m_techData.m_data[j][ix]  && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
                indexPanel.m_indexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], dec));
            } else {
                indexPanel.m_indexValue.push("-");
            }
        }
    }
}
//==================================================================================
// VWAP
//==================================================================================
class ChartVWAPCtrl extends ChartMainIndexCtrl {
	constructor(common, m_headerTree) {
        super(CD.CHART_INDEX_VWAP, common, 1, m_headerTree);
        this.m_paramColor = this.m_drawParam.m_color.VWAP.c;
        this.m_curYpos = new Array(1);
        this.m_indexName = "VWAP";
        this.resetIndexColor();
    }
    updateHeader() {
        const headerStr = this.m_indexName;
        super.setHeader(CD.VWAP, headerStr);
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = super.getDataType();
        const prmVal = this.m_techParam.getParam_SMA(dataType);
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        this.m_slider[0].null;
        this.updateHeader();
    }
    resetIndexColor(isDefault = false) {
        let paramValue = (isDefault)? this.m_drawParam.m_defaultColor.VWAP.c : this.m_drawParam.m_color.VWAP.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_VWAP(dataType);
        this.m_slider[0].null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorVWAP(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.resetIndexData();
    }
    getMaxMinValue(i, price) {
        const hist = this.m_info.getCurrentHist();
        this.m_common.getMaxMinValue(price, hist.mChartList[i].mVWAP / 100);
    }
    drawGraph(ix, cur_xpos, prv_xpos) {
        const hist = this.m_info.getCurrentHist();
        for (let i = 0; i < this.m_paramColor.length; i++) {
            this.m_curYpos[i] = super.drawGraphLine(this.m_drawParam.getColor(this.m_paramColor[i]), hist.mChartList[ix].mVWAP / 100, prv_xpos, this.m_curYpos[i], cur_xpos) >> 0;
        }
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const dec = this.m_drawInf.getScaleValueDec();
        const len = this.m_paramColor.length;
        const indexColor = this.m_common.getGraphColor(this.m_paramColor, len);
        const indexPanel = this.m_common.m_indexPanel;
        const hist = this.m_info.getCurrentHist();
        const txt = ["VWAP"];
        const j = 0;
        indexPanel.m_indexName.push(txt[j]);
        indexPanel.m_indexColor.push(indexColor[j]);
        if (0 < hist.mChartList[ix].mVWAP) {
            indexPanel.m_indexValue.push((hist.mChartList[ix].mVWAP / this.m_common.m_decPoint[4]).toFixed(4));
        } else {
            indexPanel.m_indexValue.push("-");
        }

    }
}