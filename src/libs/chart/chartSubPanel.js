import ChartCommon from './chartCommon';
import ChartSlider from './chartSlider';
import ChartButton from './chartButton';
import {ChartColorParamLabel} from './chartColorPicker';
import {ChartTechSMAV} from './chartTechIndex';
import {ChartTechMACD, ChartTechSTC, ChartTechSSTC, ChartTechMOM, ChartTechRSIA, ChartTechRSIB, ChartTechRCI} from './chartTechSubIndex';
import {ChartTechPL, ChartTechDMA, ChartTechUO, ChartTechATR, ChartTechROC, ChartTechSWR, ChartTechARN} from './chartTechSubIndex';
import {ChartTechWR, ChartTechCCI, ChartTechSNR, ChartTechDPO, ChartTechSD, ChartTechSDV, ChartTechHV} from './chartTechSubIndex';
import {ChartTechVRA, ChartTechVRB, ChartTechDMI, ChartTechOBV, ChartTechRTA, ChartTechMGN} from './chartTechSubIndex';
import * as TS from './chartTechSubIndex';
import * as CD from './chartDef';
import * as IDX from './chartDef';

const INIT_TITTLE_WIDTH = 170;
const MIN_PARAM_VALUE = 1;
const MAX_PARAM_VALUE = 100;

export class ChartSubPanel {
	constructor(chartCanvas) {
        this.m_cc = chartCanvas;
        this.m_type = 0;
        this.m_common = new ChartCommon(chartCanvas);
        this.m_drawInf = this.m_common.m_drawInf;
        this.m_techParam = null;
        this.m_drawParam = null;
        this.m_info = null;
        this.m_lastXPos = 0; //ローソク足の最終エントリ描画位
        this.m_indexCtrl = null;
    }
    setBaseInfo(info) {
        this.m_info = info;
        this.m_common.m_info = info;
    }
    setTechParam(prm) {
        this.m_techParam = prm;
    }
    setDrawParam(prm) {
        this.m_drawParam = prm;
        this.m_common.m_drawParam = prm;
    }
    //====================================================================
    //  データ初期化
    //====================================================================
    initData() {
        //this.m_drawInf.setScaleValueTop(100);
        //this.m_drawInf.setScaleValueBtm(0);

        switch(this.m_type) {
            case CD.CHART_INDEX_SMAV:
                this.m_indexCtrl = new ChartVOLCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_MACD:
                this.m_indexCtrl = new ChartMACDCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_STC:
                this.m_indexCtrl = new ChartSTCCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_SSTC:
                this.m_indexCtrl = new ChartSSTCCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_MOM:
                this.m_indexCtrl = new ChartMOMCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_RSIA:
                this.m_indexCtrl = new ChartRSIACtrl(this.m_common);
                break;
            case CD.CHART_INDEX_RSIB:
                this.m_indexCtrl = new ChartRSIBCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_RCI:
                this.m_indexCtrl = new ChartRCICtrl(this.m_common);
                break;
            case CD.CHART_INDEX_WR:
                this.m_indexCtrl = new ChartWRCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_PL:
                this.m_indexCtrl = new ChartPLCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_DMA:
                this.m_indexCtrl = new ChartDMACtrl(this.m_common);
                break;
            case CD.CHART_INDEX_UO:
                this.m_indexCtrl = new ChartUOCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_ATR:
                this.m_indexCtrl = new ChartATRCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_ROC:
                this.m_indexCtrl = new ChartROCCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_SWR:
                this.m_indexCtrl = new ChartSWRCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_ARN:
                this.m_indexCtrl = new ChartARNCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_ARO:
                this.m_indexCtrl = new ChartAROCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_CCI:
                this.m_indexCtrl = new ChartCCICtrl(this.m_common);
                break;
            case CD.CHART_INDEX_SNR:
                this.m_indexCtrl = new ChartSNRCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_DPO:
                this.m_indexCtrl = new ChartDPOCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_SD:
                this.m_indexCtrl = new ChartSDCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_SDV:
                this.m_indexCtrl = new ChartSDVCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_HV:
                this.m_indexCtrl = new ChartHVCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_VRA:
                this.m_indexCtrl = new ChartVRACtrl(this.m_common);
                break;
            case CD.CHART_INDEX_VRB:
                this.m_indexCtrl = new ChartVRBCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_DMI:
                this.m_indexCtrl = new ChartDMICtrl(this.m_common);
                break;
            case CD.CHART_INDEX_OBV:
                this.m_indexCtrl = new ChartOBVCtrl(this.m_common);
                break;
            case CD.CHART_INDEX_RTA:
                this.m_indexCtrl = new ChartRTACtrl(this.m_common);
                break;
            case CD.CHART_INDEX_MGN:
                this.m_indexCtrl = new ChartMGNCtrl(this.m_common);
                break;
            default:
                this.m_indexCtrl = null;
                break;
        }

        this.m_indexCtrl.initData(this.m_info, this.m_techParam, this.m_drawParam);
        return;
    }
    updateIndexParam() {
        if(this.m_indexCtrl !== null){
            this.m_indexCtrl.updateIndexParam();
        }      
    }
    // 更新はせず表示上のみ初期値リセット
    resetDefaultParam() {
        if(this.m_indexCtrl !== null){
            this.m_indexCtrl.resetSlider();
            this.m_indexCtrl.resetIndexColor();
        }     
    }
    resetIndexParam() {
        if(this.m_indexCtrl !== null){
            this.m_indexCtrl.resetIndexParam();
        }   
    }
    resetIndexData() {
        if(this.m_indexCtrl !== null){
            this.m_indexCtrl.resetIndexData();
        }
    }
    updateColorParam() {
        if(this.m_indexCtrl !== null){
            this.m_indexCtrl.updateColorParam();
        }     
    }
    resetIndexColor() {
        if(this.m_indexCtrl !== null){
            this.m_indexCtrl.resetIndexColor();
        }
    }
    setColorPickerCurrnt() {
        if(this.m_indexCtrl !== null){
            return this.m_indexCtrl.setColorPickerCurrnt();
        }   
    }
    //====================================================================
    //  更新データ
    //====================================================================
    updateData() {
        if (!this.m_indexCtrl) return;
        var ix = this.m_info.getCurrentHist().mLastIndex;
        this.m_indexCtrl.updateIndexData(ix);
        this.m_changeSizeFlag = true;
        return;
    }
    //==============================================================================
    //	[描画] メイン
    //==============================================================================
    draw(rc, areaIndex) {
        if (!this.m_indexCtrl) return;
        let area_width = rc.right - rc.left;
        let area_height = rc.bottom - rc.top;
        this.m_drawInf.setAreaTop(rc.top);
        this.m_drawInf.setAreaBottom(rc.bottom);
        const top_margin = 5;
        this.m_drawInf.setChartAreaMarginTop(top_margin);
        this.m_drawInf.setChartAreaMarginBtm(5);

        // スケール用マージン調整
        this.m_common.settLeftRighAreaMargin();

        let szHistList = this.m_info.getCurHistSize();
        let pHist = this.m_info.getCurrentHist();

        if (szHistList === 0) {
            return;
        }

        // 一度全塗り
        this.m_cc.drawBackground(0, rc.top, area_width, area_height);

        //描画値段小数点セット
        this.m_drawInf.setScaleValueDec(pHist.mDecimalScale);

        //全体表示モード
        let all_disp_mode = false;
        //可変表示モード
        let var_disp_mode = this.m_info.isVariableMode();
        //可変モード描画値
        let var_bgn_ix = this.m_info.getVariableBgnIndex();
        let var_end_ix = this.m_info.getVariableEndIndex();
        if(var_bgn_ix < 0){
            var_disp_mode = false;
        }
	    //通常表示モード
	    let nml_mode = false;
        if(!all_disp_mode && !var_disp_mode) nml_mode = true;

        //初期化
        this.m_drawInf.setChartAreaHeight(0);

        //横軸スケール値設定(全体表示モード)
        if(all_disp_mode){
            //m_drawInf.SetScaleValueLeft(1);
            //m_drawInf.SetScaleValueRight(szHistList);
        }else if(var_disp_mode){
            //横軸スケール値設定
            this.m_drawInf.setScaleValueLeft(1);
            this.m_drawInf.setScaleValueRight(var_end_ix - var_bgn_ix + 1);
        }

        //エントリ描画サイズ取得
        this.m_common.copyEntryDrawWidth();
        //描画エリアサイズ退避(幅)
        this.m_drawInf.setAreaWidth(area_width);
        //エリア内横幅調整
        this.m_drawInf.setChartAreaWidth();
        //描画開始インデックス取得
        let bgnIndex = this.m_info.getBeginIndex();

        if (this.m_indexCtrl.m_yhVariableScale) {
            // 描画可能件数
            let dispEntryCnt = 0;
            if(all_disp_mode){
                dispEntryCnt = szHistList;
            }else if(var_disp_mode){
                dispEntryCnt = (var_end_ix - var_bgn_ix) + 1;
            }else{
                dispEntryCnt = this.m_drawInf.getCanDrawCount();
            }
            // サイズ取得(毎回取得に変更)
            this.m_indexCtrl.getMaxMinIndexValue(bgnIndex, dispEntryCnt);
            // オリジナルにないが必要か？？？
            //this.m_dispStartEntry = bgnIndex;
            //this.m_dispEntryCount = dispEntryCnt;
        }

        //縦軸スケール値（調整前取得）
        let height = this.m_drawInf.getChartAreaHeightNotAdjust();
        //if (this.m_indexCtrl.m_yhVariableScale) {

        //縦軸スケールレンジ確定処理
        //異常値チェック
        if(!this.m_indexCtrl.m_vtVariableMinus){
            if(this.m_dispMaxValue < 0){
                this.m_dispMaxValue = 1;
            }
            if(this.m_dispMinValue < 0){
                this.m_dispMinValue = 0;
            }
        }

        this.m_common.setScaleRangeValue(
            this.m_indexCtrl.m_dispMaxValue,
            this.m_indexCtrl.m_dispMinValue,
            this.m_indexCtrl.m_vtVariableMinus,
            CD.CHART_VERTICAL,
            0
        );
        //レンジ値調整(一部の指標のみ指定倍)
        let dec = this.m_indexCtrl.m_adjustDecPoint;
        if (0 < dec) {
            this.m_drawInf.setScaleRangeUnit(this.m_drawInf.getScaleRangeUnit() * this.m_common.m_decPoint[dec]);
            this.m_drawInf.setScaleValueTop(this.m_drawInf.getScaleValueTop() * this.m_common.m_decPoint[dec]);
            this.m_drawInf.setScaleValueBtm(this.m_drawInf.getScaleValueBtm() * this.m_common.m_decPoint[dec]);
        }
        
        //this.m_common.setScaleRangeParameter(this.m_indexCtrl.m_dispMaxValue, this.m_indexCtrl.m_dispMinValue, true);
        // }
        //エリア内縦幅調整(余りを切捨て調整)
        height = ((height / 10) >> 0) * 10;
        //エリア高さ調整確定値セット
        this.m_drawInf.setChartAreaHeight(height);
        //縦軸描画開始位置取得
        this.m_drawInf.setChartAreaBgnPosY();

        //エリア外背景描画
        this.m_common.drawOutBack();

        //横軸スケールライン描画
        //this.drawRange();
        this.drawFixedRange();

        //描画ループ終了判定値セット
        let max_entry = szHistList;
        let fwdEntryNum = 0;
        if (!all_disp_mode && var_disp_mode) {
            max_entry = var_end_ix + 1;
            if(szHistList <= max_entry){
                fwdEntryNum = max_entry - szHistList;
                max_entry = szHistList;
            }else{
                fwdEntryNum = 0;
            }
        }

        //合計最大エントリセット(一目の先行エントリを加算)
        let total_max = max_entry + fwdEntryNum;

        this.m_lastXPos = this.drawGraphLine(bgnIndex, max_entry, total_max);

        let curIndex = this.m_info.getCurIndex();
        let dummy_entry_width = this.m_info.getDummyEntryWidth();
        let mouse_pos_x = this.m_info.getMousePosX();
        let mouse_pos_y = this.m_info.getMousePosY();

        // 十字線(縦)
        if (this.m_info.isCrossLine()) {
            this.drawCrossLine(curIndex, mouse_pos_x, mouse_pos_y, dummy_entry_width, total_max);
        }      
        this.m_indexCtrl.setValueToIndexPanel(curIndex);

        // 設定ボタン表示
        const chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        let btnWidth = 26;
        let btnHeight = 15;
        let btnBgnPosY = chartBgnPosY + 2;
        let btnBgnPosX = chartBgnPosX + 1;
        this.m_common.drawSettingButton(btnBgnPosX, btnBgnPosY, btnWidth, btnHeight);

        // タイトル表示
        let [tittle, ttl_w] = this.m_indexCtrl.getTittle();
        let [ttl_x, ttl_y, h] = [btnBgnPosX + btnWidth + 3, btnBgnPosY, 15];
        //let w = 100;
        this.m_cc.drawBlend("rgb(20 ,20 ,20)", 0.5, ttl_x, ttl_y, ttl_w, h);
        this.m_cc.drawStringL(tittle, ttl_x, ttl_y, "white");

        // 入替ボタン表示
        btnWidth = 40;
        btnHeight = 15;
        let endPosX = this.m_drawInf.getAreaWidth();
        btnBgnPosX = endPosX - btnWidth - btnWidth;
        this.m_common.drawSwapButton(btnBgnPosX, btnBgnPosY, btnWidth, btnHeight, areaIndex);
    }
    //==============================================================================
    //	[描画] パラメータ設定
    //==============================================================================
    drawParamSetting(rc) {
        if (this.m_indexCtrl !== null) {
            this.m_common.drawParamSetting(rc, 
                this.m_indexCtrl.m_indexNameAndType,
                this.m_indexCtrl.m_slider.length,
                this.m_indexCtrl.m_slider,
                this.m_indexCtrl.m_paramName,
                this.m_indexCtrl.m_colorLabel,
                this.m_indexCtrl.m_btnModColor
            );
        }
    }
    drawColorSetting(rc) {
        if (this.m_indexCtrl !== null) {
            this.m_indexCtrl.drawColorSetting(rc);
        }
    }
    //==============================================================================
    //	[描画] 横軸スケールライン
    //==============================================================================
    drawFixedRange() {
        const chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        const chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        const isScaleLeft = this.m_info.isScaleLeft();
        const isScaleRight = this.m_info.isScaleRight();
        let string_posx_L = chartBgnPosX - 13;	//左表示
        let string_posx_R = chartEndPosX + 11;	//右表示

        let scaleTop = this.m_drawInf.getScaleValueTop();
        let scaleNum = this.m_drawInf.getScaleRangeNum();
        let scaleUnit = this.m_drawInf.getScaleRangeUnit();

        let max = scaleNum + 1;
        let ypos = chartBgnPosY;
        let scaleValue = scaleTop;
        let unit = scaleUnit;
        let dec = this.m_indexCtrl.m_decScale;

        //==== 出来高固有処理(始) =====
        // レンジ丸め調整
        if (this.m_indexCtrl.getIndexType() === CD.CHART_INDEX_SMAV) {
            var w_scaleUnit = scaleUnit;
            var chk_cnt = 0;
            // 表示単位算出
            while (1000 <= w_scaleUnit) {
                let mod = w_scaleUnit % 10;
                if (mod !== 0) { break; }
                w_scaleUnit = (w_scaleUnit / 10) >> 0;
                chk_cnt++;
                if (w_scaleUnit < 50000) { break; }
            }
            dec = chk_cnt;
            this.m_indexCtrl.setVolDec(dec);
        }
        //==== 出来高固有処理(終) =====
        let bgnPosX = (isScaleLeft)? chartBgnPosX - 8 : chartBgnPosX;
        let endPosX = (isScaleRight)? chartEndPosX + 8 : chartEndPosX;
        for (let i = 0; i < max; i++) {
            // 目盛表示線
            let scaleValStr;
            if (this.m_indexCtrl.getIndexType() === CD.CHART_INDEX_SMAV) {
                // 出来高固有
                if (0 < scaleTop) {
                    if (i + 1 === max && 0 < dec) {
                        scaleValStr = "[x" + this.m_common.m_decPoint[dec] + "]"
                    } else {
                        scaleValStr = this.m_common.roundDownDecStr(scaleValue / this.m_common.m_decPoint[dec], 0);
                    }
                } else {
                    scaleValStr = "";
                }
            } else {
                // その他
                scaleValStr = this.m_common.roundDownDecStr(scaleValue / this.m_common.m_decPoint[dec], 0);
            }

            this.m_cc.drawLine(this.m_cc.m_colScale, bgnPosX, ypos, endPosX, ypos);

            if(isScaleLeft){
                // 目盛表示値段
                this.m_cc.drawStringR(scaleValStr, string_posx_L, ypos - 8);
            }
            if(isScaleRight){
                // 目盛表示値段
                this.m_cc.drawStringL(scaleValStr, string_posx_R, ypos - 8);
            }
            // 次回Y軸位置更新
            scaleValue = scaleTop - unit;
            ypos = this.m_drawInf.cnvValueToPosYForOsc(scaleValue);
            unit += scaleUnit;
        }

        // 左縦軸線
        this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX - 1, chartBgnPosY, chartBgnPosX - 1, chartEndPosY);
        // 右縦軸線
        this.m_cc.drawLine(this.m_cc.m_colScale, chartEndPosX, chartBgnPosY, chartEndPosX, chartEndPosY);

    }
    //==============================================================================
    //	[描画] 横軸スケールライン
    //==============================================================================
    /*
    drawRange() {
    var chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
    var chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
    var chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
    var string_posx_L = chartBgnPosX - 20; //左表示
    var string_posx_R = chartEndPosX + 15; //右表示

    var y = this.m_drawInf.getChartAreaEndPosY();
    if (y <= this.m_drawInf.cnvValueToPosYForOsc(this.m_indexCtrl.m_scaleLine[0])) return;

    var aScaleVal;
    aScaleVal = this.m_common.roundDownDecStr(this.m_drawInf.getScaleValueTop(), this.m_indexCtrl.m_decScale);
    //左目盛表示値段(最上)
    //this.m_cc.drawStringR( aScaleVal, string_posx_L, chartBgnPosY-6 );
    //右目盛表示値段(最上)
    this.m_cc.drawStringL(aScaleVal, string_posx_R, chartBgnPosY - 6);

    aScaleVal = this.m_common.roundDownDecStr(this.m_drawInf.getScaleValueBtm(), this.m_indexCtrl.m_decScale);
    //左目盛表示値段(最下)
    //this.m_cc.drawStringR( aScaleVal, string_posx_L, y-6 );
    //右目盛表示値段(最下)
    this.m_cc.drawStringL(aScaleVal, string_posx_R, y - 6);

    //中心線
    var yCenter = chartBgnPosY + ((this.m_drawInf.getChartAreaHeight() / 2) >> 0);
    var top = this.m_drawInf.getScaleValueTop();
    var btm = this.m_drawInf.getScaleValueBtm();
    if ((btm < 0) && (0 <= top)) {
    aScaleVal = this.m_common.roundDownDecStr((((this.m_drawInf.getScaleValueTop() + Math.abs(btm)) / 2) >> 0) + btm, this.m_indexCtrl.m_decScale);
    } else if ((btm < 0) && (top < 0)) {
    aScaleVal = this.m_common.roundDownDecStr(0 - (((abs(btm) - abs(top)) / 2) >> 0), this.m_indexCtrl.m_decScale);
    } else {
    aScaleVal = this.m_common.roundDownDecStr((((top - btm) / 2) >> 0) + btm, this.m_indexCtrl.m_decScale);
    }

    //左目盛表示値段(中心)
    //this.m_cc.drawStringR( aScaleVal, string_posx_L, yCenter-6 );
    //右目盛表示値段(中心)
    this.m_cc.drawStringL(aScaleVal, string_posx_R, yCenter - 6);
    //左目盛表示線(中心)
    //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX-10, yCenter, chartBgnPosX-1, yCenter);
    //右目盛表示線(中心)
    this.m_cc.drawLine(this.m_cc.m_colScale, chartEndPosX + 1, yCenter, chartEndPosX + 10, yCenter);
    //目盛表示線(中心)
    this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, yCenter, chartEndPosX, yCenter);

    //仕切り線(上)
    if ((this.m_indexCtrl.m_scaleLine[0] !== 0) && (this.m_indexCtrl.m_scaleLine[0] < top)) {
    var yUpper = this.m_drawInf.cnvValueToPosYForOsc(this.m_indexCtrl.m_scaleLine[0]);
    aScaleVal = this.m_common.roundDownDecStr(this.m_indexCtrl.m_scaleLine[0], this.m_indexCtrl.m_decScale);
    //左目盛表示値段(上)
    //this.m_cc.drawStringR( aScaleVal, string_posx_L, yUpper-6 );
    //右目盛表示値段(上)
    this.m_cc.drawStringL(aScaleVal, string_posx_R, yUpper - 6);
    //左目盛表示線(上)
    //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX-10, yUpper, chartBgnPosX-1, yUpper);
    //右目盛表示線(上)
    this.m_cc.drawLine(this.m_cc.m_colScale, chartEndPosX + 1, yUpper, chartEndPosX + 10, yUpper);
    //仕切りゾーン描画
    //drawRect(hdc, m_hbr_dksell, m_hPen_back, chartBgnPosX, chartBgnPosY, chartEndPosX, yUpper);
    }
    //仕切り線(下)
    if ((this.m_indexCtrl.m_scaleLine[2] !== 0) && (btm < this.m_indexCtrl.m_scaleLine[2])) {
    var yLower = this.m_drawInf.cnvValueToPosYForOsc(this.m_indexCtrl.m_scaleLine[2]);
    aScaleVal = this.m_common.roundDownDecStr(this.m_indexCtrl.m_scaleLine[2], this.m_indexCtrl.m_decScale);
    //左目盛表示値段(下)
    //this.m_cc.drawStringR( aScaleVal, string_posx_L, yLower-6 );
    //右目盛表示値段(下)
    this.m_cc.drawStringL(aScaleVal, string_posx_R, yLower - 6);
    //左目盛表示線(下)
    //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX-10, yLower, chartBgnPosX-1, yLower);
    //右目盛表示線(下)
    this.m_cc.drawLine(this.m_cc.m_colScale, chartEndPosX + 1, yLower, chartEndPosX + 10, yLower);
    //仕切りゾーン描画
    //drawRect(hdc, m_hbr_dkbuy, m_hPen_back, chartBgnPosX, yLower, chartEndPosX, y);
    }
    //左縦軸線
    //this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX-1, chartBgnPosY, chartBgnPosX-1, y);
    //右縦軸線
    this.m_cc.drawLine(this.m_cc.m_colScale, chartEndPosX + 1, chartBgnPosY, chartEndPosX + 1, y);
    //最上部線
    this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, chartBgnPosY, chartEndPosX + 10, chartBgnPosY);
    //最下部線
    this.m_cc.drawLine(this.m_cc.m_colScale, chartBgnPosX, y, chartEndPosX + 10, y);
    }
    */
    drawGraphLine(bgnIndex, max_entry, total_max) {
        let dummy_entry_width = this.m_info.getDummyEntryWidth();

        let pHist = this.m_info.getCurrentHist();
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();

        let valueIndex = this.m_indexCtrl.getBeginValueIndex();
        let len = this.m_indexCtrl.getIndexNum();
        let indexType = this.m_indexCtrl.getIndexType();
        let ypos_gr = new Array(len);

        //表示モード判定フラグセット
        //全体表示モード
        let all_disp_mode = false;
        //可変表示モード
        let var_disp_mode = this.m_info.isVariableMode();
        //可変モード描画値
        let var_bgn_ix = this.m_info.getVariableBgnIndex();
        let var_end_ix = this.m_info.getVariableEndIndex();
        if(var_bgn_ix < 0){
            var_disp_mode = false;
        }
        //通常表示モード
        let nml_mode = false;
        if(!all_disp_mode && !var_disp_mode) nml_mode = true;

        //BACKLINE判定用
        let curDate = new Array();
        let curWeek = -1;
        let prev_scale_xpos = 0;
        let prev_back_xpos = 0;
        let least_margin = 30;

        //表示エントリサイズ取得
        var entry_width = this.m_drawInf.getEntryWidth();
        var candle_width = this.m_drawInf.getCandleWidth();

        //バックライン(縦)最終エントリ初期化
        this.m_common.m_bkLineEntryIndex = 0;

        //***************************************************************
        // VOLUME/MACD ヒストグラム描画
        //***************************************************************
        //チャート描画開始位置
        let xpos = this.m_drawInf.getChartAreaBgnPosX() + dummy_entry_width;
        for (var ix = bgnIndex; ix < max_entry; ix++) {
            var pt = pHist.mChartList[ix];

            this.m_common.m_backLineEntry[0] = -1;	//バックライン(縦)エントリ退避初期化
            
            // 分/日/週/月の場合
            //curWeek = pt->mDayOfWeek; //現在判定には未使用
            let backLine = this.m_common.isDrawBackLine(pt, curDate, curWeek, xpos);

            if (backLine) {
                let isDrawJudge = false;
                let isDateChange = false;
                // 日付変更エントリ検出(変更時は必ず背景線描画)
                if (0 < this.m_common.m_bkLineEntryIndex && this.m_common.m_backLineEntry[this.m_common.m_bkLineEntryIndex - 1] + 1 === ix) {
                    if (pHist.getDataType() === CD.CHART_DATA_MIN) {
                        isDrawJudge = true;
                        if (0 < ix && pHist.mChartList[ix - 1].m_Date !== pt.mDate) {
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
                        let wentry_width = 0;
                        let wcandle_width = 0;
                        let retVal = this.m_common.getVariableEntryWidth(ix, total_max, wentry_width, wcandle_width);
                        back_xpos = retVal[0];
                        back_xpos += (retVal[1] / 2) >> 0; // wentry_width / 2
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

            // 表示エントリサイズ取得処理(可変)
            if(var_disp_mode){
                let retVal = this.m_common.getVariableEntryWidth(bgnIndex, total_max, entry_width, candle_width);
                entry_width = retVal[1];
                candle_width = retVal[2];
            }
            // ヒストグラム表示
            let ret = this.m_indexCtrl.drawHistogram(ix, xpos, entry_width, candle_width);
            if (ret === -1) {
                break;
            } else {
                xpos = ret;
            }

            if(!nml_mode){
                // 全体表示 OR 可変表示モード
                xpos = this.m_drawInf.cnvValueToPosX((ix+1) - bgnIndex);
            }
            // エントリ終了判定
            if(nml_mode){
                //通常表示モード
                //次回の足が描画出来なければ抜ける
                if(chartEndPosX < xpos + candle_width){
                    break;
                }
            }

        }
        //***************************************************************
        // グラフ描画
        //***************************************************************
        let mgn = (candle_width / 2) >> 0;
        let prv_xpos = 0;
        //チャート描画開始位置
        let cur_xpos = this.m_drawInf.getChartAreaBgnPosX() + dummy_entry_width + mgn;
        let endIndex = valueIndex + len;
        const graphColor = this.m_indexCtrl.getGraphColor();
        for (let ix = bgnIndex; ix < max_entry; ix++) {
            for (let j = valueIndex; j < endIndex; j++) {
                if (this.m_indexCtrl.m_techData.m_data[j][ix] !== CD.INDEX_NO_VALUE) {
                    if (ypos_gr[j] === 0) {
                        ypos_gr[j] = this.m_drawInf.cnvValueToPosYForOsc(this.m_indexCtrl.m_techData.m_data[j][ix] >> 0);
                    } else {
                        // グラフ描画
                        let dataValue = this.m_indexCtrl.m_techData.m_data[j][ix];
                        let dec = this.m_indexCtrl.m_adjustDecPoint;
                        if (0 < dec) {
                            dataValue *= this.m_common.m_decPoint[dec];
                        }
                        ypos_gr[j] = this.drawGraph(
                            graphColor[j],
                            dataValue >> 0,
                            prv_xpos, ypos_gr[j],
                            cur_xpos);
                    }
                } else {
                    ypos_gr[j] = 0;
                }
            }

            prv_xpos = cur_xpos;
            if(var_disp_mode){
                if(ix+1 !== max_entry){
                    let retVal = this.m_common.getVariableEntryWidth(ix + 1, total_max, entry_width, candle_width);
                    xpos = retVal[0];
                    entry_width = retVal[1];
                    candle_width = retVal[2];
                    let mgn = candle_width >> 1;
                    cur_xpos = xpos + mgn;
                }
            }else{
                cur_xpos += entry_width;
            }

            if(!nml_mode){
                //全体表示 OR 可変表示モード
                xpos = this.m_drawInf.cnvValueToPosX((ix+1)-bgnIndex);
            }

            //エントリ終了判定
		    if(nml_mode){
                // 通常表示モード
                // 次回の足が描画出来なければ抜ける
                if (chartEndPosX < cur_xpos) {
                    break;
                }
            }
        }
        return cur_xpos;
    }
    drawGraph(col, val, prev_xpos, prev_ypos, xpos) {
        //if(val === 0 || val === CD.INDEX_NO_VALUE) 
        if(val === CD.INDEX_NO_VALUE) {
            return -1;
        }
        let ypos = 0;
        if (this.m_indexCtrl.getIndexType() === CD.CHART_INDEX_SMAV) {
            ypos = this.m_drawInf.cnvValueToPosYForVol(val);
        } else {
            ypos = this.m_drawInf.cnvValueToPosYForOsc(val);
        }
        if (0 < prev_ypos) {
            this.m_cc.drawLine(col, prev_xpos, prev_ypos, xpos, ypos);
        }
        return ypos;
    }
    //==============================================================================
    //	[描画] クロスライン
    //==============================================================================
    drawCrossLine (ix, mposx, mposy, dummy_entry_width, max_entry) {
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        const xpos = this.m_info.getCrossPosX();
        const isScaleLeft = this.m_info.isScaleLeft();
        const isScaleRight = this.m_info.isScaleRight();
        const curStrColor = this.m_drawParam.m_clrColor[IDX.CLR_CROSS_STR];

        this.m_cc.drawLine(this.m_cc.m_colCross, xpos, chartBgnPosY, xpos, chartEndPosY);

        if (this.m_drawInf.isInnerChartArea(mposx, mposy)) {
            let chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
            let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
            this.m_cc.drawLine(this.m_cc.m_colCross, chartBgnPosX, mposy, chartEndPosX, mposy);

            // スケール枠表示値段取得
            let scale_price = this.m_drawInf.cnvPosYToValueForSub(mposy);
            //let baseDec = m_decDigits;
            const baseDec = this.m_drawInf.getScaleValueDec();
            const dec = this.m_indexCtrl.m_decScale;
            let valueStr;
            if (this.m_indexCtrl.getIndexType() === CD.CHART_INDEX_SMAV) {
                const volDec = this.m_indexCtrl.getVolDec();
                valueStr =this.m_common.roundDownDecStr(scale_price / this.m_common.m_decPoint[volDec], 0);
            }else{
                //valueStr =this.m_common.indexToStr(scale_price / this.m_common.m_decPoint[dec], baseDec);
                valueStr =this.m_common.indexToStr(scale_price, dec);
            }
            //WithDecStr(scale_price, price, 0, 0);	// 小数点指定確認！！！
            // スケール枠(値段)(左)描画
            if (isScaleLeft) {
                this.m_cc.drawGradFill(1, mposy - 6, chartBgnPosX - 1, mposy + 6);
                this.m_cc.drawStringR(valueStr, chartBgnPosX - 13, mposy - 7, curStrColor);
            }
            // スケール枠(値段)(右)描画
            if (isScaleRight) {
                this.m_cc.drawGradFill(chartEndPosX + 1, mposy - 6, chartEndPosX + 80, mposy + 6);
                this.m_cc.drawStringL(valueStr, chartEndPosX + 12, mposy - 7, curStrColor);
            }
        }
    }
    //==============================================================================
    //	設定ボタン押下イベント
    //==============================================================================
    checkSettingMouseUpPerformed(x, y) {
        return this.m_common.m_btnSetting.uiEvtMouseUpPerformed(x, y);
    }
    uiEvtMouseLeftPerformedForSetting(x, y) {
        return this.m_indexCtrl.uiEvtMouseLeftPerformed(x, y);
    }
    uiEvtMouseMovePerformedForSetting(x, y) {
        return this.m_indexCtrl.uiEvtMouseMovePerformed(x, y);
    }
    uiEvtMouseUpPerformedForSetting(x, y) {
        return this.m_indexCtrl.uiEvtMouseUpPerformed(x, y);
    }    
    //==============================================================================
    //	UI EVENT [MOUSE LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE ON PUSHED]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE BUTTON UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        return false;
    }
}
export class ChartSubIndexCtrl {
    constructor(type, common, pramNum) {
        this.m_type = type; 
        this.m_common = common;
        this.m_cc = common.m_cc;
        this.m_drawInf = common.m_drawInf;
        this.m_info = null;
        this.m_techParam = null;
        this.m_techParamVal = null;
        this.m_drawParam = null;
        this.m_indexColor = null;
        this.m_yhVariableScale = false;
        this.m_vtVariableMinus = false;
        this.m_decScale = 0;
        this.m_volDec = 0;
        this.m_adjustDecPoint = 0;
        this.m_dispMaxValue = 0;
        this.m_dispMinValue = 0;
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
    getBeginValueIndex() { return 0; }
    initData(inf, techParam, drawParam) {
        this.m_info = inf;
        this.m_techParam = techParam;
        this.m_drawParam = drawParam;
        //this.m_decScale = this.m_info.getCurrentHist().mDecimalScale;
        this.resetIndexData();
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_indexNameAndType = this.m_indexName + ' ' + this.m_common.getDataTypeStr(dataType);
        return;
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
    setColorPickerCurrnt() {
        if (this.m_colorLabel[this.m_selectColorPickerIndex] !== null) {
            let [r, g, b] = this.m_colorLabel[this.m_selectColorPickerIndex].getRGBArray();
            this.m_common.m_colorPicker.setCurrentColor(r, g, b);
        }
        return true;
    }
    setVolDec(val) {
        this.m_volDec = val;
    }
    getVolDec() {
        return this.m_volDec;
    }
    drawHistogram(pt, xpos, entry_width, candle_width) {
        xpos += entry_width;
        return xpos;
    }
    getIndexNum() { return this.m_indexColor.length; }
    getGraphColor() { return this.m_common.getGraphColor(this.m_indexColor, this.m_indexColor.length); }
    getMaxMinIndexValue(sta, cnt) { return; }
    //====================================================================
    //	カラーピッカー設定画面
    //====================================================================
    drawColorSetting(rc) {
        this.m_common.drawColorSetting(rc, this.m_paramName[this.m_selectColorPickerIndex]);
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
//==============================================================================
//  VOLUME
//==============================================================================
class ChartVOLCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_SMAV, common, 3);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = false;
        this.m_scaleLine = [0, 0, 0];
        this.m_techData = new ChartTechSMAV();  //単純移動平均
        this.m_indexName = "出来高移動平均";
        this.m_paramName[0] = '期間-１';
        this.m_paramName[1] = '期間-２';
        this.m_paramName[2] = '出来高ヒストグラム';
        this.m_histColor = '0,0,0';
    }
    getTittle() {
        let tittle = "出来高 (MA1=" + this.m_techParamVal[0]
        + "  MA2=" + this.m_techParamVal[1]
        + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam) {
        this.m_indexColor = drawParam.m_color.SMAV.c;
        super.initData(inf, techParam, drawParam);
        this.resetIndexColor();
        return;
    }
    getIndexNum() { return this.m_indexColor.length - 1; }
    getGraphColor() { return this.m_common.getGraphColor(this.m_indexColor, this.m_indexColor.length - 1); }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_SMAV(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2] = null;
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.SMAV.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2].init(paramValue[2]);
        this.m_histColor = this.m_colorLabel[2].getColor();
    }
    updateIndexParam() {
        this.m_drawParam.setColorSMAV(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB());
        this.m_histColor = this.m_colorLabel[2].getColor();
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_SMAV(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_SMAV(dataType);   
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
        this.m_slider[2] = null;
    }
    getMaxMinIndexValue(sta, cnt) {
        let pHist = this.m_info.getCurrentHist();
        let max = 0;
        let dspcnt = sta + cnt;
        let maxEntry = pHist.getEntrySize();
        if (maxEntry === 0) {
            this.m_dispMaxValue = 0;
            this.m_dispMinValue = 0;
            return;
        }
        if (maxEntry < dspcnt) {
            dspcnt = maxEntry;
        }
        for (let i = sta; i < dspcnt; i++) {
            let pt = pHist.mChartList[i];
            let val = pt.mVolume;
            if (max < val) {
                max = val;
            }
            for (let j = 0; j <this.m_techData.m_data.length; j++) {
                if (max < this.m_techData.m_data[j][i]) {
                    max = this.m_techData.m_data[j][i];
                }
            }
        }
        this.m_dispMaxValue = max;
        this.m_dispMinValue = 0;
    }
    //==============================================================================
    //	[描画] ヒストグラム
    //==============================================================================
    drawHistogram(ix, xpos, entry_width, candle_width) {
        let pt = this.m_info.getCurrentHist().mChartList[ix];
        let yStart = this.m_drawInf.cnvValueToPosYForVol(pt.mVolume) >> 0;
        let yEnd = this.m_drawInf.getChartAreaEndPosY();
        if ((yStart < 0) || (yEnd < 0)) {
            yStart = 0;
            yEnd = 0;
        }
        if (pt.mDataStatus !== CD.INIT && 0 < pt.mVolume && yStart <= yEnd) {
            if (yEnd <= yStart) {
                yEnd++;
            }
            this.m_cc.drawFill(this.m_histColor, xpos, yStart, xpos + candle_width, yEnd);
        }

        xpos += entry_width;
        return xpos;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        let hist = this.m_info.getCurrentHist();
        let szHistList = this.m_info.getCurHistSize();
        let pt = null;
        if (0 <= ix && ix < szHistList) {
            pt = hist.mChartList[ix];
        }
        //var dec = this.m_drawInf.getScaleValueDec();
        indexPanel.m_subIndexName.push("出来高");
        indexPanel.m_subIndexColor.push("white");
        if (pt && 0 <= pt.mVolume) {
            indexPanel.m_subIndexValue.push(this.m_common.roundDownDecStr(pt.mVolume, 0));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }
        if (hist.mDataType !== CD.CHART_DATA_TICK) {
            const idxcolor = this.m_drawParam.m_color.SMAV.c;
            for (let j = 0; j < idxcolor.length - 1; j++) {
                indexPanel.m_subIndexName.push("出来高平均 " + (j + 1).toString());
                indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
                if (pt && this.m_techData.m_data[j][ix] && this.m_techData.m_data[j][ix] != CD.INDEX_NO_VALUE) {
                    indexPanel.m_subIndexValue.push(this.m_common.indexToStr(this.m_techData.m_data[j][ix], 0));
                } else {
                    indexPanel.m_subIndexValue.push("-");
                }
            }
        }
    }
}
//==============================================================================
//  MACD
//==============================================================================
class ChartMACDCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_MACD, common, 5);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = true;
        this.m_scaleLine = [0, 50, 0];
        this.m_techData = new ChartTechMACD();
        this.m_indexName = "MACD";
        this.m_paramName[0] = 'EMA 期間 １';
        this.m_paramName[1] = 'EMA 期間 ２';
        this.m_paramName[2] = 'MACD';
        this.m_paramName[3] = 'MACDシグナル';
        this.m_paramName[4] = 'OSCI(ヒストグラム)';
        this.m_histColor = '0,0,0';
    }
    getTittle() {
        let tittle = this.m_indexName + " (EMA1=" + this.m_techParamVal[0]
                    + "  EMA2=" + this.m_techParamVal[1]
                    + "  MACD=" + this.m_techParamVal[2]
                    + ")";
        return [tittle, 250];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.MACD.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    getIndexNum() { return 2; }
    getBeginValueIndex() { return TS.TI_MAC_MACD; }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_MACD(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
        this.m_slider[3] = null;
        this.m_slider[4] = null;
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.MACD.c;
        this.m_colorLabel[0] = null;
        this.m_colorLabel[1] = null;
        this.m_colorLabel[2].init(paramValue[2]);
        this.m_colorLabel[3].init(paramValue[3]);
        this.m_colorLabel[4].init(paramValue[4]);
        this.m_histColor = this.m_colorLabel[4].getColor();
    }
    updateIndexParam() {
        this.m_drawParam.setColorMACD(this.m_colorLabel[2].getRGB(), this.m_colorLabel[3].getRGB(), this.m_colorLabel[4].getRGB());
        this.m_histColor = this.m_colorLabel[4].getColor();
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_MACD(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_decScale = hist.mDecimalScale;
        this.m_techParamVal = this.m_techParam.getParam_MACD(dataType);   
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1], this.m_techParamVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(1, 99, 1, this.m_techParamVal[0]);  // EMA1
        this.m_slider[1].init(1, 99, 1, this.m_techParamVal[1]);  // EMA2
        this.m_slider[2].init(1, 99, 1, this.m_techParamVal[2]);  // MACD
        this.m_slider[3] = null;
        this.m_slider[4] = null;
    }
    getMaxMinIndexValue (sta, cnt) {
        //｢0｣中心固定方式
        /*
        var max = 0;
        var dspcnt = sta + cnt;
        var listSize = this.m_info.getCurHistSize();
        if (listSize < dspcnt) {
            dspcnt = listSize;
        }
        var data = this.m_info.getCurrentHist();
        for (var i = sta; i < dspcnt; i++) {
            var pt = data.mChartList[i];
            var val = 0.0;
            if (pt.mIndexValue[IDX.IV_MACD_OSCI] !== CD.INDEX_NO_VALUE) {
                val = Math.abs(pt.mIndexValue[IDX.IV_MACD_OSCI]) + 1;
                if (max < val) { max = val; }
            }
            if (pt.mIndexValue[IDX.IV_MACD_MACD] !== CD.INDEX_NO_VALUE) {
                val = Math.abs(pt.mIndexValue[IDX.IV_MACD_MACD]) + 1;
                if (max < val) { max = val; }
            }
            if (pt.mIndexValue[IDX.IV_MACD_MACDS] !== CD.INDEX_NO_VALUE) {
                val = Math.abs(pt.mIndexValue[IDX.IV_MACD_MACDS]) + 1;
                if (max < val) { max = val; }
            }
        }
        if (0 < max) {
            this.m_dispMaxValue = max >> 0;
            this.m_dispMinValue = -max >> 0;
        } else {
            this.m_dispMaxValue = 100;
            this.m_dispMinValue = 100;
        }
        */
        //｢0｣可変方式 ※上とどちらかをコメントアウト
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, TS.TI_MAC_MACD, 3, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //==============================================================================
    //	[描画] ヒストグラム
    //==============================================================================
    drawHistogram(ix, xpos, entry_width, candle_width) {
        let yStart = 0;
        let yEnd = 0;
        let data = this.m_techData.m_data;
        if (0 < data[TS.TI_MAC_EMA_1][ix] && 0 < data[TS.TI_MAC_EMA_2][ix]) {
            if (data[TS.TI_MAC_OSCI][ix] !== CD.INDEX_NO_VALUE) {
                //yStart = this.m_drawInf.cnvValueToPosYForMacd(pt.mIndexValue[IDX.IV_MACD_OSCI] >> 0);
                //yEnd = this.m_drawInf.getChartAreaBgnPosY() + ((this.m_drawInf.getChartAreaHeight() / 2) >> 0);
                yStart = this.m_drawInf.cnvValueToPosYForOsc(data[TS.TI_MAC_OSCI][ix] >> 0);
			    yEnd = this.m_drawInf.cnvValueToPosYForOsc(0);
            }
        }

        if (yStart === yEnd) {
            if (data[TS.TI_MAC_OSCI][ix] < 0.0) {
                yStart--;
            } else if (0.0 < data[TS.TI_MAC_OSCI][ix]) {
                yStart++;
            }
        }

        if (data[TS.TI_MAC_OSCI][ix] !== 0.0 && data[TS.TI_MAC_OSCI][ix] !== CD.INDEX_NO_VALUE) {
            this.m_cc.drawFill(this.m_histColor, xpos, yStart, xpos + candle_width, yEnd);
        }
        xpos += entry_width;
        return xpos;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const dec = this.m_drawInf.getScaleValueDec();
        const txt = ["EMA1", "EMA2", "MACD", "SIGNAL", "OSCI"];
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push(txt[j]);
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, dec));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  STOCHASTICS
//==============================================================================
class ChartSTCCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_STC, common, 2)
        this.m_scaleLine = [70, 50, 30];
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = 0;
        this.m_techData = new ChartTechSTC();
        this.m_indexName = "ｽﾄｷｬｽﾃｨｸｽ";
        this.m_paramName[0] = '%K 期間';
        this.m_paramName[1] = '%S 期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (%K=" + this.m_techParamVal[0]
        + "  %D=" + this.m_techParamVal[1]
        + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.STC.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_STC(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.STC.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorSTC(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), 3];
        this.m_techParam.setParam_STC(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_STC(dataType);   
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1], this.m_techParamVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        let dec = 0;
        const txt = ["%K", "%D"];
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push(txt[j]);
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, dec));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  SLOW STOCHASTICS
//==============================================================================
class ChartSSTCCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_SSTC, common, 2);
        this.m_scaleLine = [70, 50, 30];
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = 0;
        this.m_techData = new ChartTechSSTC();
        this.m_indexName = "ｽﾛｰｽﾄｷｬｽﾃｨｸｽ";
        this.m_paramName[0] = '%S 期間';
        this.m_paramName[1] = '%SD 期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (%D=" + this.m_techParamVal[1]
        + "  %SD=" + this.m_techParamVal[2]
        + ")";
        return [tittle, INIT_TITTLE_WIDTH + 30];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.SSTC.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_SSTC(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[1]);
        this.m_slider[1].setCurValue(defaultParamValue[2]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.SSTC.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorSSTC(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [5, this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_SSTC(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_SSTC(dataType);   
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1], this.m_techParamVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[2]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        let dec = 0;
        const txt = ["%D", "%SD"];
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push(txt[j]);
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, dec));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  MOM
//==============================================================================
class ChartMOMCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_MOM, common, 4);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = true;
        this.m_decScale = 2;
        this.m_techData = new ChartTechMOM();
        this.m_indexName = "モメンタム設定";
        this.m_paramName[0] = 'モメンタム 期間1';
        this.m_paramName[1] = 'モメンタム 期間2';
        this.m_paramName[2] = 'モメンタム移動平均 期間1';
        this.m_paramName[3] = 'モメンタム移動平均 期間2';
    }
    getTittle() {
        const tittle = "ﾓﾒﾝﾀﾑ (" + 
        "MOM1=" + this.m_techParamVal[0] +
        " MOM2=" + this.m_techParamVal[1] +
        " MA1=" + this.m_techParamVal[2] +
        " MA2=" + this.m_techParamVal[3] + ")";
        return [tittle, INIT_TITTLE_WIDTH + 130];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.MOM.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_MOM(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
        this.m_slider[3].setCurValue(defaultParamValue[3]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.MOM.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2].init(paramValue[2]);
        this.m_colorLabel[3].init(paramValue[3]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorMOM(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB(),
                                    this.m_colorLabel[2].getRGB(), this.m_colorLabel[3].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue(), this.m_slider[3].getCurValue()];
        this.m_techParam.setParam_MOM(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_MOM(dataType);   
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1], this.m_techParamVal[2], this.m_techParamVal[3]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[2]);
        this.m_slider[3].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[3]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_MOM_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["ﾓﾒﾝﾀﾑ1", "ﾓﾒﾝﾀﾑ2", "ﾓﾒﾝﾀﾑMA1", "ﾓﾒﾝﾀﾑMA2"];
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push(txt[j]);
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, this.m_decScale));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  RSI(A) J.W.ワイルダー方式
//==============================================================================
class ChartRSIACtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_RSIA, common, 2);
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = 0;
        this.m_scaleLine = [70, 50, 30];
        this.m_techData = new ChartTechRSIA();
        this.m_indexName = "RSI-W(ワイルダー)";
        this.m_paramName[0] = '期間-1';
        this.m_paramName[1] = '期間-2';
    }
    getTittle() {
        const tittle = "RSI(W) (T1=" + this.m_techParamVal[0]
                    + "  T2=" + this.m_techParamVal[1]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.RSIA.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_RSIA(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.RSIA.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorRSIA(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_RSIA(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_RSIA(dataType);   
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("RSI(w) " + (j + 1).toString());
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  RSI(C) カトラー方式
//==============================================================================
class ChartRSIBCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_RSIB, common, 2);
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = 0;
        this.m_scaleLine = [70, 50, 30];
        this.m_techData = new ChartTechRSIB();
        this.m_indexName = "RSI-C(カトラー)";
        this.m_paramName[0] = '期間-1';
        this.m_paramName[1] = '期間-2';
    }
    getTittle() {
        const tittle = "RSI(C) (T1=" + this.m_techParamVal[0]
                    + "  T2=" + this.m_techParamVal[1]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.RSIB.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_RSIB(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.RSIA.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorRSIB(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_RSIB(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_RSIB(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("RSI(c) " + (j + 1).toString());
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  RCI
//==============================================================================
class ChartRCICtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_RCI, common, 2)
        this.m_yhVariableScale = false;
        this.m_vtVariableMinus = true;
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = -100;
        //this.m_scaleLine = [70, 50, 30];
        this.m_techData = new ChartTechRCI();
        this.m_indexName = "RCI";
        this.m_paramName[0] = '期間-1';
        this.m_paramName[1] = '期間-2';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T1=" + this.m_techParamVal[0]
                    + "  T2=" + this.m_techParamVal[1]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.RCI.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_RCI(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.RSIA.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorRCI(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_RCI(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_RCI(dataType);   
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("RCI " + (j + 1).toString());
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  WR
//==============================================================================
class ChartWRCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_WR, common, 1)
        this.m_yhVariableScale = false;
        this.m_vtVariableMinus = true;
        this.m_dispMaxValue = 0;
        this.m_dispMinValue = -100;
        //this.m_scaleLine = [-30, 0, -70];
        this.m_techData = new ChartTechWR();
        this.m_indexName = "%Williams %R";
        this.m_paramName[0] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.WR.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_WR(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.RSIA.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorWR(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_WR(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_WR(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("%R " + (j + 1).toString());
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  PL
//==============================================================================
class ChartPLCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_PL, common, 1);
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = 0;
        //this.m_scaleLine = [-30, 0, -70];
        this.m_techData = new ChartTechPL();
        this.m_indexName = "サイコロジカル";
        this.m_paramName[0] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.PL.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_PL(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.PL.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorPL(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_PL(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_PL(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("ｻｲｺﾛｼﾞｶﾙ " + (j + 1).toString());
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  移動平均乖離率
//==============================================================================
class ChartDMACtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_DMA, common, 3);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = true;
        this.m_decScale = 2;
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = 0;
        this.m_scaleLine = [70, 50, 30];
        this.m_techData = new ChartTechDMA();
        this.m_indexName = "移動平均乖離率";
        this.m_paramName[0] = '期間-1';
        this.m_paramName[1] = '期間-2';
        this.m_paramName[2] = '期間-3';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T1=" + this.m_techParamVal[0]
                    + "  T2=" + this.m_techParamVal[1]
                    + "  T3=" + this.m_techParamVal[2]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.DMA.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_PL(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.DMA.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2].init(paramValue[2]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorDMA(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_DMA(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_DMA(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1], this.m_techParamVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 2, this.m_techParamVal[1]);
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 3, this.m_techParamVal[2]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_DMA_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("MA乖離率 " + (j + 1).toString());
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 2));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  UO
//==============================================================================
class ChartUOCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_UO, common, 4);
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = 0;
        this.m_techData = new ChartTechUO();
        this.m_indexName = "ｱﾙﾃｨﾒｯﾄｵｼﾚｰﾀ";
        this.m_paramName[0] = this.m_indexName;
        this.m_paramName[1] = '期間-1';
        this.m_paramName[2] = '期間-2';
        this.m_paramName[3] = '期間-3';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T1=" +this.m_techParamVal[0]
                    + "  T2=" + this.m_techParamVal[1]
                    + "  T3=" + this.m_techParamVal[2]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH + 50];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.UO.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_UO(dataType);
        this.m_slider[0] = null;
        this.m_slider[1].setCurValue(defaultParamValue[0]);
        this.m_slider[2].setCurValue(defaultParamValue[1]);
        this.m_slider[3].setCurValue(defaultParamValue[2]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.UO.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1] = null;
        this.m_colorLabel[2] = null;
        this.m_colorLabel[3] = null;
    }
    updateIndexParam() {
        this.m_drawParam.UO(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue(), this.m_slider[3].getCurValue()];
        this.m_techParam.setParam_UO(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_UO(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1], this.m_techParamVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0] = null;
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
        this.m_slider[3].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[2]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        indexPanel.m_subIndexName.push("ｱﾙﾃｨﾒｯﾄ");
        indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[0]));
        const value = this.m_techData.m_data[TS.TI_UO][ix];
        if (value !== CD.INDEX_NO_VALUE) {
            indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }
    }
}
//==============================================================================
//  ATR
//==============================================================================
class ChartATRCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_ATR, common, 1);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = false;
        this.m_decScale = 2;
        this.m_techData = new ChartTechATR();
        this.m_indexName = "ATR";
        this.m_paramName[0] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH - 80];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.ATR.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_ATR(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.ATR.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorATR(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_ATR(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_ATR(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_ATR_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("ATR");
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 2));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  ROC
//==============================================================================
class ChartROCCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_ROC, common, 2);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = true;
        this.m_techData = new ChartTechROC();
        this.m_indexName = "ROC";
        this.m_paramName[0] = '期間-1';
        this.m_paramName[1] = '期間-2';
    }
    getTittle() {
        const tittle = "ROC (T1=" + this.m_techParamVal[0]
                    + "  T2=" + this.m_techParamVal[1]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.ROC.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.ROC.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_ROC(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorROC(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_ROC(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_ROC(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_ROC_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("ROC " + (j + 1).toString());
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  SWR
//==============================================================================
class ChartSWRCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_SWR, common, 3)
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = false;
        this.m_techData = new ChartTechSWR();
        this.m_indexName = "強弱レシオ";
        this.m_paramName[0] = 'レシオ-Ａ';
        this.m_paramName[1] = 'レシオ-Ｂ';
        this.m_paramName[2] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.SWR.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let defaultParamValue = this.m_techParam.getDefault_SWR(dataType);
        this.m_slider[0] = null;
        this.m_slider[1] = null;
        this.m_slider[2].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.SWR.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorSWR(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_SWR(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_SWR(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0] = null;
        this.m_slider[1] = null;
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_SWR_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["強弱ﾚｼｵA", "強弱ﾚｼｵB"];
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push(txt[j]);
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  ARN
//==============================================================================
class ChartARNCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_ARN, common, 3)
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = 0;
        this.m_techData = new ChartTechARN();
        this.m_indexName = "ｱﾙｰﾝｲﾝｼﾞｹｰﾀ";
        this.m_paramName[0] = 'UP';
        this.m_paramName[1] = 'DOWN';
        this.m_paramName[2] = '期間';
    }
    getTittle() {
        let tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.ARN.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_ARN(dataType);
        this.m_slider[0] = null;
        this.m_slider[1] = null;
        this.m_slider[2].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.ARN.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
        this.m_colorLabel[2] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorARN(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_ARN(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_ARN(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0] = null;
        this.m_slider[1] = null;
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["ARUP", "ARDN"];
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push(txt[j]);
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  AROON OSC
//==============================================================================
class ChartAROCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_ARO, common, 1);
        this.m_yhVariableScale = false;
        this.m_vtVariableMinus = true;
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = -100;
        this.m_techData = new ChartTechARN();
        this.m_indexName = "ｱﾙｰﾝｵｼﾚｰﾀ";
        this.m_paramName[0] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        const colorVal = drawParam.m_color.ARO.c;
        this.m_indexColor = new Array(3);
        this.m_indexColor[2] = colorVal[0];    // AROのみの調整(ARNと兼用のため)
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    getIndexNum() { return 1; }
    getBeginValueIndex() { return TS.TI_ARN_OSC; }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_ARO(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.ARO.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorARO(this.m_colorLabel[0].getRGB());
        this.m_indexColor[2] = this.m_colorLabel[0].getRGB();
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        let updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_ARO(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_ARO(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        indexPanel.m_subIndexName.push("ARO");
        indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[0]));
        const value = this.m_techData.m_data[TS.TI_ARN_OSC][ix];
        if (value !== CD.INDEX_NO_VALUE) {
            indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }
    }
}
//==============================================================================
//  CCI
//==============================================================================
class ChartCCICtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_CCI, common, 1);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = true;
        //this.m_scaleLine = [-30, 0, -70];
        this.m_techData = new ChartTechCCI();
        this.m_indexName = "CCI";
        this.m_paramName[0] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH - 50];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.CCI.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_CCI(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.CCI.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorCCI(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_CCI(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_CCI(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_CCI_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("CCI ");
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  SNR
//==============================================================================
class ChartSNRCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_SNR, common, 2);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = true;
        this.m_decScale = 2;
        this.m_techData = new ChartTechSNR();
        this.m_indexName = "ソナー";
        this.m_paramName[0] = 'EMA 期間';
        this.m_paramName[1] = '期間';
    }
    getTittle() {
        let tittle = this.m_indexName + " (EMA=" + this.m_techParamVal[0]
                    + " SNR=" + this.m_techParamVal[1]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.SNR.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_SNR(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.SNR.c;
        this.m_colorLabel[0] = null;
        this.m_colorLabel[1].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorSNR(this.m_colorLabel[1].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_SNR(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_SNR(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
    }
    getMaxMinIndexValue (sta, cnt) {
        const valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, 1, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        indexPanel.m_subIndexName.push("SNR");
        indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[0]));
        const value = this.m_techData.m_data[TS.TI_SNR][ix];
        if (value !== CD.INDEX_NO_VALUE) {
            indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 2));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }
    }
}
//==============================================================================
//  DPO
//==============================================================================
class ChartDPOCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_DPO, common, 1);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = true;
        this.m_decScale = 3;
        this.m_techData = new ChartTechDPO();
        this.m_indexName = "DPO";
        this.m_paramName[0] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.DPO.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_DPO(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.DPO.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorDPO(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_DPO(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_DPO(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, 1, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        indexPanel.m_subIndexName.push("DPO");
        indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[0]));
        const value = this.m_techData.m_data[TS.TI_DPO][ix];
        if (value !== CD.INDEX_NO_VALUE) {
            indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, this.m_decScale));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }
    }
}
//==============================================================================
//  SD
//==============================================================================
class ChartSDCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_SD, common, 1);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = false;
        this.m_decScale = 2;
        this.m_techData = new ChartTechSD();
        this.m_indexName = "標準偏差";
        this.m_paramName[0] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.SD.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_SD(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.SD.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorSD(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_SD(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_SD(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_SD_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        indexPanel.m_subIndexName.push("SD");
        indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[0]));
        const value = this.m_techData.m_data[TS.TI_SD][ix];
        if (value !== CD.INDEX_NO_VALUE) {
            indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, this.m_decScale));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }
    }
}
//==============================================================================
//  SDV
//==============================================================================
class ChartSDVCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_SDV, common, 1);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = false;
        this.m_decScale = 2;
        this.m_adjustDecPoint = 2;
        this.m_techData = new ChartTechSDV();
        this.m_indexName = "標準偏差ﾎﾞﾗﾃｨﾘﾃｨ";
        this.m_paramName[0] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.SDV.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_SDV(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.SDV.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorSDV(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_SDV(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_SDV(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_SDV_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        indexPanel.m_subIndexName.push("SDV");
        indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[0]));
        const value = this.m_techData.m_data[TS.TI_SDV][ix] * this.m_common.m_decPoint[this.m_adjustDecPoint];
        if (value !== CD.INDEX_NO_VALUE) {
            indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, this.m_decScale));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }
    }
}
//==============================================================================
//  HV
//==============================================================================
class ChartHVCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_HV, common, 1);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = false;
        this.m_techData = new ChartTechHV();
        this.m_indexName = "ﾋｽﾄﾘｶﾙﾎﾞﾗﾃｨﾘﾃｨ";
        this.m_paramName[0] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.HV.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_HV(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.HV.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorHV(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_HV(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_HV(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0], dataType);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_HV_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        indexPanel.m_subIndexName.push("HV");
        indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[0]));
        const value = this.m_techData.m_data[TS.TI_HV][ix];
        if (value !== CD.INDEX_NO_VALUE) {
            indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }
    }
}
//==============================================================================
//  VRA
//==============================================================================
class ChartVRACtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_VRA, common, 2);
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = 0;
        this.m_scaleLine = [70, 50, 30];
        this.m_techData = new ChartTechVRA();
        this.m_indexName = "ﾎﾞﾘｭｰﾑﾚｼｵ(A)";
        this.m_paramName[0] = '期間 1';
        this.m_paramName[1] = '期間 2';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T1=" + this.m_techParamVal[0]
                    + "  T2=" + this.m_techParamVal[1]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.VRA.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_VRA(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.VRA.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
    }
    updateIndexParam() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_VRA(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_VRA(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("VR[A] " + (j + 1).toString());
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  VRB
//==============================================================================
class ChartVRBCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_VRB, common, 2);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = false;
        this.m_scaleLine = [70, 50, 30];
        this.m_techData = new ChartTechVRB();
        this.m_indexName = "ﾎﾞﾘｭｰﾑﾚｼｵ(B)";
        this.m_paramName[0] = '期間 1';
        this.m_paramName[1] = '期間 2';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T1=" + this.m_techParamVal[0]
                    + "  T2=" + this.m_techParamVal[1]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.VRB.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_VRB(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.VRA.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
    }
    updateIndexParam() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_VRB(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_VRB(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_VRB_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("VR[B] " + (j + 1).toString());
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  DMI
//==============================================================================
class ChartDMICtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_DMI, common, 5);
        this.m_dispMaxValue = 100;
        this.m_dispMinValue = 0;
        this.m_techData = new ChartTechDMI();
        this.m_indexName = "DMI";
        this.m_paramName[0] = '期間';
        this.m_paramName[1] = 'ADX';
        this.m_paramName[2] = 'ADXR';
        this.m_paramName[3] = '+DI';
        this.m_paramName[4] = '-DI';
    }
    getTittle() {
        const tittle = this.m_indexName + " (DMI=" + this.m_techParamVal[0]
                    + " ADX" + this.m_techParamVal[1]
                    + " ADXR" + this.m_techParamVal[2]
                    + ")";
        return [tittle, 220];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.DMI.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_DMI(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2].setCurValue(defaultParamValue[2]);
        this.m_slider[3] = null;
        this.m_slider[4] = null;
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.DMI.c;
        this.m_colorLabel[0] = null;
        this.m_colorLabel[1].init(paramValue[0]);
        this.m_colorLabel[2].init(paramValue[1]);
        this.m_colorLabel[3].init(paramValue[2]);
        this.m_colorLabel[4].init(paramValue[3]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorDMI(this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB(), this.m_colorLabel[3].getRGB(), this.m_colorLabel[4].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue()];
        this.m_techParam.setParam_DMI(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_DMI(dataType);
        this.m_techData.setParameter(this.m_techParamVal[0], this.m_techParamVal[1], this.m_techParamVal[2]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[0]);
        this.m_slider[1].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[1]);
        this.m_slider[2].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, this.m_techParamVal[2]);
        this.m_slider[3] = null;
        this.m_slider[4] = null;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["+DI", "-DI", "ADX", "ADXR"];
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push(txt[j]);
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  OBV
//==============================================================================
class ChartOBVCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_OBV, common, 1);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = true;
        this.m_techData = new ChartTechOBV();
        this.m_indexName = "オンバランスボリューム";
        this.m_paramName[0] = 'OBV';
    }
    getTittle() {
        const tittle = this.m_indexName;
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.OBV.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        // パラメータなし
        this.m_slider[0] = null;
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.OBV.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorOBV(this.m_colorLabel[0].getRGB());
        // パラメータなし
        this.resetIndexData();
    }
    resetIndexData() {
        // パラメータなし
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0] = null;
    }
    getMaxMinIndexValue (sta, cnt) {
        let valMaxMin = { max: 0, min: 0 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_OBV_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        indexPanel.m_subIndexName.push("OBV");
        indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[0]));
        const value = this.m_techData.m_data[TS.TI_OBV][ix];
        if (value !== CD.INDEX_NO_VALUE) {
            indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }
    }
}
//==============================================================================
//  RTA
//==============================================================================
class ChartRTACtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_RTA, common, 1)
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = false;
        this.m_techData = new ChartTechRTA();
        this.m_indexName = "レシオケータ";
        this.m_paramName[0] = '期間';
    }
    getTittle() {
        const tittle = this.m_indexName + " (T1=" + this.m_techParamVal[0]
                    + ")";
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.RTA.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_RTA(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.RSIA.c;
        this.m_colorLabel[0].init(paramValue[0]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorRTA(this.m_colorLabel[0].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_RTA(dataType, updateParamValue);
        this.resetIndexData();
    }
    resetIndexData() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_RTA(dataType);   
        this.m_techData.setParameter(this.m_techParamVal[0]);
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0] = null;
    }
    getMaxMinIndexValue (sta, cnt) {
        // 可変にするためminの初期値を設定
        let valMaxMin = { max: 0, min: 100 };
        this.m_common.getMaxMinIndexValue2(this.m_techData.m_data, 0, TS.TI_RTA_MAX, sta, cnt, valMaxMin);
        this.m_dispMaxValue = valMaxMin.max;
        this.m_dispMinValue = valMaxMin.min;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const len = this.m_indexColor.length;
        for (let j = 0; j < len; j++) {
            indexPanel.m_subIndexName.push("RTA");
            indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[j]));
            const value = this.m_techData.m_data[j][ix];
            if (value !== CD.INDEX_NO_VALUE) {
                indexPanel.m_subIndexValue.push(this.m_common.indexToStr(value, 0));
            } else {
                indexPanel.m_subIndexValue.push("-");
            }
        }
    }
}
//==============================================================================
//  信用残
//==============================================================================
class ChartMGNCtrl extends ChartSubIndexCtrl {
	constructor(common) {
        super(CD.CHART_INDEX_MGN, common, 2);
        this.m_yhVariableScale = true;
        this.m_vtVariableMinus = false;
        this.m_techData = new ChartTechMGN();
        this.m_indexName = "信用残";
    }
    getTittle() {
        const tittle = this.m_indexName;
        return [tittle, INIT_TITTLE_WIDTH];
    }
    initData(inf, techParam, drawParam, panel) {
        this.m_indexColor = drawParam.m_color.MGN.c;
        super.initData(inf, techParam, drawParam, panel);
        this.resetIndexColor();
        return;
    }
    resetSlider() {
        // パラメータなし
        this.m_slider[0] = null;
        this.m_slider[1] = null;
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.MGN.c;
        this.m_colorLabel[0].init(paramValue[0]);
        this.m_colorLabel[1].init(paramValue[1]);
    }
    updateIndexParam() {
        this.m_drawParam.setColorMGN(this.m_colorLabel[0].getRGB(), this.m_colorLabel[1].getRGB());
        // パラメータなし
        this.resetIndexData();
    }
    resetIndexData() {
        // パラメータなし
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        this.m_techData.setIndexValueToObj(hist.mChartList);
        this.m_slider[0] = null;
        this.m_slider[1] = null;
    }
    getMaxMinIndexValue(sta, cnt) {
        const pHist = this.m_info.getCurrentHist();
        let max = 0;
        let dspcnt = sta + cnt;
        let maxEntry = pHist.getEntrySize();
        if (maxEntry === 0) {
            this.m_dispMaxValue = 0;
            this.m_dispMinValue = 0;
            return;
        }
        if (maxEntry < dspcnt) {
            dspcnt = maxEntry;
        }
        for (let i = sta; i < dspcnt; i++) {
            const pt = pHist.mChartList[i];
            let value = pt.mSellBalance;
            if (max < value) {
                max = value;
            }
            value = pt.mBuyBalance;
            if (max < value) {
                max = value;
            }
        }
        this.m_dispMaxValue = max;
        this.m_dispMinValue = 0;
    }
    //====================================================================
    //	指標パネル情報セット
    //====================================================================
    setValueToIndexPanel(ix) {
        const indexPanel = this.m_common.m_indexPanel;
        const txt = ["売信用残", "買信用残"];
        const len = this.m_indexColor.length;

        let hist = this.m_info.getCurrentHist();
        let szHistList = this.m_info.getCurHistSize();
        let pt = null;

        if (0 <= ix && ix < szHistList) {
            pt = hist.mChartList[ix];
        }

        if(!pt){
            return;
        }

        indexPanel.m_subIndexName.push(txt[0]);
        indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[0]));
        const svalue = pt.mSellBalance;
        if (0 <= svalue) {
            indexPanel.m_subIndexValue.push(this.m_common.indexToStr(svalue, 0));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }

        indexPanel.m_subIndexName.push(txt[1]);
        indexPanel.m_subIndexColor.push(this.m_drawParam.getColor(this.m_indexColor[1]));
        const bvalue = pt.mBuyBalance;
        if (0 <= bvalue) {
            indexPanel.m_subIndexValue.push(this.m_common.indexToStr(bvalue, 0));
        } else {
            indexPanel.m_subIndexValue.push("-");
        }
    }
}