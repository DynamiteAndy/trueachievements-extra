// ==UserScript==
// @name          TrueAchievements Extra
// @namespace     dynamite-andy
// @version       3.0.0
// @iconURL       https://github.com/andrewcartwright1/trueachievements-extra/blob/main/src/resources/icons/favicon32x32.ico?raw=true
// @icon64URL     https://github.com/andrewcartwright1/trueachievements-extra/blob/main/src/resources/icons/favicon64x64.ico?raw=true
// @updateURL     https://github.com/andrewcartwright1/trueachievements-extra/raw/main/dist/trueachievements-extras.user.js
// @downloadURL   https://github.com/andrewcartwright1/trueachievements-extra/raw/main/dist/trueachievements-extras.user.js
// @supportURL    https://github.com/andrewcartwright1/trueachievements-extra/issues
// @description   Provides a variety of extras for use on TrueAchievements
// @connect       trueachievements.com
// @connect       xboxachievements.com
// @author        Dynamite Andy - dynamiteandy@gmail.com
// @match         http*://*.trueachievements.com/*
// @run-at        document-start
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_addStyle
// @grant         GM_xmlhttpRequest
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/@eastdesire+jscolor@2.5.1/node_modules/@eastdesire/jscolor/jscolor.js":
/***/ (function(module) {

/**
 * jscolor - JavaScript Color Picker
 *
 * @link    http://jscolor.com
 * @license For open source use: GPLv3
 *          For commercial use: JSColor Commercial License
 * @author  Jan Odvarko - East Desire
 *
 * See usage examples at http://jscolor.com/examples/
 */


(function (global, factory) {

	'use strict';

	if ( true && typeof module.exports === 'object') {
		// Export jscolor as a module
		module.exports = global.document ?
			factory (global) :
			function (win) {
				if (!win.document) {
					throw new Error('jscolor needs a window with document');
				}
				return factory(win);
			}
		return;
	}

	// Default use (no module export)
	factory(global);

})(typeof window !== 'undefined' ? window : this, function (window) { // BEGIN factory

// BEGIN jscolor code


'use strict';


var jscolor = (function () { // BEGIN jscolor

var jsc = {


	initialized : false,

	instances : [], // created instances of jscolor

	readyQueue : [], // functions waiting to be called after init


	register : function () {
		if (typeof window !== 'undefined' && window.document) {
			window.document.addEventListener('DOMContentLoaded', jsc.pub.init, false);
		}
	},


	installBySelector : function (selector, rootNode) {
		rootNode = rootNode ? jsc.node(rootNode) : window.document;
		if (!rootNode) {
			throw new Error('Missing root node');
		}

		var elms = rootNode.querySelectorAll(selector);

		// for backward compatibility with DEPRECATED installation/configuration using className
		var matchClass = new RegExp('(^|\\s)(' + jsc.pub.lookupClass + ')(\\s*(\\{[^}]*\\})|\\s|$)', 'i');

		for (var i = 0; i < elms.length; i += 1) {

			if (elms[i].jscolor && elms[i].jscolor instanceof jsc.pub) {
				continue; // jscolor already installed on this element
			}

			if (elms[i].type !== undefined && elms[i].type.toLowerCase() == 'color' && jsc.isColorAttrSupported) {
				continue; // skips inputs of type 'color' if supported by the browser
			}

			var dataOpts, m;

			if (
				(dataOpts = jsc.getDataAttr(elms[i], 'jscolor')) !== null ||
				(elms[i].className && (m = elms[i].className.match(matchClass))) // installation using className (DEPRECATED)
			) {
				var targetElm = elms[i];

				var optsStr = '';
				if (dataOpts !== null) {
					optsStr = dataOpts;

				} else if (m) { // installation using className (DEPRECATED)
					console.warn('Installation using class name is DEPRECATED. Use data-jscolor="" attribute instead.' + jsc.docsRef);
					if (m[4]) {
						optsStr = m[4];
					}
				}

				var opts = null;
				if (optsStr.trim()) {
					try {
						opts = jsc.parseOptionsStr(optsStr);
					} catch (e) {
						console.warn(e + '\n' + optsStr);
					}
				}

				try {
					new jsc.pub(targetElm, opts);
				} catch (e) {
					console.warn(e);
				}
			}
		}
	},


	parseOptionsStr : function (str) {
		var opts = null;

		try {
			opts = JSON.parse(str);

		} catch (eParse) {
			if (!jsc.pub.looseJSON) {
				throw new Error('Could not parse jscolor options as JSON: ' + eParse);
			} else {
				// loose JSON syntax is enabled -> try to evaluate the options string as JavaScript object
				try {
					opts = (new Function ('var opts = (' + str + '); return typeof opts === "object" ? opts : {};'))();
				} catch (eEval) {
					throw new Error('Could not evaluate jscolor options: ' + eEval);
				}
			}
		}
		return opts;
	},


	getInstances : function () {
		var inst = [];
		for (var i = 0; i < jsc.instances.length; i += 1) {
			// if the targetElement still exists, the instance is considered "alive"
			if (jsc.instances[i] && jsc.instances[i].targetElement) {
				inst.push(jsc.instances[i]);
			}
		}
		return inst;
	},


	createEl : function (tagName) {
		var el = window.document.createElement(tagName);
		jsc.setData(el, 'gui', true);
		return el;
	},


	node : function (nodeOrSelector) {
		if (!nodeOrSelector) {
			return null;
		}

		if (typeof nodeOrSelector === 'string') {
			// query selector
			var sel = nodeOrSelector;
			var el = null;
			try {
				el = window.document.querySelector(sel);
			} catch (e) {
				console.warn(e);
				return null;
			}
			if (!el) {
				console.warn('No element matches the selector: %s', sel);
			}
			return el;
		}

		if (jsc.isNode(nodeOrSelector)) {
			// DOM node
			return nodeOrSelector;
		}

		console.warn('Invalid node of type %s: %s', typeof nodeOrSelector, nodeOrSelector);
		return null;
	},


	// See https://stackoverflow.com/questions/384286/
	isNode : function (val) {
		if (typeof Node === 'object') {
			return val instanceof Node;
		}
		return val && typeof val === 'object' && typeof val.nodeType === 'number' && typeof val.nodeName === 'string';
	},


	nodeName : function (node) {
		if (node && node.nodeName) {
			return node.nodeName.toLowerCase();
		}
		return false;
	},


	removeChildren : function (node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	},


	isTextInput : function (el) {
		return el && jsc.nodeName(el) === 'input' && el.type.toLowerCase() === 'text';
	},


	isButton : function (el) {
		if (!el) {
			return false;
		}
		var n = jsc.nodeName(el);
		return (
			(n === 'button') ||
			(n === 'input' && ['button', 'submit', 'reset'].indexOf(el.type.toLowerCase()) > -1)
		);
	},


	isButtonEmpty : function (el) {
		switch (jsc.nodeName(el)) {
			case 'input': return (!el.value || el.value.trim() === '');
			case 'button': return (el.textContent.trim() === '');
		}
		return null; // could not determine element's text
	},


	// See https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	isPassiveEventSupported : (function () {
		var supported = false;

		try {
			var opts = Object.defineProperty({}, 'passive', {
				get: function () { supported = true; }
			});
			window.addEventListener('testPassive', null, opts);
			window.removeEventListener('testPassive', null, opts);
		} catch (e) {}

		return supported;
	})(),


	isColorAttrSupported : (function () {
		var elm = window.document.createElement('input');
		if (elm.setAttribute) {
			elm.setAttribute('type', 'color');
			if (elm.type.toLowerCase() == 'color') {
				return true;
			}
		}
		return false;
	})(),


	dataProp : '_data_jscolor',


	// usage:
	//   setData(obj, prop, value)
	//   setData(obj, {prop:value, ...})
	//
	setData : function () {
		var obj = arguments[0];

		if (arguments.length === 3) {
			// setting a single property
			var data = obj.hasOwnProperty(jsc.dataProp) ? obj[jsc.dataProp] : (obj[jsc.dataProp] = {});
			var prop = arguments[1];
			var value = arguments[2];

			data[prop] = value;
			return true;

		} else if (arguments.length === 2 && typeof arguments[1] === 'object') {
			// setting multiple properties
			var data = obj.hasOwnProperty(jsc.dataProp) ? obj[jsc.dataProp] : (obj[jsc.dataProp] = {});
			var map = arguments[1];

			for (var prop in map) {
				if (map.hasOwnProperty(prop)) {
					data[prop] = map[prop];
				}
			}
			return true;
		}

		throw new Error('Invalid arguments');
	},


	// usage:
	//   removeData(obj, prop, [prop...])
	//
	removeData : function () {
		var obj = arguments[0];
		if (!obj.hasOwnProperty(jsc.dataProp)) {
			return true; // data object does not exist
		}
		for (var i = 1; i < arguments.length; i += 1) {
			var prop = arguments[i];
			delete obj[jsc.dataProp][prop];
		}
		return true;
	},


	getData : function (obj, prop, setDefault) {
		if (!obj.hasOwnProperty(jsc.dataProp)) {
			// data object does not exist
			if (setDefault !== undefined) {
				obj[jsc.dataProp] = {}; // create data object
			} else {
				return undefined; // no value to return
			}
		}
		var data = obj[jsc.dataProp];

		if (!data.hasOwnProperty(prop) && setDefault !== undefined) {
			data[prop] = setDefault;
		}
		return data[prop];
	},


	getDataAttr : function (el, name) {
		var attrName = 'data-' + name;
		var attrValue = el.getAttribute(attrName);
		return attrValue;
	},


	setDataAttr : function (el, name, value) {
		var attrName = 'data-' + name;
		el.setAttribute(attrName, value);
	},


	_attachedGroupEvents : {},


	attachGroupEvent : function (groupName, el, evnt, func) {
		if (!jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
			jsc._attachedGroupEvents[groupName] = [];
		}
		jsc._attachedGroupEvents[groupName].push([el, evnt, func]);
		el.addEventListener(evnt, func, false);
	},


	detachGroupEvents : function (groupName) {
		if (jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
			for (var i = 0; i < jsc._attachedGroupEvents[groupName].length; i += 1) {
				var evt = jsc._attachedGroupEvents[groupName][i];
				evt[0].removeEventListener(evt[1], evt[2], false);
			}
			delete jsc._attachedGroupEvents[groupName];
		}
	},


	preventDefault : function (e) {
		if (e.preventDefault) { e.preventDefault(); }
		e.returnValue = false;
	},


	triggerEvent : function (el, eventName, bubbles, cancelable) {
		if (!el) {
			return;
		}

		var ev = null;

		if (typeof Event === 'function') {
			ev = new Event(eventName, {
				bubbles: bubbles,
				cancelable: cancelable
			});
		} else {
			// IE
			ev = window.document.createEvent('Event');
			ev.initEvent(eventName, bubbles, cancelable);
		}

		if (!ev) {
			return false;
		}

		// so that we know that the event was triggered internally
		jsc.setData(ev, 'internal', true);

		el.dispatchEvent(ev);
		return true;
	},


	triggerInputEvent : function (el, eventName, bubbles, cancelable) {
		if (!el) {
			return;
		}
		if (jsc.isTextInput(el)) {
			jsc.triggerEvent(el, eventName, bubbles, cancelable);
		}
	},


	eventKey : function (ev) {
		var keys = {
			9: 'Tab',
			13: 'Enter',
			27: 'Escape',
		};
		if (typeof ev.code === 'string') {
			return ev.code;
		} else if (ev.keyCode !== undefined && keys.hasOwnProperty(ev.keyCode)) {
			return keys[ev.keyCode];
		}
		return null;
	},


	strList : function (str) {
		if (!str) {
			return [];
		}
		return str.replace(/^\s+|\s+$/g, '').split(/\s+/);
	},


	// The className parameter (str) can only contain a single class name
	hasClass : function (elm, className) {
		if (!className) {
			return false;
		}
		if (elm.classList !== undefined) {
			return elm.classList.contains(className);
		}
		// polyfill
		return -1 != (' ' + elm.className.replace(/\s+/g, ' ') + ' ').indexOf(' ' + className + ' ');
	},


	// The className parameter (str) can contain multiple class names separated by whitespace
	addClass : function (elm, className) {
		var classNames = jsc.strList(className);

		if (elm.classList !== undefined) {
			for (var i = 0; i < classNames.length; i += 1) {
				elm.classList.add(classNames[i]);
			}
			return;
		}
		// polyfill
		for (var i = 0; i < classNames.length; i += 1) {
			if (!jsc.hasClass(elm, classNames[i])) {
				elm.className += (elm.className ? ' ' : '') + classNames[i];
			}
		}
	},


	// The className parameter (str) can contain multiple class names separated by whitespace
	removeClass : function (elm, className) {
		var classNames = jsc.strList(className);

		if (elm.classList !== undefined) {
			for (var i = 0; i < classNames.length; i += 1) {
				elm.classList.remove(classNames[i]);
			}
			return;
		}
		// polyfill
		for (var i = 0; i < classNames.length; i += 1) {
			var repl = new RegExp(
				'^\\s*' + classNames[i] + '\\s*|' +
				'\\s*' + classNames[i] + '\\s*$|' +
				'\\s+' + classNames[i] + '(\\s+)',
				'g'
			);
			elm.className = elm.className.replace(repl, '$1');
		}
	},


	getCompStyle : function (elm) {
		var compStyle = window.getComputedStyle ? window.getComputedStyle(elm) : elm.currentStyle;

		// Note: In Firefox, getComputedStyle returns null in a hidden iframe,
		// that's why we need to check if the returned value is non-empty
		if (!compStyle) {
			return {};
		}
		return compStyle;
	},


	// Note:
	//   Setting a property to NULL reverts it to the state before it was first set
	//   with the 'reversible' flag enabled
	//
	setStyle : function (elm, styles, important, reversible) {
		// using '' for standard priority (IE10 apparently doesn't like value undefined)
		var priority = important ? 'important' : '';
		var origStyle = null;

		for (var prop in styles) {
			if (styles.hasOwnProperty(prop)) {
				var setVal = null;

				if (styles[prop] === null) {
					// reverting a property value

					if (!origStyle) {
						// get the original style object, but dont't try to create it if it doesn't exist
						origStyle = jsc.getData(elm, 'origStyle');
					}
					if (origStyle && origStyle.hasOwnProperty(prop)) {
						// we have property's original value -> use it
						setVal = origStyle[prop];
					}

				} else {
					// setting a property value

					if (reversible) {
						if (!origStyle) {
							// get the original style object and if it doesn't exist, create it
							origStyle = jsc.getData(elm, 'origStyle', {});
						}
						if (!origStyle.hasOwnProperty(prop)) {
							// original property value not yet stored -> store it
							origStyle[prop] = elm.style[prop];
						}
					}
					setVal = styles[prop];
				}

				if (setVal !== null) {
					elm.style.setProperty(prop, setVal, priority);
				}
			}
		}
	},


	appendCss : function (css) {
		var head = document.querySelector('head');
		var style = document.createElement('style');
		style.innerText = css;
		head.appendChild(style);
	},


	appendDefaultCss : function (css) {
		jsc.appendCss(
			[
				'.jscolor-wrap, .jscolor-wrap div, .jscolor-wrap canvas { ' +
				'position:static; display:block; visibility:visible; overflow:visible; margin:0; padding:0; ' +
				'border:none; border-radius:0; outline:none; z-index:auto; float:none; ' +
				'width:auto; height:auto; left:auto; right:auto; top:auto; bottom:auto; min-width:0; min-height:0; max-width:none; max-height:none; ' +
				'background:none; clip:auto; opacity:1; transform:none; box-shadow:none; box-sizing:content-box; ' +
				'}',
				'.jscolor-wrap { clear:both; }',
				'.jscolor-wrap .jscolor-picker { position:relative; }',
				'.jscolor-wrap .jscolor-shadow { position:absolute; left:0; top:0; width:100%; height:100%; }',
				'.jscolor-wrap .jscolor-border { position:relative; }',
				'.jscolor-wrap .jscolor-palette { position:absolute; }',
				'.jscolor-wrap .jscolor-palette-sw { position:absolute; display:block; cursor:pointer; }',
				'.jscolor-wrap .jscolor-btn { position:absolute; overflow:hidden; white-space:nowrap; font:13px sans-serif; text-align:center; cursor:pointer; }',
			].join('\n')
		);
	},


	hexColor : function (r, g, b) {
		return '#' + (
			('0' + Math.round(r).toString(16)).slice(-2) +
			('0' + Math.round(g).toString(16)).slice(-2) +
			('0' + Math.round(b).toString(16)).slice(-2)
		).toUpperCase();
	},


	hexaColor : function (r, g, b, a) {
		return '#' + (
			('0' + Math.round(r).toString(16)).slice(-2) +
			('0' + Math.round(g).toString(16)).slice(-2) +
			('0' + Math.round(b).toString(16)).slice(-2) +
			('0' + Math.round(a * 255).toString(16)).slice(-2)
		).toUpperCase();
	},


	rgbColor : function (r, g, b) {
		return 'rgb(' +
			Math.round(r) + ',' +
			Math.round(g) + ',' +
			Math.round(b) +
		')';
	},


	rgbaColor : function (r, g, b, a) {
		return 'rgba(' +
			Math.round(r) + ',' +
			Math.round(g) + ',' +
			Math.round(b) + ',' +
			(Math.round((a===undefined || a===null ? 1 : a) * 100) / 100) +
		')';
	},


	linearGradient : (function () {

		function getFuncName () {
			var stdName = 'linear-gradient';
			var prefixes = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
			var helper = window.document.createElement('div');

			for (var i = 0; i < prefixes.length; i += 1) {
				var tryFunc = prefixes[i] + stdName;
				var tryVal = tryFunc + '(to right, rgba(0,0,0,0), rgba(0,0,0,0))';

				helper.style.background = tryVal;
				if (helper.style.background) { // CSS background successfully set -> function name is supported
					return tryFunc;
				}
			}
			return stdName; // fallback to standard 'linear-gradient' without vendor prefix
		}

		var funcName = getFuncName();

		return function () {
			return funcName + '(' + Array.prototype.join.call(arguments, ', ') + ')';
		};

	})(),


	setBorderRadius : function (elm, value) {
		jsc.setStyle(elm, {'border-radius' : value || '0'});
	},


	setBoxShadow : function (elm, value) {
		jsc.setStyle(elm, {'box-shadow': value || 'none'});
	},


	getElementPos : function (e, relativeToViewport) {
		var x=0, y=0;
		var rect = e.getBoundingClientRect();
		x = rect.left;
		y = rect.top;
		if (!relativeToViewport) {
			var viewPos = jsc.getViewPos();
			x += viewPos[0];
			y += viewPos[1];
		}
		return [x, y];
	},


	getElementSize : function (e) {
		return [e.offsetWidth, e.offsetHeight];
	},


	// get pointer's X/Y coordinates relative to viewport
	getAbsPointerPos : function (e) {
		var x = 0, y = 0;
		if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
			// touch devices
			x = e.changedTouches[0].clientX;
			y = e.changedTouches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			x = e.clientX;
			y = e.clientY;
		}
		return { x: x, y: y };
	},


	// get pointer's X/Y coordinates relative to target element
	getRelPointerPos : function (e) {
		var target = e.target || e.srcElement;
		var targetRect = target.getBoundingClientRect();

		var x = 0, y = 0;

		var clientX = 0, clientY = 0;
		if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
			// touch devices
			clientX = e.changedTouches[0].clientX;
			clientY = e.changedTouches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		x = clientX - targetRect.left;
		y = clientY - targetRect.top;
		return { x: x, y: y };
	},


	getViewPos : function () {
		var doc = window.document.documentElement;
		return [
			(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
			(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
		];
	},


	getViewSize : function () {
		var doc = window.document.documentElement;
		return [
			(window.innerWidth || doc.clientWidth),
			(window.innerHeight || doc.clientHeight),
		];
	},


	// r: 0-255
	// g: 0-255
	// b: 0-255
	//
	// returns: [ 0-360, 0-100, 0-100 ]
	//
	RGB_HSV : function (r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
		var n = Math.min(Math.min(r,g),b);
		var v = Math.max(Math.max(r,g),b);
		var m = v - n;
		if (m === 0) { return [ null, 0, 100 * v ]; }
		var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
		return [
			60 * (h===6?0:h),
			100 * (m/v),
			100 * v
		];
	},


	// h: 0-360
	// s: 0-100
	// v: 0-100
	//
	// returns: [ 0-255, 0-255, 0-255 ]
	//
	HSV_RGB : function (h, s, v) {
		var u = 255 * (v / 100);

		if (h === null) {
			return [ u, u, u ];
		}

		h /= 60;
		s /= 100;

		var i = Math.floor(h);
		var f = i%2 ? h-i : 1-(h-i);
		var m = u * (1 - s);
		var n = u * (1 - s * f);
		switch (i) {
			case 6:
			case 0: return [u,n,m];
			case 1: return [n,u,m];
			case 2: return [m,u,n];
			case 3: return [m,n,u];
			case 4: return [n,m,u];
			case 5: return [u,m,n];
		}
	},


	parseColorString : function (str) {
		var ret = {
			rgba: null,
			format: null // 'hex' | 'hexa' | 'rgb' | 'rgba'
		};

		var m;

		if (m = str.match(/^\W*([0-9A-F]{3,8})\W*$/i)) {
			// HEX notation

			if (m[1].length === 8) {
				// 8-char notation (= with alpha)
				ret.format = 'hexa';
				ret.rgba = [
					parseInt(m[1].slice(0,2),16),
					parseInt(m[1].slice(2,4),16),
					parseInt(m[1].slice(4,6),16),
					parseInt(m[1].slice(6,8),16) / 255
				];

			} else if (m[1].length === 6) {
				// 6-char notation
				ret.format = 'hex';
				ret.rgba = [
					parseInt(m[1].slice(0,2),16),
					parseInt(m[1].slice(2,4),16),
					parseInt(m[1].slice(4,6),16),
					null
				];

			} else if (m[1].length === 3) {
				// 3-char notation
				ret.format = 'hex';
				ret.rgba = [
					parseInt(m[1].charAt(0) + m[1].charAt(0),16),
					parseInt(m[1].charAt(1) + m[1].charAt(1),16),
					parseInt(m[1].charAt(2) + m[1].charAt(2),16),
					null
				];

			} else {
				return false;
			}

			return ret;
		}

		if (m = str.match(/^\W*rgba?\(([^)]*)\)\W*$/i)) {
			// rgb(...) or rgba(...) notation

			var par = m[1].split(',');
			var re = /^\s*(\d+|\d*\.\d+|\d+\.\d*)\s*$/;
			var mR, mG, mB, mA;
			if (
				par.length >= 3 &&
				(mR = par[0].match(re)) &&
				(mG = par[1].match(re)) &&
				(mB = par[2].match(re))
			) {
				ret.format = 'rgb';
				ret.rgba = [
					parseFloat(mR[1]) || 0,
					parseFloat(mG[1]) || 0,
					parseFloat(mB[1]) || 0,
					null
				];

				if (
					par.length >= 4 &&
					(mA = par[3].match(re))
				) {
					ret.format = 'rgba';
					ret.rgba[3] = parseFloat(mA[1]) || 0;
				}
				return ret;
			}
		}

		return false;
	},


	parsePaletteValue : function (mixed) {
		var vals = [];

		if (typeof mixed === 'string') { // input is a string of space separated color values
			// rgb() and rgba() may contain spaces too, so let's find all color values by regex
			mixed.replace(/#[0-9A-F]{3}\b|#[0-9A-F]{6}([0-9A-F]{2})?\b|rgba?\(([^)]*)\)/ig, function (val) {
				vals.push(val);
			});
		} else if (Array.isArray(mixed)) { // input is an array of color values
			vals = mixed;
		}

		// convert all values into uniform color format

		var colors = [];

		for (var i = 0; i < vals.length; i++) {
			var color = jsc.parseColorString(vals[i]);
			if (color) {
				colors.push(color);
			}
		}

		return colors;
	},


	containsTranparentColor : function (colors) {
		for (var i = 0; i < colors.length; i++) {
			var a = colors[i].rgba[3];
			if (a !== null && a < 1.0) {
				return true;
			}
		}
		return false;
	},


	isAlphaFormat : function (format) {
		switch (format.toLowerCase()) {
		case 'hexa':
		case 'rgba':
			return true;
		}
		return false;
	},


	// Canvas scaling for retina displays
	//
	// adapted from https://www.html5rocks.com/en/tutorials/canvas/hidpi/
	//
	scaleCanvasForHighDPR : function (canvas) {
		var dpr = window.devicePixelRatio || 1;
		canvas.width *= dpr;
		canvas.height *= dpr;
		var ctx = canvas.getContext('2d');
		ctx.scale(dpr, dpr);
	},


	genColorPreviewCanvas : function (color, separatorPos, specWidth, scaleForHighDPR) {

		var sepW = Math.round(jsc.pub.previewSeparator.length);
		var sqSize = jsc.pub.chessboardSize;
		var sqColor1 = jsc.pub.chessboardColor1;
		var sqColor2 = jsc.pub.chessboardColor2;

		var cWidth = specWidth ? specWidth : sqSize * 2;
		var cHeight = sqSize * 2;

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		canvas.width = cWidth;
		canvas.height = cHeight;
		if (scaleForHighDPR) {
			jsc.scaleCanvasForHighDPR(canvas);
		}

		// transparency chessboard - background
		ctx.fillStyle = sqColor1;
		ctx.fillRect(0, 0, cWidth, cHeight);

		// transparency chessboard - squares
		ctx.fillStyle = sqColor2;
		for (var x = 0; x < cWidth; x += sqSize * 2) {
			ctx.fillRect(x, 0, sqSize, sqSize);
			ctx.fillRect(x + sqSize, sqSize, sqSize, sqSize);
		}

		if (color) {
			// actual color in foreground
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, cWidth, cHeight);
		}

		var start = null;
		switch (separatorPos) {
			case 'left':
				start = 0;
				ctx.clearRect(0, 0, sepW/2, cHeight);
				break;
			case 'right':
				start = cWidth - sepW;
				ctx.clearRect(cWidth - (sepW/2), 0, sepW/2, cHeight);
				break;
		}
		if (start !== null) {
			ctx.lineWidth = 1;
			for (var i = 0; i < jsc.pub.previewSeparator.length; i += 1) {
				ctx.beginPath();
				ctx.strokeStyle = jsc.pub.previewSeparator[i];
				ctx.moveTo(0.5 + start + i, 0);
				ctx.lineTo(0.5 + start + i, cHeight);
				ctx.stroke();
			}
		}

		return {
			canvas: canvas,
			width: cWidth,
			height: cHeight,
		};
	},


	// if position or width is not set => fill the entire element (0%-100%)
	genColorPreviewGradient : function (color, position, width) {
		var params = [];

		if (position && width) {
			params = [
				'to ' + {'left':'right', 'right':'left'}[position],
				color + ' 0%',
				color + ' ' + width + 'px',
				'rgba(0,0,0,0) ' + (width + 1) + 'px',
				'rgba(0,0,0,0) 100%',
			];
		} else {
			params = [
				'to right',
				color + ' 0%',
				color + ' 100%',
			];
		}

		return jsc.linearGradient.apply(this, params);
	},


	redrawPosition : function () {

		if (!jsc.picker || !jsc.picker.owner) {
			return; // picker is not shown
		}

		var thisObj = jsc.picker.owner;

		if (thisObj.container !== window.document.body) {

			jsc._drawPosition(thisObj, 0, 0, 'relative', false);

		} else {

			var tp, vp;

			if (thisObj.fixed) {
				// Fixed elements are positioned relative to viewport,
				// therefore we can ignore the scroll offset
				tp = jsc.getElementPos(thisObj.targetElement, true); // target pos
				vp = [0, 0]; // view pos
			} else {
				tp = jsc.getElementPos(thisObj.targetElement); // target pos
				vp = jsc.getViewPos(); // view pos
			}

			var ts = jsc.getElementSize(thisObj.targetElement); // target size
			var vs = jsc.getViewSize(); // view size
			var pd = jsc.getPickerDims(thisObj);
			var ps = [pd.borderW, pd.borderH]; // picker outer size
			var a, b, c;
			switch (thisObj.position.toLowerCase()) {
				case 'left': a=1; b=0; c=-1; break;
				case 'right':a=1; b=0; c=1; break;
				case 'top':  a=0; b=1; c=-1; break;
				default:     a=0; b=1; c=1; break;
			}
			var l = (ts[b]+ps[b])/2;

			// compute picker position
			if (!thisObj.smartPosition) {
				var pp = [
					tp[a],
					tp[b]+ts[b]-l+l*c
				];
			} else {
				var pp = [
					-vp[a]+tp[a]+ps[a] > vs[a] ?
						(-vp[a]+tp[a]+ts[a]/2 > vs[a]/2 && tp[a]+ts[a]-ps[a] >= 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
						tp[a],
					-vp[b]+tp[b]+ts[b]+ps[b]-l+l*c > vs[b] ?
						(-vp[b]+tp[b]+ts[b]/2 > vs[b]/2 && tp[b]+ts[b]-l-l*c >= 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
						(tp[b]+ts[b]-l+l*c >= 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
				];
			}

			var x = pp[a];
			var y = pp[b];
			var positionValue = thisObj.fixed ? 'fixed' : 'absolute';
			var contractShadow =
				(pp[0] + ps[0] > tp[0] || pp[0] < tp[0] + ts[0]) &&
				(pp[1] + ps[1] < tp[1] + ts[1]);

			jsc._drawPosition(thisObj, x, y, positionValue, contractShadow);

		}

	},


	_drawPosition : function (thisObj, x, y, positionValue, contractShadow) {
		var vShadow = contractShadow ? 0 : thisObj.shadowBlur; // px

		jsc.picker.wrap.style.position = positionValue;

		if ( // To avoid unnecessary repositioning during scroll
			Math.round(parseFloat(jsc.picker.wrap.style.left)) !== Math.round(x) ||
			Math.round(parseFloat(jsc.picker.wrap.style.top)) !== Math.round(y)
		) {
			jsc.picker.wrap.style.left = x + 'px';
			jsc.picker.wrap.style.top = y + 'px';
		}

		jsc.setBoxShadow(
			jsc.picker.boxS,
			thisObj.shadow ?
				new jsc.BoxShadow(0, vShadow, thisObj.shadowBlur, 0, thisObj.shadowColor) :
				null);
	},


	getPickerDims : function (thisObj) {
		var w = 2 * thisObj.controlBorderWidth + thisObj.width;
		var h = 2 * thisObj.controlBorderWidth + thisObj.height;

		var sliderSpace = 2 * thisObj.controlBorderWidth + 2 * jsc.getControlPadding(thisObj) + thisObj.sliderSize;

		if (jsc.getSliderChannel(thisObj)) {
			w += sliderSpace;
		}
		if (thisObj.hasAlphaChannel()) {
			w += sliderSpace;
		}

		var pal = jsc.getPaletteDims(thisObj, w);

		if (pal.height) {
			h += pal.height + thisObj.padding;
		}
		if (thisObj.closeButton) {
			h += 2 * thisObj.controlBorderWidth + thisObj.padding + thisObj.buttonHeight;
		}

		var pW = w + (2 * thisObj.padding);
		var pH = h + (2 * thisObj.padding);

		return {
			contentW: w,
			contentH: h,
			paddedW: pW,
			paddedH: pH,
			borderW: pW + (2 * thisObj.borderWidth),
			borderH: pH + (2 * thisObj.borderWidth),
			palette: pal,
		};
	},


	getPaletteDims : function (thisObj, width) {
		var cols = 0, rows = 0, cellW = 0, cellH = 0, height = 0;
		var sampleCount = thisObj._palette ? thisObj._palette.length : 0;

		if (sampleCount) {
			cols = thisObj.paletteCols;
			rows = cols > 0 ? Math.ceil(sampleCount / cols) : 0;

			// color sample's dimensions (includes border)
			cellW = Math.max(1, Math.floor((width - ((cols - 1) * thisObj.paletteSpacing)) / cols));
			cellH = thisObj.paletteHeight ? Math.min(thisObj.paletteHeight, cellW) : cellW;
		}

		if (rows) {
			height =
				rows * cellH +
				(rows - 1) * thisObj.paletteSpacing;
		}

		return {
			cols: cols,
			rows: rows,
			cellW: cellW,
			cellH: cellH,
			width: width,
			height: height,
		};
	},


	getControlPadding : function (thisObj) {
		return Math.max(
			thisObj.padding / 2,
			(2 * thisObj.pointerBorderWidth + thisObj.pointerThickness) - thisObj.controlBorderWidth
		);
	},


	getPadYChannel : function (thisObj) {
		switch (thisObj.mode.charAt(1).toLowerCase()) {
			case 'v': return 'v'; break;
		}
		return 's';
	},


	getSliderChannel : function (thisObj) {
		if (thisObj.mode.length > 2) {
			switch (thisObj.mode.charAt(2).toLowerCase()) {
				case 's': return 's'; break;
				case 'v': return 'v'; break;
			}
		}
		return null;
	},


	// calls function specified in picker's property
	triggerCallback : function (thisObj, prop) {
		if (!thisObj[prop]) {
			return; // callback func not specified
		}
		var callback = null;

		if (typeof thisObj[prop] === 'string') {
			// string with code
			try {
				callback = new Function (thisObj[prop]);
			} catch (e) {
				console.error(e);
			}
		} else {
			// function
			callback = thisObj[prop];
		}

		if (callback) {
			callback.call(thisObj);
		}
	},


	// Triggers a color change related event(s) on all picker instances.
	// It is possible to specify multiple events separated with a space.
	triggerGlobal : function (eventNames) {
		var inst = jsc.getInstances();
		for (var i = 0; i < inst.length; i += 1) {
			inst[i].trigger(eventNames);
		}
	},


	_pointerMoveEvent : {
		mouse: 'mousemove',
		touch: 'touchmove'
	},
	_pointerEndEvent : {
		mouse: 'mouseup',
		touch: 'touchend'
	},


	_pointerOrigin : null,


	onDocumentKeyUp : function (e) {
		if (['Tab', 'Escape'].indexOf(jsc.eventKey(e)) !== -1) {
			if (jsc.picker && jsc.picker.owner) {
				jsc.picker.owner.tryHide();
			}
		}
	},


	onWindowResize : function (e) {
		jsc.redrawPosition();
	},


	onWindowScroll : function (e) {
		jsc.redrawPosition();
	},


	onParentScroll : function (e) {
		// hide the picker when one of the parent elements is scrolled
		if (jsc.picker && jsc.picker.owner) {
			jsc.picker.owner.tryHide();
		}
	},


	onDocumentMouseDown : function (e) {
		var target = e.target || e.srcElement;

		if (target.jscolor && target.jscolor instanceof jsc.pub) { // clicked targetElement -> show picker
			if (target.jscolor.showOnClick && !target.disabled) {
				target.jscolor.show();
			}
		} else if (jsc.getData(target, 'gui')) { // clicked jscolor's GUI element
			var control = jsc.getData(target, 'control');
			if (control) {
				// jscolor's control
				jsc.onControlPointerStart(e, target, jsc.getData(target, 'control'), 'mouse');
			}
		} else {
			// mouse is outside the picker's controls -> hide the color picker!
			if (jsc.picker && jsc.picker.owner) {
				jsc.picker.owner.tryHide();
			}
		}
	},


	onPickerTouchStart : function (e) {
		var target = e.target || e.srcElement;

		if (jsc.getData(target, 'control')) {
			jsc.onControlPointerStart(e, target, jsc.getData(target, 'control'), 'touch');
		}
	},


	onControlPointerStart : function (e, target, controlName, pointerType) {
		var thisObj = jsc.getData(target, 'instance');

		jsc.preventDefault(e);

		var registerDragEvents = function (doc, offset) {
			jsc.attachGroupEvent('drag', doc, jsc._pointerMoveEvent[pointerType],
				jsc.onDocumentPointerMove(e, target, controlName, pointerType, offset));
			jsc.attachGroupEvent('drag', doc, jsc._pointerEndEvent[pointerType],
				jsc.onDocumentPointerEnd(e, target, controlName, pointerType));
		};

		registerDragEvents(window.document, [0, 0]);

		if (window.parent && window.frameElement) {
			var rect = window.frameElement.getBoundingClientRect();
			var ofs = [-rect.left, -rect.top];
			registerDragEvents(window.parent.window.document, ofs);
		}

		var abs = jsc.getAbsPointerPos(e);
		var rel = jsc.getRelPointerPos(e);
		jsc._pointerOrigin = {
			x: abs.x - rel.x,
			y: abs.y - rel.y
		};

		switch (controlName) {
		case 'pad':
			// if the value slider is at the bottom, move it up
			if (jsc.getSliderChannel(thisObj) === 'v' && thisObj.channels.v === 0) {
				thisObj.fromHSVA(null, null, 100, null);
			}
			jsc.setPad(thisObj, e, 0, 0);
			break;

		case 'sld':
			jsc.setSld(thisObj, e, 0);
			break;

		case 'asld':
			jsc.setASld(thisObj, e, 0);
			break;
		}
		thisObj.trigger('input');
	},


	onDocumentPointerMove : function (e, target, controlName, pointerType, offset) {
		return function (e) {
			var thisObj = jsc.getData(target, 'instance');
			switch (controlName) {
			case 'pad':
				jsc.setPad(thisObj, e, offset[0], offset[1]);
				break;

			case 'sld':
				jsc.setSld(thisObj, e, offset[1]);
				break;

			case 'asld':
				jsc.setASld(thisObj, e, offset[1]);
				break;
			}
			thisObj.trigger('input');
		}
	},


	onDocumentPointerEnd : function (e, target, controlName, pointerType) {
		return function (e) {
			var thisObj = jsc.getData(target, 'instance');
			jsc.detachGroupEvents('drag');

			// Always trigger changes AFTER detaching outstanding mouse handlers,
			// in case some color change that occured in user-defined onChange/onInput handler
			// intruded into current mouse events
			thisObj.trigger('input');
			thisObj.trigger('change');
		};
	},


	onPaletteSampleClick : function (e) {
		var target = e.currentTarget;
		var thisObj = jsc.getData(target, 'instance');
		var color = jsc.getData(target, 'color');

		// when format is flexible, use the original format of this color sample
		if (thisObj.format.toLowerCase() === 'any') {
			thisObj._setFormat(color.format); // adapt format
			if (!jsc.isAlphaFormat(thisObj.getFormat())) {
				color.rgba[3] = 1.0; // when switching to a format that doesn't support alpha, set full opacity
			}
		}

		// if this color doesn't specify alpha, use alpha of 1.0 (if applicable)
		if (color.rgba[3] === null) {
			if (thisObj.paletteSetsAlpha === true || (thisObj.paletteSetsAlpha === 'auto' && thisObj._paletteHasTransparency)) {
				color.rgba[3] = 1.0;
			}
		}

		thisObj.fromRGBA.apply(thisObj, color.rgba);

		thisObj.trigger('input');
		thisObj.trigger('change');

		if (thisObj.hideOnPaletteClick) {
			thisObj.hide();
		}
	},


	setPad : function (thisObj, e, ofsX, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var x = ofsX + pointerAbs.x - jsc._pointerOrigin.x - thisObj.padding - thisObj.controlBorderWidth;
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.controlBorderWidth;

		var xVal = x * (360 / (thisObj.width - 1));
		var yVal = 100 - (y * (100 / (thisObj.height - 1)));

		switch (jsc.getPadYChannel(thisObj)) {
		case 's': thisObj.fromHSVA(xVal, yVal, null, null); break;
		case 'v': thisObj.fromHSVA(xVal, null, yVal, null); break;
		}
	},


	setSld : function (thisObj, e, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.controlBorderWidth;
		var yVal = 100 - (y * (100 / (thisObj.height - 1)));

		switch (jsc.getSliderChannel(thisObj)) {
		case 's': thisObj.fromHSVA(null, yVal, null, null); break;
		case 'v': thisObj.fromHSVA(null, null, yVal, null); break;
		}
	},


	setASld : function (thisObj, e, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.controlBorderWidth;
		var yVal = 1.0 - (y * (1.0 / (thisObj.height - 1)));

		if (yVal < 1.0) {
			// if format is flexible and the current format doesn't support alpha, switch to a suitable one
			var fmt = thisObj.getFormat();
			if (thisObj.format.toLowerCase() === 'any' && !jsc.isAlphaFormat(fmt)) {
				thisObj._setFormat(fmt === 'hex' ? 'hexa' : 'rgba');
			}
		}

		thisObj.fromHSVA(null, null, null, yVal);
	},


	createPadCanvas : function () {

		var ret = {
			elm: null,
			draw: null
		};

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		var drawFunc = function (width, height, type) {
			canvas.width = width;
			canvas.height = height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
			hGrad.addColorStop(0 / 6, '#F00');
			hGrad.addColorStop(1 / 6, '#FF0');
			hGrad.addColorStop(2 / 6, '#0F0');
			hGrad.addColorStop(3 / 6, '#0FF');
			hGrad.addColorStop(4 / 6, '#00F');
			hGrad.addColorStop(5 / 6, '#F0F');
			hGrad.addColorStop(6 / 6, '#F00');

			ctx.fillStyle = hGrad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			var vGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			switch (type.toLowerCase()) {
			case 's':
				vGrad.addColorStop(0, 'rgba(255,255,255,0)');
				vGrad.addColorStop(1, 'rgba(255,255,255,1)');
				break;
			case 'v':
				vGrad.addColorStop(0, 'rgba(0,0,0,0)');
				vGrad.addColorStop(1, 'rgba(0,0,0,1)');
				break;
			}
			ctx.fillStyle = vGrad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm = canvas;
		ret.draw = drawFunc;

		return ret;
	},


	createSliderGradient : function () {

		var ret = {
			elm: null,
			draw: null
		};

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		var drawFunc = function (width, height, color1, color2) {
			canvas.width = width;
			canvas.height = height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			grad.addColorStop(0, color1);
			grad.addColorStop(1, color2);

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm = canvas;
		ret.draw = drawFunc;

		return ret;
	},


	createASliderGradient : function () {

		var ret = {
			elm: null,
			draw: null
		};

		var canvas = jsc.createEl('canvas');
		var ctx = canvas.getContext('2d');

		var drawFunc = function (width, height, color) {
			canvas.width = width;
			canvas.height = height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var sqSize = canvas.width / 2;
			var sqColor1 = jsc.pub.chessboardColor1;
			var sqColor2 = jsc.pub.chessboardColor2;

			// dark gray background
			ctx.fillStyle = sqColor1;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			if (sqSize > 0) { // to avoid infinite loop
				for (var y = 0; y < canvas.height; y += sqSize * 2) {
					// light gray squares
					ctx.fillStyle = sqColor2;
					ctx.fillRect(0, y, sqSize, sqSize);
					ctx.fillRect(sqSize, y + sqSize, sqSize, sqSize);
				}
			}

			var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			grad.addColorStop(0, color);
			grad.addColorStop(1, 'rgba(0,0,0,0)');

			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		ret.elm = canvas;
		ret.draw = drawFunc;

		return ret;
	},


	BoxShadow : (function () {
		var BoxShadow = function (hShadow, vShadow, blur, spread, color, inset) {
			this.hShadow = hShadow;
			this.vShadow = vShadow;
			this.blur = blur;
			this.spread = spread;
			this.color = color;
			this.inset = !!inset;
		};

		BoxShadow.prototype.toString = function () {
			var vals = [
				Math.round(this.hShadow) + 'px',
				Math.round(this.vShadow) + 'px',
				Math.round(this.blur) + 'px',
				Math.round(this.spread) + 'px',
				this.color
			];
			if (this.inset) {
				vals.push('inset');
			}
			return vals.join(' ');
		};

		return BoxShadow;
	})(),


	flags : {
		leaveValue : 1 << 0,
		leaveAlpha : 1 << 1,
		leavePreview : 1 << 2,
	},


	enumOpts : {
		format: ['auto', 'any', 'hex', 'hexa', 'rgb', 'rgba'],
		previewPosition: ['left', 'right'],
		mode: ['hsv', 'hvs', 'hs', 'hv'],
		position: ['left', 'right', 'top', 'bottom'],
		alphaChannel: ['auto', true, false],
		paletteSetsAlpha: ['auto', true, false],
	},


	deprecatedOpts : {
		// <old_option>: <new_option>  (<new_option> can be null)
		'styleElement': 'previewElement',
		'onFineChange': 'onInput',
		'overwriteImportant': 'forceStyle',
		'closable': 'closeButton',
		'insetWidth': 'controlBorderWidth',
		'insetColor': 'controlBorderColor',
		'refine': null,
	},


	docsRef : ' ' + 'See https://jscolor.com/docs/',


	//
	// Usage:
	// var myPicker = new JSColor(<targetElement> [, <options>])
	//
	// (constructor is accessible via both 'jscolor' and 'JSColor' name)
	//

	pub : function (targetElement, opts) {

		var THIS = this;

		if (!opts) {
			opts = {};
		}

		this.channels = {
			r: 255, // red [0-255]
			g: 255, // green [0-255]
			b: 255, // blue [0-255]
			h: 0, // hue [0-360]
			s: 0, // saturation [0-100]
			v: 100, // value (brightness) [0-100]
			a: 1.0, // alpha (opacity) [0.0 - 1.0]
		};

		// General options
		//
		this.format = 'auto'; // 'auto' | 'any' | 'hex' | 'hexa' | 'rgb' | 'rgba' - Format of the input/output value
		this.value = undefined; // INITIAL color value in any supported format. To change it later, use method fromString(), fromHSVA(), fromRGBA() or channel()
		this.alpha = undefined; // INITIAL alpha value. To change it later, call method channel('A', <value>)
		this.random = false; // whether to randomize the initial color. Either true | false, or an array of ranges: [minV, maxV, minS, maxS, minH, maxH, minA, maxA]
		this.onChange = undefined; // called when color changes. Value can be either a function or a string with JS code.
		this.onInput = undefined; // called repeatedly as the color is being changed, e.g. while dragging a slider. Value can be either a function or a string with JS code.
		this.valueElement = undefined; // element that will be used to display and input the color value
		this.alphaElement = undefined; // element that will be used to display and input the alpha (opacity) value
		this.previewElement = undefined; // element that will preview the picked color using CSS background
		this.previewPosition = 'left'; // 'left' | 'right' - position of the color preview in previewElement
		this.previewSize = 32; // (px) width of the color preview displayed in previewElement
		this.previewPadding = 8; // (px) space between color preview and content of the previewElement
		this.required = true; // whether the associated text input must always contain a color value. If false, the input can be left empty.
		this.hash = true; // whether to prefix the HEX color code with # symbol (only applicable for HEX format)
		this.uppercase = true; // whether to show the HEX color code in upper case (only applicable for HEX format)
		this.forceStyle = true; // whether to overwrite CSS style of the previewElement using !important flag

		// Color Picker options
		//
		this.width = 181; // width of the color spectrum (in px)
		this.height = 101; // height of the color spectrum (in px)
		this.mode = 'HSV'; // 'HSV' | 'HVS' | 'HS' | 'HV' - layout of the color picker controls
		this.alphaChannel = 'auto'; // 'auto' | true | false - if alpha channel is enabled, the alpha slider will be visible. If 'auto', it will be determined according to color format
		this.position = 'bottom'; // 'left' | 'right' | 'top' | 'bottom' - position relative to the target element
		this.smartPosition = true; // automatically change picker position when there is not enough space for it
		this.showOnClick = true; // whether to show the picker when user clicks its target element
		this.hideOnLeave = true; // whether to automatically hide the picker when user leaves its target element (e.g. upon clicking the document)
		this.palette = []; // colors to be displayed in the palette, specified as an array or a string of space separated color values (in any supported format)
		this.paletteCols = 10; // number of columns in the palette
		this.paletteSetsAlpha = 'auto'; // 'auto' | true | false - if true, palette colors that don't specify alpha will set alpha to 1.0
		this.paletteHeight = 16; // maximum height (px) of a row in the palette
		this.paletteSpacing = 4; // distance (px) between color samples in the palette
		this.hideOnPaletteClick = false; // when set to true, clicking the palette will also hide the color picker
		this.sliderSize = 16; // px
		this.crossSize = 8; // px
		this.closeButton = false; // whether to display the Close button
		this.closeText = 'Close';
		this.buttonColor = 'rgba(0,0,0,1)'; // CSS color
		this.buttonHeight = 18; // px
		this.padding = 12; // px
		this.backgroundColor = 'rgba(255,255,255,1)'; // CSS color
		this.borderWidth = 1; // px
		this.borderColor = 'rgba(187,187,187,1)'; // CSS color
		this.borderRadius = 8; // px
		this.controlBorderWidth = 1; // px
		this.controlBorderColor = 'rgba(187,187,187,1)'; // CSS color
		this.shadow = true; // whether to display a shadow
		this.shadowBlur = 15; // px
		this.shadowColor = 'rgba(0,0,0,0.2)'; // CSS color
		this.pointerColor = 'rgba(76,76,76,1)'; // CSS color
		this.pointerBorderWidth = 1; // px
		this.pointerBorderColor = 'rgba(255,255,255,1)'; // CSS color
		this.pointerThickness = 2; // px
		this.zIndex = 5000;
		this.container = undefined; // where to append the color picker (BODY element by default)

		// Experimental
		//
		this.minS = 0; // min allowed saturation (0 - 100)
		this.maxS = 100; // max allowed saturation (0 - 100)
		this.minV = 0; // min allowed value (brightness) (0 - 100)
		this.maxV = 100; // max allowed value (brightness) (0 - 100)
		this.minA = 0.0; // min allowed alpha (opacity) (0.0 - 1.0)
		this.maxA = 1.0; // max allowed alpha (opacity) (0.0 - 1.0)


		// Getter: option(name)
		// Setter: option(name, value)
		//         option({name:value, ...})
		//
		this.option = function () {
			if (!arguments.length) {
				throw new Error('No option specified');
			}

			if (arguments.length === 1 && typeof arguments[0] === 'string') {
				// getting a single option
				try {
					return getOption(arguments[0]);
				} catch (e) {
					console.warn(e);
				}
				return false;

			} else if (arguments.length >= 2 && typeof arguments[0] === 'string') {
				// setting a single option
				try {
					if (!setOption(arguments[0], arguments[1])) {
						return false;
					}
				} catch (e) {
					console.warn(e);
					return false;
				}
				this.redraw(); // immediately redraws the picker, if it's displayed
				this.exposeColor(); // in case some preview-related or format-related option was changed
				return true;

			} else if (arguments.length === 1 && typeof arguments[0] === 'object') {
				// setting multiple options
				var opts = arguments[0];
				var success = true;
				for (var opt in opts) {
					if (opts.hasOwnProperty(opt)) {
						try {
							if (!setOption(opt, opts[opt])) {
								success = false;
							}
						} catch (e) {
							console.warn(e);
							success = false;
						}
					}
				}
				this.redraw(); // immediately redraws the picker, if it's displayed
				this.exposeColor(); // in case some preview-related or format-related option was changed
				return success;
			}

			throw new Error('Invalid arguments');
		}


		// Getter: channel(name)
		// Setter: channel(name, value)
		//
		this.channel = function (name, value) {
			if (typeof name !== 'string') {
				throw new Error('Invalid value for channel name: ' + name);
			}

			if (value === undefined) {
				// getting channel value
				if (!this.channels.hasOwnProperty(name.toLowerCase())) {
					console.warn('Getting unknown channel: ' + name);
					return false;
				}
				return this.channels[name.toLowerCase()];

			} else {
				// setting channel value
				var res = false;
				switch (name.toLowerCase()) {
					case 'r': res = this.fromRGBA(value, null, null, null); break;
					case 'g': res = this.fromRGBA(null, value, null, null); break;
					case 'b': res = this.fromRGBA(null, null, value, null); break;
					case 'h': res = this.fromHSVA(value, null, null, null); break;
					case 's': res = this.fromHSVA(null, value, null, null); break;
					case 'v': res = this.fromHSVA(null, null, value, null); break;
					case 'a': res = this.fromHSVA(null, null, null, value); break;
					default:
						console.warn('Setting unknown channel: ' + name);
						return false;
				}
				if (res) {
					this.redraw(); // immediately redraws the picker, if it's displayed
					return true;
				}
			}

			return false;
		}


		// Triggers given input event(s) by:
		// - executing on<Event> callback specified as picker's option
		// - triggering standard DOM event listeners attached to the value element
		//
		// It is possible to specify multiple events separated with a space.
		//
		this.trigger = function (eventNames) {
			var evs = jsc.strList(eventNames);
			for (var i = 0; i < evs.length; i += 1) {
				var ev = evs[i].toLowerCase();

				// trigger a callback
				var callbackProp = null;
				switch (ev) {
					case 'input': callbackProp = 'onInput'; break;
					case 'change': callbackProp = 'onChange'; break;
				}
				if (callbackProp) {
					jsc.triggerCallback(this, callbackProp);
				}

				// trigger standard DOM event listeners on the value element
				jsc.triggerInputEvent(this.valueElement, ev, true, true);
			}
		};


		// h: 0-360
		// s: 0-100
		// v: 0-100
		// a: 0.0-1.0
		//
		this.fromHSVA = function (h, s, v, a, flags) { // null = don't change
			if (h === undefined) { h = null; }
			if (s === undefined) { s = null; }
			if (v === undefined) { v = null; }
			if (a === undefined) { a = null; }

			if (h !== null) {
				if (isNaN(h)) { return false; }
				this.channels.h = Math.max(0, Math.min(360, h));
			}
			if (s !== null) {
				if (isNaN(s)) { return false; }
				this.channels.s = Math.max(0, Math.min(100, this.maxS, s), this.minS);
			}
			if (v !== null) {
				if (isNaN(v)) { return false; }
				this.channels.v = Math.max(0, Math.min(100, this.maxV, v), this.minV);
			}
			if (a !== null) {
				if (isNaN(a)) { return false; }
				this.channels.a = this.hasAlphaChannel() ?
					Math.max(0, Math.min(1, this.maxA, a), this.minA) :
					1.0; // if alpha channel is disabled, the color should stay 100% opaque
			}

			var rgb = jsc.HSV_RGB(
				this.channels.h,
				this.channels.s,
				this.channels.v
			);
			this.channels.r = rgb[0];
			this.channels.g = rgb[1];
			this.channels.b = rgb[2];

			this.exposeColor(flags);
			return true;
		};


		// r: 0-255
		// g: 0-255
		// b: 0-255
		// a: 0.0-1.0
		//
		this.fromRGBA = function (r, g, b, a, flags) { // null = don't change
			if (r === undefined) { r = null; }
			if (g === undefined) { g = null; }
			if (b === undefined) { b = null; }
			if (a === undefined) { a = null; }

			if (r !== null) {
				if (isNaN(r)) { return false; }
				r = Math.max(0, Math.min(255, r));
			}
			if (g !== null) {
				if (isNaN(g)) { return false; }
				g = Math.max(0, Math.min(255, g));
			}
			if (b !== null) {
				if (isNaN(b)) { return false; }
				b = Math.max(0, Math.min(255, b));
			}
			if (a !== null) {
				if (isNaN(a)) { return false; }
				this.channels.a = this.hasAlphaChannel() ?
					Math.max(0, Math.min(1, this.maxA, a), this.minA) :
					1.0; // if alpha channel is disabled, the color should stay 100% opaque
			}

			var hsv = jsc.RGB_HSV(
				r===null ? this.channels.r : r,
				g===null ? this.channels.g : g,
				b===null ? this.channels.b : b
			);
			if (hsv[0] !== null) {
				this.channels.h = Math.max(0, Math.min(360, hsv[0]));
			}
			if (hsv[2] !== 0) { // fully black color stays black through entire saturation range, so let's not change saturation
				this.channels.s = Math.max(0, this.minS, Math.min(100, this.maxS, hsv[1]));
			}
			this.channels.v = Math.max(0, this.minV, Math.min(100, this.maxV, hsv[2]));

			// update RGB according to final HSV, as some values might be trimmed
			var rgb = jsc.HSV_RGB(this.channels.h, this.channels.s, this.channels.v);
			this.channels.r = rgb[0];
			this.channels.g = rgb[1];
			this.channels.b = rgb[2];

			this.exposeColor(flags);
			return true;
		};


		// DEPRECATED. Use .fromHSVA() instead
		//
		this.fromHSV = function (h, s, v, flags) {
			console.warn('fromHSV() method is DEPRECATED. Using fromHSVA() instead.' + jsc.docsRef);
			return this.fromHSVA(h, s, v, null, flags);
		};


		// DEPRECATED. Use .fromRGBA() instead
		//
		this.fromRGB = function (r, g, b, flags) {
			console.warn('fromRGB() method is DEPRECATED. Using fromRGBA() instead.' + jsc.docsRef);
			return this.fromRGBA(r, g, b, null, flags);
		};


		this.fromString = function (str, flags) {
			if (!this.required && str.trim() === '') {
				// setting empty string to an optional color input
				this.setPreviewElementBg(null);
				this.setValueElementValue('');
				return true;
			}

			var color = jsc.parseColorString(str);
			if (!color) {
				return false; // could not parse
			}
			if (this.format.toLowerCase() === 'any') {
				this._setFormat(color.format); // adapt format
				if (!jsc.isAlphaFormat(this.getFormat())) {
					color.rgba[3] = 1.0; // when switching to a format that doesn't support alpha, set full opacity
				}
			}
			this.fromRGBA(
				color.rgba[0],
				color.rgba[1],
				color.rgba[2],
				color.rgba[3],
				flags
			);
			return true;
		};


		this.randomize = function (minV, maxV, minS, maxS, minH, maxH, minA, maxA) {
			if (minV === undefined) { minV = 0; }
			if (maxV === undefined) { maxV = 100; }
			if (minS === undefined) { minS = 0; }
			if (maxS === undefined) { maxS = 100; }
			if (minH === undefined) { minH = 0; }
			if (maxH === undefined) { maxH = 359; }
			if (minA === undefined) { minA = 1; }
			if (maxA === undefined) { maxA = 1; }

			this.fromHSVA(
				minH + Math.floor(Math.random() * (maxH - minH + 1)),
				minS + Math.floor(Math.random() * (maxS - minS + 1)),
				minV + Math.floor(Math.random() * (maxV - minV + 1)),
				((100 * minA) + Math.floor(Math.random() * (100 * (maxA - minA) + 1))) / 100
			);
		};


		this.toString = function (format) {
			if (format === undefined) {
				format = this.getFormat(); // format not specified -> use the current format
			}
			switch (format.toLowerCase()) {
				case 'hex': return this.toHEXString(); break;
				case 'hexa': return this.toHEXAString(); break;
				case 'rgb': return this.toRGBString(); break;
				case 'rgba': return this.toRGBAString(); break;
			}
			return false;
		};


		this.toHEXString = function () {
			return jsc.hexColor(
				this.channels.r,
				this.channels.g,
				this.channels.b
			);
		};


		this.toHEXAString = function () {
			return jsc.hexaColor(
				this.channels.r,
				this.channels.g,
				this.channels.b,
				this.channels.a
			);
		};


		this.toRGBString = function () {
			return jsc.rgbColor(
				this.channels.r,
				this.channels.g,
				this.channels.b
			);
		};


		this.toRGBAString = function () {
			return jsc.rgbaColor(
				this.channels.r,
				this.channels.g,
				this.channels.b,
				this.channels.a
			);
		};


		this.toGrayscale = function () {
			return (
				0.213 * this.channels.r +
				0.715 * this.channels.g +
				0.072 * this.channels.b
			);
		};


		this.toCanvas = function () {
			return jsc.genColorPreviewCanvas(this.toRGBAString()).canvas;
		};


		this.toDataURL = function () {
			return this.toCanvas().toDataURL();
		};


		this.toBackground = function () {
			return jsc.pub.background(this.toRGBAString());
		};


		this.isLight = function () {
			return this.toGrayscale() > 255 / 2;
		};


		this.hide = function () {
			if (isPickerOwner()) {
				detachPicker();
			}
		};


		this.show = function () {
			drawPicker();
		};


		this.redraw = function () {
			if (isPickerOwner()) {
				drawPicker();
			}
		};


		this.getFormat = function () {
			return this._currentFormat;
		};


		this._setFormat = function (format) {
			this._currentFormat = format.toLowerCase();
		};


		this.hasAlphaChannel = function () {
			if (this.alphaChannel === 'auto') {
				return (
					this.format.toLowerCase() === 'any' || // format can change on the fly (e.g. from hex to rgba), so let's consider the alpha channel enabled
					jsc.isAlphaFormat(this.getFormat()) || // the current format supports alpha channel
					this.alpha !== undefined || // initial alpha value is set, so we're working with alpha channel
					this.alphaElement !== undefined // the alpha value is redirected, so we're working with alpha channel
				);
			}

			return this.alphaChannel; // the alpha channel is explicitly set
		};


		this.processValueInput = function (str) {
			if (!this.fromString(str)) {
				// could not parse the color value - let's just expose the current color
				this.exposeColor();
			}
		};


		this.processAlphaInput = function (str) {
			if (!this.fromHSVA(null, null, null, parseFloat(str))) {
				// could not parse the alpha value - let's just expose the current color
				this.exposeColor();
			}
		};


		this.exposeColor = function (flags) {
			var colorStr = this.toString();
			var fmt = this.getFormat();

			// reflect current color in data- attribute
			jsc.setDataAttr(this.targetElement, 'current-color', colorStr);

			if (!(flags & jsc.flags.leaveValue) && this.valueElement) {
				if (fmt === 'hex' || fmt === 'hexa') {
					if (!this.uppercase) { colorStr = colorStr.toLowerCase(); }
					if (!this.hash) { colorStr = colorStr.replace(/^#/, ''); }
				}
				this.setValueElementValue(colorStr);
			}

			if (!(flags & jsc.flags.leaveAlpha) && this.alphaElement) {
				var alphaVal = Math.round(this.channels.a * 100) / 100;
				this.setAlphaElementValue(alphaVal);
			}

			if (!(flags & jsc.flags.leavePreview) && this.previewElement) {
				var previewPos = null; // 'left' | 'right' (null -> fill the entire element)

				if (
					jsc.isTextInput(this.previewElement) || // text input
					(jsc.isButton(this.previewElement) && !jsc.isButtonEmpty(this.previewElement)) // button with text
				) {
					previewPos = this.previewPosition;
				}

				this.setPreviewElementBg(this.toRGBAString());
			}

			if (isPickerOwner()) {
				redrawPad();
				redrawSld();
				redrawASld();
			}
		};


		this.setPreviewElementBg = function (color) {
			if (!this.previewElement) {
				return;
			}

			var position = null; // color preview position:  null | 'left' | 'right'
			var width = null; // color preview width:  px | null = fill the entire element
			if (
				jsc.isTextInput(this.previewElement) || // text input
				(jsc.isButton(this.previewElement) && !jsc.isButtonEmpty(this.previewElement)) // button with text
			) {
				position = this.previewPosition;
				width = this.previewSize;
			}

			var backgrounds = [];

			if (!color) {
				// there is no color preview to display -> let's remove any previous background image
				backgrounds.push({
					image: 'none',
					position: 'left top',
					size: 'auto',
					repeat: 'no-repeat',
					origin: 'padding-box',
				});
			} else {
				// CSS gradient for background color preview
				backgrounds.push({
					image: jsc.genColorPreviewGradient(
						color,
						position,
						width ? width - jsc.pub.previewSeparator.length : null
					),
					position: 'left top',
					size: 'auto',
					repeat: position ? 'repeat-y' : 'repeat',
					origin: 'padding-box',
				});

				// data URL of generated PNG image with a gray transparency chessboard
				var preview = jsc.genColorPreviewCanvas(
					'rgba(0,0,0,0)',
					position ? {'left':'right', 'right':'left'}[position] : null,
					width,
					true
				);
				backgrounds.push({
					image: 'url(\'' + preview.canvas.toDataURL() + '\')',
					position: (position || 'left') + ' top',
					size: preview.width + 'px ' + preview.height + 'px',
					repeat: position ? 'repeat-y' : 'repeat',
					origin: 'padding-box',
				});
			}

			var bg = {
				image: [],
				position: [],
				size: [],
				repeat: [],
				origin: [],
			};
			for (var i = 0; i < backgrounds.length; i += 1) {
				bg.image.push(backgrounds[i].image);
				bg.position.push(backgrounds[i].position);
				bg.size.push(backgrounds[i].size);
				bg.repeat.push(backgrounds[i].repeat);
				bg.origin.push(backgrounds[i].origin);
			}

			// set previewElement's background-images
			var sty = {
				'background-image': bg.image.join(', '),
				'background-position': bg.position.join(', '),
				'background-size': bg.size.join(', '),
				'background-repeat': bg.repeat.join(', '),
				'background-origin': bg.origin.join(', '),
			};
			jsc.setStyle(this.previewElement, sty, this.forceStyle);


			// set/restore previewElement's padding
			var padding = {
				left: null,
				right: null,
			};
			if (position) {
				padding[position] = (this.previewSize + this.previewPadding) + 'px';
			}

			var sty = {
				'padding-left': padding.left,
				'padding-right': padding.right,
			};
			jsc.setStyle(this.previewElement, sty, this.forceStyle, true);
		};


		this.setValueElementValue = function (str) {
			if (this.valueElement) {
				if (jsc.nodeName(this.valueElement) === 'input') {
					this.valueElement.value = str;
				} else {
					this.valueElement.innerHTML = str;
				}
			}
		};


		this.setAlphaElementValue = function (str) {
			if (this.alphaElement) {
				if (jsc.nodeName(this.alphaElement) === 'input') {
					this.alphaElement.value = str;
				} else {
					this.alphaElement.innerHTML = str;
				}
			}
		};


		this._processParentElementsInDOM = function () {
			if (this._parentElementsProcessed) { return; }
			this._parentElementsProcessed = true;

			var elm = this.targetElement;
			do {
				// If the target element or one of its parent nodes has fixed position,
				// then use fixed positioning instead
				var compStyle = jsc.getCompStyle(elm);
				if (compStyle.position && compStyle.position.toLowerCase() === 'fixed') {
					this.fixed = true;
				}

				if (elm !== this.targetElement) {
					// Ensure to attach onParentScroll only once to each parent element
					// (multiple targetElements can share the same parent nodes)
					//
					// Note: It's not just offsetParents that can be scrollable,
					// that's why we loop through all parent nodes
					if (!jsc.getData(elm, 'hasScrollListener')) {
						elm.addEventListener('scroll', jsc.onParentScroll, false);
						jsc.setData(elm, 'hasScrollListener', true);
					}
				}
			} while ((elm = elm.parentNode) && jsc.nodeName(elm) !== 'body');
		};


		this.tryHide = function () {
			if (this.hideOnLeave) {
				this.hide();
			}
		};


		this.set__palette = function (val) {
			this.palette = val;
			this._palette = jsc.parsePaletteValue(val);
			this._paletteHasTransparency = jsc.containsTranparentColor(this._palette);
		};


		function setOption (option, value) {
			if (typeof option !== 'string') {
				throw new Error('Invalid value for option name: ' + option);
			}

			// enum option
			if (jsc.enumOpts.hasOwnProperty(option)) {
				if (typeof value === 'string') { // enum string values are case insensitive
					value = value.toLowerCase();
				}
				if (jsc.enumOpts[option].indexOf(value) === -1) {
					throw new Error('Option \'' + option + '\' has invalid value: ' + value);
				}
			}

			// deprecated option
			if (jsc.deprecatedOpts.hasOwnProperty(option)) {
				var oldOpt = option;
				var newOpt = jsc.deprecatedOpts[option];
				if (newOpt) {
					// if we have a new name for this option, let's log a warning and use the new name
					console.warn('Option \'%s\' is DEPRECATED, using \'%s\' instead.' + jsc.docsRef, oldOpt, newOpt);
					option = newOpt;
				} else {
					// new name not available for the option
					throw new Error('Option \'' + option + '\' is DEPRECATED');
				}
			}

			var setter = 'set__' + option;

			if (typeof THIS[setter] === 'function') { // a setter exists for this option
				THIS[setter](value);
				return true;

			} else if (option in THIS) { // option exists as a property
				THIS[option] = value;
				return true;
			}

			throw new Error('Unrecognized configuration option: ' + option);
		}


		function getOption (option) {
			if (typeof option !== 'string') {
				throw new Error('Invalid value for option name: ' + option);
			}

			// deprecated option
			if (jsc.deprecatedOpts.hasOwnProperty(option)) {
				var oldOpt = option;
				var newOpt = jsc.deprecatedOpts[option];
				if (newOpt) {
					// if we have a new name for this option, let's log a warning and use the new name
					console.warn('Option \'%s\' is DEPRECATED, using \'%s\' instead.' + jsc.docsRef, oldOpt, newOpt);
					option = newOpt;
				} else {
					// new name not available for the option
					throw new Error('Option \'' + option + '\' is DEPRECATED');
				}
			}

			var getter = 'get__' + option;

			if (typeof THIS[getter] === 'function') { // a getter exists for this option
				return THIS[getter](value);

			} else if (option in THIS) { // option exists as a property
				return THIS[option];
			}

			throw new Error('Unrecognized configuration option: ' + option);
		}


		function detachPicker () {
			jsc.removeClass(THIS.targetElement, jsc.pub.activeClassName);
			jsc.picker.wrap.parentNode.removeChild(jsc.picker.wrap);
			delete jsc.picker.owner;
		}


		function drawPicker () {

			// At this point, when drawing the picker, we know what the parent elements are
			// and we can do all related DOM operations, such as registering events on them
			// or checking their positioning
			THIS._processParentElementsInDOM();

			if (!jsc.picker) {
				jsc.picker = {
					owner: null, // owner picker instance
					wrap : jsc.createEl('div'),
					box : jsc.createEl('div'),
					boxS : jsc.createEl('div'), // shadow area
					boxB : jsc.createEl('div'), // border
					pad : jsc.createEl('div'),
					padB : jsc.createEl('div'), // border
					padM : jsc.createEl('div'), // mouse/touch area
					padCanvas : jsc.createPadCanvas(),
					cross : jsc.createEl('div'),
					crossBY : jsc.createEl('div'), // border Y
					crossBX : jsc.createEl('div'), // border X
					crossLY : jsc.createEl('div'), // line Y
					crossLX : jsc.createEl('div'), // line X
					sld : jsc.createEl('div'), // slider
					sldB : jsc.createEl('div'), // border
					sldM : jsc.createEl('div'), // mouse/touch area
					sldGrad : jsc.createSliderGradient(),
					sldPtrS : jsc.createEl('div'), // slider pointer spacer
					sldPtrIB : jsc.createEl('div'), // slider pointer inner border
					sldPtrMB : jsc.createEl('div'), // slider pointer middle border
					sldPtrOB : jsc.createEl('div'), // slider pointer outer border
					asld : jsc.createEl('div'), // alpha slider
					asldB : jsc.createEl('div'), // border
					asldM : jsc.createEl('div'), // mouse/touch area
					asldGrad : jsc.createASliderGradient(),
					asldPtrS : jsc.createEl('div'), // slider pointer spacer
					asldPtrIB : jsc.createEl('div'), // slider pointer inner border
					asldPtrMB : jsc.createEl('div'), // slider pointer middle border
					asldPtrOB : jsc.createEl('div'), // slider pointer outer border
					pal : jsc.createEl('div'), // palette
					btn : jsc.createEl('div'),
					btnT : jsc.createEl('div'), // text
				};

				jsc.picker.pad.appendChild(jsc.picker.padCanvas.elm);
				jsc.picker.padB.appendChild(jsc.picker.pad);
				jsc.picker.cross.appendChild(jsc.picker.crossBY);
				jsc.picker.cross.appendChild(jsc.picker.crossBX);
				jsc.picker.cross.appendChild(jsc.picker.crossLY);
				jsc.picker.cross.appendChild(jsc.picker.crossLX);
				jsc.picker.padB.appendChild(jsc.picker.cross);
				jsc.picker.box.appendChild(jsc.picker.padB);
				jsc.picker.box.appendChild(jsc.picker.padM);

				jsc.picker.sld.appendChild(jsc.picker.sldGrad.elm);
				jsc.picker.sldB.appendChild(jsc.picker.sld);
				jsc.picker.sldB.appendChild(jsc.picker.sldPtrOB);
				jsc.picker.sldPtrOB.appendChild(jsc.picker.sldPtrMB);
				jsc.picker.sldPtrMB.appendChild(jsc.picker.sldPtrIB);
				jsc.picker.sldPtrIB.appendChild(jsc.picker.sldPtrS);
				jsc.picker.box.appendChild(jsc.picker.sldB);
				jsc.picker.box.appendChild(jsc.picker.sldM);

				jsc.picker.asld.appendChild(jsc.picker.asldGrad.elm);
				jsc.picker.asldB.appendChild(jsc.picker.asld);
				jsc.picker.asldB.appendChild(jsc.picker.asldPtrOB);
				jsc.picker.asldPtrOB.appendChild(jsc.picker.asldPtrMB);
				jsc.picker.asldPtrMB.appendChild(jsc.picker.asldPtrIB);
				jsc.picker.asldPtrIB.appendChild(jsc.picker.asldPtrS);
				jsc.picker.box.appendChild(jsc.picker.asldB);
				jsc.picker.box.appendChild(jsc.picker.asldM);

				jsc.picker.box.appendChild(jsc.picker.pal);

				jsc.picker.btn.appendChild(jsc.picker.btnT);
				jsc.picker.box.appendChild(jsc.picker.btn);

				jsc.picker.boxB.appendChild(jsc.picker.box);
				jsc.picker.wrap.appendChild(jsc.picker.boxS);
				jsc.picker.wrap.appendChild(jsc.picker.boxB);

				jsc.picker.wrap.addEventListener('touchstart', jsc.onPickerTouchStart,
					jsc.isPassiveEventSupported ? {passive: false} : false);
			}

			var p = jsc.picker;

			var displaySlider = !!jsc.getSliderChannel(THIS);
			var displayAlphaSlider = THIS.hasAlphaChannel();
			var pickerDims = jsc.getPickerDims(THIS);
			var crossOuterSize = (2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize);
			var controlPadding = jsc.getControlPadding(THIS);
			var borderRadius = Math.min(
				THIS.borderRadius,
				Math.round(THIS.padding * Math.PI)); // px
			var padCursor = 'crosshair';

			// wrap
			p.wrap.className = 'jscolor-wrap';
			p.wrap.style.width = pickerDims.borderW + 'px';
			p.wrap.style.height = pickerDims.borderH + 'px';
			p.wrap.style.zIndex = THIS.zIndex;

			// picker
			p.box.className = 'jscolor-picker';
			p.box.style.width = pickerDims.paddedW + 'px';
			p.box.style.height = pickerDims.paddedH + 'px';

			// picker shadow
			p.boxS.className = 'jscolor-shadow';
			jsc.setBorderRadius(p.boxS, borderRadius + 'px');

			// picker border
			p.boxB.className = 'jscolor-border';
			p.boxB.style.border = THIS.borderWidth + 'px solid';
			p.boxB.style.borderColor = THIS.borderColor;
			p.boxB.style.background = THIS.backgroundColor;
			jsc.setBorderRadius(p.boxB, borderRadius + 'px');

			// IE hack:
			// If the element is transparent, IE will trigger the event on the elements under it,
			// e.g. on Canvas or on elements with border
			p.padM.style.background = 'rgba(255,0,0,.2)';
			p.sldM.style.background = 'rgba(0,255,0,.2)';
			p.asldM.style.background = 'rgba(0,0,255,.2)';

			p.padM.style.opacity =
			p.sldM.style.opacity =
			p.asldM.style.opacity =
				'0';

			// pad
			p.pad.style.position = 'relative';
			p.pad.style.width = THIS.width + 'px';
			p.pad.style.height = THIS.height + 'px';

			// pad - color spectrum (HSV and HVS)
			p.padCanvas.draw(THIS.width, THIS.height, jsc.getPadYChannel(THIS));

			// pad border
			p.padB.style.position = 'absolute';
			p.padB.style.left = THIS.padding + 'px';
			p.padB.style.top = THIS.padding + 'px';
			p.padB.style.border = THIS.controlBorderWidth + 'px solid';
			p.padB.style.borderColor = THIS.controlBorderColor;

			// pad mouse area
			p.padM.style.position = 'absolute';
			p.padM.style.left = 0 + 'px';
			p.padM.style.top = 0 + 'px';
			p.padM.style.width = (THIS.padding + 2 * THIS.controlBorderWidth + THIS.width + controlPadding) + 'px';
			p.padM.style.height = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';
			p.padM.style.cursor = padCursor;
			jsc.setData(p.padM, {
				instance: THIS,
				control: 'pad',
			})

			// pad cross
			p.cross.style.position = 'absolute';
			p.cross.style.left =
			p.cross.style.top =
				'0';
			p.cross.style.width =
			p.cross.style.height =
				crossOuterSize + 'px';

			// pad cross border Y and X
			p.crossBY.style.position =
			p.crossBX.style.position =
				'absolute';
			p.crossBY.style.background =
			p.crossBX.style.background =
				THIS.pointerBorderColor;
			p.crossBY.style.width =
			p.crossBX.style.height =
				(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
			p.crossBY.style.height =
			p.crossBX.style.width =
				crossOuterSize + 'px';
			p.crossBY.style.left =
			p.crossBX.style.top =
				(Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2) - THIS.pointerBorderWidth) + 'px';
			p.crossBY.style.top =
			p.crossBX.style.left =
				'0';

			// pad cross line Y and X
			p.crossLY.style.position =
			p.crossLX.style.position =
				'absolute';
			p.crossLY.style.background =
			p.crossLX.style.background =
				THIS.pointerColor;
			p.crossLY.style.height =
			p.crossLX.style.width =
				(crossOuterSize - 2 * THIS.pointerBorderWidth) + 'px';
			p.crossLY.style.width =
			p.crossLX.style.height =
				THIS.pointerThickness + 'px';
			p.crossLY.style.left =
			p.crossLX.style.top =
				(Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2)) + 'px';
			p.crossLY.style.top =
			p.crossLX.style.left =
				THIS.pointerBorderWidth + 'px';


			// slider
			p.sld.style.overflow = 'hidden';
			p.sld.style.width = THIS.sliderSize + 'px';
			p.sld.style.height = THIS.height + 'px';

			// slider gradient
			p.sldGrad.draw(THIS.sliderSize, THIS.height, '#000', '#000');

			// slider border
			p.sldB.style.display = displaySlider ? 'block' : 'none';
			p.sldB.style.position = 'absolute';
			p.sldB.style.left = (THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + 2 * controlPadding) + 'px';
			p.sldB.style.top = THIS.padding + 'px';
			p.sldB.style.border = THIS.controlBorderWidth + 'px solid';
			p.sldB.style.borderColor = THIS.controlBorderColor;

			// slider mouse area
			p.sldM.style.display = displaySlider ? 'block' : 'none';
			p.sldM.style.position = 'absolute';
			p.sldM.style.left = (THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadding) + 'px';
			p.sldM.style.top = 0 + 'px';
			p.sldM.style.width = (
					(THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) +
					(displayAlphaSlider ? 0 : Math.max(0, THIS.padding - controlPadding)) // remaining padding to the right edge
				) + 'px';
			p.sldM.style.height = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';
			p.sldM.style.cursor = 'default';
			jsc.setData(p.sldM, {
				instance: THIS,
				control: 'sld',
			});

			// slider pointer inner and outer border
			p.sldPtrIB.style.border =
			p.sldPtrOB.style.border =
				THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

			// slider pointer outer border
			p.sldPtrOB.style.position = 'absolute';
			p.sldPtrOB.style.left = -(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
			p.sldPtrOB.style.top = '0';

			// slider pointer middle border
			p.sldPtrMB.style.border = THIS.pointerThickness + 'px solid ' + THIS.pointerColor;

			// slider pointer spacer
			p.sldPtrS.style.width = THIS.sliderSize + 'px';
			p.sldPtrS.style.height = jsc.pub.sliderInnerSpace + 'px';


			// alpha slider
			p.asld.style.overflow = 'hidden';
			p.asld.style.width = THIS.sliderSize + 'px';
			p.asld.style.height = THIS.height + 'px';

			// alpha slider gradient
			p.asldGrad.draw(THIS.sliderSize, THIS.height, '#000');

			// alpha slider border
			p.asldB.style.display = displayAlphaSlider ? 'block' : 'none';
			p.asldB.style.position = 'absolute';
			p.asldB.style.left = (
					(THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadding) +
					(displaySlider ? (THIS.sliderSize + 3 * controlPadding + 2 * THIS.controlBorderWidth) : 0)
				) + 'px';
			p.asldB.style.top = THIS.padding + 'px';
			p.asldB.style.border = THIS.controlBorderWidth + 'px solid';
			p.asldB.style.borderColor = THIS.controlBorderColor;

			// alpha slider mouse area
			p.asldM.style.display = displayAlphaSlider ? 'block' : 'none';
			p.asldM.style.position = 'absolute';
			p.asldM.style.left = (
					(THIS.padding + THIS.width + 2 * THIS.controlBorderWidth + controlPadding) +
					(displaySlider ? (THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) : 0)
				) + 'px';
			p.asldM.style.top = 0 + 'px';
			p.asldM.style.width = (
					(THIS.sliderSize + 2 * controlPadding + 2 * THIS.controlBorderWidth) +
					Math.max(0, THIS.padding - controlPadding) // remaining padding to the right edge
				) + 'px';
			p.asldM.style.height = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';
			p.asldM.style.cursor = 'default';
			jsc.setData(p.asldM, {
				instance: THIS,
				control: 'asld',
			})

			// alpha slider pointer inner and outer border
			p.asldPtrIB.style.border =
			p.asldPtrOB.style.border =
				THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

			// alpha slider pointer outer border
			p.asldPtrOB.style.position = 'absolute';
			p.asldPtrOB.style.left = -(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
			p.asldPtrOB.style.top = '0';

			// alpha slider pointer middle border
			p.asldPtrMB.style.border = THIS.pointerThickness + 'px solid ' + THIS.pointerColor;

			// alpha slider pointer spacer
			p.asldPtrS.style.width = THIS.sliderSize + 'px';
			p.asldPtrS.style.height = jsc.pub.sliderInnerSpace + 'px';


			// palette
			p.pal.className = 'jscolor-palette';
			p.pal.style.display = pickerDims.palette.rows ? 'block' : 'none';
			p.pal.style.left = THIS.padding + 'px';
			p.pal.style.top = (2 * THIS.controlBorderWidth + 2 * THIS.padding + THIS.height) + 'px';

			// palette's color samples

			p.pal.innerHTML = '';

			var chessboard = jsc.genColorPreviewCanvas('rgba(0,0,0,0)');

			var si = 0; // color sample's index
			for (var r = 0; r < pickerDims.palette.rows; r++) {
				for (var c = 0; c < pickerDims.palette.cols && si < THIS._palette.length; c++, si++) {
					var sampleColor = THIS._palette[si];
					var sampleCssColor = jsc.rgbaColor.apply(null, sampleColor.rgba);

					var sc = jsc.createEl('div'); // color sample's color
					sc.style.width = (pickerDims.palette.cellW - 2 * THIS.controlBorderWidth) + 'px';
					sc.style.height = (pickerDims.palette.cellH - 2 * THIS.controlBorderWidth) + 'px';
					sc.style.backgroundColor = sampleCssColor;

					var sw = jsc.createEl('div'); // color sample's wrap
					sw.className = 'jscolor-palette-sw';
					sw.style.left =
						(
							pickerDims.palette.cols <= 1 ? 0 :
							Math.round(10 * (c * ((pickerDims.contentW - pickerDims.palette.cellW) / (pickerDims.palette.cols - 1)))) / 10
						) + 'px';
					sw.style.top = (r * (pickerDims.palette.cellH + THIS.paletteSpacing)) + 'px';
					sw.style.border = THIS.controlBorderWidth + 'px solid';
					sw.style.borderColor = THIS.controlBorderColor;
					if (sampleColor.rgba[3] !== null && sampleColor.rgba[3] < 1.0) { // only create chessboard background if the sample has transparency
						sw.style.backgroundImage = 'url(\'' + chessboard.canvas.toDataURL() + '\')';
						sw.style.backgroundRepeat = 'repeat';
						sw.style.backgroundPosition = 'center center';
					}
					jsc.setData(sw, {
						instance: THIS,
						control: 'palette-sw',
						color: sampleColor,
					});
					sw.addEventListener('click', jsc.onPaletteSampleClick, false);
					sw.appendChild(sc);
					p.pal.appendChild(sw);
				}
			}


			// the Close button
			function setBtnBorder () {
				var insetColors = THIS.controlBorderColor.split(/\s+/);
				var outsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
				p.btn.style.borderColor = outsetColor;
			}
			var btnPadding = 15; // px
			p.btn.className = 'jscolor-btn jscolor-btn-close';
			p.btn.style.display = THIS.closeButton ? 'block' : 'none';
			p.btn.style.left = THIS.padding + 'px';
			p.btn.style.bottom = THIS.padding + 'px';
			p.btn.style.padding = '0 ' + btnPadding + 'px';
			p.btn.style.maxWidth = (pickerDims.contentW - 2 * THIS.controlBorderWidth - 2 * btnPadding) + 'px';
			p.btn.style.height = THIS.buttonHeight + 'px';
			p.btn.style.border = THIS.controlBorderWidth + 'px solid';
			setBtnBorder();
			p.btn.style.color = THIS.buttonColor;
			p.btn.onmousedown = function () {
				THIS.hide();
			};
			p.btnT.style.display = 'inline';
			p.btnT.style.lineHeight = THIS.buttonHeight + 'px';
			p.btnT.innerText = THIS.closeText;

			// reposition the pointers
			redrawPad();
			redrawSld();
			redrawASld();

			// If we are changing the owner without first closing the picker,
			// make sure to first deal with the old owner
			if (jsc.picker.owner && jsc.picker.owner !== THIS) {
				jsc.removeClass(jsc.picker.owner.targetElement, jsc.pub.activeClassName);
			}

			// Set a new picker owner
			jsc.picker.owner = THIS;

			// The redrawPosition() method needs picker.owner to be set, that's why we call it here,
			// after setting the owner
			jsc.redrawPosition();

			if (p.wrap.parentNode !== THIS.container) {
				THIS.container.appendChild(p.wrap);
			}

			jsc.addClass(THIS.targetElement, jsc.pub.activeClassName);
		}


		function redrawPad () {
			// redraw the pad pointer
			var yChannel = jsc.getPadYChannel(THIS);
			var x = Math.round((THIS.channels.h / 360) * (THIS.width - 1));
			var y = Math.round((1 - THIS.channels[yChannel] / 100) * (THIS.height - 1));
			var crossOuterSize = (2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize);
			var ofs = -Math.floor(crossOuterSize / 2);
			jsc.picker.cross.style.left = (x + ofs) + 'px';
			jsc.picker.cross.style.top = (y + ofs) + 'px';

			// redraw the slider
			switch (jsc.getSliderChannel(THIS)) {
			case 's':
				var rgb1 = jsc.HSV_RGB(THIS.channels.h, 100, THIS.channels.v);
				var rgb2 = jsc.HSV_RGB(THIS.channels.h, 0, THIS.channels.v);
				var color1 = 'rgb(' +
					Math.round(rgb1[0]) + ',' +
					Math.round(rgb1[1]) + ',' +
					Math.round(rgb1[2]) + ')';
				var color2 = 'rgb(' +
					Math.round(rgb2[0]) + ',' +
					Math.round(rgb2[1]) + ',' +
					Math.round(rgb2[2]) + ')';
				jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
				break;
			case 'v':
				var rgb = jsc.HSV_RGB(THIS.channels.h, THIS.channels.s, 100);
				var color1 = 'rgb(' +
					Math.round(rgb[0]) + ',' +
					Math.round(rgb[1]) + ',' +
					Math.round(rgb[2]) + ')';
				var color2 = '#000';
				jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
				break;
			}

			// redraw the alpha slider
			jsc.picker.asldGrad.draw(THIS.sliderSize, THIS.height, THIS.toHEXString());
		}


		function redrawSld () {
			var sldChannel = jsc.getSliderChannel(THIS);
			if (sldChannel) {
				// redraw the slider pointer
				var y = Math.round((1 - THIS.channels[sldChannel] / 100) * (THIS.height - 1));
				jsc.picker.sldPtrOB.style.top = (y - (2 * THIS.pointerBorderWidth + THIS.pointerThickness) - Math.floor(jsc.pub.sliderInnerSpace / 2)) + 'px';
			}

			// redraw the alpha slider
			jsc.picker.asldGrad.draw(THIS.sliderSize, THIS.height, THIS.toHEXString());
		}


		function redrawASld () {
			var y = Math.round((1 - THIS.channels.a) * (THIS.height - 1));
			jsc.picker.asldPtrOB.style.top = (y - (2 * THIS.pointerBorderWidth + THIS.pointerThickness) - Math.floor(jsc.pub.sliderInnerSpace / 2)) + 'px';
		}


		function isPickerOwner () {
			return jsc.picker && jsc.picker.owner === THIS;
		}


		function onValueKeyDown (ev) {
			if (jsc.eventKey(ev) === 'Enter') {
				if (THIS.valueElement) {
					THIS.processValueInput(THIS.valueElement.value);
				}
				THIS.tryHide();
			}
		}


		function onAlphaKeyDown (ev) {
			if (jsc.eventKey(ev) === 'Enter') {
				if (THIS.alphaElement) {
					THIS.processAlphaInput(THIS.alphaElement.value);
				}
				THIS.tryHide();
			}
		}


		function onValueChange (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			var oldVal = THIS.valueElement.value;

			THIS.processValueInput(THIS.valueElement.value); // this might change the value

			jsc.triggerCallback(THIS, 'onChange');

			if (THIS.valueElement.value !== oldVal) {
				// value was additionally changed -> let's trigger the change event again, even though it was natively dispatched
				jsc.triggerInputEvent(THIS.valueElement, 'change', true, true);
			}
		}


		function onAlphaChange (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			var oldVal = THIS.alphaElement.value;

			THIS.processAlphaInput(THIS.alphaElement.value); // this might change the value

			jsc.triggerCallback(THIS, 'onChange');

			// triggering valueElement's onChange (because changing alpha changes the entire color, e.g. with rgba format)
			jsc.triggerInputEvent(THIS.valueElement, 'change', true, true);

			if (THIS.alphaElement.value !== oldVal) {
				// value was additionally changed -> let's trigger the change event again, even though it was natively dispatched
				jsc.triggerInputEvent(THIS.alphaElement, 'change', true, true);
			}
		}


		function onValueInput (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			if (THIS.valueElement) {
				THIS.fromString(THIS.valueElement.value, jsc.flags.leaveValue);
			}

			jsc.triggerCallback(THIS, 'onInput');

			// triggering valueElement's onInput
			// (not needed, it was dispatched normally by the browser)
		}


		function onAlphaInput (ev) {
			if (jsc.getData(ev, 'internal')) {
				return; // skip if the event was internally triggered by jscolor
			}

			if (THIS.alphaElement) {
				THIS.fromHSVA(null, null, null, parseFloat(THIS.alphaElement.value), jsc.flags.leaveAlpha);
			}

			jsc.triggerCallback(THIS, 'onInput');

			// triggering valueElement's onInput (because changing alpha changes the entire color, e.g. with rgba format)
			jsc.triggerInputEvent(THIS.valueElement, 'input', true, true);
		}


		// let's process the DEPRECATED 'options' property (this will be later removed)
		if (jsc.pub.options) {
			// let's set custom default options, if specified
			for (var opt in jsc.pub.options) {
				if (jsc.pub.options.hasOwnProperty(opt)) {
					try {
						setOption(opt, jsc.pub.options[opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		// let's apply configuration presets
		//
		var presetsArr = [];

		if (opts.preset) {
			if (typeof opts.preset === 'string') {
				presetsArr = opts.preset.split(/\s+/);
			} else if (Array.isArray(opts.preset)) {
				presetsArr = opts.preset.slice(); // slice() to clone
			} else {
				console.warn('Unrecognized preset value');
			}
		}

		// always use the 'default' preset. If it's not listed, append it to the end.
		if (presetsArr.indexOf('default') === -1) {
			presetsArr.push('default');
		}

		// let's apply the presets in reverse order, so that should there be any overlapping options,
		// the formerly listed preset will override the latter
		for (var i = presetsArr.length - 1; i >= 0; i -= 1) {
			var pres = presetsArr[i];
			if (!pres) {
				continue; // preset is empty string
			}
			if (!jsc.pub.presets.hasOwnProperty(pres)) {
				console.warn('Unknown preset: %s', pres);
				continue;
			}
			for (var opt in jsc.pub.presets[pres]) {
				if (jsc.pub.presets[pres].hasOwnProperty(opt)) {
					try {
						setOption(opt, jsc.pub.presets[pres][opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		// let's set specific options for this color picker
		var nonProperties = [
			// these options won't be set as instance properties
			'preset',
		];
		for (var opt in opts) {
			if (opts.hasOwnProperty(opt)) {
				if (nonProperties.indexOf(opt) === -1) {
					try {
						setOption(opt, opts[opt]);
					} catch (e) {
						console.warn(e);
					}
				}
			}
		}


		//
		// Install the color picker on chosen element(s)
		//


		// Determine picker's container element
		if (this.container === undefined) {
			this.container = window.document.body; // default container is BODY element

		} else { // explicitly set to custom element
			this.container = jsc.node(this.container);
		}

		if (!this.container) {
			throw new Error('Cannot instantiate color picker without a container element');
		}


		// Fetch the target element
		this.targetElement = jsc.node(targetElement);

		if (!this.targetElement) {
			// temporarily customized error message to help with migrating from versions prior to 2.2
			if (typeof targetElement === 'string' && /^[a-zA-Z][\w:.-]*$/.test(targetElement)) {
				// targetElement looks like valid ID
				var possiblyId = targetElement;
				throw new Error('If \'' + possiblyId + '\' is supposed to be an ID, please use \'#' + possiblyId + '\' or any valid CSS selector.');
			}

			throw new Error('Cannot instantiate color picker without a target element');
		}

		if (this.targetElement.jscolor && this.targetElement.jscolor instanceof jsc.pub) {
			throw new Error('Color picker already installed on this element');
		}


		// link this instance with the target element
		this.targetElement.jscolor = this;
		jsc.addClass(this.targetElement, jsc.pub.className);

		// register this instance
		jsc.instances.push(this);


		// if target is BUTTON
		if (jsc.isButton(this.targetElement)) {

			if (this.targetElement.type.toLowerCase() !== 'button') {
				// on buttons, always force type to be 'button', e.g. in situations the target <button> has no type
				// and thus defaults to 'submit' and would submit the form when clicked
				this.targetElement.type = 'button';
			}

			if (jsc.isButtonEmpty(this.targetElement)) { // empty button
				// it is important to clear element's contents first.
				// if we're re-instantiating color pickers on DOM that has been modified by changing page's innerHTML,
				// we would keep adding more non-breaking spaces to element's content (because element's contents survive
				// innerHTML changes, but picker instances don't)
				jsc.removeChildren(this.targetElement);

				// let's insert a non-breaking space
				this.targetElement.appendChild(window.document.createTextNode('\xa0'));

				// set min-width = previewSize, if not already greater
				var compStyle = jsc.getCompStyle(this.targetElement);
				var currMinWidth = parseFloat(compStyle['min-width']) || 0;
				if (currMinWidth < this.previewSize) {
					jsc.setStyle(this.targetElement, {
						'min-width': this.previewSize + 'px',
					}, this.forceStyle);
				}
			}
		}

		// Determine the value element
		if (this.valueElement === undefined) {
			if (jsc.isTextInput(this.targetElement)) {
				// for text inputs, default valueElement is targetElement
				this.valueElement = this.targetElement;
			} else {
				// leave it undefined
			}

		} else if (this.valueElement === null) { // explicitly set to null
			// leave it null

		} else { // explicitly set to custom element
			this.valueElement = jsc.node(this.valueElement);
		}

		// Determine the alpha element
		if (this.alphaElement) {
			this.alphaElement = jsc.node(this.alphaElement);
		}

		// Determine the preview element
		if (this.previewElement === undefined) {
			this.previewElement = this.targetElement; // default previewElement is targetElement

		} else if (this.previewElement === null) { // explicitly set to null
			// leave it null

		} else { // explicitly set to custom element
			this.previewElement = jsc.node(this.previewElement);
		}

		// valueElement
		if (this.valueElement && jsc.isTextInput(this.valueElement)) {

			// If the value element has onInput event already set, we need to detach it and attach AFTER our listener.
			// otherwise the picker instance would still contain the old color when accessed from the onInput handler.
			var valueElementOrigEvents = {
				onInput: this.valueElement.oninput
			};
			this.valueElement.oninput = null;

			this.valueElement.addEventListener('keydown', onValueKeyDown, false);
			this.valueElement.addEventListener('change', onValueChange, false);
			this.valueElement.addEventListener('input', onValueInput, false);
			// the original event listener must be attached AFTER our handler (to let it first set picker's color)
			if (valueElementOrigEvents.onInput) {
				this.valueElement.addEventListener('input', valueElementOrigEvents.onInput, false);
			}

			this.valueElement.setAttribute('autocomplete', 'off');
			this.valueElement.setAttribute('autocorrect', 'off');
			this.valueElement.setAttribute('autocapitalize', 'off');
			this.valueElement.setAttribute('spellcheck', false);
		}

		// alphaElement
		if (this.alphaElement && jsc.isTextInput(this.alphaElement)) {
			this.alphaElement.addEventListener('keydown', onAlphaKeyDown, false);
			this.alphaElement.addEventListener('change', onAlphaChange, false);
			this.alphaElement.addEventListener('input', onAlphaInput, false);

			this.alphaElement.setAttribute('autocomplete', 'off');
			this.alphaElement.setAttribute('autocorrect', 'off');
			this.alphaElement.setAttribute('autocapitalize', 'off');
			this.alphaElement.setAttribute('spellcheck', false);
		}

		// determine initial color value
		//
		var initValue = 'FFFFFF';

		if (this.value !== undefined) {
			initValue = this.value; // get initial color from the 'value' property
		} else if (this.valueElement && this.valueElement.value !== undefined) {
			initValue = this.valueElement.value; // get initial color from valueElement's value
		}

		// determine initial alpha value
		//
		var initAlpha = undefined;

		if (this.alpha !== undefined) {
			initAlpha = (''+this.alpha); // get initial alpha value from the 'alpha' property
		} else if (this.alphaElement && this.alphaElement.value !== undefined) {
			initAlpha = this.alphaElement.value; // get initial color from alphaElement's value
		}

		// determine current format based on the initial color value
		//
		this._currentFormat = null;

		if (['auto', 'any'].indexOf(this.format.toLowerCase()) > -1) {
			// format is 'auto' or 'any' -> let's auto-detect current format
			var color = jsc.parseColorString(initValue);
			this._currentFormat = color ? color.format : 'hex';
		} else {
			// format is specified
			this._currentFormat = this.format.toLowerCase();
		}


		// let's parse the initial color value and expose color's preview
		this.processValueInput(initValue);

		// let's also parse and expose the initial alpha value, if any
		//
		// Note: If the initial color value contains alpha value in it (e.g. in rgba format),
		// this will overwrite it. So we should only process alpha input if there was initial
		// alpha explicitly set, otherwise we could needlessly lose initial value's alpha
		if (initAlpha !== undefined) {
			this.processAlphaInput(initAlpha);
		}

		if (this.random) {
			// randomize the initial color value
			this.randomize.apply(this, Array.isArray(this.random) ? this.random : []);
		}

	}

};


//================================
// Public properties and methods
//================================

//
// These will be publicly available via jscolor.<name> and JSColor.<name>
//


// class that will be set to elements having jscolor installed on them
jsc.pub.className = 'jscolor';


// class that will be set to elements having jscolor active on them
jsc.pub.activeClassName = 'jscolor-active';


// whether to try to parse the options string by evaluating it using 'new Function()'
// in case it could not be parsed with JSON.parse()
jsc.pub.looseJSON = true;


// presets
jsc.pub.presets = {};

// built-in presets
jsc.pub.presets['default'] = {}; // baseline for customization

jsc.pub.presets['light'] = { // default color scheme
	backgroundColor: 'rgba(255,255,255,1)',
	controlBorderColor: 'rgba(187,187,187,1)',
	buttonColor: 'rgba(0,0,0,1)',
};
jsc.pub.presets['dark'] = {
	backgroundColor: 'rgba(51,51,51,1)',
	controlBorderColor: 'rgba(153,153,153,1)',
	buttonColor: 'rgba(240,240,240,1)',
};

jsc.pub.presets['small'] = { width:101, height:101, padding:10, sliderSize:14, paletteCols:8 };
jsc.pub.presets['medium'] = { width:181, height:101, padding:12, sliderSize:16, paletteCols:10 }; // default size
jsc.pub.presets['large'] = { width:271, height:151, padding:12, sliderSize:24, paletteCols:15 };

jsc.pub.presets['thin'] = { borderWidth:1, controlBorderWidth:1, pointerBorderWidth:1 }; // default thickness
jsc.pub.presets['thick'] = { borderWidth:2, controlBorderWidth:2, pointerBorderWidth:2 };


// size of space in the sliders
jsc.pub.sliderInnerSpace = 3; // px

// transparency chessboard
jsc.pub.chessboardSize = 8; // px
jsc.pub.chessboardColor1 = '#666666';
jsc.pub.chessboardColor2 = '#999999';

// preview separator
jsc.pub.previewSeparator = ['rgba(255,255,255,.65)', 'rgba(128,128,128,.65)'];


// Initializes jscolor
jsc.pub.init = function () {
	if (jsc.initialized) {
		return;
	}

	// attach some necessary handlers
	window.document.addEventListener('mousedown', jsc.onDocumentMouseDown, false);
	window.document.addEventListener('keyup', jsc.onDocumentKeyUp, false);
	window.addEventListener('resize', jsc.onWindowResize, false);
	window.addEventListener('scroll', jsc.onWindowScroll, false);

	// append default CSS to HEAD
	jsc.appendDefaultCss();

	// install jscolor on current DOM
	jsc.pub.install();

	jsc.initialized = true;

	// call functions waiting in the queue
	while (jsc.readyQueue.length) {
		var func = jsc.readyQueue.shift();
		func();
	}
};


// Installs jscolor on current DOM tree
jsc.pub.install = function (rootNode) {
	var success = true;

	try {
		jsc.installBySelector('[data-jscolor]', rootNode);
	} catch (e) {
		success = false;
		console.warn(e);
	}

	// for backward compatibility with DEPRECATED installation using class name
	if (jsc.pub.lookupClass) {
		try {
			jsc.installBySelector(
				(
					'input.' + jsc.pub.lookupClass + ', ' +
					'button.' + jsc.pub.lookupClass
				),
				rootNode
			);
		} catch (e) {}
	}

	return success;
};


// Registers function to be called as soon as jscolor is initialized (or immediately, if it already is).
//
jsc.pub.ready = function (func) {
	if (typeof func !== 'function') {
		console.warn('Passed value is not a function');
		return false;
	}

	if (jsc.initialized) {
		func();
	} else {
		jsc.readyQueue.push(func);
	}
	return true;
};


// Triggers given input event(s) (e.g. 'input' or 'change') on all color pickers.
//
// It is possible to specify multiple events separated with a space.
// If called before jscolor is initialized, then the events will be triggered after initialization.
//
jsc.pub.trigger = function (eventNames) {
	var triggerNow = function () {
		jsc.triggerGlobal(eventNames);
	};

	if (jsc.initialized) {
		triggerNow();
	} else {
		jsc.pub.ready(triggerNow);
	}
};


// Hides current color picker box
jsc.pub.hide = function () {
	if (jsc.picker && jsc.picker.owner) {
		jsc.picker.owner.hide();
	}
};


// Returns a data URL of a gray chessboard image that indicates transparency
jsc.pub.chessboard = function (color) {
	if (!color) {
		color = 'rgba(0,0,0,0)';
	}
	var preview = jsc.genColorPreviewCanvas(color);
	return preview.canvas.toDataURL();
};


// Returns a data URL of a gray chessboard image that indicates transparency
jsc.pub.background = function (color) {
	var backgrounds = [];

	// CSS gradient for background color preview
	backgrounds.push(jsc.genColorPreviewGradient(color));

	// data URL of generated PNG image with a gray transparency chessboard
	var preview = jsc.genColorPreviewCanvas();
	backgrounds.push([
		'url(\'' + preview.canvas.toDataURL() + '\')',
		'left top',
		'repeat',
	].join(' '));

	return backgrounds.join(', ');
};


//
// DEPRECATED properties and methods
//


// DEPRECATED. Use jscolor.presets.default instead.
//
// Custom default options for all color pickers, e.g. { hash: true, width: 300 }
jsc.pub.options = {};


// DEPRECATED. Use data-jscolor attribute instead, which installs jscolor on given element.
//
// By default, we'll search for all elements with class="jscolor" and install a color picker on them.
//
// You can change what class name will be looked for by setting the property jscolor.lookupClass
// anywhere in your HTML document. To completely disable the automatic lookup, set it to null.
//
jsc.pub.lookupClass = 'jscolor';


// DEPRECATED. Use data-jscolor attribute instead, which installs jscolor on given element.
//
// Install jscolor on all elements that have the specified class name
jsc.pub.installByClassName = function () {
	console.error('jscolor.installByClassName() is DEPRECATED. Use data-jscolor="" attribute instead of a class name.' + jsc.docsRef);
	return false;
};


jsc.register();


return jsc.pub;


})(); // END jscolor


if (typeof window.jscolor === 'undefined') {
	window.jscolor = window.JSColor = jscolor;
}


// END jscolor code

return jscolor;

}); // END factory


/***/ }),

/***/ "./node_modules/.pnpm/ajax-interceptor@1.0.1/node_modules/ajax-interceptor/index.js":
/***/ ((__unused_webpack_module, exports) => {

"use strict";


var COMPLETED_READY_STATE = 4;

var RealXHRSend = XMLHttpRequest.prototype.send;

var requestCallbacks = [];
var responseCallbacks = [];


var wired = false;


function arrayRemove(array,item) {
    var index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    } else {
        throw new Error("Could not remove " + item + " from array");
    }
}


function fireCallbacks(callbacks,xhr) {
    for( var i = 0; i < callbacks.length; i++ ) {
        callbacks[i](xhr);
    }
}


exports.addRequestCallback = function(callback) {
    requestCallbacks.push(callback);
};
exports.removeRequestCallback = function(callback) {
    arrayRemove(requestCallbacks,callback);
};


exports.addResponseCallback = function(callback) {
    responseCallbacks.push(callback);
};
exports.removeResponseCallback = function(callback) {
    arrayRemove(responseCallbacks,callback);
};



function fireResponseCallbacksIfCompleted(xhr) {
    if( xhr.readyState === COMPLETED_READY_STATE ) {
        fireCallbacks(responseCallbacks,xhr);
    }
}

function proxifyOnReadyStateChange(xhr) {
    var realOnReadyStateChange = xhr.onreadystatechange;
    if ( realOnReadyStateChange ) {
        xhr.onreadystatechange = function() {
            fireResponseCallbacksIfCompleted(xhr);
            realOnReadyStateChange();
        };
    }
}


exports.isWired = function() {
    return wired;
}

exports.wire = function() {
    if ( wired ) throw new Error("Ajax interceptor already wired");

    // Override send method of all XHR requests
    XMLHttpRequest.prototype.send = function() {

        // Fire request callbacks before sending the request
        fireCallbacks(requestCallbacks,this);

        // Wire response callbacks
        if( this.addEventListener ) {
            var self = this;
            this.addEventListener("readystatechange", function() {
                fireResponseCallbacksIfCompleted(self);
            }, false);
        }
        else {
            proxifyOnReadyStateChange(this);
        }

        RealXHRSend.apply(this, arguments);
    };
    wired = true;
};


exports.unwire = function() {
    if ( !wired ) throw new Error("Ajax interceptor not currently wired");
    XMLHttpRequest.prototype.send = RealXHRSend;
    wired = false;
};


/***/ }),

/***/ "./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/config.js":
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.config = {
    sort_key: false,
};


/***/ }),

/***/ "./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/core.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const debug_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/debug.js");
const encode_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/encode.js");
const memory_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/memory.js");
function compress(o) {
    const mem = memory_1.makeInMemoryMemory();
    const root = memory_1.addValue(mem, o, undefined);
    const values = memory_1.memToValues(mem);
    return [values, root];
}
exports.compress = compress;
function decodeObject(values, s) {
    if (s === 'o|') {
        return {};
    }
    const o = {};
    const vs = s.split('|');
    const key_id = vs[1];
    let keys = decode(values, key_id);
    const n = vs.length;
    if (n - 2 === 1 && !Array.isArray(keys)) {
        // single-key object using existing value as key
        keys = [keys];
    }
    for (let i = 2; i < n; i++) {
        const k = keys[i - 2];
        let v = vs[i];
        v = decode(values, v);
        o[k] = v;
    }
    return o;
}
function decodeArray(values, s) {
    if (s === 'a|') {
        return [];
    }
    const vs = s.split('|');
    const n = vs.length - 1;
    const xs = new Array(n);
    for (let i = 0; i < n; i++) {
        let v = vs[i + 1];
        v = decode(values, v);
        xs[i] = v;
    }
    return xs;
}
function decode(values, key) {
    if (key === '' || key === '_') {
        return null;
    }
    const id = encode_1.decodeKey(key);
    const v = values[id];
    if (v === null) {
        return v;
    }
    switch (typeof v) {
        case 'undefined':
            return v;
        case 'number':
            return v;
        case 'string':
            const prefix = v[0] + v[1];
            switch (prefix) {
                case 'b|':
                    return encode_1.decodeBool(v);
                case 'o|':
                    return decodeObject(values, v);
                case 'n|':
                    return encode_1.decodeNum(v);
                case 'a|':
                    return decodeArray(values, v);
                default:
                    return encode_1.decodeStr(v);
            }
    }
    return debug_1.throwUnknownDataType(v);
}
exports.decode = decode;
function decompress(c) {
    const [values, root] = c;
    return decode(values, root);
}
exports.decompress = decompress;


/***/ }),

/***/ "./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/debug.js":
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getType(o) {
    return Object.prototype.toString.call(o);
}
exports.getType = getType;
function throwUnknownDataType(o) {
    throw new TypeError('unsupported data type: ' + getType(o));
}
exports.throwUnknownDataType = throwUnknownDataType;


/***/ }),

/***/ "./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/encode.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const number_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/number.js");
function encodeNum(num) {
    const a = 'n|' + number_1.num_to_s(num);
    return a;
    // let b = num.toString()
    // return a.length < b.length ? a : num
}
exports.encodeNum = encodeNum;
function decodeNum(s) {
    s = s.replace('n|', '');
    return number_1.s_to_num(s);
}
exports.decodeNum = decodeNum;
function decodeKey(key) {
    return typeof key === 'number' ? key : number_1.s_to_int(key);
}
exports.decodeKey = decodeKey;
function encodeBool(b) {
    // return 'b|' + bool_to_s(b)
    return b ? 'b|T' : 'b|F';
}
exports.encodeBool = encodeBool;
function decodeBool(s) {
    switch (s) {
        case 'b|T':
            return true;
        case 'b|F':
            return false;
    }
    return !!s;
}
exports.decodeBool = decodeBool;
function encodeStr(str) {
    const prefix = str[0] + str[1];
    switch (prefix) {
        case 'b|':
        case 'o|':
        case 'n|':
        case 'a|':
        case 's|':
            str = 's|' + str;
    }
    return str;
}
exports.encodeStr = encodeStr;
function decodeStr(s) {
    const prefix = s[0] + s[1];
    return prefix === 's|' ? s.substr(2) : s;
}
exports.decodeStr = decodeStr;


/***/ }),

/***/ "./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/helpers.js":
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function trimUndefined(object) {
    for (const key in object) {
        if (object[key] === undefined) {
            delete object[key];
        }
    }
}
exports.trimUndefined = trimUndefined;
function trimUndefinedRecursively(object) {
    trimUndefinedRecursivelyLoop(object, new Set());
}
exports.trimUndefinedRecursively = trimUndefinedRecursively;
function trimUndefinedRecursivelyLoop(object, tracks) {
    tracks.add(object);
    for (const key in object) {
        if (object[key] === undefined) {
            delete object[key];
        }
        else {
            const value = object[key];
            if (value && typeof value === 'object' && !tracks.has(value)) {
                trimUndefinedRecursivelyLoop(value, tracks);
            }
        }
    }
}


/***/ }),

/***/ "./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/index.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
/* for direct usage */
var core_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/core.js");
__webpack_unused_export__ = core_1.compress;
exports.Lj = core_1.decompress;
/* for custom wrapper */
var core_2 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/core.js");
__webpack_unused_export__ = core_2.decode;
var memory_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/memory.js");
__webpack_unused_export__ = memory_1.addValue;
/* to remove undefined object fields */
var helpers_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/helpers.js");
__webpack_unused_export__ = helpers_1.trimUndefined;
__webpack_unused_export__ = helpers_1.trimUndefinedRecursively;


/***/ }),

/***/ "./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/memory.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const config_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/config.js");
const debug_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/debug.js");
const encode_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/encode.js");
const number_1 = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/number.js");
function memToValues(mem) {
    return mem.store.toArray();
}
exports.memToValues = memToValues;
function makeInMemoryStore() {
    const mem = [];
    return {
        forEach(cb) {
            for (let i = 0; i < mem.length; i++) {
                if (cb(mem[i]) === 'break') {
                    return;
                }
            }
        },
        add(value) {
            mem.push(value);
        },
        toArray() {
            return mem;
        },
    };
}
exports.makeInMemoryStore = makeInMemoryStore;
function makeInMemoryCache() {
    const valueMem = Object.create(null);
    const schemaMem = Object.create(null);
    return {
        getValue(key) {
            return valueMem[key];
        },
        getSchema(key) {
            return schemaMem[key];
        },
        forEachValue(cb) {
            for (const [key, value] of Object.entries(valueMem)) {
                if (cb(key, value) === 'break') {
                    return;
                }
            }
        },
        forEachSchema(cb) {
            for (const [key, value] of Object.entries(schemaMem)) {
                if (cb(key, value) === 'break') {
                    return;
                }
            }
        },
        setValue(key, value) {
            valueMem[key] = value;
        },
        setSchema(key, value) {
            schemaMem[key] = value;
        },
        hasValue(key) {
            return key in valueMem;
        },
        hasSchema(key) {
            return key in schemaMem;
        },
    };
}
exports.makeInMemoryCache = makeInMemoryCache;
function makeInMemoryMemory() {
    return {
        store: makeInMemoryStore(),
        cache: makeInMemoryCache(),
        keyCount: 0,
    };
}
exports.makeInMemoryMemory = makeInMemoryMemory;
function getValueKey(mem, value) {
    if (mem.cache.hasValue(value)) {
        return mem.cache.getValue(value);
    }
    const id = mem.keyCount++;
    const key = number_1.num_to_s(id);
    mem.store.add(value);
    mem.cache.setValue(value, key);
    return key;
}
/** @remark in-place sort the keys */
function getSchema(mem, keys) {
    if (config_1.config.sort_key) {
        keys.sort();
    }
    const schema = keys.join(',');
    if (mem.cache.hasSchema(schema)) {
        return mem.cache.getSchema(schema);
    }
    const key_id = addValue(mem, keys, undefined);
    mem.cache.setSchema(schema, key_id);
    return key_id;
}
function addValue(mem, o, parent) {
    if (o === null) {
        return '';
    }
    switch (typeof o) {
        case 'undefined':
            if (Array.isArray(parent)) {
                return addValue(mem, null, parent);
            }
            break;
        case 'object':
            if (o === null) {
                return getValueKey(mem, null);
            }
            if (Array.isArray(o)) {
                let acc = 'a';
                for (let i = 0; i < o.length; i++) {
                    const v = o[i];
                    const key = v === null ? '_' : addValue(mem, v, o);
                    acc += '|' + key;
                }
                if (acc === 'a') {
                    acc = 'a|';
                }
                return getValueKey(mem, acc);
            }
            else {
                const keys = Object.keys(o);
                if (keys.length === 0) {
                    return getValueKey(mem, 'o|');
                }
                let acc = 'o';
                const key_id = getSchema(mem, keys);
                acc += '|' + key_id;
                for (const key of keys) {
                    const value = o[key];
                    const v = addValue(mem, value, o);
                    acc += '|' + v;
                }
                return getValueKey(mem, acc);
            }
        case 'boolean':
            return getValueKey(mem, encode_1.encodeBool(o));
        case 'number':
            return getValueKey(mem, encode_1.encodeNum(o));
        case 'string':
            return getValueKey(mem, encode_1.encodeStr(o));
    }
    return debug_1.throwUnknownDataType(o);
}
exports.addValue = addValue;


/***/ }),

/***/ "./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/number.js":
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
let i_to_s = '';
for (let i = 0; i < 10; i++) {
    const c = String.fromCharCode(48 + i);
    i_to_s += c;
}
for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(65 + i);
    i_to_s += c;
}
for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(65 + 32 + i);
    i_to_s += c;
}
const N = i_to_s.length;
const s_to_i = {};
for (let i = 0; i < N; i++) {
    const s = i_to_s[i];
    s_to_i[s] = i;
}
function s_to_int(s) {
    let acc = 0;
    let pow = 1;
    for (let i = s.length - 1; i >= 0; i--) {
        const c = s[i];
        let x = s_to_i[c];
        x *= pow;
        acc += x;
        pow *= N;
    }
    return acc;
}
exports.s_to_int = s_to_int;
function s_to_big_int(s) {
    let acc = BigInt(0);
    let pow = BigInt(1);
    const n = BigInt(N);
    for (let i = s.length - 1; i >= 0; i--) {
        const c = s[i];
        let x = BigInt(s_to_i[c]);
        x *= pow;
        acc += x;
        pow *= n;
    }
    return acc;
}
exports.s_to_big_int = s_to_big_int;
function int_to_s(int) {
    if (int === 0) {
        return i_to_s[0];
    }
    const acc = [];
    while (int !== 0) {
        const i = int % N;
        const c = i_to_s[i];
        acc.push(c);
        int -= i;
        int /= N;
    }
    return acc.reverse().join('');
}
exports.int_to_s = int_to_s;
function big_int_to_s(int) {
    const zero = BigInt(0);
    const n = BigInt(N);
    if (int === zero) {
        return i_to_s[0];
    }
    const acc = [];
    while (int !== zero) {
        const i = int % n;
        const c = i_to_s[Number(i)];
        acc.push(c);
        int -= i;
        int /= n;
    }
    return acc.reverse().join('');
}
exports.big_int_to_s = big_int_to_s;
function reverse(s) {
    return s.split('').reverse().join('');
}
function num_to_s(num) {
    if (num < 0) {
        return '-' + num_to_s(-num);
    }
    let [a, b] = num.toString().split('.');
    if (!b) {
        return int_to_s(num);
    }
    let c;
    if (b) {
        [b, c] = b.split('e');
    }
    a = int_str_to_s(a);
    b = reverse(b);
    b = int_str_to_s(b);
    let str = a + '.' + b;
    if (c) {
        str += '.';
        switch (c[0]) {
            case '+':
                c = c.slice(1);
                break;
            case '-':
                str += '-';
                c = c.slice(1);
                break;
        }
        c = reverse(c);
        c = int_str_to_s(c);
        str += c;
    }
    return str;
}
exports.num_to_s = num_to_s;
function int_str_to_s(int_str) {
    const num = +int_str;
    if (num.toString() === int_str) {
        return int_to_s(num);
    }
    return ':' + big_int_to_s(BigInt(int_str));
}
exports.int_str_to_s = int_str_to_s;
function s_to_int_str(s) {
    if (s[0] === ':') {
        return s_to_big_int(s.substring(1)).toString();
    }
    return s_to_int(s).toString();
}
function s_to_num(s) {
    if (s[0] === '-') {
        return -s_to_num(s.substr(1));
    }
    let [a, b, c] = s.split('.');
    if (!b) {
        return s_to_int(a);
    }
    a = s_to_int_str(a);
    b = s_to_int_str(b);
    b = reverse(b);
    let str = a + '.' + b;
    if (c) {
        str += 'e';
        let neg = false;
        if (c[0] === '-') {
            neg = true;
            c = c.slice(1);
        }
        c = s_to_int_str(c);
        c = reverse(c);
        str += neg ? -c : +c;
    }
    return +str;
}
exports.s_to_num = s_to_num;


/***/ }),

/***/ "./src/features/forum-improvements/walkthroughs/show-owner-progress.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/globals/index.ts");
/* harmony import */ var _ta_x_utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utilities/index.ts");
/* harmony import */ var _ta_x_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/helpers/index.ts");
/* harmony import */ var _walkthroughs_hbs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/features/forum-improvements/walkthroughs/walkthroughs.hbs");




let extensionBody;
let askForWalkthroughBody;
const applyBody = async () => {
  const parsedDocument = new DOMParser().parseFromString(_walkthroughs_hbs__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, "text/html");
  const asideColumn = await (0,_ta_x_utilities__WEBPACK_IMPORTED_MODULE_1__/* .waitForElement */ .br)(".main aside");
  const firstSection = await (0,_ta_x_utilities__WEBPACK_IMPORTED_MODULE_1__/* .waitForElement */ .br)("section:not(.smallpanel)", asideColumn);
  asideColumn.insertBefore(
    parsedDocument.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs}`),
    firstSection
  );
  extensionBody = asideColumn.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressJs}`);
  askForWalkthroughBody = extensionBody.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.Components.AskLoader.askJs}`);
  getAchievementWalkthroughUrl();
};
const listen = () => {
  const button = extensionBody.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.Components.AskLoader.buttonJs}`);
  const input = extensionBody.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.Components.AskLoader.inputJs}`);
  button.addEventListener("click", async (e) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    try {
      if (input.value === "") {
        return;
      }
      if (!_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .GamesRegex */ .Rv.Test.walkthroughUrl(input.value)) {
        return;
      }
      toggleAskForWalkthrough();
      await getOwnerProgress(input.value);
    } catch {
      return;
    }
  });
};
const getAchievementWalkthroughUrl = async () => {
  const cachedWalkthroughUrls2 = _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Cache */ .Ct.walkthroughForumOwnerProgressUrl;
  const threadId2 = new URLSearchParams(window.location.search).get("tid");
  let url2 = threadId2 ? cachedWalkthroughUrls2.get(threadId2) : null;
  if (!url2) {
    const posts = await (0,_ta_x_utilities__WEBPACK_IMPORTED_MODULE_1__/* .waitForElement */ .br)(".posts");
    [...posts.querySelectorAll("li .body")].forEach((el) => {
      if (url2) {
        return;
      }
      if (_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .SentencesRegex */ .EP.discussWalkthrough.test(el.textContent) || _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .SentencesRegex */ .EP.walkthroughPublished.test(el.textContent)) {
        const anchor = el.querySelector("a");
        if (anchor && _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .GamesRegex */ .Rv.Test.gameUrl(anchor.href)) {
          url2 = anchor.href;
          if (!url2.endsWith("/walkthrough")) {
            url2 += "/walkthrough";
          }
          return;
        }
      }
    });
    if (!url2) {
      toggleAskForWalkthrough();
      return;
    }
  }
  getOwnerProgress(url2);
};
const getOwnerProgress = async (url) => {
  let walkthroughResponse = await (0,_ta_x_helpers__WEBPACK_IMPORTED_MODULE_2__/* .memoizeFetch */ .FS)(url);
  let walkthroughDocument = new DOMParser().parseFromString(walkthroughResponse, "text/html");
  const walkthroughEditors = walkthroughDocument.querySelector(".editors dl");
  const extensionArticle = extensionBody.querySelector("article");
  if (walkthroughEditors) {
    const gamersInvolved = getGamersInvolved(walkthroughEditors);
    const walkthroughEditorsWrapper = document.createElement("div");
    walkthroughEditorsWrapper.classList.add(
      _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorWrapperStyle
    );
    walkthroughEditorsWrapper.append(...gamersInvolved);
    extensionArticle.appendChild(walkthroughEditorsWrapper);
    const thanks = walkthroughDocument.querySelector("aside .thanks");
    if (thanks) {
      extensionArticle.appendChild(thanks);
    }
  } else {
    let walkthroughProgress = walkthroughDocument.querySelector("aside section .walthroughprogress");
    if (walkthroughProgress === null) {
      url = `${url}?sbonly=1`;
      walkthroughResponse = await (0,_ta_x_helpers__WEBPACK_IMPORTED_MODULE_2__/* .memoizeFetch */ .FS)(url);
      walkthroughDocument = new DOMParser().parseFromString(walkthroughResponse, "text/html");
      walkthroughProgress = walkthroughDocument.querySelector("aside section .walthroughprogress");
      if (walkthroughProgress === null) {
        toggleAskForWalkthrough();
        return;
      }
    }
    extensionArticle.appendChild(walkthroughProgress);
    const fillCircleScript = extensionArticle.querySelector("script");
    if (fillCircleScript) {
      eval(fillCircleScript.innerHTML);
    }
  }
  const cachedWalkthroughUrls = _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Cache */ .Ct.walkthroughForumOwnerProgressUrl;
  const threadId = new URLSearchParams(window.location.search).get("tid");
  if (threadId && !cachedWalkthroughUrls.has(threadId)) {
    cachedWalkthroughUrls.set(threadId, url);
    _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Cache */ .Ct.walkthroughForumOwnerProgressUrl = cachedWalkthroughUrls;
  }
  extensionBody.setAttribute("data-ta-x-loaded", "true");
};
const getGamersInvolved = (walkthroughEditors2) => {
  let currentRow = document.createElement("div");
  currentRow.classList.add(_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorRowStyle);
  return [...walkthroughEditors2.childNodes].reduce((rows, current, index, currentArray) => {
    if (current.tagName === "DT") {
      if (currentRow.childElementCount > 0) {
        rows.push(currentRow);
        currentRow = document.createElement("div");
        currentRow.classList.add(_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorRowStyle);
      }
      currentRow.innerHTML = current.innerHTML;
    } else if (current.tagName === "DD") {
      currentRow.innerHTML += `<div class="${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.ForumImprovements.Walkthroughs.showOwnerProgressEditorStyle}">${current.innerHTML}</div>`;
    }
    if (index === currentArray.length - 1 && currentRow.childElementCount > 0) {
      rows.push(currentRow);
    }
    return rows;
  }, []);
};
const toggleAskForWalkthrough = () => {
  askForWalkthroughBody.classList.toggle("ta-x-hide");
  if (!askForWalkthroughBody.classList.contains("ta-x-hide")) {
    extensionBody.setAttribute("data-ta-x-loaded", "true");
  } else {
    extensionBody.removeAttribute("data-ta-x-loaded");
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => {
  if (!_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .forumImprovements */ .i_.walkthroughs.showOwnerProgress) {
    return;
  }
  if (!_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .ForumRegex */ .wC.Test.viewThreadUrlWithThreadId()) {
    return;
  }
  const pageTitle = await (0,_ta_x_utilities__WEBPACK_IMPORTED_MODULE_1__/* .waitForElement */ .br)("#oMessageThread .pagetitle");
  if (!pageTitle || pageTitle.innerText.toLowerCase() !== "walkthroughs") {
    return;
  }
  await applyBody();
  listen();
});


/***/ }),

/***/ "./src/globals/index.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  KH: () => (/* reexport */ regex/* AchievementsRegex */.KH),
  rt: () => (/* reexport */ regex/* AjaxRegex */.rt),
  Ct: () => (/* reexport */ Cache),
  gT: () => (/* reexport */ Constants),
  Ye: () => (/* reexport */ regex/* ExternalRegex */.Ye),
  wC: () => (/* reexport */ regex/* ForumRegex */.wC),
  LG: () => (/* reexport */ regex/* GamerRegex */.LG),
  Rv: () => (/* reexport */ regex/* GamesRegex */.Rv),
  du: () => (/* reexport */ regex/* NewsRegex */.du),
  EP: () => (/* reexport */ regex/* SentencesRegex */.EP),
  nW: () => (/* reexport */ regex/* StaffRegex */.nW),
  EF: () => (/* reexport */ achievements),
  vc: () => (/* reexport */ config),
  kB: () => (/* reexport */ editWalkthrough),
  SP: () => (/* reexport */ emojis),
  i_: () => (/* reexport */ forumImprovements),
  TM: () => (/* reexport */ gameAchievements),
  NF: () => (/* reexport */ gameChallenges),
  MF: () => (/* reexport */ gameClips),
  hi: () => (/* reexport */ gameDLC),
  E1: () => (/* reexport */ gameForums),
  rI: () => (/* reexport */ gamerImprovements),
  Tt: () => (/* reexport */ games),
  bc: () => (/* reexport */ gamesImprovements),
  TS: () => (/* reexport */ regex/* getUrlProperties */.TS),
  Ax: () => (/* reexport */ manageWalkthrough),
  jf: () => (/* reexport */ myThreads),
  Bb: () => (/* reexport */ newsImprovements),
  mg: () => (/* reexport */ staffWalkthroughImprovements),
  _A: () => (/* reexport */ stickyHeader),
  Vx: () => (/* reexport */ walkthroughPage),
  uP: () => (/* reexport */ walkthroughPreview)
});

// UNUSED EXPORTS: DatesRegex, sales, walkthroughsForum

// EXTERNAL MODULE: ./src/utilities/date-util.ts
var date_util = __webpack_require__("./src/utilities/date-util.ts");
// EXTERNAL MODULE: ./src/globals/regex.ts
var regex = __webpack_require__("./src/globals/regex.ts");
;// CONCATENATED MODULE: ./src/globals/cache.ts


class Cache {
  static get memoize() {
    const value = GM_getValue("memoized", "");
    return value.length !== 0 ? new Map(JSON.parse(value)) : /* @__PURE__ */ new Map();
  }
  static set memoize(value) {
    GM_setValue("memoized", JSON.stringify(Array.from(value.entries())));
  }
  static get gameAchievementsXboxAchievementsGuideUrl() {
    const value = GM_getValue("gameAchievementsXboxAchievementsGuideUrl", "");
    return value.length !== 0 ? new Map(JSON.parse(value)) : /* @__PURE__ */ new Map();
  }
  static set gameAchievementsXboxAchievementsGuideUrl(value) {
    GM_setValue("gameAchievementsXboxAchievementsGuideUrl", JSON.stringify(Array.from(value.entries())));
  }
  static get walkthroughForumOwnerProgressUrl() {
    const value = GM_getValue("walkthroughOwnerProgressUrl", "");
    return value.length !== 0 ? new Map(JSON.parse(value)) : /* @__PURE__ */ new Map();
  }
  static set walkthroughForumOwnerProgressUrl(value) {
    GM_setValue("walkthroughOwnerProgressUrl", JSON.stringify(Array.from(value.entries())));
  }
  static get walkthroughPreviewWalkthroughId() {
    const value = GM_getValue("previewWalkthroughId", "");
    return value.length !== 0 ? new Map(JSON.parse(value)) : /* @__PURE__ */ new Map();
  }
  static set walkthroughPreviewWalkthroughId(value) {
    GM_setValue("previewWalkthroughId", JSON.stringify(Array.from(value.entries())));
  }
  static get gameAchievementsDefaultStatusPathName() {
    return GM_getValue("gameAchievementsDefaultStatusPathName", "");
  }
  static set gameAchievementsDefaultStatusPathName(value) {
    GM_setValue("gameAchievementsDefaultStatusPathName", value);
  }
  static get gameDLCDefaultStatusPathName() {
    return GM_getValue("gameDLCDefaultStatusPathName", "");
  }
  static set gameDLCDefaultStatusPathName(value) {
    GM_setValue("gameDLCDefaultStatusPathName", value);
  }
  static get gameChallengesDefaultStatusPathName() {
    return GM_getValue("gameChallengesDefaultStatusPathName", "");
  }
  static set gameChallengesDefaultStatusPathName(value) {
    GM_setValue("gameChallengesDefaultStatusPathName", value);
  }
  static get gameClipsDefaultStatusSelectors() {
    const value = GM_getValue("gameClipsDefaultStatusSelectors", "");
    return value.length !== 0 ? JSON.parse(value) : [];
  }
  static set gameClipsDefaultStatusSelectors(value) {
    GM_setValue("gameClipsDefaultStatusSelectors", JSON.stringify(value));
  }
  static get gameForumsDefaultThreadPathName() {
    return GM_getValue("gameForumsDefaultThreadPathName", "");
  }
  static set gameForumsDefaultThreadPathName(value) {
    GM_setValue("gameForumsDefaultThreadPathName", value);
  }
  static forceClear() {
    GM_deleteValue("memoized");
    GM_deleteValue("walkthroughOwnerProgressUrl");
    GM_deleteValue("previewWalkthroughId");
  }
  static clearExpired() {
    const updatedCache = Array.from(this.memoize.entries()).filter((item) => (0,date_util/* isBeforeNow */.c)(item[1].expiryTime));
    this.memoize = new Map(updatedCache);
    if (!regex/* GamesRegex */.Rv.Test.achievementsUrl()) {
      GM_deleteValue("gameAchievementsDefaultStatusPathName");
    }
    if (!regex/* GamesRegex */.Rv.Test.dlcUrl()) {
      GM_deleteValue("gameDLCDefaultStatusPathName");
    }
    if (!regex/* GamesRegex */.Rv.Test.challengesUrl()) {
      GM_deleteValue("gameChallengesDefaultStatusPathName");
    }
    if (!regex/* GamesRegex */.Rv.Test.clipsUrl()) {
      GM_deleteValue("gameClipsDefaultStatusSelectors");
    }
    if (!regex/* GamesRegex */.Rv.Test.forum()) {
      GM_deleteValue("gameForumsDefaultThreadPathName");
    }
  }
  static clearLegacy() {
    GM_deleteValue("trueachievements-extra-memoized");
  }
}

;// CONCATENATED MODULE: ./src/globals/constants.ts
var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H;
const classStylePrefix = "ta-x";
const jsStylePrefix = "js-ta-x";
const variableStylePrefix = "--ta-x";
const templatePrefix = "ta-x-template";
class Constants {
}
Constants.Styles = (_z = class {
}, _z.root = "trueachievement-extras", _z.Components = (_c = class {
}, _c.accordion = `${jsStylePrefix}-accordion`, _c.askLoader = `${jsStylePrefix}-ask-loader-container`, _c.snackbar = `${jsStylePrefix}-snackbar`, _c.showSnackbar = `${classStylePrefix}-snackbar-show`, _c.AskLoader = (_a = class {
}, _a.featureJs = `${jsStylePrefix}-ask-loader`, _a.containerJs = `${_a.featureJs}-container`, _a.askJs = `${_a.featureJs}-ask`, _a.inputJs = `${_a.askJs}-input`, _a.buttonJs = `${_a.askJs}-button`, _a), _c.Tab = (_b = class {
}, _b.featureStyle = `${classStylePrefix}-tabs`, _b.featureJs = `${jsStylePrefix}-tabs`, _b.tabLinkContainer = `${_b.featureJs}-link-container`, _b.tabLink = `${_b.featureJs}-link`, _b.tabContent = `${_b.featureJs}-content`, _b.tabSelected = `${_b.featureStyle}-selected`, _b.tabScroll = `${_b.featureStyle}-scroll`, _b), _c), _z.Animations = (_d = class {
}, _d.yShow = `${classStylePrefix}-y-show`, _d.yHide = `${classStylePrefix}-y-hide`, _d.yHideNoTransition = `${_d.yHide}-no-transition`, _d), _z.Base = (_e = class {
}, _e.hide = `${classStylePrefix}-hide`, _e), _z.SettingsMenu = (_f = class {
}, _f.featureJs = `${jsStylePrefix}-settings-menu`, _f.featureStyle = `${classStylePrefix}-settings-menu`, _f.subSetting = `${_f.featureStyle}-sub-setting`, _f.wrenchJs = `${_f.featureJs}-wrench`, _f.closeJs = `${_f.featureJs}-close`, _f.versionLink = `${_f.featureJs}-version`, _f.documentationLink = `${_f.featureJs}-documentation`, _f.changelogView = `${_f.featureJs}-changelog`, _f.featureDocumentationView = `${_f.featureJs}-feature-documentation`, _f.settingsView = `${_f.featureJs}-settings`, _f.settingsContentShow = `${_f.featureStyle}-settings-item-show`, _f), _z.Emojis = (_g = class {
}, _g.featureJs = `${jsStylePrefix}-emojis`, _g.featureStyle = `${classStylePrefix}-emojis`, _g), _z.StickyHeader = (_h = class {
}, _h.featureJs = `${jsStylePrefix}-sticky-header`, _h.featureStyle = `${classStylePrefix}-sticky-header`, _h), _z.NewsImprovements = (_i = class {
}, _i.featureJs = `${jsStylePrefix}-news-improvements`, _i.featureStyle = `${classStylePrefix}-news-improvements`, _i), _z.GamesImprovements = (_l = class {
}, _l.featureJs = `${jsStylePrefix}-games-improvements`, _l.featureStyle = `${classStylePrefix}-games-improvements`, _l.highlightGamesButtonJs = `${_l.featureJs}-highlight-games-collection-button`, _l.Forums = (_j = class {
}, _j.featureJs = `${jsStylePrefix}-games-improvements-forum-improvements`, _j.featureStyle = `${classStylePrefix}-games-improvements-forum-improvements`, _j), _l.Achievements = (_k = class {
}, _k.featureJs = `${jsStylePrefix}-game-achievements`, _k.featureStyle = `${classStylePrefix}-game-achievements`, _k.showXboxAchievementGuidesJs = `${_k.featureJs}-xbox-achievement-guides`, _k.showXboxAchievementGuidesStyle = `${_k.featureStyle}-xbox-achievement-guides`, _k.showOwnerProgressEditorWrapperStyle = `${_k.showXboxAchievementGuidesStyle}-editor-wrapper`, _k.showOwnerProgressEditorRowStyle = `${_k.showXboxAchievementGuidesStyle}-editor-row`, _k.showOwnerProgressEditorStyle = `${_k.showXboxAchievementGuidesStyle}-editor`, _k.askForWalkthroughWalkthroughJs = `${_k.showXboxAchievementGuidesJs}-ask-for-walkthrough`, _k.saveWalkthroughInputJs = `${_k.showXboxAchievementGuidesJs}-save-walkthrough-input`, _k.saveWalkthroughButtonJs = `${_k.showXboxAchievementGuidesJs}-save-walkthrough-button`, _k.showAchievementLeaderboardLinksStyle = `${_k.featureStyle}-achievement-leaderboard-links`, _k), _l), _z.GamerImprovements = (_m = class {
}, _m.featureJs = `${jsStylePrefix}-gamer-improvements`, _m.featureStyle = `${classStylePrefix}-gamer-improvements`, _m.groupByGameButtonJs = `${_m.featureJs}-group-by-game-button`, _m), _z.ForumImprovements = (_o = class {
}, _o.featureJs = `${jsStylePrefix}-forum-improvements`, _o.featureStyle = `${classStylePrefix}-forum-improvements`, _o.filterThreadsTitleStyle = `${_o.featureStyle}-filter-threads-title`, _o.filterThreadsUnhideStyle = `${_o.featureStyle}-filter-threads-unhide`, _o.filterThreadsUnhideJs = `${_o.featureJs}-filter-threads-unhide`, _o.Walkthroughs = (_n = class {
}, _n.featureJs = `${jsStylePrefix}-forum-improvements-walkthroughs`, _n.featureStyle = `${classStylePrefix}-forum-improvements-walkthroughs`, _n.showOwnerProgressJs = `${_n.featureJs}-show-owner-progress`, _n.showOwnerProgressStyle = `${_n.featureStyle}-show-owner-progress`, _n.showOwnerProgressEditorWrapperStyle = `${_n.showOwnerProgressStyle}-editor-wrapper`, _n.showOwnerProgressEditorRowStyle = `${_n.showOwnerProgressStyle}-editor-row`, _n.showOwnerProgressEditorStyle = `${_n.showOwnerProgressStyle}-editor`, _n.askForWalkthroughWalkthroughJs = `${_n.showOwnerProgressJs}-ask-for-walkthrough`, _n.saveWalkthroughInputJs = `${_n.showOwnerProgressJs}-save-walkthrough-input`, _n.saveWalkthroughButtonJs = `${_n.showOwnerProgressJs}-save-walkthrough-button`, _n), _o), _z.StaffWalkthroughImprovements = (_t = class {
}, _t.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements`, _t.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements`, _t.WalkthroughPage = (_p = class {
}, _p.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-walkthrough-page`, _p.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-walkthrough-page`, _p.containerJs = `${_p.featureJs}-container`, _p.containerStyle = `${_p.featureStyle}-container`, _p.stickyPageHistoryJs = `${_p.featureJs}-sticky-page-history`, _p.stickyPageHistoryStyle = `${_p.featureStyle}-sticky-page-history`, _p.moveButtonsToLeftStyle = `${_p.featureStyle}-move-buttons-to-left`, _p.walkthroughTeamButtonJs = `${_p.featureJs}-walkthrough-team-button`, _p), _t.ManageWalkthroughPage = (_q = class {
}, _q.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`, _q.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-manage-walkthrough-page`, _q.containerJs = `${_q.featureJs}-container`, _q.containerStyle = `${_q.featureStyle}-container`, _q.clickableAchievementsJs = `${_q.featureJs}-clickable-achievements`, _q.missingButtonsContainerJs = `${_q.featureJs}-missing-buttons-container`, _q.addPageButtonJs = `${_q.featureJs}-add-page-button`, _q.previewButtonJs = `${_q.featureJs}-preview-button`, _q.viewContentButtonJs = `${_q.featureJs}-view-content-button`, _q.readyForReviewButtonJs = `${_q.featureJs}-ready-for-review-button`, _q), _t.EditWalkthroughPage = (_r = class {
}, _r.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`, _r.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`, _r.containerJs = `${_r.featureJs}-container`, _r.containerStyle = `${_r.featureStyle}-container`, _r.improvedImageSelectorJs = `${_r.featureJs}-improved-image-selector`, _r.improvedImageSelectorStyle = `${_r.featureStyle}-improved-image-selector`, _r.improvedImageSelectorContainerJs = `${_r.improvedImageSelectorJs}-container`, _r.improvedImageSelectorContainerStyle = `${_r.improvedImageSelectorStyle}-container`, _r.improvedImageSelectorImageTitleJs = `${_r.improvedImageSelectorJs}-image-title`, _r.improvedImageSelectorImageTitleStyle = `${_r.improvedImageSelectorStyle}-image-title`, _r.themeToggleJs = `${_r.featureJs}-theme-toggle`, _r.themeToggleStyle = `${_r.featureStyle}-theme-toggle`, _r.themeToggleDarkStyle = `${_r.themeToggleStyle}-dark`, _r.themeToggleLightStyle = `${_r.themeToggleStyle}-light`, _r.stickyTinymceToolbarJs = `${_r.featureJs}-sticky-tinymce-toolbar`, _r.stickyTinymceToolbarStyles = `${_r.featureStyle}-sticky-tinymce-toolbar`, _r), _t.WalkthroughPreview = (_s = class {
}, _s.featureJs = `${jsStylePrefix}-staff-walkthrough-improvements-walkthrough-preview`, _s.featureStyle = `${classStylePrefix}-staff-walkthrough-improvements-walkthrough-preview`, _s.populateAsideContentJs = `${_s.featureJs}-populate-aside-content`, _s.populateAsideContentWalkthroughPagesJs = `${_s.populateAsideContentJs}-walkthrough-pages`, _s.populateAsideContentWalkthroughThanksJs = `${_s.populateAsideContentJs}-walkthrough-thanks`, _s.populateAsideContentWalkthroughAchievementsJs = `${_s.populateAsideContentJs}-walkthrough-achievements`, _s), _t), _z.Variables = (_y = class {
}, _y.StickyHeader = (_u = class {
}, _u.featureVariableStylePrefix = `${variableStylePrefix}-sticky-header`, _u.height = `${_u.featureVariableStylePrefix}-height`, _u), _y.StaffWalkthroughImprovements = (_x = class {
}, _x.WalkthroughPage = (_v = class {
}, _v.featureVariableStylePrefix = `${variableStylePrefix}-staff-walkthrough-improvements-walkthrough-page`, _v.stickyPageHistoryTop = `${_v.featureVariableStylePrefix}-sticky-page-history-top`, _v), _x.EditWalkthroughPage = (_w = class {
}, _w.featureVariableStylePrefix = `${variableStylePrefix}-staff-walkthrough-improvements-edit-walkthrough-page`, _w.stickyTinymceToolbarWidth = `${_w.featureVariableStylePrefix}-sticky-tinymce-toolbar-width`, _w.stickyTinymceToolbarTop = `${_w.featureVariableStylePrefix}-sticky-tinymce-toolbar-top`, _w.stickyTinymceToolbarFloatingMenu = `${_w.featureVariableStylePrefix}-sticky-tinymce-toolbar-floating-menu`, _w), _x), _y), _z);
Constants.Templates = (_H = class {
}, _H.Components = (_B = class {
}, _B.Tab = (_A = class {
}, _A.featureTemplatePrefix = `${templatePrefix}-tabs`, _A.tabLink = `${_A.featureTemplatePrefix}-link`, _A.tabContent = `${_A.featureTemplatePrefix}-content`, _A), _B), _H.GamesImprovements = (_D = class {
}, _D.Achievements = (_C = class {
}, _C.featureTemplatePrefix = `${templatePrefix}-games-improvements-achievements`, _C.achievementGuideSolution = `${_C.featureTemplatePrefix}-achievement-guide`, _C), _D), _H.StaffWalkthroughImprovements = (_G = class {
}, _G.ManageWalkthroughPage = (_E = class {
}, _E.featureTemplatePrefix = `${templatePrefix}-manage-walkthrough`, _E.achievementRow = `${_E.featureTemplatePrefix}-achievement-row`, _E), _G.WalkthroughPreview = (_F = class {
}, _F.featureTemplatePrefix = `${templatePrefix}-walkthrough-preview`, _F.walkthroughPagesSummary = `${_F.featureTemplatePrefix}-walkthrough-pages-summary`, _F.walkthroughPagesNumbered = `${_F.featureTemplatePrefix}-walkthrough-pages-numbered`, _F.walkthroughPagesNumberedSelected = `${_F.featureTemplatePrefix}-walkthrough-pages-numbered-selected`, _F.walkthroughAchievements = `${_F.featureTemplatePrefix}-walkthrough-achievements`, _F), _G), _H);

;// CONCATENATED MODULE: ./src/globals/config.ts
const migrateGet = (oldSetting, newSetting, defaultValue) => {
  const newValue = GM_getValue(newSetting);
  if (newValue !== void 0) {
    return newValue;
  }
  const oldValue = GM_getValue(oldSetting, defaultValue);
  GM_setValue(newSetting, oldValue);
  GM_deleteValue(oldSetting);
  return oldValue;
};
const arrayGet = (setting, defaultValue) => {
  const value = GM_getValue(setting, "");
  return value.length !== 0 ? JSON.parse(value) : defaultValue;
};
const stickyHeader = {
  get enabled() {
    return migrateGet("trueachievements-extra-stickyHeader-enabled", "stickyHeader-enabled", false);
  },
  set enabled(value) {
    GM_setValue("stickyHeader-enabled", value);
  },
  get remainStuck() {
    return GM_getValue("stickyHeader-remainStuck", false);
  },
  set remainStuck(value) {
    GM_setValue("stickyHeader-remainStuck", value);
  }
};
const emojis = {
  get enabled() {
    return GM_getValue("emojis-enabled", false);
  },
  set enabled(value) {
    GM_setValue("emojis-enabled", value);
  }
};
const editWalkthrough = {
  get improvedImageSelector() {
    return migrateGet(
      "trueachievements-extra-staffWalkthroughImprovements-improvedImageSelector",
      "improvedImageSelector",
      false
    );
  },
  set improvedImageSelector(value) {
    GM_setValue("improvedImageSelector", value);
  },
  get autoSaveNotification() {
    return GM_getValue("autoSaveNotification", false);
  },
  set autoSaveNotification(value) {
    GM_setValue("autoSaveNotification", value);
  },
  get tinymceTheme() {
    return migrateGet("trueachievements-extra-staffWalkthroughImprovements-tinymceTheme", "tinymceTheme", null);
  },
  set tinymceTheme(value) {
    GM_setValue("tinymceTheme", value);
  }
};
const manageWalkthrough = {
  get manageWalkthroughDefaultStatus() {
    return migrateGet(
      "trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatus",
      "manageWalkthroughDefaultStatus",
      false
    );
  },
  set manageWalkthroughDefaultStatus(value) {
    GM_setValue("manageWalkthroughDefaultStatus", value);
  },
  get clickableTableLinks() {
    return migrateGet(
      "trueachievements-extra-staffWalkthroughImprovements-clickableTableLinks",
      "clickableTableLinks",
      false
    );
  },
  set clickableTableLinks(value) {
    GM_setValue("clickableTableLinks", value);
  },
  get addMissingButtons() {
    return GM_getValue("addMissingButtons", false);
  },
  set addMissingButtons(value) {
    GM_setValue("addMissingButtons", value);
  },
  get autoSelectFirst() {
    return GM_getValue("autoSelectFirst", false);
  },
  set autoSelectFirst(value) {
    GM_setValue("autoSelectFirst", value);
  },
  get manageWalkthroughDefaultStatusValue() {
    return migrateGet(
      "trueachievements-extra-staffWalkthroughImprovements-manageWalkthroughDefaultStatusValue",
      "manageWalkthroughDefaultStatusValue",
      "-1"
    );
  },
  set manageWalkthroughDefaultStatusValue(value) {
    GM_setValue("manageWalkthroughDefaultStatusValue", value);
  }
};
const walkthroughPage = {
  get stickyPageHistory() {
    return migrateGet(
      "trueachievements-extra-staffWalkthroughImprovements-stickyPageHistory",
      "stickyPageHistory",
      false
    );
  },
  set stickyPageHistory(value) {
    GM_setValue("stickyPageHistory", value);
  },
  get moveButtonsToLeft() {
    return migrateGet("trueachievements-extra-staffWalkthroughImprovements-editPageLeft", "moveButtonsToLeft", false);
  },
  set moveButtonsToLeft(value) {
    GM_setValue("moveButtonsToLeft", value);
  },
  get walkthroughTeamButton() {
    return migrateGet(
      "trueachievements-extra-staffWalkthroughImprovements-walkthroughTeamButton",
      "walkthroughTeamButton",
      false
    );
  },
  set walkthroughTeamButton(value) {
    GM_setValue("walkthroughTeamButton", value);
  },
  get highlightPageLocked() {
    return GM_getValue("highlightPageLocked", false);
  },
  set highlightPageLocked(value) {
    GM_setValue("highlightPageLocked", value);
  }
};
const walkthroughPreview = {
  get populateAsideContent() {
    return GM_getValue("populateAsideContent", false);
  },
  set populateAsideContent(value) {
    GM_setValue("populateAsideContent", value);
  }
};
const staffWalkthroughImprovements = {
  get enabled() {
    return migrateGet(
      "trueachievements-extra-staffWalkthroughImprovements-enabled",
      "staffWalkthroughImprovements-enabled",
      false
    );
  },
  set enabled(value) {
    GM_setValue("staffWalkthroughImprovements-enabled", value);
  },
  editWalkthrough,
  manageWalkthrough,
  walkthroughPage,
  walkthroughPreview
};
const myThreads = {
  get myThreadsForumOverride() {
    return GM_getValue("myThreadsForumOverride", false);
  },
  set myThreadsForumOverride(value) {
    GM_setValue("myThreadsForumOverride", value);
  },
  get myThreadsThreadFilter() {
    return myThreads.myThreadsForumOverride ? GM_getValue("myThreadsThreadFilter", false) : forumImprovements.forumImprovementsThreadFilter;
  },
  set myThreadsThreadFilter(value) {
    myThreads.myThreadsForumOverride ? GM_setValue("myThreadsThreadFilter", value) : null;
  },
  get threadFilterKeywords() {
    return myThreads.myThreadsForumOverride ? arrayGet("myThreadsThreadFilterKeywords", []) : forumImprovements.threadFilterKeywords;
  },
  set threadFilterKeywords(value) {
    myThreads.myThreadsForumOverride ? GM_setValue("myThreadsThreadFilterKeywords", JSON.stringify(value)) : null;
  }
};
const walkthroughsForum = {
  get showOwnerProgress() {
    return GM_getValue("showOwnerProgress", false);
  },
  set showOwnerProgress(value) {
    GM_setValue("showOwnerProgress", value);
  }
};
const forumImprovements = {
  get enabled() {
    return GM_getValue("forumImprovements-enabled", false);
  },
  set enabled(value) {
    GM_setValue("forumImprovements-enabled", value);
  },
  get forumImprovementsThreadFilter() {
    return GM_getValue("forumImprovementsThreadFilter", false);
  },
  set forumImprovementsThreadFilter(value) {
    GM_setValue("forumImprovementsThreadFilter", value);
  },
  get threadFilterKeywords() {
    return arrayGet("forumImprovementsThreadFilterKeywords", []);
  },
  set threadFilterKeywords(value) {
    GM_setValue("forumImprovementsThreadFilterKeywords", JSON.stringify(value));
  },
  walkthroughs: walkthroughsForum,
  myThreads
};
const sales = {
  get autoSortBy() {
    return GM_getValue("autoSortBy", false);
  },
  set autoSortBy(value) {
    GM_setValue("autoSortBy", value);
  },
  get autoSortByValue() {
    return arrayGet("autoSortByValue", ["product", "game"]);
  },
  set autoSortByValue(value) {
    GM_setValue("autoSortByValue", JSON.stringify(value));
  },
  get autoSortByOrder() {
    return GM_getValue("autoSortByOrder", "asc");
  },
  set autoSortByOrder(value) {
    GM_setValue("autoSortByOrder", value);
  }
};
const newsImprovements = {
  get enabled() {
    return GM_getValue("newsImprovements-enabled", false);
  },
  set enabled(value) {
    GM_setValue("newsImprovements-enabled", value);
  },
  sales
};
const games = {
  get addHighlightGamesNotInCollectionButton() {
    return GM_getValue("addHighlightGamesNotInCollectionButton-enabled", false);
  },
  set addHighlightGamesNotInCollectionButton(value) {
    GM_setValue("addHighlightGamesNotInCollectionButton-enabled", value);
  }
};
const gameAchievements = {
  get gameAchievementsDefaultStatus() {
    return GM_getValue("gameAchievementsDefaultStatus", false);
  },
  set gameAchievementsDefaultStatus(value) {
    GM_setValue("gameAchievementsDefaultStatus", value);
  },
  get gameAchievementsDefaultStatusValue() {
    return GM_getValue("gameAchievementsDefaultStatusValue", "rdoAllAchievements");
  },
  set gameAchievementsDefaultStatusValue(value) {
    GM_setValue("gameAchievementsDefaultStatusValue", value);
  },
  get gameAchievementsIndividualProgress() {
    return GM_getValue("gameAchievementsIndividualProgress", false);
  },
  set gameAchievementsIndividualProgress(value) {
    GM_setValue("gameAchievementsIndividualProgress", value);
  },
  get gameAchievementsShowXboxAchievementGuides() {
    return GM_getValue("gameAchievementsShowXboxAchievementGuides", false);
  },
  set gameAchievementsShowXboxAchievementGuides(value) {
    GM_setValue("gameAchievementsShowXboxAchievementGuides", value);
  }
};
const gameClips = {
  get gameClipsDefaultStatus() {
    return GM_getValue("gameClipsDefaultStatus", false);
  },
  set gameClipsDefaultStatus(value) {
    GM_setValue("gameClipsDefaultStatus", value);
  },
  get gameClipsDefaultRecordedByValue() {
    return GM_getValue("gameClipsDefaultRecordedByValue", "");
  },
  set gameClipsDefaultRecordedByValue(value) {
    GM_setValue("gameClipsDefaultRecordedByValue", value);
  },
  get gameClipsDefaultSavedByValue() {
    return GM_getValue("gameClipsDefaultSavedByValue", "Gamer");
  },
  set gameClipsDefaultSavedByValue(value) {
    GM_setValue("gameClipsDefaultSavedByValue", value);
  },
  get gameClipsDefaultRecordedValue() {
    return GM_getValue("gameClipsDefaultRecordedValue", "7");
  },
  set gameClipsDefaultRecordedValue(value) {
    GM_setValue("gameClipsDefaultRecordedValue", value);
  },
  get gameClipsDefaultSortByValue() {
    return GM_getValue("gameClipsDefaultSortByValue", "Most viewed");
  },
  set gameClipsDefaultSortByValue(value) {
    GM_setValue("gameClipsDefaultSortByValue", value);
  }
};
const gameDLC = {
  get gameDLCOverride() {
    return GM_getValue("gameDLCOverride", false);
  },
  set gameDLCOverride(value) {
    GM_setValue("gameDLCOverride", value);
  },
  get gameDLCDefaultStatus() {
    return gameDLC.gameDLCOverride ? GM_getValue("gameDLCDefaultStatus", false) : gameAchievements.gameAchievementsDefaultStatus;
  },
  set gameDLCDefaultStatus(value) {
    gameDLC.gameDLCOverride ? GM_setValue("gameDLCDefaultStatus", value) : null;
  },
  get gameDLCDefaultStatusValue() {
    return gameDLC.gameDLCOverride ? GM_getValue("gameDLCDefaultStatusValue", "rdoAllAchievements") : gameAchievements.gameAchievementsDefaultStatusValue;
  },
  set gameDLCDefaultStatusValue(value) {
    gameDLC.gameDLCOverride ? GM_setValue("gameDLCDefaultStatusValue", value) : null;
  },
  get gameDLCIndividualProgress() {
    return gameDLC.gameDLCOverride ? GM_getValue("gameDLCIndividualProgress", false) : gameAchievements.gameAchievementsIndividualProgress;
  },
  set gameDLCIndividualProgress(value) {
    gameDLC.gameDLCOverride ? GM_setValue("gameDLCIndividualProgress", value) : null;
  }
};
const gameChallenges = {
  get gameChallengesOverride() {
    return GM_getValue("gameChallengesOverride", false);
  },
  set gameChallengesOverride(value) {
    GM_setValue("gameChallengesOverride", value);
  },
  get gameChallengesDefaultStatus() {
    return GM_getValue("gameChallengesDefaultStatus", false);
  },
  set gameChallengesDefaultStatus(value) {
    GM_setValue("gameChallengesDefaultStatus", value);
  },
  get gameChallengesDefaultStatusValue() {
    return GM_getValue("gameChallengesDefaultStatusValue", "rdoAllChallenges");
  },
  set gameChallengesDefaultStatusValue(value) {
    GM_setValue("gameChallengesDefaultStatusValue", value);
  },
  get gameChallengesIndividualProgress() {
    return gameChallenges.gameChallengesOverride ? GM_getValue("gameChallengesIndividualProgress", false) : gameAchievements.gameAchievementsIndividualProgress;
  },
  set gameChallengesIndividualProgress(value) {
    gameChallenges.gameChallengesOverride ? GM_setValue("gameChallengesIndividualProgress", value) : null;
  }
};
const gameForums = {
  get gameForumsForumOverride() {
    return GM_getValue("gameForumsForumOverride", false);
  },
  set gameForumsForumOverride(value) {
    GM_setValue("gameForumsForumOverride", value);
  },
  get gameForumsThreadFilter() {
    return gameForums.gameForumsForumOverride ? GM_getValue("gameForumsThreadFilter", false) : forumImprovements.forumImprovementsThreadFilter;
  },
  set gameForumsThreadFilter(value) {
    gameForums.gameForumsForumOverride ? GM_setValue("gameForumsThreadFilter", value) : null;
  },
  get threadFilterKeywords() {
    return gameForums.gameForumsForumOverride ? arrayGet("gameForumsThreadFilterKeywords", []) : forumImprovements.threadFilterKeywords;
  },
  set threadFilterKeywords(value) {
    gameForums.gameForumsForumOverride ? GM_setValue("gameForumsThreadFilterKeywords", JSON.stringify(value)) : null;
  },
  get gameForumsDefaultThread() {
    return GM_getValue("gameForumsDefaultThread", false);
  },
  set gameForumsDefaultThread(value) {
    GM_setValue("gameForumsDefaultThread", value);
  },
  get gameForumsDefaultThreadValue() {
    return GM_getValue("gameForumsDefaultThreadValue", "all");
  },
  set gameForumsDefaultThreadValue(value) {
    GM_setValue("gameForumsDefaultThreadValue", value);
  }
};
const gamesImprovements = {
  get enabled() {
    return GM_getValue("gamesImprovements-enabled", false);
  },
  set enabled(value) {
    GM_setValue("gamesImprovements-enabled", value);
  },
  games,
  achievements: gameAchievements,
  challenges: gameChallenges,
  forums: gameForums,
  clips: gameClips,
  dlc: gameDLC
};
const achievements = {
  get addGroupByGameButton() {
    return GM_getValue("addGroupByGameButton-enabled", false);
  },
  set addGroupByGameButton(value) {
    GM_setValue("addGroupByGameButton-enabled", value);
  }
};
const gamerImprovements = {
  get enabled() {
    return GM_getValue("gamerImprovements-enabled", false);
  },
  set enabled(value) {
    GM_setValue("gamerImprovements-enabled", value);
  },
  achievements
};
const config = {
  stickyHeader,
  emojis,
  staffWalkthroughImprovements,
  forumImprovements,
  newsImprovements,
  gamesImprovements,
  gamerImprovements
};

;// CONCATENATED MODULE: ./src/globals/index.ts






/***/ }),

/***/ "./src/globals/regex.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BL: () => (/* binding */ DatesRegex),
/* harmony export */   EP: () => (/* binding */ SentencesRegex),
/* harmony export */   KH: () => (/* binding */ AchievementsRegex),
/* harmony export */   LG: () => (/* binding */ GamerRegex),
/* harmony export */   Rv: () => (/* binding */ GamesRegex),
/* harmony export */   TS: () => (/* binding */ getUrlProperties),
/* harmony export */   Ye: () => (/* binding */ ExternalRegex),
/* harmony export */   du: () => (/* binding */ NewsRegex),
/* harmony export */   nW: () => (/* binding */ StaffRegex),
/* harmony export */   rt: () => (/* binding */ AjaxRegex),
/* harmony export */   wC: () => (/* binding */ ForumRegex)
/* harmony export */ });
const getUrlProperties = (str, props = []) => {
  props = Array.isArray(props) ? props : [props];
  try {
    const url = new URL(str);
    let constructedString = "";
    for (let i = 0; i < props.length; i++) {
      if (!url[props[i]]) {
        continue;
      }
      constructedString += url[props[i]];
    }
    return constructedString;
  } catch (ex) {
    throw `${str} is not a valid url`;
  }
};
const achievementUrl = new RegExp("^/a[0-9]*/(?!.*/).*$", "i");
const achievementUrlWithGamerId = new RegExp("^/a[0-9]*/.*\\?gamerid=[0-9]*", "i");
const achievementsUrl = new RegExp("^/game/.*/achievements$", "i");
const achievementsUrlWithGamerId = new RegExp("^/game/.*/achievements\\?gamerid=[0-9]*", "i");
const challengesUrl = new RegExp("^/game/.*/challenges$", "i");
const challengesUrlWithGamerId = new RegExp("^/game/.*/challenges\\?gamerid=[0-9]*", "i");
const clipsUrl = new RegExp("^/game/.*/videos$", "i");
const dlcUrl = new RegExp("^/game/.*/dlc$", "i");
const dlcUrlWithGamerId = new RegExp("^/game/.*/dlc\\?gamerid=[0-9]*", "i");
const individualDlcUrl = new RegExp("^/game/.*/dlc/(?!.*/).*$", "i");
const individualDlcUrlWithGamerId = new RegExp("^/game/.*/dlc/.*\\?gamerid=[0-9]*", "i");
const walkthroughUrl = new RegExp("^/game/.*/walkthrough$", "i");
const gameForumUrl = new RegExp("^/game/.*/forum$", "i");
const gameForumUrlWithAll = new RegExp("^/game/.*/forum\\?type=all", "i");
const gameForumUrlWithCommunity = new RegExp("^/game/.*/forum\\?type=community", "i");
const gameForumUrlWithGameInfo = new RegExp("^/game/.*/forum\\?type=gameinfo", "i");
const reviewsUrl = new RegExp("^/game/.*/review$", "i");
const gamesUrl = new RegExp("^/games.aspx", "i");
const gameUrl = new RegExp("^/game/.*$", "i");
const editWalkthroughUrl = new RegExp("^/staff/walkthrough/editwalkthroughpage.aspx", "i");
const manageWalkthroughUrl = new RegExp("^/staff/walkthrough/managewalkthrough.aspx", "i");
const manageWalkthroughUrlWithWalkthroughId = new RegExp(
  "^/staff/walkthrough/managewalkthrough.aspx\\?walkthroughid=[0-9]*",
  "i"
);
const walkthroughPageUrl = new RegExp("^/staff/walkthrough/walkthroughpage.aspx", "i");
const walkthroughPreviewUrl = new RegExp("^/staff/walkthrough/walkthroughpreview.aspx", "i");
const walkthroughPreviewUrlWithWalkthroughId = new RegExp(
  "^/staff/walkthrough/walkthroughpreview.aspx\\?walkthroughid=[0-9]*",
  "i"
);
const walkthroughPagePreviewUrl = new RegExp("^/staff/walkthrough/walkthroughpagepreview.aspx", "i");
const walkthroughPagePreviewUrlWithPageId = new RegExp(
  "^/staff/walkthrough/walkthroughpagepreview.aspx\\?pageid=[0-9]*",
  "i"
);
const autosave = new RegExp("^/ajaxfunctions.aspx/AutoSave", "i");
const forumsUrl = new RegExp("^/forum/forums.aspx", "i");
const myTheadsUrl = new RegExp("^/forum/viewthreads.aspx", "i");
const viewBoardUrlWithBoardId = new RegExp("^/forum/viewboard.aspx\\?messageboardid=[0-9]*", "i");
const viewThreadUrlWithThreadId = new RegExp("^/forum/viewthread.aspx\\?tid=[0-9]*", "i");
const pollUrl = new RegExp("^/poll/[0-9]*/*", "i");
const newsUrl = new RegExp("^/n[0-9]*/*", "i");
const gamerUrl = new RegExp("^/gamer/.*$", "i");
const gamerAchievementsUrl = new RegExp("^/gamer/.*/achievements$", "i");
const xboxAchievementsGuide = new RegExp("^/game/.*/guide((/$)|$)", "i");
const AchievementsRegex = {
  achievementUrl,
  achievementUrlWithGamerId,
  Test: {
    achievementUrl: (str = window.location.href) => achievementUrl.test(getUrlProperties(str, "pathname")),
    achievementUrlWithGamerId: (str = window.location.href) => achievementUrlWithGamerId.test(getUrlProperties(str, ["pathname", "search"]))
  }
};
const GamesRegex = {
  achievementsUrl,
  achievementsUrlWithGamerId,
  challengesUrl,
  challengesUrlWithGamerId,
  clipsUrl,
  dlcUrl,
  dlcUrlWithGamerId,
  individualDlcUrl,
  individualDlcUrlWithGamerId,
  forumUrl: gameForumUrl,
  gameUrl,
  gamesUrl,
  reviewsUrl,
  walkthroughUrl,
  Test: {
    dlc: (str = window.location.href) => dlcUrl.test(getUrlProperties(str, "pathname")) || individualDlcUrl.test(getUrlProperties(str, "pathname")),
    dlcWithGamerId: (str = window.location.href) => dlcUrlWithGamerId.test(getUrlProperties(str, ["pathname", "search"])) || individualDlcUrlWithGamerId.test(getUrlProperties(str, ["pathname", "search"])),
    forum: (str = window.location.href) => gameForumUrl.test(getUrlProperties(str, "pathname")) || gameForumUrlWithAll.test(getUrlProperties(str, ["pathname", "search"])) || gameForumUrlWithCommunity.test(getUrlProperties(str, ["pathname", "search"])) || gameForumUrlWithGameInfo.test(getUrlProperties(str, ["pathname", "search"])),
    achievementsUrl: (str = window.location.href) => achievementsUrl.test(getUrlProperties(str, "pathname")),
    achievementsUrlWithGamerId: (str = window.location.href) => achievementsUrlWithGamerId.test(getUrlProperties(str, ["pathname", "search"])),
    clipsUrl: (str = window.location.href) => clipsUrl.test(getUrlProperties(str, "pathname")),
    dlcUrl: (str = window.location.href) => dlcUrl.test(getUrlProperties(str, "pathname")),
    dlcUrlWithGamerId: (str = window.location.href) => dlcUrlWithGamerId.test(getUrlProperties(str, ["pathname", "search"])),
    challengesUrl: (str = window.location.href) => challengesUrl.test(getUrlProperties(str, "pathname")),
    challengesUrlWithGamerId: (str = window.location.href) => challengesUrlWithGamerId.test(getUrlProperties(str, ["pathname", "search"])),
    individualDlcUrl: (str = window.location.href) => individualDlcUrl.test(getUrlProperties(str, "pathname")),
    individualDlcUrlWithGamerId: (str = window.location.href) => individualDlcUrlWithGamerId.test(getUrlProperties(str, ["pathname", "search"])),
    forumUrl: (str = window.location.href) => gameForumUrl.test(getUrlProperties(str, "pathname")),
    gameForumUrlWithAll: (str = window.location.href) => gameForumUrlWithAll.test(getUrlProperties(str, ["pathname", "search"])),
    gameForumUrlWithCommunity: (str = window.location.href) => gameForumUrlWithCommunity.test(getUrlProperties(str, ["pathname", "search"])),
    gameForumUrlWithGameInfo: (str = window.location.href) => gameForumUrlWithGameInfo.test(getUrlProperties(str, ["pathname", "search"])),
    gameUrl: (str = window.location.href) => gameUrl.test(getUrlProperties(str, "pathname")),
    gamesUrl: (str = window.location.href) => gamesUrl.test(getUrlProperties(str, "pathname")),
    reviewsUrl: (str = window.location.href) => reviewsUrl.test(getUrlProperties(str, "pathname")),
    walkthroughUrl: (str = window.location.href) => walkthroughUrl.test(getUrlProperties(str, "pathname"))
  }
};
const GamerRegex = {
  gamerUrl,
  gamerAchievementsUrl,
  Test: {
    all: (str = window.location.href) => gamerUrl.test(getUrlProperties(str, "pathname")) || gamerAchievementsUrl.test(getUrlProperties(str, "pathname")),
    gamerUrl: (str = window.location.href) => gamerUrl.test(getUrlProperties(str, "pathname")),
    gamerAchievementsUrl: (str = window.location.href) => gamerAchievementsUrl.test(getUrlProperties(str, "pathname"))
  }
};
const AjaxRegex = {
  autosave,
  Test: {
    autosave: (str = window.location.href) => autosave.test(getUrlProperties(str, "pathname"))
  }
};
const StaffRegex = {
  Walkthroughs: {
    editWalkthroughUrl,
    manageWalkthroughUrl,
    manageWalkthroughUrlWithWalkthroughId,
    walkthroughPageUrl,
    walkthroughPreviewUrl,
    walkthroughPreviewUrlWithWalkthroughId,
    walkthroughPagePreviewUrl,
    walkthroughPagePreviewUrlWithPageId,
    Test: {
      all: (str = window.location.href) => editWalkthroughUrl.test(getUrlProperties(str, "pathname")) || manageWalkthroughUrl.test(getUrlProperties(str, "pathname")) || walkthroughPageUrl.test(getUrlProperties(str, "pathname")) || walkthroughPreviewUrl.test(getUrlProperties(str, "pathname")) || walkthroughPagePreviewUrl.test(getUrlProperties(str, "pathname")),
      preview: (str = window.location.href) => walkthroughPreviewUrl.test(getUrlProperties(str, "pathname")) || walkthroughPagePreviewUrl.test(getUrlProperties(str, "pathname")),
      editWalkthroughUrl: (str = window.location.href) => editWalkthroughUrl.test(getUrlProperties(str, "pathname")),
      manageWalkthroughUrl: (str = window.location.href) => manageWalkthroughUrl.test(getUrlProperties(str, "pathname")),
      manageWalkthroughUrlWithWalkthroughId: (str = window.location.href) => manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ["pathname", "search"])),
      walkthroughPageUrl: (str = window.location.href) => walkthroughPageUrl.test(getUrlProperties(str, "pathname")),
      walkthroughPreviewUrl: (str = window.location.href) => walkthroughPreviewUrl.test(getUrlProperties(str, "pathname")),
      walkthroughPreviewUrlWithWalkthroughId: (str = window.location.href) => walkthroughPreviewUrlWithWalkthroughId.test(getUrlProperties(str, ["pathname", "search"])),
      walkthroughPagePreviewUrl: (str = window.location.href) => walkthroughPagePreviewUrl.test(getUrlProperties(str, "pathname")),
      walkthroughPagePreviewUrlWithPageId: (str = window.location.href) => walkthroughPagePreviewUrlWithPageId.test(getUrlProperties(str, ["pathname", "search"]))
    }
  }
};
const ForumRegex = {
  forumsUrl,
  viewBoardUrlWithBoardId,
  viewThreadUrlWithThreadId,
  myTheadsUrl,
  Test: {
    all: (str = window.location.href) => forumsUrl.test(getUrlProperties(str, "pathname")) || viewBoardUrlWithBoardId.test(getUrlProperties(str, ["pathname", "search"])) || viewThreadUrlWithThreadId.test(getUrlProperties(str, ["pathname", "search"])) || myTheadsUrl.test(getUrlProperties(str, "pathname")),
    forumsUrl: (str = window.location.href) => forumsUrl.test(getUrlProperties(str, "pathname")),
    myTheadsUrl: (str = window.location.href) => myTheadsUrl.test(getUrlProperties(str, "pathname")),
    viewBoardUrlWithBoardId: (str = window.location.href) => viewBoardUrlWithBoardId.test(getUrlProperties(str, ["pathname", "search"])),
    viewThreadUrlWithThreadId: (str = window.location.href) => viewThreadUrlWithThreadId.test(getUrlProperties(str, ["pathname", "search"]))
  }
};
const NewsRegex = {
  pollUrl,
  newsUrl,
  Test: {
    pollUrl: (str = window.location.href) => pollUrl.test(getUrlProperties(str, "pathname")),
    newsUrl: (str = window.location.href) => newsUrl.test(getUrlProperties(str, "pathname"))
  }
};
const DatesRegex = {
  today: new RegExp("Today", "i"),
  yesterday: new RegExp("Yesterday", "i")
};
const SentencesRegex = {
  discussWalkthrough: new RegExp("^Please use this thread to discuss the .* walkthrough?.$"),
  walkthroughPublished: new RegExp(
    "^The walkthrough has now been published.(?:\\n\\n)?You can find it here: .* Walkthrough?.$"
  )
};
const ExternalRegex = {
  xboxAchievementsGuide,
  Test: {
    xboxAchievementsGuide: (str = window.location.href) => xboxAchievementsGuide.test(getUrlProperties(str, "pathname"))
  }
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  AchievementsRegex,
  GamesRegex,
  GamerRegex,
  StaffRegex,
  ForumRegex,
  DatesRegex,
  SentencesRegex,
  NewsRegex,
  ExternalRegex
});


/***/ }),

/***/ "./src/helpers/index.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  vN: () => (/* reexport */ applyStickyElementStyle),
  Kp: () => (/* reexport */ deleteMemoizedCorsFetch),
  Nu: () => (/* reexport */ dispatch_event),
  o1: () => (/* reexport */ memoizeCorsFetch),
  FS: () => (/* reexport */ memoizeFetch),
  XK: () => (/* reexport */ template),
  C4: () => (/* reexport */ until),
  TE: () => (/* reexport */ updateMemoizedFetch),
  Dc: () => (/* reexport */ wait)
});

// UNUSED EXPORTS: corsFetch, fetch

// EXTERNAL MODULE: ./src/models/memoize-fetch.ts + 1 modules
var memoize_fetch = __webpack_require__("./src/models/memoize-fetch.ts");
;// CONCATENATED MODULE: ./src/helpers/fetch.ts
/* harmony default export */ const helpers_fetch = (async (url, options = {}) => {
  const opts = Object.assign(
    {
      headers: new Headers(),
      method: "GET"
    },
    options
  );
  const response = await fetch(url, opts);
  if (response.status < 200 || response.status >= 300) {
    throw response;
  }
  return response;
});

;// CONCATENATED MODULE: ./src/helpers/memoize-fetch.ts


const memoize = new memoize_fetch/* MemoizeFetch */.T(helpers_fetch);
const memoizeFetch = memoize.memoizeFetch;
const updateMemoizedFetch = memoize.updateMemoizedFetch;

;// CONCATENATED MODULE: ./src/helpers/cors-fetch.ts
/* harmony default export */ const cors_fetch = (async (url, options = {
  url: ""
}) => {
  options.url = url;
  const opts = Object.assign(
    {
      method: "GET",
      fetch: true
    },
    options
  );
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...opts,
      onload: (response) => resolve(response),
      onerror: (error) => reject(error)
    });
  });
});

;// CONCATENATED MODULE: ./src/helpers/memoize-cors-fetch.ts


const memoize_cors_fetch_memoize = new memoize_fetch/* MemoizeFetch */.T(cors_fetch);
const memoizeCorsFetch = memoize_cors_fetch_memoize.memoizeFetch;
const deleteMemoizedCorsFetch = memoize_cors_fetch_memoize.deleteMemoizedFetch;

;// CONCATENATED MODULE: ./src/helpers/template.ts
const wrapper = document.createElement("template");
const template = (el, opts = {}) => {
  wrapper.appendChild(el);
  let html = el.outerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/{GM_info.script.version}/g, GM_info.script.version || "");
  for (const opt in opts) {
    for (const prop in opts[opt]) {
      const regex = new RegExp(`{${opt}.${prop}}`, "g");
      html = html.replace(regex, opts[opt][prop]);
    }
  }
  wrapper.innerHTML = html;
  const newElement = wrapper.content.firstChild;
  wrapper.innerHTML = "";
  return newElement;
};

;// CONCATENATED MODULE: ./src/helpers/wait.ts
const until = async (f, timeoutMs = 1e4) => {
  return new Promise((resolve) => {
    const timeWas = /* @__PURE__ */ new Date();
    const wait2 = setInterval(() => {
      if (f()) {
        clearInterval(wait2);
        resolve(true);
      } else if (+/* @__PURE__ */ new Date() - +timeWas > timeoutMs) {
        clearInterval(wait2);
        resolve(false);
      }
    }, 20);
  });
};
const wait = async (timeoutMs = 250) => new Promise((resolve) => setTimeout(resolve, timeoutMs));

// EXTERNAL MODULE: ./src/globals/index.ts + 3 modules
var globals = __webpack_require__("./src/globals/index.ts");
// EXTERNAL MODULE: ./src/utilities/html-element-util.ts
var html_element_util = __webpack_require__("./src/utilities/html-element-util.ts");
;// CONCATENATED MODULE: ./src/helpers/sticky.ts


const stickyNavBarEnabled = globals/* stickyHeader */._A.enabled;
const stickyNavBarStuck = globals/* stickyHeader */._A.remainStuck;
let stickyNavBarElement;
const setStickyNavElement = async () => {
  if (stickyNavBarElement) {
    return;
  }
  stickyNavBarElement = stickyNavBarEnabled ? await (0,html_element_util/* waitForElement */.br)(`.${globals/* Constants */.gT.Styles.StickyHeader.featureJs}`) : await (0,html_element_util/* waitForElement */.br)(".header");
};
const applyStickyElementStyle = async (variableProperty, stickyElement, containerElement, opts = {}) => {
  await setStickyNavElement();
  let addAnimation;
  let removeAnimation = [
    globals/* Constants */.gT.Styles.Animations.yShow,
    globals/* Constants */.gT.Styles.Animations.yHide,
    globals/* Constants */.gT.Styles.Animations.yHideNoTransition
  ];
  let topStylePx = opts.paddingFromTop || 0;
  const containerTop = containerElement.getBoundingClientRect().top;
  if (containerTop > 0) {
    topStylePx = 0;
  } else {
    topStylePx += opts.isRelativeToParent ? 0 : Math.abs(containerTop);
    if (stickyNavBarEnabled) {
      topStylePx += stickyNavBarElement.offsetHeight;
      if (!stickyNavBarElement.classList.contains(globals/* Constants */.gT.Styles.Animations.yShow) && !stickyNavBarStuck) {
        addAnimation = opts.noTransitionStyle ? globals/* Constants */.gT.Styles.Animations.yHideNoTransition : globals/* Constants */.gT.Styles.Animations.yHide;
        removeAnimation = [globals/* Constants */.gT.Styles.Animations.yShow];
      } else {
        addAnimation = globals/* Constants */.gT.Styles.Animations.yShow;
        removeAnimation = [globals/* Constants */.gT.Styles.Animations.yHide, globals/* Constants */.gT.Styles.Animations.yHideNoTransition];
      }
    }
  }
  document.documentElement.style.setProperty(variableProperty, `${topStylePx}px`);
  stickyElement.classList.remove(...removeAnimation);
  if (addAnimation) {
    stickyElement.classList.add(addAnimation);
  }
};
/* harmony default export */ const sticky = ({ applyStickyElementStyle });

;// CONCATENATED MODULE: ./src/helpers/dispatch-event.ts
/* harmony default export */ const dispatch_event = ((eventType, element, opts) => {
  const eventOpts = Object.assign(
    {
      bubbles: true,
      cancelable: eventType === "click",
      detail: null
    },
    opts
  );
  if (eventOpts.detail) {
    if (typeof CustomEvent === "function") {
      element.dispatchEvent(new CustomEvent(eventType, eventOpts));
    } else {
      const event = document.createEvent("CustomEvent");
      event.initCustomEvent(eventType, eventOpts.bubbles, eventOpts.cancelable, eventOpts.detail);
      element.dispatchEvent(event);
    }
  } else {
    if (typeof Event === "function") {
      element.dispatchEvent(new Event(eventType, eventOpts));
    } else {
      const event = document.createEvent("Event");
      event.initEvent(eventType, eventOpts.bubbles, eventOpts.cancelable);
      element.dispatchEvent(event);
    }
  }
});

;// CONCATENATED MODULE: ./src/helpers/index.ts










/***/ }),

/***/ "./src/models/memoize-fetch.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  T: () => (/* binding */ MemoizeFetch)
});

// EXTERNAL MODULE: ./src/globals/index.ts + 3 modules
var globals = __webpack_require__("./src/globals/index.ts");
// EXTERNAL MODULE: ./src/utilities/date-util.ts
var date_util = __webpack_require__("./src/utilities/date-util.ts");
;// CONCATENATED MODULE: ./src/models/memoized-fetch.ts
class MemoizedFetch {
  constructor(opts) {
    opts = opts ? opts : { deleteAfter: { value: 7, period: "days" } };
    const now = /* @__PURE__ */ new Date();
    switch (opts.deleteAfter.period) {
      case "seconds":
        this.expiryTime = new Date(now.setSeconds(now.getSeconds() + opts.deleteAfter.value));
        break;
      case "minutes":
        this.expiryTime = new Date(now.setMinutes(now.getMinutes() + opts.deleteAfter.value));
        break;
      case "hours":
        this.expiryTime = new Date(now.setHours(now.getHours() + opts.deleteAfter.value));
        break;
      case "days":
        this.expiryTime = new Date(now.setDate(now.getDate() + opts.deleteAfter.value));
        break;
    }
  }
  setResponse(response) {
    this.response = response;
    return this;
  }
  fromString(json) {
    try {
      const parsedObj = JSON.parse(json);
      this.expiryTime = parsedObj.expiryTime;
      this.response = parsedObj.response;
    } catch (e) {
    }
  }
  toString() {
    return JSON.stringify(this);
  }
}

;// CONCATENATED MODULE: ./src/models/memoize-fetch.ts



class MemoizeFetch {
  constructor(_fetch) {
    this.cachedCalls = globals/* Cache */.Ct.memoize;
    this.memoizeFetch = async (url, fetchOpts, memoizeOptions) => {
      const cachedRequest = this.cachedCalls.get(url);
      if (cachedRequest && (0,date_util/* isBeforeNow */.c)(new Date(cachedRequest.expiryTime))) {
        return cachedRequest.response;
      }
      const response = await this.fetch(url, fetchOpts);
      const body = response instanceof Response ? await response.text() : response.responseText;
      this.cachedCalls.set(url, new MemoizedFetch(memoizeOptions).setResponse(body));
      globals/* Cache */.Ct.memoize = this.cachedCalls;
      return body;
    };
    this.updateMemoizedFetch = (url, body, memoizeOptions) => {
      this.cachedCalls.set(url, new MemoizedFetch(memoizeOptions).setResponse(body));
      globals/* Cache */.Ct.memoize = this.cachedCalls;
    };
    this.deleteMemoizedFetch = (url) => {
      this.cachedCalls.delete(url);
      globals/* Cache */.Ct.memoize = this.cachedCalls;
    };
    this.fetch = _fetch;
  }
}


/***/ }),

/***/ "./src/utilities/date-util.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   J: () => (/* binding */ isValid),
/* harmony export */   c: () => (/* binding */ isBeforeNow)
/* harmony export */ });
const getDate = (date) => typeof date === "string" ? new Date(date) : date;
const isValid = (date) => new Date(getDate(date)).toString().toLowerCase() !== "invalid date";
const isBeforeNow = (date) => /* @__PURE__ */ new Date() < getDate(date);


/***/ }),

/***/ "./src/utilities/html-element-util.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C7: () => (/* binding */ waitForImages),
/* harmony export */   HM: () => (/* binding */ getElementCoordinates),
/* harmony export */   PT: () => (/* binding */ isCheckboxElement),
/* harmony export */   PZ: () => (/* binding */ isTAXListElement),
/* harmony export */   Sn: () => (/* binding */ waitForElements),
/* harmony export */   Wi: () => (/* binding */ isSelectElement),
/* harmony export */   aF: () => (/* binding */ isTAXChildListElement),
/* harmony export */   br: () => (/* binding */ waitForElement),
/* harmony export */   gz: () => (/* binding */ classListContains)
/* harmony export */ });
/* unused harmony export removeAllChildren */
const isSelectElement = (el) => el.nodeName === "SELECT";
const isCheckboxElement = (el) => el.nodeName === "INPUT" && el.type === "checkbox";
const classListContains = (element, classes) => {
  const classArray = Array.isArray(classes) ? classes : [classes];
  for (let i = 0; i < classArray.length; i++) {
    if (element.classList.contains(classArray[i])) {
      return true;
    }
  }
  return false;
};
const waitForElement = (selector, element = document.documentElement, timeoutMS = 1e4) => new Promise((resolve) => {
  if (element === null) {
    return null;
  }
  if (element === document.documentElement) {
    element = document.documentElement;
  }
  if (element.querySelector(selector)) {
    return resolve(element.querySelector(selector));
  }
  let observer;
  const timeout = setTimeout(() => {
    observer.disconnect();
    resolve(null);
  }, timeoutMS);
  observer = new MutationObserver(() => {
    if (element.querySelector(selector)) {
      observer.disconnect();
      clearTimeout(timeout);
      resolve(element.querySelector(selector));
    }
  });
  observer.observe(element, {
    childList: true,
    subtree: true
  });
});
const waitForElements = (selector, element = document.documentElement, timeoutMS = 1e4) => new Promise((resolve) => {
  if (element === null) {
    return null;
  }
  if (element === document.documentElement) {
    element = document.documentElement;
  }
  if (element.querySelector(selector)) {
    return resolve([...element.querySelectorAll(selector)]);
  }
  let observer;
  const timeout = setTimeout(() => {
    observer.disconnect();
    resolve(null);
  }, timeoutMS);
  observer = new MutationObserver(() => {
    if (element.querySelector(selector)) {
      observer.disconnect();
      clearTimeout(timeout);
      resolve([...element.querySelectorAll(selector)]);
    }
  });
  observer.observe(element, {
    childList: true,
    subtree: true
  });
});
const getElementCoordinates = (element) => {
  const box = element.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;
  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;
  return { top: Math.round(top), left: Math.round(left) };
};
const removeAllChildren = (element) => {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
};
const isTAXListElement = (el) => {
  if (el.nodeName !== "DIV" || !el.classList.contains(".frm-lst")) {
    return false;
  }
  return el.querySelector(`#${el.getAttribute("data-list-id")}`) !== null;
};
const isTAXChildListElement = (el) => {
  if (!el.getAttribute("data-for-list")) {
    return false;
  }
  const parent = el.closest(".frm-lst");
  if (parent === null) {
    return false;
  }
  return parent.querySelector(`#${parent.getAttribute("data-list-id")}`) !== null;
};
const waitForImages = (el) => {
  return new Promise((resolve) => {
    const allImgs = [];
    const filtered = [...el.querySelectorAll("img")].filter((imgEl) => {
      if (imgEl.src === "") {
        return false;
      }
      const img = new Image();
      img.src = imgEl.src;
      return !img.complete;
    });
    filtered.forEach((item) => {
      allImgs.push({
        src: item.src,
        element: item
      });
    });
    const allImgsLength = allImgs.length;
    let allImgsLoaded = 0;
    if (allImgsLength === 0) {
      resolve();
    }
    allImgs.forEach((img) => {
      const image = new Image();
      const resolveIfLoaded = () => {
        allImgsLoaded++;
        if (allImgsLoaded === allImgsLength) {
          resolve();
        }
      };
      image.addEventListener("load", resolveIfLoaded);
      image.addEventListener("error", resolveIfLoaded);
      image.src = img.src;
    });
  });
};


/***/ }),

/***/ "./src/utilities/index.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Eh: () => (/* reexport */ allConcurrently),
  gz: () => (/* reexport */ html_element_util/* classListContains */.gz),
  QF: () => (/* reexport */ string_util/* extractAllBetween */.QF),
  _o: () => (/* reexport */ string_util/* extractBetween */._o),
  ej: () => (/* reexport */ getCookie),
  VB: () => (/* reexport */ getDuplicates),
  HM: () => (/* reexport */ html_element_util/* getElementCoordinates */.HM),
  NA: () => (/* reexport */ getValue),
  g$: () => (/* reexport */ string_util/* insertSeperator */.g$),
  PT: () => (/* reexport */ html_element_util/* isCheckboxElement */.PT),
  Wi: () => (/* reexport */ html_element_util/* isSelectElement */.Wi),
  aF: () => (/* reexport */ html_element_util/* isTAXChildListElement */.aF),
  sO: () => (/* reexport */ setValue),
  AM: () => (/* reexport */ string_util/* toBool */.AM),
  Hq: () => (/* reexport */ string_util/* toInt */.Hq),
  br: () => (/* reexport */ html_element_util/* waitForElement */.br),
  Sn: () => (/* reexport */ html_element_util/* waitForElements */.Sn),
  C7: () => (/* reexport */ html_element_util/* waitForImages */.C7)
});

// UNUSED EXPORTS: isBeforeNow, isTAXListElement, isValid, needsPromisifying, removeAllChildren, toDate

;// CONCATENATED MODULE: ./src/utilities/array-util.ts
const getDuplicates = (arr, unique = false) => unique ? [...new Set(arr.filter((e, i, a) => a.indexOf(e) !== i))] : arr.filter((e, i, a) => a.indexOf(e) !== i);

// EXTERNAL MODULE: ./src/utilities/html-element-util.ts
var html_element_util = __webpack_require__("./src/utilities/html-element-util.ts");
;// CONCATENATED MODULE: ./src/utilities/promise-util.ts
const promisify = (fn) => async (...args) => fn(args);
const needsPromisifying = (fn) => {
  if (fn.constructor.name === "AsyncFunction") {
    return false;
  }
  return true;
};
const allConcurrently = async (name, arr, max = 3) => {
  if (arr.length === 0) {
    return Promise.resolve([]);
  }
  let index = 0;
  const results = [];
  const execThread = async () => {
    while (index < arr.length) {
      const curIndex = index++;
      const task = needsPromisifying(arr[curIndex].task) ? promisify(arr[curIndex].task) : arr[curIndex].task;
      console.debug(arr[curIndex].name, `Promisified: ${needsPromisifying(arr[curIndex].task)}`);
      results[curIndex] = await task();
      console.debug(arr[curIndex].name, results[curIndex]);
    }
  };
  const threads = [];
  for (let thread = 0; thread < max; thread++) {
    threads.push(execThread());
  }
  await Promise.all(threads);
  return results;
};

// EXTERNAL MODULE: ./src/utilities/string-util.ts
var string_util = __webpack_require__("./src/utilities/string-util.ts");
;// CONCATENATED MODULE: ./src/utilities/object-util.ts
const getValue = (object, path, defaultValue) => path.split(".").reduce((o, p) => o ? o[p] : defaultValue, object);
const setValue = (object, path, value) => path.split(".").reduce((o, p, i) => o[p] = path.split(".").length === ++i ? value : o[p] || {}, object);

;// CONCATENATED MODULE: ./src/utilities/document-util.ts
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
};
/* harmony default export */ const document_util = ({ getCookie });

;// CONCATENATED MODULE: ./src/utilities/index.ts









/***/ }),

/***/ "./src/utilities/string-util.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AM: () => (/* binding */ toBool),
/* harmony export */   Hq: () => (/* binding */ toInt),
/* harmony export */   QF: () => (/* binding */ extractAllBetween),
/* harmony export */   _o: () => (/* binding */ extractBetween),
/* harmony export */   g$: () => (/* binding */ insertSeperator)
/* harmony export */ });
/* unused harmony export toDate */
/* harmony import */ var _globals_regex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/globals/regex.ts");
/* harmony import */ var _date_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utilities/date-util.ts");


const today = new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0));
const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));
const toInt = (value) => {
  if (value === null || value === void 0) {
    return null;
  }
  if (typeof value === "string") {
    const parsedValue = parseInt(value.replace(/,/g, ""), 10);
    return !isNaN(parsedValue) ? parsedValue : null;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  return typeof value === "number" ? value : null;
};
const toDate = (value) => {
  if (_globals_regex__WEBPACK_IMPORTED_MODULE_0__/* .DatesRegex */ .BL.today.test(value)) {
    return today;
  }
  if (_globals_regex__WEBPACK_IMPORTED_MODULE_0__/* .DatesRegex */ .BL.yesterday.test(value)) {
    return yesterday;
  }
  return (0,_date_util__WEBPACK_IMPORTED_MODULE_1__/* .isValid */ .J)(value) ? new Date(value) : null;
};
const toBool = (str) => {
  if (str === null || str === void 0) {
    return null;
  }
  if (typeof str === "string") {
    return str.toLowerCase() === "true" ? true : str.toLowerCase() === "false" ? false : null;
  }
  if (typeof str === "number") {
    return str === 1 ? true : str === 0 ? false : null;
  }
  return typeof str === "boolean" ? str : null;
};
const extractBetween = (between, str) => {
  const regex = new RegExp(`${between}(.*?)${between}`);
  const matches = str.match(regex);
  return matches ? matches[1] : str;
};
const extractAllBetween = (between, str) => {
  const regex = new RegExp(`${between}(.*?)${between}`, "g");
  const matches = str.match(regex);
  return matches ? matches.map((str2) => str2.replace(between, "")) : [str];
};
const insertSeperator = (value, seperator = ",") => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  toInt,
  toDate,
  toBool,
  extractBetween,
  extractAllBetween,
  insertSeperator
});


/***/ }),

/***/ "./src/features/forum-improvements/walkthroughs/walkthroughs.hbs":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = "<section class=\"purple js-ta-x-ask-loader-container ta-x-ask-loader-container js-ta-x-forum-improvements-walkthroughs-show-owner-progress ta-x-forum-improvements-walkthroughs-show-owner-progress\"><div>Walkthrough Information</div><article><div class=\"ta-x-article-loader\"><p>Please wait, loading.</p><svg viewbox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z\" fill=\"currentColor\"></path></svg></div><div class=\"js-ta-x-ask-loader-ask ta-x-ask-loader-ask ta-x-hide\"><p>Can't automate them all sadly! Please enter a direct link to the walkthrough page to link this thread to the walkthrough, I'll remember it next time!</p><div><label class=\"small\">Walkthrough Url</label><input class=\"textbox cs-n js-ta-x-ask-loader-ask-input\" id=\"txtForumImprovementsWalkthroughsShowOwnerProgress\" name=\"txtForumImprovementsWalkthroughsShowOwnerProgress\"></div><input class=\"button js-ta-x-ask-loader-ask-button\" id=\"btnForumImprovementsWalkthroughsShowOwnerProgressSave\" name=\"btnForumImprovementsWalkthroughsShowOwnerProgressSave\" type=\"submit\" value=\"Save\"></div></article></section>";
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/.pnpm/ajax-interceptor@1.0.1/node_modules/ajax-interceptor/index.js
var ajax_interceptor = __webpack_require__("./node_modules/.pnpm/ajax-interceptor@1.0.1/node_modules/ajax-interceptor/index.js");
// EXTERNAL MODULE: ./src/globals/index.ts + 3 modules
var globals = __webpack_require__("./src/globals/index.ts");
// EXTERNAL MODULE: ./src/utilities/index.ts + 4 modules
var utilities = __webpack_require__("./src/utilities/index.ts");
;// CONCATENATED MODULE: ./src/components/pub-sub.ts
function PubSub() {
  const handlers = {};
  return {
    publish: (event, msg) => {
      (handlers[event] ?? []).forEach((h) => h(msg));
    },
    subscribe: (event, callback) => {
      const list = handlers[event] ?? [];
      list.push(callback);
      handlers[event] = list;
      return callback;
    },
    unsubscribe: (event, callback) => {
      let list = handlers[event] ?? [];
      list = list.filter((h) => h !== callback);
      handlers[event] = list;
    }
  };
}
/* harmony default export */ const pub_sub = (PubSub());

// EXTERNAL MODULE: ./src/helpers/index.ts + 8 modules
var helpers = __webpack_require__("./src/helpers/index.ts");
;// CONCATENATED MODULE: ./src/components/accordion.ts




const accordion = () => {
  document.addEventListener("click", ({ target }) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!target.classList.contains(globals/* Constants */.gT.Styles.Components.accordion)) {
      return;
    }
    target.classList.toggle("expanded");
    if (target.hasAttribute("data-checkbox-accordion")) {
      const toggle = target.querySelector("input");
      toggle.checked = target.classList.contains("expanded");
      (0,helpers/* dispatchEvent */.Nu)("change", toggle);
    }
    const content = target.nextElementSibling;
    const parentBodyHeight = content.style.maxHeight ? -content.scrollHeight : content.scrollHeight;
    content.style.maxHeight ? content.style.maxHeight = null : content.style.maxHeight = `${content.scrollHeight}px`;
    const parentAccordionBody = target.closest("[data-parent-accordion-body]");
    if (parentAccordionBody) {
      parentAccordionBody.style.maxHeight = `${(0,utilities/* toInt */.Hq)(parentAccordionBody.style.maxHeight) + parentBodyHeight}px`;
    }
  });
  pub_sub.subscribe("accordion:setMaxHeight", (content) => {
    if (!content.style.maxHeight) {
      return;
    }
    content.style.maxHeight = `${content.scrollHeight}px`;
  });
  pub_sub.subscribe("accordion:toggleState", (header) => {
    header.classList.toggle("expanded");
    const content = header.nextElementSibling;
    content.style.maxHeight = `${content.scrollHeight}px`;
  });
};
/* harmony default export */ const components_accordion = ((/* unused pure expression or super */ null && (accordion)));

;// CONCATENATED MODULE: ./src/components/tabs.ts


const switchTab = (selectedTab) => {
  if (selectedTab.classList.contains(globals/* Constants */.gT.Styles.Components.Tab.tabSelected)) {
    return;
  }
  const parentTabContainer = selectedTab.closest(`.${globals/* Constants */.gT.Styles.Components.Tab.featureJs}`);
  const prevSelected = parentTabContainer.querySelector(
    `.${globals/* Constants */.gT.Styles.Components.Tab.tabSelected}`
  );
  const prevContent = parentTabContainer.querySelector("[data-tab-visible]");
  const nextSelected = parentTabContainer.querySelector(selectedTab.getAttribute("data-tab-id"));
  if (prevSelected && prevContent) {
    prevSelected.classList.toggle(globals/* Constants */.gT.Styles.Components.Tab.tabSelected);
    prevContent.removeAttribute("data-tab-visible");
  }
  selectedTab.classList.toggle(globals/* Constants */.gT.Styles.Components.Tab.tabSelected);
  nextSelected.setAttribute("data-tab-visible", "");
};
const listen = () => {
  let container;
  let isDown = false;
  let startX;
  let scrollLeft;
  let momentumID;
  let velX = 0;
  const mouseUpEvent = () => {
    isDown = false;
    container.classList.remove(globals/* Constants */.gT.Styles.Components.Tab.tabScroll);
    beginMomentumTracking();
    removeListeners();
  };
  const mouseLeaveEvent = () => {
    isDown = false;
    container.classList.remove(globals/* Constants */.gT.Styles.Components.Tab.tabScroll);
    removeListeners();
  };
  const mouseMoveEvent = (e) => {
    if (!isDown) {
      return;
    }
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 3;
    const prevScrollLeft = container.scrollLeft;
    container.scrollLeft = scrollLeft - walk;
    velX = container.scrollLeft - prevScrollLeft;
  };
  const wheelEvent = () => {
    cancelMomentumTracking();
  };
  const beginMomentumTracking = () => {
    cancelMomentumTracking();
    momentumID = requestAnimationFrame(momentumLoop);
  };
  const cancelMomentumTracking = () => {
    cancelAnimationFrame(momentumID);
  };
  const momentumLoop = () => {
    container.scrollLeft += velX;
    velX *= 0.95;
    if (Math.abs(velX) > 0.5) {
      momentumID = requestAnimationFrame(momentumLoop);
    }
  };
  const removeListeners = () => {
    container.removeEventListener("mouseup", mouseUpEvent);
    container.removeEventListener("mouseleave", mouseLeaveEvent);
    container.removeEventListener("mousemove", mouseMoveEvent);
    container.removeEventListener("wheel", wheelEvent);
  };
  document.addEventListener("mousedown", (e) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    container = e.target.closest(`.${globals/* Constants */.gT.Styles.Components.Tab.tabLinkContainer}`);
    if (!container) {
      return;
    }
    isDown = true;
    container.classList.add(globals/* Constants */.gT.Styles.Components.Tab.tabScroll);
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    cancelMomentumTracking();
    container.addEventListener("mouseup", mouseUpEvent);
    container.addEventListener("mouseleave", mouseLeaveEvent);
    container.addEventListener("mousemove", mouseMoveEvent);
    container.addEventListener("wheel", wheelEvent);
  });
};
const tabs = () => {
  document.addEventListener("click", ({ target }) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!target.classList.contains(globals/* Constants */.gT.Styles.Components.Tab.tabLink)) {
      return;
    }
    switchTab(target);
  });
  pub_sub.subscribe("tabs:set", (tab) => {
    switchTab(tab);
  });
  listen();
};
/* harmony default export */ const components_tabs = ((/* unused pure expression or super */ null && (tabs)));

;// CONCATENATED MODULE: ./src/views/components/snackbar.html
// Module
var code = "<div class=\"ta-x-snackbar js-ta-x-snackbar\"><h2></h2></div>";
// Exports
/* harmony default export */ const snackbar = (code);
// EXTERNAL MODULE: ./src/utilities/html-element-util.ts
var html_element_util = __webpack_require__("./src/utilities/html-element-util.ts");
;// CONCATENATED MODULE: ./src/components/snackbar.ts




const snackbar_snackbar = async () => {
  if (!await (0,html_element_util/* waitForElement */.br)("body")) {
    return;
  }
  const parsedDocument = new DOMParser().parseFromString(snackbar, "text/html");
  document.body.appendChild(parsedDocument.querySelector(`.${globals/* Constants */.gT.Styles.Components.snackbar}`));
  const snackbar2 = document.querySelector(`.${globals/* Constants */.gT.Styles.Components.snackbar}`);
  const textContainer = snackbar2.querySelector("h2");
  pub_sub.subscribe("snackbar:show", ({ text, type }) => {
    if (!snackbar2) {
      return;
    }
    textContainer.innerText = text;
    textContainer.classList.add(type);
    snackbar2.classList.toggle(globals/* Constants */.gT.Styles.Components.showSnackbar);
    setTimeout(() => {
      snackbar2.classList.toggle(globals/* Constants */.gT.Styles.Components.showSnackbar);
      textContainer.classList.remove(type);
    }, 3e3);
  });
};
/* harmony default export */ const components_snackbar = ((/* unused pure expression or super */ null && (snackbar_snackbar)));

;// CONCATENATED MODULE: ./src/components/index.ts





// EXTERNAL MODULE: ./src/utilities/string-util.ts
var string_util = __webpack_require__("./src/utilities/string-util.ts");
;// CONCATENATED MODULE: ./src/models/conditional-render.ts


class ConditionalRender {
  static fromString(json) {
    if (!json || json.length === 0) {
      return null;
    }
    const parsedObj = JSON.parse(json);
    if (Array.isArray(parsedObj)) {
      const conditionalRender = new ConditionalRender();
      conditionalRender.conditions = parsedObj.map((cdr) => ConditionalRender.fromObject(cdr));
      return conditionalRender;
    } else {
      return ConditionalRender.fromObject(parsedObj);
    }
  }
  static fromObject(obj) {
    const conditionalRender = new ConditionalRender();
    try {
      conditionalRender.conditions = null;
      conditionalRender.selector = obj.selector;
      conditionalRender.checked = (0,string_util/* toBool */.AM)(obj.checked);
      conditionalRender.value = obj.value ? obj.value.split(",") : null;
    } catch (e) {
      conditionalRender.conditions = null;
      conditionalRender.selector = null;
      conditionalRender.checked = null;
      conditionalRender.value = null;
    }
    return conditionalRender;
  }
  isValid() {
    return this.conditions ? true : this.selector !== null && (this.checked !== null || this.value !== null);
  }
  toString() {
    return JSON.stringify(this);
  }
  test(el) {
    let method = null;
    if (!this.isValid()) {
      return method;
    }
    if (this.conditions) {
      return this.conditions.every((cdr) => cdr.test(el) === "remove") ? "remove" : "add";
    } else {
      const setting = el.querySelector(this.selector);
      if ((0,html_element_util/* isCheckboxElement */.PT)(setting)) {
        method = setting.checked === this.checked ? "remove" : "add";
      } else if ((0,html_element_util/* isSelectElement */.Wi)(setting)) {
        if ((0,string_util/* toBool */.AM)(setting.getAttribute("data-is-array"))) {
          method = this.value.some(
            (val) => setting.value.split(setting.getAttribute("data-array-split")).includes(val)
          ) ? "remove" : "add";
        } else {
          method = this.value.includes(setting.value) ? "remove" : "add";
        }
      }
      return method;
    }
  }
}

// EXTERNAL MODULE: ./src/models/memoize-fetch.ts + 1 modules
var memoize_fetch = __webpack_require__("./src/models/memoize-fetch.ts");
;// CONCATENATED MODULE: ./src/models/list-setting.ts

class ListSetting {
  constructor(element) {
    if ((0,html_element_util/* isTAXChildListElement */.aF)(element)) {
      this.parent = element.closest(".frm-lst");
    } else if ((0,html_element_util/* isTAXListElement */.PZ)(element)) {
      this.parent = element;
    }
    this.listId = this.parent.getAttribute("data-list-id");
    this.list = this.parent.querySelector(`#${this.listId}`);
    this.input = this.parent.querySelector(`#${this.listId}-input`);
  }
}

;// CONCATENATED MODULE: ./src/models/index.ts





;// CONCATENATED MODULE: ./src/features/settings-menu/body.hbs
// Module
var body_code = "<div class=\"js-ta-x-settings-menu-wrench gamer-page\" aria-haspopup=\"true\"><i class=\"fa fa-wrench\"></i></div><div class=\"js-ta-x-settings-menu ta-x-settings-menu ta-x-hide\"><div class=\"middle\"><div class=\"wrap\"><div class=\"labels\"><label class=\"js-ta-x-settings-menu-close close\"><i class=\"fa fa-close\"></i></label></div><div class=\"contents\"><div class=\"contents open ta-x-settings-menu-settings\"><div class=\"t-settings js-ta-x-settings-menu-settings ta-x-settings-menu-settings-item ta-x-settings-menu-settings-item-show\"><div class=\"ta-x-checkbox\" data-render-condition><label>Sticky Header</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"stickyHeader.enabled\" id=\"chkStickyHeader\" name=\"chkStickyHeader\" type=\"checkbox\"><label for=\"chkStickyHeader\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStickyHeader\", \"checked\": true }'>This feature may cause some sticky elements to look buggy. Let me know what you spot!</p></div><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStickyHeader\", \"checked\": true }'><label>Remain Stuck</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"stickyHeader.remainStuck\" id=\"chkStickyHeaderRemainStuck\" name=\"chkStickyHeaderRemainStuck\" type=\"checkbox\"><label for=\"chkStickyHeaderRemainStuck\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition style=\"border:0\"><label>Emojis</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"emojis.enabled\" id=\"chkEmojis\" name=\"chkEmojis\" type=\"checkbox\"><label for=\"chkEmojis\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion\" style=\"padding-top:0\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Forum Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.enabled\" id=\"chkForumImprovements\" name=\"chkForumImprovements\" type=\"checkbox\"><label for=\"chkForumImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Enable Thread Filter</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.forumImprovementsThreadFilter\" id=\"chkForumImprovementsForumImprovementsThreadFilter\" name=\"chkForumImprovementsForumImprovementsThreadFilter\" type=\"checkbox\"><label for=\"chkForumImprovementsForumImprovementsThreadFilter\"></label></div></div><div class=\"ta-x-listbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkForumImprovementsForumImprovementsThreadFilter\", \"checked\": true }'><label>Keywords</label><div class=\"frm-grp frm-lst\" data-list-id=\"txtThreadKeywordFilter\" data-template-id=\"#ta-x-template-forum-improvements-thread-filter-keywords\"><template id=\"ta-x-template-forum-improvements-thread-filter-keywords\"><li><div><p data-value=\"{listSetting.value}\">{listSetting.value}</p><a data-for-list=\"{listSetting.id}\" data-remove href=\"#\" onclick=\"event.preventDefault()\"> Remove </a></div></li></template><input class=\"textbox cs-n\" id=\"txtThreadKeywordFilter-input\" name=\"txtThreadKeywordFilte\"><input value=\"Add Filter\" data-add data-array-split=\",\" data-config-path=\"forumImprovements.threadFilterKeywords\" data-for-list=\"txtThreadKeywordFilter\" data-is-array=\"true\" onclick=\"event.preventDefault()\" type=\"submit\"><ul class=\"item-list\" id=\"txtThreadKeywordFilter\"></ul></div></div></div><div data-render-condition='{ \"selector\": \"#chkForumImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> My Threads </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Override Forum Settings</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.myThreads.myThreadsForumOverride\" id=\"chkForumImprovementsMyThreadsForumOverride\" name=\"chkForumImprovementsMyThreadsForumOverride\" type=\"checkbox\"><label for=\"chkForumImprovementsMyThreadsForumOverride\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkForumImprovementsMyThreadsForumOverride\", \"checked\": false }'>Some settings will be inherited from Forums.</p></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkForumImprovementsMyThreadsForumOverride\", \"checked\": true }'><label>Enable Thread Filter</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.myThreads.myThreadsThreadFilter\" id=\"chkForumImprovementsMyThreadsThreadFilter\" name=\"chkForumImprovementsMyThreadsThreadFilter\" type=\"checkbox\"><label for=\"chkForumImprovementsMyThreadsThreadFilter\"></label></div></div><div class=\"ta-x-listbox ta-x-hide\" data-render-condition='[\n                    { \"selector\": \"#chkForumImprovementsMyThreadsForumOverride\", \"checked\": true },\n                    { \"selector\": \"#chkForumImprovementsMyThreadsThreadFilter\", \"checked\": true }\n                ]'><label>Keywords</label><div class=\"frm-grp frm-lst\" data-list-id=\"txtForumImprovementsMyThreadsThreadKeywordFilter\" data-template-id=\"#ta-x-template-forum-improvements-thread-filter-keywords\"><template id=\"ta-x-template-forum-improvements-thread-filter-keywords\"><li><div><p data-value=\"{listSetting.value}\">{listSetting.value}</p><a data-for-list=\"{listSetting.id}\" data-remove href=\"#\" onclick=\"event.preventDefault()\"> Remove </a></div></li></template><input class=\"textbox cs-n\" id=\"txtForumImprovementsMyThreadsThreadKeywordFilter-input\" name=\"txtForumImprovementsMyThreadsThreadKeywordFilte\"><input value=\"Add Filter\" data-add data-array-split=\",\" data-config-path=\"forumImprovements.myThreads.threadFilterKeywords\" data-for-list=\"txtForumImprovementsMyThreadsThreadKeywordFilter\" data-is-array=\"true\" onclick=\"event.preventDefault()\" type=\"submit\"><ul class=\"item-list\" id=\"txtForumImprovementsMyThreadsThreadKeywordFilter\"></ul></div></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkForumImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Walkthroughs </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Show Owner/Progress</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.walkthroughs.showOwnerProgress\" id=\"chkForumImprovementsShowOwnerProgress\" name=\"chkForumImprovementsShowOwnerProgress\" type=\"checkbox\"><label for=\"chkForumImprovementsShowOwnerProgress\"></label></div></div></div></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Gamer Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamerImprovements.enabled\" id=\"chkGamerImprovements\" name=\"chkGamerImprovements\" type=\"checkbox\"><label for=\"chkGamerImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div class=\"ta-x-checkbox\" data-render-condition><label>Add Group By Game Button</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamerImprovements.achievements.addGroupByGameButton\" id=\"chkGamerImprovementsGroupByGameButton\" name=\"chkGamerImprovementsGroupByGameButton\" type=\"checkbox\"><label for=\"chkGamerImprovementsGroupByGameButton\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamerImprovementsGroupByGameButton\", \"checked\": true }'>This feature is unstyled, let me know if you have any ideas for how to make this look!</p></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Games Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.enabled\" id=\"chkGamesImprovements\" name=\"chkGamesImprovements\" type=\"checkbox\"><label for=\"chkGamesImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div class=\"ta-x-checkbox\" data-render-condition style=\"border:0\"><label>Add Highlight Games Not In Collection Button</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.games.addHighlightGamesNotInCollectionButton\" id=\"chkGamesImprovementsHighlightGamesNotInCollectionButton\" name=\"chkGamesImprovementsHighlightGamesNotInCollectionButton\" type=\"checkbox\"><label for=\"chkGamesImprovementsHighlightGamesNotInCollectionButton\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsHighlightGamesNotInCollectionButton\", \"checked\": true }'>This feature is unstyled, let me know if you have any ideas for how to make this look!</p></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Achievements </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Show progress as XX/XX</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.achievements.gameAchievementsIndividualProgress\" id=\"chkGamesImprovementsGameAchievementsIndividualProgress\" name=\"chkGamesImprovementsGameAchievementsIndividualProgress\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameAchievementsIndividualProgress\"></label></div></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Game Achievements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.achievements.gameAchievementsDefaultStatus\" id=\"chkGamesImprovementsGameAchievementsDefaultStatus\" name=\"chkGamesImprovementsGameAchievementsDefaultStatus\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameAchievementsDefaultStatus\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameAchievementsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.achievements.gameAchievementsDefaultStatusValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameAchievementsDefaultStatusValue\" name=\"selGamesImprovementsGameAchievementsDefaultStatusValue\"><option selected=\"selected\" value=\"rdoAllAchievements\">All</option><option selected=\"selected\" value=\"rdoWonAchievements\">Won</option><option selected=\"selected\" value=\"rdoNotWonAchievements\">Not Won</option></select></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Include Guides From XboxAchievements.com</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.achievements.gameAchievementsShowXboxAchievementGuides\" id=\"chkGamesImprovementsGameAchievementsShowXboxAchievementGuides\" name=\"chkGamesImprovementsGameAchievementsShowXboxAchievementGuides\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameAchievementsShowXboxAchievementGuides\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameAchievementsShowXboxAchievementGuides\", \"checked\": true }'>This feature is tempermental, let me know if you have any issues!</p></div></div></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Challenges </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Override Achievement Settings</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.challenges.gameChallengesOverride\" id=\"chkGamesImprovementsGameChallengesOverride\" name=\"chkGamesImprovementsGameChallengesOverride\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameChallengesOverride\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameChallengesOverride\", \"checked\": false }'>Some settings will be inherited from Achievements.</p></div><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameChallengesOverride\", \"checked\": true }'><label>Show progress as XX/XX</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.challenges.gameChallengesIndividualProgress\" id=\"chkGamesImprovementsGameChallengesIndividualProgress\" name=\"chkGamesImprovementsGameChallengesIndividualProgress\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameChallengesIndividualProgress\"></label></div></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Game Challenges</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.challenges.gameChallengesDefaultStatus\" id=\"chkGamesImprovementsGameChallengesDefaultStatus\" name=\"chkGamesImprovementsGameChallengesDefaultStatus\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameChallengesDefaultStatus\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameChallengesDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.challenges.gameChallengesDefaultStatusValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameChallengesDefaultStatusValue\" name=\"selGamesImprovementsGameChallengesDefaultStatusValue\"><option selected=\"selected\" value=\"rdoAllChallenges\">All</option><option selected=\"selected\" value=\"rdoWonChallenges\">Won</option><option selected=\"selected\" value=\"rdoNotWonChallenges\">Not Won</option></select></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Clips </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Game Clips</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.clips.gameClipsDefaultStatus\" id=\"chkGamesImprovementsGameClipsDefaultStatus\" name=\"chkGamesImprovementsGameClipsDefaultStatus\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameClipsDefaultStatus\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'>This feature will cause multiple page reloads if you change more than one default!</p></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultRecordedByValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultRecordedByValue\" name=\"selGamesImprovementsGameClipsDefaultRecordedByValue\"><option selected=\"selected\" value>Anyone</option><option value=\"My friends\" selected=\"selected\">My friends</option></select></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultSavedByValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultSavedByValue\" name=\"selGamesImprovementsGameClipsDefaultSavedByValue\"><option selected=\"selected\" value>Anyone</option><option selected=\"selected\" value=\"Gamer\">Gamer</option><option selected=\"selected\" value=\"Xbox\">Xbox</option></select></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultRecordedValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultRecordedValue\" name=\"selGamesImprovementsGameClipsDefaultRecordedValue\"><option selected=\"selected\" value=\"7\">This week</option><option selected=\"selected\" value=\"30\">This month</option><option selected=\"selected\" value=\"365\">This year</option><option selected=\"selected\" value=\"0\">All</option></select></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultSortByValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultSortByValue\" name=\"selGamesImprovementsGameClipsDefaultSortByValue\"><option value=\"Most viewed\" selected=\"selected\">Most viewed</option><option value=\"Most favourited\" selected=\"selected\">Most favourited</option><option value=\"Most commented\" selected=\"selected\">Most commented</option><option selected=\"selected\" value=\"Longest\">Longest</option><option selected=\"selected\" value=\"GamerTag\">GamerTag</option></select></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> DLC </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Override Achievement Settings</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.dlc.gameDLCOverride\" id=\"chkGamesImprovementsGameDLCOverride\" name=\"chkGamesImprovementsGameDLCOverride\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameDLCOverride\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameDLCOverride\", \"checked\": false }'>Some settings will be inherited from Achievements.</p></div><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameDLCOverride\", \"checked\": true }'><label>Show progress as XX/XX</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.dlc.gameDLCIndividualProgress\" id=\"chkGamesImprovementsGameDLCIndividualProgress\" name=\"chkGamesImprovementsGameDLCIndividualProgress\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameDLCIndividualProgress\"></label></div></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameDLCOverride\", \"checked\": true }'><label>Default Status for Game DLC Achievements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.dlc.gameDLCDefaultStatus\" id=\"chkGamesImprovementsGameDLCDefaultStatus\" name=\"chkGamesImprovementsGameDLCDefaultStatus\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameDLCDefaultStatus\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='[\n                { \"selector\": \"#chkGamesImprovementsGameDLCOverride\", \"checked\": true },\n                { \"selector\": \"#chkGamesImprovementsGameDLCDefaultStatus\", \"checked\": true }]'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.dlc.gameDLCDefaultStatusValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameDLCDefaultStatusValue\" name=\"selGamesImprovementsGameDLCDefaultStatusValue\"><option selected=\"selected\" value=\"rdoAllAchievements\">All</option><option selected=\"selected\" value=\"rdoWonAchievements\">Won</option><option selected=\"selected\" value=\"rdoNotWonAchievements\">Not Won</option></select></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Forums </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Override Forum Settings</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.forums.gameForumsForumOverride\" id=\"chkGamesImprovementsGameForumsForumOverride\" name=\"chkGamesImprovementsGameForumsForumOverride\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameForumsForumOverride\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameForumsForumOverride\", \"checked\": false }'>Some settings will be inherited from Forums.</p></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameForumsForumOverride\", \"checked\": true }'><label>Enable Thread Filter</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.forums.gameForumsThreadFilter\" id=\"chkGameImprovementsGameForumsThreadFilter\" name=\"chkGameImprovementsGameForumsThreadFilter\" type=\"checkbox\"><label for=\"chkGameImprovementsGameForumsThreadFilter\"></label></div></div><div class=\"ta-x-listbox ta-x-hide\" data-render-condition='[\n                    { \"selector\": \"#chkGamesImprovementsGameForumsForumOverride\", \"checked\": true },\n                    { \"selector\": \"#chkGameImprovementsGameForumsThreadFilter\", \"checked\": true }\n                ]'><label>Keywords</label><div class=\"frm-grp frm-lst\" data-list-id=\"txtGameImprovementsGameForumsThreadKeywordFilter\" data-template-id=\"#ta-x-template-forum-improvements-thread-filter-keywords\"><template id=\"ta-x-template-forum-improvements-thread-filter-keywords\"><li><div><p data-value=\"{listSetting.value}\">{listSetting.value}</p><a data-for-list=\"{listSetting.id}\" data-remove href=\"#\" onclick=\"event.preventDefault()\"> Remove </a></div></li></template><input class=\"textbox cs-n\" id=\"txtGameImprovementsGameForumsThreadKeywordFilter-input\" name=\"txtGameImprovementsGameForumsThreadKeywordFilte\"><input value=\"Add Filter\" data-add data-array-split=\",\" data-config-path=\"gamesImprovements.forums.threadFilterKeywords\" data-for-list=\"txtGameImprovementsGameForumsThreadKeywordFilter\" data-is-array=\"true\" onclick=\"event.preventDefault()\" type=\"submit\"><ul class=\"item-list\" id=\"txtGameImprovementsGameForumsThreadKeywordFilter\"></ul></div></div></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Thread Type for Game Forums</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.forums.gameForumsDefaultThread\" id=\"chkGamesImprovementsGameForumsDefaultThread\" name=\"chkGamesImprovementsGameForumsDefaultThread\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameForumsDefaultThread\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameForumsDefaultThread\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.forums.gameForumsDefaultThreadValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameForumsDefaultThreadValue\" name=\"selGamesImprovementsGameForumsDefaultThreadValue\"><option selected=\"selected\" value=\"all\">All Threads</option><option selected=\"selected\" value=\"community\">Community Threads</option><option selected=\"selected\" value=\"gameinfo\">Game Info Threads</option></select></div></div></div></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>News Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"newsImprovements.enabled\" id=\"chkNewsImprovements\" name=\"chkNewsImprovements\" type=\"checkbox\"><label for=\"chkNewsImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div data-render-condition='{ \"selector\": \"#chkNewsImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Sales </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Sort Sales By</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"newsImprovements.sales.autoSortBy\" id=\"chkNewsImprovementsSalesAutoSortBy\" name=\"chkNewsImprovementsSalesAutoSortBy\" type=\"checkbox\"><label for=\"chkNewsImprovementsSalesAutoSortBy\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkNewsImprovementsSalesAutoSortBy\", \"checked\": true }'><select class=\"dropdown\" data-array-split=\",\" data-config-path=\"newsImprovements.sales.autoSortByValue\" data-is-array=\"true\" id=\"selNewsImprovementsSalesAutoSortByValue\" name=\"selNewsImprovementsSalesAutoSortByValue\"><option selected=\"selected\" value=\"product,game\">Product</option><option selected=\"selected\" value=\"sale-price\">Sale Price</option><option selected=\"selected\" value=\"discount\">Discount</option><option selected=\"selected\" value=\"completion-time\">Completion Time</option><option selected=\"selected\" value=\"ta-ratio\">TA Ratio</option></select></div><div data-render-condition='{ \"selector\": \"#chkNewsImprovementsSalesAutoSortBy\", \"checked\": true }' class=\"ta-x-hide\"><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#selNewsImprovementsSalesAutoSortByValue\", \"value\": \"completion-time,ta-ratio\" }'>This option may not work on some tables. Let me know what you spot!</p></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkNewsImprovementsSalesAutoSortBy\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"newsImprovements.sales.autoSortByOrder\" data-is-array=\"false\" id=\"selNewsImprovementsSalesAutoSortByOrder\" name=\"selNewsImprovementsSalesAutoSortByOrder\"><option selected=\"selected\" value=\"asc\">Ascendening</option><option selected=\"selected\" value=\"desc\">Descending</option></select></div></div></div></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Staff Walkthrough Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.enabled\" id=\"chkStaffWalkthroughImprovements\" name=\"chkStaffWalkthroughImprovements\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Edit Walkthrough </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Improved Image Selector</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.editWalkthrough.improvedImageSelector\" id=\"chkStaffWalkthroughImprovementsImproveImageSelector\" name=\"chkStaffWalkthroughImprovementsImproveImageSelector\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsImproveImageSelector\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Auto Save Notifications</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.editWalkthrough.autoSaveNotification\" id=\"chkStaffWalkthroughImprovementsAutoSaveNotification\" name=\"chkStaffWalkthroughImprovementsAutoSaveNotification\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsAutoSaveNotification\"></label></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Manage Walkthrough </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Clickable Table Links</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.clickableTableLinks\" id=\"chkStaffWalkthroughImprovementsClickableTableLinks\" name=\"chkStaffWalkthroughImprovementsClickableTableLinks\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsClickableTableLinks\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Add Missing Buttons</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.addMissingButtons\" id=\"chkStaffWalkthroughImprovementsAddPageButton\" name=\"chkStaffWalkthroughImprovementsAddPageButton\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsAddPageButton\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Auto Select First Walkthrough</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.autoSelectFirst\" id=\"chkStaffWalkthroughImprovementsAutoSelectFirst\" name=\"chkStaffWalkthroughImprovementsAutoSelectFirst\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsAutoSelectFirst\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\", \"checked\": true }'>This feature runs after the default status has been set.</p></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Manage Walkthrough</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.manageWalkthroughDefaultStatus\" id=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\" name=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.manageWalkthroughDefaultStatusValue\" data-is-array=\"false\" id=\"selStaffWalkthroughImprovementsManageWalkthroughDefaultStatusValue\" name=\"selStaffWalkthroughImprovementsManageWalkthroughDefaultStatusValue\"><option selected=\"selected\" value=\"-1\">(All)</option><option selected=\"selected\" value=\"New\">New</option><option value=\"In progress\" selected=\"selected\">In progress</option><option value=\"Ready for review\" selected=\"selected\">Ready for review</option><option value=\"Ready for publish\" selected=\"selected\">Ready for publish</option><option selected=\"selected\" value=\"Published\">Published</option><option value=\"New owner required\" selected=\"selected\">New owner required</option></select></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Walkthrough Page </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Stick Page History To Left</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.stickyPageHistory\" id=\"chkStaffWalkthroughImprovementsStickyPageHistory\" name=\"chkStaffWalkthroughImprovementsStickyPageHistory\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsStickyPageHistory\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Move Buttons To The Left</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.moveButtonsToLeft\" id=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\" name=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Add Walkthrough Team Button</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.walkthroughTeamButton\" id=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\" name=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Highlight Page Locked</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.highlightPageLocked\" id=\"chkStaffWalkthroughImprovementsHighlightPageLocked\" name=\"chkStaffWalkthroughImprovementsHighlightPageLocked\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsHighlightPageLocked\"></label></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Walkthrough Preview </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Populate Side Column Content</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPreview.populateAsideContent\" id=\"chkStaffWalkthroughImprovementsPopulateAsideContent\" name=\"chkStaffWalkthroughImprovementsPopulateAsideContent\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsPopulateAsideContent\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovementsPopulateAsideContent\", \"checked\": true }'>This feature only supports \"In Progress\", \"Ready for review\" and \"Ready for publish\" walkthroughs, let me know if you want it to support others!</p></div></div></div></div></div></div><div class=\"t-settings js-ta-x-settings-menu-changelog ta-x-settings-menu-settings-item\"><div class=\"ta-x-settings-menu-changelog-wrapper\"><h1>Changelog</h1><h2>3.0.0</h2><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>Behind the scenes, Changed from ts-loader to esbuild-loader,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Behind the scenes, finally got the vscode debugger working,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Behind the scenes, setup github actions to commit dist and push tags,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Behind the scenes, updated to latest node,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Fixed walkthrough preview aside content not loading,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Fixed XboxAchievements not working anymore,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Fixed XboxAchievements showing on the gamer leaderboard for an achievement,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Fixed some mobile/tablet sizing issues,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Fixed some regex issues with dlc</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Changed progress bars on achievements/challenges to link to achievement/challenge leaderboard.</p></li></ul><a class=\"ta-x-settings-menu-changelog-link\" href=\"https://github.com/andrewcartwright1/trueachievements-extra/blob/main/CHANGELOG.md\">See the full changelog here</a></div><div class=\"ta-x-settings-menu-credits-wrapper\"><h1>Credits</h1><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p><a href=\"https://www.trueachievements.com/gamer/Dynamite+Andy\">Dynamite Andy</a> - Main contributor,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p><a href=\"https://www.trueachievements.com/gamer/Belindo152\">Belindo152</a> for code contributions, bug reports and feature requests,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p><a href=\"https://www.trueachievements.com/gamer/Amoa\">Amoa</a>, <a href=\"https://www.trueachievements.com/gamer/DynamicWolfNLD\">DynamicWolfNLD</a> and <a href=\"https://www.trueachievements.com/gamer/ManicMetalhead\">ManicMetalhead</a>, <a href=\"https://www.trueachievements.com/gamer/zr122\">zr122</a> for feature requests and bug reports,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>You for using this addon and checking out this work, thank you - it mean's alot.</p></li></ul></div></div><div class=\"t-settings js-ta-x-settings-menu-feature-documentation ta-x-settings-menu-settings-item\"><div class=\"ta-x-settings-menu-documentation-wrapper\"><h1>Feature Documentation</h1><h2>Sticky Header</h2><p>This feature will make the header stick to the top of the page, it will auto hide on scroll down and reappear on scroll up providing quick access, this feature has a sister setting titled \"Remain Stuck\" this will keep the header stuck to the top of the page and no longer show/hide on scroll.</p><h2>Emojis</h2><p>This feature remains a work in progress as I'm still finding all the locations we can input comments/replies/etc - but does what it says on the tin! Extends the emojis TA has to offer with unicode emojis.</p><h1>Forum Improvements</h1><p>This enables extended features to be enabled.</p><h2>Enable Thread Filter</h2><p>This feature will hide thread titles if they match specified keywords</p><h2>My Threads - Override Forum Settings</h2><p>This feature will override any feature shared between forums, current features shared:</p><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>Enable Thread Filter</p></li></ul><h2>Walkthroughs - Show Owner/Progress</h2><p>This feature appends information to the right sidebar which shows either:</p><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>The progress and the author if the walkthrough is in progress,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>The gamers involved with the walkthrough and the total likes if published,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>A request for a url if the addon is unable to find a link to the walkthrough.</p></li></ul><h1>Gamer Improvements</h1><p>This enables extended features to be enabled.</p><h2>Add Group By Game Button</h2><p>This feature adds a button to the \"My unlocked achievements\" page, to group the achievements unlocked on a page by game, this feature is currently unstyled and looks a bit odd on the page, if you have any ideas for how it should look - let me know!</p><h1>Games Improvements</h1><p>This enables extended features to be enabled.</p><h2>Add Highlight Games Not In Collection Button</h2><p>This feature adds a button to the \"Full Xbox Games List\" page, to highlight games on a page that are not in your game collection, this feature is currently unstyled and looks a bit odd on the page, if you have any ideas for how it should look - let me know!</p><h2>Achievements - Show Progress as XX/XX</h2><p>This feature calculates the progress made for each game + dlc and shows it as xx/xx instead of just the maximum values possible, this feature does not currently support games without any dlc - should it? Let me know!</p><h2>Achievements - Default Status for Game Achievements</h2><p>This feature will auto select the selected filter should it not be selected/all achievements not unlocked.</p><h2>Achievements - Include Guides From XboxAchievements.com</h2><p>This feature will include guides from <a href=\"https://www.xboxachievements.com/\">XboxAchievements.com</a> when viewing a achievement solution, it can be buggy/look broken but is helpful for achievements which may not have a guide available.</p><h2>Challenges - Override Achievement Settings</h2><p>This feature will override any feature shared between achievements and challenges, current features shared:</p><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>Show Progress as XX/XX</p></li></ul><h2>Clips - Default Status for Game Clips</h2><p>This feature will auto select the selected values should they not be selected.</p><h2>DLC - Override Achievement Settings</h2><p>This feature will override any feature shared between achievements and dlc, current features shared:</p><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>Show Progress as XX/XX</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Default Status for Game Achievements</p></li></ul><h2>Forums - Override Forum Settings</h2><p>This feature will override any feature shared between forums, current features shared:</p><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>Enable Thread Filter</p></li></ul><h2>Forums - Default Thread Type for Game Forums</h2><p>This feature will auto select the selected thread type should it not be selected/all.</p><h1>News Improvements</h1><p>This enables extended features to be enabled.</p><h2>Sales - Sort Sales By</h2><p>This feature will auto set the sales page to be ordered the way specified if not already ordered.</p><h1>Staff Walkthrough Improvements</h1><p>This enables tweaks to some styles on the staff walkthrough pages to make it feel more responsive, some tweaks to the tinymce editor to add some new features and styles, but also allow extended features to be enabled.</p><h2>Edit Walkthrough - Improved Image Selector</h2><p>This feature gives the image selector a bit of a visual overhaul, fixing the add image link to the top, making images more presentable and overall giving it a much cleaner feel.</p><h2>Edit Walkthrough - Auto Save Notifications</h2><p>This feature will display a notification when autosave is executed.</p><h2>Manage Walkthrough - Clickable Table Links</h2><p>This feature will make achievements, games, gamers clickable for quick and easy access to its page.</p><h2>Manage Walkthrough - Add Missing Buttons</h2><p>This feature will prevent buttons like add page, edit page etc from going missing when adding/editing pages.</p><h2>Manage Walkthrough - Auto Select First Walkthrough</h2><p>This feature will auto select the first walkthrough in the list if no walkthrough is selected.</p><h2>Manage Walkthrough - Default Status for Manage Walkthrough</h2><p>This feature will auto switch to the selected status for walkthroughs should it not be selected or no walkthrough currently open.</p><h2>Walkthrough Page - Stick Page History To Left</h2><p>This feature will stick the left sidebar to the page, providing quick access to buttons and links for editing the page.</p><h2>Walkthrough Page - Move Buttons To The Left</h2><p>This feature will move the buttons on the right side of the page, to be contained within the left sidebar, handy if \"Stick Page History To Left\" is enabled as provides quick access to them.</p><h2>Walkthrough Page - Add Walkthrough Team Button</h2><p>This feature will add a button to the left sidebar providing quick access to the manage walkthrough page (This is currently missing for editors, but visible for authors).</p><h2>Walkthrough Page - Highlight Page Locked</h2><p>This feature will highlight the page locked message making it more visible.</p><h2>Walkthrough Preview - Populate Side Column Content</h2><p>This feature will generate sidebar content to give a more accurate representation of how the walkthrough will look when previewed.</p></div></div></div><div class=\"t-settings open ta-x-settings-menu-bottom\"><ul class=\"list-links buttons\"><li><a href=\"https://github.com/andrewcartwright1/trueachievements-extra/issues/new\"> Raise a Bug </a></li><li><a href=\"https://github.com/andrewcartwright1/trueachievements-extra/issues/new\"> Request a Feature </a></li></ul><div class=\"title\"><span> TrueAchievements Extra </span><div class=\"ta-x-flex-break\"></div><a class=\"js-ta-x-settings-menu-version\" href=\"#\"> Version {GM_info.script.version} </a><span> | </span><a class=\"js-ta-x-settings-menu-documentation\" href=\"#\"> Feature Documentation </a></div></div></div></div></div><div class=\"js-ta-x-settings-menu-close close\"></div></div>";
// Exports
/* harmony default export */ const body = (body_code);
;// CONCATENATED MODULE: ./src/features/settings-menu/index.ts






let extensionBody;
const applyBody = async () => {
  const parsedDocument = new DOMParser().parseFromString(body, "text/html");
  const navigationBar = await (0,utilities/* waitForElement */.br)("header nav");
  const navGamerToggle = await (0,utilities/* waitForElement */.br)('[data-tgl="nav-gamer"]', navigationBar);
  navigationBar.insertBefore(
    parsedDocument.querySelector(`.${globals/* Constants */.gT.Styles.SettingsMenu.wrenchJs}`),
    navGamerToggle.nextSibling
  );
  const navGamer = await (0,utilities/* waitForElement */.br)(".nav-gamer");
  const templatedFeature = (0,helpers/* template */.XK)(parsedDocument.querySelector(`.${globals/* Constants */.gT.Styles.SettingsMenu.featureJs}`));
  navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);
  addSettings();
};
const addSettings = () => {
  extensionBody = document.querySelector(`.${globals/* Constants */.gT.Styles.SettingsMenu.featureJs}`);
  [...extensionBody.querySelectorAll("input, select")].forEach((setting) => {
    const configPath = setting.getAttribute("data-config-path");
    if (!configPath) {
      return;
    }
    if ((0,utilities/* isCheckboxElement */.PT)(setting)) {
      setting.checked = (0,utilities/* getValue */.NA)(globals/* config */.vc, configPath, false);
    } else if ((0,utilities/* isSelectElement */.Wi)(setting)) {
      if ((0,utilities/* toBool */.AM)(setting.getAttribute("data-is-array"))) {
        setting.value = (0,utilities/* getValue */.NA)(globals/* config */.vc, configPath, []).join(
          setting.getAttribute("data-array-split")
        );
      } else {
        setting.value = (0,utilities/* getValue */.NA)(globals/* config */.vc, configPath, "");
      }
    } else if ((0,utilities/* isTAXChildListElement */.aF)(setting)) {
      const listElement = new ListSetting(setting);
      let values;
      if ((0,utilities/* toBool */.AM)(setting.getAttribute("data-is-array"))) {
        values = (0,utilities/* getValue */.NA)(globals/* config */.vc, configPath, []);
      } else {
        values = [(0,utilities/* getValue */.NA)(globals/* config */.vc, configPath, "")];
      }
      values.forEach((value) => {
        listElement.list.appendChild(createListElement(listElement, value));
      });
    }
  });
  checkRenderConditions();
};
const checkRenderConditions = (el) => {
  const querySelector = el ? `[data-render-condition*="#${el.id}"]` : "[data-render-condition]";
  [...extensionBody.querySelectorAll(querySelector)].forEach((hiddenSetting) => {
    const condition = ConditionalRender.fromString(hiddenSetting.getAttribute("data-render-condition"));
    const method = condition?.test(extensionBody);
    if (method) {
      hiddenSetting.classList[method](globals/* Constants */.gT.Styles.Base.hide);
    }
  });
};
const setAccordionStates = () => {
  [...extensionBody.querySelectorAll("[data-checkbox-accordion] input")].forEach((setting) => {
    if ((0,utilities/* isCheckboxElement */.PT)(setting)) {
      const checkedValue = setting.checked;
      const accordionParent = setting.closest(".js-ta-x-accordion");
      if (checkedValue && accordionParent) {
        pub_sub.publish("accordion:toggleState", accordionParent);
      }
    }
  });
};
const createListElement = (listSetting, value) => {
  const templateListItem = listSetting.parent.querySelector(
    listSetting.parent.getAttribute("data-template-id")
  );
  const templatedListItem = (0,helpers/* template */.XK)(templateListItem.content.firstElementChild.cloneNode(true), {
    listSetting: {
      id: listSetting.listId,
      value
    }
  });
  return templatedListItem;
};
const settings_menu_listen = () => {
  const extensionTrigger = document.querySelector(`.${globals/* Constants */.gT.Styles.SettingsMenu.wrenchJs}`);
  extensionTrigger.addEventListener("click", () => {
    extensionTrigger.classList.add("active");
    extensionBody.classList.add("nav-gamer");
    extensionBody.classList.remove(globals/* Constants */.gT.Styles.Base.hide);
    extensionBody.classList.add("open");
    if (extensionBody.hasAttribute("data-previously-opened")) {
      return;
    }
    extensionBody.setAttribute("data-previously-opened", "");
    setAccordionStates();
  });
  extensionBody.addEventListener("click", ({ target }) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!(0,utilities/* isTAXChildListElement */.aF)(target)) {
      return;
    }
    const listElement = new ListSetting(target);
    const configPath = listElement.parent.querySelector("[data-config-path]").getAttribute(
      "data-config-path"
    );
    if (target.hasAttribute("data-add")) {
      if (listElement.input.value === "") {
        return;
      }
      listElement.list.appendChild(createListElement(listElement, listElement.input.value));
      listElement.input.value = "";
    } else if (target.hasAttribute("data-remove")) {
      listElement.list.removeChild(target.closest("li"));
    }
    (0,utilities/* setValue */.sO)(
      globals/* config */.vc,
      configPath,
      [...listElement.list.querySelectorAll("[data-value]")].map(
        (val) => val.getAttribute("data-value")
      )
    );
    let parentAccordionBody = target.closest(".ta-x-settings-menu-settings-accordion-body");
    if (parentAccordionBody) {
      pub_sub.publish("accordion:setMaxHeight", parentAccordionBody);
    }
    setTimeout(() => {
      parentAccordionBody = target.closest("[data-parent-accordion-body]");
      if (parentAccordionBody) {
        pub_sub.publish("accordion:setMaxHeight", parentAccordionBody);
      }
    }, 500);
  });
  extensionBody.addEventListener("click", ({ target }) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!target.classList.contains(globals/* Constants */.gT.Styles.SettingsMenu.closeJs)) {
      return;
    }
    extensionBody.classList.remove("open");
    extensionBody.classList.add(globals/* Constants */.gT.Styles.Base.hide);
    extensionBody.classList.remove("nav-gamer");
    extensionTrigger.classList.remove("active");
  });
  extensionBody.addEventListener("click", ({ target }) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!target.classList.contains(globals/* Constants */.gT.Styles.SettingsMenu.versionLink) && !target.classList.contains(globals/* Constants */.gT.Styles.SettingsMenu.documentationLink)) {
      return;
    }
    const changelogView = extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.SettingsMenu.changelogView}`);
    const documentationView = extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.SettingsMenu.featureDocumentationView}`);
    const settingsView = extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.SettingsMenu.settingsView}`);
    const currentView = extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.SettingsMenu.settingsContentShow}`);
    const nextView = target.classList.contains(globals/* Constants */.gT.Styles.SettingsMenu.versionLink) ? changelogView : documentationView;
    if (currentView === nextView) {
      nextView.classList.toggle(globals/* Constants */.gT.Styles.SettingsMenu.settingsContentShow);
      settingsView.classList.toggle(globals/* Constants */.gT.Styles.SettingsMenu.settingsContentShow);
    } else {
      currentView.classList.toggle(globals/* Constants */.gT.Styles.SettingsMenu.settingsContentShow);
      nextView.classList.toggle(globals/* Constants */.gT.Styles.SettingsMenu.settingsContentShow);
    }
  });
  extensionBody.addEventListener("change", ({ target }) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const configPath = target.getAttribute("data-config-path");
    if ((0,utilities/* isSelectElement */.Wi)(target)) {
      if ((0,utilities/* toBool */.AM)(target.getAttribute("data-is-array"))) {
        (0,utilities/* setValue */.sO)(
          globals/* config */.vc,
          configPath,
          target.value.split(target.getAttribute("data-array-split"))
        );
      } else {
        (0,utilities/* setValue */.sO)(globals/* config */.vc, configPath, target.value);
      }
    } else if ((0,utilities/* isCheckboxElement */.PT)(target)) {
      (0,utilities/* setValue */.sO)(globals/* config */.vc, configPath, target.checked);
    }
    checkRenderConditions(target);
    let parentAccordionBody = target.closest(".ta-x-settings-menu-settings-accordion-body");
    if (parentAccordionBody) {
      pub_sub.publish("accordion:setMaxHeight", parentAccordionBody);
    }
    setTimeout(() => {
      parentAccordionBody = target.closest("[data-parent-accordion-body]");
      if (parentAccordionBody) {
        pub_sub.publish("accordion:setMaxHeight", parentAccordionBody);
      }
    }, 500);
  });
};
/* harmony default export */ const settings_menu = (async () => {
  await applyBody();
  settings_menu_listen();
});

;// CONCATENATED MODULE: ./src/features/sticky-header/index.ts


let sticky_header_extensionBody;
let fakeElement;
let previousScrollTop;
let previousMenuOpen;
const atTopOfPage = () => window.pageYOffset <= sticky_header_extensionBody.offsetTop;
const sticky_header_applyBody = async () => {
  sticky_header_extensionBody = await (0,utilities/* waitForElement */.br)("header");
  fakeElement = document.createElement("div");
  fakeElement.style.height = `${sticky_header_extensionBody.offsetHeight}px`;
  sticky_header_extensionBody.parentNode.insertBefore(fakeElement, sticky_header_extensionBody);
  sticky_header_extensionBody.classList.add(globals/* Constants */.gT.Styles.StickyHeader.featureJs, globals/* Constants */.gT.Styles.StickyHeader.featureStyle);
  document.documentElement.style.setProperty(
    globals/* Constants */.gT.Styles.Variables.StickyHeader.height,
    `${sticky_header_extensionBody.offsetHeight}px`
  );
  if (!globals/* stickyHeader */._A.remainStuck && !atTopOfPage()) {
    sticky_header_extensionBody.classList.add(globals/* Constants */.gT.Styles.Animations.yHideNoTransition);
  }
};
const sticky_header_listen = async () => {
  if (globals/* stickyHeader */._A.remainStuck) {
    return;
  }
  const navGamer = await (0,utilities/* waitForElement */.br)(`.nav-gamer:not(.${globals/* Constants */.gT.Styles.SettingsMenu.featureJs})`);
  const taxSettingsMenu = await (0,utilities/* waitForElement */.br)(`.${globals/* Constants */.gT.Styles.SettingsMenu.featureJs}`);
  previousMenuOpen = navGamer.classList.contains("open") || taxSettingsMenu.classList.contains("open");
  window.addEventListener("scroll", () => {
    const currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (atTopOfPage()) {
      sticky_header_extensionBody.classList.remove(globals/* Constants */.gT.Styles.Animations.yHide, globals/* Constants */.gT.Styles.Animations.yHideNoTransition);
    } else {
      const searchElement = sticky_header_extensionBody.querySelector("#divtxtSearchContainer");
      if (searchElement.style.display !== "inline" && !(0,utilities/* toBool */.AM)(sticky_header_extensionBody.dataset.menuOpen)) {
        if (previousScrollTop > currentScrollTop) {
          sticky_header_extensionBody.classList.remove(
            globals/* Constants */.gT.Styles.Animations.yHide,
            globals/* Constants */.gT.Styles.Animations.yHideNoTransition
          );
          sticky_header_extensionBody.classList.add(globals/* Constants */.gT.Styles.Animations.yShow);
        } else if (previousScrollTop < currentScrollTop) {
          sticky_header_extensionBody.classList.remove(globals/* Constants */.gT.Styles.Animations.yShow);
          sticky_header_extensionBody.classList.add(globals/* Constants */.gT.Styles.Animations.yHide);
        }
      }
    }
    previousScrollTop = currentScrollTop;
  });
  window.addEventListener("resize", () => {
    if (fakeElement.style.height !== `${sticky_header_extensionBody.offsetHeight}px`) {
      fakeElement.style.height = `${sticky_header_extensionBody.offsetHeight}px`;
    }
  });
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(({ target, attributeName }) => {
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (attributeName === "class") {
        const currentMenuOpen = target.classList.contains("open");
        if (previousMenuOpen !== currentMenuOpen) {
          previousMenuOpen = currentMenuOpen;
          sticky_header_extensionBody.setAttribute("data-menu-open", currentMenuOpen.toString());
        }
      }
    });
  });
  observer.observe(navGamer, {
    attributes: true,
    attributeFilter: ["style", "class"]
  });
  observer.observe(taxSettingsMenu, {
    attributes: true,
    attributeFilter: ["style", "class"]
  });
};
/* harmony default export */ const sticky_header = (async () => {
  if (!globals/* stickyHeader */._A.enabled) {
    return;
  }
  await sticky_header_applyBody();
  await sticky_header_listen();
});

;// CONCATENATED MODULE: ./node_modules/.pnpm/emoji.json@15.0.0/node_modules/emoji.json/emoji.json
const emoji_namespaceObject = JSON.parse('[["char","name","group","a|0|1|2","😀","grinning face","Smileys & Emotion","o|3|4|5|6","😃","grinning face with big eyes","o|3|8|9|6","😄","grinning face with smiling eyes","o|3|B|C|6","😁","beaming face with smiling eyes","o|3|E|F|6","😆","grinning squinting face","o|3|H|I|6","😅","grinning face with sweat","o|3|K|L|6","🤣","rolling on the floor laughing","o|3|N|O|6","😂","face with tears of joy","o|3|Q|R|6","🙂","slightly smiling face","o|3|T|U|6","🙃","upside-down face","o|3|W|X|6","🫠","melting face","o|3|Z|a|6","😉","winking face","o|3|c|d|6","😊","smiling face with smiling eyes","o|3|f|g|6","😇","smiling face with halo","o|3|i|j|6","🥰","smiling face with hearts","o|3|l|m|6","😍","smiling face with heart-eyes","o|3|o|p|6","🤩","star-struck","o|3|r|s|6","😘","face blowing a kiss","o|3|u|v|6","😗","kissing face","o|3|x|y|6","☺️","smiling face","o|3|10|11|6","☺","o|3|13|11|6","😚","kissing face with closed eyes","o|3|15|16|6","😙","kissing face with smiling eyes","o|3|18|19|6","🥲","smiling face with tear","o|3|1B|1C|6","😋","face savoring food","o|3|1E|1F|6","😛","face with tongue","o|3|1H|1I|6","😜","winking face with tongue","o|3|1K|1L|6","🤪","zany face","o|3|1N|1O|6","😝","squinting face with tongue","o|3|1Q|1R|6","🤑","money-mouth face","o|3|1T|1U|6","🤗","smiling face with open hands","o|3|1W|1X|6","🤭","face with hand over mouth","o|3|1Z|1a|6","🫢","face with open eyes and hand over mouth","o|3|1c|1d|6","🫣","face with peeking eye","o|3|1f|1g|6","🤫","shushing face","o|3|1i|1j|6","🤔","thinking face","o|3|1l|1m|6","🫡","saluting face","o|3|1o|1p|6","🤐","zipper-mouth face","o|3|1r|1s|6","🤨","face with raised eyebrow","o|3|1u|1v|6","😐","neutral face","o|3|1x|1y|6","😑","expressionless face","o|3|20|21|6","😶","face without mouth","o|3|23|24|6","🫥","dotted line face","o|3|26|27|6","😶‍🌫️","face in clouds","o|3|29|2A|6","😶‍🌫","o|3|2C|2A|6","😏","smirking face","o|3|2E|2F|6","😒","unamused face","o|3|2H|2I|6","🙄","face with rolling eyes","o|3|2K|2L|6","😬","grimacing face","o|3|2N|2O|6","😮‍💨","face exhaling","o|3|2Q|2R|6","🤥","lying face","o|3|2T|2U|6","🫨","shaking face","o|3|2W|2X|6","😌","relieved face","o|3|2Z|2a|6","😔","pensive face","o|3|2c|2d|6","😪","sleepy face","o|3|2f|2g|6","🤤","drooling face","o|3|2i|2j|6","😴","sleeping face","o|3|2l|2m|6","😷","face with medical mask","o|3|2o|2p|6","🤒","face with thermometer","o|3|2r|2s|6","🤕","face with head-bandage","o|3|2u|2v|6","🤢","nauseated face","o|3|2x|2y|6","🤮","face vomiting","o|3|30|31|6","🤧","sneezing face","o|3|33|34|6","🥵","hot face","o|3|36|37|6","🥶","cold face","o|3|39|3A|6","🥴","woozy face","o|3|3C|3D|6","😵","face with crossed-out eyes","o|3|3F|3G|6","😵‍💫","face with spiral eyes","o|3|3I|3J|6","🤯","exploding head","o|3|3L|3M|6","🤠","cowboy hat face","o|3|3O|3P|6","🥳","partying face","o|3|3R|3S|6","🥸","disguised face","o|3|3U|3V|6","😎","smiling face with sunglasses","o|3|3X|3Y|6","🤓","nerd face","o|3|3a|3b|6","🧐","face with monocle","o|3|3d|3e|6","😕","confused face","o|3|3g|3h|6","🫤","face with diagonal mouth","o|3|3j|3k|6","😟","worried face","o|3|3m|3n|6","🙁","slightly frowning face","o|3|3p|3q|6","☹️","frowning face","o|3|3s|3t|6","☹","o|3|3v|3t|6","😮","face with open mouth","o|3|3x|3y|6","😯","hushed face","o|3|40|41|6","😲","astonished face","o|3|43|44|6","😳","flushed face","o|3|46|47|6","🥺","pleading face","o|3|49|4A|6","🥹","face holding back tears","o|3|4C|4D|6","😦","frowning face with open mouth","o|3|4F|4G|6","😧","anguished face","o|3|4I|4J|6","😨","fearful face","o|3|4L|4M|6","😰","anxious face with sweat","o|3|4O|4P|6","😥","sad but relieved face","o|3|4R|4S|6","😢","crying face","o|3|4U|4V|6","😭","loudly crying face","o|3|4X|4Y|6","😱","face screaming in fear","o|3|4a|4b|6","😖","confounded face","o|3|4d|4e|6","😣","persevering face","o|3|4g|4h|6","😞","disappointed face","o|3|4j|4k|6","😓","downcast face with sweat","o|3|4m|4n|6","😩","weary face","o|3|4p|4q|6","😫","tired face","o|3|4s|4t|6","🥱","yawning face","o|3|4v|4w|6","😤","face with steam from nose","o|3|4y|4z|6","😡","enraged face","o|3|51|52|6","😠","angry face","o|3|54|55|6","🤬","face with symbols on mouth","o|3|57|58|6","😈","smiling face with horns","o|3|5A|5B|6","👿","angry face with horns","o|3|5D|5E|6","💀","skull","o|3|5G|5H|6","☠️","skull and crossbones","o|3|5J|5K|6","☠","o|3|5M|5K|6","💩","pile of poo","o|3|5O|5P|6","🤡","clown face","o|3|5R|5S|6","👹","ogre","o|3|5U|5V|6","👺","goblin","o|3|5X|5Y|6","👻","ghost","o|3|5a|5b|6","👽","alien","o|3|5d|5e|6","👾","alien monster","o|3|5g|5h|6","🤖","robot","o|3|5j|5k|6","😺","grinning cat","o|3|5m|5n|6","😸","grinning cat with smiling eyes","o|3|5p|5q|6","😹","cat with tears of joy","o|3|5s|5t|6","😻","smiling cat with heart-eyes","o|3|5v|5w|6","😼","cat with wry smile","o|3|5y|5z|6","😽","kissing cat","o|3|61|62|6","🙀","weary cat","o|3|64|65|6","😿","crying cat","o|3|67|68|6","😾","pouting cat","o|3|6A|6B|6","🙈","see-no-evil monkey","o|3|6D|6E|6","🙉","hear-no-evil monkey","o|3|6G|6H|6","🙊","speak-no-evil monkey","o|3|6J|6K|6","💌","love letter","o|3|6M|6N|6","💘","heart with arrow","o|3|6P|6Q|6","💝","heart with ribbon","o|3|6S|6T|6","💖","sparkling heart","o|3|6V|6W|6","💗","growing heart","o|3|6Y|6Z|6","💓","beating heart","o|3|6b|6c|6","💞","revolving hearts","o|3|6e|6f|6","💕","two hearts","o|3|6h|6i|6","💟","heart decoration","o|3|6k|6l|6","❣️","heart exclamation","o|3|6n|6o|6","❣","o|3|6q|6o|6","💔","broken heart","o|3|6s|6t|6","❤️‍🔥","heart on fire","o|3|6v|6w|6","❤‍🔥","o|3|6y|6w|6","❤️‍🩹","mending heart","o|3|70|71|6","❤‍🩹","o|3|73|71|6","❤️","red heart","o|3|75|76|6","❤","o|3|78|76|6","🩷","pink heart","o|3|7A|7B|6","🧡","orange heart","o|3|7D|7E|6","💛","yellow heart","o|3|7G|7H|6","💚","green heart","o|3|7J|7K|6","💙","blue heart","o|3|7M|7N|6","🩵","light blue heart","o|3|7P|7Q|6","💜","purple heart","o|3|7S|7T|6","🤎","brown heart","o|3|7V|7W|6","🖤","black heart","o|3|7Y|7Z|6","🩶","grey heart","o|3|7b|7c|6","🤍","white heart","o|3|7e|7f|6","💋","kiss mark","o|3|7h|7i|6","💯","hundred points","o|3|7k|7l|6","💢","anger symbol","o|3|7n|7o|6","💥","collision","o|3|7q|7r|6","💫","dizzy","o|3|7t|7u|6","💦","sweat droplets","o|3|7w|7x|6","💨","dashing away","o|3|7z|80|6","🕳️","hole","o|3|82|83|6","🕳","o|3|85|83|6","💬","speech balloon","o|3|87|88|6","👁️‍🗨️","eye in speech bubble","o|3|8A|8B|6","👁‍🗨️","o|3|8D|8B|6","👁️‍🗨","o|3|8F|8B|6","👁‍🗨","o|3|8H|8B|6","🗨️","left speech bubble","o|3|8J|8K|6","🗨","o|3|8M|8K|6","🗯️","right anger bubble","o|3|8O|8P|6","🗯","o|3|8R|8P|6","💭","thought balloon","o|3|8T|8U|6","💤","ZZZ","o|3|8W|8X|6","👋","waving hand","People & Body","o|3|8Z|8a|8b","👋🏻","waving hand: light skin tone","o|3|8d|8e|8b","👋🏼","waving hand: medium-light skin tone","o|3|8g|8h|8b","👋🏽","waving hand: medium skin tone","o|3|8j|8k|8b","👋🏾","waving hand: medium-dark skin tone","o|3|8m|8n|8b","👋🏿","waving hand: dark skin tone","o|3|8p|8q|8b","🤚","raised back of hand","o|3|8s|8t|8b","🤚🏻","raised back of hand: light skin tone","o|3|8v|8w|8b","🤚🏼","raised back of hand: medium-light skin tone","o|3|8y|8z|8b","🤚🏽","raised back of hand: medium skin tone","o|3|91|92|8b","🤚🏾","raised back of hand: medium-dark skin tone","o|3|94|95|8b","🤚🏿","raised back of hand: dark skin tone","o|3|97|98|8b","🖐️","hand with fingers splayed","o|3|9A|9B|8b","🖐","o|3|9D|9B|8b","🖐🏻","hand with fingers splayed: light skin tone","o|3|9F|9G|8b","🖐🏼","hand with fingers splayed: medium-light skin tone","o|3|9I|9J|8b","🖐🏽","hand with fingers splayed: medium skin tone","o|3|9L|9M|8b","🖐🏾","hand with fingers splayed: medium-dark skin tone","o|3|9O|9P|8b","🖐🏿","hand with fingers splayed: dark skin tone","o|3|9R|9S|8b","✋","raised hand","o|3|9U|9V|8b","✋🏻","raised hand: light skin tone","o|3|9X|9Y|8b","✋🏼","raised hand: medium-light skin tone","o|3|9a|9b|8b","✋🏽","raised hand: medium skin tone","o|3|9d|9e|8b","✋🏾","raised hand: medium-dark skin tone","o|3|9g|9h|8b","✋🏿","raised hand: dark skin tone","o|3|9j|9k|8b","🖖","vulcan salute","o|3|9m|9n|8b","🖖🏻","vulcan salute: light skin tone","o|3|9p|9q|8b","🖖🏼","vulcan salute: medium-light skin tone","o|3|9s|9t|8b","🖖🏽","vulcan salute: medium skin tone","o|3|9v|9w|8b","🖖🏾","vulcan salute: medium-dark skin tone","o|3|9y|9z|8b","🖖🏿","vulcan salute: dark skin tone","o|3|A1|A2|8b","🫱","rightwards hand","o|3|A4|A5|8b","🫱🏻","rightwards hand: light skin tone","o|3|A7|A8|8b","🫱🏼","rightwards hand: medium-light skin tone","o|3|AA|AB|8b","🫱🏽","rightwards hand: medium skin tone","o|3|AD|AE|8b","🫱🏾","rightwards hand: medium-dark skin tone","o|3|AG|AH|8b","🫱🏿","rightwards hand: dark skin tone","o|3|AJ|AK|8b","🫲","leftwards hand","o|3|AM|AN|8b","🫲🏻","leftwards hand: light skin tone","o|3|AP|AQ|8b","🫲🏼","leftwards hand: medium-light skin tone","o|3|AS|AT|8b","🫲🏽","leftwards hand: medium skin tone","o|3|AV|AW|8b","🫲🏾","leftwards hand: medium-dark skin tone","o|3|AY|AZ|8b","🫲🏿","leftwards hand: dark skin tone","o|3|Ab|Ac|8b","🫳","palm down hand","o|3|Ae|Af|8b","🫳🏻","palm down hand: light skin tone","o|3|Ah|Ai|8b","🫳🏼","palm down hand: medium-light skin tone","o|3|Ak|Al|8b","🫳🏽","palm down hand: medium skin tone","o|3|An|Ao|8b","🫳🏾","palm down hand: medium-dark skin tone","o|3|Aq|Ar|8b","🫳🏿","palm down hand: dark skin tone","o|3|At|Au|8b","🫴","palm up hand","o|3|Aw|Ax|8b","🫴🏻","palm up hand: light skin tone","o|3|Az|B0|8b","🫴🏼","palm up hand: medium-light skin tone","o|3|B2|B3|8b","🫴🏽","palm up hand: medium skin tone","o|3|B5|B6|8b","🫴🏾","palm up hand: medium-dark skin tone","o|3|B8|B9|8b","🫴🏿","palm up hand: dark skin tone","o|3|BB|BC|8b","🫷","leftwards pushing hand","o|3|BE|BF|8b","🫷🏻","leftwards pushing hand: light skin tone","o|3|BH|BI|8b","🫷🏼","leftwards pushing hand: medium-light skin tone","o|3|BK|BL|8b","🫷🏽","leftwards pushing hand: medium skin tone","o|3|BN|BO|8b","🫷🏾","leftwards pushing hand: medium-dark skin tone","o|3|BQ|BR|8b","🫷🏿","leftwards pushing hand: dark skin tone","o|3|BT|BU|8b","🫸","rightwards pushing hand","o|3|BW|BX|8b","🫸🏻","rightwards pushing hand: light skin tone","o|3|BZ|Ba|8b","🫸🏼","rightwards pushing hand: medium-light skin tone","o|3|Bc|Bd|8b","🫸🏽","rightwards pushing hand: medium skin tone","o|3|Bf|Bg|8b","🫸🏾","rightwards pushing hand: medium-dark skin tone","o|3|Bi|Bj|8b","🫸🏿","rightwards pushing hand: dark skin tone","o|3|Bl|Bm|8b","👌","OK hand","o|3|Bo|Bp|8b","👌🏻","OK hand: light skin tone","o|3|Br|Bs|8b","👌🏼","OK hand: medium-light skin tone","o|3|Bu|Bv|8b","👌🏽","OK hand: medium skin tone","o|3|Bx|By|8b","👌🏾","OK hand: medium-dark skin tone","o|3|C0|C1|8b","👌🏿","OK hand: dark skin tone","o|3|C3|C4|8b","🤌","pinched fingers","o|3|C6|C7|8b","🤌🏻","pinched fingers: light skin tone","o|3|C9|CA|8b","🤌🏼","pinched fingers: medium-light skin tone","o|3|CC|CD|8b","🤌🏽","pinched fingers: medium skin tone","o|3|CF|CG|8b","🤌🏾","pinched fingers: medium-dark skin tone","o|3|CI|CJ|8b","🤌🏿","pinched fingers: dark skin tone","o|3|CL|CM|8b","🤏","pinching hand","o|3|CO|CP|8b","🤏🏻","pinching hand: light skin tone","o|3|CR|CS|8b","🤏🏼","pinching hand: medium-light skin tone","o|3|CU|CV|8b","🤏🏽","pinching hand: medium skin tone","o|3|CX|CY|8b","🤏🏾","pinching hand: medium-dark skin tone","o|3|Ca|Cb|8b","🤏🏿","pinching hand: dark skin tone","o|3|Cd|Ce|8b","✌️","victory hand","o|3|Cg|Ch|8b","✌","o|3|Cj|Ch|8b","✌🏻","victory hand: light skin tone","o|3|Cl|Cm|8b","✌🏼","victory hand: medium-light skin tone","o|3|Co|Cp|8b","✌🏽","victory hand: medium skin tone","o|3|Cr|Cs|8b","✌🏾","victory hand: medium-dark skin tone","o|3|Cu|Cv|8b","✌🏿","victory hand: dark skin tone","o|3|Cx|Cy|8b","🤞","crossed fingers","o|3|D0|D1|8b","🤞🏻","crossed fingers: light skin tone","o|3|D3|D4|8b","🤞🏼","crossed fingers: medium-light skin tone","o|3|D6|D7|8b","🤞🏽","crossed fingers: medium skin tone","o|3|D9|DA|8b","🤞🏾","crossed fingers: medium-dark skin tone","o|3|DC|DD|8b","🤞🏿","crossed fingers: dark skin tone","o|3|DF|DG|8b","🫰","hand with index finger and thumb crossed","o|3|DI|DJ|8b","🫰🏻","hand with index finger and thumb crossed: light skin tone","o|3|DL|DM|8b","🫰🏼","hand with index finger and thumb crossed: medium-light skin tone","o|3|DO|DP|8b","🫰🏽","hand with index finger and thumb crossed: medium skin tone","o|3|DR|DS|8b","🫰🏾","hand with index finger and thumb crossed: medium-dark skin tone","o|3|DU|DV|8b","🫰🏿","hand with index finger and thumb crossed: dark skin tone","o|3|DX|DY|8b","🤟","love-you gesture","o|3|Da|Db|8b","🤟🏻","love-you gesture: light skin tone","o|3|Dd|De|8b","🤟🏼","love-you gesture: medium-light skin tone","o|3|Dg|Dh|8b","🤟🏽","love-you gesture: medium skin tone","o|3|Dj|Dk|8b","🤟🏾","love-you gesture: medium-dark skin tone","o|3|Dm|Dn|8b","🤟🏿","love-you gesture: dark skin tone","o|3|Dp|Dq|8b","🤘","sign of the horns","o|3|Ds|Dt|8b","🤘🏻","sign of the horns: light skin tone","o|3|Dv|Dw|8b","🤘🏼","sign of the horns: medium-light skin tone","o|3|Dy|Dz|8b","🤘🏽","sign of the horns: medium skin tone","o|3|E1|E2|8b","🤘🏾","sign of the horns: medium-dark skin tone","o|3|E4|E5|8b","🤘🏿","sign of the horns: dark skin tone","o|3|E7|E8|8b","🤙","call me hand","o|3|EA|EB|8b","🤙🏻","call me hand: light skin tone","o|3|ED|EE|8b","🤙🏼","call me hand: medium-light skin tone","o|3|EG|EH|8b","🤙🏽","call me hand: medium skin tone","o|3|EJ|EK|8b","🤙🏾","call me hand: medium-dark skin tone","o|3|EM|EN|8b","🤙🏿","call me hand: dark skin tone","o|3|EP|EQ|8b","👈","backhand index pointing left","o|3|ES|ET|8b","👈🏻","backhand index pointing left: light skin tone","o|3|EV|EW|8b","👈🏼","backhand index pointing left: medium-light skin tone","o|3|EY|EZ|8b","👈🏽","backhand index pointing left: medium skin tone","o|3|Eb|Ec|8b","👈🏾","backhand index pointing left: medium-dark skin tone","o|3|Ee|Ef|8b","👈🏿","backhand index pointing left: dark skin tone","o|3|Eh|Ei|8b","👉","backhand index pointing right","o|3|Ek|El|8b","👉🏻","backhand index pointing right: light skin tone","o|3|En|Eo|8b","👉🏼","backhand index pointing right: medium-light skin tone","o|3|Eq|Er|8b","👉🏽","backhand index pointing right: medium skin tone","o|3|Et|Eu|8b","👉🏾","backhand index pointing right: medium-dark skin tone","o|3|Ew|Ex|8b","👉🏿","backhand index pointing right: dark skin tone","o|3|Ez|F0|8b","👆","backhand index pointing up","o|3|F2|F3|8b","👆🏻","backhand index pointing up: light skin tone","o|3|F5|F6|8b","👆🏼","backhand index pointing up: medium-light skin tone","o|3|F8|F9|8b","👆🏽","backhand index pointing up: medium skin tone","o|3|FB|FC|8b","👆🏾","backhand index pointing up: medium-dark skin tone","o|3|FE|FF|8b","👆🏿","backhand index pointing up: dark skin tone","o|3|FH|FI|8b","🖕","middle finger","o|3|FK|FL|8b","🖕🏻","middle finger: light skin tone","o|3|FN|FO|8b","🖕🏼","middle finger: medium-light skin tone","o|3|FQ|FR|8b","🖕🏽","middle finger: medium skin tone","o|3|FT|FU|8b","🖕🏾","middle finger: medium-dark skin tone","o|3|FW|FX|8b","🖕🏿","middle finger: dark skin tone","o|3|FZ|Fa|8b","👇","backhand index pointing down","o|3|Fc|Fd|8b","👇🏻","backhand index pointing down: light skin tone","o|3|Ff|Fg|8b","👇🏼","backhand index pointing down: medium-light skin tone","o|3|Fi|Fj|8b","👇🏽","backhand index pointing down: medium skin tone","o|3|Fl|Fm|8b","👇🏾","backhand index pointing down: medium-dark skin tone","o|3|Fo|Fp|8b","👇🏿","backhand index pointing down: dark skin tone","o|3|Fr|Fs|8b","☝️","index pointing up","o|3|Fu|Fv|8b","☝","o|3|Fx|Fv|8b","☝🏻","index pointing up: light skin tone","o|3|Fz|G0|8b","☝🏼","index pointing up: medium-light skin tone","o|3|G2|G3|8b","☝🏽","index pointing up: medium skin tone","o|3|G5|G6|8b","☝🏾","index pointing up: medium-dark skin tone","o|3|G8|G9|8b","☝🏿","index pointing up: dark skin tone","o|3|GB|GC|8b","🫵","index pointing at the viewer","o|3|GE|GF|8b","🫵🏻","index pointing at the viewer: light skin tone","o|3|GH|GI|8b","🫵🏼","index pointing at the viewer: medium-light skin tone","o|3|GK|GL|8b","🫵🏽","index pointing at the viewer: medium skin tone","o|3|GN|GO|8b","🫵🏾","index pointing at the viewer: medium-dark skin tone","o|3|GQ|GR|8b","🫵🏿","index pointing at the viewer: dark skin tone","o|3|GT|GU|8b","👍","thumbs up","o|3|GW|GX|8b","👍🏻","thumbs up: light skin tone","o|3|GZ|Ga|8b","👍🏼","thumbs up: medium-light skin tone","o|3|Gc|Gd|8b","👍🏽","thumbs up: medium skin tone","o|3|Gf|Gg|8b","👍🏾","thumbs up: medium-dark skin tone","o|3|Gi|Gj|8b","👍🏿","thumbs up: dark skin tone","o|3|Gl|Gm|8b","👎","thumbs down","o|3|Go|Gp|8b","👎🏻","thumbs down: light skin tone","o|3|Gr|Gs|8b","👎🏼","thumbs down: medium-light skin tone","o|3|Gu|Gv|8b","👎🏽","thumbs down: medium skin tone","o|3|Gx|Gy|8b","👎🏾","thumbs down: medium-dark skin tone","o|3|H0|H1|8b","👎🏿","thumbs down: dark skin tone","o|3|H3|H4|8b","✊","raised fist","o|3|H6|H7|8b","✊🏻","raised fist: light skin tone","o|3|H9|HA|8b","✊🏼","raised fist: medium-light skin tone","o|3|HC|HD|8b","✊🏽","raised fist: medium skin tone","o|3|HF|HG|8b","✊🏾","raised fist: medium-dark skin tone","o|3|HI|HJ|8b","✊🏿","raised fist: dark skin tone","o|3|HL|HM|8b","👊","oncoming fist","o|3|HO|HP|8b","👊🏻","oncoming fist: light skin tone","o|3|HR|HS|8b","👊🏼","oncoming fist: medium-light skin tone","o|3|HU|HV|8b","👊🏽","oncoming fist: medium skin tone","o|3|HX|HY|8b","👊🏾","oncoming fist: medium-dark skin tone","o|3|Ha|Hb|8b","👊🏿","oncoming fist: dark skin tone","o|3|Hd|He|8b","🤛","left-facing fist","o|3|Hg|Hh|8b","🤛🏻","left-facing fist: light skin tone","o|3|Hj|Hk|8b","🤛🏼","left-facing fist: medium-light skin tone","o|3|Hm|Hn|8b","🤛🏽","left-facing fist: medium skin tone","o|3|Hp|Hq|8b","🤛🏾","left-facing fist: medium-dark skin tone","o|3|Hs|Ht|8b","🤛🏿","left-facing fist: dark skin tone","o|3|Hv|Hw|8b","🤜","right-facing fist","o|3|Hy|Hz|8b","🤜🏻","right-facing fist: light skin tone","o|3|I1|I2|8b","🤜🏼","right-facing fist: medium-light skin tone","o|3|I4|I5|8b","🤜🏽","right-facing fist: medium skin tone","o|3|I7|I8|8b","🤜🏾","right-facing fist: medium-dark skin tone","o|3|IA|IB|8b","🤜🏿","right-facing fist: dark skin tone","o|3|ID|IE|8b","👏","clapping hands","o|3|IG|IH|8b","👏🏻","clapping hands: light skin tone","o|3|IJ|IK|8b","👏🏼","clapping hands: medium-light skin tone","o|3|IM|IN|8b","👏🏽","clapping hands: medium skin tone","o|3|IP|IQ|8b","👏🏾","clapping hands: medium-dark skin tone","o|3|IS|IT|8b","👏🏿","clapping hands: dark skin tone","o|3|IV|IW|8b","🙌","raising hands","o|3|IY|IZ|8b","🙌🏻","raising hands: light skin tone","o|3|Ib|Ic|8b","🙌🏼","raising hands: medium-light skin tone","o|3|Ie|If|8b","🙌🏽","raising hands: medium skin tone","o|3|Ih|Ii|8b","🙌🏾","raising hands: medium-dark skin tone","o|3|Ik|Il|8b","🙌🏿","raising hands: dark skin tone","o|3|In|Io|8b","🫶","heart hands","o|3|Iq|Ir|8b","🫶🏻","heart hands: light skin tone","o|3|It|Iu|8b","🫶🏼","heart hands: medium-light skin tone","o|3|Iw|Ix|8b","🫶🏽","heart hands: medium skin tone","o|3|Iz|J0|8b","🫶🏾","heart hands: medium-dark skin tone","o|3|J2|J3|8b","🫶🏿","heart hands: dark skin tone","o|3|J5|J6|8b","👐","open hands","o|3|J8|J9|8b","👐🏻","open hands: light skin tone","o|3|JB|JC|8b","👐🏼","open hands: medium-light skin tone","o|3|JE|JF|8b","👐🏽","open hands: medium skin tone","o|3|JH|JI|8b","👐🏾","open hands: medium-dark skin tone","o|3|JK|JL|8b","👐🏿","open hands: dark skin tone","o|3|JN|JO|8b","🤲","palms up together","o|3|JQ|JR|8b","🤲🏻","palms up together: light skin tone","o|3|JT|JU|8b","🤲🏼","palms up together: medium-light skin tone","o|3|JW|JX|8b","🤲🏽","palms up together: medium skin tone","o|3|JZ|Ja|8b","🤲🏾","palms up together: medium-dark skin tone","o|3|Jc|Jd|8b","🤲🏿","palms up together: dark skin tone","o|3|Jf|Jg|8b","🤝","handshake","o|3|Ji|Jj|8b","🤝🏻","handshake: light skin tone","o|3|Jl|Jm|8b","🤝🏼","handshake: medium-light skin tone","o|3|Jo|Jp|8b","🤝🏽","handshake: medium skin tone","o|3|Jr|Js|8b","🤝🏾","handshake: medium-dark skin tone","o|3|Ju|Jv|8b","🤝🏿","handshake: dark skin tone","o|3|Jx|Jy|8b","🫱🏻‍🫲🏼","handshake: light skin tone, medium-light skin tone","o|3|K0|K1|8b","🫱🏻‍🫲🏽","handshake: light skin tone, medium skin tone","o|3|K3|K4|8b","🫱🏻‍🫲🏾","handshake: light skin tone, medium-dark skin tone","o|3|K6|K7|8b","🫱🏻‍🫲🏿","handshake: light skin tone, dark skin tone","o|3|K9|KA|8b","🫱🏼‍🫲🏻","handshake: medium-light skin tone, light skin tone","o|3|KC|KD|8b","🫱🏼‍🫲🏽","handshake: medium-light skin tone, medium skin tone","o|3|KF|KG|8b","🫱🏼‍🫲🏾","handshake: medium-light skin tone, medium-dark skin tone","o|3|KI|KJ|8b","🫱🏼‍🫲🏿","handshake: medium-light skin tone, dark skin tone","o|3|KL|KM|8b","🫱🏽‍🫲🏻","handshake: medium skin tone, light skin tone","o|3|KO|KP|8b","🫱🏽‍🫲🏼","handshake: medium skin tone, medium-light skin tone","o|3|KR|KS|8b","🫱🏽‍🫲🏾","handshake: medium skin tone, medium-dark skin tone","o|3|KU|KV|8b","🫱🏽‍🫲🏿","handshake: medium skin tone, dark skin tone","o|3|KX|KY|8b","🫱🏾‍🫲🏻","handshake: medium-dark skin tone, light skin tone","o|3|Ka|Kb|8b","🫱🏾‍🫲🏼","handshake: medium-dark skin tone, medium-light skin tone","o|3|Kd|Ke|8b","🫱🏾‍🫲🏽","handshake: medium-dark skin tone, medium skin tone","o|3|Kg|Kh|8b","🫱🏾‍🫲🏿","handshake: medium-dark skin tone, dark skin tone","o|3|Kj|Kk|8b","🫱🏿‍🫲🏻","handshake: dark skin tone, light skin tone","o|3|Km|Kn|8b","🫱🏿‍🫲🏼","handshake: dark skin tone, medium-light skin tone","o|3|Kp|Kq|8b","🫱🏿‍🫲🏽","handshake: dark skin tone, medium skin tone","o|3|Ks|Kt|8b","🫱🏿‍🫲🏾","handshake: dark skin tone, medium-dark skin tone","o|3|Kv|Kw|8b","🙏","folded hands","o|3|Ky|Kz|8b","🙏🏻","folded hands: light skin tone","o|3|L1|L2|8b","🙏🏼","folded hands: medium-light skin tone","o|3|L4|L5|8b","🙏🏽","folded hands: medium skin tone","o|3|L7|L8|8b","🙏🏾","folded hands: medium-dark skin tone","o|3|LA|LB|8b","🙏🏿","folded hands: dark skin tone","o|3|LD|LE|8b","✍️","writing hand","o|3|LG|LH|8b","✍","o|3|LJ|LH|8b","✍🏻","writing hand: light skin tone","o|3|LL|LM|8b","✍🏼","writing hand: medium-light skin tone","o|3|LO|LP|8b","✍🏽","writing hand: medium skin tone","o|3|LR|LS|8b","✍🏾","writing hand: medium-dark skin tone","o|3|LU|LV|8b","✍🏿","writing hand: dark skin tone","o|3|LX|LY|8b","💅","nail polish","o|3|La|Lb|8b","💅🏻","nail polish: light skin tone","o|3|Ld|Le|8b","💅🏼","nail polish: medium-light skin tone","o|3|Lg|Lh|8b","💅🏽","nail polish: medium skin tone","o|3|Lj|Lk|8b","💅🏾","nail polish: medium-dark skin tone","o|3|Lm|Ln|8b","💅🏿","nail polish: dark skin tone","o|3|Lp|Lq|8b","🤳","selfie","o|3|Ls|Lt|8b","🤳🏻","selfie: light skin tone","o|3|Lv|Lw|8b","🤳🏼","selfie: medium-light skin tone","o|3|Ly|Lz|8b","🤳🏽","selfie: medium skin tone","o|3|M1|M2|8b","🤳🏾","selfie: medium-dark skin tone","o|3|M4|M5|8b","🤳🏿","selfie: dark skin tone","o|3|M7|M8|8b","💪","flexed biceps","o|3|MA|MB|8b","💪🏻","flexed biceps: light skin tone","o|3|MD|ME|8b","💪🏼","flexed biceps: medium-light skin tone","o|3|MG|MH|8b","💪🏽","flexed biceps: medium skin tone","o|3|MJ|MK|8b","💪🏾","flexed biceps: medium-dark skin tone","o|3|MM|MN|8b","💪🏿","flexed biceps: dark skin tone","o|3|MP|MQ|8b","🦾","mechanical arm","o|3|MS|MT|8b","🦿","mechanical leg","o|3|MV|MW|8b","🦵","leg","o|3|MY|MZ|8b","🦵🏻","leg: light skin tone","o|3|Mb|Mc|8b","🦵🏼","leg: medium-light skin tone","o|3|Me|Mf|8b","🦵🏽","leg: medium skin tone","o|3|Mh|Mi|8b","🦵🏾","leg: medium-dark skin tone","o|3|Mk|Ml|8b","🦵🏿","leg: dark skin tone","o|3|Mn|Mo|8b","🦶","foot","o|3|Mq|Mr|8b","🦶🏻","foot: light skin tone","o|3|Mt|Mu|8b","🦶🏼","foot: medium-light skin tone","o|3|Mw|Mx|8b","🦶🏽","foot: medium skin tone","o|3|Mz|N0|8b","🦶🏾","foot: medium-dark skin tone","o|3|N2|N3|8b","🦶🏿","foot: dark skin tone","o|3|N5|N6|8b","👂","ear","o|3|N8|N9|8b","👂🏻","ear: light skin tone","o|3|NB|NC|8b","👂🏼","ear: medium-light skin tone","o|3|NE|NF|8b","👂🏽","ear: medium skin tone","o|3|NH|NI|8b","👂🏾","ear: medium-dark skin tone","o|3|NK|NL|8b","👂🏿","ear: dark skin tone","o|3|NN|NO|8b","🦻","ear with hearing aid","o|3|NQ|NR|8b","🦻🏻","ear with hearing aid: light skin tone","o|3|NT|NU|8b","🦻🏼","ear with hearing aid: medium-light skin tone","o|3|NW|NX|8b","🦻🏽","ear with hearing aid: medium skin tone","o|3|NZ|Na|8b","🦻🏾","ear with hearing aid: medium-dark skin tone","o|3|Nc|Nd|8b","🦻🏿","ear with hearing aid: dark skin tone","o|3|Nf|Ng|8b","👃","nose","o|3|Ni|Nj|8b","👃🏻","nose: light skin tone","o|3|Nl|Nm|8b","👃🏼","nose: medium-light skin tone","o|3|No|Np|8b","👃🏽","nose: medium skin tone","o|3|Nr|Ns|8b","👃🏾","nose: medium-dark skin tone","o|3|Nu|Nv|8b","👃🏿","nose: dark skin tone","o|3|Nx|Ny|8b","🧠","brain","o|3|O0|O1|8b","🫀","anatomical heart","o|3|O3|O4|8b","🫁","lungs","o|3|O6|O7|8b","🦷","tooth","o|3|O9|OA|8b","🦴","bone","o|3|OC|OD|8b","👀","eyes","o|3|OF|OG|8b","👁️","eye","o|3|OI|OJ|8b","👁","o|3|OL|OJ|8b","👅","tongue","o|3|ON|OO|8b","👄","mouth","o|3|OQ|OR|8b","🫦","biting lip","o|3|OT|OU|8b","👶","baby","o|3|OW|OX|8b","👶🏻","baby: light skin tone","o|3|OZ|Oa|8b","👶🏼","baby: medium-light skin tone","o|3|Oc|Od|8b","👶🏽","baby: medium skin tone","o|3|Of|Og|8b","👶🏾","baby: medium-dark skin tone","o|3|Oi|Oj|8b","👶🏿","baby: dark skin tone","o|3|Ol|Om|8b","🧒","child","o|3|Oo|Op|8b","🧒🏻","child: light skin tone","o|3|Or|Os|8b","🧒🏼","child: medium-light skin tone","o|3|Ou|Ov|8b","🧒🏽","child: medium skin tone","o|3|Ox|Oy|8b","🧒🏾","child: medium-dark skin tone","o|3|P0|P1|8b","🧒🏿","child: dark skin tone","o|3|P3|P4|8b","👦","boy","o|3|P6|P7|8b","👦🏻","boy: light skin tone","o|3|P9|PA|8b","👦🏼","boy: medium-light skin tone","o|3|PC|PD|8b","👦🏽","boy: medium skin tone","o|3|PF|PG|8b","👦🏾","boy: medium-dark skin tone","o|3|PI|PJ|8b","👦🏿","boy: dark skin tone","o|3|PL|PM|8b","👧","girl","o|3|PO|PP|8b","👧🏻","girl: light skin tone","o|3|PR|PS|8b","👧🏼","girl: medium-light skin tone","o|3|PU|PV|8b","👧🏽","girl: medium skin tone","o|3|PX|PY|8b","👧🏾","girl: medium-dark skin tone","o|3|Pa|Pb|8b","👧🏿","girl: dark skin tone","o|3|Pd|Pe|8b","🧑","person","o|3|Pg|Ph|8b","🧑🏻","person: light skin tone","o|3|Pj|Pk|8b","🧑🏼","person: medium-light skin tone","o|3|Pm|Pn|8b","🧑🏽","person: medium skin tone","o|3|Pp|Pq|8b","🧑🏾","person: medium-dark skin tone","o|3|Ps|Pt|8b","🧑🏿","person: dark skin tone","o|3|Pv|Pw|8b","👱","person: blond hair","o|3|Py|Pz|8b","👱🏻","person: light skin tone, blond hair","o|3|Q1|Q2|8b","👱🏼","person: medium-light skin tone, blond hair","o|3|Q4|Q5|8b","👱🏽","person: medium skin tone, blond hair","o|3|Q7|Q8|8b","👱🏾","person: medium-dark skin tone, blond hair","o|3|QA|QB|8b","👱🏿","person: dark skin tone, blond hair","o|3|QD|QE|8b","👨","man","o|3|QG|QH|8b","👨🏻","man: light skin tone","o|3|QJ|QK|8b","👨🏼","man: medium-light skin tone","o|3|QM|QN|8b","👨🏽","man: medium skin tone","o|3|QP|QQ|8b","👨🏾","man: medium-dark skin tone","o|3|QS|QT|8b","👨🏿","man: dark skin tone","o|3|QV|QW|8b","🧔","person: beard","o|3|QY|QZ|8b","🧔🏻","person: light skin tone, beard","o|3|Qb|Qc|8b","🧔🏼","person: medium-light skin tone, beard","o|3|Qe|Qf|8b","🧔🏽","person: medium skin tone, beard","o|3|Qh|Qi|8b","🧔🏾","person: medium-dark skin tone, beard","o|3|Qk|Ql|8b","🧔🏿","person: dark skin tone, beard","o|3|Qn|Qo|8b","🧔‍♂️","man: beard","o|3|Qq|Qr|8b","🧔‍♂","o|3|Qt|Qr|8b","🧔🏻‍♂️","man: light skin tone, beard","o|3|Qv|Qw|8b","🧔🏻‍♂","o|3|Qy|Qw|8b","🧔🏼‍♂️","man: medium-light skin tone, beard","o|3|R0|R1|8b","🧔🏼‍♂","o|3|R3|R1|8b","🧔🏽‍♂️","man: medium skin tone, beard","o|3|R5|R6|8b","🧔🏽‍♂","o|3|R8|R6|8b","🧔🏾‍♂️","man: medium-dark skin tone, beard","o|3|RA|RB|8b","🧔🏾‍♂","o|3|RD|RB|8b","🧔🏿‍♂️","man: dark skin tone, beard","o|3|RF|RG|8b","🧔🏿‍♂","o|3|RI|RG|8b","🧔‍♀️","woman: beard","o|3|RK|RL|8b","🧔‍♀","o|3|RN|RL|8b","🧔🏻‍♀️","woman: light skin tone, beard","o|3|RP|RQ|8b","🧔🏻‍♀","o|3|RS|RQ|8b","🧔🏼‍♀️","woman: medium-light skin tone, beard","o|3|RU|RV|8b","🧔🏼‍♀","o|3|RX|RV|8b","🧔🏽‍♀️","woman: medium skin tone, beard","o|3|RZ|Ra|8b","🧔🏽‍♀","o|3|Rc|Ra|8b","🧔🏾‍♀️","woman: medium-dark skin tone, beard","o|3|Re|Rf|8b","🧔🏾‍♀","o|3|Rh|Rf|8b","🧔🏿‍♀️","woman: dark skin tone, beard","o|3|Rj|Rk|8b","🧔🏿‍♀","o|3|Rm|Rk|8b","👨‍🦰","man: red hair","o|3|Ro|Rp|8b","👨🏻‍🦰","man: light skin tone, red hair","o|3|Rr|Rs|8b","👨🏼‍🦰","man: medium-light skin tone, red hair","o|3|Ru|Rv|8b","👨🏽‍🦰","man: medium skin tone, red hair","o|3|Rx|Ry|8b","👨🏾‍🦰","man: medium-dark skin tone, red hair","o|3|S0|S1|8b","👨🏿‍🦰","man: dark skin tone, red hair","o|3|S3|S4|8b","👨‍🦱","man: curly hair","o|3|S6|S7|8b","👨🏻‍🦱","man: light skin tone, curly hair","o|3|S9|SA|8b","👨🏼‍🦱","man: medium-light skin tone, curly hair","o|3|SC|SD|8b","👨🏽‍🦱","man: medium skin tone, curly hair","o|3|SF|SG|8b","👨🏾‍🦱","man: medium-dark skin tone, curly hair","o|3|SI|SJ|8b","👨🏿‍🦱","man: dark skin tone, curly hair","o|3|SL|SM|8b","👨‍🦳","man: white hair","o|3|SO|SP|8b","👨🏻‍🦳","man: light skin tone, white hair","o|3|SR|SS|8b","👨🏼‍🦳","man: medium-light skin tone, white hair","o|3|SU|SV|8b","👨🏽‍🦳","man: medium skin tone, white hair","o|3|SX|SY|8b","👨🏾‍🦳","man: medium-dark skin tone, white hair","o|3|Sa|Sb|8b","👨🏿‍🦳","man: dark skin tone, white hair","o|3|Sd|Se|8b","👨‍🦲","man: bald","o|3|Sg|Sh|8b","👨🏻‍🦲","man: light skin tone, bald","o|3|Sj|Sk|8b","👨🏼‍🦲","man: medium-light skin tone, bald","o|3|Sm|Sn|8b","👨🏽‍🦲","man: medium skin tone, bald","o|3|Sp|Sq|8b","👨🏾‍🦲","man: medium-dark skin tone, bald","o|3|Ss|St|8b","👨🏿‍🦲","man: dark skin tone, bald","o|3|Sv|Sw|8b","👩","woman","o|3|Sy|Sz|8b","👩🏻","woman: light skin tone","o|3|T1|T2|8b","👩🏼","woman: medium-light skin tone","o|3|T4|T5|8b","👩🏽","woman: medium skin tone","o|3|T7|T8|8b","👩🏾","woman: medium-dark skin tone","o|3|TA|TB|8b","👩🏿","woman: dark skin tone","o|3|TD|TE|8b","👩‍🦰","woman: red hair","o|3|TG|TH|8b","👩🏻‍🦰","woman: light skin tone, red hair","o|3|TJ|TK|8b","👩🏼‍🦰","woman: medium-light skin tone, red hair","o|3|TM|TN|8b","👩🏽‍🦰","woman: medium skin tone, red hair","o|3|TP|TQ|8b","👩🏾‍🦰","woman: medium-dark skin tone, red hair","o|3|TS|TT|8b","👩🏿‍🦰","woman: dark skin tone, red hair","o|3|TV|TW|8b","🧑‍🦰","person: red hair","o|3|TY|TZ|8b","🧑🏻‍🦰","person: light skin tone, red hair","o|3|Tb|Tc|8b","🧑🏼‍🦰","person: medium-light skin tone, red hair","o|3|Te|Tf|8b","🧑🏽‍🦰","person: medium skin tone, red hair","o|3|Th|Ti|8b","🧑🏾‍🦰","person: medium-dark skin tone, red hair","o|3|Tk|Tl|8b","🧑🏿‍🦰","person: dark skin tone, red hair","o|3|Tn|To|8b","👩‍🦱","woman: curly hair","o|3|Tq|Tr|8b","👩🏻‍🦱","woman: light skin tone, curly hair","o|3|Tt|Tu|8b","👩🏼‍🦱","woman: medium-light skin tone, curly hair","o|3|Tw|Tx|8b","👩🏽‍🦱","woman: medium skin tone, curly hair","o|3|Tz|U0|8b","👩🏾‍🦱","woman: medium-dark skin tone, curly hair","o|3|U2|U3|8b","👩🏿‍🦱","woman: dark skin tone, curly hair","o|3|U5|U6|8b","🧑‍🦱","person: curly hair","o|3|U8|U9|8b","🧑🏻‍🦱","person: light skin tone, curly hair","o|3|UB|UC|8b","🧑🏼‍🦱","person: medium-light skin tone, curly hair","o|3|UE|UF|8b","🧑🏽‍🦱","person: medium skin tone, curly hair","o|3|UH|UI|8b","🧑🏾‍🦱","person: medium-dark skin tone, curly hair","o|3|UK|UL|8b","🧑🏿‍🦱","person: dark skin tone, curly hair","o|3|UN|UO|8b","👩‍🦳","woman: white hair","o|3|UQ|UR|8b","👩🏻‍🦳","woman: light skin tone, white hair","o|3|UT|UU|8b","👩🏼‍🦳","woman: medium-light skin tone, white hair","o|3|UW|UX|8b","👩🏽‍🦳","woman: medium skin tone, white hair","o|3|UZ|Ua|8b","👩🏾‍🦳","woman: medium-dark skin tone, white hair","o|3|Uc|Ud|8b","👩🏿‍🦳","woman: dark skin tone, white hair","o|3|Uf|Ug|8b","🧑‍🦳","person: white hair","o|3|Ui|Uj|8b","🧑🏻‍🦳","person: light skin tone, white hair","o|3|Ul|Um|8b","🧑🏼‍🦳","person: medium-light skin tone, white hair","o|3|Uo|Up|8b","🧑🏽‍🦳","person: medium skin tone, white hair","o|3|Ur|Us|8b","🧑🏾‍🦳","person: medium-dark skin tone, white hair","o|3|Uu|Uv|8b","🧑🏿‍🦳","person: dark skin tone, white hair","o|3|Ux|Uy|8b","👩‍🦲","woman: bald","o|3|V0|V1|8b","👩🏻‍🦲","woman: light skin tone, bald","o|3|V3|V4|8b","👩🏼‍🦲","woman: medium-light skin tone, bald","o|3|V6|V7|8b","👩🏽‍🦲","woman: medium skin tone, bald","o|3|V9|VA|8b","👩🏾‍🦲","woman: medium-dark skin tone, bald","o|3|VC|VD|8b","👩🏿‍🦲","woman: dark skin tone, bald","o|3|VF|VG|8b","🧑‍🦲","person: bald","o|3|VI|VJ|8b","🧑🏻‍🦲","person: light skin tone, bald","o|3|VL|VM|8b","🧑🏼‍🦲","person: medium-light skin tone, bald","o|3|VO|VP|8b","🧑🏽‍🦲","person: medium skin tone, bald","o|3|VR|VS|8b","🧑🏾‍🦲","person: medium-dark skin tone, bald","o|3|VU|VV|8b","🧑🏿‍🦲","person: dark skin tone, bald","o|3|VX|VY|8b","👱‍♀️","woman: blond hair","o|3|Va|Vb|8b","👱‍♀","o|3|Vd|Vb|8b","👱🏻‍♀️","woman: light skin tone, blond hair","o|3|Vf|Vg|8b","👱🏻‍♀","o|3|Vi|Vg|8b","👱🏼‍♀️","woman: medium-light skin tone, blond hair","o|3|Vk|Vl|8b","👱🏼‍♀","o|3|Vn|Vl|8b","👱🏽‍♀️","woman: medium skin tone, blond hair","o|3|Vp|Vq|8b","👱🏽‍♀","o|3|Vs|Vq|8b","👱🏾‍♀️","woman: medium-dark skin tone, blond hair","o|3|Vu|Vv|8b","👱🏾‍♀","o|3|Vx|Vv|8b","👱🏿‍♀️","woman: dark skin tone, blond hair","o|3|Vz|W0|8b","👱🏿‍♀","o|3|W2|W0|8b","👱‍♂️","man: blond hair","o|3|W4|W5|8b","👱‍♂","o|3|W7|W5|8b","👱🏻‍♂️","man: light skin tone, blond hair","o|3|W9|WA|8b","👱🏻‍♂","o|3|WC|WA|8b","👱🏼‍♂️","man: medium-light skin tone, blond hair","o|3|WE|WF|8b","👱🏼‍♂","o|3|WH|WF|8b","👱🏽‍♂️","man: medium skin tone, blond hair","o|3|WJ|WK|8b","👱🏽‍♂","o|3|WM|WK|8b","👱🏾‍♂️","man: medium-dark skin tone, blond hair","o|3|WO|WP|8b","👱🏾‍♂","o|3|WR|WP|8b","👱🏿‍♂️","man: dark skin tone, blond hair","o|3|WT|WU|8b","👱🏿‍♂","o|3|WW|WU|8b","🧓","older person","o|3|WY|WZ|8b","🧓🏻","older person: light skin tone","o|3|Wb|Wc|8b","🧓🏼","older person: medium-light skin tone","o|3|We|Wf|8b","🧓🏽","older person: medium skin tone","o|3|Wh|Wi|8b","🧓🏾","older person: medium-dark skin tone","o|3|Wk|Wl|8b","🧓🏿","older person: dark skin tone","o|3|Wn|Wo|8b","👴","old man","o|3|Wq|Wr|8b","👴🏻","old man: light skin tone","o|3|Wt|Wu|8b","👴🏼","old man: medium-light skin tone","o|3|Ww|Wx|8b","👴🏽","old man: medium skin tone","o|3|Wz|X0|8b","👴🏾","old man: medium-dark skin tone","o|3|X2|X3|8b","👴🏿","old man: dark skin tone","o|3|X5|X6|8b","👵","old woman","o|3|X8|X9|8b","👵🏻","old woman: light skin tone","o|3|XB|XC|8b","👵🏼","old woman: medium-light skin tone","o|3|XE|XF|8b","👵🏽","old woman: medium skin tone","o|3|XH|XI|8b","👵🏾","old woman: medium-dark skin tone","o|3|XK|XL|8b","👵🏿","old woman: dark skin tone","o|3|XN|XO|8b","🙍","person frowning","o|3|XQ|XR|8b","🙍🏻","person frowning: light skin tone","o|3|XT|XU|8b","🙍🏼","person frowning: medium-light skin tone","o|3|XW|XX|8b","🙍🏽","person frowning: medium skin tone","o|3|XZ|Xa|8b","🙍🏾","person frowning: medium-dark skin tone","o|3|Xc|Xd|8b","🙍🏿","person frowning: dark skin tone","o|3|Xf|Xg|8b","🙍‍♂️","man frowning","o|3|Xi|Xj|8b","🙍‍♂","o|3|Xl|Xj|8b","🙍🏻‍♂️","man frowning: light skin tone","o|3|Xn|Xo|8b","🙍🏻‍♂","o|3|Xq|Xo|8b","🙍🏼‍♂️","man frowning: medium-light skin tone","o|3|Xs|Xt|8b","🙍🏼‍♂","o|3|Xv|Xt|8b","🙍🏽‍♂️","man frowning: medium skin tone","o|3|Xx|Xy|8b","🙍🏽‍♂","o|3|Y0|Xy|8b","🙍🏾‍♂️","man frowning: medium-dark skin tone","o|3|Y2|Y3|8b","🙍🏾‍♂","o|3|Y5|Y3|8b","🙍🏿‍♂️","man frowning: dark skin tone","o|3|Y7|Y8|8b","🙍🏿‍♂","o|3|YA|Y8|8b","🙍‍♀️","woman frowning","o|3|YC|YD|8b","🙍‍♀","o|3|YF|YD|8b","🙍🏻‍♀️","woman frowning: light skin tone","o|3|YH|YI|8b","🙍🏻‍♀","o|3|YK|YI|8b","🙍🏼‍♀️","woman frowning: medium-light skin tone","o|3|YM|YN|8b","🙍🏼‍♀","o|3|YP|YN|8b","🙍🏽‍♀️","woman frowning: medium skin tone","o|3|YR|YS|8b","🙍🏽‍♀","o|3|YU|YS|8b","🙍🏾‍♀️","woman frowning: medium-dark skin tone","o|3|YW|YX|8b","🙍🏾‍♀","o|3|YZ|YX|8b","🙍🏿‍♀️","woman frowning: dark skin tone","o|3|Yb|Yc|8b","🙍🏿‍♀","o|3|Ye|Yc|8b","🙎","person pouting","o|3|Yg|Yh|8b","🙎🏻","person pouting: light skin tone","o|3|Yj|Yk|8b","🙎🏼","person pouting: medium-light skin tone","o|3|Ym|Yn|8b","🙎🏽","person pouting: medium skin tone","o|3|Yp|Yq|8b","🙎🏾","person pouting: medium-dark skin tone","o|3|Ys|Yt|8b","🙎🏿","person pouting: dark skin tone","o|3|Yv|Yw|8b","🙎‍♂️","man pouting","o|3|Yy|Yz|8b","🙎‍♂","o|3|Z1|Yz|8b","🙎🏻‍♂️","man pouting: light skin tone","o|3|Z3|Z4|8b","🙎🏻‍♂","o|3|Z6|Z4|8b","🙎🏼‍♂️","man pouting: medium-light skin tone","o|3|Z8|Z9|8b","🙎🏼‍♂","o|3|ZB|Z9|8b","🙎🏽‍♂️","man pouting: medium skin tone","o|3|ZD|ZE|8b","🙎🏽‍♂","o|3|ZG|ZE|8b","🙎🏾‍♂️","man pouting: medium-dark skin tone","o|3|ZI|ZJ|8b","🙎🏾‍♂","o|3|ZL|ZJ|8b","🙎🏿‍♂️","man pouting: dark skin tone","o|3|ZN|ZO|8b","🙎🏿‍♂","o|3|ZQ|ZO|8b","🙎‍♀️","woman pouting","o|3|ZS|ZT|8b","🙎‍♀","o|3|ZV|ZT|8b","🙎🏻‍♀️","woman pouting: light skin tone","o|3|ZX|ZY|8b","🙎🏻‍♀","o|3|Za|ZY|8b","🙎🏼‍♀️","woman pouting: medium-light skin tone","o|3|Zc|Zd|8b","🙎🏼‍♀","o|3|Zf|Zd|8b","🙎🏽‍♀️","woman pouting: medium skin tone","o|3|Zh|Zi|8b","🙎🏽‍♀","o|3|Zk|Zi|8b","🙎🏾‍♀️","woman pouting: medium-dark skin tone","o|3|Zm|Zn|8b","🙎🏾‍♀","o|3|Zp|Zn|8b","🙎🏿‍♀️","woman pouting: dark skin tone","o|3|Zr|Zs|8b","🙎🏿‍♀","o|3|Zu|Zs|8b","🙅","person gesturing NO","o|3|Zw|Zx|8b","🙅🏻","person gesturing NO: light skin tone","o|3|Zz|a0|8b","🙅🏼","person gesturing NO: medium-light skin tone","o|3|a2|a3|8b","🙅🏽","person gesturing NO: medium skin tone","o|3|a5|a6|8b","🙅🏾","person gesturing NO: medium-dark skin tone","o|3|a8|a9|8b","🙅🏿","person gesturing NO: dark skin tone","o|3|aB|aC|8b","🙅‍♂️","man gesturing NO","o|3|aE|aF|8b","🙅‍♂","o|3|aH|aF|8b","🙅🏻‍♂️","man gesturing NO: light skin tone","o|3|aJ|aK|8b","🙅🏻‍♂","o|3|aM|aK|8b","🙅🏼‍♂️","man gesturing NO: medium-light skin tone","o|3|aO|aP|8b","🙅🏼‍♂","o|3|aR|aP|8b","🙅🏽‍♂️","man gesturing NO: medium skin tone","o|3|aT|aU|8b","🙅🏽‍♂","o|3|aW|aU|8b","🙅🏾‍♂️","man gesturing NO: medium-dark skin tone","o|3|aY|aZ|8b","🙅🏾‍♂","o|3|ab|aZ|8b","🙅🏿‍♂️","man gesturing NO: dark skin tone","o|3|ad|ae|8b","🙅🏿‍♂","o|3|ag|ae|8b","🙅‍♀️","woman gesturing NO","o|3|ai|aj|8b","🙅‍♀","o|3|al|aj|8b","🙅🏻‍♀️","woman gesturing NO: light skin tone","o|3|an|ao|8b","🙅🏻‍♀","o|3|aq|ao|8b","🙅🏼‍♀️","woman gesturing NO: medium-light skin tone","o|3|as|at|8b","🙅🏼‍♀","o|3|av|at|8b","🙅🏽‍♀️","woman gesturing NO: medium skin tone","o|3|ax|ay|8b","🙅🏽‍♀","o|3|b0|ay|8b","🙅🏾‍♀️","woman gesturing NO: medium-dark skin tone","o|3|b2|b3|8b","🙅🏾‍♀","o|3|b5|b3|8b","🙅🏿‍♀️","woman gesturing NO: dark skin tone","o|3|b7|b8|8b","🙅🏿‍♀","o|3|bA|b8|8b","🙆","person gesturing OK","o|3|bC|bD|8b","🙆🏻","person gesturing OK: light skin tone","o|3|bF|bG|8b","🙆🏼","person gesturing OK: medium-light skin tone","o|3|bI|bJ|8b","🙆🏽","person gesturing OK: medium skin tone","o|3|bL|bM|8b","🙆🏾","person gesturing OK: medium-dark skin tone","o|3|bO|bP|8b","🙆🏿","person gesturing OK: dark skin tone","o|3|bR|bS|8b","🙆‍♂️","man gesturing OK","o|3|bU|bV|8b","🙆‍♂","o|3|bX|bV|8b","🙆🏻‍♂️","man gesturing OK: light skin tone","o|3|bZ|ba|8b","🙆🏻‍♂","o|3|bc|ba|8b","🙆🏼‍♂️","man gesturing OK: medium-light skin tone","o|3|be|bf|8b","🙆🏼‍♂","o|3|bh|bf|8b","🙆🏽‍♂️","man gesturing OK: medium skin tone","o|3|bj|bk|8b","🙆🏽‍♂","o|3|bm|bk|8b","🙆🏾‍♂️","man gesturing OK: medium-dark skin tone","o|3|bo|bp|8b","🙆🏾‍♂","o|3|br|bp|8b","🙆🏿‍♂️","man gesturing OK: dark skin tone","o|3|bt|bu|8b","🙆🏿‍♂","o|3|bw|bu|8b","🙆‍♀️","woman gesturing OK","o|3|by|bz|8b","🙆‍♀","o|3|c1|bz|8b","🙆🏻‍♀️","woman gesturing OK: light skin tone","o|3|c3|c4|8b","🙆🏻‍♀","o|3|c6|c4|8b","🙆🏼‍♀️","woman gesturing OK: medium-light skin tone","o|3|c8|c9|8b","🙆🏼‍♀","o|3|cB|c9|8b","🙆🏽‍♀️","woman gesturing OK: medium skin tone","o|3|cD|cE|8b","🙆🏽‍♀","o|3|cG|cE|8b","🙆🏾‍♀️","woman gesturing OK: medium-dark skin tone","o|3|cI|cJ|8b","🙆🏾‍♀","o|3|cL|cJ|8b","🙆🏿‍♀️","woman gesturing OK: dark skin tone","o|3|cN|cO|8b","🙆🏿‍♀","o|3|cQ|cO|8b","💁","person tipping hand","o|3|cS|cT|8b","💁🏻","person tipping hand: light skin tone","o|3|cV|cW|8b","💁🏼","person tipping hand: medium-light skin tone","o|3|cY|cZ|8b","💁🏽","person tipping hand: medium skin tone","o|3|cb|cc|8b","💁🏾","person tipping hand: medium-dark skin tone","o|3|ce|cf|8b","💁🏿","person tipping hand: dark skin tone","o|3|ch|ci|8b","💁‍♂️","man tipping hand","o|3|ck|cl|8b","💁‍♂","o|3|cn|cl|8b","💁🏻‍♂️","man tipping hand: light skin tone","o|3|cp|cq|8b","💁🏻‍♂","o|3|cs|cq|8b","💁🏼‍♂️","man tipping hand: medium-light skin tone","o|3|cu|cv|8b","💁🏼‍♂","o|3|cx|cv|8b","💁🏽‍♂️","man tipping hand: medium skin tone","o|3|cz|d0|8b","💁🏽‍♂","o|3|d2|d0|8b","💁🏾‍♂️","man tipping hand: medium-dark skin tone","o|3|d4|d5|8b","💁🏾‍♂","o|3|d7|d5|8b","💁🏿‍♂️","man tipping hand: dark skin tone","o|3|d9|dA|8b","💁🏿‍♂","o|3|dC|dA|8b","💁‍♀️","woman tipping hand","o|3|dE|dF|8b","💁‍♀","o|3|dH|dF|8b","💁🏻‍♀️","woman tipping hand: light skin tone","o|3|dJ|dK|8b","💁🏻‍♀","o|3|dM|dK|8b","💁🏼‍♀️","woman tipping hand: medium-light skin tone","o|3|dO|dP|8b","💁🏼‍♀","o|3|dR|dP|8b","💁🏽‍♀️","woman tipping hand: medium skin tone","o|3|dT|dU|8b","💁🏽‍♀","o|3|dW|dU|8b","💁🏾‍♀️","woman tipping hand: medium-dark skin tone","o|3|dY|dZ|8b","💁🏾‍♀","o|3|db|dZ|8b","💁🏿‍♀️","woman tipping hand: dark skin tone","o|3|dd|de|8b","💁🏿‍♀","o|3|dg|de|8b","🙋","person raising hand","o|3|di|dj|8b","🙋🏻","person raising hand: light skin tone","o|3|dl|dm|8b","🙋🏼","person raising hand: medium-light skin tone","o|3|do|dp|8b","🙋🏽","person raising hand: medium skin tone","o|3|dr|ds|8b","🙋🏾","person raising hand: medium-dark skin tone","o|3|du|dv|8b","🙋🏿","person raising hand: dark skin tone","o|3|dx|dy|8b","🙋‍♂️","man raising hand","o|3|e0|e1|8b","🙋‍♂","o|3|e3|e1|8b","🙋🏻‍♂️","man raising hand: light skin tone","o|3|e5|e6|8b","🙋🏻‍♂","o|3|e8|e6|8b","🙋🏼‍♂️","man raising hand: medium-light skin tone","o|3|eA|eB|8b","🙋🏼‍♂","o|3|eD|eB|8b","🙋🏽‍♂️","man raising hand: medium skin tone","o|3|eF|eG|8b","🙋🏽‍♂","o|3|eI|eG|8b","🙋🏾‍♂️","man raising hand: medium-dark skin tone","o|3|eK|eL|8b","🙋🏾‍♂","o|3|eN|eL|8b","🙋🏿‍♂️","man raising hand: dark skin tone","o|3|eP|eQ|8b","🙋🏿‍♂","o|3|eS|eQ|8b","🙋‍♀️","woman raising hand","o|3|eU|eV|8b","🙋‍♀","o|3|eX|eV|8b","🙋🏻‍♀️","woman raising hand: light skin tone","o|3|eZ|ea|8b","🙋🏻‍♀","o|3|ec|ea|8b","🙋🏼‍♀️","woman raising hand: medium-light skin tone","o|3|ee|ef|8b","🙋🏼‍♀","o|3|eh|ef|8b","🙋🏽‍♀️","woman raising hand: medium skin tone","o|3|ej|ek|8b","🙋🏽‍♀","o|3|em|ek|8b","🙋🏾‍♀️","woman raising hand: medium-dark skin tone","o|3|eo|ep|8b","🙋🏾‍♀","o|3|er|ep|8b","🙋🏿‍♀️","woman raising hand: dark skin tone","o|3|et|eu|8b","🙋🏿‍♀","o|3|ew|eu|8b","🧏","deaf person","o|3|ey|ez|8b","🧏🏻","deaf person: light skin tone","o|3|f1|f2|8b","🧏🏼","deaf person: medium-light skin tone","o|3|f4|f5|8b","🧏🏽","deaf person: medium skin tone","o|3|f7|f8|8b","🧏🏾","deaf person: medium-dark skin tone","o|3|fA|fB|8b","🧏🏿","deaf person: dark skin tone","o|3|fD|fE|8b","🧏‍♂️","deaf man","o|3|fG|fH|8b","🧏‍♂","o|3|fJ|fH|8b","🧏🏻‍♂️","deaf man: light skin tone","o|3|fL|fM|8b","🧏🏻‍♂","o|3|fO|fM|8b","🧏🏼‍♂️","deaf man: medium-light skin tone","o|3|fQ|fR|8b","🧏🏼‍♂","o|3|fT|fR|8b","🧏🏽‍♂️","deaf man: medium skin tone","o|3|fV|fW|8b","🧏🏽‍♂","o|3|fY|fW|8b","🧏🏾‍♂️","deaf man: medium-dark skin tone","o|3|fa|fb|8b","🧏🏾‍♂","o|3|fd|fb|8b","🧏🏿‍♂️","deaf man: dark skin tone","o|3|ff|fg|8b","🧏🏿‍♂","o|3|fi|fg|8b","🧏‍♀️","deaf woman","o|3|fk|fl|8b","🧏‍♀","o|3|fn|fl|8b","🧏🏻‍♀️","deaf woman: light skin tone","o|3|fp|fq|8b","🧏🏻‍♀","o|3|fs|fq|8b","🧏🏼‍♀️","deaf woman: medium-light skin tone","o|3|fu|fv|8b","🧏🏼‍♀","o|3|fx|fv|8b","🧏🏽‍♀️","deaf woman: medium skin tone","o|3|fz|g0|8b","🧏🏽‍♀","o|3|g2|g0|8b","🧏🏾‍♀️","deaf woman: medium-dark skin tone","o|3|g4|g5|8b","🧏🏾‍♀","o|3|g7|g5|8b","🧏🏿‍♀️","deaf woman: dark skin tone","o|3|g9|gA|8b","🧏🏿‍♀","o|3|gC|gA|8b","🙇","person bowing","o|3|gE|gF|8b","🙇🏻","person bowing: light skin tone","o|3|gH|gI|8b","🙇🏼","person bowing: medium-light skin tone","o|3|gK|gL|8b","🙇🏽","person bowing: medium skin tone","o|3|gN|gO|8b","🙇🏾","person bowing: medium-dark skin tone","o|3|gQ|gR|8b","🙇🏿","person bowing: dark skin tone","o|3|gT|gU|8b","🙇‍♂️","man bowing","o|3|gW|gX|8b","🙇‍♂","o|3|gZ|gX|8b","🙇🏻‍♂️","man bowing: light skin tone","o|3|gb|gc|8b","🙇🏻‍♂","o|3|ge|gc|8b","🙇🏼‍♂️","man bowing: medium-light skin tone","o|3|gg|gh|8b","🙇🏼‍♂","o|3|gj|gh|8b","🙇🏽‍♂️","man bowing: medium skin tone","o|3|gl|gm|8b","🙇🏽‍♂","o|3|go|gm|8b","🙇🏾‍♂️","man bowing: medium-dark skin tone","o|3|gq|gr|8b","🙇🏾‍♂","o|3|gt|gr|8b","🙇🏿‍♂️","man bowing: dark skin tone","o|3|gv|gw|8b","🙇🏿‍♂","o|3|gy|gw|8b","🙇‍♀️","woman bowing","o|3|h0|h1|8b","🙇‍♀","o|3|h3|h1|8b","🙇🏻‍♀️","woman bowing: light skin tone","o|3|h5|h6|8b","🙇🏻‍♀","o|3|h8|h6|8b","🙇🏼‍♀️","woman bowing: medium-light skin tone","o|3|hA|hB|8b","🙇🏼‍♀","o|3|hD|hB|8b","🙇🏽‍♀️","woman bowing: medium skin tone","o|3|hF|hG|8b","🙇🏽‍♀","o|3|hI|hG|8b","🙇🏾‍♀️","woman bowing: medium-dark skin tone","o|3|hK|hL|8b","🙇🏾‍♀","o|3|hN|hL|8b","🙇🏿‍♀️","woman bowing: dark skin tone","o|3|hP|hQ|8b","🙇🏿‍♀","o|3|hS|hQ|8b","🤦","person facepalming","o|3|hU|hV|8b","🤦🏻","person facepalming: light skin tone","o|3|hX|hY|8b","🤦🏼","person facepalming: medium-light skin tone","o|3|ha|hb|8b","🤦🏽","person facepalming: medium skin tone","o|3|hd|he|8b","🤦🏾","person facepalming: medium-dark skin tone","o|3|hg|hh|8b","🤦🏿","person facepalming: dark skin tone","o|3|hj|hk|8b","🤦‍♂️","man facepalming","o|3|hm|hn|8b","🤦‍♂","o|3|hp|hn|8b","🤦🏻‍♂️","man facepalming: light skin tone","o|3|hr|hs|8b","🤦🏻‍♂","o|3|hu|hs|8b","🤦🏼‍♂️","man facepalming: medium-light skin tone","o|3|hw|hx|8b","🤦🏼‍♂","o|3|hz|hx|8b","🤦🏽‍♂️","man facepalming: medium skin tone","o|3|i1|i2|8b","🤦🏽‍♂","o|3|i4|i2|8b","🤦🏾‍♂️","man facepalming: medium-dark skin tone","o|3|i6|i7|8b","🤦🏾‍♂","o|3|i9|i7|8b","🤦🏿‍♂️","man facepalming: dark skin tone","o|3|iB|iC|8b","🤦🏿‍♂","o|3|iE|iC|8b","🤦‍♀️","woman facepalming","o|3|iG|iH|8b","🤦‍♀","o|3|iJ|iH|8b","🤦🏻‍♀️","woman facepalming: light skin tone","o|3|iL|iM|8b","🤦🏻‍♀","o|3|iO|iM|8b","🤦🏼‍♀️","woman facepalming: medium-light skin tone","o|3|iQ|iR|8b","🤦🏼‍♀","o|3|iT|iR|8b","🤦🏽‍♀️","woman facepalming: medium skin tone","o|3|iV|iW|8b","🤦🏽‍♀","o|3|iY|iW|8b","🤦🏾‍♀️","woman facepalming: medium-dark skin tone","o|3|ia|ib|8b","🤦🏾‍♀","o|3|id|ib|8b","🤦🏿‍♀️","woman facepalming: dark skin tone","o|3|if|ig|8b","🤦🏿‍♀","o|3|ii|ig|8b","🤷","person shrugging","o|3|ik|il|8b","🤷🏻","person shrugging: light skin tone","o|3|in|io|8b","🤷🏼","person shrugging: medium-light skin tone","o|3|iq|ir|8b","🤷🏽","person shrugging: medium skin tone","o|3|it|iu|8b","🤷🏾","person shrugging: medium-dark skin tone","o|3|iw|ix|8b","🤷🏿","person shrugging: dark skin tone","o|3|iz|j0|8b","🤷‍♂️","man shrugging","o|3|j2|j3|8b","🤷‍♂","o|3|j5|j3|8b","🤷🏻‍♂️","man shrugging: light skin tone","o|3|j7|j8|8b","🤷🏻‍♂","o|3|jA|j8|8b","🤷🏼‍♂️","man shrugging: medium-light skin tone","o|3|jC|jD|8b","🤷🏼‍♂","o|3|jF|jD|8b","🤷🏽‍♂️","man shrugging: medium skin tone","o|3|jH|jI|8b","🤷🏽‍♂","o|3|jK|jI|8b","🤷🏾‍♂️","man shrugging: medium-dark skin tone","o|3|jM|jN|8b","🤷🏾‍♂","o|3|jP|jN|8b","🤷🏿‍♂️","man shrugging: dark skin tone","o|3|jR|jS|8b","🤷🏿‍♂","o|3|jU|jS|8b","🤷‍♀️","woman shrugging","o|3|jW|jX|8b","🤷‍♀","o|3|jZ|jX|8b","🤷🏻‍♀️","woman shrugging: light skin tone","o|3|jb|jc|8b","🤷🏻‍♀","o|3|je|jc|8b","🤷🏼‍♀️","woman shrugging: medium-light skin tone","o|3|jg|jh|8b","🤷🏼‍♀","o|3|jj|jh|8b","🤷🏽‍♀️","woman shrugging: medium skin tone","o|3|jl|jm|8b","🤷🏽‍♀","o|3|jo|jm|8b","🤷🏾‍♀️","woman shrugging: medium-dark skin tone","o|3|jq|jr|8b","🤷🏾‍♀","o|3|jt|jr|8b","🤷🏿‍♀️","woman shrugging: dark skin tone","o|3|jv|jw|8b","🤷🏿‍♀","o|3|jy|jw|8b","🧑‍⚕️","health worker","o|3|k0|k1|8b","🧑‍⚕","o|3|k3|k1|8b","🧑🏻‍⚕️","health worker: light skin tone","o|3|k5|k6|8b","🧑🏻‍⚕","o|3|k8|k6|8b","🧑🏼‍⚕️","health worker: medium-light skin tone","o|3|kA|kB|8b","🧑🏼‍⚕","o|3|kD|kB|8b","🧑🏽‍⚕️","health worker: medium skin tone","o|3|kF|kG|8b","🧑🏽‍⚕","o|3|kI|kG|8b","🧑🏾‍⚕️","health worker: medium-dark skin tone","o|3|kK|kL|8b","🧑🏾‍⚕","o|3|kN|kL|8b","🧑🏿‍⚕️","health worker: dark skin tone","o|3|kP|kQ|8b","🧑🏿‍⚕","o|3|kS|kQ|8b","👨‍⚕️","man health worker","o|3|kU|kV|8b","👨‍⚕","o|3|kX|kV|8b","👨🏻‍⚕️","man health worker: light skin tone","o|3|kZ|ka|8b","👨🏻‍⚕","o|3|kc|ka|8b","👨🏼‍⚕️","man health worker: medium-light skin tone","o|3|ke|kf|8b","👨🏼‍⚕","o|3|kh|kf|8b","👨🏽‍⚕️","man health worker: medium skin tone","o|3|kj|kk|8b","👨🏽‍⚕","o|3|km|kk|8b","👨🏾‍⚕️","man health worker: medium-dark skin tone","o|3|ko|kp|8b","👨🏾‍⚕","o|3|kr|kp|8b","👨🏿‍⚕️","man health worker: dark skin tone","o|3|kt|ku|8b","👨🏿‍⚕","o|3|kw|ku|8b","👩‍⚕️","woman health worker","o|3|ky|kz|8b","👩‍⚕","o|3|l1|kz|8b","👩🏻‍⚕️","woman health worker: light skin tone","o|3|l3|l4|8b","👩🏻‍⚕","o|3|l6|l4|8b","👩🏼‍⚕️","woman health worker: medium-light skin tone","o|3|l8|l9|8b","👩🏼‍⚕","o|3|lB|l9|8b","👩🏽‍⚕️","woman health worker: medium skin tone","o|3|lD|lE|8b","👩🏽‍⚕","o|3|lG|lE|8b","👩🏾‍⚕️","woman health worker: medium-dark skin tone","o|3|lI|lJ|8b","👩🏾‍⚕","o|3|lL|lJ|8b","👩🏿‍⚕️","woman health worker: dark skin tone","o|3|lN|lO|8b","👩🏿‍⚕","o|3|lQ|lO|8b","🧑‍🎓","student","o|3|lS|lT|8b","🧑🏻‍🎓","student: light skin tone","o|3|lV|lW|8b","🧑🏼‍🎓","student: medium-light skin tone","o|3|lY|lZ|8b","🧑🏽‍🎓","student: medium skin tone","o|3|lb|lc|8b","🧑🏾‍🎓","student: medium-dark skin tone","o|3|le|lf|8b","🧑🏿‍🎓","student: dark skin tone","o|3|lh|li|8b","👨‍🎓","man student","o|3|lk|ll|8b","👨🏻‍🎓","man student: light skin tone","o|3|ln|lo|8b","👨🏼‍🎓","man student: medium-light skin tone","o|3|lq|lr|8b","👨🏽‍🎓","man student: medium skin tone","o|3|lt|lu|8b","👨🏾‍🎓","man student: medium-dark skin tone","o|3|lw|lx|8b","👨🏿‍🎓","man student: dark skin tone","o|3|lz|m0|8b","👩‍🎓","woman student","o|3|m2|m3|8b","👩🏻‍🎓","woman student: light skin tone","o|3|m5|m6|8b","👩🏼‍🎓","woman student: medium-light skin tone","o|3|m8|m9|8b","👩🏽‍🎓","woman student: medium skin tone","o|3|mB|mC|8b","👩🏾‍🎓","woman student: medium-dark skin tone","o|3|mE|mF|8b","👩🏿‍🎓","woman student: dark skin tone","o|3|mH|mI|8b","🧑‍🏫","teacher","o|3|mK|mL|8b","🧑🏻‍🏫","teacher: light skin tone","o|3|mN|mO|8b","🧑🏼‍🏫","teacher: medium-light skin tone","o|3|mQ|mR|8b","🧑🏽‍🏫","teacher: medium skin tone","o|3|mT|mU|8b","🧑🏾‍🏫","teacher: medium-dark skin tone","o|3|mW|mX|8b","🧑🏿‍🏫","teacher: dark skin tone","o|3|mZ|ma|8b","👨‍🏫","man teacher","o|3|mc|md|8b","👨🏻‍🏫","man teacher: light skin tone","o|3|mf|mg|8b","👨🏼‍🏫","man teacher: medium-light skin tone","o|3|mi|mj|8b","👨🏽‍🏫","man teacher: medium skin tone","o|3|ml|mm|8b","👨🏾‍🏫","man teacher: medium-dark skin tone","o|3|mo|mp|8b","👨🏿‍🏫","man teacher: dark skin tone","o|3|mr|ms|8b","👩‍🏫","woman teacher","o|3|mu|mv|8b","👩🏻‍🏫","woman teacher: light skin tone","o|3|mx|my|8b","👩🏼‍🏫","woman teacher: medium-light skin tone","o|3|n0|n1|8b","👩🏽‍🏫","woman teacher: medium skin tone","o|3|n3|n4|8b","👩🏾‍🏫","woman teacher: medium-dark skin tone","o|3|n6|n7|8b","👩🏿‍🏫","woman teacher: dark skin tone","o|3|n9|nA|8b","🧑‍⚖️","judge","o|3|nC|nD|8b","🧑‍⚖","o|3|nF|nD|8b","🧑🏻‍⚖️","judge: light skin tone","o|3|nH|nI|8b","🧑🏻‍⚖","o|3|nK|nI|8b","🧑🏼‍⚖️","judge: medium-light skin tone","o|3|nM|nN|8b","🧑🏼‍⚖","o|3|nP|nN|8b","🧑🏽‍⚖️","judge: medium skin tone","o|3|nR|nS|8b","🧑🏽‍⚖","o|3|nU|nS|8b","🧑🏾‍⚖️","judge: medium-dark skin tone","o|3|nW|nX|8b","🧑🏾‍⚖","o|3|nZ|nX|8b","🧑🏿‍⚖️","judge: dark skin tone","o|3|nb|nc|8b","🧑🏿‍⚖","o|3|ne|nc|8b","👨‍⚖️","man judge","o|3|ng|nh|8b","👨‍⚖","o|3|nj|nh|8b","👨🏻‍⚖️","man judge: light skin tone","o|3|nl|nm|8b","👨🏻‍⚖","o|3|no|nm|8b","👨🏼‍⚖️","man judge: medium-light skin tone","o|3|nq|nr|8b","👨🏼‍⚖","o|3|nt|nr|8b","👨🏽‍⚖️","man judge: medium skin tone","o|3|nv|nw|8b","👨🏽‍⚖","o|3|ny|nw|8b","👨🏾‍⚖️","man judge: medium-dark skin tone","o|3|o0|o1|8b","👨🏾‍⚖","o|3|o3|o1|8b","👨🏿‍⚖️","man judge: dark skin tone","o|3|o5|o6|8b","👨🏿‍⚖","o|3|o8|o6|8b","👩‍⚖️","woman judge","o|3|oA|oB|8b","👩‍⚖","o|3|oD|oB|8b","👩🏻‍⚖️","woman judge: light skin tone","o|3|oF|oG|8b","👩🏻‍⚖","o|3|oI|oG|8b","👩🏼‍⚖️","woman judge: medium-light skin tone","o|3|oK|oL|8b","👩🏼‍⚖","o|3|oN|oL|8b","👩🏽‍⚖️","woman judge: medium skin tone","o|3|oP|oQ|8b","👩🏽‍⚖","o|3|oS|oQ|8b","👩🏾‍⚖️","woman judge: medium-dark skin tone","o|3|oU|oV|8b","👩🏾‍⚖","o|3|oX|oV|8b","👩🏿‍⚖️","woman judge: dark skin tone","o|3|oZ|oa|8b","👩🏿‍⚖","o|3|oc|oa|8b","🧑‍🌾","farmer","o|3|oe|of|8b","🧑🏻‍🌾","farmer: light skin tone","o|3|oh|oi|8b","🧑🏼‍🌾","farmer: medium-light skin tone","o|3|ok|ol|8b","🧑🏽‍🌾","farmer: medium skin tone","o|3|on|oo|8b","🧑🏾‍🌾","farmer: medium-dark skin tone","o|3|oq|or|8b","🧑🏿‍🌾","farmer: dark skin tone","o|3|ot|ou|8b","👨‍🌾","man farmer","o|3|ow|ox|8b","👨🏻‍🌾","man farmer: light skin tone","o|3|oz|p0|8b","👨🏼‍🌾","man farmer: medium-light skin tone","o|3|p2|p3|8b","👨🏽‍🌾","man farmer: medium skin tone","o|3|p5|p6|8b","👨🏾‍🌾","man farmer: medium-dark skin tone","o|3|p8|p9|8b","👨🏿‍🌾","man farmer: dark skin tone","o|3|pB|pC|8b","👩‍🌾","woman farmer","o|3|pE|pF|8b","👩🏻‍🌾","woman farmer: light skin tone","o|3|pH|pI|8b","👩🏼‍🌾","woman farmer: medium-light skin tone","o|3|pK|pL|8b","👩🏽‍🌾","woman farmer: medium skin tone","o|3|pN|pO|8b","👩🏾‍🌾","woman farmer: medium-dark skin tone","o|3|pQ|pR|8b","👩🏿‍🌾","woman farmer: dark skin tone","o|3|pT|pU|8b","🧑‍🍳","cook","o|3|pW|pX|8b","🧑🏻‍🍳","cook: light skin tone","o|3|pZ|pa|8b","🧑🏼‍🍳","cook: medium-light skin tone","o|3|pc|pd|8b","🧑🏽‍🍳","cook: medium skin tone","o|3|pf|pg|8b","🧑🏾‍🍳","cook: medium-dark skin tone","o|3|pi|pj|8b","🧑🏿‍🍳","cook: dark skin tone","o|3|pl|pm|8b","👨‍🍳","man cook","o|3|po|pp|8b","👨🏻‍🍳","man cook: light skin tone","o|3|pr|ps|8b","👨🏼‍🍳","man cook: medium-light skin tone","o|3|pu|pv|8b","👨🏽‍🍳","man cook: medium skin tone","o|3|px|py|8b","👨🏾‍🍳","man cook: medium-dark skin tone","o|3|q0|q1|8b","👨🏿‍🍳","man cook: dark skin tone","o|3|q3|q4|8b","👩‍🍳","woman cook","o|3|q6|q7|8b","👩🏻‍🍳","woman cook: light skin tone","o|3|q9|qA|8b","👩🏼‍🍳","woman cook: medium-light skin tone","o|3|qC|qD|8b","👩🏽‍🍳","woman cook: medium skin tone","o|3|qF|qG|8b","👩🏾‍🍳","woman cook: medium-dark skin tone","o|3|qI|qJ|8b","👩🏿‍🍳","woman cook: dark skin tone","o|3|qL|qM|8b","🧑‍🔧","mechanic","o|3|qO|qP|8b","🧑🏻‍🔧","mechanic: light skin tone","o|3|qR|qS|8b","🧑🏼‍🔧","mechanic: medium-light skin tone","o|3|qU|qV|8b","🧑🏽‍🔧","mechanic: medium skin tone","o|3|qX|qY|8b","🧑🏾‍🔧","mechanic: medium-dark skin tone","o|3|qa|qb|8b","🧑🏿‍🔧","mechanic: dark skin tone","o|3|qd|qe|8b","👨‍🔧","man mechanic","o|3|qg|qh|8b","👨🏻‍🔧","man mechanic: light skin tone","o|3|qj|qk|8b","👨🏼‍🔧","man mechanic: medium-light skin tone","o|3|qm|qn|8b","👨🏽‍🔧","man mechanic: medium skin tone","o|3|qp|qq|8b","👨🏾‍🔧","man mechanic: medium-dark skin tone","o|3|qs|qt|8b","👨🏿‍🔧","man mechanic: dark skin tone","o|3|qv|qw|8b","👩‍🔧","woman mechanic","o|3|qy|qz|8b","👩🏻‍🔧","woman mechanic: light skin tone","o|3|r1|r2|8b","👩🏼‍🔧","woman mechanic: medium-light skin tone","o|3|r4|r5|8b","👩🏽‍🔧","woman mechanic: medium skin tone","o|3|r7|r8|8b","👩🏾‍🔧","woman mechanic: medium-dark skin tone","o|3|rA|rB|8b","👩🏿‍🔧","woman mechanic: dark skin tone","o|3|rD|rE|8b","🧑‍🏭","factory worker","o|3|rG|rH|8b","🧑🏻‍🏭","factory worker: light skin tone","o|3|rJ|rK|8b","🧑🏼‍🏭","factory worker: medium-light skin tone","o|3|rM|rN|8b","🧑🏽‍🏭","factory worker: medium skin tone","o|3|rP|rQ|8b","🧑🏾‍🏭","factory worker: medium-dark skin tone","o|3|rS|rT|8b","🧑🏿‍🏭","factory worker: dark skin tone","o|3|rV|rW|8b","👨‍🏭","man factory worker","o|3|rY|rZ|8b","👨🏻‍🏭","man factory worker: light skin tone","o|3|rb|rc|8b","👨🏼‍🏭","man factory worker: medium-light skin tone","o|3|re|rf|8b","👨🏽‍🏭","man factory worker: medium skin tone","o|3|rh|ri|8b","👨🏾‍🏭","man factory worker: medium-dark skin tone","o|3|rk|rl|8b","👨🏿‍🏭","man factory worker: dark skin tone","o|3|rn|ro|8b","👩‍🏭","woman factory worker","o|3|rq|rr|8b","👩🏻‍🏭","woman factory worker: light skin tone","o|3|rt|ru|8b","👩🏼‍🏭","woman factory worker: medium-light skin tone","o|3|rw|rx|8b","👩🏽‍🏭","woman factory worker: medium skin tone","o|3|rz|s0|8b","👩🏾‍🏭","woman factory worker: medium-dark skin tone","o|3|s2|s3|8b","👩🏿‍🏭","woman factory worker: dark skin tone","o|3|s5|s6|8b","🧑‍💼","office worker","o|3|s8|s9|8b","🧑🏻‍💼","office worker: light skin tone","o|3|sB|sC|8b","🧑🏼‍💼","office worker: medium-light skin tone","o|3|sE|sF|8b","🧑🏽‍💼","office worker: medium skin tone","o|3|sH|sI|8b","🧑🏾‍💼","office worker: medium-dark skin tone","o|3|sK|sL|8b","🧑🏿‍💼","office worker: dark skin tone","o|3|sN|sO|8b","👨‍💼","man office worker","o|3|sQ|sR|8b","👨🏻‍💼","man office worker: light skin tone","o|3|sT|sU|8b","👨🏼‍💼","man office worker: medium-light skin tone","o|3|sW|sX|8b","👨🏽‍💼","man office worker: medium skin tone","o|3|sZ|sa|8b","👨🏾‍💼","man office worker: medium-dark skin tone","o|3|sc|sd|8b","👨🏿‍💼","man office worker: dark skin tone","o|3|sf|sg|8b","👩‍💼","woman office worker","o|3|si|sj|8b","👩🏻‍💼","woman office worker: light skin tone","o|3|sl|sm|8b","👩🏼‍💼","woman office worker: medium-light skin tone","o|3|so|sp|8b","👩🏽‍💼","woman office worker: medium skin tone","o|3|sr|ss|8b","👩🏾‍💼","woman office worker: medium-dark skin tone","o|3|su|sv|8b","👩🏿‍💼","woman office worker: dark skin tone","o|3|sx|sy|8b","🧑‍🔬","scientist","o|3|t0|t1|8b","🧑🏻‍🔬","scientist: light skin tone","o|3|t3|t4|8b","🧑🏼‍🔬","scientist: medium-light skin tone","o|3|t6|t7|8b","🧑🏽‍🔬","scientist: medium skin tone","o|3|t9|tA|8b","🧑🏾‍🔬","scientist: medium-dark skin tone","o|3|tC|tD|8b","🧑🏿‍🔬","scientist: dark skin tone","o|3|tF|tG|8b","👨‍🔬","man scientist","o|3|tI|tJ|8b","👨🏻‍🔬","man scientist: light skin tone","o|3|tL|tM|8b","👨🏼‍🔬","man scientist: medium-light skin tone","o|3|tO|tP|8b","👨🏽‍🔬","man scientist: medium skin tone","o|3|tR|tS|8b","👨🏾‍🔬","man scientist: medium-dark skin tone","o|3|tU|tV|8b","👨🏿‍🔬","man scientist: dark skin tone","o|3|tX|tY|8b","👩‍🔬","woman scientist","o|3|ta|tb|8b","👩🏻‍🔬","woman scientist: light skin tone","o|3|td|te|8b","👩🏼‍🔬","woman scientist: medium-light skin tone","o|3|tg|th|8b","👩🏽‍🔬","woman scientist: medium skin tone","o|3|tj|tk|8b","👩🏾‍🔬","woman scientist: medium-dark skin tone","o|3|tm|tn|8b","👩🏿‍🔬","woman scientist: dark skin tone","o|3|tp|tq|8b","🧑‍💻","technologist","o|3|ts|tt|8b","🧑🏻‍💻","technologist: light skin tone","o|3|tv|tw|8b","🧑🏼‍💻","technologist: medium-light skin tone","o|3|ty|tz|8b","🧑🏽‍💻","technologist: medium skin tone","o|3|u1|u2|8b","🧑🏾‍💻","technologist: medium-dark skin tone","o|3|u4|u5|8b","🧑🏿‍💻","technologist: dark skin tone","o|3|u7|u8|8b","👨‍💻","man technologist","o|3|uA|uB|8b","👨🏻‍💻","man technologist: light skin tone","o|3|uD|uE|8b","👨🏼‍💻","man technologist: medium-light skin tone","o|3|uG|uH|8b","👨🏽‍💻","man technologist: medium skin tone","o|3|uJ|uK|8b","👨🏾‍💻","man technologist: medium-dark skin tone","o|3|uM|uN|8b","👨🏿‍💻","man technologist: dark skin tone","o|3|uP|uQ|8b","👩‍💻","woman technologist","o|3|uS|uT|8b","👩🏻‍💻","woman technologist: light skin tone","o|3|uV|uW|8b","👩🏼‍💻","woman technologist: medium-light skin tone","o|3|uY|uZ|8b","👩🏽‍💻","woman technologist: medium skin tone","o|3|ub|uc|8b","👩🏾‍💻","woman technologist: medium-dark skin tone","o|3|ue|uf|8b","👩🏿‍💻","woman technologist: dark skin tone","o|3|uh|ui|8b","🧑‍🎤","singer","o|3|uk|ul|8b","🧑🏻‍🎤","singer: light skin tone","o|3|un|uo|8b","🧑🏼‍🎤","singer: medium-light skin tone","o|3|uq|ur|8b","🧑🏽‍🎤","singer: medium skin tone","o|3|ut|uu|8b","🧑🏾‍🎤","singer: medium-dark skin tone","o|3|uw|ux|8b","🧑🏿‍🎤","singer: dark skin tone","o|3|uz|v0|8b","👨‍🎤","man singer","o|3|v2|v3|8b","👨🏻‍🎤","man singer: light skin tone","o|3|v5|v6|8b","👨🏼‍🎤","man singer: medium-light skin tone","o|3|v8|v9|8b","👨🏽‍🎤","man singer: medium skin tone","o|3|vB|vC|8b","👨🏾‍🎤","man singer: medium-dark skin tone","o|3|vE|vF|8b","👨🏿‍🎤","man singer: dark skin tone","o|3|vH|vI|8b","👩‍🎤","woman singer","o|3|vK|vL|8b","👩🏻‍🎤","woman singer: light skin tone","o|3|vN|vO|8b","👩🏼‍🎤","woman singer: medium-light skin tone","o|3|vQ|vR|8b","👩🏽‍🎤","woman singer: medium skin tone","o|3|vT|vU|8b","👩🏾‍🎤","woman singer: medium-dark skin tone","o|3|vW|vX|8b","👩🏿‍🎤","woman singer: dark skin tone","o|3|vZ|va|8b","🧑‍🎨","artist","o|3|vc|vd|8b","🧑🏻‍🎨","artist: light skin tone","o|3|vf|vg|8b","🧑🏼‍🎨","artist: medium-light skin tone","o|3|vi|vj|8b","🧑🏽‍🎨","artist: medium skin tone","o|3|vl|vm|8b","🧑🏾‍🎨","artist: medium-dark skin tone","o|3|vo|vp|8b","🧑🏿‍🎨","artist: dark skin tone","o|3|vr|vs|8b","👨‍🎨","man artist","o|3|vu|vv|8b","👨🏻‍🎨","man artist: light skin tone","o|3|vx|vy|8b","👨🏼‍🎨","man artist: medium-light skin tone","o|3|w0|w1|8b","👨🏽‍🎨","man artist: medium skin tone","o|3|w3|w4|8b","👨🏾‍🎨","man artist: medium-dark skin tone","o|3|w6|w7|8b","👨🏿‍🎨","man artist: dark skin tone","o|3|w9|wA|8b","👩‍🎨","woman artist","o|3|wC|wD|8b","👩🏻‍🎨","woman artist: light skin tone","o|3|wF|wG|8b","👩🏼‍🎨","woman artist: medium-light skin tone","o|3|wI|wJ|8b","👩🏽‍🎨","woman artist: medium skin tone","o|3|wL|wM|8b","👩🏾‍🎨","woman artist: medium-dark skin tone","o|3|wO|wP|8b","👩🏿‍🎨","woman artist: dark skin tone","o|3|wR|wS|8b","🧑‍✈️","pilot","o|3|wU|wV|8b","🧑‍✈","o|3|wX|wV|8b","🧑🏻‍✈️","pilot: light skin tone","o|3|wZ|wa|8b","🧑🏻‍✈","o|3|wc|wa|8b","🧑🏼‍✈️","pilot: medium-light skin tone","o|3|we|wf|8b","🧑🏼‍✈","o|3|wh|wf|8b","🧑🏽‍✈️","pilot: medium skin tone","o|3|wj|wk|8b","🧑🏽‍✈","o|3|wm|wk|8b","🧑🏾‍✈️","pilot: medium-dark skin tone","o|3|wo|wp|8b","🧑🏾‍✈","o|3|wr|wp|8b","🧑🏿‍✈️","pilot: dark skin tone","o|3|wt|wu|8b","🧑🏿‍✈","o|3|ww|wu|8b","👨‍✈️","man pilot","o|3|wy|wz|8b","👨‍✈","o|3|x1|wz|8b","👨🏻‍✈️","man pilot: light skin tone","o|3|x3|x4|8b","👨🏻‍✈","o|3|x6|x4|8b","👨🏼‍✈️","man pilot: medium-light skin tone","o|3|x8|x9|8b","👨🏼‍✈","o|3|xB|x9|8b","👨🏽‍✈️","man pilot: medium skin tone","o|3|xD|xE|8b","👨🏽‍✈","o|3|xG|xE|8b","👨🏾‍✈️","man pilot: medium-dark skin tone","o|3|xI|xJ|8b","👨🏾‍✈","o|3|xL|xJ|8b","👨🏿‍✈️","man pilot: dark skin tone","o|3|xN|xO|8b","👨🏿‍✈","o|3|xQ|xO|8b","👩‍✈️","woman pilot","o|3|xS|xT|8b","👩‍✈","o|3|xV|xT|8b","👩🏻‍✈️","woman pilot: light skin tone","o|3|xX|xY|8b","👩🏻‍✈","o|3|xa|xY|8b","👩🏼‍✈️","woman pilot: medium-light skin tone","o|3|xc|xd|8b","👩🏼‍✈","o|3|xf|xd|8b","👩🏽‍✈️","woman pilot: medium skin tone","o|3|xh|xi|8b","👩🏽‍✈","o|3|xk|xi|8b","👩🏾‍✈️","woman pilot: medium-dark skin tone","o|3|xm|xn|8b","👩🏾‍✈","o|3|xp|xn|8b","👩🏿‍✈️","woman pilot: dark skin tone","o|3|xr|xs|8b","👩🏿‍✈","o|3|xu|xs|8b","🧑‍🚀","astronaut","o|3|xw|xx|8b","🧑🏻‍🚀","astronaut: light skin tone","o|3|xz|y0|8b","🧑🏼‍🚀","astronaut: medium-light skin tone","o|3|y2|y3|8b","🧑🏽‍🚀","astronaut: medium skin tone","o|3|y5|y6|8b","🧑🏾‍🚀","astronaut: medium-dark skin tone","o|3|y8|y9|8b","🧑🏿‍🚀","astronaut: dark skin tone","o|3|yB|yC|8b","👨‍🚀","man astronaut","o|3|yE|yF|8b","👨🏻‍🚀","man astronaut: light skin tone","o|3|yH|yI|8b","👨🏼‍🚀","man astronaut: medium-light skin tone","o|3|yK|yL|8b","👨🏽‍🚀","man astronaut: medium skin tone","o|3|yN|yO|8b","👨🏾‍🚀","man astronaut: medium-dark skin tone","o|3|yQ|yR|8b","👨🏿‍🚀","man astronaut: dark skin tone","o|3|yT|yU|8b","👩‍🚀","woman astronaut","o|3|yW|yX|8b","👩🏻‍🚀","woman astronaut: light skin tone","o|3|yZ|ya|8b","👩🏼‍🚀","woman astronaut: medium-light skin tone","o|3|yc|yd|8b","👩🏽‍🚀","woman astronaut: medium skin tone","o|3|yf|yg|8b","👩🏾‍🚀","woman astronaut: medium-dark skin tone","o|3|yi|yj|8b","👩🏿‍🚀","woman astronaut: dark skin tone","o|3|yl|ym|8b","🧑‍🚒","firefighter","o|3|yo|yp|8b","🧑🏻‍🚒","firefighter: light skin tone","o|3|yr|ys|8b","🧑🏼‍🚒","firefighter: medium-light skin tone","o|3|yu|yv|8b","🧑🏽‍🚒","firefighter: medium skin tone","o|3|yx|yy|8b","🧑🏾‍🚒","firefighter: medium-dark skin tone","o|3|z0|z1|8b","🧑🏿‍🚒","firefighter: dark skin tone","o|3|z3|z4|8b","👨‍🚒","man firefighter","o|3|z6|z7|8b","👨🏻‍🚒","man firefighter: light skin tone","o|3|z9|zA|8b","👨🏼‍🚒","man firefighter: medium-light skin tone","o|3|zC|zD|8b","👨🏽‍🚒","man firefighter: medium skin tone","o|3|zF|zG|8b","👨🏾‍🚒","man firefighter: medium-dark skin tone","o|3|zI|zJ|8b","👨🏿‍🚒","man firefighter: dark skin tone","o|3|zL|zM|8b","👩‍🚒","woman firefighter","o|3|zO|zP|8b","👩🏻‍🚒","woman firefighter: light skin tone","o|3|zR|zS|8b","👩🏼‍🚒","woman firefighter: medium-light skin tone","o|3|zU|zV|8b","👩🏽‍🚒","woman firefighter: medium skin tone","o|3|zX|zY|8b","👩🏾‍🚒","woman firefighter: medium-dark skin tone","o|3|za|zb|8b","👩🏿‍🚒","woman firefighter: dark skin tone","o|3|zd|ze|8b","👮","police officer","o|3|zg|zh|8b","👮🏻","police officer: light skin tone","o|3|zj|zk|8b","👮🏼","police officer: medium-light skin tone","o|3|zm|zn|8b","👮🏽","police officer: medium skin tone","o|3|zp|zq|8b","👮🏾","police officer: medium-dark skin tone","o|3|zs|zt|8b","👮🏿","police officer: dark skin tone","o|3|zv|zw|8b","👮‍♂️","man police officer","o|3|zy|zz|8b","👮‍♂","o|3|101|zz|8b","👮🏻‍♂️","man police officer: light skin tone","o|3|103|104|8b","👮🏻‍♂","o|3|106|104|8b","👮🏼‍♂️","man police officer: medium-light skin tone","o|3|108|109|8b","👮🏼‍♂","o|3|10B|109|8b","👮🏽‍♂️","man police officer: medium skin tone","o|3|10D|10E|8b","👮🏽‍♂","o|3|10G|10E|8b","👮🏾‍♂️","man police officer: medium-dark skin tone","o|3|10I|10J|8b","👮🏾‍♂","o|3|10L|10J|8b","👮🏿‍♂️","man police officer: dark skin tone","o|3|10N|10O|8b","👮🏿‍♂","o|3|10Q|10O|8b","👮‍♀️","woman police officer","o|3|10S|10T|8b","👮‍♀","o|3|10V|10T|8b","👮🏻‍♀️","woman police officer: light skin tone","o|3|10X|10Y|8b","👮🏻‍♀","o|3|10a|10Y|8b","👮🏼‍♀️","woman police officer: medium-light skin tone","o|3|10c|10d|8b","👮🏼‍♀","o|3|10f|10d|8b","👮🏽‍♀️","woman police officer: medium skin tone","o|3|10h|10i|8b","👮🏽‍♀","o|3|10k|10i|8b","👮🏾‍♀️","woman police officer: medium-dark skin tone","o|3|10m|10n|8b","👮🏾‍♀","o|3|10p|10n|8b","👮🏿‍♀️","woman police officer: dark skin tone","o|3|10r|10s|8b","👮🏿‍♀","o|3|10u|10s|8b","🕵️","detective","o|3|10w|10x|8b","🕵","o|3|10z|10x|8b","🕵🏻","detective: light skin tone","o|3|111|112|8b","🕵🏼","detective: medium-light skin tone","o|3|114|115|8b","🕵🏽","detective: medium skin tone","o|3|117|118|8b","🕵🏾","detective: medium-dark skin tone","o|3|11A|11B|8b","🕵🏿","detective: dark skin tone","o|3|11D|11E|8b","🕵️‍♂️","man detective","o|3|11G|11H|8b","🕵‍♂️","o|3|11J|11H|8b","🕵️‍♂","o|3|11L|11H|8b","🕵‍♂","o|3|11N|11H|8b","🕵🏻‍♂️","man detective: light skin tone","o|3|11P|11Q|8b","🕵🏻‍♂","o|3|11S|11Q|8b","🕵🏼‍♂️","man detective: medium-light skin tone","o|3|11U|11V|8b","🕵🏼‍♂","o|3|11X|11V|8b","🕵🏽‍♂️","man detective: medium skin tone","o|3|11Z|11a|8b","🕵🏽‍♂","o|3|11c|11a|8b","🕵🏾‍♂️","man detective: medium-dark skin tone","o|3|11e|11f|8b","🕵🏾‍♂","o|3|11h|11f|8b","🕵🏿‍♂️","man detective: dark skin tone","o|3|11j|11k|8b","🕵🏿‍♂","o|3|11m|11k|8b","🕵️‍♀️","woman detective","o|3|11o|11p|8b","🕵‍♀️","o|3|11r|11p|8b","🕵️‍♀","o|3|11t|11p|8b","🕵‍♀","o|3|11v|11p|8b","🕵🏻‍♀️","woman detective: light skin tone","o|3|11x|11y|8b","🕵🏻‍♀","o|3|120|11y|8b","🕵🏼‍♀️","woman detective: medium-light skin tone","o|3|122|123|8b","🕵🏼‍♀","o|3|125|123|8b","🕵🏽‍♀️","woman detective: medium skin tone","o|3|127|128|8b","🕵🏽‍♀","o|3|12A|128|8b","🕵🏾‍♀️","woman detective: medium-dark skin tone","o|3|12C|12D|8b","🕵🏾‍♀","o|3|12F|12D|8b","🕵🏿‍♀️","woman detective: dark skin tone","o|3|12H|12I|8b","🕵🏿‍♀","o|3|12K|12I|8b","💂","guard","o|3|12M|12N|8b","💂🏻","guard: light skin tone","o|3|12P|12Q|8b","💂🏼","guard: medium-light skin tone","o|3|12S|12T|8b","💂🏽","guard: medium skin tone","o|3|12V|12W|8b","💂🏾","guard: medium-dark skin tone","o|3|12Y|12Z|8b","💂🏿","guard: dark skin tone","o|3|12b|12c|8b","💂‍♂️","man guard","o|3|12e|12f|8b","💂‍♂","o|3|12h|12f|8b","💂🏻‍♂️","man guard: light skin tone","o|3|12j|12k|8b","💂🏻‍♂","o|3|12m|12k|8b","💂🏼‍♂️","man guard: medium-light skin tone","o|3|12o|12p|8b","💂🏼‍♂","o|3|12r|12p|8b","💂🏽‍♂️","man guard: medium skin tone","o|3|12t|12u|8b","💂🏽‍♂","o|3|12w|12u|8b","💂🏾‍♂️","man guard: medium-dark skin tone","o|3|12y|12z|8b","💂🏾‍♂","o|3|131|12z|8b","💂🏿‍♂️","man guard: dark skin tone","o|3|133|134|8b","💂🏿‍♂","o|3|136|134|8b","💂‍♀️","woman guard","o|3|138|139|8b","💂‍♀","o|3|13B|139|8b","💂🏻‍♀️","woman guard: light skin tone","o|3|13D|13E|8b","💂🏻‍♀","o|3|13G|13E|8b","💂🏼‍♀️","woman guard: medium-light skin tone","o|3|13I|13J|8b","💂🏼‍♀","o|3|13L|13J|8b","💂🏽‍♀️","woman guard: medium skin tone","o|3|13N|13O|8b","💂🏽‍♀","o|3|13Q|13O|8b","💂🏾‍♀️","woman guard: medium-dark skin tone","o|3|13S|13T|8b","💂🏾‍♀","o|3|13V|13T|8b","💂🏿‍♀️","woman guard: dark skin tone","o|3|13X|13Y|8b","💂🏿‍♀","o|3|13a|13Y|8b","🥷","ninja","o|3|13c|13d|8b","🥷🏻","ninja: light skin tone","o|3|13f|13g|8b","🥷🏼","ninja: medium-light skin tone","o|3|13i|13j|8b","🥷🏽","ninja: medium skin tone","o|3|13l|13m|8b","🥷🏾","ninja: medium-dark skin tone","o|3|13o|13p|8b","🥷🏿","ninja: dark skin tone","o|3|13r|13s|8b","👷","construction worker","o|3|13u|13v|8b","👷🏻","construction worker: light skin tone","o|3|13x|13y|8b","👷🏼","construction worker: medium-light skin tone","o|3|140|141|8b","👷🏽","construction worker: medium skin tone","o|3|143|144|8b","👷🏾","construction worker: medium-dark skin tone","o|3|146|147|8b","👷🏿","construction worker: dark skin tone","o|3|149|14A|8b","👷‍♂️","man construction worker","o|3|14C|14D|8b","👷‍♂","o|3|14F|14D|8b","👷🏻‍♂️","man construction worker: light skin tone","o|3|14H|14I|8b","👷🏻‍♂","o|3|14K|14I|8b","👷🏼‍♂️","man construction worker: medium-light skin tone","o|3|14M|14N|8b","👷🏼‍♂","o|3|14P|14N|8b","👷🏽‍♂️","man construction worker: medium skin tone","o|3|14R|14S|8b","👷🏽‍♂","o|3|14U|14S|8b","👷🏾‍♂️","man construction worker: medium-dark skin tone","o|3|14W|14X|8b","👷🏾‍♂","o|3|14Z|14X|8b","👷🏿‍♂️","man construction worker: dark skin tone","o|3|14b|14c|8b","👷🏿‍♂","o|3|14e|14c|8b","👷‍♀️","woman construction worker","o|3|14g|14h|8b","👷‍♀","o|3|14j|14h|8b","👷🏻‍♀️","woman construction worker: light skin tone","o|3|14l|14m|8b","👷🏻‍♀","o|3|14o|14m|8b","👷🏼‍♀️","woman construction worker: medium-light skin tone","o|3|14q|14r|8b","👷🏼‍♀","o|3|14t|14r|8b","👷🏽‍♀️","woman construction worker: medium skin tone","o|3|14v|14w|8b","👷🏽‍♀","o|3|14y|14w|8b","👷🏾‍♀️","woman construction worker: medium-dark skin tone","o|3|150|151|8b","👷🏾‍♀","o|3|153|151|8b","👷🏿‍♀️","woman construction worker: dark skin tone","o|3|155|156|8b","👷🏿‍♀","o|3|158|156|8b","🫅","person with crown","o|3|15A|15B|8b","🫅🏻","person with crown: light skin tone","o|3|15D|15E|8b","🫅🏼","person with crown: medium-light skin tone","o|3|15G|15H|8b","🫅🏽","person with crown: medium skin tone","o|3|15J|15K|8b","🫅🏾","person with crown: medium-dark skin tone","o|3|15M|15N|8b","🫅🏿","person with crown: dark skin tone","o|3|15P|15Q|8b","🤴","prince","o|3|15S|15T|8b","🤴🏻","prince: light skin tone","o|3|15V|15W|8b","🤴🏼","prince: medium-light skin tone","o|3|15Y|15Z|8b","🤴🏽","prince: medium skin tone","o|3|15b|15c|8b","🤴🏾","prince: medium-dark skin tone","o|3|15e|15f|8b","🤴🏿","prince: dark skin tone","o|3|15h|15i|8b","👸","princess","o|3|15k|15l|8b","👸🏻","princess: light skin tone","o|3|15n|15o|8b","👸🏼","princess: medium-light skin tone","o|3|15q|15r|8b","👸🏽","princess: medium skin tone","o|3|15t|15u|8b","👸🏾","princess: medium-dark skin tone","o|3|15w|15x|8b","👸🏿","princess: dark skin tone","o|3|15z|160|8b","👳","person wearing turban","o|3|162|163|8b","👳🏻","person wearing turban: light skin tone","o|3|165|166|8b","👳🏼","person wearing turban: medium-light skin tone","o|3|168|169|8b","👳🏽","person wearing turban: medium skin tone","o|3|16B|16C|8b","👳🏾","person wearing turban: medium-dark skin tone","o|3|16E|16F|8b","👳🏿","person wearing turban: dark skin tone","o|3|16H|16I|8b","👳‍♂️","man wearing turban","o|3|16K|16L|8b","👳‍♂","o|3|16N|16L|8b","👳🏻‍♂️","man wearing turban: light skin tone","o|3|16P|16Q|8b","👳🏻‍♂","o|3|16S|16Q|8b","👳🏼‍♂️","man wearing turban: medium-light skin tone","o|3|16U|16V|8b","👳🏼‍♂","o|3|16X|16V|8b","👳🏽‍♂️","man wearing turban: medium skin tone","o|3|16Z|16a|8b","👳🏽‍♂","o|3|16c|16a|8b","👳🏾‍♂️","man wearing turban: medium-dark skin tone","o|3|16e|16f|8b","👳🏾‍♂","o|3|16h|16f|8b","👳🏿‍♂️","man wearing turban: dark skin tone","o|3|16j|16k|8b","👳🏿‍♂","o|3|16m|16k|8b","👳‍♀️","woman wearing turban","o|3|16o|16p|8b","👳‍♀","o|3|16r|16p|8b","👳🏻‍♀️","woman wearing turban: light skin tone","o|3|16t|16u|8b","👳🏻‍♀","o|3|16w|16u|8b","👳🏼‍♀️","woman wearing turban: medium-light skin tone","o|3|16y|16z|8b","👳🏼‍♀","o|3|171|16z|8b","👳🏽‍♀️","woman wearing turban: medium skin tone","o|3|173|174|8b","👳🏽‍♀","o|3|176|174|8b","👳🏾‍♀️","woman wearing turban: medium-dark skin tone","o|3|178|179|8b","👳🏾‍♀","o|3|17B|179|8b","👳🏿‍♀️","woman wearing turban: dark skin tone","o|3|17D|17E|8b","👳🏿‍♀","o|3|17G|17E|8b","👲","person with skullcap","o|3|17I|17J|8b","👲🏻","person with skullcap: light skin tone","o|3|17L|17M|8b","👲🏼","person with skullcap: medium-light skin tone","o|3|17O|17P|8b","👲🏽","person with skullcap: medium skin tone","o|3|17R|17S|8b","👲🏾","person with skullcap: medium-dark skin tone","o|3|17U|17V|8b","👲🏿","person with skullcap: dark skin tone","o|3|17X|17Y|8b","🧕","woman with headscarf","o|3|17a|17b|8b","🧕🏻","woman with headscarf: light skin tone","o|3|17d|17e|8b","🧕🏼","woman with headscarf: medium-light skin tone","o|3|17g|17h|8b","🧕🏽","woman with headscarf: medium skin tone","o|3|17j|17k|8b","🧕🏾","woman with headscarf: medium-dark skin tone","o|3|17m|17n|8b","🧕🏿","woman with headscarf: dark skin tone","o|3|17p|17q|8b","🤵","person in tuxedo","o|3|17s|17t|8b","🤵🏻","person in tuxedo: light skin tone","o|3|17v|17w|8b","🤵🏼","person in tuxedo: medium-light skin tone","o|3|17y|17z|8b","🤵🏽","person in tuxedo: medium skin tone","o|3|181|182|8b","🤵🏾","person in tuxedo: medium-dark skin tone","o|3|184|185|8b","🤵🏿","person in tuxedo: dark skin tone","o|3|187|188|8b","🤵‍♂️","man in tuxedo","o|3|18A|18B|8b","🤵‍♂","o|3|18D|18B|8b","🤵🏻‍♂️","man in tuxedo: light skin tone","o|3|18F|18G|8b","🤵🏻‍♂","o|3|18I|18G|8b","🤵🏼‍♂️","man in tuxedo: medium-light skin tone","o|3|18K|18L|8b","🤵🏼‍♂","o|3|18N|18L|8b","🤵🏽‍♂️","man in tuxedo: medium skin tone","o|3|18P|18Q|8b","🤵🏽‍♂","o|3|18S|18Q|8b","🤵🏾‍♂️","man in tuxedo: medium-dark skin tone","o|3|18U|18V|8b","🤵🏾‍♂","o|3|18X|18V|8b","🤵🏿‍♂️","man in tuxedo: dark skin tone","o|3|18Z|18a|8b","🤵🏿‍♂","o|3|18c|18a|8b","🤵‍♀️","woman in tuxedo","o|3|18e|18f|8b","🤵‍♀","o|3|18h|18f|8b","🤵🏻‍♀️","woman in tuxedo: light skin tone","o|3|18j|18k|8b","🤵🏻‍♀","o|3|18m|18k|8b","🤵🏼‍♀️","woman in tuxedo: medium-light skin tone","o|3|18o|18p|8b","🤵🏼‍♀","o|3|18r|18p|8b","🤵🏽‍♀️","woman in tuxedo: medium skin tone","o|3|18t|18u|8b","🤵🏽‍♀","o|3|18w|18u|8b","🤵🏾‍♀️","woman in tuxedo: medium-dark skin tone","o|3|18y|18z|8b","🤵🏾‍♀","o|3|191|18z|8b","🤵🏿‍♀️","woman in tuxedo: dark skin tone","o|3|193|194|8b","🤵🏿‍♀","o|3|196|194|8b","👰","person with veil","o|3|198|199|8b","👰🏻","person with veil: light skin tone","o|3|19B|19C|8b","👰🏼","person with veil: medium-light skin tone","o|3|19E|19F|8b","👰🏽","person with veil: medium skin tone","o|3|19H|19I|8b","👰🏾","person with veil: medium-dark skin tone","o|3|19K|19L|8b","👰🏿","person with veil: dark skin tone","o|3|19N|19O|8b","👰‍♂️","man with veil","o|3|19Q|19R|8b","👰‍♂","o|3|19T|19R|8b","👰🏻‍♂️","man with veil: light skin tone","o|3|19V|19W|8b","👰🏻‍♂","o|3|19Y|19W|8b","👰🏼‍♂️","man with veil: medium-light skin tone","o|3|19a|19b|8b","👰🏼‍♂","o|3|19d|19b|8b","👰🏽‍♂️","man with veil: medium skin tone","o|3|19f|19g|8b","👰🏽‍♂","o|3|19i|19g|8b","👰🏾‍♂️","man with veil: medium-dark skin tone","o|3|19k|19l|8b","👰🏾‍♂","o|3|19n|19l|8b","👰🏿‍♂️","man with veil: dark skin tone","o|3|19p|19q|8b","👰🏿‍♂","o|3|19s|19q|8b","👰‍♀️","woman with veil","o|3|19u|19v|8b","👰‍♀","o|3|19x|19v|8b","👰🏻‍♀️","woman with veil: light skin tone","o|3|19z|1A0|8b","👰🏻‍♀","o|3|1A2|1A0|8b","👰🏼‍♀️","woman with veil: medium-light skin tone","o|3|1A4|1A5|8b","👰🏼‍♀","o|3|1A7|1A5|8b","👰🏽‍♀️","woman with veil: medium skin tone","o|3|1A9|1AA|8b","👰🏽‍♀","o|3|1AC|1AA|8b","👰🏾‍♀️","woman with veil: medium-dark skin tone","o|3|1AE|1AF|8b","👰🏾‍♀","o|3|1AH|1AF|8b","👰🏿‍♀️","woman with veil: dark skin tone","o|3|1AJ|1AK|8b","👰🏿‍♀","o|3|1AM|1AK|8b","🤰","pregnant woman","o|3|1AO|1AP|8b","🤰🏻","pregnant woman: light skin tone","o|3|1AR|1AS|8b","🤰🏼","pregnant woman: medium-light skin tone","o|3|1AU|1AV|8b","🤰🏽","pregnant woman: medium skin tone","o|3|1AX|1AY|8b","🤰🏾","pregnant woman: medium-dark skin tone","o|3|1Aa|1Ab|8b","🤰🏿","pregnant woman: dark skin tone","o|3|1Ad|1Ae|8b","🫃","pregnant man","o|3|1Ag|1Ah|8b","🫃🏻","pregnant man: light skin tone","o|3|1Aj|1Ak|8b","🫃🏼","pregnant man: medium-light skin tone","o|3|1Am|1An|8b","🫃🏽","pregnant man: medium skin tone","o|3|1Ap|1Aq|8b","🫃🏾","pregnant man: medium-dark skin tone","o|3|1As|1At|8b","🫃🏿","pregnant man: dark skin tone","o|3|1Av|1Aw|8b","🫄","pregnant person","o|3|1Ay|1Az|8b","🫄🏻","pregnant person: light skin tone","o|3|1B1|1B2|8b","🫄🏼","pregnant person: medium-light skin tone","o|3|1B4|1B5|8b","🫄🏽","pregnant person: medium skin tone","o|3|1B7|1B8|8b","🫄🏾","pregnant person: medium-dark skin tone","o|3|1BA|1BB|8b","🫄🏿","pregnant person: dark skin tone","o|3|1BD|1BE|8b","🤱","breast-feeding","o|3|1BG|1BH|8b","🤱🏻","breast-feeding: light skin tone","o|3|1BJ|1BK|8b","🤱🏼","breast-feeding: medium-light skin tone","o|3|1BM|1BN|8b","🤱🏽","breast-feeding: medium skin tone","o|3|1BP|1BQ|8b","🤱🏾","breast-feeding: medium-dark skin tone","o|3|1BS|1BT|8b","🤱🏿","breast-feeding: dark skin tone","o|3|1BV|1BW|8b","👩‍🍼","woman feeding baby","o|3|1BY|1BZ|8b","👩🏻‍🍼","woman feeding baby: light skin tone","o|3|1Bb|1Bc|8b","👩🏼‍🍼","woman feeding baby: medium-light skin tone","o|3|1Be|1Bf|8b","👩🏽‍🍼","woman feeding baby: medium skin tone","o|3|1Bh|1Bi|8b","👩🏾‍🍼","woman feeding baby: medium-dark skin tone","o|3|1Bk|1Bl|8b","👩🏿‍🍼","woman feeding baby: dark skin tone","o|3|1Bn|1Bo|8b","👨‍🍼","man feeding baby","o|3|1Bq|1Br|8b","👨🏻‍🍼","man feeding baby: light skin tone","o|3|1Bt|1Bu|8b","👨🏼‍🍼","man feeding baby: medium-light skin tone","o|3|1Bw|1Bx|8b","👨🏽‍🍼","man feeding baby: medium skin tone","o|3|1Bz|1C0|8b","👨🏾‍🍼","man feeding baby: medium-dark skin tone","o|3|1C2|1C3|8b","👨🏿‍🍼","man feeding baby: dark skin tone","o|3|1C5|1C6|8b","🧑‍🍼","person feeding baby","o|3|1C8|1C9|8b","🧑🏻‍🍼","person feeding baby: light skin tone","o|3|1CB|1CC|8b","🧑🏼‍🍼","person feeding baby: medium-light skin tone","o|3|1CE|1CF|8b","🧑🏽‍🍼","person feeding baby: medium skin tone","o|3|1CH|1CI|8b","🧑🏾‍🍼","person feeding baby: medium-dark skin tone","o|3|1CK|1CL|8b","🧑🏿‍🍼","person feeding baby: dark skin tone","o|3|1CN|1CO|8b","👼","baby angel","o|3|1CQ|1CR|8b","👼🏻","baby angel: light skin tone","o|3|1CT|1CU|8b","👼🏼","baby angel: medium-light skin tone","o|3|1CW|1CX|8b","👼🏽","baby angel: medium skin tone","o|3|1CZ|1Ca|8b","👼🏾","baby angel: medium-dark skin tone","o|3|1Cc|1Cd|8b","👼🏿","baby angel: dark skin tone","o|3|1Cf|1Cg|8b","🎅","Santa Claus","o|3|1Ci|1Cj|8b","🎅🏻","Santa Claus: light skin tone","o|3|1Cl|1Cm|8b","🎅🏼","Santa Claus: medium-light skin tone","o|3|1Co|1Cp|8b","🎅🏽","Santa Claus: medium skin tone","o|3|1Cr|1Cs|8b","🎅🏾","Santa Claus: medium-dark skin tone","o|3|1Cu|1Cv|8b","🎅🏿","Santa Claus: dark skin tone","o|3|1Cx|1Cy|8b","🤶","Mrs. Claus","o|3|1D0|1D1|8b","🤶🏻","Mrs. Claus: light skin tone","o|3|1D3|1D4|8b","🤶🏼","Mrs. Claus: medium-light skin tone","o|3|1D6|1D7|8b","🤶🏽","Mrs. Claus: medium skin tone","o|3|1D9|1DA|8b","🤶🏾","Mrs. Claus: medium-dark skin tone","o|3|1DC|1DD|8b","🤶🏿","Mrs. Claus: dark skin tone","o|3|1DF|1DG|8b","🧑‍🎄","mx claus","o|3|1DI|1DJ|8b","🧑🏻‍🎄","mx claus: light skin tone","o|3|1DL|1DM|8b","🧑🏼‍🎄","mx claus: medium-light skin tone","o|3|1DO|1DP|8b","🧑🏽‍🎄","mx claus: medium skin tone","o|3|1DR|1DS|8b","🧑🏾‍🎄","mx claus: medium-dark skin tone","o|3|1DU|1DV|8b","🧑🏿‍🎄","mx claus: dark skin tone","o|3|1DX|1DY|8b","🦸","superhero","o|3|1Da|1Db|8b","🦸🏻","superhero: light skin tone","o|3|1Dd|1De|8b","🦸🏼","superhero: medium-light skin tone","o|3|1Dg|1Dh|8b","🦸🏽","superhero: medium skin tone","o|3|1Dj|1Dk|8b","🦸🏾","superhero: medium-dark skin tone","o|3|1Dm|1Dn|8b","🦸🏿","superhero: dark skin tone","o|3|1Dp|1Dq|8b","🦸‍♂️","man superhero","o|3|1Ds|1Dt|8b","🦸‍♂","o|3|1Dv|1Dt|8b","🦸🏻‍♂️","man superhero: light skin tone","o|3|1Dx|1Dy|8b","🦸🏻‍♂","o|3|1E0|1Dy|8b","🦸🏼‍♂️","man superhero: medium-light skin tone","o|3|1E2|1E3|8b","🦸🏼‍♂","o|3|1E5|1E3|8b","🦸🏽‍♂️","man superhero: medium skin tone","o|3|1E7|1E8|8b","🦸🏽‍♂","o|3|1EA|1E8|8b","🦸🏾‍♂️","man superhero: medium-dark skin tone","o|3|1EC|1ED|8b","🦸🏾‍♂","o|3|1EF|1ED|8b","🦸🏿‍♂️","man superhero: dark skin tone","o|3|1EH|1EI|8b","🦸🏿‍♂","o|3|1EK|1EI|8b","🦸‍♀️","woman superhero","o|3|1EM|1EN|8b","🦸‍♀","o|3|1EP|1EN|8b","🦸🏻‍♀️","woman superhero: light skin tone","o|3|1ER|1ES|8b","🦸🏻‍♀","o|3|1EU|1ES|8b","🦸🏼‍♀️","woman superhero: medium-light skin tone","o|3|1EW|1EX|8b","🦸🏼‍♀","o|3|1EZ|1EX|8b","🦸🏽‍♀️","woman superhero: medium skin tone","o|3|1Eb|1Ec|8b","🦸🏽‍♀","o|3|1Ee|1Ec|8b","🦸🏾‍♀️","woman superhero: medium-dark skin tone","o|3|1Eg|1Eh|8b","🦸🏾‍♀","o|3|1Ej|1Eh|8b","🦸🏿‍♀️","woman superhero: dark skin tone","o|3|1El|1Em|8b","🦸🏿‍♀","o|3|1Eo|1Em|8b","🦹","supervillain","o|3|1Eq|1Er|8b","🦹🏻","supervillain: light skin tone","o|3|1Et|1Eu|8b","🦹🏼","supervillain: medium-light skin tone","o|3|1Ew|1Ex|8b","🦹🏽","supervillain: medium skin tone","o|3|1Ez|1F0|8b","🦹🏾","supervillain: medium-dark skin tone","o|3|1F2|1F3|8b","🦹🏿","supervillain: dark skin tone","o|3|1F5|1F6|8b","🦹‍♂️","man supervillain","o|3|1F8|1F9|8b","🦹‍♂","o|3|1FB|1F9|8b","🦹🏻‍♂️","man supervillain: light skin tone","o|3|1FD|1FE|8b","🦹🏻‍♂","o|3|1FG|1FE|8b","🦹🏼‍♂️","man supervillain: medium-light skin tone","o|3|1FI|1FJ|8b","🦹🏼‍♂","o|3|1FL|1FJ|8b","🦹🏽‍♂️","man supervillain: medium skin tone","o|3|1FN|1FO|8b","🦹🏽‍♂","o|3|1FQ|1FO|8b","🦹🏾‍♂️","man supervillain: medium-dark skin tone","o|3|1FS|1FT|8b","🦹🏾‍♂","o|3|1FV|1FT|8b","🦹🏿‍♂️","man supervillain: dark skin tone","o|3|1FX|1FY|8b","🦹🏿‍♂","o|3|1Fa|1FY|8b","🦹‍♀️","woman supervillain","o|3|1Fc|1Fd|8b","🦹‍♀","o|3|1Ff|1Fd|8b","🦹🏻‍♀️","woman supervillain: light skin tone","o|3|1Fh|1Fi|8b","🦹🏻‍♀","o|3|1Fk|1Fi|8b","🦹🏼‍♀️","woman supervillain: medium-light skin tone","o|3|1Fm|1Fn|8b","🦹🏼‍♀","o|3|1Fp|1Fn|8b","🦹🏽‍♀️","woman supervillain: medium skin tone","o|3|1Fr|1Fs|8b","🦹🏽‍♀","o|3|1Fu|1Fs|8b","🦹🏾‍♀️","woman supervillain: medium-dark skin tone","o|3|1Fw|1Fx|8b","🦹🏾‍♀","o|3|1Fz|1Fx|8b","🦹🏿‍♀️","woman supervillain: dark skin tone","o|3|1G1|1G2|8b","🦹🏿‍♀","o|3|1G4|1G2|8b","🧙","mage","o|3|1G6|1G7|8b","🧙🏻","mage: light skin tone","o|3|1G9|1GA|8b","🧙🏼","mage: medium-light skin tone","o|3|1GC|1GD|8b","🧙🏽","mage: medium skin tone","o|3|1GF|1GG|8b","🧙🏾","mage: medium-dark skin tone","o|3|1GI|1GJ|8b","🧙🏿","mage: dark skin tone","o|3|1GL|1GM|8b","🧙‍♂️","man mage","o|3|1GO|1GP|8b","🧙‍♂","o|3|1GR|1GP|8b","🧙🏻‍♂️","man mage: light skin tone","o|3|1GT|1GU|8b","🧙🏻‍♂","o|3|1GW|1GU|8b","🧙🏼‍♂️","man mage: medium-light skin tone","o|3|1GY|1GZ|8b","🧙🏼‍♂","o|3|1Gb|1GZ|8b","🧙🏽‍♂️","man mage: medium skin tone","o|3|1Gd|1Ge|8b","🧙🏽‍♂","o|3|1Gg|1Ge|8b","🧙🏾‍♂️","man mage: medium-dark skin tone","o|3|1Gi|1Gj|8b","🧙🏾‍♂","o|3|1Gl|1Gj|8b","🧙🏿‍♂️","man mage: dark skin tone","o|3|1Gn|1Go|8b","🧙🏿‍♂","o|3|1Gq|1Go|8b","🧙‍♀️","woman mage","o|3|1Gs|1Gt|8b","🧙‍♀","o|3|1Gv|1Gt|8b","🧙🏻‍♀️","woman mage: light skin tone","o|3|1Gx|1Gy|8b","🧙🏻‍♀","o|3|1H0|1Gy|8b","🧙🏼‍♀️","woman mage: medium-light skin tone","o|3|1H2|1H3|8b","🧙🏼‍♀","o|3|1H5|1H3|8b","🧙🏽‍♀️","woman mage: medium skin tone","o|3|1H7|1H8|8b","🧙🏽‍♀","o|3|1HA|1H8|8b","🧙🏾‍♀️","woman mage: medium-dark skin tone","o|3|1HC|1HD|8b","🧙🏾‍♀","o|3|1HF|1HD|8b","🧙🏿‍♀️","woman mage: dark skin tone","o|3|1HH|1HI|8b","🧙🏿‍♀","o|3|1HK|1HI|8b","🧚","fairy","o|3|1HM|1HN|8b","🧚🏻","fairy: light skin tone","o|3|1HP|1HQ|8b","🧚🏼","fairy: medium-light skin tone","o|3|1HS|1HT|8b","🧚🏽","fairy: medium skin tone","o|3|1HV|1HW|8b","🧚🏾","fairy: medium-dark skin tone","o|3|1HY|1HZ|8b","🧚🏿","fairy: dark skin tone","o|3|1Hb|1Hc|8b","🧚‍♂️","man fairy","o|3|1He|1Hf|8b","🧚‍♂","o|3|1Hh|1Hf|8b","🧚🏻‍♂️","man fairy: light skin tone","o|3|1Hj|1Hk|8b","🧚🏻‍♂","o|3|1Hm|1Hk|8b","🧚🏼‍♂️","man fairy: medium-light skin tone","o|3|1Ho|1Hp|8b","🧚🏼‍♂","o|3|1Hr|1Hp|8b","🧚🏽‍♂️","man fairy: medium skin tone","o|3|1Ht|1Hu|8b","🧚🏽‍♂","o|3|1Hw|1Hu|8b","🧚🏾‍♂️","man fairy: medium-dark skin tone","o|3|1Hy|1Hz|8b","🧚🏾‍♂","o|3|1I1|1Hz|8b","🧚🏿‍♂️","man fairy: dark skin tone","o|3|1I3|1I4|8b","🧚🏿‍♂","o|3|1I6|1I4|8b","🧚‍♀️","woman fairy","o|3|1I8|1I9|8b","🧚‍♀","o|3|1IB|1I9|8b","🧚🏻‍♀️","woman fairy: light skin tone","o|3|1ID|1IE|8b","🧚🏻‍♀","o|3|1IG|1IE|8b","🧚🏼‍♀️","woman fairy: medium-light skin tone","o|3|1II|1IJ|8b","🧚🏼‍♀","o|3|1IL|1IJ|8b","🧚🏽‍♀️","woman fairy: medium skin tone","o|3|1IN|1IO|8b","🧚🏽‍♀","o|3|1IQ|1IO|8b","🧚🏾‍♀️","woman fairy: medium-dark skin tone","o|3|1IS|1IT|8b","🧚🏾‍♀","o|3|1IV|1IT|8b","🧚🏿‍♀️","woman fairy: dark skin tone","o|3|1IX|1IY|8b","🧚🏿‍♀","o|3|1Ia|1IY|8b","🧛","vampire","o|3|1Ic|1Id|8b","🧛🏻","vampire: light skin tone","o|3|1If|1Ig|8b","🧛🏼","vampire: medium-light skin tone","o|3|1Ii|1Ij|8b","🧛🏽","vampire: medium skin tone","o|3|1Il|1Im|8b","🧛🏾","vampire: medium-dark skin tone","o|3|1Io|1Ip|8b","🧛🏿","vampire: dark skin tone","o|3|1Ir|1Is|8b","🧛‍♂️","man vampire","o|3|1Iu|1Iv|8b","🧛‍♂","o|3|1Ix|1Iv|8b","🧛🏻‍♂️","man vampire: light skin tone","o|3|1Iz|1J0|8b","🧛🏻‍♂","o|3|1J2|1J0|8b","🧛🏼‍♂️","man vampire: medium-light skin tone","o|3|1J4|1J5|8b","🧛🏼‍♂","o|3|1J7|1J5|8b","🧛🏽‍♂️","man vampire: medium skin tone","o|3|1J9|1JA|8b","🧛🏽‍♂","o|3|1JC|1JA|8b","🧛🏾‍♂️","man vampire: medium-dark skin tone","o|3|1JE|1JF|8b","🧛🏾‍♂","o|3|1JH|1JF|8b","🧛🏿‍♂️","man vampire: dark skin tone","o|3|1JJ|1JK|8b","🧛🏿‍♂","o|3|1JM|1JK|8b","🧛‍♀️","woman vampire","o|3|1JO|1JP|8b","🧛‍♀","o|3|1JR|1JP|8b","🧛🏻‍♀️","woman vampire: light skin tone","o|3|1JT|1JU|8b","🧛🏻‍♀","o|3|1JW|1JU|8b","🧛🏼‍♀️","woman vampire: medium-light skin tone","o|3|1JY|1JZ|8b","🧛🏼‍♀","o|3|1Jb|1JZ|8b","🧛🏽‍♀️","woman vampire: medium skin tone","o|3|1Jd|1Je|8b","🧛🏽‍♀","o|3|1Jg|1Je|8b","🧛🏾‍♀️","woman vampire: medium-dark skin tone","o|3|1Ji|1Jj|8b","🧛🏾‍♀","o|3|1Jl|1Jj|8b","🧛🏿‍♀️","woman vampire: dark skin tone","o|3|1Jn|1Jo|8b","🧛🏿‍♀","o|3|1Jq|1Jo|8b","🧜","merperson","o|3|1Js|1Jt|8b","🧜🏻","merperson: light skin tone","o|3|1Jv|1Jw|8b","🧜🏼","merperson: medium-light skin tone","o|3|1Jy|1Jz|8b","🧜🏽","merperson: medium skin tone","o|3|1K1|1K2|8b","🧜🏾","merperson: medium-dark skin tone","o|3|1K4|1K5|8b","🧜🏿","merperson: dark skin tone","o|3|1K7|1K8|8b","🧜‍♂️","merman","o|3|1KA|1KB|8b","🧜‍♂","o|3|1KD|1KB|8b","🧜🏻‍♂️","merman: light skin tone","o|3|1KF|1KG|8b","🧜🏻‍♂","o|3|1KI|1KG|8b","🧜🏼‍♂️","merman: medium-light skin tone","o|3|1KK|1KL|8b","🧜🏼‍♂","o|3|1KN|1KL|8b","🧜🏽‍♂️","merman: medium skin tone","o|3|1KP|1KQ|8b","🧜🏽‍♂","o|3|1KS|1KQ|8b","🧜🏾‍♂️","merman: medium-dark skin tone","o|3|1KU|1KV|8b","🧜🏾‍♂","o|3|1KX|1KV|8b","🧜🏿‍♂️","merman: dark skin tone","o|3|1KZ|1Ka|8b","🧜🏿‍♂","o|3|1Kc|1Ka|8b","🧜‍♀️","mermaid","o|3|1Ke|1Kf|8b","🧜‍♀","o|3|1Kh|1Kf|8b","🧜🏻‍♀️","mermaid: light skin tone","o|3|1Kj|1Kk|8b","🧜🏻‍♀","o|3|1Km|1Kk|8b","🧜🏼‍♀️","mermaid: medium-light skin tone","o|3|1Ko|1Kp|8b","🧜🏼‍♀","o|3|1Kr|1Kp|8b","🧜🏽‍♀️","mermaid: medium skin tone","o|3|1Kt|1Ku|8b","🧜🏽‍♀","o|3|1Kw|1Ku|8b","🧜🏾‍♀️","mermaid: medium-dark skin tone","o|3|1Ky|1Kz|8b","🧜🏾‍♀","o|3|1L1|1Kz|8b","🧜🏿‍♀️","mermaid: dark skin tone","o|3|1L3|1L4|8b","🧜🏿‍♀","o|3|1L6|1L4|8b","🧝","elf","o|3|1L8|1L9|8b","🧝🏻","elf: light skin tone","o|3|1LB|1LC|8b","🧝🏼","elf: medium-light skin tone","o|3|1LE|1LF|8b","🧝🏽","elf: medium skin tone","o|3|1LH|1LI|8b","🧝🏾","elf: medium-dark skin tone","o|3|1LK|1LL|8b","🧝🏿","elf: dark skin tone","o|3|1LN|1LO|8b","🧝‍♂️","man elf","o|3|1LQ|1LR|8b","🧝‍♂","o|3|1LT|1LR|8b","🧝🏻‍♂️","man elf: light skin tone","o|3|1LV|1LW|8b","🧝🏻‍♂","o|3|1LY|1LW|8b","🧝🏼‍♂️","man elf: medium-light skin tone","o|3|1La|1Lb|8b","🧝🏼‍♂","o|3|1Ld|1Lb|8b","🧝🏽‍♂️","man elf: medium skin tone","o|3|1Lf|1Lg|8b","🧝🏽‍♂","o|3|1Li|1Lg|8b","🧝🏾‍♂️","man elf: medium-dark skin tone","o|3|1Lk|1Ll|8b","🧝🏾‍♂","o|3|1Ln|1Ll|8b","🧝🏿‍♂️","man elf: dark skin tone","o|3|1Lp|1Lq|8b","🧝🏿‍♂","o|3|1Ls|1Lq|8b","🧝‍♀️","woman elf","o|3|1Lu|1Lv|8b","🧝‍♀","o|3|1Lx|1Lv|8b","🧝🏻‍♀️","woman elf: light skin tone","o|3|1Lz|1M0|8b","🧝🏻‍♀","o|3|1M2|1M0|8b","🧝🏼‍♀️","woman elf: medium-light skin tone","o|3|1M4|1M5|8b","🧝🏼‍♀","o|3|1M7|1M5|8b","🧝🏽‍♀️","woman elf: medium skin tone","o|3|1M9|1MA|8b","🧝🏽‍♀","o|3|1MC|1MA|8b","🧝🏾‍♀️","woman elf: medium-dark skin tone","o|3|1ME|1MF|8b","🧝🏾‍♀","o|3|1MH|1MF|8b","🧝🏿‍♀️","woman elf: dark skin tone","o|3|1MJ|1MK|8b","🧝🏿‍♀","o|3|1MM|1MK|8b","🧞","genie","o|3|1MO|1MP|8b","🧞‍♂️","man genie","o|3|1MR|1MS|8b","🧞‍♂","o|3|1MU|1MS|8b","🧞‍♀️","woman genie","o|3|1MW|1MX|8b","🧞‍♀","o|3|1MZ|1MX|8b","🧟","zombie","o|3|1Mb|1Mc|8b","🧟‍♂️","man zombie","o|3|1Me|1Mf|8b","🧟‍♂","o|3|1Mh|1Mf|8b","🧟‍♀️","woman zombie","o|3|1Mj|1Mk|8b","🧟‍♀","o|3|1Mm|1Mk|8b","🧌","troll","o|3|1Mo|1Mp|8b","💆","person getting massage","o|3|1Mr|1Ms|8b","💆🏻","person getting massage: light skin tone","o|3|1Mu|1Mv|8b","💆🏼","person getting massage: medium-light skin tone","o|3|1Mx|1My|8b","💆🏽","person getting massage: medium skin tone","o|3|1N0|1N1|8b","💆🏾","person getting massage: medium-dark skin tone","o|3|1N3|1N4|8b","💆🏿","person getting massage: dark skin tone","o|3|1N6|1N7|8b","💆‍♂️","man getting massage","o|3|1N9|1NA|8b","💆‍♂","o|3|1NC|1NA|8b","💆🏻‍♂️","man getting massage: light skin tone","o|3|1NE|1NF|8b","💆🏻‍♂","o|3|1NH|1NF|8b","💆🏼‍♂️","man getting massage: medium-light skin tone","o|3|1NJ|1NK|8b","💆🏼‍♂","o|3|1NM|1NK|8b","💆🏽‍♂️","man getting massage: medium skin tone","o|3|1NO|1NP|8b","💆🏽‍♂","o|3|1NR|1NP|8b","💆🏾‍♂️","man getting massage: medium-dark skin tone","o|3|1NT|1NU|8b","💆🏾‍♂","o|3|1NW|1NU|8b","💆🏿‍♂️","man getting massage: dark skin tone","o|3|1NY|1NZ|8b","💆🏿‍♂","o|3|1Nb|1NZ|8b","💆‍♀️","woman getting massage","o|3|1Nd|1Ne|8b","💆‍♀","o|3|1Ng|1Ne|8b","💆🏻‍♀️","woman getting massage: light skin tone","o|3|1Ni|1Nj|8b","💆🏻‍♀","o|3|1Nl|1Nj|8b","💆🏼‍♀️","woman getting massage: medium-light skin tone","o|3|1Nn|1No|8b","💆🏼‍♀","o|3|1Nq|1No|8b","💆🏽‍♀️","woman getting massage: medium skin tone","o|3|1Ns|1Nt|8b","💆🏽‍♀","o|3|1Nv|1Nt|8b","💆🏾‍♀️","woman getting massage: medium-dark skin tone","o|3|1Nx|1Ny|8b","💆🏾‍♀","o|3|1O0|1Ny|8b","💆🏿‍♀️","woman getting massage: dark skin tone","o|3|1O2|1O3|8b","💆🏿‍♀","o|3|1O5|1O3|8b","💇","person getting haircut","o|3|1O7|1O8|8b","💇🏻","person getting haircut: light skin tone","o|3|1OA|1OB|8b","💇🏼","person getting haircut: medium-light skin tone","o|3|1OD|1OE|8b","💇🏽","person getting haircut: medium skin tone","o|3|1OG|1OH|8b","💇🏾","person getting haircut: medium-dark skin tone","o|3|1OJ|1OK|8b","💇🏿","person getting haircut: dark skin tone","o|3|1OM|1ON|8b","💇‍♂️","man getting haircut","o|3|1OP|1OQ|8b","💇‍♂","o|3|1OS|1OQ|8b","💇🏻‍♂️","man getting haircut: light skin tone","o|3|1OU|1OV|8b","💇🏻‍♂","o|3|1OX|1OV|8b","💇🏼‍♂️","man getting haircut: medium-light skin tone","o|3|1OZ|1Oa|8b","💇🏼‍♂","o|3|1Oc|1Oa|8b","💇🏽‍♂️","man getting haircut: medium skin tone","o|3|1Oe|1Of|8b","💇🏽‍♂","o|3|1Oh|1Of|8b","💇🏾‍♂️","man getting haircut: medium-dark skin tone","o|3|1Oj|1Ok|8b","💇🏾‍♂","o|3|1Om|1Ok|8b","💇🏿‍♂️","man getting haircut: dark skin tone","o|3|1Oo|1Op|8b","💇🏿‍♂","o|3|1Or|1Op|8b","💇‍♀️","woman getting haircut","o|3|1Ot|1Ou|8b","💇‍♀","o|3|1Ow|1Ou|8b","💇🏻‍♀️","woman getting haircut: light skin tone","o|3|1Oy|1Oz|8b","💇🏻‍♀","o|3|1P1|1Oz|8b","💇🏼‍♀️","woman getting haircut: medium-light skin tone","o|3|1P3|1P4|8b","💇🏼‍♀","o|3|1P6|1P4|8b","💇🏽‍♀️","woman getting haircut: medium skin tone","o|3|1P8|1P9|8b","💇🏽‍♀","o|3|1PB|1P9|8b","💇🏾‍♀️","woman getting haircut: medium-dark skin tone","o|3|1PD|1PE|8b","💇🏾‍♀","o|3|1PG|1PE|8b","💇🏿‍♀️","woman getting haircut: dark skin tone","o|3|1PI|1PJ|8b","💇🏿‍♀","o|3|1PL|1PJ|8b","🚶","person walking","o|3|1PN|1PO|8b","🚶🏻","person walking: light skin tone","o|3|1PQ|1PR|8b","🚶🏼","person walking: medium-light skin tone","o|3|1PT|1PU|8b","🚶🏽","person walking: medium skin tone","o|3|1PW|1PX|8b","🚶🏾","person walking: medium-dark skin tone","o|3|1PZ|1Pa|8b","🚶🏿","person walking: dark skin tone","o|3|1Pc|1Pd|8b","🚶‍♂️","man walking","o|3|1Pf|1Pg|8b","🚶‍♂","o|3|1Pi|1Pg|8b","🚶🏻‍♂️","man walking: light skin tone","o|3|1Pk|1Pl|8b","🚶🏻‍♂","o|3|1Pn|1Pl|8b","🚶🏼‍♂️","man walking: medium-light skin tone","o|3|1Pp|1Pq|8b","🚶🏼‍♂","o|3|1Ps|1Pq|8b","🚶🏽‍♂️","man walking: medium skin tone","o|3|1Pu|1Pv|8b","🚶🏽‍♂","o|3|1Px|1Pv|8b","🚶🏾‍♂️","man walking: medium-dark skin tone","o|3|1Pz|1Q0|8b","🚶🏾‍♂","o|3|1Q2|1Q0|8b","🚶🏿‍♂️","man walking: dark skin tone","o|3|1Q4|1Q5|8b","🚶🏿‍♂","o|3|1Q7|1Q5|8b","🚶‍♀️","woman walking","o|3|1Q9|1QA|8b","🚶‍♀","o|3|1QC|1QA|8b","🚶🏻‍♀️","woman walking: light skin tone","o|3|1QE|1QF|8b","🚶🏻‍♀","o|3|1QH|1QF|8b","🚶🏼‍♀️","woman walking: medium-light skin tone","o|3|1QJ|1QK|8b","🚶🏼‍♀","o|3|1QM|1QK|8b","🚶🏽‍♀️","woman walking: medium skin tone","o|3|1QO|1QP|8b","🚶🏽‍♀","o|3|1QR|1QP|8b","🚶🏾‍♀️","woman walking: medium-dark skin tone","o|3|1QT|1QU|8b","🚶🏾‍♀","o|3|1QW|1QU|8b","🚶🏿‍♀️","woman walking: dark skin tone","o|3|1QY|1QZ|8b","🚶🏿‍♀","o|3|1Qb|1QZ|8b","🧍","person standing","o|3|1Qd|1Qe|8b","🧍🏻","person standing: light skin tone","o|3|1Qg|1Qh|8b","🧍🏼","person standing: medium-light skin tone","o|3|1Qj|1Qk|8b","🧍🏽","person standing: medium skin tone","o|3|1Qm|1Qn|8b","🧍🏾","person standing: medium-dark skin tone","o|3|1Qp|1Qq|8b","🧍🏿","person standing: dark skin tone","o|3|1Qs|1Qt|8b","🧍‍♂️","man standing","o|3|1Qv|1Qw|8b","🧍‍♂","o|3|1Qy|1Qw|8b","🧍🏻‍♂️","man standing: light skin tone","o|3|1R0|1R1|8b","🧍🏻‍♂","o|3|1R3|1R1|8b","🧍🏼‍♂️","man standing: medium-light skin tone","o|3|1R5|1R6|8b","🧍🏼‍♂","o|3|1R8|1R6|8b","🧍🏽‍♂️","man standing: medium skin tone","o|3|1RA|1RB|8b","🧍🏽‍♂","o|3|1RD|1RB|8b","🧍🏾‍♂️","man standing: medium-dark skin tone","o|3|1RF|1RG|8b","🧍🏾‍♂","o|3|1RI|1RG|8b","🧍🏿‍♂️","man standing: dark skin tone","o|3|1RK|1RL|8b","🧍🏿‍♂","o|3|1RN|1RL|8b","🧍‍♀️","woman standing","o|3|1RP|1RQ|8b","🧍‍♀","o|3|1RS|1RQ|8b","🧍🏻‍♀️","woman standing: light skin tone","o|3|1RU|1RV|8b","🧍🏻‍♀","o|3|1RX|1RV|8b","🧍🏼‍♀️","woman standing: medium-light skin tone","o|3|1RZ|1Ra|8b","🧍🏼‍♀","o|3|1Rc|1Ra|8b","🧍🏽‍♀️","woman standing: medium skin tone","o|3|1Re|1Rf|8b","🧍🏽‍♀","o|3|1Rh|1Rf|8b","🧍🏾‍♀️","woman standing: medium-dark skin tone","o|3|1Rj|1Rk|8b","🧍🏾‍♀","o|3|1Rm|1Rk|8b","🧍🏿‍♀️","woman standing: dark skin tone","o|3|1Ro|1Rp|8b","🧍🏿‍♀","o|3|1Rr|1Rp|8b","🧎","person kneeling","o|3|1Rt|1Ru|8b","🧎🏻","person kneeling: light skin tone","o|3|1Rw|1Rx|8b","🧎🏼","person kneeling: medium-light skin tone","o|3|1Rz|1S0|8b","🧎🏽","person kneeling: medium skin tone","o|3|1S2|1S3|8b","🧎🏾","person kneeling: medium-dark skin tone","o|3|1S5|1S6|8b","🧎🏿","person kneeling: dark skin tone","o|3|1S8|1S9|8b","🧎‍♂️","man kneeling","o|3|1SB|1SC|8b","🧎‍♂","o|3|1SE|1SC|8b","🧎🏻‍♂️","man kneeling: light skin tone","o|3|1SG|1SH|8b","🧎🏻‍♂","o|3|1SJ|1SH|8b","🧎🏼‍♂️","man kneeling: medium-light skin tone","o|3|1SL|1SM|8b","🧎🏼‍♂","o|3|1SO|1SM|8b","🧎🏽‍♂️","man kneeling: medium skin tone","o|3|1SQ|1SR|8b","🧎🏽‍♂","o|3|1ST|1SR|8b","🧎🏾‍♂️","man kneeling: medium-dark skin tone","o|3|1SV|1SW|8b","🧎🏾‍♂","o|3|1SY|1SW|8b","🧎🏿‍♂️","man kneeling: dark skin tone","o|3|1Sa|1Sb|8b","🧎🏿‍♂","o|3|1Sd|1Sb|8b","🧎‍♀️","woman kneeling","o|3|1Sf|1Sg|8b","🧎‍♀","o|3|1Si|1Sg|8b","🧎🏻‍♀️","woman kneeling: light skin tone","o|3|1Sk|1Sl|8b","🧎🏻‍♀","o|3|1Sn|1Sl|8b","🧎🏼‍♀️","woman kneeling: medium-light skin tone","o|3|1Sp|1Sq|8b","🧎🏼‍♀","o|3|1Ss|1Sq|8b","🧎🏽‍♀️","woman kneeling: medium skin tone","o|3|1Su|1Sv|8b","🧎🏽‍♀","o|3|1Sx|1Sv|8b","🧎🏾‍♀️","woman kneeling: medium-dark skin tone","o|3|1Sz|1T0|8b","🧎🏾‍♀","o|3|1T2|1T0|8b","🧎🏿‍♀️","woman kneeling: dark skin tone","o|3|1T4|1T5|8b","🧎🏿‍♀","o|3|1T7|1T5|8b","🧑‍🦯","person with white cane","o|3|1T9|1TA|8b","🧑🏻‍🦯","person with white cane: light skin tone","o|3|1TC|1TD|8b","🧑🏼‍🦯","person with white cane: medium-light skin tone","o|3|1TF|1TG|8b","🧑🏽‍🦯","person with white cane: medium skin tone","o|3|1TI|1TJ|8b","🧑🏾‍🦯","person with white cane: medium-dark skin tone","o|3|1TL|1TM|8b","🧑🏿‍🦯","person with white cane: dark skin tone","o|3|1TO|1TP|8b","👨‍🦯","man with white cane","o|3|1TR|1TS|8b","👨🏻‍🦯","man with white cane: light skin tone","o|3|1TU|1TV|8b","👨🏼‍🦯","man with white cane: medium-light skin tone","o|3|1TX|1TY|8b","👨🏽‍🦯","man with white cane: medium skin tone","o|3|1Ta|1Tb|8b","👨🏾‍🦯","man with white cane: medium-dark skin tone","o|3|1Td|1Te|8b","👨🏿‍🦯","man with white cane: dark skin tone","o|3|1Tg|1Th|8b","👩‍🦯","woman with white cane","o|3|1Tj|1Tk|8b","👩🏻‍🦯","woman with white cane: light skin tone","o|3|1Tm|1Tn|8b","👩🏼‍🦯","woman with white cane: medium-light skin tone","o|3|1Tp|1Tq|8b","👩🏽‍🦯","woman with white cane: medium skin tone","o|3|1Ts|1Tt|8b","👩🏾‍🦯","woman with white cane: medium-dark skin tone","o|3|1Tv|1Tw|8b","👩🏿‍🦯","woman with white cane: dark skin tone","o|3|1Ty|1Tz|8b","🧑‍🦼","person in motorized wheelchair","o|3|1U1|1U2|8b","🧑🏻‍🦼","person in motorized wheelchair: light skin tone","o|3|1U4|1U5|8b","🧑🏼‍🦼","person in motorized wheelchair: medium-light skin tone","o|3|1U7|1U8|8b","🧑🏽‍🦼","person in motorized wheelchair: medium skin tone","o|3|1UA|1UB|8b","🧑🏾‍🦼","person in motorized wheelchair: medium-dark skin tone","o|3|1UD|1UE|8b","🧑🏿‍🦼","person in motorized wheelchair: dark skin tone","o|3|1UG|1UH|8b","👨‍🦼","man in motorized wheelchair","o|3|1UJ|1UK|8b","👨🏻‍🦼","man in motorized wheelchair: light skin tone","o|3|1UM|1UN|8b","👨🏼‍🦼","man in motorized wheelchair: medium-light skin tone","o|3|1UP|1UQ|8b","👨🏽‍🦼","man in motorized wheelchair: medium skin tone","o|3|1US|1UT|8b","👨🏾‍🦼","man in motorized wheelchair: medium-dark skin tone","o|3|1UV|1UW|8b","👨🏿‍🦼","man in motorized wheelchair: dark skin tone","o|3|1UY|1UZ|8b","👩‍🦼","woman in motorized wheelchair","o|3|1Ub|1Uc|8b","👩🏻‍🦼","woman in motorized wheelchair: light skin tone","o|3|1Ue|1Uf|8b","👩🏼‍🦼","woman in motorized wheelchair: medium-light skin tone","o|3|1Uh|1Ui|8b","👩🏽‍🦼","woman in motorized wheelchair: medium skin tone","o|3|1Uk|1Ul|8b","👩🏾‍🦼","woman in motorized wheelchair: medium-dark skin tone","o|3|1Un|1Uo|8b","👩🏿‍🦼","woman in motorized wheelchair: dark skin tone","o|3|1Uq|1Ur|8b","🧑‍🦽","person in manual wheelchair","o|3|1Ut|1Uu|8b","🧑🏻‍🦽","person in manual wheelchair: light skin tone","o|3|1Uw|1Ux|8b","🧑🏼‍🦽","person in manual wheelchair: medium-light skin tone","o|3|1Uz|1V0|8b","🧑🏽‍🦽","person in manual wheelchair: medium skin tone","o|3|1V2|1V3|8b","🧑🏾‍🦽","person in manual wheelchair: medium-dark skin tone","o|3|1V5|1V6|8b","🧑🏿‍🦽","person in manual wheelchair: dark skin tone","o|3|1V8|1V9|8b","👨‍🦽","man in manual wheelchair","o|3|1VB|1VC|8b","👨🏻‍🦽","man in manual wheelchair: light skin tone","o|3|1VE|1VF|8b","👨🏼‍🦽","man in manual wheelchair: medium-light skin tone","o|3|1VH|1VI|8b","👨🏽‍🦽","man in manual wheelchair: medium skin tone","o|3|1VK|1VL|8b","👨🏾‍🦽","man in manual wheelchair: medium-dark skin tone","o|3|1VN|1VO|8b","👨🏿‍🦽","man in manual wheelchair: dark skin tone","o|3|1VQ|1VR|8b","👩‍🦽","woman in manual wheelchair","o|3|1VT|1VU|8b","👩🏻‍🦽","woman in manual wheelchair: light skin tone","o|3|1VW|1VX|8b","👩🏼‍🦽","woman in manual wheelchair: medium-light skin tone","o|3|1VZ|1Va|8b","👩🏽‍🦽","woman in manual wheelchair: medium skin tone","o|3|1Vc|1Vd|8b","👩🏾‍🦽","woman in manual wheelchair: medium-dark skin tone","o|3|1Vf|1Vg|8b","👩🏿‍🦽","woman in manual wheelchair: dark skin tone","o|3|1Vi|1Vj|8b","🏃","person running","o|3|1Vl|1Vm|8b","🏃🏻","person running: light skin tone","o|3|1Vo|1Vp|8b","🏃🏼","person running: medium-light skin tone","o|3|1Vr|1Vs|8b","🏃🏽","person running: medium skin tone","o|3|1Vu|1Vv|8b","🏃🏾","person running: medium-dark skin tone","o|3|1Vx|1Vy|8b","🏃🏿","person running: dark skin tone","o|3|1W0|1W1|8b","🏃‍♂️","man running","o|3|1W3|1W4|8b","🏃‍♂","o|3|1W6|1W4|8b","🏃🏻‍♂️","man running: light skin tone","o|3|1W8|1W9|8b","🏃🏻‍♂","o|3|1WB|1W9|8b","🏃🏼‍♂️","man running: medium-light skin tone","o|3|1WD|1WE|8b","🏃🏼‍♂","o|3|1WG|1WE|8b","🏃🏽‍♂️","man running: medium skin tone","o|3|1WI|1WJ|8b","🏃🏽‍♂","o|3|1WL|1WJ|8b","🏃🏾‍♂️","man running: medium-dark skin tone","o|3|1WN|1WO|8b","🏃🏾‍♂","o|3|1WQ|1WO|8b","🏃🏿‍♂️","man running: dark skin tone","o|3|1WS|1WT|8b","🏃🏿‍♂","o|3|1WV|1WT|8b","🏃‍♀️","woman running","o|3|1WX|1WY|8b","🏃‍♀","o|3|1Wa|1WY|8b","🏃🏻‍♀️","woman running: light skin tone","o|3|1Wc|1Wd|8b","🏃🏻‍♀","o|3|1Wf|1Wd|8b","🏃🏼‍♀️","woman running: medium-light skin tone","o|3|1Wh|1Wi|8b","🏃🏼‍♀","o|3|1Wk|1Wi|8b","🏃🏽‍♀️","woman running: medium skin tone","o|3|1Wm|1Wn|8b","🏃🏽‍♀","o|3|1Wp|1Wn|8b","🏃🏾‍♀️","woman running: medium-dark skin tone","o|3|1Wr|1Ws|8b","🏃🏾‍♀","o|3|1Wu|1Ws|8b","🏃🏿‍♀️","woman running: dark skin tone","o|3|1Ww|1Wx|8b","🏃🏿‍♀","o|3|1Wz|1Wx|8b","💃","woman dancing","o|3|1X1|1X2|8b","💃🏻","woman dancing: light skin tone","o|3|1X4|1X5|8b","💃🏼","woman dancing: medium-light skin tone","o|3|1X7|1X8|8b","💃🏽","woman dancing: medium skin tone","o|3|1XA|1XB|8b","💃🏾","woman dancing: medium-dark skin tone","o|3|1XD|1XE|8b","💃🏿","woman dancing: dark skin tone","o|3|1XG|1XH|8b","🕺","man dancing","o|3|1XJ|1XK|8b","🕺🏻","man dancing: light skin tone","o|3|1XM|1XN|8b","🕺🏼","man dancing: medium-light skin tone","o|3|1XP|1XQ|8b","🕺🏽","man dancing: medium skin tone","o|3|1XS|1XT|8b","🕺🏾","man dancing: medium-dark skin tone","o|3|1XV|1XW|8b","🕺🏿","man dancing: dark skin tone","o|3|1XY|1XZ|8b","🕴️","person in suit levitating","o|3|1Xb|1Xc|8b","🕴","o|3|1Xe|1Xc|8b","🕴🏻","person in suit levitating: light skin tone","o|3|1Xg|1Xh|8b","🕴🏼","person in suit levitating: medium-light skin tone","o|3|1Xj|1Xk|8b","🕴🏽","person in suit levitating: medium skin tone","o|3|1Xm|1Xn|8b","🕴🏾","person in suit levitating: medium-dark skin tone","o|3|1Xp|1Xq|8b","🕴🏿","person in suit levitating: dark skin tone","o|3|1Xs|1Xt|8b","👯","people with bunny ears","o|3|1Xv|1Xw|8b","👯‍♂️","men with bunny ears","o|3|1Xy|1Xz|8b","👯‍♂","o|3|1Y1|1Xz|8b","👯‍♀️","women with bunny ears","o|3|1Y3|1Y4|8b","👯‍♀","o|3|1Y6|1Y4|8b","🧖","person in steamy room","o|3|1Y8|1Y9|8b","🧖🏻","person in steamy room: light skin tone","o|3|1YB|1YC|8b","🧖🏼","person in steamy room: medium-light skin tone","o|3|1YE|1YF|8b","🧖🏽","person in steamy room: medium skin tone","o|3|1YH|1YI|8b","🧖🏾","person in steamy room: medium-dark skin tone","o|3|1YK|1YL|8b","🧖🏿","person in steamy room: dark skin tone","o|3|1YN|1YO|8b","🧖‍♂️","man in steamy room","o|3|1YQ|1YR|8b","🧖‍♂","o|3|1YT|1YR|8b","🧖🏻‍♂️","man in steamy room: light skin tone","o|3|1YV|1YW|8b","🧖🏻‍♂","o|3|1YY|1YW|8b","🧖🏼‍♂️","man in steamy room: medium-light skin tone","o|3|1Ya|1Yb|8b","🧖🏼‍♂","o|3|1Yd|1Yb|8b","🧖🏽‍♂️","man in steamy room: medium skin tone","o|3|1Yf|1Yg|8b","🧖🏽‍♂","o|3|1Yi|1Yg|8b","🧖🏾‍♂️","man in steamy room: medium-dark skin tone","o|3|1Yk|1Yl|8b","🧖🏾‍♂","o|3|1Yn|1Yl|8b","🧖🏿‍♂️","man in steamy room: dark skin tone","o|3|1Yp|1Yq|8b","🧖🏿‍♂","o|3|1Ys|1Yq|8b","🧖‍♀️","woman in steamy room","o|3|1Yu|1Yv|8b","🧖‍♀","o|3|1Yx|1Yv|8b","🧖🏻‍♀️","woman in steamy room: light skin tone","o|3|1Yz|1Z0|8b","🧖🏻‍♀","o|3|1Z2|1Z0|8b","🧖🏼‍♀️","woman in steamy room: medium-light skin tone","o|3|1Z4|1Z5|8b","🧖🏼‍♀","o|3|1Z7|1Z5|8b","🧖🏽‍♀️","woman in steamy room: medium skin tone","o|3|1Z9|1ZA|8b","🧖🏽‍♀","o|3|1ZC|1ZA|8b","🧖🏾‍♀️","woman in steamy room: medium-dark skin tone","o|3|1ZE|1ZF|8b","🧖🏾‍♀","o|3|1ZH|1ZF|8b","🧖🏿‍♀️","woman in steamy room: dark skin tone","o|3|1ZJ|1ZK|8b","🧖🏿‍♀","o|3|1ZM|1ZK|8b","🧗","person climbing","o|3|1ZO|1ZP|8b","🧗🏻","person climbing: light skin tone","o|3|1ZR|1ZS|8b","🧗🏼","person climbing: medium-light skin tone","o|3|1ZU|1ZV|8b","🧗🏽","person climbing: medium skin tone","o|3|1ZX|1ZY|8b","🧗🏾","person climbing: medium-dark skin tone","o|3|1Za|1Zb|8b","🧗🏿","person climbing: dark skin tone","o|3|1Zd|1Ze|8b","🧗‍♂️","man climbing","o|3|1Zg|1Zh|8b","🧗‍♂","o|3|1Zj|1Zh|8b","🧗🏻‍♂️","man climbing: light skin tone","o|3|1Zl|1Zm|8b","🧗🏻‍♂","o|3|1Zo|1Zm|8b","🧗🏼‍♂️","man climbing: medium-light skin tone","o|3|1Zq|1Zr|8b","🧗🏼‍♂","o|3|1Zt|1Zr|8b","🧗🏽‍♂️","man climbing: medium skin tone","o|3|1Zv|1Zw|8b","🧗🏽‍♂","o|3|1Zy|1Zw|8b","🧗🏾‍♂️","man climbing: medium-dark skin tone","o|3|1a0|1a1|8b","🧗🏾‍♂","o|3|1a3|1a1|8b","🧗🏿‍♂️","man climbing: dark skin tone","o|3|1a5|1a6|8b","🧗🏿‍♂","o|3|1a8|1a6|8b","🧗‍♀️","woman climbing","o|3|1aA|1aB|8b","🧗‍♀","o|3|1aD|1aB|8b","🧗🏻‍♀️","woman climbing: light skin tone","o|3|1aF|1aG|8b","🧗🏻‍♀","o|3|1aI|1aG|8b","🧗🏼‍♀️","woman climbing: medium-light skin tone","o|3|1aK|1aL|8b","🧗🏼‍♀","o|3|1aN|1aL|8b","🧗🏽‍♀️","woman climbing: medium skin tone","o|3|1aP|1aQ|8b","🧗🏽‍♀","o|3|1aS|1aQ|8b","🧗🏾‍♀️","woman climbing: medium-dark skin tone","o|3|1aU|1aV|8b","🧗🏾‍♀","o|3|1aX|1aV|8b","🧗🏿‍♀️","woman climbing: dark skin tone","o|3|1aZ|1aa|8b","🧗🏿‍♀","o|3|1ac|1aa|8b","🤺","person fencing","o|3|1ae|1af|8b","🏇","horse racing","o|3|1ah|1ai|8b","🏇🏻","horse racing: light skin tone","o|3|1ak|1al|8b","🏇🏼","horse racing: medium-light skin tone","o|3|1an|1ao|8b","🏇🏽","horse racing: medium skin tone","o|3|1aq|1ar|8b","🏇🏾","horse racing: medium-dark skin tone","o|3|1at|1au|8b","🏇🏿","horse racing: dark skin tone","o|3|1aw|1ax|8b","⛷️","skier","o|3|1az|1b0|8b","⛷","o|3|1b2|1b0|8b","🏂","snowboarder","o|3|1b4|1b5|8b","🏂🏻","snowboarder: light skin tone","o|3|1b7|1b8|8b","🏂🏼","snowboarder: medium-light skin tone","o|3|1bA|1bB|8b","🏂🏽","snowboarder: medium skin tone","o|3|1bD|1bE|8b","🏂🏾","snowboarder: medium-dark skin tone","o|3|1bG|1bH|8b","🏂🏿","snowboarder: dark skin tone","o|3|1bJ|1bK|8b","🏌️","person golfing","o|3|1bM|1bN|8b","🏌","o|3|1bP|1bN|8b","🏌🏻","person golfing: light skin tone","o|3|1bR|1bS|8b","🏌🏼","person golfing: medium-light skin tone","o|3|1bU|1bV|8b","🏌🏽","person golfing: medium skin tone","o|3|1bX|1bY|8b","🏌🏾","person golfing: medium-dark skin tone","o|3|1ba|1bb|8b","🏌🏿","person golfing: dark skin tone","o|3|1bd|1be|8b","🏌️‍♂️","man golfing","o|3|1bg|1bh|8b","🏌‍♂️","o|3|1bj|1bh|8b","🏌️‍♂","o|3|1bl|1bh|8b","🏌‍♂","o|3|1bn|1bh|8b","🏌🏻‍♂️","man golfing: light skin tone","o|3|1bp|1bq|8b","🏌🏻‍♂","o|3|1bs|1bq|8b","🏌🏼‍♂️","man golfing: medium-light skin tone","o|3|1bu|1bv|8b","🏌🏼‍♂","o|3|1bx|1bv|8b","🏌🏽‍♂️","man golfing: medium skin tone","o|3|1bz|1c0|8b","🏌🏽‍♂","o|3|1c2|1c0|8b","🏌🏾‍♂️","man golfing: medium-dark skin tone","o|3|1c4|1c5|8b","🏌🏾‍♂","o|3|1c7|1c5|8b","🏌🏿‍♂️","man golfing: dark skin tone","o|3|1c9|1cA|8b","🏌🏿‍♂","o|3|1cC|1cA|8b","🏌️‍♀️","woman golfing","o|3|1cE|1cF|8b","🏌‍♀️","o|3|1cH|1cF|8b","🏌️‍♀","o|3|1cJ|1cF|8b","🏌‍♀","o|3|1cL|1cF|8b","🏌🏻‍♀️","woman golfing: light skin tone","o|3|1cN|1cO|8b","🏌🏻‍♀","o|3|1cQ|1cO|8b","🏌🏼‍♀️","woman golfing: medium-light skin tone","o|3|1cS|1cT|8b","🏌🏼‍♀","o|3|1cV|1cT|8b","🏌🏽‍♀️","woman golfing: medium skin tone","o|3|1cX|1cY|8b","🏌🏽‍♀","o|3|1ca|1cY|8b","🏌🏾‍♀️","woman golfing: medium-dark skin tone","o|3|1cc|1cd|8b","🏌🏾‍♀","o|3|1cf|1cd|8b","🏌🏿‍♀️","woman golfing: dark skin tone","o|3|1ch|1ci|8b","🏌🏿‍♀","o|3|1ck|1ci|8b","🏄","person surfing","o|3|1cm|1cn|8b","🏄🏻","person surfing: light skin tone","o|3|1cp|1cq|8b","🏄🏼","person surfing: medium-light skin tone","o|3|1cs|1ct|8b","🏄🏽","person surfing: medium skin tone","o|3|1cv|1cw|8b","🏄🏾","person surfing: medium-dark skin tone","o|3|1cy|1cz|8b","🏄🏿","person surfing: dark skin tone","o|3|1d1|1d2|8b","🏄‍♂️","man surfing","o|3|1d4|1d5|8b","🏄‍♂","o|3|1d7|1d5|8b","🏄🏻‍♂️","man surfing: light skin tone","o|3|1d9|1dA|8b","🏄🏻‍♂","o|3|1dC|1dA|8b","🏄🏼‍♂️","man surfing: medium-light skin tone","o|3|1dE|1dF|8b","🏄🏼‍♂","o|3|1dH|1dF|8b","🏄🏽‍♂️","man surfing: medium skin tone","o|3|1dJ|1dK|8b","🏄🏽‍♂","o|3|1dM|1dK|8b","🏄🏾‍♂️","man surfing: medium-dark skin tone","o|3|1dO|1dP|8b","🏄🏾‍♂","o|3|1dR|1dP|8b","🏄🏿‍♂️","man surfing: dark skin tone","o|3|1dT|1dU|8b","🏄🏿‍♂","o|3|1dW|1dU|8b","🏄‍♀️","woman surfing","o|3|1dY|1dZ|8b","🏄‍♀","o|3|1db|1dZ|8b","🏄🏻‍♀️","woman surfing: light skin tone","o|3|1dd|1de|8b","🏄🏻‍♀","o|3|1dg|1de|8b","🏄🏼‍♀️","woman surfing: medium-light skin tone","o|3|1di|1dj|8b","🏄🏼‍♀","o|3|1dl|1dj|8b","🏄🏽‍♀️","woman surfing: medium skin tone","o|3|1dn|1do|8b","🏄🏽‍♀","o|3|1dq|1do|8b","🏄🏾‍♀️","woman surfing: medium-dark skin tone","o|3|1ds|1dt|8b","🏄🏾‍♀","o|3|1dv|1dt|8b","🏄🏿‍♀️","woman surfing: dark skin tone","o|3|1dx|1dy|8b","🏄🏿‍♀","o|3|1e0|1dy|8b","🚣","person rowing boat","o|3|1e2|1e3|8b","🚣🏻","person rowing boat: light skin tone","o|3|1e5|1e6|8b","🚣🏼","person rowing boat: medium-light skin tone","o|3|1e8|1e9|8b","🚣🏽","person rowing boat: medium skin tone","o|3|1eB|1eC|8b","🚣🏾","person rowing boat: medium-dark skin tone","o|3|1eE|1eF|8b","🚣🏿","person rowing boat: dark skin tone","o|3|1eH|1eI|8b","🚣‍♂️","man rowing boat","o|3|1eK|1eL|8b","🚣‍♂","o|3|1eN|1eL|8b","🚣🏻‍♂️","man rowing boat: light skin tone","o|3|1eP|1eQ|8b","🚣🏻‍♂","o|3|1eS|1eQ|8b","🚣🏼‍♂️","man rowing boat: medium-light skin tone","o|3|1eU|1eV|8b","🚣🏼‍♂","o|3|1eX|1eV|8b","🚣🏽‍♂️","man rowing boat: medium skin tone","o|3|1eZ|1ea|8b","🚣🏽‍♂","o|3|1ec|1ea|8b","🚣🏾‍♂️","man rowing boat: medium-dark skin tone","o|3|1ee|1ef|8b","🚣🏾‍♂","o|3|1eh|1ef|8b","🚣🏿‍♂️","man rowing boat: dark skin tone","o|3|1ej|1ek|8b","🚣🏿‍♂","o|3|1em|1ek|8b","🚣‍♀️","woman rowing boat","o|3|1eo|1ep|8b","🚣‍♀","o|3|1er|1ep|8b","🚣🏻‍♀️","woman rowing boat: light skin tone","o|3|1et|1eu|8b","🚣🏻‍♀","o|3|1ew|1eu|8b","🚣🏼‍♀️","woman rowing boat: medium-light skin tone","o|3|1ey|1ez|8b","🚣🏼‍♀","o|3|1f1|1ez|8b","🚣🏽‍♀️","woman rowing boat: medium skin tone","o|3|1f3|1f4|8b","🚣🏽‍♀","o|3|1f6|1f4|8b","🚣🏾‍♀️","woman rowing boat: medium-dark skin tone","o|3|1f8|1f9|8b","🚣🏾‍♀","o|3|1fB|1f9|8b","🚣🏿‍♀️","woman rowing boat: dark skin tone","o|3|1fD|1fE|8b","🚣🏿‍♀","o|3|1fG|1fE|8b","🏊","person swimming","o|3|1fI|1fJ|8b","🏊🏻","person swimming: light skin tone","o|3|1fL|1fM|8b","🏊🏼","person swimming: medium-light skin tone","o|3|1fO|1fP|8b","🏊🏽","person swimming: medium skin tone","o|3|1fR|1fS|8b","🏊🏾","person swimming: medium-dark skin tone","o|3|1fU|1fV|8b","🏊🏿","person swimming: dark skin tone","o|3|1fX|1fY|8b","🏊‍♂️","man swimming","o|3|1fa|1fb|8b","🏊‍♂","o|3|1fd|1fb|8b","🏊🏻‍♂️","man swimming: light skin tone","o|3|1ff|1fg|8b","🏊🏻‍♂","o|3|1fi|1fg|8b","🏊🏼‍♂️","man swimming: medium-light skin tone","o|3|1fk|1fl|8b","🏊🏼‍♂","o|3|1fn|1fl|8b","🏊🏽‍♂️","man swimming: medium skin tone","o|3|1fp|1fq|8b","🏊🏽‍♂","o|3|1fs|1fq|8b","🏊🏾‍♂️","man swimming: medium-dark skin tone","o|3|1fu|1fv|8b","🏊🏾‍♂","o|3|1fx|1fv|8b","🏊🏿‍♂️","man swimming: dark skin tone","o|3|1fz|1g0|8b","🏊🏿‍♂","o|3|1g2|1g0|8b","🏊‍♀️","woman swimming","o|3|1g4|1g5|8b","🏊‍♀","o|3|1g7|1g5|8b","🏊🏻‍♀️","woman swimming: light skin tone","o|3|1g9|1gA|8b","🏊🏻‍♀","o|3|1gC|1gA|8b","🏊🏼‍♀️","woman swimming: medium-light skin tone","o|3|1gE|1gF|8b","🏊🏼‍♀","o|3|1gH|1gF|8b","🏊🏽‍♀️","woman swimming: medium skin tone","o|3|1gJ|1gK|8b","🏊🏽‍♀","o|3|1gM|1gK|8b","🏊🏾‍♀️","woman swimming: medium-dark skin tone","o|3|1gO|1gP|8b","🏊🏾‍♀","o|3|1gR|1gP|8b","🏊🏿‍♀️","woman swimming: dark skin tone","o|3|1gT|1gU|8b","🏊🏿‍♀","o|3|1gW|1gU|8b","⛹️","person bouncing ball","o|3|1gY|1gZ|8b","⛹","o|3|1gb|1gZ|8b","⛹🏻","person bouncing ball: light skin tone","o|3|1gd|1ge|8b","⛹🏼","person bouncing ball: medium-light skin tone","o|3|1gg|1gh|8b","⛹🏽","person bouncing ball: medium skin tone","o|3|1gj|1gk|8b","⛹🏾","person bouncing ball: medium-dark skin tone","o|3|1gm|1gn|8b","⛹🏿","person bouncing ball: dark skin tone","o|3|1gp|1gq|8b","⛹️‍♂️","man bouncing ball","o|3|1gs|1gt|8b","⛹‍♂️","o|3|1gv|1gt|8b","⛹️‍♂","o|3|1gx|1gt|8b","⛹‍♂","o|3|1gz|1gt|8b","⛹🏻‍♂️","man bouncing ball: light skin tone","o|3|1h1|1h2|8b","⛹🏻‍♂","o|3|1h4|1h2|8b","⛹🏼‍♂️","man bouncing ball: medium-light skin tone","o|3|1h6|1h7|8b","⛹🏼‍♂","o|3|1h9|1h7|8b","⛹🏽‍♂️","man bouncing ball: medium skin tone","o|3|1hB|1hC|8b","⛹🏽‍♂","o|3|1hE|1hC|8b","⛹🏾‍♂️","man bouncing ball: medium-dark skin tone","o|3|1hG|1hH|8b","⛹🏾‍♂","o|3|1hJ|1hH|8b","⛹🏿‍♂️","man bouncing ball: dark skin tone","o|3|1hL|1hM|8b","⛹🏿‍♂","o|3|1hO|1hM|8b","⛹️‍♀️","woman bouncing ball","o|3|1hQ|1hR|8b","⛹‍♀️","o|3|1hT|1hR|8b","⛹️‍♀","o|3|1hV|1hR|8b","⛹‍♀","o|3|1hX|1hR|8b","⛹🏻‍♀️","woman bouncing ball: light skin tone","o|3|1hZ|1ha|8b","⛹🏻‍♀","o|3|1hc|1ha|8b","⛹🏼‍♀️","woman bouncing ball: medium-light skin tone","o|3|1he|1hf|8b","⛹🏼‍♀","o|3|1hh|1hf|8b","⛹🏽‍♀️","woman bouncing ball: medium skin tone","o|3|1hj|1hk|8b","⛹🏽‍♀","o|3|1hm|1hk|8b","⛹🏾‍♀️","woman bouncing ball: medium-dark skin tone","o|3|1ho|1hp|8b","⛹🏾‍♀","o|3|1hr|1hp|8b","⛹🏿‍♀️","woman bouncing ball: dark skin tone","o|3|1ht|1hu|8b","⛹🏿‍♀","o|3|1hw|1hu|8b","🏋️","person lifting weights","o|3|1hy|1hz|8b","🏋","o|3|1i1|1hz|8b","🏋🏻","person lifting weights: light skin tone","o|3|1i3|1i4|8b","🏋🏼","person lifting weights: medium-light skin tone","o|3|1i6|1i7|8b","🏋🏽","person lifting weights: medium skin tone","o|3|1i9|1iA|8b","🏋🏾","person lifting weights: medium-dark skin tone","o|3|1iC|1iD|8b","🏋🏿","person lifting weights: dark skin tone","o|3|1iF|1iG|8b","🏋️‍♂️","man lifting weights","o|3|1iI|1iJ|8b","🏋‍♂️","o|3|1iL|1iJ|8b","🏋️‍♂","o|3|1iN|1iJ|8b","🏋‍♂","o|3|1iP|1iJ|8b","🏋🏻‍♂️","man lifting weights: light skin tone","o|3|1iR|1iS|8b","🏋🏻‍♂","o|3|1iU|1iS|8b","🏋🏼‍♂️","man lifting weights: medium-light skin tone","o|3|1iW|1iX|8b","🏋🏼‍♂","o|3|1iZ|1iX|8b","🏋🏽‍♂️","man lifting weights: medium skin tone","o|3|1ib|1ic|8b","🏋🏽‍♂","o|3|1ie|1ic|8b","🏋🏾‍♂️","man lifting weights: medium-dark skin tone","o|3|1ig|1ih|8b","🏋🏾‍♂","o|3|1ij|1ih|8b","🏋🏿‍♂️","man lifting weights: dark skin tone","o|3|1il|1im|8b","🏋🏿‍♂","o|3|1io|1im|8b","🏋️‍♀️","woman lifting weights","o|3|1iq|1ir|8b","🏋‍♀️","o|3|1it|1ir|8b","🏋️‍♀","o|3|1iv|1ir|8b","🏋‍♀","o|3|1ix|1ir|8b","🏋🏻‍♀️","woman lifting weights: light skin tone","o|3|1iz|1j0|8b","🏋🏻‍♀","o|3|1j2|1j0|8b","🏋🏼‍♀️","woman lifting weights: medium-light skin tone","o|3|1j4|1j5|8b","🏋🏼‍♀","o|3|1j7|1j5|8b","🏋🏽‍♀️","woman lifting weights: medium skin tone","o|3|1j9|1jA|8b","🏋🏽‍♀","o|3|1jC|1jA|8b","🏋🏾‍♀️","woman lifting weights: medium-dark skin tone","o|3|1jE|1jF|8b","🏋🏾‍♀","o|3|1jH|1jF|8b","🏋🏿‍♀️","woman lifting weights: dark skin tone","o|3|1jJ|1jK|8b","🏋🏿‍♀","o|3|1jM|1jK|8b","🚴","person biking","o|3|1jO|1jP|8b","🚴🏻","person biking: light skin tone","o|3|1jR|1jS|8b","🚴🏼","person biking: medium-light skin tone","o|3|1jU|1jV|8b","🚴🏽","person biking: medium skin tone","o|3|1jX|1jY|8b","🚴🏾","person biking: medium-dark skin tone","o|3|1ja|1jb|8b","🚴🏿","person biking: dark skin tone","o|3|1jd|1je|8b","🚴‍♂️","man biking","o|3|1jg|1jh|8b","🚴‍♂","o|3|1jj|1jh|8b","🚴🏻‍♂️","man biking: light skin tone","o|3|1jl|1jm|8b","🚴🏻‍♂","o|3|1jo|1jm|8b","🚴🏼‍♂️","man biking: medium-light skin tone","o|3|1jq|1jr|8b","🚴🏼‍♂","o|3|1jt|1jr|8b","🚴🏽‍♂️","man biking: medium skin tone","o|3|1jv|1jw|8b","🚴🏽‍♂","o|3|1jy|1jw|8b","🚴🏾‍♂️","man biking: medium-dark skin tone","o|3|1k0|1k1|8b","🚴🏾‍♂","o|3|1k3|1k1|8b","🚴🏿‍♂️","man biking: dark skin tone","o|3|1k5|1k6|8b","🚴🏿‍♂","o|3|1k8|1k6|8b","🚴‍♀️","woman biking","o|3|1kA|1kB|8b","🚴‍♀","o|3|1kD|1kB|8b","🚴🏻‍♀️","woman biking: light skin tone","o|3|1kF|1kG|8b","🚴🏻‍♀","o|3|1kI|1kG|8b","🚴🏼‍♀️","woman biking: medium-light skin tone","o|3|1kK|1kL|8b","🚴🏼‍♀","o|3|1kN|1kL|8b","🚴🏽‍♀️","woman biking: medium skin tone","o|3|1kP|1kQ|8b","🚴🏽‍♀","o|3|1kS|1kQ|8b","🚴🏾‍♀️","woman biking: medium-dark skin tone","o|3|1kU|1kV|8b","🚴🏾‍♀","o|3|1kX|1kV|8b","🚴🏿‍♀️","woman biking: dark skin tone","o|3|1kZ|1ka|8b","🚴🏿‍♀","o|3|1kc|1ka|8b","🚵","person mountain biking","o|3|1ke|1kf|8b","🚵🏻","person mountain biking: light skin tone","o|3|1kh|1ki|8b","🚵🏼","person mountain biking: medium-light skin tone","o|3|1kk|1kl|8b","🚵🏽","person mountain biking: medium skin tone","o|3|1kn|1ko|8b","🚵🏾","person mountain biking: medium-dark skin tone","o|3|1kq|1kr|8b","🚵🏿","person mountain biking: dark skin tone","o|3|1kt|1ku|8b","🚵‍♂️","man mountain biking","o|3|1kw|1kx|8b","🚵‍♂","o|3|1kz|1kx|8b","🚵🏻‍♂️","man mountain biking: light skin tone","o|3|1l1|1l2|8b","🚵🏻‍♂","o|3|1l4|1l2|8b","🚵🏼‍♂️","man mountain biking: medium-light skin tone","o|3|1l6|1l7|8b","🚵🏼‍♂","o|3|1l9|1l7|8b","🚵🏽‍♂️","man mountain biking: medium skin tone","o|3|1lB|1lC|8b","🚵🏽‍♂","o|3|1lE|1lC|8b","🚵🏾‍♂️","man mountain biking: medium-dark skin tone","o|3|1lG|1lH|8b","🚵🏾‍♂","o|3|1lJ|1lH|8b","🚵🏿‍♂️","man mountain biking: dark skin tone","o|3|1lL|1lM|8b","🚵🏿‍♂","o|3|1lO|1lM|8b","🚵‍♀️","woman mountain biking","o|3|1lQ|1lR|8b","🚵‍♀","o|3|1lT|1lR|8b","🚵🏻‍♀️","woman mountain biking: light skin tone","o|3|1lV|1lW|8b","🚵🏻‍♀","o|3|1lY|1lW|8b","🚵🏼‍♀️","woman mountain biking: medium-light skin tone","o|3|1la|1lb|8b","🚵🏼‍♀","o|3|1ld|1lb|8b","🚵🏽‍♀️","woman mountain biking: medium skin tone","o|3|1lf|1lg|8b","🚵🏽‍♀","o|3|1li|1lg|8b","🚵🏾‍♀️","woman mountain biking: medium-dark skin tone","o|3|1lk|1ll|8b","🚵🏾‍♀","o|3|1ln|1ll|8b","🚵🏿‍♀️","woman mountain biking: dark skin tone","o|3|1lp|1lq|8b","🚵🏿‍♀","o|3|1ls|1lq|8b","🤸","person cartwheeling","o|3|1lu|1lv|8b","🤸🏻","person cartwheeling: light skin tone","o|3|1lx|1ly|8b","🤸🏼","person cartwheeling: medium-light skin tone","o|3|1m0|1m1|8b","🤸🏽","person cartwheeling: medium skin tone","o|3|1m3|1m4|8b","🤸🏾","person cartwheeling: medium-dark skin tone","o|3|1m6|1m7|8b","🤸🏿","person cartwheeling: dark skin tone","o|3|1m9|1mA|8b","🤸‍♂️","man cartwheeling","o|3|1mC|1mD|8b","🤸‍♂","o|3|1mF|1mD|8b","🤸🏻‍♂️","man cartwheeling: light skin tone","o|3|1mH|1mI|8b","🤸🏻‍♂","o|3|1mK|1mI|8b","🤸🏼‍♂️","man cartwheeling: medium-light skin tone","o|3|1mM|1mN|8b","🤸🏼‍♂","o|3|1mP|1mN|8b","🤸🏽‍♂️","man cartwheeling: medium skin tone","o|3|1mR|1mS|8b","🤸🏽‍♂","o|3|1mU|1mS|8b","🤸🏾‍♂️","man cartwheeling: medium-dark skin tone","o|3|1mW|1mX|8b","🤸🏾‍♂","o|3|1mZ|1mX|8b","🤸🏿‍♂️","man cartwheeling: dark skin tone","o|3|1mb|1mc|8b","🤸🏿‍♂","o|3|1me|1mc|8b","🤸‍♀️","woman cartwheeling","o|3|1mg|1mh|8b","🤸‍♀","o|3|1mj|1mh|8b","🤸🏻‍♀️","woman cartwheeling: light skin tone","o|3|1ml|1mm|8b","🤸🏻‍♀","o|3|1mo|1mm|8b","🤸🏼‍♀️","woman cartwheeling: medium-light skin tone","o|3|1mq|1mr|8b","🤸🏼‍♀","o|3|1mt|1mr|8b","🤸🏽‍♀️","woman cartwheeling: medium skin tone","o|3|1mv|1mw|8b","🤸🏽‍♀","o|3|1my|1mw|8b","🤸🏾‍♀️","woman cartwheeling: medium-dark skin tone","o|3|1n0|1n1|8b","🤸🏾‍♀","o|3|1n3|1n1|8b","🤸🏿‍♀️","woman cartwheeling: dark skin tone","o|3|1n5|1n6|8b","🤸🏿‍♀","o|3|1n8|1n6|8b","🤼","people wrestling","o|3|1nA|1nB|8b","🤼‍♂️","men wrestling","o|3|1nD|1nE|8b","🤼‍♂","o|3|1nG|1nE|8b","🤼‍♀️","women wrestling","o|3|1nI|1nJ|8b","🤼‍♀","o|3|1nL|1nJ|8b","🤽","person playing water polo","o|3|1nN|1nO|8b","🤽🏻","person playing water polo: light skin tone","o|3|1nQ|1nR|8b","🤽🏼","person playing water polo: medium-light skin tone","o|3|1nT|1nU|8b","🤽🏽","person playing water polo: medium skin tone","o|3|1nW|1nX|8b","🤽🏾","person playing water polo: medium-dark skin tone","o|3|1nZ|1na|8b","🤽🏿","person playing water polo: dark skin tone","o|3|1nc|1nd|8b","🤽‍♂️","man playing water polo","o|3|1nf|1ng|8b","🤽‍♂","o|3|1ni|1ng|8b","🤽🏻‍♂️","man playing water polo: light skin tone","o|3|1nk|1nl|8b","🤽🏻‍♂","o|3|1nn|1nl|8b","🤽🏼‍♂️","man playing water polo: medium-light skin tone","o|3|1np|1nq|8b","🤽🏼‍♂","o|3|1ns|1nq|8b","🤽🏽‍♂️","man playing water polo: medium skin tone","o|3|1nu|1nv|8b","🤽🏽‍♂","o|3|1nx|1nv|8b","🤽🏾‍♂️","man playing water polo: medium-dark skin tone","o|3|1nz|1o0|8b","🤽🏾‍♂","o|3|1o2|1o0|8b","🤽🏿‍♂️","man playing water polo: dark skin tone","o|3|1o4|1o5|8b","🤽🏿‍♂","o|3|1o7|1o5|8b","🤽‍♀️","woman playing water polo","o|3|1o9|1oA|8b","🤽‍♀","o|3|1oC|1oA|8b","🤽🏻‍♀️","woman playing water polo: light skin tone","o|3|1oE|1oF|8b","🤽🏻‍♀","o|3|1oH|1oF|8b","🤽🏼‍♀️","woman playing water polo: medium-light skin tone","o|3|1oJ|1oK|8b","🤽🏼‍♀","o|3|1oM|1oK|8b","🤽🏽‍♀️","woman playing water polo: medium skin tone","o|3|1oO|1oP|8b","🤽🏽‍♀","o|3|1oR|1oP|8b","🤽🏾‍♀️","woman playing water polo: medium-dark skin tone","o|3|1oT|1oU|8b","🤽🏾‍♀","o|3|1oW|1oU|8b","🤽🏿‍♀️","woman playing water polo: dark skin tone","o|3|1oY|1oZ|8b","🤽🏿‍♀","o|3|1ob|1oZ|8b","🤾","person playing handball","o|3|1od|1oe|8b","🤾🏻","person playing handball: light skin tone","o|3|1og|1oh|8b","🤾🏼","person playing handball: medium-light skin tone","o|3|1oj|1ok|8b","🤾🏽","person playing handball: medium skin tone","o|3|1om|1on|8b","🤾🏾","person playing handball: medium-dark skin tone","o|3|1op|1oq|8b","🤾🏿","person playing handball: dark skin tone","o|3|1os|1ot|8b","🤾‍♂️","man playing handball","o|3|1ov|1ow|8b","🤾‍♂","o|3|1oy|1ow|8b","🤾🏻‍♂️","man playing handball: light skin tone","o|3|1p0|1p1|8b","🤾🏻‍♂","o|3|1p3|1p1|8b","🤾🏼‍♂️","man playing handball: medium-light skin tone","o|3|1p5|1p6|8b","🤾🏼‍♂","o|3|1p8|1p6|8b","🤾🏽‍♂️","man playing handball: medium skin tone","o|3|1pA|1pB|8b","🤾🏽‍♂","o|3|1pD|1pB|8b","🤾🏾‍♂️","man playing handball: medium-dark skin tone","o|3|1pF|1pG|8b","🤾🏾‍♂","o|3|1pI|1pG|8b","🤾🏿‍♂️","man playing handball: dark skin tone","o|3|1pK|1pL|8b","🤾🏿‍♂","o|3|1pN|1pL|8b","🤾‍♀️","woman playing handball","o|3|1pP|1pQ|8b","🤾‍♀","o|3|1pS|1pQ|8b","🤾🏻‍♀️","woman playing handball: light skin tone","o|3|1pU|1pV|8b","🤾🏻‍♀","o|3|1pX|1pV|8b","🤾🏼‍♀️","woman playing handball: medium-light skin tone","o|3|1pZ|1pa|8b","🤾🏼‍♀","o|3|1pc|1pa|8b","🤾🏽‍♀️","woman playing handball: medium skin tone","o|3|1pe|1pf|8b","🤾🏽‍♀","o|3|1ph|1pf|8b","🤾🏾‍♀️","woman playing handball: medium-dark skin tone","o|3|1pj|1pk|8b","🤾🏾‍♀","o|3|1pm|1pk|8b","🤾🏿‍♀️","woman playing handball: dark skin tone","o|3|1po|1pp|8b","🤾🏿‍♀","o|3|1pr|1pp|8b","🤹","person juggling","o|3|1pt|1pu|8b","🤹🏻","person juggling: light skin tone","o|3|1pw|1px|8b","🤹🏼","person juggling: medium-light skin tone","o|3|1pz|1q0|8b","🤹🏽","person juggling: medium skin tone","o|3|1q2|1q3|8b","🤹🏾","person juggling: medium-dark skin tone","o|3|1q5|1q6|8b","🤹🏿","person juggling: dark skin tone","o|3|1q8|1q9|8b","🤹‍♂️","man juggling","o|3|1qB|1qC|8b","🤹‍♂","o|3|1qE|1qC|8b","🤹🏻‍♂️","man juggling: light skin tone","o|3|1qG|1qH|8b","🤹🏻‍♂","o|3|1qJ|1qH|8b","🤹🏼‍♂️","man juggling: medium-light skin tone","o|3|1qL|1qM|8b","🤹🏼‍♂","o|3|1qO|1qM|8b","🤹🏽‍♂️","man juggling: medium skin tone","o|3|1qQ|1qR|8b","🤹🏽‍♂","o|3|1qT|1qR|8b","🤹🏾‍♂️","man juggling: medium-dark skin tone","o|3|1qV|1qW|8b","🤹🏾‍♂","o|3|1qY|1qW|8b","🤹🏿‍♂️","man juggling: dark skin tone","o|3|1qa|1qb|8b","🤹🏿‍♂","o|3|1qd|1qb|8b","🤹‍♀️","woman juggling","o|3|1qf|1qg|8b","🤹‍♀","o|3|1qi|1qg|8b","🤹🏻‍♀️","woman juggling: light skin tone","o|3|1qk|1ql|8b","🤹🏻‍♀","o|3|1qn|1ql|8b","🤹🏼‍♀️","woman juggling: medium-light skin tone","o|3|1qp|1qq|8b","🤹🏼‍♀","o|3|1qs|1qq|8b","🤹🏽‍♀️","woman juggling: medium skin tone","o|3|1qu|1qv|8b","🤹🏽‍♀","o|3|1qx|1qv|8b","🤹🏾‍♀️","woman juggling: medium-dark skin tone","o|3|1qz|1r0|8b","🤹🏾‍♀","o|3|1r2|1r0|8b","🤹🏿‍♀️","woman juggling: dark skin tone","o|3|1r4|1r5|8b","🤹🏿‍♀","o|3|1r7|1r5|8b","🧘","person in lotus position","o|3|1r9|1rA|8b","🧘🏻","person in lotus position: light skin tone","o|3|1rC|1rD|8b","🧘🏼","person in lotus position: medium-light skin tone","o|3|1rF|1rG|8b","🧘🏽","person in lotus position: medium skin tone","o|3|1rI|1rJ|8b","🧘🏾","person in lotus position: medium-dark skin tone","o|3|1rL|1rM|8b","🧘🏿","person in lotus position: dark skin tone","o|3|1rO|1rP|8b","🧘‍♂️","man in lotus position","o|3|1rR|1rS|8b","🧘‍♂","o|3|1rU|1rS|8b","🧘🏻‍♂️","man in lotus position: light skin tone","o|3|1rW|1rX|8b","🧘🏻‍♂","o|3|1rZ|1rX|8b","🧘🏼‍♂️","man in lotus position: medium-light skin tone","o|3|1rb|1rc|8b","🧘🏼‍♂","o|3|1re|1rc|8b","🧘🏽‍♂️","man in lotus position: medium skin tone","o|3|1rg|1rh|8b","🧘🏽‍♂","o|3|1rj|1rh|8b","🧘🏾‍♂️","man in lotus position: medium-dark skin tone","o|3|1rl|1rm|8b","🧘🏾‍♂","o|3|1ro|1rm|8b","🧘🏿‍♂️","man in lotus position: dark skin tone","o|3|1rq|1rr|8b","🧘🏿‍♂","o|3|1rt|1rr|8b","🧘‍♀️","woman in lotus position","o|3|1rv|1rw|8b","🧘‍♀","o|3|1ry|1rw|8b","🧘🏻‍♀️","woman in lotus position: light skin tone","o|3|1s0|1s1|8b","🧘🏻‍♀","o|3|1s3|1s1|8b","🧘🏼‍♀️","woman in lotus position: medium-light skin tone","o|3|1s5|1s6|8b","🧘🏼‍♀","o|3|1s8|1s6|8b","🧘🏽‍♀️","woman in lotus position: medium skin tone","o|3|1sA|1sB|8b","🧘🏽‍♀","o|3|1sD|1sB|8b","🧘🏾‍♀️","woman in lotus position: medium-dark skin tone","o|3|1sF|1sG|8b","🧘🏾‍♀","o|3|1sI|1sG|8b","🧘🏿‍♀️","woman in lotus position: dark skin tone","o|3|1sK|1sL|8b","🧘🏿‍♀","o|3|1sN|1sL|8b","🛀","person taking bath","o|3|1sP|1sQ|8b","🛀🏻","person taking bath: light skin tone","o|3|1sS|1sT|8b","🛀🏼","person taking bath: medium-light skin tone","o|3|1sV|1sW|8b","🛀🏽","person taking bath: medium skin tone","o|3|1sY|1sZ|8b","🛀🏾","person taking bath: medium-dark skin tone","o|3|1sb|1sc|8b","🛀🏿","person taking bath: dark skin tone","o|3|1se|1sf|8b","🛌","person in bed","o|3|1sh|1si|8b","🛌🏻","person in bed: light skin tone","o|3|1sk|1sl|8b","🛌🏼","person in bed: medium-light skin tone","o|3|1sn|1so|8b","🛌🏽","person in bed: medium skin tone","o|3|1sq|1sr|8b","🛌🏾","person in bed: medium-dark skin tone","o|3|1st|1su|8b","🛌🏿","person in bed: dark skin tone","o|3|1sw|1sx|8b","🧑‍🤝‍🧑","people holding hands","o|3|1sz|1t0|8b","🧑🏻‍🤝‍🧑🏻","people holding hands: light skin tone","o|3|1t2|1t3|8b","🧑🏻‍🤝‍🧑🏼","people holding hands: light skin tone, medium-light skin tone","o|3|1t5|1t6|8b","🧑🏻‍🤝‍🧑🏽","people holding hands: light skin tone, medium skin tone","o|3|1t8|1t9|8b","🧑🏻‍🤝‍🧑🏾","people holding hands: light skin tone, medium-dark skin tone","o|3|1tB|1tC|8b","🧑🏻‍🤝‍🧑🏿","people holding hands: light skin tone, dark skin tone","o|3|1tE|1tF|8b","🧑🏼‍🤝‍🧑🏻","people holding hands: medium-light skin tone, light skin tone","o|3|1tH|1tI|8b","🧑🏼‍🤝‍🧑🏼","people holding hands: medium-light skin tone","o|3|1tK|1tL|8b","🧑🏼‍🤝‍🧑🏽","people holding hands: medium-light skin tone, medium skin tone","o|3|1tN|1tO|8b","🧑🏼‍🤝‍🧑🏾","people holding hands: medium-light skin tone, medium-dark skin tone","o|3|1tQ|1tR|8b","🧑🏼‍🤝‍🧑🏿","people holding hands: medium-light skin tone, dark skin tone","o|3|1tT|1tU|8b","🧑🏽‍🤝‍🧑🏻","people holding hands: medium skin tone, light skin tone","o|3|1tW|1tX|8b","🧑🏽‍🤝‍🧑🏼","people holding hands: medium skin tone, medium-light skin tone","o|3|1tZ|1ta|8b","🧑🏽‍🤝‍🧑🏽","people holding hands: medium skin tone","o|3|1tc|1td|8b","🧑🏽‍🤝‍🧑🏾","people holding hands: medium skin tone, medium-dark skin tone","o|3|1tf|1tg|8b","🧑🏽‍🤝‍🧑🏿","people holding hands: medium skin tone, dark skin tone","o|3|1ti|1tj|8b","🧑🏾‍🤝‍🧑🏻","people holding hands: medium-dark skin tone, light skin tone","o|3|1tl|1tm|8b","🧑🏾‍🤝‍🧑🏼","people holding hands: medium-dark skin tone, medium-light skin tone","o|3|1to|1tp|8b","🧑🏾‍🤝‍🧑🏽","people holding hands: medium-dark skin tone, medium skin tone","o|3|1tr|1ts|8b","🧑🏾‍🤝‍🧑🏾","people holding hands: medium-dark skin tone","o|3|1tu|1tv|8b","🧑🏾‍🤝‍🧑🏿","people holding hands: medium-dark skin tone, dark skin tone","o|3|1tx|1ty|8b","🧑🏿‍🤝‍🧑🏻","people holding hands: dark skin tone, light skin tone","o|3|1u0|1u1|8b","🧑🏿‍🤝‍🧑🏼","people holding hands: dark skin tone, medium-light skin tone","o|3|1u3|1u4|8b","🧑🏿‍🤝‍🧑🏽","people holding hands: dark skin tone, medium skin tone","o|3|1u6|1u7|8b","🧑🏿‍🤝‍🧑🏾","people holding hands: dark skin tone, medium-dark skin tone","o|3|1u9|1uA|8b","🧑🏿‍🤝‍🧑🏿","people holding hands: dark skin tone","o|3|1uC|1uD|8b","👭","women holding hands","o|3|1uF|1uG|8b","👭🏻","women holding hands: light skin tone","o|3|1uI|1uJ|8b","👩🏻‍🤝‍👩🏼","women holding hands: light skin tone, medium-light skin tone","o|3|1uL|1uM|8b","👩🏻‍🤝‍👩🏽","women holding hands: light skin tone, medium skin tone","o|3|1uO|1uP|8b","👩🏻‍🤝‍👩🏾","women holding hands: light skin tone, medium-dark skin tone","o|3|1uR|1uS|8b","👩🏻‍🤝‍👩🏿","women holding hands: light skin tone, dark skin tone","o|3|1uU|1uV|8b","👩🏼‍🤝‍👩🏻","women holding hands: medium-light skin tone, light skin tone","o|3|1uX|1uY|8b","👭🏼","women holding hands: medium-light skin tone","o|3|1ua|1ub|8b","👩🏼‍🤝‍👩🏽","women holding hands: medium-light skin tone, medium skin tone","o|3|1ud|1ue|8b","👩🏼‍🤝‍👩🏾","women holding hands: medium-light skin tone, medium-dark skin tone","o|3|1ug|1uh|8b","👩🏼‍🤝‍👩🏿","women holding hands: medium-light skin tone, dark skin tone","o|3|1uj|1uk|8b","👩🏽‍🤝‍👩🏻","women holding hands: medium skin tone, light skin tone","o|3|1um|1un|8b","👩🏽‍🤝‍👩🏼","women holding hands: medium skin tone, medium-light skin tone","o|3|1up|1uq|8b","👭🏽","women holding hands: medium skin tone","o|3|1us|1ut|8b","👩🏽‍🤝‍👩🏾","women holding hands: medium skin tone, medium-dark skin tone","o|3|1uv|1uw|8b","👩🏽‍🤝‍👩🏿","women holding hands: medium skin tone, dark skin tone","o|3|1uy|1uz|8b","👩🏾‍🤝‍👩🏻","women holding hands: medium-dark skin tone, light skin tone","o|3|1v1|1v2|8b","👩🏾‍🤝‍👩🏼","women holding hands: medium-dark skin tone, medium-light skin tone","o|3|1v4|1v5|8b","👩🏾‍🤝‍👩🏽","women holding hands: medium-dark skin tone, medium skin tone","o|3|1v7|1v8|8b","👭🏾","women holding hands: medium-dark skin tone","o|3|1vA|1vB|8b","👩🏾‍🤝‍👩🏿","women holding hands: medium-dark skin tone, dark skin tone","o|3|1vD|1vE|8b","👩🏿‍🤝‍👩🏻","women holding hands: dark skin tone, light skin tone","o|3|1vG|1vH|8b","👩🏿‍🤝‍👩🏼","women holding hands: dark skin tone, medium-light skin tone","o|3|1vJ|1vK|8b","👩🏿‍🤝‍👩🏽","women holding hands: dark skin tone, medium skin tone","o|3|1vM|1vN|8b","👩🏿‍🤝‍👩🏾","women holding hands: dark skin tone, medium-dark skin tone","o|3|1vP|1vQ|8b","👭🏿","women holding hands: dark skin tone","o|3|1vS|1vT|8b","👫","woman and man holding hands","o|3|1vV|1vW|8b","👫🏻","woman and man holding hands: light skin tone","o|3|1vY|1vZ|8b","👩🏻‍🤝‍👨🏼","woman and man holding hands: light skin tone, medium-light skin tone","o|3|1vb|1vc|8b","👩🏻‍🤝‍👨🏽","woman and man holding hands: light skin tone, medium skin tone","o|3|1ve|1vf|8b","👩🏻‍🤝‍👨🏾","woman and man holding hands: light skin tone, medium-dark skin tone","o|3|1vh|1vi|8b","👩🏻‍🤝‍👨🏿","woman and man holding hands: light skin tone, dark skin tone","o|3|1vk|1vl|8b","👩🏼‍🤝‍👨🏻","woman and man holding hands: medium-light skin tone, light skin tone","o|3|1vn|1vo|8b","👫🏼","woman and man holding hands: medium-light skin tone","o|3|1vq|1vr|8b","👩🏼‍🤝‍👨🏽","woman and man holding hands: medium-light skin tone, medium skin tone","o|3|1vt|1vu|8b","👩🏼‍🤝‍👨🏾","woman and man holding hands: medium-light skin tone, medium-dark skin tone","o|3|1vw|1vx|8b","👩🏼‍🤝‍👨🏿","woman and man holding hands: medium-light skin tone, dark skin tone","o|3|1vz|1w0|8b","👩🏽‍🤝‍👨🏻","woman and man holding hands: medium skin tone, light skin tone","o|3|1w2|1w3|8b","👩🏽‍🤝‍👨🏼","woman and man holding hands: medium skin tone, medium-light skin tone","o|3|1w5|1w6|8b","👫🏽","woman and man holding hands: medium skin tone","o|3|1w8|1w9|8b","👩🏽‍🤝‍👨🏾","woman and man holding hands: medium skin tone, medium-dark skin tone","o|3|1wB|1wC|8b","👩🏽‍🤝‍👨🏿","woman and man holding hands: medium skin tone, dark skin tone","o|3|1wE|1wF|8b","👩🏾‍🤝‍👨🏻","woman and man holding hands: medium-dark skin tone, light skin tone","o|3|1wH|1wI|8b","👩🏾‍🤝‍👨🏼","woman and man holding hands: medium-dark skin tone, medium-light skin tone","o|3|1wK|1wL|8b","👩🏾‍🤝‍👨🏽","woman and man holding hands: medium-dark skin tone, medium skin tone","o|3|1wN|1wO|8b","👫🏾","woman and man holding hands: medium-dark skin tone","o|3|1wQ|1wR|8b","👩🏾‍🤝‍👨🏿","woman and man holding hands: medium-dark skin tone, dark skin tone","o|3|1wT|1wU|8b","👩🏿‍🤝‍👨🏻","woman and man holding hands: dark skin tone, light skin tone","o|3|1wW|1wX|8b","👩🏿‍🤝‍👨🏼","woman and man holding hands: dark skin tone, medium-light skin tone","o|3|1wZ|1wa|8b","👩🏿‍🤝‍👨🏽","woman and man holding hands: dark skin tone, medium skin tone","o|3|1wc|1wd|8b","👩🏿‍🤝‍👨🏾","woman and man holding hands: dark skin tone, medium-dark skin tone","o|3|1wf|1wg|8b","👫🏿","woman and man holding hands: dark skin tone","o|3|1wi|1wj|8b","👬","men holding hands","o|3|1wl|1wm|8b","👬🏻","men holding hands: light skin tone","o|3|1wo|1wp|8b","👨🏻‍🤝‍👨🏼","men holding hands: light skin tone, medium-light skin tone","o|3|1wr|1ws|8b","👨🏻‍🤝‍👨🏽","men holding hands: light skin tone, medium skin tone","o|3|1wu|1wv|8b","👨🏻‍🤝‍👨🏾","men holding hands: light skin tone, medium-dark skin tone","o|3|1wx|1wy|8b","👨🏻‍🤝‍👨🏿","men holding hands: light skin tone, dark skin tone","o|3|1x0|1x1|8b","👨🏼‍🤝‍👨🏻","men holding hands: medium-light skin tone, light skin tone","o|3|1x3|1x4|8b","👬🏼","men holding hands: medium-light skin tone","o|3|1x6|1x7|8b","👨🏼‍🤝‍👨🏽","men holding hands: medium-light skin tone, medium skin tone","o|3|1x9|1xA|8b","👨🏼‍🤝‍👨🏾","men holding hands: medium-light skin tone, medium-dark skin tone","o|3|1xC|1xD|8b","👨🏼‍🤝‍👨🏿","men holding hands: medium-light skin tone, dark skin tone","o|3|1xF|1xG|8b","👨🏽‍🤝‍👨🏻","men holding hands: medium skin tone, light skin tone","o|3|1xI|1xJ|8b","👨🏽‍🤝‍👨🏼","men holding hands: medium skin tone, medium-light skin tone","o|3|1xL|1xM|8b","👬🏽","men holding hands: medium skin tone","o|3|1xO|1xP|8b","👨🏽‍🤝‍👨🏾","men holding hands: medium skin tone, medium-dark skin tone","o|3|1xR|1xS|8b","👨🏽‍🤝‍👨🏿","men holding hands: medium skin tone, dark skin tone","o|3|1xU|1xV|8b","👨🏾‍🤝‍👨🏻","men holding hands: medium-dark skin tone, light skin tone","o|3|1xX|1xY|8b","👨🏾‍🤝‍👨🏼","men holding hands: medium-dark skin tone, medium-light skin tone","o|3|1xa|1xb|8b","👨🏾‍🤝‍👨🏽","men holding hands: medium-dark skin tone, medium skin tone","o|3|1xd|1xe|8b","👬🏾","men holding hands: medium-dark skin tone","o|3|1xg|1xh|8b","👨🏾‍🤝‍👨🏿","men holding hands: medium-dark skin tone, dark skin tone","o|3|1xj|1xk|8b","👨🏿‍🤝‍👨🏻","men holding hands: dark skin tone, light skin tone","o|3|1xm|1xn|8b","👨🏿‍🤝‍👨🏼","men holding hands: dark skin tone, medium-light skin tone","o|3|1xp|1xq|8b","👨🏿‍🤝‍👨🏽","men holding hands: dark skin tone, medium skin tone","o|3|1xs|1xt|8b","👨🏿‍🤝‍👨🏾","men holding hands: dark skin tone, medium-dark skin tone","o|3|1xv|1xw|8b","👬🏿","men holding hands: dark skin tone","o|3|1xy|1xz|8b","💏","kiss","o|3|1y1|1y2|8b","💏🏻","kiss: light skin tone","o|3|1y4|1y5|8b","💏🏼","kiss: medium-light skin tone","o|3|1y7|1y8|8b","💏🏽","kiss: medium skin tone","o|3|1yA|1yB|8b","💏🏾","kiss: medium-dark skin tone","o|3|1yD|1yE|8b","💏🏿","kiss: dark skin tone","o|3|1yG|1yH|8b","🧑🏻‍❤️‍💋‍🧑🏼","kiss: person, person, light skin tone, medium-light skin tone","o|3|1yJ|1yK|8b","🧑🏻‍❤‍💋‍🧑🏼","o|3|1yM|1yK|8b","🧑🏻‍❤️‍💋‍🧑🏽","kiss: person, person, light skin tone, medium skin tone","o|3|1yO|1yP|8b","🧑🏻‍❤‍💋‍🧑🏽","o|3|1yR|1yP|8b","🧑🏻‍❤️‍💋‍🧑🏾","kiss: person, person, light skin tone, medium-dark skin tone","o|3|1yT|1yU|8b","🧑🏻‍❤‍💋‍🧑🏾","o|3|1yW|1yU|8b","🧑🏻‍❤️‍💋‍🧑🏿","kiss: person, person, light skin tone, dark skin tone","o|3|1yY|1yZ|8b","🧑🏻‍❤‍💋‍🧑🏿","o|3|1yb|1yZ|8b","🧑🏼‍❤️‍💋‍🧑🏻","kiss: person, person, medium-light skin tone, light skin tone","o|3|1yd|1ye|8b","🧑🏼‍❤‍💋‍🧑🏻","o|3|1yg|1ye|8b","🧑🏼‍❤️‍💋‍🧑🏽","kiss: person, person, medium-light skin tone, medium skin tone","o|3|1yi|1yj|8b","🧑🏼‍❤‍💋‍🧑🏽","o|3|1yl|1yj|8b","🧑🏼‍❤️‍💋‍🧑🏾","kiss: person, person, medium-light skin tone, medium-dark skin tone","o|3|1yn|1yo|8b","🧑🏼‍❤‍💋‍🧑🏾","o|3|1yq|1yo|8b","🧑🏼‍❤️‍💋‍🧑🏿","kiss: person, person, medium-light skin tone, dark skin tone","o|3|1ys|1yt|8b","🧑🏼‍❤‍💋‍🧑🏿","o|3|1yv|1yt|8b","🧑🏽‍❤️‍💋‍🧑🏻","kiss: person, person, medium skin tone, light skin tone","o|3|1yx|1yy|8b","🧑🏽‍❤‍💋‍🧑🏻","o|3|1z0|1yy|8b","🧑🏽‍❤️‍💋‍🧑🏼","kiss: person, person, medium skin tone, medium-light skin tone","o|3|1z2|1z3|8b","🧑🏽‍❤‍💋‍🧑🏼","o|3|1z5|1z3|8b","🧑🏽‍❤️‍💋‍🧑🏾","kiss: person, person, medium skin tone, medium-dark skin tone","o|3|1z7|1z8|8b","🧑🏽‍❤‍💋‍🧑🏾","o|3|1zA|1z8|8b","🧑🏽‍❤️‍💋‍🧑🏿","kiss: person, person, medium skin tone, dark skin tone","o|3|1zC|1zD|8b","🧑🏽‍❤‍💋‍🧑🏿","o|3|1zF|1zD|8b","🧑🏾‍❤️‍💋‍🧑🏻","kiss: person, person, medium-dark skin tone, light skin tone","o|3|1zH|1zI|8b","🧑🏾‍❤‍💋‍🧑🏻","o|3|1zK|1zI|8b","🧑🏾‍❤️‍💋‍🧑🏼","kiss: person, person, medium-dark skin tone, medium-light skin tone","o|3|1zM|1zN|8b","🧑🏾‍❤‍💋‍🧑🏼","o|3|1zP|1zN|8b","🧑🏾‍❤️‍💋‍🧑🏽","kiss: person, person, medium-dark skin tone, medium skin tone","o|3|1zR|1zS|8b","🧑🏾‍❤‍💋‍🧑🏽","o|3|1zU|1zS|8b","🧑🏾‍❤️‍💋‍🧑🏿","kiss: person, person, medium-dark skin tone, dark skin tone","o|3|1zW|1zX|8b","🧑🏾‍❤‍💋‍🧑🏿","o|3|1zZ|1zX|8b","🧑🏿‍❤️‍💋‍🧑🏻","kiss: person, person, dark skin tone, light skin tone","o|3|1zb|1zc|8b","🧑🏿‍❤‍💋‍🧑🏻","o|3|1ze|1zc|8b","🧑🏿‍❤️‍💋‍🧑🏼","kiss: person, person, dark skin tone, medium-light skin tone","o|3|1zg|1zh|8b","🧑🏿‍❤‍💋‍🧑🏼","o|3|1zj|1zh|8b","🧑🏿‍❤️‍💋‍🧑🏽","kiss: person, person, dark skin tone, medium skin tone","o|3|1zl|1zm|8b","🧑🏿‍❤‍💋‍🧑🏽","o|3|1zo|1zm|8b","🧑🏿‍❤️‍💋‍🧑🏾","kiss: person, person, dark skin tone, medium-dark skin tone","o|3|1zq|1zr|8b","🧑🏿‍❤‍💋‍🧑🏾","o|3|1zt|1zr|8b","👩‍❤️‍💋‍👨","kiss: woman, man","o|3|1zv|1zw|8b","👩‍❤‍💋‍👨","o|3|1zy|1zw|8b","👩🏻‍❤️‍💋‍👨🏻","kiss: woman, man, light skin tone","o|3|200|201|8b","👩🏻‍❤‍💋‍👨🏻","o|3|203|201|8b","👩🏻‍❤️‍💋‍👨🏼","kiss: woman, man, light skin tone, medium-light skin tone","o|3|205|206|8b","👩🏻‍❤‍💋‍👨🏼","o|3|208|206|8b","👩🏻‍❤️‍💋‍👨🏽","kiss: woman, man, light skin tone, medium skin tone","o|3|20A|20B|8b","👩🏻‍❤‍💋‍👨🏽","o|3|20D|20B|8b","👩🏻‍❤️‍💋‍👨🏾","kiss: woman, man, light skin tone, medium-dark skin tone","o|3|20F|20G|8b","👩🏻‍❤‍💋‍👨🏾","o|3|20I|20G|8b","👩🏻‍❤️‍💋‍👨🏿","kiss: woman, man, light skin tone, dark skin tone","o|3|20K|20L|8b","👩🏻‍❤‍💋‍👨🏿","o|3|20N|20L|8b","👩🏼‍❤️‍💋‍👨🏻","kiss: woman, man, medium-light skin tone, light skin tone","o|3|20P|20Q|8b","👩🏼‍❤‍💋‍👨🏻","o|3|20S|20Q|8b","👩🏼‍❤️‍💋‍👨🏼","kiss: woman, man, medium-light skin tone","o|3|20U|20V|8b","👩🏼‍❤‍💋‍👨🏼","o|3|20X|20V|8b","👩🏼‍❤️‍💋‍👨🏽","kiss: woman, man, medium-light skin tone, medium skin tone","o|3|20Z|20a|8b","👩🏼‍❤‍💋‍👨🏽","o|3|20c|20a|8b","👩🏼‍❤️‍💋‍👨🏾","kiss: woman, man, medium-light skin tone, medium-dark skin tone","o|3|20e|20f|8b","👩🏼‍❤‍💋‍👨🏾","o|3|20h|20f|8b","👩🏼‍❤️‍💋‍👨🏿","kiss: woman, man, medium-light skin tone, dark skin tone","o|3|20j|20k|8b","👩🏼‍❤‍💋‍👨🏿","o|3|20m|20k|8b","👩🏽‍❤️‍💋‍👨🏻","kiss: woman, man, medium skin tone, light skin tone","o|3|20o|20p|8b","👩🏽‍❤‍💋‍👨🏻","o|3|20r|20p|8b","👩🏽‍❤️‍💋‍👨🏼","kiss: woman, man, medium skin tone, medium-light skin tone","o|3|20t|20u|8b","👩🏽‍❤‍💋‍👨🏼","o|3|20w|20u|8b","👩🏽‍❤️‍💋‍👨🏽","kiss: woman, man, medium skin tone","o|3|20y|20z|8b","👩🏽‍❤‍💋‍👨🏽","o|3|211|20z|8b","👩🏽‍❤️‍💋‍👨🏾","kiss: woman, man, medium skin tone, medium-dark skin tone","o|3|213|214|8b","👩🏽‍❤‍💋‍👨🏾","o|3|216|214|8b","👩🏽‍❤️‍💋‍👨🏿","kiss: woman, man, medium skin tone, dark skin tone","o|3|218|219|8b","👩🏽‍❤‍💋‍👨🏿","o|3|21B|219|8b","👩🏾‍❤️‍💋‍👨🏻","kiss: woman, man, medium-dark skin tone, light skin tone","o|3|21D|21E|8b","👩🏾‍❤‍💋‍👨🏻","o|3|21G|21E|8b","👩🏾‍❤️‍💋‍👨🏼","kiss: woman, man, medium-dark skin tone, medium-light skin tone","o|3|21I|21J|8b","👩🏾‍❤‍💋‍👨🏼","o|3|21L|21J|8b","👩🏾‍❤️‍💋‍👨🏽","kiss: woman, man, medium-dark skin tone, medium skin tone","o|3|21N|21O|8b","👩🏾‍❤‍💋‍👨🏽","o|3|21Q|21O|8b","👩🏾‍❤️‍💋‍👨🏾","kiss: woman, man, medium-dark skin tone","o|3|21S|21T|8b","👩🏾‍❤‍💋‍👨🏾","o|3|21V|21T|8b","👩🏾‍❤️‍💋‍👨🏿","kiss: woman, man, medium-dark skin tone, dark skin tone","o|3|21X|21Y|8b","👩🏾‍❤‍💋‍👨🏿","o|3|21a|21Y|8b","👩🏿‍❤️‍💋‍👨🏻","kiss: woman, man, dark skin tone, light skin tone","o|3|21c|21d|8b","👩🏿‍❤‍💋‍👨🏻","o|3|21f|21d|8b","👩🏿‍❤️‍💋‍👨🏼","kiss: woman, man, dark skin tone, medium-light skin tone","o|3|21h|21i|8b","👩🏿‍❤‍💋‍👨🏼","o|3|21k|21i|8b","👩🏿‍❤️‍💋‍👨🏽","kiss: woman, man, dark skin tone, medium skin tone","o|3|21m|21n|8b","👩🏿‍❤‍💋‍👨🏽","o|3|21p|21n|8b","👩🏿‍❤️‍💋‍👨🏾","kiss: woman, man, dark skin tone, medium-dark skin tone","o|3|21r|21s|8b","👩🏿‍❤‍💋‍👨🏾","o|3|21u|21s|8b","👩🏿‍❤️‍💋‍👨🏿","kiss: woman, man, dark skin tone","o|3|21w|21x|8b","👩🏿‍❤‍💋‍👨🏿","o|3|21z|21x|8b","👨‍❤️‍💋‍👨","kiss: man, man","o|3|221|222|8b","👨‍❤‍💋‍👨","o|3|224|222|8b","👨🏻‍❤️‍💋‍👨🏻","kiss: man, man, light skin tone","o|3|226|227|8b","👨🏻‍❤‍💋‍👨🏻","o|3|229|227|8b","👨🏻‍❤️‍💋‍👨🏼","kiss: man, man, light skin tone, medium-light skin tone","o|3|22B|22C|8b","👨🏻‍❤‍💋‍👨🏼","o|3|22E|22C|8b","👨🏻‍❤️‍💋‍👨🏽","kiss: man, man, light skin tone, medium skin tone","o|3|22G|22H|8b","👨🏻‍❤‍💋‍👨🏽","o|3|22J|22H|8b","👨🏻‍❤️‍💋‍👨🏾","kiss: man, man, light skin tone, medium-dark skin tone","o|3|22L|22M|8b","👨🏻‍❤‍💋‍👨🏾","o|3|22O|22M|8b","👨🏻‍❤️‍💋‍👨🏿","kiss: man, man, light skin tone, dark skin tone","o|3|22Q|22R|8b","👨🏻‍❤‍💋‍👨🏿","o|3|22T|22R|8b","👨🏼‍❤️‍💋‍👨🏻","kiss: man, man, medium-light skin tone, light skin tone","o|3|22V|22W|8b","👨🏼‍❤‍💋‍👨🏻","o|3|22Y|22W|8b","👨🏼‍❤️‍💋‍👨🏼","kiss: man, man, medium-light skin tone","o|3|22a|22b|8b","👨🏼‍❤‍💋‍👨🏼","o|3|22d|22b|8b","👨🏼‍❤️‍💋‍👨🏽","kiss: man, man, medium-light skin tone, medium skin tone","o|3|22f|22g|8b","👨🏼‍❤‍💋‍👨🏽","o|3|22i|22g|8b","👨🏼‍❤️‍💋‍👨🏾","kiss: man, man, medium-light skin tone, medium-dark skin tone","o|3|22k|22l|8b","👨🏼‍❤‍💋‍👨🏾","o|3|22n|22l|8b","👨🏼‍❤️‍💋‍👨🏿","kiss: man, man, medium-light skin tone, dark skin tone","o|3|22p|22q|8b","👨🏼‍❤‍💋‍👨🏿","o|3|22s|22q|8b","👨🏽‍❤️‍💋‍👨🏻","kiss: man, man, medium skin tone, light skin tone","o|3|22u|22v|8b","👨🏽‍❤‍💋‍👨🏻","o|3|22x|22v|8b","👨🏽‍❤️‍💋‍👨🏼","kiss: man, man, medium skin tone, medium-light skin tone","o|3|22z|230|8b","👨🏽‍❤‍💋‍👨🏼","o|3|232|230|8b","👨🏽‍❤️‍💋‍👨🏽","kiss: man, man, medium skin tone","o|3|234|235|8b","👨🏽‍❤‍💋‍👨🏽","o|3|237|235|8b","👨🏽‍❤️‍💋‍👨🏾","kiss: man, man, medium skin tone, medium-dark skin tone","o|3|239|23A|8b","👨🏽‍❤‍💋‍👨🏾","o|3|23C|23A|8b","👨🏽‍❤️‍💋‍👨🏿","kiss: man, man, medium skin tone, dark skin tone","o|3|23E|23F|8b","👨🏽‍❤‍💋‍👨🏿","o|3|23H|23F|8b","👨🏾‍❤️‍💋‍👨🏻","kiss: man, man, medium-dark skin tone, light skin tone","o|3|23J|23K|8b","👨🏾‍❤‍💋‍👨🏻","o|3|23M|23K|8b","👨🏾‍❤️‍💋‍👨🏼","kiss: man, man, medium-dark skin tone, medium-light skin tone","o|3|23O|23P|8b","👨🏾‍❤‍💋‍👨🏼","o|3|23R|23P|8b","👨🏾‍❤️‍💋‍👨🏽","kiss: man, man, medium-dark skin tone, medium skin tone","o|3|23T|23U|8b","👨🏾‍❤‍💋‍👨🏽","o|3|23W|23U|8b","👨🏾‍❤️‍💋‍👨🏾","kiss: man, man, medium-dark skin tone","o|3|23Y|23Z|8b","👨🏾‍❤‍💋‍👨🏾","o|3|23b|23Z|8b","👨🏾‍❤️‍💋‍👨🏿","kiss: man, man, medium-dark skin tone, dark skin tone","o|3|23d|23e|8b","👨🏾‍❤‍💋‍👨🏿","o|3|23g|23e|8b","👨🏿‍❤️‍💋‍👨🏻","kiss: man, man, dark skin tone, light skin tone","o|3|23i|23j|8b","👨🏿‍❤‍💋‍👨🏻","o|3|23l|23j|8b","👨🏿‍❤️‍💋‍👨🏼","kiss: man, man, dark skin tone, medium-light skin tone","o|3|23n|23o|8b","👨🏿‍❤‍💋‍👨🏼","o|3|23q|23o|8b","👨🏿‍❤️‍💋‍👨🏽","kiss: man, man, dark skin tone, medium skin tone","o|3|23s|23t|8b","👨🏿‍❤‍💋‍👨🏽","o|3|23v|23t|8b","👨🏿‍❤️‍💋‍👨🏾","kiss: man, man, dark skin tone, medium-dark skin tone","o|3|23x|23y|8b","👨🏿‍❤‍💋‍👨🏾","o|3|240|23y|8b","👨🏿‍❤️‍💋‍👨🏿","kiss: man, man, dark skin tone","o|3|242|243|8b","👨🏿‍❤‍💋‍👨🏿","o|3|245|243|8b","👩‍❤️‍💋‍👩","kiss: woman, woman","o|3|247|248|8b","👩‍❤‍💋‍👩","o|3|24A|248|8b","👩🏻‍❤️‍💋‍👩🏻","kiss: woman, woman, light skin tone","o|3|24C|24D|8b","👩🏻‍❤‍💋‍👩🏻","o|3|24F|24D|8b","👩🏻‍❤️‍💋‍👩🏼","kiss: woman, woman, light skin tone, medium-light skin tone","o|3|24H|24I|8b","👩🏻‍❤‍💋‍👩🏼","o|3|24K|24I|8b","👩🏻‍❤️‍💋‍👩🏽","kiss: woman, woman, light skin tone, medium skin tone","o|3|24M|24N|8b","👩🏻‍❤‍💋‍👩🏽","o|3|24P|24N|8b","👩🏻‍❤️‍💋‍👩🏾","kiss: woman, woman, light skin tone, medium-dark skin tone","o|3|24R|24S|8b","👩🏻‍❤‍💋‍👩🏾","o|3|24U|24S|8b","👩🏻‍❤️‍💋‍👩🏿","kiss: woman, woman, light skin tone, dark skin tone","o|3|24W|24X|8b","👩🏻‍❤‍💋‍👩🏿","o|3|24Z|24X|8b","👩🏼‍❤️‍💋‍👩🏻","kiss: woman, woman, medium-light skin tone, light skin tone","o|3|24b|24c|8b","👩🏼‍❤‍💋‍👩🏻","o|3|24e|24c|8b","👩🏼‍❤️‍💋‍👩🏼","kiss: woman, woman, medium-light skin tone","o|3|24g|24h|8b","👩🏼‍❤‍💋‍👩🏼","o|3|24j|24h|8b","👩🏼‍❤️‍💋‍👩🏽","kiss: woman, woman, medium-light skin tone, medium skin tone","o|3|24l|24m|8b","👩🏼‍❤‍💋‍👩🏽","o|3|24o|24m|8b","👩🏼‍❤️‍💋‍👩🏾","kiss: woman, woman, medium-light skin tone, medium-dark skin tone","o|3|24q|24r|8b","👩🏼‍❤‍💋‍👩🏾","o|3|24t|24r|8b","👩🏼‍❤️‍💋‍👩🏿","kiss: woman, woman, medium-light skin tone, dark skin tone","o|3|24v|24w|8b","👩🏼‍❤‍💋‍👩🏿","o|3|24y|24w|8b","👩🏽‍❤️‍💋‍👩🏻","kiss: woman, woman, medium skin tone, light skin tone","o|3|250|251|8b","👩🏽‍❤‍💋‍👩🏻","o|3|253|251|8b","👩🏽‍❤️‍💋‍👩🏼","kiss: woman, woman, medium skin tone, medium-light skin tone","o|3|255|256|8b","👩🏽‍❤‍💋‍👩🏼","o|3|258|256|8b","👩🏽‍❤️‍💋‍👩🏽","kiss: woman, woman, medium skin tone","o|3|25A|25B|8b","👩🏽‍❤‍💋‍👩🏽","o|3|25D|25B|8b","👩🏽‍❤️‍💋‍👩🏾","kiss: woman, woman, medium skin tone, medium-dark skin tone","o|3|25F|25G|8b","👩🏽‍❤‍💋‍👩🏾","o|3|25I|25G|8b","👩🏽‍❤️‍💋‍👩🏿","kiss: woman, woman, medium skin tone, dark skin tone","o|3|25K|25L|8b","👩🏽‍❤‍💋‍👩🏿","o|3|25N|25L|8b","👩🏾‍❤️‍💋‍👩🏻","kiss: woman, woman, medium-dark skin tone, light skin tone","o|3|25P|25Q|8b","👩🏾‍❤‍💋‍👩🏻","o|3|25S|25Q|8b","👩🏾‍❤️‍💋‍👩🏼","kiss: woman, woman, medium-dark skin tone, medium-light skin tone","o|3|25U|25V|8b","👩🏾‍❤‍💋‍👩🏼","o|3|25X|25V|8b","👩🏾‍❤️‍💋‍👩🏽","kiss: woman, woman, medium-dark skin tone, medium skin tone","o|3|25Z|25a|8b","👩🏾‍❤‍💋‍👩🏽","o|3|25c|25a|8b","👩🏾‍❤️‍💋‍👩🏾","kiss: woman, woman, medium-dark skin tone","o|3|25e|25f|8b","👩🏾‍❤‍💋‍👩🏾","o|3|25h|25f|8b","👩🏾‍❤️‍💋‍👩🏿","kiss: woman, woman, medium-dark skin tone, dark skin tone","o|3|25j|25k|8b","👩🏾‍❤‍💋‍👩🏿","o|3|25m|25k|8b","👩🏿‍❤️‍💋‍👩🏻","kiss: woman, woman, dark skin tone, light skin tone","o|3|25o|25p|8b","👩🏿‍❤‍💋‍👩🏻","o|3|25r|25p|8b","👩🏿‍❤️‍💋‍👩🏼","kiss: woman, woman, dark skin tone, medium-light skin tone","o|3|25t|25u|8b","👩🏿‍❤‍💋‍👩🏼","o|3|25w|25u|8b","👩🏿‍❤️‍💋‍👩🏽","kiss: woman, woman, dark skin tone, medium skin tone","o|3|25y|25z|8b","👩🏿‍❤‍💋‍👩🏽","o|3|261|25z|8b","👩🏿‍❤️‍💋‍👩🏾","kiss: woman, woman, dark skin tone, medium-dark skin tone","o|3|263|264|8b","👩🏿‍❤‍💋‍👩🏾","o|3|266|264|8b","👩🏿‍❤️‍💋‍👩🏿","kiss: woman, woman, dark skin tone","o|3|268|269|8b","👩🏿‍❤‍💋‍👩🏿","o|3|26B|269|8b","💑","couple with heart","o|3|26D|26E|8b","💑🏻","couple with heart: light skin tone","o|3|26G|26H|8b","💑🏼","couple with heart: medium-light skin tone","o|3|26J|26K|8b","💑🏽","couple with heart: medium skin tone","o|3|26M|26N|8b","💑🏾","couple with heart: medium-dark skin tone","o|3|26P|26Q|8b","💑🏿","couple with heart: dark skin tone","o|3|26S|26T|8b","🧑🏻‍❤️‍🧑🏼","couple with heart: person, person, light skin tone, medium-light skin tone","o|3|26V|26W|8b","🧑🏻‍❤‍🧑🏼","o|3|26Y|26W|8b","🧑🏻‍❤️‍🧑🏽","couple with heart: person, person, light skin tone, medium skin tone","o|3|26a|26b|8b","🧑🏻‍❤‍🧑🏽","o|3|26d|26b|8b","🧑🏻‍❤️‍🧑🏾","couple with heart: person, person, light skin tone, medium-dark skin tone","o|3|26f|26g|8b","🧑🏻‍❤‍🧑🏾","o|3|26i|26g|8b","🧑🏻‍❤️‍🧑🏿","couple with heart: person, person, light skin tone, dark skin tone","o|3|26k|26l|8b","🧑🏻‍❤‍🧑🏿","o|3|26n|26l|8b","🧑🏼‍❤️‍🧑🏻","couple with heart: person, person, medium-light skin tone, light skin tone","o|3|26p|26q|8b","🧑🏼‍❤‍🧑🏻","o|3|26s|26q|8b","🧑🏼‍❤️‍🧑🏽","couple with heart: person, person, medium-light skin tone, medium skin tone","o|3|26u|26v|8b","🧑🏼‍❤‍🧑🏽","o|3|26x|26v|8b","🧑🏼‍❤️‍🧑🏾","couple with heart: person, person, medium-light skin tone, medium-dark skin tone","o|3|26z|270|8b","🧑🏼‍❤‍🧑🏾","o|3|272|270|8b","🧑🏼‍❤️‍🧑🏿","couple with heart: person, person, medium-light skin tone, dark skin tone","o|3|274|275|8b","🧑🏼‍❤‍🧑🏿","o|3|277|275|8b","🧑🏽‍❤️‍🧑🏻","couple with heart: person, person, medium skin tone, light skin tone","o|3|279|27A|8b","🧑🏽‍❤‍🧑🏻","o|3|27C|27A|8b","🧑🏽‍❤️‍🧑🏼","couple with heart: person, person, medium skin tone, medium-light skin tone","o|3|27E|27F|8b","🧑🏽‍❤‍🧑🏼","o|3|27H|27F|8b","🧑🏽‍❤️‍🧑🏾","couple with heart: person, person, medium skin tone, medium-dark skin tone","o|3|27J|27K|8b","🧑🏽‍❤‍🧑🏾","o|3|27M|27K|8b","🧑🏽‍❤️‍🧑🏿","couple with heart: person, person, medium skin tone, dark skin tone","o|3|27O|27P|8b","🧑🏽‍❤‍🧑🏿","o|3|27R|27P|8b","🧑🏾‍❤️‍🧑🏻","couple with heart: person, person, medium-dark skin tone, light skin tone","o|3|27T|27U|8b","🧑🏾‍❤‍🧑🏻","o|3|27W|27U|8b","🧑🏾‍❤️‍🧑🏼","couple with heart: person, person, medium-dark skin tone, medium-light skin tone","o|3|27Y|27Z|8b","🧑🏾‍❤‍🧑🏼","o|3|27b|27Z|8b","🧑🏾‍❤️‍🧑🏽","couple with heart: person, person, medium-dark skin tone, medium skin tone","o|3|27d|27e|8b","🧑🏾‍❤‍🧑🏽","o|3|27g|27e|8b","🧑🏾‍❤️‍🧑🏿","couple with heart: person, person, medium-dark skin tone, dark skin tone","o|3|27i|27j|8b","🧑🏾‍❤‍🧑🏿","o|3|27l|27j|8b","🧑🏿‍❤️‍🧑🏻","couple with heart: person, person, dark skin tone, light skin tone","o|3|27n|27o|8b","🧑🏿‍❤‍🧑🏻","o|3|27q|27o|8b","🧑🏿‍❤️‍🧑🏼","couple with heart: person, person, dark skin tone, medium-light skin tone","o|3|27s|27t|8b","🧑🏿‍❤‍🧑🏼","o|3|27v|27t|8b","🧑🏿‍❤️‍🧑🏽","couple with heart: person, person, dark skin tone, medium skin tone","o|3|27x|27y|8b","🧑🏿‍❤‍🧑🏽","o|3|280|27y|8b","🧑🏿‍❤️‍🧑🏾","couple with heart: person, person, dark skin tone, medium-dark skin tone","o|3|282|283|8b","🧑🏿‍❤‍🧑🏾","o|3|285|283|8b","👩‍❤️‍👨","couple with heart: woman, man","o|3|287|288|8b","👩‍❤‍👨","o|3|28A|288|8b","👩🏻‍❤️‍👨🏻","couple with heart: woman, man, light skin tone","o|3|28C|28D|8b","👩🏻‍❤‍👨🏻","o|3|28F|28D|8b","👩🏻‍❤️‍👨🏼","couple with heart: woman, man, light skin tone, medium-light skin tone","o|3|28H|28I|8b","👩🏻‍❤‍👨🏼","o|3|28K|28I|8b","👩🏻‍❤️‍👨🏽","couple with heart: woman, man, light skin tone, medium skin tone","o|3|28M|28N|8b","👩🏻‍❤‍👨🏽","o|3|28P|28N|8b","👩🏻‍❤️‍👨🏾","couple with heart: woman, man, light skin tone, medium-dark skin tone","o|3|28R|28S|8b","👩🏻‍❤‍👨🏾","o|3|28U|28S|8b","👩🏻‍❤️‍👨🏿","couple with heart: woman, man, light skin tone, dark skin tone","o|3|28W|28X|8b","👩🏻‍❤‍👨🏿","o|3|28Z|28X|8b","👩🏼‍❤️‍👨🏻","couple with heart: woman, man, medium-light skin tone, light skin tone","o|3|28b|28c|8b","👩🏼‍❤‍👨🏻","o|3|28e|28c|8b","👩🏼‍❤️‍👨🏼","couple with heart: woman, man, medium-light skin tone","o|3|28g|28h|8b","👩🏼‍❤‍👨🏼","o|3|28j|28h|8b","👩🏼‍❤️‍👨🏽","couple with heart: woman, man, medium-light skin tone, medium skin tone","o|3|28l|28m|8b","👩🏼‍❤‍👨🏽","o|3|28o|28m|8b","👩🏼‍❤️‍👨🏾","couple with heart: woman, man, medium-light skin tone, medium-dark skin tone","o|3|28q|28r|8b","👩🏼‍❤‍👨🏾","o|3|28t|28r|8b","👩🏼‍❤️‍👨🏿","couple with heart: woman, man, medium-light skin tone, dark skin tone","o|3|28v|28w|8b","👩🏼‍❤‍👨🏿","o|3|28y|28w|8b","👩🏽‍❤️‍👨🏻","couple with heart: woman, man, medium skin tone, light skin tone","o|3|290|291|8b","👩🏽‍❤‍👨🏻","o|3|293|291|8b","👩🏽‍❤️‍👨🏼","couple with heart: woman, man, medium skin tone, medium-light skin tone","o|3|295|296|8b","👩🏽‍❤‍👨🏼","o|3|298|296|8b","👩🏽‍❤️‍👨🏽","couple with heart: woman, man, medium skin tone","o|3|29A|29B|8b","👩🏽‍❤‍👨🏽","o|3|29D|29B|8b","👩🏽‍❤️‍👨🏾","couple with heart: woman, man, medium skin tone, medium-dark skin tone","o|3|29F|29G|8b","👩🏽‍❤‍👨🏾","o|3|29I|29G|8b","👩🏽‍❤️‍👨🏿","couple with heart: woman, man, medium skin tone, dark skin tone","o|3|29K|29L|8b","👩🏽‍❤‍👨🏿","o|3|29N|29L|8b","👩🏾‍❤️‍👨🏻","couple with heart: woman, man, medium-dark skin tone, light skin tone","o|3|29P|29Q|8b","👩🏾‍❤‍👨🏻","o|3|29S|29Q|8b","👩🏾‍❤️‍👨🏼","couple with heart: woman, man, medium-dark skin tone, medium-light skin tone","o|3|29U|29V|8b","👩🏾‍❤‍👨🏼","o|3|29X|29V|8b","👩🏾‍❤️‍👨🏽","couple with heart: woman, man, medium-dark skin tone, medium skin tone","o|3|29Z|29a|8b","👩🏾‍❤‍👨🏽","o|3|29c|29a|8b","👩🏾‍❤️‍👨🏾","couple with heart: woman, man, medium-dark skin tone","o|3|29e|29f|8b","👩🏾‍❤‍👨🏾","o|3|29h|29f|8b","👩🏾‍❤️‍👨🏿","couple with heart: woman, man, medium-dark skin tone, dark skin tone","o|3|29j|29k|8b","👩🏾‍❤‍👨🏿","o|3|29m|29k|8b","👩🏿‍❤️‍👨🏻","couple with heart: woman, man, dark skin tone, light skin tone","o|3|29o|29p|8b","👩🏿‍❤‍👨🏻","o|3|29r|29p|8b","👩🏿‍❤️‍👨🏼","couple with heart: woman, man, dark skin tone, medium-light skin tone","o|3|29t|29u|8b","👩🏿‍❤‍👨🏼","o|3|29w|29u|8b","👩🏿‍❤️‍👨🏽","couple with heart: woman, man, dark skin tone, medium skin tone","o|3|29y|29z|8b","👩🏿‍❤‍👨🏽","o|3|2A1|29z|8b","👩🏿‍❤️‍👨🏾","couple with heart: woman, man, dark skin tone, medium-dark skin tone","o|3|2A3|2A4|8b","👩🏿‍❤‍👨🏾","o|3|2A6|2A4|8b","👩🏿‍❤️‍👨🏿","couple with heart: woman, man, dark skin tone","o|3|2A8|2A9|8b","👩🏿‍❤‍👨🏿","o|3|2AB|2A9|8b","👨‍❤️‍👨","couple with heart: man, man","o|3|2AD|2AE|8b","👨‍❤‍👨","o|3|2AG|2AE|8b","👨🏻‍❤️‍👨🏻","couple with heart: man, man, light skin tone","o|3|2AI|2AJ|8b","👨🏻‍❤‍👨🏻","o|3|2AL|2AJ|8b","👨🏻‍❤️‍👨🏼","couple with heart: man, man, light skin tone, medium-light skin tone","o|3|2AN|2AO|8b","👨🏻‍❤‍👨🏼","o|3|2AQ|2AO|8b","👨🏻‍❤️‍👨🏽","couple with heart: man, man, light skin tone, medium skin tone","o|3|2AS|2AT|8b","👨🏻‍❤‍👨🏽","o|3|2AV|2AT|8b","👨🏻‍❤️‍👨🏾","couple with heart: man, man, light skin tone, medium-dark skin tone","o|3|2AX|2AY|8b","👨🏻‍❤‍👨🏾","o|3|2Aa|2AY|8b","👨🏻‍❤️‍👨🏿","couple with heart: man, man, light skin tone, dark skin tone","o|3|2Ac|2Ad|8b","👨🏻‍❤‍👨🏿","o|3|2Af|2Ad|8b","👨🏼‍❤️‍👨🏻","couple with heart: man, man, medium-light skin tone, light skin tone","o|3|2Ah|2Ai|8b","👨🏼‍❤‍👨🏻","o|3|2Ak|2Ai|8b","👨🏼‍❤️‍👨🏼","couple with heart: man, man, medium-light skin tone","o|3|2Am|2An|8b","👨🏼‍❤‍👨🏼","o|3|2Ap|2An|8b","👨🏼‍❤️‍👨🏽","couple with heart: man, man, medium-light skin tone, medium skin tone","o|3|2Ar|2As|8b","👨🏼‍❤‍👨🏽","o|3|2Au|2As|8b","👨🏼‍❤️‍👨🏾","couple with heart: man, man, medium-light skin tone, medium-dark skin tone","o|3|2Aw|2Ax|8b","👨🏼‍❤‍👨🏾","o|3|2Az|2Ax|8b","👨🏼‍❤️‍👨🏿","couple with heart: man, man, medium-light skin tone, dark skin tone","o|3|2B1|2B2|8b","👨🏼‍❤‍👨🏿","o|3|2B4|2B2|8b","👨🏽‍❤️‍👨🏻","couple with heart: man, man, medium skin tone, light skin tone","o|3|2B6|2B7|8b","👨🏽‍❤‍👨🏻","o|3|2B9|2B7|8b","👨🏽‍❤️‍👨🏼","couple with heart: man, man, medium skin tone, medium-light skin tone","o|3|2BB|2BC|8b","👨🏽‍❤‍👨🏼","o|3|2BE|2BC|8b","👨🏽‍❤️‍👨🏽","couple with heart: man, man, medium skin tone","o|3|2BG|2BH|8b","👨🏽‍❤‍👨🏽","o|3|2BJ|2BH|8b","👨🏽‍❤️‍👨🏾","couple with heart: man, man, medium skin tone, medium-dark skin tone","o|3|2BL|2BM|8b","👨🏽‍❤‍👨🏾","o|3|2BO|2BM|8b","👨🏽‍❤️‍👨🏿","couple with heart: man, man, medium skin tone, dark skin tone","o|3|2BQ|2BR|8b","👨🏽‍❤‍👨🏿","o|3|2BT|2BR|8b","👨🏾‍❤️‍👨🏻","couple with heart: man, man, medium-dark skin tone, light skin tone","o|3|2BV|2BW|8b","👨🏾‍❤‍👨🏻","o|3|2BY|2BW|8b","👨🏾‍❤️‍👨🏼","couple with heart: man, man, medium-dark skin tone, medium-light skin tone","o|3|2Ba|2Bb|8b","👨🏾‍❤‍👨🏼","o|3|2Bd|2Bb|8b","👨🏾‍❤️‍👨🏽","couple with heart: man, man, medium-dark skin tone, medium skin tone","o|3|2Bf|2Bg|8b","👨🏾‍❤‍👨🏽","o|3|2Bi|2Bg|8b","👨🏾‍❤️‍👨🏾","couple with heart: man, man, medium-dark skin tone","o|3|2Bk|2Bl|8b","👨🏾‍❤‍👨🏾","o|3|2Bn|2Bl|8b","👨🏾‍❤️‍👨🏿","couple with heart: man, man, medium-dark skin tone, dark skin tone","o|3|2Bp|2Bq|8b","👨🏾‍❤‍👨🏿","o|3|2Bs|2Bq|8b","👨🏿‍❤️‍👨🏻","couple with heart: man, man, dark skin tone, light skin tone","o|3|2Bu|2Bv|8b","👨🏿‍❤‍👨🏻","o|3|2Bx|2Bv|8b","👨🏿‍❤️‍👨🏼","couple with heart: man, man, dark skin tone, medium-light skin tone","o|3|2Bz|2C0|8b","👨🏿‍❤‍👨🏼","o|3|2C2|2C0|8b","👨🏿‍❤️‍👨🏽","couple with heart: man, man, dark skin tone, medium skin tone","o|3|2C4|2C5|8b","👨🏿‍❤‍👨🏽","o|3|2C7|2C5|8b","👨🏿‍❤️‍👨🏾","couple with heart: man, man, dark skin tone, medium-dark skin tone","o|3|2C9|2CA|8b","👨🏿‍❤‍👨🏾","o|3|2CC|2CA|8b","👨🏿‍❤️‍👨🏿","couple with heart: man, man, dark skin tone","o|3|2CE|2CF|8b","👨🏿‍❤‍👨🏿","o|3|2CH|2CF|8b","👩‍❤️‍👩","couple with heart: woman, woman","o|3|2CJ|2CK|8b","👩‍❤‍👩","o|3|2CM|2CK|8b","👩🏻‍❤️‍👩🏻","couple with heart: woman, woman, light skin tone","o|3|2CO|2CP|8b","👩🏻‍❤‍👩🏻","o|3|2CR|2CP|8b","👩🏻‍❤️‍👩🏼","couple with heart: woman, woman, light skin tone, medium-light skin tone","o|3|2CT|2CU|8b","👩🏻‍❤‍👩🏼","o|3|2CW|2CU|8b","👩🏻‍❤️‍👩🏽","couple with heart: woman, woman, light skin tone, medium skin tone","o|3|2CY|2CZ|8b","👩🏻‍❤‍👩🏽","o|3|2Cb|2CZ|8b","👩🏻‍❤️‍👩🏾","couple with heart: woman, woman, light skin tone, medium-dark skin tone","o|3|2Cd|2Ce|8b","👩🏻‍❤‍👩🏾","o|3|2Cg|2Ce|8b","👩🏻‍❤️‍👩🏿","couple with heart: woman, woman, light skin tone, dark skin tone","o|3|2Ci|2Cj|8b","👩🏻‍❤‍👩🏿","o|3|2Cl|2Cj|8b","👩🏼‍❤️‍👩🏻","couple with heart: woman, woman, medium-light skin tone, light skin tone","o|3|2Cn|2Co|8b","👩🏼‍❤‍👩🏻","o|3|2Cq|2Co|8b","👩🏼‍❤️‍👩🏼","couple with heart: woman, woman, medium-light skin tone","o|3|2Cs|2Ct|8b","👩🏼‍❤‍👩🏼","o|3|2Cv|2Ct|8b","👩🏼‍❤️‍👩🏽","couple with heart: woman, woman, medium-light skin tone, medium skin tone","o|3|2Cx|2Cy|8b","👩🏼‍❤‍👩🏽","o|3|2D0|2Cy|8b","👩🏼‍❤️‍👩🏾","couple with heart: woman, woman, medium-light skin tone, medium-dark skin tone","o|3|2D2|2D3|8b","👩🏼‍❤‍👩🏾","o|3|2D5|2D3|8b","👩🏼‍❤️‍👩🏿","couple with heart: woman, woman, medium-light skin tone, dark skin tone","o|3|2D7|2D8|8b","👩🏼‍❤‍👩🏿","o|3|2DA|2D8|8b","👩🏽‍❤️‍👩🏻","couple with heart: woman, woman, medium skin tone, light skin tone","o|3|2DC|2DD|8b","👩🏽‍❤‍👩🏻","o|3|2DF|2DD|8b","👩🏽‍❤️‍👩🏼","couple with heart: woman, woman, medium skin tone, medium-light skin tone","o|3|2DH|2DI|8b","👩🏽‍❤‍👩🏼","o|3|2DK|2DI|8b","👩🏽‍❤️‍👩🏽","couple with heart: woman, woman, medium skin tone","o|3|2DM|2DN|8b","👩🏽‍❤‍👩🏽","o|3|2DP|2DN|8b","👩🏽‍❤️‍👩🏾","couple with heart: woman, woman, medium skin tone, medium-dark skin tone","o|3|2DR|2DS|8b","👩🏽‍❤‍👩🏾","o|3|2DU|2DS|8b","👩🏽‍❤️‍👩🏿","couple with heart: woman, woman, medium skin tone, dark skin tone","o|3|2DW|2DX|8b","👩🏽‍❤‍👩🏿","o|3|2DZ|2DX|8b","👩🏾‍❤️‍👩🏻","couple with heart: woman, woman, medium-dark skin tone, light skin tone","o|3|2Db|2Dc|8b","👩🏾‍❤‍👩🏻","o|3|2De|2Dc|8b","👩🏾‍❤️‍👩🏼","couple with heart: woman, woman, medium-dark skin tone, medium-light skin tone","o|3|2Dg|2Dh|8b","👩🏾‍❤‍👩🏼","o|3|2Dj|2Dh|8b","👩🏾‍❤️‍👩🏽","couple with heart: woman, woman, medium-dark skin tone, medium skin tone","o|3|2Dl|2Dm|8b","👩🏾‍❤‍👩🏽","o|3|2Do|2Dm|8b","👩🏾‍❤️‍👩🏾","couple with heart: woman, woman, medium-dark skin tone","o|3|2Dq|2Dr|8b","👩🏾‍❤‍👩🏾","o|3|2Dt|2Dr|8b","👩🏾‍❤️‍👩🏿","couple with heart: woman, woman, medium-dark skin tone, dark skin tone","o|3|2Dv|2Dw|8b","👩🏾‍❤‍👩🏿","o|3|2Dy|2Dw|8b","👩🏿‍❤️‍👩🏻","couple with heart: woman, woman, dark skin tone, light skin tone","o|3|2E0|2E1|8b","👩🏿‍❤‍👩🏻","o|3|2E3|2E1|8b","👩🏿‍❤️‍👩🏼","couple with heart: woman, woman, dark skin tone, medium-light skin tone","o|3|2E5|2E6|8b","👩🏿‍❤‍👩🏼","o|3|2E8|2E6|8b","👩🏿‍❤️‍👩🏽","couple with heart: woman, woman, dark skin tone, medium skin tone","o|3|2EA|2EB|8b","👩🏿‍❤‍👩🏽","o|3|2ED|2EB|8b","👩🏿‍❤️‍👩🏾","couple with heart: woman, woman, dark skin tone, medium-dark skin tone","o|3|2EF|2EG|8b","👩🏿‍❤‍👩🏾","o|3|2EI|2EG|8b","👩🏿‍❤️‍👩🏿","couple with heart: woman, woman, dark skin tone","o|3|2EK|2EL|8b","👩🏿‍❤‍👩🏿","o|3|2EN|2EL|8b","👪","family","o|3|2EP|2EQ|8b","👨‍👩‍👦","family: man, woman, boy","o|3|2ES|2ET|8b","👨‍👩‍👧","family: man, woman, girl","o|3|2EV|2EW|8b","👨‍👩‍👧‍👦","family: man, woman, girl, boy","o|3|2EY|2EZ|8b","👨‍👩‍👦‍👦","family: man, woman, boy, boy","o|3|2Eb|2Ec|8b","👨‍👩‍👧‍👧","family: man, woman, girl, girl","o|3|2Ee|2Ef|8b","👨‍👨‍👦","family: man, man, boy","o|3|2Eh|2Ei|8b","👨‍👨‍👧","family: man, man, girl","o|3|2Ek|2El|8b","👨‍👨‍👧‍👦","family: man, man, girl, boy","o|3|2En|2Eo|8b","👨‍👨‍👦‍👦","family: man, man, boy, boy","o|3|2Eq|2Er|8b","👨‍👨‍👧‍👧","family: man, man, girl, girl","o|3|2Et|2Eu|8b","👩‍👩‍👦","family: woman, woman, boy","o|3|2Ew|2Ex|8b","👩‍👩‍👧","family: woman, woman, girl","o|3|2Ez|2F0|8b","👩‍👩‍👧‍👦","family: woman, woman, girl, boy","o|3|2F2|2F3|8b","👩‍👩‍👦‍👦","family: woman, woman, boy, boy","o|3|2F5|2F6|8b","👩‍👩‍👧‍👧","family: woman, woman, girl, girl","o|3|2F8|2F9|8b","👨‍👦","family: man, boy","o|3|2FB|2FC|8b","👨‍👦‍👦","family: man, boy, boy","o|3|2FE|2FF|8b","👨‍👧","family: man, girl","o|3|2FH|2FI|8b","👨‍👧‍👦","family: man, girl, boy","o|3|2FK|2FL|8b","👨‍👧‍👧","family: man, girl, girl","o|3|2FN|2FO|8b","👩‍👦","family: woman, boy","o|3|2FQ|2FR|8b","👩‍👦‍👦","family: woman, boy, boy","o|3|2FT|2FU|8b","👩‍👧","family: woman, girl","o|3|2FW|2FX|8b","👩‍👧‍👦","family: woman, girl, boy","o|3|2FZ|2Fa|8b","👩‍👧‍👧","family: woman, girl, girl","o|3|2Fc|2Fd|8b","🗣️","speaking head","o|3|2Ff|2Fg|8b","🗣","o|3|2Fi|2Fg|8b","👤","bust in silhouette","o|3|2Fk|2Fl|8b","👥","busts in silhouette","o|3|2Fn|2Fo|8b","🫂","people hugging","o|3|2Fq|2Fr|8b","👣","footprints","o|3|2Ft|2Fu|8b","🏻","light skin tone","Component","o|3|2Fw|2Fx|2Fy","🏼","medium-light skin tone","o|3|2G0|2G1|2Fy","🏽","medium skin tone","o|3|2G3|2G4|2Fy","🏾","medium-dark skin tone","o|3|2G6|2G7|2Fy","🏿","dark skin tone","o|3|2G9|2GA|2Fy","🦰","red hair","o|3|2GC|2GD|2Fy","🦱","curly hair","o|3|2GF|2GG|2Fy","🦳","white hair","o|3|2GI|2GJ|2Fy","🦲","bald","o|3|2GL|2GM|2Fy","🐵","monkey face","Animals & Nature","o|3|2GO|2GP|2GQ","🐒","monkey","o|3|2GS|2GT|2GQ","🦍","gorilla","o|3|2GV|2GW|2GQ","🦧","orangutan","o|3|2GY|2GZ|2GQ","🐶","dog face","o|3|2Gb|2Gc|2GQ","🐕","dog","o|3|2Ge|2Gf|2GQ","🦮","guide dog","o|3|2Gh|2Gi|2GQ","🐕‍🦺","service dog","o|3|2Gk|2Gl|2GQ","🐩","poodle","o|3|2Gn|2Go|2GQ","🐺","wolf","o|3|2Gq|2Gr|2GQ","🦊","fox","o|3|2Gt|2Gu|2GQ","🦝","raccoon","o|3|2Gw|2Gx|2GQ","🐱","cat face","o|3|2Gz|2H0|2GQ","🐈","cat","o|3|2H2|2H3|2GQ","🐈‍⬛","black cat","o|3|2H5|2H6|2GQ","🦁","lion","o|3|2H8|2H9|2GQ","🐯","tiger face","o|3|2HB|2HC|2GQ","🐅","tiger","o|3|2HE|2HF|2GQ","🐆","leopard","o|3|2HH|2HI|2GQ","🐴","horse face","o|3|2HK|2HL|2GQ","🫎","moose","o|3|2HN|2HO|2GQ","🫏","donkey","o|3|2HQ|2HR|2GQ","🐎","horse","o|3|2HT|2HU|2GQ","🦄","unicorn","o|3|2HW|2HX|2GQ","🦓","zebra","o|3|2HZ|2Ha|2GQ","🦌","deer","o|3|2Hc|2Hd|2GQ","🦬","bison","o|3|2Hf|2Hg|2GQ","🐮","cow face","o|3|2Hi|2Hj|2GQ","🐂","ox","o|3|2Hl|2Hm|2GQ","🐃","water buffalo","o|3|2Ho|2Hp|2GQ","🐄","cow","o|3|2Hr|2Hs|2GQ","🐷","pig face","o|3|2Hu|2Hv|2GQ","🐖","pig","o|3|2Hx|2Hy|2GQ","🐗","boar","o|3|2I0|2I1|2GQ","🐽","pig nose","o|3|2I3|2I4|2GQ","🐏","ram","o|3|2I6|2I7|2GQ","🐑","ewe","o|3|2I9|2IA|2GQ","🐐","goat","o|3|2IC|2ID|2GQ","🐪","camel","o|3|2IF|2IG|2GQ","🐫","two-hump camel","o|3|2II|2IJ|2GQ","🦙","llama","o|3|2IL|2IM|2GQ","🦒","giraffe","o|3|2IO|2IP|2GQ","🐘","elephant","o|3|2IR|2IS|2GQ","🦣","mammoth","o|3|2IU|2IV|2GQ","🦏","rhinoceros","o|3|2IX|2IY|2GQ","🦛","hippopotamus","o|3|2Ia|2Ib|2GQ","🐭","mouse face","o|3|2Id|2Ie|2GQ","🐁","mouse","o|3|2Ig|2Ih|2GQ","🐀","rat","o|3|2Ij|2Ik|2GQ","🐹","hamster","o|3|2Im|2In|2GQ","🐰","rabbit face","o|3|2Ip|2Iq|2GQ","🐇","rabbit","o|3|2Is|2It|2GQ","🐿️","chipmunk","o|3|2Iv|2Iw|2GQ","🐿","o|3|2Iy|2Iw|2GQ","🦫","beaver","o|3|2J0|2J1|2GQ","🦔","hedgehog","o|3|2J3|2J4|2GQ","🦇","bat","o|3|2J6|2J7|2GQ","🐻","bear","o|3|2J9|2JA|2GQ","🐻‍❄️","polar bear","o|3|2JC|2JD|2GQ","🐻‍❄","o|3|2JF|2JD|2GQ","🐨","koala","o|3|2JH|2JI|2GQ","🐼","panda","o|3|2JK|2JL|2GQ","🦥","sloth","o|3|2JN|2JO|2GQ","🦦","otter","o|3|2JQ|2JR|2GQ","🦨","skunk","o|3|2JT|2JU|2GQ","🦘","kangaroo","o|3|2JW|2JX|2GQ","🦡","badger","o|3|2JZ|2Ja|2GQ","🐾","paw prints","o|3|2Jc|2Jd|2GQ","🦃","turkey","o|3|2Jf|2Jg|2GQ","🐔","chicken","o|3|2Ji|2Jj|2GQ","🐓","rooster","o|3|2Jl|2Jm|2GQ","🐣","hatching chick","o|3|2Jo|2Jp|2GQ","🐤","baby chick","o|3|2Jr|2Js|2GQ","🐥","front-facing baby chick","o|3|2Ju|2Jv|2GQ","🐦","bird","o|3|2Jx|2Jy|2GQ","🐧","penguin","o|3|2K0|2K1|2GQ","🕊️","dove","o|3|2K3|2K4|2GQ","🕊","o|3|2K6|2K4|2GQ","🦅","eagle","o|3|2K8|2K9|2GQ","🦆","duck","o|3|2KB|2KC|2GQ","🦢","swan","o|3|2KE|2KF|2GQ","🦉","owl","o|3|2KH|2KI|2GQ","🦤","dodo","o|3|2KK|2KL|2GQ","🪶","feather","o|3|2KN|2KO|2GQ","🦩","flamingo","o|3|2KQ|2KR|2GQ","🦚","peacock","o|3|2KT|2KU|2GQ","🦜","parrot","o|3|2KW|2KX|2GQ","🪽","wing","o|3|2KZ|2Ka|2GQ","🐦‍⬛","black bird","o|3|2Kc|2Kd|2GQ","🪿","goose","o|3|2Kf|2Kg|2GQ","🐸","frog","o|3|2Ki|2Kj|2GQ","🐊","crocodile","o|3|2Kl|2Km|2GQ","🐢","turtle","o|3|2Ko|2Kp|2GQ","🦎","lizard","o|3|2Kr|2Ks|2GQ","🐍","snake","o|3|2Ku|2Kv|2GQ","🐲","dragon face","o|3|2Kx|2Ky|2GQ","🐉","dragon","o|3|2L0|2L1|2GQ","🦕","sauropod","o|3|2L3|2L4|2GQ","🦖","T-Rex","o|3|2L6|2L7|2GQ","🐳","spouting whale","o|3|2L9|2LA|2GQ","🐋","whale","o|3|2LC|2LD|2GQ","🐬","dolphin","o|3|2LF|2LG|2GQ","🦭","seal","o|3|2LI|2LJ|2GQ","🐟","fish","o|3|2LL|2LM|2GQ","🐠","tropical fish","o|3|2LO|2LP|2GQ","🐡","blowfish","o|3|2LR|2LS|2GQ","🦈","shark","o|3|2LU|2LV|2GQ","🐙","octopus","o|3|2LX|2LY|2GQ","🐚","spiral shell","o|3|2La|2Lb|2GQ","🪸","coral","o|3|2Ld|2Le|2GQ","🪼","jellyfish","o|3|2Lg|2Lh|2GQ","🐌","snail","o|3|2Lj|2Lk|2GQ","🦋","butterfly","o|3|2Lm|2Ln|2GQ","🐛","bug","o|3|2Lp|2Lq|2GQ","🐜","ant","o|3|2Ls|2Lt|2GQ","🐝","honeybee","o|3|2Lv|2Lw|2GQ","🪲","beetle","o|3|2Ly|2Lz|2GQ","🐞","lady beetle","o|3|2M1|2M2|2GQ","🦗","cricket","o|3|2M4|2M5|2GQ","🪳","cockroach","o|3|2M7|2M8|2GQ","🕷️","spider","o|3|2MA|2MB|2GQ","🕷","o|3|2MD|2MB|2GQ","🕸️","spider web","o|3|2MF|2MG|2GQ","🕸","o|3|2MI|2MG|2GQ","🦂","scorpion","o|3|2MK|2ML|2GQ","🦟","mosquito","o|3|2MN|2MO|2GQ","🪰","fly","o|3|2MQ|2MR|2GQ","🪱","worm","o|3|2MT|2MU|2GQ","🦠","microbe","o|3|2MW|2MX|2GQ","💐","bouquet","o|3|2MZ|2Ma|2GQ","🌸","cherry blossom","o|3|2Mc|2Md|2GQ","💮","white flower","o|3|2Mf|2Mg|2GQ","🪷","lotus","o|3|2Mi|2Mj|2GQ","🏵️","rosette","o|3|2Ml|2Mm|2GQ","🏵","o|3|2Mo|2Mm|2GQ","🌹","rose","o|3|2Mq|2Mr|2GQ","🥀","wilted flower","o|3|2Mt|2Mu|2GQ","🌺","hibiscus","o|3|2Mw|2Mx|2GQ","🌻","sunflower","o|3|2Mz|2N0|2GQ","🌼","blossom","o|3|2N2|2N3|2GQ","🌷","tulip","o|3|2N5|2N6|2GQ","🪻","hyacinth","o|3|2N8|2N9|2GQ","🌱","seedling","o|3|2NB|2NC|2GQ","🪴","potted plant","o|3|2NE|2NF|2GQ","🌲","evergreen tree","o|3|2NH|2NI|2GQ","🌳","deciduous tree","o|3|2NK|2NL|2GQ","🌴","palm tree","o|3|2NN|2NO|2GQ","🌵","cactus","o|3|2NQ|2NR|2GQ","🌾","sheaf of rice","o|3|2NT|2NU|2GQ","🌿","herb","o|3|2NW|2NX|2GQ","☘️","shamrock","o|3|2NZ|2Na|2GQ","☘","o|3|2Nc|2Na|2GQ","🍀","four leaf clover","o|3|2Ne|2Nf|2GQ","🍁","maple leaf","o|3|2Nh|2Ni|2GQ","🍂","fallen leaf","o|3|2Nk|2Nl|2GQ","🍃","leaf fluttering in wind","o|3|2Nn|2No|2GQ","🪹","empty nest","o|3|2Nq|2Nr|2GQ","🪺","nest with eggs","o|3|2Nt|2Nu|2GQ","🍄","mushroom","o|3|2Nw|2Nx|2GQ","🍇","grapes","Food & Drink","o|3|2Nz|2O0|2O1","🍈","melon","o|3|2O3|2O4|2O1","🍉","watermelon","o|3|2O6|2O7|2O1","🍊","tangerine","o|3|2O9|2OA|2O1","🍋","lemon","o|3|2OC|2OD|2O1","🍌","banana","o|3|2OF|2OG|2O1","🍍","pineapple","o|3|2OI|2OJ|2O1","🥭","mango","o|3|2OL|2OM|2O1","🍎","red apple","o|3|2OO|2OP|2O1","🍏","green apple","o|3|2OR|2OS|2O1","🍐","pear","o|3|2OU|2OV|2O1","🍑","peach","o|3|2OX|2OY|2O1","🍒","cherries","o|3|2Oa|2Ob|2O1","🍓","strawberry","o|3|2Od|2Oe|2O1","🫐","blueberries","o|3|2Og|2Oh|2O1","🥝","kiwi fruit","o|3|2Oj|2Ok|2O1","🍅","tomato","o|3|2Om|2On|2O1","🫒","olive","o|3|2Op|2Oq|2O1","🥥","coconut","o|3|2Os|2Ot|2O1","🥑","avocado","o|3|2Ov|2Ow|2O1","🍆","eggplant","o|3|2Oy|2Oz|2O1","🥔","potato","o|3|2P1|2P2|2O1","🥕","carrot","o|3|2P4|2P5|2O1","🌽","ear of corn","o|3|2P7|2P8|2O1","🌶️","hot pepper","o|3|2PA|2PB|2O1","🌶","o|3|2PD|2PB|2O1","🫑","bell pepper","o|3|2PF|2PG|2O1","🥒","cucumber","o|3|2PI|2PJ|2O1","🥬","leafy green","o|3|2PL|2PM|2O1","🥦","broccoli","o|3|2PO|2PP|2O1","🧄","garlic","o|3|2PR|2PS|2O1","🧅","onion","o|3|2PU|2PV|2O1","🥜","peanuts","o|3|2PX|2PY|2O1","🫘","beans","o|3|2Pa|2Pb|2O1","🌰","chestnut","o|3|2Pd|2Pe|2O1","🫚","ginger root","o|3|2Pg|2Ph|2O1","🫛","pea pod","o|3|2Pj|2Pk|2O1","🍞","bread","o|3|2Pm|2Pn|2O1","🥐","croissant","o|3|2Pp|2Pq|2O1","🥖","baguette bread","o|3|2Ps|2Pt|2O1","🫓","flatbread","o|3|2Pv|2Pw|2O1","🥨","pretzel","o|3|2Py|2Pz|2O1","🥯","bagel","o|3|2Q1|2Q2|2O1","🥞","pancakes","o|3|2Q4|2Q5|2O1","🧇","waffle","o|3|2Q7|2Q8|2O1","🧀","cheese wedge","o|3|2QA|2QB|2O1","🍖","meat on bone","o|3|2QD|2QE|2O1","🍗","poultry leg","o|3|2QG|2QH|2O1","🥩","cut of meat","o|3|2QJ|2QK|2O1","🥓","bacon","o|3|2QM|2QN|2O1","🍔","hamburger","o|3|2QP|2QQ|2O1","🍟","french fries","o|3|2QS|2QT|2O1","🍕","pizza","o|3|2QV|2QW|2O1","🌭","hot dog","o|3|2QY|2QZ|2O1","🥪","sandwich","o|3|2Qb|2Qc|2O1","🌮","taco","o|3|2Qe|2Qf|2O1","🌯","burrito","o|3|2Qh|2Qi|2O1","🫔","tamale","o|3|2Qk|2Ql|2O1","🥙","stuffed flatbread","o|3|2Qn|2Qo|2O1","🧆","falafel","o|3|2Qq|2Qr|2O1","🥚","egg","o|3|2Qt|2Qu|2O1","🍳","cooking","o|3|2Qw|2Qx|2O1","🥘","shallow pan of food","o|3|2Qz|2R0|2O1","🍲","pot of food","o|3|2R2|2R3|2O1","🫕","fondue","o|3|2R5|2R6|2O1","🥣","bowl with spoon","o|3|2R8|2R9|2O1","🥗","green salad","o|3|2RB|2RC|2O1","🍿","popcorn","o|3|2RE|2RF|2O1","🧈","butter","o|3|2RH|2RI|2O1","🧂","salt","o|3|2RK|2RL|2O1","🥫","canned food","o|3|2RN|2RO|2O1","🍱","bento box","o|3|2RQ|2RR|2O1","🍘","rice cracker","o|3|2RT|2RU|2O1","🍙","rice ball","o|3|2RW|2RX|2O1","🍚","cooked rice","o|3|2RZ|2Ra|2O1","🍛","curry rice","o|3|2Rc|2Rd|2O1","🍜","steaming bowl","o|3|2Rf|2Rg|2O1","🍝","spaghetti","o|3|2Ri|2Rj|2O1","🍠","roasted sweet potato","o|3|2Rl|2Rm|2O1","🍢","oden","o|3|2Ro|2Rp|2O1","🍣","sushi","o|3|2Rr|2Rs|2O1","🍤","fried shrimp","o|3|2Ru|2Rv|2O1","🍥","fish cake with swirl","o|3|2Rx|2Ry|2O1","🥮","moon cake","o|3|2S0|2S1|2O1","🍡","dango","o|3|2S3|2S4|2O1","🥟","dumpling","o|3|2S6|2S7|2O1","🥠","fortune cookie","o|3|2S9|2SA|2O1","🥡","takeout box","o|3|2SC|2SD|2O1","🦀","crab","o|3|2SF|2SG|2O1","🦞","lobster","o|3|2SI|2SJ|2O1","🦐","shrimp","o|3|2SL|2SM|2O1","🦑","squid","o|3|2SO|2SP|2O1","🦪","oyster","o|3|2SR|2SS|2O1","🍦","soft ice cream","o|3|2SU|2SV|2O1","🍧","shaved ice","o|3|2SX|2SY|2O1","🍨","ice cream","o|3|2Sa|2Sb|2O1","🍩","doughnut","o|3|2Sd|2Se|2O1","🍪","cookie","o|3|2Sg|2Sh|2O1","🎂","birthday cake","o|3|2Sj|2Sk|2O1","🍰","shortcake","o|3|2Sm|2Sn|2O1","🧁","cupcake","o|3|2Sp|2Sq|2O1","🥧","pie","o|3|2Ss|2St|2O1","🍫","chocolate bar","o|3|2Sv|2Sw|2O1","🍬","candy","o|3|2Sy|2Sz|2O1","🍭","lollipop","o|3|2T1|2T2|2O1","🍮","custard","o|3|2T4|2T5|2O1","🍯","honey pot","o|3|2T7|2T8|2O1","🍼","baby bottle","o|3|2TA|2TB|2O1","🥛","glass of milk","o|3|2TD|2TE|2O1","☕","hot beverage","o|3|2TG|2TH|2O1","🫖","teapot","o|3|2TJ|2TK|2O1","🍵","teacup without handle","o|3|2TM|2TN|2O1","🍶","sake","o|3|2TP|2TQ|2O1","🍾","bottle with popping cork","o|3|2TS|2TT|2O1","🍷","wine glass","o|3|2TV|2TW|2O1","🍸","cocktail glass","o|3|2TY|2TZ|2O1","🍹","tropical drink","o|3|2Tb|2Tc|2O1","🍺","beer mug","o|3|2Te|2Tf|2O1","🍻","clinking beer mugs","o|3|2Th|2Ti|2O1","🥂","clinking glasses","o|3|2Tk|2Tl|2O1","🥃","tumbler glass","o|3|2Tn|2To|2O1","🫗","pouring liquid","o|3|2Tq|2Tr|2O1","🥤","cup with straw","o|3|2Tt|2Tu|2O1","🧋","bubble tea","o|3|2Tw|2Tx|2O1","🧃","beverage box","o|3|2Tz|2U0|2O1","🧉","mate","o|3|2U2|2U3|2O1","🧊","ice","o|3|2U5|2U6|2O1","🥢","chopsticks","o|3|2U8|2U9|2O1","🍽️","fork and knife with plate","o|3|2UB|2UC|2O1","🍽","o|3|2UE|2UC|2O1","🍴","fork and knife","o|3|2UG|2UH|2O1","🥄","spoon","o|3|2UJ|2UK|2O1","🔪","kitchen knife","o|3|2UM|2UN|2O1","🫙","jar","o|3|2UP|2UQ|2O1","🏺","amphora","o|3|2US|2UT|2O1","🌍","globe showing Europe-Africa","Travel & Places","o|3|2UV|2UW|2UX","🌎","globe showing Americas","o|3|2UZ|2Ua|2UX","🌏","globe showing Asia-Australia","o|3|2Uc|2Ud|2UX","🌐","globe with meridians","o|3|2Uf|2Ug|2UX","🗺️","world map","o|3|2Ui|2Uj|2UX","🗺","o|3|2Ul|2Uj|2UX","🗾","map of Japan","o|3|2Un|2Uo|2UX","🧭","compass","o|3|2Uq|2Ur|2UX","🏔️","snow-capped mountain","o|3|2Ut|2Uu|2UX","🏔","o|3|2Uw|2Uu|2UX","⛰️","mountain","o|3|2Uy|2Uz|2UX","⛰","o|3|2V1|2Uz|2UX","🌋","volcano","o|3|2V3|2V4|2UX","🗻","mount fuji","o|3|2V6|2V7|2UX","🏕️","camping","o|3|2V9|2VA|2UX","🏕","o|3|2VC|2VA|2UX","🏖️","beach with umbrella","o|3|2VE|2VF|2UX","🏖","o|3|2VH|2VF|2UX","🏜️","desert","o|3|2VJ|2VK|2UX","🏜","o|3|2VM|2VK|2UX","🏝️","desert island","o|3|2VO|2VP|2UX","🏝","o|3|2VR|2VP|2UX","🏞️","national park","o|3|2VT|2VU|2UX","🏞","o|3|2VW|2VU|2UX","🏟️","stadium","o|3|2VY|2VZ|2UX","🏟","o|3|2Vb|2VZ|2UX","🏛️","classical building","o|3|2Vd|2Ve|2UX","🏛","o|3|2Vg|2Ve|2UX","🏗️","building construction","o|3|2Vi|2Vj|2UX","🏗","o|3|2Vl|2Vj|2UX","🧱","brick","o|3|2Vn|2Vo|2UX","🪨","rock","o|3|2Vq|2Vr|2UX","🪵","wood","o|3|2Vt|2Vu|2UX","🛖","hut","o|3|2Vw|2Vx|2UX","🏘️","houses","o|3|2Vz|2W0|2UX","🏘","o|3|2W2|2W0|2UX","🏚️","derelict house","o|3|2W4|2W5|2UX","🏚","o|3|2W7|2W5|2UX","🏠","house","o|3|2W9|2WA|2UX","🏡","house with garden","o|3|2WC|2WD|2UX","🏢","office building","o|3|2WF|2WG|2UX","🏣","Japanese post office","o|3|2WI|2WJ|2UX","🏤","post office","o|3|2WL|2WM|2UX","🏥","hospital","o|3|2WO|2WP|2UX","🏦","bank","o|3|2WR|2WS|2UX","🏨","hotel","o|3|2WU|2WV|2UX","🏩","love hotel","o|3|2WX|2WY|2UX","🏪","convenience store","o|3|2Wa|2Wb|2UX","🏫","school","o|3|2Wd|2We|2UX","🏬","department store","o|3|2Wg|2Wh|2UX","🏭","factory","o|3|2Wj|2Wk|2UX","🏯","Japanese castle","o|3|2Wm|2Wn|2UX","🏰","castle","o|3|2Wp|2Wq|2UX","💒","wedding","o|3|2Ws|2Wt|2UX","🗼","Tokyo tower","o|3|2Wv|2Ww|2UX","🗽","Statue of Liberty","o|3|2Wy|2Wz|2UX","⛪","church","o|3|2X1|2X2|2UX","🕌","mosque","o|3|2X4|2X5|2UX","🛕","hindu temple","o|3|2X7|2X8|2UX","🕍","synagogue","o|3|2XA|2XB|2UX","⛩️","shinto shrine","o|3|2XD|2XE|2UX","⛩","o|3|2XG|2XE|2UX","🕋","kaaba","o|3|2XI|2XJ|2UX","⛲","fountain","o|3|2XL|2XM|2UX","⛺","tent","o|3|2XO|2XP|2UX","🌁","foggy","o|3|2XR|2XS|2UX","🌃","night with stars","o|3|2XU|2XV|2UX","🏙️","cityscape","o|3|2XX|2XY|2UX","🏙","o|3|2Xa|2XY|2UX","🌄","sunrise over mountains","o|3|2Xc|2Xd|2UX","🌅","sunrise","o|3|2Xf|2Xg|2UX","🌆","cityscape at dusk","o|3|2Xi|2Xj|2UX","🌇","sunset","o|3|2Xl|2Xm|2UX","🌉","bridge at night","o|3|2Xo|2Xp|2UX","♨️","hot springs","o|3|2Xr|2Xs|2UX","♨","o|3|2Xu|2Xs|2UX","🎠","carousel horse","o|3|2Xw|2Xx|2UX","🛝","playground slide","o|3|2Xz|2Y0|2UX","🎡","ferris wheel","o|3|2Y2|2Y3|2UX","🎢","roller coaster","o|3|2Y5|2Y6|2UX","💈","barber pole","o|3|2Y8|2Y9|2UX","🎪","circus tent","o|3|2YB|2YC|2UX","🚂","locomotive","o|3|2YE|2YF|2UX","🚃","railway car","o|3|2YH|2YI|2UX","🚄","high-speed train","o|3|2YK|2YL|2UX","🚅","bullet train","o|3|2YN|2YO|2UX","🚆","train","o|3|2YQ|2YR|2UX","🚇","metro","o|3|2YT|2YU|2UX","🚈","light rail","o|3|2YW|2YX|2UX","🚉","station","o|3|2YZ|2Ya|2UX","🚊","tram","o|3|2Yc|2Yd|2UX","🚝","monorail","o|3|2Yf|2Yg|2UX","🚞","mountain railway","o|3|2Yi|2Yj|2UX","🚋","tram car","o|3|2Yl|2Ym|2UX","🚌","bus","o|3|2Yo|2Yp|2UX","🚍","oncoming bus","o|3|2Yr|2Ys|2UX","🚎","trolleybus","o|3|2Yu|2Yv|2UX","🚐","minibus","o|3|2Yx|2Yy|2UX","🚑","ambulance","o|3|2Z0|2Z1|2UX","🚒","fire engine","o|3|2Z3|2Z4|2UX","🚓","police car","o|3|2Z6|2Z7|2UX","🚔","oncoming police car","o|3|2Z9|2ZA|2UX","🚕","taxi","o|3|2ZC|2ZD|2UX","🚖","oncoming taxi","o|3|2ZF|2ZG|2UX","🚗","automobile","o|3|2ZI|2ZJ|2UX","🚘","oncoming automobile","o|3|2ZL|2ZM|2UX","🚙","sport utility vehicle","o|3|2ZO|2ZP|2UX","🛻","pickup truck","o|3|2ZR|2ZS|2UX","🚚","delivery truck","o|3|2ZU|2ZV|2UX","🚛","articulated lorry","o|3|2ZX|2ZY|2UX","🚜","tractor","o|3|2Za|2Zb|2UX","🏎️","racing car","o|3|2Zd|2Ze|2UX","🏎","o|3|2Zg|2Ze|2UX","🏍️","motorcycle","o|3|2Zi|2Zj|2UX","🏍","o|3|2Zl|2Zj|2UX","🛵","motor scooter","o|3|2Zn|2Zo|2UX","🦽","manual wheelchair","o|3|2Zq|2Zr|2UX","🦼","motorized wheelchair","o|3|2Zt|2Zu|2UX","🛺","auto rickshaw","o|3|2Zw|2Zx|2UX","🚲","bicycle","o|3|2Zz|2a0|2UX","🛴","kick scooter","o|3|2a2|2a3|2UX","🛹","skateboard","o|3|2a5|2a6|2UX","🛼","roller skate","o|3|2a8|2a9|2UX","🚏","bus stop","o|3|2aB|2aC|2UX","🛣️","motorway","o|3|2aE|2aF|2UX","🛣","o|3|2aH|2aF|2UX","🛤️","railway track","o|3|2aJ|2aK|2UX","🛤","o|3|2aM|2aK|2UX","🛢️","oil drum","o|3|2aO|2aP|2UX","🛢","o|3|2aR|2aP|2UX","⛽","fuel pump","o|3|2aT|2aU|2UX","🛞","wheel","o|3|2aW|2aX|2UX","🚨","police car light","o|3|2aZ|2aa|2UX","🚥","horizontal traffic light","o|3|2ac|2ad|2UX","🚦","vertical traffic light","o|3|2af|2ag|2UX","🛑","stop sign","o|3|2ai|2aj|2UX","🚧","construction","o|3|2al|2am|2UX","⚓","anchor","o|3|2ao|2ap|2UX","🛟","ring buoy","o|3|2ar|2as|2UX","⛵","sailboat","o|3|2au|2av|2UX","🛶","canoe","o|3|2ax|2ay|2UX","🚤","speedboat","o|3|2b0|2b1|2UX","🛳️","passenger ship","o|3|2b3|2b4|2UX","🛳","o|3|2b6|2b4|2UX","⛴️","ferry","o|3|2b8|2b9|2UX","⛴","o|3|2bB|2b9|2UX","🛥️","motor boat","o|3|2bD|2bE|2UX","🛥","o|3|2bG|2bE|2UX","🚢","ship","o|3|2bI|2bJ|2UX","✈️","airplane","o|3|2bL|2bM|2UX","✈","o|3|2bO|2bM|2UX","🛩️","small airplane","o|3|2bQ|2bR|2UX","🛩","o|3|2bT|2bR|2UX","🛫","airplane departure","o|3|2bV|2bW|2UX","🛬","airplane arrival","o|3|2bY|2bZ|2UX","🪂","parachute","o|3|2bb|2bc|2UX","💺","seat","o|3|2be|2bf|2UX","🚁","helicopter","o|3|2bh|2bi|2UX","🚟","suspension railway","o|3|2bk|2bl|2UX","🚠","mountain cableway","o|3|2bn|2bo|2UX","🚡","aerial tramway","o|3|2bq|2br|2UX","🛰️","satellite","o|3|2bt|2bu|2UX","🛰","o|3|2bw|2bu|2UX","🚀","rocket","o|3|2by|2bz|2UX","🛸","flying saucer","o|3|2c1|2c2|2UX","🛎️","bellhop bell","o|3|2c4|2c5|2UX","🛎","o|3|2c7|2c5|2UX","🧳","luggage","o|3|2c9|2cA|2UX","⌛","hourglass done","o|3|2cC|2cD|2UX","⏳","hourglass not done","o|3|2cF|2cG|2UX","⌚","watch","o|3|2cI|2cJ|2UX","⏰","alarm clock","o|3|2cL|2cM|2UX","⏱️","stopwatch","o|3|2cO|2cP|2UX","⏱","o|3|2cR|2cP|2UX","⏲️","timer clock","o|3|2cT|2cU|2UX","⏲","o|3|2cW|2cU|2UX","🕰️","mantelpiece clock","o|3|2cY|2cZ|2UX","🕰","o|3|2cb|2cZ|2UX","🕛","twelve o’clock","o|3|2cd|2ce|2UX","🕧","twelve-thirty","o|3|2cg|2ch|2UX","🕐","one o’clock","o|3|2cj|2ck|2UX","🕜","one-thirty","o|3|2cm|2cn|2UX","🕑","two o’clock","o|3|2cp|2cq|2UX","🕝","two-thirty","o|3|2cs|2ct|2UX","🕒","three o’clock","o|3|2cv|2cw|2UX","🕞","three-thirty","o|3|2cy|2cz|2UX","🕓","four o’clock","o|3|2d1|2d2|2UX","🕟","four-thirty","o|3|2d4|2d5|2UX","🕔","five o’clock","o|3|2d7|2d8|2UX","🕠","five-thirty","o|3|2dA|2dB|2UX","🕕","six o’clock","o|3|2dD|2dE|2UX","🕡","six-thirty","o|3|2dG|2dH|2UX","🕖","seven o’clock","o|3|2dJ|2dK|2UX","🕢","seven-thirty","o|3|2dM|2dN|2UX","🕗","eight o’clock","o|3|2dP|2dQ|2UX","🕣","eight-thirty","o|3|2dS|2dT|2UX","🕘","nine o’clock","o|3|2dV|2dW|2UX","🕤","nine-thirty","o|3|2dY|2dZ|2UX","🕙","ten o’clock","o|3|2db|2dc|2UX","🕥","ten-thirty","o|3|2de|2df|2UX","🕚","eleven o’clock","o|3|2dh|2di|2UX","🕦","eleven-thirty","o|3|2dk|2dl|2UX","🌑","new moon","o|3|2dn|2do|2UX","🌒","waxing crescent moon","o|3|2dq|2dr|2UX","🌓","first quarter moon","o|3|2dt|2du|2UX","🌔","waxing gibbous moon","o|3|2dw|2dx|2UX","🌕","full moon","o|3|2dz|2e0|2UX","🌖","waning gibbous moon","o|3|2e2|2e3|2UX","🌗","last quarter moon","o|3|2e5|2e6|2UX","🌘","waning crescent moon","o|3|2e8|2e9|2UX","🌙","crescent moon","o|3|2eB|2eC|2UX","🌚","new moon face","o|3|2eE|2eF|2UX","🌛","first quarter moon face","o|3|2eH|2eI|2UX","🌜","last quarter moon face","o|3|2eK|2eL|2UX","🌡️","thermometer","o|3|2eN|2eO|2UX","🌡","o|3|2eQ|2eO|2UX","☀️","sun","o|3|2eS|2eT|2UX","☀","o|3|2eV|2eT|2UX","🌝","full moon face","o|3|2eX|2eY|2UX","🌞","sun with face","o|3|2ea|2eb|2UX","🪐","ringed planet","o|3|2ed|2ee|2UX","⭐","star","o|3|2eg|2eh|2UX","🌟","glowing star","o|3|2ej|2ek|2UX","🌠","shooting star","o|3|2em|2en|2UX","🌌","milky way","o|3|2ep|2eq|2UX","☁️","cloud","o|3|2es|2et|2UX","☁","o|3|2ev|2et|2UX","⛅","sun behind cloud","o|3|2ex|2ey|2UX","⛈️","cloud with lightning and rain","o|3|2f0|2f1|2UX","⛈","o|3|2f3|2f1|2UX","🌤️","sun behind small cloud","o|3|2f5|2f6|2UX","🌤","o|3|2f8|2f6|2UX","🌥️","sun behind large cloud","o|3|2fA|2fB|2UX","🌥","o|3|2fD|2fB|2UX","🌦️","sun behind rain cloud","o|3|2fF|2fG|2UX","🌦","o|3|2fI|2fG|2UX","🌧️","cloud with rain","o|3|2fK|2fL|2UX","🌧","o|3|2fN|2fL|2UX","🌨️","cloud with snow","o|3|2fP|2fQ|2UX","🌨","o|3|2fS|2fQ|2UX","🌩️","cloud with lightning","o|3|2fU|2fV|2UX","🌩","o|3|2fX|2fV|2UX","🌪️","tornado","o|3|2fZ|2fa|2UX","🌪","o|3|2fc|2fa|2UX","🌫️","fog","o|3|2fe|2ff|2UX","🌫","o|3|2fh|2ff|2UX","🌬️","wind face","o|3|2fj|2fk|2UX","🌬","o|3|2fm|2fk|2UX","🌀","cyclone","o|3|2fo|2fp|2UX","🌈","rainbow","o|3|2fr|2fs|2UX","🌂","closed umbrella","o|3|2fu|2fv|2UX","☂️","umbrella","o|3|2fx|2fy|2UX","☂","o|3|2g0|2fy|2UX","☔","umbrella with rain drops","o|3|2g2|2g3|2UX","⛱️","umbrella on ground","o|3|2g5|2g6|2UX","⛱","o|3|2g8|2g6|2UX","⚡","high voltage","o|3|2gA|2gB|2UX","❄️","snowflake","o|3|2gD|2gE|2UX","❄","o|3|2gG|2gE|2UX","☃️","snowman","o|3|2gI|2gJ|2UX","☃","o|3|2gL|2gJ|2UX","⛄","snowman without snow","o|3|2gN|2gO|2UX","☄️","comet","o|3|2gQ|2gR|2UX","☄","o|3|2gT|2gR|2UX","🔥","fire","o|3|2gV|2gW|2UX","💧","droplet","o|3|2gY|2gZ|2UX","🌊","water wave","o|3|2gb|2gc|2UX","🎃","jack-o-lantern","Activities","o|3|2ge|2gf|2gg","🎄","Christmas tree","o|3|2gi|2gj|2gg","🎆","fireworks","o|3|2gl|2gm|2gg","🎇","sparkler","o|3|2go|2gp|2gg","🧨","firecracker","o|3|2gr|2gs|2gg","✨","sparkles","o|3|2gu|2gv|2gg","🎈","balloon","o|3|2gx|2gy|2gg","🎉","party popper","o|3|2h0|2h1|2gg","🎊","confetti ball","o|3|2h3|2h4|2gg","🎋","tanabata tree","o|3|2h6|2h7|2gg","🎍","pine decoration","o|3|2h9|2hA|2gg","🎎","Japanese dolls","o|3|2hC|2hD|2gg","🎏","carp streamer","o|3|2hF|2hG|2gg","🎐","wind chime","o|3|2hI|2hJ|2gg","🎑","moon viewing ceremony","o|3|2hL|2hM|2gg","🧧","red envelope","o|3|2hO|2hP|2gg","🎀","ribbon","o|3|2hR|2hS|2gg","🎁","wrapped gift","o|3|2hU|2hV|2gg","🎗️","reminder ribbon","o|3|2hX|2hY|2gg","🎗","o|3|2ha|2hY|2gg","🎟️","admission tickets","o|3|2hc|2hd|2gg","🎟","o|3|2hf|2hd|2gg","🎫","ticket","o|3|2hh|2hi|2gg","🎖️","military medal","o|3|2hk|2hl|2gg","🎖","o|3|2hn|2hl|2gg","🏆","trophy","o|3|2hp|2hq|2gg","🏅","sports medal","o|3|2hs|2ht|2gg","🥇","1st place medal","o|3|2hv|2hw|2gg","🥈","2nd place medal","o|3|2hy|2hz|2gg","🥉","3rd place medal","o|3|2i1|2i2|2gg","⚽","soccer ball","o|3|2i4|2i5|2gg","⚾","baseball","o|3|2i7|2i8|2gg","🥎","softball","o|3|2iA|2iB|2gg","🏀","basketball","o|3|2iD|2iE|2gg","🏐","volleyball","o|3|2iG|2iH|2gg","🏈","american football","o|3|2iJ|2iK|2gg","🏉","rugby football","o|3|2iM|2iN|2gg","🎾","tennis","o|3|2iP|2iQ|2gg","🥏","flying disc","o|3|2iS|2iT|2gg","🎳","bowling","o|3|2iV|2iW|2gg","🏏","cricket game","o|3|2iY|2iZ|2gg","🏑","field hockey","o|3|2ib|2ic|2gg","🏒","ice hockey","o|3|2ie|2if|2gg","🥍","lacrosse","o|3|2ih|2ii|2gg","🏓","ping pong","o|3|2ik|2il|2gg","🏸","badminton","o|3|2in|2io|2gg","🥊","boxing glove","o|3|2iq|2ir|2gg","🥋","martial arts uniform","o|3|2it|2iu|2gg","🥅","goal net","o|3|2iw|2ix|2gg","⛳","flag in hole","o|3|2iz|2j0|2gg","⛸️","ice skate","o|3|2j2|2j3|2gg","⛸","o|3|2j5|2j3|2gg","🎣","fishing pole","o|3|2j7|2j8|2gg","🤿","diving mask","o|3|2jA|2jB|2gg","🎽","running shirt","o|3|2jD|2jE|2gg","🎿","skis","o|3|2jG|2jH|2gg","🛷","sled","o|3|2jJ|2jK|2gg","🥌","curling stone","o|3|2jM|2jN|2gg","🎯","bullseye","o|3|2jP|2jQ|2gg","🪀","yo-yo","o|3|2jS|2jT|2gg","🪁","kite","o|3|2jV|2jW|2gg","🔫","water pistol","o|3|2jY|2jZ|2gg","🎱","pool 8 ball","o|3|2jb|2jc|2gg","🔮","crystal ball","o|3|2je|2jf|2gg","🪄","magic wand","o|3|2jh|2ji|2gg","🎮","video game","o|3|2jk|2jl|2gg","🕹️","joystick","o|3|2jn|2jo|2gg","🕹","o|3|2jq|2jo|2gg","🎰","slot machine","o|3|2js|2jt|2gg","🎲","game die","o|3|2jv|2jw|2gg","🧩","puzzle piece","o|3|2jy|2jz|2gg","🧸","teddy bear","o|3|2k1|2k2|2gg","🪅","piñata","o|3|2k4|2k5|2gg","🪩","mirror ball","o|3|2k7|2k8|2gg","🪆","nesting dolls","o|3|2kA|2kB|2gg","♠️","spade suit","o|3|2kD|2kE|2gg","♠","o|3|2kG|2kE|2gg","♥️","heart suit","o|3|2kI|2kJ|2gg","♥","o|3|2kL|2kJ|2gg","♦️","diamond suit","o|3|2kN|2kO|2gg","♦","o|3|2kQ|2kO|2gg","♣️","club suit","o|3|2kS|2kT|2gg","♣","o|3|2kV|2kT|2gg","♟️","chess pawn","o|3|2kX|2kY|2gg","♟","o|3|2ka|2kY|2gg","🃏","joker","o|3|2kc|2kd|2gg","🀄","mahjong red dragon","o|3|2kf|2kg|2gg","🎴","flower playing cards","o|3|2ki|2kj|2gg","🎭","performing arts","o|3|2kl|2km|2gg","🖼️","framed picture","o|3|2ko|2kp|2gg","🖼","o|3|2kr|2kp|2gg","🎨","artist palette","o|3|2kt|2ku|2gg","🧵","thread","o|3|2kw|2kx|2gg","🪡","sewing needle","o|3|2kz|2l0|2gg","🧶","yarn","o|3|2l2|2l3|2gg","🪢","knot","o|3|2l5|2l6|2gg","👓","glasses","Objects","o|3|2l8|2l9|2lA","🕶️","sunglasses","o|3|2lC|2lD|2lA","🕶","o|3|2lF|2lD|2lA","🥽","goggles","o|3|2lH|2lI|2lA","🥼","lab coat","o|3|2lK|2lL|2lA","🦺","safety vest","o|3|2lN|2lO|2lA","👔","necktie","o|3|2lQ|2lR|2lA","👕","t-shirt","o|3|2lT|2lU|2lA","👖","jeans","o|3|2lW|2lX|2lA","🧣","scarf","o|3|2lZ|2la|2lA","🧤","gloves","o|3|2lc|2ld|2lA","🧥","coat","o|3|2lf|2lg|2lA","🧦","socks","o|3|2li|2lj|2lA","👗","dress","o|3|2ll|2lm|2lA","👘","kimono","o|3|2lo|2lp|2lA","🥻","sari","o|3|2lr|2ls|2lA","🩱","one-piece swimsuit","o|3|2lu|2lv|2lA","🩲","briefs","o|3|2lx|2ly|2lA","🩳","shorts","o|3|2m0|2m1|2lA","👙","bikini","o|3|2m3|2m4|2lA","👚","woman’s clothes","o|3|2m6|2m7|2lA","🪭","folding hand fan","o|3|2m9|2mA|2lA","👛","purse","o|3|2mC|2mD|2lA","👜","handbag","o|3|2mF|2mG|2lA","👝","clutch bag","o|3|2mI|2mJ|2lA","🛍️","shopping bags","o|3|2mL|2mM|2lA","🛍","o|3|2mO|2mM|2lA","🎒","backpack","o|3|2mQ|2mR|2lA","🩴","thong sandal","o|3|2mT|2mU|2lA","👞","man’s shoe","o|3|2mW|2mX|2lA","👟","running shoe","o|3|2mZ|2ma|2lA","🥾","hiking boot","o|3|2mc|2md|2lA","🥿","flat shoe","o|3|2mf|2mg|2lA","👠","high-heeled shoe","o|3|2mi|2mj|2lA","👡","woman’s sandal","o|3|2ml|2mm|2lA","🩰","ballet shoes","o|3|2mo|2mp|2lA","👢","woman’s boot","o|3|2mr|2ms|2lA","🪮","hair pick","o|3|2mu|2mv|2lA","👑","crown","o|3|2mx|2my|2lA","👒","woman’s hat","o|3|2n0|2n1|2lA","🎩","top hat","o|3|2n3|2n4|2lA","🎓","graduation cap","o|3|2n6|2n7|2lA","🧢","billed cap","o|3|2n9|2nA|2lA","🪖","military helmet","o|3|2nC|2nD|2lA","⛑️","rescue worker’s helmet","o|3|2nF|2nG|2lA","⛑","o|3|2nI|2nG|2lA","📿","prayer beads","o|3|2nK|2nL|2lA","💄","lipstick","o|3|2nN|2nO|2lA","💍","ring","o|3|2nQ|2nR|2lA","💎","gem stone","o|3|2nT|2nU|2lA","🔇","muted speaker","o|3|2nW|2nX|2lA","🔈","speaker low volume","o|3|2nZ|2na|2lA","🔉","speaker medium volume","o|3|2nc|2nd|2lA","🔊","speaker high volume","o|3|2nf|2ng|2lA","📢","loudspeaker","o|3|2ni|2nj|2lA","📣","megaphone","o|3|2nl|2nm|2lA","📯","postal horn","o|3|2no|2np|2lA","🔔","bell","o|3|2nr|2ns|2lA","🔕","bell with slash","o|3|2nu|2nv|2lA","🎼","musical score","o|3|2nx|2ny|2lA","🎵","musical note","o|3|2o0|2o1|2lA","🎶","musical notes","o|3|2o3|2o4|2lA","🎙️","studio microphone","o|3|2o6|2o7|2lA","🎙","o|3|2o9|2o7|2lA","🎚️","level slider","o|3|2oB|2oC|2lA","🎚","o|3|2oE|2oC|2lA","🎛️","control knobs","o|3|2oG|2oH|2lA","🎛","o|3|2oJ|2oH|2lA","🎤","microphone","o|3|2oL|2oM|2lA","🎧","headphone","o|3|2oO|2oP|2lA","📻","radio","o|3|2oR|2oS|2lA","🎷","saxophone","o|3|2oU|2oV|2lA","🪗","accordion","o|3|2oX|2oY|2lA","🎸","guitar","o|3|2oa|2ob|2lA","🎹","musical keyboard","o|3|2od|2oe|2lA","🎺","trumpet","o|3|2og|2oh|2lA","🎻","violin","o|3|2oj|2ok|2lA","🪕","banjo","o|3|2om|2on|2lA","🥁","drum","o|3|2op|2oq|2lA","🪘","long drum","o|3|2os|2ot|2lA","🪇","maracas","o|3|2ov|2ow|2lA","🪈","flute","o|3|2oy|2oz|2lA","📱","mobile phone","o|3|2p1|2p2|2lA","📲","mobile phone with arrow","o|3|2p4|2p5|2lA","☎️","telephone","o|3|2p7|2p8|2lA","☎","o|3|2pA|2p8|2lA","📞","telephone receiver","o|3|2pC|2pD|2lA","📟","pager","o|3|2pF|2pG|2lA","📠","fax machine","o|3|2pI|2pJ|2lA","🔋","battery","o|3|2pL|2pM|2lA","🪫","low battery","o|3|2pO|2pP|2lA","🔌","electric plug","o|3|2pR|2pS|2lA","💻","laptop","o|3|2pU|2pV|2lA","🖥️","desktop computer","o|3|2pX|2pY|2lA","🖥","o|3|2pa|2pY|2lA","🖨️","printer","o|3|2pc|2pd|2lA","🖨","o|3|2pf|2pd|2lA","⌨️","keyboard","o|3|2ph|2pi|2lA","⌨","o|3|2pk|2pi|2lA","🖱️","computer mouse","o|3|2pm|2pn|2lA","🖱","o|3|2pp|2pn|2lA","🖲️","trackball","o|3|2pr|2ps|2lA","🖲","o|3|2pu|2ps|2lA","💽","computer disk","o|3|2pw|2px|2lA","💾","floppy disk","o|3|2pz|2q0|2lA","💿","optical disk","o|3|2q2|2q3|2lA","📀","dvd","o|3|2q5|2q6|2lA","🧮","abacus","o|3|2q8|2q9|2lA","🎥","movie camera","o|3|2qB|2qC|2lA","🎞️","film frames","o|3|2qE|2qF|2lA","🎞","o|3|2qH|2qF|2lA","📽️","film projector","o|3|2qJ|2qK|2lA","📽","o|3|2qM|2qK|2lA","🎬","clapper board","o|3|2qO|2qP|2lA","📺","television","o|3|2qR|2qS|2lA","📷","camera","o|3|2qU|2qV|2lA","📸","camera with flash","o|3|2qX|2qY|2lA","📹","video camera","o|3|2qa|2qb|2lA","📼","videocassette","o|3|2qd|2qe|2lA","🔍","magnifying glass tilted left","o|3|2qg|2qh|2lA","🔎","magnifying glass tilted right","o|3|2qj|2qk|2lA","🕯️","candle","o|3|2qm|2qn|2lA","🕯","o|3|2qp|2qn|2lA","💡","light bulb","o|3|2qr|2qs|2lA","🔦","flashlight","o|3|2qu|2qv|2lA","🏮","red paper lantern","o|3|2qx|2qy|2lA","🪔","diya lamp","o|3|2r0|2r1|2lA","📔","notebook with decorative cover","o|3|2r3|2r4|2lA","📕","closed book","o|3|2r6|2r7|2lA","📖","open book","o|3|2r9|2rA|2lA","📗","green book","o|3|2rC|2rD|2lA","📘","blue book","o|3|2rF|2rG|2lA","📙","orange book","o|3|2rI|2rJ|2lA","📚","books","o|3|2rL|2rM|2lA","📓","notebook","o|3|2rO|2rP|2lA","📒","ledger","o|3|2rR|2rS|2lA","📃","page with curl","o|3|2rU|2rV|2lA","📜","scroll","o|3|2rX|2rY|2lA","📄","page facing up","o|3|2ra|2rb|2lA","📰","newspaper","o|3|2rd|2re|2lA","🗞️","rolled-up newspaper","o|3|2rg|2rh|2lA","🗞","o|3|2rj|2rh|2lA","📑","bookmark tabs","o|3|2rl|2rm|2lA","🔖","bookmark","o|3|2ro|2rp|2lA","🏷️","label","o|3|2rr|2rs|2lA","🏷","o|3|2ru|2rs|2lA","💰","money bag","o|3|2rw|2rx|2lA","🪙","coin","o|3|2rz|2s0|2lA","💴","yen banknote","o|3|2s2|2s3|2lA","💵","dollar banknote","o|3|2s5|2s6|2lA","💶","euro banknote","o|3|2s8|2s9|2lA","💷","pound banknote","o|3|2sB|2sC|2lA","💸","money with wings","o|3|2sE|2sF|2lA","💳","credit card","o|3|2sH|2sI|2lA","🧾","receipt","o|3|2sK|2sL|2lA","💹","chart increasing with yen","o|3|2sN|2sO|2lA","✉️","envelope","o|3|2sQ|2sR|2lA","✉","o|3|2sT|2sR|2lA","📧","e-mail","o|3|2sV|2sW|2lA","📨","incoming envelope","o|3|2sY|2sZ|2lA","📩","envelope with arrow","o|3|2sb|2sc|2lA","📤","outbox tray","o|3|2se|2sf|2lA","📥","inbox tray","o|3|2sh|2si|2lA","📦","package","o|3|2sk|2sl|2lA","📫","closed mailbox with raised flag","o|3|2sn|2so|2lA","📪","closed mailbox with lowered flag","o|3|2sq|2sr|2lA","📬","open mailbox with raised flag","o|3|2st|2su|2lA","📭","open mailbox with lowered flag","o|3|2sw|2sx|2lA","📮","postbox","o|3|2sz|2t0|2lA","🗳️","ballot box with ballot","o|3|2t2|2t3|2lA","🗳","o|3|2t5|2t3|2lA","✏️","pencil","o|3|2t7|2t8|2lA","✏","o|3|2tA|2t8|2lA","✒️","black nib","o|3|2tC|2tD|2lA","✒","o|3|2tF|2tD|2lA","🖋️","fountain pen","o|3|2tH|2tI|2lA","🖋","o|3|2tK|2tI|2lA","🖊️","pen","o|3|2tM|2tN|2lA","🖊","o|3|2tP|2tN|2lA","🖌️","paintbrush","o|3|2tR|2tS|2lA","🖌","o|3|2tU|2tS|2lA","🖍️","crayon","o|3|2tW|2tX|2lA","🖍","o|3|2tZ|2tX|2lA","📝","memo","o|3|2tb|2tc|2lA","💼","briefcase","o|3|2te|2tf|2lA","📁","file folder","o|3|2th|2ti|2lA","📂","open file folder","o|3|2tk|2tl|2lA","🗂️","card index dividers","o|3|2tn|2to|2lA","🗂","o|3|2tq|2to|2lA","📅","calendar","o|3|2ts|2tt|2lA","📆","tear-off calendar","o|3|2tv|2tw|2lA","🗒️","spiral notepad","o|3|2ty|2tz|2lA","🗒","o|3|2u1|2tz|2lA","🗓️","spiral calendar","o|3|2u3|2u4|2lA","🗓","o|3|2u6|2u4|2lA","📇","card index","o|3|2u8|2u9|2lA","📈","chart increasing","o|3|2uB|2uC|2lA","📉","chart decreasing","o|3|2uE|2uF|2lA","📊","bar chart","o|3|2uH|2uI|2lA","📋","clipboard","o|3|2uK|2uL|2lA","📌","pushpin","o|3|2uN|2uO|2lA","📍","round pushpin","o|3|2uQ|2uR|2lA","📎","paperclip","o|3|2uT|2uU|2lA","🖇️","linked paperclips","o|3|2uW|2uX|2lA","🖇","o|3|2uZ|2uX|2lA","📏","straight ruler","o|3|2ub|2uc|2lA","📐","triangular ruler","o|3|2ue|2uf|2lA","✂️","scissors","o|3|2uh|2ui|2lA","✂","o|3|2uk|2ui|2lA","🗃️","card file box","o|3|2um|2un|2lA","🗃","o|3|2up|2un|2lA","🗄️","file cabinet","o|3|2ur|2us|2lA","🗄","o|3|2uu|2us|2lA","🗑️","wastebasket","o|3|2uw|2ux|2lA","🗑","o|3|2uz|2ux|2lA","🔒","locked","o|3|2v1|2v2|2lA","🔓","unlocked","o|3|2v4|2v5|2lA","🔏","locked with pen","o|3|2v7|2v8|2lA","🔐","locked with key","o|3|2vA|2vB|2lA","🔑","key","o|3|2vD|2vE|2lA","🗝️","old key","o|3|2vG|2vH|2lA","🗝","o|3|2vJ|2vH|2lA","🔨","hammer","o|3|2vL|2vM|2lA","🪓","axe","o|3|2vO|2vP|2lA","⛏️","pick","o|3|2vR|2vS|2lA","⛏","o|3|2vU|2vS|2lA","⚒️","hammer and pick","o|3|2vW|2vX|2lA","⚒","o|3|2vZ|2vX|2lA","🛠️","hammer and wrench","o|3|2vb|2vc|2lA","🛠","o|3|2ve|2vc|2lA","🗡️","dagger","o|3|2vg|2vh|2lA","🗡","o|3|2vj|2vh|2lA","⚔️","crossed swords","o|3|2vl|2vm|2lA","⚔","o|3|2vo|2vm|2lA","💣","bomb","o|3|2vq|2vr|2lA","🪃","boomerang","o|3|2vt|2vu|2lA","🏹","bow and arrow","o|3|2vw|2vx|2lA","🛡️","shield","o|3|2vz|2w0|2lA","🛡","o|3|2w2|2w0|2lA","🪚","carpentry saw","o|3|2w4|2w5|2lA","🔧","wrench","o|3|2w7|2w8|2lA","🪛","screwdriver","o|3|2wA|2wB|2lA","🔩","nut and bolt","o|3|2wD|2wE|2lA","⚙️","gear","o|3|2wG|2wH|2lA","⚙","o|3|2wJ|2wH|2lA","🗜️","clamp","o|3|2wL|2wM|2lA","🗜","o|3|2wO|2wM|2lA","⚖️","balance scale","o|3|2wQ|2wR|2lA","⚖","o|3|2wT|2wR|2lA","🦯","white cane","o|3|2wV|2wW|2lA","🔗","link","o|3|2wY|2wZ|2lA","⛓️","chains","o|3|2wb|2wc|2lA","⛓","o|3|2we|2wc|2lA","🪝","hook","o|3|2wg|2wh|2lA","🧰","toolbox","o|3|2wj|2wk|2lA","🧲","magnet","o|3|2wm|2wn|2lA","🪜","ladder","o|3|2wp|2wq|2lA","⚗️","alembic","o|3|2ws|2wt|2lA","⚗","o|3|2wv|2wt|2lA","🧪","test tube","o|3|2wx|2wy|2lA","🧫","petri dish","o|3|2x0|2x1|2lA","🧬","dna","o|3|2x3|2x4|2lA","🔬","microscope","o|3|2x6|2x7|2lA","🔭","telescope","o|3|2x9|2xA|2lA","📡","satellite antenna","o|3|2xC|2xD|2lA","💉","syringe","o|3|2xF|2xG|2lA","🩸","drop of blood","o|3|2xI|2xJ|2lA","💊","pill","o|3|2xL|2xM|2lA","🩹","adhesive bandage","o|3|2xO|2xP|2lA","🩼","crutch","o|3|2xR|2xS|2lA","🩺","stethoscope","o|3|2xU|2xV|2lA","🩻","x-ray","o|3|2xX|2xY|2lA","🚪","door","o|3|2xa|2xb|2lA","🛗","elevator","o|3|2xd|2xe|2lA","🪞","mirror","o|3|2xg|2xh|2lA","🪟","window","o|3|2xj|2xk|2lA","🛏️","bed","o|3|2xm|2xn|2lA","🛏","o|3|2xp|2xn|2lA","🛋️","couch and lamp","o|3|2xr|2xs|2lA","🛋","o|3|2xu|2xs|2lA","🪑","chair","o|3|2xw|2xx|2lA","🚽","toilet","o|3|2xz|2y0|2lA","🪠","plunger","o|3|2y2|2y3|2lA","🚿","shower","o|3|2y5|2y6|2lA","🛁","bathtub","o|3|2y8|2y9|2lA","🪤","mouse trap","o|3|2yB|2yC|2lA","🪒","razor","o|3|2yE|2yF|2lA","🧴","lotion bottle","o|3|2yH|2yI|2lA","🧷","safety pin","o|3|2yK|2yL|2lA","🧹","broom","o|3|2yN|2yO|2lA","🧺","basket","o|3|2yQ|2yR|2lA","🧻","roll of paper","o|3|2yT|2yU|2lA","🪣","bucket","o|3|2yW|2yX|2lA","🧼","soap","o|3|2yZ|2ya|2lA","🫧","bubbles","o|3|2yc|2yd|2lA","🪥","toothbrush","o|3|2yf|2yg|2lA","🧽","sponge","o|3|2yi|2yj|2lA","🧯","fire extinguisher","o|3|2yl|2ym|2lA","🛒","shopping cart","o|3|2yo|2yp|2lA","🚬","cigarette","o|3|2yr|2ys|2lA","⚰️","coffin","o|3|2yu|2yv|2lA","⚰","o|3|2yx|2yv|2lA","🪦","headstone","o|3|2yz|2z0|2lA","⚱️","funeral urn","o|3|2z2|2z3|2lA","⚱","o|3|2z5|2z3|2lA","🧿","nazar amulet","o|3|2z7|2z8|2lA","🪬","hamsa","o|3|2zA|2zB|2lA","🗿","moai","o|3|2zD|2zE|2lA","🪧","placard","o|3|2zG|2zH|2lA","🪪","identification card","o|3|2zJ|2zK|2lA","🏧","ATM sign","Symbols","o|3|2zM|2zN|2zO","🚮","litter in bin sign","o|3|2zQ|2zR|2zO","🚰","potable water","o|3|2zT|2zU|2zO","♿","wheelchair symbol","o|3|2zW|2zX|2zO","🚹","men’s room","o|3|2zZ|2za|2zO","🚺","women’s room","o|3|2zc|2zd|2zO","🚻","restroom","o|3|2zf|2zg|2zO","🚼","baby symbol","o|3|2zi|2zj|2zO","🚾","water closet","o|3|2zl|2zm|2zO","🛂","passport control","o|3|2zo|2zp|2zO","🛃","customs","o|3|2zr|2zs|2zO","🛄","baggage claim","o|3|2zu|2zv|2zO","🛅","left luggage","o|3|2zx|2zy|2zO","⚠️","warning","o|3|300|301|2zO","⚠","o|3|303|301|2zO","🚸","children crossing","o|3|305|306|2zO","⛔","no entry","o|3|308|309|2zO","🚫","prohibited","o|3|30B|30C|2zO","🚳","no bicycles","o|3|30E|30F|2zO","🚭","no smoking","o|3|30H|30I|2zO","🚯","no littering","o|3|30K|30L|2zO","🚱","non-potable water","o|3|30N|30O|2zO","🚷","no pedestrians","o|3|30Q|30R|2zO","📵","no mobile phones","o|3|30T|30U|2zO","🔞","no one under eighteen","o|3|30W|30X|2zO","☢️","radioactive","o|3|30Z|30a|2zO","☢","o|3|30c|30a|2zO","☣️","biohazard","o|3|30e|30f|2zO","☣","o|3|30h|30f|2zO","⬆️","up arrow","o|3|30j|30k|2zO","⬆","o|3|30m|30k|2zO","↗️","up-right arrow","o|3|30o|30p|2zO","↗","o|3|30r|30p|2zO","➡️","right arrow","o|3|30t|30u|2zO","➡","o|3|30w|30u|2zO","↘️","down-right arrow","o|3|30y|30z|2zO","↘","o|3|311|30z|2zO","⬇️","down arrow","o|3|313|314|2zO","⬇","o|3|316|314|2zO","↙️","down-left arrow","o|3|318|319|2zO","↙","o|3|31B|319|2zO","⬅️","left arrow","o|3|31D|31E|2zO","⬅","o|3|31G|31E|2zO","↖️","up-left arrow","o|3|31I|31J|2zO","↖","o|3|31L|31J|2zO","↕️","up-down arrow","o|3|31N|31O|2zO","↕","o|3|31Q|31O|2zO","↔️","left-right arrow","o|3|31S|31T|2zO","↔","o|3|31V|31T|2zO","↩️","right arrow curving left","o|3|31X|31Y|2zO","↩","o|3|31a|31Y|2zO","↪️","left arrow curving right","o|3|31c|31d|2zO","↪","o|3|31f|31d|2zO","⤴️","right arrow curving up","o|3|31h|31i|2zO","⤴","o|3|31k|31i|2zO","⤵️","right arrow curving down","o|3|31m|31n|2zO","⤵","o|3|31p|31n|2zO","🔃","clockwise vertical arrows","o|3|31r|31s|2zO","🔄","counterclockwise arrows button","o|3|31u|31v|2zO","🔙","BACK arrow","o|3|31x|31y|2zO","🔚","END arrow","o|3|320|321|2zO","🔛","ON! arrow","o|3|323|324|2zO","🔜","SOON arrow","o|3|326|327|2zO","🔝","TOP arrow","o|3|329|32A|2zO","🛐","place of worship","o|3|32C|32D|2zO","⚛️","atom symbol","o|3|32F|32G|2zO","⚛","o|3|32I|32G|2zO","🕉️","om","o|3|32K|32L|2zO","🕉","o|3|32N|32L|2zO","✡️","star of David","o|3|32P|32Q|2zO","✡","o|3|32S|32Q|2zO","☸️","wheel of dharma","o|3|32U|32V|2zO","☸","o|3|32X|32V|2zO","☯️","yin yang","o|3|32Z|32a|2zO","☯","o|3|32c|32a|2zO","✝️","latin cross","o|3|32e|32f|2zO","✝","o|3|32h|32f|2zO","☦️","orthodox cross","o|3|32j|32k|2zO","☦","o|3|32m|32k|2zO","☪️","star and crescent","o|3|32o|32p|2zO","☪","o|3|32r|32p|2zO","☮️","peace symbol","o|3|32t|32u|2zO","☮","o|3|32w|32u|2zO","🕎","menorah","o|3|32y|32z|2zO","🔯","dotted six-pointed star","o|3|331|332|2zO","🪯","khanda","o|3|334|335|2zO","♈","Aries","o|3|337|338|2zO","♉","Taurus","o|3|33A|33B|2zO","♊","Gemini","o|3|33D|33E|2zO","♋","Cancer","o|3|33G|33H|2zO","♌","Leo","o|3|33J|33K|2zO","♍","Virgo","o|3|33M|33N|2zO","♎","Libra","o|3|33P|33Q|2zO","♏","Scorpio","o|3|33S|33T|2zO","♐","Sagittarius","o|3|33V|33W|2zO","♑","Capricorn","o|3|33Y|33Z|2zO","♒","Aquarius","o|3|33b|33c|2zO","♓","Pisces","o|3|33e|33f|2zO","⛎","Ophiuchus","o|3|33h|33i|2zO","🔀","shuffle tracks button","o|3|33k|33l|2zO","🔁","repeat button","o|3|33n|33o|2zO","🔂","repeat single button","o|3|33q|33r|2zO","▶️","play button","o|3|33t|33u|2zO","▶","o|3|33w|33u|2zO","⏩","fast-forward button","o|3|33y|33z|2zO","⏭️","next track button","o|3|341|342|2zO","⏭","o|3|344|342|2zO","⏯️","play or pause button","o|3|346|347|2zO","⏯","o|3|349|347|2zO","◀️","reverse button","o|3|34B|34C|2zO","◀","o|3|34E|34C|2zO","⏪","fast reverse button","o|3|34G|34H|2zO","⏮️","last track button","o|3|34J|34K|2zO","⏮","o|3|34M|34K|2zO","🔼","upwards button","o|3|34O|34P|2zO","⏫","fast up button","o|3|34R|34S|2zO","🔽","downwards button","o|3|34U|34V|2zO","⏬","fast down button","o|3|34X|34Y|2zO","⏸️","pause button","o|3|34a|34b|2zO","⏸","o|3|34d|34b|2zO","⏹️","stop button","o|3|34f|34g|2zO","⏹","o|3|34i|34g|2zO","⏺️","record button","o|3|34k|34l|2zO","⏺","o|3|34n|34l|2zO","⏏️","eject button","o|3|34p|34q|2zO","⏏","o|3|34s|34q|2zO","🎦","cinema","o|3|34u|34v|2zO","🔅","dim button","o|3|34x|34y|2zO","🔆","bright button","o|3|350|351|2zO","📶","antenna bars","o|3|353|354|2zO","🛜","wireless","o|3|356|357|2zO","📳","vibration mode","o|3|359|35A|2zO","📴","mobile phone off","o|3|35C|35D|2zO","♀️","female sign","o|3|35F|35G|2zO","♀","o|3|35I|35G|2zO","♂️","male sign","o|3|35K|35L|2zO","♂","o|3|35N|35L|2zO","⚧️","transgender symbol","o|3|35P|35Q|2zO","⚧","o|3|35S|35Q|2zO","✖️","multiply","o|3|35U|35V|2zO","✖","o|3|35X|35V|2zO","➕","plus","o|3|35Z|35a|2zO","➖","minus","o|3|35c|35d|2zO","➗","divide","o|3|35f|35g|2zO","🟰","heavy equals sign","o|3|35i|35j|2zO","♾️","infinity","o|3|35l|35m|2zO","♾","o|3|35o|35m|2zO","‼️","double exclamation mark","o|3|35q|35r|2zO","‼","o|3|35t|35r|2zO","⁉️","exclamation question mark","o|3|35v|35w|2zO","⁉","o|3|35y|35w|2zO","❓","red question mark","o|3|360|361|2zO","❔","white question mark","o|3|363|364|2zO","❕","white exclamation mark","o|3|366|367|2zO","❗","red exclamation mark","o|3|369|36A|2zO","〰️","wavy dash","o|3|36C|36D|2zO","〰","o|3|36F|36D|2zO","💱","currency exchange","o|3|36H|36I|2zO","💲","heavy dollar sign","o|3|36K|36L|2zO","⚕️","medical symbol","o|3|36N|36O|2zO","⚕","o|3|36Q|36O|2zO","♻️","recycling symbol","o|3|36S|36T|2zO","♻","o|3|36V|36T|2zO","⚜️","fleur-de-lis","o|3|36X|36Y|2zO","⚜","o|3|36a|36Y|2zO","🔱","trident emblem","o|3|36c|36d|2zO","📛","name badge","o|3|36f|36g|2zO","🔰","Japanese symbol for beginner","o|3|36i|36j|2zO","⭕","hollow red circle","o|3|36l|36m|2zO","✅","check mark button","o|3|36o|36p|2zO","☑️","check box with check","o|3|36r|36s|2zO","☑","o|3|36u|36s|2zO","✔️","check mark","o|3|36w|36x|2zO","✔","o|3|36z|36x|2zO","❌","cross mark","o|3|371|372|2zO","❎","cross mark button","o|3|374|375|2zO","➰","curly loop","o|3|377|378|2zO","➿","double curly loop","o|3|37A|37B|2zO","〽️","part alternation mark","o|3|37D|37E|2zO","〽","o|3|37G|37E|2zO","✳️","eight-spoked asterisk","o|3|37I|37J|2zO","✳","o|3|37L|37J|2zO","✴️","eight-pointed star","o|3|37N|37O|2zO","✴","o|3|37Q|37O|2zO","❇️","sparkle","o|3|37S|37T|2zO","❇","o|3|37V|37T|2zO","©️","copyright","o|3|37X|37Y|2zO","©","o|3|37a|37Y|2zO","®️","registered","o|3|37c|37d|2zO","®","o|3|37f|37d|2zO","™️","trade mark","o|3|37h|37i|2zO","™","o|3|37k|37i|2zO","#️⃣","keycap: #","o|3|37m|37n|2zO","#⃣","o|3|37p|37n|2zO","*️⃣","keycap: *","o|3|37r|37s|2zO","*⃣","o|3|37u|37s|2zO","0️⃣","keycap: 0","o|3|37w|37x|2zO","0⃣","o|3|37z|37x|2zO","1️⃣","keycap: 1","o|3|381|382|2zO","1⃣","o|3|384|382|2zO","2️⃣","keycap: 2","o|3|386|387|2zO","2⃣","o|3|389|387|2zO","3️⃣","keycap: 3","o|3|38B|38C|2zO","3⃣","o|3|38E|38C|2zO","4️⃣","keycap: 4","o|3|38G|38H|2zO","4⃣","o|3|38J|38H|2zO","5️⃣","keycap: 5","o|3|38L|38M|2zO","5⃣","o|3|38O|38M|2zO","6️⃣","keycap: 6","o|3|38Q|38R|2zO","6⃣","o|3|38T|38R|2zO","7️⃣","keycap: 7","o|3|38V|38W|2zO","7⃣","o|3|38Y|38W|2zO","8️⃣","keycap: 8","o|3|38a|38b|2zO","8⃣","o|3|38d|38b|2zO","9️⃣","keycap: 9","o|3|38f|38g|2zO","9⃣","o|3|38i|38g|2zO","🔟","keycap: 10","o|3|38k|38l|2zO","🔠","input latin uppercase","o|3|38n|38o|2zO","🔡","input latin lowercase","o|3|38q|38r|2zO","🔢","input numbers","o|3|38t|38u|2zO","🔣","input symbols","o|3|38w|38x|2zO","🔤","input latin letters","o|3|38z|390|2zO","🅰️","A button (blood type)","o|3|392|393|2zO","🅰","o|3|395|393|2zO","🆎","AB button (blood type)","o|3|397|398|2zO","🅱️","B button (blood type)","o|3|39A|39B|2zO","🅱","o|3|39D|39B|2zO","🆑","CL button","o|3|39F|39G|2zO","🆒","COOL button","o|3|39I|39J|2zO","🆓","FREE button","o|3|39L|39M|2zO","ℹ️","information","o|3|39O|39P|2zO","ℹ","o|3|39R|39P|2zO","🆔","ID button","o|3|39T|39U|2zO","Ⓜ️","circled M","o|3|39W|39X|2zO","Ⓜ","o|3|39Z|39X|2zO","🆕","NEW button","o|3|39b|39c|2zO","🆖","NG button","o|3|39e|39f|2zO","🅾️","O button (blood type)","o|3|39h|39i|2zO","🅾","o|3|39k|39i|2zO","🆗","OK button","o|3|39m|39n|2zO","🅿️","P button","o|3|39p|39q|2zO","🅿","o|3|39s|39q|2zO","🆘","SOS button","o|3|39u|39v|2zO","🆙","UP! button","o|3|39x|39y|2zO","🆚","VS button","o|3|3A0|3A1|2zO","🈁","Japanese “here” button","o|3|3A3|3A4|2zO","🈂️","Japanese “service charge” button","o|3|3A6|3A7|2zO","🈂","o|3|3A9|3A7|2zO","🈷️","Japanese “monthly amount” button","o|3|3AB|3AC|2zO","🈷","o|3|3AE|3AC|2zO","🈶","Japanese “not free of charge” button","o|3|3AG|3AH|2zO","🈯","Japanese “reserved” button","o|3|3AJ|3AK|2zO","🉐","Japanese “bargain” button","o|3|3AM|3AN|2zO","🈹","Japanese “discount” button","o|3|3AP|3AQ|2zO","🈚","Japanese “free of charge” button","o|3|3AS|3AT|2zO","🈲","Japanese “prohibited” button","o|3|3AV|3AW|2zO","🉑","Japanese “acceptable” button","o|3|3AY|3AZ|2zO","🈸","Japanese “application” button","o|3|3Ab|3Ac|2zO","🈴","Japanese “passing grade” button","o|3|3Ae|3Af|2zO","🈳","Japanese “vacancy” button","o|3|3Ah|3Ai|2zO","㊗️","Japanese “congratulations” button","o|3|3Ak|3Al|2zO","㊗","o|3|3An|3Al|2zO","㊙️","Japanese “secret” button","o|3|3Ap|3Aq|2zO","㊙","o|3|3As|3Aq|2zO","🈺","Japanese “open for business” button","o|3|3Au|3Av|2zO","🈵","Japanese “no vacancy” button","o|3|3Ax|3Ay|2zO","🔴","red circle","o|3|3B0|3B1|2zO","🟠","orange circle","o|3|3B3|3B4|2zO","🟡","yellow circle","o|3|3B6|3B7|2zO","🟢","green circle","o|3|3B9|3BA|2zO","🔵","blue circle","o|3|3BC|3BD|2zO","🟣","purple circle","o|3|3BF|3BG|2zO","🟤","brown circle","o|3|3BI|3BJ|2zO","⚫","black circle","o|3|3BL|3BM|2zO","⚪","white circle","o|3|3BO|3BP|2zO","🟥","red square","o|3|3BR|3BS|2zO","🟧","orange square","o|3|3BU|3BV|2zO","🟨","yellow square","o|3|3BX|3BY|2zO","🟩","green square","o|3|3Ba|3Bb|2zO","🟦","blue square","o|3|3Bd|3Be|2zO","🟪","purple square","o|3|3Bg|3Bh|2zO","🟫","brown square","o|3|3Bj|3Bk|2zO","⬛","black large square","o|3|3Bm|3Bn|2zO","⬜","white large square","o|3|3Bp|3Bq|2zO","◼️","black medium square","o|3|3Bs|3Bt|2zO","◼","o|3|3Bv|3Bt|2zO","◻️","white medium square","o|3|3Bx|3By|2zO","◻","o|3|3C0|3By|2zO","◾","black medium-small square","o|3|3C2|3C3|2zO","◽","white medium-small square","o|3|3C5|3C6|2zO","▪️","black small square","o|3|3C8|3C9|2zO","▪","o|3|3CB|3C9|2zO","▫️","white small square","o|3|3CD|3CE|2zO","▫","o|3|3CG|3CE|2zO","🔶","large orange diamond","o|3|3CI|3CJ|2zO","🔷","large blue diamond","o|3|3CL|3CM|2zO","🔸","small orange diamond","o|3|3CO|3CP|2zO","🔹","small blue diamond","o|3|3CR|3CS|2zO","🔺","red triangle pointed up","o|3|3CU|3CV|2zO","🔻","red triangle pointed down","o|3|3CX|3CY|2zO","💠","diamond with a dot","o|3|3Ca|3Cb|2zO","🔘","radio button","o|3|3Cd|3Ce|2zO","🔳","white square button","o|3|3Cg|3Ch|2zO","🔲","black square button","o|3|3Cj|3Ck|2zO","🏁","chequered flag","Flags","o|3|3Cm|3Cn|3Co","🚩","triangular flag","o|3|3Cq|3Cr|3Co","🎌","crossed flags","o|3|3Ct|3Cu|3Co","🏴","black flag","o|3|3Cw|3Cx|3Co","🏳️","white flag","o|3|3Cz|3D0|3Co","🏳","o|3|3D2|3D0|3Co","🏳️‍🌈","rainbow flag","o|3|3D4|3D5|3Co","🏳‍🌈","o|3|3D7|3D5|3Co","🏳️‍⚧️","transgender flag","o|3|3D9|3DA|3Co","🏳‍⚧️","o|3|3DC|3DA|3Co","🏳️‍⚧","o|3|3DE|3DA|3Co","🏳‍⚧","o|3|3DG|3DA|3Co","🏴‍☠️","pirate flag","o|3|3DI|3DJ|3Co","🏴‍☠","o|3|3DL|3DJ|3Co","🇦🇨","flag: Ascension Island","o|3|3DN|3DO|3Co","🇦🇩","flag: Andorra","o|3|3DQ|3DR|3Co","🇦🇪","flag: United Arab Emirates","o|3|3DT|3DU|3Co","🇦🇫","flag: Afghanistan","o|3|3DW|3DX|3Co","🇦🇬","flag: Antigua & Barbuda","o|3|3DZ|3Da|3Co","🇦🇮","flag: Anguilla","o|3|3Dc|3Dd|3Co","🇦🇱","flag: Albania","o|3|3Df|3Dg|3Co","🇦🇲","flag: Armenia","o|3|3Di|3Dj|3Co","🇦🇴","flag: Angola","o|3|3Dl|3Dm|3Co","🇦🇶","flag: Antarctica","o|3|3Do|3Dp|3Co","🇦🇷","flag: Argentina","o|3|3Dr|3Ds|3Co","🇦🇸","flag: American Samoa","o|3|3Du|3Dv|3Co","🇦🇹","flag: Austria","o|3|3Dx|3Dy|3Co","🇦🇺","flag: Australia","o|3|3E0|3E1|3Co","🇦🇼","flag: Aruba","o|3|3E3|3E4|3Co","🇦🇽","flag: Åland Islands","o|3|3E6|3E7|3Co","🇦🇿","flag: Azerbaijan","o|3|3E9|3EA|3Co","🇧🇦","flag: Bosnia & Herzegovina","o|3|3EC|3ED|3Co","🇧🇧","flag: Barbados","o|3|3EF|3EG|3Co","🇧🇩","flag: Bangladesh","o|3|3EI|3EJ|3Co","🇧🇪","flag: Belgium","o|3|3EL|3EM|3Co","🇧🇫","flag: Burkina Faso","o|3|3EO|3EP|3Co","🇧🇬","flag: Bulgaria","o|3|3ER|3ES|3Co","🇧🇭","flag: Bahrain","o|3|3EU|3EV|3Co","🇧🇮","flag: Burundi","o|3|3EX|3EY|3Co","🇧🇯","flag: Benin","o|3|3Ea|3Eb|3Co","🇧🇱","flag: St. Barthélemy","o|3|3Ed|3Ee|3Co","🇧🇲","flag: Bermuda","o|3|3Eg|3Eh|3Co","🇧🇳","flag: Brunei","o|3|3Ej|3Ek|3Co","🇧🇴","flag: Bolivia","o|3|3Em|3En|3Co","🇧🇶","flag: Caribbean Netherlands","o|3|3Ep|3Eq|3Co","🇧🇷","flag: Brazil","o|3|3Es|3Et|3Co","🇧🇸","flag: Bahamas","o|3|3Ev|3Ew|3Co","🇧🇹","flag: Bhutan","o|3|3Ey|3Ez|3Co","🇧🇻","flag: Bouvet Island","o|3|3F1|3F2|3Co","🇧🇼","flag: Botswana","o|3|3F4|3F5|3Co","🇧🇾","flag: Belarus","o|3|3F7|3F8|3Co","🇧🇿","flag: Belize","o|3|3FA|3FB|3Co","🇨🇦","flag: Canada","o|3|3FD|3FE|3Co","🇨🇨","flag: Cocos (Keeling) Islands","o|3|3FG|3FH|3Co","🇨🇩","flag: Congo - Kinshasa","o|3|3FJ|3FK|3Co","🇨🇫","flag: Central African Republic","o|3|3FM|3FN|3Co","🇨🇬","flag: Congo - Brazzaville","o|3|3FP|3FQ|3Co","🇨🇭","flag: Switzerland","o|3|3FS|3FT|3Co","🇨🇮","flag: Côte d’Ivoire","o|3|3FV|3FW|3Co","🇨🇰","flag: Cook Islands","o|3|3FY|3FZ|3Co","🇨🇱","flag: Chile","o|3|3Fb|3Fc|3Co","🇨🇲","flag: Cameroon","o|3|3Fe|3Ff|3Co","🇨🇳","flag: China","o|3|3Fh|3Fi|3Co","🇨🇴","flag: Colombia","o|3|3Fk|3Fl|3Co","🇨🇵","flag: Clipperton Island","o|3|3Fn|3Fo|3Co","🇨🇷","flag: Costa Rica","o|3|3Fq|3Fr|3Co","🇨🇺","flag: Cuba","o|3|3Ft|3Fu|3Co","🇨🇻","flag: Cape Verde","o|3|3Fw|3Fx|3Co","🇨🇼","flag: Curaçao","o|3|3Fz|3G0|3Co","🇨🇽","flag: Christmas Island","o|3|3G2|3G3|3Co","🇨🇾","flag: Cyprus","o|3|3G5|3G6|3Co","🇨🇿","flag: Czechia","o|3|3G8|3G9|3Co","🇩🇪","flag: Germany","o|3|3GB|3GC|3Co","🇩🇬","flag: Diego Garcia","o|3|3GE|3GF|3Co","🇩🇯","flag: Djibouti","o|3|3GH|3GI|3Co","🇩🇰","flag: Denmark","o|3|3GK|3GL|3Co","🇩🇲","flag: Dominica","o|3|3GN|3GO|3Co","🇩🇴","flag: Dominican Republic","o|3|3GQ|3GR|3Co","🇩🇿","flag: Algeria","o|3|3GT|3GU|3Co","🇪🇦","flag: Ceuta & Melilla","o|3|3GW|3GX|3Co","🇪🇨","flag: Ecuador","o|3|3GZ|3Ga|3Co","🇪🇪","flag: Estonia","o|3|3Gc|3Gd|3Co","🇪🇬","flag: Egypt","o|3|3Gf|3Gg|3Co","🇪🇭","flag: Western Sahara","o|3|3Gi|3Gj|3Co","🇪🇷","flag: Eritrea","o|3|3Gl|3Gm|3Co","🇪🇸","flag: Spain","o|3|3Go|3Gp|3Co","🇪🇹","flag: Ethiopia","o|3|3Gr|3Gs|3Co","🇪🇺","flag: European Union","o|3|3Gu|3Gv|3Co","🇫🇮","flag: Finland","o|3|3Gx|3Gy|3Co","🇫🇯","flag: Fiji","o|3|3H0|3H1|3Co","🇫🇰","flag: Falkland Islands","o|3|3H3|3H4|3Co","🇫🇲","flag: Micronesia","o|3|3H6|3H7|3Co","🇫🇴","flag: Faroe Islands","o|3|3H9|3HA|3Co","🇫🇷","flag: France","o|3|3HC|3HD|3Co","🇬🇦","flag: Gabon","o|3|3HF|3HG|3Co","🇬🇧","flag: United Kingdom","o|3|3HI|3HJ|3Co","🇬🇩","flag: Grenada","o|3|3HL|3HM|3Co","🇬🇪","flag: Georgia","o|3|3HO|3HP|3Co","🇬🇫","flag: French Guiana","o|3|3HR|3HS|3Co","🇬🇬","flag: Guernsey","o|3|3HU|3HV|3Co","🇬🇭","flag: Ghana","o|3|3HX|3HY|3Co","🇬🇮","flag: Gibraltar","o|3|3Ha|3Hb|3Co","🇬🇱","flag: Greenland","o|3|3Hd|3He|3Co","🇬🇲","flag: Gambia","o|3|3Hg|3Hh|3Co","🇬🇳","flag: Guinea","o|3|3Hj|3Hk|3Co","🇬🇵","flag: Guadeloupe","o|3|3Hm|3Hn|3Co","🇬🇶","flag: Equatorial Guinea","o|3|3Hp|3Hq|3Co","🇬🇷","flag: Greece","o|3|3Hs|3Ht|3Co","🇬🇸","flag: South Georgia & South Sandwich Islands","o|3|3Hv|3Hw|3Co","🇬🇹","flag: Guatemala","o|3|3Hy|3Hz|3Co","🇬🇺","flag: Guam","o|3|3I1|3I2|3Co","🇬🇼","flag: Guinea-Bissau","o|3|3I4|3I5|3Co","🇬🇾","flag: Guyana","o|3|3I7|3I8|3Co","🇭🇰","flag: Hong Kong SAR China","o|3|3IA|3IB|3Co","🇭🇲","flag: Heard & McDonald Islands","o|3|3ID|3IE|3Co","🇭🇳","flag: Honduras","o|3|3IG|3IH|3Co","🇭🇷","flag: Croatia","o|3|3IJ|3IK|3Co","🇭🇹","flag: Haiti","o|3|3IM|3IN|3Co","🇭🇺","flag: Hungary","o|3|3IP|3IQ|3Co","🇮🇨","flag: Canary Islands","o|3|3IS|3IT|3Co","🇮🇩","flag: Indonesia","o|3|3IV|3IW|3Co","🇮🇪","flag: Ireland","o|3|3IY|3IZ|3Co","🇮🇱","flag: Israel","o|3|3Ib|3Ic|3Co","🇮🇲","flag: Isle of Man","o|3|3Ie|3If|3Co","🇮🇳","flag: India","o|3|3Ih|3Ii|3Co","🇮🇴","flag: British Indian Ocean Territory","o|3|3Ik|3Il|3Co","🇮🇶","flag: Iraq","o|3|3In|3Io|3Co","🇮🇷","flag: Iran","o|3|3Iq|3Ir|3Co","🇮🇸","flag: Iceland","o|3|3It|3Iu|3Co","🇮🇹","flag: Italy","o|3|3Iw|3Ix|3Co","🇯🇪","flag: Jersey","o|3|3Iz|3J0|3Co","🇯🇲","flag: Jamaica","o|3|3J2|3J3|3Co","🇯🇴","flag: Jordan","o|3|3J5|3J6|3Co","🇯🇵","flag: Japan","o|3|3J8|3J9|3Co","🇰🇪","flag: Kenya","o|3|3JB|3JC|3Co","🇰🇬","flag: Kyrgyzstan","o|3|3JE|3JF|3Co","🇰🇭","flag: Cambodia","o|3|3JH|3JI|3Co","🇰🇮","flag: Kiribati","o|3|3JK|3JL|3Co","🇰🇲","flag: Comoros","o|3|3JN|3JO|3Co","🇰🇳","flag: St. Kitts & Nevis","o|3|3JQ|3JR|3Co","🇰🇵","flag: North Korea","o|3|3JT|3JU|3Co","🇰🇷","flag: South Korea","o|3|3JW|3JX|3Co","🇰🇼","flag: Kuwait","o|3|3JZ|3Ja|3Co","🇰🇾","flag: Cayman Islands","o|3|3Jc|3Jd|3Co","🇰🇿","flag: Kazakhstan","o|3|3Jf|3Jg|3Co","🇱🇦","flag: Laos","o|3|3Ji|3Jj|3Co","🇱🇧","flag: Lebanon","o|3|3Jl|3Jm|3Co","🇱🇨","flag: St. Lucia","o|3|3Jo|3Jp|3Co","🇱🇮","flag: Liechtenstein","o|3|3Jr|3Js|3Co","🇱🇰","flag: Sri Lanka","o|3|3Ju|3Jv|3Co","🇱🇷","flag: Liberia","o|3|3Jx|3Jy|3Co","🇱🇸","flag: Lesotho","o|3|3K0|3K1|3Co","🇱🇹","flag: Lithuania","o|3|3K3|3K4|3Co","🇱🇺","flag: Luxembourg","o|3|3K6|3K7|3Co","🇱🇻","flag: Latvia","o|3|3K9|3KA|3Co","🇱🇾","flag: Libya","o|3|3KC|3KD|3Co","🇲🇦","flag: Morocco","o|3|3KF|3KG|3Co","🇲🇨","flag: Monaco","o|3|3KI|3KJ|3Co","🇲🇩","flag: Moldova","o|3|3KL|3KM|3Co","🇲🇪","flag: Montenegro","o|3|3KO|3KP|3Co","🇲🇫","flag: St. Martin","o|3|3KR|3KS|3Co","🇲🇬","flag: Madagascar","o|3|3KU|3KV|3Co","🇲🇭","flag: Marshall Islands","o|3|3KX|3KY|3Co","🇲🇰","flag: North Macedonia","o|3|3Ka|3Kb|3Co","🇲🇱","flag: Mali","o|3|3Kd|3Ke|3Co","🇲🇲","flag: Myanmar (Burma)","o|3|3Kg|3Kh|3Co","🇲🇳","flag: Mongolia","o|3|3Kj|3Kk|3Co","🇲🇴","flag: Macao SAR China","o|3|3Km|3Kn|3Co","🇲🇵","flag: Northern Mariana Islands","o|3|3Kp|3Kq|3Co","🇲🇶","flag: Martinique","o|3|3Ks|3Kt|3Co","🇲🇷","flag: Mauritania","o|3|3Kv|3Kw|3Co","🇲🇸","flag: Montserrat","o|3|3Ky|3Kz|3Co","🇲🇹","flag: Malta","o|3|3L1|3L2|3Co","🇲🇺","flag: Mauritius","o|3|3L4|3L5|3Co","🇲🇻","flag: Maldives","o|3|3L7|3L8|3Co","🇲🇼","flag: Malawi","o|3|3LA|3LB|3Co","🇲🇽","flag: Mexico","o|3|3LD|3LE|3Co","🇲🇾","flag: Malaysia","o|3|3LG|3LH|3Co","🇲🇿","flag: Mozambique","o|3|3LJ|3LK|3Co","🇳🇦","flag: Namibia","o|3|3LM|3LN|3Co","🇳🇨","flag: New Caledonia","o|3|3LP|3LQ|3Co","🇳🇪","flag: Niger","o|3|3LS|3LT|3Co","🇳🇫","flag: Norfolk Island","o|3|3LV|3LW|3Co","🇳🇬","flag: Nigeria","o|3|3LY|3LZ|3Co","🇳🇮","flag: Nicaragua","o|3|3Lb|3Lc|3Co","🇳🇱","flag: Netherlands","o|3|3Le|3Lf|3Co","🇳🇴","flag: Norway","o|3|3Lh|3Li|3Co","🇳🇵","flag: Nepal","o|3|3Lk|3Ll|3Co","🇳🇷","flag: Nauru","o|3|3Ln|3Lo|3Co","🇳🇺","flag: Niue","o|3|3Lq|3Lr|3Co","🇳🇿","flag: New Zealand","o|3|3Lt|3Lu|3Co","🇴🇲","flag: Oman","o|3|3Lw|3Lx|3Co","🇵🇦","flag: Panama","o|3|3Lz|3M0|3Co","🇵🇪","flag: Peru","o|3|3M2|3M3|3Co","🇵🇫","flag: French Polynesia","o|3|3M5|3M6|3Co","🇵🇬","flag: Papua New Guinea","o|3|3M8|3M9|3Co","🇵🇭","flag: Philippines","o|3|3MB|3MC|3Co","🇵🇰","flag: Pakistan","o|3|3ME|3MF|3Co","🇵🇱","flag: Poland","o|3|3MH|3MI|3Co","🇵🇲","flag: St. Pierre & Miquelon","o|3|3MK|3ML|3Co","🇵🇳","flag: Pitcairn Islands","o|3|3MN|3MO|3Co","🇵🇷","flag: Puerto Rico","o|3|3MQ|3MR|3Co","🇵🇸","flag: Palestinian Territories","o|3|3MT|3MU|3Co","🇵🇹","flag: Portugal","o|3|3MW|3MX|3Co","🇵🇼","flag: Palau","o|3|3MZ|3Ma|3Co","🇵🇾","flag: Paraguay","o|3|3Mc|3Md|3Co","🇶🇦","flag: Qatar","o|3|3Mf|3Mg|3Co","🇷🇪","flag: Réunion","o|3|3Mi|3Mj|3Co","🇷🇴","flag: Romania","o|3|3Ml|3Mm|3Co","🇷🇸","flag: Serbia","o|3|3Mo|3Mp|3Co","🇷🇺","flag: Russia","o|3|3Mr|3Ms|3Co","🇷🇼","flag: Rwanda","o|3|3Mu|3Mv|3Co","🇸🇦","flag: Saudi Arabia","o|3|3Mx|3My|3Co","🇸🇧","flag: Solomon Islands","o|3|3N0|3N1|3Co","🇸🇨","flag: Seychelles","o|3|3N3|3N4|3Co","🇸🇩","flag: Sudan","o|3|3N6|3N7|3Co","🇸🇪","flag: Sweden","o|3|3N9|3NA|3Co","🇸🇬","flag: Singapore","o|3|3NC|3ND|3Co","🇸🇭","flag: St. Helena","o|3|3NF|3NG|3Co","🇸🇮","flag: Slovenia","o|3|3NI|3NJ|3Co","🇸🇯","flag: Svalbard & Jan Mayen","o|3|3NL|3NM|3Co","🇸🇰","flag: Slovakia","o|3|3NO|3NP|3Co","🇸🇱","flag: Sierra Leone","o|3|3NR|3NS|3Co","🇸🇲","flag: San Marino","o|3|3NU|3NV|3Co","🇸🇳","flag: Senegal","o|3|3NX|3NY|3Co","🇸🇴","flag: Somalia","o|3|3Na|3Nb|3Co","🇸🇷","flag: Suriname","o|3|3Nd|3Ne|3Co","🇸🇸","flag: South Sudan","o|3|3Ng|3Nh|3Co","🇸🇹","flag: São Tomé & Príncipe","o|3|3Nj|3Nk|3Co","🇸🇻","flag: El Salvador","o|3|3Nm|3Nn|3Co","🇸🇽","flag: Sint Maarten","o|3|3Np|3Nq|3Co","🇸🇾","flag: Syria","o|3|3Ns|3Nt|3Co","🇸🇿","flag: Eswatini","o|3|3Nv|3Nw|3Co","🇹🇦","flag: Tristan da Cunha","o|3|3Ny|3Nz|3Co","🇹🇨","flag: Turks & Caicos Islands","o|3|3O1|3O2|3Co","🇹🇩","flag: Chad","o|3|3O4|3O5|3Co","🇹🇫","flag: French Southern Territories","o|3|3O7|3O8|3Co","🇹🇬","flag: Togo","o|3|3OA|3OB|3Co","🇹🇭","flag: Thailand","o|3|3OD|3OE|3Co","🇹🇯","flag: Tajikistan","o|3|3OG|3OH|3Co","🇹🇰","flag: Tokelau","o|3|3OJ|3OK|3Co","🇹🇱","flag: Timor-Leste","o|3|3OM|3ON|3Co","🇹🇲","flag: Turkmenistan","o|3|3OP|3OQ|3Co","🇹🇳","flag: Tunisia","o|3|3OS|3OT|3Co","🇹🇴","flag: Tonga","o|3|3OV|3OW|3Co","🇹🇷","flag: Turkey","o|3|3OY|3OZ|3Co","🇹🇹","flag: Trinidad & Tobago","o|3|3Ob|3Oc|3Co","🇹🇻","flag: Tuvalu","o|3|3Oe|3Of|3Co","🇹🇼","flag: Taiwan","o|3|3Oh|3Oi|3Co","🇹🇿","flag: Tanzania","o|3|3Ok|3Ol|3Co","🇺🇦","flag: Ukraine","o|3|3On|3Oo|3Co","🇺🇬","flag: Uganda","o|3|3Oq|3Or|3Co","🇺🇲","flag: U.S. Outlying Islands","o|3|3Ot|3Ou|3Co","🇺🇳","flag: United Nations","o|3|3Ow|3Ox|3Co","🇺🇸","flag: United States","o|3|3Oz|3P0|3Co","🇺🇾","flag: Uruguay","o|3|3P2|3P3|3Co","🇺🇿","flag: Uzbekistan","o|3|3P5|3P6|3Co","🇻🇦","flag: Vatican City","o|3|3P8|3P9|3Co","🇻🇨","flag: St. Vincent & Grenadines","o|3|3PB|3PC|3Co","🇻🇪","flag: Venezuela","o|3|3PE|3PF|3Co","🇻🇬","flag: British Virgin Islands","o|3|3PH|3PI|3Co","🇻🇮","flag: U.S. Virgin Islands","o|3|3PK|3PL|3Co","🇻🇳","flag: Vietnam","o|3|3PN|3PO|3Co","🇻🇺","flag: Vanuatu","o|3|3PQ|3PR|3Co","🇼🇫","flag: Wallis & Futuna","o|3|3PT|3PU|3Co","🇼🇸","flag: Samoa","o|3|3PW|3PX|3Co","🇽🇰","flag: Kosovo","o|3|3PZ|3Pa|3Co","🇾🇪","flag: Yemen","o|3|3Pc|3Pd|3Co","🇾🇹","flag: Mayotte","o|3|3Pf|3Pg|3Co","🇿🇦","flag: South Africa","o|3|3Pi|3Pj|3Co","🇿🇲","flag: Zambia","o|3|3Pl|3Pm|3Co","🇿🇼","flag: Zimbabwe","o|3|3Po|3Pp|3Co","🏴󠁧󠁢󠁥󠁮󠁧󠁿","flag: England","o|3|3Pr|3Ps|3Co","🏴󠁧󠁢󠁳󠁣󠁴󠁿","flag: Scotland","o|3|3Pu|3Pv|3Co","🏴󠁧󠁢󠁷󠁬󠁳󠁿","flag: Wales","o|3|3Px|3Py|3Co","a|7|A|D|G|J|M|P|S|V|Y|b|e|h|k|n|q|t|w|z|12|14|17|1A|1D|1G|1J|1M|1P|1S|1V|1Y|1b|1e|1h|1k|1n|1q|1t|1w|1z|22|25|28|2B|2D|2G|2J|2M|2P|2S|2V|2Y|2b|2e|2h|2k|2n|2q|2t|2w|2z|32|35|38|3B|3E|3H|3K|3N|3Q|3T|3W|3Z|3c|3f|3i|3l|3o|3r|3u|3w|3z|42|45|48|4B|4E|4H|4K|4N|4Q|4T|4W|4Z|4c|4f|4i|4l|4o|4r|4u|4x|50|53|56|59|5C|5F|5I|5L|5N|5Q|5T|5W|5Z|5c|5f|5i|5l|5o|5r|5u|5x|60|63|66|69|6C|6F|6I|6L|6O|6R|6U|6X|6a|6d|6g|6j|6m|6p|6r|6u|6x|6z|72|74|77|79|7C|7F|7I|7L|7O|7R|7U|7X|7a|7d|7g|7j|7m|7p|7s|7v|7y|81|84|86|89|8C|8E|8G|8I|8L|8N|8Q|8S|8V|8Y|8c|8f|8i|8l|8o|8r|8u|8x|90|93|96|99|9C|9E|9H|9K|9N|9Q|9T|9W|9Z|9c|9f|9i|9l|9o|9r|9u|9x|A0|A3|A6|A9|AC|AF|AI|AL|AO|AR|AU|AX|Aa|Ad|Ag|Aj|Am|Ap|As|Av|Ay|B1|B4|B7|BA|BD|BG|BJ|BM|BP|BS|BV|BY|Bb|Be|Bh|Bk|Bn|Bq|Bt|Bw|Bz|C2|C5|C8|CB|CE|CH|CK|CN|CQ|CT|CW|CZ|Cc|Cf|Ci|Ck|Cn|Cq|Ct|Cw|Cz|D2|D5|D8|DB|DE|DH|DK|DN|DQ|DT|DW|DZ|Dc|Df|Di|Dl|Do|Dr|Du|Dx|E0|E3|E6|E9|EC|EF|EI|EL|EO|ER|EU|EX|Ea|Ed|Eg|Ej|Em|Ep|Es|Ev|Ey|F1|F4|F7|FA|FD|FG|FJ|FM|FP|FS|FV|FY|Fb|Fe|Fh|Fk|Fn|Fq|Ft|Fw|Fy|G1|G4|G7|GA|GD|GG|GJ|GM|GP|GS|GV|GY|Gb|Ge|Gh|Gk|Gn|Gq|Gt|Gw|Gz|H2|H5|H8|HB|HE|HH|HK|HN|HQ|HT|HW|HZ|Hc|Hf|Hi|Hl|Ho|Hr|Hu|Hx|I0|I3|I6|I9|IC|IF|II|IL|IO|IR|IU|IX|Ia|Id|Ig|Ij|Im|Ip|Is|Iv|Iy|J1|J4|J7|JA|JD|JG|JJ|JM|JP|JS|JV|JY|Jb|Je|Jh|Jk|Jn|Jq|Jt|Jw|Jz|K2|K5|K8|KB|KE|KH|KK|KN|KQ|KT|KW|KZ|Kc|Kf|Ki|Kl|Ko|Kr|Ku|Kx|L0|L3|L6|L9|LC|LF|LI|LK|LN|LQ|LT|LW|LZ|Lc|Lf|Li|Ll|Lo|Lr|Lu|Lx|M0|M3|M6|M9|MC|MF|MI|ML|MO|MR|MU|MX|Ma|Md|Mg|Mj|Mm|Mp|Ms|Mv|My|N1|N4|N7|NA|ND|NG|NJ|NM|NP|NS|NV|NY|Nb|Ne|Nh|Nk|Nn|Nq|Nt|Nw|Nz|O2|O5|O8|OB|OE|OH|OK|OM|OP|OS|OV|OY|Ob|Oe|Oh|Ok|On|Oq|Ot|Ow|Oz|P2|P5|P8|PB|PE|PH|PK|PN|PQ|PT|PW|PZ|Pc|Pf|Pi|Pl|Po|Pr|Pu|Px|Q0|Q3|Q6|Q9|QC|QF|QI|QL|QO|QR|QU|QX|Qa|Qd|Qg|Qj|Qm|Qp|Qs|Qu|Qx|Qz|R2|R4|R7|R9|RC|RE|RH|RJ|RM|RO|RR|RT|RW|RY|Rb|Rd|Rg|Ri|Rl|Rn|Rq|Rt|Rw|Rz|S2|S5|S8|SB|SE|SH|SK|SN|SQ|ST|SW|SZ|Sc|Sf|Si|Sl|So|Sr|Su|Sx|T0|T3|T6|T9|TC|TF|TI|TL|TO|TR|TU|TX|Ta|Td|Tg|Tj|Tm|Tp|Ts|Tv|Ty|U1|U4|U7|UA|UD|UG|UJ|UM|UP|US|UV|UY|Ub|Ue|Uh|Uk|Un|Uq|Ut|Uw|Uz|V2|V5|V8|VB|VE|VH|VK|VN|VQ|VT|VW|VZ|Vc|Ve|Vh|Vj|Vm|Vo|Vr|Vt|Vw|Vy|W1|W3|W6|W8|WB|WD|WG|WI|WL|WN|WQ|WS|WV|WX|Wa|Wd|Wg|Wj|Wm|Wp|Ws|Wv|Wy|X1|X4|X7|XA|XD|XG|XJ|XM|XP|XS|XV|XY|Xb|Xe|Xh|Xk|Xm|Xp|Xr|Xu|Xw|Xz|Y1|Y4|Y6|Y9|YB|YE|YG|YJ|YL|YO|YQ|YT|YV|YY|Ya|Yd|Yf|Yi|Yl|Yo|Yr|Yu|Yx|Z0|Z2|Z5|Z7|ZA|ZC|ZF|ZH|ZK|ZM|ZP|ZR|ZU|ZW|ZZ|Zb|Ze|Zg|Zj|Zl|Zo|Zq|Zt|Zv|Zy|a1|a4|a7|aA|aD|aG|aI|aL|aN|aQ|aS|aV|aX|aa|ac|af|ah|ak|am|ap|ar|au|aw|az|b1|b4|b6|b9|bB|bE|bH|bK|bN|bQ|bT|bW|bY|bb|bd|bg|bi|bl|bn|bq|bs|bv|bx|c0|c2|c5|c7|cA|cC|cF|cH|cK|cM|cP|cR|cU|cX|ca|cd|cg|cj|cm|co|cr|ct|cw|cy|d1|d3|d6|d8|dB|dD|dG|dI|dL|dN|dQ|dS|dV|dX|da|dc|df|dh|dk|dn|dq|dt|dw|dz|e2|e4|e7|e9|eC|eE|eH|eJ|eM|eO|eR|eT|eW|eY|eb|ed|eg|ei|el|en|eq|es|ev|ex|f0|f3|f6|f9|fC|fF|fI|fK|fN|fP|fS|fU|fX|fZ|fc|fe|fh|fj|fm|fo|fr|ft|fw|fy|g1|g3|g6|g8|gB|gD|gG|gJ|gM|gP|gS|gV|gY|ga|gd|gf|gi|gk|gn|gp|gs|gu|gx|gz|h2|h4|h7|h9|hC|hE|hH|hJ|hM|hO|hR|hT|hW|hZ|hc|hf|hi|hl|ho|hq|ht|hv|hy|i0|i3|i5|i8|iA|iD|iF|iI|iK|iN|iP|iS|iU|iX|iZ|ic|ie|ih|ij|im|ip|is|iv|iy|j1|j4|j6|j9|jB|jE|jG|jJ|jL|jO|jQ|jT|jV|jY|ja|jd|jf|ji|jk|jn|jp|js|ju|jx|jz|k2|k4|k7|k9|kC|kE|kH|kJ|kM|kO|kR|kT|kW|kY|kb|kd|kg|ki|kl|kn|kq|ks|kv|kx|l0|l2|l5|l7|lA|lC|lF|lH|lK|lM|lP|lR|lU|lX|la|ld|lg|lj|lm|lp|ls|lv|ly|m1|m4|m7|mA|mD|mG|mJ|mM|mP|mS|mV|mY|mb|me|mh|mk|mn|mq|mt|mw|mz|n2|n5|n8|nB|nE|nG|nJ|nL|nO|nQ|nT|nV|nY|na|nd|nf|ni|nk|nn|np|ns|nu|nx|nz|o2|o4|o7|o9|oC|oE|oH|oJ|oM|oO|oR|oT|oW|oY|ob|od|og|oj|om|op|os|ov|oy|p1|p4|p7|pA|pD|pG|pJ|pM|pP|pS|pV|pY|pb|pe|ph|pk|pn|pq|pt|pw|pz|q2|q5|q8|qB|qE|qH|qK|qN|qQ|qT|qW|qZ|qc|qf|qi|ql|qo|qr|qu|qx|r0|r3|r6|r9|rC|rF|rI|rL|rO|rR|rU|rX|ra|rd|rg|rj|rm|rp|rs|rv|ry|s1|s4|s7|sA|sD|sG|sJ|sM|sP|sS|sV|sY|sb|se|sh|sk|sn|sq|st|sw|sz|t2|t5|t8|tB|tE|tH|tK|tN|tQ|tT|tW|tZ|tc|tf|ti|tl|to|tr|tu|tx|u0|u3|u6|u9|uC|uF|uI|uL|uO|uR|uU|uX|ua|ud|ug|uj|um|up|us|uv|uy|v1|v4|v7|vA|vD|vG|vJ|vM|vP|vS|vV|vY|vb|ve|vh|vk|vn|vq|vt|vw|vz|w2|w5|w8|wB|wE|wH|wK|wN|wQ|wT|wW|wY|wb|wd|wg|wi|wl|wn|wq|ws|wv|wx|x0|x2|x5|x7|xA|xC|xF|xH|xK|xM|xP|xR|xU|xW|xZ|xb|xe|xg|xj|xl|xo|xq|xt|xv|xy|y1|y4|y7|yA|yD|yG|yJ|yM|yP|yS|yV|yY|yb|ye|yh|yk|yn|yq|yt|yw|yz|z2|z5|z8|zB|zE|zH|zK|zN|zQ|zT|zW|zZ|zc|zf|zi|zl|zo|zr|zu|zx|100|102|105|107|10A|10C|10F|10H|10K|10M|10P|10R|10U|10W|10Z|10b|10e|10g|10j|10l|10o|10q|10t|10v|10y|110|113|116|119|11C|11F|11I|11K|11M|11O|11R|11T|11W|11Y|11b|11d|11g|11i|11l|11n|11q|11s|11u|11w|11z|121|124|126|129|12B|12E|12G|12J|12L|12O|12R|12U|12X|12a|12d|12g|12i|12l|12n|12q|12s|12v|12x|130|132|135|137|13A|13C|13F|13H|13K|13M|13P|13R|13U|13W|13Z|13b|13e|13h|13k|13n|13q|13t|13w|13z|142|145|148|14B|14E|14G|14J|14L|14O|14Q|14T|14V|14Y|14a|14d|14f|14i|14k|14n|14p|14s|14u|14x|14z|152|154|157|159|15C|15F|15I|15L|15O|15R|15U|15X|15a|15d|15g|15j|15m|15p|15s|15v|15y|161|164|167|16A|16D|16G|16J|16M|16O|16R|16T|16W|16Y|16b|16d|16g|16i|16l|16n|16q|16s|16v|16x|170|172|175|177|17A|17C|17F|17H|17K|17N|17Q|17T|17W|17Z|17c|17f|17i|17l|17o|17r|17u|17x|180|183|186|189|18C|18E|18H|18J|18M|18O|18R|18T|18W|18Y|18b|18d|18g|18i|18l|18n|18q|18s|18v|18x|190|192|195|197|19A|19D|19G|19J|19M|19P|19S|19U|19X|19Z|19c|19e|19h|19j|19m|19o|19r|19t|19w|19y|1A1|1A3|1A6|1A8|1AB|1AD|1AG|1AI|1AL|1AN|1AQ|1AT|1AW|1AZ|1Ac|1Af|1Ai|1Al|1Ao|1Ar|1Au|1Ax|1B0|1B3|1B6|1B9|1BC|1BF|1BI|1BL|1BO|1BR|1BU|1BX|1Ba|1Bd|1Bg|1Bj|1Bm|1Bp|1Bs|1Bv|1By|1C1|1C4|1C7|1CA|1CD|1CG|1CJ|1CM|1CP|1CS|1CV|1CY|1Cb|1Ce|1Ch|1Ck|1Cn|1Cq|1Ct|1Cw|1Cz|1D2|1D5|1D8|1DB|1DE|1DH|1DK|1DN|1DQ|1DT|1DW|1DZ|1Dc|1Df|1Di|1Dl|1Do|1Dr|1Du|1Dw|1Dz|1E1|1E4|1E6|1E9|1EB|1EE|1EG|1EJ|1EL|1EO|1EQ|1ET|1EV|1EY|1Ea|1Ed|1Ef|1Ei|1Ek|1En|1Ep|1Es|1Ev|1Ey|1F1|1F4|1F7|1FA|1FC|1FF|1FH|1FK|1FM|1FP|1FR|1FU|1FW|1FZ|1Fb|1Fe|1Fg|1Fj|1Fl|1Fo|1Fq|1Ft|1Fv|1Fy|1G0|1G3|1G5|1G8|1GB|1GE|1GH|1GK|1GN|1GQ|1GS|1GV|1GX|1Ga|1Gc|1Gf|1Gh|1Gk|1Gm|1Gp|1Gr|1Gu|1Gw|1Gz|1H1|1H4|1H6|1H9|1HB|1HE|1HG|1HJ|1HL|1HO|1HR|1HU|1HX|1Ha|1Hd|1Hg|1Hi|1Hl|1Hn|1Hq|1Hs|1Hv|1Hx|1I0|1I2|1I5|1I7|1IA|1IC|1IF|1IH|1IK|1IM|1IP|1IR|1IU|1IW|1IZ|1Ib|1Ie|1Ih|1Ik|1In|1Iq|1It|1Iw|1Iy|1J1|1J3|1J6|1J8|1JB|1JD|1JG|1JI|1JL|1JN|1JQ|1JS|1JV|1JX|1Ja|1Jc|1Jf|1Jh|1Jk|1Jm|1Jp|1Jr|1Ju|1Jx|1K0|1K3|1K6|1K9|1KC|1KE|1KH|1KJ|1KM|1KO|1KR|1KT|1KW|1KY|1Kb|1Kd|1Kg|1Ki|1Kl|1Kn|1Kq|1Ks|1Kv|1Kx|1L0|1L2|1L5|1L7|1LA|1LD|1LG|1LJ|1LM|1LP|1LS|1LU|1LX|1LZ|1Lc|1Le|1Lh|1Lj|1Lm|1Lo|1Lr|1Lt|1Lw|1Ly|1M1|1M3|1M6|1M8|1MB|1MD|1MG|1MI|1ML|1MN|1MQ|1MT|1MV|1MY|1Ma|1Md|1Mg|1Mi|1Ml|1Mn|1Mq|1Mt|1Mw|1Mz|1N2|1N5|1N8|1NB|1ND|1NG|1NI|1NL|1NN|1NQ|1NS|1NV|1NX|1Na|1Nc|1Nf|1Nh|1Nk|1Nm|1Np|1Nr|1Nu|1Nw|1Nz|1O1|1O4|1O6|1O9|1OC|1OF|1OI|1OL|1OO|1OR|1OT|1OW|1OY|1Ob|1Od|1Og|1Oi|1Ol|1On|1Oq|1Os|1Ov|1Ox|1P0|1P2|1P5|1P7|1PA|1PC|1PF|1PH|1PK|1PM|1PP|1PS|1PV|1PY|1Pb|1Pe|1Ph|1Pj|1Pm|1Po|1Pr|1Pt|1Pw|1Py|1Q1|1Q3|1Q6|1Q8|1QB|1QD|1QG|1QI|1QL|1QN|1QQ|1QS|1QV|1QX|1Qa|1Qc|1Qf|1Qi|1Ql|1Qo|1Qr|1Qu|1Qx|1Qz|1R2|1R4|1R7|1R9|1RC|1RE|1RH|1RJ|1RM|1RO|1RR|1RT|1RW|1RY|1Rb|1Rd|1Rg|1Ri|1Rl|1Rn|1Rq|1Rs|1Rv|1Ry|1S1|1S4|1S7|1SA|1SD|1SF|1SI|1SK|1SN|1SP|1SS|1SU|1SX|1SZ|1Sc|1Se|1Sh|1Sj|1Sm|1So|1Sr|1St|1Sw|1Sy|1T1|1T3|1T6|1T8|1TB|1TE|1TH|1TK|1TN|1TQ|1TT|1TW|1TZ|1Tc|1Tf|1Ti|1Tl|1To|1Tr|1Tu|1Tx|1U0|1U3|1U6|1U9|1UC|1UF|1UI|1UL|1UO|1UR|1UU|1UX|1Ua|1Ud|1Ug|1Uj|1Um|1Up|1Us|1Uv|1Uy|1V1|1V4|1V7|1VA|1VD|1VG|1VJ|1VM|1VP|1VS|1VV|1VY|1Vb|1Ve|1Vh|1Vk|1Vn|1Vq|1Vt|1Vw|1Vz|1W2|1W5|1W7|1WA|1WC|1WF|1WH|1WK|1WM|1WP|1WR|1WU|1WW|1WZ|1Wb|1We|1Wg|1Wj|1Wl|1Wo|1Wq|1Wt|1Wv|1Wy|1X0|1X3|1X6|1X9|1XC|1XF|1XI|1XL|1XO|1XR|1XU|1XX|1Xa|1Xd|1Xf|1Xi|1Xl|1Xo|1Xr|1Xu|1Xx|1Y0|1Y2|1Y5|1Y7|1YA|1YD|1YG|1YJ|1YM|1YP|1YS|1YU|1YX|1YZ|1Yc|1Ye|1Yh|1Yj|1Ym|1Yo|1Yr|1Yt|1Yw|1Yy|1Z1|1Z3|1Z6|1Z8|1ZB|1ZD|1ZG|1ZI|1ZL|1ZN|1ZQ|1ZT|1ZW|1ZZ|1Zc|1Zf|1Zi|1Zk|1Zn|1Zp|1Zs|1Zu|1Zx|1Zz|1a2|1a4|1a7|1a9|1aC|1aE|1aH|1aJ|1aM|1aO|1aR|1aT|1aW|1aY|1ab|1ad|1ag|1aj|1am|1ap|1as|1av|1ay|1b1|1b3|1b6|1b9|1bC|1bF|1bI|1bL|1bO|1bQ|1bT|1bW|1bZ|1bc|1bf|1bi|1bk|1bm|1bo|1br|1bt|1bw|1by|1c1|1c3|1c6|1c8|1cB|1cD|1cG|1cI|1cK|1cM|1cP|1cR|1cU|1cW|1cZ|1cb|1ce|1cg|1cj|1cl|1co|1cr|1cu|1cx|1d0|1d3|1d6|1d8|1dB|1dD|1dG|1dI|1dL|1dN|1dQ|1dS|1dV|1dX|1da|1dc|1df|1dh|1dk|1dm|1dp|1dr|1du|1dw|1dz|1e1|1e4|1e7|1eA|1eD|1eG|1eJ|1eM|1eO|1eR|1eT|1eW|1eY|1eb|1ed|1eg|1ei|1el|1en|1eq|1es|1ev|1ex|1f0|1f2|1f5|1f7|1fA|1fC|1fF|1fH|1fK|1fN|1fQ|1fT|1fW|1fZ|1fc|1fe|1fh|1fj|1fm|1fo|1fr|1ft|1fw|1fy|1g1|1g3|1g6|1g8|1gB|1gD|1gG|1gI|1gL|1gN|1gQ|1gS|1gV|1gX|1ga|1gc|1gf|1gi|1gl|1go|1gr|1gu|1gw|1gy|1h0|1h3|1h5|1h8|1hA|1hD|1hF|1hI|1hK|1hN|1hP|1hS|1hU|1hW|1hY|1hb|1hd|1hg|1hi|1hl|1hn|1hq|1hs|1hv|1hx|1i0|1i2|1i5|1i8|1iB|1iE|1iH|1iK|1iM|1iO|1iQ|1iT|1iV|1iY|1ia|1id|1if|1ii|1ik|1in|1ip|1is|1iu|1iw|1iy|1j1|1j3|1j6|1j8|1jB|1jD|1jG|1jI|1jL|1jN|1jQ|1jT|1jW|1jZ|1jc|1jf|1ji|1jk|1jn|1jp|1js|1ju|1jx|1jz|1k2|1k4|1k7|1k9|1kC|1kE|1kH|1kJ|1kM|1kO|1kR|1kT|1kW|1kY|1kb|1kd|1kg|1kj|1km|1kp|1ks|1kv|1ky|1l0|1l3|1l5|1l8|1lA|1lD|1lF|1lI|1lK|1lN|1lP|1lS|1lU|1lX|1lZ|1lc|1le|1lh|1lj|1lm|1lo|1lr|1lt|1lw|1lz|1m2|1m5|1m8|1mB|1mE|1mG|1mJ|1mL|1mO|1mQ|1mT|1mV|1mY|1ma|1md|1mf|1mi|1mk|1mn|1mp|1ms|1mu|1mx|1mz|1n2|1n4|1n7|1n9|1nC|1nF|1nH|1nK|1nM|1nP|1nS|1nV|1nY|1nb|1ne|1nh|1nj|1nm|1no|1nr|1nt|1nw|1ny|1o1|1o3|1o6|1o8|1oB|1oD|1oG|1oI|1oL|1oN|1oQ|1oS|1oV|1oX|1oa|1oc|1of|1oi|1ol|1oo|1or|1ou|1ox|1oz|1p2|1p4|1p7|1p9|1pC|1pE|1pH|1pJ|1pM|1pO|1pR|1pT|1pW|1pY|1pb|1pd|1pg|1pi|1pl|1pn|1pq|1ps|1pv|1py|1q1|1q4|1q7|1qA|1qD|1qF|1qI|1qK|1qN|1qP|1qS|1qU|1qX|1qZ|1qc|1qe|1qh|1qj|1qm|1qo|1qr|1qt|1qw|1qy|1r1|1r3|1r6|1r8|1rB|1rE|1rH|1rK|1rN|1rQ|1rT|1rV|1rY|1ra|1rd|1rf|1ri|1rk|1rn|1rp|1rs|1ru|1rx|1rz|1s2|1s4|1s7|1s9|1sC|1sE|1sH|1sJ|1sM|1sO|1sR|1sU|1sX|1sa|1sd|1sg|1sj|1sm|1sp|1ss|1sv|1sy|1t1|1t4|1t7|1tA|1tD|1tG|1tJ|1tM|1tP|1tS|1tV|1tY|1tb|1te|1th|1tk|1tn|1tq|1tt|1tw|1tz|1u2|1u5|1u8|1uB|1uE|1uH|1uK|1uN|1uQ|1uT|1uW|1uZ|1uc|1uf|1ui|1ul|1uo|1ur|1uu|1ux|1v0|1v3|1v6|1v9|1vC|1vF|1vI|1vL|1vO|1vR|1vU|1vX|1va|1vd|1vg|1vj|1vm|1vp|1vs|1vv|1vy|1w1|1w4|1w7|1wA|1wD|1wG|1wJ|1wM|1wP|1wS|1wV|1wY|1wb|1we|1wh|1wk|1wn|1wq|1wt|1ww|1wz|1x2|1x5|1x8|1xB|1xE|1xH|1xK|1xN|1xQ|1xT|1xW|1xZ|1xc|1xf|1xi|1xl|1xo|1xr|1xu|1xx|1y0|1y3|1y6|1y9|1yC|1yF|1yI|1yL|1yN|1yQ|1yS|1yV|1yX|1ya|1yc|1yf|1yh|1yk|1ym|1yp|1yr|1yu|1yw|1yz|1z1|1z4|1z6|1z9|1zB|1zE|1zG|1zJ|1zL|1zO|1zQ|1zT|1zV|1zY|1za|1zd|1zf|1zi|1zk|1zn|1zp|1zs|1zu|1zx|1zz|202|204|207|209|20C|20E|20H|20J|20M|20O|20R|20T|20W|20Y|20b|20d|20g|20i|20l|20n|20q|20s|20v|20x|210|212|215|217|21A|21C|21F|21H|21K|21M|21P|21R|21U|21W|21Z|21b|21e|21g|21j|21l|21o|21q|21t|21v|21y|220|223|225|228|22A|22D|22F|22I|22K|22N|22P|22S|22U|22X|22Z|22c|22e|22h|22j|22m|22o|22r|22t|22w|22y|231|233|236|238|23B|23D|23G|23I|23L|23N|23Q|23S|23V|23X|23a|23c|23f|23h|23k|23m|23p|23r|23u|23w|23z|241|244|246|249|24B|24E|24G|24J|24L|24O|24Q|24T|24V|24Y|24a|24d|24f|24i|24k|24n|24p|24s|24u|24x|24z|252|254|257|259|25C|25E|25H|25J|25M|25O|25R|25T|25W|25Y|25b|25d|25g|25i|25l|25n|25q|25s|25v|25x|260|262|265|267|26A|26C|26F|26I|26L|26O|26R|26U|26X|26Z|26c|26e|26h|26j|26m|26o|26r|26t|26w|26y|271|273|276|278|27B|27D|27G|27I|27L|27N|27Q|27S|27V|27X|27a|27c|27f|27h|27k|27m|27p|27r|27u|27w|27z|281|284|286|289|28B|28E|28G|28J|28L|28O|28Q|28T|28V|28Y|28a|28d|28f|28i|28k|28n|28p|28s|28u|28x|28z|292|294|297|299|29C|29E|29H|29J|29M|29O|29R|29T|29W|29Y|29b|29d|29g|29i|29l|29n|29q|29s|29v|29x|2A0|2A2|2A5|2A7|2AA|2AC|2AF|2AH|2AK|2AM|2AP|2AR|2AU|2AW|2AZ|2Ab|2Ae|2Ag|2Aj|2Al|2Ao|2Aq|2At|2Av|2Ay|2B0|2B3|2B5|2B8|2BA|2BD|2BF|2BI|2BK|2BN|2BP|2BS|2BU|2BX|2BZ|2Bc|2Be|2Bh|2Bj|2Bm|2Bo|2Br|2Bt|2Bw|2By|2C1|2C3|2C6|2C8|2CB|2CD|2CG|2CI|2CL|2CN|2CQ|2CS|2CV|2CX|2Ca|2Cc|2Cf|2Ch|2Ck|2Cm|2Cp|2Cr|2Cu|2Cw|2Cz|2D1|2D4|2D6|2D9|2DB|2DE|2DG|2DJ|2DL|2DO|2DQ|2DT|2DV|2DY|2Da|2Dd|2Df|2Di|2Dk|2Dn|2Dp|2Ds|2Du|2Dx|2Dz|2E2|2E4|2E7|2E9|2EC|2EE|2EH|2EJ|2EM|2EO|2ER|2EU|2EX|2Ea|2Ed|2Eg|2Ej|2Em|2Ep|2Es|2Ev|2Ey|2F1|2F4|2F7|2FA|2FD|2FG|2FJ|2FM|2FP|2FS|2FV|2FY|2Fb|2Fe|2Fh|2Fj|2Fm|2Fp|2Fs|2Fv|2Fz|2G2|2G5|2G8|2GB|2GE|2GH|2GK|2GN|2GR|2GU|2GX|2Ga|2Gd|2Gg|2Gj|2Gm|2Gp|2Gs|2Gv|2Gy|2H1|2H4|2H7|2HA|2HD|2HG|2HJ|2HM|2HP|2HS|2HV|2HY|2Hb|2He|2Hh|2Hk|2Hn|2Hq|2Ht|2Hw|2Hz|2I2|2I5|2I8|2IB|2IE|2IH|2IK|2IN|2IQ|2IT|2IW|2IZ|2Ic|2If|2Ii|2Il|2Io|2Ir|2Iu|2Ix|2Iz|2J2|2J5|2J8|2JB|2JE|2JG|2JJ|2JM|2JP|2JS|2JV|2JY|2Jb|2Je|2Jh|2Jk|2Jn|2Jq|2Jt|2Jw|2Jz|2K2|2K5|2K7|2KA|2KD|2KG|2KJ|2KM|2KP|2KS|2KV|2KY|2Kb|2Ke|2Kh|2Kk|2Kn|2Kq|2Kt|2Kw|2Kz|2L2|2L5|2L8|2LB|2LE|2LH|2LK|2LN|2LQ|2LT|2LW|2LZ|2Lc|2Lf|2Li|2Ll|2Lo|2Lr|2Lu|2Lx|2M0|2M3|2M6|2M9|2MC|2ME|2MH|2MJ|2MM|2MP|2MS|2MV|2MY|2Mb|2Me|2Mh|2Mk|2Mn|2Mp|2Ms|2Mv|2My|2N1|2N4|2N7|2NA|2ND|2NG|2NJ|2NM|2NP|2NS|2NV|2NY|2Nb|2Nd|2Ng|2Nj|2Nm|2Np|2Ns|2Nv|2Ny|2O2|2O5|2O8|2OB|2OE|2OH|2OK|2ON|2OQ|2OT|2OW|2OZ|2Oc|2Of|2Oi|2Ol|2Oo|2Or|2Ou|2Ox|2P0|2P3|2P6|2P9|2PC|2PE|2PH|2PK|2PN|2PQ|2PT|2PW|2PZ|2Pc|2Pf|2Pi|2Pl|2Po|2Pr|2Pu|2Px|2Q0|2Q3|2Q6|2Q9|2QC|2QF|2QI|2QL|2QO|2QR|2QU|2QX|2Qa|2Qd|2Qg|2Qj|2Qm|2Qp|2Qs|2Qv|2Qy|2R1|2R4|2R7|2RA|2RD|2RG|2RJ|2RM|2RP|2RS|2RV|2RY|2Rb|2Re|2Rh|2Rk|2Rn|2Rq|2Rt|2Rw|2Rz|2S2|2S5|2S8|2SB|2SE|2SH|2SK|2SN|2SQ|2ST|2SW|2SZ|2Sc|2Sf|2Si|2Sl|2So|2Sr|2Su|2Sx|2T0|2T3|2T6|2T9|2TC|2TF|2TI|2TL|2TO|2TR|2TU|2TX|2Ta|2Td|2Tg|2Tj|2Tm|2Tp|2Ts|2Tv|2Ty|2U1|2U4|2U7|2UA|2UD|2UF|2UI|2UL|2UO|2UR|2UU|2UY|2Ub|2Ue|2Uh|2Uk|2Um|2Up|2Us|2Uv|2Ux|2V0|2V2|2V5|2V8|2VB|2VD|2VG|2VI|2VL|2VN|2VQ|2VS|2VV|2VX|2Va|2Vc|2Vf|2Vh|2Vk|2Vm|2Vp|2Vs|2Vv|2Vy|2W1|2W3|2W6|2W8|2WB|2WE|2WH|2WK|2WN|2WQ|2WT|2WW|2WZ|2Wc|2Wf|2Wi|2Wl|2Wo|2Wr|2Wu|2Wx|2X0|2X3|2X6|2X9|2XC|2XF|2XH|2XK|2XN|2XQ|2XT|2XW|2XZ|2Xb|2Xe|2Xh|2Xk|2Xn|2Xq|2Xt|2Xv|2Xy|2Y1|2Y4|2Y7|2YA|2YD|2YG|2YJ|2YM|2YP|2YS|2YV|2YY|2Yb|2Ye|2Yh|2Yk|2Yn|2Yq|2Yt|2Yw|2Yz|2Z2|2Z5|2Z8|2ZB|2ZE|2ZH|2ZK|2ZN|2ZQ|2ZT|2ZW|2ZZ|2Zc|2Zf|2Zh|2Zk|2Zm|2Zp|2Zs|2Zv|2Zy|2a1|2a4|2a7|2aA|2aD|2aG|2aI|2aL|2aN|2aQ|2aS|2aV|2aY|2ab|2ae|2ah|2ak|2an|2aq|2at|2aw|2az|2b2|2b5|2b7|2bA|2bC|2bF|2bH|2bK|2bN|2bP|2bS|2bU|2bX|2ba|2bd|2bg|2bj|2bm|2bp|2bs|2bv|2bx|2c0|2c3|2c6|2c8|2cB|2cE|2cH|2cK|2cN|2cQ|2cS|2cV|2cX|2ca|2cc|2cf|2ci|2cl|2co|2cr|2cu|2cx|2d0|2d3|2d6|2d9|2dC|2dF|2dI|2dL|2dO|2dR|2dU|2dX|2da|2dd|2dg|2dj|2dm|2dp|2ds|2dv|2dy|2e1|2e4|2e7|2eA|2eD|2eG|2eJ|2eM|2eP|2eR|2eU|2eW|2eZ|2ec|2ef|2ei|2el|2eo|2er|2eu|2ew|2ez|2f2|2f4|2f7|2f9|2fC|2fE|2fH|2fJ|2fM|2fO|2fR|2fT|2fW|2fY|2fb|2fd|2fg|2fi|2fl|2fn|2fq|2ft|2fw|2fz|2g1|2g4|2g7|2g9|2gC|2gF|2gH|2gK|2gM|2gP|2gS|2gU|2gX|2ga|2gd|2gh|2gk|2gn|2gq|2gt|2gw|2gz|2h2|2h5|2h8|2hB|2hE|2hH|2hK|2hN|2hQ|2hT|2hW|2hZ|2hb|2he|2hg|2hj|2hm|2ho|2hr|2hu|2hx|2i0|2i3|2i6|2i9|2iC|2iF|2iI|2iL|2iO|2iR|2iU|2iX|2ia|2id|2ig|2ij|2im|2ip|2is|2iv|2iy|2j1|2j4|2j6|2j9|2jC|2jF|2jI|2jL|2jO|2jR|2jU|2jX|2ja|2jd|2jg|2jj|2jm|2jp|2jr|2ju|2jx|2k0|2k3|2k6|2k9|2kC|2kF|2kH|2kK|2kM|2kP|2kR|2kU|2kW|2kZ|2kb|2ke|2kh|2kk|2kn|2kq|2ks|2kv|2ky|2l1|2l4|2l7|2lB|2lE|2lG|2lJ|2lM|2lP|2lS|2lV|2lY|2lb|2le|2lh|2lk|2ln|2lq|2lt|2lw|2lz|2m2|2m5|2m8|2mB|2mE|2mH|2mK|2mN|2mP|2mS|2mV|2mY|2mb|2me|2mh|2mk|2mn|2mq|2mt|2mw|2mz|2n2|2n5|2n8|2nB|2nE|2nH|2nJ|2nM|2nP|2nS|2nV|2nY|2nb|2ne|2nh|2nk|2nn|2nq|2nt|2nw|2nz|2o2|2o5|2o8|2oA|2oD|2oF|2oI|2oK|2oN|2oQ|2oT|2oW|2oZ|2oc|2of|2oi|2ol|2oo|2or|2ou|2ox|2p0|2p3|2p6|2p9|2pB|2pE|2pH|2pK|2pN|2pQ|2pT|2pW|2pZ|2pb|2pe|2pg|2pj|2pl|2po|2pq|2pt|2pv|2py|2q1|2q4|2q7|2qA|2qD|2qG|2qI|2qL|2qN|2qQ|2qT|2qW|2qZ|2qc|2qf|2qi|2ql|2qo|2qq|2qt|2qw|2qz|2r2|2r5|2r8|2rB|2rE|2rH|2rK|2rN|2rQ|2rT|2rW|2rZ|2rc|2rf|2ri|2rk|2rn|2rq|2rt|2rv|2ry|2s1|2s4|2s7|2sA|2sD|2sG|2sJ|2sM|2sP|2sS|2sU|2sX|2sa|2sd|2sg|2sj|2sm|2sp|2ss|2sv|2sy|2t1|2t4|2t6|2t9|2tB|2tE|2tG|2tJ|2tL|2tO|2tQ|2tT|2tV|2tY|2ta|2td|2tg|2tj|2tm|2tp|2tr|2tu|2tx|2u0|2u2|2u5|2u7|2uA|2uD|2uG|2uJ|2uM|2uP|2uS|2uV|2uY|2ua|2ud|2ug|2uj|2ul|2uo|2uq|2ut|2uv|2uy|2v0|2v3|2v6|2v9|2vC|2vF|2vI|2vK|2vN|2vQ|2vT|2vV|2vY|2va|2vd|2vf|2vi|2vk|2vn|2vp|2vs|2vv|2vy|2w1|2w3|2w6|2w9|2wC|2wF|2wI|2wK|2wN|2wP|2wS|2wU|2wX|2wa|2wd|2wf|2wi|2wl|2wo|2wr|2wu|2ww|2wz|2x2|2x5|2x8|2xB|2xE|2xH|2xK|2xN|2xQ|2xT|2xW|2xZ|2xc|2xf|2xi|2xl|2xo|2xq|2xt|2xv|2xy|2y1|2y4|2y7|2yA|2yD|2yG|2yJ|2yM|2yP|2yS|2yV|2yY|2yb|2ye|2yh|2yk|2yn|2yq|2yt|2yw|2yy|2z1|2z4|2z6|2z9|2zC|2zF|2zI|2zL|2zP|2zS|2zV|2zY|2zb|2ze|2zh|2zk|2zn|2zq|2zt|2zw|2zz|302|304|307|30A|30D|30G|30J|30M|30P|30S|30V|30Y|30b|30d|30g|30i|30l|30n|30q|30s|30v|30x|310|312|315|317|31A|31C|31F|31H|31K|31M|31P|31R|31U|31W|31Z|31b|31e|31g|31j|31l|31o|31q|31t|31w|31z|322|325|328|32B|32E|32H|32J|32M|32O|32R|32T|32W|32Y|32b|32d|32g|32i|32l|32n|32q|32s|32v|32x|330|333|336|339|33C|33F|33I|33L|33O|33R|33U|33X|33a|33d|33g|33j|33m|33p|33s|33v|33x|340|343|345|348|34A|34D|34F|34I|34L|34N|34Q|34T|34W|34Z|34c|34e|34h|34j|34m|34o|34r|34t|34w|34z|352|355|358|35B|35E|35H|35J|35M|35O|35R|35T|35W|35Y|35b|35e|35h|35k|35n|35p|35s|35u|35x|35z|362|365|368|36B|36E|36G|36J|36M|36P|36R|36U|36W|36Z|36b|36e|36h|36k|36n|36q|36t|36v|36y|370|373|376|379|37C|37F|37H|37K|37M|37P|37R|37U|37W|37Z|37b|37e|37g|37j|37l|37o|37q|37t|37v|37y|380|383|385|388|38A|38D|38F|38I|38K|38N|38P|38S|38U|38X|38Z|38c|38e|38h|38j|38m|38p|38s|38v|38y|391|394|396|399|39C|39E|39H|39K|39N|39Q|39S|39V|39Y|39a|39d|39g|39j|39l|39o|39r|39t|39w|39z|3A2|3A5|3A8|3AA|3AD|3AF|3AI|3AL|3AO|3AR|3AU|3AX|3Aa|3Ad|3Ag|3Aj|3Am|3Ao|3Ar|3At|3Aw|3Az|3B2|3B5|3B8|3BB|3BE|3BH|3BK|3BN|3BQ|3BT|3BW|3BZ|3Bc|3Bf|3Bi|3Bl|3Bo|3Br|3Bu|3Bw|3Bz|3C1|3C4|3C7|3CA|3CC|3CF|3CH|3CK|3CN|3CQ|3CT|3CW|3CZ|3Cc|3Cf|3Ci|3Cl|3Cp|3Cs|3Cv|3Cy|3D1|3D3|3D6|3D8|3DB|3DD|3DF|3DH|3DK|3DM|3DP|3DS|3DV|3DY|3Db|3De|3Dh|3Dk|3Dn|3Dq|3Dt|3Dw|3Dz|3E2|3E5|3E8|3EB|3EE|3EH|3EK|3EN|3EQ|3ET|3EW|3EZ|3Ec|3Ef|3Ei|3El|3Eo|3Er|3Eu|3Ex|3F0|3F3|3F6|3F9|3FC|3FF|3FI|3FL|3FO|3FR|3FU|3FX|3Fa|3Fd|3Fg|3Fj|3Fm|3Fp|3Fs|3Fv|3Fy|3G1|3G4|3G7|3GA|3GD|3GG|3GJ|3GM|3GP|3GS|3GV|3GY|3Gb|3Ge|3Gh|3Gk|3Gn|3Gq|3Gt|3Gw|3Gz|3H2|3H5|3H8|3HB|3HE|3HH|3HK|3HN|3HQ|3HT|3HW|3HZ|3Hc|3Hf|3Hi|3Hl|3Ho|3Hr|3Hu|3Hx|3I0|3I3|3I6|3I9|3IC|3IF|3II|3IL|3IO|3IR|3IU|3IX|3Ia|3Id|3Ig|3Ij|3Im|3Ip|3Is|3Iv|3Iy|3J1|3J4|3J7|3JA|3JD|3JG|3JJ|3JM|3JP|3JS|3JV|3JY|3Jb|3Je|3Jh|3Jk|3Jn|3Jq|3Jt|3Jw|3Jz|3K2|3K5|3K8|3KB|3KE|3KH|3KK|3KN|3KQ|3KT|3KW|3KZ|3Kc|3Kf|3Ki|3Kl|3Ko|3Kr|3Ku|3Kx|3L0|3L3|3L6|3L9|3LC|3LF|3LI|3LL|3LO|3LR|3LU|3LX|3La|3Ld|3Lg|3Lj|3Lm|3Lp|3Ls|3Lv|3Ly|3M1|3M4|3M7|3MA|3MD|3MG|3MJ|3MM|3MP|3MS|3MV|3MY|3Mb|3Me|3Mh|3Mk|3Mn|3Mq|3Mt|3Mw|3Mz|3N2|3N5|3N8|3NB|3NE|3NH|3NK|3NN|3NQ|3NT|3NW|3NZ|3Nc|3Nf|3Ni|3Nl|3No|3Nr|3Nu|3Nx|3O0|3O3|3O6|3O9|3OC|3OF|3OI|3OL|3OO|3OR|3OU|3OX|3Oa|3Od|3Og|3Oj|3Om|3Op|3Os|3Ov|3Oy|3P1|3P4|3P7|3PA|3PD|3PG|3PJ|3PM|3PP|3PS|3PV|3PY|3Pb|3Pe|3Ph|3Pk|3Pn|3Pq|3Pt|3Pw|3Pz"],"3Q0"]');
// EXTERNAL MODULE: ./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/index.js
var dist = __webpack_require__("./node_modules/.pnpm/compress-json@2.1.2/node_modules/compress-json/dist/index.js");
;// CONCATENATED MODULE: ./src/views/templates/tab-link.html
// Module
var tab_link_code = "<template id=\"ta-x-template-tabs-link\"><li class=\"js-ta-x-tabs-link ta-x-tabs-link\" data-tab-id=\"#ta-x-tabs-{tab.id}\">{tab.link}</li></template><template id=\"ta-x-template-tabs-content\"><div class=\"js-ta-x-tabs-content ta-x-tabs-content\" id=\"ta-x-tabs-{tab.id}\">{tab.content}</div></template>";
// Exports
/* harmony default export */ const tab_link = (tab_link_code);
;// CONCATENATED MODULE: ./src/features/emojis/emojis.html
// Module
var emojis_code = "<div class=\"js-ta-x-tabs ta-x-tabs js-ta-x-emojis ta-x-emojis\"><a onclick=\"return DropdownButtonPanel_Toggle(this),!1\" title=\"Insert TaX Emoji\" href=\"#\"> <i class=\"fa fa-smile-o\"></i> </a><div class=\"smileydropdown dropdownbuttonpanel ta-x-emoji-dropdown\" style=\"display:none\"><ul class=\"js-ta-x-tabs-link-container ta-x-tabs-link-container\"></ul></div></div>";
// Exports
/* harmony default export */ const emojis = (emojis_code);
;// CONCATENATED MODULE: ./src/features/emojis/index.ts








const apply = async (containers, emojiContent) => {
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i];
    const trueAchievementsContent = emojiContent.querySelector("#ta-x-tabs-trueachievements");
    let insertAtCursorElement = null;
    await (0,utilities/* waitForImages */.C7)(container);
    [...container.querySelectorAll(".smileydropdown span")].forEach((smiley) => {
      if (!insertAtCursorElement) {
        insertAtCursorElement = (0,utilities/* extractBetween */._o)("'", smiley.onclick.toString());
      }
      trueAchievementsContent.appendChild(smiley);
    });
    [...container.querySelectorAll(".smileydropdown")].forEach(
      (smiley) => smiley.parentElement.remove()
    );
    const quickReplyEmojiToolbar = await (0,utilities/* waitForElement */.br)(".toolbar .formatbuttons:last-child", container);
    emojiContent = (0,helpers/* template */.XK)(emojiContent, { emojis: { id: insertAtCursorElement } });
    quickReplyEmojiToolbar.appendChild(emojiContent);
    const firstTab = await (0,utilities/* waitForElement */.br)(`.${globals/* Constants */.gT.Styles.Components.Tab.tabLink}:first-child`, container);
    pub_sub.publish("tabs:set", firstTab);
  }
};
const buildEmojis = () => {
  const groupedEmojis = (0,dist/* decompress */.Lj)(emoji_namespaceObject).reduce(
    (accumulator, emoji) => {
      const category = accumulator.get(emoji.group) || [];
      category.push(emoji);
      accumulator.set(emoji.group, category);
      return accumulator;
    },
    /* @__PURE__ */ new Map([["TrueAchievements", []]])
  );
  const parsedDocument = new DOMParser().parseFromString(emojis, "text/html");
  const parsedTemplateDocument = new DOMParser().parseFromString(tab_link, "text/html");
  const emojiButton = parsedDocument.querySelector(`.${globals/* Constants */.gT.Styles.Emojis.featureJs}`);
  const emojiTabs = emojiButton.querySelector(`.${globals/* Constants */.gT.Styles.Components.Tab.tabLinkContainer}`);
  Array.from(groupedEmojis.entries()).forEach((emojiGroup) => {
    const tabLink = parsedTemplateDocument.querySelector(`#${globals/* Constants */.gT.Templates.Components.Tab.tabLink}`).content.firstElementChild.cloneNode(true);
    const tabId = emojiGroup[0].replace(/[^A-Z0-9]/gi, "").toLowerCase();
    const templatedTabLink = (0,helpers/* template */.XK)(tabLink, {
      tab: { link: emojiGroup[0], id: tabId }
    });
    emojiTabs.appendChild(templatedTabLink);
    const tabContent = parsedTemplateDocument.querySelector(`#${globals/* Constants */.gT.Templates.Components.Tab.tabContent}`).content.firstElementChild.cloneNode(true);
    let emojiHtml = "";
    emojiGroup[1].forEach((emoji) => {
      emojiHtml += `<span onclick="InsertAtCursor('{emojis.id}','${emoji.char}', 'ta-x-emoji-dropdown'); return false;" title='${emoji.name}'>${emoji.char}</span>`;
    });
    const templatedTabContent = (0,helpers/* template */.XK)(tabContent, {
      tab: { content: emojiHtml, link: emojiGroup[0], id: tabId }
    });
    emojiTabs.parentNode.append(templatedTabContent);
  });
  return emojiButton;
};
/* harmony default export */ const features_emojis = (async () => {
  if (!globals/* emojis */.SP.enabled) {
    return;
  }
  const elementSelectors = [
    "#aeb_txtQuickReply",
    "#aeb_aebMessageBody",
    "#aeb_aebMessage",
    "#aeb_txtAddSubComment",
    "#aeb_aebComment"
  ];
  const replyContainer = await (0,utilities/* waitForElement */.br)(elementSelectors.join(", "));
  if (!replyContainer) {
    return;
  }
  const emojiContent = buildEmojis();
  (0,utilities/* allConcurrently */.Eh)(
    "Emojis - Apply",
    elementSelectors.map((selector) => ({
      name: `emojis-${selector}`,
      task: async () => {
        const containers = await (0,utilities/* waitForElements */.Sn)(selector);
        if (!containers || containers.length === 0) {
          return;
        }
        await apply(containers, emojiContent);
      }
    })),
    elementSelectors.length
  );
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/manage-walkthrough.html
// Module
var manage_walkthrough_code = "<div class=\"js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container\"></div><a class=\"button js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-ready-for-review-button\" onclick='return Postback(\"btnReadyForReview_click\"),!1' title=\"Ready for review\" href=\"#\" id=\"btnReadyForReview\"> <img alt=\"Ready for review\" title=\"Ready for review\" src=\"/images/icons/tick.png\"> Ready for review </a><div class=\"buttons js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-missing-buttons-container\"><a class=\"button js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-add-page-button\"> <img alt=\"Add page\" title=\"Add page\" height=\"16\" src=\"/images/icons/addtotrophycasesmall.png\" width=\"16\"> <span>Add page</span> </a><a class=\"button js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-preview-button\"> <img alt=\"Preview\" height=\"16\" src=\"/images/icons/previewwalkthrough.png\" title=\"Preview\" width=\"16\"> <span>Preview</span> </a><a class=\"button js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-view-content-button\"> <img alt=\"View and edit content\" title=\"View and edit content\" height=\"16\" src=\"/images/icons/previewwalkthrough.png\" width=\"16\"> <span>View and edit content</span> </a></div>";
// Exports
/* harmony default export */ const manage_walkthrough = (manage_walkthrough_code);
// EXTERNAL MODULE: ./src/globals/regex.ts
var regex = __webpack_require__("./src/globals/regex.ts");
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/default-status.ts



const changeToDefaultStatus = async () => {
  if (!globals/* manageWalkthrough */.Ax.manageWalkthroughDefaultStatus) {
    return;
  }
  if (regex/* StaffRegex */.nW.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId()) {
    return;
  }
  const status = await (0,utilities/* waitForElement */.br)("#ddlStatusFilter");
  if (status.querySelector("[selected]") === null && status.value !== globals/* manageWalkthrough */.Ax.manageWalkthroughDefaultStatusValue) {
    status.value = globals/* manageWalkthrough */.Ax.manageWalkthroughDefaultStatusValue;
    status.onchange(null);
  }
};
/* harmony default export */ const default_status = ({ changeToDefaultStatus });

;// CONCATENATED MODULE: ./src/views/templates/manage-walkthrough-achievement-row.html
// Module
var manage_walkthrough_achievement_row_code = "<template id=\"ta-x-template-manage-walkthrough-achievement-row\"><tr><td class=\"point\"></td><td class=\"c1\">{element.outerHTML}</td><td class=\"c2\"></td><td class=\"dlop plain\"></td></tr></template>";
// Exports
/* harmony default export */ const manage_walkthrough_achievement_row = (manage_walkthrough_achievement_row_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/clickable-table-links.ts




const clickableAchievements = async (walkthroughContainer, walthroughPreviewDocument) => {
  if (await (0,utilities/* waitForElement */.br)("#chWalkthroughAchievements", walkthroughContainer)) {
    const parsedDocument = new DOMParser().parseFromString(manage_walkthrough_achievement_row, "text/html");
    const walkthroughAchievements = [
      ...walkthroughContainer.querySelectorAll("#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1")
    ];
    let walkthroughAchievementContainer = walkthroughContainer.querySelector(
      "#chWalkthroughAchievements #scrolllstWalkthroughAchievementID tbody"
    );
    if (!walkthroughAchievementContainer) {
      const walkthroughAchievementTable = walkthroughContainer.querySelector(
        "#chWalkthroughAchievements #scrolllstWalkthroughAchievementID table"
      );
      walkthroughAchievementContainer = walkthroughAchievementTable.appendChild(document.createElement("tbody"));
    }
    const games = [
      ...walthroughPreviewDocument.querySelectorAll(".walkthroughsummary .games a.gamelink")
    ];
    await (0,utilities/* allConcurrently */.Eh)(
      "ClickableAchievements - Games",
      games.map((game) => ({
        name: `manage-walkthrough-clickable-table-links-clickable-achievements-${game.innerText}`,
        task: async () => {
          const gameResponse = await (0,helpers/* memoizeFetch */.FS)(game.href);
          const gameDocument = new DOMParser().parseFromString(gameResponse, "text/html");
          const gameAchievements = [...gameDocument.querySelectorAll("main ul.ach-panels li a.title")];
          await (0,utilities/* allConcurrently */.Eh)(
            "ClickableAchievements - Achievements",
            gameAchievements.map((gameAchievement) => ({
              name: `manage-walkthrough-clickable-table-links-clickable-achievements-${game.innerText}-${gameAchievement.innerText.trim()}`,
              task: () => {
                const achievementName = gameAchievement.innerText.trim();
                const walkthroughAchievement = walkthroughAchievements.find(
                  (walkthroughAchievement2) => walkthroughAchievement2.innerText.toLowerCase() === achievementName.toLowerCase()
                );
                if (walkthroughAchievement) {
                  walkthroughAchievement.innerText = "";
                  walkthroughAchievement.innerHTML = gameAchievement.outerHTML;
                  const link = walkthroughAchievement.querySelector("a");
                  link.href = globals/* AchievementsRegex */.KH.Test.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;
                } else {
                  const clonedAchievementRow = parsedDocument.querySelector(
                    `#${globals/* Constants */.gT.Templates.StaffWalkthroughImprovements.ManageWalkthroughPage.achievementRow}`
                  ).content.firstElementChild.cloneNode(true);
                  const achievementRow2 = (0,helpers/* template */.XK)(clonedAchievementRow, {
                    element: gameAchievement
                  });
                  const link = achievementRow2.querySelector("a");
                  achievementRow2.querySelector("a").href = globals/* AchievementsRegex */.KH.Test.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;
                  walkthroughAchievementContainer.appendChild(achievementRow2);
                }
              }
            })),
            5
          );
        }
      }))
    );
    const achievementsTotal = walkthroughContainer.querySelector(
      "#chWalkthroughAchievements #lstWalkthroughAchievementID .total"
    );
    achievementsTotal.innerText = `${achievementsTotal.innerText}/${[
      ...walkthroughAchievementContainer.querySelectorAll(
        "#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1"
      )
    ].length}`;
  }
};
const clickableGames = async (walkthroughContainer, walthroughPreviewDocument) => {
  if (await (0,utilities/* waitForElement */.br)("#chWalkthroughGamers", walkthroughContainer)) {
    const games = [
      ...walthroughPreviewDocument.querySelectorAll(".walkthroughsummary .games a.gamelink")
    ];
    [...walkthroughContainer.querySelectorAll("#scrolllstWalkthroughGames .c1")].forEach((el) => {
      const gameName = el.innerText.trim();
      const walkthroughPreviewGame = games.find((game) => game.innerText.toLowerCase() === gameName.toLowerCase());
      if (walkthroughPreviewGame) {
        el.innerText = "";
        el.innerHTML = walkthroughPreviewGame.outerHTML;
      }
    });
  }
};
const clickableGamers = async (walkthroughContainer, walthroughPreviewDocument) => {
  if (await (0,utilities/* waitForElement */.br)("#chWalkthroughGamers", walkthroughContainer)) {
    const editors = [
      ...walthroughPreviewDocument.querySelectorAll(".walkthroughsummary .editors dd a")
    ];
    [...walkthroughContainer.querySelectorAll("#scrolllstWalkthroughGamers .c1")].forEach((el) => {
      const gamerName = el.innerText.trim();
      const walkthroughPreviewGamer = editors.find(
        (editor) => editor.innerText.toLowerCase() === gamerName.toLowerCase()
      );
      if (walkthroughPreviewGamer) {
        el.innerText = "";
        el.innerHTML = walkthroughPreviewGamer.outerHTML;
      }
    });
  }
};
const makeTableLinksClickable = async () => {
  if (!globals/* manageWalkthrough */.Ax.clickableTableLinks) {
    return;
  }
  const selectedWalkthrough = await (0,utilities/* waitForElement */.br)("#lstWalkthroughIDselectedrow a");
  if (!selectedWalkthrough) {
    return;
  }
  const walkthroughContainer = document.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`
  );
  const walkthroughId = selectedWalkthrough.getAttribute("data-walkthrough-id");
  const walthroughPreviewResponse = await (0,helpers/* memoizeFetch */.FS)(
    `https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`
  );
  const walthroughPreviewDocument = new DOMParser().parseFromString(walthroughPreviewResponse, "text/html");
  await (0,utilities/* allConcurrently */.Eh)("Manage Walkthrough Page Clickable Table Links", [
    {
      name: "manage-walkthrough-clickable-table-links-clickable-achievements",
      task: async () => await clickableAchievements(walkthroughContainer, walthroughPreviewDocument)
    },
    {
      name: "manage-walkthrough-clickable-table-links-clickable-games",
      task: async () => await clickableGames(walkthroughContainer, walthroughPreviewDocument)
    },
    {
      name: "manage-walkthrough-clickable-table-links-clickable-gamers",
      task: async () => await clickableGamers(walkthroughContainer, walthroughPreviewDocument)
    }
  ]);
};
/* harmony default export */ const clickable_table_links = ({ makeTableLinksClickable });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/auto-select-first.ts



const autoSelectFirst = async () => {
  if (!globals/* manageWalkthrough */.Ax.autoSelectFirst) {
    return;
  }
  if (regex/* StaffRegex */.nW.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId()) {
    return;
  }
  const walkthroughList = await (0,utilities/* waitForElement */.br)("#scrolllstWalkthroughID");
  if (await (0,utilities/* waitForElement */.br)("#lstWalkthroughIDselectedrow", void 0, 1e3) === null && walkthroughList.querySelector("table tr") !== null) {
    walkthroughList.querySelector("table tr a").click();
  }
};
/* harmony default export */ const auto_select_first = ({ autoSelectFirst });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/add-missing-buttons.ts



const addMissingButtons = async () => {
  if (!globals/* manageWalkthrough */.Ax.addMissingButtons) {
    return;
  }
  if (await (0,utilities/* waitForElement */.br)("#lstWalkthroughIDselectedrow", void 0, 1e3) === null) {
    return;
  }
  if (await (0,utilities/* waitForElement */.br)("#txtPageName", void 0, 1e3) === null) {
    return;
  }
  const parsedDocument = new DOMParser().parseFromString(manage_walkthrough, "text/html");
  let buttonContainer = document.querySelector("#chEditWalkthrough .buttons");
  buttonContainer.insertBefore(
    parsedDocument.querySelector(
      `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.readyForReviewButtonJs}`
    ),
    buttonContainer.children[0]
  );
  buttonContainer.parentNode.insertBefore(
    parsedDocument.querySelector(
      `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.missingButtonsContainerJs}`
    ),
    buttonContainer
  );
  buttonContainer = document.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.missingButtonsContainerJs}`
  );
  buttonContainer.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.addPageButtonJs}`
  ).href = 'javascript:Postback("btnAddPage")';
  buttonContainer.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.previewButtonJs}`
  ).href = 'javascript:Postback("btnPreview")';
  buttonContainer.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.viewContentButtonJs}`
  ).href = 'javascript:Postback("btnViewContent")';
};
/* harmony default export */ const add_missing_buttons = ({ addMissingButtons });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/index.ts








let walkthroughContainer;
const manage_walkthrough_applyBody = async () => {
  walkthroughContainer = await (0,utilities/* waitForElement */.br)("#divWalkthroughHolder");
  if (!walkthroughContainer) {
    return;
  }
  const editWalkthrough = await (0,utilities/* waitForElement */.br)("#chEditWalkthrough", walkthroughContainer);
  if (editWalkthrough && await (0,helpers/* until */.C4)(() => walkthroughContainer.childElementCount > 2, 1e3)) {
    const parsedDocument = new DOMParser().parseFromString(manage_walkthrough, "text/html");
    editWalkthrough.after(
      parsedDocument.querySelector(
        `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`
      )
    );
    (0,utilities/* allConcurrently */.Eh)("Manage Walkthrough", [
      { name: "manage-walkthrough-adjust-left-sidebar", task: adjustLeftSidebar },
      { name: "manage-walkthrough-adjust-right-sidebar", task: adjustRightSidebar },
      { name: "manage-walkthrough-adjust-buttons", task: adjustButtons }
    ]);
  }
};
const adjustButtons = async () => {
  const buttonContainer = await (0,utilities/* waitForElement */.br)("#btnWalkthrough_Options", walkthroughContainer);
  if (buttonContainer === null) {
    return;
  }
  let buttonsContainer = null;
  [...buttonContainer.querySelectorAll("li a")].forEach((button) => {
    buttonsContainer = buttonsContainer ? buttonsContainer : button.closest(".buttons");
    if (buttonsContainer) {
      button.classList.add("button");
      buttonsContainer.appendChild(button);
    }
  });
  if (buttonsContainer) {
    buttonsContainer.parentNode.insertBefore(buttonsContainer, buttonsContainer.nextSibling);
  }
};
const adjustRightSidebar = async () => {
  const sideBarContainer = await (0,utilities/* waitForElement */.br)(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`,
    walkthroughContainer
  );
  if (sideBarContainer) {
    const walkthroughAchievementsContainer = await (0,utilities/* waitForElement */.br)("#chWalkthroughAchievements", walkthroughContainer);
    if (walkthroughAchievementsContainer) {
      deDupeAchievements(walkthroughAchievementsContainer);
      sideBarContainer.appendChild(walkthroughAchievementsContainer);
    }
    sideBarContainer.appendChild(await (0,utilities/* waitForElement */.br)("#chWalkthroughGames", walkthroughContainer));
    sideBarContainer.appendChild(await (0,utilities/* waitForElement */.br)("#chWalkthroughGamers", walkthroughContainer));
    sideBarContainer.appendChild(await (0,utilities/* waitForElement */.br)("#chWalkthroughOtherSiteLink", walkthroughContainer));
  }
};
const adjustLeftSidebar = async () => {
  const walkthroughList = await (0,utilities/* waitForElement */.br)("#scrolllstWalkthroughID", walkthroughContainer);
  [...walkthroughList.querySelectorAll("td a")].forEach((anchor) => {
    const walkthroughId = (0,utilities/* toInt */.Hq)((0,utilities/* extractAllBetween */.QF)("'", anchor.href)[1]);
    anchor.setAttribute("data-walkthrough-id", walkthroughId.toString());
  });
};
const deDupeAchievements = (walkthroughAchievementsContainer) => {
  const walkthroughAchievements = [
    ...walkthroughAchievementsContainer.querySelectorAll("#scrolllstWalkthroughAchievementID .c1")
  ];
  const duplicateAchievements = (0,utilities/* getDuplicates */.VB)(
    walkthroughAchievements.map((el) => el.innerText),
    true
  );
  if (duplicateAchievements.length > 0) {
    const currentCount = walkthroughAchievements.length;
    let removedRows = 0;
    for (let i = 0; i < duplicateAchievements.length; i++) {
      const dupeAchievementRows = walkthroughAchievements.filter(
        (walkthroughAchievement) => walkthroughAchievement.innerText.toLowerCase() === duplicateAchievements[i].toLowerCase()
      );
      const firstInstancePageColumn = dupeAchievementRows[0].nextElementSibling;
      for (let j = 1; j < dupeAchievementRows.length; j++) {
        const pageNumber = dupeAchievementRows[j].nextElementSibling.innerText.trim();
        firstInstancePageColumn.innerText += `, ${pageNumber}`;
        dupeAchievementRows[j].closest("tr").remove();
        removedRows++;
      }
    }
    const achievementsTotal = walkthroughAchievementsContainer.querySelector(
      "#lstWalkthroughAchievementID .total"
    );
    achievementsTotal.innerText = achievementsTotal.innerText.replace(
      currentCount.toString(),
      (currentCount - removedRows).toString()
    );
  }
};
/* harmony default export */ const staff_walkthrough_improvements_manage_walkthrough = (async () => {
  if (!globals/* StaffRegex */.nW.Walkthroughs.Test.manageWalkthroughUrl()) {
    return;
  }
  await changeToDefaultStatus();
  await autoSelectFirst();
  await manage_walkthrough_applyBody();
  (0,utilities/* allConcurrently */.Eh)("Manage Walkthrough", [
    { name: "manage-walkthrough-make-table-links-clickable", task: makeTableLinksClickable },
    { name: "manage-walkthrough-add-missing-buttons", task: addMissingButtons }
  ]);
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/walkthrough-page.html
// Module
var walkthrough_page_code = "<div class=\"js-ta-x-staff-walkthrough-improvements-walkthrough-page-container ta-x-staff-walkthrough-improvements-walkthrough-page-container\"></div><a class=\"button js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button\" onclick='return Postback(\"btnBackToWalkthrough_click\"),!1' href=\"#\" id=\"btnBackToWalkthrough\"> <img alt=\"Back to management\" title=\"Back to management\" src=\"/images/icons/leftarrow.png\"> Back to management </a>";
// Exports
/* harmony default export */ const walkthrough_page = (walkthrough_page_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/add-walkthrough-team-button.ts



const addWalkthroughTeamButton = async (walkthroughContainer, walkthoughPageVersions) => {
  if (!globals/* walkthroughPage */.Vx.walkthroughTeamButton) {
    return;
  }
  if (!walkthroughContainer || !walkthoughPageVersions) {
    return;
  }
  const walkthroughPageButtons = await (0,utilities/* waitForElement */.br)(".content .buttons", walkthoughPageVersions);
  if (walkthroughPageButtons) {
    if (document.querySelector("#btnBackToWalkthrough")) {
      return;
    }
    const parsedDocument = new DOMParser().parseFromString(walkthrough_page, "text/html");
    walkthroughPageButtons.appendChild(
      parsedDocument.querySelector(
        `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonJs}`
      )
    );
  }
};
/* harmony default export */ const add_walkthrough_team_button = ({ addWalkthroughTeamButton });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/move-buttons-to-left.ts


const moveButtonsToLeft = async (walkthroughContainer, walkthoughPageVersions) => {
  if (!globals/* walkthroughPage */.Vx.moveButtonsToLeft) {
    return;
  }
  if (!walkthroughContainer || !walkthoughPageVersions) {
    return;
  }
  const walkthroughContainerButtons = await (0,utilities/* waitForElement */.br)(
    "#btnEditPage, #btnEditPage2, #btnUnlockWalkthroughPage, #btnUnlockWalkthroughPage2",
    walkthroughContainer
  );
  const walkthroughPageVersionButtons = await (0,utilities/* waitForElement */.br)(".content .buttons", walkthoughPageVersions);
  if (walkthroughContainerButtons && walkthroughPageVersionButtons) {
    walkthroughPageVersionButtons.append(...walkthroughContainerButtons.parentElement.childNodes);
    walkthroughContainer.classList.add(
      globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.moveButtonsToLeftStyle
    );
  }
};
/* harmony default export */ const move_buttons_to_left = ({ moveButtonsToLeft });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/sticky-page-history.ts



let sticky_page_history_walkthroughContainer;
let walkthoughPageVersions;
const variableProperty = globals/* Constants */.gT.Styles.Variables.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryTop;
const sticky_page_history_listen = async () => {
  window.addEventListener(
    "scroll",
    async () => await (0,helpers/* applyStickyElementStyle */.vN)(variableProperty, walkthoughPageVersions, sticky_page_history_walkthroughContainer, {
      noTransitionStyle: !(0,utilities/* classListContains */.gz)(walkthoughPageVersions, [
        globals/* Constants */.gT.Styles.Animations.yHideNoTransition,
        globals/* Constants */.gT.Styles.Animations.yHide,
        globals/* Constants */.gT.Styles.Animations.yShow
      ]),
      paddingFromTop: 5
    })
  );
};
const setPageHistorySticky = async (container, pageVersions) => {
  if (!globals/* walkthroughPage */.Vx.stickyPageHistory) {
    return;
  }
  if (!container || !pageVersions) {
    return;
  }
  sticky_page_history_walkthroughContainer = container;
  walkthoughPageVersions = pageVersions;
  pageVersions.classList.add(
    globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs,
    globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle
  );
  await (0,helpers/* applyStickyElementStyle */.vN)(variableProperty, pageVersions, container, {
    noTransitionStyle: true,
    paddingFromTop: 5
  });
  await sticky_page_history_listen();
};
/* harmony default export */ const sticky_page_history = ({ setPageHistorySticky });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/highlight-page-locked.ts


const highlightPageLocked = async (walkthroughContainer) => {
  if (!globals/* walkthroughPage */.Vx.highlightPageLocked) {
    return;
  }
  if (!walkthroughContainer) {
    return;
  }
  const walkthroughLocked = await (0,utilities/* waitForElement */.br)(".walkthroughlocked", walkthroughContainer);
  if (walkthroughLocked) {
    walkthroughLocked.classList.add("informationpanel");
  }
};
/* harmony default export */ const highlight_page_locked = ({ highlightPageLocked });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-page/index.ts








let walkthrough_page_walkthroughContainer;
let walkthrough_page_walkthoughPageVersions;
const walkthrough_page_applyBody = async () => {
  const parsedDocument = new DOMParser().parseFromString(walkthrough_page, "text/html");
  walkthrough_page_walkthoughPageVersions = await (0,utilities/* waitForElement */.br)("#chWalkthroughPageVersions");
  walkthrough_page_walkthoughPageVersions.parentElement.insertBefore(
    parsedDocument.querySelector(`.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`),
    walkthrough_page_walkthoughPageVersions
  );
  walkthrough_page_walkthroughContainer = document.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`
  );
  walkthrough_page_walkthroughContainer.appendChild(walkthrough_page_walkthoughPageVersions);
  moveWalkthroughPagePreview();
};
const moveWalkthroughPagePreview = async () => {
  const walkthoughPagePreview = await (0,utilities/* waitForElement */.br)("#chWalkthroughPagePreview");
  if (walkthoughPagePreview) {
    walkthrough_page_walkthroughContainer.appendChild(walkthoughPagePreview);
  }
};
/* harmony default export */ const staff_walkthrough_improvements_walkthrough_page = (async () => {
  if (!regex/* StaffRegex */.nW.Walkthroughs.Test.walkthroughPageUrl()) {
    return;
  }
  await walkthrough_page_applyBody();
  (0,utilities/* allConcurrently */.Eh)("Walkthrough Page", [
    {
      name: "walkthrough-page-set-page-history-sticky",
      task: async () => await setPageHistorySticky(walkthrough_page_walkthroughContainer, walkthrough_page_walkthoughPageVersions)
    },
    {
      name: "walkthrough-page-add-walkthrough-team-button",
      task: async () => await addWalkthroughTeamButton(walkthrough_page_walkthroughContainer, walkthrough_page_walkthoughPageVersions)
    },
    {
      name: "walkthrough-page-move-buttons-to-left",
      task: async () => await moveButtonsToLeft(walkthrough_page_walkthroughContainer, walkthrough_page_walkthoughPageVersions)
    },
    {
      name: "walkthrough-page-highlight-page-locked",
      task: async () => await highlightPageLocked(walkthrough_page_walkthroughContainer)
    }
  ]);
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/auto-save-notification.ts


const autoSaveNotification = async () => {
  if (!globals/* editWalkthrough */.kB.autoSaveNotification) {
    return;
  }
  pub_sub.subscribe("ajaxIntercept:response", (response) => {
    if (!globals/* AjaxRegex */.rt.Test.autosave(response.responseURL)) {
      return;
    }
    pub_sub.publish("snackbar:show", {
      text: response.status === 200 ? "Autosave successful." : "Autosave failed.",
      type: response.status === 200 ? "success" : "danger"
    });
  });
};
/* harmony default export */ const auto_save_notification = ({ autoSaveNotification });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/edit-walkthrough.html
// Module
var edit_walkthrough_code = "<div class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container ta-x-sticky-header\"></div><p class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title\">{element.title}</p>";
// Exports
/* harmony default export */ const edit_walkthrough = (edit_walkthrough_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/improved-image-selector.ts




const improved_image_selector_listen = () => {
  document.addEventListener("click", ({ target }) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (target.closest(
      `[aria-label='Add Image'], .${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`
    ) !== null) {
      return;
    }
    const imageSelector = document.querySelector(
      `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`
    );
    if (imageSelector.style.display === "block") {
      imageSelector.style.display = "none";
    }
  });
  window.addEventListener("blur", () => {
    if (document.activeElement === document.querySelector("#txtWalkthrough_ifr")) {
      const imageSelector = document.querySelector(
        `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`
      );
      if (imageSelector.style.display !== "block") {
        return;
      }
      imageSelector.style.display = "none";
    }
  });
};
const improveImageSelector = async () => {
  if (!globals/* editWalkthrough */.kB.improvedImageSelector) {
    return;
  }
  const imageContainer = await (0,utilities/* waitForElement */.br)("#oWalkthroughImageViewer");
  if (!imageContainer) {
    return;
  }
  imageContainer.classList.add(
    globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorStyle,
    globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs
  );
  const parsedDocument = new DOMParser().parseFromString(edit_walkthrough, "text/html");
  const stickyImageHeader = parsedDocument.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorContainerJs}`
  );
  const imageViewer = await (0,utilities/* waitForElement */.br)(".imageviewer", imageContainer);
  const imageLink = await (0,utilities/* waitForElement */.br)(".addimages a", imageContainer);
  imageContainer.insertBefore(stickyImageHeader, imageViewer);
  stickyImageHeader.appendChild(imageViewer.querySelector(".itemname, .noimages"));
  stickyImageHeader.appendChild(imageLink);
  [...imageViewer.querySelectorAll(".ivimage a")].forEach((imageAnchor) => {
    const clonedImageTitle = parsedDocument.querySelector(
      `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorImageTitleJs}`
    ).cloneNode(true);
    const imageTitle = (0,helpers/* template */.XK)(clonedImageTitle, {
      element: imageAnchor.querySelector("img")
    });
    imageTitle.innerText = (0,utilities/* extractBetween */._o)("'", imageTitle.innerText);
    imageAnchor.appendChild(imageTitle);
  });
  improved_image_selector_listen();
};
/* harmony default export */ const improved_image_selector = ({ improveImageSelector });

;// CONCATENATED MODULE: ./src/scss/features/staff-walkthrough-improvements/tinymce/charcoal/skin.scss

        const styles = `body.trueachievement-extras.ta-x-staff-walkthrough-improvements .mce-edit-area{border:0 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel{border:0 solid #232b33;background-color:#404952}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-toolbar-grp{padding:2px 0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-window-head,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-foot{border-color:#9e9e9e}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-title,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-label{color:#b5b9bf;text-shadow:0 1px 1px rgba(0,0,0,.75)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-path-item{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel i.mce-i-resize{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel i.mce-ico{text-shadow:1px 1px #000;color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel i.mce-caret{border-top:4px solid #b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn{border:1px solid #364049 !important;border-color:#202a33 !important;text-shadow:0 1px 1px rgba(0,0,0,.75);background-color:#4c5761 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn:focus,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-active,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn:hover,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn:focus,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-active,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn:hover{background-image:none !important;background-color:#004364 !important;border-color:#24292e !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-disabled,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-disabled{cursor:default}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-primary,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-primary{background-color:#004364 !important;color:#fff;text-shadow:1px 1px #333}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-primary:hover,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-primary:hover{background-color:#00547d !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn button,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn button{padding:4px 10px;font-size:14px;cursor:pointer;color:#b5b9bf;text-align:center}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn button span,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn button span{color:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn-group .mce-btn{border-width:1px;margin:0;margin-left:2px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu{background:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-sep{background:#25313f;border-color:#424f5f}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal .mce-text{color:#ddd !important;background:rgba(0,0,0,0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal:focus,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal.mce-selected,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal.mce-active{background-color:#006597;color:#fff !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal:hover{text-decoration:none;color:#fff;background-color:#0085c7}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal .mce-caret{border-left:4px solid #b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-grid-border a{border-color:#202a33;background-color:#4c5761}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-grid-border a.mce-active{background-color:#006597}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-text-center{color:#ddd}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-edit-area{border-left:1px solid #000 !important;border:0 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-tabs{background:#303942;border-bottom:1px solid #202a33}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-tabs .mce-tab{color:#b5b9bf;border-color:#202a33;background:#303942;text-shadow:0 1px 1px rgba(0,0,0,.75)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-tabs .mce-tab.mce-active{background:#404952}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-i-checkbox,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-textbox,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] input{background-color:#4c5761;color:#bbb;border-color:#202a33;background-image:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer{border:0 solid #232b33;background-color:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer .imageviewer{background-color:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer .noimages,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer .itemname{color:#b5b9bf}`;
        /* harmony default export */ const skin = (styles);
    
;// CONCATENATED MODULE: ./src/scss/features/staff-walkthrough-improvements/tinymce/charcoal/content.scss

        const content_styles = `body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-tinymce-theme=dark]{background-color:#444;color:#bbb;border-color:#555}`;
        /* harmony default export */ const content = (content_styles);
    
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/toggle-theme-button.ts




let themeToggle;
let globalTheme;
const getTinymceTheme = async () => {
  globalTheme = globalTheme ? globalTheme : await (0,utilities/* waitForElement */.br)(".page, [data-theme]");
  if (globals/* editWalkthrough */.kB.tinymceTheme !== null) {
    return globals/* editWalkthrough */.kB.tinymceTheme;
  } else {
    return globalTheme ? globalTheme.getAttribute("data-theme") : "";
  }
};
const toggle_theme_button_listen = async () => {
  themeToggle.addEventListener("click", ({ target }) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const currentTheme = target.getAttribute("data-ta-x-tinymce-theme");
    const newTheme = currentTheme === "dark" ? "" : "dark";
    globals/* editWalkthrough */.kB.tinymceTheme = newTheme;
    target.setAttribute("data-ta-x-tinymce-theme", newTheme);
  });
  const iframe = await (0,utilities/* waitForElement */.br)("#txtWalkthrough_ifr");
  iframe.addEventListener("load", async () => {
    const iframeDocument = iframe && iframe.contentDocument;
    const bodyEl = await (0,utilities/* waitForElement */.br)("#tinymce", iframeDocument);
    bodyEl.classList.add(globals/* Constants */.gT.Styles.root, globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.featureStyle);
    bodyEl.setAttribute("data-ta-x-tinymce-theme", await getTinymceTheme());
    const style = iframeDocument.createElement("style");
    style.id = "ta-x-staff-walkthrough-improvements-dark-tinymce-style";
    style.innerHTML = content;
    iframeDocument.head.appendChild(style);
    const script = iframeDocument.createElement("script");
    script.id = "ta-x-staff-walkthrough-improvements-dark-tinymce-script";
    script.innerHTML = `window.addEventListener('message', function(event) {
      console.log(event);
      if (!event || !event.data || event.data.theme === null || event.data.theme === undefined) return;
      document.body.setAttribute('data-ta-x-tinymce-theme', event.data.theme);
    });`;
    iframeDocument.head.appendChild(script);
    iframe.removeEventListener("load", void 0);
  });
  let preventMutation = false;
  const observer = new MutationObserver((mutations) => {
    if (preventMutation) {
      preventMutation = false;
      return;
    }
    mutations.forEach((mutation) => {
      if (mutation.type !== "attributes") {
        return;
      }
      if (!(mutation.target instanceof HTMLElement)) {
        return;
      }
      let theme;
      if (mutation.attributeName === "data-theme") {
        theme = mutation.target.getAttribute("data-theme");
        preventMutation = true;
        themeToggle.setAttribute("data-ta-x-tinymce-theme", theme === "dark" ? theme : "");
        document.body.setAttribute("data-ta-x-theme", theme === "dark" ? theme : "");
      } else if (mutation.attributeName === "data-ta-x-tinymce-theme") {
        theme = mutation.target.getAttribute("data-ta-x-tinymce-theme");
      } else {
        return;
      }
      if (theme !== null && theme !== void 0) {
        iframe.contentWindow.postMessage({ theme }, "*");
      }
    });
  });
  observer.observe(themeToggle, {
    attributes: true
  });
  observer.observe(globalTheme, {
    attributes: true
  });
};
const addToggleThemeButton = async (toolbar) => {
  GM_addStyle(skin);
  themeToggle = toolbar.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs} [data-ta-x-tinymce-theme]`
  );
  const theme = await getTinymceTheme();
  themeToggle.setAttribute("data-ta-x-tinymce-theme", theme);
  document.body.setAttribute("data-ta-x-theme", theme);
  await toggle_theme_button_listen();
};
/* harmony default export */ const toggle_theme_button = ({ addToggleThemeButton });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/set-fullwidth-toolbar.ts




let tinymceContainer;
let tinymceToolbar;
const set_fullwidth_toolbar_variableProperty = globals/* Constants */.gT.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarTop;
const set_fullwidth_toolbar_listen = async () => {
  window.addEventListener("scroll", async () => {
    await (0,helpers/* applyStickyElementStyle */.vN)(set_fullwidth_toolbar_variableProperty, tinymceToolbar, tinymceContainer, {
      noTransitionStyle: !(0,utilities/* classListContains */.gz)(tinymceToolbar, [
        globals/* Constants */.gT.Styles.Animations.yHideNoTransition,
        globals/* Constants */.gT.Styles.Animations.yHide,
        globals/* Constants */.gT.Styles.Animations.yShow
      ]),
      isRelativeToParent: true
    });
    setTimeout(() => pub_sub.publish("tinymce:repositionFloatingMenus"), 250);
  });
};
const setFullWidthToolbar = async (container) => {
  tinymceContainer = container;
  tinymceToolbar = await (0,utilities/* waitForElement */.br)(".mce-container-body .mce-toolbar-grp", container);
  if (!tinymceToolbar) {
    return;
  }
  tinymceToolbar.classList.add(
    globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarStyles
  );
  document.documentElement.style.setProperty(
    globals/* Constants */.gT.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarWidth,
    `${tinymceToolbar.parentElement.scrollWidth}px`
  );
  await (0,helpers/* applyStickyElementStyle */.vN)(set_fullwidth_toolbar_variableProperty, tinymceToolbar, tinymceContainer, {
    noTransitionStyle: true,
    isRelativeToParent: true
  });
  await set_fullwidth_toolbar_listen();
};
/* harmony default export */ const set_fullwidth_toolbar = ({ setFullWidthToolbar });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/fix-floating-menus.ts



let fix_floating_menus_tinymceToolbar;
const fix_floating_menus_variableProperty = globals/* Constants */.gT.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarFloatingMenu;
const setTopPosition = () => {
  const actualTopPosition = (0,utilities/* getElementCoordinates */.HM)(fix_floating_menus_tinymceToolbar);
  document.documentElement.style.setProperty(
    fix_floating_menus_variableProperty,
    `${fix_floating_menus_tinymceToolbar.offsetHeight + actualTopPosition.top}px`
  );
};
const fix_floating_menus_listen = async () => {
  const iframe = await (0,utilities/* waitForElement */.br)("#txtWalkthrough_ifr");
  iframe.addEventListener("load", () => {
    setTopPosition();
    window.addEventListener("scroll", setTopPosition);
    pub_sub.subscribe("tinymce:repositionFloatingMenus", setTopPosition);
    iframe.removeEventListener("load", void 0);
  });
};
const fixFloatingMenus = async (container) => {
  fix_floating_menus_tinymceToolbar = await (0,utilities/* waitForElement */.br)(".mce-container-body .mce-toolbar-grp", container);
  if (!fix_floating_menus_tinymceToolbar) {
    return;
  }
  await fix_floating_menus_listen();
};
/* harmony default export */ const fix_floating_menus = ({ fixFloatingMenus });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/source-code-button.ts

const createScript = (id, innerHtml) => {
  const script = document.createElement("script");
  script.id = id;
  script.innerHTML = innerHtml;
  return script;
};
const buildSourceCodeCommandScript = () => {
  const id = "ta-x-staff-walkthrough-improvements-add-code-editor-command";
  const script = `tinymce.PluginManager.add("code", function(e) {
        function o() {
            var o = tinymce.editors.txtWalkthrough.windowManager.open({
                title: "Source code",
                body: {
                    type: "textbox",
                    name: "code",
                    multiline: true,
                    minWidth: tinymce.editors.txtWalkthrough.getParam("code_dialog_width", 600),
                    minHeight: tinymce.editors.txtWalkthrough.getParam("code_dialog_height", Math.min(tinymce.DOM.getViewPort().h - 200, 500)),
                    spellcheck: false,
                    style: "direction: ltr; text-align: left"
                },
                onSubmit: function(o) {
                    tinymce.editors.txtWalkthrough.focus(),
                    tinymce.editors.txtWalkthrough.undoManager.transact(function() {
                        tinymce.editors.txtWalkthrough.setContent(o.data.code)
                    }),
                    tinymce.editors.txtWalkthrough.selection.setCursorLocation(),
                    tinymce.editors.txtWalkthrough.nodeChanged()
                }
            });
            o.find("#code").value(tinymce.editors.txtWalkthrough.getContent({
                source_view: true
            }))
        }
        tinymce.editors.txtWalkthrough.addCommand("mceCodeEditor", o)
    })();`;
  return createScript(id, script);
};
const buildShowSourceCodeButtonScript = () => {
  const id = "ta-x-staff-walkthrough-improvements-show-code-editor";
  const script = `document.querySelector(".js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code").addEventListener("click", function(e) {
        tinymce.activeEditor.execCommand("mceCodeEditor");
    });`;
  return createScript(id, script);
};
const addSourceCodeButton = async () => {
  const iframe = await (0,utilities/* waitForElement */.br)("#txtWalkthrough_ifr");
  iframe.addEventListener("load", async () => {
    const sourceCodeCommand = buildSourceCodeCommandScript();
    const sourceCodeButton = buildShowSourceCodeButtonScript();
    document.body.appendChild(sourceCodeCommand);
    document.body.appendChild(sourceCodeButton);
    iframe.removeEventListener("load", void 0);
  });
};
/* harmony default export */ const source_code_button = ({ addSourceCodeButton });

// EXTERNAL MODULE: ./node_modules/.pnpm/@eastdesire+jscolor@2.5.1/node_modules/@eastdesire/jscolor/jscolor.js
var jscolor = __webpack_require__("./node_modules/.pnpm/@eastdesire+jscolor@2.5.1/node_modules/@eastdesire/jscolor/jscolor.js");
var jscolor_default = /*#__PURE__*/__webpack_require__.n(jscolor);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/append-color-picker.ts


const append_color_picker_listen = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== "childList") {
        return;
      }
      if (!(mutation.target instanceof HTMLElement)) {
        return;
      }
      if (!mutation.addedNodes || mutation.addedNodes.length === 0) {
        return;
      }
      const tablePropertyModal = [...mutation.addedNodes].find(
        (node) => node.ariaLabel === "Table properties"
      );
      if (!tablePropertyModal || !(tablePropertyModal instanceof HTMLElement)) {
        return;
      }
      [...tablePropertyModal.querySelectorAll(".mce-colorbox input")].forEach(
        (el) => {
          el.parentElement.style.left = "201px";
          const container = el.closest(".mce-container-body");
          const colorPickerOpts = {
            zIndex: 65536
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          };
          if (container) {
            const label = container.querySelector("label");
            if (label) {
              if (label.innerText === "Border color") {
                colorPickerOpts.format = "hexa";
              }
            }
          }
          new (jscolor_default())(el, colorPickerOpts);
        }
      );
      observer.disconnect();
    });
  });
  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true
  });
};
const appendColorPicker = async () => {
  const iframe = await (0,utilities/* waitForElement */.br)("#txtWalkthrough_ifr");
  iframe.addEventListener("load", async () => {
    append_color_picker_listen();
    iframe.removeEventListener("load", void 0);
  });
};
/* harmony default export */ const append_color_picker = ({ appendColorPicker });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/tinymce.hbs
// Module
var tinymce_code = "<div class=\"mce-container mce-last mce-flow-layout-item mce-btn-group js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle\" role=\"group\"><div><div aria-label=\"Switch theme\" class=\"mce-widget mce-btn mce-first\" role=\"button\" tabindex=\"-1\"><button data-ta-x-tinymce-theme role=\"presentation\" tabindex=\"-1\" type=\"button\"><svg viewbox=\"0 0 512 512\" class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z\" fill=\"currentColor\"></path></svg> <svg viewbox=\"0 0 512 512\" class=\"ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M505.2 324.8l-47.73-68.78l47.75-68.81c7.359-10.62 8.797-24.12 3.844-36.06c-4.969-11.94-15.52-20.44-28.22-22.72l-82.39-14.88l-14.89-82.41c-2.281-12.72-10.76-23.25-22.69-28.22c-11.97-4.936-25.42-3.498-36.12 3.844L256 54.49L187.2 6.709C176.5-.6016 163.1-2.039 151.1 2.896c-11.92 4.971-20.4 15.5-22.7 28.19l-14.89 82.44L31.15 128.4C18.42 130.7 7.854 139.2 2.9 151.2C-2.051 163.1-.5996 176.6 6.775 187.2l47.73 68.78l-47.75 68.81c-7.359 10.62-8.795 24.12-3.844 36.06c4.969 11.94 15.52 20.44 28.22 22.72l82.39 14.88l14.89 82.41c2.297 12.72 10.78 23.25 22.7 28.22c11.95 4.906 25.44 3.531 36.09-3.844L256 457.5l68.83 47.78C331.3 509.7 338.8 512 346.3 512c4.906 0 9.859-.9687 14.56-2.906c11.92-4.969 20.4-15.5 22.7-28.19l14.89-82.44l82.37-14.88c12.73-2.281 23.3-10.78 28.25-22.75C514.1 348.9 512.6 335.4 505.2 324.8zM456.8 339.2l-99.61 18l-18 99.63L256 399.1L172.8 456.8l-18-99.63l-99.61-18L112.9 255.1L55.23 172.8l99.61-18l18-99.63L256 112.9l83.15-57.75l18.02 99.66l99.61 18L399.1 255.1L456.8 339.2zM256 143.1c-61.85 0-111.1 50.14-111.1 111.1c0 61.85 50.15 111.1 111.1 111.1s111.1-50.14 111.1-111.1C367.1 194.1 317.8 143.1 256 143.1zM256 319.1c-35.28 0-63.99-28.71-63.99-63.99S220.7 192 256 192s63.99 28.71 63.99 63.1S291.3 319.1 256 319.1z\" fill=\"currentColor\"></path></svg></button></div><div aria-label=\"Show Code\" class=\"mce-widget mce-btn mce-last\" role=\"button\" tabindex=\"-1\"><button class=\"js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code-button\" role=\"presentation\" tabindex=\"-1\" type=\"button\"><svg viewbox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z\" fill=\"currentColor\"></path></svg></button></div></div></div>";
// Exports
/* harmony default export */ const tinymce = (tinymce_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/index.ts








const tinymce_tinymce = async () => {
  if (!await (0,utilities/* waitForElement */.br)('[href*="skin.min.css"]', document.head)) {
    return;
  }
  const container = await (0,utilities/* waitForElement */.br)(".mce-tinymce");
  const toolbar = await (0,utilities/* waitForElement */.br)(".mce-toolbar.mce-last .mce-container-body", container);
  if (!container || !toolbar) {
    return;
  }
  const parsedDocument = new DOMParser().parseFromString(tinymce, "text/html");
  const addedGroup = parsedDocument.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`
  );
  toolbar.appendChild(addedGroup);
  (0,utilities/* allConcurrently */.Eh)("Edit Walkthrough", [
    { name: "tinymce-set-full-width-toolbar", task: async () => await setFullWidthToolbar(container) },
    { name: "tinymce-add-fix-floating-menus", task: async () => await fixFloatingMenus(container) },
    { name: "tinymce-add-source-code-button", task: addSourceCodeButton },
    { name: "tinymce-add-toggle-theme-button", task: async () => await addToggleThemeButton(toolbar) },
    { name: "tinymce-append-color-picker", task: appendColorPicker }
  ]);
};
/* harmony default export */ const edit_walkthrough_tinymce = ({ tinymce: tinymce_tinymce });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/index.ts





/* harmony default export */ const staff_walkthrough_improvements_edit_walkthrough = (async () => {
  if (!globals/* StaffRegex */.nW.Walkthroughs.Test.editWalkthroughUrl()) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)(
    "Edit Walkthrough",
    [
      { name: "edit-walkthrough-improve-image-selector", task: improveImageSelector },
      { name: "edit-walkthrough-auto-save-notification", task: autoSaveNotification },
      { name: "edit-walkthrough-tinymce", task: tinymce_tinymce }
    ],
    3
  );
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-preview/remove-aside.ts



const remove_aside_applyBody = async () => {
  const main = await (0,utilities/* waitForElement */.br)(".page main");
  main.parentElement.classList.add("no-aside");
  main.classList.add("no-aside");
  const aside = await (0,utilities/* waitForElement */.br)(".page aside");
  aside.remove();
};
const remove_aside_listen = () => {
  pub_sub.subscribe("walkthroughPreview:removeAside", remove_aside_applyBody);
};
const removeAside = async () => {
  remove_aside_listen();
  if (globals/* walkthroughPreview */.uP.populateAsideContent) {
    return;
  }
  await remove_aside_applyBody();
};
/* harmony default export */ const remove_aside = ({ removeAside });

;// CONCATENATED MODULE: ./src/views/templates/walkthrough-preview-walkthrough-pages.html
// Module
var walkthrough_preview_walkthrough_pages_code = "<template id=\"ta-x-template-walkthrough-preview-walkthrough-pages-summary\"><tr><td></td><td><a href=\"{urls.walkthroughPreviewWithWalkthroughId}\"> Walkthrough Summary </a></td></tr></template><template id=\"ta-x-template-walkthrough-preview-walkthrough-pages-numbered-selected\"><tr><td class=\"pos\">{populateAsideContentPreviewPage.index}</td><td data-wp=\"{populateAsideContentPreviewPage.id}\">{populateAsideContentPreviewPage.title}</td></tr></template><template id=\"ta-x-template-walkthrough-preview-walkthrough-pages-numbered\"><tr><td class=\"pos\">{populateAsideContentPreviewPage.index}</td><td data-wp=\"{populateAsideContentPreviewPage.id}\"><a href=\"{urls.walkthroughPreviewWithPageId}\"> {populateAsideContentPreviewPage.title} </a></td></tr></template><template id=\"ta-x-template-walkthrough-preview-walkthrough-achievements\"><li data-i=\"{populateAsideContentPreviewAchievement.id}\"><img alt=\"{populateAsideContentPreviewAchievement.title}\" class=\"smallicon\" height=\"32\" loading=\"lazy\" src=\"{populateAsideContentPreviewAchievement.src}\" width=\"32\"> <a href=\"{urls.walkthroughPreviewWithPageIdAndAchievementId}\"> {populateAsideContentPreviewAchievement.title} </a> <p>{populateAsideContentPreviewAchievement.description}</p></li></template>";
// Exports
/* harmony default export */ const walkthrough_preview_walkthrough_pages = (walkthrough_preview_walkthrough_pages_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-preview/walkthrough-preview.hbs
// Module
var walkthrough_preview_code = "<section class=\"purple js-ta-x-ask-loader-container ta-x-ask-loader-container js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content\"><div>Walkthrough Information</div><article><div class=\"ta-x-article-loader\"><p>Please wait, loading.</p><svg viewbox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z\" fill=\"currentColor\"></path></svg></div><div class=\"js-ta-x-ask-loader-ask ta-x-ask-loader-ask ta-x-hide\"><p>Can't automate them all sadly! Please enter the walkthrough id to link this page to the walkthrough, I'll try remember it next time! If this is not a \"In Progress\" walkthrough, I'll probably ask again.</p><div><label class=\"small\">Walkthrough Id</label><input class=\"textbox cs-n js-ta-x-ask-loader-ask-input\" id=\"txtStaffWalkthroughImprovementsWalkthroughsPreviewPopulateAsideContentWalkthroughId\" name=\"txtStaffWalkthroughImprovementsWalkthroughsPreviewPopulateAsideContentWalkthroughId\"></div><input class=\"button js-ta-x-ask-loader-ask-button\" id=\"btnStaffWalkthroughImprovementsWalkthroughsPreviewPopulateAsideContentWalkthroughId\" name=\"btnStaffWalkthroughImprovementsWalkthroughsPreviewPopulateAsideContentWalkthroughId\" type=\"submit\" value=\"Save\"></div></article></section><section class=\"green walkthrough-right js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content-walkthrough-achievements\"><div>Walkthrough Achievements</div><article><ul class=\"il\"></ul></article></section><section class=\"purple page-index js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content-walkthrough-pages\"><div>Pages In This Walkthrough</div><article><table class=\"wt-pl\"><tbody></tbody></table></article></section><section class=\"purple walkthroughthanks js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content-walkthrough-thanks\"><div>Walkthrough Thanks</div><article><div class=\"thanks\"><span> {populateAsideContentPreviewThanks.total} </span><img alt=\"Thanks\" class=\"thumbsup\" height=\"64\" src=\"/images/walkthroughs/thumbs_up.png\" width=\"64\"></div><p>community members have thanked the author.</p><p class=\"thread\">Discuss this walkthrough in its <a href=\"{populateAsideContentPreviewThanks.thread}\"> Walkthrough Thread </a> .</p></article></section>";
// Exports
/* harmony default export */ const walkthrough_preview = (walkthrough_preview_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-preview/populate-aside-content.ts






let populate_aside_content_extensionBody;
let askForWalkthroughBody;
const populate_aside_content_applyBody = async () => {
  const parsedDocument = new DOMParser().parseFromString(walkthrough_preview, "text/html");
  const asideColumn = await (0,utilities/* waitForElement */.br)(".main aside");
  asideColumn.appendChild(
    parsedDocument.querySelector(
      `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentJs}`
    )
  );
  populate_aside_content_extensionBody = asideColumn.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentJs}`
  );
  askForWalkthroughBody = populate_aside_content_extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.Components.AskLoader.askJs}`);
  getAchievementWalkthroughId();
};
const populate_aside_content_listen = () => {
  const button = populate_aside_content_extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.Components.AskLoader.buttonJs}`);
  const input = populate_aside_content_extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.Components.AskLoader.inputJs}`);
  button.addEventListener("click", async (e) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    try {
      if (input.value === "") {
        return;
      }
      toggleAskForWalkthrough();
      await getAsideContent(input.value);
    } catch {
      return;
    }
  });
};
const getAchievementWalkthroughId = async () => {
  const cachedWalkthroughIds = globals/* Cache */.Ct.walkthroughPreviewWalkthroughId;
  let walkthroughId = null;
  if (globals/* StaffRegex */.nW.Walkthroughs.Test.walkthroughPreviewUrlWithWalkthroughId()) {
    walkthroughId = new URLSearchParams(window.location.search).get("walkthroughid");
  } else if (globals/* StaffRegex */.nW.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()) {
    const pageId = new URLSearchParams(window.location.search).get("pageid");
    const foundWalkthroughId = [...cachedWalkthroughIds.entries()].find(
      (walkthroughs) => walkthroughs[1].includes(pageId)
    );
    if (foundWalkthroughId) {
      walkthroughId = foundWalkthroughId[0];
    }
  }
  if (!walkthroughId) {
    toggleAskForWalkthrough();
    return;
  }
  getAsideContent(walkthroughId);
};
const getAsideContent = async (walkthroughId) => {
  const asideColumn = await (0,utilities/* waitForElement */.br)(".main aside");
  const parsedDocument = new DOMParser().parseFromString(walkthrough_preview, "text/html");
  const parsedTemplateDocument = new DOMParser().parseFromString(walkthrough_preview_walkthrough_pages, "text/html");
  const manageWalkthroughResponse = await (0,helpers/* memoizeFetch */.FS)(
    `https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=${walkthroughId}`,
    {},
    { deleteAfter: { value: 4, period: "hours" } }
  );
  const manageWalkthroughDocument = new DOMParser().parseFromString(manageWalkthroughResponse, "text/html");
  const supportedStatuses = ["In progress", "Ready for review", "Ready for publish"];
  if (!supportedStatuses.includes(
    manageWalkthroughDocument.querySelector("#txtStatusReadOnly, #txtStatus").value
  )) {
    populate_aside_content_extensionBody.remove();
    pub_sub.publish("walkthroughPreview:removeAside");
    return;
  }
  const gameUrl = await getGameUrl(walkthroughId);
  const gameResponse = await (0,helpers/* memoizeFetch */.FS)(gameUrl);
  const gameDocument = new DOMParser().parseFromString(gameResponse, "text/html");
  const thanks = await getWalkthroughThanks(walkthroughId, parsedDocument);
  const achievements = getAchievementsInWalkthrough(
    manageWalkthroughDocument,
    gameDocument,
    parsedDocument,
    parsedTemplateDocument
  );
  let asideContent = [thanks, achievements];
  if (globals/* StaffRegex */.nW.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()) {
    const pages = getPagesInWalkthrough(
      walkthroughId,
      manageWalkthroughDocument,
      parsedDocument,
      parsedTemplateDocument
    );
    asideContent = [pages].concat(asideContent);
  }
  populate_aside_content_extensionBody.remove();
  asideColumn.append(...asideContent);
  const cachedWalkthroughPreviewWalkthroughId = globals/* Cache */.Ct.walkthroughPreviewWalkthroughId;
  cachedWalkthroughPreviewWalkthroughId.set(
    walkthroughId,
    getPages(manageWalkthroughDocument).map((page) => page.id)
  );
  globals/* Cache */.Ct.walkthroughPreviewWalkthroughId = cachedWalkthroughPreviewWalkthroughId;
};
const getGameUrl = async (walkthroughId) => {
  const game = document.querySelector(".walkthroughsummary .games a.gamelink");
  if (game) {
    return game.href;
  }
  const walkthroughPreviewResponse = await (0,helpers/* memoizeFetch */.FS)(
    `https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`
  );
  const walkthroughPreviewDocument = new DOMParser().parseFromString(walkthroughPreviewResponse, "text/html");
  return walkthroughPreviewDocument.querySelector(".walkthroughsummary .games a.gamelink").href;
};
const getPages = (manageWalkthroughDocument) => {
  return [...manageWalkthroughDocument.querySelectorAll("#scrolllstWalkthroughPages tbody .c2 a")].map((page, index) => ({
    index: (index + 1).toString(),
    title: page.innerText,
    id: (0,utilities/* toInt */.Hq)((0,utilities/* extractAllBetween */.QF)("'", page.href)[1]).toString()
  }));
};
const getPagesInWalkthrough = (walkthroughId, manageWalkthroughDocument, featureDocument, templateDocument) => {
  if (!globals/* StaffRegex */.nW.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()) {
    return null;
  }
  const pagesInWalkthroughSection = featureDocument.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughPagesJs}`
  );
  const pagesinWalkthroughTable = pagesInWalkthroughSection.querySelector("tbody");
  const clonedSummaryRow = templateDocument.querySelector(
    `#${globals/* Constants */.gT.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesSummary}`
  ).content.firstElementChild.cloneNode(true);
  const summaryRow = (0,helpers/* template */.XK)(clonedSummaryRow, {
    urls: {
      walkthroughPreviewWithWalkthroughId: `/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`
    }
  });
  pagesinWalkthroughTable.appendChild(summaryRow);
  getPages(manageWalkthroughDocument).forEach((populateAsideContentPreviewPage) => {
    const pageId = new URLSearchParams(window.location.search).get("pageid");
    const pageRow = (pageId === populateAsideContentPreviewPage.id ? templateDocument.querySelector(
      `#${globals/* Constants */.gT.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesNumberedSelected}`
    ) : templateDocument.querySelector(
      `#${globals/* Constants */.gT.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesNumbered}`
    )).content.firstElementChild.cloneNode(true);
    const templatedRow = (0,helpers/* template */.XK)(pageRow, {
      populateAsideContentPreviewPage,
      urls: {
        walkthroughPreviewWithPageId: `/staff/walkthrough/walkthroughpagepreview.aspx?pageid=${populateAsideContentPreviewPage.id}`
      }
    });
    pagesinWalkthroughTable.appendChild(templatedRow);
  });
  return pagesInWalkthroughSection;
};
const getAchievementsInWalkthrough = (manageWalkthroughDocument, gameDocument, featureDocument, templateDocument) => {
  const achievementsInWalkthroughSection = featureDocument.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughAchievementsJs}`
  );
  const achievementsInWalkthroughTable = achievementsInWalkthroughSection.querySelector("ul");
  const walkthroughAchievements = [
    ...manageWalkthroughDocument.querySelectorAll("#scrolllstWalkthroughAchievementID tbody tr")
  ];
  const gameAchievements = [...gameDocument.querySelectorAll("main ul.ach-panels li")];
  const achievementsMerged = [];
  const pages = getPages(manageWalkthroughDocument);
  gameAchievements.forEach((gameAchievement) => {
    const achievementName = gameAchievement.querySelector("a.title").innerText.trim();
    const walkthroughAchievement = walkthroughAchievements.find(
      (walkthroughAchievement2) => walkthroughAchievement2.querySelector(".c1").innerText.toLowerCase().trim() === achievementName.toLowerCase()
    );
    if (!walkthroughAchievement) {
      return;
    }
    const achievementInfo = {
      title: achievementName,
      description: gameAchievement.querySelector("p").innerText,
      page: pages.find(
        (page) => walkthroughAchievement.querySelector(".c2").innerText.trim() === page.index.toString()
      ),
      id: new URL(gameAchievement.querySelector("a.title").href).pathname.split("/")[1].slice(1),
      src: "https://www.trueachievements.com/imagestore/m/0004101700/4101796.jpg"
    };
    achievementsMerged.push(achievementInfo);
  });
  achievementsMerged.sort((a, b) => (0,utilities/* toInt */.Hq)(a.page.index) - (0,utilities/* toInt */.Hq)(b.page.index));
  achievementsMerged.forEach((populateAsideContentPreviewAchievement) => {
    const achievementRow = templateDocument.querySelector(
      `#${globals/* Constants */.gT.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughAchievements}`
    ).content.firstElementChild.cloneNode(true);
    const templatedRow = (0,helpers/* template */.XK)(achievementRow, {
      populateAsideContentPreviewAchievement,
      urls: {
        walkthroughPreviewWithPageIdAndAchievementId: `/staff/walkthrough/walkthroughpagepreview.aspx?pageid=${populateAsideContentPreviewAchievement.page.id}#ap${populateAsideContentPreviewAchievement.id}`
      }
    });
    achievementsInWalkthroughTable.appendChild(templatedRow);
  });
  return achievementsInWalkthroughSection;
};
const getWalkthroughThanks = async (walkthroughId, featureDocument) => {
  const thanks = featureDocument.querySelector(
    `.${globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughThanksJs}`
  );
  const walkthroughPreviewResponse = await (0,helpers/* memoizeFetch */.FS)(
    `https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`
  );
  const walkthroughPreviewDocument = new DOMParser().parseFromString(walkthroughPreviewResponse, "text/html");
  const threadUrl = walkthroughPreviewDocument.querySelector(".summary dd a").href;
  return (0,helpers/* template */.XK)(thanks, {
    populateAsideContentPreviewThanks: { thread: threadUrl, total: "0" }
  });
};
const toggleAskForWalkthrough = () => {
  askForWalkthroughBody.classList.toggle("ta-x-hide");
  if (!askForWalkthroughBody.classList.contains("ta-x-hide")) {
    populate_aside_content_extensionBody.setAttribute("data-ta-x-loaded", "true");
  } else {
    populate_aside_content_extensionBody.removeAttribute("data-ta-x-loaded");
  }
};
const populateAsideContent = async () => {
  if (!globals/* walkthroughPreview */.uP.populateAsideContent) {
    return;
  }
  await populate_aside_content_applyBody();
  populate_aside_content_listen();
};
/* harmony default export */ const populate_aside_content = ({ populateAsideContent });

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/walkthrough-preview/index.ts




/* harmony default export */ const staff_walkthrough_improvements_walkthrough_preview = (async () => {
  if (!globals/* StaffRegex */.nW.Walkthroughs.Test.preview()) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)("Walkthrough Preview", [
    { name: "walkthrough-preview-remove-aside", task: removeAside },
    { name: "walkthrough-preview-populate-aside-content", task: populateAsideContent }
  ]);
});

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/index.ts






/* harmony default export */ const staff_walkthrough_improvements = (async () => {
  if (!globals/* staffWalkthroughImprovements */.mg.enabled) {
    return;
  }
  if (!globals/* StaffRegex */.nW.Walkthroughs.Test.all()) {
    return;
  }
  if (!await (0,utilities/* waitForElement */.br)("body")) {
    return;
  }
  document.body.classList.add(
    globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.featureJs,
    globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.featureStyle
  );
  (0,utilities/* allConcurrently */.Eh)(
    "Staff Walkthrough Improvements",
    [
      { name: "staff-walkthrough-improvements-manage-walkthrough", task: staff_walkthrough_improvements_manage_walkthrough },
      { name: "staff-walkthrough-improvements-walkthrough-preview", task: staff_walkthrough_improvements_walkthrough_preview },
      { name: "staff-walkthrough-improvements-walkthrough-page", task: staff_walkthrough_improvements_walkthrough_page },
      { name: "staff-walkthrough-improvements-edit-walkthrough", task: staff_walkthrough_improvements_edit_walkthrough }
    ],
    4
  );
});

;// CONCATENATED MODULE: ./src/features/forum-improvements/shared/filter-threads.ts


let listenApplied = false;
const filter_threads_listen = () => {
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    if (!e.target.classList.contains(globals/* Constants */.gT.Styles.ForumImprovements.filterThreadsUnhideJs)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.target.closest("li").setAttribute("data-thread-hidden", "false");
  });
  listenApplied = true;
};
const applyThreadFilters = async (filters) => {
  if (!filters.length) {
    return;
  }
  const board = await (0,utilities/* waitForElement */.br)("main .view-board, main .messageboard-index");
  [...board.querySelectorAll("li:not(.header)")].forEach((thread) => {
    const threadTitleAnchor = thread.querySelector(".topic a, .read a");
    let activeFilter = null;
    filters.forEach((filter) => {
      if (activeFilter != null) {
        return;
      }
      if (!threadTitleAnchor.innerText.trim().toLowerCase().includes(filter.toLowerCase())) {
        return;
      }
      activeFilter = filter;
    });
    if (!activeFilter) {
      return;
    }
    const threadLi = threadTitleAnchor.closest("li");
    const threadTitleParagraph = document.createElement("p");
    threadTitleParagraph.innerText = `Hidden by filter "${activeFilter}"`;
    threadTitleParagraph.classList.add(globals/* Constants */.gT.Styles.ForumImprovements.filterThreadsTitleStyle);
    threadTitleAnchor.closest("div").appendChild(threadTitleParagraph);
    const threadTitleUnhide = document.createElement("a");
    threadTitleUnhide.innerText = "Unhide";
    threadTitleUnhide.classList.add(
      globals/* Constants */.gT.Styles.ForumImprovements.filterThreadsUnhideStyle,
      globals/* Constants */.gT.Styles.ForumImprovements.filterThreadsUnhideJs
    );
    threadLi.setAttribute("data-thread-hidden", "true");
    threadLi.appendChild(threadTitleUnhide);
    if (!listenApplied) {
      filter_threads_listen();
    }
  });
};
/* harmony default export */ const filter_threads = ({ applyThreadFilters });

;// CONCATENATED MODULE: ./src/features/forum-improvements/shared/index.ts


;// CONCATENATED MODULE: ./src/features/forum-improvements/my-threads/filter-threads.ts


const filterThreads = () => {
  if (!globals/* myThreads */.jf.myThreadsThreadFilter) {
    return;
  }
  applyThreadFilters(globals/* myThreads */.jf.threadFilterKeywords);
};
/* harmony default export */ const my_threads_filter_threads = ({ filterThreads });

;// CONCATENATED MODULE: ./src/features/forum-improvements/my-threads/index.ts



/* harmony default export */ const my_threads = (async () => {
  if (!globals/* ForumRegex */.wC.Test.myTheadsUrl()) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)("My Theads", [{ name: "my-threads-filter-threads", task: filterThreads }]);
});

;// CONCATENATED MODULE: ./src/features/forum-improvements/view-board/filter-threads.ts


const filter_threads_filterThreads = () => {
  if (!globals/* forumImprovements */.i_.forumImprovementsThreadFilter) {
    return;
  }
  applyThreadFilters(globals/* forumImprovements */.i_.threadFilterKeywords);
};
/* harmony default export */ const view_board_filter_threads = ({ filterThreads: filter_threads_filterThreads });

;// CONCATENATED MODULE: ./src/features/forum-improvements/view-board/index.ts



/* harmony default export */ const view_board = (async () => {
  if (!globals/* ForumRegex */.wC.Test.viewBoardUrlWithBoardId()) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)("View Boards", [{ name: "my-threads-filter-threads", task: filter_threads_filterThreads }]);
});

// EXTERNAL MODULE: ./src/features/forum-improvements/walkthroughs/show-owner-progress.ts
var show_owner_progress = __webpack_require__("./src/features/forum-improvements/walkthroughs/show-owner-progress.ts");
;// CONCATENATED MODULE: ./src/features/forum-improvements/walkthroughs/index.ts



const messageBoardId = "1431";
/* harmony default export */ const walkthroughs = (async () => {
  const params = new URLSearchParams(window.location.search);
  if (!globals/* ForumRegex */.wC.Test.viewBoardUrlWithBoardId() && !globals/* ForumRegex */.wC.Test.viewThreadUrlWithThreadId()) {
    return;
  }
  if (globals/* ForumRegex */.wC.Test.viewBoardUrlWithBoardId() && params.get("messageboardid") !== messageBoardId) {
    return;
  }
  if (globals/* ForumRegex */.wC.Test.viewThreadUrlWithThreadId()) {
    const pageTitle = await (0,utilities/* waitForElement */.br)("#oMessageThread .pagetitle");
    if (!pageTitle || pageTitle.innerText.toLowerCase() !== "walkthroughs") {
      return;
    }
  }
  (0,utilities/* allConcurrently */.Eh)("Walkthrough Page", [{ name: "walkthroughs-show-owner-progress", task: show_owner_progress/* default */.Z }]);
});

;// CONCATENATED MODULE: ./src/features/forum-improvements/index.ts





/* harmony default export */ const forum_improvements = (async () => {
  if (!globals/* forumImprovements */.i_.enabled) {
    return;
  }
  if (!globals/* ForumRegex */.wC.Test.all()) {
    return;
  }
  if (!await (0,utilities/* waitForElement */.br)("body")) {
    return;
  }
  document.body.classList.add(
    globals/* Constants */.gT.Styles.ForumImprovements.featureJs,
    globals/* Constants */.gT.Styles.ForumImprovements.featureStyle
  );
  (0,utilities/* allConcurrently */.Eh)("Forum Improvements", [
    { name: "forum-improvements-myThreads", task: my_threads },
    { name: "forum-improvements-viewBoard", task: view_board },
    { name: "forum-improvements-walkthroughs", task: walkthroughs }
  ]);
});

;// CONCATENATED MODULE: ./src/features/news-improvements/sales/auto-sort-by.ts



const auto_sort_by_applyBody = async () => {
  const saleTables = [...document.querySelectorAll("table.sale")];
  await (0,utilities/* allConcurrently */.Eh)(
    "AutoSortBy - Tables",
    saleTables.map((saleTable) => ({
      name: "auto-sort-by-table",
      task: async () => {
        const tableHeader = [...saleTable.querySelectorAll(".headers [data-sort]")].find(
          (th) => globals/* newsImprovements */.Bb.sales.autoSortByValue.includes(th.innerText.replace(" ", "-").toLowerCase().trim())
        );
        if (!tableHeader) {
          return;
        }
        do {
          tableHeader.click();
          await (0,helpers/* wait */.Dc)();
        } while (!tableHeader.classList.contains(`sorting-${globals/* newsImprovements */.Bb.sales.autoSortByOrder}`));
      }
    }))
  );
};
/* harmony default export */ const auto_sort_by = (async () => {
  if (!globals/* newsImprovements */.Bb.sales.autoSortBy) {
    return;
  }
  if (globals/* newsImprovements */.Bb.sales.autoSortByValue.includes("product") && globals/* newsImprovements */.Bb.sales.autoSortByOrder === "asc") {
    return;
  }
  const salesTable = await (0,utilities/* waitForElement */.br)(".newsitem .sale [data-sort]");
  if (!salesTable) {
    return;
  }
  await (0,utilities/* waitForElement */.br)(".author");
  await auto_sort_by_applyBody();
});

;// CONCATENATED MODULE: ./src/features/news-improvements/sales/index.ts


/* harmony default export */ const sales = (async () => {
  (0,utilities/* allConcurrently */.Eh)("Sales News", [{ name: "sales-auto-sort-by", task: auto_sort_by }]);
});

;// CONCATENATED MODULE: ./src/features/news-improvements/index.ts



/* harmony default export */ const news_improvements = (async () => {
  if (!globals/* newsImprovements */.Bb.enabled) {
    return;
  }
  if (!globals/* NewsRegex */.du.Test.newsUrl()) {
    return;
  }
  if (!await (0,utilities/* waitForElement */.br)("body")) {
    return;
  }
  document.body.classList.add(
    globals/* Constants */.gT.Styles.NewsImprovements.featureJs,
    globals/* Constants */.gT.Styles.NewsImprovements.featureStyle
  );
  (0,utilities/* allConcurrently */.Eh)("News Improvements", [{ name: "news-improvements-sales", task: sales }]);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/games-improvements.html
// Module
var games_improvements_code = "<a class=\"button js-ta-x-games-improvements-highlight-games-collection-button\" href=\"#\"> Highlight games not in collection </a>";
// Exports
/* harmony default export */ const games_improvements = (games_improvements_code);
;// CONCATENATED MODULE: ./src/features/games-improvements/add-highlight-games-not-in-collection-button.ts



const add_highlight_games_not_in_collection_button_listen = (button) => {
  button.addEventListener("click", async () => {
    [...document.querySelectorAll('#oGameList img[alt*="Add game to My Game Collection"]')].forEach(
      (el) => {
        const tr = el.closest("tr");
        tr.classList.remove("odd", "even");
        tr.classList.add("green");
      }
    );
  });
};
const addHighlightGamesNotInCollectionButton = async () => {
  if (!globals/* games */.Tt.addHighlightGamesNotInCollectionButton) {
    return;
  }
  if (!globals/* GamesRegex */.Rv.Test.gamesUrl()) {
    return;
  }
  const searchAndFilterContainer = await (0,utilities/* waitForElement */.br)(".search-and-filter");
  if (!searchAndFilterContainer) {
    return;
  }
  const parsedDocument = new DOMParser().parseFromString(games_improvements, "text/html");
  searchAndFilterContainer.appendChild(
    parsedDocument.querySelector(`.${globals/* Constants */.gT.Styles.GamesImprovements.highlightGamesButtonJs}`)
  );
  const button = searchAndFilterContainer.querySelector(
    `.${globals/* Constants */.gT.Styles.GamesImprovements.highlightGamesButtonJs}`
  );
  add_highlight_games_not_in_collection_button_listen(button);
};
/* harmony default export */ const add_highlight_games_not_in_collection_button = ({ addHighlightGamesNotInCollectionButton });

;// CONCATENATED MODULE: ./src/features/games-improvements/shared/individual-progress.ts



const createAchievementGroup = (header) => ({
  title: header.querySelector("h2 a").innerText,
  maxTAScore: header.querySelector('[title="Maximum TrueAchievement"]').innerText,
  maxGamerScore: header.querySelector('[title="Maximum Gamerscore"]').innerText,
  maxAchievements: header.querySelector('[title="Maximum achievements"], [title="Maximum Achievements"]').innerText,
  achievements: []
});
const getBaseAchievementGroup = (el) => {
  const baseAchievementHeader = el.querySelector(".pnl-hd.no-pills.no-pr.game:not(.gamer)");
  if (!baseAchievementHeader) {
    return [];
  }
  const baseAchievementGroup = createAchievementGroup(baseAchievementHeader);
  if (baseAchievementGroup.title === "Overall DLC Stats") {
    return [];
  }
  for (let child = el.querySelector(".ach-panels"); child; child = child.nextSibling) {
    if (child.tagName !== "UL") {
      if (child.classList?.contains("pnl-hd")) {
        break;
      }
      continue;
    }
    baseAchievementGroup.achievements = baseAchievementGroup.achievements.concat([
      ...child.querySelectorAll("li")
    ]);
  }
  return [baseAchievementGroup];
};
const getDLCAchievementGroups = async (el) => {
  const achievementGroups = [];
  const dlcAchievementHeaders = [...el.querySelectorAll(".pnl-hd.dlc")];
  await (0,utilities/* allConcurrently */.Eh)(
    "individualProgress - Groups",
    dlcAchievementHeaders.map((dlcHeader) => ({
      name: "individual-progress-group-dlc-grouping",
      task: () => {
        const group = createAchievementGroup(dlcHeader);
        for (let child = dlcHeader.nextSibling; child; child = child.nextSibling) {
          if (child.tagName !== "UL") {
            if (child.classList?.contains("pnl-hd") && child.classList?.contains("dlc")) {
              break;
            }
            continue;
          }
          group.achievements = group.achievements.concat([...child.querySelectorAll("li")]);
        }
        achievementGroups.push(group);
      }
    })),
    5
  );
  return achievementGroups;
};
const getAchievementGroups = async (el) => {
  const achievementGroups = await (0,utilities/* allConcurrently */.Eh)("Game Improvements Individual Progress", [
    {
      name: "game-improvements-individual-progress-base",
      task: () => getBaseAchievementGroup(el)
    },
    {
      name: "game-improvements-individual-progress-dlc",
      task: async () => await getDLCAchievementGroups(el)
    }
  ]);
  return achievementGroups.flat();
};
const setGroupProgress = async (groups) => {
  const achievementGroups = [
    ...document.querySelectorAll(".pnl-hd.game:not(.gamer):not([data-gid]), .pnl-hd.dlc")
  ];
  await (0,utilities/* allConcurrently */.Eh)(
    "individualProgress - Groups",
    achievementGroups.map((achievementGroup) => ({
      name: "individual-progress-group",
      task: () => {
        const groupName = achievementGroup.querySelector("h2 a").innerText;
        const grouping = groups.find((groups2) => groups2.title.toLowerCase() === groupName.toLowerCase());
        if (!grouping) {
          return;
        }
        const maxTAScore = achievementGroup.querySelector('[title="Maximum TrueAchievement"]');
        const maxGamerscore = achievementGroup.querySelector('[title="Maximum Gamerscore"]');
        const maxAchievements = achievementGroup.querySelector(
          '[title="Maximum achievements"], [title="Maximum Achievements"]'
        );
        const wonAchievements = grouping.achievements.filter((achievement) => achievement.classList.contains("w"));
        const wonTrueAchievementScore = wonAchievements.length !== (0,utilities/* toInt */.Hq)(grouping.maxAchievements) ? wonAchievements.reduce((totalTAScore, achievement) => {
          const TAScore = (0,utilities/* toInt */.Hq)(achievement.querySelector("[data-af]")?.getAttribute("data-af"));
          return totalTAScore + TAScore;
        }, 0).toString() : grouping.maxTAScore;
        const wonGamerscore = wonAchievements.length !== (0,utilities/* toInt */.Hq)(grouping.maxAchievements) ? wonAchievements.reduce((totalGamerscore, achievement) => {
          const gamerscore = (0,utilities/* toInt */.Hq)(achievement.querySelector("[data-bf]")?.getAttribute("data-bf"));
          return totalGamerscore + gamerscore;
        }, 0).toString() : grouping.maxGamerScore;
        maxTAScore.innerHTML = maxTAScore.innerHTML.replace(
          grouping.maxTAScore,
          `${(0,utilities/* insertSeperator */.g$)(wonTrueAchievementScore)}/${grouping.maxTAScore}`
        );
        maxGamerscore.innerHTML = maxGamerscore.innerHTML.replace(
          grouping.maxGamerScore,
          `${(0,utilities/* insertSeperator */.g$)(wonGamerscore)}/${grouping.maxGamerScore}`
        );
        maxAchievements.innerHTML = maxAchievements.innerHTML.replace(
          grouping.maxAchievements,
          `${(0,utilities/* insertSeperator */.g$)(wonAchievements.length)}/${grouping.maxAchievements}`
        );
      }
    })),
    5
  );
};
const applyIndividualProgress = async () => {
  const status = document.querySelector("#rdoAllAchievements");
  let mainElement;
  if (!status?.hasAttribute("checked")) {
    const gameResponse = globals/* GamesRegex */.Rv.Test.challengesUrl() ? await (0,helpers/* memoizeFetch */.FS)(window.location.href.replace("/challenges", "/achievements")) : await (0,helpers/* memoizeFetch */.FS)(window.location.href);
    const gameDocument = new DOMParser().parseFromString(gameResponse, "text/html");
    mainElement = gameDocument.querySelector("main");
  } else {
    (0,helpers/* updateMemoizedFetch */.TE)(window.location.href, document.documentElement.outerHTML);
    mainElement = document.querySelector("main");
  }
  const achievementGroups = await getAchievementGroups(mainElement);
  await setGroupProgress(achievementGroups);
};
/* harmony default export */ const individual_progress = ({ applyIndividualProgress });

;// CONCATENATED MODULE: ./src/features/games-improvements/shared/default-status.ts


const setDefaultStatus = (status, cacheProperty, gamerIdRegex) => {
  const url = (0,globals/* getUrlProperties */.TS)(window.location.href, ["pathname", "search"]);
  if (status && url !== globals/* Cache */.Ct[cacheProperty]) {
    globals/* Cache */.Ct[cacheProperty] = (0,globals/* getUrlProperties */.TS)(window.location.href, ["pathname", "search"]);
    if (gamerIdRegex() && new URLSearchParams(window.location.search).get("gamerid") !== (0,utilities/* getCookie */.ej)("GamerID")) {
      return;
    }
    if (!status.hasAttribute("checked")) {
      const totalAchievements = [...document.querySelectorAll(".ach-panels li")].length;
      const wonAchievements = [...document.querySelectorAll(".ach-panels li.w")].length;
      if (wonAchievements !== totalAchievements) {
        status.click();
      }
    }
  }
};
/* harmony default export */ const shared_default_status = ({ setDefaultStatus });

;// CONCATENATED MODULE: ./src/views/templates/achievement-guide-solution.html
// Module
var achievement_guide_solution_code = "<template id=\"ta-x-template-games-improvements-achievements-achievement-guide\"><li><div class=\"gamer ta-x-games-improvements-achievements-achievement-guide\"><img alt=\"{achievementGuideSolution.name}\" class=\"bigicon\" loading=\"lazy\" src=\"/images/placeholder/thumb-ta.png\"><a data-tlite href=\"{achievementGuideSolution.href}\" rel=\"nofollow\"> {achievementGuideSolution.name} </a><div class=\"info\">{achievementGuideSolution.info}</div></div> <article><div class=\"body\">{achievementGuideSolution.guide}</div></article></li></template>";
// Exports
/* harmony default export */ const achievement_guide_solution = (achievement_guide_solution_code);
;// CONCATENATED MODULE: ./src/resources/svgs/xboxachievements-icon.hbs
// Module
var xboxachievements_icon_code = "<svg viewbox=\"0 0 62 62\" xmlns=\"http://www.w3.org/2000/svg\"><defs><lineargradient id=\"a\" x1=\"50%\" x2=\"50%\" y1=\"0%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#03BF2D\"/><stop offset=\"100%\" stop-color=\"#018B14\"/></lineargradient></defs><g transform=\"translate(-153 -7)\" fill=\"url(#a)\" fill-rule=\"evenodd\"><path d=\"M184 67.176c-16.087 0-29.176-13.089-29.176-29.176 0-16.087 13.089-29.176 29.176-29.176 16.087 0 29.176 13.089 29.176 29.176 0 16.087-13.089 29.176-29.176 29.176M184 7c-17.094 0-31 13.906-31 31s13.906 31 31 31 31-13.906 31-31-13.906-31-31-31\"/><path d=\"M193.192 55.808l-12.527-17.889 12.442-17.768c6.491 3.326 10.952 10.07 10.952 17.848 0 7.747-4.422 14.47-10.867 17.809zm-22.845-3.153l4.754-6.787 8.522 12.172c-5.126-.095-9.776-2.125-13.276-5.385zm-5.343-8.264a19.885 19.885 0 0 1-1.063-6.392c0-2.275.4-4.455 1.1-6.497l4.493 6.417-4.53 6.472zm18.502-26.425L175.1 29.972l-4.684-6.689a19.954 19.954 0 0 1 13.089-5.317zm.494-7.32c-15.082 0-27.353 12.27-27.353 27.353 0 15.085 12.27 27.353 27.353 27.353 15.082 0 27.353-12.268 27.353-27.353 0-15.082-12.27-27.353-27.353-27.353z\"/></g></svg>";
// Exports
/* harmony default export */ const xboxachievements_icon = (xboxachievements_icon_code);
;// CONCATENATED MODULE: ./src/features/games-improvements/shared/xbox-achievements.hbs
// Module
var xbox_achievements_code = "<section class=\"purple js-ta-x-ask-loader-container ta-x-ask-loader-container js-ta-x-game-achievements-xbox-achievement-guides ta-x-game-achievements-xbox-achievement-guides\"><div>Xbox Achievement Guides</div><article><div class=\"ta-x-article-loader\"><p>Please wait, loading.</p><svg viewbox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z\" fill=\"currentColor\"></path></svg></div><div class=\"js-ta-x-ask-loader-ask ta-x-ask-loader-ask ta-x-hide\"><p>Please enter a direct link to this game on XboxAchievements.com, I'll remember it next time!</p><div><label class=\"small\">XboxAchievements Url</label><input class=\"textbox cs-n js-ta-x-ask-loader-ask-input\" id=\"txtGameAchievementsXboxAchievementGuides\" name=\"txtGameAchievementsXboxAchievementGuides\"></div><input class=\"button js-ta-x-ask-loader-ask-button\" id=\"btnGameAchievementsXboxAchievementGuidesSave\" name=\"btnGameAchievementsXboxAchievementGuidesSave\" type=\"submit\" value=\"Save\"></div></article></section>";
// Exports
/* harmony default export */ const xbox_achievements = (xbox_achievements_code);
;// CONCATENATED MODULE: ./src/features/games-improvements/shared/add-xbox-achievement-guides.ts






let add_xbox_achievement_guides_extensionBody;
let askForLinkBody;
const add_xbox_achievement_guides_applyBody = async () => {
  const parsedDocument = new DOMParser().parseFromString(xbox_achievements, "text/html");
  const asideColumn = await (0,utilities/* waitForElement */.br)(".main aside");
  const firstSection = await (0,utilities/* waitForElement */.br)("section:not(.smallpanel)", asideColumn);
  asideColumn.insertBefore(
    parsedDocument.querySelector(`.${globals/* Constants */.gT.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesJs}`),
    firstSection
  );
  add_xbox_achievement_guides_extensionBody = asideColumn.querySelector(
    `.${globals/* Constants */.gT.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesJs}`
  );
  askForLinkBody = add_xbox_achievement_guides_extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.Components.AskLoader.askJs}`);
  getAchievementWalkthroughUrl();
};
const add_xbox_achievement_guides_listen = () => {
  const button = add_xbox_achievement_guides_extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.Components.AskLoader.buttonJs}`);
  const input = add_xbox_achievement_guides_extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.Components.AskLoader.inputJs}`);
  button.addEventListener("click", async (e) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    try {
      if (input.value === "") {
        return;
      }
      if (!globals/* ExternalRegex */.Ye.Test.xboxAchievementsGuide(input.value)) {
        return;
      }
      toggleAskForLink();
      if (globals/* AchievementsRegex */.KH.Test.achievementUrl) {
        await getAchievementGuide(input.value);
      }
    } catch {
      return;
    }
  });
};
const getGameName = () => new URL(document.querySelector(".game h2 a").href).pathname.slice(1).split("/")[1];
const getAchievementWalkthroughUrl = async () => {
  const cachedXboxAchievementGuideUrls = globals/* Cache */.Ct.gameAchievementsXboxAchievementsGuideUrl;
  const gameName = getGameName();
  const url = gameName ? cachedXboxAchievementGuideUrls.get(gameName) : null;
  if (!url) {
    toggleAskForLink();
    return;
  }
  if (globals/* AchievementsRegex */.KH.Test.achievementUrl()) {
    getAchievementGuide(url);
  } else {
    hideBody();
  }
};
const getAchievementGuide = async (url) => {
  const achievementTitle = (await (0,utilities/* waitForElement */.br)(".ach-panel:not([data-secret]) .title"))?.innerText?.trim();
  const guideResponse = await (0,helpers/* memoizeCorsFetch */.o1)(url, {});
  const guideDocument = new DOMParser().parseFromString(guideResponse, "text/html");
  const achievementGuides = [...guideDocument.querySelectorAll(".achilist .achilist__guide")].map(
    (el) => ({
      title: el.querySelector(".achilist__title")?.innerText?.trim(),
      href: el.querySelector(".achilist__header a")?.href?.trim(),
      description: el.querySelector(".achilist__data > p")?.innerText?.trim(),
      guide: [...el.querySelectorAll(".text_res")].map((el2) => {
        const guide = el2.innerHTML.trim();
        return guide;
      })
    })
  );
  const achievementGuide = achievementGuides.find((guide) => guide.title === achievementTitle);
  const cachedXboxAchievementGuideUrls = globals/* Cache */.Ct.gameAchievementsXboxAchievementsGuideUrl;
  const gameName = getGameName();
  if (gameName && !cachedXboxAchievementGuideUrls.has(gameName)) {
    cachedXboxAchievementGuideUrls.set(gameName, url);
    globals/* Cache */.Ct.gameAchievementsXboxAchievementsGuideUrl = cachedXboxAchievementGuideUrls;
  }
  if (achievementGuide) {
    const parsedTemplateDocument = new DOMParser().parseFromString(achievement_guide_solution, "text/html");
    const parsedSvgDocument = new DOMParser().parseFromString(xboxachievements_icon, "text/html").body.firstElementChild.cloneNode(true);
    const clonedAchievementGuideSolution = parsedTemplateDocument.querySelector(
      `#${globals/* Constants */.gT.Templates.GamesImprovements.Achievements.achievementGuideSolution}`
    ).content.firstElementChild.cloneNode(true);
    const achievementGuideSolution = (0,helpers/* template */.XK)(clonedAchievementGuideSolution, {
      achievementGuideSolution: {
        name: "360Achievements",
        href: `${new URL(url).origin}${new URL(achievementGuide.href).pathname}`,
        guide: achievementGuide.guide.join("<br>"),
        info: "This guide was imported from 360Achievements.com"
      }
    });
    parsedSvgDocument.classList.add("ta-x-xboxachievements-icon");
    const gamerSideBar = achievementGuideSolution.querySelector(".gamer");
    gamerSideBar.removeChild(gamerSideBar.firstChild);
    gamerSideBar.prepend(parsedSvgDocument);
    let existingGuides = document.querySelector("ul.posts");
    if (!existingGuides) {
      const heading = document.createElement("h2");
      heading.innerText = `How to unlock the ${achievementGuide.title} achievement`;
      heading.classList.add("block", "topmargin");
      heading.id = "oSolutions";
      const achievementGuides2 = document.createElement("ul");
      achievementGuides2.classList.add("posts");
      const elBeforeUl = document.querySelector("main .nn_player_w");
      elBeforeUl.parentElement.insertBefore(heading, elBeforeUl.nextElementSibling);
      elBeforeUl.parentElement.insertBefore(achievementGuides2, heading.nextElementSibling);
      existingGuides = document.querySelector("ul.posts");
    }
    existingGuides.prepend(achievementGuideSolution);
  } else {
    (0,helpers/* deleteMemoizedCorsFetch */.Kp)(url);
  }
  hideBody();
};
const toggleAskForLink = () => {
  askForLinkBody.classList.toggle("ta-x-hide");
  if (!askForLinkBody.classList.contains("ta-x-hide")) {
    add_xbox_achievement_guides_extensionBody.setAttribute("data-ta-x-loaded", "true");
  } else {
    add_xbox_achievement_guides_extensionBody.removeAttribute("data-ta-x-loaded");
  }
};
const hideBody = () => {
  add_xbox_achievement_guides_extensionBody.setAttribute("data-ta-x-loaded", "true");
  add_xbox_achievement_guides_extensionBody.classList.add("ta-x-hide");
};
const addXboxAchievementGuides = async () => {
  if (!await (0,utilities/* waitForElement */.br)(".game h2 a")) {
    return;
  }
  await add_xbox_achievement_guides_applyBody();
  add_xbox_achievement_guides_listen();
};
/* harmony default export */ const add_xbox_achievement_guides = ({ addXboxAchievementGuides });

;// CONCATENATED MODULE: ./src/features/games-improvements/shared/add-achievement-leaderboard-link.ts


const addAchievementLeaderboardLink = async () => {
  const dlcAchievementHeaders = [...document.querySelectorAll("main ul.ach-panels li:not(.heading)")];
  await (0,utilities/* allConcurrently */.Eh)(
    "addAchievementLeaderboard - Achievements",
    dlcAchievementHeaders.map((achievement) => ({
      name: "add-achievement-leaderboard-achievement",
      task: () => {
        const title = achievement.querySelector(".title");
        const progress = achievement.querySelector(".progress-bar");
        const progressAnchor = document.createElement("a");
        progress.classList.add(globals/* Constants */.gT.Styles.GamesImprovements.Achievements.showAchievementLeaderboardLinksStyle);
        for (const attr of progress.attributes) {
          progressAnchor.setAttributeNS(null, attr.name, attr.value);
        }
        [...progress.children].forEach((child) => progressAnchor.appendChild(child.cloneNode(true)));
        progressAnchor.innerHTML = progress.innerHTML;
        progressAnchor.href = `${new URL(title.href).pathname}/gamers`;
        achievement.insertBefore(progressAnchor, progress.nextElementSibling);
      }
    })),
    5
  );
};
/* harmony default export */ const add_achievement_leaderboard_link = ({ addAchievementLeaderboardLink });

;// CONCATENATED MODULE: ./src/features/games-improvements/shared/index.ts





;// CONCATENATED MODULE: ./src/features/games-improvements/achievement/add-xbox-achievement-guides.ts


/* harmony default export */ const achievement_add_xbox_achievement_guides = (async () => {
  if (!globals/* gamesImprovements */.bc.achievements.gameAchievementsShowXboxAchievementGuides) {
    return;
  }
  addXboxAchievementGuides();
});

;// CONCATENATED MODULE: ./src/features/games-improvements/achievement/index.ts



/* harmony default export */ const achievement = (async () => {
  if (!globals/* AchievementsRegex */.KH.Test.achievementUrl()) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)("Games Achievement", [
    { name: "games-achievement-xbox-achievement-guides", task: achievement_add_xbox_achievement_guides }
  ]);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/achievements/default-status.ts


const default_status_changeToDefaultStatus = () => {
  if (!globals/* gameAchievements */.TM.gameAchievementsDefaultStatus) {
    return;
  }
  const status = document.querySelector(`#${globals/* gameAchievements */.TM.gameAchievementsDefaultStatusValue}`);
  setDefaultStatus(status, "gameAchievementsDefaultStatusPathName", globals/* GamesRegex */.Rv.Test.achievementsUrlWithGamerId);
};
/* harmony default export */ const achievements_default_status = ({ changeToDefaultStatus: default_status_changeToDefaultStatus });

;// CONCATENATED MODULE: ./src/features/games-improvements/achievements/individual-progress.ts


const individualProgress = () => {
  if (!globals/* gameAchievements */.TM.gameAchievementsIndividualProgress) {
    return;
  }
  const hasDlc = document.querySelector(".pnl-hd.dlc") != null;
  if (!hasDlc) {
    return;
  }
  applyIndividualProgress();
};
/* harmony default export */ const achievements_individual_progress = ({ individualProgress });

;// CONCATENATED MODULE: ./src/features/games-improvements/achievements/add-xbox-achievement-guides.ts


/* harmony default export */ const achievements_add_xbox_achievement_guides = (async () => {
  if (!globals/* gamesImprovements */.bc.achievements.gameAchievementsShowXboxAchievementGuides) {
    return;
  }
  addXboxAchievementGuides();
});

;// CONCATENATED MODULE: ./src/features/games-improvements/achievements/index.ts






/* harmony default export */ const achievements = (async () => {
  if (!globals/* GamesRegex */.Rv.Test.achievementsUrl()) {
    return;
  }
  default_status_changeToDefaultStatus();
  (0,utilities/* allConcurrently */.Eh)("Games Achievements", [
    { name: "games-achievements-individual-progress", task: individualProgress },
    { name: "games-achievements-xbox-achievement-guides", task: achievements_add_xbox_achievement_guides },
    { name: "games-achievements-achievement-leaderboard-link", task: addAchievementLeaderboardLink }
  ]);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/clips/default-status.ts


const clips_default_status_changeToDefaultStatus = async () => {
  if (!globals/* gameClips */.MF.gameClipsDefaultStatus) {
    return;
  }
  await (0,utilities/* allConcurrently */.Eh)(
    "game-clips-change-to-default-status",
    [
      {
        name: "game-clips-change-to-default-status-recorded-by",
        task: async () => await changeSelectOption("#ddlRecordedBy", globals/* gameClips */.MF.gameClipsDefaultRecordedByValue, "")
      },
      {
        name: "game-clips-change-to-default-status-saved-by",
        task: async () => await changeSelectOption("#ddlSavedBy", globals/* gameClips */.MF.gameClipsDefaultSavedByValue, "Gamer")
      },
      {
        name: "game-clips-change-to-default-status-recorded",
        task: async () => await changeSelectOption("#ddlUploaded", globals/* gameClips */.MF.gameClipsDefaultRecordedValue, "7")
      },
      {
        name: "game-clips-change-to-default-status-sort-by",
        task: async () => await changeSelectOption("#ddlOrder", globals/* gameClips */.MF.gameClipsDefaultSortByValue, "Most viewed")
      }
    ],
    1
  );
};
const changeSelectOption = async (selector, newValue, defaultValue) => {
  const selectorArray = globals/* Cache */.Ct.gameClipsDefaultStatusSelectors;
  if (newValue === defaultValue) {
    return;
  }
  if (selectorArray.includes(selector)) {
    return;
  }
  selectorArray.push(selector);
  globals/* Cache */.Ct.gameClipsDefaultStatusSelectors = selectorArray;
  const selectOption = await (0,utilities/* waitForElement */.br)(selector);
  if (selectOption.value === newValue) {
    return;
  }
  selectOption.value = newValue;
  selectOption.onchange(null);
};
/* harmony default export */ const clips_default_status = ({ changeToDefaultStatus: clips_default_status_changeToDefaultStatus });

;// CONCATENATED MODULE: ./src/features/games-improvements/clips/index.ts



/* harmony default export */ const clips = (async () => {
  if (!globals/* GamesRegex */.Rv.Test.clipsUrl()) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)("Games Clips", [{ name: "games-clips-change-to-default-status", task: clips_default_status_changeToDefaultStatus }]);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/challenges/default-status.ts


const challenges_default_status_changeToDefaultStatus = () => {
  if (!globals/* gameChallenges */.NF.gameChallengesDefaultStatus) {
    return;
  }
  const status = document.querySelector(`#${globals/* gameChallenges */.NF.gameChallengesDefaultStatusValue}`);
  setDefaultStatus(status, "gameChallengesDefaultStatusPathName", globals/* GamesRegex */.Rv.Test.challengesUrlWithGamerId);
};
/* harmony default export */ const challenges_default_status = ({ changeToDefaultStatus: challenges_default_status_changeToDefaultStatus });

;// CONCATENATED MODULE: ./src/features/games-improvements/challenges/individual-progress.ts


const individual_progress_individualProgress = () => {
  if (!globals/* gameChallenges */.NF.gameChallengesIndividualProgress) {
    return;
  }
  applyIndividualProgress();
};
/* harmony default export */ const challenges_individual_progress = ({ individualProgress: individual_progress_individualProgress });

;// CONCATENATED MODULE: ./src/features/games-improvements/challenges/index.ts





/* harmony default export */ const challenges = (async () => {
  if (!globals/* GamesRegex */.Rv.Test.challengesUrl()) {
    return;
  }
  challenges_default_status_changeToDefaultStatus();
  (0,utilities/* allConcurrently */.Eh)("Games Challenges", [
    { name: "games-challenges-individual-progress", task: individual_progress_individualProgress },
    { name: "games-challenges-achievement-leaderboard-link", task: addAchievementLeaderboardLink }
  ]);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/dlc/default-status.ts


const dlc_default_status_changeToDefaultStatus = () => {
  if (!globals/* gameDLC */.hi.gameDLCDefaultStatus) {
    return;
  }
  const status = document.querySelector(`#${globals/* gameDLC */.hi.gameDLCDefaultStatusValue}`);
  setDefaultStatus(
    status,
    "gameDLCDefaultStatusPathName",
    globals/* GamesRegex */.Rv.Test.dlcUrl() ? globals/* GamesRegex */.Rv.Test.dlcWithGamerId : globals/* GamesRegex */.Rv.Test.individualDlcUrlWithGamerId
  );
};
/* harmony default export */ const dlc_default_status = ({ changeToDefaultStatus: dlc_default_status_changeToDefaultStatus });

;// CONCATENATED MODULE: ./src/features/games-improvements/dlc/individual-progress.ts


const dlc_individual_progress_individualProgress = () => {
  if (!globals/* gameDLC */.hi.gameDLCIndividualProgress) {
    return;
  }
  if (globals/* GamesRegex */.Rv.Test.individualDlcUrl()) {
    return;
  }
  applyIndividualProgress();
};
/* harmony default export */ const dlc_individual_progress = ({ individualProgress: dlc_individual_progress_individualProgress });

;// CONCATENATED MODULE: ./src/features/games-improvements/dlc/index.ts





/* harmony default export */ const dlc = (async () => {
  if (!globals/* GamesRegex */.Rv.Test.dlc()) {
    return;
  }
  dlc_default_status_changeToDefaultStatus();
  (0,utilities/* allConcurrently */.Eh)("Games DLC", [
    { name: "games-dlc-individual-progress", task: dlc_individual_progress_individualProgress },
    { name: "games-dlc-achievement-leaderboard-link", task: addAchievementLeaderboardLink }
  ]);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/forums/filter-threads.ts


const forums_filter_threads_filterThreads = () => {
  if (!globals/* gameForums */.E1.gameForumsThreadFilter) {
    return;
  }
  applyThreadFilters(globals/* gameForums */.E1.threadFilterKeywords);
};
/* harmony default export */ const forums_filter_threads = ({ filterThreads: forums_filter_threads_filterThreads });

;// CONCATENATED MODULE: ./src/features/games-improvements/forums/default-thread.ts

const changeToDefaultThread = () => {
  if (!globals/* gameForums */.E1.gameForumsDefaultThread) {
    return;
  }
  const anchor = document.querySelector(
    `.link-tabs a[href$=${globals/* gameForums */.E1.gameForumsDefaultThreadValue}]`
  );
  const url = (0,globals/* getUrlProperties */.TS)(window.location.href, ["pathname"]);
  if (anchor && url !== globals/* Cache */.Ct.gameForumsDefaultThreadPathName) {
    globals/* Cache */.Ct.gameForumsDefaultThreadPathName = (0,globals/* getUrlProperties */.TS)(window.location.href, ["pathname"]);
    if (new URLSearchParams(window.location.search).get("type") === globals/* gameForums */.E1.gameForumsDefaultThreadValue) {
      return;
    }
    if (!anchor.classList.contains("selected")) {
      anchor.click();
    }
  }
};
/* harmony default export */ const default_thread = ({ changeToDefaultThread });

;// CONCATENATED MODULE: ./src/features/games-improvements/forums/index.ts




/* harmony default export */ const forums = (async () => {
  if (!globals/* GamesRegex */.Rv.Test.forum()) {
    return;
  }
  if (!await (0,utilities/* waitForElement */.br)("body")) {
    return;
  }
  changeToDefaultThread();
  document.body.classList.add(
    globals/* Constants */.gT.Styles.ForumImprovements.featureJs,
    globals/* Constants */.gT.Styles.ForumImprovements.featureStyle
  );
  (0,utilities/* allConcurrently */.Eh)("Games Forum", [{ name: "games-forum-filter-threads", task: forums_filter_threads_filterThreads }]);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/news/index.ts


/* harmony default export */ const news = (async () => {
  if (!globals/* GamesRegex */.Rv.Test.gameUrl()) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)("Games News", []);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/reviews/index.ts


/* harmony default export */ const reviews = (async () => {
  if (!globals/* GamesRegex */.Rv.Test.reviewsUrl()) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)("Games Reviews", []);
});

;// CONCATENATED MODULE: ./src/features/games-improvements/index.ts











/* harmony default export */ const features_games_improvements = (async () => {
  if (!globals/* gamesImprovements */.bc.enabled) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)("Games Improvements", [
    {
      name: "games-improvements-add-highlight-games-button",
      task: addHighlightGamesNotInCollectionButton
    },
    { name: "games-improvements-achievement", task: achievement },
    { name: "games-improvements-achievements", task: achievements },
    { name: "games-improvements-news", task: news },
    { name: "games-improvements-challenges", task: challenges },
    { name: "games-improvements-forums", task: forums },
    { name: "games-improvements-clips", task: clips },
    { name: "games-improvements-reviews", task: reviews },
    { name: "games-improvements-dlc", task: dlc }
  ]);
});

;// CONCATENATED MODULE: ./src/features/gamer-improvements/gamer-improvements.html
// Module
var gamer_improvements_code = "<a class=\"button js-ta-x-gamer-improvements-group-by-game-button\" href=\"#\"> Group achievements by game </a>";
// Exports
/* harmony default export */ const gamer_improvements = (gamer_improvements_code);
;// CONCATENATED MODULE: ./src/features/gamer-improvements/add-group-by-game-button.ts



const add_group_by_game_button_listen = (button) => {
  button.addEventListener("click", async () => {
    const containerTable = document.querySelector("table#oAchievementList tbody");
    [...containerTable.querySelectorAll("tr.even, tr.odd")].sort((el1, el2) => {
      const el1Alt = el1.querySelector(".gamethumb img").getAttribute("alt");
      const el2Alt = el2.querySelector(".gamethumb img").getAttribute("alt");
      if (el1Alt > el2Alt) {
        return 1;
      } else if (el1Alt < el2Alt) {
        return -1;
      } else {
        return 0;
      }
    }).forEach((element, index) => {
      element.classList.remove("odd", "even");
      element.classList.add(index + 1 & 1 ? "even" : "odd");
      containerTable.appendChild(element);
    });
  });
};
const addGroupByGameButton = async () => {
  if (!globals/* achievements */.EF.addGroupByGameButton) {
    return;
  }
  if (!globals/* GamerRegex */.LG.Test.gamerAchievementsUrl()) {
    return;
  }
  const searchAndFilterContainer = await (0,utilities/* waitForElement */.br)(".search-and-filter");
  if (!searchAndFilterContainer) {
    return;
  }
  const parsedDocument = new DOMParser().parseFromString(gamer_improvements, "text/html");
  searchAndFilterContainer.appendChild(
    parsedDocument.querySelector(`.${globals/* Constants */.gT.Styles.GamerImprovements.groupByGameButtonJs}`)
  );
  const button = searchAndFilterContainer.querySelector(`.${globals/* Constants */.gT.Styles.GamerImprovements.groupByGameButtonJs}`);
  add_group_by_game_button_listen(button);
};
/* harmony default export */ const add_group_by_game_button = ({ addGroupByGameButton });

;// CONCATENATED MODULE: ./src/features/gamer-improvements/index.ts



/* harmony default export */ const features_gamer_improvements = (async () => {
  if (!globals/* gamerImprovements */.rI.enabled) {
    return;
  }
  if (!globals/* GamerRegex */.LG.Test.all()) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)("Gamer Improvements", [
    { name: "gamer-improvments-add-group-by-game-button", task: addGroupByGameButton }
  ]);
});

;// CONCATENATED MODULE: ./src/scss/index.scss

        const scss_styles = `:root{--ta-x-sticky-header-height: $ta-x-sticky-header-height}body.trueachievement-extras .ta-x-hide{display:none !important}@media(max-width: 1349px){body.trueachievement-extras .middle{width:100%;max-width:1200px}}@media(max-width: 1199px){body.trueachievement-extras .middle{width:auto;max-width:1200px}}@media(min-width: 576px){body.trueachievement-extras .middle .news-section.list>section.highlight{margin:5px 0}body.trueachievement-extras .middle .news-section.list>section.highlight+section.highlight{margin-top:1rem}}body.trueachievement-extras .ta-x-flex-break{flex-basis:100%;height:0;border:0;padding:0;margin:0}body.trueachievement-extras .ta-x-article-loader{text-align:center}body.trueachievement-extras .ta-x-article-loader img{width:25px;height:25px;margin:0 auto;margin-bottom:.8rem}body.trueachievement-extras [data-ta-x-loaded] .ta-x-article-loader{display:none}body.trueachievement-extras .ta-x-snackbar{visibility:hidden;min-width:250px;margin-left:-125px;background-color:#333;text-align:center;border-radius:1.5rem;padding:16px;position:fixed;z-index:1;left:50%;bottom:30px}body.trueachievement-extras .ta-x-snackbar-show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}body.trueachievement-extras .ta-x-snackbar h2{color:#bbb;border-left:3px solid #3f67a4}body.trueachievement-extras .ta-x-snackbar h2.warning{border-color:#f57921}body.trueachievement-extras .ta-x-snackbar h2.danger{border-color:#f52721}body.trueachievement-extras .ta-x-snackbar h2.success{border-color:#58bb12}@keyframes fadein{from{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@keyframes fadeout{from{bottom:30px;opacity:1}to{bottom:0;opacity:0}}body.trueachievement-extras .ta-x-tabs-link-container{display:flex;overflow-x:auto;margin:-1rem;margin-bottom:.5rem;-ms-overflow-style:none;scrollbar-width:none}body.trueachievement-extras .ta-x-tabs-link-container li{flex-shrink:0}body.trueachievement-extras .ta-x-tabs-link-container::-webkit-scrollbar{display:none}body.trueachievement-extras .ta-x-tabs-link-container.ta-x-tabs-scroll{cursor:grabbing;transform:scale(1)}body.trueachievement-extras .ta-x-tabs-link-container.ta-x-tabs-scroll .ta-x-tabs-link{cursor:grabbing}body.trueachievement-extras .ta-x-tabs-link{padding:.6rem .75rem;user-select:none}body.trueachievement-extras .ta-x-tabs-link.ta-x-tabs-selected{border-bottom:2px solid;pointer-events:none;background:#e8e8e8}body.trueachievement-extras .ta-x-tabs-link:hover{border-bottom:2px solid;cursor:pointer}body.trueachievement-extras .ta-x-tabs-link:nth-child(1),body.trueachievement-extras .ta-x-tabs-link:nth-child(11){border-color:#58bb12}body.trueachievement-extras .ta-x-tabs-link:nth-child(2),body.trueachievement-extras .ta-x-tabs-link:nth-child(12){border-color:#2871a4}body.trueachievement-extras .ta-x-tabs-link:nth-child(3),body.trueachievement-extras .ta-x-tabs-link:nth-child(13){border-color:#cf1812}body.trueachievement-extras .ta-x-tabs-link:nth-child(4),body.trueachievement-extras .ta-x-tabs-link:nth-child(14){border-color:#c42d78}body.trueachievement-extras .ta-x-tabs-link:nth-child(5),body.trueachievement-extras .ta-x-tabs-link:nth-child(15){border-color:#9b30ff}body.trueachievement-extras .ta-x-tabs-link:nth-child(6),body.trueachievement-extras .ta-x-tabs-link:nth-child(16){border-color:#f57921}body.trueachievement-extras .ta-x-tabs-link:nth-child(7),body.trueachievement-extras .ta-x-tabs-link:nth-child(17){border-color:#294a7d}body.trueachievement-extras .ta-x-tabs-link:nth-child(8),body.trueachievement-extras .ta-x-tabs-link:nth-child(18){border-color:#000}body.trueachievement-extras .ta-x-tabs-link:nth-child(9),body.trueachievement-extras .ta-x-tabs-link:nth-child(19){border-color:#fff}body.trueachievement-extras .ta-x-tabs-link:nth-child(10),body.trueachievement-extras .ta-x-tabs-link:nth-child(20){border-color:#e9b949}body.trueachievement-extras .ta-x-tabs-content{display:none;height:10rem;overflow-y:auto;margin-right:-1rem}body.trueachievement-extras .ta-x-tabs-content[data-tab-visible]{display:flex;flex-wrap:wrap}body.trueachievement-extras [data-theme=dark] .ta-x-tabs-selected{background:#282828}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}body.trueachievement-extras .ta-x-ask-loader-container:not([data-ta-x-loaded]) article{display:block}body.trueachievement-extras .ta-x-ask-loader-container article{display:flex;justify-content:space-between}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-article-loader svg{animation-name:spin;animation-duration:2000ms;animation-iteration-count:infinite;animation-timing-function:linear;display:block;margin:auto;margin-bottom:.8rem;width:5rem}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div{display:flex;flex-direction:column}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div label{margin-bottom:.9rem}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div+input{width:100%;margin:0;margin-top:.9rem}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div+input:hover{margin-bottom:2px}body.trueachievement-extras .ta-x-y-show{transform:translateY(0);transition:transform .5s ease}body.trueachievement-extras .ta-x-y-hide{transform:translateY(-100%);transition:transform .5s ease}body.trueachievement-extras .ta-x-y-hide-no-transition{transform:translateY(-100%)}body.trueachievement-extras .ta-x-settings-menu-settings{max-height:547px;overflow-y:scroll !important;padding:0 1rem !important;padding-bottom:1rem !important;height:100%;position:relative}body.trueachievement-extras .ta-x-settings-menu-settings>div{display:block;padding:0}body.trueachievement-extras .ta-x-settings-menu-settings .frm-grp{user-select:none;margin-right:0}body.trueachievement-extras .ta-x-settings-menu-settings .frm-sel::after{top:10px}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings>div{flex-wrap:wrap}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings>div>label{max-width:80%}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-checkbox-help-text{font-size:1.2rem;padding-top:.5rem}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox{padding-top:1rem;border-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox>label{padding-bottom:.5rem;display:block}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst{width:100%;flex-wrap:wrap;justify-content:space-between}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst input.textbox{flex:1}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst input[type=submit]{margin-left:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst ul{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst ul li>div{display:flex;justify-content:space-between;align-items:center;width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst ul li>div p{word-break:break-all}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst ul li>div a{margin-left:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item{position:absolute;display:none;width:313px;padding-bottom:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item-show{display:block}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper{display:flex;flex-wrap:wrap}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper a,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper a,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper a{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h2,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h2,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h2{width:100%;line-height:unset}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h1{margin-bottom:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h2,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h2,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h2{border-top:2px solid #0e5814;border-bottom:2px solid #0e5814;padding:.5rem;font-size:1.6rem;margin:1rem 0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper p,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper p,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper p{font-size:1.4rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper{padding-bottom:0;border:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h1:not(:first-of-type){padding:.5rem 0;margin-top:1rem;border-bottom:2px solid #0552b5;border-top:2px solid #0552b5}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h2:first-of-type{margin-top:0;margin-bottom:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper{padding-top:0;padding-bottom:0;border:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h1{border-top:2px solid #e9b949;border-bottom:2px solid #e9b949;padding:.5rem 0;margin-top:.5rem;margin-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper{border-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h2:first-of-type{margin:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper ul{margin-bottom:.5rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-markdown-marker{flex-basis:unset;align-self:center;padding-right:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion{flex-wrap:wrap;border:0;padding-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion:last-of-type{padding-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header{padding:1rem;flex-shrink:unset;color:#3e4c59;cursor:pointer;user-select:none;background:#ccc}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header>label{color:#333 !important;padding:0;text-align:left;pointer-events:none;font-weight:bold}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header .frm-tgl{pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header .frm-tgl>label{padding:0;pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header span{width:100%;pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header svg{height:20px;pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header.collapsed svg{transition:all .5s linear}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header.expanded svg{transform:rotate(-180deg)}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body{max-height:0;transition:max-height .5s ease-out;overflow:hidden}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body]{border:1px solid #ccc;border-top:0;border-bottom-left-radius:1rem;border-bottom-right-radius:1rem;padding:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body] .ta-x-settings-menu-settings-accordion{margin:0;padding:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body] .ta-x-settings-menu-settings-accordion-header{border-radius:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion .t-settings>div{padding:1rem 0;margin:0 1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion .t-settings>div:last-of-type{border:0}body.trueachievement-extras .ta-x-settings-menu-columned-setting{flex-direction:column;align-items:flex-start}body.trueachievement-extras .ta-x-settings-menu-columned-setting>div:first-of-type{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;width:100%}body.trueachievement-extras .ta-x-settings-menu-columned-setting>div:first-of-type>label{max-width:80%}body.trueachievement-extras .ta-x-settings-menu-columned-setting .frm-sel{padding-top:1rem}body.trueachievement-extras .ta-x-settings-menu-bottom{background:#4a5568;position:absolute;bottom:0;display:block;width:100%;padding:0 1rem !important}body.trueachievement-extras .ta-x-settings-menu-bottom .title{margin-bottom:0;color:#ddd;border:0}body.trueachievement-extras .ta-x-settings-menu-bottom .title a{background:unset}body.trueachievement-extras .ta-x-settings-menu-bottom .title a:hover{text-decoration:underline}body.trueachievement-extras .ta-x-settings-menu .close i{pointer-events:none}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu-bottom .buttons{border-color:#000 !important}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu-bottom .buttons a{background:#4299e1 !important}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-header{color:#ddd;background:#222}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-header>label{color:#ddd !important}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body]{border-color:#222}body.trueachievement-extras .ta-x-sticky-header{position:fixed;top:0;width:100%}body.trueachievement-extras .ta-x-emojis .ta-x-tabs-content[data-tab-visible]{height:10rem;display:grid;grid-template-columns:repeat(5, 1fr);text-align:center}body.trueachievement-extras .ta-x-emojis .ta-x-tabs-content span{font-size:2.2rem;user-select:none}body.trueachievement-extras .ta-x-emojis .ta-x-tabs-content span:hover{cursor:pointer}body.trueachievement-extras.ta-x-staff-walkthrough-improvements{min-width:unset !important;overflow:auto}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main{min-height:unset !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page{position:unset;display:flex;flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector#oWalkthroughImageViewer{width:321px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .noimages,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .itemname{padding:5px;text-align:center;font-size:unset !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header{position:sticky;border-bottom:1px solid #000;display:flex;flex-direction:column;background-color:#fff}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header .noimages{margin-top:0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector a[title="Add images"]{text-align:center;padding:5px;cursor:pointer !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector a[title="Add images"]:hover{text-decoration:underline}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .imageviewer{display:flex;flex-wrap:wrap}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .imageviewer .ivimage{position:unset;margin:5px;max-width:46%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title{text-align:center;padding-top:3px;white-space:break-spaces}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code-button svg{width:32px;margin-left:-10px;margin-right:-4px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg{height:20px;pointer-events:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg path{fill:#555;filter:drop-shadow(21px 21px #fff);pointer-events:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg:hover path{fill:#333}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark{display:block}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle [data-ta-x-tinymce-theme=dark] svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light{display:block}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle [data-ta-x-tinymce-theme=dark] svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar{border-bottom:1px solid #ddd;width:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-width, 0);top:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-top, 0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header{background-color:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header .itemname{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle svg path{fill:#b5b9bf;filter:drop-shadow(21px 21px #000)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar{border-color:#232b33}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar.ta-x-y-hide{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));transition:transform .5s ease}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar.ta-x-y-hide-no-transition{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)))}body.trueachievement-extras.ta-x-staff-walkthrough-improvements>.mce-menu.mce-floatpanel{top:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-floating-menu, 0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .jscolor-wrap .jscolor-border{border:1px solid #232b33 !important;background:#404952 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divWalkthroughHolder{position:unset;margin-top:unset;height:unset;display:flex;justify-content:space-between}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .buttons{display:flex}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button{display:block;flex-grow:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough{margin:0;margin-bottom:3px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough:hover{margin-bottom:5px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughs,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughAchievements,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGames,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGamers,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughOtherSiteLink{position:unset;top:unset;left:unset;display:block;margin:0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough{flex:1;margin:0 1.5rem;height:fit-content}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #btnWalkthrough{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container{display:flex;flex-direction:column;justify-content:space-around}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container{display:flex}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview{margin-left:0;position:unset;width:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview{flex:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions{height:100%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history{position:relative;top:var(--ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history-top, 0)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));transition:transform .5s ease}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide-no-transition{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)))}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons{display:flex;justify-content:center;flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .button{flex:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .button:not(:first-of-type){margin-top:5px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-move-buttons-to-left #chWalkthroughPagePreview .content .buttons{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-move-buttons-to-left #chWalkthroughPagePreview .content .buttons .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main{max-width:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main .admin-page .walkthroughsummary+.walkthroughpagelinks{flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main .admin-page .walkthroughsummary+.walkthroughpagelinks a.next{margin-left:0}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress:not([data-ta-x-loaded]) article{display:block}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article{display:flex;justify-content:space-between}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .walthroughprogress{display:flex;justify-content:center;align-items:center;width:100%}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .walthroughprogress .walkthroughauthor{margin-right:1rem}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .walthroughprogress .clearboth{display:none}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-wrapper{display:flex;flex-direction:column;justify-content:center;flex-basis:100%}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-row{display:flex;align-items:center;margin-bottom:1rem}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-row:last-of-type{margin-bottom:0}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor{margin-left:1rem}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .thanks{display:flex;flex-direction:column;align-items:center;padding-left:1rem;justify-content:center}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] .last,body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] .stats,body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] .author-pages,body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] .read,body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] .stack{display:none}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] p.ta-x-forum-improvements-filter-threads-title{font-weight:700;font-size:1.6rem}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] p:not(.ta-x-forum-improvements-filter-threads-title){display:none}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] a.ta-x-forum-improvements-filter-threads-unhide{font-size:1.4rem}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=false] p.ta-x-forum-improvements-filter-threads-title{display:none}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=false] a.ta-x-forum-improvements-filter-threads-unhide{display:none}body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer .ta-x-xboxachievements-icon{width:36px;height:36px}@media(min-width: 768px){body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer .ta-x-xboxachievements-icon{width:70px;height:70px}}body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer a{flex:none}@media(min-width: 768px){body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer svg{margin-bottom:1rem}}@media(max-width: 767px){body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer svg{margin-right:1rem}}@media(max-width: 767px){body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer>.info{display:block;margin-left:1rem}}@media(max-width: 575px){body.trueachievement-extras a.ta-x-game-achievements-achievement-leaderboard-links{display:none}}@media(min-width: 576px){body.trueachievement-extras div.ta-x-game-achievements-achievement-leaderboard-links{display:none}}`;
        /* harmony default export */ const scss = (scss_styles);
    
;// CONCATENATED MODULE: ./src/features/styles.ts



/* harmony default export */ const features_styles = (async () => {
  if (!await (0,utilities/* waitForElement */.br)("body")) {
    return;
  }
  document.body.classList.add(globals/* Constants */.gT.Styles.root);
  GM_addStyle(scss);
});

;// CONCATENATED MODULE: ./src/features/index.ts










;// CONCATENATED MODULE: ./src/index.ts





ajax_interceptor.addRequestCallback((xhr) => pub_sub.publish("ajaxIntercept:request", xhr));
ajax_interceptor.addResponseCallback((xhr) => pub_sub.publish("ajaxIntercept:response", xhr));
ajax_interceptor.wire();
(async () => {
  (0,utilities/* allConcurrently */.Eh)("Components", [
    { name: "component:snackbar", task: snackbar_snackbar },
    { name: "component:accordion", task: accordion },
    { name: "component:tabs", task: tabs }
  ]);
  (0,utilities/* allConcurrently */.Eh)(
    "Features",
    [
      { name: "feature:styles", task: features_styles },
      { name: "feature:settings-menu", task: settings_menu },
      { name: "feature:sticky-header", task: sticky_header },
      { name: "feature:staff-walkthrough-improvements", task: staff_walkthrough_improvements },
      { name: "feature:forum-improvements", task: forum_improvements },
      { name: "feature:news-improvements", task: news_improvements },
      { name: "feature:games-improvements", task: features_games_improvements },
      { name: "feature:gamer-improvements", task: features_gamer_improvements },
      { name: "feature:emojis", task: features_emojis }
    ],
    4
  );
  (0,utilities/* allConcurrently */.Eh)("Cache", [
    { name: "cache:expired", task: globals/* Cache */.Ct.clearExpired.bind(globals/* Cache */.Ct) },
    { name: "cache:legacy", task: globals/* Cache */.Ct.clearLegacy.bind(globals/* Cache */.Ct) }
  ]);
})();

})();

/******/ })()
;