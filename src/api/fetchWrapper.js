// fetch自体の失敗
const clientError = (err) => {
	console.log("Client-Error:", err);
	throw Error(err);
}

// サーバーエラー(40x系, 50x系)
const serverError = (status, errText) => {
	const err = "[" + status + "] " +errText;
	console.log("Server-Error:", err);
	throw Error(err);
}

function fetchWrapper(urlString, options) {
	return fetch(urlString, options)
	.catch(clientError)
	.then(response => {
		if(response.ok) {
			const bodyPromise = response.json();
			return bodyPromise.then(body => {return body});
		}
		serverError(response.status, response.statusText);
	});
}
export default fetchWrapper;