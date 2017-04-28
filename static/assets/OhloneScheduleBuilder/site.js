/*!
 * Schedule builder
 *
 * Copyright (c) 2011, Edwin Choi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*
This file is in serious need of a clean-up. Not only that but of a re-evaluation of the
logic. Much of the functionality was just mashed up together. There's a lot of dead code
and likely leaks.

Couple things to focus on:
1. How events are attached -- ensure events are being removed.
2. Don't attach custom properties to DOM objects.
3. Deconvolute the valid combinations view portion -- the computations are sufficiently separated by using
   a "message-passing-like" approach (using dynamically generated proxies to communicate over a pipe --
   e.g. WebWorker's postMessage)
 */

/*
 * various background colors used
 */
var COLORS = [
	"ffaaaa",
	"b5e198",
	"b4cdeb",
	"ffeda0",
	"c3acda",
	"f5c65f",
	"e1b5a5",
	"d7fac6",
	"b0bfeb"
];

(function($, undefined) {
	$.fn.comboBox = function() {
	};
})(jQuery);

function CoursePanel(conf) {
}
CoursePanel.prototype = {
	render: function(conf) {
		var pane = $("<div class='minipane'></div>");
		pane.append("<span class='ui-icon ui-icon-close' style='float:right;'>&nbsp;</span>")
			.append("<span class='color-indicator' style='background-color:#faa;'>&nbsp;</span>")
			.append($("<strong></strong>").text(conf.course))
			.append($("<span></span>").text("(" + conf.credits.toFixed(2) + ")"))
			.append($("<span></span>").text(conf.title).css("display", "block"));
	}
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function getSub(crs) {
	var res = '';
	var i
	for (i = 0; i < crs.length; i++) {
		if ('0123456789'.indexOf(crs[i]) != -1) {
			break;
		}
		res += crs[i];
	}
	return res + ' ' + crs.slice(i);
}

/*
 * Displays a modal message
 */
function showMessage(type, message, delay) {
	var title;
	if ($.isPlainObject(type)) {
		var obj = type;
		type = obj.type;
		title = obj.title;
		message = obj.message;
		delay = obj.delay;
	}
	title = title || "";
	var pane = $("#messagePanel");
	switch(type.toLowerCase()) {
	case "error": type = "Error"; break;
	case "warn": type = "Warning"; break;
	default: type = "Information"; break;
	}
	delay = delay || 0;
	pane.children("img")[0].src = "css/images/" + type.toLowerCase() + ".png";
	pane.children(".dialog-title").empty().append(type).append(title);
	pane.children(".dialog-message").empty().append(message);
	
	var ovr = $("#messagePanel").overlay({
		width: '412px',
		closeOnClick: false,
		oneInstance: false,
		api: true
	});
	setTimeout(function() {
		ovr.load();
		pane.find(".close").focus();
	}, delay);
}

function ucfirst(s) {
	return s.charAt(0).toUpperCase() + s.substr(1);
}

/*
 * add support for event handling to the given object.
 * 
 * imitates the behavior of native event handling
 */
function eventPublisher(obj) {
	var listeners = {};
	obj.addEventListener = function(name, callback, ignored) {
		if (!listeners[name])
			listeners[name] = [];
		var cbs = listeners[name];
		if ($.inArray(callback, cbs) == -1) {
			cbs.push(callback);
		}
	};
	obj.removeEventListener = function(name, callback, ignored) {
		if (!listeners[name])
			return;
		var cbs = listeners[name];
		var pos = $.inArray(callback, cbs);
		if (pos != -1) {
			cbs.splice(pos, 1);
		}
	};
	obj.dispatchEvent = function(evt) {
		if (!listeners[evt.type])
			return;
		var cbs = listeners[evt.type];
		for (var i = 0; i < cbs.length; i++) {
			if (cbs[i].call(this, evt) === false)
				return false;
		}
	};
	return obj;
}

/*
 * schedule storage
 */
Schedules = (function(undefined) {
	return {
		add: function(crs, data) {
			if (typeof crs !== "string" || crs == "undefined")
				throw new TypeError();
			localStorage.setItem("schedule:" + crs, new Date().getTime() + "!" + data);
		},
		remove: function(crs) {
			localStorage.removeItem("schedule:" + crs);
			this.clearSelected(crs);
		},
		getItem: function(crs) {
			var item = localStorage.getItem("schedule:" + crs);
			var idx = item.indexOf("!");
			return item.substr(idx + 1);
		},
		setSelected: function(crs, sel) {
			if (typeof crs !== "string" || crs == "undefined")
				throw new TypeError();
			localStorage.setItem("schedule:" + crs + ":sel", sel);
		},
		getSelected: function(crs) {
			var sel = localStorage.getItem("schedule:" + crs + ":sel");
			if (sel == null)
				return false;
			return parseInt(sel);
		},
		clearSelected: function(crs) {
			localStorage.removeItem("schedule:" + crs + ":sel");
		},
		toString: function(crs) {
			if (arguments.length == 1) {
				var sel = this.getSelected(crs);
				return this.getItem(crs) + (sel !== false ? ("#" + sel) : "");
			}
			return this.prototype.toString();
		},
		toArray: function() {
			var res = [];
			var order = localStorage.getItem("schedule:courseorder");
			if (order)
				order = order.split(",");
			var regexp = new RegExp("^schedule:(\\w+)$");
			for (var k = 0; k < localStorage.length; k++) {
				var match = regexp.exec(localStorage.key(k));
				if (match == null)
					continue;
				if (order)
					res[$.inArray(match[1], order)] = this.toString(match[1]);
				else
					res.push(this.toString(match[1]));
			}
			for (var i = 0; i < res.length;) {
				if (!res[i])
					res.splice(i, 1);
				else
					i++;
			}
			return res.reverse();
		},
		getNames: function() {
			var res = [];
			var regexp = new RegExp("^schedule:(\\w+)$");
			for (var k = 0; k < localStorage.length; k++) {
				var match = regexp.exec(localStorage.key(k));
				if (match == null)
					continue;
				res.push(match[1].replace("/", ""));
			}
			return res;
		},
		clear: function() {
			for (var i = 0; i < localStorage.length; i++) {
				if (/^schedule:\\w+$/.test(localStorage.key(i)))
					localStorage.removeItem(localStorage.key(i));
			}
		}
	};
})();

//XXX: schedule ops are too decentralized.. needs rework
var scheduleEvents = $(eventPublisher({}));

var loadComplete = new $.Deferred();


var DataService = {
	findCourse: function(p) {
		var d = $.Deferred();
		var parts = p.split(";");
		var res = [];
		require(["include/datasvc.php?p=/"], function(result) {
			var data = result.data;
			for (var i = 0; i < parts.length; i++) {
				var key = parts[i].replace(/\//g, "").toUpperCase();
				for (var j = 0; j < data.length; j++) {
					if (data[j][0] == key) {
						res.push(data[j].slice(0));
						break;
					}
				}
			}
			d.resolve(res);
		}, function() {
			d.reject();
		});
		return d.promise();
	},
	findMatch: function(req, cb, limit) {
		limit = limit || 30;
		var term = $.trim(req.term);
		var off = 0;
		if (term.charAt(0) == "@") {
			off = 1;
			term = term.substr(1);
		}
		if (term.length == 0)
			return;
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//		var re = new RegExp((off==0 && "^" || "") + "(" + term + ")", "i");
		try {
			var re = new RegExp((off==0 && "^" || "") + "(" + term + ")", "i");
		}
		catch (e) {
			console.log('Err in RegExp')
			return
		}
		require(["include/datasvc.php?p=/"], function(result) {
			var res = [];
			var data = result.data;
			for (var i = 0; i < data.length; i++) {
				var course = data[i];
				if (re.test(course[off])) {
					var roff = 3;
					if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(course[0][course[0].length-1]) !== -1)
						roff = 4;
					var path = course[0].substr(0, course[0].length-roff) + "/" + course[0].substr(-roff);
					var label = course[0] + " - " + course[1];
					res.push({title: course[1], value: course[0], path: path, label: label.replace(re, "<strong>$1</strong>")});
					if (res.length >= limit)
						break;
				}
			}
			cb(res);
		});
	}
};

function requestData(p) {
	var parts = p.split(";");
	var d = new $.Deferred();
	require(["include/datasvc.php?p=/"], function(result) {
		var res = [];
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//		var data = result.data;
		var data = JSON.parse(JSON.stringify(result)).data;
		for (var i = 0; i < parts.length; i++) {
			var key = parts[i].replace(/\//g, "").toUpperCase();
			for (var j = 0; j < data.length; j++) {
				if (data[j][0] == key) {
					res.push(data[j].slice(0));
					break;
				}
			}
		}
		d.resolve(res);
	}, function() {
		d.reject();
	});
	return d.promise();
}

function mapData(data) {
	if (!$.isArray(data[0])) return data;
	var store = [];
//	alert(data);
	for (var i = 0; i < data.length; i++) {
		var crsdata = data[i];
		var rec = {
			//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			course: crsdata[0],
//			course: getSub(crsdata[0]),
			title: crsdata[1],
			credits: parseFloat(crsdata[2]),
			sections: []
		};
		for (var j = 3; j < crsdata.length; j++) {
			var secdata = crsdata[j];
			var n = 1;
			var sec = {
				//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
				course: crsdata[0],
//				course: getSub(crsdata[0]),
				section: secdata[n++],
				callnr: secdata[n++],
				seats: secdata[n++],
				instructor: secdata[n++],
				online: secdata[n++],
				honors: secdata[n++],
				comments: secdata[n++],
				alt_title: secdata[n++],
				slots: secdata[n++]
			};
			for (var k = 0; k < sec.slots.length; k++) {
				sec.slots[k] = {
					day: sec.slots[k][0],
					start: sec.slots[k][1] * 1000,
					end: sec.slots[k][2] * 1000,
					location: sec.slots[k][3]
				};
			}
			rec.sections.push(sec);
		}
		store.push(rec);
	}
	return store;
}

var changeCount = 0;
(function() {
	var courses = Schedules.toArray();

	var pps = [];
	$.each(courses, function(i) {
		pps.push(this.replace(/#.*/, ""));
	});

	if (pps.length == 0) {
		loadComplete.resolve([]);
	} else {
		var t0 = new Date().getTime();
		{
			requestData(pps.join(";/"))
				.done(function(data) {
					console.log("Data loaded after %.3fs", (new Date().getTime() - t0) * 1.0e-3);
					if (!data.hasOwnProperty("length")) {
						console.log("Query time %.3fs, n=%d", data.t,data.n);
						data = data.data;
					}
					changeCount = data.length;
					loadComplete.resolve(mapData(data));
				})
				.fail(function(xhr) {
					//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//					loadComplete.reject(xhr.responseText);
					try {
						loadComplete.reject(xhr.responseText);
					}
					catch (e) {
						console.log('Err in responseText...');
					}
				});
		}
	}
})();

window.onload = function() {
	window.onload = null;
	
	loadComplete
		.done(function(data) {
			while (data.length) {
				scheduleEvents._onInsertCourse(data.pop());
			}

			$(".sec-table").each(function() {
				var name = this.id.replace("tbl_","");
				var sel = Schedules.getSelected(name);
				if (sel) {
					var row = $(this).find("tr#" + sel)[0];
//					<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//					scheduleEvents._onSelectSection(name, row.rowIndex);
//					$("td.sec-input input", row)[0].checked = true;
					if (row) {
						scheduleEvents._onSelectSection(name, row.rowIndex);
						$("td.sec-input input", row)[0].checked = true;
					}
					else {
						console.log("Course doesn't exist in NJIT Course Schedule any more....");
					}
				}
			});
			$("#scheduleView").schedule().doLayout();

			$("#search_input").focus();
			scheduleEvents.trigger("loadComplete");
		})
		.fail(function(error) {
			showMessage("Error", error);
		});
};

/*
 * merge slots that differ only by the day of week
 */
function combineSlots(slots) {
	var combined = [];
	for (var i = 0; i < slots.length; i++) {
		combined[i] = {days: [slots[i].day], start: slots[i].start, end: slots[i].end};
		for (var j = i + 1; j < slots.length; ) {
			if (slots[i].start == slots[j].start && slots[i].end == slots[j].end) {
				combined[i].days.push(slots[j].day);
				slots.splice(j, 1);
			} else {
				j++;
			}
		}
	}
	return combined;
}

/*
 * data formatters
 */
var formatters = {
	slots: function(slots) {
		if (!slots || slots.length == 0)
			return "<em>Online</em>";
		return "<table class='slots-table'><tr>" + $.map(slots, function(n) {
			return "<td class='slot-day'>" + " UMTWRFS".charAt(n.day) +
				"</td><td class='slot-range'>" +
				timeToStr(n.start) + " - " + timeToStr(n.end) +
				"</td><td class='slot-location'>" + $.trim(n.location || "") + "</td>";
		}).join("</tr><tr>") + "</table>";
	},
	comments: function(val, cell, parent) {
		if (val && val.length > 0) {
			var ret = $("<span class='ui-icon ui-icon-comment'></span>");
			ret.append("<span class='_comment' style='display:none'>" + val + "</span>");
			new dijit.Tooltip({
				label: val,
				showDelay: 50
			}).addTarget(cell);
			return ret;
		}
		return "";
	},
	flags: function(val, cell, parent) {
		if (!val)
			return "";
		val = parseInt(val);
		var s = [];
		if (val & 1)
			s.push("<span>O</span>");
		if (val & 2)
			s.push("<span class='ui-icon ui-icon-lightbulb'></span>");
		if (val & 4)
			s.push("<span class='ui-icon ui-icon-flag'></span>");
		if (val & 8)
			s.push("<span class='ui-icon ui-icon-cancel'></span>");
		return s.join("<br/>");
	}
};
/*
 * data converters
 */
var converters = {
	slots: function(cell) {
		var tbl = $(cell).children(".slots-table")[0];
		if (!tbl)
			return [];

		var slots = [];
		$.each(tbl.rows, function() {
			if (this.cells.length != 3) {
				console.error("badly formed row");
				return false;
			}

			var range = $(this.cells[1]).text().split(/\s+-\s+/);
			var start = parseTime2(range[0]), end = parseTime2(range[1]);
			var loc = $(this.cells[2]).text();
			var days = $(this.cells[0]).text();
			for (var i = 0; i < days.length; i++)
				slots.push({day: " UMTWRFS".indexOf(days.charAt(i)), start: start, end: end, location: loc});
		});
		return slots;
	},
	comments: function(cell) {
		return $(cell).find('._comment').html();
	}
};

/*
 * converts a table row from a section table into a section object
 */
function extractSectionInfo(tr) {
	var o = {};
	o.callnr = tr.id;
	var tds = tr.cells;
	o.course = $(tr).parents(".sec-table").data("course");
	o.section = $(tr).find(".sec-section").text();
	o.instructor = $(tr).find(".sec-instructor").text();
	o.title = $(tr).data("title");
	o.slots = converters.slots($(tds).filter(".sec-slots")[0]);
	o.seats = $(tr).find(".sec-seats").text();
	o.comments = converters.comments($(tds).filter(".sec-comments")[0]);
	return o;
};

/*
 * renders a course and all its sections as a table
 */
function formatCourse(data) {
	if (!data.sections || data.sections.length === 0) {
		showMessage("Error", "'" + data.course + "' has no sections");
		return;
	}
	var crs = data;
	var name = crs.course;
	var secs = crs.sections;
	var tbl = $("<table class='sec-table' id='tbl_" + crs.course +"' data-course='" + crs.course + "' data-credits='" + crs.credits + "'>");
	for (var i = 0; i < secs.length; i++) {
		var sect = secs[i];
//		<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//		var tr = $("<tr id='" + sect.callnr + "' data-name='" + crs.course + "' data-title='" + (sect.alt_title || crs.title) + "'>");
		var full = false
		if (sect.seats) {
			var seats = sect.seats.split(/\s*\/\s*/);
			if (parseInt(seats[0]) >= parseInt(seats[1])) {
				full = true
			}
		}
		var tr = $("<tr style='" + ((full) ? 'color: red' : '') + "' id='" + sect.callnr + "' data-name='" + crs.course + "' data-title='" + (sect.alt_title || crs.title) + "'>");
		tr.append("<td class='sec-input'><input id='" + name + "_" + sect.section + "' type='radio' name='" + sect.course + "' value='" + sect.callnr + "'/>" + "</td>");
		//var del = $("<input type='checkbox' name='del_" + crs.course + "' value='" + sect.callnr + "'>");
		//td.hide();
		//tr.append(td.append(del));
		$.each("section slots instructor comments seats".split(" "), function(i, name) {
			var td = $("<td class='sec-" + name + "'>");
			if (sect[name])
				td.append((formatters[name] && formatters[name](sect[name], td[0], tr[0])) || sect[name]);
			tr.append(td);
		});
		tbl.append(tr);
	}

	//var tbl = $(".sec-table", ret.domNode);
	// mixture of dojo and jquery........ awesome...
	$(tbl).bind("selectRow", function(ev, i) {
		$(this.rows).filter(".selected").removeClass("selected");
		$(this.rows[i]).addClass("selected").find(".sec-input input").click();
	});
	tbl[0].listAll = function() {
		var res = [];
		$(".sec-table").each(function(i, tbl) {
			var rows = $(tbl.rows).not(".exclude");
			if (rows.is(".locked"))
				rows = rows.filter(".locked");
			else if (rows.is(":has(input:checked)"))
				rows = rows.has("input:checked");

			var name = tbl.id.replace("tbl_", "");
			var items = [];
			rows.each(function(i, tr) {
				var slots = converters.slots($(tr).children(".sec-slots")[0]);
				//if (!slots || slots.length == 0) return;
				items.push({
					name: name,
					index: tr.rowIndex,
					slots: slots,
					type: "timeEvent"
				});
			});
			if (items.length > 0)
				res.push(items);
		});
		return res;
	};
	return tbl[0];
}

/*
 * define schedule operations (insert, remove, select)-course
 * 
 * these functions trigger the respective operations.. if no callback returns
 * false, the change event is triggered.
 */
$.extend(scheduleEvents, {
	_onInsertCourse: function(data) {
		var tbl = formatCourse(data);
		if (this.trigger("insert.course", [data, tbl]) !== false)
			this.trigger("change.course", [tbl.id.replace("tbl_", "")]);
	},
	_onRemoveCourse: function(name) {
		if (this.trigger("remove.course", [name]) !== false)
			this.trigger("change.course", [name]);
	},
	_onSelectSection: function(name, idx) {
		var selRow = $("#" + name + " .sec-table tr").filter(":has(input:checked)")[0];
		var changed = !selRow || selRow.rowIndex != idx;
		if (this.trigger("select.section", [name, idx]) === false)
			return false;
		if (changed) {
			this.trigger("change.section", [name, idx]);
			changeCount++;
		}
	}
});

var ScheduleWrapper = (function() {
})();

var ScheduleManager = (function() {
	var schedules = [];
	
	return {
		getSchedules: function() {
			return schedules;
		},
		getSchedule: function(indexOrName) {
		}
	};
})();

var scheduleController = {
	courseAvailable: function(data) {
		var tbl = formatCourse(data);

		var res = new dijit.layout.ContentPane({
			id: data.course,
			//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//			title: "<span class='course-name'>" + data.course + "</span> " +
			title: "<span class='course-name'>" + getSub(data.course) + "</span> " +
				   "(<span class='course-credits'>" + data.credits.toFixed(2) + "</span>)<br/>" +
				   "<span class='course-title'>" + data.title + "</span>",
			content: tbl,
			iconClass: "course-color-" + ($("#course_list").children().length + 1) + " ",
			closable: true
		});
		var cont = dijit.byId("course_list");
		cont.addChild(res, 0);
		cont.selectChild(res);
		var sel = Schedules.getSelected(data.course);
		for (var i = 0; i < data.sections.length; i++) {
			var sec = data.sections[i];
			if (sec.callnr === sel) {
				$(".sec-input input", tbl.rows[i]).focus().click();
			}
		}

		$("#scheduleSummary").append(
				$("<li id='info_" + data.course + "'>" +
				  "<span class='section-id' style='float:right'></span>" +
				  "<strong>" + data.course + "</strong>" +
				  "</li>"));
		$("#totalCredits")[0].innerHTML = (parseFloat($("#totalCredits").text()) + data.credits).toFixed(2);
	},
	
	sectionChanged: function(course, tbl, newIdx) {
		$("#scheduleSummary").find("li#info_" + course + " span")[0].innerHTML = newIdx == -1 ? "" : tbl.rows[newIdx].id;
	},
	
	clearSchedule: function() {
		var self = this;
		$("#course_list").find("input:checked").each(function() {
			Schedules.clearSelected(this.name);
			$("#scheduleView").schedule().remove(this.name);
			this.checked = false;
		});
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//		$("#scheduleSummary").find(".section-id").each(function() {
//			this.innerHTML = "";
//		});
		$('#scheduleSummary > li').remove()
		$('#totalCredits').html('0.00')
		changeCount = 0;
	}
};

var CourseObject = {
	getSection: function(index) {
		return extractSectionInfo($(this).find(".sec-table")[0].rows[index]);
	},
	getSectionId: function(index) {
		return $(this).find(".sec-table")[0].rows[index].id;
	},
	selectSection: function(id) {
		$("[name=\"" + this.id + "\"][value=\"" + id + "\"]").click();
	},
	setSelection: function(index) {
		$("[name=\"" + this.id + "\"]:eq(" + index + ")").click();
		//$(document.forms.searchForm[this.id]).eq(index).click();
	},
	clearSelection: function() {
		var sel = $("[name=\"" + this.id + "\"]:checked");
		sel.prop("checked", false);
		return sel.val();
	},
	getField: function(name) {
		return $(this).find(".sec-table").data(name);
	},
	listFree: function() {
		var rows = $($(this).find(".sec-table")[0].rows).not(".exclude");
		if (rows.is(".locked"))
			rows = rows.filter(".locked");
		else if (rows.is(":has(input:checked)"))
			rows = rows.has("input:checked");

		var name = this.id;
		var items = [];
		rows.each(function(i, tr) {
			var slots = converters.slots($(tr).children(".sec-slots")[0]);
			//if (!slots || slots.length == 0) return;
			items.push({
				name: name,
				index: tr.rowIndex,
				slots: slots,
				type: "timeEvent"
			});
		});
		return items;
	}
};

// bind the schedule ops behavior
scheduleEvents
	.bind("insert.course", function(ev, data, tbl) {
//		alert('act: insert: ' + data.course)
		var tblcont = $("<div class='sec-table-container'>");
		tblcont.append(tbl);
		
		var cont = dijit.byId("course_list");
		// XXX: Accordion Container here
		var res = new dijit.layout.ContentPane({
			id: data.course,
			//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//			title: "<span class='course-name'>" + data.course + "</span> " +
			title: "<span class='course-name'>" + getSub(data.course) + "</span> " +
				   "(<span class='course-credits'>" + data.credits.toFixed(2) + "</span>)" +
					//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//				   "<a class='close'>close</a><br/>" +
				   "<a class='close'>Remove</a><br/>" +
				   "<span class='course-title'>" + data.title + "</span>",
			content: tblcont[0],
			iconClass: "course-color-" + (cont.getChildren().length + 1) + " ",
			closable: true
		});
		cont.addChild(res, 0);
		cont.selectChild(res);
		$.extend(res.domNode, CourseObject);

		var sel = Schedules.getSelected(data.course);
		if (sel) {
			res.domNode.selectSection(sel);
		}

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//		for (var i in data) {
//			alert(i + ':' + data[i])
//		}

		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		/*$("#scheduleSummary").append(
				$("<li id='info_" + data.course + "'>" +
				  "<span class='section-id' style='float:right'></span>" +
				//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//				  "<strong>" + data.course + "</strong>" +
				  "<strong>(" + data.credits + ") " + getSub(data.course) + "</strong>" +
				  "</li>"));
		$("#totalCredits")[0].innerHTML = (parseFloat($("#totalCredits").text()) + data.credits).toFixed(2);*/
	})
	.bind("remove.course", function(ev, name) {
//		alert('act: remove: ' + name)
		if ($("#scheduleSummary").find("#info_" + name).length) {
//			alert('sched: remove: ' + name)
			$("#scheduleSummary").find("#info_" + name).remove();
			$("#totalCredits")[0].innerHTML = (parseFloat($("#totalCredits").text()) - parseFloat($("#" + name)[0].getField("credits"))).toFixed(2);
		}
		Schedules.remove(name);
	})
	.bind("change.section", function(ev, name, newIdx) {
//		alert('act: change: ' + name)
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if (newIdx != -1) {
//			alert('sched: change: ' + name)
			$("#scheduleSummary").find("li#info_" + name + " span")[0].innerHTML = $("#" + name)[0].getSectionId(newIdx);
			return;
		}
		if ($("#scheduleSummary").find("#info_" + name).length) {
//			alert('sched: remove: ' + name)
			$("#scheduleSummary").find("#info_" + name).remove();
			$("#totalCredits")[0].innerHTML = (parseFloat($("#totalCredits").text()) - parseFloat($("#" + name)[0].getField("credits"))).toFixed(2);
		}
		
//		$("#scheduleSummary").find("li#info_" + name + " span")[0].innerHTML = newIdx == -1 ? "" : $("#" + name)[0].getSectionId(newIdx);
	})
	.bind("select.section", function(ev, name, newIdx) {
//		alert('act: select: ' + name)
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if ($("#scheduleSummary").find("#info_" + name).length) {
//			alert('sched: remove: ' + name)
			$("#scheduleSummary").find("#info_" + name).remove();
			$("#totalCredits")[0].innerHTML = (parseFloat($("#totalCredits").text()) - parseFloat($("#" + name)[0].getField("credits"))).toFixed(2);
		}
		if (newIdx == -1) return
//		alert('sched: add: ' + name)
		$("#scheduleSummary").append(
				$("<li id='info_" + name + "'>" +
				  "<span class='section-id' style='float:right'></span>" +
				//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//				  "<strong>" + name + "</strong>" +
				  "<strong>(" + $("#" + name)[0].getField("credits") + ") " + getSub(name) + "-" + $("#" + name)[0].getSection(newIdx).section + "</strong>" +
				  "</li>"));
		$("#totalCredits")[0].innerHTML = (parseFloat($("#totalCredits").text()) + parseFloat($("#" + name)[0].getField("credits"))).toFixed(2);

		var secId = $("#" + name)[0].getSectionId(newIdx);
		Schedules.setSelected(name, secId);
		$("#scheduleSummary").find("li#info_" + name + " span")[0].innerHTML = $("#" + name)[0].getSectionId(newIdx);
	});


/**
 * serializes the set of slots to be included as a url parameter.
 * 
 * output format (NO SUNDAY):
 *   [day2];...;[day7]/[seq2];...;[seq7]
 * 
 * dayX consists of up to N time slots
 * each slot is a 8 character hex string
 *   first 4 characters is the start time in minutes
 *   last 4 characters is the end time in minutes
 * seqX defines the identifier associated with each slot
 * 
 * ex:
 *   MW 8:00am-8:50am
 *   M 9:00am-9:50am
 * 
 *   8:00am = 0800 -> 8 * 60 = 480 = 0x1e0
 *   8:50am = 0850 -> 8 * 60 + 50 = 530 = 0x212
 *   9:00am = 0900 -> 9 * 60 = 540 = 0x21c
 *   9:50am = 0950 -> 9 * 60 + 50 = 590 = 0x24e
 * 
 *   URL = 01e00212,021c024e;;01e00212;;;/0,0;;0;;;
 * 
 * @param s
 * @return {string} encoded slots
 */
function serializeSlots(s) {
	var days = [[], [], [], [], [], []], ids = [[], [], [], [], [], []];
	$.each(s, function(k) {
		$.each(this.slots, function(i, t) {
			var start  = t.start / (1000 * 60), end = t.end / (1000 * 60);
			days[t.day - 2].push(_sprintf("%04X%04X", start, end));
			ids[t.day - 2].push(k);
		});
	});
	return days.join(";") + "/" + ids.join(";");
}

function selectSchedule(cfg, panel) {
	$.each(cfg, function(i, c) {
		var elems = $("[name=\"" + c.name + "\"]");
		if (c.index == -1) {
			var sel = $("#" + c.name)[0].clearSelection();
			if (sel) {
				Schedules.clearSelected(c.name);
				grid.remove(c.name);
				scheduleEvents.trigger("change.section", [c.name, -1]);
			}
			return;
		}
		$("#" + c.name)[0].setSelection(c.index);
	});
}

function enable(el) { return el.removeClass("ui-state-disabled"); }
function disable(el) { return el.addClass("ui-state-disabled"); }
function is_disabled(el) { return el.hasClass("ui-state-disabled"); }

function ImagePanel(target) {
	target = $(target);
	
	function update(data) {
		this.nav.curr[0].innerHTML = this.viewState.page + " / " + this.viewState.limit;
		this.viewState.page = page;
		var cont = this.container;
		var src = this._srcPrefix;
		$.each(data, function(i, cfg) {
			cont[i].firstChild.src = src + serializeSlots(cfg);
		});
	}
	function onPrev(e) {
		if (e.button != 0) return;
		var recordStart = this.viewState.perPage * this.viewState.page;
		var self = this;
		this.store.getData(recordStart, this.viewState.perPage, function(data) {
			if (is_disabled(self.nav.b.next))
				return false;
			if (is_disabled(self.nav.b.prev))
				enable(self.nav.b.prev);
			self.viewState.page--;
			update.call(self, data);
			if (self.viewState.page == self.viewState.limit) {
				disable(self.nav.b.next);
			}
		});
		return false;
	}
	function onNext(e) {
		if (e.button != 0) return;
		var recordStart = this.viewState.perPage * this.viewState.page;
		var self = this;
		this.store.getData(recordStart, this.viewState.perPage, function(data) {
			if (is_disabled(self.nav.b.next))
				return false;
			if (is_disabled(self.nav.b.prev))
				enable(self.nav.b.prev);
			self.viewState.page++;
			update.call(self, data);
			if (self.viewState.page == self.viewState.limit) {
				disable(self.nav.b.next);
			}
		});
		return false;
	}
	function init(t) {
		var container = $("<div class='thumbs-container'>");
		var nav = $("<div class='thumbs-nav'>");
		var carousel = $("<div class='thumbs-carousel'></div>");
		
		var navtbl = $("<table>" +
			"<tr><td><span class='ui-icon ui-icon-triangle-1-w'></span></td>" +
			"<td style='width:78px;'></td>" +
			"<td><span class='ui-icon ui-icon-triangle-1-e'></span></td></tr></table>");

		nav.append(navtbl);
		container.append(nav).append(carousel);
		
		this.target = t;
		this.thumbs = container;
		this.carousel = carousel;
		this.nav = nav;
		this.container = [];
		
		this.nav.b = {};
		this.nav.b.prev = $(navtbl.cells[0]);
		this.nav.b.curr = $(navtbl.cells[1]);
		this.nav.b.next = $(navtbl.cells[2]);
		
		this.nav.b.prev.click($.proxy(onPrev, this));
		this.nav.b.next.click($.proxy(onNext, this));
	}
	init.call(this, target);

	var self = this;
	function keydown(e) {
		if (e.keyCode == 27) {
			var me = arguments.callee;
			self.thumbs.slideUp("fast");
		}
	}
	function mousedown(e) {
		if (e.button != 0)
			return;
		if (!$.contains(self.thumbs, e.target)) {
			var me = arguments.callee;
			setTimeout(function() {
				self.thumbs.slideUp("fast");
			}, 150);
		}
	}
	$(document).bind("keydown", keydown);
	$(window).bind("click", mousedown);
}
ImagePanel.prototype = {
	_onImageClicked: function(e) {
		var offset = this.viewState.page * this.viewState.perPage;
		var target = $(e.target);
		$(this).trigger("imgselect", [offset+target.$.inArray(target, parent().children())]);
	},
	initView: function(rs, imgSize, width) {
		var cnt = Math.floor(width / (imgSize + 8));
		var resultCount = rs.count;
		var pages = Math.ceil(resultCount / cnt);
		
		this._srcPrefix = "genthumb.php?img=png&h="+imgSize+"&w="+imgSize+"&data=";
		this.thumbs.width(width);
		this.viewState = {
			page: 1,
			limit: pages,
			perPage: cnt
		};
		enable(this.nav.prev);
		if (cnt < 2)
			disable(this.nav.next);
		else
			enable(this.nav.next);
		
		var self = this;
		this.carousel.empty();
		for (var i = 0; i < cnt; i++) {
			var imgcont = $("<div class='image-container'></div>");
			var img = new Image(imgSize, imgSize);
			imgcont.width(imgSize).height(imgSize);
			imgcont.append(img);
			
			this.carousel.append(imgcont);
			imgcont.click($.proxy(this._onImageClicked,this));
		}
	},
	showView: function() {
		var nav = this.nav;
		var thumbs = this.thumbs;
		this.thumbs.slideDown("fast", function() {
			nav.css("left", thumbs.offset().left + thumbs.width()/2 - nav.width()/2);
			nav.css("top", thumbs.position().top - nav.outerHeight());
		});
	}
};

var _scrollHandler;

/**
 * Event handler for mouse wheel event.
 */
function wheel(event) {
	var delta = 0;
	if (!event) /* For IE. */
		event = window.event;
	if (event.wheelDelta) { /* IE/Opera. */
		delta = event.wheelDelta / 120;
		/**
		 * In Opera 9, delta differs in sign as compared to IE.
		 */
		if (window.opera)
			delta = -delta;
	} else if (event.detail) {/** Mozilla case. */
		/**
		 * In Mozilla, sign of delta is different than in IE. Also, delta is
		 * multiple of 3.
		 */
		delta = -event.detail / 3;
	}
	
	/**
	 * If delta is nonzero, handle it. Basically, delta is now positive if wheel
	 * was scrolled up, and negative, if wheel was scrolled down.
	 */
	if (delta && _scrollHandler) {
		if (_scrollHandler(delta) === false) {
			event.returnValue = false;
			if (event.preventDefault)
				event.preventDefault();
		}
	}
}

/**
 * Initialization code. If you use your own event management code, change it as
 * required.
 */
(function(evtName) {
	$(window).on(evtName, wheel);
})($.browser.mozilla && "DOMMouseScroll" || "mousewheel");
if ($.browser.mozilla) {
	/** DOMMouseScroll is for mozilla. */
	$(window).on("DOMMouseScroll", wheel);
} else {
	/** IE/Opera. */
	$(window).on("mousewheel", wheel);
}

/**
 * Show a set of schedule thumbnails
 * 
 * @param res
 */
// XXX this really need to be reworked... for now, avoid passing any references
function showImagePanel(V, C) {
	// create distincitve pixels for 10-min intervals... renders from 8:00am-10:00pm
	// each hour has 6 pixels, and there are 14 groups
	var imgSize = 84;
	if ($(".thumbs-container").length)
		return;
	var view = $("#scheduleResultView");
		var thumbs = $("<div class='thumbs-container'>");
		var nav = $("<div class='thumbs-nav'>");
		var dst = $("<div class='thumbs-carousel'></div>");
		
		var navtbl = $("<table>" +
			"<tr><td><span class='ui-icon ui-icon-triangle-1-w'></span></td>" +
			"<td style='width:78px;'></td>" +
			"<td><span class='ui-icon ui-icon-triangle-1-e'></span></td></tr></table>");

		nav.append(navtbl);
		thumbs.append(nav).append(dst);
	
	var cnt = Math.floor($("#scheduleView .sv-grid").width() / (imgSize + 12));
	var pgCount = Math.ceil(C.length / cnt);
	$(navtbl[0].rows[0].cells[1]).bind("mouseenter", function() {
		var self = this;
		console.info(self);
		_scrollHandler = function(delta) {
			if (delta < 0) {
				$(self).prev().click();
			} else {
				$(self).next().click();
			}
			return false;
		};
	}).bind("mouseleave", function() {	
		_scrollHandler = null;
	});
	
	thumbs.width($("#scheduleView .sv-grid").width());
	//thumbs.css("margin-left", $("#scheduleView").width() - $("#scheduleView .sv-grid").width());

	var prev = $(navtbl[0].rows[0].cells[0]);
	var curr = $(navtbl[0].rows[0].cells[1]);
	var next = $(navtbl[0].rows[0].cells[2]);
	
	curr.attr("title", "Found " + C.length + " results");
	curr[0].page = 1;
	curr[0].limit = pgCount;
	curr[0].perPage = cnt;

	enable(prev);
	if (cnt < 2) {
		disable(next);
	} else {
		enable(next);
	}
	
	function selectPage(pg) {
		curr[0].page = pg;
		curr[0].innerHTML = curr[0].page + " / " + curr[0].limit;
		dst.empty();
		$.each(C.slice(cnt * (pg - 1), cnt * pg), function(p) {
			var cfg = $.map(this, function(elem) { return V[elem]; });
			var img = new Image(imgSize, imgSize);
			img.src = "genthumb.php?img=png&N=" + (cfg.length - 1) + "&h="+imgSize+"&w="+imgSize+"&data=" + serializeSlots(cfg);
			var imgcont = $("<div class='image-container' data-index='" + p + "'></div>");
			imgcont.width(imgSize).height(imgSize);
			imgcont.click(function() {
				selectSchedule(cfg);
			});
			//if (p && !(p % 5)) imgcont.css("clear", "both");
			imgcont.append(img);
			dst.append(imgcont);
		});
	}

		// first time, set event handlers
		prev.bind("click", function(e) {
			if (e.button) return;
			if (is_disabled(prev))
				return false;
			if (is_disabled(next))
				enable(next);
			selectPage(--curr[0].page);
			if (curr[0].page == 1) {
				disable(prev);
			}
			return false;
		});
		next.bind("click", function(e) {
			if (e.button) return;
			if (is_disabled(next))
				return false;
			if (is_disabled(prev))
				enable(prev);
			selectPage(++curr[0].page);
			if (curr[0].page == curr[0].limit) {
				disable(next);
			}
			return false;
		});

		function keydown(e) {
			if (e.keyCode == 27) {
				var me = arguments.callee;
				view.slideUp("fast", function() {
					$("#progress")[0].innerHTML = "";
					thumbs.remove();
					$(document).unbind("keydown", me);
					$(window).unbind("mousedown", me);
				});
			}
		}
		function mousedown(e) {
			if (e.button != 0)
				return;
			if (!$.contains(thumbs[0], e.target)) {
				var me = arguments.callee;
				setTimeout(function() {
					view.slideUp("fast", function() {
						$("#progress")[0].innerHTML = "";
						thumbs.remove();
						$(document).unbind("keydown", me);
						$(window).unbind("mousedown", me);
					});
				}, 150);
			}
		}
		$(document).bind("keydown", keydown);
		$(window).bind("mousedown", mousedown);
	
	// speed up animation by "fixing" the height to its current value
	selectPage(1);
	
	view.append(thumbs);
	view.height(view.height());
	view.slideDown("fast", function() {
		nav.css("left", thumbs.offset().left + thumbs.width()/2 - nav.width()/2);
		nav.css("top", thumbs.position().top - nav.outerHeight());
	});
}

function showGraph(V, E) {
	var wnd = $("#searchTree");
	var S = 520;
	var rG;
	if (wnd.data("rG"))
		rG = wnd.data("rG");
	else {
		rG = Raphael(wnd.find(".cm")[0], S, S);
		wnd.data("rG", rG);
	}
	wnd.data("V", V).data("E",E);
	wnd.overlay({
		mask: {
			loadSpeed: 0,
			color: "#bbb",
			opacity: 0.2
		},
		top: 8,
		closeOnClick:true,
		opacity: 1,
		onBeforeClose: function() {
			wnd.data("rG").clear();
		},
		onLoad: function() {
			if (Raphael.type == "SVG")
				$.each({"color-interpolation":"linearRGB","stroke-width":1,"shape-rendering":"geometricPrecision"}, $.proxy(rG.canvas, "setAttribute"));
			
			var V = wnd.data("V"), E = wnd.data("E");
			wnd.removeData("V");
			wnd.removeData("E");
			
			var r1 = S*.45;
			var r2 = S*.02;
			
			var XYPoint = function(x,y) {
				this.x = x;
				this.y = y;
			};
			XYPoint.prototype = {
				toString: function() { return this.x + "," + this.y; },
				add: function(x,y) { return new XYPoint(this.x + x, this.y + y); },
				sub: function(x,y) { return this.add(-x, -y); }
			};
			XYPoint.prototype.toString = function() {
				return this.x + "," + this.y;
			};
			
			var coords = new Array(V.length);
			var colors = new Array(V.length);
			for (var i = 0; i < V.length; i++) {
				var ang = 2*Math.PI * i / V.length;
				var x = -r1 * Math.sin(ang);
				var y = r1 * Math.cos(ang);
				coords[i] = new XYPoint(x+S/2,y+S/2);
				var chd = dijit.byId(V[i].name);
				var bgclr = $("." + chd.iconClass).css("background-color");
				var rgb = /.*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*/.exec(bgclr);
				if (rgb) {
					bgclr = (parseInt(rgb[1]) << 16) | (parseInt(rgb[2]) << 8) | parseInt(rgb[3]);
					bgclr = "000000" + bgclr.toString(16);
					bgclr = bgclr.substr(bgclr.length - 6);
				}
				colors[i] = "#" + bgclr;
			}
			function $test(Ei, v) {
				return (Ei[v >>> 5] & (1 << (v & 31))) != 0;
			}
			function $or(Ei, Ej) {
				var r = Ei.slice(0);
				r[0] |= Ej[0];
				r[1] |= Ej[1];
				return r;
			}
			function $and(Ei, Ej) {
				var r = Ei.slice(0);
				r[0] &= Ej[0];
				r[1] &= Ej[1];
				return r;
			}
			function $zeroes() {
				return [0,0];
			}
			function $set(E, u) {
				E[u >>> 5] |= 1 << (u & 31);
				return E;
			}
			function $clr(E, u) {
				E[u >>> 5] &= ~(1 << (u & 31));
				return E;
			}
			var objs = [];
			var shapes = [];
			var oldcnv = rG.canvas;
			var defaultLineAttr = {"stroke-opacity":0.38,"stroke-linecap":"round","stroke":"#fff"};
			if (Raphael.type == "SVG") {
				var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
				$.each({width:"100%",height:"100%",x:0,y:0}, $.proxy(g, "setAttribute"));
				rG.canvas.appendChild(g);
				rG.canvas = g;
			}
			var shapeCnv = rG.canvas;
			var selected = -1;
			var selShape = null;
			var curr;
			var conf;
			for (var i = 0; i < V.length; i++) {
				var c = rG.circle(0,0,r2).translate(coords[i].x, coords[i].y);
				shapes.push(c);
				//rG.text(coords[i].x,coords[i].y,ecnt[i]+"").attr("stroke","#333");
				c.attr({fill: colors[i],opacity:0.8});
				(function(c, i) {
					c.node.onclick = function(e) {
						if(selected!=-1) {
							$.each(objs[selected], function(x,v) {
								if(!v)return;
								v.attr(defaultLineAttr);
								shapes[selected==v.e.s?v.e.t:v.e.s].attr("opacity",0.8);
							});
							selShape.attr("opacity",0.8);
							selShape = null;
						}
						if (selected == i) {
							selected = -1;
							return;
						}
						$.each(objs[i], function(x, v) {
							if (!v) return;
							v.attr({"stroke-width":3,"stroke-opacity":.8,"stroke":colors[i==v.e.s?v.e.t:v.e.s]});
							shapes[selected==v.e.s?v.e.t:v.e.s].attr("opacity",.95);
						});
						selShape = c;
						c.attr("opacity", 1);
						selected=i;
					};
				}(c, i));
				c.show();
			}
			
			var lineCnv = oldcnv;
			if (Raphael.type == "SVG") {
				var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
				$.each({width:"100%",height:"100%",x:0,y:0,"color-interpolation":"linearRGB","stroke-width":1,"shape-rendering":"geometricPrecision"}, $.proxy(g, "setAttribute"));
				oldcnv.insertBefore(g, oldcnv.firstChild);
				rG.canvas = g;
			}
			
			var edges = [];
			for (var i = 0; i < E.length - 1; i++) {
				for (var j = i+1; j < E.length; j++) {
					if ($test(E[i], j)) {
						if (!objs[i])
							objs[i] = [];
						if (!objs[j])
							objs[j] = [];
						var p = rG.path("M" + coords[i] + " L" + coords[j]);
						p.hide();
						p.e = {s:i,t:j};
						edges.push(p);
						objs[i][j]=p;
						objs[j][i]=p;
					}
				}
			}
			defaultLineAttr["stroke-width"] = 1+(Math.PI*r1-r2*V.length)/r1*(0.5-(edges.length/(V.length*V.length)));
			for (var i = 0; i < edges.length; i++) {
				edges[i].attr(defaultLineAttr).show();
			}
			edges = null;
			if (Raphael.type == "SVG")
				rG.canvas = oldcnv;
		},
		api:true
	}).load();
}

// event handler support for finding schedules
var finderEvents = $({});

//var Preferences = [];

var CourseList = {
	listAll: function() {
		var res = [];
		$(this).find(".sec-table-container").parent().each(function(k, v) {
			res.push(v.listFree());
		});
		return res;
	}
};

(function(undefined) {
	var worker = null;

	var scores = [];
	function constant(a) { return a; }
	function exp(e) { return function(a) { return Math.pow(e, a); }; }

	function Scorer(V, C, prefs) {
		var smt;
		var maxsep = 0;
		var lp = V.length/12;
		var tp = V.length/24;
		if (prefs.morning) {
			smt = [0.1,1,4];
		} else if (prefs.afternoon) {
			smt = [4,.1,4];
		} else if (prefs.night) {
			smt = [4,1.5,.1];
		} else {
			smt = [1,1,1];
		}
		if (prefs.spread)
			smt.push(C[0].length);
		else
			smt.push(C[0].length*2);
		
		for (var i = 0; i < C.length; i++) {
			var tmp = C[i];
			C[i] = [Score_Clustering(V, C[i], smt), tmp];
		}
		return C;
	}

	function Score_Clustering(V, cfg,prefs) {
		var early = 0;
		var middle = 0;
		var late = 0;
		var online = 0;
		
		var T_NOON = 12 * 60 * 60 * 1000;
		var T_EVEN = 16 * 60 * 60 * 1000;
		var theDays = {};
		var dcnt = 0;
		function scoreFn(s,lower,upper) {
			return (Math.min(s.end,upper) - Math.max(s.start,lower)) / (60 * 60 * 1000);
		}
		var order = [];
		for (var i = 0; i < cfg.length; i++) {
			var c = V[cfg[i]];
			if (!c.slots) {
				online++;
				continue;
			}
			for (var j = 0; j < c.slots.length; j++) {
				var s = c.slots[j];
				if (!(s.day in theDays)) {
					theDays[s.day] = true;
					order[s.day] = [];
					dcnt++;
				}
				order[s.day].push([s.start, s.end]);
				if (s.end < T_NOON)
					early += scoreFn(s, 0, T_NOON);
				else if (s.end < T_EVEN)
					middle += scoreFn(s, T_NOON, T_EVEN);
				else
					late += scoreFn(s, T_EVEN, 24 *60*60*1000);
			}
		}
		for (var i = 0; i < order.length; i++) {
			if (!(i in order)) {
				continue;
			}
			order[i].sort(function(a, b) {
				return a[0] - b[0];
			});
		}
		return Math.sqrt(Math.pow(prefs[0],early) *Math.pow(prefs[1],middle) *Math.pow(prefs[2],late) * Math.pow(10,online)* Math.pow(dcnt/7, prefs[3]));
	}
	
	// maps the configuration defined in c to an existing section
	// V is an array of name/index objects
	function mapResult(V, c) {
		var r = [];
		for (var i = 0; i < c.length; i++) {
			var x = V[c[i]];
			r.push($("#" + x.name)[0].getSection(x.index));
			//r.push(extractSectionInfo($("#" + x.name + " .sec-table")[0].rows[x.index]));
		}
		return r;
	}

	var interval = false;
	var xchg;
	function _startWorker(op) {
		var grid = $("#scheduleView").schedule();
		if (grid.hasConflicts()) {
			showMessage("error", "Resolve the scheduling conflicts");
			return;
		}
		t0 = new Date().getTime();
		var args = $("#course_list")[0].listAll();
		var ccnt = 0;
		for (var i = 0; i < args.length; i++)
			ccnt += args[i].length;
		if (ccnt == args.length) {
			var allsel = true;
			for (var i = 0; i < args.length; i++) {
				if (!$("#tbl_" + args[i][0].name).is(":has(input:checked)")) {
					allsel = false;
					$($("#tbl_" + args[i][0].name)[0].rows[args[i][0].index]).trigger("selectRow", [args[i][0].index]);
				}
			}
			if (allsel)
				showMessage("info",
					"All courses have been scheduled.<br/><br/>To find alternate schedules, " +
					"clear one of the courses (hover over the course and click the X)");
		}
		if (!worker) {
			worker = new Worker("js/generator.js");
			
			xchg = new EMessageExchange(worker);
			xchg.bind("console", console);
		}
		var redux = xchg.connect("redux", {init:{returns:true}});
//				alert(redux)
		redux.init(args)
			.done(function(p) {
//				alert(op)
				if (op === "graph") {
					showGraph(p[0], p[1]);
					return;
				}
				var s = xchg.connect("solver", {all:{returns:true}, first:{returns:true}, setsplice:{}});
				var configs = [];
				s.setsplice(true); // receive the result in chunks instead of all at once
				xchg.subscribe("solver.progress", function(data) {
					var count = data[0];
					if (data.length > 1) {
						configs.push(data[1]);
					}
					finderEvents.trigger("progress", [count]);
				});

				finderEvents.trigger("start");
				s[op]().done(function(C) {
					configs.push(C);
					var total = 0;
					for (var i = 0; i < configs.length; i++) {
						total += configs[i].length;
					}
					C = [];
					while (configs.length)
						C.push.apply(C, configs.shift());
					setTimeout(function() {
						finderEvents.trigger("complete", [{V:p[0],C:C,k:p[2]}]);
					}, 200);
				}).fail(function(error) {
					console.error(error);
				});
			})
			.fail(function(error) {
//				alert('ee')
				console.error(error);
			});
		//worker.postMessage($.extend(true, {op: (op || "first"), args: getCourses(), delay: 120}, data || {}));
		
		//var res = generateSchedules({op: (op || "first"), args: getCourses()});
		//msghandler({data:{payload:res}});
	};

	_loadAltSchedule = function(course) {
		var rows = $(".sec-table[course!=" + course + "] tr:has(input:checked):not(.locked)");
		rows.addClass("locked");
		_startWorker("all");
		rows.removeClass("locked");
	};

	_loadFirstSchedule = function() {
		_startWorker("first");
	};
	_loadAllSchedules = function(szmode) {
		if (szmode && interval !== false) {
			clearInterval(interval);
			interval = false;
			return;
		}
		_startWorker("all");
	};
	_loadSchedulesGraph = function() {
		_startWorker("graph");
	};

	var t0;
	finderEvents
		.bind("start", function(evt) {
			t0 = evt.timeStamp;
		})
		.bind("progress", function(evt, count) {
			$("#progress")[0].innerHTML = "Found " + count;
		})
		.bind("complete", function(evt, res) {
			finderEvents._config = null;
			var tf = new Date().getTime();
			//console.info(event.data);
			var time = ((evt.timeStamp - t0) * 1.0e-3).toFixed(3) + " s";
			console.log(time);
			if (res.C.length === 0) {
				showMessage("Info", "no valid combinations could be found");
				//console.info(mapResult(res.V, res.X));
			} else if (res.C.length == 1) {
				for (var ii = 0; ii < res.C[0].length; ii++)
					res.C[0][ii] = res.V[res.C[0][ii]];
				selectSchedule(res.C[0]);
			} else {
				//console.info(res.C.slice(0, 10));
				showImagePanel(res.V.slice(0), res.C.slice(0));
			}
		});
})();

scheduleEvents.one("loadComplete", function() {
	setTimeout(function() {
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		$("#loadingBox").remove();
		$('#load').fadeOut(300)
		$('#fade').fadeOut(300)
	}, 500);
});

function updateTooltip(tt, crs) {
	tt.toggleClass("cancelled-course", crs.cancelled).toggleClass("honors-course", crs.honors);
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//	for (var i in crs) {
//		alert(i + ':' + crs[i])
//	}

	tt.children(".tt-title").first().html(crs.title);
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//	var props = ["callnr", "section", "instructor", "comments", "seats"];
	var props = ["callnr", "course", "section", "instructor", "comments", "seats"];
	var items = tt.children(".tt-items");
	for (var i = 0; i < props.length; i++) {
		var p = props[i];
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//		alert(crs[p])
//		items.find(".tt-" + p + " > .hdr ~ *").html(crs[p]);
		items.find(".tt-" + p + " > .hdr ~ *").html((crs[p]) ? ((p == 'course') ? getSub(crs[p]) : crs[p]) : '');
	}
	var seats = crs.seats.split(/\s*\/\s*/);
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//	if (seats[0] >= seats[1]) {
	if (parseInt(seats[0]) >= parseInt(seats[1])) {
		items.find(".tt-seats > .hdr").next().html("<span style='color:#f33;font-weight:bold;'>" + crs.seats + "</span>");
	}
//	$.ajax({
//		type: "get",
//		url: "data/description.php?course=" + crs.course,
//		success: function(result) {
//			tt.children(".tt-description").children(".hdr").next().html(result);
//		}
//	});
	return tt;
}

function showCourseTooltip(tt, tgt, crs) {
//	alert('in' + ': ')
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	$('#info_' + crs.course).css({color: 'blue'})
	
	updateTooltip(tt, crs);
	
	if (tt.is(":visible")) {
		tt.stop();
		tt.animate({top: tgt.offset().top, left: tgt.offset().left + tgt.outerWidth(false), opacity: 1}, 180);
	} else {
		tt.css("top", tgt.offset().top);
		tt.css("left", tgt.offset().left + tgt.outerWidth(false));
		tt.fadeIn("fast");
	}
}

function hideCourseTooltip(tt, delay) {
//	alert('out')
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	$('#scheduleSummary > li').each(function () {
		$(this).css({color: 'black'})
	})
//	$('#info_' + tt.find('.tt-course > span').eq(1).html()).css({color: 'black'})
	
	if (arguments.length == 1)
		delay = 100;
	tt.fadeOut(delay);
}

function showPrintWindow() {
	var g = $("#scheduleView").schedule();
	if (g.hasConflicts()) {
		showMessage("error", "Resolve the scheduling conflicts before attempting to print");
		return;
	}
	var wnd = window.open('print.php','_blank','scrollbars=yes,toolbar=no,location=no,menubar=yes,width=1116,height=844');
	if (!wnd)
		alert("Pop-up was blocked... temporarily allow pop-ups to open the print window");
}

getActiveSchedule = function() {
	var secs = [];
	$(".sec-table tr:has(:checked)").each(function(i, v) {
		var secinfo = extractSectionInfo(v);
		secinfo.bgColor = $(".sv-event[name=\"" + secinfo.course + "\"]").css("background-color");
		secs.push(secinfo);
	});
	return secs;
};


$(document).ready(function() {
	$("#infolink").click(function() {
		var hdr = $("#header");
        $("#infopanel").overlay({
            top: hdr.position().top + hdr.outerHeight(),
            mask: {
                loadSpeed: 0,
                closeSpeed: 0,
                opacity:0
            },
            speed: 0,
            onLoad: function() {
        		$("#infopanel").position({
        			of: "#header",
        			my: "center top",
        			at: "center center",
        			offset: "0 5"
        		});
            },
            closeOnClick:true,
            api:true
        }).load();
		return false;
	});
	$("input[name=search]")
		.focus(function() {
			if ($(this).hasClass("empty")) {
				this.value = "";
				$(this).removeClass("empty");
			}
		})
		.blur(function() {
			if (this.value == "") {
				this.value = "Add course";
				$(this).addClass("empty");
			}
		});
	$("#xheader input").css("margin", 0);
});
$(document).ready(function() {
	var schedacts = $("#schedactions");
	var clearButton = schedacts.find("#clearButton");
	clearButton.button({icons:{primary:"ui-icon-trash"}});
	clearButton.click(function() {
		scheduleController.clearSchedule();
	});
	var printButton = schedacts.find("#printButton");
	printButton.button({icons:{primary:"ui-icon-print"}});
	{
		printButton.click(function() {
			showPrintWindow();
		});
	}
	schedacts.find("button").button();
});

$(document).ready(function() {
	$("#tooltip")
		.data("count", { c: 0 })
		.on({
			mouseenter: function() {
				$(this).stop().css("opacity", 1);
			},
			mouseleave: function() {
				hideCourseTooltip($(this), 250);
			}
		});
	$(window).on("unload", function() {
		$("#tooltip").off("mouseenter mouseleave");
	});
});


function closePane(cont) {
	var child = dijit.byNode(cont[0]);
	var stbl = $(".sec-table", child.domNode);
	var grid = $("#scheduleView").schedule();

	var clist = dijit.byNode($("#course_list")[0]);
	var idx = clist.getIndexOfChild(child);
	scheduleEvents._onRemoveCourse(cont.attr("id").replace("tbl_", ""));
	
	clist.removeChild(clist.getChildren()[idx]);
	child.destroyRecursive(true);
	grid.remove(cont.attr("id"));
	var conts = clist.getChildren();
	for (var i = 0; i < conts.length; i++) {
		var off = parseInt(conts[i].iconClass.replace("course-color-", ""));
		conts[i].attr("iconClass", "course-color-" + (conts.length - i));
		$(grid.getEvents(conts[i].id))
			.removeClass("course-color-" + off)
			.addClass("course-color-" + (conts.length - i));
	}
	//stbl.remove();
	stbl.parent().remove();
}



$(document).ready(function() {
	//var grid = new ScheduleGrid("#scheduleView", {cellWidth:110,cellHeight:24,granularity:30});
	$("#scheduleView").schedule();
	
	scheduleEvents.bind("insert.course", function(ev, data, tbl) {
		$(".sec-input input", tbl).click(function(ev) {
			ev = window.event || ev;
			if (ev.ctrlKey) {
				ev.preventDefault();
				return false;
			}
			$(this).focus();
			if ($("#scheduleView").schedule().containsId(this.value)) {
				return;
			}
			var tbl = $(this).parents(".sec-table")[0];
			var idx = $(this).parents("tr")[0].rowIndex;
			//console.info("click", this.value, ev.target.value);
			//scheduleEvents.trigger("change.section", [obj, idx]);
			scheduleEvents._onSelectSection(this.name, idx);
		});
	});
	
	scheduleEvents.bind("select.section", function(ev, crs, idx) {
		var sec = $("#" + crs)[0].getSection(idx);
		//console.info("select", crs.course, sec.section, idx);
//		alert($("#" + crs)[0].getField("credits"))
//		for (var i in sec) {
//			alert(i + ':' + sec[i])
//		}
		var evs = $("#scheduleView").schedule().update({
			id: sec.callnr,
			name: crs,
			title: sec.course + "-" + sec.section,
			type: "course",
			//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			credits: $("#" + crs)[0].getField("credits"),
			prof: sec.instructor,
			content: sec.title,
			cssClass: dijit.byId(crs).attr("iconClass")
		}, sec.slots);

		if (evs.length) {
			$(evs).on({
				mouseenter: function(e) {
					var tgt = $(e.target);
					if (!tgt.hasClass("sv-event"))
						tgt = tgt.parents(".sv-event");
					showCourseTooltip($("#tooltip"), tgt, sec);
				},
				mouseleave: function(e) {
					hideCourseTooltip($("#tooltip"));
				}
			}).find(".sv-closer").on("click", function(e) {
				if (e.button > 0)
					return;
				if ($("#tooltip").is(":visible")) {
					hideCourseTooltip($("#tooltip"), 0);
				}
				var name = $(this.parentNode).attr("name");
//				alert(name)
				Schedules.clearSelected(name);
				$("#" + name)[0].clearSelection();
				$("#scheduleView").schedule().remove(this.parentNode);
				//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Changes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
				scheduleEvents.trigger("change.section", [name, -1]);
//				scheduleEvents.trigger("remove.course", [name]);
			});
		}
	});

	/**
	 * course selection handler
	 */
	function selectCourse(evt, ui) {
//		alert('')
		var p = ui.item.path;
		if ($("#" + ui.item.value).length !== 0) {
			showMessage("Error", "Duplicate course " + ui.item.value, 1);
			return;
		}
		var self = this;
		requestData(p)
			.done(function(data) {
				if (!data.length) {
					console.log("Query time %.3fs", data.t);
					data = data.data;
				}
				if (!data || !data.length)
					return;
				var store = mapData(data);
				scheduleEvents._onInsertCourse(store[0]);
				self.value = "";
				Schedules.add(store[0].course, p);
			});
		return false;
	}

	$("#search_input").autocomplete({
		appendTo: "#input_column",
		delay: 10,
		autoFocus: true,
		position: {my:"right top", at:"right bottom"},
		width: 220,
		source: $.proxy(DataService, "findMatch"),
		select: selectCourse,
		disabled: true
	});
	require(["include/datasvc.php?p=/"], function() {
		$("#search_input").autocomplete("option", "disabled", false);
	});

	$("#search_input").click(function(e) {
		var search = $("#search_input");
		if (search.val() && search.val().length > 0) {
			DataService.findMatch({term: search.value}, function(data) {
				if (data.length > 0)
					selectCourse.call(search[0], e, { item: data[0] });
				search.autocomplete("close");
			});
		}
		e.preventDefault();
		return false;
	});

	// setup dynamic sizing of the page, with a min-width of 640px
	var pg = $("#page");
	var width = Math.max(640, $(window).width());
	pg.width(width - (pg.outerWidth(true) - pg.innerWidth()));
	$(window).bind("resize", function() {
		var pg = $("#page");
		pg.width(Math.max(860, $(window).width()));
		
		var cont = $("#content");
		var width = pg.width() - (cont.outerWidth(true) - cont.width());
		width -= $(".left").outerWidth(true);
		width -= $(".right").outerWidth(true);
		width -= $(".center").outerWidth(true) - $(".center").width();
		$(".center").width(width);
		$("#scheduleView").schedule().invalidate();
	});
	pg.show();
	$(window).trigger("resize");
});

// initialize the tabular course view
dojo.addOnLoad(function() {
	var conf = {
		duration: 0
	};
	if ($.browser/*.msie*/) {
		conf.style = "height:586px;";
	}
	var cont = new dijit.layout.AccordionContainer(conf, $("#course_list")[0].id);
	$.extend($("#course_list")[0], CourseList);
	
	var grid = $("#scheduleView").schedule();
	grid.doLayout();

	cont.startup();

	$(cont.domNode).click(function(ev) {
		if (ev.button !== 0)
			return;
		var t = $(ev.target);
		if (t.is("td,:has(td:parent)")) {
			var tr = t.parents("tr");
			tr.trigger($.Event("selectRow"), [tr.prop("rowIndex")]);
			return false;
		}
		if (t.hasClass("close")) {
			var cont = t.parents(".dijitAccordionTitle").next().children(".dijitContentPane");
			closePane(cont);
			return false;
		}
	});
});

//})();
