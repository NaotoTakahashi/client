import ChartAreaCtrl from './chartAreaCtrl';
import ChartDataCtrl from './chartDataCtrl';
import ChartBaseInfo from './chartBaseInfo';
import ChartTechParam from './chartTechParameter';
import ChartDrawParam from './chartDrawParameter';
import ChartMainPanel from './chartMainPanel';
import {ChartSubPanel} from './chartSubPanel';
import {ChartBRK, ChartKAGI, ChartPF, ChartCWC} from './chartSinglePanel';
import {ChartTickList, ChartDataList} from './chartTickList';
import {ChartWindow, ChartIndexSetting} from './chartWindow';
import ChartIndexPanel from './chartIndexPanel';
import ChartScroll from './chartScroll';
import {SCROLL_HEIGHT} from './chartAreaCtrl';
import * as CD from './chartDef';
import * as BP from './chartWindow';

const MAX_PANEL_NUM = 6;
const DATA_NORMAL = 0;
const ERROR_MSG = {
    NORMAL: "",
    NOT_EXIST: "銘柄がありません"
};

export default class ChartEventCtrl {
	constructor(chartCanvas) {
        this.m_cc = chartCanvas;
        this.m_dataCtrl = new ChartDataCtrl();
        this.m_info = new ChartBaseInfo();
        this.m_info.setHistList(this.m_dataCtrl.getData());
        this.m_info.setCurHist();
        this.m_techprm = new ChartTechParam();
        this.m_techprm.init();
        this.m_drawprm = new ChartDrawParam();
        this.m_drawprm.init();
        this.m_areaCtrl = new ChartAreaCtrl(this.m_drawprm);
        this.m_panel = new Array(MAX_PANEL_NUM);
        this.m_panel.fill(null);
        this.m_panelRect = new Array(MAX_PANEL_NUM);
        //this.m_panelType = new Array(MAX_PANEL_NUM);
        this.m_mainChartIndex = 0;
        this.m_panel[this.m_mainChartIndex] = new ChartMainPanel(this.m_cc, this.m_info, this.m_techprm, this.m_drawprm);
        this.m_panelRect[this.m_mainChartIndex] = null;
        this.m_indexPanel = new ChartIndexPanel(chartCanvas);
        this.m_isIndexPanelOn = false;
        this.m_scroll = null;
        // シングルパネル用
        this.m_single = {};
        this.m_single.indexPanel = new ChartIndexPanel(chartCanvas);
        this.m_single.panel = null;
        this.m_single.panelRect = { left: 0, top: 0, right: 0, bottom: 0 };
        this.m_single.info = new ChartBaseInfo();
        this.m_single.info.setHistList(this.m_dataCtrl.getData());
        this.m_single.info.setCurHist();
        this.m_tickList = null;
        this.m_dataList = null;
        this.m_single.scroll = null;

        this.m_indexSetting = new ChartIndexSetting(chartCanvas);
        this.m_indexSetting.setResetBtnName("初期値に戻す");
        this.m_indexSetting.setBackGroundColor("rgb(0,0,0,0.8)");
        this.m_colorSetting = new ChartIndexSetting(chartCanvas);
        this.m_colorSetting.setResetBtnName("元に戻す");
        this.m_colorSetting.setSize(400, 380);

        this.m_adjustPrice = true;
        this.m_period = CD.CHART_DATA_DAY;
        this.m_periodMin = 0;
        this.m_errorFlag = false;
        this.m_errorMsg = 0;
    }
    init() {
        this.m_areaCtrl.init(this.m_cc, 1);
    }
    getChartSetting(settingObj) {
        settingObj.version = '1.0';
        settingObj.drawParam = this.m_drawprm.getColorDef();
        settingObj.techParam = this.m_techprm.getParamDef();
    }
    setChartSetting(settingObj) {
        if(!settingObj){
            return;
        }
        if (settingObj.m_drawprm) {
            this.m_drawprm.setColorDef(settingObj.drawParam);
        }
        if (settingObj.m_techprm) {
            this.m_techprm.setParamDef(settingObj.techParam);
        }
    }
    dataReady() {
        // 初期データローディング完了
        //this.m_panel[this.m_mainChartIndex].initData();
        //this.m_panel[this.m_mainChartIndex].setIndexPanel(this.m_indexPanel);
        for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++){
            this.m_panel[i].m_common.setIndexPanel(this.m_indexPanel);
            this.m_panel[i].initData();
        }
        if (this.m_single.panel !== null) {
            this.m_single.panel.initData();
        }
        if(this.m_tickList){
            this.setTickListDispEvent(true);
        }
        this.canvasReset();
    }

    // データリスト画面
    setTickListDispEvent(boolval) {
        if(boolval) {
            if(this.m_period === CD.CHART_DATA_TICK){
                this.m_tickList = new ChartTickList(this.m_info, this.m_drawprm);
            }else{
                this.m_tickList = new ChartDataList(this.m_info, this.m_drawprm);
            }
            this.m_areaCtrl.setRightArea(this.m_tickList.getAreaSize());
        } else{
            this.m_areaCtrl.setRightArea(0);
            this.m_tickList = null;
        }
        this.canvasReset();
    }
    canvasReset() {
        if (this.m_cc.getHeight() < 1) {
            return;
        }
        this.m_areaCtrl.reset(this.m_cc);

        for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++){
            this.m_panelRect[i] = this.m_areaCtrl.m_areaRect[i];
        }
        if (this.m_scroll != null) {
            this.m_info.setScrollEnabled(true);
            this.m_areaCtrl.setScrollArea(true);
            this.m_scroll = new ChartScroll(this.m_info, this.m_drawprm, false);
        }
        if (this.m_single.scroll != null) {
            this.m_single.info.setScrollEnabled(true);
            this.m_single.scroll = new ChartScroll(this.m_single.info, this.m_drawprm, true);
        }
        this.m_indexSetting.setCanvas(this.m_cc);
        this.m_colorSetting.setCanvas(this.m_cc);
    }
    scrollEnableEvent(boolVal) {
        this.m_indexSetting.setEnabled(false);
        this.m_colorSetting.setEnabled(false);

        this.m_info.setScrollEnabled(boolVal);
        this.m_areaCtrl.setScrollArea(boolVal);
        if(boolVal) {
            this.m_scroll = new ChartScroll(this.m_info,this.m_drawprm, false);
        }else{
            this.m_scroll = null;
        }
        // シングルパネル
        this.m_single.info.setScrollEnabled(boolVal);
        if(boolVal) {
            this.m_single.scroll = new ChartScroll(this.m_single.info,this.m_drawprm, true);
        }else{
            this.m_single.scroll = null;
        }
        //this.canvasReset();
    }
    setSettingImg (src) {
        this.m_cc.setSettingImg(src);
        this.m_panel[this.m_mainChartIndex].m_headerTree.setSettingImg(src);
    }
    setDustboxImg (src) {
        this.m_cc.setDustboxImg(src);
    }
    changeIssue(issuCode, issueName, marketCode) {
        this.m_errorFlag = false;
        this.m_errorMsg = ERROR_MSG.NORMAL;
        this.m_panel[this.m_mainChartIndex].setIssue(issuCode, issueName, marketCode);
        this.m_panel[this.m_mainChartIndex].clearTechTool();
        this.dataReady();
    }
    changeSubIssue(issuCode, issueName, marketCode) {
        //this.m_panel[this.m_mainChartIndex].setIssue(issuCode, issueName, marketCode);
    }
    changeIssueError(issuCode, reason) {
        this.m_panel[this.m_mainChartIndex].clearTechTool();
        this.m_errorFlag = true;
        this.m_errorMsg = ERROR_MSG.NOT_EXIST;
    }
    changePeriod(periodCode, value) {
        this.m_period = periodCode;
        this.m_periodMin = value;
        this.m_panel[this.m_mainChartIndex].setPeriod(periodCode, value);
        this.m_panel[this.m_mainChartIndex].clearTechTool();
        this.dataReady();
        //this.canvasReset();
    }
    getPeriod(periodCode) {
        return [this.m_period, this.m_periodMin];
    }
    setAdjustPrice(boolVal) {
        this.m_adjustPrice = boolVal;
    }
    getAdjustPrice() {
        return this.m_adjustPrice;
    }
    indexPanelEnableEvent(boolVal) {
        this.m_isIndexPanelOn = boolVal;
    }
    crossLineEnableEvent(boolVal) {
        this.m_info.setCrossLineEnabled(boolVal);
        this.m_single.info.setCrossLineEnabled(boolVal);
    }
    revPointEnableEvent(boolVal) {
        this.m_info.setRevPoint(boolVal);
    }
    priceVolEnableEvent(boolVal) {
        this.m_info.setPriceVol(boolVal);
    }
    fiboZarabaEnableEvent(boolVal) {
        this.m_info.setFiboZrb(boolVal);
    }
    fiboCloseEnableEvent(boolVal) {
        this.m_info.setFiboCls(boolVal);
    }
    fiboRevEnableEvent(boolVal) {
        this.m_info.setFiboRev(boolVal);
    }
    ichiTimeEnableEvent(boolVal) {
        this.m_info.setIchiTime(boolVal);
    }
    setStickDrawEdgeEvent(drawing) {
        this.m_info.setCandleEdgeDraw(drawing);
    }
    setScaleLeftEvent(boolVal) {
        this.m_info.setScaleLeft(boolVal);
    }
    setScaleRightEvent(boolVal) {
        this.m_info.setScaleRight(boolVal);
    }
    // テクニカルツールセット
    setTechToolEvent(type) {
        this.m_info.setTechTool(type);
    }
    // チャートスタイル変更
    setChartStyleChangeEvent(type) {
        this.m_indexSetting.setEnabled(false);
        this.m_colorSetting.setEnabled(false);
        this.setSinglePanelEvent(null);
        this.m_info.setChartStyle(type);
        this.m_info.setChartType(CD.CHART_MAIN_CANDLE);
        if (type === CD.STYLE_BREAK) {
            this.m_panel[this.m_mainChartIndex].setTechIndex(CD.TBRK, true);
            this.m_panel[this.m_mainChartIndex].setTechIndex(CD.TKAGI, false);
            this.resetMainIndexEvent();
        } else if (type === CD.STYLE_KAGI) {
            this.m_panel[this.m_mainChartIndex].setTechIndex(CD.TBRK, false);
            this.m_panel[this.m_mainChartIndex].setTechIndex(CD.TKAGI, true);
            this.resetMainIndexEvent();
        } else {
            this.m_panel[this.m_mainChartIndex].setTechIndex(CD.TBRK, false);
            this.m_panel[this.m_mainChartIndex].setTechIndex(CD.TKAGI, false);
            this.m_panel[this.m_mainChartIndex].resetHeader(); // ヘッダのみリセット
        }
    }
    // シングルパネル切替え
    setSinglePanelEvent(type) {
        switch (type) {
            case CD.CHART_MAIN_BREAK:
                this.m_single.panel = new ChartBRK(this.m_cc, this.m_single.info, this.m_techprm, this.m_drawprm, type);
                break;
            case CD.CHART_MAIN_KAGI:
                this.m_single.panel = new ChartKAGI(this.m_cc, this.m_single.info, this.m_techprm, this.m_drawprm, type);
                break;
            case CD.CHART_MAIN_PF:
                this.m_single.panel = new ChartPF(this.m_cc, this.m_single.info, this.m_techprm, this.m_drawprm, type);
                break;
            case CD.CHART_MAIN_CWC:
                this.m_single.panel = new ChartCWC(this.m_cc, this.m_single.info, this.m_techprm, this.m_drawprm, type);
                break;
            default:
                // 該当無し（エラー）
                this.m_single.panel = null;
                break;
        }
        if (this.m_single.panel !== null) {
            this.m_single.info.setSingleChart(true);
            this.m_single.info.setChartType(type);
            this.m_single.panel.resetIndexData();
            if (type !== CD.CHART_MAIN_CWC) {
                this.m_single.panel.setIndexPanel(this.m_single.indexPanel);
            }
        }
    }
    // テクニカル指標(メイン)追加
    setTechIndex(type, boolval) {
        this.m_panel[this.m_mainChartIndex].setTechIndex(type, boolval);
        this.resetMainIndexEvent();
    }
    changeSizeEvent(width, mgn) {
        this.m_info.setCandleWidth(width);
        this.m_info.setCandleMarginWidth(mgn);
    }
    // チャートエリア入替え処理
    swapAreaEvent(srcIndex, toUpper) {
        if (this.m_areaCtrl.m_areaNum <= 1 || srcIndex < 0  || this.m_areaCtrl.m_areaNum <= srcIndex) {
            return;
        }
        let dstIndex;
        if (!toUpper) {
            // 下方向へ
            dstIndex = srcIndex + 1;
            if (this.m_areaCtrl.m_areaNum <= dstIndex) {
                return;
            }
        }else{
            // 上方向へ
            dstIndex = srcIndex - 1;
            if (dstIndex < 0) {
                return;
            }
        }
        this.m_indexSetting.setEnabled(false);
        this.m_colorSetting.setEnabled(false);

        let panel = this.m_panel[srcIndex];
        this.m_panel[srcIndex] = this.m_panel[dstIndex];
        this.m_panel[dstIndex] = panel;
        //領域も入替え
        //this.m_areaCtrl.swapArea(srcIndex, dstIndex);
        //this.canvasReset();
        if(this.m_mainChartIndex === srcIndex){
            this.m_mainChartIndex = dstIndex;
            this.m_areaCtrl.setMainChartIndex(this.m_mainChartIndex);
        } else if(this.m_mainChartIndex === dstIndex){
            this.m_mainChartIndex = srcIndex;
            this.m_areaCtrl.setMainChartIndex(this.m_mainChartIndex);
        }
    }
    setSubIndexEvent(type, boolval) {
        // if (1 < this.m_areaCtrl.m_areaNum) {
        //      for (let i = 1; i < this.m_areaCtrl.m_areaNum; i++){
        //          this.m_panel[i].setIndexPanel(this.m_indexPanel);
        //          this.m_panel[i].initData(this.m_panelType[i]);
        //      }
        //  }
        this.m_indexSetting.setEnabled(false);
        this.m_colorSetting.setEnabled(false);
        if (boolval) {
            if (MAX_PANEL_NUM <= this.m_areaCtrl.m_areaNum) {
                return false;
            }
            // 既に存在している判定
            if (1 < this.m_areaCtrl.m_areaNum) {
                for (let i = 1; i < this.m_areaCtrl.m_areaNum; i++) {
                    if (this.m_panel[i].m_type === type) {
                        return true;
                    }
                }
            }
            // 追加処理
            if (this.m_areaCtrl.addArea()) {
                let i = this.m_areaCtrl.m_areaNum - 1;
                this.m_panel[i] = new ChartSubPanel(this.m_cc);
                this.m_panel[i].m_type = type;
                this.m_panel[i].setBaseInfo(this.m_info);
                this.m_panel[i].setTechParam(this.m_techprm);
                this.m_panel[i].setDrawParam(this.m_drawprm);
                this.m_panel[i].m_common.setIndexPanel(this.m_indexPanel);
                this.m_panel[i].initData();
                this.canvasReset();
             }
             return true;
        } else {
            // 削除処理
            let ix = -1;
            if (1 < this.m_areaCtrl.m_areaNum) {
                for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++) {
                    if (this.m_panel[i].m_type === type) {
                        // 削除対象検出
                        ix = i;
                        break;
                    }
                }
            }
            if (0 <= ix) {
                for (let i = ix; i < this.m_areaCtrl.m_areaNum - 1; i++) {
                    this.m_panel[i] = this.m_panel[i + 1];
                    if (this.m_mainChartIndex === i + 1) {
                        this.m_mainChartIndex = i;
                    }
                }
                this.m_panel[this.m_areaCtrl.m_areaNum - 1] = null;
                this.m_areaCtrl.deleteArea(ix);
                this.canvasReset();
            }
        }
        // INFOのエリア数も更新
        this.m_info.setAreaNum(this.m_areaCtrl.m_areaNum);
        return true;
    }
    resetMainIndexEvent() {
        this.m_panel[this.m_mainChartIndex].resetIndexData();
    }
    resetSubIndexEvent(type) {
        if (1 < this.m_areaCtrl.m_areaNum) {
            for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++) {
                if (this.m_panel[i].m_type === type) {
                    this.m_panel[i].resetIndexData();
                }
            }
        }
    }
    clearEvent() {
        this.m_dataCtrl.clearData();
    }
    drawEvent() {
        if (this.m_errorFlag) {
            // エラー発生中
            for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++){
                this.m_panel[i].draw(this.m_panelRect[i]);
            }
            if(this.m_scroll != null){
                const rc = this.m_areaCtrl.m_scroll_rc;
                this.m_cc.drawFillRect("black", "black", 0, rc.top - 3, rc.right, rc.bottom - rc.top + 3);
            }
            this.m_cc.drawErrorString(this.m_errorMsg);
            return;
        }

        if (this.m_single.panel !== null) {
            this.drawSingle();
            return;
        }

        let mainPanel = this.m_panel[this.m_mainChartIndex];
        let mainRect = this.m_panelRect[this.m_mainChartIndex]

        if(mainRect === null){
            return;
        }

        // データが無い場合はパネルのみ
        if (this.m_dataCtrl.m_chartData.getEntrySize() <= 0) {
            for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++){
                this.m_panel[i].draw(this.m_panelRect[i]);
            }
            if(this.m_scroll != null){
                const rc = this.m_areaCtrl.m_scroll_rc;
                this.m_cc.drawFillRect("black", "black", 0, rc.top - 3, rc.right, rc.bottom - rc.top + 3);
            }
            return;
        }

        // インデックスパネル初期化
        this.m_indexPanel.drawBegin();

        // メインパネル
        mainPanel.draw(mainRect);

        // チャートツール(メイン描画後ツール描画)
        let techToolCtrl = mainPanel.getTechToolCtrl();
        techToolCtrl.draw(this.m_cc);

        // サブパネル
        if (1 < this.m_areaCtrl.m_areaNum) {
            for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++) {
                if (i !== this.m_mainChartIndex) {
                    this.m_panel[i].draw(this.m_panelRect[i], i);
                }
            }
        }

        // 枠外領域の掃除 & スケール表示
        mainPanel.drawAfter(false, this.m_mainChartIndex);

        // スクロールバー
        if(this.m_scroll != null){
            this.m_scroll.draw(this.m_cc, this.m_areaCtrl.m_scroll_rc);
        }

        this.m_areaCtrl.draw(this.m_cc);

        // インデックスパネル描画
        if(this.m_isIndexPanelOn){
            let indexPanelRect = { top:mainRect.top,  left: mainRect.left, right: mainRect.right, bottom: mainRect.bottom };
            this.m_indexPanel.draw(indexPanelRect);
        }

        // インデックス設定画面
        if (this.m_indexSetting.isEnabled()) {
            if (0 <= this.m_indexSetting.getAreaIndex()) {
                let curAreaIndex = this.m_indexSetting.getAreaIndex();
                this.m_indexSetting.draw(mainRect);
                this.m_panel[curAreaIndex].drawParamSetting(this.m_indexSetting.getCurrentRect());
                // カラーピッカー画面
                if (this.m_panel[curAreaIndex].m_common.isDrawColorPicker()) {
                    this.m_colorSetting.setEnabled(true);
                    this.m_colorSetting.draw(mainRect);
                    this.m_panel[curAreaIndex].drawColorSetting(this.m_colorSetting.getCurrentRect());
                }
            }
        }

        // ティックリスト表示
        if(this.m_tickList) {
            const tickListrect = { left: this.m_areaCtrl.getAreaWidth(), top: 0, right: this.m_cc.getWidth(), bottom: this.m_cc.getHeight() }
            this.m_tickList.draw(tickListrect, this.m_cc);
        }
    }
    drawSingle() {
        // シングルパネル描画
        if (this.m_single.panel === null) {
            return;
        }

        // データが無い場合はパネルのみ
        if (this.m_dataCtrl.m_chartData.getEntrySize() <= 0) {
            return;
        }

        // インデックスパネル初期化
        this.m_single.indexPanel.drawBegin();
        let singleRect = this.m_single.panelRect;

        // シングルパネル
        //singleRect.right = this.m_cc.getWidth();
        singleRect.right = this.m_areaCtrl.getAreaWidth();
        if(this.m_single.scroll === null || this.m_single.panel.getChartType() === CD.CHART_MAIN_CWC) {
            singleRect.bottom  = this.m_cc.getHeight();
        }else{
            singleRect.bottom  = this.m_cc.getHeight() - SCROLL_HEIGHT;
        }
        this.m_single.panel.draw(singleRect);

        // 枠外領域の掃除 & スケール表示
        if (this.m_single.panel.getChartType() !== CD.CHART_MAIN_CWC) {
            this.m_single.panel.drawAfter(false);

            // スクロールバー
            if (this.m_single.scroll != null) {
                // スクロールの位置は同じためエリアコントロールを使用
                this.m_single.scroll.draw(this.m_cc, this.m_areaCtrl.m_scroll_rc);
            }
            // インデックスパネル描画
            if (this.m_isIndexPanelOn) {
                let indexPanelRect = { top: 　0, left: 0, right: singleRect.right, bottom: singleRect.bottom };
                this.m_single.indexPanel.draw(indexPanelRect);
            }
        }

        // インデックス設定画面
        if (this.m_indexSetting.isEnabled()) {
            this.m_indexSetting.draw(singleRect);
            this.m_single.panel.drawParamSetting(this.m_indexSetting.getCurrentRect());
            // カラーピッカー画面
            if (this.m_single.panel.m_common.isDrawColorPicker()) {
                this.m_colorSetting.setEnabled(true);
                this.m_colorSetting.draw(singleRect);
                this.m_single.panel.drawColorSetting(this.m_colorSetting.getCurrentRect());
            }
        }

        // ティックリスト表示
        if(this.m_tickList) {
            const tickListrect = { left: this.m_areaCtrl.getAreaWidth(), top: 0, right: this.m_cc.getWidth(), bottom: this.m_cc.getHeight() }
            this.m_tickList.draw(tickListrect, this.m_cc);
        }
    }

    dataLoadEvent(obj) {
        this.m_dataCtrl.setData(obj);
        this.dataReady();
        this.m_info.setDispAutoUpdate(true);
    }
    updateEvent(obj) {
        this.m_dataCtrl.setUpdateData(obj);
        for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++){
            this.m_panel[i].updateData();
        }
        this.m_dataCtrl.updateLastIndex();
    }
    // ------------------------------------------------------------
    // マウス左ボタン押下
    // ------------------------------------------------------------
    mouseDownEvent(x, y) {

        if (this.m_single.panel === null) {
            // >>>>>> メインパネル <<<<<<

            // TICKリスト
            if(this.m_tickList !== null){
                if (this.m_tickList.uiEvtMouseLeftPerformed(x, y)) {
                    return true;
                }
            }

            // パラメータ設定画面(モーダル扱い)
            if (this.m_indexSetting.isEnabled()) {
                let ret_stat = false;
                if (this.m_colorSetting.isEnabled()) {
                    if (this.m_colorSetting.uiEvtMouseLeftPerformed(x, y)) {
                        ret_stat = true;
                    }
                } else {
                    if (this.m_indexSetting.uiEvtMouseLeftPerformed(x, y)) {
                        ret_stat = true;
                    }
                }
                // パネルへ伝搬
                let areaIndex = this.m_indexSetting.getAreaIndex();
                if(this.m_panel[areaIndex].uiEvtMouseLeftPerformedForSetting(x, y)) {
                    ret_stat = true;
                }
                return ret_stat;
            }

            // スクロールバー
            if(this.m_scroll != null){
                if (this.m_scroll.uiEvtMouseLeftPerformed(x, y)) {
                    return true;
                }
            }

            // インデックスパネル
            if (this.m_indexPanel.uiEvtMouseLeftPerformed(x, y)) {
                return true;
            }

            // スプリッタ
            if (this.m_areaCtrl.uiEvtMouseLeftPerformed(x, y)) {
                return true;
            }

            // 各パネルへ伝搬
            let retStat = false;
            for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++) {
                if (this.m_panel[i].uiEvtMouseLeftPerformed(x, y)) {
                    retStat = true;
                }
            }
            if (retStat) return true;

            // チャートツール
            let techToolCtrl = this.m_panel[this.m_mainChartIndex].getTechToolCtrl();
            if (techToolCtrl.uiEvtMouseLeftPerformed(x, y)) {
                return true;
            }

            // パネル入替えボタン
            if (1 < this.m_areaCtrl.m_areaNum) {
                for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++) {
                    if (this.m_panel[i].m_common.m_btnUp.uiEvtMouseLeftPerformed(x, y)) {
                    }
                    if (this.m_panel[i].m_common.m_btnDn.uiEvtMouseLeftPerformed(x, y)) {
                    }
                    if (this.m_panel[i].m_common.m_btnSetting.uiEvtMouseLeftPerformed(x, y)) {
                    }
                }
            }
        }　else　{
            // >>>>>> シングルパネル <<<<<<

            // パラメータ設定画面(モーダル扱い)
            if (this.m_indexSetting.isEnabled()) {
                let ret_stat = false;
                if (this.m_colorSetting.isEnabled()) {
                    if (this.m_colorSetting.uiEvtMouseLeftPerformed(x, y)) {
                        ret_stat = true;
                    }
                } else {
                    if (this.m_indexSetting.uiEvtMouseLeftPerformed(x, y)) {
                        ret_stat = true;
                    }
                }
                if (this.m_single.panel.uiEvtMouseLeftPerformedForSetting(x, y)) {
                    ret_stat = true;
                }
                return ret_stat;
            }

            if(this.m_single.scroll != null){
                if (this.m_single.scroll.uiEvtMouseLeftPerformed(x, y)) {
                    return true;
                }
            }
            if (this.m_single.indexPanel.uiEvtMouseLeftPerformed(x, y)) {
                return true;
            }
            if (this.m_single.panel.uiEvtMouseLeftPerformed(x, y)) {
            }
        }

        return true;
    }
    // ------------------------------------------------------------
    // マウスカーソル移動
    // ------------------------------------------------------------
    mouseMoveEvent(x, y) {
        if (this.m_single.panel === null) {
            // >>>>>> メインパネル <<<<<<

            // TICKリスト
            if(this.m_tickList !== null){
                if (this.m_tickList.uiEvtMouseMovePerformed(x, y)) {
                    return true;
                }
            }

            // パラメータ設定画面
            if (this.m_indexSetting.isEnabled()) {
                let ret_stat = false;
                if (this.m_colorSetting.isEnabled()) {
                    if (this.m_colorSetting.uiEvtMouseMovePerformed(x, y)) {
                        return true;
                    }
                } else {
                    if (this.m_indexSetting.uiEvtMouseMovePerformed(x, y)) {
                        return true;
                    }
                }
                // パネル伝搬
                let areaIndex = this.m_indexSetting.getAreaIndex();
                ret_stat = this.m_panel[areaIndex].uiEvtMouseMovePerformedForSetting(x, y);
                return ret_stat;
            }

            // スクロールバー
            if(this.m_scroll != null){
                if (this.m_scroll.uiEvtMouseMovePerformed(x, y)) {
                    return true;
                }
            }

            // 各パネルへ伝搬(メイン除外)
            let panelResult = false;
            for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++) {
                if (this.m_panel[i].uiEvtMouseMovePerformed(x, y)) {
                }
            }
            if(panelResult) return true;

            // インデックスパネル
            if (this.m_indexPanel.uiEvtMouseMovePerformed(x, y)) {
                return true;
            }

            //　チャートツール
            let techToolCtrl = this.m_panel[this.m_mainChartIndex].getTechToolCtrl();
            if(techToolCtrl.uiEvtMouseMovePerformed(x, y)){
                //pLoupe->ClearPos(); //クリアが届かないため
                //return CHART_MOS_TOOL;
            }

            // スプリッタ
            if (this.m_areaCtrl.uiEvtMouseMovePerformed(x, y)) {
                return true;
            }
        }else{
            // >>>>>> シングルパネル <<<<<<

            // パラメータ設定画面
            if (this.m_indexSetting.isEnabled()) {
                let ret_stat = false;
                if (this.m_colorSetting.isEnabled()) {
                    if (this.m_colorSetting.uiEvtMouseMovePerformed(x, y)) {
                        return true;
                    }
                } else {
                    if (this.m_indexSetting.uiEvtMouseMovePerformed(x, y)) {
                        return true;
                    }
                }
                // パネル伝搬
                ret_stat = this.m_single.panel.uiEvtMouseMovePerformedForSetting(x, y);
                return ret_stat;
            }

            if(this.m_single.scroll != null){
                if (this.m_single.scroll.uiEvtMouseMovePerformed(x, y)) {
                    return true;
                }
            }
            if (this.m_single.indexPanel.uiEvtMouseMovePerformed(x, y)) {
                return true;
            }
            if (this.m_single.panel.uiEvtMouseMovePerformed(x, y)) {
            }
        }

        return true;
    }
    // ------------------------------------------------------------
    // マウス左ボタンアップ
    // ------------------------------------------------------------
    mouseUpEvent(x, y) {

        if (this.m_single.panel === null) {
            // >>>>>> メインパネル <<<<<<

            // TICKリスト
            if(this.m_tickList !== null){
                if (this.m_tickList.uiEvtMouseUpPerformed(x, y)) {
                    return true;
                }
            }

            // パラメータ設定画面
            if(this.m_indexSetting.isEnabled()){
                if(this.m_colorSetting.isEnabled()){
                    const colorSettingRusult = this.m_colorSetting.uiEvtMouseUpPerformed(x, y);
                    if (0 < colorSettingRusult) {
                        let areaIndex = this.m_indexSetting.getAreaIndex();
                        if (0 <= areaIndex || areaIndex < this.m_areaCtrl.m_areaNum) {
                            if (colorSettingRusult === BP.OK_BUTTON) {
                                // インデックスパラメータ更新
                                this.m_panel[areaIndex].updateColorParam();
                                this.m_panel[areaIndex].m_common.setColorPickerEnbled(false);
                            } else if (colorSettingRusult === BP.RESET_BUTTON) {
                                // 最初の色に戻す
                                this.m_panel[areaIndex].setColorPickerCurrnt();
                            } else if (colorSettingRusult === BP.CANCEL_BUTTON || colorSettingRusult === BP.CLOSED_BUTTON) {
                                // キャンセル時は何もしない
                                this.m_panel[areaIndex].m_common.setColorPickerEnbled(false);
                                this.m_panel[areaIndex].resetIndexColor();
                            }
                        }
                        return true;
                    }
                }else{
                    const indexSettingRusult = this.m_indexSetting.uiEvtMouseUpPerformed(x, y);
                    if (BP.OUT_OF_AREA === indexSettingRusult) {
                        // 範囲外での押下
                        this.m_indexSetting.setEnabled(false);
                    }else{
                        if (0 < indexSettingRusult) {
                            let areaIndex = this.m_indexSetting.getAreaIndex();
                            if (0 <= areaIndex && areaIndex < this.m_areaCtrl.m_areaNum) {
                                if (indexSettingRusult === BP.OK_BUTTON) {
                                    // インデックスパラメータ更新
                                    this.m_panel[areaIndex].updateIndexParam();
                                } else if (indexSettingRusult === BP.RESET_BUTTON) {
                                    // インデックス初期値リセット(更新はせず表示上のみリセット)
                                    this.m_panel[areaIndex].resetDefaultParam();
                                } else if (indexSettingRusult === BP.CANCEL_BUTTON || indexSettingRusult === BP.CLOSED_BUTTON) {
                                    // 更スライダ－を元の位置に戻す
                                    this.m_panel[areaIndex].resetIndexParam();
                                    this.m_panel[areaIndex].resetIndexColor();
                                }
                            }
                            return true;
                        }
                    }
                }
                let areaIndex = this.m_indexSetting.getAreaIndex();
                return this.m_panel[areaIndex].uiEvtMouseUpPerformedForSetting(x, y);
            }

            // スクロールバー
            if (this.m_scroll != null) {
                if (this.m_scroll.uiEvtMouseUpPerformed(x, y)) {
                    return true;
                }
            }

            // スプリッタ
            if (this.m_areaCtrl.uiEvtMouseUpPerformed(x, y)) {
                return true;
            }

            // インデックスパネル
            if (this.m_indexPanel.uiEvtMouseUpPerformed(x, y)) {
                return true;
            }

            // 各パネルへ伝搬
            for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++) {
                if (this.m_panel[i].uiEvtMouseUpPerformed(x, y)) {
                }
            }

            // パネル入替え判定
            if (1 < this.m_areaCtrl.m_areaNum) {
                let swap_i = -1;
                let swap_direction = false;
                for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++) {
                    if (this.m_panel[i].m_common.m_btnUp.uiEvtMouseUpPerformed(x, y)) {
                        swap_i = i;
                        swap_direction = true;
                    }
                    if (this.m_panel[i].m_common.m_btnDn.uiEvtMouseUpPerformed(x, y)) {
                        swap_i = i;
                        swap_direction = false;
                    }
                }
                if (0 <= swap_i) {
                    this.swapAreaEvent(swap_i, swap_direction);
                }
            }


            // パラメータ設定画面
            for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++) {
                if (this.m_panel[i].checkSettingMouseUpPerformed(x, y)) {
                    this.m_indexSetting.setEnabled(true);
                    this.m_indexSetting.setAreaIndex(i);
                }
            }

            // チャートツール
            let techToolCtrl = this.m_panel[this.m_mainChartIndex].getTechToolCtrl();
            if (techToolCtrl.uiEvtMouseUpPerformed(x, y)) {
            }

                        
            // インデックス消去指示(メニュー連動不可のため中止)
            // for (let i = 0; i < this.m_areaCtrl.m_areaNum; i++) {
            //     if (this.m_panel[i].checkCloseMouseUpPerformed(x, y)) {
            //         this.m_panel[i].closeIndexCtrl();
            //         this.resetMainIndexEvent();
            //         break;
            //     }
            // }
        }else{
            // >>>>>> シングルパネル <<<<<<
            const singlePanel = this.m_single.panel;
            // パラメータ設定画面
            if(this.m_indexSetting.isEnabled()){
                if(this.m_colorSetting.isEnabled()){
                    const colorSettingRusult = this.m_colorSetting.uiEvtMouseUpPerformed(x, y);
                    if (0 < colorSettingRusult) {
                        if (colorSettingRusult === BP.OK_BUTTON) {
                            // インデックスパラメータ更新
                            singlePanel.updateColorParam();
                            singlePanel.m_common.setColorPickerEnbled(false);
                        } else if (colorSettingRusult === BP.RESET_BUTTON) {
                            // 最初の色に戻す
                            singlePanel.setColorPickerCurrnt();
                        } else if (colorSettingRusult === BP.CANCEL_BUTTON || colorSettingRusult === BP.CLOSED_BUTTON) {
                            // キャンセル時は何もしない
                            singlePanel.m_common.setColorPickerEnbled(false);
                            singlePanel.resetIndexColor();
                        }
                        return true;
                    }
                }else{
                    const indexSettingRusult = this.m_indexSetting.uiEvtMouseUpPerformed(x, y);
                    if (BP.OUT_OF_AREA === indexSettingRusult) {
                        // 範囲外での押下
                        this.m_indexSetting.setEnabled(false);
                    }else{
                        if (0 < indexSettingRusult) {
                             if (indexSettingRusult === BP.OK_BUTTON) {
                                // インデックスパラメータ更新
                                singlePanel.updateIndexParam();
                            } else if (indexSettingRusult === BP.RESET_BUTTON) {
                                // インデックス初期値リセット(更新はせず表示上のみリセット)
                                singlePanel.resetDefaultParam();
                            } else if (indexSettingRusult === BP.CANCEL_BUTTON || indexSettingRusult === BP.CLOSED_BUTTON) {
                                // 更スライダ－を元の位置に戻す
                                singlePanel.resetIndexParam();
                                singlePanel.resetIndexColor();
                            }
                            return true;
                        }
                    }
                }
                return singlePanel.uiEvtMouseUpPerformedForSetting(x, y);
            }

            if (singlePanel.checkSettingMouseUpPerformed(x, y)) {
                this.m_indexSetting.setEnabled(true);
                return true;
            }
            if(this.m_single.scroll != null){
                if (this.m_single.scroll.uiEvtMouseUpPerformed(x, y)) {
                    return true;
                }
            }
            if (this.m_single.indexPanel.uiEvtMouseUpPerformed(x, y)) {
                return true;
            }
            if (singlePanel.uiEvtMouseUpPerformed(x, y)) {
            }
        }
        return true;
    }
    // ------------------------------------------------------------
    // マウスアウト
    // ------------------------------------------------------------
    mouseOutEvent() {
        if (this.m_single.panel === null) {
            // >>>>>> メインパネル <<<<<<
            // スクロールバー
            if(this.m_tickList !== null){
                if (this.m_tickList.uiEvtMouseOutPerformed()) {
                }
            }
            if(this.m_scroll != null){
                if (this.m_scroll.uiEvtMouseOutPerformed()) {
                }
            }
            if (this.m_indexPanel.uiEvtMouseOutPerformed()) {
            }
            // スプリッタ
            if (this.m_areaCtrl.uiEvtMouseOutPerformed()) {
            }
            if (this.m_panel[this.m_mainChartIndex].uiEvtMouseOutPerformed()) {
            }
        }else{
            // >>>>>> シングルパネル <<<<<<
            if(this.m_single.scroll != null){
                if (this.m_single.scroll.uiEvtMouseOutPerformed()) {
                    return true;
                }
            }
            if (this.m_single.indexPanel.uiEvtMouseOutPerformed()) {
            }
            if (this.m_single.panel.uiEvtMouseOutPerformed()) {
            }
        }
    }
    // ------------------------------------------------------------
    // マウスオーバー
    // ------------------------------------------------------------
    mouseOverEvent() {
        if (this.m_single.panel === null) {
            if(this.m_tickList !== null){
                if (this.m_tickList.uiEvtMouseInPerformed()) {
                }
            }
            if (this.m_indexPanel.uiEvtMouseInPerformed()) {
            }
            if (this.m_panel[this.m_mainChartIndex].uiEvtMouseInPerformed()) {
            }
        }else{
            if (this.m_single.indexPanel.uiEvtMouseInPerformed()) {
            }
            if (this.m_single.panel.uiEvtMouseInPerformed()) {
            }
        }
    }
    // ------------------------------------------------------------
    // DELETE KEY 押下
    // ------------------------------------------------------------
    deleteKeyEvent() {
        //　チャートツール
        const techToolCtrl = this.m_panel[this.m_mainChartIndex].getTechToolCtrl();
        return techToolCtrl.uiEvtDeleteKeyUpPerformed();
    }
}

