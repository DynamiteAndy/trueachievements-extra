// ==UserScript==
// @name          TrueAchievements Extra
// @namespace     dynamite-andy
// @version       3.1.1
// @iconURL       https://github.com/dynamiteandy/trueachievements-extra/blob/main/src/resources/icons/favicon32x32.ico?raw=true
// @icon64URL     https://github.com/dynamiteandy/trueachievements-extra/blob/main/src/resources/icons/favicon64x64.ico?raw=true
// @updateURL     https://github.com/dynamiteandy/trueachievements-extra/raw/main/dist/trueachievements-extras.user.js
// @downloadURL   https://github.com/dynamiteandy/trueachievements-extra/raw/main/dist/trueachievements-extras.user.js
// @supportURL    https://github.com/dynamiteandy/trueachievements-extra/issues
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
  await getAchievementWalkthroughUrl();
};
const listen = () => {
  const button = extensionBody.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.Components.AskLoader.buttonJs}`);
  const input = extensionBody.querySelector(`.${_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .Constants */ .gT.Styles.Components.AskLoader.inputJs}`);
  button.addEventListener("click", async (e) => {
    if (!e.target?.nodeName) {
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
      if (_ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .SentencesRegex */ .EP.discussWalkthrough.test(el.innerText) || _ta_x_globals__WEBPACK_IMPORTED_MODULE_0__/* .SentencesRegex */ .EP.walkthroughPublished.test(el.innerText)) {
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
  await getOwnerProgress(url2);
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


const getMap = (name, defaultValue) => {
  const value = GM_getValue(name, defaultValue);
  return value.length !== 0 ? new Map(JSON.parse(value)) : /* @__PURE__ */ new Map();
};
const setMap = (name, value) => {
  GM_setValue(name, JSON.stringify(Array.from(value.entries())));
};
const getArray = (name, defaultValue) => {
  const value = GM_getValue(name, defaultValue);
  return value.length !== 0 ? JSON.parse(value) : [];
};
class Cache {
  static get memoize() {
    return getMap("memoized", "");
  }
  static set memoize(value) {
    setMap("memoized", value);
  }
  static get gameAchievementsXboxAchievementsGuideUrl() {
    return getMap("gameAchievementsXboxAchievementsGuideUrl", "");
  }
  static set gameAchievementsXboxAchievementsGuideUrl(value) {
    setMap("gameAchievementsXboxAchievementsGuideUrl", value);
  }
  static get walkthroughForumOwnerProgressUrl() {
    return getMap("walkthroughOwnerProgressUrl", "");
  }
  static set walkthroughForumOwnerProgressUrl(value) {
    setMap("walkthroughOwnerProgressUrl", value);
  }
  static get walkthroughPreviewWalkthroughId() {
    return getMap("previewWalkthroughId", "");
  }
  static set walkthroughPreviewWalkthroughId(value) {
    setMap("previewWalkthroughId", value);
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
    return getArray("gameClipsDefaultStatusSelectors", "");
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
    const updatedCache = Array.from(this.memoize.entries()).filter((item) => (0,date_util/* isAfterNow */.Q)(item[1].expiryTime));
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
/* harmony default export */ const dispatch_event = ((element, eventType, opts) => {
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
      if (cachedRequest && (0,date_util/* isAfterNow */.Q)(new Date(cachedRequest.expiryTime))) {
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
/* harmony export */   Q: () => (/* binding */ isAfterNow)
/* harmony export */ });
const getDate = (date) => typeof date === "string" ? new Date(date) : date;
const isValid = (date) => date ? new Date(getDate(date)).toString().toLowerCase() !== "invalid date" : false;
const isAfterNow = (date) => {
  const now = /* @__PURE__ */ new Date();
  const actualDate = getDate(date);
  return now < actualDate;
};


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
  return classArray.some((className) => element.classList.contains(className));
};
const waitForElement = (selector, element = document.documentElement, timeoutMS = 1e4) => new Promise((resolve) => {
  if (!element) {
    return resolve(null);
  }
  const foundElement = element.querySelector(selector);
  if (foundElement) {
    return resolve(foundElement);
  }
  let observer;
  const timeout = setTimeout(() => {
    observer.disconnect();
    resolve(null);
  }, timeoutMS);
  observer = new MutationObserver(() => {
    const foundElement2 = element.querySelector(selector);
    if (foundElement2) {
      observer.disconnect();
      clearTimeout(timeout);
      resolve(foundElement2);
    }
  });
  observer.observe(element, {
    childList: true,
    subtree: true
  });
});
const waitForElements = (selector, element = document.documentElement, timeoutMS = 1e4) => new Promise((resolve) => {
  if (!element) {
    return resolve(null);
  }
  const elements = element.querySelectorAll(selector);
  if (elements.length > 0) {
    return resolve(Array.from(elements));
  }
  let observer;
  const timeout = setTimeout(() => {
    observer.disconnect();
    resolve(null);
  }, timeoutMS);
  observer = new MutationObserver(() => {
    const elements2 = element.querySelectorAll(selector);
    if (elements2.length > 0) {
      observer.disconnect();
      clearTimeout(timeout);
      resolve(Array.from(elements2));
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
const waitForImages = (el) => new Promise((resolve) => {
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

// UNUSED EXPORTS: isAfterNow, isTAXListElement, isValid, removeAllChildren, toDate

;// CONCATENATED MODULE: ./src/utilities/array-util.ts
const getDuplicates = (arr, unique) => unique ? [...new Set(arr.filter((e, i, a) => a.indexOf(e) !== i))] : arr.filter((e, i, a) => a.indexOf(e) !== i);

// EXTERNAL MODULE: ./src/utilities/html-element-util.ts
var html_element_util = __webpack_require__("./src/utilities/html-element-util.ts");
;// CONCATENATED MODULE: ./src/utilities/promise-util.ts
const promisify = (fn) => async (...args) => fn(args);
const needsPromisifying = (fn) => fn.constructor.name === "AsyncFunction";
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
      results[curIndex] = await task();
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
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
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
  const matches = extractAllBetween(between, str);
  return matches ? matches[0] : null;
};
const extractAllBetween = (between, str) => {
  const regex = new RegExp(`${between}(.*?)${between}`, "g");
  const matches = str.match(regex);
  return matches ? matches.map((str2) => str2.replace(new RegExp(between, "g"), "")) : null;
};
const insertSeperator = (value, seperator) => value !== null && value !== void 0 ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator) : null;
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  toInt,
  toDate,
  toBool,
  extractBetween,
  extractAllBetween,
  insertSeperator
});


/***/ }),

/***/ "./node_modules/.pnpm/github.com+dynamiteandy+jscolor@e18f85ac8f951e52fcbd2c7ca0ba7fde8447bae5/node_modules/@eastdesire/jscolor/jscolor.js":
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
			if (window.document.readyState !== 'loading') {
		    		jsc.pub.init();
			} else {
		    		window.document.addEventListener('DOMContentLoaded', jsc.pub.init, false);
			}
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
      (0,helpers/* dispatchEvent */.Nu)(toggle, "change");
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

;// CONCATENATED MODULE: ./src/models/tinymce-script.ts

class TinyMCEScript {
  constructor(id) {
    this.createScript = (innerHtml) => {
      const script = document.createElement("script");
      script.id = this.id;
      script.innerHTML = innerHtml;
      return script;
    };
    this.buildScript = () => {
      throw "Not Implemented";
    };
    this.injectScript = async () => {
      await (0,utilities/* waitForElement */.br)(".mce-ta-x-tinymce-group");
      document.body.appendChild(await this.buildScript());
    };
    this.id = id;
  }
}

;// CONCATENATED MODULE: ./src/models/index.ts






;// CONCATENATED MODULE: ./src/features/settings-menu/body.hbs
// Module
var body_code = "<div class=\"js-ta-x-settings-menu-wrench gamer-page\" aria-haspopup=\"true\"><i class=\"fa fa-wrench\"></i></div><div class=\"js-ta-x-settings-menu ta-x-settings-menu ta-x-hide\"><div class=\"middle\"><div class=\"wrap\"><div class=\"labels\"><label class=\"js-ta-x-settings-menu-close close\"><i class=\"fa fa-close\"></i></label></div><div class=\"contents\"><div class=\"contents open ta-x-settings-menu-settings\"><div class=\"t-settings js-ta-x-settings-menu-settings ta-x-settings-menu-settings-item ta-x-settings-menu-settings-item-show\"><div class=\"ta-x-checkbox\" data-render-condition><label>Sticky Header</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"stickyHeader.enabled\" id=\"chkStickyHeader\" name=\"chkStickyHeader\" type=\"checkbox\"><label for=\"chkStickyHeader\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStickyHeader\", \"checked\": true }'>This feature may cause some sticky elements to look buggy. Let me know what you spot!</p></div><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStickyHeader\", \"checked\": true }'><label>Remain Stuck</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"stickyHeader.remainStuck\" id=\"chkStickyHeaderRemainStuck\" name=\"chkStickyHeaderRemainStuck\" type=\"checkbox\"><label for=\"chkStickyHeaderRemainStuck\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition style=\"border:0\"><label>Emojis</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"emojis.enabled\" id=\"chkEmojis\" name=\"chkEmojis\" type=\"checkbox\"><label for=\"chkEmojis\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion\" style=\"padding-top:0\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Forum Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.enabled\" id=\"chkForumImprovements\" name=\"chkForumImprovements\" type=\"checkbox\"><label for=\"chkForumImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Enable Thread Filter</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.forumImprovementsThreadFilter\" id=\"chkForumImprovementsForumImprovementsThreadFilter\" name=\"chkForumImprovementsForumImprovementsThreadFilter\" type=\"checkbox\"><label for=\"chkForumImprovementsForumImprovementsThreadFilter\"></label></div></div><div class=\"ta-x-listbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkForumImprovementsForumImprovementsThreadFilter\", \"checked\": true }'><label>Keywords</label><div class=\"frm-grp frm-lst\" data-list-id=\"txtThreadKeywordFilter\" data-template-id=\"#ta-x-template-forum-improvements-thread-filter-keywords\"><template id=\"ta-x-template-forum-improvements-thread-filter-keywords\"><li><div><p data-value=\"{listSetting.value}\">{listSetting.value}</p><a data-for-list=\"{listSetting.id}\" data-remove href=\"#\" onclick=\"event.preventDefault()\"> Remove </a></div></li></template><input class=\"textbox cs-n\" id=\"txtThreadKeywordFilter-input\" name=\"txtThreadKeywordFilte\"><input value=\"Add Filter\" data-add data-array-split=\",\" data-config-path=\"forumImprovements.threadFilterKeywords\" data-for-list=\"txtThreadKeywordFilter\" data-is-array=\"true\" onclick=\"event.preventDefault()\" type=\"submit\"><ul class=\"item-list\" id=\"txtThreadKeywordFilter\"></ul></div></div></div><div data-render-condition='{ \"selector\": \"#chkForumImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> My Threads </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Override Forum Settings</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.myThreads.myThreadsForumOverride\" id=\"chkForumImprovementsMyThreadsForumOverride\" name=\"chkForumImprovementsMyThreadsForumOverride\" type=\"checkbox\"><label for=\"chkForumImprovementsMyThreadsForumOverride\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkForumImprovementsMyThreadsForumOverride\", \"checked\": false }'>Some settings will be inherited from Forums.</p></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkForumImprovementsMyThreadsForumOverride\", \"checked\": true }'><label>Enable Thread Filter</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.myThreads.myThreadsThreadFilter\" id=\"chkForumImprovementsMyThreadsThreadFilter\" name=\"chkForumImprovementsMyThreadsThreadFilter\" type=\"checkbox\"><label for=\"chkForumImprovementsMyThreadsThreadFilter\"></label></div></div><div class=\"ta-x-listbox ta-x-hide\" data-render-condition='[\n                    { \"selector\": \"#chkForumImprovementsMyThreadsForumOverride\", \"checked\": true },\n                    { \"selector\": \"#chkForumImprovementsMyThreadsThreadFilter\", \"checked\": true }\n                ]'><label>Keywords</label><div class=\"frm-grp frm-lst\" data-list-id=\"txtForumImprovementsMyThreadsThreadKeywordFilter\" data-template-id=\"#ta-x-template-forum-improvements-thread-filter-keywords\"><template id=\"ta-x-template-forum-improvements-thread-filter-keywords\"><li><div><p data-value=\"{listSetting.value}\">{listSetting.value}</p><a data-for-list=\"{listSetting.id}\" data-remove href=\"#\" onclick=\"event.preventDefault()\"> Remove </a></div></li></template><input class=\"textbox cs-n\" id=\"txtForumImprovementsMyThreadsThreadKeywordFilter-input\" name=\"txtForumImprovementsMyThreadsThreadKeywordFilte\"><input value=\"Add Filter\" data-add data-array-split=\",\" data-config-path=\"forumImprovements.myThreads.threadFilterKeywords\" data-for-list=\"txtForumImprovementsMyThreadsThreadKeywordFilter\" data-is-array=\"true\" onclick=\"event.preventDefault()\" type=\"submit\"><ul class=\"item-list\" id=\"txtForumImprovementsMyThreadsThreadKeywordFilter\"></ul></div></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkForumImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Walkthroughs </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Show Owner/Progress</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"forumImprovements.walkthroughs.showOwnerProgress\" id=\"chkForumImprovementsShowOwnerProgress\" name=\"chkForumImprovementsShowOwnerProgress\" type=\"checkbox\"><label for=\"chkForumImprovementsShowOwnerProgress\"></label></div></div></div></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Gamer Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamerImprovements.enabled\" id=\"chkGamerImprovements\" name=\"chkGamerImprovements\" type=\"checkbox\"><label for=\"chkGamerImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div class=\"ta-x-checkbox\" data-render-condition><label>Add Group By Game Button</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamerImprovements.achievements.addGroupByGameButton\" id=\"chkGamerImprovementsGroupByGameButton\" name=\"chkGamerImprovementsGroupByGameButton\" type=\"checkbox\"><label for=\"chkGamerImprovementsGroupByGameButton\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamerImprovementsGroupByGameButton\", \"checked\": true }'>This feature is unstyled, let me know if you have any ideas for how to make this look!</p></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Games Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.enabled\" id=\"chkGamesImprovements\" name=\"chkGamesImprovements\" type=\"checkbox\"><label for=\"chkGamesImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div class=\"ta-x-checkbox\" data-render-condition style=\"border:0\"><label>Add Highlight Games Not In Collection Button</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.games.addHighlightGamesNotInCollectionButton\" id=\"chkGamesImprovementsHighlightGamesNotInCollectionButton\" name=\"chkGamesImprovementsHighlightGamesNotInCollectionButton\" type=\"checkbox\"><label for=\"chkGamesImprovementsHighlightGamesNotInCollectionButton\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsHighlightGamesNotInCollectionButton\", \"checked\": true }'>This feature is unstyled, let me know if you have any ideas for how to make this look!</p></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Achievements </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Show progress as XX/XX</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.achievements.gameAchievementsIndividualProgress\" id=\"chkGamesImprovementsGameAchievementsIndividualProgress\" name=\"chkGamesImprovementsGameAchievementsIndividualProgress\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameAchievementsIndividualProgress\"></label></div></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Game Achievements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.achievements.gameAchievementsDefaultStatus\" id=\"chkGamesImprovementsGameAchievementsDefaultStatus\" name=\"chkGamesImprovementsGameAchievementsDefaultStatus\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameAchievementsDefaultStatus\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameAchievementsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.achievements.gameAchievementsDefaultStatusValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameAchievementsDefaultStatusValue\" name=\"selGamesImprovementsGameAchievementsDefaultStatusValue\"><option selected=\"selected\" value=\"rdoAllAchievements\">All</option><option selected=\"selected\" value=\"rdoWonAchievements\">Won</option><option selected=\"selected\" value=\"rdoNotWonAchievements\">Not Won</option></select></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Include Guides From XboxAchievements.com</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.achievements.gameAchievementsShowXboxAchievementGuides\" id=\"chkGamesImprovementsGameAchievementsShowXboxAchievementGuides\" name=\"chkGamesImprovementsGameAchievementsShowXboxAchievementGuides\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameAchievementsShowXboxAchievementGuides\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameAchievementsShowXboxAchievementGuides\", \"checked\": true }'>This feature is tempermental, let me know if you have any issues!</p></div></div></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Challenges </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Override Achievement Settings</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.challenges.gameChallengesOverride\" id=\"chkGamesImprovementsGameChallengesOverride\" name=\"chkGamesImprovementsGameChallengesOverride\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameChallengesOverride\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameChallengesOverride\", \"checked\": false }'>Some settings will be inherited from Achievements.</p></div><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameChallengesOverride\", \"checked\": true }'><label>Show progress as XX/XX</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.challenges.gameChallengesIndividualProgress\" id=\"chkGamesImprovementsGameChallengesIndividualProgress\" name=\"chkGamesImprovementsGameChallengesIndividualProgress\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameChallengesIndividualProgress\"></label></div></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Game Challenges</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.challenges.gameChallengesDefaultStatus\" id=\"chkGamesImprovementsGameChallengesDefaultStatus\" name=\"chkGamesImprovementsGameChallengesDefaultStatus\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameChallengesDefaultStatus\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameChallengesDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.challenges.gameChallengesDefaultStatusValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameChallengesDefaultStatusValue\" name=\"selGamesImprovementsGameChallengesDefaultStatusValue\"><option selected=\"selected\" value=\"rdoAllChallenges\">All</option><option selected=\"selected\" value=\"rdoWonChallenges\">Won</option><option selected=\"selected\" value=\"rdoNotWonChallenges\">Not Won</option></select></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Clips </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Game Clips</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.clips.gameClipsDefaultStatus\" id=\"chkGamesImprovementsGameClipsDefaultStatus\" name=\"chkGamesImprovementsGameClipsDefaultStatus\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameClipsDefaultStatus\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'>This feature will cause multiple page reloads if you change more than one default!</p></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultRecordedByValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultRecordedByValue\" name=\"selGamesImprovementsGameClipsDefaultRecordedByValue\"><option selected=\"selected\" value>Anyone</option><option value=\"My friends\" selected=\"selected\">My friends</option></select></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultSavedByValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultSavedByValue\" name=\"selGamesImprovementsGameClipsDefaultSavedByValue\"><option selected=\"selected\" value>Anyone</option><option selected=\"selected\" value=\"Gamer\">Gamer</option><option selected=\"selected\" value=\"Xbox\">Xbox</option></select></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultRecordedValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultRecordedValue\" name=\"selGamesImprovementsGameClipsDefaultRecordedValue\"><option selected=\"selected\" value=\"7\">This week</option><option selected=\"selected\" value=\"30\">This month</option><option selected=\"selected\" value=\"365\">This year</option><option selected=\"selected\" value=\"0\">All</option></select></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameClipsDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.clips.gameClipsDefaultSortByValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameClipsDefaultSortByValue\" name=\"selGamesImprovementsGameClipsDefaultSortByValue\"><option value=\"Most viewed\" selected=\"selected\">Most viewed</option><option value=\"Most favourited\" selected=\"selected\">Most favourited</option><option value=\"Most commented\" selected=\"selected\">Most commented</option><option selected=\"selected\" value=\"Longest\">Longest</option><option selected=\"selected\" value=\"GamerTag\">GamerTag</option></select></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> DLC </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Override Achievement Settings</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.dlc.gameDLCOverride\" id=\"chkGamesImprovementsGameDLCOverride\" name=\"chkGamesImprovementsGameDLCOverride\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameDLCOverride\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameDLCOverride\", \"checked\": false }'>Some settings will be inherited from Achievements.</p></div><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameDLCOverride\", \"checked\": true }'><label>Show progress as XX/XX</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.dlc.gameDLCIndividualProgress\" id=\"chkGamesImprovementsGameDLCIndividualProgress\" name=\"chkGamesImprovementsGameDLCIndividualProgress\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameDLCIndividualProgress\"></label></div></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameDLCOverride\", \"checked\": true }'><label>Default Status for Game DLC Achievements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.dlc.gameDLCDefaultStatus\" id=\"chkGamesImprovementsGameDLCDefaultStatus\" name=\"chkGamesImprovementsGameDLCDefaultStatus\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameDLCDefaultStatus\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='[\n                { \"selector\": \"#chkGamesImprovementsGameDLCOverride\", \"checked\": true },\n                { \"selector\": \"#chkGamesImprovementsGameDLCDefaultStatus\", \"checked\": true }]'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.dlc.gameDLCDefaultStatusValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameDLCDefaultStatusValue\" name=\"selGamesImprovementsGameDLCDefaultStatusValue\"><option selected=\"selected\" value=\"rdoAllAchievements\">All</option><option selected=\"selected\" value=\"rdoWonAchievements\">Won</option><option selected=\"selected\" value=\"rdoNotWonAchievements\">Not Won</option></select></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkGamesImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Forums </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Override Forum Settings</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.forums.gameForumsForumOverride\" id=\"chkGamesImprovementsGameForumsForumOverride\" name=\"chkGamesImprovementsGameForumsForumOverride\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameForumsForumOverride\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameForumsForumOverride\", \"checked\": false }'>Some settings will be inherited from Forums.</p></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameForumsForumOverride\", \"checked\": true }'><label>Enable Thread Filter</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.forums.gameForumsThreadFilter\" id=\"chkGameImprovementsGameForumsThreadFilter\" name=\"chkGameImprovementsGameForumsThreadFilter\" type=\"checkbox\"><label for=\"chkGameImprovementsGameForumsThreadFilter\"></label></div></div><div class=\"ta-x-listbox ta-x-hide\" data-render-condition='[\n                    { \"selector\": \"#chkGamesImprovementsGameForumsForumOverride\", \"checked\": true },\n                    { \"selector\": \"#chkGameImprovementsGameForumsThreadFilter\", \"checked\": true }\n                ]'><label>Keywords</label><div class=\"frm-grp frm-lst\" data-list-id=\"txtGameImprovementsGameForumsThreadKeywordFilter\" data-template-id=\"#ta-x-template-forum-improvements-thread-filter-keywords\"><template id=\"ta-x-template-forum-improvements-thread-filter-keywords\"><li><div><p data-value=\"{listSetting.value}\">{listSetting.value}</p><a data-for-list=\"{listSetting.id}\" data-remove href=\"#\" onclick=\"event.preventDefault()\"> Remove </a></div></li></template><input class=\"textbox cs-n\" id=\"txtGameImprovementsGameForumsThreadKeywordFilter-input\" name=\"txtGameImprovementsGameForumsThreadKeywordFilte\"><input value=\"Add Filter\" data-add data-array-split=\",\" data-config-path=\"gamesImprovements.forums.threadFilterKeywords\" data-for-list=\"txtGameImprovementsGameForumsThreadKeywordFilter\" data-is-array=\"true\" onclick=\"event.preventDefault()\" type=\"submit\"><ul class=\"item-list\" id=\"txtGameImprovementsGameForumsThreadKeywordFilter\"></ul></div></div></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Thread Type for Game Forums</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"gamesImprovements.forums.gameForumsDefaultThread\" id=\"chkGamesImprovementsGameForumsDefaultThread\" name=\"chkGamesImprovementsGameForumsDefaultThread\" type=\"checkbox\"><label for=\"chkGamesImprovementsGameForumsDefaultThread\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkGamesImprovementsGameForumsDefaultThread\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"gamesImprovements.forums.gameForumsDefaultThreadValue\" data-is-array=\"false\" id=\"selGamesImprovementsGameForumsDefaultThreadValue\" name=\"selGamesImprovementsGameForumsDefaultThreadValue\"><option selected=\"selected\" value=\"all\">All Threads</option><option selected=\"selected\" value=\"community\">Community Threads</option><option selected=\"selected\" value=\"gameinfo\">Game Info Threads</option></select></div></div></div></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>News Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"newsImprovements.enabled\" id=\"chkNewsImprovements\" name=\"chkNewsImprovements\" type=\"checkbox\"><label for=\"chkNewsImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div data-render-condition='{ \"selector\": \"#chkNewsImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Sales </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Sort Sales By</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"newsImprovements.sales.autoSortBy\" id=\"chkNewsImprovementsSalesAutoSortBy\" name=\"chkNewsImprovementsSalesAutoSortBy\" type=\"checkbox\"><label for=\"chkNewsImprovementsSalesAutoSortBy\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkNewsImprovementsSalesAutoSortBy\", \"checked\": true }'><select class=\"dropdown\" data-array-split=\",\" data-config-path=\"newsImprovements.sales.autoSortByValue\" data-is-array=\"true\" id=\"selNewsImprovementsSalesAutoSortByValue\" name=\"selNewsImprovementsSalesAutoSortByValue\"><option selected=\"selected\" value=\"product,game\">Product</option><option selected=\"selected\" value=\"sale-price\">Sale Price</option><option selected=\"selected\" value=\"discount\">Discount</option><option selected=\"selected\" value=\"completion-time\">Completion Time</option><option selected=\"selected\" value=\"ta-ratio\">TA Ratio</option></select></div><div data-render-condition='{ \"selector\": \"#chkNewsImprovementsSalesAutoSortBy\", \"checked\": true }' class=\"ta-x-hide\"><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#selNewsImprovementsSalesAutoSortByValue\", \"value\": \"completion-time,ta-ratio\" }'>This option may not work on some tables. Let me know what you spot!</p></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkNewsImprovementsSalesAutoSortBy\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"newsImprovements.sales.autoSortByOrder\" data-is-array=\"false\" id=\"selNewsImprovementsSalesAutoSortByOrder\" name=\"selNewsImprovementsSalesAutoSortByOrder\"><option selected=\"selected\" value=\"asc\">Ascendening</option><option selected=\"selected\" value=\"desc\">Descending</option></select></div></div></div></div></div></div><div class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-checkbox ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\" data-checkbox-accordion><label>Staff Walkthrough Improvements</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.enabled\" id=\"chkStaffWalkthroughImprovements\" name=\"chkStaffWalkthroughImprovements\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovements\"></label></div></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\" data-parent-accordion-body><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Edit Walkthrough </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Improved Image Selector</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.editWalkthrough.improvedImageSelector\" id=\"chkStaffWalkthroughImprovementsImproveImageSelector\" name=\"chkStaffWalkthroughImprovementsImproveImageSelector\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsImproveImageSelector\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Auto Save Notifications</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.editWalkthrough.autoSaveNotification\" id=\"chkStaffWalkthroughImprovementsAutoSaveNotification\" name=\"chkStaffWalkthroughImprovementsAutoSaveNotification\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsAutoSaveNotification\"></label></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Manage Walkthrough </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Clickable Table Links</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.clickableTableLinks\" id=\"chkStaffWalkthroughImprovementsClickableTableLinks\" name=\"chkStaffWalkthroughImprovementsClickableTableLinks\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsClickableTableLinks\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Add Missing Buttons</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.addMissingButtons\" id=\"chkStaffWalkthroughImprovementsAddPageButton\" name=\"chkStaffWalkthroughImprovementsAddPageButton\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsAddPageButton\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Auto Select First Walkthrough</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.autoSelectFirst\" id=\"chkStaffWalkthroughImprovementsAutoSelectFirst\" name=\"chkStaffWalkthroughImprovementsAutoSelectFirst\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsAutoSelectFirst\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\", \"checked\": true }'>This feature runs after the default status has been set.</p></div><div class=\"ta-x-settings-menu-columned-setting\"><div class=\"ta-x-checkbox\" data-render-condition><label>Default Status for Manage Walkthrough</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.manageWalkthroughDefaultStatus\" id=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\" name=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\"></label></div></div><div class=\"frm-grp frm-sel ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovementsManageWalkthroughDefaultStatus\", \"checked\": true }'><select class=\"dropdown\" data-array-split data-config-path=\"staffWalkthroughImprovements.manageWalkthrough.manageWalkthroughDefaultStatusValue\" data-is-array=\"false\" id=\"selStaffWalkthroughImprovementsManageWalkthroughDefaultStatusValue\" name=\"selStaffWalkthroughImprovementsManageWalkthroughDefaultStatusValue\"><option selected=\"selected\" value=\"-1\">(All)</option><option selected=\"selected\" value=\"New\">New</option><option value=\"In progress\" selected=\"selected\">In progress</option><option value=\"Ready for review\" selected=\"selected\">Ready for review</option><option value=\"Ready for publish\" selected=\"selected\">Ready for publish</option><option selected=\"selected\" value=\"Published\">Published</option><option value=\"New owner required\" selected=\"selected\">New owner required</option></select></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Walkthrough Page </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Stick Page History To Left</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.stickyPageHistory\" id=\"chkStaffWalkthroughImprovementsStickyPageHistory\" name=\"chkStaffWalkthroughImprovementsStickyPageHistory\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsStickyPageHistory\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Move Buttons To The Left</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.moveButtonsToLeft\" id=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\" name=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsMoveButtonsToLeft\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Add Walkthrough Team Button</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.walkthroughTeamButton\" id=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\" name=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsWalkthroughTeamButton\"></label></div></div><div class=\"ta-x-checkbox\" data-render-condition><label>Highlight Page Locked</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPage.highlightPageLocked\" id=\"chkStaffWalkthroughImprovementsHighlightPageLocked\" name=\"chkStaffWalkthroughImprovementsHighlightPageLocked\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsHighlightPageLocked\"></label></div></div></div></div><div data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovements\", \"checked\": true }' class=\"ta-x-settings-menu-settings-accordion\"><div class=\"ta-x-settings-menu-settings-accordion-header labels js-ta-x-accordion collapsed\"><span> Walkthrough Preview </span><svg viewbox=\"0 0 512 512\" class=\"ta-x-settings-menu-settings-accordion-header-icon\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\" fill=\"currentColor\"></path></svg></div><div class=\"ta-x-settings-menu-settings-accordion-body t-settings\"><div class=\"ta-x-checkbox\" data-render-condition><label>Populate Side Column Content</label><div class=\"frm-grp frm-tgl\"><input checked=\"checked\" data-config-path=\"staffWalkthroughImprovements.walkthroughPreview.populateAsideContent\" id=\"chkStaffWalkthroughImprovementsPopulateAsideContent\" name=\"chkStaffWalkthroughImprovementsPopulateAsideContent\" type=\"checkbox\"><label for=\"chkStaffWalkthroughImprovementsPopulateAsideContent\"></label></div><div class=\"ta-x-flex-break\"></div><p class=\"ta-x-checkbox-help-text ta-x-hide\" data-render-condition='{ \"selector\": \"#chkStaffWalkthroughImprovementsPopulateAsideContent\", \"checked\": true }'>This feature only supports \"In Progress\", \"Ready for review\" and \"Ready for publish\" walkthroughs, let me know if you want it to support others!</p></div></div></div></div></div></div><div class=\"t-settings js-ta-x-settings-menu-changelog ta-x-settings-menu-settings-item\"><div class=\"ta-x-settings-menu-changelog-wrapper\"><h1>Changelog</h1><h2>3.1.1</h2><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>Update urls to point at new repo</p></li></ul><a class=\"ta-x-settings-menu-changelog-link\" href=\"https://github.com/dynamiteandy/trueachievements-extra/blob/main/CHANGELOG.md\">See the full changelog here</a></div><div class=\"ta-x-settings-menu-credits-wrapper\"><h1>Credits</h1><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p><a href=\"https://www.trueachievements.com/gamer/Dynamite+Andy\">Dynamite Andy</a> - Main contributor,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p><a href=\"https://www.trueachievements.com/gamer/Belindo152\">Belindo152</a> for code contributions, bug reports and feature requests,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p><a href=\"https://www.trueachievements.com/gamer/Amoa\">Amoa</a>, <a href=\"https://www.trueachievements.com/gamer/DynamicWolfNLD\">DynamicWolfNLD</a> and <a href=\"https://www.trueachievements.com/gamer/ManicMetalhead\">ManicMetalhead</a>, <a href=\"https://www.trueachievements.com/gamer/zr122\">zr122</a> for feature requests and bug reports,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>You for using this addon and checking out this work, thank you - it mean's alot.</p></li></ul></div></div><div class=\"t-settings js-ta-x-settings-menu-feature-documentation ta-x-settings-menu-settings-item\"><div class=\"ta-x-settings-menu-documentation-wrapper\"><h1>Feature Documentation</h1><h2>Sticky Header</h2><p>This feature will make the header stick to the top of the page, it will auto hide on scroll down and reappear on scroll up providing quick access, this feature has a sister setting titled \"Remain Stuck\" this will keep the header stuck to the top of the page and no longer show/hide on scroll.</p><h2>Emojis</h2><p>This feature remains a work in progress as I'm still finding all the locations we can input comments/replies/etc - but does what it says on the tin! Extends the emojis TA has to offer with unicode emojis.</p><h1>Forum Improvements</h1><p>This enables extended features to be enabled.</p><h2>Enable Thread Filter</h2><p>This feature will hide thread titles if they match specified keywords</p><h2>My Threads - Override Forum Settings</h2><p>This feature will override any feature shared between forums, current features shared:</p><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>Enable Thread Filter</p></li></ul><h2>Walkthroughs - Show Owner/Progress</h2><p>This feature appends information to the right sidebar which shows either:</p><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>The progress and the author if the walkthrough is in progress,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>The gamers involved with the walkthrough and the total likes if published,</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>A request for a url if the addon is unable to find a link to the walkthrough.</p></li></ul><h1>Gamer Improvements</h1><p>This enables extended features to be enabled.</p><h2>Add Group By Game Button</h2><p>This feature adds a button to the \"My unlocked achievements\" page, to group the achievements unlocked on a page by game, this feature is currently unstyled and looks a bit odd on the page, if you have any ideas for how it should look - let me know!</p><h1>Games Improvements</h1><p>This enables extended features to be enabled.</p><h2>Add Highlight Games Not In Collection Button</h2><p>This feature adds a button to the \"Full Xbox Games List\" page, to highlight games on a page that are not in your game collection, this feature is currently unstyled and looks a bit odd on the page, if you have any ideas for how it should look - let me know!</p><h2>Achievements - Show Progress as XX/XX</h2><p>This feature calculates the progress made for each game + dlc and shows it as xx/xx instead of just the maximum values possible, this feature does not currently support games without any dlc - should it? Let me know!</p><h2>Achievements - Default Status for Game Achievements</h2><p>This feature will auto select the selected filter should it not be selected/all achievements not unlocked.</p><h2>Achievements - Include Guides From XboxAchievements.com</h2><p>This feature will include guides from <a href=\"https://www.xboxachievements.com/\">XboxAchievements.com</a> when viewing a achievement solution, it can be buggy/look broken but is helpful for achievements which may not have a guide available.</p><h2>Challenges - Override Achievement Settings</h2><p>This feature will override any feature shared between achievements and challenges, current features shared:</p><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>Show Progress as XX/XX</p></li></ul><h2>Clips - Default Status for Game Clips</h2><p>This feature will auto select the selected values should they not be selected.</p><h2>DLC - Override Achievement Settings</h2><p>This feature will override any feature shared between achievements and dlc, current features shared:</p><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>Show Progress as XX/XX</p></li><li><span class=\"ta-x-markdown-marker\">➤</span><p>Default Status for Game Achievements</p></li></ul><h2>Forums - Override Forum Settings</h2><p>This feature will override any feature shared between forums, current features shared:</p><ul><li><span class=\"ta-x-markdown-marker\">➤</span><p>Enable Thread Filter</p></li></ul><h2>Forums - Default Thread Type for Game Forums</h2><p>This feature will auto select the selected thread type should it not be selected/all.</p><h1>News Improvements</h1><p>This enables extended features to be enabled.</p><h2>Sales - Sort Sales By</h2><p>This feature will auto set the sales page to be ordered the way specified if not already ordered.</p><h1>Staff Walkthrough Improvements</h1><p>This enables tweaks to some styles on the staff walkthrough pages to make it feel more responsive, some tweaks to the tinymce editor to add some new features and styles, but also allow extended features to be enabled.</p><h2>Edit Walkthrough - Improved Image Selector</h2><p>This feature gives the image selector a bit of a visual overhaul, fixing the add image link to the top, making images more presentable and overall giving it a much cleaner feel.</p><h2>Edit Walkthrough - Auto Save Notifications</h2><p>This feature will display a notification when autosave is executed.</p><h2>Manage Walkthrough - Clickable Table Links</h2><p>This feature will make achievements, games, gamers clickable for quick and easy access to its page.</p><h2>Manage Walkthrough - Add Missing Buttons</h2><p>This feature will prevent buttons like add page, edit page etc from going missing when adding/editing pages.</p><h2>Manage Walkthrough - Auto Select First Walkthrough</h2><p>This feature will auto select the first walkthrough in the list if no walkthrough is selected.</p><h2>Manage Walkthrough - Default Status for Manage Walkthrough</h2><p>This feature will auto switch to the selected status for walkthroughs should it not be selected or no walkthrough currently open.</p><h2>Walkthrough Page - Stick Page History To Left</h2><p>This feature will stick the left sidebar to the page, providing quick access to buttons and links for editing the page.</p><h2>Walkthrough Page - Move Buttons To The Left</h2><p>This feature will move the buttons on the right side of the page, to be contained within the left sidebar, handy if \"Stick Page History To Left\" is enabled as provides quick access to them.</p><h2>Walkthrough Page - Add Walkthrough Team Button</h2><p>This feature will add a button to the left sidebar providing quick access to the manage walkthrough page (This is currently missing for editors, but visible for authors).</p><h2>Walkthrough Page - Highlight Page Locked</h2><p>This feature will highlight the page locked message making it more visible.</p><h2>Walkthrough Preview - Populate Side Column Content</h2><p>This feature will generate sidebar content to give a more accurate representation of how the walkthrough will look when previewed.</p></div></div></div><div class=\"t-settings open ta-x-settings-menu-bottom\"><ul class=\"list-links buttons\"><li><a href=\"https://github.com/dynamiteandy/trueachievements-extra/issues/new\"> Raise a Bug </a></li><li><a href=\"https://github.com/dynamiteandy/trueachievements-extra/issues/new\"> Request a Feature </a></li></ul><div class=\"title\"><span> TrueAchievements Extra </span><div class=\"ta-x-flex-break\"></div><a class=\"js-ta-x-settings-menu-version\" href=\"#\"> Version {GM_info.script.version} </a><span> | </span><a class=\"js-ta-x-settings-menu-documentation\" href=\"#\"> Feature Documentation </a></div></div></div></div></div><div class=\"js-ta-x-settings-menu-close close\"></div></div>";
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

;// CONCATENATED MODULE: ./node_modules/.pnpm/emoji.json@15.1.0/node_modules/emoji.json/emoji.json
const emoji_namespaceObject = JSON.parse('[["char","name","group","a|0|1|2","😀","grinning face","Smileys & Emotion","o|3|4|5|6","😃","grinning face with big eyes","o|3|8|9|6","😄","grinning face with smiling eyes","o|3|B|C|6","😁","beaming face with smiling eyes","o|3|E|F|6","😆","grinning squinting face","o|3|H|I|6","😅","grinning face with sweat","o|3|K|L|6","🤣","rolling on the floor laughing","o|3|N|O|6","😂","face with tears of joy","o|3|Q|R|6","🙂","slightly smiling face","o|3|T|U|6","🙃","upside-down face","o|3|W|X|6","🫠","melting face","o|3|Z|a|6","😉","winking face","o|3|c|d|6","😊","smiling face with smiling eyes","o|3|f|g|6","😇","smiling face with halo","o|3|i|j|6","🥰","smiling face with hearts","o|3|l|m|6","😍","smiling face with heart-eyes","o|3|o|p|6","🤩","star-struck","o|3|r|s|6","😘","face blowing a kiss","o|3|u|v|6","😗","kissing face","o|3|x|y|6","☺️","smiling face","o|3|10|11|6","☺","o|3|13|11|6","😚","kissing face with closed eyes","o|3|15|16|6","😙","kissing face with smiling eyes","o|3|18|19|6","🥲","smiling face with tear","o|3|1B|1C|6","😋","face savoring food","o|3|1E|1F|6","😛","face with tongue","o|3|1H|1I|6","😜","winking face with tongue","o|3|1K|1L|6","🤪","zany face","o|3|1N|1O|6","😝","squinting face with tongue","o|3|1Q|1R|6","🤑","money-mouth face","o|3|1T|1U|6","🤗","smiling face with open hands","o|3|1W|1X|6","🤭","face with hand over mouth","o|3|1Z|1a|6","🫢","face with open eyes and hand over mouth","o|3|1c|1d|6","🫣","face with peeking eye","o|3|1f|1g|6","🤫","shushing face","o|3|1i|1j|6","🤔","thinking face","o|3|1l|1m|6","🫡","saluting face","o|3|1o|1p|6","🤐","zipper-mouth face","o|3|1r|1s|6","🤨","face with raised eyebrow","o|3|1u|1v|6","😐","neutral face","o|3|1x|1y|6","😑","expressionless face","o|3|20|21|6","😶","face without mouth","o|3|23|24|6","🫥","dotted line face","o|3|26|27|6","😶‍🌫️","face in clouds","o|3|29|2A|6","😶‍🌫","o|3|2C|2A|6","😏","smirking face","o|3|2E|2F|6","😒","unamused face","o|3|2H|2I|6","🙄","face with rolling eyes","o|3|2K|2L|6","😬","grimacing face","o|3|2N|2O|6","😮‍💨","face exhaling","o|3|2Q|2R|6","🤥","lying face","o|3|2T|2U|6","🫨","shaking face","o|3|2W|2X|6","🙂‍↔️","head shaking horizontally","o|3|2Z|2a|6","🙂‍↔","o|3|2c|2a|6","🙂‍↕️","head shaking vertically","o|3|2e|2f|6","🙂‍↕","o|3|2h|2f|6","😌","relieved face","o|3|2j|2k|6","😔","pensive face","o|3|2m|2n|6","😪","sleepy face","o|3|2p|2q|6","🤤","drooling face","o|3|2s|2t|6","😴","sleeping face","o|3|2v|2w|6","😷","face with medical mask","o|3|2y|2z|6","🤒","face with thermometer","o|3|31|32|6","🤕","face with head-bandage","o|3|34|35|6","🤢","nauseated face","o|3|37|38|6","🤮","face vomiting","o|3|3A|3B|6","🤧","sneezing face","o|3|3D|3E|6","🥵","hot face","o|3|3G|3H|6","🥶","cold face","o|3|3J|3K|6","🥴","woozy face","o|3|3M|3N|6","😵","face with crossed-out eyes","o|3|3P|3Q|6","😵‍💫","face with spiral eyes","o|3|3S|3T|6","🤯","exploding head","o|3|3V|3W|6","🤠","cowboy hat face","o|3|3Y|3Z|6","🥳","partying face","o|3|3b|3c|6","🥸","disguised face","o|3|3e|3f|6","😎","smiling face with sunglasses","o|3|3h|3i|6","🤓","nerd face","o|3|3k|3l|6","🧐","face with monocle","o|3|3n|3o|6","😕","confused face","o|3|3q|3r|6","🫤","face with diagonal mouth","o|3|3t|3u|6","😟","worried face","o|3|3w|3x|6","🙁","slightly frowning face","o|3|3z|40|6","☹️","frowning face","o|3|42|43|6","☹","o|3|45|43|6","😮","face with open mouth","o|3|47|48|6","😯","hushed face","o|3|4A|4B|6","😲","astonished face","o|3|4D|4E|6","😳","flushed face","o|3|4G|4H|6","🥺","pleading face","o|3|4J|4K|6","🥹","face holding back tears","o|3|4M|4N|6","😦","frowning face with open mouth","o|3|4P|4Q|6","😧","anguished face","o|3|4S|4T|6","😨","fearful face","o|3|4V|4W|6","😰","anxious face with sweat","o|3|4Y|4Z|6","😥","sad but relieved face","o|3|4b|4c|6","😢","crying face","o|3|4e|4f|6","😭","loudly crying face","o|3|4h|4i|6","😱","face screaming in fear","o|3|4k|4l|6","😖","confounded face","o|3|4n|4o|6","😣","persevering face","o|3|4q|4r|6","😞","disappointed face","o|3|4t|4u|6","😓","downcast face with sweat","o|3|4w|4x|6","😩","weary face","o|3|4z|50|6","😫","tired face","o|3|52|53|6","🥱","yawning face","o|3|55|56|6","😤","face with steam from nose","o|3|58|59|6","😡","enraged face","o|3|5B|5C|6","😠","angry face","o|3|5E|5F|6","🤬","face with symbols on mouth","o|3|5H|5I|6","😈","smiling face with horns","o|3|5K|5L|6","👿","angry face with horns","o|3|5N|5O|6","💀","skull","o|3|5Q|5R|6","☠️","skull and crossbones","o|3|5T|5U|6","☠","o|3|5W|5U|6","💩","pile of poo","o|3|5Y|5Z|6","🤡","clown face","o|3|5b|5c|6","👹","ogre","o|3|5e|5f|6","👺","goblin","o|3|5h|5i|6","👻","ghost","o|3|5k|5l|6","👽","alien","o|3|5n|5o|6","👾","alien monster","o|3|5q|5r|6","🤖","robot","o|3|5t|5u|6","😺","grinning cat","o|3|5w|5x|6","😸","grinning cat with smiling eyes","o|3|5z|60|6","😹","cat with tears of joy","o|3|62|63|6","😻","smiling cat with heart-eyes","o|3|65|66|6","😼","cat with wry smile","o|3|68|69|6","😽","kissing cat","o|3|6B|6C|6","🙀","weary cat","o|3|6E|6F|6","😿","crying cat","o|3|6H|6I|6","😾","pouting cat","o|3|6K|6L|6","🙈","see-no-evil monkey","o|3|6N|6O|6","🙉","hear-no-evil monkey","o|3|6Q|6R|6","🙊","speak-no-evil monkey","o|3|6T|6U|6","💌","love letter","o|3|6W|6X|6","💘","heart with arrow","o|3|6Z|6a|6","💝","heart with ribbon","o|3|6c|6d|6","💖","sparkling heart","o|3|6f|6g|6","💗","growing heart","o|3|6i|6j|6","💓","beating heart","o|3|6l|6m|6","💞","revolving hearts","o|3|6o|6p|6","💕","two hearts","o|3|6r|6s|6","💟","heart decoration","o|3|6u|6v|6","❣️","heart exclamation","o|3|6x|6y|6","❣","o|3|70|6y|6","💔","broken heart","o|3|72|73|6","❤️‍🔥","heart on fire","o|3|75|76|6","❤‍🔥","o|3|78|76|6","❤️‍🩹","mending heart","o|3|7A|7B|6","❤‍🩹","o|3|7D|7B|6","❤️","red heart","o|3|7F|7G|6","❤","o|3|7I|7G|6","🩷","pink heart","o|3|7K|7L|6","🧡","orange heart","o|3|7N|7O|6","💛","yellow heart","o|3|7Q|7R|6","💚","green heart","o|3|7T|7U|6","💙","blue heart","o|3|7W|7X|6","🩵","light blue heart","o|3|7Z|7a|6","💜","purple heart","o|3|7c|7d|6","🤎","brown heart","o|3|7f|7g|6","🖤","black heart","o|3|7i|7j|6","🩶","grey heart","o|3|7l|7m|6","🤍","white heart","o|3|7o|7p|6","💋","kiss mark","o|3|7r|7s|6","💯","hundred points","o|3|7u|7v|6","💢","anger symbol","o|3|7x|7y|6","💥","collision","o|3|80|81|6","💫","dizzy","o|3|83|84|6","💦","sweat droplets","o|3|86|87|6","💨","dashing away","o|3|89|8A|6","🕳️","hole","o|3|8C|8D|6","🕳","o|3|8F|8D|6","💬","speech balloon","o|3|8H|8I|6","👁️‍🗨️","eye in speech bubble","o|3|8K|8L|6","👁‍🗨️","o|3|8N|8L|6","👁️‍🗨","o|3|8P|8L|6","👁‍🗨","o|3|8R|8L|6","🗨️","left speech bubble","o|3|8T|8U|6","🗨","o|3|8W|8U|6","🗯️","right anger bubble","o|3|8Y|8Z|6","🗯","o|3|8b|8Z|6","💭","thought balloon","o|3|8d|8e|6","💤","ZZZ","o|3|8g|8h|6","👋","waving hand","People & Body","o|3|8j|8k|8l","👋🏻","waving hand: light skin tone","o|3|8n|8o|8l","👋🏼","waving hand: medium-light skin tone","o|3|8q|8r|8l","👋🏽","waving hand: medium skin tone","o|3|8t|8u|8l","👋🏾","waving hand: medium-dark skin tone","o|3|8w|8x|8l","👋🏿","waving hand: dark skin tone","o|3|8z|90|8l","🤚","raised back of hand","o|3|92|93|8l","🤚🏻","raised back of hand: light skin tone","o|3|95|96|8l","🤚🏼","raised back of hand: medium-light skin tone","o|3|98|99|8l","🤚🏽","raised back of hand: medium skin tone","o|3|9B|9C|8l","🤚🏾","raised back of hand: medium-dark skin tone","o|3|9E|9F|8l","🤚🏿","raised back of hand: dark skin tone","o|3|9H|9I|8l","🖐️","hand with fingers splayed","o|3|9K|9L|8l","🖐","o|3|9N|9L|8l","🖐🏻","hand with fingers splayed: light skin tone","o|3|9P|9Q|8l","🖐🏼","hand with fingers splayed: medium-light skin tone","o|3|9S|9T|8l","🖐🏽","hand with fingers splayed: medium skin tone","o|3|9V|9W|8l","🖐🏾","hand with fingers splayed: medium-dark skin tone","o|3|9Y|9Z|8l","🖐🏿","hand with fingers splayed: dark skin tone","o|3|9b|9c|8l","✋","raised hand","o|3|9e|9f|8l","✋🏻","raised hand: light skin tone","o|3|9h|9i|8l","✋🏼","raised hand: medium-light skin tone","o|3|9k|9l|8l","✋🏽","raised hand: medium skin tone","o|3|9n|9o|8l","✋🏾","raised hand: medium-dark skin tone","o|3|9q|9r|8l","✋🏿","raised hand: dark skin tone","o|3|9t|9u|8l","🖖","vulcan salute","o|3|9w|9x|8l","🖖🏻","vulcan salute: light skin tone","o|3|9z|A0|8l","🖖🏼","vulcan salute: medium-light skin tone","o|3|A2|A3|8l","🖖🏽","vulcan salute: medium skin tone","o|3|A5|A6|8l","🖖🏾","vulcan salute: medium-dark skin tone","o|3|A8|A9|8l","🖖🏿","vulcan salute: dark skin tone","o|3|AB|AC|8l","🫱","rightwards hand","o|3|AE|AF|8l","🫱🏻","rightwards hand: light skin tone","o|3|AH|AI|8l","🫱🏼","rightwards hand: medium-light skin tone","o|3|AK|AL|8l","🫱🏽","rightwards hand: medium skin tone","o|3|AN|AO|8l","🫱🏾","rightwards hand: medium-dark skin tone","o|3|AQ|AR|8l","🫱🏿","rightwards hand: dark skin tone","o|3|AT|AU|8l","🫲","leftwards hand","o|3|AW|AX|8l","🫲🏻","leftwards hand: light skin tone","o|3|AZ|Aa|8l","🫲🏼","leftwards hand: medium-light skin tone","o|3|Ac|Ad|8l","🫲🏽","leftwards hand: medium skin tone","o|3|Af|Ag|8l","🫲🏾","leftwards hand: medium-dark skin tone","o|3|Ai|Aj|8l","🫲🏿","leftwards hand: dark skin tone","o|3|Al|Am|8l","🫳","palm down hand","o|3|Ao|Ap|8l","🫳🏻","palm down hand: light skin tone","o|3|Ar|As|8l","🫳🏼","palm down hand: medium-light skin tone","o|3|Au|Av|8l","🫳🏽","palm down hand: medium skin tone","o|3|Ax|Ay|8l","🫳🏾","palm down hand: medium-dark skin tone","o|3|B0|B1|8l","🫳🏿","palm down hand: dark skin tone","o|3|B3|B4|8l","🫴","palm up hand","o|3|B6|B7|8l","🫴🏻","palm up hand: light skin tone","o|3|B9|BA|8l","🫴🏼","palm up hand: medium-light skin tone","o|3|BC|BD|8l","🫴🏽","palm up hand: medium skin tone","o|3|BF|BG|8l","🫴🏾","palm up hand: medium-dark skin tone","o|3|BI|BJ|8l","🫴🏿","palm up hand: dark skin tone","o|3|BL|BM|8l","🫷","leftwards pushing hand","o|3|BO|BP|8l","🫷🏻","leftwards pushing hand: light skin tone","o|3|BR|BS|8l","🫷🏼","leftwards pushing hand: medium-light skin tone","o|3|BU|BV|8l","🫷🏽","leftwards pushing hand: medium skin tone","o|3|BX|BY|8l","🫷🏾","leftwards pushing hand: medium-dark skin tone","o|3|Ba|Bb|8l","🫷🏿","leftwards pushing hand: dark skin tone","o|3|Bd|Be|8l","🫸","rightwards pushing hand","o|3|Bg|Bh|8l","🫸🏻","rightwards pushing hand: light skin tone","o|3|Bj|Bk|8l","🫸🏼","rightwards pushing hand: medium-light skin tone","o|3|Bm|Bn|8l","🫸🏽","rightwards pushing hand: medium skin tone","o|3|Bp|Bq|8l","🫸🏾","rightwards pushing hand: medium-dark skin tone","o|3|Bs|Bt|8l","🫸🏿","rightwards pushing hand: dark skin tone","o|3|Bv|Bw|8l","👌","OK hand","o|3|By|Bz|8l","👌🏻","OK hand: light skin tone","o|3|C1|C2|8l","👌🏼","OK hand: medium-light skin tone","o|3|C4|C5|8l","👌🏽","OK hand: medium skin tone","o|3|C7|C8|8l","👌🏾","OK hand: medium-dark skin tone","o|3|CA|CB|8l","👌🏿","OK hand: dark skin tone","o|3|CD|CE|8l","🤌","pinched fingers","o|3|CG|CH|8l","🤌🏻","pinched fingers: light skin tone","o|3|CJ|CK|8l","🤌🏼","pinched fingers: medium-light skin tone","o|3|CM|CN|8l","🤌🏽","pinched fingers: medium skin tone","o|3|CP|CQ|8l","🤌🏾","pinched fingers: medium-dark skin tone","o|3|CS|CT|8l","🤌🏿","pinched fingers: dark skin tone","o|3|CV|CW|8l","🤏","pinching hand","o|3|CY|CZ|8l","🤏🏻","pinching hand: light skin tone","o|3|Cb|Cc|8l","🤏🏼","pinching hand: medium-light skin tone","o|3|Ce|Cf|8l","🤏🏽","pinching hand: medium skin tone","o|3|Ch|Ci|8l","🤏🏾","pinching hand: medium-dark skin tone","o|3|Ck|Cl|8l","🤏🏿","pinching hand: dark skin tone","o|3|Cn|Co|8l","✌️","victory hand","o|3|Cq|Cr|8l","✌","o|3|Ct|Cr|8l","✌🏻","victory hand: light skin tone","o|3|Cv|Cw|8l","✌🏼","victory hand: medium-light skin tone","o|3|Cy|Cz|8l","✌🏽","victory hand: medium skin tone","o|3|D1|D2|8l","✌🏾","victory hand: medium-dark skin tone","o|3|D4|D5|8l","✌🏿","victory hand: dark skin tone","o|3|D7|D8|8l","🤞","crossed fingers","o|3|DA|DB|8l","🤞🏻","crossed fingers: light skin tone","o|3|DD|DE|8l","🤞🏼","crossed fingers: medium-light skin tone","o|3|DG|DH|8l","🤞🏽","crossed fingers: medium skin tone","o|3|DJ|DK|8l","🤞🏾","crossed fingers: medium-dark skin tone","o|3|DM|DN|8l","🤞🏿","crossed fingers: dark skin tone","o|3|DP|DQ|8l","🫰","hand with index finger and thumb crossed","o|3|DS|DT|8l","🫰🏻","hand with index finger and thumb crossed: light skin tone","o|3|DV|DW|8l","🫰🏼","hand with index finger and thumb crossed: medium-light skin tone","o|3|DY|DZ|8l","🫰🏽","hand with index finger and thumb crossed: medium skin tone","o|3|Db|Dc|8l","🫰🏾","hand with index finger and thumb crossed: medium-dark skin tone","o|3|De|Df|8l","🫰🏿","hand with index finger and thumb crossed: dark skin tone","o|3|Dh|Di|8l","🤟","love-you gesture","o|3|Dk|Dl|8l","🤟🏻","love-you gesture: light skin tone","o|3|Dn|Do|8l","🤟🏼","love-you gesture: medium-light skin tone","o|3|Dq|Dr|8l","🤟🏽","love-you gesture: medium skin tone","o|3|Dt|Du|8l","🤟🏾","love-you gesture: medium-dark skin tone","o|3|Dw|Dx|8l","🤟🏿","love-you gesture: dark skin tone","o|3|Dz|E0|8l","🤘","sign of the horns","o|3|E2|E3|8l","🤘🏻","sign of the horns: light skin tone","o|3|E5|E6|8l","🤘🏼","sign of the horns: medium-light skin tone","o|3|E8|E9|8l","🤘🏽","sign of the horns: medium skin tone","o|3|EB|EC|8l","🤘🏾","sign of the horns: medium-dark skin tone","o|3|EE|EF|8l","🤘🏿","sign of the horns: dark skin tone","o|3|EH|EI|8l","🤙","call me hand","o|3|EK|EL|8l","🤙🏻","call me hand: light skin tone","o|3|EN|EO|8l","🤙🏼","call me hand: medium-light skin tone","o|3|EQ|ER|8l","🤙🏽","call me hand: medium skin tone","o|3|ET|EU|8l","🤙🏾","call me hand: medium-dark skin tone","o|3|EW|EX|8l","🤙🏿","call me hand: dark skin tone","o|3|EZ|Ea|8l","👈","backhand index pointing left","o|3|Ec|Ed|8l","👈🏻","backhand index pointing left: light skin tone","o|3|Ef|Eg|8l","👈🏼","backhand index pointing left: medium-light skin tone","o|3|Ei|Ej|8l","👈🏽","backhand index pointing left: medium skin tone","o|3|El|Em|8l","👈🏾","backhand index pointing left: medium-dark skin tone","o|3|Eo|Ep|8l","👈🏿","backhand index pointing left: dark skin tone","o|3|Er|Es|8l","👉","backhand index pointing right","o|3|Eu|Ev|8l","👉🏻","backhand index pointing right: light skin tone","o|3|Ex|Ey|8l","👉🏼","backhand index pointing right: medium-light skin tone","o|3|F0|F1|8l","👉🏽","backhand index pointing right: medium skin tone","o|3|F3|F4|8l","👉🏾","backhand index pointing right: medium-dark skin tone","o|3|F6|F7|8l","👉🏿","backhand index pointing right: dark skin tone","o|3|F9|FA|8l","👆","backhand index pointing up","o|3|FC|FD|8l","👆🏻","backhand index pointing up: light skin tone","o|3|FF|FG|8l","👆🏼","backhand index pointing up: medium-light skin tone","o|3|FI|FJ|8l","👆🏽","backhand index pointing up: medium skin tone","o|3|FL|FM|8l","👆🏾","backhand index pointing up: medium-dark skin tone","o|3|FO|FP|8l","👆🏿","backhand index pointing up: dark skin tone","o|3|FR|FS|8l","🖕","middle finger","o|3|FU|FV|8l","🖕🏻","middle finger: light skin tone","o|3|FX|FY|8l","🖕🏼","middle finger: medium-light skin tone","o|3|Fa|Fb|8l","🖕🏽","middle finger: medium skin tone","o|3|Fd|Fe|8l","🖕🏾","middle finger: medium-dark skin tone","o|3|Fg|Fh|8l","🖕🏿","middle finger: dark skin tone","o|3|Fj|Fk|8l","👇","backhand index pointing down","o|3|Fm|Fn|8l","👇🏻","backhand index pointing down: light skin tone","o|3|Fp|Fq|8l","👇🏼","backhand index pointing down: medium-light skin tone","o|3|Fs|Ft|8l","👇🏽","backhand index pointing down: medium skin tone","o|3|Fv|Fw|8l","👇🏾","backhand index pointing down: medium-dark skin tone","o|3|Fy|Fz|8l","👇🏿","backhand index pointing down: dark skin tone","o|3|G1|G2|8l","☝️","index pointing up","o|3|G4|G5|8l","☝","o|3|G7|G5|8l","☝🏻","index pointing up: light skin tone","o|3|G9|GA|8l","☝🏼","index pointing up: medium-light skin tone","o|3|GC|GD|8l","☝🏽","index pointing up: medium skin tone","o|3|GF|GG|8l","☝🏾","index pointing up: medium-dark skin tone","o|3|GI|GJ|8l","☝🏿","index pointing up: dark skin tone","o|3|GL|GM|8l","🫵","index pointing at the viewer","o|3|GO|GP|8l","🫵🏻","index pointing at the viewer: light skin tone","o|3|GR|GS|8l","🫵🏼","index pointing at the viewer: medium-light skin tone","o|3|GU|GV|8l","🫵🏽","index pointing at the viewer: medium skin tone","o|3|GX|GY|8l","🫵🏾","index pointing at the viewer: medium-dark skin tone","o|3|Ga|Gb|8l","🫵🏿","index pointing at the viewer: dark skin tone","o|3|Gd|Ge|8l","👍","thumbs up","o|3|Gg|Gh|8l","👍🏻","thumbs up: light skin tone","o|3|Gj|Gk|8l","👍🏼","thumbs up: medium-light skin tone","o|3|Gm|Gn|8l","👍🏽","thumbs up: medium skin tone","o|3|Gp|Gq|8l","👍🏾","thumbs up: medium-dark skin tone","o|3|Gs|Gt|8l","👍🏿","thumbs up: dark skin tone","o|3|Gv|Gw|8l","👎","thumbs down","o|3|Gy|Gz|8l","👎🏻","thumbs down: light skin tone","o|3|H1|H2|8l","👎🏼","thumbs down: medium-light skin tone","o|3|H4|H5|8l","👎🏽","thumbs down: medium skin tone","o|3|H7|H8|8l","👎🏾","thumbs down: medium-dark skin tone","o|3|HA|HB|8l","👎🏿","thumbs down: dark skin tone","o|3|HD|HE|8l","✊","raised fist","o|3|HG|HH|8l","✊🏻","raised fist: light skin tone","o|3|HJ|HK|8l","✊🏼","raised fist: medium-light skin tone","o|3|HM|HN|8l","✊🏽","raised fist: medium skin tone","o|3|HP|HQ|8l","✊🏾","raised fist: medium-dark skin tone","o|3|HS|HT|8l","✊🏿","raised fist: dark skin tone","o|3|HV|HW|8l","👊","oncoming fist","o|3|HY|HZ|8l","👊🏻","oncoming fist: light skin tone","o|3|Hb|Hc|8l","👊🏼","oncoming fist: medium-light skin tone","o|3|He|Hf|8l","👊🏽","oncoming fist: medium skin tone","o|3|Hh|Hi|8l","👊🏾","oncoming fist: medium-dark skin tone","o|3|Hk|Hl|8l","👊🏿","oncoming fist: dark skin tone","o|3|Hn|Ho|8l","🤛","left-facing fist","o|3|Hq|Hr|8l","🤛🏻","left-facing fist: light skin tone","o|3|Ht|Hu|8l","🤛🏼","left-facing fist: medium-light skin tone","o|3|Hw|Hx|8l","🤛🏽","left-facing fist: medium skin tone","o|3|Hz|I0|8l","🤛🏾","left-facing fist: medium-dark skin tone","o|3|I2|I3|8l","🤛🏿","left-facing fist: dark skin tone","o|3|I5|I6|8l","🤜","right-facing fist","o|3|I8|I9|8l","🤜🏻","right-facing fist: light skin tone","o|3|IB|IC|8l","🤜🏼","right-facing fist: medium-light skin tone","o|3|IE|IF|8l","🤜🏽","right-facing fist: medium skin tone","o|3|IH|II|8l","🤜🏾","right-facing fist: medium-dark skin tone","o|3|IK|IL|8l","🤜🏿","right-facing fist: dark skin tone","o|3|IN|IO|8l","👏","clapping hands","o|3|IQ|IR|8l","👏🏻","clapping hands: light skin tone","o|3|IT|IU|8l","👏🏼","clapping hands: medium-light skin tone","o|3|IW|IX|8l","👏🏽","clapping hands: medium skin tone","o|3|IZ|Ia|8l","👏🏾","clapping hands: medium-dark skin tone","o|3|Ic|Id|8l","👏🏿","clapping hands: dark skin tone","o|3|If|Ig|8l","🙌","raising hands","o|3|Ii|Ij|8l","🙌🏻","raising hands: light skin tone","o|3|Il|Im|8l","🙌🏼","raising hands: medium-light skin tone","o|3|Io|Ip|8l","🙌🏽","raising hands: medium skin tone","o|3|Ir|Is|8l","🙌🏾","raising hands: medium-dark skin tone","o|3|Iu|Iv|8l","🙌🏿","raising hands: dark skin tone","o|3|Ix|Iy|8l","🫶","heart hands","o|3|J0|J1|8l","🫶🏻","heart hands: light skin tone","o|3|J3|J4|8l","🫶🏼","heart hands: medium-light skin tone","o|3|J6|J7|8l","🫶🏽","heart hands: medium skin tone","o|3|J9|JA|8l","🫶🏾","heart hands: medium-dark skin tone","o|3|JC|JD|8l","🫶🏿","heart hands: dark skin tone","o|3|JF|JG|8l","👐","open hands","o|3|JI|JJ|8l","👐🏻","open hands: light skin tone","o|3|JL|JM|8l","👐🏼","open hands: medium-light skin tone","o|3|JO|JP|8l","👐🏽","open hands: medium skin tone","o|3|JR|JS|8l","👐🏾","open hands: medium-dark skin tone","o|3|JU|JV|8l","👐🏿","open hands: dark skin tone","o|3|JX|JY|8l","🤲","palms up together","o|3|Ja|Jb|8l","🤲🏻","palms up together: light skin tone","o|3|Jd|Je|8l","🤲🏼","palms up together: medium-light skin tone","o|3|Jg|Jh|8l","🤲🏽","palms up together: medium skin tone","o|3|Jj|Jk|8l","🤲🏾","palms up together: medium-dark skin tone","o|3|Jm|Jn|8l","🤲🏿","palms up together: dark skin tone","o|3|Jp|Jq|8l","🤝","handshake","o|3|Js|Jt|8l","🤝🏻","handshake: light skin tone","o|3|Jv|Jw|8l","🤝🏼","handshake: medium-light skin tone","o|3|Jy|Jz|8l","🤝🏽","handshake: medium skin tone","o|3|K1|K2|8l","🤝🏾","handshake: medium-dark skin tone","o|3|K4|K5|8l","🤝🏿","handshake: dark skin tone","o|3|K7|K8|8l","🫱🏻‍🫲🏼","handshake: light skin tone, medium-light skin tone","o|3|KA|KB|8l","🫱🏻‍🫲🏽","handshake: light skin tone, medium skin tone","o|3|KD|KE|8l","🫱🏻‍🫲🏾","handshake: light skin tone, medium-dark skin tone","o|3|KG|KH|8l","🫱🏻‍🫲🏿","handshake: light skin tone, dark skin tone","o|3|KJ|KK|8l","🫱🏼‍🫲🏻","handshake: medium-light skin tone, light skin tone","o|3|KM|KN|8l","🫱🏼‍🫲🏽","handshake: medium-light skin tone, medium skin tone","o|3|KP|KQ|8l","🫱🏼‍🫲🏾","handshake: medium-light skin tone, medium-dark skin tone","o|3|KS|KT|8l","🫱🏼‍🫲🏿","handshake: medium-light skin tone, dark skin tone","o|3|KV|KW|8l","🫱🏽‍🫲🏻","handshake: medium skin tone, light skin tone","o|3|KY|KZ|8l","🫱🏽‍🫲🏼","handshake: medium skin tone, medium-light skin tone","o|3|Kb|Kc|8l","🫱🏽‍🫲🏾","handshake: medium skin tone, medium-dark skin tone","o|3|Ke|Kf|8l","🫱🏽‍🫲🏿","handshake: medium skin tone, dark skin tone","o|3|Kh|Ki|8l","🫱🏾‍🫲🏻","handshake: medium-dark skin tone, light skin tone","o|3|Kk|Kl|8l","🫱🏾‍🫲🏼","handshake: medium-dark skin tone, medium-light skin tone","o|3|Kn|Ko|8l","🫱🏾‍🫲🏽","handshake: medium-dark skin tone, medium skin tone","o|3|Kq|Kr|8l","🫱🏾‍🫲🏿","handshake: medium-dark skin tone, dark skin tone","o|3|Kt|Ku|8l","🫱🏿‍🫲🏻","handshake: dark skin tone, light skin tone","o|3|Kw|Kx|8l","🫱🏿‍🫲🏼","handshake: dark skin tone, medium-light skin tone","o|3|Kz|L0|8l","🫱🏿‍🫲🏽","handshake: dark skin tone, medium skin tone","o|3|L2|L3|8l","🫱🏿‍🫲🏾","handshake: dark skin tone, medium-dark skin tone","o|3|L5|L6|8l","🙏","folded hands","o|3|L8|L9|8l","🙏🏻","folded hands: light skin tone","o|3|LB|LC|8l","🙏🏼","folded hands: medium-light skin tone","o|3|LE|LF|8l","🙏🏽","folded hands: medium skin tone","o|3|LH|LI|8l","🙏🏾","folded hands: medium-dark skin tone","o|3|LK|LL|8l","🙏🏿","folded hands: dark skin tone","o|3|LN|LO|8l","✍️","writing hand","o|3|LQ|LR|8l","✍","o|3|LT|LR|8l","✍🏻","writing hand: light skin tone","o|3|LV|LW|8l","✍🏼","writing hand: medium-light skin tone","o|3|LY|LZ|8l","✍🏽","writing hand: medium skin tone","o|3|Lb|Lc|8l","✍🏾","writing hand: medium-dark skin tone","o|3|Le|Lf|8l","✍🏿","writing hand: dark skin tone","o|3|Lh|Li|8l","💅","nail polish","o|3|Lk|Ll|8l","💅🏻","nail polish: light skin tone","o|3|Ln|Lo|8l","💅🏼","nail polish: medium-light skin tone","o|3|Lq|Lr|8l","💅🏽","nail polish: medium skin tone","o|3|Lt|Lu|8l","💅🏾","nail polish: medium-dark skin tone","o|3|Lw|Lx|8l","💅🏿","nail polish: dark skin tone","o|3|Lz|M0|8l","🤳","selfie","o|3|M2|M3|8l","🤳🏻","selfie: light skin tone","o|3|M5|M6|8l","🤳🏼","selfie: medium-light skin tone","o|3|M8|M9|8l","🤳🏽","selfie: medium skin tone","o|3|MB|MC|8l","🤳🏾","selfie: medium-dark skin tone","o|3|ME|MF|8l","🤳🏿","selfie: dark skin tone","o|3|MH|MI|8l","💪","flexed biceps","o|3|MK|ML|8l","💪🏻","flexed biceps: light skin tone","o|3|MN|MO|8l","💪🏼","flexed biceps: medium-light skin tone","o|3|MQ|MR|8l","💪🏽","flexed biceps: medium skin tone","o|3|MT|MU|8l","💪🏾","flexed biceps: medium-dark skin tone","o|3|MW|MX|8l","💪🏿","flexed biceps: dark skin tone","o|3|MZ|Ma|8l","🦾","mechanical arm","o|3|Mc|Md|8l","🦿","mechanical leg","o|3|Mf|Mg|8l","🦵","leg","o|3|Mi|Mj|8l","🦵🏻","leg: light skin tone","o|3|Ml|Mm|8l","🦵🏼","leg: medium-light skin tone","o|3|Mo|Mp|8l","🦵🏽","leg: medium skin tone","o|3|Mr|Ms|8l","🦵🏾","leg: medium-dark skin tone","o|3|Mu|Mv|8l","🦵🏿","leg: dark skin tone","o|3|Mx|My|8l","🦶","foot","o|3|N0|N1|8l","🦶🏻","foot: light skin tone","o|3|N3|N4|8l","🦶🏼","foot: medium-light skin tone","o|3|N6|N7|8l","🦶🏽","foot: medium skin tone","o|3|N9|NA|8l","🦶🏾","foot: medium-dark skin tone","o|3|NC|ND|8l","🦶🏿","foot: dark skin tone","o|3|NF|NG|8l","👂","ear","o|3|NI|NJ|8l","👂🏻","ear: light skin tone","o|3|NL|NM|8l","👂🏼","ear: medium-light skin tone","o|3|NO|NP|8l","👂🏽","ear: medium skin tone","o|3|NR|NS|8l","👂🏾","ear: medium-dark skin tone","o|3|NU|NV|8l","👂🏿","ear: dark skin tone","o|3|NX|NY|8l","🦻","ear with hearing aid","o|3|Na|Nb|8l","🦻🏻","ear with hearing aid: light skin tone","o|3|Nd|Ne|8l","🦻🏼","ear with hearing aid: medium-light skin tone","o|3|Ng|Nh|8l","🦻🏽","ear with hearing aid: medium skin tone","o|3|Nj|Nk|8l","🦻🏾","ear with hearing aid: medium-dark skin tone","o|3|Nm|Nn|8l","🦻🏿","ear with hearing aid: dark skin tone","o|3|Np|Nq|8l","👃","nose","o|3|Ns|Nt|8l","👃🏻","nose: light skin tone","o|3|Nv|Nw|8l","👃🏼","nose: medium-light skin tone","o|3|Ny|Nz|8l","👃🏽","nose: medium skin tone","o|3|O1|O2|8l","👃🏾","nose: medium-dark skin tone","o|3|O4|O5|8l","👃🏿","nose: dark skin tone","o|3|O7|O8|8l","🧠","brain","o|3|OA|OB|8l","🫀","anatomical heart","o|3|OD|OE|8l","🫁","lungs","o|3|OG|OH|8l","🦷","tooth","o|3|OJ|OK|8l","🦴","bone","o|3|OM|ON|8l","👀","eyes","o|3|OP|OQ|8l","👁️","eye","o|3|OS|OT|8l","👁","o|3|OV|OT|8l","👅","tongue","o|3|OX|OY|8l","👄","mouth","o|3|Oa|Ob|8l","🫦","biting lip","o|3|Od|Oe|8l","👶","baby","o|3|Og|Oh|8l","👶🏻","baby: light skin tone","o|3|Oj|Ok|8l","👶🏼","baby: medium-light skin tone","o|3|Om|On|8l","👶🏽","baby: medium skin tone","o|3|Op|Oq|8l","👶🏾","baby: medium-dark skin tone","o|3|Os|Ot|8l","👶🏿","baby: dark skin tone","o|3|Ov|Ow|8l","🧒","child","o|3|Oy|Oz|8l","🧒🏻","child: light skin tone","o|3|P1|P2|8l","🧒🏼","child: medium-light skin tone","o|3|P4|P5|8l","🧒🏽","child: medium skin tone","o|3|P7|P8|8l","🧒🏾","child: medium-dark skin tone","o|3|PA|PB|8l","🧒🏿","child: dark skin tone","o|3|PD|PE|8l","👦","boy","o|3|PG|PH|8l","👦🏻","boy: light skin tone","o|3|PJ|PK|8l","👦🏼","boy: medium-light skin tone","o|3|PM|PN|8l","👦🏽","boy: medium skin tone","o|3|PP|PQ|8l","👦🏾","boy: medium-dark skin tone","o|3|PS|PT|8l","👦🏿","boy: dark skin tone","o|3|PV|PW|8l","👧","girl","o|3|PY|PZ|8l","👧🏻","girl: light skin tone","o|3|Pb|Pc|8l","👧🏼","girl: medium-light skin tone","o|3|Pe|Pf|8l","👧🏽","girl: medium skin tone","o|3|Ph|Pi|8l","👧🏾","girl: medium-dark skin tone","o|3|Pk|Pl|8l","👧🏿","girl: dark skin tone","o|3|Pn|Po|8l","🧑","person","o|3|Pq|Pr|8l","🧑🏻","person: light skin tone","o|3|Pt|Pu|8l","🧑🏼","person: medium-light skin tone","o|3|Pw|Px|8l","🧑🏽","person: medium skin tone","o|3|Pz|Q0|8l","🧑🏾","person: medium-dark skin tone","o|3|Q2|Q3|8l","🧑🏿","person: dark skin tone","o|3|Q5|Q6|8l","👱","person: blond hair","o|3|Q8|Q9|8l","👱🏻","person: light skin tone, blond hair","o|3|QB|QC|8l","👱🏼","person: medium-light skin tone, blond hair","o|3|QE|QF|8l","👱🏽","person: medium skin tone, blond hair","o|3|QH|QI|8l","👱🏾","person: medium-dark skin tone, blond hair","o|3|QK|QL|8l","👱🏿","person: dark skin tone, blond hair","o|3|QN|QO|8l","👨","man","o|3|QQ|QR|8l","👨🏻","man: light skin tone","o|3|QT|QU|8l","👨🏼","man: medium-light skin tone","o|3|QW|QX|8l","👨🏽","man: medium skin tone","o|3|QZ|Qa|8l","👨🏾","man: medium-dark skin tone","o|3|Qc|Qd|8l","👨🏿","man: dark skin tone","o|3|Qf|Qg|8l","🧔","person: beard","o|3|Qi|Qj|8l","🧔🏻","person: light skin tone, beard","o|3|Ql|Qm|8l","🧔🏼","person: medium-light skin tone, beard","o|3|Qo|Qp|8l","🧔🏽","person: medium skin tone, beard","o|3|Qr|Qs|8l","🧔🏾","person: medium-dark skin tone, beard","o|3|Qu|Qv|8l","🧔🏿","person: dark skin tone, beard","o|3|Qx|Qy|8l","🧔‍♂️","man: beard","o|3|R0|R1|8l","🧔‍♂","o|3|R3|R1|8l","🧔🏻‍♂️","man: light skin tone, beard","o|3|R5|R6|8l","🧔🏻‍♂","o|3|R8|R6|8l","🧔🏼‍♂️","man: medium-light skin tone, beard","o|3|RA|RB|8l","🧔🏼‍♂","o|3|RD|RB|8l","🧔🏽‍♂️","man: medium skin tone, beard","o|3|RF|RG|8l","🧔🏽‍♂","o|3|RI|RG|8l","🧔🏾‍♂️","man: medium-dark skin tone, beard","o|3|RK|RL|8l","🧔🏾‍♂","o|3|RN|RL|8l","🧔🏿‍♂️","man: dark skin tone, beard","o|3|RP|RQ|8l","🧔🏿‍♂","o|3|RS|RQ|8l","🧔‍♀️","woman: beard","o|3|RU|RV|8l","🧔‍♀","o|3|RX|RV|8l","🧔🏻‍♀️","woman: light skin tone, beard","o|3|RZ|Ra|8l","🧔🏻‍♀","o|3|Rc|Ra|8l","🧔🏼‍♀️","woman: medium-light skin tone, beard","o|3|Re|Rf|8l","🧔🏼‍♀","o|3|Rh|Rf|8l","🧔🏽‍♀️","woman: medium skin tone, beard","o|3|Rj|Rk|8l","🧔🏽‍♀","o|3|Rm|Rk|8l","🧔🏾‍♀️","woman: medium-dark skin tone, beard","o|3|Ro|Rp|8l","🧔🏾‍♀","o|3|Rr|Rp|8l","🧔🏿‍♀️","woman: dark skin tone, beard","o|3|Rt|Ru|8l","🧔🏿‍♀","o|3|Rw|Ru|8l","👨‍🦰","man: red hair","o|3|Ry|Rz|8l","👨🏻‍🦰","man: light skin tone, red hair","o|3|S1|S2|8l","👨🏼‍🦰","man: medium-light skin tone, red hair","o|3|S4|S5|8l","👨🏽‍🦰","man: medium skin tone, red hair","o|3|S7|S8|8l","👨🏾‍🦰","man: medium-dark skin tone, red hair","o|3|SA|SB|8l","👨🏿‍🦰","man: dark skin tone, red hair","o|3|SD|SE|8l","👨‍🦱","man: curly hair","o|3|SG|SH|8l","👨🏻‍🦱","man: light skin tone, curly hair","o|3|SJ|SK|8l","👨🏼‍🦱","man: medium-light skin tone, curly hair","o|3|SM|SN|8l","👨🏽‍🦱","man: medium skin tone, curly hair","o|3|SP|SQ|8l","👨🏾‍🦱","man: medium-dark skin tone, curly hair","o|3|SS|ST|8l","👨🏿‍🦱","man: dark skin tone, curly hair","o|3|SV|SW|8l","👨‍🦳","man: white hair","o|3|SY|SZ|8l","👨🏻‍🦳","man: light skin tone, white hair","o|3|Sb|Sc|8l","👨🏼‍🦳","man: medium-light skin tone, white hair","o|3|Se|Sf|8l","👨🏽‍🦳","man: medium skin tone, white hair","o|3|Sh|Si|8l","👨🏾‍🦳","man: medium-dark skin tone, white hair","o|3|Sk|Sl|8l","👨🏿‍🦳","man: dark skin tone, white hair","o|3|Sn|So|8l","👨‍🦲","man: bald","o|3|Sq|Sr|8l","👨🏻‍🦲","man: light skin tone, bald","o|3|St|Su|8l","👨🏼‍🦲","man: medium-light skin tone, bald","o|3|Sw|Sx|8l","👨🏽‍🦲","man: medium skin tone, bald","o|3|Sz|T0|8l","👨🏾‍🦲","man: medium-dark skin tone, bald","o|3|T2|T3|8l","👨🏿‍🦲","man: dark skin tone, bald","o|3|T5|T6|8l","👩","woman","o|3|T8|T9|8l","👩🏻","woman: light skin tone","o|3|TB|TC|8l","👩🏼","woman: medium-light skin tone","o|3|TE|TF|8l","👩🏽","woman: medium skin tone","o|3|TH|TI|8l","👩🏾","woman: medium-dark skin tone","o|3|TK|TL|8l","👩🏿","woman: dark skin tone","o|3|TN|TO|8l","👩‍🦰","woman: red hair","o|3|TQ|TR|8l","👩🏻‍🦰","woman: light skin tone, red hair","o|3|TT|TU|8l","👩🏼‍🦰","woman: medium-light skin tone, red hair","o|3|TW|TX|8l","👩🏽‍🦰","woman: medium skin tone, red hair","o|3|TZ|Ta|8l","👩🏾‍🦰","woman: medium-dark skin tone, red hair","o|3|Tc|Td|8l","👩🏿‍🦰","woman: dark skin tone, red hair","o|3|Tf|Tg|8l","🧑‍🦰","person: red hair","o|3|Ti|Tj|8l","🧑🏻‍🦰","person: light skin tone, red hair","o|3|Tl|Tm|8l","🧑🏼‍🦰","person: medium-light skin tone, red hair","o|3|To|Tp|8l","🧑🏽‍🦰","person: medium skin tone, red hair","o|3|Tr|Ts|8l","🧑🏾‍🦰","person: medium-dark skin tone, red hair","o|3|Tu|Tv|8l","🧑🏿‍🦰","person: dark skin tone, red hair","o|3|Tx|Ty|8l","👩‍🦱","woman: curly hair","o|3|U0|U1|8l","👩🏻‍🦱","woman: light skin tone, curly hair","o|3|U3|U4|8l","👩🏼‍🦱","woman: medium-light skin tone, curly hair","o|3|U6|U7|8l","👩🏽‍🦱","woman: medium skin tone, curly hair","o|3|U9|UA|8l","👩🏾‍🦱","woman: medium-dark skin tone, curly hair","o|3|UC|UD|8l","👩🏿‍🦱","woman: dark skin tone, curly hair","o|3|UF|UG|8l","🧑‍🦱","person: curly hair","o|3|UI|UJ|8l","🧑🏻‍🦱","person: light skin tone, curly hair","o|3|UL|UM|8l","🧑🏼‍🦱","person: medium-light skin tone, curly hair","o|3|UO|UP|8l","🧑🏽‍🦱","person: medium skin tone, curly hair","o|3|UR|US|8l","🧑🏾‍🦱","person: medium-dark skin tone, curly hair","o|3|UU|UV|8l","🧑🏿‍🦱","person: dark skin tone, curly hair","o|3|UX|UY|8l","👩‍🦳","woman: white hair","o|3|Ua|Ub|8l","👩🏻‍🦳","woman: light skin tone, white hair","o|3|Ud|Ue|8l","👩🏼‍🦳","woman: medium-light skin tone, white hair","o|3|Ug|Uh|8l","👩🏽‍🦳","woman: medium skin tone, white hair","o|3|Uj|Uk|8l","👩🏾‍🦳","woman: medium-dark skin tone, white hair","o|3|Um|Un|8l","👩🏿‍🦳","woman: dark skin tone, white hair","o|3|Up|Uq|8l","🧑‍🦳","person: white hair","o|3|Us|Ut|8l","🧑🏻‍🦳","person: light skin tone, white hair","o|3|Uv|Uw|8l","🧑🏼‍🦳","person: medium-light skin tone, white hair","o|3|Uy|Uz|8l","🧑🏽‍🦳","person: medium skin tone, white hair","o|3|V1|V2|8l","🧑🏾‍🦳","person: medium-dark skin tone, white hair","o|3|V4|V5|8l","🧑🏿‍🦳","person: dark skin tone, white hair","o|3|V7|V8|8l","👩‍🦲","woman: bald","o|3|VA|VB|8l","👩🏻‍🦲","woman: light skin tone, bald","o|3|VD|VE|8l","👩🏼‍🦲","woman: medium-light skin tone, bald","o|3|VG|VH|8l","👩🏽‍🦲","woman: medium skin tone, bald","o|3|VJ|VK|8l","👩🏾‍🦲","woman: medium-dark skin tone, bald","o|3|VM|VN|8l","👩🏿‍🦲","woman: dark skin tone, bald","o|3|VP|VQ|8l","🧑‍🦲","person: bald","o|3|VS|VT|8l","🧑🏻‍🦲","person: light skin tone, bald","o|3|VV|VW|8l","🧑🏼‍🦲","person: medium-light skin tone, bald","o|3|VY|VZ|8l","🧑🏽‍🦲","person: medium skin tone, bald","o|3|Vb|Vc|8l","🧑🏾‍🦲","person: medium-dark skin tone, bald","o|3|Ve|Vf|8l","🧑🏿‍🦲","person: dark skin tone, bald","o|3|Vh|Vi|8l","👱‍♀️","woman: blond hair","o|3|Vk|Vl|8l","👱‍♀","o|3|Vn|Vl|8l","👱🏻‍♀️","woman: light skin tone, blond hair","o|3|Vp|Vq|8l","👱🏻‍♀","o|3|Vs|Vq|8l","👱🏼‍♀️","woman: medium-light skin tone, blond hair","o|3|Vu|Vv|8l","👱🏼‍♀","o|3|Vx|Vv|8l","👱🏽‍♀️","woman: medium skin tone, blond hair","o|3|Vz|W0|8l","👱🏽‍♀","o|3|W2|W0|8l","👱🏾‍♀️","woman: medium-dark skin tone, blond hair","o|3|W4|W5|8l","👱🏾‍♀","o|3|W7|W5|8l","👱🏿‍♀️","woman: dark skin tone, blond hair","o|3|W9|WA|8l","👱🏿‍♀","o|3|WC|WA|8l","👱‍♂️","man: blond hair","o|3|WE|WF|8l","👱‍♂","o|3|WH|WF|8l","👱🏻‍♂️","man: light skin tone, blond hair","o|3|WJ|WK|8l","👱🏻‍♂","o|3|WM|WK|8l","👱🏼‍♂️","man: medium-light skin tone, blond hair","o|3|WO|WP|8l","👱🏼‍♂","o|3|WR|WP|8l","👱🏽‍♂️","man: medium skin tone, blond hair","o|3|WT|WU|8l","👱🏽‍♂","o|3|WW|WU|8l","👱🏾‍♂️","man: medium-dark skin tone, blond hair","o|3|WY|WZ|8l","👱🏾‍♂","o|3|Wb|WZ|8l","👱🏿‍♂️","man: dark skin tone, blond hair","o|3|Wd|We|8l","👱🏿‍♂","o|3|Wg|We|8l","🧓","older person","o|3|Wi|Wj|8l","🧓🏻","older person: light skin tone","o|3|Wl|Wm|8l","🧓🏼","older person: medium-light skin tone","o|3|Wo|Wp|8l","🧓🏽","older person: medium skin tone","o|3|Wr|Ws|8l","🧓🏾","older person: medium-dark skin tone","o|3|Wu|Wv|8l","🧓🏿","older person: dark skin tone","o|3|Wx|Wy|8l","👴","old man","o|3|X0|X1|8l","👴🏻","old man: light skin tone","o|3|X3|X4|8l","👴🏼","old man: medium-light skin tone","o|3|X6|X7|8l","👴🏽","old man: medium skin tone","o|3|X9|XA|8l","👴🏾","old man: medium-dark skin tone","o|3|XC|XD|8l","👴🏿","old man: dark skin tone","o|3|XF|XG|8l","👵","old woman","o|3|XI|XJ|8l","👵🏻","old woman: light skin tone","o|3|XL|XM|8l","👵🏼","old woman: medium-light skin tone","o|3|XO|XP|8l","👵🏽","old woman: medium skin tone","o|3|XR|XS|8l","👵🏾","old woman: medium-dark skin tone","o|3|XU|XV|8l","👵🏿","old woman: dark skin tone","o|3|XX|XY|8l","🙍","person frowning","o|3|Xa|Xb|8l","🙍🏻","person frowning: light skin tone","o|3|Xd|Xe|8l","🙍🏼","person frowning: medium-light skin tone","o|3|Xg|Xh|8l","🙍🏽","person frowning: medium skin tone","o|3|Xj|Xk|8l","🙍🏾","person frowning: medium-dark skin tone","o|3|Xm|Xn|8l","🙍🏿","person frowning: dark skin tone","o|3|Xp|Xq|8l","🙍‍♂️","man frowning","o|3|Xs|Xt|8l","🙍‍♂","o|3|Xv|Xt|8l","🙍🏻‍♂️","man frowning: light skin tone","o|3|Xx|Xy|8l","🙍🏻‍♂","o|3|Y0|Xy|8l","🙍🏼‍♂️","man frowning: medium-light skin tone","o|3|Y2|Y3|8l","🙍🏼‍♂","o|3|Y5|Y3|8l","🙍🏽‍♂️","man frowning: medium skin tone","o|3|Y7|Y8|8l","🙍🏽‍♂","o|3|YA|Y8|8l","🙍🏾‍♂️","man frowning: medium-dark skin tone","o|3|YC|YD|8l","🙍🏾‍♂","o|3|YF|YD|8l","🙍🏿‍♂️","man frowning: dark skin tone","o|3|YH|YI|8l","🙍🏿‍♂","o|3|YK|YI|8l","🙍‍♀️","woman frowning","o|3|YM|YN|8l","🙍‍♀","o|3|YP|YN|8l","🙍🏻‍♀️","woman frowning: light skin tone","o|3|YR|YS|8l","🙍🏻‍♀","o|3|YU|YS|8l","🙍🏼‍♀️","woman frowning: medium-light skin tone","o|3|YW|YX|8l","🙍🏼‍♀","o|3|YZ|YX|8l","🙍🏽‍♀️","woman frowning: medium skin tone","o|3|Yb|Yc|8l","🙍🏽‍♀","o|3|Ye|Yc|8l","🙍🏾‍♀️","woman frowning: medium-dark skin tone","o|3|Yg|Yh|8l","🙍🏾‍♀","o|3|Yj|Yh|8l","🙍🏿‍♀️","woman frowning: dark skin tone","o|3|Yl|Ym|8l","🙍🏿‍♀","o|3|Yo|Ym|8l","🙎","person pouting","o|3|Yq|Yr|8l","🙎🏻","person pouting: light skin tone","o|3|Yt|Yu|8l","🙎🏼","person pouting: medium-light skin tone","o|3|Yw|Yx|8l","🙎🏽","person pouting: medium skin tone","o|3|Yz|Z0|8l","🙎🏾","person pouting: medium-dark skin tone","o|3|Z2|Z3|8l","🙎🏿","person pouting: dark skin tone","o|3|Z5|Z6|8l","🙎‍♂️","man pouting","o|3|Z8|Z9|8l","🙎‍♂","o|3|ZB|Z9|8l","🙎🏻‍♂️","man pouting: light skin tone","o|3|ZD|ZE|8l","🙎🏻‍♂","o|3|ZG|ZE|8l","🙎🏼‍♂️","man pouting: medium-light skin tone","o|3|ZI|ZJ|8l","🙎🏼‍♂","o|3|ZL|ZJ|8l","🙎🏽‍♂️","man pouting: medium skin tone","o|3|ZN|ZO|8l","🙎🏽‍♂","o|3|ZQ|ZO|8l","🙎🏾‍♂️","man pouting: medium-dark skin tone","o|3|ZS|ZT|8l","🙎🏾‍♂","o|3|ZV|ZT|8l","🙎🏿‍♂️","man pouting: dark skin tone","o|3|ZX|ZY|8l","🙎🏿‍♂","o|3|Za|ZY|8l","🙎‍♀️","woman pouting","o|3|Zc|Zd|8l","🙎‍♀","o|3|Zf|Zd|8l","🙎🏻‍♀️","woman pouting: light skin tone","o|3|Zh|Zi|8l","🙎🏻‍♀","o|3|Zk|Zi|8l","🙎🏼‍♀️","woman pouting: medium-light skin tone","o|3|Zm|Zn|8l","🙎🏼‍♀","o|3|Zp|Zn|8l","🙎🏽‍♀️","woman pouting: medium skin tone","o|3|Zr|Zs|8l","🙎🏽‍♀","o|3|Zu|Zs|8l","🙎🏾‍♀️","woman pouting: medium-dark skin tone","o|3|Zw|Zx|8l","🙎🏾‍♀","o|3|Zz|Zx|8l","🙎🏿‍♀️","woman pouting: dark skin tone","o|3|a1|a2|8l","🙎🏿‍♀","o|3|a4|a2|8l","🙅","person gesturing NO","o|3|a6|a7|8l","🙅🏻","person gesturing NO: light skin tone","o|3|a9|aA|8l","🙅🏼","person gesturing NO: medium-light skin tone","o|3|aC|aD|8l","🙅🏽","person gesturing NO: medium skin tone","o|3|aF|aG|8l","🙅🏾","person gesturing NO: medium-dark skin tone","o|3|aI|aJ|8l","🙅🏿","person gesturing NO: dark skin tone","o|3|aL|aM|8l","🙅‍♂️","man gesturing NO","o|3|aO|aP|8l","🙅‍♂","o|3|aR|aP|8l","🙅🏻‍♂️","man gesturing NO: light skin tone","o|3|aT|aU|8l","🙅🏻‍♂","o|3|aW|aU|8l","🙅🏼‍♂️","man gesturing NO: medium-light skin tone","o|3|aY|aZ|8l","🙅🏼‍♂","o|3|ab|aZ|8l","🙅🏽‍♂️","man gesturing NO: medium skin tone","o|3|ad|ae|8l","🙅🏽‍♂","o|3|ag|ae|8l","🙅🏾‍♂️","man gesturing NO: medium-dark skin tone","o|3|ai|aj|8l","🙅🏾‍♂","o|3|al|aj|8l","🙅🏿‍♂️","man gesturing NO: dark skin tone","o|3|an|ao|8l","🙅🏿‍♂","o|3|aq|ao|8l","🙅‍♀️","woman gesturing NO","o|3|as|at|8l","🙅‍♀","o|3|av|at|8l","🙅🏻‍♀️","woman gesturing NO: light skin tone","o|3|ax|ay|8l","🙅🏻‍♀","o|3|b0|ay|8l","🙅🏼‍♀️","woman gesturing NO: medium-light skin tone","o|3|b2|b3|8l","🙅🏼‍♀","o|3|b5|b3|8l","🙅🏽‍♀️","woman gesturing NO: medium skin tone","o|3|b7|b8|8l","🙅🏽‍♀","o|3|bA|b8|8l","🙅🏾‍♀️","woman gesturing NO: medium-dark skin tone","o|3|bC|bD|8l","🙅🏾‍♀","o|3|bF|bD|8l","🙅🏿‍♀️","woman gesturing NO: dark skin tone","o|3|bH|bI|8l","🙅🏿‍♀","o|3|bK|bI|8l","🙆","person gesturing OK","o|3|bM|bN|8l","🙆🏻","person gesturing OK: light skin tone","o|3|bP|bQ|8l","🙆🏼","person gesturing OK: medium-light skin tone","o|3|bS|bT|8l","🙆🏽","person gesturing OK: medium skin tone","o|3|bV|bW|8l","🙆🏾","person gesturing OK: medium-dark skin tone","o|3|bY|bZ|8l","🙆🏿","person gesturing OK: dark skin tone","o|3|bb|bc|8l","🙆‍♂️","man gesturing OK","o|3|be|bf|8l","🙆‍♂","o|3|bh|bf|8l","🙆🏻‍♂️","man gesturing OK: light skin tone","o|3|bj|bk|8l","🙆🏻‍♂","o|3|bm|bk|8l","🙆🏼‍♂️","man gesturing OK: medium-light skin tone","o|3|bo|bp|8l","🙆🏼‍♂","o|3|br|bp|8l","🙆🏽‍♂️","man gesturing OK: medium skin tone","o|3|bt|bu|8l","🙆🏽‍♂","o|3|bw|bu|8l","🙆🏾‍♂️","man gesturing OK: medium-dark skin tone","o|3|by|bz|8l","🙆🏾‍♂","o|3|c1|bz|8l","🙆🏿‍♂️","man gesturing OK: dark skin tone","o|3|c3|c4|8l","🙆🏿‍♂","o|3|c6|c4|8l","🙆‍♀️","woman gesturing OK","o|3|c8|c9|8l","🙆‍♀","o|3|cB|c9|8l","🙆🏻‍♀️","woman gesturing OK: light skin tone","o|3|cD|cE|8l","🙆🏻‍♀","o|3|cG|cE|8l","🙆🏼‍♀️","woman gesturing OK: medium-light skin tone","o|3|cI|cJ|8l","🙆🏼‍♀","o|3|cL|cJ|8l","🙆🏽‍♀️","woman gesturing OK: medium skin tone","o|3|cN|cO|8l","🙆🏽‍♀","o|3|cQ|cO|8l","🙆🏾‍♀️","woman gesturing OK: medium-dark skin tone","o|3|cS|cT|8l","🙆🏾‍♀","o|3|cV|cT|8l","🙆🏿‍♀️","woman gesturing OK: dark skin tone","o|3|cX|cY|8l","🙆🏿‍♀","o|3|ca|cY|8l","💁","person tipping hand","o|3|cc|cd|8l","💁🏻","person tipping hand: light skin tone","o|3|cf|cg|8l","💁🏼","person tipping hand: medium-light skin tone","o|3|ci|cj|8l","💁🏽","person tipping hand: medium skin tone","o|3|cl|cm|8l","💁🏾","person tipping hand: medium-dark skin tone","o|3|co|cp|8l","💁🏿","person tipping hand: dark skin tone","o|3|cr|cs|8l","💁‍♂️","man tipping hand","o|3|cu|cv|8l","💁‍♂","o|3|cx|cv|8l","💁🏻‍♂️","man tipping hand: light skin tone","o|3|cz|d0|8l","💁🏻‍♂","o|3|d2|d0|8l","💁🏼‍♂️","man tipping hand: medium-light skin tone","o|3|d4|d5|8l","💁🏼‍♂","o|3|d7|d5|8l","💁🏽‍♂️","man tipping hand: medium skin tone","o|3|d9|dA|8l","💁🏽‍♂","o|3|dC|dA|8l","💁🏾‍♂️","man tipping hand: medium-dark skin tone","o|3|dE|dF|8l","💁🏾‍♂","o|3|dH|dF|8l","💁🏿‍♂️","man tipping hand: dark skin tone","o|3|dJ|dK|8l","💁🏿‍♂","o|3|dM|dK|8l","💁‍♀️","woman tipping hand","o|3|dO|dP|8l","💁‍♀","o|3|dR|dP|8l","💁🏻‍♀️","woman tipping hand: light skin tone","o|3|dT|dU|8l","💁🏻‍♀","o|3|dW|dU|8l","💁🏼‍♀️","woman tipping hand: medium-light skin tone","o|3|dY|dZ|8l","💁🏼‍♀","o|3|db|dZ|8l","💁🏽‍♀️","woman tipping hand: medium skin tone","o|3|dd|de|8l","💁🏽‍♀","o|3|dg|de|8l","💁🏾‍♀️","woman tipping hand: medium-dark skin tone","o|3|di|dj|8l","💁🏾‍♀","o|3|dl|dj|8l","💁🏿‍♀️","woman tipping hand: dark skin tone","o|3|dn|do|8l","💁🏿‍♀","o|3|dq|do|8l","🙋","person raising hand","o|3|ds|dt|8l","🙋🏻","person raising hand: light skin tone","o|3|dv|dw|8l","🙋🏼","person raising hand: medium-light skin tone","o|3|dy|dz|8l","🙋🏽","person raising hand: medium skin tone","o|3|e1|e2|8l","🙋🏾","person raising hand: medium-dark skin tone","o|3|e4|e5|8l","🙋🏿","person raising hand: dark skin tone","o|3|e7|e8|8l","🙋‍♂️","man raising hand","o|3|eA|eB|8l","🙋‍♂","o|3|eD|eB|8l","🙋🏻‍♂️","man raising hand: light skin tone","o|3|eF|eG|8l","🙋🏻‍♂","o|3|eI|eG|8l","🙋🏼‍♂️","man raising hand: medium-light skin tone","o|3|eK|eL|8l","🙋🏼‍♂","o|3|eN|eL|8l","🙋🏽‍♂️","man raising hand: medium skin tone","o|3|eP|eQ|8l","🙋🏽‍♂","o|3|eS|eQ|8l","🙋🏾‍♂️","man raising hand: medium-dark skin tone","o|3|eU|eV|8l","🙋🏾‍♂","o|3|eX|eV|8l","🙋🏿‍♂️","man raising hand: dark skin tone","o|3|eZ|ea|8l","🙋🏿‍♂","o|3|ec|ea|8l","🙋‍♀️","woman raising hand","o|3|ee|ef|8l","🙋‍♀","o|3|eh|ef|8l","🙋🏻‍♀️","woman raising hand: light skin tone","o|3|ej|ek|8l","🙋🏻‍♀","o|3|em|ek|8l","🙋🏼‍♀️","woman raising hand: medium-light skin tone","o|3|eo|ep|8l","🙋🏼‍♀","o|3|er|ep|8l","🙋🏽‍♀️","woman raising hand: medium skin tone","o|3|et|eu|8l","🙋🏽‍♀","o|3|ew|eu|8l","🙋🏾‍♀️","woman raising hand: medium-dark skin tone","o|3|ey|ez|8l","🙋🏾‍♀","o|3|f1|ez|8l","🙋🏿‍♀️","woman raising hand: dark skin tone","o|3|f3|f4|8l","🙋🏿‍♀","o|3|f6|f4|8l","🧏","deaf person","o|3|f8|f9|8l","🧏🏻","deaf person: light skin tone","o|3|fB|fC|8l","🧏🏼","deaf person: medium-light skin tone","o|3|fE|fF|8l","🧏🏽","deaf person: medium skin tone","o|3|fH|fI|8l","🧏🏾","deaf person: medium-dark skin tone","o|3|fK|fL|8l","🧏🏿","deaf person: dark skin tone","o|3|fN|fO|8l","🧏‍♂️","deaf man","o|3|fQ|fR|8l","🧏‍♂","o|3|fT|fR|8l","🧏🏻‍♂️","deaf man: light skin tone","o|3|fV|fW|8l","🧏🏻‍♂","o|3|fY|fW|8l","🧏🏼‍♂️","deaf man: medium-light skin tone","o|3|fa|fb|8l","🧏🏼‍♂","o|3|fd|fb|8l","🧏🏽‍♂️","deaf man: medium skin tone","o|3|ff|fg|8l","🧏🏽‍♂","o|3|fi|fg|8l","🧏🏾‍♂️","deaf man: medium-dark skin tone","o|3|fk|fl|8l","🧏🏾‍♂","o|3|fn|fl|8l","🧏🏿‍♂️","deaf man: dark skin tone","o|3|fp|fq|8l","🧏🏿‍♂","o|3|fs|fq|8l","🧏‍♀️","deaf woman","o|3|fu|fv|8l","🧏‍♀","o|3|fx|fv|8l","🧏🏻‍♀️","deaf woman: light skin tone","o|3|fz|g0|8l","🧏🏻‍♀","o|3|g2|g0|8l","🧏🏼‍♀️","deaf woman: medium-light skin tone","o|3|g4|g5|8l","🧏🏼‍♀","o|3|g7|g5|8l","🧏🏽‍♀️","deaf woman: medium skin tone","o|3|g9|gA|8l","🧏🏽‍♀","o|3|gC|gA|8l","🧏🏾‍♀️","deaf woman: medium-dark skin tone","o|3|gE|gF|8l","🧏🏾‍♀","o|3|gH|gF|8l","🧏🏿‍♀️","deaf woman: dark skin tone","o|3|gJ|gK|8l","🧏🏿‍♀","o|3|gM|gK|8l","🙇","person bowing","o|3|gO|gP|8l","🙇🏻","person bowing: light skin tone","o|3|gR|gS|8l","🙇🏼","person bowing: medium-light skin tone","o|3|gU|gV|8l","🙇🏽","person bowing: medium skin tone","o|3|gX|gY|8l","🙇🏾","person bowing: medium-dark skin tone","o|3|ga|gb|8l","🙇🏿","person bowing: dark skin tone","o|3|gd|ge|8l","🙇‍♂️","man bowing","o|3|gg|gh|8l","🙇‍♂","o|3|gj|gh|8l","🙇🏻‍♂️","man bowing: light skin tone","o|3|gl|gm|8l","🙇🏻‍♂","o|3|go|gm|8l","🙇🏼‍♂️","man bowing: medium-light skin tone","o|3|gq|gr|8l","🙇🏼‍♂","o|3|gt|gr|8l","🙇🏽‍♂️","man bowing: medium skin tone","o|3|gv|gw|8l","🙇🏽‍♂","o|3|gy|gw|8l","🙇🏾‍♂️","man bowing: medium-dark skin tone","o|3|h0|h1|8l","🙇🏾‍♂","o|3|h3|h1|8l","🙇🏿‍♂️","man bowing: dark skin tone","o|3|h5|h6|8l","🙇🏿‍♂","o|3|h8|h6|8l","🙇‍♀️","woman bowing","o|3|hA|hB|8l","🙇‍♀","o|3|hD|hB|8l","🙇🏻‍♀️","woman bowing: light skin tone","o|3|hF|hG|8l","🙇🏻‍♀","o|3|hI|hG|8l","🙇🏼‍♀️","woman bowing: medium-light skin tone","o|3|hK|hL|8l","🙇🏼‍♀","o|3|hN|hL|8l","🙇🏽‍♀️","woman bowing: medium skin tone","o|3|hP|hQ|8l","🙇🏽‍♀","o|3|hS|hQ|8l","🙇🏾‍♀️","woman bowing: medium-dark skin tone","o|3|hU|hV|8l","🙇🏾‍♀","o|3|hX|hV|8l","🙇🏿‍♀️","woman bowing: dark skin tone","o|3|hZ|ha|8l","🙇🏿‍♀","o|3|hc|ha|8l","🤦","person facepalming","o|3|he|hf|8l","🤦🏻","person facepalming: light skin tone","o|3|hh|hi|8l","🤦🏼","person facepalming: medium-light skin tone","o|3|hk|hl|8l","🤦🏽","person facepalming: medium skin tone","o|3|hn|ho|8l","🤦🏾","person facepalming: medium-dark skin tone","o|3|hq|hr|8l","🤦🏿","person facepalming: dark skin tone","o|3|ht|hu|8l","🤦‍♂️","man facepalming","o|3|hw|hx|8l","🤦‍♂","o|3|hz|hx|8l","🤦🏻‍♂️","man facepalming: light skin tone","o|3|i1|i2|8l","🤦🏻‍♂","o|3|i4|i2|8l","🤦🏼‍♂️","man facepalming: medium-light skin tone","o|3|i6|i7|8l","🤦🏼‍♂","o|3|i9|i7|8l","🤦🏽‍♂️","man facepalming: medium skin tone","o|3|iB|iC|8l","🤦🏽‍♂","o|3|iE|iC|8l","🤦🏾‍♂️","man facepalming: medium-dark skin tone","o|3|iG|iH|8l","🤦🏾‍♂","o|3|iJ|iH|8l","🤦🏿‍♂️","man facepalming: dark skin tone","o|3|iL|iM|8l","🤦🏿‍♂","o|3|iO|iM|8l","🤦‍♀️","woman facepalming","o|3|iQ|iR|8l","🤦‍♀","o|3|iT|iR|8l","🤦🏻‍♀️","woman facepalming: light skin tone","o|3|iV|iW|8l","🤦🏻‍♀","o|3|iY|iW|8l","🤦🏼‍♀️","woman facepalming: medium-light skin tone","o|3|ia|ib|8l","🤦🏼‍♀","o|3|id|ib|8l","🤦🏽‍♀️","woman facepalming: medium skin tone","o|3|if|ig|8l","🤦🏽‍♀","o|3|ii|ig|8l","🤦🏾‍♀️","woman facepalming: medium-dark skin tone","o|3|ik|il|8l","🤦🏾‍♀","o|3|in|il|8l","🤦🏿‍♀️","woman facepalming: dark skin tone","o|3|ip|iq|8l","🤦🏿‍♀","o|3|is|iq|8l","🤷","person shrugging","o|3|iu|iv|8l","🤷🏻","person shrugging: light skin tone","o|3|ix|iy|8l","🤷🏼","person shrugging: medium-light skin tone","o|3|j0|j1|8l","🤷🏽","person shrugging: medium skin tone","o|3|j3|j4|8l","🤷🏾","person shrugging: medium-dark skin tone","o|3|j6|j7|8l","🤷🏿","person shrugging: dark skin tone","o|3|j9|jA|8l","🤷‍♂️","man shrugging","o|3|jC|jD|8l","🤷‍♂","o|3|jF|jD|8l","🤷🏻‍♂️","man shrugging: light skin tone","o|3|jH|jI|8l","🤷🏻‍♂","o|3|jK|jI|8l","🤷🏼‍♂️","man shrugging: medium-light skin tone","o|3|jM|jN|8l","🤷🏼‍♂","o|3|jP|jN|8l","🤷🏽‍♂️","man shrugging: medium skin tone","o|3|jR|jS|8l","🤷🏽‍♂","o|3|jU|jS|8l","🤷🏾‍♂️","man shrugging: medium-dark skin tone","o|3|jW|jX|8l","🤷🏾‍♂","o|3|jZ|jX|8l","🤷🏿‍♂️","man shrugging: dark skin tone","o|3|jb|jc|8l","🤷🏿‍♂","o|3|je|jc|8l","🤷‍♀️","woman shrugging","o|3|jg|jh|8l","🤷‍♀","o|3|jj|jh|8l","🤷🏻‍♀️","woman shrugging: light skin tone","o|3|jl|jm|8l","🤷🏻‍♀","o|3|jo|jm|8l","🤷🏼‍♀️","woman shrugging: medium-light skin tone","o|3|jq|jr|8l","🤷🏼‍♀","o|3|jt|jr|8l","🤷🏽‍♀️","woman shrugging: medium skin tone","o|3|jv|jw|8l","🤷🏽‍♀","o|3|jy|jw|8l","🤷🏾‍♀️","woman shrugging: medium-dark skin tone","o|3|k0|k1|8l","🤷🏾‍♀","o|3|k3|k1|8l","🤷🏿‍♀️","woman shrugging: dark skin tone","o|3|k5|k6|8l","🤷🏿‍♀","o|3|k8|k6|8l","🧑‍⚕️","health worker","o|3|kA|kB|8l","🧑‍⚕","o|3|kD|kB|8l","🧑🏻‍⚕️","health worker: light skin tone","o|3|kF|kG|8l","🧑🏻‍⚕","o|3|kI|kG|8l","🧑🏼‍⚕️","health worker: medium-light skin tone","o|3|kK|kL|8l","🧑🏼‍⚕","o|3|kN|kL|8l","🧑🏽‍⚕️","health worker: medium skin tone","o|3|kP|kQ|8l","🧑🏽‍⚕","o|3|kS|kQ|8l","🧑🏾‍⚕️","health worker: medium-dark skin tone","o|3|kU|kV|8l","🧑🏾‍⚕","o|3|kX|kV|8l","🧑🏿‍⚕️","health worker: dark skin tone","o|3|kZ|ka|8l","🧑🏿‍⚕","o|3|kc|ka|8l","👨‍⚕️","man health worker","o|3|ke|kf|8l","👨‍⚕","o|3|kh|kf|8l","👨🏻‍⚕️","man health worker: light skin tone","o|3|kj|kk|8l","👨🏻‍⚕","o|3|km|kk|8l","👨🏼‍⚕️","man health worker: medium-light skin tone","o|3|ko|kp|8l","👨🏼‍⚕","o|3|kr|kp|8l","👨🏽‍⚕️","man health worker: medium skin tone","o|3|kt|ku|8l","👨🏽‍⚕","o|3|kw|ku|8l","👨🏾‍⚕️","man health worker: medium-dark skin tone","o|3|ky|kz|8l","👨🏾‍⚕","o|3|l1|kz|8l","👨🏿‍⚕️","man health worker: dark skin tone","o|3|l3|l4|8l","👨🏿‍⚕","o|3|l6|l4|8l","👩‍⚕️","woman health worker","o|3|l8|l9|8l","👩‍⚕","o|3|lB|l9|8l","👩🏻‍⚕️","woman health worker: light skin tone","o|3|lD|lE|8l","👩🏻‍⚕","o|3|lG|lE|8l","👩🏼‍⚕️","woman health worker: medium-light skin tone","o|3|lI|lJ|8l","👩🏼‍⚕","o|3|lL|lJ|8l","👩🏽‍⚕️","woman health worker: medium skin tone","o|3|lN|lO|8l","👩🏽‍⚕","o|3|lQ|lO|8l","👩🏾‍⚕️","woman health worker: medium-dark skin tone","o|3|lS|lT|8l","👩🏾‍⚕","o|3|lV|lT|8l","👩🏿‍⚕️","woman health worker: dark skin tone","o|3|lX|lY|8l","👩🏿‍⚕","o|3|la|lY|8l","🧑‍🎓","student","o|3|lc|ld|8l","🧑🏻‍🎓","student: light skin tone","o|3|lf|lg|8l","🧑🏼‍🎓","student: medium-light skin tone","o|3|li|lj|8l","🧑🏽‍🎓","student: medium skin tone","o|3|ll|lm|8l","🧑🏾‍🎓","student: medium-dark skin tone","o|3|lo|lp|8l","🧑🏿‍🎓","student: dark skin tone","o|3|lr|ls|8l","👨‍🎓","man student","o|3|lu|lv|8l","👨🏻‍🎓","man student: light skin tone","o|3|lx|ly|8l","👨🏼‍🎓","man student: medium-light skin tone","o|3|m0|m1|8l","👨🏽‍🎓","man student: medium skin tone","o|3|m3|m4|8l","👨🏾‍🎓","man student: medium-dark skin tone","o|3|m6|m7|8l","👨🏿‍🎓","man student: dark skin tone","o|3|m9|mA|8l","👩‍🎓","woman student","o|3|mC|mD|8l","👩🏻‍🎓","woman student: light skin tone","o|3|mF|mG|8l","👩🏼‍🎓","woman student: medium-light skin tone","o|3|mI|mJ|8l","👩🏽‍🎓","woman student: medium skin tone","o|3|mL|mM|8l","👩🏾‍🎓","woman student: medium-dark skin tone","o|3|mO|mP|8l","👩🏿‍🎓","woman student: dark skin tone","o|3|mR|mS|8l","🧑‍🏫","teacher","o|3|mU|mV|8l","🧑🏻‍🏫","teacher: light skin tone","o|3|mX|mY|8l","🧑🏼‍🏫","teacher: medium-light skin tone","o|3|ma|mb|8l","🧑🏽‍🏫","teacher: medium skin tone","o|3|md|me|8l","🧑🏾‍🏫","teacher: medium-dark skin tone","o|3|mg|mh|8l","🧑🏿‍🏫","teacher: dark skin tone","o|3|mj|mk|8l","👨‍🏫","man teacher","o|3|mm|mn|8l","👨🏻‍🏫","man teacher: light skin tone","o|3|mp|mq|8l","👨🏼‍🏫","man teacher: medium-light skin tone","o|3|ms|mt|8l","👨🏽‍🏫","man teacher: medium skin tone","o|3|mv|mw|8l","👨🏾‍🏫","man teacher: medium-dark skin tone","o|3|my|mz|8l","👨🏿‍🏫","man teacher: dark skin tone","o|3|n1|n2|8l","👩‍🏫","woman teacher","o|3|n4|n5|8l","👩🏻‍🏫","woman teacher: light skin tone","o|3|n7|n8|8l","👩🏼‍🏫","woman teacher: medium-light skin tone","o|3|nA|nB|8l","👩🏽‍🏫","woman teacher: medium skin tone","o|3|nD|nE|8l","👩🏾‍🏫","woman teacher: medium-dark skin tone","o|3|nG|nH|8l","👩🏿‍🏫","woman teacher: dark skin tone","o|3|nJ|nK|8l","🧑‍⚖️","judge","o|3|nM|nN|8l","🧑‍⚖","o|3|nP|nN|8l","🧑🏻‍⚖️","judge: light skin tone","o|3|nR|nS|8l","🧑🏻‍⚖","o|3|nU|nS|8l","🧑🏼‍⚖️","judge: medium-light skin tone","o|3|nW|nX|8l","🧑🏼‍⚖","o|3|nZ|nX|8l","🧑🏽‍⚖️","judge: medium skin tone","o|3|nb|nc|8l","🧑🏽‍⚖","o|3|ne|nc|8l","🧑🏾‍⚖️","judge: medium-dark skin tone","o|3|ng|nh|8l","🧑🏾‍⚖","o|3|nj|nh|8l","🧑🏿‍⚖️","judge: dark skin tone","o|3|nl|nm|8l","🧑🏿‍⚖","o|3|no|nm|8l","👨‍⚖️","man judge","o|3|nq|nr|8l","👨‍⚖","o|3|nt|nr|8l","👨🏻‍⚖️","man judge: light skin tone","o|3|nv|nw|8l","👨🏻‍⚖","o|3|ny|nw|8l","👨🏼‍⚖️","man judge: medium-light skin tone","o|3|o0|o1|8l","👨🏼‍⚖","o|3|o3|o1|8l","👨🏽‍⚖️","man judge: medium skin tone","o|3|o5|o6|8l","👨🏽‍⚖","o|3|o8|o6|8l","👨🏾‍⚖️","man judge: medium-dark skin tone","o|3|oA|oB|8l","👨🏾‍⚖","o|3|oD|oB|8l","👨🏿‍⚖️","man judge: dark skin tone","o|3|oF|oG|8l","👨🏿‍⚖","o|3|oI|oG|8l","👩‍⚖️","woman judge","o|3|oK|oL|8l","👩‍⚖","o|3|oN|oL|8l","👩🏻‍⚖️","woman judge: light skin tone","o|3|oP|oQ|8l","👩🏻‍⚖","o|3|oS|oQ|8l","👩🏼‍⚖️","woman judge: medium-light skin tone","o|3|oU|oV|8l","👩🏼‍⚖","o|3|oX|oV|8l","👩🏽‍⚖️","woman judge: medium skin tone","o|3|oZ|oa|8l","👩🏽‍⚖","o|3|oc|oa|8l","👩🏾‍⚖️","woman judge: medium-dark skin tone","o|3|oe|of|8l","👩🏾‍⚖","o|3|oh|of|8l","👩🏿‍⚖️","woman judge: dark skin tone","o|3|oj|ok|8l","👩🏿‍⚖","o|3|om|ok|8l","🧑‍🌾","farmer","o|3|oo|op|8l","🧑🏻‍🌾","farmer: light skin tone","o|3|or|os|8l","🧑🏼‍🌾","farmer: medium-light skin tone","o|3|ou|ov|8l","🧑🏽‍🌾","farmer: medium skin tone","o|3|ox|oy|8l","🧑🏾‍🌾","farmer: medium-dark skin tone","o|3|p0|p1|8l","🧑🏿‍🌾","farmer: dark skin tone","o|3|p3|p4|8l","👨‍🌾","man farmer","o|3|p6|p7|8l","👨🏻‍🌾","man farmer: light skin tone","o|3|p9|pA|8l","👨🏼‍🌾","man farmer: medium-light skin tone","o|3|pC|pD|8l","👨🏽‍🌾","man farmer: medium skin tone","o|3|pF|pG|8l","👨🏾‍🌾","man farmer: medium-dark skin tone","o|3|pI|pJ|8l","👨🏿‍🌾","man farmer: dark skin tone","o|3|pL|pM|8l","👩‍🌾","woman farmer","o|3|pO|pP|8l","👩🏻‍🌾","woman farmer: light skin tone","o|3|pR|pS|8l","👩🏼‍🌾","woman farmer: medium-light skin tone","o|3|pU|pV|8l","👩🏽‍🌾","woman farmer: medium skin tone","o|3|pX|pY|8l","👩🏾‍🌾","woman farmer: medium-dark skin tone","o|3|pa|pb|8l","👩🏿‍🌾","woman farmer: dark skin tone","o|3|pd|pe|8l","🧑‍🍳","cook","o|3|pg|ph|8l","🧑🏻‍🍳","cook: light skin tone","o|3|pj|pk|8l","🧑🏼‍🍳","cook: medium-light skin tone","o|3|pm|pn|8l","🧑🏽‍🍳","cook: medium skin tone","o|3|pp|pq|8l","🧑🏾‍🍳","cook: medium-dark skin tone","o|3|ps|pt|8l","🧑🏿‍🍳","cook: dark skin tone","o|3|pv|pw|8l","👨‍🍳","man cook","o|3|py|pz|8l","👨🏻‍🍳","man cook: light skin tone","o|3|q1|q2|8l","👨🏼‍🍳","man cook: medium-light skin tone","o|3|q4|q5|8l","👨🏽‍🍳","man cook: medium skin tone","o|3|q7|q8|8l","👨🏾‍🍳","man cook: medium-dark skin tone","o|3|qA|qB|8l","👨🏿‍🍳","man cook: dark skin tone","o|3|qD|qE|8l","👩‍🍳","woman cook","o|3|qG|qH|8l","👩🏻‍🍳","woman cook: light skin tone","o|3|qJ|qK|8l","👩🏼‍🍳","woman cook: medium-light skin tone","o|3|qM|qN|8l","👩🏽‍🍳","woman cook: medium skin tone","o|3|qP|qQ|8l","👩🏾‍🍳","woman cook: medium-dark skin tone","o|3|qS|qT|8l","👩🏿‍🍳","woman cook: dark skin tone","o|3|qV|qW|8l","🧑‍🔧","mechanic","o|3|qY|qZ|8l","🧑🏻‍🔧","mechanic: light skin tone","o|3|qb|qc|8l","🧑🏼‍🔧","mechanic: medium-light skin tone","o|3|qe|qf|8l","🧑🏽‍🔧","mechanic: medium skin tone","o|3|qh|qi|8l","🧑🏾‍🔧","mechanic: medium-dark skin tone","o|3|qk|ql|8l","🧑🏿‍🔧","mechanic: dark skin tone","o|3|qn|qo|8l","👨‍🔧","man mechanic","o|3|qq|qr|8l","👨🏻‍🔧","man mechanic: light skin tone","o|3|qt|qu|8l","👨🏼‍🔧","man mechanic: medium-light skin tone","o|3|qw|qx|8l","👨🏽‍🔧","man mechanic: medium skin tone","o|3|qz|r0|8l","👨🏾‍🔧","man mechanic: medium-dark skin tone","o|3|r2|r3|8l","👨🏿‍🔧","man mechanic: dark skin tone","o|3|r5|r6|8l","👩‍🔧","woman mechanic","o|3|r8|r9|8l","👩🏻‍🔧","woman mechanic: light skin tone","o|3|rB|rC|8l","👩🏼‍🔧","woman mechanic: medium-light skin tone","o|3|rE|rF|8l","👩🏽‍🔧","woman mechanic: medium skin tone","o|3|rH|rI|8l","👩🏾‍🔧","woman mechanic: medium-dark skin tone","o|3|rK|rL|8l","👩🏿‍🔧","woman mechanic: dark skin tone","o|3|rN|rO|8l","🧑‍🏭","factory worker","o|3|rQ|rR|8l","🧑🏻‍🏭","factory worker: light skin tone","o|3|rT|rU|8l","🧑🏼‍🏭","factory worker: medium-light skin tone","o|3|rW|rX|8l","🧑🏽‍🏭","factory worker: medium skin tone","o|3|rZ|ra|8l","🧑🏾‍🏭","factory worker: medium-dark skin tone","o|3|rc|rd|8l","🧑🏿‍🏭","factory worker: dark skin tone","o|3|rf|rg|8l","👨‍🏭","man factory worker","o|3|ri|rj|8l","👨🏻‍🏭","man factory worker: light skin tone","o|3|rl|rm|8l","👨🏼‍🏭","man factory worker: medium-light skin tone","o|3|ro|rp|8l","👨🏽‍🏭","man factory worker: medium skin tone","o|3|rr|rs|8l","👨🏾‍🏭","man factory worker: medium-dark skin tone","o|3|ru|rv|8l","👨🏿‍🏭","man factory worker: dark skin tone","o|3|rx|ry|8l","👩‍🏭","woman factory worker","o|3|s0|s1|8l","👩🏻‍🏭","woman factory worker: light skin tone","o|3|s3|s4|8l","👩🏼‍🏭","woman factory worker: medium-light skin tone","o|3|s6|s7|8l","👩🏽‍🏭","woman factory worker: medium skin tone","o|3|s9|sA|8l","👩🏾‍🏭","woman factory worker: medium-dark skin tone","o|3|sC|sD|8l","👩🏿‍🏭","woman factory worker: dark skin tone","o|3|sF|sG|8l","🧑‍💼","office worker","o|3|sI|sJ|8l","🧑🏻‍💼","office worker: light skin tone","o|3|sL|sM|8l","🧑🏼‍💼","office worker: medium-light skin tone","o|3|sO|sP|8l","🧑🏽‍💼","office worker: medium skin tone","o|3|sR|sS|8l","🧑🏾‍💼","office worker: medium-dark skin tone","o|3|sU|sV|8l","🧑🏿‍💼","office worker: dark skin tone","o|3|sX|sY|8l","👨‍💼","man office worker","o|3|sa|sb|8l","👨🏻‍💼","man office worker: light skin tone","o|3|sd|se|8l","👨🏼‍💼","man office worker: medium-light skin tone","o|3|sg|sh|8l","👨🏽‍💼","man office worker: medium skin tone","o|3|sj|sk|8l","👨🏾‍💼","man office worker: medium-dark skin tone","o|3|sm|sn|8l","👨🏿‍💼","man office worker: dark skin tone","o|3|sp|sq|8l","👩‍💼","woman office worker","o|3|ss|st|8l","👩🏻‍💼","woman office worker: light skin tone","o|3|sv|sw|8l","👩🏼‍💼","woman office worker: medium-light skin tone","o|3|sy|sz|8l","👩🏽‍💼","woman office worker: medium skin tone","o|3|t1|t2|8l","👩🏾‍💼","woman office worker: medium-dark skin tone","o|3|t4|t5|8l","👩🏿‍💼","woman office worker: dark skin tone","o|3|t7|t8|8l","🧑‍🔬","scientist","o|3|tA|tB|8l","🧑🏻‍🔬","scientist: light skin tone","o|3|tD|tE|8l","🧑🏼‍🔬","scientist: medium-light skin tone","o|3|tG|tH|8l","🧑🏽‍🔬","scientist: medium skin tone","o|3|tJ|tK|8l","🧑🏾‍🔬","scientist: medium-dark skin tone","o|3|tM|tN|8l","🧑🏿‍🔬","scientist: dark skin tone","o|3|tP|tQ|8l","👨‍🔬","man scientist","o|3|tS|tT|8l","👨🏻‍🔬","man scientist: light skin tone","o|3|tV|tW|8l","👨🏼‍🔬","man scientist: medium-light skin tone","o|3|tY|tZ|8l","👨🏽‍🔬","man scientist: medium skin tone","o|3|tb|tc|8l","👨🏾‍🔬","man scientist: medium-dark skin tone","o|3|te|tf|8l","👨🏿‍🔬","man scientist: dark skin tone","o|3|th|ti|8l","👩‍🔬","woman scientist","o|3|tk|tl|8l","👩🏻‍🔬","woman scientist: light skin tone","o|3|tn|to|8l","👩🏼‍🔬","woman scientist: medium-light skin tone","o|3|tq|tr|8l","👩🏽‍🔬","woman scientist: medium skin tone","o|3|tt|tu|8l","👩🏾‍🔬","woman scientist: medium-dark skin tone","o|3|tw|tx|8l","👩🏿‍🔬","woman scientist: dark skin tone","o|3|tz|u0|8l","🧑‍💻","technologist","o|3|u2|u3|8l","🧑🏻‍💻","technologist: light skin tone","o|3|u5|u6|8l","🧑🏼‍💻","technologist: medium-light skin tone","o|3|u8|u9|8l","🧑🏽‍💻","technologist: medium skin tone","o|3|uB|uC|8l","🧑🏾‍💻","technologist: medium-dark skin tone","o|3|uE|uF|8l","🧑🏿‍💻","technologist: dark skin tone","o|3|uH|uI|8l","👨‍💻","man technologist","o|3|uK|uL|8l","👨🏻‍💻","man technologist: light skin tone","o|3|uN|uO|8l","👨🏼‍💻","man technologist: medium-light skin tone","o|3|uQ|uR|8l","👨🏽‍💻","man technologist: medium skin tone","o|3|uT|uU|8l","👨🏾‍💻","man technologist: medium-dark skin tone","o|3|uW|uX|8l","👨🏿‍💻","man technologist: dark skin tone","o|3|uZ|ua|8l","👩‍💻","woman technologist","o|3|uc|ud|8l","👩🏻‍💻","woman technologist: light skin tone","o|3|uf|ug|8l","👩🏼‍💻","woman technologist: medium-light skin tone","o|3|ui|uj|8l","👩🏽‍💻","woman technologist: medium skin tone","o|3|ul|um|8l","👩🏾‍💻","woman technologist: medium-dark skin tone","o|3|uo|up|8l","👩🏿‍💻","woman technologist: dark skin tone","o|3|ur|us|8l","🧑‍🎤","singer","o|3|uu|uv|8l","🧑🏻‍🎤","singer: light skin tone","o|3|ux|uy|8l","🧑🏼‍🎤","singer: medium-light skin tone","o|3|v0|v1|8l","🧑🏽‍🎤","singer: medium skin tone","o|3|v3|v4|8l","🧑🏾‍🎤","singer: medium-dark skin tone","o|3|v6|v7|8l","🧑🏿‍🎤","singer: dark skin tone","o|3|v9|vA|8l","👨‍🎤","man singer","o|3|vC|vD|8l","👨🏻‍🎤","man singer: light skin tone","o|3|vF|vG|8l","👨🏼‍🎤","man singer: medium-light skin tone","o|3|vI|vJ|8l","👨🏽‍🎤","man singer: medium skin tone","o|3|vL|vM|8l","👨🏾‍🎤","man singer: medium-dark skin tone","o|3|vO|vP|8l","👨🏿‍🎤","man singer: dark skin tone","o|3|vR|vS|8l","👩‍🎤","woman singer","o|3|vU|vV|8l","👩🏻‍🎤","woman singer: light skin tone","o|3|vX|vY|8l","👩🏼‍🎤","woman singer: medium-light skin tone","o|3|va|vb|8l","👩🏽‍🎤","woman singer: medium skin tone","o|3|vd|ve|8l","👩🏾‍🎤","woman singer: medium-dark skin tone","o|3|vg|vh|8l","👩🏿‍🎤","woman singer: dark skin tone","o|3|vj|vk|8l","🧑‍🎨","artist","o|3|vm|vn|8l","🧑🏻‍🎨","artist: light skin tone","o|3|vp|vq|8l","🧑🏼‍🎨","artist: medium-light skin tone","o|3|vs|vt|8l","🧑🏽‍🎨","artist: medium skin tone","o|3|vv|vw|8l","🧑🏾‍🎨","artist: medium-dark skin tone","o|3|vy|vz|8l","🧑🏿‍🎨","artist: dark skin tone","o|3|w1|w2|8l","👨‍🎨","man artist","o|3|w4|w5|8l","👨🏻‍🎨","man artist: light skin tone","o|3|w7|w8|8l","👨🏼‍🎨","man artist: medium-light skin tone","o|3|wA|wB|8l","👨🏽‍🎨","man artist: medium skin tone","o|3|wD|wE|8l","👨🏾‍🎨","man artist: medium-dark skin tone","o|3|wG|wH|8l","👨🏿‍🎨","man artist: dark skin tone","o|3|wJ|wK|8l","👩‍🎨","woman artist","o|3|wM|wN|8l","👩🏻‍🎨","woman artist: light skin tone","o|3|wP|wQ|8l","👩🏼‍🎨","woman artist: medium-light skin tone","o|3|wS|wT|8l","👩🏽‍🎨","woman artist: medium skin tone","o|3|wV|wW|8l","👩🏾‍🎨","woman artist: medium-dark skin tone","o|3|wY|wZ|8l","👩🏿‍🎨","woman artist: dark skin tone","o|3|wb|wc|8l","🧑‍✈️","pilot","o|3|we|wf|8l","🧑‍✈","o|3|wh|wf|8l","🧑🏻‍✈️","pilot: light skin tone","o|3|wj|wk|8l","🧑🏻‍✈","o|3|wm|wk|8l","🧑🏼‍✈️","pilot: medium-light skin tone","o|3|wo|wp|8l","🧑🏼‍✈","o|3|wr|wp|8l","🧑🏽‍✈️","pilot: medium skin tone","o|3|wt|wu|8l","🧑🏽‍✈","o|3|ww|wu|8l","🧑🏾‍✈️","pilot: medium-dark skin tone","o|3|wy|wz|8l","🧑🏾‍✈","o|3|x1|wz|8l","🧑🏿‍✈️","pilot: dark skin tone","o|3|x3|x4|8l","🧑🏿‍✈","o|3|x6|x4|8l","👨‍✈️","man pilot","o|3|x8|x9|8l","👨‍✈","o|3|xB|x9|8l","👨🏻‍✈️","man pilot: light skin tone","o|3|xD|xE|8l","👨🏻‍✈","o|3|xG|xE|8l","👨🏼‍✈️","man pilot: medium-light skin tone","o|3|xI|xJ|8l","👨🏼‍✈","o|3|xL|xJ|8l","👨🏽‍✈️","man pilot: medium skin tone","o|3|xN|xO|8l","👨🏽‍✈","o|3|xQ|xO|8l","👨🏾‍✈️","man pilot: medium-dark skin tone","o|3|xS|xT|8l","👨🏾‍✈","o|3|xV|xT|8l","👨🏿‍✈️","man pilot: dark skin tone","o|3|xX|xY|8l","👨🏿‍✈","o|3|xa|xY|8l","👩‍✈️","woman pilot","o|3|xc|xd|8l","👩‍✈","o|3|xf|xd|8l","👩🏻‍✈️","woman pilot: light skin tone","o|3|xh|xi|8l","👩🏻‍✈","o|3|xk|xi|8l","👩🏼‍✈️","woman pilot: medium-light skin tone","o|3|xm|xn|8l","👩🏼‍✈","o|3|xp|xn|8l","👩🏽‍✈️","woman pilot: medium skin tone","o|3|xr|xs|8l","👩🏽‍✈","o|3|xu|xs|8l","👩🏾‍✈️","woman pilot: medium-dark skin tone","o|3|xw|xx|8l","👩🏾‍✈","o|3|xz|xx|8l","👩🏿‍✈️","woman pilot: dark skin tone","o|3|y1|y2|8l","👩🏿‍✈","o|3|y4|y2|8l","🧑‍🚀","astronaut","o|3|y6|y7|8l","🧑🏻‍🚀","astronaut: light skin tone","o|3|y9|yA|8l","🧑🏼‍🚀","astronaut: medium-light skin tone","o|3|yC|yD|8l","🧑🏽‍🚀","astronaut: medium skin tone","o|3|yF|yG|8l","🧑🏾‍🚀","astronaut: medium-dark skin tone","o|3|yI|yJ|8l","🧑🏿‍🚀","astronaut: dark skin tone","o|3|yL|yM|8l","👨‍🚀","man astronaut","o|3|yO|yP|8l","👨🏻‍🚀","man astronaut: light skin tone","o|3|yR|yS|8l","👨🏼‍🚀","man astronaut: medium-light skin tone","o|3|yU|yV|8l","👨🏽‍🚀","man astronaut: medium skin tone","o|3|yX|yY|8l","👨🏾‍🚀","man astronaut: medium-dark skin tone","o|3|ya|yb|8l","👨🏿‍🚀","man astronaut: dark skin tone","o|3|yd|ye|8l","👩‍🚀","woman astronaut","o|3|yg|yh|8l","👩🏻‍🚀","woman astronaut: light skin tone","o|3|yj|yk|8l","👩🏼‍🚀","woman astronaut: medium-light skin tone","o|3|ym|yn|8l","👩🏽‍🚀","woman astronaut: medium skin tone","o|3|yp|yq|8l","👩🏾‍🚀","woman astronaut: medium-dark skin tone","o|3|ys|yt|8l","👩🏿‍🚀","woman astronaut: dark skin tone","o|3|yv|yw|8l","🧑‍🚒","firefighter","o|3|yy|yz|8l","🧑🏻‍🚒","firefighter: light skin tone","o|3|z1|z2|8l","🧑🏼‍🚒","firefighter: medium-light skin tone","o|3|z4|z5|8l","🧑🏽‍🚒","firefighter: medium skin tone","o|3|z7|z8|8l","🧑🏾‍🚒","firefighter: medium-dark skin tone","o|3|zA|zB|8l","🧑🏿‍🚒","firefighter: dark skin tone","o|3|zD|zE|8l","👨‍🚒","man firefighter","o|3|zG|zH|8l","👨🏻‍🚒","man firefighter: light skin tone","o|3|zJ|zK|8l","👨🏼‍🚒","man firefighter: medium-light skin tone","o|3|zM|zN|8l","👨🏽‍🚒","man firefighter: medium skin tone","o|3|zP|zQ|8l","👨🏾‍🚒","man firefighter: medium-dark skin tone","o|3|zS|zT|8l","👨🏿‍🚒","man firefighter: dark skin tone","o|3|zV|zW|8l","👩‍🚒","woman firefighter","o|3|zY|zZ|8l","👩🏻‍🚒","woman firefighter: light skin tone","o|3|zb|zc|8l","👩🏼‍🚒","woman firefighter: medium-light skin tone","o|3|ze|zf|8l","👩🏽‍🚒","woman firefighter: medium skin tone","o|3|zh|zi|8l","👩🏾‍🚒","woman firefighter: medium-dark skin tone","o|3|zk|zl|8l","👩🏿‍🚒","woman firefighter: dark skin tone","o|3|zn|zo|8l","👮","police officer","o|3|zq|zr|8l","👮🏻","police officer: light skin tone","o|3|zt|zu|8l","👮🏼","police officer: medium-light skin tone","o|3|zw|zx|8l","👮🏽","police officer: medium skin tone","o|3|zz|100|8l","👮🏾","police officer: medium-dark skin tone","o|3|102|103|8l","👮🏿","police officer: dark skin tone","o|3|105|106|8l","👮‍♂️","man police officer","o|3|108|109|8l","👮‍♂","o|3|10B|109|8l","👮🏻‍♂️","man police officer: light skin tone","o|3|10D|10E|8l","👮🏻‍♂","o|3|10G|10E|8l","👮🏼‍♂️","man police officer: medium-light skin tone","o|3|10I|10J|8l","👮🏼‍♂","o|3|10L|10J|8l","👮🏽‍♂️","man police officer: medium skin tone","o|3|10N|10O|8l","👮🏽‍♂","o|3|10Q|10O|8l","👮🏾‍♂️","man police officer: medium-dark skin tone","o|3|10S|10T|8l","👮🏾‍♂","o|3|10V|10T|8l","👮🏿‍♂️","man police officer: dark skin tone","o|3|10X|10Y|8l","👮🏿‍♂","o|3|10a|10Y|8l","👮‍♀️","woman police officer","o|3|10c|10d|8l","👮‍♀","o|3|10f|10d|8l","👮🏻‍♀️","woman police officer: light skin tone","o|3|10h|10i|8l","👮🏻‍♀","o|3|10k|10i|8l","👮🏼‍♀️","woman police officer: medium-light skin tone","o|3|10m|10n|8l","👮🏼‍♀","o|3|10p|10n|8l","👮🏽‍♀️","woman police officer: medium skin tone","o|3|10r|10s|8l","👮🏽‍♀","o|3|10u|10s|8l","👮🏾‍♀️","woman police officer: medium-dark skin tone","o|3|10w|10x|8l","👮🏾‍♀","o|3|10z|10x|8l","👮🏿‍♀️","woman police officer: dark skin tone","o|3|111|112|8l","👮🏿‍♀","o|3|114|112|8l","🕵️","detective","o|3|116|117|8l","🕵","o|3|119|117|8l","🕵🏻","detective: light skin tone","o|3|11B|11C|8l","🕵🏼","detective: medium-light skin tone","o|3|11E|11F|8l","🕵🏽","detective: medium skin tone","o|3|11H|11I|8l","🕵🏾","detective: medium-dark skin tone","o|3|11K|11L|8l","🕵🏿","detective: dark skin tone","o|3|11N|11O|8l","🕵️‍♂️","man detective","o|3|11Q|11R|8l","🕵‍♂️","o|3|11T|11R|8l","🕵️‍♂","o|3|11V|11R|8l","🕵‍♂","o|3|11X|11R|8l","🕵🏻‍♂️","man detective: light skin tone","o|3|11Z|11a|8l","🕵🏻‍♂","o|3|11c|11a|8l","🕵🏼‍♂️","man detective: medium-light skin tone","o|3|11e|11f|8l","🕵🏼‍♂","o|3|11h|11f|8l","🕵🏽‍♂️","man detective: medium skin tone","o|3|11j|11k|8l","🕵🏽‍♂","o|3|11m|11k|8l","🕵🏾‍♂️","man detective: medium-dark skin tone","o|3|11o|11p|8l","🕵🏾‍♂","o|3|11r|11p|8l","🕵🏿‍♂️","man detective: dark skin tone","o|3|11t|11u|8l","🕵🏿‍♂","o|3|11w|11u|8l","🕵️‍♀️","woman detective","o|3|11y|11z|8l","🕵‍♀️","o|3|121|11z|8l","🕵️‍♀","o|3|123|11z|8l","🕵‍♀","o|3|125|11z|8l","🕵🏻‍♀️","woman detective: light skin tone","o|3|127|128|8l","🕵🏻‍♀","o|3|12A|128|8l","🕵🏼‍♀️","woman detective: medium-light skin tone","o|3|12C|12D|8l","🕵🏼‍♀","o|3|12F|12D|8l","🕵🏽‍♀️","woman detective: medium skin tone","o|3|12H|12I|8l","🕵🏽‍♀","o|3|12K|12I|8l","🕵🏾‍♀️","woman detective: medium-dark skin tone","o|3|12M|12N|8l","🕵🏾‍♀","o|3|12P|12N|8l","🕵🏿‍♀️","woman detective: dark skin tone","o|3|12R|12S|8l","🕵🏿‍♀","o|3|12U|12S|8l","💂","guard","o|3|12W|12X|8l","💂🏻","guard: light skin tone","o|3|12Z|12a|8l","💂🏼","guard: medium-light skin tone","o|3|12c|12d|8l","💂🏽","guard: medium skin tone","o|3|12f|12g|8l","💂🏾","guard: medium-dark skin tone","o|3|12i|12j|8l","💂🏿","guard: dark skin tone","o|3|12l|12m|8l","💂‍♂️","man guard","o|3|12o|12p|8l","💂‍♂","o|3|12r|12p|8l","💂🏻‍♂️","man guard: light skin tone","o|3|12t|12u|8l","💂🏻‍♂","o|3|12w|12u|8l","💂🏼‍♂️","man guard: medium-light skin tone","o|3|12y|12z|8l","💂🏼‍♂","o|3|131|12z|8l","💂🏽‍♂️","man guard: medium skin tone","o|3|133|134|8l","💂🏽‍♂","o|3|136|134|8l","💂🏾‍♂️","man guard: medium-dark skin tone","o|3|138|139|8l","💂🏾‍♂","o|3|13B|139|8l","💂🏿‍♂️","man guard: dark skin tone","o|3|13D|13E|8l","💂🏿‍♂","o|3|13G|13E|8l","💂‍♀️","woman guard","o|3|13I|13J|8l","💂‍♀","o|3|13L|13J|8l","💂🏻‍♀️","woman guard: light skin tone","o|3|13N|13O|8l","💂🏻‍♀","o|3|13Q|13O|8l","💂🏼‍♀️","woman guard: medium-light skin tone","o|3|13S|13T|8l","💂🏼‍♀","o|3|13V|13T|8l","💂🏽‍♀️","woman guard: medium skin tone","o|3|13X|13Y|8l","💂🏽‍♀","o|3|13a|13Y|8l","💂🏾‍♀️","woman guard: medium-dark skin tone","o|3|13c|13d|8l","💂🏾‍♀","o|3|13f|13d|8l","💂🏿‍♀️","woman guard: dark skin tone","o|3|13h|13i|8l","💂🏿‍♀","o|3|13k|13i|8l","🥷","ninja","o|3|13m|13n|8l","🥷🏻","ninja: light skin tone","o|3|13p|13q|8l","🥷🏼","ninja: medium-light skin tone","o|3|13s|13t|8l","🥷🏽","ninja: medium skin tone","o|3|13v|13w|8l","🥷🏾","ninja: medium-dark skin tone","o|3|13y|13z|8l","🥷🏿","ninja: dark skin tone","o|3|141|142|8l","👷","construction worker","o|3|144|145|8l","👷🏻","construction worker: light skin tone","o|3|147|148|8l","👷🏼","construction worker: medium-light skin tone","o|3|14A|14B|8l","👷🏽","construction worker: medium skin tone","o|3|14D|14E|8l","👷🏾","construction worker: medium-dark skin tone","o|3|14G|14H|8l","👷🏿","construction worker: dark skin tone","o|3|14J|14K|8l","👷‍♂️","man construction worker","o|3|14M|14N|8l","👷‍♂","o|3|14P|14N|8l","👷🏻‍♂️","man construction worker: light skin tone","o|3|14R|14S|8l","👷🏻‍♂","o|3|14U|14S|8l","👷🏼‍♂️","man construction worker: medium-light skin tone","o|3|14W|14X|8l","👷🏼‍♂","o|3|14Z|14X|8l","👷🏽‍♂️","man construction worker: medium skin tone","o|3|14b|14c|8l","👷🏽‍♂","o|3|14e|14c|8l","👷🏾‍♂️","man construction worker: medium-dark skin tone","o|3|14g|14h|8l","👷🏾‍♂","o|3|14j|14h|8l","👷🏿‍♂️","man construction worker: dark skin tone","o|3|14l|14m|8l","👷🏿‍♂","o|3|14o|14m|8l","👷‍♀️","woman construction worker","o|3|14q|14r|8l","👷‍♀","o|3|14t|14r|8l","👷🏻‍♀️","woman construction worker: light skin tone","o|3|14v|14w|8l","👷🏻‍♀","o|3|14y|14w|8l","👷🏼‍♀️","woman construction worker: medium-light skin tone","o|3|150|151|8l","👷🏼‍♀","o|3|153|151|8l","👷🏽‍♀️","woman construction worker: medium skin tone","o|3|155|156|8l","👷🏽‍♀","o|3|158|156|8l","👷🏾‍♀️","woman construction worker: medium-dark skin tone","o|3|15A|15B|8l","👷🏾‍♀","o|3|15D|15B|8l","👷🏿‍♀️","woman construction worker: dark skin tone","o|3|15F|15G|8l","👷🏿‍♀","o|3|15I|15G|8l","🫅","person with crown","o|3|15K|15L|8l","🫅🏻","person with crown: light skin tone","o|3|15N|15O|8l","🫅🏼","person with crown: medium-light skin tone","o|3|15Q|15R|8l","🫅🏽","person with crown: medium skin tone","o|3|15T|15U|8l","🫅🏾","person with crown: medium-dark skin tone","o|3|15W|15X|8l","🫅🏿","person with crown: dark skin tone","o|3|15Z|15a|8l","🤴","prince","o|3|15c|15d|8l","🤴🏻","prince: light skin tone","o|3|15f|15g|8l","🤴🏼","prince: medium-light skin tone","o|3|15i|15j|8l","🤴🏽","prince: medium skin tone","o|3|15l|15m|8l","🤴🏾","prince: medium-dark skin tone","o|3|15o|15p|8l","🤴🏿","prince: dark skin tone","o|3|15r|15s|8l","👸","princess","o|3|15u|15v|8l","👸🏻","princess: light skin tone","o|3|15x|15y|8l","👸🏼","princess: medium-light skin tone","o|3|160|161|8l","👸🏽","princess: medium skin tone","o|3|163|164|8l","👸🏾","princess: medium-dark skin tone","o|3|166|167|8l","👸🏿","princess: dark skin tone","o|3|169|16A|8l","👳","person wearing turban","o|3|16C|16D|8l","👳🏻","person wearing turban: light skin tone","o|3|16F|16G|8l","👳🏼","person wearing turban: medium-light skin tone","o|3|16I|16J|8l","👳🏽","person wearing turban: medium skin tone","o|3|16L|16M|8l","👳🏾","person wearing turban: medium-dark skin tone","o|3|16O|16P|8l","👳🏿","person wearing turban: dark skin tone","o|3|16R|16S|8l","👳‍♂️","man wearing turban","o|3|16U|16V|8l","👳‍♂","o|3|16X|16V|8l","👳🏻‍♂️","man wearing turban: light skin tone","o|3|16Z|16a|8l","👳🏻‍♂","o|3|16c|16a|8l","👳🏼‍♂️","man wearing turban: medium-light skin tone","o|3|16e|16f|8l","👳🏼‍♂","o|3|16h|16f|8l","👳🏽‍♂️","man wearing turban: medium skin tone","o|3|16j|16k|8l","👳🏽‍♂","o|3|16m|16k|8l","👳🏾‍♂️","man wearing turban: medium-dark skin tone","o|3|16o|16p|8l","👳🏾‍♂","o|3|16r|16p|8l","👳🏿‍♂️","man wearing turban: dark skin tone","o|3|16t|16u|8l","👳🏿‍♂","o|3|16w|16u|8l","👳‍♀️","woman wearing turban","o|3|16y|16z|8l","👳‍♀","o|3|171|16z|8l","👳🏻‍♀️","woman wearing turban: light skin tone","o|3|173|174|8l","👳🏻‍♀","o|3|176|174|8l","👳🏼‍♀️","woman wearing turban: medium-light skin tone","o|3|178|179|8l","👳🏼‍♀","o|3|17B|179|8l","👳🏽‍♀️","woman wearing turban: medium skin tone","o|3|17D|17E|8l","👳🏽‍♀","o|3|17G|17E|8l","👳🏾‍♀️","woman wearing turban: medium-dark skin tone","o|3|17I|17J|8l","👳🏾‍♀","o|3|17L|17J|8l","👳🏿‍♀️","woman wearing turban: dark skin tone","o|3|17N|17O|8l","👳🏿‍♀","o|3|17Q|17O|8l","👲","person with skullcap","o|3|17S|17T|8l","👲🏻","person with skullcap: light skin tone","o|3|17V|17W|8l","👲🏼","person with skullcap: medium-light skin tone","o|3|17Y|17Z|8l","👲🏽","person with skullcap: medium skin tone","o|3|17b|17c|8l","👲🏾","person with skullcap: medium-dark skin tone","o|3|17e|17f|8l","👲🏿","person with skullcap: dark skin tone","o|3|17h|17i|8l","🧕","woman with headscarf","o|3|17k|17l|8l","🧕🏻","woman with headscarf: light skin tone","o|3|17n|17o|8l","🧕🏼","woman with headscarf: medium-light skin tone","o|3|17q|17r|8l","🧕🏽","woman with headscarf: medium skin tone","o|3|17t|17u|8l","🧕🏾","woman with headscarf: medium-dark skin tone","o|3|17w|17x|8l","🧕🏿","woman with headscarf: dark skin tone","o|3|17z|180|8l","🤵","person in tuxedo","o|3|182|183|8l","🤵🏻","person in tuxedo: light skin tone","o|3|185|186|8l","🤵🏼","person in tuxedo: medium-light skin tone","o|3|188|189|8l","🤵🏽","person in tuxedo: medium skin tone","o|3|18B|18C|8l","🤵🏾","person in tuxedo: medium-dark skin tone","o|3|18E|18F|8l","🤵🏿","person in tuxedo: dark skin tone","o|3|18H|18I|8l","🤵‍♂️","man in tuxedo","o|3|18K|18L|8l","🤵‍♂","o|3|18N|18L|8l","🤵🏻‍♂️","man in tuxedo: light skin tone","o|3|18P|18Q|8l","🤵🏻‍♂","o|3|18S|18Q|8l","🤵🏼‍♂️","man in tuxedo: medium-light skin tone","o|3|18U|18V|8l","🤵🏼‍♂","o|3|18X|18V|8l","🤵🏽‍♂️","man in tuxedo: medium skin tone","o|3|18Z|18a|8l","🤵🏽‍♂","o|3|18c|18a|8l","🤵🏾‍♂️","man in tuxedo: medium-dark skin tone","o|3|18e|18f|8l","🤵🏾‍♂","o|3|18h|18f|8l","🤵🏿‍♂️","man in tuxedo: dark skin tone","o|3|18j|18k|8l","🤵🏿‍♂","o|3|18m|18k|8l","🤵‍♀️","woman in tuxedo","o|3|18o|18p|8l","🤵‍♀","o|3|18r|18p|8l","🤵🏻‍♀️","woman in tuxedo: light skin tone","o|3|18t|18u|8l","🤵🏻‍♀","o|3|18w|18u|8l","🤵🏼‍♀️","woman in tuxedo: medium-light skin tone","o|3|18y|18z|8l","🤵🏼‍♀","o|3|191|18z|8l","🤵🏽‍♀️","woman in tuxedo: medium skin tone","o|3|193|194|8l","🤵🏽‍♀","o|3|196|194|8l","🤵🏾‍♀️","woman in tuxedo: medium-dark skin tone","o|3|198|199|8l","🤵🏾‍♀","o|3|19B|199|8l","🤵🏿‍♀️","woman in tuxedo: dark skin tone","o|3|19D|19E|8l","🤵🏿‍♀","o|3|19G|19E|8l","👰","person with veil","o|3|19I|19J|8l","👰🏻","person with veil: light skin tone","o|3|19L|19M|8l","👰🏼","person with veil: medium-light skin tone","o|3|19O|19P|8l","👰🏽","person with veil: medium skin tone","o|3|19R|19S|8l","👰🏾","person with veil: medium-dark skin tone","o|3|19U|19V|8l","👰🏿","person with veil: dark skin tone","o|3|19X|19Y|8l","👰‍♂️","man with veil","o|3|19a|19b|8l","👰‍♂","o|3|19d|19b|8l","👰🏻‍♂️","man with veil: light skin tone","o|3|19f|19g|8l","👰🏻‍♂","o|3|19i|19g|8l","👰🏼‍♂️","man with veil: medium-light skin tone","o|3|19k|19l|8l","👰🏼‍♂","o|3|19n|19l|8l","👰🏽‍♂️","man with veil: medium skin tone","o|3|19p|19q|8l","👰🏽‍♂","o|3|19s|19q|8l","👰🏾‍♂️","man with veil: medium-dark skin tone","o|3|19u|19v|8l","👰🏾‍♂","o|3|19x|19v|8l","👰🏿‍♂️","man with veil: dark skin tone","o|3|19z|1A0|8l","👰🏿‍♂","o|3|1A2|1A0|8l","👰‍♀️","woman with veil","o|3|1A4|1A5|8l","👰‍♀","o|3|1A7|1A5|8l","👰🏻‍♀️","woman with veil: light skin tone","o|3|1A9|1AA|8l","👰🏻‍♀","o|3|1AC|1AA|8l","👰🏼‍♀️","woman with veil: medium-light skin tone","o|3|1AE|1AF|8l","👰🏼‍♀","o|3|1AH|1AF|8l","👰🏽‍♀️","woman with veil: medium skin tone","o|3|1AJ|1AK|8l","👰🏽‍♀","o|3|1AM|1AK|8l","👰🏾‍♀️","woman with veil: medium-dark skin tone","o|3|1AO|1AP|8l","👰🏾‍♀","o|3|1AR|1AP|8l","👰🏿‍♀️","woman with veil: dark skin tone","o|3|1AT|1AU|8l","👰🏿‍♀","o|3|1AW|1AU|8l","🤰","pregnant woman","o|3|1AY|1AZ|8l","🤰🏻","pregnant woman: light skin tone","o|3|1Ab|1Ac|8l","🤰🏼","pregnant woman: medium-light skin tone","o|3|1Ae|1Af|8l","🤰🏽","pregnant woman: medium skin tone","o|3|1Ah|1Ai|8l","🤰🏾","pregnant woman: medium-dark skin tone","o|3|1Ak|1Al|8l","🤰🏿","pregnant woman: dark skin tone","o|3|1An|1Ao|8l","🫃","pregnant man","o|3|1Aq|1Ar|8l","🫃🏻","pregnant man: light skin tone","o|3|1At|1Au|8l","🫃🏼","pregnant man: medium-light skin tone","o|3|1Aw|1Ax|8l","🫃🏽","pregnant man: medium skin tone","o|3|1Az|1B0|8l","🫃🏾","pregnant man: medium-dark skin tone","o|3|1B2|1B3|8l","🫃🏿","pregnant man: dark skin tone","o|3|1B5|1B6|8l","🫄","pregnant person","o|3|1B8|1B9|8l","🫄🏻","pregnant person: light skin tone","o|3|1BB|1BC|8l","🫄🏼","pregnant person: medium-light skin tone","o|3|1BE|1BF|8l","🫄🏽","pregnant person: medium skin tone","o|3|1BH|1BI|8l","🫄🏾","pregnant person: medium-dark skin tone","o|3|1BK|1BL|8l","🫄🏿","pregnant person: dark skin tone","o|3|1BN|1BO|8l","🤱","breast-feeding","o|3|1BQ|1BR|8l","🤱🏻","breast-feeding: light skin tone","o|3|1BT|1BU|8l","🤱🏼","breast-feeding: medium-light skin tone","o|3|1BW|1BX|8l","🤱🏽","breast-feeding: medium skin tone","o|3|1BZ|1Ba|8l","🤱🏾","breast-feeding: medium-dark skin tone","o|3|1Bc|1Bd|8l","🤱🏿","breast-feeding: dark skin tone","o|3|1Bf|1Bg|8l","👩‍🍼","woman feeding baby","o|3|1Bi|1Bj|8l","👩🏻‍🍼","woman feeding baby: light skin tone","o|3|1Bl|1Bm|8l","👩🏼‍🍼","woman feeding baby: medium-light skin tone","o|3|1Bo|1Bp|8l","👩🏽‍🍼","woman feeding baby: medium skin tone","o|3|1Br|1Bs|8l","👩🏾‍🍼","woman feeding baby: medium-dark skin tone","o|3|1Bu|1Bv|8l","👩🏿‍🍼","woman feeding baby: dark skin tone","o|3|1Bx|1By|8l","👨‍🍼","man feeding baby","o|3|1C0|1C1|8l","👨🏻‍🍼","man feeding baby: light skin tone","o|3|1C3|1C4|8l","👨🏼‍🍼","man feeding baby: medium-light skin tone","o|3|1C6|1C7|8l","👨🏽‍🍼","man feeding baby: medium skin tone","o|3|1C9|1CA|8l","👨🏾‍🍼","man feeding baby: medium-dark skin tone","o|3|1CC|1CD|8l","👨🏿‍🍼","man feeding baby: dark skin tone","o|3|1CF|1CG|8l","🧑‍🍼","person feeding baby","o|3|1CI|1CJ|8l","🧑🏻‍🍼","person feeding baby: light skin tone","o|3|1CL|1CM|8l","🧑🏼‍🍼","person feeding baby: medium-light skin tone","o|3|1CO|1CP|8l","🧑🏽‍🍼","person feeding baby: medium skin tone","o|3|1CR|1CS|8l","🧑🏾‍🍼","person feeding baby: medium-dark skin tone","o|3|1CU|1CV|8l","🧑🏿‍🍼","person feeding baby: dark skin tone","o|3|1CX|1CY|8l","👼","baby angel","o|3|1Ca|1Cb|8l","👼🏻","baby angel: light skin tone","o|3|1Cd|1Ce|8l","👼🏼","baby angel: medium-light skin tone","o|3|1Cg|1Ch|8l","👼🏽","baby angel: medium skin tone","o|3|1Cj|1Ck|8l","👼🏾","baby angel: medium-dark skin tone","o|3|1Cm|1Cn|8l","👼🏿","baby angel: dark skin tone","o|3|1Cp|1Cq|8l","🎅","Santa Claus","o|3|1Cs|1Ct|8l","🎅🏻","Santa Claus: light skin tone","o|3|1Cv|1Cw|8l","🎅🏼","Santa Claus: medium-light skin tone","o|3|1Cy|1Cz|8l","🎅🏽","Santa Claus: medium skin tone","o|3|1D1|1D2|8l","🎅🏾","Santa Claus: medium-dark skin tone","o|3|1D4|1D5|8l","🎅🏿","Santa Claus: dark skin tone","o|3|1D7|1D8|8l","🤶","Mrs. Claus","o|3|1DA|1DB|8l","🤶🏻","Mrs. Claus: light skin tone","o|3|1DD|1DE|8l","🤶🏼","Mrs. Claus: medium-light skin tone","o|3|1DG|1DH|8l","🤶🏽","Mrs. Claus: medium skin tone","o|3|1DJ|1DK|8l","🤶🏾","Mrs. Claus: medium-dark skin tone","o|3|1DM|1DN|8l","🤶🏿","Mrs. Claus: dark skin tone","o|3|1DP|1DQ|8l","🧑‍🎄","mx claus","o|3|1DS|1DT|8l","🧑🏻‍🎄","mx claus: light skin tone","o|3|1DV|1DW|8l","🧑🏼‍🎄","mx claus: medium-light skin tone","o|3|1DY|1DZ|8l","🧑🏽‍🎄","mx claus: medium skin tone","o|3|1Db|1Dc|8l","🧑🏾‍🎄","mx claus: medium-dark skin tone","o|3|1De|1Df|8l","🧑🏿‍🎄","mx claus: dark skin tone","o|3|1Dh|1Di|8l","🦸","superhero","o|3|1Dk|1Dl|8l","🦸🏻","superhero: light skin tone","o|3|1Dn|1Do|8l","🦸🏼","superhero: medium-light skin tone","o|3|1Dq|1Dr|8l","🦸🏽","superhero: medium skin tone","o|3|1Dt|1Du|8l","🦸🏾","superhero: medium-dark skin tone","o|3|1Dw|1Dx|8l","🦸🏿","superhero: dark skin tone","o|3|1Dz|1E0|8l","🦸‍♂️","man superhero","o|3|1E2|1E3|8l","🦸‍♂","o|3|1E5|1E3|8l","🦸🏻‍♂️","man superhero: light skin tone","o|3|1E7|1E8|8l","🦸🏻‍♂","o|3|1EA|1E8|8l","🦸🏼‍♂️","man superhero: medium-light skin tone","o|3|1EC|1ED|8l","🦸🏼‍♂","o|3|1EF|1ED|8l","🦸🏽‍♂️","man superhero: medium skin tone","o|3|1EH|1EI|8l","🦸🏽‍♂","o|3|1EK|1EI|8l","🦸🏾‍♂️","man superhero: medium-dark skin tone","o|3|1EM|1EN|8l","🦸🏾‍♂","o|3|1EP|1EN|8l","🦸🏿‍♂️","man superhero: dark skin tone","o|3|1ER|1ES|8l","🦸🏿‍♂","o|3|1EU|1ES|8l","🦸‍♀️","woman superhero","o|3|1EW|1EX|8l","🦸‍♀","o|3|1EZ|1EX|8l","🦸🏻‍♀️","woman superhero: light skin tone","o|3|1Eb|1Ec|8l","🦸🏻‍♀","o|3|1Ee|1Ec|8l","🦸🏼‍♀️","woman superhero: medium-light skin tone","o|3|1Eg|1Eh|8l","🦸🏼‍♀","o|3|1Ej|1Eh|8l","🦸🏽‍♀️","woman superhero: medium skin tone","o|3|1El|1Em|8l","🦸🏽‍♀","o|3|1Eo|1Em|8l","🦸🏾‍♀️","woman superhero: medium-dark skin tone","o|3|1Eq|1Er|8l","🦸🏾‍♀","o|3|1Et|1Er|8l","🦸🏿‍♀️","woman superhero: dark skin tone","o|3|1Ev|1Ew|8l","🦸🏿‍♀","o|3|1Ey|1Ew|8l","🦹","supervillain","o|3|1F0|1F1|8l","🦹🏻","supervillain: light skin tone","o|3|1F3|1F4|8l","🦹🏼","supervillain: medium-light skin tone","o|3|1F6|1F7|8l","🦹🏽","supervillain: medium skin tone","o|3|1F9|1FA|8l","🦹🏾","supervillain: medium-dark skin tone","o|3|1FC|1FD|8l","🦹🏿","supervillain: dark skin tone","o|3|1FF|1FG|8l","🦹‍♂️","man supervillain","o|3|1FI|1FJ|8l","🦹‍♂","o|3|1FL|1FJ|8l","🦹🏻‍♂️","man supervillain: light skin tone","o|3|1FN|1FO|8l","🦹🏻‍♂","o|3|1FQ|1FO|8l","🦹🏼‍♂️","man supervillain: medium-light skin tone","o|3|1FS|1FT|8l","🦹🏼‍♂","o|3|1FV|1FT|8l","🦹🏽‍♂️","man supervillain: medium skin tone","o|3|1FX|1FY|8l","🦹🏽‍♂","o|3|1Fa|1FY|8l","🦹🏾‍♂️","man supervillain: medium-dark skin tone","o|3|1Fc|1Fd|8l","🦹🏾‍♂","o|3|1Ff|1Fd|8l","🦹🏿‍♂️","man supervillain: dark skin tone","o|3|1Fh|1Fi|8l","🦹🏿‍♂","o|3|1Fk|1Fi|8l","🦹‍♀️","woman supervillain","o|3|1Fm|1Fn|8l","🦹‍♀","o|3|1Fp|1Fn|8l","🦹🏻‍♀️","woman supervillain: light skin tone","o|3|1Fr|1Fs|8l","🦹🏻‍♀","o|3|1Fu|1Fs|8l","🦹🏼‍♀️","woman supervillain: medium-light skin tone","o|3|1Fw|1Fx|8l","🦹🏼‍♀","o|3|1Fz|1Fx|8l","🦹🏽‍♀️","woman supervillain: medium skin tone","o|3|1G1|1G2|8l","🦹🏽‍♀","o|3|1G4|1G2|8l","🦹🏾‍♀️","woman supervillain: medium-dark skin tone","o|3|1G6|1G7|8l","🦹🏾‍♀","o|3|1G9|1G7|8l","🦹🏿‍♀️","woman supervillain: dark skin tone","o|3|1GB|1GC|8l","🦹🏿‍♀","o|3|1GE|1GC|8l","🧙","mage","o|3|1GG|1GH|8l","🧙🏻","mage: light skin tone","o|3|1GJ|1GK|8l","🧙🏼","mage: medium-light skin tone","o|3|1GM|1GN|8l","🧙🏽","mage: medium skin tone","o|3|1GP|1GQ|8l","🧙🏾","mage: medium-dark skin tone","o|3|1GS|1GT|8l","🧙🏿","mage: dark skin tone","o|3|1GV|1GW|8l","🧙‍♂️","man mage","o|3|1GY|1GZ|8l","🧙‍♂","o|3|1Gb|1GZ|8l","🧙🏻‍♂️","man mage: light skin tone","o|3|1Gd|1Ge|8l","🧙🏻‍♂","o|3|1Gg|1Ge|8l","🧙🏼‍♂️","man mage: medium-light skin tone","o|3|1Gi|1Gj|8l","🧙🏼‍♂","o|3|1Gl|1Gj|8l","🧙🏽‍♂️","man mage: medium skin tone","o|3|1Gn|1Go|8l","🧙🏽‍♂","o|3|1Gq|1Go|8l","🧙🏾‍♂️","man mage: medium-dark skin tone","o|3|1Gs|1Gt|8l","🧙🏾‍♂","o|3|1Gv|1Gt|8l","🧙🏿‍♂️","man mage: dark skin tone","o|3|1Gx|1Gy|8l","🧙🏿‍♂","o|3|1H0|1Gy|8l","🧙‍♀️","woman mage","o|3|1H2|1H3|8l","🧙‍♀","o|3|1H5|1H3|8l","🧙🏻‍♀️","woman mage: light skin tone","o|3|1H7|1H8|8l","🧙🏻‍♀","o|3|1HA|1H8|8l","🧙🏼‍♀️","woman mage: medium-light skin tone","o|3|1HC|1HD|8l","🧙🏼‍♀","o|3|1HF|1HD|8l","🧙🏽‍♀️","woman mage: medium skin tone","o|3|1HH|1HI|8l","🧙🏽‍♀","o|3|1HK|1HI|8l","🧙🏾‍♀️","woman mage: medium-dark skin tone","o|3|1HM|1HN|8l","🧙🏾‍♀","o|3|1HP|1HN|8l","🧙🏿‍♀️","woman mage: dark skin tone","o|3|1HR|1HS|8l","🧙🏿‍♀","o|3|1HU|1HS|8l","🧚","fairy","o|3|1HW|1HX|8l","🧚🏻","fairy: light skin tone","o|3|1HZ|1Ha|8l","🧚🏼","fairy: medium-light skin tone","o|3|1Hc|1Hd|8l","🧚🏽","fairy: medium skin tone","o|3|1Hf|1Hg|8l","🧚🏾","fairy: medium-dark skin tone","o|3|1Hi|1Hj|8l","🧚🏿","fairy: dark skin tone","o|3|1Hl|1Hm|8l","🧚‍♂️","man fairy","o|3|1Ho|1Hp|8l","🧚‍♂","o|3|1Hr|1Hp|8l","🧚🏻‍♂️","man fairy: light skin tone","o|3|1Ht|1Hu|8l","🧚🏻‍♂","o|3|1Hw|1Hu|8l","🧚🏼‍♂️","man fairy: medium-light skin tone","o|3|1Hy|1Hz|8l","🧚🏼‍♂","o|3|1I1|1Hz|8l","🧚🏽‍♂️","man fairy: medium skin tone","o|3|1I3|1I4|8l","🧚🏽‍♂","o|3|1I6|1I4|8l","🧚🏾‍♂️","man fairy: medium-dark skin tone","o|3|1I8|1I9|8l","🧚🏾‍♂","o|3|1IB|1I9|8l","🧚🏿‍♂️","man fairy: dark skin tone","o|3|1ID|1IE|8l","🧚🏿‍♂","o|3|1IG|1IE|8l","🧚‍♀️","woman fairy","o|3|1II|1IJ|8l","🧚‍♀","o|3|1IL|1IJ|8l","🧚🏻‍♀️","woman fairy: light skin tone","o|3|1IN|1IO|8l","🧚🏻‍♀","o|3|1IQ|1IO|8l","🧚🏼‍♀️","woman fairy: medium-light skin tone","o|3|1IS|1IT|8l","🧚🏼‍♀","o|3|1IV|1IT|8l","🧚🏽‍♀️","woman fairy: medium skin tone","o|3|1IX|1IY|8l","🧚🏽‍♀","o|3|1Ia|1IY|8l","🧚🏾‍♀️","woman fairy: medium-dark skin tone","o|3|1Ic|1Id|8l","🧚🏾‍♀","o|3|1If|1Id|8l","🧚🏿‍♀️","woman fairy: dark skin tone","o|3|1Ih|1Ii|8l","🧚🏿‍♀","o|3|1Ik|1Ii|8l","🧛","vampire","o|3|1Im|1In|8l","🧛🏻","vampire: light skin tone","o|3|1Ip|1Iq|8l","🧛🏼","vampire: medium-light skin tone","o|3|1Is|1It|8l","🧛🏽","vampire: medium skin tone","o|3|1Iv|1Iw|8l","🧛🏾","vampire: medium-dark skin tone","o|3|1Iy|1Iz|8l","🧛🏿","vampire: dark skin tone","o|3|1J1|1J2|8l","🧛‍♂️","man vampire","o|3|1J4|1J5|8l","🧛‍♂","o|3|1J7|1J5|8l","🧛🏻‍♂️","man vampire: light skin tone","o|3|1J9|1JA|8l","🧛🏻‍♂","o|3|1JC|1JA|8l","🧛🏼‍♂️","man vampire: medium-light skin tone","o|3|1JE|1JF|8l","🧛🏼‍♂","o|3|1JH|1JF|8l","🧛🏽‍♂️","man vampire: medium skin tone","o|3|1JJ|1JK|8l","🧛🏽‍♂","o|3|1JM|1JK|8l","🧛🏾‍♂️","man vampire: medium-dark skin tone","o|3|1JO|1JP|8l","🧛🏾‍♂","o|3|1JR|1JP|8l","🧛🏿‍♂️","man vampire: dark skin tone","o|3|1JT|1JU|8l","🧛🏿‍♂","o|3|1JW|1JU|8l","🧛‍♀️","woman vampire","o|3|1JY|1JZ|8l","🧛‍♀","o|3|1Jb|1JZ|8l","🧛🏻‍♀️","woman vampire: light skin tone","o|3|1Jd|1Je|8l","🧛🏻‍♀","o|3|1Jg|1Je|8l","🧛🏼‍♀️","woman vampire: medium-light skin tone","o|3|1Ji|1Jj|8l","🧛🏼‍♀","o|3|1Jl|1Jj|8l","🧛🏽‍♀️","woman vampire: medium skin tone","o|3|1Jn|1Jo|8l","🧛🏽‍♀","o|3|1Jq|1Jo|8l","🧛🏾‍♀️","woman vampire: medium-dark skin tone","o|3|1Js|1Jt|8l","🧛🏾‍♀","o|3|1Jv|1Jt|8l","🧛🏿‍♀️","woman vampire: dark skin tone","o|3|1Jx|1Jy|8l","🧛🏿‍♀","o|3|1K0|1Jy|8l","🧜","merperson","o|3|1K2|1K3|8l","🧜🏻","merperson: light skin tone","o|3|1K5|1K6|8l","🧜🏼","merperson: medium-light skin tone","o|3|1K8|1K9|8l","🧜🏽","merperson: medium skin tone","o|3|1KB|1KC|8l","🧜🏾","merperson: medium-dark skin tone","o|3|1KE|1KF|8l","🧜🏿","merperson: dark skin tone","o|3|1KH|1KI|8l","🧜‍♂️","merman","o|3|1KK|1KL|8l","🧜‍♂","o|3|1KN|1KL|8l","🧜🏻‍♂️","merman: light skin tone","o|3|1KP|1KQ|8l","🧜🏻‍♂","o|3|1KS|1KQ|8l","🧜🏼‍♂️","merman: medium-light skin tone","o|3|1KU|1KV|8l","🧜🏼‍♂","o|3|1KX|1KV|8l","🧜🏽‍♂️","merman: medium skin tone","o|3|1KZ|1Ka|8l","🧜🏽‍♂","o|3|1Kc|1Ka|8l","🧜🏾‍♂️","merman: medium-dark skin tone","o|3|1Ke|1Kf|8l","🧜🏾‍♂","o|3|1Kh|1Kf|8l","🧜🏿‍♂️","merman: dark skin tone","o|3|1Kj|1Kk|8l","🧜🏿‍♂","o|3|1Km|1Kk|8l","🧜‍♀️","mermaid","o|3|1Ko|1Kp|8l","🧜‍♀","o|3|1Kr|1Kp|8l","🧜🏻‍♀️","mermaid: light skin tone","o|3|1Kt|1Ku|8l","🧜🏻‍♀","o|3|1Kw|1Ku|8l","🧜🏼‍♀️","mermaid: medium-light skin tone","o|3|1Ky|1Kz|8l","🧜🏼‍♀","o|3|1L1|1Kz|8l","🧜🏽‍♀️","mermaid: medium skin tone","o|3|1L3|1L4|8l","🧜🏽‍♀","o|3|1L6|1L4|8l","🧜🏾‍♀️","mermaid: medium-dark skin tone","o|3|1L8|1L9|8l","🧜🏾‍♀","o|3|1LB|1L9|8l","🧜🏿‍♀️","mermaid: dark skin tone","o|3|1LD|1LE|8l","🧜🏿‍♀","o|3|1LG|1LE|8l","🧝","elf","o|3|1LI|1LJ|8l","🧝🏻","elf: light skin tone","o|3|1LL|1LM|8l","🧝🏼","elf: medium-light skin tone","o|3|1LO|1LP|8l","🧝🏽","elf: medium skin tone","o|3|1LR|1LS|8l","🧝🏾","elf: medium-dark skin tone","o|3|1LU|1LV|8l","🧝🏿","elf: dark skin tone","o|3|1LX|1LY|8l","🧝‍♂️","man elf","o|3|1La|1Lb|8l","🧝‍♂","o|3|1Ld|1Lb|8l","🧝🏻‍♂️","man elf: light skin tone","o|3|1Lf|1Lg|8l","🧝🏻‍♂","o|3|1Li|1Lg|8l","🧝🏼‍♂️","man elf: medium-light skin tone","o|3|1Lk|1Ll|8l","🧝🏼‍♂","o|3|1Ln|1Ll|8l","🧝🏽‍♂️","man elf: medium skin tone","o|3|1Lp|1Lq|8l","🧝🏽‍♂","o|3|1Ls|1Lq|8l","🧝🏾‍♂️","man elf: medium-dark skin tone","o|3|1Lu|1Lv|8l","🧝🏾‍♂","o|3|1Lx|1Lv|8l","🧝🏿‍♂️","man elf: dark skin tone","o|3|1Lz|1M0|8l","🧝🏿‍♂","o|3|1M2|1M0|8l","🧝‍♀️","woman elf","o|3|1M4|1M5|8l","🧝‍♀","o|3|1M7|1M5|8l","🧝🏻‍♀️","woman elf: light skin tone","o|3|1M9|1MA|8l","🧝🏻‍♀","o|3|1MC|1MA|8l","🧝🏼‍♀️","woman elf: medium-light skin tone","o|3|1ME|1MF|8l","🧝🏼‍♀","o|3|1MH|1MF|8l","🧝🏽‍♀️","woman elf: medium skin tone","o|3|1MJ|1MK|8l","🧝🏽‍♀","o|3|1MM|1MK|8l","🧝🏾‍♀️","woman elf: medium-dark skin tone","o|3|1MO|1MP|8l","🧝🏾‍♀","o|3|1MR|1MP|8l","🧝🏿‍♀️","woman elf: dark skin tone","o|3|1MT|1MU|8l","🧝🏿‍♀","o|3|1MW|1MU|8l","🧞","genie","o|3|1MY|1MZ|8l","🧞‍♂️","man genie","o|3|1Mb|1Mc|8l","🧞‍♂","o|3|1Me|1Mc|8l","🧞‍♀️","woman genie","o|3|1Mg|1Mh|8l","🧞‍♀","o|3|1Mj|1Mh|8l","🧟","zombie","o|3|1Ml|1Mm|8l","🧟‍♂️","man zombie","o|3|1Mo|1Mp|8l","🧟‍♂","o|3|1Mr|1Mp|8l","🧟‍♀️","woman zombie","o|3|1Mt|1Mu|8l","🧟‍♀","o|3|1Mw|1Mu|8l","🧌","troll","o|3|1My|1Mz|8l","💆","person getting massage","o|3|1N1|1N2|8l","💆🏻","person getting massage: light skin tone","o|3|1N4|1N5|8l","💆🏼","person getting massage: medium-light skin tone","o|3|1N7|1N8|8l","💆🏽","person getting massage: medium skin tone","o|3|1NA|1NB|8l","💆🏾","person getting massage: medium-dark skin tone","o|3|1ND|1NE|8l","💆🏿","person getting massage: dark skin tone","o|3|1NG|1NH|8l","💆‍♂️","man getting massage","o|3|1NJ|1NK|8l","💆‍♂","o|3|1NM|1NK|8l","💆🏻‍♂️","man getting massage: light skin tone","o|3|1NO|1NP|8l","💆🏻‍♂","o|3|1NR|1NP|8l","💆🏼‍♂️","man getting massage: medium-light skin tone","o|3|1NT|1NU|8l","💆🏼‍♂","o|3|1NW|1NU|8l","💆🏽‍♂️","man getting massage: medium skin tone","o|3|1NY|1NZ|8l","💆🏽‍♂","o|3|1Nb|1NZ|8l","💆🏾‍♂️","man getting massage: medium-dark skin tone","o|3|1Nd|1Ne|8l","💆🏾‍♂","o|3|1Ng|1Ne|8l","💆🏿‍♂️","man getting massage: dark skin tone","o|3|1Ni|1Nj|8l","💆🏿‍♂","o|3|1Nl|1Nj|8l","💆‍♀️","woman getting massage","o|3|1Nn|1No|8l","💆‍♀","o|3|1Nq|1No|8l","💆🏻‍♀️","woman getting massage: light skin tone","o|3|1Ns|1Nt|8l","💆🏻‍♀","o|3|1Nv|1Nt|8l","💆🏼‍♀️","woman getting massage: medium-light skin tone","o|3|1Nx|1Ny|8l","💆🏼‍♀","o|3|1O0|1Ny|8l","💆🏽‍♀️","woman getting massage: medium skin tone","o|3|1O2|1O3|8l","💆🏽‍♀","o|3|1O5|1O3|8l","💆🏾‍♀️","woman getting massage: medium-dark skin tone","o|3|1O7|1O8|8l","💆🏾‍♀","o|3|1OA|1O8|8l","💆🏿‍♀️","woman getting massage: dark skin tone","o|3|1OC|1OD|8l","💆🏿‍♀","o|3|1OF|1OD|8l","💇","person getting haircut","o|3|1OH|1OI|8l","💇🏻","person getting haircut: light skin tone","o|3|1OK|1OL|8l","💇🏼","person getting haircut: medium-light skin tone","o|3|1ON|1OO|8l","💇🏽","person getting haircut: medium skin tone","o|3|1OQ|1OR|8l","💇🏾","person getting haircut: medium-dark skin tone","o|3|1OT|1OU|8l","💇🏿","person getting haircut: dark skin tone","o|3|1OW|1OX|8l","💇‍♂️","man getting haircut","o|3|1OZ|1Oa|8l","💇‍♂","o|3|1Oc|1Oa|8l","💇🏻‍♂️","man getting haircut: light skin tone","o|3|1Oe|1Of|8l","💇🏻‍♂","o|3|1Oh|1Of|8l","💇🏼‍♂️","man getting haircut: medium-light skin tone","o|3|1Oj|1Ok|8l","💇🏼‍♂","o|3|1Om|1Ok|8l","💇🏽‍♂️","man getting haircut: medium skin tone","o|3|1Oo|1Op|8l","💇🏽‍♂","o|3|1Or|1Op|8l","💇🏾‍♂️","man getting haircut: medium-dark skin tone","o|3|1Ot|1Ou|8l","💇🏾‍♂","o|3|1Ow|1Ou|8l","💇🏿‍♂️","man getting haircut: dark skin tone","o|3|1Oy|1Oz|8l","💇🏿‍♂","o|3|1P1|1Oz|8l","💇‍♀️","woman getting haircut","o|3|1P3|1P4|8l","💇‍♀","o|3|1P6|1P4|8l","💇🏻‍♀️","woman getting haircut: light skin tone","o|3|1P8|1P9|8l","💇🏻‍♀","o|3|1PB|1P9|8l","💇🏼‍♀️","woman getting haircut: medium-light skin tone","o|3|1PD|1PE|8l","💇🏼‍♀","o|3|1PG|1PE|8l","💇🏽‍♀️","woman getting haircut: medium skin tone","o|3|1PI|1PJ|8l","💇🏽‍♀","o|3|1PL|1PJ|8l","💇🏾‍♀️","woman getting haircut: medium-dark skin tone","o|3|1PN|1PO|8l","💇🏾‍♀","o|3|1PQ|1PO|8l","💇🏿‍♀️","woman getting haircut: dark skin tone","o|3|1PS|1PT|8l","💇🏿‍♀","o|3|1PV|1PT|8l","🚶","person walking","o|3|1PX|1PY|8l","🚶🏻","person walking: light skin tone","o|3|1Pa|1Pb|8l","🚶🏼","person walking: medium-light skin tone","o|3|1Pd|1Pe|8l","🚶🏽","person walking: medium skin tone","o|3|1Pg|1Ph|8l","🚶🏾","person walking: medium-dark skin tone","o|3|1Pj|1Pk|8l","🚶🏿","person walking: dark skin tone","o|3|1Pm|1Pn|8l","🚶‍♂️","man walking","o|3|1Pp|1Pq|8l","🚶‍♂","o|3|1Ps|1Pq|8l","🚶🏻‍♂️","man walking: light skin tone","o|3|1Pu|1Pv|8l","🚶🏻‍♂","o|3|1Px|1Pv|8l","🚶🏼‍♂️","man walking: medium-light skin tone","o|3|1Pz|1Q0|8l","🚶🏼‍♂","o|3|1Q2|1Q0|8l","🚶🏽‍♂️","man walking: medium skin tone","o|3|1Q4|1Q5|8l","🚶🏽‍♂","o|3|1Q7|1Q5|8l","🚶🏾‍♂️","man walking: medium-dark skin tone","o|3|1Q9|1QA|8l","🚶🏾‍♂","o|3|1QC|1QA|8l","🚶🏿‍♂️","man walking: dark skin tone","o|3|1QE|1QF|8l","🚶🏿‍♂","o|3|1QH|1QF|8l","🚶‍♀️","woman walking","o|3|1QJ|1QK|8l","🚶‍♀","o|3|1QM|1QK|8l","🚶🏻‍♀️","woman walking: light skin tone","o|3|1QO|1QP|8l","🚶🏻‍♀","o|3|1QR|1QP|8l","🚶🏼‍♀️","woman walking: medium-light skin tone","o|3|1QT|1QU|8l","🚶🏼‍♀","o|3|1QW|1QU|8l","🚶🏽‍♀️","woman walking: medium skin tone","o|3|1QY|1QZ|8l","🚶🏽‍♀","o|3|1Qb|1QZ|8l","🚶🏾‍♀️","woman walking: medium-dark skin tone","o|3|1Qd|1Qe|8l","🚶🏾‍♀","o|3|1Qg|1Qe|8l","🚶🏿‍♀️","woman walking: dark skin tone","o|3|1Qi|1Qj|8l","🚶🏿‍♀","o|3|1Ql|1Qj|8l","🚶‍➡️","person walking facing right","o|3|1Qn|1Qo|8l","🚶‍➡","o|3|1Qq|1Qo|8l","🚶🏻‍➡️","person walking facing right: light skin tone","o|3|1Qs|1Qt|8l","🚶🏻‍➡","o|3|1Qv|1Qt|8l","🚶🏼‍➡️","person walking facing right: medium-light skin tone","o|3|1Qx|1Qy|8l","🚶🏼‍➡","o|3|1R0|1Qy|8l","🚶🏽‍➡️","person walking facing right: medium skin tone","o|3|1R2|1R3|8l","🚶🏽‍➡","o|3|1R5|1R3|8l","🚶🏾‍➡️","person walking facing right: medium-dark skin tone","o|3|1R7|1R8|8l","🚶🏾‍➡","o|3|1RA|1R8|8l","🚶🏿‍➡️","person walking facing right: dark skin tone","o|3|1RC|1RD|8l","🚶🏿‍➡","o|3|1RF|1RD|8l","🚶‍♀️‍➡️","woman walking facing right","o|3|1RH|1RI|8l","🚶‍♀‍➡️","o|3|1RK|1RI|8l","🚶‍♀️‍➡","o|3|1RM|1RI|8l","🚶‍♀‍➡","o|3|1RO|1RI|8l","🚶🏻‍♀️‍➡️","woman walking facing right: light skin tone","o|3|1RQ|1RR|8l","🚶🏻‍♀‍➡️","o|3|1RT|1RR|8l","🚶🏻‍♀️‍➡","o|3|1RV|1RR|8l","🚶🏻‍♀‍➡","o|3|1RX|1RR|8l","🚶🏼‍♀️‍➡️","woman walking facing right: medium-light skin tone","o|3|1RZ|1Ra|8l","🚶🏼‍♀‍➡️","o|3|1Rc|1Ra|8l","🚶🏼‍♀️‍➡","o|3|1Re|1Ra|8l","🚶🏼‍♀‍➡","o|3|1Rg|1Ra|8l","🚶🏽‍♀️‍➡️","woman walking facing right: medium skin tone","o|3|1Ri|1Rj|8l","🚶🏽‍♀‍➡️","o|3|1Rl|1Rj|8l","🚶🏽‍♀️‍➡","o|3|1Rn|1Rj|8l","🚶🏽‍♀‍➡","o|3|1Rp|1Rj|8l","🚶🏾‍♀️‍➡️","woman walking facing right: medium-dark skin tone","o|3|1Rr|1Rs|8l","🚶🏾‍♀‍➡️","o|3|1Ru|1Rs|8l","🚶🏾‍♀️‍➡","o|3|1Rw|1Rs|8l","🚶🏾‍♀‍➡","o|3|1Ry|1Rs|8l","🚶🏿‍♀️‍➡️","woman walking facing right: dark skin tone","o|3|1S0|1S1|8l","🚶🏿‍♀‍➡️","o|3|1S3|1S1|8l","🚶🏿‍♀️‍➡","o|3|1S5|1S1|8l","🚶🏿‍♀‍➡","o|3|1S7|1S1|8l","🚶‍♂️‍➡️","man walking facing right","o|3|1S9|1SA|8l","🚶‍♂‍➡️","o|3|1SC|1SA|8l","🚶‍♂️‍➡","o|3|1SE|1SA|8l","🚶‍♂‍➡","o|3|1SG|1SA|8l","🚶🏻‍♂️‍➡️","man walking facing right: light skin tone","o|3|1SI|1SJ|8l","🚶🏻‍♂‍➡️","o|3|1SL|1SJ|8l","🚶🏻‍♂️‍➡","o|3|1SN|1SJ|8l","🚶🏻‍♂‍➡","o|3|1SP|1SJ|8l","🚶🏼‍♂️‍➡️","man walking facing right: medium-light skin tone","o|3|1SR|1SS|8l","🚶🏼‍♂‍➡️","o|3|1SU|1SS|8l","🚶🏼‍♂️‍➡","o|3|1SW|1SS|8l","🚶🏼‍♂‍➡","o|3|1SY|1SS|8l","🚶🏽‍♂️‍➡️","man walking facing right: medium skin tone","o|3|1Sa|1Sb|8l","🚶🏽‍♂‍➡️","o|3|1Sd|1Sb|8l","🚶🏽‍♂️‍➡","o|3|1Sf|1Sb|8l","🚶🏽‍♂‍➡","o|3|1Sh|1Sb|8l","🚶🏾‍♂️‍➡️","man walking facing right: medium-dark skin tone","o|3|1Sj|1Sk|8l","🚶🏾‍♂‍➡️","o|3|1Sm|1Sk|8l","🚶🏾‍♂️‍➡","o|3|1So|1Sk|8l","🚶🏾‍♂‍➡","o|3|1Sq|1Sk|8l","🚶🏿‍♂️‍➡️","man walking facing right: dark skin tone","o|3|1Ss|1St|8l","🚶🏿‍♂‍➡️","o|3|1Sv|1St|8l","🚶🏿‍♂️‍➡","o|3|1Sx|1St|8l","🚶🏿‍♂‍➡","o|3|1Sz|1St|8l","🧍","person standing","o|3|1T1|1T2|8l","🧍🏻","person standing: light skin tone","o|3|1T4|1T5|8l","🧍🏼","person standing: medium-light skin tone","o|3|1T7|1T8|8l","🧍🏽","person standing: medium skin tone","o|3|1TA|1TB|8l","🧍🏾","person standing: medium-dark skin tone","o|3|1TD|1TE|8l","🧍🏿","person standing: dark skin tone","o|3|1TG|1TH|8l","🧍‍♂️","man standing","o|3|1TJ|1TK|8l","🧍‍♂","o|3|1TM|1TK|8l","🧍🏻‍♂️","man standing: light skin tone","o|3|1TO|1TP|8l","🧍🏻‍♂","o|3|1TR|1TP|8l","🧍🏼‍♂️","man standing: medium-light skin tone","o|3|1TT|1TU|8l","🧍🏼‍♂","o|3|1TW|1TU|8l","🧍🏽‍♂️","man standing: medium skin tone","o|3|1TY|1TZ|8l","🧍🏽‍♂","o|3|1Tb|1TZ|8l","🧍🏾‍♂️","man standing: medium-dark skin tone","o|3|1Td|1Te|8l","🧍🏾‍♂","o|3|1Tg|1Te|8l","🧍🏿‍♂️","man standing: dark skin tone","o|3|1Ti|1Tj|8l","🧍🏿‍♂","o|3|1Tl|1Tj|8l","🧍‍♀️","woman standing","o|3|1Tn|1To|8l","🧍‍♀","o|3|1Tq|1To|8l","🧍🏻‍♀️","woman standing: light skin tone","o|3|1Ts|1Tt|8l","🧍🏻‍♀","o|3|1Tv|1Tt|8l","🧍🏼‍♀️","woman standing: medium-light skin tone","o|3|1Tx|1Ty|8l","🧍🏼‍♀","o|3|1U0|1Ty|8l","🧍🏽‍♀️","woman standing: medium skin tone","o|3|1U2|1U3|8l","🧍🏽‍♀","o|3|1U5|1U3|8l","🧍🏾‍♀️","woman standing: medium-dark skin tone","o|3|1U7|1U8|8l","🧍🏾‍♀","o|3|1UA|1U8|8l","🧍🏿‍♀️","woman standing: dark skin tone","o|3|1UC|1UD|8l","🧍🏿‍♀","o|3|1UF|1UD|8l","🧎","person kneeling","o|3|1UH|1UI|8l","🧎🏻","person kneeling: light skin tone","o|3|1UK|1UL|8l","🧎🏼","person kneeling: medium-light skin tone","o|3|1UN|1UO|8l","🧎🏽","person kneeling: medium skin tone","o|3|1UQ|1UR|8l","🧎🏾","person kneeling: medium-dark skin tone","o|3|1UT|1UU|8l","🧎🏿","person kneeling: dark skin tone","o|3|1UW|1UX|8l","🧎‍♂️","man kneeling","o|3|1UZ|1Ua|8l","🧎‍♂","o|3|1Uc|1Ua|8l","🧎🏻‍♂️","man kneeling: light skin tone","o|3|1Ue|1Uf|8l","🧎🏻‍♂","o|3|1Uh|1Uf|8l","🧎🏼‍♂️","man kneeling: medium-light skin tone","o|3|1Uj|1Uk|8l","🧎🏼‍♂","o|3|1Um|1Uk|8l","🧎🏽‍♂️","man kneeling: medium skin tone","o|3|1Uo|1Up|8l","🧎🏽‍♂","o|3|1Ur|1Up|8l","🧎🏾‍♂️","man kneeling: medium-dark skin tone","o|3|1Ut|1Uu|8l","🧎🏾‍♂","o|3|1Uw|1Uu|8l","🧎🏿‍♂️","man kneeling: dark skin tone","o|3|1Uy|1Uz|8l","🧎🏿‍♂","o|3|1V1|1Uz|8l","🧎‍♀️","woman kneeling","o|3|1V3|1V4|8l","🧎‍♀","o|3|1V6|1V4|8l","🧎🏻‍♀️","woman kneeling: light skin tone","o|3|1V8|1V9|8l","🧎🏻‍♀","o|3|1VB|1V9|8l","🧎🏼‍♀️","woman kneeling: medium-light skin tone","o|3|1VD|1VE|8l","🧎🏼‍♀","o|3|1VG|1VE|8l","🧎🏽‍♀️","woman kneeling: medium skin tone","o|3|1VI|1VJ|8l","🧎🏽‍♀","o|3|1VL|1VJ|8l","🧎🏾‍♀️","woman kneeling: medium-dark skin tone","o|3|1VN|1VO|8l","🧎🏾‍♀","o|3|1VQ|1VO|8l","🧎🏿‍♀️","woman kneeling: dark skin tone","o|3|1VS|1VT|8l","🧎🏿‍♀","o|3|1VV|1VT|8l","🧎‍➡️","person kneeling facing right","o|3|1VX|1VY|8l","🧎‍➡","o|3|1Va|1VY|8l","🧎🏻‍➡️","person kneeling facing right: light skin tone","o|3|1Vc|1Vd|8l","🧎🏻‍➡","o|3|1Vf|1Vd|8l","🧎🏼‍➡️","person kneeling facing right: medium-light skin tone","o|3|1Vh|1Vi|8l","🧎🏼‍➡","o|3|1Vk|1Vi|8l","🧎🏽‍➡️","person kneeling facing right: medium skin tone","o|3|1Vm|1Vn|8l","🧎🏽‍➡","o|3|1Vp|1Vn|8l","🧎🏾‍➡️","person kneeling facing right: medium-dark skin tone","o|3|1Vr|1Vs|8l","🧎🏾‍➡","o|3|1Vu|1Vs|8l","🧎🏿‍➡️","person kneeling facing right: dark skin tone","o|3|1Vw|1Vx|8l","🧎🏿‍➡","o|3|1Vz|1Vx|8l","🧎‍♀️‍➡️","woman kneeling facing right","o|3|1W1|1W2|8l","🧎‍♀‍➡️","o|3|1W4|1W2|8l","🧎‍♀️‍➡","o|3|1W6|1W2|8l","🧎‍♀‍➡","o|3|1W8|1W2|8l","🧎🏻‍♀️‍➡️","woman kneeling facing right: light skin tone","o|3|1WA|1WB|8l","🧎🏻‍♀‍➡️","o|3|1WD|1WB|8l","🧎🏻‍♀️‍➡","o|3|1WF|1WB|8l","🧎🏻‍♀‍➡","o|3|1WH|1WB|8l","🧎🏼‍♀️‍➡️","woman kneeling facing right: medium-light skin tone","o|3|1WJ|1WK|8l","🧎🏼‍♀‍➡️","o|3|1WM|1WK|8l","🧎🏼‍♀️‍➡","o|3|1WO|1WK|8l","🧎🏼‍♀‍➡","o|3|1WQ|1WK|8l","🧎🏽‍♀️‍➡️","woman kneeling facing right: medium skin tone","o|3|1WS|1WT|8l","🧎🏽‍♀‍➡️","o|3|1WV|1WT|8l","🧎🏽‍♀️‍➡","o|3|1WX|1WT|8l","🧎🏽‍♀‍➡","o|3|1WZ|1WT|8l","🧎🏾‍♀️‍➡️","woman kneeling facing right: medium-dark skin tone","o|3|1Wb|1Wc|8l","🧎🏾‍♀‍➡️","o|3|1We|1Wc|8l","🧎🏾‍♀️‍➡","o|3|1Wg|1Wc|8l","🧎🏾‍♀‍➡","o|3|1Wi|1Wc|8l","🧎🏿‍♀️‍➡️","woman kneeling facing right: dark skin tone","o|3|1Wk|1Wl|8l","🧎🏿‍♀‍➡️","o|3|1Wn|1Wl|8l","🧎🏿‍♀️‍➡","o|3|1Wp|1Wl|8l","🧎🏿‍♀‍➡","o|3|1Wr|1Wl|8l","🧎‍♂️‍➡️","man kneeling facing right","o|3|1Wt|1Wu|8l","🧎‍♂‍➡️","o|3|1Ww|1Wu|8l","🧎‍♂️‍➡","o|3|1Wy|1Wu|8l","🧎‍♂‍➡","o|3|1X0|1Wu|8l","🧎🏻‍♂️‍➡️","man kneeling facing right: light skin tone","o|3|1X2|1X3|8l","🧎🏻‍♂‍➡️","o|3|1X5|1X3|8l","🧎🏻‍♂️‍➡","o|3|1X7|1X3|8l","🧎🏻‍♂‍➡","o|3|1X9|1X3|8l","🧎🏼‍♂️‍➡️","man kneeling facing right: medium-light skin tone","o|3|1XB|1XC|8l","🧎🏼‍♂‍➡️","o|3|1XE|1XC|8l","🧎🏼‍♂️‍➡","o|3|1XG|1XC|8l","🧎🏼‍♂‍➡","o|3|1XI|1XC|8l","🧎🏽‍♂️‍➡️","man kneeling facing right: medium skin tone","o|3|1XK|1XL|8l","🧎🏽‍♂‍➡️","o|3|1XN|1XL|8l","🧎🏽‍♂️‍➡","o|3|1XP|1XL|8l","🧎🏽‍♂‍➡","o|3|1XR|1XL|8l","🧎🏾‍♂️‍➡️","man kneeling facing right: medium-dark skin tone","o|3|1XT|1XU|8l","🧎🏾‍♂‍➡️","o|3|1XW|1XU|8l","🧎🏾‍♂️‍➡","o|3|1XY|1XU|8l","🧎🏾‍♂‍➡","o|3|1Xa|1XU|8l","🧎🏿‍♂️‍➡️","man kneeling facing right: dark skin tone","o|3|1Xc|1Xd|8l","🧎🏿‍♂‍➡️","o|3|1Xf|1Xd|8l","🧎🏿‍♂️‍➡","o|3|1Xh|1Xd|8l","🧎🏿‍♂‍➡","o|3|1Xj|1Xd|8l","🧑‍🦯","person with white cane","o|3|1Xl|1Xm|8l","🧑🏻‍🦯","person with white cane: light skin tone","o|3|1Xo|1Xp|8l","🧑🏼‍🦯","person with white cane: medium-light skin tone","o|3|1Xr|1Xs|8l","🧑🏽‍🦯","person with white cane: medium skin tone","o|3|1Xu|1Xv|8l","🧑🏾‍🦯","person with white cane: medium-dark skin tone","o|3|1Xx|1Xy|8l","🧑🏿‍🦯","person with white cane: dark skin tone","o|3|1Y0|1Y1|8l","🧑‍🦯‍➡️","person with white cane facing right","o|3|1Y3|1Y4|8l","🧑‍🦯‍➡","o|3|1Y6|1Y4|8l","🧑🏻‍🦯‍➡️","person with white cane facing right: light skin tone","o|3|1Y8|1Y9|8l","🧑🏻‍🦯‍➡","o|3|1YB|1Y9|8l","🧑🏼‍🦯‍➡️","person with white cane facing right: medium-light skin tone","o|3|1YD|1YE|8l","🧑🏼‍🦯‍➡","o|3|1YG|1YE|8l","🧑🏽‍🦯‍➡️","person with white cane facing right: medium skin tone","o|3|1YI|1YJ|8l","🧑🏽‍🦯‍➡","o|3|1YL|1YJ|8l","🧑🏾‍🦯‍➡️","person with white cane facing right: medium-dark skin tone","o|3|1YN|1YO|8l","🧑🏾‍🦯‍➡","o|3|1YQ|1YO|8l","🧑🏿‍🦯‍➡️","person with white cane facing right: dark skin tone","o|3|1YS|1YT|8l","🧑🏿‍🦯‍➡","o|3|1YV|1YT|8l","👨‍🦯","man with white cane","o|3|1YX|1YY|8l","👨🏻‍🦯","man with white cane: light skin tone","o|3|1Ya|1Yb|8l","👨🏼‍🦯","man with white cane: medium-light skin tone","o|3|1Yd|1Ye|8l","👨🏽‍🦯","man with white cane: medium skin tone","o|3|1Yg|1Yh|8l","👨🏾‍🦯","man with white cane: medium-dark skin tone","o|3|1Yj|1Yk|8l","👨🏿‍🦯","man with white cane: dark skin tone","o|3|1Ym|1Yn|8l","👨‍🦯‍➡️","man with white cane facing right","o|3|1Yp|1Yq|8l","👨‍🦯‍➡","o|3|1Ys|1Yq|8l","👨🏻‍🦯‍➡️","man with white cane facing right: light skin tone","o|3|1Yu|1Yv|8l","👨🏻‍🦯‍➡","o|3|1Yx|1Yv|8l","👨🏼‍🦯‍➡️","man with white cane facing right: medium-light skin tone","o|3|1Yz|1Z0|8l","👨🏼‍🦯‍➡","o|3|1Z2|1Z0|8l","👨🏽‍🦯‍➡️","man with white cane facing right: medium skin tone","o|3|1Z4|1Z5|8l","👨🏽‍🦯‍➡","o|3|1Z7|1Z5|8l","👨🏾‍🦯‍➡️","man with white cane facing right: medium-dark skin tone","o|3|1Z9|1ZA|8l","👨🏾‍🦯‍➡","o|3|1ZC|1ZA|8l","👨🏿‍🦯‍➡️","man with white cane facing right: dark skin tone","o|3|1ZE|1ZF|8l","👨🏿‍🦯‍➡","o|3|1ZH|1ZF|8l","👩‍🦯","woman with white cane","o|3|1ZJ|1ZK|8l","👩🏻‍🦯","woman with white cane: light skin tone","o|3|1ZM|1ZN|8l","👩🏼‍🦯","woman with white cane: medium-light skin tone","o|3|1ZP|1ZQ|8l","👩🏽‍🦯","woman with white cane: medium skin tone","o|3|1ZS|1ZT|8l","👩🏾‍🦯","woman with white cane: medium-dark skin tone","o|3|1ZV|1ZW|8l","👩🏿‍🦯","woman with white cane: dark skin tone","o|3|1ZY|1ZZ|8l","👩‍🦯‍➡️","woman with white cane facing right","o|3|1Zb|1Zc|8l","👩‍🦯‍➡","o|3|1Ze|1Zc|8l","👩🏻‍🦯‍➡️","woman with white cane facing right: light skin tone","o|3|1Zg|1Zh|8l","👩🏻‍🦯‍➡","o|3|1Zj|1Zh|8l","👩🏼‍🦯‍➡️","woman with white cane facing right: medium-light skin tone","o|3|1Zl|1Zm|8l","👩🏼‍🦯‍➡","o|3|1Zo|1Zm|8l","👩🏽‍🦯‍➡️","woman with white cane facing right: medium skin tone","o|3|1Zq|1Zr|8l","👩🏽‍🦯‍➡","o|3|1Zt|1Zr|8l","👩🏾‍🦯‍➡️","woman with white cane facing right: medium-dark skin tone","o|3|1Zv|1Zw|8l","👩🏾‍🦯‍➡","o|3|1Zy|1Zw|8l","👩🏿‍🦯‍➡️","woman with white cane facing right: dark skin tone","o|3|1a0|1a1|8l","👩🏿‍🦯‍➡","o|3|1a3|1a1|8l","🧑‍🦼","person in motorized wheelchair","o|3|1a5|1a6|8l","🧑🏻‍🦼","person in motorized wheelchair: light skin tone","o|3|1a8|1a9|8l","🧑🏼‍🦼","person in motorized wheelchair: medium-light skin tone","o|3|1aB|1aC|8l","🧑🏽‍🦼","person in motorized wheelchair: medium skin tone","o|3|1aE|1aF|8l","🧑🏾‍🦼","person in motorized wheelchair: medium-dark skin tone","o|3|1aH|1aI|8l","🧑🏿‍🦼","person in motorized wheelchair: dark skin tone","o|3|1aK|1aL|8l","🧑‍🦼‍➡️","person in motorized wheelchair facing right","o|3|1aN|1aO|8l","🧑‍🦼‍➡","o|3|1aQ|1aO|8l","🧑🏻‍🦼‍➡️","person in motorized wheelchair facing right: light skin tone","o|3|1aS|1aT|8l","🧑🏻‍🦼‍➡","o|3|1aV|1aT|8l","🧑🏼‍🦼‍➡️","person in motorized wheelchair facing right: medium-light skin tone","o|3|1aX|1aY|8l","🧑🏼‍🦼‍➡","o|3|1aa|1aY|8l","🧑🏽‍🦼‍➡️","person in motorized wheelchair facing right: medium skin tone","o|3|1ac|1ad|8l","🧑🏽‍🦼‍➡","o|3|1af|1ad|8l","🧑🏾‍🦼‍➡️","person in motorized wheelchair facing right: medium-dark skin tone","o|3|1ah|1ai|8l","🧑🏾‍🦼‍➡","o|3|1ak|1ai|8l","🧑🏿‍🦼‍➡️","person in motorized wheelchair facing right: dark skin tone","o|3|1am|1an|8l","🧑🏿‍🦼‍➡","o|3|1ap|1an|8l","👨‍🦼","man in motorized wheelchair","o|3|1ar|1as|8l","👨🏻‍🦼","man in motorized wheelchair: light skin tone","o|3|1au|1av|8l","👨🏼‍🦼","man in motorized wheelchair: medium-light skin tone","o|3|1ax|1ay|8l","👨🏽‍🦼","man in motorized wheelchair: medium skin tone","o|3|1b0|1b1|8l","👨🏾‍🦼","man in motorized wheelchair: medium-dark skin tone","o|3|1b3|1b4|8l","👨🏿‍🦼","man in motorized wheelchair: dark skin tone","o|3|1b6|1b7|8l","👨‍🦼‍➡️","man in motorized wheelchair facing right","o|3|1b9|1bA|8l","👨‍🦼‍➡","o|3|1bC|1bA|8l","👨🏻‍🦼‍➡️","man in motorized wheelchair facing right: light skin tone","o|3|1bE|1bF|8l","👨🏻‍🦼‍➡","o|3|1bH|1bF|8l","👨🏼‍🦼‍➡️","man in motorized wheelchair facing right: medium-light skin tone","o|3|1bJ|1bK|8l","👨🏼‍🦼‍➡","o|3|1bM|1bK|8l","👨🏽‍🦼‍➡️","man in motorized wheelchair facing right: medium skin tone","o|3|1bO|1bP|8l","👨🏽‍🦼‍➡","o|3|1bR|1bP|8l","👨🏾‍🦼‍➡️","man in motorized wheelchair facing right: medium-dark skin tone","o|3|1bT|1bU|8l","👨🏾‍🦼‍➡","o|3|1bW|1bU|8l","👨🏿‍🦼‍➡️","man in motorized wheelchair facing right: dark skin tone","o|3|1bY|1bZ|8l","👨🏿‍🦼‍➡","o|3|1bb|1bZ|8l","👩‍🦼","woman in motorized wheelchair","o|3|1bd|1be|8l","👩🏻‍🦼","woman in motorized wheelchair: light skin tone","o|3|1bg|1bh|8l","👩🏼‍🦼","woman in motorized wheelchair: medium-light skin tone","o|3|1bj|1bk|8l","👩🏽‍🦼","woman in motorized wheelchair: medium skin tone","o|3|1bm|1bn|8l","👩🏾‍🦼","woman in motorized wheelchair: medium-dark skin tone","o|3|1bp|1bq|8l","👩🏿‍🦼","woman in motorized wheelchair: dark skin tone","o|3|1bs|1bt|8l","👩‍🦼‍➡️","woman in motorized wheelchair facing right","o|3|1bv|1bw|8l","👩‍🦼‍➡","o|3|1by|1bw|8l","👩🏻‍🦼‍➡️","woman in motorized wheelchair facing right: light skin tone","o|3|1c0|1c1|8l","👩🏻‍🦼‍➡","o|3|1c3|1c1|8l","👩🏼‍🦼‍➡️","woman in motorized wheelchair facing right: medium-light skin tone","o|3|1c5|1c6|8l","👩🏼‍🦼‍➡","o|3|1c8|1c6|8l","👩🏽‍🦼‍➡️","woman in motorized wheelchair facing right: medium skin tone","o|3|1cA|1cB|8l","👩🏽‍🦼‍➡","o|3|1cD|1cB|8l","👩🏾‍🦼‍➡️","woman in motorized wheelchair facing right: medium-dark skin tone","o|3|1cF|1cG|8l","👩🏾‍🦼‍➡","o|3|1cI|1cG|8l","👩🏿‍🦼‍➡️","woman in motorized wheelchair facing right: dark skin tone","o|3|1cK|1cL|8l","👩🏿‍🦼‍➡","o|3|1cN|1cL|8l","🧑‍🦽","person in manual wheelchair","o|3|1cP|1cQ|8l","🧑🏻‍🦽","person in manual wheelchair: light skin tone","o|3|1cS|1cT|8l","🧑🏼‍🦽","person in manual wheelchair: medium-light skin tone","o|3|1cV|1cW|8l","🧑🏽‍🦽","person in manual wheelchair: medium skin tone","o|3|1cY|1cZ|8l","🧑🏾‍🦽","person in manual wheelchair: medium-dark skin tone","o|3|1cb|1cc|8l","🧑🏿‍🦽","person in manual wheelchair: dark skin tone","o|3|1ce|1cf|8l","🧑‍🦽‍➡️","person in manual wheelchair facing right","o|3|1ch|1ci|8l","🧑‍🦽‍➡","o|3|1ck|1ci|8l","🧑🏻‍🦽‍➡️","person in manual wheelchair facing right: light skin tone","o|3|1cm|1cn|8l","🧑🏻‍🦽‍➡","o|3|1cp|1cn|8l","🧑🏼‍🦽‍➡️","person in manual wheelchair facing right: medium-light skin tone","o|3|1cr|1cs|8l","🧑🏼‍🦽‍➡","o|3|1cu|1cs|8l","🧑🏽‍🦽‍➡️","person in manual wheelchair facing right: medium skin tone","o|3|1cw|1cx|8l","🧑🏽‍🦽‍➡","o|3|1cz|1cx|8l","🧑🏾‍🦽‍➡️","person in manual wheelchair facing right: medium-dark skin tone","o|3|1d1|1d2|8l","🧑🏾‍🦽‍➡","o|3|1d4|1d2|8l","🧑🏿‍🦽‍➡️","person in manual wheelchair facing right: dark skin tone","o|3|1d6|1d7|8l","🧑🏿‍🦽‍➡","o|3|1d9|1d7|8l","👨‍🦽","man in manual wheelchair","o|3|1dB|1dC|8l","👨🏻‍🦽","man in manual wheelchair: light skin tone","o|3|1dE|1dF|8l","👨🏼‍🦽","man in manual wheelchair: medium-light skin tone","o|3|1dH|1dI|8l","👨🏽‍🦽","man in manual wheelchair: medium skin tone","o|3|1dK|1dL|8l","👨🏾‍🦽","man in manual wheelchair: medium-dark skin tone","o|3|1dN|1dO|8l","👨🏿‍🦽","man in manual wheelchair: dark skin tone","o|3|1dQ|1dR|8l","👨‍🦽‍➡️","man in manual wheelchair facing right","o|3|1dT|1dU|8l","👨‍🦽‍➡","o|3|1dW|1dU|8l","👨🏻‍🦽‍➡️","man in manual wheelchair facing right: light skin tone","o|3|1dY|1dZ|8l","👨🏻‍🦽‍➡","o|3|1db|1dZ|8l","👨🏼‍🦽‍➡️","man in manual wheelchair facing right: medium-light skin tone","o|3|1dd|1de|8l","👨🏼‍🦽‍➡","o|3|1dg|1de|8l","👨🏽‍🦽‍➡️","man in manual wheelchair facing right: medium skin tone","o|3|1di|1dj|8l","👨🏽‍🦽‍➡","o|3|1dl|1dj|8l","👨🏾‍🦽‍➡️","man in manual wheelchair facing right: medium-dark skin tone","o|3|1dn|1do|8l","👨🏾‍🦽‍➡","o|3|1dq|1do|8l","👨🏿‍🦽‍➡️","man in manual wheelchair facing right: dark skin tone","o|3|1ds|1dt|8l","👨🏿‍🦽‍➡","o|3|1dv|1dt|8l","👩‍🦽","woman in manual wheelchair","o|3|1dx|1dy|8l","👩🏻‍🦽","woman in manual wheelchair: light skin tone","o|3|1e0|1e1|8l","👩🏼‍🦽","woman in manual wheelchair: medium-light skin tone","o|3|1e3|1e4|8l","👩🏽‍🦽","woman in manual wheelchair: medium skin tone","o|3|1e6|1e7|8l","👩🏾‍🦽","woman in manual wheelchair: medium-dark skin tone","o|3|1e9|1eA|8l","👩🏿‍🦽","woman in manual wheelchair: dark skin tone","o|3|1eC|1eD|8l","👩‍🦽‍➡️","woman in manual wheelchair facing right","o|3|1eF|1eG|8l","👩‍🦽‍➡","o|3|1eI|1eG|8l","👩🏻‍🦽‍➡️","woman in manual wheelchair facing right: light skin tone","o|3|1eK|1eL|8l","👩🏻‍🦽‍➡","o|3|1eN|1eL|8l","👩🏼‍🦽‍➡️","woman in manual wheelchair facing right: medium-light skin tone","o|3|1eP|1eQ|8l","👩🏼‍🦽‍➡","o|3|1eS|1eQ|8l","👩🏽‍🦽‍➡️","woman in manual wheelchair facing right: medium skin tone","o|3|1eU|1eV|8l","👩🏽‍🦽‍➡","o|3|1eX|1eV|8l","👩🏾‍🦽‍➡️","woman in manual wheelchair facing right: medium-dark skin tone","o|3|1eZ|1ea|8l","👩🏾‍🦽‍➡","o|3|1ec|1ea|8l","👩🏿‍🦽‍➡️","woman in manual wheelchair facing right: dark skin tone","o|3|1ee|1ef|8l","👩🏿‍🦽‍➡","o|3|1eh|1ef|8l","🏃","person running","o|3|1ej|1ek|8l","🏃🏻","person running: light skin tone","o|3|1em|1en|8l","🏃🏼","person running: medium-light skin tone","o|3|1ep|1eq|8l","🏃🏽","person running: medium skin tone","o|3|1es|1et|8l","🏃🏾","person running: medium-dark skin tone","o|3|1ev|1ew|8l","🏃🏿","person running: dark skin tone","o|3|1ey|1ez|8l","🏃‍♂️","man running","o|3|1f1|1f2|8l","🏃‍♂","o|3|1f4|1f2|8l","🏃🏻‍♂️","man running: light skin tone","o|3|1f6|1f7|8l","🏃🏻‍♂","o|3|1f9|1f7|8l","🏃🏼‍♂️","man running: medium-light skin tone","o|3|1fB|1fC|8l","🏃🏼‍♂","o|3|1fE|1fC|8l","🏃🏽‍♂️","man running: medium skin tone","o|3|1fG|1fH|8l","🏃🏽‍♂","o|3|1fJ|1fH|8l","🏃🏾‍♂️","man running: medium-dark skin tone","o|3|1fL|1fM|8l","🏃🏾‍♂","o|3|1fO|1fM|8l","🏃🏿‍♂️","man running: dark skin tone","o|3|1fQ|1fR|8l","🏃🏿‍♂","o|3|1fT|1fR|8l","🏃‍♀️","woman running","o|3|1fV|1fW|8l","🏃‍♀","o|3|1fY|1fW|8l","🏃🏻‍♀️","woman running: light skin tone","o|3|1fa|1fb|8l","🏃🏻‍♀","o|3|1fd|1fb|8l","🏃🏼‍♀️","woman running: medium-light skin tone","o|3|1ff|1fg|8l","🏃🏼‍♀","o|3|1fi|1fg|8l","🏃🏽‍♀️","woman running: medium skin tone","o|3|1fk|1fl|8l","🏃🏽‍♀","o|3|1fn|1fl|8l","🏃🏾‍♀️","woman running: medium-dark skin tone","o|3|1fp|1fq|8l","🏃🏾‍♀","o|3|1fs|1fq|8l","🏃🏿‍♀️","woman running: dark skin tone","o|3|1fu|1fv|8l","🏃🏿‍♀","o|3|1fx|1fv|8l","🏃‍➡️","person running facing right","o|3|1fz|1g0|8l","🏃‍➡","o|3|1g2|1g0|8l","🏃🏻‍➡️","person running facing right: light skin tone","o|3|1g4|1g5|8l","🏃🏻‍➡","o|3|1g7|1g5|8l","🏃🏼‍➡️","person running facing right: medium-light skin tone","o|3|1g9|1gA|8l","🏃🏼‍➡","o|3|1gC|1gA|8l","🏃🏽‍➡️","person running facing right: medium skin tone","o|3|1gE|1gF|8l","🏃🏽‍➡","o|3|1gH|1gF|8l","🏃🏾‍➡️","person running facing right: medium-dark skin tone","o|3|1gJ|1gK|8l","🏃🏾‍➡","o|3|1gM|1gK|8l","🏃🏿‍➡️","person running facing right: dark skin tone","o|3|1gO|1gP|8l","🏃🏿‍➡","o|3|1gR|1gP|8l","🏃‍♀️‍➡️","woman running facing right","o|3|1gT|1gU|8l","🏃‍♀‍➡️","o|3|1gW|1gU|8l","🏃‍♀️‍➡","o|3|1gY|1gU|8l","🏃‍♀‍➡","o|3|1ga|1gU|8l","🏃🏻‍♀️‍➡️","woman running facing right: light skin tone","o|3|1gc|1gd|8l","🏃🏻‍♀‍➡️","o|3|1gf|1gd|8l","🏃🏻‍♀️‍➡","o|3|1gh|1gd|8l","🏃🏻‍♀‍➡","o|3|1gj|1gd|8l","🏃🏼‍♀️‍➡️","woman running facing right: medium-light skin tone","o|3|1gl|1gm|8l","🏃🏼‍♀‍➡️","o|3|1go|1gm|8l","🏃🏼‍♀️‍➡","o|3|1gq|1gm|8l","🏃🏼‍♀‍➡","o|3|1gs|1gm|8l","🏃🏽‍♀️‍➡️","woman running facing right: medium skin tone","o|3|1gu|1gv|8l","🏃🏽‍♀‍➡️","o|3|1gx|1gv|8l","🏃🏽‍♀️‍➡","o|3|1gz|1gv|8l","🏃🏽‍♀‍➡","o|3|1h1|1gv|8l","🏃🏾‍♀️‍➡️","woman running facing right: medium-dark skin tone","o|3|1h3|1h4|8l","🏃🏾‍♀‍➡️","o|3|1h6|1h4|8l","🏃🏾‍♀️‍➡","o|3|1h8|1h4|8l","🏃🏾‍♀‍➡","o|3|1hA|1h4|8l","🏃🏿‍♀️‍➡️","woman running facing right: dark skin tone","o|3|1hC|1hD|8l","🏃🏿‍♀‍➡️","o|3|1hF|1hD|8l","🏃🏿‍♀️‍➡","o|3|1hH|1hD|8l","🏃🏿‍♀‍➡","o|3|1hJ|1hD|8l","🏃‍♂️‍➡️","man running facing right","o|3|1hL|1hM|8l","🏃‍♂‍➡️","o|3|1hO|1hM|8l","🏃‍♂️‍➡","o|3|1hQ|1hM|8l","🏃‍♂‍➡","o|3|1hS|1hM|8l","🏃🏻‍♂️‍➡️","man running facing right: light skin tone","o|3|1hU|1hV|8l","🏃🏻‍♂‍➡️","o|3|1hX|1hV|8l","🏃🏻‍♂️‍➡","o|3|1hZ|1hV|8l","🏃🏻‍♂‍➡","o|3|1hb|1hV|8l","🏃🏼‍♂️‍➡️","man running facing right: medium-light skin tone","o|3|1hd|1he|8l","🏃🏼‍♂‍➡️","o|3|1hg|1he|8l","🏃🏼‍♂️‍➡","o|3|1hi|1he|8l","🏃🏼‍♂‍➡","o|3|1hk|1he|8l","🏃🏽‍♂️‍➡️","man running facing right: medium skin tone","o|3|1hm|1hn|8l","🏃🏽‍♂‍➡️","o|3|1hp|1hn|8l","🏃🏽‍♂️‍➡","o|3|1hr|1hn|8l","🏃🏽‍♂‍➡","o|3|1ht|1hn|8l","🏃🏾‍♂️‍➡️","man running facing right: medium-dark skin tone","o|3|1hv|1hw|8l","🏃🏾‍♂‍➡️","o|3|1hy|1hw|8l","🏃🏾‍♂️‍➡","o|3|1i0|1hw|8l","🏃🏾‍♂‍➡","o|3|1i2|1hw|8l","🏃🏿‍♂️‍➡️","man running facing right: dark skin tone","o|3|1i4|1i5|8l","🏃🏿‍♂‍➡️","o|3|1i7|1i5|8l","🏃🏿‍♂️‍➡","o|3|1i9|1i5|8l","🏃🏿‍♂‍➡","o|3|1iB|1i5|8l","💃","woman dancing","o|3|1iD|1iE|8l","💃🏻","woman dancing: light skin tone","o|3|1iG|1iH|8l","💃🏼","woman dancing: medium-light skin tone","o|3|1iJ|1iK|8l","💃🏽","woman dancing: medium skin tone","o|3|1iM|1iN|8l","💃🏾","woman dancing: medium-dark skin tone","o|3|1iP|1iQ|8l","💃🏿","woman dancing: dark skin tone","o|3|1iS|1iT|8l","🕺","man dancing","o|3|1iV|1iW|8l","🕺🏻","man dancing: light skin tone","o|3|1iY|1iZ|8l","🕺🏼","man dancing: medium-light skin tone","o|3|1ib|1ic|8l","🕺🏽","man dancing: medium skin tone","o|3|1ie|1if|8l","🕺🏾","man dancing: medium-dark skin tone","o|3|1ih|1ii|8l","🕺🏿","man dancing: dark skin tone","o|3|1ik|1il|8l","🕴️","person in suit levitating","o|3|1in|1io|8l","🕴","o|3|1iq|1io|8l","🕴🏻","person in suit levitating: light skin tone","o|3|1is|1it|8l","🕴🏼","person in suit levitating: medium-light skin tone","o|3|1iv|1iw|8l","🕴🏽","person in suit levitating: medium skin tone","o|3|1iy|1iz|8l","🕴🏾","person in suit levitating: medium-dark skin tone","o|3|1j1|1j2|8l","🕴🏿","person in suit levitating: dark skin tone","o|3|1j4|1j5|8l","👯","people with bunny ears","o|3|1j7|1j8|8l","👯‍♂️","men with bunny ears","o|3|1jA|1jB|8l","👯‍♂","o|3|1jD|1jB|8l","👯‍♀️","women with bunny ears","o|3|1jF|1jG|8l","👯‍♀","o|3|1jI|1jG|8l","🧖","person in steamy room","o|3|1jK|1jL|8l","🧖🏻","person in steamy room: light skin tone","o|3|1jN|1jO|8l","🧖🏼","person in steamy room: medium-light skin tone","o|3|1jQ|1jR|8l","🧖🏽","person in steamy room: medium skin tone","o|3|1jT|1jU|8l","🧖🏾","person in steamy room: medium-dark skin tone","o|3|1jW|1jX|8l","🧖🏿","person in steamy room: dark skin tone","o|3|1jZ|1ja|8l","🧖‍♂️","man in steamy room","o|3|1jc|1jd|8l","🧖‍♂","o|3|1jf|1jd|8l","🧖🏻‍♂️","man in steamy room: light skin tone","o|3|1jh|1ji|8l","🧖🏻‍♂","o|3|1jk|1ji|8l","🧖🏼‍♂️","man in steamy room: medium-light skin tone","o|3|1jm|1jn|8l","🧖🏼‍♂","o|3|1jp|1jn|8l","🧖🏽‍♂️","man in steamy room: medium skin tone","o|3|1jr|1js|8l","🧖🏽‍♂","o|3|1ju|1js|8l","🧖🏾‍♂️","man in steamy room: medium-dark skin tone","o|3|1jw|1jx|8l","🧖🏾‍♂","o|3|1jz|1jx|8l","🧖🏿‍♂️","man in steamy room: dark skin tone","o|3|1k1|1k2|8l","🧖🏿‍♂","o|3|1k4|1k2|8l","🧖‍♀️","woman in steamy room","o|3|1k6|1k7|8l","🧖‍♀","o|3|1k9|1k7|8l","🧖🏻‍♀️","woman in steamy room: light skin tone","o|3|1kB|1kC|8l","🧖🏻‍♀","o|3|1kE|1kC|8l","🧖🏼‍♀️","woman in steamy room: medium-light skin tone","o|3|1kG|1kH|8l","🧖🏼‍♀","o|3|1kJ|1kH|8l","🧖🏽‍♀️","woman in steamy room: medium skin tone","o|3|1kL|1kM|8l","🧖🏽‍♀","o|3|1kO|1kM|8l","🧖🏾‍♀️","woman in steamy room: medium-dark skin tone","o|3|1kQ|1kR|8l","🧖🏾‍♀","o|3|1kT|1kR|8l","🧖🏿‍♀️","woman in steamy room: dark skin tone","o|3|1kV|1kW|8l","🧖🏿‍♀","o|3|1kY|1kW|8l","🧗","person climbing","o|3|1ka|1kb|8l","🧗🏻","person climbing: light skin tone","o|3|1kd|1ke|8l","🧗🏼","person climbing: medium-light skin tone","o|3|1kg|1kh|8l","🧗🏽","person climbing: medium skin tone","o|3|1kj|1kk|8l","🧗🏾","person climbing: medium-dark skin tone","o|3|1km|1kn|8l","🧗🏿","person climbing: dark skin tone","o|3|1kp|1kq|8l","🧗‍♂️","man climbing","o|3|1ks|1kt|8l","🧗‍♂","o|3|1kv|1kt|8l","🧗🏻‍♂️","man climbing: light skin tone","o|3|1kx|1ky|8l","🧗🏻‍♂","o|3|1l0|1ky|8l","🧗🏼‍♂️","man climbing: medium-light skin tone","o|3|1l2|1l3|8l","🧗🏼‍♂","o|3|1l5|1l3|8l","🧗🏽‍♂️","man climbing: medium skin tone","o|3|1l7|1l8|8l","🧗🏽‍♂","o|3|1lA|1l8|8l","🧗🏾‍♂️","man climbing: medium-dark skin tone","o|3|1lC|1lD|8l","🧗🏾‍♂","o|3|1lF|1lD|8l","🧗🏿‍♂️","man climbing: dark skin tone","o|3|1lH|1lI|8l","🧗🏿‍♂","o|3|1lK|1lI|8l","🧗‍♀️","woman climbing","o|3|1lM|1lN|8l","🧗‍♀","o|3|1lP|1lN|8l","🧗🏻‍♀️","woman climbing: light skin tone","o|3|1lR|1lS|8l","🧗🏻‍♀","o|3|1lU|1lS|8l","🧗🏼‍♀️","woman climbing: medium-light skin tone","o|3|1lW|1lX|8l","🧗🏼‍♀","o|3|1lZ|1lX|8l","🧗🏽‍♀️","woman climbing: medium skin tone","o|3|1lb|1lc|8l","🧗🏽‍♀","o|3|1le|1lc|8l","🧗🏾‍♀️","woman climbing: medium-dark skin tone","o|3|1lg|1lh|8l","🧗🏾‍♀","o|3|1lj|1lh|8l","🧗🏿‍♀️","woman climbing: dark skin tone","o|3|1ll|1lm|8l","🧗🏿‍♀","o|3|1lo|1lm|8l","🤺","person fencing","o|3|1lq|1lr|8l","🏇","horse racing","o|3|1lt|1lu|8l","🏇🏻","horse racing: light skin tone","o|3|1lw|1lx|8l","🏇🏼","horse racing: medium-light skin tone","o|3|1lz|1m0|8l","🏇🏽","horse racing: medium skin tone","o|3|1m2|1m3|8l","🏇🏾","horse racing: medium-dark skin tone","o|3|1m5|1m6|8l","🏇🏿","horse racing: dark skin tone","o|3|1m8|1m9|8l","⛷️","skier","o|3|1mB|1mC|8l","⛷","o|3|1mE|1mC|8l","🏂","snowboarder","o|3|1mG|1mH|8l","🏂🏻","snowboarder: light skin tone","o|3|1mJ|1mK|8l","🏂🏼","snowboarder: medium-light skin tone","o|3|1mM|1mN|8l","🏂🏽","snowboarder: medium skin tone","o|3|1mP|1mQ|8l","🏂🏾","snowboarder: medium-dark skin tone","o|3|1mS|1mT|8l","🏂🏿","snowboarder: dark skin tone","o|3|1mV|1mW|8l","🏌️","person golfing","o|3|1mY|1mZ|8l","🏌","o|3|1mb|1mZ|8l","🏌🏻","person golfing: light skin tone","o|3|1md|1me|8l","🏌🏼","person golfing: medium-light skin tone","o|3|1mg|1mh|8l","🏌🏽","person golfing: medium skin tone","o|3|1mj|1mk|8l","🏌🏾","person golfing: medium-dark skin tone","o|3|1mm|1mn|8l","🏌🏿","person golfing: dark skin tone","o|3|1mp|1mq|8l","🏌️‍♂️","man golfing","o|3|1ms|1mt|8l","🏌‍♂️","o|3|1mv|1mt|8l","🏌️‍♂","o|3|1mx|1mt|8l","🏌‍♂","o|3|1mz|1mt|8l","🏌🏻‍♂️","man golfing: light skin tone","o|3|1n1|1n2|8l","🏌🏻‍♂","o|3|1n4|1n2|8l","🏌🏼‍♂️","man golfing: medium-light skin tone","o|3|1n6|1n7|8l","🏌🏼‍♂","o|3|1n9|1n7|8l","🏌🏽‍♂️","man golfing: medium skin tone","o|3|1nB|1nC|8l","🏌🏽‍♂","o|3|1nE|1nC|8l","🏌🏾‍♂️","man golfing: medium-dark skin tone","o|3|1nG|1nH|8l","🏌🏾‍♂","o|3|1nJ|1nH|8l","🏌🏿‍♂️","man golfing: dark skin tone","o|3|1nL|1nM|8l","🏌🏿‍♂","o|3|1nO|1nM|8l","🏌️‍♀️","woman golfing","o|3|1nQ|1nR|8l","🏌‍♀️","o|3|1nT|1nR|8l","🏌️‍♀","o|3|1nV|1nR|8l","🏌‍♀","o|3|1nX|1nR|8l","🏌🏻‍♀️","woman golfing: light skin tone","o|3|1nZ|1na|8l","🏌🏻‍♀","o|3|1nc|1na|8l","🏌🏼‍♀️","woman golfing: medium-light skin tone","o|3|1ne|1nf|8l","🏌🏼‍♀","o|3|1nh|1nf|8l","🏌🏽‍♀️","woman golfing: medium skin tone","o|3|1nj|1nk|8l","🏌🏽‍♀","o|3|1nm|1nk|8l","🏌🏾‍♀️","woman golfing: medium-dark skin tone","o|3|1no|1np|8l","🏌🏾‍♀","o|3|1nr|1np|8l","🏌🏿‍♀️","woman golfing: dark skin tone","o|3|1nt|1nu|8l","🏌🏿‍♀","o|3|1nw|1nu|8l","🏄","person surfing","o|3|1ny|1nz|8l","🏄🏻","person surfing: light skin tone","o|3|1o1|1o2|8l","🏄🏼","person surfing: medium-light skin tone","o|3|1o4|1o5|8l","🏄🏽","person surfing: medium skin tone","o|3|1o7|1o8|8l","🏄🏾","person surfing: medium-dark skin tone","o|3|1oA|1oB|8l","🏄🏿","person surfing: dark skin tone","o|3|1oD|1oE|8l","🏄‍♂️","man surfing","o|3|1oG|1oH|8l","🏄‍♂","o|3|1oJ|1oH|8l","🏄🏻‍♂️","man surfing: light skin tone","o|3|1oL|1oM|8l","🏄🏻‍♂","o|3|1oO|1oM|8l","🏄🏼‍♂️","man surfing: medium-light skin tone","o|3|1oQ|1oR|8l","🏄🏼‍♂","o|3|1oT|1oR|8l","🏄🏽‍♂️","man surfing: medium skin tone","o|3|1oV|1oW|8l","🏄🏽‍♂","o|3|1oY|1oW|8l","🏄🏾‍♂️","man surfing: medium-dark skin tone","o|3|1oa|1ob|8l","🏄🏾‍♂","o|3|1od|1ob|8l","🏄🏿‍♂️","man surfing: dark skin tone","o|3|1of|1og|8l","🏄🏿‍♂","o|3|1oi|1og|8l","🏄‍♀️","woman surfing","o|3|1ok|1ol|8l","🏄‍♀","o|3|1on|1ol|8l","🏄🏻‍♀️","woman surfing: light skin tone","o|3|1op|1oq|8l","🏄🏻‍♀","o|3|1os|1oq|8l","🏄🏼‍♀️","woman surfing: medium-light skin tone","o|3|1ou|1ov|8l","🏄🏼‍♀","o|3|1ox|1ov|8l","🏄🏽‍♀️","woman surfing: medium skin tone","o|3|1oz|1p0|8l","🏄🏽‍♀","o|3|1p2|1p0|8l","🏄🏾‍♀️","woman surfing: medium-dark skin tone","o|3|1p4|1p5|8l","🏄🏾‍♀","o|3|1p7|1p5|8l","🏄🏿‍♀️","woman surfing: dark skin tone","o|3|1p9|1pA|8l","🏄🏿‍♀","o|3|1pC|1pA|8l","🚣","person rowing boat","o|3|1pE|1pF|8l","🚣🏻","person rowing boat: light skin tone","o|3|1pH|1pI|8l","🚣🏼","person rowing boat: medium-light skin tone","o|3|1pK|1pL|8l","🚣🏽","person rowing boat: medium skin tone","o|3|1pN|1pO|8l","🚣🏾","person rowing boat: medium-dark skin tone","o|3|1pQ|1pR|8l","🚣🏿","person rowing boat: dark skin tone","o|3|1pT|1pU|8l","🚣‍♂️","man rowing boat","o|3|1pW|1pX|8l","🚣‍♂","o|3|1pZ|1pX|8l","🚣🏻‍♂️","man rowing boat: light skin tone","o|3|1pb|1pc|8l","🚣🏻‍♂","o|3|1pe|1pc|8l","🚣🏼‍♂️","man rowing boat: medium-light skin tone","o|3|1pg|1ph|8l","🚣🏼‍♂","o|3|1pj|1ph|8l","🚣🏽‍♂️","man rowing boat: medium skin tone","o|3|1pl|1pm|8l","🚣🏽‍♂","o|3|1po|1pm|8l","🚣🏾‍♂️","man rowing boat: medium-dark skin tone","o|3|1pq|1pr|8l","🚣🏾‍♂","o|3|1pt|1pr|8l","🚣🏿‍♂️","man rowing boat: dark skin tone","o|3|1pv|1pw|8l","🚣🏿‍♂","o|3|1py|1pw|8l","🚣‍♀️","woman rowing boat","o|3|1q0|1q1|8l","🚣‍♀","o|3|1q3|1q1|8l","🚣🏻‍♀️","woman rowing boat: light skin tone","o|3|1q5|1q6|8l","🚣🏻‍♀","o|3|1q8|1q6|8l","🚣🏼‍♀️","woman rowing boat: medium-light skin tone","o|3|1qA|1qB|8l","🚣🏼‍♀","o|3|1qD|1qB|8l","🚣🏽‍♀️","woman rowing boat: medium skin tone","o|3|1qF|1qG|8l","🚣🏽‍♀","o|3|1qI|1qG|8l","🚣🏾‍♀️","woman rowing boat: medium-dark skin tone","o|3|1qK|1qL|8l","🚣🏾‍♀","o|3|1qN|1qL|8l","🚣🏿‍♀️","woman rowing boat: dark skin tone","o|3|1qP|1qQ|8l","🚣🏿‍♀","o|3|1qS|1qQ|8l","🏊","person swimming","o|3|1qU|1qV|8l","🏊🏻","person swimming: light skin tone","o|3|1qX|1qY|8l","🏊🏼","person swimming: medium-light skin tone","o|3|1qa|1qb|8l","🏊🏽","person swimming: medium skin tone","o|3|1qd|1qe|8l","🏊🏾","person swimming: medium-dark skin tone","o|3|1qg|1qh|8l","🏊🏿","person swimming: dark skin tone","o|3|1qj|1qk|8l","🏊‍♂️","man swimming","o|3|1qm|1qn|8l","🏊‍♂","o|3|1qp|1qn|8l","🏊🏻‍♂️","man swimming: light skin tone","o|3|1qr|1qs|8l","🏊🏻‍♂","o|3|1qu|1qs|8l","🏊🏼‍♂️","man swimming: medium-light skin tone","o|3|1qw|1qx|8l","🏊🏼‍♂","o|3|1qz|1qx|8l","🏊🏽‍♂️","man swimming: medium skin tone","o|3|1r1|1r2|8l","🏊🏽‍♂","o|3|1r4|1r2|8l","🏊🏾‍♂️","man swimming: medium-dark skin tone","o|3|1r6|1r7|8l","🏊🏾‍♂","o|3|1r9|1r7|8l","🏊🏿‍♂️","man swimming: dark skin tone","o|3|1rB|1rC|8l","🏊🏿‍♂","o|3|1rE|1rC|8l","🏊‍♀️","woman swimming","o|3|1rG|1rH|8l","🏊‍♀","o|3|1rJ|1rH|8l","🏊🏻‍♀️","woman swimming: light skin tone","o|3|1rL|1rM|8l","🏊🏻‍♀","o|3|1rO|1rM|8l","🏊🏼‍♀️","woman swimming: medium-light skin tone","o|3|1rQ|1rR|8l","🏊🏼‍♀","o|3|1rT|1rR|8l","🏊🏽‍♀️","woman swimming: medium skin tone","o|3|1rV|1rW|8l","🏊🏽‍♀","o|3|1rY|1rW|8l","🏊🏾‍♀️","woman swimming: medium-dark skin tone","o|3|1ra|1rb|8l","🏊🏾‍♀","o|3|1rd|1rb|8l","🏊🏿‍♀️","woman swimming: dark skin tone","o|3|1rf|1rg|8l","🏊🏿‍♀","o|3|1ri|1rg|8l","⛹️","person bouncing ball","o|3|1rk|1rl|8l","⛹","o|3|1rn|1rl|8l","⛹🏻","person bouncing ball: light skin tone","o|3|1rp|1rq|8l","⛹🏼","person bouncing ball: medium-light skin tone","o|3|1rs|1rt|8l","⛹🏽","person bouncing ball: medium skin tone","o|3|1rv|1rw|8l","⛹🏾","person bouncing ball: medium-dark skin tone","o|3|1ry|1rz|8l","⛹🏿","person bouncing ball: dark skin tone","o|3|1s1|1s2|8l","⛹️‍♂️","man bouncing ball","o|3|1s4|1s5|8l","⛹‍♂️","o|3|1s7|1s5|8l","⛹️‍♂","o|3|1s9|1s5|8l","⛹‍♂","o|3|1sB|1s5|8l","⛹🏻‍♂️","man bouncing ball: light skin tone","o|3|1sD|1sE|8l","⛹🏻‍♂","o|3|1sG|1sE|8l","⛹🏼‍♂️","man bouncing ball: medium-light skin tone","o|3|1sI|1sJ|8l","⛹🏼‍♂","o|3|1sL|1sJ|8l","⛹🏽‍♂️","man bouncing ball: medium skin tone","o|3|1sN|1sO|8l","⛹🏽‍♂","o|3|1sQ|1sO|8l","⛹🏾‍♂️","man bouncing ball: medium-dark skin tone","o|3|1sS|1sT|8l","⛹🏾‍♂","o|3|1sV|1sT|8l","⛹🏿‍♂️","man bouncing ball: dark skin tone","o|3|1sX|1sY|8l","⛹🏿‍♂","o|3|1sa|1sY|8l","⛹️‍♀️","woman bouncing ball","o|3|1sc|1sd|8l","⛹‍♀️","o|3|1sf|1sd|8l","⛹️‍♀","o|3|1sh|1sd|8l","⛹‍♀","o|3|1sj|1sd|8l","⛹🏻‍♀️","woman bouncing ball: light skin tone","o|3|1sl|1sm|8l","⛹🏻‍♀","o|3|1so|1sm|8l","⛹🏼‍♀️","woman bouncing ball: medium-light skin tone","o|3|1sq|1sr|8l","⛹🏼‍♀","o|3|1st|1sr|8l","⛹🏽‍♀️","woman bouncing ball: medium skin tone","o|3|1sv|1sw|8l","⛹🏽‍♀","o|3|1sy|1sw|8l","⛹🏾‍♀️","woman bouncing ball: medium-dark skin tone","o|3|1t0|1t1|8l","⛹🏾‍♀","o|3|1t3|1t1|8l","⛹🏿‍♀️","woman bouncing ball: dark skin tone","o|3|1t5|1t6|8l","⛹🏿‍♀","o|3|1t8|1t6|8l","🏋️","person lifting weights","o|3|1tA|1tB|8l","🏋","o|3|1tD|1tB|8l","🏋🏻","person lifting weights: light skin tone","o|3|1tF|1tG|8l","🏋🏼","person lifting weights: medium-light skin tone","o|3|1tI|1tJ|8l","🏋🏽","person lifting weights: medium skin tone","o|3|1tL|1tM|8l","🏋🏾","person lifting weights: medium-dark skin tone","o|3|1tO|1tP|8l","🏋🏿","person lifting weights: dark skin tone","o|3|1tR|1tS|8l","🏋️‍♂️","man lifting weights","o|3|1tU|1tV|8l","🏋‍♂️","o|3|1tX|1tV|8l","🏋️‍♂","o|3|1tZ|1tV|8l","🏋‍♂","o|3|1tb|1tV|8l","🏋🏻‍♂️","man lifting weights: light skin tone","o|3|1td|1te|8l","🏋🏻‍♂","o|3|1tg|1te|8l","🏋🏼‍♂️","man lifting weights: medium-light skin tone","o|3|1ti|1tj|8l","🏋🏼‍♂","o|3|1tl|1tj|8l","🏋🏽‍♂️","man lifting weights: medium skin tone","o|3|1tn|1to|8l","🏋🏽‍♂","o|3|1tq|1to|8l","🏋🏾‍♂️","man lifting weights: medium-dark skin tone","o|3|1ts|1tt|8l","🏋🏾‍♂","o|3|1tv|1tt|8l","🏋🏿‍♂️","man lifting weights: dark skin tone","o|3|1tx|1ty|8l","🏋🏿‍♂","o|3|1u0|1ty|8l","🏋️‍♀️","woman lifting weights","o|3|1u2|1u3|8l","🏋‍♀️","o|3|1u5|1u3|8l","🏋️‍♀","o|3|1u7|1u3|8l","🏋‍♀","o|3|1u9|1u3|8l","🏋🏻‍♀️","woman lifting weights: light skin tone","o|3|1uB|1uC|8l","🏋🏻‍♀","o|3|1uE|1uC|8l","🏋🏼‍♀️","woman lifting weights: medium-light skin tone","o|3|1uG|1uH|8l","🏋🏼‍♀","o|3|1uJ|1uH|8l","🏋🏽‍♀️","woman lifting weights: medium skin tone","o|3|1uL|1uM|8l","🏋🏽‍♀","o|3|1uO|1uM|8l","🏋🏾‍♀️","woman lifting weights: medium-dark skin tone","o|3|1uQ|1uR|8l","🏋🏾‍♀","o|3|1uT|1uR|8l","🏋🏿‍♀️","woman lifting weights: dark skin tone","o|3|1uV|1uW|8l","🏋🏿‍♀","o|3|1uY|1uW|8l","🚴","person biking","o|3|1ua|1ub|8l","🚴🏻","person biking: light skin tone","o|3|1ud|1ue|8l","🚴🏼","person biking: medium-light skin tone","o|3|1ug|1uh|8l","🚴🏽","person biking: medium skin tone","o|3|1uj|1uk|8l","🚴🏾","person biking: medium-dark skin tone","o|3|1um|1un|8l","🚴🏿","person biking: dark skin tone","o|3|1up|1uq|8l","🚴‍♂️","man biking","o|3|1us|1ut|8l","🚴‍♂","o|3|1uv|1ut|8l","🚴🏻‍♂️","man biking: light skin tone","o|3|1ux|1uy|8l","🚴🏻‍♂","o|3|1v0|1uy|8l","🚴🏼‍♂️","man biking: medium-light skin tone","o|3|1v2|1v3|8l","🚴🏼‍♂","o|3|1v5|1v3|8l","🚴🏽‍♂️","man biking: medium skin tone","o|3|1v7|1v8|8l","🚴🏽‍♂","o|3|1vA|1v8|8l","🚴🏾‍♂️","man biking: medium-dark skin tone","o|3|1vC|1vD|8l","🚴🏾‍♂","o|3|1vF|1vD|8l","🚴🏿‍♂️","man biking: dark skin tone","o|3|1vH|1vI|8l","🚴🏿‍♂","o|3|1vK|1vI|8l","🚴‍♀️","woman biking","o|3|1vM|1vN|8l","🚴‍♀","o|3|1vP|1vN|8l","🚴🏻‍♀️","woman biking: light skin tone","o|3|1vR|1vS|8l","🚴🏻‍♀","o|3|1vU|1vS|8l","🚴🏼‍♀️","woman biking: medium-light skin tone","o|3|1vW|1vX|8l","🚴🏼‍♀","o|3|1vZ|1vX|8l","🚴🏽‍♀️","woman biking: medium skin tone","o|3|1vb|1vc|8l","🚴🏽‍♀","o|3|1ve|1vc|8l","🚴🏾‍♀️","woman biking: medium-dark skin tone","o|3|1vg|1vh|8l","🚴🏾‍♀","o|3|1vj|1vh|8l","🚴🏿‍♀️","woman biking: dark skin tone","o|3|1vl|1vm|8l","🚴🏿‍♀","o|3|1vo|1vm|8l","🚵","person mountain biking","o|3|1vq|1vr|8l","🚵🏻","person mountain biking: light skin tone","o|3|1vt|1vu|8l","🚵🏼","person mountain biking: medium-light skin tone","o|3|1vw|1vx|8l","🚵🏽","person mountain biking: medium skin tone","o|3|1vz|1w0|8l","🚵🏾","person mountain biking: medium-dark skin tone","o|3|1w2|1w3|8l","🚵🏿","person mountain biking: dark skin tone","o|3|1w5|1w6|8l","🚵‍♂️","man mountain biking","o|3|1w8|1w9|8l","🚵‍♂","o|3|1wB|1w9|8l","🚵🏻‍♂️","man mountain biking: light skin tone","o|3|1wD|1wE|8l","🚵🏻‍♂","o|3|1wG|1wE|8l","🚵🏼‍♂️","man mountain biking: medium-light skin tone","o|3|1wI|1wJ|8l","🚵🏼‍♂","o|3|1wL|1wJ|8l","🚵🏽‍♂️","man mountain biking: medium skin tone","o|3|1wN|1wO|8l","🚵🏽‍♂","o|3|1wQ|1wO|8l","🚵🏾‍♂️","man mountain biking: medium-dark skin tone","o|3|1wS|1wT|8l","🚵🏾‍♂","o|3|1wV|1wT|8l","🚵🏿‍♂️","man mountain biking: dark skin tone","o|3|1wX|1wY|8l","🚵🏿‍♂","o|3|1wa|1wY|8l","🚵‍♀️","woman mountain biking","o|3|1wc|1wd|8l","🚵‍♀","o|3|1wf|1wd|8l","🚵🏻‍♀️","woman mountain biking: light skin tone","o|3|1wh|1wi|8l","🚵🏻‍♀","o|3|1wk|1wi|8l","🚵🏼‍♀️","woman mountain biking: medium-light skin tone","o|3|1wm|1wn|8l","🚵🏼‍♀","o|3|1wp|1wn|8l","🚵🏽‍♀️","woman mountain biking: medium skin tone","o|3|1wr|1ws|8l","🚵🏽‍♀","o|3|1wu|1ws|8l","🚵🏾‍♀️","woman mountain biking: medium-dark skin tone","o|3|1ww|1wx|8l","🚵🏾‍♀","o|3|1wz|1wx|8l","🚵🏿‍♀️","woman mountain biking: dark skin tone","o|3|1x1|1x2|8l","🚵🏿‍♀","o|3|1x4|1x2|8l","🤸","person cartwheeling","o|3|1x6|1x7|8l","🤸🏻","person cartwheeling: light skin tone","o|3|1x9|1xA|8l","🤸🏼","person cartwheeling: medium-light skin tone","o|3|1xC|1xD|8l","🤸🏽","person cartwheeling: medium skin tone","o|3|1xF|1xG|8l","🤸🏾","person cartwheeling: medium-dark skin tone","o|3|1xI|1xJ|8l","🤸🏿","person cartwheeling: dark skin tone","o|3|1xL|1xM|8l","🤸‍♂️","man cartwheeling","o|3|1xO|1xP|8l","🤸‍♂","o|3|1xR|1xP|8l","🤸🏻‍♂️","man cartwheeling: light skin tone","o|3|1xT|1xU|8l","🤸🏻‍♂","o|3|1xW|1xU|8l","🤸🏼‍♂️","man cartwheeling: medium-light skin tone","o|3|1xY|1xZ|8l","🤸🏼‍♂","o|3|1xb|1xZ|8l","🤸🏽‍♂️","man cartwheeling: medium skin tone","o|3|1xd|1xe|8l","🤸🏽‍♂","o|3|1xg|1xe|8l","🤸🏾‍♂️","man cartwheeling: medium-dark skin tone","o|3|1xi|1xj|8l","🤸🏾‍♂","o|3|1xl|1xj|8l","🤸🏿‍♂️","man cartwheeling: dark skin tone","o|3|1xn|1xo|8l","🤸🏿‍♂","o|3|1xq|1xo|8l","🤸‍♀️","woman cartwheeling","o|3|1xs|1xt|8l","🤸‍♀","o|3|1xv|1xt|8l","🤸🏻‍♀️","woman cartwheeling: light skin tone","o|3|1xx|1xy|8l","🤸🏻‍♀","o|3|1y0|1xy|8l","🤸🏼‍♀️","woman cartwheeling: medium-light skin tone","o|3|1y2|1y3|8l","🤸🏼‍♀","o|3|1y5|1y3|8l","🤸🏽‍♀️","woman cartwheeling: medium skin tone","o|3|1y7|1y8|8l","🤸🏽‍♀","o|3|1yA|1y8|8l","🤸🏾‍♀️","woman cartwheeling: medium-dark skin tone","o|3|1yC|1yD|8l","🤸🏾‍♀","o|3|1yF|1yD|8l","🤸🏿‍♀️","woman cartwheeling: dark skin tone","o|3|1yH|1yI|8l","🤸🏿‍♀","o|3|1yK|1yI|8l","🤼","people wrestling","o|3|1yM|1yN|8l","🤼‍♂️","men wrestling","o|3|1yP|1yQ|8l","🤼‍♂","o|3|1yS|1yQ|8l","🤼‍♀️","women wrestling","o|3|1yU|1yV|8l","🤼‍♀","o|3|1yX|1yV|8l","🤽","person playing water polo","o|3|1yZ|1ya|8l","🤽🏻","person playing water polo: light skin tone","o|3|1yc|1yd|8l","🤽🏼","person playing water polo: medium-light skin tone","o|3|1yf|1yg|8l","🤽🏽","person playing water polo: medium skin tone","o|3|1yi|1yj|8l","🤽🏾","person playing water polo: medium-dark skin tone","o|3|1yl|1ym|8l","🤽🏿","person playing water polo: dark skin tone","o|3|1yo|1yp|8l","🤽‍♂️","man playing water polo","o|3|1yr|1ys|8l","🤽‍♂","o|3|1yu|1ys|8l","🤽🏻‍♂️","man playing water polo: light skin tone","o|3|1yw|1yx|8l","🤽🏻‍♂","o|3|1yz|1yx|8l","🤽🏼‍♂️","man playing water polo: medium-light skin tone","o|3|1z1|1z2|8l","🤽🏼‍♂","o|3|1z4|1z2|8l","🤽🏽‍♂️","man playing water polo: medium skin tone","o|3|1z6|1z7|8l","🤽🏽‍♂","o|3|1z9|1z7|8l","🤽🏾‍♂️","man playing water polo: medium-dark skin tone","o|3|1zB|1zC|8l","🤽🏾‍♂","o|3|1zE|1zC|8l","🤽🏿‍♂️","man playing water polo: dark skin tone","o|3|1zG|1zH|8l","🤽🏿‍♂","o|3|1zJ|1zH|8l","🤽‍♀️","woman playing water polo","o|3|1zL|1zM|8l","🤽‍♀","o|3|1zO|1zM|8l","🤽🏻‍♀️","woman playing water polo: light skin tone","o|3|1zQ|1zR|8l","🤽🏻‍♀","o|3|1zT|1zR|8l","🤽🏼‍♀️","woman playing water polo: medium-light skin tone","o|3|1zV|1zW|8l","🤽🏼‍♀","o|3|1zY|1zW|8l","🤽🏽‍♀️","woman playing water polo: medium skin tone","o|3|1za|1zb|8l","🤽🏽‍♀","o|3|1zd|1zb|8l","🤽🏾‍♀️","woman playing water polo: medium-dark skin tone","o|3|1zf|1zg|8l","🤽🏾‍♀","o|3|1zi|1zg|8l","🤽🏿‍♀️","woman playing water polo: dark skin tone","o|3|1zk|1zl|8l","🤽🏿‍♀","o|3|1zn|1zl|8l","🤾","person playing handball","o|3|1zp|1zq|8l","🤾🏻","person playing handball: light skin tone","o|3|1zs|1zt|8l","🤾🏼","person playing handball: medium-light skin tone","o|3|1zv|1zw|8l","🤾🏽","person playing handball: medium skin tone","o|3|1zy|1zz|8l","🤾🏾","person playing handball: medium-dark skin tone","o|3|201|202|8l","🤾🏿","person playing handball: dark skin tone","o|3|204|205|8l","🤾‍♂️","man playing handball","o|3|207|208|8l","🤾‍♂","o|3|20A|208|8l","🤾🏻‍♂️","man playing handball: light skin tone","o|3|20C|20D|8l","🤾🏻‍♂","o|3|20F|20D|8l","🤾🏼‍♂️","man playing handball: medium-light skin tone","o|3|20H|20I|8l","🤾🏼‍♂","o|3|20K|20I|8l","🤾🏽‍♂️","man playing handball: medium skin tone","o|3|20M|20N|8l","🤾🏽‍♂","o|3|20P|20N|8l","🤾🏾‍♂️","man playing handball: medium-dark skin tone","o|3|20R|20S|8l","🤾🏾‍♂","o|3|20U|20S|8l","🤾🏿‍♂️","man playing handball: dark skin tone","o|3|20W|20X|8l","🤾🏿‍♂","o|3|20Z|20X|8l","🤾‍♀️","woman playing handball","o|3|20b|20c|8l","🤾‍♀","o|3|20e|20c|8l","🤾🏻‍♀️","woman playing handball: light skin tone","o|3|20g|20h|8l","🤾🏻‍♀","o|3|20j|20h|8l","🤾🏼‍♀️","woman playing handball: medium-light skin tone","o|3|20l|20m|8l","🤾🏼‍♀","o|3|20o|20m|8l","🤾🏽‍♀️","woman playing handball: medium skin tone","o|3|20q|20r|8l","🤾🏽‍♀","o|3|20t|20r|8l","🤾🏾‍♀️","woman playing handball: medium-dark skin tone","o|3|20v|20w|8l","🤾🏾‍♀","o|3|20y|20w|8l","🤾🏿‍♀️","woman playing handball: dark skin tone","o|3|210|211|8l","🤾🏿‍♀","o|3|213|211|8l","🤹","person juggling","o|3|215|216|8l","🤹🏻","person juggling: light skin tone","o|3|218|219|8l","🤹🏼","person juggling: medium-light skin tone","o|3|21B|21C|8l","🤹🏽","person juggling: medium skin tone","o|3|21E|21F|8l","🤹🏾","person juggling: medium-dark skin tone","o|3|21H|21I|8l","🤹🏿","person juggling: dark skin tone","o|3|21K|21L|8l","🤹‍♂️","man juggling","o|3|21N|21O|8l","🤹‍♂","o|3|21Q|21O|8l","🤹🏻‍♂️","man juggling: light skin tone","o|3|21S|21T|8l","🤹🏻‍♂","o|3|21V|21T|8l","🤹🏼‍♂️","man juggling: medium-light skin tone","o|3|21X|21Y|8l","🤹🏼‍♂","o|3|21a|21Y|8l","🤹🏽‍♂️","man juggling: medium skin tone","o|3|21c|21d|8l","🤹🏽‍♂","o|3|21f|21d|8l","🤹🏾‍♂️","man juggling: medium-dark skin tone","o|3|21h|21i|8l","🤹🏾‍♂","o|3|21k|21i|8l","🤹🏿‍♂️","man juggling: dark skin tone","o|3|21m|21n|8l","🤹🏿‍♂","o|3|21p|21n|8l","🤹‍♀️","woman juggling","o|3|21r|21s|8l","🤹‍♀","o|3|21u|21s|8l","🤹🏻‍♀️","woman juggling: light skin tone","o|3|21w|21x|8l","🤹🏻‍♀","o|3|21z|21x|8l","🤹🏼‍♀️","woman juggling: medium-light skin tone","o|3|221|222|8l","🤹🏼‍♀","o|3|224|222|8l","🤹🏽‍♀️","woman juggling: medium skin tone","o|3|226|227|8l","🤹🏽‍♀","o|3|229|227|8l","🤹🏾‍♀️","woman juggling: medium-dark skin tone","o|3|22B|22C|8l","🤹🏾‍♀","o|3|22E|22C|8l","🤹🏿‍♀️","woman juggling: dark skin tone","o|3|22G|22H|8l","🤹🏿‍♀","o|3|22J|22H|8l","🧘","person in lotus position","o|3|22L|22M|8l","🧘🏻","person in lotus position: light skin tone","o|3|22O|22P|8l","🧘🏼","person in lotus position: medium-light skin tone","o|3|22R|22S|8l","🧘🏽","person in lotus position: medium skin tone","o|3|22U|22V|8l","🧘🏾","person in lotus position: medium-dark skin tone","o|3|22X|22Y|8l","🧘🏿","person in lotus position: dark skin tone","o|3|22a|22b|8l","🧘‍♂️","man in lotus position","o|3|22d|22e|8l","🧘‍♂","o|3|22g|22e|8l","🧘🏻‍♂️","man in lotus position: light skin tone","o|3|22i|22j|8l","🧘🏻‍♂","o|3|22l|22j|8l","🧘🏼‍♂️","man in lotus position: medium-light skin tone","o|3|22n|22o|8l","🧘🏼‍♂","o|3|22q|22o|8l","🧘🏽‍♂️","man in lotus position: medium skin tone","o|3|22s|22t|8l","🧘🏽‍♂","o|3|22v|22t|8l","🧘🏾‍♂️","man in lotus position: medium-dark skin tone","o|3|22x|22y|8l","🧘🏾‍♂","o|3|230|22y|8l","🧘🏿‍♂️","man in lotus position: dark skin tone","o|3|232|233|8l","🧘🏿‍♂","o|3|235|233|8l","🧘‍♀️","woman in lotus position","o|3|237|238|8l","🧘‍♀","o|3|23A|238|8l","🧘🏻‍♀️","woman in lotus position: light skin tone","o|3|23C|23D|8l","🧘🏻‍♀","o|3|23F|23D|8l","🧘🏼‍♀️","woman in lotus position: medium-light skin tone","o|3|23H|23I|8l","🧘🏼‍♀","o|3|23K|23I|8l","🧘🏽‍♀️","woman in lotus position: medium skin tone","o|3|23M|23N|8l","🧘🏽‍♀","o|3|23P|23N|8l","🧘🏾‍♀️","woman in lotus position: medium-dark skin tone","o|3|23R|23S|8l","🧘🏾‍♀","o|3|23U|23S|8l","🧘🏿‍♀️","woman in lotus position: dark skin tone","o|3|23W|23X|8l","🧘🏿‍♀","o|3|23Z|23X|8l","🛀","person taking bath","o|3|23b|23c|8l","🛀🏻","person taking bath: light skin tone","o|3|23e|23f|8l","🛀🏼","person taking bath: medium-light skin tone","o|3|23h|23i|8l","🛀🏽","person taking bath: medium skin tone","o|3|23k|23l|8l","🛀🏾","person taking bath: medium-dark skin tone","o|3|23n|23o|8l","🛀🏿","person taking bath: dark skin tone","o|3|23q|23r|8l","🛌","person in bed","o|3|23t|23u|8l","🛌🏻","person in bed: light skin tone","o|3|23w|23x|8l","🛌🏼","person in bed: medium-light skin tone","o|3|23z|240|8l","🛌🏽","person in bed: medium skin tone","o|3|242|243|8l","🛌🏾","person in bed: medium-dark skin tone","o|3|245|246|8l","🛌🏿","person in bed: dark skin tone","o|3|248|249|8l","🧑‍🤝‍🧑","people holding hands","o|3|24B|24C|8l","🧑🏻‍🤝‍🧑🏻","people holding hands: light skin tone","o|3|24E|24F|8l","🧑🏻‍🤝‍🧑🏼","people holding hands: light skin tone, medium-light skin tone","o|3|24H|24I|8l","🧑🏻‍🤝‍🧑🏽","people holding hands: light skin tone, medium skin tone","o|3|24K|24L|8l","🧑🏻‍🤝‍🧑🏾","people holding hands: light skin tone, medium-dark skin tone","o|3|24N|24O|8l","🧑🏻‍🤝‍🧑🏿","people holding hands: light skin tone, dark skin tone","o|3|24Q|24R|8l","🧑🏼‍🤝‍🧑🏻","people holding hands: medium-light skin tone, light skin tone","o|3|24T|24U|8l","🧑🏼‍🤝‍🧑🏼","people holding hands: medium-light skin tone","o|3|24W|24X|8l","🧑🏼‍🤝‍🧑🏽","people holding hands: medium-light skin tone, medium skin tone","o|3|24Z|24a|8l","🧑🏼‍🤝‍🧑🏾","people holding hands: medium-light skin tone, medium-dark skin tone","o|3|24c|24d|8l","🧑🏼‍🤝‍🧑🏿","people holding hands: medium-light skin tone, dark skin tone","o|3|24f|24g|8l","🧑🏽‍🤝‍🧑🏻","people holding hands: medium skin tone, light skin tone","o|3|24i|24j|8l","🧑🏽‍🤝‍🧑🏼","people holding hands: medium skin tone, medium-light skin tone","o|3|24l|24m|8l","🧑🏽‍🤝‍🧑🏽","people holding hands: medium skin tone","o|3|24o|24p|8l","🧑🏽‍🤝‍🧑🏾","people holding hands: medium skin tone, medium-dark skin tone","o|3|24r|24s|8l","🧑🏽‍🤝‍🧑🏿","people holding hands: medium skin tone, dark skin tone","o|3|24u|24v|8l","🧑🏾‍🤝‍🧑🏻","people holding hands: medium-dark skin tone, light skin tone","o|3|24x|24y|8l","🧑🏾‍🤝‍🧑🏼","people holding hands: medium-dark skin tone, medium-light skin tone","o|3|250|251|8l","🧑🏾‍🤝‍🧑🏽","people holding hands: medium-dark skin tone, medium skin tone","o|3|253|254|8l","🧑🏾‍🤝‍🧑🏾","people holding hands: medium-dark skin tone","o|3|256|257|8l","🧑🏾‍🤝‍🧑🏿","people holding hands: medium-dark skin tone, dark skin tone","o|3|259|25A|8l","🧑🏿‍🤝‍🧑🏻","people holding hands: dark skin tone, light skin tone","o|3|25C|25D|8l","🧑🏿‍🤝‍🧑🏼","people holding hands: dark skin tone, medium-light skin tone","o|3|25F|25G|8l","🧑🏿‍🤝‍🧑🏽","people holding hands: dark skin tone, medium skin tone","o|3|25I|25J|8l","🧑🏿‍🤝‍🧑🏾","people holding hands: dark skin tone, medium-dark skin tone","o|3|25L|25M|8l","🧑🏿‍🤝‍🧑🏿","people holding hands: dark skin tone","o|3|25O|25P|8l","👭","women holding hands","o|3|25R|25S|8l","👭🏻","women holding hands: light skin tone","o|3|25U|25V|8l","👩🏻‍🤝‍👩🏼","women holding hands: light skin tone, medium-light skin tone","o|3|25X|25Y|8l","👩🏻‍🤝‍👩🏽","women holding hands: light skin tone, medium skin tone","o|3|25a|25b|8l","👩🏻‍🤝‍👩🏾","women holding hands: light skin tone, medium-dark skin tone","o|3|25d|25e|8l","👩🏻‍🤝‍👩🏿","women holding hands: light skin tone, dark skin tone","o|3|25g|25h|8l","👩🏼‍🤝‍👩🏻","women holding hands: medium-light skin tone, light skin tone","o|3|25j|25k|8l","👭🏼","women holding hands: medium-light skin tone","o|3|25m|25n|8l","👩🏼‍🤝‍👩🏽","women holding hands: medium-light skin tone, medium skin tone","o|3|25p|25q|8l","👩🏼‍🤝‍👩🏾","women holding hands: medium-light skin tone, medium-dark skin tone","o|3|25s|25t|8l","👩🏼‍🤝‍👩🏿","women holding hands: medium-light skin tone, dark skin tone","o|3|25v|25w|8l","👩🏽‍🤝‍👩🏻","women holding hands: medium skin tone, light skin tone","o|3|25y|25z|8l","👩🏽‍🤝‍👩🏼","women holding hands: medium skin tone, medium-light skin tone","o|3|261|262|8l","👭🏽","women holding hands: medium skin tone","o|3|264|265|8l","👩🏽‍🤝‍👩🏾","women holding hands: medium skin tone, medium-dark skin tone","o|3|267|268|8l","👩🏽‍🤝‍👩🏿","women holding hands: medium skin tone, dark skin tone","o|3|26A|26B|8l","👩🏾‍🤝‍👩🏻","women holding hands: medium-dark skin tone, light skin tone","o|3|26D|26E|8l","👩🏾‍🤝‍👩🏼","women holding hands: medium-dark skin tone, medium-light skin tone","o|3|26G|26H|8l","👩🏾‍🤝‍👩🏽","women holding hands: medium-dark skin tone, medium skin tone","o|3|26J|26K|8l","👭🏾","women holding hands: medium-dark skin tone","o|3|26M|26N|8l","👩🏾‍🤝‍👩🏿","women holding hands: medium-dark skin tone, dark skin tone","o|3|26P|26Q|8l","👩🏿‍🤝‍👩🏻","women holding hands: dark skin tone, light skin tone","o|3|26S|26T|8l","👩🏿‍🤝‍👩🏼","women holding hands: dark skin tone, medium-light skin tone","o|3|26V|26W|8l","👩🏿‍🤝‍👩🏽","women holding hands: dark skin tone, medium skin tone","o|3|26Y|26Z|8l","👩🏿‍🤝‍👩🏾","women holding hands: dark skin tone, medium-dark skin tone","o|3|26b|26c|8l","👭🏿","women holding hands: dark skin tone","o|3|26e|26f|8l","👫","woman and man holding hands","o|3|26h|26i|8l","👫🏻","woman and man holding hands: light skin tone","o|3|26k|26l|8l","👩🏻‍🤝‍👨🏼","woman and man holding hands: light skin tone, medium-light skin tone","o|3|26n|26o|8l","👩🏻‍🤝‍👨🏽","woman and man holding hands: light skin tone, medium skin tone","o|3|26q|26r|8l","👩🏻‍🤝‍👨🏾","woman and man holding hands: light skin tone, medium-dark skin tone","o|3|26t|26u|8l","👩🏻‍🤝‍👨🏿","woman and man holding hands: light skin tone, dark skin tone","o|3|26w|26x|8l","👩🏼‍🤝‍👨🏻","woman and man holding hands: medium-light skin tone, light skin tone","o|3|26z|270|8l","👫🏼","woman and man holding hands: medium-light skin tone","o|3|272|273|8l","👩🏼‍🤝‍👨🏽","woman and man holding hands: medium-light skin tone, medium skin tone","o|3|275|276|8l","👩🏼‍🤝‍👨🏾","woman and man holding hands: medium-light skin tone, medium-dark skin tone","o|3|278|279|8l","👩🏼‍🤝‍👨🏿","woman and man holding hands: medium-light skin tone, dark skin tone","o|3|27B|27C|8l","👩🏽‍🤝‍👨🏻","woman and man holding hands: medium skin tone, light skin tone","o|3|27E|27F|8l","👩🏽‍🤝‍👨🏼","woman and man holding hands: medium skin tone, medium-light skin tone","o|3|27H|27I|8l","👫🏽","woman and man holding hands: medium skin tone","o|3|27K|27L|8l","👩🏽‍🤝‍👨🏾","woman and man holding hands: medium skin tone, medium-dark skin tone","o|3|27N|27O|8l","👩🏽‍🤝‍👨🏿","woman and man holding hands: medium skin tone, dark skin tone","o|3|27Q|27R|8l","👩🏾‍🤝‍👨🏻","woman and man holding hands: medium-dark skin tone, light skin tone","o|3|27T|27U|8l","👩🏾‍🤝‍👨🏼","woman and man holding hands: medium-dark skin tone, medium-light skin tone","o|3|27W|27X|8l","👩🏾‍🤝‍👨🏽","woman and man holding hands: medium-dark skin tone, medium skin tone","o|3|27Z|27a|8l","👫🏾","woman and man holding hands: medium-dark skin tone","o|3|27c|27d|8l","👩🏾‍🤝‍👨🏿","woman and man holding hands: medium-dark skin tone, dark skin tone","o|3|27f|27g|8l","👩🏿‍🤝‍👨🏻","woman and man holding hands: dark skin tone, light skin tone","o|3|27i|27j|8l","👩🏿‍🤝‍👨🏼","woman and man holding hands: dark skin tone, medium-light skin tone","o|3|27l|27m|8l","👩🏿‍🤝‍👨🏽","woman and man holding hands: dark skin tone, medium skin tone","o|3|27o|27p|8l","👩🏿‍🤝‍👨🏾","woman and man holding hands: dark skin tone, medium-dark skin tone","o|3|27r|27s|8l","👫🏿","woman and man holding hands: dark skin tone","o|3|27u|27v|8l","👬","men holding hands","o|3|27x|27y|8l","👬🏻","men holding hands: light skin tone","o|3|280|281|8l","👨🏻‍🤝‍👨🏼","men holding hands: light skin tone, medium-light skin tone","o|3|283|284|8l","👨🏻‍🤝‍👨🏽","men holding hands: light skin tone, medium skin tone","o|3|286|287|8l","👨🏻‍🤝‍👨🏾","men holding hands: light skin tone, medium-dark skin tone","o|3|289|28A|8l","👨🏻‍🤝‍👨🏿","men holding hands: light skin tone, dark skin tone","o|3|28C|28D|8l","👨🏼‍🤝‍👨🏻","men holding hands: medium-light skin tone, light skin tone","o|3|28F|28G|8l","👬🏼","men holding hands: medium-light skin tone","o|3|28I|28J|8l","👨🏼‍🤝‍👨🏽","men holding hands: medium-light skin tone, medium skin tone","o|3|28L|28M|8l","👨🏼‍🤝‍👨🏾","men holding hands: medium-light skin tone, medium-dark skin tone","o|3|28O|28P|8l","👨🏼‍🤝‍👨🏿","men holding hands: medium-light skin tone, dark skin tone","o|3|28R|28S|8l","👨🏽‍🤝‍👨🏻","men holding hands: medium skin tone, light skin tone","o|3|28U|28V|8l","👨🏽‍🤝‍👨🏼","men holding hands: medium skin tone, medium-light skin tone","o|3|28X|28Y|8l","👬🏽","men holding hands: medium skin tone","o|3|28a|28b|8l","👨🏽‍🤝‍👨🏾","men holding hands: medium skin tone, medium-dark skin tone","o|3|28d|28e|8l","👨🏽‍🤝‍👨🏿","men holding hands: medium skin tone, dark skin tone","o|3|28g|28h|8l","👨🏾‍🤝‍👨🏻","men holding hands: medium-dark skin tone, light skin tone","o|3|28j|28k|8l","👨🏾‍🤝‍👨🏼","men holding hands: medium-dark skin tone, medium-light skin tone","o|3|28m|28n|8l","👨🏾‍🤝‍👨🏽","men holding hands: medium-dark skin tone, medium skin tone","o|3|28p|28q|8l","👬🏾","men holding hands: medium-dark skin tone","o|3|28s|28t|8l","👨🏾‍🤝‍👨🏿","men holding hands: medium-dark skin tone, dark skin tone","o|3|28v|28w|8l","👨🏿‍🤝‍👨🏻","men holding hands: dark skin tone, light skin tone","o|3|28y|28z|8l","👨🏿‍🤝‍👨🏼","men holding hands: dark skin tone, medium-light skin tone","o|3|291|292|8l","👨🏿‍🤝‍👨🏽","men holding hands: dark skin tone, medium skin tone","o|3|294|295|8l","👨🏿‍🤝‍👨🏾","men holding hands: dark skin tone, medium-dark skin tone","o|3|297|298|8l","👬🏿","men holding hands: dark skin tone","o|3|29A|29B|8l","💏","kiss","o|3|29D|29E|8l","💏🏻","kiss: light skin tone","o|3|29G|29H|8l","💏🏼","kiss: medium-light skin tone","o|3|29J|29K|8l","💏🏽","kiss: medium skin tone","o|3|29M|29N|8l","💏🏾","kiss: medium-dark skin tone","o|3|29P|29Q|8l","💏🏿","kiss: dark skin tone","o|3|29S|29T|8l","🧑🏻‍❤️‍💋‍🧑🏼","kiss: person, person, light skin tone, medium-light skin tone","o|3|29V|29W|8l","🧑🏻‍❤‍💋‍🧑🏼","o|3|29Y|29W|8l","🧑🏻‍❤️‍💋‍🧑🏽","kiss: person, person, light skin tone, medium skin tone","o|3|29a|29b|8l","🧑🏻‍❤‍💋‍🧑🏽","o|3|29d|29b|8l","🧑🏻‍❤️‍💋‍🧑🏾","kiss: person, person, light skin tone, medium-dark skin tone","o|3|29f|29g|8l","🧑🏻‍❤‍💋‍🧑🏾","o|3|29i|29g|8l","🧑🏻‍❤️‍💋‍🧑🏿","kiss: person, person, light skin tone, dark skin tone","o|3|29k|29l|8l","🧑🏻‍❤‍💋‍🧑🏿","o|3|29n|29l|8l","🧑🏼‍❤️‍💋‍🧑🏻","kiss: person, person, medium-light skin tone, light skin tone","o|3|29p|29q|8l","🧑🏼‍❤‍💋‍🧑🏻","o|3|29s|29q|8l","🧑🏼‍❤️‍💋‍🧑🏽","kiss: person, person, medium-light skin tone, medium skin tone","o|3|29u|29v|8l","🧑🏼‍❤‍💋‍🧑🏽","o|3|29x|29v|8l","🧑🏼‍❤️‍💋‍🧑🏾","kiss: person, person, medium-light skin tone, medium-dark skin tone","o|3|29z|2A0|8l","🧑🏼‍❤‍💋‍🧑🏾","o|3|2A2|2A0|8l","🧑🏼‍❤️‍💋‍🧑🏿","kiss: person, person, medium-light skin tone, dark skin tone","o|3|2A4|2A5|8l","🧑🏼‍❤‍💋‍🧑🏿","o|3|2A7|2A5|8l","🧑🏽‍❤️‍💋‍🧑🏻","kiss: person, person, medium skin tone, light skin tone","o|3|2A9|2AA|8l","🧑🏽‍❤‍💋‍🧑🏻","o|3|2AC|2AA|8l","🧑🏽‍❤️‍💋‍🧑🏼","kiss: person, person, medium skin tone, medium-light skin tone","o|3|2AE|2AF|8l","🧑🏽‍❤‍💋‍🧑🏼","o|3|2AH|2AF|8l","🧑🏽‍❤️‍💋‍🧑🏾","kiss: person, person, medium skin tone, medium-dark skin tone","o|3|2AJ|2AK|8l","🧑🏽‍❤‍💋‍🧑🏾","o|3|2AM|2AK|8l","🧑🏽‍❤️‍💋‍🧑🏿","kiss: person, person, medium skin tone, dark skin tone","o|3|2AO|2AP|8l","🧑🏽‍❤‍💋‍🧑🏿","o|3|2AR|2AP|8l","🧑🏾‍❤️‍💋‍🧑🏻","kiss: person, person, medium-dark skin tone, light skin tone","o|3|2AT|2AU|8l","🧑🏾‍❤‍💋‍🧑🏻","o|3|2AW|2AU|8l","🧑🏾‍❤️‍💋‍🧑🏼","kiss: person, person, medium-dark skin tone, medium-light skin tone","o|3|2AY|2AZ|8l","🧑🏾‍❤‍💋‍🧑🏼","o|3|2Ab|2AZ|8l","🧑🏾‍❤️‍💋‍🧑🏽","kiss: person, person, medium-dark skin tone, medium skin tone","o|3|2Ad|2Ae|8l","🧑🏾‍❤‍💋‍🧑🏽","o|3|2Ag|2Ae|8l","🧑🏾‍❤️‍💋‍🧑🏿","kiss: person, person, medium-dark skin tone, dark skin tone","o|3|2Ai|2Aj|8l","🧑🏾‍❤‍💋‍🧑🏿","o|3|2Al|2Aj|8l","🧑🏿‍❤️‍💋‍🧑🏻","kiss: person, person, dark skin tone, light skin tone","o|3|2An|2Ao|8l","🧑🏿‍❤‍💋‍🧑🏻","o|3|2Aq|2Ao|8l","🧑🏿‍❤️‍💋‍🧑🏼","kiss: person, person, dark skin tone, medium-light skin tone","o|3|2As|2At|8l","🧑🏿‍❤‍💋‍🧑🏼","o|3|2Av|2At|8l","🧑🏿‍❤️‍💋‍🧑🏽","kiss: person, person, dark skin tone, medium skin tone","o|3|2Ax|2Ay|8l","🧑🏿‍❤‍💋‍🧑🏽","o|3|2B0|2Ay|8l","🧑🏿‍❤️‍💋‍🧑🏾","kiss: person, person, dark skin tone, medium-dark skin tone","o|3|2B2|2B3|8l","🧑🏿‍❤‍💋‍🧑🏾","o|3|2B5|2B3|8l","👩‍❤️‍💋‍👨","kiss: woman, man","o|3|2B7|2B8|8l","👩‍❤‍💋‍👨","o|3|2BA|2B8|8l","👩🏻‍❤️‍💋‍👨🏻","kiss: woman, man, light skin tone","o|3|2BC|2BD|8l","👩🏻‍❤‍💋‍👨🏻","o|3|2BF|2BD|8l","👩🏻‍❤️‍💋‍👨🏼","kiss: woman, man, light skin tone, medium-light skin tone","o|3|2BH|2BI|8l","👩🏻‍❤‍💋‍👨🏼","o|3|2BK|2BI|8l","👩🏻‍❤️‍💋‍👨🏽","kiss: woman, man, light skin tone, medium skin tone","o|3|2BM|2BN|8l","👩🏻‍❤‍💋‍👨🏽","o|3|2BP|2BN|8l","👩🏻‍❤️‍💋‍👨🏾","kiss: woman, man, light skin tone, medium-dark skin tone","o|3|2BR|2BS|8l","👩🏻‍❤‍💋‍👨🏾","o|3|2BU|2BS|8l","👩🏻‍❤️‍💋‍👨🏿","kiss: woman, man, light skin tone, dark skin tone","o|3|2BW|2BX|8l","👩🏻‍❤‍💋‍👨🏿","o|3|2BZ|2BX|8l","👩🏼‍❤️‍💋‍👨🏻","kiss: woman, man, medium-light skin tone, light skin tone","o|3|2Bb|2Bc|8l","👩🏼‍❤‍💋‍👨🏻","o|3|2Be|2Bc|8l","👩🏼‍❤️‍💋‍👨🏼","kiss: woman, man, medium-light skin tone","o|3|2Bg|2Bh|8l","👩🏼‍❤‍💋‍👨🏼","o|3|2Bj|2Bh|8l","👩🏼‍❤️‍💋‍👨🏽","kiss: woman, man, medium-light skin tone, medium skin tone","o|3|2Bl|2Bm|8l","👩🏼‍❤‍💋‍👨🏽","o|3|2Bo|2Bm|8l","👩🏼‍❤️‍💋‍👨🏾","kiss: woman, man, medium-light skin tone, medium-dark skin tone","o|3|2Bq|2Br|8l","👩🏼‍❤‍💋‍👨🏾","o|3|2Bt|2Br|8l","👩🏼‍❤️‍💋‍👨🏿","kiss: woman, man, medium-light skin tone, dark skin tone","o|3|2Bv|2Bw|8l","👩🏼‍❤‍💋‍👨🏿","o|3|2By|2Bw|8l","👩🏽‍❤️‍💋‍👨🏻","kiss: woman, man, medium skin tone, light skin tone","o|3|2C0|2C1|8l","👩🏽‍❤‍💋‍👨🏻","o|3|2C3|2C1|8l","👩🏽‍❤️‍💋‍👨🏼","kiss: woman, man, medium skin tone, medium-light skin tone","o|3|2C5|2C6|8l","👩🏽‍❤‍💋‍👨🏼","o|3|2C8|2C6|8l","👩🏽‍❤️‍💋‍👨🏽","kiss: woman, man, medium skin tone","o|3|2CA|2CB|8l","👩🏽‍❤‍💋‍👨🏽","o|3|2CD|2CB|8l","👩🏽‍❤️‍💋‍👨🏾","kiss: woman, man, medium skin tone, medium-dark skin tone","o|3|2CF|2CG|8l","👩🏽‍❤‍💋‍👨🏾","o|3|2CI|2CG|8l","👩🏽‍❤️‍💋‍👨🏿","kiss: woman, man, medium skin tone, dark skin tone","o|3|2CK|2CL|8l","👩🏽‍❤‍💋‍👨🏿","o|3|2CN|2CL|8l","👩🏾‍❤️‍💋‍👨🏻","kiss: woman, man, medium-dark skin tone, light skin tone","o|3|2CP|2CQ|8l","👩🏾‍❤‍💋‍👨🏻","o|3|2CS|2CQ|8l","👩🏾‍❤️‍💋‍👨🏼","kiss: woman, man, medium-dark skin tone, medium-light skin tone","o|3|2CU|2CV|8l","👩🏾‍❤‍💋‍👨🏼","o|3|2CX|2CV|8l","👩🏾‍❤️‍💋‍👨🏽","kiss: woman, man, medium-dark skin tone, medium skin tone","o|3|2CZ|2Ca|8l","👩🏾‍❤‍💋‍👨🏽","o|3|2Cc|2Ca|8l","👩🏾‍❤️‍💋‍👨🏾","kiss: woman, man, medium-dark skin tone","o|3|2Ce|2Cf|8l","👩🏾‍❤‍💋‍👨🏾","o|3|2Ch|2Cf|8l","👩🏾‍❤️‍💋‍👨🏿","kiss: woman, man, medium-dark skin tone, dark skin tone","o|3|2Cj|2Ck|8l","👩🏾‍❤‍💋‍👨🏿","o|3|2Cm|2Ck|8l","👩🏿‍❤️‍💋‍👨🏻","kiss: woman, man, dark skin tone, light skin tone","o|3|2Co|2Cp|8l","👩🏿‍❤‍💋‍👨🏻","o|3|2Cr|2Cp|8l","👩🏿‍❤️‍💋‍👨🏼","kiss: woman, man, dark skin tone, medium-light skin tone","o|3|2Ct|2Cu|8l","👩🏿‍❤‍💋‍👨🏼","o|3|2Cw|2Cu|8l","👩🏿‍❤️‍💋‍👨🏽","kiss: woman, man, dark skin tone, medium skin tone","o|3|2Cy|2Cz|8l","👩🏿‍❤‍💋‍👨🏽","o|3|2D1|2Cz|8l","👩🏿‍❤️‍💋‍👨🏾","kiss: woman, man, dark skin tone, medium-dark skin tone","o|3|2D3|2D4|8l","👩🏿‍❤‍💋‍👨🏾","o|3|2D6|2D4|8l","👩🏿‍❤️‍💋‍👨🏿","kiss: woman, man, dark skin tone","o|3|2D8|2D9|8l","👩🏿‍❤‍💋‍👨🏿","o|3|2DB|2D9|8l","👨‍❤️‍💋‍👨","kiss: man, man","o|3|2DD|2DE|8l","👨‍❤‍💋‍👨","o|3|2DG|2DE|8l","👨🏻‍❤️‍💋‍👨🏻","kiss: man, man, light skin tone","o|3|2DI|2DJ|8l","👨🏻‍❤‍💋‍👨🏻","o|3|2DL|2DJ|8l","👨🏻‍❤️‍💋‍👨🏼","kiss: man, man, light skin tone, medium-light skin tone","o|3|2DN|2DO|8l","👨🏻‍❤‍💋‍👨🏼","o|3|2DQ|2DO|8l","👨🏻‍❤️‍💋‍👨🏽","kiss: man, man, light skin tone, medium skin tone","o|3|2DS|2DT|8l","👨🏻‍❤‍💋‍👨🏽","o|3|2DV|2DT|8l","👨🏻‍❤️‍💋‍👨🏾","kiss: man, man, light skin tone, medium-dark skin tone","o|3|2DX|2DY|8l","👨🏻‍❤‍💋‍👨🏾","o|3|2Da|2DY|8l","👨🏻‍❤️‍💋‍👨🏿","kiss: man, man, light skin tone, dark skin tone","o|3|2Dc|2Dd|8l","👨🏻‍❤‍💋‍👨🏿","o|3|2Df|2Dd|8l","👨🏼‍❤️‍💋‍👨🏻","kiss: man, man, medium-light skin tone, light skin tone","o|3|2Dh|2Di|8l","👨🏼‍❤‍💋‍👨🏻","o|3|2Dk|2Di|8l","👨🏼‍❤️‍💋‍👨🏼","kiss: man, man, medium-light skin tone","o|3|2Dm|2Dn|8l","👨🏼‍❤‍💋‍👨🏼","o|3|2Dp|2Dn|8l","👨🏼‍❤️‍💋‍👨🏽","kiss: man, man, medium-light skin tone, medium skin tone","o|3|2Dr|2Ds|8l","👨🏼‍❤‍💋‍👨🏽","o|3|2Du|2Ds|8l","👨🏼‍❤️‍💋‍👨🏾","kiss: man, man, medium-light skin tone, medium-dark skin tone","o|3|2Dw|2Dx|8l","👨🏼‍❤‍💋‍👨🏾","o|3|2Dz|2Dx|8l","👨🏼‍❤️‍💋‍👨🏿","kiss: man, man, medium-light skin tone, dark skin tone","o|3|2E1|2E2|8l","👨🏼‍❤‍💋‍👨🏿","o|3|2E4|2E2|8l","👨🏽‍❤️‍💋‍👨🏻","kiss: man, man, medium skin tone, light skin tone","o|3|2E6|2E7|8l","👨🏽‍❤‍💋‍👨🏻","o|3|2E9|2E7|8l","👨🏽‍❤️‍💋‍👨🏼","kiss: man, man, medium skin tone, medium-light skin tone","o|3|2EB|2EC|8l","👨🏽‍❤‍💋‍👨🏼","o|3|2EE|2EC|8l","👨🏽‍❤️‍💋‍👨🏽","kiss: man, man, medium skin tone","o|3|2EG|2EH|8l","👨🏽‍❤‍💋‍👨🏽","o|3|2EJ|2EH|8l","👨🏽‍❤️‍💋‍👨🏾","kiss: man, man, medium skin tone, medium-dark skin tone","o|3|2EL|2EM|8l","👨🏽‍❤‍💋‍👨🏾","o|3|2EO|2EM|8l","👨🏽‍❤️‍💋‍👨🏿","kiss: man, man, medium skin tone, dark skin tone","o|3|2EQ|2ER|8l","👨🏽‍❤‍💋‍👨🏿","o|3|2ET|2ER|8l","👨🏾‍❤️‍💋‍👨🏻","kiss: man, man, medium-dark skin tone, light skin tone","o|3|2EV|2EW|8l","👨🏾‍❤‍💋‍👨🏻","o|3|2EY|2EW|8l","👨🏾‍❤️‍💋‍👨🏼","kiss: man, man, medium-dark skin tone, medium-light skin tone","o|3|2Ea|2Eb|8l","👨🏾‍❤‍💋‍👨🏼","o|3|2Ed|2Eb|8l","👨🏾‍❤️‍💋‍👨🏽","kiss: man, man, medium-dark skin tone, medium skin tone","o|3|2Ef|2Eg|8l","👨🏾‍❤‍💋‍👨🏽","o|3|2Ei|2Eg|8l","👨🏾‍❤️‍💋‍👨🏾","kiss: man, man, medium-dark skin tone","o|3|2Ek|2El|8l","👨🏾‍❤‍💋‍👨🏾","o|3|2En|2El|8l","👨🏾‍❤️‍💋‍👨🏿","kiss: man, man, medium-dark skin tone, dark skin tone","o|3|2Ep|2Eq|8l","👨🏾‍❤‍💋‍👨🏿","o|3|2Es|2Eq|8l","👨🏿‍❤️‍💋‍👨🏻","kiss: man, man, dark skin tone, light skin tone","o|3|2Eu|2Ev|8l","👨🏿‍❤‍💋‍👨🏻","o|3|2Ex|2Ev|8l","👨🏿‍❤️‍💋‍👨🏼","kiss: man, man, dark skin tone, medium-light skin tone","o|3|2Ez|2F0|8l","👨🏿‍❤‍💋‍👨🏼","o|3|2F2|2F0|8l","👨🏿‍❤️‍💋‍👨🏽","kiss: man, man, dark skin tone, medium skin tone","o|3|2F4|2F5|8l","👨🏿‍❤‍💋‍👨🏽","o|3|2F7|2F5|8l","👨🏿‍❤️‍💋‍👨🏾","kiss: man, man, dark skin tone, medium-dark skin tone","o|3|2F9|2FA|8l","👨🏿‍❤‍💋‍👨🏾","o|3|2FC|2FA|8l","👨🏿‍❤️‍💋‍👨🏿","kiss: man, man, dark skin tone","o|3|2FE|2FF|8l","👨🏿‍❤‍💋‍👨🏿","o|3|2FH|2FF|8l","👩‍❤️‍💋‍👩","kiss: woman, woman","o|3|2FJ|2FK|8l","👩‍❤‍💋‍👩","o|3|2FM|2FK|8l","👩🏻‍❤️‍💋‍👩🏻","kiss: woman, woman, light skin tone","o|3|2FO|2FP|8l","👩🏻‍❤‍💋‍👩🏻","o|3|2FR|2FP|8l","👩🏻‍❤️‍💋‍👩🏼","kiss: woman, woman, light skin tone, medium-light skin tone","o|3|2FT|2FU|8l","👩🏻‍❤‍💋‍👩🏼","o|3|2FW|2FU|8l","👩🏻‍❤️‍💋‍👩🏽","kiss: woman, woman, light skin tone, medium skin tone","o|3|2FY|2FZ|8l","👩🏻‍❤‍💋‍👩🏽","o|3|2Fb|2FZ|8l","👩🏻‍❤️‍💋‍👩🏾","kiss: woman, woman, light skin tone, medium-dark skin tone","o|3|2Fd|2Fe|8l","👩🏻‍❤‍💋‍👩🏾","o|3|2Fg|2Fe|8l","👩🏻‍❤️‍💋‍👩🏿","kiss: woman, woman, light skin tone, dark skin tone","o|3|2Fi|2Fj|8l","👩🏻‍❤‍💋‍👩🏿","o|3|2Fl|2Fj|8l","👩🏼‍❤️‍💋‍👩🏻","kiss: woman, woman, medium-light skin tone, light skin tone","o|3|2Fn|2Fo|8l","👩🏼‍❤‍💋‍👩🏻","o|3|2Fq|2Fo|8l","👩🏼‍❤️‍💋‍👩🏼","kiss: woman, woman, medium-light skin tone","o|3|2Fs|2Ft|8l","👩🏼‍❤‍💋‍👩🏼","o|3|2Fv|2Ft|8l","👩🏼‍❤️‍💋‍👩🏽","kiss: woman, woman, medium-light skin tone, medium skin tone","o|3|2Fx|2Fy|8l","👩🏼‍❤‍💋‍👩🏽","o|3|2G0|2Fy|8l","👩🏼‍❤️‍💋‍👩🏾","kiss: woman, woman, medium-light skin tone, medium-dark skin tone","o|3|2G2|2G3|8l","👩🏼‍❤‍💋‍👩🏾","o|3|2G5|2G3|8l","👩🏼‍❤️‍💋‍👩🏿","kiss: woman, woman, medium-light skin tone, dark skin tone","o|3|2G7|2G8|8l","👩🏼‍❤‍💋‍👩🏿","o|3|2GA|2G8|8l","👩🏽‍❤️‍💋‍👩🏻","kiss: woman, woman, medium skin tone, light skin tone","o|3|2GC|2GD|8l","👩🏽‍❤‍💋‍👩🏻","o|3|2GF|2GD|8l","👩🏽‍❤️‍💋‍👩🏼","kiss: woman, woman, medium skin tone, medium-light skin tone","o|3|2GH|2GI|8l","👩🏽‍❤‍💋‍👩🏼","o|3|2GK|2GI|8l","👩🏽‍❤️‍💋‍👩🏽","kiss: woman, woman, medium skin tone","o|3|2GM|2GN|8l","👩🏽‍❤‍💋‍👩🏽","o|3|2GP|2GN|8l","👩🏽‍❤️‍💋‍👩🏾","kiss: woman, woman, medium skin tone, medium-dark skin tone","o|3|2GR|2GS|8l","👩🏽‍❤‍💋‍👩🏾","o|3|2GU|2GS|8l","👩🏽‍❤️‍💋‍👩🏿","kiss: woman, woman, medium skin tone, dark skin tone","o|3|2GW|2GX|8l","👩🏽‍❤‍💋‍👩🏿","o|3|2GZ|2GX|8l","👩🏾‍❤️‍💋‍👩🏻","kiss: woman, woman, medium-dark skin tone, light skin tone","o|3|2Gb|2Gc|8l","👩🏾‍❤‍💋‍👩🏻","o|3|2Ge|2Gc|8l","👩🏾‍❤️‍💋‍👩🏼","kiss: woman, woman, medium-dark skin tone, medium-light skin tone","o|3|2Gg|2Gh|8l","👩🏾‍❤‍💋‍👩🏼","o|3|2Gj|2Gh|8l","👩🏾‍❤️‍💋‍👩🏽","kiss: woman, woman, medium-dark skin tone, medium skin tone","o|3|2Gl|2Gm|8l","👩🏾‍❤‍💋‍👩🏽","o|3|2Go|2Gm|8l","👩🏾‍❤️‍💋‍👩🏾","kiss: woman, woman, medium-dark skin tone","o|3|2Gq|2Gr|8l","👩🏾‍❤‍💋‍👩🏾","o|3|2Gt|2Gr|8l","👩🏾‍❤️‍💋‍👩🏿","kiss: woman, woman, medium-dark skin tone, dark skin tone","o|3|2Gv|2Gw|8l","👩🏾‍❤‍💋‍👩🏿","o|3|2Gy|2Gw|8l","👩🏿‍❤️‍💋‍👩🏻","kiss: woman, woman, dark skin tone, light skin tone","o|3|2H0|2H1|8l","👩🏿‍❤‍💋‍👩🏻","o|3|2H3|2H1|8l","👩🏿‍❤️‍💋‍👩🏼","kiss: woman, woman, dark skin tone, medium-light skin tone","o|3|2H5|2H6|8l","👩🏿‍❤‍💋‍👩🏼","o|3|2H8|2H6|8l","👩🏿‍❤️‍💋‍👩🏽","kiss: woman, woman, dark skin tone, medium skin tone","o|3|2HA|2HB|8l","👩🏿‍❤‍💋‍👩🏽","o|3|2HD|2HB|8l","👩🏿‍❤️‍💋‍👩🏾","kiss: woman, woman, dark skin tone, medium-dark skin tone","o|3|2HF|2HG|8l","👩🏿‍❤‍💋‍👩🏾","o|3|2HI|2HG|8l","👩🏿‍❤️‍💋‍👩🏿","kiss: woman, woman, dark skin tone","o|3|2HK|2HL|8l","👩🏿‍❤‍💋‍👩🏿","o|3|2HN|2HL|8l","💑","couple with heart","o|3|2HP|2HQ|8l","💑🏻","couple with heart: light skin tone","o|3|2HS|2HT|8l","💑🏼","couple with heart: medium-light skin tone","o|3|2HV|2HW|8l","💑🏽","couple with heart: medium skin tone","o|3|2HY|2HZ|8l","💑🏾","couple with heart: medium-dark skin tone","o|3|2Hb|2Hc|8l","💑🏿","couple with heart: dark skin tone","o|3|2He|2Hf|8l","🧑🏻‍❤️‍🧑🏼","couple with heart: person, person, light skin tone, medium-light skin tone","o|3|2Hh|2Hi|8l","🧑🏻‍❤‍🧑🏼","o|3|2Hk|2Hi|8l","🧑🏻‍❤️‍🧑🏽","couple with heart: person, person, light skin tone, medium skin tone","o|3|2Hm|2Hn|8l","🧑🏻‍❤‍🧑🏽","o|3|2Hp|2Hn|8l","🧑🏻‍❤️‍🧑🏾","couple with heart: person, person, light skin tone, medium-dark skin tone","o|3|2Hr|2Hs|8l","🧑🏻‍❤‍🧑🏾","o|3|2Hu|2Hs|8l","🧑🏻‍❤️‍🧑🏿","couple with heart: person, person, light skin tone, dark skin tone","o|3|2Hw|2Hx|8l","🧑🏻‍❤‍🧑🏿","o|3|2Hz|2Hx|8l","🧑🏼‍❤️‍🧑🏻","couple with heart: person, person, medium-light skin tone, light skin tone","o|3|2I1|2I2|8l","🧑🏼‍❤‍🧑🏻","o|3|2I4|2I2|8l","🧑🏼‍❤️‍🧑🏽","couple with heart: person, person, medium-light skin tone, medium skin tone","o|3|2I6|2I7|8l","🧑🏼‍❤‍🧑🏽","o|3|2I9|2I7|8l","🧑🏼‍❤️‍🧑🏾","couple with heart: person, person, medium-light skin tone, medium-dark skin tone","o|3|2IB|2IC|8l","🧑🏼‍❤‍🧑🏾","o|3|2IE|2IC|8l","🧑🏼‍❤️‍🧑🏿","couple with heart: person, person, medium-light skin tone, dark skin tone","o|3|2IG|2IH|8l","🧑🏼‍❤‍🧑🏿","o|3|2IJ|2IH|8l","🧑🏽‍❤️‍🧑🏻","couple with heart: person, person, medium skin tone, light skin tone","o|3|2IL|2IM|8l","🧑🏽‍❤‍🧑🏻","o|3|2IO|2IM|8l","🧑🏽‍❤️‍🧑🏼","couple with heart: person, person, medium skin tone, medium-light skin tone","o|3|2IQ|2IR|8l","🧑🏽‍❤‍🧑🏼","o|3|2IT|2IR|8l","🧑🏽‍❤️‍🧑🏾","couple with heart: person, person, medium skin tone, medium-dark skin tone","o|3|2IV|2IW|8l","🧑🏽‍❤‍🧑🏾","o|3|2IY|2IW|8l","🧑🏽‍❤️‍🧑🏿","couple with heart: person, person, medium skin tone, dark skin tone","o|3|2Ia|2Ib|8l","🧑🏽‍❤‍🧑🏿","o|3|2Id|2Ib|8l","🧑🏾‍❤️‍🧑🏻","couple with heart: person, person, medium-dark skin tone, light skin tone","o|3|2If|2Ig|8l","🧑🏾‍❤‍🧑🏻","o|3|2Ii|2Ig|8l","🧑🏾‍❤️‍🧑🏼","couple with heart: person, person, medium-dark skin tone, medium-light skin tone","o|3|2Ik|2Il|8l","🧑🏾‍❤‍🧑🏼","o|3|2In|2Il|8l","🧑🏾‍❤️‍🧑🏽","couple with heart: person, person, medium-dark skin tone, medium skin tone","o|3|2Ip|2Iq|8l","🧑🏾‍❤‍🧑🏽","o|3|2Is|2Iq|8l","🧑🏾‍❤️‍🧑🏿","couple with heart: person, person, medium-dark skin tone, dark skin tone","o|3|2Iu|2Iv|8l","🧑🏾‍❤‍🧑🏿","o|3|2Ix|2Iv|8l","🧑🏿‍❤️‍🧑🏻","couple with heart: person, person, dark skin tone, light skin tone","o|3|2Iz|2J0|8l","🧑🏿‍❤‍🧑🏻","o|3|2J2|2J0|8l","🧑🏿‍❤️‍🧑🏼","couple with heart: person, person, dark skin tone, medium-light skin tone","o|3|2J4|2J5|8l","🧑🏿‍❤‍🧑🏼","o|3|2J7|2J5|8l","🧑🏿‍❤️‍🧑🏽","couple with heart: person, person, dark skin tone, medium skin tone","o|3|2J9|2JA|8l","🧑🏿‍❤‍🧑🏽","o|3|2JC|2JA|8l","🧑🏿‍❤️‍🧑🏾","couple with heart: person, person, dark skin tone, medium-dark skin tone","o|3|2JE|2JF|8l","🧑🏿‍❤‍🧑🏾","o|3|2JH|2JF|8l","👩‍❤️‍👨","couple with heart: woman, man","o|3|2JJ|2JK|8l","👩‍❤‍👨","o|3|2JM|2JK|8l","👩🏻‍❤️‍👨🏻","couple with heart: woman, man, light skin tone","o|3|2JO|2JP|8l","👩🏻‍❤‍👨🏻","o|3|2JR|2JP|8l","👩🏻‍❤️‍👨🏼","couple with heart: woman, man, light skin tone, medium-light skin tone","o|3|2JT|2JU|8l","👩🏻‍❤‍👨🏼","o|3|2JW|2JU|8l","👩🏻‍❤️‍👨🏽","couple with heart: woman, man, light skin tone, medium skin tone","o|3|2JY|2JZ|8l","👩🏻‍❤‍👨🏽","o|3|2Jb|2JZ|8l","👩🏻‍❤️‍👨🏾","couple with heart: woman, man, light skin tone, medium-dark skin tone","o|3|2Jd|2Je|8l","👩🏻‍❤‍👨🏾","o|3|2Jg|2Je|8l","👩🏻‍❤️‍👨🏿","couple with heart: woman, man, light skin tone, dark skin tone","o|3|2Ji|2Jj|8l","👩🏻‍❤‍👨🏿","o|3|2Jl|2Jj|8l","👩🏼‍❤️‍👨🏻","couple with heart: woman, man, medium-light skin tone, light skin tone","o|3|2Jn|2Jo|8l","👩🏼‍❤‍👨🏻","o|3|2Jq|2Jo|8l","👩🏼‍❤️‍👨🏼","couple with heart: woman, man, medium-light skin tone","o|3|2Js|2Jt|8l","👩🏼‍❤‍👨🏼","o|3|2Jv|2Jt|8l","👩🏼‍❤️‍👨🏽","couple with heart: woman, man, medium-light skin tone, medium skin tone","o|3|2Jx|2Jy|8l","👩🏼‍❤‍👨🏽","o|3|2K0|2Jy|8l","👩🏼‍❤️‍👨🏾","couple with heart: woman, man, medium-light skin tone, medium-dark skin tone","o|3|2K2|2K3|8l","👩🏼‍❤‍👨🏾","o|3|2K5|2K3|8l","👩🏼‍❤️‍👨🏿","couple with heart: woman, man, medium-light skin tone, dark skin tone","o|3|2K7|2K8|8l","👩🏼‍❤‍👨🏿","o|3|2KA|2K8|8l","👩🏽‍❤️‍👨🏻","couple with heart: woman, man, medium skin tone, light skin tone","o|3|2KC|2KD|8l","👩🏽‍❤‍👨🏻","o|3|2KF|2KD|8l","👩🏽‍❤️‍👨🏼","couple with heart: woman, man, medium skin tone, medium-light skin tone","o|3|2KH|2KI|8l","👩🏽‍❤‍👨🏼","o|3|2KK|2KI|8l","👩🏽‍❤️‍👨🏽","couple with heart: woman, man, medium skin tone","o|3|2KM|2KN|8l","👩🏽‍❤‍👨🏽","o|3|2KP|2KN|8l","👩🏽‍❤️‍👨🏾","couple with heart: woman, man, medium skin tone, medium-dark skin tone","o|3|2KR|2KS|8l","👩🏽‍❤‍👨🏾","o|3|2KU|2KS|8l","👩🏽‍❤️‍👨🏿","couple with heart: woman, man, medium skin tone, dark skin tone","o|3|2KW|2KX|8l","👩🏽‍❤‍👨🏿","o|3|2KZ|2KX|8l","👩🏾‍❤️‍👨🏻","couple with heart: woman, man, medium-dark skin tone, light skin tone","o|3|2Kb|2Kc|8l","👩🏾‍❤‍👨🏻","o|3|2Ke|2Kc|8l","👩🏾‍❤️‍👨🏼","couple with heart: woman, man, medium-dark skin tone, medium-light skin tone","o|3|2Kg|2Kh|8l","👩🏾‍❤‍👨🏼","o|3|2Kj|2Kh|8l","👩🏾‍❤️‍👨🏽","couple with heart: woman, man, medium-dark skin tone, medium skin tone","o|3|2Kl|2Km|8l","👩🏾‍❤‍👨🏽","o|3|2Ko|2Km|8l","👩🏾‍❤️‍👨🏾","couple with heart: woman, man, medium-dark skin tone","o|3|2Kq|2Kr|8l","👩🏾‍❤‍👨🏾","o|3|2Kt|2Kr|8l","👩🏾‍❤️‍👨🏿","couple with heart: woman, man, medium-dark skin tone, dark skin tone","o|3|2Kv|2Kw|8l","👩🏾‍❤‍👨🏿","o|3|2Ky|2Kw|8l","👩🏿‍❤️‍👨🏻","couple with heart: woman, man, dark skin tone, light skin tone","o|3|2L0|2L1|8l","👩🏿‍❤‍👨🏻","o|3|2L3|2L1|8l","👩🏿‍❤️‍👨🏼","couple with heart: woman, man, dark skin tone, medium-light skin tone","o|3|2L5|2L6|8l","👩🏿‍❤‍👨🏼","o|3|2L8|2L6|8l","👩🏿‍❤️‍👨🏽","couple with heart: woman, man, dark skin tone, medium skin tone","o|3|2LA|2LB|8l","👩🏿‍❤‍👨🏽","o|3|2LD|2LB|8l","👩🏿‍❤️‍👨🏾","couple with heart: woman, man, dark skin tone, medium-dark skin tone","o|3|2LF|2LG|8l","👩🏿‍❤‍👨🏾","o|3|2LI|2LG|8l","👩🏿‍❤️‍👨🏿","couple with heart: woman, man, dark skin tone","o|3|2LK|2LL|8l","👩🏿‍❤‍👨🏿","o|3|2LN|2LL|8l","👨‍❤️‍👨","couple with heart: man, man","o|3|2LP|2LQ|8l","👨‍❤‍👨","o|3|2LS|2LQ|8l","👨🏻‍❤️‍👨🏻","couple with heart: man, man, light skin tone","o|3|2LU|2LV|8l","👨🏻‍❤‍👨🏻","o|3|2LX|2LV|8l","👨🏻‍❤️‍👨🏼","couple with heart: man, man, light skin tone, medium-light skin tone","o|3|2LZ|2La|8l","👨🏻‍❤‍👨🏼","o|3|2Lc|2La|8l","👨🏻‍❤️‍👨🏽","couple with heart: man, man, light skin tone, medium skin tone","o|3|2Le|2Lf|8l","👨🏻‍❤‍👨🏽","o|3|2Lh|2Lf|8l","👨🏻‍❤️‍👨🏾","couple with heart: man, man, light skin tone, medium-dark skin tone","o|3|2Lj|2Lk|8l","👨🏻‍❤‍👨🏾","o|3|2Lm|2Lk|8l","👨🏻‍❤️‍👨🏿","couple with heart: man, man, light skin tone, dark skin tone","o|3|2Lo|2Lp|8l","👨🏻‍❤‍👨🏿","o|3|2Lr|2Lp|8l","👨🏼‍❤️‍👨🏻","couple with heart: man, man, medium-light skin tone, light skin tone","o|3|2Lt|2Lu|8l","👨🏼‍❤‍👨🏻","o|3|2Lw|2Lu|8l","👨🏼‍❤️‍👨🏼","couple with heart: man, man, medium-light skin tone","o|3|2Ly|2Lz|8l","👨🏼‍❤‍👨🏼","o|3|2M1|2Lz|8l","👨🏼‍❤️‍👨🏽","couple with heart: man, man, medium-light skin tone, medium skin tone","o|3|2M3|2M4|8l","👨🏼‍❤‍👨🏽","o|3|2M6|2M4|8l","👨🏼‍❤️‍👨🏾","couple with heart: man, man, medium-light skin tone, medium-dark skin tone","o|3|2M8|2M9|8l","👨🏼‍❤‍👨🏾","o|3|2MB|2M9|8l","👨🏼‍❤️‍👨🏿","couple with heart: man, man, medium-light skin tone, dark skin tone","o|3|2MD|2ME|8l","👨🏼‍❤‍👨🏿","o|3|2MG|2ME|8l","👨🏽‍❤️‍👨🏻","couple with heart: man, man, medium skin tone, light skin tone","o|3|2MI|2MJ|8l","👨🏽‍❤‍👨🏻","o|3|2ML|2MJ|8l","👨🏽‍❤️‍👨🏼","couple with heart: man, man, medium skin tone, medium-light skin tone","o|3|2MN|2MO|8l","👨🏽‍❤‍👨🏼","o|3|2MQ|2MO|8l","👨🏽‍❤️‍👨🏽","couple with heart: man, man, medium skin tone","o|3|2MS|2MT|8l","👨🏽‍❤‍👨🏽","o|3|2MV|2MT|8l","👨🏽‍❤️‍👨🏾","couple with heart: man, man, medium skin tone, medium-dark skin tone","o|3|2MX|2MY|8l","👨🏽‍❤‍👨🏾","o|3|2Ma|2MY|8l","👨🏽‍❤️‍👨🏿","couple with heart: man, man, medium skin tone, dark skin tone","o|3|2Mc|2Md|8l","👨🏽‍❤‍👨🏿","o|3|2Mf|2Md|8l","👨🏾‍❤️‍👨🏻","couple with heart: man, man, medium-dark skin tone, light skin tone","o|3|2Mh|2Mi|8l","👨🏾‍❤‍👨🏻","o|3|2Mk|2Mi|8l","👨🏾‍❤️‍👨🏼","couple with heart: man, man, medium-dark skin tone, medium-light skin tone","o|3|2Mm|2Mn|8l","👨🏾‍❤‍👨🏼","o|3|2Mp|2Mn|8l","👨🏾‍❤️‍👨🏽","couple with heart: man, man, medium-dark skin tone, medium skin tone","o|3|2Mr|2Ms|8l","👨🏾‍❤‍👨🏽","o|3|2Mu|2Ms|8l","👨🏾‍❤️‍👨🏾","couple with heart: man, man, medium-dark skin tone","o|3|2Mw|2Mx|8l","👨🏾‍❤‍👨🏾","o|3|2Mz|2Mx|8l","👨🏾‍❤️‍👨🏿","couple with heart: man, man, medium-dark skin tone, dark skin tone","o|3|2N1|2N2|8l","👨🏾‍❤‍👨🏿","o|3|2N4|2N2|8l","👨🏿‍❤️‍👨🏻","couple with heart: man, man, dark skin tone, light skin tone","o|3|2N6|2N7|8l","👨🏿‍❤‍👨🏻","o|3|2N9|2N7|8l","👨🏿‍❤️‍👨🏼","couple with heart: man, man, dark skin tone, medium-light skin tone","o|3|2NB|2NC|8l","👨🏿‍❤‍👨🏼","o|3|2NE|2NC|8l","👨🏿‍❤️‍👨🏽","couple with heart: man, man, dark skin tone, medium skin tone","o|3|2NG|2NH|8l","👨🏿‍❤‍👨🏽","o|3|2NJ|2NH|8l","👨🏿‍❤️‍👨🏾","couple with heart: man, man, dark skin tone, medium-dark skin tone","o|3|2NL|2NM|8l","👨🏿‍❤‍👨🏾","o|3|2NO|2NM|8l","👨🏿‍❤️‍👨🏿","couple with heart: man, man, dark skin tone","o|3|2NQ|2NR|8l","👨🏿‍❤‍👨🏿","o|3|2NT|2NR|8l","👩‍❤️‍👩","couple with heart: woman, woman","o|3|2NV|2NW|8l","👩‍❤‍👩","o|3|2NY|2NW|8l","👩🏻‍❤️‍👩🏻","couple with heart: woman, woman, light skin tone","o|3|2Na|2Nb|8l","👩🏻‍❤‍👩🏻","o|3|2Nd|2Nb|8l","👩🏻‍❤️‍👩🏼","couple with heart: woman, woman, light skin tone, medium-light skin tone","o|3|2Nf|2Ng|8l","👩🏻‍❤‍👩🏼","o|3|2Ni|2Ng|8l","👩🏻‍❤️‍👩🏽","couple with heart: woman, woman, light skin tone, medium skin tone","o|3|2Nk|2Nl|8l","👩🏻‍❤‍👩🏽","o|3|2Nn|2Nl|8l","👩🏻‍❤️‍👩🏾","couple with heart: woman, woman, light skin tone, medium-dark skin tone","o|3|2Np|2Nq|8l","👩🏻‍❤‍👩🏾","o|3|2Ns|2Nq|8l","👩🏻‍❤️‍👩🏿","couple with heart: woman, woman, light skin tone, dark skin tone","o|3|2Nu|2Nv|8l","👩🏻‍❤‍👩🏿","o|3|2Nx|2Nv|8l","👩🏼‍❤️‍👩🏻","couple with heart: woman, woman, medium-light skin tone, light skin tone","o|3|2Nz|2O0|8l","👩🏼‍❤‍👩🏻","o|3|2O2|2O0|8l","👩🏼‍❤️‍👩🏼","couple with heart: woman, woman, medium-light skin tone","o|3|2O4|2O5|8l","👩🏼‍❤‍👩🏼","o|3|2O7|2O5|8l","👩🏼‍❤️‍👩🏽","couple with heart: woman, woman, medium-light skin tone, medium skin tone","o|3|2O9|2OA|8l","👩🏼‍❤‍👩🏽","o|3|2OC|2OA|8l","👩🏼‍❤️‍👩🏾","couple with heart: woman, woman, medium-light skin tone, medium-dark skin tone","o|3|2OE|2OF|8l","👩🏼‍❤‍👩🏾","o|3|2OH|2OF|8l","👩🏼‍❤️‍👩🏿","couple with heart: woman, woman, medium-light skin tone, dark skin tone","o|3|2OJ|2OK|8l","👩🏼‍❤‍👩🏿","o|3|2OM|2OK|8l","👩🏽‍❤️‍👩🏻","couple with heart: woman, woman, medium skin tone, light skin tone","o|3|2OO|2OP|8l","👩🏽‍❤‍👩🏻","o|3|2OR|2OP|8l","👩🏽‍❤️‍👩🏼","couple with heart: woman, woman, medium skin tone, medium-light skin tone","o|3|2OT|2OU|8l","👩🏽‍❤‍👩🏼","o|3|2OW|2OU|8l","👩🏽‍❤️‍👩🏽","couple with heart: woman, woman, medium skin tone","o|3|2OY|2OZ|8l","👩🏽‍❤‍👩🏽","o|3|2Ob|2OZ|8l","👩🏽‍❤️‍👩🏾","couple with heart: woman, woman, medium skin tone, medium-dark skin tone","o|3|2Od|2Oe|8l","👩🏽‍❤‍👩🏾","o|3|2Og|2Oe|8l","👩🏽‍❤️‍👩🏿","couple with heart: woman, woman, medium skin tone, dark skin tone","o|3|2Oi|2Oj|8l","👩🏽‍❤‍👩🏿","o|3|2Ol|2Oj|8l","👩🏾‍❤️‍👩🏻","couple with heart: woman, woman, medium-dark skin tone, light skin tone","o|3|2On|2Oo|8l","👩🏾‍❤‍👩🏻","o|3|2Oq|2Oo|8l","👩🏾‍❤️‍👩🏼","couple with heart: woman, woman, medium-dark skin tone, medium-light skin tone","o|3|2Os|2Ot|8l","👩🏾‍❤‍👩🏼","o|3|2Ov|2Ot|8l","👩🏾‍❤️‍👩🏽","couple with heart: woman, woman, medium-dark skin tone, medium skin tone","o|3|2Ox|2Oy|8l","👩🏾‍❤‍👩🏽","o|3|2P0|2Oy|8l","👩🏾‍❤️‍👩🏾","couple with heart: woman, woman, medium-dark skin tone","o|3|2P2|2P3|8l","👩🏾‍❤‍👩🏾","o|3|2P5|2P3|8l","👩🏾‍❤️‍👩🏿","couple with heart: woman, woman, medium-dark skin tone, dark skin tone","o|3|2P7|2P8|8l","👩🏾‍❤‍👩🏿","o|3|2PA|2P8|8l","👩🏿‍❤️‍👩🏻","couple with heart: woman, woman, dark skin tone, light skin tone","o|3|2PC|2PD|8l","👩🏿‍❤‍👩🏻","o|3|2PF|2PD|8l","👩🏿‍❤️‍👩🏼","couple with heart: woman, woman, dark skin tone, medium-light skin tone","o|3|2PH|2PI|8l","👩🏿‍❤‍👩🏼","o|3|2PK|2PI|8l","👩🏿‍❤️‍👩🏽","couple with heart: woman, woman, dark skin tone, medium skin tone","o|3|2PM|2PN|8l","👩🏿‍❤‍👩🏽","o|3|2PP|2PN|8l","👩🏿‍❤️‍👩🏾","couple with heart: woman, woman, dark skin tone, medium-dark skin tone","o|3|2PR|2PS|8l","👩🏿‍❤‍👩🏾","o|3|2PU|2PS|8l","👩🏿‍❤️‍👩🏿","couple with heart: woman, woman, dark skin tone","o|3|2PW|2PX|8l","👩🏿‍❤‍👩🏿","o|3|2PZ|2PX|8l","👨‍👩‍👦","family: man, woman, boy","o|3|2Pb|2Pc|8l","👨‍👩‍👧","family: man, woman, girl","o|3|2Pe|2Pf|8l","👨‍👩‍👧‍👦","family: man, woman, girl, boy","o|3|2Ph|2Pi|8l","👨‍👩‍👦‍👦","family: man, woman, boy, boy","o|3|2Pk|2Pl|8l","👨‍👩‍👧‍👧","family: man, woman, girl, girl","o|3|2Pn|2Po|8l","👨‍👨‍👦","family: man, man, boy","o|3|2Pq|2Pr|8l","👨‍👨‍👧","family: man, man, girl","o|3|2Pt|2Pu|8l","👨‍👨‍👧‍👦","family: man, man, girl, boy","o|3|2Pw|2Px|8l","👨‍👨‍👦‍👦","family: man, man, boy, boy","o|3|2Pz|2Q0|8l","👨‍👨‍👧‍👧","family: man, man, girl, girl","o|3|2Q2|2Q3|8l","👩‍👩‍👦","family: woman, woman, boy","o|3|2Q5|2Q6|8l","👩‍👩‍👧","family: woman, woman, girl","o|3|2Q8|2Q9|8l","👩‍👩‍👧‍👦","family: woman, woman, girl, boy","o|3|2QB|2QC|8l","👩‍👩‍👦‍👦","family: woman, woman, boy, boy","o|3|2QE|2QF|8l","👩‍👩‍👧‍👧","family: woman, woman, girl, girl","o|3|2QH|2QI|8l","👨‍👦","family: man, boy","o|3|2QK|2QL|8l","👨‍👦‍👦","family: man, boy, boy","o|3|2QN|2QO|8l","👨‍👧","family: man, girl","o|3|2QQ|2QR|8l","👨‍👧‍👦","family: man, girl, boy","o|3|2QT|2QU|8l","👨‍👧‍👧","family: man, girl, girl","o|3|2QW|2QX|8l","👩‍👦","family: woman, boy","o|3|2QZ|2Qa|8l","👩‍👦‍👦","family: woman, boy, boy","o|3|2Qc|2Qd|8l","👩‍👧","family: woman, girl","o|3|2Qf|2Qg|8l","👩‍👧‍👦","family: woman, girl, boy","o|3|2Qi|2Qj|8l","👩‍👧‍👧","family: woman, girl, girl","o|3|2Ql|2Qm|8l","🗣️","speaking head","o|3|2Qo|2Qp|8l","🗣","o|3|2Qr|2Qp|8l","👤","bust in silhouette","o|3|2Qt|2Qu|8l","👥","busts in silhouette","o|3|2Qw|2Qx|8l","🫂","people hugging","o|3|2Qz|2R0|8l","👪","family","o|3|2R2|2R3|8l","🧑‍🧑‍🧒","family: adult, adult, child","o|3|2R5|2R6|8l","🧑‍🧑‍🧒‍🧒","family: adult, adult, child, child","o|3|2R8|2R9|8l","🧑‍🧒","family: adult, child","o|3|2RB|2RC|8l","🧑‍🧒‍🧒","family: adult, child, child","o|3|2RE|2RF|8l","👣","footprints","o|3|2RH|2RI|8l","🏻","light skin tone","Component","o|3|2RK|2RL|2RM","🏼","medium-light skin tone","o|3|2RO|2RP|2RM","🏽","medium skin tone","o|3|2RR|2RS|2RM","🏾","medium-dark skin tone","o|3|2RU|2RV|2RM","🏿","dark skin tone","o|3|2RX|2RY|2RM","🦰","red hair","o|3|2Ra|2Rb|2RM","🦱","curly hair","o|3|2Rd|2Re|2RM","🦳","white hair","o|3|2Rg|2Rh|2RM","🦲","bald","o|3|2Rj|2Rk|2RM","🐵","monkey face","Animals & Nature","o|3|2Rm|2Rn|2Ro","🐒","monkey","o|3|2Rq|2Rr|2Ro","🦍","gorilla","o|3|2Rt|2Ru|2Ro","🦧","orangutan","o|3|2Rw|2Rx|2Ro","🐶","dog face","o|3|2Rz|2S0|2Ro","🐕","dog","o|3|2S2|2S3|2Ro","🦮","guide dog","o|3|2S5|2S6|2Ro","🐕‍🦺","service dog","o|3|2S8|2S9|2Ro","🐩","poodle","o|3|2SB|2SC|2Ro","🐺","wolf","o|3|2SE|2SF|2Ro","🦊","fox","o|3|2SH|2SI|2Ro","🦝","raccoon","o|3|2SK|2SL|2Ro","🐱","cat face","o|3|2SN|2SO|2Ro","🐈","cat","o|3|2SQ|2SR|2Ro","🐈‍⬛","black cat","o|3|2ST|2SU|2Ro","🦁","lion","o|3|2SW|2SX|2Ro","🐯","tiger face","o|3|2SZ|2Sa|2Ro","🐅","tiger","o|3|2Sc|2Sd|2Ro","🐆","leopard","o|3|2Sf|2Sg|2Ro","🐴","horse face","o|3|2Si|2Sj|2Ro","🫎","moose","o|3|2Sl|2Sm|2Ro","🫏","donkey","o|3|2So|2Sp|2Ro","🐎","horse","o|3|2Sr|2Ss|2Ro","🦄","unicorn","o|3|2Su|2Sv|2Ro","🦓","zebra","o|3|2Sx|2Sy|2Ro","🦌","deer","o|3|2T0|2T1|2Ro","🦬","bison","o|3|2T3|2T4|2Ro","🐮","cow face","o|3|2T6|2T7|2Ro","🐂","ox","o|3|2T9|2TA|2Ro","🐃","water buffalo","o|3|2TC|2TD|2Ro","🐄","cow","o|3|2TF|2TG|2Ro","🐷","pig face","o|3|2TI|2TJ|2Ro","🐖","pig","o|3|2TL|2TM|2Ro","🐗","boar","o|3|2TO|2TP|2Ro","🐽","pig nose","o|3|2TR|2TS|2Ro","🐏","ram","o|3|2TU|2TV|2Ro","🐑","ewe","o|3|2TX|2TY|2Ro","🐐","goat","o|3|2Ta|2Tb|2Ro","🐪","camel","o|3|2Td|2Te|2Ro","🐫","two-hump camel","o|3|2Tg|2Th|2Ro","🦙","llama","o|3|2Tj|2Tk|2Ro","🦒","giraffe","o|3|2Tm|2Tn|2Ro","🐘","elephant","o|3|2Tp|2Tq|2Ro","🦣","mammoth","o|3|2Ts|2Tt|2Ro","🦏","rhinoceros","o|3|2Tv|2Tw|2Ro","🦛","hippopotamus","o|3|2Ty|2Tz|2Ro","🐭","mouse face","o|3|2U1|2U2|2Ro","🐁","mouse","o|3|2U4|2U5|2Ro","🐀","rat","o|3|2U7|2U8|2Ro","🐹","hamster","o|3|2UA|2UB|2Ro","🐰","rabbit face","o|3|2UD|2UE|2Ro","🐇","rabbit","o|3|2UG|2UH|2Ro","🐿️","chipmunk","o|3|2UJ|2UK|2Ro","🐿","o|3|2UM|2UK|2Ro","🦫","beaver","o|3|2UO|2UP|2Ro","🦔","hedgehog","o|3|2UR|2US|2Ro","🦇","bat","o|3|2UU|2UV|2Ro","🐻","bear","o|3|2UX|2UY|2Ro","🐻‍❄️","polar bear","o|3|2Ua|2Ub|2Ro","🐻‍❄","o|3|2Ud|2Ub|2Ro","🐨","koala","o|3|2Uf|2Ug|2Ro","🐼","panda","o|3|2Ui|2Uj|2Ro","🦥","sloth","o|3|2Ul|2Um|2Ro","🦦","otter","o|3|2Uo|2Up|2Ro","🦨","skunk","o|3|2Ur|2Us|2Ro","🦘","kangaroo","o|3|2Uu|2Uv|2Ro","🦡","badger","o|3|2Ux|2Uy|2Ro","🐾","paw prints","o|3|2V0|2V1|2Ro","🦃","turkey","o|3|2V3|2V4|2Ro","🐔","chicken","o|3|2V6|2V7|2Ro","🐓","rooster","o|3|2V9|2VA|2Ro","🐣","hatching chick","o|3|2VC|2VD|2Ro","🐤","baby chick","o|3|2VF|2VG|2Ro","🐥","front-facing baby chick","o|3|2VI|2VJ|2Ro","🐦","bird","o|3|2VL|2VM|2Ro","🐧","penguin","o|3|2VO|2VP|2Ro","🕊️","dove","o|3|2VR|2VS|2Ro","🕊","o|3|2VU|2VS|2Ro","🦅","eagle","o|3|2VW|2VX|2Ro","🦆","duck","o|3|2VZ|2Va|2Ro","🦢","swan","o|3|2Vc|2Vd|2Ro","🦉","owl","o|3|2Vf|2Vg|2Ro","🦤","dodo","o|3|2Vi|2Vj|2Ro","🪶","feather","o|3|2Vl|2Vm|2Ro","🦩","flamingo","o|3|2Vo|2Vp|2Ro","🦚","peacock","o|3|2Vr|2Vs|2Ro","🦜","parrot","o|3|2Vu|2Vv|2Ro","🪽","wing","o|3|2Vx|2Vy|2Ro","🐦‍⬛","black bird","o|3|2W0|2W1|2Ro","🪿","goose","o|3|2W3|2W4|2Ro","🐦‍🔥","phoenix","o|3|2W6|2W7|2Ro","🐸","frog","o|3|2W9|2WA|2Ro","🐊","crocodile","o|3|2WC|2WD|2Ro","🐢","turtle","o|3|2WF|2WG|2Ro","🦎","lizard","o|3|2WI|2WJ|2Ro","🐍","snake","o|3|2WL|2WM|2Ro","🐲","dragon face","o|3|2WO|2WP|2Ro","🐉","dragon","o|3|2WR|2WS|2Ro","🦕","sauropod","o|3|2WU|2WV|2Ro","🦖","T-Rex","o|3|2WX|2WY|2Ro","🐳","spouting whale","o|3|2Wa|2Wb|2Ro","🐋","whale","o|3|2Wd|2We|2Ro","🐬","dolphin","o|3|2Wg|2Wh|2Ro","🦭","seal","o|3|2Wj|2Wk|2Ro","🐟","fish","o|3|2Wm|2Wn|2Ro","🐠","tropical fish","o|3|2Wp|2Wq|2Ro","🐡","blowfish","o|3|2Ws|2Wt|2Ro","🦈","shark","o|3|2Wv|2Ww|2Ro","🐙","octopus","o|3|2Wy|2Wz|2Ro","🐚","spiral shell","o|3|2X1|2X2|2Ro","🪸","coral","o|3|2X4|2X5|2Ro","🪼","jellyfish","o|3|2X7|2X8|2Ro","🐌","snail","o|3|2XA|2XB|2Ro","🦋","butterfly","o|3|2XD|2XE|2Ro","🐛","bug","o|3|2XG|2XH|2Ro","🐜","ant","o|3|2XJ|2XK|2Ro","🐝","honeybee","o|3|2XM|2XN|2Ro","🪲","beetle","o|3|2XP|2XQ|2Ro","🐞","lady beetle","o|3|2XS|2XT|2Ro","🦗","cricket","o|3|2XV|2XW|2Ro","🪳","cockroach","o|3|2XY|2XZ|2Ro","🕷️","spider","o|3|2Xb|2Xc|2Ro","🕷","o|3|2Xe|2Xc|2Ro","🕸️","spider web","o|3|2Xg|2Xh|2Ro","🕸","o|3|2Xj|2Xh|2Ro","🦂","scorpion","o|3|2Xl|2Xm|2Ro","🦟","mosquito","o|3|2Xo|2Xp|2Ro","🪰","fly","o|3|2Xr|2Xs|2Ro","🪱","worm","o|3|2Xu|2Xv|2Ro","🦠","microbe","o|3|2Xx|2Xy|2Ro","💐","bouquet","o|3|2Y0|2Y1|2Ro","🌸","cherry blossom","o|3|2Y3|2Y4|2Ro","💮","white flower","o|3|2Y6|2Y7|2Ro","🪷","lotus","o|3|2Y9|2YA|2Ro","🏵️","rosette","o|3|2YC|2YD|2Ro","🏵","o|3|2YF|2YD|2Ro","🌹","rose","o|3|2YH|2YI|2Ro","🥀","wilted flower","o|3|2YK|2YL|2Ro","🌺","hibiscus","o|3|2YN|2YO|2Ro","🌻","sunflower","o|3|2YQ|2YR|2Ro","🌼","blossom","o|3|2YT|2YU|2Ro","🌷","tulip","o|3|2YW|2YX|2Ro","🪻","hyacinth","o|3|2YZ|2Ya|2Ro","🌱","seedling","o|3|2Yc|2Yd|2Ro","🪴","potted plant","o|3|2Yf|2Yg|2Ro","🌲","evergreen tree","o|3|2Yi|2Yj|2Ro","🌳","deciduous tree","o|3|2Yl|2Ym|2Ro","🌴","palm tree","o|3|2Yo|2Yp|2Ro","🌵","cactus","o|3|2Yr|2Ys|2Ro","🌾","sheaf of rice","o|3|2Yu|2Yv|2Ro","🌿","herb","o|3|2Yx|2Yy|2Ro","☘️","shamrock","o|3|2Z0|2Z1|2Ro","☘","o|3|2Z3|2Z1|2Ro","🍀","four leaf clover","o|3|2Z5|2Z6|2Ro","🍁","maple leaf","o|3|2Z8|2Z9|2Ro","🍂","fallen leaf","o|3|2ZB|2ZC|2Ro","🍃","leaf fluttering in wind","o|3|2ZE|2ZF|2Ro","🪹","empty nest","o|3|2ZH|2ZI|2Ro","🪺","nest with eggs","o|3|2ZK|2ZL|2Ro","🍄","mushroom","o|3|2ZN|2ZO|2Ro","🍇","grapes","Food & Drink","o|3|2ZQ|2ZR|2ZS","🍈","melon","o|3|2ZU|2ZV|2ZS","🍉","watermelon","o|3|2ZX|2ZY|2ZS","🍊","tangerine","o|3|2Za|2Zb|2ZS","🍋","lemon","o|3|2Zd|2Ze|2ZS","🍋‍🟩","lime","o|3|2Zg|2Zh|2ZS","🍌","banana","o|3|2Zj|2Zk|2ZS","🍍","pineapple","o|3|2Zm|2Zn|2ZS","🥭","mango","o|3|2Zp|2Zq|2ZS","🍎","red apple","o|3|2Zs|2Zt|2ZS","🍏","green apple","o|3|2Zv|2Zw|2ZS","🍐","pear","o|3|2Zy|2Zz|2ZS","🍑","peach","o|3|2a1|2a2|2ZS","🍒","cherries","o|3|2a4|2a5|2ZS","🍓","strawberry","o|3|2a7|2a8|2ZS","🫐","blueberries","o|3|2aA|2aB|2ZS","🥝","kiwi fruit","o|3|2aD|2aE|2ZS","🍅","tomato","o|3|2aG|2aH|2ZS","🫒","olive","o|3|2aJ|2aK|2ZS","🥥","coconut","o|3|2aM|2aN|2ZS","🥑","avocado","o|3|2aP|2aQ|2ZS","🍆","eggplant","o|3|2aS|2aT|2ZS","🥔","potato","o|3|2aV|2aW|2ZS","🥕","carrot","o|3|2aY|2aZ|2ZS","🌽","ear of corn","o|3|2ab|2ac|2ZS","🌶️","hot pepper","o|3|2ae|2af|2ZS","🌶","o|3|2ah|2af|2ZS","🫑","bell pepper","o|3|2aj|2ak|2ZS","🥒","cucumber","o|3|2am|2an|2ZS","🥬","leafy green","o|3|2ap|2aq|2ZS","🥦","broccoli","o|3|2as|2at|2ZS","🧄","garlic","o|3|2av|2aw|2ZS","🧅","onion","o|3|2ay|2az|2ZS","🥜","peanuts","o|3|2b1|2b2|2ZS","🫘","beans","o|3|2b4|2b5|2ZS","🌰","chestnut","o|3|2b7|2b8|2ZS","🫚","ginger root","o|3|2bA|2bB|2ZS","🫛","pea pod","o|3|2bD|2bE|2ZS","🍄‍🟫","brown mushroom","o|3|2bG|2bH|2ZS","🍞","bread","o|3|2bJ|2bK|2ZS","🥐","croissant","o|3|2bM|2bN|2ZS","🥖","baguette bread","o|3|2bP|2bQ|2ZS","🫓","flatbread","o|3|2bS|2bT|2ZS","🥨","pretzel","o|3|2bV|2bW|2ZS","🥯","bagel","o|3|2bY|2bZ|2ZS","🥞","pancakes","o|3|2bb|2bc|2ZS","🧇","waffle","o|3|2be|2bf|2ZS","🧀","cheese wedge","o|3|2bh|2bi|2ZS","🍖","meat on bone","o|3|2bk|2bl|2ZS","🍗","poultry leg","o|3|2bn|2bo|2ZS","🥩","cut of meat","o|3|2bq|2br|2ZS","🥓","bacon","o|3|2bt|2bu|2ZS","🍔","hamburger","o|3|2bw|2bx|2ZS","🍟","french fries","o|3|2bz|2c0|2ZS","🍕","pizza","o|3|2c2|2c3|2ZS","🌭","hot dog","o|3|2c5|2c6|2ZS","🥪","sandwich","o|3|2c8|2c9|2ZS","🌮","taco","o|3|2cB|2cC|2ZS","🌯","burrito","o|3|2cE|2cF|2ZS","🫔","tamale","o|3|2cH|2cI|2ZS","🥙","stuffed flatbread","o|3|2cK|2cL|2ZS","🧆","falafel","o|3|2cN|2cO|2ZS","🥚","egg","o|3|2cQ|2cR|2ZS","🍳","cooking","o|3|2cT|2cU|2ZS","🥘","shallow pan of food","o|3|2cW|2cX|2ZS","🍲","pot of food","o|3|2cZ|2ca|2ZS","🫕","fondue","o|3|2cc|2cd|2ZS","🥣","bowl with spoon","o|3|2cf|2cg|2ZS","🥗","green salad","o|3|2ci|2cj|2ZS","🍿","popcorn","o|3|2cl|2cm|2ZS","🧈","butter","o|3|2co|2cp|2ZS","🧂","salt","o|3|2cr|2cs|2ZS","🥫","canned food","o|3|2cu|2cv|2ZS","🍱","bento box","o|3|2cx|2cy|2ZS","🍘","rice cracker","o|3|2d0|2d1|2ZS","🍙","rice ball","o|3|2d3|2d4|2ZS","🍚","cooked rice","o|3|2d6|2d7|2ZS","🍛","curry rice","o|3|2d9|2dA|2ZS","🍜","steaming bowl","o|3|2dC|2dD|2ZS","🍝","spaghetti","o|3|2dF|2dG|2ZS","🍠","roasted sweet potato","o|3|2dI|2dJ|2ZS","🍢","oden","o|3|2dL|2dM|2ZS","🍣","sushi","o|3|2dO|2dP|2ZS","🍤","fried shrimp","o|3|2dR|2dS|2ZS","🍥","fish cake with swirl","o|3|2dU|2dV|2ZS","🥮","moon cake","o|3|2dX|2dY|2ZS","🍡","dango","o|3|2da|2db|2ZS","🥟","dumpling","o|3|2dd|2de|2ZS","🥠","fortune cookie","o|3|2dg|2dh|2ZS","🥡","takeout box","o|3|2dj|2dk|2ZS","🦀","crab","o|3|2dm|2dn|2ZS","🦞","lobster","o|3|2dp|2dq|2ZS","🦐","shrimp","o|3|2ds|2dt|2ZS","🦑","squid","o|3|2dv|2dw|2ZS","🦪","oyster","o|3|2dy|2dz|2ZS","🍦","soft ice cream","o|3|2e1|2e2|2ZS","🍧","shaved ice","o|3|2e4|2e5|2ZS","🍨","ice cream","o|3|2e7|2e8|2ZS","🍩","doughnut","o|3|2eA|2eB|2ZS","🍪","cookie","o|3|2eD|2eE|2ZS","🎂","birthday cake","o|3|2eG|2eH|2ZS","🍰","shortcake","o|3|2eJ|2eK|2ZS","🧁","cupcake","o|3|2eM|2eN|2ZS","🥧","pie","o|3|2eP|2eQ|2ZS","🍫","chocolate bar","o|3|2eS|2eT|2ZS","🍬","candy","o|3|2eV|2eW|2ZS","🍭","lollipop","o|3|2eY|2eZ|2ZS","🍮","custard","o|3|2eb|2ec|2ZS","🍯","honey pot","o|3|2ee|2ef|2ZS","🍼","baby bottle","o|3|2eh|2ei|2ZS","🥛","glass of milk","o|3|2ek|2el|2ZS","☕","hot beverage","o|3|2en|2eo|2ZS","🫖","teapot","o|3|2eq|2er|2ZS","🍵","teacup without handle","o|3|2et|2eu|2ZS","🍶","sake","o|3|2ew|2ex|2ZS","🍾","bottle with popping cork","o|3|2ez|2f0|2ZS","🍷","wine glass","o|3|2f2|2f3|2ZS","🍸","cocktail glass","o|3|2f5|2f6|2ZS","🍹","tropical drink","o|3|2f8|2f9|2ZS","🍺","beer mug","o|3|2fB|2fC|2ZS","🍻","clinking beer mugs","o|3|2fE|2fF|2ZS","🥂","clinking glasses","o|3|2fH|2fI|2ZS","🥃","tumbler glass","o|3|2fK|2fL|2ZS","🫗","pouring liquid","o|3|2fN|2fO|2ZS","🥤","cup with straw","o|3|2fQ|2fR|2ZS","🧋","bubble tea","o|3|2fT|2fU|2ZS","🧃","beverage box","o|3|2fW|2fX|2ZS","🧉","mate","o|3|2fZ|2fa|2ZS","🧊","ice","o|3|2fc|2fd|2ZS","🥢","chopsticks","o|3|2ff|2fg|2ZS","🍽️","fork and knife with plate","o|3|2fi|2fj|2ZS","🍽","o|3|2fl|2fj|2ZS","🍴","fork and knife","o|3|2fn|2fo|2ZS","🥄","spoon","o|3|2fq|2fr|2ZS","🔪","kitchen knife","o|3|2ft|2fu|2ZS","🫙","jar","o|3|2fw|2fx|2ZS","🏺","amphora","o|3|2fz|2g0|2ZS","🌍","globe showing Europe-Africa","Travel & Places","o|3|2g2|2g3|2g4","🌎","globe showing Americas","o|3|2g6|2g7|2g4","🌏","globe showing Asia-Australia","o|3|2g9|2gA|2g4","🌐","globe with meridians","o|3|2gC|2gD|2g4","🗺️","world map","o|3|2gF|2gG|2g4","🗺","o|3|2gI|2gG|2g4","🗾","map of Japan","o|3|2gK|2gL|2g4","🧭","compass","o|3|2gN|2gO|2g4","🏔️","snow-capped mountain","o|3|2gQ|2gR|2g4","🏔","o|3|2gT|2gR|2g4","⛰️","mountain","o|3|2gV|2gW|2g4","⛰","o|3|2gY|2gW|2g4","🌋","volcano","o|3|2ga|2gb|2g4","🗻","mount fuji","o|3|2gd|2ge|2g4","🏕️","camping","o|3|2gg|2gh|2g4","🏕","o|3|2gj|2gh|2g4","🏖️","beach with umbrella","o|3|2gl|2gm|2g4","🏖","o|3|2go|2gm|2g4","🏜️","desert","o|3|2gq|2gr|2g4","🏜","o|3|2gt|2gr|2g4","🏝️","desert island","o|3|2gv|2gw|2g4","🏝","o|3|2gy|2gw|2g4","🏞️","national park","o|3|2h0|2h1|2g4","🏞","o|3|2h3|2h1|2g4","🏟️","stadium","o|3|2h5|2h6|2g4","🏟","o|3|2h8|2h6|2g4","🏛️","classical building","o|3|2hA|2hB|2g4","🏛","o|3|2hD|2hB|2g4","🏗️","building construction","o|3|2hF|2hG|2g4","🏗","o|3|2hI|2hG|2g4","🧱","brick","o|3|2hK|2hL|2g4","🪨","rock","o|3|2hN|2hO|2g4","🪵","wood","o|3|2hQ|2hR|2g4","🛖","hut","o|3|2hT|2hU|2g4","🏘️","houses","o|3|2hW|2hX|2g4","🏘","o|3|2hZ|2hX|2g4","🏚️","derelict house","o|3|2hb|2hc|2g4","🏚","o|3|2he|2hc|2g4","🏠","house","o|3|2hg|2hh|2g4","🏡","house with garden","o|3|2hj|2hk|2g4","🏢","office building","o|3|2hm|2hn|2g4","🏣","Japanese post office","o|3|2hp|2hq|2g4","🏤","post office","o|3|2hs|2ht|2g4","🏥","hospital","o|3|2hv|2hw|2g4","🏦","bank","o|3|2hy|2hz|2g4","🏨","hotel","o|3|2i1|2i2|2g4","🏩","love hotel","o|3|2i4|2i5|2g4","🏪","convenience store","o|3|2i7|2i8|2g4","🏫","school","o|3|2iA|2iB|2g4","🏬","department store","o|3|2iD|2iE|2g4","🏭","factory","o|3|2iG|2iH|2g4","🏯","Japanese castle","o|3|2iJ|2iK|2g4","🏰","castle","o|3|2iM|2iN|2g4","💒","wedding","o|3|2iP|2iQ|2g4","🗼","Tokyo tower","o|3|2iS|2iT|2g4","🗽","Statue of Liberty","o|3|2iV|2iW|2g4","⛪","church","o|3|2iY|2iZ|2g4","🕌","mosque","o|3|2ib|2ic|2g4","🛕","hindu temple","o|3|2ie|2if|2g4","🕍","synagogue","o|3|2ih|2ii|2g4","⛩️","shinto shrine","o|3|2ik|2il|2g4","⛩","o|3|2in|2il|2g4","🕋","kaaba","o|3|2ip|2iq|2g4","⛲","fountain","o|3|2is|2it|2g4","⛺","tent","o|3|2iv|2iw|2g4","🌁","foggy","o|3|2iy|2iz|2g4","🌃","night with stars","o|3|2j1|2j2|2g4","🏙️","cityscape","o|3|2j4|2j5|2g4","🏙","o|3|2j7|2j5|2g4","🌄","sunrise over mountains","o|3|2j9|2jA|2g4","🌅","sunrise","o|3|2jC|2jD|2g4","🌆","cityscape at dusk","o|3|2jF|2jG|2g4","🌇","sunset","o|3|2jI|2jJ|2g4","🌉","bridge at night","o|3|2jL|2jM|2g4","♨️","hot springs","o|3|2jO|2jP|2g4","♨","o|3|2jR|2jP|2g4","🎠","carousel horse","o|3|2jT|2jU|2g4","🛝","playground slide","o|3|2jW|2jX|2g4","🎡","ferris wheel","o|3|2jZ|2ja|2g4","🎢","roller coaster","o|3|2jc|2jd|2g4","💈","barber pole","o|3|2jf|2jg|2g4","🎪","circus tent","o|3|2ji|2jj|2g4","🚂","locomotive","o|3|2jl|2jm|2g4","🚃","railway car","o|3|2jo|2jp|2g4","🚄","high-speed train","o|3|2jr|2js|2g4","🚅","bullet train","o|3|2ju|2jv|2g4","🚆","train","o|3|2jx|2jy|2g4","🚇","metro","o|3|2k0|2k1|2g4","🚈","light rail","o|3|2k3|2k4|2g4","🚉","station","o|3|2k6|2k7|2g4","🚊","tram","o|3|2k9|2kA|2g4","🚝","monorail","o|3|2kC|2kD|2g4","🚞","mountain railway","o|3|2kF|2kG|2g4","🚋","tram car","o|3|2kI|2kJ|2g4","🚌","bus","o|3|2kL|2kM|2g4","🚍","oncoming bus","o|3|2kO|2kP|2g4","🚎","trolleybus","o|3|2kR|2kS|2g4","🚐","minibus","o|3|2kU|2kV|2g4","🚑","ambulance","o|3|2kX|2kY|2g4","🚒","fire engine","o|3|2ka|2kb|2g4","🚓","police car","o|3|2kd|2ke|2g4","🚔","oncoming police car","o|3|2kg|2kh|2g4","🚕","taxi","o|3|2kj|2kk|2g4","🚖","oncoming taxi","o|3|2km|2kn|2g4","🚗","automobile","o|3|2kp|2kq|2g4","🚘","oncoming automobile","o|3|2ks|2kt|2g4","🚙","sport utility vehicle","o|3|2kv|2kw|2g4","🛻","pickup truck","o|3|2ky|2kz|2g4","🚚","delivery truck","o|3|2l1|2l2|2g4","🚛","articulated lorry","o|3|2l4|2l5|2g4","🚜","tractor","o|3|2l7|2l8|2g4","🏎️","racing car","o|3|2lA|2lB|2g4","🏎","o|3|2lD|2lB|2g4","🏍️","motorcycle","o|3|2lF|2lG|2g4","🏍","o|3|2lI|2lG|2g4","🛵","motor scooter","o|3|2lK|2lL|2g4","🦽","manual wheelchair","o|3|2lN|2lO|2g4","🦼","motorized wheelchair","o|3|2lQ|2lR|2g4","🛺","auto rickshaw","o|3|2lT|2lU|2g4","🚲","bicycle","o|3|2lW|2lX|2g4","🛴","kick scooter","o|3|2lZ|2la|2g4","🛹","skateboard","o|3|2lc|2ld|2g4","🛼","roller skate","o|3|2lf|2lg|2g4","🚏","bus stop","o|3|2li|2lj|2g4","🛣️","motorway","o|3|2ll|2lm|2g4","🛣","o|3|2lo|2lm|2g4","🛤️","railway track","o|3|2lq|2lr|2g4","🛤","o|3|2lt|2lr|2g4","🛢️","oil drum","o|3|2lv|2lw|2g4","🛢","o|3|2ly|2lw|2g4","⛽","fuel pump","o|3|2m0|2m1|2g4","🛞","wheel","o|3|2m3|2m4|2g4","🚨","police car light","o|3|2m6|2m7|2g4","🚥","horizontal traffic light","o|3|2m9|2mA|2g4","🚦","vertical traffic light","o|3|2mC|2mD|2g4","🛑","stop sign","o|3|2mF|2mG|2g4","🚧","construction","o|3|2mI|2mJ|2g4","⚓","anchor","o|3|2mL|2mM|2g4","🛟","ring buoy","o|3|2mO|2mP|2g4","⛵","sailboat","o|3|2mR|2mS|2g4","🛶","canoe","o|3|2mU|2mV|2g4","🚤","speedboat","o|3|2mX|2mY|2g4","🛳️","passenger ship","o|3|2ma|2mb|2g4","🛳","o|3|2md|2mb|2g4","⛴️","ferry","o|3|2mf|2mg|2g4","⛴","o|3|2mi|2mg|2g4","🛥️","motor boat","o|3|2mk|2ml|2g4","🛥","o|3|2mn|2ml|2g4","🚢","ship","o|3|2mp|2mq|2g4","✈️","airplane","o|3|2ms|2mt|2g4","✈","o|3|2mv|2mt|2g4","🛩️","small airplane","o|3|2mx|2my|2g4","🛩","o|3|2n0|2my|2g4","🛫","airplane departure","o|3|2n2|2n3|2g4","🛬","airplane arrival","o|3|2n5|2n6|2g4","🪂","parachute","o|3|2n8|2n9|2g4","💺","seat","o|3|2nB|2nC|2g4","🚁","helicopter","o|3|2nE|2nF|2g4","🚟","suspension railway","o|3|2nH|2nI|2g4","🚠","mountain cableway","o|3|2nK|2nL|2g4","🚡","aerial tramway","o|3|2nN|2nO|2g4","🛰️","satellite","o|3|2nQ|2nR|2g4","🛰","o|3|2nT|2nR|2g4","🚀","rocket","o|3|2nV|2nW|2g4","🛸","flying saucer","o|3|2nY|2nZ|2g4","🛎️","bellhop bell","o|3|2nb|2nc|2g4","🛎","o|3|2ne|2nc|2g4","🧳","luggage","o|3|2ng|2nh|2g4","⌛","hourglass done","o|3|2nj|2nk|2g4","⏳","hourglass not done","o|3|2nm|2nn|2g4","⌚","watch","o|3|2np|2nq|2g4","⏰","alarm clock","o|3|2ns|2nt|2g4","⏱️","stopwatch","o|3|2nv|2nw|2g4","⏱","o|3|2ny|2nw|2g4","⏲️","timer clock","o|3|2o0|2o1|2g4","⏲","o|3|2o3|2o1|2g4","🕰️","mantelpiece clock","o|3|2o5|2o6|2g4","🕰","o|3|2o8|2o6|2g4","🕛","twelve o’clock","o|3|2oA|2oB|2g4","🕧","twelve-thirty","o|3|2oD|2oE|2g4","🕐","one o’clock","o|3|2oG|2oH|2g4","🕜","one-thirty","o|3|2oJ|2oK|2g4","🕑","two o’clock","o|3|2oM|2oN|2g4","🕝","two-thirty","o|3|2oP|2oQ|2g4","🕒","three o’clock","o|3|2oS|2oT|2g4","🕞","three-thirty","o|3|2oV|2oW|2g4","🕓","four o’clock","o|3|2oY|2oZ|2g4","🕟","four-thirty","o|3|2ob|2oc|2g4","🕔","five o’clock","o|3|2oe|2of|2g4","🕠","five-thirty","o|3|2oh|2oi|2g4","🕕","six o’clock","o|3|2ok|2ol|2g4","🕡","six-thirty","o|3|2on|2oo|2g4","🕖","seven o’clock","o|3|2oq|2or|2g4","🕢","seven-thirty","o|3|2ot|2ou|2g4","🕗","eight o’clock","o|3|2ow|2ox|2g4","🕣","eight-thirty","o|3|2oz|2p0|2g4","🕘","nine o’clock","o|3|2p2|2p3|2g4","🕤","nine-thirty","o|3|2p5|2p6|2g4","🕙","ten o’clock","o|3|2p8|2p9|2g4","🕥","ten-thirty","o|3|2pB|2pC|2g4","🕚","eleven o’clock","o|3|2pE|2pF|2g4","🕦","eleven-thirty","o|3|2pH|2pI|2g4","🌑","new moon","o|3|2pK|2pL|2g4","🌒","waxing crescent moon","o|3|2pN|2pO|2g4","🌓","first quarter moon","o|3|2pQ|2pR|2g4","🌔","waxing gibbous moon","o|3|2pT|2pU|2g4","🌕","full moon","o|3|2pW|2pX|2g4","🌖","waning gibbous moon","o|3|2pZ|2pa|2g4","🌗","last quarter moon","o|3|2pc|2pd|2g4","🌘","waning crescent moon","o|3|2pf|2pg|2g4","🌙","crescent moon","o|3|2pi|2pj|2g4","🌚","new moon face","o|3|2pl|2pm|2g4","🌛","first quarter moon face","o|3|2po|2pp|2g4","🌜","last quarter moon face","o|3|2pr|2ps|2g4","🌡️","thermometer","o|3|2pu|2pv|2g4","🌡","o|3|2px|2pv|2g4","☀️","sun","o|3|2pz|2q0|2g4","☀","o|3|2q2|2q0|2g4","🌝","full moon face","o|3|2q4|2q5|2g4","🌞","sun with face","o|3|2q7|2q8|2g4","🪐","ringed planet","o|3|2qA|2qB|2g4","⭐","star","o|3|2qD|2qE|2g4","🌟","glowing star","o|3|2qG|2qH|2g4","🌠","shooting star","o|3|2qJ|2qK|2g4","🌌","milky way","o|3|2qM|2qN|2g4","☁️","cloud","o|3|2qP|2qQ|2g4","☁","o|3|2qS|2qQ|2g4","⛅","sun behind cloud","o|3|2qU|2qV|2g4","⛈️","cloud with lightning and rain","o|3|2qX|2qY|2g4","⛈","o|3|2qa|2qY|2g4","🌤️","sun behind small cloud","o|3|2qc|2qd|2g4","🌤","o|3|2qf|2qd|2g4","🌥️","sun behind large cloud","o|3|2qh|2qi|2g4","🌥","o|3|2qk|2qi|2g4","🌦️","sun behind rain cloud","o|3|2qm|2qn|2g4","🌦","o|3|2qp|2qn|2g4","🌧️","cloud with rain","o|3|2qr|2qs|2g4","🌧","o|3|2qu|2qs|2g4","🌨️","cloud with snow","o|3|2qw|2qx|2g4","🌨","o|3|2qz|2qx|2g4","🌩️","cloud with lightning","o|3|2r1|2r2|2g4","🌩","o|3|2r4|2r2|2g4","🌪️","tornado","o|3|2r6|2r7|2g4","🌪","o|3|2r9|2r7|2g4","🌫️","fog","o|3|2rB|2rC|2g4","🌫","o|3|2rE|2rC|2g4","🌬️","wind face","o|3|2rG|2rH|2g4","🌬","o|3|2rJ|2rH|2g4","🌀","cyclone","o|3|2rL|2rM|2g4","🌈","rainbow","o|3|2rO|2rP|2g4","🌂","closed umbrella","o|3|2rR|2rS|2g4","☂️","umbrella","o|3|2rU|2rV|2g4","☂","o|3|2rX|2rV|2g4","☔","umbrella with rain drops","o|3|2rZ|2ra|2g4","⛱️","umbrella on ground","o|3|2rc|2rd|2g4","⛱","o|3|2rf|2rd|2g4","⚡","high voltage","o|3|2rh|2ri|2g4","❄️","snowflake","o|3|2rk|2rl|2g4","❄","o|3|2rn|2rl|2g4","☃️","snowman","o|3|2rp|2rq|2g4","☃","o|3|2rs|2rq|2g4","⛄","snowman without snow","o|3|2ru|2rv|2g4","☄️","comet","o|3|2rx|2ry|2g4","☄","o|3|2s0|2ry|2g4","🔥","fire","o|3|2s2|2s3|2g4","💧","droplet","o|3|2s5|2s6|2g4","🌊","water wave","o|3|2s8|2s9|2g4","🎃","jack-o-lantern","Activities","o|3|2sB|2sC|2sD","🎄","Christmas tree","o|3|2sF|2sG|2sD","🎆","fireworks","o|3|2sI|2sJ|2sD","🎇","sparkler","o|3|2sL|2sM|2sD","🧨","firecracker","o|3|2sO|2sP|2sD","✨","sparkles","o|3|2sR|2sS|2sD","🎈","balloon","o|3|2sU|2sV|2sD","🎉","party popper","o|3|2sX|2sY|2sD","🎊","confetti ball","o|3|2sa|2sb|2sD","🎋","tanabata tree","o|3|2sd|2se|2sD","🎍","pine decoration","o|3|2sg|2sh|2sD","🎎","Japanese dolls","o|3|2sj|2sk|2sD","🎏","carp streamer","o|3|2sm|2sn|2sD","🎐","wind chime","o|3|2sp|2sq|2sD","🎑","moon viewing ceremony","o|3|2ss|2st|2sD","🧧","red envelope","o|3|2sv|2sw|2sD","🎀","ribbon","o|3|2sy|2sz|2sD","🎁","wrapped gift","o|3|2t1|2t2|2sD","🎗️","reminder ribbon","o|3|2t4|2t5|2sD","🎗","o|3|2t7|2t5|2sD","🎟️","admission tickets","o|3|2t9|2tA|2sD","🎟","o|3|2tC|2tA|2sD","🎫","ticket","o|3|2tE|2tF|2sD","🎖️","military medal","o|3|2tH|2tI|2sD","🎖","o|3|2tK|2tI|2sD","🏆","trophy","o|3|2tM|2tN|2sD","🏅","sports medal","o|3|2tP|2tQ|2sD","🥇","1st place medal","o|3|2tS|2tT|2sD","🥈","2nd place medal","o|3|2tV|2tW|2sD","🥉","3rd place medal","o|3|2tY|2tZ|2sD","⚽","soccer ball","o|3|2tb|2tc|2sD","⚾","baseball","o|3|2te|2tf|2sD","🥎","softball","o|3|2th|2ti|2sD","🏀","basketball","o|3|2tk|2tl|2sD","🏐","volleyball","o|3|2tn|2to|2sD","🏈","american football","o|3|2tq|2tr|2sD","🏉","rugby football","o|3|2tt|2tu|2sD","🎾","tennis","o|3|2tw|2tx|2sD","🥏","flying disc","o|3|2tz|2u0|2sD","🎳","bowling","o|3|2u2|2u3|2sD","🏏","cricket game","o|3|2u5|2u6|2sD","🏑","field hockey","o|3|2u8|2u9|2sD","🏒","ice hockey","o|3|2uB|2uC|2sD","🥍","lacrosse","o|3|2uE|2uF|2sD","🏓","ping pong","o|3|2uH|2uI|2sD","🏸","badminton","o|3|2uK|2uL|2sD","🥊","boxing glove","o|3|2uN|2uO|2sD","🥋","martial arts uniform","o|3|2uQ|2uR|2sD","🥅","goal net","o|3|2uT|2uU|2sD","⛳","flag in hole","o|3|2uW|2uX|2sD","⛸️","ice skate","o|3|2uZ|2ua|2sD","⛸","o|3|2uc|2ua|2sD","🎣","fishing pole","o|3|2ue|2uf|2sD","🤿","diving mask","o|3|2uh|2ui|2sD","🎽","running shirt","o|3|2uk|2ul|2sD","🎿","skis","o|3|2un|2uo|2sD","🛷","sled","o|3|2uq|2ur|2sD","🥌","curling stone","o|3|2ut|2uu|2sD","🎯","bullseye","o|3|2uw|2ux|2sD","🪀","yo-yo","o|3|2uz|2v0|2sD","🪁","kite","o|3|2v2|2v3|2sD","🔫","water pistol","o|3|2v5|2v6|2sD","🎱","pool 8 ball","o|3|2v8|2v9|2sD","🔮","crystal ball","o|3|2vB|2vC|2sD","🪄","magic wand","o|3|2vE|2vF|2sD","🎮","video game","o|3|2vH|2vI|2sD","🕹️","joystick","o|3|2vK|2vL|2sD","🕹","o|3|2vN|2vL|2sD","🎰","slot machine","o|3|2vP|2vQ|2sD","🎲","game die","o|3|2vS|2vT|2sD","🧩","puzzle piece","o|3|2vV|2vW|2sD","🧸","teddy bear","o|3|2vY|2vZ|2sD","🪅","piñata","o|3|2vb|2vc|2sD","🪩","mirror ball","o|3|2ve|2vf|2sD","🪆","nesting dolls","o|3|2vh|2vi|2sD","♠️","spade suit","o|3|2vk|2vl|2sD","♠","o|3|2vn|2vl|2sD","♥️","heart suit","o|3|2vp|2vq|2sD","♥","o|3|2vs|2vq|2sD","♦️","diamond suit","o|3|2vu|2vv|2sD","♦","o|3|2vx|2vv|2sD","♣️","club suit","o|3|2vz|2w0|2sD","♣","o|3|2w2|2w0|2sD","♟️","chess pawn","o|3|2w4|2w5|2sD","♟","o|3|2w7|2w5|2sD","🃏","joker","o|3|2w9|2wA|2sD","🀄","mahjong red dragon","o|3|2wC|2wD|2sD","🎴","flower playing cards","o|3|2wF|2wG|2sD","🎭","performing arts","o|3|2wI|2wJ|2sD","🖼️","framed picture","o|3|2wL|2wM|2sD","🖼","o|3|2wO|2wM|2sD","🎨","artist palette","o|3|2wQ|2wR|2sD","🧵","thread","o|3|2wT|2wU|2sD","🪡","sewing needle","o|3|2wW|2wX|2sD","🧶","yarn","o|3|2wZ|2wa|2sD","🪢","knot","o|3|2wc|2wd|2sD","👓","glasses","Objects","o|3|2wf|2wg|2wh","🕶️","sunglasses","o|3|2wj|2wk|2wh","🕶","o|3|2wm|2wk|2wh","🥽","goggles","o|3|2wo|2wp|2wh","🥼","lab coat","o|3|2wr|2ws|2wh","🦺","safety vest","o|3|2wu|2wv|2wh","👔","necktie","o|3|2wx|2wy|2wh","👕","t-shirt","o|3|2x0|2x1|2wh","👖","jeans","o|3|2x3|2x4|2wh","🧣","scarf","o|3|2x6|2x7|2wh","🧤","gloves","o|3|2x9|2xA|2wh","🧥","coat","o|3|2xC|2xD|2wh","🧦","socks","o|3|2xF|2xG|2wh","👗","dress","o|3|2xI|2xJ|2wh","👘","kimono","o|3|2xL|2xM|2wh","🥻","sari","o|3|2xO|2xP|2wh","🩱","one-piece swimsuit","o|3|2xR|2xS|2wh","🩲","briefs","o|3|2xU|2xV|2wh","🩳","shorts","o|3|2xX|2xY|2wh","👙","bikini","o|3|2xa|2xb|2wh","👚","woman’s clothes","o|3|2xd|2xe|2wh","🪭","folding hand fan","o|3|2xg|2xh|2wh","👛","purse","o|3|2xj|2xk|2wh","👜","handbag","o|3|2xm|2xn|2wh","👝","clutch bag","o|3|2xp|2xq|2wh","🛍️","shopping bags","o|3|2xs|2xt|2wh","🛍","o|3|2xv|2xt|2wh","🎒","backpack","o|3|2xx|2xy|2wh","🩴","thong sandal","o|3|2y0|2y1|2wh","👞","man’s shoe","o|3|2y3|2y4|2wh","👟","running shoe","o|3|2y6|2y7|2wh","🥾","hiking boot","o|3|2y9|2yA|2wh","🥿","flat shoe","o|3|2yC|2yD|2wh","👠","high-heeled shoe","o|3|2yF|2yG|2wh","👡","woman’s sandal","o|3|2yI|2yJ|2wh","🩰","ballet shoes","o|3|2yL|2yM|2wh","👢","woman’s boot","o|3|2yO|2yP|2wh","🪮","hair pick","o|3|2yR|2yS|2wh","👑","crown","o|3|2yU|2yV|2wh","👒","woman’s hat","o|3|2yX|2yY|2wh","🎩","top hat","o|3|2ya|2yb|2wh","🎓","graduation cap","o|3|2yd|2ye|2wh","🧢","billed cap","o|3|2yg|2yh|2wh","🪖","military helmet","o|3|2yj|2yk|2wh","⛑️","rescue worker’s helmet","o|3|2ym|2yn|2wh","⛑","o|3|2yp|2yn|2wh","📿","prayer beads","o|3|2yr|2ys|2wh","💄","lipstick","o|3|2yu|2yv|2wh","💍","ring","o|3|2yx|2yy|2wh","💎","gem stone","o|3|2z0|2z1|2wh","🔇","muted speaker","o|3|2z3|2z4|2wh","🔈","speaker low volume","o|3|2z6|2z7|2wh","🔉","speaker medium volume","o|3|2z9|2zA|2wh","🔊","speaker high volume","o|3|2zC|2zD|2wh","📢","loudspeaker","o|3|2zF|2zG|2wh","📣","megaphone","o|3|2zI|2zJ|2wh","📯","postal horn","o|3|2zL|2zM|2wh","🔔","bell","o|3|2zO|2zP|2wh","🔕","bell with slash","o|3|2zR|2zS|2wh","🎼","musical score","o|3|2zU|2zV|2wh","🎵","musical note","o|3|2zX|2zY|2wh","🎶","musical notes","o|3|2za|2zb|2wh","🎙️","studio microphone","o|3|2zd|2ze|2wh","🎙","o|3|2zg|2ze|2wh","🎚️","level slider","o|3|2zi|2zj|2wh","🎚","o|3|2zl|2zj|2wh","🎛️","control knobs","o|3|2zn|2zo|2wh","🎛","o|3|2zq|2zo|2wh","🎤","microphone","o|3|2zs|2zt|2wh","🎧","headphone","o|3|2zv|2zw|2wh","📻","radio","o|3|2zy|2zz|2wh","🎷","saxophone","o|3|301|302|2wh","🪗","accordion","o|3|304|305|2wh","🎸","guitar","o|3|307|308|2wh","🎹","musical keyboard","o|3|30A|30B|2wh","🎺","trumpet","o|3|30D|30E|2wh","🎻","violin","o|3|30G|30H|2wh","🪕","banjo","o|3|30J|30K|2wh","🥁","drum","o|3|30M|30N|2wh","🪘","long drum","o|3|30P|30Q|2wh","🪇","maracas","o|3|30S|30T|2wh","🪈","flute","o|3|30V|30W|2wh","📱","mobile phone","o|3|30Y|30Z|2wh","📲","mobile phone with arrow","o|3|30b|30c|2wh","☎️","telephone","o|3|30e|30f|2wh","☎","o|3|30h|30f|2wh","📞","telephone receiver","o|3|30j|30k|2wh","📟","pager","o|3|30m|30n|2wh","📠","fax machine","o|3|30p|30q|2wh","🔋","battery","o|3|30s|30t|2wh","🪫","low battery","o|3|30v|30w|2wh","🔌","electric plug","o|3|30y|30z|2wh","💻","laptop","o|3|311|312|2wh","🖥️","desktop computer","o|3|314|315|2wh","🖥","o|3|317|315|2wh","🖨️","printer","o|3|319|31A|2wh","🖨","o|3|31C|31A|2wh","⌨️","keyboard","o|3|31E|31F|2wh","⌨","o|3|31H|31F|2wh","🖱️","computer mouse","o|3|31J|31K|2wh","🖱","o|3|31M|31K|2wh","🖲️","trackball","o|3|31O|31P|2wh","🖲","o|3|31R|31P|2wh","💽","computer disk","o|3|31T|31U|2wh","💾","floppy disk","o|3|31W|31X|2wh","💿","optical disk","o|3|31Z|31a|2wh","📀","dvd","o|3|31c|31d|2wh","🧮","abacus","o|3|31f|31g|2wh","🎥","movie camera","o|3|31i|31j|2wh","🎞️","film frames","o|3|31l|31m|2wh","🎞","o|3|31o|31m|2wh","📽️","film projector","o|3|31q|31r|2wh","📽","o|3|31t|31r|2wh","🎬","clapper board","o|3|31v|31w|2wh","📺","television","o|3|31y|31z|2wh","📷","camera","o|3|321|322|2wh","📸","camera with flash","o|3|324|325|2wh","📹","video camera","o|3|327|328|2wh","📼","videocassette","o|3|32A|32B|2wh","🔍","magnifying glass tilted left","o|3|32D|32E|2wh","🔎","magnifying glass tilted right","o|3|32G|32H|2wh","🕯️","candle","o|3|32J|32K|2wh","🕯","o|3|32M|32K|2wh","💡","light bulb","o|3|32O|32P|2wh","🔦","flashlight","o|3|32R|32S|2wh","🏮","red paper lantern","o|3|32U|32V|2wh","🪔","diya lamp","o|3|32X|32Y|2wh","📔","notebook with decorative cover","o|3|32a|32b|2wh","📕","closed book","o|3|32d|32e|2wh","📖","open book","o|3|32g|32h|2wh","📗","green book","o|3|32j|32k|2wh","📘","blue book","o|3|32m|32n|2wh","📙","orange book","o|3|32p|32q|2wh","📚","books","o|3|32s|32t|2wh","📓","notebook","o|3|32v|32w|2wh","📒","ledger","o|3|32y|32z|2wh","📃","page with curl","o|3|331|332|2wh","📜","scroll","o|3|334|335|2wh","📄","page facing up","o|3|337|338|2wh","📰","newspaper","o|3|33A|33B|2wh","🗞️","rolled-up newspaper","o|3|33D|33E|2wh","🗞","o|3|33G|33E|2wh","📑","bookmark tabs","o|3|33I|33J|2wh","🔖","bookmark","o|3|33L|33M|2wh","🏷️","label","o|3|33O|33P|2wh","🏷","o|3|33R|33P|2wh","💰","money bag","o|3|33T|33U|2wh","🪙","coin","o|3|33W|33X|2wh","💴","yen banknote","o|3|33Z|33a|2wh","💵","dollar banknote","o|3|33c|33d|2wh","💶","euro banknote","o|3|33f|33g|2wh","💷","pound banknote","o|3|33i|33j|2wh","💸","money with wings","o|3|33l|33m|2wh","💳","credit card","o|3|33o|33p|2wh","🧾","receipt","o|3|33r|33s|2wh","💹","chart increasing with yen","o|3|33u|33v|2wh","✉️","envelope","o|3|33x|33y|2wh","✉","o|3|340|33y|2wh","📧","e-mail","o|3|342|343|2wh","📨","incoming envelope","o|3|345|346|2wh","📩","envelope with arrow","o|3|348|349|2wh","📤","outbox tray","o|3|34B|34C|2wh","📥","inbox tray","o|3|34E|34F|2wh","📦","package","o|3|34H|34I|2wh","📫","closed mailbox with raised flag","o|3|34K|34L|2wh","📪","closed mailbox with lowered flag","o|3|34N|34O|2wh","📬","open mailbox with raised flag","o|3|34Q|34R|2wh","📭","open mailbox with lowered flag","o|3|34T|34U|2wh","📮","postbox","o|3|34W|34X|2wh","🗳️","ballot box with ballot","o|3|34Z|34a|2wh","🗳","o|3|34c|34a|2wh","✏️","pencil","o|3|34e|34f|2wh","✏","o|3|34h|34f|2wh","✒️","black nib","o|3|34j|34k|2wh","✒","o|3|34m|34k|2wh","🖋️","fountain pen","o|3|34o|34p|2wh","🖋","o|3|34r|34p|2wh","🖊️","pen","o|3|34t|34u|2wh","🖊","o|3|34w|34u|2wh","🖌️","paintbrush","o|3|34y|34z|2wh","🖌","o|3|351|34z|2wh","🖍️","crayon","o|3|353|354|2wh","🖍","o|3|356|354|2wh","📝","memo","o|3|358|359|2wh","💼","briefcase","o|3|35B|35C|2wh","📁","file folder","o|3|35E|35F|2wh","📂","open file folder","o|3|35H|35I|2wh","🗂️","card index dividers","o|3|35K|35L|2wh","🗂","o|3|35N|35L|2wh","📅","calendar","o|3|35P|35Q|2wh","📆","tear-off calendar","o|3|35S|35T|2wh","🗒️","spiral notepad","o|3|35V|35W|2wh","🗒","o|3|35Y|35W|2wh","🗓️","spiral calendar","o|3|35a|35b|2wh","🗓","o|3|35d|35b|2wh","📇","card index","o|3|35f|35g|2wh","📈","chart increasing","o|3|35i|35j|2wh","📉","chart decreasing","o|3|35l|35m|2wh","📊","bar chart","o|3|35o|35p|2wh","📋","clipboard","o|3|35r|35s|2wh","📌","pushpin","o|3|35u|35v|2wh","📍","round pushpin","o|3|35x|35y|2wh","📎","paperclip","o|3|360|361|2wh","🖇️","linked paperclips","o|3|363|364|2wh","🖇","o|3|366|364|2wh","📏","straight ruler","o|3|368|369|2wh","📐","triangular ruler","o|3|36B|36C|2wh","✂️","scissors","o|3|36E|36F|2wh","✂","o|3|36H|36F|2wh","🗃️","card file box","o|3|36J|36K|2wh","🗃","o|3|36M|36K|2wh","🗄️","file cabinet","o|3|36O|36P|2wh","🗄","o|3|36R|36P|2wh","🗑️","wastebasket","o|3|36T|36U|2wh","🗑","o|3|36W|36U|2wh","🔒","locked","o|3|36Y|36Z|2wh","🔓","unlocked","o|3|36b|36c|2wh","🔏","locked with pen","o|3|36e|36f|2wh","🔐","locked with key","o|3|36h|36i|2wh","🔑","key","o|3|36k|36l|2wh","🗝️","old key","o|3|36n|36o|2wh","🗝","o|3|36q|36o|2wh","🔨","hammer","o|3|36s|36t|2wh","🪓","axe","o|3|36v|36w|2wh","⛏️","pick","o|3|36y|36z|2wh","⛏","o|3|371|36z|2wh","⚒️","hammer and pick","o|3|373|374|2wh","⚒","o|3|376|374|2wh","🛠️","hammer and wrench","o|3|378|379|2wh","🛠","o|3|37B|379|2wh","🗡️","dagger","o|3|37D|37E|2wh","🗡","o|3|37G|37E|2wh","⚔️","crossed swords","o|3|37I|37J|2wh","⚔","o|3|37L|37J|2wh","💣","bomb","o|3|37N|37O|2wh","🪃","boomerang","o|3|37Q|37R|2wh","🏹","bow and arrow","o|3|37T|37U|2wh","🛡️","shield","o|3|37W|37X|2wh","🛡","o|3|37Z|37X|2wh","🪚","carpentry saw","o|3|37b|37c|2wh","🔧","wrench","o|3|37e|37f|2wh","🪛","screwdriver","o|3|37h|37i|2wh","🔩","nut and bolt","o|3|37k|37l|2wh","⚙️","gear","o|3|37n|37o|2wh","⚙","o|3|37q|37o|2wh","🗜️","clamp","o|3|37s|37t|2wh","🗜","o|3|37v|37t|2wh","⚖️","balance scale","o|3|37x|37y|2wh","⚖","o|3|380|37y|2wh","🦯","white cane","o|3|382|383|2wh","🔗","link","o|3|385|386|2wh","⛓️‍💥","broken chain","o|3|388|389|2wh","⛓‍💥","o|3|38B|389|2wh","⛓️","chains","o|3|38D|38E|2wh","⛓","o|3|38G|38E|2wh","🪝","hook","o|3|38I|38J|2wh","🧰","toolbox","o|3|38L|38M|2wh","🧲","magnet","o|3|38O|38P|2wh","🪜","ladder","o|3|38R|38S|2wh","⚗️","alembic","o|3|38U|38V|2wh","⚗","o|3|38X|38V|2wh","🧪","test tube","o|3|38Z|38a|2wh","🧫","petri dish","o|3|38c|38d|2wh","🧬","dna","o|3|38f|38g|2wh","🔬","microscope","o|3|38i|38j|2wh","🔭","telescope","o|3|38l|38m|2wh","📡","satellite antenna","o|3|38o|38p|2wh","💉","syringe","o|3|38r|38s|2wh","🩸","drop of blood","o|3|38u|38v|2wh","💊","pill","o|3|38x|38y|2wh","🩹","adhesive bandage","o|3|390|391|2wh","🩼","crutch","o|3|393|394|2wh","🩺","stethoscope","o|3|396|397|2wh","🩻","x-ray","o|3|399|39A|2wh","🚪","door","o|3|39C|39D|2wh","🛗","elevator","o|3|39F|39G|2wh","🪞","mirror","o|3|39I|39J|2wh","🪟","window","o|3|39L|39M|2wh","🛏️","bed","o|3|39O|39P|2wh","🛏","o|3|39R|39P|2wh","🛋️","couch and lamp","o|3|39T|39U|2wh","🛋","o|3|39W|39U|2wh","🪑","chair","o|3|39Y|39Z|2wh","🚽","toilet","o|3|39b|39c|2wh","🪠","plunger","o|3|39e|39f|2wh","🚿","shower","o|3|39h|39i|2wh","🛁","bathtub","o|3|39k|39l|2wh","🪤","mouse trap","o|3|39n|39o|2wh","🪒","razor","o|3|39q|39r|2wh","🧴","lotion bottle","o|3|39t|39u|2wh","🧷","safety pin","o|3|39w|39x|2wh","🧹","broom","o|3|39z|3A0|2wh","🧺","basket","o|3|3A2|3A3|2wh","🧻","roll of paper","o|3|3A5|3A6|2wh","🪣","bucket","o|3|3A8|3A9|2wh","🧼","soap","o|3|3AB|3AC|2wh","🫧","bubbles","o|3|3AE|3AF|2wh","🪥","toothbrush","o|3|3AH|3AI|2wh","🧽","sponge","o|3|3AK|3AL|2wh","🧯","fire extinguisher","o|3|3AN|3AO|2wh","🛒","shopping cart","o|3|3AQ|3AR|2wh","🚬","cigarette","o|3|3AT|3AU|2wh","⚰️","coffin","o|3|3AW|3AX|2wh","⚰","o|3|3AZ|3AX|2wh","🪦","headstone","o|3|3Ab|3Ac|2wh","⚱️","funeral urn","o|3|3Ae|3Af|2wh","⚱","o|3|3Ah|3Af|2wh","🧿","nazar amulet","o|3|3Aj|3Ak|2wh","🪬","hamsa","o|3|3Am|3An|2wh","🗿","moai","o|3|3Ap|3Aq|2wh","🪧","placard","o|3|3As|3At|2wh","🪪","identification card","o|3|3Av|3Aw|2wh","🏧","ATM sign","Symbols","o|3|3Ay|3Az|3B0","🚮","litter in bin sign","o|3|3B2|3B3|3B0","🚰","potable water","o|3|3B5|3B6|3B0","♿","wheelchair symbol","o|3|3B8|3B9|3B0","🚹","men’s room","o|3|3BB|3BC|3B0","🚺","women’s room","o|3|3BE|3BF|3B0","🚻","restroom","o|3|3BH|3BI|3B0","🚼","baby symbol","o|3|3BK|3BL|3B0","🚾","water closet","o|3|3BN|3BO|3B0","🛂","passport control","o|3|3BQ|3BR|3B0","🛃","customs","o|3|3BT|3BU|3B0","🛄","baggage claim","o|3|3BW|3BX|3B0","🛅","left luggage","o|3|3BZ|3Ba|3B0","⚠️","warning","o|3|3Bc|3Bd|3B0","⚠","o|3|3Bf|3Bd|3B0","🚸","children crossing","o|3|3Bh|3Bi|3B0","⛔","no entry","o|3|3Bk|3Bl|3B0","🚫","prohibited","o|3|3Bn|3Bo|3B0","🚳","no bicycles","o|3|3Bq|3Br|3B0","🚭","no smoking","o|3|3Bt|3Bu|3B0","🚯","no littering","o|3|3Bw|3Bx|3B0","🚱","non-potable water","o|3|3Bz|3C0|3B0","🚷","no pedestrians","o|3|3C2|3C3|3B0","📵","no mobile phones","o|3|3C5|3C6|3B0","🔞","no one under eighteen","o|3|3C8|3C9|3B0","☢️","radioactive","o|3|3CB|3CC|3B0","☢","o|3|3CE|3CC|3B0","☣️","biohazard","o|3|3CG|3CH|3B0","☣","o|3|3CJ|3CH|3B0","⬆️","up arrow","o|3|3CL|3CM|3B0","⬆","o|3|3CO|3CM|3B0","↗️","up-right arrow","o|3|3CQ|3CR|3B0","↗","o|3|3CT|3CR|3B0","➡️","right arrow","o|3|3CV|3CW|3B0","➡","o|3|3CY|3CW|3B0","↘️","down-right arrow","o|3|3Ca|3Cb|3B0","↘","o|3|3Cd|3Cb|3B0","⬇️","down arrow","o|3|3Cf|3Cg|3B0","⬇","o|3|3Ci|3Cg|3B0","↙️","down-left arrow","o|3|3Ck|3Cl|3B0","↙","o|3|3Cn|3Cl|3B0","⬅️","left arrow","o|3|3Cp|3Cq|3B0","⬅","o|3|3Cs|3Cq|3B0","↖️","up-left arrow","o|3|3Cu|3Cv|3B0","↖","o|3|3Cx|3Cv|3B0","↕️","up-down arrow","o|3|3Cz|3D0|3B0","↕","o|3|3D2|3D0|3B0","↔️","left-right arrow","o|3|3D4|3D5|3B0","↔","o|3|3D7|3D5|3B0","↩️","right arrow curving left","o|3|3D9|3DA|3B0","↩","o|3|3DC|3DA|3B0","↪️","left arrow curving right","o|3|3DE|3DF|3B0","↪","o|3|3DH|3DF|3B0","⤴️","right arrow curving up","o|3|3DJ|3DK|3B0","⤴","o|3|3DM|3DK|3B0","⤵️","right arrow curving down","o|3|3DO|3DP|3B0","⤵","o|3|3DR|3DP|3B0","🔃","clockwise vertical arrows","o|3|3DT|3DU|3B0","🔄","counterclockwise arrows button","o|3|3DW|3DX|3B0","🔙","BACK arrow","o|3|3DZ|3Da|3B0","🔚","END arrow","o|3|3Dc|3Dd|3B0","🔛","ON! arrow","o|3|3Df|3Dg|3B0","🔜","SOON arrow","o|3|3Di|3Dj|3B0","🔝","TOP arrow","o|3|3Dl|3Dm|3B0","🛐","place of worship","o|3|3Do|3Dp|3B0","⚛️","atom symbol","o|3|3Dr|3Ds|3B0","⚛","o|3|3Du|3Ds|3B0","🕉️","om","o|3|3Dw|3Dx|3B0","🕉","o|3|3Dz|3Dx|3B0","✡️","star of David","o|3|3E1|3E2|3B0","✡","o|3|3E4|3E2|3B0","☸️","wheel of dharma","o|3|3E6|3E7|3B0","☸","o|3|3E9|3E7|3B0","☯️","yin yang","o|3|3EB|3EC|3B0","☯","o|3|3EE|3EC|3B0","✝️","latin cross","o|3|3EG|3EH|3B0","✝","o|3|3EJ|3EH|3B0","☦️","orthodox cross","o|3|3EL|3EM|3B0","☦","o|3|3EO|3EM|3B0","☪️","star and crescent","o|3|3EQ|3ER|3B0","☪","o|3|3ET|3ER|3B0","☮️","peace symbol","o|3|3EV|3EW|3B0","☮","o|3|3EY|3EW|3B0","🕎","menorah","o|3|3Ea|3Eb|3B0","🔯","dotted six-pointed star","o|3|3Ed|3Ee|3B0","🪯","khanda","o|3|3Eg|3Eh|3B0","♈","Aries","o|3|3Ej|3Ek|3B0","♉","Taurus","o|3|3Em|3En|3B0","♊","Gemini","o|3|3Ep|3Eq|3B0","♋","Cancer","o|3|3Es|3Et|3B0","♌","Leo","o|3|3Ev|3Ew|3B0","♍","Virgo","o|3|3Ey|3Ez|3B0","♎","Libra","o|3|3F1|3F2|3B0","♏","Scorpio","o|3|3F4|3F5|3B0","♐","Sagittarius","o|3|3F7|3F8|3B0","♑","Capricorn","o|3|3FA|3FB|3B0","♒","Aquarius","o|3|3FD|3FE|3B0","♓","Pisces","o|3|3FG|3FH|3B0","⛎","Ophiuchus","o|3|3FJ|3FK|3B0","🔀","shuffle tracks button","o|3|3FM|3FN|3B0","🔁","repeat button","o|3|3FP|3FQ|3B0","🔂","repeat single button","o|3|3FS|3FT|3B0","▶️","play button","o|3|3FV|3FW|3B0","▶","o|3|3FY|3FW|3B0","⏩","fast-forward button","o|3|3Fa|3Fb|3B0","⏭️","next track button","o|3|3Fd|3Fe|3B0","⏭","o|3|3Fg|3Fe|3B0","⏯️","play or pause button","o|3|3Fi|3Fj|3B0","⏯","o|3|3Fl|3Fj|3B0","◀️","reverse button","o|3|3Fn|3Fo|3B0","◀","o|3|3Fq|3Fo|3B0","⏪","fast reverse button","o|3|3Fs|3Ft|3B0","⏮️","last track button","o|3|3Fv|3Fw|3B0","⏮","o|3|3Fy|3Fw|3B0","🔼","upwards button","o|3|3G0|3G1|3B0","⏫","fast up button","o|3|3G3|3G4|3B0","🔽","downwards button","o|3|3G6|3G7|3B0","⏬","fast down button","o|3|3G9|3GA|3B0","⏸️","pause button","o|3|3GC|3GD|3B0","⏸","o|3|3GF|3GD|3B0","⏹️","stop button","o|3|3GH|3GI|3B0","⏹","o|3|3GK|3GI|3B0","⏺️","record button","o|3|3GM|3GN|3B0","⏺","o|3|3GP|3GN|3B0","⏏️","eject button","o|3|3GR|3GS|3B0","⏏","o|3|3GU|3GS|3B0","🎦","cinema","o|3|3GW|3GX|3B0","🔅","dim button","o|3|3GZ|3Ga|3B0","🔆","bright button","o|3|3Gc|3Gd|3B0","📶","antenna bars","o|3|3Gf|3Gg|3B0","🛜","wireless","o|3|3Gi|3Gj|3B0","📳","vibration mode","o|3|3Gl|3Gm|3B0","📴","mobile phone off","o|3|3Go|3Gp|3B0","♀️","female sign","o|3|3Gr|3Gs|3B0","♀","o|3|3Gu|3Gs|3B0","♂️","male sign","o|3|3Gw|3Gx|3B0","♂","o|3|3Gz|3Gx|3B0","⚧️","transgender symbol","o|3|3H1|3H2|3B0","⚧","o|3|3H4|3H2|3B0","✖️","multiply","o|3|3H6|3H7|3B0","✖","o|3|3H9|3H7|3B0","➕","plus","o|3|3HB|3HC|3B0","➖","minus","o|3|3HE|3HF|3B0","➗","divide","o|3|3HH|3HI|3B0","🟰","heavy equals sign","o|3|3HK|3HL|3B0","♾️","infinity","o|3|3HN|3HO|3B0","♾","o|3|3HQ|3HO|3B0","‼️","double exclamation mark","o|3|3HS|3HT|3B0","‼","o|3|3HV|3HT|3B0","⁉️","exclamation question mark","o|3|3HX|3HY|3B0","⁉","o|3|3Ha|3HY|3B0","❓","red question mark","o|3|3Hc|3Hd|3B0","❔","white question mark","o|3|3Hf|3Hg|3B0","❕","white exclamation mark","o|3|3Hi|3Hj|3B0","❗","red exclamation mark","o|3|3Hl|3Hm|3B0","〰️","wavy dash","o|3|3Ho|3Hp|3B0","〰","o|3|3Hr|3Hp|3B0","💱","currency exchange","o|3|3Ht|3Hu|3B0","💲","heavy dollar sign","o|3|3Hw|3Hx|3B0","⚕️","medical symbol","o|3|3Hz|3I0|3B0","⚕","o|3|3I2|3I0|3B0","♻️","recycling symbol","o|3|3I4|3I5|3B0","♻","o|3|3I7|3I5|3B0","⚜️","fleur-de-lis","o|3|3I9|3IA|3B0","⚜","o|3|3IC|3IA|3B0","🔱","trident emblem","o|3|3IE|3IF|3B0","📛","name badge","o|3|3IH|3II|3B0","🔰","Japanese symbol for beginner","o|3|3IK|3IL|3B0","⭕","hollow red circle","o|3|3IN|3IO|3B0","✅","check mark button","o|3|3IQ|3IR|3B0","☑️","check box with check","o|3|3IT|3IU|3B0","☑","o|3|3IW|3IU|3B0","✔️","check mark","o|3|3IY|3IZ|3B0","✔","o|3|3Ib|3IZ|3B0","❌","cross mark","o|3|3Id|3Ie|3B0","❎","cross mark button","o|3|3Ig|3Ih|3B0","➰","curly loop","o|3|3Ij|3Ik|3B0","➿","double curly loop","o|3|3Im|3In|3B0","〽️","part alternation mark","o|3|3Ip|3Iq|3B0","〽","o|3|3Is|3Iq|3B0","✳️","eight-spoked asterisk","o|3|3Iu|3Iv|3B0","✳","o|3|3Ix|3Iv|3B0","✴️","eight-pointed star","o|3|3Iz|3J0|3B0","✴","o|3|3J2|3J0|3B0","❇️","sparkle","o|3|3J4|3J5|3B0","❇","o|3|3J7|3J5|3B0","©️","copyright","o|3|3J9|3JA|3B0","©","o|3|3JC|3JA|3B0","®️","registered","o|3|3JE|3JF|3B0","®","o|3|3JH|3JF|3B0","™️","trade mark","o|3|3JJ|3JK|3B0","™","o|3|3JM|3JK|3B0","#️⃣","keycap: #","o|3|3JO|3JP|3B0","#⃣","o|3|3JR|3JP|3B0","*️⃣","keycap: *","o|3|3JT|3JU|3B0","*⃣","o|3|3JW|3JU|3B0","0️⃣","keycap: 0","o|3|3JY|3JZ|3B0","0⃣","o|3|3Jb|3JZ|3B0","1️⃣","keycap: 1","o|3|3Jd|3Je|3B0","1⃣","o|3|3Jg|3Je|3B0","2️⃣","keycap: 2","o|3|3Ji|3Jj|3B0","2⃣","o|3|3Jl|3Jj|3B0","3️⃣","keycap: 3","o|3|3Jn|3Jo|3B0","3⃣","o|3|3Jq|3Jo|3B0","4️⃣","keycap: 4","o|3|3Js|3Jt|3B0","4⃣","o|3|3Jv|3Jt|3B0","5️⃣","keycap: 5","o|3|3Jx|3Jy|3B0","5⃣","o|3|3K0|3Jy|3B0","6️⃣","keycap: 6","o|3|3K2|3K3|3B0","6⃣","o|3|3K5|3K3|3B0","7️⃣","keycap: 7","o|3|3K7|3K8|3B0","7⃣","o|3|3KA|3K8|3B0","8️⃣","keycap: 8","o|3|3KC|3KD|3B0","8⃣","o|3|3KF|3KD|3B0","9️⃣","keycap: 9","o|3|3KH|3KI|3B0","9⃣","o|3|3KK|3KI|3B0","🔟","keycap: 10","o|3|3KM|3KN|3B0","🔠","input latin uppercase","o|3|3KP|3KQ|3B0","🔡","input latin lowercase","o|3|3KS|3KT|3B0","🔢","input numbers","o|3|3KV|3KW|3B0","🔣","input symbols","o|3|3KY|3KZ|3B0","🔤","input latin letters","o|3|3Kb|3Kc|3B0","🅰️","A button (blood type)","o|3|3Ke|3Kf|3B0","🅰","o|3|3Kh|3Kf|3B0","🆎","AB button (blood type)","o|3|3Kj|3Kk|3B0","🅱️","B button (blood type)","o|3|3Km|3Kn|3B0","🅱","o|3|3Kp|3Kn|3B0","🆑","CL button","o|3|3Kr|3Ks|3B0","🆒","COOL button","o|3|3Ku|3Kv|3B0","🆓","FREE button","o|3|3Kx|3Ky|3B0","ℹ️","information","o|3|3L0|3L1|3B0","ℹ","o|3|3L3|3L1|3B0","🆔","ID button","o|3|3L5|3L6|3B0","Ⓜ️","circled M","o|3|3L8|3L9|3B0","Ⓜ","o|3|3LB|3L9|3B0","🆕","NEW button","o|3|3LD|3LE|3B0","🆖","NG button","o|3|3LG|3LH|3B0","🅾️","O button (blood type)","o|3|3LJ|3LK|3B0","🅾","o|3|3LM|3LK|3B0","🆗","OK button","o|3|3LO|3LP|3B0","🅿️","P button","o|3|3LR|3LS|3B0","🅿","o|3|3LU|3LS|3B0","🆘","SOS button","o|3|3LW|3LX|3B0","🆙","UP! button","o|3|3LZ|3La|3B0","🆚","VS button","o|3|3Lc|3Ld|3B0","🈁","Japanese “here” button","o|3|3Lf|3Lg|3B0","🈂️","Japanese “service charge” button","o|3|3Li|3Lj|3B0","🈂","o|3|3Ll|3Lj|3B0","🈷️","Japanese “monthly amount” button","o|3|3Ln|3Lo|3B0","🈷","o|3|3Lq|3Lo|3B0","🈶","Japanese “not free of charge” button","o|3|3Ls|3Lt|3B0","🈯","Japanese “reserved” button","o|3|3Lv|3Lw|3B0","🉐","Japanese “bargain” button","o|3|3Ly|3Lz|3B0","🈹","Japanese “discount” button","o|3|3M1|3M2|3B0","🈚","Japanese “free of charge” button","o|3|3M4|3M5|3B0","🈲","Japanese “prohibited” button","o|3|3M7|3M8|3B0","🉑","Japanese “acceptable” button","o|3|3MA|3MB|3B0","🈸","Japanese “application” button","o|3|3MD|3ME|3B0","🈴","Japanese “passing grade” button","o|3|3MG|3MH|3B0","🈳","Japanese “vacancy” button","o|3|3MJ|3MK|3B0","㊗️","Japanese “congratulations” button","o|3|3MM|3MN|3B0","㊗","o|3|3MP|3MN|3B0","㊙️","Japanese “secret” button","o|3|3MR|3MS|3B0","㊙","o|3|3MU|3MS|3B0","🈺","Japanese “open for business” button","o|3|3MW|3MX|3B0","🈵","Japanese “no vacancy” button","o|3|3MZ|3Ma|3B0","🔴","red circle","o|3|3Mc|3Md|3B0","🟠","orange circle","o|3|3Mf|3Mg|3B0","🟡","yellow circle","o|3|3Mi|3Mj|3B0","🟢","green circle","o|3|3Ml|3Mm|3B0","🔵","blue circle","o|3|3Mo|3Mp|3B0","🟣","purple circle","o|3|3Mr|3Ms|3B0","🟤","brown circle","o|3|3Mu|3Mv|3B0","⚫","black circle","o|3|3Mx|3My|3B0","⚪","white circle","o|3|3N0|3N1|3B0","🟥","red square","o|3|3N3|3N4|3B0","🟧","orange square","o|3|3N6|3N7|3B0","🟨","yellow square","o|3|3N9|3NA|3B0","🟩","green square","o|3|3NC|3ND|3B0","🟦","blue square","o|3|3NF|3NG|3B0","🟪","purple square","o|3|3NI|3NJ|3B0","🟫","brown square","o|3|3NL|3NM|3B0","⬛","black large square","o|3|3NO|3NP|3B0","⬜","white large square","o|3|3NR|3NS|3B0","◼️","black medium square","o|3|3NU|3NV|3B0","◼","o|3|3NX|3NV|3B0","◻️","white medium square","o|3|3NZ|3Na|3B0","◻","o|3|3Nc|3Na|3B0","◾","black medium-small square","o|3|3Ne|3Nf|3B0","◽","white medium-small square","o|3|3Nh|3Ni|3B0","▪️","black small square","o|3|3Nk|3Nl|3B0","▪","o|3|3Nn|3Nl|3B0","▫️","white small square","o|3|3Np|3Nq|3B0","▫","o|3|3Ns|3Nq|3B0","🔶","large orange diamond","o|3|3Nu|3Nv|3B0","🔷","large blue diamond","o|3|3Nx|3Ny|3B0","🔸","small orange diamond","o|3|3O0|3O1|3B0","🔹","small blue diamond","o|3|3O3|3O4|3B0","🔺","red triangle pointed up","o|3|3O6|3O7|3B0","🔻","red triangle pointed down","o|3|3O9|3OA|3B0","💠","diamond with a dot","o|3|3OC|3OD|3B0","🔘","radio button","o|3|3OF|3OG|3B0","🔳","white square button","o|3|3OI|3OJ|3B0","🔲","black square button","o|3|3OL|3OM|3B0","🏁","chequered flag","Flags","o|3|3OO|3OP|3OQ","🚩","triangular flag","o|3|3OS|3OT|3OQ","🎌","crossed flags","o|3|3OV|3OW|3OQ","🏴","black flag","o|3|3OY|3OZ|3OQ","🏳️","white flag","o|3|3Ob|3Oc|3OQ","🏳","o|3|3Oe|3Oc|3OQ","🏳️‍🌈","rainbow flag","o|3|3Og|3Oh|3OQ","🏳‍🌈","o|3|3Oj|3Oh|3OQ","🏳️‍⚧️","transgender flag","o|3|3Ol|3Om|3OQ","🏳‍⚧️","o|3|3Oo|3Om|3OQ","🏳️‍⚧","o|3|3Oq|3Om|3OQ","🏳‍⚧","o|3|3Os|3Om|3OQ","🏴‍☠️","pirate flag","o|3|3Ou|3Ov|3OQ","🏴‍☠","o|3|3Ox|3Ov|3OQ","🇦🇨","flag: Ascension Island","o|3|3Oz|3P0|3OQ","🇦🇩","flag: Andorra","o|3|3P2|3P3|3OQ","🇦🇪","flag: United Arab Emirates","o|3|3P5|3P6|3OQ","🇦🇫","flag: Afghanistan","o|3|3P8|3P9|3OQ","🇦🇬","flag: Antigua & Barbuda","o|3|3PB|3PC|3OQ","🇦🇮","flag: Anguilla","o|3|3PE|3PF|3OQ","🇦🇱","flag: Albania","o|3|3PH|3PI|3OQ","🇦🇲","flag: Armenia","o|3|3PK|3PL|3OQ","🇦🇴","flag: Angola","o|3|3PN|3PO|3OQ","🇦🇶","flag: Antarctica","o|3|3PQ|3PR|3OQ","🇦🇷","flag: Argentina","o|3|3PT|3PU|3OQ","🇦🇸","flag: American Samoa","o|3|3PW|3PX|3OQ","🇦🇹","flag: Austria","o|3|3PZ|3Pa|3OQ","🇦🇺","flag: Australia","o|3|3Pc|3Pd|3OQ","🇦🇼","flag: Aruba","o|3|3Pf|3Pg|3OQ","🇦🇽","flag: Åland Islands","o|3|3Pi|3Pj|3OQ","🇦🇿","flag: Azerbaijan","o|3|3Pl|3Pm|3OQ","🇧🇦","flag: Bosnia & Herzegovina","o|3|3Po|3Pp|3OQ","🇧🇧","flag: Barbados","o|3|3Pr|3Ps|3OQ","🇧🇩","flag: Bangladesh","o|3|3Pu|3Pv|3OQ","🇧🇪","flag: Belgium","o|3|3Px|3Py|3OQ","🇧🇫","flag: Burkina Faso","o|3|3Q0|3Q1|3OQ","🇧🇬","flag: Bulgaria","o|3|3Q3|3Q4|3OQ","🇧🇭","flag: Bahrain","o|3|3Q6|3Q7|3OQ","🇧🇮","flag: Burundi","o|3|3Q9|3QA|3OQ","🇧🇯","flag: Benin","o|3|3QC|3QD|3OQ","🇧🇱","flag: St. Barthélemy","o|3|3QF|3QG|3OQ","🇧🇲","flag: Bermuda","o|3|3QI|3QJ|3OQ","🇧🇳","flag: Brunei","o|3|3QL|3QM|3OQ","🇧🇴","flag: Bolivia","o|3|3QO|3QP|3OQ","🇧🇶","flag: Caribbean Netherlands","o|3|3QR|3QS|3OQ","🇧🇷","flag: Brazil","o|3|3QU|3QV|3OQ","🇧🇸","flag: Bahamas","o|3|3QX|3QY|3OQ","🇧🇹","flag: Bhutan","o|3|3Qa|3Qb|3OQ","🇧🇻","flag: Bouvet Island","o|3|3Qd|3Qe|3OQ","🇧🇼","flag: Botswana","o|3|3Qg|3Qh|3OQ","🇧🇾","flag: Belarus","o|3|3Qj|3Qk|3OQ","🇧🇿","flag: Belize","o|3|3Qm|3Qn|3OQ","🇨🇦","flag: Canada","o|3|3Qp|3Qq|3OQ","🇨🇨","flag: Cocos (Keeling) Islands","o|3|3Qs|3Qt|3OQ","🇨🇩","flag: Congo - Kinshasa","o|3|3Qv|3Qw|3OQ","🇨🇫","flag: Central African Republic","o|3|3Qy|3Qz|3OQ","🇨🇬","flag: Congo - Brazzaville","o|3|3R1|3R2|3OQ","🇨🇭","flag: Switzerland","o|3|3R4|3R5|3OQ","🇨🇮","flag: Côte d’Ivoire","o|3|3R7|3R8|3OQ","🇨🇰","flag: Cook Islands","o|3|3RA|3RB|3OQ","🇨🇱","flag: Chile","o|3|3RD|3RE|3OQ","🇨🇲","flag: Cameroon","o|3|3RG|3RH|3OQ","🇨🇳","flag: China","o|3|3RJ|3RK|3OQ","🇨🇴","flag: Colombia","o|3|3RM|3RN|3OQ","🇨🇵","flag: Clipperton Island","o|3|3RP|3RQ|3OQ","🇨🇷","flag: Costa Rica","o|3|3RS|3RT|3OQ","🇨🇺","flag: Cuba","o|3|3RV|3RW|3OQ","🇨🇻","flag: Cape Verde","o|3|3RY|3RZ|3OQ","🇨🇼","flag: Curaçao","o|3|3Rb|3Rc|3OQ","🇨🇽","flag: Christmas Island","o|3|3Re|3Rf|3OQ","🇨🇾","flag: Cyprus","o|3|3Rh|3Ri|3OQ","🇨🇿","flag: Czechia","o|3|3Rk|3Rl|3OQ","🇩🇪","flag: Germany","o|3|3Rn|3Ro|3OQ","🇩🇬","flag: Diego Garcia","o|3|3Rq|3Rr|3OQ","🇩🇯","flag: Djibouti","o|3|3Rt|3Ru|3OQ","🇩🇰","flag: Denmark","o|3|3Rw|3Rx|3OQ","🇩🇲","flag: Dominica","o|3|3Rz|3S0|3OQ","🇩🇴","flag: Dominican Republic","o|3|3S2|3S3|3OQ","🇩🇿","flag: Algeria","o|3|3S5|3S6|3OQ","🇪🇦","flag: Ceuta & Melilla","o|3|3S8|3S9|3OQ","🇪🇨","flag: Ecuador","o|3|3SB|3SC|3OQ","🇪🇪","flag: Estonia","o|3|3SE|3SF|3OQ","🇪🇬","flag: Egypt","o|3|3SH|3SI|3OQ","🇪🇭","flag: Western Sahara","o|3|3SK|3SL|3OQ","🇪🇷","flag: Eritrea","o|3|3SN|3SO|3OQ","🇪🇸","flag: Spain","o|3|3SQ|3SR|3OQ","🇪🇹","flag: Ethiopia","o|3|3ST|3SU|3OQ","🇪🇺","flag: European Union","o|3|3SW|3SX|3OQ","🇫🇮","flag: Finland","o|3|3SZ|3Sa|3OQ","🇫🇯","flag: Fiji","o|3|3Sc|3Sd|3OQ","🇫🇰","flag: Falkland Islands","o|3|3Sf|3Sg|3OQ","🇫🇲","flag: Micronesia","o|3|3Si|3Sj|3OQ","🇫🇴","flag: Faroe Islands","o|3|3Sl|3Sm|3OQ","🇫🇷","flag: France","o|3|3So|3Sp|3OQ","🇬🇦","flag: Gabon","o|3|3Sr|3Ss|3OQ","🇬🇧","flag: United Kingdom","o|3|3Su|3Sv|3OQ","🇬🇩","flag: Grenada","o|3|3Sx|3Sy|3OQ","🇬🇪","flag: Georgia","o|3|3T0|3T1|3OQ","🇬🇫","flag: French Guiana","o|3|3T3|3T4|3OQ","🇬🇬","flag: Guernsey","o|3|3T6|3T7|3OQ","🇬🇭","flag: Ghana","o|3|3T9|3TA|3OQ","🇬🇮","flag: Gibraltar","o|3|3TC|3TD|3OQ","🇬🇱","flag: Greenland","o|3|3TF|3TG|3OQ","🇬🇲","flag: Gambia","o|3|3TI|3TJ|3OQ","🇬🇳","flag: Guinea","o|3|3TL|3TM|3OQ","🇬🇵","flag: Guadeloupe","o|3|3TO|3TP|3OQ","🇬🇶","flag: Equatorial Guinea","o|3|3TR|3TS|3OQ","🇬🇷","flag: Greece","o|3|3TU|3TV|3OQ","🇬🇸","flag: South Georgia & South Sandwich Islands","o|3|3TX|3TY|3OQ","🇬🇹","flag: Guatemala","o|3|3Ta|3Tb|3OQ","🇬🇺","flag: Guam","o|3|3Td|3Te|3OQ","🇬🇼","flag: Guinea-Bissau","o|3|3Tg|3Th|3OQ","🇬🇾","flag: Guyana","o|3|3Tj|3Tk|3OQ","🇭🇰","flag: Hong Kong SAR China","o|3|3Tm|3Tn|3OQ","🇭🇲","flag: Heard & McDonald Islands","o|3|3Tp|3Tq|3OQ","🇭🇳","flag: Honduras","o|3|3Ts|3Tt|3OQ","🇭🇷","flag: Croatia","o|3|3Tv|3Tw|3OQ","🇭🇹","flag: Haiti","o|3|3Ty|3Tz|3OQ","🇭🇺","flag: Hungary","o|3|3U1|3U2|3OQ","🇮🇨","flag: Canary Islands","o|3|3U4|3U5|3OQ","🇮🇩","flag: Indonesia","o|3|3U7|3U8|3OQ","🇮🇪","flag: Ireland","o|3|3UA|3UB|3OQ","🇮🇱","flag: Israel","o|3|3UD|3UE|3OQ","🇮🇲","flag: Isle of Man","o|3|3UG|3UH|3OQ","🇮🇳","flag: India","o|3|3UJ|3UK|3OQ","🇮🇴","flag: British Indian Ocean Territory","o|3|3UM|3UN|3OQ","🇮🇶","flag: Iraq","o|3|3UP|3UQ|3OQ","🇮🇷","flag: Iran","o|3|3US|3UT|3OQ","🇮🇸","flag: Iceland","o|3|3UV|3UW|3OQ","🇮🇹","flag: Italy","o|3|3UY|3UZ|3OQ","🇯🇪","flag: Jersey","o|3|3Ub|3Uc|3OQ","🇯🇲","flag: Jamaica","o|3|3Ue|3Uf|3OQ","🇯🇴","flag: Jordan","o|3|3Uh|3Ui|3OQ","🇯🇵","flag: Japan","o|3|3Uk|3Ul|3OQ","🇰🇪","flag: Kenya","o|3|3Un|3Uo|3OQ","🇰🇬","flag: Kyrgyzstan","o|3|3Uq|3Ur|3OQ","🇰🇭","flag: Cambodia","o|3|3Ut|3Uu|3OQ","🇰🇮","flag: Kiribati","o|3|3Uw|3Ux|3OQ","🇰🇲","flag: Comoros","o|3|3Uz|3V0|3OQ","🇰🇳","flag: St. Kitts & Nevis","o|3|3V2|3V3|3OQ","🇰🇵","flag: North Korea","o|3|3V5|3V6|3OQ","🇰🇷","flag: South Korea","o|3|3V8|3V9|3OQ","🇰🇼","flag: Kuwait","o|3|3VB|3VC|3OQ","🇰🇾","flag: Cayman Islands","o|3|3VE|3VF|3OQ","🇰🇿","flag: Kazakhstan","o|3|3VH|3VI|3OQ","🇱🇦","flag: Laos","o|3|3VK|3VL|3OQ","🇱🇧","flag: Lebanon","o|3|3VN|3VO|3OQ","🇱🇨","flag: St. Lucia","o|3|3VQ|3VR|3OQ","🇱🇮","flag: Liechtenstein","o|3|3VT|3VU|3OQ","🇱🇰","flag: Sri Lanka","o|3|3VW|3VX|3OQ","🇱🇷","flag: Liberia","o|3|3VZ|3Va|3OQ","🇱🇸","flag: Lesotho","o|3|3Vc|3Vd|3OQ","🇱🇹","flag: Lithuania","o|3|3Vf|3Vg|3OQ","🇱🇺","flag: Luxembourg","o|3|3Vi|3Vj|3OQ","🇱🇻","flag: Latvia","o|3|3Vl|3Vm|3OQ","🇱🇾","flag: Libya","o|3|3Vo|3Vp|3OQ","🇲🇦","flag: Morocco","o|3|3Vr|3Vs|3OQ","🇲🇨","flag: Monaco","o|3|3Vu|3Vv|3OQ","🇲🇩","flag: Moldova","o|3|3Vx|3Vy|3OQ","🇲🇪","flag: Montenegro","o|3|3W0|3W1|3OQ","🇲🇫","flag: St. Martin","o|3|3W3|3W4|3OQ","🇲🇬","flag: Madagascar","o|3|3W6|3W7|3OQ","🇲🇭","flag: Marshall Islands","o|3|3W9|3WA|3OQ","🇲🇰","flag: North Macedonia","o|3|3WC|3WD|3OQ","🇲🇱","flag: Mali","o|3|3WF|3WG|3OQ","🇲🇲","flag: Myanmar (Burma)","o|3|3WI|3WJ|3OQ","🇲🇳","flag: Mongolia","o|3|3WL|3WM|3OQ","🇲🇴","flag: Macao SAR China","o|3|3WO|3WP|3OQ","🇲🇵","flag: Northern Mariana Islands","o|3|3WR|3WS|3OQ","🇲🇶","flag: Martinique","o|3|3WU|3WV|3OQ","🇲🇷","flag: Mauritania","o|3|3WX|3WY|3OQ","🇲🇸","flag: Montserrat","o|3|3Wa|3Wb|3OQ","🇲🇹","flag: Malta","o|3|3Wd|3We|3OQ","🇲🇺","flag: Mauritius","o|3|3Wg|3Wh|3OQ","🇲🇻","flag: Maldives","o|3|3Wj|3Wk|3OQ","🇲🇼","flag: Malawi","o|3|3Wm|3Wn|3OQ","🇲🇽","flag: Mexico","o|3|3Wp|3Wq|3OQ","🇲🇾","flag: Malaysia","o|3|3Ws|3Wt|3OQ","🇲🇿","flag: Mozambique","o|3|3Wv|3Ww|3OQ","🇳🇦","flag: Namibia","o|3|3Wy|3Wz|3OQ","🇳🇨","flag: New Caledonia","o|3|3X1|3X2|3OQ","🇳🇪","flag: Niger","o|3|3X4|3X5|3OQ","🇳🇫","flag: Norfolk Island","o|3|3X7|3X8|3OQ","🇳🇬","flag: Nigeria","o|3|3XA|3XB|3OQ","🇳🇮","flag: Nicaragua","o|3|3XD|3XE|3OQ","🇳🇱","flag: Netherlands","o|3|3XG|3XH|3OQ","🇳🇴","flag: Norway","o|3|3XJ|3XK|3OQ","🇳🇵","flag: Nepal","o|3|3XM|3XN|3OQ","🇳🇷","flag: Nauru","o|3|3XP|3XQ|3OQ","🇳🇺","flag: Niue","o|3|3XS|3XT|3OQ","🇳🇿","flag: New Zealand","o|3|3XV|3XW|3OQ","🇴🇲","flag: Oman","o|3|3XY|3XZ|3OQ","🇵🇦","flag: Panama","o|3|3Xb|3Xc|3OQ","🇵🇪","flag: Peru","o|3|3Xe|3Xf|3OQ","🇵🇫","flag: French Polynesia","o|3|3Xh|3Xi|3OQ","🇵🇬","flag: Papua New Guinea","o|3|3Xk|3Xl|3OQ","🇵🇭","flag: Philippines","o|3|3Xn|3Xo|3OQ","🇵🇰","flag: Pakistan","o|3|3Xq|3Xr|3OQ","🇵🇱","flag: Poland","o|3|3Xt|3Xu|3OQ","🇵🇲","flag: St. Pierre & Miquelon","o|3|3Xw|3Xx|3OQ","🇵🇳","flag: Pitcairn Islands","o|3|3Xz|3Y0|3OQ","🇵🇷","flag: Puerto Rico","o|3|3Y2|3Y3|3OQ","🇵🇸","flag: Palestinian Territories","o|3|3Y5|3Y6|3OQ","🇵🇹","flag: Portugal","o|3|3Y8|3Y9|3OQ","🇵🇼","flag: Palau","o|3|3YB|3YC|3OQ","🇵🇾","flag: Paraguay","o|3|3YE|3YF|3OQ","🇶🇦","flag: Qatar","o|3|3YH|3YI|3OQ","🇷🇪","flag: Réunion","o|3|3YK|3YL|3OQ","🇷🇴","flag: Romania","o|3|3YN|3YO|3OQ","🇷🇸","flag: Serbia","o|3|3YQ|3YR|3OQ","🇷🇺","flag: Russia","o|3|3YT|3YU|3OQ","🇷🇼","flag: Rwanda","o|3|3YW|3YX|3OQ","🇸🇦","flag: Saudi Arabia","o|3|3YZ|3Ya|3OQ","🇸🇧","flag: Solomon Islands","o|3|3Yc|3Yd|3OQ","🇸🇨","flag: Seychelles","o|3|3Yf|3Yg|3OQ","🇸🇩","flag: Sudan","o|3|3Yi|3Yj|3OQ","🇸🇪","flag: Sweden","o|3|3Yl|3Ym|3OQ","🇸🇬","flag: Singapore","o|3|3Yo|3Yp|3OQ","🇸🇭","flag: St. Helena","o|3|3Yr|3Ys|3OQ","🇸🇮","flag: Slovenia","o|3|3Yu|3Yv|3OQ","🇸🇯","flag: Svalbard & Jan Mayen","o|3|3Yx|3Yy|3OQ","🇸🇰","flag: Slovakia","o|3|3Z0|3Z1|3OQ","🇸🇱","flag: Sierra Leone","o|3|3Z3|3Z4|3OQ","🇸🇲","flag: San Marino","o|3|3Z6|3Z7|3OQ","🇸🇳","flag: Senegal","o|3|3Z9|3ZA|3OQ","🇸🇴","flag: Somalia","o|3|3ZC|3ZD|3OQ","🇸🇷","flag: Suriname","o|3|3ZF|3ZG|3OQ","🇸🇸","flag: South Sudan","o|3|3ZI|3ZJ|3OQ","🇸🇹","flag: São Tomé & Príncipe","o|3|3ZL|3ZM|3OQ","🇸🇻","flag: El Salvador","o|3|3ZO|3ZP|3OQ","🇸🇽","flag: Sint Maarten","o|3|3ZR|3ZS|3OQ","🇸🇾","flag: Syria","o|3|3ZU|3ZV|3OQ","🇸🇿","flag: Eswatini","o|3|3ZX|3ZY|3OQ","🇹🇦","flag: Tristan da Cunha","o|3|3Za|3Zb|3OQ","🇹🇨","flag: Turks & Caicos Islands","o|3|3Zd|3Ze|3OQ","🇹🇩","flag: Chad","o|3|3Zg|3Zh|3OQ","🇹🇫","flag: French Southern Territories","o|3|3Zj|3Zk|3OQ","🇹🇬","flag: Togo","o|3|3Zm|3Zn|3OQ","🇹🇭","flag: Thailand","o|3|3Zp|3Zq|3OQ","🇹🇯","flag: Tajikistan","o|3|3Zs|3Zt|3OQ","🇹🇰","flag: Tokelau","o|3|3Zv|3Zw|3OQ","🇹🇱","flag: Timor-Leste","o|3|3Zy|3Zz|3OQ","🇹🇲","flag: Turkmenistan","o|3|3a1|3a2|3OQ","🇹🇳","flag: Tunisia","o|3|3a4|3a5|3OQ","🇹🇴","flag: Tonga","o|3|3a7|3a8|3OQ","🇹🇷","flag: Türkiye","o|3|3aA|3aB|3OQ","🇹🇹","flag: Trinidad & Tobago","o|3|3aD|3aE|3OQ","🇹🇻","flag: Tuvalu","o|3|3aG|3aH|3OQ","🇹🇼","flag: Taiwan","o|3|3aJ|3aK|3OQ","🇹🇿","flag: Tanzania","o|3|3aM|3aN|3OQ","🇺🇦","flag: Ukraine","o|3|3aP|3aQ|3OQ","🇺🇬","flag: Uganda","o|3|3aS|3aT|3OQ","🇺🇲","flag: U.S. Outlying Islands","o|3|3aV|3aW|3OQ","🇺🇳","flag: United Nations","o|3|3aY|3aZ|3OQ","🇺🇸","flag: United States","o|3|3ab|3ac|3OQ","🇺🇾","flag: Uruguay","o|3|3ae|3af|3OQ","🇺🇿","flag: Uzbekistan","o|3|3ah|3ai|3OQ","🇻🇦","flag: Vatican City","o|3|3ak|3al|3OQ","🇻🇨","flag: St. Vincent & Grenadines","o|3|3an|3ao|3OQ","🇻🇪","flag: Venezuela","o|3|3aq|3ar|3OQ","🇻🇬","flag: British Virgin Islands","o|3|3at|3au|3OQ","🇻🇮","flag: U.S. Virgin Islands","o|3|3aw|3ax|3OQ","🇻🇳","flag: Vietnam","o|3|3az|3b0|3OQ","🇻🇺","flag: Vanuatu","o|3|3b2|3b3|3OQ","🇼🇫","flag: Wallis & Futuna","o|3|3b5|3b6|3OQ","🇼🇸","flag: Samoa","o|3|3b8|3b9|3OQ","🇽🇰","flag: Kosovo","o|3|3bB|3bC|3OQ","🇾🇪","flag: Yemen","o|3|3bE|3bF|3OQ","🇾🇹","flag: Mayotte","o|3|3bH|3bI|3OQ","🇿🇦","flag: South Africa","o|3|3bK|3bL|3OQ","🇿🇲","flag: Zambia","o|3|3bN|3bO|3OQ","🇿🇼","flag: Zimbabwe","o|3|3bQ|3bR|3OQ","🏴󠁧󠁢󠁥󠁮󠁧󠁿","flag: England","o|3|3bT|3bU|3OQ","🏴󠁧󠁢󠁳󠁣󠁴󠁿","flag: Scotland","o|3|3bW|3bX|3OQ","🏴󠁧󠁢󠁷󠁬󠁳󠁿","flag: Wales","o|3|3bZ|3ba|3OQ","a|7|A|D|G|J|M|P|S|V|Y|b|e|h|k|n|q|t|w|z|12|14|17|1A|1D|1G|1J|1M|1P|1S|1V|1Y|1b|1e|1h|1k|1n|1q|1t|1w|1z|22|25|28|2B|2D|2G|2J|2M|2P|2S|2V|2Y|2b|2d|2g|2i|2l|2o|2r|2u|2x|30|33|36|39|3C|3F|3I|3L|3O|3R|3U|3X|3a|3d|3g|3j|3m|3p|3s|3v|3y|41|44|46|49|4C|4F|4I|4L|4O|4R|4U|4X|4a|4d|4g|4j|4m|4p|4s|4v|4y|51|54|57|5A|5D|5G|5J|5M|5P|5S|5V|5X|5a|5d|5g|5j|5m|5p|5s|5v|5y|61|64|67|6A|6D|6G|6J|6M|6P|6S|6V|6Y|6b|6e|6h|6k|6n|6q|6t|6w|6z|71|74|77|79|7C|7E|7H|7J|7M|7P|7S|7V|7Y|7b|7e|7h|7k|7n|7q|7t|7w|7z|82|85|88|8B|8E|8G|8J|8M|8O|8Q|8S|8V|8X|8a|8c|8f|8i|8m|8p|8s|8v|8y|91|94|97|9A|9D|9G|9J|9M|9O|9R|9U|9X|9a|9d|9g|9j|9m|9p|9s|9v|9y|A1|A4|A7|AA|AD|AG|AJ|AM|AP|AS|AV|AY|Ab|Ae|Ah|Ak|An|Aq|At|Aw|Az|B2|B5|B8|BB|BE|BH|BK|BN|BQ|BT|BW|BZ|Bc|Bf|Bi|Bl|Bo|Br|Bu|Bx|C0|C3|C6|C9|CC|CF|CI|CL|CO|CR|CU|CX|Ca|Cd|Cg|Cj|Cm|Cp|Cs|Cu|Cx|D0|D3|D6|D9|DC|DF|DI|DL|DO|DR|DU|DX|Da|Dd|Dg|Dj|Dm|Dp|Ds|Dv|Dy|E1|E4|E7|EA|ED|EG|EJ|EM|EP|ES|EV|EY|Eb|Ee|Eh|Ek|En|Eq|Et|Ew|Ez|F2|F5|F8|FB|FE|FH|FK|FN|FQ|FT|FW|FZ|Fc|Ff|Fi|Fl|Fo|Fr|Fu|Fx|G0|G3|G6|G8|GB|GE|GH|GK|GN|GQ|GT|GW|GZ|Gc|Gf|Gi|Gl|Go|Gr|Gu|Gx|H0|H3|H6|H9|HC|HF|HI|HL|HO|HR|HU|HX|Ha|Hd|Hg|Hj|Hm|Hp|Hs|Hv|Hy|I1|I4|I7|IA|ID|IG|IJ|IM|IP|IS|IV|IY|Ib|Ie|Ih|Ik|In|Iq|It|Iw|Iz|J2|J5|J8|JB|JE|JH|JK|JN|JQ|JT|JW|JZ|Jc|Jf|Ji|Jl|Jo|Jr|Ju|Jx|K0|K3|K6|K9|KC|KF|KI|KL|KO|KR|KU|KX|Ka|Kd|Kg|Kj|Km|Kp|Ks|Kv|Ky|L1|L4|L7|LA|LD|LG|LJ|LM|LP|LS|LU|LX|La|Ld|Lg|Lj|Lm|Lp|Ls|Lv|Ly|M1|M4|M7|MA|MD|MG|MJ|MM|MP|MS|MV|MY|Mb|Me|Mh|Mk|Mn|Mq|Mt|Mw|Mz|N2|N5|N8|NB|NE|NH|NK|NN|NQ|NT|NW|NZ|Nc|Nf|Ni|Nl|No|Nr|Nu|Nx|O0|O3|O6|O9|OC|OF|OI|OL|OO|OR|OU|OW|OZ|Oc|Of|Oi|Ol|Oo|Or|Ou|Ox|P0|P3|P6|P9|PC|PF|PI|PL|PO|PR|PU|PX|Pa|Pd|Pg|Pj|Pm|Pp|Ps|Pv|Py|Q1|Q4|Q7|QA|QD|QG|QJ|QM|QP|QS|QV|QY|Qb|Qe|Qh|Qk|Qn|Qq|Qt|Qw|Qz|R2|R4|R7|R9|RC|RE|RH|RJ|RM|RO|RR|RT|RW|RY|Rb|Rd|Rg|Ri|Rl|Rn|Rq|Rs|Rv|Rx|S0|S3|S6|S9|SC|SF|SI|SL|SO|SR|SU|SX|Sa|Sd|Sg|Sj|Sm|Sp|Ss|Sv|Sy|T1|T4|T7|TA|TD|TG|TJ|TM|TP|TS|TV|TY|Tb|Te|Th|Tk|Tn|Tq|Tt|Tw|Tz|U2|U5|U8|UB|UE|UH|UK|UN|UQ|UT|UW|UZ|Uc|Uf|Ui|Ul|Uo|Ur|Uu|Ux|V0|V3|V6|V9|VC|VF|VI|VL|VO|VR|VU|VX|Va|Vd|Vg|Vj|Vm|Vo|Vr|Vt|Vw|Vy|W1|W3|W6|W8|WB|WD|WG|WI|WL|WN|WQ|WS|WV|WX|Wa|Wc|Wf|Wh|Wk|Wn|Wq|Wt|Ww|Wz|X2|X5|X8|XB|XE|XH|XK|XN|XQ|XT|XW|XZ|Xc|Xf|Xi|Xl|Xo|Xr|Xu|Xw|Xz|Y1|Y4|Y6|Y9|YB|YE|YG|YJ|YL|YO|YQ|YT|YV|YY|Ya|Yd|Yf|Yi|Yk|Yn|Yp|Ys|Yv|Yy|Z1|Z4|Z7|ZA|ZC|ZF|ZH|ZK|ZM|ZP|ZR|ZU|ZW|ZZ|Zb|Ze|Zg|Zj|Zl|Zo|Zq|Zt|Zv|Zy|a0|a3|a5|a8|aB|aE|aH|aK|aN|aQ|aS|aV|aX|aa|ac|af|ah|ak|am|ap|ar|au|aw|az|b1|b4|b6|b9|bB|bE|bG|bJ|bL|bO|bR|bU|bX|ba|bd|bg|bi|bl|bn|bq|bs|bv|bx|c0|c2|c5|c7|cA|cC|cF|cH|cK|cM|cP|cR|cU|cW|cZ|cb|ce|ch|ck|cn|cq|ct|cw|cy|d1|d3|d6|d8|dB|dD|dG|dI|dL|dN|dQ|dS|dV|dX|da|dc|df|dh|dk|dm|dp|dr|du|dx|e0|e3|e6|e9|eC|eE|eH|eJ|eM|eO|eR|eT|eW|eY|eb|ed|eg|ei|el|en|eq|es|ev|ex|f0|f2|f5|f7|fA|fD|fG|fJ|fM|fP|fS|fU|fX|fZ|fc|fe|fh|fj|fm|fo|fr|ft|fw|fy|g1|g3|g6|g8|gB|gD|gG|gI|gL|gN|gQ|gT|gW|gZ|gc|gf|gi|gk|gn|gp|gs|gu|gx|gz|h2|h4|h7|h9|hC|hE|hH|hJ|hM|hO|hR|hT|hW|hY|hb|hd|hg|hj|hm|hp|hs|hv|hy|i0|i3|i5|i8|iA|iD|iF|iI|iK|iN|iP|iS|iU|iX|iZ|ic|ie|ih|ij|im|io|ir|it|iw|iz|j2|j5|j8|jB|jE|jG|jJ|jL|jO|jQ|jT|jV|jY|ja|jd|jf|ji|jk|jn|jp|js|ju|jx|jz|k2|k4|k7|k9|kC|kE|kH|kJ|kM|kO|kR|kT|kW|kY|kb|kd|kg|ki|kl|kn|kq|ks|kv|kx|l0|l2|l5|l7|lA|lC|lF|lH|lK|lM|lP|lR|lU|lW|lZ|lb|le|lh|lk|ln|lq|lt|lw|lz|m2|m5|m8|mB|mE|mH|mK|mN|mQ|mT|mW|mZ|mc|mf|mi|ml|mo|mr|mu|mx|n0|n3|n6|n9|nC|nF|nI|nL|nO|nQ|nT|nV|nY|na|nd|nf|ni|nk|nn|np|ns|nu|nx|nz|o2|o4|o7|o9|oC|oE|oH|oJ|oM|oO|oR|oT|oW|oY|ob|od|og|oi|ol|on|oq|ot|ow|oz|p2|p5|p8|pB|pE|pH|pK|pN|pQ|pT|pW|pZ|pc|pf|pi|pl|po|pr|pu|px|q0|q3|q6|q9|qC|qF|qI|qL|qO|qR|qU|qX|qa|qd|qg|qj|qm|qp|qs|qv|qy|r1|r4|r7|rA|rD|rG|rJ|rM|rP|rS|rV|rY|rb|re|rh|rk|rn|rq|rt|rw|rz|s2|s5|s8|sB|sE|sH|sK|sN|sQ|sT|sW|sZ|sc|sf|si|sl|so|sr|su|sx|t0|t3|t6|t9|tC|tF|tI|tL|tO|tR|tU|tX|ta|td|tg|tj|tm|tp|ts|tv|ty|u1|u4|u7|uA|uD|uG|uJ|uM|uP|uS|uV|uY|ub|ue|uh|uk|un|uq|ut|uw|uz|v2|v5|v8|vB|vE|vH|vK|vN|vQ|vT|vW|vZ|vc|vf|vi|vl|vo|vr|vu|vx|w0|w3|w6|w9|wC|wF|wI|wL|wO|wR|wU|wX|wa|wd|wg|wi|wl|wn|wq|ws|wv|wx|x0|x2|x5|x7|xA|xC|xF|xH|xK|xM|xP|xR|xU|xW|xZ|xb|xe|xg|xj|xl|xo|xq|xt|xv|xy|y0|y3|y5|y8|yB|yE|yH|yK|yN|yQ|yT|yW|yZ|yc|yf|yi|yl|yo|yr|yu|yx|z0|z3|z6|z9|zC|zF|zI|zL|zO|zR|zU|zX|za|zd|zg|zj|zm|zp|zs|zv|zy|101|104|107|10A|10C|10F|10H|10K|10M|10P|10R|10U|10W|10Z|10b|10e|10g|10j|10l|10o|10q|10t|10v|10y|110|113|115|118|11A|11D|11G|11J|11M|11P|11S|11U|11W|11Y|11b|11d|11g|11i|11l|11n|11q|11s|11v|11x|120|122|124|126|129|12B|12E|12G|12J|12L|12O|12Q|12T|12V|12Y|12b|12e|12h|12k|12n|12q|12s|12v|12x|130|132|135|137|13A|13C|13F|13H|13K|13M|13P|13R|13U|13W|13Z|13b|13e|13g|13j|13l|13o|13r|13u|13x|140|143|146|149|14C|14F|14I|14L|14O|14Q|14T|14V|14Y|14a|14d|14f|14i|14k|14n|14p|14s|14u|14x|14z|152|154|157|159|15C|15E|15H|15J|15M|15P|15S|15V|15Y|15b|15e|15h|15k|15n|15q|15t|15w|15z|162|165|168|16B|16E|16H|16K|16N|16Q|16T|16W|16Y|16b|16d|16g|16i|16l|16n|16q|16s|16v|16x|170|172|175|177|17A|17C|17F|17H|17K|17M|17P|17R|17U|17X|17a|17d|17g|17j|17m|17p|17s|17v|17y|181|184|187|18A|18D|18G|18J|18M|18O|18R|18T|18W|18Y|18b|18d|18g|18i|18l|18n|18q|18s|18v|18x|190|192|195|197|19A|19C|19F|19H|19K|19N|19Q|19T|19W|19Z|19c|19e|19h|19j|19m|19o|19r|19t|19w|19y|1A1|1A3|1A6|1A8|1AB|1AD|1AG|1AI|1AL|1AN|1AQ|1AS|1AV|1AX|1Aa|1Ad|1Ag|1Aj|1Am|1Ap|1As|1Av|1Ay|1B1|1B4|1B7|1BA|1BD|1BG|1BJ|1BM|1BP|1BS|1BV|1BY|1Bb|1Be|1Bh|1Bk|1Bn|1Bq|1Bt|1Bw|1Bz|1C2|1C5|1C8|1CB|1CE|1CH|1CK|1CN|1CQ|1CT|1CW|1CZ|1Cc|1Cf|1Ci|1Cl|1Co|1Cr|1Cu|1Cx|1D0|1D3|1D6|1D9|1DC|1DF|1DI|1DL|1DO|1DR|1DU|1DX|1Da|1Dd|1Dg|1Dj|1Dm|1Dp|1Ds|1Dv|1Dy|1E1|1E4|1E6|1E9|1EB|1EE|1EG|1EJ|1EL|1EO|1EQ|1ET|1EV|1EY|1Ea|1Ed|1Ef|1Ei|1Ek|1En|1Ep|1Es|1Eu|1Ex|1Ez|1F2|1F5|1F8|1FB|1FE|1FH|1FK|1FM|1FP|1FR|1FU|1FW|1FZ|1Fb|1Fe|1Fg|1Fj|1Fl|1Fo|1Fq|1Ft|1Fv|1Fy|1G0|1G3|1G5|1G8|1GA|1GD|1GF|1GI|1GL|1GO|1GR|1GU|1GX|1Ga|1Gc|1Gf|1Gh|1Gk|1Gm|1Gp|1Gr|1Gu|1Gw|1Gz|1H1|1H4|1H6|1H9|1HB|1HE|1HG|1HJ|1HL|1HO|1HQ|1HT|1HV|1HY|1Hb|1He|1Hh|1Hk|1Hn|1Hq|1Hs|1Hv|1Hx|1I0|1I2|1I5|1I7|1IA|1IC|1IF|1IH|1IK|1IM|1IP|1IR|1IU|1IW|1IZ|1Ib|1Ie|1Ig|1Ij|1Il|1Io|1Ir|1Iu|1Ix|1J0|1J3|1J6|1J8|1JB|1JD|1JG|1JI|1JL|1JN|1JQ|1JS|1JV|1JX|1Ja|1Jc|1Jf|1Jh|1Jk|1Jm|1Jp|1Jr|1Ju|1Jw|1Jz|1K1|1K4|1K7|1KA|1KD|1KG|1KJ|1KM|1KO|1KR|1KT|1KW|1KY|1Kb|1Kd|1Kg|1Ki|1Kl|1Kn|1Kq|1Ks|1Kv|1Kx|1L0|1L2|1L5|1L7|1LA|1LC|1LF|1LH|1LK|1LN|1LQ|1LT|1LW|1LZ|1Lc|1Le|1Lh|1Lj|1Lm|1Lo|1Lr|1Lt|1Lw|1Ly|1M1|1M3|1M6|1M8|1MB|1MD|1MG|1MI|1ML|1MN|1MQ|1MS|1MV|1MX|1Ma|1Md|1Mf|1Mi|1Mk|1Mn|1Mq|1Ms|1Mv|1Mx|1N0|1N3|1N6|1N9|1NC|1NF|1NI|1NL|1NN|1NQ|1NS|1NV|1NX|1Na|1Nc|1Nf|1Nh|1Nk|1Nm|1Np|1Nr|1Nu|1Nw|1Nz|1O1|1O4|1O6|1O9|1OB|1OE|1OG|1OJ|1OM|1OP|1OS|1OV|1OY|1Ob|1Od|1Og|1Oi|1Ol|1On|1Oq|1Os|1Ov|1Ox|1P0|1P2|1P5|1P7|1PA|1PC|1PF|1PH|1PK|1PM|1PP|1PR|1PU|1PW|1PZ|1Pc|1Pf|1Pi|1Pl|1Po|1Pr|1Pt|1Pw|1Py|1Q1|1Q3|1Q6|1Q8|1QB|1QD|1QG|1QI|1QL|1QN|1QQ|1QS|1QV|1QX|1Qa|1Qc|1Qf|1Qh|1Qk|1Qm|1Qp|1Qr|1Qu|1Qw|1Qz|1R1|1R4|1R6|1R9|1RB|1RE|1RG|1RJ|1RL|1RN|1RP|1RS|1RU|1RW|1RY|1Rb|1Rd|1Rf|1Rh|1Rk|1Rm|1Ro|1Rq|1Rt|1Rv|1Rx|1Rz|1S2|1S4|1S6|1S8|1SB|1SD|1SF|1SH|1SK|1SM|1SO|1SQ|1ST|1SV|1SX|1SZ|1Sc|1Se|1Sg|1Si|1Sl|1Sn|1Sp|1Sr|1Su|1Sw|1Sy|1T0|1T3|1T6|1T9|1TC|1TF|1TI|1TL|1TN|1TQ|1TS|1TV|1TX|1Ta|1Tc|1Tf|1Th|1Tk|1Tm|1Tp|1Tr|1Tu|1Tw|1Tz|1U1|1U4|1U6|1U9|1UB|1UE|1UG|1UJ|1UM|1UP|1US|1UV|1UY|1Ub|1Ud|1Ug|1Ui|1Ul|1Un|1Uq|1Us|1Uv|1Ux|1V0|1V2|1V5|1V7|1VA|1VC|1VF|1VH|1VK|1VM|1VP|1VR|1VU|1VW|1VZ|1Vb|1Ve|1Vg|1Vj|1Vl|1Vo|1Vq|1Vt|1Vv|1Vy|1W0|1W3|1W5|1W7|1W9|1WC|1WE|1WG|1WI|1WL|1WN|1WP|1WR|1WU|1WW|1WY|1Wa|1Wd|1Wf|1Wh|1Wj|1Wm|1Wo|1Wq|1Ws|1Wv|1Wx|1Wz|1X1|1X4|1X6|1X8|1XA|1XD|1XF|1XH|1XJ|1XM|1XO|1XQ|1XS|1XV|1XX|1XZ|1Xb|1Xe|1Xg|1Xi|1Xk|1Xn|1Xq|1Xt|1Xw|1Xz|1Y2|1Y5|1Y7|1YA|1YC|1YF|1YH|1YK|1YM|1YP|1YR|1YU|1YW|1YZ|1Yc|1Yf|1Yi|1Yl|1Yo|1Yr|1Yt|1Yw|1Yy|1Z1|1Z3|1Z6|1Z8|1ZB|1ZD|1ZG|1ZI|1ZL|1ZO|1ZR|1ZU|1ZX|1Za|1Zd|1Zf|1Zi|1Zk|1Zn|1Zp|1Zs|1Zu|1Zx|1Zz|1a2|1a4|1a7|1aA|1aD|1aG|1aJ|1aM|1aP|1aR|1aU|1aW|1aZ|1ab|1ae|1ag|1aj|1al|1ao|1aq|1at|1aw|1az|1b2|1b5|1b8|1bB|1bD|1bG|1bI|1bL|1bN|1bQ|1bS|1bV|1bX|1ba|1bc|1bf|1bi|1bl|1bo|1br|1bu|1bx|1bz|1c2|1c4|1c7|1c9|1cC|1cE|1cH|1cJ|1cM|1cO|1cR|1cU|1cX|1ca|1cd|1cg|1cj|1cl|1co|1cq|1ct|1cv|1cy|1d0|1d3|1d5|1d8|1dA|1dD|1dG|1dJ|1dM|1dP|1dS|1dV|1dX|1da|1dc|1df|1dh|1dk|1dm|1dp|1dr|1du|1dw|1dz|1e2|1e5|1e8|1eB|1eE|1eH|1eJ|1eM|1eO|1eR|1eT|1eW|1eY|1eb|1ed|1eg|1ei|1el|1eo|1er|1eu|1ex|1f0|1f3|1f5|1f8|1fA|1fD|1fF|1fI|1fK|1fN|1fP|1fS|1fU|1fX|1fZ|1fc|1fe|1fh|1fj|1fm|1fo|1fr|1ft|1fw|1fy|1g1|1g3|1g6|1g8|1gB|1gD|1gG|1gI|1gL|1gN|1gQ|1gS|1gV|1gX|1gZ|1gb|1ge|1gg|1gi|1gk|1gn|1gp|1gr|1gt|1gw|1gy|1h0|1h2|1h5|1h7|1h9|1hB|1hE|1hG|1hI|1hK|1hN|1hP|1hR|1hT|1hW|1hY|1ha|1hc|1hf|1hh|1hj|1hl|1ho|1hq|1hs|1hu|1hx|1hz|1i1|1i3|1i6|1i8|1iA|1iC|1iF|1iI|1iL|1iO|1iR|1iU|1iX|1ia|1id|1ig|1ij|1im|1ip|1ir|1iu|1ix|1j0|1j3|1j6|1j9|1jC|1jE|1jH|1jJ|1jM|1jP|1jS|1jV|1jY|1jb|1je|1jg|1jj|1jl|1jo|1jq|1jt|1jv|1jy|1k0|1k3|1k5|1k8|1kA|1kD|1kF|1kI|1kK|1kN|1kP|1kS|1kU|1kX|1kZ|1kc|1kf|1ki|1kl|1ko|1kr|1ku|1kw|1kz|1l1|1l4|1l6|1l9|1lB|1lE|1lG|1lJ|1lL|1lO|1lQ|1lT|1lV|1lY|1la|1ld|1lf|1li|1lk|1ln|1lp|1ls|1lv|1ly|1m1|1m4|1m7|1mA|1mD|1mF|1mI|1mL|1mO|1mR|1mU|1mX|1ma|1mc|1mf|1mi|1ml|1mo|1mr|1mu|1mw|1my|1n0|1n3|1n5|1n8|1nA|1nD|1nF|1nI|1nK|1nN|1nP|1nS|1nU|1nW|1nY|1nb|1nd|1ng|1ni|1nl|1nn|1nq|1ns|1nv|1nx|1o0|1o3|1o6|1o9|1oC|1oF|1oI|1oK|1oN|1oP|1oS|1oU|1oX|1oZ|1oc|1oe|1oh|1oj|1om|1oo|1or|1ot|1ow|1oy|1p1|1p3|1p6|1p8|1pB|1pD|1pG|1pJ|1pM|1pP|1pS|1pV|1pY|1pa|1pd|1pf|1pi|1pk|1pn|1pp|1ps|1pu|1px|1pz|1q2|1q4|1q7|1q9|1qC|1qE|1qH|1qJ|1qM|1qO|1qR|1qT|1qW|1qZ|1qc|1qf|1qi|1ql|1qo|1qq|1qt|1qv|1qy|1r0|1r3|1r5|1r8|1rA|1rD|1rF|1rI|1rK|1rN|1rP|1rS|1rU|1rX|1rZ|1rc|1re|1rh|1rj|1rm|1ro|1rr|1ru|1rx|1s0|1s3|1s6|1s8|1sA|1sC|1sF|1sH|1sK|1sM|1sP|1sR|1sU|1sW|1sZ|1sb|1se|1sg|1si|1sk|1sn|1sp|1ss|1su|1sx|1sz|1t2|1t4|1t7|1t9|1tC|1tE|1tH|1tK|1tN|1tQ|1tT|1tW|1tY|1ta|1tc|1tf|1th|1tk|1tm|1tp|1tr|1tu|1tw|1tz|1u1|1u4|1u6|1u8|1uA|1uD|1uF|1uI|1uK|1uN|1uP|1uS|1uU|1uX|1uZ|1uc|1uf|1ui|1ul|1uo|1ur|1uu|1uw|1uz|1v1|1v4|1v6|1v9|1vB|1vE|1vG|1vJ|1vL|1vO|1vQ|1vT|1vV|1vY|1va|1vd|1vf|1vi|1vk|1vn|1vp|1vs|1vv|1vy|1w1|1w4|1w7|1wA|1wC|1wF|1wH|1wK|1wM|1wP|1wR|1wU|1wW|1wZ|1wb|1we|1wg|1wj|1wl|1wo|1wq|1wt|1wv|1wy|1x0|1x3|1x5|1x8|1xB|1xE|1xH|1xK|1xN|1xQ|1xS|1xV|1xX|1xa|1xc|1xf|1xh|1xk|1xm|1xp|1xr|1xu|1xw|1xz|1y1|1y4|1y6|1y9|1yB|1yE|1yG|1yJ|1yL|1yO|1yR|1yT|1yW|1yY|1yb|1ye|1yh|1yk|1yn|1yq|1yt|1yv|1yy|1z0|1z3|1z5|1z8|1zA|1zD|1zF|1zI|1zK|1zN|1zP|1zS|1zU|1zX|1zZ|1zc|1ze|1zh|1zj|1zm|1zo|1zr|1zu|1zx|200|203|206|209|20B|20E|20G|20J|20L|20O|20Q|20T|20V|20Y|20a|20d|20f|20i|20k|20n|20p|20s|20u|20x|20z|212|214|217|21A|21D|21G|21J|21M|21P|21R|21U|21W|21Z|21b|21e|21g|21j|21l|21o|21q|21t|21v|21y|220|223|225|228|22A|22D|22F|22I|22K|22N|22Q|22T|22W|22Z|22c|22f|22h|22k|22m|22p|22r|22u|22w|22z|231|234|236|239|23B|23E|23G|23J|23L|23O|23Q|23T|23V|23Y|23a|23d|23g|23j|23m|23p|23s|23v|23y|241|244|247|24A|24D|24G|24J|24M|24P|24S|24V|24Y|24b|24e|24h|24k|24n|24q|24t|24w|24z|252|255|258|25B|25E|25H|25K|25N|25Q|25T|25W|25Z|25c|25f|25i|25l|25o|25r|25u|25x|260|263|266|269|26C|26F|26I|26L|26O|26R|26U|26X|26a|26d|26g|26j|26m|26p|26s|26v|26y|271|274|277|27A|27D|27G|27J|27M|27P|27S|27V|27Y|27b|27e|27h|27k|27n|27q|27t|27w|27z|282|285|288|28B|28E|28H|28K|28N|28Q|28T|28W|28Z|28c|28f|28i|28l|28o|28r|28u|28x|290|293|296|299|29C|29F|29I|29L|29O|29R|29U|29X|29Z|29c|29e|29h|29j|29m|29o|29r|29t|29w|29y|2A1|2A3|2A6|2A8|2AB|2AD|2AG|2AI|2AL|2AN|2AQ|2AS|2AV|2AX|2Aa|2Ac|2Af|2Ah|2Ak|2Am|2Ap|2Ar|2Au|2Aw|2Az|2B1|2B4|2B6|2B9|2BB|2BE|2BG|2BJ|2BL|2BO|2BQ|2BT|2BV|2BY|2Ba|2Bd|2Bf|2Bi|2Bk|2Bn|2Bp|2Bs|2Bu|2Bx|2Bz|2C2|2C4|2C7|2C9|2CC|2CE|2CH|2CJ|2CM|2CO|2CR|2CT|2CW|2CY|2Cb|2Cd|2Cg|2Ci|2Cl|2Cn|2Cq|2Cs|2Cv|2Cx|2D0|2D2|2D5|2D7|2DA|2DC|2DF|2DH|2DK|2DM|2DP|2DR|2DU|2DW|2DZ|2Db|2De|2Dg|2Dj|2Dl|2Do|2Dq|2Dt|2Dv|2Dy|2E0|2E3|2E5|2E8|2EA|2ED|2EF|2EI|2EK|2EN|2EP|2ES|2EU|2EX|2EZ|2Ec|2Ee|2Eh|2Ej|2Em|2Eo|2Er|2Et|2Ew|2Ey|2F1|2F3|2F6|2F8|2FB|2FD|2FG|2FI|2FL|2FN|2FQ|2FS|2FV|2FX|2Fa|2Fc|2Ff|2Fh|2Fk|2Fm|2Fp|2Fr|2Fu|2Fw|2Fz|2G1|2G4|2G6|2G9|2GB|2GE|2GG|2GJ|2GL|2GO|2GQ|2GT|2GV|2GY|2Ga|2Gd|2Gf|2Gi|2Gk|2Gn|2Gp|2Gs|2Gu|2Gx|2Gz|2H2|2H4|2H7|2H9|2HC|2HE|2HH|2HJ|2HM|2HO|2HR|2HU|2HX|2Ha|2Hd|2Hg|2Hj|2Hl|2Ho|2Hq|2Ht|2Hv|2Hy|2I0|2I3|2I5|2I8|2IA|2ID|2IF|2II|2IK|2IN|2IP|2IS|2IU|2IX|2IZ|2Ic|2Ie|2Ih|2Ij|2Im|2Io|2Ir|2It|2Iw|2Iy|2J1|2J3|2J6|2J8|2JB|2JD|2JG|2JI|2JL|2JN|2JQ|2JS|2JV|2JX|2Ja|2Jc|2Jf|2Jh|2Jk|2Jm|2Jp|2Jr|2Ju|2Jw|2Jz|2K1|2K4|2K6|2K9|2KB|2KE|2KG|2KJ|2KL|2KO|2KQ|2KT|2KV|2KY|2Ka|2Kd|2Kf|2Ki|2Kk|2Kn|2Kp|2Ks|2Ku|2Kx|2Kz|2L2|2L4|2L7|2L9|2LC|2LE|2LH|2LJ|2LM|2LO|2LR|2LT|2LW|2LY|2Lb|2Ld|2Lg|2Li|2Ll|2Ln|2Lq|2Ls|2Lv|2Lx|2M0|2M2|2M5|2M7|2MA|2MC|2MF|2MH|2MK|2MM|2MP|2MR|2MU|2MW|2MZ|2Mb|2Me|2Mg|2Mj|2Ml|2Mo|2Mq|2Mt|2Mv|2My|2N0|2N3|2N5|2N8|2NA|2ND|2NF|2NI|2NK|2NN|2NP|2NS|2NU|2NX|2NZ|2Nc|2Ne|2Nh|2Nj|2Nm|2No|2Nr|2Nt|2Nw|2Ny|2O1|2O3|2O6|2O8|2OB|2OD|2OG|2OI|2OL|2ON|2OQ|2OS|2OV|2OX|2Oa|2Oc|2Of|2Oh|2Ok|2Om|2Op|2Or|2Ou|2Ow|2Oz|2P1|2P4|2P6|2P9|2PB|2PE|2PG|2PJ|2PL|2PO|2PQ|2PT|2PV|2PY|2Pa|2Pd|2Pg|2Pj|2Pm|2Pp|2Ps|2Pv|2Py|2Q1|2Q4|2Q7|2QA|2QD|2QG|2QJ|2QM|2QP|2QS|2QV|2QY|2Qb|2Qe|2Qh|2Qk|2Qn|2Qq|2Qs|2Qv|2Qy|2R1|2R4|2R7|2RA|2RD|2RG|2RJ|2RN|2RQ|2RT|2RW|2RZ|2Rc|2Rf|2Ri|2Rl|2Rp|2Rs|2Rv|2Ry|2S1|2S4|2S7|2SA|2SD|2SG|2SJ|2SM|2SP|2SS|2SV|2SY|2Sb|2Se|2Sh|2Sk|2Sn|2Sq|2St|2Sw|2Sz|2T2|2T5|2T8|2TB|2TE|2TH|2TK|2TN|2TQ|2TT|2TW|2TZ|2Tc|2Tf|2Ti|2Tl|2To|2Tr|2Tu|2Tx|2U0|2U3|2U6|2U9|2UC|2UF|2UI|2UL|2UN|2UQ|2UT|2UW|2UZ|2Uc|2Ue|2Uh|2Uk|2Un|2Uq|2Ut|2Uw|2Uz|2V2|2V5|2V8|2VB|2VE|2VH|2VK|2VN|2VQ|2VT|2VV|2VY|2Vb|2Ve|2Vh|2Vk|2Vn|2Vq|2Vt|2Vw|2Vz|2W2|2W5|2W8|2WB|2WE|2WH|2WK|2WN|2WQ|2WT|2WW|2WZ|2Wc|2Wf|2Wi|2Wl|2Wo|2Wr|2Wu|2Wx|2X0|2X3|2X6|2X9|2XC|2XF|2XI|2XL|2XO|2XR|2XU|2XX|2Xa|2Xd|2Xf|2Xi|2Xk|2Xn|2Xq|2Xt|2Xw|2Xz|2Y2|2Y5|2Y8|2YB|2YE|2YG|2YJ|2YM|2YP|2YS|2YV|2YY|2Yb|2Ye|2Yh|2Yk|2Yn|2Yq|2Yt|2Yw|2Yz|2Z2|2Z4|2Z7|2ZA|2ZD|2ZG|2ZJ|2ZM|2ZP|2ZT|2ZW|2ZZ|2Zc|2Zf|2Zi|2Zl|2Zo|2Zr|2Zu|2Zx|2a0|2a3|2a6|2a9|2aC|2aF|2aI|2aL|2aO|2aR|2aU|2aX|2aa|2ad|2ag|2ai|2al|2ao|2ar|2au|2ax|2b0|2b3|2b6|2b9|2bC|2bF|2bI|2bL|2bO|2bR|2bU|2bX|2ba|2bd|2bg|2bj|2bm|2bp|2bs|2bv|2by|2c1|2c4|2c7|2cA|2cD|2cG|2cJ|2cM|2cP|2cS|2cV|2cY|2cb|2ce|2ch|2ck|2cn|2cq|2ct|2cw|2cz|2d2|2d5|2d8|2dB|2dE|2dH|2dK|2dN|2dQ|2dT|2dW|2dZ|2dc|2df|2di|2dl|2do|2dr|2du|2dx|2e0|2e3|2e6|2e9|2eC|2eF|2eI|2eL|2eO|2eR|2eU|2eX|2ea|2ed|2eg|2ej|2em|2ep|2es|2ev|2ey|2f1|2f4|2f7|2fA|2fD|2fG|2fJ|2fM|2fP|2fS|2fV|2fY|2fb|2fe|2fh|2fk|2fm|2fp|2fs|2fv|2fy|2g1|2g5|2g8|2gB|2gE|2gH|2gJ|2gM|2gP|2gS|2gU|2gX|2gZ|2gc|2gf|2gi|2gk|2gn|2gp|2gs|2gu|2gx|2gz|2h2|2h4|2h7|2h9|2hC|2hE|2hH|2hJ|2hM|2hP|2hS|2hV|2hY|2ha|2hd|2hf|2hi|2hl|2ho|2hr|2hu|2hx|2i0|2i3|2i6|2i9|2iC|2iF|2iI|2iL|2iO|2iR|2iU|2iX|2ia|2id|2ig|2ij|2im|2io|2ir|2iu|2ix|2j0|2j3|2j6|2j8|2jB|2jE|2jH|2jK|2jN|2jQ|2jS|2jV|2jY|2jb|2je|2jh|2jk|2jn|2jq|2jt|2jw|2jz|2k2|2k5|2k8|2kB|2kE|2kH|2kK|2kN|2kQ|2kT|2kW|2kZ|2kc|2kf|2ki|2kl|2ko|2kr|2ku|2kx|2l0|2l3|2l6|2l9|2lC|2lE|2lH|2lJ|2lM|2lP|2lS|2lV|2lY|2lb|2le|2lh|2lk|2ln|2lp|2ls|2lu|2lx|2lz|2m2|2m5|2m8|2mB|2mE|2mH|2mK|2mN|2mQ|2mT|2mW|2mZ|2mc|2me|2mh|2mj|2mm|2mo|2mr|2mu|2mw|2mz|2n1|2n4|2n7|2nA|2nD|2nG|2nJ|2nM|2nP|2nS|2nU|2nX|2na|2nd|2nf|2ni|2nl|2no|2nr|2nu|2nx|2nz|2o2|2o4|2o7|2o9|2oC|2oF|2oI|2oL|2oO|2oR|2oU|2oX|2oa|2od|2og|2oj|2om|2op|2os|2ov|2oy|2p1|2p4|2p7|2pA|2pD|2pG|2pJ|2pM|2pP|2pS|2pV|2pY|2pb|2pe|2ph|2pk|2pn|2pq|2pt|2pw|2py|2q1|2q3|2q6|2q9|2qC|2qF|2qI|2qL|2qO|2qR|2qT|2qW|2qZ|2qb|2qe|2qg|2qj|2ql|2qo|2qq|2qt|2qv|2qy|2r0|2r3|2r5|2r8|2rA|2rD|2rF|2rI|2rK|2rN|2rQ|2rT|2rW|2rY|2rb|2re|2rg|2rj|2rm|2ro|2rr|2rt|2rw|2rz|2s1|2s4|2s7|2sA|2sE|2sH|2sK|2sN|2sQ|2sT|2sW|2sZ|2sc|2sf|2si|2sl|2so|2sr|2su|2sx|2t0|2t3|2t6|2t8|2tB|2tD|2tG|2tJ|2tL|2tO|2tR|2tU|2tX|2ta|2td|2tg|2tj|2tm|2tp|2ts|2tv|2ty|2u1|2u4|2u7|2uA|2uD|2uG|2uJ|2uM|2uP|2uS|2uV|2uY|2ub|2ud|2ug|2uj|2um|2up|2us|2uv|2uy|2v1|2v4|2v7|2vA|2vD|2vG|2vJ|2vM|2vO|2vR|2vU|2vX|2va|2vd|2vg|2vj|2vm|2vo|2vr|2vt|2vw|2vy|2w1|2w3|2w6|2w8|2wB|2wE|2wH|2wK|2wN|2wP|2wS|2wV|2wY|2wb|2we|2wi|2wl|2wn|2wq|2wt|2ww|2wz|2x2|2x5|2x8|2xB|2xE|2xH|2xK|2xN|2xQ|2xT|2xW|2xZ|2xc|2xf|2xi|2xl|2xo|2xr|2xu|2xw|2xz|2y2|2y5|2y8|2yB|2yE|2yH|2yK|2yN|2yQ|2yT|2yW|2yZ|2yc|2yf|2yi|2yl|2yo|2yq|2yt|2yw|2yz|2z2|2z5|2z8|2zB|2zE|2zH|2zK|2zN|2zQ|2zT|2zW|2zZ|2zc|2zf|2zh|2zk|2zm|2zp|2zr|2zu|2zx|300|303|306|309|30C|30F|30I|30L|30O|30R|30U|30X|30a|30d|30g|30i|30l|30o|30r|30u|30x|310|313|316|318|31B|31D|31G|31I|31L|31N|31Q|31S|31V|31Y|31b|31e|31h|31k|31n|31p|31s|31u|31x|320|323|326|329|32C|32F|32I|32L|32N|32Q|32T|32W|32Z|32c|32f|32i|32l|32o|32r|32u|32x|330|333|336|339|33C|33F|33H|33K|33N|33Q|33S|33V|33Y|33b|33e|33h|33k|33n|33q|33t|33w|33z|341|344|347|34A|34D|34G|34J|34M|34P|34S|34V|34Y|34b|34d|34g|34i|34l|34n|34q|34s|34v|34x|350|352|355|357|35A|35D|35G|35J|35M|35O|35R|35U|35X|35Z|35c|35e|35h|35k|35n|35q|35t|35w|35z|362|365|367|36A|36D|36G|36I|36L|36N|36Q|36S|36V|36X|36a|36d|36g|36j|36m|36p|36r|36u|36x|370|372|375|377|37A|37C|37F|37H|37K|37M|37P|37S|37V|37Y|37a|37d|37g|37j|37m|37p|37r|37u|37w|37z|381|384|387|38A|38C|38F|38H|38K|38N|38Q|38T|38W|38Y|38b|38e|38h|38k|38n|38q|38t|38w|38z|392|395|398|39B|39E|39H|39K|39N|39Q|39S|39V|39X|39a|39d|39g|39j|39m|39p|39s|39v|39y|3A1|3A4|3A7|3AA|3AD|3AG|3AJ|3AM|3AP|3AS|3AV|3AY|3Aa|3Ad|3Ag|3Ai|3Al|3Ao|3Ar|3Au|3Ax|3B1|3B4|3B7|3BA|3BD|3BG|3BJ|3BM|3BP|3BS|3BV|3BY|3Bb|3Be|3Bg|3Bj|3Bm|3Bp|3Bs|3Bv|3By|3C1|3C4|3C7|3CA|3CD|3CF|3CI|3CK|3CN|3CP|3CS|3CU|3CX|3CZ|3Cc|3Ce|3Ch|3Cj|3Cm|3Co|3Cr|3Ct|3Cw|3Cy|3D1|3D3|3D6|3D8|3DB|3DD|3DG|3DI|3DL|3DN|3DQ|3DS|3DV|3DY|3Db|3De|3Dh|3Dk|3Dn|3Dq|3Dt|3Dv|3Dy|3E0|3E3|3E5|3E8|3EA|3ED|3EF|3EI|3EK|3EN|3EP|3ES|3EU|3EX|3EZ|3Ec|3Ef|3Ei|3El|3Eo|3Er|3Eu|3Ex|3F0|3F3|3F6|3F9|3FC|3FF|3FI|3FL|3FO|3FR|3FU|3FX|3FZ|3Fc|3Ff|3Fh|3Fk|3Fm|3Fp|3Fr|3Fu|3Fx|3Fz|3G2|3G5|3G8|3GB|3GE|3GG|3GJ|3GL|3GO|3GQ|3GT|3GV|3GY|3Gb|3Ge|3Gh|3Gk|3Gn|3Gq|3Gt|3Gv|3Gy|3H0|3H3|3H5|3H8|3HA|3HD|3HG|3HJ|3HM|3HP|3HR|3HU|3HW|3HZ|3Hb|3He|3Hh|3Hk|3Hn|3Hq|3Hs|3Hv|3Hy|3I1|3I3|3I6|3I8|3IB|3ID|3IG|3IJ|3IM|3IP|3IS|3IV|3IX|3Ia|3Ic|3If|3Ii|3Il|3Io|3Ir|3It|3Iw|3Iy|3J1|3J3|3J6|3J8|3JB|3JD|3JG|3JI|3JL|3JN|3JQ|3JS|3JV|3JX|3Ja|3Jc|3Jf|3Jh|3Jk|3Jm|3Jp|3Jr|3Ju|3Jw|3Jz|3K1|3K4|3K6|3K9|3KB|3KE|3KG|3KJ|3KL|3KO|3KR|3KU|3KX|3Ka|3Kd|3Kg|3Ki|3Kl|3Ko|3Kq|3Kt|3Kw|3Kz|3L2|3L4|3L7|3LA|3LC|3LF|3LI|3LL|3LN|3LQ|3LT|3LV|3LY|3Lb|3Le|3Lh|3Lk|3Lm|3Lp|3Lr|3Lu|3Lx|3M0|3M3|3M6|3M9|3MC|3MF|3MI|3ML|3MO|3MQ|3MT|3MV|3MY|3Mb|3Me|3Mh|3Mk|3Mn|3Mq|3Mt|3Mw|3Mz|3N2|3N5|3N8|3NB|3NE|3NH|3NK|3NN|3NQ|3NT|3NW|3NY|3Nb|3Nd|3Ng|3Nj|3Nm|3No|3Nr|3Nt|3Nw|3Nz|3O2|3O5|3O8|3OB|3OE|3OH|3OK|3ON|3OR|3OU|3OX|3Oa|3Od|3Of|3Oi|3Ok|3On|3Op|3Or|3Ot|3Ow|3Oy|3P1|3P4|3P7|3PA|3PD|3PG|3PJ|3PM|3PP|3PS|3PV|3PY|3Pb|3Pe|3Ph|3Pk|3Pn|3Pq|3Pt|3Pw|3Pz|3Q2|3Q5|3Q8|3QB|3QE|3QH|3QK|3QN|3QQ|3QT|3QW|3QZ|3Qc|3Qf|3Qi|3Ql|3Qo|3Qr|3Qu|3Qx|3R0|3R3|3R6|3R9|3RC|3RF|3RI|3RL|3RO|3RR|3RU|3RX|3Ra|3Rd|3Rg|3Rj|3Rm|3Rp|3Rs|3Rv|3Ry|3S1|3S4|3S7|3SA|3SD|3SG|3SJ|3SM|3SP|3SS|3SV|3SY|3Sb|3Se|3Sh|3Sk|3Sn|3Sq|3St|3Sw|3Sz|3T2|3T5|3T8|3TB|3TE|3TH|3TK|3TN|3TQ|3TT|3TW|3TZ|3Tc|3Tf|3Ti|3Tl|3To|3Tr|3Tu|3Tx|3U0|3U3|3U6|3U9|3UC|3UF|3UI|3UL|3UO|3UR|3UU|3UX|3Ua|3Ud|3Ug|3Uj|3Um|3Up|3Us|3Uv|3Uy|3V1|3V4|3V7|3VA|3VD|3VG|3VJ|3VM|3VP|3VS|3VV|3VY|3Vb|3Ve|3Vh|3Vk|3Vn|3Vq|3Vt|3Vw|3Vz|3W2|3W5|3W8|3WB|3WE|3WH|3WK|3WN|3WQ|3WT|3WW|3WZ|3Wc|3Wf|3Wi|3Wl|3Wo|3Wr|3Wu|3Wx|3X0|3X3|3X6|3X9|3XC|3XF|3XI|3XL|3XO|3XR|3XU|3XX|3Xa|3Xd|3Xg|3Xj|3Xm|3Xp|3Xs|3Xv|3Xy|3Y1|3Y4|3Y7|3YA|3YD|3YG|3YJ|3YM|3YP|3YS|3YV|3YY|3Yb|3Ye|3Yh|3Yk|3Yn|3Yq|3Yt|3Yw|3Yz|3Z2|3Z5|3Z8|3ZB|3ZE|3ZH|3ZK|3ZN|3ZQ|3ZT|3ZW|3ZZ|3Zc|3Zf|3Zi|3Zl|3Zo|3Zr|3Zu|3Zx|3a0|3a3|3a6|3a9|3aC|3aF|3aI|3aL|3aO|3aR|3aU|3aX|3aa|3ad|3ag|3aj|3am|3ap|3as|3av|3ay|3b1|3b4|3b7|3bA|3bD|3bG|3bJ|3bM|3bP|3bS|3bV|3bY|3bb"],"3bc"]');
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
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/manage-walkthrough/default-status.ts


const changeToDefaultStatus = async () => {
  if (!globals/* manageWalkthrough */.Ax.manageWalkthroughDefaultStatus) {
    return;
  }
  if (globals/* StaffRegex */.nW.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId()) {
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
  if (globals/* StaffRegex */.nW.Walkthroughs.Test.manageWalkthroughUrlWithWalkthroughId()) {
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

// EXTERNAL MODULE: ./src/globals/regex.ts
var regex = __webpack_require__("./src/globals/regex.ts");
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

;// CONCATENATED MODULE: ./src/resources/svgs/sun.hbs
// Module
var sun_code = "<svg viewbox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M505.2 324.8l-47.73-68.78l47.75-68.81c7.359-10.62 8.797-24.12 3.844-36.06c-4.969-11.94-15.52-20.44-28.22-22.72l-82.39-14.88l-14.89-82.41c-2.281-12.72-10.76-23.25-22.69-28.22c-11.97-4.936-25.42-3.498-36.12 3.844L256 54.49L187.2 6.709C176.5-.6016 163.1-2.039 151.1 2.896c-11.92 4.971-20.4 15.5-22.7 28.19l-14.89 82.44L31.15 128.4C18.42 130.7 7.854 139.2 2.9 151.2C-2.051 163.1-.5996 176.6 6.775 187.2l47.73 68.78l-47.75 68.81c-7.359 10.62-8.795 24.12-3.844 36.06c4.969 11.94 15.52 20.44 28.22 22.72l82.39 14.88l14.89 82.41c2.297 12.72 10.78 23.25 22.7 28.22c11.95 4.906 25.44 3.531 36.09-3.844L256 457.5l68.83 47.78C331.3 509.7 338.8 512 346.3 512c4.906 0 9.859-.9687 14.56-2.906c11.92-4.969 20.4-15.5 22.7-28.19l14.89-82.44l82.37-14.88c12.73-2.281 23.3-10.78 28.25-22.75C514.1 348.9 512.6 335.4 505.2 324.8zM456.8 339.2l-99.61 18l-18 99.63L256 399.1L172.8 456.8l-18-99.63l-99.61-18L112.9 255.1L55.23 172.8l99.61-18l18-99.63L256 112.9l83.15-57.75l18.02 99.66l99.61 18L399.1 255.1L456.8 339.2zM256 143.1c-61.85 0-111.1 50.14-111.1 111.1c0 61.85 50.15 111.1 111.1 111.1s111.1-50.14 111.1-111.1C367.1 194.1 317.8 143.1 256 143.1zM256 319.1c-35.28 0-63.99-28.71-63.99-63.99S220.7 192 256 192s63.99 28.71 63.99 63.1S291.3 319.1 256 319.1z\" fill=\"currentColor\"/></svg>";
// Exports
/* harmony default export */ const sun = (sun_code);
;// CONCATENATED MODULE: ./src/resources/svgs/moon.hbs
// Module
var moon_code = "<svg viewbox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M421.6 379.9c-.6641 0-1.35 .0625-2.049 .1953c-11.24 2.143-22.37 3.17-33.32 3.17c-94.81 0-174.1-77.14-174.1-175.5c0-63.19 33.79-121.3 88.73-152.6c8.467-4.812 6.339-17.66-3.279-19.44c-11.2-2.078-29.53-3.746-40.9-3.746C132.3 31.1 32 132.2 32 256c0 123.6 100.1 224 223.8 224c69.04 0 132.1-31.45 173.8-82.93C435.3 389.1 429.1 379.9 421.6 379.9zM255.8 432C158.9 432 80 353 80 256c0-76.32 48.77-141.4 116.7-165.8C175.2 125 163.2 165.6 163.2 207.8c0 99.44 65.13 183.9 154.9 212.8C298.5 428.1 277.4 432 255.8 432z\" fill=\"currentColor\"></path></svg>";
// Exports
/* harmony default export */ const moon = (moon_code);
;// CONCATENATED MODULE: ./src/scss/features/staff-walkthrough-improvements/tinymce/charcoal/skin.scss
const styles = `body.trueachievement-extras.ta-x-staff-walkthrough-improvements .mce-edit-area{border:0 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .mce-colorbutton button:not(.mce-open){padding-right:3px !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .mce-colorbutton .mce-open{border:0;padding:4px 7px 4px 2px !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .mce-colorbutton .mce-preview{position:unset;padding:0;margin:0;margin-top:-2px;width:100%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel{border:0 solid #232b33;background-color:#404952}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-arrow::after{border-bottom-color:#404952}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-toolbar-grp{padding:2px 0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-window-head,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-foot{border-color:#9e9e9e}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-title,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-label{color:#b5b9bf;text-shadow:0 1px 1px rgba(0,0,0,.75)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-path-item{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel i.mce-i-resize{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel i.mce-ico{text-shadow:1px 1px #000;color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel i.mce-caret{border-top:4px solid #b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-colorbutton,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn{border:1px solid #364049 !important;border-color:#202a33 !important;text-shadow:0 1px 1px rgba(0,0,0,.75);background-color:#4c5761 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-colorbutton:focus,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-colorbutton.mce-active,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-colorbutton:hover,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn:focus,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-active,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn:hover,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn:focus,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-active,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn:hover{background-image:none !important;background-color:#004364 !important;border-color:#24292e !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-colorbutton.mce-disabled,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-disabled,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-disabled{cursor:default}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-colorbutton.mce-primary,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-primary,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-primary{background-color:#004364 !important;color:#fff;text-shadow:1px 1px #333}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-colorbutton.mce-primary:hover,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn.mce-primary:hover,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn.mce-primary:hover{background-color:#00547d !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-colorbutton button,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn button,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn button{padding:4px 10px;font-size:14px;cursor:pointer;color:#b5b9bf;text-align:center}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-colorbutton button span,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-menubtn button span,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn button span{color:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-panel .mce-btn-group .mce-btn{border-width:1px;margin:0;margin-left:2px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu{background:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-sep{background:#25313f;border-color:#424f5f}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal .mce-text{color:#ddd !important;background:rgba(0,0,0,0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal:focus,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal.mce-selected,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal.mce-active{background-color:#006597;color:#fff !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal:hover{text-decoration:none;color:#fff;background-color:#0085c7}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-menu-item-normal .mce-caret{border-left:4px solid #b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-grid-cell div{border-color:#202a33;background-color:#4c5761}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-grid-border a{border-color:#202a33;background-color:#4c5761}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-grid-border a.mce-active{background-color:#006597}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-text-center{color:#ddd}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-edit-area{border-left:1px solid #000 !important;border:0 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-tabs{background:#303942;border-bottom:1px solid #202a33}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-tabs .mce-tab{color:#b5b9bf;border-color:#202a33;background:#303942;text-shadow:0 1px 1px rgba(0,0,0,.75)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-tabs .mce-tab.mce-active{background:#404952}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-i-checkbox,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .mce-textbox,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] input{background-color:#4c5761;color:#bbb;border-color:#202a33;background-image:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer{border:0 solid #232b33;background-color:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer .imageviewer{background-color:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer .noimages,body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] #oWalkthroughImageViewer .itemname{color:#b5b9bf}`;
    /* harmony default export */ const skin = (styles);
  
;// CONCATENATED MODULE: ./src/scss/features/staff-walkthrough-improvements/tinymce/charcoal/content.scss
const content_styles = `body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-tinymce-theme=dark]{background-color:#444;color:#bbb;border-color:#555}`;
    /* harmony default export */ const content = (content_styles);
  
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/toggle-theme-button.ts







class ToggleThemeScript extends TinyMCEScript {
  constructor() {
    super("ta-x-staff-walkthrough-improvements-add-toggle-theme-command");
    this.getTinymceTheme = async () => {
      this.globalTheme = this.globalTheme ? this.globalTheme : await (0,utilities/* waitForElement */.br)(".page, [data-theme]");
      if (globals/* editWalkthrough */.kB.tinymceTheme !== null) {
        return globals/* editWalkthrough */.kB.tinymceTheme;
      } else {
        return this.globalTheme ? this.globalTheme.getAttribute("data-theme") : "";
      }
    };
    this.listen = async () => {
      const iframe = await (0,utilities/* waitForElement */.br)("#txtWalkthrough_ifr");
      const iframeLoadHandler = async () => {
        const iframeDocument = iframe && iframe.contentDocument;
        const bodyEl = await (0,utilities/* waitForElement */.br)("#tinymce", iframeDocument);
        bodyEl.classList.add(globals/* Constants */.gT.Styles.root, globals/* Constants */.gT.Styles.StaffWalkthroughImprovements.featureStyle);
        bodyEl.setAttribute("data-ta-x-tinymce-theme", await this.getTinymceTheme());
        const style = iframeDocument.createElement("style");
        style.id = "ta-x-staff-walkthrough-improvements-dark-tinymce-style";
        style.innerHTML = content;
        iframeDocument.head.appendChild(style);
        const script = iframeDocument.createElement("script");
        script.id = "ta-x-staff-walkthrough-improvements-dark-tinymce-script";
        script.innerHTML = `window.addEventListener('message', function(event) {
        console.debug(event);
        if (!event || !event.data || event.data.theme === null || event.data.theme === undefined) return;
        document.body.setAttribute('data-ta-x-tinymce-theme', event.data.theme);
      });`;
        iframeDocument.head.appendChild(script);
        iframe.removeEventListener("load", iframeLoadHandler);
      };
      iframe.addEventListener("load", iframeLoadHandler);
    };
    this.observe = async () => {
      const iframe = await (0,utilities/* waitForElement */.br)("#txtWalkthrough_ifr");
      this.themeToggle = document.querySelector('[aria-label="Toggle Theme"] [data-ta-x-tinymce-theme]');
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
            this.themeToggle.setAttribute("data-ta-x-tinymce-theme", theme === "dark" ? theme : "");
            document.body.setAttribute("data-ta-x-theme", theme === "dark" ? theme : "");
          } else if (mutation.attributeName === "data-ta-x-tinymce-theme") {
            theme = mutation.target.getAttribute("data-ta-x-tinymce-theme");
          } else {
            return;
          }
          if (theme !== null && theme !== void 0) {
            globals/* editWalkthrough */.kB.tinymceTheme = theme;
            iframe.contentWindow.postMessage({ theme }, "*");
          }
        });
      });
      observer.observe(this.themeToggle, {
        attributes: true
      });
      observer.observe(this.globalTheme, {
        attributes: true
      });
    };
    this.buildScript = async () => {
      const theme = await this.getTinymceTheme();
      document.body.setAttribute("data-ta-x-theme", theme);
      const script = `
      ((editor, theme) => {
        console.debug('Adding Toggle Theme Button');

        editor.addButton('toggleTheme', {
          tooltip: 'Toggle Theme',
          onclick: function (e) {
            var target = e.target;
            var currentTheme = target.getAttribute('data-ta-x-tinymce-theme');
            var newTheme = currentTheme === 'dark' ? '' : 'dark';

            target.setAttribute('data-ta-x-tinymce-theme', newTheme);
          }
        });

        var toggleThemeButton = editor.buttons['toggleTheme'];
        var taxGroup = editor.theme.panel.find('toolbar > buttongroup').filter(function(bg) {
          return bg.settings.name === 'ta-x-group';
        })[0];

        taxGroup._lastRepaintRect = taxGroup._layoutRect;
        taxGroup.append(toggleThemeButton);

        function createElementFromHTML(htmlString) {
          var div = document.createElement('div');
          div.innerHTML = htmlString.trim();

          // Change this to div.childNodes to support multiple top-level nodes.
          return div.firstChild;
        };

        var button = document.querySelector('[aria-label="Toggle Theme"] button');
        button.setAttribute('data-ta-x-tinymce-theme', theme);
        button.classList.add('js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle', 'ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle');
        
        var sun = createElementFromHTML('${sun}');
        sun.classList.add('ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light');
        button.innerHTML = sun.outerHTML

        var moon = createElementFromHTML('${moon}');
        moon.classList.add('ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark');
        button.innerHTML += moon.outerHTML

        console.debug('Added Toggle Theme Button');
      })(tinymce.activeEditor, '${theme}');
    `;
      return this.createScript(script);
    };
    this.injectScript = async () => {
      GM_addStyle(skin);
      await this.listen();
      await (0,utilities/* waitForElement */.br)(".mce-ta-x-tinymce-group");
      document.body.appendChild(await this.buildScript());
      await this.observe();
    };
  }
}
const addToggleThemeButton = new ToggleThemeScript().injectScript;

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

;// CONCATENATED MODULE: ./src/resources/svgs/code.hbs
// Module
var code_code = "<svg viewbox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z\" fill=\"currentColor\"></path></svg>";
// Exports
/* harmony default export */ const svgs_code = (code_code);
;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/source-code-button.ts


class SourceCodeScript extends TinyMCEScript {
  constructor() {
    super("ta-x-staff-walkthrough-improvements-add-code-editor-command");
    this.buildScript = () => {
      const script = `
    ((editor) => {
      console.debug('Adding Source Code Button');

      editor.addButton('sourceCode', {
        tooltip: 'Source Code',
        onclick: function () {
          var dialog = editor.windowManager.open({
            title: 'Source code',
            body: {
              type: 'textbox',
              name: 'code',
              multiline: true,
              minWidth: editor.getParam('code_dialog_width', 600),
              minHeight: editor.getParam('code_dialog_height', Math.min(tinymce.DOM.getViewPort().h - 200, 500)),
              spellcheck: false,
              style: 'direction: ltr; text-align: left'
            },
            onSubmit: function (dialog) {
              editor.focus();
              editor.undoManager.transact(function () {
                editor.setContent(dialog.data.code);
              });
              editor.selection.setCursorLocation();
              editor.nodeChanged();
            }
          });

          dialog.find('#code').value(editor.getContent({ source_view: true }));
        }
      });

      var sourceCodeButton = editor.buttons['sourceCode'];
      var taxGroup = editor.theme.panel.find('toolbar > buttongroup').filter(function(bg) {
        return bg.settings.name === 'ta-x-group';
      })[0];

      taxGroup._lastRepaintRect = taxGroup._layoutRect;
      taxGroup.append(sourceCodeButton);

      const button = document.querySelector('[aria-label="Source Code"] button');
      button.classList.add('ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code-button');
      button.innerHTML = '${svgs_code}';

      console.debug('Added Source Code Button');
    })(tinymce.activeEditor);
  `;
      return this.createScript(script);
    };
  }
}
const addSourceCodeButton = new SourceCodeScript().injectScript;

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/text-color-buttons.ts

class TextColorScript extends TinyMCEScript {
  constructor() {
    super("ta-x-staff-walkthrough-improvements-add-text-color-command");
    this.buildScript = () => {
      const script = `
    ((editor) => {
      console.debug('Adding Text Color Button');

      var applyColor = function(editor, type, value) {
        editor.undoManager.transact(function() {
          editor.focus();
          editor.formatter.apply(type, { value: value });
          editor.nodeChanged();
        });
      };

      var removeColor = function(editor, type) {
        editor.undoManager.transact(function() {
          editor.focus();
          editor.formatter.remove(type, { value: null }, null, true);
          editor.nodeChanged();
        });
      };

      var createColorButtonClickHandler = function(editor, isForeColor) {
        return function(event) {
          var control = event.control;

          if (control._color) {
            editor.execCommand("mceApplyTextcolor", control.settings.format, control._color);
          } else {
            editor.execCommand("mceRemoveTextcolor", control.settings.format);
          }
        };
      };

      var createColorCellClickHandler = function(editor, isForeColor, rowCount) {
        return function(event) {
          var target = event.target;
          var color = target.getAttribute("data-mce-color");
          var lastId = parent.lastId;

          if (lastId) {
            tinymce.DOM.get(lastId).setAttribute("aria-selected", "false");
          }

          target.setAttribute("aria-selected", true);
          parent.lastId = target.id;

          if (color !== null) {
            if (color === "transparent") {
              editor.execCommand("mceRemoveTextcolor", isForeColor ? "forecolor" : "hilitecolor");
            } else {
              applyColor(editor, isForeColor ? "forecolor" : "hilitecolor", color);
            }
          } else {
            editor.hidePanel();
          }
        };
      };

      var generateColorTable = function(colorList, rows, cols) {
        var cellIndex = 0;
        var ariaId = tinymce.DOM.uniqueId("mcearia");

        var generateColorCell = function(color, text) {
          var isTransparent = color === "transparent";
          return '<td class="mce-grid-cell' + (isTransparent ? " mce-colorbtn-trans" : "") + '"><div id="' + ariaId + "-" + cellIndex++ + '" data-mce-color="' + (color || "") + '" role="option" tabIndex="-1" style="' + (color ? "background-color: " + color : "") + '" title="' + text + '">' + (isTransparent ? "&#215;" : "") + "</div></td>";
        };

        var html = '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody>';
        
        colorList.push({
          text: "No color",
          color: "transparent"
        });

        for (var i = 0; i < rows; i++) {
          html += "<tr>";
          
          for (var j = 0; j < cols; j++) {
            html += cellIndex < colorList.length ? generateColorCell(colorList[cellIndex].color, colorList[cellIndex].text) : "<td></td>";
          }
         
          html += "</tr>";
        }

        return html += "</tbody></table>";
      };

      var generateColorGrid = function(editor, isForeColor) {
        var rows = 5;
        var cols = 8;
        var colorList = [
          { text: 'Black', color: '#000000' },
          { text: 'Burnt orange', color: '#993300' },
          { text: 'Dark olive', color: '#333300' },
          { text: 'Dark green', color: '#003300' },
          { text: 'Dark azure', color: '#003366' },
          { text: 'Navy Blue', color: '#000080' },
          { text: 'Indigo', color: '#333399' },
          { text: 'Very dark gray', color: '#333333' },
          { text: 'Maroon', color: '#800000' },
          { text: 'Orange', color: '#FF6600' },
          { text: 'Olive', color: '#808000' },
          { text: 'Green', color: '#008000' },
          { text: 'Teal', color: '#008080' },
          { text: 'Blue', color: '#0000FF' },
          { text: 'Grayish blue', color: '#666699' },
          { text: 'Gray', color: '#808080' },
          { text: 'Red', color: '#FF0000' },
          { text: 'Amber', color: '#FF9900' },
          { text: 'Yellow green', color: '#99CC00' },
          { text: 'Sea green', color: '#339966' },
          { text: 'Turquoise', color: '#33CCCC' },
          { text: 'Royal blue', color: '#3366FF' },
          { text: 'Purple', color: '#800080' },
          { text: 'Medium gray', color: '#999999' },
          { text: 'Magenta', color: '#FF00FF' },
          { text: 'Gold', color: '#FFCC00' },
          { text: 'Yellow', color: '#FFFF00' },
          { text: 'Lime', color: '#00FF00' },
          { text: 'Aqua', color: '#00FFFF' },
          { text: 'Sky blue', color: '#00CCFF' },
          { text: 'Red violet', color: '#993366' },
          { text: 'White', color: '#FFFFFF' },
          { text: 'Pink', color: '#FF99CC' },
          { text: 'Peach', color: '#FFCC99' },
          { text: 'Light yellow', color: '#FFFF99' },
          { text: 'Pale green', color: '#CCFFCC' },
          { text: 'Pale cyan', color: '#CCFFFF' },
          { text: 'Light sky blue', color: '#99CCFF' },
          { text: 'Plum', color: '#CC99FF' }
        ];
          
        return generateColorTable(colorList, rows, cols);
      };

      editor.addCommand("mceApplyTextcolor", function(cmd, value) {
          applyColor(editor, cmd, value);
      });

      editor.addCommand("mceRemoveTextcolor", function(cmd) {
        removeColor(editor, cmd);
      });

      editor.addButton('forecolor', {
        type: "colorbutton",
        tooltip: 'Text color',
        format: 'forecolor',
        panel: {
          role: "application",
          ariaRemember: true,
          html: generateColorGrid(editor, true),
          onclick: createColorCellClickHandler(editor, true, 8)
        },
        onclick: createColorButtonClickHandler(editor, true)
      });

      editor.addButton('backcolor', {
        type: "colorbutton",
        tooltip: 'Background color',
        format: 'hilitecolor',
        panel: {
          role: "application",
          ariaRemember: true,
          html: generateColorGrid(editor, false),
          onclick: createColorCellClickHandler(editor, false, 8)
        },
        onclick: createColorButtonClickHandler(editor, false)
      });

      var forecolorButton = editor.buttons['forecolor'];
      var backcolorButton = editor.buttons['backcolor'];
      var taxGroup = editor.theme.panel.find('toolbar > buttongroup').filter(function(bg) {
        return bg.settings.name === 'ta-x-group';
      })[0];

      taxGroup._lastRepaintRect = taxGroup._layoutRect;
      taxGroup.append(forecolorButton);
      taxGroup.append(backcolorButton);

      console.debug('Added Text Color Button');
    })(tinymce.activeEditor);
  `;
      return this.createScript(script);
    };
  }
}
const addTextColorButtons = new TextColorScript().injectScript;

// EXTERNAL MODULE: ./node_modules/.pnpm/github.com+dynamiteandy+jscolor@e18f85ac8f951e52fcbd2c7ca0ba7fde8447bae5/node_modules/@eastdesire/jscolor/jscolor.js
var jscolor = __webpack_require__("./node_modules/.pnpm/github.com+dynamiteandy+jscolor@e18f85ac8f951e52fcbd2c7ca0ba7fde8447bae5/node_modules/@eastdesire/jscolor/jscolor.js");
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
      [...tablePropertyModal.querySelectorAll(".mce-colorbox input:not([data-current-color])")].forEach((el) => {
        el.parentElement.style.left = "201px";
        const container = el.closest(".mce-container-body");
        const colorPickerOpts = {
          zIndex: 65536,
          format: "auto"
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
      });
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

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/insert-xbox-images.ts


class InsertXboxImageScript extends TinyMCEScript {
  constructor() {
    super("ta-x-staff-walkthrough-improvements-insert-xbox-image-command");
    this.buildScript = () => {
      const script = `
    ((editor) => {
      console.debug('Adding Insert Xbox Image Button');

      var addImageElement = document.querySelector('a[title="Add images"]');
      var gameId = parseInt(new URLSearchParams(addImageElement.href).get('relatedid'));

      editor.addButton('btnAddGamerMedia', {
        title: 'Insert Xbox captures',
        image: '/images/icons/game-screenshots.png',
        onclick: function (event) {
          ShowGamerScreenshots(gameId, 'txtWalkthrough', 'False', true, event);
          return false;
        }
      });

      var btnAddGamerMedia = editor.buttons['btnAddGamerMedia'];
      var group = editor.theme.panel.find('toolbar > buttongroup').filter(function(bg) {
        return bg._items.filter(item => item._title === "Add Achievement").length === 1
      })[0];

      group._lastRepaintRect = group._layoutRect;
      group.append(btnAddGamerMedia);

      console.debug('Added Insert Xbox Image Button');
    })(tinymce.activeEditor);
  `;
      return this.createScript(script);
    };
    this.injectScript = async () => {
      if (await (0,utilities/* waitForElement */.br)('.mce-btn[aria-label="Insert Xbox captures"]', void 0, 250)) {
        return;
      }
      document.body.appendChild(this.buildScript());
    };
  }
}
const addInsertXboxImageButton = new InsertXboxImageScript().injectScript;

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/add-controller-buttons.ts


class AddControllerButtonsScript extends TinyMCEScript {
  constructor() {
    super("ta-x-staff-walkthrough-improvements-add-controller-buttons-command");
    this.buildScript = () => {
      const script = `
    ((editor) => {
      console.debug('Adding Add Controller Buttons Button');

      editor.addButton('btnControllerIcons', {
        type: 'menubutton',
        title: 'Controller Buttons',
        image: '/images/icons/game.png',
        menu: [{
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_A.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_A]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_B.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_B]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_X.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_X]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_Y.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_Y]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LB.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LB]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RB.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RB]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LT.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LT]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RT.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RT]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_up.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_up]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_down.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_down]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_left.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_left]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_right.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_right]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_upleft.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_upleft]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_upright.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_upright]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_downleft.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_downleft]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_downright.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_downright]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSu.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSu]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSd.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSd]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSl.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSl]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSr.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSr]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSul.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSul]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSur.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSur]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSdl.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSdl]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSdr.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSdr]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSu.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSu]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSd.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSd]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSl.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSl]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSr.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSr]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSul.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSul]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSur.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSur]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSdl.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSdl]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSdr.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSdr]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_dpad.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_dpad]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LSc.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LSc]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RSc.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RSc]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_LS.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_LS]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_RS.png',
          classes: 'tiny_button firsticon controller-icon',
          onclick: function() {
            editor.insertContent('[cn_RS]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_back.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_back]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_start.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_start]');
          }
        }, {
          image: '//static.trueachievements.com/images/controllerbuttons/Xbox One/cn_guide.png',
          classes: 'tiny_button controller-icon',
          onclick: function() {
            editor.insertContent('[cn_guide]');
          }
        }]
      });

      var btnControllerIcons = editor.buttons['btnControllerIcons'];
      var group = editor.theme.panel.find('toolbar > buttongroup').filter(function(bg) {
        return bg._items.filter(item => item._title === "Table").length === 1
      })[0];

      group._lastRepaintRect = group._layoutRect;
      group.append(btnControllerIcons);

      console.debug('Added Add Controller Buttons Button');
    })(tinymce.activeEditor);
  `;
      return this.createScript(script);
    };
    this.injectScript = async () => {
      if (await (0,utilities/* waitForElement */.br)('.mce-btn[aria-label="Controller Buttons"]', void 0, 250)) {
        return;
      }
      document.body.appendChild(this.buildScript());
    };
  }
}
const addControllerButtonsButton = new AddControllerButtonsScript().injectScript;

;// CONCATENATED MODULE: ./src/features/staff-walkthrough-improvements/edit-walkthrough/tinymce/index.ts









const createButtonGroup = async () => {
  const iframe = await (0,utilities/* waitForElement */.br)("#txtWalkthrough_ifr");
  const iframeLoadHandler = () => {
    const script = document.createElement("script");
    script.id = "ta-x-staff-walkthrough-improvements-tinymce-button-grup";
    script.innerHTML = `
    ((editor) => {
      console.debug('Creating TA-X TinyMCE Group');

      var taxGroup = tinymce.ui.Factory.create({
        type: 'buttongroup',
        name: 'ta-x-group',
        items: []
      });

      taxGroup.addClass('ta-x-tinymce-group');

      editor.theme.panel.find('toolbar')[1].append(taxGroup);
      
      taxGroup._lastRepaintRect = taxGroup._layoutRect;
      taxGroup.renderTo();

      console.debug('Created TA-X TinyMCE Group');
    })(tinymce.activeEditor);
  `;
    document.body.appendChild(script);
    iframe.removeEventListener("load", iframeLoadHandler);
  };
  iframe.addEventListener("load", iframeLoadHandler);
};
const tinymce = async () => {
  if (!await (0,utilities/* waitForElement */.br)('[href*="skin.min.css"]', document.head)) {
    return;
  }
  const container = await (0,utilities/* waitForElement */.br)(".mce-tinymce");
  if (!container) {
    return;
  }
  (0,utilities/* allConcurrently */.Eh)("Edit Walkthrough", [
    { name: "tinymce-set-full-width-toolbar", task: async () => await setFullWidthToolbar(container) },
    { name: "tinymce-add-fix-floating-menus", task: async () => await fixFloatingMenus(container) },
    { name: "tinymce-append-color-picker", task: appendColorPicker }
  ]);
  (0,utilities/* allConcurrently */.Eh)("Edit Walkthrough - TinyMCE Buttons", [
    { name: "tinymce-add-source-code-button", task: createButtonGroup },
    { name: "tinymce-add-toggle-theme-button", task: addTextColorButtons },
    { name: "tinymce-add-source-code-button", task: addSourceCodeButton },
    { name: "tinymce-add-toggle-theme-button", task: addToggleThemeButton },
    { name: "tinymce-add-insert-xbox-image-button", task: addInsertXboxImageButton },
    { name: "tinymce-add-controller-buttons-button", task: addControllerButtonsButton }
  ]);
};
/* harmony default export */ const edit_walkthrough_tinymce = ({ tinymce });

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
      { name: "edit-walkthrough-tinymce", task: tinymce }
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



/* harmony default export */ const walkthroughs = (async () => {
  if (!globals/* ForumRegex */.wC.Test.viewBoardUrlWithBoardId() && !globals/* ForumRegex */.wC.Test.viewThreadUrlWithThreadId()) {
    return;
  }
  if (globals/* ForumRegex */.wC.Test.viewBoardUrlWithBoardId()) {
    const messageBoardId = "1431";
    const params = new URLSearchParams(window.location.search);
    if (params.get("messageboardid") !== messageBoardId) {
      return;
    }
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
  const baseAchievementHeader = el.querySelector(".pnl-hd.no-pills.no-pr.game:not(.gamer):not(.dlc)");
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
          `${(0,utilities/* insertSeperator */.g$)(wonTrueAchievementScore, ",")}/${grouping.maxTAScore}`
        );
        maxGamerscore.innerHTML = maxGamerscore.innerHTML.replace(
          grouping.maxGamerScore,
          `${(0,utilities/* insertSeperator */.g$)(wonGamerscore, ",")}/${grouping.maxGamerScore}`
        );
        maxAchievements.innerHTML = maxAchievements.innerHTML.replace(
          grouping.maxAchievements,
          `${(0,utilities/* insertSeperator */.g$)(wonAchievements.length, ",")}/${grouping.maxAchievements}`
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
  await getAchievementWalkthroughUrl();
};
const add_xbox_achievement_guides_listen = () => {
  const button = add_xbox_achievement_guides_extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.Components.AskLoader.buttonJs}`);
  const input = add_xbox_achievement_guides_extensionBody.querySelector(`.${globals/* Constants */.gT.Styles.Components.AskLoader.inputJs}`);
  button.addEventListener("click", async (e) => {
    if (!e.target?.nodeName) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!input.value) {
        return;
      }
      if (!globals/* ExternalRegex */.Ye.Test.xboxAchievementsGuide(input.value)) {
        return;
      }
      toggleAskForLink();
      if (globals/* AchievementsRegex */.KH.Test.achievementUrl()) {
        await getAchievementGuide(input.value);
      } else {
        hideBody();
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
  const url = cachedXboxAchievementGuideUrls.get(gameName);
  if (!url) {
    toggleAskForLink();
    return;
  }
  if (globals/* AchievementsRegex */.KH.Test.achievementUrl()) {
    await getAchievementGuide(url);
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
  if (!cachedXboxAchievementGuideUrls.has(gameName)) {
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
  await addXboxAchievementGuides();
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


const individualProgress = async () => {
  if (!globals/* gameAchievements */.TM.gameAchievementsIndividualProgress) {
    return;
  }
  const hasDlc = document.querySelector(".pnl-hd.game:not(.gamer):not([data-gid]), .pnl-hd.dlc") != null;
  if (!hasDlc) {
    return;
  }
  await applyIndividualProgress();
};
/* harmony default export */ const achievements_individual_progress = ({ individualProgress });

;// CONCATENATED MODULE: ./src/features/games-improvements/achievements/add-xbox-achievement-guides.ts


/* harmony default export */ const achievements_add_xbox_achievement_guides = (async () => {
  if (!globals/* gamesImprovements */.bc.achievements.gameAchievementsShowXboxAchievementGuides) {
    return;
  }
  await addXboxAchievementGuides();
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


const individual_progress_individualProgress = async () => {
  if (!globals/* gameChallenges */.NF.gameChallengesIndividualProgress) {
    return;
  }
  await applyIndividualProgress();
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


const dlc_individual_progress_individualProgress = async () => {
  if (!globals/* gameDLC */.hi.gameDLCIndividualProgress) {
    return;
  }
  if (globals/* GamesRegex */.Rv.Test.individualDlcUrl()) {
    return;
  }
  await applyIndividualProgress();
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
const scss_styles = `:root{--ta-x-sticky-header-height: $ta-x-sticky-header-height}body.trueachievement-extras .ta-x-hide{display:none !important}@media(max-width: 1349px){body.trueachievement-extras .middle{width:100%;max-width:1200px}}@media(max-width: 1199px){body.trueachievement-extras .middle{width:auto;max-width:1200px}}@media(min-width: 576px){body.trueachievement-extras .middle .news-section.list>section.highlight{margin:5px 0}body.trueachievement-extras .middle .news-section.list>section.highlight+section.highlight{margin-top:1rem}}body.trueachievement-extras .ta-x-flex-break{flex-basis:100%;height:0;border:0;padding:0;margin:0}body.trueachievement-extras .ta-x-article-loader{text-align:center}body.trueachievement-extras .ta-x-article-loader img{width:25px;height:25px;margin:0 auto;margin-bottom:.8rem}body.trueachievement-extras [data-ta-x-loaded] .ta-x-article-loader{display:none}body.trueachievement-extras .ta-x-snackbar{visibility:hidden;min-width:250px;margin-left:-125px;background-color:#333;text-align:center;border-radius:1.5rem;padding:16px;position:fixed;z-index:1;left:50%;bottom:30px}body.trueachievement-extras .ta-x-snackbar-show{visibility:visible;animation:fadein .5s,fadeout .5s 2.5s}body.trueachievement-extras .ta-x-snackbar h2{color:#bbb;border-left:3px solid #3f67a4}body.trueachievement-extras .ta-x-snackbar h2.warning{border-color:#f57921}body.trueachievement-extras .ta-x-snackbar h2.danger{border-color:#f52721}body.trueachievement-extras .ta-x-snackbar h2.success{border-color:#58bb12}@keyframes fadein{from{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@keyframes fadeout{from{bottom:30px;opacity:1}to{bottom:0;opacity:0}}body.trueachievement-extras .ta-x-tabs-link-container{display:flex;overflow-x:auto;margin:-1rem;margin-bottom:.5rem;-ms-overflow-style:none;scrollbar-width:none}body.trueachievement-extras .ta-x-tabs-link-container li{flex-shrink:0}body.trueachievement-extras .ta-x-tabs-link-container::-webkit-scrollbar{display:none}body.trueachievement-extras .ta-x-tabs-link-container.ta-x-tabs-scroll{cursor:grabbing;transform:scale(1)}body.trueachievement-extras .ta-x-tabs-link-container.ta-x-tabs-scroll .ta-x-tabs-link{cursor:grabbing}body.trueachievement-extras .ta-x-tabs-link{padding:.6rem .75rem;user-select:none}body.trueachievement-extras .ta-x-tabs-link.ta-x-tabs-selected{border-bottom:2px solid;pointer-events:none;background:#e8e8e8}body.trueachievement-extras .ta-x-tabs-link:hover{border-bottom:2px solid;cursor:pointer}body.trueachievement-extras .ta-x-tabs-link:nth-child(1),body.trueachievement-extras .ta-x-tabs-link:nth-child(11){border-color:#58bb12}body.trueachievement-extras .ta-x-tabs-link:nth-child(2),body.trueachievement-extras .ta-x-tabs-link:nth-child(12){border-color:#2871a4}body.trueachievement-extras .ta-x-tabs-link:nth-child(3),body.trueachievement-extras .ta-x-tabs-link:nth-child(13){border-color:#cf1812}body.trueachievement-extras .ta-x-tabs-link:nth-child(4),body.trueachievement-extras .ta-x-tabs-link:nth-child(14){border-color:#c42d78}body.trueachievement-extras .ta-x-tabs-link:nth-child(5),body.trueachievement-extras .ta-x-tabs-link:nth-child(15){border-color:#9b30ff}body.trueachievement-extras .ta-x-tabs-link:nth-child(6),body.trueachievement-extras .ta-x-tabs-link:nth-child(16){border-color:#f57921}body.trueachievement-extras .ta-x-tabs-link:nth-child(7),body.trueachievement-extras .ta-x-tabs-link:nth-child(17){border-color:#294a7d}body.trueachievement-extras .ta-x-tabs-link:nth-child(8),body.trueachievement-extras .ta-x-tabs-link:nth-child(18){border-color:#000}body.trueachievement-extras .ta-x-tabs-link:nth-child(9),body.trueachievement-extras .ta-x-tabs-link:nth-child(19){border-color:#fff}body.trueachievement-extras .ta-x-tabs-link:nth-child(10),body.trueachievement-extras .ta-x-tabs-link:nth-child(20){border-color:#e9b949}body.trueachievement-extras .ta-x-tabs-content{display:none;height:10rem;overflow-y:auto;margin-right:-1rem}body.trueachievement-extras .ta-x-tabs-content[data-tab-visible]{display:flex;flex-wrap:wrap}body.trueachievement-extras [data-theme=dark] .ta-x-tabs-selected{background:#282828}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}body.trueachievement-extras .ta-x-ask-loader-container:not([data-ta-x-loaded]) article{display:block}body.trueachievement-extras .ta-x-ask-loader-container article{display:flex;justify-content:space-between}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-article-loader svg{animation-name:spin;animation-duration:2000ms;animation-iteration-count:infinite;animation-timing-function:linear;display:block;margin:auto;margin-bottom:.8rem;width:5rem}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div{display:flex;flex-direction:column}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div label{margin-bottom:.9rem}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div+input{width:100%;margin:0;margin-top:.9rem}body.trueachievement-extras .ta-x-ask-loader-container article .ta-x-ask-loader-ask>div+input:hover{margin-bottom:2px}body.trueachievement-extras .ta-x-y-show{transform:translateY(0);transition:transform .5s ease}body.trueachievement-extras .ta-x-y-hide{transform:translateY(-100%);transition:transform .5s ease}body.trueachievement-extras .ta-x-y-hide-no-transition{transform:translateY(-100%)}body.trueachievement-extras .ta-x-settings-menu-settings{max-height:547px;overflow-y:scroll !important;padding:0 1rem !important;padding-bottom:1rem !important;height:100%;position:relative}body.trueachievement-extras .ta-x-settings-menu-settings>div{display:block;padding:0}body.trueachievement-extras .ta-x-settings-menu-settings .frm-grp{user-select:none;margin-right:0}body.trueachievement-extras .ta-x-settings-menu-settings .frm-sel::after{top:10px}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings>div{flex-wrap:wrap}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings>div>label{max-width:80%}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-checkbox-help-text{font-size:1.2rem;padding-top:.5rem}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox{padding-top:1rem;border-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox>label{padding-bottom:.5rem;display:block}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst{width:100%;flex-wrap:wrap;justify-content:space-between}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst input.textbox{flex:1}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst input[type=submit]{margin-left:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst ul{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst ul li>div{display:flex;justify-content:space-between;align-items:center;width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst ul li>div p{word-break:break-all}body.trueachievement-extras .ta-x-settings-menu-settings .t-settings .ta-x-listbox .frm-lst ul li>div a{margin-left:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item{position:absolute;display:none;width:313px;padding-bottom:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item-show{display:block}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper{display:flex;flex-wrap:wrap}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper a,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper a,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper a{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h2,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h2,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h2{width:100%;line-height:unset}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h1,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h1{margin-bottom:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h2,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h2,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h2{border-top:2px solid #0e5814;border-bottom:2px solid #0e5814;padding:.5rem;font-size:1.6rem;margin:1rem 0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper p,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper p,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper p{font-size:1.4rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper{padding-bottom:0;border:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h1:not(:first-of-type){padding:.5rem 0;margin-top:1rem;border-bottom:2px solid #0552b5;border-top:2px solid #0552b5}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-documentation-wrapper h2:first-of-type{margin-top:0;margin-bottom:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper{padding-top:0;padding-bottom:0;border:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-credits-wrapper h1{border-top:2px solid #e9b949;border-bottom:2px solid #e9b949;padding:.5rem 0;margin-top:.5rem;margin-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper{border-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper h2:first-of-type{margin:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-settings-menu-changelog-wrapper ul{margin-bottom:.5rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-item .ta-x-markdown-marker{flex-basis:unset;align-self:center;padding-right:1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion{flex-wrap:wrap;border:0;padding-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion:last-of-type{padding-bottom:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header,body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body{width:100%}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header{padding:1rem;flex-shrink:unset;color:#3e4c59;cursor:pointer;user-select:none;background:#ccc}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header>label{color:#333 !important;padding:0;text-align:left;pointer-events:none;font-weight:bold}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header .frm-tgl{pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header .frm-tgl>label{padding:0;pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header span{width:100%;pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header svg{height:20px;pointer-events:none}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header.collapsed svg{transition:all .5s linear}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-header.expanded svg{transform:rotate(-180deg)}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body{max-height:0;transition:max-height .5s ease-out;overflow:hidden}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body]{border:1px solid #ccc;border-top:0;border-bottom-left-radius:1rem;border-bottom-right-radius:1rem;padding:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body] .ta-x-settings-menu-settings-accordion{margin:0;padding:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body] .ta-x-settings-menu-settings-accordion-header{border-radius:0}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion .t-settings>div{padding:1rem 0;margin:0 1rem}body.trueachievement-extras .ta-x-settings-menu-settings .ta-x-settings-menu-settings-accordion .t-settings>div:last-of-type{border:0}body.trueachievement-extras .ta-x-settings-menu-columned-setting{flex-direction:column;align-items:flex-start}body.trueachievement-extras .ta-x-settings-menu-columned-setting>div:first-of-type{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;width:100%}body.trueachievement-extras .ta-x-settings-menu-columned-setting>div:first-of-type>label{max-width:80%}body.trueachievement-extras .ta-x-settings-menu-columned-setting .frm-sel{padding-top:1rem}body.trueachievement-extras .ta-x-settings-menu-bottom{background:#4a5568;position:absolute;bottom:0;display:block;width:100%;padding:0 1rem !important}body.trueachievement-extras .ta-x-settings-menu-bottom .title{margin-bottom:0;color:#ddd;border:0}body.trueachievement-extras .ta-x-settings-menu-bottom .title a{background:unset}body.trueachievement-extras .ta-x-settings-menu-bottom .title a:hover{text-decoration:underline}body.trueachievement-extras .ta-x-settings-menu .close i{pointer-events:none}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu-bottom .buttons{border-color:#000 !important}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu-bottom .buttons a{background:#4299e1 !important}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-header{color:#ddd;background:#222}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-header>label{color:#ddd !important}body.trueachievement-extras [data-theme=dark] .ta-x-settings-menu .ta-x-settings-menu-settings-accordion-body[data-parent-accordion-body]{border-color:#222}body.trueachievement-extras .ta-x-sticky-header{position:fixed;top:0;width:100%}body.trueachievement-extras .ta-x-emojis .ta-x-tabs-content[data-tab-visible]{height:10rem;display:grid;grid-template-columns:repeat(5, 1fr);text-align:center}body.trueachievement-extras .ta-x-emojis .ta-x-tabs-content span{font-size:2.2rem;user-select:none}body.trueachievement-extras .ta-x-emojis .ta-x-tabs-content span:hover{cursor:pointer}body.trueachievement-extras.ta-x-staff-walkthrough-improvements{min-width:unset !important;overflow:auto}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main{min-height:unset !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page{position:unset;display:flex;flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector#oWalkthroughImageViewer{width:321px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .noimages,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .itemname{padding:5px;text-align:center;font-size:unset !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header{position:sticky;border-bottom:1px solid #000;display:flex;flex-direction:column;background-color:#fff}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header .noimages{margin-top:0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector a[title="Add images"]{text-align:center;padding:5px;cursor:pointer !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector a[title="Add images"]:hover{text-decoration:underline}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .imageviewer{display:flex;flex-wrap:wrap}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .imageviewer .ivimage{position:unset;margin:5px;max-width:46%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title{text-align:center;padding-top:3px;white-space:break-spaces}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-source-code-button svg{width:32px;margin-left:-10px;margin-right:-4px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .mce-ta-x-tinymce-group svg{height:20px;pointer-events:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .mce-ta-x-tinymce-group svg path{fill:#555;filter:drop-shadow(21px 21px #fff);pointer-events:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .mce-ta-x-tinymce-group svg:hover path{fill:#333}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .mce-ta-x-tinymce-group svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .mce-ta-x-tinymce-group svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark{display:block}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .mce-ta-x-tinymce-group [data-ta-x-tinymce-theme=dark] svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light{display:block}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .mce-ta-x-tinymce-group [data-ta-x-tinymce-theme=dark] svg.ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar{border-bottom:1px solid #ddd;width:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-width, 0);top:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-top, 0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header{background-color:#2f3740}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector .ta-x-sticky-header .itemname{color:#b5b9bf}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .mce-ta-x-tinymce-group svg path{fill:#b5b9bf;filter:drop-shadow(21px 21px #000)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar{border-color:#232b33}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar.ta-x-y-hide{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));transition:transform .5s ease}body.trueachievement-extras.ta-x-staff-walkthrough-improvements [data-theme=dark] .admin-page .ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar.ta-x-y-hide-no-transition{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)))}body.trueachievement-extras.ta-x-staff-walkthrough-improvements>.mce-menu.mce-floatpanel{top:var(--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-floating-menu, 0) !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements[data-ta-x-theme=dark] .jscolor-wrap .jscolor-border{border:1px solid #232b33 !important;background:#404952 !important}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divWalkthroughHolder{position:unset;margin-top:unset;height:unset;display:flex;justify-content:space-between}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .buttons{display:flex}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button{display:block;flex-grow:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough{margin:0;margin-bottom:3px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .button#btnSearchWalkthrough:hover{margin-bottom:5px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #divSearchWalkthrough .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughs,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughAchievements,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGames,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughGamers,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chWalkthroughOtherSiteLink{position:unset;top:unset;left:unset;display:block;margin:0}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #chEditWalkthrough{flex:1;margin:0 1.5rem;height:fit-content}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page #btnWalkthrough{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container{display:flex;flex-direction:column;justify-content:space-around}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container{display:flex}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions,body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview{margin-left:0;position:unset;width:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPagePreview{flex:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions{height:100%}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history{position:relative;top:var(--ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history-top, 0)}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)));transition:transform .5s ease}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions.ta-x-y-hide-no-transition{transform:translateY(calc(-1 * var(--ta-x-sticky-header-height, 0)))}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons{display:flex;justify-content:center;flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .button{flex:1}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .button:not(:first-of-type){margin-top:5px}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container #chWalkthroughPageVersions .content .buttons .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-move-buttons-to-left #chWalkthroughPagePreview .content .buttons{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements .admin-page .ta-x-staff-walkthrough-improvements-walkthrough-page-container.ta-x-staff-walkthrough-improvements-walkthrough-page-move-buttons-to-left #chWalkthroughPagePreview .content .buttons .clearboth{display:none}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main{max-width:unset}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main .admin-page .walkthroughsummary+.walkthroughpagelinks{flex-direction:column}body.trueachievement-extras.ta-x-staff-walkthrough-improvements main .admin-page .walkthroughsummary+.walkthroughpagelinks a.next{margin-left:0}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress:not([data-ta-x-loaded]) article{display:block}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article{display:flex;justify-content:space-between}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .walthroughprogress{display:flex;justify-content:center;align-items:center;width:100%}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .walthroughprogress .walkthroughauthor{margin-right:1rem}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .walthroughprogress .clearboth{display:none}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-wrapper{display:flex;flex-direction:column;justify-content:center;flex-basis:100%}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-row{display:flex;align-items:center;margin-bottom:1rem}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-row:last-of-type{margin-bottom:0}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .ta-x-forum-improvements-walkthroughs-show-owner-progress-editor{margin-left:1rem}body.trueachievement-extras.ta-x-forum-improvements .ta-x-forum-improvements-walkthroughs-show-owner-progress article .thanks{display:flex;flex-direction:column;align-items:center;padding-left:1rem;justify-content:center}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] .last,body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] .stats,body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] .author-pages,body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] .read,body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] .stack{display:none}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] p.ta-x-forum-improvements-filter-threads-title{font-weight:700;font-size:1.6rem}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] p:not(.ta-x-forum-improvements-filter-threads-title){display:none}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=true] a.ta-x-forum-improvements-filter-threads-unhide{font-size:1.4rem}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=false] p.ta-x-forum-improvements-filter-threads-title{display:none}body.trueachievement-extras.ta-x-forum-improvements [data-thread-hidden=false] a.ta-x-forum-improvements-filter-threads-unhide{display:none}body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer .ta-x-xboxachievements-icon{width:36px;height:36px}@media(min-width: 768px){body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer .ta-x-xboxachievements-icon{width:70px;height:70px}}body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer a{flex:none}@media(min-width: 768px){body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer svg{margin-bottom:1rem}}@media(max-width: 767px){body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer svg{margin-right:1rem}}@media(max-width: 767px){body.trueachievement-extras .ta-x-games-improvements-achievements-achievement-guide.gamer>.info{display:block;margin-left:1rem}}@media(max-width: 575px){body.trueachievement-extras a.ta-x-game-achievements-achievement-leaderboard-links{display:none}}@media(min-width: 576px){body.trueachievement-extras div.ta-x-game-achievements-achievement-leaderboard-links{display:none}}`;
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