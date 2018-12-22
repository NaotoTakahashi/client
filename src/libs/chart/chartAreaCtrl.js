import ChartSplit from './chartSplit';

const MAX_MAIN_SPLIT = 10;
export const SCROLL_HEIGHT = 20;
class ChartAreaCtrl {
	constructor(drawParam) {
        this.m_mainChartIndex = 0;
        // メインチャート部 => (i = 0)
        this.m_areaRect = new Array(MAX_MAIN_SPLIT);
        for (let i = 0; i < MAX_MAIN_SPLIT; i++) {
            this.m_areaRect[i] = { left: 0, top: 0, right: 0, bottom: 0 }
        }
        this.m_areaNum = 0;			// 分割画面数
        // 分割画面別描画サイズ(Y)
        this.m_splitSize = new Array(MAX_MAIN_SPLIT);
        this.m_splitSize.fill(0);
        this.m_splitSize[0] = -1;
        // 分割画面別描画割当比率
        this.m_areaRatio = new Array(MAX_MAIN_SPLIT);
        this.m_areaRatio.fill(0);
        this.m_areaHeight = 0;		// 描画領域(リサイズ判定用)
        this.m_areaWidth = 0;
        this.m_rightAreaWidth = 0;
        // スプリッタ(エリア間に1個)
        this.m_splitter = new Array(MAX_MAIN_SPLIT - 1);
        for(let i = 0; i < this.m_splitter.length; i++){
            this.m_splitter[i] = new ChartSplit(drawParam);
            this.m_splitter[i].init(this.m_areaRect[i], this.m_areaRect[i + 1]);
        }
        // スクロールバー表示高さ
        this.m_scrollHeight = 0;
        this.m_scroll_rc = { top: 0, left: 0, right: 0, bottom: 0 };
    }
    setMainChartIndex(i) { this.m_mainChartIndex = i; }
    getMainChartIndex() { return this.m_mainChartIndex; }
    getAreaWidth= () => { return this.m_areaWidth - this.m_rightAreaWidth; }
    setRightArea(width) {
        // 指定のサイズ分右側にスペースを作る
        this.m_rightAreaWidth = width;
    }
    setAreaRect(i, t, l, r, b) {
        this.m_areaRect[i].top = t;
        this.m_areaRect[i].left = l;
        this.m_areaRect[i].right = r;
        this.m_areaRect[i].bottom = b;
    }
    init(canvas, num) {
        if (num < 1 || MAX_MAIN_SPLIT < num){
            return false;
        }
        this.m_areaNum = num;
        this.m_areaHeight = canvas.getHeight();
        this.m_areaWidth = canvas.getWidth();
        const areaWidth = this.getAreaWidth();
        if(num === 1){
            this.setAreaRect(this.m_mainChartIndex, 0, 0, areaWidth, this.m_areaHeight);
            this.m_areaRatio[this.m_mainChartIndex] = 100;
            this.m_splitSize[this.m_mainChartIndex] = this.m_areaHeight;
            return true;
        }
 
        let heightPerOne = (this.m_areaHeight / (num + 2)) >> 0;
        let sup = this.m_areaHeight - (heightPerOne * (num + 2));
        let mainHeight = heightPerOne + heightPerOne + heightPerOne + sup;

        // メインチャート
        this.setAreaRect(this.m_mainChartIndex, 0, 0, areaWidth, mainHeight);
        let nextBgnY = mainHeight + 1;
        // サブチャート部
        this.m_areaNum = num;
        for (let i = 1; i < num; i++) {
            let btm = nextBgnY + heightPerOne;
            this.setAreaRect(i, nextBgnY, 0, areaWidth, btm);
            nextBgnY = btm + 1;
        }
        
        this.splitResize();
        return true;

    }
    load() {
    }
    save() {
    }
    reset(canvas) {
        this.divideDrawArea(canvas);
    }
    setScrollArea(boolVal) {
        this.m_scrollHeight = 0;
        if (boolVal) {
            this.m_scrollHeight = SCROLL_HEIGHT;
            this.m_scroll_rc = { top: this.m_areaHeight + 2, left: 0, right: this.getAreaWidth(), bottom: this.m_areaHeight + this.m_scrollHeight }
        }
    }
    getSplitAreaRatio(sz) { return ((sz * 100) / this.m_areaHeight) >> 0; }
	getSplitAreaSize(rt) { return (this.m_areaHeight * rt / 100) >> 0; }
    //==============================================================================
    //	描画領域割当管理
    // (CANVASサイズ変更のため現在の割当率から領域サイズ再算出)
    //==============================================================================
    divideDrawArea(canvas) {
        this.m_areaHeight = canvas.getHeight() - this.m_scrollHeight;
        this.m_areaWidth = canvas.getWidth();
        //リサイズ情報から領域再割当て
        let total_size = 0;
        for (let i = 0; i < this.m_areaNum; i++) {
            let sz = 0; 
            if(0 < this.m_areaRatio[i]){
                sz = this.getSplitAreaSize(this.m_areaRatio[i]);
            }
            this.m_splitSize[i] = sz;
            total_size += sz;
        }
        //余り領域を全てメインへ配分
        this.m_splitSize[this.m_mainChartIndex] += (this.m_areaHeight - total_size);
        //描画縦領域割当値セット
        this.setDrawAreaSize();
    }
    //==============================================================================
    //	個別描画領域サイズ更新
    // (個別のm_splitSizeが確定しているため、当該サイズに応じて実際のRECT情報に配分する)
    //==============================================================================
    setDrawAreaSize() {
        //描画縦領域割当値セット(座標は０から始まるので最下位置は高さ-1となる)
        let nextBgnY = 0;
        for (let i = 0; i < this.m_areaNum; i++) {
            this.setAreaRect(i, nextBgnY, 0, this.getAreaWidth(), nextBgnY + this.m_splitSize[i] - 1);
            nextBgnY = this.m_areaRect[i].bottom + 1;
        }
    }
    //==============================================================================
    //	描画領域割合再算出
    //==============================================================================
    splitResize() {
        //現在のサイズ比率更新
        let totalRatio = 0;
        for (let i = 0; i < this.m_areaNum; i++) {
            let height = this.m_areaRect[i].bottom - this.m_areaRect[i].top;
            this.m_areaRatio[i] = 0;
            if (0 < height) {
                this.m_areaRatio[i] = this.getSplitAreaRatio(height);
            }
            if (this.m_areaRatio[i] < 1) {
                this.m_areaRatio[i] = 1; //最低比率
            }
            totalRatio += this.m_areaRatio[i];
        }
        //100%を超過した場合(スプリッタサイズ分があるから基本有りえない?)
        let adjustRatio = totalRatio - 100;
        if(0 < adjustRatio){
            for (let i = 0; i < this.m_areaNum; i++) {
                //調整した分を大きい値から差引き
                if(adjustRatio < this.m_areaRatio[i]){
                    this.m_areaRatio[i] -= adjustRatio;
                    break;
                }
            }
        }else if (adjustRatio < 0) {
            let gap = Math.abs(adjustRatio);
            this.m_areaRatio[this.m_mainChartIndex] -= gap;
        }

        //スプリッタ更新による変更後サイズ退避
        // for (let i = 0; i < this.m_areaNum; i++) {
        //     let drawinf = ctlChartIf[i].getChartDrawBaseInfo();
        //     this.m_splitSize[i] = drawinf.getAreaBottom() - drawinf.getAreaTop();
        // }
    }
    //==============================================================================
    //	エリア交換
    //==============================================================================
    swapArea(srcIndex, dstIndex) {
        if (this.m_areaNum <= 1 || srcIndex < 0  || this.m_areaNum <= srcIndex) {
            return;
        }
        if (dstIndex < 0  || this.m_areaNum <= dstIndex) {
            return;
        }
        let areaRect = this.m_areaRect[srcIndex];
        this.m_areaRect[srcIndex] = this.m_areaRect[dstIndex];
        this.m_areaRect[dstIndex] = areaRect;
    }
    //==============================================================================
    //	エリア追加
    //==============================================================================
    addArea() {
        //描画可能数判定
        if(MAX_MAIN_SPLIT <= this.m_areaNum){
            return false;
        }
        //描画エリア管理数更新
        this.m_areaNum++;
        //描画チャート取得
        let ix = this.m_areaNum - 1;

        //描画エリア領域比率更新
        this.m_areaRatio[ix] = 0;
        let init_rate = 10;
        while (this.m_areaRatio[ix] < init_rate) {
            for (let i = 0; i< this.m_areaNum; i++) {
                if (10 < this.m_areaRatio[i]) {
                    this.m_areaRatio[i]--;
                    this.m_areaRatio[ix]++;
                }
            }
        }
        
        return true;
    }
    //==============================================================================
    //	エリア削除
    //==============================================================================
    deleteArea(ix) {
        //描画エリア管理数更新
        this.m_areaNum--;
        //削除エリア分領域サイズ取得
        let target_size = this.m_splitSize[ix];
        let deliv_size = (target_size / this.m_areaNum) >> 0;
        let surplus_size = (target_size - (deliv_size * this.m_areaNum)) >> 0;

        //描画エリア領域サイズ配分
        for (let i = 0; i < this.m_areaNum; i++) {
            this.m_splitSize[i] += deliv_size;
        }
        this.m_splitSize[this.m_mainChartIndex] += surplus_size;
        //描画縦領域割当値セット
        this.setDrawAreaSize();
        //描画領域割合再算出
        this.splitResize();
    }
    //==============================================================================
    //	SPLITTER DRAW
    //==============================================================================
    draw(canvas) {
        if (this.m_areaNum === 0) return;
        for(let i = 0; i < this.m_areaNum - 1; i++){
            this.m_splitter[i].draw(canvas);
        }
    }
    //==============================================================================
    //	UI EVENT [MOUSE LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        for(let i = 0; i < this.m_areaNum - 1; i++){
            if(this.m_splitter[i].uiEvtMouseLeftPerformed(x, y)){
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE ON PUSHED]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        for(let i = 0; i < this.m_areaNum - 1; i++){
            if(this.m_splitter[i].uiEvtMouseMovePerformed(x, y)){
                this.splitResize();
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE BUTTON UP]
    //==============================================================================
    uiEvtMouseUpPerformed() {
        for(let i = 0; i < this.m_areaNum - 1; i++){
            if(this.m_splitter[i].uiEvtMouseUpPerformed()){
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE OUT]
    //==============================================================================
    uiEvtMouseOutPerformed() {
        for(let i = 0; i < this.m_areaNum - 1; i++){
            this.m_splitter[i].uiEvtMouseOutPerformed();
        }
    }
}

export default ChartAreaCtrl;
