//export default Utility = Utility || {};

const Utility = {};

export const addComma = (val) => {
	if(!val) return "";
	var delimiter = ".";
	var target;
	if(val.indexOf(delimiter) > -1) {
		target = val.split(delimiter);
	} else {
		target = val;
	}
	if(target instanceof Array) {
		return target[0].replace(/(\d)(?=(\d{3})+$)/g , "$1,") + delimiter + target[1];
	} else {
		return target.replace(/(\d)(?=(\d{3})+$)/g , "$1,");
	}
}
Utility.addComma = addComma;

export const delComma = (val) => {
    return val.split(',').join('');
}
Utility.delComma = delComma;

export const formatMMDDHHMM_JP = (dateString) => {
	dateString = dateString.substring(4, 12); 
	const resultString = dateString.replace(/^(-?\d+)(\d{2})(\d{2})(\d{2})/, "$1月$2日 $3時$4分");
	return resultString;
}
Utility.formatMMDDHHMM_JP = formatMMDDHHMM_JP;

export const formatMMDD_JP = (dateString) => {
	dateString = dateString.substring(4, 8); 
	const resultString = dateString.replace(/^(-?\d+)(\d{2})/, "$1月$2日");
	return resultString;
}
Utility.formatMMDD_JP = formatMMDD_JP;

export const encodeForm = (data) => {
	var params = [];
	for(var name in data) {
		var value = data[name];
		var param = encodeURIComponent(name) + '=' + encodeURIComponent(value);
		params.push(param);
	}
	return params.join("&").replace(/%20/g, "+");
}
Utility.encodeForm = encodeForm;

export const getCookie = (name) => {
	let result = null;
	const cookieName = name + '=';
	const allcookies = document.cookie;
	const position = allcookies.indexOf( cookieName );
	if( position !== -1 )
	{
		let startIndex = position + cookieName.length;
		let endIndex = allcookies.indexOf( ';', startIndex );
		if( endIndex === -1 )
		{
			endIndex = allcookies.length;
		}
		result = decodeURIComponent( allcookies.substring( startIndex, endIndex ) );
	}
	return result;
}
Utility.getCookie = getCookie;

/**[関数名] isNumber
** [機  能] テキストボックスに適切な入力値が設定されているかをチェックする
** [説  明] 正規表現に則していない場合はエラー(0-9のみ可)又は、
** 			正規表現に則していない場合はエラー(少数点許可、＋－不可)
** 			開始は１から9（数字が何文字でも連続していてよい）、又はゼロ1文字、
**			終わりは、小数点が付く場合は、小数点以下に数字が続く事、小数点以下は無くて良い
** [引  数] @param  textBoxValue テキストボックスの中身、withPoint 小数点許容の場合：true
**			
** [戻り値] Check結果{true:問題なし、false:不備項目あり}
**/
export const isNumber = function(textBoxvalue, withPoint) {
	let chkPattern;
	if (withPoint){
		chkPattern = /^\d+$/;
	}else{
		chkPattern = /^([1-9]\d*|0)(\.\d+)?$/;
	}
	return chkPattern.test(textBoxvalue);
}

export const isIterable = (obj) => {
	if(!obj) return false;
	return typeof obj[Symbol.iterator] === "function";
}
Utility.isIterable = isIterable;

export default Utility;