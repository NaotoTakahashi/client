
import RCApiConf from "../RCApiConf";
import RCApi from "../api/RCApi/RCApi";
import RCCallback from "../api/RCApi/RCCallback";

class MyRCCallback extends RCCallback {
	
}

export default function testRCApi() {
	
	// MIOS WebSocket接続
	let RcApi = new RCApi(RCApiConf);
	let callback = new MyRCCallback();
	RcApi.callback = callback;
	RcApi.open();
	const request = () => {
		//RcApi.registBoard(2,"0","6501","00");
		RcApi.registFeed(2,1,3,"6501","00");
		RcApi.registFeed(2,2,3,"6503","00");
	}
	setTimeout(request, 2000);
	//RcApi.registTick(1, "E6501#0/T", 3, 0);
	//request = WebSid;
	console.log("test end.");
}