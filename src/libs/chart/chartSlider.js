import * as CD from './chartDef';

export default class ChartSlider {
	constructor() {
        this.m_xpos_1 = 0;
        this.m_ypos_1 = 0;
        this.m_xpos_2 = 0;
        this.m_ypos_2 = 0;
        
        this.m_lbt_xpos_1 = 0;	// 最左部位置情報
        this.m_lbt_ypos_1 = 0;
        this.m_lbt_xpos_2 = 0;
        this.m_lbt_ypos_2 = 0;
    
        this.m_rbt_xpos_1 = 0;	// 最右部位置情報
        this.m_rbt_ypos_1 = 0;
        this.m_rbt_xpos_2 = 0;
        this.m_rbt_ypos_2 = 0;
    
        this.m_cur_pos;
        this.m_curValue = 50;
        this.m_orgValue = 0;
    
        this.m_scaleMax = 100;  // 最大値
        this.m_scaleMin = 1;    // 最小値
        this.m_inc = 0;		    // 加減値
        this.m_dec = 1;       // パラメータ乗数
        this.m_mouse_pushed = false; // スライダー押下状態
        this.m_lbtn_pushed = false;  // 左ボタン押下状態
        this.m_rbtn_pushed = false;	 // 右ボタン押下状態
        this.m_mode = false;		 // FALSE:FIXED

        this.m_decPoint = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];
    }
    //==============================================================================
    //  初期化
    //==============================================================================
    init(min, max, inc, param, dec = 0) {
        this.m_scaleMin = min;
        this.m_scaleMax = max;
        this.m_inc = inc;
        this.m_dec = dec;
        //m_cur_pos = GetValueToPos(param);
        this.m_orgValue = this.m_curValue = param;
        //this.m_drawParam = drawParam;

        // パラボリックはdec=3となり値が1000倍されて渡るので、表示は1/1000にする必要がある
    }
    reset() {
        this.m_curValue = this.m_orgValue;
    }
    getCurValue() {
        return this.m_curValue;
    }
    setCurValue(val) {
        this.m_curValue = val;
    }
    //==============================================================================
    //	[描画]メイン
    //==============================================================================
    draw(rc, canvas) {
        const BTN_WIDTH = 16;

        //横位置情報セット
        this.m_lbt_xpos_1 = rc.left;
        this.m_lbt_xpos_2 = this.m_lbt_xpos_1 + BTN_WIDTH;
    
        this.m_xpos_1 = this.m_lbt_xpos_2 + 5;
        this.m_xpos_2 = rc.right - (BTN_WIDTH + 3);
    
        this.m_rbt_xpos_1 = this.m_xpos_2 + 6;
        this.m_rbt_xpos_2 = this.m_rbt_xpos_1 + BTN_WIDTH;
    
        //描画処理
        const sliderColor = 'rgb(100, 100, 100)';
        const btnNmlColor = 'rgb(0,0,0)';
        const btnPushColor = 'rgb(80,190,220)';
        const btnStrColor = 'rgb(200,200,200)';

        //スライダー本体
        let slider_heigth = 12;
        this.m_ypos_1 = rc.top + (((rc.bottom - rc.top) >> 1) - (slider_heigth >> 1));
        this.m_ypos_2 = this.m_ypos_1 + slider_heigth;
        this.m_cur_pos = this.getValueToPos(this.m_curValue);
        if (this.m_xpos_1 < this.m_cur_pos) {
            const gradColor = ["rgb(80, 190, 220", "rgb(80, 190, 220)", "rgb(30, 140, 170)"];
            canvas.drawGradient(gradColor, this.m_xpos_1, this.m_ypos_1, this.m_cur_pos, this.m_ypos_2);
        }
        if (this.m_cur_pos < this.m_xpos_2) {
            const gradColor = ["rgb(20,20,20)", "rgb(30,30,30)", "rgb(50,50,50)"];
            canvas.drawGradient(gradColor, this.m_cur_pos, this.m_ypos_1, this.m_xpos_2, this.m_ypos_2);
        }
        {
            let x1 = this.m_cur_pos - 5;
            let y1 = this.m_ypos_1 - 5;
            let x2 = x1 + 10;
            let y2 = this.m_ypos_2 + 5;
           canvas.drawGradFill(x1, y1, x2, y2);       
           canvas.drawLine(sliderColor, x1, y1, x2, y1);
           canvas.drawLine(sliderColor, x1, y1, x1, y2);
        }
    
        let height = this.m_ypos_1 + ((this.m_ypos_2 - this.m_ypos_1) >> 1);
        //左ボタン(-)
        this.m_lbt_ypos_1 = height - 8;
        this.m_lbt_ypos_2 = height + 12;
        if(this.m_lbtn_pushed){
            //PUSHED
            canvas.drawGradFill(this.m_lbt_xpos_1, this.m_lbt_ypos_1, this.m_lbt_xpos_2, this.m_lbt_ypos_2);          
            canvas.drawLine(sliderColor, this.m_lbt_xpos_1, this.m_lbt_ypos_2, this.m_lbt_xpos_2, this.m_lbt_ypos_2);
            canvas.drawLine(sliderColor, this.m_lbt_xpos_2, this.m_lbt_ypos_1, this.m_lbt_xpos_2, this.m_lbt_ypos_2);
            canvas.drawBtnString("＋", (this.m_lbt_xpos_1 + this.m_lbt_xpos_2) >> 1, this.m_lbt_ypos_1, btnPushColor);
        }else{
            canvas.drawGradFill(this.m_lbt_xpos_1, this.m_lbt_ypos_1, this.m_lbt_xpos_2, this.m_lbt_ypos_2);
            canvas.drawLine(sliderColor, this.m_lbt_xpos_1, this.m_lbt_ypos_1, this.m_lbt_xpos_2, this.m_lbt_ypos_1);
            canvas.drawLine(sliderColor, this.m_lbt_xpos_1, this.m_lbt_ypos_1, this.m_lbt_xpos_1, this.m_lbt_ypos_2);
            canvas.drawBtnString("－", (this.m_lbt_xpos_1 + this.m_lbt_xpos_2) >> 1, this.m_lbt_ypos_1, btnStrColor);
        }
    
        //右ボタン(+)
        this.m_rbt_ypos_1 = height - 8;
        this.m_rbt_ypos_2 = height + 12;
        if(this.m_rbtn_pushed){
            //PUSHED
            canvas.drawGradFill(this.m_rbt_xpos_1, this.m_rbt_ypos_1, this.m_rbt_xpos_2, this.m_rbt_ypos_2);          
            canvas.drawLine(sliderColor, this.m_rbt_xpos_1, this.m_rbt_ypos_2, this.m_rbt_xpos_2, this.m_rbt_ypos_2);
            canvas.drawLine(sliderColor, this.m_rbt_xpos_2, this.m_rbt_ypos_1, this.m_rbt_xpos_2, this.m_rbt_ypos_2);
            canvas.drawBtnString("＋", (this.m_rbt_xpos_1 + this.m_rbt_xpos_2) >> 1, this.m_rbt_ypos_1, btnPushColor);
        }else{
            canvas.drawGradFill(this.m_rbt_xpos_1, this.m_rbt_ypos_1, this.m_rbt_xpos_2, this.m_rbt_ypos_2);          
            canvas.drawLine(sliderColor, this.m_rbt_xpos_1, this.m_rbt_ypos_1, this.m_rbt_xpos_2, this.m_rbt_ypos_1);
            canvas.drawLine(sliderColor, this.m_rbt_xpos_1, this.m_rbt_ypos_1, this.m_rbt_xpos_1, this.m_rbt_ypos_2);
            canvas.drawBtnString("＋", (this.m_rbt_xpos_1 + this.m_rbt_xpos_2) >> 1, this.m_rbt_ypos_1, btnStrColor);
        }

        {
            let x1 = this.m_rbt_xpos_2 + 10;
            let y1 = this.m_ypos_1 - 2;
            let x2 = x1 + 40;
            let y2 = y1 + 20;
            //let strBackColor = 'rgb(50,50,50)';
            let strBackColor = 'rgb(50,50,50)';
            let strokColor = 'rgb(100,100,100)';
            let lineWidth = 1;
            canvas.drawFill (strBackColor, x1, y1, x2, y2);
            // canvas.drawBoldLine(strokColor, lineWidth, x1, y1, x2, y1);
            // canvas.drawBoldLine(strokColor, lineWidth, x1, y1, x1, y2);
            // canvas.drawBoldLine(strokColor, lineWidth, x1, y2, x2, y2);
            // canvas.drawBoldLine(strokColor, lineWidth, x2, y1, x2, y2);
            canvas.drawBoldLine(strokColor, 0.8, x1-0.8, y1-0.8, x1-0.8, y2-0.8);
            canvas.drawBoldLine(strokColor, 0.8, x1-0.8, y2-0.8, x2-0.8, y2-0.8);
            let value = this.m_curValue;
            if (0 < this.m_dec) {
                value /= this.m_decPoint[this.m_dec];
                value = value.toFixed(this.m_dec);
            }
            canvas.drawBtnString('' + value, (x1 + x2) >> 1, y1 + 2, "white");
         }
    }
    //==============================================================================
    //  値変換(値→XPOS)
    //==============================================================================
    getValueToPos(val) {
        if (this.m_scaleMax === val) return this.m_xpos_2;
        if (this.m_scaleMin === val) return this.m_xpos_1;
        let width = this.m_xpos_2 - this.m_xpos_1;
        let x = (width * val / this.m_scaleMax) >> 0;
        return this.m_xpos_1 + x;
    }
    //==============================================================================
    //  値変換(XPOS→値)
    //==============================================================================
    getPosToValue(pos) {
        if (pos <= this.m_xpos_1) return this.m_scaleMin;
        if (this.m_xpos_2 <= pos) return this.m_scaleMax;
        let range = this.m_scaleMax - this.m_scaleMin;
        let pos_val = pos - this.m_xpos_1;
        let value = (range * pos_val / (this.m_xpos_2 - this.m_xpos_1)) >> 0;
        return value;
    }
    //==============================================================================
    //	カレントポジション更新
    //==============================================================================
    updateParamPos(x){
        //ポジション→値変換
        let value = this.getPosToValue(x);
        if(this.m_scaleMax < value){
            value = this.m_scaleMax;
        }else if(value < this.m_scaleMin){
            value = this.m_scaleMin;
        }
        this.m_curValue = value;
    }
    //==============================================================================
    //	カレント値加算
    //==============================================================================
    incValue() {
        if(this.m_curValue + this.m_inc <= this.m_scaleMax){
            this.m_curValue += this.m_inc;
        }else{
            this.m_curValue = this.m_scaleMax;
        }
        return;
    }
    //==============================================================================
    //	カレント値減算
    //==============================================================================
    decValue(){
        if(this.m_scaleMin <= this.m_curValue - this.m_inc){
            this.m_curValue -= this.m_inc;
        }else{
            this.m_curValue = this.m_scaleMin;
        }
        return;
    }
    //==============================================================================
    //	エリア内判定
    //==============================================================================
    isInnerBarArea(x, y) {
        if ((this.m_xpos_1 <= x) && (x <= this.m_xpos_2)) {
            if ((this.m_rbt_ypos_1 <= y) && (y <= this.m_rbt_ypos_2)) {
                return true;
            }
        }
        return false;
    }
    isInnerArea(x, y) {
        if ((this.m_cur_pos - 5 <= x) && (x <= this.m_cur_pos + 5)) {
            if ((this.m_ypos_1 - 5 <= y) && (y <= this.m_ypos_2 + 5)) {
                return true;
            }
        }
        return false;
    }
    isInnerLeftBtn(x, y) {
        if ((this.m_lbt_xpos_1 <= x) && (x <= this.m_lbt_xpos_2)) {
            if ((this.m_lbt_ypos_1 <= y) && (y <= this.m_lbt_ypos_2)) {
                return true;
            }
        }
        return false;
    }
    isInnerRightBtn(x, y) {
        if ((this.m_rbt_xpos_1 <= x) && (x <= this.m_rbt_xpos_2)) {
            if ((this.m_rbt_ypos_1 <= y) && (y <= this.m_rbt_ypos_2)) {
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        let stat = false;
        if (this.isInnerArea(x, y)) {
            this.m_mouse_pushed = true;
            stat = true;
        } else {
            this.m_mouse_pushed = false;
        }
        if (this.isInnerLeftBtn(x, y)) {
            this.m_lbtn_pushed = true;
            stat = true;
        } else {
            this.m_lbtn_pushed = false;
        }
        if (this.isInnerRightBtn(x, y)) {
            this.m_rbtn_pushed = true;
            stat = true;
        } else {
            this.m_rbtn_pushed = false;
        }
        return stat;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE ON PUSHED]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        // if (!push_stat) {
        //     m_mouse_pushed = false;
        //     m_lbtn_pushed = false;
        //     m_rbtn_pushed = false;
        //     return false;
        // }
        if (this.m_mouse_pushed) {
            this.updateParamPos(x);
            return true;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE BUTTON UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        if (this.m_mouse_pushed) {
            this.m_mouse_pushed = false;
            this.m_lbtn_pushed = false;
            this.m_rbtn_pushed = false;
            return true;
        }
        if (this.m_lbtn_pushed) {
            if (this.isInnerLeftBtn(x, y)) {
                this.decValue();
            }
            this.m_mouse_pushed = false;
            this.m_lbtn_pushed = false;
            this.m_rbtn_pushed = false;
            return true;
        }
        if (this.m_rbtn_pushed) {
            if (this.isInnerRightBtn(x, y)) {
                this.incValue();
            }
            this.m_mouse_pushed = false;
            this.m_lbtn_pushed = false;
            this.m_rbtn_pushed = false;
            return true;
        }
        if (this.isInnerBarArea(x, y)) {
            this.m_curValue = this.getPosToValue(x);
            return true;
        }
        return false;
    }
}

