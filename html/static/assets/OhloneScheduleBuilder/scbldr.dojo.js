/*	@preserve
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*	@preserve
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

if (!dojo._hasResource["dijit._Container"]) {
    dojo._hasResource["dijit._Container"] = true;
    dojo.provide("dijit._Container");
    dojo.declare("dijit._Container", null, {
        isContainer: true,
        buildRendering: function() {
            this.inherited(arguments);
            if (!this.containerNode) {
                this.containerNode = this.domNode;
            }
        },
        addChild: function(_1, _2) {
            var _3 = this.containerNode;
            if (_2 && typeof _2 == "number") {
                var _4 = this.getChildren();
                if (_4 && _4.length >= _2) {
                    _3 = _4[_2 - 1].domNode;
                    _2 = "after";
                }
            }
            dojo.place(_1.domNode, _3, _2);
            if (this._started && !_1._started) {
                _1.startup();
            }
        },
        removeChild: function(_5) {
            if (typeof _5 == "number") {
                _5 = this.getChildren()[_5];
            }
            if (_5) {
                var _6 = _5.domNode;
                if (_6 && _6.parentNode) {
                    _6.parentNode.removeChild(_6);
                }
            }
        },
        hasChildren: function() {
            return this.getChildren().length > 0;
        },
        destroyDescendants: function(_7) {
            dojo.forEach(this.getChildren(), function(_8) {
                _8.destroyRecursive(_7);
            });
        },
        _getSiblingOfChild: function(_9, _a) {
            var _b = _9.domNode
              , _c = (_a > 0 ? "nextSibling" : "previousSibling");
            do {
                _b = _b[_c];
            } while (_b && (_b.nodeType != 1 || !dijit.byNode(_b)));return _b && dijit.byNode(_b);
        },
        getIndexOfChild: function(_d) {
            return dojo.indexOf(this.getChildren(), _d);
        },
        startup: function() {
            if (this._started) {
                return;
            }
            dojo.forEach(this.getChildren(), function(_e) {
                _e.startup();
            });
            this.inherited(arguments);
        }
    });
}
if (!dojo._hasResource["dijit._base.manager"]) {
    dojo._hasResource["dijit._base.manager"] = true;
    dojo.provide("dijit._base.manager");
    dojo.declare("dijit.WidgetSet", null, {
        constructor: function() {
            this._hash = {};
            this.length = 0;
        },
        add: function(_f) {
            if (this._hash[_f.id]) {
                throw new Error("Tried to register widget with id==" + _f.id + " but that id is already registered");
            }
            this._hash[_f.id] = _f;
            this.length++;
        },
        remove: function(id) {
            if (this._hash[id]) {
                delete this._hash[id];
                this.length--;
            }
        },
        forEach: function(_10, _11) {
            _11 = _11 || dojo.global;
            var i = 0, id;
            for (id in this._hash) {
                _10.call(_11, this._hash[id], i++, this._hash);
            }
            return this;
        },
        filter: function(_12, _13) {
            _13 = _13 || dojo.global;
            var res = new dijit.WidgetSet(), i = 0, id;
            for (id in this._hash) {
                var w = this._hash[id];
                if (_12.call(_13, w, i++, this._hash)) {
                    res.add(w);
                }
            }
            return res;
        },
        byId: function(id) {
            return this._hash[id];
        },
        byClass: function(cls) {
            var res = new dijit.WidgetSet(), id, _14;
            for (id in this._hash) {
                _14 = this._hash[id];
                if (_14.declaredClass == cls) {
                    res.add(_14);
                }
            }
            return res;
        },
        toArray: function() {
            var ar = [];
            for (var id in this._hash) {
                ar.push(this._hash[id]);
            }
            return ar;
        },
        map: function(_15, _16) {
            return dojo.map(this.toArray(), _15, _16);
        },
        every: function(_17, _18) {
            _18 = _18 || dojo.global;
            var x = 0, i;
            for (i in this._hash) {
                if (!_17.call(_18, this._hash[i], x++, this._hash)) {
                    return false;
                }
            }
            return true;
        },
        some: function(_19, _1a) {
            _1a = _1a || dojo.global;
            var x = 0, i;
            for (i in this._hash) {
                if (_19.call(_1a, this._hash[i], x++, this._hash)) {
                    return true;
                }
            }
            return false;
        }
    });
    (function() {
        dijit.registry = new dijit.WidgetSet();
        var _1b = dijit.registry._hash
          , _1c = dojo.attr
          , _1d = dojo.hasAttr
          , _1e = dojo.style;
        dijit.byId = function(id) {
            return typeof id == "string" ? _1b[id] : id;
        }
        ;
        var _1f = {};
        dijit.getUniqueId = function(_20) {
            var id;
            do {
                id = _20 + "_" + (_20 in _1f ? ++_1f[_20] : _1f[_20] = 0);
            } while (_1b[id]);return dijit._scopeName == "dijit" ? id : dijit._scopeName + "_" + id;
        }
        ;
        dijit.findWidgets = function(_21) {
            var _22 = [];
            function _23(_24) {
                for (var _25 = _24.firstChild; _25; _25 = _25.nextSibling) {
                    if (_25.nodeType == 1) {
                        var _26 = _25.getAttribute("widgetId");
                        if (_26) {
                            var _27 = _1b[_26];
                            if (_27) {
                                _22.push(_27);
                            }
                        } else {
                            _23(_25);
                        }
                    }
                }
            }
            ;_23(_21);
            return _22;
        }
        ;
        dijit._destroyAll = function() {
            dijit._curFocus = null;
            dijit._prevFocus = null;
            dijit._activeStack = [];
            dojo.forEach(dijit.findWidgets(dojo.body()), function(_28) {
                if (!_28._destroyed) {
                    if (_28.destroyRecursive) {
                        _28.destroyRecursive();
                    } else {
                        if (_28.destroy) {
                            _28.destroy();
                        }
                    }
                }
            });
        }
        ;
        if (dojo.isIE) {
            dojo.addOnWindowUnload(function() {
                dijit._destroyAll();
            });
        }
        dijit.byNode = function(_29) {
            return _1b[_29.getAttribute("widgetId")];
        }
        ;
        dijit.getEnclosingWidget = function(_2a) {
            while (_2a) {
                var id = _2a.getAttribute && _2a.getAttribute("widgetId");
                if (id) {
                    return _1b[id];
                }
                _2a = _2a.parentNode;
            }
            return null;
        }
        ;
        var _2b = (dijit._isElementShown = function(_2c) {
            var s = _1e(_2c);
            return (s.visibility != "hidden") && (s.visibility != "collapsed") && (s.display != "none") && (_1c(_2c, "type") != "hidden");
        }
        );
        dijit.hasDefaultTabStop = function(_2d) {
            switch (_2d.nodeName.toLowerCase()) {
            case "a":
                return _1d(_2d, "href");
            case "area":
            case "button":
            case "input":
            case "object":
            case "select":
            case "textarea":
                return true;
            case "iframe":
                var _2e;
                try {
                    var _2f = _2d.contentDocument;
                    if ("designMode"in _2f && _2f.designMode == "on") {
                        return true;
                    }
                    _2e = _2f.body;
                } catch (e1) {
                    try {
                        _2e = _2d.contentWindow.document.body;
                    } catch (e2) {
                        return false;
                    }
                }
                return _2e.contentEditable == "true" || (_2e.firstChild && _2e.firstChild.contentEditable == "true");
            default:
                return _2d.contentEditable == "true";
            }
        }
        ;
        var _30 = (dijit.isTabNavigable = function(_31) {
            if (_1c(_31, "disabled")) {
                return false;
            } else {
                if (_1d(_31, "tabIndex")) {
                    return _1c(_31, "tabIndex") >= 0;
                } else {
                    return dijit.hasDefaultTabStop(_31);
                }
            }
        }
        );
        dijit._getTabNavigable = function(_32) {
            var _33, _34, _35, _36, _37, _38, _39 = {};
            function _3a(_3b) {
                return _3b && _3b.tagName.toLowerCase() == "input" && _3b.type && _3b.type.toLowerCase() == "radio" && _3b.name && _3b.name.toLowerCase();
            }
            ;var _3c = function(_3d) {
                dojo.query("> *", _3d).forEach(function(_3e) {
                    if ((dojo.isIE && _3e.scopeName !== "HTML") || !_2b(_3e)) {
                        return;
                    }
                    if (_30(_3e)) {
                        var _3f = _1c(_3e, "tabIndex");
                        if (!_1d(_3e, "tabIndex") || _3f == 0) {
                            if (!_33) {
                                _33 = _3e;
                            }
                            _34 = _3e;
                        } else {
                            if (_3f > 0) {
                                if (!_35 || _3f < _36) {
                                    _36 = _3f;
                                    _35 = _3e;
                                }
                                if (!_37 || _3f >= _38) {
                                    _38 = _3f;
                                    _37 = _3e;
                                }
                            }
                        }
                        var rn = _3a(_3e);
                        if (dojo.attr(_3e, "checked") && rn) {
                            _39[rn] = _3e;
                        }
                    }
                    if (_3e.nodeName.toUpperCase() != "SELECT") {
                        _3c(_3e);
                    }
                });
            };
            if (_2b(_32)) {
                _3c(_32);
            }
            function rs(_40) {
                return _39[_3a(_40)] || _40;
            }
            ;return {
                first: rs(_33),
                last: rs(_34),
                lowest: rs(_35),
                highest: rs(_37)
            };
        }
        ;
        dijit.getFirstInTabbingOrder = function(_41) {
            var _42 = dijit._getTabNavigable(dojo.byId(_41));
            return _42.lowest ? _42.lowest : _42.first;
        }
        ;
        dijit.getLastInTabbingOrder = function(_43) {
            var _44 = dijit._getTabNavigable(dojo.byId(_43));
            return _44.last ? _44.last : _44.highest;
        }
        ;
        dijit.defaultDuration = dojo.config["defaultDuration"] || 200;
    })();
}
if (!dojo._hasResource["dojo.Stateful"]) {
    dojo._hasResource["dojo.Stateful"] = true;
    dojo.provide("dojo.Stateful");
    dojo.declare("dojo.Stateful", null, {
        postscript: function(_45) {
            if (_45) {
                dojo.mixin(this, _45);
            }
        },
        get: function(_46) {
            return this[_46];
        },
        set: function(_47, _48) {
            if (typeof _47 === "object") {
                for (var x in _47) {
                    this.set(x, _47[x]);
                }
                return this;
            }
            var _49 = this[_47];
            this[_47] = _48;
            if (this._watchCallbacks) {
                this._watchCallbacks(_47, _49, _48);
            }
            return this;
        },
        watch: function(_4a, _4b) {
            var _4c = this._watchCallbacks;
            if (!_4c) {
                var _4d = this;
                _4c = this._watchCallbacks = function(_4e, _4f, _50, _51) {
                    var _52 = function(_53) {
                        if (_53) {
                            _53 = _53.slice();
                            for (var i = 0, l = _53.length; i < l; i++) {
                                try {
                                    _53[i].call(_4d, _4e, _4f, _50);
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        }
                    };
                    _52(_4c["_" + _4e]);
                    if (!_51) {
                        _52(_4c["*"]);
                    }
                }
                ;
            }
            if (!_4b && typeof _4a === "function") {
                _4b = _4a;
                _4a = "*";
            } else {
                _4a = "_" + _4a;
            }
            var _54 = _4c[_4a];
            if (typeof _54 !== "object") {
                _54 = _4c[_4a] = [];
            }
            _54.push(_4b);
            return {
                unwatch: function() {
                    _54.splice(dojo.indexOf(_54, _4b), 1);
                }
            };
        }
    });
}
if (!dojo._hasResource["dijit._WidgetBase"]) {
    dojo._hasResource["dijit._WidgetBase"] = true;
    dojo.provide("dijit._WidgetBase");
    (function() {
        dojo.declare("dijit._WidgetBase", dojo.Stateful, {
            id: "",
            lang: "",
            dir: "",
            "class": "",
            style: "",
            title: "",
            tooltip: "",
            baseClass: "",
            srcNodeRef: null,
            domNode: null,
            containerNode: null,
            attributeMap: {
                id: "",
                dir: "",
                lang: "",
                "class": "",
                style: "",
                title: ""
            },
            _blankGif: (dojo.config.blankGif || dojo.moduleUrl("dojo", "resources/blank.gif")).toString(),
            postscript: function(_55, _56) {
                this.create(_55, _56);
            },
            create: function(_57, _58) {
                this.srcNodeRef = dojo.byId(_58);
                this._connects = [];
                this._subscribes = [];
                if (this.srcNodeRef && (typeof this.srcNodeRef.id == "string")) {
                    this.id = this.srcNodeRef.id;
                }
                if (_57) {
                    this.params = _57;
                    dojo._mixin(this, _57);
                }
                this.postMixInProperties();
                if (!this.id) {
                    this.id = dijit.getUniqueId(this.declaredClass.replace(/\./g, "_"));
                }
                dijit.registry.add(this);
                this.buildRendering();
                if (this.domNode) {
                    this._applyAttributes();
                    var _59 = this.srcNodeRef;
                    if (_59 && _59.parentNode && this.domNode !== _59) {
                        _59.parentNode.replaceChild(this.domNode, _59);
                    }
                }
                if (this.domNode) {
                    this.domNode.setAttribute("widgetId", this.id);
                }
                this.postCreate();
                if (this.srcNodeRef && !this.srcNodeRef.parentNode) {
                    delete this.srcNodeRef;
                }
                this._created = true;
            },
            _applyAttributes: function() {
                var _5a = function(_5b, _5c) {
                    if ((_5c.params && _5b in _5c.params) || _5c[_5b]) {
                        _5c.set(_5b, _5c[_5b]);
                    }
                };
                for (var _5d in this.attributeMap) {
                    _5a(_5d, this);
                }
                dojo.forEach(this._getSetterAttributes(), function(a) {
                    if (!(a in this.attributeMap)) {
                        _5a(a, this);
                    }
                }, this);
            },
            _getSetterAttributes: function() {
                var _5e = this.constructor;
                if (!_5e._setterAttrs) {
                    var r = (_5e._setterAttrs = []), _5f, _60 = _5e.prototype;
                    for (var _61 in _60) {
                        if (dojo.isFunction(_60[_61]) && (_5f = _61.match(/^_set([a-zA-Z]*)Attr$/)) && _5f[1]) {
                            r.push(_5f[1].charAt(0).toLowerCase() + _5f[1].substr(1));
                        }
                    }
                }
                return _5e._setterAttrs;
            },
            postMixInProperties: function() {},
            buildRendering: function() {
                if (!this.domNode) {
                    this.domNode = this.srcNodeRef || dojo.create("div");
                }
                if (this.baseClass) {
                    var _62 = this.baseClass.split(" ");
                    if (!this.isLeftToRight()) {
                        _62 = _62.concat(dojo.map(_62, function(_63) {
                            return _63 + "Rtl";
                        }));
                    }
                    dojo.addClass(this.domNode, _62);
                }
            },
            postCreate: function() {},
            startup: function() {
                this._started = true;
            },
            destroyRecursive: function(_64) {
                this._beingDestroyed = true;
                this.destroyDescendants(_64);
                this.destroy(_64);
            },
            destroy: function(_65) {
                this._beingDestroyed = true;
                this.uninitialize();
                var d = dojo
                  , dfe = d.forEach
                  , dun = d.unsubscribe;
                dfe(this._connects, function(_66) {
                    dfe(_66, d.disconnect);
                });
                dfe(this._subscribes, function(_67) {
                    dun(_67);
                });
                dfe(this._supportingWidgets || [], function(w) {
                    if (w.destroyRecursive) {
                        w.destroyRecursive();
                    } else {
                        if (w.destroy) {
                            w.destroy();
                        }
                    }
                });
                this.destroyRendering(_65);
                dijit.registry.remove(this.id);
                this._destroyed = true;
            },
            destroyRendering: function(_68) {
                if (this.bgIframe) {
                    this.bgIframe.destroy(_68);
                    delete this.bgIframe;
                }
                if (this.domNode) {
                    if (_68) {
                        dojo.removeAttr(this.domNode, "widgetId");
                    } else {
                        dojo.destroy(this.domNode);
                    }
                    delete this.domNode;
                }
                if (this.srcNodeRef) {
                    if (!_68) {
                        dojo.destroy(this.srcNodeRef);
                    }
                    delete this.srcNodeRef;
                }
            },
            destroyDescendants: function(_69) {
                dojo.forEach(this.getChildren(), function(_6a) {
                    if (_6a.destroyRecursive) {
                        _6a.destroyRecursive(_69);
                    }
                });
            },
            uninitialize: function() {
                return false;
            },
            _setClassAttr: function(_6b) {
                var _6c = this[this.attributeMap["class"] || "domNode"];
                dojo.replaceClass(_6c, _6b, this["class"]);
                this._set("class", _6b);
            },
            _setStyleAttr: function(_6d) {
                var _6e = this[this.attributeMap.style || "domNode"];
                if (dojo.isObject(_6d)) {
                    dojo.style(_6e, _6d);
                } else {
                    if (_6e.style.cssText) {
                        _6e.style.cssText += "; " + _6d;
                    } else {
                        _6e.style.cssText = _6d;
                    }
                }
                this._set("style", _6d);
            },
            _attrToDom: function(_6f, _70) {
                var _71 = this.attributeMap[_6f];
                dojo.forEach(dojo.isArray(_71) ? _71 : [_71], function(_72) {
                    var _73 = this[_72.node || _72 || "domNode"];
                    var _74 = _72.type || "attribute";
                    switch (_74) {
                    case "attribute":
                        if (dojo.isFunction(_70)) {
                            _70 = dojo.hitch(this, _70);
                        }
                        var _75 = _72.attribute ? _72.attribute : (/^on[A-Z][a-zA-Z]*$/.test(_6f) ? _6f.toLowerCase() : _6f);
                        dojo.attr(_73, _75, _70);
                        break;
                    case "innerText":
                        _73.innerHTML = "";
                        _73.appendChild(dojo.doc.createTextNode(_70));
                        break;
                    case "innerHTML":
                        _73.innerHTML = _70;
                        break;
                    case "class":
                        dojo.replaceClass(_73, _70, this[_6f]);
                        break;
                    }
                }, this);
            },
            get: function(_76) {
                var _77 = this._getAttrNames(_76);
                return this[_77.g] ? this[_77.g]() : this[_76];
            },
            set: function(_78, _79) {
                if (typeof _78 === "object") {
                    for (var x in _78) {
                        this.set(x, _78[x]);
                    }
                    return this;
                }
                var _7a = this._getAttrNames(_78);
                if (this[_7a.s]) {
                    var _7b = this[_7a.s].apply(this, Array.prototype.slice.call(arguments, 1));
                } else {
                    if (_78 in this.attributeMap) {
                        this._attrToDom(_78, _79);
                    }
                    this._set(_78, _79);
                }
                return _7b || this;
            },
            _attrPairNames: {},
            _getAttrNames: function(_7c) {
                var apn = this._attrPairNames;
                if (apn[_7c]) {
                    return apn[_7c];
                }
                var uc = _7c.charAt(0).toUpperCase() + _7c.substr(1);
                return ( apn[_7c] = {
                    n: _7c + "Node",
                    s: "_set" + uc + "Attr",
                    g: "_get" + uc + "Attr"
                }) ;
            },
            _set: function(_7d, _7e) {
                var _7f = this[_7d];
                this[_7d] = _7e;
                if (this._watchCallbacks && this._created && _7e !== _7f) {
                    this._watchCallbacks(_7d, _7f, _7e);
                }
            },
            toString: function() {
                return "[Widget " + this.declaredClass + ", " + (this.id || "NO ID") + "]";
            },
            getDescendants: function() {
                return this.containerNode ? dojo.query("[widgetId]", this.containerNode).map(dijit.byNode) : [];
            },
            getChildren: function() {
                return this.containerNode ? dijit.findWidgets(this.containerNode) : [];
            },
            connect: function(obj, _80, _81) {
                var _82 = [dojo._connect(obj, _80, this, _81)];
                this._connects.push(_82);
                return _82;
            },
            disconnect: function(_83) {
                for (var i = 0; i < this._connects.length; i++) {
                    if (this._connects[i] == _83) {
                        dojo.forEach(_83, dojo.disconnect);
                        this._connects.splice(i, 1);
                        return;
                    }
                }
            },
            subscribe: function(_84, _85) {
                var _86 = dojo.subscribe(_84, this, _85);
                this._subscribes.push(_86);
                return _86;
            },
            unsubscribe: function(_87) {
                for (var i = 0; i < this._subscribes.length; i++) {
                    if (this._subscribes[i] == _87) {
                        dojo.unsubscribe(_87);
                        this._subscribes.splice(i, 1);
                        return;
                    }
                }
            },
            isLeftToRight: function() {
                return this.dir ? (this.dir == "ltr") : dojo._isBodyLtr();
            },
            placeAt: function(_88, _89) {
                if (_88.declaredClass && _88.addChild) {
                    _88.addChild(this, _89);
                } else {
                    dojo.place(this.domNode, _88, _89);
                }
                return this;
            }
        });
    })();
}
if (!dojo._hasResource["dojo.window"]) {
    dojo._hasResource["dojo.window"] = true;
    dojo.provide("dojo.window");
    dojo.getObject("window", true, dojo);
    dojo.window.getBox = function() {
        var _8a = (dojo.doc.compatMode == "BackCompat") ? dojo.body() : dojo.doc.documentElement;
        var _8b = dojo._docScroll();
        return {
            w: _8a.clientWidth,
            h: _8a.clientHeight,
            l: _8b.x,
            t: _8b.y
        };
    }
    ;
    dojo.window.get = function(doc) {
        if (dojo.isIE && window !== document.parentWindow) {
            doc.parentWindow.execScript("document._parentWindow = window;", "Javascript");
            var win = doc._parentWindow;
            doc._parentWindow = null;
            return win;
        }
        return doc.parentWindow || doc.defaultView;
    }
    ;
    dojo.window.scrollIntoView = function(_8c, pos) {
        try {
            _8c = dojo.byId(_8c);
            var doc = _8c.ownerDocument || dojo.doc
              , _8d = doc.body || dojo.body()
              , _8e = doc.documentElement || _8d.parentNode
              , _8f = dojo.isIE
              , _90 = dojo.isWebKit;
            if ((!(dojo.isMoz || _8f || _90 || dojo.isOpera) || _8c == _8d || _8c == _8e) && (typeof _8c.scrollIntoView != "undefined")) {
                _8c.scrollIntoView(false);
                return;
            }
            var _91 = doc.compatMode == "BackCompat"
              , _92 = _91 ? _8d : _8e
              , _93 = _90 ? _8d : _92
              , _94 = _92.clientWidth
              , _95 = _92.clientHeight
              , rtl = !dojo._isBodyLtr()
              , _96 = pos || dojo.position(_8c)
              , el = _8c.parentNode
              , _97 = function(el) {
                return ( (_8f <= 6 || (_8f && _91)) ? false : (dojo.style(el, "position").toLowerCase() == "fixed")) ;
            };
            if (_97(_8c)) {
                return;
            }
            while (el) {
                if (el == _8d) {
                    el = _93;
                }
                var _98 = dojo.position(el)
                  , _99 = _97(el);
                if (el == _93) {
                    _98.w = _94;
                    _98.h = _95;
                    if (_93 == _8e && _8f && rtl) {
                        _98.x += _93.offsetWidth - _98.w;
                    }
                    if (_98.x < 0 || !_8f) {
                        _98.x = 0;
                    }
                    if (_98.y < 0 || !_8f) {
                        _98.y = 0;
                    }
                } else {
                    var pb = dojo._getPadBorderExtents(el);
                    _98.w -= pb.w;
                    _98.h -= pb.h;
                    _98.x += pb.l;
                    _98.y += pb.t;
                }
                if (el != _93) {
                    var _9a = el.clientWidth
                      , _9b = _98.w - _9a;
                    if (_9a > 0 && _9b > 0) {
                        _98.w = _9a;
                        if (_8f && rtl) {
                            _98.x += _9b;
                        }
                    }
                    _9a = el.clientHeight;
                    _9b = _98.h - _9a;
                    if (_9a > 0 && _9b > 0) {
                        _98.h = _9a;
                    }
                }
                if (_99) {
                    if (_98.y < 0) {
                        _98.h += _98.y;
                        _98.y = 0;
                    }
                    if (_98.x < 0) {
                        _98.w += _98.x;
                        _98.x = 0;
                    }
                    if (_98.y + _98.h > _95) {
                        _98.h = _95 - _98.y;
                    }
                    if (_98.x + _98.w > _94) {
                        _98.w = _94 - _98.x;
                    }
                }
                var l = _96.x - _98.x
                  , t = _96.y - Math.max(_98.y, 0)
                  , r = l + _96.w - _98.w
                  , bot = t + _96.h - _98.h;
                if (r * l > 0) {
                    var s = Math[l < 0 ? "max" : "min"](l, r);
                    _96.x += el.scrollLeft;
                    el.scrollLeft += (_8f >= 8 && !_91 && rtl) ? -s : s;
                    _96.x -= el.scrollLeft;
                }
                if (bot * t > 0) {
                    _96.y += el.scrollTop;
                    el.scrollTop += Math[t < 0 ? "max" : "min"](t, bot);
                    _96.y -= el.scrollTop;
                }
                el = (el != _93) && !_99 && el.parentNode;
            }
        } catch (error) {
            console.error("scrollIntoView: " + error);
            _8c.scrollIntoView(false);
        }
    }
    ;
}
if (!dojo._hasResource["dijit._base.focus"]) {
    dojo._hasResource["dijit._base.focus"] = true;
    dojo.provide("dijit._base.focus");
    dojo.mixin(dijit, {
        _curFocus: null,
        _prevFocus: null,
        isCollapsed: function() {
            return dijit.getBookmark().isCollapsed;
        },
        getBookmark: function() {
            var bm, rg, tg, sel = dojo.doc.selection, cf = dijit._curFocus;
            if (dojo.global.getSelection) {
                sel = dojo.global.getSelection();
                if (sel) {
                    if (sel.isCollapsed) {
                        tg = cf ? cf.tagName : "";
                        if (tg) {
                            tg = tg.toLowerCase();
                            if (tg == "textarea" || (tg == "input" && (!cf.type || cf.type.toLowerCase() == "text"))) {
                                sel = {
                                    start: cf.selectionStart,
                                    end: cf.selectionEnd,
                                    node: cf,
                                    pRange: true
                                };
                                return {
                                    isCollapsed: (sel.end <= sel.start),
                                    mark: sel
                                };
                            }
                        }
                        bm = {
                            isCollapsed: true
                        };
                    } else {
                        rg = sel.getRangeAt(0);
                        bm = {
                            isCollapsed: false,
                            mark: rg.cloneRange()
                        };
                    }
                }
            } else {
                if (sel) {
                    tg = cf ? cf.tagName : "";
                    tg = tg.toLowerCase();
                    if (cf && tg && (tg == "button" || tg == "textarea" || tg == "input")) {
                        if (sel.type && sel.type.toLowerCase() == "none") {
                            return {
                                isCollapsed: true,
                                mark: null
                            };
                        } else {
                            rg = sel.createRange();
                            return {
                                isCollapsed: rg.text && rg.text.length ? false : true,
                                mark: {
                                    range: rg,
                                    pRange: true
                                }
                            };
                        }
                    }
                    bm = {};
                    try {
                        rg = sel.createRange();
                        bm.isCollapsed = !(sel.type == "Text" ? rg.htmlText.length : rg.length);
                    } catch (e) {
                        bm.isCollapsed = true;
                        return bm;
                    }
                    if (sel.type.toUpperCase() == "CONTROL") {
                        if (rg.length) {
                            bm.mark = [];
                            var i = 0
                              , len = rg.length;
                            while (i < len) {
                                bm.mark.push(rg.item(i++));
                            }
                        } else {
                            bm.isCollapsed = true;
                            bm.mark = null;
                        }
                    } else {
                        bm.mark = rg.getBookmark();
                    }
                } else {
                    console.warn("No idea how to store the current selection for this browser!");
                }
            }
            return bm;
        },
        moveToBookmark: function(_9c) {
            var _9d = dojo.doc
              , _9e = _9c.mark;
            if (_9e) {
                if (dojo.global.getSelection) {
                    var sel = dojo.global.getSelection();
                    if (sel && sel.removeAllRanges) {
                        if (_9e.pRange) {
                            var r = _9e;
                            var n = r.node;
                            n.selectionStart = r.start;
                            n.selectionEnd = r.end;
                        } else {
                            sel.removeAllRanges();
                            sel.addRange(_9e);
                        }
                    } else {
                        console.warn("No idea how to restore selection for this browser!");
                    }
                } else {
                    if (_9d.selection && _9e) {
                        var rg;
                        if (_9e.pRange) {
                            rg = _9e.range;
                        } else {
                            if (dojo.isArray(_9e)) {
                                rg = _9d.body.createControlRange();
                                dojo.forEach(_9e, function(n) {
                                    rg.addElement(n);
                                });
                            } else {
                                rg = _9d.body.createTextRange();
                                rg.moveToBookmark(_9e);
                            }
                        }
                        rg.select();
                    }
                }
            }
        },
        getFocus: function(_9f, _a0) {
            var _a1 = !dijit._curFocus || (_9f && dojo.isDescendant(dijit._curFocus, _9f.domNode)) ? dijit._prevFocus : dijit._curFocus;
            return {
                node: _a1,
                bookmark: (_a1 == dijit._curFocus) && dojo.withGlobal(_a0 || dojo.global, dijit.getBookmark),
                openedForWindow: _a0
            };
        },
        focus: function(_a2) {
            if (!_a2) {
                return;
            }
            var _a3 = "node"in _a2 ? _a2.node : _a2
              , _a4 = _a2.bookmark
              , _a5 = _a2.openedForWindow
              , _a6 = _a4 ? _a4.isCollapsed : false;
            if (_a3) {
                var _a7 = (_a3.tagName.toLowerCase() == "iframe") ? _a3.contentWindow : _a3;
                if (_a7 && _a7.focus) {
                    try {
                        _a7.focus();
                    } catch (e) {}
                }
                dijit._onFocusNode(_a3);
            }
            if (_a4 && dojo.withGlobal(_a5 || dojo.global, dijit.isCollapsed) && !_a6) {
                if (_a5) {
                    _a5.focus();
                }
                try {
                    dojo.withGlobal(_a5 || dojo.global, dijit.moveToBookmark, null, [_a4]);
                } catch (e2) {}
            }
        },
        _activeStack: [],
        registerIframe: function(_a8) {
            return dijit.registerWin(_a8.contentWindow, _a8);
        },
        unregisterIframe: function(_a9) {
            dijit.unregisterWin(_a9);
        },
        registerWin: function(_aa, _ab) {
            var _ac = function(evt) {
                dijit._justMouseDowned = true;
                setTimeout(function() {
                    dijit._justMouseDowned = false;
                }, 0);
                if (dojo.isIE && evt && evt.srcElement && evt.srcElement.parentNode == null) {
                    return;
                }
                dijit._onTouchNode(_ab || evt.target || evt.srcElement, "mouse");
            };
            var doc = dojo.isIE ? _aa.document.documentElement : _aa.document;
            if (doc) {
                if (dojo.isIE) {
                    _aa.document.body.attachEvent("onmousedown", _ac);
                    var _ad = function(evt) {
                        if (evt.srcElement.tagName.toLowerCase() != "#document" && dijit.isTabNavigable(evt.srcElement)) {
                            dijit._onFocusNode(_ab || evt.srcElement);
                        } else {
                            dijit._onTouchNode(_ab || evt.srcElement);
                        }
                    };
                    doc.attachEvent("onactivate", _ad);
                    var _ae = function(evt) {
                        dijit._onBlurNode(_ab || evt.srcElement);
                    };
                    doc.attachEvent("ondeactivate", _ae);
                    return function() {
                        _aa.document.detachEvent("onmousedown", _ac);
                        doc.detachEvent("onactivate", _ad);
                        doc.detachEvent("ondeactivate", _ae);
                        doc = null;
                    }
                    ;
                } else {
                    doc.body.addEventListener("mousedown", _ac, true);
                    var _af = function(evt) {
                        dijit._onFocusNode(_ab || evt.target);
                    };
                    doc.addEventListener("focus", _af, true);
                    var _b0 = function(evt) {
                        dijit._onBlurNode(_ab || evt.target);
                    };
                    doc.addEventListener("blur", _b0, true);
                    return function() {
                        doc.body.removeEventListener("mousedown", _ac, true);
                        doc.removeEventListener("focus", _af, true);
                        doc.removeEventListener("blur", _b0, true);
                        doc = null;
                    }
                    ;
                }
            }
        },
        unregisterWin: function(_b1) {
            _b1 && _b1();
        },
        _onBlurNode: function(_b2) {
            dijit._prevFocus = dijit._curFocus;
            dijit._curFocus = null;
            if (dijit._justMouseDowned) {
                return;
            }
            if (dijit._clearActiveWidgetsTimer) {
                clearTimeout(dijit._clearActiveWidgetsTimer);
            }
            dijit._clearActiveWidgetsTimer = setTimeout(function() {
                delete dijit._clearActiveWidgetsTimer;
                dijit._setStack([]);
                dijit._prevFocus = null;
            }, 100);
        },
        _onTouchNode: function(_b3, by) {
            if (dijit._clearActiveWidgetsTimer) {
                clearTimeout(dijit._clearActiveWidgetsTimer);
                delete dijit._clearActiveWidgetsTimer;
            }
            var _b4 = [];
            try {
                while (_b3) {
                    var _b5 = dojo.attr(_b3, "dijitPopupParent");
                    if (_b5) {
                        _b3 = dijit.byId(_b5).domNode;
                    } else {
                        if (_b3.tagName && _b3.tagName.toLowerCase() == "body") {
                            if (_b3 === dojo.body()) {
                                break;
                            }
                            _b3 = dojo.window.get(_b3.ownerDocument).frameElement;
                        } else {
                            var id = _b3.getAttribute && _b3.getAttribute("widgetId")
                              , _b6 = id && dijit.byId(id);
                            if (_b6 && !(by == "mouse" && _b6.get("disabled"))) {
                                _b4.unshift(id);
                            }
                            _b3 = _b3.parentNode;
                        }
                    }
                }
            } catch (e) {}
            dijit._setStack(_b4, by);
        },
        _onFocusNode: function(_b7) {
            if (!_b7) {
                return;
            }
            if (_b7.nodeType == 9) {
                return;
            }
            dijit._onTouchNode(_b7);
            if (_b7 == dijit._curFocus) {
                return;
            }
            if (dijit._curFocus) {
                dijit._prevFocus = dijit._curFocus;
            }
            dijit._curFocus = _b7;
            dojo.publish("focusNode", [_b7]);
        },
        _setStack: function(_b8, by) {
            var _b9 = dijit._activeStack;
            dijit._activeStack = _b8;
            for (var _ba = 0; _ba < Math.min(_b9.length, _b8.length); _ba++) {
                if (_b9[_ba] != _b8[_ba]) {
                    break;
                }
            }
            var _bb;
            for (var i = _b9.length - 1; i >= _ba; i--) {
                _bb = dijit.byId(_b9[i]);
                if (_bb) {
                    _bb._focused = false;
                    _bb.set("focused", false);
                    _bb._hasBeenBlurred = true;
                    if (_bb._onBlur) {
                        _bb._onBlur(by);
                    }
                    dojo.publish("widgetBlur", [_bb, by]);
                }
            }
            for (i = _ba; i < _b8.length; i++) {
                _bb = dijit.byId(_b8[i]);
                if (_bb) {
                    _bb._focused = true;
                    _bb.set("focused", true);
                    if (_bb._onFocus) {
                        _bb._onFocus(by);
                    }
                    dojo.publish("widgetFocus", [_bb, by]);
                }
            }
        }
    });
    dojo.addOnLoad(function() {
        var _bc = dijit.registerWin(window);
        if (dojo.isIE) {
            dojo.addOnWindowUnload(function() {
                dijit.unregisterWin(_bc);
                _bc = null;
            });
        }
    });
}
if (!dojo._hasResource["dojo.AdapterRegistry"]) {
    dojo._hasResource["dojo.AdapterRegistry"] = true;
    dojo.provide("dojo.AdapterRegistry");
    dojo.AdapterRegistry = function(_bd) {
        this.pairs = [];
        this.returnWrappers = _bd || false;
    }
    ;
    dojo.extend(dojo.AdapterRegistry, {
        register: function(_be, _bf, _c0, _c1, _c2) {
            this.pairs[((_c2) ? "unshift" : "push")]([_be, _bf, _c0, _c1]);
        },
        match: function() {
            for (var i = 0; i < this.pairs.length; i++) {
                var _c3 = this.pairs[i];
                if (_c3[1].apply(this, arguments)) {
                    if ((_c3[3]) || (this.returnWrappers)) {
                        return _c3[2];
                    } else {
                        return _c3[2].apply(this, arguments);
                    }
                }
            }
            throw new Error("No match found");
        },
        unregister: function(_c4) {
            for (var i = 0; i < this.pairs.length; i++) {
                var _c5 = this.pairs[i];
                if (_c5[0] == _c4) {
                    this.pairs.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
    });
}
if (!dojo._hasResource["dijit._base.place"]) {
    dojo._hasResource["dijit._base.place"] = true;
    dojo.provide("dijit._base.place");
    dijit.getViewport = function() {
        return dojo.window.getBox();
    }
    ;
    dijit.placeOnScreen = function(_c6, pos, _c7, _c8) {
        var _c9 = dojo.map(_c7, function(_ca) {
            var c = {
                corner: _ca,
                pos: {
                    x: pos.x,
                    y: pos.y
                }
            };
            if (_c8) {
                c.pos.x += _ca.charAt(1) == "L" ? _c8.x : -_c8.x;
                c.pos.y += _ca.charAt(0) == "T" ? _c8.y : -_c8.y;
            }
            return c;
        });
        return dijit._place(_c6, _c9);
    }
    ;
    dijit._place = function(_cb, _cc, _cd, _ce) {
        var _cf = dojo.window.getBox();
        if (!_cb.parentNode || String(_cb.parentNode.tagName).toLowerCase() != "body") {
            dojo.body().appendChild(_cb);
        }
        var _d0 = null;
        dojo.some(_cc, function(_d1) {
            var _d2 = _d1.corner;
            var pos = _d1.pos;
            var _d3 = 0;
            var _d4 = {
                w: _d2.charAt(1) == "L" ? (_cf.l + _cf.w) - pos.x : pos.x - _cf.l,
                h: _d2.charAt(1) == "T" ? (_cf.t + _cf.h) - pos.y : pos.y - _cf.t
            };
            if (_cd) {
                var res = _cd(_cb, _d1.aroundCorner, _d2, _d4, _ce);
                _d3 = typeof res == "undefined" ? 0 : res;
            }
            var _d5 = _cb.style;
            var _d6 = _d5.display;
            var _d7 = _d5.visibility;
            _d5.visibility = "hidden";
            _d5.display = "";
            var mb = dojo.marginBox(_cb);
            _d5.display = _d6;
            _d5.visibility = _d7;
            var _d8 = Math.max(_cf.l, _d2.charAt(1) == "L" ? pos.x : (pos.x - mb.w))
              , _d9 = Math.max(_cf.t, _d2.charAt(0) == "T" ? pos.y : (pos.y - mb.h))
              , _da = Math.min(_cf.l + _cf.w, _d2.charAt(1) == "L" ? (_d8 + mb.w) : pos.x)
              , _db = Math.min(_cf.t + _cf.h, _d2.charAt(0) == "T" ? (_d9 + mb.h) : pos.y)
              , _dc = _da - _d8
              , _dd = _db - _d9;
            _d3 += (mb.w - _dc) + (mb.h - _dd);
            if (_d0 == null || _d3 < _d0.overflow) {
                _d0 = {
                    corner: _d2,
                    aroundCorner: _d1.aroundCorner,
                    x: _d8,
                    y: _d9,
                    w: _dc,
                    h: _dd,
                    overflow: _d3,
                    spaceAvailable: _d4
                };
            }
            return !_d3;
        });
        if (_d0.overflow && _cd) {
            _cd(_cb, _d0.aroundCorner, _d0.corner, _d0.spaceAvailable, _ce);
        }
        var l = dojo._isBodyLtr()
          , s = _cb.style;
        s.top = _d0.y + "px";
        s[l ? "left" : "right"] = (l ? _d0.x : _cf.w - _d0.x - _d0.w) + "px";
        return _d0;
    }
    ;
    dijit.placeOnScreenAroundNode = function(_de, _df, _e0, _e1) {
        _df = dojo.byId(_df);
        var _e2 = dojo.position(_df, true);
        return dijit._placeOnScreenAroundRect(_de, _e2.x, _e2.y, _e2.w, _e2.h, _e0, _e1);
    }
    ;
    dijit.placeOnScreenAroundRectangle = function(_e3, _e4, _e5, _e6) {
        return dijit._placeOnScreenAroundRect(_e3, _e4.x, _e4.y, _e4.width, _e4.height, _e5, _e6);
    }
    ;
    dijit._placeOnScreenAroundRect = function(_e7, x, y, _e8, _e9, _ea, _eb) {
        var _ec = [];
        for (var _ed in _ea) {
            _ec.push({
                aroundCorner: _ed,
                corner: _ea[_ed],
                pos: {
                    x: x + (_ed.charAt(1) == "L" ? 0 : _e8),
                    y: y + (_ed.charAt(0) == "T" ? 0 : _e9)
                }
            });
        }
        return dijit._place(_e7, _ec, _eb, {
            w: _e8,
            h: _e9
        });
    }
    ;
    dijit.placementRegistry = new dojo.AdapterRegistry();
    dijit.placementRegistry.register("node", function(n, x) {
        return typeof x == "object" && typeof x.offsetWidth != "undefined" && typeof x.offsetHeight != "undefined";
    }, dijit.placeOnScreenAroundNode);
    dijit.placementRegistry.register("rect", function(n, x) {
        return typeof x == "object" && "x"in x && "y"in x && "width"in x && "height"in x;
    }, dijit.placeOnScreenAroundRectangle);
    dijit.placeOnScreenAroundElement = function(_ee, _ef, _f0, _f1) {
        return dijit.placementRegistry.match.apply(dijit.placementRegistry, arguments);
    }
    ;
    dijit.getPopupAroundAlignment = function(_f2, _f3) {
        var _f4 = {};
        dojo.forEach(_f2, function(pos) {
            switch (pos) {
            case "after":
                _f4[_f3 ? "BR" : "BL"] = _f3 ? "BL" : "BR";
                break;
            case "before":
                _f4[_f3 ? "BL" : "BR"] = _f3 ? "BR" : "BL";
                break;
            case "below-alt":
                _f3 = !_f3;
            case "below":
                _f4[_f3 ? "BL" : "BR"] = _f3 ? "TL" : "TR";
                _f4[_f3 ? "BR" : "BL"] = _f3 ? "TR" : "TL";
                break;
            case "above-alt":
                _f3 = !_f3;
            case "above":
            default:
                _f4[_f3 ? "TL" : "TR"] = _f3 ? "BL" : "BR";
                _f4[_f3 ? "TR" : "TL"] = _f3 ? "BR" : "BL";
                break;
            }
        });
        return _f4;
    }
    ;
}
if (!dojo._hasResource["dijit._base.window"]) {
    dojo._hasResource["dijit._base.window"] = true;
    dojo.provide("dijit._base.window");
    dijit.getDocumentWindow = function(doc) {
        return dojo.window.get(doc);
    }
    ;
}
if (!dojo._hasResource["dijit._base.popup"]) {
    dojo._hasResource["dijit._base.popup"] = true;
    dojo.provide("dijit._base.popup");
    dijit.popup = {
        _stack: [],
        _beginZIndex: 1000,
        _idGen: 1,
        _createWrapper: function(_f5) {
            var _f6 = _f5.declaredClass ? _f5._popupWrapper : (dojo.hasClass(_f5.parentNode, "dijitPopup") && _f5.parentNode)
              , _f7 = _f5.domNode || _f5;
            if (!_f6) {
                _f6 = dojo.create("div", {
                    "class": "dijitPopup",
                    style: {
                        display: "none"
                    },
                    role: "presentation"
                }, dojo.body());
                _f6.appendChild(_f7);
                var s = _f7.style;
                s.display = "";
                s.visibility = "";
                s.position = "";
                s.top = "0px";
                if (_f5.declaredClass) {
                    _f5._popupWrapper = _f6;
                    dojo.connect(_f5, "destroy", function() {
                        dojo.destroy(_f6);
                        delete _f5._popupWrapper;
                    });
                }
            }
            return _f6;
        },
        moveOffScreen: function(_f8) {
            var _f9 = this._createWrapper(_f8);
            dojo.style(_f9, {
                visibility: "hidden",
                top: "-9999px",
                display: ""
            });
        },
        hide: function(_fa) {
            var _fb = this._createWrapper(_fa);
            dojo.style(_fb, "display", "none");
        },
        getTopPopup: function() {
            var _fc = this._stack;
            for (var pi = _fc.length - 1; pi > 0 && _fc[pi].parent === _fc[pi - 1].widget; pi--) {}
            return _fc[pi];
        },
        open: function(_fd) {
            var _fe = this._stack
              , _ff = _fd.popup
              , _100 = _fd.orient || ((_fd.parent ? _fd.parent.isLeftToRight() : dojo._isBodyLtr()) ? {
                "BL": "TL",
                "BR": "TR",
                "TL": "BL",
                "TR": "BR"
            } : {
                "BR": "TR",
                "BL": "TL",
                "TR": "BR",
                "TL": "BL"
            })
              , _101 = _fd.around
              , id = (_fd.around && _fd.around.id) ? (_fd.around.id + "_dropdown") : ("popup_" + this._idGen++);
            while (_fe.length && (!_fd.parent || !dojo.isDescendant(_fd.parent.domNode, _fe[_fe.length - 1].widget.domNode))) {
                dijit.popup.close(_fe[_fe.length - 1].widget);
            }
            var _102 = this._createWrapper(_ff);
            dojo.attr(_102, {
                id: id,
                style: {
                    zIndex: this._beginZIndex + _fe.length
                },
                "class": "dijitPopup " + (_ff.baseClass || _ff["class"] || "").split(" ")[0] + "Popup",
                dijitPopupParent: _fd.parent ? _fd.parent.id : ""
            });
            if (dojo.isIE || dojo.isMoz) {
                if (!_ff.bgIframe) {
                    _ff.bgIframe = new dijit.BackgroundIframe(_102);
                }
            }
            var best = _101 ? dijit.placeOnScreenAroundElement(_102, _101, _100, _ff.orient ? dojo.hitch(_ff, "orient") : null) : dijit.placeOnScreen(_102, _fd, _100 == "R" ? ["TR", "BR", "TL", "BL"] : ["TL", "BL", "TR", "BR"], _fd.padding);
            _102.style.display = "";
            _102.style.visibility = "visible";
            _ff.domNode.style.visibility = "visible";
            var _103 = [];
            _103.push(dojo.connect(_102, "onkeypress", this, function(evt) {
                if (evt.charOrCode == dojo.keys.ESCAPE && _fd.onCancel) {
                    dojo.stopEvent(evt);
                    _fd.onCancel();
                } else {
                    if (evt.charOrCode === dojo.keys.TAB) {
                        dojo.stopEvent(evt);
                        var _104 = this.getTopPopup();
                        if (_104 && _104.onCancel) {
                            _104.onCancel();
                        }
                    }
                }
            }));
            if (_ff.onCancel) {
                _103.push(dojo.connect(_ff, "onCancel", _fd.onCancel));
            }
            _103.push(dojo.connect(_ff, _ff.onExecute ? "onExecute" : "onChange", this, function() {
                var _105 = this.getTopPopup();
                if (_105 && _105.onExecute) {
                    _105.onExecute();
                }
            }));
            _fe.push({
                widget: _ff,
                parent: _fd.parent,
                onExecute: _fd.onExecute,
                onCancel: _fd.onCancel,
                onClose: _fd.onClose,
                handlers: _103
            });
            if (_ff.onOpen) {
                _ff.onOpen(best);
            }
            return best;
        },
        close: function(_106) {
            var _107 = this._stack;
            while ((_106 && dojo.some(_107, function(elem) {
                return elem.widget == _106;
            })) || (!_106 && _107.length)) {
                var top = _107.pop()
                  , _108 = top.widget
                  , _109 = top.onClose;
                if (_108.onClose) {
                    _108.onClose();
                }
                dojo.forEach(top.handlers, dojo.disconnect);
                if (_108 && _108.domNode) {
                    this.hide(_108);
                }
                if (_109) {
                    _109();
                }
            }
        }
    };
    dijit._frames = new function() {
        var _10a = [];
        this.pop = function() {
            var _10b;
            if (_10a.length) {
                _10b = _10a.pop();
                _10b.style.display = "";
            } else {
                if (dojo.isIE < 9) {
                    var burl = dojo.config["dojoBlankHtmlUrl"] || (dojo.moduleUrl("dojo", "resources/blank.html") + "") || "javascript:\"\"";
                    var html = "<iframe src='" + burl + "'" + " style='position: absolute; left: 0px; top: 0px;" + "z-index: -1; filter:Alpha(Opacity=\"0\");'>";
                    _10b = dojo.doc.createElement(html);
                } else {
                    _10b = dojo.create("iframe");
                    _10b.src = "javascript:\"\"";
                    _10b.className = "dijitBackgroundIframe";
                    dojo.style(_10b, "opacity", 0.1);
                }
                _10b.tabIndex = -1;
                dijit.setWaiRole(_10b, "presentation");
            }
            return _10b;
        }
        ;
        this.push = function(_10c) {
            _10c.style.display = "none";
            _10a.push(_10c);
        }
        ;
    }
    ();
    dijit.BackgroundIframe = function(node) {
        if (!node.id) {
            throw new Error("no id");
        }
        if (dojo.isIE || dojo.isMoz) {
            var _10d = (this.iframe = dijit._frames.pop());
            node.appendChild(_10d);
            if (dojo.isIE < 7 || dojo.isQuirks) {
                this.resize(node);
                this._conn = dojo.connect(node, "onresize", this, function() {
                    this.resize(node);
                });
            } else {
                dojo.style(_10d, {
                    width: "100%",
                    height: "100%"
                });
            }
        }
    }
    ;
    dojo.extend(dijit.BackgroundIframe, {
        resize: function(node) {
            if (this.iframe) {
                dojo.style(this.iframe, {
                    width: node.offsetWidth + "px",
                    height: node.offsetHeight + "px"
                });
            }
        },
        destroy: function() {
            if (this._conn) {
                dojo.disconnect(this._conn);
                this._conn = null;
            }
            if (this.iframe) {
                dijit._frames.push(this.iframe);
                delete this.iframe;
            }
        }
    });
}
if (!dojo._hasResource["dijit._base.scroll"]) {
    dojo._hasResource["dijit._base.scroll"] = true;
    dojo.provide("dijit._base.scroll");
    dijit.scrollIntoView = function(node, pos) {
        dojo.window.scrollIntoView(node, pos);
    }
    ;
}
if (!dojo._hasResource["dojo.uacss"]) {
    dojo._hasResource["dojo.uacss"] = true;
    dojo.provide("dojo.uacss");
    (function() {
        var d = dojo
          , html = d.doc.documentElement
          , ie = d.isIE
          , _10e = d.isOpera
          , maj = Math.floor
          , ff = d.isFF
          , _10f = d.boxModel.replace(/-/, "")
          , _110 = {
            dj_ie: ie,
            dj_ie6: maj(ie) == 6,
            dj_ie7: maj(ie) == 7,
            dj_ie8: maj(ie) == 8,
            dj_ie9: maj(ie) == 9,
            dj_quirks: d.isQuirks,
            dj_iequirks: ie && d.isQuirks,
            dj_opera: _10e,
            dj_khtml: d.isKhtml,
            dj_webkit: d.isWebKit,
            dj_safari: d.isSafari,
            dj_chrome: d.isChrome,
            dj_gecko: d.isMozilla,
            dj_ff3: maj(ff) == 3
        };
        _110["dj_" + _10f] = true;
        var _111 = "";
        for (var clz in _110) {
            if (_110[clz]) {
                _111 += clz + " ";
            }
        }
        html.className = d.trim(html.className + " " + _111);
        dojo._loaders.unshift(function() {
            if (!dojo._isBodyLtr()) {
                var _112 = "dj_rtl dijitRtl " + _111.replace(/ /g, "-rtl ");
                html.className = d.trim(html.className + " " + _112);
            }
        });
    })();
}
if (!dojo._hasResource["dijit._base.sniff"]) {
    dojo._hasResource["dijit._base.sniff"] = true;
    dojo.provide("dijit._base.sniff");
}
if (!dojo._hasResource["dijit._base.typematic"]) {
    dojo._hasResource["dijit._base.typematic"] = true;
    dojo.provide("dijit._base.typematic");
    dijit.typematic = {
        _fireEventAndReload: function() {
            this._timer = null;
            this._callback(++this._count, this._node, this._evt);
            this._currentTimeout = Math.max(this._currentTimeout < 0 ? this._initialDelay : (this._subsequentDelay > 1 ? this._subsequentDelay : Math.round(this._currentTimeout * this._subsequentDelay)), this._minDelay);
            this._timer = setTimeout(dojo.hitch(this, "_fireEventAndReload"), this._currentTimeout);
        },
        trigger: function(evt, _113, node, _114, obj, _115, _116, _117) {
            if (obj != this._obj) {
                this.stop();
                this._initialDelay = _116 || 500;
                this._subsequentDelay = _115 || 0.9;
                this._minDelay = _117 || 10;
                this._obj = obj;
                this._evt = evt;
                this._node = node;
                this._currentTimeout = -1;
                this._count = -1;
                this._callback = dojo.hitch(_113, _114);
                this._fireEventAndReload();
                this._evt = dojo.mixin({
                    faux: true
                }, evt);
            }
        },
        stop: function() {
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            if (this._obj) {
                this._callback(-1, this._node, this._evt);
                this._obj = null;
            }
        },
        addKeyListener: function(node, _118, _119, _11a, _11b, _11c, _11d) {
            if (_118.keyCode) {
                _118.charOrCode = _118.keyCode;
                dojo.deprecated("keyCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.", "", "2.0");
            } else {
                if (_118.charCode) {
                    _118.charOrCode = String.fromCharCode(_118.charCode);
                    dojo.deprecated("charCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.", "", "2.0");
                }
            }
            return [dojo.connect(node, "onkeypress", this, function(evt) {
                if (evt.charOrCode == _118.charOrCode && (_118.ctrlKey === undefined || _118.ctrlKey == evt.ctrlKey) && (_118.altKey === undefined || _118.altKey == evt.altKey) && (_118.metaKey === undefined || _118.metaKey == (evt.metaKey || false)) && (_118.shiftKey === undefined || _118.shiftKey == evt.shiftKey)) {
                    dojo.stopEvent(evt);
                    dijit.typematic.trigger(evt, _119, node, _11a, _118, _11b, _11c, _11d);
                } else {
                    if (dijit.typematic._obj == _118) {
                        dijit.typematic.stop();
                    }
                }
            }), dojo.connect(node, "onkeyup", this, function(evt) {
                if (dijit.typematic._obj == _118) {
                    dijit.typematic.stop();
                }
            })];
        },
        addMouseListener: function(node, _11e, _11f, _120, _121, _122) {
            var dc = dojo.connect;
            return [dc(node, "mousedown", this, function(evt) {
                dojo.stopEvent(evt);
                dijit.typematic.trigger(evt, _11e, node, _11f, node, _120, _121, _122);
            }), dc(node, "mouseup", this, function(evt) {
                dojo.stopEvent(evt);
                dijit.typematic.stop();
            }), dc(node, "mouseout", this, function(evt) {
                dojo.stopEvent(evt);
                dijit.typematic.stop();
            }), dc(node, "mousemove", this, function(evt) {
                evt.preventDefault();
            }), dc(node, "dblclick", this, function(evt) {
                dojo.stopEvent(evt);
                if (dojo.isIE) {
                    dijit.typematic.trigger(evt, _11e, node, _11f, node, _120, _121, _122);
                    setTimeout(dojo.hitch(this, dijit.typematic.stop), 50);
                }
            })];
        },
        addListener: function(_123, _124, _125, _126, _127, _128, _129, _12a) {
            return this.addKeyListener(_124, _125, _126, _127, _128, _129, _12a).concat(this.addMouseListener(_123, _126, _127, _128, _129, _12a));
        }
    };
}
if (!dojo._hasResource["dijit._base.wai"]) {
    dojo._hasResource["dijit._base.wai"] = true;
    dojo.provide("dijit._base.wai");
    dijit.wai = {
        onload: function() {
            var div = dojo.create("div", {
                id: "a11yTestNode",
                style: {
                    cssText: "border: 1px solid;" + "border-color:red green;" + "position: absolute;" + "height: 5px;" + "top: -999px;" + "background-image: url(\"" + (dojo.config.blankGif || dojo.moduleUrl("dojo", "resources/blank.gif")) + "\");"
                }
            }, dojo.body());
            var cs = dojo.getComputedStyle(div);
            if (cs) {
                var _12b = cs.backgroundImage;
                var _12c = (cs.borderTopColor == cs.borderRightColor) || (_12b != null && (_12b == "none" || _12b == "url(invalid-url:)"));
                dojo[_12c ? "addClass" : "removeClass"](dojo.body(), "dijit_a11y");
                if (dojo.isIE) {
                    div.outerHTML = "";
                } else {
                    dojo.body().removeChild(div);
                }
            }
        }
    };
    if (dojo.isIE || dojo.isMoz) {
        dojo._loaders.unshift(dijit.wai.onload);
    }
    dojo.mixin(dijit, {
        hasWaiRole: function(elem, role) {
            var _12d = this.getWaiRole(elem);
            return role ? (_12d.indexOf(role) > -1) : (_12d.length > 0);
        },
        getWaiRole: function(elem) {
            return dojo.trim((dojo.attr(elem, "role") || "").replace("wairole:", ""));
        },
        setWaiRole: function(elem, role) {
            dojo.attr(elem, "role", role);
        },
        removeWaiRole: function(elem, role) {
            var _12e = dojo.attr(elem, "role");
            if (!_12e) {
                return;
            }
            if (role) {
                var t = dojo.trim((" " + _12e + " ").replace(" " + role + " ", " "));
                dojo.attr(elem, "role", t);
            } else {
                elem.removeAttribute("role");
            }
        },
        hasWaiState: function(elem, _12f) {
            return elem.hasAttribute ? elem.hasAttribute("aria-" + _12f) : !!elem.getAttribute("aria-" + _12f);
        },
        getWaiState: function(elem, _130) {
            return elem.getAttribute("aria-" + _130) || "";
        },
        setWaiState: function(elem, _131, _132) {
            elem.setAttribute("aria-" + _131, _132);
        },
        removeWaiState: function(elem, _133) {
            elem.removeAttribute("aria-" + _133);
        }
    });
}
if (!dojo._hasResource["dijit._base"]) {
    dojo._hasResource["dijit._base"] = true;
    dojo.provide("dijit._base");
}
if (!dojo._hasResource["dijit._Widget"]) {
    dojo._hasResource["dijit._Widget"] = true;
    dojo.provide("dijit._Widget");
    dojo.connect(dojo, "_connect", function(_134, _135) {
        if (_134 && dojo.isFunction(_134._onConnect)) {
            _134._onConnect(_135);
        }
    });
    dijit._connectOnUseEventHandler = function(_136) {}
    ;
    dijit._lastKeyDownNode = null;
    if (dojo.isIE) {
        (function() {
            var _137 = function(evt) {
                dijit._lastKeyDownNode = evt.srcElement;
            };
            dojo.doc.attachEvent("onkeydown", _137);
            dojo.addOnWindowUnload(function() {
                dojo.doc.detachEvent("onkeydown", _137);
            });
        })();
    } else {
        dojo.doc.addEventListener("keydown", function(evt) {
            dijit._lastKeyDownNode = evt.target;
        }, true);
    }
    (function() {
        dojo.declare("dijit._Widget", dijit._WidgetBase, {
            _deferredConnects: {
                onClick: "",
                onDblClick: "",
                onKeyDown: "",
                onKeyPress: "",
                onKeyUp: "",
                onMouseMove: "",
                onMouseDown: "",
                onMouseOut: "",
                onMouseOver: "",
                onMouseLeave: "",
                onMouseEnter: "",
                onMouseUp: ""
            },
            onClick: dijit._connectOnUseEventHandler,
            onDblClick: dijit._connectOnUseEventHandler,
            onKeyDown: dijit._connectOnUseEventHandler,
            onKeyPress: dijit._connectOnUseEventHandler,
            onKeyUp: dijit._connectOnUseEventHandler,
            onMouseDown: dijit._connectOnUseEventHandler,
            onMouseMove: dijit._connectOnUseEventHandler,
            onMouseOut: dijit._connectOnUseEventHandler,
            onMouseOver: dijit._connectOnUseEventHandler,
            onMouseLeave: dijit._connectOnUseEventHandler,
            onMouseEnter: dijit._connectOnUseEventHandler,
            onMouseUp: dijit._connectOnUseEventHandler,
            create: function(_138, _139) {
                this._deferredConnects = dojo.clone(this._deferredConnects);
                for (var attr in this.attributeMap) {
                    delete this._deferredConnects[attr];
                }
                for (attr in this._deferredConnects) {
                    if (this[attr] !== dijit._connectOnUseEventHandler) {
                        delete this._deferredConnects[attr];
                    }
                }
                this.inherited(arguments);
                if (this.domNode) {
                    for (attr in this.params) {
                        this._onConnect(attr);
                    }
                }
            },
            _onConnect: function(_13a) {
                if (_13a in this._deferredConnects) {
                    var _13b = this[this._deferredConnects[_13a] || "domNode"];
                    this.connect(_13b, _13a.toLowerCase(), _13a);
                    delete this._deferredConnects[_13a];
                }
            },
            focused: false,
            isFocusable: function() {
                return this.focus && (dojo.style(this.domNode, "display") != "none");
            },
            onFocus: function() {},
            onBlur: function() {},
            _onFocus: function(e) {
                this.onFocus();
            },
            _onBlur: function() {
                this.onBlur();
            },
            setAttribute: function(attr, _13c) {
                dojo.deprecated(this.declaredClass + "::setAttribute(attr, value) is deprecated. Use set() instead.", "", "2.0");
                this.set(attr, _13c);
            },
            attr: function(name, _13d) {
                if (dojo.config.isDebug) {
                    var _13e = arguments.callee._ach || (arguments.callee._ach = {})
                      , _13f = (arguments.callee.caller || "unknown caller").toString();
                    if (!_13e[_13f]) {
                        dojo.deprecated(this.declaredClass + "::attr() is deprecated. Use get() or set() instead, called from " + _13f, "", "2.0");
                        _13e[_13f] = true;
                    }
                }
                var args = arguments.length;
                if (args >= 2 || typeof name === "object") {
                    return this.set.apply(this, arguments);
                } else {
                    return this.get(name);
                }
            },
            nodesWithKeyClick: ["input", "button"],
            connect: function(obj, _140, _141) {
                var d = dojo
                  , dc = d._connect
                  , _142 = this.inherited(arguments, [obj, _140 == "ondijitclick" ? "onclick" : _140, _141]);
                if (_140 == "ondijitclick") {
                    if (d.indexOf(this.nodesWithKeyClick, obj.nodeName.toLowerCase()) == -1) {
                        var m = d.hitch(this, _141);
                        _142.push(dc(obj, "onkeydown", this, function(e) {
                            if ((e.keyCode == d.keys.ENTER || e.keyCode == d.keys.SPACE) && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
                                dijit._lastKeyDownNode = e.target;
                                if (!("openDropDown"in this && obj == this._buttonNode)) {
                                    e.preventDefault();
                                }
                            }
                        }), dc(obj, "onkeyup", this, function(e) {
                            if ((e.keyCode == d.keys.ENTER || e.keyCode == d.keys.SPACE) && e.target == dijit._lastKeyDownNode && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
                                dijit._lastKeyDownNode = null;
                                return m(e);
                            }
                        }));
                    }
                }
                return _142;
            },
            _onShow: function() {
                this.onShow();
            },
            onShow: function() {},
            onHide: function() {},
            onClose: function() {
                return true;
            }
        });
    })();
}
if (!dojo._hasResource["dojo.string"]) {
    dojo._hasResource["dojo.string"] = true;
    dojo.provide("dojo.string");
    dojo.getObject("string", true, dojo);
    dojo.string.rep = function(str, num) {
        if (num <= 0 || !str) {
            return "";
        }
        var buf = [];
        for (; ; ) {
            if (num & 1) {
                buf.push(str);
            }
            if (!(num >>= 1)) {
                break;
            }
            str += str;
        }
        return buf.join("");
    }
    ;
    dojo.string.pad = function(text, size, ch, end) {
        if (!ch) {
            ch = "0";
        }
        var out = String(text)
          , pad = dojo.string.rep(ch, Math.ceil((size - out.length) / ch.length));
        return end ? out + pad : pad + out;
    }
    ;
    dojo.string.substitute = function(_143, map, _144, _145) {
        _145 = _145 || dojo.global;
        _144 = _144 ? dojo.hitch(_145, _144) : function(v) {
            return v;
        }
        ;
        return _143.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(_146, key, _147) {
            var _148 = dojo.getObject(key, false, map);
            if (_147) {
                _148 = dojo.getObject(_147, false, _145).call(_145, _148, key);
            }
            return _144(_148, key).toString();
        });
    }
    ;
    dojo.string.trim = String.prototype.trim ? dojo.trim : function(str) {
        str = str.replace(/^\s+/, "");
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    }
    ;
}
if (!dojo._hasResource["dojo.date.stamp"]) {
    dojo._hasResource["dojo.date.stamp"] = true;
    dojo.provide("dojo.date.stamp");
    dojo.getObject("date.stamp", true, dojo);
    dojo.date.stamp.fromISOString = function(_149, _14a) {
        if (!dojo.date.stamp._isoRegExp) {
            dojo.date.stamp._isoRegExp = /^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/;
        }
        var _14b = dojo.date.stamp._isoRegExp.exec(_149)
          , _14c = null;
        if (_14b) {
            _14b.shift();
            if (_14b[1]) {
                _14b[1]--;
            }
            if (_14b[6]) {
                _14b[6] *= 1000;
            }
            if (_14a) {
                _14a = new Date(_14a);
                dojo.forEach(dojo.map(["FullYear", "Month", "Date", "Hours", "Minutes", "Seconds", "Milliseconds"], function(prop) {
                    return _14a["get" + prop]();
                }), function(_14d, _14e) {
                    _14b[_14e] = _14b[_14e] || _14d;
                });
            }
            _14c = new Date(_14b[0] || 1970,_14b[1] || 0,_14b[2] || 1,_14b[3] || 0,_14b[4] || 0,_14b[5] || 0,_14b[6] || 0);
            if (_14b[0] < 100) {
                _14c.setFullYear(_14b[0] || 1970);
            }
            var _14f = 0
              , _150 = _14b[7] && _14b[7].charAt(0);
            if (_150 != "Z") {
                _14f = ((_14b[8] || 0) * 60) + (Number(_14b[9]) || 0);
                if (_150 != "-") {
                    _14f *= -1;
                }
            }
            if (_150) {
                _14f -= _14c.getTimezoneOffset();
            }
            if (_14f) {
                _14c.setTime(_14c.getTime() + _14f * 60000);
            }
        }
        return _14c;
    }
    ;
    dojo.date.stamp.toISOString = function(_151, _152) {
        var _153 = function(n) {
            return (n < 10) ? "0" + n : n;
        };
        _152 = _152 || {};
        var _154 = []
          , _155 = _152.zulu ? "getUTC" : "get"
          , date = "";
        if (_152.selector != "time") {
            var year = _151[_155 + "FullYear"]();
            date = ["0000".substr((year + "").length) + year, _153(_151[_155 + "Month"]() + 1), _153(_151[_155 + "Date"]())].join("-");
        }
        _154.push(date);
        if (_152.selector != "date") {
            var time = [_153(_151[_155 + "Hours"]()), _153(_151[_155 + "Minutes"]()), _153(_151[_155 + "Seconds"]())].join(":");
            var _156 = _151[_155 + "Milliseconds"]();
            if (_152.milliseconds) {
                time += "." + (_156 < 100 ? "0" : "") + _153(_156);
            }
            if (_152.zulu) {
                time += "Z";
            } else {
                if (_152.selector != "time") {
                    var _157 = _151.getTimezoneOffset();
                    var _158 = Math.abs(_157);
                    time += (_157 > 0 ? "-" : "+") + _153(Math.floor(_158 / 60)) + ":" + _153(_158 % 60);
                }
            }
            _154.push(time);
        }
        return _154.join("T");
    }
    ;
}
if (!dojo._hasResource["dojo.parser"]) {
    dojo._hasResource["dojo.parser"] = true;
    dojo.provide("dojo.parser");
    new Date("X");
    dojo.parser = new function() {
        var d = dojo;
        function _159(_15a) {
            if (d.isString(_15a)) {
                return "string";
            }
            if (typeof _15a == "number") {
                return "number";
            }
            if (typeof _15a == "boolean") {
                return "boolean";
            }
            if (d.isFunction(_15a)) {
                return "function";
            }
            if (d.isArray(_15a)) {
                return "array";
            }
            if (_15a instanceof Date) {
                return "date";
            }
            if (_15a instanceof d._Url) {
                return "url";
            }
            return "object";
        }
        ;function _15b(_15c, type) {
            switch (type) {
            case "string":
                return _15c;
            case "number":
                return _15c.length ? Number(_15c) : NaN;
            case "boolean":
                return typeof _15c == "boolean" ? _15c : !(_15c.toLowerCase() == "false");
            case "function":
                if (d.isFunction(_15c)) {
                    _15c = _15c.toString();
                    _15c = d.trim(_15c.substring(_15c.indexOf("{") + 1, _15c.length - 1));
                }
                try {
                    if (_15c === "" || _15c.search(/[^\w\.]+/i) != -1) {
                        return new Function(_15c);
                    } else {
                        return d.getObject(_15c, false) || new Function(_15c);
                    }
                } catch (e) {
                    return new Function();
                }
            case "array":
                return _15c ? _15c.split(/\s*,\s*/) : [];
            case "date":
                switch (_15c) {
                case "":
                    return new Date("");
                case "now":
                    return new Date();
                default:
                    return d.date.stamp.fromISOString(_15c);
                }
            case "url":
                return d.baseUrl + _15c;
            default:
                return d.fromJson(_15c);
            }
        }
        ;var _15d = {}
          , _15e = {};
        d.connect(d, "extend", function() {
            _15e = {};
        });
        function _15f(cls, _160) {
            for (var name in cls) {
                if (name.charAt(0) == "_") {
                    continue;
                }
                if (name in _15d) {
                    continue;
                }
                _160[name] = _159(cls[name]);
            }
            return _160;
        }
        ;function _161(_162, _163) {
            var c = _15e[_162];
            if (!c) {
                var cls = d.getObject(_162)
                  , _164 = null;
                if (!cls) {
                    return null;
                }
                if (!_163) {
                    _164 = _15f(cls.prototype, {});
                }
                c = {
                    cls: cls,
                    params: _164
                };
            } else {
                if (!_163 && !c.params) {
                    c.params = _15f(c.cls.prototype, {});
                }
            }
            return c;
        }
        ;this._functionFromScript = function(_165, _166) {
            var _167 = "";
            var _168 = "";
            var _169 = (_165.getAttribute(_166 + "args") || _165.getAttribute("args"));
            if (_169) {
                d.forEach(_169.split(/\s*,\s*/), function(part, idx) {
                    _167 += "var " + part + " = arguments[" + idx + "]; ";
                });
            }
            var _16a = _165.getAttribute("with");
            if (_16a && _16a.length) {
                d.forEach(_16a.split(/\s*,\s*/), function(part) {
                    _167 += "with(" + part + "){";
                    _168 += "}";
                });
            }
            return new Function(_167 + _165.innerHTML + _168);
        }
        ;
        this.instantiate = function(_16b, _16c, args) {
            var _16d = []
              , _16c = _16c || {};
            args = args || {};
            var _16e = (args.scope || d._scopeName) + "Type"
              , _16f = "data-" + (args.scope || d._scopeName) + "-";
            d.forEach(_16b, function(obj) {
                if (!obj) {
                    return;
                }
                var node, type, _170, _171, _172, _173;
                if (obj.node) {
                    node = obj.node;
                    type = obj.type;
                    _173 = obj.fastpath;
                    _170 = obj.clsInfo || (type && _161(type, _173));
                    _171 = _170 && _170.cls;
                    _172 = obj.scripts;
                } else {
                    node = obj;
                    type = _16e in _16c ? _16c[_16e] : node.getAttribute(_16e);
                    _170 = type && _161(type);
                    _171 = _170 && _170.cls;
                    _172 = (_171 && (_171._noScript || _171.prototype._noScript) ? [] : d.query("> script[type^='dojo/']", node));
                }
                if (!_170) {
                    throw new Error("Could not load class '" + type);
                }
                var _174 = {};
                if (args.defaults) {
                    d._mixin(_174, args.defaults);
                }
                if (obj.inherited) {
                    d._mixin(_174, obj.inherited);
                }
                if (_173) {
                    var _175 = node.getAttribute(_16f + "props");
                    if (_175 && _175.length) {
                        try {
                            _175 = d.fromJson.call(args.propsThis, "{" + _175 + "}");
                            d._mixin(_174, _175);
                        } catch (e) {
                            throw new Error(e.toString() + " in data-dojo-props='" + _175 + "'");
                        }
                    }
                    var _176 = node.getAttribute(_16f + "attach-point");
                    if (_176) {
                        _174.dojoAttachPoint = _176;
                    }
                    var _177 = node.getAttribute(_16f + "attach-event");
                    if (_177) {
                        _174.dojoAttachEvent = _177;
                    }
                    dojo.mixin(_174, _16c);
                } else {
                    var _178 = node.attributes;
                    for (var name in _170.params) {
                        var item = name in _16c ? {
                            value: _16c[name],
                            specified: true
                        } : _178.getNamedItem(name);
                        if (!item || (!item.specified && (!dojo.isIE || name.toLowerCase() != "value"))) {
                            continue;
                        }
                        var _179 = item.value;
                        switch (name) {
                        case "class":
                            _179 = "className"in _16c ? _16c.className : node.className;
                            break;
                        case "style":
                            _179 = "style"in _16c ? _16c.style : (node.style && node.style.cssText);
                        }
                        var _17a = _170.params[name];
                        if (typeof _179 == "string") {
                            _174[name] = _15b(_179, _17a);
                        } else {
                            _174[name] = _179;
                        }
                    }
                }
                var _17b = []
                  , _17c = [];
                d.forEach(_172, function(_17d) {
                    node.removeChild(_17d);
                    var _17e = (_17d.getAttribute(_16f + "event") || _17d.getAttribute("event"))
                      , type = _17d.getAttribute("type")
                      , nf = d.parser._functionFromScript(_17d, _16f);
                    if (_17e) {
                        if (type == "dojo/connect") {
                            _17b.push({
                                event: _17e,
                                func: nf
                            });
                        } else {
                            _174[_17e] = nf;
                        }
                    } else {
                        _17c.push(nf);
                    }
                });
                var _17f = _171.markupFactory || _171.prototype && _171.prototype.markupFactory;
                var _180 = _17f ? _17f(_174, node, _171) : new _171(_174,node);
                _16d.push(_180);
                var _181 = (node.getAttribute(_16f + "id") || node.getAttribute("jsId"));
                if (_181) {
                    d.setObject(_181, _180);
                }
                d.forEach(_17b, function(_182) {
                    d.connect(_180, _182.event, null, _182.func);
                });
                d.forEach(_17c, function(func) {
                    func.call(_180);
                });
            });
            if (!_16c._started) {
                d.forEach(_16d, function(_183) {
                    if (!args.noStart && _183 && dojo.isFunction(_183.startup) && !_183._started && (!_183.getParent || !_183.getParent())) {
                        _183.startup();
                    }
                });
            }
            return _16d;
        }
        ;
        this.parse = function(_184, args) {
            var root;
            if (!args && _184 && _184.rootNode) {
                args = _184;
                root = args.rootNode;
            } else {
                root = _184;
            }
            args = args || {};
            var _185 = (args.scope || d._scopeName) + "Type"
              , _186 = "data-" + (args.scope || d._scopeName) + "-";
            function scan(_187, list) {
                var _188 = dojo.clone(_187.inherited);
                dojo.forEach(["dir", "lang"], function(name) {
                    var val = _187.node.getAttribute(name);
                    if (val) {
                        _188[name] = val;
                    }
                });
                var _189 = _187.clsInfo && !_187.clsInfo.cls.prototype._noScript ? _187.scripts : null;
                var _18a = (!_187.clsInfo || !_187.clsInfo.cls.prototype.stopParser) || (args && args.template);
                for (var _18b = _187.node.firstChild; _18b; _18b = _18b.nextSibling) {
                    if (_18b.nodeType == 1) {
                        var type, _18c = _18a && _18b.getAttribute(_186 + "type");
                        if (_18c) {
                            type = _18c;
                        } else {
                            type = _18a && _18b.getAttribute(_185);
                        }
                        var _18d = _18c == type;
                        if (type) {
                            var _18e = {
                                "type": type,
                                fastpath: _18d,
                                clsInfo: _161(type, _18d),
                                node: _18b,
                                scripts: [],
                                inherited: _188
                            };
                            list.push(_18e);
                            scan(_18e, list);
                        } else {
                            if (_189 && _18b.nodeName.toLowerCase() == "script") {
                                type = _18b.getAttribute("type");
                                if (type && /^dojo\/\w/i.test(type)) {
                                    _189.push(_18b);
                                }
                            } else {
                                if (_18a) {
                                    scan({
                                        node: _18b,
                                        inherited: _188
                                    }, list);
                                }
                            }
                        }
                    }
                }
            }
            ;var list = [];
            scan({
                node: root ? dojo.byId(root) : dojo.body(),
                inherited: (args && args.inherited) || {
                    dir: dojo._isBodyLtr() ? "ltr" : "rtl"
                }
            }, list);
            var _18f = args && args.template ? {
                template: true
            } : null;
            return this.instantiate(list, _18f, args);
        }
        ;
    }
    ();
    (function() {
        var _190 = function() {
            if (dojo.config.parseOnLoad) {
                dojo.parser.parse();
            }
        };
        if (dojo.getObject("dijit.wai.onload") === dojo._loaders[0]) {
            dojo._loaders.splice(1, 0, _190);
        } else {
            dojo._loaders.unshift(_190);
        }
    })();
}
if (!dojo._hasResource["dojo.cache"]) {
    dojo._hasResource["dojo.cache"] = true;
    dojo.provide("dojo.cache");
    var cache = {};
    dojo.cache = function(_191, url, _192) {
        if (typeof _191 == "string") {
            var _193 = dojo.moduleUrl(_191, url);
        } else {
            _193 = _191;
            _192 = url;
        }
        var key = _193.toString();
        var val = _192;
        if (_192 != undefined && !dojo.isString(_192)) {
            val = ("value"in _192 ? _192.value : undefined);
        }
        var _194 = _192 && _192.sanitize ? true : false;
        if (typeof val == "string") {
            val = cache[key] = _194 ? dojo.cache._sanitize(val) : val;
        } else {
            if (val === null) {
                delete cache[key];
            } else {
                if (!(key in cache)) {
                    val = dojo._getText(key);
                    cache[key] = _194 ? dojo.cache._sanitize(val) : val;
                }
                val = cache[key];
            }
        }
        return val;
    }
    ;
    dojo.cache._sanitize = function(val) {
        if (val) {
            val = val.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, "");
            var _195 = val.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
            if (_195) {
                val = _195[1];
            }
        } else {
            val = "";
        }
        return val;
    }
    ;
}
if (!dojo._hasResource["dijit._Templated"]) {
    dojo._hasResource["dijit._Templated"] = true;
    dojo.provide("dijit._Templated");
    dojo.declare("dijit._Templated", null, {
        templateString: null,
        templatePath: null,
        widgetsInTemplate: false,
        _skipNodeCache: false,
        _earlyTemplatedStartup: false,
        constructor: function() {
            this._attachPoints = [];
            this._attachEvents = [];
        },
        _stringRepl: function(tmpl) {
            var _196 = this.declaredClass
              , _197 = this;
            return dojo.string.substitute(tmpl, this, function(_198, key) {
                if (key.charAt(0) == "!") {
                    _198 = dojo.getObject(key.substr(1), false, _197);
                }
                if (typeof _198 == "undefined") {
                    throw new Error(_196 + " template:" + key);
                }
                if (_198 == null) {
                    return "";
                }
                return key.charAt(0) == "!" ? _198 : _198.toString().replace(/"/g, "&quot;");
            }, this);
        },
        buildRendering: function() {
            var _199 = dijit._Templated.getCachedTemplate(this.templatePath, this.templateString, this._skipNodeCache);
            var node;
            if (dojo.isString(_199)) {
                node = dojo._toDom(this._stringRepl(_199));
                if (node.nodeType != 1) {
                    throw new Error("Invalid template: " + _199);
                }
            } else {
                node = _199.cloneNode(true);
            }
            this.domNode = node;
            this.inherited(arguments);
            this._attachTemplateNodes(node);
            if (this.widgetsInTemplate) {
                var cw = (this._startupWidgets = dojo.parser.parse(node, {
                    noStart: !this._earlyTemplatedStartup,
                    template: true,
                    inherited: {
                        dir: this.dir,
                        lang: this.lang
                    },
                    propsThis: this,
                    scope: "dojo"
                }));
                this._supportingWidgets = dijit.findWidgets(node);
                this._attachTemplateNodes(cw, function(n, p) {
                    return n[p];
                });
            }
            this._fillContent(this.srcNodeRef);
        },
        _fillContent: function(_19a) {
            var dest = this.containerNode;
            if (_19a && dest) {
                while (_19a.hasChildNodes()) {
                    dest.appendChild(_19a.firstChild);
                }
            }
        },
        _attachTemplateNodes: function(_19b, _19c) {
            _19c = _19c || function(n, p) {
                return n.getAttribute(p);
            }
            ;
            var _19d = dojo.isArray(_19b) ? _19b : (_19b.all || _19b.getElementsByTagName("*"));
            var x = dojo.isArray(_19b) ? 0 : -1;
            for (; x < _19d.length; x++) {
                var _19e = (x == -1) ? _19b : _19d[x];
                if (this.widgetsInTemplate && (_19c(_19e, "dojoType") || _19c(_19e, "data-dojo-type"))) {
                    continue;
                }
                var _19f = _19c(_19e, "dojoAttachPoint") || _19c(_19e, "data-dojo-attach-point");
                if (_19f) {
                    var _1a0, _1a1 = _19f.split(/\s*,\s*/);
                    while ((_1a0 = _1a1.shift()) ) {
                        if (dojo.isArray(this[_1a0])) {
                            this[_1a0].push(_19e);
                        } else {
                            this[_1a0] = _19e;
                        }
                        this._attachPoints.push(_1a0);
                    }
                }
                var _1a2 = _19c(_19e, "dojoAttachEvent") || _19c(_19e, "data-dojo-attach-event");
                if (_1a2) {
                    var _1a3, _1a4 = _1a2.split(/\s*,\s*/);
                    var trim = dojo.trim;
                    while ((_1a3 = _1a4.shift()) ) {
                        if (_1a3) {
                            var _1a5 = null;
                            if (_1a3.indexOf(":") != -1) {
                                var _1a6 = _1a3.split(":");
                                _1a3 = trim(_1a6[0]);
                                _1a5 = trim(_1a6[1]);
                            } else {
                                _1a3 = trim(_1a3);
                            }
                            if (!_1a5) {
                                _1a5 = _1a3;
                            }
                            this._attachEvents.push(this.connect(_19e, _1a3, _1a5));
                        }
                    }
                }
                var role = _19c(_19e, "waiRole");
                if (role) {
                    dijit.setWaiRole(_19e, role);
                }
                var _1a7 = _19c(_19e, "waiState");
                if (_1a7) {
                    dojo.forEach(_1a7.split(/\s*,\s*/), function(_1a8) {
                        if (_1a8.indexOf("-") != -1) {
                            var pair = _1a8.split("-");
                            dijit.setWaiState(_19e, pair[0], pair[1]);
                        }
                    });
                }
            }
        },
        startup: function() {
            dojo.forEach(this._startupWidgets, function(w) {
                if (w && !w._started && w.startup) {
                    w.startup();
                }
            });
            this.inherited(arguments);
        },
        destroyRendering: function() {
            dojo.forEach(this._attachPoints, function(_1a9) {
                delete this[_1a9];
            }, this);
            this._attachPoints = [];
            dojo.forEach(this._attachEvents, this.disconnect, this);
            this._attachEvents = [];
            this.inherited(arguments);
        }
    });
    dijit._Templated._templateCache = {};
    dijit._Templated.getCachedTemplate = function(_1aa, _1ab, _1ac) {
        var _1ad = dijit._Templated._templateCache;
        var key = _1ab || _1aa;
        var _1ae = _1ad[key];
        if (_1ae) {
            try {
                if (!_1ae.ownerDocument || _1ae.ownerDocument == dojo.doc) {
                    return _1ae;
                }
            } catch (e) {}
            dojo.destroy(_1ae);
        }
        if (!_1ab) {
            _1ab = dojo.cache(_1aa, {
                sanitize: true
            });
        }
        _1ab = dojo.string.trim(_1ab);
        if (_1ac || _1ab.match(/\$\{([^\}]+)\}/g)) {
            return ( _1ad[key] = _1ab) ;
        } else {
            var node = dojo._toDom(_1ab);
            if (node.nodeType != 1) {
                throw new Error("Invalid template: " + _1ab);
            }
            return ( _1ad[key] = node) ;
        }
    }
    ;
    if (dojo.isIE) {
        dojo.addOnWindowUnload(function() {
            var _1af = dijit._Templated._templateCache;
            for (var key in _1af) {
                var _1b0 = _1af[key];
                if (typeof _1b0 == "object") {
                    dojo.destroy(_1b0);
                }
                delete _1af[key];
            }
        });
    }
    dojo.extend(dijit._Widget, {
        dojoAttachEvent: "",
        dojoAttachPoint: "",
        waiRole: "",
        waiState: ""
    });
}
if (!dojo._hasResource["dijit._CssStateMixin"]) {
    dojo._hasResource["dijit._CssStateMixin"] = true;
    dojo.provide("dijit._CssStateMixin");
    dojo.declare("dijit._CssStateMixin", [], {
        cssStateNodes: {},
        hovering: false,
        active: false,
        _applyAttributes: function() {
            this.inherited(arguments);
            dojo.forEach(["onmouseenter", "onmouseleave", "onmousedown"], function(e) {
                this.connect(this.domNode, e, "_cssMouseEvent");
            }, this);
            dojo.forEach(["disabled", "readOnly", "checked", "selected", "focused", "state", "hovering", "active"], function(attr) {
                this.watch(attr, dojo.hitch(this, "_setStateClass"));
            }, this);
            for (var ap in this.cssStateNodes) {
                this._trackMouseState(this[ap], this.cssStateNodes[ap]);
            }
            this._setStateClass();
        },
        _cssMouseEvent: function(_1b1) {
            if (!this.disabled) {
                switch (_1b1.type) {
                case "mouseenter":
                case "mouseover":
                    this._set("hovering", true);
                    this._set("active", this._mouseDown);
                    break;
                case "mouseleave":
                case "mouseout":
                    this._set("hovering", false);
                    this._set("active", false);
                    break;
                case "mousedown":
                    this._set("active", true);
                    this._mouseDown = true;
                    var _1b2 = this.connect(dojo.body(), "onmouseup", function() {
                        this._mouseDown = false;
                        this._set("active", false);
                        this.disconnect(_1b2);
                    });
                    break;
                }
            }
        },
        _setStateClass: function() {
            var _1b3 = this.baseClass.split(" ");
            function _1b4(_1b5) {
                _1b3 = _1b3.concat(dojo.map(_1b3, function(c) {
                    return c + _1b5;
                }), "dijit" + _1b5);
            }
            ;if (!this.isLeftToRight()) {
                _1b4("Rtl");
            }
            if (this.checked) {
                _1b4("Checked");
            }
            if (this.state) {
                _1b4(this.state);
            }
            if (this.selected) {
                _1b4("Selected");
            }
            if (this.disabled) {
                _1b4("Disabled");
            } else {
                if (this.readOnly) {
                    _1b4("ReadOnly");
                } else {
                    if (this.active) {
                        _1b4("Active");
                    } else {
                        if (this.hovering) {
                            _1b4("Hover");
                        }
                    }
                }
            }
            if (this._focused) {
                _1b4("Focused");
            }
            var tn = this.stateNode || this.domNode
              , _1b6 = {};
            dojo.forEach(tn.className.split(" "), function(c) {
                _1b6[c] = true;
            });
            if ("_stateClasses"in this) {
                dojo.forEach(this._stateClasses, function(c) {
                    delete _1b6[c];
                });
            }
            dojo.forEach(_1b3, function(c) {
                _1b6[c] = true;
            });
            var _1b7 = [];
            for (var c in _1b6) {
                _1b7.push(c);
            }
            tn.className = _1b7.join(" ");
            this._stateClasses = _1b3;
        },
        _trackMouseState: function(node, _1b8) {
            var _1b9 = false
              , _1ba = false
              , _1bb = false;
            var self = this
              , cn = dojo.hitch(this, "connect", node);
            function _1bc() {
                var _1bd = ("disabled"in self && self.disabled) || ("readonly"in self && self.readonly);
                dojo.toggleClass(node, _1b8 + "Hover", _1b9 && !_1ba && !_1bd);
                dojo.toggleClass(node, _1b8 + "Active", _1ba && !_1bd);
                dojo.toggleClass(node, _1b8 + "Focused", _1bb && !_1bd);
            }
            ;cn("onmouseenter", function() {
                _1b9 = true;
                _1bc();
            });
            cn("onmouseleave", function() {
                _1b9 = false;
                _1ba = false;
                _1bc();
            });
            cn("onmousedown", function() {
                _1ba = true;
                _1bc();
            });
            cn("onmouseup", function() {
                _1ba = false;
                _1bc();
            });
            cn("onfocus", function() {
                _1bb = true;
                _1bc();
            });
            cn("onblur", function() {
                _1bb = false;
                _1bc();
            });
            this.watch("disabled", _1bc);
            this.watch("readOnly", _1bc);
        }
    });
}
if (!dojo._hasResource["dijit._Contained"]) {
    dojo._hasResource["dijit._Contained"] = true;
    dojo.provide("dijit._Contained");
    dojo.declare("dijit._Contained", null, {
        getParent: function() {
            var _1be = dijit.getEnclosingWidget(this.domNode.parentNode);
            return _1be && _1be.isContainer ? _1be : null;
        },
        _getSibling: function(_1bf) {
            var node = this.domNode;
            do {
                node = node[_1bf + "Sibling"];
            } while (node && node.nodeType != 1);return node && dijit.byNode(node);
        },
        getPreviousSibling: function() {
            return this._getSibling("previous");
        },
        getNextSibling: function() {
            return this._getSibling("next");
        },
        getIndexInParent: function() {
            var p = this.getParent();
            if (!p || !p.getIndexOfChild) {
                return -1;
            }
            return p.getIndexOfChild(this);
        }
    });
}
if (!dojo._hasResource["dijit.layout._LayoutWidget"]) {
    dojo._hasResource["dijit.layout._LayoutWidget"] = true;
    dojo.provide("dijit.layout._LayoutWidget");
    dojo.declare("dijit.layout._LayoutWidget", [dijit._Widget, dijit._Container, dijit._Contained], {
        baseClass: "dijitLayoutContainer",
        isLayoutContainer: true,
        buildRendering: function() {
            this.inherited(arguments);
            dojo.addClass(this.domNode, "dijitContainer");
        },
        startup: function() {
            if (this._started) {
                return;
            }
            this.inherited(arguments);
            var _1c0 = this.getParent && this.getParent();
            if (!(_1c0 && _1c0.isLayoutContainer)) {
                this.resize();
                this.connect(dojo.isIE ? this.domNode : dojo.global, "onresize", function() {
                    this.resize();
                });
            }
        },
        resize: function(_1c1, _1c2) {
            var node = this.domNode;
            if (_1c1) {
                dojo.marginBox(node, _1c1);
                if (_1c1.t) {
                    node.style.top = _1c1.t + "px";
                }
                if (_1c1.l) {
                    node.style.left = _1c1.l + "px";
                }
            }
            var mb = _1c2 || {};
            dojo.mixin(mb, _1c1 || {});
            if (!("h"in mb) || !("w"in mb)) {
                mb = dojo.mixin(dojo.marginBox(node), mb);
            }
            var cs = dojo.getComputedStyle(node);
            var me = dojo._getMarginExtents(node, cs);
            var be = dojo._getBorderExtents(node, cs);
            var bb = (this._borderBox = {
                w: mb.w - (me.w + be.w),
                h: mb.h - (me.h + be.h)
            });
            var pe = dojo._getPadExtents(node, cs);
            this._contentBox = {
                l: dojo._toPixelValue(node, cs.paddingLeft),
                t: dojo._toPixelValue(node, cs.paddingTop),
                w: bb.w - pe.w,
                h: bb.h - pe.h
            };
            this.layout();
        },
        layout: function() {},
        _setupChild: function(_1c3) {
            var cls = this.baseClass + "-child " + (_1c3.baseClass ? this.baseClass + "-" + _1c3.baseClass : "");
            dojo.addClass(_1c3.domNode, cls);
        },
        addChild: function(_1c4, _1c5) {
            this.inherited(arguments);
            if (this._started) {
                this._setupChild(_1c4);
            }
        },
        removeChild: function(_1c6) {
            var cls = this.baseClass + "-child" + (_1c6.baseClass ? " " + this.baseClass + "-" + _1c6.baseClass : "");
            dojo.removeClass(_1c6.domNode, cls);
            this.inherited(arguments);
        }
    });
    dijit.layout.marginBox2contentBox = function(node, mb) {
        var cs = dojo.getComputedStyle(node);
        var me = dojo._getMarginExtents(node, cs);
        var pb = dojo._getPadBorderExtents(node, cs);
        return {
            l: dojo._toPixelValue(node, cs.paddingLeft),
            t: dojo._toPixelValue(node, cs.paddingTop),
            w: mb.w - (me.w + pb.w),
            h: mb.h - (me.h + pb.h)
        };
    }
    ;
    (function() {
        var _1c7 = function(word) {
            return word.substring(0, 1).toUpperCase() + word.substring(1);
        };
        var size = function(_1c8, dim) {
            _1c8.resize ? _1c8.resize(dim) : dojo.marginBox(_1c8.domNode, dim);
            dojo.mixin(_1c8, dojo.marginBox(_1c8.domNode));
            dojo.mixin(_1c8, dim);
        };
        dijit.layout.layoutChildren = function(_1c9, dim, _1ca, _1cb, _1cc) {
            dim = dojo.mixin({}, dim);
            dojo.addClass(_1c9, "dijitLayoutContainer");
            _1ca = dojo.filter(_1ca, function(item) {
                return item.region != "center" && item.layoutAlign != "client";
            }).concat(dojo.filter(_1ca, function(item) {
                return item.region == "center" || item.layoutAlign == "client";
            }));
            dojo.forEach(_1ca, function(_1cd) {
                var elm = _1cd.domNode
                  , pos = (_1cd.region || _1cd.layoutAlign);
                var _1ce = elm.style;
                _1ce.left = dim.l + "px";
                _1ce.top = dim.t + "px";
                _1ce.bottom = _1ce.right = "auto";
                dojo.addClass(elm, "dijitAlign" + _1c7(pos));
                var _1cf = {};
                if (_1cb && _1cb == _1cd.id) {
                    _1cf[_1cd.region == "top" || _1cd.region == "bottom" ? "h" : "w"] = _1cc;
                }
                if (pos == "top" || pos == "bottom") {
                    _1cf.w = dim.w;
                    size(_1cd, _1cf);
                    dim.h -= _1cd.h;
                    if (pos == "top") {
                        dim.t += _1cd.h;
                    } else {
                        _1ce.top = dim.t + dim.h + "px";
                    }
                } else {
                    if (pos == "left" || pos == "right") {
                        _1cf.h = dim.h;
                        size(_1cd, _1cf);
                        dim.w -= _1cd.w;
                        if (pos == "left") {
                            dim.l += _1cd.w;
                        } else {
                            _1ce.left = dim.l + dim.w + "px";
                        }
                    } else {
                        if (pos == "client" || pos == "center") {
                            size(_1cd, dim);
                        }
                    }
                }
            });
        }
        ;
    })();
}
if (!dojo._hasResource["dojo.regexp"]) {
    dojo._hasResource["dojo.regexp"] = true;
    dojo.provide("dojo.regexp");
    dojo.getObject("regexp", true, dojo);
    dojo.regexp.escapeString = function(str, _1d0) {
        return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function(ch) {
            if (_1d0 && _1d0.indexOf(ch) != -1) {
                return ch;
            }
            return "\\" + ch;
        });
    }
    ;
    dojo.regexp.buildGroupRE = function(arr, re, _1d1) {
        if (!(arr instanceof Array)) {
            return re(arr);
        }
        var b = [];
        for (var i = 0; i < arr.length; i++) {
            b.push(re(arr[i]));
        }
        return dojo.regexp.group(b.join("|"), _1d1);
    }
    ;
    dojo.regexp.group = function(_1d2, _1d3) {
        return "(" + (_1d3 ? "?:" : "") + _1d2 + ")";
    }
    ;
}
if (!dojo._hasResource["dojo.cookie"]) {
    dojo._hasResource["dojo.cookie"] = true;
    dojo.provide("dojo.cookie");
    dojo.cookie = function(name, _1d4, _1d5) {
        var c = document.cookie;
        if (arguments.length == 1) {
            var _1d6 = c.match(new RegExp("(?:^|; )" + dojo.regexp.escapeString(name) + "=([^;]*)"));
            return _1d6 ? decodeURIComponent(_1d6[1]) : undefined;
        } else {
            _1d5 = _1d5 || {};
            var exp = _1d5.expires;
            if (typeof exp == "number") {
                var d = new Date();
                d.setTime(d.getTime() + exp * 24 * 60 * 60 * 1000);
                exp = _1d5.expires = d;
            }
            if (exp && exp.toUTCString) {
                _1d5.expires = exp.toUTCString();
            }
            _1d4 = encodeURIComponent(_1d4);
            var _1d7 = name + "=" + _1d4, _1d8;
            for (_1d8 in _1d5) {
                _1d7 += "; " + _1d8;
                var _1d9 = _1d5[_1d8];
                if (_1d9 !== true) {
                    _1d7 += "=" + _1d9;
                }
            }
            document.cookie = _1d7;
        }
    }
    ;
    dojo.cookie.isSupported = function() {
        if (!("cookieEnabled"in navigator)) {
            this("__djCookieTest__", "CookiesAllowed");
            navigator.cookieEnabled = this("__djCookieTest__") == "CookiesAllowed";
            if (navigator.cookieEnabled) {
                this("__djCookieTest__", "", {
                    expires: -1
                });
            }
        }
        return navigator.cookieEnabled;
    }
    ;
}
if (!dojo._hasResource["dijit.form._FormWidget"]) {
    dojo._hasResource["dijit.form._FormWidget"] = true;
    dojo.provide("dijit.form._FormWidget");
    dojo.declare("dijit.form._FormWidget", [dijit._Widget, dijit._Templated, dijit._CssStateMixin], {
        name: "",
        alt: "",
        value: "",
        type: "text",
        tabIndex: "0",
        disabled: false,
        intermediateChanges: false,
        scrollOnFocus: true,
        attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
            value: "focusNode",
            id: "focusNode",
            tabIndex: "focusNode",
            alt: "focusNode",
            title: "focusNode"
        }),
        postMixInProperties: function() {
            this.nameAttrSetting = this.name ? ("name=\"" + this.name.replace(/'/g, "&quot;") + "\"") : "";
            this.inherited(arguments);
        },
        postCreate: function() {
            this.inherited(arguments);
            this.connect(this.domNode, "onmousedown", "_onMouseDown");
        },
        _setDisabledAttr: function(_1da) {
            this._set("disabled", _1da);
            dojo.attr(this.focusNode, "disabled", _1da);
            if (this.valueNode) {
                dojo.attr(this.valueNode, "disabled", _1da);
            }
            dijit.setWaiState(this.focusNode, "disabled", _1da);
            if (_1da) {
                this._set("hovering", false);
                this._set("active", false);
                var _1db = "tabIndex"in this.attributeMap ? this.attributeMap.tabIndex : "focusNode";
                dojo.forEach(dojo.isArray(_1db) ? _1db : [_1db], function(_1dc) {
                    var node = this[_1dc];
                    if (dojo.isWebKit || dijit.hasDefaultTabStop(node)) {
                        node.setAttribute("tabIndex", "-1");
                    } else {
                        node.removeAttribute("tabIndex");
                    }
                }, this);
            } else {
                if (this.tabIndex != "") {
                    this.focusNode.setAttribute("tabIndex", this.tabIndex);
                }
            }
        },
        setDisabled: function(_1dd) {
            dojo.deprecated("setDisabled(" + _1dd + ") is deprecated. Use set('disabled'," + _1dd + ") instead.", "", "2.0");
            this.set("disabled", _1dd);
        },
        _onFocus: function(e) {
            if (this.scrollOnFocus) {
                dojo.window.scrollIntoView(this.domNode);
            }
            this.inherited(arguments);
        },
        isFocusable: function() {
            return !this.disabled && this.focusNode && (dojo.style(this.domNode, "display") != "none");
        },
        focus: function() {
            if (!this.disabled) {
                dijit.focus(this.focusNode);
            }
        },
        compare: function(val1, val2) {
            if (typeof val1 == "number" && typeof val2 == "number") {
                return (isNaN(val1) && isNaN(val2)) ? 0 : val1 - val2;
            } else {
                if (val1 > val2) {
                    return 1;
                } else {
                    if (val1 < val2) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            }
        },
        onChange: function(_1de) {},
        _onChangeActive: false,
        _handleOnChange: function(_1df, _1e0) {
            if (this._lastValueReported == undefined && (_1e0 === null || !this._onChangeActive)) {
                this._resetValue = this._lastValueReported = _1df;
            }
            this._pendingOnChange = this._pendingOnChange || (typeof _1df != typeof this._lastValueReported) || (this.compare(_1df, this._lastValueReported) != 0);
            if ((this.intermediateChanges || _1e0 || _1e0 === undefined) && this._pendingOnChange) {
                this._lastValueReported = _1df;
                this._pendingOnChange = false;
                if (this._onChangeActive) {
                    if (this._onChangeHandle) {
                        clearTimeout(this._onChangeHandle);
                    }
                    this._onChangeHandle = setTimeout(dojo.hitch(this, function() {
                        this._onChangeHandle = null;
                        this.onChange(_1df);
                    }), 0);
                }
            }
        },
        create: function() {
            this.inherited(arguments);
            this._onChangeActive = true;
        },
        destroy: function() {
            if (this._onChangeHandle) {
                clearTimeout(this._onChangeHandle);
                this.onChange(this._lastValueReported);
            }
            this.inherited(arguments);
        },
        setValue: function(_1e1) {
            dojo.deprecated("dijit.form._FormWidget:setValue(" + _1e1 + ") is deprecated.  Use set('value'," + _1e1 + ") instead.", "", "2.0");
            this.set("value", _1e1);
        },
        getValue: function() {
            dojo.deprecated(this.declaredClass + "::getValue() is deprecated. Use get('value') instead.", "", "2.0");
            return this.get("value");
        },
        _onMouseDown: function(e) {
            if (!e.ctrlKey && dojo.mouseButtons.isLeft(e) && this.isFocusable()) {
                var _1e2 = this.connect(dojo.body(), "onmouseup", function() {
                    if (this.isFocusable()) {
                        this.focus();
                    }
                    this.disconnect(_1e2);
                });
            }
        }
    });
    dojo.declare("dijit.form._FormValueWidget", dijit.form._FormWidget, {
        readOnly: false,
        attributeMap: dojo.delegate(dijit.form._FormWidget.prototype.attributeMap, {
            value: "",
            readOnly: "focusNode"
        }),
        _setReadOnlyAttr: function(_1e3) {
            dojo.attr(this.focusNode, "readOnly", _1e3);
            dijit.setWaiState(this.focusNode, "readonly", _1e3);
            this._set("readOnly", _1e3);
        },
        postCreate: function() {
            this.inherited(arguments);
            if (dojo.isIE) {
                this.connect(this.focusNode || this.domNode, "onkeydown", this._onKeyDown);
            }
            if (this._resetValue === undefined) {
                this._lastValueReported = this._resetValue = this.value;
            }
        },
        _setValueAttr: function(_1e4, _1e5) {
            this._handleOnChange(_1e4, _1e5);
        },
        _handleOnChange: function(_1e6, _1e7) {
            this._set("value", _1e6);
            this.inherited(arguments);
        },
        undo: function() {
            this._setValueAttr(this._lastValueReported, false);
        },
        reset: function() {
            this._hasBeenBlurred = false;
            this._setValueAttr(this._resetValue, true);
        },
        _onKeyDown: function(e) {
            if (e.keyCode == dojo.keys.ESCAPE && !(e.ctrlKey || e.altKey || e.metaKey)) {
                var te;
                if (dojo.isIE) {
                    e.preventDefault();
                    te = document.createEventObject();
                    te.keyCode = dojo.keys.ESCAPE;
                    te.shiftKey = e.shiftKey;
                    e.srcElement.fireEvent("onkeypress", te);
                }
            }
        },
        _layoutHackIE7: function() {
            if (dojo.isIE == 7) {
                var _1e8 = this.domNode;
                var _1e9 = _1e8.parentNode;
                var _1ea = _1e8.firstChild || _1e8;
                var _1eb = _1ea.style.filter;
                var _1ec = this;
                while (_1e9 && _1e9.clientHeight == 0) {
                    (function ping() {
                        var _1ed = _1ec.connect(_1e9, "onscroll", function(e) {
                            _1ec.disconnect(_1ed);
                            _1ea.style.filter = (new Date()).getMilliseconds();
                            setTimeout(function() {
                                _1ea.style.filter = _1eb;
                            }, 0);
                        });
                    })();
                    _1e9 = _1e9.parentNode;
                }
            }
        }
    });
}
if (!dojo._hasResource["dijit._HasDropDown"]) {
    dojo._hasResource["dijit._HasDropDown"] = true;
    dojo.provide("dijit._HasDropDown");
    dojo.declare("dijit._HasDropDown", null, {
        _buttonNode: null,
        _arrowWrapperNode: null,
        _popupStateNode: null,
        _aroundNode: null,
        dropDown: null,
        autoWidth: true,
        forceWidth: false,
        maxHeight: 0,
        dropDownPosition: ["below", "above"],
        _stopClickEvents: true,
        _onDropDownMouseDown: function(e) {
            if (this.disabled || this.readOnly) {
                return;
            }
            this._docHandler = this.connect(dojo.doc, "onmouseup", "_onDropDownMouseUp");
            this.toggleDropDown();
        },
        _onDropDownMouseUp: function(e) {
            if (e && this._docHandler) {
                this.disconnect(this._docHandler);
            }
            var _1ee = this.dropDown
              , _1ef = false;
            if (e && this._opened) {
                var c = dojo.position(this._buttonNode, true);
                if (!(e.pageX >= c.x && e.pageX <= c.x + c.w) || !(e.pageY >= c.y && e.pageY <= c.y + c.h)) {
                    var t = e.target;
                    while (t && !_1ef) {
                        if (dojo.hasClass(t, "dijitPopup")) {
                            _1ef = true;
                        } else {
                            t = t.parentNode;
                        }
                    }
                    if (_1ef) {
                        t = e.target;
                        if (_1ee.onItemClick) {
                            var _1f0;
                            while (t && !(_1f0 = dijit.byNode(t))) {
                                t = t.parentNode;
                            }
                            if (_1f0 && _1f0.onClick && _1f0.getParent) {
                                _1f0.getParent().onItemClick(_1f0, e);
                            }
                        }
                        return;
                    }
                }
            }
            if (this._opened && _1ee.focus && _1ee.autoFocus !== false) {
                window.setTimeout(dojo.hitch(_1ee, "focus"), 1);
            }
        },
        _onDropDownClick: function(e) {
            if (this._stopClickEvents) {
                dojo.stopEvent(e);
            }
        },
        buildRendering: function() {
            this.inherited(arguments);
            this._buttonNode = this._buttonNode || this.focusNode || this.domNode;
            this._popupStateNode = this._popupStateNode || this.focusNode || this._buttonNode;
            var _1f1 = {
                "after": this.isLeftToRight() ? "Right" : "Left",
                "before": this.isLeftToRight() ? "Left" : "Right",
                "above": "Up",
                "below": "Down",
                "left": "Left",
                "right": "Right"
            }[this.dropDownPosition[0]] || this.dropDownPosition[0] || "Down";
            dojo.addClass(this._arrowWrapperNode || this._buttonNode, "dijit" + _1f1 + "ArrowButton");
        },
        postCreate: function() {
            this.inherited(arguments);
            this.connect(this._buttonNode, "onmousedown", "_onDropDownMouseDown");
            this.connect(this._buttonNode, "onclick", "_onDropDownClick");
            this.connect(this.focusNode, "onkeypress", "_onKey");
        },
        destroy: function() {
            if (this.dropDown) {
                if (!this.dropDown._destroyed) {
                    this.dropDown.destroyRecursive();
                }
                delete this.dropDown;
            }
            this.inherited(arguments);
        },
        _onKey: function(e) {
            if (this.disabled || this.readOnly) {
                return;
            }
            var d = this.dropDown
              , _1f2 = e.target;
            if (d && this._opened && d.handleKey) {
                if (d.handleKey(e) === false) {
                    dojo.stopEvent(e);
                    return;
                }
            }
            if (d && this._opened && e.charOrCode == dojo.keys.ESCAPE) {
                this.closeDropDown();
                dojo.stopEvent(e);
            } else {
                if (!this._opened && (e.charOrCode == dojo.keys.DOWN_ARROW || ((e.charOrCode == dojo.keys.ENTER || e.charOrCode == " ") && ((_1f2.tagName || "").toLowerCase() !== "input" || (_1f2.type && _1f2.type.toLowerCase() !== "text"))))) {
                    this.toggleDropDown();
                    d = this.dropDown;
                    if (d && d.focus) {
                        setTimeout(dojo.hitch(d, "focus"), 1);
                    }
                    dojo.stopEvent(e);
                }
            }
        },
        _onBlur: function() {
            var _1f3 = dijit._curFocus && this.dropDown && dojo.isDescendant(dijit._curFocus, this.dropDown.domNode);
            this.closeDropDown(_1f3);
            this.inherited(arguments);
        },
        isLoaded: function() {
            return true;
        },
        loadDropDown: function(_1f4) {
            _1f4();
        },
        toggleDropDown: function() {
            if (this.disabled || this.readOnly) {
                return;
            }
            if (!this._opened) {
                if (!this.isLoaded()) {
                    this.loadDropDown(dojo.hitch(this, "openDropDown"));
                    return;
                } else {
                    this.openDropDown();
                }
            } else {
                this.closeDropDown();
            }
        },
        openDropDown: function() {
            var _1f5 = this.dropDown
              , _1f6 = _1f5.domNode
              , _1f7 = this._aroundNode || this.domNode
              , self = this;
            if (!this._preparedNode) {
                this._preparedNode = true;
                if (_1f6.style.width) {
                    this._explicitDDWidth = true;
                }
                if (_1f6.style.height) {
                    this._explicitDDHeight = true;
                }
            }
            if (this.maxHeight || this.forceWidth || this.autoWidth) {
                var _1f8 = {
                    display: "",
                    visibility: "hidden"
                };
                if (!this._explicitDDWidth) {
                    _1f8.width = "";
                }
                if (!this._explicitDDHeight) {
                    _1f8.height = "";
                }
                dojo.style(_1f6, _1f8);
                var _1f9 = this.maxHeight;
                if (_1f9 == -1) {
                    var _1fa = dojo.window.getBox()
                      , _1fb = dojo.position(_1f7, false);
                    _1f9 = Math.floor(Math.max(_1fb.y, _1fa.h - (_1fb.y + _1fb.h)));
                }
                if (_1f5.startup && !_1f5._started) {
                    _1f5.startup();
                }
                dijit.popup.moveOffScreen(_1f5);
                var mb = dojo._getMarginSize(_1f6);
                var _1fc = (_1f9 && mb.h > _1f9);
                dojo.style(_1f6, {
                    overflowX: "hidden",
                    overflowY: _1fc ? "auto" : "hidden"
                });
                if (_1fc) {
                    mb.h = _1f9;
                    if ("w"in mb) {
                        mb.w += 16;
                    }
                } else {
                    delete mb.h;
                }
                if (this.forceWidth) {
                    mb.w = _1f7.offsetWidth;
                } else {
                    if (this.autoWidth) {
                        mb.w = Math.max(mb.w, _1f7.offsetWidth);
                    } else {
                        delete mb.w;
                    }
                }
                if (dojo.isFunction(_1f5.resize)) {
                    _1f5.resize(mb);
                } else {
                    dojo.marginBox(_1f6, mb);
                }
            }
            var _1fd = dijit.popup.open({
                parent: this,
                popup: _1f5,
                around: _1f7,
                orient: dijit.getPopupAroundAlignment((this.dropDownPosition && this.dropDownPosition.length) ? this.dropDownPosition : ["below"], this.isLeftToRight()),
                onExecute: function() {
                    self.closeDropDown(true);
                },
                onCancel: function() {
                    self.closeDropDown(true);
                },
                onClose: function() {
                    dojo.attr(self._popupStateNode, "popupActive", false);
                    dojo.removeClass(self._popupStateNode, "dijitHasDropDownOpen");
                    self._opened = false;
                }
            });
            dojo.attr(this._popupStateNode, "popupActive", "true");
            dojo.addClass(self._popupStateNode, "dijitHasDropDownOpen");
            this._opened = true;
            return _1fd;
        },
        closeDropDown: function(_1fe) {
            if (this._opened) {
                if (_1fe) {
                    this.focus();
                }
                dijit.popup.close(this.dropDown);
                this._opened = false;
            }
        }
    });
}
if (!dojo._hasResource["dijit.form.Button"]) {
    dojo._hasResource["dijit.form.Button"] = true;
    dojo.provide("dijit.form.Button");
    dojo.declare("dijit.form.Button", dijit.form._FormWidget, {
        label: "",
        showLabel: true,
        iconClass: "",
        type: "button",
        baseClass: "dijitButton",
        templateString: dojo.cache("dijit.form", "templates/Button.html", "<span class=\"dijit dijitReset dijitInline\"\r\n\t><span class=\"dijitReset dijitInline dijitButtonNode\"\r\n\t\tdojoAttachEvent=\"ondijitclick:_onButtonClick\"\r\n\t\t><span class=\"dijitReset dijitStretch dijitButtonContents\"\r\n\t\t\tdojoAttachPoint=\"titleNode,focusNode\"\r\n\t\t\trole=\"button\" aria-labelledby=\"${id}_label\"\r\n\t\t\t><span class=\"dijitReset dijitInline dijitIcon\" dojoAttachPoint=\"iconNode\"></span\r\n\t\t\t><span class=\"dijitReset dijitToggleButtonIconChar\">&#x25CF;</span\r\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"\r\n\t\t\t\tid=\"${id}_label\"\r\n\t\t\t\tdojoAttachPoint=\"containerNode\"\r\n\t\t\t></span\r\n\t\t></span\r\n\t></span\r\n\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" class=\"dijitOffScreen\"\r\n\t\tdojoAttachPoint=\"valueNode\"\r\n/></span>\r\n"),
        attributeMap: dojo.delegate(dijit.form._FormWidget.prototype.attributeMap, {
            value: "valueNode"
        }),
        _onClick: function(e) {
            if (this.disabled) {
                return false;
            }
            this._clicked();
            return this.onClick(e);
        },
        _onButtonClick: function(e) {
            if (this._onClick(e) === false) {
                e.preventDefault();
            } else {
                if (this.type == "submit" && !(this.valueNode || this.focusNode).form) {
                    for (var node = this.domNode; node.parentNode; node = node.parentNode) {
                        var _1ff = dijit.byNode(node);
                        if (_1ff && typeof _1ff._onSubmit == "function") {
                            _1ff._onSubmit(e);
                            break;
                        }
                    }
                } else {
                    if (this.valueNode) {
                        this.valueNode.click();
                        e.preventDefault();
                    }
                }
            }
        },
        buildRendering: function() {
            this.inherited(arguments);
            dojo.setSelectable(this.focusNode, false);
        },
        _fillContent: function(_200) {
            if (_200 && (!this.params || !("label"in this.params))) {
                this.set("label", _200.innerHTML);
            }
        },
        _setShowLabelAttr: function(val) {
            if (this.containerNode) {
                dojo.toggleClass(this.containerNode, "dijitDisplayNone", !val);
            }
            this._set("showLabel", val);
        },
        onClick: function(e) {
            return true;
        },
        _clicked: function(e) {},
        setLabel: function(_201) {
            dojo.deprecated("dijit.form.Button.setLabel() is deprecated.  Use set('label', ...) instead.", "", "2.0");
            this.set("label", _201);
        },
        _setLabelAttr: function(_202) {
            this._set("label", _202);
            this.containerNode.innerHTML = _202;
            if (this.showLabel == false && !this.params.title) {
                this.titleNode.title = dojo.trim(this.containerNode.innerText || this.containerNode.textContent || "");
            }
        },
        _setIconClassAttr: function(val) {
            var _203 = this.iconClass || "dijitNoIcon"
              , _204 = val || "dijitNoIcon";
            dojo.replaceClass(this.iconNode, _204, _203);
            this._set("iconClass", val);
        }
    });
    dojo.declare("dijit.form.DropDownButton", [dijit.form.Button, dijit._Container, dijit._HasDropDown], {
        baseClass: "dijitDropDownButton",
        templateString: dojo.cache("dijit.form", "templates/DropDownButton.html", "<span class=\"dijit dijitReset dijitInline\"\r\n\t><span class='dijitReset dijitInline dijitButtonNode'\r\n\t\tdojoAttachEvent=\"ondijitclick:_onButtonClick\" dojoAttachPoint=\"_buttonNode\"\r\n\t\t><span class=\"dijitReset dijitStretch dijitButtonContents\"\r\n\t\t\tdojoAttachPoint=\"focusNode,titleNode,_arrowWrapperNode\"\r\n\t\t\trole=\"button\" aria-haspopup=\"true\" aria-labelledby=\"${id}_label\"\r\n\t\t\t><span class=\"dijitReset dijitInline dijitIcon\"\r\n\t\t\t\tdojoAttachPoint=\"iconNode\"\r\n\t\t\t></span\r\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"\r\n\t\t\t\tdojoAttachPoint=\"containerNode,_popupStateNode\"\r\n\t\t\t\tid=\"${id}_label\"\r\n\t\t\t></span\r\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonInner\"></span\r\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonChar\">&#9660;</span\r\n\t\t></span\r\n\t></span\r\n\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" class=\"dijitOffScreen\"\r\n\t\tdojoAttachPoint=\"valueNode\"\r\n/></span>\r\n"),
        _fillContent: function() {
            if (this.srcNodeRef) {
                var _205 = dojo.query("*", this.srcNodeRef);
                dijit.form.DropDownButton.superclass._fillContent.call(this, _205[0]);
                this.dropDownContainer = this.srcNodeRef;
            }
        },
        startup: function() {
            if (this._started) {
                return;
            }
            if (!this.dropDown && this.dropDownContainer) {
                var _206 = dojo.query("[widgetId]", this.dropDownContainer)[0];
                this.dropDown = dijit.byNode(_206);
                delete this.dropDownContainer;
            }
            if (this.dropDown) {
                dijit.popup.hide(this.dropDown);
            }
            this.inherited(arguments);
        },
        isLoaded: function() {
            var _207 = this.dropDown;
            return ( !!_207 && (!_207.href || _207.isLoaded)) ;
        },
        loadDropDown: function() {
            var _208 = this.dropDown;
            if (!_208) {
                return;
            }
            if (!this.isLoaded()) {
                var _209 = dojo.connect(_208, "onLoad", this, function() {
                    dojo.disconnect(_209);
                    this.openDropDown();
                });
                _208.refresh();
            } else {
                this.openDropDown();
            }
        },
        isFocusable: function() {
            return this.inherited(arguments) && !this._mouseDown;
        }
    });
    dojo.declare("dijit.form.ComboButton", dijit.form.DropDownButton, {
        templateString: dojo.cache("dijit.form", "templates/ComboButton.html", "<table class=\"dijit dijitReset dijitInline dijitLeft\"\r\n\tcellspacing='0' cellpadding='0' role=\"presentation\"\r\n\t><tbody role=\"presentation\"><tr role=\"presentation\"\r\n\t\t><td class=\"dijitReset dijitStretch dijitButtonNode\" dojoAttachPoint=\"buttonNode\" dojoAttachEvent=\"ondijitclick:_onButtonClick,onkeypress:_onButtonKeyPress\"\r\n\t\t><div id=\"${id}_button\" class=\"dijitReset dijitButtonContents\"\r\n\t\t\tdojoAttachPoint=\"titleNode\"\r\n\t\t\trole=\"button\" aria-labelledby=\"${id}_label\"\r\n\t\t\t><div class=\"dijitReset dijitInline dijitIcon\" dojoAttachPoint=\"iconNode\" role=\"presentation\"></div\r\n\t\t\t><div class=\"dijitReset dijitInline dijitButtonText\" id=\"${id}_label\" dojoAttachPoint=\"containerNode\" role=\"presentation\"></div\r\n\t\t></div\r\n\t\t></td\r\n\t\t><td id=\"${id}_arrow\" class='dijitReset dijitRight dijitButtonNode dijitArrowButton'\r\n\t\t\tdojoAttachPoint=\"_popupStateNode,focusNode,_buttonNode\"\r\n\t\t\tdojoAttachEvent=\"onkeypress:_onArrowKeyPress\"\r\n\t\t\ttitle=\"${optionsTitle}\"\r\n\t\t\trole=\"button\" aria-haspopup=\"true\"\r\n\t\t\t><div class=\"dijitReset dijitArrowButtonInner\" role=\"presentation\"></div\r\n\t\t\t><div class=\"dijitReset dijitArrowButtonChar\" role=\"presentation\">&#9660;</div\r\n\t\t></td\r\n\t\t><td style=\"display:none !important;\"\r\n\t\t\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" dojoAttachPoint=\"valueNode\"\r\n\t\t/></td></tr></tbody\r\n></table>\r\n"),
        attributeMap: dojo.mixin(dojo.clone(dijit.form.Button.prototype.attributeMap), {
            id: "",
            tabIndex: ["focusNode", "titleNode"],
            title: "titleNode"
        }),
        optionsTitle: "",
        baseClass: "dijitComboButton",
        cssStateNodes: {
            "buttonNode": "dijitButtonNode",
            "titleNode": "dijitButtonContents",
            "_popupStateNode": "dijitDownArrowButton"
        },
        _focusedNode: null,
        _onButtonKeyPress: function(evt) {
            if (evt.charOrCode == dojo.keys[this.isLeftToRight() ? "RIGHT_ARROW" : "LEFT_ARROW"]) {
                dijit.focus(this._popupStateNode);
                dojo.stopEvent(evt);
            }
        },
        _onArrowKeyPress: function(evt) {
            if (evt.charOrCode == dojo.keys[this.isLeftToRight() ? "LEFT_ARROW" : "RIGHT_ARROW"]) {
                dijit.focus(this.titleNode);
                dojo.stopEvent(evt);
            }
        },
        focus: function(_20a) {
            if (!this.disabled) {
                dijit.focus(_20a == "start" ? this.titleNode : this._popupStateNode);
            }
        }
    });
    dojo.declare("dijit.form.ToggleButton", dijit.form.Button, {
        baseClass: "dijitToggleButton",
        checked: false,
        attributeMap: dojo.mixin(dojo.clone(dijit.form.Button.prototype.attributeMap), {
            checked: "focusNode"
        }),
        _clicked: function(evt) {
            this.set("checked", !this.checked);
        },
        _setCheckedAttr: function(_20b, _20c) {
            this._set("checked", _20b);
            dojo.attr(this.focusNode || this.domNode, "checked", _20b);
            dijit.setWaiState(this.focusNode || this.domNode, "pressed", _20b);
            this._handleOnChange(_20b, _20c);
        },
        setChecked: function(_20d) {
            dojo.deprecated("setChecked(" + _20d + ") is deprecated. Use set('checked'," + _20d + ") instead.", "", "2.0");
            this.set("checked", _20d);
        },
        reset: function() {
            this._hasBeenBlurred = false;
            this.set("checked", this.params.checked || false);
        }
    });
}
if (!dojo._hasResource["dijit.form.ToggleButton"]) {
    dojo._hasResource["dijit.form.ToggleButton"] = true;
    dojo.provide("dijit.form.ToggleButton");
}
if (!dojo._hasResource["dojo.i18n"]) {
    dojo._hasResource["dojo.i18n"] = true;
    dojo.provide("dojo.i18n");
    dojo.getObject("i18n", true, dojo);
    dojo.i18n.getLocalization = dojo.i18n.getLocalization || function(_20e, _20f, _210) {
        _210 = dojo.i18n.normalizeLocale(_210);
        var _211 = _210.split("-");
        var _212 = [_20e, "nls", _20f].join(".");
        var _213 = dojo._loadedModules[_212];
        if (_213) {
            var _214;
            for (var i = _211.length; i > 0; i--) {
                var loc = _211.slice(0, i).join("_");
                if (_213[loc]) {
                    _214 = _213[loc];
                    break;
                }
            }
            if (!_214) {
                _214 = _213.ROOT;
            }
            if (_214) {
                var _215 = function() {};
                _215.prototype = _214;
                return new _215();
            }
        }
        throw new Error("Bundle not found: " + _20f + " in " + _20e + " , locale=" + _210);
    }
    ;
    dojo.i18n.normalizeLocale = function(_216) {
        var _217 = _216 ? _216.toLowerCase() : dojo.locale;
        if (_217 == "root") {
            _217 = "ROOT";
        }
        return _217;
    }
    ;
    dojo.i18n._requireLocalization = function(_218, _219, _21a, _21b) {
        var _21c = dojo.i18n.normalizeLocale(_21a);
        var _21d = [_218, "nls", _219].join(".");
        var _21e = "";
        if (_21b) {
            var _21f = _21b.split(",");
            for (var i = 0; i < _21f.length; i++) {
                if (_21c["indexOf"](_21f[i]) == 0) {
                    if (_21f[i].length > _21e.length) {
                        _21e = _21f[i];
                    }
                }
            }
            if (!_21e) {
                _21e = "ROOT";
            }
        }
        var _220 = _21b ? _21e : _21c;
        var _221 = dojo._loadedModules[_21d];
        var _222 = null;
        if (_221) {
            if (dojo.config.localizationComplete && _221._built) {
                return;
            }
            var _223 = _220.replace(/-/g, "_");
            var _224 = _21d + "." + _223;
            _222 = dojo._loadedModules[_224];
        }
        if (!_222) {
            _221 = dojo["provide"](_21d);
            var syms = dojo._getModuleSymbols(_218);
            var _225 = syms.concat("nls").join("/");
            var _226;
            dojo.i18n._searchLocalePath(_220, _21b, function(loc) {
                var _227 = loc.replace(/-/g, "_");
                var _228 = _21d + "." + _227;
                var _229 = false;
                if (!dojo._loadedModules[_228]) {
                    dojo["provide"](_228);
                    var _22a = [_225];
                    if (loc != "ROOT") {
                        _22a.push(loc);
                    }
                    _22a.push(_219);
                    var _22b = _22a.join("/") + ".js";
                    _229 = dojo._loadPath(_22b, null, function(hash) {
                        hash = hash.root || hash;
                        var _22c = function() {};
                        _22c.prototype = _226;
                        _221[_227] = new _22c();
                        for (var j in hash) {
                            _221[_227][j] = hash[j];
                        }
                    });
                } else {
                    _229 = true;
                }
                if (_229 && _221[_227]) {
                    _226 = _221[_227];
                } else {
                    _221[_227] = _226;
                }
                if (_21b) {
                    return true;
                }
            });
        }
        if (_21b && _21c != _21e) {
            _221[_21c.replace(/-/g, "_")] = _221[_21e.replace(/-/g, "_")];
        }
    }
    ;
    (function() {
        var _22d = dojo.config.extraLocale;
        if (_22d) {
            if (!_22d instanceof Array) {
                _22d = [_22d];
            }
            var req = dojo.i18n._requireLocalization;
            dojo.i18n._requireLocalization = function(m, b, _22e, _22f) {
                req(m, b, _22e, _22f);
                if (_22e) {
                    return;
                }
                for (var i = 0; i < _22d.length; i++) {
                    req(m, b, _22d[i], _22f);
                }
            }
            ;
        }
    })();
    dojo.i18n._searchLocalePath = function(_230, down, _231) {
        _230 = dojo.i18n.normalizeLocale(_230);
        var _232 = _230.split("-");
        var _233 = [];
        for (var i = _232.length; i > 0; i--) {
            _233.push(_232.slice(0, i).join("-"));
        }
        _233.push(false);
        if (down) {
            _233.reverse();
        }
        for (var j = _233.length - 1; j >= 0; j--) {
            var loc = _233[j] || "ROOT";
            var stop = _231(loc);
            if (stop) {
                break;
            }
        }
    }
    ;
    dojo.i18n._preloadLocalizations = function(_234, _235) {
        function _236(_237) {
            _237 = dojo.i18n.normalizeLocale(_237);
            dojo.i18n._searchLocalePath(_237, true, function(loc) {
                for (var i = 0; i < _235.length; i++) {
                    if (_235[i] == loc) {
                        dojo["require"](_234 + "_" + loc);
                        return true;
                    }
                }
                return false;
            });
        }
        ;_236();
        var _238 = dojo.config.extraLocale || [];
        for (var i = 0; i < _238.length; i++) {
            _236(_238[i]);
        }
    }
    ;
}
if (!dojo._hasResource["dijit.layout.StackController"]) {
    dojo._hasResource["dijit.layout.StackController"] = true;
    dojo.provide("dijit.layout.StackController");
    dojo.declare("dijit.layout.StackController", [dijit._Widget, dijit._Templated, dijit._Container], {
        templateString: "<span role='tablist' dojoAttachEvent='onkeypress' class='dijitStackController'></span>",
        containerId: "",
        buttonWidget: "dijit.layout._StackButton",
        constructor: function() {
            this.pane2button = {};
            this.pane2connects = {};
            this.pane2watches = {};
        },
        buildRendering: function() {
            this.inherited(arguments);
            dijit.setWaiRole(this.domNode, "tablist");
        },
        postCreate: function() {
            this.inherited(arguments);
            this.subscribe(this.containerId + "-startup", "onStartup");
            this.subscribe(this.containerId + "-addChild", "onAddChild");
            this.subscribe(this.containerId + "-removeChild", "onRemoveChild");
            this.subscribe(this.containerId + "-selectChild", "onSelectChild");
            this.subscribe(this.containerId + "-containerKeyPress", "onContainerKeyPress");
        },
        onStartup: function(info) {
            dojo.forEach(info.children, this.onAddChild, this);
            if (info.selected) {
                this.onSelectChild(info.selected);
            }
        },
        destroy: function() {
            for (var pane in this.pane2button) {
                this.onRemoveChild(dijit.byId(pane));
            }
            this.inherited(arguments);
        },
        onAddChild: function(page, _239) {
            var cls = dojo.getObject(this.buttonWidget);
            var _23a = new cls({
                id: this.id + "_" + page.id,
                label: page.title,
                dir: page.dir,
                lang: page.lang,
                showLabel: page.showTitle,
                iconClass: page.iconClass,
                closeButton: page.closable,
                title: page.tooltip
            });
            dijit.setWaiState(_23a.focusNode, "selected", "false");
            var _23b = ["title", "showTitle", "iconClass", "closable", "tooltip"]
              , _23c = ["label", "showLabel", "iconClass", "closeButton", "title"];
            this.pane2watches[page.id] = dojo.map(_23b, function(_23d, idx) {
                return page.watch(_23d, function(name, _23e, _23f) {
                    _23a.set(_23c[idx], _23f);
                });
            });
            this.pane2connects[page.id] = [this.connect(_23a, "onClick", dojo.hitch(this, "onButtonClick", page)), this.connect(_23a, "onClickCloseButton", dojo.hitch(this, "onCloseButtonClick", page))];
            this.addChild(_23a, _239);
            this.pane2button[page.id] = _23a;
            page.controlButton = _23a;
            if (!this._currentChild) {
                _23a.focusNode.setAttribute("tabIndex", "0");
                dijit.setWaiState(_23a.focusNode, "selected", "true");
                this._currentChild = page;
            }
            if (!this.isLeftToRight() && dojo.isIE && this._rectifyRtlTabList) {
                this._rectifyRtlTabList();
            }
        },
        onRemoveChild: function(page) {
            if (this._currentChild === page) {
                this._currentChild = null;
            }
            dojo.forEach(this.pane2connects[page.id], dojo.hitch(this, "disconnect"));
            delete this.pane2connects[page.id];
            dojo.forEach(this.pane2watches[page.id], function(w) {
                w.unwatch();
            });
            delete this.pane2watches[page.id];
            var _240 = this.pane2button[page.id];
            if (_240) {
                this.removeChild(_240);
                delete this.pane2button[page.id];
                _240.destroy();
            }
            delete page.controlButton;
        },
        onSelectChild: function(page) {
            if (!page) {
                return;
            }
            if (this._currentChild) {
                var _241 = this.pane2button[this._currentChild.id];
                _241.set("checked", false);
                dijit.setWaiState(_241.focusNode, "selected", "false");
                _241.focusNode.setAttribute("tabIndex", "-1");
            }
            var _242 = this.pane2button[page.id];
            _242.set("checked", true);
            dijit.setWaiState(_242.focusNode, "selected", "true");
            this._currentChild = page;
            _242.focusNode.setAttribute("tabIndex", "0");
            var _243 = dijit.byId(this.containerId);
            dijit.setWaiState(_243.containerNode, "labelledby", _242.id);
        },
        onButtonClick: function(page) {
            var _244 = dijit.byId(this.containerId);
            _244.selectChild(page);
        },
        onCloseButtonClick: function(page) {
            var _245 = dijit.byId(this.containerId);
            _245.closeChild(page);
            if (this._currentChild) {
                var b = this.pane2button[this._currentChild.id];
                if (b) {
                    dijit.focus(b.focusNode || b.domNode);
                }
            }
        },
        adjacent: function(_246) {
            if (!this.isLeftToRight() && (!this.tabPosition || /top|bottom/.test(this.tabPosition))) {
                _246 = !_246;
            }
            var _247 = this.getChildren();
            var _248 = dojo.indexOf(_247, this.pane2button[this._currentChild.id]);
            var _249 = _246 ? 1 : _247.length - 1;
            return _247[(_248 + _249) % _247.length];
        },
        onkeypress: function(e) {
            if (this.disabled || e.altKey) {
                return;
            }
            var _24a = null;
            if (e.ctrlKey || !e._djpage) {
                var k = dojo.keys;
                switch (e.charOrCode) {
                case k.LEFT_ARROW:
                case k.UP_ARROW:
                    if (!e._djpage) {
                        _24a = false;
                    }
                    break;
                case k.PAGE_UP:
                    if (e.ctrlKey) {
                        _24a = false;
                    }
                    break;
                case k.RIGHT_ARROW:
                case k.DOWN_ARROW:
                    if (!e._djpage) {
                        _24a = true;
                    }
                    break;
                case k.PAGE_DOWN:
                    if (e.ctrlKey) {
                        _24a = true;
                    }
                    break;
                case k.HOME:
                case k.END:
                    var _24b = this.getChildren();
                    if (_24b && _24b.length) {
                        _24b[e.charOrCode == k.HOME ? 0 : _24b.length - 1].onClick();
                    }
                    dojo.stopEvent(e);
                    break;
                case k.DELETE:
                    if (this._currentChild.closable) {
                        this.onCloseButtonClick(this._currentChild);
                    }
                    dojo.stopEvent(e);
                    break;
                default:
                    if (e.ctrlKey) {
                        if (e.charOrCode === k.TAB) {
                            this.adjacent(!e.shiftKey).onClick();
                            dojo.stopEvent(e);
                        } else {
                            if (e.charOrCode == "w") {
                                if (this._currentChild.closable) {
                                    this.onCloseButtonClick(this._currentChild);
                                }
                                dojo.stopEvent(e);
                            }
                        }
                    }
                }
                if (_24a !== null) {
                    this.adjacent(_24a).onClick();
                    dojo.stopEvent(e);
                }
            }
        },
        onContainerKeyPress: function(info) {
            info.e._djpage = info.page;
            this.onkeypress(info.e);
        }
    });
    dojo.declare("dijit.layout._StackButton", dijit.form.ToggleButton, {
        tabIndex: "-1",
        buildRendering: function(evt) {
            this.inherited(arguments);
            dijit.setWaiRole((this.focusNode || this.domNode), "tab");
        },
        onClick: function(evt) {
            dijit.focus(this.focusNode);
        },
        onClickCloseButton: function(evt) {
            evt.stopPropagation();
        }
    });
}
if (!dojo._hasResource["dijit.layout.StackContainer"]) {
    dojo._hasResource["dijit.layout.StackContainer"] = true;
    dojo.provide("dijit.layout.StackContainer");
    dojo.declare("dijit.layout.StackContainer", dijit.layout._LayoutWidget, {
        doLayout: true,
        persist: false,
        baseClass: "dijitStackContainer",
        buildRendering: function() {
            this.inherited(arguments);
            dojo.addClass(this.domNode, "dijitLayoutContainer");
            dijit.setWaiRole(this.containerNode, "tabpanel");
        },
        postCreate: function() {
            this.inherited(arguments);
            this.connect(this.domNode, "onkeypress", this._onKeyPress);
        },
        startup: function() {
            if (this._started) {
                return;
            }
            var _24c = this.getChildren();
            dojo.forEach(_24c, this._setupChild, this);
            if (this.persist) {
                this.selectedChildWidget = dijit.byId(dojo.cookie(this.id + "_selectedChild"));
            } else {
                dojo.some(_24c, function(_24d) {
                    if (_24d.selected) {
                        this.selectedChildWidget = _24d;
                    }
                    return _24d.selected;
                }, this);
            }
            var _24e = this.selectedChildWidget;
            if (!_24e && _24c[0]) {
                _24e = this.selectedChildWidget = _24c[0];
                _24e.selected = true;
            }
            dojo.publish(this.id + "-startup", [{
                children: _24c,
                selected: _24e
            }]);
            this.inherited(arguments);
        },
        resize: function() {
            var _24f = this.selectedChildWidget;
            if (_24f && !this._hasBeenShown) {
                this._hasBeenShown = true;
                this._showChild(_24f);
            }
            this.inherited(arguments);
        },
        _setupChild: function(_250) {
            this.inherited(arguments);
            dojo.replaceClass(_250.domNode, "dijitHidden", "dijitVisible");
            _250.domNode.title = "";
        },
        addChild: function(_251, _252) {
            this.inherited(arguments);
            if (this._started) {
                dojo.publish(this.id + "-addChild", [_251, _252]);
                this.layout();
                if (!this.selectedChildWidget) {
                    this.selectChild(_251);
                }
            }
        },
        removeChild: function(page) {
            this.inherited(arguments);
            if (this._started) {
                dojo.publish(this.id + "-removeChild", [page]);
            }
            if (this._beingDestroyed) {
                return;
            }
            if (this.selectedChildWidget === page) {
                this.selectedChildWidget = undefined;
                if (this._started) {
                    var _253 = this.getChildren();
                    if (_253.length) {
                        this.selectChild(_253[0]);
                    }
                }
            }
            if (this._started) {
                this.layout();
            }
        },
        selectChild: function(page, _254) {
            page = dijit.byId(page);
            if (this.selectedChildWidget != page) {
                var d = this._transition(page, this.selectedChildWidget, _254);
                this._set("selectedChildWidget", page);
                dojo.publish(this.id + "-selectChild", [page]);
                if (this.persist) {
                    dojo.cookie(this.id + "_selectedChild", this.selectedChildWidget.id);
                }
            }
            return d;
        },
        _transition: function(_255, _256, _257) {
            if (_256) {
                this._hideChild(_256);
            }
            var d = this._showChild(_255);
            if (_255.resize) {
                if (this.doLayout) {
                    _255.resize(this._containerContentBox || this._contentBox);
                } else {
                    _255.resize();
                }
            }
            return d;
        },
        _adjacent: function(_258) {
            var _259 = this.getChildren();
            var _25a = dojo.indexOf(_259, this.selectedChildWidget);
            _25a += _258 ? 1 : _259.length - 1;
            return _259[_25a % _259.length];
        },
        forward: function() {
            return this.selectChild(this._adjacent(true), true);
        },
        back: function() {
            return this.selectChild(this._adjacent(false), true);
        },
        _onKeyPress: function(e) {
            dojo.publish(this.id + "-containerKeyPress", [{
                e: e,
                page: this
            }]);
        },
        layout: function() {
            if (this.doLayout && this.selectedChildWidget && this.selectedChildWidget.resize) {
                this.selectedChildWidget.resize(this._containerContentBox || this._contentBox);
            }
        },
        _showChild: function(page) {
            var _25b = this.getChildren();
            page.isFirstChild = (page == _25b[0]);
            page.isLastChild = (page == _25b[_25b.length - 1]);
            page._set("selected", true);
            dojo.replaceClass(page.domNode, "dijitVisible", "dijitHidden");
            return page._onShow() || true;
        },
        _hideChild: function(page) {
            page._set("selected", false);
            dojo.replaceClass(page.domNode, "dijitHidden", "dijitVisible");
            page.onHide();
        },
        closeChild: function(page) {
            var _25c = page.onClose(this, page);
            if (_25c) {
                this.removeChild(page);
                page.destroyRecursive();
            }
        },
        destroyDescendants: function(_25d) {
            dojo.forEach(this.getChildren(), function(_25e) {
                this.removeChild(_25e);
                _25e.destroyRecursive(_25d);
            }, this);
        }
    });
    dojo.extend(dijit._Widget, {
        selected: false,
        closable: false,
        iconClass: "",
        showTitle: true
    });
}
if (!dojo._hasResource["dijit.layout._ContentPaneResizeMixin"]) {
    dojo._hasResource["dijit.layout._ContentPaneResizeMixin"] = true;
    dojo.provide("dijit.layout._ContentPaneResizeMixin");
    dojo.declare("dijit.layout._ContentPaneResizeMixin", null, {
        doLayout: true,
        isContainer: true,
        isLayoutContainer: true,
        _startChildren: function() {
            dojo.forEach(this.getChildren(), function(_25f) {
                _25f.startup();
                _25f._started = true;
            });
        },
        startup: function() {
            if (this._started) {
                return;
            }
            var _260 = dijit._Contained.prototype.getParent.call(this);
            this._childOfLayoutWidget = _260 && _260.isLayoutContainer;
            this._needLayout = !this._childOfLayoutWidget;
            this.inherited(arguments);
            this._startChildren();
        },
        _checkIfSingleChild: function() {
            var _261 = dojo.query("> *", this.containerNode).filter(function(node) {
                return node.tagName !== "SCRIPT";
            })
              , _262 = _261.filter(function(node) {
                return dojo.hasAttr(node, "data-dojo-type") || dojo.hasAttr(node, "dojoType") || dojo.hasAttr(node, "widgetId");
            })
              , _263 = dojo.filter(_262.map(dijit.byNode), function(_264) {
                return _264 && _264.domNode && _264.resize;
            });
            if (_261.length == _262.length && _263.length == 1) {
                this._singleChild = _263[0];
            } else {
                delete this._singleChild;
            }
            dojo.toggleClass(this.containerNode, this.baseClass + "SingleChild", !!this._singleChild);
        },
        resize: function(_265, _266) {
            this._layout(_265, _266);
        },
        _layout: function(_267, _268) {
            if (_267) {
                dojo.marginBox(this.domNode, _267);
            }
            var cn = this.containerNode;
            if (cn === this.domNode) {
                var mb = _268 || {};
                dojo.mixin(mb, _267 || {});
                if (!("h"in mb) || !("w"in mb)) {
                    mb = dojo.mixin(dojo.marginBox(cn), mb);
                }
                this._contentBox = dijit.layout.marginBox2contentBox(cn, mb);
            } else {
                this._contentBox = dojo.contentBox(cn);
            }
            this._layoutChildren();
            delete this._needLayout;
        },
        _layoutChildren: function() {
            if (this.doLayout) {
                this._checkIfSingleChild();
            }
            if (this._singleChild && this._singleChild.resize) {
                var cb = this._contentBox || dojo.contentBox(this.containerNode);
                this._singleChild.resize({
                    w: cb.w,
                    h: cb.h
                });
            } else {
                dojo.forEach(this.getChildren(), function(_269) {
                    if (_269.resize) {
                        _269.resize();
                    }
                });
            }
        }
    });
}
if (!dojo._hasResource["dojo.html"]) {
    dojo._hasResource["dojo.html"] = true;
    dojo.provide("dojo.html");
    dojo.getObject("html", true, dojo);
    (function() {
        var _26a = 0
          , d = dojo;
        dojo.html._secureForInnerHtml = function(cont) {
            return cont.replace(/(?:\s*<!DOCTYPE\s[^>]+>|<title[^>]*>[\s\S]*?<\/title>)/ig, "");
        }
        ;
        dojo.html._emptyNode = dojo.empty;
        dojo.html._setNodeContent = function(node, cont) {
            d.empty(node);
            if (cont) {
                if (typeof cont == "string") {
                    cont = d._toDom(cont, node.ownerDocument);
                }
                if (!cont.nodeType && d.isArrayLike(cont)) {
                    for (var _26b = cont.length, i = 0; i < cont.length; i = _26b == cont.length ? i + 1 : 0) {
                        d.place(cont[i], node, "last");
                    }
                } else {
                    d.place(cont, node, "last");
                }
            }
            return node;
        }
        ;
        dojo.declare("dojo.html._ContentSetter", null, {
            node: "",
            content: "",
            id: "",
            cleanContent: false,
            extractContent: false,
            parseContent: false,
            parserScope: dojo._scopeName,
            startup: true,
            constructor: function(_26c, node) {
                dojo.mixin(this, _26c || {});
                node = this.node = dojo.byId(this.node || node);
                if (!this.id) {
                    this.id = ["Setter", (node) ? node.id || node.tagName : "", _26a++].join("_");
                }
            },
            set: function(cont, _26d) {
                if (undefined !== cont) {
                    this.content = cont;
                }
                if (_26d) {
                    this._mixin(_26d);
                }
                this.onBegin();
                this.setContent();
                this.onEnd();
                return this.node;
            },
            setContent: function() {
                var node = this.node;
                if (!node) {
                    throw new Error(this.declaredClass + ": setContent given no node");
                }
                try {
                    node = dojo.html._setNodeContent(node, this.content);
                } catch (e) {
                    var _26e = this.onContentError(e);
                    try {
                        node.innerHTML = _26e;
                    } catch (e) {
                        console.error("Fatal " + this.declaredClass + ".setContent could not change content due to " + e.message, e);
                    }
                }
                this.node = node;
            },
            empty: function() {
                if (this.parseResults && this.parseResults.length) {
                    dojo.forEach(this.parseResults, function(w) {
                        if (w.destroy) {
                            w.destroy();
                        }
                    });
                    delete this.parseResults;
                }
                dojo.html._emptyNode(this.node);
            },
            onBegin: function() {
                var cont = this.content;
                if (dojo.isString(cont)) {
                    if (this.cleanContent) {
                        cont = dojo.html._secureForInnerHtml(cont);
                    }
                    if (this.extractContent) {
                        var _26f = cont.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
                        if (_26f) {
                            cont = _26f[1];
                        }
                    }
                }
                this.empty();
                this.content = cont;
                return this.node;
            },
            onEnd: function() {
                if (this.parseContent) {
                    this._parse();
                }
                return this.node;
            },
            tearDown: function() {
                delete this.parseResults;
                delete this.node;
                delete this.content;
            },
            onContentError: function(err) {
                return "Error occured setting content: " + err;
            },
            _mixin: function(_270) {
                var _271 = {}, key;
                for (key in _270) {
                    if (key in _271) {
                        continue;
                    }
                    this[key] = _270[key];
                }
            },
            _parse: function() {
                var _272 = this.node;
                try {
                    this.parseResults = dojo.parser.parse({
                        rootNode: _272,
                        noStart: !this.startup,
                        inherited: {
                            dir: this.dir,
                            lang: this.lang
                        },
                        scope: this.parserScope
                    });
                } catch (e) {
                    this._onError("Content", e, "Error parsing in _ContentSetter#" + this.id);
                }
            },
            _onError: function(type, err, _273) {
                var _274 = this["on" + type + "Error"].call(this, err);
                if (_273) {
                    console.error(_273, err);
                } else {
                    if (_274) {
                        dojo.html._setNodeContent(this.node, _274, true);
                    }
                }
            }
        });
        dojo.html.set = function(node, cont, _275) {
            if (undefined == cont) {
                console.warn("dojo.html.set: no cont argument provided, using empty string");
                cont = "";
            }
            if (!_275) {
                return dojo.html._setNodeContent(node, cont, true);
            } else {
                var op = new dojo.html._ContentSetter(dojo.mixin(_275, {
                    content: cont,
                    node: node
                }));
                return op.set();
            }
        }
        ;
    })();
}
if (!dojo._hasResource["dijit.layout.ContentPane"]) {
    dojo._hasResource["dijit.layout.ContentPane"] = true;
    dojo.provide("dijit.layout.ContentPane");
    dojo.declare("dijit.layout.ContentPane", [dijit._Widget, dijit.layout._ContentPaneResizeMixin], {
        href: "",
        extractContent: false,
        parseOnLoad: true,
        parserScope: dojo._scopeName,
        preventCache: false,
        preload: false,
        refreshOnShow: false,
        loadingMessage: "<span class='dijitContentPaneLoading'>${loadingState}</span>",
        errorMessage: "<span class='dijitContentPaneError'>${errorState}</span>",
        isLoaded: false,
        baseClass: "dijitContentPane",
        ioArgs: {},
        onLoadDeferred: null,
        attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
            title: []
        }),
        stopParser: true,
        template: false,
        create: function(_276, _277) {
            if ((!_276 || !_276.template) && _277 && !("href"in _276) && !("content"in _276)) {
                var df = dojo.doc.createDocumentFragment();
                _277 = dojo.byId(_277);
                while (_277.firstChild) {
                    df.appendChild(_277.firstChild);
                }
                _276 = dojo.delegate(_276, {
                    content: df
                });
            }
            this.inherited(arguments, [_276, _277]);
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            var _278 = dojo.i18n.getLocalization("dijit", "loading", this.lang);
            this.loadingMessage = dojo.string.substitute(this.loadingMessage, _278);
            this.errorMessage = dojo.string.substitute(this.errorMessage, _278);
        },
        buildRendering: function() {
            this.inherited(arguments);
            if (!this.containerNode) {
                this.containerNode = this.domNode;
            }
            this.domNode.title = "";
            if (!dojo.attr(this.domNode, "role")) {
                dijit.setWaiRole(this.domNode, "group");
            }
        },
        _startChildren: function() {
            this.inherited(arguments);
            if (this._contentSetter) {
                dojo.forEach(this._contentSetter.parseResults, function(obj) {
                    if (!obj._started && !obj._destroyed && dojo.isFunction(obj.startup)) {
                        obj.startup();
                        obj._started = true;
                    }
                }, this);
            }
        },
        startup: function() {
            if (this._started) {
                return;
            }
            this.inherited(arguments);
            if (this._isShown()) {
                this._onShow();
            }
        },
        setHref: function(href) {
            dojo.deprecated("dijit.layout.ContentPane.setHref() is deprecated. Use set('href', ...) instead.", "", "2.0");
            return this.set("href", href);
        },
        _setHrefAttr: function(href) {
            this.cancel();
            this.onLoadDeferred = new dojo.Deferred(dojo.hitch(this, "cancel"));
            this.onLoadDeferred.addCallback(dojo.hitch(this, "onLoad"));
            this._set("href", href);
            if (this.preload || (this._created && this._isShown())) {
                this._load();
            } else {
                this._hrefChanged = true;
            }
            return this.onLoadDeferred;
        },
        setContent: function(data) {
            dojo.deprecated("dijit.layout.ContentPane.setContent() is deprecated.  Use set('content', ...) instead.", "", "2.0");
            this.set("content", data);
        },
        _setContentAttr: function(data) {
            this._set("href", "");
            this.cancel();
            this.onLoadDeferred = new dojo.Deferred(dojo.hitch(this, "cancel"));
            if (this._created) {
                this.onLoadDeferred.addCallback(dojo.hitch(this, "onLoad"));
            }
            this._setContent(data || "");
            this._isDownloaded = false;
            return this.onLoadDeferred;
        },
        _getContentAttr: function() {
            return this.containerNode.innerHTML;
        },
        cancel: function() {
            if (this._xhrDfd && (this._xhrDfd.fired == -1)) {
                this._xhrDfd.cancel();
            }
            delete this._xhrDfd;
            this.onLoadDeferred = null;
        },
        uninitialize: function() {
            if (this._beingDestroyed) {
                this.cancel();
            }
            this.inherited(arguments);
        },
        destroyRecursive: function(_279) {
            if (this._beingDestroyed) {
                return;
            }
            this.inherited(arguments);
        },
        resize: function(_27a, _27b) {
            if (!this._wasShown && this.open !== false) {
                this._onShow();
            }
            this._resizeCalled = true;
            this._scheduleLayout(_27a, _27b);
        },
        _isShown: function() {
            if (this._childOfLayoutWidget) {
                if (this._resizeCalled && "open"in this) {
                    return this.open;
                }
                return this._resizeCalled;
            } else {
                if ("open"in this) {
                    return this.open;
                } else {
                    var node = this.domNode
                      , _27c = this.domNode.parentNode;
                    return (node.style.display != "none") && (node.style.visibility != "hidden") && !dojo.hasClass(node, "dijitHidden") && _27c && _27c.style && (_27c.style.display != "none");
                }
            }
        },
        _onShow: function() {
            if (this.href) {
                if (!this._xhrDfd && (!this.isLoaded || this._hrefChanged || this.refreshOnShow)) {
                    var d = this.refresh();
                }
            } else {
                if (this._needLayout) {
                    this._layout(this._changeSize, this._resultSize);
                }
            }
            this.inherited(arguments);
            this._wasShown = true;
            return d;
        },
        refresh: function() {
            this.cancel();
            this.onLoadDeferred = new dojo.Deferred(dojo.hitch(this, "cancel"));
            this.onLoadDeferred.addCallback(dojo.hitch(this, "onLoad"));
            this._load();
            return this.onLoadDeferred;
        },
        _load: function() {
            this._setContent(this.onDownloadStart(), true);
            var self = this;
            var _27d = {
                preventCache: (this.preventCache || this.refreshOnShow),
                url: this.href,
                handleAs: "text"
            };
            if (dojo.isObject(this.ioArgs)) {
                dojo.mixin(_27d, this.ioArgs);
            }
            var hand = (this._xhrDfd = (this.ioMethod || dojo.xhrGet)(_27d));
            hand.addCallback(function(html) {
                try {
                    self._isDownloaded = true;
                    self._setContent(html, false);
                    self.onDownloadEnd();
                } catch (err) {
                    self._onError("Content", err);
                }
                delete self._xhrDfd;
                return html;
            });
            hand.addErrback(function(err) {
                if (!hand.canceled) {
                    self._onError("Download", err);
                }
                delete self._xhrDfd;
                return err;
            });
            delete this._hrefChanged;
        },
        _onLoadHandler: function(data) {
            this._set("isLoaded", true);
            try {
                this.onLoadDeferred.callback(data);
            } catch (e) {
                console.error("Error " + this.widgetId + " running custom onLoad code: " + e.message);
            }
        },
        _onUnloadHandler: function() {
            this._set("isLoaded", false);
            try {
                this.onUnload();
            } catch (e) {
                console.error("Error " + this.widgetId + " running custom onUnload code: " + e.message);
            }
        },
        destroyDescendants: function() {
            if (this.isLoaded) {
                this._onUnloadHandler();
            }
            var _27e = this._contentSetter;
            dojo.forEach(this.getChildren(), function(_27f) {
                if (_27f.destroyRecursive) {
                    _27f.destroyRecursive();
                }
            });
            if (_27e) {
                dojo.forEach(_27e.parseResults, function(_280) {
                    if (_280.destroyRecursive && _280.domNode && _280.domNode.parentNode == dojo.body()) {
                        _280.destroyRecursive();
                    }
                });
                delete _27e.parseResults;
            }
            dojo.html._emptyNode(this.containerNode);
            delete this._singleChild;
        },
        _setContent: function(cont, _281) {
            this.destroyDescendants();
            var _282 = this._contentSetter;
            if (!(_282 && _282 instanceof dojo.html._ContentSetter)) {
                _282 = this._contentSetter = new dojo.html._ContentSetter({
                    node: this.containerNode,
                    _onError: dojo.hitch(this, this._onError),
                    onContentError: dojo.hitch(this, function(e) {
                        var _283 = this.onContentError(e);
                        try {
                            this.containerNode.innerHTML = _283;
                        } catch (e) {
                            console.error("Fatal " + this.id + " could not change content due to " + e.message, e);
                        }
                    })
                });
            }
            var _284 = dojo.mixin({
                cleanContent: this.cleanContent,
                extractContent: this.extractContent,
                parseContent: this.parseOnLoad,
                parserScope: this.parserScope,
                startup: false,
                dir: this.dir,
                lang: this.lang
            }, this._contentSetterParams || {});
            _282.set((dojo.isObject(cont) && cont.domNode) ? cont.domNode : cont, _284);
            delete this._contentSetterParams;
            if (this.doLayout) {
                this._checkIfSingleChild();
            }
            if (!_281) {
                if (this._started) {
                    this._startChildren();
                    this._scheduleLayout();
                }
                this._onLoadHandler(cont);
            }
        },
        _onError: function(type, err, _285) {
            this.onLoadDeferred.errback(err);
            var _286 = this["on" + type + "Error"].call(this, err);
            if (_285) {
                console.error(_285, err);
            } else {
                if (_286) {
                    this._setContent(_286, true);
                }
            }
        },
        _scheduleLayout: function(_287, _288) {
            if (this._isShown()) {
                this._layout(_287, _288);
            } else {
                this._needLayout = true;
                this._changeSize = _287;
                this._resultSize = _288;
            }
        },
        onLoad: function(data) {},
        onUnload: function() {},
        onDownloadStart: function() {
            return this.loadingMessage;
        },
        onContentError: function(_289) {},
        onDownloadError: function(_28a) {
            return this.errorMessage;
        },
        onDownloadEnd: function() {}
    });
}
if (!dojo._hasResource["dijit.layout.AccordionPane"]) {
    dojo._hasResource["dijit.layout.AccordionPane"] = true;
    dojo.provide("dijit.layout.AccordionPane");
    dojo.declare("dijit.layout.AccordionPane", dijit.layout.ContentPane, {
        constructor: function() {
            dojo.deprecated("dijit.layout.AccordionPane deprecated, use ContentPane instead", "", "2.0");
        },
        onSelected: function() {}
    });
}
if (!dojo._hasResource["dijit.layout.AccordionContainer"]) {
    dojo._hasResource["dijit.layout.AccordionContainer"] = true;
    dojo.provide("dijit.layout.AccordionContainer");
    dojo.declare("dijit.layout.AccordionContainer", dijit.layout.StackContainer, {
        duration: dijit.defaultDuration,
        buttonWidget: "dijit.layout._AccordionButton",
        baseClass: "dijitAccordionContainer",
        buildRendering: function() {
            this.inherited(arguments);
            this.domNode.style.overflow = "hidden";
            dijit.setWaiRole(this.domNode, "tablist");
        },
        startup: function() {
            if (this._started) {
                return;
            }
            this.inherited(arguments);
            if (this.selectedChildWidget) {
                var _28b = this.selectedChildWidget.containerNode.style;
                _28b.display = "";
                _28b.overflow = "auto";
                this.selectedChildWidget._wrapperWidget.set("selected", true);
            }
        },
        layout: function() {
            var _28c = this.selectedChildWidget;
            if (!_28c) {
                return;
            }
            var _28d = _28c._wrapperWidget.domNode
              , _28e = dojo._getMarginExtents(_28d)
              , _28f = dojo._getPadBorderExtents(_28d)
              , _290 = _28c._wrapperWidget.containerNode
              , _291 = dojo._getMarginExtents(_290)
              , _292 = dojo._getPadBorderExtents(_290)
              , _293 = this._contentBox;
            var _294 = 0;
            dojo.forEach(this.getChildren(), function(_295) {
                if (_295 != _28c) {
                    _294 += dojo._getMarginSize(_295._wrapperWidget.domNode).h;
                }
            });
            this._verticalSpace = _293.h - _294 - _28e.h - _28f.h - _291.h - _292.h - _28c._buttonWidget.getTitleHeight();
            this._containerContentBox = {
                h: this._verticalSpace,
                w: this._contentBox.w - _28e.w - _28f.w - _291.w - _292.w
            };
            if (_28c) {
                _28c.resize(this._containerContentBox);
            }
        },
        _setupChild: function(_296) {
            _296._wrapperWidget = new dijit.layout._AccordionInnerContainer({
                contentWidget: _296,
                buttonWidget: this.buttonWidget,
                id: _296.id + "_wrapper",
                dir: _296.dir,
                lang: _296.lang,
                parent: this
            });
            this.inherited(arguments);
        },
        addChild: function(_297, _298) {
            if (this._started) {
                dojo.place(_297.domNode, this.containerNode, _298);
                if (!_297._started) {
                    _297.startup();
                }
                this._setupChild(_297);
                dojo.publish(this.id + "-addChild", [_297, _298]);
                this.layout();
                if (!this.selectedChildWidget) {
                    this.selectChild(_297);
                }
            } else {
                this.inherited(arguments);
            }
        },
        removeChild: function(_299) {
            if (_299._wrapperWidget) {
                dojo.place(_299.domNode, _299._wrapperWidget.domNode, "after");
                _299._wrapperWidget.destroy();
                delete _299._wrapperWidget;
            }
            dojo.removeClass(_299.domNode, "dijitHidden");
            this.inherited(arguments);
        },
        getChildren: function() {
            return dojo.map(this.inherited(arguments), function(_29a) {
                return _29a.declaredClass == "dijit.layout._AccordionInnerContainer" ? _29a.contentWidget : _29a;
            }, this);
        },
        destroy: function() {
            if (this._animation) {
                this._animation.stop();
            }
            dojo.forEach(this.getChildren(), function(_29b) {
                if (_29b._wrapperWidget) {
                    _29b._wrapperWidget.destroy();
                } else {
                    _29b.destroyRecursive();
                }
            });
            this.inherited(arguments);
        },
        _showChild: function(_29c) {
            _29c._wrapperWidget.containerNode.style.display = "block";
            return this.inherited(arguments);
        },
        _hideChild: function(_29d) {
            _29d._wrapperWidget.containerNode.style.display = "none";
            this.inherited(arguments);
        },
        _transition: function(_29e, _29f, _2a0) {
            if (dojo.isIE < 8) {
                _2a0 = false;
            }
            if (this._animation) {
                this._animation.stop(true);
                delete this._animation;
            }
            var self = this;
            if (_29e) {
                _29e._wrapperWidget.set("selected", true);
                var d = this._showChild(_29e);
                if (this.doLayout && _29e.resize) {
                    _29e.resize(this._containerContentBox);
                }
            }
            if (_29f) {
                _29f._wrapperWidget.set("selected", false);
                if (!_2a0) {
                    this._hideChild(_29f);
                }
            }
            if (_2a0) {
                var _2a1 = _29e._wrapperWidget.containerNode
                  , _2a2 = _29f._wrapperWidget.containerNode;
                var _2a3 = _29e._wrapperWidget.containerNode
                  , _2a4 = dojo._getMarginExtents(_2a3)
                  , _2a5 = dojo._getPadBorderExtents(_2a3)
                  , _2a6 = _2a4.h + _2a5.h;
                _2a2.style.height = (self._verticalSpace - _2a6) + "px";
                this._animation = new dojo.Animation({
                    node: _2a1,
                    duration: this.duration,
                    curve: [1, this._verticalSpace - _2a6 - 1],
                    onAnimate: function(_2a7) {
                        _2a7 = Math.floor(_2a7);
                        _2a1.style.height = _2a7 + "px";
                        _2a2.style.height = (self._verticalSpace - _2a6 - _2a7) + "px";
                    },
                    onEnd: function() {
                        delete self._animation;
                        _2a1.style.height = "auto";
                        _29f._wrapperWidget.containerNode.style.display = "none";
                        _2a2.style.height = "auto";
                        self._hideChild(_29f);
                    }
                });
                this._animation.onStop = this._animation.onEnd;
                this._animation.play();
            }
            return d;
        },
        _onKeyPress: function(e, _2a8) {
            if (this.disabled || e.altKey || !(_2a8 || e.ctrlKey)) {
                return;
            }
            var k = dojo.keys
              , c = e.charOrCode;
            if ((_2a8 && (c == k.LEFT_ARROW || c == k.UP_ARROW)) || (e.ctrlKey && c == k.PAGE_UP)) {
                this._adjacent(false)._buttonWidget._onTitleClick();
                dojo.stopEvent(e);
            } else {
                if ((_2a8 && (c == k.RIGHT_ARROW || c == k.DOWN_ARROW)) || (e.ctrlKey && (c == k.PAGE_DOWN || c == k.TAB))) {
                    this._adjacent(true)._buttonWidget._onTitleClick();
                    dojo.stopEvent(e);
                }
            }
        }
    });
    dojo.declare("dijit.layout._AccordionInnerContainer", [dijit._Widget, dijit._CssStateMixin], {
        baseClass: "dijitAccordionInnerContainer",
        isContainer: true,
        isLayoutContainer: true,
        buildRendering: function() {
            this.domNode = dojo.place("<div class='" + this.baseClass + "'>", this.contentWidget.domNode, "after");
            var _2a9 = this.contentWidget
              , cls = dojo.getObject(this.buttonWidget);
            this.button = _2a9._buttonWidget = (new cls({
                contentWidget: _2a9,
                label: _2a9.title,
                title: _2a9.tooltip,
                dir: _2a9.dir,
                lang: _2a9.lang,
                iconClass: _2a9.iconClass,
                id: _2a9.id + "_button",
                parent: this.parent
            })).placeAt(this.domNode);
            this.containerNode = dojo.place("<div class='dijitAccordionChildWrapper' style='display:none'>", this.domNode);
            dojo.place(this.contentWidget.domNode, this.containerNode);
        },
        postCreate: function() {
            this.inherited(arguments);
            var _2aa = this.button;
            this._contentWidgetWatches = [this.contentWidget.watch("title", dojo.hitch(this, function(name, _2ab, _2ac) {
                _2aa.set("label", _2ac);
            })), this.contentWidget.watch("tooltip", dojo.hitch(this, function(name, _2ad, _2ae) {
                _2aa.set("title", _2ae);
            })), this.contentWidget.watch("iconClass", dojo.hitch(this, function(name, _2af, _2b0) {
                _2aa.set("iconClass", _2b0);
            }))];
        },
        _setSelectedAttr: function(_2b1) {
            this._set("selected", _2b1);
            this.button.set("selected", _2b1);
            if (_2b1) {
                var cw = this.contentWidget;
                if (cw.onSelected) {
                    cw.onSelected();
                }
            }
        },
        startup: function() {
            this.contentWidget.startup();
        },
        destroy: function() {
            this.button.destroyRecursive();
            dojo.forEach(this._contentWidgetWatches || [], function(w) {
                w.unwatch();
            });
            delete this.contentWidget._buttonWidget;
            delete this.contentWidget._wrapperWidget;
            this.inherited(arguments);
        },
        destroyDescendants: function() {
            this.contentWidget.destroyRecursive();
        }
    });
    dojo.declare("dijit.layout._AccordionButton", [dijit._Widget, dijit._Templated, dijit._CssStateMixin], {
        templateString: dojo.cache("dijit.layout", "templates/AccordionButton.html", "<div dojoAttachEvent='onclick:_onTitleClick' class='dijitAccordionTitle'>\r\n\t<div dojoAttachPoint='titleNode,focusNode' dojoAttachEvent='onkeypress:_onTitleKeyPress'\r\n\t\t\tclass='dijitAccordionTitleFocus' role=\"tab\" aria-expanded=\"false\"\r\n\t\t><span class='dijitInline dijitAccordionArrow' role=\"presentation\"></span\r\n\t\t><span class='arrowTextUp' role=\"presentation\">+</span\r\n\t\t><span class='arrowTextDown' role=\"presentation\">-</span\r\n\t\t><img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon\" dojoAttachPoint='iconNode' style=\"vertical-align: middle\" role=\"presentation\"/>\r\n\t\t<span role=\"presentation\" dojoAttachPoint='titleTextNode' class='dijitAccordionText'></span>\r\n\t</div>\r\n</div>\r\n"),
        attributeMap: dojo.mixin(dojo.clone(dijit.layout.ContentPane.prototype.attributeMap), {
            label: {
                node: "titleTextNode",
                type: "innerHTML"
            },
            title: {
                node: "titleTextNode",
                type: "attribute",
                attribute: "title"
            },
            iconClass: {
                node: "iconNode",
                type: "class"
            }
        }),
        baseClass: "dijitAccordionTitle",
        getParent: function() {
            return this.parent;
        },
        buildRendering: function() {
            this.inherited(arguments);
            var _2b2 = this.id.replace(" ", "_");
            dojo.attr(this.titleTextNode, "id", _2b2 + "_title");
            dijit.setWaiState(this.focusNode, "labelledby", dojo.attr(this.titleTextNode, "id"));
            dojo.setSelectable(this.domNode, false);
        },
        getTitleHeight: function() {
            return dojo._getMarginSize(this.domNode).h;
        },
        _onTitleClick: function() {
            var _2b3 = this.getParent();
            _2b3.selectChild(this.contentWidget, true);
            dijit.focus(this.focusNode);
        },
        _onTitleKeyPress: function(evt) {
            return this.getParent()._onKeyPress(evt, this.contentWidget);
        },
        _setSelectedAttr: function(_2b4) {
            this._set("selected", _2b4);
            dijit.setWaiState(this.focusNode, "expanded", _2b4);
            dijit.setWaiState(this.focusNode, "selected", _2b4);
            this.focusNode.setAttribute("tabIndex", _2b4 ? "0" : "-1");
        }
    });
}
if (!dojo._hasResource["dijit.Tooltip"]) {
    dojo._hasResource["dijit.Tooltip"] = true;
    dojo.provide("dijit.Tooltip");
    dojo.declare("dijit._MasterTooltip", [dijit._Widget, dijit._Templated], {
        duration: dijit.defaultDuration,
        templateString: dojo.cache("dijit", "templates/Tooltip.html", "<div class=\"dijitTooltip dijitTooltipLeft\" id=\"dojoTooltip\"\r\n\t><div class=\"dijitTooltipContainer dijitTooltipContents\" dojoAttachPoint=\"containerNode\" role='alert'></div\r\n\t><div class=\"dijitTooltipConnector\" dojoAttachPoint=\"connectorNode\"></div\r\n></div>\r\n"),
        postCreate: function() {
            dojo.body().appendChild(this.domNode);
            this.bgIframe = new dijit.BackgroundIframe(this.domNode);
            this.fadeIn = dojo.fadeIn({
                node: this.domNode,
                duration: this.duration,
                onEnd: dojo.hitch(this, "_onShow")
            });
            this.fadeOut = dojo.fadeOut({
                node: this.domNode,
                duration: this.duration,
                onEnd: dojo.hitch(this, "_onHide")
            });
        },
        show: function(_2b5, _2b6, _2b7, rtl) {
            if (this.aroundNode && this.aroundNode === _2b6) {
                return;
            }
            this.domNode.width = "auto";
            if (this.fadeOut.status() == "playing") {
                this._onDeck = arguments;
                return;
            }
            this.containerNode.innerHTML = _2b5;
            var pos = dijit.placeOnScreenAroundElement(this.domNode, _2b6, dijit.getPopupAroundAlignment((_2b7 && _2b7.length) ? _2b7 : dijit.Tooltip.defaultPosition, !rtl), dojo.hitch(this, "orient"));
            dojo.style(this.domNode, "opacity", 0);
            this.fadeIn.play();
            this.isShowingNow = true;
            this.aroundNode = _2b6;
        },
        orient: function(node, _2b8, _2b9, _2ba, _2bb) {
            this.connectorNode.style.top = "";
            var _2bc = _2ba.w - this.connectorNode.offsetWidth;
            node.className = "dijitTooltip " + {
                "BL-TL": "dijitTooltipBelow dijitTooltipABLeft",
                "TL-BL": "dijitTooltipAbove dijitTooltipABLeft",
                "BR-TR": "dijitTooltipBelow dijitTooltipABRight",
                "TR-BR": "dijitTooltipAbove dijitTooltipABRight",
                "BR-BL": "dijitTooltipRight",
                "BL-BR": "dijitTooltipLeft"
            }[_2b8 + "-" + _2b9];
            this.domNode.style.width = "auto";
            var size = dojo.contentBox(this.domNode);
            var _2bd = Math.min((Math.max(_2bc, 1)), size.w);
            var _2be = _2bd < size.w;
            this.domNode.style.width = _2bd + "px";
            if (_2be) {
                this.containerNode.style.overflow = "auto";
                var _2bf = this.containerNode.scrollWidth;
                this.containerNode.style.overflow = "visible";
                if (_2bf > _2bd) {
                    _2bf = _2bf + dojo.style(this.domNode, "paddingLeft") + dojo.style(this.domNode, "paddingRight");
                    this.domNode.style.width = _2bf + "px";
                }
            }
            if (_2b9.charAt(0) == "B" && _2b8.charAt(0) == "B") {
                var mb = dojo.marginBox(node);
                var _2c0 = this.connectorNode.offsetHeight;
                if (mb.h > _2ba.h) {
                    var _2c1 = _2ba.h - (_2bb.h / 2) - (_2c0 / 2);
                    this.connectorNode.style.top = _2c1 + "px";
                    this.connectorNode.style.bottom = "";
                } else {
                    this.connectorNode.style.bottom = Math.min(Math.max(_2bb.h / 2 - _2c0 / 2, 0), mb.h - _2c0) + "px";
                    this.connectorNode.style.top = "";
                }
            } else {
                this.connectorNode.style.top = "";
                this.connectorNode.style.bottom = "";
            }
            return Math.max(0, size.w - _2bc);
        },
        _onShow: function() {
            if (dojo.isIE) {
                this.domNode.style.filter = "";
            }
        },
        hide: function(_2c2) {
            if (this._onDeck && this._onDeck[1] == _2c2) {
                this._onDeck = null;
            } else {
                if (this.aroundNode === _2c2) {
                    this.fadeIn.stop();
                    this.isShowingNow = false;
                    this.aroundNode = null;
                    this.fadeOut.play();
                } else {}
            }
        },
        _onHide: function() {
            this.domNode.style.cssText = "";
            this.containerNode.innerHTML = "";
            if (this._onDeck) {
                this.show.apply(this, this._onDeck);
                this._onDeck = null;
            }
        }
    });
    dijit.showTooltip = function(_2c3, _2c4, _2c5, rtl) {
        if (!dijit._masterTT) {
            dijit._masterTT = new dijit._MasterTooltip();
        }
        return dijit._masterTT.show(_2c3, _2c4, _2c5, rtl);
    }
    ;
    dijit.hideTooltip = function(_2c6) {
        if (!dijit._masterTT) {
            dijit._masterTT = new dijit._MasterTooltip();
        }
        return dijit._masterTT.hide(_2c6);
    }
    ;
    dojo.declare("dijit.Tooltip", dijit._Widget, {
        label: "",
        showDelay: 400,
        connectId: [],
        position: [],
        _setConnectIdAttr: function(_2c7) {
            dojo.forEach(this._connections || [], function(_2c8) {
                dojo.forEach(_2c8, dojo.hitch(this, "disconnect"));
            }, this);
            var ary = dojo.isArrayLike(_2c7) ? _2c7 : (_2c7 ? [_2c7] : []);
            this._connections = dojo.map(ary, function(id) {
                var node = dojo.byId(id);
                return node ? [this.connect(node, "onmouseenter", "_onTargetMouseEnter"), this.connect(node, "onmouseleave", "_onTargetMouseLeave"), this.connect(node, "onfocus", "_onTargetFocus"), this.connect(node, "onblur", "_onTargetBlur")] : [];
            }, this);
            this._set("connectId", _2c7);
            this._connectIds = ary;
        },
        addTarget: function(node) {
            var id = node.id || node;
            if (dojo.indexOf(this._connectIds, id) == -1) {
                this.set("connectId", this._connectIds.concat(id));
            }
        },
        removeTarget: function(node) {
            var id = node.id || node
              , idx = dojo.indexOf(this._connectIds, id);
            if (idx >= 0) {
                this._connectIds.splice(idx, 1);
                this.set("connectId", this._connectIds);
            }
        },
        buildRendering: function() {
            this.inherited(arguments);
            dojo.addClass(this.domNode, "dijitTooltipData");
        },
        startup: function() {
            this.inherited(arguments);
            var ids = this.connectId;
            dojo.forEach(dojo.isArrayLike(ids) ? ids : [ids], this.addTarget, this);
        },
        _onTargetMouseEnter: function(e) {
            this._onHover(e);
        },
        _onTargetMouseLeave: function(e) {
            this._onUnHover(e);
        },
        _onTargetFocus: function(e) {
            this._focus = true;
            this._onHover(e);
        },
        _onTargetBlur: function(e) {
            this._focus = false;
            this._onUnHover(e);
        },
        _onHover: function(e) {
            if (!this._showTimer) {
                var _2c9 = e.target;
                this._showTimer = setTimeout(dojo.hitch(this, function() {
                    this.open(_2c9);
                }), this.showDelay);
            }
        },
        _onUnHover: function(e) {
            if (this._focus) {
                return;
            }
            if (this._showTimer) {
                clearTimeout(this._showTimer);
                delete this._showTimer;
            }
            this.close();
        },
        open: function(_2ca) {
            if (this._showTimer) {
                clearTimeout(this._showTimer);
                delete this._showTimer;
            }
            dijit.showTooltip(this.label || this.domNode.innerHTML, _2ca, this.position, !this.isLeftToRight());
            this._connectNode = _2ca;
            this.onShow(_2ca, this.position);
        },
        close: function() {
            if (this._connectNode) {
                dijit.hideTooltip(this._connectNode);
                delete this._connectNode;
                this.onHide();
            }
            if (this._showTimer) {
                clearTimeout(this._showTimer);
                delete this._showTimer;
            }
        },
        onShow: function(_2cb, _2cc) {},
        onHide: function() {},
        uninitialize: function() {
            this.close();
            this.inherited(arguments);
        }
    });
    dijit.Tooltip.defaultPosition = ["after", "before"];
}
if (!dojo._hasResource["dojo.data.util.sorter"]) {
    dojo._hasResource["dojo.data.util.sorter"] = true;
    dojo.provide("dojo.data.util.sorter");
    dojo.getObject("data.util.sorter", true, dojo);
    dojo.data.util.sorter.basicComparator = function(a, b) {
        var r = -1;
        if (a === null) {
            a = undefined;
        }
        if (b === null) {
            b = undefined;
        }
        if (a == b) {
            r = 0;
        } else {
            if (a > b || a == null) {
                r = 1;
            }
        }
        return r;
    }
    ;
    dojo.data.util.sorter.createSortFunction = function(_2cd, _2ce) {
        var _2cf = [];
        function _2d0(attr, dir, comp, s) {
            return function(_2d1, _2d2) {
                var a = s.getValue(_2d1, attr);
                var b = s.getValue(_2d2, attr);
                return dir * comp(a, b);
            }
            ;
        }
        ;var _2d3;
        var map = _2ce.comparatorMap;
        var bc = dojo.data.util.sorter.basicComparator;
        for (var i = 0; i < _2cd.length; i++) {
            _2d3 = _2cd[i];
            var attr = _2d3.attribute;
            if (attr) {
                var dir = (_2d3.descending) ? -1 : 1;
                var comp = bc;
                if (map) {
                    if (typeof attr !== "string" && ("toString"in attr)) {
                        attr = attr.toString();
                    }
                    comp = map[attr] || bc;
                }
                _2cf.push(_2d0(attr, dir, comp, _2ce));
            }
        }
        return function(rowA, rowB) {
            var i = 0;
            while (i < _2cf.length) {
                var ret = _2cf[i++](rowA, rowB);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        }
        ;
    }
    ;
}
if (!dojo._hasResource["dojo.data.util.simpleFetch"]) {
    dojo._hasResource["dojo.data.util.simpleFetch"] = true;
    dojo.provide("dojo.data.util.simpleFetch");
    dojo.getObject("data.util.simpleFetch", true, dojo);
    dojo.data.util.simpleFetch.fetch = function(_2d4) {
        _2d4 = _2d4 || {};
        if (!_2d4.store) {
            _2d4.store = this;
        }
        var self = this;
        var _2d5 = function(_2d6, _2d7) {
            if (_2d7.onError) {
                var _2d8 = _2d7.scope || dojo.global;
                _2d7.onError.call(_2d8, _2d6, _2d7);
            }
        };
        var _2d9 = function(_2da, _2db) {
            var _2dc = _2db.abort || null;
            var _2dd = false;
            var _2de = _2db.start ? _2db.start : 0;
            var _2df = (_2db.count && (_2db.count !== Infinity)) ? (_2de + _2db.count) : _2da.length;
            _2db.abort = function() {
                _2dd = true;
                if (_2dc) {
                    _2dc.call(_2db);
                }
            }
            ;
            var _2e0 = _2db.scope || dojo.global;
            if (!_2db.store) {
                _2db.store = self;
            }
            if (_2db.onBegin) {
                _2db.onBegin.call(_2e0, _2da.length, _2db);
            }
            if (_2db.sort) {
                _2da.sort(dojo.data.util.sorter.createSortFunction(_2db.sort, self));
            }
            if (_2db.onItem) {
                for (var i = _2de; (i < _2da.length) && (i < _2df); ++i) {
                    var item = _2da[i];
                    if (!_2dd) {
                        _2db.onItem.call(_2e0, item, _2db);
                    }
                }
            }
            if (_2db.onComplete && !_2dd) {
                var _2e1 = null;
                if (!_2db.onItem) {
                    _2e1 = _2da.slice(_2de, _2df);
                }
                _2db.onComplete.call(_2e0, _2e1, _2db);
            }
        };
        this._fetchItems(_2d4, _2d9, _2d5);
        return _2d4;
    }
    ;
}
if (!dojo._hasResource["dojo.data.util.filter"]) {
    dojo._hasResource["dojo.data.util.filter"] = true;
    dojo.provide("dojo.data.util.filter");
    dojo.getObject("data.util.filter", true, dojo);
    dojo.data.util.filter.patternToRegExp = function(_2e2, _2e3) {
        var rxp = "^";
        var c = null;
        for (var i = 0; i < _2e2.length; i++) {
            c = _2e2.charAt(i);
            switch (c) {
            case "\\":
                rxp += c;
                i++;
                rxp += _2e2.charAt(i);
                break;
            case "*":
                rxp += ".*";
                break;
            case "?":
                rxp += ".";
                break;
            case "$":
            case "^":
            case "/":
            case "+":
            case ".":
            case "|":
            case "(":
            case ")":
            case "{":
            case "}":
            case "[":
            case "]":
                rxp += "\\";
            default:
                rxp += c;
            }
        }
        rxp += "$";
        if (_2e3) {
            return new RegExp(rxp,"mi");
        } else {
            return new RegExp(rxp,"m");
        }
    }
    ;
}
if (!dojo._hasResource["dijit.form.TextBox"]) {
    dojo._hasResource["dijit.form.TextBox"] = true;
    dojo.provide("dijit.form.TextBox");
    dojo.declare("dijit.form.TextBox", dijit.form._FormValueWidget, {
        trim: false,
        uppercase: false,
        lowercase: false,
        propercase: false,
        maxLength: "",
        selectOnClick: false,
        placeHolder: "",
        templateString: dojo.cache("dijit.form", "templates/TextBox.html", "<div class=\"dijit dijitReset dijitInline dijitLeft\" id=\"widget_${id}\" role=\"presentation\"\r\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\r\n\t\t><input class=\"dijitReset dijitInputInner\" dojoAttachPoint='textbox,focusNode' autocomplete=\"off\"\r\n\t\t\t${!nameAttrSetting} type='${type}'\r\n\t/></div\r\n></div>\r\n"),
        _singleNodeTemplate: "<input class=\"dijit dijitReset dijitLeft dijitInputField\" dojoAttachPoint=\"textbox,focusNode\" autocomplete=\"off\" type=\"${type}\" ${!nameAttrSetting} />",
        _buttonInputDisabled: dojo.isIE ? "disabled" : "",
        baseClass: "dijitTextBox",
        attributeMap: dojo.delegate(dijit.form._FormValueWidget.prototype.attributeMap, {
            maxLength: "focusNode"
        }),
        postMixInProperties: function() {
            var type = this.type.toLowerCase();
            if (this.templateString && this.templateString.toLowerCase() == "input" || ((type == "hidden" || type == "file") && this.templateString == dijit.form.TextBox.prototype.templateString)) {
                this.templateString = this._singleNodeTemplate;
            }
            this.inherited(arguments);
        },
        _setPlaceHolderAttr: function(v) {
            this._set("placeHolder", v);
            if (!this._phspan) {
                this._attachPoints.push("_phspan");
                this._phspan = dojo.create("span", {
                    className: "dijitPlaceHolder dijitInputField"
                }, this.textbox, "after");
            }
            this._phspan.innerHTML = "";
            this._phspan.appendChild(document.createTextNode(v));
            this._updatePlaceHolder();
        },
        _updatePlaceHolder: function() {
            if (this._phspan) {
                this._phspan.style.display = (this.placeHolder && !this._focused && !this.textbox.value) ? "" : "none";
            }
        },
        _getValueAttr: function() {
            return this.parse(this.get("displayedValue"), this.constraints);
        },
        _setValueAttr: function(_2e4, _2e5, _2e6) {
            var _2e7;
            if (_2e4 !== undefined) {
                _2e7 = this.filter(_2e4);
                if (typeof _2e6 != "string") {
                    if (_2e7 !== null && ((typeof _2e7 != "number") || !isNaN(_2e7))) {
                        _2e6 = this.filter(this.format(_2e7, this.constraints));
                    } else {
                        _2e6 = "";
                    }
                }
            }
            if (_2e6 != null && _2e6 != undefined && ((typeof _2e6) != "number" || !isNaN(_2e6)) && this.textbox.value != _2e6) {
                this.textbox.value = _2e6;
                this._set("displayedValue", this.get("displayedValue"));
            }
            this._updatePlaceHolder();
            this.inherited(arguments, [_2e7, _2e5]);
        },
        displayedValue: "",
        getDisplayedValue: function() {
            dojo.deprecated(this.declaredClass + "::getDisplayedValue() is deprecated. Use set('displayedValue') instead.", "", "2.0");
            return this.get("displayedValue");
        },
        _getDisplayedValueAttr: function() {
            return this.filter(this.textbox.value);
        },
        setDisplayedValue: function(_2e8) {
            dojo.deprecated(this.declaredClass + "::setDisplayedValue() is deprecated. Use set('displayedValue', ...) instead.", "", "2.0");
            this.set("displayedValue", _2e8);
        },
        _setDisplayedValueAttr: function(_2e9) {
            if (_2e9 === null || _2e9 === undefined) {
                _2e9 = "";
            } else {
                if (typeof _2e9 != "string") {
                    _2e9 = String(_2e9);
                }
            }
            this.textbox.value = _2e9;
            this._setValueAttr(this.get("value"), undefined);
            this._set("displayedValue", this.get("displayedValue"));
        },
        format: function(_2ea, _2eb) {
            return ( (_2ea == null || _2ea == undefined) ? "" : (_2ea.toString ? _2ea.toString() : _2ea)) ;
        },
        parse: function(_2ec, _2ed) {
            return _2ec;
        },
        _refreshState: function() {},
        _onInput: function(e) {
            if (e && e.type && /key/i.test(e.type) && e.keyCode) {
                switch (e.keyCode) {
                case dojo.keys.SHIFT:
                case dojo.keys.ALT:
                case dojo.keys.CTRL:
                case dojo.keys.TAB:
                    return;
                }
            }
            if (this.intermediateChanges) {
                var _2ee = this;
                setTimeout(function() {
                    _2ee._handleOnChange(_2ee.get("value"), false);
                }, 0);
            }
            this._refreshState();
            this._set("displayedValue", this.get("displayedValue"));
        },
        postCreate: function() {
            if (dojo.isIE) {
                setTimeout(dojo.hitch(this, function() {
                    var s = dojo.getComputedStyle(this.domNode);
                    if (s) {
                        var ff = s.fontFamily;
                        if (ff) {
                            var _2ef = this.domNode.getElementsByTagName("INPUT");
                            if (_2ef) {
                                for (var i = 0; i < _2ef.length; i++) {
                                    _2ef[i].style.fontFamily = ff;
                                }
                            }
                        }
                    }
                }), 0);
            }
            this.textbox.setAttribute("value", this.textbox.value);
            this.inherited(arguments);
            if (dojo.isMoz || dojo.isOpera) {
                this.connect(this.textbox, "oninput", "_onInput");
            } else {
                this.connect(this.textbox, "onkeydown", "_onInput");
                this.connect(this.textbox, "onkeyup", "_onInput");
                this.connect(this.textbox, "onpaste", "_onInput");
                this.connect(this.textbox, "oncut", "_onInput");
            }
        },
        _blankValue: "",
        filter: function(val) {
            if (val === null) {
                return this._blankValue;
            }
            if (typeof val != "string") {
                return val;
            }
            if (this.trim) {
                val = dojo.trim(val);
            }
            if (this.uppercase) {
                val = val.toUpperCase();
            }
            if (this.lowercase) {
                val = val.toLowerCase();
            }
            if (this.propercase) {
                val = val.replace(/[^\s]+/g, function(word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1);
                });
            }
            return val;
        },
        _setBlurValue: function() {
            this._setValueAttr(this.get("value"), true);
        },
        _onBlur: function(e) {
            if (this.disabled) {
                return;
            }
            this._setBlurValue();
            this.inherited(arguments);
            if (this._selectOnClickHandle) {
                this.disconnect(this._selectOnClickHandle);
            }
            if (this.selectOnClick && dojo.isMoz) {
                this.textbox.selectionStart = this.textbox.selectionEnd = undefined;
            }
            this._updatePlaceHolder();
        },
        _onFocus: function(by) {
            if (this.disabled || this.readOnly) {
                return;
            }
            if (this.selectOnClick && by == "mouse") {
                this._selectOnClickHandle = this.connect(this.domNode, "onmouseup", function() {
                    this.disconnect(this._selectOnClickHandle);
                    var _2f0;
                    if (dojo.isIE) {
                        var _2f1 = dojo.doc.selection.createRange();
                        var _2f2 = _2f1.parentElement();
                        _2f0 = _2f2 == this.textbox && _2f1.text.length == 0;
                    } else {
                        _2f0 = this.textbox.selectionStart == this.textbox.selectionEnd;
                    }
                    if (_2f0) {
                        dijit.selectInputText(this.textbox);
                    }
                });
            }
            this._updatePlaceHolder();
            this.inherited(arguments);
            this._refreshState();
        },
        reset: function() {
            this.textbox.value = "";
            this.inherited(arguments);
        }
    });
    dijit.selectInputText = function(_2f3, _2f4, stop) {
        var _2f5 = dojo.global;
        var _2f6 = dojo.doc;
        _2f3 = dojo.byId(_2f3);
        if (isNaN(_2f4)) {
            _2f4 = 0;
        }
        if (isNaN(stop)) {
            stop = _2f3.value ? _2f3.value.length : 0;
        }
        dijit.focus(_2f3);
        if (_2f6["selection"] && dojo.body()["createTextRange"]) {
            if (_2f3.createTextRange) {
                var r = _2f3.createTextRange();
                r.collapse(true);
                r.moveStart("character", -99999);
                r.moveStart("character", _2f4);
                r.moveEnd("character", stop - _2f4);
                r.select();
            }
        } else {
            if (_2f5["getSelection"]) {
                if (_2f3.setSelectionRange) {
                    _2f3.setSelectionRange(_2f4, stop);
                }
            }
        }
    }
    ;
}
if (!dojo._hasResource["dijit.form.ValidationTextBox"]) {
    dojo._hasResource["dijit.form.ValidationTextBox"] = true;
    dojo.provide("dijit.form.ValidationTextBox");
    dojo.declare("dijit.form.ValidationTextBox", dijit.form.TextBox, {
        templateString: dojo.cache("dijit.form", "templates/ValidationTextBox.html", "<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\r\n\tid=\"widget_${id}\" role=\"presentation\"\r\n\t><div class='dijitReset dijitValidationContainer'\r\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935;\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\r\n\t/></div\r\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\r\n\t\t><input class=\"dijitReset dijitInputInner\" dojoAttachPoint='textbox,focusNode' autocomplete=\"off\"\r\n\t\t\t${!nameAttrSetting} type='${type}'\r\n\t/></div\r\n></div>\r\n"),
        baseClass: "dijitTextBox dijitValidationTextBox",
        required: false,
        promptMessage: "",
        invalidMessage: "$_unset_$",
        missingMessage: "$_unset_$",
        message: "",
        constraints: {},
        regExp: ".*",
        regExpGen: function(_2f7) {
            return this.regExp;
        },
        state: "",
        tooltipPosition: [],
        _setValueAttr: function() {
            this.inherited(arguments);
            this.validate(this._focused);
        },
        validator: function(_2f8, _2f9) {
            return (new RegExp("^(?:" + this.regExpGen(_2f9) + ")" + (this.required ? "" : "?") + "$")).test(_2f8) && (!this.required || !this._isEmpty(_2f8)) && (this._isEmpty(_2f8) || this.parse(_2f8, _2f9) !== undefined);
        },
        _isValidSubset: function() {
            return this.textbox.value.search(this._partialre) == 0;
        },
        isValid: function(_2fa) {
            return this.validator(this.textbox.value, this.constraints);
        },
        _isEmpty: function(_2fb) {
            return (this.trim ? /^\s*$/ : /^$/).test(_2fb);
        },
        getErrorMessage: function(_2fc) {
            return (this.required && this._isEmpty(this.textbox.value)) ? this.missingMessage : this.invalidMessage;
        },
        getPromptMessage: function(_2fd) {
            return this.promptMessage;
        },
        _maskValidSubsetError: true,
        validate: function(_2fe) {
            var _2ff = "";
            var _300 = this.disabled || this.isValid(_2fe);
            if (_300) {
                this._maskValidSubsetError = true;
            }
            var _301 = this._isEmpty(this.textbox.value);
            var _302 = !_300 && _2fe && this._isValidSubset();
            this._set("state", _300 ? "" : (((((!this._hasBeenBlurred || _2fe) && _301) || _302) && this._maskValidSubsetError) ? "Incomplete" : "Error"));
            dijit.setWaiState(this.focusNode, "invalid", _300 ? "false" : "true");
            if (this.state == "Error") {
                this._maskValidSubsetError = _2fe && _302;
                _2ff = this.getErrorMessage(_2fe);
            } else {
                if (this.state == "Incomplete") {
                    _2ff = this.getPromptMessage(_2fe);
                    this._maskValidSubsetError = !this._hasBeenBlurred || _2fe;
                } else {
                    if (_301) {
                        _2ff = this.getPromptMessage(_2fe);
                    }
                }
            }
            this.set("message", _2ff);
            return _300;
        },
        displayMessage: function(_303) {
            dijit.hideTooltip(this.domNode);
            if (_303 && this._focused) {
                dijit.showTooltip(_303, this.domNode, this.tooltipPosition, !this.isLeftToRight());
            }
        },
        _refreshState: function() {
            this.validate(this._focused);
            this.inherited(arguments);
        },
        constructor: function() {
            this.constraints = {};
        },
        _setConstraintsAttr: function(_304) {
            if (!_304.locale && this.lang) {
                _304.locale = this.lang;
            }
            this._set("constraints", _304);
            this._computePartialRE();
        },
        _computePartialRE: function() {
            var p = this.regExpGen(this.constraints);
            this.regExp = p;
            var _305 = "";
            if (p != ".*") {
                this.regExp.replace(/\\.|\[\]|\[.*?[^\\]{1}\]|\{.*?\}|\(\?[=:!]|./g, function(re) {
                    switch (re.charAt(0)) {
                    case "{":
                    case "+":
                    case "?":
                    case "*":
                    case "^":
                    case "$":
                    case "|":
                    case "(":
                        _305 += re;
                        break;
                    case ")":
                        _305 += "|$)";
                        break;
                    default:
                        _305 += "(?:" + re + "|$)";
                        break;
                    }
                });
            }
            try {
                "".search(_305);
            } catch (e) {
                _305 = this.regExp;
                console.warn("RegExp error in " + this.declaredClass + ": " + this.regExp);
            }
            this._partialre = "^(?:" + _305 + ")$";
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this.messages = dojo.i18n.getLocalization("dijit.form", "validate", this.lang);
            if (this.invalidMessage == "$_unset_$") {
                this.invalidMessage = this.messages.invalidMessage;
            }
            if (!this.invalidMessage) {
                this.invalidMessage = this.promptMessage;
            }
            if (this.missingMessage == "$_unset_$") {
                this.missingMessage = this.messages.missingMessage;
            }
            if (!this.missingMessage) {
                this.missingMessage = this.invalidMessage;
            }
            this._setConstraintsAttr(this.constraints);
        },
        _setDisabledAttr: function(_306) {
            this.inherited(arguments);
            this._refreshState();
        },
        _setRequiredAttr: function(_307) {
            this._set("required", _307);
            dijit.setWaiState(this.focusNode, "required", _307);
            this._refreshState();
        },
        _setMessageAttr: function(_308) {
            this._set("message", _308);
            this.displayMessage(_308);
        },
        reset: function() {
            this._maskValidSubsetError = true;
            this.inherited(arguments);
        },
        _onBlur: function() {
            this.displayMessage("");
            this.inherited(arguments);
        }
    });
    dojo.declare("dijit.form.MappedTextBox", dijit.form.ValidationTextBox, {
        postMixInProperties: function() {
            this.inherited(arguments);
            this.nameAttrSetting = "";
        },
        serialize: function(val, _309) {
            return val.toString ? val.toString() : "";
        },
        toString: function() {
            var val = this.filter(this.get("value"));
            return val != null ? (typeof val == "string" ? val : this.serialize(val, this.constraints)) : "";
        },
        validate: function() {
            this.valueNode.value = this.toString();
            return this.inherited(arguments);
        },
        buildRendering: function() {
            this.inherited(arguments);
            this.valueNode = dojo.place("<input type='hidden'" + (this.name ? " name='" + this.name.replace(/'/g, "&quot;") + "'" : "") + "/>", this.textbox, "after");
        },
        reset: function() {
            this.valueNode.value = "";
            this.inherited(arguments);
        }
    });
    dojo.declare("dijit.form.RangeBoundTextBox", dijit.form.MappedTextBox, {
        rangeMessage: "",
        rangeCheck: function(_30a, _30b) {
            return ("min"in _30b ? (this.compare(_30a, _30b.min) >= 0) : true) && ("max"in _30b ? (this.compare(_30a, _30b.max) <= 0) : true);
        },
        isInRange: function(_30c) {
            return this.rangeCheck(this.get("value"), this.constraints);
        },
        _isDefinitelyOutOfRange: function() {
            var val = this.get("value");
            var _30d = false;
            var _30e = false;
            if ("min"in this.constraints) {
                var min = this.constraints.min;
                min = this.compare(val, ((typeof min == "number") && min >= 0 && val != 0) ? 0 : min);
                _30d = (typeof min == "number") && min < 0;
            }
            if ("max"in this.constraints) {
                var max = this.constraints.max;
                max = this.compare(val, ((typeof max != "number") || max > 0) ? max : 0);
                _30e = (typeof max == "number") && max > 0;
            }
            return _30d || _30e;
        },
        _isValidSubset: function() {
            return this.inherited(arguments) && !this._isDefinitelyOutOfRange();
        },
        isValid: function(_30f) {
            return this.inherited(arguments) && ((this._isEmpty(this.textbox.value) && !this.required) || this.isInRange(_30f));
        },
        getErrorMessage: function(_310) {
            var v = this.get("value");
            if (v !== null && v !== "" && v !== undefined && (typeof v != "number" || !isNaN(v)) && !this.isInRange(_310)) {
                return this.rangeMessage;
            }
            return this.inherited(arguments);
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            if (!this.rangeMessage) {
                this.messages = dojo.i18n.getLocalization("dijit.form", "validate", this.lang);
                this.rangeMessage = this.messages.rangeMessage;
            }
        },
        _setConstraintsAttr: function(_311) {
            this.inherited(arguments);
            if (this.focusNode) {
                if (this.constraints.min !== undefined) {
                    dijit.setWaiState(this.focusNode, "valuemin", this.constraints.min);
                } else {
                    dijit.removeWaiState(this.focusNode, "valuemin");
                }
                if (this.constraints.max !== undefined) {
                    dijit.setWaiState(this.focusNode, "valuemax", this.constraints.max);
                } else {
                    dijit.removeWaiState(this.focusNode, "valuemax");
                }
            }
        },
        _setValueAttr: function(_312, _313) {
            dijit.setWaiState(this.focusNode, "valuenow", _312);
            this.inherited(arguments);
        }
    });
}
if (!dojo._hasResource["dijit.form.ComboBox"]) {
    dojo._hasResource["dijit.form.ComboBox"] = true;
    dojo.provide("dijit.form.ComboBox");
    dojo.declare("dijit.form.ComboBoxMixin", dijit._HasDropDown, {
        item: null,
        pageSize: Infinity,
        store: null,
        fetchProperties: {},
        query: {},
        autoComplete: true,
        highlightMatch: "first",
        searchDelay: 100,
        searchAttr: "name",
        labelAttr: "",
        labelType: "text",
        queryExpr: "${0}*",
        ignoreCase: true,
        hasDownArrow: true,
        templateString: dojo.cache("dijit.form", "templates/DropDownBox.html", "<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\r\n\tid=\"widget_${id}\"\r\n\trole=\"combobox\"\r\n\t><div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer'\r\n\t\tdojoAttachPoint=\"_buttonNode, _popupStateNode\" role=\"presentation\"\r\n\t\t><input class=\"dijitReset dijitInputField dijitArrowButtonInner\" value=\"&#9660; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\r\n\t\t\t${_buttonInputDisabled}\r\n\t/></div\r\n\t><div class='dijitReset dijitValidationContainer'\r\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935;\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\r\n\t/></div\r\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\r\n\t\t><input class='dijitReset dijitInputInner' ${!nameAttrSetting} type=\"text\" autocomplete=\"off\"\r\n\t\t\tdojoAttachPoint=\"textbox,focusNode\" role=\"textbox\" aria-haspopup=\"true\"\r\n\t/></div\r\n></div>\r\n"),
        baseClass: "dijitTextBox dijitComboBox",
        dropDownClass: "dijit.form._ComboBoxMenu",
        cssStateNodes: {
            "_buttonNode": "dijitDownArrowButton"
        },
        maxHeight: -1,
        _getCaretPos: function(_314) {
            var pos = 0;
            if (typeof (_314.selectionStart) == "number") {
                pos = _314.selectionStart;
            } else {
                if (dojo.isIE) {
                    var tr = dojo.doc.selection.createRange().duplicate();
                    var ntr = _314.createTextRange();
                    tr.move("character", 0);
                    ntr.move("character", 0);
                    try {
                        ntr.setEndPoint("EndToEnd", tr);
                        pos = String(ntr.text).replace(/\r/g, "").length;
                    } catch (e) {}
                }
            }
            return pos;
        },
        _setCaretPos: function(_315, _316) {
            _316 = parseInt(_316);
            dijit.selectInputText(_315, _316, _316);
        },
        _setDisabledAttr: function(_317) {
            this.inherited(arguments);
            dijit.setWaiState(this.domNode, "disabled", _317);
        },
        _abortQuery: function() {
            if (this.searchTimer) {
                clearTimeout(this.searchTimer);
                this.searchTimer = null;
            }
            if (this._fetchHandle) {
                if (this._fetchHandle.abort) {
                    this._fetchHandle.abort();
                }
                this._fetchHandle = null;
            }
        },
        _onInput: function(evt) {
            if (!this.searchTimer && (evt.type == "paste" || evt.type == "input") && this._lastInput != this.textbox.value) {
                this.searchTimer = setTimeout(dojo.hitch(this, function() {
                    this._onKey({
                        charOrCode: 229
                    });
                }), 100);
            }
            this.inherited(arguments);
        },
        _onKey: function(evt) {
            var key = evt.charOrCode;
            if (evt.altKey || ((evt.ctrlKey || evt.metaKey) && (key != "x" && key != "v")) || key == dojo.keys.SHIFT) {
                return;
            }
            var _318 = false;
            var pw = this.dropDown;
            var dk = dojo.keys;
            var _319 = null;
            this._prev_key_backspace = false;
            this._abortQuery();
            this.inherited(arguments);
            if (this._opened) {
                _319 = pw.getHighlightedOption();
            }
            switch (key) {
            case dk.PAGE_DOWN:
            case dk.DOWN_ARROW:
            case dk.PAGE_UP:
            case dk.UP_ARROW:
                if (this._opened) {
                    this._announceOption(_319);
                }
                dojo.stopEvent(evt);
                break;
            case dk.ENTER:
                if (_319) {
                    if (_319 == pw.nextButton) {
                        this._nextSearch(1);
                        dojo.stopEvent(evt);
                        break;
                    } else {
                        if (_319 == pw.previousButton) {
                            this._nextSearch(-1);
                            dojo.stopEvent(evt);
                            break;
                        }
                    }
                } else {
                    this._setBlurValue();
                    this._setCaretPos(this.focusNode, this.focusNode.value.length);
                }
                if (this._opened || this._fetchHandle) {
                    evt.preventDefault();
                }
            case dk.TAB:
                var _31a = this.get("displayedValue");
                if (pw && (_31a == pw._messages["previousMessage"] || _31a == pw._messages["nextMessage"])) {
                    break;
                }
                if (_319) {
                    this._selectOption();
                }
                if (this._opened) {
                    this._lastQuery = null;
                    this.closeDropDown();
                }
                break;
            case " ":
                if (_319) {
                    dojo.stopEvent(evt);
                    this._selectOption();
                    this.closeDropDown();
                } else {
                    _318 = true;
                }
                break;
            case dk.DELETE:
            case dk.BACKSPACE:
                this._prev_key_backspace = true;
                _318 = true;
                break;
            default:
                _318 = typeof key == "string" || key == 229;
            }
            if (_318) {
                this.item = undefined;
                this.searchTimer = setTimeout(dojo.hitch(this, "_startSearchFromInput"), 1);
            }
        },
        _autoCompleteText: function(text) {
            var fn = this.focusNode;
            dijit.selectInputText(fn, fn.value.length);
            var _31b = this.ignoreCase ? "toLowerCase" : "substr";
            if (text[_31b](0).indexOf(this.focusNode.value[_31b](0)) == 0) {
                var cpos = this._getCaretPos(fn);
                if ((cpos + 1) > fn.value.length) {
                    fn.value = text;
                    dijit.selectInputText(fn, cpos);
                }
            } else {
                fn.value = text;
                dijit.selectInputText(fn);
            }
        },
        _openResultList: function(_31c, _31d) {
            this._fetchHandle = null;
            if (this.disabled || this.readOnly || (_31d.query[this.searchAttr] != this._lastQuery)) {
                return;
            }
            var _31e = this.dropDown._highlighted_option && dojo.hasClass(this.dropDown._highlighted_option, "dijitMenuItemSelected");
            this.dropDown.clearResultList();
            if (!_31c.length && !this._maxOptions) {
                this.closeDropDown();
                return;
            }
            _31d._maxOptions = this._maxOptions;
            var _31f = this.dropDown.createOptions(_31c, _31d, dojo.hitch(this, "_getMenuLabelFromItem"));
            this._showResultList();
            if (_31d.direction) {
                if (1 == _31d.direction) {
                    this.dropDown.highlightFirstOption();
                } else {
                    if (-1 == _31d.direction) {
                        this.dropDown.highlightLastOption();
                    }
                }
                if (_31e) {
                    this._announceOption(this.dropDown.getHighlightedOption());
                }
            } else {
                if (this.autoComplete && !this._prev_key_backspace && !/^[*]+$/.test(_31d.query[this.searchAttr])) {
                    this._announceOption(_31f[1]);
                }
            }
        },
        _showResultList: function() {
            this.closeDropDown(true);
            this.displayMessage("");
            this.openDropDown();
            dijit.setWaiState(this.domNode, "expanded", "true");
        },
        loadDropDown: function(_320) {
            this._startSearchAll();
        },
        isLoaded: function() {
            return false;
        },
        closeDropDown: function() {
            this._abortQuery();
            if (this._opened) {
                this.inherited(arguments);
                dijit.setWaiState(this.domNode, "expanded", "false");
                dijit.removeWaiState(this.focusNode, "activedescendant");
            }
        },
        _setBlurValue: function() {
            var _321 = this.get("displayedValue");
            var pw = this.dropDown;
            if (pw && (_321 == pw._messages["previousMessage"] || _321 == pw._messages["nextMessage"])) {
                this._setValueAttr(this._lastValueReported, true);
            } else {
                if (typeof this.item == "undefined") {
                    this.item = null;
                    this.set("displayedValue", _321);
                } else {
                    if (this.value != this._lastValueReported) {
                        dijit.form._FormValueWidget.prototype._setValueAttr.call(this, this.value, true);
                    }
                    this._refreshState();
                }
            }
        },
        _onBlur: function() {
            this.closeDropDown();
            this.inherited(arguments);
        },
        _setItemAttr: function(item, _322, _323) {
            if (!_323) {
                var _324 = this.labelFunc(item, this.store);
                if (this.labelType == "html") {
                    var span = this._helperSpan;
                    span.innerHTML = _324;
                    _323 = span.innerText || span.textContent;
                } else {
                    _323 = _324;
                }
            }
            var _325 = this._getValueField() != this.searchAttr ? this.store.getIdentity(item) : _323;
            this._set("item", item);
            dijit.form.ComboBox.superclass._setValueAttr.call(this, _325, _322, _323);
        },
        _announceOption: function(node) {
            if (!node) {
                return;
            }
            var _326;
            if (node == this.dropDown.nextButton || node == this.dropDown.previousButton) {
                _326 = node.innerHTML;
                this.item = undefined;
                this.value = "";
            } else {
                _326 = node.innerText || node.textContent || "";
                this.set("item", node.item, false, _326);
            }
            this.focusNode.value = this.focusNode.value.substring(0, this._lastInput.length);
            dijit.setWaiState(this.focusNode, "activedescendant", dojo.attr(node, "id"));
            this._autoCompleteText(_326);
        },
        _selectOption: function(evt) {
            if (evt) {
                this._announceOption(evt.target);
            }
            this.closeDropDown();
            this._setCaretPos(this.focusNode, this.focusNode.value.length);
            dijit.form._FormValueWidget.prototype._setValueAttr.call(this, this.value, true);
        },
        _startSearchAll: function() {
            this._startSearch("");
        },
        _startSearchFromInput: function() {
            this._startSearch(this.focusNode.value.replace(/([\\\*\?])/g, "\\$1"));
        },
        _getQueryString: function(text) {
            return dojo.string.substitute(this.queryExpr, [text]);
        },
        _startSearch: function(key) {
            if (!this.dropDown) {
                var _327 = this.id + "_popup"
                  , _328 = dojo.getObject(this.dropDownClass, false);
                this.dropDown = new _328({
                    onChange: dojo.hitch(this, this._selectOption),
                    id: _327,
                    dir: this.dir
                });
                dijit.removeWaiState(this.focusNode, "activedescendant");
                dijit.setWaiState(this.textbox, "owns", _327);
            }
            var _329 = dojo.clone(this.query);
            this._lastInput = key;
            this._lastQuery = _329[this.searchAttr] = this._getQueryString(key);
            this.searchTimer = setTimeout(dojo.hitch(this, function(_32a, _32b) {
                this.searchTimer = null;
                var _32c = {
                    queryOptions: {
                        ignoreCase: this.ignoreCase,
                        deep: true
                    },
                    query: _32a,
                    onBegin: dojo.hitch(this, "_setMaxOptions"),
                    onComplete: dojo.hitch(this, "_openResultList"),
                    onError: function(_32d) {
                        _32b._fetchHandle = null;
                        console.error("dijit.form.ComboBox: " + _32d);
                        _32b.closeDropDown();
                    },
                    start: 0,
                    count: this.pageSize
                };
                dojo.mixin(_32c, _32b.fetchProperties);
                this._fetchHandle = _32b.store.fetch(_32c);
                var _32e = function(_32f, _330) {
                    _32f.start += _32f.count * _330;
                    _32f.direction = _330;
                    this._fetchHandle = this.store.fetch(_32f);
                    this.focus();
                };
                this._nextSearch = this.dropDown.onPage = dojo.hitch(this, _32e, this._fetchHandle);
            }, _329, this), this.searchDelay);
        },
        _setMaxOptions: function(size, _331) {
            this._maxOptions = size;
        },
        _getValueField: function() {
            return this.searchAttr;
        },
        constructor: function() {
            this.query = {};
            this.fetchProperties = {};
        },
        postMixInProperties: function() {
            if (!this.store) {
                var _332 = this.srcNodeRef;
                this.store = new dijit.form._ComboBoxDataStore(_332);
                if (!("value"in this.params)) {
                    var item = (this.item = this.store.fetchSelectedItem());
                    if (item) {
                        var _333 = this._getValueField();
                        this.value = _333 != this.searchAttr ? this.store.getValue(item, _333) : this.labelFunc(item, this.store);
                    }
                }
            }
            this._helperSpan = dojo.create("span");
            this.inherited(arguments);
        },
        postCreate: function() {
            var _334 = dojo.query("label[for=\"" + this.id + "\"]");
            if (_334.length) {
                _334[0].id = (this.id + "_label");
                dijit.setWaiState(this.domNode, "labelledby", _334[0].id);
            }
            this.inherited(arguments);
        },
        destroy: function() {
            dojo.destroy(this._helperSpan);
            this.inherited(arguments);
        },
        _setHasDownArrowAttr: function(val) {
            this.hasDownArrow = val;
            this._buttonNode.style.display = val ? "" : "none";
        },
        _getMenuLabelFromItem: function(item) {
            var _335 = this.labelFunc(item, this.store)
              , _336 = this.labelType;
            if (this.highlightMatch != "none" && this.labelType == "text" && this._lastInput) {
                _335 = this.doHighlight(_335, this._escapeHtml(this._lastInput));
                _336 = "html";
            }
            return {
                html: _336 == "html",
                label: _335
            };
        },
        doHighlight: function(_337, find) {
            var _338 = (this.ignoreCase ? "i" : "") + (this.highlightMatch == "all" ? "g" : "")
              , i = this.queryExpr.indexOf("${0}");
            find = dojo.regexp.escapeString(find);
            return this._escapeHtml(_337).replace(new RegExp((i == 0 ? "^" : "") + "(" + find + ")" + (i == (this.queryExpr.length - 4) ? "$" : ""),_338), "<span class=\"dijitComboBoxHighlightMatch\">$1</span>");
        },
        _escapeHtml: function(str) {
            str = String(str).replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
            return str;
        },
        reset: function() {
            this.item = null;
            this.inherited(arguments);
        },
        labelFunc: function(item, _339) {
            return _339.getValue(item, this.labelAttr || this.searchAttr).toString();
        }
    });
    dojo.declare("dijit.form._ComboBoxMenu", [dijit._Widget, dijit._Templated, dijit._CssStateMixin], {
        templateString: "<ul class='dijitReset dijitMenu' dojoAttachEvent='onmousedown:_onMouseDown,onmouseup:_onMouseUp,onmouseover:_onMouseOver,onmouseout:_onMouseOut' style='overflow: \"auto\"; overflow-x: \"hidden\";'>" + "<li class='dijitMenuItem dijitMenuPreviousButton' dojoAttachPoint='previousButton' role='option'></li>" + "<li class='dijitMenuItem dijitMenuNextButton' dojoAttachPoint='nextButton' role='option'></li>" + "</ul>",
        _messages: null,
        baseClass: "dijitComboBoxMenu",
        postMixInProperties: function() {
            this.inherited(arguments);
            this._messages = dojo.i18n.getLocalization("dijit.form", "ComboBox", this.lang);
        },
        buildRendering: function() {
            this.inherited(arguments);
            this.previousButton.innerHTML = this._messages["previousMessage"];
            this.nextButton.innerHTML = this._messages["nextMessage"];
        },
        _setValueAttr: function(_33a) {
            this.value = _33a;
            this.onChange(_33a);
        },
        onChange: function(_33b) {},
        onPage: function(_33c) {},
        onClose: function() {
            this._blurOptionNode();
        },
        _createOption: function(item, _33d) {
            var _33e = dojo.create("li", {
                "class": "dijitReset dijitMenuItem" + (this.isLeftToRight() ? "" : " dijitMenuItemRtl"),
                role: "option"
            });
            var _33f = _33d(item);
            if (_33f.html) {
                _33e.innerHTML = _33f.label;
            } else {
                _33e.appendChild(dojo.doc.createTextNode(_33f.label));
            }
            if (_33e.innerHTML == "") {
                _33e.innerHTML = "&nbsp;";
            }
            _33e.item = item;
            return _33e;
        },
        createOptions: function(_340, _341, _342) {
            this.previousButton.style.display = (_341.start == 0) ? "none" : "";
            dojo.attr(this.previousButton, "id", this.id + "_prev");
            dojo.forEach(_340, function(item, i) {
                var _343 = this._createOption(item, _342);
                dojo.attr(_343, "id", this.id + i);
                this.domNode.insertBefore(_343, this.nextButton);
            }, this);
            var _344 = false;
            if (_341._maxOptions && _341._maxOptions != -1) {
                if ((_341.start + _341.count) < _341._maxOptions) {
                    _344 = true;
                } else {
                    if ((_341.start + _341.count) > _341._maxOptions && _341.count == _340.length) {
                        _344 = true;
                    }
                }
            } else {
                if (_341.count == _340.length) {
                    _344 = true;
                }
            }
            this.nextButton.style.display = _344 ? "" : "none";
            dojo.attr(this.nextButton, "id", this.id + "_next");
            return this.domNode.childNodes;
        },
        clearResultList: function() {
            while (this.domNode.childNodes.length > 2) {
                this.domNode.removeChild(this.domNode.childNodes[this.domNode.childNodes.length - 2]);
            }
            this._blurOptionNode();
        },
        _onMouseDown: function(evt) {
            dojo.stopEvent(evt);
        },
        _onMouseUp: function(evt) {
            if (evt.target === this.domNode || !this._highlighted_option) {
                return;
            } else {
                if (evt.target == this.previousButton) {
                    this._blurOptionNode();
                    this.onPage(-1);
                } else {
                    if (evt.target == this.nextButton) {
                        this._blurOptionNode();
                        this.onPage(1);
                    } else {
                        var tgt = evt.target;
                        while (!tgt.item) {
                            tgt = tgt.parentNode;
                        }
                        this._setValueAttr({
                            target: tgt
                        }, true);
                    }
                }
            }
        },
        _onMouseOver: function(evt) {
            if (evt.target === this.domNode) {
                return;
            }
            var tgt = evt.target;
            if (!(tgt == this.previousButton || tgt == this.nextButton)) {
                while (!tgt.item) {
                    tgt = tgt.parentNode;
                }
            }
            this._focusOptionNode(tgt);
        },
        _onMouseOut: function(evt) {
            if (evt.target === this.domNode) {
                return;
            }
            this._blurOptionNode();
        },
        _focusOptionNode: function(node) {
            if (this._highlighted_option != node) {
                this._blurOptionNode();
                this._highlighted_option = node;
                dojo.addClass(this._highlighted_option, "dijitMenuItemSelected");
            }
        },
        _blurOptionNode: function() {
            if (this._highlighted_option) {
                dojo.removeClass(this._highlighted_option, "dijitMenuItemSelected");
                this._highlighted_option = null;
            }
        },
        _highlightNextOption: function() {
            if (!this.getHighlightedOption()) {
                var fc = this.domNode.firstChild;
                this._focusOptionNode(fc.style.display == "none" ? fc.nextSibling : fc);
            } else {
                var ns = this._highlighted_option.nextSibling;
                if (ns && ns.style.display != "none") {
                    this._focusOptionNode(ns);
                } else {
                    this.highlightFirstOption();
                }
            }
            dojo.window.scrollIntoView(this._highlighted_option);
        },
        highlightFirstOption: function() {
            var _345 = this.domNode.firstChild;
            var _346 = _345.nextSibling;
            this._focusOptionNode(_346.style.display == "none" ? _345 : _346);
            dojo.window.scrollIntoView(this._highlighted_option);
        },
        highlightLastOption: function() {
            this._focusOptionNode(this.domNode.lastChild.previousSibling);
            dojo.window.scrollIntoView(this._highlighted_option);
        },
        _highlightPrevOption: function() {
            if (!this.getHighlightedOption()) {
                var lc = this.domNode.lastChild;
                this._focusOptionNode(lc.style.display == "none" ? lc.previousSibling : lc);
            } else {
                var ps = this._highlighted_option.previousSibling;
                if (ps && ps.style.display != "none") {
                    this._focusOptionNode(ps);
                } else {
                    this.highlightLastOption();
                }
            }
            dojo.window.scrollIntoView(this._highlighted_option);
        },
        _page: function(up) {
            var _347 = 0;
            var _348 = this.domNode.scrollTop;
            var _349 = dojo.style(this.domNode, "height");
            if (!this.getHighlightedOption()) {
                this._highlightNextOption();
            }
            while (_347 < _349) {
                if (up) {
                    if (!this.getHighlightedOption().previousSibling || this._highlighted_option.previousSibling.style.display == "none") {
                        break;
                    }
                    this._highlightPrevOption();
                } else {
                    if (!this.getHighlightedOption().nextSibling || this._highlighted_option.nextSibling.style.display == "none") {
                        break;
                    }
                    this._highlightNextOption();
                }
                var _34a = this.domNode.scrollTop;
                _347 += (_34a - _348) * (up ? -1 : 1);
                _348 = _34a;
            }
        },
        pageUp: function() {
            this._page(true);
        },
        pageDown: function() {
            this._page(false);
        },
        getHighlightedOption: function() {
            var ho = this._highlighted_option;
            return (ho && ho.parentNode) ? ho : null;
        },
        handleKey: function(evt) {
            switch (evt.charOrCode) {
            case dojo.keys.DOWN_ARROW:
                this._highlightNextOption();
                return false;
            case dojo.keys.PAGE_DOWN:
                this.pageDown();
                return false;
            case dojo.keys.UP_ARROW:
                this._highlightPrevOption();
                return false;
            case dojo.keys.PAGE_UP:
                this.pageUp();
                return false;
            default:
                return true;
            }
        }
    });
    dojo.declare("dijit.form.ComboBox", [dijit.form.ValidationTextBox, dijit.form.ComboBoxMixin], {
        _setValueAttr: function(_34b, _34c, _34d) {
            this._set("item", null);
            if (!_34b) {
                _34b = "";
            }
            dijit.form.ValidationTextBox.prototype._setValueAttr.call(this, _34b, _34c, _34d);
        }
    });
    dojo.declare("dijit.form._ComboBoxDataStore", null, {
        constructor: function(root) {
            this.root = root;
            if (root.tagName != "SELECT" && root.firstChild) {
                root = dojo.query("select", root);
                if (root.length > 0) {
                    root = root[0];
                } else {
                    this.root.innerHTML = "<SELECT>" + this.root.innerHTML + "</SELECT>";
                    root = this.root.firstChild;
                }
                this.root = root;
            }
            dojo.query("> option", root).forEach(function(node) {
                node.innerHTML = dojo.trim(node.innerHTML);
            });
        },
        getValue: function(item, _34e, _34f) {
            return (_34e == "value") ? item.value : (item.innerText || item.textContent || "");
        },
        isItemLoaded: function(_350) {
            return true;
        },
        getFeatures: function() {
            return {
                "dojo.data.api.Read": true,
                "dojo.data.api.Identity": true
            };
        },
        _fetchItems: function(args, _351, _352) {
            if (!args.query) {
                args.query = {};
            }
            if (!args.query.name) {
                args.query.name = "";
            }
            if (!args.queryOptions) {
                args.queryOptions = {};
            }
            var _353 = dojo.data.util.filter.patternToRegExp(args.query.name, args.queryOptions.ignoreCase)
              , _354 = dojo.query("> option", this.root).filter(function(_355) {
                return (_355.innerText || _355.textContent || "").match(_353);
            });
            if (args.sort) {
                _354.sort(dojo.data.util.sorter.createSortFunction(args.sort, this));
            }
            _351(_354, args);
        },
        close: function(_356) {
            return;
        },
        getLabel: function(item) {
            return item.innerHTML;
        },
        getIdentity: function(item) {
            return dojo.attr(item, "value");
        },
        fetchItemByIdentity: function(args) {
            var item = dojo.query("> option[value='" + args.identity + "']", this.root)[0];
            args.onItem(item);
        },
        fetchSelectedItem: function() {
            var root = this.root
              , si = root.selectedIndex;
            return typeof si == "number" ? dojo.query("> option:nth-child(" + (si != -1 ? si + 1 : 1) + ")", root)[0] : null;
        }
    });
    dojo.extend(dijit.form._ComboBoxDataStore, dojo.data.util.simpleFetch);
}
if (!dojo._hasResource["dijit._KeyNavContainer"]) {
    dojo._hasResource["dijit._KeyNavContainer"] = true;
    dojo.provide("dijit._KeyNavContainer");
    dojo.declare("dijit._KeyNavContainer", dijit._Container, {
        tabIndex: "0",
        _keyNavCodes: {},
        connectKeyNavHandlers: function(_357, _358) {
            var _359 = (this._keyNavCodes = {});
            var prev = dojo.hitch(this, this.focusPrev);
            var next = dojo.hitch(this, this.focusNext);
            dojo.forEach(_357, function(code) {
                _359[code] = prev;
            });
            dojo.forEach(_358, function(code) {
                _359[code] = next;
            });
            _359[dojo.keys.HOME] = dojo.hitch(this, "focusFirstChild");
            _359[dojo.keys.END] = dojo.hitch(this, "focusLastChild");
            this.connect(this.domNode, "onkeypress", "_onContainerKeypress");
            this.connect(this.domNode, "onfocus", "_onContainerFocus");
        },
        startupKeyNavChildren: function() {
            dojo.forEach(this.getChildren(), dojo.hitch(this, "_startupChild"));
        },
        addChild: function(_35a, _35b) {
            dijit._KeyNavContainer.superclass.addChild.apply(this, arguments);
            this._startupChild(_35a);
        },
        focus: function() {
            this.focusFirstChild();
        },
        focusFirstChild: function() {
            var _35c = this._getFirstFocusableChild();
            if (_35c) {
                this.focusChild(_35c);
            }
        },
        focusLastChild: function() {
            var _35d = this._getLastFocusableChild();
            if (_35d) {
                this.focusChild(_35d);
            }
        },
        focusNext: function() {
            var _35e = this._getNextFocusableChild(this.focusedChild, 1);
            this.focusChild(_35e);
        },
        focusPrev: function() {
            var _35f = this._getNextFocusableChild(this.focusedChild, -1);
            this.focusChild(_35f, true);
        },
        focusChild: function(_360, last) {
            if (this.focusedChild && _360 !== this.focusedChild) {
                this._onChildBlur(this.focusedChild);
            }
            _360.focus(last ? "end" : "start");
            this._set("focusedChild", _360);
        },
        _startupChild: function(_361) {
            _361.set("tabIndex", "-1");
            this.connect(_361, "_onFocus", function() {
                _361.set("tabIndex", this.tabIndex);
            });
            this.connect(_361, "_onBlur", function() {
                _361.set("tabIndex", "-1");
            });
        },
        _onContainerFocus: function(evt) {
            if (evt.target !== this.domNode) {
                return;
            }
            this.focusFirstChild();
            dojo.attr(this.domNode, "tabIndex", "-1");
        },
        _onBlur: function(evt) {
            if (this.tabIndex) {
                dojo.attr(this.domNode, "tabIndex", this.tabIndex);
            }
            this.inherited(arguments);
        },
        _onContainerKeypress: function(evt) {
            if (evt.ctrlKey || evt.altKey) {
                return;
            }
            var func = this._keyNavCodes[evt.charOrCode];
            if (func) {
                func();
                dojo.stopEvent(evt);
            }
        },
        _onChildBlur: function(_362) {},
        _getFirstFocusableChild: function() {
            return this._getNextFocusableChild(null, 1);
        },
        _getLastFocusableChild: function() {
            return this._getNextFocusableChild(null, -1);
        },
        _getNextFocusableChild: function(_363, dir) {
            if (_363) {
                _363 = this._getSiblingOfChild(_363, dir);
            }
            var _364 = this.getChildren();
            for (var i = 0; i < _364.length; i++) {
                if (!_363) {
                    _363 = _364[(dir > 0) ? 0 : (_364.length - 1)];
                }
                if (_363.isFocusable()) {
                    return _363;
                }
                _363 = this._getSiblingOfChild(_363, dir);
            }
            return null;
        }
    });
}
if (!dojo._hasResource["dijit.MenuItem"]) {
    dojo._hasResource["dijit.MenuItem"] = true;
    dojo.provide("dijit.MenuItem");
    dojo.declare("dijit.MenuItem", [dijit._Widget, dijit._Templated, dijit._Contained, dijit._CssStateMixin], {
        templateString: dojo.cache("dijit", "templates/MenuItem.html", "<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\"\r\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\r\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\r\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\r\n\t</td>\r\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">\r\n\t\t<div dojoAttachPoint=\"arrowWrapper\" style=\"visibility: hidden\">\r\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuExpand\"/>\r\n\t\t\t<span class=\"dijitMenuExpandA11y\">+</span>\r\n\t\t</div>\r\n\t</td>\r\n</tr>\r\n"),
        attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
            label: {
                node: "containerNode",
                type: "innerHTML"
            },
            iconClass: {
                node: "iconNode",
                type: "class"
            }
        }),
        baseClass: "dijitMenuItem",
        label: "",
        iconClass: "",
        accelKey: "",
        disabled: false,
        _fillContent: function(_365) {
            if (_365 && !("label"in this.params)) {
                this.set("label", _365.innerHTML);
            }
        },
        buildRendering: function() {
            this.inherited(arguments);
            var _366 = this.id + "_text";
            dojo.attr(this.containerNode, "id", _366);
            if (this.accelKeyNode) {
                dojo.attr(this.accelKeyNode, "id", this.id + "_accel");
                _366 += " " + this.id + "_accel";
            }
            dijit.setWaiState(this.domNode, "labelledby", _366);
            dojo.setSelectable(this.domNode, false);
        },
        _onHover: function() {
            this.getParent().onItemHover(this);
        },
        _onUnhover: function() {
            this.getParent().onItemUnhover(this);
            this._set("hovering", false);
        },
        _onClick: function(evt) {
            this.getParent().onItemClick(this, evt);
            dojo.stopEvent(evt);
        },
        onClick: function(evt) {},
        focus: function() {
            try {
                if (dojo.isIE == 8) {
                    this.containerNode.focus();
                }
                dijit.focus(this.focusNode);
            } catch (e) {}
        },
        _onFocus: function() {
            this._setSelected(true);
            this.getParent()._onItemFocus(this);
            this.inherited(arguments);
        },
        _setSelected: function(_367) {
            dojo.toggleClass(this.domNode, "dijitMenuItemSelected", _367);
        },
        setLabel: function(_368) {
            dojo.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.", "", "2.0");
            this.set("label", _368);
        },
        setDisabled: function(_369) {
            dojo.deprecated("dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.", "", "2.0");
            this.set("disabled", _369);
        },
        _setDisabledAttr: function(_36a) {
            dijit.setWaiState(this.focusNode, "disabled", _36a ? "true" : "false");
            this._set("disabled", _36a);
        },
        _setAccelKeyAttr: function(_36b) {
            this.accelKeyNode.style.display = _36b ? "" : "none";
            this.accelKeyNode.innerHTML = _36b;
            dojo.attr(this.containerNode, "colSpan", _36b ? "1" : "2");
            this._set("accelKey", _36b);
        }
    });
}
if (!dojo._hasResource["dijit.PopupMenuItem"]) {
    dojo._hasResource["dijit.PopupMenuItem"] = true;
    dojo.provide("dijit.PopupMenuItem");
    dojo.declare("dijit.PopupMenuItem", dijit.MenuItem, {
        _fillContent: function() {
            if (this.srcNodeRef) {
                var _36c = dojo.query("*", this.srcNodeRef);
                dijit.PopupMenuItem.superclass._fillContent.call(this, _36c[0]);
                this.dropDownContainer = this.srcNodeRef;
            }
        },
        startup: function() {
            if (this._started) {
                return;
            }
            this.inherited(arguments);
            if (!this.popup) {
                var node = dojo.query("[widgetId]", this.dropDownContainer)[0];
                this.popup = dijit.byNode(node);
            }
            dojo.body().appendChild(this.popup.domNode);
            this.popup.startup();
            this.popup.domNode.style.display = "none";
            if (this.arrowWrapper) {
                dojo.style(this.arrowWrapper, "visibility", "");
            }
            dijit.setWaiState(this.focusNode, "haspopup", "true");
        },
        destroyDescendants: function() {
            if (this.popup) {
                if (!this.popup._destroyed) {
                    this.popup.destroyRecursive();
                }
                delete this.popup;
            }
            this.inherited(arguments);
        }
    });
}
if (!dojo._hasResource["dijit.CheckedMenuItem"]) {
    dojo._hasResource["dijit.CheckedMenuItem"] = true;
    dojo.provide("dijit.CheckedMenuItem");
    dojo.declare("dijit.CheckedMenuItem", dijit.MenuItem, {
        templateString: dojo.cache("dijit", "templates/CheckedMenuItem.html", "<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitemcheckbox\" tabIndex=\"-1\"\r\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\r\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\r\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\r\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\r\n\t</td>\r\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode,labelNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&nbsp;</td>\r\n</tr>\r\n"),
        checked: false,
        _setCheckedAttr: function(_36d) {
            dojo.toggleClass(this.domNode, "dijitCheckedMenuItemChecked", _36d);
            dijit.setWaiState(this.domNode, "checked", _36d);
            this._set("checked", _36d);
        },
        onChange: function(_36e) {},
        _onClick: function(e) {
            if (!this.disabled) {
                this.set("checked", !this.checked);
                this.onChange(this.checked);
            }
            this.inherited(arguments);
        }
    });
}
if (!dojo._hasResource["dijit.MenuSeparator"]) {
    dojo._hasResource["dijit.MenuSeparator"] = true;
    dojo.provide("dijit.MenuSeparator");
    dojo.declare("dijit.MenuSeparator", [dijit._Widget, dijit._Templated, dijit._Contained], {
        templateString: dojo.cache("dijit", "templates/MenuSeparator.html", "<tr class=\"dijitMenuSeparator\">\r\n\t<td class=\"dijitMenuSeparatorIconCell\">\r\n\t\t<div class=\"dijitMenuSeparatorTop\"></div>\r\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\r\n\t</td>\r\n\t<td colspan=\"3\" class=\"dijitMenuSeparatorLabelCell\">\r\n\t\t<div class=\"dijitMenuSeparatorTop dijitMenuSeparatorLabel\"></div>\r\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\r\n\t</td>\r\n</tr>\r\n"),
        buildRendering: function() {
            this.inherited(arguments);
            dojo.setSelectable(this.domNode, false);
        },
        isFocusable: function() {
            return false;
        }
    });
}
if (!dojo._hasResource["dijit.Menu"]) {
    dojo._hasResource["dijit.Menu"] = true;
    dojo.provide("dijit.Menu");
    dojo.declare("dijit._MenuBase", [dijit._Widget, dijit._Templated, dijit._KeyNavContainer], {
        parentMenu: null,
        popupDelay: 500,
        startup: function() {
            if (this._started) {
                return;
            }
            dojo.forEach(this.getChildren(), function(_36f) {
                _36f.startup();
            });
            this.startupKeyNavChildren();
            this.inherited(arguments);
        },
        onExecute: function() {},
        onCancel: function(_370) {},
        _moveToPopup: function(evt) {
            if (this.focusedChild && this.focusedChild.popup && !this.focusedChild.disabled) {
                this.focusedChild._onClick(evt);
            } else {
                var _371 = this._getTopMenu();
                if (_371 && _371._isMenuBar) {
                    _371.focusNext();
                }
            }
        },
        _onPopupHover: function(evt) {
            if (this.currentPopup && this.currentPopup._pendingClose_timer) {
                var _372 = this.currentPopup.parentMenu;
                if (_372.focusedChild) {
                    _372.focusedChild._setSelected(false);
                }
                _372.focusedChild = this.currentPopup.from_item;
                _372.focusedChild._setSelected(true);
                this._stopPendingCloseTimer(this.currentPopup);
            }
        },
        onItemHover: function(item) {
            if (this.isActive) {
                this.focusChild(item);
                if (this.focusedChild.popup && !this.focusedChild.disabled && !this.hover_timer) {
                    this.hover_timer = setTimeout(dojo.hitch(this, "_openPopup"), this.popupDelay);
                }
            }
            if (this.focusedChild) {
                this.focusChild(item);
            }
            this._hoveredChild = item;
        },
        _onChildBlur: function(item) {
            this._stopPopupTimer();
            item._setSelected(false);
            var _373 = item.popup;
            if (_373) {
                this._stopPendingCloseTimer(_373);
                _373._pendingClose_timer = setTimeout(function() {
                    _373._pendingClose_timer = null;
                    if (_373.parentMenu) {
                        _373.parentMenu.currentPopup = null;
                    }
                    dijit.popup.close(_373);
                }, this.popupDelay);
            }
        },
        onItemUnhover: function(item) {
            if (this.isActive) {
                this._stopPopupTimer();
            }
            if (this._hoveredChild == item) {
                this._hoveredChild = null;
            }
        },
        _stopPopupTimer: function() {
            if (this.hover_timer) {
                clearTimeout(this.hover_timer);
                this.hover_timer = null;
            }
        },
        _stopPendingCloseTimer: function(_374) {
            if (_374._pendingClose_timer) {
                clearTimeout(_374._pendingClose_timer);
                _374._pendingClose_timer = null;
            }
        },
        _stopFocusTimer: function() {
            if (this._focus_timer) {
                clearTimeout(this._focus_timer);
                this._focus_timer = null;
            }
        },
        _getTopMenu: function() {
            for (var top = this; top.parentMenu; top = top.parentMenu) {}
            return top;
        },
        onItemClick: function(item, evt) {
            if (typeof this.isShowingNow == "undefined") {
                this._markActive();
            }
            this.focusChild(item);
            if (item.disabled) {
                return false;
            }
            if (item.popup) {
                this._openPopup();
            } else {
                this.onExecute();
                item.onClick(evt);
            }
        },
        _openPopup: function() {
            this._stopPopupTimer();
            var _375 = this.focusedChild;
            if (!_375) {
                return;
            }
            var _376 = _375.popup;
            if (_376.isShowingNow) {
                return;
            }
            if (this.currentPopup) {
                this._stopPendingCloseTimer(this.currentPopup);
                dijit.popup.close(this.currentPopup);
            }
            _376.parentMenu = this;
            _376.from_item = _375;
            var self = this;
            dijit.popup.open({
                parent: this,
                popup: _376,
                around: _375.domNode,
                orient: this._orient || (this.isLeftToRight() ? {
                    "TR": "TL",
                    "TL": "TR",
                    "BR": "BL",
                    "BL": "BR"
                } : {
                    "TL": "TR",
                    "TR": "TL",
                    "BL": "BR",
                    "BR": "BL"
                }),
                onCancel: function() {
                    self.focusChild(_375);
                    self._cleanUp();
                    _375._setSelected(true);
                    self.focusedChild = _375;
                },
                onExecute: dojo.hitch(this, "_cleanUp")
            });
            this.currentPopup = _376;
            _376.connect(_376.domNode, "onmouseenter", dojo.hitch(self, "_onPopupHover"));
            if (_376.focus) {
                _376._focus_timer = setTimeout(dojo.hitch(_376, function() {
                    this._focus_timer = null;
                    this.focus();
                }), 0);
            }
        },
        _markActive: function() {
            this.isActive = true;
            dojo.replaceClass(this.domNode, "dijitMenuActive", "dijitMenuPassive");
        },
        onOpen: function(e) {
            this.isShowingNow = true;
            this._markActive();
        },
        _markInactive: function() {
            this.isActive = false;
            dojo.replaceClass(this.domNode, "dijitMenuPassive", "dijitMenuActive");
        },
        onClose: function() {
            this._stopFocusTimer();
            this._markInactive();
            this.isShowingNow = false;
            this.parentMenu = null;
        },
        _closeChild: function() {
            this._stopPopupTimer();
            var _377 = this.focusedChild && this.focusedChild.from_item;
            if (this.currentPopup) {
                if (dijit._curFocus && dojo.isDescendant(dijit._curFocus, this.currentPopup.domNode)) {
                    this.focusedChild.focusNode.focus();
                }
                dijit.popup.close(this.currentPopup);
                this.currentPopup = null;
            }
            if (this.focusedChild) {
                this.focusedChild._setSelected(false);
                this.focusedChild._onUnhover();
                this.focusedChild = null;
            }
        },
        _onItemFocus: function(item) {
            if (this._hoveredChild && this._hoveredChild != item) {
                this._hoveredChild._onUnhover();
            }
        },
        _onBlur: function() {
            this._cleanUp();
            this.inherited(arguments);
        },
        _cleanUp: function() {
            this._closeChild();
            if (typeof this.isShowingNow == "undefined") {
                this._markInactive();
            }
        }
    });
    dojo.declare("dijit.Menu", dijit._MenuBase, {
        constructor: function() {
            this._bindings = [];
        },
        templateString: dojo.cache("dijit", "templates/Menu.html", "<table class=\"dijit dijitMenu dijitMenuPassive dijitReset dijitMenuTable\" role=\"menu\" tabIndex=\"${tabIndex}\" dojoAttachEvent=\"onkeypress:_onKeyPress\" cellspacing=\"0\">\r\n\t<tbody class=\"dijitReset\" dojoAttachPoint=\"containerNode\"></tbody>\r\n</table>\r\n"),
        baseClass: "dijitMenu",
        targetNodeIds: [],
        contextMenuForWindow: false,
        leftClickToOpen: false,
        refocus: true,
        postCreate: function() {
            if (this.contextMenuForWindow) {
                this.bindDomNode(dojo.body());
            } else {
                dojo.forEach(this.targetNodeIds, this.bindDomNode, this);
            }
            var k = dojo.keys
              , l = this.isLeftToRight();
            this._openSubMenuKey = l ? k.RIGHT_ARROW : k.LEFT_ARROW;
            this._closeSubMenuKey = l ? k.LEFT_ARROW : k.RIGHT_ARROW;
            this.connectKeyNavHandlers([k.UP_ARROW], [k.DOWN_ARROW]);
        },
        _onKeyPress: function(evt) {
            if (evt.ctrlKey || evt.altKey) {
                return;
            }
            switch (evt.charOrCode) {
            case this._openSubMenuKey:
                this._moveToPopup(evt);
                dojo.stopEvent(evt);
                break;
            case this._closeSubMenuKey:
                if (this.parentMenu) {
                    if (this.parentMenu._isMenuBar) {
                        this.parentMenu.focusPrev();
                    } else {
                        this.onCancel(false);
                    }
                } else {
                    dojo.stopEvent(evt);
                }
                break;
            }
        },
        _iframeContentWindow: function(_378) {
            var win = dojo.window.get(this._iframeContentDocument(_378)) || this._iframeContentDocument(_378)["__parent__"] || (_378.name && dojo.doc.frames[_378.name]) || null;
            return win;
        },
        _iframeContentDocument: function(_379) {
            var doc = _379.contentDocument || (_379.contentWindow && _379.contentWindow.document) || (_379.name && dojo.doc.frames[_379.name] && dojo.doc.frames[_379.name].document) || null;
            return doc;
        },
        bindDomNode: function(node) {
            node = dojo.byId(node);
            var cn;
            if (node.tagName.toLowerCase() == "iframe") {
                var _37a = node
                  , win = this._iframeContentWindow(_37a);
                cn = dojo.withGlobal(win, dojo.body);
            } else {
                cn = (node == dojo.body() ? dojo.doc.documentElement : node);
            }
            var _37b = {
                node: node,
                iframe: _37a
            };
            dojo.attr(node, "_dijitMenu" + this.id, this._bindings.push(_37b));
            var _37c = dojo.hitch(this, function(cn) {
                return [dojo.connect(cn, this.leftClickToOpen ? "onclick" : "oncontextmenu", this, function(evt) {
                    dojo.stopEvent(evt);
                    this._scheduleOpen(evt.target, _37a, {
                        x: evt.pageX,
                        y: evt.pageY
                    });
                }), dojo.connect(cn, "onkeydown", this, function(evt) {
                    if (evt.shiftKey && evt.keyCode == dojo.keys.F10) {
                        dojo.stopEvent(evt);
                        this._scheduleOpen(evt.target, _37a);
                    }
                })];
            });
            _37b.connects = cn ? _37c(cn) : [];
            if (_37a) {
                _37b.onloadHandler = dojo.hitch(this, function() {
                    var win = this._iframeContentWindow(_37a);
                    cn = dojo.withGlobal(win, dojo.body);
                    _37b.connects = _37c(cn);
                });
                if (_37a.addEventListener) {
                    _37a.addEventListener("load", _37b.onloadHandler, false);
                } else {
                    _37a.attachEvent("onload", _37b.onloadHandler);
                }
            }
        },
        unBindDomNode: function(_37d) {
            var node;
            try {
                node = dojo.byId(_37d);
            } catch (e) {
                return;
            }
            var _37e = "_dijitMenu" + this.id;
            if (node && dojo.hasAttr(node, _37e)) {
                var bid = dojo.attr(node, _37e) - 1
                  , b = this._bindings[bid];
                dojo.forEach(b.connects, dojo.disconnect);
                var _37f = b.iframe;
                if (_37f) {
                    if (_37f.removeEventListener) {
                        _37f.removeEventListener("load", b.onloadHandler, false);
                    } else {
                        _37f.detachEvent("onload", b.onloadHandler);
                    }
                }
                dojo.removeAttr(node, _37e);
                delete this._bindings[bid];
            }
        },
        _scheduleOpen: function(_380, _381, _382) {
            if (!this._openTimer) {
                this._openTimer = setTimeout(dojo.hitch(this, function() {
                    delete this._openTimer;
                    this._openMyself({
                        target: _380,
                        iframe: _381,
                        coords: _382
                    });
                }), 1);
            }
        },
        _openMyself: function(args) {
            var _383 = args.target
              , _384 = args.iframe
              , _385 = args.coords;
            if (_385) {
                if (_384) {
                    var od = _383.ownerDocument
                      , ifc = dojo.position(_384, true)
                      , win = this._iframeContentWindow(_384)
                      , _386 = dojo.withGlobal(win, "_docScroll", dojo);
                    var cs = dojo.getComputedStyle(_384)
                      , tp = dojo._toPixelValue
                      , left = (dojo.isIE && dojo.isQuirks ? 0 : tp(_384, cs.paddingLeft)) + (dojo.isIE && dojo.isQuirks ? tp(_384, cs.borderLeftWidth) : 0)
                      , top = (dojo.isIE && dojo.isQuirks ? 0 : tp(_384, cs.paddingTop)) + (dojo.isIE && dojo.isQuirks ? tp(_384, cs.borderTopWidth) : 0);
                    _385.x += ifc.x + left - _386.x;
                    _385.y += ifc.y + top - _386.y;
                }
            } else {
                _385 = dojo.position(_383, true);
                _385.x += 10;
                _385.y += 10;
            }
            var self = this;
            var _387 = dijit.getFocus(this);
            function _388() {
                if (self.refocus) {
                    dijit.focus(_387);
                }
                dijit.popup.close(self);
            }
            ;dijit.popup.open({
                popup: this,
                x: _385.x,
                y: _385.y,
                onExecute: _388,
                onCancel: _388,
                orient: this.isLeftToRight() ? "L" : "R"
            });
            this.focus();
            this._onBlur = function() {
                this.inherited("_onBlur", arguments);
                dijit.popup.close(this);
            }
            ;
        },
        uninitialize: function() {
            dojo.forEach(this._bindings, function(b) {
                if (b) {
                    this.unBindDomNode(b.node);
                }
            }, this);
            this.inherited(arguments);
        }
    });
}
dojo.i18n._preloadLocalizations("dojo.nls.scbldr", ["ROOT", "ar", "ca", "cs", "da", "de", "de-de", "el", "en", "en-gb", "en-us", "es", "es-es", "fi", "fi-fi", "fr", "fr-fr", "he", "he-il", "hu", "it", "it-it", "ja", "ja-jp", "ko", "ko-kr", "nb", "nl", "nl-nl", "pl", "pt", "pt-br", "pt-pt", "ru", "sk", "sl", "sv", "th", "tr", "xx", "zh", "zh-cn", "zh-tw"]);
