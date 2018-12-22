import * as CD from './chartDef';

export const DTOOL_NOTOUCH = 0;
export const DTOOL_TOUCH = 1;
export const DTOOL_SELECTED = 2;

class ChartPoint {
	constructor() {
        this._x = 0;
        this._y = 0;
    }
    get x() { return this._x; }
    set x(pos){ this._x = pos; }
    get y() { return this._y; }
    set y(pos){ this._y = pos; }
}

class ChartTechToolObj {
	constructor() {
        this.m_drawType = 0;
        this.m_startPrice  = 0.0;		// ﾘﾄﾚｰｽﾒﾝﾄの場合：最高値
        this.m_startEntryIndex = 0;
        this.m_endPrice = 0.0;			// ﾘﾄﾚｰｽﾒﾝﾄの場合：最安値
        this.m_endEntryIndex = 0;
        this.m_selected = 0;            // 選択状態
    }
}

class ChartTechTool {
	constructor() {
        this.m_drawToolList = null;
        this.m_common = null;
        this.m_drawInf = null;
        this.m_drawParam = null;
        this.m_drawStartEntry = 0; 
        this.m_drawEndEntry = 0; 
        this.m_drawStart = new ChartPoint();
        this.m_drawEnd = new ChartPoint();
        this.m_selectedStart = new ChartPoint();
        this.m_selectedEnd = new ChartPoint();
        this.m_dustbox_rc = { left: 0, top: 0, right: 0, bottom:0, width: 0, height: 0 };
    }
    init(arrayList, common) {
        this.m_drawToolList = arrayList;
        this.m_common = common;
        this.m_drawInf = common.m_drawInf;
        this.m_drawParam = common.m_drawParam;;
    }
    clear() {
        this.m_drawToolList.length = 0;
        this.clearPos();
    }
    setPos(push_x, push_y, move_x, move_y) {
        this.m_drawStart.x = push_x;
        this.m_drawStart.y = push_y;
        this.m_drawEnd.x = move_x;
        this.m_drawEnd.y = move_y;
    }
    setEntry(bgn_entry, end_entry) {
        this.m_drawStartEntry = bgn_entry >> 0;
        this.m_drawEndEntry   = end_entry >> 0;
    }
    clearPos() {
        this.m_drawStart.x = -1;
        this.m_drawStart.y = -1;
        this.m_drawEnd.x = -1;
        this.m_drawEnd.y = -1;
    }
    isDrawing = () => { return false; }
    getEntryToPosForTool(entry) {
        let info = this.m_common.m_info;
        let val = 0;
        // if(info.IsAllDisp()){
        //     val = m_drawInf.cnvValueToPosX(entry);
        if(info.isVariableMode() && (0 <= info.getVariableBgnIndex())){
            let dummy = info.getDummyEntryWidth();
             let disp_num = info.getLastIndex() - info.getBeginIndex();
             let entry_width  = {};
             let candle_width = 0;
             let entry_pos = this.getVariableEntryWidth(entry, disp_num, entry_width, candle_width);	
             val = dummy + entry_pos +  (candle_width >> 1);
        }else{
             //DUMMY加算(Commonとここが異なる m_infoにも注意)
             let bgnix = info.getBeginIndex();
             let dummy = info.getDummyEntryWidth();
             let entry_pos = info.getCandleWidth() >> 1;
             val = dummy + this.m_drawInf.cnvEntryToPosX(bgnix, entry) + entry_pos;
        }
        return val;
    }
    getVariableEntryWidth(i, max, returnValue) {
        let nextpos = 0;
        const bgnix = this.m_common.m_info.getBeginIndex();
        const xpos = this.m_drawInf.cnvValueToPosX(i - bgnix);
        if(i+1 === max){
            nextpos = this.m_drawInf.getChartAreaEndPosX() - 1;
        }else{
            nextpos = this.m_drawInf.cnvValueToPosX((i + 1) - bgnix);
        }
        let entry_width = nextpos - xpos;
        if(entry_width <= 0){
            entry_width = 1;
        }
        let candle_width = this.m_common.getVariableCandleWidth(entry_width);

        returnValue[0] = entry_width;
        returnValue[1] = candle_width;

        return xpos;
    }
    chkEdgeOver(x1, y1, x, y) {
        if(((x1 - 5 <= x) && (x <= x1 + 5)) && ((y1 - 5 <= y) && (y <= y1 + 5))){
            return true;
        }
        return false;
    }
    chkIntersect(i, x1, y1, x3, y3, x, y) {
        let ix = -1;
        let obj = this.m_drawToolList[i];

        //int x1 = GetEntryToPosForTool(obj->m_startEntryIndex);
        //int x3 = GetEntryToPosForTool(obj->m_endEntryIndex);
        //int y1 = m_pDrawInf->CnvValueToPosYForPrice(obj->m_startPrice);
        //int y3 = m_pDrawInf->CnvValueToPosYForPrice(obj->m_endPrice);
        let x2 = x;
        let y2 = y;

        if((x1 - 10 <= x2) && (x2 <= x1 + 10) && (y1 - 10 <= y2) && (y2 <= y1 + 10)){
            //始点のまわり
            return true; //SELECTED
        }else if((x3 - 10 <= x2) && (x2 <= x3 + 10) && (y3 - 10 <= y2) && (y2 <= y3 + 10)){
            return true; //SELECTED
        }else if(x1 === x3){      //縦直線
            if(((y1 < y3) && (y1 <= y2) && (y2 <= y3)) || ((y3 < y1) && (y3 <= y2) && (y2 <= y1))){
                if((x1-5 <= x2) && (x2 <= x1+5)){
                    return true; //SELECTED
                }
            }
        }else if(y1 === y3){		//横直線
            if(((x1 < x3) && (x1 <= x2) && (x2 <= x3)) || ((x3 < x1) && (x3 <= x2) && (x2 <= x1))){
                if((y1-5 <= y2) && (y2 <= y1+5)){
                    return true; //SELECTED
                }
            }
        }else if((x1 - 20 < x3) && (x3 < x1 + 20)){
            if((x1 - 10 < x2) && (x2 < x1 + 10)){
                return true; //SELECTED
            }
        }else{
            //let m1 = (int)((double)(y3-y1)/(x3-x1)*100);
            //let m2 = (int)((double)(y3-y2)/(x3-x2)*100);
            let m1 = (y3-y1)/(x3-x1)*100;
            let m2 = (y3-y2)/(x3-x2)*100;

            //マウスXからその位置のYを求め上下の範囲内かをチェック
            let wy = (m1 * (x2 - x1) / 100) + y1;
            if((wy - 10 <= y2) && (y2 <= wy + 10)){
                if(((x1 < x3) && (x1 - 10 <= x2) && (x2 <= x3 + 10)) || ((x3 < x1) && (x3 - 10 <= x2) && (x2 <= x1 + 10))){
                    return true; //SELECTED
                }
            }
        }
        return false;
    }
    add(start_x, start_y, end_x, end_y) {
        return true;
    }
    move(ix, start_x, start_y, end_x, end_y) {
        return true;
    }
    remove(i, type) {
        if(this.m_drawToolList.length <= i){
            return false;
        }
        let obj = this.m_drawToolList[i];
        if(obj.m_drawType === type){
            obj = null;
            this.m_drawToolList.splice(i, 1);
        }else{
            return false;
        }
        this.clearPos();
        return true;
    }
    removeAll(type = null) {
        // 指定の種別のみ全て削除
        let toolList = this.m_drawToolList;
        toolList.some(function(obj, i){
            if (obj.m_drawType === type) toolList.splice(i,1);    
        });
        this.clearPos();
        return true;
    }
    draw(chartCanvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
    }
    drawingLine(chartCanvas) {
    }
    isSelected(i, x, y) {
        return false;
    }
    isInnerDustBox(x, y) {
        if(this.m_dustbox_rc === null) { 
            return;
        }
        if (this.m_dustbox_rc.left <= x && x <= this.m_dustbox_rc.right) {
            if (this.m_dustbox_rc.top <= y && y <= this.m_dustbox_rc.bottom) {
                return true;
            }
        }
        return false;
    }
    drawSelected(chartCanvas, ix) {
    }
    drawDustbox(chartCanvas, x, y) {
        const chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        let backGroundColor = 'rgb(0, 0, 0, 0.5)';
        let labelColor = 'rgb(0, 0, 0, 0.7)';
        let labelStrColor = 'rgb(255, 255, 255)';
        const strokColor = 'white';
        this.m_dustbox_rc.left =  chartEndPosX - 50;
        this.m_dustbox_rc.right = chartEndPosX - 5;
        this.m_dustbox_rc.top = chartEndPosY - 35;
        this.m_dustbox_rc.bottom = chartEndPosY + 15;
        this.m_dustbox_rc.width = this.m_dustbox_rc.right - this.m_dustbox_rc.left;
        this.m_dustbox_rc.height = this.m_dustbox_rc.bottom - this.m_dustbox_rc.top;
        if(this.isInnerDustBox(x, y)){
            backGroundColor = 'rgb(159, 15, 20, 0.5)';
        }
        chartCanvas.drawFill(backGroundColor, this.m_dustbox_rc.left, this.m_dustbox_rc.top, this.m_dustbox_rc.right, this.m_dustbox_rc.bottom);
        if(chartCanvas.m_dustboxImg !== null && 0 < chartCanvas.m_dustboxImg){
            chartCanvas.ctx.drawImage(chartCanvas.m_dustboxImg, this.m_dustbox_rc.left + 10, this.m_dustbox_rc.top + 10, this.m_dustbox_rc.width - 20, this.m_dustbox_rc.height - 20);
        }
        chartCanvas.drawStrokRect(strokColor, 2, this.m_dustbox_rc.left, this.m_dustbox_rc.top, this.m_dustbox_rc.width, this.m_dustbox_rc.height);
        chartCanvas.drawFillRoundRect(labelColor, "black", this.m_dustbox_rc.left + 4, this.m_dustbox_rc.top + 30, this.m_dustbox_rc.width - 7, 15, 4);
        chartCanvas.drawStringL("削除", this.m_dustbox_rc.left + 10, this.m_dustbox_rc.top + 30, labelStrColor);
    }
    // 3点目X座標取得
    getEndX(pt1_x, pt1_y, pt2_x, pt2_y, pt3_y) {
        const a = (pt2_y - pt1_y) / (pt2_x - pt1_x);
        const b = -1 * (pt1_x * a) + pt1_y;
        const x = (b - pt3_y) / a;
        return Math.abs(x);
    }
    // 3点目Y座標取得
    getEndY(pt1_x, pt1_y, pt2_x, pt2_y, pt3_x) {
        const a = (pt2_y - pt1_y) / (pt2_x - pt1_x);
        const b = -1 * (pt1_x * a) + pt1_y;
        const y = pt3_x * a + b;
        return y;
    }
    // 中点のX座標取得
    getMidX(pt1_x, pt2_x){
        return (pt1_x + pt2_x) / 2;
    }
    // 中点のX座標取得
    getMidY(pt1_y, pt2_y){
        return (pt1_y + pt2_y) / 2;
    }
}
//-------------------------------------------------------------------
// クラス名: ChartDrawTrendLine
//
// クラス概要: トレンドライン描画クラス
//--------------------------------------------------------------------
export class ChartDrawTrendLine extends ChartTechTool {
	constructor() {
        super();
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    getType = () => { return CD.TECH_TOOL_TREND; }
    isDrawing = () => { return false; }
    add(start_x, start_y, end_x, end_y) {
        let obj = new ChartTechToolObj();
        obj.m_selected = DTOOL_NOTOUCH;
        obj.m_drawType = this.getType();
        if(start_x <= end_x){
            obj.m_startEntryIndex = start_x;
            obj.m_endEntryIndex   = end_x;
            obj.m_startPrice      = start_y;
            obj.m_endPrice        = end_y;
        }else{
            obj.m_startEntryIndex = end_x;
            obj.m_endEntryIndex   = start_x;
            obj.m_startPrice      = end_y;
            obj.m_endPrice        = start_y;
        }
        if(obj.m_startEntryIndex === obj.m_endEntryIndex){
            if(obj.m_startPrice === obj.m_endPrice){
                obj = null;
                return true;
            }
        }
        this.m_drawToolList.push(obj);
        super.clearPos();
        return true;
    }
    //==============================================================================
    //	[TRENDLINE] MOVE OBJECT
    //==============================================================================
    move(ix, start_x, start_y, end_x, end_y) {
        let obj = this.m_drawToolList[ix];
        if(start_x <= end_x){
            obj.m_startEntryIndex = start_x;
            obj.m_endEntryIndex   = end_x;
            obj.m_startPrice      = start_y;
            obj.m_endPrice        = end_y;
        }else{
            obj.m_startEntryIndex = end_x;
            obj.m_endEntryIndex   = start_x;
            obj.m_startPrice      = end_y;
            obj.m_endPrice        = start_y;
        }
        if(obj.m_startEntryIndex === obj.m_endEntryIndex){
            if(obj.m_startPrice === obj.m_endPrice){
                this.remove(ix);
                return true;
            }
        }
        super.clearPos();
        return true;
    }
    //==============================================================================
    //	[TRENDLINE] REMOVE OBJECT
    //==============================================================================
    remove(i) {
        return super.remove(i, this.getType());
    }
    //==============================================================================
    //	[TRENDLINE] REMOVE OBJECT
    //==============================================================================
    removeAll() {
        return super.removeAll(this.getType());
    }
    //==============================================================================
    //	[TRENDLINE] DRAW
    //==============================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if(ix === selectedIX && !fixSelected && isMouseLbtn){
            //選択状態のため点線
            this.drawDragObject(canvas, ix, select_x, select_y);
        }else{
            //通常描画
            let obj = this.m_drawToolList[ix];
            let x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
            let x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
            let y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
            let y2 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
            canvas.drawLine(this.m_drawParam.getColor(this.m_drawParam.m_color.TRENDLINE.c), x1, y1, x2, y2);
        }
    }
    //==============================================================================
    //	[TRENDLINE] DRAG OBJECT 選択(PUSH)移動中
    //==============================================================================
    drawDragObject(canvas, ix, select_x, select_y) {
        let obj = this.m_drawToolList[ix];
        let x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        let x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        let y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        let y2 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
        const selectMargin = 5;
        //m_selectedPos →ドラッグ箇所退避
        let isEdgeSelect = true;
        if(((x2 - selectMargin <= select_x) && (select_x <= x2 + selectMargin))
                && ((y2 - selectMargin <= select_y) && (select_y <= y2 + selectMargin))){
            //左終端選択時
            this.m_selectedStart.x = x1;
            this.m_selectedStart.y = y1;
            this.m_selectedEnd.x = this.m_drawInf.getMousePosX();
            this.m_selectedEnd.y = this.m_drawInf.getMousePosY();
        }else if(((x1 - selectMargin <= select_x) && (select_x <= x1 + selectMargin))
                && ((y1 - selectMargin <= select_y) && (select_y <= y1 + selectMargin))){
            //右終端選択時
            this.m_selectedStart.x = this.m_drawInf.getMousePosX();
            this.m_selectedStart.y = this.m_drawInf.getMousePosY();
            this.m_selectedEnd.x = x2;
            this.m_selectedEnd.y = y2;
        }else{
            // ゴミ箱表示
            const mosX = this.m_drawInf.getMousePosX();
            const mosY = this.m_drawInf.getMousePosY();
            super.drawDustbox(canvas, mosX, mosY);
            //移動部分選択時
            let nXLen1 = select_x - x1;
            if(nXLen1 < 0) nXLen1 = 0;
            let nXLen2 = x2 - select_x;
            if(nXLen2 < 0) nXLen2 = 0;
            let nYlen1 = select_y - y1;
            let nYLen2 = y2 - select_y;
            this.m_selectedStart.x = mosX - nXLen1;
            this.m_selectedStart.y = mosY - nYlen1;
            this.m_selectedEnd.x = mosX + nXLen2;
            this.m_selectedEnd.y = mosY + nYLen2;
            isEdgeSelect = false;
        }
        const trendColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TRENDLINE.c);
        canvas.drawDottedLine(trendColor, this.m_selectedStart.x, this.m_selectedStart.y, this.m_selectedEnd.x, this.m_selectedEnd.y);
        canvas.drawEllipseFill(trendColor, trendColor, this.m_selectedStart.x, this.m_selectedStart.y, 4);
        canvas.drawEllipseFill(trendColor, trendColor, this.m_selectedEnd.x, this.m_selectedEnd.y, 4);
    }
    //==============================================================================
    //	[TRENDLINE] DRAW TOOL DOT LINE 新規に線を描画中(PUSH中)
    //==============================================================================
    drawingLine(canvas) {
        const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_DRAWING.c);
        if(0 <= this.m_drawStart.x && 0 <= this.m_drawStart.y){
            canvas.drawDottedLine(lineColor, this.m_drawStart.x, this.m_drawStart.y, this.m_drawEnd.x, this.m_drawEnd.y);
            canvas.drawEllipseFill(lineColor, lineColor,this.m_drawStart.x, this.m_drawStart.y, 4);
            canvas.drawEllipseFill(lineColor, lineColor,this.m_drawEnd.x, this.m_drawEnd.y, 4);
        }
    }
    //==============================================================================
    //	[TRENDLINE] JUDGE SELECT OBJECT 選択判定
    //==============================================================================
    isSelected(i, x, y) {

        let obj = this.m_drawToolList[i];

        let x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        let x3 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        let y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        let y3 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
        let x2 = x;
        let y2 = y;
        
        return super.chkIntersect(i, x1, y1, x3, y3, x2, y2);
    }
    //==============================================================================
    //	[TRENDLINE] SELECT OBJECT DRAW 選択状態の描画
    //==============================================================================
    drawSelected(canvas, ix) {
        let bgn_x = this.m_drawInf.getChartAreaBgnPosX();
        let bgn_y = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let end_x = this.m_drawInf.getChartAreaEndPosX();
        let end_y = this.m_drawInf.getChartAreaEndPosYWithMgn();

        //通常描画
        let obj = this.m_drawToolList[ix];
        let x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        let x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        let y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        let y2 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

        const selectedColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_SELECTED.c);
        //canvas.drawLine(selectedColor, x1, y1, x2, y2 );
        let x_distance = Math.abs(x2 - x1);
        let y_distance = Math.abs(y2 - y1);
        if (bgn_x < x1 && bgn_y < y1 && y1 < end_y) {
            canvas.drawEllipseFill(selectedColor, 'white',x1, y1, 4);
        }
        if (x2 < end_x && bgn_y < y2 && y2 < end_y) {
            canvas.drawEllipseFill(selectedColor, 'white', x2, y2, 4);
        }
    }
}
//-------------------------------------------------------------------
// クラス名: ChartDrawRetracement
//
// クラス概要: フィボナッチリトレースメント描画クラス
//--------------------------------------------------------------------
export class ChartDrawRetracement extends ChartTechTool {
	constructor() {
        super();
        this.m_dispInfo = new Object;
        this.m_dispInfo.m_dispMaxPrice = 0.0;       // 表示最大値段
        this.m_dispInfo.m_dispMinPrice = 0.0;       // 表示最小値段
        this.m_dispInfo.m_dispHighPrice = 0.0;      // 表示最高値
        this.m_dispInfo.m_dispLowPrice = 0.0;       // 表示最安値
        this.m_dispInfo.m_dispHighEntry = 0;	    // 表示最高値エントリ
        this.m_dispInfo.m_dispLowEntry = 0;	        // 表示最安値エントリ
        this.m_dispInfo.m_dispCloseHighPrice = 0.0; // 表示最高値(終値ベース)
        this.m_dispInfo.m_dispCloseLowPrice = 0.0;  // 表示最安値(終値ベース)
        this.m_dispInfo.m_dispCloseHighEntry = 0;   // 表示最高値エントリ(終値ベース)
        this.m_dispInfo.m_dispCloseLowEntry = 0;	// 表示最安値エントリ(終値ベース)
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    getType = () => { return CD.TECH_TOOL_RETRACE; }
    add(start_x, start_y, end_x, end_y) {
        if(Math.abs(start_x - end_x) < 5){
            return true;
        }
        let obj = new ChartTechToolObj();
        obj.m_selected = DTOOL_NOTOUCH;
        obj.m_drawType = this.getType();
        if(start_x < end_x){
            obj.m_startEntryIndex = start_x >> 0;
            obj.m_endEntryIndex   = end_x >> 0;
        }else{
            obj.m_startEntryIndex = end_x >> 0;
            obj.m_endEntryIndex   = start_x >> 0;
        }
        let cnt = obj.m_endEntryIndex - obj.m_startEntryIndex + 1;
        this.m_common.getPriceRange(obj.m_startEntryIndex, cnt, this.m_dispInfo);
    
        obj.m_startPrice = this.m_dispInfo.m_dispMaxPrice;
        obj.m_endPrice = this.m_dispInfo.m_dispMinPrice;

        this.m_drawToolList.push(obj);
        super.clearPos();
        return true;
    }
    //==============================================================================
    //	[FIBONACCHI RETRACEMENT] MOVE OBJECT
    //==============================================================================
    getNewEPosForMove(ix){
        const obj = this.m_drawToolList[ix];
        const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        const x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);

        // PUSH位置
        const start_x = this.m_drawStart.x;
        // UP位置
        const end_x = this.m_drawEnd.x;

        // LEFT側からマウスポインタ(X)までの長さ
        const leftWidth = start_x - x1;
        // マウスポインタ(X)からRIGHT側までの長さ
        const rightWidth = x2 - start_x;
        
        // 開始エントリ及び終了エントリの確定
        const nx1 = end_x - leftWidth;
        const nx2 = end_x + rightWidth;

        return [nx1, nx2];
    }
    move(ix, startEntry, endEntry) {

        const obj = this.m_drawToolList[ix];

        if(startEntry < endEntry){
            obj.m_startEntryIndex = startEntry >> 0;
            obj.m_endEntryIndex   = endEntry >> 0;
        }else{
            obj.m_startEntryIndex = endEntry >> 0;
            obj.m_endEntryIndex   = startEntry >> 0;
        }

        const cnt = obj.m_endEntryIndex - obj.m_startEntryIndex + 1;
        this.m_common.getPriceRange(obj.m_startEntryIndex, cnt, this.m_dispInfo);
    
        obj.m_startPrice = this.m_dispInfo.m_dispMaxPrice;
        obj.m_endPrice = this.m_dispInfo.m_dispMinPrice;

        super.clearPos();
        return true;
    }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] REMOVE OBJECT
    //==============================================================================
    remove(i) {
        return super.remove(i, this.getType());
    }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] REMOVE OBJECT
    //==============================================================================
    removeAll() {
        return super.removeAll(this.getType());
    }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] DRAW
    //==============================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if(ix === selectedIX && !fixSelected && isMouseLbtn){
            //選択状態のため点線
            this.drawRetraceMent(canvas, ix, 3);
            this.drawDragObject(canvas, ix, select_x, select_y);
            // ゴミ箱表示
            const mosX = this.m_drawInf.getMousePosX();
            const mosY = this.m_drawInf.getMousePosY();
            super.drawDustbox(canvas, mosX, mosY);
        }else{
            this.drawRetraceMent(canvas, ix, 3);
        }
        return;
    }
    //==============================================================================
    //	[FIBONACCHI RETRACEMENT] DRAG OBJECT
    //==============================================================================
    drawDragObject(canvas, ix, select_x, select_y) {

        // PUSH開始位置有効値判定
        if(this.m_drawStart.x < 0 || this.m_drawStart.y < 0){
            return;
        }

        const obj = this.m_drawToolList[ix];
        const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        const x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        const y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        const y2 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

        // LEFT側からマウスポインタ(X)までの長さ
        const leftWidth = this.m_drawStart.x - x1;
        // マウスポインタ(X)からRIGHT側までの長さ
        const rightWidth = x2 - this.m_drawStart.x;
        // TOPからマウスポインタ(Y)までの長さ
        const topHeight = this.m_drawStart.y - y1;
        // マウスポインタ(Y)からBOTTOMまでの長さ
        const btmHeight = y2 - this.m_drawStart.y;
        
        // LEFT側開始位置
        const staX = this.m_drawEnd.x - leftWidth;
        const endX = this.m_drawEnd.x + rightWidth;
        const staY = this.m_drawEnd.y - topHeight;
        const endY = this.m_drawEnd.y + btmHeight;

        const lineColor = "white";
        canvas.drawDottedLine(lineColor, staX, staY, endX, staY);
        canvas.drawDottedLine(lineColor, staX, staY, staX, endY);
        canvas.drawDottedLine(lineColor, staX, endY, endX, endY);
        canvas.drawDottedLine(lineColor, endX, staY, endX, endY);
    }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] DRAW RETRACEMENT (本数指定)
    //==============================================================================
    drawRetraceMent(canvas, ix, num) {
        let retraceColor;
        if(num === 3){
            retraceColor = this.m_drawParam.getColor(this.m_drawParam.m_color.RETRACE_3.c);
        }else{
            retraceColor = this.m_drawParam.getColor(this.m_drawParam.m_color.RETRACE_5.c);
        }
        const bgn_x = this.m_drawInf.getChartAreaBgnPosX();
        const bgn_y = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        const end_x = this.m_drawInf.getChartAreaEndPosX();
        const end_y = this.m_drawInf.getChartAreaEndPosYWithMgn();
    
        const obj = this.m_drawToolList[ix];
        let gap = Math.floor(obj.m_startPrice - obj.m_endPrice);
        const price764 = (gap * 0.764 + 0.5) + obj.m_endPrice;
        const price618 = (gap * 0.618 + 0.5) + obj.m_endPrice;
        const price5 = (gap * 0.5   + 0.5) + obj.m_endPrice;
        const price382 = (gap * 0.382 + 0.5) + obj.m_endPrice;
        const price236 = (gap * 0.236 + 0.5) + obj.m_endPrice;

        const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        const x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        const y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        const y2 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

        // 描画範囲外チェック
        if (end_x < x1 || x2 < bgn_x) {
            return;
        }else if (end_y < y1 || y2 < bgn_y) {
            return;
        }
    
        let bgn_val_x = x1;
        let end_val_x = x2;
    
        let bgn_string = true;	//率文字列描画可否
        let end_string = true;	//値段字列描画可否
    
        if (x1 < bgn_x) {
            bgn_val_x = bgn_x;
            bgn_string = false;
        }
        if (end_x < x2) {
            end_val_x = end_x;
            end_string = false;
        }
    
        let bgn_width = end_val_x - bgn_x;
        let end_width = end_x - bgn_val_x;
        let strVal = "";
        let y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        let info = this.m_common.m_info;
        let pHist = info.getCurrentHist();
        let dec = pHist.mDecimalScale;
        let y_margin = 13;
        if (bgn_y <= y && y <= end_y) {
            if (bgn_string && 20 < end_width) {
                canvas.drawStringL("0%", x1, y-y_margin, retraceColor);
            }
            if (end_string && 35 < bgn_width){
                let strVal = this.m_common.withDec(obj.m_startPrice, dec).toFixed(2);
                canvas.drawStringR(strVal, x2, y-y_margin, retraceColor);
            }
            canvas.drawLine(retraceColor, bgn_val_x, y, end_val_x, y);
        }
    
        if (num === 5) {
            y = this.m_drawInf.cnvValueToPosYForPrice(price236);
            if (bgn_y <= y && y <= end_y) {
                if (bgn_string && 20 < end_width){
                    canvas.drawStringL("23.6%", x1, y-y_margin, retraceColor);
                }
                if (end_string && 35 < bgn_width){
                    let strVal = this.m_common.withDec(price236, dec).toFixed(2);
                    canvas.drawStringR(strVal, x2, y-y_margin, retraceColor);
                }
                canvas.drawLine(retraceColor, bgn_val_x, y, end_val_x, y);
            }
        }

        y = this.m_drawInf.cnvValueToPosYForPrice(price382);
        if (bgn_y <= y && y <= end_y) {
            if (bgn_string && 20 < end_width){
                canvas.drawStringL("38.2%", x1, y-y_margin, retraceColor);
            }
            if (end_string && 35 < bgn_width){
                let strVal = this.m_common.withDec(price382, dec).toFixed(2);
                canvas.drawStringR(strVal, x2, y-y_margin, retraceColor);
            }
            canvas.drawLine(retraceColor, bgn_val_x, y, end_val_x, y);
        }
    
        y = this.m_drawInf.cnvValueToPosYForPrice(price5);
        if (bgn_y <= y && y <= end_y) {
            if (bgn_string && 20 < end_width){
                canvas.drawStringL("50.0%", x1, y-y_margin, retraceColor);
            }
            if (end_string && 35 < bgn_width){
                let strVal = this.m_common.withDec(price5, dec).toFixed(2);
                canvas.drawStringR(strVal, x2, y-y_margin, retraceColor);
            }
            canvas.drawLine(retraceColor, bgn_val_x, y, end_val_x, y);
        }
    
        y = this.m_drawInf.cnvValueToPosYForPrice(price618);
        if (bgn_y <= y && y <= end_y) {
            if (bgn_string && 20 < end_width){
                canvas.drawStringL("61.8%", x1, y-y_margin, retraceColor);
            }
            if (end_string && 35 < bgn_width){
                let strVal = this.m_common.withDec(price618, dec).toFixed(2);;
                canvas.drawStringR(strVal, x2, y-y_margin, retraceColor);
            }
            canvas.drawLine(retraceColor, bgn_val_x, y, end_val_x, y);
        }
    
        if (num === 5) {
            y = this.m_drawInf.cnvValueToPosYForPrice(price764);
            if (bgn_y <= y && y <= end_y) {
                if (bgn_string && 20 < end_width){
                    canvas.drawStringL("76.4%", x1, y-y_margin, retraceColor);
                }
                if (end_string && 35 < bgn_width){
                    let strVal = this.m_common.withDec(price764, dec).toFixed(2);
                    canvas.drawStringR(strVal, x2, y-y_margin, retraceColor);
                }
                canvas.drawLine(retraceColor, bgn_val_x, y, end_val_x, y);
            }
        }

        y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
        if (bgn_y <= y && y <= end_y) {
            if (bgn_string && 20 < end_width){
                canvas.drawStringL("100.0%", x1, y-y_margin, retraceColor);
            }
            if (end_string && 35 < bgn_width){
                let strVal = this.m_common.withDec(obj.m_endPrice, dec).toFixed(2);;
                canvas.drawStringR(strVal, x2, y-y_margin, retraceColor);
            }
            canvas.drawLine(retraceColor, bgn_val_x, y, end_val_x, y);
        }
    }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] DRAW TOOL DOT LINE
    //==============================================================================
    drawingLine(canvas) {
        if(this.m_drawStart.x < 0 || this.m_drawStart.y < 0){
            return;
        }
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        const lineColor = "white";
        //const selectFillColor = "rgb(125, 210, 240, 0.5)";
        //const start_x = (this.m_drawStart.x < this.m_drawEnd.x)? this.m_drawStart.x : this.m_drawEnd.x;
        //const width = Math.abs(this.m_drawEnd.x - this.m_drawStart.x);
        //canvas.drawFillRect(selectFillColor, lineColor, start_x, chartBgnPosY, width, chartEndPosY - chartBgnPosY);
        const start_x = this.m_drawStart.x;
        const end_x = this.m_drawEnd.x;
        canvas.drawDottedLine(lineColor, start_x, chartBgnPosY, end_x, chartBgnPosY);
        canvas.drawDottedLine(lineColor, start_x, chartBgnPosY, start_x, chartEndPosY);
        canvas.drawDottedLine(lineColor, start_x, chartEndPosY, end_x, chartEndPosY);
        canvas.drawDottedLine(lineColor, end_x, chartBgnPosY, end_x, chartEndPosY);
    }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] JUDGE SELECT OBJECT
    //==============================================================================
    isSelected(i, x, y) {
        const obj = this.m_drawToolList[i];
        const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        const x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        const y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        const y2 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
        if (x1 <= x && x <= x2 && y1 <= y && y <= y2) {
            return true;
        }
        return false;
    }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] SELECT OBJECT DRAW
    //==============================================================================
    drawSelected(canvas, ix) {
        //選択状態のため点線
        this.drawRetraceMent(canvas, ix, 3);
        this.drawSelectedBox(canvas, ix);
    }
    drawSelectedBox(canvas, ix) {
        const obj = this.m_drawToolList[ix];
        const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        const x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        const y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        const y2 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
        const lineColor = "white";
        canvas.drawDottedLine(lineColor, x1, y1, x2, y1);
        canvas.drawDottedLine(lineColor, x1, y1, x1, y2);
        canvas.drawDottedLine(lineColor, x1, y2, x2, y2);
        canvas.drawDottedLine(lineColor, x2, y1, x2, y2);
    }
}
//-------------------------------------------------------------------
// クラス名: ChartDrawRetracement5
//
// クラス概要: フィボナッチリトレースメント(5本)描画クラス
//--------------------------------------------------------------------
export class ChartDrawRetracement5 extends ChartDrawRetracement {
	constructor() {
        super();
    }
    getType = () => { return CD.TECH_TOOL_RETRACE_5; }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT 5] REMOVE OBJECT OVERRIDE
    //==============================================================================
    //==============================================================================
    // [FIBONACCHI RETRACEMENT 5] REMOVE OBJECT OVERRIDE
    //==============================================================================
    //==============================================================================
    // [FIBONACCHI RETRACEMENT 5] DRAW OVERRIDE
    //==============================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if(ix === selectedIX && !fixSelected && isMouseLbtn){
            //選択状態のため点線
            super.drawRetraceMent(canvas, ix, 5);
            super.drawDragObject(canvas, ix, select_x, select_y);
            // ゴミ箱表示
            const mosX = this.m_drawInf.getMousePosX();
            const mosY = this.m_drawInf.getMousePosY();
            super.drawDustbox(canvas, mosX, mosY);
        }else{
            super.drawRetraceMent(canvas, ix, 5);
        }
        return;
    }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] DRAW TOOL DOT LINE OVERRIDE
    //==============================================================================
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] JUDGE SELECT OBJECT OVERRIDE
    //==============================================================================
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] SELECT OBJECT DRAW OVERRIDE
    //==============================================================================
    drawSelected(canvas, ix) {
        //選択状態のため点線
        super.drawRetraceMent(canvas, ix, 5);
        super.drawSelectedBox(canvas, ix);
    }
}
//-------------------------------------------------------------------
// クラス名: ChartDrawCounter
//
// クラス概要: 日柄カウンター描画クラス
//--------------------------------------------------------------------
export class ChartDrawCounter extends ChartTechTool 
{
	constructor() {
        super();
        this.COUNTER_TYPE = 3;
        this.BAR_HEIGHT = 18;
    }
    getType = () => { return CD.TECH_TOOL_COUNTER; }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    add(start_x, start_y, end_x, end_y) {
        if(start_x === end_x) return true;
        
        let obj = new ChartTechToolObj();
        obj.m_selected = DTOOL_NOTOUCH;
        obj.m_drawType = CD.TECH_TOOL_COUNTER;
        
        obj.m_startEntryIndex = start_x >> 0;
        obj.m_endEntryIndex   = end_x >> 0;
        obj.m_startPrice      = start_y;
        obj.m_endPrice        = end_y;

        this.m_drawToolList.push(obj);
        super.clearPos();
        return true;
    }
    //==============================================================================
    //	[COUNTER] MOVE OBJECT
    //==============================================================================
    getNewEPosForMove(ix){
        const obj = this.m_drawToolList[ix];
        const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        const x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        const y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);

        // PUSH位置
        const start_x = this.m_drawStart.x;
        const start_y = this.m_drawStart.y;
        // UP位置
        const end_x = this.m_drawEnd.x;
        const end_y = this.m_drawEnd.y;


        // LEFT側からマウスポインタ(X)までの長さ
        const leftWidth = start_x - x1;
        // マウスポインタ(X)からRIGHT側までの長さ
        const rightWidth = x2 - start_x;
        // TOPからマウスポインタ(Y)までの長さ
        const topHeight = start_y - y1;

        // 開始エントリ及び終了エントリの確定
        const nx1 = end_x - leftWidth;
        const ny1 = end_y - topHeight;
        const nx2 = end_x + rightWidth;

        return [nx1, ny1, nx2];
    }
    move(ix, startEntry, startPrice, endEntry) {

        const obj = this.m_drawToolList[ix];

        if(startEntry < endEntry){
            obj.m_startEntryIndex = startEntry >> 0;
            obj.m_endEntryIndex   = endEntry >> 0;
        }else{
            obj.m_startEntryIndex = endEntry >> 0;
            obj.m_endEntryIndex   = startEntry >> 0;
        }
        obj.m_startPrice = startPrice;

        super.clearPos();
        return true;
    }
    //==================================================================
    // [COUNTER] REMOVE OBJECT
    //==================================================================
    remove(i) {
        return super.remove(i, CD.TECH_TOOL_COUNTER);
    }
    //==================================================================
    // [COUNTER] REMOVE OBJECT
    //==================================================================
    removeAll() {
        return super.removeAll(CD.TECH_TOOL_COUNTER);
    }
    //==================================================================
    // [COUNTER] DRAW
    //==================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if(ix === selectedIX && !fixSelected && isMouseLbtn){
            //選択状態のため点線
            this.drawEntry(canvas, ix);
            this.drawDragObject(canvas, ix, select_x, select_y);
            // ゴミ箱表示
            const mosX = this.m_drawInf.getMousePosX();
            const mosY = this.m_drawInf.getMousePosY();
            super.drawDustbox(canvas, mosX, mosY);
        }else{
            this.drawEntry(canvas, ix);
        }
    }
    //==============================================================================
    // [COUNTER] DRAW COUNTER
    //==============================================================================
    drawEntry(canvas, ix) {
        //通常描画		
        const obj = this.m_drawToolList[ix];
        const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        let x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        const y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        //let yend = this.m_drawInf.getChartAreaEndPosYWithMgn();
        const yend = this.m_drawInf.getChartAreaEndPosY();
        const bar_height = this.BAR_HEIGHT;
        let end_entry = 0;
        if (y <= yend) {
            let gap = Math.abs(obj.m_startEntryIndex - obj.m_endEntryIndex) + 1;
            let percent = this.getPercentageOfChange(obj.m_startEntryIndex, obj.m_endEntryIndex);
            percent = this.drawCounter(canvas, x1, x2, y, gap, percent);
            let counter_type = this.COUNTER_TYPE; // 方式が２種類あるためフィボナッチを採用
            if (counter_type === 2) {
                //単純2倍
                if (x1 < x2) {
                    end_entry = obj.m_endEntryIndex + gap;
                } else {
                    end_entry = obj.m_endEntryIndex - gap;
                }
                percent = this.getPercentageOfChange(obj.m_startEntryIndex, end_entry);
                x2 = this.getEntryToPosForTool(end_entry);
                percent = this.drawCounter(canvas, x1, x2, y + bar_height, gap + gap, percent);
                if (x1 < x2) {
                    end_entry = obj.m_endEntryIndex + gap + gap;
                } else {
                    end_entry = obj.m_endEntryIndex - gap - gap;
                }
                percent = this.getPercentageOfChange(obj.m_startEntryIndex, end_entry);
                x2 = this.getEntryToPosForTool(end_entry);
                percent = this.drawCounter(canvas, x1, x2, y + (bar_height * 2), gap + gap + gap, percent);
                // 最右位置退避(固有拡張)
                obj.m_lastBarEnd = x2;
            } else if (counter_type === 3) {
                //フィボナッチ比率 0.618 : 1 : 1.618
                let gap1 = Math.floor(gap / 0.618 + 0.5);
                if (x1 < x2) {
                    end_entry = obj.m_startEntryIndex + gap1 - 1;
                } else {
                    end_entry = obj.m_startEntryIndex - gap1 + 1;
                }
                percent = this.getPercentageOfChange(obj.m_startEntryIndex, end_entry);
                x2 = this.getEntryToPosForTool(end_entry);
                percent = this.drawCounter(canvas, x1, x2, y + bar_height, gap1, percent);
                let gap2 = Math.floor(1.618 * gap / 0.618 + 0.5);
                if (x1 < x2) {
                    end_entry = obj.m_startEntryIndex + gap2 - 1;
                } else {
                    end_entry = obj.m_startEntryIndex - gap2 + 1;
                }
                percent = this.getPercentageOfChange(obj.m_startEntryIndex, end_entry);
                x2 = this.getEntryToPosForTool(end_entry);
                percent = this.drawCounter(canvas, x1, x2, y + (bar_height * 2), gap2, percent);
                // 最右位置退避(固有拡張)
                obj.m_lastBarEnd = x2;
            }
        }
    }
    //==============================================================================
    //	[COUNTER] DRAG OBJECT
    //==============================================================================
    drawDragObject(canvas, ix, select_x, select_y) {

        // PUSH開始位置有効値判定
        if(this.m_drawStart.x < 0 || this.m_drawStart.y < 0){
            return;
        }

        const obj = this.m_drawToolList[ix];
        const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        let x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        if(obj.m_lastBarEnd !== undefined && 0 < obj.m_lastBarEnd) {
            x2 = obj.m_lastBarEnd;
        }
        const y1  = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        const y2  = y1 + this.BAR_HEIGHT * 3;

        // LEFT側からマウスポインタ(X)までの長さ
        const leftWidth = this.m_drawStart.x - x1;
        // マウスポインタ(X)からRIGHT側までの長さ
        const rightWidth = x2 - this.m_drawStart.x;
        // TOPからマウスポインタ(Y)までの長さ
        const topHeight = this.m_drawStart.y - y1;
        // マウスポインタ(Y)からBOTTOMまでの長さ
        const btmHeight = y2 - this.m_drawStart.y;
        
        // LEFT側開始位置
        const staX = this.m_drawEnd.x - leftWidth;
        const endX = this.m_drawEnd.x + rightWidth;
        const staY = this.m_drawEnd.y - topHeight;
        const endY = this.m_drawEnd.y + btmHeight;

        const lineColor = "white";
        canvas.drawDottedLine(lineColor, staX, staY, endX, staY);
        canvas.drawDottedLine(lineColor, staX, staY, staX, endY);
        canvas.drawDottedLine(lineColor, staX, endY, endX, endY);
        canvas.drawDottedLine(lineColor, endX, staY, endX, endY);
    }
    //==============================================================================
    // [COUNTER] DRAWING
    //==============================================================================
    drawingLine(canvas) {
        const info = this.m_common.m_info;
        const ybgn = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        const yend = this.m_drawInf.getChartAreaEndPosYWithMgn();
        const xbgn = this.m_drawInf.getChartAreaBgnPosX();
        const xend = this.m_drawInf.getChartAreaEndPosX();
        const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.COUNTER_VT.c)

        if(ybgn < this.m_drawStart.y && this.m_drawStart.y < yend){
            if(xbgn < this.m_drawStart.x && this.m_drawStart.x < xend){
                if (xend < this.m_drawEnd.x) this.m_drawEnd.x = xend;
                if (this.m_drawEnd.x < xbgn) this.m_drawEnd.y = xbgn;
                let dummy_end = xbgn + info.getDummyEntryWidth();
                if (this.m_drawEnd.x < dummy_end){
                    this.m_drawEnd.x = dummy_end;
                }
                //X軸位置修正
                this.m_drawStart.x = super.getEntryToPosForTool(this.m_drawStartEntry);
                this.m_drawEnd.x = super.getEntryToPosForTool(this.m_drawEndEntry);

                canvas.drawLine(lineColor, this.m_drawStart.x, ybgn, this.m_drawStart.x, yend);
                const gap = Math.abs(this.m_drawEndEntry - this.m_drawStartEntry) + 1;
                let percent = 0.0;
                if(this.m_drawStartEntry < this.m_drawEndEntry){
                    percent = this.getPercentageOfChange(this.m_drawStartEntry, this.m_drawEndEntry);
                }else{
                    percent = this.getPercentageOfChange(this.m_drawEndEntry, this.m_drawStartEntry);
                }
                percent = this.drawCounter(canvas, this.m_drawStart.x, this.m_drawEnd.x, this.m_drawStart.y, gap, percent);
                canvas.drawLine(lineColor, this.m_drawEnd.x, ybgn, this.m_drawEnd.x, yend );
                const counter_type = this.COUNTER_TYPE;
                const bar_height = this.BAR_HEIGHT;
                let end_entry = 0;
                if(counter_type === 2){
                    // 単純2倍
                    if(this.m_drawStartEntry < this.m_drawEndEntry){
                        end_entry = (this.m_drawEndEntry + gap) >> 0;
                    }else{
                        end_entry = (this.m_drawEndEntry - gap) >> 0;
                    }
                    this.m_drawEnd.x = super.getEntryToPosForTool(end_entry);
                    percent = this.getPercentageOfChange(this.m_drawStartEntry, end_entry);
                    percent = this.drawCounter(canvas, this.m_drawStart.x, this.m_drawEnd.x, this.m_drawStart.y + bar_height, gap + gap, percent);
                    canvas.drawLine(lineColor, this.m_drawEnd.x, ybgn, this.m_drawEnd.x, yend );
                    
                    if(this.m_drawStartEntry < this.m_drawEndEntry){
                        end_entry = (this.m_drawEndEntry + gap + gap) >> 0;
                        percent = this.getPercentageOfChange(this.m_drawStartEntry, end_entry);
                    }else if(this.m_drawEndEntry < this.m_drawStartEntry){
                        end_entry = (this.m_drawEndEntry - gap - gap) >> 0;
                        percent = this.getPercentageOfChange(end_entry, this.m_drawStartEntry);
                    }else{
                        return;
                    }
                    this.m_drawEnd.x = super.getEntryToPosForTool(end_entry);
                    percent = this.drawCounter(canvas, this.m_drawStart.x, this.m_drawEnd.x, this.m_drawStart.y + (bar_height*2), gap + gap + gap, percent);
                    canvas.drawLine(lineColor, this.m_drawEnd.x, ybgn, this.m_drawEnd.x, yend );
                }else if(counter_type === 3){
                    // フィボナッチ比率 0.618 : 1 : 1.618
                    let gap1 = Math.floor(gap / 0.618 + 0.5);
                    if(this.m_drawStartEntry < this.m_drawEndEntry){
                        end_entry = (this.m_drawStartEntry + gap1 - 1) >> 0;
                        percent = this.getPercentageOfChange(this.m_drawStartEntry, end_entry);
                    }else if(this.m_drawEndEntry < this.m_drawStartEntry){
                        end_entry = (this.m_drawStartEntry - gap1 + 1) >> 0;
                        percent = this.getPercentageOfChange(end_entry, this.m_drawStartEntry);
                    }else{
                        return;
                    }
                    this.m_drawEnd.x = super.getEntryToPosForTool(end_entry);
                    percent = this.drawCounter(canvas, this.m_drawStart.x, this.m_drawEnd.x, this.m_drawStart.y + bar_height, gap1, percent);
                    canvas.drawLine(lineColor, this.m_drawEnd.x, ybgn, this.m_drawEnd.x, yend );

                    let gap2 = Math.floor(1.618 * gap / 0.618 + 0.5);
                    if(this.m_drawStartEntry < this.m_drawEndEntry){
                        end_entry = (this.m_drawStartEntry + gap2 - 1) >> 0;
                        percent = this.getPercentageOfChange(this.m_drawStartEntry, end_entry);
                    }else{
                        end_entry = (this.m_drawStartEntry - gap2 + 1) >> 0;
                        percent = this.getPercentageOfChange(end_entry, this.m_drawStartEntry);
                    }
                    this.m_drawEnd.x = super.getEntryToPosForTool(end_entry);
                    percent = this.drawCounter(canvas, this.m_drawStart.x, this.m_drawEnd.x, this.m_drawStart.y + (bar_height*2), gap2, percent);
                    canvas.drawLine(lineColor, this.m_drawEnd.x, ybgn, this.m_drawEnd.x, yend );
                }

            }
        }
    }
    //==============================================================================
    //	[COUNTER] SELECT OBJECT DRAW
    //==============================================================================
    drawCounter(canvas, x1, x2, y, gap, pcent) {
        let strVal;
        let w = Math.abs(x2 - x1);
        let height = 14;
        let percent = pcent;
        if(percent === CD.INDEX_NO_VALUE){
            strVal = Math.floor(gap) + "(--)";
        }else{
            if(w < 50){
                strVal = '' + Math.floor(gap);
            }else{
                let strSign = '';
                let val = percent.toFixed(1);
                if (0 < val) {
                    strSign = '+'; 
                }
                strVal = Math.floor(gap) + "(" + strSign + percent.toFixed(1) + "%)";
            }
        }
        let ybgn = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let yend = this.m_drawInf.getChartAreaEndPosYWithMgn();
        if (y < ybgn + 2) return;
        if (yend - 2 < y) return;
        let xbgn = this.m_drawInf.getChartAreaBgnPosX();
        let xend = this.m_drawInf.getChartAreaEndPosX();
        if(0 < w){
            let bgn = x1;
            let end = x2;
            if(x2 < x1){
                bgn = x2;
                end = x1;
            }
            if(xend < end){
                end = xend;
            }
            let wdh = end - bgn;
            canvas.drawBlendRect(this.m_drawParam.getColor(this.m_drawParam.m_color.COUNTER_VT.c), "white", 0.5, bgn, y, wdh, height);
            let str_pos = bgn + (wdh >> 1);
            if((10 < str_pos) && (bgn < xend)){
                //CDP::SetFont(qpt, CDPC::FONT_MIN_TXT);
                canvas.drawStringC(strVal, str_pos, y, "white");
            }
        }
        return percent;
    }
    //==============================================================================
    //	[COUNTER] 騰落率取得
    //==============================================================================
    getPercentageOfChange(bgn_ix, end_ix) {
        let info = this.m_common.m_info;
        let hist = info.getCurrentHist();
        let size = hist.mChartList.length;
        if (size <= bgn_ix || size <= end_ix || bgn_ix < 0 || end_ix < 0) return CD.INDEX_NO_VALUE;
        let start_price = hist.mChartList[bgn_ix].mClosePrice;
        let end_price   = hist.mChartList[end_ix].mClosePrice;
        let percentage  = (end_price - start_price) * 100 / end_price;
        return percentage;
    }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] JUDGE SELECT OBJECT
    //==============================================================================
    isSelected(ix, x, y) {
        const obj = this.m_drawToolList[ix];
        const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        let x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        if(obj.m_lastBarEnd !== undefined && 0 < obj.m_lastBarEnd) {
            x2 = obj.m_lastBarEnd;
        }
        const y1  = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        const y2  = y1 + this.BAR_HEIGHT * 3;
        if (x1 <= x && x <= x2 && y1 <= y && y <= y2) {
            return true;
        }
        return false;
    }
    //==============================================================================
    // [FIBONACCHI RETRACEMENT] SELECT OBJECT DRAW
    //==============================================================================
    drawSelected(canvas, ix) {
        //選択状態のため点線
        this.drawEntry(canvas, ix);
        this.drawSelectedBox(canvas, ix);
    }
    drawSelectedBox(canvas, ix) {
        const obj = this.m_drawToolList[ix];
        const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        let x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        if(obj.m_lastBarEnd !== undefined && 0 < obj.m_lastBarEnd) {
            x2 = obj.m_lastBarEnd;
        }
        const y1  = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        const y2  = y1 + this.BAR_HEIGHT * 3;
        const lineColor = "white";
        canvas.drawDottedLine(lineColor, x1, y1, x2, y1);
        canvas.drawDottedLine(lineColor, x1, y1, x1, y2);
        canvas.drawDottedLine(lineColor, x1, y2, x2, y2);
        canvas.drawDottedLine(lineColor, x2, y1, x2, y2);
    }
}
//-------------------------------------------------------------------
// クラス名: ChartDrawPentagon
//
// クラス概要: ペンタゴン描画クラス
//--------------------------------------------------------------------
const UP_TOP= 0;	    // 頂点(時計回り)
const UP_RU = 1;	    // 右上
const UP_RD = 2;		// 右下
const UP_LD = 3;		// 左下
const UP_LU = 4;		// 左上
const UP_TOP_EDGE= 5;   // 頂点
const UP_RU_EDGE = 6;	// 右上
const UP_RD_EDGE = 7;	// 右下
const UP_LD_EDGE = 8;	// 左下
const UP_LU_EDGE = 9;	// 左上

const DN_BTM= 0;    	// 頂点(反時計回り)
const DN_RU = 1;		// 左下
const DN_RD = 2;		// 左上
const DN_LD = 3;		// 右上
const DN_LU = 4;		// 右下
const DN_BTM_EDGE= 5;   // 頂点
const DN_RU_EDGE = 6;	// 左下
const DN_RD_EDGE = 7;	// 左上
const DN_LD_EDGE = 8;	// 右上
const DN_LU_EDGE = 9;	// 右下

const BASE_NUM = 5; 	// 正五角形
const ALL_SELECT = 99;  // 五角形内

export class ChartDrawPentagon extends ChartTechTool
{
    constructor() {
        super();
        this.m_up_angle = false;
        this.m_selected_pos = 0;
        this.m_curx_arry = new Array(BASE_NUM);
        this.m_cury_arry = new Array(BASE_NUM);
    }
    getType = () => { return CD.TECH_TOOL_PENTAGON; }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    add(start_x, start_y, end_x, end_y) {
        if(start_x === end_x) return true;
        
        let obj = new ChartTechToolObj();
        obj.m_selected = DTOOL_NOTOUCH;
        obj.m_drawType = CD.TECH_TOOL_PENTAGON;
        
        obj.m_startEntryIndex = end_x >> 0;	//移動後をセット
        obj.m_endEntryIndex   = end_x >> 0;
        obj.m_startPrice      = start_y;
        obj.m_endPrice        = end_y;

        this.removeAll();
        this.m_drawToolList.push(obj);
        super.clearPos();
        return true;
    }
    //==============================================================================
    //	[PENTAGON] MOVE OBJECT
    //==============================================================================
    move(ix, start_x, start_y, end_x, end_y) {
        let obj = this.m_drawToolList[ix];

        if(obj.m_drawType !== CD.TECH_TOOL_PENTAGON){
            super.clearPos();
            return false;
        }

        obj.m_startEntryIndex = end_x >> 0;	//移動後をセット
        obj.m_endEntryIndex   = end_x >> 0;
        obj.m_startPrice      = start_y;
        obj.m_endPrice        = end_y;

        super.clearPos();
        return true;
    }
    //==============================================================================
    //	[PENTAGON] REMOVE OBJECT
    //==============================================================================
    remove(i) {
        return super.remove(i, CD.TECH_TOOL_PENTAGON);
    }
    //==============================================================================
    //	[PENTAGON] REMOVE OBJECT
    //==============================================================================
    removeAll() {
        return super.removeAll(CD.TECH_TOOL_PENTAGON);
    }
    //==============================================================================
    //	[PENTAGON] DRAW
    //==============================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if (ix === selectedIX && !fixSelected && isMouseLbtn) {
            //選択状態のため点線
            this.drawDragObject(canvas, ix, select_x, select_y);
            // ゴミ箱表示
            const mosX = this.m_drawInf.getMousePosX();
            const mosY = this.m_drawInf.getMousePosY();
            super.drawDustbox(canvas, mosX, mosY);
            return;
        }
        //通常描画
        let obj = this.m_drawToolList[ix];
        const ybgn = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        const yend = this.m_drawInf.getChartAreaEndPosYWithMgn();
        const xbgn = this.m_drawInf.getChartAreaBgnPosX();
        const xend = this.m_drawInf.getChartAreaEndPosX();

        let xpos = super.getEntryToPosForTool(obj.m_startEntryIndex);
        const bgn_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        const end_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
        const len = Math.abs(bgn_y - end_y);
        let x = new Array(BASE_NUM);
        let y = new Array(BASE_NUM);
        const colorPenta = this.m_drawParam.getColor(this.m_drawParam.m_color.PENTA.c);

        // ベースペンタ向き判定フラグ
        let base_up_angle;

        if (xpos < 0) {
            xpos += xbgn;
        }

        // ベースペンタ作成
        if(bgn_y < end_y){
            base_up_angle = false;
            this.getBaseDnPenta(len, xpos, bgn_y, x, y);
            this.drawPenta(canvas, colorPenta, x, y);
        }else{
            base_up_angle = true;
            this.getBaseUpPenta(len, xpos, bgn_y, x, y);
            this.drawPenta(canvas, colorPenta, x, y);
        }

        let auto_mode = true;

        // 自動ペンタ作成
        if (auto_mode) {
            let ret = true;
            let up_angle = base_up_angle;
            let cur_x = x.slice();
            let cur_y = y.slice();
            let next_x = new Array(BASE_NUM);
            let next_y = new Array(BASE_NUM);
            let loop_cnt = 0;
            while (ret) {
                loop_cnt++;
                if(20 < loop_cnt){
                    break;
                }
                let flat_stat = false;
                if (!up_angle) {	// 下向き処理
                    flat_stat = this.checkNextUpOverPenta(cur_x, cur_y);
                    if (flat_stat) {
                        this.getDnOverPenta(cur_x, cur_y, next_x, next_y);
                        this.drawPenta(canvas, colorPenta, next_x, next_y);
                    }
                }else{			    // 上向き処理
                    flat_stat = this.checkNextDnUnderPenta(cur_x, cur_y);
                    if (flat_stat) {
                        this.getUpUnderPenta(cur_x, cur_y, next_x, next_y);
                        this.drawPenta(canvas, colorPenta, next_x, next_y);
                    }
                }

                if (flat_stat) {
                    // OVER && UNDER 描画有り　フラット
                    let is_over;
                    [ret, is_over] = this.checkNextPentaIsOver(cur_x, cur_y);
                    if(is_over){
                        // 上ペンタへの追加確定
                        if(!up_angle){
                            // 下向きの場合はカレントペンタ入れ替え
                            up_angle = true;
                            cur_x = next_x.slice();
                            cur_y = next_y.slice();
                        }
                    }else{
                        // 下ペンタへの追加確定
                        if(up_angle){
                            // 上向きの場合はカレントペンタ入れ替え
                            up_angle = false;
                            cur_x = next_x.slice();
                            cur_y = next_y.slice();
                        }
                    }
                }

                if (!up_angle) { // 下向き処理
                    up_angle = true;
                    let down_stat, right_stat;
                    [ret, down_stat, right_stat] = this.checkNextUpPenta(cur_x, cur_y);
                    if(ret){
                        if(down_stat){
                            this.getDnDownPenta(cur_x, cur_y, next_x, next_y);
                            this.drawPenta(canvas, colorPenta, next_x, next_y);
                        }else if(right_stat){
                            this.getDnRightPenta(cur_x, cur_y, next_x, next_y);
                            this.drawPenta(canvas, colorPenta, next_x, next_y);
                        }else{
                            ret = false;
                        }
                    }
                }else{			 // 上向き処理
                    up_angle = false;
                    let up_stat, right_stat;
                    [ret, up_stat, right_stat] = this.checkNextDnPenta(cur_x, cur_y);
                    if(ret){
                        if(up_stat){
                            this.getUpUpPenta(cur_x, cur_y, next_x, next_y);
                            this.drawPenta(canvas, colorPenta, next_x, next_y);
                        }else if(right_stat){
                            this.getUpRightPenta( cur_x, cur_y, next_x, next_y);
                            this.drawPenta(canvas, colorPenta, next_x, next_y);
                        }else{
                            ret = false;
                        }
                    }
                }
                cur_x = next_x.slice();
                cur_y = next_y.slice();
                if(!ret) break;
            }
        }        
    }
    //==============================================================================
    //	[PENTAGON] DRAG OBJECT 
    //==============================================================================
    drawDragObject(canvas, ix, select_x, select_y) {
        // ドラッグ状態描画
        let obj = this.m_drawToolList[ix];
        const xpos = super.getEntryToPosForTool(obj.m_startEntryIndex);
        const bgn_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        const end_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
        const len  = Math.abs(bgn_y - end_y);

        // マウス位置取得
        let mpos_x = this.m_drawInf.getMousePosX();
        let mpos_y = this.m_drawInf.getMousePosY();

        if (bgn_y < end_y) {
            this.m_drawStart.y = mpos_y;
            this.m_drawEnd.y = mpos_y + len;
        } else {
            this.m_drawStart.y = mpos_y;
            this.m_drawEnd.y = mpos_y - len;
        }
        this.m_drawStart.x = mpos_x;
        this.m_drawEnd.x = mpos_x;

        //mSelectedPos →ドラッグ箇所退避
        this.m_selectedStart.x = mpos_x;
        this.m_selectedStart.y = this.m_drawStart.y;
        this.m_selectedEnd.x = mpos_x;
        this.m_selectedEnd.y = this.m_drawEnd.y;

        this.drawingLine(canvas);
    }
    //==============================================================================
    //	[PENTAGON] DRAW TOOL DOT LINE
    //==============================================================================
    drawingLine(canvas) {
        const ybgn = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        const yend = this.m_drawInf.getChartAreaEndPosYWithMgn();
        const xbgn = this.m_drawInf.getChartAreaBgnPosX();
        const xend = this.m_drawInf.getChartAreaEndPosX();
        if (ybgn < this.m_drawStart.y && this.m_drawStart.y < yend){
            let x = new Array(BASE_NUM);
            let y = new Array(BASE_NUM);
            this.m_drawStart.x = this.m_drawEnd.x; //スライドさせる
            const xpos = this.m_drawStart.x;
            const ypos = this.m_drawStart.y;
            const len  = Math.abs(this.m_drawStart.y - this.m_drawEnd.y);
            if (this.m_drawStart.y < this.m_drawEnd.y) {
                this.getBaseDnPenta(len, xpos, ypos, x, y);
            } else {
                this.getBaseUpPenta(len, xpos, ypos, x, y);
            }
            this.drawingPenta(canvas, 'white', x, y);
        }
    }
    //==============================================================================
    //	[PENTAGON] DRAW PENTAGON MAIN
    //==============================================================================
    drawPenta(canvas, color, x, y) {
        canvas.drawLine(color, x[0], y[0], x[1], y[1]);
        canvas.drawLine(color, x[1], y[1], x[2], y[2]);
        canvas.drawLine(color, x[2], y[2], x[3], y[3]);
        canvas.drawLine(color, x[3], y[3], x[4], y[4]);
        canvas.drawLine(color, x[4], y[4], x[0], y[0]);

        canvas.drawLine(color, x[0], y[0], x[2], y[2]);
        canvas.drawLine(color, x[1], y[1], x[3], y[3]);
        canvas.drawLine(color, x[2], y[2], x[4], y[4]);
        canvas.drawLine(color, x[3], y[3], x[0], y[0]);
        canvas.drawLine(color, x[4], y[4], x[1], y[1]);
    }
    //==============================================================================
    //	[PENTAGON] DRAWING PENTAGON
    //==============================================================================
    drawingPenta(canvas, color, x, y) {
        canvas.drawDottedLine(color, x[0], y[0], x[1], y[1]);
        canvas.drawDottedLine(color, x[1], y[1], x[2], y[2]);
        canvas.drawDottedLine(color, x[2], y[2], x[3], y[3]);
        canvas.drawDottedLine(color, x[3], y[3], x[4], y[4]);
        canvas.drawDottedLine(color, x[4], y[4], x[0], y[0]);

        canvas.drawDottedLine(color, x[0], y[0], x[2], y[2]);
        canvas.drawDottedLine(color, x[1], y[1], x[3], y[3]);
        canvas.drawDottedLine(color, x[2], y[2], x[4], y[4]);
        canvas.drawDottedLine(color, x[3], y[3], x[0], y[0]);
        canvas.drawDottedLine(color, x[4], y[4], x[1], y[1]);

        let bgn_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, x[3]);
        let end_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, x[2]);
        //向き判定
        let ix1, ix2, str_y;
        if(y[UP_TOP] < y[UP_RD]){
            ix1 = UP_LD;
            ix2 = UP_RD;
            str_y = y[ix2] - 14;
        }else{
            ix1 = DN_RD;
            ix2 = DN_LD;
            str_y = y[ix1];
        }
        let strval = '' + Math.abs(end_entry - bgn_entry);
        canvas.drawStringC(strval, x[ix1] + ((x[ix2] - x[ix1]) >> 1), str_y, color);
    }
    //==============================================================================
    //	[PENTAGON] CHECK NEXT PENTAGON (OVER && UNDER)
    //==============================================================================
    checkNextPentaIsOver(x, y) {
        // 上段へ描画する場合はtrue
        let info = this.m_common.m_info;
        let hist = info.getCurrentHist();
        const size = info.getCurHistSize();
        let right_ix; // 最右端のエントリ
        // 向き判定
        if(y[UP_TOP] < y[UP_RD]){
            right_ix = UP_RU;
        }else{
            right_ix = DN_LU;
        }
        // 最右端位置かたエントリ取得
        let entry = this.m_common.getPosToEntryForExt(this.m_drawInf, x[right_ix]);
        let last_ix = size - 1;
        if (last_ix < entry) {
            return [true, false];
        }
        // 最右端エントリ終値 上段 OR 下段判定
        let is_over = false;
        for (let i = entry; i <= last_ix; i++) {
            let obj = hist.mChartList[i];
            let ypos = this.m_drawInf.cnvValueToPosYForPrice(obj.mClosePrice);
            if(y[right_ix] === ypos){
                continue;
            }
            if(ypos < y[right_ix]){
                is_over = true;		//上段
            }else{
                is_over = false;	//下段
            }
            break;
        }
        return [true, is_over];
    }
    //==============================================================================
    //	[PENTAGON] CHECK NEXT PENTAGON (CURRENT = UPWARD)
    //==============================================================================
    checkNextDnPenta(x, y) {
        let info = this.m_common.m_info;
        let hist = info.getCurrentHist();
        const size = info.getCurHistSize();
        let stat_up = false;
        let stat_right = false;
        let right_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, x[UP_RU]);
        let next_entry = right_entry + 1;
        let last_ix = size - 1;
        if(last_ix < next_entry){
            return [false, stat_up, stat_right];
        }
        for(let i = next_entry; i <= last_ix; i++){
            let obj = hist.mChartList[i];
            let ypos = this.m_drawInf.cnvValueToPosYForPrice(obj.mClosePrice);
            if(y[UP_RU] == ypos){
                continue;
            }
            if(ypos < y[UP_RU]){
                stat_up = true;
            }else if(y[UP_RU] < ypos){
                stat_right = true;
            }
            break;
        }
        return [true, stat_up, stat_right];
    }
    //==============================================================================
    //	[PENTAGON] CHECK UNDER PENTAGON (CURRENT = UPWARD)
    //==============================================================================
    checkNextDnUnderPenta(x, y) {
        let info = this.m_common.m_info;
        let hist = info.getCurrentHist();
        const size = info.getCurHistSize();

        let bgn_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, x[UP_LD]);
        if (bgn_entry < 0) bgn_entry = 0;
        let end_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, x[UP_RD]);
        if (size <= end_entry) end_entry = size - 1;
        const check_ypos = y[UP_LD];
        for (let i = bgn_entry; i <= end_entry; i++) {
            let obj = hist.mChartList[i];
            const ypos = this.m_drawInf.cnvValueToPosYForPrice(obj.mClosePrice);
            if(check_ypos < ypos){
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	[PENTAGON] CHECK NEXT PENTAGON (CURRENT = DOWNWARD)
    //==============================================================================
    checkNextUpPenta(x, y) {
        let info = this.m_common.m_info;
        let hist = info.getCurrentHist();
        const size = info.getCurHistSize();

        let stat_down = false;
        let stat_right = false
        let right_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, x[DN_LU]);
        let next_entry = right_entry + 1;
        let last_ix = size - 1;
        if (last_ix < next_entry) {
            return [false, stat_down, stat_right];
        }
        for (let i = next_entry; i <= last_ix; i++) {
            let obj = hist.mChartList[i];
            const ypos = this.m_drawInf.cnvValueToPosYForPrice(obj.mClosePrice);
            if(y[DN_LU] === ypos){
                continue;
            }
            if(ypos < y[DN_LU]){
                stat_right = true;
            }else if(y[DN_LU] < ypos){
                stat_down = true;
            }
            break;
        }
        return [true, stat_down, stat_right];
    }
    //==============================================================================
    //	[PENTAGON] CHECK OVER PENTAGON (CURRENT = DOWNWARD)
    //==============================================================================
    checkNextUpOverPenta(x, y) {
        let info = this.m_common.m_info;
        let hist = info.getCurrentHist();
        const size = info.getCurHistSize();

        let bgn_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, x[DN_RD]);
        if (bgn_entry < 0) bgn_entry = 0;
        let end_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, x[DN_LD]);
        if (size <= end_entry) end_entry = size - 1;
        let check_ypos = y[DN_LD];
        for (let i = bgn_entry; i <= end_entry; i++){
            let obj = hist.mChartList[i];
            const ypos = this.m_drawInf.cnvValueToPosYForPrice(obj.mClosePrice);
            if(ypos < check_ypos){
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	[PENTAGON] GET BASE PENTAGON (UPWARD)
    //==============================================================================
    getBaseUpPenta(len, xpos, ypos, x, y) {
        let rad = 72;
        for(let i = 0; i < BASE_NUM; i++){   
            x[i] = xpos + (Math.sin((rad * i) / 180 * 3.14) * len) >> 0;
            y[i] = ypos - (Math.cos((rad * i) / 180 * 3.14) * len) >> 0;
        }
        if(y[DN_LU] != y[DN_RU]){
            y[DN_RU] = y[DN_LU];
        }
        if(y[DN_LD] != y[DN_RD]){
            y[DN_RD] = y[DN_LD];
        }
    }
    //==============================================================================
    //	[PENTAGON] GET BASE PENTAGON (UPWARD)
    //==============================================================================
    getBaseDnPenta(len, xpos, ypos, x, y) {
        let rad = 72;
        for(let i = 0; i < BASE_NUM; i++){   
            x[i] = xpos - (Math.sin((rad * i) / 180 * 3.14) * len) >> 0;
            y[i] = ypos + (Math.cos((rad * i) / 180 * 3.14) * len) >> 0;
        }
        if(y[UP_LU] !== y[UP_RU]){
            y[UP_RU] = y[UP_LU];
        }
        if(y[UP_LD] !== y[UP_RD]){
            y[UP_RD] = y[UP_LD];
        }
    }
    //==============================================================================
    //	[PENTAGON] GET POSITION (DOWNWARD)
    //==============================================================================
    getUpUpPenta(in_x, in_y, out_x, out_y) {
        out_x[DN_BTM] = in_x[UP_RU];
        out_y[DN_BTM] = in_y[UP_RU];
        out_x[DN_RU] = in_x[UP_TOP];
        out_y[DN_RU] = in_y[UP_TOP];

        out_x[DN_LU] = in_x[UP_TOP] + (in_x[UP_RU] - in_x[UP_LU]);
        out_y[DN_LU] = in_y[UP_TOP];

        let length = (in_x[UP_RD] - in_x[UP_LD]);
        out_x[DN_RD] = in_x[UP_RU] - (length >> 1);
        out_y[DN_RD] = in_y[UP_RU] - (in_y[UP_RD] - in_y[UP_TOP]);

        out_x[DN_LD] = out_x[DN_RD] + length;
        out_y[DN_LD] = out_y[DN_RD];
    }
    getUpRightPenta(in_x, in_y, out_x, out_y) {
        out_x[DN_RD] = in_x[UP_RU];
        out_y[DN_RD] = in_y[UP_RU];
        out_x[DN_RU] = in_x[2];
        out_y[DN_RU] = in_y[2];
    
        out_x[DN_LD] = in_x[UP_RU] + (in_x[UP_RD] - in_x[UP_LD]);
        out_y[DN_LD] = in_y[UP_RU];
    
        let length = (in_x[UP_RU] - in_x[UP_LU]);
        out_x[DN_BTM] = in_x[UP_RD] + (length >> 1);
        out_y[DN_BTM] = in_y[UP_RU] + (in_y[UP_RD] - in_y[UP_TOP]);
    
        out_x[DN_LU] = out_x[DN_RU] + length;
        out_y[DN_LU] = out_y[DN_RU];
    }
    getUpUnderPenta(in_x, in_y, out_x, out_y) {
        out_x[DN_RD] = in_x[UP_LD];
        out_y[DN_RD] = in_y[UP_LD];
        out_x[DN_LD] = in_x[UP_RD];
        out_y[DN_LD] = in_y[UP_RD];
    
        out_x[DN_BTM] = in_x[UP_TOP];
        out_y[DN_BTM] = in_y[UP_RD] + (in_y[UP_RD] - in_y[UP_TOP]);
    
        out_x[DN_LU] = in_x[UP_RU];
        out_y[DN_LU] = in_y[UP_RD] + (in_y[UP_RD] - in_y[UP_RU]);
    
        out_x[DN_RU] = in_x[UP_LU];
        out_y[DN_RU] = out_y[DN_LU];
    }
    //==============================================================================
    //	[PENTAGON] GET POSITION (UPWARD)
    //==============================================================================
    getDnDownPenta(in_x, in_y, out_x, out_y) {
        out_x[UP_TOP] = in_x[DN_LU];
        out_y[UP_TOP] = in_y[DN_LU];
        out_x[UP_LU] = in_x[DN_BTM];
        out_y[UP_LU] = in_y[DN_BTM];

        out_x[UP_RU] = in_x[DN_BTM] + (in_x[DN_LU] - in_x[DN_RU]);
        out_y[UP_RU] = in_y[DN_BTM];

        let length = (in_x[DN_LD] - in_x[DN_RD]);
        out_x[UP_LD] = in_x[DN_LU] - (length >> 1);
        out_y[UP_LD] = in_y[DN_LU] + (in_y[DN_BTM] - in_y[DN_RD]);

        out_x[UP_RD] = out_x[UP_LD] + length;
        out_y[UP_RD] = out_y[UP_LD];

    }
    getDnRightPenta(in_x, in_y, out_x, out_y) {
        out_x[UP_LD] = in_x[DN_LU];
        out_y[UP_LD] = in_y[DN_LU];
        out_x[UP_LU] = in_x[DN_LD];
        out_y[UP_LU] = in_y[DN_LD];

        out_x[UP_RU] = in_x[DN_LD] + (in_x[DN_LU] - in_x[1]);
        out_y[UP_RU] = in_y[DN_LD];

        out_x[UP_RD] = in_x[DN_LU] + (in_x[DN_LD] - in_x[DN_RD]);
        out_y[UP_RD] = out_y[UP_LD];

        let length = (in_x[DN_LU] - in_x[DN_RU]);
        out_x[UP_TOP] = in_x[DN_LD] + (length >> 1);
        out_y[UP_TOP] = in_y[DN_LU] - (in_y[0] - in_y[DN_RD]);
    }
    getDnOverPenta(in_x, in_y, out_x, out_y) {
        out_x[UP_RD] = in_x[DN_LD];
        out_y[UP_RD] = in_y[DN_LD];
        out_x[UP_LD] = in_x[DN_RD];
        out_y[UP_LD] = in_y[DN_RD];

        out_x[UP_TOP] = in_x[DN_BTM];
        out_y[UP_TOP] = in_y[DN_RD] + (in_y[DN_RD] - in_y[DN_BTM]);

        out_x[UP_LU] = in_x[DN_RU];
        out_y[UP_LU] = in_y[DN_RD] + (in_y[DN_RD] - in_y[DN_RU]);

        out_x[UP_RU] = in_x[DN_LU];
        out_y[UP_RU] = out_y[UP_LU];
    }
    //==============================================================================
    //	[PENTAGON] JUDGE SELECT OBJECT
    //==============================================================================
    isSelected(i, x, y) {

        let obj = this.m_drawToolList[i];
        let bgn_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        let end_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
        let len  = Math.abs(bgn_y - end_y);
        let xpos = super.getEntryToPosForTool(obj.m_startEntryIndex);
        this.m_up_angle = false;

        // ベースペンタ取得
        if (bgn_y < end_y) {
            this.m_up_angle = false;
            this.getBaseDnPenta(len, xpos, bgn_y, this.m_curx_arry, this.m_cury_arry); 
        }else{
            this.m_up_angle = true;
            this.getBaseUpPenta(len, xpos, bgn_y, this.m_curx_arry, this.m_cury_arry);
        }
        
        this.m_selected_pos = this.getSelectedSide(i, x, y);
        if (0 <= this.m_selected_pos) {
            return true;
        }
        return false;
    }
    //==============================================================================
    //	[PENTAGON] Get SELECTED SIDE
    //==============================================================================
    getSelectedSide(i, x, y) {
        let x1, y1, x3, y3; 
        let result = false;
        if (this.m_up_angle) {	//上向き
            x1 = this.m_curx_arry[UP_TOP];
            y1 = this.m_cury_arry[UP_TOP];
            if (super.chkEdgeOver(x1, y1, x, y)) return UP_TOP_EDGE;
            x3 = this.m_curx_arry[UP_RU];
            y3 = this.m_cury_arry[UP_RU];
            if (super.chkEdgeOver(x3, y3, x, y)) return UP_RU_EDGE;
            if (super.chkIntersect(i, x1, y1, x3, y3, x, y)) return UP_TOP;
            x1 = this.m_curx_arry[UP_RU];
            y1 = this.m_cury_arry[UP_RU];
            x3 = this.m_curx_arry[UP_RD];
            y3 = this.m_cury_arry[UP_RD];
            if (super.chkEdgeOver(x3, y3, x, y)) return UP_RD_EDGE;
            if (super.chkIntersect(i, x1, y1, x3, y3, x, y)) return UP_RU;
            x1 = this.m_curx_arry[UP_RD];
            y1 = this.m_cury_arry[UP_RD];
            x3 = this.m_curx_arry[UP_LD];
            y3 = this.m_cury_arry[UP_LD];
            if (super.chkEdgeOver(x3, y3, x, y)) return UP_LD_EDGE;
            if (super.chkIntersect(i, x1, y1, x3, y3, x, y)) return UP_RD;
            x1 = this.m_curx_arry[UP_LD];
            y1 = this.m_cury_arry[UP_LD];
            x3 = this.m_curx_arry[UP_LU];
            y3 = this.m_cury_arry[UP_LU];
            if (super.chkEdgeOver(x3, y3, x, y)) return UP_LU_EDGE;
            if (super.chkIntersect(i, x1, y1, x3, y3, x, y)) return UP_LD;
            x1 = this.m_curx_arry[UP_LU];
            y1 = this.m_cury_arry[UP_LU];
            x3 = this.m_curx_arry[UP_TOP];
            y3 = this.m_cury_arry[UP_TOP];
            if (super.chkIntersect(i, x1, y1, x3, y3, x, y)) return UP_LU;
        } else {	//下向き
            x1 = this.m_curx_arry[DN_BTM];
            y1 = this.m_cury_arry[DN_BTM];
            if (super.chkEdgeOver(x1, y1, x, y)) return DN_BTM_EDGE;
            x3 = this.m_curx_arry[DN_LU];
            y3 = this.m_cury_arry[DN_LU];
            if (super.chkEdgeOver(x3, y3, x, y)) return DN_LU_EDGE;
            if (super.chkIntersect(i, x1, y1, x3, y3, x, y)) return DN_BTM;
            x1 = this.m_curx_arry[DN_LU];
            y1 = this.m_cury_arry[DN_LU];
            x3 = this.m_curx_arry[DN_LD];
            y3 = this.m_cury_arry[DN_LD];
            if (super.chkEdgeOver(x3, y3, x, y)) return DN_LD_EDGE;
            if (super.chkIntersect(i, x1, y1, x3, y3, x, y)) return DN_LU;
            x1 = this.m_curx_arry[DN_LD];
            y1 = this.m_cury_arry[DN_LD];
            x3 = this.m_curx_arry[DN_RD];
            y3 = this.m_cury_arry[DN_RD];
            if (super.chkEdgeOver(x3, y3, x, y)) return DN_RD_EDGE;
            if (super.chkIntersect(i, x1, y1, x3, y3, x, y)) return DN_LD;
            x1 = this.m_curx_arry[DN_RD];
            y1 = this.m_cury_arry[DN_RD];
            x3 = this.m_curx_arry[DN_RU];
            y3 = this.m_cury_arry[DN_RU];
            if (super.chkEdgeOver(x3, y3, x, y)) return DN_RU_EDGE;
            if (super.chkIntersect(i, x1, y1, x3, y3, x, y)) return DN_RD;
            x1 = this.m_curx_arry[DN_RU];
            y1 = this.m_cury_arry[DN_RU];
            x3 = this.m_curx_arry[DN_BTM];
            y3 = this.m_cury_arry[DN_BTM];
            if (super.chkIntersect(i, x1, y1, x3, y3, x, y)) return DN_RU;
        }
        if (this.m_up_angle) {	//上向き
            if (this.m_cury_arry[UP_TOP] < y && y < this.m_cury_arry[UP_LD]) {
                if (this.m_curx_arry[UP_LD] < x && x < this.m_curx_arry[UP_RD]) {
                    return ALL_SELECT;
                }
            }
        } else {
            if (this.m_cury_arry[DN_LD] < y && y < this.m_cury_arry[DN_BTM]) {
                if (this.m_curx_arry[DN_RD] < x && x < this.m_curx_arry[DN_LD]) {
                    return ALL_SELECT;
                }
            }
        }
        return -1;
    }
    //==============================================================================
    //	[PENTAGON] SELECT OBJECT DRAW
    //==============================================================================
    drawSelected(canvas, ix) {
        const selColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_SELECTED.c);
        if (this.m_selected_pos < 0) return;
        //if (this.m_selected_pos === ALL_SELECT) {
            this.drawPenta(canvas, selColor, this.m_curx_arry, this.m_cury_arry);
            return;
        //}
        // let ix1, ix2;
        // if (this.m_up_angle) {
        //     if (this.m_selected_pos <= UP_LU) {
        //         if (this.m_selected_pos == UP_TOP) {
        //             ix1 = UP_TOP;
        //             ix2 = UP_RU;
        //         } else if (this.m_selected_pos == UP_RU) {
        //             ix1 = UP_RU;
        //             ix2 = UP_RD;
        //         } else if (this.m_selected_pos == UP_RD) {
        //             ix1 = UP_RD;
        //             ix2 = UP_LD;
        //         } else if (this.m_selected_pos == UP_LD) {
        //             ix1 = UP_LD;
        //             ix2 = UP_LU;
        //         } else if (this.m_selected_pos == UP_LU) {
        //             ix1 = UP_LU;
        //             ix2 = UP_TOP;
        //         } else {
        //             return;
        //         }
        //         canvas.drawLine(selColor, this.m_curx_arry[ix1], this.m_cury_arry[ix1], this.m_curx_arry[ix2], this.m_cury_arry[ix2]);
        //     } else {
        //         if (this.m_selected_pos == UP_TOP_EDGE) {
        //             ix1 = UP_TOP;
        //         } else if (this.m_selected_pos == UP_RU_EDGE) {
        //             ix1 = UP_RU;
        //         } else if (this.m_selected_pos == UP_RD_EDGE) {
        //             ix1 = UP_RD;
        //         } else if (this.m_selected_pos == UP_LD_EDGE) {
        //             ix1 = UP_LD;
        //         } else if (this.m_selected_pos == UP_LU_EDGE) {
        //             ix1 = UP_LU;
        //         } else {
        //             return;
        //         }
        //         canvas.drawEllipseFill(selColor, 'white', this.m_curx_arry[ix1] - 5, this.m_cury_arry[ix1] - 5, this.m_curx_arry[ix1] + 5, this.m_cury_arry[ix1] + 5);
        //     }
        // } else {
        //     if (this.m_selected_pos <= DN_RU) {
        //         if (this.m_selected_pos == DN_BTM) {
        //             ix1 = DN_BTM;
        //             ix2 = DN_LU;
        //         } else if (this.m_selected_pos == DN_LU) {
        //             ix1 = DN_LD;
        //             ix2 = DN_LU;
        //         } else if (this.m_selected_pos == DN_LD) {
        //             ix1 = DN_RD;
        //             ix2 = DN_LD;
        //         } else if (this.m_selected_pos == DN_RD) {
        //             ix1 = DN_RD;
        //             ix2 = DN_RU;
        //         } else if (this.m_selected_pos == DN_RU) {
        //             ix1 = DN_RU;
        //             ix2 = DN_BTM;
        //         } else {
        //             return;
        //         }
        //         canvas.drawLine(selColor, this.m_curx_arry[ix1], this.m_cury_arry[ix1], this.m_curx_arry[ix2], this.m_cury_arry[ix2]);
        //     } else {
        //         if (this.m_selected_pos == DN_BTM_EDGE) {
        //             ix1 = DN_BTM;
        //         } else if (this.m_selected_pos == DN_LU_EDGE) {
        //             ix1 = DN_LU;
        //         } else if (this.m_selected_pos == DN_LD_EDGE) {
        //             ix1 = DN_LD;
        //         } else if (this.m_selected_pos == DN_RD_EDGE) {
        //             ix1 = DN_RD;
        //         } else if (this.m_selected_pos == DN_RU_EDGE) {
        //             ix1 = DN_RU;
        //         } else {
        //             return;
        //         }
        //         canvas.drawEllipseFill(selColor, 'white', this.m_curx_arry[ix1] - 5, this.m_cury_arry[ix1] - 5, this.m_curx_arry[ix1] + 5, this.m_cury_arry[ix1] + 5);
        //     }
        // }
    }
}
//-------------------------------------------------------------------
// クラス名: ChartDrawFiboFan
//
// クラス概要: フィボナッチファン描画クラス
//--------------------------------------------------------------------
export class ChartDrawFiboFan extends ChartDrawTrendLine {
	constructor() {
        super();
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    getType = () => { return CD.TECH_TOOL_FIBOFAN; }
    //==================================================================
    // [FIBONACCHI FAN] ADD OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [FIBONACCHI FAN] REMOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [FIBONACCHI FAN] REMOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [FIBONACCHI FAN] DRAW
    //==================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if(ix === selectedIX && !fixSelected && isMouseLbtn){
            // 選択状態のため点線
            this.drawDragObject(canvas, ix, select_x, select_y);
            let pos = {};
            pos.start_x = this.m_selectedStart.x;
            pos.end_x = this.m_selectedEnd.x;
            pos.start_y = this.m_selectedStart.y;
            pos.end_y = this.m_selectedEnd.y;
            this.drawFan(canvas, pos);
        }else{
            //通常描画
            let obj = this.m_drawToolList[ix];
            let pos = {};
            pos.start_x = super.getEntryToPosForTool(obj.m_startEntryIndex);
            pos.end_x = super.getEntryToPosForTool(obj.m_endEntryIndex);
            pos.start_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
            pos.end_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

            const lineColor = "white";
            const centerColor = "blue";
            canvas.drawThinLine(lineColor, pos.start_x, pos.start_y, pos.end_x, pos.start_y);   // 上
            canvas.drawThinLine(lineColor, pos.start_x, pos.end_y, pos.end_x, pos.end_y);       // 下
            canvas.drawThinLine(lineColor, pos.start_x, pos.start_y, pos.start_x, pos.end_y);   // 右
            canvas.drawThinLine(lineColor, pos.end_x, pos.start_y, pos.end_x, pos.end_y);       // 左
            canvas.drawThinLine(lineColor, pos.start_x, pos.start_y, pos.end_x, pos.end_y);

            this.drawFan(canvas, pos);
        }
    }
    //==================================================================
    // [FIBONACCHI FAN] DRAW TOOL DOT LINE
    //==================================================================
    drawingLine(canvas) {
        if (this.m_drawStart.x < 0 ||  this.m_drawStart.y < 0) {
            return;
        }
        if (this.m_drawEnd.x < this.m_drawStart.x) {
            let wk = this.m_drawStart;
            this.m_drawStart = this.m_drawEnd;
            this.m_drawEnd = wk;
        }

        const rectColor = "white";
        const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_DRAWING.c);
        canvas.drawDottedLine(rectColor, this.m_drawStart.x, this.m_drawStart.y, this.m_drawEnd.x, this.m_drawStart.y); // 上
        canvas.drawDottedLine(rectColor, this.m_drawStart.x, this.m_drawEnd.y, this.m_drawEnd.x, this.m_drawEnd.y);     // 下
        canvas.drawDottedLine(rectColor, this.m_drawStart.x, this.m_drawStart.y, this.m_drawStart.x, this.m_drawEnd.y); // 右
        canvas.drawDottedLine(rectColor, this.m_drawEnd.x, this.m_drawStart.y, this.m_drawEnd.x, this.m_drawEnd.y);     // 左
        canvas.drawDottedLine(lineColor, this.m_drawStart.x, this.m_drawStart.y, this.m_drawEnd.x, this.m_drawEnd.y);
        canvas.drawEllipseFill(lineColor, lineColor,this.m_drawEnd.x, this.m_drawEnd.y, 4);

        let pos = {};
        pos.start_x = this.m_drawStart.x;
        pos.end_x = this.m_drawEnd.x;
        pos.start_y = this.m_drawStart.y;
        pos.end_y = this.m_drawEnd.y;
        this.drawFan(canvas, pos);
    }
    //==============================================================================
    //	[FIBONACCHI FAN] JUDGE SELECT OBJECT  (OVERRIDE)
    //==============================================================================
    drawDragObject(canvas, ix, select_x, select_y) {
        super.drawDragObject(canvas, ix, select_x, select_y);
        if (this.m_selectedEnd.x < this.m_selectedStart.x) {
            let wk_x = this.m_selectedStart.x;
            let wk_y = this.m_selectedStart.y;
            this.m_selectedStart.x = this.m_selectedEnd.x;
            this.m_selectedStart.y = this.m_selectedEnd.y;
            this.m_selectedEnd.x = wk_x;
            this.m_selectedEnd.y = wk_y;
        }
    }
    //==============================================================================
    //	[FIBONACCHI FAN] DRAW PART
    //==============================================================================
    drawFan(canvas, pos) {

        // 描画色
        const strColor = "white";
        const halfColor = this.m_drawParam.getColor(this.m_drawParam.m_color.FIBO_FAN_LINE_50.c);
        const fanColor = this.m_drawParam.getColor(this.m_drawParam.m_color.FIBO_FAN_LINE_FAN.c);

        // 期間軸
        const selectWidth = pos.end_x - pos.start_x;
        const wf618_x = selectWidth * 0.618 + pos.start_x;
        const wf500_x = selectWidth * 0.5 + pos.start_x;
        const wf382_x = selectWidth * 0.382 + pos.start_x;
        const wf236_x = selectWidth * 0.236 + pos.start_x;

        let chartEndPosY;
        let isUP = true;
        if (pos.end_y < pos.start_y) {
            // 上に向かって描画
            chartEndPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        }else{
            // 下に向かって描画
            chartEndPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
            isUP = false;
        }
        const f618_x = super.getEndX(pos.start_x, pos.start_y, wf618_x, pos.end_y, chartEndPosY);
        const f500_x = super.getEndX(pos.start_x, pos.start_y, wf500_x, pos.end_y, chartEndPosY);
        const f382_x = super.getEndX(pos.start_x, pos.start_y, wf382_x, pos.end_y, chartEndPosY);
        const f236_x = super.getEndX(pos.start_x, pos.start_y, wf236_x, pos.end_y, chartEndPosY);

        canvas.drawLine(fanColor, pos.start_x, pos.start_y, f618_x, chartEndPosY);
        canvas.drawLine(halfColor, pos.start_x, pos.start_y, f500_x, chartEndPosY);
        canvas.drawLine(fanColor, pos.start_x, pos.start_y, f382_x, chartEndPosY);
        canvas.drawLine(fanColor, pos.start_x, pos.start_y, f236_x, chartEndPosY);
        
        const strPosMargin = (isUP)? 0 : 14;
        canvas.drawStringC("61.8%", wf618_x, pos.end_y - strPosMargin, strColor);
        canvas.drawStringC("50.0%", wf500_x, pos.end_y - strPosMargin, strColor);
        canvas.drawStringC("38.2%", wf382_x, pos.end_y - strPosMargin, strColor);
        canvas.drawStringC("23.6%", wf236_x, pos.end_y - strPosMargin, strColor);

        // 値段軸
        const bgn_price = this.m_drawInf.cnvPosYToValue(pos.start_y);
        const end_price = this.m_drawInf.cnvPosYToValue(pos.end_y);
        const priceBand = bgn_price- end_price;
        const wf618_y = this.m_drawInf.cnvValueToPosYForPrice((priceBand * 0.382) + end_price);
        const wf500_y = this.m_drawInf.cnvValueToPosYForPrice((priceBand * 0.5) + end_price);
        const wf382_y = this.m_drawInf.cnvValueToPosYForPrice((priceBand * 0.618) + end_price);
        const wf236_y = this.m_drawInf.cnvValueToPosYForPrice((priceBand * 0.764) + end_price);

        const chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        const f618_y = super.getEndY(pos.start_x, pos.start_y, pos.end_x, wf618_y, chartEndPosX);
        const f500_y = super.getEndY(pos.start_x, pos.start_y, pos.end_x, wf500_y, chartEndPosX);
        const f382_y = super.getEndY(pos.start_x, pos.start_y, pos.end_x, wf382_y, chartEndPosX);
        const f236_y = super.getEndY(pos.start_x, pos.start_y, pos.end_x, wf236_y, chartEndPosX);

        canvas.drawLine(fanColor, pos.start_x, pos.start_y, chartEndPosX, f618_y);
        canvas.drawLine(halfColor, pos.start_x, pos.start_y, chartEndPosX, f500_y);
        canvas.drawLine(fanColor, pos.start_x, pos.start_y, chartEndPosX, f382_y);
        canvas.drawLine(fanColor, pos.start_x, pos.start_y, chartEndPosX, f236_y);

        canvas.drawStringC("61.8%", pos.end_x, wf618_y, strColor);
        canvas.drawStringC("50.0%", pos.end_x, wf500_y, strColor);
        canvas.drawStringC("38.2%", pos.end_x, wf382_y, strColor);
        canvas.drawStringC("23.6%", pos.end_x, wf236_y, strColor);
    }
    //==============================================================================
    //	[FIBONACCHI FAN] SELECT OBJECT DRAW  (OVERRIDE)
    //==============================================================================
}
//-------------------------------------------------------------------
// クラス名: ChartDrawFiboArc
//
// クラス概要: フィボナッチアーク描画クラス
//--------------------------------------------------------------------
export class ChartDrawFiboArc extends ChartDrawTrendLine {
	constructor() {
        super();
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    getType = () => { return CD.TECH_TOOL_FIBOARC; }
    //==================================================================
    // [FIBONACCHI ARC] ADD OBJECT (OVERRIDE)
    //==================================================================
    add(start_x, start_y, end_x, end_y) {
        let obj = new ChartTechToolObj();
        obj.m_selected = DTOOL_NOTOUCH;
        obj.m_drawType = this.getType();
        obj.m_startEntryIndex = start_x;
        obj.m_endEntryIndex   = end_x;
        obj.m_startPrice      = start_y;
        obj.m_endPrice        = end_y;
        if(obj.m_startEntryIndex === obj.m_endEntryIndex){
            if(obj.m_startPrice === obj.m_endPrice){
                obj = null;
                return true;
            }
        }
        this.m_drawToolList.push(obj);
        super.clearPos();
        return true;
    }
    //==================================================================
    // [FIBONACCHI ARC] REMOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [FIBONACCHI ARC] MOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [FIBONACCHI ARC] DRAW
    //==================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if(ix === selectedIX && !fixSelected && isMouseLbtn){
            // 選択状態のため点線
            super.drawDragObject(canvas, ix, select_x, select_y);
            let pos = {};
            pos.start_x = this.m_selectedStart.x;
            pos.end_x = this.m_selectedEnd.x;
            pos.start_y = this.m_selectedStart.y;
            pos.end_y = this.m_selectedEnd.y;
            let centerColor = "white";
            let arcColor = "white";
            this.drawArc(canvas, arcColor, centerColor, pos);
        }else{
            // 通常描画
            let obj = this.m_drawToolList[ix];
            let sta_x = super.getEntryToPosForTool(obj.m_startEntryIndex);
            let end_x = super.getEntryToPosForTool(obj.m_endEntryIndex);
            let sta_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
            let end_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
            let centerColor = "blue";
            let arcColor = "rgb(15, 160, 250)";
            canvas.drawDottedLine("white", sta_x, sta_y, end_x, end_y);
    
            let pos = {};
            pos.start_x = sta_x;
            pos.end_x = end_x;
            pos.start_y = sta_y;
            pos.end_y = end_y;
            this.drawArc(canvas, arcColor, centerColor, pos);
        }
    }
    //==================================================================
    // [FIBONACCHI ARC] DRAW TOOL DOT LINE
    //==================================================================
    drawingLine(canvas) {
        if (this.m_drawStart.x < 0 ||  this.m_drawStart.y < 0) {
            return;
        }

        const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_DRAWING.c);
        const centerColor = "blue";
        const arcColor = "white";

        canvas.drawLine(lineColor, this.m_drawStart.x, this.m_drawStart.y, this.m_drawEnd.x, this.m_drawEnd.y);
        canvas.drawEllipseFill(lineColor, lineColor,this.m_drawStart.x, this.m_drawStart.y, 4);
        canvas.drawEllipseFill(lineColor, lineColor,this.m_drawEnd.x, this.m_drawEnd.y, 4);

        let pos = {};
        pos.start_x = this.m_drawStart.x;
        pos.end_x = this.m_drawEnd.x;
        pos.start_y = this.m_drawStart.y;
        pos.end_y = this.m_drawEnd.y;
        this.drawArc(canvas, arcColor, centerColor, pos);
    }
    drawArc(canvas, color, centerColor, pos) {

        // 期間軸
        const selectWidth = Math.sqrt(Math.abs(pos.end_x - pos.start_x)**2 + Math.abs(pos.end_y - pos.start_y)**2);
        const r764 = selectWidth * 0.764;
        const r618 = selectWidth * 0.618;
        const r500 = selectWidth * 0.5;
        const r382 = selectWidth * 0.382;
        const r236 = selectWidth * 0.236;

        if (pos.end_y < pos.start_y) {
            canvas.drawLowerSemicircle(color, pos.end_x, pos.end_y, selectWidth);
            canvas.drawLowerSemicircle(color, pos.end_x, pos.end_y, r764);
            canvas.drawLowerSemicircle(color, pos.end_x, pos.end_y, r618);
            canvas.drawLowerSemicircle(centerColor, pos.end_x, pos.end_y, r500);
            canvas.drawLowerSemicircle(color, pos.end_x, pos.end_y, r382);
            canvas.drawLowerSemicircle(color, pos.end_x, pos.end_y, r236);
            canvas.drawStringC("100%", pos.end_x, pos.end_y + selectWidth, color);
            canvas.drawStringC("76.4%", pos.end_x, pos.end_y + r764, color);
            canvas.drawStringC("61.8%", pos.end_x, pos.end_y + r618, color);
            canvas.drawStringC("50.0%", pos.end_x, pos.end_y + r500, color);
            canvas.drawStringC("38.2%", pos.end_x, pos.end_y + r382, color);
            canvas.drawStringC("23.6%", pos.end_x, pos.end_y + r236, color);
        } else {
            canvas.drawUpperSemicircle(color, pos.end_x, pos.end_y, selectWidth);
            canvas.drawUpperSemicircle(color, pos.end_x, pos.end_y, r764);
            canvas.drawUpperSemicircle(color, pos.end_x, pos.end_y, r618);
            canvas.drawUpperSemicircle(centerColor, pos.end_x, pos.end_y, r500);
            canvas.drawUpperSemicircle(color, pos.end_x, pos.end_y, r382);
            canvas.drawUpperSemicircle(color, pos.end_x, pos.end_y, r236);
            const mgn = 15;
            canvas.drawStringC("100%", pos.end_x, pos.end_y - selectWidth - mgn, color);
            canvas.drawStringC("76.4%", pos.end_x, pos.end_y - r764 - mgn, color);
            canvas.drawStringC("61.8%", pos.end_x, pos.end_y - r618 - mgn, color);
            canvas.drawStringC("50.0%", pos.end_x, pos.end_y - r500 - mgn, color);
            canvas.drawStringC("38.2%", pos.end_x, pos.end_y - r382 - mgn, color);
            canvas.drawStringC("23.6%", pos.end_x, pos.end_y - r236 - mgn, color);
        }
    }
    //==============================================================================
    // [FIBONACCHI ARC] JUDGE SELECT OBJECT  (OVERRIDE)
    //==============================================================================
    //==============================================================================
    // [FIBONACCHI ARC] SELECT OBJECT DRAW  (OVERRIDE)
    //==============================================================================
}
//-------------------------------------------------------------------
// クラス名: ChartDrawFiboCircle
//
// クラス概要: フィボナッチサークル描画クラス
//--------------------------------------------------------------------
export class ChartDrawFiboCircle extends ChartDrawTrendLine {
	constructor() {
        super();
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    getType = () => { return CD.TECH_TOOL_FIBOCIRCLE; }
    //==================================================================
    // [FIBONACCHI CIRCLE] ADD OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [FIBONACCHI CIRCLE] REMOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [FIBONACCHI CIRCLE] MOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [FIBONACCHI CIRCLE] DRAW
    //==================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if(ix === selectedIX && !fixSelected && isMouseLbtn){
            // 選択状態のため点線
            const color = this.m_drawParam.getColor(this.m_drawParam.m_color.TRENDLINE.c);
            super.drawDragObject(canvas, ix, select_x, select_y);
            this.drawCircle(canvas, color, this.m_selectedStart.x, this.m_selectedStart.y, this.m_selectedEnd.x, this.m_selectedEnd.y);
        }else{
            // 通常描画
            let obj = this.m_drawToolList[ix];
            const x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
            const x2 = super.getEntryToPosForTool(obj.m_endEntryIndex);
            const y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
            const y2 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
            const color = this.m_drawParam.getColor(this.m_drawParam.m_color.TRENDLINE.c);
            canvas.drawDottedLine("white", x1, y1, x2, y2);
            this.drawCircle(canvas, this.m_drawParam.getColor(this.m_drawParam.m_color.TRENDLINE.c), x1, y1, x2, y2);
        }
    }
    //==================================================================
    // [FIBONACCHI CIRCLE] DRAW TOOL DOT LINE
    //==================================================================
    drawingLine(canvas) {
        if(0 <= this.m_drawStart.x && 0 <= this.m_drawStart.y){
            const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_DRAWING.c);
            const x1 = this.m_drawStart.x;
            const y1 = this.m_drawStart.y;
            const x2 = this.m_drawEnd.x;
            const y2 = this.m_drawEnd.y;
            canvas.drawLine("white", x1, y1, x2, y2);
            canvas.drawEllipseFill(lineColor, lineColor, x1, y1, 4);
            canvas.drawEllipseFill(lineColor, lineColor, x2, y2, 4);
            this.drawCircle(canvas, lineColor, x1, y1, x2, y2);
        }
    }
    drawCircle(canvas, color, x1, y1, x2, y2) {

        let w = (x2-x1) / 2;
        let h = (y2-y1) / 2;
        canvas.drawCircle(color, x1 + w, y1 + h, w, h);
        
        const center_x = x1 + w;
        const center_y = y1 + h;

        const w236 = (w * 0.236);
        const h236 = (h * 0.236);
        const w382 = (w * 0.382);
        const h382 = (h * 0.382);
        const w500 = (w * 0.5);
        const h500 = (h * 0.5);
        const w618 = (w * 0.618);
        const h618 = (h * 0.618);
        const w764 = (w * 0.764);
        const h764 = (h * 0.764);

        const clr_236 = "rgb(128, 128, 255)";
        const clr_382 = "rgb(0, 128, 255)";
        const clr_500 = "rgb(0, 128, 128)";
        const clr_618 = "rgb(255, 128, 128)";
        const clr_764 = "rgb(0, 255, 0)";
        const clr_100 = color;

        canvas.drawCircle(clr_236, center_x, center_y, w236, h236);
        canvas.drawCircle(clr_382, center_x, center_y, w382, h382);
        canvas.drawCircle(clr_500, center_x, center_y, w500, h500);
        canvas.drawCircle(clr_618, center_x, center_y, w618, h618);
        canvas.drawCircle(clr_764, center_x, center_y, w764, h764);

        if(y1 < y2){
            canvas.drawStringC("23.6%", center_x, center_y + h236, clr_236);
            canvas.drawStringC("38.2%", center_x, center_y + h382, clr_382);
            canvas.drawStringC("50.0%", center_x, center_y + h500, clr_500);
            canvas.drawStringC("61.8%", center_x, center_y + h618, clr_618);
            canvas.drawStringC("76.4%", center_x, center_y + h764, clr_764);
            canvas.drawStringC("100%", center_x, center_y + h, color);
        }else{
            canvas.drawStringC("23.6%", center_x, center_y - h236, clr_236);
            canvas.drawStringC("38.2%", center_x, center_y - h382, clr_382);
            canvas.drawStringC("50.0%", center_x, center_y - h500, clr_500);
            canvas.drawStringC("61.8%", center_x, center_y - h618, clr_618);
            canvas.drawStringC("76.4%", center_x, center_y - h764, clr_764);
            canvas.drawStringC("100%", center_x, center_y - h, color);
        }
    }
    //==============================================================================
    // [FIBONACCHI CIRCLE] JUDGE SELECT OBJECT  (OVERRIDE)
    //==============================================================================
    //==============================================================================
    // [FIBONACCHI CIRCLE] SELECT OBJECT DRAW  (OVERRIDE)
    //==============================================================================
}
//-------------------------------------------------------------------
// クラス名: ChartDrawFiboTime
//
// クラス概要: フィボナッチタイムゾ－ン描画クラス
//--------------------------------------------------------------------
export class ChartDrawFiboTime extends ChartTechTool {
	constructor() {
        super();
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    getType = () => { return CD.TECH_TOOL_FIBOTIME; }
    //==============================================================================
    // [FIBONACCHI TIMEZONE] ADD OBJECT (OVERRIDE)
    //==============================================================================
    add(start_x, start_y, end_x, end_y) {
        let obj = new ChartTechToolObj();
        obj.m_selected = DTOOL_NOTOUCH;
        obj.m_drawType = this.getType();
        obj.m_startEntryIndex = end_x;
        obj.m_endEntryIndex   = end_x;
        this.removeAll();
        this.m_drawToolList.push(obj);
        super.clearPos();
        return true;
    }
    //==============================================================================
    // [FIBONACCHI TIMEZONE] MOVE OBJECT (OVERRIDE)
    //==============================================================================
    move(ix, end_x) {
        this.add(0, 0, end_x, 0);
        return true;
    }
    //==============================================================================
    // [FIBONACCHI TIMEZONE] REMOVE OBJECT
    //==============================================================================
    remove(i) {
        return super.remove(i, this.getType());
    }
    //==============================================================================
    // [FIBONACCHI TIMEZONE] REMOVE OBJECT
    //==============================================================================
    removeAll() {
        return super.removeAll(this.getType());
    }
    //==============================================================================
    // [FIBONACCHI TIMEZONE] DRAW
    //==============================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if (ix === selectedIX && !fixSelected && isMouseLbtn) {
            // ゴミ箱表示
            const mosX = this.m_drawInf.getMousePosX();
            const mosY = this.m_drawInf.getMousePosY();
            super.drawDustbox(canvas, mosX, mosY);
            // 選択状態
            this.drawDragObject(canvas, ix, mosX);
        } else {
            // 通常描画
            const lineColor = "red";
            const baseColor = "blue";
            const obj = this.m_drawToolList[ix];
            this.drawTimeZone(canvas, lineColor, baseColor, obj.m_endEntryIndex);
        }
    }
    //==============================================================================
    //	[FIBONACCHI TIMEZONE] DRAG OBJECT
    //==============================================================================
    drawDragObject(canvas, ix, x) {
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        canvas.drawDottedLine('white', x, chartBgnPosY, x, chartEndPosY);
    }
    //==============================================================================
    // [FIBONACCHI TIMEZONE] DRAW TOOL DOT LINE
    //==============================================================================
    drawingLine(canvas) {
        if (this.m_drawEnd.x < 0) {
            return;
        }
        const lineColor = "white";
        const baseColor = "blue";
        let bgn_entry = this.m_common.getPosToEntryForExt(this.m_drawInf, this.m_drawEnd.x);
        this.drawTimeZone(canvas, lineColor, baseColor, bgn_entry);
    }
    drawTimeZone(canvas, color, baseColor, bgn_entry) {
        let info = this.m_common.m_info;
        let hist = info.getCurrentHist();
        const size = info.getCurHistSize();
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        // 基準
        if (0 <= bgn_entry && bgn_entry < size) {
            const x = super.getEntryToPosForTool(bgn_entry);
            canvas.drawLine(baseColor, x, chartBgnPosY, x, chartEndPosY);
        }
        let next = bgn_entry + 1;
        // 基準 + 1
        if (0 <= next && next < size) {
             const x = super.getEntryToPosForTool(next);
             canvas.drawLine(color, x, chartBgnPosY, x, chartEndPosY);
        }
        bgn_entry++;
        // (今回 = 前回 + 前々回)
        let prevIndex = 0;
        let curIndex = 1;
        let nextIndex = curIndex + prevIndex;
        for(let i = 0; i < size; ++i) {
            const nextEntry = nextIndex + bgn_entry;
            if (nextEntry < size) {
                const x = super.getEntryToPosForTool(nextEntry);
                canvas.drawLine(color, x, chartBgnPosY, x, chartEndPosY);
                if (1 < nextIndex) {
                    const valueStr = '+' + nextIndex;
                    canvas.drawStringC(valueStr, x, chartEndPosY + 2, "white");
                }
                prevIndex = curIndex;
                curIndex = nextIndex;
                bgn_entry = nextEntry;
                nextIndex = curIndex + prevIndex;
                continue;
            }
            break;
        }
    }
    //==============================================================================
    //  [FIBONACCHI TIMEZONE] JUDGE SELECT OBJECT
    //==============================================================================
    isSelected(ix, x, y) {
        const obj = this.m_drawToolList[ix];
        const x1 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        if(x1 - 7 < x && x < x1 + 7){
            return true;
        }
        return false;
    }
    //==============================================================================
    //  [FIBONACCHI TIMEZONE] SELECT OBJECT DRAW
    //==============================================================================
    drawSelected(canvas, ix) {
        //選択状態のため点線
        const obj = this.m_drawToolList[ix];
        const x1 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        canvas.drawDottedLine('white', x1, chartBgnPosY, x1, chartEndPosY);
    }
}
//-------------------------------------------------------------------
// クラス名: ChartDrawGanFan
//
// クラス概要: ギャンファン描画クラス
//--------------------------------------------------------------------
export class ChartDrawGanFan extends ChartDrawTrendLine {
	constructor() {
        super();
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    getType = () => { return CD.TECH_TOOL_GANFAN; }
    //==================================================================
    // [GAN FAN] ADD OBJECT
    //==================================================================
    add(start_x, start_y, end_x, end_y) {
        let obj = new ChartTechToolObj();
        obj.m_selected = DTOOL_NOTOUCH;
        obj.m_drawType = this.getType();
        obj.m_startEntryIndex = start_x;
        obj.m_startPrice      = start_y;
        obj.m_endEntryIndex   = end_x;
        obj.m_endPrice        = end_y;
        if(obj.m_startEntryIndex === obj.m_endEntryIndex){
            if(obj.m_startPrice === obj.m_endPrice){
                obj = null;
                return true;
            }
        }
        this.m_drawToolList.push(obj);
        super.clearPos();
        return true;
    }
    //==================================================================
    // [GAN FAN] MOVE OBJECT (OVERRIDE)
    //==================================================================
    move(ix, start_x, start_y, end_x, end_y) {

        const obj = this.m_drawToolList[ix];
        if(start_x <= end_x){
            obj.m_startEntryIndex = start_x >> 0;
            obj.m_endEntryIndex   = end_x >> 0;
        }else{
            obj.m_startEntryIndex = end_x >> 0;
            obj.m_endEntryIndex   = start_x >> 0;
        }
        // 上下方向は維持する
        if(obj.m_upDownStat){
            // 上向き
            obj.m_startPrice      = start_y;
            obj.m_endPrice        = end_y;
        }else{
            // 下向き
            obj.m_startPrice      = start_y;
            obj.m_endPrice        = start_y - 10;   // 下向き維持のため
        }
        super.clearPos();
        return true;
    }
    //==================================================================
    // [GAN FAN] REMOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [GAN FAN] REMOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [GAN FAN] DRAW
    //==================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if(ix === selectedIX && !fixSelected && isMouseLbtn){
            // 選択状態のため点線
            this.drawDragObject(canvas, ix, select_x, select_y);
             // ゴミ箱表示
            const mosX = this.m_drawInf.getMousePosX();
            const mosY = this.m_drawInf.getMousePosY();
            super.drawDustbox(canvas, mosX, mosY);
        }else{
            //通常描画
            let obj = this.m_drawToolList[ix];
            let sta_x = super.getEntryToPosForTool(obj.m_startEntryIndex);
            let end_x = super.getEntryToPosForTool(obj.m_endEntryIndex);
            let sta_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
            let end_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

            let pos = {};
            pos.start_x = sta_x;
            pos.end_x = end_x;
            pos.start_y = sta_y;
            pos.end_y = end_y;
            const upDownStat = (sta_y < end_y)? false: true;
            this.drawFan(canvas, pos, upDownStat);
            // 上下描画方向退避(固有拡張)
            obj.m_upDownStat = upDownStat;
        }
    }
    //==============================================================================
    //	[FIBONACCHI RETRACEMENT] DRAG OBJECT
    //==============================================================================
    drawDragObject(canvas, ix, select_x, select_y) {

        // PUSH開始位置有効値判定
        if(select_x < 0 || select_y < 0){
            return;
        }
        const mosX = this.m_drawInf.getMousePosX();
        const mosY = this.m_drawInf.getMousePosY();
        this.drawSelectedBox(canvas, mosX, mosY);

        const obj = this.m_drawToolList[ix];
        let pos = {};
        pos.start_x = mosX;
        pos.end_x = mosX;
        pos.start_y = mosY;
        pos.end_y = mosY;
        const upDownStat = obj.m_upDownStat;
        this.drawFan(canvas, pos, upDownStat);
    }
    //==================================================================
    // [GAN FAN] DRAW TOOL DOT LINE
    //==================================================================
    drawingLine(canvas) {
        if (this.m_drawStart.x < 0 ||  this.m_drawStart.y < 0) {
            return;
        }
        let rectColor = "white";
        let lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_DRAWING.c);
        let centerColor = "blue";
        let fanColor = "white";
        canvas.drawRect(rectColor, this.m_drawEnd.x - 4, this.m_drawEnd.y - 4, 8, 8);

        let pos = {};
        pos.start_x = this.m_drawStart.x;
        pos.end_x = this.m_drawEnd.x;
        pos.start_y = this.m_drawStart.y;
        pos.end_y = this.m_drawEnd.y;
        const upDownStat = (this.m_drawStart.y < this.m_drawEnd.y)? false: true;
        canvas.drawDottedLine(rectColor, pos.start_x, pos.start_y, pos.end_x, pos.end_y);
        canvas.drawEllipseFill(lineColor, lineColor, pos.start_x, pos.start_y, 4);
        this.drawFan(canvas, pos, upDownStat);
    }
    drawFan(canvas, pos, upDownStat) {

        const centerColor = this.m_drawParam.getColor(this.m_drawParam.m_color.GAN_FAN_LINE_100.c);
        const fanColor = this.m_drawParam.getColor(this.m_drawParam.m_color.GAN_FAN_LINE_FAN.c);

        const chartEndPosX = this.m_drawInf.getChartAreaEndPosX() * 100;
        const radius = chartEndPosX - pos.end_x;
        this.drawGanFanLine(canvas, fanColor, pos, 82.5, radius, chartEndPosX, upDownStat);
        this.drawGanFanLine(canvas, fanColor, pos, 75, radius, chartEndPosX, upDownStat);
        this.drawGanFanLine(canvas, fanColor, pos, 71.25, radius, chartEndPosX, upDownStat);
        this.drawGanFanLine(canvas, fanColor, pos, 63.75, radius, chartEndPosX, upDownStat);
        this.drawGanFanLine(canvas, centerColor, pos, 45, radius, chartEndPosX, upDownStat);
        this.drawGanFanLine(canvas, fanColor, pos, 26.25, radius, chartEndPosX, upDownStat);
        this.drawGanFanLine(canvas, fanColor, pos, 18.75, radius, chartEndPosX, upDownStat);
        this.drawGanFanLine(canvas, fanColor, pos, 15, radius, chartEndPosX, upDownStat);
        this.drawGanFanLine(canvas, fanColor, pos, 7.5, radius, chartEndPosX, upDownStat);
    }
    drawGanFanLine(canvas, color, pos, degree, radius, chartEndPosX, upDownStat) {

        if (upDownStat) {
            // 上に向かって描画
            const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
            const radian = degree * Math.PI / 180;
            const gan_x = Math.cos(radian) * radius + pos.end_x;
            const gan_y = pos.end_y - (Math.sin(radian) * radius);
            const gan_end_x = super.getEndX(pos.end_x, pos.end_y, gan_x, gan_y, chartBgnPosY);
            canvas.drawLine(color, pos.end_x, pos.end_y, gan_end_x, chartBgnPosY);
        } else {
            // 下に向かって描画
            const chartEndPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
            const radian = degree * Math.PI / 180;
            const gan_x = Math.cos(radian) * radius + pos.end_x;
            const gan_y = pos.end_y + (Math.sin(radian) * radius);
            const gan_end_x = super.getEndX(pos.end_x, pos.end_y, gan_x, gan_y, chartEndPosY);
            canvas.drawLine(color, pos.end_x, pos.end_y, gan_end_x, chartEndPosY);
        }
    }
    //==============================================================================
    //  [GAN FAN] JUDGE SELECT OBJECT  (OVERRIDE)
    //==============================================================================
    isSelected(i, x, y) {
        const obj = this.m_drawToolList[i];
        const x1 = super.getEntryToPosForTool(obj.m_endEntryIndex);
        const y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
        const mgn = 5;
        if (x1 - mgn <= x && x <= x1 + mgn && y1 - mgn <= y && y <= y1 + mgn) {
            return true;
        }
        return false;
    }
    //==============================================================================
    //	[GAN FAN] SELECT OBJECT DRAW  (OVERRIDE)
    //==============================================================================
    drawSelected(canvas, ix) {
        //選択状態のため点線
        //this.drawRetraceMent(canvas, ix, 3);
        const obj = this.m_drawToolList[ix];
        const x = super.getEntryToPosForTool(obj.m_endEntryIndex);
        const y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
        this.drawSelectedBox(canvas, x, y);
    }
    drawSelectedBox(canvas, x, y) {
        const mgn = 5;
        const x1 = x - mgn;
        const x2 = x + mgn;
        const y1 = y - mgn;
        const y2 = y + mgn;
        const lineColor = "red";
        canvas. drawStrokRect(lineColor, 2, x1, y1, x2 - x1, y2 - y1)
    }
}
//-------------------------------------------------------------------
// クラス名: ChartDrawGanAngle
//
// クラス概要: ギャンアングル描画クラス
//--------------------------------------------------------------------
export class ChartDrawGanAngle extends ChartDrawFiboFan {
	constructor() {
        super();
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    getType = () => { return CD.TECH_TOOL_GANANGLE; }
    //==============================================================================
    // [GAN ANGLE] ADD OBJECT (OVERRIDE)
    //==============================================================================
    //==============================================================================
    // [GAN ANGLE] REMOVE OBJECT (OVERRIDE)
    //==============================================================================
    //==============================================================================
    // [GAN ANGLE] REMOVE OBJECT (OVERRIDE)
    //==============================================================================
    //==============================================================================
    // [GAN ANGLE] DRAW
    //==============================================================================
    //==============================================================================
    // [GAN ANGLE] DRAW TOOL DOT LINE
    //==============================================================================
    drawFan(canvas, pos) {

        // 描画色
        const centerColor = this.m_drawParam.getColor(this.m_drawParam.m_color.GAN_ANGLE_LINE_100.c);
        const halfColor = this.m_drawParam.getColor(this.m_drawParam.m_color.GAN_ANGLE_LINE_50.c);
        const fanColor = this.m_drawParam.getColor(this.m_drawParam.m_color.GAN_ANGLE_LINE_FAN.c);
        const strColor = "white";

        let chartEndPosY;
        let isUP = true;
        if (pos.end_y < pos.start_y) {
            // 上に向かって描画
            chartEndPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        }else{
            // 下に向かって描画
            chartEndPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
            isUP = false;
        }

        // 期間軸
        const selectWidth = pos.end_x - pos.start_x;
        const fCenter_x = super.getEndX(pos.start_x, pos.start_y, selectWidth + pos.start_x, pos.end_y, chartEndPosY);
        canvas.drawLine(centerColor, pos.start_x, pos.start_y, fCenter_x, chartEndPosY);

        // 値段軸
        const bgn_price = this.m_drawInf.cnvPosYToValue(pos.start_y);
        const end_price = this.m_drawInf.cnvPosYToValue(pos.end_y);
        const priceBand = bgn_price- end_price;
        const chartEndPosX = this.m_drawInf.getChartAreaEndPosX();

        // 中心線以外ループ
        const ganArray = [0.5, 0.375, 0.25, 0.125];
        const colorArray = ["white", "white", "white", "white"];
        const strArray = ["1/2", "1/3", "1/4", "1/8"];
        const strPosMargin = (isUP)? 0 : 14;
        for(let i = 0; i < ganArray.length; i++){
            // 期間軸
            const wf_x = selectWidth * ganArray[i] + pos.start_x;
            const x = super.getEndX(pos.start_x, pos.start_y, wf_x, pos.end_y, chartEndPosY);
            canvas.drawLine(halfColor, pos.start_x, pos.start_y, x, chartEndPosY);
            canvas.drawStringC(strArray[i], wf_x, pos.end_y - strPosMargin, colorArray[i]);

             // 値段軸
            const wf_y = this.m_drawInf.cnvValueToPosYForPrice((priceBand * (1 - ganArray[i])) + end_price);
            const y = super.getEndY(pos.start_x, pos.start_y, pos.end_x, wf_y, chartEndPosX);
            canvas.drawLine(halfColor, pos.start_x, pos.start_y, chartEndPosX, y);
            canvas.drawStringC(strArray[i], pos.end_x, wf_y, colorArray[i]);
        }
    }
    //==============================================================================
    //	[GAN ANGLE] JUDGE SELECT OBJECT  (OVERRIDE)
    //==============================================================================
    //==============================================================================
    //	[GAN ANGLE] SELECT OBJECT DRAW  (OVERRIDE)
    //==============================================================================
}
//-------------------------------------------------------------------
// クラス名: ChartDrawGanBox
//
// クラス概要: ギャンボックス描画クラス
//--------------------------------------------------------------------
export class ChartDrawGanBox extends ChartDrawTrendLine {
	constructor() {
        super();
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    getType = () => { return CD.TECH_TOOL_GANBOX; }
    //==================================================================
    // [GAN BOX] ADD OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [GAN BOX] REMOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [GAN BOX] REMOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [GAN BOX] DRAW MAIN
    //==================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        if(ix === selectedIX && !fixSelected && isMouseLbtn){
            // 選択状態のため点線
            super.drawDragObject(canvas, ix, select_x, select_y);
            let pos = {};
            pos.start_x = this.m_selectedStart.x;
            pos.end_x = this.m_selectedEnd.x;
            pos.start_y = this.m_selectedStart.y;
            pos.end_y = this.m_selectedEnd.y;
            canvas.drawDottedLine("white", pos.start_x, pos.start_y, pos.end_x, pos.end_y);
            this.drawBox(canvas, pos);
        }else{
            // 通常描画
            let obj = this.m_drawToolList[ix];
            let pos = {};
            pos.start_x = super.getEntryToPosForTool(obj.m_startEntryIndex);
            pos.end_x = super.getEntryToPosForTool(obj.m_endEntryIndex);
            pos.start_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
            pos.end_y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);
            canvas.drawDottedLine("white", pos.start_x, pos.start_y, pos.end_x, pos.end_y);
            this.drawBox(canvas, pos);
        }
    }
    //==================================================================
    // [GAN BOX] DRAW TOOL DOT LINE
    //==================================================================
    drawingLine(canvas) {
        if (this.m_drawStart.x < 0 ||  this.m_drawStart.y < 0) {
            return;
        }
        if (this.m_drawEnd.x < this.m_drawStart.x) {
            let wk = this.m_drawStart;
            this.m_drawStart = this.m_drawEnd;
            this.m_drawEnd = wk;
        }

        const rectColor = "white";
        const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_DRAWING.c);
        canvas.drawDottedLine(rectColor, this.m_drawStart.x, this.m_drawStart.y, this.m_drawEnd.x, this.m_drawStart.y); // 上
        canvas.drawDottedLine(rectColor, this.m_drawStart.x, this.m_drawEnd.y, this.m_drawEnd.x, this.m_drawEnd.y);     // 下
        canvas.drawDottedLine(rectColor, this.m_drawStart.x, this.m_drawStart.y, this.m_drawStart.x, this.m_drawEnd.y); // 右
        canvas.drawDottedLine(rectColor, this.m_drawEnd.x, this.m_drawStart.y, this.m_drawEnd.x, this.m_drawEnd.y);     // 左
        canvas.drawDottedLine(lineColor, this.m_drawStart.x, this.m_drawStart.y, this.m_drawEnd.x, this.m_drawEnd.y);
        canvas.drawEllipseFill(lineColor, lineColor,this.m_drawEnd.x, this.m_drawEnd.y, 4);

        let pos = {};
        pos.start_x = this.m_drawStart.x;
        pos.end_x = this.m_drawEnd.x;
        pos.start_y = this.m_drawStart.y;
        pos.end_y = this.m_drawEnd.y;
        this.drawBox(canvas, pos);     
    }
    //==================================================================
    // [GAN BOX] DRAW BOX
    //==================================================================
    drawBox(canvas, pos) {

        // 描画色
        const rectColor = this.m_drawParam.getColor(this.m_drawParam.m_color.GAN_BOX_LINE_RECT.c);
        const halfColor = this.m_drawParam.getColor(this.m_drawParam.m_color.GAN_BOX_LINE_50.c);
        const color = this.m_drawParam.getColor(this.m_drawParam.m_color.GAN_BOX_LINE.c);
        const strColor = "white";

        const width = pos.end_x - pos.start_x;
        const height = pos.end_y - pos.start_y;

        // 横軸
        const f750_x = width * 0.750 + pos.start_x;
        const f618_x = width * 0.618 + pos.start_x;
        const f500_x = width * 0.5 + pos.start_x;
        const f382_x = width * 0.382 + pos.start_x;
        const f250_x = width * 0.250 + pos.start_x;

        canvas.drawThinLine(color, f750_x, pos.start_y, f750_x, pos.end_y);
        canvas.drawThinLine(color, f618_x, pos.start_y, f618_x, pos.end_y);
        canvas.drawThinLine(halfColor, f500_x, pos.start_y, f500_x, pos.end_y);
        canvas.drawThinLine(color, f382_x, pos.start_y, f382_x, pos.end_y);
        canvas.drawThinLine(color, f250_x, pos.start_y, f250_x, pos.end_y);

        const strPosMargin = (pos.end_y < pos.start_y)? 0 : 14;
        canvas.drawStringC("75%", f750_x, pos.start_y - strPosMargin, strColor);
        canvas.drawStringC("61.8%", f618_x, pos.start_y - strPosMargin, strColor);
        canvas.drawStringC("50%", f500_x, pos.start_y - strPosMargin, strColor);
        canvas.drawStringC("38.2%", f382_x, pos.start_y - strPosMargin, strColor);
        canvas.drawStringC("25%", f250_x, pos.start_y - strPosMargin, strColor);

        // 縦軸
        const f750_y = height * 0.750 + pos.start_y;
        const f618_y = height * 0.618 + pos.start_y;
        const f500_y = height * 0.5 + pos.start_y;
        const f382_y = height * 0.382 + pos.start_y;
        const f250_y = height * 0.250 + pos.start_y;

        canvas.drawThinLine(color, pos.start_x, f750_y, pos.end_x, f750_y);
        canvas.drawThinLine(color, pos.start_x, f618_y, pos.end_x, f618_y);
        canvas.drawThinLine(halfColor, pos.start_x, f500_y, pos.end_x, f500_y);
        canvas.drawThinLine(color, pos.start_x, f382_y, pos.end_x, f382_y);
        canvas.drawThinLine(color, pos.start_x, f250_y, pos.end_x, f250_y);

        const margin = 8;
        const strPosX = (pos.start_x < pos.end_x)? pos.start_x - 2 : pos.end_x - 2;
        canvas.drawStringR("75%", strPosX, f750_y - margin, strColor);
        canvas.drawStringR("61.8%", strPosX, f618_y - margin, strColor);
        canvas.drawStringR("50%", strPosX, f500_y - margin, strColor);
        canvas.drawStringR("38.2%", strPosX, f382_y - margin, strColor);
        canvas.drawStringR("25%", strPosX, f250_y - margin, strColor);

        // 全体枠
        canvas.drawLine(rectColor, pos.start_x, pos.start_y, pos.end_x, pos.start_y);
        canvas.drawLine(rectColor, pos.start_x, pos.start_y, pos.start_x, pos.end_y);
        canvas.drawLine(rectColor, pos.end_x, pos.start_y, pos.end_x, pos.end_y);   
        canvas.drawLine(rectColor, pos.start_x, pos.end_y, pos.end_x, pos.end_y);
    }
    //==============================================================================
    //	[GAN BOX] JUDGE SELECT OBJECT  (OVERRIDE)
    //==============================================================================
    //==============================================================================
    //	[GAN BOX] SELECT OBJECT DRAW  (OVERRIDE)
    //==============================================================================
}
//-------------------------------------------------------------------
// クラス名: ChartThreePointBase
//
// クラス概要: 3点方式ベースクラス
//--------------------------------------------------------------------
export class ChartThreePointBase extends ChartDrawTrendLine {
    constructor(ex) {
        super();
        this.m_drawFirst = new ChartPoint();   // 開始地点
        this.m_drawSecond = new ChartPoint();   // 中間地点
        this.m_selectedSecond = new ChartPoint();
        this.m_prevMousePos = new ChartPoint();
        this.clearPos();
    }
    clearPos() {
        super.clearPos();
        this.m_drawFirst.x = -1;
        this.m_drawFirst.y = -1;
        this.m_drawSecond.x = -1;
        this.m_drawSecond.y = -1;
        this.m_selectedStart.x = -1;
        this.m_selectedStart.y = -1;
        this.m_selectedSecond.x = -1;
        this.m_selectedSecond.y = -1;
        this.m_prevMousePos.x = 0;
        this.m_prevMousePos.y = 0;
    }
    isDrawing() {
        return (0 <= this.m_drawSecond.x && 0 <= this.m_drawSecond.y) ? true: false;
    }
    //==================================================================
    // [THREE POINT] ADD OBJECT (OVERRIDE)
    //==================================================================
    add(start_x_entry, start_y_price, end_x_entry, end_y_price) {
        let obj = new ChartTechToolObj();
        obj.m_selected = DTOOL_NOTOUCH;
        obj.m_drawType = this.getType();

        // 開始及び中間地点を復元
        const firstEntry = this.m_common.getPosToEntryForMinus(this.m_drawFirst.x);
        const firstPrice = this.m_drawInf.cnvPosYToValue(this.m_drawFirst.y);
        const secondEntry = this.m_common.getPosToEntryForMinus(this.m_drawSecond.x);
        const secondPrice = this.m_drawInf.cnvPosYToValue(this.m_drawSecond.y);

        if(secondEntry <= end_x_entry || obj.m_drawType === CD.TECH_TOOL_FIBOCHANNEL){
            obj.m_startEntryIndex = firstEntry;
            obj.m_startPrice      = firstPrice;
            obj.m_endEntryIndex   = end_x_entry;
            obj.m_endPrice        = end_y_price;
            obj.m_secondEntryIndex= secondEntry;
            obj.m_secondPrice     = secondPrice;
        }else{
            obj.m_startEntryIndex = firstEntry;
            obj.m_startPrice      = firstPrice;
            obj.m_endEntryIndex   = secondEntry;
            obj.m_endPrice        = secondPrice;
            obj.m_secondEntryIndex= end_x_entry
            obj.m_secondPrice     = end_y_price;
        }

        // 以下に該当する場合は取り合えずキャンセル扱い
        if (obj.m_startEntryIndex === obj.m_endEntryIndex && obj.m_startPrice === obj.m_endPrice) {
            obj = null;
            this.clearPos();
            return true;
        }
        if (obj.m_secondEntryIndex === obj.m_endEntryIndex && obj.m_secondPrice === obj.m_endPrice) {
            obj = null;
            this.clearPos();
            return true;
        }
        this.m_drawToolList.push(obj);
        this.clearPos();
        return true;
    }
    //==============================================================================
    //	[THREE POINT] MOVE OBJECT
    //==============================================================================
    move(ix, start_x_entry, start_y_price, end_x_entry, end_y_price) {
        let obj = this.m_drawToolList[ix];
        const secondEntry = this.m_common.getPosToEntryForMinus(this.m_selectedSecond.x);
        const secondPrice = this.m_drawInf.cnvPosYToValue(this.m_selectedSecond.y);
        if(secondEntry <= end_x_entry){
            obj.m_startEntryIndex = start_x_entry;
            obj.m_startPrice = start_y_price;
            obj.m_endEntryIndex = end_x_entry;
            obj.m_endPrice = end_y_price;
            obj.m_secondEntryIndex = secondEntry;
            obj.m_secondPrice = secondPrice;
        } else {
            obj.m_startEntryIndex = start_x_entry;
            obj.m_startPrice = start_y_price;
            obj.m_endEntryIndex = secondEntry;
            obj.m_endPrice = secondPrice;
            obj.m_secondEntryIndex = end_x_entry;
            obj.m_secondPrice = end_y_price;
        }

        // 以下に該当する場合は取り合えずキャンセル扱い
        if (obj.m_startEntryIndex === obj.m_endEntryIndex && obj.m_startPrice === obj.m_endPrice) {
            this.remove(ix);
            this.clearPos();
            return true;
        }
        if (obj.m_secondEntryIndex === obj.m_endEntryIndex && obj.m_secondPrice === obj.m_endPrice) {
            obj = null;
            this.remove(ix);
            this.clearPos();
            return true;
        }

        this.clearPos();
        return true;
    }
    //==============================================================================
    //	[THREE POINT] JUDGE SELECT OBJECT
    //==============================================================================
    isSelected(i, x, y) {

        let obj = this.m_drawToolList[i];

        let start = new ChartPoint(); // 開始地点
        let second = new ChartPoint(); // 中間地点
        let end = new ChartPoint();    // 終了地点

        start.x = super.getEntryToPosForTool(obj.m_startEntryIndex);
        start.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        second.x = super.getEntryToPosForTool(obj.m_secondEntryIndex);
        second.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_secondPrice);
        end.x = super.getEntryToPosForTool(obj.m_endEntryIndex);
        end.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

        let x1 = start.x;
        let y1 = start.y;
        let x3 = second.x;
        let y3 = second.y;
        let x2 = x;
        let y2 = y;

        if(super.chkIntersect(i, x1, y1, x3, y3, x2, y2)){
            return true;
        }
        
        const SELECT_MARGIN = 5;

        if (second.x - SELECT_MARGIN <= x && x <= second.x + SELECT_MARGIN) {
            if (second.y - SELECT_MARGIN <= y && y <= second.y + SELECT_MARGIN) {
                return true;
            }
        }

        if (end.x - SELECT_MARGIN <= x && x <= end.x + SELECT_MARGIN) {
            if (end.y - SELECT_MARGIN <= y && y <= end.y + SELECT_MARGIN) {
                return true;
            }
        }

        return false;
    }
}
//-------------------------------------------------------------------
// クラス名: ChartDrawPitchfork
//
// クラス概要: ピッチフォーク描画クラス
//--------------------------------------------------------------------
const DIRECTION_FLAT = 0;
const DIRECTION_UP = 1;
const DIRECTION_DOWN = 2;
const DIRECTION_RIGHT = 3;
const DIRECTION_LEFT = 4;
export class ChartDrawPitchfork extends ChartDrawTrendLine {
	constructor(ex) {
        super();
        this.m_drawFirst = new ChartPoint();    // 開始地点退避用
        this.m_drawSecond = new ChartPoint();   // 中間地点退避用
        this.m_selectedSecond = new ChartPoint();
        this.m_prevMousePos = new ChartPoint();
        this.m_isFibo = ex;
        this.clearPos();
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    clearPos() {
        super.clearPos();
        this.m_drawFirst.x = -1;
        this.m_drawFirst.y = -1;
        this.m_drawSecond.x = -1;
        this.m_drawSecond.y = -1;
        this.m_selectedStart.x = -1;
        this.m_selectedStart.y = -1;
        this.m_selectedSecond.x = -1;
        this.m_selectedSecond.y = -1;
        this.m_prevMousePos.x = 0;
        this.m_prevMousePos.y = 0;
    }
    isDrawing() {
        return (0 <= this.m_drawSecond.x && 0 <= this.m_drawSecond.y) ? true: false;
    }
    getType = () => { return (this.m_isFibo) ? CD.TECH_TOOL_PITCH_FORK_EX : CD.TECH_TOOL_PITCH_FORK; }
    //==================================================================
    // [PITCH FORK] ADD OBJECT (OVERRIDE)
    //==================================================================
    add(start_x_entry, start_y_price, end_x_entry, end_y_price) {
        let obj = new ChartTechToolObj();
        obj.m_selected = DTOOL_NOTOUCH;
        obj.m_drawType = this.getType();

        // 開始及び中間地点を復元
        const firstEntry = this.m_common.getPosToEntryForMinus(this.m_drawFirst.x);
        const firstPrice = this.m_drawInf.cnvPosYToValue(this.m_drawFirst.y);
        const secondEntry = this.m_common.getPosToEntryForMinus(this.m_drawSecond.x);
        const secondPrice = this.m_drawInf.cnvPosYToValue(this.m_drawSecond.y);

        if(secondEntry <= end_x_entry){
            obj.m_startEntryIndex = firstEntry;
            obj.m_startPrice      = firstPrice;
            obj.m_endEntryIndex   = end_x_entry;
            obj.m_endPrice        = end_y_price;
            obj.m_secondEntryIndex= secondEntry;
            obj.m_secondPrice     = secondPrice;
        }else{
            obj.m_startEntryIndex = firstEntry;
            obj.m_startPrice      = firstPrice;
            obj.m_endEntryIndex   = secondEntry;
            obj.m_endPrice        = secondPrice;
            obj.m_secondEntryIndex= end_x_entry
            obj.m_secondPrice     = end_y_price;
        }

        // 以下に該当する場合は取り合えずキャンセル扱い
        if (obj.m_startEntryIndex === obj.m_endEntryIndex && obj.m_startPrice === obj.m_endPrice) {
            obj = null;
            this.clearPos();
            return true;
        }
        if (obj.m_secondEntryIndex === obj.m_endEntryIndex && obj.m_secondPrice === obj.m_endPrice) {
            obj = null;
            this.clearPos();
            return true;
        }
        this.m_drawToolList.push(obj);
        this.clearPos();
        return true;
    }
    //==============================================================================
    //	[PITCH FORK] MOVE OBJECT
    //==============================================================================
    move(ix, start_x_entry, start_y_price, end_x_entry, end_y_price) {
        let obj = this.m_drawToolList[ix];
        // 常に左右を保つ(MOVEの時のため)
        const secondEntry = this.m_common.getPosToEntryForMinus(this.m_selectedSecond.x);
        const secondPrice = this.m_drawInf.cnvPosYToValue(this.m_selectedSecond.y);
        if(secondEntry <= end_x_entry){
            obj.m_startEntryIndex = start_x_entry;
            obj.m_startPrice = start_y_price;
            obj.m_endEntryIndex = end_x_entry;
            obj.m_endPrice = end_y_price;
            obj.m_secondEntryIndex = secondEntry;
            obj.m_secondPrice = secondPrice;
        } else {
            obj.m_startEntryIndex = start_x_entry;
            obj.m_startPrice = start_y_price;
            obj.m_endEntryIndex = secondEntry;
            obj.m_endPrice = secondPrice;
            obj.m_secondEntryIndex = end_x_entry;
            obj.m_secondPrice = end_y_price;
        }

        // 以下に該当する場合は取り合えずキャンセル扱い
        if (obj.m_startEntryIndex === obj.m_endEntryIndex && obj.m_startPrice === obj.m_endPrice) {
            this.remove(ix);
            this.clearPos();
            return true;
        }
        if (obj.m_secondEntryIndex === obj.m_endEntryIndex && obj.m_secondPrice === obj.m_endPrice) {
            obj = null;
            this.remove(ix);
            this.clearPos();
            return true;
        }

        this.clearPos();
        return true;
    }
    //==============================================================================
    //	[PITCH FORK] JUDGE SELECT OBJECT
    //==============================================================================
    isSelected(i, x, y) {

        let obj = this.m_drawToolList[i];

        let center = new ChartPoint(); // 開始地点
        let second = new ChartPoint(); // 中間地点
        let end = new ChartPoint();    // 終了地点

        center.x = super.getEntryToPosForTool(obj.m_startEntryIndex);
        center.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        second.x = super.getEntryToPosForTool(obj.m_secondEntryIndex);
        second.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_secondPrice);
        end.x = super.getEntryToPosForTool(obj.m_endEntryIndex);
        end.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

        // 中心のフォーク
        let midPt = new ChartPoint();
        midPt.x = super.getMidX(second.x, end.x);
        midPt.y = super.getMidY(second.y, end.y);

        // 最終点取得
        const thirdPt = this.getCenterLinePoint(center, midPt);

        let x1 = super.getEntryToPosForTool(obj.m_startEntryIndex);
        let y1 = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        let x3 = thirdPt.x;
        let y3 = thirdPt.y;
        let x2 = x;
        let y2 = y;

        if(super.chkIntersect(i, x1, y1, x3, y3, x2, y2)){
            return true;
        }
        
        const SELECT_MARGIN = 5;

        if (second.x - SELECT_MARGIN <= x && x <= second.x + SELECT_MARGIN) {
            if (second.y - SELECT_MARGIN <= y && y <= second.y + SELECT_MARGIN) {
                return true;
            }
        }

        if (end.x - SELECT_MARGIN <= x && x <= end.x + SELECT_MARGIN) {
            if (end.y - SELECT_MARGIN <= y && y <= end.y + SELECT_MARGIN) {
                return true;
            }
        }

        return false;
    }
    //==================================================================
    // [PITCH FORK] REMOVE OBJECT (OVERRIDE)
    //==================================================================
    //==================================================================
    // [PITCH FORK] DRAW
    //==================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_DRAWING.c);
        if (ix === selectedIX && !fixSelected && isMouseLbtn) {
            // 選択状態
            this.drawDragObject(canvas, ix, select_x, select_y);
        } else {
            // 通常描画
            let obj = this.m_drawToolList[ix];
            const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TRENDLINE.c);

            let center = new ChartPoint(); // 開始地点
            let second = new ChartPoint(); // 中間地点
            let end = new ChartPoint();    // 終了地点

            center.x = super.getEntryToPosForTool(obj.m_startEntryIndex);
            center.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
            second.x = super.getEntryToPosForTool(obj.m_secondEntryIndex);
            second.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_secondPrice);
            end.x = super.getEntryToPosForTool(obj.m_endEntryIndex);
            end.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

            this.drawPitchFork(canvas, lineColor, center, second, end);
        }
    }
   //==============================================================================
    //	[PITCH FORK] DRAG OBJECT
    //==============================================================================
    drawDragObject(canvas, ix, select_x, select_y) {
        let obj = this.m_drawToolList[ix];
        //const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TRENDLINE.c);
        const lineColor = "white";

        this.m_selectedStart.x = super.getEntryToPosForTool(obj.m_startEntryIndex);
        this.m_selectedStart.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        this.m_selectedSecond.x = super.getEntryToPosForTool(obj.m_secondEntryIndex);
        this.m_selectedSecond.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_secondPrice);
        this.m_selectedEnd.x = super.getEntryToPosForTool(obj.m_endEntryIndex);
        this.m_selectedEnd.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

        const SELECT_MARGIN = 5;
        const current_x = this.m_drawInf.getMousePosX();
        const current_y = this.m_drawInf.getMousePosY();
        if (this.m_selectedSecond.x - SELECT_MARGIN <= select_x && select_x <= this.m_selectedSecond.x + SELECT_MARGIN
            && this.m_selectedSecond.y - SELECT_MARGIN <= select_y && select_y <= this.m_selectedSecond.y + SELECT_MARGIN) {
                // 左終端選択時
                this.m_selectedSecond.x = current_x;
                this.m_selectedSecond.y = current_y;
        } else if (this.m_selectedEnd.x - SELECT_MARGIN <= select_x && select_x <= this.m_selectedEnd.x + SELECT_MARGIN
            && this.m_selectedEnd.y - SELECT_MARGIN <= select_y && select_y <= this.m_selectedEnd.y + SELECT_MARGIN) {
                // 右終端選択時
                this.m_selectedEnd.x = current_x;
                this.m_selectedEnd.y = current_y;
        } else if (this.m_selectedStart.x - SELECT_MARGIN <= select_x && select_x <= this.m_selectedStart.x + SELECT_MARGIN
            && this.m_selectedStart.y - SELECT_MARGIN <= select_y && select_y <= this.m_selectedStart.y + SELECT_MARGIN) {
                // 中心部選択時
                this.m_selectedStart.x = current_x;
                this.m_selectedStart.y = current_y;
        } else {
            // ゴミ箱表示
            const mosX = this.m_drawInf.getMousePosX();
            const mosY = this.m_drawInf.getMousePosY();
            super.drawDustbox(canvas, mosX, mosY);
            // 移動部分選択時(マウスの移動距離を加算するだけ)
            if(0 < this.m_prevMousePos.x) {
                const move_x = current_x - this.m_prevMousePos.x;
                const move_y = current_y - this.m_prevMousePos.y;
                this.m_selectedStart.x += move_x;
                this.m_selectedStart.y += move_y;
                this.m_selectedSecond.x += move_x;
                this.m_selectedSecond.y += move_y;
                this.m_selectedEnd.x += move_x;
                this.m_selectedEnd.y += move_y;
            }
            if (this.m_prevMousePos.x <= 0) {
                this.m_prevMousePos.x = current_x;
                this.m_prevMousePos.y = current_y;
            }
        }

        this.drawPitchFork(canvas, lineColor, this.m_selectedStart, this.m_selectedSecond, this.m_selectedEnd);
        canvas.drawEllipseFill(lineColor, lineColor, this.m_selectedSecond.x, this.m_selectedSecond.y, 4);
        canvas.drawEllipseFill(lineColor, lineColor, this.m_selectedEnd.x, this.m_selectedEnd.y, 4);
        canvas.drawEllipseFill(lineColor, lineColor, this.m_selectedStart.x, this.m_selectedStart.y, 4);
    }
    //==============================================================================
    //	[PITCH FORK] SELECT OBJECT DRAW
    //==============================================================================
    drawSelected(canvas, ix) {
        let obj = this.m_drawToolList[ix];
        const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_SELECTED.c);

        let center = new ChartPoint(); // 開始地点
        let second = new ChartPoint(); // 中間地点
        let end = new ChartPoint();    // 終了地点

        center.x = super.getEntryToPosForTool(obj.m_startEntryIndex);
        center.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        second.x = super.getEntryToPosForTool(obj.m_secondEntryIndex);
        second.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_secondPrice);
        end.x = super.getEntryToPosForTool(obj.m_endEntryIndex);
        end.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

        //this.drawPitchFork(canvas, lineColor, center, second, end);
        canvas.drawEllipseFill(lineColor, lineColor, second.x, second.y, 4);
        canvas.drawEllipseFill(lineColor, lineColor, end.x, end.y, 4);
        canvas.drawEllipseFill(lineColor, lineColor, center.x, center.y, 4);
    }
    //==================================================================
    // [PITCH FORK] DRAW TOOL
    //==================================================================
    drawingLine(canvas) {
        if (this.m_drawStart.x < 0 ||  this.m_drawStart.y < 0) {
            return;
        }
        const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_DRAWING.c);
        if(0 <= this.m_drawStart.x && 0 <= this.m_drawStart.y){
            if(0 <= this.m_drawSecond.x && 0 <= this.m_drawSecond.y){
                // 描画
                this.drawPitchFork(canvas, lineColor, this.m_drawFirst, this.m_drawSecond, this.m_drawEnd);
                canvas.drawEllipseFill(lineColor, lineColor, this.m_drawSecond.x, this.m_drawSecond.y, 4);
                canvas.drawEllipseFill(lineColor, lineColor, this.m_drawEnd.x, this.m_drawEnd.y, 4);
                canvas.drawEllipseFill(lineColor, lineColor, this.m_drawFirst.x, this.m_drawFirst.y, 4);
            } else{
                // 2点間描画中
                this.m_drawFirst.x = this.m_drawStart.x;
                this.m_drawFirst.y = this.m_drawStart.y;     
                const thirdPt = this.getCenterLinePoint(this.m_drawStart, this.m_drawEnd);
                //canvas.drawLine(lineColor, this.m_drawStart.x, this.m_drawStart.y, thirdPt.x, thirdPt.y);
                canvas.drawDottedLine(lineColor, this.m_drawStart.x, this.m_drawStart.y, thirdPt.x, thirdPt.y);
            }
        }
    }
    //==================================================================
    // [PITCH FORK] DRAW PITCH FORK MAIN
    //==================================================================
    drawPitchFork(canvas, lineColor, center, second, end){
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
        const chartEndPosX = this.m_drawInf.getChartAreaEndPosX();

        // 中間地点もポイント済み
        canvas.drawLine(lineColor, second.x, second.y, end.x, end.y);

        // 中心のフォーク
        let midPt = new ChartPoint();
        midPt.x = super.getMidX(second.x, end.x);
        midPt.y = super.getMidY(second.y, end.y);
        const thirdPt = this.getCenterLinePoint(center, midPt);
        canvas.drawLine(lineColor, center.x, center.y, thirdPt.x, thirdPt.y);

        // 傾き
        let m = 0;
        if (center.x === midPt.x) {
            if(midPt.y < center.y){
                thirdPt.vert = DIRECTION_UP;
            }else{
                thirdPt.vert = DIRECTION_DOWN;
            }
        }else if(center.y === midPt.y){
            if(midPt.x < center.x){
                thirdPt.vert = DIRECTION_LEFT;
            }else{
                thirdPt.vert = DIRECTION_RIGHT;
            }
        }else{
            m = (center.y - midPt.y) / (center.x - midPt.x);
        }

        // 左のフォーク
        this.drawFork(canvas, lineColor, m, thirdPt, second, center);

        // 右のフォーク
        this.drawFork(canvas, lineColor, m, thirdPt, end, center);

        // 拡張描画
        if (this.m_isFibo) {
            const x_dis = (end.x - second.x) * 0.5;
            const y_dis = (end.y - second.y) * 0.5;

            let fork_100L = new ChartPoint();
            let fork_764L = new ChartPoint();
            let fork_618L = new ChartPoint();
            let fork_382L = new ChartPoint();
            let fork_382R = new ChartPoint();
            let fork_618R = new ChartPoint();
            let fork_764R = new ChartPoint();
            let fork_100R = new ChartPoint();

            // 左
            fork_100L.x = second.x - x_dis;
            fork_100L.y = second.y - y_dis;
            fork_764L.x = second.x - (x_dis * 0.764);
            fork_764L.y = second.y - (y_dis * 0.764);
            fork_618L.x = second.x - (x_dis * 0.618);
            fork_618L.y = second.y - (y_dis * 0.618);
            fork_382L.x = second.x - (x_dis * 0.382);
            fork_382L.y = second.y - (y_dis * 0.382);
            // 右
            fork_382R.x = end.x + (x_dis * 0.382);
            fork_382R.y = end.y + (y_dis * 0.382);
            fork_618R.x = end.x + (x_dis * 0.618);
            fork_618R.y = end.y + (y_dis * 0.618);
            fork_764R.x = end.x + (x_dis * 0.764);
            fork_764R.y = end.y + (y_dis * 0.764);
            fork_100R.x = end.x + x_dis;
            fork_100R.y = end.y + y_dis;

            const clr_100 = lineColor;
            const clr_764 = "rgb(0, 255, 0)";
            const clr_618 = "rgb(255, 128, 128)";
            const clr_382 = "rgb(0, 128, 255)";

            // 100%(左)
            this.drawFork(canvas, lineColor, m, thirdPt, fork_100L, center);
            // 76.4%(左)
            this.drawFork(canvas, clr_764, m, thirdPt, fork_764L, center);
            // 61.8%(左)
            this.drawFork(canvas, clr_618, m, thirdPt, fork_618L, center);
            // 38.2%(左)
            this.drawFork(canvas, clr_382, m, thirdPt, fork_382L, center);

            // 38.2%(右)
            this.drawFork(canvas, clr_382, m, thirdPt, fork_382R, center);
            // 61.8%(右)
            this.drawFork(canvas, clr_618, m, thirdPt, fork_618R, center);
            // 76.4%(右)
            this.drawFork(canvas, clr_764, m, thirdPt, fork_764R, center);
            // 100%(右)
            this.drawFork(canvas, lineColor, m, thirdPt, fork_100R, center);

            
            //canvas.drawDottedLine(lineColor, second.x, second.y, fork_100L.x, fork_100L.y);
            //canvas.drawDottedLine(lineColor, end.x, end.y, fork_100R.x, fork_100R.y);
            canvas.drawLine(lineColor, second.x, second.y, fork_100L.x, fork_100L.y);
            canvas.drawLine(lineColor, end.x, end.y, fork_100R.x, fork_100R.y);
        }
    }
    //==================================================================
    // [PITCH FORK] DRAW FORK LEFT OR RIGHT
    //==================================================================
    drawFork(canvas, lineColor, m, thirdPt, secondPt, center) {
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
        const chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let thirdWork = thirdPt;
        if(m === 0){
            if(thirdPt.vert === DIRECTION_UP){
                canvas.drawLine(lineColor, secondPt.x, secondPt.y, secondPt.x, chartBgnPosY);
            }else if(thirdPt.vert === DIRECTION_DOWN){
                canvas.drawLine(lineColor, secondPt.x, secondPt.y, secondPt.x, chartEndPosY);
            }else if(thirdPt.vert === DIRECTION_LEFT){
                canvas.drawLine(lineColor, secondPt.x, secondPt.y, 0, secondPt.y);
            }else{
                canvas.drawLine(lineColor, secondPt.x, secondPt.y, chartEndPosX, secondPt.y);
            }
            return;
        }

        thirdWork.y = m * (thirdWork.x - secondPt.x) + secondPt.y;
        if(thirdPt.vert === DIRECTION_UP){
            thirdWork.y = chartBgnPosY;
            thirdWork.x = ((thirdWork.y - secondPt.y) + m * secondPt.x) / m;
            canvas.drawLine(lineColor, secondPt.x, secondPt.y, thirdWork.x, thirdWork.y);
        }else if(thirdPt.vert === DIRECTION_DOWN){
            thirdWork.y = chartEndPosY;
            thirdWork.x = ((thirdWork.y - secondPt.y) + m * secondPt.x) / m;
            canvas.drawLine(lineColor, secondPt.x, secondPt.y, thirdWork.x, thirdWork.y);
        }else{
            if(center.x < secondPt.x) {
                canvas.drawLine(lineColor, secondPt.x, secondPt.y, chartEndPosX, secondPt.y);
            }else{
                canvas.drawLine(lineColor, secondPt.x, secondPt.y, 0, secondPt.y);
            }
        }
    }
    //==================================================================
    // [PITCH FORK] GET CENTER LINE POS
    //==================================================================
    getCenterLinePoint(startPt, endPt) {
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        const chartEndPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
        const chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let thirdPt = new ChartPoint();
        if (startPt.y < endPt.y) {
            // 下向き
            if(startPt.x < endPt.x){
                // 右向き
                thirdPt.x = super.getEndX(startPt.x, startPt.y, endPt.x, endPt.y, chartEndPosY);
                thirdPt.y = chartEndPosY;
                thirdPt.horiz = DIRECTION_RIGHT;
            }else　if(endPt.x < startPt.x){
                // 左向き
                thirdPt.x = 0;
                thirdPt.y = super.getEndY(startPt.x, startPt.y, endPt.x, endPt.y, 0);
                thirdPt.horiz = DIRECTION_LEFT;
            }else{
                // 縦一直線
                thirdPt.x = startPt.x;
                thirdPt.y = chartEndPosY;
                thirdPt.horiz = DIRECTION_FLAT;
            }
            thirdPt.vert = DIRECTION_DOWN;
        }else if (endPt.y < startPt.y) {
            // 上向き
            if(startPt.x < endPt.x){
                // 右向き
                thirdPt.x = super.getEndX(startPt.x, startPt.y, endPt.x, endPt.y, chartBgnPosY);
                thirdPt.y = chartBgnPosY;
                thirdPt.horiz = DIRECTION_RIGHT;
            }else　if(endPt.x < startPt.x){
                // 左向き
                thirdPt.x = 0;
                thirdPt.y = super.getEndY(startPt.x, startPt.y, endPt.x, endPt.y, 0);
                //thirdPt.horiz = DIRECTION_LEFT;
            }else{
                // 縦一直線
                thirdPt.x = startPt.x;
                thirdPt.y = chartBgnPosY;
                thirdPt.horiz = DIRECTION_FLAT;
            }
            thirdPt.vert = DIRECTION_UP;
        }else{
            // 横一直線
            if(startPt.x < endPt.x) {
                thirdPt.x = chartEndPosX;
            }else{
                thirdPt.x = 0;
            }
            thirdPt.y = startPt.y;
            thirdPt.vert = DIRECTION_FLAT;
        }
        return thirdPt;
    }
}
//-------------------------------------------------------------------
// クラス名: ChartDrawFiboChannel
//
// クラス概要: フィボナッチチャネル描画クラス
//--------------------------------------------------------------------
export class ChartDrawFiboChannel extends ChartThreePointBase {
	constructor() {
        super();
    }
    init(arrayList, common) {
        super.init(arrayList, common);
    }
    getType = () => { return CD.TECH_TOOL_FIBOCHANNEL; }
    //==============================================================================
    // [FIBONACCHI CHANNEL] ADD OBJECT (OVERRIDE)
    //==============================================================================
    //==============================================================================
    // [FIBONACCHI CHANNEL] REMOVE OBJECT (OVERRIDE)
    //==============================================================================
    //==============================================================================
    // [FIBONACCHI CHANNEL] REMOVE OBJECT (OVERRIDE)
    //==============================================================================
    //==============================================================================
    //	[FIBONACCHI CHANNEL] JUDGE SELECT OBJECT
    //==============================================================================
    isSelected(i, x, y) {

        let obj = this.m_drawToolList[i];

        let start = new ChartPoint(); // 開始地点
        let second = new ChartPoint(); // 中間地点
        let end = new ChartPoint();    // 終了地点

        start.x = super.getEntryToPosForTool(obj.m_startEntryIndex);
        start.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        second.x = super.getEntryToPosForTool(obj.m_secondEntryIndex);
        second.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_secondPrice);
        end.x = super.getEntryToPosForTool(obj.m_endEntryIndex);
        end.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

        if(super.chkIntersect(i, start.x, start.y, second.x, second.y, x, y)){
            return true;
        }
        
        const SELECT_MARGIN = 5;

        if (start.x - SELECT_MARGIN <= x && x <= start.x + SELECT_MARGIN) {
            if (start.y - SELECT_MARGIN <= y && y <= start.y + SELECT_MARGIN) {
                return true;
            }
        }

        if (second.x - SELECT_MARGIN <= x && x <= second.x + SELECT_MARGIN) {
            if (second.y - SELECT_MARGIN <= y && y <= second.y + SELECT_MARGIN) {
                return true;
            }
        }

        if (end.x - SELECT_MARGIN <= x && x <= end.x + SELECT_MARGIN) {
            if (end.y - SELECT_MARGIN <= y && y <= end.y + SELECT_MARGIN) {
                return true;
            }
        }

        return false;
    }
    //==============================================================================
    // [FIBONACCHI CHANNEL] DRAW
    //==============================================================================
    draw(canvas, ix, selectedIX, fixSelected, isMouseLbtn, select_x, select_y) {
        const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_DRAWING.c);
        if (ix === selectedIX && !fixSelected && isMouseLbtn) {
            // ゴミ箱表示
            const mosX = this.m_drawInf.getMousePosX();
            const mosY = this.m_drawInf.getMousePosY();
            super.drawDustbox(canvas, mosX, mosY);
            // 選択状態
            this.drawDragObject(canvas, ix, select_x, select_y);
        } else {
            // 通常描画
            let obj = this.m_drawToolList[ix];
            const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TRENDLINE.c);
            let first = new ChartPoint(); // 開始地点
            let second = new ChartPoint(); // 中間地点
            let end = new ChartPoint();    // 終了地点
            first.x = super.getEntryToPosForTool(obj.m_startEntryIndex);
            first.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
            second.x = super.getEntryToPosForTool(obj.m_secondEntryIndex);
            second.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_secondPrice);
            end.x = super.getEntryToPosForTool(obj.m_endEntryIndex);
            end.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

            this.drawChannel(canvas, lineColor, first, second, end);
        }
    }
    //==============================================================================
    //	[FIBONACCHI CHANNEL] DRAG OBJECT
    //==============================================================================
    drawDragObject(canvas, ix, select_x, select_y) {
        let obj = this.m_drawToolList[ix];
        //const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TRENDLINE.c);
        const lineColor = "white";

        this.m_selectedStart.x = super.getEntryToPosForTool(obj.m_startEntryIndex);
        this.m_selectedStart.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        this.m_selectedSecond.x = super.getEntryToPosForTool(obj.m_secondEntryIndex);
        this.m_selectedSecond.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_secondPrice);
        this.m_selectedEnd.x = super.getEntryToPosForTool(obj.m_endEntryIndex);
        this.m_selectedEnd.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

        const SELECT_MARGIN = 5;
        const current_x = this.m_drawInf.getMousePosX();
        const current_y = this.m_drawInf.getMousePosY();
        if (this.m_selectedSecond.x - SELECT_MARGIN <= select_x && select_x <= this.m_selectedSecond.x + SELECT_MARGIN
            && this.m_selectedSecond.y - SELECT_MARGIN <= select_y && select_y <= this.m_selectedSecond.y + SELECT_MARGIN) {
                // 左終端選択時
                this.m_selectedSecond.x = current_x;
                this.m_selectedSecond.y = current_y;
        } else if (this.m_selectedEnd.x - SELECT_MARGIN <= select_x && select_x <= this.m_selectedEnd.x + SELECT_MARGIN
            && this.m_selectedEnd.y - SELECT_MARGIN <= select_y && select_y <= this.m_selectedEnd.y + SELECT_MARGIN) {
                // 右終端選択時
                this.m_selectedEnd.x = current_x;
                this.m_selectedEnd.y = current_y;
        } else if (this.m_selectedStart.x - SELECT_MARGIN <= select_x && select_x <= this.m_selectedStart.x + SELECT_MARGIN
            && this.m_selectedStart.y - SELECT_MARGIN <= select_y && select_y <= this.m_selectedStart.y + SELECT_MARGIN) {
                // 中心部選択時
                this.m_selectedStart.x = current_x;
                this.m_selectedStart.y = current_y;
        } else {
            // 移動部分選択時(マウスの移動距離を加算するだけ)
            if(0 < this.m_prevMousePos.x) {
                const move_x = current_x - this.m_prevMousePos.x;
                const move_y = current_y - this.m_prevMousePos.y;
                this.m_selectedStart.x += move_x;
                this.m_selectedStart.y += move_y;
                this.m_selectedSecond.x += move_x;
                this.m_selectedSecond.y += move_y;
                this.m_selectedEnd.x += move_x;
                this.m_selectedEnd.y += move_y;
            }
            if (this.m_prevMousePos.x <= 0) {
                this.m_prevMousePos.x = current_x;
                this.m_prevMousePos.y = current_y;
            }
        }

        this.drawChannel(canvas, lineColor, this.m_selectedStart, this.m_selectedSecond, this.m_selectedEnd);
        canvas.drawEllipseFill(lineColor, lineColor, this.m_selectedSecond.x, this.m_selectedSecond.y, 4);
        canvas.drawEllipseFill(lineColor, lineColor, this.m_selectedEnd.x, this.m_selectedEnd.y, 4);
        canvas.drawEllipseFill(lineColor, lineColor, this.m_selectedStart.x, this.m_selectedStart.y, 4);
    }
    //==============================================================================
    //	[FIBONACCHI CHANNEL] SELECT OBJECT DRAW
    //==============================================================================
    drawSelected(canvas, ix) {
        let obj = this.m_drawToolList[ix];
        const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_SELECTED.c);

        let start = new ChartPoint(); // 開始地点
        let second = new ChartPoint(); // 中間地点
        let end = new ChartPoint();    // 終了地点

        start.x = super.getEntryToPosForTool(obj.m_startEntryIndex);
        start.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_startPrice);
        second.x = super.getEntryToPosForTool(obj.m_secondEntryIndex);
        second.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_secondPrice);
        end.x = super.getEntryToPosForTool(obj.m_endEntryIndex);
        end.y = this.m_drawInf.cnvValueToPosYForPrice(obj.m_endPrice);

        canvas.drawEllipseFill(lineColor, lineColor, second.x, second.y, 4);
        canvas.drawEllipseFill(lineColor, lineColor, end.x, end.y, 4);
        canvas.drawEllipseFill(lineColor, lineColor, start.x, start.y, 4);
    }
    //==============================================================================
    // [FIBONACCHI CHANNEL] DRAW TOOL DOT LINE
    //==============================================================================
    drawingLine(canvas) {
            if (this.m_drawStart.x < 0 ||  this.m_drawStart.y < 0) {
                return;
            }
            const lineColor = this.m_drawParam.getColor(this.m_drawParam.m_color.TT_DRAWING.c);
            if(0 <= this.m_drawStart.x && 0 <= this.m_drawStart.y){
                if(0 <= this.m_drawSecond.x && 0 <= this.m_drawSecond.y){
                    // 描画
                    this.drawChannel(canvas, lineColor, this.m_drawFirst, this.m_drawSecond, this.m_drawEnd);
                    canvas.drawEllipseFill(lineColor, lineColor, this.m_drawSecond.x, this.m_drawSecond.y, 4);
                    canvas.drawEllipseFill(lineColor, lineColor, this.m_drawEnd.x, this.m_drawEnd.y, 4);
                    canvas.drawEllipseFill(lineColor, lineColor, this.m_drawFirst.x, this.m_drawFirst.y, 4);
                } else{
                    // 2点間描画中
                    this.m_drawFirst.x = this.m_drawStart.x;
                    this.m_drawFirst.y = this.m_drawStart.y;
                    canvas.drawDottedLine(lineColor, this.m_drawStart.x, this.m_drawStart.y, this.m_drawEnd.x, this.m_drawEnd.y);
                }
            }
    }
    //==============================================================================
    // [FIBONACCHI CHANNEL] DRAW FIBONACCHI CHANNEL MAIN
    //==============================================================================
    drawChannel(canvas, lineColor, start, second, end) {

        const exColor = "rgb(255, 0, 0)";
        const fiboArray = [0.236, 0.382, 0.5, 0.618, 0.764, 1.618];
        const colorArray = [lineColor, "rgb(255, 255, 0)", "rgb(255, 128, 255)", "rgb(255, 128, 128)", "rgb(0, 255, 0)", exColor];
        const strArray = ["23.6%", "38.2%", "50%", "61.8%", "76.4%", "1.68"];
        const width = end.x - start.x;
        const height = end.y - start.y;
        let last_start = new ChartPoint();
        let last_end = new ChartPoint();
        for(let i = 0; i < fiboArray.length; i++){
            const w = width * fiboArray[i];
            const h = height * fiboArray[i];
            canvas.drawLine(colorArray[i], start.x + w, start.y + h, second.x + w, second.y + h);
            canvas.drawStringC(strArray[i], start.x + w, start.y + h, "white");
            last_start.x = start.x + w;
            last_start.y = start.y + h
            last_end.x = second.x + w;
            last_end.y = second.y + h
        }
        // 100％までの線
        canvas.drawLine(lineColor, start.x, start.y, second.x, second.y);
        canvas.drawLine(lineColor, start.x, start.y, end.x, end.y);
        canvas.drawLine(lineColor, end.x, end.y, second.x + width, second.y + height);
        canvas.drawLine(lineColor, second.x, second.y, second.x + width, second.y + height);
        canvas.drawStringC("100%", end.x, end.y, "white");

        // 最後までの付け足し線
        canvas.drawLine(exColor, end.x, end.y, last_start.x, last_start.y);
        canvas.drawLine(exColor, second.x + width, second.y + height, last_end.x, last_end.y);
    }

    //==============================================================================
    //	[FIBONACCHI CHANNEL] JUDGE SELECT OBJECT  (OVERRIDE)
    //==============================================================================
    //==============================================================================
    //	[FIBONACCHI CHANNEL] SELECT OBJECT DRAW  (OVERRIDE)
    //==============================================================================
}