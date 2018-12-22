class ChartBaseInfo {
	constructor() {
        this.m_curdata = 0;
        this.m_histdata = 0;
        this.m_tickdata = 0;
        this.m_beginIndex = -1;         // 描画開始エントリ（メインスクロール連動）
        this.m_lastIndex = 0;           // 描画最終エントリ
        this.m_curIndex = 0;            // 描画選択中エントリ
        this.m_crossPos_x = 0;          // カレントクロスライン描画位置
        this.m_mousePos_x = 0;          // マウスポインタ(x)
        this.m_mousePos_y = 0;          // マウスポインタ(y)
        this.m_candleWidth = 5;         // チャート1エントリ幅
        this.m_candleMargin = 3;        // チャートエントリ間余白幅
        this.m_candleEdgeDraw = true;   // チャート枠描画可否
        this.m_dummyMargin = 0;         // チャートエントリ描画開始マージン
        this.m_fwdEntryNum = 0;         // 一目先行足エントリ数
        this.m_chartAreaWidth = 0;      // ローソク描画エリア幅
        this.m_singlFlag = false;       // シングルチャートの場合TRUE
        this.m_singleEntrySize = 0;     // シングルチャートエントリ数
        this.m_areaNum = 0;             // 展開エリア数
        this.m_cmdStat = new Array();
        this.m_scrollEnabled = false;
        this.m_crossLineEnabled = false;
        this.m_scaleLeft = true;        // スケール目盛左表示
        this.m_scaleRight = true;       // スケール目盛右表示
        // チャート形状
        this.m_chartType = 0;
        this.m_chartStyle = 0;
        // テクニカルツール
        this.m_currentTechTool = -1;
        // 表示オプション
        this.m_revPointEnabled = false;
        this.m_priceVolEnabled = false;
        this.m_fiboZrbEnabled = false;
        this.m_fiboClsEnabled = false;
        this.m_fiboRevEnabled = false;
        this.m_ichiTimeEnabled = false;
        // 可変のために追加した分
        this.m_var_mode = false;	    // 可変モード
        this.m_var_bgnIndex = -1;	    // 可変モード描画開始エントリ
        this.m_var_endIndex = -1;	    // 可変モード描画終了エントリ
        this.m_dispAutoUpdate = true;   // 自動更新ON/OFF
    }
    init () {
        this.m_mousePos_x = 0;
        this.m_mousePos_y = 0;

        for (var i = 0; i < this.m_cmdStat.length; i++) {
            this.m_cmdStat[i] = false;
        }
    }
    getCurrentHist() { return this.m_curdata; }
    getCurHistSize() {
        if (this.m_curdata != 0) {
            return this.m_curdata.getEntrySize();
        }
        return 0;
    }
    setCurHist = () => { this.m_curdata = this.m_histdata; }
    setCurTick = () => { this.m_curdata = this.m_tickdata; }

    setHistList (hist) { this.m_histdata = hist; }
    setTickList (hist) { this.m_tickdata = hist; }
    
    setChartStyle = style => { this.m_chartStyle = style; }
    getChartStyle() { return this.m_chartStyle; }

    setChartType = type => { this.m_chartType = type; }
    getChartType() { return this.m_chartType; }

    setSingleChart = b => { this.m_singlFlag = b; }
    isSingleChart  = () => { return this.m_singlFlag; }

    setSingleEntrySize = i => { this.m_singleEntrySize = i; }
    getSingleEntrySize = () => { return this.m_singleEntrySize; }

    setScaleLeft = val => { this.m_scaleLeft = val; }
    isScaleLeft = () => { return this.m_scaleLeft; }
    setScaleRight = val => { this.m_scaleRight = val; }
    isScaleRight = () => { return this.m_scaleRight; }

    getBeginIndex = () => { return this.m_beginIndex; }
    setBeginIndex = i => { this.m_beginIndex = i; }
    getLastIndex = () => { return this.m_lastIndex; }
    setLastIndex = i => { this.m_lastIndex = i; }
    getCurIndex = () => { return this.m_curIndex; }
    setCurIndex = i => { this.m_curIndex = i; }

    getChartAreaWidth = () => { return this.m_chartAreaWidth; }
    setChartAreaWidth(i) { this.m_chartAreaWidth = i; }

    getDummyEntryWidth = () => { return this.m_dummyMargin; }
    setDummyEntryWidth (i) { this.m_dummyMargin = i; }

    getFwdEntryNum = () => { return this.m_fwdEntryNum; }
    setFwdEntryNum (i) { this.m_fwdEntryNum = i; }

    getCrossPosX = () => { return this.m_crossPos_x; }
    setCrossPosX = i => { this.m_crossPos_x = i; }

    getMousePosX = () => { return this.m_mousePos_x; }
    setMousePosX = i => { this.m_mousePos_x = i; }

    getMousePosY = () => { return this.m_mousePos_y; }
    setMousePosY = i => { this.m_mousePos_y = i; }

    getDispMode = () => { return 0; } // チャート表示モード(0:標準 1:対数 2:反転)

    isVariableMode = () => { return this.m_var_mode; }
	setVariableMode(mode) { 
		this.m_var_mode = mode;
		if(!mode){
			this.m_var_bgnIndex= -1;
			this.m_var_endIndex= -1;
		}
	}
	getVariableBgnIndex = () => { return this.m_var_bgnIndex; }
	setVariableBgnIndex(i){ this.m_var_bgnIndex = i; }
	getVariableEndIndex = () => { return this.m_var_endIndex; }
	setVariableEndIndex(i){ this.m_var_endIndex = i; }
	getVariableEntryNum(){
		if(this.m_var_bgnIndex < 0){
			this.m_var_bgnIndex = 0; //左部スクロール位置調整
		}
		let result = this.m_var_endIndex - this.m_var_bgnIndex;
		if(result < 1){
			result = 200;
		}
		return result;
    }
    
    // 自動更新ONOFF
    getDispAutoUpdate = () => { return this.m_dispAutoUpdate; }
    setDispAutoUpdate(val) { this.m_dispAutoUpdate = val; }

    // 展開エリア数
    getAreaNum = () => { return this.m_areaNum; }
    setAreaNum(i) { this.m_areaNum = i; }

    // 1エントリ幅
    setCandleWidth = w => { this.m_candleWidth = w; }
    getCandleWidth = () => { return this.m_candleWidth; }
    // エントリ間余白幅
    setCandleMarginWidth = w => { this.m_candleMargin = w; }
    getCandleMarginWidth = () => { return this.m_candleMargin; }
    // 1エントリ幅 + 1エントリ余白幅
    getEntryWidth = () => { return this.m_candleWidth + this.m_candleMargin; }
    // ローソク白枠描画可否
    setCandleEdgeDraw = b => { this.m_candleEdgeDraw = b; }
    getCandleEdgeDraw = () => { return this.m_candleEdgeDraw; }
    // エントリ幅設定レベル
    setCandleWidthLevel = w => { this.m_candleWidthLevel = w; }
    getCandleWidthLevel = () => { return this.m_candleWidthLevel; }
    // チャート形状
    setChartStyle = type => { this.m_chartStyle = type; }
    getChartStyle = () => { return this.m_chartStyle; }
    // スクロールバー描画可否
    setScrollEnabled = boolVal => { this.m_scrollEnabled = boolVal; }
    isScroll = () => { return this.m_scrollEnabled; }
    // 十字線描画可否
    setCrossLineEnabled = boolVal => { this.m_crossLineEnabled = boolVal; }
    isCrossLine = () => { return this.m_crossLineEnabled; }
    // テクニカルツール描画中判定
    isTechToolOn() { return (this.m_currentTechTool !== -1) ? true : false; }
    setTechTool = techtool => { this.m_currentTechTool = techtool; }
    isTechTool = () => { return this.m_currentTechTool; }
    // 転換点表示可否
    setRevPoint = boolVal => { this.m_revPointEnabled = boolVal; }
    isRevPoint = () => { return this.m_revPointEnabled; }
    // 価格帯別出来高
    setPriceVol = boolVal => { this.m_priceVolEnabled = boolVal; }
    isPriceVol = () => { return this.m_priceVolEnabled; }
    // フィボナッチ(ザラバ)
    setFiboZrb = boolVal => { this.m_fiboZrbEnabled = boolVal; }
    isFiboZrb = () => { return this.m_fiboZrbEnabled; }
    // フィボナッチ(終値)
    setFiboCls = boolVal => { this.m_fiboClsEnabled = boolVal; }
    isFiboCls = () => { return this.m_fiboClsEnabled; }
    // フィボナッチ(基調転換)
    setFiboRev = boolVal => { this.m_fiboRevEnabled = boolVal; }
    isFiboRev = () => { return this.m_fiboRevEnabled; }
    // 一目均衡表(時間論・基本数値)
    setIchiTime = boolVal => { this.m_ichiTimeEnabled = boolVal; }
    isIchiTime = () => { return this.m_ichiTimeEnabled; }

}

export default ChartBaseInfo;
