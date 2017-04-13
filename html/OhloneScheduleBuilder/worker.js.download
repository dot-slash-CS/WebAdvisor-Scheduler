/*!
 * Schedule builder
 *
 * Copyright (c) 2011, Edwin Choi
 *
 * Licensed under LGPL 3.0
 * http://www.gnu.org/licenses/lgpl-3.0.txt
 */

/* provides a fake Worker implementation
 * the implementation here is in no way a web worker replacement...
 * all this will do is load the script from the given URL, then look for a global
 * function named <script-name>_connectObject.
 * it passes the MessagePort to the script, which is then used to communicate between
 * the two end points.
 */

(function() {
	if (typeof Worker !== "undefined") return;
	
	function _Worker(url) {
		var scr = document.createElement("script");
		scr.type = "text/javascript";
		scr.src = url;
		$("head")[0].appendChild(scr);
		
		var channel = new MessageChannel();
		$(scr).load(function() {
			var sp = url.lastIndexOf('/');
			var ep = url.lastIndexOf('.');
			var name = url.substr(sp+1, ep - sp - 1);
			window[name + "_connectObject"](channel.port2);
			channel.port2.start();
		});
		$.extend(this, channel.port1);
	}
	$.extend(_Worker.prototype, {
		terminate: function() {
			this.close();
		}
	});
	
	Worker = _Worker;
}());
