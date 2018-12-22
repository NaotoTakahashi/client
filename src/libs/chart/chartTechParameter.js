import * as CD from './chartDef';
export const PRM_SMA_1 = 0;
export const PRM_SMA_2 = 1;
export const PRM_SMA_3 = 2;
export const PRM_SMA_MAX = 3;

export const PRM_EMA_1 = 0;
export const PRM_EMA_2 = 1;
export const PRM_EMA_3 = 2;
export const PRM_EMA_MAX = 3;

export const PRM_WMA_1 = 0;
export const PRM_WMA_2 = 1;
export const PRM_WMA_3 = 2;
export const PRM_WMA_MAX = 3;

export const PRM_SMMA_1 = 0;
export const PRM_SMMA_2 = 1;
export const PRM_SMMA_3 = 2;
export const PRM_SMMA_MAX = 3;

export const PRM_SMAV_1 = 0;
export const PRM_SMAV_2 = 1;
export const PRM_SMAV_MAX = 2;

export const PRM_BB   = 0;
export const PRM_BB_1 = 1;
export const PRM_BB_2 = 2;
export const PRM_BB_3 = 3;
export const PRM_BB_MAX = 4;

export const PRM_ICHI_R = 0;
export const PRM_ICHI_B = 1;
export const PRM_ICHI_S = 2;
export const PRM_ICHI_MAX = 3;

export const PRM_ENV_SMA = 0;
export const PRM_ENV_1 = 1;
export const PRM_ENV_2 = 2;
export const PRM_ENV_3 = 3;
export const PRM_ENV_MAX = 4;

export const PRM_VS = 0;
export const PRM_VS_COF = 1;
export const PRM_VS_MAX = 2;

export const PRM_HLB = 0;
export const PRM_HLB_MAX = 1;

export const PRM_PAR_AF_INIT = 0;
export const PRM_PAR_AF_INC = 1;
export const PRM_PAR_AF_MAX = 2;
export const PRM_PAR_MAX = 3;

export const PRM_LRT = 0;
export const PRM_LRT_MAX = 1;

export const PRM_HMA = 0;
export const PRM_HMA_MAX = 1;

export const PRM_TBRK = 0;
export const PRM_TBRK_MAX = 1;

export const PRM_TKAGI = 0;
export const PRM_TKAGI_MAX = 1;

export const PRM_MAC_EAM1 = 0;
export const PRM_MAC_EAM2 = 1;
export const PRM_MAC_SIG  = 2;
export const PRM_MAC_MAX  = 3;

export const PRM_STC_K   = 0;
export const PRM_STC_D   = 1;
export const PRM_STC_SD  = 2;
export const PRM_STC_MAX = 3;

export const PRM_RSIA_1 = 0;
export const PRM_RSIA_2 = 1;
export const PRM_RSIA_MAX = 2;

export const PRM_RSIB_1 = 0;
export const PRM_RSIB_2 = 1;
export const PRM_RSIB_MAX = 2;

export const PRM_RCI_1 = 0;
export const PRM_RCI_2 = 1;
export const PRM_RCI_MAX = 2;

export const PRM_WR_1 = 0;
export const PRM_WR_MAX = 1;

export const PRM_PL_1 = 0;
export const PRM_PL_MAX = 1;

export const PRM_MOM_1 = 0;
export const PRM_MOM_2 = 1;
export const PRM_MOM_MA1 = 2;
export const PRM_MOM_MA2 = 3;
export const PRM_MOM_MAX = 4;

export const PRM_DMA_1 = 0;
export const PRM_DMA_2 = 1;
export const PRM_DMA_3 = 2;
export const PRM_DMA_MAX = 3;

export const PRM_UO_1 = 0;
export const PRM_UO_2 = 1;
export const PRM_UO_3 = 2;
export const PRM_UO_MAX = 3;

export const PRM_ATR = 0;
export const PRM_ATR_MAX = 1;

export const PRM_ROC_1 = 0;
export const PRM_ROC_2 = 1;
export const PRM_ROC_MAX = 2;

export const PRM_SWR = 0;
export const PRM_SWR_MAX = 1;

export const PRM_ARN = 0;
export const PRM_ARN_MAX = 1;

export const PRM_ARO = 0;
export const PRM_ARO_MAX = 1;

export const PRM_CCI = 0;
export const PRM_CCI_MAX = 1;

export const PRM_SNR_EMA = 0;
export const PRM_SNR_CMP = 1;
export const PRM_SNR_MAX = 2;

export const PRM_DPO_SMA = 0;
export const PRM_DPO_MAX = 1;

export const PRM_SD = 0;
export const PRM_SD_MAX = 1;

export const PRM_SDV = 0;
export const PRM_SDV_MAX = 1;

export const PRM_HV = 0;
export const PRM_HV_MAX = 1;

export const PRM_VRA_1 = 0;
export const PRM_VRA_2 = 1;
export const PRM_VRA_MAX = 2;

export const PRM_VRB_1 = 0;
export const PRM_VRB_2 = 1;
export const PRM_VRB_MAX = 2;

export const PRM_DMI = 0;     // DMI 対象期間本数
export const PRM_ADX = 1;     // ADX 対象期間本数
export const PRM_ADXR= 2;     // ADXR対象期間本数
export const PRM_DMI_MAX = 3;

export const PRM_RTA = 0;
export const PRM_RTA_MAX = 1;

export const PRM_BRK = 0;
export const PRM_BRK_MAX = 1;

export const PRM_KAGI = 0;
export const PRM_KAGI_MAX = 1;

export const PRM_PF_NUM = 0;
export const PRM_PF_RNG = 1;
export const PRM_PF_MAX = 2;

export const PRM_CWC = 0;
export const PRM_CWC_MAX = 1;


export default class ChartTechParam {
	constructor() {
        this.m_defaultParam = JSON.parse(JSON.stringify(chartDefaultParam)) 
        this.m_param = chartDefaultParam;
    }
    init() {
    }
    setParamDef(paramDef) {
        this.m_param = paramDef;
    }
    getParamDef() {
        return this.m_param;
    }
    getParamValue(dataType, techParam) {
        switch (dataType) {
            case CD.CHART_DATA_DAY:
                return techParam.D;
            case CD.CHART_DATA_WEEK:
                return techParam.W;
            case CD.CHART_DATA_MONTH:
                return techParam.M;
            case CD.CHART_DATA_MIN:
                return techParam.m;
            default:
                return [0, 0, 0];
        }
    }
    setParamValue(dataType, techParam, value) {
        switch (dataType) {
            case CD.CHART_DATA_DAY:
                techParam.D = value;
                break;
            case CD.CHART_DATA_WEEK:
                techParam.W = value;
                break;
            case CD.CHART_DATA_MONTH:
                techParam.M = value;
                break;
            case CD.CHART_DATA_MIN:
                techParam.m = value;
                break;
            default:
                return;
        }
    }

    getDefault_SMA(dataType) { return this.getParamValue(dataType, this.m_defaultParam.SMA); }
    getParam_SMA(dataType) { return this.getParamValue(dataType, this.m_param.SMA); }
    setParam_SMA(dataType, value) { this.setParamValue(dataType, this.m_param.SMA, value); }

    getDefault_EMA(dataType) { return this.getParamValue(dataType, this.m_defaultParam.EMA); }
    getParam_EMA(dataType) { return this.getParamValue(dataType, this.m_param.EMA); }
    setParam_EMA(dataType, value) { this.setParamValue(dataType, this.m_param.EMA, value); }

    getDefault_WMA(dataType) { return this.getParamValue(dataType, this.m_defaultParam.WMA); }
    getParam_WMA(dataType) { return this.getParamValue(dataType, this.m_param.WMA); }
    setParam_WMA(dataType, value) { this.setParamValue(dataType, this.m_param.WMA, value); }

    getDefault_SMMA(dataType) { return this.getParamValue(dataType, this.m_defaultParam.SMMA); }
    getParam_SMMA(dataType) { return this.getParamValue(dataType, this.m_param.SMMA); }
    setParam_SMMA(dataType, value) { this.setParamValue(dataType, this.m_param.SMMA, value); }

    getDefault_EMMA(dataType) { return this.getParamValue(dataType, this.m_defaultParam.EMMA); }
    getParam_EMMA(dataType) { return this.getParamValue(dataType, this.m_param.EMMA); }
    setParam_EMMA(dataType, value) { this.setParamValue(dataType, this.m_param.EMMA, value); }

    getDefault_BB(dataType) { return this.getParamValue(dataType, this.m_defaultParam.BB); }
    getParam_BB(dataType) { return this.getParamValue(dataType, this.m_param.BB); }
    setParam_BB(dataType, value) { this.setParamValue(dataType, this.m_param.BB, value); }

    getDefault_ENV(dataType) { return this.getParamValue(dataType, this.m_defaultParam.ENV); }
    getParam_ENV(dataType) { return this.getParamValue(dataType, this.m_param.ENV); }
    setParam_ENV(dataType, value) { this.setParamValue(dataType, this.m_param.ENV, value); }

    getDefault_ICHI(dataType) { return this.getParamValue(dataType, this.m_defaultParam.ICHI); }
    getParam_ICHI(dataType) { return this.getParamValue(dataType, this.m_param.ICHI); }
    setParam_ICHI(dataType, value) { this.setParamValue(dataType, this.m_param.ICHI, value); }

    getDefault_PAR(dataType) { return this.getParamValue(dataType, this.m_defaultParam.PAR); }
    getParam_PAR(dataType) { return this.getParamValue(dataType, this.m_param.PAR); }
    setParam_PAR(dataType, value) { this.setParamValue(dataType, this.m_param.PAR, value); }

    getDefault_VS(dataType) { return this.getParamValue(dataType, this.m_defaultParam.VS); }
    getParam_VS(dataType) { return this.getParamValue(dataType, this.m_param.VS); }
    setParam_VS(dataType, value) { this.setParamValue(dataType, this.m_param.VS, value); }

    getDefault_HLB(dataType) { return this.getParamValue(dataType, this.m_defaultParam.HLB); }
    getParam_HLB(dataType) { return this.getParamValue(dataType, this.m_param.HLB); }
    setParam_HLB(dataType, value) { this.setParamValue(dataType, this.m_param.HLB, value); }

    getDefault_HMA(dataType) { return this.getParamValue(dataType, this.m_defaultParam.HMA); }
    getParam_HMA(dataType) { return this.getParamValue(dataType, this.m_param.HMA); }
    setParam_HMA(dataType, value) { this.setParamValue(dataType, this.m_param.HMA, value); }

    getDefault_LRT(dataType) { return this.getParamValue(dataType, this.m_defaultParam.LRT); }
    getParam_LRT(dataType) { return this.getParamValue(dataType, this.m_param.LRT); }
    setParam_LRT(dataType, value) { this.setParamValue(dataType, this.m_param.LRT, value); }

    getDefault_TBRK(dataType) { return this.getParamValue(dataType, this.m_defaultParam.TBRK); }
    getParam_TBRK(dataType) { return this.getParamValue(dataType, this.m_param.TBRK); }
    setParam_TBRK(dataType, value) { this.setParamValue(dataType, this.m_param.TBRK, value); }

    getDefault_TKAGI(dataType) { return this.getParamValue(dataType, this.m_defaultParam.TKAGI); }
    getParam_TKAGI(dataType) { return this.getParamValue(dataType, this.m_param.TKAGI); }
    setParam_TKAGI(dataType, value) { this.setParamValue(dataType, this.m_param.TKAGI, value); }

    getDefault_BRK(dataType) { return this.getParamValue(dataType, this.m_defaultParam.BRK); }
    getParam_BRK(dataType) { return this.getParamValue(dataType, this.m_param.BRK); }
    setParam_BRK(dataType, value) { this.setParamValue(dataType, this.m_param.BRK, value); }

    getDefault_KAGI(dataType) { return this.getParamValue(dataType, this.m_defaultParam.KAGI); }
    getParam_KAGI(dataType) { return this.getParamValue(dataType, this.m_param.KAGI); }
    setParam_KAGI(dataType, value) { this.setParamValue(dataType, this.m_param.KAGI, value); }

    // 0の場合は価格テーブル
    getDefault_PF(dataType) { return this.getParamValue(dataType, this.m_defaultParam.PF); }
    getParam_PF(dataType) { return this.getParamValue(dataType, this.m_param.PF); }
    setParam_PF(dataType, value) { this.setParamValue(dataType, this.m_param.PF, value); }

    getDefault_CWC(dataType) { return this.getParamValue(dataType, this.m_defaultParam.CWC); }
    getParam_CWC(dataType) { return this.getParamValue(dataType, this.m_param.CWC); }
    setParam_CWC(dataType, value) { this.setParamValue(dataType, this.m_param.CWC, value); }

    getDefault_SMAV(dataType) { return this.getParamValue(dataType, this.m_defaultParam.SMAV); }
    getParam_SMAV(dataType) { return this.getParamValue(dataType, this.m_param.SMAV); }
    setParam_SMAV(dataType, value) { this.setParamValue(dataType, this.m_param.SMAV, value); }

    getDefault_MACD(dataType) { return this.getParamValue(dataType, this.m_defaultParam.MACD); }
    getParam_MACD(dataType) { return this.getParamValue(dataType, this.m_param.MACD); }
    setParam_MACD(dataType, value) { this.setParamValue(dataType, this.m_param.MACD, value); }

    getDefault_STC(dataType) { return this.getParamValue(dataType, this.m_defaultParam.STC); }
    getParam_STC(dataType) { return this.getParamValue(dataType, this.m_param.STC); }
    setParam_STC(dataType, value) { this.setParamValue(dataType, this.m_param.STC, value); }

    getDefault_SSTC(dataType) { return this.getParamValue(dataType, this.m_defaultParam.SSTC); }
    getParam_SSTC(dataType) { return this.getParamValue(dataType, this.m_param.SSTC); }
    setParam_SSTC(dataType, value) { this.setParamValue(dataType, this.m_param.SSTC, value); }

    getDefault_RSIA(dataType) { return this.getParamValue(dataType, this.m_defaultParam.RSIA); }
    getParam_RSIA(dataType) { return this.getParamValue(dataType, this.m_param.RSIA); }
    setParam_RSIA(dataType, value) { this.setParamValue(dataType, this.m_param.RSIA, value); }

    getDefault_RSIB(dataType) { return this.getParamValue(dataType, this.m_defaultParam.RSIB); }
    getParam_RSIB(dataType) { return this.getParamValue(dataType, this.m_param.RSIB); }
    setParam_RSIB(dataType, value) { this.setParamValue(dataType, this.m_param.RSIB, value); }

    getDefault_RCI(dataType) { return this.getParamValue(dataType, this.m_defaultParam.RCI); }
    getParam_RCI(dataType) { return this.getParamValue(dataType, this.m_param.RCI); }
    setParam_RCI(dataType, value) { this.setParamValue(dataType, this.m_param.RCI, value); }

    getDefault_WR(dataType) { return this.getParamValue(dataType, this.m_defaultParam.WR); }
    getParam_WR(dataType) { return this.getParamValue(dataType, this.m_param.WR); }
    setParam_WR(dataType, value) { this.setParamValue(dataType, this.m_param.WR, value); }

    getDefault_PL(dataType) { return this.getParamValue(dataType, this.m_defaultParam.PL); }
    getParam_PL(dataType) { return this.getParamValue(dataType, this.m_param.PL); }
    setParam_PL(dataType, value) { this.setParamValue(dataType, this.m_param.PL, value); }

    getDefault_MOM(dataType) { return this.getParamValue(dataType, this.m_defaultParam.MOM); }
    getParam_MOM(dataType) { return this.getParamValue(dataType, this.m_param.MOM); }
    setParam_MOM(dataType, value) { this.setParamValue(dataType, this.m_param.MOM, value); }

    getDefault_DMA(dataType) { return this.getParamValue(dataType, this.m_defaultParam.DMA); }
    getParam_DMA(dataType) { return this.getParamValue(dataType, this.m_param.DMA); }
    setParam_DMA(dataType, value) { this.setParamValue(dataType, this.m_param.DMA, value); }

    getDefault_UO(dataType) { return this.getParamValue(dataType, this.m_defaultParam.UO); }
    getParam_UO(dataType) { return this.getParamValue(dataType, this.m_param.UO); }
    setParam_UO(dataType, value) { this.setParamValue(dataType, this.m_param.UO, value); }

    getDefault_ATR(dataType) { return this.getParamValue(dataType, this.m_defaultParam.ATR); }
    getParam_ATR(dataType) { return this.getParamValue(dataType, this.m_param.ATR); }
    setParam_ATR(dataType, value) { this.setParamValue(dataType, this.m_param.ATR, value); }

    getDefault_ROC(dataType) { return this.getParamValue(dataType, this.m_defaultParam.ROC); }
    getParam_ROC(dataType) { return this.getParamValue(dataType, this.m_param.ROC); }
    setParam_ROC(dataType, value) { this.setParamValue(dataType, this.m_param.ROC, value); }

    getDefault_SWR(dataType) { return this.getParamValue(dataType, this.m_defaultParam.SWR); }
    getParam_SWR(dataType) { return this.getParamValue(dataType, this.m_param.SWR); }
    setParam_SWR(dataType, value) { this.setParamValue(dataType, this.m_param.SWR, value); }

    getDefault_ARN(dataType) { return this.getParamValue(dataType, this.m_defaultParam.ARN); }
    getParam_ARN(dataType) { return this.getParamValue(dataType, this.m_param.ARN); }
    setParam_ARN(dataType, value) { this.setParamValue(dataType, this.m_param.ARN, value); }

    getDefault_ARO(dataType) { return this.getParamValue(dataType, this.m_defaultParam.ARO); }
    getParam_ARO(dataType) { return this.getParamValue(dataType, this.m_param.ARO); }
    setParam_ARO(dataType, value) { this.setParamValue(dataType, this.m_param.ARO, value); }

    getDefault_CCI(dataType) { return this.getParamValue(dataType, this.m_defaultParam.CCI); }
    getParam_CCI(dataType) { return this.getParamValue(dataType, this.m_param.CCI); }
    setParam_CCI(dataType, value) { this.setParamValue(dataType, this.m_param.CCI, value); }

    getDefault_SNR(dataType) { return this.getParamValue(dataType, this.m_defaultParam.SNR); }
    getParam_SNR(dataType) { return this.getParamValue(dataType, this.m_param.SNR); }
    setParam_SNR(dataType, value) { this.setParamValue(dataType, this.m_param.SNR, value); }
    
    getDefault_DPO(dataType) { return this.getParamValue(dataType, this.m_defaultParam.DPO); }
    getParam_DPO(dataType) { return this.getParamValue(dataType, this.m_param.DPO); }
    setParam_DPO(dataType, value) { this.setParamValue(dataType, this.m_param.DPO, value); }

    getDefault_SD(dataType) { return this.getParamValue(dataType, this.m_defaultParam.SD); }
    getParam_SD(dataType) { return this.getParamValue(dataType, this.m_param.SD); }
    setParam_SD(dataType, value) { this.setParamValue(dataType, this.m_param.SD, value); }

    getDefault_SDV(dataType) { return this.getParamValue(dataType, this.m_defaultParam.SDV); }
    getParam_SDV(dataType) { return this.getParamValue(dataType, this.m_param.SDV); }
    setParam_SDV(dataType, value) { this.setParamValue(dataType, this.m_param.SDV, value); }

    getDefault_HV(dataType) { return this.getParamValue(dataType, this.m_defaultParam.HV); }
    getParam_HV(dataType) { return this.getParamValue(dataType, this.m_param.HV); }
    setParam_HV(dataType, value) { this.setParamValue(dataType, this.m_param.HV, value); }

    getDefault_VRA(dataType) { return this.getParamValue(dataType, this.m_defaultParam.VRA); }
    getParam_VRA(dataType) { return this.getParamValue(dataType, this.m_param.VRA); }
    setParam_VRA(dataType, value) { this.setParamValue(dataType, this.m_param.VRA, value); }

    getDefault_VRB(dataType) { return this.getParamValue(dataType, this.m_defaultParam.VRB); }
    getParam_VRB(dataType) { return this.getParamValue(dataType, this.m_param.VRB); }
    setParam_VRB(dataType, value) { this.setParamValue(dataType, this.m_param.VRB, value); }

    getDefault_DMI(dataType) { return this.getParamValue(dataType, this.m_defaultParam.DMI); }
    getParam_DMI(dataType) { return this.getParamValue(dataType, this.m_param.DMI); }
    setParam_DMI(dataType, value) { this.setParamValue(dataType, this.m_param.DMI, value); }

    getDefault_RTA(dataType) { return this.getParamValue(dataType, this.m_defaultParam.RTA); }
    getParam_RTA(dataType) { return this.getParamValue(dataType, this.m_param.RTA); }
    setParam_RTA(dataType, value) { this.setParamValue(dataType, this.m_param.RTA, value); }

}
const chartDefaultParam = {
    "SMA": {
        "min": 0,
        "max": 200,
        "n": 3,
        "m" : [5, 25, 75],
        "D" : [5, 25, 75],
        "W" : [5, 25, 75],
        "M" : [13, 26, 39],
    },
    "EMA": {
        "n": 3,
        "m" : [12, 26, 75],
        "D" : [12, 26, 75],
        "W" : [12, 26, 75],
        "M" : [12, 26, 75],
    },
    "WMA": {
        "n": 3,
        "m" : [12, 26, 75],
        "D" : [12, 26, 75],
        "W" : [12, 26, 75],
        "M" : [12, 26, 75],
    },
    "SMMA": {
        "n": 3,
        "m" : [5, 2, 10],
        "D" : [5, 2, 10],
        "W" : [5, 2, 10],
        "M" : [5, 2, 10],
    },
    "EMMA": {
        "n": 3,
        "m" : [5, 2, 10],
        "D" : [5, 2, 10],
        "W" : [5, 2, 10],
        "M" : [5, 2, 10],
    },
    "BB": {
        "n": 4,
        "m" : [25, 10, 20, 30],
        "D" : [25, 10, 20, 30],
        "W" : [25, 10, 20, 30],
        "M" : [25, 10, 20, 30],
    },
    "ENV": {
        "n": 4,
        "m" : [25, 2, 4, 6],
        "D" : [25, 10, 20, 30],
        "W" : [25, 10, 20, 30],
        "M" : [25, 10, 20, 30],
    },
    "ICHI": {
        "n": 3,
        "m" : [9, 26, 52],
        "D" : [9, 26, 52],
        "W" : [9, 26, 52],
        "M" : [9, 26, 52],
    },
    "PAR": {
        "n": 3,
        "m" : [20, 20, 200],
        "D" : [20, 20, 200],
        "W" : [20, 20, 200],
        "M" : [20, 20, 200],
    },
    "VS": {
        "n": 2,
        "m" : [5, 20],
        "D" : [5, 20],
        "W" : [5, 20],
        "M" : [5, 20],
    },
    "HLB": {
        "n": 1,
        "m" : [20],
        "D" : [20],
        "W" : [20],
        "M" : [20],
    },
    "HMA": {
        "n": 1,
        "m" : [20],
        "D" : [20],
        "W" : [20],
        "M" : [20],
    },
    "LRT": {
        "n": 1,
        "m" : [12],
        "D" : [75],
        "W" : [75],
        "M" : [75],
    },
    "TKAGI": {
        "n": 1,
        "m" : [50],
        "D" : [200],
        "W" : [200],
        "M" : [200],
    },
    "TBRK": {
        "n": 1,
        "m" : [3],
        "D" : [3],
        "W" : [3],
        "M" : [3],
    },
    "KAGI": {
        "n": 1,
        "m" : [50],
        "D" : [200],
        "W" : [200],
        "M" : [200],
    },
    "BRK": {
        "n": 1,
        "m" : [3],
        "D" : [3],
        "W" : [3],
        "M" : [3],
    },
    "PF": {
        "n": 2,
        "m" : [3,5],
        "D" : [3,0],
        "W" : [3,10],
        "M" : [3,10],
    },
    "CWC": {
        "n": 1,
        "m" : [25],
        "D" : [25],
        "W" : [25],
        "M" : [25],
    },
    "SMAV": {
        "n": 2,
        "m" : [5, 25],
        "D" : [5, 25],
        "W" : [5, 25],
        "M" : [5, 25],
        "min": 1,
        "max": 200,
    },
    "MACD": {
        "n": 3,
        "m" : [12, 26, 9],
        "D" : [12, 26, 9],
        "W" : [12, 26, 9],
        "M" : [12, 26, 9],
    },
    "STC": {
        "n": 3,
        "m" : [9, 3, 3],
        "D" : [5, 3, 3],
        "W" : [5, 3, 3],
        "M" : [5, 3, 3],
    },
    "SSTC": {
        "n": 3,
        "m" : [9, 3, 3],
        "D" : [5, 3, 3],
        "W" : [5, 3, 3],
        "M" : [5, 3, 3],
    },
    "RSIA": {
        "n": 2,
        "m" : [9, 14],
        "D" : [9, 14],
        "W" : [9, 14],
        "M" : [9, 14],
    },
    "RSIB": {
        "n": 2,
        "m" : [9, 14],
        "D" : [9, 14],
        "W" : [9, 14],
        "M" : [9, 14],
    },
    "RCI": {
        "n": 2,
        "m" : [9, 12],
        "D" : [9, 12],
        "W" : [9, 12],
        "M" : [9, 12],
    },
    "WR": {
        "n": 1,
        "m" : [14],
        "D" : [14],
        "W" : [14],
        "M" : [14],
    },
    "PL": {
        "n": 1,
        "m" : [12],
        "D" : [12],
        "W" : [12],
        "M" : [12],
    },
    "MOM": {
        "n": 4,
        "m" : [5, 10, 3, 6],
        "D" : [5, 10, 3, 6],
        "W" : [5, 10, 3, 6],
        "M" : [5, 10, 3, 6],
    },
    "DMA": {
        "n": 3,
        "m" : [5, 25, 75],
        "D" : [5, 25, 75],
        "W" : [5, 25, 75],
        "M" : [5, 25, 75],
    },
    "UO": {
        "n": 3,
        "m" : [7, 14, 28],
        "D" : [7, 14, 28],
        "W" : [7, 14, 28],
        "M" : [7, 14, 28],
    }, 
    "ATR": {
        "n": 1,
        "m" : [14],
        "D" : [14],
        "W" : [14],
        "M" : [14],
    }, 
    "ROC": {
        "n": 2,
        "m" : [5, 20],
        "D" : [5, 20],
        "W" : [5, 20],
        "M" : [5, 20],
    }, 
    "SWR": {
        "n": 1,
        "m" : [26],
        "D" : [26],
        "W" : [26],
        "M" : [26],
    }, 
    "ARN": {
        "n": 1,
        "m" : [14],
        "D" : [14],
        "W" : [14],
        "M" : [14],
    }, 
    "ARO": {
        "n": 1,
        "m" : [14],
        "D" : [14],
        "W" : [14],
        "M" : [14],
    }, 
    "CCI": {
        "n": 1,
        "m" : [14],
        "D" : [14],
        "W" : [14],
        "M" : [14],
    }, 
    "SNR": {
        "n": 2,
        "m" : [10, 10],
        "D" : [10, 10],
        "W" : [10, 10],
        "M" : [10, 10],
    }, 
    "DPO": {
        "n": 2,
        "m" : [10, 10],
        "D" : [10, 10],
        "W" : [10, 10],
        "M" : [10, 10],
    }, 
    "SD": {
        "n": 1,
        "m" : [10],
        "D" : [10],
        "W" : [10],
        "M" : [10],
    }, 
    "SDV": {
        "n": 1,
        "m" : [25],
        "D" : [25],
        "W" : [25],
        "M" : [25],
    }, 
    "HV": {
        "n": 1,
        "m" : [20],
        "D" : [20],
        "W" : [20],
        "M" : [20],
    }, 
    "VRA": {
        "n": 2,
        "m" : [3, 12],
        "D" : [3, 12],
        "W" : [3, 12],
        "M" : [3, 12],
    }, 
    "VRB": {
        "n": 2,
        "m" : [12, 25],
        "D" : [12, 25],
        "W" : [12, 25],
        "M" : [12, 25],
    }, 
    "DMI": {
        "n": 3,
        "m" : [14, 9, 14],
        "D" : [14, 9, 14],
        "W" : [14, 9, 14],
        "M" : [14, 9, 14],
    }, 
    "RTA": {
        "n": 1,
        "m" : [25],
        "D" : [25],
        "W" : [25],
        "M" : [25],
    },
};
