/*!
 * Schedule builder
 *
 * Copyright (c) 2011, Edwin Choi
 *
 * Licensed under LGPL 3.0
 * http://www.gnu.org/licenses/lgpl-3.0.txt
 */

/**
 * Parses the time string as an integer. The returned value is in milliseconds.
 * 
 * Adding to a Date object... var di = new Date(); var df = new
 * Date(di.getTime() + parseTime("12:13"));
 */
function parseTime(s) {
	var parts = s.split(':');
	if (parts.length != 2 && parts.length != 3 || s.indexOf('.') != -1) {
		console.error("parseTime only accepts hh:mm[:ss]");
		return -1;
	}

	// use negative logic so the expression evaluates to true on non-numeric
	// values
	if (!(parts[0] >= 0) || !(parts[1] >= 0 && parts[1] < 60)) {
		console.error("invalid number (%s)", s);
		return -1;
	}

	return ((parseInt(parts[0], 10) * 60) + parseInt(parts[1], 10)) * 60 * 1000;
}
function parseTime2(str) {
	var match = /^(\d\d?):(\d\d)(?::(\d\d)(?:\.(\d\d\d))?)?(?:\s*(am|pm))?$/i.exec(str);
	if (match == null)
		throw new Error("Time format is invalid. Expected: hh:mm[:ss[.mmm]] [am/pm]. Received: " + str);
	var h = parseInt(match[1], 10);
	var m = parseInt(match[2], 10);
	var s = parseInt(match[3] || 0, 10);
	var ms = parseInt(match[4] || 0, 10);
	var ampm = match[5];

	if (h > 23 || (ampm && (h == 0 || h > 12)) || (m > 59) || (s > 59))
		throw new RangeError("Not a valid time");

	if (ampm) {
		ampm = ampm.toLowerCase();
		if (ampm == "pm" && h != 12) {
			h += 12;
		}
	}
	return ms + 1000 * (s + 60 *(m + 60 * h));
}

function timeToStr(t) {
	t /= 1000;
	var h = Math.floor(t / (60 * 60));
	var m = Math.floor((t / 60) % 60);
	return ((h % 12) == 0 ? "12" : (h % 12)) + ":" + (m < 10 ? "0" : "") + m + (h < 12 ? "am" : "pm");
}

function genTimeStrOverInterval(stime, etime, step) {
	var stime = parseTime(stime);
	var etime = parseTime(etime);
	var step = parseTime(step);

	var res = [];
	while (stime < etime) {
		res.push(timeToStr(stime));
		stime += step;
	}
	return res;
}

(function($, undefined) {
	function formatTime(t, neat) {
		t = Math.floor(t / (1000 * 60));
		var mm = t % 60;
		var hh = Math.floor(t / 60);

		if (neat)
			return (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm + ":00";
		else {
			var ampm = hh >= 12;
			hh %= 12;

			var s = "";
			if (hh == 0) s += "12";
			else s += hh;
			s += ":" + ((mm < 10) ? "0" : "") + mm;
			return s + " " + (ampm ? "pm" : "am");
		}
	}

	function generate(lower, upper, step) {
		var ret = [];
		for (; lower < upper; lower += step)
			ret.push(lower);
		return ret;
	}

	function renderViewH(owner, opts) {
		var r = opts._range;
		var s = "";
		s += "<div class='sv-lcol'><table class='sv-lcol-table'><tr><th class='sv-col-hdr'>&nbsp;</th></tr>";
		s += $.map(opts.dayNames, function(d) { return "<tr><td class='sv-row-hdr'><span>" + d + "</span></td></tr>"; });
		s += "</table>";
		s += "</div>";
		s += "<div class='sv-grid sv-grid-h'>";
		s += "<table class='sv-grid-table'>";
		s += "<thead>";
		var times = generate(r.lower, r.upper, r.step * 2);
		s += "<tr>" + $.map(times, function(x) { return "<th class='sv-col-hdr'><span>" + formatTime(x) + "</span></th>"; }).join("") + "</tr>";
		s += "</thead>";
		s += "<tbody>";
		
		var timeRow = $.map(times, function(x) { return "<td class='sv-grid-col sv-grid-cell' time='" + formatTime(i, true) + "' />"; }).join("");
		for (var j = 0; j < opts.days.length; j++) {
			s += "<tr class='sv-grid-row-h sv-day-" + opts.days[j] + "'>" + timeRow + "</tr>";
		}
		s += "</tbody></table>";
		s += "<div class='sv-events-container'></div>";
		s += "<div class='sv-virtual-events'><strong>Non-meeting courses</strong></div>";
		s += "</div>";
		s += "<div style='clear:both'></div>";
		var sv = $("<div class='sv-view'/>");
		sv[0].innerHTML = s;
		sv.find(".sv-grid tr").children(":first-child").addClass("sv-first-col");
		owner.prepend(sv);
	}

	function renderView(owner, opts) {
		var r = opts._range;

		var s = "";
		s += "<div class='sv-lcol'><table class='sv-lcol-table'><tr><th class='sv-col-hdr'>&nbsp;</th></tr>";
		var step = r.step * 2;
		// empty row is needed for layout... FF and chrome don't agree on how to handle collapsed borders
		for (var t = r.lower; t < r.upper; t += step)
			s += "<tr class='even'><td class='sv-row-hdr'><span>" + formatTime(t) + "</span></td></tr><tr class='odd'><td class='sv-row-hdr'/></tr>";
		s += "</table>";
		s += "</div>";

		var wpct = (100.0 / opts.days.length) + "%";
		s += "<div class='sv-grid'>"; {
			s += "<table class='sv-grid-table'>";
			s += "<colgroup>";
			for (var i = 0; i < opts.days.length; i++)
				s += "<col class='sv-body-tbl-col' style='width:" + wpct + "'/>";
			s += "</colgroup>";
			s += "<thead><tr class='sv-grid-hdr-row'>";
			for (var i = 0; i < opts.days.length; i++) {
				s += "<th class='sv-grid-col sv-col-hdr sv-day-" + opts.days[i] + "' style='width:" + wpct + "'><span class='sv-grid-col-label'>";
				s += opts.dayNames[opts.days[i] - 1];
				s += "</span></th>";
			}
			s += "</tr></thead><tbody>";
			var cnt = 0;
			var oddeven = ["even","odd"];
			for (var i = r.lower; i < r.upper; i += r.step) {
				s += "<tr class='sv-grid-row " + (i == r.lower ? "sv-row-first " : "") + oddeven[cnt] + "' time='" + formatTime(i, true) + "'>";
				for (var j = 0; j < opts.days.length; j++)
					s += "<td class='sv-grid-col sv-grid-cell sv-day-" + opts.days[j] + "'/>";
				s += "</tr>";
				cnt = (cnt+1)%2;
			}
			s += "</tbody></table>";
			s += "<div class='sv-events-container'></div>";
			s += "<div class='sv-virtual-events'><strong>Non-meeting courses</strong></div>";
		}
		s += "</div>";
		s += "<div style='clear:both'></div>";
		var sv = $("<div class='sv-view'/>");
		sv[0].innerHTML = s;
		sv.find(".sv-grid tr").children(":first-child").addClass("sv-first-col");
		owner.prepend(sv);

		return sv;
	}
	function renderEvent(id, o) {
		var ev = $("<div id='evt_" + id + "' class='sv-event'><span class='sv-closer ui-icon ui-icon-close' style='float:right;position:relative;'></span></div>");
		ev.attr("evtId", o.id || o.name).attr("name", o.name).attr("type", o.type);
		//ev.draggable({ grid: [this._dim.width, this._dim.height] });
		ev.addClass("ui-corner-all " + (o.cssClass || ""));
		var content = $("<div class='sv-event-content'>");
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//		var title = $("<div class='sv-event-title'><strong>" + (o.name) + "</strong></div>");
		var title = $("<div class='sv-event-title'><strong>" + getSub(o.title) + " (" + o.credits + ")</strong></div>");
//		for (var i in o) {
//			alert(i + ':' + o[i]);
//		}

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//		if (o.location)
//			title.append(" @ <span class='sv-event-location'>" + o.location + "</span>");
		if (o.prof)
			title.append(" <span class='sv-event-location'> " + o.prof + " </span>");
			
		content.append(title);
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if (o.start && o.end)
			content.append("<span class='sv-event-location' style='/*display: block; margin-top: 1px*/'>" + timeToStr(o.start) + "-" + timeToStr(o.end) + " @ " + o.location + "</span>");
//			content.append("<span class='sv-event-range'>" + timeToStr(o.start) + "-" + timeToStr(o.end) + "</span>");
		if (o.content) {
			content.append("<span class='sv-event-notes'>" + o.content + "</span>");
		}
		ev.append(content);

		ev.bind("mouseenter", function(e) {
			var evt = $(this);
			evt.parent().find(".sv-event[name=" + evt.attr("name") + "]").addClass("sv-event-highlight");
		}).bind("mouseleave", function(e) {
			var evt = $(this);
			evt.parent().find(".sv-event[name=" + evt.attr("name") + "]").removeClass("sv-event-highlight");
		});

		return ev;
	}

	function _bits() { return bits_per_integer; }
	function _contains(a, i) { return (a & (1 << i)) != 0; }
	function _get(a, i) { return (a >> i) & 1; }
	function _set(a, i) { return a | (1 << i); }
	function _clr(a, i) { return a & ~(1 << i); }
	function _and(a, b) { return a & b; }
	function _or(a, b) { return a | b; }
	function _iszero(a) { return a == 0; }
	function _mkset(n) { return ((1 << n) - 1); } // overflows when n is _bits
	function _notin(a, b) { return a & ~b; }
	function _count(x) {
	    var v = x - ((x >>> 1) & 0x55555555);
	    v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
	    return ((v + (v >>> 4) & 0x0F0F0F0F) * 0x01010101) >>> 24;
	}
	function _each(a, callback, ctx) {
		for (var i = 0; a != 0 && i < 32; i++) {
			if (_contains(a, i)) {
				_clr(a, i);
				if (callback.call(ctx, i) === false)
					break;
			}
		}
	}
	function _list(a) {
		var ret = [];
		_each(a, ret.push, ret);
		return ret;
	}

	function createGrid(container, opts) {
		this.p = {
			container: container[0],
			grid: container.find(".sv-grid-table")[0],
			events: [],
			evtCont: $(".sv-events-container", container),
			vevtCont: $(".sv-virtual-events", container),
			padX: (6 + 6 + 1 + 1),
			padY: (6 + 2 + 1 + 1)
		};
		var self = this;
		this.p.colwidth = this.p.evtCont.width() / opts.days.length;
		this.p.colheight = this.p.evtCont.height() / (opts._range.upper - opts._range.lower);/*
		{
			var bd = el.find(".sv-grid-body-table")[0];
			var ec = this.p.evtCont[0];
			var off = (bd.offsetLeft - ec.offsetLeft) + " " + (bd.offsetTop - ec.offsetTop);
			$(ec).css("top", (bd.offsetTop - ec.offsetTop) + "px").css("left", (bd.offsetLeft - ec.offsetLeft) + "px");
		}*/
		function _lookupById(array, id) {
			for (var i = 0; i < array.length; i++)
				if (array[i].attr("id") == id)
					return i;
			return -1;
		}
		function _getDayEvents(day) {
			if (self.p.events[day] === undefined)
				self.p.events[day] = [];
			return self.p.events[day];
		}
		function _getXOff(day) {
			var el = $(".sv-day-" + day)[0];
			return el.offsetLeft - $(el).parent().children(":first")[0].offsetLeft + 2;
		}
		function _getYOff(time) {
			return self.p.colheight * (time - opts._range.lower) + 1;
		}
		function _doLayout(day) {
			var evts = _getDayEvents(day);
			var dset = [], desc = [], conf = [];
			for (var i = 0; i < evts.length; i++) {
				dset[i] = i; desc[i] = 0; conf[i] = 0;
				var links = evts[i].data("links");
				for (var j = i + 1; j < evts.length; j++) {
//					alert(evts[i].data);
//					alert('in');
					if (j == i)
						continue;
//					alert(evts[i]);

					//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//					if (testConflict(evts[i], evts[j])) {
//						links.push(evts[j]);
//					}
					try {
						if (testConflict(evts[i], evts[j])) {
							links.push(evts[j]);
						}
					}
					catch (e) {
						console.log('err in testConflict...')
					}
				}
				for (var j = 0; j < links.length; j++)
					conf[i] = _set(conf[i], $.inArray(links[j], evts));
			}

			var v = 0;
			for (var i = 0; i < evts.length; i++) {
				var ev = evts[i];
				if (ev.hasClass("sv-event-locked") || !conf[i]) {
					ev.css("left", _getXOff(day));
					ev.width(self.p.colwidth/* - (ev.outerWidth() - ev.width())*/ - 1);
					ev.show();
					v = _set(v, i);
				}
			}
			var stk = [];
			var hasViols = false;
			for (var x = 0; x < evts.length; x++) {
				if (_contains(v, x))
					continue;
				v = _set(v, x);

				stk.push(x);
				var gconf = 0;
				while (stk.length > 0) {
					// set the ith element as existing in the group
					// append all elements of gconf not in the current configuration and ~(gconf | v)
					var i = stk.pop();
					gconf = _set(gconf, i);
					stk.push.apply(stk, _list(_notin(conf[i], _or(gconf, v))));
				}
				//add all visited vertices gconf
				v = _or(v, gconf);
				
				//gconf represents the set of all valid

				var groups = _list(gconf);
				groups.sort(function(a, b) {
					return -(_count(conf[a]) - _count(conf[b]));
				});
				//console.info(groups);

				var cols = [];
				for (var i = 0; i < groups.length; i++) {
					var u = groups[i];
					var j;
					for (j = 0; j < cols.length; j++) {
						if ((conf[u] & cols[j]) == 0) {
							cols[j] = _set(cols[j], u);
							cols.sort(function(a, b) {
								return -(_count(a) - _count(b));
							});
							break;
						}
					}
					if (j == cols.length) {
						cols.push(1 << u);
						hasViols = true;
					}
				}
				// smaller cols have wider spans
				cols.sort(function(a, b) {
					return _count(a) - _count(b);
				});

				if (opts.confLayout == "stacked") {
					var xr = self.p.colwidth / (2 * Math.max(4, cols.length));
					var x0 = _getXOff(day);

					for (var i = 0; i < cols.length; i++) {
						var x = self.p.colwidth - xr * i;
						_each(cols[i], function(j) {
							var ev = evts[j];
							ev.css("left", x0);
							ev.width(x - (ev.outerWidth(false) - ev.width()));
							ev.show();
						}, evts);
					}
				} else {
					var xr = self.p.colwidth / cols.length;
					var x0 = _getXOff(day);
					for (var i = 0; i < cols.length; i++) {
						_each(cols[i], function(j) {
							var ev = this[j];
							ev.css("left", x0 + xr * i);
							ev.width(xr - (ev.outerWidth(false) - ev.width()));
							ev.show();
						}, evts);
					}
				}
				//console.info(cols);
			}
			return hasViols;
		}

		$.extend(this, {
			_add: function(o) {
				var evtCont = this.p.evtCont;
				var stime = o.start, etime = o.end;
				if (stime > etime) throw new Error("negative interval given");
//				alert('Reg:in:_add')

				var ev = renderEvent((o.id || o.name) + "_" + o.day, o);
				ev.attr("day", o.day).attr("start", timeToStr(o.start)).attr("end", timeToStr(o.end));
				ev.data("range", {"stime": stime, "etime": etime});
				ev.data("links", []);
				if (o.locked) ev.addClass("sv-event-locked");

				// position the event and compute the approximate area to cover
				// conflicts only affect the horizontal area...
				ev.css("top", _getYOff(stime));
				ev.height((etime - stime) * this.p.colheight - 1);
				// padding = 2, 6, 6, 6
				// border = 1

				var links = ev.data("links");
				var dayevts = _getDayEvents(o.day);
				if (dayevts.length > 0) {
					for (var i = 0; i < dayevts.length; i++) {
						var v = dayevts[i];
						var r = v.data("range");
						if ((stime >= r.stime && stime < r.etime) ||
							(r.stime >= stime && r.stime < etime)) {
							if (o.locked && !v.hasClass("sv-event-locked")) {
								throw new Error("Trying to add a locked event (" + v.attr("name") + "," + o.name + ")");
							}
							if (!o.locked && v.hasClass("sv-event-locked")) {
								console.info("conflict found between '" + o.name + "' and '" + v.attr("name") + "'");
								continue;
							}
							v.data("links").push(ev);
							links.push(v);
						}
					}
				}

				var ipos = 0;
				for (; ipos < dayevts.length; ipos++) {
					var b = dayevts[ipos].data("range");
					if (b.stime > stime)
						break;
					if (b.stime == stime && b.etime > etime)
						break;
				}

				// store the event
				if (ipos == 0)
					evtCont.prepend(ev);
				else if (ipos == dayevts.length)
					evtCont.append(ev);
				else
					dayevts[ipos].before(ev);
				dayevts.splice(ipos, 0, ev);

				//evtCont.children(".sv-event").each(function() {
				//	if (ev.attr("name") != $(this).attr("name"))
				//	if (hitTest(ev, $(this))) {
				//		$(this).width($(this).width() / 2);
				//		ev.width(ev.width() / 2);
				//		return true;
				//	}
				//});

				if (this.p.activeLayout) {
					if (links.length > 0 || o.locked)
						this.valid = _doLayout(o.day);
					else {
						ev.width(this.p.colwidth - (ev.outerWidth(true) - ev.width()));
						ev.css("left", _getXOff(o.day));
					}
				}

				return ev;
			},
			_addAll: function(obj, slots) {
				if (slots) {
					if (!slots.length) {
//						alert('Non-meet:in:_addAll')
						var ev = renderEvent(obj.id || obj.name, obj);
						ev.width(this.p.colwidth - 2);
						this.p.vevtCont.append(ev);
						return ev;
					}
					var tmp = $.extend(true, {}, obj);
					for (var i = 0; i < slots.length; i++) {
						this._add($.extend(tmp, slots[i]));
					}
				} else {
					return this._add(obj);
				}
				return this.p.evtCont.find(".sv-event[name=" + obj.name + "]");
			},
			_remove: function(evts) {
				if (evts.parent().is(".sv-virtual-events")) {
					evts.remove();
					return;
				}
				for (var i = 0; i < evts.length; i++) {
					var ev = $(evts[i]);
					var array = _getDayEvents(ev.attr("day"));
					array.splice(_lookupById(array, ev.attr("id")), 1);

					var links = ev.data("links");
					if (links.length > 0) {
						for (var j = 0; j < links.length; j++) {
							var ref = links[j].data("links");
							ref.splice(_lookupById(ref, ev.attr("id")), 1);
						}
						ev.removeData("links");
					}
					ev.remove();
				}
			},

			addAll: function(obj, slots) {
				var evtCont = this.p.evtCont;
				if ($(".sv-event[name=" + obj.name + "]", evtCont).length > 0)
					throw new Error("duplicate event '" + obj.name + "' (" + (obj.id || obj.name) + ")");

				return this._addAll(obj, slots);
			},
			/**
			 * {
			 *     id
			 *     name: name of the event (or series)
			 *     title
			 *     content
			 *     cssClass
			 *     day
			 *     range
			 * }
			 * 
			 * @param obj
			 */
			add: function(o) {
				var evtCont = this.p.evtCont;
				if ($(".sv-event[name=" + o.name + "]", evtCont).not("[evtid=" + (o.id || o.name) + "]").length > 0)
					throw new Error("duplicate event '" + o.name + "' (" + (o.id || o.name) + ")");

				var ev = this._add(o);
				return ev;
			},
			remove: function(arg) {
				var evtCont = this.p.evtCont;
				var evts;
				var name = arg;
				if ($.type(arg) !== "string")
					name = $(arg).attr("name");
				if (evtCont.is(":has(.sv-event[name=" + name + "])")) {
					evts = this.p.evtCont.find(".sv-event[name=" + name + "]");
				} else {
					evts = this.p.vevtCont.find(".sv-event[name=" + name + "]");
				}

				this._remove(evts);
				this.doLayout();
				return evts.length > 0;
			},
			update: function(o, slots) {
				var evts = $(this.p.container).find(".sv-event[name=" + o.name + "]");
				if (evts.length == 0) {
					return this.addAll(o, slots);
				}

				this._remove(evts);
				var res = this._addAll(o, slots);
				this.doLayout();
				return res;
			},
			clear: function() {
				var evts = this.p.evtCont.find(".sv-event").add(this.p.vevtCont.find(".sv-event"));
				evts.remove();
				this.p.events = [];
			},
			containsId: function(id) {
				return this.p.evtCont.find(".sv-event[evtId=" + id + "]").length != 0;
			},
			findViolations: function(day, stime, etime, locked) {
				var evts = _getDayEvents(day);
				var res = [];
				for (var i = 0; i < evts.length; i++) {
					var r = evts[i].data("range");
					console.info(r);
					if ((stime >= r.stime && stime < r.etime) || (r.stime >= stime && r.stime < etime)) {
						if (locked && !evts[i].hasClass("sv-event-locked"))
							res.push(evts[i].attr("name"));
						else if (!locked)
							res.push(evts[i].attr("name"));
					}
				}
				return res;
			},
			changeClass: function(name, to) {
				var evts = this.p.evtCont.children(".sv-event[name=\"" + name + "\"]");
				if (evts.length == 0)
					return false;
				var ret = evts.attr("_keyClass");
				evts.removeClass(ret).addClass(to);
				evts.attr("_keyClass", to);
				return ret;
			},
			doLayout: function() {
				this.p.activeLayout = true;
				for (var i = 0; i < opts.days.length; i++)
					_doLayout(opts.days[i]);
				this.p.vevtCont.children(".sv-event").width(this.p.colwidth - 2);
			},
			invalidate: function() {
				var gd = $(this.p.grid).parent();
				gd.width(
					gd.parent().width() -
					gd.prev().outerWidth(false) -
					(gd.outerWidth(true) - gd.width()));
				this.p.activeLayout = true;
				var dayCnt = opts.days.length;
				gd.width(Math.floor(gd.width() / dayCnt) * dayCnt);

				var ec = this.p.evtCont;
				var bd = $(this.p.grid.tBodies[0]);

				ec.css("top", bd.position().top);
				ec.css("left", bd.position().left);
				//$(this.p.grid).height($(this.p.grid).prev().height());
				//ec.css("left", bd.position().left);

				ec.width(bd.width());
				ec.height(bd.height());
				this.p.vevtCont.width(bd.width());

				this.p.colwidth = $(bd[0].rows[0].cells[0]).width() - 3;
				this.p.colheight = (this.p.evtCont.height() - 1) / (opts._range.upper - opts._range.lower);
				this.doLayout();
			},
			freezeLayout: function() {
				this.p.activeLayout = false;
			},
			hasConflicts: function() {
				var hasconf = false;
				this.p.evtCont.children(".sv-event").each(function() { return !(hasconf = $(this).data("links").length != 0); });
				return hasconf;
			},
			getEvents: function(name) {
				return $(this.p.container).find(".sv-event[name=" + name + "]");
			},
			getDaysVisible: function(compact) {
				var names = $.map(opts.days, function() { return opts.dayNames[this - 1]; });
				if (compact)
					for (var i = 0; i < names.length; i++)
						names[i] = names[i].substr(0, 2);
				return names;
			},
			getTimeLowerBound: function() {
				return opts.range.lower;
			},
			getTimeUpperBound: function() {
				return opts.range.upper;
			},
			getTimeStep: function() {
				return opts.timestep;
			},
			getCanvas: function() {
				return this.p.evtCont;
			},
			serialize: function(callback) {
				var evs = [];
				var map = {};
				$.each($(this.p.container).find(".sv-event"), function() {
					var ev = $(this);
					if (ev.parent().is(".sv-virtual-events")) {
						evs.push({
							id: ev.attr("evtid"),
							name: ev.find(".sv-event-title").text(),
							type: ev.attr("type"),
							bgColor: ev.css("background-color"),
							slots: []
						});
						return;
					}

					var slot = {};
					slot.day = parseInt(ev.attr("day"));
					slot.start = parseTime2(ev.attr("start"));
					slot.end = parseTime2(ev.attr("end"));
					slot.location = ev.find(".sv-event-location").text();

					var name = ev.attr("name");
					if (name in map) {
						evs[map[name]].slots.push(slot);
					} else {
						map[name] = evs.push({
							id: ev.attr("evtid"),
							name: ev.find(".sv-event-title").text(),
							type: ev.attr("type"),
							bgColor: ev.css("background-color"),
							slots: [slot]
						}) - 1;
					}
				});
				return evs;
			}
		});
	}

	$.fn.schedule = function(opts) {
		if (this.data("schedule"))
			return this.data("schedule");

		var o = $.extend({
			range: { lower: "08:00", upper: "22:00" },
			timestep: "00:30",
			cellHeight: 11,
			cellWidth: 116,
			week: [ 2, 7 ],
			days: [2,3,4,5,6,7],
			dayNames: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
			confLayout: "column"
		}, opts || {});

		var r = {lower: parseTime(o.range.lower), upper:parseTime(o.range.upper)};
		r.step = parseTime(o.timestep);
		o._range = r;

		var ret;
		this.each(function() {
			var el = $(this).find(".sv-view");
			if (el.length == 0)
				el = renderView($(this), o);
			ret = new createGrid(el, o);
			$(this).data("schedule", ret);
			var self = this;
			$(this).resize(function() {
				ret.invalidate();
			});
		});
		return ret;
	};
})(jQuery);
