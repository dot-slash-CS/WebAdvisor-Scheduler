/*!
 * Schedule builder
 *
 * Copyright (c) 2011, Edwin Choi
 *
 * Licensed under LGPL 3.0
 * http://www.gnu.org/licenses/lgpl-3.0.txt
 */

(function() {
	/*
	IE doesn't have MessagePort and MessageChannel objects... so we need to emulate
	those.
	*/
	
	// window = undefined iff we're running in a web worker.. in which case, there's no reason it shouldn't have MessagePort
	if (typeof window !== "undefined" && typeof MessageChannel !== "undefined") return;
	
	function _createMessagePort(ports, portId) {
		var queue = [];
		var listeners = {};
		var state = 0;
		
		function _MessagePort() {
			this.onmessage = null;
			this.onerror = null;
		}
		_MessagePort.prototype = {
			addEventListener: function(name, cb, ignore) {
				if (!listeners[name]) listeners[name] = [];
				listeners[name].push(cb);
			},
			removeEventListener: function(name, cb, ignore) {
				if (!listeners[name]) return;
				listeners[name].splice($.inArray(cb, listeners[name]), 1);
			},
			dispatchEvent: function(evt) {
				var l = listeners[evt.type];
				if (("on" + evt.type) in this) {
					var cb = this["on" + evt.type];
					if (cb) {
						cb(evt);
					}
				}
				if (!l) { return; }
				for (var i = 0; i < l.length; i++)
					l[i](evt);
			},
			postMessage: function(msg) {
				if (state == 2)throw new Error("closed");
				//msg = JSON.parse(JSON.stringify(msg));
				var msgEvt = {
					type: "message",
					origin:"",
					ports:null,
					data: msg
				};
				if (state == 0) {
					queue.push(msgEvt);
					return;
				}
				var self = this;
				var port = ports[(portId + 1) % 2];
				setTimeout(function() {
					try {
						port.dispatchEvent(msgEvt);
					} catch(e) {
						self.dispatchEvent({exception:e});
					}
				}, 0);
			},
			start: function() {
				if (state != 0) return;
				state = 1;
				var port = ports[(portId + 1) % 2];
				port.start();
				while (queue.length) {
					port.dispatchEvent(queue.shift());
				}
			},
			close: function() {
				state = 2;
			}
		};
		return new _MessagePort();
	}
	function _createPortPair() {
		var ports = [];
		ports[0] = _createMessagePort(ports, 0);
		ports[1] = _createMessagePort(ports, 1);
		return ports;
	}
	function _MessageChannel() {
		var ports = _createPortPair();
		this.port1 = ports[0];
		this.port2 = ports[1];
	}
	MessageChannel = _MessageChannel;
})();
