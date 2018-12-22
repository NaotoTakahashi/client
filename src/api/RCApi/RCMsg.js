import { CO_BoardDepth, CO_PriceDetail, CO_BoardData, CO_BoardReal, CO_OfferedPriceData } from "../Common/CO_Board";
import { feedKeyToCode, boardCodeToKey, boardKeyToCode} from "./RCApi";
import { CO_FeedRecord } from "../Common/CO_Feed";
//-----------------------------------------------------------------------------
//						RICH Client Message module
//									Copyright IMPULSE Crop. All right reserved.
//
//						RCMsg.h							     Create	 2014.03.01
//-----------------------------------------------------------------------------
// パース時のエラーステータス
const RCMsgParseErrorNum = 
{
	"MSG_LENGTH" : -1,								// 電文長エラー
	"MSG_TYPE" : -2,								// 電文種別エラー
	"DATA_LENGTH" : -3,								// データ長エラー
	"DATA_COUNT" : -4,								// データ個数
	"DATA_TYPE" : -5,								// データ種別コード
	"DATA_DATEIL" : -6								// データ種別詳細コード
};

	
const RCMsgType = 
{
	UNKOWN_TYPE : 0,
	OPEN_REQUEST : 1,								// 開始要求電文
	OPEN_ACK : 2,									// 開始応答電文
	LOGIN_REQUEST : 3,								// ログイン要求電文
	LOGIN_ACK : 4,									// ログイン応答電文
	LOGOUT_REQUEST : 5,								// ログアウト要求電文
	LOGOUT_ACK : 6,									// ログアウト応答電文
	READY : 7,										// 準備完了電文
	COMMUNICATION_LEVEL : 8,						// 通信状態レベル
	DATE_ZYOUHOU : 10,								// 日付情報
	MSG_TABLE : 11,									// メッセージテーブル
	YOBINE : 12,									// 呼値
	UNYOU_STATUS : 13,								// 運用ステータス別状態
	UNYOU_STATUS_KABU : 14,							// 運用ステータス（株式）
	UNYOU_STATUS_HASEI : 15,						// 運用運用ステータス（派生）
	ISSUE_MST_KABU : 20,							// 株式銘柄マスタ
	ISSUE_SIZYOU_MST_KABU : 21,						// 株式銘柄市場マスタ
	ISSUE_SIZYOU_KISEI_KABU : 22,					// 株式銘柄別・市場別規制
	ISSUE_MST_SAK : 30,								// 先物銘柄マスタ
	ISSUE_MST_OP : 31,								// オプション銘柄マスタ
	ISSUE_SIZYOU_KISEI_HASEI : 32,					// 派生銘柄別・市場別規制
	KABU_SUMMARY : 40,								// 株式サマリ
	KABU_MEISAI : 41,								// 株式明細
	KABU_YAKUZYOU_SIKKOU : 42,						// 株式約定失効
	KABU_ORDER_YAKUZYOU_RIREKI : 43,				// 株式注文約定履歴
	HOKAN_KOKYAKU_KAZEI : 44,						// 保管顧客課税別
	SINYOU_TATEGYOKU_MEISAI : 45,					// 信用建玉明細
	KABU_HENSAI_YOYAKU : 46,						// 株式返済予約
	KABU_HENSAI_MEISAI : 47,						// 株式返済明細
	KABU_HENSAI_DATA : 48,							// 株式新規注文用返済データ		
	KABU_NEW_ORDER : 49,							// 株式新規注文　
	KABU_CORRECT_ORDER : 50,						// 株式訂正注文　
	KABU_CANCEL_ORDER : 51,							// 株式取消注文　　
	KABU_PRE_ORDER : 52,							// 株式PRE注文
	HASEI_SUMMARY : 60,								// 派生サマリ
	HASEI_MEISAI : 61,								// 派生明細
	HASEI_YAKUZYOU_SIKKOU : 62,						// 派生約定失効
	HASEI_ORDER_YAKUZYOU_RIREKI : 63,				// 派生注文約定履歴
	HASEI_TATEGYOKU_MEISAI : 64,					// 派生建玉明細
	HASEI_HENSAI_YOYAKU : 65,						// 派生返済予約
	HASEI_HENSAI_MEISAI : 66,						// 派生返済明細
	HASEI_HENSAI_DATA : 67,							// 派生新規注文用返済データ		
	HASEI_NEW_ORDER : 68,							// 派生新規注文　
	HASEI_CORRECT_ORDER : 69,						// 派生訂正注文　
	HASEI_CANCEL_ORDER : 70,						// 派生取消注文　　
	HASEI_PRE_ORDER : 71,							// 派生PRE注文
	DEPTH_REGIST_REQUEST : 100,						// フル板登録要求電文
	DEPTH_REGIST_ACK : 101,							// フル板登録応答電文
	DEPTH_UNREGIST_REQUEST : 102,					// フル板解除要求電文
	DEPTH_UNREGIST_ACK : 103,						// フル板解除応答電文
	DEPTH : 104,									// フル板更新電文
	DEPTH_DISABLE : 105,							// フル登録解除電文
	BOARD_REAL : 106,								// フル板更新電文
	FEED_REGIST_REQUEST : 110,						// 気配登録要求電文
	FEED_REGIST_ACK : 111,							// 気配登録応答電文
	FEED_UNREGIST_REQUEST : 112,					// 気配解除要求電文
	FEED_UNREGIST_ACK : 113,						// 気配解除応答電文
	FEED_REAL : 114,								// 気配更新電文
	FEED_DISABLE : 115,								// 気配登録解除電文
	NEWS_HEADLINE : 120,							// ニュースヘッドライン				
	TICK_DATA : 130,								// TICKデータ
	TICK_DATA_LIST : 131,							// TICKデータリスト
	HIST_DATA : 132,								// ヒストリカルデータ
	HIST_DATA_LIST : 133,							// ヒストリカルデータリスト
	TICK_REGIST_REQUEST : 134,						// TICK登録要求電文
	TICK_REGIST_ACK : 135,							// TICK登録応答電文
	TICK_UNREGIST_REQUEST : 136,					// TICK解除要求電文
	TICK_UNREGIST_ACK : 137,						// TICK解除応答電文
	TICK_REAL : 138,								// TICK更新電文
	TICK_DISABLE : 139,								// TICK登録解除電文
	TICK_GET_REQUEST : 140,							// TICK取得要求電文
	TICK_GET_ACK : 141,								// TICK取得応答電文
	KABUKA_BOARD_DATA : 800,						// 株価ボードデータ
	KABUKA_BOARD_DATA_LIST : 801,					// 株価ボードデータリスト
	KABUKA_BOARD : 802,								// 株価ボード登録内容電文
	KABUKA_BOARD_SAVE_REQUEST : 803,				// 株価ボード保存要求電文
	KABUKA_BOARD_SAVE_ACK : 804,					// 株価ボード保存応答電文
	TORIHIKI_ZYOUKEN_DATA : 805,					// 取引条件データ
	TORIHIKI_ZYOUKEN_DATA_LIST : 806,				// 取引条件データリスト
	TORIHIKI_ZYOUKEN : 807,							// 取引条件登録内容電文
	TORIHIKI_ZYOUKEN_SAVE_REQUEST : 808,			// 取引条件保存要求電文
	TORIHIKI_ZYOUKEN_SAVE_ACK : 809,				// 取引条件保存応答電文
	MEIGARA_ZYOUKEN_DATA : 810,						// 銘柄条件データ
	MEIGARA_ZYOUKEN_DATA_LIST : 811,				// 銘柄条件データリスト
	MEIGARA_ZYOUKEN : 812,							// 銘柄条件登録内容電文
	MEIGARA_ZYOUKEN_SAVE_REQUEST : 813,				// 銘柄条件保存要求電文
	MEIGARA_ZYOUKEN_SAVE_ACK : 814,					// 銘柄条件保存応答電文
	POSITION_RESEND_REQUEST : 820,					// ポジション再送要求電文
	POSITION_RESEND_ACK : 821,						// ポジション再送応答電文
	KEEP_ALIVE : 998,
	ALIVE_REPORT : 999
};

//-----------------------------------------------------------------------------
//	基底電文
//-----------------------------------------------------------------------------
export class RCMsgBase {
	constructor(msgType) {
		this.msgType = msgType;								// メッセージ種別
	}
};

//-----------------------------------------------------------------------------
//	準備完了電文
//-----------------------------------------------------------------------------
export class RCReadyMsg extends RCMsgBase {
	constructor() {
		super(RCReadyMsg.msgType());
	}
	static msgType() { return "READY";}
};

//-----------------------------------------------------------------------------
//	通信状態レベル
//-----------------------------------------------------------------------------
export class RCCommunicationLevelMsg extends RCMsgBase {
	constructor(obj) {
		super(RCCommunicationLevelMsg.msgType());
		this.level = obj.level;
	}
	static msgType() { return "COMMUNICATION_LEVEL";}
};
//-----------------------------------------------------------------------------
//	呼値データ
//-----------------------------------------------------------------------------
export class RCOfferedPriceData {
	constructor(obj) {
		if(!obj) {
			this.price = 0;
			this.offeredPrice = 0;
			this.dec = 0;
		} else {
			this.price = obj.price;
			this.offeredPrice = obj.offeredPrice;
			this.dec = obj.dec;
		}
	}
	intoCO(offeredNumber, coObj=new CO_OfferedPriceData()) {
		coObj.offeredNumber = offeredNumber;
		coObj.price = this.price;
		coObj.offeredPrice = this.offeredPrice;
		coObj.priceDec = this.dec;
	}
}
//-----------------------------------------------------------------------------
//	ログイン要求電文
//-----------------------------------------------------------------------------
export class RCLoginRequestMsg extends RCMsgBase {
	constructor(sid) {
		super(RCLoginRequestMsg.msgType());
		this.sid = sid;										// セッションID
	}
	static msgType() { return "LOGIN_REQUEST";}
};

//-----------------------------------------------------------------------------
//	ログイン応答電文
//-----------------------------------------------------------------------------
export class RCLoginAckMsg extends RCMsgBase {
	constructor(obj) {
		super(RCLoginAckMsg.msgType());
		if(!obj) {
			this.offeredNumber = "";
			this.offeredPriceList = [];
		} else {
			this.offeredNumber = obj.offeredNumber;
			this.offeredPriceList = [];
			for(const offeredPrice of obj.offeredPriceList) {
				const newOfferedPrice = new RCOfferedPriceData(offeredPrice);
				this.offeredPriceList.push(newOfferedPrice);
			}
		}
		
	}
	static msgType() { return "LOGIN_ACK";}
};

//-----------------------------------------------------------------------------
//	DEPTH登録要求電文
//-----------------------------------------------------------------------------
export class RCDepthRegistRequestMsg extends RCMsgBase {
	constructor(secType, handle, marketCode, issueCode) {
		super(RCDepthRegistRequestMsg.msgType());
		this.secType = secType;								// 商品種類("0":株式,"1":先物)
		this.handle = handle;								// ハンドル
		this.marketCode = marketCode;						// 市場コード
		this.issueCode = issueCode;							// 銘柄コード
	}
	static msgType() { return "DEPTH_REGIST_REQUEST";}
};

//-----------------------------------------------------------------------------
//	DEPTHデータ
//-----------------------------------------------------------------------------
export class RCDepthData {
	constructor(obj) {
		if(!obj) {
			this.price = {								// 値段
				type: 0,
				decimalPoint: 0,
				data: 0,
			}
			this.type = 0;								// 更新タイプ (0:Update,1:Delete)
			this.bidAsk = 0;							// 売買区分 (0:Bid,1:Ask)
			this.closeLot = 0;							// FSAV,FSBV 引け注文数量
			this.closeCount = 0;						// FSAQ,FSBQ 引け注文件数
			this.lot = 0;								// FCAV,FCBV 注文数量
			this.count = 0;								// FCAQ,FCBQ 件数
			this.status = 0;							// FQAS,FQBS 気配ステータス
			this.center = 0;							// FPAF,FPBF 板中心価格符号
			this.cross = 0;								// FFAF,FFBF 気配対等符号
		} else {
			this.price = {
				type: obj.price.type,
				decimalPoint: obj.price.decimalPoint,
				data: obj.price.data,
			}
			this.type = obj.type;
			this.bidAsk = obj.bidAsk;
			this.closeLot = obj.closeLot;
			this.closeCount = obj.closeCount;
			this.lot = obj.lot;
			this.count = obj.count;
			this.status = obj.status;
			this.center = obj.center;
			this.cross = obj.cross;
		}
		
	}
	intoPriceDetail(priceDetail=new CO_PriceDetail()) {
		const obj = priceDetail;
		obj.priceType = this.price.type;
		obj.priceDec = this.price.dec;
		obj.price = this.price.data;
		obj.type = this.type;
		obj.bidAsk = this.bidAsk;
		obj.closeLot = this.closeLot;
		obj.closeCount = this.closeCount;
		obj.lot = this.lot;
		obj.count = this.count;
		obj.status = this.status;
		obj.center = this.center;
		obj.cross = this.cross;
	}
};

//-----------------------------------------------------------------------------
//	DEPTH登録応答電文
//-----------------------------------------------------------------------------
export class RCDepthRegistAckMsg extends RCMsgBase {
	constructor(obj) {
		super(RCDepthRegistAckMsg.msgType());
		this.secType = obj.secType;							// 商品種類("0":株式,"1":先物)
		this.handle = obj.handle;							// ハンドル
		this.marketCode = obj.marketCode;					// 市場コード
		this.issueCode = obj.issueCode;						// 銘柄コード
		this.status = obj.status;							// ステータス
		this.name = obj.name;								// マスタ情報:銘柄名
		this.yobineNumber = obj.yobineTaniNumber			// マスタ情報:呼値単位番号
		this.basePrice = Object.assign({}, obj.basePrice);	// マスタ情報:基準値
		this.unitLot = obj.unitLot;							// マスタ情報:単位株数
		this.loanType = obj.loanType;						// マスタ情報:貸借区分 "0":該当なし, "1":制度信用銘柄, "2":貸借銘柄
		this.updateNumber = obj.updateNumber;				// FNO		更新番号
		this.updateNumberTime = obj.updateNumberTime;		// FNOT		更新番号:時刻
		this.stopFlag = obj.stopFlag;						// FRGS		規制フラグ
		this.quoteStatus = obj.quoteStatus;					// FQTS		QUOTEステータス
		this.nowPrice = Object.assign({}, obj.nowPrice);	// FDPP		現在値
		this.nowTime = obj.nowTime;							// FDPP:T	現在値:時刻
		this.nowPriceFlag = obj.nowPriceFlag;				// FDPF		日通し現値始値終値識別
		this.nowStatus = obj.nowStatus;						// FDPS		ステータス
		this.nowStatusTime = obj.nowStatusTime;				// FDPS:T	ステータス:時刻
		this.netChange = Object.assign({}, obj.netChange);	// FYWP		前日比・騰落幅
		this.netChangeRatio = Object.assign({}, obj.netChangeRatio);	// FYRP		前日比・騰落率
		this.shortFlag = obj.shortFlag;						// FKARA	空売規制符号
		this.shortFlagTime = obj.shortFlagTime;				// FKARA:T	空売規制符号:時刻
		this.volume = obj.volume;							// FDV		売買高
		this.volumeTime = obj.volumeTime;					// FDV:T	売買高:時刻
		this.lastTradeLot = obj.lastTradeLot;				// FXV		約定値にかかる売買高
		this.depthDataList = [];							// DEPTHデータリスト
		if(typeof obj.depthDataList !== 'undefined'){
			for(let d of obj.depthDataList) {
				this.depthDataList.push(new RCDepthData(d));
			}
		}
	}
	static msgType() { return "DEPTH_REGIST_ACK";}
	intoBoardDepth(boardDepth=new CO_BoardDepth()) {
		const obj = boardDepth;
		obj.handle = this.handle;							// ハンドル
		obj.initFlag = 1;									// 初期化符号
		const key = boardCodeToKey(this.secType, this.marketCode, this.issueCode);
		obj.code = key;										// 銘柄キー
		obj.updateNumber = this.updateNumber;				// FNO		更新番号
		obj.updateNumberTime = this.updateNumberTime;		// FNOT		更新番号:時刻
		obj.stopFlag = this.stopFlag;						// FRGS		規制フラグ
		obj.quoteStatus = this.quoteStatus;					// FQTS		QUOTEステータス
		obj.nowPriceType = this.nowPrice.type;				// FDPP		現在値種別(1:現在値有効)
		obj.nowPriceDec = this.nowPrice.decimalPoint;		// FDDP		現在値表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		obj.nowPrice = this.nowPrice.data;					// FDPP		現在値
		obj.nowTime = this.nowTime;							// FDPP:T	現在値:時刻
		obj.nowPriceFlag = this.nowPriceFlag;				// FDPF		日通し現値始値終値識別
		obj.nowStatus = this.nowStatus;						// FDPS		ステータス
		obj.nowStatusTime = this.nowStatusTime;				// FDPS:T	ステータス:時刻
		obj.netChangeType = this.netChange.type;			// FYWP		前日比・騰落幅種別(1:前日比・騰落幅有効)
		obj.netChangeDec = this.netChange.decimalPoint;		// FYWP		前日比・騰落幅表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		obj.netChange = this.netChange.data;				// FYWP		前日比・騰落幅
		obj.netChangeRatioType = this.netChangeRatio.type;	// FYRP		前日比・騰落率種別(1:前日比・騰落率有効)
		obj.netChangeRatio = this.netChangeRatio.data;		// FYRP		前日比・騰落率
		obj.shortFlag = this.shortFlag;						// FKARA	空売規制符号
		obj.shortFlagTime = this.shortFlagTime;				// FKARA:T	空売規制符号:時刻
		//obj.trendIndicator = this.;				// FDPG		日通し現値前値比較
		//obj.lastDayPriceType = this.;				// PRP		前日終値種別(1:現在値有効)
		//obj.lastDayPriceDec = this.;				// PRP		前日終値表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		//obj.lastDayPrice = this.;					// PRP		前日終値
		obj.volume = this.volume;							// FDV		売買高
		obj.volumeTime = this.volumeTime;					// FDV:T	売買高:時刻
		obj.lastTradeLot = this.lastTradeLot;				// FXV		約定値にかかる売買高
		for(let d of this.depthDataList) {
			let pd = new CO_PriceDetail();
			d.intoPriceDetail(pd);
			obj.dataList.push(pd);
		}
	}
};

//-----------------------------------------------------------------------------
//	DEPTH解除要求電文
//-----------------------------------------------------------------------------
export class RCDepthUnregistRequestMsg extends RCMsgBase {
	constructor(secType, handle) {
		super(RCDepthUnregistRequestMsg.msgType());
		this.secType = secType;							// 商品種類("0":株式,"1":先物)
		this.handle = handle;							// ハンドル
	}
	static msgType() { return "DEPTH_UNREGIST_REQUEST";}
};

//-----------------------------------------------------------------------------
//	DEPTH解除応答電文
//-----------------------------------------------------------------------------
export class RCDepthUnregistAckMsg extends RCMsgBase {
	constructor(secType, handle, status) {
		super(RCDepthUnregistAckMsg.msgType());
		this.secType = secType;							// 商品種類("0":株式,"1":先物)
		this.handle = handle;							// ハンドル
		this.status = status;							// ステータス
	}
	static msgType() { return "DEPTH_UNREGIST_ACK";}
};

//-----------------------------------------------------------------------------
//	DEPTH更新電文
//-----------------------------------------------------------------------------
export class RCDepthRealMsg extends RCMsgBase {
	constructor(obj) {
		super(RCDepthRealMsg.msgType());
		this.secType = obj.secType;							// 商品種類("0":株式,"1":先物)
		this.handle = obj.handle;							// ハンドル
		this.marketCode = obj.marketCode;					// 市場コード
		this.issueCode = obj.issueCode;						// 銘柄コード
		this.initFlag = obj.initFlag;						// 初期化符号
		this.updateNumber = obj.updateNumber;				// FNO		更新番号
		this.updateNumberTime = obj.updateNumberTime;		// FNOT		更新番号:時刻
		this.stopFlag = obj.stopFlag;						// FRGS		規制フラグ
		this.quoteStatus = obj.quoteStatus;					// FQTS		QUOTEステータス
		this.nowPrice = obj.nowPrice;						// FDPP		現在値
		this.nowTime = obj.nowTime;							// FDPP:T	現在値:時刻
		this.nowPriceFlag = obj.nowPriceFlag;				// FDPF		日通し現値始値終値識別
		this.nowStatus = obj.nowStatus;						// FDPS		ステータス
		this.nowStatusTime = obj.nowStatusTime;				// FDPS:T	ステータス:時刻
		this.netChange = obj.netChange;						// FYWP		前日比・騰落幅
		this.netChangeRatio = obj.netChangeRatio;			// FYRP		前日比・騰落率
		this.shortFlag = obj.shortFlag;						// FKARA	空売規制符号
		this.shortFlagTime = obj.shortFlagTime;				// FKARA:T	空売規制符号:時刻
		this.volume = obj.volume;							// FDV		売買高
		this.volumeTime = obj.volumeTime;					// FDV:T	売買高:時刻
		this.lastTradeLot = obj.lastTradeLot;				// FXV		約定値にかかる売買高
		this.depthDataList = [];							// DEPTHデータリスト
		for(const inData of obj.depthDataList) {
			const newData = new RCDepthData(inData);
			this.depthDataList.push(newData);
		}
		
		// マスタ情報 ※RCApiでRCDepthRegistAckMsg受信時(初回の下位配信時)のみ使用
		this.issueName = "";
		this.yobineNumber = 0;
		this.basePrice = 0;
		this.unitLot = 0;
		this.loanType = "";									// 貸借区分 "0":該当なし, "1":制度信用銘柄, "2":貸借銘柄
	}
	static msgType() { return "DEPTH_REAL";}
	intoBoardDepth(target=new CO_BoardDepth()) {
		target.secType = this.secType;
		target.handle = this.handle;
		target.code = boardCodeToKey(this.secType, this.marketCode, this.issueCode);
		target.initFlag = this.initFlag;
		target.updateNumber = this.updateNumber;
		target.updateNumberTime = this.updateNumberTime;
		target.shortFlag = this.stopFlag;
		target.quoteStatus = this.quoteStatus;
		//target.nowPrice = this.nowPrice;
		target.nowPriceType = this.nowPrice.type;				// FDPP		現在値種別(1:現在値有効)
		target.nowPriceDec = this.nowPrice.decimalPoint;		// FDDP		現在値表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		target.nowPrice = this.nowPrice.data;					// FDPP		現在値
		target.nowTime = this.nowTime;
		target.nowPriceFlag = this.nowPriceFlag;
		target.nowStatus = this.nowStatus;
		target.nowStatusTime = this.nowStatusTime;
		target.netChange = this.netChange;
		target.netChangeRatio = this.netChangeRatio;
		target.shortFlag = this.shortFlag;
		target.shortFlagTime = this.shortFlag;
		target.volume = this.volume;
		target.volumeTime = this.volumeTime;
		target.lastTradeLot = this.lastTradeLot;
		for(const rcDepth of this.depthDataList) {
			const coPrice = new CO_PriceDetail();
			rcDepth.intoPriceDetail(coPrice);
			target.dataList.push(coPrice);
		}
	}
};

//-----------------------------------------------------------------------------
//	DEPTH登録解除電文
//-----------------------------------------------------------------------------
export class RCDepthDisableMsg extends RCMsgBase {
	constructor(secType) {
		super(RCDepthDisableMsg.msgType());
		this.secType = secType;
	}
	static msgType() { return "DEPTH_DISABLE";}
};

//-----------------------------------------------------------------------------
//	フル板データ
//-----------------------------------------------------------------------------
export class RCBoardData {
	constructor(obj) {
		if(!obj) {
			this.price = {						// 値段
				type: 0,
				decimalPoint: 0,
				data: 0,
			};
			this.closeLot = {					// 引け注文数量([0]:売,[1]:買)
				bid: 0,
				ask: 0,
			}
			this.totalLot = {					// 注文数量累計([0]:売,[1]:買)
				bid: 0,
				ask: 0,
			}
			this.lot = {						// 注文数量([0]:売,[1]:買)
				bid: 0,
				ask: 0,
			}
			this.closeCount = {					// 引け注文件数([0]:売,[1]:買)
				bid: 0,
				ask: 0,
			}
			this.count = {						// 注文件数([0]:売,[1]:買)
				bid: 0,
				ask: 0,
			}
			this.status = {						// 気配ステータス([0]:売,[1]:買)
				bid: 0,
				ask: 0,
			}
			this.cross = {						// 気配対等符号フラグ([0]:売,[1]:買)
				bid: 0,
				ask: 0,
			}
		} else {
			this.price = {						// 値段
				type: obj.price.type,
				decimalPoint: obj.price.decimalPoint,
				data: obj.price.data,
			};
			this.closeLot = {					// 引け注文数量([0]:売,[1]:買)
				bid: obj.closeLot.bid,
				ask: obj.closeLot.ask,
			}
			this.totalLot = {					// 注文数量累計([0]:売,[1]:買)
				bid: obj.totalLot.bid,
				ask: obj.totalLot.ask,
			}
			this.lot = {						// 注文数量([0]:売,[1]:買)
				bid: obj.lot.bid,
				ask: obj.lot.ask,
			}
			this.closeCount = {					// 引け注文件数([0]:売,[1]:買)
				bid: obj.closeCount.bid,
				ask: obj.closeCount.ask,
			}
			this.count = {						// 注文件数([0]:売,[1]:買)
				bid: obj.count.bid,
				ask: obj.count.ask,
			}
			this.status = {						// 気配ステータス([0]:売,[1]:買)
				bid: obj.status.bid,
				ask: obj.status.ask,
			}
			this.cross = {						// 気配対等符号フラグ([0]:売,[1]:買)
				bid: obj.cross.bid,
				ask: obj.cross.ask,
			}
		}
		
	}
	fromCO(coBoardData=new CO_BoardData()) {
		const obj = coBoardData;
		this.price.type = obj.priceType;				// 値段
		this.price.decimalPoint = obj.priceDec;
		this.price.data = obj.price;
		this.closeLot.bid = obj.closeLot[0];			// 引け注文数量([0]:売,[1]:買)
		this.closeLot.ask = obj.closeLot[1];
		this.totalLot.bid = obj.totalLot[0];			// 注文数量累計([0]:売,[1]:買)
		this.totalLot.ask = obj.totalLot[1];
		this.lot.bid = obj.lot[0];						// 注文数量([0]:売,[1]:買)
		this.lot.ask = obj.lot[1];
		this.closeCount.bid = obj.closeCount[0];		// 注文数量([0]:売,[1]:買)
		this.closeCount.ask = obj.closeCount[1];
		this.count.bid = obj.count[0];					// 注文件数([0]:売,[1]:買)
		this.count.ask = obj.count[1];
		this.status.bid = obj.status[0];				// 気配ステータス([0]:売,[1]:買)
		this.status.ask = obj.status[1];
		this.cross.bid = obj.cross[0];					// 気配対等符号フラグ([0]:売,[1]:買)
		this.cross.ask = obj.cross[1];
	}
};

//-----------------------------------------------------------------------------
//	フル板更新電文
//-----------------------------------------------------------------------------
export class RCBoardRealMsg extends RCMsgBase {
	constructor(obj) {
		super(RCBoardRealMsg.msgType());
		if(!obj) {
			this.handle = 0;
			this.issueCode = "";
			this.marketCode = "";
			this.status = 0;
			this.offeredNumber = 0;
			this.updateNumber = 0;
			this.updateNumberTime = 0;
			this.stopFlag = 0;
			this.quoteStatus = 0;
			this.nowPrice = {
				type: 0,
				decimalPoint: 0,
				data: 0,
			}
			this.nowTime = 0;
			this.nowPriceFlag = 0;
			this.nowStatus = 0;
			this.nowStatusTime = 0;
			this.shortFlag = 0;
			this.shortFlagTime = 0;
			this.volume = 0;
			this.volumeTime = 0;
			this.lastTradeLot = 0;
			this.boardDataList = [];
		} else {
			this.handle = obj.handle;							// 下位ハンドル
			this.issueCode = obj.issueCode;						// 銘柄コード
			this.marketCode = obj.marketCode;					// 市場コード
			this.status = obj.status;							// ステータス
			this.offeredNumber = obj.offeredNumber;				// 呼値の単位番号
			this.updateNumber = obj.updateNumber;				// 更新番号
			this.updateNumberTime = obj.updateNumberTime;		// 更新番号:時刻
			this.stopFlag = obj.stopFlag;						// 規制フラグ
			this.quoteStatus = obj.quoteStatus;					// QUOTEステータス
			this.nowPrice = obj.nowPrice;						// 現在値
			this.nowTime = obj.nowTime;							// 現在値:時刻
			this.nowPriceFlag = obj.nowPriceFlag;				// 日通し現値始値終値識別
			this.nowStatus = obj.nowStatus;						// ステータス
			this.nowStatusTime = obj.nowStatusTime;				// ステータス:時刻
			this.shortFlag = obj.shortFlag;						// 空売規制符号
			this.shortFlagTime = obj.shortFlagTime;				// 空売規制符号:時刻
			this.volume = obj.volume;							// 売買高
			this.volumeTime = obj.volumeTime;					// 売買高:時刻
			this.lastTradeLot = obj.lastTradeLot;				// 約定値にかかる売買高
			this.boardDataList = [];							// フル板データリスト
			for(let inData of obj.boardDataList) {
				this.boardDataList.push(new RCBoardData(inData));
			}
		}
		
	}
	static msgType() { return "BOARD_REAL";}

	fromCO(COBoardReal=new CO_BoardReal()) {
		const obj = COBoardReal;
		this.handle = obj.clHandle;							// 下位ハンドル
		const code = boardKeyToCode(obj.code);
		this.issueCode = code.issueCode;					// 銘柄コード
		this.marketCode = code.marketCode;					// 市場コード
		this.status = obj.status;							// ステータス
		this.offeredNumber = obj.offeredNumber;				// 呼値の単位番号
		this.updateNumber = obj.updateNumber;				// 更新番号
		this.updateNumberTime = obj.updateNumberTime;		// 更新番号:時刻
		this.stopFlag = obj.stopFlag;						// 規制フラグ
		this.quoteStatus = obj.quoteStatus;					// QUOTEステータス
		this.nowPrice = obj.nowPrice;						// 現在値
		this.nowTime = obj.nowTime;							// 現在値:時刻
		this.nowPriceFlag = obj.nowPriceFlag;				// 日通し現値始値終値識別
		this.nowStatus = obj.nowStatus;						// ステータス
		this.nowStatusTime = obj.nowStatusTime;				// ステータス:時刻
		this.shortFlag = obj.shortFlag;						// 空売規制符号
		this.shortFlagTime = obj.shortFlagTime;				// 空売規制符号:時刻
		this.volume = obj.volume;							// 売買高
		this.volumeTime = obj.volumeTime;					// 売買高:時刻
		this.lastTradeLot = obj.lastTradeLot;				// 約定値にかかる売買高
		// フル板データリスト
		for(let coBoardData of obj.dataList) {
			const boardData = new RCBoardData();
			boardData.fromCO(coBoardData);
			this.boardDataList.push(boardData);
		}
	}
};

//-----------------------------------------------------------------------------
//	気配登録要求電文
//-----------------------------------------------------------------------------
export class RCFeedRegistRequestMsg extends RCMsgBase {
	constructor(handle, source, marketCode, issueCode) {
		super(RCFeedRegistRequestMsg.msgType());
		this.handle = handle;								// ハンドル
		this.source = source;								// 情報ソース
		this.marketCode = marketCode;						// 市場コード
		this.issueCode = issueCode;							// 銘柄コード
	}
	static msgType() { return "FEED_REGIST_REQUEST";}
};

//-----------------------------------------------------------------------------
//	気配データ
//-----------------------------------------------------------------------------
export class RCFeedData {
	constructor(obj) {
		if(obj) {
			this.name = obj.name;							// 項目名
			this.status = obj.status;						// ステータス
			this.serial = obj.serial;						// 管理番号
			this.data = obj.data;							// データ
		} else {
			this.name = "";
			this.status = 0;
			this.serial = 0;
			this.data = "";
		}
	}
};

//-----------------------------------------------------------------------------
//	気配登録応答電文
//-----------------------------------------------------------------------------
export class RCFeedRegistAckMsg extends RCMsgBase {
	constructor(obj) {
		super(RCFeedRegistAckMsg.msgType());
		if(obj) {
			this.handle = obj.handle;						// ハンドル
			if(obj.row) {
				this.row = obj.row;							// 行(下位配信時のみ使用)
			}
			this.source = obj.source;						// 情報ソース
			this.marketCode = obj.marketCode;				// 市場コード
			this.issueCode = obj.issueCode;					// 銘柄コード
			this.status = obj.status;						// ステータス
			this.name = obj.name;							// マスタ情報:銘柄名
			this.unitLot = obj.unitLot;						// マスタ情報:単位株数
			this.loanType = obj.loanType;					// マスタ情報:貸借区分
			this.yobineTaniNumber = obj.yobineTaniNumber;	// マスタ情報:呼値単位番号
			this.feedDataList = [];							// Feedデータリスト
			for(let fd of obj.feedDataList) {
				let newFd = new RCFeedData(fd);
				this.feedDataList.push(newFd);
			}
		} else {
			this.handle = 0;
			this.row = 0;
			this.source = 0;
			this.marketCode = "";
			this.issueCode = "";
			this.status = 0;
			this.name = "";
			this.unitLot = "";
			this.loanType = "";
			this.yobineTaniNumber = "";
			this.feedDataList = [];
		}
	}
	static msgType() { return "FEED_REGIST_ACK";}
	setFeedRec(rec = new CO_FeedRecord) {
		const code = feedKeyToCode(rec.code);
		this.source = rec.source;
		this.marketCode = code.marketCode;
		this.issueCode = code.issueCode;
		this.status = rec.status;
		this.name = rec.issueName;
		this.unitLot = rec.unitLot;
		this.loanType = rec.loanType;
		this.yobineTaniNumber = rec.yobineTaniNumber;
		this.feedDataList = [];
		for(const [name, val] of rec.valueMap) {
			const feedData = new RCFeedData();
			feedData.name = name;
			feedData.serial = val.serial;
			feedData.status = val.status;
			feedData.data = val.data;
			this.feedDataList.push(feedData);
		}
	}
};

//-----------------------------------------------------------------------------
//	気配解除要求電文
//-----------------------------------------------------------------------------
export class RCFeedUnregistRequestMsg extends RCMsgBase {
	constructor(handle, row) {
		super(RCFeedUnregistRequestMsg.msgType());
		this.handle = handle;								// ハンドル
		//this.row = row;										// 行
	}
	static msgType() { return "FEED_UNREGIST_REQUEST";}
};

//-----------------------------------------------------------------------------
//	気配解除応答電文
//-----------------------------------------------------------------------------
export class RCFeedUnregistAckMsg extends RCMsgBase {
	constructor(obj) {
		super(RCFeedUnregistAckMsg.msgType());
		if(!obj) {
			this.handle = 0;							// ハンドル
			this.row = 0;								// 行
			this.status = 0;							// ステータス
		} else {
			this.handle = obj.handle;
			this.row = obj.row;
			this.status = obj.status;
		}
	}
	static msgType() { return "FEED_UNREGIST_ACK";}
};

//-----------------------------------------------------------------------------
//	気配更新電文
//-----------------------------------------------------------------------------
export class RCFeedRealMsg extends RCMsgBase {
	constructor(obj) {
		super(RCFeedRealMsg.msgType());
		if(!obj) {
			this.handle = 0;						// ハンドル
			this.row = 0;							// 行
			this.source = 0;						// 情報ソース
			this.marketCode = "";					// 市場コード
			this.issueCode = "";					// 銘柄コード
			this.feedDataList = [];					// Feedデータリスト
		} else {
			this.handle = obj.handle;
			this.row = obj.row;
			this.source = obj.source;
			this.marketCode = obj.marketCode;
			this.issueCode = obj.issueCode;
			this.feedDataList = [];
			for(const fd of obj.feedDataList) {
				const newFd = new RCFeedData(fd);
				this.feedDataList.push(newFd);
			}
		}
	}
	static msgType() { return "FEED_REAL";}
};

//-----------------------------------------------------------------------------
//	気配登録解除電文
//-----------------------------------------------------------------------------
export class RCFeedDisableMsg extends RCMsgBase {
	constructor() {
		super(RCFeedDisableMsg.msgType());
	}
	static msgType() { return "FEED_DISABLE";}
};

//-----------------------------------------------------------------------------
//	ニュースヘッドライン
//-----------------------------------------------------------------------------
/*
export class RCNewsHeadline : public CO_NetMsgBase
{
public:
	RCNewsHeadline();
	RCNewsHeadline(const RCNewsHeadline&);
	virtual ~RCNewsHeadline();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::NEWS_HEADLINE; };
	virtual int	ReadFrom(unsigned char**);
	virtual int DataLength();
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public: // operator
	RCNewsHeadline& operator = (const RCNewsHeadline&);
	friend ostream& operator<<(ostream&, const export class RCNewsHeadline&);
public:
	CO_NetString	mNewsID;							// ニュースID
	CO_NetInt		mSource;							// 情報ソース
	CO_NetInt		mUpdateFlg;							// 更新区分
	CO_NetInt		mDate;								// ニュース発生日
	CO_NetInt		mTime;								// ニュース発生時刻
	CO_NetChar		mNewsType;							// ニュースタイプ
	CO_NetInt		mCategory;							// ニュースカテゴリ
	CO_NetChar		mImportance;						// 重要フラグ
	CO_NetChar		mPDFFlag;							// PDF有無フラグ
	CO_NetString	mHeadline;							// ヘッドライン
	CO_ObjList*		pList;								// 銘柄コードリスト
	CO_ObjList*		pIndustry;							// 業種コードリスト
};
*/
//-----------------------------------------------------------------------------
//	ティックエントリデータ
//-----------------------------------------------------------------------------
export class RCTickData {
	constructor(obj) {
		if(!obj) {
			this.number = 0;					// TICK番号
			this.date = 0;						// 日付(YYYYMMDD)
			this.time = 0;						// 時刻(HHMMSS)
			this.price = 0;						// 約定値段
			this.volume = 0;					// 約定数量
			this.VWAP = 0;						// VWAP
		} else {
			this.number = obj.number;
			this.data = obj.data;
			this.time = obj.time;
			this.price = obj.price;
			this.volume = obj.volume;
			this.VWAP = obj.VWAP;
		}
	}
};

//-----------------------------------------------------------------------------
//	ティックエントリデータリスト
//-----------------------------------------------------------------------------
export class RCTickList {
	constructor(obj) {
		if(!obj) {
			this.maxData = 0;					// 最大個数
			this.lastClose = 0;					// 前営業日終値
			this.lastTickDate = 0;				// 最終TICK日時
			this.lastTickNum = 0;				// 最終TICK番号
			this.lastBaseDay = 0;				// 直近株価修正日
			this.dataType = 0;					// 種類
			this.dataList = [];					// Tickデータリスト
		} else {
			this.maxData = obj.maxData;
			this.lastClose = obj.lastClose;
			this.lastTickDate = obj.lastTickDate;
			this.lastTickNum = obj.lastTickNum;
			this.lastBaseDay = obj.volulastBaseDayme;
			this.dataType = obj.dataType;
			this.dataList = [];
			for(const inData of obj.dataList) {
				const newData = new RCTickData(inData);
				this.dataList.push(newData);
			}
		}
	}
};

//-----------------------------------------------------------------------------
//	ヒストリカルエントリデータ
//-----------------------------------------------------------------------------
export class RCHistData {
	constructor(obj) {
		if(!obj) {
			this.date = 0;						// 日付(YYYYMMDD)
			this.time = 0;						// 時刻(HHMM)
			this.reasonCode = "";				// 不連続要因発生コード
			this.open = 0;						// 始値
			this.high = 0;						// 高値
			this.low = 0;						// 安値
			this.close = 0;						// 終値
			this.volume = 0;					// 出来高
			this.ratioPrice = 0;				// 相対対象値段
			this.SBalance = 0;					// 信用売残
			this.BBalance = 0;					// 信用買残
			this.VWAP = 0;						// VWAP
		} else {
			this.date = obj.date;
			this.time = obj.time;
			this.reasonCode = obj.reasonCode;
			this.open = obj.open;
			this.high = obj.high;
			this.low = obj.low;
			this.close = obj.close;
			this.volume = obj.volume;
			this.ratioPrice = obj.ratioPrice;
			this.SBalance = obj.SBalance;
			this.BBalance = obj.BBalance;
			this.VWAP = obj.VWAP;
		}
	}
};

//-----------------------------------------------------------------------------
//	ヒストリカルエントリデータリスト
//-----------------------------------------------------------------------------
export class RCHistList {
	constructor(obj) {
		if(obj) {
			this.lastClose = 0;					// 前営業日終値
			this.lastTickDate = 0;				// 最終TICK日時
			this.lastTickNum = 0;				// 最終TICK番号
			this.lastBaseDay = 0;				// 直近株価修正日
			this.dataType = 0;					// 種類
			this.dataList = [];					// ヒストリカルエントリデータリスト
		} else {
			this.lastClose = obj.lastClose;
			this.lastTickDate = obj.lastTickDate;
			this.lastTickNum = obj.lastTickNum;
			this.lastBaseDay = obj.lastBaseDay;
			this.dataType = obj.dataType;
			this.dataList = [];
			for(const inData of obj.dataList) {
				const newData = new RCHistData(inData);
				this.dataList.push(newData);
			}
		}
	}
};

//-----------------------------------------------------------------------------
//	ティック登録要求電文
//-----------------------------------------------------------------------------
export class RCTickRegistRequestMsg extends RCMsgBase {
	constructor(handle, source, marketCode, issueCode, periodType, minValue, adjust, subCode) {
		super(RCTickRegistRequestMsg.msgType());
		this.handle = handle;							// ハンドル
		this.source = source;							// 情報ソース
		this.marketCode = marketCode;					// 市場コード
		this.issueCode = issueCode;						// 銘柄コード
		this.subCode = subCode;							// サブコード
		this.periodType = periodType;					// 取得タイプ[0:MONTHLY,1:WEEKLY,2:DAILY,3:MINTES,4:TICK]
		this.minValue = minValue;						// 分指定(分足)
		this.adjust = adjust;							// 株価修正タイプ[0:有,1:無]
	}
	static msgType() { return "TICK_REGIST_REQUEST";}
};

//-----------------------------------------------------------------------------
//	ティック登録応答電文
//-----------------------------------------------------------------------------
export class RCTickRegistAckMsg extends RCMsgBase {
	constructor(obj) {
		super(RCTickRegistAckMsg.msgType());
		this.handle = obj.handle;						// ハンドル
		this.source = obj.source;						// 情報ソース
		this.marketCode = obj.marketCode;				// 市場コード
		this.issueCode = obj.issueCode;					// 銘柄コード
		this.status = obj.status;						// ステータス
		this.type = obj.type;							// 取得タイプ[0:FULL,1:MONTHLY,2:WEEKLY,3:DAILY,4:MINTES,5:10TICK]
		this.adjust = obj.adjust;						// 株価修正タイプ[0:有,1:無]
		this.tickList = [];								// ティックデータリスト
		for(const td of obj.tickList) {
			const newTd = new RCTickData(td);
			this.tickList.push(newTd);
		}
		this.histList = [];								// ヒストリカルエントリデータリスト
		for(const hd of obj.tickList) {
			const newHd = new RCHistData(hd);
			this.tickList.push(newHd);
		}
	}
	static msgType() { return "TICK_REGIST_ACK";}
};

//-----------------------------------------------------------------------------
//	ティック解除要求電文
//-----------------------------------------------------------------------------
export class RCTickUnregistRequestMsg extends RCMsgBase {
	constructor(handle) {
		super(RCTickUnregistRequestMsg.msgType());
		this.handle = handle;								// ハンドル
	}
	static msgType() { return "TICK_UNREGIST_REQUEST";}
};

//-----------------------------------------------------------------------------
//	ティック解除応答電文
//-----------------------------------------------------------------------------
export class RCTickUnregistAckMsg extends RCMsgBase {
	constructor(obj) {
		super(RCTickUnregistAckMsg.msgType());
		if(obj) {
			this.handle = obj.handle;						// ハンドル
			this.status = obj.status;						// ステータス
		}
		
	}
	static msgType() { return "TICK_UNREGIST_ACK";}
};

//-----------------------------------------------------------------------------
//	ティック更新電文
//-----------------------------------------------------------------------------
export class RCTickRealMsg extends RCMsgBase {
	constructor(obj) {
		super(RCTickRealMsg.msgType());
		if(obj) {
			this.handle = obj.handle;						// ハンドル
			this.row = obj.row;								// 行
			this.source = obj.source;						// 情報ソース
			this.marketCode = obj.marketCode;				// 市場コード
			this.issueCode = obj.issueCode;					// 銘柄コード
			this.datalist = obj.datalist;					// データリスト
		}
	}
	static msgType() { return "TICK_REAL";}
};

//-----------------------------------------------------------------------------
//	ティック登録解除電文
//-----------------------------------------------------------------------------
export class RCTickDisableMsg extends RCMsgBase {
	constructor(handle) {
		super(RCTickDisableMsg.msgType());
		this.handle = handle;
	}
	static msgType() { return "TICK_DISABLE";}
};

//-----------------------------------------------------------------------------
//	ティック取得要求電文
//-----------------------------------------------------------------------------
export class RCTickGetRequestMsg extends RCMsgBase {
	constructor(handle, source, marketCode, issueCode, type, adjust) {
		super(RCTickGetRequestMsg.msgType());
		this.handle = handle;								// ハンドル
		this.source = source;								// 情報ソース
		this.marketCode = marketCode;						// 市場コード
		this.issueCode = issueCode;							// 銘柄コード
		this.type = type;									// 取得タイプ[0:FULL,1:MONTHLY,2:WEEKLY,3:DAILY,4:MINTES,5:10TICK]
		this.adjust = adjust;								// 株価修正タイプ[0:有,1:無]
	}
	static msgType() { return "TICK_GET_REQUEST";}
};

//-----------------------------------------------------------------------------
//	ティック取得応答電文
//-----------------------------------------------------------------------------
export class RCTickGetAckMsg extends RCMsgBase {
	constructor(obj) {
		super(RCTickGetAckMsg.msgType());
		this.handle = obj.handle;						// ハンドル
		this.source = obj.source;						// 情報ソース
		this.marketCode = obj.marketCode;				// 市場コード
		this.issueCode = obj.issueCode;					// 銘柄コード
		this.status = obj.status;						// ステータス
		this.type = obj.type;							// 取得タイプ[0:FULL,1:MONTHLY,2:WEEKLY,3:DAILY,4:MINTES,5:10TICK]
		this.adjust = obj.adjust;						// 株価修正タイプ[0:有,1:無]
		this.tickList = [];								// ティックデータリスト
		for(const td of obj.tickList) {
			const newTd = new RCTickData(td);
			this.tickList.push(newTd);
		}
		this.histList = [];								// ヒストリカルエントリデータリスト
		for(const hd of obj.tickList) {
			const newHd = new RCHistData(hd);
			this.tickList.push(newHd);
		}
	}
	static msgType() { return "TICK_GET_ACK";}
};

//-----------------------------------------------------------------------------
//	ニュースヘッドライン電文
//-----------------------------------------------------------------------------
export class RCNewsHeadLineMsg extends RCMsgBase {
	constructor(obj) {
		super(RCTickGetAckMsg.msgType());
		this.newsID = obj.newsID;						// ニュースID
		this.source = obj.source;						// 情報ソース
		this.updateFlg = obj.updateFlg;					// 更新区分
		this.date = obj.date;							// ニュース発生日
		this.time = obj.time;							// ニュース発生時刻
		this.newsType = obj.newsType;					// ニュースタイプ
		this.category = obj.category;					// ニュースカテゴリ
		this.importance = obj.importance;				// 重要フラグ
		this.PDFFlag = obj.PDFFlag;						// PDF有無フラグ
		this.hedaLine = obj.hedaLine;					// ヘッドライン
		this.issueList = obj.issueList;					// 銘柄コードリスト
		this.industory = obj.industory;					// 業種コードリスト
	}
	static msgType() { return "NEWS_HEADLINE";}
};

//-----------------------------------------------------------------------------
//	株価ボードデータ
//-----------------------------------------------------------------------------
export class RCKabukaBoardData {
	constructor(obj) {
		if(obj) {
			this.pageNumber = obj.pageNumber;			// ページ番号
			this.rowNumber = obj.rowNumber;				// 行番号
			this.issueCode = obj.issueCode;				// 銘柄コード
			this.marketCode = obj.marketCode;			// 市場コード
		}
	}
};

//-----------------------------------------------------------------------------
//	株価ボードデータリスト
//-----------------------------------------------------------------------------
export class RCKabukaBoardDataList {
	constructor(obj) {
		if(obj) {
			this.list = obj.list;						// 株価ボードデータリスト
		}
	}
};

//-----------------------------------------------------------------------------
//	株価ボード登録内容電文
//-----------------------------------------------------------------------------
export class RCKabukaBoardMsg extends RCMsgBase {
	constructor(obj) {
		super(RCKabukaBoardMsg.msgType());
		if(obj) {
			this.list = obj.list;						// 株価ボードデータリスト
		}
	}
	static msgType() { return "KABUKA_BOARD";}
};

//-----------------------------------------------------------------------------
//	株価ボード保存要求電文
//-----------------------------------------------------------------------------
export class RCKabukaBoardSaveRequestMsg extends RCMsgBase {
	constructor(obj) {
		super(RCKabukaBoardSaveRequestMsg.msgType());
		if(obj) {
			this.list = obj.list;						// 株価ボードデータリスト
		}
	}
	static msgType() { return "KABUKA_BOARD_SAVE_REQUEST";}
};

//-----------------------------------------------------------------------------
//	株価ボード保存応答電文
//-----------------------------------------------------------------------------
export class RCKabukaBoardSaveAckMsg extends RCMsgBase {
	constructor(obj) {
		super(RCKabukaBoardSaveAckMsg.msgType());
		if(obj) {
			this.resultCode = obj.resultCode;			// 結果コード
		}
	}
	static msgType() { return "KABUKA_BOARD_SAVE_ACK";}
};

//-----------------------------------------------------------------------------
//	株サマリ
//-----------------------------------------------------------------------------
export class RCKabuNoticeMsg extends RCMsgBase {
	constructor(obj) {
		super(RCKabuNoticeMsg.msgType());
	}
	static msgType() { return "KABU_NOTICE";}
};
export class RCKabuSummaryMsg extends RCMsgBase {
	constructor(obj) {
		super(RCKabuSummaryMsg.msgType());
	}
	static msgType() { return "KABU_SUMMARY";}
};
export class RCKabuYakuzyouSikkouMsg extends RCMsgBase {
	constructor(obj) {
		super(RCKabuYakuzyouSikkouMsg.msgType());
	}
	static msgType() { return "KABU_YAKUZYOU_SIKKOU";}
};

//-----------------------------------------------------------------------------
//	取引条件データ
//-----------------------------------------------------------------------------
export class RCTorihikiZyoukenData {
	constructor(obj) {
		if(obj) {
			this.torihikiType = obj.torihikiType;		// 取引種別
			this.orderSuryou = obj.orderSuryou;			// 注文数量
			this.orderExpireDay = obj.orderExpireDay;	// 注文期日
		}
	}
};
/*
//-----------------------------------------------------------------------------
//	取引条件データリスト
//-----------------------------------------------------------------------------
export class RCTorihikiZyoukenDataList : public CO_Object
{
public:
	RCTorihikiZyoukenDataList();
	RCTorihikiZyoukenDataList(const RCTorihikiZyoukenDataList&);
	virtual ~RCTorihikiZyoukenDataList();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::TORIHIKI_ZYOUKEN_DATA_LIST; };
	virtual int	ReadFrom(unsigned char**);
	virtual int DataLength();
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public: // operator
	RCTorihikiZyoukenDataList& operator = (const RCTorihikiZyoukenDataList&);
	RCTorihikiZyoukenDataList& operator << (const RCTorihikiZyoukenData&);
public:
	std::vector<RCTorihikiZyoukenData*>	mList;			// データリスト
};

//-----------------------------------------------------------------------------
//	取引条件登録内容電文
//-----------------------------------------------------------------------------
export class RCTorihikiZyoukenMsg : public CO_NetMsgBase
{
public:
	RCTorihikiZyoukenMsg();
	RCTorihikiZyoukenMsg(const RCTorihikiZyoukenMsg&);
	virtual ~RCTorihikiZyoukenMsg();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::TORIHIKI_ZYOUKEN; };
	virtual int DataLength();
	virtual int	ReadFrom(unsigned char**);
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public:
	virtual void Add(RCTorihikiZyoukenData&);
public: // operator
	friend ostream& operator<<(ostream&, const export class RCTorihikiZyoukenMsg&);
public:
	RCTorihikiZyoukenDataList	mDataList;				// データリスト
};

//-----------------------------------------------------------------------------
//	取引条件保存要求電文
//-----------------------------------------------------------------------------
export class RCTorihikiZyoukenSaveRequestMsg : public CO_NetMsgBase
{
public:
	RCTorihikiZyoukenSaveRequestMsg();
	RCTorihikiZyoukenSaveRequestMsg(const RCTorihikiZyoukenSaveRequestMsg&);
	virtual ~RCTorihikiZyoukenSaveRequestMsg();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::TORIHIKI_ZYOUKEN_SAVE_REQUEST; };
	virtual int DataLength();
	virtual int	ReadFrom(unsigned char**);
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public:
	virtual void Add(RCTorihikiZyoukenData&);
public: // operator
	friend ostream& operator<<(ostream&, const export class RCTorihikiZyoukenSaveRequestMsg&);
public:
	RCTorihikiZyoukenDataList	mDataList;					// データリスト
};

//-----------------------------------------------------------------------------
//	取引条件保存応答電文
//-----------------------------------------------------------------------------
export class RCTorihikiZyoukenSaveAckMsg : public CO_NetMsgBase
{
public:
	RCTorihikiZyoukenSaveAckMsg();
	RCTorihikiZyoukenSaveAckMsg(const RCTorihikiZyoukenSaveAckMsg&);
	virtual ~RCTorihikiZyoukenSaveAckMsg();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::TORIHIKI_ZYOUKEN_SAVE_ACK; };
	virtual int DataLength();
	virtual int	ReadFrom(unsigned char**);
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public: // operator
	friend ostream& operator<<(ostream&, const export class RCTorihikiZyoukenSaveAckMsg&);
public:
	CO_NetInt		mResultCode;						// 結果コード
};

//-----------------------------------------------------------------------------
//	銘柄条件データ
//-----------------------------------------------------------------------------
export class RCMeigaraZyoukenData : public CO_Object
{
public:
	RCMeigaraZyoukenData();
	RCMeigaraZyoukenData(const RCMeigaraZyoukenData&);
	virtual ~RCMeigaraZyoukenData();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::MEIGARA_ZYOUKEN_DATA; };
	virtual int	ReadFrom(unsigned char**);
	virtual int DataLength();
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
	virtual void Print( ostream&, const int ); 
public: // operator
	RCMeigaraZyoukenData& operator = (const RCMeigaraZyoukenData&);
public:
	CO_NetString	mIssueCode;							// 銘柄コード
	CO_NetChar		mTorihikiSyubetu;					// 取引種別
	CO_NetLong		mOrderSuryou;						// 注文数量
	CO_NetInt		mOrderExpireDay;					// 注文期日
};

//-----------------------------------------------------------------------------
//	銘柄条件データリスト
//-----------------------------------------------------------------------------
export class RCMeigaraZyoukenDataList : public CO_Object
{
public:
	RCMeigaraZyoukenDataList();
	RCMeigaraZyoukenDataList(const RCMeigaraZyoukenDataList&);
	virtual ~RCMeigaraZyoukenDataList();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::MEIGARA_ZYOUKEN_DATA_LIST; };
	virtual int	ReadFrom(unsigned char**);
	virtual int DataLength();
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public: // operator
	RCMeigaraZyoukenDataList& operator = (const RCMeigaraZyoukenDataList&);
	RCMeigaraZyoukenDataList& operator << (const RCMeigaraZyoukenData&);
public:
	std::vector<RCMeigaraZyoukenData*>	mList;			// データリスト
};

//-----------------------------------------------------------------------------
//	銘柄条件登録内容電文
//-----------------------------------------------------------------------------
export class RCMeigaraZyoukenMsg : public CO_NetMsgBase
{
public:
	RCMeigaraZyoukenMsg();
	RCMeigaraZyoukenMsg(const RCMeigaraZyoukenMsg&);
	virtual ~RCMeigaraZyoukenMsg();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::MEIGARA_ZYOUKEN; };
	virtual int DataLength();
	virtual int	ReadFrom(unsigned char**);
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public:
	virtual void Add(RCMeigaraZyoukenData&);
public: // operator
	friend ostream& operator<<(ostream&, const export class RCMeigaraZyoukenMsg&);
public:
	RCMeigaraZyoukenDataList	mDataList;				// データリスト
};

//-----------------------------------------------------------------------------
//	銘柄条件保存要求電文
//-----------------------------------------------------------------------------
export class RCMeigaraZyoukenSaveRequestMsg : public CO_NetMsgBase
{
public:
	RCMeigaraZyoukenSaveRequestMsg();
	RCMeigaraZyoukenSaveRequestMsg(const RCMeigaraZyoukenSaveRequestMsg&);
	virtual ~RCMeigaraZyoukenSaveRequestMsg();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::MEIGARA_ZYOUKEN_SAVE_REQUEST; };
	virtual int DataLength();
	virtual int	ReadFrom(unsigned char**);
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public:
	virtual void Add(RCMeigaraZyoukenData&);
public: // operator
	friend ostream& operator<<(ostream&, const export class RCMeigaraZyoukenSaveRequestMsg&);
public:
	RCMeigaraZyoukenDataList	mDataList;					// データリスト
};

//-----------------------------------------------------------------------------
//	銘柄条件保存応答電文
//-----------------------------------------------------------------------------
export class RCMeigaraZyoukenSaveAckMsg : public CO_NetMsgBase
{
public:
	RCMeigaraZyoukenSaveAckMsg();
	RCMeigaraZyoukenSaveAckMsg(const RCMeigaraZyoukenSaveAckMsg&);
	virtual ~RCMeigaraZyoukenSaveAckMsg();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::MEIGARA_ZYOUKEN_SAVE_ACK; };
	virtual int DataLength();
	virtual int	ReadFrom(unsigned char**);
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public: // operator
	friend ostream& operator<<(ostream&, const export class RCMeigaraZyoukenSaveAckMsg&);
public:
	CO_NetInt		mResultCode;						// 結果コード
};

//-----------------------------------------------------------------------------
//	ポジション再送要求電文
//-----------------------------------------------------------------------------
export class RCPositionResendRequestMsg : public CO_NetMsgBase
{
public:
	RCPositionResendRequestMsg();
	RCPositionResendRequestMsg(const int);
	virtual ~RCPositionResendRequestMsg();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::POSITION_RESEND_REQUEST; };
	virtual int DataLength();
	virtual int	ReadFrom(unsigned char**);
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public: // operator
	friend ostream& operator<<(ostream&, const export class RCPositionResendRequestMsg&);
public:
	CO_NetInt	mType;									// 1:保管証券,2:信用建玉,3:派生建玉
};

//-----------------------------------------------------------------------------
//	ポジション再送応答電文
//-----------------------------------------------------------------------------
export class RCPositionResendAckMsg : public CO_NetMsgBase
{
public:
	RCPositionResendAckMsg();
	RCPositionResendAckMsg(RCPositionResendRequestMsg&);
	virtual ~RCPositionResendAckMsg();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::POSITION_RESEND_ACK; };
	virtual int DataLength();
	virtual int	ReadFrom(unsigned char**);
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public: // operator
	friend ostream& operator<<(ostream&, const export class RCPositionResendAckMsg&);
public:
	CO_NetInt	mType;									// 1:保管証券,2:信用建玉,3:派生建玉
	CO_NetInt	mResultCode;							// 結果コード（出力）
};

//-----------------------------------------------------------------------------
//	生存監視電文
//-----------------------------------------------------------------------------
export class RCKeepAliveMsg : public CO_NetMsgBase
{
public:
	RCKeepAliveMsg();
	RCKeepAliveMsg(const RCKeepAliveMsg&);
	virtual ~RCKeepAliveMsg();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::KEEP_ALIVE; };
	virtual int DataLength();
	virtual int	ReadFrom(unsigned char**);
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public: // operator
	friend ostream& operator<<(ostream&, const export class RCKeepAliveMsg&);
public:
	CO_NetLong		mTime;								// 時刻
};

//-----------------------------------------------------------------------------
//	生存報告電文
//-----------------------------------------------------------------------------
export class RCAliveReportMsg : public CO_NetMsgBase
{
public:
	RCAliveReportMsg();
	virtual ~RCAliveReportMsg();
public: // archive methods
	virtual int ClassType() { return RCMsgClassNum::ALIVE_REPORT; };
	virtual int DataLength();
	virtual int	ReadFrom(unsigned char**);
	virtual int WriteTo(unsigned char**);
	virtual void Print( ostream& ); 
public: // operator
	friend ostream& operator<<(ostream&, const export class RCAliveReportMsg&);
public:
	CO_NetString	mSessionId;							// セッションＩＤ
};

//////////////////////////////////////////////////////////////////////
// 電文ラップクラス
//////////////////////////////////////////////////////////////////////

export class RCMessage : public CO_Object
{
private:
	export class CO_NetMsgBase *pMsg;
public:
	RCMessage();
	virtual ~RCMessage();
public:
	export class CO_NetMsgBase* IsMessage() { return pMsg; };
	void SetEmpty() { pMsg=NULL; };
	bool SetMessage(export class CO_NetMsgBase *);
	int IsClassId();
public: // archive methods
	int ReadFrom(char *);
	int WriteTo(char *);
};

#endif
*/