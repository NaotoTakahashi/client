import ChartButton from './chartButton';

export　default class ChartHeaderTree {
	constructor(chartCanvas) {
        this.m_cc = chartCanvas;
        this.m_rc = { left: 0, top: 0, left: 0, right: 0};
        this.m_expand = false;
        this.m_btnSetting = new Array(20);
        this.m_topString = "";
        //this.m_btnClose = new Array(20);
        for (let i = 0; i < this.m_btnSetting.length; i++) {
            this.m_btnSetting[i] = new ChartButton();
            this.m_btnSetting[i].init("");
            //this.m_btnClose[i] = new ChartButton();
            //this.m_btnClose[i].init("Ｘ");
        }
        this.m_pushIndex = -1;
    }
    draw(rc, strArray) {
        this.m_rc = rc;
        let x1 = rc.left;
        let y1 = rc.top;
        let x2 = rc.right;
        let y2 = rc.bottom;

        const btnWidth = 26;
        const btnHeight = 15;

        //this.m_cc.drawGradFill(x1, y1, x2, y2);
        let str = (this.m_expand)? '－' : '＋';
        this.m_cc.drawBtnString(str, (x1 + x2) >> 1, y1, "white");
        this.m_cc.drawStringL(this.m_topString, x2 + 7, y1 + 1, "white");
        if(this.m_expand){
            x1 += 10;
            let str_x1 = x1 + btnWidth + 2;
            for (let i = 0; i < strArray.length; ++i) {
                y1 += 17;
                this.drawSettingButton(i, x1, y1 + 1, btnWidth, btnHeight);
                this.m_cc.drawStringL(strArray[i], str_x1, y1 + 1, "white");
            }
        }
    }
    setTopString(s) {
        this.m_topString = s;
    }
    setSettingImg(src) {
        for (let i = 0; i < this.m_btnSetting.length; i++) {
            this.m_btnSetting[i].setImage(src);
        }
    }
    //==============================================================================
    //	[描画] 設定ボタン&&クロースボタン表示
    //==============================================================================
    drawSettingButton(i, btnBgnPosX, btnBgnPosY, w, h) {
        let btnWidth = w;
        let btnHeight = h;
        let center = btnWidth >> 1;
        const btn_rc = { left: btnBgnPosX, top: btnBgnPosY, right: btnBgnPosX + btnWidth, bottom: btnBgnPosY + btnHeight }
        let img_left = ((btnBgnPosX + (btnWidth >> 1)) - (btnHeight >> 1)) >> 0;
        let img_right = img_left + btnHeight;
        const img_rc = { left: img_left + 2, top: btnBgnPosY + 2, right: img_right - 2, bottom: btnBgnPosY + (btnHeight - 2) }
        this.m_btnSetting[i].setPos(btn_rc);
        this.m_btnSetting[i].setImagePos(img_rc);
        this.m_btnSetting[i].draw(this.m_cc);

        // クローズボタン(メニュー連動不可のため中止)
        //const close_rc = { left: btn_rc.right + 2, top: btnBgnPosY, right: btn_rc.right + 2 + btnWidth, bottom: btnBgnPosY + btnHeight }
        //this.m_btnClose[i].setPos(close_rc);
        //this.m_btnClose[i].draw(this.m_cc);
    }
    //==============================================================================
    //	押下インデックス取得
    //==============================================================================
    getPushIndex() {
        return this.m_pushIndex;
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
    isInner(x, y) {
        const mgn = 10;
        if (this.m_rc.left - mgn <= x && x <= this.m_rc.right + mgn) {
            if (this.m_rc.top - mgn <= y && y <= this.m_rc.bottom + mgn) {
                return true;
            }
        }
        return false;
    }
    //====================================================================
    //	設定ボタン押下イベント
    //====================================================================
    checkSettingMouseUpPerformed(x, y) {
        for (let i = 0; i < this.m_btnSetting.length; i++) {
            if(this.m_btnSetting[i].uiEvtMouseUpPerformed(x, y)) {
                this.m_pushIndex = i;
                return true;
            }
        }
        return false;
    }
    //====================================================================
    //	インデックス消去ボタン押下イベント
    //====================================================================
    checkCloseMouseUpPerformed(x, y) {
        for (let i = 0; i < this.m_btnSetting.length; i++) {
            if(this.m_btnClose[i].uiEvtMouseUpPerformed(x, y)) {
                this.m_pushIndex = i;
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        return false;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if(this.isInner(x, y)){
            this.m_expand = (this.m_expand) ? false :true;
            return true;
        }
        for (let i = 0; i < this.m_btnSetting.length; i++) {
            this.m_btnSetting[i].uiEvtMouseLeftPerformed(x, y);
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
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
