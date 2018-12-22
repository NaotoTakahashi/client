
export default class RCCallback {
	// control
	onReceiveOpenAck(msg) {};					// 開始応答電文
	//onReciveLoginAck(msg) {};					// ログイン応答電文
	onReceiveReady(msg) {};						// 準備完了電文
	onReceiveCommunicationLevel(msg) {};		// 通信状態
	// feed
	onReceiveFeedRegistAck(msg) {};				// 気配登録応答電文
	onReceiveFeedReal(msg) {};					// 気配更新電文
	onReceiveBoardReal(msg) {};					// フル板更新電文
	// tick
	onReceiveTickRegistAck(msg) {};				// TICK登録応答電文
	onReceiveTickUnregistAck(msg) {};			// TICK解除応答電文
	onReceiveTickReal(msg) {};					// TICK更新電文
	onReceiveTickDisable(msg) {};				// TICK登録解除電文
	onReceiveTickGetAck(msg) {};				// TICK取得応答電文
	// news
	onReceiveNewsHeadLine(msg) {};				// ニュースヘッドライン
	// order
	onReceiveKabuSummary(msg) {};				// 株式サマリ
	onReceiveKabuMeisai(msg) {};				// 株式明細
	onReceiveKabuYakuzyouSikkou(msg) {};		// 株式約定失効
	onReceiveKabuOrderYakuzyouRireki(msg) {};	// 株式注文約定履歴
	onReceiveHokanKokyakuKazei(msg) {};			// 保管顧客課税別
	onReceiveSinyouTategyokuMeisai(msg) {};		// 信用建玉明細
	onReceiveKabuHensaiYoyaku(msg) {};			// 株式返済予約
	onReceiveKabuHensaiMeisai(msg) {};			// 株式返済明細
	onReceiveHaseiSummary(msg) {};				// 派生サマリ
	onReceiveHaseiMeisai(msg) {};				// 派生明細
	onReceiveHaseiYakuzyouSikkou(msg) {};		// 派生約定失効
	onReceiveHaseiOrderYakuzyouRireki(msg) {};	// 派生注文約定履歴
	onReceiveHaseiTategyokuMeisai(msg) {};		// 派生建玉明細
	onReceiveHaseiHensaiYoyaku(msg) {};			// 派生返済予約
	onReceiveHaseiHensaiMeisai(msg) {};			// 派生返済明細
	// config
	onReceiveKabukaBoard(msg) {};				// 株価ボード登録内容電文
	onReceiveKabukaBoardSaveAck(msg) {};		// 株価ボード保存応答電文
	onReceiveTorihikiZyouken(msg) {};			// 取引条件登録内容電文
	onReceiveTorihikiZyoukenSaveAck(msg) {};	// 取引条件保存応答電文
	onReceiveMeigaraZyouken(msg) {};			// 銘柄条件登録内容電文
	onReceiveMeigaraZyoukenSaveAck(msg) {};		// 銘柄条件保存応答電文
	onReceivePositionResendAck(msg) {};			// ポジション再送応答電文
	// websock error
	onError(err) {};
	// websock close
	onClose(event) {};
}

