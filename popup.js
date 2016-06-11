document.addEventListener('DOMContentLoaded', function() {
	getSource();
});

function getSource() {
	document.getElementById('source').innerText = "Loading";
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {greeting: "GetEmailSource"}, function(response) {
			var textarea = document.getElementById('source');
			if(!response.source) {
				textarea.innerText = "Uh, oh! Something went wrong!";
				return;
			}

			var html_start = response.source.indexOf('<!DOCTYPE html');
			if(html_start == -1) {
				textarea.innerText = "Couldn't find message HTML. Please make sure you have opened a Gmail email. ";
				return;
			}

			//extract the source HTML
			var html_end = response.source.indexOf('--_=_swift', html_start);
			var source = response.source.substr(html_start, html_end - html_start);

			//decode it and display it
			textarea.innerText = quotedPrintable.decode(source);
		});
	});
}