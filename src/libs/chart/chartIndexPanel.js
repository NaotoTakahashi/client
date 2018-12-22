export default class ChartIndexPanel {
	constructor(chartCanvas) {
        this.m_cc = chartCanvas;
        this.m_rc = {};
        this.m_rc.left = 0;
        this.m_rc.top = 0;
        this.m_rc.right = 200;
        this.m_rc.bottom = 18;
        this.m_date = "";
        this.m_indexValue = [];
        this.m_indexName = [];
        this.m_indexColor = [];
        this.m_subIndexValue = [];
        this.m_subIndexName = [];
        this.m_subIndexColor = [];
        //this.m_lastValueIndex = 0;
        //マウスイベント情報
        this.m_drawStatus = false; //明細表示可否
        this.m_mousePushed_x = -1; //ボタン押下地点
        this.m_mousePushed_y = -1; //ボタン押下地点
        this.m_locLeftFar_x = 0;  //選択時左部からの距離
        this.m_locLeftFar_y = 0;  //選択時上部からの距離
        //描画位置情報
        this.m_locTop = 0; 	    //描画開始位置(Y)
        this.m_locLeft = 0; 	    //描画開始位置(X)
        this.m_barWidth = this.m_rc.right - this.m_rc.left; 	//描画バー幅
        this.m_barHeight = 20;   //描画バー高
        this.m_bodyWidth = this.m_barWidth;   //描画明細部幅
        this.m_bodyHeight = 0;    //描画明細部高
        this.m_btnPosx = 0;    //描画開始位置ボタン部(Y)
        this.m_btnPosy = 0;    //描画開始位置ボタン部(X)
        this.m_btnWidth = 20;   //描画開始位置ボタン部幅
        this.m_btnHeight = 13;   //描画開始位置ボタン部高
        this.m_btn_rc = {}; //ボタン描画領域
    }
    draw(rc) {
        let total_height = 0;
        if (!this.m_drawStatus) {
            total_height = this.m_barHeight;
        } else {
            let b_height = (this.m_lastValueIndex - 1) * 20;
            if (b_height < this.m_bodyHeight) {
                this.m_bodyHeight = b_height;
            }
            total_height = this.m_barHeight + this.m_bodyHeight;
        }

        if (this.m_locLeft < 0) this.m_locLeft = 0;
        if (this.m_locTop < rc.top) this.m_locTop = rc.top;
        if (rc.bottom < this.m_locTop + this.m_barHeight) this.m_locTop = rc.bottom - this.m_barHeight;
        if (rc.right < this.m_locLeft + this.m_barWidth) this.m_locLeft = rc.right - this.m_barWidth;
 
        // タイトルバー(ボタン)
        this.m_btnPosy = this.m_locTop + 2;
        this.m_btnPosx = this.m_locLeft + this.m_barWidth - 25;
        this.m_btn_rc.left = this.m_btnPosx;
        this.m_btn_rc.top = this.m_btnPosy;
        this.m_btn_rc.right = this.m_btnPosx + this.m_btnWidth;
        this.m_btn_rc.bottom = this.m_btnPosy + this.m_btnHeight;
        this.drawTittleBar();
        this.m_cc.drawLine("rgba(70, 70, 70)", this.m_locLeft, this.m_locTop, this.m_locLeft + this.m_barWidth, this.m_locTop);
        this.m_cc.drawLine("rgba(30, 30, 30)", this.m_locLeft, this.m_locTop + this.m_barHeight, this.m_locLeft + this.m_barWidth, this.m_locTop + this.m_barHeight);
        this.m_cc.drawLine("rgba(70, 70, 70)", this.m_locLeft, this.m_locTop, this.m_locLeft, this.m_locTop + this.m_barHeight);
        this.drawPanelHideBtn(this.m_btn_rc, this.m_drawStatus);
        
        // タイトルバー(表示日付)
        this.m_cc.drawStringL(this.m_date, this.m_locLeft + 5, this.m_locTop + 1);
        
        // 詳細表示判定
        if (!this.m_drawStatus) return;

        // 指標描画
        const mainLength = this.m_indexValue.length;
        const subLength = this.m_subIndexValue.length;
        const rowHeight = 15;
        const sepHeight = 8;
        const topMargin = 5;
        let bodyTop = this.m_locTop + this.m_barHeight;
        let height = bodyTop + topMargin;
        const totalHeight = (mainLength * rowHeight) + (subLength * rowHeight) + sepHeight + topMargin + 2;

        // 全体枠塗り潰し
        this.m_cc.ctx.fillStyle = "rgba(45,58,80, 0.8)";
        this.m_cc.ctx.fillRect(this.m_locLeft, bodyTop, this.m_barWidth, totalHeight);
        this.m_cc.ctx.fillStyle = "#ffffff";

        // メイン指標描画
        for (let i = 0; i < mainLength; i++) {
            this.m_cc.drawIndexText(this.m_indexColor[i], this.m_indexName[i], this.m_locLeft + 10, height);
            this.m_cc.drawStringR(this.m_indexValue[i], this.m_locLeft + this.m_barWidth - 10, height);
            height += rowHeight;
        }

        height += sepHeight;

        // サブ指標描画
        for (let i = 0; i < subLength; i++) {
            this.m_cc.drawIndexText(this.m_subIndexColor[i], this.m_subIndexName[i], this.m_locLeft + 10, height);
            this.m_cc.drawStringR(this.m_subIndexValue[i], this.m_locLeft + this.m_barWidth - 10, height);
            height += rowHeight;
        }

    }
    drawTittleBar(sat) {
        this.m_cc.drawGradFill(this.m_locLeft, this.m_locTop, this.m_locLeft + this.m_barWidth, this.m_locTop + this.m_barHeight);
    }
    drawPanelHideBtn(rc, stat) {
        if (stat) {
            this.m_cc.drawStringL("▲", rc.left + 3, rc.top - 1);
        } else {
            this.m_cc.drawStringL("▼", rc.left + 3, rc.top);
        }
    }
    drawBegin() {
        this.m_indexValue = [];
        this.m_indexName = [];
        this.m_indexColor = [];
        this.m_subIndexValue = [];
        this.m_subIndexName = [];
        this.m_subIndexColor = [];
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
        //既に左押下済 && 今回押下状態
        if (this.m_mousePushed_x != -1) {
            this.m_locLeft = x - this.m_locLeftFar_x;
            this.m_locTop = y - this.m_locLeftFar_y;
            return true;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if (this.innerPartOfBarButton(x, y)) {
            if (this.m_drawStatus) {
                this.m_drawStatus = false;
            } else {
                this.m_drawStatus = true;
            }
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
        if (this.m_mousePushed_x != -1) {
            this.m_mousePushed_x = -1;
            this.m_mousePushed_y = -1;
            return false;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOVE OUT]
    //==============================================================================
    uiEvtMouseOutPerformed() {
        if (this.m_mousePushed_x != -1) {
            this.m_mousePushed_x = -1;
            this.m_mousePushed_y = -1;
            return false;
        }
    }
    //==============================================================================
    //	UI EVENT [MOVE IN]
    //==============================================================================
    // uiEvtMouseInPerformed() {
    //     this.mMosPushStat = false;
    //     this.mMosPushPrvX = 0;
    //     return false;
    // }
}

