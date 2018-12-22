import * as IDX from './chartDef';

const chartDefaultColor = {
    // テクニカルカラーパラメータ
    "SMA": {
        "c": ['159,227,105', '255,150,56', '91,91,250'],
    },
    "EMA": {
        "c": ['234,49,63', '82,191,250', '94,194,88'],
    },
    "WMA": {
        "c": ['50,137,234', '251,32,197', '193,236,47'],
    },
    "SMMA": {
        "c": ['200,0,200'],
    },
    "EMMA": {
        "c": ['0,255,255'],
    },
    "BB": {
        "c": ['255,150,56', '91,91,250', '190,66,248', '159,227,105', '190,66,248', '91,91,250', '255,150,56'],
    },
    "ICHI": {
        "c": ['159,227,105', '255,0,0', '0,128,255', '255,128,0', '255,91,255'],
    },
    "ENV": {
        "c": ['235,41,31', '235,41,31', '20,131,252', '56,217,38', '20,131,252', '235,41,31', '235,41,31'],
    },
    "VS": {
        "c": ['200,30,30', '30,30,200'],
    },
    "HLB": {
        "c": ['235,41,31', '15,183,183', '30,30,30'],
    },
    "PVT": {
        "c": ['255,128,0', '20,131,252', '20,131,252', '208,47,197', '208,47,197'],
    },
    "LRT": {
        "c": ['255,150,50', '160,220,100', '90,90,250', '130,70,15', '255, 255, 255'],
    },
    "HMA": {
        "c": ['200,30,30', '80,80,200'],
    },
    "PAR": {
        "c": ['255,0,0', '255,128,128', '0,125,255', '0,128,255'],
    },
    "VWAP": {
        "c": ['255,255,255'],
    },
    "SMAV": {
        "c": ['15,183,183', '255,128,0', '80, 118, 164'],
    },
    "MACD": {
        "c": ['150,150,150', '150,150,150', '15,183,183', '255,128,0', '0,0,255'],
    },
    "MOM": {
        "c": ['255,164,193', '33,173,75', '192,192,192', '255,128,0'],
    },
    "STC": {
        "c": ['159,227,105', '225,150,55'],
    },
    "SSTC": {
        "c": ['225,150,55', '255,238,255'],
    },
    "RSIA": {
        "c": ['33, 173, 75', '15,183,183'],
    },
    "RSIB": {
        "c": ['255,164,193', '15,183,183'],
    },
    "RCI": {
        "c": ['255,164,193', '15,183,183'],
    },
    "WR": {
        "c": ['65,80,205'],
    },
    "PL": {
        "c": ['33,173,75'],
    },
    "DMA": {
        "c": ['255,128,0', '33,173,75', '15,183,183'],
    },
    "UO": {
        "c": ['33,173,75'],
    },
    "ATR": {
        "c": ['255,128,0'],
    },
    "ROC": {
        "c": ['33,173,75', '255,164,193'],
    },
    "SWR": {
        "c": ['33,173,75', '255,164,193'],
    },
    "ARN": {
        "c": ['255,0,0', '0,0,255'],
    },
    "ARO": {
        "c": ['15,183,183'],
    },
    "CCI": {
        "c": ['0,128,255'],
    },
    "SNR": {
        "c": ['0,128,255'],
    },
    "DPO": {
        "c": ['20,128,255'],
    },
    "SD": {
        "c": ['150,173,75'],
    },
    "SDV": {
        "c": ['100,173,75'],
    },
    "HV": {
        "c": ['33,173,75'],
    },
    "VRA": {
        "c": ['0,255,15', '60,30,255'],
    },
    "VRB": {
        "c": ['0,255,15', '60,30,255'],
    },
    "DMI": {
        "c": ['33,173,75', '255,164,193', '15,183,183', '86,86,235'],
    },
    "OBV": {
        "c": ['255,85,0'],
    },
    "RTA": {
        "c": ['150,183,100'],
    },
    "MGN": {
        "c": ['0,160,230', '255,0,0'],
    },
    "TBRK": {
        "c": ['240, 30, 35', '26, 140, 255'],
    },
    "TKAGI": {
        "c": ['192,192,192'],
    },
    "BRK": {
        "c": ['240, 30, 35', '26, 140, 255'],
    },
    "KAGI": {
        "c": ['240, 30, 35', '26, 140, 255'],
    },
    "PF": {
        "c": ['240, 30, 35', '26, 140, 255'],
    },
    "TICK": {
        "c": ['0, 162, 232', '100, 100, 100', '0, 162, 232'],
    },
    "TEST": {
        "c": ['0, 162, 232', '100, 100, 100', '0, 162, 232'],
    },
    // 部材カラーパラメータ
    "SPLIT": { "c": ['0, 0, 0'] },              // スプリットライン
    "SCALE": { "c": ['150, 150, 150'] },  		// スケールライン
    "SCALE_DOT": { "c": ['150, 150, 150'] }, 	// スケールライン(点線)
    "SCALE_DATE": { "c": ['80, 0, 0'] }, 		// スケールライン(日付変更線)
    "SCALE_UNIT": { "c": ['150, 150, 150'] }, 	// スケール目盛部分
    "SCROLL_STR": { "c": ['192, 192, 192'] },  	// スクロールスケール文字列
    "SCROLL_POLY": { "c": ['0, 160, 230'] },    // スクロール背景グラフ
    "SCROLL": { "c": ['50, 100, 200'] },       	// スクロール選択範囲
    "SELL": { "c": ['26, 140, 255'] }, 			// チャート(陽)
    "BUY": { "c": ['240, 30, 35'] }, 			// チャート(陰)

    // テクニカルツール関連
    "TT_DRAWING": { "c": ['255,125,40'] },	    // 描画ツール
    "TT_SELECTED": { "c": ['255,0,0'] },    // 描画ツール選択状態
    "TRENDLINE": { "c": ['255,0,0'] }, 		    // トレンドライン
    "RETRACE_3": { "c": ['255,128,0'] },	    // リトレースメント(3本)
    "RETRACE_5": { "c": ['128,255,0'] },	    // リトレースメント(5本)
    "ICHI_T": { "c": ['10,125,255'] },	        // 一目均衡表(時間論・基本数値)
    "FINA_Z": { "c": ['0,0,255'] },	            // フィボナッチ(ザラバ)
    "FINA_C": { "c": ['0,120,60'] },	        // フィボナッチ(終値)
    "FINA_R": { "c": ['120,150,20'] },	        // フィボナッチ(基調転換)
    "COUNTER_VT": { "c": ['10,125,255'] },	    // 日柄カウンター(縦)
    "PENTA": { "c": ['240,210,160'] },	        // ペンタゴン
    "CWC_END": { "c": ['255,128,64'] },	        // 逆ウォッチ(終点)
  
    "FIBO_FAN_LINE_50": { "c": ['0,128,255'] },	     // フィボナッチファン(50%線)
    "FIBO_FAN_LINE_FAN": { "c": ['255,128,64'] },	 // フィボナッチファン(ファン)
    "GAN_FAN_LINE_100": { "c": ['255,128,64'] },	 // ギャンファン(中心線)
    "GAN_FAN_LINE_FAN": { "c": ['126,168,255'] },	 // ギャンファン(ファン)
    "GAN_ANGLE_LINE_100": { "c": ['255,255,255'] },	 // ギャンアングル(中心線)
    "GAN_ANGLE_LINE_50": { "c": ['126,168,255'] },	 // ギャンアングル(50%線)
    "GAN_ANGLE_LINE_FAN": { "c": ['126,168,255'] },	 // ギャンアングル(ファン)

    "GAN_BOX_LINE": { "c": ['126,168,255'] },	     // ギャンボックス
    "GAN_BOX_LINE_50": { "c": ['255,128,0'] },	 // ギャンボックス(50%線)
    "GAN_BOX_LINE_RECT": { "c": ['0,㍘,255'] },	 // ギャンボックス(枠)

}
export default class ChartDrawParameter {
    constructor() {
        //this.m_defaultColor = JSON.parse(JSON.stringify(chartDefaultColor));
        this.m_color = chartDefaultColor;
        this.m_prmColor = new Array(IDX.IV_MAX);
        this.m_clrColor = new Array(IDX.CLR_MAX);
    }
    setColorDef(colorDef) {
        this.m_color = colorDef;
    }
    getColorDef() {
        return this.m_color;
    }
    getColor(val) { return 'rgb(' + val + ')'; }
    init() {
        this.m_clrColor[IDX.CLR_SPLIT] = "rgb(0, 0, 0)";	//スプリットライン
        this.m_clrColor[IDX.CLR_SCALE] = "rgb(150, 150, 150)";	//スケールライン
        this.m_clrColor[IDX.CLR_SCALE_DOT] = "rgb(150, 150, 150)";	//スケールライン(点線)
        this.m_clrColor[IDX.CLR_SCALE_DATE] = "rgb(80, 0, 0)";	//スケールライン(日付変更線)
        this.m_clrColor[IDX.CLR_SCALE_UNIT] = "rgb(150, 150, 150)";	//スケール目盛部分
        this.m_clrColor[IDX.CLR_SCROLL_STR] = "rgb(192, 192, 192)"; //スクロールスケール文字列
        this.m_clrColor[IDX.CLR_SCROLL_POLY] = "rgb(0, 160, 230)";   //スクロール背景グラフ
        this.m_clrColor[IDX.CLR_SCROLL] = "rgb(50, 100, 200)";      //スクロール選択範囲
        this.m_clrColor[IDX.CLR_SELL] = "rgb(26, 140, 255)";	//チャート(陽)
        this.m_clrColor[IDX.CLR_BUY] = "rgb(240, 30, 35)";	//チャート(陰)
        this.m_clrColor[IDX.CLR_CLOSE_LINE] = "darkorange";	//終値ライン足
        this.m_clrColor[IDX.CLR_LAST_CLOSE] = "darkorange";	//前日終値線

        //this.m_clrColor[IDX.CLR_PRICE_VOL]  = "darkorange";	//値段別売買高 & 日柄カウンター(縁)
        //this.m_clrColor[IDX.CLR_TRENDLINE]  = "red";	    //トレンドライン
        //this.m_clrColor[IDX.CLR_RETRACE_3]  = "rgb(255, 128, 0)";	//リトレースメント(3本)
        //this.m_clrColor[IDX.CLR_RETRACE_5]  = "rgb(128, 255, 0)";	//リトレースメント(5本)
        //this.m_clrColor[IDX.CLR_COUNTER]    = "darkorange";	//日柄カウンター
        //this.m_clrColor[IDX.CLR_DRAWING]    = "darkorange";	    //描画ツール
        //this.m_clrColor[IDX.CLR_SELECTED]   = "darkorange";	//描画ツール選択状態
        // this.m_clrColor[IDX.CLR_ICHI_T]     = "rgb(10, 125, 255)";	//一目均衡表(時間論・基本数値)
        // this.m_clrColor[IDX.CLR_FINA_Z]     = "rgb(0, 0, 255)";	//フィボナッチ(ザラバ)
        // this.m_clrColor[IDX.CLR_FINA_C]     = "rgb(0, 120, 60)";	//フィボナッチ(終値)
        // this.m_clrColor[IDX.CLR_FINA_R]     = "rgb(120, 150, 20)";	//フィボナッチ(基調転換)
        //this.m_clrColor[IDX.CLR_COUNTER_VT] = "rgb(10, 125, 255)";	//日柄カウンター(縦)
        // this.m_clrColor[IDX.CLR_PENTA]      = "rgb(240, 210, 160)";	//ペンタゴン
        // this.m_clrColor[IDX.CLR_PENTA_SEL]  = "rgb(255, 0, 0)";	//ペンタゴン(選択)
        this.m_clrColor[IDX.CLR_TICK] = "darkorange";	//TICK(ドット囲み)
        this.m_clrColor[IDX.CLR_TBYT] = "darkorange";	//TICK BY TICK(ライン)
        //this.m_clrColor[IDX.CLR_CWC_END]    = "darkorange";	//逆ウォッチ(終点)
        this.m_clrColor[IDX.CLR_REV_POINT] = "white";      //転換点文字列

        this.m_clrColor[IDX.CLR_CROSS_STR] = "orange";	//クロスライン文字列

        /*
        this.setColorSMA('rgb(255, 128, 0)', 'rgb(33, 173, 75)', 'rgb(15, 183, 183)');
        this.setColorSMAV('rgb(255, 128, 0)', 'rgb(33, 173, 75)');
        this.setColorEMA('rgb(255, 128, 0)', 'rgb(33, 173, 75)', 'rgb(15, 183, 183)');
        this.setColorBB('rgb(235, 41, 31)', 'rgb(20, 131, 252)', 'rgb(56, 217, 38)', 'rgb(20, 131, 252)', 'rgb(235, 41, 31)');
        this.setColorICHI('rgb(15, 183, 183)', 'rgb(20, 131, 252)', 'rgb(205, 52, 52)', 'rgb(191, 233, 24)', 'rgb(235, 41, 31)' );
        this.setColorMACD('rgb(33, 173, 75)', 'rgb(15, 183, 183)');
        this.setColorSTC('rgb(33, 173, 75)', 'rgb(255, 164, 193)', 'rgb(86, 86, 235)');
        this.setColorRSIB('rgb(33, 173, 75)', 'rgb(15, 183, 183)');
        */
    }
    setColorSMA(c1, c2, c3) {
        this.m_color.SMA.c[0] = c1;
        this.m_color.SMA.c[1] = c2;
        this.m_color.SMA.c[2] = c3;
    }
    setColorSMAV(c1, c2, c3) {
        this.m_color.SMAV.c[0] = c1;
        this.m_color.SMAV.c[1] = c2;
        this.m_color.SMAV.c[2] = c3;    // ヒストグラム 
    }
    setColorEMA(c1, c2, c3) {
        this.m_color.EMA.c[0] = c1;
        this.m_color.EMA.c[1] = c2;
        this.m_color.EMA.c[2] = c3;
    }
    setColorWMA(c1, c2, c3) {
        this.m_color.WMA.c[0] = c1;
        this.m_color.WMA.c[1] = c2;
        this.m_color.WMA.c[2] = c3;
    }
    setColorSMMA(c1) {
        this.m_color.SMMA.c[0] = c1;
    }
    setColorEMMA(c1) {
        this.m_color.EMMA.c[0] = c1;
    }
    setColorBB(c1, c2, c3, c4, c5, c6, c7) {
        this.m_color.BB.c[0] = c1; // T3
        this.m_color.BB.c[1] = c2; // T2
        this.m_color.BB.c[2] = c3; // T1
        this.m_color.BB.c[3] = c4; // MA
        this.m_color.BB.c[4] = c5; // B1
        this.m_color.BB.c[5] = c6; // B2
        this.m_color.BB.c[6] = c7; // B3
    }
    setColorICHI(c1, c2, c3, c4, c5) {
        this.m_color.ICHI.c[0] = c1; // 基準
        this.m_color.ICHI.c[1] = c2; // 転換
        this.m_color.ICHI.c[2] = c3; // 先行1
        this.m_color.ICHI.c[3] = c4; // 先行2
        this.m_color.ICHI.c[4] = c5; // 遅行
    }
    setColorENV(c1, c2, c3, c4, c5, c6, c7) {
        this.m_color.ENV.c[0] = c1; // T3
        this.m_color.ENV.c[1] = c2; // T2
        this.m_color.ENV.c[2] = c3; // T1
        this.m_color.ENV.c[3] = c4; // MA
        this.m_color.ENV.c[4] = c5; // B1
        this.m_color.ENV.c[5] = c6; // B2
        this.m_color.ENV.c[6] = c7; // B3
    }
    setColorVS(c1, c2) {
        this.m_color.VS.c[0] = c1; // H
        this.m_color.VS.c[1] = c2; // L
    }
    setColorHLB(c1, c2, c3) {
        this.m_color.HLB.c[0] = c1; // H
        this.m_color.HLB.c[1] = c2; // L
        this.m_color.HLB.c[2] = c3; // M
    }
    setColorHMA(c1, c2) {
        this.m_color.HMA.c[0] = c1; // HIGH
        this.m_color.HMA.c[1] = c2; // LOW
    }
    setColorPAR(c1, c2, c3, c4) {
        this.m_color.PAR.c[0] = c1; // ストローク(陽)
        this.m_color.PAR.c[1] = c2; // ELLIPSE(陽)
        this.m_color.PAR.c[2] = c3; // ストローク(陰)
        this.m_color.PAR.c[3] = c4; // ELLIPSE(陰)
    }
    setColorVWAP(c1) {
        this.m_color.VWAP.c[0] = c1; // VWAP
    }
    setColorMACD(c1, c2, c3) {
        this.m_color.MACD.c[0] = null; // EMA1
        this.m_color.MACD.c[1] = null; // EMA2
        this.m_color.MACD.c[2] = c1;   // MACD
        this.m_color.MACD.c[3] = c2;   // MACDS
        this.m_color.MACD.c[4] = c3; // OSCI
    }
    setColorSTC(c1, c2) {
        this.m_color.STC.c[0] = c1; // %K
        this.m_color.STC.c[1] = c2; // %D
    }
    setColorSSTC(c1, c2) {
        this.m_color.SSTC.c[0] = c1; // %D
        this.m_color.SSTC.c[1] = c2; // %SD
    }
    setColorMOM(c1, c2, c3, c4) {
        this.m_color.MOM.c[0] = c1; // MOM1
        this.m_color.MOM.c[1] = c2; // MOM2
        this.m_color.MOM.c[2] = c3; // MOM_MA1
        this.m_color.MOM.c[3] = c4; // MOM_MA2
    }
    setColorRSIA(c1, c2) {
        this.m_color.RSIA.c[0] = c1;
        this.m_color.RSIA.c[1] = c2;
    }
    setColorRSIB(c1, c2) {
        this.m_color.RSIB.c[0] = c1;
        this.m_color.RSIB.c[1] = c2;
    }
    setColorRCI(c1, c2) {
        this.m_color.RCI.c[0] = c1;
        this.m_color.RCI.c[1] = c2;
    }
    setColorWR(c1) {
        this.m_color.WR.c[0] = c1;
    }
    setColorPL(c1) {
        this.m_color.PL.c[0] = c1;
    }
    setColorDMA(c1, c2, c3) {
        this.m_color.DMA.c[0] = c1; // SMA1
        this.m_color.DMA.c[1] = c2; // SMA2
        this.m_color.DMA.c[2] = c3; // SMA3
    }
    setColorUO(c1) {
        this.m_color.UO.c[0] = c1;
    }
    setColorATR(c1) {
        this.m_color.ATR.c[0] = c1;
    }
    setColorROC(c1, c2) {
        this.m_color.ROC.c[0] = c1;
        this.m_color.ROC.c[1] = c2;
    }
    setColorSWR(c1, c2) {
        this.m_color.SWR.c[0] = c1;
        this.m_color.SWR.c[1] = c2;
    }
    setColorARN(c1, c2) {
        this.m_color.ARN.c[0] = c1;  // UP
        this.m_color.ARN.c[1] = c2;  // DOWN
    }
    setColorARO(c1) {
        this.m_color.ARO.c[0] = c1;
    }
    setColorCCI(c1) {
        this.m_color.CCI.c[0] = c1;
    }
    setColorSNR(c1) {
        this.m_color.SNR.c[0] = c1;
    }
    setColorDPO(c1) {
        this.m_color.DPO.c[0] = c1;
    }
    setColorSD(c1) {
        this.m_color.SD.c[0] = c1;
    }
    setColorSDV(c1) {
        this.m_color.SDV.c[0] = c1;
    }
    setColorHV(c1) {
        this.m_color.HV.c[0] = c1;
    }
    setColorVRA(c1, c2) {
        this.m_color.VRA.c[0] = c1;
        this.m_color.VRA.c[1] = c2;
    }
    setColorVRB(c1, c2) {
        this.m_color.VRB.c[0] = c1;
        this.m_color.VRB.c[1] = c2;
    }
    setColorDMI(c1, c2, c3, c4) {
        this.m_color.DMI.c[0] = c1; // PDI
        this.m_color.DMI.c[1] = c2; // MDI
        this.m_color.DMI.c[2] = c3; // ADX
        this.m_color.DMI.c[3] = c4; // ADXR
    }
    setColorOBV(c1) {
        this.m_color.OBV.c[0] = c1;
    }
    setColorRTA(c1) {
        this.m_color.RTA.c[0] = c1;
    }
    setColorMGN(c1, c2) {
        this.m_color.MGN.c[0] = c1;
        this.m_color.MGN.c[1] = c2;
    }
    setColorPVT(c1, c2, c3, c4, c5) {
        this.m_color.PVT.c[0] = c1; // PVT
        this.m_color.PVT.c[1] = c2; // SPT1
        this.m_color.PVT.c[2] = c3; // RST1
        this.m_color.PVT.c[3] = c4; // SPT2
        this.m_color.PVT.c[4] = c5; // RST2
    }
    setColorLRT(c1, c2, c3, c4, c5) {
        this.m_color.LRT.c[0] = c1; // T2
        this.m_color.LRT.c[1] = c2; // T1
        this.m_color.LRT.c[2] = c3; // FIT
        this.m_color.LRT.c[3] = c4; // B1
        this.m_color.LRT.c[4] = c5; // B2
    }
    setColorCWC(c1) {
        this.m_color.CWC.c[0] = c1;
    }
    setColorTBRK(c1, c2) {
        this.m_color.TBRK.c[0] = c1;
        this.m_color.TBRK.c[1] = c2;
    }
    setColorTKAGI(c1) {
        this.m_color.TKAGI.c[0] = c1;
    }
    setColorBRK(c1, c2) {
        this.m_color.BRK.c[0] = c1;
        this.m_color.BRK.c[1] = c2;
    }
    setColorKAGI(c1, c2) {
        this.m_color.KAGI.c[0] = c1;
        this.m_color.KAGI.c[1] = c2;
    }
    setColorPF(c1, c2) {
        this.m_color.PF.c[0] = c1;
        this.m_color.PF.c[1] = c2;
    }
}

