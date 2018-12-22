import ChartCommon from './chartCommon';
import ChartSlider from './chartSlider';
import ChartColorPicker from './chartColorPicker';
import ChartButton from './chartButton';
import {ChartColorParamLabel} from './chartColorPicker';
import {ChartTechBRK, ChartTechKAGI, ChartTechPF,　ChartTechCWC} from './chartTechIndex';
import * as CD from './chartDef';
import * as TS from './chartTechIndex';

const BK_LINE_LAST= 255;
const BK_LINE_MAX = 256;
const MIN_PARAM_VALUE = 1;
const MAX_PARAM_VALUE = 100;

class ChartSinglePanel {
	constructor(chartCanvas, info, techParam, drawParam, chartType, pramNum) {
        this.m_cc = chartCanvas;
        this.m_common = new ChartCommon(chartCanvas);
        this.m_drawInf = this.m_common.m_drawInf;
        this.m_info = this.m_common.m_info = info;
        this.m_techParam = this.m_common.m_techParam = techParam;
        this.m_drawParam = this.m_common.m_drawParam = drawParam;
        this.m_techIndex = null;
        this.m_techParamVal = null;
        this.m_chartType = chartType;
        this.m_dispInfo = {};
        this.m_dispInfo.dispMaxPrice = 0.0; // 表示最大値段
        this.m_dispInfo.dispMinPrice = 0.0; // 表示最小値段
        this.m_dispInfo.dispMaxVol = 0;	    // 表示最大出来高
        this.m_dispInfo.dispMinVol = 0;	    // 表示最小出来高
        this.m_dispStartIndex = 0;			// 表示開始エントリ（表示エリア変更判定用）
        this.m_dispEntryCount = 0;			// 表示エントリ件数（表示エリア変更判定用）
        this.m_totalMaxEntry = 0;			// 合計最大エントリ
        this.m_dispLastIndex = 0;		    // 表示中最終エントリインデックス
        this.m_drawAreaSizeX = 0;			// 描画領域(リサイズ判定用)
        this.m_dispEntryCnt = 0;			// 描画エントリ数変更判定用
        this.m_entryWidth = 0;				// エントリサイズ(サイズ変更判定用)
        this.m_indexPanel = null;           // 指標パネル
        this.m_mosPushStat = 0;             // マウス左ボタン押下状態判定			
        this.m_mosPushPrvX = 0;             // マウス左ボタン押下直近状態退避(X)(スライド用)

        this.m_indexName = '';
        this.m_indexNameAndType = '';
        this.m_paramName = [];
        this.m_slider = [];
        this.m_colorLabel = [];
        this.m_btnModColor = [];
        if(0 < pramNum){
            this.m_paramName = new Array(pramNum);
            this.m_slider = new Array(pramNum);
            this.m_colorLabel = new Array(pramNum);
            this.m_btnModColor = new Array(pramNum);
        }
        for(let i = 0; i < pramNum; ++i){
            this.m_paramName[i] = 'NOSET';
            this.m_slider[i] = new ChartSlider();
            this.m_colorLabel[i] = new ChartColorParamLabel(this.m_common.m_cc);
            this.m_btnModColor[i] = new ChartButton();
            this.m_btnModColor[i].init("選択");
        }
        this.m_selectColorPickerIndex = 0;
    }
    getChartType = () => { return this.m_chartType; }
    setIndexPanel= (panel) => { this.m_indexPanel = panel; }
    setPanel(ttl, clr, val) {
        this.m_indexPanel.m_indexName.push(ttl);
        this.m_indexPanel.m_indexColor.push(clr);
        this.m_indexPanel.m_indexValue.push(val);
    }
    getDataType() {
        const hist = this.m_info.getCurrentHist();
        return hist.getDataType();
    }
    getTittle() {}
    setColorPickerCurrnt() {
        if (this.m_colorLabel[this.m_selectColorPickerIndex] !== null) {
            let [r, g, b] = this.m_colorLabel[this.m_selectColorPickerIndex].getRGBArray();
            this.m_common.m_colorPicker.setCurrentColor(r, g, b);
        }
        return true;
    }
    // 更新はせず表示上のみ初期値リセット
    resetDefaultParam() {
        this.resetSlider();
        this.resetIndexColor();
    }
    resetIndexParam() {
        for(let i = 0; i < this.m_slider.length; ++i){
            if (this.m_slider[i] !== null) {
                this.m_slider[i].reset();
            }
        }
    }
    updateColorParam() {
        if (this.m_colorLabel[this.m_selectColorPickerIndex] !== null) {
            const rgb = this.m_common.m_colorPicker.getSelectRGBValue();
            this.m_colorLabel[this.m_selectColorPickerIndex].setRGB(rgb);
        }
    }
    initData() {
        this.resetIndexData();

        // 描画区間リセット(最右部へ移動)
        if (this.m_info.isVariableMode()) {
            const dataSize = this.getEntrySize();
            const varDrawNum = this.m_info.getVariableEntryNum();
            if(varDrawNum <= dataSize){
                this.m_info.setVariableBgnIndex(dataSize - varDrawNum);
                this.m_info.setVariableEndIndex(dataSize - 1);
            }else{
                this.m_info.setVariableBgnIndex(0);
                this.m_info.setVariableEndIndex(dataSize - 1);
            }

        }else{
            const dataSize = this.getEntrySize();
            const fixDrawNum = this.m_info.m_lastIndex - this.m_info.m_beginIndex;
            if(0 < fixDrawNum){
                if(fixDrawNum <= dataSize){
                    this.m_info.setBeginIndex(dataSize - fixDrawNum);
                    this.m_info.setLastIndex(dataSize - 1);
                }else{
                    this.m_info.setBeginIndex(0);
                    this.m_info.setLastIndex(dataSize - 1);
                }
            }else{
                this.m_info.setBeginIndex(-1);
                this.m_info.setLastIndex(-1);
            }
        }   

        return;
    }
    //==============================================================================
    //	[描画]メイン(枠外領域クリア)
    //==============================================================================
    drawAfter(isShowHeader) {
        //枠外領域クリア&スケール描画(横)
        this.m_common.drawOutOfChartArea(isShowHeader);

        this.drawBackScaleString(this.m_common.m_backLineEntry, this.m_common.m_backLineXpos);

        // // カレントマウス位置取得
        const x = 0, y = 1;
        const mouse_pos = this.m_common.getMousePos();

        // 十字線描画
        const dummy_entry_width = this.m_info.getDummyEntryWidth();
        let curIndex = this.drawClossLine(mouse_pos[x], mouse_pos[y], dummy_entry_width, this.m_totalMaxEntry);

        // 設定ボタン表示
        const chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        const chartBgnPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let btnWidth = 26;
        let btnHeight = 15;
        let btnBgnPosY = chartBgnPosY + 2;
        let btnBgnPosX = chartBgnPosX + 1;
        this.m_common.drawSettingButton(btnBgnPosX, btnBgnPosY, btnWidth, btnHeight);

        // タイトル表示
        let tittle = this.getTittle();
        let [ttl_x, ttl_y, h] = [btnBgnPosX + btnWidth + 3, btnBgnPosY, 15];
        //this.m_cc.drawBlend("rgb(20 ,20 ,20)", 0.5, ttl_x, ttl_y, ttl_w, h);
        this.m_cc.drawStringL(tittle, ttl_x, ttl_y, "white");
    }
    //==============================================================================
    //	[描画]メイン
    //==============================================================================
    draw(rc) {
        const area_width = rc.right - rc.left;
        const area_height = rc.bottom - rc.top;

        // 初期塗り潰し
        this.m_cc.drawBackground(rc.left, rc.top, area_width, area_height);

        // 更新有無判定
        // if(m_pInfo->GetHistUpdated()){
        //     // 更新有(再計算)
        //     ResetIndexData(m_ctrlType);
        // }

        // エントリサイズ取得
        const szHistList = this.getEntrySize();
        this.m_info.setSingleEntrySize(szHistList);

        // スケール用マージン調整
        this.m_common.settLeftRighAreaMargin();

        //表示モード判定フラグセット
        //全体表示モード
        let all_disp_mode = false;
        //可変表示モード
        let var_disp_mode = this.m_info.isVariableMode();
        //可変モード描画値
        let var_bgn_ix = this.m_info.getVariableBgnIndex();
        let var_end_ix = this.m_info.getVariableEndIndex();
        if(var_bgn_ix < 0 || var_end_ix < 0){
            var_disp_mode = false;
        }
	    // 通常表示モード
	    let nml_mode = false;
        if(!all_disp_mode && !var_disp_mode) nml_mode = true;

        // オリジナルにない(イベントで制御しているため)
        this.m_drawInf.setAreaTop(rc.top);
        this.m_drawInf.setAreaHeight(area_height);

        //通常表示モード
        // bool nml_mode = false;
        // if((!all_disp_mode) && (!var_disp_mode)) nml_mode = true;
        // //固定エリア表示位置(右/左)セット
        // m_drawInf.SetFixedAreaSide(m_pInfo->IsFixAreaSideRight());
        // //固定エリアDRAW判定フラグセット
        // m_drawInf.SetFixedAreaDraw(m_pInfo->IsHideFixArea());
        // //固定エリア右部表示判定
        // if((m_pInfo->IsFixAreaSideRight()) && (!m_pInfo->IsHideFixArea())){
        //     //左目盛表示時
        //     m_drawInf.SetChartAreaMarginLeft(CHART_AREA_MARGIN_LEFT);
        // }else{
        //     m_drawInf.SetChartAreaMarginLeft(10);
        // }
        // //タイトル表示描画
        // //CDP::DrawChartTitle(qpt, rc, m_drawInf.GetFixedLeftWidth(), m_chartHeaderName);

        //Y軸領域終了点余白幅
        const chart_margin = 20;	// 上下余白サイズ
        this.m_drawInf.setChartAreaInnerMargin(chart_margin);
        this.m_drawInf.setChartAreaMarginBtm(50);
        this.m_drawInf.setChartAreaMarginTop(8 + chart_margin);

        let pHist = this.m_info.getCurrentHist();

        //描画値段オブジェクト倍数セット
        this.m_drawInf.setScaleValueDec(pHist.mDecimalScale);
        //描画値段小数点有効桁数セット
        this.m_drawInf.setValidDegits(pHist.mValiｄDegits);

        //エントリ存在確認
        if(szHistList == 0){
            // FIXED PANE DRAW
            // if (!m_pInfo -> IsHideFixArea()) {
            //     QRect fixed_rc(m_drawInf.GetFixedAreaBgnPosX(), m_drawInf.GetAreaTop(), 0, 0);
            //     fixed_rc.setRight(m_drawInf.GetFixedAreaEndPosX() - 1);
            //     fixed_rc.setBottom(m_drawInf.GetAreaBottom());
            //     CDP:: DrawGradient(qpt, fixed_rc, QColor(65, 65, 65), QColor(10, 10, 10));
            //     DrawFixedPain(qpt, fixed_rc);
            // }
            return;
        }

        // 全体表示モード処理
        let var_size = 0;
        // if(all_disp_mode){
        //     //横軸スケール値設定
        //     m_drawInf.SetScaleValueLeft(1);
        //     m_drawInf.SetScaleValueRight(szHistList);
        //     //エントリ描画サイズ設定(FOR SCROLL)
        //     SetEntryDrawWidth(GetEntryDrawWidthForAllDisp(szHistList));
        // }else 
        if (var_disp_mode) {
            // 横軸スケール値設定
            var_size = var_end_ix - var_bgn_ix + 1;
            this.m_drawInf.setScaleValueLeft(1);
            this.m_drawInf.setScaleValueRight(var_size);
            // エントリ描画サイズ設定(FOR SCROLL)
            this.m_common.setEntryDrawWidth(this.m_common.getEntryDrawWidthForAllDisp(var_size));
        }

        // エントリ描画サイズ取得
        this.m_common.copyEntryDrawWidth();

        // リサイズ判定(リサイズ/固定エリア/エントリサイズ変更)
        let resize = false;
        const entrySize = this.m_drawInf.getEntryWidth();
        if (this.m_drawAreaSizeX != area_width || this.m_entryWidth != entrySize) {
            resize = true;
            this.m_drawAreaSizeX = area_width;
            this.m_entryWidth = entrySize;
        }
        let entry_width = this.m_drawInf.getEntryWidth();
        let candle_width = this.m_drawInf.getCandleWidth();

        // 描画エリアサイズ退避(幅)
        this.m_drawInf.setAreaWidth(area_width);

        // エリア内横幅調整
        this.m_drawInf.setChartAreaWidth();
        this.m_info.setChartAreaWidth(this.m_drawInf.getChartAreaWidth());
        // エントリ描画サイズ設定
        //if (all_disp_mode) {
            //this.m_common.setEntryDrawWidth(this.m_common,GetEntryDrawWidthForAllDisp(szHistList + fwdEntryNum));
        //} else
        if (var_disp_mode) {
            this.m_common.setEntryDrawWidth(this.m_common.getEntryDrawWidthForAllDisp(var_size));
        }

        //描画可能件数
        let dispEntryCnt = 0;
        if (all_disp_mode) {
        } else if(var_disp_mode) {
            dispEntryCnt = var_size;
            this.m_dispEntryCount = dispEntryCnt;
            this.m_dispStartIndex = 0;
        } else {
            dispEntryCnt = this.m_drawInf.getCanDrawCount() >> 0;
            if (this.m_dispEntryCount != dispEntryCnt) {
                resize = true;
                this.m_dispEntryCount = dispEntryCnt;
            }
        }

        //描画開始インデックス取得
        let bgnIndex = 0;
        let dummy_entry_width = 0;
        let mos_posx = this.m_info.getMousePosX();
        let mos_posy = this.m_info.getMousePosY();
        if (var_disp_mode) {
            bgnIndex = var_bgn_ix;
            if (var_bgn_ix < 0) { var_bgn_ix = 0; }
            if (this.m_mosPushPrvX !== mos_posx && 
                this.m_mosPushStat && 
                0 < this.m_mosPushPrvX &&
                this.m_drawInf.isInnerChartAreaX(mos_posx) &&
                rc.top < mos_posy &&
                mos_posy < rc.bottom - this.m_drawInf.m_areaMarginBottom &&
                !this.m_info.isTechToolOn())
            {
                //マウス押下状態／直近マウス位置セット済／描画件数以上にエントリあり／ツール類全て無効状態
                let chartAreaWidth = this.m_drawInf.getChartAreaWidth();
                if (mos_posx < this.m_mosPushPrvX) {
                    //左スライド(TO←FROM)
                    //移動距離→エントリ数
                    let entryWidth = chartAreaWidth / dispEntryCnt;
                    let move_range = 0;
                    if (0.0 < entryWidth) {
                        move_range = ((this.m_mosPushPrvX - mos_posx) / entryWidth) >> 0;
                    }
                    if (move_range <= 0) move_range = 1;

                    //エントリ算出
                    let wk_endIndex = var_end_ix + move_range;
                    //最大要素チェック
                    let max_idx = szHistList;
                    if (max_idx <= wk_endIndex) {
                        wk_endIndex = max_idx - 1;
                    }
                    let wk_bgnIndex = wk_endIndex - (dispEntryCnt - 1);

                    //開始位置更新
                    bgnIndex = wk_bgnIndex;
                    this.m_info.setVariableBgnIndex(wk_bgnIndex);
                    this.m_info.setVariableEndIndex(wk_endIndex);
                    var_bgn_ix = wk_bgnIndex;
                    var_end_ix = wk_endIndex;
                } else if (this.m_mosPushPrvX < mos_posx) {
                    //右スライド
                    //移動距離→エントリ数
                    let entryWidth = chartAreaWidth / dispEntryCnt;
                    let move_range = 0;
                    if (0.0 < entryWidth) {
                        move_range = ((mos_posx - this.m_mosPushPrvX) / entryWidth) >> 0;
                    }
                    if (move_range <= 0) move_range = 1;
                    //エントリ算出(FROM→TO)
                    let wk_bgnIndex = var_bgn_ix - move_range;
                    //最小要素チェック
                    if (wk_bgnIndex < 0) {
                        wk_bgnIndex = 0;
                    }
                    let wk_endIndex = wk_bgnIndex + (dispEntryCnt - 1);
                    //開始位置更新
                    bgnIndex = wk_bgnIndex;
                    this.m_info.setVariableBgnIndex(wk_bgnIndex);
                    this.m_info.setVariableEndIndex(wk_endIndex);
                    var_bgn_ix = wk_bgnIndex;
                    var_end_ix = wk_endIndex;
                }
                //直近押下位置退避(X)
                this.m_mosPushPrvX = mos_posx;
            }
        } else if (szHistList <= dispEntryCnt) {
            //描画エントリ数 < 描画可能件数
            dummy_entry_width = entrySize * Math.abs(dispEntryCnt - szHistList);
            bgnIndex = 0;
        } else if ((this.m_mosPushPrvX != mos_posx) && (this.m_mosPushStat) && (0 < this.m_mosPushPrvX) &&
        (this.m_drawInf.isInnerChartAreaX(mos_posx)) &&
        (rc.top < mos_posy) && (mos_posy < rc.bottom - this.m_drawInf.m_areaMarginBottom) &&
        !this.m_info.isTechToolOn()
        ) {
            //マウス押下状態／直近マウス位置セット済／描画件数以上にエントリあり／ツール類全て無効状態
            //ノーマル状態でマウスプッシュ中
            if (mos_posx < this.m_mosPushPrvX) {
                //左スライド
                //移動距離→エントリ数
                let move_range = ((this.m_mosPushPrvX - mos_posx) / entrySize) >> 0;
                if (move_range <= 0) move_range = 1;
                //if (2 < move_range) move_range = 2;
                //エントリ算出
                let wk_bgnIndex = this.m_info.getBeginIndex() + move_range;
                //最大要素チェック
                let max_bgnidx = szHistList - dispEntryCnt;
                if (max_bgnidx < wk_bgnIndex) wk_bgnIndex = max_bgnidx;
                //開始位置更新
                bgnIndex = wk_bgnIndex;
                if (bgnIndex === max_bgnidx) {
                    this.m_mosPushStat = false;
                    this.m_mosPushPrvX = 0;
                }
            } else if (this.m_mosPushPrvX < mos_posx) {
                // 右スライド
                // 移動距離→エントリ数
                let move_range = ((mos_posx - this.m_mosPushPrvX) / entrySize) >> 0;
                if (move_range <= 0) move_range = 1;
                //if (2 < move_range) move_range = 2;
                // エントリ算出
                let wk_bgnIndex = this.m_info.getBeginIndex() - move_range;
                // 最小要素チェック
                if (wk_bgnIndex < 0) wk_bgnIndex = 0;
                // 開始位置更新
                bgnIndex = wk_bgnIndex;
                if (bgnIndex === 0) {
                    this.m_mosPushStat = false;
                    this.m_mosPushPrvX = 0;
                }
            } else {
                bgnIndex = this.m_info.getBeginIndex();
            }
            // 直近押下位置退避(X)
            this.m_mosPushPrvX = mos_posx;
        } else if (-1 === this.m_info.getBeginIndex()) {
            // 初期化後の初回開始時
            bgnIndex = szHistList - dispEntryCnt;
        } else if (resize && this.m_dispLastIndex != 0) {
            // 現在表示中の最終エントリから逆算して開始位置を算出
            bgnIndex = this.m_dispLastIndex - dispEntryCnt + 1;
        } else if (szHistList <= this.m_dispLastIndex) {
            bgnIndex = szHistList - dispEntryCnt;
        } else {
            // スクロール開始位置を反映
            bgnIndex = this.m_info.getBeginIndex();
            if(szHistList - bgnIndex <= dispEntryCnt){
                // スクロール位置からのエントリが可能件数より少ない場合は初期表示
                bgnIndex = szHistList - dispEntryCnt;
            }
        }
        if (bgnIndex < 0) bgnIndex = 0;
        bgnIndex = bgnIndex >> 0;
        // 描画開始インデックス更新
        this.m_info.setBeginIndex(bgnIndex);
        // 描画送り幅更新
        this.m_info.setDummyEntryWidth(dummy_entry_width);
        // //今回の固定エリア表示状態退避
        // m_dispFixedArea = m_pInfo->IsHideFixArea();
        // 描画ループ終了判定値セット
        let max_entry = szHistList;
        if(var_disp_mode){
             max_entry = var_end_ix + 2;
        }
        //表示最大値・最小値取得
        this.m_dispStartIndex = bgnIndex;
        this.m_dispEntryCount = dispEntryCnt;
        [this.m_dispInfo.dispMaxPrice, this.m_dispInfo.dispMinPrice] = this.getRange(bgnIndex, dispEntryCnt);

        // 縦軸スケール値（調整前取得）
        let height = this.m_drawInf.getChartAreaHeightNotAdjust();
        // 横軸スケール値設定
        this.m_common.setScaleRangeValue(
            this.m_dispInfo.dispMaxPrice >> 0,
            this.m_dispInfo.dispMinPrice >> 0,
            false,
            CD.CHART_VERTICAL,
            pHist.mDecimalScale
        );
        // エリア内縦幅調整(余りを切捨て調整)
        const scaleHeight = this.m_drawInf.getScaleRangeNum();
        height = Math.floor(height / scaleHeight) * scaleHeight;
        // エリア高さ調整確定値セット
        this.m_drawInf.setChartAreaHeight(height);
        // 縦軸描画開始位置取得
        this.m_drawInf.setChartAreaBgnPosY();
        // チャートY軸表示モード設定
        //var disp_mode = this.m_info.getDispMode();
        //this.m_drawInf.setDispMode(disp_mode);
        // スケール情報設定
        this.m_common.setDrawRangeHeight();
        //スケールライン描画
        //暫定戻り値(最下部ライン)
        this.m_common.drawRangeOfRate();
        // 開始位置
        let xpos = this.m_drawInf.getChartAreaBgnPosX() + dummy_entry_width;
        let isDrawBackLine = false;
        // char curDate[4] = {0, 0, 0, 0};
        let skipBackLineCnt = this.m_common.getScaleTerm();
        let skip_counter = skipBackLineCnt;
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();

        // 開始位置退避用
        let ix = 0;
        // カギ足(前回高さ退避用)
        let prev_yPos = 0;
        // カギ足(陰陽判別フラグ保持)
        let isWhite = false;
        // バックライン(縦)最終エントリ初期化
        this.m_common.m_bkLineEntryIndex = 0;
        // バックライン(縦)エントリ初期化
        this.m_common.m_backLineEntry[0] = -1;
        let prev_scale_xpos = 0;
        let prev_back_xpos = 0;
        let tick_ypos = 0;
        for(ix = bgnIndex; ix < max_entry; ix++){
            // BACKLINE 判定
            if(ix % 10 == 0){
                let back_xpos = xpos;
                if(!nml_mode && 0 <= this.m_info.getVariableBgnIndex()){
                    let wentry_width  = 0;
                    let wcandle_width = 0;
                    [back_xpos,  wentry_width, wcandle_width] = this.m_common.getVariableEntryWidth(ix, max_entry) 
                    back_xpos += (wentry_width / 2) >> 0;
                }else{
                    let entry_pos = (this.m_drawInf.getCandleWidth() / 2) >> 0;
                    back_xpos = dummy_entry_width + this.m_common.getEntryToPos(ix) + entry_pos;
                }
                let retVal = this.m_common.drawBackLine(back_xpos + 1, prev_scale_xpos);
                prev_scale_xpos = retVal[1];
                if (retVal[0]) {
                    // 描画情報退避(スケール文字列用)
                    if (this.m_common.m_bkLineEntryIndex < CD.BK_LINE_LAST) { //最大本数以内
                        this.m_common.m_backLineXpos[this.m_common.m_bkLineEntryIndex] = back_xpos;
                        this.m_common.m_backLineEntry[this.m_common.m_bkLineEntryIndex++] = ix;
                        this.m_common.m_backLineEntry[this.m_common.m_bkLineEntryIndex] = -1;
                    }
                }
            }
            // 表示エントリサイズ取得処理(可変)
            if(var_disp_mode){
                let ret_xpos;
                [ret_xpos, entry_width, candle_width] = this.m_common.getVariableEntryWidth(ix, max_entry);
            }

            // 描画チャート選択
            let new_xpos = 0;
            // チャート種別判定
            if(this.m_chartType === CD.CHART_MAIN_BREAK){
                // 新値足
                new_xpos = this.drawBRK(ix, xpos, entry_width, isDrawBackLine);
            }else if(this.m_chartType === CD.CHART_MAIN_KAGI){
                // カギ足
                [new_xpos, prev_yPos, isWhite] = this.drawKAGI(ix, xpos, entry_width, prev_yPos, isWhite);
            }else if(this.m_chartType === CD.CHART_MAIN_PF){
                // ポイント＆フィギュア
                new_xpos = this.drawPF(ix, xpos, entry_width, isDrawBackLine);
            }else if(this.m_chartType === CD.CHART_MAIN_TICK){
                // TICK
                new_xpos = xpos + entry_width;
                tick_ypos = this.drawTick("white", ix, xpos, tick_ypos, new_xpos);
            }

            if(!nml_mode){
                // 全体表示 OR 可変表示モード
                xpos = this.m_drawInf.cnvValueToPosX((ix+1)-bgnIndex);
            }
            // エントリ終了判定
            if(nml_mode){
                // 通常表示モード
                // 次回の足が描画出来なければ抜ける
                // TICK 以外
                if(chartEndPosX < xpos + candle_width){
                    break;
                }
            }
            xpos = new_xpos;
        }
        //描画開始インデックス更新
        if(szHistList <= ix){
            ix = szHistList-1;
        }
        this.m_info.setLastIndex(ix);
        this.m_dispLastIndex = ix;

        // 合計最大エントリ退避
        this.m_totalMaxEntry = max_entry;
    }
    //==============================================================================
    //	[描画] クロスライン
    //==============================================================================
    drawClossLine(mouse_pos_x, mouse_pos_y, dummy_entry_width, max_entry) {
        //TRACE("%s(%d)::%s\n",__FILE__, __LINE__, "DrawClossLine[STA]");
        let curIndex = 0;
        let decPoint = this.m_drawInf.getScaleValueDec();
        let degits = this.m_drawInf.getValidDegits();
        let chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        let chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        let chartBgnMgnPosY = this.m_drawInf.getChartAreaBgnPosYWithMgn();
        let chartEndMgnPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
        let pHist = this.m_info.getCurrentHist();
        let szHistList = this.getEntrySize();

        if (this.m_drawInf.isInnerChartArea(mouse_pos_x, mouse_pos_y)) {
            //カレントインデックス取得
            curIndex = this.m_common.getPosToEntry(mouse_pos_x - dummy_entry_width) >> 0;
            if(this.m_dispLastIndex < curIndex){
                curIndex = this.m_dispLastIndex;
            }
            //モード別エントリ取得処理
            let xpos = 0;
            if (this.m_info.isVariableMode() && 0 <= this.m_info.getVariableBgnIndex()) {
                let [ret_xpos, entry_width, candle_width] = this.m_common.getVariableEntryWidth(curIndex, max_entry);
                xpos = ret_xpos + ((candle_width / 2) >> 0);
            }else{
                const entry_pos = this.m_drawInf.getCandleWidth() / 2;
                xpos = dummy_entry_width + this.m_common.getEntryToPos(curIndex) + entry_pos;
                //空領域が存在する場合は最初のエントリで描画を止める
                if ((0 < dummy_entry_width && xpos <= dummy_entry_width) || curIndex < 0) {
                    curIndex = 0;
                    xpos = dummy_entry_width + this.m_common.getEntryToPos(curIndex) + entry_pos;
                }
            }
            if(chartEndPosX < xpos){
                //チャートエリアの最右部を超えた場合-1
                curIndex -= 1;
                if (curIndex < 0) {
                    return curIndex;
                }
            }

            xpos = xpos >> 0;
            if (this.m_info.isCrossLine()) {
                //十字線(横)
                this.m_cc.drawLine(this.m_cc.m_colCross, chartBgnPosX, mouse_pos_y, chartEndPosX, mouse_pos_y);
                //十字線(縦)
                this.m_cc.drawLine(this.m_cc.m_colCross, xpos, chartBgnMgnPosY, xpos, chartEndMgnPosY);
                this.m_info.setCrossPosX(xpos);
            }
            //カレントインデックス更新
            this.m_info.setCurIndex(curIndex);

            // スケール枠表示値段取得
            let price;
            let scale_price = this.m_drawInf.cnvPosYToValue(mouse_pos_y);
            price = this.m_common.withDecStr(scale_price, decPoint, degits);
            // スケール枠(値段)(左)描画
            //this.m_cc.drawGradFill(chartBgnPosX-70, mouse_pos_y-12, chartBgnPosX-2, mouse_pos_y+12);
            //this.m_cc.drawStringR( hdc, price, chartBgnPosX-20, mouse_pos_y-4, RGB(255, 128, 0) );
            // スケール枠(値段)(右)描画
            if (this.m_info.isCrossLine()) {
                this.m_cc.drawGradFill(chartEndPosX + 5, mouse_pos_y - 4, chartEndPosX + 60, mouse_pos_y + 8);
                //this.m_cc.drawScaleSelect(price, chartEndPosX + 15, mouse_pos_y - 6);
                this.m_cc.drawStringL(price, chartEndPosX + 15, mouse_pos_y - 6, "orange");
            }

            this.m_indexPanel.m_date = "";

            // スケール枠(日時)
            let left_edge = chartBgnPosX + 40; //日時スケール枠左限界位置
            let right_edge = chartEndPosX - 40; //日時スケール枠右限界位置
            let rg_y1 = chartEndMgnPosY + 1;
            let rg_y2 = chartEndMgnPosY + 14;
            let rg_x1 = 0;
            let rg_x2 = 0;
            if (left_edge <= xpos && xpos <= right_edge) {
                //描画エリアが充足している場合
                if (pHist.mDataType === CD.CHART_DATA_MIN) {
                    rg_x1 = xpos - 50;
                    rg_x2 = xpos + 50;
                }else{
                    rg_x1 = xpos - 30;
                    rg_x2 = xpos + 30;
                }
            } else if (xpos <= left_edge) {
                //描画エリアが不足している場合(左)
                rg_x1 = chartBgnPosX;
                rg_x2 = chartBgnPosX + 60;
            } else {
                //描画エリアが不足している場合(右)
                rg_x1 = chartEndPosX - 60;
                rg_x2 = chartEndPosX;
            }
            if (this.m_info.isCrossLine()) {
                this.m_cc.drawGradFill(rg_x1 - 2, rg_y1 + 3, rg_x2 + 2, rg_y2 + 3);
            }
            let str_xpos = rg_x1 + (((rg_x2 - rg_x1) / 2) >> 0);

            if (curIndex < szHistList) {
                const sdate = this.m_common.getDateStr(this.getScaleString(curIndex), pHist.mDataType);
                if (this.m_info.isCrossLine()) {
                    this.m_cc.drawStringC(sdate, str_xpos, rg_y1 + 1, "orange");
                }
                this.m_indexPanel.m_date = sdate;
                // if (pHist.mDataType === CD.CHART_DATA_MIN || pHist.mDataType === CD.CHART_MAIN_TICK) {
                //     if (this.m_info.isCrossLine()) {
                //         // 自動更新表示　どうするか
                //         //if (pt.mDataStatus != CD.INIT) {
                //         //    this.m_cc.drawStringC(pt.mTime, str_xpos, rg_y1 + 1, "orange");
                //         //}
                //     }
                //     //if (pt.mDataStatus === CD.INIT) {
                //     //    //当日足初期化状態(非表示とする)
                //     //    this.m_indexPanel.m_date = "";
                //     //} else {
                //         this.m_indexPanel.m_date = this.getScaleString(curIndex);
                //     //}
                // } else {
                //     const sdate = this.m_common.getDateStr(this.getScaleString(curIndex), pHist.mDataType);
                //     if (this.m_info.isCrossLine()) {
                //         this.m_cc.drawStringC(sdate, str_xpos, rg_y1 + 1, "orange");
                //     }
                //     this.m_indexPanel.m_date = sdate;
                // }
            }
        }

        this.setValueToIndexPanel(curIndex, "white");
        return curIndex;
    }
    //==============================================================================
    //	[描画] バックスケール文字列
    //==============================================================================
    drawBackScaleString(ix_arry, xpos_arry) {
        const hist = this.m_info.getCurrentHist();
        const data_type = hist.getDataType();
        const end_ypos = this.m_drawInf.getChartAreaEndPosYWithMgn();
        for (let i = 0; i < CD.BK_LINE_MAX; i++) {
            if(ix_arry[i] < 0){
                break;
            }
            if(i + 1 < CD.BK_LINE_MAX){
                if(ix_arry[i] + 1 === ix_arry[i+1]){
                    // 次が日中開始時の場合はSKIP
                    continue;
                }
            }
            let xpos = xpos_arry[i];
            let scaleValue = this.m_common.getDateStr(this.getScaleString(i));
            this.m_cc.drawStringC(scaleValue, xpos, end_ypos);	
        }
    }
    //==============================================================================
    //	[描画] パラメータ設定
    //==============================================================================
    drawParamSetting(rc) {
        this.m_common.drawParamSetting(rc,
            this.m_indexNameAndType,
            this.m_slider.length,
            this.m_slider,
            this.m_paramName,
            this.m_colorLabel,
            this.m_btnModColor
        );
    }
    //==============================================================================
    //	[描画] カラーピッカー設定
    //==============================================================================
    drawColorSetting(rc) {

        this.m_cc.drawStringL(this.m_paramName[this.m_selectColorPickerIndex], rc.left + 10, rc.top + 10, "rgb(190,190,190)");

        // カラーピッカー画面描画
        if(this.m_common.m_isDrawColorPicker){
            rc.top += 40;
            this.m_common.m_colorPicker.draw(rc);
            return;
        }
    }
    //==============================================================================
    //	設定ボタン押下イベント
    //==============================================================================
    checkSettingMouseUpPerformed(x, y) {
        return this.m_common.m_btnSetting.uiEvtMouseUpPerformed(x, y);
    }
    uiEvtMouseMovePerformedForSetting(x, y) {
        if(this.m_common.m_isDrawColorPicker){
            return this.m_common.m_colorPicker.uiEvtMouseMovePerformed(x, y);
        }
        for (let i = 0; i < this.m_slider.length; ++i){
            if(this.m_slider[i] !== null){
                if(this.m_slider[i].uiEvtMouseMovePerformed(x, y)){
                    return true;
                }
            }
            if(this.m_colorLabel[i] !== null){
                if(this.m_btnModColor[i].uiEvtMouseMovePerformed(x, y)){
                    return true;
                }
            }
        }
        return false;
    }
    uiEvtMouseLeftPerformedForSetting(x, y) {
        if(this.m_common.m_isDrawColorPicker){
            return this.m_common.m_colorPicker.uiEvtMouseLeftPerformed(x, y);
        }
        for (let i = 0; i < this.m_slider.length; ++i) {
            if(this.m_slider[i] !== null){
                if (this.m_slider[i].uiEvtMouseLeftPerformed(x, y)) {
                    return true;
                }
            }
            if(this.m_colorLabel[i] !== null){
                if (this.m_btnModColor[i].uiEvtMouseLeftPerformed(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
    uiEvtMouseUpPerformedForSetting(x, y) {
        if(this.m_common.m_isDrawColorPicker){
            return this.m_common.m_colorPicker.uiEvtMouseUpPerformed(x, y);
        }
        for (let i = 0; i < this.m_slider.length; ++i){
            if(this.m_slider[i] !== null){
                if(this.m_slider[i].uiEvtMouseUpPerformed(x, y)){
                    return true;
                }
            }
            if(this.m_colorLabel[i] !== null){
                if(this.m_btnModColor[i].uiEvtMouseUpPerformed(x, y)){
                    this.m_selectColorPickerIndex = i;
                    this.m_common.setColorPickerEnbled(true);
                    let [r, g, b] = this.m_colorLabel[i].getRGBArray();
                    this.m_common.m_colorPicker.setCurrentColor(r, g, b);
                    return true;
                }
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {

        if(this.m_common.m_isDrawColorPicker){
            return this.m_common.m_colorPicker.uiEvtMouseMovePerformed(x, y);
        }
        for (let i = 0; i < this.m_slider.length; ++i){
            if(this.m_slider[i] !== null){
                if(this.m_slider[i].uiEvtMouseMovePerformed(x, y)){
                    return true;
                }
            }
            if(this.m_colorLabel[i] !== null){
                if(this.m_btnModColor[i].uiEvtMouseMovePerformed(x, y)){
                    return true;
                }
            }
        }

        // 従来イベント処理
        if (this.m_drawInf.isInnerExChartAreaX(x)) {
            if (this.m_drawInf.isInnerChartAreaX(x)) {
                this.m_info.setMousePosX(x);
            } else {
                this.m_info.setMousePosX(this.m_drawInf.getChartAreaEndPosX());
            }
            this.m_info.setMousePosY(y);
            this.m_drawInf.setMousePos(x, y);
        } else {
            this.m_mosPushStat = false;
        }
        return true;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if(this.m_common.m_isDrawColorPicker){
            return this.m_common.m_colorPicker.uiEvtMouseLeftPerformed(x, y);
        }
        for (let i = 0; i < this.m_slider.length; ++i) {
            if(this.m_slider[i] !== null){
                if (this.m_slider[i].uiEvtMouseLeftPerformed(x, y)) {
                    return true;
                }
            }
            if(this.m_colorLabel[i] !== null){
                if (this.m_btnModColor[i].uiEvtMouseLeftPerformed(x, y)) {
                    return true;
                }
            }
        }

        this.m_mosPushStat = true;
        this.m_mosPushPrvX = x;
        return false;
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        this.m_mosPushStat = false;
        this.m_mosPushPrvX = 0;
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOVE OUT]
    //==============================================================================
    uiEvtMouseOutPerformed() {
        this.m_mosPushStat = false;
        this.m_mosPushPrvX = 0;
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOVE IN]
    //==============================================================================
    uiEvtMouseInPerformed() {
        this.m_mosPushStat = false;
        this.m_mosPushPrvX = 0;
        return false;
    }
}
//==============================================================================
//  新値足
//==============================================================================
export class ChartBRK extends ChartSinglePanel {
	constructor(chartCanvas, info, techParam, drawParam, chartType) {
        super(chartCanvas, info, techParam, drawParam, chartType, 3);
        this.m_paramColor = drawParam.m_color.BRK.c;
        this.m_indexName = "新値足";
        this.m_paramName[0] = '本数';
        this.m_paramName[1] = '陽線';
        this.m_paramName[2] = '陰線';
        this.resetIndexColor();
    }
    //==============================================================================
    //	エントリサイズ取得
    //==============================================================================
    getEntrySize() {
        return this.m_techIndex.getSize();
    }
    //==============================================================================
    //	表示文字列取得
    //==============================================================================
    getScaleString(ix = -1) {
        let curIndex = ix;
        if (curIndex < 0) { curIndex = this.m_info.getCurIndex(); }
        return this.m_techIndex.m_data[TS.TI_BRK_END_DATE][curIndex];
    }
    //==============================================================================
    //  スケールレンジ取得
    //==============================================================================
    getRange(bgnIndex, dispEntryCnt) {
        return this.m_techIndex.getPriceRange(bgnIndex, dispEntryCnt);
    }
    //==============================================================================
    //  タイトル取得
    //==============================================================================
    getTittle() {
        const prmVal = this.m_techParam.getParam_BRK(super.getDataType());
        const headerStr = this.m_indexName  + " ( "
            + "期間=" + prmVal[0]
            + " )";
        return headerStr;   
    }
    resetIndexData() {
        let hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const prmVal = this.m_techParam.getParam_BRK(dataType); 
        this.m_techIndex = new ChartTechBRK();
        this.m_techIndex.setParameter(prmVal[0]);
        this.m_techIndex.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.BRK.c;
        this.m_colorLabel[0] = null; 
        this.m_colorLabel[1].init(paramValue[0]);
        this.m_colorLabel[2].init(paramValue[1]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_BRK(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorBRK(this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_BRK(dataType, updateParamValue);
        this.resetIndexData();
    }
    //==============================================================================
    //	インデックスパネル編集
    //==============================================================================
    setValueToIndexPanel(ix, color) {
        const dataType = this.m_info.getCurrentHist().mDataType;
        const dec = this.m_drawInf.getScaleValueDec();
        let value = this.m_common.getDateStr(this.m_techIndex.m_data[TS.TI_BRK_BGN_DATE][ix], dataType);
        super.setPanel("開始", color, value);
        value = this.m_common.getDateStr(this.m_techIndex.m_data[TS.TI_BRK_END_DATE][ix], dataType);
        super.setPanel("終了", color, value);
        value = this.m_common.roundDownDecStr(this.m_techIndex.m_data[TS.TI_BRK_BGN][ix], dec);
        super.setPanel("始値", color, value);
        value = this.m_common.roundDownDecStr(this.m_techIndex.m_data[TS.TI_BRK_END][ix], dec);
        super.setPanel("終値", color, value);
    }
    //==============================================================================
    //	[描画] 新値足
    //==============================================================================
    drawBRK(ix, xPos, entry_width, isBackLine) {
        let retPosX = 0;
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let xEndPos = 0;
        const buyColor = this.m_drawParam.getColor(this.m_paramColor[0]);
        const sellColor = this.m_drawParam.getColor(this.m_paramColor[1]);
        const frameColor = "rgb(255, 255, 255)";
        //if(m_pInfo->IsAllDisp()){
        //    //全体表示モード判定
        //    xEndPos = m_drawInf.CnvValueToPosX(ix+1);
        //}else{
            //通常
            xEndPos = xPos + entry_width;
        //}
        
        //エントリ取得用定義
        let openPrice = this.m_techIndex.m_data[TS.TI_BRK_BGN][ix];
        let closePrice = this.m_techIndex.m_data[TS.TI_BRK_END][ix];
        //let openDate = this.m_techIndex.m_data[TS.TI_BRK_BGN_DATE][ix];
        //let closeDate = this.m_techIndex.m_data[TS.TI_BRK_END_DATE][ix];
        if(0.0 < openPrice){
            let ypos1 = this.m_drawInf.cnvValueToPosYForPrice(openPrice);
            let ypos2 = this.m_drawInf.cnvValueToPosYForPrice(closePrice);
            if(openPrice < closePrice){
                //新値陽線
                let fillColor = buyColor;
                let width = xEndPos - xPos;
                let height;
                if(ypos1 === ypos2){
                    height = (ypos2-1) - ypos1;
                }else{
                    height = ypos2 - ypos1;
                }
                this.m_cc.drawBlendRect(fillColor, frameColor, 0.5, xPos, ypos1, width, height); 
            }else{
                //新値陰線
                let fillColor = sellColor;
                let width = xEndPos - xPos;
                let height;
                if(ypos1 === ypos2){
                    height = (ypos1+1) - ypos2;
                }else{
                    height = ypos1 - ypos2;
                }
                this.m_cc.drawBlendRect(fillColor, frameColor, 0.5, xPos, ypos2, width, height); 
            }
        }
        return xEndPos;	//今回のX位置
    }
}
//==============================================================================
//  カギ足
//==============================================================================
export class ChartKAGI extends ChartSinglePanel {
    constructor(chartCanvas, info, techParam, drawParam, chartType) {
        super(chartCanvas, info, techParam, drawParam, chartType, 3);
        this.m_paramColor = drawParam.m_color.KAGI.c;
        this.m_paramMulti = 100;
        this.m_paramDec = 2;
        this.m_indexName = "カギ足";
        this.m_paramName[0] = '転換率';
        this.m_paramName[1] = '陽線';
        this.m_paramName[2] = '陰線';
        this.resetIndexColor();
    }
    getEntrySize() {
        return this.m_techIndex.getSize();
    }
    getScaleString(ix = -1) {
        let curIndex = ix;
        if (curIndex < 0) { curIndex = this.m_info.getCurIndex(); }
        return this.m_techIndex.m_data[TS.TI_KAGI_CLOSE_DATE][curIndex];
    }
    getRange(bgnIndex, dispEntryCnt) {
        return this.m_techIndex.getPriceRange(bgnIndex, dispEntryCnt);
    }
    getTittle() {
        const prmVal = this.m_techParam.getParam_KAGI(super.getDataType());
        const headerStr = this.m_indexName  + " ( "
        + "転換率=" + (prmVal[0] / this.m_paramMulti)
        + " )";
        return headerStr;   
    }
    resetIndexData() {
        let hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const prmVal = this.m_techParam.getParam_KAGI(dataType); 
        this.m_techIndex = new ChartTechKAGI();
        this.m_techIndex.setParameter(prmVal[0]);
        this.m_techIndex.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, 1000, 1, prmVal[0], this.m_paramDec);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.KAGI.c;
        this.m_colorLabel[0] = null; 
        this.m_colorLabel[1].init(paramValue[0]);
        this.m_colorLabel[2].init(paramValue[1]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_KAGI(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1] = null;
        this.m_slider[2] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorKAGI(this.m_colorLabel[1].getRGB(), this.m_colorLabel[2].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue()];
        this.m_techParam.setParam_KAGI(dataType, updateParamValue);
        this.resetIndexData();
    }
    setValueToIndexPanel(ix, color) {
        const dataType = this.m_info.getCurrentHist().mDataType;
        const dec = this.m_drawInf.getScaleValueDec();
        let value = this.m_common.getDateStr(this.m_techIndex.m_data[TS.TI_KAGI_OPEN_DATE][ix], dataType);
        super.setPanel("開始", color, value);
        value = this.m_common.getDateStr(this.m_techIndex.m_data[TS.TI_KAGI_CLOSE_DATE][ix], dataType);
        super.setPanel("終了", color, value);
        value = this.m_common.roundDownDecStr(this.m_techIndex.m_data[TS.TI_KAGI_OPEN][ix], dec);
        super.setPanel("高値", color, value);
        value = this.m_common.roundDownDecStr(this.m_techIndex.m_data[TS.TI_KAGI_CLOSE][ix], dec);
        super.setPanel("安値", color, value);
    }
    //==============================================================================
    //	[描画] カギ足
    //==============================================================================
    drawKAGI(ix, xPos, entry_width, prev_y, is_white) {
        let prev_yPos = prev_y;
        let bWhite = is_white;
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let xEndPos = xPos + entry_width;
        const buyColor = this.m_drawParam.getColor(this.m_paramColor[0]);
        const sellColor = this.m_drawParam.getColor(this.m_paramColor[1]);

        // エントリ取得用定義
        let openPrice = this.m_techIndex.m_data[TS.TI_KAGI_OPEN][ix];
        let closePrice = this.m_techIndex.m_data[TS.TI_KAGI_CLOSE][ix];
        let openDate = this.m_techIndex.m_data[TS.TI_KAGI_OPEN_DATE][ix];
        let closeDate = this.m_techIndex.m_data[TS.TI_KAGI_CLOSE_DATE][ix];

        if(0.0 < openPrice){
            let ypos1 = this.m_drawInf.cnvValueToPosYForPrice(openPrice);
            let ypos2 = this.m_drawInf.cnvValueToPosYForPrice(closePrice);

            if(!prev_yPos){
                //初期化
                if(ypos2 < ypos1){
                    bWhite = true;
                }else if(ypos1 < ypos2){
                    bWhite = false;
                }
            }

            if (bWhite) {
                //前回陽線側
                this.m_cc.drawLine(buyColor, xPos, ypos1, xPos, ypos2);
                this.m_cc.drawLine(buyColor, xPos, ypos2, xEndPos, ypos2);
            } else {
                //前回陰線側
                this.m_cc.drawLine(sellColor, xPos, ypos1, xPos, ypos2);
                this.m_cc.drawLine(sellColor, xPos, ypos2, xEndPos, ypos2);
            }

            if (ypos2 < ypos1) {
                //陽線
                if (prev_yPos && ypos2 < prev_yPos) {
                    this.m_cc.drawLine(buyColor, xPos, prev_yPos, xPos, ypos2);
                    this.m_cc.drawLine(buyColor, xPos, ypos2, xEndPos, ypos2);
                    bWhite = true;
                }
                prev_yPos = ypos1;
            } else if (ypos1 < ypos2) {
                //陰線
                if (prev_yPos && prev_yPos < ypos2) {
                    this.m_cc.drawLine(sellColor, xPos, prev_yPos, xPos, ypos2);
                    this.m_cc.drawLine(sellColor, xPos, ypos2, xEndPos, ypos2);
                    bWhite = false;
                }
                prev_yPos = ypos1;
            }
        }

        return [xEndPos, prev_yPos, bWhite];

    }
}
//==============================================================================
//  ポイント＆フィギュア
//==============================================================================
export class ChartPF extends ChartSinglePanel {
    constructor(chartCanvas, info, techParam, drawParam, chartType) {
        super(chartCanvas, info, techParam, drawParam, chartType, 4);
        this.m_paramColor = drawParam.m_color.PF.c;
        this.m_indexName = "ポイント＆フィギュア";
        this.m_paramName[0] = '転換数';
        this.m_paramName[1] = '枠数';
        this.m_paramName[2] = '陽線';
        this.m_paramName[3] = '陰線';
        this.resetIndexColor();
    }
    getEntrySize() {
        return this.m_techIndex.getSize();
    }
    getScaleString(ix = -1) {
        let curIndex = ix;
        if (curIndex < 0) { curIndex = this.m_info.getCurIndex(); }
        return this.m_techIndex.m_data[TS.TI_PF_CLOSE_DATE][curIndex];
    }
    getRange(bgnIndex, dispEntryCnt) {
        return this.m_techIndex.getPriceRange(bgnIndex, dispEntryCnt);
    }
    getTittle() {
        const prmVal = this.m_techParam.getParam_PF(super.getDataType());
        let headerStr;
        if(prmVal[1] === 0){
            headerStr = this.m_indexName  + " ( "
            + "転換数=" + prmVal[0]
            + "枠数=自動"   
            + " )";
        }else{
            headerStr = this.m_indexName  + " ( "
            + "転換数=" + prmVal[0]
            + "枠数=" + prmVal[1]
            + " )";
        }
        return headerStr;   
    }
    resetIndexData() {
        let hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const prmVal = this.m_techParam.getParam_PF(dataType); 
        this.m_techIndex = new ChartTechPF();
        this.m_techIndex.setParameter(prmVal[0], prmVal[1]);
        this.m_techIndex.setIndexValueToObj(hist.mChartList);
        this.m_slider[0].init(MIN_PARAM_VALUE, MAX_PARAM_VALUE, 1, prmVal[0]);
        this.m_slider[1].init(0, MAX_PARAM_VALUE, 1, prmVal[1]);
        this.m_slider[2] = null;
        this.m_slider[3] = null;
    }
    resetIndexColor() {
        const paramValue = this.m_drawParam.m_color.PF.c;
        this.m_colorLabel[0] = null; 
        this.m_colorLabel[1] = null; 
        this.m_colorLabel[2].init(paramValue[0]);
        this.m_colorLabel[3].init(paramValue[1]);
    }
    resetSlider() {
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const defaultParamValue = this.m_techParam.getDefault_PF(dataType);
        this.m_slider[0].setCurValue(defaultParamValue[0]);
        this.m_slider[1].setCurValue(defaultParamValue[1]);
        this.m_slider[2] = null;
        this.m_slider[3] = null;
    }
    updateIndexParam() {
        this.m_drawParam.setColorPF(this.m_colorLabel[2].getRGB(), this.m_colorLabel[3].getRGB());
        const hist = this.m_info.getCurrentHist();
        const dataType = hist.mDataType;
        const updateParamValue = [this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue()];
        this.m_techParam.setParam_PF(dataType, updateParamValue);
        this.resetIndexData();
    }
    setValueToIndexPanel(ix, color) {
        const dec = this.m_drawInf.getScaleValueDec();
        let value = this.m_common.getDateStr(this.m_techIndex.m_data[TS.TI_PF_OPEN_DATE][ix]);
        super.setPanel("開始", color, value);
        value = this.m_common.getDateStr(this.m_techIndex.m_data[TS.TI_PF_CLOSE_DATE][ix]);
        super.setPanel("終了", color, value);
        value = this.m_common.roundDownDecStr(this.m_techIndex.m_data[TS.TI_PF_OPEN][ix], dec);
        super.setPanel("高値", color, value);
        value = this.m_common.roundDownDecStr(this.m_techIndex.m_data[TS.TI_PF_CLOSE][ix], dec);
        super.setPanel("安値", color, value);
    }
    //==============================================================================
    //	[描画] ポイント＆フィギュア
    //==============================================================================
    drawPF(ix, xPos, entry_width, isBackLine)　{
        let retPosX = 0;
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let xEndPos = 0;
        const buyColor = this.m_drawParam.getColor(this.m_paramColor[0]);
        const sellColor = this.m_drawParam.getColor(this.m_paramColor[1]);
        //通常
        xEndPos = xPos + entry_width;
        // エントリ取得用定義
        let openPrice = this.m_techIndex.m_data[TS.TI_PF_OPEN][ix];
        let closePrice = this.m_techIndex.m_data[TS.TI_PF_CLOSE][ix];
        let openDate = this.m_techIndex.m_data[TS.TI_PF_OPEN_DATE][ix];
        let closeDate = this.m_techIndex.m_data[TS.TI_PF_CLOSE_DATE][ix];

        let prm = this.m_techIndex.getUnitRange(closePrice);
        if(0.0 < openPrice){
            let ypos1 = this.m_drawInf.cnvValueToPosYForPrice(openPrice);
            let ypos2 = this.m_drawInf.cnvValueToPosYForPrice(closePrice);

            if(openPrice < closePrice){
                //陽線
                let value1 = openPrice;
                let value2 = openPrice;
                while(value2 < closePrice + prm){
                    value1 = value2;
                    value2 = value1 + prm;
                    let ypos1 = this.m_drawInf.cnvValueToPosYForPrice(value1);
                    let ypos2 = this.m_drawInf.cnvValueToPosYForPrice(value2);
                    this.m_cc.drawLine(buyColor, xPos, ypos1, xEndPos, ypos2);
                    this.m_cc.drawLine(buyColor, xEndPos, ypos1, xPos, ypos2);
                }
            }else{
                //陰線
                let value1 = closePrice;
                let value2 = closePrice;
                while(value2 < openPrice + prm){
                    value1 = value2;
                    value2 = value1 + prm;
                    let ypos1 = this.m_drawInf.cnvValueToPosYForPrice(value1);
                    let ypos2 = this.m_drawInf.cnvValueToPosYForPrice(value2);
                    let radX = (entry_width >> 1);
                    let xpos = xPos + radX;
                    let radY = (ypos2 - ypos1);
                    let ypos = ypos1 + radY;
                    //this.m_cc.drawEllipse(sellColor, xpos, ypos, radX, radY);
                    this.m_cc.drawEllipseOblong(sellColor, xpos, ypos, radX, radY);
                }
            }
        }

        return xEndPos;       //今回のX軸
    }
}

//==============================================================================
//  逆ウォッチ曲線
//==============================================================================
export class ChartCWC extends ChartSinglePanel {
    getEntrySize() {
        return this.m_techIndex.getSize();
    }
    getScaleString(ix = -1) {
        return "NA";
    }
    getRange(bgnIndex, dispEntryCnt) {
        // NOTHING
    }
    setValueToIndexPanel(ix, color) {
        // NOTHING
    }
    resetIndexData() {
        let hist = this.m_info.getCurrentHist();
        this.m_techIndex = new ChartTechCWC();
        const dataType = hist.mDataType;
        this.m_techParamVal = this.m_techParam.getParam_CWC(dataType); 
        this.m_techIndex.setParameter(this.m_techParamVal[0]);
        this.m_techIndex.setIndexValueToObj(hist.mChartList);
    }
    draw(rc) {
        const area_width = rc.right - rc.left;
        const area_height = rc.bottom - rc.top;

        // 初期塗り潰し
        this.m_cc.drawBackground(rc.left, rc.top, area_width, area_height);
        
        let top_margin = this.m_drawInf.getChartAreaMarginTop();
        //固定エリア表示位置(右/左)セット
        //m_drawInf.SetFixedAreaSide(m_pInfo->IsFixAreaSideRight());
        //固定エリアDRAW判定フラグセット
        //m_drawInf.SetFixedAreaDraw(m_pInfo->IsHideFixArea());

        //オリジナルにない(イベントで制御しているため)
        this.m_drawInf.setAreaTop(rc.top);
        this.m_drawInf.setAreaHeight(area_height);

        //タイトル表示描画
        //CDP::DrawChartTitle(qpt, rc, m_drawInf.GetFixedLeftWidth(), m_chartHeaderName);
        //if(area_height < top_margin){
        //  return;
        //}

        //Y軸領域終了点余白幅
        const chart_margin = 20;	// 上下余白サイズ
        this.m_drawInf.setChartAreaInnerMargin(chart_margin);
        this.m_drawInf.setChartAreaMarginBtm(50);
        this.m_drawInf.setChartAreaMarginTop(8 + chart_margin);

        let hist = this.m_info.getCurrentHist();
        let szHistList = hist.mChartList.length;
        if(szHistList < this.m_techIndex.m_prm[0]){
            return;
        }

        // 横軸スケール値設定
        //m_drawInf.SetScaleValueLeft(1);
        //m_drawInf.SetScaleValueRight(szHistList);

        // エントリ描画サイズ取得
        this.m_common.copyEntryDrawWidth();
        // 描画エリアサイズ退避(幅)
        this.m_drawInf.setAreaWidth(area_width);
        // エリア内横幅調整
        this.m_drawInf.setChartAreaWidth();
        // 描画値段オブジェクト倍数セット
        this.m_drawInf.setScaleValueDec(hist.mDecimalScale);
        // 描画値段小数点有効桁数セット
        this.m_drawInf.setValidDegits(hist.mValiｄDegits);

        // 描画インデックス変更判定
        [this.m_dispInfo.dispMaxPrice, this.m_dispInfo.dispMinPrice] = this.m_techIndex.getSMARange();
        [this.m_dispInfo.dispMaxVol, this.m_dispInfo.dispMinVol] = this.m_techIndex.getSMAVRange();

        // 横軸スケール値設定
        this.m_common.setScaleRangeValue(
            this.m_dispInfo.dispMaxVol,
            this.m_dispInfo.dispMinVol,
            false,
            CD.CHART_HORIZONTAL,
            hist.mDecimalScale
        );

        // 縦軸スケール値（調整前取得）
        let height = this.m_drawInf.getChartAreaHeightNotAdjust();
        // 高安から横本数を確定
        this.m_common.setScaleRangeValue(
            this.m_dispInfo.dispMaxPrice >> 0,
            this.m_dispInfo.dispMinPrice >> 0,
            false,
            CD.CHART_VERTICAL,
            hist.mDecimalScale
        );

        // エリア内縦幅調整(余りを切捨て調整)
        let scaleHeight = this.m_drawInf.getScaleRangeNum();
        height = (height / scaleHeight) * scaleHeight;
        // エリア高さ調整確定値セット
        this.m_drawInf.setChartAreaHeight(height);
        // 縦軸描画開始位置取得
        this.m_drawInf.setChartAreaBgnPosY();
        // チャートY軸表示モード設定
        //int disp_mode = CHART_DMODE_NML;
        //this.m_drawInf.setDispMode(disp_mode);
        // スケールレンジ確定
        this.m_common.setDrawRangeHeight();
        // 外枠描画
        this.m_common.drawOutBack();
        // スケールライン描画   
        this.m_common.drawRangeOfRate();
        this.drawRangeVertical();

        // CWC描画
        let prev_xPos = 0;
        let prev_yPos = 0;
        let first_entry = true;
        let pt = null;
        const beginUnit = this.m_drawInf.getScaleValueLeft();
        const basicStrColor = 'rgb(255,255,255)';
        for (let i = 0; i < szHistList; i++) {
            //エントリ取得用定義
            let sma = this.m_techIndex.m_data[TS.TI_CWC_SMA][i];
            let smav = this.m_techIndex.m_data[TS.TI_CWC_SMAV][i];
            pt = hist.mChartList[i];
            if(smav <= 0.0 || sma <= 0.0){
                continue;
            }
            // レンジが0からではないため最初に最左値を差し引く
            let xPos = this.m_drawInf.cnvValueToPosXForVol(smav - beginUnit);
            let yPos = this.m_drawInf.cnvValueToPosYForPrice(sma);
            let cwcColor = this.m_drawParam.m_prmColor[CD.IV_CWC_P];
            if (0 < prev_xPos && 0 < prev_yPos) {
                this.m_cc.drawLine(cwcColor, prev_xPos, prev_yPos, xPos, yPos);
                if(first_entry){
                    let bgn_xpos = prev_xPos - 4;
                    let bgn_ypos = prev_yPos - 4;
                    this.m_cc.drawFillRect(this.m_drawParam.getColor(this.m_drawParam.m_color.CWC_END.c), basicStrColor, bgn_xpos, bgn_ypos, 8, 8);
                    bgn_ypos -= 20;
                    let bgnDate = this.m_common.getDateStr(pt.mDate, hist.mDataType);
                    this.m_cc.drawStringC("(始) " + bgnDate, bgn_xpos, bgn_ypos, basicStrColor);
                    first_entry = false;
                }
            }
            prev_xPos = xPos;
            prev_yPos = yPos;
        }
        
        // 終点描画
        let end_xpos = prev_xPos - 4;
        let end_ypos = prev_yPos - 4;
        this.m_cc.drawFillRect(this.m_drawParam.getColor(this.m_drawParam.m_color.CWC_END.c), basicStrColor, end_xpos, end_ypos, 8, 8);
        let endDate = this.m_common.getDateStr(pt.mDate, hist.mDataType);
        end_ypos -= 20;
        this.m_cc.drawStringC("(終) " + endDate, end_xpos, end_ypos, basicStrColor);
        let curIndex = 0;
        let mos_posx  = this.m_info.getMousePosX();
        let mos_posy  = this.m_drawInf.getMousePosY(); //Y軸は固有
        let chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        let chartEndPosX = this.m_drawInf.getChartAreaEndPosX();
        let chartBgnPosY = this.m_drawInf.getChartAreaBgnPosY();
        let chartEndPosY = this.m_drawInf.getChartAreaEndPosY();
        if (this.m_drawInf.isInnerChartAreaX(mos_posx)) {
            if (this.m_drawInf.isInnerChartAreaY(mos_posy)) {
                // SCALE VOLUME
                let scale_value = this.m_drawInf.cnvPosYToValue(mos_posy);
                let s_value = this.m_common.roundDownDecStr(scale_value, 0);
                //this.m_cc.drawStringR(s_value, mos_posx, mos_posy-4, "rgb(255, 128, 0)");
            }
            curIndex = this.m_drawInf.cnvPosXToValue(mos_posx);
        }

        //**************************************************************************
        // FIXED PANE DRAW
        //**************************************************************************
        // if(!m_pInfo->IsHideFixArea()){
        //     QRect fixed_rc(m_drawInf.GetFixedAreaBgnPosX(), m_drawInf.GetAreaTop(), 0, 0);
        //     fixed_rc.setRight(m_drawInf.GetFixedAreaEndPosX() - 1);
        //     fixed_rc.setBottom(m_drawInf.GetAreaBottom());

        //     CDP::DrawGradient(qpt, fixed_rc, QColor(65, 65, 65), QColor(10, 10, 10));
        //     DrawFixedPain(qpt, fixed_rc);
        // }
    }
    //====================================================================
    //	縦軸スケールライン FOR CWC
    //====================================================================
    drawRangeVertical() {
        let chartBgnPosX = this.m_drawInf.getChartAreaBgnPosX();
        let chartEndPosY = this.m_drawInf.getChartAreaEndPosYWithMgn();
        let string_pos = chartEndPosY + 5;
        let scaleNum = this.m_drawInf.getScaleXRangeNum();
        let scaleUnit = this.m_drawInf.getScaleXRangeUnit();
        let scaleWidth = this.m_drawInf.getScaleRangeWidth();
        let xpos = chartBgnPosX;
        let trueValue = this.m_drawInf.getScaleValueLeft();
        // レンジが0からではないため最初に最左値を差し引く
        let dispValue = this.m_drawInf.getScaleValueLeft() - trueValue;
        let max = scaleNum;
        for (let i = 0; i < max; i++) {
            xpos = this.m_drawInf.cnvValueToPosXForVol(dispValue);
            // 目盛表示
            if (0 < i) {
                let s_value = this.m_common.roundDownDecStr(trueValue, 0);
                this.m_cc.drawStringC(s_value, xpos, string_pos);
            }
            // 縦軸線
            this.m_common.drawBackScaleLine(xpos, null, 0, false);

            dispValue += scaleUnit;
            trueValue += scaleUnit;
        }
    }
}