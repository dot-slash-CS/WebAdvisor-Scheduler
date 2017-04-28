/*!
 * Schedule builder
 *
 * Copyright (c) 2011, Edwin Choi
 *
 * Licensed under LGPL 3.0
 * http://www.gnu.org/licenses/lgpl-3.0.txt
 */

function Edge() {
}
function Vertex(data) {
	this.adj = [];
}

function Graph(target) {
	this.target = $(target);
}
Graph.prototype = {
	/**
	 * V() -- returns vertices
	 * V(i) -- returns the ith vertex
	 * V([]) -- sets all vertices
	 * V(i, u) -- sets the ith vertex
	 */
	V: function() {
		if (arguments.length == 0)
			return this._V;
		else if (arguments.length == 1) {
			if ($.type(arguments[0]) == "number")
				return this._V[arguments[0]];
			this._V = arguments[0];
		} else {
			this._V[arguments[0]] = arguments[1];
		}
	},
	/**
	 * E() -- gets the adjacency matrix (not for reading!)
	 * E([]) -- sets the adjacnecy matrix
	 * E(i, j) -- tests whether the ith and jth vertices are adjacent
	 */
	E: function() {
		if (arguments.length == 2) {
			var i = arguments[0], j = arguments[1];
			return (this._E[i][j>>>5] & (1<<(j&31))) != 0;
		} else if (arguments.length == 0) {
			return this._E;
		} else if (arguments.length == 1) {
			this._E = arguments[0];
		}
	}
};

function showGraph123(V, E) {
	var wnd = $("#searchTree");
	var S = 520;
	var rG;
	if (wnd.data("rG"))
		rG = wnd.data("rG");
	else {
		rG = Raphael(wnd.find(".cm")[0], S, S);
		wnd.data("rG", rG);
	}
	if (Raphael.type == "SVG")
		$.each({"color-interpolation":"linearRGB","stroke-width":1,"shape-rendering":"geometricPrecision"}, $.proxy(rG.canvas, "setAttribute"));
	
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
	console.info(defaultLineAttr["stroke-width"]);
	for (var i = 0; i < edges.length; i++) {
		edges[i].attr(defaultLineAttr).show();
	}
	edges = null;
	if (Raphael.type == "SVG")
		rG.canvas = oldcnv;
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
