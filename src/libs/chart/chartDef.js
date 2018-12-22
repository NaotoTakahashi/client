export const DEC_DIGIT = 100;
export const CHART_AREA_MARGIN_LEFT = 58;
//export const CHART_AREA_MARGIN_RIGHT_FIXED = 150
export const CHART_AREA_MARGIN_RIGHT = 58;
//export const CHART_CONTROL_AREA_HEIGHT = 30
export const SLIDE_BAR_HEIGHT = 27
export const FRAME_HEIGHT = 3

export const SCALE_SIDE_RIGHT = 0
export const SCALE_SIDE_LEFT = 1

export const INDEX_NO_VALUE  = -999999999;
export const MAX_MAIN_SPLIT  = 10;

export const BK_LINE_LAST= 255;
export const BK_LINE_MAX = 256;

export const SECTYPE_STK		= 0;
export const SECTYPE_FUT		= 1;
export const SECTYPE_IND		= 2;

//CHART TYPE
export const CHART_MAIN_CANDLE = 1;
export const CHART_MAIN_BREAK  = 2;
export const CHART_MAIN_KAGI   = 3;
export const CHART_MAIN_TICK   = 4;
export const CHART_MAIN_TBYT   = 5;
export const CHART_MAIN_PF     = 6;
export const CHART_MAIN_CWC    = 7;
export const CHART_SUB         = 8;

//CHART STYLE
export const STYLE_CANDLE    = 1;	// ローソク足
export const STYLE_LINE      = 2;	// ライン足
export const STYLE_POLLY_LINE= 3;	// ライン足(塗り潰し)
export const STYLE_BAR_FULL  = 4;	// バー：４本値
export const STYLE_BAR       = 5;	// バー：３本値（始値省略）
export const STYLE_BREAK     = 6; 	// 新値足
export const STYLE_KAGI      = 7; 	// カギ足
export const STYLE_TICK      = 8; 	// TICK

//CHART OBJECT STATUS
export const INIT           = 0;
export const FIXED          = 1;
export const REAL           = 2;
export const PROCESSED      = 3;

//CHART_VOLUME SCALE RANGE
export const CHART_VOLUME_RANGE		= 5;
export const CHART_VOLUME_RANGE_10	= 10;

//CHART_ARGUMENT
export const CHART_VERTICAL		= true;	    //縦軸
export const CHART_HORIZONTAL	= false;	//横軸

//CHART_DISPLAY_MODE
export const CHART_DMODE_NML   = 0;	//標準
export const CHART_DMODE_LOG   = 1;	//対数
export const CHART_DMODE_REV   = 2;	//反転

//CHART DATA TYPE
//DO NOT CHANGE TYPE ORDER
export const CHART_DATA_YEAR   = -1;
export const CHART_DATA_MONTH  = 0;
export const CHART_DATA_WEEK   = 1;
export const CHART_DATA_DAY    = 2;
export const CHART_DATA_MIN    = 3;
export const CHART_DATA_TICK   = 4;
//(RELATION ABOVE) 
export const CHART_DATA_MAX    = 5;

//CHART EVENT
export const CHART_EVENT_DATA_UPDATE		 = 1;
export const CHART_EVENT_REAL_UPDATE		 = 2;
export const CHART_EVENT_FIXED_AREA_HIDE = 29;
export const CHART_EVENT_SIZE_CHANGE		= 30;
export const CHART_EVENT_ALL_DISP		= 31;
export const CHART_EVENT_LOUPE_DISP		= 32;
export const CHART_EVENT_DISPMODE_CHANGE	= 33;
export const CHART_EVENT_REV_DISP		= 34;
export const CHART_EVENT_REVERSE_POINT	= 35;
export const CHART_EVENT_PRICE_VOL		= 36;
export const CHART_EVENT_PARAM_CHANGE	= 37;
export const CHART_EVENT_TOOL_CLEAR		= 50;
export const CHART_EVENT_TRENDLINE		= 51;
export const CHART_EVENT_RETRACE			= 52;
//TEST用イベント(一時使用)
export const CHART_EVENT_PARAM_CHANGE_TEST = 99;

//CHART TYPE
export const CHART_TYPE_CANDLE = 0;
export const CHART_TYPE_BREAK  = 1;
export const CHART_TYPE_KAGI   = 2;
export const CHART_TYPE_TICK   = 3;
export const CHART_TYPE_MAX    = 4;


//CHART MAIN GRAPHY TYPE
export const NONE    = -1;
export const SMA     = 0;
export const EMA     = 1;
export const WMA     = 2;
export const BB      = 3;
export const ENV     = 4;
export const PVT     = 5;
export const ICHI    = 6;
export const PAR     = 7;
export const VS      = 8;
export const HLB     = 9;
export const LRT     = 10;
export const HMA     = 11;
export const TBRK    = 12;
export const TKAGI   = 13;
export const SMMA    = 14;
export const EMMA    = 15;
export const VWAP    = 16;
export const DRAW_GR_MAX = 17;

//CHART INDEX TYPE
export const CHART_INDEX      = 0;
export const CHART_INDEX_SMA  = 1;
export const CHART_INDEX_EMA  = 2;
export const CHART_INDEX_WMA  = 3;
export const CHART_INDEX_BB   = 4;
export const CHART_INDEX_PAR  = 5;
export const CHART_INDEX_HMA  = 6;
export const CHART_INDEX_ENV  = 7;
export const CHART_INDEX_HLB  = 8;
export const CHART_INDEX_ICHI = 9;
export const CHART_INDEX_PVT  = 10;
export const CHART_INDEX_BREAK= 11;
export const CHART_INDEX_KAGI = 12;
export const CHART_INDEX_PVOL = 13;
export const CHART_INDEX_SMAV = 14;
export const CHART_INDEX_MACD = 15;
export const CHART_INDEX_STC  = 16;
export const CHART_INDEX_SSTC = 17;
export const CHART_INDEX_PL   = 18;
export const CHART_INDEX_MOM  = 19;
export const CHART_INDEX_WR   = 20;
export const CHART_INDEX_DMA  = 21;
export const CHART_INDEX_RSIA = 22;
export const CHART_INDEX_RSIB = 23;
export const CHART_INDEX_RCI  = 24;
export const CHART_INDEX_DMI  = 25;
export const CHART_INDEX_VRA  = 26;
export const CHART_INDEX_VRB  = 27;
export const CHART_INDEX_UO   = 28;
export const CHART_INDEX_ATR  = 29;
export const CHART_INDEX_ROC  = 30;
export const CHART_INDEX_SWR  = 31;
export const CHART_INDEX_ARN  = 32;
export const CHART_INDEX_ARO  = 33;
export const CHART_INDEX_CCI  = 34;
export const CHART_INDEX_SNR  = 35;
export const CHART_INDEX_DPO  = 36;
export const CHART_INDEX_SD   = 37;
export const CHART_INDEX_SDV  = 38;
export const CHART_INDEX_HV   = 39;
export const CHART_INDEX_OBV  = 40;
export const CHART_INDEX_RTA  = 41;
export const CHART_INDEX_MGN  = 42;
export const CHART_INDEX_CWC  = 43;

// 後で上に持ってく
export const CHART_INDEX_VS  = 44;
export const CHART_INDEX_LRT = 45;
export const CHART_INDEX_TBRK = 46;
export const CHART_INDEX_TKAGI = 47;
export const CHART_INDEX_SMMA = 48;
export const CHART_INDEX_EMMA = 49;
export const CHART_INDEX_VWAP = 50;

export const CHART_INDEX_ALL  = 51;

//CHART TECHNICAL TOOL
export const TECH_TOOL_UNSET = -1;
export const TECH_TOOL_TREND = 0;
export const TECH_TOOL_RETRACE = 1;
export const TECH_TOOL_RETRACE_5 = 2;
export const TECH_TOOL_COUNTER = 3;
export const TECH_TOOL_PENTAGON = 4;
export const TECH_TOOL_FIBOFAN = 5;
export const TECH_TOOL_FIBOARC = 6;
export const TECH_TOOL_FIBOCIRCLE = 7;
export const TECH_TOOL_FIBOCHANNEL = 8;
export const TECH_TOOL_FIBOTIME = 9;
export const TECH_TOOL_GANFAN = 10;
export const TECH_TOOL_GANANGLE = 11;
export const TECH_TOOL_GANBOX = 12;
export const TECH_TOOL_PITCH_FORK = 13;
export const TECH_TOOL_PITCH_FORK_EX = 14;
export const TECH_TOOL_MAX = 15;

//CHART COMMAND STATUS
export const CMD_STAT_CROSS      = 0;
export const CMD_STAT_SIZE_UP    = 1;
export const CMD_STAT_SIZE_DN    = 2;
export const CMD_STAT_ALL_DISP   = 3;
export const CMD_STAT_LOUPE_DISP = 4;
export const CMD_STAT_LOG_DISP   = 5;
export const CMD_STAT_REV_DISP   = 6;
export const CMD_STAT_CLOSE_DISP = 7;
export const CMD_STAT_REV_POINT  = 8;
export const CMD_STAT_PRICE_VOL  = 9;
export const CMD_STAT_RETRACE    = 10;
export const CMD_STAT_TREND      = 11;
export const CMD_STAT_CLEAR      = 12;
export const CMD_STAT_HIDE       = 13;
export const CMD_STAT_MAX        = 14;

export const CLR_SPLIT = 0;		    //スプリットライン
export const CLR_SCALE = 1;		    //スケールライン
export const CLR_SCALE_DOT = 2;	    //スケールライン(点線)
export const CLR_SCALE_DATE = 3;	//スケールライン(日付変更線)
export const CLR_SCALE_UNIT = 4;	//スケール目盛部分
export const CLR_SCROLL_STR = 5;	//スクロールスケール文字列
export const CLR_SCROLL_POLY = 6;   //スクロール背景グラフ
export const CLR_SCROLL = 7;        //スクロール選択範囲
export const CLR_SELL = 8;		    //チャート(陽)
export const CLR_BUY = 9;		    //チャート(陰)
export const CLR_NO_VALUE_1 = 10;	//(欠番)
export const CLR_CLOSE_LINE = 11;	//終値ライン足
export const CLR_LAST_CLOSE = 12;	//前日終値線
export const CLR_PRICE_VOL = 13;	//値段別売買高 & 日柄カウンター(縁)
export const CLR_TRENDLINE = 14;	//トレンドライン
export const CLR_RETRACE_3 = 15;	//リトレースメント(3本)
export const CLR_RETRACE_5 = 16;	//リトレースメント(5本)
export const CLR_COUNTER = 17;		//日柄カウンター
export const CLR_DRAWING = 18;		//描画ツール中線(点線)
export const CLR_SELECTED = 19;		//描画ツール選択状態
export const CLR_ICHI_T = 20;		//一目均衡表(時間論・基本数値)
export const CLR_FINA_Z = 21;		//フィボナッチ(ザラバ)
export const CLR_FINA_C = 22;		//フィボナッチ(終値)
export const CLR_FINA_R = 23;		//フィボナッチ(基調転換)
export const CLR_COUNTER_VT = 24;	//日柄カウンター(縦)
export const CLR_PENTA = 25;		//ペンタゴン
export const CLR_PENTA_SEL = 26;	//ペンタゴン(選択)
export const CLR_TICK = 27;			//TICK(ドット囲み)
export const CLR_TBYT = 28;			//TICK BY TICK(ライン)
export const CLR_CWC_END = 29;		//逆ウォッチ(終点)
export const CLR_REV_POINT = 30;    //転換点文字列
export const CLR_CROSS_STR = 31;	//クロスライン文字列
export const CLR_MAX = 32;

export const IV_SMA1     = 0;   //単純移動平均線[1]
export const IV_SMA2     = 1; 	//単純移動平均線[2]
export const IV_SMA3     = 2; 	//単純移動平均線[3]
export const IV_SMAV1    = 3; 	//出来高移動平均線[1]
export const IV_SMAV2    = 4; 	//出来高移動平均線[2]
export const IV_EMA1     = 5; 	//指数平滑移動平均線[1]
export const IV_EMA2     = 6; 	//指数平滑移動平均線[2]
export const IV_EMA3     = 7; 	//指数平滑移動平均線[3]
export const IV_WMA1     = 8; 	//加重移動平均線[1]
export const IV_WMA2     = 9; 	//加重移動平均線[2]
export const IV_WMA3     = 10; 	//加重移動平均線[3]
export const IV_BB_T3    = 11; 	//ボリンジャーバンド[+2σ]
export const IV_BB_T2    = 12; 	//ボリンジャーバンド[+2σ]
export const IV_BB_T1    = 13; 	//ボリンジャーバンド[+1σ] 
export const IV_BB_MA    = 14; 	//ボリンジャーバンド[SMA]
export const IV_BB_B1    = 15; 	//ボリンジャーバンド[-1σ] 
export const IV_BB_B2    = 16; 	//ボリンジャーバンド[-2σ]
export const IV_BB_B3    = 17; 	//ボリンジャーバンド[-2σ]
export const IV_ICHI_BASE = 18; //一目均衡表[基準線]
export const IV_ICHI_DIVE = 19; //一目均衡表[転換線]
export const IV_ICHI_BACK = 20; //一目均衡表[遅行スパン]
export const IV_ICHI_FWD1 = 21; //一目均衡表[先行スパン1]
export const IV_ICHI_FWD2 = 22; //一目均衡表[先行スパン1]
export const IV_ENV_T3   = 23; 	//移動平均エンベロープ[+3.0%]
export const IV_ENV_T2   = 24; 	//移動平均エンベロープ[+2.0%]
export const IV_ENV_T1   = 25; 	//移動平均エンベロープ[+1.0%] 
export const IV_ENV_MA   = 26; 	//移動平均エンベロープ[SMA]
export const IV_ENV_B1   = 27; 	//移動平均エンベロープ[-1.0%]  
export const IV_ENV_B2   = 28; 	//移動平均エンベロープ[-2.0%]
export const IV_ENV_B3   = 29; 	//移動平均エンベロープ[-3.0%]
export const IV_MACD_EMA1 = 30; //MACD指数平滑移動平均線[1]
export const IV_MACD_EMA2 = 31; //MACD指数平滑移動平均線[2]
export const IV_MACD_MACD = 32; //MACD
export const IV_MACD_MACDS= 33; //MACDS
export const IV_MACD_OSCI = 34; //MACD-MACDS
export const IV_STC_K   = 35;   //ストキャスティクス[%K]
export const IV_STC_D   = 36;   //ストキャスティクス[%D]
export const IV_STC_SD  = 37;   //ストキャスティクス[%SD]
export const IV_RSI_A1  = 38;   //RSI-A[1]
export const IV_RSI_A2  = 39;   //RSI-A[2]
export const IV_RSI_B1  = 40;   //RSI-B[1]
export const IV_RSI_B2  = 41;   //RSI-B[2]
export const IV_RCI_1   = 42;   //RCI[1]
export const IV_RCI_2   = 43;   //RCI[2]
export const IV_WR      = 44;   //ウィリアムズ%R
export const IV_MOM1    = 45; 	//モメンタム[1]
export const IV_MOM2    = 46; 	//モメンタム[2]
export const IV_MOM_MA1 = 47; 	//モメンタム移動平均[1]
export const IV_MOM_MA2 = 48; 	//モメンタム移動平均[2]
export const IV_PL      = 49; 	//サイコロジカルライン
export const IV_DMA_SMA1= 50;   //移動平均乖離率 単純移動平均線[1]
export const IV_DMA_SMA2= 51;   //移動平均乖離率 単純移動平均線[2]
export const IV_DMA_SMA3= 52;   //移動平均乖離率 単純移動平均線[3]
export const IV_UO      = 53;   //アルティメット・オシレータ
export const IV_ATR     = 54;	//ATR
export const IV_ROC_1   = 55;   //ROC[1]
export const IV_ROC_2   = 56;   //ROC[2]
export const IV_SWR_A   = 57;   //強弱レシオ[Aレシオ]
export const IV_SWR_B   = 58;   //強弱レシオ[Bレシオ]
export const IV_ARN_UP  = 59;	//アルーンインジケータ
export const IV_ARN_DN  = 60;	//アルーンインジケータ
export const IV_ARO     = 61;	//アルーンオシレータ
export const IV_CCI     = 62;	//商品チャンネル指数
export const IV_SNR     = 63;	//ソナー
export const IV_DPO     = 64;	//DPO
export const IV_SD      = 65; 	//標準偏差
export const IV_SDV     = 66; 	//標準偏差ボラティリティ
export const IV_HV      = 67; 	//ヒストリカルボラティリティ[期間]
export const IV_VRA_1   = 68;   //ボリュームレシオ（TypeA）
export const IV_VRA_2   = 69;   //ボリュームレシオ（TypeA）
export const IV_VRB_1   = 70;   //ボリュームレシオ（TypeB）
export const IV_VRB_2   = 71;   //ボリュームレシオ（TypeB）
export const IV_PDI     = 72;   //DMI(+DI)
export const IV_MDI     = 73;   //DMI(-DI)
export const IV_ADX     = 74;   //DMI(ADX)
export const IV_ADXR    = 75;   //DMI(ADXR)
export const IV_OBV     = 76;   //オンバランスボリューム

// 後で上に持ってく
export const IV_VS_H    = 77;   //ボラティリティシステム
export const IV_VS_L    = 78;   //ボラティリティシステム
export const IV_PAR_SAR = 79;	//パラボリック SAR
export const IV_HLB_H   = 80;   //HLバンド(高値)
export const IV_HLB_L   = 81;   //HLバンド(安値)
export const IV_HLB_M   = 82; 	//HLバンド(中値(高安平均))
export const IV_PVT     = 83;	//ピボット
export const IV_PVT_RST1= 84;	//ピボット[レジストライン1]
export const IV_PVT_RST2= 85;	//ピボット[レジストライン2]
export const IV_PVT_SPT1= 86;	//ピボット[サポートライン1]
export const IV_PVT_SPT2= 87;	//ピボット[サポートライン2]
export const IV_LRT_T2  = 88;	//回帰トレンド[+2μ]
export const IV_LRT_T1  = 89;	//回帰トレンド[+1μ] 
export const IV_LRT_FIT = 90;	//回帰トレンド[FIT]
export const IV_LRT_B1  = 91;	//回帰トレンド[-1μ] 
export const IV_LRT_B2  = 92;	//回帰トレンド[-2μ]
export const IV_HMA_H   = 93;   //単純移動平均線[高値]
export const IV_HMA_L   = 94; 	//単純移動平均線[安値]
export const IV_CWC_P   = 95;   //逆ウォッチ曲線(値段移動平均)
export const IV_CWC_V   = 96;   //逆ウォッチ曲線(出来高移動平均)
export const IV_RTA     = 97; 	//レシオケータ(基準日変動)
export const IV_MAX = 30;

export const getBgnIndexSMA = () => {
    return IV_SMA1;
}
export const getIVCountSMA = () => {
    return 3;
}
export const getBgnIndexSMAV = () => {
    return IV_SMAV1;
}
export const getIVCountSMAV = () => {
    return 2;
}
export const getBgnIndexEMA = () => {
    return IV_EMA1;
}
export const getIVCountEMA = () => {
    return 3;
}
export const getBgnIndexWMA = () => {
    return IV_WMA1;
}
export const getIVCountWMA = () => {
    return 3;
}
export const getBgnIndexBB = () => {
    return IV_BB_T3;
}
export const getIVCountBB = () => {
    return 7;
}
export const getBgnIndexICHI = () => {
    return IV_ICHI_BASE;
}
export const getIVCountICHI = () => {
    return 5;
}
export const getBgnIndexENV = () => {
    return IV_ENV_T3;
}
export const getIVCountENV = () => {
    return 7;
}
export const getBgnIndexVS = () => {
    return IV_VS_H;
}
export const getIVCountVS = () => {
    return 2;
}
export const getBgnIndexHLB = () => {
    return IV_HLB_H;
}
export const getIVCountHLB = () => {
    return 3;
}
export const getBgnIndexPAR = () => {
    return IV_PAR_SAR;
}
export const getIVCountPAR = () => {
    return 1;
}
export const getBgnIndexPVT = () => {
    return IV_PVT;
}
export const getIVCountPVT = () => {
    return 5;
}
export const getBgnIndexLRT = () => {
    return IV_LRT_T2;
}
export const getIVCountLRT = () => {
    return 5;
}
export const getBgnIndexHMA = () => {
    return IV_HMA_H;
}
export const getIVCountHMA = () => {
    return 2;
}
export const getBgnIndexMACD = () => {
    return IV_MACD_EMA1;
}
export const getIVCountMACD = () => {
    return 5;
}
export const getBgnIndexSTC = () => {
    return IV_STC_K;
}
export const getIVCountSTC = () => {
    return 2;
}
export const getBgnIndexSSTC = () => {
    return IV_STC_D;
}
export const getIVCountSSTC = () => {
    return 2;
}
export const getBgnIndexRSIA = () => {
    return IV_RSI_A1;
}
export const getIVCountRSIA = () => {
    return 2;
}
export const getBgnIndexRSIB = () => {
    return IV_RSI_B1;
}
export const getIVCountRSIB = () => {
    return 2;
}
export const getBgnIndexRCI = () => {
    return IV_RCI_1;
}
export const getIVCountRCI = () => {
    return 2;
}
export const getBgnIndexWR = () => {
    return IV_WR;
}
export const getIVCountWR = () => {
    return 1;
}
export const getBgnIndexMOM = () => {
    return IV_MOM1;
}
export const getIVCountMOM = () => {
    return 4;
}
export const getBgnIndexPL = () => {
    return IV_PL;
}
export const getIVCountPL = () => {
    return 1;
}
export const getBgnIndexDMA = () => {
    return IV_DMA_SMA1;
}
export const getIVCountDMA = () => {
    return 3;
}
export const getBgnIndexUO = () => {
    return IV_UO;
}
export const getIVCountUO = () => {
    return 1;
}
export const getBgnIndexATR = () => {
    return IV_ATR;
}
export const getIVCountATR = () => {
    return 1;
}
export const getBgnIndexROC = () => {
    return IV_ROC_1;
}
export const getIVCountROC = () => {
    return 2;
}
export const getBgnIndexSWR = () => {
    return IV_SWR_A;
}
export const getIVCountSWR = () => {
    return 2;
}
export const getBgnIndexARN = () => {
    return IV_ARN_UP;
}
export const getIVCountARN = () => {
    return 2;
}
export const getBgnIndexARO = () => {
    return IV_ARO;
}
export const getIVCountARO = () => {
    return 1;
}
export const getBgnIndexCCI = () => {
    return IV_CCI;
}
export const getIVCountCCI = () => {
    return 1;
}
export const getBgnIndexSNR = () => {
    return IV_SNR;
}
export const getIVCountSNR = () => {
    return 1;
}
export const getBgnIndexDPO = () => {
    return IV_DPO;
}
export const getIVCountDPO = () => {
    return 1;
}
export const getBgnIndexSD = () => {
    return IV_SD;
}
export const getIVCountSD = () => {
    return 1;
}
export const getBgnIndexSDV = () => {
    return IV_SDV;
}
export const getIVCountSDV = () => {
    return 1;
}
export const getBgnIndexHV = () => {
    return IV_HV;
}
export const getIVCountHV = () => {
    return 1;
}
export const getBgnIndexVRA = () => {
    return IV_VRA_1;
}
export const getIVCountVRA = () => {
    return 2;
}
export const getBgnIndexVRB = () => {
    return IV_VRB_1;
}
export const getIVCountVRB = () => {
    return 2;
}
export const getBgnIndexDMI = () => {
    return IV_PDI;
}
export const getIVCountDMI = () => {
    return 4;
}
export const getBgnIndexOBV = () => {
    return IV_OBV;
}
export const getIVCountOBV = () => {
    return 1;
}
export const getBgnIndexCWC = () => {
    return IV_CWC_P;
}
export const getIVCountCWC = () => {
    return 2;
}
export const getBgnIndexRTA = () => {
    return IV_RTA;
}
export const getIVCountRTA = () => {
    return 1;
}
