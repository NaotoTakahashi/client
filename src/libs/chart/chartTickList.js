import * as CD from './chartDef';

const CELL_HEIGHT = 25;
const BACK_COLOR = 'rgb(20,30,40)';
const STD_STR_COLOR = 'rgb(255,255,255)';
const HDR_STR_COLOR = 'rgb(255,140,20)';
const DATE_STR_COLOR = 'rgb(190,190,190)';
const REV_COLOR = 'rgb(0,0,0)';
const HEADER_COLOR = 'rgb(60,200,255)';
const SCR_CENTER_COLOR = 'rgb(40,40,40)';
const SCR_SELECT_COLOR = 'rgb(0, 162, 232)';
const OUTLINE_COLOR = 'rgb(30,54,80)';
const DEC_POINT = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];
const SCROLL_WIDTH = 16;
class ChartVerticalScroll {
    constructor() {
        this.m_scrollMoveIn = false;
        this.m_selected_x1 = 0;		// スクロールポジション(選択範囲)
        this.m_selected_y1 = 0;		// スクロールポジション(選択範囲)
        this.m_selected_x2 = 0;		// スクロールポジション(選択範囲)
        this.m_selected_y2 = 0;		// スクロールポジション(選択範囲)
        this.m_mosPushed_x = -1;	// マウス選択位置
        this.m_mosPushed_y = -1;	// マウス選択位置
        this.m_lineBar_reach = 0;	// バー本体幅
        this.m_lineBar_f_reach = 0;	// バー本体選択幅(左部)
        this.m_lineBar_b_reach = 0;	// バー本体選択幅(右部)
        this.m_scrollArea = { top: 0, left: 0, right: 0, bottom: 0 };
    }
    draw(rc, canvas, entryCount, bginIx, endIx) {
        this.m_scrollArea.top = rc.top;
        this.m_scrollArea.left = rc.left;
        this.m_scrollArea.right = rc.left + SCROLL_WIDTH;
        this.m_scrollArea.bottom = rc.bottom;
        this.m_scrollArea.height = (rc.bottom - rc.top) + 3;
        if (this.m_scrollMoveIn) {
            canvas.drawBlend("black", 0.5, this.m_scrollArea.left, this.m_scrollArea.top, SCROLL_WIDTH, this.m_scrollArea.height);
            canvas.drawFill(SCR_CENTER_COLOR, rc.left + 6, rc.top, rc.left + 10, this.m_scrollArea.bottom);
        }

        const dispNum = endIx - bginIx;   // 昇順前提
        const areaHeight = rc.bottom - rc.top
        const scrHeight = dispNum * areaHeight / entryCount;

        // 現在のポジション
        if(this.m_selected_x2 === 0){
            // 初期セット
            const yposValue = bginIx * areaHeight / entryCount;
            this.m_selected_y1 = this.m_scrollArea.top + yposValue;
            this.m_selected_y2 = this.m_selected_y1 + scrHeight;
        }
        this.m_selected_x1 = this.m_scrollArea.left + 4;
        this.m_selected_x2 = this.m_scrollArea.left + 12;
        if (this.m_scrollMoveIn) {
            if(this.m_scrollArea.bottom < this.m_selected_y2) {
                const height = this.m_selected_y2 - this.m_selected_y1;
                this.m_selected_y2 = this.m_scrollArea.bottom - height;
                this.m_selected_y1 = this.m_selected_y2 - height;
            }
            canvas.drawFill(SCR_SELECT_COLOR, this.m_selected_x1, this.m_selected_y1, this.m_selected_x2, this.m_selected_y2);
        }
    }
    getScrollWidth() {
        return SCROLL_WIDTH;
    }
    isScrollLast() {
        return (this.m_selected_y2 === this.m_scrollArea.bottom)? true : false;
    }
    getSelectedIndex(entryCount) {
        if(this.m_selected_x2 === 0){
            return 0;
        }
        if(this.m_selected_y1 === this.m_scrollArea.top){
            return 0;
        }
        if(this.m_selected_y2 === this.m_scrollArea.bottom){
            return entryCount - 1;
        }
        const areaHeight = this.m_scrollArea.bottom - this.m_scrollArea.top
        return ((this.m_selected_y1 - this.m_scrollArea.top) * entryCount / areaHeight) >> 0;
    }
    //==============================================================================
    //	位置情報クリア
    //==============================================================================
    clearMousePos() {
        this.m_mosPushed_x = -1;
        this.m_mosPushed_y = -1;
        //this.m_mosPushMode = SCROLL;
    }
    //==============================================================================
    //	マウス位置エリア内判定
    //==============================================================================
    isInnerArea(x, y) {
        if (this.m_scrollArea.left <= x && x <= this.m_scrollArea.right &&
            this.m_scrollArea.top <= y && y <= this.m_scrollArea.bottom) {
                return true;
        }
        return false;
    }
    //==============================================================================
    //	マウス位置エリア内判定
    //==============================================================================
    isSelectArea(x, y) {
        if (this.m_selected_x1 <= x && x <= this.m_selected_x2 &&
            this.m_selected_y1 - 10 <= y && y <= this.m_selected_y2 + 10) {
                return true;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        if (this.m_mosPushed_x !== -1) {
            // 領域内チェックなし
            const top = this.m_scrollArea.top;
            const btm = this.m_scrollArea.bottom;        
            //PUSH状態
            //フォーカス範囲移動位置更新
            if (y - this.m_lineBar_f_reach < top) {
                this.m_selected_y1 = top;
                this.m_selected_y2 = top + this.m_lineBar_reach;
            } else if ((btm - 1) < y + this.m_lineBar_b_reach) {
                this.m_selected_y1 = btm - this.m_lineBar_reach;
                this.m_selected_y2 = btm;
            } else {
                this.m_selected_y1 = y - this.m_lineBar_f_reach;
                this.m_selected_y2 = y + this.m_lineBar_b_reach;
            }
            this.m_mosPushed_x = x;
            this.m_mosPushed_y = y;
        }else{
            this.m_scrollMoveIn = this.isInnerArea(x, y);
            if(!this.m_scrollMoveIn){
                this.clearMousePos(); //解除
                return false;
            }
        }

        return true;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if(this.isSelectArea(x, y)){
            this.m_mosPushed_x = x;
            this.m_mosPushed_y = y;
            this.m_lineBar_reach = this.m_selected_y2 - this.m_selected_y1;
            this.m_lineBar_f_reach = y - this.m_selected_y1;
            this.m_lineBar_b_reach = this.m_selected_y2 - y;
            return true;
        }
        
        this.clearMousePos(); //解除
        return false;
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        if (this.m_mosPushed_x !== -1) {
            this.clearMousePos(); //解除
            return true;
        }
        if (this.isInnerArea(x, y)) {
            this.m_lineBar_reach = this.m_selected_y2 - this.m_selected_y1;
            const half = this.m_lineBar_reach / 2;
            this.m_lineBar_f_reach = y - half;
            this.m_lineBar_b_reach = this.m_lineBar_f_reach + this.m_lineBar_reach;

            const top = this.m_scrollArea.top;
            const btm = this.m_scrollArea.bottom;
            //フォーカス範囲移動位置更新
            if (this.m_lineBar_f_reach < top) {
                this.m_selected_y1 = top;
                this.m_selected_y2 = top + this.m_lineBar_reach;
            } else if (btm < this.m_lineBar_b_reach) {
                this.m_selected_y1 = btm - this.m_lineBar_reach;
                this.m_selected_y2 = btm;
            } else {
                this.m_selected_y1 = this.m_lineBar_f_reach;
                this.m_selected_y2 = this.m_lineBar_b_reach;
            }
            // this.m_mosPushed_x = x;
            // this.m_mosPushed_y = y;

            return true;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOVE OUT]
    //==============================================================================
    uiEvtMouseOutPerformed() {
        this.clearMousePos(); //解除
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOVE IN]
    //==============================================================================
    uiEvtMouseInPerformed() {
        return false;
    }
}

//==============================================================================
class ChartList {
	constructor(info, drawParam) {
        this.m_info = info;
        this.m_drawParam = drawParam;
        this.m_scroll = new ChartVerticalScroll();
    }
    getAreaSize = () => { return 0; };
    draw(areaRect, canvas) {
        // 背景
        canvas.drawFill(OUTLINE_COLOR, areaRect.left, areaRect.top, areaRect.right, areaRect.bottom);
        // スプリット
        const splitColor = this.m_drawParam.getColor(this.m_drawParam.m_color.SPLIT.c);
        canvas.drawBoldLine(splitColor, 2, areaRect.left, areaRect.top, areaRect.left + 2, areaRect.bottom);
        // 表示領域調整
        let rc = JSON.parse(JSON.stringify(areaRect));
        rc.left += 5;
        rc.top += 3;
        rc.right -= 5;
        rc.botoom -= 10;
        canvas.drawFill(BACK_COLOR, rc.left, rc.top, rc.right, rc.bottom);

        const szHistList = this.m_info.getCurHistSize();
        const histList = this.m_info.getCurrentHist();

        // ヘッダ部描画
        this.drawHeader(rc, canvas, histList.mDataType);

        const scrollHeight = (rc.bottom - rc.top) - CELL_HEIGHT;    // 先頭のヘッダ部を1行分差引く
        let drawCount = Math.ceil((scrollHeight) / CELL_HEIGHT);
        let ypos = CELL_HEIGHT;
        for(let i = 0; i < drawCount; i++){
            if ( i & 1 ) {
                canvas.drawFill(REV_COLOR, rc.left, ypos, rc.right,  ypos + CELL_HEIGHT);
            }
            ypos += CELL_HEIGHT;
        }
        const dec = DEC_POINT[histList.mDecimalScale];
        let xpos = rc.left;
        let height = rc.top + CELL_HEIGHT + 7;
        let ix = histList.mLastIndex;
        if(drawCount < szHistList){
            if(this.m_scroll.isScrollLast()){
                // 最終行の表示可否(不可なら表示件数を-1とする)
                if(scrollHeight + 2 < drawCount * CELL_HEIGHT){
                    drawCount -= 1;
                }
            }
            ix = histList.mLastIndex - this.m_scroll.getSelectedIndex(szHistList);
            if (ix < drawCount) {
                // 表示件数より少ない場合 または カーソル位置のラスト
                ix = drawCount - 1;
            }
        }
        let loopCount = (szHistList < drawCount) ? szHistList : drawCount;

        this.drawEntry(rc, canvas, histList, loopCount, ix, height);

        canvas.drawFill(OUTLINE_COLOR, rc.left, areaRect.bottom - 7, rc.right, areaRect.bottom);

        // スクロール
        if (drawCount < szHistList) {
            const scrollRect = {top: rc.top + CELL_HEIGHT +3, left: rc.right - this.m_scroll.getScrollWidth() + 3, right: rc.right, bottom: rc.bottom - 10};
            this.m_scroll.draw(scrollRect, canvas, szHistList, 0, loopCount);
        }
    }
    drawHeader(rc, canvas) {
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        return this.m_scroll.uiEvtMouseMovePerformed(x, y);
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        return this.m_scroll.uiEvtMouseLeftPerformed(x, y);
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        return this.m_scroll.uiEvtMouseUpPerformed(x, y);
    }
    //==============================================================================
    //	UI EVENT [MOVE OUT]
    //==============================================================================
    uiEvtMouseOutPerformed() {
        return this.m_scroll.uiEvtMouseOutPerformed();
    }
    //==============================================================================
    //	UI EVENT [MOVE IN]
    //==============================================================================
    uiEvtMouseInPerformed() {
        return this.m_scroll.uiEvtMouseInPerformed();
    }
}

const COL_TIME = 0;
const COL_PRICE = 1;
const COL_VOLUME = 2;
const COL_VWAP = 3;
export class ChartTickList extends ChartList{
    constructor(info, drawParam) {
        super(info, drawParam);
        this.columnWidth = new Array(3);
        this.columnWidth[COL_TIME] = 70;
        this.columnWidth[COL_PRICE] = 70;
        this.columnWidth[COL_VOLUME] = 70; 
    }
    getAreaSize = () => { return 230; };
    drawEntry(rc, canvas, histList, loopCount, bgnIx, bgnYPos) {
        let strYpos = bgnYPos - 4;
        let ix = bgnIx;
        for(let i = 0; i < loopCount; i++){
            let pt = histList.mChartList[ix--];
            let prev = (ix < 0)? histList.mChartList[0] : histList.mChartList[ix];
            let xpos = rc.left;
            // 時刻
            canvas.drawStringC(pt.mSecTime, xpos + (this.columnWidth[COL_TIME] >> 1), strYpos, DATE_STR_COLOR);
            xpos += this.columnWidth[COL_TIME];

            // 符号
            let colorPrice = STD_STR_COLOR;
            if(prev.mClosePrice < pt.mClosePrice){
                colorPrice = "red";
                canvas.drawStringL("▲", xpos + 3, strYpos, colorPrice);
            }else if (pt.mClosePrice < prev.mClosePrice){
                colorPrice = "green";
                canvas.drawStringL("▼", xpos + 3 , strYpos, colorPrice);
            }

            // 値段
            const lastPrice = pt.mClosePrice / DEC_POINT[histList.mDecimalScale];
            const s_price = lastPrice.toFixed(histList.mValiｄDegits);
            canvas.drawStringR(s_price, xpos + this.columnWidth[COL_PRICE] - 3, strYpos, colorPrice);
            xpos += this.columnWidth[COL_PRICE];

            // 出来高
            canvas.drawStringR(pt.mVolume, xpos + this.columnWidth[COL_VOLUME] - 3, strYpos, STD_STR_COLOR);
            xpos += this.columnWidth[COL_VOLUME];

            strYpos += CELL_HEIGHT;
        }
    }
    drawHeader(rc, canvas, dataType) {
        let xpos = rc.left + 3;
        let ypos = rc.top + 3;
        let width = this.columnWidth[COL_TIME] - 3;
        let height = CELL_HEIGHT - 3;
        let bottom = ypos + height;
        
        canvas.drawBoldLine (HEADER_COLOR, 2, xpos + 1, bottom, xpos + width, bottom);
        canvas.drawStringC('時刻', xpos + (width >> 1), ypos + 3, HDR_STR_COLOR);

        xpos += this.columnWidth[COL_TIME];
        width = this.columnWidth[COL_PRICE] - 3;
        canvas.drawBoldLine (HEADER_COLOR, 2, xpos + 1, bottom, xpos + width, bottom);
        canvas.drawStringC('値段', xpos + (width >> 1), ypos + 3, HDR_STR_COLOR);

        xpos += this.columnWidth[COL_PRICE];
        width = this.columnWidth[COL_VOLUME] - 3;
        canvas.drawBoldLine (HEADER_COLOR, 2, xpos + 1, bottom, xpos + width, bottom);
        canvas.drawStringC('出来高', xpos + (width >> 1), ypos + 3, HDR_STR_COLOR);
    }
}

const COL_DL_TIME = 0;
const COL_DL_OPEN = 1;
const COL_DL_HIGH = 2;
const COL_DL_LOW = 3;
const COL_DL_CLOSE = 4;
const COL_DL_VOLUME = 5;
const COL_DL_VWAP = 6;
export class ChartDataList extends ChartList{
    constructor(info, drawParam) {
        super(info, drawParam);
        this.columnWidth = new Array(6);
        this.columnWidth[COL_DL_TIME] = 80;
        this.columnWidth[COL_DL_OPEN] = 70;
        this.columnWidth[COL_DL_HIGH] = 70;
        this.columnWidth[COL_DL_LOW] = 70;
        this.columnWidth[COL_DL_CLOSE] = 70;
        this.columnWidth[COL_DL_VOLUME] = 80;    
    }
    getAreaSize = () => { return 460; };
    drawEntry(rc, canvas, histList, loopCount, ix, bgnYPos) {
        let strYpos = bgnYPos - 4;
        for(let i = 0; i < loopCount; i++){
            let pt = histList.mChartList[ix--];
            let prev = (ix < 0)? histList.mChartList[0] : histList.mChartList[ix];
            let xpos = rc.left;

            // 日時
            const dateValue = (histList.mDataType === CD.CHART_DATA_MIN)?　pt.mSecTime : 
                              (histList.mDataType !== CD.CHART_DATA_MONTH)? pt.mDate : pt.mDate.substr(0, 7);
            canvas.drawStringC(dateValue, xpos + (this.columnWidth[COL_TIME] >> 1), strYpos, DATE_STR_COLOR);
            xpos += this.columnWidth[COL_TIME];

            // 始値
            {
                const price = pt.mOpenPrice / DEC_POINT[histList.mDecimalScale];
                const s_price = price.toFixed(histList.mValiｄDegits);
                canvas.drawStringR(s_price, xpos + this.columnWidth[COL_DL_OPEN] - 3, strYpos, STD_STR_COLOR);
                xpos += this.columnWidth[COL_DL_OPEN];
            }

            // 高値
            {
                const price = pt.mHighPrice / DEC_POINT[histList.mDecimalScale];
                const s_price = price.toFixed(histList.mValiｄDegits);
                canvas.drawStringR(s_price, xpos + this.columnWidth[COL_DL_HIGH] - 3, strYpos, STD_STR_COLOR);
                xpos += this.columnWidth[COL_DL_HIGH];
            }

            // 安値
            {
                const price = pt.mLowPrice / DEC_POINT[histList.mDecimalScale];
                const s_price = price.toFixed(histList.mValiｄDegits);
                canvas.drawStringR(s_price, xpos + this.columnWidth[COL_DL_LOW] - 3, strYpos, STD_STR_COLOR);
                xpos += this.columnWidth[COL_DL_LOW];
            }

            // 符号
            if(prev.mClosePrice < pt.mClosePrice){
                const colorPrice = "red";
                canvas.drawStringL("▲", xpos + 3, strYpos, colorPrice);
            }else if (pt.mClosePrice < prev.mClosePrice){
                const colorPrice = "green";
                canvas.drawStringL("▼", xpos + 3 , strYpos, colorPrice);
            }

            // 終値
            {
                const price = pt.mClosePrice / DEC_POINT[histList.mDecimalScale];
                const s_price = price.toFixed(histList.mValiｄDegits);
                canvas.drawStringR(s_price, xpos + this.columnWidth[COL_DL_CLOSE] - 3, strYpos, STD_STR_COLOR);
                xpos += this.columnWidth[COL_DL_CLOSE];
            }

            // 出来高
            canvas.drawStringR(pt.mVolume, xpos + this.columnWidth[COL_DL_VOLUME] - 3, strYpos, STD_STR_COLOR);
            xpos += this.columnWidth[COL_DL_VOLUME];

            strYpos += CELL_HEIGHT;
        }
    }
    drawHeader(rc, canvas, dataType) {
        let xpos = rc.left + 3;
        let ypos = rc.top + 3;
        let width = this.columnWidth[COL_DL_TIME] - 3;
        let height = CELL_HEIGHT - 3;
        let bottom = ypos + height;
        const strColor = HDR_STR_COLOR;

        canvas.drawBoldLine (HEADER_COLOR, 2, xpos + 1, bottom, xpos + width, bottom);

        const strDateTime = (dataType　=== CD.CHART_DATA_MIN)?　'時刻' : '日付';
        canvas.drawStringC(strDateTime, xpos + (width >> 1), ypos + 3, strColor);

        xpos += this.columnWidth[COL_DL_TIME];
        width = this.columnWidth[COL_DL_OPEN] - 3;
        canvas.drawBoldLine (HEADER_COLOR, 2, xpos + 1, bottom, xpos + width, bottom);
        canvas.drawStringC('始値', xpos + (width >> 1), ypos + 3, strColor);

        xpos += this.columnWidth[COL_DL_OPEN];
        width = this.columnWidth[COL_DL_HIGH] - 3;
        canvas.drawBoldLine (HEADER_COLOR, 2, xpos + 1, bottom, xpos + width, bottom);
        canvas.drawStringC('高値', xpos + (width >> 1), ypos + 3, strColor);

        xpos += this.columnWidth[COL_DL_HIGH];
        width = this.columnWidth[COL_DL_LOW] - 3;
        canvas.drawBoldLine (HEADER_COLOR, 2, xpos + 1, bottom, xpos + width, bottom);
        canvas.drawStringC('安値', xpos + (width >> 1), ypos + 3, strColor); 

        xpos += this.columnWidth[COL_DL_LOW];
        width = this.columnWidth[COL_DL_CLOSE] - 3;
        canvas.drawBoldLine (HEADER_COLOR, 2, xpos + 1, bottom, xpos + width, bottom);
        canvas.drawStringC('終値', xpos + (width >> 1), ypos + 3, strColor);

        xpos += this.columnWidth[COL_DL_CLOSE];
        width = this.columnWidth[COL_DL_VOLUME] - 3;
        canvas.drawBoldLine (HEADER_COLOR, 2, xpos + 1, bottom, xpos + width, bottom);
        canvas.drawStringC('出来高', xpos + (width >> 1), ypos + 3, strColor);
    }
}