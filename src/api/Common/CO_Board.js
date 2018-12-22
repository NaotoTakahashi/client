//////////////////////////////////////////////////////////////////////
// エラーオブジェクト
//////////////////////////////////////////////////////////////////////
export const BOARD_ERRCODE = {
	NORMAL: 0,
	NOT_FOUND_SOCKET: 1,		// ソケットなし
	NOT_FOUND_CLHANDLE: 2,		// 下位ハンドルなし
	NOT_FOUND_SVHANDLE: 3,		// 上位ハンドルなし
	REGIST_OVER: 4,				// 最大登録件数超過
	NO_DATA: 5,					// データ未受信
}

export class CO_BoardErrorObj {
	constructor(errcode=0) {
		this.errCode = errcode;
	}
	clear() {
		this.errCode = 0;
	}
	set(errcode) {
		if(errcode) this.errCode = errcode;
	}
	get() {
		return this.errCode;
	}
}
//////////////////////////////////////////////////////////////////////
// ハンドルと値段
//////////////////////////////////////////////////////////////////////
class CO_HandlePrice {
	constructor(handle=0, priceType=0, priceDec=0, price=0) {
		this.handle = handle;				// ハンドル
		this.priceType = priceType;			// 値段種別(1:値段有効)
		this.priceDec = priceDec;			// 値段表示桁数
		this.price = price;					// 値段
	}
};

//////////////////////////////////////////////////////////////////////
// ハンドル管理
//////////////////////////////////////////////////////////////////////
export class CO_BoardSVHandles {
	constructor(registHandle=0, registSecType=" ", unRegistHandle=0, unRegistSecType=" ") {
		this.registHandle = registHandle;
		this.registSecType = registSecType;
		this.unRegistHandle = unRegistHandle;
		this.unRegistSecType = unRegistSecType;
	}
}

class CO_HandlePriceMap {
	constructor() {
		return new Map();
	}
	// key:handle, value:CO_HandlePrice
};

class CO_BoardHandle {
	constructor() {
		this.map = new CO_HandlePriceMap();
	}
	clear() {this.map.clear();}
	add(handle, priceType, dec, price) {
		if(!this.map.has(handle)) {
			// 追加
			let handlePrice = new CO_HandlePrice(handle, priceType, dec, price);
			this.map.set(handle, handlePrice);
		} else {
			// 更新
			let handlePrice = this.map.get(handle);
			handlePrice.priceType = priceType;
			handlePrice.priceDec = dec;
			handlePrice.price = price;
		}
		return true;
	}
	remove(handle) {
		if(!this.map.has(handle)) {
			return false;
		}
		this.map.delete(handle);
		return true;
	}
};

//////////////////////////////////////////////////////////////////////
// フル板データ
//////////////////////////////////////////////////////////////////////
function unionCode(source, market, issueCode) {
	if((source === undefined || source === null) || (market === undefined || market === null) || !issueCode) return undefined;
	return source + "," + market + "," + issueCode;
}
function splitCode(code) {
	if(!code) return undefined;
	const codeList = code.split(",");
	if(codeList.length !==3 ) return undefined;
	return {
		source: Number(codeList[0]),
		marketCode: codeList[1],
		issueCode: codeList[2],
	};
}
class CO_PriceDec {
	constructor(price=0, dec=0) {
		this.price = price;
		this.dec = dec;
	}
};

export class CO_OfferedPriceData {
	constructor(offeredNumber=0, price=0, offeredPrice=0, priceDec=0) {
		this.offeredNumber = offeredNumber;		// ティックタイプ(呼値単位番号)
		this.price = price;						// 値段
		this.offeredPrice = offeredPrice;		// 呼値
		this.priceDec = priceDec;				// 値段表示桁数
	}
};

class CO_OfferdPriceDataMap {
	constructor() {
		return new Map();
	}
	// key: price, value,: CO_OfferedPriceData
};

class CO_TypeOfferedPriceMap {
	constructor() {
		return new Map();
	}
	// key: offeredNumber, value,: CO_OfferdPriceDataMap
};

// 引数の小数点以下の桁数を返す
/*
function getDecimalLength(a) {
	let list = (a + '').split('.'), ret = 0;
	if(list[1] !== undefined && list[1].length > 0) {
		ret = list[1].length;
	}
	return ret;
};
*/

// a:切捨対象数, dec:切捨桁数(負数は小数桁数)
function floor(a, dec=0) {
	if(dec===0) return Math.floor(a);
	let ret = a;
	const b = 10**(-dec);
	ret = a * b;
	ret = Math.floor(ret);
	ret = ret / b;
	return ret;
};

// a:被除数, b:除数, dec:有効小数桁
function mod(a, b, dec=0) {
	if(a < b) return a;
	if(a === b) return 0;
	const d = 10**dec;
	const a1 = a * d;
	const a2 = Math.floor(a1);
	const b1 = b * d;
	const b2 = Math.floor(b1);
	return (a2%b2) / d;
};

function add(a, b, dec=0) {
	const d = 10**dec;
	const a1 = a * d;
	const a2 = Math.floor(a1);
	const b1 = b * d;
	const b2 = Math.floor(b1);
	return (a2+b2) / d;
}

function sub(a, b, dec=0) {
	const d = 10**dec;
	const a1 = a * d;
	const a2 = Math.floor(a1);
	const b1 = b * d;
	const b2 = Math.floor(b1);
	return (a2-b2) / d;
}

export class CO_OfferdPrice {
	constructor() {
		this.map = new CO_TypeOfferedPriceMap();
	}
	// 呼値と桁数を取得
	getOfferedPrice(offeredNumber, price, outPriceDec) {
		price = Number(price);
		if(!this.map.has(offeredNumber)) return false;
		let offerdPriceDataMap = this.map.get(offeredNumber);
		let minBorderPrice = undefined;
		for(let keyPrice of offerdPriceDataMap.keys()) {
			if(price < keyPrice && (minBorderPrice === undefined || minBorderPrice > keyPrice)) {
				minBorderPrice = keyPrice;
			}
		}
		if(offerdPriceDataMap.has(minBorderPrice)) {
			let offerdPriceData = offerdPriceDataMap.get(minBorderPrice);
			outPriceDec.price = offerdPriceData.offeredPrice;
			outPriceDec.dec = offerdPriceData.priceDec;
			return true;
		}
		return false;
	}
	// 値段を呼値単位で切り捨て
	floorTick(offeredNumber, price) {
		price=Number(price);
		let retPriceDec = new CO_PriceDec();
		if(this.getOfferedPrice(offeredNumber, price, retPriceDec)) {
			let a = price;
			let b = retPriceDec.price;
			let c = mod(a, b, retPriceDec.dec);
			b = a - c;
			retPriceDec.price = floor(b, -(retPriceDec.dec));
		}
		return retPriceDec;
	}
	// 値段をn価上げる n=tick
	upTick(offeredNumber, price, tick) {
		price=Number(price);
		let retPriceDec = new CO_PriceDec(price);
		let offered = new CO_PriceDec();
		if(!this.getOfferedPrice(offeredNumber, price, offered)) return retPriceDec;
		for(let i=0;i<tick;i++) {
			retPriceDec = this.floorTick(offeredNumber, add(retPriceDec.price, offered.price, offered.dec));
			if(!this.getOfferedPrice(offeredNumber, price, offered)) return retPriceDec;
		}
		return retPriceDec;
	}
	// 値段をn価下げる n=tick
	downTick(offeredNumber, price, tick) {
		price=Number(price);
		let retPriceDec = new CO_PriceDec(price);
		let offered = new CO_PriceDec();
		if(!this.getOfferedPrice(offeredNumber, price, offered)) return retPriceDec;
		for(let i=tick;i>0;i--) {
			let wkPriceDec = this.floorTick(offeredNumber, price);
			if(this.getOfferedPrice(offeredNumber, price, offered)) {
				retPriceDec = this.floorTick(offeredNumber, sub(retPriceDec.price, offered.price, offered.dec));
			} else {
				retPriceDec = wkPriceDec;
			}
			if(!this.getOfferedPrice(offeredNumber, price, offered)) return retPriceDec;
		}
		return retPriceDec;
	}
	// 呼値テーブルに要素を追加
	add(offeredNumber, price, offered, dec) {
		price=Number(price);
		offered=Number(offered);
		dec=Number(dec);
		if(this.map.has(offeredNumber)) {
			const priceMap = this.map.get(offeredNumber);
			if(priceMap.has(price)) {
				let offerdPriceData = priceMap.get(price);
				offerdPriceData.offeredPrice = offered;
				offerdPriceData.dec = dec;
			} else {
				priceMap.set(price, new CO_OfferedPriceData(offeredNumber, price, offered, dec));
			}
		} else {
			const priceMap = new CO_OfferdPriceDataMap();
			const offerdPriceData = new CO_OfferedPriceData(offeredNumber, price, offered, dec);
			this.map.set(offeredNumber, priceMap);
			priceMap.set(price, offerdPriceData);
		}
	}
};

export class CO_PriceDetail {
	constructor(obj) {
		if(!obj) {
			this.priceType = 0;			// 値段種別(1:有効,2:成行)
			this.priceDec = 0;			// 値段表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
			this.price = 0;				// 値段
			this.updateType = 0;		// 更新タイプ (0:Update,1:Delete)
			this.bidAsk = 0;			// 売買区分 (0:Bid,1:Ask)
			this.closeLot = 0;			// FSAV,FSBV 引け注文数量
			this.closeCount = 0;		// FSAQ,FSBQ 引け注文件数
			this.lot = 0;				// FCAV,FCBV 注文数量
			this.count = 0;				// FCAQ,FCBQ 注文件数
			this.status = 0;			// FQAS,FQBS 気配ステータス
			this.center = 0;			// FPAF,FPBF 板中心価格フラグ
			this.cross = 0;				// FFAF,FFBF 気配対等符号フラグ
		} else {
			this.priceType = obj.priceType;
			this.priceDec = obj.priceDec;
			this.price = obj.price;
			this.updateType = obj.updateType;
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
};

class CO_PriceDetailMap {
	constructor() {
		return new Map();
	}
	// key:price, value:CO_PriceDetail
};

export class CO_BoardDepth {
	constructor() {
		this.handle = 0;						// ハンドル
		this.initFlag = 0;						// 初期化符号
		this.code = "";							// ＱＵＯＴＥ
		this.updateNumber = 0;					// FNO		更新番号
		this.updateNumberTime = 0;				// FNOT		更新番号:時刻
		this.stopFlag = 0;						// FRGS		規制フラグ
		this.quoteStatus = 0;					// FQTS		QUOTEステータス
		this.nowPriceType = "1";				// FDPP		現在値種別(1:現在値有効)
		this.nowPriceDec = 0;					// FDDP		現在値表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		this.nowPrice = 0;						// FDPP		現在値
		this.nowTime = 0;						// FDPP:T	現在値:時刻
		this.nowPriceFlag = 0;					// FDPF		日通し現値始値終値識別
		this.nowStatus = 0;						// FDPS		ステータス
		this.nowStatusTime = 0;					// FDPS:T	ステータス:時刻
		this.netChangeType = "0";				// FYWP		前日比・騰落幅種別(1:前日比・騰落幅有効)
		this.netChangeDec = 0;					// FYWP		前日比・騰落幅表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		this.netChange = 0;						// FYWP		前日比・騰落幅
		this.netChangeRatioType = 0;			// FYRP		前日比・騰落率種別(1:前日比・騰落率有効)
		this.netChangeRatio = 0;				// FYRP		前日比・騰落率
		this.shortFlag = 0;						// FKARA	空売規制符号
		this.shortFlagTime = 0;					// FKARA:T	空売規制符号:時刻
		this.trendIndicator = 0;				// FDPG		日通し現値前値比較
		this.lastDayPriceType = 0;				// PRP		前日終値種別(1:現在値有効)
		this.lastDayPriceDec = 0;				// PRP		前日終値表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		this.lastDayPrice = 0;					// PRP		前日終値
		this.volume = 0;						// FDV		売買高
		this.volumeTime = 0;					// FDV:T	売買高:時刻
		this.lastTradeLot = 0;					// FXV		約定値にかかる売買高
		this.dataList = [];						// CO_PriceDetailリスト
	}
};

export class CO_BoardData {
	constructor() {
		this.priceType = "0";					// 値段種別(1:値段有効,2:成行)
		this.priceDec = 0;						// 値段表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		this.price = 0;							// 値段
		this.closeLot = [0, 0];					// 引け注文数量([0]:売,[1]:買)
		this.totalLot = [0, 0];					// 注文数量累計([0]:売,[1]:買)
		this.lot = [0, 0];						// 注文数量([0]:売,[1]:買)
		this.closeCount = [0,0];				// 引け注文件数([0]:売,[1]:買)
		this.count = [0,0];						// 注文件数([0]:売,[1]:買)
		this.status = [0,0];					// 気配ステータス([0]:売,[1]:買)
		this.cross = [0,0];						// 気配対等符号フラグ([0]:売,[1]:買)
	}
};

export const ST_RESULT = {
	ST_ERROR: 128,								// エラー
	ST_INVALIDATE: 129,							// 上位の切断で登録が無効になった
	ST_NOW_ACCESS: 1,							// サーバ問い合わせ中
	ST_NORMAL: 0,								// 正常
}

export const RESULT_REASON = {
	RESULT_NOT_FOUND: 1,						// 銘柄が見つからない
	RESULT_NOT_AVALABLE: 2,						// 上位サーバに問い合わせできない
	RESULT_INVALIDATE: 3,						// 上位の切断で登録が無効になった
	RESULT_DUPLICATE: 4,						// 登録が重複した
	RESULT_COUNT_OVER: 5,						// 登録件数の上限に達した
	RESULT_ID: 6,								// ID不正
	RESULT_PERMISSION: 7,						// パーミッション不正
	RESULT_NONE: 0								// 正常
}

export class CO_BoardReal {
	constructor(obj) {
		if(obj) {
			this.result = obj.result;						// 完了コード
			this.reason = obj.reason;						// 理由コード
			this.clHandle = obj.clHandle;					// ハンドル
			this.code = obj.code;							// 銘柄コード
			this.offeredNumber = obj.offeredNumber;					// 呼値の単位番号
			this.updateNumber = obj.updateNumber;			// 更新番号
			this.updateNumberTime = obj.updateNumberTime;	// 更新番号:時刻
			this.stopFlag = obj.stopFlag;					// 規制フラグ
			this.quoteStatus = obj.quoteStatus;				// QUOTEステータス
			this.nowPriceType = obj.nowPriceType;			// 現在値種別(1:現在値有効)
			this.nowPriceDec = obj.nowPriceDec;				// 現在値表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
			this.nowPrice = obj.nowPrice;					// 現在値
			this.nowTime = obj.nowTime;						// 現在値:時刻
			this.nowPriceFlag = obj.nowPriceFlag;			// 日通し現値始値終値識別
			this.nowStatus = obj.nowStatus;					// ステータス
			this.nowStatusTime = obj.nowStatusTime;			// ステータス:時刻
			this.shortFlag = obj.shortFlag;					// 空売規制符号
			this.shortFlagTime = obj.shortFlagTime;			// 空売規制符号:時刻
			this.volume = obj.volume;						// 売買高
			this.volumeTime = obj.volumeTime;				// 売買高:時刻
			this.lastTradeLot = obj.lastTradeLot;			// 約定値にかかる売買高
			this.dataList = obj.dataList.slice();			// CO_BoardDataリスト
		} else {
			this.result = "";						// 完了コード
			this.reason = "";						// 理由コード
			this.clHandle = 0;						// ハンドル
			this.code = "";							// 銘柄コード
			this.offeredNumber = 0;						// 呼値の単位番号
			this.updateNumber = 0;					// 更新番号
			this.updateNumberTime = 0;				// 更新番号:時刻
			this.stopFlag = 0;						// 規制フラグ
			this.quoteStatus = 0;					// QUOTEステータス
			this.nowPriceType = 0;					// 現在値種別(1:現在値有効)
			this.nowPriceDec = 0;					// 現在値表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
			this.nowPrice = 0;						// 現在値
			this.nowTime = 0;						// 現在値:時刻
			this.nowPriceFlag = 0;					// 日通し現値始値終値識別
			this.nowStatus = 0;						// ステータス
			this.nowStatusTime = 0;					// ステータス:時刻
			this.shortFlag = 0;						// 空売規制符号
			this.shortFlagTime = 0;					// 空売規制符号:時刻
			this.volume = 0;						// 売買高
			this.volumeTime = 0;					// 売買高:時刻
			this.lastTradeLot = 0;					// 約定値にかかる売買高
			this.dataList = [];						// CO_BoardDataリスト
			for(let i=0; i<22; i++) {
				const boardData = new CO_BoardData();
				this.dataList.push(boardData);
			}
		}
	}
};

export class CO_MasterData {
	constructor() {
		this.code = "";
		this.name = "";
		this.offeredNumber = 0;
		this.basePriceType = 0;
		this.basePriceDec = 0;
		this.basePrice = 0;
	}
}

// 銘柄及び銘柄登録中の下位ハンドル情報
class CO_BoardInfo {
	constructor(secType=0, code="") {
		this.master = null;						// マスタ情報 CO_MasterData
		this.secType = secType;					// 商品種類("0":株式,"1":先物)
		this.result = "";						// 完了コード
		this.reson = "";						// 理由コード
		this.svHandle = 0;						// 上位に対するハンドル
		this.code = code;						// 銘柄コード
		//this.offeredNumber = 0;						// 呼値の単位番号
		this.updateNumber = 0;					// 更新番号
		this.updateNumberTime = 0;				// 更新番号:時刻
		this.stopFlag = 0;						// 規制フラグ
		this.quoteStatus = 0;					// QUOTEステータス
		this.nowPriceType = 0;					// 現在値種別(1:現在値有効)
		this.nowPriceDec = 0;					// 現在値表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		this.nowPrice = 0;						// 現在値
		this.nowTime = 0;						// 現在値:時刻
		this.nowPriceFlag = 0;					// 日通し現値始値終値識別
		this.nowStatus = 0;						// ステータス
		this.nowStatusTime = 0;					// ステータス:時刻
		this.shortFlag = 0;						// 空売規制符号
		this.shortFlagTime = 0;					// 空売規制符号:時刻
		this.volume = 0;						// 売買高
		this.volumeTime = 0;					// 売買高:時刻
		this.lastTradeLot = 0;					// 約定値にかかる売買高
		this.centerPriceType = 0;				// 中心値種別(1:中心値有効)
		this.centerPriceDec = 0;				// 中心値表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		this.centerPrice = 0;					// 中心値
		//this.basePriceType = 0;					// 基準値種別(1:中心値有効)
		//this.basePriceDec = 0;					// 基準値表示桁数(0:0桁,1:1桁,2:2桁,3:3桁.4:4桁)
		//this.basePrice = 0;						// 基準値
		this.marketOrder = [];					// 成り行き([0]:売,[1]:買)
		for(let i=0;i<2;i++) {
			this.marketOrder[i] = new CO_PriceDetail();
		}
		this.priceDetailMap = [];				// 明細([0]:売,[1]:買)
		for(let i=0;i<2;i++) {
			this.priceDetailMap[i] = new CO_PriceDetailMap();
		}
		this.clHandleMap = new CO_BoardHandle();	// ハンドル管理
	}
	initMaster(master) {
		this.master = master;
	}
	add(clHandle, priceType, dec, price) {
		return this.clHandleMap.add(clHandle, priceType, dec, price);
	}
	update(boardDepth) {
		this.updateNumber		= boardDepth.updateNumber;
		this.updateNumberTime	= boardDepth.updateNumberTime;
		this.stopFlag			= boardDepth.stopFlag;
		this.quoteStatus		= boardDepth.quoteStatus;
		this.nowPriceType		= boardDepth.nowPriceType;
		this.nowPriceDec		= boardDepth.nowPriceDec;
		this.nowPrice			= boardDepth.nowPrice;
		this.nowTime			= boardDepth.nowTime;
		this.nowPriceFlag		= boardDepth.nowPriceFlag;
		this.nowStatus			= boardDepth.nowStatus;
		this.nowStatusTime		= boardDepth.nowStatusTime;
		this.shortFlag			= boardDepth.shortFlag;
		this.shortFlagTime		= boardDepth.shortFlagTime;
		this.volume				= boardDepth.volume;
		this.volumeTime			= boardDepth.volumeTime;
		this.lastTradeLot		= boardDepth.lastTradeLot;

		if(boardDepth.initFlag) {
			// 初期化
			for(let i=0; i<2; i++) {
				this.marketOrder[i].priceType = 0;
				this.marketOrder[i].priceDec = 0;
				this.marketOrder[i].price = 0;
				this.marketOrder[i].type = 0;
				this.marketOrder[i].bidAsk = 0;
				this.marketOrder[i].lot = 0;
				this.marketOrder[i].closeLot = 0;
				this.marketOrder[i].count = 0;
				this.marketOrder[i].closeCount = 0;
				this.marketOrder[i].status = 0;
				this.marketOrder[i].center = 0;
				this.marketOrder[i].cross = 0;
				this.priceDetailMap[i].clear();
			}
		}

		for(let inPriceDetail of boardDepth.dataList) {
			let bidAsk = inPriceDetail.bidAsk;
			if(bidAsk) bidAsk = 1;
			if(inPriceDetail.priceType) {
				// 値段指定
				if(!this.priceDetailMap[bidAsk].has(inPriceDetail.price)) {
					// 明細追加
					if(!inPriceDetail.updateType) {
						const priceDetail = new CO_PriceDetail(inPriceDetail);
						if(priceDetail.center) {
							this.centerPriceType = priceDetail.centerPriceType;
							this.centerPriceDec = priceDetail.centerPriceDec;
							this.centerPrice = priceDetail.centerPrice;
						}
						this.priceDetailMap[bidAsk].set(priceDetail.price, priceDetail);
					}
				} else {
					// 明細更新
					if(!inPriceDetail.updateType) {
						// 更新
						const priceDetail = this.priceDetailMap[bidAsk].get(inPriceDetail.price);
						Object.assign(priceDetail, inPriceDetail);
						if(priceDetail.center) {
							this.centerPriceType = priceDetail.centerPriceType;
							this.centerPriceDec = priceDetail.centerPriceDec;
							this.centerPrice = priceDetail.centerPrice;
						}
					} else {
						// 削除
						this.priceDetailMap[bidAsk].delete(inPriceDetail.price);
					}
				}
			} else {
				// 成行
				this.marketOrder[bidAsk] = inPriceDetail;
			}
		}
		return true;
	}
	remove(clHandle) {
		return this.clHandleMap.remove(clHandle);
	};
	makeFromBoardReal(inBoardReal, outBoardRealList) {
		// エラー時にハンドルをコピーする
		let ret = false;
		for(let clHandle of this.clHandleMap.map.keys()) {
			let copyBoardReal = new CO_BoardReal(inBoardReal);
			copyBoardReal.clHandle = clHandle
			outBoardRealList.push(copyBoardReal);
			ret = true;
		}
		return ret;
	}
	makeFromOfferedPrice(inOfferedPrice, outBoardRealList) {
		if(!this.master) return false;
		let ret = false;
		for(let handlePrice of this.clHandleMap.map.values()) {
			const boardReal = new CO_BoardReal();
			this._setBoardReal(handlePrice, inOfferedPrice, boardReal);
			outBoardRealList.push(boardReal);
			ret = true;
		}
		return ret;
	}
	makeBoardRealFromOfferedPrice(clHandle, offered, outBoardReal) {
		if(!this.master) return false;
		let ret = false;
		if(this.clHandleMap.has(clHandle)) {
			let handlePrice = this.clHandleMap.get(clHandle);
			this._setBoardReal(handlePrice, offered, outBoardReal);
			ret = true;
		}
		return ret;
	}
	_setBoardReal(handlePrice, inOfferedPrice, boardReal=new CO_BoardReal()) {
		if(!this.master) return false;
		let tmpHandlePrice = new CO_BoardHandle();
		if(!handlePrice.priceType) {
			/*if(this.centerPrice) {
				handlePrice.priceType = this.centerPriceType;
				handlePrice.priceDec = this.centerPriceDec;
				handlePrice.price = this.centerPrice;
			} else */if(this.nowPriceType){
				tmpHandlePrice.priceType = this.nowPriceType;
				tmpHandlePrice.priceDec = this.nowPriceDec;
				tmpHandlePrice.price = this.nowPrice;
			} else {
				tmpHandlePrice.priceType = this.master.basePriceType;
				tmpHandlePrice.priceDec = this.master.basePriceDec;
				tmpHandlePrice.price = this.master.basePrice;
			}
		} else {
			let offered = new CO_PriceDec();
			if(inOfferedPrice.getOfferedPrice(this.master.offeredNumber, handlePrice.price, offered)) {
				handlePrice.priceDec = offered.dec;
/*				if(handlePrice.priceDec !== offered.dec){
					handlePrice.price = +handlePrice.price.toFixed(offered.dec);
				}*/
			}
			tmpHandlePrice = handlePrice;
		}
		boardReal.clHandle = tmpHandlePrice.handle;
		boardReal.code = this.code;
		boardReal.offeredNumber = this.master.offeredNumber;
		boardReal.updateNumber = this.updateNumber;
		boardReal.updateNumberTime = this.updateNumberTime;
		boardReal.stopFlag = this.stopFlag;
		boardReal.quoteStatus = this.quoteStatus;
		boardReal.nowPriceType = this.nowPriceType;
		boardReal.nowPriceDec = this.nowPriceDec;
		boardReal.nowPrice = this.nowPrice;
		boardReal.nowTime = this.nowTime;
		boardReal.nowPriceFlag = this.nowPriceFlag;
		boardReal.nowStatus = this.nowStatus;
		boardReal.nowStatusTime = this.nowStatusTime;
		boardReal.shortFlag = this.shortFlag;
		boardReal.shortFlagTime = this.shortFlagTime;
		boardReal.volume = this.volume;
		boardReal.volumeTime = this.volumeTime;
		boardReal.lastTradeLot = this.lastTradeLot;
		
		let boardData;
		// 中心行
		boardData = boardReal.dataList[11];
		boardData.priceType = 1;
		boardData.priceDec = tmpHandlePrice.priceDec;
		boardData.price = tmpHandlePrice.price;
		this._setBoardData(boardData);
		// 値段行
		let nowPrice = tmpHandlePrice.price;
		let newPriceDec = new CO_PriceDec(nowPrice, tmpHandlePrice.priceDec);
		for(let i=10;i>1;i--) {
			boardData = boardReal.dataList[i];
			newPriceDec = inOfferedPrice.upTick(this.master.offeredNumber, nowPrice, 1);
			if(newPriceDec.price === nowPrice) {
				boardData.priceType = 0;
				boardData.priceDec = 0;
				boardData.price = 0;
			} else {
				boardData.priceType = 1;
				boardData.priceDec = newPriceDec.dec;
				boardData.price = newPriceDec.price;
				this._setBoardData(boardData);
			}
			nowPrice = newPriceDec.price;
		}
		nowPrice = tmpHandlePrice.price;
		for(let i=12;i<21;i++) {
			boardData = boardReal.dataList[i];
			newPriceDec = inOfferedPrice.downTick(this.master.offeredNumber, nowPrice, 1);
			if(newPriceDec.price === nowPrice) {
				boardData.priceType = 0;
				boardData.priceDec = 0;
				boardData.price = 0;
			} else {
				boardData.priceType = 1;
				boardData.priceDec = newPriceDec.dec;
				boardData.price = newPriceDec.price;
				this._setBoardData(boardData);
			}
			nowPrice = newPriceDec.price;
		}
		// 成行行
		boardData = boardReal.dataList[0];
		boardData.priceType = 2;
		this._setBoardData(boardData);
		// OVER & UNDER
		if(boardReal.dataList[2].priceType || boardReal.dataList[20].priceType) {
			for(let i=0;i<2;i++) {
				// i=askbid 0:売, 1:買
				for(let pd of this.priceDetailMap[i].values()) {
					// pd:priceDetail
					if(pd.price > boardReal.dataList[2].price && pd.priceType && boardReal.dataList[2].priceType) {
						boardReal.dataList[1].lot[i] = boardReal.dataList[1].lot[i] + pd.lot;
						boardReal.dataList[1].closeLot[i] = boardReal.dataList[1].closeLot[i] + pd.closeLot;
						boardReal.dataList[1].count[i] = boardReal.dataList[1].count[i] + pd.count;
						boardReal.dataList[1].closeCount[i] = boardReal.dataList[1].closeCount[i] + pd.closeCount;
					}
					if(pd.price < boardReal.dataList[20].price && pd.priceType && boardReal.dataList[20].priceType) {
						boardReal.dataList[21].lot[i] = boardReal.dataList[21].lot[i] + pd.lot;
						boardReal.dataList[21].closeLot[i] = boardReal.dataList[21].closeLot[i] + pd.closeLot;
						boardReal.dataList[21].count[i] = boardReal.dataList[21].count[i] + pd.count;
						boardReal.dataList[21].closeCount[i] = boardReal.dataList[21].closeCount[i] + pd.closeCount;
					}
				}
			}
		}
		return true;
	}
	_setBoardData(boardData) {
		if(boardData.priceType === 1) {
			// 値段有効
			for(let i=0;i<2;i++) {
				// i=askbid 0:売, 1:買
				let priceDetail;
				if(this.priceDetailMap[i].has(boardData.price)) {
					priceDetail = this.priceDetailMap[i].get(boardData.price);
					boardData.lot[i] = priceDetail.lot;
					boardData.closeLot[i] = priceDetail.closeLot;
					boardData.count[i] = priceDetail.count;
					boardData.closeCount[i] = priceDetail.closeCount;
					boardData.status[i] = priceDetail.status;
					boardData.cross[i] = priceDetail.cross;
				}
			}
		} else if(boardData.priceType === 2) {
			// 成行
			for(let i=0;i<2;i++) {
				// i=askbid 0:売, 1:買
				boardData.lot[i] = this.marketOrder[i].lot;
				boardData.closeLot[i] = this.marketOrder[i].closeLot;
				boardData.count[i] = this.marketOrder[i].count;
				boardData.closeCount[i] = this.marketOrder[i].closeCount;
			}
		}
	}
	clHandleCount() {
		return this.clHandleMap.map.size;
	}
};

class CO_BoardInfoMap {
	constructor() {
		return new Map();
	}
	// key:code, value:CO_BoardInfo
}

class CO_HandleCodeMap {
	constructor() {
		return new Map();
	}
	// key:handle, value:code
}

export class CO_Board {
	constructor() {
		this.registMax = 0;								// 最大登録数
		this.boardInfoMap = new CO_BoardInfoMap();		// 板情報マップ
		this.accessMap = new CO_HandleCodeMap();		// ハンドルコードアクセスマップ
		this.offered = new CO_OfferdPrice();			// 呼値情報
		this.svHandleCounter = 0;						// ハンドルカウンタ
	}
	addOffered(offeredPriceData) {
		const inData = offeredPriceData;
		return this.offered.add(inData.offeredNumber, inData.price, inData.offeredPrice, inData.priceDec);
	}
	addBoardDepth(boardDepth) {
		if(!this.boardInfoMap.has(boardDepth.code)) return false;
		const boardInfo = this.boardInfoMap.get(boardDepth.code);
		return boardInfo.update(boardDepth);
	}
	initMaster(code, master=new CO_MasterData()) {
		if(!this.boardInfoMap.has(code)) return false;
		const boardInfo = this.boardInfoMap.get(code);
		/*
		let offered = new CO_PriceDec();
		if(this.offered.getOfferedPrice(master.offeredNumber, price, offered)) {
			boardInfo.basePriceDec = offered.dec;
		} else {
			boardInfo.basePriceDec = dec;
		}
		*/
		boardInfo.initMaster(master);
		return true;
	}
	isInit(code) {
		if(!this.boardInfoMap.has(code)) return false;
		const boardInfo = this.boardInfoMap.get(code);
		if(!boardInfo.master) return false;
		return true;
	}
	regist(clHandle, secType, code, ptype, dec, price, svHandles=new CO_BoardSVHandles(), outBoardReal, errObj=new CO_BoardErrorObj()) {
		// 出力ハンドルの初期化
		svHandles.registHandle = 0;
		svHandles.registSecType = " ";
		svHandles.unRegistHandle = 0;
		svHandles.unRegistSecType = " ";
		
		// ハンドルを削除(ハンドルがない場合のエラーハンドリングは行わない)
		this.unregist(clHandle, svHandles);
		
		// ハンドルを登録
		// 銘柄登録数チェック
		if(!this.boardInfoMap.has(code) && !this._isEnableRegist()) {
			// 銘柄最大登録数超過エラー
			errObj.set(BOARD_ERRCODE.REGIST_OVER);
			return false;
		}
		// アクセスマップにハンドルを追加
		this.accessMap.set(clHandle, code);
		// 銘柄マップを更新
		if(this.boardInfoMap.has(code)) {
			// 銘柄マップにハンドルを追加
			const boardInfo = this.boardInfoMap.get(code);
			if(!ptype) {
				boardInfo.add(clHandle, boardInfo.centerPriceType, boardInfo.centerPriceDec, boardInfo.centerPrice);
			} else {
				boardInfo.add(clHandle, ptype, dec, price);
			}
			// 初期データを作成
			if(!boardInfo.makeBoardRealFromOfferedPrice(this.offered, outBoardReal, clHandle)) {
				// データなし
				errObj.set(BOARD_ERRCODE.NO_DATA);
			}
		} else {
			// 銘柄登録を追加
			const boardInfo = new CO_BoardInfo(secType, code);
			this.svHandleCounter++;
			svHandles.registHandle = this.svHandleCounter;
			svHandles.registSecType = secType;
			boardInfo.svHandle = this.svHandleCounter;
			//boardInfo.offeredNumber = tick;
			this.boardInfoMap.set(code, boardInfo);
			// 銘柄マップにハンドルを追加
			boardInfo.add(clHandle, ptype, dec, price);
			// データ未受信
			errObj.set(BOARD_ERRCODE.NO_DATA);
		}
		return true;
	}
	unregist(clHandle, svHandles, errObj=new CO_BoardErrorObj()) {
		if(!this.accessMap.has(clHandle)) {
			errObj.set(BOARD_ERRCODE.NOT_FOUND_CLHANDLE);
			return false;
		}
		const code = this.accessMap.get(clHandle);
		// 銘柄マップからハンドルを削除
		if(this.boardInfoMap.has(code)) {
			let boardInfo = this.boardInfoMap.get(code);
			if(boardInfo.remove(clHandle)) {
				if(boardInfo.clHandleCount() === 0) {
					// 誰も使わなくなったので銘柄登録を削除
					svHandles.unRegistHandle = boardInfo.svHandle;
					svHandles.unRegistSecType = boardInfo.secType;
					this.boardInfoMap.delete(code);
				}
			}
		}
		// アクセスマップからハンドルを削除
		this.accessMap.delete(clHandle);
		return true;
	}
	makeEvent(inBoardReal, outBoardRealList) {
		// 銘柄登録存在チェック
		if(!this.boardInfoMap.has(inBoardReal.code)) {
			return false;
		}
		let boardInfo = this.boardInfoMap.get(inBoardReal.code);
		if(inBoardReal.result === ST_RESULT.ST_ERROR || inBoardReal.result === ST_RESULT.ST_INVALIDATE) {
			// エラーのため登録を削除する
			boardInfo.makeFromBoardReal(inBoardReal, outBoardRealList);
			this.boardInfoMap.delete(inBoardReal.code);
			for(let [clHandle, code] of this.accessMap) {
				if(code === inBoardReal.code) {
					this.accessMap.delete(clHandle);
				}
			}
		} else {
			// 通常のアップデート
			boardInfo.makeFromOfferedPrice(this.offered, outBoardRealList);
		}
		return true;
	}
	clear() {
		this.boardInfoMap.clear();
		this.accessMap.clear();
	}
	_isEnableRegist() {
		if(!this.registMax) return true;
		if(this.boardInfoMap.size >= this.registMax) return false;
		return true;
	}
	fillPrimaryMarket(svHandle, marketCode) {
		// 上位ハンドルに対応する銘柄を探す
		let targetCode = null;
		let targetBoardInfo = null;
		for(const code of this.boardInfoMap.keys()) {
			const boardInfo = this.boardInfoMap.get(code);
			if(boardInfo.svHandle === svHandle && splitCode(boardInfo.code).marketCode === "") {
				targetBoardInfo = boardInfo;
				targetCode = boardInfo.code;
				break;
			}
		}
		if(!targetBoardInfo)
			return;
		// アクセスマップを更新
		const {source, issueCode} = splitCode(targetCode);
		const fillCode = unionCode(source, marketCode, issueCode);
		for(const clHandle of targetBoardInfo.clHandleMap.map.keys()) {
			this.accessMap.set(clHandle, fillCode);
		}
		// 板情報マップを更新
		const fillBoardInfo = targetBoardInfo;
		if(this.boardInfoMap.has(fillCode)) {
			// 既に優先市場が登録されている場合
			// 下位ハンドルマップを市場が空の板情報オブジェクトに統合する
			const registedBoardInfo = this.boardInfoMap.get(fillCode);
			for(const registedClHandle of registedBoardInfo.clHandleMap.map.keys()) {
				fillBoardInfo.clHandleMap.map.set(registedClHandle, registedBoardInfo.clHandleMap.map.get(registedClHandle));
			}
		} else {
			// 優先市場が未登録の場合
			fillBoardInfo.code = fillCode;
		}
		this.boardInfoMap.set(fillCode, fillBoardInfo);
		this.boardInfoMap.delete(targetCode);
	}
};