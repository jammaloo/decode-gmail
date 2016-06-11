// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.greeting === 'GetEmailSource') {
		//we're on the message source page, so just get the page content
		if(window.location.href.indexOf('?ui=2&ik=') != -1) {
			sendResponse({source: window.document.body.innerText});
			return;
		}
		var ik_value = window.document.head.getAttribute('data-inboxsdk-ik-value');
		var message_id = window.location.hash.split('/').pop();
		if(!message_id) {
			return;
		}
		//build the URL for the raw message page, then grab the source
		var raw_url = '//' + window.location.hostname + window.location.pathname + '?ui=2&ik=' + ik_value + '&view=om&th=' + message_id;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', raw_url, true);
		xhr.onload = function() {
			if (xhr.status != 200) {
				alert("Error fetching raw source from " + raw_url);
				return;
			}
			sendResponse({source: xhr.responseText});
		};
		xhr.send();
		return true;
	}
});