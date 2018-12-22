import ChartDrawInfo from './chartDrawInfo';
import * as CD from './chartDef';

export default class ChartButton {
	constructor() {
        this.m_rc = { left: 0, top: 0, right: 0, bottom: 0 }
        this.m_text = 'BUTTON';
        this.m_xpos_1 = 0;
        this.m_ypos_1 = 0;
        this.m_xpos_2 = 0;
        this.m_ypos_2 = 0;
        this.m_btn_pushed = false;		    // ボタン押下状態
        this.m_btn_over = false;			// ボタン上状態
        this.m_str_ypos_mgn = 3;
        this.m_img = null;
        this.m_img_rc = null;
    }
    init(text) {
        this.m_text = text;
    }
    setImage(src) {
        if(!src){
            this.m_img = null;
            return;
        }
        this.m_img = new Image();
        this.m_img.src = src;
    }
    setImagePos(rc) {
        this.m_img_rc = rc;
        this.m_img_rc.width =  rc.right - rc.left;
        this.m_img_rc.height = rc.bottom - rc.top;
    }
    setPos(rc) {
        this.m_rc = rc;
        this.m_rc.width = rc.right - rc.left;
        this.m_rc.height = rc.bottom - rc.top;
        this.m_rc.center = rc.left + (this.m_rc.width >> 1);
        this.m_rc.mid = rc.top + (this.m_rc.height >> 1);
        this.m_xpos_1 = this.m_rc.left;
        this.m_ypos_1 = this.m_rc.top;
        this.m_xpos_2 = this.m_rc.right;
        this.m_ypos_2 = this.m_rc.bottom;
        if(this.m_rc.height <= 15){
            this.m_str_ypos_mgn = 0;
        }
    }
    clearPos() {
        this.m_xpos_1 = 0;
        this.m_ypos_1 = 0;
        this.m_xpos_2 = 0;
        this.m_ypos_2 = 0;
    }
    draw(canvas) {
        if (this.m_btn_pushed) {
            // ボタン押下状態
            canvas.drawGradFill(this.m_rc.left, this.m_rc.top, this.m_rc.right, this.m_rc.bottom);
            // canvas.drawRect("black", this.m_rc.left + 1, this.m_rc.top + 1, this.m_rc.width + 1, this.m_rc.height + 1);
            // canvas.drawRect("rgb(50, 50, 50)", this.m_rc.left, this.m_rc.top, this.m_rc.width, this.m_rc.height);
            canvas.drawLine("rgb(50, 50, 50)", this.m_rc.left, this.m_rc.bottom, this.m_rc.right, this.m_rc.bottom);
            canvas.drawLine("rgb(50, 50, 50)", this.m_rc.right, this.m_rc.top, this.m_rc.right, this.m_rc.bottom);
            canvas.drawStringC (this.m_text, this.m_rc.center, this.m_rc.top + this.m_str_ypos_mgn, "rgb(255, 255, 255)");
            if(this.m_img !== null && 0 < this.m_img.naturalHeight){
                canvas.ctx.drawImage(this.m_img, this.m_img_rc.left, this.m_img_rc.top, this.m_img_rc.width, this.m_img_rc.height);
            }
        } else {
            // 本当は色を変える
            canvas.drawGradFill(this.m_rc.left, this.m_rc.top, this.m_rc.right, this.m_rc.bottom);
            canvas.drawLine("rgb(50, 50, 50)", this.m_rc.left, this.m_rc.top, this.m_rc.right, this.m_rc.top);
            canvas.drawLine("rgb(50, 50, 50)", this.m_rc.left, this.m_rc.top, this.m_rc.left, this.m_rc.bottom);
            canvas.drawStringC (this.m_text, this.m_rc.center, this.m_rc.top + this.m_str_ypos_mgn, "rgb(200, 200, 200)");
            if(this.m_img !== null && 0 < this.m_img.naturalHeight){
                canvas.ctx.drawImage(this.m_img, this.m_img_rc.left, this.m_img_rc.top, this.m_img_rc.width, this.m_img_rc.height);
            }
        }
    }
    //==============================================================================
    //	エリア内判定
    //==============================================================================
    isInnerBtn(x, y) {
        if (this.m_xpos_1 <= x && x <= this.m_xpos_2) {
            if (this.m_ypos_1 <= y && y <= this.m_ypos_2) {
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        if (this.isInnerBtn(x, y)) {
            this.m_btn_over = true;
            return true;
        }else{
            this.m_btn_pushed = false;
        }
        // ステータス変更を戻り値に反映
        let ret = this.m_btn_over;
        this.m_btn_over = false;
        return ret;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if(this.isInnerBtn(x, y)){
            this.m_btn_pushed = true;
            this.m_btn_over = true;
            return true;
        }
        this.m_btn_pushed = false;
        this.m_btn_over = false;
        return false;
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        if(this.isInnerBtn(x, y)){
            this.m_btn_pushed = false;
            this.m_btn_over = true;
            return true;
        }
        this.m_btn_pushed = false;
        this.m_btn_over = false;
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOVE OUT]
    //==============================================================================
    uiEvtMouseOutPerformed() {
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOVE IN]
    //==============================================================================
    uiEvtMouseInPerformed() {
        return false;
    }
}

