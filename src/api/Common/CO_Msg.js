//-----------------------------------------------------------------------------
//                      Network Message module
//                                  Copyright IMPULSE Crop. All right reserved.
//
//                      CO_NetMsg.h                          Create  2013.04.08
//-----------------------------------------------------------------------------
const CO_MsgClassNum = 
{
	UNKOWN					= 0,	// ?
	OPEN_REQUEST			= 1,	// 開始要求
	OPEN_REQUEST_ACK		= 2,	// 開始応答
	CLOSE_REQUEST			= 3,	// 終了要求
	CLOSE_REQUEST_ACK		= 4,	// 終了応答
	SUBSCRIBE_REQUEST		= 5,	// 登録要求
	SUBSCRIBE_REQUEST_ACK	= 6,	// 登録応答
	UNSUBSCRIBE_REQUEST		= 7,	// 登録解除要求
	UNSUBSCRIBE_REQUEST_ACK	= 8,	// 登録解除応答
	STATUS_REQUEST			= 9,	// 状態要求
	STATUS_REQUEST_ACK		= 10,	// 状態応答
	OPENED_USER				= 11,	// 開始済ユーザ
	CLOSED_USER				= 12,	// 終了ユーザ
	REGISTED_USER			= 13,	// 登録通知
	UNREGISTED_USER			= 14,	// 登録解除通知
	HEART_BEAT				= 15,	// ハートビート
	BUSINESS				= 16,	// 業務電文
	END						= 17
};

class CO_MsgBase {
	constructor(func) {
		this.function = func;
	}
	static ClassType() {return }
}





