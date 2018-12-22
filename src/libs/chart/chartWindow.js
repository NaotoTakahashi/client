import ChartButton from './chartButton';

export const OUT_OF_AREA = -1;
export const NO_EVENT = 0;
export const CLOSED_BUTTON = 1;
export const CANCEL_BUTTON = 2;
export const OK_BUTTON = 3;
export const RESET_BUTTON = 4;
export const PANEL_MOVED = 5;

export　class ChartWindow {
	constructor(chartCanvas) {
        this.m_cc = chartCanvas;
        this.m_rc = {};
        this.m_rc.left = 0;
        this.m_rc.top = 0;
        this.m_rc.right = 200;
        this.m_rc.bottom = 18;
        // 有効フラグ
        this.m_enabled = false;
        // マウスイベント情報
        this.m_mousePushed_x = -1;  // ボタン押下地点
        this.m_mousePushed_y = -1;  // ボタン押下地点
        this.m_locLeftFar_x = 0;    // 選択時左部からの距離
        this.m_locLeftFar_y = 0;    // 選択時上部からの距離
        // 描画位置情報
        this.m_locTop = 0; 	        // 描画開始位置(Y)
        this.m_locLeft = 0; 	    // 描画開始位置(X)
        this.m_barWidth = 400; 	    // 描画バー幅
        this.m_barHeight = 35;      // 描画バー高
        this.m_bodyHeight = 390;    // 描画ボディー部高
        // ボタン
        this.m_btnClose = new ChartButton();
        this.m_btnClose.init("ｘ");
        this.m_btnOK = new ChartButton();
        this.m_btnOK.init("OK");   
        this.m_btnCancel = new ChartButton();
        this.m_btnCancel.init("キャンセル");
        // 背景
        this.m_backGroundColor = 'black';
    }
    setCanvas(chartCanvas) {
        this.m_cc = chartCanvas;
    }
    setEnabled(boolVal) {
        this.m_enabled = boolVal;
    }
    setSize(w, h) {
        this.m_barWidth = w;
        this.m_bodyHeight = h;
    }
    setBackGroundColor(color) { this.m_backGroundColor = color; }
    isEnabled() {
        return this.m_enabled;
    }
    getCurrentRect() {
        return {left: this.m_locLeft, 
                top: this.m_locTop,
                right: this.m_locLeft + this.m_barWidth,
                btoom: this.m_locTop + this.m_barHeight + this.m_bodyHeight };
    }
    draw(rc) {
        if (!this.m_enabled) {
            return;
        }

        if (this.m_locLeft < 0) this.m_locLeft = 0;
        if (this.m_locTop < rc.top) this.m_locTop = rc.top;
        if (rc.bottom < this.m_locTop + this.m_barHeight) this.m_locTop = rc.bottom - this.m_barHeight;
        if (rc.right < this.m_locLeft + this.m_barWidth) this.m_locLeft = rc.right - this.m_barWidth;

        let x1 = this.m_locLeft, y1 = this.m_locTop, x2 = x1 + this.m_barWidth, y2 = y1 + this.m_barHeight;
        this.m_cc.drawFill(this.m_backGroundColor, x1, y1, x2, y2);
        y1 = y2;
        y2 = y1 + this.m_bodyHeight;
        this.m_cc.drawFill(this.m_backGroundColor, x1, y1, x2, y2);
        this.m_cc.drawThinLine('rgb(255,255,255)', x1, y1, x2, y1);

        // 外枠
        y1 = this.m_locTop;
        y2 = y1 + this.m_barHeight + this.m_bodyHeight;
        const lineColor = 'rgb(150,150,150)';
        this.m_cc.drawThinLine(lineColor, x1, y1, x1, y2);
        this.m_cc.drawThinLine(lineColor, x1, y1, x2, y1);
        this.m_cc.drawThinLine(lineColor, x2, y1, x2, y2);
        this.m_cc.drawThinLine(lineColor, x2, y2, x1, y2);

        let right = this.m_locLeft + this.m_barWidth;

        // クローズボタン
        {
            let btnWidth = 20;
            let btnHeight = 20;
            let btnBgnPosX = right - 24;
            let btnBgnPosY = this.m_locTop+5;
            let btn_rc = { left: btnBgnPosX, top: btnBgnPosY, right: btnBgnPosX + btnWidth, bottom: btnBgnPosY + btnHeight }
            this.m_btnClose.setPos(btn_rc);
            this.m_btnClose.draw(this.m_cc);
        }
        // OKボタン
        {
            let btnWidth = 80;
            let btnHeight = 20;
            let btnBgnPosX = right - btnWidth - btnWidth - 20;
            let btnBgnPosY = (this.m_locTop + this.m_barHeight + this.m_bodyHeight) - (btnHeight + 10);
            let btn_rc = { left: btnBgnPosX, top: btnBgnPosY, right: btnBgnPosX + btnWidth, bottom: btnBgnPosY + btnHeight }
            this.m_btnOK.setPos(btn_rc);
            this.m_btnOK.draw(this.m_cc);
        }
        // キャンセルボタン
        {
            let btnWidth = 80;
            let btnHeight = 20;
            let btnBgnPosX = right - btnWidth - 10;
            let btnBgnPosY = (this.m_locTop + this.m_barHeight + this.m_bodyHeight) - (btnHeight + 10);
            let btn_rc = { left: btnBgnPosX, top: btnBgnPosY, right: btnBgnPosX + btnWidth, bottom: btnBgnPosY + btnHeight }
            this.m_btnCancel.setPos(btn_rc);
            this.m_btnCancel.draw(this.m_cc);
        }
    }
    //==============================================================================
    //  初期表示位置設定
    //==============================================================================
    setInitPosition(x, y) {
        this.m_locLeft = x;
        this.m_locTop = y;
    }
    //==============================================================================
    //	ボタン押下状態問合せ
    //==============================================================================
    getBtnPushStatus() {
        if (-1 < this.m_mousePushed_x) {
            return true;
        }
        return false;
    }
    //==============================================================================
    //  マウスエリア内判定
    //==============================================================================
    innerPartOfBar(x, y) {
        if ((this.m_locLeft < x) && (x < this.m_locLeft + this.m_barWidth)) {
            if ((this.m_locTop < y) && (y < this.m_locTop + this.m_barHeight)) {
                return true;
            }
        }
        return false;
    }
    innerPartOfBarAndBody(x, y) {
        let width = this.m_barWidth;
        let height = this.m_barHeight + this.m_bodyHeight;
        if ((this.m_locLeft < x) && (x < this.m_locLeft + width)) {
            if ((this.m_locTop < y) && (y < this.m_locTop + height)) {
                return true;
            }
        }
        return false;
    }
    innerPartOfBarButton(x, y) {
        if ((this.m_btnPosx < x) && (x < this.m_btnPosx + this.m_btnWidth)) {
            if ((this.m_btnPosy < y) && (y < this.m_btnPosy + this.m_btnHeight)) {
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        if (!this.m_enabled) {
            return false;
        }
        let stat = false;
        // クローズボタン
        if (this.m_btnClose.uiEvtMouseMovePerformed(x, y)) {
            stat = true;
        }
        // OKボタン
        if (this.m_btnOK.uiEvtMouseMovePerformed(x, y)) {
            stat = true;
        }
        // キャンセルボタン
        if (this.m_btnCancel.uiEvtMouseMovePerformed(x, y)) {
            stat = true;
        }
        if(stat){
            return true;
        }
        //既に左押下済 && 今回押下状態
        if (this.m_mousePushed_x !== -1) {
            this.m_locLeft = x - this.m_locLeftFar_x;
            this.m_locTop = y - this.m_locLeftFar_y;
            return true;
        }
        if (this.innerPartOfBar(x, y)) {
            return true;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if (!this.m_enabled) {
            return false;
        }
        let stat = false;
        // クローズボタン
        if (this.m_btnClose.uiEvtMouseLeftPerformed(x, y)) {
            stat = true;
        }
        // OKボタン
        if (this.m_btnOK.uiEvtMouseLeftPerformed(x, y)) {
            stat = true;
        }
        // キャンセルボタン
        if (this.m_btnCancel.uiEvtMouseLeftPerformed(x, y)) {
            stat = true;
        }
        if(stat){
            return true;
        }
        if (this.innerPartOfBar(x, y)) {
            this.m_mousePushed_x = x;
            this.m_mousePushed_y = y;
            this.m_locLeftFar_x = x - this.m_locLeft;
            this.m_locLeftFar_y = y - this.m_locTop;
            return true;
        }
        this.m_mousePushed_x = -1;
        this.m_mousePushed_y = -1;
        this.m_locLeftFar_x = -1;
        this.m_locLeftFar_y = -1;
        return false;
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        if (!this.m_enabled) {
            return NO_EVENT;
        }
        // クローズボタン
        if (this.m_btnClose.uiEvtMouseUpPerformed(x, y)) {
            this.m_enabled = false;
            return CLOSED_BUTTON;
        }
        // OKボタン
        if (this.m_btnOK.uiEvtMouseUpPerformed(x, y)) {
            this.m_enabled = false;
            return OK_BUTTON;
        }
        // キャンセルボタン
        if (this.m_btnCancel.uiEvtMouseUpPerformed(x, y)) {
            this.m_enabled = false;
            return CANCEL_BUTTON;
        }
        if (this.m_mousePushed_x != -1) {
            this.m_mousePushed_x = -1;
            this.m_mousePushed_y = -1;
            return NO_EVENT;
        }
        if(!this.innerPartOfBarAndBody(x, y)){
            return OUT_OF_AREA;
        }
        return NO_EVENT;
    }
    //==============================================================================
    //	UI EVENT [MOVE OUT]
    //==============================================================================
    uiEvtMouseOutPerformed() {
        if (!this.m_enabled) {
            return false;
        }
        if (this.m_mousePushed_x != -1) {
            this.m_mousePushed_x = -1;
            this.m_mousePushed_y = -1;
            return false;
        }
    }
    //==============================================================================
    //	UI EVENT [MOVE IN]
    //==============================================================================
    uiEvtMouseInPerformed() {
        if (!this.m_enabled) {
            return false;
        }
        this.mMosPushStat = false;
        this.mMosPushPrvX = 0;
        return false;
    }
}

export class ChartIndexSetting extends ChartWindow {
    constructor(chartCanvas) {
        super(chartCanvas);
        this.m_areaIndex = -1;
        this.m_btnReset = new ChartButton();
        this.m_btnReset.init("初期値に戻す");
    }
    setAreaIndex(index) { this.m_areaIndex = index; }
    getAreaIndex() { return this.m_areaIndex; }
    setResetBtnName(val) { this.m_btnReset.init(val); }
    draw(rc) {
        super.draw(rc);
        // リセット(初期値に戻す)ボタン
        {
            let btnWidth = 100;
            let btnHeight = 20;
            let btnBgnPosX = this.m_locLeft + 10;
            let btnBgnPosY = (this.m_locTop + this.m_barHeight + this.m_bodyHeight) - (btnHeight + 10);
            let btn_rc = { left: btnBgnPosX, top: btnBgnPosY, right: btnBgnPosX + btnWidth, bottom: btnBgnPosY + btnHeight }
            this.m_btnReset.setPos(btn_rc);
            this.m_btnReset.draw(this.m_cc);
        }
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        if (!this.m_enabled) {
            return false;
        }
        // リセットボタン
        if (super.uiEvtMouseMovePerformed(x, y)) {
            return true;
        }
        if (this.m_btnReset.uiEvtMouseMovePerformed(x, y)) {
            return true;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if (!this.m_enabled) {
            return false;
        }
        // リセットボタン
        if (super.uiEvtMouseLeftPerformed(x, y)) {
            return true;
        }
        if (this.m_btnReset.uiEvtMouseLeftPerformed(x, y)) {
            return true;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        if (!this.m_enabled) {
            return NO_EVENT;
        }
        // リセットボタン
        let superResult = super.uiEvtMouseUpPerformed(x, y);
        if(OUT_OF_AREA === superResult){
            return superResult;
        }
        if(NO_EVENT === superResult){
            if (this.m_btnReset.uiEvtMouseUpPerformed(x, y)) {
                return RESET_BUTTON;
            }
        }
        return superResult;
    }
}