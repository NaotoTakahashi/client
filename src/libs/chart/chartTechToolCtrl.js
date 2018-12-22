import * as CD from './chartDef';
import {ChartDrawTrendLine, ChartDrawRetracement, ChartDrawRetracement5, ChartDrawCounter, ChartDrawPentagon} from './chartTechTool';
import {ChartDrawFiboFan, ChartDrawFiboArc, ChartDrawFiboCircle, ChartDrawFiboChannel, ChartDrawFiboTime} from './chartTechTool';
import {ChartDrawGanFan, ChartDrawGanAngle, ChartDrawGanBox, ChartDrawPitchfork} from './chartTechTool';
export default class ChartTechToolCtrl {
	constructor() {
        this.m_drawToolList = [];
        this.m_common = null;
        this.m_drawInf = null;
        this.m_techTool = new Array(CD.TECH_TOOL_MAX);
        this.m_techTool[CD.TECH_TOOL_TREND] = new ChartDrawTrendLine();
        this.m_techTool[CD.TECH_TOOL_RETRACE] = new ChartDrawRetracement();
        this.m_techTool[CD.TECH_TOOL_RETRACE_5] = new ChartDrawRetracement5();
        this.m_techTool[CD.TECH_TOOL_COUNTER] = new ChartDrawCounter();
        this.m_techTool[CD.TECH_TOOL_PENTAGON] = new ChartDrawPentagon();
        this.m_techTool[CD.TECH_TOOL_FIBOFAN] = new ChartDrawFiboFan();
        this.m_techTool[CD.TECH_TOOL_FIBOARC] = new ChartDrawFiboArc();
        this.m_techTool[CD.TECH_TOOL_FIBOCIRCLE] = new ChartDrawFiboCircle();
        this.m_techTool[CD.TECH_TOOL_FIBOCHANNEL] = new ChartDrawFiboChannel();
        this.m_techTool[CD.TECH_TOOL_FIBOTIME] = new ChartDrawFiboTime();
        this.m_techTool[CD.TECH_TOOL_GANFAN] = new ChartDrawGanFan();
        this.m_techTool[CD.TECH_TOOL_GANANGLE] = new ChartDrawGanAngle();
        this.m_techTool[CD.TECH_TOOL_GANBOX] = new ChartDrawGanBox();
        this.m_techTool[CD.TECH_TOOL_PITCH_FORK] = new ChartDrawPitchfork(false);
        this.m_techTool[CD.TECH_TOOL_PITCH_FORK_EX] = new ChartDrawPitchfork(true);
        this.m_fixSelected = false;	//TRUE:FIX SELECTED FALSE:NO SELECT   
        this.m_trendSelectedIX = -1;//-1:選択なし 0以上は選択中のインデクッス
        // マウスイベント情報
        this.m_current_x = 0;
        this.m_current_y = 0;
        this.m_mousePushed_x = 0;	//ボタン押下地点
        this.m_mousePushed_y = 0;	//ボタン押下地点
        this.m_mouseMoving_x = 0;	//ボタン移動地点
        this.m_mouseMoving_y = 0;	//ボタン移動地点
        this.m_select_x = 0;		//選択位置退避
        this.m_select_y = 0;		//選択位置退避
    }
    init(common) {
        this.m_mousePushed_x = -1;
        this.m_mousePushed_y = -1;
        this.m_mouseMoving_x = -1;
        this.m_mouseMoving_y = -1;
        this.m_fixSelected = false;
        if(common !== 'undefined'){
            this.m_common = common;
            this.m_drawInf = common.m_drawInf;
            for (let i = 0; i < this.m_techTool.length; ++i) {
                this.m_techTool[i].init(this.m_drawToolList, this.m_common);
            }
        }
    }
    draw(canvas) {
        let mouse_pushed = false;
        if(0 <= this.m_mousePushed_x){
            mouse_pushed = true;
        }
        //**************************************************************************
        // [DRAW TOOL] PUSHED MOUSE LEFT BUTTON
        //**************************************************************************
        let tdObj = this.getCurrentTechTool(); //ENABLE 状態のTOOLが存在していたら取得
        if(tdObj){
            tdObj.setPos(this.m_mousePushed_x, this.m_mousePushed_y, this.m_mouseMoving_x, this.m_mouseMoving_y);
            tdObj.setEntry(this.m_common.getPosToEntryForExt(this.m_drawInf, this.m_mousePushed_x), 
                            this.m_common.getPosToEntryForExt(this.m_drawInf, this.m_mouseMoving_x));
            if(mouse_pushed){
                this.m_fixSelected = false;
                if(this.m_trendSelectedIX < 0){
                    // 線引中状態の描画
                    tdObj.drawingLine(canvas);
                }
            } else if(tdObj.isDrawing()) {
                this.m_fixSelected = false;
                if(this.m_trendSelectedIX < 0){
                    // 線引中状態の描画
                    tdObj.drawingLine(canvas);
                }
            }
        }else{
            this.clearTechToolMousePos();
        }
        //**************************************************************************
        // [DRAW TOOL] ALL OBJECT DRAW
        //**************************************************************************
        const entry = this.m_drawToolList.length;
        for (let i = 0; i < entry; i++) {
            let tdObj = this.getTechTool(this.m_drawToolList[i].m_drawType);
            tdObj.draw(canvas, i, this.m_trendSelectedIX, this.m_fixSelected, mouse_pushed, this.m_select_x, this.m_select_y);
        }
        //**************************************************************************
        // [DRAW TOOL] SELECT DRAW TOOL OBJECT
        //**************************************************************************
        if(!mouse_pushed && !this.m_fixSelected){ //NOT LEFT BUTTON PUSHED STAT
            if(this.m_drawInf.isInnerChartArea(this.m_mouseMoving_x, this.m_mouseMoving_y)){
                this.m_trendSelectedIX = -1;
                //SELECT TRENDLINE DRAW
                for (let i = 0; i < entry; i++) {
                    if(this.checkIsTechToolOn(this.m_drawToolList[i].m_drawType)){ //ボタン押下状態時とOBJECT合致？
                        let tdObj = this.getTechTool(this.m_drawToolList[i].m_drawType);
                        if(tdObj.isSelected(i, this.m_mouseMoving_x, this.m_mouseMoving_y )){
                            tdObj.drawSelected(canvas, i);
                            this.m_trendSelectedIX = i;
                            this.saveSelectedPos();
                            break;
                        }
                    }
                }
            }
        }
        if(!mouse_pushed && this.m_fixSelected){ //固定選択の場合
            if(0 < this.m_trendSelectedIX){
                let tdObj = this.getTechTool(this.m_drawToolList[this.m_trendSelectedIX].m_drawType);
                tdObj.drawSelected(canvas, this.m_trendSelectedIX);
                this.saveSelectedPos();
            }
        }
    }
    //==============================================================================
    //	GET DRAW TOOL CLASS
    //==============================================================================
    getTechTool(type) {
        if (0 <= type && type < this.m_techTool.length) {
            return this.m_techTool[type];
        }
        return null;  
    }
    getCurrentTechTool() {
        const info = this.m_common.m_info;
        const techToolType = info.isTechTool();
        if(techToolType <= CD.TECH_TOOL_UNSET || CD.TECH_TOOL_MAX <= techToolType) {
            return null;
        }
        return this.m_techTool[techToolType];
    }
    checkIsTechToolOn(type) {
        const info = this.m_common.m_info;
        const techToolType = info.isTechTool();
        return (techToolType === type) ? true : false;
    }
    saveSelectedPos() {
        this.m_select_x = this.m_mouseMoving_x;
        this.m_select_y = this.m_mouseMoving_y;
    }
    getPosToEntryForMinus(x) {
        let xbgn = this.m_drawInf.getChartAreaBgnPosX();
        let xend = this.m_drawInf.getChartAreaEndPosX();
        //let ybgn = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        //let yend = this.m_drawInf.getChartAreaEndPosYWithMgn();
        let info = this.m_common.m_info;
        let bgn_entry = info.getBeginIndex();
        let last_entry = info.getLastIndex();
        if(0 < x) {
            return this.m_common.getPosToEntryForExt(this.m_drawInf, x);
        }
        let true_length = Math.abs(x) + xbgn;
        let entry = 0;
        if(true_length < xend - xbgn){
            let wk_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, true_length);
            entry = bgn_entry - (wk_entry - bgn_entry);
        }else{
            let cnt = 0;
            let wk_len = xend - xbgn;
            while(wk_len <= true_length){
                true_length -= wk_len;
                cnt++;
                if(true_length < wk_len){
                    break;
                }
            }
            let wk_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, true_length);
            entry = bgn_entry - ((wk_entry - bgn_entry) + ((last_entry - bgn_entry) * cnt));
        }
        if(entry < 0){
            entry = 0;
        }
        return entry;
    }
    //==============================================================================
    //	[描画] CHECK ABLE TO MOVE OBJECT(TRENDLINE)
    //==============================================================================
    chkAbleToMove(start, end) {
        let ret = true;
        let xbgn = this.m_drawInf.getChartAreaBgnPosX();
        let xend = this.m_drawInf.getChartAreaEndPosX();
        let ybgn = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let yend = this.m_drawInf.getChartAreaEndPosYWithMgn();
    
        //CHECK OUT OF DRAW AREA(LEFT)
        if(start.x < xbgn){
            ret = false;
        }
        //CHECK OUT OF DRAW AREA(RIGHT)
        let end_x = xend;
        if(end_x < end.x){
            ret = false;
        }
        let dummy_end = xbgn + this.m_common.m_info.getDummyEntryWidth();
        if(start.x < dummy_end){
            ret = false;
        }
        //CHECK OUT OF DRAW AREA(UPPER)
        if(end.y < ybgn && start.y < ybgn){
            ret = false;
        }
        //CHECK OUT OF DRAW AREA(BOTTOM)
        let end_y = yend;
        if(end_y < start.y && end_y < end.y){
            ret = false;
        }
        return ret;
    }
    chkAbleToMoveForEntry(startEntry, endEntry) {
        let info = this.m_common.m_info;
        let bgn_entry = info.getBeginIndex();
        let last_entry = info.getLastIndex();
        if(startEntry < 0){
            return false;
        }
        if(last_entry < endEntry){
            return false;
        }
        return true;
    }
    //==============================================================================
    //	[DRAW TOOL] OBJECT ALL CLEAR
    //==============================================================================
    clearAllObject() {
        this.m_drawToolList.length = 0;
        this.clearTechToolMousePos();
    }
    //==============================================================================
    //	DRAW TOOL MOUSE POSITION CLEAR
    //==============================================================================
    clearTechToolMousePos() {
        this.m_mousePushed_x = -1;
        this.m_mousePushed_y = -1;
        this.m_mouseMoving_x = -1;
        this.m_mouseMoving_y = -1;
        this.m_drawInf.setMousePos(0, 0);
    }
    //==============================================================================
    //	DRAW TOOL COMMAND EVENT
    //==============================================================================
    clearOn(type) {
        if(this.m_fixSelected){
            this.m_techTool[type].remove(this.m_trendSelectedIX);
        }else{
            this.m_techTool[type].removeAll();
        }
        this.m_fixSelected = false;
        this.m_trendSelectedIX = -1;
    }
    //==============================================================================
    //	DRAW TOOL ADD EVENT
    //==============================================================================
    addObject(xPos, yPos) {
        let info = this.m_common.m_info;
        let dummy = info.getDummyEntryWidth();
        let xbgn = this.m_drawInf.getChartAreaBgnPosX() + dummy;
        let xend = this.m_drawInf.getChartAreaEndPosX();
        let ybgn = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let yend = this.m_drawInf.getChartAreaEndPosYWithMgn();
    
        this.m_mouseMoving_x = xPos;
        this.m_mouseMoving_y = yPos;
    
        if(xPos < xbgn){
            this.m_mouseMoving_x = xbgn;
        }else if(xend < xPos){
            this.m_mouseMoving_x = xend;
        }
        if(yPos < ybgn){
            this.m_mouseMoving_y = ybgn;
        }else if(yend < yPos){
            this.m_mouseMoving_y = yend;
        }
    
        if(0 < this.m_mousePushed_x && 0 < this.m_mousePushed_y){
            let tdObj = this.getCurrentTechTool();
            tdObj.add(
                this.getPosToEntryForMinus(this.m_mousePushed_x),
                this.m_drawInf.cnvPosYToValue(this.m_mousePushed_y),
                this.getPosToEntryForMinus(this.m_mouseMoving_x),
                this.m_drawInf.cnvPosYToValue(this.m_mouseMoving_y)
            );
            this.clearTechToolMousePos();
            //m_trendSelectedIX = mTechToolVec.size()-1;
            //m_fixSelected = true;
        }
    }
    ////////////////////////////////////////////////////////////////////////////////
    // UI EVENT
    ////////////////////////////////////////////////////////////////////////////////
    //==============================================================================
    //	UI EVENT [MOUSE LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        let info = this.m_common.m_info;
        if (!info.isTechToolOn()) {
            this.clearTechToolMousePos();
            return false;
        }
        if(this.m_drawInf.isInnerChartAreaWithMgn(x, y)){
            if(this.m_drawInf.getChartAreaBgnPosX() + info.getDummyEntryWidth() <= x){
                this.m_mousePushed_x = x;
                this.m_mousePushed_y = y;
                this.m_mouseMoving_x = x;
                this.m_mouseMoving_y = y;
                return true;
            }
        }
        this.clearTechToolMousePos();
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE ON PUSHED]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        let info = this.m_common.m_info;
        if (!info.isTechToolOn()) {
            this.clearTechToolMousePos();
            return false;
        }
    
        let dummy = info.getDummyEntryWidth();
        let xbgn = this.m_drawInf.getChartAreaBgnPosX() + dummy;
        let xend = this.m_drawInf.getChartAreaEndPosX();
        let ybgn = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let yend = this.m_drawInf.getChartAreaEndPosYWithMgn();
    
        this.m_mouseMoving_x = x;
        this.m_mouseMoving_y = y;
    
        if(x < xbgn){
            this.m_mouseMoving_x = xbgn;
        }else if(xend < x){
            this.m_mouseMoving_x = xend;
        }
        if(y < ybgn){
            this.m_mouseMoving_y = ybgn;
        }else if(yend < y){
            this.m_mouseMoving_y = yend;
        }
    

        //既に左押下済 && 今回押下状態解除検出
        // QuteやWin32と異なりMOVEではマウスの解除が検出出来ない(イベントのパラメータにない)
        // if(this.m_mousePushed_x != -1){
        //     //移動中からのボタンを離した状態か判定
        //     if(info.isTrendLine() && 0 <= this.m_trendSelectedIX){
        //         //移動キャンセル
        //         this.m_trendSelectedIX = -1;
        //         this.clearTechToolMousePos();
        //     }else{
        //         this.addObject(x, y);
        //     }
        //     this.clearTechToolMousePos();
        //     return false;
        // }
        return true;
    }
    //==============================================================================
    //	UI EVENT [MOUSE BUTTON UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        let info = this.m_common.m_info;
        if(!info.isTechToolOn()){
            this.clearTechToolMousePos();
            return false;
        }
        if(this.m_mousePushed_x !== -1){
            // ENABLE 状態のTOOL取得
            let tdObj = this.getCurrentTechTool();
            if(tdObj){
                const tool_type = tdObj.getType();
                // 移動中からのボタンを離した状態か判定
                if((tool_type === CD.TECH_TOOL_TREND ||
                    tool_type === CD.TECH_TOOL_FIBOFAN ||
                    tool_type === CD.TECH_TOOL_FIBOARC ||
                    tool_type === CD.TECH_TOOL_FIBOCIRCLE ||
                    tool_type === CD.TECH_TOOL_FIBOCHANNEL ||
                    tool_type === CD.TECH_TOOL_GANANGLE ||
                    tool_type === CD.TECH_TOOL_GANBOX ||
                    tool_type === CD.TECH_TOOL_PITCH_FORK ||
                    tool_type === CD.TECH_TOOL_PITCH_FORK_EX                  
                    ) && 0 <= this.m_trendSelectedIX) {
                    if(0 < this.m_mousePushed_x && 0 < this.m_mousePushed_y){
                        if (tdObj.isInnerDustBox(x, y)) {
                            tdObj.remove(this.m_trendSelectedIX, tdObj.getType());
                            this.clearTechToolMousePos();
                            return false;
                        }
                        //CHECK BE ABLE TO DRAW
                        if (this.chkAbleToMove(tdObj.m_selectedStart, tdObj.m_selectedEnd)) {
                            tdObj.move(
                                this.m_trendSelectedIX,
                                this.getPosToEntryForMinus(tdObj.m_selectedStart.x),
                                this.m_drawInf.cnvPosYToValue(tdObj.m_selectedStart.y),
                                this.getPosToEntryForMinus(tdObj.m_selectedEnd.x),
                                this.m_drawInf.cnvPosYToValue(tdObj.m_selectedEnd.y)
                            );
                        }
                    }
                } else if (tool_type === CD.TECH_TOOL_GANFAN && 0 <= this.m_trendSelectedIX) {
                    if(0 < this.m_mousePushed_x && 0 < this.m_mousePushed_y){
                        if (tdObj.isInnerDustBox(x, y)) {
                            tdObj.remove(this.m_trendSelectedIX, tdObj.getType());
                            this.clearTechToolMousePos();
                            return false;
                        }
                        tdObj.move(
                            this.m_trendSelectedIX,
                            this.getPosToEntryForMinus(this.m_mouseMoving_x),
                            this.m_drawInf.cnvPosYToValue(this.m_mouseMoving_y),
                            this.getPosToEntryForMinus(this.m_mouseMoving_x),
                            this.m_drawInf.cnvPosYToValue(this.m_mouseMoving_y)
                        );
                    }
                } else if ((tool_type === CD.TECH_TOOL_RETRACE || tool_type === CD.TECH_TOOL_RETRACE_5)
                         && 0 <= this.m_trendSelectedIX) {
                    if (0 < this.m_mousePushed_x && 0 < this.m_mousePushed_y) {
                        if (tdObj.isInnerDustBox(x, y)) {
                            tdObj.remove(this.m_trendSelectedIX, tdObj.getType());
                            this.clearTechToolMousePos();
                            return false;
                        }
                        const newPos = tdObj.getNewEPosForMove(this.m_trendSelectedIX);
                        const startEntry = newPos[0];
                        const endEntry = newPos[1];
                        if (this.chkAbleToMoveForEntry(startEntry, endEntry)) {
                            tdObj.move(
                                this.m_trendSelectedIX,
                                this.getPosToEntryForMinus(startEntry),
                                this.getPosToEntryForMinus(endEntry)
                            );
                        }
                    }
                } else if (tool_type === CD.TECH_TOOL_COUNTER && 0 <= this.m_trendSelectedIX) {
                    if (0 < this.m_mousePushed_x && 0 < this.m_mousePushed_y) {
                        if (tdObj.isInnerDustBox(x, y)) {
                            tdObj.remove(this.m_trendSelectedIX, tdObj.getType());
                            this.clearTechToolMousePos();
                            return false;
                        }
                        const newPos = tdObj.getNewEPosForMove(this.m_trendSelectedIX);
                        const startEntry = newPos[0];
                        const startPosY = newPos[1];
                        const endEntry = newPos[2];
                          if (this.chkAbleToMoveForEntry(startEntry, endEntry)) {
                            tdObj.move(
                                this.m_trendSelectedIX,
                                this.getPosToEntryForMinus(startEntry),
                                this.m_drawInf.cnvPosYToValue(startPosY),
                                this.getPosToEntryForMinus(endEntry)
                            );
                        }
                    }
                } else if (tool_type === CD.TECH_TOOL_FIBOTIME && 0 <= this.m_trendSelectedIX) {
                    if (0 < this.m_mousePushed_x && 0 < this.m_mousePushed_y) {
                        if (tdObj.isInnerDustBox(x, y)) {
                            tdObj.remove(this.m_trendSelectedIX, tdObj.getType());
                            this.clearTechToolMousePos();
                            return false;
                        }
                        if (x === this.m_mousePushed_x && y === this.m_mousePushed_y) {
                            // 同じ場所でクリックしただけなので無視
                        } else {
                            //if (this.chkAbleToMoveForEntry(startEntry, endEntry)) {
                                tdObj.move(
                                    this.m_trendSelectedIX,
                                    this.getPosToEntryForMinus(this.m_mouseMoving_x)
                                );
                            //}
                        }
                    }
                } else if (tool_type === CD.TECH_TOOL_PENTAGON && 0 <= this.m_trendSelectedIX) {
                    if (0 < this.m_mousePushed_x && 0 < this.m_mousePushed_y) {
                        if (tdObj.isInnerDustBox(x, y)) {
                            tdObj.remove(this.m_trendSelectedIX, tdObj.getType());
                            this.clearTechToolMousePos();
                            return false;
                        }
                        if (x === this.m_mousePushed_x && y === this.m_mousePushed_y) {
                            // 同じ場所でクリックしただけなので無視
                        } else {
                            tdObj.move(
                                this.m_trendSelectedIX,
                                this.getPosToEntryForMinus(x),
                                this.m_drawInf.cnvPosYToValue(tdObj.m_selectedStart.y),
                                this.getPosToEntryForMinus(x),
                                this.m_drawInf.cnvPosYToValue(tdObj.m_selectedEnd.y)
                            );
                        }
                    }
                } else {
                    // =================　追加処理 =================
                    if (tool_type === CD.TECH_TOOL_PITCH_FORK || tool_type === CD.TECH_TOOL_PITCH_FORK_EX || tool_type === CD.TECH_TOOL_FIBOCHANNEL) {
                        // 3点方式
                        if (0 <= tdObj.m_drawSecond.x && 0 <= tdObj.m_drawSecond.y) {
                            this.addObject(x, y);
                        }else{
                            if (0 < this.m_mousePushed_x && 0 < this.m_mousePushed_y) {
                                if(this.m_mousePushed_x === x && this.m_mousePushed_y === y){
                                    this.clearTechToolMousePos();
                                    tdObj.clearPos();
                                    return true;
                                }
                                // クリアせずにリターン
                                tdObj.m_drawSecond.x = x;
                                tdObj.m_drawSecond.y = y;
                                return true;
                            }
                        }
                    }else{
                        // 2点方式(通常)
                        if (tool_type === CD.TECH_TOOL_FIBOTIME){
                            // 同じ場所でのPUSHを許容しない(メニュー選択時のイベント誤認回避)暫定
                            if (this.m_mousePushed_x !== this.m_mouseMoving_x) {
                                this.addObject(x, y);
                            }
                        }else{
                            this.addObject(x, y);
                        }
                    }
                }
            }
            // 描画クリア
            this.clearTechToolMousePos();
            // ボタンを離した後再度選択判定するため
            this.uiEvtMouseMovePerformed(x, y);
            return true;
        }
        this.m_fixSelected = false;
        return false;
    }
    //==============================================================================
    //	UI EVENT [DLETE KEY UP]
    //==============================================================================
    uiEvtDeleteKeyUpPerformed() {
        const info = this.m_common.m_info;
        if (!info.isTechToolOn()) {
            return false;
        }
        if (this.m_mousePushed_x !== -1) {
            let tdObj = this.getCurrentTechTool();
            tdObj.remove(this.m_trendSelectedIX, tdObj.getType());
            this.clearTechToolMousePos();
            return true;
        } else if (!this.m_fixSelected) { //NOT LEFT BUTTON PUSHED STAT
            if(this.m_drawInf.isInnerChartArea(this.m_mouseMoving_x, this.m_mouseMoving_y)){
                this.m_trendSelectedIX = -1;
                const entrySize = this.m_drawToolList.length;
                for (let i = 0; i < entrySize; i++) {
                    if(this.checkIsTechToolOn(this.m_drawToolList[i].m_drawType)){
                        let tdObj = this.getTechTool(this.m_drawToolList[i].m_drawType);
                        if(tdObj.isSelected(i, this.m_mouseMoving_x, this.m_mouseMoving_y )){
                            tdObj.remove(i, this.m_drawToolList[i].m_drawType);
                            this.clearTechToolMousePos();
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}

