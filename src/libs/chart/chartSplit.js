import * as CD from './chartDef';

const SPLIT_HEIGHT = 3;
const SPLIT_TOUCH_ARROWANCE = 7;

class ChartSplit {
	constructor(drawParam) {
        this.m_upperAreaInfo = null;
        this.m_lowerAreaInfo = null;
        this.m_drawParam = drawParam;
        this.m_mouse_pushed = false;
        this.m_mouse_over = false;
    }
    init(upinf, lwinf) {
        //可変イニシャライズ
        this.m_mode = true;
        this.m_upperAreaInfo = upinf;
        this.m_lowerAreaInfo = lwinf;
    }
    //==============================================================================
    //	[描画]メイン
    //==============================================================================
    draw(canvas) {
        if(this.m_lowerAreaInfo === null){
            return;
        }
        let top = this.m_lowerAreaInfo.top + 1;
        let left = this.m_lowerAreaInfo.left;
        let right = this.m_lowerAreaInfo.right;
        let bottom = top + SPLIT_HEIGHT;

        if(this.m_mouse_over){
            canvas.drawSplitter(left, top, right, bottom);
        }else{
            let splitColor = this.m_drawParam.getColor(this.m_drawParam.m_color.SPLIT.c);
            canvas.drawLine(splitColor, left, top, right, bottom);
        }
    }
    //==============================================================================
    //	領域情報更新
    //==============================================================================
    updateHeight(y) {
        let upper_top = this.m_upperAreaInfo.top;
        let lower_btm = this.m_lowerAreaInfo.bottom;
        if (y <= upper_top) { //小さい方が上
            this.m_upperAreaInfo.bottom = upper_top;
            this.m_lowerAreaInfo.top = upper_top + 1;
        } else if(lower_btm <= y) {
            this.m_lowerAreaInfo.top = lower_btm - 1;
            this.m_upperAreaInfo.bottom = lower_btm - 1;
        } else {
            this.m_upperAreaInfo.bottom = y;
            this.m_lowerAreaInfo.top = y;
        }
    }
    //==============================================================================
    //	エリア内判定
    //==============================================================================
    isInnerArea(x, y) {
        let pos = this.m_upperAreaInfo.bottom;
        if (pos - SPLIT_TOUCH_ARROWANCE <= y && y <= pos + SPLIT_TOUCH_ARROWANCE) {
            return true;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if (this.isInnerArea(x, y)) {
            this.m_mouse_pushed = true;
            this.m_mouse_over = true;
        } else {
            this.m_mouse_pushed = false;
            this.m_mouse_over = false;
        }
        return this.m_mouse_pushed;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE ON PUSHED]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        let ret = false;
        if(this.isInnerArea(x, y)){
            this.m_mouse_over = true;
            ret = true;
        }else{
            this.m_mouse_over = false;
        }
        // if(!push_stat){
        //     this.m_mouse_pushed = false;
        //     return ret;
        // }
        if(this.m_mouse_pushed){
            this.updateHeight(y);
            return ret;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE BUTTON UP]
    //==============================================================================
    uiEvtMouseUpPerformed() {
        if(this.m_mouse_pushed){
            this.m_mouse_pushed = false;
            return true;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE OUT]
    //==============================================================================
    uiEvtMouseOutPerformed() {
        this.m_mouse_pushed = false;
        this.m_mouse_over = false;
    }
}

export default ChartSplit;
