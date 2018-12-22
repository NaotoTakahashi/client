import ChartDrawInfo from './chartDrawInfo';
import * as CD from './chartDef';

const MAX_YEAR_NUM = 30;
const KNOB_MARGIN = 10;
const KNOB_WIDTH = 5;

const SCROLL = 0;		//スクロール中
const LEFT_CHG = 1;		//左部選択範囲変更中
const RIGHT_CHG = 2;	//右部選択範囲変更中

const KNOB_COLOR = "rgb(80,80,80)";
const SCROLL_ALPHA = 0.5;

export default class ChartScroll {
	constructor(info, drawParam, isSingle = false) {
        this.m_info = info;
        this.m_drawInf = new ChartDrawInfo();
        this.m_drawParam = drawParam;
        this.m_dispEntryNum = 0;	//描画エントリ数
        this.m_fwdEntryNum = 0;		//先行足エントリ数
        this.m_selected_x1 = 0;		//スクロールポジション(選択範囲)
        this.m_selected_y1 = 0;		//スクロールポジション(選択範囲)
        this.m_selected_x2 = 0;		//スクロールポジション(選択範囲)
        this.m_selected_y2 = 0;		//スクロールポジション(選択範囲)
        this.m_selLKnob_x1 = 0;		//スクロール左部つまみポジション(選択範囲)
        this.m_selLKnob_x2 = 0;		//スクロール左部つまみポジション(選択範囲)
        this.m_selRKnob_x1 = 0;		//スクロール右部つまみポジション(選択範囲)
        this.m_selRKnob_x2 = 0;		//スクロール右部つまみポジション(選択範囲)
        this.m_mosPushMode = SCROLL;//スクロールポジション変更指示モード
        this.m_mosPushed_x = -1;	//マウス選択位置
        this.m_mosPushed_y = -1;	//マウス選択位置
        this.m_lineBar_reach = 0;	//バー本体幅
        this.m_lineBar_f_reach = 0;	//バー本体選択幅(左部)
        this.m_lineBar_b_reach = 0;	//バー本体選択幅(右部)
        this.m_polySize = 0;
        this.m_singleFlag = isSingle;
    }
    init (info) {
        this.m_info = info;
        this.m_singleFlag = info.isSingleChart();
    }
    draw(canvas, rc) {
        if(this.m_singleFlag){
            if(this.m_info.getChartType() === CD.CHART_MAIN_CWC){
                //スクロールしないため描画無し
                return;
            }
        }
        const STRING_COLOR = this.m_drawParam.getColor(this.m_drawParam.m_color.SCROLL_STR.c);
        const POLYGON_COLOR = this.m_drawParam.getColor(this.m_drawParam.m_color.SCROLL_POLY.c);
        const SCROLL_COLOR =  this.m_drawParam.getColor(this.m_drawParam.m_color.SCROLL.c);

        let bgnIndex = this.m_info.getBeginIndex();
        let endIndex = this.m_info.getLastIndex();
        this.m_fwdEntryNum = this.m_info.getFwdEntryNum();
        let chartWidth = this.m_drawInf.getAreaWidth();
        let hist = this.m_info.getCurrentHist();
        // エントリ描画サイズ取得
        let listSize = this.getEntrySize();
		this.m_drawInf.setCandleWidth(this.m_info.getCandleWidth());
		this.m_drawInf.setCandleMarginWidth(this.m_info.getCandleMarginWidth());
        this.m_drawInf.setAreaTop(rc.top);
        this.m_drawInf.setAreaBottom(rc.bottom -2);
        this.m_drawInf.setAreaWidth(rc.right);
        this.m_drawInf.setChartAreaMarginTop(2);
        this.m_drawInf.setChartAreaMarginBtm(0);
        this.m_drawInf.setChartAreaMarginLeft(0);
        this.m_drawInf.setChartAreaMarginRight(0);
        //this.m_drawInf.setFixedLeftWidth(0); //既に除外済のため
        this.m_drawInf.setChartAreaHeight(rc.bottom - rc.top);
        this.m_drawInf.setChartAreaWidth();
        this.m_drawInf.setScaleValueLeft(1);
        this.m_drawInf.setScaleValueRight(listSize-1 + this.m_fwdEntryNum); //0エントリは起点のため-1
    
        let left = 0;
        let right = left + this.m_drawInf.getAreaWidth();
        let top = rc.top;
        let btm = rc.bottom;
        let prev_ypos = 0;
        let prev_xpos = 0;
    
        let drawDateIndex = -1;				//年号格納カレントインデックス
        let drawDateXpos = new Array(MAX_YEAR_NUM);		//年号表示位置
        drawDateXpos.fill(0);
        let drawDateStr = new Array(MAX_YEAR_NUM);
        
        if(listSize === 0){
            let xpos1 = left;
            let xpos2 = right;
            if(this.m_info.isVariableMode()){
                canvas.drawBlend(SCROLL_COLOR, SCROLL_ALPHA, xpos1, top + 1, xpos2-xpos1, btm-(top+1));
            }else{
                canvas.drawBlend(SCROLL_COLOR, SCROLL_ALPHA, xpos1, top + 1, xpos2-xpos1, btm-(top+1));
            }
    
            //フォーカス範囲外枠描画
            canvas.drawGradFill (xpos1, top+2, KNOB_WIDTH, btm - top - 2);
            canvas.drawGradFill (xpos2 - KNOB_WIDTH, top+2, xpos2, btm - top - 2);
            canvas.drawLine("black", xpos1, top+1, xpos2, top+1);
            return;
        }
    
        //年号または日付格納要否判定
        let drawYear = false, drawDate = false;
        let data_type = hist.getDataType();
        if (data_type === CD.CHART_DATA_MONTH || data_type === CD.CHART_DATA_DAY || data_type === CD.CHART_DATA_WEEK) {
            drawYear = true;
        } else if (data_type === CD.CHART_DATA_MIN) {
            drawDate = true;
        }
    
        let pollyArray = null;
        let max, min;
        if (this.m_info.isSingleChart()) {
        } else {
            pollyArray = new Array(listSize + 2);
            this.m_polySize = pollyArray.length;
            let maxmin = hist.getMaxMinPrice(max, min);
            this.m_drawInf.setScaleValueTop(maxmin[0]);
            this.m_drawInf.setScaleValueBtm(maxmin[1]);
            for (let i = 0; i < listSize; i++) {
                let pt = hist.mChartList[i];
                let xpos = 0;
                let ypos = 0;
                if(i === 0){
                    xpos = left;
                    prev_xpos = xpos;
                }else{
                    xpos = this.m_drawInf.cnvValueToPosX(i) + 1;
                }
    
                ypos = this.m_drawInf.cnvValueToPosY(pt.mClosePrice);
                if(i === 0){
                    prev_ypos = ypos;
                }
    
                pollyArray[i] = { x: xpos, y: ypos };
                prev_ypos = ypos;
                prev_xpos = xpos;
    
                // 年号取得情報退避
                if (drawYear && drawDateIndex < MAX_YEAR_NUM) {
                    let yearStr = pt.mDate.substr(0, 4);
                    if(drawDateIndex === -1 || yearStr !== drawDateStr[drawDateIndex]) {
                        drawDateIndex++;
                        drawDateStr[drawDateIndex] = yearStr; //YYYY
                        drawDateXpos[drawDateIndex] = xpos;
                    }
                }else if (drawDate && drawDateIndex < MAX_YEAR_NUM) {
                    let dateStr = pt.mDate.substr(5, 5);
                    if(drawDateIndex === -1 || dateStr !== drawDateStr[drawDateIndex]) {
                        drawDateIndex++;
                        drawDateStr[drawDateIndex] = dateStr; //MM/DD
                        drawDateXpos[drawDateIndex] = xpos;
                    }
                }
            }
            // 通常描画
            pollyArray[listSize] = { x: prev_xpos, y: btm };
            pollyArray[listSize+1] = { x: left, y: btm };
        }
    
        // スクロール領域背景
        let back_rc = { l: left, t: top, r: (right + 2) - left, b: btm - top };
        canvas.drawFillRect("white", left, top, right - left, btm- top);
        let gradColor = ["rgb(30,30,30)", "rgb(50,50,50)", "rgb(70,70,70)"];
        canvas.drawGradient(gradColor, left, top, right, btm);

        // グラフ描画（塗り潰し）
        if (pollyArray !== null) {
            canvas.drawPolygon (POLYGON_COLOR, pollyArray, pollyArray.length);
        }
        //残エリア塗り潰し(一目均衡表描画時の先行部分を強制塗潰し)
        if (this.m_fwdEntryNum !== 0 && pollyArray[listSize].x+1 < right) {
            back_rc.l = pollyArray[listSize].x + 1;
        }
    
        // 年号描画
        //CDP::SetFont(qpt, CDPC::FONT_MAIN_TITTLE);
        if (0 <= drawDateIndex) {
            let prevDateXpos = 0;
            for (let i=0; i < drawDateIndex + 1; i++) {
                //描画エリアが近すぎる場合はSKIP
                if(prevDateXpos === 0 || prevDateXpos + 35 < drawDateXpos[i]){
                    canvas.drawStringL(drawDateStr[i], drawDateXpos[i], btm-15, STRING_COLOR)
                    prevDateXpos = drawDateXpos[i];
                }
            }
        }
    
        // チャート表示区間フォーカス描画
        let xpos1 = this.m_drawInf.cnvValueToPosX(bgnIndex);
        if (xpos1 < left + 1 || bgnIndex === 0) {
            xpos1 = left + 1;
        }
        let xpos2 = this.m_drawInf.cnvValueToPosX(endIndex);
        if (right < xpos2) {
            xpos2 = right; //最終エントリ
        }

        if(this.m_info.isVariableMode()){
            canvas.drawBlend(SCROLL_COLOR, SCROLL_ALPHA, xpos1, top + 1, xpos2 - xpos1, btm - (top + 1));
        }else{
            canvas.drawBlend(SCROLL_COLOR, SCROLL_ALPHA, xpos1, top + 1, xpos2 - xpos1, btm - (top + 1));
        }
    
        // スクロールノブ描画
        canvas.drawFill(KNOB_COLOR, xpos1, top + 1, xpos1 + KNOB_WIDTH, btm);
        //canvas.drawLine(KNOB_SDW_COLOR, xpos1, top + 1, xpos1, btm);
        //canvas.drawLine(KNOB_SDW_COLOR, btm, xpos1 + KNOB_WIDTH, btm);
        canvas.drawFill(KNOB_COLOR, xpos2 - KNOB_WIDTH, top + 1, xpos2, btm);

        //フォーカス範囲位置退避
        this.m_selected_x1 = xpos1;
        this.m_selected_x2 = xpos2;
        this.m_selected_y1 = top+3;
        this.m_selected_y2 = btm-3;
        // フォーカスつまみ部分退避
        //this.m_selLKnob_x1 = xpos1-5;
        //this.m_selLKnob_x2 = xpos1;
        this.m_selLKnob_x1 = xpos1 - KNOB_WIDTH;
        this.m_selLKnob_x2 = xpos1 + KNOB_WIDTH;
        this.m_selRKnob_x1 = xpos2 - KNOB_WIDTH;
        this.m_selRKnob_x2 = xpos2 + KNOB_WIDTH;

        // 表示可能エントリ数退避
        //m_dispEntryNum = endIndex - bgnIndex + 1; //←ずれる
        this.m_drawInf.setChartAreaWidth(chartWidth); //注意：m_drawInfを使用する
        if (!this.m_info.isVariableMode()) {
            this.m_dispEntryNum = this.m_drawInf.getCanDrawCount();
        } else {
            let var_bgnix = this.m_info.getVariableBgnIndex();
            let var_endix = this.m_info.getVariableEndIndex();
            this.m_dispEntryNum = var_endix - var_bgnix + 1;
        }
        pollyArray = [];
    }
    //==============================================================================
    //	選択範囲(左部)変更指示イベント
    //==============================================================================
    changeLeftScrollFocus(x, y) {
        let left = 0;
        // ツマミから前後　±100 の範囲
        if(this.m_selected_y1 - 100 <= y && y <= this.m_selected_y2 + 100){
            if(x < this.m_selected_x2 - 10){
                //フォーカス範囲移動位置更新
                if(x < left){
                    this.m_selected_x1 = left;
                }else{
                    this.m_selected_x1 = x;
                }
                //フォーカス範囲移動位置から表示インデックス取得（相対位置を指定）
                let bgnIndex = this.m_drawInf.cnvPosXToValue(this.m_selected_x1-left);
                if(bgnIndex < 0){
                    bgnIndex = 0;
                }
                this.m_info.setVariableBgnIndex(bgnIndex >> 0);
                if(this.m_info.getVariableEndIndex() < 0){
                    let endIndex = this.m_drawInf.cnvPosXToValue(this.m_selected_x2);
                    this.m_info.setVariableEndIndex(endIndex >> 0);
                }
                this.m_info.setVariableMode(true);
                this.m_mosPushed_x = x;
                if (y < this.m_selected_y1) {
                    this.m_mosPushed_y = this.m_selected_y1 + 1;
                } else if (this.m_selected_y2 < y) {
                    this.m_mosPushed_y = this.m_selected_y2 - 1;
                } else {
                    this.m_mosPushed_y = y;
                }
                return true;
            }
        }else{
            this.clearMousePos(); //解除
        }
        return false;
    }
    //==============================================================================
    //	選択範囲(右部)変更指示イベント
    //==============================================================================
    changeRightScrollFocus(x, y) {
        let left = 0;
        let right = this.m_drawInf.getAreaWidth();
        // ツマミから前後　±100 の範囲
        if(this.m_selected_y1 - 100 <= y && y <= this.m_selected_y2 + 100){
            if(this.m_selected_x1+ 10 < x){
                //フォーカス範囲移動位置更新
                if(right < x){
                    this.m_selected_x2 = right;
                }else{
                    this.m_selected_x2 = x;
                }
                //フォーカス範囲移動位置から表示インデックス取得（相対位置を指定）
                //let bgnIndex = this.m_drawInf.cnvPosXToValue(this.m_selected_x1-left) >> 0;
                let endIndex = this.m_drawInf.cnvPosXToValue(this.m_selected_x2-left) >> 0;
                this.m_info.setVariableBgnIndex(this.m_info.getBeginIndex());
                this.m_info.setVariableEndIndex(endIndex);
                this.m_info.setVariableMode(true);
                this.m_mosPushed_x = x;
                if (y < this.m_selected_y1) {
                    this.m_mosPushed_y = this.m_selected_y1 + 1;
                } else if (this.m_selected_y2 < y) {
                    this.m_mosPushed_y = this.m_selected_y2 - 1;
                } else {
                    this.m_mosPushed_y = y;
                }
                return true;
            }
        }else{
            this.clearMousePos(); //解除
        }
        //_ASSERTE( _CrtCheckMemory( ) );
        return false;
    }
    //==============================================================================
    //	エントリ数取得
    //==============================================================================
    getEntrySize() {
        if (this.m_singleFlag) {
            return this.m_info.getSingleEntrySize();
        } else {
            return this.m_info.getCurHistSize();
        }
    }
    getTrueEntrySize() {
        if (this.m_singleFlag) {
            return this.m_info.getSingleEntrySize();
        } else {
            return this.m_info.getCurHistSize() + this.m_fwdEntryNum;
        }
    }
    //==============================================================================
    //	位置情報クリア
    //==============================================================================
    clearMousePos() {
        this.m_mosPushed_x = -1;
        this.m_mosPushed_y = -1;
        this.m_mosPushMode = SCROLL;
    }
    //==============================================================================
    //	エリア内判定
    //==============================================================================
    isInnerAdjustKnob(x, y) {
        if (this.m_selLKnob_x1-KNOB_MARGIN <= x && x <= this.m_selLKnob_x2 &&
            this.m_selected_y1 <= y && y <= this.m_selected_y2) {
                return true;
        }
        if (this.m_selRKnob_x1 <= x && x <= this.m_selRKnob_x2 + KNOB_MARGIN &&
            this.m_selected_y1 <= y && y <= this.m_selected_y2) {
                return true;
        }
        return false;
    }
    //==============================================================================
    //	マウス位置エリア内判定
    //==============================================================================
    isInnerArea(x, y) {
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

        let right = this.m_drawInf.getAreaWidth();
        let left = this.m_drawInf.getChartAreaMarginLeft();
        //範囲確定中の場合
        if (this.m_mosPushMode !== SCROLL && this.m_mosPushed_x !== -1) {
            if(this.m_mosPushMode === LEFT_CHG){
                return this.changeLeftScrollFocus(x, y);
            }		
            if(this.m_mosPushMode === RIGHT_CHG){
                return this.changeRightScrollFocus(x, y);
            }
        }
        //スクロール中の場合
        if(left <= x && x <= right){
            //チャートエリア内移動
            if(this.m_mosPushed_x !== -1){
                //PUSH状態
                //フォーカス範囲移動位置更新
                if(x - this.m_lineBar_f_reach < left){
                    this.m_selected_x1 = left;
                    this.m_selected_x2 = left + this.m_lineBar_reach;
                }else if((right-1) < x + this.m_lineBar_b_reach){
                    this.m_selected_x1 = right - this.m_lineBar_reach;
                    this.m_selected_x2 = right;
                }else{
                    this.m_selected_x1 = x - this.m_lineBar_f_reach;
                    this.m_selected_x2 = x + this.m_lineBar_b_reach;
                }
                //フォーカス範囲移動位置から表示インデックス取得（相対位置を指定）
                let bgnIndex;
                let entry = this.getTrueEntrySize();
                if (this.m_selected_x1-left === 0 || entry <= this.m_dispEntryNum) {
                    bgnIndex = 0;	//本当は描画エリアの方が大きい場合は右端に揃える
                //} else if(this.m_selected_x2 === right) {
                // 以下が right だと戻されるため、right + 1としたら上手く行く
                } else if(this.m_selected_x2 === right + 1) {
                    bgnIndex = entry - this.m_dispEntryNum;
                } else {
                    // 注意：下記は切り捨てNG
                    bgnIndex = Math.round(this.m_drawInf.cnvPosXToValue(this.m_selected_x1-left));
                }
                this.m_info.setBeginIndex(bgnIndex);

                // スクロール方向判定
                if (this.m_mosPushed_x < x) {
                    // 右方向へスクロール
                    this.m_info.setDispAutoUpdate(true);
                } else if (x < this.m_mosPushed_x) {
                    // 左方向へスクロール
                    this.m_info.setDispAutoUpdate(false);
                }
                this.m_mosPushed_x = x;
                this.m_mosPushed_y = y;
    
                //可変モード時
                if(this.m_info.isVariableMode()){
                    //描画中のエントリ数取得
                    let entry_cnt = this.m_info.getVariableEntryNum();
                    if(0 < entry_cnt){
                        if(this.m_selected_x2 === right){
                            let lastIndex = entry - 1;
                            let wkbgn = 0;
                            //最右端の場合は最大エントリ数を基準に設定
                            if(lastIndex < entry_cnt){
                                wkbgn = 0; //来てはならない(KAGI足できてしまった)
                            }else{
                                wkbgn = lastIndex - entry_cnt;
                            }
                            if(wkbgn < 0){
                                wkbgn = 0; //暫定 何故入ってくるか
                            }
                            this.m_info.setVariableBgnIndex(wkbgn);
                            this.m_info.setVariableEndIndex(lastIndex);
                        }else{
                            //以外は開始エントリを基準に設定
                            if(bgnIndex < 0){
                                bgnIndex = 0; //左部スクロール位置調整
                            }
                            this.m_info.setVariableBgnIndex(bgnIndex);
                            this.m_info.setVariableEndIndex(bgnIndex + entry_cnt);
                        }
                    }
                }
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if (this.m_selLKnob_x1-KNOB_MARGIN <= x && x <= this.m_selLKnob_x2 &&
            this.m_selected_y1 <= y && y <= this.m_selected_y2) {
            this.m_mosPushMode = LEFT_CHG;
            this.m_mosPushed_x = x;
            this.m_mosPushed_y = y;
            return true;
        }
        if (this.m_selRKnob_x1 <= x && x <= this.m_selRKnob_x2 + KNOB_MARGIN &&
            this.m_selected_y1 <= y && y <= this.m_selected_y2) {
            this.m_mosPushMode = RIGHT_CHG;
            this.m_mosPushed_x = x;
            this.m_mosPushed_y = y;
            return true;
        }
        if(this.isInnerArea(x, y)){
            this.m_mosPushed_x = x;
            this.m_mosPushed_y = y;
            this.m_lineBar_reach = this.m_selected_x2 - this.m_selected_x1;
            this.m_lineBar_f_reach = x - this.m_selected_x1;
            this.m_lineBar_b_reach = this.m_selected_x2 - x;
            return true;
        }
        this.clearMousePos(); //解除
        return false;
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        if(this.m_mosPushed_x !== -1){
            this.clearMousePos(); //解除
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

