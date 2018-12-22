//-----------------------------------------------------------------------------
//	ログイン要求電文
//-----------------------------------------------------------------------------
const RCLoginRequestMsg = {
	msgType: "LOGIN_REQUEST",
	sid: "",
}

//-----------------------------------------------------------------------------
//	ログイン応答電文
//-----------------------------------------------------------------------------
const RCLoginAckMsg = {
	msgType: "LOGIN_ACK",
	yobine: {
		yobineList
	}
};

//-----------------------------------------------------------------------------
//	DEPTH登録要求電文
//-----------------------------------------------------------------------------
const RCDepthRegistRequestMsg = {
	msgType: "DEPTH_REGIST_REQUEST",
	secType: "0",							// 商品種類("0":株式,"1":先物)
	handle: 1,								// ハンドル
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
};

//-----------------------------------------------------------------------------
//	DEPTHデータ
//-----------------------------------------------------------------------------
const RCDepthData = {
	price: {								// 値段
		type: "1",								// "0":値段無し, "1":値段有り, "2":成行
		decimalPoint:"0",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
		data: 650
	},
	type: 0,								// 更新タイプ (0:Update,1:Delete)
	bidAsk: 0,								// 売買区分 (0:Bid,1:Ask)
	closeLot: 1600,							// FSAV,FSBV 引け注文数量
	closeCount: 6,							// FSAQ,FSBQ 引け注文件数
	lot: 300,								// FCAV,FCBV 注文数量
	count: 1,								// FCAQ,FCBQ 件数
	status: 0,								// FQAS,FQBS 気配ステータス
	center: 0,								// FPAF,FPBF 板中心価格符号
	cross: 0,								// FFAF,FFBF 気配対等符号
};

//-----------------------------------------------------------------------------
//	DEPTH登録応答電文
//-----------------------------------------------------------------------------
const RCDepthRegistAckMsg = {
	msgType: "DEPTH_REGIST_ACK",			// メッセージ種別
	secType: "0",							// 商品種類("0":株式,"1":先物)
	handle: 1,								// ハンドル
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
	status: 0,								// ステータス
	name: "日立製作所",						// マスタ情報:銘柄名
	yobineNumber: 101,						// マスタ情報:呼値単位番号
	basePrice : {							// マスタ情報:基準値
		type: "1",								// "0":値段無し, "1":値段有り, "2":成行
		decimalPoint:"0",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
		data: 750
	},
	updateNumber : 0,						// FNO		更新番号
	updateNumberTime : 20180814092528,		// FNOT		更新番号:時刻
	stopFlag : 0,							// FRGS		規制フラグ
	quoteStatus : 0,						// FQTS		QUOTEステータス
	nowPrice : {							// FDPP		現在値
		type: "1",								// "0":値段無し, "1":値段有り, "2":成行
		decimalPoint:"0",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
		data: 750
	},
	nowTime : 20180814092528,				// FDPP:T	現在値:時刻
	nowPriceFlag : 0,						// FDPF		日通し現値始値終値識別
	nowStatus : 0,							// FDPS		ステータス
	nowStatusTime : 20180814092528,			// FDPS:T	ステータス:時刻
	netChange : {							// FYWP		前日比・騰落幅
		type: "1",								// "0":値段無し, "1":値段有り, "2":成行
		decimalPoint:"0",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
		data: 120
	},
	netChangeRatio : {						// FYRP		前日比・騰落率
		type: "1",								// "0":値段無し, "1":値段有り, "2":成行
		decimalPoint:"1",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
		data: 1016
	},
	shortFlag : 0,							// FKARA	空売規制符号
	shortFlagTime : 20180814092528,			// FKARA:T	空売規制符号:時刻
	volume : 600,							// FDV		売買高
	volumeTime : 20180814092528,			// FDV:T	売買高:時刻
	lastTradeLot : 200,						// FXV		約定値にかかる売買高
	depthDataList : [						// DEPTHデータリスト
		{
			price: {								// 値段
				type: "1",								// "0":値段無し, "1":値段有り, "2":成行
				decimalPoint:"0",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
				data: 750
			},
			type: 0,								// 更新タイプ (0:Update,1:Delete)
			bidAsk: 0,								// 売買区分 (0:Bid,1:Ask)
			closeLot: 1600,							// FSAV,FSBV 引け注文数量
			closeCount: 6,							// FSAQ,FSBQ 引け注文件数
			lot: 300,								// FCAV,FCBV 注文数量
			count: 1,								// FCAQ,FCBQ 件数
			status: 0,								// FQAS,FQBS 気配ステータス
			center: 0,								// FPAF,FPBF 板中心価格符号
			cross: 0,								// FFAF,FFBF 気配対等符号
		},
//		...
	]
};

//-----------------------------------------------------------------------------
//	DEPTH解除要求電文
//-----------------------------------------------------------------------------
const RCDepthUnregistRequestMsg = {
	msgType: "DEPTH_UNREGIST_REQUEST",
	secType: "0",							// 商品種類("0":株式,"1":先物)
	handle: 1,								// ハンドル
};

//-----------------------------------------------------------------------------
//	DEPTH解除応答電文
//-----------------------------------------------------------------------------
const RCDepthUnregistAckMsg = {
	msgType: "DEPTH_UNREGIST_ACK",
	secType: "0",							// 商品種類("0":株式,"1":先物)
	handle: 1,								// ハンドル
	status: 0,								// ステータス
};

//-----------------------------------------------------------------------------
//	DEPTH更新電文
//-----------------------------------------------------------------------------
const RCDepthRealMsg = {
	msgType: "DEPTH_REAL",					// メッセージ種別
	secType: "0",							// 商品種類("0":株式,"1":先物)
	handle: 1,								// ハンドル
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
	initFlag: 0,							// 初期化符号
	updateNumber : 0,						// FNO		更新番号
	updateNumberTime : 20180814092528,		// FNOT		更新番号:時刻
	stopFlag : 0,							// FRGS		規制フラグ
	quoteStatus : 0,						// FQTS		QUOTEステータス
	nowPrice : {							// FDPP		現在値
		type: "1",								// "0":値段無し, "1":値段有り, "2":成行
		decimalPoint:"0",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
		data: 750
	},
	nowTime : 20180814092528,				// FDPP:T	現在値:時刻
	nowPriceFlag : 0,						// FDPF		日通し現値始値終値識別
	nowStatus : 0,							// FDPS		ステータス
	nowStatusTime : 20180814092528,			// FDPS:T	ステータス:時刻
	netChange : {							// FYWP		前日比・騰落幅
		type: "1",								// "0":値段無し, "1":値段有り, "2":成行
		decimalPoint:"0",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
		data: 20
	},
	netChangeRatio : {						// FYRP		前日比・騰落率
		type: "1",								// "0":値段無し, "1":値段有り, "2":成行
		decimalPoint:"1",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
		data: 1016
	},
	shortFlag : 0,							// FKARA	空売規制符号
	shortFlagTime : 20180814092528,			// FKARA:T	空売規制符号:時刻
	volume : 600,							// FDV		売買高
	volumeTime : 20180814092528,			// FDV:T	売買高:時刻
	lastTradeLot : 200,						// FXV		約定値にかかる売買高
	depthDataList : [						// DEPTHデータリスト
		{
			price: {								// 値段
				type: "1",								// "0":値段無し, "1":値段有り, "2":成行
				decimalPoint:"0",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
				data: 750
			},
			type: 0,								// 更新タイプ (0:Update,1:Delete)
			bidAsk: 0,								// 売買区分 (0:Bid,1:Ask)
			closeLot: 1600,							// FSAV,FSBV 引け注文数量
			closeCount: 6,							// FSAQ,FSBQ 引け注文件数
			lot: 300,								// FCAV,FCBV 注文数量
			count: 1,								// FCAQ,FCBQ 件数
			status: 0,								// FQAS,FQBS 気配ステータス
			center: 0,								// FPAF,FPBF 板中心価格符号
			cross: 0,								// FFAF,FFBF 気配対等符号
		},
//		...
	]
};

//-----------------------------------------------------------------------------
//	DEPTH登録解除電文
//-----------------------------------------------------------------------------
const RCDepthDisableMsg = {
	msgType: "DEPTH_DISABLE",				// メッセージ種別
	secType: "0",							// 商品種類("0":株式,"1":先物)
};

//-----------------------------------------------------------------------------
//	フル板データ
//-----------------------------------------------------------------------------
const RCBoardData = {
	price: {								// 値段
		type: "1",								// "0":値段無し, "1":値段有り, "2":成行
		decimalPoint:"0",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
		data: 750
	},
	closeLot: {								// 引け注文数量(bid:売,ask:買)
		bid: 500,
		ask: 300,
	},
	totalLot: {								// 引け注文数量(bid:売,ask:買)
		bid: 2900,
		ask: 1700,
	},
	lot: {									// 注文数量(bid:売,ask:買)
		bid: 300,
		ask: 200,
	},
	closeCount: {							// 引け注文件数(bid:売,ask:買)
		bid: 2,
		ask: 1,
	},
	count: {								// 注文件数(bid:売,ask:買)
		bid: 16,
		ask: 10,
	},
	status: {								// 気配ステータス(bid:売,ask:買)
		bid: 0,
		ask: 1,
	},
	cross: {								// 気配対等符号フラグ(bid:売,ask:買)
		bid: 0,
		ask: 0,
	},
};

//-----------------------------------------------------------------------------
//	フル板更新電文
//-----------------------------------------------------------------------------
const RCBoardRealMsg = {
	msgType: "BOARD_REAL",					// メッセージ種別
	handle: 1,								// ハンドル
	issueCode: "6501",						// 銘柄コード
	marketCode: "00",						// 市場コード
	status : 0,								// ステータス
	tickType: 0,							// 呼値の単位番号
	updateNumber : 0,						// 更新番号
	updateNumberTime : 20180814092528,		// 更新番号:時刻
	stopFlag : 0,							// 規制フラグ
	quoteStatus : 0,						// QUOTEステータス
	nowPrice : {							// 現在値
		type: "1",								// "0":値段無し, "1":値段有り, "2":成行
		decimalPoint:"0",						// "0":小数点なし, "1"小数点1桁, "2":小数点2桁...
		data: 750
	},
	nowTime : 20180814092528,				// 現在値:時刻
	nowPriceFlag : 0,						// 日通し現値始値終値識別
	nowStatus : 0,							// ステータス
	nowStatusTime : 20180814092528,			// ステータス:時刻
	shortFlag : 0,							// 空売規制符号
	shortFlagTime : 20180814092528,			// 空売規制符号:時刻
	volume : 600,							// 売買高
	volumeTime : 20180814092528,			// 売買高:時刻
	lastTradeLot : 200,						// 約定値にかかる売買高
	boardDataList : [						// フル板データリスト
		{
			price: 792,								// 値段
			closeLot: {								// 引け注文数量(bid:売,ask:買)
				bid: 500,
				ask: 300,
			},
			totalLot: {								// 引け注文数量(bid:売,ask:買)
				bid: 2900,
				ask: 1700,
			},
			lot: {									// 注文数量(bid:売,ask:買)
				bid: 300,
				ask: 200,
			},
			closeCount: {							// 引け注文件数(bid:売,ask:買)
				bid: 2,
				ask: 1,
			},
			count: {								// 注文件数(bid:売,ask:買)
				bid: 16,
				ask: 10,
			},
			status: {								// 気配ステータス(bid:売,ask:買)
				bid: 0,
				ask: 1,
			},
			cross: {								// 気配対等符号フラグ(bid:売,ask:買)
				bid: 0,
				ask: 0,
			},
		},
//		...
	]
};

//-----------------------------------------------------------------------------
//	気配登録要求電文
//-----------------------------------------------------------------------------
const RCFeedRegistRequestMsg = {
	msgType: "FEED_REGIST_REQUEST",			// メッセージ種別
	handle: 1,								// ハンドル
	source: 1,								// 情報ソース
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
};

//-----------------------------------------------------------------------------
//	気配データ
//-----------------------------------------------------------------------------
const RCFeedData = {
	name: "GAV1",							// 項目名
	status: "0",							// ステータス
	serial: 21,								// 管理番号
	data: 400,								// データ
};

//-----------------------------------------------------------------------------
//	気配登録応答電文
//-----------------------------------------------------------------------------
const RCFeedRegistAckMsg = {
	msgType: "FEED_REGIST_ACK",				// メッセージ種別
	handle: 1,								// ハンドル
	source: 1,								// 情報ソース
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
	status: "A00",							// ステータス
	name: "日立製作所",						// マスタ情報:銘柄名
	unitLot: 100,							// マスタ情報:単位株数
	feedDataList: [							// Feedデータリスト
		{
			name: "GAV1",							// 項目名
			status: "0",							// ステータス
			serial: 21,								// 管理番号
			data: 400,								// データ
		},
//		...
	]
};

//-----------------------------------------------------------------------------
//	気配解除要求電文
//-----------------------------------------------------------------------------
const RCFeedUnregistRequestMsg = {
	msgType: "FEED_UNREGIST_REQUEST",		// メッセージ種別
	handle: 1,								// ハンドル
};

//-----------------------------------------------------------------------------
//	気配解除応答電文
//-----------------------------------------------------------------------------
const RCFeedUnregistAckMsg = {
	msgType: "FEED_UNREGIST_ACK",			// メッセージ種別
	handle: 1,								// ハンドル
	status: "000",							// ステータス
};

//-----------------------------------------------------------------------------
//	気配更新電文
//-----------------------------------------------------------------------------
const RCFeedRealMsg = {
	msgType: "FEED_REAL",					// メッセージ種別
	handle: 1,								// ハンドル
	source: 1,								// 情報ソース
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
	feedDataList: [							// Feedデータリスト
		{
			name: "GAV1",							// 項目名
			status: "0",							// ステータス
			serial: 21,								// 管理番号
			data: 400,								// データ
		},
//		...
	]
};

//-----------------------------------------------------------------------------
//	気配登録解除電文
//-----------------------------------------------------------------------------
const RCFeedDisableMsg = {
	msgType: "FEED_DISABLE",				// メッセージ種別
};

//-----------------------------------------------------------------------------
//	ニュースヘッドライン
//-----------------------------------------------------------------------------
/*
const RCNewsHeadline = {
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
	friend ostream& operator<<(ostream&, const class RCNewsHeadline&);
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
const RCTickData = {
	number: 61,								// TICK番号
	date: 20180814,							// 日付(YYYYMMDD)
	time: 090647,							// 時刻(HHMMSS)
	price: 865,								// 約定値段
	volume: 400,							// 約定数量
	VWAP: 850,								// VWAP
};

//-----------------------------------------------------------------------------
//	ティックエントリデータリスト
//-----------------------------------------------------------------------------
const RCTickList = {
	maxData: 16,							// 最大個数
	lastClose: 780,							// 前営業日終値
	lastTickDate: 20180814090647,			// 最終TICK日時
	lastTickNum: 61,			 			// 最終TICK番号
	lastBaseDay: 20180813,					// 直近株価修正日
	dataType: 0,							// 種類
	list: [									// データリスト
		{
			number: 61,								// TICK番号
			date: 20180814,							// 日付(YYYYMMDD)
			time: 090647,							// 時刻(HHMMSS)
			price: 865,								// 約定値段
			volume: 400,							// 約定数量
			VWAP: 850,								// VWAP
		},
//		...
	],
};

//-----------------------------------------------------------------------------
//	ヒストリカルエントリデータ
//-----------------------------------------------------------------------------
const RCHistData = {
	date: 20180814,							// 日付(YYYYMMDD)
	time: 091543,							// 時刻(HHMM)
	reasonCode: 0,							// 不連続要因発生コード
	open: 780,								// 始値
	high: 860,								// 高値
	low: 770,								// 安値
	close: 0,								// 終値
	volume: 1100,							// 出来高
	ratioPrice: 0,							// 相対対象値段
	SBalance: 600,							// 信用売残
	BBalance: 500,							// 信用買残
	VWAP: 850,								// VWAP
};

//-----------------------------------------------------------------------------
//	ヒストリカルエントリデータリスト
//-----------------------------------------------------------------------------
const RCHistList = {
	lastClose: 780,							// 前営業日終値
	lastTickDate: 20180814090647,			// 最終TICK日時
	lastTickNum: 61,			 			// 最終TICK番号
	lastBaseDay: 20180813,					// 直近株価修正日
	dataType: 0,							// 種類
	list: [									// データリスト
		{
			date: 20180814,							// 日付(YYYYMMDD)
			time: 091543,							// 時刻(HHMM)
			reasonCode: 0,							// 不連続要因発生コード
			open: 780,								// 始値
			high: 860,								// 高値
			low: 770,								// 安値
			close: 0,								// 終値
			volume: 1100,							// 出来高
			ratioPrice: 0,							// 相対対象値段
			SBalance: 600,							// 信用売残
			BBalance: 500,							// 信用買残
			VWAP: 850,								// VWAP
		},
//		...
	],
};

//-----------------------------------------------------------------------------
//	ティック登録要求電文
//-----------------------------------------------------------------------------
const RCTickRegistRequestMsg = {
	msgType: "TICK_REGIST_REQUEST",			// メッセージ種別
	handle: 1,								// ハンドル
	source: 1,								// 情報ソース
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
	type: 0,								// 取得タイプ[0:FULL,1:MONTHLY,2:WEEKLY,3:DAILY,4:MINTES,5:10TICK]
	adjust: 1,								// 株価修正タイプ[0:有,1:無]
};

//-----------------------------------------------------------------------------
//	ティック登録応答電文
//-----------------------------------------------------------------------------
const RCTickRegistAckMsg = {
	msgType: "TICK_REGIST_ACK",				// メッセージ種別
	handle: 1,								// ハンドル
	source: 1,								// 情報ソース
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
	status: 1,								// ステータス
	type: 0,								// 取得タイプ[0:FULL,1:MONTHLY,2:WEEKLY,3:DAILY,4:MINTES,5:10TICK]
	adjust: 1,								// 株価修正タイプ[0:有,1:無]
	tickList: {								// ティックエントリデータリスト
		maxData: 16,							// 最大個数
		lastClose: 780,							// 前営業日終値
		lastTickDate: 20180814090647,			// 最終TICK日時
		lastTickNum: 61,			 			// 最終TICK番号
		lastBaseDay: 20180813,					// 直近株価修正日
		dataType: 0,							// 種類
		list: [									// データリスト
			{
				number: 61,								// TICK番号
				date: 20180814,							// 日付(YYYYMMDD)
				time: 090647,							// 時刻(HHMMSS)
				price: 865,								// 約定値段
				volume: 400,							// 約定数量
				VWAP: 850,								// VWAP
			},
//			...
		],
	},
	histList: {								// ヒストリカルエントリデータリスト
		lastClose: 780,							// 前営業日終値
		lastTickDate: 20180814090647,			// 最終TICK日時
		lastTickNum: 61,			 			// 最終TICK番号
		lastBaseDay: 20180813,					// 直近株価修正日
		dataType: 0,							// 種類
		list: [									// データリスト
			{
				date: 20180814,							// 日付(YYYYMMDD)
				time: 091543,							// 時刻(HHMM)
				reasonCode: 0,							// 不連続要因発生コード
				open: 780,								// 始値
				high: 860,								// 高値
				low: 770,								// 安値
				close: 0,								// 終値
				volume: 1100,							// 出来高
				ratioPrice: 0,							// 相対対象値段
				SBalance: 600,							// 信用売残
				BBalance: 500,							// 信用買残
				VWAP: 850,								// VWAP
			},
//			...
		],
	}
};

//-----------------------------------------------------------------------------
//	ティック解除要求電文
//-----------------------------------------------------------------------------
const RCTickUnregistRequestMsg = {
	msgType: "TICK_UNREGIST_REQUEST",		// メッセージ種別
	handle: 1,								// ハンドル
};

//-----------------------------------------------------------------------------
//	ティック解除応答電文
//-----------------------------------------------------------------------------
const RCTickUnregistAckMsg = {
	msgType: "TICK_UNREGIST_REQUEST",		// メッセージ種別
	handle: 1,								// ハンドル
	status: 0,								// ステータス
};

//-----------------------------------------------------------------------------
//	ティック更新電文
//-----------------------------------------------------------------------------
const RCTickRealMsg = {
	msgType: "TICK_REAL",					// メッセージ種別
	handle: 1,								// ハンドル
	source: 1,								// 情報ソース
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
	tickList: {								// ティックデータリスト
		maxData: 16,							// 最大個数
		lastClose: 780,							// 前営業日終値
		lastTickDate: 20180814090647,			// 最終TICK日時
		lastTickNum: 61,			 			// 最終TICK番号
		lastBaseDay: 20180813,					// 直近株価修正日
		dataType: 0,							// 種類
		list: [									// データリスト
			{
				number: 61,								// TICK番号
				date: 20180814,							// 日付(YYYYMMDD)
				time: 090647,							// 時刻(HHMMSS)
				price: 865,								// 約定値段
				volume: 400,							// 約定数量
				VWAP: 850,								// VWAP
			},
//			...
		],
	},
};

//-----------------------------------------------------------------------------
//	ティック登録解除電文
//-----------------------------------------------------------------------------
const RCTickUnregistRequestMsg = {
	msgType: "TICK_DISABLE",				// メッセージ種別
};

//-----------------------------------------------------------------------------
//	ティック取得要求電文
//-----------------------------------------------------------------------------
const RCTickGetRequestMsg = {
	msgType: "TICK_GET_REQUEST",			// メッセージ種別
	handle: 1,								// ハンドル
	source: 1,								// 情報ソース
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
	type: 0,								// 取得タイプ[0:FULL,1:MONTHLY,2:WEEKLY,3:DAILY,4:MINTES,5:10TICK]
	adjust: 1,								// 株価修正タイプ[0:有,1:無]
};

//-----------------------------------------------------------------------------
//	ティック取得応答電文
//-----------------------------------------------------------------------------
const RCTickGetAckMsg = {
	msgType: "TICK_GET_ACK",				// メッセージ種別
	handle: 1,								// ハンドル
	source: 1,								// 情報ソース
	marketCode: "00",						// 市場コード
	issueCode: "6501",						// 銘柄コード
	status: 1,								// ステータス
	type: 0,								// 取得タイプ[0:FULL,1:MONTHLY,2:WEEKLY,3:DAILY,4:MINTES,5:10TICK]
	adjust: 1,								// 株価修正タイプ[0:有,1:無]
	tickList: {								// ティックデータリスト
		maxData: 16,							// 最大個数
		lastClose: 780,							// 前営業日終値
		lastTickDate: 20180814090647,			// 最終TICK日時
		lastTickNum: 61,			 			// 最終TICK番号
		lastBaseDay: 20180813,					// 直近株価修正日
		dataType: 0,							// 種類
		list: [									// データリスト
			{
				number: 61,								// TICK番号
				date: 20180814,							// 日付(YYYYMMDD)
				time: 090647,							// 時刻(HHMMSS)
				price: 865,								// 約定値段
				volume: 400,							// 約定数量
				VWAP: 850,								// VWAP
			},
//			...
		],
	},
	histList: {								// ヒストリカルエントリデータリスト
		lastClose: 780,							// 前営業日終値
		lastTickDate: 20180814090647,			// 最終TICK日時
		lastTickNum: 61,			 			// 最終TICK番号
		lastBaseDay: 20180813,					// 直近株価修正日
		dataType: 0,							// 種類
		list: [									// データリスト
			{
				date: 20180814,							// 日付(YYYYMMDD)
				time: 091543,							// 時刻(HHMM)
				reasonCode: 0,							// 不連続要因発生コード
				open: 780,								// 始値
				high: 860,								// 高値
				low: 770,								// 安値
				close: 0,								// 終値
				volume: 1100,							// 出来高
				ratioPrice: 0,							// 相対対象値段
				SBalance: 600,							// 信用売残
				BBalance: 500,							// 信用買残
				VWAP: 850,								// VWAP
			},
//			...
		],
	}
};
/*
//-----------------------------------------------------------------------------
//	株価ボードデータ
//-----------------------------------------------------------------------------
const RCKabukaBoardData = {
	pageNumber: 1,							// ページ番号
	rowNumber: 1,							// 行番号
	issueCode: "6501",						// 銘柄コード
	marketCode: "00",						// 市場コード
}

//-----------------------------------------------------------------------------
//	株価ボードデータリスト
//-----------------------------------------------------------------------------
const RCKabukaBoardDataList = {
	list: [									// 株価ボードデータリスト
		{
			pageNumber: 1,							// ページ番号
			rowNumber: 1,							// 行番号
			issueCode: "6501",						// 銘柄コード
			marketCode: "00",						// 市場コード
		},
//		...
	],
}

//-----------------------------------------------------------------------------
//	株価ボード登録内容電文
//-----------------------------------------------------------------------------
const RCKabukaBoardMsg = {
	msgType: "KABUKA_BOARD",				// メッセージ種別
	list: [									// 株価ボードデータリスト
		{
			pageNumber: 1,							// ページ番号
			rowNumber: 1,							// 行番号
			issueCode: "6501",						// 銘柄コード
			marketCode: "00",						// 市場コード
		},
//		...
	],
};

//-----------------------------------------------------------------------------
//	株価ボード保存要求電文
//-----------------------------------------------------------------------------
const RCKabukaBoardSaveRequestMsg = {
	msgType: "KABUKA_BOARD_SAVE_REQUEST",	// メッセージ種別
	list: [									// 株価ボードデータリスト
		{
			pageNumber: 1,							// ページ番号
			rowNumber: 1,							// 行番号
			issueCode: "6501",						// 銘柄コード
			marketCode: "00",						// 市場コード
		},
//		...
	],
};

//-----------------------------------------------------------------------------
//	株価ボード保存応答電文
//-----------------------------------------------------------------------------
const RCKabukaBoardSaveRequestMsg = {
	msgType: "KABUKA_BOARD_SAVE_ACK",		// メッセージ種別
	resultCode: 0,							// 結果コード
};
*/
//-----------------------------------------------------------------------------
//	取引条件データ
//-----------------------------------------------------------------------------
/*
const RCTorihikiZyoukenData = {
	torihikiSyubetu: "0",					// 取引種別
	orderSuryou: 200,						// 注文数量
	OrderExpireDay: 20180821,				// 注文期日
};
*/
//-----------------------------------------------------------------------------
//	取引条件データリスト
//-----------------------------------------------------------------------------
/*
const RCTorihikiZyoukenDataList = {
	list: [									// 取引条件データリスト
		{
			torihikiSyubetu: "0",					// 取引種別
			orderSuryou: 200,						// 注文数量
			OrderExpireDay: 20180821,				// 注文期日
		},
//		...
	],
}
*/
//-----------------------------------------------------------------------------
//	取引条件登録内容電文
//-----------------------------------------------------------------------------
/*
const RCTorihikiZyoukenMsg = {
	msgType: "TORIHIKI_ZYOUKEN",			// メッセージ種別
	list: [									// 取引条件データリスト
		{
			torihikiSyubetu: "0",					// 取引種別
			orderSuryou: 200,						// 注文数量
			OrderExpireDay: 20180821,				// 注文期日
		},
//		...
	],
};
*/
//-----------------------------------------------------------------------------
//	取引条件保存要求電文
//-----------------------------------------------------------------------------
/*
const RCTorihikiZyoukenSaveRequestMsg = {
	msgType: "TORIHIKI_ZYOUKEN_SAVE_REQUEST",	// メッセージ種別
	list: [									// 取引条件データリスト
		{
			torihikiSyubetu: "0",					// 取引種別
			orderSuryou: 200,						// 注文数量
			OrderExpireDay: 20180821,				// 注文期日
		},
//		...
	],
};
*/
//-----------------------------------------------------------------------------
//	取引条件保存応答電文
//-----------------------------------------------------------------------------
/*
const RCKabukaBoardSaveRequestMsg = {
	msgType: "TORIHIKI_ZYOUKEN_SAVE_ACK",	// メッセージ種別
	resultCode: 0,							// 結果コード
};
*/
/*
//-----------------------------------------------------------------------------
//	銘柄条件データ
//-----------------------------------------------------------------------------
const RCMeigaraZyoukenData = {
	resultCode: 0,							// 銘柄コード
	torihikiSyubetu: "0",					// 取引種別
	orderSuryou: 200,						// 注文数量
	orderExpireDay: 20180821,				// 注文期日
}

//-----------------------------------------------------------------------------
//	銘柄条件データリスト
//-----------------------------------------------------------------------------
const RCMeigaraZyoukenDataList = {
	list: [									// 銘柄条件データリスト
		{
			resultCode: 0,							// 銘柄コード
			torihikiSyubetu: "0",					// 取引種別
			orderSuryou: 200,						// 注文数量
			orderExpireDay: 20180821,				// 注文期日
		},
//		...
	],
}

//-----------------------------------------------------------------------------
//	銘柄条件登録内容電文
//-----------------------------------------------------------------------------
const RCMeigaraZyoukenMsg = {
	msgType: "MEIGARA_ZYOUKEN",				// メッセージ種別
	list: [									// 銘柄条件データリスト
		{
			resultCode: 0,							// 銘柄コード
			torihikiSyubetu: "0",					// 取引種別
			orderSuryou: 200,						// 注文数量
			orderExpireDay: 20180821,				// 注文期日
		},
//		...
	],
};

//-----------------------------------------------------------------------------
//	銘柄条件保存要求電文
//-----------------------------------------------------------------------------
const RCMeigaraZyoukenSaveRequestMsg = {
	msgType: "MEIGARA_ZYOUKEN_SAVE_REQUEST",// メッセージ種別
	list: [									// 銘柄条件データリスト
		{
			resultCode: 0,							// 銘柄コード
			torihikiSyubetu: "0",					// 取引種別
			orderSuryou: 200,						// 注文数量
			orderExpireDay: 20180821,				// 注文期日
		},
//		...
	],
};

//-----------------------------------------------------------------------------
//	銘柄条件保存応答電文
//-----------------------------------------------------------------------------
const RCMeigaraZyoukenSaveAckMsg = {
	msgType: "MEIGARA_ZYOUKEN_SAVE_ACK",	// メッセージ種別
	resultCode: 0,							// 結果コード
};

//-----------------------------------------------------------------------------
//	ポジション再送要求電文
//-----------------------------------------------------------------------------
const RCPositionResendRequestMsg = {
	msgType: "POSITION_RESEND_REQUEST",		// メッセージ種別
	type: 1,								// 1:保管証券,2:信用建玉,3:派生建玉
};

//-----------------------------------------------------------------------------
//	ポジション再送応答電文
//-----------------------------------------------------------------------------
const RCPositionResendAckMsg = {
	msgType: "POSITION_RESEND_ACK",			// メッセージ種別
	type: 1,								// 1:保管証券,2:信用建玉,3:派生建玉
	resultCode: 0,							// 結果コード
};

//-----------------------------------------------------------------------------
//	生存監視電文
//-----------------------------------------------------------------------------
const RCKeepAliveMsg = {
	msgType: "KEEP_ALIVE",					// メッセージ種別
	time: 20180815152534,					// 時刻
};

//-----------------------------------------------------------------------------
//	生存報告電文
//-----------------------------------------------------------------------------
const RCKeepAliveMsg = {
	msgType: "ALIVE_REPORT",				// メッセージ種別
	sid: "4d6f47g6e7ygfr",					// セッションID
};
*/

