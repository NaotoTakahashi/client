// クライアントで使用するにあたり
// socket => 画面
// clHandle => 画面内で一意となる各銘柄における識別子
// で対応させる

//////////////////////////////////////////////////////////////////////
// エラーオブジェクト
//////////////////////////////////////////////////////////////////////
const FEED_ERRCODE = {
	NORMAL: 0,
	NOT_FOUND_SOCKET: 1,		// ソケットなし
	NOT_FOUND_CLHANDLE: 2,		// 下位ハンドルなし
	NOT_FOUND_SVHANDLE: 3,		// 上位ハンドルなし
	NOT_FOUND_SRCCODE: 4,		// 銘柄なし
}

class CO_FeedErrorObj {
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
// エレメント名オブジェクト
//////////////////////////////////////////////////////////////////////
/*
class CO_ElementName {
	constructor(list) {
		this.name = new Map();
		this.id = new Map();
		if(list) {
			for(let id of list) {
				this.putMap(id, list[id]);
			}
		}
	}
	putMap(id, name) {
		if(!id || !name) return;
		if(!this.name.has(id)) {
			this.name.set(id, name);
		}
		if(!this.id.has(name)) {
			this.id.set(name, id);
		}
	}
}

class CO_SourceElementMap extends Map {
	// key: source, value: CO_ElementName
}
*/
//////////////////////////////////////////////////////////////////////
// アクセス管理オブジェクト
//////////////////////////////////////////////////////////////////////
export class CO_SVHandles {
	constructor(registHandle, unRegistHandle) {
		this.registHandle = registHandle;
		this.unRegistHandle = unRegistHandle;
	}
}

class CO_SourceCodePair {
	constructor(source, code) {
		this.source = source;
		this.code = code;
	}
}

class CO_SockClHandle {
	constructor(sock, handle) {
		this.sock = sock;
		this.handle = handle
	}
}

//class CO_ClHandleMap extends Map {			// CO_CodeHandleMap, CO_HandleMap
class CO_ClHandleMap {			// CO_CodeHandleMap, CO_HandleMap
	constructor() {
		return new Map();
	}
	// key: clHandle, value: {sourse: , code}
}

//class CO_SockMap extends Map {				// CO_HandleSockMap, CO_SockMap
class CO_SockMap {				// CO_HandleSockMap, CO_SockMap
	constructor() {
		return new Map();
	}
	// key: sock, value: CO_ClHandleMap
}

//class CO_CodeAccessMap extends Map {		// CO_CodeMap
class CO_CodeAccessMap {		// CO_CodeMap
	constructor() {
		return new Map()
	}
	// key: source+code, value: CO_AccessCode
}

//class CO_SvHandleAccessMap extends Map {	// CO_CodeIndex
class CO_SvHandleAccessMap {	// CO_CodeIndex
	constructor() {
		return new Map()
	}
	// key: svHandle, value: CO_AccessCode
}

// 上位アクセスオブジェクト
class CO_AccessCode {
	constructor() {
		this.source = 0;						// 情報ソース
		this.code = "";							// 銘柄コード
		this.svHandle = 0;						// 上位ハンドル
		this.sockMap = new CO_SockMap();		// 下位ソケットマップ {sock: {clHandle: {source: , code: } } }
	}
	disable() {

	}
}

//////////////////////////////////////////////////////////////////////
// アクセスコントローラー
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
class CO_AccessControl {
	constructor() {
		this.sockMap = new CO_SockMap();						// 下位ソケットマップ{[sock]: {[clHandle]: {source: , code: } } }
		this.codeAccessMap = new CO_CodeAccessMap();			// 銘柄-アクセスマップ {[src+":"+code]: CO_AccessCode}
		this.svHandleAccessMap = new CO_SvHandleAccessMap();	// 上位ハンドル-アクセスマップ {[svHandle]: CO_AccessCode}
		this.available = false;
		this.svHandleCounter = 0;								// 上位ハンドルカウンタ
		this.registMax = 0;
	}
	setRegistMax(max) {
		this.registMax = max;
	}
	enable() {
		this.available = true;
	}
	disable(disableAccessList) {
		this.available = false;
		for(let access of this.codeAccessMap.values()) {
			// 無効対象のアクセスを戻り値にセット
			if(disableAccessList) {
				disableAccessList.push(access);
			}
			// 無効アクセスコードに割り当てられている下位ハンドルをソケットマップから削除
			for(let sock of access.sockMap.keys()) {
				if(this.sockMap.has(sock)) {
					let clHandleMap = this.sockMap.get(sock);
					for(let [clHandle, sourceCode] of clHandleMap) {
						if(access.source === sourceCode.source && access.code === sourceCode.source) {
							clHandleMap.delete(clHandle);
						}
					}
				}
			}
		}
	}
	checkRegistOver() {
		if(!this.registMax) return false;
		if(this.codeAccessMap.size > this.registMax) return true;
		return false;
	}
	add(src, code, sock, clHandle, svHandles=new CO_SVHandles()) {
		// 出力ハンドルの初期化
		svHandles.registHandle = 0;
		svHandles.unRegistHandle = 0;
		let clHandleMap;
		// マップの更新
		if(!this.sockMap.has(sock)) {
			// ソケット未登録の場合 ソケット登録
			clHandleMap = new CO_ClHandleMap();
			let sourceCode = new CO_SourceCodePair(src, code);
			clHandleMap.set(clHandle, sourceCode);
			this.sockMap.set(sock, clHandleMap);
			// 銘柄登録
			this._addCode(src, code, sock, clHandle, svHandles);
		} else {
			// ソケット登録済の場合
			clHandleMap = this.sockMap.get(sock);
			if(!clHandleMap.has(clHandle)) {
				// 下位ハンドル未登録の場合 下位ハンドルを登録
				let sourceCode = new CO_SourceCodePair(src, code);
				this.sockMap.get(sock).set(clHandle, sourceCode);
				// 銘柄登録
				this._addCode(src, code, sock, clHandle, svHandles);
			} else if(clHandleMap.get(clHandle).source !== src || clHandleMap.get(clHandle).code !== code){
				// 行登録済かつ銘柄情報に変更がある場合 銘柄変更
				this._changeCode(src, code, sock, clHandle, svHandles);
			}
		}
		return true;
	}

	// Update Cache & UnRegist & Regist
	_changeCode(src, code, sock, clHandle, svHandles) {
		// 銘柄アクセスマップを変更
		this._deleteCode(sock, clHandle, svHandles);
		this._addCode(src, code, sock, clHandle, svHandles);
		// ソケットマップを変更
		this.sockMap.get(sock).get(clHandle).source = src;
		this.sockMap.get(sock).get(clHandle).code = code;
	}

	// 銘柄アクセスから下位ハンドル登録を削除
	_deleteCode(sock, clHandle, svHandles) {
		let clHandleMap = this.sockMap.get(sock);
		let marketCodePair = clHandleMap.get(clHandle);
		let oldKey = marketCodePair.source + ":" + marketCodePair.code;
		if(this.codeAccessMap.has(oldKey) && this.sockMap.has(sock)) {
			let accessCode = this.codeAccessMap.get(oldKey);
			// アクセス内の下位ハンドル登録を削除
			let clHandleMapInAcccess = accessCode.sockMap.get(sock);
			if(clHandleMapInAcccess.has(clHandle)) {
				clHandleMapInAcccess.delete(clHandle);
			}
			if(!clHandleMapInAcccess.size) {
				// ソケット内の下位ハンドルがなくなった場合、ソケット登録を削除
				accessCode.sockMap.delete(sock);
			}
			if(!accessCode.sockMap.size) {
				// 銘柄を登録しているソケットがなくなった場合 上位への銘柄登録を解除
				svHandles.unRegistHandle = accessCode.svHandle;
				// 銘柄アクセスマップからアクセス登録を削除
				this.codeAccessMap.delete(oldKey);
				// 上位ハンドルアクセスマップからアクセス登録を削除
				this.svHandleAccessMap.delete(svHandles.unRegistHandle);
			}
		}
	}

	// 銘柄アクセスへ下位ハンドルを登録
	_addCode(src, code, sock, clHandle, svHandles) {
		const key = src + ":" + code;
		if(!this.codeAccessMap.has(key)) {
			// 銘柄未登録の場合
			// アクセスを作成
			let accessCode = new CO_AccessCode();
			accessCode.source = src;
			accessCode.code = code;
			// 上位ハンドルを作成
			this.svHandleCounter++;
			svHandles.registHandle = this.svHandleCounter;
			accessCode.svHandle = svHandles.registHandle;
			// アクセスにソケット・下位ハンドルを登録
			let clHandleMap = new CO_ClHandleMap();
			let sourceCode = new CO_SourceCodePair(src, code);
			clHandleMap.set(clHandle, sourceCode);
			accessCode.sockMap.set(sock, clHandleMap);
			// 銘柄アクセスマップにアクセスを登録
			this.codeAccessMap.set(key, accessCode);
			// 上位ハンドルアクセスマップにアクセスを登録
			this.svHandleAccessMap.set(svHandles.registHandle, accessCode);
		} else {
			// 銘柄登録済の場合
			let accessCode = this.codeAccessMap.get(key);
			if(!accessCode.sockMap.has(sock)) {
				// ソケット未登録の場合 ソケットマップにソケットを登録
				let clHandleMap = new CO_ClHandleMap();
				let sourceCode = new CO_SourceCodePair(src, code);
				clHandleMap.set(clHandle, sourceCode);
				accessCode.sockMap.set(sock, clHandleMap);
			} else {
				// ソケット登録済の場合
				let clHandleMap = accessCode.sockMap.get(sock);
				if(!clHandleMap.has(clHandle)) {
					// 下位ハンドル未登録の場合 ソケットに下位ハンドルを登録
					let sourceCode = new CO_SourceCodePair(src, code);
					clHandleMap.set(clHandle, sourceCode);
				} else {
					// 下位ハンドル登録済の場合 下位ハンドルの銘柄情報を更新
					let marketCodePair = clHandleMap.get(clHandle);
					marketCodePair.source = src;
					marketCodePair.code = code;
				}
			}
		}
	}

	removeSock(sock, deleteSvHandleList, errobj=new CO_FeedErrorObj()) {
		errobj.clear();
		// ソケットマップの更新
		if(!this.sockMap.has(sock)) {
			// ハンドル未登録の場合エラー
			errobj.set(FEED_ERRCODE.NOT_FOUND_CLHANDLE);
			return false;
		}
		// ソケット登録済の場合 ソケットを削除
		let clHandleMap = this.sockMap.get(sock);
		for(let sourceCode of clHandleMap.values()) {
			// 削除する下位ハンドルが登録している銘柄を探す
			const key = sourceCode.source + ":" + sourceCode.code;
			// 銘柄アクセスマップ内の対象ソケットを削除
			if(this.codeAccessMap.has(key)) {
				// アクセスのソケットマップから下位ハンドルを削除
				let accessCode = this.codeAccessMap.get(key);
				if(accessCode.sockMap.has(sock)) {
					accessCode.sockMap.delete(sock);
				}
				if(!accessCode.sockMap.size) {
					// 銘柄を登録しているソケットがなくなった場合 上位への銘柄登録を解除
					// 登録解除する上位ハンドルをリストに追加
					deleteSvHandleList.push(accessCode.svHandle);
					// 銘柄アクセスマップからアクセス登録を削除
					this.codeAccessMap.delete(key);
					// 上位ハンドルアクセスマップからアクセス登録を削除
					this.svHandleAccessMap.delete(accessCode.svHandle);
				}
				
			}
		}
		// ソケット内の下位ハンドル登録をすべて削除
		clHandleMap.clear();
		// ソケットマップからソケット登録を削除
		this.sockMap.delete(sock);
		// 正常終了
		return true;
	}

	removeClHandle(sock, clHandle, svHandles=new CO_SVHandles(), errobj=new CO_FeedErrorObj()) {
		// ソケット未登録の場合 エラー
		if(!this.sockMap.has(sock)) {
			errobj.set(FEED_ERRCODE.NOT_FOUND_SOCKET);
			return false;
		}
		// 下位ハンドル未登録の場合 エラー
		let clHandleMap = this.sockMap.get(sock);
		if(!clHandleMap.has(clHandle)) {
			errobj.set(FEED_ERRCODE.NOT_FOUND_CLHANDLE);
			return false;
		}
		// 削除する下位ハンドルが要求中の銘柄に対応するアクセスを探す
		let sourceCode = clHandleMap.get(clHandle);
		const key = sourceCode.source + ":" + sourceCode.code;
		let accessCode = this.codeAccessMap.get(key);
		// アクセス内の下位ハンドル登録を削除
		let clHandleMapInAcccess = accessCode.sockMap.get(sock);
		clHandleMapInAcccess.delete(clHandle);
		if(!clHandleMapInAcccess.size) {
			// アクセス内のソケットに下位ハンドル登録がなくなった場合 ソケット登録を削除
			accessCode.sockMap.delete(sock);
			if(!accessCode.sockMap.size) {
				// アクセス内のソケット登録がなくなった場合 銘柄登録を解除
				svHandles.unRegistHandle = accessCode.svHandle;
				// 銘柄アクセスマップからアクセス登録を削除
				this.codeAccessMap.delete(key);
				// 上位ハンドルアクセスマップからアクセス登録を削除
				this.svHandleAccessMap.delete(accessCode.svHandle);
			}
		}
		// ソケットマップから下位ハンドル登録を削除
		clHandleMap.delete(clHandle);
		// 正常終了
		return true;
	}

	removeSvHandle(svHandle, deleteSockList=[], errobj=new CO_FeedErrorObj()) {
		errobj.clear();
		// 上位ハンドル未登録の場合 エラー
		if(!this.svHandleAccessMap.has(svHandle)) {
			errobj.set(FEED_ERRCODE.NOT_FOUND_SVHANDLE);
			return false;
		}
		// 上位ハンドル登録済の場合 削除する下位ハンドルのリストを作成
		let accessCode = this.svHandleAccessMap.get(svHandle);
		for(let [sock, clHandleMap] of accessCode.sockMap) {
			for(let clHandle of clHandleMap.keys()) {
				// リストに下位ハンドルを追加
				let sockHandle = new CO_SockClHandle(sock, clHandle);
				deleteSockList.push(sockHandle);
				// ソケットマップから下位ハンドルを削除
				if(this.sockMap.has(sock)) {
					this.sockMap.get(sock).delete(clHandle);
					if(!this.sockMap.get(sock).size) {
						// ソケット内の下位ハンドルがなくなった場合 ソケットを削除
						this.sockMap.delete(sock);
					}
				}
			}
			// アクセス削除準備
			clHandleMap.clear();
		}
		// アクセス削除準備
		accessCode.sockMap.clear();
		// 銘柄アクセスマップからアクセス登録を削除
		const key = accessCode.source + ":" + accessCode.code;
		this.codeAccessMap.delete(key);
		// 上位ハンドルアクセスマップからアクセス登録を削除
		this.svHandleAccessMap.delete(svHandle);
		// 正常終了
		return true;
	}
	
	getUpdateSockList(svHandle, updateSockList=[], errobj=new CO_FeedErrorObj()) {
		errobj.clear();
		// 上位ハンドル未登録の場合 エラー
		if(!this.svHandleAccessMap.has(svHandle)) {
			errobj.set(FEED_ERRCODE.NOT_FOUND_SVHANDLE);
			return false;
		}
		// 上位ハンドル登録済の場合 更新する下位ハンドルのリストを作成
		const accessCode = this.svHandleAccessMap.get(svHandle);
		for(let [sock, clHandleMap] of accessCode.sockMap) {
			for(let clHandle of clHandleMap.keys()) {
				const sockHandle = new CO_SockClHandle(sock, clHandle);
				updateSockList.push(sockHandle);
			}
		}
		// 正常終了
		return true;
	}

	updateBySrcCode(src, code, updateSockList=[], errobj=new CO_FeedErrorObj()) {
		errobj.clear();
		const key = src + ":" + code;
		// 銘柄未登録の場合 エラー
		if(!this.codeAccessMap.has(key)) {
			errobj.set(FEED_ERRCODE.NOT_FOUND_SRCCODE);
			return false;
		}
		// 銘柄登録済の場合 更新する下位ハンドルのリストを作成
		let accessCode = this.codeAccessMap.get(key);
		for(let [sock, clHandleMap] of accessCode.sockMap) {
			for(let clHandle of clHandleMap.keys()) {
				let sockHandle = new CO_SockClHandle(sock, clHandle);
				updateSockList.push(sockHandle);
			}
		}
		// 正常終了
		return true;
	}

	fillPrimaryMarket(svHandle, marketCode) {
		// 上位ハンドルに登録しているコードの市場が空(優先市場登録)の場合、取得した優先市場に置き換える
		if(!this.svHandleAccessMap.has(svHandle))
			return;
		const accessCode_SVH = this.svHandleAccessMap.get(svHandle);
		const codes = splitCode(accessCode_SVH.code);
		if(codes.marketCode !== "")
			return;
		const targetCode = accessCode_SVH.code;
		// 更新用コードの作成
		const fillCode = unionCode(codes.source, marketCode, codes.issueCode);
		// 上位ハンドルマップのアクセスを更新
		// >> コードを更新
		accessCode_SVH.code = fillCode;
		// >> 上位ハンドルに対応する各下位ハンドルについて銘柄更新
		const targetKey = codes.source + ":" + targetCode;
		const fillKey = codes.source + ":" + fillCode;
		let acccessCode_C;
		if(this.codeAccessMap.has(fillKey)) {
			// 既に優先市場が登録されている場合
			acccessCode_C = this.codeAccessMap.get(fillKey);
		} else {
			// 優先市場が未登録の場合
			acccessCode_C = this.codeAccessMap.get(targetKey);
		}
		for(const sock of accessCode_SVH.sockMap.keys()) {
			for(const clHandle of accessCode_SVH.sockMap.get(sock).keys()) {
				// ソケットマップを変更
				this.sockMap.get(sock).get(clHandle).code = fillCode;
				// 銘柄マップを変更
				const clHandleMap = new CO_ClHandleMap();
				const sourceCode = new CO_SourceCodePair(codes.source, fillCode);
				clHandleMap.set(clHandle, sourceCode);
				acccessCode_C.sockMap.set(sock, clHandleMap);
				this.codeAccessMap.set(fillKey, acccessCode_C);
			}
		}
		this.codeAccessMap.delete(targetKey);
	}

	_updateCodeOfCodeAccessMap
}

//////////////////////////////////////////////////////////////////////
// データレコードオブジェクト
//////////////////////////////////////////////////////////////////////
//const CO_FEED_VALUE_ARRAY_MAX = 300;

export class CO_FeedValue {
	constructor() {
		this.serial = 0;						// 更新通番
		this.status = "";						// データステータス
		this.data =  "";						// データ文字列
	}
}

//class CO_FeedValueMap extends Map {
class CO_FeedValueMap {
	constructor() {
		return new Map();
	}
	// key: name, value: CO_FeedValue
}

export class CO_FeedRecord {
	constructor(source=0, code="", svHandle=0, issueName="", unitLot="", loanType="", yobineTaniNumber="") {
		this.source = source;					// 情報ソース
		this.code = code;						// レコードキー
		this.issueName = issueName;				// マスタ情報:銘柄名
		this.unitLot = unitLot;					// マスタ情報:単位株数
		this.loanType = loanType;				// マスタ情報:貸借区分
		this.yobineTaniNumber = yobineTaniNumber;	// マスタ情報:呼値単位番号
		this.svHandle = svHandle;				// ハンドル
		this.status = "Azz";					// メッセージステータス
		this.valueMap = new CO_FeedValueMap();	// フィードデータマップ
		/*
		this.value = [];						// フィードデータ配列
		for(let i;i<CO_FEED_VALUE_ARRAY_MAX;i++) {
			this.value.push(new CO_FeedValue());
		}
		*/
	}
	setMasterInfo(issueName, unitLot, loanType, yobineTaniNumber) {
		this.issueName = issueName;				// マスタ情報:銘柄名
		this.unitLot = unitLot;					// マスタ情報:単位株数
		this.loanType = loanType;				// マスタ情報:貸借区分
		this.yobineTaniNumber = yobineTaniNumber;	// マスタ情報:呼値単位番号
	}
	clear(source=0, code="", svHandle=0, status="Azz") {
		this.source = source;
		this.code = code;
		this.svHandle = svHandle;
		this.status = status;
	}
	update(rec) {
		this.status = rec.status;
		for(let [name, val] of rec.valueMap) {
			this._updateValue(name, val);
		}
	}
	_updateValue(name, newVal=new CO_FeedValue()) {
		let val;
		if(!this.valueMap.has(name)) {
			val = new CO_FeedValue();
			this.valueMap.set(name, val);
		} else {
			val = this.valueMap.get(name);
			if(val.serial >= newVal.serial) return false;	// 古いデータは更新しない
		}
		val.serial = newVal.serial;
		val.status = newVal.status;
		val.data = newVal.data;
		return true;
	}
}

//class CO_CodeFeedRecMap extends Map {
class CO_CodeFeedRecMap {
	constructor() {
		return new Map();
	}
	// key: source + ":" + code, value: CO_FeedRecord
}

//class CO_SVHandleFeedRecMap extends Map {
class CO_SVHandleFeedRecMap {
	constructor() {
		return new Map();
	}
	// key:svHandle, value: CO_FeedRecord
}

export class CO_FeedDataBase {
	constructor() {
		//this.sourceElementMap = new CO_SourceElementMap();
		this.acccessControl = new CO_AccessControl();			// アクセスコントロール
		this.codeFeedMap = new CO_CodeFeedRecMap();				// 銘柄フィードマップ
		this.svHandleFeedMap = new CO_SVHandleFeedRecMap();		// 上位ハンドルフィードマップ
	}
	/*
	setDefine(source, deflist) {
		if(this.sourceElementMap.has(source)) return false;
		this.sourceElementMap.set(source, new CO_ElementName(deflist));
		return true;
	}
	*/
	createRecord(src, code, svHandle) {
		const key = src + ":" + code;

		let feedRec = new CO_FeedRecord(src, code, svHandle);

		if(!this.codeFeedMap.has(key)) {
			this.codeFeedMap.set(key, feedRec);
		}
		
		if(!this.svHandleFeedMap.has(svHandle)) {
			this.svHandleFeedMap.set(svHandle, feedRec);
		}
		
		return true;
	}
	getRec(src, code, outRec) {
		const key = src + ":" + code;
		if(!this.codeFeedMap.has(key)) {
			return false;
		}
		const rec = this.codeFeedMap.get(key);
		outRec.clear(rec.source, rec.code, rec.svHandle, rec.status);
		outRec.setMasterInfo(rec.issueName, rec.unitLot, rec.loanType, rec.yobineTaniNumber);
		outRec.update(rec);
		return true;
	}
	/*
	setRec(rec) {
		let key = rec.source + ":" + rec.code;
		if(!this.codeFeedMap.has(key)) {
			let newRec = new CO_FeedRecord(rec.source, rec.code, rec.svHandle);
			this.codeFeedMap.set(key, newRec);
			if(!this.svHandleFeedMap.has(rec.svHandle)) {
				this.svHandleFeedMap.set(rec.svHandle, newRec);
			}
		}
		return true;
	}
	*/
	count() {
		return this.codeFeedMap.size;
	}
	/*
	elementCount(src) {
		if(!this.sourceElementMap.has(src)) {
			return 0;
		}
		return this.sourceElementMap.get(src).count();
	}
	*/
	getValue(inRec, name, value) {
		/*
		if(!this.sourceElementMap.has(inRec.source)) return false;
		let elementName = this.sourceElementMap.get(inRec.source);
		*/
		if(!this.valueMap.has(name)) return false;
		value = inRec.valueMap.get(name);
		return true;
	}
	setValue(inRec, name, serial, status, data) {
		let value;
		if(!inRec.valueMap.has(name)) {
			// 追加
			value = new CO_FeedValue();
			value.serial = serial;
			value.status = status;
			value.data = data;
			inRec.valueMap.set(name, value);
		} else {
			//更新
			value = inRec.valueMap.get(name);
			if(value.serial > serial) return false;
			value.serial = serial;
			value.status = status;
			value.data = data;
		}
		return true;
	}

	regist(src, code, sock, clHandle, svHandles) {
		this.acccessControl.add(src, code, sock, clHandle, svHandles);
		if(svHandles.unRegistHandle) {
			// 上位ハンドルが登録解除されるのでフィードデータマップから削除
			this._deleteSvHandle(svHandles.unRegistHandle);
		}
		return true;
	}

	unregistClHandle(sock, clHandle, svHandles) {
		let errObj = new CO_FeedErrorObj();
		if(!this.acccessControl.removeClHandle(sock, clHandle, svHandles, errObj)) return false;
		if(svHandles.unRegistHandle) {
			// 上位ハンドルが登録解除されるのでフィードデータマップから削除
			this._deleteSvHandle(svHandles.unRegistHandle);
		}
		return true;
	}

	unregistSock(sock, deleteSvHandleList) {
		let errObj = new CO_FeedErrorObj();
		if(!this.acccessControl.removeSock(sock, deleteSvHandleList, errObj)) return false;
		for(let svHandle of deleteSvHandleList) {
			// 上位ハンドルが登録解除されるのでフィードデータマップから削除
			this._deleteSvHandle(svHandle);
		}
		return true;
	}

	update(feedRec, updateSockList) {
		let errObj = new CO_FeedErrorObj();
		// 下位配信先リスト取得
		this.acccessControl.getUpdateSockList(feedRec.svHandle, updateSockList, errObj);
		const key = feedRec.source + ":" + feedRec.code;
		if(updateSockList.length) {
			// フィードデータマップを更新
			if(this.codeFeedMap.has(key)) {
				// フィードデータマップに銘柄が存在する場合 フィードデータ更新
				let oldFeedRec = this.codeFeedMap.get(key);
				oldFeedRec.update(feedRec);
			} else {
				// フィードデータマップに銘柄が存在しない場合 フィードデータ追加
				this.svHandleFeedMap.set(feedRec.svHandle, feedRec);
				this.codeFeedMap.set(key, feedRec);
			}
		} else {
			// 誰も利用者がいないのでフィードデータマップから削除
			this._deleteCode(feedRec.source, feedRec.code);
			return false;
		}
		return true;
	}

	remove(svHandle, deleteSockList) {
		let errObj = new CO_FeedErrorObj();
		if(!this.acccessControl.removeSvHandle(svHandle, deleteSockList, errObj)) return false;
		// 上位ハンドルが登録解除されるのでフィードデータマップから削除
		this._deleteSvHandle(svHandle);
		return true;
	}

	disable(disableAccessList) {
		this.acccessControl.disable(disableAccessList);
		for(let access of disableAccessList) {
			const key = access.source + ":" + access.code;
			this._deleteSvHandle(access.svHandle);
			this._deleteCode(key);
		}
	}

	_deleteSvHandle(svHandle) {
		if(this.svHandleFeedMap.has(svHandle)) {
			let feedRec = this.svHandleFeedMap.get(svHandle);
			const key = feedRec.source + ":" + feedRec.code;
			this.svHandleFeedMap.delete(svHandle);
			this.codeFeedMap.delete(key);
		}
	}

	_deleteCode(src, code) {
		const key = src + ":" + code;
		if(this.codeFeedMap.has(key)) {
			let feedRec = this.codeFeedMap.get(key);
			let svHandle = feedRec.svHandle;
			this.svHandleFeedMap.delete(svHandle);
			this.codeFeedMap.delete(key);
		}
	}

	fillPrimaryMarket(svHandle, marketCode) {
		this.acccessControl.fillPrimaryMarket(svHandle, marketCode);
	}
}