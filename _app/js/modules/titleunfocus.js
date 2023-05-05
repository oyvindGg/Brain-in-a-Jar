export default function titleUnfocus() {
	window.onload = function() {
	  const pageTitle = document.title;
	  const attentionMessage = 'We Know You Want To!';
	  const favicon = document.querySelector('link[rel="shortcut icon"]');
 
	  let blinkEvent = null;
 
	  document.addEventListener('visibilitychange', function(e) {
		 const isPageActive = !document.hidden;
 
		 if(!isPageActive){
			blink();
		 } else {
			document.title = pageTitle;
			clearInterval(blinkEvent);
			favicon.href = '../_app//assets/favicon-focus.png';
		 }
	  });
 
	  function blink(){
		 blinkEvent = setInterval(function() {
			if(document.title === attentionMessage){
			  document.title = pageTitle;
			  favicon.href = '../_app/assets/favicon-focus.png';
			} else {
			  document.title = attentionMessage;
			  favicon.href = '../_app/assets/favicon-unfocus.png';
			}
		 }, 100);
	  }
	};
 }
 