import { ChartCanvas } from './chartCanvas';
import ChartEventCtrl from './chartEventCtrl';
import * as CD from './chartDef';
import { PRM_ENV_2 } from './chartTechParameter';

const CHART_INIT_HANDLE = 1000;

export default class ChartLib {
    constructor() {
        this.m_cc = new ChartCanvas();
        this.m_evtCtrl = new ChartEventCtrl(this.m_cc);
        this.m_evtCtrl.init();
        this.m_fgCanvas = null;
        this.m_fgContext = null;
        this.m_bgCanvas = null;
        this.m_bgContext = null;
        this.issuCode = null;
        this.marketCode = null;
        this.handle = CHART_INIT_HANDLE;
    }
    setCanvas(fg_canvas, fg_context, bg_canvas, bg_context) {
        this.m_cc.setCanvas(bg_canvas, bg_context);
        this.m_evtCtrl.canvasReset();
        this.m_fgCanvas = fg_canvas;
        this.m_fgContext = fg_context;
        this.m_bgCanvas = bg_canvas;
        this.m_bgContext = bg_context;
    }
    setHandle(value) {
        this.handle = value;
    }
    getHandle() {
        return this.handle;
    }
    getChartSetting(settingObj) {
        return this.m_evtCtrl.getChartSetting(settingObj);
    }
    setChartSetting(settingObj) {
        return this.m_evtCtrl.setChartSetting(settingObj);
    }
    isInitialHandle() {
        if(this.handle === CHART_INIT_HANDLE) {
            return true;
        }
        return false;
    }
    setSettingImg(src) {
    	this.m_evtCtrl.setSettingImg(src);
    }
    setDustboxImg(src) {
    	this.m_evtCtrl.setDustboxImg(src);
    }
    changeIssue(issuCode, issueName, marketCode) {
        this.issuCode = issuCode;
        this.marketCode = marketCode;
        this.m_evtCtrl.changeIssue(issuCode, issueName, marketCode);
        this.onPaint();
    }
    getIssueCode() {
        return this.issuCode;
    }
    getMarketCode() {
        return this.marketCode;
    }
    getIssue() {
        return [this.issuCode, this.marketCode];
    }
    changeSubIssue(subCode, subName) {
        this.m_evtCtrl.changeSubIssue(subCode, subName);
        //this.onPaint();
    }
    setIssueError(code, reason) {
        this.m_evtCtrl.changeIssueError(code, reason);
    }
    setPeriodMin(minValue){
        this.m_evtCtrl.changePeriod(CD.CHART_DATA_MIN, minValue);
    }
    setPeriodDaily(){
        this.m_evtCtrl.changePeriod(CD.CHART_DATA_DAY);
    }
    setPeriodWeekly(){
        this.m_evtCtrl.changePeriod(CD.CHART_DATA_WEEK);
    }
    setPeriodMonthly(){
        this.m_evtCtrl.changePeriod(CD.CHART_DATA_MONTH);
    }
    setPeriodTick(){
        this.m_evtCtrl.changePeriod(CD.CHART_DATA_TICK);
    }
    getPeriod() {
        return this.m_evtCtrl.getPeriod();
    }
    setAdjustPrice(boolVal) {
        this.m_evtCtrl.setAdjustPrice(boolVal);
    }
    getAdjustPrice() {
        return this.m_evtCtrl.getAdjustPrice();
    }
    setOHLC(dataObj) {
        this.m_evtCtrl.dataLoadEvent(dataObj);
        this.onPaint();
    }
    setTick(tickObj) {
        this.m_evtCtrl.updateEvent(tickObj);
        this.onPaint();
    }
    setCrossLine(boolVal) {
        if (typeof boolVal === 'boolean') {
            this.m_evtCtrl.crossLineEnableEvent(boolVal);
        }
        //this.onPaint();
    }
    setStickDrawEdge(drawing) {
        this.m_evtCtrl.setStickDrawEdgeEvent(drawing);
        //this.onPaint();
    }
    setSize(chwidth, chmgn) {
        this.m_evtCtrl.changeSizeEvent(chwidth, chmgn);
        this.onPaint();
    }
    //==============================================================================
    // 表示オプション
    //==============================================================================
    setScrollbar(boolVal) {
        this.m_evtCtrl.scrollEnableEvent(boolVal);
    }
    setCrossLine(boolVal) {
        this.m_evtCtrl.crossLineEnableEvent(boolVal);
    }
    setIndexPanel(boolVal) {
        this.m_evtCtrl.indexPanelEnableEvent(boolVal);
    }
    setScaleLeft(boolVal) {
        this.m_evtCtrl.setScaleLeftEvent(boolVal);
    }
    setScaleRight(boolVal) {
        this.m_evtCtrl.setScaleRightEvent(boolVal);
    }
    setTickList(boolVal) {
        this.m_evtCtrl.setTickListDispEvent(boolVal);
    }
    //==============================================================================
    // 描画形状
    //==============================================================================
    setStyleCandle() {
        this.m_evtCtrl.setChartStyleChangeEvent(CD.STYLE_CANDLE);
    }
    setStyleLine() {
        this.m_evtCtrl.setChartStyleChangeEvent(CD.STYLE_LINE);
    }
    setStylePollyLine() {
        this.m_evtCtrl.setChartStyleChangeEvent(CD.STYLE_POLLY_LINE);
    }
    setStyleBar() {
        this.m_evtCtrl.setChartStyleChangeEvent(CD.STYLE_BAR);
    }
    setStyleBarFull() {
        this.m_evtCtrl.setChartStyleChangeEvent(CD.STYLE_BAR_FULL);
    }
    setStyleTBRK() {
        this.m_evtCtrl.setChartStyleChangeEvent(CD.STYLE_BREAK);
    }
    setStyleTKAGI() {
        this.m_evtCtrl.setChartStyleChangeEvent(CD.STYLE_KAGI);
    }
    setStyleTICK() {
        this.m_evtCtrl.setChartStyleChangeEvent(CD.STYLE_TICK);
    }
    //==============================================================================
    // 描画形状(シングルパネル)
    //==============================================================================
    setStyleCWC() {
        this.m_evtCtrl.setSinglePanelEvent(CD.CHART_MAIN_CWC);
    }
    setStyleBRK() {
        this.m_evtCtrl.setSinglePanelEvent(CD.CHART_MAIN_BREAK);
    }
    setStyleKAGI() {
        this.m_evtCtrl.setSinglePanelEvent(CD.CHART_MAIN_KAGI);
    }
    setStylePF() {
        this.m_evtCtrl.setSinglePanelEvent(CD.CHART_MAIN_PF);
    }
    //==============================================================================
    // テクニカルツール
    //==============================================================================
    setTechToolOff() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_UNSET);
    }
    setTrendLine() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_TREND);
    }
    setRetracement() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_RETRACE);
    }
    setRetracement5() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_RETRACE_5);
    }
    setDayCounter() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_COUNTER);
    }
    setPentagon() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_PENTAGON);
    }
    setFiboFan() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_FIBOFAN);
    }
    setFiboArc() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_FIBOARC);
    }
    setFiboCircle() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_FIBOCIRCLE);
    }
    setFiboChannel() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_FIBOCHANNEL);
    }
    setFiboTime() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_FIBOTIME);
    }
    setGanFan(stat) {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_GANFAN);
    }
    setGanAngle() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_GANANGLE);
    }
    setGanBox() {
        this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_GANBOX);
    }
    setPitchFork(isFibo) {
        if (!isFibo) {
            this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_PITCH_FORK);
        } else {
            this.m_evtCtrl.setTechToolEvent(CD.TECH_TOOL_PITCH_FORK_EX);
        }
    }
    //==============================================================================
    // メインパネルテクニカル指標
    //==============================================================================
    // 単純移動平均
    setSMA(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.SMA, boolVal);
    }
    setSMAParam(t1, t2, t3 = 0) {
        this.m_evtCtrl.m_techprm.setPrmSMA(t1, t2, t3);
        this.m_evtCtrl.resetMainIndexEvent();
    }
    setSMAColor(c1, c2, c3 = "") {
        this.m_evtCtrl.m_drawprm.setColorSMA(c1, c2, c3);
    }
    // 指数平滑移動平均
    setEMA(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.EMA, boolVal);
    }
    // 加重移動平均
    setWMA(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.WMA, boolVal);
    }
    // 多重(単純)移動平均
    setSMMA(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.SMMA, boolVal);
    }
    // 多重(指数)移動平均
    setEMMA(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.EMMA, boolVal);
    }
    // ボリンジャーバンド
    setBB(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.BB, boolVal);
    }
    // 一目均衡表
    setICHIMOKU(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.ICHI, boolVal);
    }
    // エンベロープ
    setENV(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.ENV, boolVal);
    }
    setENVParam(n1, n2, n3, n4, n5, n6, n7) {
        this.m_evtCtrl.m_techprm.setPrmENV(n1, n2, n3, n4, n5, n6, n7);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setENVColor(c1, c2, c3, c4, c5, c6, c7) {
        this.m_evtCtrl.m_drawprm.setColorENV(c1, c2, c3, c4, c5, c6, c7);
    }
    // ボラティリティシステム
    setVS(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.VS, boolVal);
    }
    setVSParam(n1, n2) {
        this.m_evtCtrl.m_techprm.setPrmVS(n1, n2);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setVSColor(c1, c2) {
        this.m_evtCtrl.m_drawprm.setColorVS(c1, c2);
    }
    // HLバンド
    setHLB(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.HLB, boolVal);
    }
    setHLBParam(n1, n2) {
        this.m_evtCtrl.m_techprm.setPrmHLB(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setHLBColor(c1, c2, c3) {
        this.m_evtCtrl.m_drawprm.setColorHLB(c1, c2, c3);
    }
    // パラボリック
    setPAR(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.PAR, boolVal);
    }
    setPARParam(n1, n2) {
        this.m_evtCtrl.m_techprm.setPrmPAR(n1, n2);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setPARColor(c1, c2) {
        this.m_evtCtrl.m_drawprm.setColorPAR(c1, c2);
    }
    // ピボット(パラメータ無し)
    setPVT(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.PVT, boolVal);
    }
    setPVTColor(c1, c2, c3, c4, c5) {
        this.m_evtCtrl.m_drawprm.setColorPVT(c1, c2, c3, c4, c5);
    }
    // 回帰トレンド
    setLRT(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.LRT, boolVal);
    }
    setLRTParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmLRT(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setLRTColor(c1, c2, c3, c4, c5) {
        this.m_evtCtrl.m_drawprm.setColorLRT(c1, c2, c3, c4, c5);
    }
    // 高安移動平均
    setHMA(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.HMA, boolVal);
    }
    setHMAParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmHMA(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setHMAColor(c1, c2) {
        this.m_evtCtrl.m_drawprm.setColorHMA(c1, c2);
    }
    // VWAP
    setVWAP(boolVal) {
        this.m_evtCtrl.setTechIndex(CD.VWAP, boolVal);
    }
    setVWAPColor(c1, c2) {
        this.m_evtCtrl.m_drawprm.setColorVWAP(c1, c2);
    }
    //==============================================================================
    // サブパネルテクニカル指標
    //==============================================================================
    // 出来高
    setVolume(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_SMAV, boolVal);
    }
    // MACD
    setMACD(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_MACD, boolVal);
    }
    // ストキャスティクス
    setSTC(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_STC, boolVal);
    }
    // スローストキャスティクス
    setSSTC(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_SSTC, boolVal);
    }
    // RSIA(W)
    setRSIw(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_RSIA, boolVal);
    }
    // RSIB(C)
    setRSIc(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_RSIB, boolVal);
    }
    // RCI
    setRCI(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_RCI, boolVal);
    }
    // %R
    setWR(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_WR, boolVal);
    }
    // モメンタム
    setMOM(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_MOM, boolVal);
    }
    // サイコロジカルライン
    setPL(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_PL, boolVal);
    }
    setPLParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmPL(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setPLColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorPL(c1);
    }
    // DMA
    setDMA(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_DMA, boolVal);
    }
    setDMAParam(n1, n2, n3) {
        this.m_evtCtrl.m_techprm.setPrmDMA(n1, n2, n3);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setDMAColor(c1, c2, c3) {
        this.m_evtCtrl.m_drawprm.setColorDMA(c1, c2, c3);
    }
    // UO
    setUO(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_UO, boolVal);
    }
    setUOParam(n1, n2, n3) {
        this.m_evtCtrl.m_techprm.setPrmUO(n1, n2, n3);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setUOColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorUO(c1);
    }
    // ATR
    setATR(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_ATR, boolVal);
    }
    setATRParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmATR(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setATRColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorATR(c1);
    }
    // ROC
    setROC(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_ROC, boolVal);
    }
    setROCParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmROC(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setROCColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorROC(c1);
    }
    // 強弱レシオ
    setSWR(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_SWR, boolVal);
    }
    setSWRParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmSWR(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setSWRColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorSWR(c1);
    }
    // アルーンインジケータ
    setARN(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_ARN, boolVal);
    }
    setARNParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmARN(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setARNColor(c1, c2) {
        this.m_evtCtrl.m_drawprm.setColorARN(c1, c2);
    }
    // アルーンオシレータ
    setARO(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_ARO, boolVal);
    }
    setAROParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmARO(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setAROColor(c1, c2) {
        this.m_evtCtrl.m_drawprm.setColorARO(c1);
    }
    // CCI
    setCCI(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_CCI, boolVal);
    }
    setCCIParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmCCI(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setCCIColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorCCI(c1);
    }
    // SNR
    setSNR(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_SNR, boolVal);
    }
    setSNRParam(n1, n2) {
        this.m_evtCtrl.m_techprm.setPrmSNR(n1, n2);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setSNRColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorSNR(c1);
    }
    // DPO
    setDPO(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_DPO, boolVal);
    }
    setDPOParam(n1, n2) {
        this.m_evtCtrl.m_techprm.setPrmDPO(n1, n2);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setDPOColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorDPO(c1);
    }
    // 標準偏差
    setSD(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_SD, boolVal);
    }
    setSDParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmSD(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setSDColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorSD(c1);
    }
    // 標準偏差ボラティリティ
    setSDV(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_SDV, boolVal);
    }
    setSDVParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmSDV(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setSDVColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorSDV(c1);
    }
    // ヒストリカルボラティリティ
    setHV(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_HV, boolVal);
    }
    setHVParam(n1) {
        this.m_evtCtrl.m_techprm.setPrmHV(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setHVColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorHV(c1);
    }
    // ボリュームレシオ(A)
    setVRA(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_VRA, boolVal);
    }
    setVRAParam(n1, n2) {
        this.m_evtCtrl.m_techprm.setPrmVRA(n1, n2);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setVRAColor(c1, c2) {
        this.m_evtCtrl.m_drawprm.setColorVRA(c1, c2);
    }
    // ボリュームレシオ(B)
    setVRB(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_VRB, boolVal);
    }
    setVRBParam(n1, n2) {
        this.m_evtCtrl.m_techprm.setPrmVRB(n1, n2);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setVRBColor(c1, c2) {
        this.m_evtCtrl.m_drawprm.setColorVRB(c1, c2);
    }
    // DMI
    setDMI(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_DMI, boolVal);
    }
    setDMIParam(n1, n2, n3) {
        this.m_evtCtrl.m_techprm.setPrmDMI(n1, n2, n3);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setDMIColor(c1, c2, c3, c4) {
        this.m_evtCtrl.m_drawprm.setColorDMI(c1, c2, c3, c4);
    }
    // オンバランスボリューム
    setOBV(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_OBV, boolVal);
    }
    setOBVColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorOBV(c1);
    }
    // レシオケータ
    setRTA(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_RTA, boolVal);
    }
    setRTAParam(n1, n2, n3) {
        this.m_evtCtrl.m_techprm.setPrmRTA(n1);
        this.m_evtCtrl.resetSubIndexEvent();
    }
    setRTAColor(c1) {
        this.m_evtCtrl.m_drawprm.setColorRTA(c1);
    }
    // 信用残
    setMGN(boolVal) {
        return this.m_evtCtrl.setSubIndexEvent(CD.CHART_INDEX_MGN, boolVal);
    }
    setMGNColor(c1, c2) {
        this.m_evtCtrl.m_drawprm.setColorMGN(c1, c2);
    }
    //==============================================================================
    // メインパネル表示オプション
    //==============================================================================
    // 転換点
    setRevPoint(boolVal) {
        this.m_evtCtrl.revPointEnableEvent(boolVal);
        //this.onPaint();
    }
    // 価格帯別売買高
    setPriceVol(boolVal) {
        this.m_evtCtrl.priceVolEnableEvent(boolVal);
        //this.onPaint();
    }
    // フィボナッチ(ザラバ)
    setFiboZaraba(boolVal) {
        this.m_evtCtrl.fiboZarabaEnableEvent(boolVal);
    }
    // フィボナッチ(終値)
    setFiboClose(boolVal) {
        this.m_evtCtrl.fiboCloseEnableEvent(boolVal);
    }
    // フィボナッチ(基調転換)
    setFiboRev(boolVal) {
        this.m_evtCtrl.fiboRevEnableEvent(boolVal);
    }
    // 一目均衡表(時間論・基本数値)
    setIchimokuTIme(boolVal) {
        this.m_evtCtrl.ichiTimeEnableEvent(boolVal);
    }
    //==============================================================================
    // その他
    //==============================================================================
    clear() {
        this.m_evtCtrl.clearEvent();
    }
    onPaint() {
        if(this.m_fgCanvas === null) { return; }
        this.m_evtCtrl.drawEvent();
        this.m_fgContext.drawImage(this.m_bgCanvas, 0, 0, this.m_fgCanvas.width, this.m_fgCanvas.height, 0,0,this.m_fgCanvas.width, this.m_fgCanvas.height);
    }
    onMouseMove(e, startX, startY) {
        let x;
        let y;
        if (!e) {
            x = window.event.clientX;
            y = window.event.clientY;
        } else if(startX !== undefined && 0 < startX) {
            x = e.clientX - startX;
            y = e.clientY - startY;
        } else {
            const rect = e.target.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        if (this.m_evtCtrl.mouseMoveEvent(x, y)) {
            this.onPaint();
        }
    }
    onMouseDown(e, startX, startY) {
        let x;
        let y;
        if (!e) {
            x = window.event.clientX;
            y = window.event.clientY;
        } else if(startX !== undefined && 0 < startX) {
            x = e.clientX - startX;
            y = e.clientY - startY;
        } else {
            const rect = e.target.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        if (this.m_evtCtrl.mouseDownEvent(x, y)) {
            this.onPaint();
        }
        return false;
    }
    onMouseUp(e, startX, startY) {
        let x;
        let y;
        if (!e) {
            x = window.event.clientX;
            y = window.event.clientY;
        } else if(startX !== undefined && 0 < startX) {
            x = e.clientX - startX;
            y = e.clientY - startY;
        } else {
            const rect = e.target.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        if (this.m_evtCtrl.mouseUpEvent(x, y)) {
            this.onPaint();
        }
        return false;
    }
    onKeyUp(e) {
       // 今の所DELETEキーのみ
        if (e.key === 'Delete') {
            if (this.m_evtCtrl.deleteKeyEvent()) {
                this.onPaint();
            }
        }
    }
    addCanvasMouseEvent(canvas) {
        let self = this;
        canvas.onmouseout = function (e) {
            if (self.m_evtCtrl.mouseOutEvent()) {
                self.onPaint();
            }
        }
        canvas.onmousedown = function (e) {
            return self.onMouseDown(e);
        }
        canvas.onmousemove = function (e) {
            return self.onMouseMove(e);
        }
        canvas.onmouseup = function (e) {
            return self.onMouseUp(e);
        }
        //TOUCH EVENT
        canvas.ontouchstart = function (e) {
            const rect = e.target.getBoundingClientRect();
            const x = e.touches[0].pageX - rect.left;
            const y = e.touches[0].pageY - rect.top;
            if (self.m_evtCtrl.mouseDownEvent(x, y)) {
                if (self.m_evtCtrl.mouseMoveEvent(x, y)) {
                    self.onPaint();
                }
            }
            return false;
        }
        canvas.ontouchmove = function (e) {
            e.preventDefault();
            const rect = e.target.getBoundingClientRect();
            const x = e.touches[0].pageX - rect.left;
            const y = e.touches[0].pageY - rect.top;
            if (self.m_evtCtrl.mouseMoveEvent(x, y)) {
                self.onPaint();
            }
        }
        canvas.ontouchend = function (e) {
            const rect = e.target.getBoundingClientRect();
            const x = e.touches[0].pageX - rect.left;
            const y = e.touches[0].pageY - rect.top;
            if (self.m_evtCtrl.mouseUpEvent(x, y)) {
                self.onPaint();
            }
            return false;
        }
        canvas.ontouchcancel = function (e) {
            const rect = e.target.getBoundingClientRect();
            const x = e.touches[0].pageX - rect.left;
            const y = e.touches[0].pageY - rect.top;
            if (self.m_evtCtrl.mouseOutEvent(x, y)) {
                self.onPaint();
            }
            return false;
        }
    }
}

